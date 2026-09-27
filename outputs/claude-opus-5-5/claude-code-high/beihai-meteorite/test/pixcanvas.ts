// A tiny pixel-accurate 2D canvas: enough for skin painting and gradient sprites.
type Stop = [number, [number, number, number, number]];

function parseColor(s: string): [number, number, number, number] {
  s = s.trim();
  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(",").map((x) => parseFloat(x));
    return [p[0], p[1], p[2], Math.round((p[3] ?? 1) * 255)];
  }
  return [255, 255, 255, 255];
}

class Gradient {
  stops: Stop[] = [];
  constructor(public kind: "radial" | "linear", public args: number[]) {}
  addColorStop(o: number, c: string) {
    this.stops.push([o, parseColor(c)]);
    this.stops.sort((a, b) => a[0] - b[0]);
  }
  at(x: number, y: number): [number, number, number, number] {
    let t: number;
    if (this.kind === "radial") {
      const [x0, y0, r0, , , r1] = this.args;
      t = (Math.hypot(x - x0, y - y0) - r0) / (r1 - r0);
    } else {
      const [x0, y0, x1, y1] = this.args;
      const dx = x1 - x0, dy = y1 - y0;
      t = ((x - x0) * dx + (y - y0) * dy) / (dx * dx + dy * dy);
    }
    t = Math.max(0, Math.min(1, t));
    const s = this.stops;
    if (!s.length) return [0, 0, 0, 0];
    if (t <= s[0][0]) return s[0][1];
    for (let i = 1; i < s.length; i++) {
      if (t <= s[i][0]) {
        const k = (t - s[i - 1][0]) / Math.max(1e-6, s[i][0] - s[i - 1][0]);
        const a = s[i - 1][1], b = s[i][1];
        return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k];
      }
    }
    return s[s.length - 1][1];
  }
}

export class PixCanvas {
  private w = 300;
  private h = 150;
  data = new Uint8ClampedArray(300 * 150 * 4);
  style: any = {};
  private ctx: any;
  get width() { return this.w; }
  set width(v: number) { this.w = v; this.data = new Uint8ClampedArray(this.w * this.h * 4); }
  get height() { return this.h; }
  set height(v: number) { this.h = v; this.data = new Uint8ClampedArray(this.w * this.h * 4); }
  addEventListener() {}
  getContext() {
    if (this.ctx) return this.ctx;
    const cv = this;
    const target: any = {
      canvas: cv,
      fillStyle: "#000" as string | Gradient,
      imageSmoothingEnabled: false,
      fillRect(x: number, y: number, w: number, h: number) {
        const fs = target.fillStyle;
        const solid = typeof fs === "string" ? parseColor(fs) : null;
        for (let j = Math.max(0, Math.floor(y)); j < Math.min(cv.h, Math.ceil(y + h)); j++) {
          for (let i = Math.max(0, Math.floor(x)); i < Math.min(cv.w, Math.ceil(x + w)); i++) {
            const c = solid ?? (fs as Gradient).at(i + 0.5, j + 0.5);
            const o = (j * cv.w + i) * 4;
            const a = c[3] / 255;
            const da = cv.data[o + 3] / 255;
            const oa = a + da * (1 - a);
            for (let k = 0; k < 3; k++) cv.data[o + k] = oa > 0 ? (c[k] * a + cv.data[o + k] * da * (1 - a)) / oa : 0;
            cv.data[o + 3] = oa * 255;
          }
        }
      },
      clearRect(x: number, y: number, w: number, h: number) {
        for (let j = Math.max(0, y); j < Math.min(cv.h, y + h); j++)
          for (let i = Math.max(0, x); i < Math.min(cv.w, x + w); i++) cv.data.fill(0, (j * cv.w + i) * 4, (j * cv.w + i) * 4 + 4);
      },
      getImageData(x: number, y: number, w: number, h: number) {
        const out = new Uint8ClampedArray(w * h * 4);
        for (let j = 0; j < h; j++) out.set(cv.data.subarray(((y + j) * cv.w + x) * 4, ((y + j) * cv.w + x + w) * 4), j * w * 4);
        return { data: out, width: w, height: h };
      },
      putImageData(img: any, x: number, y: number) {
        for (let j = 0; j < img.height; j++) cv.data.set(img.data.subarray(j * img.width * 4, (j + 1) * img.width * 4), ((y + j) * cv.w + x) * 4);
      },
      createRadialGradient: (...a: number[]) => new Gradient("radial", a),
      createLinearGradient: (...a: number[]) => new Gradient("linear", a),
      measureText: (s: string) => ({ width: s.length * 8 }),
    };
    this.ctx = new Proxy(target, {
      get(t, p) { return p in t ? t[p] : () => {}; },
      set(t, p, v) { t[p] = v; return true; },
    });
    return this.ctx;
  }
}

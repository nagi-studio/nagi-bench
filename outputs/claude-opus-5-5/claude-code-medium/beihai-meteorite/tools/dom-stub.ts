/* Minimal DOM + 2D canvas with real pixel buffers, for headless checks. */

type RGBA = [number, number, number, number];

function parseColor(c: unknown): RGBA {
  if (typeof c !== "string") return [255, 255, 255, 255];
  const s = c.trim();
  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    const n = parseInt(h.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1]!.split(",").map((x) => parseFloat(x));
    return [p[0]!, p[1]!, p[2]!, p.length > 3 ? Math.round(p[3]! * 255) : 255];
  }
  return [255, 255, 255, 255];
}

class Gradient {
  stops: Array<[number, RGBA]> = [];
  constructor(public kind: "linear" | "radial", public a: number[]) {}
  addColorStop(o: number, c: string) { this.stops.push([o, parseColor(c)]); this.stops.sort((x, y) => x[0] - y[0]); }
  at(x: number, y: number): RGBA {
    let t: number;
    if (this.kind === "linear") {
      const [x0, y0, x1, y1] = this.a as [number, number, number, number];
      const dx = x1 - x0, dy = y1 - y0;
      t = ((x - x0) * dx + (y - y0) * dy) / (dx * dx + dy * dy || 1);
    } else {
      const [x0, y0, r0, , , r1] = this.a as [number, number, number, number, number, number];
      t = (Math.hypot(x - x0, y - y0) - r0) / (r1 - r0 || 1);
    }
    t = Math.max(0, Math.min(1, t));
    const s = this.stops;
    if (!s.length) return [0, 0, 0, 0];
    if (t <= s[0]![0]) return s[0]![1];
    for (let i = 1; i < s.length; i++) {
      if (t <= s[i]![0]) {
        const [o0, c0] = s[i - 1]!, [o1, c1] = s[i]!;
        const k = (t - o0) / (o1 - o0 || 1);
        return [0, 1, 2, 3].map((j) => c0[j]! + (c1[j]! - c0[j]!) * k) as RGBA;
      }
    }
    return s[s.length - 1]![1];
  }
}

export class Ctx2D {
  fillStyle: unknown = "#000";
  strokeStyle: unknown = "#000";
  lineWidth = 1;
  font = "";
  textAlign = "";
  textBaseline = "";
  imageSmoothingEnabled = true;
  globalAlpha = 1;
  private path: Array<[number, number]> = [];
  private arcs: Array<[number, number, number]> = [];
  constructor(public canvas: StubCanvas) {}
  private get d() { return this.canvas.data; }
  private blend(x: number, y: number, c: RGBA) {
    const W = this.canvas.width, H = this.canvas.height;
    x = Math.floor(x); y = Math.floor(y);
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 4;
    const a = (c[3] / 255) * this.globalAlpha;
    const d = this.d;
    const da = d[i + 3]! / 255;
    const oa = a + da * (1 - a);
    if (oa <= 0) { d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0; return; }
    for (let k = 0; k < 3; k++) d[i + k] = (c[k]! * a + d[i + k]! * da * (1 - a)) / oa;
    d[i + 3] = oa * 255;
  }
  private colorAt(style: unknown, x: number, y: number): RGBA {
    return style instanceof Gradient ? style.at(x + 0.5, y + 0.5) : parseColor(style);
  }
  fillRect(x: number, y: number, w: number, h: number) {
    const x0 = Math.max(0, Math.round(x)), y0 = Math.max(0, Math.round(y));
    const x1 = Math.min(this.canvas.width, Math.round(x + w)), y1 = Math.min(this.canvas.height, Math.round(y + h));
    for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) this.blend(xx, yy, this.colorAt(this.fillStyle, xx, yy));
  }
  clearRect(x: number, y: number, w: number, h: number) {
    const W = this.canvas.width;
    for (let yy = Math.max(0, Math.round(y)); yy < Math.min(this.canvas.height, Math.round(y + h)); yy++)
      for (let xx = Math.max(0, Math.round(x)); xx < Math.min(W, Math.round(x + w)); xx++) this.d.fill(0, (yy * W + xx) * 4, (yy * W + xx) * 4 + 4);
  }
  getImageData(x: number, y: number, w: number, h: number) {
    const out = new Uint8ClampedArray(w * h * 4);
    const W = this.canvas.width;
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const si = ((y + yy) * W + (x + xx)) * 4, di = (yy * w + xx) * 4;
      for (let k = 0; k < 4; k++) out[di + k] = this.d[si + k]!;
    }
    return { data: out, width: w, height: h };
  }
  createImageData(w: number, h: number) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; }
  putImageData(img: { data: Uint8ClampedArray; width: number; height: number }, x: number, y: number) {
    const W = this.canvas.width;
    for (let yy = 0; yy < img.height; yy++) for (let xx = 0; xx < img.width; xx++) {
      const di = ((y + yy) * W + (x + xx)) * 4, si = (yy * img.width + xx) * 4;
      for (let k = 0; k < 4; k++) this.d[di + k] = img.data[si + k]!;
    }
  }
  createLinearGradient(...a: number[]) { return new Gradient("linear", a); }
  createRadialGradient(...a: number[]) { return new Gradient("radial", a); }
  fillText() { /* text not rasterised in stub */ }
  measureText() { return { width: 10 }; }
  beginPath() { this.path = []; this.arcs = []; }
  moveTo(x: number, y: number) { this.path.push([x, y]); }
  lineTo(x: number, y: number) { this.path.push([x, y]); }
  arc(x: number, y: number, r: number) { this.arcs.push([x, y, r]); }
  closePath() {}
  fill() {
    for (const [cx, cy, r] of this.arcs) {
      for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) {
        if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r) this.blend(x, y, this.colorAt(this.fillStyle, x, y));
      }
    }
  }
  stroke() {
    for (let i = 1; i < this.path.length; i++) {
      const [x0, y0] = this.path[i - 1]!, [x1, y1] = this.path[i]!;
      const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0)) + 1;
      for (let k = 0; k <= n; k++) this.blend(x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n, this.colorAt(this.strokeStyle, x0, y0));
    }
  }
  save() {}
  restore() {}
  translate() {}
  rotate() {}
  scale() {}
  drawImage() {}
}

export class StubCanvas {
  width = 300;
  height = 150;
  style: Record<string, string> = {};
  private _data: Uint8ClampedArray | null = null;
  private _w = 0;
  private _h = 0;
  private ctx: Ctx2D | null = null;
  get data(): Uint8ClampedArray {
    if (!this._data || this._w !== this.width || this._h !== this.height) {
      this._data = new Uint8ClampedArray(this.width * this.height * 4);
      this._w = this.width; this._h = this.height;
    }
    return this._data;
  }
  getContext(kind: string) {
    if (kind !== "2d") return null;
    this.ctx ??= new Ctx2D(this);
    return this.ctx;
  }
  addEventListener() {}
  removeEventListener() {}
  setAttribute() {}
}

export function installDom() {
  const g = globalThis as Record<string, unknown>;
  const elements: Record<string, unknown> = {};
  const makeEl = (tag: string) => {
    if (tag === "canvas") return new StubCanvas();
    const el: Record<string, unknown> = {
      tagName: tag, style: {}, children: [], className: "", innerHTML: "", textContent: "",
      classList: { add() {}, remove() {}, contains: () => false },
      appendChild(c: unknown) { (el.children as unknown[]).push(c); return c; },
      addEventListener() {}, removeEventListener() {}, setAttribute() {}, remove() {},
      querySelector: () => makeEl("div"),
      contains: () => true,
      clientWidth: 960, clientHeight: 540,
    };
    return el;
  };
  g.document = {
    createElement: makeEl,
    querySelector: (s: string) => (elements[s] ??= makeEl("div")),
    body: makeEl("body"),
  };
  g.window = g;
  g.devicePixelRatio = 1;
  g.innerWidth = 960;
  g.innerHeight = 540;
  g.requestAnimationFrame = (cb: (t: number) => void) => setTimeout(() => cb(performance.now()), 16) as unknown as number;
  g.cancelAnimationFrame = (h: number) => clearTimeout(h);
}

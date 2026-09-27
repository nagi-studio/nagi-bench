// Minimal DOM shims so the scene code can run headless under Bun.
import { plugin } from "bun";

plugin({
  name: "inline-audio",
  setup(build) {
    build.onLoad({ filter: /\.ogg(\?inline)?$/ }, async (args) => {
      const bytes = await Bun.file(args.path.replace(/\?inline$/, "")).arrayBuffer();
      const b64 = Buffer.from(bytes).toString("base64");
      return { contents: `export default ${JSON.stringify(`data:audio/ogg;base64,${b64}`)};`, loader: "js" };
    });
  },
});

function fakeCtx(canvas: any): any {
  const store = new Map<string, Uint8ClampedArray>();
  const gradient = { addColorStop() {} };
  const target: any = {
    canvas,
    getImageData(x: number, y: number, w: number, h: number) {
      const key = `${x},${y},${w},${h}`;
      return { data: store.get(key) ?? new Uint8ClampedArray(w * h * 4).fill(200), width: w, height: h };
    },
    putImageData(img: any, x: number, y: number) {
      store.set(`${x},${y},${img.width},${img.height}`, img.data);
    },
    createRadialGradient: () => gradient,
    createLinearGradient: () => gradient,
    measureText: (s: string) => ({ width: s.length * 8 }),
  };
  return new Proxy(target, {
    get(t, p) {
      if (p in t) return t[p];
      return () => {};
    },
    set(t, p, v) {
      t[p] = v;
      return true;
    },
  });
}

class FakeCanvas {
  width = 300;
  height = 150;
  style: any = {};
  private ctx: any;
  getContext() {
    return (this.ctx ??= fakeCtx(this));
  }
  addEventListener() {}
}

(globalThis as any).document = {
  createElement: (tag: string) => {
    if (tag === "canvas") return new FakeCanvas();
    return { style: {}, appendChild() {}, setAttribute() {}, addEventListener() {} };
  },
  createElementNS: () => new FakeCanvas(),
};
(globalThis as any).window = globalThis;
(globalThis as any).requestAnimationFrame = () => 0;
(globalThis as any).cancelAnimationFrame = () => {};

import { plugin } from "bun";
import { PixCanvas } from "./pixcanvas";

plugin({
  name: "inline-audio",
  setup(build) {
    build.onLoad({ filter: /\.ogg(\?inline)?$/ }, async (args) => {
      const bytes = await Bun.file(args.path.replace(/\?inline$/, "")).arrayBuffer();
      return { contents: `export default ${JSON.stringify(`data:audio/ogg;base64,${Buffer.from(bytes).toString("base64")}`)};`, loader: "js" };
    });
  },
});

(globalThis as any).document = {
  createElement: (tag: string) => (tag === "canvas" ? new PixCanvas() : { style: {}, appendChild() {}, setAttribute() {}, addEventListener() {} }),
  createElementNS: () => new PixCanvas(),
};
(globalThis as any).window = globalThis;
(globalThis as any).requestAnimationFrame = () => 0;
(globalThis as any).cancelAnimationFrame = () => {};

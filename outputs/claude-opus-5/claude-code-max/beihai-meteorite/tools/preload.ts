import { plugin } from "bun";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

/**
 * Bun 侧的 Vite 替身：只处理两件 Vite 才会做的事 —— `?inline` 的音频
 * 和被 import 的 CSS。这样自检脚本可以直接跑 src 里的真实代码。
 */
plugin({
  name: "vite-shims",
  setup(build) {
    build.onResolve({ filter: /\?inline$/ }, (args) => ({
      path: resolve(dirname(args.importer), args.path.replace(/\?inline$/, "")),
      namespace: "inline-asset",
    }));
    build.onLoad({ filter: /.*/, namespace: "inline-asset" }, (args) => {
      const base64 = readFileSync(args.path).toString("base64");
      return {
        contents: `export default ${JSON.stringify(`data:audio/ogg;base64,${base64}`)};`,
        loader: "js",
      };
    });
    build.onResolve({ filter: /\.css$/ }, (args) => ({
      path: resolve(dirname(args.importer), args.path),
      namespace: "css-stub",
    }));
    build.onLoad({ filter: /.*/, namespace: "css-stub" }, () => ({
      contents: "export default {};",
      loader: "js",
    }));
  },
});

import { defineConfig } from "vite";

export default defineConfig({
  // 相对路径，使 dist/index.html 也能直接从文件系统打开。
  base: "./",
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 8000,
  },
});

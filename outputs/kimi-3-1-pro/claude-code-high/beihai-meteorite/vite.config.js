import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  cacheDir: ".vite-cache",
  configLoader: "runner",
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    target: "es2022",
    sourcemap: false,
  },
});

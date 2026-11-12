import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  cacheDir: ".vite-cache",
  build: {
    target: "es2020",
    outDir: "dist",
    assetsDir: "assets",
    chunkSizeWarningLimit: 4000,
  },
});

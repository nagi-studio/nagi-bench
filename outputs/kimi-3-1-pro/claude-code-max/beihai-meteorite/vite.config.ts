import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  cacheDir: "./.vite-cache",
  configLoader: "runner",
  build: {
    chunkSizeWarningLimit: 700,
  },
});

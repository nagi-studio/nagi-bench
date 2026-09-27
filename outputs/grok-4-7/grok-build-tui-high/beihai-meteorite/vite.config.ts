import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  cacheDir: "/tmp/vite-meteorite",
  build: {
    target: "es2022",
    sourcemap: false,
    chunkSizeWarningLimit: 4096,
  },
});

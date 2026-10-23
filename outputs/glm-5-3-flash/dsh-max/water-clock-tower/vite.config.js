import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 4000,
    assetsInlineLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});

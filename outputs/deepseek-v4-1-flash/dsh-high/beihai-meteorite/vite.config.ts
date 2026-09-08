import { defineConfig } from "vite";

// The film is a single, self-contained procedural scene. We build to a classic
// (non-module) bundle with relative asset paths so the result also opens
// correctly from a static host or a local file without a module server.
export default defineConfig({
  base: "./",
  build: {
    target: "es2020",
    outDir: "dist",
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 4096,
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "assets/film.js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  },
  server: {
    host: true,
    port: 5173
  }
});

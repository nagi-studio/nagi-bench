import { defineConfig } from "vite";

// Standard Vite static build. The runtime packages are TypeScript source resolved
// directly by Vite; no custom post-build inlining is performed.
export default defineConfig({
  base: "./",
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 4096,
    rollupOptions: {
      output: {
        // Keep three.js in its own chunk so the film code stays readable.
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
        },
      },
    },
  },
});

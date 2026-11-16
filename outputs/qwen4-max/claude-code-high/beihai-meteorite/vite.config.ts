import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "es2022",
    outDir: "dist",
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 2000,
  },
  optimizeDeps: {
    include: ["three", "@agentbench/cinematic-player", "@agentbench/voxel-kit"],
  },
});
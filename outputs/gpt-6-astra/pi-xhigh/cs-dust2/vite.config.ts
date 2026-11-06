import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    // three.js includes procedural bevel/shape triangulation; its dedicated vendor chunk is ~507 kB.
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: { manualChunks: { three: ['three'], react: ['react', 'react-dom'] } },
    },
  },
});

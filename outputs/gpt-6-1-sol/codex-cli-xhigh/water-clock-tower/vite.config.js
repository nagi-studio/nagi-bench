import { defineConfig } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';

export default defineConfig({
  base: './',
  cacheDir: '.vite-cache',
  build: {
    target: 'es2020',
    modulePreload: false,
    rollupOptions: { output: { format: 'iife', name: 'WaterClockFilm' } },
    chunkSizeWarningLimit: 1200,
  },
  plugins: [{
    name: 'offline-file-script',
    apply: 'build',
    closeBundle() {
      const path = new URL('./dist/index.html', import.meta.url);
      // A classic IIFE also runs from file://; ES module entrypoints do not.
      const html = readFileSync(path, 'utf8').replace(/type="module"\s*/g, 'defer ').replace(/crossorigin\s*/g, '');
      writeFileSync(path, html);
    },
  }],
});

import { defineConfig } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
export default defineConfig({
  base: './', cacheDir: './.vite-cache',
  build: {
    target: 'es2020', chunkSizeWarningLimit: 1000, modulePreload: false,
    rolldownOptions: { output: { format: 'iife', codeSplitting: false } }
  },
  plugins: [{
    name: 'offline-file-entry',
    async closeBundle() {
      // A classic IIFE entry can also run when index.html is double-clicked.
      // ES module entries are otherwise blocked by file:// CORS in Chromium.
      const path = new URL('./dist/index.html', import.meta.url);
      const html = await readFile(path, 'utf8');
      await writeFile(path, html.replace(/type="module"\s*/g, 'defer ').replace(/\s+crossorigin(?:="[^"]*")?/g, ''));
    }
  }]
});

import { defineConfig } from 'vite';

// Emit a classic (non-module) script so dist/index.html also works when opened
// directly from disk via file:// (browsers block module scripts there).
const classicScript = {
  name: 'classic-script',
  enforce: 'post',
  transformIndexHtml(html) {
    return html.replace(/<script type="module" crossorigin src=/g, '<script defer src=').replace(/ crossorigin/g, '');
  },
};

export default defineConfig({
  base: './',
  plugins: [classicScript],
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 2000,
    modulePreload: false,
    rollupOptions: { output: { format: 'iife' } },
  },
});

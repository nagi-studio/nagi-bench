import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'assets/water-clock.js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  plugins: [{
    name: 'offline-file-protocol',
    transformIndexHtml(html) {
      return html
        .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script defer src="$1"></script>')
        .replace(/<script type="module" crossorigin><\/script>/, '');
    },
  }],
});

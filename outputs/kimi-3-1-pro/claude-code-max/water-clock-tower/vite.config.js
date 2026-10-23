import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [{
    name: 'offline-file-script',
    transformIndexHtml(html) {
      // The production bundle has no imports; a deferred classic script also
      // works when index.html is opened directly through file://.
      return html.replace('type="module" crossorigin', 'defer').replace('rel="stylesheet" crossorigin', 'rel="stylesheet"');
    },
  }],
  build: {
    target: 'es2022',
    modulePreload: false,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 2500,
  },
});

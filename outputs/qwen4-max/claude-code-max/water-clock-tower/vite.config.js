import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 8000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});

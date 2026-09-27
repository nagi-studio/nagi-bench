import { defineConfig } from 'vite';
export default defineConfig({ base: './', cacheDir: '.vite-cache', build: { target: 'es2022', assetsInlineLimit: 0 } });

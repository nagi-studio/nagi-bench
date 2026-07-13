import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `bun run build:single` — inlines all JS/CSS into one self-contained HTML
// (dist/index.html), which is what ships as dust2-arena.html.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
});

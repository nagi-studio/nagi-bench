import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps asset URLs relative so the built dist/ also works when opened
// straight from the filesystem.
export default defineConfig({
  base: './',
  plugins: [react()],
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base './' so the built single file works when served from any subpath
// (the benchmark site inlines the bundle at deploy time).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
})

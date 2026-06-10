import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served at https://bench.nagi.fun/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  // model registrations live at the repo root (../models), outside the Vite root
  server: { fs: { allow: ['..'] } },
})

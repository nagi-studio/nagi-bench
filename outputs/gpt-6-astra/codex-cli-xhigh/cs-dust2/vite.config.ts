import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: '0.0.0.0', watch: { ignored: ['**/.cache/**'] } },
  build: { target: 'es2022', chunkSizeWarningLimit: 650, rollupOptions: { output: { manualChunks: { three: ['three'], react: ['react', 'react-dom'] } } } },
});

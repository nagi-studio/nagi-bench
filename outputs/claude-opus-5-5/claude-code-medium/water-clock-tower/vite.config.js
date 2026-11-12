import { defineConfig } from 'vite';

// 构建为单个经典脚本（IIFE），这样直接双击 dist/index.html（file:// 协议）也能运行：
// 浏览器会拦截 file:// 下的 <script type="module">，而经典脚本不受此限制。
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 4000,
    modulePreload: false,
    rollupOptions: {
      output: { format: 'iife' },
    },
  },
  plugins: [
    {
      name: 'classic-script-for-file-protocol',
      enforce: 'post',
      transformIndexHtml(html) {
        return html
          .replace(/<script type="module" crossorigin/g, '<script defer')
          .replace(/<script type="module"/g, '<script defer')
          .replace(/ crossorigin/g, '');
      },
    },
  ],
});

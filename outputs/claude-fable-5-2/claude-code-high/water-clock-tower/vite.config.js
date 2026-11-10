import { defineConfig } from 'vite';

// 产物为经典脚本（IIFE），因此 dist/index.html 既可经任意静态服务器访问，
// 也可以直接用 file:// 双击打开（ES module 在 file:// 下会被浏览器的 CORS 策略拦截）。
const classicScript = () => ({
  name: 'classic-script',
  enforce: 'post',
  transformIndexHtml(html) {
    return html
      .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/g, '<script defer src="$1"></script>')
      .replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/g, '<link rel="stylesheet" href="$1">');
  },
});

export default defineConfig({
  base: './',
  plugins: [classicScript()],
  build: {
    target: 'es2020',
    modulePreload: false,
    chunkSizeWarningLimit: 6000,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'assets/app-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});

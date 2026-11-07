import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Inline all emitted JS/CSS assets into dist/index.html so the page runs
 *  offline as a single file (file:// included), with no network resources. */
function inlineAll(): Plugin {
  return {
    name: 'inline-all',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const htmlKey = Object.keys(bundle).find((k) => k.endsWith('.html'));
      if (!htmlKey) return;
      const htmlAsset = bundle[htmlKey];
      if (htmlAsset.type !== 'asset') return;
      let html = String(htmlAsset.source);
      for (const key of Object.keys(bundle)) {
        const item = bundle[key];
        const isJs = key.endsWith('.js');
        const isCss = key.endsWith('.css');
        if (!isJs && !isCss) continue;
        const needle = 'src="./' + key + '"';
        const needleCss = 'href="./' + key + '"';
        if (isJs && html.includes(needle)) {
          const code = item.type === 'chunk' ? item.code : String(item.source);
          const safe = code.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
          const re = new RegExp('<script[^>]*' + needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^>]*></script>');
          html = html.replace(re, () => '<script type="module">\n' + safe + '\n</script>');
          delete bundle[key];
        } else if (isCss && html.includes(needleCss)) {
          const css = String(item.source).replace(/<\/style/gi, '<\\/style');
          const re = new RegExp('<link[^>]*' + needleCss.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^>]*>');
          html = html.replace(re, () => '<style>\n' + css + '\n</style>');
          delete bundle[key];
        }
      }
      htmlAsset.source = html;
    }
  };
}

export default defineConfig({
  plugins: [react(), inlineAll()],
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});

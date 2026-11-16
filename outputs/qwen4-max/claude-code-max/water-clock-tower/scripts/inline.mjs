// 将 Vite 产物中的 JS/CSS 内联进 dist/index.html，使其可 file:// 离线直接打开。
// （Rapier compat 已将 WASM 内联为 base64，无外部资源依赖。）
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const dist = 'dist';
const html = await readFile(join(dist, 'index.html'), 'utf8');
const assets = await readdir(join(dist, 'assets'));
const jsFile = assets.find(f => f.endsWith('.js'));
const cssFile = assets.find(f => f.endsWith('.css'));

let out = html;
if (cssFile) {
  const css = await readFile(join(dist, 'assets', cssFile), 'utf8');
  out = out.replace(/<link[^>]*rel="stylesheet"[^>]*>/, () => `<style>${css}</style>`);
}
if (jsFile) {
  let js = await readFile(join(dist, 'assets', jsFile), 'utf8');
  js = js.replace(/<\/script>/g, '<\\/script>').replace(/<!--/g, '<\\!--');
  out = out.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/, () => `<script type="module">${js}</script>`);
}
await writeFile(join(dist, 'index.html'), out);
console.log('[inline] dist/index.html 已内联 JS/CSS，可离线双击打开');

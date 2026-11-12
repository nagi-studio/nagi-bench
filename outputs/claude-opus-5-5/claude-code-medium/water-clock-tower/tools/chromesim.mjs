// 在无头 Chromium（V8）中运行物理测试，与浏览器实际行为一致
// usage: bun tools/chromesim.mjs '[{...}]'   （或参数为 @file）
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { join, extname, resolve, normalize } from 'node:path';
let arg = process.argv[2] || '[{}]';
if (arg.startsWith('@')) arg = await readFile(arg.slice(1), 'utf8');
const root = resolve('dist');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm' };
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  let p = normalize(decodeURIComponent(url.pathname));
  if (p.endsWith('/')) p += 'index.html';
  try { await route.fulfill({ status: 200, body: await readFile(join(root, p)), contentType: TYPES[extname(p)] ?? 'application/octet-stream' }); }
  catch { await route.fulfill({ status: 404, body: 'nf' }); }
});
await page.goto('http://x.local/?simtest=' + encodeURIComponent(arg.trim()));
const res = await page.waitForFunction(() => window.__simtest, null, { timeout: 600000, polling: 500 }).then((h) => h.jsonValue());
for (const r of res) {
  const iv = r.steps.map((t, i) => (i ? (t - r.steps[i - 1]).toFixed(2) : t.toFixed(2)));
  console.log(JSON.stringify(r.opts), '\n  steps', r.steps.length, 'final', r.final, '\n  intervals', iv.join(' '), '\n  bells', r.bells.join(' '));
}
await browser.close();

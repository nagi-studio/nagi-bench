// 渲染开销测量：bun tools/perf.mjs "<hash>"  → 首帧耗时 + 各镜头单帧渲染耗时（含 gl.finish）
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, normalize } from 'node:path';
const BROWSER = '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };
const root = resolve('dist'); const hash = process.argv[2] ?? '';
const browser = await chromium.launch({ executablePath: BROWSER, chromiumSandbox: false, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (m) => { const t = m.text(); if (/boot|error/i.test(t)) console.log(t); });
page.on('pageerror', (e) => console.log(`[pageerror] ${e.stack ?? e.message}`));
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url()); let path = normalize(decodeURIComponent(url.pathname)); if (path.endsWith('/')) path += 'index.html';
  try { await route.fulfill({ status: 200, body: await readFile(join(root, path)), contentType: TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream' }); } catch { await route.fulfill({ status: 404, body: 'nf' }); }
});
const t0 = Date.now();
await page.goto('http://preview.local/#perf' + hash, { waitUntil: 'load' });
await page.waitForFunction(() => window.__film && window.__film.ready, null, { timeout: 180000 });
console.log(`${hash || '(default)'}: ready after ${Date.now() - t0} ms`);
let line = '';
for (const T of [1, 3.5, 7, 12, 17, 21, 23, 26, 31]) {
  await page.evaluate((t) => window.__film.seek(t), T);
  const ms = await page.evaluate(() => { const f = window.__film; f.timeRender(); const a = f.timeRender(), b = f.timeRender(); return Math.min(a, b); });
  line += ` T${T}:${ms.toFixed(0)}`;
}
console.log('  render ms per frame →' + line);
await browser.close();

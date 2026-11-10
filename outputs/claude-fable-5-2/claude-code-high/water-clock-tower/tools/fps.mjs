// 软件渲染环境下的实时帧率：bun tools/fps.mjs <hash>
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, normalize } from 'node:path';
const BROWSER = '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };
const root = resolve('dist'); const hash = process.argv[2] ?? '';
const browser = await chromium.launch({ executablePath: BROWSER, chromiumSandbox: false, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (e) => console.log(`[pageerror] ${e.stack ?? e.message}`));
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url()); let path = normalize(decodeURIComponent(url.pathname)); if (path.endsWith('/')) path += 'index.html';
  try { await route.fulfill({ status: 200, body: await readFile(join(root, path)), contentType: TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream' }); } catch { await route.fulfill({ status: 404, body: 'nf' }); }
});
const t0 = Date.now();
await page.goto('http://preview.local/#' + hash, { waitUntil: 'load' });
await page.waitForFunction(() => window.__film && window.__film.ready, null, { timeout: 180000 });
const ready = Date.now() - t0; let line = '';
for (let i = 0; i < 5; i++) {
  const f0 = await page.evaluate(() => window.__film.frames); const w0 = Date.now(); await page.waitForTimeout(5000);
  const f1 = await page.evaluate(() => ({ f: window.__film.frames, T: window.__film.T })); line += ` T${f1.T.toFixed(0)}:${((f1.f - f0) / ((Date.now() - w0) / 1000)).toFixed(1)}`;
}
console.log(`${hash || '(default)'}: ready ${ready} ms; fps →${line}`);
await browser.close();

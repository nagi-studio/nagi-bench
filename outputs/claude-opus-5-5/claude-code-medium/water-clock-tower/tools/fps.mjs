import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { join, extname, resolve, normalize } from 'node:path';
const root = resolve('dist');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm' };
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => console.log('[console]', m.text()));
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  let p = normalize(decodeURIComponent(url.pathname));
  if (p.endsWith('/')) p += 'index.html';
  try { await route.fulfill({ status: 200, body: await readFile(join(root, p)), contentType: TYPES[extname(p)] ?? 'application/octet-stream' }); }
  catch { await route.fulfill({ status: 404, body: 'nf' }); }
});
const t0 = Date.now();
await page.goto('http://x.local/?perf=1' + (process.argv[2] || ''));
for (let i = 0; i < 8; i++) {
  await page.waitForTimeout(4000);
  const s = await page.evaluate(() => window.__stats);
  console.log(((Date.now() - t0) / 1000).toFixed(1), JSON.stringify(s));
}
await browser.close();

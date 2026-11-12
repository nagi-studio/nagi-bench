import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { join, extname, resolve, normalize } from 'node:path';
const root = resolve('dist');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm' };
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false, args: ['--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => console.log('[console]', m.text()));
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  let p = normalize(decodeURIComponent(url.pathname));
  if (p.endsWith('/')) p += 'index.html';
  try { await route.fulfill({ status: 200, body: await readFile(join(root, p)), contentType: TYPES[extname(p)] ?? 'application/octet-stream' }); }
  catch { await route.fulfill({ status: 404, body: 'nf' }); }
});
await page.goto('http://x.local/?audiotest=1');
const res = await page.waitForFunction(() => window.__audiotest, null, { timeout: 600000, polling: 500 }).then((h) => h.jsonValue());
console.log(JSON.stringify(res));
await browser.close();

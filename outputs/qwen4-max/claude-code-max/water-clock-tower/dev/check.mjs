import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const BROWSER = '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell';
const root = process.argv[2] ?? 'dist';
const browser = await chromium.launch({ executablePath: BROWSER, chromiumSandbox: false,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', m => console.log(`[${m.type()}]`, m.text()));
page.on('pageerror', e => console.log('[pageerror]', String(e), '|', e && e.name, '|', e && e.message, '|', e && e.stack));
await page.addInitScript(() => {
  window.addEventListener('error', ev => console.log('[winerror]', ev.message, ev.filename, ev.lineno, ev.colno, ev.error && ev.error.stack));
  window.addEventListener('unhandledrejection', ev => console.log('[reject]', String(ev.reason), ev.reason && ev.reason.stack));
});
await page.route('**/*', async route => {
  const url = new URL(route.request().url());
  let p = normalize(decodeURIComponent(url.pathname));
  if (p.endsWith('/')) p += 'index.html';
  const file = join(root, p);
  try { const body = await readFile(file);
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm' };
    await route.fulfill({ status: 200, body, contentType: types[extname(file)] ?? 'application/octet-stream' });
  } catch { await route.fulfill({ status: 404, body: 'nf' }); }
});
await page.goto('http://preview.local/', { waitUntil: 'load' });
await page.waitForTimeout(Number(process.argv[3] ?? 4000));
await page.screenshot({ path: process.argv[4] ?? 'preview/check.png' });
await browser.close();

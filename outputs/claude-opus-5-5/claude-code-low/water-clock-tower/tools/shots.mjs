// usage: bun tools/shots.mjs 2,7,11 [outdir]
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
const times = process.argv[2].split(',').map(Number);
const out = process.argv[3] || 'shots';
const root = new URL('../dist/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (e) => console.log('ERR', e.message));
page.on('console', (m) => console.log('console', m.text()));
await page.route('**/*', async (route) => {
  const u = new URL(route.request().url());
  const f = join(root, u.pathname === '/' ? 'index.html' : u.pathname);
  try { await route.fulfill({ body: await readFile(f), contentType: types[extname(f)] || 'application/octet-stream' }); }
  catch { await route.fulfill({ status: 404 }); }
});
for (const t of times) {
  await page.goto(`http://x.local/?freeze=1&t=${t}`);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/s${String(t).padStart(5, '0')}.png` });
  console.log('shot', t);
}
await browser.close();

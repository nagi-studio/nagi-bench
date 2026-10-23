import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, normalize } from 'node:path';

const root = resolve('dist');
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (message) => console.log(`[console.${message.type()}] ${message.text()}`));
page.on('pageerror', (error) => console.log(`[pageerror] ${error.stack ?? error.message}`));
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  if (url.origin !== 'http://preview.local') return route.abort();
  let path = normalize(decodeURIComponent(url.pathname));
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(join(root, path));
    const type = extname(path) === '.js' ? 'text/javascript' : extname(path) === '.css' ? 'text/css' : 'text/html';
    await route.fulfill({ status: 200, body, contentType: type });
  } catch {
    await route.fulfill({ status: 404, body: 'not found' });
  }
});
await page.goto('http://preview.local/', { waitUntil: 'load' });
await page.waitForFunction(() => window.__waterClock, { timeout: 60000 });
for (const time of [0, 5, 9, 11, 15, 19, 23.3, 27, 30]) {
  const state = await page.evaluate((t) => {
    window.__waterClock.seek(t);
    return window.__waterClock.getState();
  }, time);
  console.log(JSON.stringify(state));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `preview/exact-${String(time).padStart(2, '0')}s.png`, timeout: 120000 });
}
await browser.close();

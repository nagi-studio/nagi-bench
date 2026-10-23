import { chromium } from 'playwright-core';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
const root = resolve('dist'), out = resolve('held-preview');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell', chromiumSandbox: false, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', m => console.log('console', m.type(), m.text()));
page.on('pageerror', e => console.log('ERROR', e.message));
await page.route('**/*', async route => {
  const url = new URL(route.request().url());
  if (url.origin !== 'http://preview.local') return route.abort();
  let path = normalize(decodeURIComponent(url.pathname)); if (path.endsWith('/')) path += 'index.html';
  try { const body = await readFile(join(root, path)); await route.fulfill({ status: 200, body, contentType: extname(path) === '.js' ? 'text/javascript' : extname(path) === '.css' ? 'text/css' : 'text/html' }); } catch { await route.fulfill({status:404,body:'no'}); }
});
for (const t of [0,5,10,15,19,24,30]) {
  await page.goto(`http://preview.local/?t=${t}`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__film?.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(out, `t${String(t).padStart(2,'0')}.png`), timeout: 120000 });
  const data = await page.evaluate(() => ({time:__film.time,shot:__film.shot,stats:__film.stats()}));
  console.log('held', t, JSON.stringify({time:data.time,shot:data.shot,wheel:data.stats.wheelSpeed,timing:data.stats.timingSpeed,shaft:data.stats.shaftSpeed,strikes:data.stats.strikes,ticks:data.stats.ticks}));
}
await browser.close();

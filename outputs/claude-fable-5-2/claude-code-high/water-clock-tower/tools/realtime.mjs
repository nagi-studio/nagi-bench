// 实时放映自检：按真实时间播放，周期性记录影片时间、帧率、tick 数与输出电平峰值
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, normalize } from 'node:path';
const BROWSER = '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };
const dur = Number(process.argv[2] ?? 35); const root = resolve('dist');
const browser = await chromium.launch({ executablePath: BROWSER, chromiumSandbox: false, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (m) => console.log(`[console.${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => console.log(`[pageerror] ${e.stack ?? e.message}`));
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url()); let path = normalize(decodeURIComponent(url.pathname)); if (path.endsWith('/')) path += 'index.html';
  try { await route.fulfill({ status: 200, body: await readFile(join(root, path)), contentType: TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream' }); } catch { await route.fulfill({ status: 404, body: 'nf' }); }
});
const t0 = Date.now();
await page.goto('http://preview.local/' + (process.argv[3] ?? ''), { waitUntil: 'load' });
await page.waitForFunction(() => window.__film && window.__film.ready, null, { timeout: 120000 });
console.log(`ready after ${Date.now() - t0} ms`);
await page.evaluate(() => { window.__pkMax = 0; setInterval(() => { const a = window.__film.audio; if (a && a.peak) window.__pkMax = Math.max(window.__pkMax, a.peak()); }, 20); });
const s0 = Date.now();
while ((Date.now() - s0) / 1000 < dur) {
  await page.waitForTimeout(1000);
  const r = await page.evaluate(() => { const f = window.__film; const pk = window.__pkMax; window.__pkMax = 0; return { T: f.T, fps: f.frames, ticks: f.sim.counts.ticks, pk, run: f.audio.running() }; });
  console.log(`wall=${((Date.now() - s0) / 1000).toFixed(1)}s filmT=${r.T.toFixed(2)} frames=${r.fps} ticks=${r.ticks} audio=${r.run ? 'on' : 'off'} peak=${r.pk.toFixed(3)}`);
}
await browser.close();

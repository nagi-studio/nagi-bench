// 验证 dist/index.html 可以用 file:// 直接打开（离线、无服务器），并跑完整部影片不报错
import { chromium } from 'playwright-core';
import { resolve } from 'node:path';
const BROWSER = '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell';
const browser = await chromium.launch({ executablePath: BROWSER, chromiumSandbox: false, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = []; const requests = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
page.on('request', (r) => requests.push(r.url()));
page.on('requestfailed', (r) => errors.push(`[requestfailed] ${r.url()}`));
await page.goto('file://' + resolve('dist/index.html'), { waitUntil: 'load' });
await page.waitForFunction(() => window.__film && window.__film.ready, null, { timeout: 60000 });
const r = await page.evaluate(() => { const f = window.__film; const T = f.seek(34); return { T, ticks: f.sim.counts.ticks, balls: f.sim.activeBalls() }; });
console.log('file:// OK →', JSON.stringify(r));
console.log('requests:', requests.map((u) => u.replace(/^.*\/dist\//, 'dist/')).join(', '));
console.log(errors.length ? errors.join('\n') : 'no console errors / warnings');
await browser.close();

// 自检:加载 dist,报告 sim/wall 时钟差、FPS、音频状态、控制台错误
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
const root = '/workspace/dist';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.wasm': 'application/wasm' };
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[console.' + m.type() + ']', m.text()); });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.route('**/*', async (route) => {
  const u = new URL(route.request().url());
  if (u.origin !== 'http://probe.local') return route.abort();
  let p = u.pathname; if (p.endsWith('/')) p += 'index.html';
  try { const body = await readFile(join(root, p)); route.fulfill({ status: 200, body, contentType: TYPES[extname(p)] ?? 'application/octet-stream' }); }
  catch { route.fulfill({ status: 404, body: 'nf' }); }
});
const t0 = Date.now();
await page.goto('http://probe.local/', { waitUntil: 'load' });
await page.evaluate(() => {
  window.__frames = 0; window.__t0 = performance.now();
  const loop = () => { window.__frames++; requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
});
for (const wall of [5, 10, 20, 30]) {
  const wait = t0 + wall * 1000 - Date.now();
  if (wait > 0) await page.waitForTimeout(wait);
  const s = await page.evaluate(() => ({
    sim: window.__film.machine.time,
    fps: window.__frames / ((performance.now() - window.__t0) / 1000),
    steps: window.__film.machine.stepCount,
    balls: window.__film.machine.balls.filter(b => b.userData.active).length,
    audio: window.__film.audio.running,
  }));
  console.log(`wall ${wall}s -> sim ${s.sim.toFixed(2)}s  fps ${s.fps.toFixed(1)}  steps ${s.steps}  balls ${s.balls}  audioRunning ${s.audio}`);
}
await browser.close();

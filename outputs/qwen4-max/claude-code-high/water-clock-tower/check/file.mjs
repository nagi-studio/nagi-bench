// 验证 dist/index.html 以 file:// 离线打开可运行
import { chromium } from 'playwright-core';
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
page.on('requestfailed', (r) => errs.push('REQFAIL ' + r.url()));
await page.goto('file:///workspace/dist/index.html', { waitUntil: 'load' });
await page.waitForTimeout(4000);
const s = await page.evaluate(() => ({ sim: +window.__film.machine.time.toFixed(2), audio: window.__film.audio.running }));
await page.screenshot({ path: 'preview/file-offline.png' });
console.log('file:// sim', s.sim, 'audio', s.audio, 'errors:', errs.length ? errs : 'none');
await browser.close();

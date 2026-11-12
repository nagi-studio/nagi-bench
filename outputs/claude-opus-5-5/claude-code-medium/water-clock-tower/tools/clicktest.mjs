import { chromium } from 'playwright-core';
import { resolve } from 'node:path';
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => console.log('[console]', m.type(), m.text()));
await page.goto('file://' + resolve('dist/index.html') + '?forcebtn=1');
await page.waitForFunction(() => window.__stats && window.__stats.frames > 2, null, { timeout: 120000 });
await page.waitForTimeout(1500);
const before = await page.evaluate(() => ({ btn: getComputedStyle(document.querySelector('.sound-btn')).display, film: window.__stats.film, audio: window.__audioState }));
console.log('before click', JSON.stringify(before));
await page.click('.sound-btn');
await page.waitForTimeout(3000);
const after = await page.evaluate(() => ({ btn: getComputedStyle(document.querySelector('.sound-btn')).display, film: window.__stats.film }));
console.log('after click', JSON.stringify(after));
await page.screenshot({ path: 'shots/clicktest.png' });
await browser.close();

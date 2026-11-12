// 以 file:// 直接打开 dist/index.html，检查能否运行（无网络、无本地服务器）
import { chromium } from 'playwright-core';
import { resolve } from 'node:path';
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = [];
page.on('pageerror', (e) => { errs.push(e.message); console.log('[pageerror]', e.message); });
page.on('console', (m) => console.log('[console]', m.type(), m.text()));
page.on('requestfailed', (r) => console.log('[requestfailed]', r.url(), r.failure()?.errorText));
page.on('request', (r) => { if (!r.url().startsWith('file://') && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) console.log('[NETWORK REQUEST]', r.url()); });
const url = 'file://' + resolve('dist/index.html') + '?capture=1&mute=1';
await page.goto(url);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
await page.evaluate(() => window.__seek(12));
await page.screenshot({ path: 'shots/filetest.png' });
console.log('OK file:// run, errors:', errs.length);
await browser.close();

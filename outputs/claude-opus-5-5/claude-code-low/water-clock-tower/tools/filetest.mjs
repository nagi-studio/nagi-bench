// Opens dist/index.html straight from disk (file://) and checks it runs.
import { chromium } from 'playwright-core';
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (e) => console.log('ERR', e.message));
page.on('console', (m) => console.log('console', m.type(), m.text()));
page.on('requestfailed', (r) => console.log('FAILED', r.url()));
await page.goto('file://' + new URL('../dist/index.html', import.meta.url).pathname);
await page.waitForTimeout(8000);
const st = await page.evaluate(() => ({ t: window.__film?.t, steps: window.__film?.cw.wheelSteps }));
console.log('state', JSON.stringify(st));
await page.screenshot({ path: 'preview/file.png' });
await browser.close();

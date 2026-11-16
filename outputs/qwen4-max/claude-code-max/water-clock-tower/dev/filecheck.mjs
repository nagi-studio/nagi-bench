import { chromium } from 'playwright-core';
const BROWSER = '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell';
const browser = await chromium.launch({ executablePath: BROWSER, chromiumSandbox: false,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
let errs = 0;
page.on('console', m => { if (m.type() === 'error') { errs++; console.log('[console.error]', m.text()); } });
page.on('pageerror', e => { errs++; console.log('[pageerror]', String(e)); });
page.on('requestfailed', r => console.log('[requestfailed]', r.url()));
await page.goto('file:///workspace/dist/index.html', { waitUntil: 'load' });
await page.waitForTimeout(6000);
const state = await page.evaluate(() => ({
  loading: document.getElementById('loading').style.display,
  sub: document.getElementById('subtitle').textContent,
}));
console.log('state:', JSON.stringify(state), 'errors:', errs);
await page.screenshot({ path: 'preview/filecheck.png' });
await browser.close();

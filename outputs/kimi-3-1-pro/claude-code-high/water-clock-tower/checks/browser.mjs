import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
});
const out = resolve('checks/frames');
await mkdir(out, { recursive: true });
const times = process.argv[2]?.split(',') ?? ['0', '5', '10', '17', '23', '25.1', '28', '30'];
for (const time of times) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`file://${resolve('dist/index.html')}?t=${time}&freeze=1`, { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction(() => window.__waterClock?.ready, { timeout: 120000 });
  await page.screenshot({ path: `${out}/t${time.replace('.', '_')}s.png`, timeout: 120000 });
  console.log(JSON.stringify({ time, errors, diagnostics: await page.evaluate(() => window.__waterClock.getDiagnostics()), render: await page.evaluate(() => window.__waterClock.renderInfo()) }));
  await page.close();
}
await browser.close();

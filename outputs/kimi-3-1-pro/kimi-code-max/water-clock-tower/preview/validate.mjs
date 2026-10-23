import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, normalize } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
const external = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('request', (request) => { if (!request.url().startsWith('http://preview.local') && !request.url().startsWith('data:')) external.push(request.url()); });
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  if (url.origin !== 'http://preview.local') return route.abort();
  let path = normalize(decodeURIComponent(url.pathname));
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(join(root, path));
    const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html' };
    await route.fulfill({ status: 200, body, contentType: types[extname(path)] ?? 'application/octet-stream' });
  } catch {
    await route.fulfill({ status: 404, body: 'not found' });
  }
});
await page.goto('http://preview.local/', { waitUntil: 'load' });
await page.waitForFunction(() => window.__waterClock, null, { timeout: 60000 });
const state = () => page.evaluate(() => window.__waterClock.getState());
await page.click('#play');
const paused = await state();
await page.waitForTimeout(350);
const stillPaused = await state();
assert.equal(paused.playing, false);
assert.equal(stillPaused.playing, false);
assert.ok(Math.abs(stillPaused.time - paused.time) < 0.05, 'pause must freeze film time');
await page.click('#play');
assert.equal((await state()).playing, true);
if (!(await state()).audioEnabled) await page.click('#sound');
assert.equal((await state()).audioEnabled, true, 'Web Audio should start after user gesture');
await page.evaluate(() => window.__waterClock.seek(12));
assert.equal((await state()).playing, false);
await page.click('#replay');
assert.equal((await state()).playing, true);
assert.ok((await state()).time < 2, 'replay must return to the beginning');
await page.evaluate(() => window.__waterClock.pause());
const bounds = await page.locator('#timeline').boundingBox();
await page.mouse.click(bounds.x + bounds.width * 0.75, bounds.y + 8);
assert.ok(Math.abs((await state()).time - 22.5) < 0.2, 'timeline must seek to 75%');
assert.equal((await state()).playing, false);
await page.evaluate(() => window.__waterClock.seek(30));
await page.waitForTimeout(500);
const endStyles = await page.evaluate(() => ({
  end: getComputedStyle(document.querySelector('#end-title')).opacity,
  caption: getComputedStyle(document.querySelector('#caption')).opacity,
  chapter: getComputedStyle(document.querySelector('#chapter-card')).opacity,
}));
assert.equal(endStyles.end, '1');
assert.equal(endStyles.caption, '0');
assert.equal(endStyles.chapter, '0');
await page.screenshot({ path: 'preview/final-30.png', timeout: 120000 });
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.__waterClock.seek(0));
await page.waitForTimeout(500);
await page.screenshot({ path: 'preview/mobile.png', timeout: 120000 });
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
assert.deepEqual(external, [], 'no external network requests are allowed');
assert.deepEqual(errors, [], 'no browser errors are allowed');
console.log(JSON.stringify({ pause: true, resume: true, audio: true, replay: true, scrub: true, endStyles, mobile: true, externalRequests: external, errors }, null, 2));
await browser.close();

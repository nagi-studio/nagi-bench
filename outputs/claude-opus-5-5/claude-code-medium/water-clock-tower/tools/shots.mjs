// 用无头 Chromium 打开 dev 构建，按"模拟时间"截图（确定性，不受帧率影响）
// usage: bun tools/shots.mjs <outdir> <times comma> [query string]
import { chromium } from 'playwright-core';
import { readFile, mkdir } from 'node:fs/promises';
import { join, extname, resolve, normalize } from 'node:path';

let [outDir = 'shots', timesArg = '0', query = '', size = '1280x720'] = process.argv.slice(2);
if (query === '@') query = (await readFile('tools/query.txt', 'utf8')).trim();
const times = timesArg.split(',').map(Number);
const root = resolve('dist');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm' };
await mkdir(outDir, { recursive: true });
const [w, h] = size.split('x').map(Number);
const browser = await chromium.launch({
  executablePath: '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',
  chromiumSandbox: false,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: w, height: h } });
page.on('console', (m) => console.log('[console]', m.text()));
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  let p = normalize(decodeURIComponent(url.pathname));
  if (p.endsWith('/')) p += 'index.html';
  try {
    const body = await readFile(join(root, p));
    await route.fulfill({ status: 200, body, contentType: TYPES[extname(p)] ?? 'application/octet-stream' });
  } catch { await route.fulfill({ status: 404, body: 'nf' }); }
});
await page.goto('http://x.local/?' + query + '&capture=1');
await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
for (const t of times) {
  await page.evaluate((t) => window.__seek(t), t);
  await page.waitForTimeout(50);
  const f = join(outDir, `s${String(t.toFixed(2)).padStart(6, '0')}.png`);
  await page.screenshot({ path: f });
  console.log('shot', f);
}
await browser.close();

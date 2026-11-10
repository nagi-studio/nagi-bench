// 自检截图：bun tools/shots.mjs _ <影片时刻,逗号分隔> [outDir] [WxH]
// 通过 window.__film.seek(T) 精确跳到各影片时刻（物理逐步推进、结果与实时放映一致）后截图。
import { chromium } from 'playwright-core';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, resolve, normalize } from 'node:path';
const BROWSER = '/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm', '.png': 'image/png' };
const a = process.argv.slice(2);
const startT = Number(a[0] ?? 0), offs = (a[1] ?? '0').split(',').map(Number), out = resolve(a[2] ?? '.dbg/shots');
const [width, height] = (a[3] ?? '1280x720').split('x').map(Number);
const root = resolve('dist'); await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: BROWSER, chromiumSandbox: false, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width, height } });
page.on('console', (m) => console.log(`[console.${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => console.log(`[pageerror] ${e.stack ?? e.message}`));
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url()); let path = normalize(decodeURIComponent(url.pathname)); if (path.endsWith('/')) path += 'index.html';
  try { await route.fulfill({ status: 200, body: await readFile(join(root, path)), contentType: TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream' }); } catch { await route.fulfill({ status: 404, body: 'nf' }); }
});
await page.goto(`http://preview.local/`, { waitUntil: 'load' });
await page.waitForFunction(() => window.__film && window.__film.ready, null, { timeout: 120000 });
for (const o of offs) {
  const T = await page.evaluate((t) => window.__film.seek(t), o);
  await page.waitForTimeout(350);
  const f = join(out, `T${o.toFixed(1).padStart(5, '0')}.png`); await page.screenshot({ path: f, timeout: 120000 });
  console.log(`[shot] ${f}  filmT=${T.toFixed(2)}`);
}
await browser.close();

// 用无头 Edge 打开构建产物并截图：node tools/shot.mjs 2 6 11 ...
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const times = process.argv.slice(2).filter((x) => !x.startsWith('--'));
const extra = process.argv.find((x) => x.startsWith('--q='))?.slice(4) || '';
const W = Number(process.env.W || 1280);
const H = Number(process.env.H || 720);
const outDir = path.resolve('tools/shots');
fs.mkdirSync(outDir, { recursive: true });
const file = pathToFileURL(path.resolve('dist/index.html')).href;
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: 'new',
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', `--window-size=${W},${H}`],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
for (const t of times) {
  const url = `${file}?t=${t}&freeze&capture${extra ? '&' + extra : ''}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__film && window.__film.t >= 0, { timeout: 60000 });
  await new Promise((r) => setTimeout(r, 900));
  const f = path.join(outDir, `t_${String(t).padStart(5, '0')}.png`);
  await page.screenshot({ path: f });
  const st = await page.evaluate(() => window.__film);
  console.log(f, JSON.stringify(st));
}
if (logs.length) console.log(logs.slice(0, 30).join('\n'));
await browser.close();

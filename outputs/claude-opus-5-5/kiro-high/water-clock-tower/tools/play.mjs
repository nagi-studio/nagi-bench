// 实际点击播放，按真实时间观看整部短片：记录帧率、影片时间推进、控制台错误，并按时截图
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const outDir = path.resolve('tools/play');
fs.mkdirSync(outDir, { recursive: true });
const file = pathToFileURL(path.resolve('dist/index.html')).href;
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: 'new',
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--window-size=1280,720'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(file, { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: path.join(outDir, 'start.png') });
await page.evaluate(() => {
  window.__frames = 0;
  const f = () => {
    window.__frames++;
    requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
});
await page.click('#play');
const t0 = Date.now();
const snaps = process.env.SNAPS ? process.env.SNAPS.split(',').map(Number) : [];
let k = 0;
let lastFrames = 0;
while ((Date.now() - t0) / 1000 < Number(process.env.DUR || 34)) {
  await new Promise((r) => setTimeout(r, 1000));
  const st = await page.evaluate(() => ({ ...window.__film, frames: window.__frames, audio: window.__audioState }));
  const real = (Date.now() - t0) / 1000;
  console.log(`real=${real.toFixed(1)} film=${st.t.toFixed(2)} shot=${st.shot} fps=${st.frames - lastFrames} audio=${st.audio} peak=${st.peak.toFixed(3)}`);
  await page.evaluate(() => window.__resetPeak());
  lastFrames = st.frames;
  while (k < snaps.length && st.t >= snaps[k]) {
    await page.screenshot({ path: path.join(outDir, `p_${snaps[k]}.png`) });
    k++;
  }
}
await page.screenshot({ path: path.join(outDir, 'end.png') });
if (process.env.FLOW) {
  await page.click('#replay');
  await new Promise((r) => setTimeout(r, 3000));
  console.log('after replay', JSON.stringify(await page.evaluate(() => window.__film)));
  await page.screenshot({ path: path.join(outDir, 'replay.png') });
  await page.evaluate(() => window.__seek(32));
  await new Promise((r) => setTimeout(r, 1500));
  await page.click('#explore');
  await page.mouse.move(640, 360);
  await page.mouse.down();
  await page.mouse.move(400, 300, { steps: 10 });
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 1500));
  console.log('explore', JSON.stringify(await page.evaluate(() => window.__film)));
  await page.screenshot({ path: path.join(outDir, 'explore.png') });
}
console.log(logs.slice(0, 40).join('\n'));
await browser.close();

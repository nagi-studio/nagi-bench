// 无头浏览器冒烟测试：加载 → 加入 CT → 批量驱动引擎 → 验证战斗/回合/渲染像素
import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--disable-gpu-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push('console: ' + msg.text());
});
page.on('pageerror', (err) => errors.push('pageerror: ' + String(err)));

await page.goto('http://localhost:4173/', { waitUntil: 'load' });
await page.waitForTimeout(1200);
await page.click('.join-ct');
await page.waitForTimeout(600);

// 从 Node 侧批量推进（每批 30 步 × 1/30s = 1s 游戏时间）
const stepBatch = async (sec) => {
  for (let i = 0; i < sec; i++) {
    await page.evaluate(() => {
      const g = window.__game;
      for (let k = 0; k < 30; k++) g.step(1 / 30);
    });
    await page.waitForTimeout(40);
  }
};
const snapshot = () => page.evaluate(() => {
  const g = window.__game;
  const s = g.store.getSnapshot();
  return {
    phase: s.phase, round: s.round, phaseT: g.phaseT, time: g.time.toFixed(1),
    alive: g.ents.filter((e) => e.alive).length,
    kills: s.killfeed.length, bomb: g.bombState, money: s.self.money,
    tpos: g.ents.filter((e) => e.team === 'T' && e.alive).slice(0, 2).map((e) => [e.x.toFixed(1), e.z.toFixed(1)]),
    cpos: g.ents.filter((e) => e.team === 'CT' && e.alive).slice(0, 2).map((e) => [e.x.toFixed(1), e.z.toFixed(1)]),
  };
});

console.log('start:', JSON.stringify(await snapshot()));
await stepBatch(9); // 冻结 8s
console.log('after freeze:', JSON.stringify(await snapshot()));

// 挂机推进 60s 游戏时间，观察 AI 交火
let maxDeaths = 0;
for (let i = 0; i < 12; i++) {
  await stepBatch(5);
  const s = await snapshot();
  maxDeaths = Math.max(maxDeaths, 10 - s.alive);
  console.log(`t+${(i + 1) * 5}s:`, JSON.stringify(s));
  if (s.phase === 'ended' || (s.phase === 'freeze' && s.round > 1)) break;
}

// 渲染像素检查
const px = await page.evaluate(() => {
  const g = window.__game;
  g.renderer.render(g.scene, g.camera);
  const src = g.renderer.domElement;
  const c = document.createElement('canvas');
  c.width = 256; c.height = 144;
  const ctx = c.getContext('2d');
  ctx.drawImage(src, 0, 0, 256, 144);
  const data = ctx.getImageData(0, 0, 256, 144).data;
  const colors = new Set();
  let nonBg = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], gg = data[i + 1], b = data[i + 2];
    colors.add((r >> 4) + ',' + (gg >> 4) + ',' + (b >> 4));
    if (Math.abs(r - 159) + Math.abs(gg - 192) + Math.abs(b - 216) > 60) nonBg++;
  }
  return { uniqueColors: colors.size, nonBackground: nonBg };
});
console.log('render pixels:', JSON.stringify(px));
if (px.uniqueColors < 3 || px.nonBackground < 1000) errors.push('RENDER CHECK FAILED');

const fin = await snapshot();
console.log('final:', JSON.stringify(fin));
if (maxDeaths === 0 && fin.phase !== 'ended') errors.push('WARNING: no combat deaths in round 1');

await page.screenshot({ path: '/tmp/shot-live.png' });
console.log('errors:', errors.length ? '\n' + errors.join('\n') : 'NONE');
await browser.close();
process.exit(errors.length ? 1 : 0);

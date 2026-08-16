// 冒烟测试 3：玩家(T)亲自下包 → CT bot 拆包 → 回合结算
import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader','--use-gl=angle','--disable-gpu-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', m => { if (m.type()==='error') errors.push('console: '+m.text()); });
page.on('pageerror', e => errors.push('pageerror: '+String(e)));

await page.goto('http://localhost:4173/', { waitUntil: 'load' });
await page.waitForTimeout(1000);
await page.click('.join-t');
await page.waitForTimeout(500);

const step = async (sec) => { for (let i=0;i<sec;i++){ await page.evaluate(()=>{const g=window.__game; for(let k=0;k<30;k++) g.step(1/30);}); await page.waitForTimeout(25);} };
const snap = () => page.evaluate(() => {
  const g = window.__game; const s = g.store.getSnapshot();
  return { phase: s.phase, round: s.round, bomb: g.bombState, bombTimer: g.bombTimer, planting: s.planting, defusing: s.defusing, score: s.scores };
});

await step(9);
console.log('live:', JSON.stringify(await snap()));

// 玩家成为携包者并传送到 A 点下包位
await page.evaluate(() => {
  const g = window.__game;
  const c = g.controlled;
  for (const e of g.ents) e.hasBomb = false;
  c.hasBomb = true;
  g.bombCarrier = c;
  g.bombState = 'carried';
  g.updateBombBack(c);
  g.switchWeapon(c, 5);
  c.x = 22; c.z = -14; c.y = 0; c.vx = 0; c.vz = 0;
  g.input.mouseDown = true;
});
await step(3.5);
console.log('after hold-fire 3.5s:', JSON.stringify(await snap()));
await page.evaluate(() => { window.__game.input.mouseDown = false; });

// 传送一个 CT bot 到炸弹旁 → 自动拆包
await page.evaluate(() => {
  const g = window.__game;
  const ct = g.ents.find(e => e.team === 'CT' && e.isBot && e.alive);
  ct.x = g.bombPos[0] + 1; ct.z = g.bombPos[1]; ct.y = 0;
  ct.ai.defendPos = [g.bombPos[0], g.bombPos[1]];
  ct.ai.state = 'hold';
});
await step(2);
console.log('ct rush:', JSON.stringify(await snap()));
await step(6);
console.log('after defuse 6s:', JSON.stringify(await snap()));
await step(5);
console.log('next round:', JSON.stringify(await snap()));

console.log('errors:', errors.length ? '\n'+errors.join('\n') : 'NONE');
await browser.close();
process.exit(errors.length ? 1 : 0);

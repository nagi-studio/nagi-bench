// 冒烟测试 6：第二回合 AI 购买主武器 + 多回合长跑稳定性
import { chromium } from 'playwright';
const errors = [];
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader','--use-gl=angle','--disable-gpu-sandbox'] });
const page = await browser.newPage();
page.on('console', m => { if (m.type()==='error') errors.push('console: '+m.text()); });
page.on('pageerror', e => errors.push('pageerror: '+String(e)));
await page.goto('http://localhost:4173/', { waitUntil: 'load' });
await page.waitForTimeout(1000);
await page.click('.join-t');
await page.waitForTimeout(500);
const step = async (sec) => { for (let i=0;i<sec;i++){ await page.evaluate(()=>{const g=window.__game; for(let k=0;k<30;k++) g.step(1/30);}); await page.waitForTimeout(25);} };
const snap = () => page.evaluate(() => {
  const g = window.__game; const s = g.store.getSnapshot();
  return {
    phase: s.phase, round: s.round, score: s.scores, alive: g.ents.filter(e=>e.alive).length,
    weapons: g.ents.filter(e=>e.isBot && e.alive).map(e => [e.name, e.weapons[1]?.def.id || '-', e.armor, e.money]),
    playerRifle: g.playerEnt.weapons[1]?.def.id || null,
  };
});
await step(9); // 冻结结束
console.log('r1:', JSON.stringify(await snap()));
// 强制结束第一回合
await page.evaluate(() => window.__game.endRound('T', 't'));
await step(5);
console.log('r2:', JSON.stringify(await snap()));
await step(9); // r2 冻结结束
// 跑 40s 游戏时间看稳定性
let last = null;
for (let i = 0; i < 8; i++) {
  await step(5);
  const s = await snap();
  last = s;
  if (s.phase === 'ended' || s.phase === 'freeze') break;
}
console.log('after 40s:', JSON.stringify(last));
console.log('errors:', errors.length ? '\n' + errors.join('\n') : 'NONE');
await browser.close();
process.exit(errors.length ? 1 : 0);

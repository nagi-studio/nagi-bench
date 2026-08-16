// 冒烟测试 2：第 2 回合购买 / 玩家武器 / 观战接管 / AWP 开镜
import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--disable-gpu-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + String(e)));

await page.goto('http://localhost:4173/', { waitUntil: 'load' });
await page.waitForTimeout(1200);
await page.click('.join-ct');
await page.waitForTimeout(600);

const stepBatch = async (sec) => {
  for (let i = 0; i < sec; i++) {
    await page.evaluate(() => { const g = window.__game; for (let k = 0; k < 30; k++) g.step(1 / 30); });
    await page.waitForTimeout(30);
  }
};
const snap = () => page.evaluate(() => {
  const g = window.__game; const s = g.store.getSnapshot();
  return {
    phase: s.phase, round: s.round, phaseT: g.phaseT,
    self: s.self, bomb: g.bombState, score: s.scores,
  };
});

// 1) 跳过第一回合：过冻结 → 强制结束 → 进入第二回合冻结
await stepBatch(9);
await page.evaluate(() => window.__game.endRound('T', 'test'));
await stepBatch(5);
console.log('round2 start:', JSON.stringify(await snap()));

// 2) 给钱并购买
await page.evaluate(() => {
  const g = window.__game;
  g.controlled.money = 16000;
  g.toggleBuy();
});
await page.waitForTimeout(300);
const buyOpen = await page.evaluate(() => window.__game.store.getSnapshot().buyOpen);
console.log('buy menu open:', buyOpen);
await page.click('.buy-item:has-text("M4A4")');
await page.click('.buy-item:has-text("护甲")');
await page.click('.buy-item:has-text("AWP")');
console.log('after buy:', JSON.stringify((await snap()).self));
await page.evaluate(() => window.__game.toggleBuy());

// 3) 切 AWP + 开镜 + 射击
await page.evaluate(() => { const g = window.__game; g.switchWeapon(g.controlled, 1); });
console.log('primary:', (await snap()).self.weaponName);
await page.evaluate(() => {
  const g = window.__game;
  const c = g.controlled;
  c.zoomLevel = 1;
  c.deployT = 0;
  g.step(0.4);
});
const zoomed = await page.evaluate(() => window.__game.store.getSnapshot().self);
console.log('zoom:', zoomed.zoomed, 'level', zoomed.zoomLevel, 'weapon', zoomed.weaponName);
await page.evaluate(() => {
  const g = window.__game;
  g.controlled.deployT = 0;
  g.tryFire(g.controlled, true);
  g.step(0.1);
});
console.log('after awp shot: mag=', (await snap()).self.mag, 'weapon=', (await snap()).self.weaponName);

// 4) 进入 live 后：玩家阵亡 → 观战 → 接管
await stepBatch(7);
await page.evaluate(() => {
  const g = window.__game;
  g.applyDamage(g.controlled, 9999, 'head', null);
  g.step(0.2);
});
let s = await snap();
console.log('after death: alive=', s.self.alive, 'spectating=', JSON.stringify(s.spectating));
await page.evaluate(() => window.__game.takeover());
const tk = await page.evaluate(() => {
  const g = window.__game;
  return { name: g.controlled?.name, alive: g.controlled?.alive, isBot: g.controlled?.isBot };
});
console.log('takeover:', JSON.stringify(tk));
await stepBatch(6);
s = await snap();
console.log('final:', s.phase, 'round', s.round, 'alive=', s.self.alive, 'hp=', s.self.hp, 'name=', JSON.stringify(await page.evaluate(() => window.__game.controlled?.name)));

console.log('errors:', errors.length ? '\n' + errors.join('\n') : 'NONE');
await browser.close();
process.exit(errors.length ? 1 : 0);

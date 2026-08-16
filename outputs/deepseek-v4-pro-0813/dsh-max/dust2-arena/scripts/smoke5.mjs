// 冒烟测试 5：真实输入路径（Node 侧驱动步进 + 真实键盘事件）
import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader','--use-gl=angle','--disable-gpu-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', m => { if (m.type()==='error') errors.push('console: '+m.text()); });
page.on('pageerror', e => errors.push('pageerror: '+String(e)));

await page.goto('http://localhost:4173/', { waitUntil: 'load' });
await page.waitForTimeout(1000);
await page.click('.join-ct');
await page.waitForTimeout(600);

let running = true;
const driver = (async () => {
  while (running) {
    await page.evaluate(() => window.__game.step(1/60));
    await page.waitForTimeout(12);
  }
})();
const ent = () => page.evaluate(() => {
  const g = window.__game; const c = g.controlled; const s = g.store.getSnapshot();
  return {
    locked: !!document.pointerLockElement,
    x: +c.x.toFixed(2), z: +c.z.toFixed(2), y: +c.y.toFixed(2),
    yaw: +c.yaw.toFixed(3), pitch: +c.pitch.toFixed(3),
    slot: c.currentSlot, mag: s.self.mag, reloading: s.self.reloading,
    sb: !!document.querySelector('.scoreboard'),
    phase: s.phase,
  };
});

// 等冻结结束（游戏时间 8s，节流驱动下按相位轮询）
for (let i = 0; i < 60; i++) {
  await page.waitForTimeout(500);
  if ((await ent()).phase === 'live') break;
}
console.log('live:', JSON.stringify(await ent()));
// 确保指针锁定（无头环境偶发锁竞争）
for (let i = 0; i < 5; i++) {
  if ((await ent()).locked) break;
  if (await page.evaluate(() => !!document.querySelector('.lock-hint'))) {
    await page.click('.lock-hint');
  } else {
    await page.evaluate(() => window.__game.lockPointer());
  }
  await page.waitForTimeout(400);
}
console.log('locked:', (await ent()).locked);

// WASD 移动（CT 出生点朝北走）
const p0 = await ent();
await page.keyboard.down('KeyW');
let moved = false;
for (let i = 0; i < 30 && !moved; i++) {
  await page.waitForTimeout(300);
  const p = await ent();
  if (Math.abs(p.z - p0.z) >= 1.5) moved = true;
}
await page.keyboard.up('KeyW');
const p1 = await ent();
console.log('walk W: z', p0.z, '->', p1.z);
if (!moved) errors.push('WASD MOVEMENT NOT WORKING');

// 空格跳跃（腾空时 y 变化）
await page.keyboard.press('Space');
await page.waitForTimeout(150);
const pj = await ent();
console.log('jump mid y:', pj.y);
if (pj.y < 0.1) errors.push('JUMP NOT WORKING');

// 切刀/切枪
await page.keyboard.press('Digit3');
await page.waitForTimeout(600);
console.log('slot3:', (await ent()).slot);
await page.keyboard.press('Digit2');
await page.waitForTimeout(1500);

// 开火（半自动点击，带重试）
let fired = false;
for (let i = 0; i < 4 && !fired; i++) {
  await page.mouse.click(640, 360);
  await page.waitForTimeout(400);
  if ((await ent()).mag < 12) fired = true;
}
const afterFire = await ent();
console.log('after click: mag', afterFire.mag);
if (!fired) errors.push('CLICK FIRE NOT WORKING (mag=' + afterFire.mag + ')');

// 换弹
await page.keyboard.press('KeyR');
await page.waitForTimeout(300);
console.log('reloading:', (await ent()).reloading);
await page.waitForTimeout(2500);
console.log('after reload: mag', (await ent()).mag);

// Tab 记分板
await page.keyboard.down('Tab');
await page.waitForTimeout(300);
const sbOn = (await ent()).sb;
await page.keyboard.up('Tab');
await page.waitForTimeout(300);
console.log('scoreboard:', sbOn);
if (!sbOn) errors.push('SCOREBOARD NOT SHOWING');

// 阵亡 → 点击切换观战 → E 接管
await page.evaluate(() => { window.__game.applyDamage(window.__game.controlled, 9999, 'head', null); });
await page.waitForTimeout(300);
const spec1 = await page.evaluate(() => window.__game.store.getSnapshot().spectating?.name);
await page.mouse.click(640, 360);
await page.waitForTimeout(300);
const spec2 = await page.evaluate(() => window.__game.store.getSnapshot().spectating?.name);
console.log('spectate:', spec1, '->', spec2);
if (spec1 === spec2) errors.push('SPECTATE SWITCH NOT WORKING');
await page.keyboard.press('KeyE');
await page.waitForTimeout(300);
const tk = await page.evaluate(() => ({ name: window.__game.controlled?.name, isBot: window.__game.controlled?.isBot, locked: !!document.pointerLockElement }));
console.log('takeover:', JSON.stringify(tk));
if (!tk.isBot) errors.push('TAKEOVER NOT WORKING');

running = false;
await driver;
console.log('errors:', errors.length ? '\n' + errors.join('\n') : 'NONE');
await browser.close();
process.exit(errors.length ? 1 : 0);

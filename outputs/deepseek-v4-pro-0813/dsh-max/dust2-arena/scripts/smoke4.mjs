// 冒烟测试 4：物理（跳跃/爬坡/撞墙）+ HUD DOM + 开镜遮罩 + 小地图 + 阵亡界面
import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader','--use-gl=angle','--disable-gpu-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', m => { if (m.type()==='error') errors.push('console: '+m.text()); });
page.on('pageerror', e => errors.push('pageerror: '+String(e)));

await page.goto('http://localhost:4173/', { waitUntil: 'load' });
await page.waitForTimeout(1000);
await page.click('.join-ct');
await page.waitForTimeout(500);
const step = async (sec) => { for (let i=0;i<sec;i++){ await page.evaluate(()=>{const g=window.__game; for(let k=0;k<30;k++) g.step(1/30);}); await page.waitForTimeout(20);} };

// 1) HUD DOM
await step(1);
const hudDom = await page.evaluate(() => ({
  hp: document.querySelector('.hp-row .num')?.textContent,
  armor: document.querySelectorAll('.hp-row .num')[1]?.textContent,
  money: document.querySelector('.money')?.textContent,
  mag: document.querySelector('.ammo-nums .mag')?.textContent,
  weapon: document.querySelector('.weapon-name')?.textContent,
  hasCrosshair: !!document.querySelector('.crosshair'),
  hasMinimap: !!document.querySelector('.minimap'),
  menuGone: !document.querySelector('.menu'),
}));
console.log('HUD:', JSON.stringify(hudDom));

// 2) 跳跃物理
const jump = await page.evaluate(() => {
  const g = window.__game; const c = g.controlled;
  c.x = 0; c.z = 0; c.y = 0; c.vx = 0; c.vz = 0; c.vy = 0; c.grounded = true;
  const ys = [];
  c.vy = 4.9; c.grounded = false;
  for (let i = 0; i < 90; i++) { g.step(1/60); ys.push(c.y.toFixed(2)); }
  return { peak: Math.max(...ys.map(Number)), final: c.y, grounded: c.grounded };
});
console.log('jump:', JSON.stringify(jump));
if (jump.peak < 0.5 || jump.peak > 1.2) errors.push('JUMP PHYSICS WRONG: peak=' + jump.peak);

// 3) 撞墙（CT 出生点北墙 z=-30）
const wall = await page.evaluate(() => {
  const g = window.__game; const c = g.controlled;
  c.x = 0; c.z = -25; c.y = 0; c.vx = 0; c.vz = 0; c.grounded = true;
  for (let i = 0; i < 120; i++) { g.applyMove(c, 0, -1, 4.7, 1/60); g.step(1/60); }
  return { z: c.z };
});
console.log('wall stop z:', JSON.stringify(wall));
if (wall.z < -29.8) errors.push('WALL COLLISION FAILED: z=' + wall.z);

// 4) 爬坡（猫道上行坡）
const ramp = await page.evaluate(() => {
  const g = window.__game; const c = g.controlled;
  c.x = 4.4; c.z = -8; c.y = 0; c.vx = 0; c.vz = 0; c.grounded = true;
  for (let i = 0; i < 300; i++) { g.applyMove(c, 1, 0, 4.7, 1/60); g.step(1/60); }
  return { x: c.x.toFixed(1), y: c.y.toFixed(2), grounded: c.grounded };
});
console.log('ramp climb:', JSON.stringify(ramp));
if (ramp.x < 9.5 || ramp.y < 2.5) errors.push('RAMP CLIMB FAILED');

// 5) 射击命中敌人（把 T bot 放到面前，用 USP 打头）
const shot = await page.evaluate(() => {
  const g = window.__game; const c = g.controlled;
  const t = g.ents.find(e => e.team === 'T' && e.alive);
  c.x = 0; c.z = 10; c.y = 0; c.vx = 0; c.vz = 0;
  c.yaw = 0; c.pitch = 0; c.deployT = 0;
  t.x = 0; t.z = 6; t.y = 0; t.bodyYaw = Math.PI; t.vy = 0;
  t.hp = 100; t.armor = 0;
  const hpBefore = t.hp;
  g.tryFire(c, true);
  g.step(0.1);
  return { hpBefore, hpAfter: t.hp, region: t.hp, killed: !t.alive };
});
console.log('shot:', JSON.stringify(shot));
if (shot.hpAfter >= shot.hpBefore) errors.push('HITSCAN FAILED: no damage');

// 6) 击杀播报 DOM
await step(1);
const kf = await page.evaluate(() => ({
  killfeed: document.querySelectorAll('.kf-entry').length,
}));
console.log('killfeed DOM:', JSON.stringify(kf));

// 7) AWP 开镜遮罩
await page.evaluate(() => {
  const g = window.__game; const c = g.controlled;
  c.weapons[1] = { def: g.WEAPONS.awp, mag: 5, reserve: 30 };
  g.switchWeapon(c, 1);
  c.zoomLevel = 1;
  g.step(0.5);
});
await page.waitForTimeout(100);
const scope = await page.evaluate(() => ({
  scope: !!document.querySelector('.scope-overlay'),
  crosshairHidden: !document.querySelector('.crosshair'),
}));
console.log('scope:', JSON.stringify(scope));
if (!scope.scope) errors.push('SCOPE OVERLAY MISSING');

// 8) 小地图像素
const mm = await page.evaluate(() => {
  const cv = document.querySelector('.minimap');
  const ctx = cv.getContext('2d');
  const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
  let nonEmpty = 0;
  for (let i = 3; i < d.length; i += 40) if (d[i] > 20) nonEmpty++;
  return { nonEmpty };
});
console.log('minimap pixels:', JSON.stringify(mm));
if (mm.nonEmpty < 30) errors.push('MINIMAP EMPTY');

// 9) 阵亡界面
await page.evaluate(() => {
  const g = window.__game;
  g.controlled.zoomLevel = 0;
  g.applyDamage(g.controlled, 9999, 'head', null);
  g.step(0.2);
});
await page.waitForTimeout(100);
const deathDom = await page.evaluate(() => ({
  overlay: !!document.querySelector('.death-overlay'),
  text: document.querySelector('.death-title')?.textContent,
}));
console.log('death:', JSON.stringify(deathDom));
if (!deathDom.overlay) errors.push('DEATH OVERLAY MISSING');

console.log('errors:', errors.length ? '\n' + errors.join('\n') : 'NONE');
await browser.close();
process.exit(errors.length ? 1 : 0);

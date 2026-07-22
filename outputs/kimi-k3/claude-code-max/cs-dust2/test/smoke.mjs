// 冒烟测试：启动游戏、跑若干秒游戏逻辑、截图、检查运行时错误
import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/shot-menu.png' });

// 选 CT 进入战场
await page.click('button.team-btn.ct');
await page.click('button.start-btn');
await page.waitForTimeout(1500);

const state1 = await page.evaluate(() => {
  const g = window.__game;
  return {
    entities: g.entities.length,
    phase: g.phase,
    round: g.round,
    alive: g.entities.filter(e => e.alive).length,
    bombState: g.bomb.state,
    carrier: g.bomb.carrier?.name ?? null,
  };
});
console.log('开局状态:', JSON.stringify(state1));

// 跑 12 秒游戏（bots 应对战/移动）
await page.waitForTimeout(12000);
const state2 = await page.evaluate(() => {
  const g = window.__game;
  const moved = g.entities.filter(e => e.speed2D() > 0.1 || !e.alive).length;
  return {
    phase: g.phase, now: g.now.toFixed(1),
    movedOrDead: moved,
    kills: g.kills.length,
    aliveCT: g.entities.filter(e => e.team === 'CT' && e.alive).length,
    aliveT: g.entities.filter(e => e.team === 'T' && e.alive).length,
    bomb: g.bomb.state,
    playerPos: { x: +g.controlled.pos.x.toFixed(1), z: +g.controlled.pos.z.toFixed(1) },
    sampleBot: (() => { const b = g.entities.find(e => !e.isPlayer); return { name: b.name, x: +b.pos.x.toFixed(1), z: +b.pos.z.toFixed(1), hp: b.hp, alive: b.alive }; })(),
  };
});
console.log('12秒后:', JSON.stringify(state2));
await page.screenshot({ path: '/tmp/shot-game.png' });

// 模拟玩家移动 + 开火（直接注入输入）
await page.evaluate(() => {
  const g = window.__game;
  g.keys.add('KeyW');
  g.mouseDown = true;
});
await page.waitForTimeout(2500);
const state3 = await page.evaluate(() => {
  const g = window.__game;
  g.keys.delete('KeyW');
  g.mouseDown = false;
  return {
    playerPos: { x: +g.controlled.pos.x.toFixed(1), z: +g.controlled.pos.z.toFixed(1) },
    mag: g.controlled.weapon.mag,
    weapon: g.controlled.weapon.def.name,
  };
});
console.log('移动/开火后:', JSON.stringify(state3));
await page.screenshot({ path: '/tmp/shot-game2.png' });

// 快进到战斗结束迹象：再等 30s 看回合是否推进
await page.waitForTimeout(30000);
const state4 = await page.evaluate(() => {
  const g = window.__game;
  return {
    now: g.now.toFixed(0), round: g.round, phase: g.phase,
    scoreCT: g.scoreCT, scoreT: g.scoreT,
    bomb: g.bomb.state, kills: g.kills.length,
    aliveCT: g.entities.filter(e => e.team === 'CT' && e.alive).length,
    aliveT: g.entities.filter(e => e.team === 'T' && e.alive).length,
  };
});
console.log('45秒后:', JSON.stringify(state4));
await page.screenshot({ path: '/tmp/shot-game3.png' });

console.log(errors.length ? 'ERRORS:\n' + errors.slice(0, 10).join('\n') : 'NO RUNTIME ERRORS');
await browser.close();
process.exit(errors.length ? 1 : 0);

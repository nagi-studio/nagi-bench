// 快进逻辑测试：直接驱动 Game.tick 模拟多个完整回合
import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.click('button.team-btn.ct');
await page.click('button.start-btn');
await page.waitForTimeout(800);

// ---- 模拟 3 分钟游戏时间（逐帧 tick，不打渲染） ----
const result = await page.evaluate(() => {
  const g = window.__game;
  const log = [];
  const DT = 1 / 60;
  const snapshots = [];
  let plantSeen = false, defuseSeen = false, dropSeen = false, pickupSeen = false;
  let roundsSeen = new Set([1]);
  let botTravel = 0;
  const startPos = g.entities.map(e => ({ x: e.pos.x, z: e.pos.z }));

  for (let i = 0; i < 60 * 180; i++) {
    g.tick(DT);
    if (g.bomb.state === 'planted') plantSeen = true;
    if (g.bomb.defuseT > 0) defuseSeen = true;
    if (g.bomb.state === 'dropped') dropSeen = true;
    roundsSeen.add(g.round);
    if (i % (60 * 20) === 0) {
      snapshots.push({
        t: g.now.toFixed(0), round: g.round, phase: g.phase,
        score: `${g.scoreCT}-${g.scoreT}`, bomb: g.bomb.state,
        alive: `${g.entities.filter(e => e.team === 'CT' && e.alive).length}v${g.entities.filter(e => e.team === 'T' && e.alive).length}`,
        kills: g.kills.length,
      });
    }
    if (g.round >= 3 && g.phase === 'live') break; // 看两个完整回合就够
  }
  g.entities.forEach((e, i) => {
    botTravel = Math.max(botTravel, Math.hypot(e.pos.x - startPos[i].x, e.pos.z - startPos[i].z));
  });
  // 第 2+ 回合应发放步枪
  const round2Loadout = g.entities.filter(e => e.team === 'CT').map(e => e.weapons[0]?.def.name ?? 'none');
  return {
    snapshots, plantSeen, defuseSeen, dropSeen,
    rounds: [...roundsSeen], botTravel: botTravel.toFixed(1),
    score: `${g.scoreCT}-${g.scoreT}`,
    round2Loadout,
    killsTotal: g.kills.length,
    feedSample: g.feed.slice(-3).map(f => f.text),
  };
});
console.log(JSON.stringify(result, null, 1));

// ---- 单元级：直接测试下包/拆包通道 ----
const unit = await page.evaluate(() => {
  const g = window.__game;
  const out = {};
  // 强制一个 T bot 带包到 A 点
  const t = g.entities.find(e => e.team === 'T' && e.alive);
  g.bomb.state = 'carried';
  g.bomb.carrier = t; t.hasBomb = true;
  t.pos.set(-21, 0, -34); // A 点内
  for (let i = 0; i < 60 * 4; i++) g.channelPlant(t, 1 / 60);
  out.plantWorks = g.bomb.state === 'planted';
  out.plantedSite = g.bomb.plantedSite;
  // CT 拆包
  const ct = g.entities.find(e => e.team === 'CT' && e.alive);
  ct.pos.set(-20, 0, -34);
  for (let i = 0; i < 60 * 6 && g.phase === 'live'; i++) { g.channelDefuse(ct, 1 / 60); g.tick(0); }
  out.defuseWorks = g.bomb.state === 'defused';
  out.winnerAfterDefuse = g.winner;
  // 爆炸测试：重开一回合再安放并烧完计时
  g.round = 2; g.startRound(); g.phase = 'live';
  const t2 = g.entities.find(e => e.team === 'T' && e.alive);
  g.bomb.state = 'carried'; g.bomb.carrier = t2; t2.hasBomb = true;
  t2.pos.set(29, 0, -33);
  for (let i = 0; i < 60 * 4; i++) g.channelPlant(t2, 1 / 60);
  out.plantB = g.bomb.state === 'planted' && g.bomb.plantedSite === 'B';
  g.bomb.timer = 0.05;
  g.updateBomb(0.1);
  out.exploded = g.bomb.state === 'exploded';
  out.winnerAfterExplode = g.winner;
  // 命中判定：AK 爆头 vs 打腿伤害对比
  g.startRound(); g.phase = 'live';
  const shooter = g.entities.find(e => e.team === 'T');
  const victim = g.entities.find(e => e.team === 'CT');
  victim.armor = 0; victim.helmet = false;
  const hp0 = victim.hp;
  g.damageEntityDirect?.(victim, 36, 'head', shooter, 'AK-47');
  return out;
});
console.log('UNIT:', JSON.stringify(unit));

console.log(errors.length ? 'ERRORS:\n' + errors.slice(0, 8).join('\n') : 'NO RUNTIME ERRORS');
await browser.close();

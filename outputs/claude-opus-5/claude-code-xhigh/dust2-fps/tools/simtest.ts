/**
 * 无渲染的整局模拟：10 个 bot 在真地图上打完若干回合。
 * 这是验证"AI 会寻路、会交火、会下包拆包、回合能正常结算"的主要手段，
 * 因为它跑的就是浏览器里那份逻辑（引擎核心完全不 import three.js）。
 *
 *   node tools/simtest.ts [回合数] [种子]
 */

import { GameEngine, FIXED_DT } from '../src/game/engine.ts';
import type { GameEvent } from '../src/game/events.ts';
import { areaAt } from '../src/map/build.ts';
import { PLAYER_RADIUS } from '../src/game/actor.ts';

const targetRounds = Number(process.argv[2] ?? 6);
const seed = Number(process.argv[3] ?? 0xbeef);

const engine = new GameEngine({ seed, botSkill: 0.55, playerTeam: 'CT' });
// 玩家位也交给 AI，做纯 bot 对战
for (const a of engine.actors) a.bot = true;
engine.startMatch();

const stats = {
  rounds: 0,
  winT: 0,
  winCT: 0,
  reasons: new Map<string, number>(),
  kills: 0,
  headshots: 0,
  shots: 0,
  plants: 0,
  defuses: 0,
  explosions: 0,
  pickups: 0,
  footsteps: 0,
  damageEvents: 0,
  byWeapon: new Map<string, number>(),
};

const distanceMoved = new Map<number, number>();
const lastPos = new Map<number, { x: number; z: number }>();
const stuckSamples = new Map<number, number>();
const outOfWorld: string[] = [];
const insideGeometry: string[] = [];

for (const a of engine.actors) {
  distanceMoved.set(a.id, 0);
  lastPos.set(a.id, { x: a.pos.x, z: a.pos.z });
  stuckSamples.set(a.id, 0);
}

function handle(e: GameEvent) {
  switch (e.type) {
    case 'shot':
      stats.shots++;
      break;
    case 'hit':
      stats.damageEvents++;
      break;
    case 'kill':
      stats.kills++;
      if (e.headshot) stats.headshots++;
      stats.byWeapon.set(e.weapon, (stats.byWeapon.get(e.weapon) ?? 0) + 1);
      break;
    case 'footstep':
      stats.footsteps++;
      break;
    case 'bomb':
      if (e.kind === 'planted') stats.plants++;
      else if (e.kind === 'defused') stats.defuses++;
      else if (e.kind === 'exploded') stats.explosions++;
      else if (e.kind === 'pickup') stats.pickups++;
      break;
    case 'round':
      if (e.kind === 'end') {
        stats.rounds++;
        if (e.winner === 'T') stats.winT++;
        else stats.winCT++;
        const r = e.reason ?? '?';
        stats.reasons.set(r, (stats.reasons.get(r) ?? 0) + 1);
      }
      break;
    default:
      break;
  }
}

const t0 = performance.now();
let simTime = 0;
const maxSimTime = targetRounds * (115 + 12) + 30;
let sampleTimer = 0;

while (stats.rounds < targetRounds && simTime < maxSimTime) {
  engine.step(FIXED_DT);
  simTime += FIXED_DT;
  for (const e of engine.drainEvents()) handle(e);

  sampleTimer += FIXED_DT;
  if (sampleTimer >= 0.25) {
    sampleTimer = 0;
    for (const a of engine.actors) {
      const lp = lastPos.get(a.id)!;
      const d = Math.hypot(a.pos.x - lp.x, a.pos.z - lp.z);
      if (a.alive) {
        distanceMoved.set(a.id, distanceMoved.get(a.id)! + d);
        // 想动却没动 = 卡住
        const wantsToMove =
          Math.abs(a.intent.forward) + Math.abs(a.intent.strafe) > 0.2 && !a.busy;
        if (wantsToMove && d < 0.05) {
          stuckSamples.set(a.id, stuckSamples.get(a.id)! + 1);
        }
        // 位置合法性
        if (!areaAt(a.pos.x, a.pos.z)) {
          if (outOfWorld.length < 5) {
            outOfWorld.push(
              `${a.name} 跑到区域之外 (${a.pos.x.toFixed(1)}, ${a.pos.z.toFixed(1)})`,
            );
          }
        }
        const r = PLAYER_RADIUS - 0.06;
        if (
          engine.map.world.overlapBox(
            a.pos.x - r,
            a.pos.y + 0.55,
            a.pos.z - r,
            a.pos.x + r,
            a.pos.y + 1.6,
            a.pos.z + r,
          )
        ) {
          if (insideGeometry.length < 5) {
            insideGeometry.push(
              `${a.name} 卡进了几何体 (${a.pos.x.toFixed(1)}, ${a.pos.y.toFixed(
                1,
              )}, ${a.pos.z.toFixed(1)})`,
            );
          }
        }
      }
      lp.x = a.pos.x;
      lp.z = a.pos.z;
    }
  }
}
const wallMs = performance.now() - t0;

/* ------------------------------ 结果 ------------------------------ */

console.log(`模拟 ${simTime.toFixed(0)}s 游戏时间，实际耗时 ${wallMs.toFixed(0)}ms ` +
  `(${(simTime / (wallMs / 1000)).toFixed(0)}x 实时)`);
console.log(`\n回合 ${stats.rounds} 场：T 胜 ${stats.winT}，CT 胜 ${stats.winCT}`);
for (const [r, n] of [...stats.reasons.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`   ${r}: ${n}`);
}
console.log(
  `\n开火 ${stats.shots} 次，命中 ${stats.damageEvents} 次 (${(
    (stats.damageEvents / Math.max(1, stats.shots)) *
    100
  ).toFixed(1)}%)，击杀 ${stats.kills} (爆头 ${stats.headshots}, ${(
    (stats.headshots / Math.max(1, stats.kills)) *
    100
  ).toFixed(0)}%)`,
);
console.log(`下包 ${stats.plants}，拆包 ${stats.defuses}，爆炸 ${stats.explosions}，捡包 ${stats.pickups}`);
console.log(
  '击杀武器: ' +
    [...stats.byWeapon.entries()].map(([k, v]) => `${k}=${v}`).join(', '),
);

const dists = [...distanceMoved.values()];
const avgDist = dists.reduce((a, b) => a + b, 0) / dists.length;
const stuck = [...stuckSamples.entries()];
const totalStuck = stuck.reduce((a, b) => a + b[1], 0);
console.log(
  `\n每个 bot 平均移动 ${avgDist.toFixed(0)}m（${(avgDist / stats.rounds).toFixed(0)}m/回合），` +
    `卡住采样 ${totalStuck} 次`,
);
console.log('比分: T ' + engine.scoreT + ' : ' + engine.scoreCT + ' CT');

const problems: string[] = [];
if (stats.rounds < targetRounds) problems.push(`只打完了 ${stats.rounds}/${targetRounds} 回合，可能卡死`);
if (stats.kills < stats.rounds * 3) problems.push('击杀数过低，AI 可能不会交火');
if (stats.plants === 0) problems.push('一次包都没下，T 的进攻逻辑有问题');
if (stats.defuses + stats.explosions === 0) problems.push('下包后既没爆炸也没拆除');
if (avgDist / stats.rounds < 30) problems.push('bot 移动距离过短，可能在原地打转');
if (totalStuck > stats.rounds * 60) problems.push(`卡住采样过多 (${totalStuck})`);
problems.push(...outOfWorld, ...insideGeometry);

if (problems.length) {
  console.log(`\n✗ 问题 ${problems.length} 条:`);
  for (const p of problems) console.log('  - ' + p);
  process.exit(1);
}
console.log('\n✓ 模拟检查通过');

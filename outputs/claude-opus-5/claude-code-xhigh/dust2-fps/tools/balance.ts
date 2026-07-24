/**
 * 平衡性批量评估：跑很多局纯 bot 对战，统计双方胜率、下包率、回合时长。
 * 用来确认「进攻方/防守方谁都不是必胜」以及回合能正常打完。
 *
 *   node tools/balance.ts [每局回合数] [局数]
 */

import { FIXED_DT, GameEngine } from '../src/game/engine.ts';

const roundsPerMatch = Number(process.argv[2] ?? 8);
const matches = Number(process.argv[3] ?? 10);

let winT = 0;
let winCT = 0;
let plants = 0;
let defuses = 0;
let explosions = 0;
let rounds = 0;
let totalKills = 0;
let totalHs = 0;
const reasons = new Map<string, number>();
const roundLengths: number[] = [];

const t0 = performance.now();
for (let m = 0; m < matches; m++) {
  const engine = new GameEngine({ seed: 1000 + m * 7919, botSkill: 0.55 });
  for (const a of engine.actors) a.bot = true;
  engine.startMatch();

  let done = 0;
  let simTime = 0;
  let roundStart = 0;
  const limit = roundsPerMatch * 140 + 60;
  while (done < roundsPerMatch && simTime < limit) {
    engine.step(FIXED_DT);
    simTime += FIXED_DT;
    for (const e of engine.drainEvents()) {
      if (e.type === 'kill') {
        totalKills++;
        if (e.headshot) totalHs++;
      } else if (e.type === 'bomb') {
        if (e.kind === 'planted') plants++;
        else if (e.kind === 'defused') defuses++;
        else if (e.kind === 'exploded') explosions++;
      } else if (e.type === 'round' && e.kind === 'end') {
        done++;
        rounds++;
        roundLengths.push(simTime - roundStart);
        roundStart = simTime;
        if (e.winner === 'T') winT++;
        else winCT++;
        reasons.set(e.reason ?? '?', (reasons.get(e.reason ?? '?') ?? 0) + 1);
      }
    }
  }
  if (done < roundsPerMatch) {
    console.log(`⚠ 第 ${m} 局只打完 ${done}/${roundsPerMatch} 回合`);
  }
}
const wall = performance.now() - t0;

const avgLen = roundLengths.reduce((a, b) => a + b, 0) / Math.max(1, roundLengths.length);
console.log(`${matches} 局 x ${roundsPerMatch} 回合 = ${rounds} 回合，耗时 ${wall.toFixed(0)}ms`);
console.log(
  `T 胜率 ${((winT / rounds) * 100).toFixed(1)}%  (T ${winT} : ${winCT} CT)`,
);
console.log(`下包率 ${((plants / rounds) * 100).toFixed(1)}%，其中拆除 ${defuses}、爆炸 ${explosions}`);
console.log(`平均回合时长 ${avgLen.toFixed(1)}s，场均击杀 ${(totalKills / rounds).toFixed(1)}，爆头率 ${((totalHs / Math.max(1, totalKills)) * 100).toFixed(0)}%`);
console.log('胜负原因:');
for (const [r, n] of [...reasons.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`   ${r}: ${n} (${((n / rounds) * 100).toFixed(0)}%)`);
}

const tRate = winT / rounds;
const problems: string[] = [];
if (rounds < matches * roundsPerMatch) problems.push('有回合没能正常结束');
if (tRate < 0.3 || tRate > 0.7) problems.push(`胜率失衡：T ${(tRate * 100).toFixed(0)}%`);
if (plants / rounds < 0.2) problems.push('下包率过低，进攻方打不进点');
if (avgLen > 125) problems.push('回合平均时长过长');
if (problems.length) {
  console.log('\n✗ ' + problems.join('；'));
  process.exit(1);
}
console.log('\n✓ 平衡性检查通过');

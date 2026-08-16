// 无头仿真：验证引擎核心逻辑（寻路、AI、回合、C4）
import { Game } from '../src/game/engine';

const game = new Game({ team: 'T', primary: 'rifle', headless: true });
game.startMatch();

let simTime = 0;
const dt = 1 / 60;
const maxTime = 60 * 12; // 最多 12 分钟仿真时间
const stats = { kills: 0, plants: 0, defuses: 0, explosions: 0, rounds: 0, playerKills: 0 };
let lastPhase = game.phase;
let nan = false;
let stuck = 0;

function botStuck(g: Game): number {
  let n = 0;
  for (const c of g.combatants) {
    if (!c.alive || !c.brain) continue;
    if (c.brain.mode === 'goto' && c.brain.path.length === 0 && c.brain.goal) n++;
  }
  return n;
}

const start = Date.now();
while (simTime < maxTime) {
  game.update(dt);
  simTime += dt;
  if (game.phase !== lastPhase) {
    if (game.phase === 'planted') { stats.plants++; console.log(`[${simTime.toFixed(0)}s] C4 已安放`); }
    if (game.phase === 'roundEnd') { stats.rounds++; console.log(`[${simTime.toFixed(0)}s] 回合结束: ${game.roundEndText} 比分 ${game.scoreT}:${game.scoreCT}`); }
    if (game.phase === 'matchEnd') { console.log(`[${simTime.toFixed(0)}s] 比赛结束 ${game.scoreT}:${game.scoreCT}`); break; }
    lastPhase = game.phase;
  }
  for (const ev of game.drainEvents()) {
    if (ev.type === 'explosion') stats.explosions++;
    if (ev.type === 'defused') stats.defuses++;
    if (ev.type === 'kill') stats.kills++;
  }
  for (const c of game.combatants) {
    if (!isFinite(c.pos.x) || !isFinite(c.pos.y) || !isFinite(c.pos.z)) {
      nan = true;
      console.log(`[${simTime.toFixed(1)}s] NaN 位置: ${c.name} y=${c.pos.y}`);
    }
  }
  if (Math.floor(simTime) % 30 === 0 && simTime > 0 && Math.floor(simTime / 30) !== Math.floor((simTime - dt) / 30)) {
    const alive = game.combatants.filter((c) => c.alive).length;
    const stuckCount = botStuck(game);
    stuck = Math.max(stuck, stuckCount);
    console.log(`[${simTime.toFixed(0)}s] ${game.phase} 存活${alive}/10 卡住${stuckCount} 比分${game.scoreT}:${game.scoreCT} ${game.roundEndText}`);
  }
}
const elapsed = Date.now() - start;

console.log('\n===== 仿真结果 =====');
console.log(`仿真时长: ${simTime.toFixed(0)}s (真实耗时 ${elapsed}ms)`);
console.log(`回合数: ${stats.rounds}  安放: ${stats.plants}  拆除: ${stats.defuses}  爆炸: ${stats.explosions}`);
console.log(`比分: ${game.scoreT} : ${game.scoreCT}`);
console.log(`NaN: ${nan ? 'FAIL' : 'OK'}  最大卡住数: ${stuck}`);
const player = game.combatants[game.playerIdx];
console.log(`玩家 ${player.name}: ${player.kills} 杀 ${player.deaths} 死`);
const tAlive = game.combatants.filter((c) => c.team === 'T' && c.alive).length;
const ctAlive = game.combatants.filter((c) => c.team === 'CT' && c.alive).length;
console.log(`存活 T:${tAlive} CT:${ctAlive}`);
console.log(stats.rounds >= 2 && !nan ? '\n=== 仿真通过 ===' : '\n=== 仿真异常 ===');
if (stats.rounds < 2 || nan) throw new Error('仿真未达标：回合不足或出现 NaN');

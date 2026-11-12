// Headless simulation harness: runs bot-only matches in Node to validate the
// map, navigation, AI, combat and round/bomb logic without a browser.
//   node --experimental-strip-types src/game/core/headless.ts [rounds] [difficulty]

// Minimal declaration so `tsc` passes without @types/node.
declare const process: { argv: string[] };

import { CELL_WALL, COLS, worldToCell } from './map.ts';
import { Sim } from './sim.ts';
import type { Difficulty } from './constants.ts';
import { TICK } from './constants.ts';

const rounds = Number(process.argv[2] ?? 12);
const difficulty = (process.argv[3] ?? 'normal') as Difficulty;

const sim = new Sim({
  playerTeam: 'CT',
  difficulty,
  startWithPistolRound: true,
  winsToMatch: 99,
  playerName: 'Player',
});

function botifyPlayer() {
  // let the AI drive the "player" entity too
  sim.player.isBot = true;
  sim.controlledId = -1;
}
botifyPlayer();

const stats = { T: 0, CT: 0, planted: 0, defused: 0, exploded: 0, kills: 0, headshots: 0, wallViolations: 0, shots: 0 };
const reasons: Record<string, number> = {};
const weaponKills: Record<string, number> = {};
let roundsDone = 0;
let roundStartTime = 0;
let lastRound = sim.round;
const moved = new Map<number, number>();
const t0 = Date.now();
let ticks = 0;

while (roundsDone < rounds && ticks < 60 * 60 * 60) {
  sim.step(TICK);
  ticks++;
  if (sim.round !== lastRound) {
    lastRound = sim.round;
    botifyPlayer();
    roundStartTime = sim.time;
  }
  for (const e of sim.entities) {
    if (!e.alive) continue;
    moved.set(e.id, (moved.get(e.id) ?? 0) + Math.hypot(e.pos.x - e.prevPos.x, e.pos.z - e.prevPos.z));
    const [c, r] = worldToCell(e.pos.x, e.pos.z);
    if (sim.map.grid[r * COLS + c] === CELL_WALL) {
      // allow the radius to overlap the edge but not the centre
      stats.wallViolations++;
    }
  }
  for (const ev of sim.events) {
    switch (ev.type) {
      case 'shot':
        stats.shots++;
        break;
      case 'kill':
        stats.kills++;
        if (ev.headshot) stats.headshots++;
        weaponKills[ev.weapon] = (weaponKills[ev.weapon] ?? 0) + 1;
        break;
      case 'planted':
        stats.planted++;
        console.log(`   [${(sim.time - roundStartTime).toFixed(1)}s] bomb planted at ${ev.site}`);
        break;
      case 'defused':
        stats.defused++;
        break;
      case 'explode':
        stats.exploded++;
        break;
      case 'roundEnd': {
        roundsDone++;
        stats[ev.winner]++;
        reasons[ev.reason] = (reasons[ev.reason] ?? 0) + 1;
        const alive = sim.entities.filter((e) => e.alive).map((e) => `${e.team}:${e.name}(${e.hp})`);
        console.log(
          `Round ${sim.round} [${sim.roundType}] plan=${sim.plan.site} → ${ev.winner} (${ev.reason}) after ${(sim.time - roundStartTime - 5).toFixed(1)}s; alive: ${alive.join(' ')}`,
        );
        break;
      }
    }
  }
  sim.events.length = 0;
}

const ms = Date.now() - t0;
console.log('\n=== Summary ===');
console.log(`rounds=${roundsDone} simulated ${(ticks * TICK).toFixed(0)}s in ${ms}ms (${((ticks * TICK * 1000) / ms).toFixed(0)}x realtime)`);
console.log('wins', { T: stats.T, CT: stats.CT });
console.log('reasons', reasons);
console.log('bomb', { planted: stats.planted, defused: stats.defused, exploded: stats.exploded });
console.log('kills', stats.kills, 'headshots', stats.headshots, 'shots', stats.shots, 'byWeapon', weaponKills);
console.log('wall violations (entity centre inside wall cell)', stats.wallViolations);
console.log(
  'distance moved per entity (m):',
  sim.entities.map((e) => `${e.team}:${e.name}=${(moved.get(e.id) ?? 0).toFixed(0)}`).join(' '),
);

// Headless 5v5 match: every character is a bot. Verifies rounds end properly, bots navigate,
// fight, plant and defuse, and that nobody ever ends up inside a wall.
import { Sim, TICK } from '../src/core/sim.ts';
import { bodyOverlaps } from '../src/core/physics.ts';

const rounds = Number(process.argv[2] ?? 12);
const difficulty = (process.argv[3] ?? 'normal') as 'easy' | 'normal' | 'hard';
const sim = new Sim({
  playerTeam: 'CT',
  difficulty,
  allPistolRounds: false,
  winsToMatch: 99,
  autopilot: true,
  playerName: 'Player',
});
sim.start();

const stats = {
  kills: 0,
  headshots: 0,
  planted: 0,
  defused: 0,
  exploded: 0,
  shots: 0,
  hits: 0,
  pickups: 0,
  drops: 0,
  stuckInWall: 0,
  weaponKills: {} as Record<string, number>,
  hitGroups: {} as Record<string, number>,
};
const reasons: Record<string, number> = {};
let roundsDone = 0;
let roundStartTime = 0;
const roundDurations: number[] = [];
let maxStepMs = 0;
let totalMs = 0;
let ticks = 0;
const tStart = performance.now();
let lastRoundLog = '';

while (roundsDone < rounds && sim.time < rounds * 200) {
  const a = performance.now();
  sim.step(TICK);
  const el = performance.now() - a;
  totalMs += el;
  ticks++;
  if (el > maxStepMs && sim.time > 2) maxStepMs = el;
  for (const e of sim.events) {
    if (e.type === 'kill') {
      stats.kills++;
      if (e.headshot) stats.headshots++;
      stats.weaponKills[e.weapon] = (stats.weaponKills[e.weapon] ?? 0) + 1;
    } else if (e.type === 'shot') {
      stats.shots++;
      if (e.hitChar >= 0) stats.hits++;
    } else if (e.type === 'damage') {
      stats.hitGroups[e.group] = (stats.hitGroups[e.group] ?? 0) + 1;
    } else if (e.type === 'bomb') {
      if (e.action === 'planted') stats.planted++;
      if (e.action === 'defused') stats.defused++;
      if (e.action === 'exploded') stats.exploded++;
      if (e.action === 'pickup') stats.pickups++;
      if (e.action === 'drop') stats.drops++;
    } else if (e.type === 'round_end') {
      roundsDone++;
      reasons[`${e.winner}:${e.reason}`] = (reasons[`${e.winner}:${e.reason}`] ?? 0) + 1;
      const dur = sim.time - roundStartTime;
      roundDurations.push(dur);
      const alive = `T${sim.aliveCount('T')} CT${sim.aliveCount('CT')}`;
      lastRoundLog = `round ${sim.round.number} ${sim.round.isPistol ? '(pistol)' : ''} -> ${e.winner} by ${e.reason} after ${dur.toFixed(1)}s [${alive}] bomb=${sim.bomb.state}${sim.bomb.site ? '@' + sim.bomb.site : ''}`;
      console.log(lastRoundLog);
    } else if (e.type === 'round_start') {
      roundStartTime = sim.time;
    }
  }
  sim.events.length = 0;
  if (sim.tick % 30 === 0) {
    for (const c of sim.chars) {
      if (!c.alive) continue;
      if (bodyOverlaps(sim.world, c.pos.x, c.pos.y, c.pos.z, c.body.radius * 0.9, c.body.height)) {
        stats.stuckInWall++;
        if (stats.stuckInWall < 5) console.log('IN WALL', c.name, c.team, c.pos);
      }
      if (sim.world.floorAt(c.pos.x, c.pos.z) === null) {
        stats.stuckInWall++;
        if (stats.stuckInWall < 5) console.log('OUTSIDE MAP', c.name, c.pos);
      }
    }
  }
  // periodic state dump if a round takes very long
  if (sim.round.phase === 'live' && sim.tick % (60 * 30) === 0 && process.argv.includes('--verbose')) {
    for (const c of sim.chars) {
      const b = sim.brains[c.id]!;
      console.log(
        `  t=${sim.time.toFixed(0)} ${c.team} ${c.name.padEnd(8)} alive=${c.alive} hp=${c.health} st=${b.state} pos=(${c.pos.x.toFixed(1)},${c.pos.z.toFixed(1)}) route=${b.routeId}:${b.routeIdx}/${b.route.length}`,
      );
    }
  }
}
const wall = performance.now() - tStart;
console.log('---');
console.log('results', reasons);
console.log('score', sim.round.score);
console.log(stats);
console.log(
  `avg round ${(roundDurations.reduce((a, b) => a + b, 0) / Math.max(1, roundDurations.length)).toFixed(1)}s, accuracy ${((stats.hits / Math.max(1, stats.shots)) * 100).toFixed(1)}%`,
);
console.log(`sim perf: ${(totalMs / ticks).toFixed(3)} ms/tick avg, worst ${maxStepMs.toFixed(1)} ms, wall ${(wall / 1000).toFixed(1)}s for ${sim.time.toFixed(0)}s game time`);
console.log('KD:', sim.chars.map((c) => `${c.team}:${c.name} ${c.kills}/${c.deaths}`).join(', '));

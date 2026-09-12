/**
 * Head-less verification of the whole simulation layer.
 * Runs a full match of bot-vs-bot Dust2 at the real 64 Hz tick rate and
 * asserts the invariants that matter: nobody clips into geometry, nobody falls
 * out of the world, rounds actually resolve, and the bomb loop works.
 *
 *   node --experimental-strip-types tools/verify.ts [seconds] [seed]
 */
import { GameEngine, TICK_DT } from '../src/game/engine.ts';
import type { Actor } from '../src/game/actor.ts';

const simSeconds = Number(process.argv[2] ?? 420);
const seed = Number(process.argv[3] ?? 1337);
const engine = new GameEngine({ seed, botSkill: 0.6, playerTeam: 'CT' });

// No human here: let the AI drive the player's body too.
const makeAllBots = () => {
  for (const a of engine.actors) a.isBot = true;
};
engine.bus.on('roundStart', makeAllBots);
makeAllBots();

interface Stats {
  rounds: number;
  reasons: Record<string, number>;
  kills: number;
  headshots: number;
  shots: number;
  plants: number;
  defuses: number;
  explosions: number;
  pickups: number;
  wallErrors: number;
  boundsErrors: number;
  nanErrors: number;
  maxStuck: number;
  stuckSamples: number;
  ctWins: number;
  tWins: number;
  weaponKills: Record<string, number>;
}

const stats: Stats = {
  rounds: 0,
  reasons: {},
  kills: 0,
  headshots: 0,
  shots: 0,
  plants: 0,
  defuses: 0,
  explosions: 0,
  pickups: 0,
  wallErrors: 0,
  boundsErrors: 0,
  nanErrors: 0,
  maxStuck: 0,
  stuckSamples: 0,
  ctWins: 0,
  tWins: 0,
  weaponKills: {},
};

engine.bus.on('roundEnd', ({ winner, reason }) => {
  stats.rounds++;
  stats.reasons[reason] = (stats.reasons[reason] ?? 0) + 1;
  if (winner === 'CT') stats.ctWins++;
  else stats.tWins++;
});
engine.bus.on('shot', () => stats.shots++);
engine.bus.on('bombPlanted', () => stats.plants++);
engine.bus.on('bombDefused', () => stats.defuses++);
engine.bus.on('bombExploded', () => stats.explosions++);
engine.bus.on('bombPickup', () => stats.pickups++);
engine.bus.on('kill', ({ headshot }) => {
  stats.kills++;
  if (headshot) stats.headshots++;
});
engine.bus.on('death', ({ actorId }) => {
  const a = engine.actorById(actorId);
  if (a) {
    const w = a.lastAttackerId >= 0 ? engine.actorById(a.lastAttackerId) : null;
    const wname = w ? (w.weapons[w.activeSlot]?.id ?? 'knife') : 'world';
    stats.weaponKills[wname] = (stats.weaponKills[wname] ?? 0) + 1;
  }
});

// Track per-actor idleness to catch bots wedged against geometry.
const idle = new Map<number, number>();
const lastPos = new Map<number, { x: number; z: number }>();

function checkActor(a: Actor): void {
  const g = engine.world.grid;
  if (!Number.isFinite(a.pos.x) || !Number.isFinite(a.pos.y) || !Number.isFinite(a.pos.z)) {
    stats.nanErrors++;
    return;
  }
  if (a.pos.x < g.minX || a.pos.x > g.maxX || a.pos.z < g.minZ || a.pos.z > g.maxZ) {
    stats.boundsErrors++;
    return;
  }
  if (a.pos.y < -3 || a.pos.y > 12) stats.boundsErrors++;
  if (!a.alive) return;
  // Centre must never be inside solid rock.
  if (g.isSolidAt(a.pos.x, a.pos.z)) stats.wallErrors++;

  const p = lastPos.get(a.id);
  const moved = p ? Math.hypot(a.pos.x - p.x, a.pos.z - p.z) : 1;
  lastPos.set(a.id, { x: a.pos.x, z: a.pos.z });
  const wantsToMove = a.ai.mode === 'advance' || a.ai.mode === 'rotate' || a.ai.mode === 'hunt';
  if (wantsToMove && moved < 0.004) {
    const t = (idle.get(a.id) ?? 0) + TICK_DT;
    idle.set(a.id, t);
    stats.maxStuck = Math.max(stats.maxStuck, t);
    if (t > 3) stats.stuckSamples++;
  } else {
    idle.set(a.id, 0);
  }
}

const totalTicks = Math.floor(simSeconds / TICK_DT);
const t0 = Date.now();
for (let i = 0; i < totalTicks; i++) {
  engine.step(TICK_DT);
  if (i % 4 === 0) for (const a of engine.actors) checkActor(a);
}
const wall = Date.now() - t0;

const bombActivity = stats.plants + stats.defuses + stats.explosions;
console.log('--- simulation ---------------------------------------------');
console.log(`seed             : ${seed}`);
console.log(`sim time         : ${simSeconds}s (${totalTicks} ticks) in ${wall}ms wall`);
console.log(`speed            : ${(simSeconds / (wall / 1000)).toFixed(1)}x realtime, ${(wall / totalTicks).toFixed(3)}ms/tick`);
console.log(`rounds finished  : ${stats.rounds}  (CT ${stats.ctWins} : ${stats.tWins} T)`);
console.log(`end reasons      : ${JSON.stringify(stats.reasons)}`);
console.log(`shots / kills    : ${stats.shots} / ${stats.kills} (headshots ${stats.headshots})`);
console.log(`kills by weapon  : ${JSON.stringify(stats.weaponKills)}`);
console.log(`bomb plants      : ${stats.plants}, defuses ${stats.defuses}, explosions ${stats.explosions}, pickups ${stats.pickups}`);
console.log(`score            : CT ${engine.scoreCT} - T ${engine.scoreT}, round ${engine.roundNumber}`);
console.log('--- invariants ---------------------------------------------');
console.log(`inside-wall      : ${stats.wallErrors}`);
console.log(`out-of-bounds    : ${stats.boundsErrors}`);
console.log(`NaN positions    : ${stats.nanErrors}`);
console.log(`longest stall    : ${stats.maxStuck.toFixed(2)}s (samples>3s: ${stats.stuckSamples})`);

const problems: string[] = [];
if (stats.wallErrors > 0) problems.push('actors clipped into geometry');
if (stats.boundsErrors > 0) problems.push('actors left the world');
if (stats.nanErrors > 0) problems.push('NaN positions');
if (stats.rounds < 2) problems.push('rounds are not resolving');
if (stats.kills < 5) problems.push('bots are not fighting');
if (bombActivity === 0) problems.push('bomb loop never triggered');
if (stats.maxStuck > 6) problems.push('a bot was stuck for too long');

console.log(problems.length === 0 ? '\nVERIFY OK' : `\nVERIFY FAILED: ${problems.join('; ')}`);
process.exit(problems.length === 0 ? 0 : 1);

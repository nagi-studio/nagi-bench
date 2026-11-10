// Headless smoke test for the simulation layer (no browser, no three.js needed):
//   bun run scripts/simtest.ts [rounds] [seed] [match|pistol|rifle] [--map]
import { Simulation, TICK } from '../src/sim/sim';
import { buildMap } from '../src/sim/map';

const rounds = Number(process.argv[2] ?? 6);
const seed = Number(process.argv[3] ?? 42);
const mode = (process.argv[4] ?? 'match') as 'match' | 'pistol' | 'rifle';

const t0 = performance.now();
const sim = new Simulation({ humanTeam: 'atk', mode, difficulty: 1, seed, noHuman: true });
console.log(`build: ${(performance.now() - t0).toFixed(0)} ms, boxes=${sim.world.n}, nav reachable cells=${sim.nav.reachableCount}`);

// --- nav sanity: every tactical point must be reachable from the attacker spawn
const start = sim.pts.spawns.atk[0];
let bad = 0;
const check = (name: string, p: { x: number; y: number; z: number }) => {
  const path = sim.nav.findPath(start, p);
  if (!path) {
    bad++;
    console.log('UNREACHABLE', name, p);
  }
};
for (const t of ['atk', 'def'] as const) sim.pts.spawns[t].forEach((p, i) => check(`spawn ${t}${i}`, p));
for (const s of ['A', 'B'] as const) {
  sim.pts.sites[s].plant.forEach((p, i) => check(`plant ${s}${i}`, p));
  sim.pts.sites[s].post.forEach((p, i) => check(`post ${s}${i}`, p.pos));
  sim.pts.sites[s].holds.forEach((p, i) => check(`hold ${s}${i}`, p.pos));
  for (const k of Object.keys(sim.pts.routes[s])) sim.pts.routes[s][k].forEach((p, i) => check(`route ${s}.${k}[${i}]`, p));
}
sim.pts.midHolds.forEach((p, i) => check(`mid${i}`, p.pos));
const m = buildMap();
const named: [number, number][] = [
  ...m.tac.sites.A.plant,
  ...m.tac.sites.B.plant,
  ...m.tac.spawns.atk,
  ...m.tac.spawns.def,
  ...m.tac.sites.A.holds.map((h) => h.pos),
  ...m.tac.sites.B.holds.map((h) => h.pos),
  ...m.tac.sites.A.post.map((h) => h.pos),
  ...m.tac.sites.B.post.map((h) => h.pos),
  ...m.tac.midHolds.map((h) => h.pos),
];
for (const [x, z] of named) {
  const p = sim.nav.project(x, z, 0);
  const d = Math.hypot(p.x - x, p.z - z);
  if (d > 0.6) console.log('point moved by projection', x, z, '->', p.x.toFixed(2), p.z.toFixed(2));
}
const far = sim.nav.findPath(start, sim.pts.sites.A.plant[0]);
if (far) console.log(`path spawn->A: ${far.length} waypoints, ${sim.nav.pathLength(start, far).toFixed(1)} m`);
console.log(`gantry floor y=${sim.nav.project(5, -15, 2).y}, stairs mid y=${sim.nav.project(-8, -8, 1).y.toFixed(2)}`);
if (process.argv.includes('--map')) {
  const nav = sim.nav;
  for (let r = 0; r < nav.rows; r += 2) {
    let line = '';
    for (let c = 0; c < nav.cols; c += 2) {
      const i = r * nav.cols + c;
      line += !nav.valid[i] ? '#' : !nav.reachable[i] ? '?' : nav.floor[i] > 1.5 ? '=' : nav.floor[i] > 0.1 ? '/' : nav.clearance[i] < 2 ? ',' : '.';
    }
    console.log(line);
  }
}

// --- play rounds
let roundStart = 0;
const stats: Record<string, number> = { atk: 0, def: 0, elim: 0, time: 0, bomb: 0, defuse: 0, plants: 0, shots: 0, hits: 0, hs: 0, kills: 0 };
const t1 = performance.now();
let ticks = 0;
let guard = 0;
const verbose = process.argv.includes('--verbose');
while (sim.round.phase !== 'matchover' && sim.round.num <= rounds && guard++ < 60 * 60 * 60) {
  sim.tick(TICK);
  ticks++;
  for (const e of sim.events) {
    if (e.type === 'round' && e.kind === 'start') {
      roundStart = sim.time;
    } else if (e.type === 'round' && e.kind === 'end') {
      stats[e.winner as string]++;
      stats[e.reason as string]++;
      console.log(
        `round ${sim.round.num} (${sim.round.pistol ? 'pistol' : 'rifle'}): ${e.winner} wins by ${e.reason} after ${(sim.time - roundStart).toFixed(1)}s  alive atk=${sim.aliveCount('atk')} def=${sim.aliveCount('def')}  site=${sim.tactics.atk.site} bomb=${sim.round.bomb.status}`,
      );
    } else if (e.type === 'bomb' && e.kind === 'planted') {
      stats.plants++;
      if (verbose) console.log(`   t=${(sim.time - roundStart).toFixed(1)} planted by ${sim.actors[e.actor].name}`);
    } else if (e.type === 'bomb' && verbose && e.kind !== 'beep') {
      console.log(`   t=${(sim.time - roundStart).toFixed(1)} bomb ${e.kind} ${e.actor >= 0 ? sim.actors[e.actor].name : ''}`);
    } else if (e.type === 'shot') stats.shots++;
    else if (e.type === 'hit') {
      stats.hits++;
      if (e.zone === 'head') stats.hs++;
    } else if (e.type === 'kill') {
      stats.kills++;
      if (verbose)
        console.log(
          `   t=${(sim.time - roundStart).toFixed(1)} ${e.killer >= 0 ? sim.actors[e.killer].name : '-'} [${e.weapon}${e.headshot ? ' HS' : ''}] ${sim.actors[e.victim].name}`,
        );
    }
  }
  sim.events.length = 0;
  // sanity: nobody leaves the world or falls through the floor
  for (const a of sim.actors) {
    if (a.pos.y < -0.5 || a.pos.y > 6 || Number.isNaN(a.pos.x) || Number.isNaN(a.yaw)) {
      console.log('BAD POSITION', a.name, a.pos, a.yaw);
      process.exit(1);
    }
  }
}
const dtMs = performance.now() - t1;
console.log(`simulated ${(ticks / 60).toFixed(0)} s in ${dtMs.toFixed(0)} ms (${((dtMs / ticks) * 1000).toFixed(0)} us/tick)`);
console.log('score', JSON.stringify(sim.round.score), JSON.stringify(stats));
console.log('stuck events per bot', sim.brains.map((b) => b.stuckEvents).join(','));
console.log('hard stucks', sim.brains.map((b) => b.stuckLog.join(' ')).filter((x) => x).join(' | '));
console.log('K/D', sim.actors.map((a) => `${a.name}:${a.kills}/${a.deaths}`).join(' '));
if (bad) process.exit(1);

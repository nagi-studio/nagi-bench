// Headless full-match simulation: 10 bots play complete rounds. Validates the
// AI state machine, navigation, combat, C4 plant/defuse and round flow without
// any rendering. Run: node --import ./scripts/register.mjs scripts/sim-test.ts
import { GameSim } from '../src/game/simulation';
import { emptyInput } from '../src/game/types';
import { cellAt, walkable } from '../src/game/map';

const seeds = [1, 7, 42, 1337, 20260722];
const dt = 1 / 60;
let failures = 0;
const totals = { rounds: 0, plants: 0, defuses: 0, explosions: 0, elims: 0, timeouts: 0, kills: 0 };

for (const seed of seeds) {
  const sim = new GameSim({ seed, allBots: true });
  let t = 0;
  let rounds = 0;
  let plants = 0;
  let defuses = 0;
  let explosions = 0;
  let elims = 0;
  let timeouts = 0;
  let kills = 0;
  let badPos = 0;
  let nanSeen = 0;
  const maxT = 60 * 40; // up to 40 simulated minutes
  while (sim.phase !== 'matchend' && t < maxT) {
    sim.update(dt, emptyInput());
    t += dt;
    for (const ev of sim.drainEvents()) {
      if (ev.type === 'roundEnd') {
        rounds++;
        if (ev.reason === 'defuse') defuses++;
        else if (ev.reason === 'explosion') explosions++;
        else if (ev.reason === 'elimination') elims++;
        else timeouts++;
      } else if (ev.type === 'planted') plants++;
      else if (ev.type === 'kill') kills++;
    }
    // sanity: positions finite & inside walkable space (allow crate tops)
    if (Math.floor(t * 60) % 60 === 0) {
      for (const c of sim.combatants) {
        if (!Number.isFinite(c.pos.x + c.pos.y + c.pos.z)) nanSeen++;
        if (!c.alive) continue;
        const { c: cc, r } = cellAt(sim.map, c.pos.x, c.pos.z);
        if (!walkable(sim.map, cc, r)) badPos++;
      }
    }
  }
  const finished = sim.phase === 'matchend';
  console.log(
    `seed ${seed}: ${finished ? 'MATCH COMPLETE' : 'TIMEOUT!!'} rounds=${rounds} ` +
    `score CT ${sim.scores.CT} - T ${sim.scores.T} plants=${plants} defuses=${defuses} ` +
    `booms=${explosions} elims=${elims} timeouts=${timeouts} kills=${kills} ` +
    `badPos=${badPos} nan=${nanSeen} simTime=${t.toFixed(0)}s`,
  );
  if (!finished || nanSeen > 0 || badPos > 0 || rounds < 8) failures++;
  totals.rounds += rounds;
  totals.plants += plants;
  totals.defuses += defuses;
  totals.explosions += explosions;
  totals.elims += elims;
  totals.timeouts += timeouts;
  totals.kills += kills;
}

console.log('totals:', JSON.stringify(totals));
if (totals.plants === 0) {
  console.error('FAIL: no C4 plants across all seeds — T AI never plants');
  failures++;
}
if (totals.defuses + totals.explosions === 0) {
  console.error('FAIL: planted bombs never resolved');
  failures++;
}
if (totals.kills === 0) {
  console.error('FAIL: no kills — combat broken');
  failures++;
}
console.log(failures === 0 ? '\nSIM TEST PASSED' : `\nSIM TEST: ${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);

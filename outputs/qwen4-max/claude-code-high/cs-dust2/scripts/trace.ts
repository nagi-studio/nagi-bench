import { GameSim } from '../src/game/simulation';
import { emptyInput } from '../src/game/types';

const seed = Number(process.argv[2] ?? 7);
const sim = new GameSim({ seed, allBots: true });
const dt = 1 / 60;
let t = 0;
let round = 1;
let logT = 0;
while (sim.phase !== 'matchend' && t < 60 * 12) {
  sim.update(dt, emptyInput());
  t += dt;
  for (const ev of sim.drainEvents()) {
    if (ev.type === 'roundStart') {
      round = ev.round;
      console.log(`\n--- round ${ev.round} pistol=${ev.pistol} ---`);
    }
    if (ev.type === 'roundEnd') console.log(`round ${round} end: ${ev.winner} by ${ev.reason} (t=${t.toFixed(0)})`);
    if (ev.type === 'planted') console.log(`  PLANTED by ${ev.by} at ${ev.pos.x.toFixed(0)},${ev.pos.z.toFixed(0)} t=${t.toFixed(0)}`);
    if (ev.type === 'bombDrop') console.log(`  bomb dropped at ${ev.pos.x.toFixed(0)},${ev.pos.z.toFixed(0)} t=${t.toFixed(0)}`);
    if (ev.type === 'bombPickup') console.log(`  bomb picked up by ${ev.by} t=${t.toFixed(0)}`);
  }
  logT -= dt;
  if (logT <= 0 && sim.phase === 'live') {
    logT = 10;
    const b = sim.bomb;
    const carrier = b.carrier >= 0 ? sim.byId(b.carrier) : null;
    const ts = sim.combatants.filter((c) => c.team === 'T' && c.alive)
      .map((c) => `${c.id}:${c.bot?.state}@${c.pos.x.toFixed(0)},${c.pos.z.toFixed(0)}${c.hasBomb ? '*' : ''}`).join(' ');
    const cts = sim.combatants.filter((c) => c.team === 'CT' && c.alive)
      .map((c) => `${c.id}:${c.bot?.state}@${c.pos.x.toFixed(0)},${c.pos.z.toFixed(0)}`).join(' ');
    console.log(`t=${t.toFixed(0)} bomb=${b.state}${carrier ? ` carrier=${carrier.id}(${carrier.bot?.state})@${carrier.pos.x.toFixed(0)},${carrier.pos.z.toFixed(0)}` : ''} | T: ${ts} | CT: ${cts}`);
  }
}

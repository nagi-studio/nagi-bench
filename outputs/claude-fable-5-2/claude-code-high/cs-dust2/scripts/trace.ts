// Kill-by-kill trace of a few bot-vs-bot rounds:  bun run scripts/trace.ts [seed] [rounds] [mode]
import { zoneName } from '../src/sim/map';
import { dist3D } from '../src/sim/math';
import { Simulation, TICK } from '../src/sim/sim';

const seed = Number(process.argv[2] ?? 101);
const rounds = Number(process.argv[3] ?? 4);
const mode = (process.argv[4] ?? 'rifle') as 'match' | 'pistol' | 'rifle';
const sim = new Simulation({ humanTeam: 'atk', mode, difficulty: 1, seed, noHuman: true });
let start = 0;
let guard = 0;
while (sim.round.num <= rounds && sim.round.phase !== 'matchover' && guard++ < 60 * 60 * 30) {
  sim.tick(TICK);
  for (const e of sim.events) {
    const t = (sim.time - start).toFixed(1).padStart(5);
    if (e.type === 'round' && e.kind === 'start') {
      start = sim.time;
      console.log(`\n=== round ${sim.round.num}: attackers go ${sim.tactics.atk.site}`);
    } else if (e.type === 'round' && e.kind === 'end') {
      console.log(`${t}  >>> ${e.winner} wins (${e.reason})  atk=${sim.aliveCount('atk')} def=${sim.aliveCount('def')}`);
    } else if (e.type === 'kill' && e.killer >= 0) {
      const k = sim.actors[e.killer];
      const v = sim.actors[e.victim];
      console.log(
        `${t}  ${k.team} ${k.name}(${sim.brains[k.id].state}, ${zoneName(sim.map, k.pos.x, k.pos.z)}) -> ${v.name}(${sim.brains[v.id].state}, ${zoneName(sim.map, v.pos.x, v.pos.z)})  ${dist3D(k.pos, v.pos).toFixed(0)}m ${e.weapon}${e.headshot ? ' HS' : ''}`,
      );
    } else if (e.type === 'bomb' && e.kind !== 'beep') {
      console.log(`${t}  bomb ${e.kind}`);
    }
  }
  sim.events.length = 0;
}

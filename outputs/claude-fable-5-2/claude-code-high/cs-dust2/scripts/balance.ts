// Bot-vs-bot balance sweep:  bun run scripts/balance.ts [seeds] [mode]
import { Simulation, TICK } from '../src/sim/sim';

const seeds = Number(process.argv[2] ?? 8);
const mode = (process.argv[3] ?? 'rifle') as 'match' | 'pistol' | 'rifle';
const total: Record<string, number> = { atk: 0, def: 0, elim: 0, time: 0, bomb: 0, defuse: 0, plants: 0, rounds: 0, secs: 0, stuck: 0, hard: 0 };
const bySite: Record<string, number> = { A: 0, B: 0, Aw: 0, Bw: 0 };
const diag = { atkAtPlant: 0, defAtPlant: 0, plantTime: 0 };
const killsBy: Record<string, number> = {};
for (let s = 1; s <= seeds; s++) {
  const sim = new Simulation({ humanTeam: 'atk', mode, difficulty: 1, seed: s * 101, noHuman: true });
  let start = 0;
  let guard = 0;
  while (sim.round.phase !== 'matchover' && guard++ < 60 * 60 * 60) {
    sim.tick(TICK);
    for (const e of sim.events) {
      if (e.type === 'round' && e.kind === 'start') start = sim.time;
      else if (e.type === 'round' && e.kind === 'end') {
        total[e.winner as string]++;
        total[e.reason as string]++;
        total.rounds++;
        total.secs += sim.time - start;
        bySite[sim.tactics.atk.site]++;
        if (e.winner === 'atk') bySite[sim.tactics.atk.site + 'w']++;
      } else if (e.type === 'bomb' && e.kind === 'planted') {
        total.plants++;
        diag.atkAtPlant += sim.aliveCount('atk');
        diag.defAtPlant += sim.aliveCount('def');
        diag.plantTime += sim.time - start;
      } else if (e.type === 'kill' && e.killer >= 0) {
        const k = sim.actors[e.killer];
        const st = sim.brains[k.id].state;
        const key = `${k.team}:${st}`;
        killsBy[key] = (killsBy[key] ?? 0) + 1;
        const v = sim.actors[e.victim];
        const key2 = `died ${v.team}:${sim.brains[v.id].state}`;
        killsBy[key2] = (killsBy[key2] ?? 0) + 1;
      }
    }
    sim.events.length = 0;
  }
  for (const b of sim.brains) {
    total.stuck += b.stuckEvents;
    total.hard += b.stuckLog.length;
  }
}
console.log(JSON.stringify(total));
console.log(`attackers win ${((total.atk / total.rounds) * 100).toFixed(0)}% of ${total.rounds} rounds, avg round ${(total.secs / total.rounds).toFixed(0)} s, plant rate ${((total.plants / total.rounds) * 100).toFixed(0)}%`);
console.log(`site A: ${bySite.Aw}/${bySite.A} attacker wins, site B: ${bySite.Bw}/${bySite.B}`);
console.log(`at plant: ${(diag.atkAtPlant / total.plants).toFixed(2)} attackers vs ${(diag.defAtPlant / total.plants).toFixed(2)} defenders alive, avg plant time ${(diag.plantTime / total.plants).toFixed(0)} s`);
console.log(Object.entries(killsBy).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join('  '));

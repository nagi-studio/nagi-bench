// Scenario tests for the bomb flow (plant / defuse / explode / drop / pickup).
//   node --experimental-strip-types scripts/scenarios.ts
import { Sim } from '../src/game/core/sim.ts';
import { TICK } from '../src/game/core/constants.ts';
import { cellCenter } from '../src/game/core/map.ts';

type Hook = (sim: Sim) => void;

function run(label: string, setup: Hook, perTick: Hook | null, maxT = 170) {
  const sim = new Sim({ playerTeam: 'T', difficulty: 'normal', startWithPistolRound: false, winsToMatch: 99, playerName: 'P' });
  sim.player.isBot = true;
  sim.controlledId = -1;
  let did = false;
  const log: string[] = [];
  const types = ['planted', 'defused', 'explode', 'roundEnd', 'defuseStart', 'bombDrop', 'bombPickup', 'plantStart'];
  for (let i = 0; i < maxT * 60; i++) {
    if (sim.phase === 'live' && !did) {
      did = true;
      setup(sim);
    }
    sim.step(TICK);
    if (did && perTick) perTick(sim);
    for (const ev of sim.events) {
      if (types.includes(ev.type)) log.push(`${sim.time.toFixed(1)} ${JSON.stringify(ev)}`);
    }
    sim.events.length = 0;
    if (sim.phase === 'post') break;
  }
  console.log(`--- ${label}\n  ` + log.join('\n  '));
}

function teleport(sim: Sim, name: string | null, c: number, r: number) {
  const e = name ? sim.entities.find((x) => x.name === name)! : sim.entities.find((x) => x.hasBomb)!;
  const p = cellCenter(c, r);
  e.pos.x = p.x;
  e.pos.z = p.z;
}

run(
  'plant, then all T die -> CT must retake & defuse',
  (sim) => {
    if (sim.plan.site === 'B') teleport(sim, null, 9, 7);
    else teleport(sim, null, 46, 9);
    // keep the planter alive long enough to finish the plant
    sim.entities.find((e) => e.hasBomb)!.hp = 1e6;
  },
  (sim) => {
    if (sim.bomb.state === 'planted') for (const e of sim.entities) if (e.team === 'T' && e.alive) sim.kill(e, null, 'test', false);
  },
);

run(
  'plant, CTs removed except one pinned in spawn -> explode',
  (sim) => {
    // teleport the carrier into whichever site the T plan targets this round
    if (sim.plan.site === 'B') teleport(sim, null, 9, 7);
    else teleport(sim, null, 46, 9);
  },
  (sim) => {
    for (const e of sim.entities) if (e.team === 'CT' && e.alive && e.name !== 'Atlas') sim.kill(e, null, 'test', false);
    const a = sim.entities.find((e) => e.name === 'Atlas')!;
    if (a.alive) {
      a.hp = 1e6; // keep the last CT alive so only the bomb can end the round
      const p = cellCenter(28, 5);
      a.pos.x = p.x;
      a.pos.z = p.z;
    }
  },
);

run(
  'carrier killed at round start -> drop -> pickup',
  (sim) => {
    const carrier = sim.entities.find((e) => e.hasBomb)!;
    sim.kill(carrier, null, 'test', false);
  },
  null,
  40,
);

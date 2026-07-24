/** Throwaway diagnostic: where and how do bots die? node tools/balance.ts */

import { emptyInput } from '../src/game/playerinput.ts';
import { GameWorld } from '../src/game/world.ts';

const deathsByArea: Record<string, number> = {};
const deathsByTeam: Record<string, number> = { CT: 0, T: 0 };
const stateAtDeath: Record<string, number> = {};
const reasons: Record<string, number> = {};
const firstBloodTeam: Record<string, number> = { CT: 0, T: 0 };

const TICK = 1 / 64;
for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
  const world = new GameWorld({ seed, playerTeam: 'CT', botSkill: 0.55 });
  world.actors[world.playerHomeId].controller = 'bot';
  world.playerActorId = -1;
  const input = emptyInput();
  const start = world.round.round;
  let roundFirstBlood = true;

  while (world.round.round < start + 6 && world.round.phase !== 'matchOver') {
    world.events.length = 0;
    world.tick(TICK, input);
    for (const ev of world.events) {
      if (ev.type === 'kill') {
        const victim = world.actors[ev.victim];
        deathsByArea[`${victim.team}:${victim.areaLabel}`] = (deathsByArea[`${victim.team}:${victim.areaLabel}`] ?? 0) + 1;
        deathsByTeam[victim.team]++;
        const brain = world.brainFor(ev.victim);
        if (brain) stateAtDeath[`${victim.team}:${brain.debugState}`] = (stateAtDeath[`${victim.team}:${brain.debugState}`] ?? 0) + 1;
        if (roundFirstBlood) {
          firstBloodTeam[victim.team]++;
          roundFirstBlood = false;
        }
      } else if (ev.type === 'roundEnd') {
        reasons[`${ev.winner}:${ev.reason}`] = (reasons[`${ev.winner}:${ev.reason}`] ?? 0) + 1;
        roundFirstBlood = true;
      }
    }
  }
}

const sorted = (o: Record<string, number>) =>
  Object.entries(o)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}=${v}`)
    .join('  ');

console.log('round results :', sorted(reasons));
console.log('deaths by team:', sorted(deathsByTeam));
console.log('first deaths  :', sorted(firstBloodTeam));
console.log('state at death:', sorted(stateAtDeath));
console.log('death spots   :', sorted(deathsByArea));

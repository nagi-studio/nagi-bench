import { World } from '../src/core/world.ts';
import { NavGrid } from '../src/core/nav.ts';
import { SPAWNS, BOMBSITES } from '../src/core/mapData.ts';

const nav = new NavGrid(new World());
const pairs: [number, number, number, number][] = [
  [...SPAWNS.T[0], ...BOMBSITES.A.plant],
  [...SPAWNS.T[0], ...BOMBSITES.B.plant],
  [...SPAWNS.CT[0], ...BOMBSITES.B.plant],
  [...SPAWNS.T[0], ...SPAWNS.CT[0]],
  [...BOMBSITES.A.plant, ...BOMBSITES.B.plant],
];
for (let round = 0; round < 3; round++) {
  const times: string[] = [];
  for (const p of pairs) {
    const a = performance.now();
    nav.findPath(p[0], p[1], p[2], p[3]);
    times.push((performance.now() - a).toFixed(2));
  }
  console.log('run', round, times.join(' '));
}

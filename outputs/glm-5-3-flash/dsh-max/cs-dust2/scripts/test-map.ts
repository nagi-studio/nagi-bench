/**
 * Offline map validation: prints the generated Dust2 layout as ASCII and
 * verifies every key area is mutually reachable (A* on the nav grid).
 * Run with:  npm run test:map
 */
import { World } from '../src/game/world';
import { POINTS } from '../src/game/mapdata';

const w = new World();
console.log(`grid ${w.gx} x ${w.gz}  world x:[${w.minX.toFixed(1)}, ${(w.minX + w.gx * 1.5).toFixed(1)}] z:[${w.minZ.toFixed(1)}, ${(w.minZ + w.gz * 1.5).toFixed(1)}]`);
console.log(`colliders: ${w.colliders.length}  wallBoxes: ${w.wallBoxes.length}  floorBoxes: ${w.floorBoxes.length}`);
console.log(w.ascii(2));

const routes: [string, string][] = [
  ['t_spawn_1', 'ct_spawn_1'],
  ['t_spawn_1', 'a_plant'],
  ['t_spawn_1', 'b_plant'],
  ['t_spawn_1', 'mid_doors'],
  ['t_spawn_2', 'long_hall'],
  ['ct_spawn_1', 'a_plant'],
  ['ct_spawn_1', 'b_plant'],
  ['ct_spawn_3', 'short_hold'],
  ['ct_spawn_2', 'b_doors'],
  ['mid_doors', 'catwalk'],
  ['catwalk', 'a_plant'],
  ['long_doors', 'a_plant'],
  ['upper_tunnels', 'b_plant'],
  ['b_tunnels', 'top_mid'],
  ['b_hold_2', 'b_tunnel_mouth'],
  ['a_cross', 'a_plant'],
  ['pit', 'long_hall'],
  ['xbox', 'short'],
  ['ct_mid', 'mid_doors'],
  ['t_spawn_3', 'b_hold_3'],
];

let fails = 0;
for (const [a, b] of routes) {
  const pa = POINTS[a], pb = POINTS[b];
  if (!pa || !pb) { console.log(`MISSING POINT ${a} / ${b}`); fails++; continue; }
  const t0 = Date.now();
  const path = w.findPath({ x: pa.x, z: pa.z }, { x: pb.x, z: pb.z });
  const dt = Date.now() - t0;
  if (!path) { console.log(`✗ UNREACHABLE  ${a} -> ${b}`); fails++; }
  else console.log(`✓ ${a.padEnd(16)} -> ${b.padEnd(16)}  ${path.length} waypoints  ${dt}ms`);
}

// --- detect accidental cliffs (height jumps inside a single named region) ---
let cliffs = 0;
const detail: string[] = [];
for (let cz = 1; cz < w.gz - 1; cz++) {
  for (let cx = 1; cx < w.gx - 1; cx++) {
    const i = cz * w.gx + cx;
    if (w.solid[i]) continue;
    const same = (j: number) => !w.solid[j] && w.rectOf[j] === w.rectOf[i] && w.rectOf[i] >= 0
      && !w.crateCell[j] && !w.crateCell[i];
    for (const j of [i - 1, i + 1, i - w.gx, i + w.gx]) {
      if (same(j) && Math.abs(w.height[i] - w.height[j]) > 0.61) {
        cliffs++;
        if (detail.length < 12) {
          const p = w.cellCenter(cx, cz);
          detail.push(`  (${p.x.toFixed(1)},${p.z.toFixed(1)}) "${w.rectNames[w.rectOf[i]]}" ${w.height[i].toFixed(2)} vs ${w.height[j].toFixed(2)}`);
        }
      }
    }
  }
}
console.log(cliffs === 0 ? '✓ no unexpected cliffs inside regions' : `✗ ${cliffs} height discontinuities:\n${detail.join('\n')}`);
if (cliffs > 0) fails++;

console.log(fails === 0 ? '\nMAP OK' : `\nMAP FAILED (${fails})`);
process.exit(fails === 0 ? 0 : 1);

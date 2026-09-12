import { createDust2World, DUST2 } from '../src/map/dust2.ts';
import { NavGraph } from '../src/map/nav.ts';

const w = createDust2World();
const nav = new NavGraph(w);
const g = w.grid;

const pairs: [string, string][] = [
  ['t_spawn_c', 'a_site_default'],
  ['t_spawn_c', 'b_site_default'],
  ['ct_spawn_c', 'b_site_plat'],
  ['ct_spawn_c', 'a_site_pit'],
  ['t_spawn_c', 'long_corner'],
  ['t_spawn_c', 'catwalk_mid'],
  ['b_site_default', 'a_site_default'],
  ['upper_tunnel', 'b_site_back'],
  ['mid_doors', 'a_short_top'],
  ['long_doors', 'ct_spawn_c'],
];

let ok = true;
const t0 = Date.now();
for (const [an, bn] of pairs) {
  const a = w.anchor(an)!;
  const b = w.anchor(bn)!;
  const p = nav.findPath({ x: a.x, y: 0, z: a.z }, { x: b.x, y: 0, z: b.z });
  if (!p) {
    console.log(`FAIL no path ${an} -> ${bn}`);
    ok = false;
    continue;
  }
  let len = 0;
  for (let i = 1; i < p.length; i++) len += Math.hypot(p[i].x - p[i - 1].x, p[i].z - p[i - 1].z);
  // every waypoint must be standable
  for (const pt of p) {
    if (g.isSolidAt(pt.x, pt.z)) {
      console.log(`FAIL waypoint in wall ${an}->${bn} @ ${pt.x},${pt.z}`);
      ok = false;
    }
  }
  console.log(`OK   ${an.padEnd(16)} -> ${bn.padEnd(16)} waypoints=${String(p.length).padStart(3)} len=${len.toFixed(1)}m`);
}

// Random stress: 300 random pairs of open cells must all be connected.
let fails = 0;
const open: number[] = [];
for (let k = 0; k < nav.blocked.length; k++) if (!nav.blocked[k]) open.push(k);
for (let n = 0; n < 300; n++) {
  const ka = open[(Math.random() * open.length) | 0];
  const kb = open[(Math.random() * open.length) | 0];
  const ia = ka % g.nx;
  const ja = (ka - ia) / g.nx;
  const ib = kb % g.nx;
  const jb = (kb - ib) / g.nx;
  const p = nav.findPath(
    { x: g.cellCenterX(ia), y: 0, z: g.cellCenterZ(ja) },
    { x: g.cellCenterX(ib), y: 0, z: g.cellCenterZ(jb) },
  );
  if (!p) fails++;
}
const dt = Date.now() - t0;
console.log(`random pathfinding: ${300 - fails}/300 solved, total ${dt}ms`);
console.log(`nav cells: ${open.length} usable`);
console.log(ok && fails === 0 ? 'NAV OK' : 'NAV FAILED');

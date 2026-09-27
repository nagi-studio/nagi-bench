import { World } from '../src/core/world.ts';
import { NavGrid } from '../src/core/nav.ts';
import { BOMBSITES, SPAWNS, T_ROUTES, CT_HOLDS, POSTPLANT_HOLDS } from '../src/core/mapData.ts';

const t0 = performance.now();
const world = new World();
const t1 = performance.now();
const nav = new NavGrid(world);
const t2 = performance.now();
console.log(`world solids=${world.solids.length} (${(t1 - t0).toFixed(1)}ms) nav ${nav.w}x${nav.h} (${(t2 - t1).toFixed(1)}ms)`);

const pts: Record<string, [number, number]> = {
  tspawn: SPAWNS.T[0],
  ctspawn: SPAWNS.CT[0],
  A: BOMBSITES.A.plant,
  B: BOMBSITES.B.plant,
  mid: [1, 0],
  cat: [17, -15],
  long: [41, 0],
  tunnels: [-36, 10],
  ctmid: [1, -35],
  lower: [-18, -1.5],
  bdoors: [-16, -50],
};
T_ROUTES.forEach((r) => r.points.forEach((p, i) => (pts[`route_${r.id}_${i}`] = p)));
CT_HOLDS.forEach((h) => {
  pts[`hold_${h.id}`] = h.pos;
});
(['A', 'B'] as const).forEach((s) => POSTPLANT_HOLDS[s].forEach((h, i) => (pts[`pp_${s}${i}`] = h.pos)));
[...SPAWNS.T, ...SPAWNS.CT].forEach((p, i) => (pts[`spawn${i}`] = p));

let ok = true;
const comp0 = nav.componentAt(...pts.tspawn);
for (const [k, p] of Object.entries(pts)) {
  const c = nav.componentAt(p[0], p[1]);
  const free = nav.isFreeAt(p[0], p[1]);
  if (c !== comp0 || !free) {
    ok = false;
    console.log('BAD point', k, p, 'comp', c, 'free', free, 'floor', world.floorAt(p[0], p[1]));
  }
}
const pairs: [string, string][] = [
  ['tspawn', 'A'],
  ['tspawn', 'B'],
  ['ctspawn', 'A'],
  ['ctspawn', 'B'],
  ['tspawn', 'ctspawn'],
  ['mid', 'cat'],
  ['lower', 'B'],
];
for (const [a, b] of pairs) {
  const ts = performance.now();
  const p = nav.findPath(pts[a][0], pts[a][1], pts[b][0], pts[b][1]);
  const te = performance.now();
  let l = 0;
  if (p) for (let i = 1; i < p.length; i++) l += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  console.log(`${a} -> ${b}: ${p ? `${p.length} wps, ${l.toFixed(1)}m` : 'NO PATH'} (${(te - ts).toFixed(1)}ms)`);
  if (!p) ok = false;
}
// count components
const comps = new Map<number, number>();
for (let i = 0; i < nav.component.length; i++) if (nav.component[i] >= 0) comps.set(nav.component[i], (comps.get(nav.component[i]) ?? 0) + 1);
console.log('components', [...comps.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8));
// dump ascii map (every 2 nav cells)
if (process.argv.includes('--map')) {
  let s = '';
  for (let j = 0; j < nav.h; j += 2) {
    for (let i = 0; i < nav.w; i += 2) {
      const idx = j * nav.w + i;
      s += nav.free[idx] ? (nav.height[idx] > 0.6 ? '^' : '.') : world.isOpenCell(i >> 1, j >> 1) ? 'x' : '#';
    }
    s += '\n';
  }
  console.log(s);
}
console.log(ok ? 'NAV OK' : 'NAV PROBLEMS');

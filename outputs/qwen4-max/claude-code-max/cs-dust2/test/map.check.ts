import { buildMap, floorHeightAt, isWalkablePoint, findPath, areaAt } from '../src/game/core/map.ts';
import { CFG } from '../src/game/core/config.ts';

const map = buildMap();
console.log('colliders:', map.colliders.length, 'navPoints:', map.nav.points.length);
let edgeCount = 0;
for (const e of map.nav.edges) edgeCount += e.length;
console.log('navEdges (directed):', edgeCount);

// Connected components of nav graph
const n = map.nav.points.length;
const comp = new Array(n).fill(-1);
let nc = 0;
for (let s = 0; s < n; s++) {
  if (comp[s] >= 0) continue;
  const stack = [s]; comp[s] = nc;
  while (stack.length) { const u = stack.pop()!; for (const v of map.nav.edges[u]) if (comp[v] < 0) { comp[v] = nc; stack.push(v); } }
  nc++;
}
console.log('nav components:', nc);

// BFS reachability from T spawn over nav graph; ensure every area has a reachable point.
const tSpawn = map.spawns.T[0];
let start = 0, bd = Infinity;
map.nav.points.forEach((p, i) => { const d = Math.hypot(p.x - tSpawn.x, p.z - tSpawn.z); if (d < bd) { bd = d; start = i; } });
const reach = new Set<number>([start]);
const q = [start];
while (q.length) { const u = q.shift()!; for (const v of map.nav.edges[u]) if (!reach.has(v)) { reach.add(v); q.push(v); } }
console.log('reachable nav points from T spawn:', reach.size, '/', n);

const areasHit = new Set<string>();
for (const i of reach) areasHit.add(areaAt(map, map.nav.points[i].x, map.nav.points[i].z));
const required = ['T Spawn', 'CT Spawn', 'Long A', 'A Site', 'Mid Doors', 'Catwalk', 'Lower Tunnels', 'Upper Tunnels', 'B Site'];
console.log('areas reachable:', [...areasHit].sort().join(', '));
for (const r of required) if (!areasHit.has(r)) console.log('  !! MISSING AREA REACHABILITY:', r);

// Physical flood fill on a 1m grid from T spawn, collision aware, to detect wall leaks.
const gx1 = map.bounds.x1, gz1 = map.bounds.z1, gx2 = map.bounds.x2, gz2 = map.bounds.z2;
const W = Math.ceil(gx2 - gx1), H = Math.ceil(gz2 - gz1);
const walk = new Uint8Array(W * H);
for (let iz = 0; iz < H; iz++) for (let ix = 0; ix < W; ix++) {
  const x = gx1 + ix + 0.5, z = gz1 + iz + 0.5;
  walk[iz * W + ix] = isWalkablePoint(map, x, z) ? 1 : 0;
}
const idx = (x: number, z: number) => (Math.floor(z - gz1)) * W + Math.floor(x - gx1);
const seen = new Uint8Array(W * H);
const stack = [idx(tSpawn.x, tSpawn.z)];
seen[stack[0]] = 1;
let count = 0;
while (stack.length) {
  const c = stack.pop()!; count++;
  const cx = c % W, cz = (c / W) | 0;
  const nb = [[cx + 1, cz], [cx - 1, cz], [cx, cz + 1], [cx, cz - 1]];
  for (const [nx, nz] of nb) {
    if (nx < 0 || nz < 0 || nx >= W || nz >= H) continue;
    const ni = nz * W + nx;
    if (walk[ni] && !seen[ni]) { seen[ni] = 1; stack.push(ni); }
  }
}
console.log('flood-fill walkable cells from T spawn:', count);
// Check each required area center is in the flooded set.
const areaCenters: Record<string, [number, number]> = {
  'T Spawn': [7, 52], 'CT Spawn': [7, -46], 'Long A': [47, 0], 'A Site': [40, -38],
  'Mid Doors': [3, 0], 'Catwalk': [26, -12], 'Lower Tunnels': [-37, -10], 'Upper Tunnels': [-37, 25], 'B Site': [-38, -42],
};
for (const [name, [x, z]] of Object.entries(areaCenters)) {
  const i = idx(x, z);
  const ok = i >= 0 && i < W * H && seen[i] === 1;
  console.log(`  flood ${name}: ${ok ? 'OK' : 'NOT REACHED'} (walkable=${walk[i]})`);
}

// Path checks for the classic routes.
const routes: [string, [number, number], [number, number]][] = [
  ['T->A long', [7, 52], [40, -38]],
  ['T->A short', [7, 52], [34, -34]],
  ['T->B tunnels', [7, 52], [-38, -42]],
  ['CT->A', [7, -46], [40, -38]],
  ['CT->B', [7, -46], [-38, -42]],
  ['CT->mid', [7, -46], [3, 8]],
];
for (const [name, a, b] of routes) {
  const path = findPath(map, { x: a[0], y: 0, z: a[1] }, { x: b[0], y: 0, z: b[1] });
  let len = 0; let prev = { x: a[0], z: a[1] };
  let valid = true;
  for (const p of path) { len += Math.hypot(p.x - prev.x, p.z - prev.z); prev = p; }
  // verify each segment walkable
  prev = { x: a[0], z: a[1] };
  for (const p of path) {
    const d = Math.hypot(p.x - prev.x, p.z - prev.z);
    const steps = Math.ceil(d / 0.4);
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      if (!isWalkablePoint(map, prev.x + (p.x - prev.x) * t, prev.z + (p.z - prev.z) * t)) { valid = false; break; }
    }
    prev = p;
    if (!valid) break;
  }
  console.log(`  path ${name}: ${path.length} pts, ${len.toFixed(1)}m, walkable=${valid}`);
}
// Door gaps must be standable (passable on foot).
for (const d of map.doors) {
  console.log(`  door gap ${d.name} walkable: ${isWalkablePoint(map, d.gap.x, d.gap.z)}`);
}
console.log('MAP CHECK DONE');

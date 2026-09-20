// Map validation: confirms every required Dust2 area exists, is reachable,
// and that spawns/sites are not inside solid geometry.
import { buildMapData, isWalkableWorld, siteAt } from '../src/world/mapLayout';
import { NavGrid } from '../src/ai/navigation';
import { isInsideSolid } from '../src/physics/collision';
import { PLAYER_HEIGHT, PLAYER_RADIUS } from '../src/engine/constants';

const map = buildMapData();
const nav = new NavGrid(map);

const areas: Array<[string, number, number]> = [
  ['T 出生点', 0, 55],
  ['CT 出生点', 0, -55],
  ['A 大', -50, 20],
  ['A 点', -45, -48],
  ['中路', 0, 10],
  ['中门', 0, 0],
  ['猫道', -22, -9],
  ['B 洞', 50, 20],
  ['B 点', 45, -48],
  ['B 门 (中->B)', 24, 20],
  ['CT->A 连接', -24, -50],
  ['CT->B 连接', 24, -50],
];

let fail = 0;
console.log('--- area presence ---');
for (const [name, x, z] of areas) {
  const walk = isWalkableWorld(map, x, z);
  console.log(`${walk ? 'OK ' : 'BAD'} ${name} (${x},${z})`);
  if (!walk) fail++;
}

console.log('\n--- connectivity (A* paths) ---');
const routes: Array<[string, [number, number], [number, number]]> = [
  ['T spawn -> A site', [0, 55], [-45, -48]],
  ['T spawn -> B site', [0, 55], [45, -48]],
  ['CT spawn -> A site', [0, -55], [-45, -48]],
  ['CT spawn -> B site', [0, -55], [45, -48]],
  ['T spawn -> CT spawn (mid doors)', [0, 55], [0, -55]],
  ['mid -> catwalk -> A site', [0, 0], [-45, -48]],
  ['A long -> A site', [-50, 55], [-45, -48]],
  ['B tunnels -> B site', [50, 55], [45, -48]],
  ['A site -> B site', [-45, -48], [45, -48]],
];
for (const [name, a, b] of routes) {
  const path = nav.findPath(a[0], a[1], b[0], b[1]);
  const ok = path.length > 0;
  const dist = path.reduce((acc, p, i) => {
    const prev = i === 0 ? { x: a[0], z: a[1] } : path[i - 1];
    return acc + Math.hypot(p.x - prev.x, p.z - prev.z);
  }, 0);
  console.log(`${ok ? 'OK ' : 'BAD'} ${name} — ${path.length} waypoints, ${dist.toFixed(0)}m`);
  if (!ok) fail++;
}

console.log('\n--- mid door passability ---');
const straightThrough = nav.clearWalk(0, 8, 0, -8);
const blockedAtEdge = !nav.clearWalk(3, 8, 3, -8);
console.log(
  `${straightThrough && blockedAtEdge ? 'OK ' : 'BAD'} centre line passes through the door (${straightThrough}), off-centre blocked (${blockedAtEdge})`,
);
if (!straightThrough || !blockedAtEdge) fail++;

console.log('\n--- spawn / site sanity ---');
for (const s of [...map.tSpawns, ...map.ctSpawns]) {
  const inside = isInsideSolid(map.colliders, s.x, s.z, PLAYER_RADIUS, PLAYER_RADIUS, 0, PLAYER_HEIGHT);
  if (inside) {
    console.log(`BAD spawn inside solid (${s.x},${s.z})`);
    fail++;
  }
}
for (const [name, r] of [
  ['A site', map.sites.A],
  ['B site', map.sites.B],
] as const) {
  const cx = (r.minX + r.maxX) / 2;
  const cz = (r.minZ + r.maxZ) / 2;
  const walk = isWalkableWorld(map, cx, cz);
  const site = siteAt(map, cx, cz);
  console.log(`${walk && site ? 'OK ' : 'BAD'} ${name} centre walkable & inside site (${site})`);
  if (!walk || !site) fail++;
}

console.log('\n--- crates on walkable ground ---');
let badCrates = 0;
for (const b of map.boxes) {
  if (b.kind !== 'crate') continue;
  if (!isWalkableWorld(map, b.x, b.z)) {
    console.log(`BAD crate embedded in wall at (${b.x},${b.z})`);
    badCrates++;
  }
}
if (badCrates === 0) console.log('OK  all crates sit on walkable ground');
fail += badCrates;

console.log(`\ncolliders: ${map.colliders.length}, boxes: ${map.boxes.length}`);
console.log(fail === 0 ? '\nMAP RESULT: PASS' : `\nMAP RESULT: FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);

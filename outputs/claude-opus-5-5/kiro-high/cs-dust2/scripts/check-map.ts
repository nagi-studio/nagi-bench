// Headless sanity check for the procedural Dust2 map: walkability, connectivity,
// route path lengths and a kinematic "walk the path" simulation using the real
// collision code. Run: npm run check:map
import { buildDust2 } from '../src/game/world/dust2';
import { World } from '../src/game/world/World';
import { NavGrid } from '../src/game/nav/NavGrid';
import { BODY_RADIUS, STAND_HEIGHT } from '../src/game/config';

const map = buildDust2();
const world = new World(map);
const t0 = Date.now();
const nav = new NavGrid(world);
console.log(`boxes=${map.boxes.length} ramps=${map.ramps.length} floorQuads=${map.floorQuads.length} navBuild=${Date.now() - t0}ms`);

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.log('FAIL', msg);
};

const reach = nav.reachableFrom(map.spawns.T[0].x, map.spawns.T[0].z);
const check = (label: string, x: number, z: number) => {
  const c = nav.cellOf(x, z);
  if (c < 0 || !nav.walk[c]) {
    const n = nav.nearestWalkable(x, z, 4);
    if (n < 0) return fail(`${label} (${x},${z}) not walkable`);
    if (!reach[n]) return fail(`${label} (${x},${z}) not reachable (snapped)`);
    console.log(`warn ${label} (${x},${z}) snapped to nearby walkable cell`);
    return;
  }
  if (!reach[c]) fail(`${label} (${x},${z}) not reachable from T spawn`);
};

for (const [k, p] of Object.entries(map.waypoints)) check(`waypoint ${k}`, p.x, p.z);
map.spawns.T.forEach((p, i) => check(`T spawn ${i}`, p.x, p.z));
map.spawns.CT.forEach((p, i) => check(`CT spawn ${i}`, p.x, p.z));
for (const s of ['A', 'B'] as const) map.plantSpots[s].forEach((p, i) => check(`plant ${s}${i}`, p.x, p.z));
map.holdSpots.forEach((h) => check(`hold ${h.name}`, h.pos.x, h.pos.z));

function simulateWalk(label: string, from: { x: number; z: number }, to: { x: number; z: number }) {
  const path = nav.findPath(from.x, from.z, to.x, to.z);
  if (!path) return fail(`no path ${label}`);
  let len = 0;
  let px = from.x, pz = from.z;
  for (const p of path) {
    len += Math.hypot(p.x - px, p.z - pz);
    px = p.x;
    pz = p.z;
  }
  const body = {
    pos: { x: from.x, y: world.groundHeight(from.x, from.z, 0.3, world.floorAt(from.x, from.z) + 0.5), z: from.z },
    vel: { x: 0, y: 0, z: 0 },
    radius: BODY_RADIUS,
    height: STAND_HEIGHT,
    onGround: true,
  };
  let idx = 0;
  const dt = 1 / 60;
  let t = 0;
  while (idx < path.length && t < 120) {
    const tg = path[idx];
    const dx = tg.x - body.pos.x, dz = tg.z - body.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.4) {
      idx++;
      continue;
    }
    body.vel.x = (dx / d) * 5.5;
    body.vel.z = (dz / d) * 5.5;
    world.moveBody(body, dt);
    t += dt;
  }
  const end = Math.hypot(body.pos.x - to.x, body.pos.z - to.z);
  const ok = idx >= path.length || end < 1.5;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}: path ${len.toFixed(1)}m, ${path.length} pts, walked ${t.toFixed(1)}s, y=${body.pos.y.toFixed(2)}`);
  if (!ok) failures++;
}

const W = map.waypoints;
for (const [name, r] of Object.entries(map.routes)) {
  let prev = map.spawns.T[0];
  for (const wp of r.points) {
    simulateWalk(`${name}:${wp}`, prev, W[wp]);
    prev = W[wp];
  }
  simulateWalk(`${name}:plant`, prev, map.plantSpots[r.site][0]);
}
simulateWalk('CT->A', map.spawns.CT[0], map.plantSpots.A[0]);
simulateWalk('CT->B', map.spawns.CT[0], map.plantSpots.B[0]);
simulateWalk('CT->mid doors', map.spawns.CT[0], W.midDoors);
simulateWalk('mid doors->top mid', W.midDoors, W.topMid);
simulateWalk('B->A (via CT)', map.plantSpots.B[1], map.plantSpots.A[1]);
for (const h of map.holdSpots) simulateWalk(`CT hold ${h.name}`, map.spawns.CT[2], h.pos);

let walkable = 0;
for (let k = 0; k < nav.walk.length; k++) walkable += nav.walk[k];
console.log(`walkable nav cells: ${walkable}`);
console.log(failures === 0 ? 'ALL CHECKS PASSED' : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);

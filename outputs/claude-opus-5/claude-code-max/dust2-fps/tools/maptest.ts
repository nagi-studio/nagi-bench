/**
 * Map / navigation verification. Run with: node tools/maptest.ts
 *
 * Checks the floor plan is self consistent (no sectors overlapping at different heights),
 * that walls actually seal the playable area, and that every named Dust2 landmark is
 * reachable from every other one.
 */

import { Vec3 } from '../src/core/math.ts';
import { CollisionWorld, isWalkablePoint } from '../src/game/map/collision.ts';
import { NavGrid } from '../src/game/map/navgrid.ts';
import {
  BOMB_SITES,
  CT_SPAWNS,
  SECTORS,
  T_SPAWNS,
  WAYPOINTS,
  sectorFloorAt,
} from '../src/game/map/dust2.ts';
import { check, report, section } from './harness.ts';

section('map geometry');

// --- sectors may share space only when their floors agree -----------------------
let overlapProblems = 0;
for (let i = 0; i < SECTORS.length; i++) {
  for (let j = i + 1; j < SECTORS.length; j++) {
    const a = SECTORS[i];
    const b = SECTORS[j];
    const x0 = Math.max(a.x0, b.x0);
    const x1 = Math.min(a.x1, b.x1);
    const z0 = Math.max(a.z0, b.z0);
    const z1 = Math.min(a.z1, b.z1);
    if (x1 - x0 <= 0.01 || z1 - z0 <= 0.01) continue;
    for (const [x, z] of [
      [x0 + 0.05, z0 + 0.05],
      [x1 - 0.05, z1 - 0.05],
      [(x0 + x1) / 2, (z0 + z1) / 2],
    ]) {
      const d = Math.abs(sectorFloorAt(a, x, z) - sectorFloorAt(b, x, z));
      if (d > 0.05) {
        console.log(`  overlap height mismatch: ${a.id} / ${b.id} = ${d.toFixed(2)}m`);
        overlapProblems++;
      }
    }
  }
}
check('overlapping sectors agree on floor height', overlapProblems === 0);

const collision = new CollisionWorld();
check('walls generated', collision.walls.length > 20, `${collision.walls.length} wall boxes`);
check('props solid', collision.props.length > 20, `${collision.props.length} prop boxes`);

// --- the playable area must be sealed: shoot rays outward from inside ------------
{
  const nav0 = new NavGrid(collision);
  let leaks = 0;
  let tested = 0;
  const dirs: Vec3[] = [];
  for (let a = 0; a < 16; a++) {
    dirs.push(new Vec3(Math.cos((a / 16) * Math.PI * 2), 0, Math.sin((a / 16) * Math.PI * 2)));
  }
  for (let i = 0; i < nav0.walkable.length; i += 7) {
    if (nav0.walkable[i] !== 1) continue;
    const x = nav0.cellX(i % nav0.cols);
    const z = nav0.cellZ(Math.floor(i / nav0.cols));
    const y = nav0.height[i] + 1.0;
    tested++;
    for (const d of dirs) {
      const origin = new Vec3(x, y, z);
      const hit = collision.rayCast(origin, d, 200);
      if (!hit) {
        // No wall in this direction: only acceptable if we never left the floor plan.
        const far = new Vec3(x + d.x * 200, y, z + d.z * 200);
        if (isWalkablePoint(far.x, far.z)) continue;
        leaks++;
        if (leaks < 5) console.log(`  leak at (${x.toFixed(1)}, ${z.toFixed(1)}) dir ${d.x.toFixed(2)},${d.z.toFixed(2)}`);
        break;
      }
    }
  }
  check('map is sealed by walls', leaks === 0, `${tested} sample points, ${leaks} leaks`);
}

section('navigation');

const nav = new NavGrid(collision);
const walkableCells = nav.countWalkable();
check('nav grid rasterised', walkableCells > 1500, `${walkableCells} walkable cells of ${nav.walkable.length}`);

// --- every landmark reachable from every other landmark --------------------------
const names = Object.keys(WAYPOINTS) as Array<keyof typeof WAYPOINTS>;
let unreachable = 0;
let longest = 0;
let longestPair = '';
for (const a of names) {
  for (const b of names) {
    if (a === b) continue;
    const wa = WAYPOINTS[a];
    const wb = WAYPOINTS[b];
    const from = new Vec3(wa.x, collision.sectorGroundAt(wa.x, wa.z), wa.z);
    const to = new Vec3(wb.x, collision.sectorGroundAt(wb.x, wb.z), wb.z);
    const path = nav.findPath(from, to);
    if (!path || path.length === 0) {
      console.log(`  unreachable: ${a} -> ${b}`);
      unreachable++;
      continue;
    }
    let len = from.distanceTo2D(path[0]);
    for (let i = 1; i < path.length; i++) len += path[i - 1].distanceTo2D(path[i]);
    if (len > longest) {
      longest = len;
      longestPair = `${a} -> ${b}`;
    }
  }
}
check(
  'all Dust2 landmarks mutually reachable',
  unreachable === 0,
  `${names.length * (names.length - 1)} routes, longest ${longest.toFixed(0)}m (${longestPair})`,
);

// --- the routes that actually matter for the game mode ---------------------------
const routeChecks: Array<[string, keyof typeof WAYPOINTS, keyof typeof WAYPOINTS]> = [
  ['T spawn -> A site (long)', 'tSpawn', 'aSite'],
  ['T spawn -> B site (tunnels)', 'tSpawn', 'bSite'],
  ['T spawn -> mid doors', 'tSpawn', 'midDoors'],
  ['mid -> catwalk -> A short', 'mid', 'aShort'],
  ['CT spawn -> A site', 'ctSpawn', 'aSite'],
  ['CT spawn -> B site', 'ctSpawn', 'bSite'],
  ['CT spawn -> mid', 'ctSpawn', 'mid'],
  ['A site -> B site (rotate)', 'aSite', 'bSite'],
  ['pit -> A site', 'pit', 'aSite'],
];
for (const [label, a, b] of routeChecks) {
  const wa = WAYPOINTS[a];
  const wb = WAYPOINTS[b];
  const path = nav.findPath(
    new Vec3(wa.x, collision.sectorGroundAt(wa.x, wa.z), wa.z),
    new Vec3(wb.x, collision.sectorGroundAt(wb.x, wb.z), wb.z),
  );
  check(label, !!path && path.length > 0, path ? `${path.length} waypoints` : 'no path');
}

section('spawns and sites');

for (const [team, spawns] of [
  ['T', T_SPAWNS],
  ['CT', CT_SPAWNS],
] as const) {
  let ok = true;
  for (const s of spawns) {
    const y = collision.sectorGroundAt(s.x, s.z);
    if (!isWalkablePoint(s.x, s.z) || collision.overlaps(s.x, y + 0.2, s.z, 0.4, 1.6)) ok = false;
  }
  check(`${team} spawn points are clear`, ok, `${spawns.length} spawns`);
}

for (const site of BOMB_SITES) {
  const cx = (site.x0 + site.x1) / 2;
  const cz = (site.z0 + site.z1) / 2;
  check(
    `bomb site ${site.id} sits on walkable floor`,
    isWalkablePoint(cx, cz),
    `centre (${cx.toFixed(0)}, ${cz.toFixed(0)})`,
  );
}

// Mid doors must have a walkable gap between the two door leaves.
{
  const y = collision.sectorGroundAt(0, -28);
  let open = false;
  for (let x = -6; x <= 4; x += 0.25) {
    if (!collision.overlaps(x, y + 0.2, -28, 0.4, 1.6)) open = true;
  }
  check('mid doors are passable', open);
  const path = nav.findPath(new Vec3(0, 1, -32), new Vec3(0, 0.6, -20));
  check('path crosses mid doors', !!path && path.length > 0);
}

report();

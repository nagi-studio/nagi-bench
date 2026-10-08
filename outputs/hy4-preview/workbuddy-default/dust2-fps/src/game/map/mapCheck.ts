/**
 * Dev-only verification harness (not shipped in the bundle).
 * Run with:  npm run map:check
 *
 * Rasterises the Dust2 regions, prints an ASCII top-down view and asserts
 * that every required area is reachable from every other one.
 */

import { NavGrid } from './grid';
import {
  REGIONS,
  REGION_INDEX,
  T_SPAWN_POINTS,
  CT_SPAWN_POINTS,
  NAV_POINTS,
  SITES,
  buildDust2Grid,
  propBoxes,
} from './dust2';

const grid: NavGrid = buildDust2Grid();
let failures = 0;

function check(ok: boolean, msg: string): void {
  if (!ok) {
    failures++;
    console.log(`  [FAIL] ${msg}`);
  } else {
    console.log(`  [ ok ] ${msg}`);
  }
}

console.log('=== de_dust2 grid ===');
console.log(`grid ${grid.cols} x ${grid.rows} @ ${grid.cell}m  (${(grid.cols * grid.cell).toFixed(0)}m x ${(grid.rows * grid.cell).toFixed(0)}m)`);

// --- ASCII map --------------------------------------------------------------
const glyph = (r: number): string => {
  if (r === 0) return '#';
  const id = REGIONS[r - 1]!.id;
  switch (id) {
    case 'T_SPAWN': return 'T';
    case 'CT_SPAWN': return 'C';
    case 'A_SITE': return 'A';
    case 'B_SITE': return 'B';
    case 'A_LONG': return 'L';
    case 'MID': return 'm';
    case 'MID_DOORS': return 'D';
    case 'CATWALK': return 'w';
    case 'TOP_MID': return 'o';
    case 'CT_MID': return 'c';
    case 'B_DOORS': return 'd';
    case 'B_TUNNEL': return 'u';
    case 'TUNNEL_BEND': return 'n';
    case 'UPPER_TUNNEL': return 'p';
    default: return '?';
  }
};

console.log('\n=== top-down (north is up) ===');
let header = '    ';
for (let cx = 0; cx < grid.cols; cx += 5) header += String(Math.round(grid.minXOf(cx))).padEnd(5, ' ').slice(0, 5);
console.log(header);
for (let cz = 0; cz < grid.rows; cz++) {
  let line = '';
  for (let cx = 0; cx < grid.cols; cx++) {
    const i = grid.idx(cx, cz);
    line += grid.walkable[i] ? glyph(grid.region[i] as number) : ' ';
  }
  console.log(String(Math.round(grid.minZOf(cz))).padStart(4, ' ') + line);
}

// --- props overlay ----------------------------------------------------------
console.log('\n=== props (should sit on walkable floor) ===');
for (const b of propBoxes()) {
  const cx = (b.minX + b.maxX) / 2;
  const cz = (b.minZ + b.maxZ) / 2;
  const ok = grid.isWalkableAt(cx, cz);
  check(ok, `prop centre (${cx.toFixed(1)}, ${cz.toFixed(1)}) on floor`);
}

// --- spawns -----------------------------------------------------------------
console.log('\n=== spawn points ===');
for (const p of T_SPAWN_POINTS) check(grid.isWalkableAt(p.x, p.z), `T spawn (${p.x}, ${p.z})`);
for (const p of CT_SPAWN_POINTS) check(grid.isWalkableAt(p.x, p.z), `CT spawn (${p.x}, ${p.z})`);
for (const s of SITES) check(grid.isWalkableAt(s.plantSpot.x, s.plantSpot.z), `${s.label} plant spot`);

// --- connectivity -----------------------------------------------------------
console.log('\n=== connectivity ===');
const seen = grid.reachableFrom(T_SPAWN_POINTS[0]!.x, T_SPAWN_POINTS[0]!.z);
let reachableCells = 0;
for (let i = 0; i < seen.length; i++) if (seen[i]) reachableCells++;

for (const r of REGIONS) {
  const ri = REGION_INDEX[r.id]! + 1;
  let total = 0;
  let ok = 0;
  for (let cz = 0; cz < grid.rows; cz++) {
    for (let cx = 0; cx < grid.cols; cx++) {
      const i = grid.idx(cx, cz);
      if ((grid.region[i] as number) !== ri) continue;
      total++;
      if (seen[i]) ok++;
    }
  }
  check(total > 0 && ok === total, `${r.label} (${r.id}) — ${ok}/${total} cells reachable from T spawn`);
}

// --- path tests -------------------------------------------------------------
console.log('\n=== A* routes ===');
type NavKey = keyof typeof NAV_POINTS;
const routes: [NavKey, NavKey][] = [
  ['T_SPAWN', 'A_SITE'],
  ['T_SPAWN', 'B_SITE'],
  ['T_SPAWN', 'MID_DOORS'],
  ['T_SPAWN', 'TOP_MID'],
  ['T_SPAWN', 'CATWALK'],
  ['A_SITE', 'CT_SPAWN'],
  ['B_SITE', 'CT_SPAWN'],
  ['CT_SPAWN', 'CATWALK'],
  ['CT_SPAWN', 'B_DOORS'],
  ['A_LONG_START', 'A_SITE'],
  ['A_LONG_END', 'A_SITE'],
  ['MID', 'TOP_MID'],
  ['B_TUNNEL', 'B_SITE'],
  ['UPPER_TUNNEL', 'T_SPAWN'],
  ['A_SITE', 'B_SITE'],
  ['CT_SPAWN', 'T_SPAWN'],
];
for (const [a, b] of routes) {
  const pa = NAV_POINTS[a];
  const pb = NAV_POINTS[b];
  const path = grid.findPath(pa.x, pa.z, pb.x, pb.z);
  const len = path.reduce((acc, p, i) => acc + (i === 0 ? Math.hypot(p.x - pa.x, p.z - pa.z) : Math.hypot(p.x - path[i - 1]!.x, p.z - path[i - 1]!.z)), 0);
  check(path.length > 0, `${a} -> ${b}: ${path.length} waypoints, ${len.toFixed(1)}m`);
}

console.log(`\nwalkable cells reachable: ${reachableCells}`);
console.log(failures === 0 ? '\nALL MAP CHECKS PASSED' : `\n${failures} MAP CHECK FAILURE(S)`);
if (failures > 0) process.exitCode = 1;

import type { Vec3 } from './math';
import { v3 } from './math';

/**
 * Procedural Dust2 core areas. The map is authored as walkable floor
 * rectangles (rooms / corridors); solid walls are generated automatically on a
 * 2m grid wherever a non-walkable cell touches a walkable one. This guarantees
 * that every authored area is connected exactly where the rectangles touch,
 * and that nothing can walk through walls.
 *
 * Top-down layout (north = -Z), mirroring real Dust2 movement:
 *
 *   B site ── B doors ── CT spawn ── CT ramp ── A site
 *     │                    │                    │  ↑
 *  upper tunnels        top mid              catwalk (elevated, stairs)
 *     │                    │ mid doors        │  long A
 *  lower tunnels ────── lower mid             │  long doors
 *     │                    │ suicide          │  outside long
 *     └────────────── T spawn ────────────────┘
 *        (tunnels also connect to lower mid via a side passage)
 */

export interface Rect {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
}

export interface FloorRect extends Rect {
  y: number;
  name: string;
}

export type ColliderKind = 'wall' | 'crate' | 'door' | 'ceiling' | 'step';

export interface Collider {
  min: Vec3;
  max: Vec3;
  kind: ColliderKind;
  /** wood doors let bullets through (damage attenuated) */
  penetrable: boolean;
}

export interface MapData {
  floors: FloorRect[];
  colliders: Collider[];
  /** grid origin */
  gx: number;
  gz: number;
  cell: number;
  cols: number;
  rows: number;
  /** 0 = solid, otherwise floor height + 1 (so 1 => y0, 1.9 => y0.9) */
  grid: Float32Array;
  spawns: { CT: Vec3[]; T: Vec3[] };
  sites: { A: Rect; B: Rect };
  siteCenters: { A: Vec3; B: Vec3 };
  ctHolds: Vec3[];
  bounds: Rect;
}

export const CELL = 2;
const GX = -60;
const GZ = -66;
const COLS = 60;
const ROWS = 68;
const WALL_H = 5.5;

const F = (name: string, x1: number, z1: number, x2: number, z2: number, y = 0): FloorRect => ({
  name, x1, z1, x2, z2, y,
});

const FLOORS: FloorRect[] = [
  F('T出生点', 0, 45, 30, 65),
  F('A大外场', 30, 35, 56, 56),
  F('A大', 42, -16, 56, 36),
  F('A点', 24, -46, 56, -16),
  F('CT出生点', -6, -62, 20, -40),
  F('CT坡', 20, -46, 28, -32),
  F('B点', -56, -50, -24, -20),
  F('B门', -24, -46, -6, -34),
  F('中路上段', -4, -40, 8, -4),
  F('中门', -4, -4, 8, -2),
  F('中路下段', -4, -2, 8, 36),
  F('自杀巷', -4, 36, 10, 50),
  F('B洞上层', -50, -20, -36, 30),
  F('B洞下层', -50, 30, -6, 42),
  F('B洞外', -12, 36, 4, 52),
  F('洞连中', -36, 12, -4, 20),
  F('猫道', 8, -28, 24, -20, 0.9),
];

interface CrateDef { x1: number; z1: number; x2: number; z2: number; h: number; }

const CRATES: CrateDef[] = [
  // A site
  { x1: 38, z1: -38, x2: 42, z2: -34, h: 2.4 },
  { x1: 30, z1: -26, x2: 33, z2: -23, h: 1.2 },
  { x1: 48, z1: -44, x2: 52, z2: -41, h: 1.2 },
  { x1: 26, z1: -44, x2: 29, z2: -41, h: 2.0 },
  // B site
  { x1: -46, z1: -40, x2: -42, z2: -36, h: 2.4 },
  { x1: -34, z1: -46, x2: -30, z2: -42, h: 1.2 },
  { x1: -52, z1: -30, x2: -49, z2: -27, h: 1.2 },
  { x1: -28, z1: -26, x2: -25, z2: -23, h: 1.6 },
  // mid xbox
  { x1: 0, z1: -22, x2: 3, z2: -19, h: 1.2 },
  // long A
  { x1: 46, z1: 6, x2: 49, z2: 9, h: 1.2 },
  { x1: 44, z1: -12, x2: 47, z2: -9, h: 1.0 },
  // tunnels
  { x1: -47, z1: 2, x2: -44, z2: 5, h: 1.2 },
  { x1: -30, z1: 34, x2: -27, z2: 37, h: 1.2 },
  // spawns / outside (kept clear of spawn points)
  { x1: 26, z1: 48, x2: 29, z2: 51, h: 1.2 },
  { x1: -4, z1: -60, x2: 0, z2: -57, h: 1.2 },
  { x1: 36, z1: 48, x2: 40, z2: 52, h: 1.5 },
  { x1: -2, z1: 26, x2: 1, z2: 29, h: 1.0 },
];

const box = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, kind: ColliderKind, penetrable = false): Collider => ({
  min: v3(x1, y1, z1),
  max: v3(x2, y2, z2),
  kind,
  penetrable,
});

/** Double doors: two wood panels with a walkable gap in the middle. Bullets penetrate the wood. */
function doubleDoors(axis: 'x' | 'z', at: number, from: number, to: number, gapCenter: number, gapWidth: number): Collider[] {
  const t = 0.3;
  const h = 3.2;
  const g1 = gapCenter - gapWidth / 2;
  const g2 = gapCenter + gapWidth / 2;
  if (axis === 'z') {
    // panels span along X, thin in Z
    return [
      box(from, 0, at - t / 2, g1, h, at + t / 2, 'door', true),
      box(g2, 0, at - t / 2, to, h, at + t / 2, 'door', true),
    ];
  }
  return [
    box(at - t / 2, 0, from, at + t / 2, h, g1, 'door', true),
    box(at - t / 2, 0, g2, at + t / 2, h, to, 'door', true),
  ];
}

export function buildMap(): MapData {
  const grid = new Float32Array(COLS * ROWS);
  for (const f of FLOORS) {
    const c1 = Math.round((f.x1 - GX) / CELL);
    const c2 = Math.round((f.x2 - GX) / CELL);
    const r1 = Math.round((f.z1 - GZ) / CELL);
    const r2 = Math.round((f.z2 - GZ) / CELL);
    for (let r = r1; r < r2; r++) {
      for (let c = c1; c < c2; c++) {
        grid[r * COLS + c] = f.y + 1;
      }
    }
  }

  const colliders: Collider[] = [];

  // Doors first: double doors with a grid-aligned walkable gap. Panel cells are
  // marked solid in the nav grid so AI routes through the gap, not the wood.
  const doors: Collider[] = [
    ...doubleDoors('z', -3, -4, 8, 3, 2), // mid doors, gap x[2,4]
    ...doubleDoors('z', 24, 42, 56, 49, 2), // long doors, gap x[48,50]
    ...doubleDoors('x', -16, -46, -34, -41, 2), // B doors, gap z[-42,-40]
  ];
  const doorMask = new Uint8Array(COLS * ROWS);
  for (const d of doors) {
    const c1 = Math.floor((d.min.x - GX) / CELL);
    const c2 = Math.ceil((d.max.x - GX) / CELL);
    const r1 = Math.floor((d.min.z - GZ) / CELL);
    const r2 = Math.ceil((d.max.z - GZ) / CELL);
    for (let r = r1; r < r2; r++) {
      for (let c = c1; c < c2; c++) {
        if (c >= 0 && c < COLS && r >= 0 && r < ROWS) {
          grid[r * COLS + c] = 0;
          doorMask[r * COLS + c] = 1;
        }
      }
    }
  }
  colliders.push(...doors);

  // Walls: solid cells adjacent to walkable cells, merged into horizontal runs.
  const isWalk = (c: number, r: number): boolean =>
    c >= 0 && c < COLS && r >= 0 && r < ROWS && grid[r * COLS + c] > 0;
  const wallCell = (c: number, r: number): boolean => {
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return false;
    if (grid[r * COLS + c] > 0) return false;
    if (doorMask[r * COLS + c]) return false; // door panels act as the wall here
    return isWalk(c - 1, r) || isWalk(c + 1, r) || isWalk(c, r - 1) || isWalk(c, r + 1);
  };
  for (let r = 0; r < ROWS; r++) {
    let runStart = -1;
    for (let c = 0; c <= COLS; c++) {
      const w = c < COLS && wallCell(c, r);
      if (w && runStart < 0) runStart = c;
      if (!w && runStart >= 0) {
        colliders.push(box(GX + runStart * CELL, 0, GZ + r * CELL, GX + c * CELL, WALL_H, GZ + (r + 1) * CELL, 'wall'));
        runStart = -1;
      }
    }
  }

  // Crates
  for (const cr of CRATES) {
    colliders.push(box(cr.x1, 0, cr.z1, cr.x2, cr.h, cr.z2, 'crate'));
  }

  // Ceilings over the tunnels + B doors corridor (solid, block bullets & sight)
  colliders.push(box(-50, 3.2, -20, -36, 3.6, 30, 'ceiling'));
  colliders.push(box(-50, 3.2, 30, -6, 3.6, 42, 'ceiling'));
  colliders.push(box(-12, 3.2, 36, 4, 3.6, 52, 'ceiling'));
  colliders.push(box(-36, 3.2, 12, -4, 3.6, 20, 'ceiling'));
  colliders.push(box(-24, 3.4, -46, -6, 3.8, -34, 'ceiling'));

  // Catwalk stairs (both ends), 0.45m steps so the 0.5m auto-step climbs them.
  colliders.push(box(8, 0, -28, 10, 0.45, -20, 'step'));
  colliders.push(box(22, 0, -28, 24, 0.45, -20, 'step'));

  const spawns = {
    CT: [v3(0, 0, -54), v3(4, 0, -56), v3(8, 0, -54), v3(12, 0, -56), v3(16, 0, -54)],
    T: [v3(6, 0, 58), v3(10, 0, 56), v3(14, 0, 58), v3(18, 0, 56), v3(22, 0, 58)],
  };

  const sites = {
    A: { x1: 28, z1: -42, x2: 52, z2: -20 },
    B: { x1: -52, z1: -46, x2: -28, z2: -24 },
  };

  return {
    floors: FLOORS,
    colliders,
    gx: GX,
    gz: GZ,
    cell: CELL,
    cols: COLS,
    rows: ROWS,
    grid,
    spawns,
    sites,
    siteCenters: { A: v3(40, 0, -30), B: v3(-40, 0, -35) },
    ctHolds: [v3(34, 0, -30), v3(46, 0, -38), v3(-40, 0, -30), v3(-32, 0, -42), v3(2, 0, -30)],
    bounds: { x1: GX, z1: GZ, x2: GX + COLS * CELL, z2: GZ + ROWS * CELL },
  };
}

export function cellAt(map: MapData, x: number, z: number): { c: number; r: number } {
  return {
    c: Math.floor((x - map.gx) / map.cell),
    r: Math.floor((z - map.gz) / map.cell),
  };
}

export function cellCenter(map: MapData, c: number, r: number): Vec3 {
  return v3(map.gx + (c + 0.5) * map.cell, 0, map.gz + (r + 0.5) * map.cell);
}

export function walkable(map: MapData, c: number, r: number): boolean {
  return c >= 0 && c < map.cols && r >= 0 && r < map.rows && map.grid[r * map.cols + c] > 0;
}

/** Floor height of the grid cell under a world position (0 outside walkable area). */
export function floorHeightAt(map: MapData, x: number, z: number): number {
  const { c, r } = cellAt(map, x, z);
  if (!walkable(map, c, r)) return 0;
  return map.grid[r * map.cols + c] - 1;
}

export function inRect(x: number, z: number, rc: Rect): boolean {
  return x >= rc.x1 && x <= rc.x2 && z >= rc.z1 && z <= rc.z2;
}

export function inSite(map: MapData, x: number, z: number): 'A' | 'B' | null {
  if (inRect(x, z, map.sites.A)) return 'A';
  if (inRect(x, z, map.sites.B)) return 'B';
  return null;
}

/** Push a goal point out of any crate footprint so bots never path into a box. */
export function avoidCrates(map: MapData, p: Vec3): Vec3 {
  for (const c of map.colliders) {
    if (c.kind !== 'crate') continue;
    if (p.x > c.min.x - 0.5 && p.x < c.max.x + 0.5 && p.z > c.min.z - 0.5 && p.z < c.max.z + 0.5) {
      const dxl = p.x - (c.min.x - 0.6);
      const dxr = c.max.x + 0.6 - p.x;
      const dzl = p.z - (c.min.z - 0.6);
      const dzr = c.max.z + 0.6 - p.z;
      const m = Math.min(dxl, dxr, dzl, dzr);
      if (m === dxl) return v3(c.min.x - 0.7, 0, p.z);
      if (m === dxr) return v3(c.max.x + 0.7, 0, p.z);
      if (m === dzl) return v3(p.x, 0, c.min.z - 0.7);
      return v3(p.x, 0, c.max.z + 0.7);
    }
  }
  return p;
}

/** Named landmark points used by the connectivity test and minimap labels. */
export const LANDMARKS: { name: string; p: Vec3 }[] = [
  { name: 'T出生点', p: v3(15, 0, 55) },
  { name: 'CT出生点', p: v3(7, 0, -52) },
  { name: 'A大', p: v3(49, 0, 10) },
  { name: 'A点', p: v3(40, 0, -30) },
  { name: '中门', p: v3(2, 0, -3) },
  { name: '猫道', p: v3(16, 0, -24) },
  { name: 'B洞', p: v3(-43, 0, 5) },
  { name: 'B点', p: v3(-40, 0, -35) },
  { name: '中路下段', p: v3(2, 0, 20) },
  { name: '中路上段', p: v3(2, 0, -20) },
  { name: 'A大外场', p: v3(43, 0, 45) },
  { name: 'B门', p: v3(-16, 0, -41) },
  { name: '洞连中', p: v3(-20, 0, 16) },
];

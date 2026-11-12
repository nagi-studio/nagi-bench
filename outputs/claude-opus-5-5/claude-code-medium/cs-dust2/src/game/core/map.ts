// Procedural map definition for "Sandstone" — an original desert bomb-defusal map
// with the classic lane structure: T spawn, CT spawn, Long A, A site, mid with
// mid doors, catwalk (short A), B tunnels and B site.
//
// The map is authored as a coarse cell grid (2m cells). Floor areas are carved
// out of solid rock using named rectangular regions; everything not carved is
// wall. Walls are greedily merged into AABBs used for both rendering and
// collision, which also guarantees that the navigation grid and the physics
// agree exactly.

import type { V3 } from './math.ts';

export const CELL = 2;
export const COLS = 56;
export const ROWS = 64;
export const ORIGIN_X = -(COLS * CELL) / 2; // -56
export const ORIGIN_Z = -(ROWS * CELL) / 2; // -64

export type SiteId = 'A' | 'B';
export type BoxKind = 'wall' | 'crate' | 'metal' | 'door' | 'ceiling' | 'lintel';

export interface AABB {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  kind: BoxKind;
}

export interface CellRect {
  c0: number;
  r0: number;
  c1: number;
  r1: number;
}

export interface Region extends CellRect {
  id: string;
  name: string;
  /** Tunnel style regions get a low ceiling. */
  roofed?: boolean;
}

// Order matters for location lookups: first match wins.
export const REGIONS: Region[] = [
  { id: 'ct_spawn', name: 'CT出生点', c0: 22, r0: 3, c1: 34, r1: 12 },
  { id: 'a_site', name: 'A点', c0: 38, r0: 2, c1: 53, r1: 15 },
  { id: 'ct_ramp', name: 'CT通A', c0: 35, r0: 6, c1: 37, r1: 10 },
  { id: 'b_site', name: 'B点', c0: 2, r0: 2, c1: 15, r1: 15 },
  { id: 'b_doors', name: 'B门', c0: 16, r0: 6, c1: 21, r1: 9 },
  { id: 'ct_mid', name: 'CT中路', c0: 24, r0: 13, c1: 31, r1: 17 },
  { id: 'mid_doors', name: '中门', c0: 26, r0: 18, c1: 28, r1: 19 },
  { id: 'mid', name: '中路', c0: 24, r0: 20, c1: 30, r1: 48 },
  { id: 'top_mid', name: '上中路', c0: 22, r0: 49, c1: 32, r1: 53 },
  { id: 't_spawn', name: 'T出生点', c0: 18, r0: 54, c1: 38, r1: 62 },
  { id: 'long_doors', name: 'A大门', c0: 39, r0: 56, c1: 45, r1: 57 },
  { id: 'long_a', name: 'A大', c0: 46, r0: 16, c1: 51, r1: 58 },
  { id: 'pit', name: 'A大坑', c0: 52, r0: 38, c1: 54, r1: 46 },
  { id: 'catwalk', name: '猫道', c0: 37, r0: 16, c1: 39, r1: 28 },
  { id: 'catwalk_low', name: '猫道下', c0: 31, r0: 29, c1: 39, r1: 31 },
  { id: 'b_tunnels', name: 'B洞', c0: 7, r0: 16, c1: 9, r1: 57, roofed: true },
  { id: 'b_tunnel_entry', name: 'B洞口', c0: 10, r0: 55, c1: 17, r1: 57, roofed: true },
  { id: 'lower_tunnels', name: '下B洞', c0: 10, r0: 36, c1: 23, r1: 37, roofed: true },
];

export interface CrateDef {
  c: number;
  r: number;
  w: number;
  h: number;
  height: number;
  kind: 'crate' | 'metal';
}

export const CRATES: CrateDef[] = [
  // A site
  { c: 43, r: 6, w: 2, h: 2, height: 1.7, kind: 'crate' },
  { c: 45, r: 6, w: 1, h: 1, height: 0.85, kind: 'crate' },
  { c: 49, r: 4, w: 2, h: 1, height: 1.2, kind: 'metal' },
  { c: 40, r: 12, w: 2, h: 2, height: 1.7, kind: 'crate' },
  { c: 51, r: 11, w: 2, h: 2, height: 2.4, kind: 'metal' },
  { c: 47, r: 13, w: 1, h: 1, height: 0.85, kind: 'crate' },
  // B site
  { c: 5, r: 5, w: 2, h: 2, height: 1.7, kind: 'crate' },
  { c: 7, r: 5, w: 1, h: 1, height: 0.85, kind: 'crate' },
  { c: 11, r: 9, w: 2, h: 2, height: 2.4, kind: 'metal' },
  { c: 3, r: 12, w: 1, h: 2, height: 1.2, kind: 'crate' },
  { c: 13, r: 4, w: 2, h: 1, height: 1.2, kind: 'crate' },
  // CT spawn
  { c: 24, r: 4, w: 1, h: 1, height: 1.2, kind: 'crate' },
  { c: 32, r: 10, w: 2, h: 1, height: 1.2, kind: 'metal' },
  { c: 30, r: 14, w: 1, h: 1, height: 1.2, kind: 'crate' },
  // Mid
  { c: 27, r: 33, w: 1, h: 1, height: 0.85, kind: 'crate' },
  { c: 24, r: 42, w: 1, h: 2, height: 1.4, kind: 'crate' },
  { c: 30, r: 25, w: 1, h: 1, height: 1.2, kind: 'metal' },
  { c: 31, r: 50, w: 1, h: 1, height: 1.0, kind: 'crate' },
  // Long A
  { c: 49, r: 44, w: 2, h: 2, height: 1.8, kind: 'metal' },
  { c: 46, r: 30, w: 1, h: 1, height: 1.0, kind: 'crate' },
  // Catwalk
  { c: 38, r: 22, w: 1, h: 1, height: 0.85, kind: 'crate' },
  // T spawn
  { c: 22, r: 58, w: 2, h: 2, height: 1.6, kind: 'crate' },
  { c: 33, r: 56, w: 1, h: 1, height: 1.0, kind: 'crate' },
  { c: 29, r: 61, w: 2, h: 1, height: 1.2, kind: 'metal' },
];

/** Bombsite plantable zones (in cells, inclusive). */
export const BOMBSITES: Record<SiteId, CellRect> = {
  A: { c0: 40, r0: 3, c1: 52, r1: 14 },
  B: { c0: 3, r0: 3, c1: 14, r1: 14 },
};

export const SPAWN_CELLS: Record<'T' | 'CT', [number, number][]> = {
  T: [
    [24, 57],
    [26, 59],
    [28, 57],
    [30, 59],
    [32, 58],
  ],
  CT: [
    [26, 6],
    [28, 5],
    [30, 6],
    [27, 8],
    [29, 8],
  ],
};

export const CELL_WALL = 0;
export const CELL_FLOOR = 1;
export const CELL_CRATE = 2;

export interface WallRect extends CellRect {
  height: number;
}

export interface MapData {
  grid: Uint8Array; // COLS*ROWS
  walls: WallRect[];
  boxes: AABB[]; // every collidable box (walls, crates, doors, ceilings)
  crateBoxes: AABB[];
  doorLeaves: AABB[];
  ceilings: AABB[];
  lintels: AABB[];
  roofedCells: Uint8Array;
}

export const cellCenter = (c: number, r: number, y = 0): V3 => ({
  x: ORIGIN_X + c * CELL + CELL / 2,
  y,
  z: ORIGIN_Z + r * CELL + CELL / 2,
});
export const worldToCell = (x: number, z: number): [number, number] => [
  Math.floor((x - ORIGIN_X) / CELL),
  Math.floor((z - ORIGIN_Z) / CELL),
];
export const inBounds = (c: number, r: number) => c >= 0 && r >= 0 && c < COLS && r < ROWS;

export function inRect(rect: CellRect, x: number, z: number): boolean {
  const [c, r] = worldToCell(x, z);
  return c >= rect.c0 && c <= rect.c1 && r >= rect.r0 && r <= rect.r1;
}

export function regionAt(x: number, z: number): Region | null {
  for (const reg of REGIONS) if (inRect(reg, x, z)) return reg;
  return null;
}

export function siteAt(x: number, z: number): SiteId | null {
  if (inRect(BOMBSITES.A, x, z)) return 'A';
  if (inRect(BOMBSITES.B, x, z)) return 'B';
  return null;
}

function hashRect(c: number, r: number, w: number, h: number): number {
  let x = (c * 73856093) ^ (r * 19349663) ^ (w * 83492791) ^ (h * 2971215073);
  x = (x ^ (x >>> 13)) * 1274126177;
  return Math.abs(x ^ (x >>> 16));
}

export function buildMap(): MapData {
  const grid = new Uint8Array(COLS * ROWS); // all wall
  const roofedCells = new Uint8Array(COLS * ROWS);
  for (const reg of REGIONS) {
    for (let r = reg.r0; r <= reg.r1; r++)
      for (let c = reg.c0; c <= reg.c1; c++) {
        if (c <= 0 || r <= 0 || c >= COLS - 1 || r >= ROWS - 1) continue; // keep border solid
        grid[r * COLS + c] = CELL_FLOOR;
        if (reg.roofed) roofedCells[r * COLS + c] = 1;
      }
  }
  // Region order: roofed flag should not leak onto cells which belong to an
  // open region listed earlier (e.g. tunnel exit overlapping a site). Clear roof
  // on cells that also belong to a non-roofed region.
  for (const reg of REGIONS) {
    if (reg.roofed) continue;
    for (let r = reg.r0; r <= reg.r1; r++)
      for (let c = reg.c0; c <= reg.c1; c++) if (inBounds(c, r)) roofedCells[r * COLS + c] = 0;
  }
  // Leave the last 2 rows of the tunnels open towards the B site so the exit is bright.
  for (let r = 16; r <= 19; r++) for (let c = 7; c <= 9; c++) roofedCells[r * COLS + c] = 0;

  const boxes: AABB[] = [];
  const crateBoxes: AABB[] = [];
  for (const cr of CRATES) {
    for (let r = cr.r; r < cr.r + cr.h; r++)
      for (let c = cr.c; c < cr.c + cr.w; c++) {
        if (grid[r * COLS + c] !== CELL_FLOOR) throw new Error(`crate on non-floor cell ${c},${r}`);
        grid[r * COLS + c] = CELL_CRATE;
      }
    const minX = ORIGIN_X + cr.c * CELL;
    const minZ = ORIGIN_Z + cr.r * CELL;
    // Crates are inset slightly so neighbouring cells stay comfortably walkable.
    const inset = 0.1;
    const b: AABB = {
      minX: minX + inset,
      minY: 0,
      minZ: minZ + inset,
      maxX: minX + cr.w * CELL - inset,
      maxY: cr.height,
      maxZ: minZ + cr.h * CELL - inset,
      kind: cr.kind,
    };
    crateBoxes.push(b);
    boxes.push(b);
  }

  // Greedy merge of wall cells into rectangles.
  const used = new Uint8Array(COLS * ROWS);
  const walls: WallRect[] = [];
  const isWall = (c: number, r: number) => grid[r * COLS + c] === CELL_WALL && !used[r * COLS + c];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!isWall(c, r)) continue;
      let w = 1;
      while (c + w < COLS && isWall(c + w, r)) w++;
      let h = 1;
      outer: while (r + h < ROWS) {
        for (let k = 0; k < w; k++) if (!isWall(c + k, r + h)) break outer;
        h++;
      }
      for (let rr = r; rr < r + h; rr++) for (let cc = c; cc < c + w; cc++) used[rr * COLS + cc] = 1;
      const height = 5.5 + (hashRect(c, r, w, h) % 4) * 0.9;
      walls.push({ c0: c, r0: r, c1: c + w - 1, r1: r + h - 1, height });
    }
  }
  for (const w of walls) {
    boxes.push({
      minX: ORIGIN_X + w.c0 * CELL,
      minY: 0,
      minZ: ORIGIN_Z + w.r0 * CELL,
      maxX: ORIGIN_X + (w.c1 + 1) * CELL,
      maxY: w.height,
      maxZ: ORIGIN_Z + (w.r1 + 1) * CELL,
      kind: 'wall',
    });
  }

  // Mid doors: two door leaves swung open against the CT side, plus a lintel
  // over the doorway. The opening (3 cells = 6m) stays passable.
  const doorLeft = ORIGIN_X + 26 * CELL; // west edge of the opening
  const doorRight = ORIGIN_X + 29 * CELL; // east edge of the opening
  const doorFaceZ = ORIGIN_Z + 18 * CELL; // north face of the door wall
  const leafLen = 2.4;
  const leafT = 0.12;
  const doorLeaves: AABB[] = [
    { minX: doorLeft, maxX: doorLeft + leafT, minY: 0, maxY: 3.0, minZ: doorFaceZ - leafLen, maxZ: doorFaceZ, kind: 'door' },
    { minX: doorRight - leafT, maxX: doorRight, minY: 0, maxY: 3.0, minZ: doorFaceZ - leafLen, maxZ: doorFaceZ, kind: 'door' },
  ];
  boxes.push(...doorLeaves);
  const lintels: AABB[] = [
    { minX: doorLeft, maxX: doorRight, minY: 3.3, maxY: 6.4, minZ: doorFaceZ, maxZ: doorFaceZ + 2 * CELL, kind: 'lintel' },
  ];
  boxes.push(...lintels);

  // Tunnel ceilings: merge roofed cells row-wise.
  const ceilings: AABB[] = [];
  const CEIL_Y = 3.4;
  for (let r = 0; r < ROWS; r++) {
    let c = 0;
    while (c < COLS) {
      if (!roofedCells[r * COLS + c]) {
        c++;
        continue;
      }
      let w = 1;
      while (c + w < COLS && roofedCells[r * COLS + c + w]) w++;
      ceilings.push({
        minX: ORIGIN_X + c * CELL,
        maxX: ORIGIN_X + (c + w) * CELL,
        minY: CEIL_Y,
        maxY: CEIL_Y + 0.5,
        minZ: ORIGIN_Z + r * CELL,
        maxZ: ORIGIN_Z + (r + 1) * CELL,
        kind: 'ceiling',
      });
      c += w;
    }
  }
  boxes.push(...ceilings);

  return { grid, walls, boxes, crateBoxes, doorLeaves, ceilings, lintels, roofedCells };
}

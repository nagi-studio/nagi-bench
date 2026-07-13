// Procedural Dust2 core layout, authored as carved rectangles on the tile grid.
// Orientation (top-down): T spawn south (+Z, bottom), CT spawn north (-Z, top),
// A site / A long east (+X, right), B site / tunnels west (-X, left), mid runs
// vertically through the center with the passable doors halfway.

import { MapGrid, Region } from './grid';

export interface Crate {
  x: number;
  z: number;
  hx: number; // half extent X (m)
  hz: number; // half extent Z (m)
  height: number; // top Y (m); box spans y in [0, height]
}

export interface BombSite {
  name: 'A' | 'B';
  region: Region;
  center: { x: number; z: number };
  radius: number;
}

export interface SpawnPoint {
  x: number;
  z: number;
}

export interface Dust2 {
  grid: MapGrid;
  crates: Crate[];
  sites: { A: BombSite; B: BombSite };
  tSpawns: SpawnPoint[];
  ctSpawns: SpawnPoint[];
  doorCells: { cx: number; cz: number }[];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

export const CELL = 2.2;
export const COLS = 60;
export const ROWS = 60;
export const WALL_HEIGHT = 4.2;

export function buildDust2(): Dust2 {
  const g = new MapGrid(COLS, ROWS, CELL);

  // --- rooms & corridors (inclusive cell coords) ---
  g.carve(22, 3, 34, 9, Region.CTSpawn); // CT spawn (north)
  g.carve(34, 5, 41, 9, Region.Connect); // A short (CT -> A)
  g.carve(40, 6, 54, 18, Region.ASite); // A site (NE)
  g.carve(28, 9, 30, 46, Region.Mid); // mid corridor
  g.carve(31, 16, 41, 19, Region.Cat); // catwalk (mid -> A)
  g.carve(49, 18, 53, 50, Region.Long); // A long (right side)
  g.carve(42, 49, 53, 53, Region.Connect); // T -> long doors
  g.carve(30, 50, 44, 57, Region.TSpawn); // T spawn (south)
  g.carve(26, 44, 34, 50, Region.Connect); // T -> mid junction
  g.carve(8, 44, 33, 48, Region.Tunnel); // upper tunnels (T -> B)
  g.carve(8, 20, 13, 48, Region.Tunnel); // B tunnel (vertical)
  g.carve(4, 14, 18, 26, Region.BSite); // B site (W)
  g.carve(13, 20, 28, 24, Region.Connect); // mid -> B (lower/doors)

  // Mid doors: a passable door prop sits across these cells.
  g.tag(28, 26, 30, 28, Region.Door);
  const doorCells = [
    { cx: 28, cz: 27 },
    { cx: 29, cz: 27 },
    { cx: 30, cz: 27 },
  ];

  // --- crates (cover + plant references) ---
  const crateCell = (cx: number, cz: number, hx: number, hz: number, height: number): Crate => {
    const c = g.centerOf(cx, cz);
    return { x: c.x, z: c.z, hx, hz, height };
  };
  const crates: Crate[] = [
    // A site
    crateCell(45, 13, 1.5, 1.5, 1.5),
    crateCell(48, 11, 1.5, 1.5, 1.5),
    crateCell(43, 9, 2.0, 1.1, 1.0),
    // B site
    crateCell(9, 21, 1.5, 1.5, 1.5),
    crateCell(13, 24, 1.5, 1.5, 1.5),
    crateCell(7, 17, 1.1, 1.1, 1.0),
    // mid / long / catwalk cover
    crateCell(29, 20, 1.3, 1.3, 1.2),
    crateCell(51, 34, 1.8, 1.3, 1.2),
    crateCell(36, 18, 1.3, 1.3, 1.2),
  ];

  // --- bomb sites ---
  const aCenter = g.centerOf(47, 12);
  const bCenter = g.centerOf(11, 20);
  const sites = {
    A: { name: 'A' as const, region: Region.ASite, center: aCenter, radius: 16 },
    B: { name: 'B' as const, region: Region.BSite, center: bCenter, radius: 15 },
  };

  // --- spawns ---
  const spawnAt = (cx: number, cz: number): SpawnPoint => g.centerOf(cx, cz);
  const tSpawns = [
    spawnAt(32, 54),
    spawnAt(35, 55),
    spawnAt(38, 54),
    spawnAt(41, 55),
    spawnAt(43, 52),
  ];
  const ctSpawns = [
    spawnAt(24, 5),
    spawnAt(27, 6),
    spawnAt(30, 5),
    spawnAt(32, 7),
    spawnAt(25, 7),
  ];

  const bounds = {
    minX: g.originX,
    maxX: g.originX + COLS * CELL,
    minZ: g.originZ,
    maxZ: g.originZ + ROWS * CELL,
  };

  return { grid: g, crates, sites, tSpawns, ctSpawns, doorCells, bounds };
}

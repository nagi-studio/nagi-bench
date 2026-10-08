/**
 * de_dust2 — procedurally authored, zero external assets.
 *
 * The map is described as a union of axis-aligned rectangular "regions"
 * (rooms / corridors) in metres.  Those regions are rasterised into an
 * occupancy grid which is then used for:
 *   - movement collision   (see physics.ts)
 *   - bullet / LOS raycast (see grid.ts)
 *   - bot pathfinding      (A* over walkable cells)
 *   - minimap rendering
 *
 * World axes: +X east, +Y up, +Z south  (north is -Z, i.e. "up" on the radar).
 */

import { CELL, NavGrid } from './grid';

// ---------------------------------------------------------------------------
// Region definitions
// ---------------------------------------------------------------------------

export interface RegionDef {
  id: string;
  label: string;
  /** inclusive-exclusive rectangle in metres */
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  /** covered by a ceiling (tunnels / indoor corridors) */
  roof: boolean;
  /** wall / ceiling height in metres */
  height: number;
  /** higher priority regions keep their id where rects overlap */
  priority: number;
}

/**
 * Regions are rasterised in ascending `priority` order, so a higher priority
 * region keeps its identity wherever two rectangles overlap.
 */
export const REGIONS: RegionDef[] = [
  // --- T side -------------------------------------------------------------
  { id: 'UPPER_TUNNEL', label: '上洞', x0: -20, z0: 30, x1: 18, z1: 42, roof: true, height: 3.4, priority: 3 },
  { id: 'TUNNEL_BEND', label: '洞弯道', x0: 12, z0: 26, x1: 32, z1: 38, roof: true, height: 3.4, priority: 3 },
  { id: 'B_TUNNEL', label: 'B 洞', x0: 26, z0: -2, x1: 38, z1: 34, roof: true, height: 3.4, priority: 4 },
  { id: 'T_SPAWN', label: 'T 出生点', x0: -49, z0: 18, x1: -10, z1: 40, roof: false, height: 5.0, priority: 8 },

  // --- A long / A site ----------------------------------------------------
  { id: 'A_LONG', label: 'A 大', x0: -54, z0: -26, x1: -45, z1: 22, roof: true, height: 4.2, priority: 4 },
  { id: 'A_SITE', label: 'A 点', x0: -54, z0: -46, x1: -34, z1: -20, roof: false, height: 6.0, priority: 9 },

  // --- mid ----------------------------------------------------------------
  { id: 'MID', label: '中路', x0: -13, z0: -20, x1: -1, z1: 22, roof: true, height: 3.6, priority: 4 },
  { id: 'CATWALK', label: '猫道', x0: -44, z0: -36, x1: -12, z1: -30, roof: false, height: 4.4, priority: 6 },
  { id: 'TOP_MID', label: '中门上', x0: -16, z0: -46, x1: 10, z1: -30, roof: false, height: 5.2, priority: 5 },
  { id: 'MID_DOORS', label: '中门', x0: -14, z0: -36, x1: 0, z1: -16, roof: true, height: 3.6, priority: 7 },

  // --- CT side ------------------------------------------------------------
  { id: 'CT_MID', label: 'CT 中路', x0: 4, z0: -42, x1: 26, z1: -26, roof: false, height: 5.0, priority: 4 },
  { id: 'CT_SPAWN', label: 'CT 出生点', x0: 22, z0: -46, x1: 54, z1: -26, roof: false, height: 5.6, priority: 8 },
  { id: 'B_DOORS', label: 'B 门', x0: 16, z0: -32, x1: 32, z1: -16, roof: true, height: 3.6, priority: 7 },

  // --- B site -------------------------------------------------------------
  { id: 'B_SITE', label: 'B 点', x0: 26, z0: -20, x1: 52, z1: 6, roof: false, height: 6.0, priority: 9 },
];

export const REGION_INDEX: Record<string, number> = {};
REGIONS.forEach((r, i) => (REGION_INDEX[r.id] = i));

// ---------------------------------------------------------------------------
// Static props (crates, barrels, the mid doors, site platforms…)
// ---------------------------------------------------------------------------

export interface PropDef {
  id: string;
  /** centre */
  x: number;
  z: number;
  /** full width (X) and depth (Z) */
  w: number;
  d: number;
  /** full height */
  h: number;
  /** base height above the floor (0 = sitting on the floor) */
  y: number;
  /** blocks movement (always true for now) */
  solid: boolean;
  /** thin wood / glass — bullets punch through with reduced damage */
  penetrable: boolean;
  kind: 'crate' | 'barrel' | 'platform' | 'door' | 'car' | 'sandbag';
}

export const PROPS: PropDef[] = [
  // ---- A site cover ----------------------------------------------------
  { id: 'a-crate-1', x: -50, z: -26, w: 2.4, d: 2.4, h: 1.3, y: 0, solid: true, penetrable: false, kind: 'crate' },
  { id: 'a-crate-2', x: -46.5, z: -23.5, w: 2.4, d: 2.4, h: 2.6, y: 0, solid: true, penetrable: false, kind: 'crate' },
  { id: 'a-crate-3', x: -50, z: -43, w: 3.0, d: 2.2, h: 1.3, y: 0, solid: true, penetrable: false, kind: 'crate' },
  { id: 'a-platform', x: -38.5, z: -42, w: 7.0, d: 3.0, h: 1.1, y: 0, solid: true, penetrable: false, kind: 'platform' },
  { id: 'a-sandbag-1', x: -44, z: -31, w: 3.4, d: 1.1, h: 1.0, y: 0, solid: true, penetrable: false, kind: 'sandbag' },
  { id: 'a-barrel-1', x: -41, z: -27, w: 1.2, d: 1.2, h: 1.5, y: 0, solid: true, penetrable: false, kind: 'barrel' },

  // ---- A long cover ----------------------------------------------------
  { id: 'al-crate-1', x: -51, z: 8, w: 2.6, d: 2.6, h: 1.3, y: 0, solid: true, penetrable: false, kind: 'crate' },
  { id: 'al-barrel-1', x: -47, z: -6, w: 1.2, d: 1.2, h: 1.5, y: 0, solid: true, penetrable: false, kind: 'barrel' },
  { id: 'al-barrel-2', x: -51, z: -12, w: 1.2, d: 1.2, h: 1.5, y: 0, solid: true, penetrable: false, kind: 'barrel' },
  // Narrow the A-long -> A-site mouth down to a ~5 m gap.
  { id: 'al-car', x: -47.5, z: -21.5, w: 4.6, d: 1.8, h: 1.5, y: 0, solid: true, penetrable: false, kind: 'car' },
  { id: 'al-crate-2', x: -51.5, z: -18, w: 2.4, d: 2.4, h: 1.3, y: 0, solid: true, penetrable: false, kind: 'crate' },

  // ---- B site cover ----------------------------------------------------
  { id: 'b-crate-1', x: 30, z: -14, w: 2.6, d: 2.6, h: 1.3, y: 0, solid: true, penetrable: false, kind: 'crate' },
  { id: 'b-crate-2', x: 34, z: -10, w: 2.6, d: 2.6, h: 2.6, y: 0, solid: true, penetrable: false, kind: 'crate' },
  { id: 'b-crate-3', x: 44, z: -16, w: 2.6, d: 2.6, h: 1.3, y: 0, solid: true, penetrable: false, kind: 'crate' },
  { id: 'b-crate-4', x: 48, z: 0, w: 3.0, d: 2.6, h: 2.6, y: 0, solid: true, penetrable: false, kind: 'crate' },
  { id: 'b-platform', x: 40, z: -18, w: 6.0, d: 2.6, h: 1.1, y: 0, solid: true, penetrable: false, kind: 'platform' },
  { id: 'b-barrel-1', x: 28, z: 2, w: 1.2, d: 1.2, h: 1.5, y: 0, solid: true, penetrable: false, kind: 'barrel' },

  // ---- mid: xbox + doors ------------------------------------------------
  { id: 'mid-xbox', x: -6, z: -33, w: 2.2, d: 2.2, h: 1.4, y: 0, solid: true, penetrable: false, kind: 'crate' },
  // The two mid-door leaves: solid, but mounted swung-open on the sides so the
  // 6 m doorway between them is fully walkable ("可穿过的中门门体").
  { id: 'mid-door-l', x: -12.6, z: -27, w: 2.6, d: 0.35, h: 3.2, y: 0, solid: true, penetrable: false, kind: 'door' },
  { id: 'mid-door-r', x: -1.4, z: -27, w: 2.6, d: 0.35, h: 3.2, y: 0, solid: true, penetrable: false, kind: 'door' },

  // ---- misc -------------------------------------------------------------
  { id: 'ct-crate-1', x: 26, z: -42, w: 2.4, d: 2.4, h: 1.3, y: 0, solid: true, penetrable: false, kind: 'crate' },
  { id: 't-crate-1', x: -40, z: 22, w: 2.4, d: 2.4, h: 1.3, y: 0, solid: true, penetrable: false, kind: 'crate' },
  { id: 'tunnel-crate-1', x: 31, z: 20, w: 2.4, d: 2.4, h: 1.3, y: 0, solid: true, penetrable: false, kind: 'crate' },
];

// ---------------------------------------------------------------------------
// Bombsites, spawns, bot waypoint seeds
// ---------------------------------------------------------------------------

export interface SiteDef {
  id: 'A' | 'B';
  label: string;
  /** plant volume (metres) */
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  /** where bots prefer to plant */
  plantSpot: { x: number; z: number };
}

export const SITES: SiteDef[] = [
  { id: 'A', label: 'A 点', x0: -53, z0: -44, x1: -36, z1: -24, plantSpot: { x: -44, z: -34 } },
  { id: 'B', label: 'B 点', x0: 28, z0: -18, x1: 50, z1: 2, plantSpot: { x: 39, z: -8 } },
];

export const T_SPAWN_POINTS = [
  { x: -42, z: 34 },
  { x: -36, z: 36 },
  { x: -30, z: 34 },
  { x: -26, z: 37 },
  { x: -33, z: 30 },
];

export const CT_SPAWN_POINTS = [
  { x: 48, z: -32 },
  { x: 42, z: -34 },
  { x: 36, z: -31 },
  { x: 30, z: -34 },
  { x: 45, z: -40 },
];

/**
 * Interesting destinations used to seed bot patrols / rushes.
 * Deliberately un-annotated so a typo in a key is a compile error.
 */
export const NAV_POINTS = {
  T_SPAWN: { x: -33, z: 30 },
  A_LONG_START: { x: -50, z: 18 },
  A_LONG_MID: { x: -50, z: 0 },
  A_LONG_END: { x: -49, z: -22 },
  A_SITE: { x: -44, z: -33 },
  A_SITE_PLATFORM: { x: -38, z: -38 },
  CATWALK: { x: -30, z: -33 },
  CATWALK_EAST: { x: -16, z: -33 },
  TOP_MID: { x: -5, z: -38 },
  MID_DOORS: { x: -7, z: -24 },
  MID: { x: -7, z: 0 },
  T_MID_EXIT: { x: -20, z: 30 },
  CT_MID: { x: 12, z: -36 },
  CT_SPAWN: { x: 40, z: -36 },
  B_DOORS: { x: 24, z: -24 },
  B_SITE: { x: 39, z: -7 },
  B_SITE_BACK: { x: 48, z: -14 },
  B_TUNNEL: { x: 32, z: 20 },
  TUNNEL_BEND: { x: 22, z: 32 },
  UPPER_TUNNEL: { x: 0, z: 36 },
};

// ---------------------------------------------------------------------------
// Grid construction
// ---------------------------------------------------------------------------

export interface Box {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export function propBoxes(): Box[] {
  return PROPS.filter((p) => p.solid).map((p) => ({
    minX: p.x - p.w / 2,
    maxX: p.x + p.w / 2,
    minY: p.y,
    maxY: p.y + p.h,
    minZ: p.z - p.d / 2,
    maxZ: p.z + p.d / 2,
  }));
}

/** Prop boxes that also block bullets / line of sight. */
export function propBlockBoxes(): Box[] {
  return PROPS.filter((p) => p.solid && !p.penetrable).map((p) => ({
    minX: p.x - p.w / 2,
    maxX: p.x + p.w / 2,
    minY: p.y,
    maxY: p.y + p.h,
    minZ: p.z - p.d / 2,
    maxZ: p.z + p.d / 2,
  }));
}

export const GRID_COLS_DEF = 84;
export const GRID_ROWS_DEF = 66;
export const GRID_ORIGIN_X_DEF = -66;
export const GRID_ORIGIN_Z_DEF = -51;

export function buildDust2Grid(): NavGrid {
  const grid = new NavGrid(GRID_COLS_DEF, GRID_ROWS_DEF, CELL, GRID_ORIGIN_X_DEF, GRID_ORIGIN_Z_DEF);

  // Ascending priority: later writes win, so the most specific region owns
  // every overlap.
  const ordered = [...REGIONS].sort((a, b) => a.priority - b.priority);
  for (const r of ordered) {
    grid.fillRect(r.x0, r.z0, r.x1, r.z1, REGION_INDEX[r.id]! + 1, r.height, r.roof);
  }

  grid.finalise();
  return grid;
}

/** Convenience: which region id contains a world point (or null). */
export function regionAt(grid: NavGrid, x: number, z: number): string | null {
  const idx = grid.regionAt(x, z);
  if (idx <= 0) return null;
  return REGIONS[idx - 1]?.id ?? null;
}

export function siteAt(x: number, z: number): SiteDef | null {
  for (const s of SITES) {
    if (x >= s.x0 && x <= s.x1 && z >= s.z0 && z <= s.z1) return s;
  }
  return null;
}

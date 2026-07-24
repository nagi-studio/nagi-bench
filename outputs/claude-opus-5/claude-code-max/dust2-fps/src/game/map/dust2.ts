/**
 * de_dust2 — hand-authored floor plan.
 *
 * The map is described as a set of *walkable sectors* (axis aligned rectangles with a
 * floor height, optionally sloped) plus solid props. Everything else is derived:
 *
 *   - walls           -> generated along every sector edge that has no walkable neighbour
 *   - collision world -> walls + props as AABBs
 *   - navigation grid -> rasterised sectors minus props
 *   - minimap         -> the sector rectangles themselves
 *
 * That means the map is sealed and self-consistent by construction: there is exactly one
 * source of truth for "where can you stand".
 *
 * Axes: +X east, +Z south, +Y up. On the minimap north (-Z) is up, like the real radar.
 */

export type ZoneId =
  | 'tspawn'
  | 'tmid'
  | 'middoors'
  | 'mid'
  | 'ctmid'
  | 'ctspawn'
  | 'asite'
  | 'ashort'
  | 'catwalk'
  | 'along'
  | 'longdoors'
  | 'apit'
  | 'bsite'
  | 'bdoors'
  | 'btunnels';

export interface Sector {
  id: string;
  /** Display name, shown in the HUD location readout. */
  label: string;
  zone: ZoneId;
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  /** Floor height at the (x0, z0) corner. */
  y: number;
  /** Optional slope: floor lerps from `y` to `y1` along the given axis. */
  ramp?: { axis: 'x' | 'z'; y1: number };
  /** Enclosed sectors get a roof this many metres above the floor. */
  ceiling?: number;
  /** Wall height for generated walls bordering this sector. */
  wallHeight?: number;
}

export type PropKind = 'crate' | 'crateBig' | 'metal' | 'concrete' | 'barrel' | 'door' | 'car';

export interface PropDef {
  id: string;
  kind: PropKind;
  /** Centre on X/Z, base on Y. */
  x: number;
  y: number;
  z: number;
  /** Full size. */
  sx: number;
  sy: number;
  sz: number;
}

export interface BombSiteDef {
  id: 'A' | 'B';
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

export interface SpawnDef {
  x: number;
  z: number;
  yaw: number;
}

export const WALL_HEIGHT = 4.2;

/** North is -Z: yaw 0 faces north, PI faces south. */
const SOUTH = Math.PI;
const NORTH = 0;

export const SECTORS: Sector[] = [
  // ---------------------------------------------------------------- T side
  { id: 't_spawn', label: 'T Spawn', zone: 'tspawn', x0: 4, z0: -56, x1: 36, z1: -42, y: 1.0, wallHeight: 5.5 },
  { id: 't_ramp', label: 'T Ramp', zone: 'tspawn', x0: 22, z0: -42, x1: 36, z1: -30, y: 1.0, ramp: { axis: 'z', y1: 0.5 } },
  { id: 't_mid', label: 'T Mid', zone: 'tmid', x0: -6, z0: -42, x1: 12, z1: -30, y: 1.0 },

  // ------------------------------------------------------------------- Mid
  { id: 'mid_doors', label: 'Mid Doors', zone: 'middoors', x0: -6, z0: -30, x1: 4, z1: -26, y: 0.8, ceiling: 4.4 },
  { id: 'mid', label: 'Mid', zone: 'mid', x0: -6, z0: -26, x1: 4, z1: -6, y: 0.6 },
  { id: 'under', label: 'CT Mid', zone: 'ctmid', x0: -10, z0: -6, x1: 4, z1: 8, y: 0.4 },

  // -------------------------------------------------------------- Catwalk / short
  { id: 'cat_ramp', label: 'Catwalk Stairs', zone: 'catwalk', x0: 4, z0: -20, x1: 10, z1: -14, y: 0.6, ramp: { axis: 'z', y1: 1.6 } },
  { id: 'catwalk', label: 'Catwalk', zone: 'catwalk', x0: 4, z0: -14, x1: 10, z1: -2, y: 1.6 },
  { id: 'a_short', label: 'A Short', zone: 'ashort', x0: 4, z0: -2, x1: 10, z1: 6, y: 1.6, ramp: { axis: 'z', y1: 0.0 } },

  // ------------------------------------------------------------------ CT side
  { id: 'ct_spawn', label: 'CT Spawn', zone: 'ctspawn', x0: -14, z0: 8, x1: 4, z1: 26, y: 0.0, wallHeight: 5.5 },
  { id: 'ct_to_a', label: 'CT Ramp', zone: 'ctspawn', x0: 4, z0: 14, x1: 8, z1: 20, y: 0.0 },

  // -------------------------------------------------------------------- A side
  { id: 'a_site', label: 'A Site', zone: 'asite', x0: 6, z0: 6, x1: 26, z1: 24, y: 0.0, wallHeight: 5.0 },
  { id: 'a_pit_stairs', label: 'A Pit', zone: 'apit', x0: 26, z0: 6, x1: 31, z1: 8, y: 0.0, ramp: { axis: 'z', y1: -1.2 } },
  { id: 'a_pit', label: 'A Pit', zone: 'apit', x0: 26, z0: 8, x1: 34, z1: 16, y: -1.2 },
  { id: 'long_corner', label: 'Long Corner', zone: 'along', x0: 12, z0: -4, x1: 34, z1: 6, y: 0.0 },
  { id: 'long', label: 'Long A', zone: 'along', x0: 20, z0: -26, x1: 34, z1: -4, y: 0.5, ramp: { axis: 'z', y1: 0.0 } },
  { id: 'long_doors', label: 'Long Doors', zone: 'longdoors', x0: 24, z0: -30, x1: 32, z1: -26, y: 0.5, ceiling: 4.2 },

  // -------------------------------------------------------------------- B side
  { id: 'upper_tunnel', label: 'Upper Tunnels', zone: 'btunnels', x0: -20, z0: -50, x1: 6, z1: -43, y: 1.0, ceiling: 3.6 },
  { id: 'lower_tunnel', label: 'Lower Tunnels', zone: 'btunnels', x0: -28, z0: -47, x1: -20, z1: -32, y: 1.0, ramp: { axis: 'z', y1: 0.5 }, ceiling: 3.6 },
  { id: 'b_tun_exit', label: 'B Tunnel Exit', zone: 'btunnels', x0: -28, z0: -32, x1: -20, z1: -26, y: 0.5 },
  { id: 'b_site', label: 'B Site', zone: 'bsite', x0: -48, z0: -32, x1: -28, z1: -8, y: 0.5, wallHeight: 5.0 },
  { id: 'b_corridor', label: 'B Doors', zone: 'bdoors', x0: -36, z0: -8, x1: -30, z1: 20, y: 0.5 },
  { id: 'b_doors', label: 'CT to B', zone: 'bdoors', x0: -30, z0: 12, x1: -14, z1: 20, y: 0.5, ramp: { axis: 'x', y1: 0.0 } },
];

export const PROPS: PropDef[] = [
  // --- Mid doors: two solid leaves with a walkable gap between them ---------
  { id: 'middoor_l', kind: 'door', x: -4.1, y: 0.8, z: -28, sx: 3.8, sy: 3.0, sz: 0.28 },
  { id: 'middoor_r', kind: 'door', x: 2.4, y: 0.8, z: -28, sx: 3.2, sy: 3.0, sz: 0.28 },
  // --- Long doors ----------------------------------------------------------
  { id: 'longdoor_l', kind: 'door', x: 25.3, y: 0.5, z: -28, sx: 2.6, sy: 3.0, sz: 0.28 },
  { id: 'longdoor_r', kind: 'door', x: 30.7, y: 0.5, z: -28, sx: 2.6, sy: 3.0, sz: 0.28 },

  // --- A site cover --------------------------------------------------------
  { id: 'a_plat', kind: 'concrete', x: 11.5, y: 0, z: 19, sx: 6, sy: 1.3, sz: 6 },
  { id: 'a_box1', kind: 'crate', x: 15.5, y: 0, z: 11, sx: 2, sy: 2, sz: 2 },
  { id: 'a_box2', kind: 'crate', x: 15.5, y: 2, z: 11, sx: 1.7, sy: 1.7, sz: 1.7 },
  { id: 'a_box3', kind: 'crate', x: 20.5, y: 0, z: 16.5, sx: 2, sy: 2, sz: 2 },
  { id: 'a_goose', kind: 'crateBig', x: 8.6, y: 0, z: 9.5, sx: 3.6, sy: 2.4, sz: 3 },
  { id: 'a_barrel1', kind: 'barrel', x: 23, y: 0, z: 9, sx: 1, sy: 1.3, sz: 1 },
  { id: 'a_car', kind: 'car', x: 22, y: 0, z: 21.5, sx: 4.6, sy: 1.7, sz: 2.2 },

  // --- Long / pit ----------------------------------------------------------
  { id: 'long_barrel1', kind: 'barrel', x: 22.4, y: 0.25, z: -12, sx: 1, sy: 1.3, sz: 1 },
  { id: 'long_barrel2', kind: 'barrel', x: 23.4, y: 0.25, z: -13.2, sx: 1, sy: 1.3, sz: 1 },
  { id: 'long_crate', kind: 'crate', x: 31, y: 0.1, z: -7, sx: 2, sy: 2, sz: 2 },
  { id: 'pit_crate', kind: 'crate', x: 31.5, y: -1.2, z: 13, sx: 2, sy: 2, sz: 2 },
  { id: 'corner_crate', kind: 'crateBig', x: 15, y: 0, z: 2.5, sx: 3, sy: 2.2, sz: 3 },

  // --- Mid -----------------------------------------------------------------
  { id: 'xbox', kind: 'crate', x: 1.2, y: 0.6, z: -17, sx: 2, sy: 2, sz: 2 },
  { id: 'mid_barrel', kind: 'barrel', x: -4.2, y: 0.6, z: -21, sx: 1, sy: 1.3, sz: 1 },
  { id: 'cat_crate', kind: 'crate', x: 8.4, y: 1.6, z: -6, sx: 1.6, sy: 1.6, sz: 1.6 },

  // --- B site cover --------------------------------------------------------
  { id: 'b_plat', kind: 'concrete', x: -42, y: 0.5, z: -26, sx: 8, sy: 1.5, sz: 7 },
  { id: 'b_box1', kind: 'crate', x: -33, y: 0.5, z: -14, sx: 2, sy: 2, sz: 2 },
  { id: 'b_box2', kind: 'crateBig', x: -44.5, y: 0.5, z: -13, sx: 3, sy: 2.2, sz: 3 },
  { id: 'b_car', kind: 'car', x: -31.5, y: 0.5, z: -22, sx: 2.2, sy: 1.7, sz: 4.6 },
  { id: 'b_barrel', kind: 'barrel', x: -37, y: 0.5, z: -11, sx: 1, sy: 1.3, sz: 1 },

  // --- Tunnels / CT / T spawn clutter --------------------------------------
  { id: 'tun_crate', kind: 'crate', x: -24, y: 0.85, z: -37, sx: 1.6, sy: 1.6, sz: 1.6 },
  { id: 'ct_crate1', kind: 'crate', x: -12.4, y: 0, z: 14, sx: 2, sy: 2, sz: 2 },
  { id: 'ct_crate2', kind: 'metal', x: 2.4, y: 0, z: 10.5, sx: 2.4, sy: 1.6, sz: 2.4 },
  { id: 't_crate1', kind: 'crate', x: 9, y: 1.0, z: -52, sx: 2, sy: 2, sz: 2 },
  { id: 't_crate2', kind: 'crateBig', x: 30, y: 1.0, z: -52, sx: 3, sy: 2.2, sz: 3 },
  { id: 'bdoor_crate', kind: 'metal', x: -33.2, y: 0.5, z: 4, sx: 2.4, sy: 1.6, sz: 2.4 },
];

export const BOMB_SITES: BombSiteDef[] = [
  { id: 'A', x0: 8, z0: 8, x1: 23, z1: 21 },
  { id: 'B', x0: -46, z0: -30, x1: -31, z1: -11 },
];

export const T_SPAWNS: SpawnDef[] = [
  { x: 12, z: -47, yaw: SOUTH },
  { x: 16, z: -49, yaw: SOUTH },
  { x: 20, z: -47, yaw: SOUTH },
  { x: 24, z: -49, yaw: SOUTH },
  { x: 28, z: -47, yaw: SOUTH },
];

export const CT_SPAWNS: SpawnDef[] = [
  { x: -11, z: 22, yaw: NORTH },
  { x: -7, z: 24, yaw: NORTH },
  { x: -3, z: 22, yaw: NORTH },
  { x: 1, z: 24, yaw: NORTH },
  { x: -5, z: 19, yaw: NORTH },
];

/**
 * Tactical waypoints. The AI plans as a sequence of these (A* handles the fine grained
 * movement in between), which keeps bot movement readable as real Dust2 routes.
 */
export const WAYPOINTS = {
  tSpawn: { x: 20, z: -48 },
  tMid: { x: 2, z: -36 },
  midDoors: { x: -1, z: -28 },
  mid: { x: -1, z: -16 },
  catRamp: { x: 7, z: -17 },
  catwalk: { x: 7, z: -8 },
  aShort: { x: 7, z: 4 },
  tRamp: { x: 29, z: -36 },
  longDoors: { x: 28, z: -28 },
  long: { x: 27, z: -14 },
  longCorner: { x: 24, z: 1 },
  aSite: { x: 15, z: 14 },
  aSiteBack: { x: 20, z: 20 },
  pit: { x: 30, z: 11 },
  ctSpawn: { x: -5, z: 20 },
  ctToA: { x: 6, z: 17 },
  ctMid: { x: -3, z: 2 },
  bDoors: { x: -22, z: 16 },
  bCorridor: { x: -33, z: 2 },
  bSite: { x: -38, z: -18 },
  bSiteBack: { x: -44, z: -20 },
  upperTunnel: { x: -12, z: -47 },
  lowerTunnel: { x: -24, z: -40 },
  bTunExit: { x: -24, z: -29 },
} as const;

export type WaypointId = keyof typeof WAYPOINTS;

/** Attack routes used by T bots, defence anchors used by CT bots. */
export const T_ROUTES: Record<'A' | 'B', WaypointId[][]> = {
  A: [
    ['tSpawn', 'tRamp', 'longDoors', 'long', 'longCorner', 'aSite'],
    ['tSpawn', 'tMid', 'midDoors', 'mid', 'catRamp', 'catwalk', 'aShort', 'aSite'],
    ['tSpawn', 'tRamp', 'longDoors', 'long', 'pit', 'aSite'],
  ],
  B: [
    ['tSpawn', 'upperTunnel', 'lowerTunnel', 'bTunExit', 'bSite'],
    ['tSpawn', 'upperTunnel', 'lowerTunnel', 'bTunExit', 'bSiteBack'],
    ['tSpawn', 'tMid', 'midDoors', 'mid', 'ctMid', 'bCorridor', 'bSite'],
  ],
};

export const CT_ANCHORS: Record<'A' | 'B', WaypointId[]> = {
  A: ['aSite', 'aSiteBack', 'longCorner', 'pit', 'aShort'],
  B: ['bSite', 'bSiteBack', 'bTunExit', 'bCorridor'],
};

export const CT_ROTATIONS: Record<'A' | 'B', WaypointId[]> = {
  A: ['ctSpawn', 'ctToA', 'aSite'],
  B: ['ctSpawn', 'bDoors', 'bCorridor', 'bSite'],
};

export function mapBounds(): { minX: number; maxX: number; minZ: number; maxZ: number } {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const s of SECTORS) {
    minX = Math.min(minX, s.x0);
    maxX = Math.max(maxX, s.x1);
    minZ = Math.min(minZ, s.z0);
    maxZ = Math.max(maxZ, s.z1);
  }
  return { minX, maxX, minZ, maxZ };
}

/** Floor height of a sector at a world position (handles ramps). */
export function sectorFloorAt(s: Sector, x: number, z: number): number {
  if (!s.ramp) return s.y;
  if (s.ramp.axis === 'x') {
    const t = (x - s.x0) / (s.x1 - s.x0);
    return s.y + (s.ramp.y1 - s.y) * Math.min(1, Math.max(0, t));
  }
  const t = (z - s.z0) / (s.z1 - s.z0);
  return s.y + (s.ramp.y1 - s.y) * Math.min(1, Math.max(0, t));
}

export function sectorContains(s: Sector, x: number, z: number, margin = 0): boolean {
  return x >= s.x0 - margin && x <= s.x1 + margin && z >= s.z0 - margin && z <= s.z1 + margin;
}

export function findSector(x: number, z: number): Sector | null {
  for (const s of SECTORS) {
    if (sectorContains(s, x, z)) return s;
  }
  return null;
}

export function bombSiteAt(x: number, z: number): 'A' | 'B' | null {
  for (const site of BOMB_SITES) {
    if (x >= site.x0 && x <= site.x1 && z >= site.z0 && z <= site.z1) return site.id;
  }
  return null;
}

export function bombSiteCenter(id: 'A' | 'B'): { x: number; z: number } {
  const s = BOMB_SITES.find((b) => b.id === id)!;
  return { x: (s.x0 + s.x1) / 2, z: (s.z0 + s.z1) / 2 };
}

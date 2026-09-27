// Dust2 layout data (meters). Top-down: +X = east, +Z = south (so north = -Z).
// The map is described as a set of walkable "areas" (rooms / corridors / ramps). Everything
// that is not covered by an area becomes solid wall (see mapGrid.ts), which guarantees the
// map is always sealed and that walls line up with the walkable space exactly.

export type RegionId =
  | 'tspawn'
  | 'outside_long'
  | 'long_doors'
  | 'long'
  | 'asite'
  | 'mid'
  | 'middoors'
  | 'ctmid'
  | 'cat'
  | 'short'
  | 'ctspawn'
  | 'lowertunnel'
  | 'tunnels'
  | 'bsite'
  | 'bdoors';

export const REGION_NAMES: Record<RegionId, string> = {
  tspawn: 'T出生点',
  outside_long: 'A大外',
  long_doors: 'A大门',
  long: 'A大',
  asite: 'A点',
  mid: '中路',
  middoors: '中门',
  ctmid: 'CT中路',
  cat: '猫道',
  short: 'A小',
  ctspawn: 'CT出生点',
  lowertunnel: '下B洞',
  tunnels: 'B洞',
  bsite: 'B点',
  bdoors: 'B门',
};

export interface Ramp {
  axis: 'x' | 'z';
  /** height at the min coordinate edge of the axis */
  hMin: number;
  /** height at the max coordinate edge of the axis */
  hMax: number;
}

export interface Area {
  id: string;
  region: RegionId;
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  h: number;
  ramp?: Ramp;
}

export type PropKind = 'crate' | 'concrete' | 'container' | 'car' | 'door' | 'lintel' | 'roof' | 'barrel';

export interface PropDef {
  kind: PropKind;
  /** min/max corners. y0 undefined -> sits on floor at its center */
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  /** height of the box */
  h: number;
  /** explicit base height (otherwise floor height at center) */
  y0?: number;
}

const A = (id: string, region: RegionId, x0: number, z0: number, x1: number, z1: number, h = 0, ramp?: Ramp): Area => ({
  id,
  region,
  x0,
  z0,
  x1,
  z1,
  h,
  ramp,
});

export const SITE_H = 1.2;

export const AREAS: Area[] = [
  // --- T side
  A('tspawn', 'tspawn', -14, 40, 20, 54),
  A('t_to_long', 'outside_long', 20, 42, 30, 50),
  A('outside_long', 'outside_long', 28, 30, 44, 48),
  A('long_doors', 'long_doors', 37, 21, 41, 30),
  A('long', 'long', 34, -26, 48, 21),
  A('long_ramp', 'long', 36, -32, 46, -26, 0, { axis: 'z', hMin: SITE_H, hMax: 0 }),
  // --- A site
  A('asite', 'asite', 24, -54, 48, -32, SITE_H),
  // --- Mid
  A('top_mid', 'mid', -2, 26, 6, 40),
  A('mid', 'mid', -4, -22, 6, 26),
  A('mid_doors', 'middoors', -1, -25, 3, -22),
  A('ct_mid', 'ctmid', -4, -44, 6, -25),
  // --- Catwalk / short
  A('cat_ramp', 'cat', 6, -8, 14, -2, 0, { axis: 'x', hMin: 0, hMax: SITE_H }),
  A('catwalk', 'cat', 14, -30, 20, -2, SITE_H),
  A('short', 'short', 14, -38, 24, -30, SITE_H),
  // --- CT spawn
  A('ctspawn', 'ctspawn', -8, -58, 18, -44),
  A('ct_ramp', 'ctspawn', 18, -52, 24, -44, 0, { axis: 'x', hMin: 0, hMax: SITE_H }),
  // --- Tunnels
  A('lower_tunnel', 'lowertunnel', -32, -4, -4, 1),
  A('t_to_tunnels', 'tunnels', -40, 40, -14, 48),
  A('upper_tunnel', 'tunnels', -40, -28, -32, 40),
  A('tunnel_room', 'tunnels', -46, 8, -32, 26),
  // --- B site
  A('bsite', 'bsite', -54, -56, -27, -28),
  A('b_doorway', 'bdoors', -27, -52, -24, -48),
  A('ct_to_b', 'bdoors', -24, -54, -8, -46),
];

export const MAP_BOUNDS = { x0: -58, z0: -62, x1: 52, z1: 58 };

const box = (kind: PropKind, cx: number, cz: number, w: number, d: number, h: number, y0?: number): PropDef => ({
  kind,
  x0: cx - w / 2,
  x1: cx + w / 2,
  z0: cz - d / 2,
  z1: cz + d / 2,
  h,
  y0,
});

const rect = (kind: PropKind, x0: number, z0: number, x1: number, z1: number, h: number, y0?: number): PropDef => ({
  kind,
  x0,
  z0,
  x1,
  z1,
  h,
  y0,
});

export const WALL_TOP = 7.5;
const DOOR_H = 2.9;
const LINTEL_Y = 3.3;

export const PROPS: PropDef[] = [
  // T spawn
  box('crate', -10, 50, 2, 2, 1.1),
  box('crate', 16, 51.5, 2, 2, 1.1),
  box('crate', 16, 51.5, 1.5, 1.5, 1.0, 1.1),
  box('concrete', 3, 42, 3, 1, 1.0),
  // outside long
  box('crate', 42, 45.5, 2, 2, 1.1),
  box('barrel', 30.6, 32, 0.9, 0.9, 1.1),
  // long
  box('crate', 35.3, 12, 1.4, 1.4, 1.1),
  box('container', 46.4, -18, 2.4, 5, 2.5),
  box('crate', 35.5, -18, 1.6, 1.6, 1.1),
  // A site
  box('crate', 34, -45, 2.4, 2.4, 1.2),
  box('crate', 36.4, -45, 2.4, 2.4, 1.2),
  box('crate', 35.2, -45, 1.6, 1.6, 1.1, SITE_H + 1.2),
  box('crate', 46, -52, 2, 2, 1.1),
  box('crate', 28.5, -36, 1.8, 1.8, 1.1),
  box('crate', 26.5, -50, 2, 2, 1.1),
  box('concrete', 44, -36.5, 3, 1, 1.0),
  // mid
  box('crate', 4, -9, 1.6, 1.6, 1.2), // "xbox"
  box('crate', -2.8, 18, 1.4, 1.4, 1.0),
  box('concrete', 5.3, 8, 1.4, 3, 0.9),
  // CT mid
  box('crate', 4, -38, 2, 2, 1.1),
  // catwalk
  box('crate', 15.2, -20, 1.2, 1.2, 1.0),
  // CT spawn
  box('crate', 0, -56, 2, 2, 1.1),
  box('crate', 12, -47, 2, 2, 1.1),
  // B site
  box('crate', -40, -42, 2.4, 2.4, 1.2),
  box('crate', -40, -42, 2.0, 2.0, 1.1, 1.2),
  box('crate', -50.5, -52, 2, 2, 1.1),
  box('crate', -48.3, -52, 2, 2, 1.1),
  box('crate', -49.4, -52, 1.6, 1.6, 1.0, 1.1),
  box('car', -35, -50, 2.1, 4.4, 1.0, 0.25),
  box('car', -35, -50.3, 1.8, 2.2, 0.62, 1.25),
  box('crate', -29.5, -35, 1.6, 1.6, 1.1),
  box('crate', -52, -34, 2, 2, 1.1),
  // tunnels
  box('crate', -44.5, 24, 1.5, 1.5, 1.1),
  box('crate', -20, 46.3, 1.6, 1.6, 1.1),
  box('barrel', -33, 12, 0.9, 0.9, 1.1),

  // --- Doors (thin leaves). Mid doors: left leaf closed, right leaf swung open -> ~2m gap
  rect('door', -1, -23.58, 0.8, -23.42, DOOR_H),
  rect('door', 2.85, -23.5, 3, -21.7, DOOR_H),
  rect('lintel', -1, -25, 3, -22, WALL_TOP - LINTEL_Y, LINTEL_Y),
  // Long doors
  rect('door', 37, 26, 37.15, 28, DOOR_H),
  rect('door', 39.3, 25.92, 41, 26.08, DOOR_H),
  rect('lintel', 37, 25, 41, 27, WALL_TOP - LINTEL_Y, LINTEL_Y),
  // B doors (both leaves swung open into B site)
  rect('door', -29, -52, -27, -51.85, DOOR_H),
  rect('door', -29, -48.15, -27, -48, DOOR_H),
  rect('lintel', -27, -52, -24, -48, WALL_TOP - LINTEL_Y, LINTEL_Y),

  // --- Tunnel roofs
  rect('roof', -32, -4, -4, 1, 0.6, 3.4),
  rect('roof', -40, -24, -32, 8, 0.6, 3.4),
  rect('roof', -46, 8, -32, 26, 0.6, 3.9),
  rect('roof', -40, 26, -32, 36, 0.6, 3.4),
];

export interface Zone {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

export const BOMBSITES: Record<'A' | 'B', Zone & { plant: [number, number] }> = {
  A: { x0: 26, z0: -53, x1: 47, z1: -33, plant: [38, -41] },
  B: { x0: -53, z0: -55, x1: -28, z1: -30, plant: [-44, -45] },
};

export const SPAWNS = {
  T: [
    [-6, 48],
    [-2, 51],
    [2, 47],
    [6, 51],
    [10, 48],
  ] as [number, number][],
  CT: [
    [-2, -52],
    [2, -55],
    [6, -51],
    [10, -55],
    [14, -51],
  ] as [number, number][],
};

export const BUY_ZONES = {
  T: { x0: -14, z0: 38, x1: 22, z1: 54 } as Zone,
  CT: { x0: -8, z0: -58, x1: 20, z1: -42 } as Zone,
};

export type P2 = [number, number];

/** Attack routes for T (list of points ending on a bombsite). */
export const T_ROUTES: { id: string; site: 'A' | 'B'; points: P2[] }[] = [
  { id: 'long', site: 'A', points: [[30, 45], [39, 32], [39, 22], [41, 6], [41, -16], [41, -29], [38, -40]] },
  { id: 'cat', site: 'A', points: [[2, 36], [1, 10], [4, -4], [10, -5], [17, -14], [18, -33], [30, -40]] },
  { id: 'tunnels', site: 'B', points: [[-20, 44], [-36, 38], [-36, 14], [-36, -18], [-37, -32], [-43, -44]] },
  { id: 'midb', site: 'B', points: [[2, 36], [0, 8], [-2, -1.5], [-20, -1.5], [-36, -6], [-36, -26], [-44, -46]] },
];

/** CT holding spots: position + point to watch. */
export const CT_HOLDS: { id: string; site: 'A' | 'B' | 'mid'; pos: P2; look: P2 }[] = [
  { id: 'a_long', site: 'A', pos: [43, -40], look: [41, -5] },
  { id: 'a_short', site: 'A', pos: [31, -47], look: [20, -34] },
  { id: 'mid', site: 'mid', pos: [0.5, -34], look: [1.5, -10] },
  { id: 'b_site', site: 'B', pos: [-47, -44], look: [-36, -28] },
  { id: 'b_plat', site: 'B', pos: [-51, -48], look: [-36, -29] },
];

/** Positions Ts guard after plant, per site. */
export const POSTPLANT_HOLDS: Record<'A' | 'B', { pos: P2; look: P2 }[]> = {
  A: [
    { pos: [44, -34], look: [26, -46] },
    { pos: [30, -38], look: [24, -48] },
    { pos: [46, -48], look: [30, -52] },
    { pos: [26, -34], look: [22, -48] },
  ],
  B: [
    { pos: [-36, -32], look: [-26, -50] },
    { pos: [-50, -38], look: [-28, -50] },
    { pos: [-30, -40], look: [-26, -50] },
    { pos: [-46, -52], look: [-27, -50] },
  ],
};

/** Minimap / callout labels */
export const LABELS: { text: string; x: number; z: number; big?: boolean }[] = [
  { text: 'A', x: 38, z: -48, big: true },
  { text: 'B', x: -42, z: -50, big: true },
  { text: 'T', x: 3, z: 50, big: true },
  { text: 'CT', x: 5, z: -54, big: true },
  { text: 'A大', x: 41, z: 0 },
  { text: '中路', x: 1, z: 12 },
  { text: '中门', x: 1, z: -26 },
  { text: '猫道', x: 17, z: -12 },
  { text: 'B洞', x: -39, z: 16 },
  { text: '下洞', x: -18, z: -1.5 },
];

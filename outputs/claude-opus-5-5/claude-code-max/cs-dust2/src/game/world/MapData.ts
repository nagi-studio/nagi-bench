import type { SiteId, Team } from '../core/types';

/**
 * Dust2 core-area layout, authored in meters on a 0.5 m grid.
 * Axes: +X = east (radar right), +Z = south (radar down). T spawn is south, CT spawn north,
 * B site north-west, A site north-east — the classic radar orientation.
 *
 * Walkable space is described as floor rectangles (flat, ramps or stairs). Everything inside the
 * map bounds that is not floor becomes solid building mass, so every area is closed by walls.
 */

export type FloorTex = 'sand' | 'stone' | 'tiles' | 'concrete';
export type BoxKind = 'crate' | 'crateBig' | 'container' | 'lintel' | 'ceiling' | 'beam' | 'barrel' | 'car' | 'pillar';

export interface FloorDef {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  /** Flat height, or ramp height at the min edge of `axis`. */
  y: number;
  /** Ramp height at the max edge of `axis`. */
  y2?: number;
  axis?: 'x' | 'z';
  tex: FloorTex;
}

export interface BoxDef {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  y0: number;
  y1: number;
  kind: BoxKind;
  /** Collides with movement, bullets and sight (default true). */
  solid?: boolean;
}

export interface DoorLeafDef {
  hx: number;
  hz: number;
  /** Direction the leaf extends from the hinge, radians in the XZ plane (0 = +X, PI/2 = +Z). */
  angle: number;
  length: number;
  height: number;
  y0: number;
  thickness: number;
}

export interface WindowDef {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  sill: number;
  top: number;
}

export interface ZoneDef {
  name: string;
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

export interface BombsiteDef {
  id: SiteId;
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  /** Default plant spot used by bots. */
  plant: [number, number];
}

export interface HoldSpot {
  id: string;
  pos: [number, number];
  look: [number, number];
  area: SiteId | 'mid';
}

export interface MapLabel {
  text: string;
  x: number;
  z: number;
  big?: boolean;
}

export interface MapDef {
  name: string;
  bounds: { x0: number; z0: number; x1: number; z1: number };
  wallHeight: [number, number];
  floors: FloorDef[];
  boxes: BoxDef[];
  doors: DoorLeafDef[];
  windows: WindowDef[];
  zones: ZoneDef[];
  bombsites: BombsiteDef[];
  spawns: Record<Team, [number, number][]>;
  spawnLook: Record<Team, [number, number]>;
  points: Record<string, [number, number]>;
  /** Named T approach routes as point-name sequences. */
  routes: Record<string, string[]>;
  ctHolds: HoldSpot[];
  postPlant: Record<SiteId, HoldSpot[]>;
  labels: MapLabel[];
}

const floors: FloorDef[] = [];
const boxes: BoxDef[] = [];

function flat(x0: number, z0: number, x1: number, z1: number, y: number, tex: FloorTex = 'sand'): void {
  floors.push({ x0, z0, x1, z1, y, tex });
}

/** Ramp: height `yMin` at the min edge of `axis`, `yMax` at the max edge. */
function ramp(x0: number, z0: number, x1: number, z1: number, yMin: number, yMax: number, axis: 'x' | 'z', tex: FloorTex = 'stone'): void {
  floors.push({ x0, z0, x1, z1, y: yMin, y2: yMax, axis, tex });
}

/**
 * Stairs between two floor levels. The slice touching the higher floor is level with it,
 * the slice touching the lower floor is one step above it.
 */
function stairs(
  x0: number,
  z0: number,
  x1: number,
  z1: number,
  yAtMin: number,
  yAtMax: number,
  axis: 'x' | 'z',
  steps: number,
  tex: FloorTex = 'stone',
): void {
  const len = axis === 'x' ? x1 - x0 : z1 - z0;
  const rising = yAtMax > yAtMin;
  const d = Math.abs(yAtMax - yAtMin) / steps;
  for (let i = 0; i < steps; i++) {
    const a = (len * i) / steps;
    const b = (len * (i + 1)) / steps;
    const h = rising ? yAtMin + d * (i + 1) : yAtMin - d * i;
    if (axis === 'x') flat(x0 + a, z0, x0 + b, z1, h, tex);
    else flat(x0, z0 + a, x1, z0 + b, h, tex);
  }
}

function box(x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, kind: BoxKind, solid = true): void {
  boxes.push({ x0, z0, x1, z1, y0, y1, kind, solid });
}

/** Wooden crate of footprint w x d standing on y0. */
function crate(x: number, z: number, w: number, d: number, h: number, y0: number): void {
  box(x, z, x + w, z + d, y0, y0 + h, h > 1.5 ? 'crateBig' : 'crate');
}

// ----------------------------------------------------------------------------------------------
// Heights
const H_T = 1.6; // T spawn plateau
const H_A = 1.6; // A site / catwalk / short level
const H_UT = 0.8; // upper tunnels
const H_PIT = -1.2;

// ---------------------------------------------------------------- T spawn & exits
flat(38, 82, 64, 98, H_T, 'sand'); // T spawn
ramp(30, 84, 38, 92, H_UT, H_T, 'x', 'sand'); // west exit -> outside tunnels
ramp(42, 70, 52, 82, 0, H_T, 'z', 'sand'); // "suicide" slope down to top mid
ramp(64, 84, 72, 92, H_T, 0, 'x', 'sand'); // east exit -> outside long

// ---------------------------------------------------------------- Outside long / long doors / long A
flat(72, 80, 83, 92, 0, 'sand'); // outside long
flat(83, 83, 86, 89, 0, 'stone'); // long doors (A大门) doorway through the wall
flat(86, 76, 104, 92, 0, 'sand'); // long corner
flat(88, 40, 104, 76, 0, 'sand'); // long A (A大)
flat(88, 36, 98, 40, 0, 'sand'); // end of long
ramp(98, 36, 104, 40, H_PIT, 0, 'z', 'sand'); // slope into the pit
flat(98, 28, 104, 36, H_PIT, 'sand'); // pit (A坑)
ramp(88, 28, 98, 36, H_A, 0, 'z', 'stone'); // A ramp up to the site

// ---------------------------------------------------------------- A site
flat(76, 4, 104, 28, H_A, 'tiles'); // A site
flat(94, 4, 96, 10, H_A + 0.4, 'stone'); // step to A plat
flat(96, 4, 104, 10, H_A + 0.8, 'stone'); // A plat / goose corner

// ---------------------------------------------------------------- CT spawn & CT ramp
flat(56, 4, 72, 22, 0, 'concrete'); // CT spawn
ramp(72, 8, 76, 18, 0, H_A, 'x', 'stone'); // CT ramp up to A

// ---------------------------------------------------------------- CT mid, mid doors, mid
flat(34, 10, 56, 24, 0, 'sand'); // CT mid
flat(45, 24, 50, 26, 0, 'stone'); // mid doors (中门) doorway
flat(42, 26, 52, 64, 0, 'sand'); // mid (中路)
flat(40, 64, 58, 70, 0, 'sand'); // top mid

// ---------------------------------------------------------------- Catwalk / short A
stairs(52, 56, 58, 64, H_A, 0, 'z', 4, 'stone'); // catwalk stairs from mid
flat(53, 28, 58, 56, H_A, 'stone'); // catwalk (猫道)
flat(58, 28, 80, 33, H_A, 'stone'); // short A (A小)

// ---------------------------------------------------------------- Tunnels
flat(25.5, 46, 42, 51, 0, 'concrete'); // lower tunnels (下B洞)
flat(24, 46, 25.5, 51, 0.4, 'concrete'); // step up to upper tunnels
flat(16, 31.5, 24, 64, H_UT, 'concrete'); // upper tunnels (B洞)
flat(17, 30, 23, 31.5, 0.4, 'concrete'); // tunnel exit step into B
flat(14, 64, 30, 92, H_UT, 'sand'); // outside tunnels (B洞外)

// ---------------------------------------------------------------- B site
flat(4, 4, 32, 30, 0, 'tiles'); // B site
flat(32, 12, 34, 17, 0, 'stone'); // B doors doorway
flat(12, 4, 13.5, 10, 0.4, 'stone'); // step to B back plat
flat(4, 4, 12, 10, 0.8, 'stone'); // B back plat

// ---------------------------------------------------------------- Ceilings & lintels (no movement impact)
box(16, 31.5, 24, 58, H_UT + 3.3, H_UT + 3.9, 'ceiling'); // upper tunnel roof
box(24, 46, 42, 51, 3.2, 3.8, 'ceiling'); // lower tunnel roof
box(45, 24, 50, 26, 3.3, 7.2, 'lintel'); // mid doors
box(83, 83, 86, 89, 3.7, 7.2, 'lintel'); // long doors
box(32, 12, 34, 17, 3.0, 7.2, 'lintel'); // B doors
box(17, 30, 23, 31.5, 3.4, 7.2, 'lintel'); // tunnel exit
box(14, 58, 30, 58.6, 4.0, 5.0, 'beam', false); // decorative beam at the tunnel mouth
box(71.5, 84, 72.5, 92, 3.7, 7.6, 'lintel'); // arch: T spawn ramp -> outside long
box(42, 81.5, 52, 82.5, H_T + 3.5, H_T + 6.4, 'lintel'); // arch over the suicide slope
box(76, 27.6, 80, 28.4, H_A + 3.1, H_A + 6.4, 'lintel'); // arch: short A -> A site
box(53, 55.6, 58, 56.4, H_A + 3.0, H_A + 6.2, 'lintel'); // arch at the top of the catwalk stairs
box(30.5, 84, 31.5, 92, H_UT + 3.4, H_UT + 6.6, 'lintel'); // arch: T spawn -> outside tunnels

// ---------------------------------------------------------------- Cover objects
// A site
crate(85.6, 10.6, 2.2, 2.2, 2.2, H_A); // A big boxes
crate(87.8, 10.6, 1.2, 1.2, 1.1, H_A);
crate(85.6, 12.8, 1.2, 1.2, 1.1, H_A);
crate(92, 18.5, 1.2, 1.2, 1.1, H_A); // default plant box
crate(101.8, 4.6, 1.4, 1.4, 1.2, H_A + 0.8); // goose
crate(77, 24.2, 1.2, 1.2, 1.1, H_A); // short corner box
box(79.2, 19.6, 83.6, 21.8, H_A, H_A + 1.35, 'car'); // A car
// B site
crate(14, 15, 2.4, 2.4, 2.2, 0); // B double stack
crate(16.4, 15, 1.2, 1.2, 1.1, 0);
crate(14, 17.4, 1.2, 1.2, 1.1, 0);
crate(24.2, 23.6, 1.2, 1.2, 1.1, 0); // boxes near the tunnel exit
crate(25.4, 23.6, 1.2, 1.2, 1.1, 0);
crate(24.6, 23.6, 1.2, 1.2, 1.1, 1.1);
box(5.4, 23.6, 9.8, 25.8, 0, 1.35, 'car'); // B car
crate(5, 4.6, 1.2, 1.2, 1.1, 0.8); // on back plat
box(28.6, 5, 29.6, 6, 0, 1.2, 'barrel');
box(29.8, 5, 30.8, 6, 0, 1.2, 'barrel');
// Mid & CT mid
crate(49.6, 65.2, 1.8, 1.8, 1.15, 0); // Xbox
crate(52, 19, 2.2, 2.2, 2.2, 0); // CT mid boxes
crate(38, 11, 1.2, 1.2, 1.1, 0);
crate(42.4, 27.2, 1.2, 1.2, 1.1, 0); // mid doors box (T side)
// CT spawn
crate(62, 5.4, 2.2, 2.2, 2.2, 0);
crate(64.2, 5.4, 1.2, 1.2, 1.1, 0);
crate(68, 19, 1.2, 1.2, 1.1, 0);
// Long A
box(100, 63, 104, 71, 0, 2.6, 'container'); // blue container
crate(92.6, 52, 1.2, 1.2, 1.1, 0);
crate(95, 84, 2.2, 2.2, 2.2, 0); // long corner boxes
crate(97.2, 84, 1.2, 1.2, 1.1, 0);
box(88.4, 72.6, 89.4, 73.6, 0, 1.2, 'barrel');
// Outside long / T spawn / outside tunnels
crate(75.6, 81, 1.2, 1.2, 1.1, 0);
crate(44, 86, 2.2, 2.2, 2.2, H_T);
crate(58.6, 94.6, 1.2, 1.2, 1.1, H_T);
box(39, 95.4, 40, 96.4, H_T, H_T + 1.2, 'barrel');
crate(20, 72, 2.2, 2.2, 2.2, H_UT);
crate(25, 82, 1.2, 1.2, 1.1, H_UT);
box(26.4, 86, 27.4, 87, H_UT, H_UT + 1.2, 'barrel');

// ---------------------------------------------------------------- Door leaves
const DEG = Math.PI / 180;
const doors: DoorLeafDef[] = [
  // Mid doors: west leaf closed across the doorway, east leaf swung open towards CT side.
  { hx: 45, hz: 25, angle: 0, length: 2.5, height: 3.2, y0: 0, thickness: 0.14 },
  { hx: 50, hz: 25, angle: -90 * DEG, length: 2.5, height: 3.2, y0: 0, thickness: 0.14 },
  // Long doors: both leaves half open towards long, leaving the famous gap.
  { hx: 84.5, hz: 83, angle: 35 * DEG, length: 2.9, height: 3.6, y0: 0, thickness: 0.14 },
  { hx: 84.5, hz: 89, angle: -35 * DEG, length: 2.9, height: 3.6, y0: 0, thickness: 0.14 },
  // B doors: one leaf left hanging open against the B site wall.
  { hx: 32.6, hz: 12, angle: 180 * DEG, length: 2.4, height: 2.9, y0: 0, thickness: 0.14 },
];

const windows: WindowDef[] = [
  { x0: 32, z0: 20, x1: 34, z1: 23, sill: 1.1, top: 2.5 }, // B window (CT mid -> B site)
];

export const DUST2: MapDef = {
  name: 'de_dust2',
  bounds: { x0: 0, z0: 0, x1: 108, z1: 104 },
  wallHeight: [6.6, 9.4],
  floors,
  boxes,
  doors,
  windows,
  zones: [
    { name: 'T 出生点', x0: 30, z0: 80, x1: 72, z1: 100 },
    { name: 'A 门外', x0: 72, z0: 80, x1: 83, z1: 92 },
    { name: 'A 大门', x0: 83, z0: 80, x1: 88, z1: 92 },
    { name: 'A 大', x0: 86, z0: 36, x1: 104, z1: 92 },
    { name: 'A 坑', x0: 98, z0: 28, x1: 104, z1: 40 },
    { name: 'A 点', x0: 76, z0: 4, x1: 104, z1: 28 },
    { name: 'A 斜坡', x0: 88, z0: 28, x1: 98, z1: 36 },
    { name: 'CT 出生点', x0: 56, z0: 4, x1: 76, z1: 22 },
    { name: '中门', x0: 34, z0: 10, x1: 56, z1: 26 },
    { name: '中路', x0: 40, z0: 26, x1: 52, z1: 82 },
    { name: '猫道', x0: 52, z0: 33, x1: 58, z1: 64 },
    { name: 'A 小', x0: 53, z0: 28, x1: 80, z1: 33 },
    { name: '下 B 洞', x0: 24, z0: 45, x1: 42, z1: 52 },
    { name: 'B 洞', x0: 15, z0: 30, x1: 25, z1: 64 },
    { name: 'B 洞外', x0: 14, z0: 64, x1: 30, z1: 92 },
    { name: 'B 门', x0: 30, z0: 10, x1: 34, z1: 18 },
    { name: 'B 点', x0: 4, z0: 4, x1: 32, z1: 30 },
  ],
  bombsites: [
    { id: 'A', x0: 79, z0: 6, x1: 102, z1: 26, plant: [90.4, 15.2] },
    { id: 'B', x0: 5, z0: 6, x1: 28, z1: 28, plant: [18.6, 20.2] },
  ],
  spawns: {
    T: [
      [44.5, 91],
      [48.5, 93],
      [52.5, 90.5],
      [56.5, 93],
      [60.5, 91],
    ],
    CT: [
      [60, 10],
      [63.5, 8.5],
      [67, 10],
      [62, 14.5],
      [66, 15],
    ],
  },
  spawnLook: { T: [51, 70], CT: [47.5, 25] },
  points: {
    tSpawn: [52, 89],
    topMid: [46, 67],
    midLow: [47, 56],
    mid: [47, 44],
    midDoorsT: [47.5, 29.5],
    midDoorsCT: [48.6, 21],
    ctMid: [42, 17],
    ctSpawn: [64, 12],
    outsideLong: [78, 86],
    longDoorsIn: [90, 86],
    longCorner: [95, 79],
    longMid: [95, 58],
    longEnd: [93, 40],
    aRamp: [93, 31],
    catBottom: [55, 66.5],
    catTop: [55.5, 50],
    catEnd: [55.5, 30.5],
    short: [70, 30.5],
    shortEnd: [78, 26],
    aSite: [88, 16],
    outsideTunnels: [22, 80],
    upperTunnelsSouth: [20, 60],
    upperTunnels: [20, 44],
    tunnelExit: [20, 32.5],
    lowerTunnels: [34, 48.5],
    bDoors: [33, 14.5],
    bSite: [16, 21],
    ctRamp: [73, 13],
  },
  routes: {
    long: ['tSpawn', 'outsideLong', 'longDoorsIn', 'longCorner', 'longMid', 'longEnd', 'aRamp'],
    short: ['tSpawn', 'topMid', 'catBottom', 'catTop', 'catEnd', 'short', 'shortEnd'],
    midToA: ['tSpawn', 'topMid', 'midLow', 'mid', 'midDoorsT'],
    tunnels: ['tSpawn', 'outsideTunnels', 'upperTunnelsSouth', 'upperTunnels', 'tunnelExit'],
    midToB: ['tSpawn', 'topMid', 'midLow', 'mid', 'lowerTunnels', 'upperTunnels', 'tunnelExit'],
    midDoors: ['tSpawn', 'topMid', 'midLow', 'mid', 'midDoorsT', 'midDoorsCT', 'ctMid', 'bDoors'],
  },
  ctHolds: [
    { id: 'aLong', pos: [93, 23.5], look: [95, 60], area: 'A' },
    { id: 'aShort', pos: [84.5, 8.5], look: [77, 30], area: 'A' },
    { id: 'aGoose', pos: [100.5, 7.5], look: [93, 36], area: 'A' },
    { id: 'aCt', pos: [80, 12], look: [78, 28], area: 'A' },
    { id: 'mid', pos: [43.5, 17.5], look: [47.5, 30], area: 'mid' },
    { id: 'midBox', pos: [55, 21.5], look: [48, 28], area: 'mid' },
    { id: 'bSite', pos: [9.5, 13], look: [20, 31], area: 'B' },
    { id: 'bPlat', pos: [7, 7], look: [20, 31], area: 'B' },
    { id: 'bDoors', pos: [28.5, 17.5], look: [20, 31], area: 'B' },
    { id: 'bCar', pos: [11, 27.5], look: [21, 30], area: 'B' },
  ],
  postPlant: {
    A: [
      { id: 'pA1', pos: [83, 7], look: [74, 13], area: 'A' },
      { id: 'pA2', pos: [88.5, 24], look: [78, 30], area: 'A' },
      { id: 'pA3', pos: [97, 15], look: [74, 13], area: 'A' },
      { id: 'pA4', pos: [86, 16.5], look: [76, 13], area: 'A' },
    ],
    B: [
      { id: 'pB1', pos: [24, 12], look: [33, 14.5], area: 'B' },
      { id: 'pB2', pos: [10, 22], look: [33, 14.5], area: 'B' },
      { id: 'pB3', pos: [17, 8], look: [33, 14.5], area: 'B' },
      { id: 'pB4', pos: [27, 27], look: [33, 21.5], area: 'B' },
    ],
  },
  labels: [
    { text: 'A', x: 89, z: 15.5, big: true },
    { text: 'B', x: 16.5, z: 20.5, big: true },
    { text: 'T出生点', x: 51, z: 94.5 },
    { text: 'CT出生点', x: 64, z: 19 },
    { text: 'A大', x: 95.5, z: 56 },
    { text: 'A大门', x: 84.5, z: 79.5 },
    { text: 'A坑', x: 101, z: 32 },
    { text: '中路', x: 47, z: 46 },
    { text: '中门', x: 47.5, z: 21.5 },
    { text: '猫道', x: 55.5, z: 44 },
    { text: 'A小', x: 68, z: 30.6 },
    { text: 'B洞', x: 20, z: 44 },
    { text: '下B洞', x: 33.5, z: 48.6 },
    { text: 'B洞外', x: 22, z: 78 },
    { text: 'B门', x: 36.5, z: 14.5 },
    { text: 'A门外', x: 77.5, z: 89.5 },
  ],
};

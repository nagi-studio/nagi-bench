// "Tidal Yard" (潮汐货场) — an original three-lane bomb-defusal map set in a container port.
// Everything is generated from code: a 1 m cell grid is carved into walkable areas, the remaining
// solid cells are greedy-meshed into building blocks, and hand-placed props add cover.
//
// Layout (north is -Z, attackers spawn west, defenders spawn east):
//
//   [sea]  ───────────── Quay (long open lane) ─────────────┐
//    N-pass                                             Site A ── A back ─┐
//   ATK spawn ── Mid rail yard ──[mid gate]── Def-mid ── DEF spawn        │
//    S-pass        │  └ gantry stairs → elevated gantry → Site A           │
//   Warehouse ─ Tunnel (roofed, dog-leg) ───────────── Site B ── B back ──┘
//                  └ connector from mid        └ B side door from Def-mid

import { Vec3, hash2 } from './math';

export const F_MOVE = 1; // blocks bodies
export const F_RAY = 2; // blocks bullets and vision
export const F_RENDER = 4; // has a visible mesh
export const F_SOLID = F_MOVE | F_RAY | F_RENDER;

export const CELL = {
  Solid: 0,
  Asphalt: 1,
  Interior: 2,
  Concrete: 3,
  Dock: 4,
  Gravel: 5,
  Water: 6,
} as const;

export interface MapBox {
  min: Vec3;
  max: Vec3;
  mat: string;
  flags: number;
}

export interface Rect {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

export interface FloorQuad extends Rect {
  kind: number;
}

export interface HoldSpot {
  pos: [number, number];
  look: [number, number];
}

export interface SiteInfo {
  id: 'A' | 'B';
  rect: Rect;
  center: [number, number];
  plant: [number, number][];
  /** Attacker positions once the site is taken / the bomb is down. */
  post: HoldSpot[];
  /** Defender positions. */
  holds: HoldSpot[];
}

export interface MapLight {
  pos: Vec3;
  color: number;
  intensity: number;
  dist: number;
}

export interface MapDecor {
  kind: 'barrel' | 'lamp' | 'rail' | 'doorLeaf';
  pos: Vec3;
  size?: Vec3;
  color?: number;
}

export interface MaterialSpec {
  tex: 'concrete' | 'brick' | 'corrugated' | 'crate' | 'metal' | 'plain';
  color: number;
  uv: 'world' | 'fit';
}

export const MATERIALS: Record<string, MaterialSpec> = {
  bldConcrete: { tex: 'concrete', color: 0xb9b4a8, uv: 'world' },
  bldConcreteDark: { tex: 'concrete', color: 0x8f959b, uv: 'world' },
  bldBrick: { tex: 'brick', color: 0xc9a48e, uv: 'world' },
  bldBrickPale: { tex: 'brick', color: 0xd8cdb8, uv: 'world' },
  bldMetal: { tex: 'corrugated', color: 0x7f9aa6, uv: 'world' },
  bldMetalTeal: { tex: 'corrugated', color: 0x4f8f8a, uv: 'world' },
  roof: { tex: 'concrete', color: 0x6c6f73, uv: 'world' },
  platform: { tex: 'concrete', color: 0x9aa0a3, uv: 'world' },
  stairs: { tex: 'concrete', color: 0xa9adaf, uv: 'world' },
  wall: { tex: 'concrete', color: 0xa8a59c, uv: 'world' },
  parapet: { tex: 'concrete', color: 0xc2c0b8, uv: 'world' },
  contRed: { tex: 'corrugated', color: 0xb5412f, uv: 'world' },
  contBlue: { tex: 'corrugated', color: 0x2f5fa3, uv: 'world' },
  contGreen: { tex: 'corrugated', color: 0x3c7d4f, uv: 'world' },
  contYellow: { tex: 'corrugated', color: 0xd1a22a, uv: 'world' },
  contWhite: { tex: 'corrugated', color: 0xd9d6cc, uv: 'world' },
  boxcar: { tex: 'corrugated', color: 0x8a4a33, uv: 'world' },
  crate: { tex: 'crate', color: 0xc79a5b, uv: 'fit' },
  crateDark: { tex: 'crate', color: 0x9a7444, uv: 'fit' },
  door: { tex: 'metal', color: 0x3f6f8f, uv: 'fit' },
  metalDark: { tex: 'metal', color: 0x4a4f55, uv: 'world' },
  barrier: { tex: 'concrete', color: 0xd0cfc8, uv: 'world' },
  clip: { tex: 'plain', color: 0xffffff, uv: 'world' },
};

export interface TacticalData {
  spawns: { atk: [number, number][]; def: [number, number][] };
  spawnYaw: { atk: number; def: number };
  sites: { A: SiteInfo; B: SiteInfo };
  midHolds: HoldSpot[];
  routes: {
    A: Record<string, [number, number][]>;
    B: Record<string, [number, number][]>;
  };
}

export interface MapData {
  name: string;
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
  cols: number;
  rows: number;
  /** 1 m cells, row-major (z * cols + x). */
  cells: Uint8Array;
  boxes: MapBox[];
  floors: FloorQuad[];
  roofs: Rect[];
  zones: { name: string; rect: Rect }[];
  lights: MapLight[];
  decor: MapDecor[];
  tac: TacticalData;
  sunDir: Vec3;
}

const MIN_X = -58;
const MAX_X = 54;
const MIN_Z = -44;
const MAX_Z = 44;

export const ROOF_Y = 4.0;

export function buildMap(): MapData {
  const cols = MAX_X - MIN_X;
  const rows = MAX_Z - MIN_Z;
  const cells = new Uint8Array(cols * rows); // all solid

  const carve = (x0: number, z0: number, x1: number, z1: number, kind: number) => {
    for (let z = z0; z < z1; z++) {
      for (let x = x0; x < x1; x++) {
        const cx = x - MIN_X;
        const cz = z - MIN_Z;
        if (cx < 0 || cz < 0 || cx >= cols || cz >= rows) continue;
        cells[cz * cols + cx] = kind;
      }
    }
  };

  // ---------------------------------------------------------------- walkable areas
  carve(-52, -44, 24, -40, CELL.Water); // open sea north of the quay
  carve(-54, -10, -40, 10, CELL.Asphalt); // attacker spawn
  carve(-52, -28, -44, -10, CELL.Asphalt); // north passage
  carve(-52, -40, 24, -29, CELL.Dock); // quay (long lane)
  carve(24, -40, 46, -20, CELL.Concrete); // site A
  carve(-40, -4, 10, 4, CELL.Gravel); // mid rail yard
  carve(10, -2, 11, 2, CELL.Gravel); // mid gate opening
  carve(11, -6, 26, 6, CELL.Asphalt); // defender mid
  carve(26, -10, 50, 12, CELL.Asphalt); // defender spawn
  carve(-10, -12, -6, -4, CELL.Concrete); // gantry stairs
  carve(-10, -18, 20, -12, CELL.Concrete); // gantry walkway (raised)
  carve(20, -26, 24, -12, CELL.Concrete); // gantry platform (raised)
  carve(38, -20, 46, -10, CELL.Asphalt); // A back passage
  carve(-52, 10, -44, 22, CELL.Asphalt); // south passage
  carve(-52, 22, -26, 40, CELL.Interior); // warehouse
  carve(-26, 26, -2, 32, CELL.Interior); // tunnel west leg
  carve(-8, 26, -2, 39, CELL.Interior); // tunnel dog-leg
  carve(-8, 33, 16, 39, CELL.Interior); // tunnel east leg
  carve(-18, 4, -13, 26, CELL.Interior); // connector mid <-> tunnel
  carve(16, 6, 21, 20, CELL.Asphalt); // B side-door corridor
  carve(36, 12, 42, 20, CELL.Asphalt); // B back passage
  carve(16, 20, 42, 40, CELL.Concrete); // site B

  const boxes: MapBox[] = [];
  const add = (
    x0: number,
    y0: number,
    z0: number,
    x1: number,
    y1: number,
    z1: number,
    mat: string,
    flags: number = F_SOLID,
  ) => {
    boxes.push({ min: { x: x0, y: y0, z: z0 }, max: { x: x1, y: y1, z: z1 }, mat, flags });
  };

  // ---------------------------------------------------------------- greedy-mesh buildings
  const used = new Uint8Array(cols * rows);
  const bldMats = ['bldConcrete', 'bldBrick', 'bldMetal', 'bldConcreteDark', 'bldBrickPale', 'bldMetalTeal'];
  const MAX_SPAN = 22;
  for (let cz = 0; cz < rows; cz++) {
    for (let cx = 0; cx < cols; cx++) {
      const i = cz * cols + cx;
      if (cells[i] !== CELL.Solid || used[i]) continue;
      let w = 1;
      while (cx + w < cols && w < MAX_SPAN && cells[i + w] === CELL.Solid && !used[i + w]) w++;
      let d = 1;
      outer: while (cz + d < rows && d < MAX_SPAN) {
        for (let k = 0; k < w; k++) {
          const j = (cz + d) * cols + cx + k;
          if (cells[j] !== CELL.Solid || used[j]) break outer;
        }
        d++;
      }
      for (let dz = 0; dz < d; dz++) for (let dx = 0; dx < w; dx++) used[(cz + dz) * cols + cx + dx] = 1;
      const h = hash2(cx * 7 + 3, cz * 13 + 1);
      const height = 6.5 + Math.floor(h * 4) * 0.9;
      const mat = bldMats[Math.floor(hash2(cx + 11, cz + 5) * bldMats.length) % bldMats.length];
      add(cx + MIN_X, 0, cz + MIN_Z, cx + w + MIN_X, height, cz + d + MIN_Z, mat);
    }
  }

  // ---------------------------------------------------------------- floors & roofs (greedy by kind)
  const floors: FloorQuad[] = [];
  const roofs: Rect[] = [];
  used.fill(0);
  for (let cz = 0; cz < rows; cz++) {
    for (let cx = 0; cx < cols; cx++) {
      const i = cz * cols + cx;
      const kind = cells[i];
      if (kind === CELL.Solid || kind === CELL.Water || used[i]) continue;
      let w = 1;
      while (cx + w < cols && cells[i + w] === kind && !used[i + w]) w++;
      let d = 1;
      outer2: while (cz + d < rows) {
        for (let k = 0; k < w; k++) {
          const j = (cz + d) * cols + cx + k;
          if (cells[j] !== kind || used[j]) break outer2;
        }
        d++;
      }
      for (let dz = 0; dz < d; dz++) for (let dx = 0; dx < w; dx++) used[(cz + dz) * cols + cx + dx] = 1;
      const rect = { x0: cx + MIN_X, z0: cz + MIN_Z, x1: cx + w + MIN_X, z1: cz + d + MIN_Z };
      floors.push({ ...rect, kind });
      if (kind === CELL.Interior) {
        roofs.push(rect);
        add(rect.x0, ROOF_Y, rect.z0, rect.x1, ROOF_Y + 2.6, rect.z1, 'roof');
      }
    }
  }

  // ---------------------------------------------------------------- props
  const decor: MapDecor[] = [];
  const container = (x: number, z: number, axis: 'x' | 'z', mat: string, y = 0) => {
    if (axis === 'x') add(x, y, z, x + 6, y + 2.6, z + 2.4, mat);
    else add(x, y, z, x + 2.4, y + 2.6, z + 6, mat);
  };
  const crate = (x: number, z: number, s: number, y = 0, mat = 'crate') => add(x, y, z, x + s, y + s, z + s, mat);
  const barrel = (x: number, z: number, color = 0x2f6f9f, y = 0) => {
    add(x - 0.3, y, z - 0.3, x + 0.3, y + 0.95, z + 0.3, 'clip', F_MOVE | F_RAY);
    decor.push({ kind: 'barrel', pos: { x, y, z }, color });
  };

  // Quay: sea wall, gate arch and containers
  add(-52, -3, -40.45, 24, 1.0, -40, 'parapet');
  add(-52, 0, -44, 24, 14, -40.4, 'clip', F_MOVE); // invisible wall above the sea
  add(-16, 0, -40, -15, 5.2, -37.5, 'wall');
  add(-16, 0, -32.5, -15, 5.2, -29, 'wall');
  add(-16.2, 4.0, -37.5, -14.8, 5.2, -32.5, 'metalDark');
  container(-36, -39.7, 'x', 'contBlue');
  container(-9, -31.5, 'x', 'contRed');
  container(4, -39.7, 'x', 'contGreen');
  container(4, -39.7, 'x', 'contYellow', 2.6);
  crate(14, -34, 1.0);
  crate(15, -34, 1.0);
  crate(15, -34, 1.0, 1.0, 'crateDark');
  barrel(-44, -30);
  barrel(-43.2, -29.6, 0xb5412f);
  crate(-27, -30.4, 1.3, 0, 'crateDark');

  // Site A
  add(24, 0, -40, 25, 6, -36, 'wall');
  container(31, -32.2, 'x', 'contBlue');
  container(41.6, -39, 'z', 'contRed');
  crate(30, -27, 1.4);
  crate(31.4, -27, 1.0, 0, 'crateDark');
  crate(36.4, -39, 1.4);
  barrel(26, -21);
  // chest-high barriers the defenders anchor behind (only the head shows above them)
  add(39.2, 0, -25.4, 39.7, 1.4, -23.0, 'barrier');
  add(32.8, 0, -24.2, 33.3, 1.4, -21.8, 'barrier');
  add(43.2, 0, -23.4, 43.7, 1.4, -21.0, 'barrier');
  crate(38.2, -15.5, 1.2);

  // Mid rail yard
  add(-25, 0, -3.4, -16, 3.2, -0.6, 'boxcar');
  decor.push({ kind: 'rail', pos: { x: -15, y: 0, z: -2.7 }, size: { x: 50, y: 0.07, z: 0.09 } });
  decor.push({ kind: 'rail', pos: { x: -15, y: 0, z: -1.3 }, size: { x: 50, y: 0.07, z: 0.09 } });
  crate(0, 1.8, 1.4);
  crate(1.4, 2.2, 1.0, 0, 'crateDark');
  crate(5, -3.6, 1.2);
  barrel(-36, 3.4);
  barrel(-35.2, 3.5, 0x3c7d4f);
  crate(-30, -3.8, 1.2, 0, 'crateDark');

  // Mid gate: frame posts, lintel and two door leaves swung open towards the defender side
  add(10, 0, -2, 11, 2.8, -1.4, 'metalDark');
  add(10, 0, 1.4, 11, 2.8, 2, 'metalDark');
  add(10, 2.8, -2, 11, 7.4, 2, 'wall');
  add(11, 0, -1.5, 12.35, 2.7, -1.4, 'door');
  add(11, 0, 1.4, 12.35, 2.7, 1.5, 'door');

  // Gantry: stairs up from mid, raised walkway, platform, stairs down into site A
  for (let k = 1; k <= 10; k++) {
    add(-10, 0, -4 - 0.8 * k, -6, 0.2 * k, -4 - 0.8 * (k - 1), 'stairs');
  }
  add(-10, 0, -18, 20, 2, -12, 'platform');
  add(20, 0, -26, 24, 2, -12, 'platform');
  for (let k = 1; k <= 9; k++) {
    add(24 + 0.5 * (k - 1), 0, -25, 24 + 0.5 * k, 2 - 0.2 * k, -21, 'stairs');
  }
  add(23.8, 2, -26, 24, 3.0, -25, 'metalDark');
  add(23.8, 2, -21, 24, 3.0, -20, 'metalDark');
  crate(4, -17.6, 1.2, 2);
  crate(14, -13.4, 1.0, 2, 'crateDark');

  // Defender mid & spawn
  crate(17, -5.7, 1.4);
  crate(18.4, -5.7, 1.0, 0, 'crateDark');
  add(22, 0, 2.8, 22.5, 1.4, 5.4, 'barrier');
  add(22.2, 0, -5.2, 22.7, 1.4, -2.8, 'barrier');
  container(40, 8.8, 'x', 'contWhite');
  // container wall between defender mid and the spawn: breaks the spawn-to-spawn sight line
  // through the mid gate and gives rotating defenders a covered lane
  container(29.6, -6, 'z', 'contBlue');
  container(29.6, 0, 'z', 'contRed');
  container(29.6, -3, 'z', 'contWhite', 2.6);
  crate(26.6, -9.7, 1.2);
  barrel(48.6, -8.6, 0xd1a22a);

  // B side-door corridor frame
  add(16, 0, 19, 17, 2.8, 20, 'metalDark');
  add(20, 0, 19, 21, 2.8, 20, 'metalDark');
  add(16, 2.8, 19, 21, 6, 20, 'wall');

  // Site B
  container(25, 29, 'x', 'contGreen');
  container(25, 29, 'x', 'contYellow', 2.6);
  container(37, 22, 'z', 'contBlue');
  crate(21, 36, 1.4);
  crate(22.4, 36.4, 1.0, 0, 'crateDark');
  crate(33, 35, 1.2);
  crate(19, 24, 1.0, 0, 'crateDark');
  barrel(41, 39);
  add(38.2, 0, 35.8, 38.7, 1.4, 38.2, 'barrier');
  add(25.6, 0, 21.6, 26.1, 1.4, 24.0, 'barrier');
  add(32.6, 0, 31.8, 33.1, 1.4, 34.2, 'barrier');
  add(39.3, 0, 29.4, 39.8, 1.4, 31.8, 'barrier');
  // tunnel mouth into site B
  add(16, 0, 33, 17, 3, 34.4, 'wall');
  add(16, 0, 37.6, 17, 3, 39, 'wall');
  add(16, 3, 33, 17, 4, 39, 'wall');

  // Tunnel, connector, warehouse
  crate(-14, 26.2, 1.2);
  crate(4, 37.7, 1.2, 0, 'crateDark');
  crate(-14.3, 14, 1.2);
  add(-46, 0, 27, -38, 2.4, 28.2, 'crateDark');
  add(-46, 0, 33, -38, 2.4, 34.2, 'crateDark');
  add(-34, 0, 30, -33.4, ROOF_Y, 30.6, 'metalDark');
  add(-44.6, 0, 30, -44, ROOF_Y, 30.6, 'metalDark');
  container(-34, 37.4, 'x', 'contRed');
  crate(-51.6, 38.4, 1.2);
  crate(-29, 23, 1.0);

  // Attacker spawn & passages
  container(-53.8, -9.6, 'z', 'contYellow');
  crate(-42, 6, 1.2);
  crate(-51.6, -20, 1.2, 0, 'crateDark');
  barrel(-45, 14);

  // ---------------------------------------------------------------- lights (roofed areas)
  const lights: MapLight[] = [];
  const lamp = (x: number, z: number, intensity = 30, color = 0xffd9a0) => {
    lights.push({ pos: { x, y: ROOF_Y - 0.45, z }, color, intensity, dist: 16 });
    decor.push({ kind: 'lamp', pos: { x, y: ROOF_Y - 0.12, z }, color });
  };
  lamp(-46, 25);
  lamp(-33, 26);
  lamp(-46, 36.5);
  lamp(-31, 34);
  lamp(-18, 29);
  lamp(-5, 30);
  lamp(-5, 36.5);
  lamp(8, 36);
  lamp(-15.5, 10);
  lamp(-15.5, 21);

  // ---------------------------------------------------------------- callout zones (first match wins)
  const zones: { name: string; rect: Rect }[] = [
    { name: '中门', rect: { x0: 7, z0: -3, x1: 13.5, z1: 3 } },
    { name: '栈桥', rect: { x0: -10, z0: -18, x1: 24, z1: -12 } },
    { name: '栈桥', rect: { x0: 20, z0: -26, x1: 24, z1: -12 } },
    { name: '栈桥阶梯', rect: { x0: -10, z0: -12, x1: -6, z1: -4 } },
    { name: 'A 区', rect: { x0: 24, z0: -40, x1: 46, z1: -20 } },
    { name: 'B 区', rect: { x0: 16, z0: 20, x1: 42, z1: 40 } },
    { name: '攻方出生点', rect: { x0: -54, z0: -10, x1: -40, z1: 10 } },
    { name: '守方出生点', rect: { x0: 26, z0: -10, x1: 50, z1: 12 } },
    { name: '北通道', rect: { x0: -52, z0: -28, x1: -44, z1: -10 } },
    { name: '码头长廊', rect: { x0: -52, z0: -40, x1: 24, z1: -28 } },
    { name: '中路铁轨', rect: { x0: -40, z0: -4, x1: 10, z1: 4 } },
    { name: '守方中路', rect: { x0: 11, z0: -6, x1: 26, z1: 6 } },
    { name: 'A 后路', rect: { x0: 38, z0: -20, x1: 46, z1: -10 } },
    { name: '南通道', rect: { x0: -52, z0: 10, x1: -44, z1: 22 } },
    { name: '仓库', rect: { x0: -52, z0: 22, x1: -26, z1: 40 } },
    { name: '联络道', rect: { x0: -18, z0: 4, x1: -13, z1: 26 } },
    { name: '暗道', rect: { x0: -26, z0: 26, x1: 16, z1: 39 } },
    { name: 'B 侧门', rect: { x0: 16, z0: 6, x1: 21, z1: 20 } },
    { name: 'B 后路', rect: { x0: 36, z0: 12, x1: 42, z1: 20 } },
  ];

  // ---------------------------------------------------------------- tactical data for the AI
  const tac: TacticalData = {
    spawns: {
      atk: [
        [-50, -6],
        [-47, -3],
        [-50, 0],
        [-47, 3],
        [-50, 6],
      ],
      def: [
        [44, -5],
        [47, -2],
        [44, 1],
        [47, 4],
        [44, 6.5],
      ],
    },
    spawnYaw: { atk: -Math.PI / 2, def: Math.PI / 2 },
    sites: {
      A: {
        id: 'A',
        rect: { x0: 26, z0: -39, x1: 45, z1: -21 },
        center: [35, -30],
        plant: [
          [34, -34.5],
          [38.5, -27],
          [29, -36],
          [39.5, -31.5],
        ],
        post: [
          { pos: [38.5, -38.3], look: [42, -20] },
          { pos: [27.5, -37.5], look: [41, -21] },
          { pos: [45, -30.5], look: [42, -20] },
          { pos: [30, -34.5], look: [26, -23] },
          { pos: [35.2, -25.6], look: [42, -19] },
        ],
        holds: [
          { pos: [40.3, -24.2], look: [25, -31] },
          { pos: [33.9, -23], look: [24, -23] },
          { pos: [38.5, -38.3], look: [25, -33] },
          { pos: [44.3, -22.2], look: [30, -28] },
        ],
      },
      B: {
        id: 'B',
        rect: { x0: 18.5, z0: 21.5, x1: 41, z1: 39 },
        center: [29, 30],
        plant: [
          [28, 34.5],
          [33, 26.5],
          [24, 26],
          [36, 33],
        ],
        post: [
          { pos: [33, 37.6], look: [39, 21] },
          { pos: [30, 33], look: [39, 21] },
          { pos: [20, 27], look: [19, 20] },
          { pos: [23.5, 34.5], look: [30, 21] },
          { pos: [40.5, 36], look: [39, 21] },
        ],
        holds: [
          { pos: [39.3, 37], look: [17, 36] },
          { pos: [26.7, 22.9], look: [18.5, 20] },
          { pos: [33.7, 33], look: [17, 36] },
          { pos: [40.4, 30.6], look: [17, 36] },
        ],
      },
    },
    midHolds: [
      { pos: [23.3, -4], look: [11, 0] },
      { pos: [23.1, 4.1], look: [11, 0] },
    ],
    routes: {
      A: {
        long: [
          [-48, -18],
          [-46, -34],
          [-22, -34.5],
          [-12, -35],
          [8, -33.5],
          [22, -32.5],
          [28, -32.5],
        ],
        gantry: [
          [-30, 2],
          [-8, 0],
          [-8, -10],
          [-4, -15],
          [14, -15.5],
          [22, -19],
          [22, -23],
          [30, -23.5],
        ],
      },
      B: {
        tunnel: [
          [-48, 16],
          [-44, 25],
          [-30, 29],
          [-12, 29.5],
          [-5, 30],
          [-5, 36],
          [8, 36],
          [19.5, 36],
        ],
        connector: [
          [-30, 2.5],
          [-15.5, 2],
          [-15.5, 20],
          [-10, 29],
          [-5, 36],
          [19.5, 36],
        ],
        mid: [
          [-8, 1],
          [8, 0],
          [13.5, 0],
          [18.5, 8],
          [18.5, 22],
        ],
      },
    },
  };

  const sun = { x: 0.42, y: 0.82, z: 0.38 };
  const sl = Math.hypot(sun.x, sun.y, sun.z);

  return {
    name: '潮汐货场',
    minX: MIN_X,
    minZ: MIN_Z,
    maxX: MAX_X,
    maxZ: MAX_Z,
    cols,
    rows,
    cells,
    boxes,
    floors,
    roofs,
    zones,
    lights,
    decor,
    tac,
    sunDir: { x: sun.x / sl, y: sun.y / sl, z: sun.z / sl },
  };
}

export function inRect(r: Rect, x: number, z: number): boolean {
  return x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1;
}

export function zoneName(map: MapData, x: number, z: number): string {
  for (const zn of map.zones) if (inRect(zn.rect, x, z)) return zn.name;
  return '';
}

export function siteAt(map: MapData, x: number, z: number): 'A' | 'B' | null {
  if (inRect(map.tac.sites.A.rect, x, z)) return 'A';
  if (inRect(map.tac.sites.B.rect, x, z)) return 'B';
  return null;
}

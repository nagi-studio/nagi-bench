import { MAP_CELL, MAP_H, MAP_W, WALL_HEIGHT, WALL_THICKNESS } from '../engine/constants';

export interface AABB {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

export type BoxKind = 'wall' | 'crate' | 'prop';

export interface BoxDef {
  x: number;
  z: number;
  w: number;
  h: number;
  d: number;
  y: number;
  kind: BoxKind;
  color: number;
  solid: boolean;
}

export interface RectXZ {
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
}

export interface SpawnPoint {
  x: number;
  z: number;
  yaw: number;
}

export interface Callout {
  name: string;
  x: number;
  z: number;
}

export interface MapData {
  walkable: Uint8Array;
  width: number;
  height: number;
  cell: number;
  boxes: BoxDef[];
  colliders: AABB[];
  sites: { A: RectXZ; B: RectXZ };
  tSpawns: SpawnPoint[];
  ctSpawns: SpawnPoint[];
  callouts: Callout[];
}

export const cellCenterX = (gx: number) => (gx - MAP_W / 2 + 0.5) * MAP_CELL;
export const cellCenterZ = (gz: number) => (gz - MAP_H / 2 + 0.5) * MAP_CELL;
export const worldToCellX = (x: number) => Math.floor(x / MAP_CELL + MAP_W / 2);
export const worldToCellZ = (z: number) => Math.floor(z / MAP_CELL + MAP_H / 2);

export function isWalkableCell(walkable: Uint8Array, gx: number, gz: number): boolean {
  if (gx < 0 || gz < 0 || gx >= MAP_W || gz >= MAP_H) return false;
  return walkable[gz * MAP_W + gx] === 1;
}

export function isWalkableWorld(map: MapData, x: number, z: number): boolean {
  return isWalkableCell(map.walkable, worldToCellX(x), worldToCellZ(z));
}

function makeSites(): { A: RectXZ; B: RectXZ } {
  return {
    A: { minX: -56, minZ: -56, maxX: -34, maxZ: -40 },
    B: { minX: 34, minZ: -56, maxX: 56, maxZ: -40 },
  };
}

/**
 * Builds a stylised but spatially coherent Dust2 core: T spawn, CT spawn,
 * mid + mid doors, A long, A site, catwalk, B tunnels and B site, all connected.
 */
export function buildMapData(): MapData {
  const walkable = new Uint8Array(MAP_W * MAP_H);

  const fill = (x0: number, z0: number, x1: number, z1: number) => {
    for (let gz = 0; gz < MAP_H; gz++) {
      const cz = cellCenterZ(gz);
      if (cz < z0 - 1e-6 || cz > z1 + 1e-6) continue;
      for (let gx = 0; gx < MAP_W; gx++) {
        const cx = cellCenterX(gx);
        if (cx < x0 - 1e-6 || cx > x1 + 1e-6) continue;
        walkable[gz * MAP_W + gx] = 1;
      }
    }
  };
  const clear = (x0: number, z0: number, x1: number, z1: number) => {
    for (let gz = 0; gz < MAP_H; gz++) {
      const cz = cellCenterZ(gz);
      if (cz < z0 - 1e-6 || cz > z1 + 1e-6) continue;
      for (let gx = 0; gx < MAP_W; gx++) {
        const cx = cellCenterX(gx);
        if (cx < x0 - 1e-6 || cx > x1 + 1e-6) continue;
        walkable[gz * MAP_W + gx] = 0;
      }
    }
  };

  // --- Spawns ---------------------------------------------------------------
  fill(-16, 44, 16, 62); // T spawn
  fill(-16, -62, 16, -44); // CT spawn

  // --- Mid (with passable mid doors) ---------------------------------------
  fill(-4, -48, 4, 48);
  clear(-4, -1, 4, 1);
  fill(-2, -1, 2, 1); // 4m doorway

  // --- A long (L shape from T spawn to A site) ------------------------------
  fill(-56, 48, -16, 62);
  fill(-56, -44, -44, 62);

  // --- A site ---------------------------------------------------------------
  fill(-60, -60, -30, -34);

  // --- Catwalk: mid -> A site ----------------------------------------------
  fill(-40, -14, -4, -4);
  fill(-40, -40, -28, -4);

  // --- B tunnels (L shape from T spawn to B site) ---------------------------
  fill(16, 48, 56, 62);
  fill(44, -44, 56, 62);

  // --- B site ---------------------------------------------------------------
  fill(30, -60, 60, -34);

  // --- CT spawn connectors --------------------------------------------------
  fill(-32, -56, -16, -44); // CT -> A
  fill(16, -56, 32, -44); // CT -> B

  // --- Mid -> B (lower tunnels / B doors) -----------------------------------
  fill(4, 16, 44, 24);

  const boxes: BoxDef[] = [];
  const colliders: AABB[] = [];

  const addWallBox = (cx: number, cz: number, w: number, d: number) => {
    boxes.push({ x: cx, z: cz, w, h: WALL_HEIGHT, d, y: WALL_HEIGHT / 2, kind: 'wall', color: 0, solid: true });
    colliders.push({
      minX: cx - w / 2,
      maxX: cx + w / 2,
      minZ: cz - d / 2,
      maxZ: cz + d / 2,
      minY: 0,
      maxY: WALL_HEIGHT,
    });
  };

  const isW = (gx: number, gz: number) => isWalkableCell(walkable, gx, gz);

  // Horizontal boundaries (walls running along X).
  for (let j = 0; j <= MAP_H; j++) {
    const z = (j - MAP_H / 2) * MAP_CELL;
    let runStart = -1;
    for (let gx = 0; gx <= MAP_W; gx++) {
      const edge = gx < MAP_W ? isW(gx, j - 1) !== isW(gx, j) : false;
      if (edge && runStart < 0) runStart = gx;
      if ((!edge || gx === MAP_W) && runStart >= 0) {
        const gxEnd = gx - 1;
        const xL = (runStart - MAP_W / 2) * MAP_CELL;
        const xR = (gxEnd + 1 - MAP_W / 2) * MAP_CELL;
        addWallBox((xL + xR) / 2, z, xR - xL, WALL_THICKNESS);
        runStart = -1;
      }
    }
  }

  // Vertical boundaries (walls running along Z).
  for (let i = 0; i <= MAP_W; i++) {
    const x = (i - MAP_W / 2) * MAP_CELL;
    let runStart = -1;
    for (let gz = 0; gz <= MAP_H; gz++) {
      const edge = gz < MAP_H ? isW(i - 1, gz) !== isW(i, gz) : false;
      if (edge && runStart < 0) runStart = gz;
      if ((!edge || gz === MAP_H) && runStart >= 0) {
        const gzEnd = gz - 1;
        const zT = (runStart - MAP_H / 2) * MAP_CELL;
        const zB = (gzEnd + 1 - MAP_H / 2) * MAP_CELL;
        addWallBox(x, (zT + zB) / 2, WALL_THICKNESS, zB - zT);
        runStart = -1;
      }
    }
  }

  // --- Crates / cover -------------------------------------------------------
  const crates: Array<[number, number, number, number, number]> = [
    // [x, z, w, h, d]
    [-46, -50, 3.2, 1.6, 3.2],
    [-40, -44, 2.6, 1.6, 2.6],
    [-52, -44, 2.6, 2.6, 2.6],
    [-36, -52, 2.2, 1.2, 2.2],
    [-48, -36, 3.0, 1.6, 2.0],
    [-26, -12, 2.4, 1.4, 2.4],
    [-30, -30, 2.6, 1.6, 2.6],
    [0, 20, 3.0, 1.6, 2.4],
    [0, -20, 3.0, 1.6, 2.4],
    [2, 30, 2.4, 1.4, 2.4],
    [46, -50, 3.2, 1.6, 3.2],
    [52, -44, 2.6, 2.6, 2.6],
    [40, -44, 2.4, 1.4, 2.4],
    [36, -52, 2.2, 1.2, 2.2],
    [50, -36, 2.8, 1.6, 2.2],
    [50, 52, 2.6, 1.4, 2.6],
    [24, 52, 2.6, 1.4, 2.6],
    [-48, 56, 2.6, 1.4, 2.6],
    [-24, 56, 2.6, 1.4, 2.6],
    [22, 20, 2.4, 1.4, 2.4],
    [30, 22, 2.0, 2.0, 2.0],
    [-20, -6, 2.2, 1.3, 2.2],
    [-28, -10, 2.4, 1.5, 2.4],
    [48, -20, 2.6, 1.5, 2.6],
    [-4, -38, 2.0, 1.3, 2.0],
    [-34, -40, 2.2, 1.4, 2.2],
  ];
  for (const [x, z, w, h, d] of crates) {
    boxes.push({ x, z, w, h, d, y: h / 2, kind: 'crate', color: 0, solid: true });
    colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, minY: 0, maxY: h });
  }

  const tSpawns: SpawnPoint[] = [
    { x: -8, z: 55, yaw: 0 },
    { x: -3, z: 57, yaw: 0 },
    { x: 2, z: 55, yaw: 0 },
    { x: 8, z: 57, yaw: 0 },
    { x: -1, z: 52, yaw: 0 },
  ];
  const ctSpawns: SpawnPoint[] = [
    { x: -8, z: -55, yaw: Math.PI },
    { x: -3, z: -57, yaw: Math.PI },
    { x: 2, z: -55, yaw: Math.PI },
    { x: 8, z: -57, yaw: Math.PI },
    { x: -1, z: -52, yaw: Math.PI },
  ];

  const callouts: Callout[] = [
    { name: 'T 出生点', x: 0, z: 55 },
    { name: 'CT 出生点', x: 0, z: -55 },
    { name: 'A 点', x: -46, z: -48 },
    { name: 'B 点', x: 46, z: -48 },
    { name: 'A 大', x: -50, z: 20 },
    { name: '中路', x: 0, z: 8 },
    { name: '中门', x: 0, z: 0 },
    { name: '猫道', x: -22, z: -9 },
    { name: 'B 洞', x: 50, z: 20 },
  ];

  return { walkable, width: MAP_W, height: MAP_H, cell: MAP_CELL, boxes, colliders, sites: makeSites(), tSpawns, ctSpawns, callouts };
}

/** True if (x,z) is inside one of the bomb sites; returns which one. */
export function siteAt(map: MapData, x: number, z: number): 'A' | 'B' | null {
  const inRect = (r: RectXZ) => x >= r.minX && x <= r.maxX && z >= r.minZ && z <= r.maxZ;
  if (inRect(map.sites.A)) return 'A';
  if (inRect(map.sites.B)) return 'B';
  return null;
}

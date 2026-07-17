import * as THREE from 'three';
import type { AABB, Door, FloorRect, NavGrid, Rect } from './types';
import { groundAt, makeBox } from './physics';

export interface SpawnPoint {
  x: number;
  z: number;
  yaw: number;
}

export interface MapData {
  group: THREE.Group;
  /** static solid colliders (walls, crates, ceilings, headers) */
  solids: AABB[];
  doors: Door[];
  floors: FloorRect[];
  zones: { A: Rect; B: Rect };
  plantPoints: { A: { x: number; z: number }; B: { x: number; z: number } };
  spawns: { T: SpawnPoint[]; CT: SpawnPoint[] };
  waypoints: Record<string, [number, number][]>;
  nav: NavGrid;
  bounds: Rect;
  rooms: Rect[];
}

const WALL_H = 3.4;
const WALL_T = 0.35;

/** Ground-level rooms. Adjacency (shared edge / overlap) becomes an opening automatically. */
const ROOMS: Rect[] = [
  { x1: -55, z1: -55, x2: -2, z2: -25 }, // A site
  { x1: -14, z1: -30, x2: 10, z2: 10 }, // short / catwalk room
  { x1: 8, z1: -42, x2: 36, z2: 2 }, // CT spawn
  { x1: -2, z1: -42, x2: 8, z2: -30 }, // A-CT corridor
  { x1: 34, z1: -12, x2: 44, z2: 2 }, // CT-B corridor
  { x1: 40, z1: -50, x2: 64, z2: -12 }, // B site
  { x1: -10, z1: 0, x2: 0, z2: 55 }, // mid
  { x1: -55, z1: -25, x2: -45, z2: 55 }, // long (A大)
  { x1: -45, z1: 40, x2: -28, z2: 56 }, // outside long
  { x1: -28, z1: 40, x2: 2, z2: 60 }, // T plaza
  { x1: -52, z1: 56, x2: -28, z2: 72 }, // T spawn
  { x1: 2, z1: 44, x2: 50, z2: 52 }, // B tunnels lower (B洞)
  { x1: 46, z1: -12, x2: 52, z2: 52 }, // B tunnels vertical
];

const TUNNEL_RECTS: Rect[] = [ROOMS[11], ROOMS[12]];
const TUNNEL_CEIL = 2.6;

/** catwalk (猫道) walkway + stairs */
const WALKWAY: FloorRect = { x1: -10, z1: -22, x2: -4, z2: 2, y: 2.7 };
const WALKWAY_TOP = 2.7;

interface CrateDef {
  cx: number;
  cz: number;
  w: number;
  d: number;
  h: number;
  y0?: number;
  olive?: boolean;
}

const CRATES: CrateDef[] = [
  { cx: -46, cz: -44, w: 2.2, d: 2.2, h: 1.2 },
  { cx: -43.5, cz: -44.8, w: 1.6, d: 1.6, h: 1.2 },
  { cx: -46, cz: -44, w: 1.4, d: 1.4, h: 1.1, y0: 1.2 },
  { cx: -52, cz: -51, w: 1.8, d: 1.8, h: 1.1 },
  { cx: -11, cz: -2, w: 1.3, d: 1.3, h: 1.1, olive: true },
  { cx: -2, cz: 8, w: 1.4, d: 1.4, h: 1.15 },
  { cx: -52, cz: 18, w: 1.6, d: 1.6, h: 1.15 },
  { cx: -50, cz: -8, w: 2.0, d: 1.2, h: 1.2, olive: true },
  { cx: -40, cz: 48, w: 1.5, d: 1.5, h: 1.1 },
  { cx: -15, cz: 50, w: 1.4, d: 1.4, h: 1.1, olive: true },
  { cx: 20, cz: 48, w: 1.4, d: 1.4, h: 1.1 },
  { cx: 49, cz: 40, w: 1.3, d: 1.3, h: 1.05, olive: true },
  { cx: 44, cz: -40, w: 2.4, d: 1.6, h: 1.2 },
  { cx: 46.2, cz: -41, w: 1.4, d: 1.4, h: 1.1 },
  { cx: 56, cz: -24, w: 2.6, d: 2.6, h: 1.25, olive: true },
  { cx: 50, cz: -18, w: 1.5, d: 1.5, h: 1.1 },
  { cx: 20, cz: -30, w: 1.4, d: 1.4, h: 1.1, olive: true },
  { cx: 30, cz: -2, w: 1.3, d: 1.3, h: 1.05 },
];

const BARRELS: [number, number][] = [
  [-38, -48],
  [58, -42],
  [-8, 30],
  [30, 46],
];

function makeGroundTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#c2a878';
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const s = Math.random() * 2.2 + 0.4;
    const v = 150 + Math.random() * 60;
    g.fillStyle = `rgba(${v}, ${v * 0.86 | 0}, ${v * 0.6 | 0}, ${0.12 + Math.random() * 0.2})`;
    g.fillRect(x, y, s, s);
  }
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    g.fillStyle = 'rgba(90, 75, 50, 0.25)';
    g.beginPath();
    g.arc(x, y, 1 + Math.random() * 2, 0, 7);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(28, 28);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildMap(): MapData {
  const group = new THREE.Group();
  const solids: AABB[] = [];
  const floors: FloorRect[] = ROOMS.map((r) => ({ ...r, y: 0 }));
  const doors: Door[] = [];

  const wallMat = new THREE.MeshLambertMaterial({ color: 0xcbb391 });
  const crateWood = new THREE.MeshLambertMaterial({ color: 0x8a6b3d });
  const crateOlive = new THREE.MeshLambertMaterial({ color: 0x6a6f4a });
  const concrete = new THREE.MeshLambertMaterial({ color: 0x9a9a92 });
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x5f7080 });
  const ceilMat = new THREE.MeshLambertMaterial({ color: 0x8a7a5e });
  const barrelMat = new THREE.MeshLambertMaterial({ color: 0x7a5430 });

  // ---------- ground ----------
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 155),
    new THREE.MeshLambertMaterial({ map: makeGroundTexture() }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(5, -0.01, 9);
  ground.receiveShadow = true;
  group.add(ground);

  // ---------- rasterize rooms -> boundary walls ----------
  const CELL = 0.5;
  const OX = -58;
  const OZ = -58;
  const W = Math.ceil((69 - OX) / CELL);
  const H = Math.ceil((78 - OZ) / CELL);
  const mask = new Uint8Array(W * H);
  for (const r of ROOMS) {
    const cx1 = Math.round((r.x1 - OX) / CELL);
    const cx2 = Math.round((r.x2 - OX) / CELL);
    const cz1 = Math.round((r.z1 - OZ) / CELL);
    const cz2 = Math.round((r.z2 - OZ) / CELL);
    for (let cz = cz1; cz < cz2; cz++) {
      for (let cx = cx1; cx < cx2; cx++) {
        if (cx >= 0 && cz >= 0 && cx < W && cz < H) mask[cz * W + cx] = 1;
      }
    }
  }
  const at = (cx: number, cz: number): number =>
    cx < 0 || cz < 0 || cx >= W || cz >= H ? 0 : mask[cz * W + cx];

  const wallGeoUnit = new THREE.BoxGeometry(1, 1, 1);
  const addWall = (cx: number, cz: number, w: number, d: number) => {
    const mesh = new THREE.Mesh(wallGeoUnit, wallMat);
    mesh.scale.set(w, WALL_H, d);
    mesh.position.set(cx, WALL_H / 2, cz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    solids.push(makeBox(cx, cz, w, d, 0, WALL_H));
  };

  // horizontal edges (walls running along X at fixed Z)
  for (let cz = 0; cz <= H; cz++) {
    let run = -1;
    for (let cx = 0; cx <= W; cx++) {
      const boundary = at(cx, cz) !== at(cx, cz - 1);
      if (boundary && run < 0) run = cx;
      if ((!boundary || cx === W) && run >= 0) {
        const count = cx - run;
        const wx = OX + (run + count / 2) * CELL;
        const wz = OZ + cz * CELL;
        addWall(wx, wz, count * CELL + WALL_T, WALL_T);
        run = -1;
      }
    }
  }
  // vertical edges (walls running along Z at fixed X)
  for (let cx = 0; cx <= W; cx++) {
    let run = -1;
    for (let cz = 0; cz <= H; cz++) {
      const boundary = at(cx, cz) !== at(cx - 1, cz);
      if (boundary && run < 0) run = cz;
      if ((!boundary || cz === H) && run >= 0) {
        const count = cz - run;
        const wx = OX + cx * CELL;
        const wz = OZ + (run + count / 2) * CELL;
        addWall(wx, wz, WALL_T, count * CELL + WALL_T);
        run = -1;
      }
    }
  }

  // ---------- tunnel ceilings ----------
  for (const r of TUNNEL_RECTS) {
    const cx = (r.x1 + r.x2) / 2;
    const cz = (r.z1 + r.z2) / 2;
    const w = r.x2 - r.x1 + 0.6;
    const d = r.z2 - r.z1 + 0.6;
    const mesh = new THREE.Mesh(wallGeoUnit, ceilMat);
    mesh.scale.set(w, 0.45, d);
    mesh.position.set(cx, TUNNEL_CEIL + 0.225, cz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    solids.push(makeBox(cx, cz, w, d, TUNNEL_CEIL, TUNNEL_CEIL + 0.45));
  }

  // ---------- doors (中门 + A大长门): sliding panels with passable bodies ----------
  const addDoor = (x: number, z: number, width: number) => {
    // header above the doorway
    const header = new THREE.Mesh(wallGeoUnit, wallMat);
    header.scale.set(width, WALL_H - 2.3, 0.3);
    header.position.set(x, 2.3 + (WALL_H - 2.3) / 2, z);
    header.castShadow = true;
    group.add(header);
    solids.push(makeBox(x, z, width, 0.3, 2.3, WALL_H));

    const panelW = width / 2;
    const panels: Door['panels'] = [];
    for (const side of [-1, 1]) {
      const geo = new THREE.BoxGeometry(panelW - 0.06, 2.3, 0.22);
      const mesh = new THREE.Mesh(geo, doorMat);
      const closedPos = new THREE.Vector3(x + (side * panelW) / 2, 1.15, z);
      const openPos = new THREE.Vector3(x + (side * panelW) / 2 + side * panelW, 1.15, z);
      mesh.position.copy(closedPos);
      mesh.castShadow = true;
      group.add(mesh);
      panels.push({
        mesh,
        half: new THREE.Vector3(panelW / 2 - 0.03, 1.15, 0.11),
        closedPos,
        openPos,
        box: makeBox(closedPos.x, closedPos.z, panelW - 0.06, 0.22, 0, 2.3),
      });
    }
    doors.push({ x, z, panels, open: 0 });
  };
  addDoor(-5, 25, 10); // mid doors
  addDoor(-50, 5, 10); // long doors

  // ---------- crates ----------
  for (const c of CRATES) {
    const y0 = c.y0 ?? 0;
    const mesh = new THREE.Mesh(wallGeoUnit, c.olive ? crateOlive : crateWood);
    mesh.scale.set(c.w, c.h, c.d);
    mesh.position.set(c.cx, y0 + c.h / 2, c.cz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    solids.push(makeBox(c.cx, c.cz, c.w, c.d, y0, y0 + c.h));
  }

  // ---------- barrels ----------
  const barrelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.9, 10);
  for (const [bx, bz] of BARRELS) {
    const mesh = new THREE.Mesh(barrelGeo, barrelMat);
    mesh.position.set(bx, 0.45, bz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    solids.push(makeBox(bx, bz, 0.7, 0.7, 0, 0.9));
  }

  // ---------- catwalk (walkway + stairs) ----------
  {
    const w = WALKWAY;
    const width = w.x2 - w.x1;
    const depth = w.z2 - w.z1;
    const mesh = new THREE.Mesh(wallGeoUnit, concrete);
    mesh.scale.set(width, 0.25, depth);
    mesh.position.set((w.x1 + w.x2) / 2, w.y - 0.125, (w.z1 + w.z2) / 2);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    floors.push({ ...w });
  }
  const stepGeo = new THREE.BoxGeometry(1, 1, 1);
  const addStep = (x1: number, z1: number, x2: number, z2: number, top: number) => {
    floors.push({ x1, z1, x2, z2, y: top });
    const mesh = new THREE.Mesh(stepGeo, concrete);
    mesh.scale.set(x2 - x1, Math.max(top, 0.05), z2 - z1);
    mesh.position.set((x1 + x2) / 2, Math.max(top, 0.05) / 2, (z1 + z2) / 2);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    group.add(mesh);
  };
  const STEP_H = WALKWAY_TOP / 8;
  for (let i = 0; i < 8; i++) {
    // south stairs: from mid (z 10, y 0) up to walkway (z 2, y 2.7)
    addStep(WALKWAY.x1, 9 - i, WALKWAY.x2, 10 - i, (i + 1) * STEP_H);
    // north stairs: from walkway (z -22) down to A site (z -30, y 0)
    addStep(WALKWAY.x1, -23 - i, WALKWAY.x2, -22 - i, (7 - i) * STEP_H);
  }

  // ---------- gameplay data ----------
  const zones = {
    A: { x1: -50, z1: -52, x2: -30, z2: -32 },
    B: { x1: 40, z1: -44, x2: 58, z2: -18 },
  };
  const plantPoints = { A: { x: -40, z: -42 }, B: { x: 48, z: -30 } };
  const spawns: MapData['spawns'] = {
    T: [
      { x: -48, z: 66, yaw: 0 },
      { x: -44, z: 64, yaw: 0 },
      { x: -40, z: 66, yaw: 0 },
      { x: -36, z: 64, yaw: 0 },
      { x: -32, z: 66, yaw: 0 },
    ],
    CT: [
      { x: 14, z: -36, yaw: Math.PI },
      { x: 18, z: -34, yaw: Math.PI },
      { x: 22, z: -36, yaw: Math.PI },
      { x: 26, z: -34, yaw: Math.PI },
      { x: 30, z: -36, yaw: Math.PI },
    ],
  };
  const waypoints: Record<string, [number, number][]> = {
    siteA: [
      [-45, -40],
      [-30, -48],
      [-15, -32],
      [-35, -30],
    ],
    siteB: [
      [45, -42],
      [58, -32],
      [48, -20],
      [56, -44],
    ],
    mid: [
      [-5, 30],
      [-5, 12],
      [2, -2],
    ],
    long: [
      [-50, 45],
      [-50, 8],
      [-50, -15],
    ],
    tunnels: [
      [10, 48],
      [40, 48],
      [49, 30],
      [49, -2],
    ],
    catwalk: [
      [-7, 6],
      [-7, -16],
    ],
    ctBase: [
      [20, -30],
      [28, -8],
    ],
  };

  const nav = buildNavGrid(floors, solids);

  return {
    group,
    solids,
    doors,
    floors,
    zones,
    plantPoints,
    spawns,
    waypoints,
    nav,
    bounds: { x1: -58, z1: -58, x2: 67, z2: 78 },
    rooms: ROOMS,
  };
}

function buildNavGrid(floors: FloorRect[], solids: AABB[]): NavGrid {
  const cell = 1.0;
  const ox = -57;
  const oz = -57;
  const w = 124; // x -57..67
  const h = 134; // z -57..77
  const walk = new Uint8Array(w * h);
  const hgt = new Float32Array(w * h);
  for (let cz = 0; cz < h; cz++) {
    for (let cx = 0; cx < w; cx++) {
      const wx = ox + (cx + 0.5) * cell;
      const wz = oz + (cz + 0.5) * cell;
      const g = groundAt(floors, wx, wz, 3.2);
      if (g < -50) continue;
      // body box clearance (doors excluded so paths route through doorways)
      const minX = wx - 0.32;
      const maxX = wx + 0.32;
      const minY = g + 0.08;
      const maxY = g + 1.72;
      const minZ = wz - 0.32;
      const maxZ = wz + 0.32;
      let blocked = false;
      for (const b of solids) {
        if (maxX <= b.minX || minX >= b.maxX) continue;
        if (maxY <= b.minY || minY >= b.maxY) continue;
        if (maxZ <= b.minZ || minZ >= b.maxZ) continue;
        blocked = true;
        break;
      }
      if (!blocked) {
        walk[cz * w + cx] = 1;
        hgt[cz * w + cx] = g;
      }
    }
  }
  return { ox, oz, cell, w, h, walk, hgt };
}

export function zoneAt(zones: { A: Rect; B: Rect }, x: number, z: number): 'A' | 'B' | null {
  if (x >= zones.A.x1 && x <= zones.A.x2 && z >= zones.A.z1 && z <= zones.A.z2) return 'A';
  if (x >= zones.B.x1 && x <= zones.B.x2 && z >= zones.B.z1 && z <= zones.B.z2) return 'B';
  return null;
}

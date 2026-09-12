import * as THREE from "three";
import type { AABB } from "../types";

export const CELL = 1;
export const ORIGIN_X = -56;
export const ORIGIN_Z = -56;
export const GRID_W = 112;
export const GRID_D = 112;

export type CellKind = 0 | 1 | 2 | 3; // solid, outdoor, tunnel, site

export interface NavNode {
  id: number;
  x: number;
  y: number;
  z: number;
  tag: string;
  neighbors: number[];
}

export interface Dust2World {
  walk: Uint8Array;
  floor: Float32Array;
  kind: Uint8Array;
  walls: AABB[];
  crates: AABB[];
  wallLines: { x1: number; z1: number; x2: number; z2: number }[];
  floorRects: { x: number; z: number; w: number; d: number; y: number; kind: CellKind }[];
  plantA: { x: number; y: number; z: number; r: number };
  plantB: { x: number; y: number; z: number; r: number };
  tSpawns: { x: number; y: number; z: number; yaw: number }[];
  ctSpawns: { x: number; y: number; z: number; yaw: number }[];
  nav: NavNode[];
  group: THREE.Group;
}

function idx(gx: number, gz: number): number {
  return gz * GRID_W + gx;
}

function worldToGrid(x: number, z: number): [number, number] {
  return [Math.floor(x - ORIGIN_X), Math.floor(z - ORIGIN_Z)];
}

export function inGrid(gx: number, gz: number): boolean {
  return gx >= 0 && gz >= 0 && gx < GRID_W && gz < GRID_D;
}

export class MapBuilder {
  walk = new Uint8Array(GRID_W * GRID_D);
  floor = new Float32Array(GRID_W * GRID_D);
  kind = new Uint8Array(GRID_W * GRID_D);

  carve(x1: number, z1: number, x2: number, z2: number, y: number, kind: CellKind): void {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);
    for (let z = minZ; z < maxZ; z += CELL) {
      for (let x = minX; x < maxX; x += CELL) {
        const [gx, gz] = worldToGrid(x + 0.01, z + 0.01);
        if (!inGrid(gx, gz)) continue;
        const i = idx(gx, gz);
        this.walk[i] = 1;
        this.floor[i] = y;
        this.kind[i] = kind;
      }
    }
  }

  raise(x1: number, z1: number, x2: number, z2: number, y: number, kind?: CellKind): void {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);
    for (let z = minZ; z < maxZ; z += CELL) {
      for (let x = minX; x < maxX; x += CELL) {
        const [gx, gz] = worldToGrid(x + 0.01, z + 0.01);
        if (!inGrid(gx, gz)) continue;
        const i = idx(gx, gz);
        this.walk[i] = 1;
        this.floor[i] = y;
        if (kind) this.kind[i] = kind;
      }
    }
  }

  stairs(x1: number, z1: number, x2: number, z2: number, y0: number, y1: number, axis: "x" | "z", kind: CellKind): void {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);
    const span = axis === "x" ? maxX - minX : maxZ - minZ;
    for (let z = minZ; z < maxZ; z += CELL) {
      for (let x = minX; x < maxX; x += CELL) {
        const t = axis === "x" ? (x - minX + 0.5) / span : (z - minZ + 0.5) / span;
        const y = y0 + (y1 - y0) * t;
        const [gx, gz] = worldToGrid(x + 0.01, z + 0.01);
        if (!inGrid(gx, gz)) continue;
        const i = idx(gx, gz);
        this.walk[i] = 1;
        this.floor[i] = y;
        this.kind[i] = kind;
      }
    }
  }
}

export function sampleFloor(world: Dust2World, x: number, z: number): number | null {
  const [gx, gz] = worldToGrid(x, z);
  if (!inGrid(gx, gz)) return null;
  const i = idx(gx, gz);
  if (!world.walk[i]) return null;
  return world.floor[i];
}

export function isWalkable(world: Dust2World, x: number, z: number): boolean {
  const [gx, gz] = worldToGrid(x, z);
  if (!inGrid(gx, gz)) return false;
  return world.walk[idx(gx, gz)] === 1;
}

export function canOccupy(world: Dust2World, x: number, z: number, radius: number, samples = 8): boolean {
  if (!isWalkable(world, x, z)) return false;
  for (let i = 0; i < samples; i++) {
    const a = (i / samples) * Math.PI * 2;
    if (!isWalkable(world, x + Math.cos(a) * radius, z + Math.sin(a) * radius)) return false;
  }
  return true;
}

export function floorAt(world: Dust2World, x: number, z: number, radius: number): number {
  let y = sampleFloor(world, x, z);
  if (y == null) y = 0;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const fy = sampleFloor(world, x + Math.cos(a) * radius, z + Math.sin(a) * radius);
    if (fy != null) y = Math.max(y, fy);
  }
  return y;
}

export function rayHitsWall(
  world: Dust2World,
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number
): boolean {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dz = z1 - z0;
  const dist = Math.hypot(dx, dy, dz);
  if (dist < 0.01) return false;
  const steps = Math.max(2, Math.ceil(dist / 0.35));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const x = x0 + dx * t;
    const y = y0 + dy * t;
    const z = z0 + dz * t;
    const [gx, gz] = worldToGrid(x, z);
    if (!inGrid(gx, gz)) return true;
    const id = idx(gx, gz);
    if (!world.walk[id]) return true;
    if (y < world.floor[id] - 0.15) return true;
    if (y > world.floor[id] + 6.2) return true;
  }
  return false;
}

function greedyFloors(b: MapBuilder): Dust2World["floorRects"] {
  const seen = new Uint8Array(GRID_W * GRID_D);
  const rects: Dust2World["floorRects"] = [];
  for (let gz = 0; gz < GRID_D; gz++) {
    for (let gx = 0; gx < GRID_W; gx++) {
      const i = idx(gx, gz);
      if (!b.walk[i] || seen[i]) continue;
      const y = b.floor[i];
      const k = b.kind[i] as CellKind;
      let w = 1;
      while (gx + w < GRID_W) {
        const j = idx(gx + w, gz);
        if (!b.walk[j] || seen[j] || b.floor[j] !== y || b.kind[j] !== k) break;
        w++;
      }
      let d = 1;
      outer: while (gz + d < GRID_D) {
        for (let ox = 0; ox < w; ox++) {
          const j = idx(gx + ox, gz + d);
          if (!b.walk[j] || seen[j] || b.floor[j] !== y || b.kind[j] !== k) break outer;
        }
        d++;
      }
      for (let oz = 0; oz < d; oz++) {
        for (let ox = 0; ox < w; ox++) seen[idx(gx + ox, gz + oz)] = 1;
      }
      rects.push({
        x: ORIGIN_X + gx,
        z: ORIGIN_Z + gz,
        w,
        d,
        y,
        kind: k,
      });
    }
  }
  return rects;
}

function greedyWalls(b: MapBuilder): { walls: AABB[]; lines: Dust2World["wallLines"] } {
  const walls: AABB[] = [];
  const lines: Dust2World["wallLines"] = [];
  const H = 5.6;
  const T = 0.55;

  const add = (x1: number, z1: number, x2: number, z2: number, y: number) => {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);
    walls.push({
      minX,
      minY: y,
      minZ,
      maxX,
      maxY: y + H,
      maxZ,
    });
    lines.push({ x1: minX, z1: minZ, x2: maxX, z2: maxZ });
  };

  // East-west faces (along X), neighbor in -Z / +Z
  for (const dir of [-1, 1] as const) {
    const seen = new Uint8Array(GRID_W * GRID_D);
    for (let gz = 0; gz < GRID_D; gz++) {
      for (let gx = 0; gx < GRID_W; gx++) {
        const i = idx(gx, gz);
        if (!b.walk[i] || seen[i]) continue;
        const nz = gz + dir;
        if (inGrid(gx, nz) && b.walk[idx(gx, nz)]) continue;
        const y = b.floor[i];
        let w = 1;
        while (gx + w < GRID_W) {
          const j = idx(gx + w, gz);
          if (!b.walk[j] || seen[j] || b.floor[j] !== y) break;
          const n2 = gz + dir;
          if (inGrid(gx + w, n2) && b.walk[idx(gx + w, n2)]) break;
          w++;
        }
        for (let ox = 0; ox < w; ox++) seen[idx(gx + ox, gz)] = 1;
        const x0 = ORIGIN_X + gx;
        const x1 = ORIGIN_X + gx + w;
        const zEdge = dir < 0 ? ORIGIN_Z + gz : ORIGIN_Z + gz + 1;
        add(x0, zEdge - T * 0.5, x1, zEdge + T * 0.5, y);
      }
    }
  }

  // North-south faces (along Z), neighbor in -X / +X
  for (const dir of [-1, 1] as const) {
    const seen = new Uint8Array(GRID_W * GRID_D);
    for (let gx = 0; gx < GRID_W; gx++) {
      for (let gz = 0; gz < GRID_D; gz++) {
        const i = idx(gx, gz);
        if (!b.walk[i] || seen[i]) continue;
        const nx = gx + dir;
        if (inGrid(nx, gz) && b.walk[idx(nx, gz)]) continue;
        const y = b.floor[i];
        let d = 1;
        while (gz + d < GRID_D) {
          const j = idx(gx, gz + d);
          if (!b.walk[j] || seen[j] || b.floor[j] !== y) break;
          const n2 = gx + dir;
          if (inGrid(n2, gz + d) && b.walk[idx(n2, gz + d)]) break;
          d++;
        }
        for (let oz = 0; oz < d; oz++) seen[idx(gx, gz + oz)] = 1;
        const z0 = ORIGIN_Z + gz;
        const z1 = ORIGIN_Z + gz + d;
        const xEdge = dir < 0 ? ORIGIN_X + gx : ORIGIN_X + gx + 1;
        add(xEdge - T * 0.5, z0, xEdge + T * 0.5, z1, y);
      }
    }
  }

  return { walls, lines };
}

function crate(x: number, z: number, w: number, d: number, h: number, y = 0): AABB {
  return {
    minX: x - w / 2,
    minY: y,
    minZ: z - d / 2,
    maxX: x + w / 2,
    maxY: y + h,
    maxZ: z + d / 2,
  };
}

function carveDust2(b: MapBuilder): void {
  const O: CellKind = 1;
  const U: CellKind = 2;
  const S: CellKind = 3;

  // T spawn
  b.carve(-14, -52, 14, -36, 0, O);
  // Outside / T mid
  b.carve(-7, -36, 7, 8, 0, O);
  // Xbox / mid lower
  b.carve(-8, -10, 8, 8, 0, O);
  // Mid doors passage
  b.carve(-3, 8, 3, 12, 0, O);
  // Top mid
  b.carve(-9, 12, 9, 36, 0, O);
  // CT spawn
  b.carve(-16, 36, 22, 52, 0, O);

  // T to B tunnels connector
  b.carve(-38, -52, -14, -38, 0, U);
  // B tunnels north-south
  b.carve(-48, -52, -34, 18, 0, U);
  // Upper tunnels mouth into B
  b.carve(-48, 14, -32, 20, 0, U);
  // B site
  b.carve(-52, 16, -24, 38, 0, S);
  // B to CT connector
  b.carve(-26, 28, -9, 38, 0, O);

  // T to A long
  b.carve(14, -52, 46, -36, 0, O);
  // A long corridor north
  b.carve(34, -36, 48, 22, 0, O);
  // A long into A (pit / ramp)
  b.carve(30, 16, 48, 24, 0, O);
  // A site
  b.carve(16, 20, 48, 42, 0, S);
  // A to CT
  b.carve(14, 36, 28, 44, 0, O);

  // Catwalk elevated from mid toward A short
  b.stairs(7, 11, 12, 18, 0, 3.3, "x", O);
  b.carve(12, 11, 28, 18, 3.3, O);
  // A short down to site
  b.stairs(22, 17, 30, 24, 3.3, 0, "z", S);

  // Extra mid width near doors
  b.carve(-5, 6, 5, 14, 0, O);
  // CT to mid extra
  b.carve(-6, 32, 10, 38, 0, O);
  // B window / door extra
  b.carve(-32, 24, -24, 32, 0, S);
  // A goose / CT A extra
  b.carve(18, 32, 36, 42, 0, S);
}

function makeNav(world: Dust2World): NavNode[] {
  const nodes: NavNode[] = [];
  const step = 4;
  for (let z = ORIGIN_Z + 2; z < ORIGIN_Z + GRID_D - 2; z += step) {
    for (let x = ORIGIN_X + 2; x < ORIGIN_X + GRID_W - 2; x += step) {
      if (!canOccupy(world, x + 0.5, z + 0.5, 0.35)) continue;
      const y = floorAt(world, x + 0.5, z + 0.5, 0.2);
      nodes.push({
        id: nodes.length,
        x: x + 0.5,
        y,
        z: z + 0.5,
        tag: "",
        neighbors: [],
      });
    }
  }

  const extras: { x: number; z: number; tag: string }[] = [
    { x: 0, z: -44, tag: "tspawn" },
    { x: 0, z: -22, tag: "tmid" },
    { x: 0, z: 0, tag: "xbox" },
    { x: 0, z: 10, tag: "doors" },
    { x: 0, z: 22, tag: "ctmid" },
    { x: 4, z: 44, tag: "ctspawn" },
    { x: -42, z: -44, tag: "tunnels_t" },
    { x: -41, z: -20, tag: "tunnels_mid" },
    { x: -41, z: 6, tag: "tunnels_upper" },
    { x: -38, z: 26, tag: "bsite" },
    { x: -18, z: 32, tag: "bhall" },
    { x: 28, z: -44, tag: "along_t" },
    { x: 40, z: -20, tag: "along_mid" },
    { x: 40, z: 8, tag: "along_ct" },
    { x: 36, z: 28, tag: "asite" },
    { x: 20, z: 14, tag: "cat" },
    { x: 26, z: 20, tag: "ashort" },
  ];
  for (const e of extras) {
    if (!canOccupy(world, e.x, e.z, 0.3)) continue;
    nodes.push({
      id: nodes.length,
      x: e.x,
      y: floorAt(world, e.x, e.z, 0.2),
      z: e.z,
      tag: e.tag,
      neighbors: [],
    });
  }

  const los = (a: NavNode, b: NavNode): boolean => {
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.5) return false;
    const steps = Math.ceil(dist / 0.5);
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const x = a.x + dx * t;
      const z = a.z + dz * t;
      if (!isWalkable(world, x, z)) return false;
      const fy = sampleFloor(world, x, z);
      const y = a.y + (b.y - a.y) * t;
      if (fy == null || Math.abs(fy - y) > 1.4) return false;
    }
    return true;
  };

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].z - nodes[j].z);
      if (d > 14) continue;
      if (!los(nodes[i], nodes[j])) continue;
      nodes[i].neighbors.push(j);
      nodes[j].neighbors.push(i);
    }
  }
  return nodes;
}

export function nearestNav(world: Dust2World, x: number, z: number): number {
  let best = 0;
  let bestD = Infinity;
  for (const n of world.nav) {
    const d = (n.x - x) ** 2 + (n.z - z) ** 2;
    if (d < bestD) {
      bestD = d;
      best = n.id;
    }
  }
  return best;
}

export function astar(world: Dust2World, from: number, to: number): number[] {
  if (from === to) return [from];
  const N = world.nav.length;
  const g = new Float32Array(N).fill(Infinity);
  const came = new Int32Array(N).fill(-1);
  const open: number[] = [from];
  const inOpen = new Uint8Array(N);
  inOpen[from] = 1;
  g[from] = 0;
  const h = (i: number) => {
    const a = world.nav[i];
    const b = world.nav[to];
    return Math.hypot(a.x - b.x, a.z - b.z);
  };
  while (open.length) {
    let bi = 0;
    let bv = Infinity;
    for (let i = 0; i < open.length; i++) {
      const f = g[open[i]] + h(open[i]);
      if (f < bv) {
        bv = f;
        bi = i;
      }
    }
    const cur = open.splice(bi, 1)[0];
    inOpen[cur] = 0;
    if (cur === to) {
      const path = [cur];
      let c = cur;
      while (came[c] !== -1) {
        c = came[c];
        path.push(c);
      }
      path.reverse();
      return path;
    }
    const node = world.nav[cur];
    for (const nb of node.neighbors) {
      const cost = Math.hypot(world.nav[nb].x - node.x, world.nav[nb].z - node.z);
      const ng = g[cur] + cost;
      if (ng < g[nb]) {
        g[nb] = ng;
        came[nb] = cur;
        if (!inOpen[nb]) {
          open.push(nb);
          inOpen[nb] = 1;
        }
      }
    }
  }
  return [from];
}

const MAT = {
  sand: new THREE.MeshStandardMaterial({ color: 0xc4a56a, roughness: 0.92, metalness: 0.02 }),
  sandDark: new THREE.MeshStandardMaterial({ color: 0x8c7348, roughness: 0.95 }),
  tunnel: new THREE.MeshStandardMaterial({ color: 0x5a4a32, roughness: 0.9 }),
  tunnelFloor: new THREE.MeshStandardMaterial({ color: 0x3a3224, roughness: 0.95 }),
  site: new THREE.MeshStandardMaterial({ color: 0xb08950, roughness: 0.9 }),
  floor: new THREE.MeshStandardMaterial({ color: 0x9a8458, roughness: 0.95 }),
  crate: new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.8 }),
  crateTop: new THREE.MeshStandardMaterial({ color: 0x7a5530, roughness: 0.75 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x4a5c48, roughness: 0.45, metalness: 0.55 }),
  metalDark: new THREE.MeshStandardMaterial({ color: 0x2a3328, roughness: 0.5, metalness: 0.4 }),
  trim: new THREE.MeshStandardMaterial({ color: 0x7a6240, roughness: 0.85 }),
  bombA: new THREE.MeshStandardMaterial({ color: 0x7a3030, roughness: 0.7 }),
  bombB: new THREE.MeshStandardMaterial({ color: 0x30507a, roughness: 0.7 }),
  skyWall: new THREE.MeshStandardMaterial({ color: 0xd8c490, roughness: 1, side: THREE.DoubleSide }),
};

function addBox(
  group: THREE.Group,
  aabb: AABB,
  mat: THREE.Material,
  receive = true,
  cast = false
): void {
  const w = aabb.maxX - aabb.minX;
  const h = aabb.maxY - aabb.minY;
  const d = aabb.maxZ - aabb.minZ;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set((aabb.minX + aabb.maxX) / 2, (aabb.minY + aabb.maxY) / 2, (aabb.minZ + aabb.maxZ) / 2);
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  group.add(mesh);
}

function addDoorway(group: THREE.Group, x: number, z: number): void {
  const frameH = 4.2;
  const frame = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.4, 0.6), MAT.metalDark);
  frame.position.set(x, frameH, z);
  group.add(frame);
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.4, frameH, 0.6), MAT.metalDark);
  left.position.set(x - 3.9, frameH / 2, z);
  group.add(left);
  const right = new THREE.Mesh(new THREE.BoxGeometry(0.4, frameH, 0.6), MAT.metalDark);
  right.position.set(x + 3.9, frameH / 2, z);
  group.add(right);
  // Open door leaves — walkable gap in the middle
  const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.6, 1.8), MAT.metal);
  doorL.position.set(x - 2.6, 1.85, z + 0.85);
  doorL.rotation.y = 0.95;
  doorL.castShadow = true;
  group.add(doorL);
  const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.6, 1.8), MAT.metal);
  doorR.position.set(x + 2.6, 1.85, z + 0.85);
  doorR.rotation.y = -0.95;
  doorR.castShadow = true;
  group.add(doorR);
}

function addLetter(group: THREE.Group, letter: "A" | "B", x: number, z: number, color: number): void {
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
  const bits: [number, number, number, number, number][] =
    letter === "A"
      ? [
          [-0.7, 1.4, 0.25, 2.8, 0.2],
          [0.7, 1.4, 0.25, 2.8, 0.2],
          [0, 1.5, 1.2, 0.25, 0.2],
        ]
      : [
          [-0.7, 1.4, 0.25, 2.8, 0.2],
          [0.15, 2.55, 1.2, 0.25, 0.2],
          [0.15, 1.4, 1.2, 0.25, 0.2],
          [0.15, 0.25, 1.2, 0.25, 0.2],
          [0.7, 2.0, 0.25, 1.0, 0.2],
          [0.7, 0.8, 0.25, 1.0, 0.2],
        ];
  for (const [ox, oy, w, h, d] of bits) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x + ox, oy, z);
    group.add(m);
  }
}

function addSiteMark(group: THREE.Group, x: number, z: number, letter: "A" | "B"): void {
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.2, 3.6, 24), letter === "A" ? MAT.bombA : MAT.bombB);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(x, 0.03, z);
  group.add(ring);
  const inner = new THREE.Mesh(new THREE.CircleGeometry(1.1, 16), letter === "A" ? MAT.bombA : MAT.bombB);
  inner.rotation.x = -Math.PI / 2;
  inner.position.set(x, 0.04, z);
  group.add(inner);
}

function addCrateMesh(group: THREE.Group, box: AABB): void {
  addBox(group, box, MAT.crate, true, true);
  const w = box.maxX - box.minX;
  const d = box.maxZ - box.minZ;
  const strap = new THREE.Mesh(new THREE.BoxGeometry(w * 0.08, box.maxY - box.minY + 0.02, d + 0.02), MAT.trim);
  strap.position.set((box.minX + box.maxX) / 2, (box.minY + box.maxY) / 2, (box.minZ + box.maxZ) / 2);
  group.add(strap);
}

export function buildDust2(): Dust2World {
  const b = new MapBuilder();
  carveDust2(b);
  const floorRects = greedyFloors(b);
  const { walls, lines } = greedyWalls(b);

  const crates: AABB[] = [
    crate(3.2, -2.5, 1.6, 1.6, 1.15), // xbox
    crate(-3.5, 18, 1.4, 1.4, 1.1),
    crate(32.5, 26.5, 1.8, 1.8, 1.2), // A default
    crate(40, 34, 1.5, 2.2, 1.3), // A goose
    crate(24, 30, 1.4, 1.4, 1.1),
    crate(-34, 24, 1.8, 1.8, 1.2), // B default
    crate(-44, 30, 2.4, 1.6, 1.4), // B car-ish
    crate(-30, 32, 1.3, 1.3, 1.1),
    crate(40, -40, 1.2, 1.2, 1),
    crate(-40, -8, 1.2, 1.6, 1.1),
  ];

  const group = new THREE.Group();

  for (const r of floorRects) {
    const geo = new THREE.BoxGeometry(r.w, 0.18, r.d);
    const mat = r.kind === 2 ? MAT.tunnelFloor : r.kind === 3 ? MAT.site : MAT.floor;
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(r.x + r.w / 2, r.y - 0.08, r.z + r.d / 2);
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  for (const w of walls) {
    const cy = (w.minZ + w.maxZ) / 2;
    const cx = (w.minX + w.maxX) / 2;
    const [gx, gz] = worldToGrid(cx, cy);
    let k: CellKind = 1;
    if (inGrid(gx, gz)) k = b.kind[idx(gx, gz)] as CellKind;
    const mat = k === 2 ? MAT.tunnel : k === 3 ? MAT.sandDark : MAT.sand;
    addBox(group, w, mat, true, false);
  }

  for (const c of crates) addCrateMesh(group, c);

  addDoorway(group, 0, 10);
  addSiteMark(group, 34, 28, "A");
  addSiteMark(group, -36, 26, "B");
  addLetter(group, "A", 34, 36.5, 0xb04a4a);
  addLetter(group, "B", -36, 35, 0x4a6ab0);

  // Catwalk railing
  const rail = new THREE.Mesh(new THREE.BoxGeometry(16, 0.12, 0.12), MAT.metalDark);
  rail.position.set(20, 4.2, 11.2);
  group.add(rail);
  const rail2 = new THREE.Mesh(new THREE.BoxGeometry(16, 0.12, 0.12), MAT.metalDark);
  rail2.position.set(20, 4.2, 17.7);
  group.add(rail2);

  // Sky dome tint
  const sky = new THREE.Mesh(new THREE.SphereGeometry(180, 16, 12), new THREE.MeshBasicMaterial({ color: 0x7ec4e8, side: THREE.BackSide }));
  group.add(sky);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(170, 32), new THREE.MeshStandardMaterial({ color: 0x6a5a38, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.6;
  ground.receiveShadow = true;
  group.add(ground);

  const world: Dust2World = {
    walk: b.walk,
    floor: b.floor,
    kind: b.kind,
    walls,
    crates,
    wallLines: lines,
    floorRects,
    plantA: { x: 34, y: 0, z: 28, r: 5.5 },
    plantB: { x: -36, y: 0, z: 26, r: 5.5 },
    tSpawns: [
      { x: -6, y: 0, z: -44, yaw: 0 },
      { x: -2, y: 0, z: -46, yaw: 0 },
      { x: 2, y: 0, z: -44, yaw: 0 },
      { x: 6, y: 0, z: -46, yaw: 0 },
      { x: 0, y: 0, z: -41, yaw: 0 },
    ],
    ctSpawns: [
      { x: -6, y: 0, z: 46, yaw: Math.PI },
      { x: 0, y: 0, z: 48, yaw: Math.PI },
      { x: 6, y: 0, z: 46, yaw: Math.PI },
      { x: 12, y: 0, z: 48, yaw: Math.PI },
      { x: 4, y: 0, z: 43, yaw: Math.PI },
    ],
    nav: [],
    group,
  };
  world.nav = makeNav(world);
  return world;
}

export function inPlantZone(
  world: Dust2World,
  x: number,
  z: number
): "A" | "B" | null {
  const da = Math.hypot(x - world.plantA.x, z - world.plantA.z);
  if (da <= world.plantA.r) return "A";
  const db = Math.hypot(x - world.plantB.x, z - world.plantB.z);
  if (db <= world.plantB.r) return "B";
  return null;
}

export function crateBlocks(crates: AABB[], x: number, z: number, radius: number, y: number): AABB | null {
  for (const c of crates) {
    if (y >= c.maxY - 0.05) continue;
    const nx = Math.max(c.minX, Math.min(x, c.maxX));
    const nz = Math.max(c.minZ, Math.min(z, c.maxZ));
    const dx = x - nx;
    const dz = z - nz;
    if (dx * dx + dz * dz < radius * radius) return c;
  }
  return null;
}

export function rayHitCrates(
  crates: AABB[],
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number
): number | null {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dz = z1 - z0;
  let nearest: number | null = null;
  for (const b of crates) {
    const t = rayAABB(x0, y0, z0, dx, dy, dz, b);
    if (t != null && t >= 0 && t <= 1 && (nearest == null || t < nearest)) nearest = t;
  }
  return nearest;
}

export function rayAABB(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  b: AABB
): number | null {
  const invX = 1 / (dx || 1e-12);
  const invY = 1 / (dy || 1e-12);
  const invZ = 1 / (dz || 1e-12);
  let tmin = 0;
  let tmax = 1;
  let t1 = (b.minX - ox) * invX;
  let t2 = (b.maxX - ox) * invX;
  if (t1 > t2) [t1, t2] = [t2, t1];
  tmin = Math.max(tmin, t1);
  tmax = Math.min(tmax, t2);
  t1 = (b.minY - oy) * invY;
  t2 = (b.maxY - oy) * invY;
  if (t1 > t2) [t1, t2] = [t2, t1];
  tmin = Math.max(tmin, t1);
  tmax = Math.min(tmax, t2);
  t1 = (b.minZ - oz) * invZ;
  t2 = (b.maxZ - oz) * invZ;
  if (t1 > t2) [t1, t2] = [t2, t1];
  tmin = Math.max(tmin, t1);
  tmax = Math.min(tmax, t2);
  if (tmax >= tmin) return tmin;
  return null;
}
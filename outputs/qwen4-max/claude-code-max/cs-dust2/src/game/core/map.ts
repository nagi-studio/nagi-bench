import type { Collider, Material, Ramp, Rect, Vec3 } from './types.ts';
import { CFG } from './config.ts';
import { clamp, pointInRect, rayAABB, v3 } from './vecmath.ts';

export interface AreaDef {
  name: string;
  rect: Rect;
}

export interface MapData {
  floors: Rect[];
  ramps: Ramp[];
  colliders: Collider[];
  areas: AreaDef[];
  spawns: { CT: Vec3[]; T: Vec3[] };
  spawnYaw: { CT: number; T: number };
  sites: { A: Rect; B: Rect };
  bounds: { x1: number; z1: number; x2: number; z2: number };
  hash: SpatialHash;
  nav: NavGraph;
  doors: { name: string; gap: Vec3 }[];
}

export interface NavGraph {
  points: Vec3[];
  edges: number[][];
}

const CELL = 4;

export class SpatialHash {
  cells: Map<string, number[]> = new Map();
  items: { min: Vec3; max: Vec3 }[] = [];

  key(cx: number, cz: number): string {
    return cx + ',' + cz;
  }

  insert(idx: number, min: Vec3, max: Vec3): void {
    this.items[idx] = { min, max };
    const x1 = Math.floor(min.x / CELL);
    const x2 = Math.floor(max.x / CELL);
    const z1 = Math.floor(min.z / CELL);
    const z2 = Math.floor(max.z / CELL);
    for (let cx = x1; cx <= x2; cx++) {
      for (let cz = z1; cz <= z2; cz++) {
        const k = this.key(cx, cz);
        let arr = this.cells.get(k);
        if (!arr) {
          arr = [];
          this.cells.set(k, arr);
        }
        arr.push(idx);
      }
    }
  }

  query(min: Vec3, max: Vec3, out: Set<number>): void {
    const x1 = Math.floor(min.x / CELL);
    const x2 = Math.floor(max.x / CELL);
    const z1 = Math.floor(min.z / CELL);
    const z2 = Math.floor(max.z / CELL);
    for (let cx = x1; cx <= x2; cx++) {
      for (let cz = z1; cz <= z2; cz++) {
        const arr = this.cells.get(this.key(cx, cz));
        if (arr) for (const i of arr) out.add(i);
      }
    }
  }
}

// ---- Floor height / walkability -------------------------------------------

export function floorHeightAt(map: MapData, x: number, z: number): number {
  let h = -Infinity;
  for (const r of map.ramps) {
    if (pointInRect(x, z, r)) {
      const t = r.axis === 'x' ? (x - r.x1) / (r.x2 - r.x1) : (z - r.z1) / (r.z2 - r.z1);
      const hh = r.h0 + (r.h1 - r.h0) * clamp(t, 0, 1);
      if (hh > h) h = hh;
    }
  }
  for (const r of map.floors) {
    if (pointInRect(x, z, r)) {
      const hh = r.h ?? 0;
      if (hh > h) h = hh;
    }
  }
  return h;
}

const _q = new Set<number>();

// Is there solid geometry blocking a standing body at (x,z) with feet at y?
export function bodyBlocked(map: MapData, x: number, z: number, y: number, half: number, height: number): boolean {
  const min = v3(x - half, y + 0.05, z - half);
  const max = v3(x + half, y + height, z + half);
  _q.clear();
  map.hash.query(min, max, _q);
  for (const i of _q) {
    const c = map.colliders[i];
    if (
      max.x > c.min.x && min.x < c.max.x &&
      max.y > c.min.y && min.y < c.max.y &&
      max.z > c.min.z && min.z < c.max.z
    ) {
      // Low obstacles can be stepped over; treat as blocked only if above step height.
      if (c.max.y - y > CFG.stepHeight) return true;
    }
  }
  return false;
}

export function isWalkablePoint(map: MapData, x: number, z: number): boolean {
  const h = floorHeightAt(map, x, z);
  if (h === -Infinity) return false;
  return !bodyBlocked(map, x, z, h, CFG.playerHalf, CFG.playerHeight);
}

export function segmentWalkable(map: MapData, ax: number, az: number, bx: number, bz: number): boolean {
  const d = Math.hypot(bx - ax, bz - az);
  const steps = Math.max(1, Math.ceil(d / 0.35));
  let prevH = floorHeightAt(map, ax, az);
  if (prevH === -Infinity) return false;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = ax + (bx - ax) * t;
    const z = az + (bz - az) * t;
    const h = floorHeightAt(map, x, z);
    if (h === -Infinity) return false;
    if (Math.abs(h - prevH) > CFG.stepHeight) return false;
    if (bodyBlocked(map, x, z, h, CFG.playerHalf, CFG.playerHeight)) return false;
    prevH = h;
  }
  return true;
}

export function areaAt(map: MapData, x: number, z: number): string {
  for (const a of map.areas) {
    if (pointInRect(x, z, a.rect)) return a.name;
  }
  return '—';
}

// ---- World raycast (with wood penetration) --------------------------------

export interface WorldHit {
  solid: { t: number; normal: Vec3; collider: Collider } | null;
  pens: { t: number; collider: Collider }[];
}

export function raycastWorld(map: MapData, o: Vec3, d: Vec3, maxT: number): WorldHit {
  // March grid cells along the ray, gather candidate colliders.
  const cand = new Set<number>();
  let cx = Math.floor(o.x / CELL);
  let cz = Math.floor(o.z / CELL);
  const stepX = d.x > 0 ? 1 : -1;
  const stepZ = d.z > 0 ? 1 : -1;
  const tDeltaX = Math.abs(d.x) < 1e-9 ? Infinity : Math.abs(CELL / d.x);
  const tDeltaZ = Math.abs(d.z) < 1e-9 ? Infinity : Math.abs(CELL / d.z);
  const nextBoundaryX = (cx + (stepX > 0 ? 1 : 0)) * CELL;
  const nextBoundaryZ = (cz + (stepZ > 0 ? 1 : 0)) * CELL;
  let tMaxX = Math.abs(d.x) < 1e-9 ? Infinity : (nextBoundaryX - o.x) / d.x;
  let tMaxZ = Math.abs(d.z) < 1e-9 ? Infinity : (nextBoundaryZ - o.z) / d.z;
  let t = 0;
  const endT = maxT;
  let guard = 0;
  while (t <= endT && guard++ < 4096) {
    const arr = map.hash.cells.get(map.hash.key(cx, cz));
    if (arr) for (const i of arr) cand.add(i);
    if (tMaxX < tMaxZ) {
      t = tMaxX;
      cx += stepX;
      tMaxX += tDeltaX;
    } else {
      t = tMaxZ;
      cz += stepZ;
      tMaxZ += tDeltaZ;
    }
    // also peek the cell ahead so colliders straddling boundaries are caught
    if (t > endT) break;
  }
  // Always include the origin cell neighborhood.
  map.hash.query(v3(o.x - CELL, o.y - CELL, o.z - CELL), v3(o.x + CELL, o.y + CELL, o.z + CELL), cand);

  let solid: WorldHit['solid'] = null;
  const pens: WorldHit['pens'] = [];
  for (const i of cand) {
    const c = map.colliders[i];
    const hit = rayAABB(o, d, c.min, c.max, maxT);
    if (!hit) continue;
    if (c.penetrable) {
      pens.push({ t: hit.t, collider: c });
    } else if (!solid || hit.t < solid.t) {
      solid = { t: hit.t, normal: hit.normal, collider: c };
    }
  }
  pens.sort((a, b) => a.t - b.t);
  // Only count penetrations before the solid wall.
  const limit = solid ? solid.t : maxT;
  const filtered = pens.filter((p) => p.t < limit);
  return { solid, pens: filtered };
}

// ---- Map construction ------------------------------------------------------

function box(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, material: Material, penetrable = false, tag?: string): Collider {
  return {
    min: v3(Math.min(x1, x2), Math.min(y1, y2), Math.min(z1, z2)),
    max: v3(Math.max(x1, x2), Math.max(y1, y2), Math.max(z1, z2)),
    material, penetrable, tag,
  };
}

const WALL_H = 4.2;
const WALL_T = 0.5;

// Auto-generate perimeter walls around the union of walkable floors.
function generateWalls(floors: Rect[], colliders: Collider[]): void {
  const sample = 0.5;
  const isOpen = (x: number, z: number, h: number): boolean => {
    const hh = floorHeightAtRaw(floors, x, z);
    return hh !== -Infinity && Math.abs(hh - h) <= CFG.stepHeight;
  };
  for (const r of floors) {
    const h = r.h ?? 0;
    const edges: { ax: number; az: number; bx: number; bz: number; nx: number; nz: number }[] = [
      { ax: r.x1, az: r.z1, bx: r.x2, bz: r.z1, nx: 0, nz: -1 }, // north edge
      { ax: r.x1, az: r.z2, bx: r.x2, bz: r.z2, nx: 0, nz: 1 }, // south
      { ax: r.x1, az: r.z1, bx: r.x1, bz: r.z2, nx: -1, nz: 0 }, // west
      { ax: r.x2, az: r.z1, bx: r.x2, bz: r.z2, nx: 1, nz: 0 }, // east
    ];
    for (const e of edges) {
      const alongX = e.ax !== e.bx;
      const length = alongX ? e.bx - e.ax : e.bz - e.az;
      const n = Math.max(1, Math.round(length / sample));
      let runStart = -1;
      const flush = (endIdx: number) => {
        if (runStart < 0) return;
        const t0 = (runStart / n) * length;
        const t1 = (endIdx / n) * length;
        const pad = WALL_T * 0.5;
        let x1: number, x2: number, z1: number, z2: number;
        if (alongX) {
          x1 = e.ax + t0 - pad;
          x2 = e.ax + t1 + pad;
          z1 = e.az + (e.nz > 0 ? 0 : -WALL_T);
          z2 = e.az + (e.nz > 0 ? WALL_T : 0);
        } else {
          z1 = e.az + t0 - pad;
          z2 = e.az + t1 + pad;
          x1 = e.ax + (e.nx > 0 ? 0 : -WALL_T);
          x2 = e.ax + (e.nx > 0 ? WALL_T : 0);
        }
        colliders.push(box(x1, h, z1, x2, h + WALL_H, z2, 'stone', false, 'wall'));
        runStart = -1;
      };
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        const px = alongX ? e.ax + t * length : e.ax + e.nx * 0.45;
        const pz = alongX ? e.az + e.nz * 0.45 : e.az + t * length;
        if (isOpen(px, pz, h)) {
          flush(i);
        } else if (runStart < 0) {
          runStart = i;
        }
      }
      flush(n);
    }
  }
}

function floorHeightAtRaw(floors: Rect[], x: number, z: number): number {
  let h = -Infinity;
  for (const r of floors) if (pointInRect(x, z, r)) h = Math.max(h, r.h ?? 0);
  return h;
}

export function buildMap(): MapData {
  const floors: Rect[] = [
    { x1: -8, z1: 42, x2: 22, z2: 62 }, // T spawn
    { x1: -2, z1: 26, x2: 10, z2: 42 }, // T mid / suicide
    { x1: -4, z1: 2, x2: 10, z2: 26 }, // Mid (T side)
    { x1: -4, z1: -2, x2: 10, z2: 2 }, // Mid doors throat
    { x1: -4, z1: -16, x2: 12, z2: -2 }, // CT mid
    { x1: -2, z1: -36, x2: 12, z2: -16 }, // CT corridor
    { x1: -6, z1: -56, x2: 20, z2: -36 }, // CT spawn
    { x1: -30, z1: 0, x2: -4, z2: 8 }, // lower connector
    { x1: -44, z1: -28, x2: -30, z2: 8 }, // lower tunnels
    { x1: -44, z1: 8, x2: -30, z2: 44 }, // upper tunnels
    { x1: -30, z1: 34, x2: -8, z2: 44 }, // upper connector
    { x1: -52, z1: -56, x2: -20, z2: -28 }, // B site
    { x1: -20, z1: -48, x2: -6, z2: -38 }, // B doors corridor
    { x1: 22, z1: 26, x2: 54, z2: 46 }, // outside long
    { x1: 40, z1: 22, x2: 54, z2: 26 }, // long doors throat
    { x1: 40, z1: -24, x2: 54, z2: 22 }, // Long A
    { x1: 26, z1: -52, x2: 56, z2: -24 }, // A site
    { x1: 20, z1: -46, x2: 26, z2: -36 }, // CT -> A ramp
    { x1: 10, z1: -12, x2: 16, z2: 2 }, // xbox
    { x1: 16, z1: -12, x2: 22, z2: -2 }, // short stairs
    { x1: 22, z1: -26, x2: 30, z2: -2 }, // catwalk
  ];

  const areas: AreaDef[] = [
    { name: 'T Spawn', rect: { x1: -8, z1: 42, x2: 22, z2: 62 } },
    { name: 'T Mid', rect: { x1: -2, z1: 26, x2: 10, z2: 42 } },
    { name: 'Mid Doors', rect: { x1: -4, z1: -2, x2: 10, z2: 2 } },
    { name: 'Mid', rect: { x1: -4, z1: 2, x2: 10, z2: 26 } },
    { name: 'CT Mid', rect: { x1: -4, z1: -16, x2: 12, z2: -2 } },
    { name: 'CT Spawn', rect: { x1: -6, z1: -56, x2: 20, z2: -36 } },
    { name: 'Lower Tunnels', rect: { x1: -44, z1: -28, x2: -30, z2: 8 } },
    { name: 'Upper Tunnels', rect: { x1: -44, z1: 8, x2: -30, z2: 44 } },
    { name: 'B Site', rect: { x1: -52, z1: -56, x2: -20, z2: -28 } },
    { name: 'B Doors', rect: { x1: -20, z1: -48, x2: -6, z2: -38 } },
    { name: 'Outside Long', rect: { x1: 22, z1: 26, x2: 54, z2: 46 } },
    { name: 'Long Doors', rect: { x1: 40, z1: 22, x2: 54, z2: 26 } },
    { name: 'Long A', rect: { x1: 40, z1: -24, x2: 54, z2: 22 } },
    { name: 'A Site', rect: { x1: 26, z1: -52, x2: 56, z2: -24 } },
    { name: 'Catwalk', rect: { x1: 16, z1: -26, x2: 30, z2: -2 } },
    { name: 'Short', rect: { x1: 10, z1: -12, x2: 16, z2: 2 } },
  ];

  const colliders: Collider[] = [];
  generateWalls(floors, colliders);

  // Doors: solid wood panels with a walkable central gap; bullets penetrate.
  // Mid doors (throat x[-4,10] at z~0), gap x[2.2,3.8]
  colliders.push(box(-4, 0, -1.7, 2.2, 3.2, 1.7, 'wood', true, 'midDoor'));
  colliders.push(box(3.8, 0, -1.7, 10, 3.2, 1.7, 'wood', true, 'midDoor'));
  // Long doors (throat x[40,54] at z~24), gap x[46,48]
  colliders.push(box(40, 0, 22.3, 46, 3.2, 25.7, 'wood', true, 'longDoor'));
  colliders.push(box(48, 0, 22.3, 54, 3.2, 25.7, 'wood', true, 'longDoor'));
  // B doors (corridor z[-48,-38] at x~-19), gap z[-44,-42.4]
  colliders.push(box(-19.7, 0, -48, -18.3, 3.2, -44, 'wood', true, 'bDoor'));
  colliders.push(box(-19.7, 0, -42.4, -18.3, 3.2, -38, 'wood', true, 'bDoor'));

  // Cover props (crates / boxes). Solid, non-penetrable unless wood.
  const crate = (x: number, z: number, w: number, d: number, h: number, mat: Material = 'crate') =>
    colliders.push(box(x - w / 2, 0, z - d / 2, x + w / 2, h, z + d / 2, mat, mat === 'wood', 'crate'));
  // A site
  crate(38, -40, 2.2, 2.2, 1.6);
  crate(46, -46, 2.0, 2.0, 1.2, 'wood');
  crate(31, -31, 1.6, 1.6, 1.0);
  crate(50, -31, 2.0, 1.6, 1.4);
  crate(41, -49, 1.8, 1.8, 0.5);
  // B site
  crate(-40, -44, 2.4, 2.4, 1.6);
  crate(-30, -37, 2.0, 2.0, 1.2, 'wood');
  crate(-46, -34, 1.6, 1.6, 1.0);
  crate(-27, -50, 2.0, 2.0, 1.4);
  crate(-37, -51, 1.8, 1.8, 0.5);
  // Long
  crate(44, -16, 2.0, 2.0, 1.2);
  crate(50, 2, 1.6, 1.6, 1.0, 'wood');
  crate(43, 16, 1.5, 1.5, 1.0);
  // Mid / short
  crate(12.5, -6, 1.6, 1.6, 1.2); // xbox
  crate(2, 14, 1.5, 1.5, 1.0);
  // Tunnels
  crate(-38, 18, 2.0, 2.0, 1.2);
  crate(-36, -12, 1.6, 1.6, 1.0, 'wood');
  // Spawns
  crate(6, -46, 2.0, 2.0, 1.2);
  crate(15, -50, 1.6, 1.6, 1.0);
  crate(10, 52, 2.0, 2.0, 1.2);
  crate(0, 57, 1.6, 1.6, 1.0);

  const hash = new SpatialHash();
  colliders.forEach((c, i) => hash.insert(i, c.min, c.max));

  const spawns = {
    T: [v3(0, 0, 52), v3(7, 0, 57), v3(13, 0, 51), v3(4, 0, 47), v3(17, 0, 58)],
    CT: [v3(0, 0, -46), v3(7, 0, -51), v3(13, 0, -45), v3(2, 0, -41), v3(16, 0, -52)],
  };

  const sites = {
    A: { x1: 30, z1: -50, x2: 52, z2: -28 },
    B: { x1: -48, z1: -52, x2: -24, z2: -32 },
  };

  const doors = [
    { name: 'Mid Doors', gap: v3(3, 0, 0) },
    { name: 'Long Doors', gap: v3(47, 0, 24) },
    { name: 'B Doors', gap: v3(-19, 0, -43) },
  ];

  const map: MapData = {
    floors, ramps: [], colliders, areas, spawns,
    spawnYaw: { CT: Math.PI, T: 0 },
    sites,
    bounds: { x1: -56, z1: -60, x2: 60, z2: 66 },
    hash, nav: { points: [], edges: [] }, doors,
  };

  map.nav = buildNav(map);
  return map;
}

// ---- Navigation graph ------------------------------------------------------

function buildNav(map: MapData): NavGraph {
  const points: Vec3[] = [];
  const seen = new Set<string>();
  const addPoint = (x: number, z: number) => {
    const h = floorHeightAt(map, x, z);
    if (h === -Infinity) return;
    if (!isWalkablePoint(map, x, z)) return;
    const k = Math.round(x * 2) + ':' + Math.round(z * 2);
    if (seen.has(k)) return;
    seen.add(k);
    points.push(v3(x, h, z));
  };

  // Coarse grid over every floor rect.
  const spacing = 4;
  for (const r of map.floors) {
    for (let x = r.x1 + 1.5; x <= r.x2 - 1.5; x += spacing) {
      for (let z = r.z1 + 1.5; z <= r.z2 - 1.5; z += spacing) {
        addPoint(x, z);
      }
    }
  }
  // Door gaps + key junctions to guarantee chokepoint threading.
  const extra: [number, number][] = [
    [3, 0], [3, 3], [3, -3], // mid doors
    [47, 24], [47, 21], [47, 27], // long doors
    [-19, -43], [-23, -43], [-15, -43], [-19, -40], [-19, -46], // b doors
    [23, -41], [13, -6], [19, -7], [25, -12], [27, -22], // short / catwalk / ramp
    [-16, 4], [-26, 4], [-37, 4], [-37, -20], [-37, 30],
    [38, -38], [46, -44], [-40, -40], [-30, -48],
  ];
  for (const [x, z] of extra) addPoint(x, z);

  const n = points.length;
  const edges: number[][] = Array.from({ length: n }, () => []);
  const radius = 6.4;
  // Bucket points for neighbor search.
  const buckets = new Map<string, number[]>();
  const bkey = (x: number, z: number) => Math.floor(x / radius) + ':' + Math.floor(z / radius);
  points.forEach((p, i) => {
    const k = bkey(p.x, p.z);
    let a = buckets.get(k);
    if (!a) { a = []; buckets.set(k, a); }
    a.push(i);
  });
  const link = (i: number, j: number) => {
    if (i === j) return;
    if (edges[i].includes(j)) return;
    const a = points[i], b = points[j];
    if (Math.hypot(a.x - b.x, a.z - b.z) > radius) return;
    if (!segmentWalkable(map, a.x, a.z, b.x, b.z)) return;
    edges[i].push(j);
    edges[j].push(i);
  };
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const bx = Math.floor(p.x / radius);
    const bz = Math.floor(p.z / radius);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const arr = buckets.get((bx + dx) + ':' + (bz + dz));
        if (arr) for (const j of arr) if (j > i) link(i, j);
      }
    }
  }

  // Repair connectivity: join components with the closest walkable pair.
  const comp = new Array<number>(n).fill(-1);
  let nc = 0;
  for (let s = 0; s < n; s++) {
    if (comp[s] >= 0) continue;
    const stack = [s];
    comp[s] = nc;
    while (stack.length) {
      const u = stack.pop()!;
      for (const v of edges[u]) if (comp[v] < 0) { comp[v] = nc; stack.push(v); }
    }
    nc++;
  }
  if (nc > 1) {
    for (let c = 1; c < nc; c++) {
      let best: [number, number] | null = null;
      let bestD = Infinity;
      for (let i = 0; i < n; i++) {
        if (comp[i] !== c) continue;
        for (let j = 0; j < n; j++) {
          if (comp[j] >= c) continue;
          const d = Math.hypot(points[i].x - points[j].x, points[i].z - points[j].z);
          if (d < bestD && d < 40 && segmentWalkable(map, points[i].x, points[i].z, points[j].x, points[j].z)) {
            bestD = d;
            best = [i, j];
          }
        }
      }
      if (best) {
        edges[best[0]].push(best[1]);
        edges[best[1]].push(best[0]);
        // merge component labels
        const from = c;
        for (let i = 0; i < n; i++) if (comp[i] === from) comp[i] = comp[best[1]];
      }
    }
  }

  return { points, edges };
}

export function nearestNavPoint(map: MapData, x: number, z: number): number {
  let best = -1;
  let bestD = Infinity;
  const pts = map.nav.points;
  for (let i = 0; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - x, pts[i].z - z);
    if (d < bestD) {
      // prefer actually reachable points
      if (d < 12 && segmentWalkable(map, x, z, pts[i].x, pts[i].z)) {
        bestD = d;
        best = i;
      } else if (best < 0 && d < bestD) {
        bestD = d;
        best = i;
      }
    }
  }
  return best;
}

export function findPath(map: MapData, start: Vec3, goal: Vec3): Vec3[] {
  const nav = map.nav;
  const s = nearestNavPoint(map, start.x, start.z);
  const g = nearestNavPoint(map, goal.x, goal.z);
  if (s < 0 || g < 0) return [goal];
  if (s === g) return [goal];
  const n = nav.points.length;
  const gScore = new Float64Array(n).fill(Infinity);
  const fScore = new Float64Array(n).fill(Infinity);
  const came = new Int32Array(n).fill(-1);
  const closed = new Uint8Array(n);
  const h = (i: number) => Math.hypot(nav.points[i].x - nav.points[g].x, nav.points[i].z - nav.points[g].z);
  gScore[s] = 0;
  fScore[s] = h(s);
  // simple binary heap
  const heap: number[] = [s];
  const heapF: number[] = [fScore[s]];
  const push = (node: number, f: number) => {
    heap.push(node);
    heapF.push(f);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heapF[p] <= heapF[i]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      [heapF[p], heapF[i]] = [heapF[i], heapF[p]];
      i = p;
    }
  };
  const pop = (): number => {
    const top = heap[0];
    const lastN = heap.pop()!;
    const lastF = heapF.pop()!;
    if (heap.length) {
      heap[0] = lastN;
      heapF[0] = lastF;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1, r = l + 1;
        let m = i;
        if (l < heap.length && heapF[l] < heapF[m]) m = l;
        if (r < heap.length && heapF[r] < heapF[m]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        [heapF[m], heapF[i]] = [heapF[i], heapF[m]];
        i = m;
      }
    }
    return top;
  };
  while (heap.length) {
    const u = pop();
    if (u === g) break;
    if (closed[u]) continue;
    closed[u] = 1;
    for (const v of nav.edges[u]) {
      if (closed[v]) continue;
      const d = Math.hypot(nav.points[u].x - nav.points[v].x, nav.points[u].z - nav.points[v].z);
      const tentative = gScore[u] + d;
      if (tentative < gScore[v]) {
        came[v] = u;
        gScore[v] = tentative;
        fScore[v] = tentative + h(v);
        push(v, fScore[v]);
      }
    }
  }
  if (came[g] < 0 && g !== s) return [goal];
  const idxPath: number[] = [];
  let cur = g;
  while (cur >= 0) {
    idxPath.push(cur);
    if (cur === s) break;
    cur = came[cur];
  }
  idxPath.reverse();
  const path = idxPath.map((i) => nav.points[i]);
  // Only approach the raw goal if it is actually standable and reachable.
  if (isWalkablePoint(map, goal.x, goal.z) && segmentWalkable(map, path[path.length - 1].x, path[path.length - 1].z, goal.x, goal.z)) {
    path.push(goal);
  }
  // String-pull smoothing: drop waypoints we can skip with a clear line.
  const smooth: Vec3[] = [];
  let anchor = start;
  let i = 0;
  while (i < path.length) {
    let j = path.length - 1;
    for (; j > i; j--) {
      if (segmentWalkable(map, anchor.x, anchor.z, path[j].x, path[j].z)) break;
    }
    smooth.push(path[j]);
    anchor = path[j];
    i = j + 1;
  }
  return smooth;
}

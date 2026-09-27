import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Box2, Region, Vec2 } from './types';

export const MAP_MIN_X = -58;
export const MAP_MAX_X = 46;
export const MAP_MIN_Z = -54;
export const MAP_MAX_Z = 42;
export const CELL = 2;
export const GRID_W = (MAP_MAX_X - MAP_MIN_X) / CELL;
export const GRID_H = (MAP_MAX_Z - MAP_MIN_Z) / CELL;

export interface Rect { x1: number; z1: number; x2: number; z2: number; label: Region }

// Intersecting passages reproduce the important Dust II routes. Every rectangle shares
// an open edge with another; the same geometry drives rendering, collision and A*.
export const ROOMS: Rect[] = [
  { x1: -49, z1: 23, x2: -30, z2: 38, label: 'T 出生点' },
  { x1: -53, z1: 22, x2: -32, z2: 30, label: 'A 大' },
  { x1: -53, z1: -48, x2: -44, z2: 29, label: 'A 大' },
  { x1: -51, z1: -49, x2: 36, z2: -39, label: 'A 大' },
  { x1: 29, z1: -47, x2: 41, z2: -24, label: 'A 大' },
  { x1: -40, z1: -34, x2: -29, z2: 28, label: 'B 洞' },
  { x1: -40, z1: -39, x2: -14, z2: -29, label: 'B 洞' },
  { x1: -23, z1: -44, x2: -3, z2: -24, label: 'B 点' },
  { x1: -7, z1: -34, x2: 27, z2: -25, label: '连接通道' },
  { x1: -34, z1: 18, x2: -3, z2: 28, label: '中路' },
  { x1: -11, z1: 4, x2: 20, z2: 21, label: '中路' },
  { x1: -8, z1: 18, x2: 0, z2: 27, label: '中路' },
  { x1: 16, z1: 6, x2: 28, z2: 16, label: '中门' },
  { x1: 24, z1: 13, x2: 40, z2: 32, label: 'CT 出生点' },
  { x1: 24, z1: -30, x2: 34, z2: 22, label: '连接通道' },
  { x1: 1, z1: -20, x2: 9, z2: 10, label: '猫道' },
  { x1: 4, z1: -23, x2: 32, z2: -14, label: '猫道' },
  { x1: 24, z1: -39, x2: 43, z2: -16, label: 'A 点' },
];

export const A_SITE: Vec2 = { x: 34, z: -29 };
export const B_SITE: Vec2 = { x: -13, z: -35 };
export const T_SPAWNS: Vec2[] = [
  { x: -41, z: 32 }, { x: -45, z: 34 }, { x: -37, z: 34 }, { x: -44, z: 27 }, { x: -36, z: 27 },
];
export const CT_SPAWNS: Vec2[] = [
  { x: 31, z: 25 }, { x: 27, z: 26 }, { x: 35, z: 25 }, { x: 29, z: 19 }, { x: 36, z: 19 },
];

const included = (x: number, z: number) => ROOMS.some(r => x >= r.x1 && x <= r.x2 && z >= r.z1 && z <= r.z2);
const grid = new Uint8Array(GRID_W * GRID_H);
for (let j = 0; j < GRID_H; j++) for (let i = 0; i < GRID_W; i++) {
  grid[j * GRID_W + i] = included(MAP_MIN_X + (i + .5) * CELL, MAP_MIN_Z + (j + .5) * CELL) ? 1 : 0;
}
export const gridAt = (i: number, j: number) => i >= 0 && j >= 0 && i < GRID_W && j < GRID_H && grid[j * GRID_W + i] === 1;
export const worldToCell = (p: Vec2) => ({ i: Math.floor((p.x - MAP_MIN_X) / CELL), j: Math.floor((p.z - MAP_MIN_Z) / CELL) });
export const cellToWorld = (i: number, j: number): Vec2 => ({ x: MAP_MIN_X + (i + .5) * CELL, z: MAP_MIN_Z + (j + .5) * CELL });
export const walkable = (x: number, z: number) => gridAt(worldToCell({ x, z }).i, worldToCell({ x, z }).j);

export function regionAt(x: number, z: number): Region {
  if (x > 23 && z < -15) return 'A 点';
  if (x < -4 && z < -24 && x > -25) return 'B 点';
  if (x > 15 && x < 25 && z > 5 && z < 17) return '中门';
  if (x > 0 && x < 28 && z < 10 && z > -24) return '猫道';
  if (x < -43 && z < 24 || z < -38 && x < 28) return 'A 大';
  if (x < -26 && z < 23) return 'B 洞';
  if (x > 23 && z > 12) return 'CT 出生点';
  if (x < -30 && z > 23) return 'T 出生点';
  if (z > 2 && x < 24) return '中路';
  return '连接通道';
}

export const SITE_RADIUS = 8.2;
export function siteAt(p: Vec2): 'A' | 'B' | null {
  if (Math.hypot(p.x - A_SITE.x, p.z - A_SITE.z) < SITE_RADIUS) return 'A';
  if (Math.hypot(p.x - B_SITE.x, p.z - B_SITE.z) < SITE_RADIUS) return 'B';
  return null;
}

export class DustMap {
  readonly group = new THREE.Group();
  readonly colliders: Box2[] = [];
  private wallMaterial = new THREE.MeshStandardMaterial({ color: 0xc6ad85, roughness: 1 });
  private wallAlt = new THREE.MeshStandardMaterial({ color: 0xd2bc98, roughness: 1 });
  private trimMaterial = new THREE.MeshStandardMaterial({ color: 0x9d815f, roughness: 1 });

  constructor() {
    this.buildGround();
    this.buildBoundary();
    this.buildDoors();
    this.buildProps();
    this.buildSites();
    this.batchStaticBoxes();
  }

  private box(x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material, cast = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    return mesh;
  }

  private addSolid(x: number, z: number, w: number, d: number, h: number, kind: Box2['kind'], material: THREE.Material) {
    this.colliders.push({ x, z, w, d, h, kind });
    return this.box(x, h / 2, z, w, h, d, material);
  }

  private buildGround() {
    const sand = new THREE.MeshStandardMaterial({ color: 0xbfa98a, roughness: 1 });
    this.box(-6, -.31, -6, 135, .5, 115, sand, false);
    const tones = [0xcdbb9c, 0xc5af8c, 0xd3c0a0, 0xc9b596].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1 }));
    ROOMS.forEach((r, n) => {
      const tile = this.box((r.x1 + r.x2) / 2, -.045 + n * .0002, (r.z1 + r.z2) / 2,
        r.x2 - r.x1, .1, r.z2 - r.z1,
        tones[n % tones.length], false);
      tile.receiveShadow = true;
    });
    // Thin paving seams suggest stonework without downloaded textures.
    const seam = new THREE.MeshStandardMaterial({ color: 0xaa9477, transparent: true, opacity: .17 });
    for (let i = 0; i < 180; i++) {
      const x = -51 + ((i * 31.71) % 92), z = -47 + ((i * 17.17) % 82);
      if (included(x, z)) this.box(x, .013, z, 1.1 + i % 3, .012, .025, seam, false);
    }
  }

  private buildBoundary() {
    // Merge adjacent grid edges into long walls. This keeps draw calls and collider count low.
    const edges = new Map<string, number[]>();
    const add = (axis: 'x' | 'z', fixed: number, step: number) => {
      const key = `${axis}:${fixed}`;
      const list = edges.get(key) ?? [];
      list.push(step); edges.set(key, list);
    };
    for (let j = 0; j < GRID_H; j++) for (let i = 0; i < GRID_W; i++) if (gridAt(i, j)) {
      if (!gridAt(i - 1, j)) add('x', MAP_MIN_X + i * CELL, j);
      if (!gridAt(i + 1, j)) add('x', MAP_MIN_X + (i + 1) * CELL, j);
      if (!gridAt(i, j - 1)) add('z', MAP_MIN_Z + j * CELL, i);
      if (!gridAt(i, j + 1)) add('z', MAP_MIN_Z + (j + 1) * CELL, i);
    }
    for (const [key, values] of edges) {
      values.sort((a, b) => a - b);
      const [axis, fixedText] = key.split(':');
      const fixed = Number(fixedText);
      let start = values[0], previous = values[0];
      const emit = (s: number, e: number) => {
        const length = (e - s + 1) * CELL;
        const mid = (s + e + 1) * CELL / 2;
        const x = axis === 'x' ? fixed : MAP_MIN_X + mid;
        const z = axis === 'z' ? fixed : MAP_MIN_Z + mid;
        const w = axis === 'x' ? .55 : length + .4;
        const d = axis === 'z' ? .55 : length + .4;
        this.addSolid(x, z, w, d, 4.7, 'wall', (Math.floor(s * 1.7) & 1) ? this.wallMaterial : this.wallAlt);
        this.box(x, 4.72, z, w + .34, .3, d + .34, this.trimMaterial);
      };
      for (let n = 1; n < values.length; n++) {
        if (values[n] !== previous + 1) { emit(start, previous); start = values[n]; }
        previous = values[n];
      }
      emit(start, previous);
    }
  }

  private buildDoors() {
    const timber = new THREE.MeshStandardMaterial({ color: 0x6e4b31, roughness: .9 });
    const iron = new THREE.MeshStandardMaterial({ color: 0x414141, metalness: .6, roughness: .45 });
    // The middle double doors have a wide open center gap: both people and bullets pass.
    for (const z of [8.25, 13.75]) {
      this.addSolid(20, z, .62, 2.65, 3.8, 'door', timber);
      for (const y of [.42, 1.86, 3.26]) this.box(20.36, y, z, .08, .16, 2.55, iron);
      this.box(20.38, 1.85, z > 11 ? z - .92 : z + .92, .12, .3, .08, iron);
    }
    this.box(20, 4.1, 11, .9, .8, 9.5, this.trimMaterial);
    for (const z of [6.7, 15.3]) this.box(20, 2.2, z, 1.2, 4.4, 1, this.trimMaterial);
  }

  private buildProps() {
    const wood = new THREE.MeshStandardMaterial({ color: 0x90714b, roughness: 1 });
    const woodDark = new THREE.MeshStandardMaterial({ color: 0x6f573d, roughness: 1 });
    const metal = new THREE.MeshStandardMaterial({ color: 0x797c73, metalness: .35, roughness: .75 });
    const crates: Array<[number, number, number, number, number]> = [
      [34, -32, 3, 3, 2.2], [29, -34, 2.5, 2.5, 1.8], [38, -23, 2.2, 2.2, 1.7],
      [-16, -36, 3, 3, 2.3], [-8, -29, 2, 2.6, 1.6], [-20, -31, 2, 2, 1.5],
      [-44, -12, 2.2, 2.3, 1.5], [-48, -33, 2.4, 2.4, 1.7],
      [7, 14, 2.3, 2.3, 1.8], [-1, 10, 2.2, 2.2, 1.5], [29, 18, 2.4, 2.4, 1.8],
    ];
    crates.forEach(([x, z, w, d, h], n) => {
      this.addSolid(x, z, w, d, h, 'crate', n % 3 === 0 ? metal : wood);
      if (n % 3 !== 0) {
        for (const off of [-.37, .37]) {
          this.box(x + off * w, h / 2, z + d / 2 + .035, .10, h, .07, woodDark);
          this.box(x + off * w, h / 2, z - d / 2 - .035, .10, h, .07, woodDark);
        }
        this.box(x, h * .15, z + d / 2 + .04, w, .09, .08, woodDark);
        this.box(x, h * .85, z + d / 2 + .04, w, .09, .08, woodDark);
      }
    });
    const plaster = new THREE.MeshStandardMaterial({ color: 0xe0ceb0, roughness: 1 });
    const roof = new THREE.MeshStandardMaterial({ color: 0x8b6950, roughness: 1 });
    // Silhouettes above the enclosing walls make the arena read as a city block.
    [[-55,-13,8,8,7],[-54,11,7,11,8],[-20,34,10,8,7],[10,24,10,8,9],[40,5,7,12,7],[-25,-50,12,7,6],[13,-48,9,6,8]].forEach(([x,z,w,d,h]) => {
      this.addSolid(x, z, w, d, h, 'wall', plaster);
      this.box(x, h + .18, z, w + .55, .4, d + .55, roof);
    });
    const edge = new THREE.MeshStandardMaterial({ color: 0x9f876b, roughness: 1 });
    for (let z = -16; z <= 2; z += 3) this.addSolid(8.8, z, .42, 2.5, 1.12, 'wall', edge);
    for (let x = 9; x <= 21; x += 3) this.addSolid(x, -22.5, 2.5, .42, 1.12, 'wall', edge);
    this.addSign(-47.9, -24, 'A  →', '#b35b3c', Math.PI / 2);
    this.addSign(-33, -10, 'B  ←', '#9f6449', Math.PI / 2);
    this.addSign(23.7, -7, 'A', '#b35b3c', Math.PI / 2);
  }

  private addSign(x: number, z: number, label: string, color: string, rotationY: number) {
    const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 256, 128);
    ctx.fillStyle = color; ctx.font = 'bold 88px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, 128, 64);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 1.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false }));
    mesh.position.set(x, 2.15, z); mesh.rotation.y = rotationY; this.group.add(mesh);
  }

  private buildSites() {
    const ringA = new THREE.MeshStandardMaterial({ color: 0xb34734, roughness: 1, transparent: true, opacity: .8 });
    const ringB = new THREE.MeshStandardMaterial({ color: 0xb96236, roughness: 1, transparent: true, opacity: .8 });
    for (const [p, mat, letter] of [[A_SITE, ringA, 'A'], [B_SITE, ringB, 'B']] as const) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(5.1, .12, 8, 64), mat);
      ring.rotation.x = -Math.PI / 2; ring.position.set(p.x, .045, p.z); this.group.add(ring);
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
      const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#a43e2e'; ctx.font = 'bold 180px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(letter, 128, 137);
      const mark = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 3.8), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, opacity: .65, depthWrite: false }));
      mark.rotation.x = -Math.PI / 2; mark.position.set(p.x, .055, p.z); this.group.add(mark);
    }
  }

  private batchStaticBoxes() {
    const groups = new Map<THREE.Material, THREE.Mesh[]>();
    for (const child of this.group.children) {
      if (!(child instanceof THREE.Mesh) || !(child.geometry instanceof THREE.BoxGeometry) || Array.isArray(child.material)) continue;
      const list = groups.get(child.material) ?? [];
      list.push(child); groups.set(child.material, list);
    }
    for (const [material, meshes] of groups) {
      if (meshes.length < 2) continue;
      const geometries = meshes.map(mesh => {
        mesh.updateMatrix();
        return mesh.geometry.clone().applyMatrix4(mesh.matrix);
      });
      const merged = mergeGeometries(geometries, false);
      if (!merged) continue;
      for (const mesh of meshes) this.group.remove(mesh);
      const combined = new THREE.Mesh(merged, material);
      combined.castShadow = true; combined.receiveShadow = true;
      this.group.add(combined);
      geometries.forEach(g => g.dispose());
    }
  }

  isBlocked(x: number, z: number, radius = .36): boolean {
    if (!walkable(x, z)) return true;
    for (const b of this.colliders) {
      if (Math.abs(x - b.x) > b.w / 2 + radius || Math.abs(z - b.z) > b.d / 2 + radius) continue;
      const qx = Math.max(b.x - b.w / 2, Math.min(x, b.x + b.w / 2));
      const qz = Math.max(b.z - b.d / 2, Math.min(z, b.z + b.d / 2));
      if ((x - qx) ** 2 + (z - qz) ** 2 < radius ** 2) return true;
    }
    return false;
  }

  move(pos: THREE.Vector3, dx: number, dz: number, radius = .36) {
    if (!this.isBlocked(pos.x + dx, pos.z, radius)) pos.x += dx;
    if (!this.isBlocked(pos.x, pos.z + dz, radius)) pos.z += dz;
  }

  private clearCell(i: number, j: number) {
    if (!gridAt(i, j)) return false;
    const p = cellToWorld(i, j);
    return !this.isBlocked(p.x, p.z, .42);
  }

  path(start: Vec2, end: Vec2): Vec2[] {
    const a = worldToCell(start), b = worldToCell(end);
    if (!gridAt(a.i, a.j) || !gridAt(b.i, b.j)) return [];
    // A* on the 2 m floor lattice. All bots share one static grid and only replan as needed.
    const begin = a.j * GRID_W + a.i, goal = b.j * GRID_W + b.i;
    const total = GRID_W * GRID_H;
    const g = new Float32Array(total); g.fill(Infinity); g[begin] = 0;
    const parent = new Int32Array(total); parent.fill(-1);
    const closed = new Uint8Array(total);
    const heap: Array<{ n: number; f: number }> = [{ n: begin, f: 0 }];
    const push = (v: { n: number; f: number }) => { heap.push(v); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p].f <= heap[i].f) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => { const out = heap[0]; const last = heap.pop()!; if (heap.length) { heap[0] = last; let i = 0; for (;;) { let c = i * 2 + 1; if (c >= heap.length) break; if (c + 1 < heap.length && heap[c + 1].f < heap[c].f) c++; if (heap[i].f <= heap[c].f) break; [heap[i], heap[c]] = [heap[c], heap[i]]; i = c; } } return out; };
    const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    while (heap.length) {
      const { n } = pop(); if (closed[n]) continue; closed[n] = 1;
      if (n === goal) break;
      const i = n % GRID_W, j = Math.floor(n / GRID_W);
      for (const [di, dj] of dirs) {
        const ni = i + di, nj = j + dj, m = nj * GRID_W + ni;
        if (!this.clearCell(ni, nj) || closed[m]) continue;
        if (di && dj && (!this.clearCell(i + di, j) || !this.clearCell(i, j + dj))) continue;
        const cost = g[n] + (di && dj ? 1.414 : 1);
        if (cost < g[m]) { g[m] = cost; parent[m] = n; push({ n: m, f: cost + Math.hypot(b.i - ni, b.j - nj) }); }
      }
    }
    if (begin !== goal && parent[goal] === -1) return [];
    const path: Vec2[] = [];
    for (let n = goal; n !== begin && n !== -1; n = parent[n]) path.push(cellToWorld(n % GRID_W, Math.floor(n / GRID_W)));
    path.reverse();
    return path;
  }
}

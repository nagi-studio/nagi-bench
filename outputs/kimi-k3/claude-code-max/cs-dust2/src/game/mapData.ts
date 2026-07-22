// ---------------------------------------------------------------------------
// Dust2 地图数据：网格雕刻 + 碰撞体合并 + 导航网格 + A* 寻路
// 世界坐标：x 向东，z 向南（-z 为北）。单位：米。
// ---------------------------------------------------------------------------

import { AABB, Rect, Team } from './types';

export const OX = 42;           // 世界 x ∈ [-42, 42]
export const OZ = 50;           // 世界 z ∈ [-50, 50]
export const GW = 84;           // 网格列数
export const GD = 100;          // 网格行数
export const WALL_H = 3.4;

export interface Crate extends AABB { kind: 'crate' | 'door' }

export interface MapData {
  /** 1 = 墙, 0 = 可行走（视觉/碰撞层） */
  grid: Uint8Array;
  /** 导航层：1 = 阻挡（墙 + 箱子 + 门） */
  nav: Uint8Array;
  colliders: AABB[];
  crates: Crate[];
  zones: { name: string; rect: Rect; label: string }[];
  siteA: Rect;
  siteB: Rect;
  spawns: Record<Team, { x: number; z: number }[]>;
}

export function cellIndex(cx: number, cz: number): number { return cz * GW + cx; }
export function worldToCell(x: number, z: number): { cx: number; cz: number } {
  return { cx: Math.floor(x + OX), cz: Math.floor(z + OZ) };
}
export function cellToWorld(cx: number, cz: number): { x: number; z: number } {
  return { x: cx - OX + 0.5, z: cz - OZ + 0.5 };
}
export function inGrid(cx: number, cz: number): boolean {
  return cx >= 0 && cx < GW && cz >= 0 && cz < GD;
}

function carve(grid: Uint8Array, x0: number, z0: number, x1: number, z1: number) {
  const c0 = worldToCell(x0, z0);
  const c1 = worldToCell(x1, z1);
  for (let cz = c0.cz; cz < c1.cz; cz++) {
    for (let cx = c0.cx; cx < c1.cx; cx++) {
      if (inGrid(cx, cz)) grid[cellIndex(cx, cz)] = 0;
    }
  }
}

export function buildMap(): MapData {
  const grid = new Uint8Array(GW * GD).fill(1);

  // ---- 区域雕刻（相邻区域保证 ≥1 格重叠以连通）----
  carve(grid, -32, 36, 6, 48);      // T 出生点
  carve(grid, -38, -22, -28, 40);   // A大（长走廊）
  carve(grid, -40, -48, -2, -18);   // A 点
  carve(grid, -2, -14, 8, 38);      // 中路
  carve(grid, -14, -34, 18, -12);   // CT 出生点
  carve(grid, -14, -28, -2, -20);   // CT -> A 连接
  carve(grid, -4, -20, 10, -12);    // 猫道（中路 <-> A 点）
  carve(grid, 6, 28, 38, 38);       // B洞入口走廊
  carve(grid, 26, -18, 38, 30);     // B洞
  carve(grid, 18, -48, 40, -16);    // B 点
  carve(grid, 14, -34, 22, -24);    // CT -> B 连接

  const colliders: AABB[] = [];
  const crates: Crate[] = [];

  // ---- 合并墙体：按行合并连续墙格 ----
  for (let cz = 0; cz < GD; cz++) {
    let cx = 0;
    while (cx < GW) {
      if (grid[cellIndex(cx, cz)] === 1) {
        let x2 = cx;
        while (x2 < GW && grid[cellIndex(x2, cz)] === 1) x2++;
        colliders.push({
          minX: cx - OX, minY: 0, minZ: cz - OZ,
          maxX: x2 - OX, maxY: WALL_H, maxZ: cz - OZ + 1,
        });
        cx = x2;
      } else cx++;
    }
  }

  // ---- 中门门体（可从中缝穿过的双开门） ----
  const doors: Crate[] = [
    { minX: -2, minY: 0, minZ: 6.35, maxX: 1.6, maxY: 2.7, maxZ: 7.05, kind: 'door' },
    { minX: 4.4, minY: 0, minZ: 6.35, maxX: 8, maxY: 2.7, maxZ: 7.05, kind: 'door' },
  ];

  // ---- 箱子（掩体，可跳上） ----
  const box = (x: number, z: number, w: number, h: number, d: number): Crate => ({
    minX: x - w / 2, minY: 0, minZ: z - d / 2, maxX: x + w / 2, maxY: h, maxZ: z + d / 2, kind: 'crate',
  });
  crates.push(
    ...doors,
    // A 点
    box(-22, -32, 2.2, 1.15, 2.2),
    box(-31, -40, 2.0, 1.15, 2.0),
    box(-29, -40, 1.4, 0.75, 1.4),
    box(-10, -25, 1.8, 1.15, 1.8),
    // B 点
    box(29, -32, 2.2, 1.15, 2.2),
    box(24, -42, 1.8, 1.15, 1.8),
    box(35, -23, 1.8, 0.75, 1.8),
    // 中路 / 猫道 / A大
    box(3, 15, 1.6, 1.15, 1.6),      // mid xbox
    box(4, -16, 1.6, 1.15, 1.6),     // 猫道
    box(-33, 4, 1.8, 1.15, 1.8),     // A大中段
    box(2, -24, 1.6, 0.75, 1.6),     // CT
    // B 洞内
    box(31, 8, 1.6, 1.15, 1.6),
    // T 出生掩体
    box(-14, 42, 1.8, 0.75, 1.8),
  );
  for (const c of crates) colliders.push(c);

  // ---- 导航网格：墙 + 门 + 箱子（按半径膨胀） ----
  const nav = new Uint8Array(grid);
  const blockBy = (c: AABB, pad: number) => {
    const c0 = worldToCell(c.minX - pad, c.minZ - pad);
    const c1 = worldToCell(c.maxX + pad, c.maxZ + pad);
    for (let cz = c0.cz; cz <= c1.cz; cz++)
      for (let cx = c0.cx; cx <= c1.cx; cx++)
        if (inGrid(cx, cz)) nav[cellIndex(cx, cz)] = 1;
  };
  for (const c of crates) blockBy(c, c.kind === 'door' ? 0.18 : 0.32);

  // ---- 出生点 ----
  const spawns: Record<Team, { x: number; z: number }[]> = {
    T: [
      { x: -26, z: 44 }, { x: -18, z: 45 }, { x: -10, z: 44 }, { x: -2, z: 45 }, { x: -22, z: 40 },
    ],
    CT: [
      { x: -8, z: -18 }, { x: 0, z: -20 }, { x: 8, z: -18 }, { x: 12, z: -24 }, { x: -4, z: -26 },
    ],
  };

  const siteA: Rect = { x0: -36, z0: -46, x1: -6, z1: -22 };
  const siteB: Rect = { x0: 20, z0: -46, x1: 39, z1: -20 };

  const zones = [
    { name: 'siteA', label: 'A', rect: siteA },
    { name: 'siteB', label: 'B', rect: siteB },
    { name: 'tspawn', label: 'T', rect: { x0: -32, z0: 36, x1: 6, z1: 48 } },
    { name: 'ctspawn', label: 'CT', rect: { x0: -14, z0: -34, x1: 18, z1: -12 } },
    { name: 'mid', label: 'MID', rect: { x0: -2, z0: -14, x1: 8, z1: 38 } },
    { name: 'long', label: 'A大', rect: { x0: -38, z0: -22, x1: -28, z1: 40 } },
    { name: 'cat', label: '猫道', rect: { x0: -4, z0: -20, x1: 10, z1: -12 } },
    { name: 'tuns', label: 'B洞', rect: { x0: 26, z0: -18, x1: 38, z1: 30 } },
  ];

  return { grid, nav, colliders, crates, zones, siteA, siteB, spawns };
}

// ---------------------------------------------------------------------------
// A* 寻路（8 向，禁止切角）
// ---------------------------------------------------------------------------

interface PqNode { i: number; f: number }

class MinHeap {
  private a: PqNode[] = [];
  get size() { return this.a.length; }
  push(n: PqNode) {
    this.a.push(n);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p].f <= this.a[i].f) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop(): PqNode {
    const top = this.a[0];
    const last = this.a.pop()!;
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1, r = l + 1;
        let m = i;
        if (l < this.a.length && this.a[l].f < this.a[m].f) m = l;
        if (r < this.a.length && this.a[r].f < this.a[m].f) m = r;
        if (m === i) break;
        [this.a[m], this.a[i]] = [this.a[i], this.a[m]];
        i = m;
      }
    }
    return top;
  }
}

/** 在导航格上做直线可视检查（超覆盖 Bresenham） */
export function navLineClear(nav: Uint8Array, x0: number, z0: number, x1: number, z1: number): boolean {
  let dx = Math.abs(x1 - x0), dz = Math.abs(z1 - z0);
  let sx = x0 < x1 ? 1 : -1, sz = z0 < z1 ? 1 : -1;
  let err = dx - dz, cx = x0, cz = z0;
  for (let guard = 0; guard < 1000; guard++) {
    if (!inGrid(cx, cz) || nav[cellIndex(cx, cz)] === 1) return false;
    if (cx === x1 && cz === z1) return true;
    const e2 = 2 * err;
    if (e2 > -dz) {
      err -= dz; cx += sx;
      // 切角检查
      if (inGrid(cx, cz - sz) && nav[cellIndex(cx, cz - sz)] === 1 && dz !== 0) return false;
    }
    if (e2 < dx) {
      err += dx; cz += sz;
      if (inGrid(cx - sx, cz) && nav[cellIndex(cx - sx, cz)] === 1 && dx !== 0) return false;
    }
  }
  return false;
}

/** 世界坐标寻路，返回平滑后的世界路径点 */
export function findPath(nav: Uint8Array, sx: number, sz: number, gx: number, gz: number): { x: number; z: number }[] | null {
  let s = worldToCell(sx, sz);
  let g = worldToCell(gx, gz);
  const openAt = (c: { cx: number; cz: number }, fallback: { cx: number; cz: number }) => {
    if (inGrid(c.cx, c.cz) && nav[cellIndex(c.cx, c.cz)] === 0) return c;
    // 螺旋找最近开放格
    for (let r = 1; r < 8; r++) {
      for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
        const nx = c.cx + dx, nz = c.cz + dz;
        if (inGrid(nx, nz) && nav[cellIndex(nx, nz)] === 0) return { cx: nx, cz: nz };
      }
    }
    return fallback;
  };
  s = openAt(s, s); g = openAt(g, g);
  if (s.cx === g.cx && s.cz === g.cz) return [cellToWorld(g.cx, g.cz)];

  const si = cellIndex(s.cx, s.cz), gi = cellIndex(g.cx, g.cz);
  const gScore = new Float32Array(GW * GD).fill(Infinity);
  const came = new Int32Array(GW * GD).fill(-1);
  const closed = new Uint8Array(GW * GD);
  const h = (i: number) => {
    const dx = Math.abs((i % GW) - g.cx), dz = Math.abs(Math.floor(i / GW) - g.cz);
    return Math.max(dx, dz) + 0.4142 * Math.min(dx, dz);
  };
  const pq = new MinHeap();
  gScore[si] = 0;
  pq.push({ i: si, f: h(si) });
  const DIRS = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.4142], [1, -1, 1.4142], [-1, 1, 1.4142], [-1, -1, 1.4142]];

  while (pq.size) {
    const { i } = pq.pop();
    if (closed[i]) continue;
    closed[i] = 1;
    if (i === gi) break;
    const cx = i % GW, cz = Math.floor(i / GW);
    for (const [dx, dz, cost] of DIRS) {
      const nx = cx + dx, nz = cz + dz;
      if (!inGrid(nx, nz)) continue;
      const ni = cellIndex(nx, nz);
      if (nav[ni] === 1 || closed[ni]) continue;
      if (dx !== 0 && dz !== 0) {
        if (nav[cellIndex(cx + dx, cz)] === 1 || nav[cellIndex(cx, cz + dz)] === 1) continue;
      }
      const ng = gScore[i] + cost;
      if (ng < gScore[ni]) {
        gScore[ni] = ng;
        came[ni] = i;
        pq.push({ i: ni, f: ng + h(ni) });
      }
    }
  }
  if (came[gi] === -1 && gi !== si) return null;

  // 回溯
  const cells: number[] = [];
  for (let i = gi; i !== -1; i = came[i]) cells.push(i);
  cells.reverse();

  // 拉直平滑
  const pts: { x: number; z: number }[] = [];
  let anchor = 0;
  for (let k = 2; k < cells.length; k++) {
    const a = cells[anchor], b = cells[k];
    if (!navLineClear(nav, a % GW, Math.floor(a / GW), b % GW, Math.floor(b / GW))) {
      anchor = k - 1;
      pts.push(cellToWorld(cells[anchor] % GW, Math.floor(cells[anchor] / GW)));
    }
  }
  pts.push(cellToWorld(g.cx, g.cz));
  return pts;
}

// ---------------------------------------------------------------------------
// 射线检测（slab 法）—— 子弹与视线共用
// ---------------------------------------------------------------------------

export interface RayHit { t: number; nx: number; ny: number; nz: number }

export function rayAABB(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  b: AABB, maxT: number,
): RayHit | null {
  const ix = 1 / (dx === 0 ? 1e-9 : dx);
  const iy = 1 / (dy === 0 ? 1e-9 : dy);
  const iz = 1 / (dz === 0 ? 1e-9 : dz);
  let t1 = (b.minX - ox) * ix, t2 = (b.maxX - ox) * ix;
  let tmin = Math.min(t1, t2), tmax = Math.max(t1, t2);
  let axis = 0, sign = dx > 0 ? -1 : 1;
  t1 = (b.minY - oy) * iy; t2 = (b.maxY - oy) * iy;
  const tymin = Math.min(t1, t2), tymax = Math.max(t1, t2);
  if (tymin > tmin) { tmin = tymin; axis = 1; sign = dy > 0 ? -1 : 1; }
  tmax = Math.min(tmax, tymax);
  if (tmin > tmax) return null;
  t1 = (b.minZ - oz) * iz; t2 = (b.maxZ - oz) * iz;
  const tzmin = Math.min(t1, t2), tzmax = Math.min(t1, t2);
  if (tzmin > tmin) { tmin = tzmin; axis = 2; sign = dz > 0 ? -1 : 1; }
  tmax = Math.min(tmax, tzmax);
  if (tmin > tmax || tmin < 0 || tmin > maxT) return null;
  return {
    t: tmin,
    nx: axis === 0 ? sign : 0,
    ny: axis === 1 ? sign : 0,
    nz: axis === 2 ? sign : 0,
  };
}

/** 射线打静态碰撞体，返回最近命中距离（未命中返回 maxT） */
export function raycastWorld(colliders: AABB[], ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxT: number): number {
  let best = maxT;
  for (const c of colliders) {
    const hit = rayAABB(ox, oy, oz, dx, dy, dz, c, best);
    if (hit && hit.t < best) best = hit.t;
  }
  return best;
}

/** 两点间视线是否通畅（含高度） */
export function losClear(colliders: AABB[], ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean {
  const dx = bx - ax, dy = by - ay, dz = bz - az;
  const d = Math.hypot(dx, dy, dz);
  if (d < 1e-4) return true;
  const t = raycastWorld(colliders, ax, ay, az, dx / d, dy / d, dz / d, d - 0.05);
  return t >= d - 0.05;
}

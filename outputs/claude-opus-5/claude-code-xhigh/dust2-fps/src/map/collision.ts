/**
 * 静态碰撞世界：整张地图被离散成一堆 AABB（地板 / 墙 / 台阶 / 箱子）。
 * 提供三种查询：
 *   overlapBox   —— 玩家胶囊（实为 AABB）与世界求交，用于移动阻挡
 *   supportHeight—— 脚下最高支撑面，用于重力/落地/上台阶
 *   raycast      —— 射线，用于子弹命中与 AI 视线遮挡
 * 广相用 XZ 平面的均匀网格哈希 + DDA 遍历，避免每次射线都扫全图。
 */

import type { SurfaceKind } from './dust2.ts';

export interface Box {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  kind: SurfaceKind;
  /** 归属区域 id，调试与渲染分组用。 */
  area?: string;
  /** 渲染层分类：地板/墙/道具，便于分材质。 */
  role: 'floor' | 'wall' | 'ceiling' | 'step' | 'prop';
  tag?: string;
}

export interface RayHit {
  t: number;
  box: Box;
  nx: number;
  ny: number;
  nz: number;
}

const EPS = 1e-6;

export function makeBox(
  minX: number,
  minY: number,
  minZ: number,
  maxX: number,
  maxY: number,
  maxZ: number,
  kind: SurfaceKind,
  role: Box['role'],
  area?: string,
  tag?: string,
): Box {
  return { minX, minY, minZ, maxX, maxY, maxZ, kind, role, area, tag };
}

export class CollisionWorld {
  readonly boxes: Box[] = [];
  private cellSize = 8;
  private gx0 = 0;
  private gz0 = 0;
  private nx = 1;
  private nz = 1;
  private cells: number[][] = [];
  /** 射线遍历时的去重标记，避免同一个 box 被多次求交。 */
  private stamp: Int32Array = new Int32Array(0);
  private stampCounter = 1;

  add(b: Box): void {
    this.boxes.push(b);
  }

  bounds(): { x0: number; z0: number; x1: number; z1: number } {
    let x0 = Infinity;
    let z0 = Infinity;
    let x1 = -Infinity;
    let z1 = -Infinity;
    for (const b of this.boxes) {
      if (b.minX < x0) x0 = b.minX;
      if (b.minZ < z0) z0 = b.minZ;
      if (b.maxX > x1) x1 = b.maxX;
      if (b.maxZ > z1) z1 = b.maxZ;
    }
    return { x0, z0, x1, z1 };
  }

  /** 构建广相网格；所有 box 添加完之后调用一次。 */
  build(): void {
    const b = this.bounds();
    this.gx0 = b.x0 - 2;
    this.gz0 = b.z0 - 2;
    this.nx = Math.max(1, Math.ceil((b.x1 + 2 - this.gx0) / this.cellSize));
    this.nz = Math.max(1, Math.ceil((b.z1 + 2 - this.gz0) / this.cellSize));
    this.cells = new Array(this.nx * this.nz);
    for (let i = 0; i < this.cells.length; i++) this.cells[i] = [];
    for (let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i];
      const cx0 = this.clampCX(Math.floor((box.minX - this.gx0) / this.cellSize));
      const cx1 = this.clampCX(Math.floor((box.maxX - this.gx0) / this.cellSize));
      const cz0 = this.clampCZ(Math.floor((box.minZ - this.gz0) / this.cellSize));
      const cz1 = this.clampCZ(Math.floor((box.maxZ - this.gz0) / this.cellSize));
      for (let cz = cz0; cz <= cz1; cz++) {
        for (let cx = cx0; cx <= cx1; cx++) {
          this.cells[cz * this.nx + cx].push(i);
        }
      }
    }
    this.stamp = new Int32Array(this.boxes.length);
    this.stampCounter = 1;
  }

  private clampCX(v: number): number {
    return v < 0 ? 0 : v >= this.nx ? this.nx - 1 : v;
  }

  private clampCZ(v: number): number {
    return v < 0 ? 0 : v >= this.nz ? this.nz - 1 : v;
  }

  /** 收集与给定 XZ 矩形重叠的 box 下标。 */
  queryRegion(minX: number, minZ: number, maxX: number, maxZ: number, out: number[]): number[] {
    out.length = 0;
    const cx0 = this.clampCX(Math.floor((minX - this.gx0) / this.cellSize));
    const cx1 = this.clampCX(Math.floor((maxX - this.gx0) / this.cellSize));
    const cz0 = this.clampCZ(Math.floor((minZ - this.gz0) / this.cellSize));
    const cz1 = this.clampCZ(Math.floor((maxZ - this.gz0) / this.cellSize));
    const s = ++this.stampCounter;
    for (let cz = cz0; cz <= cz1; cz++) {
      for (let cx = cx0; cx <= cx1; cx++) {
        const list = this.cells[cz * this.nx + cx];
        for (let k = 0; k < list.length; k++) {
          const idx = list[k];
          if (this.stamp[idx] === s) continue;
          this.stamp[idx] = s;
          out.push(idx);
        }
      }
    }
    return out;
  }

  private scratch: number[] = [];

  /** AABB 是否与任何实体相交。 */
  overlapBox(
    minX: number,
    minY: number,
    minZ: number,
    maxX: number,
    maxY: number,
    maxZ: number,
  ): boolean {
    const idx = this.queryRegion(minX, minZ, maxX, maxZ, this.scratch);
    for (let i = 0; i < idx.length; i++) {
      const b = this.boxes[idx[i]];
      if (
        minX < b.maxX - EPS &&
        maxX > b.minX + EPS &&
        minY < b.maxY - EPS &&
        maxY > b.minY + EPS &&
        minZ < b.maxZ - EPS &&
        maxZ > b.minZ + EPS
      ) {
        return true;
      }
    }
    return false;
  }

  /** 返回与 AABB 相交的第一个 box（需要材质时用）。 */
  overlapBoxFirst(
    minX: number,
    minY: number,
    minZ: number,
    maxX: number,
    maxY: number,
    maxZ: number,
  ): Box | null {
    const idx = this.queryRegion(minX, minZ, maxX, maxZ, this.scratch);
    for (let i = 0; i < idx.length; i++) {
      const b = this.boxes[idx[i]];
      if (
        minX < b.maxX - EPS &&
        maxX > b.minX + EPS &&
        minY < b.maxY - EPS &&
        maxY > b.minY + EPS &&
        minZ < b.maxZ - EPS &&
        maxZ > b.minZ + EPS
      ) {
        return b;
      }
    }
    return null;
  }

  /**
   * 脚下支撑面高度：以 (x,z) 为中心、半径 radius 的方形足迹内，
   * 顶面不高于 maxY 的最高 box 顶面。找不到返回 -Infinity。
   */
  supportHeight(x: number, z: number, maxY: number, radius: number): number {
    const idx = this.queryRegion(x - radius, z - radius, x + radius, z + radius, this.scratch);
    let best = -Infinity;
    const minX = x - radius;
    const maxX = x + radius;
    const minZ = z - radius;
    const maxZ = z + radius;
    for (let i = 0; i < idx.length; i++) {
      const b = this.boxes[idx[i]];
      if (b.maxY > maxY + 1e-4) continue;
      if (minX >= b.maxX - EPS || maxX <= b.minX + EPS) continue;
      if (minZ >= b.maxZ - EPS || maxZ <= b.minZ + EPS) continue;
      if (b.maxY > best) best = b.maxY;
    }
    return best;
  }

  /** 支撑面对应的材质（脚步声用）。 */
  supportSurface(x: number, z: number, y: number, radius: number): SurfaceKind {
    const idx = this.queryRegion(x - radius, z - radius, x + radius, z + radius, this.scratch);
    let best = -Infinity;
    let kind: SurfaceKind = 'sand';
    for (let i = 0; i < idx.length; i++) {
      const b = this.boxes[idx[i]];
      if (b.maxY > y + 0.3) continue;
      if (x - radius >= b.maxX || x + radius <= b.minX) continue;
      if (z - radius >= b.maxZ || z + radius <= b.minZ) continue;
      if (b.maxY > best) {
        best = b.maxY;
        kind = b.kind;
      }
    }
    return kind;
  }

  /**
   * 射线求交（dir 必须已归一化）。使用 XZ 网格 DDA 做广相。
   */
  raycast(
    ox: number,
    oy: number,
    oz: number,
    dx: number,
    dy: number,
    dz: number,
    maxT: number,
  ): RayHit | null {
    let cx = Math.floor((ox - this.gx0) / this.cellSize);
    let cz = Math.floor((oz - this.gz0) / this.cellSize);
    if (cx < 0 || cz < 0 || cx >= this.nx || cz >= this.nz) {
      return this.raycastBrute(ox, oy, oz, dx, dy, dz, maxT);
    }

    const stepX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    const stepZ = dz > 0 ? 1 : dz < 0 ? -1 : 0;
    const invDx = dx !== 0 ? 1 / dx : 0;
    const invDz = dz !== 0 ? 1 / dz : 0;
    const tDeltaX = stepX !== 0 ? Math.abs(this.cellSize * invDx) : Infinity;
    const tDeltaZ = stepZ !== 0 ? Math.abs(this.cellSize * invDz) : Infinity;
    let tMaxX =
      stepX !== 0
        ? ((this.gx0 + (cx + (stepX > 0 ? 1 : 0)) * this.cellSize - ox) * invDx)
        : Infinity;
    let tMaxZ =
      stepZ !== 0
        ? ((this.gz0 + (cz + (stepZ > 0 ? 1 : 0)) * this.cellSize - oz) * invDz)
        : Infinity;

    let best = maxT;
    let bestBox: Box | null = null;
    let bestAxis = 0;
    const s = ++this.stampCounter;

    for (let guard = 0; guard < 4096; guard++) {
      const list = this.cells[cz * this.nx + cx];
      for (let k = 0; k < list.length; k++) {
        const idx = list[k];
        if (this.stamp[idx] === s) continue;
        this.stamp[idx] = s;
        const b = this.boxes[idx];
        const t = rayBoxT(ox, oy, oz, dx, dy, dz, b, best);
        if (t >= 0 && t < best) {
          best = t;
          bestBox = b;
          bestAxis = rayBoxAxis;
        }
      }
      const tExit = Math.min(tMaxX, tMaxZ);
      if (bestBox && best <= tExit) break;
      if (tExit > maxT) break;
      if (tMaxX < tMaxZ) {
        cx += stepX;
        tMaxX += tDeltaX;
      } else {
        cz += stepZ;
        tMaxZ += tDeltaZ;
      }
      if (cx < 0 || cz < 0 || cx >= this.nx || cz >= this.nz) break;
      if (stepX === 0 && stepZ === 0) break;
    }

    if (!bestBox) return null;
    return {
      t: best,
      box: bestBox,
      nx: bestAxis === 0 ? (dx > 0 ? -1 : 1) : 0,
      ny: bestAxis === 1 ? (dy > 0 ? -1 : 1) : 0,
      nz: bestAxis === 2 ? (dz > 0 ? -1 : 1) : 0,
    };
  }

  /** 暴力版射线，作为 DDA 的正确性对照（测试用）。 */
  raycastBrute(
    ox: number,
    oy: number,
    oz: number,
    dx: number,
    dy: number,
    dz: number,
    maxT: number,
  ): RayHit | null {
    let best = maxT;
    let bestBox: Box | null = null;
    let bestAxis = 0;
    for (let i = 0; i < this.boxes.length; i++) {
      const b = this.boxes[i];
      const t = rayBoxT(ox, oy, oz, dx, dy, dz, b, best);
      if (t >= 0 && t < best) {
        best = t;
        bestBox = b;
        bestAxis = rayBoxAxis;
      }
    }
    if (!bestBox) return null;
    return {
      t: best,
      box: bestBox,
      nx: bestAxis === 0 ? (dx > 0 ? -1 : 1) : 0,
      ny: bestAxis === 1 ? (dy > 0 ? -1 : 1) : 0,
      nz: bestAxis === 2 ? (dz > 0 ? -1 : 1) : 0,
    };
  }

  /** 两点之间是否通视。 */
  visible(
    ax: number,
    ay: number,
    az: number,
    bx: number,
    by: number,
    bz: number,
  ): boolean {
    const dx = bx - ax;
    const dy = by - ay;
    const dz = bz - az;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (len < 1e-6) return true;
    const hit = this.raycast(ax, ay, az, dx / len, dy / len, dz / len, len - 0.02);
    return hit === null;
  }
}

/** rayBoxT 的副产物：命中轴 0=X 1=Y 2=Z。 */
let rayBoxAxis = 0;

/** 返回射线进入 box 的 t，未命中返回 -1。 */
export function rayBoxT(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  b: Box,
  maxT: number,
): number {
  let tmin = 0;
  let tmax = maxT;
  let axis = 0;

  // X
  if (Math.abs(dx) < 1e-9) {
    if (ox < b.minX || ox > b.maxX) return -1;
  } else {
    const inv = 1 / dx;
    let t1 = (b.minX - ox) * inv;
    let t2 = (b.maxX - ox) * inv;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    if (t1 > tmin) {
      tmin = t1;
      axis = 0;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return -1;
  }
  // Y
  if (Math.abs(dy) < 1e-9) {
    if (oy < b.minY || oy > b.maxY) return -1;
  } else {
    const inv = 1 / dy;
    let t1 = (b.minY - oy) * inv;
    let t2 = (b.maxY - oy) * inv;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    if (t1 > tmin) {
      tmin = t1;
      axis = 1;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return -1;
  }
  // Z
  if (Math.abs(dz) < 1e-9) {
    if (oz < b.minZ || oz > b.maxZ) return -1;
  } else {
    const inv = 1 / dz;
    let t1 = (b.minZ - oz) * inv;
    let t2 = (b.maxZ - oz) * inv;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    if (t1 > tmin) {
      tmin = t1;
      axis = 2;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return -1;
  }

  rayBoxAxis = axis;
  return tmin;
}

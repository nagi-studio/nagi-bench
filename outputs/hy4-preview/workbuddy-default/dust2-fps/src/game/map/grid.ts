/**
 * Occupancy grid + ray casting + A* path finding.
 * Everything here is hand written (no navmesh / pathing library).
 */

import type { Box } from './dust2';

export const CELL = 1.5;

export interface RayHit {
  t: number;
  x: number;
  y: number;
  z: number;
  nx: number;
  ny: number;
  nz: number;
}

/** Slab test: returns entry distance or -1. */
export function rayAABB(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  b: Box,
  maxT: number,
): { t: number; nx: number; ny: number; nz: number } | null {
  let tmin = 0;
  let tmax = maxT;
  let nx = 0, ny = 0, nz = 0;

  // X slab
  if (Math.abs(dx) < 1e-8) {
    if (ox < b.minX || ox > b.maxX) return null;
  } else {
    const inv = 1 / dx;
    let t1 = (b.minX - ox) * inv;
    let t2 = (b.maxX - ox) * inv;
    let sign = -1;
    if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; sign = 1; }
    if (t1 > tmin) { tmin = t1; nx = sign; ny = 0; nz = 0; }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }
  // Y slab
  if (Math.abs(dy) < 1e-8) {
    if (oy < b.minY || oy > b.maxY) return null;
  } else {
    const inv = 1 / dy;
    let t1 = (b.minY - oy) * inv;
    let t2 = (b.maxY - oy) * inv;
    let sign = -1;
    if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; sign = 1; }
    if (t1 > tmin) { tmin = t1; nx = 0; ny = sign; nz = 0; }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }
  // Z slab
  if (Math.abs(dz) < 1e-8) {
    if (oz < b.minZ || oz > b.maxZ) return null;
  } else {
    const inv = 1 / dz;
    let t1 = (b.minZ - oz) * inv;
    let t2 = (b.maxZ - oz) * inv;
    let sign = -1;
    if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; sign = 1; }
    if (t1 > tmin) { tmin = t1; nx = 0; ny = 0; nz = sign; }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }
  if (tmin < 0) return null;
  return { t: tmin, nx, ny, nz };
}

// ---------------------------------------------------------------------------
// Binary min-heap for A*
// ---------------------------------------------------------------------------

export class MinHeap {
  private items: number[] = [];
  private keys: Float64Array;
  constructor(capacity: number) {
    this.keys = new Float64Array(capacity);
  }
  setCapacity(capacity: number) {
    if (this.keys.length < capacity) this.keys = new Float64Array(capacity);
  }
  get size(): number { return this.items.length; }
  clear(): void { this.items.length = 0; }
  push(item: number, key: number): void {
    this.keys[item] = key;
    this.items.push(item);
    let i = this.items.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.keys[this.items[p]!]! <= this.keys[this.items[i]!]!) break;
      const tmp = this.items[p]!; this.items[p] = this.items[i]!; this.items[i] = tmp;
      i = p;
    }
  }
  pop(): number | undefined {
    if (this.items.length === 0) return undefined;
    const top = this.items[0]!;
    const last = this.items.pop()!;
    if (this.items.length > 0) {
      this.items[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let s = i;
        if (l < this.items.length && this.keys[this.items[l]!]! < this.keys[this.items[s]!]!) s = l;
        if (r < this.items.length && this.keys[this.items[r]!]! < this.keys[this.items[s]!]!) s = r;
        if (s === i) break;
        const tmp = this.items[s]!; this.items[s] = this.items[i]!; this.items[i] = tmp;
        i = s;
      }
    }
    return top;
  }
}

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

const SCRATCH_BOX: Box = { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 };

export class NavGrid {
  readonly cols: number;
  readonly rows: number;
  readonly cell: number;
  readonly ox: number;
  readonly oz: number;

  /** 1 = walkable floor */
  readonly walkable: Uint8Array;
  /** region index + 1 (0 = none) */
  readonly region: Uint8Array;
  /** wall / ceiling height for the cell */
  readonly height: Float32Array;
  /** 1 = this cell has a roof */
  readonly roof: Uint8Array;

  // A* scratch buffers
  private gScore: Float32Array;
  private fScore: Float32Array;
  private cameFrom: Int32Array;
  private closed: Uint8Array;
  private open: Uint8Array;
  private heap: MinHeap;
  private stamp: Int32Array;
  private currentStamp = 1;

  constructor(cols: number, rows: number, cell: number, ox: number, oz: number) {
    this.cols = cols;
    this.rows = rows;
    this.cell = cell;
    this.ox = ox;
    this.oz = oz;
    const n = cols * rows;
    this.walkable = new Uint8Array(n);
    this.region = new Uint8Array(n);
    this.height = new Float32Array(n);
    this.roof = new Uint8Array(n);
    this.gScore = new Float32Array(n);
    this.fScore = new Float32Array(n);
    this.cameFrom = new Int32Array(n);
    this.closed = new Uint8Array(n);
    this.open = new Uint8Array(n);
    this.stamp = new Int32Array(n);
    this.heap = new MinHeap(n);
  }

  idx(cx: number, cz: number): number { return cz * this.cols + cx; }
  inBounds(cx: number, cz: number): boolean { return cx >= 0 && cz >= 0 && cx < this.cols && cz < this.rows; }

  cellX(x: number): number { return Math.floor((x - this.ox) / this.cell); }
  cellZ(z: number): number { return Math.floor((z - this.oz) / this.cell); }
  centerX(cx: number): number { return this.ox + (cx + 0.5) * this.cell; }
  centerZ(cz: number): number { return this.oz + (cz + 0.5) * this.cell; }
  minXOf(cx: number): number { return this.ox + cx * this.cell; }
  minZOf(cz: number): number { return this.oz + cz * this.cell; }

  isWalkableCell(cx: number, cz: number): boolean {
    if (!this.inBounds(cx, cz)) return false;
    return this.walkable[this.idx(cx, cz)] === 1;
  }

  isWalkableAt(x: number, z: number): boolean {
    return this.isWalkableCell(this.cellX(x), this.cellZ(z));
  }

  regionAt(x: number, z: number): number {
    const cx = this.cellX(x), cz = this.cellZ(z);
    if (!this.inBounds(cx, cz)) return 0;
    return this.region[this.idx(cx, cz)] as number;
  }

  heightAt(x: number, z: number): number {
    const cx = this.cellX(x), cz = this.cellZ(z);
    if (!this.inBounds(cx, cz)) return 0;
    return this.height[this.idx(cx, cz)] as number;
  }

  hasRoofAt(x: number, z: number): boolean {
    const cx = this.cellX(x), cz = this.cellZ(z);
    if (!this.inBounds(cx, cz)) return true;
    return this.roof[this.idx(cx, cz)] === 1;
  }

  /** Rasterise a metre-space rectangle into the grid. */
  fillRect(x0: number, z0: number, x1: number, z1: number, regionId: number, height: number, roof: boolean): void {
    const cx0 = Math.max(0, this.cellX(x0));
    const cx1 = Math.min(this.cols - 1, Math.ceil((x1 - this.ox) / this.cell) - 1);
    const cz0 = Math.max(0, this.cellZ(z0));
    const cz1 = Math.min(this.rows - 1, Math.ceil((z1 - this.oz) / this.cell) - 1);
    for (let cz = cz0; cz <= cz1; cz++) {
      for (let cx = cx0; cx <= cx1; cx++) {
        const i = this.idx(cx, cz);
        if (regionId === 0) continue;
        this.walkable[i] = 1;
        this.region[i] = regionId;
        this.height[i] = height;
        this.roof[i] = roof ? 1 : 0;
      }
    }
  }

  /** Assign wall heights to non-floor cells from their neighbouring floor cells. */
  finalise(): void {
    const wallH = new Float32Array(this.cols * this.rows);
    for (let cz = 0; cz < this.rows; cz++) {
      for (let cx = 0; cx < this.cols; cx++) {
        const i = this.idx(cx, cz);
        if (this.walkable[i]) { wallH[i] = this.height[i] as number; continue; }
        let h = 0;
        for (let dz = -1; dz <= 1; dz++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = cx + dx, nz = cz + dz;
            if (!this.inBounds(nx, nz)) continue;
            const ni = this.idx(nx, nz);
            if (this.walkable[ni]) h = Math.max(h, this.height[ni] as number);
          }
        }
        wallH[i] = h > 0 ? h : 4.0;
      }
    }
    // Walls that only touch the outside world get a sane default.
    for (let i = 0; i < wallH.length; i++) if (wallH[i] === 0) wallH[i] = 4.0;
    this.height.set(wallH);
  }

  // -- ray casting ---------------------------------------------------------

  /**
   * DDA ray march across the grid. Returns the nearest wall / ceiling / floor
   * hit within maxT, or null.
   */
  raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxT: number): RayHit | null {
    let cx = this.cellX(ox);
    let cz = this.cellZ(oz);

    const stepX = dx > 0 ? 1 : -1;
    const stepZ = dz > 0 ? 1 : -1;
    const tDeltaX = Math.abs(dx) < 1e-9 ? Infinity : Math.abs(this.cell / dx);
    const tDeltaZ = Math.abs(dz) < 1e-9 ? Infinity : Math.abs(this.cell / dz);

    let tMaxX: number;
    if (Math.abs(dx) < 1e-9) tMaxX = Infinity;
    else {
      const nextBoundary = this.minXOf(cx) + (dx > 0 ? this.cell : 0);
      tMaxX = (nextBoundary - ox) / dx;
      if (tMaxX < 0) tMaxX = 0;
    }
    let tMaxZ: number;
    if (Math.abs(dz) < 1e-9) tMaxZ = Infinity;
    else {
      const nextBoundary = this.minZOf(cz) + (dz > 0 ? this.cell : 0);
      tMaxZ = (nextBoundary - oz) / dz;
      if (tMaxZ < 0) tMaxZ = 0;
    }

    let t = 0;
    let guard = 0;
    const maxSteps = (this.cols + this.rows) * 2 + 8;

    while (guard++ < maxSteps) {
      if (!this.inBounds(cx, cz)) {
        if (t > 0) break;
        // started outside: nothing to test
        if (tMaxX === Infinity && tMaxZ === Infinity) break;
      }
      if (this.inBounds(cx, cz)) {
        const i = this.idx(cx, cz);
        if (this.walkable[i] !== 1) {
          const h = this.height[i] as number;
          SCRATCH_BOX.minX = this.minXOf(cx);
          SCRATCH_BOX.maxX = SCRATCH_BOX.minX + this.cell;
          SCRATCH_BOX.minZ = this.minZOf(cz);
          SCRATCH_BOX.maxZ = SCRATCH_BOX.minZ + this.cell;
          SCRATCH_BOX.minY = 0;
          SCRATCH_BOX.maxY = h;
          const hit = rayAABB(ox, oy, oz, dx, dy, dz, SCRATCH_BOX, maxT);
          if (hit && hit.t <= maxT) {
            return { t: hit.t, x: ox + dx * hit.t, y: oy + dy * hit.t, z: oz + dz * hit.t, nx: hit.nx, ny: hit.ny, nz: hit.nz };
          }
        } else if (this.roof[i] === 1) {
          const h = this.height[i] as number;
          SCRATCH_BOX.minX = this.minXOf(cx);
          SCRATCH_BOX.maxX = SCRATCH_BOX.minX + this.cell;
          SCRATCH_BOX.minZ = this.minZOf(cz);
          SCRATCH_BOX.maxZ = SCRATCH_BOX.minZ + this.cell;
          SCRATCH_BOX.minY = h - 0.35;
          SCRATCH_BOX.maxY = h;
          const hit = rayAABB(ox, oy, oz, dx, dy, dz, SCRATCH_BOX, maxT);
          if (hit && hit.t <= maxT) {
            return { t: hit.t, x: ox + dx * hit.t, y: oy + dy * hit.t, z: oz + dz * hit.t, nx: hit.nx, ny: hit.ny, nz: hit.nz };
          }
        } else if (dy < 0) {
          SCRATCH_BOX.minX = this.minXOf(cx);
          SCRATCH_BOX.maxX = SCRATCH_BOX.minX + this.cell;
          SCRATCH_BOX.minZ = this.minZOf(cz);
          SCRATCH_BOX.maxZ = SCRATCH_BOX.minZ + this.cell;
          SCRATCH_BOX.minY = -0.35;
          SCRATCH_BOX.maxY = 0;
          const hit = rayAABB(ox, oy, oz, dx, dy, dz, SCRATCH_BOX, maxT);
          if (hit && hit.t <= maxT) {
            return { t: hit.t, x: ox + dx * hit.t, y: oy + dy * hit.t, z: oz + dz * hit.t, nx: hit.nx, ny: hit.ny, nz: hit.nz };
          }
        }
      }

      // advance
      if (tMaxX < tMaxZ) {
        if (tMaxX > maxT) break;
        t = tMaxX;
        cx += stepX;
        tMaxX += tDeltaX;
      } else {
        if (tMaxZ > maxT) break;
        t = tMaxZ;
        cz += stepZ;
        tMaxZ += tDeltaZ;
      }
      if (!this.inBounds(cx, cz)) break;
    }
    return null;
  }

  /** Nearest walkable cell centre to an arbitrary world point (BFS ring search). */
  /**
   * Nearest walkable cell centre. Ring search widens until the whole grid is
   * covered, so a position parked in a far corner (or outside the bounds
   * entirely) still resolves instead of returning null.
   */
  nearestWalkable(x: number, z: number): { x: number; z: number } | null {
    const cx = Math.min(this.cols - 1, Math.max(0, this.cellX(x)));
    const cz = Math.min(this.rows - 1, Math.max(0, this.cellZ(z)));
    if (this.isWalkableCell(cx, cz)) return { x: this.centerX(cx), z: this.centerZ(cz) };
    const maxR = Math.max(this.cols, this.rows);
    for (let r = 1; r <= maxR; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          const nx = cx + dx, nz = cz + dz;
          if (this.isWalkableCell(nx, nz)) return { x: this.centerX(nx), z: this.centerZ(nz) };
        }
      }
    }
    return null;
  }

  // -- A* ------------------------------------------------------------------

  /**
   * 8-directional A* with corner-cut prevention.
   * Returns a list of world-space waypoints (excluding the start cell).
   */
  findPath(sx: number, sz: number, gx: number, gz: number, maxNodes = 12000): { x: number; z: number }[] {
    const start = this.nearestWalkable(sx, sz);
    const goal = this.nearestWalkable(gx, gz);
    if (!start || !goal) return [];

    const scx = this.cellX(start.x), scz = this.cellZ(start.z);
    const gcx = this.cellX(goal.x), gcz = this.cellZ(goal.z);
    const startI = this.idx(scx, scz);
    const goalI = this.idx(gcx, gcz);
    if (startI === goalI) return [{ x: goal.x, z: goal.z }];

    const stamp = ++this.currentStamp;
    const n = this.cols * this.rows;
    this.heap.setCapacity(n);
    this.heap.clear();

    this.stamp[startI] = stamp;
    this.gScore[startI] = 0;
    this.fScore[startI] = this.heuristic(scx, scz, gcx, gcz);
    this.cameFrom[startI] = -1;
    this.closed[startI] = 0;
    this.open[startI] = 1;
    this.heap.push(startI, this.fScore[startI] as number);

    let expanded = 0;
    let found = false;

    while (this.heap.size > 0) {
      const cur = this.heap.pop()!;
      if (this.stamp[cur] !== stamp) continue;
      if (cur === goalI) { found = true; break; }
      if (this.closed[cur] === 1 && this.stamp[cur] === stamp) continue;
      this.closed[cur] = 1;
      if (++expanded > maxNodes) break;

      const cx = cur % this.cols;
      const cz = (cur - cx) / this.cols;
      const g = this.gScore[cur] as number;

      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dz === 0) continue;
          const nx = cx + dx, nz = cz + dz;
          if (!this.isWalkableCell(nx, nz)) continue;
          if (dx !== 0 && dz !== 0) {
            // no cutting through wall corners
            if (!this.isWalkableCell(cx + dx, cz) || !this.isWalkableCell(cx, cz + dz)) continue;
          }
          const ni = this.idx(nx, nz);
          if (this.stamp[ni] === stamp && this.closed[ni] === 1) continue;
          const step = dx !== 0 && dz !== 0 ? 1.41421356 : 1;
          const ng = g + step;
          if (this.stamp[ni] !== stamp) {
            this.stamp[ni] = stamp;
            this.closed[ni] = 0;
            this.open[ni] = 1;
            this.gScore[ni] = ng;
            this.cameFrom[ni] = cur;
            this.fScore[ni] = ng + this.heuristic(nx, nz, gcx, gcz);
            this.heap.push(ni, this.fScore[ni] as number);
          } else if (ng < (this.gScore[ni] as number)) {
            this.gScore[ni] = ng;
            this.cameFrom[ni] = cur;
            this.fScore[ni] = ng + this.heuristic(nx, nz, gcx, gcz);
            this.heap.push(ni, this.fScore[ni] as number);
          }
        }
      }
    }

    if (!found) return [];

    // reconstruct
    const cells: number[] = [];
    let cur = goalI;
    let guard = 0;
    while (cur !== -1 && guard++ < 20000) {
      cells.push(cur);
      if (cur === startI) break;
      cur = this.cameFrom[cur] as number;
      if (this.stamp[cur] !== stamp) break;
    }
    cells.reverse();

    const pts: { x: number; z: number }[] = cells.map((i) => {
      const cx = i % this.cols;
      const cz = (i - cx) / this.cols;
      return { x: this.centerX(cx), z: this.centerZ(cz) };
    });
    if (pts.length > 0) {
      pts[pts.length - 1] = { x: goal.x, z: goal.z };
    }
    return this.simplify(pts, sx, sz);
  }

  private heuristic(cx: number, cz: number, gx: number, gz: number): number {
    const dx = Math.abs(cx - gx);
    const dz = Math.abs(cz - gz);
    // octile distance with a tiny tie-breaker for straighter paths
    return (dx + dz) + (1.41421356 - 2) * Math.min(dx, dz) + 0.001 * (dx + dz);
  }

  /** String pulling: drop waypoints we can walk straight past. */
  private simplify(pts: { x: number; z: number }[], sx: number, sz: number): { x: number; z: number }[] {
    if (pts.length <= 2) return pts;
    const out: { x: number; z: number }[] = [];
    let anchorX = sx, anchorZ = sz;
    let i = 0;
    while (i < pts.length) {
      let j = pts.length - 1;
      for (; j > i; j--) {
        if (this.clearLine(anchorX, anchorZ, pts[j]!.x, pts[j]!.z)) break;
      }
      if (j <= i) j = i;
      out.push({ x: pts[j]!.x, z: pts[j]!.z });
      anchorX = pts[j]!.x;
      anchorZ = pts[j]!.z;
      i = j + 1;
    }
    return out;
  }

  /** Cheap 2D walkability sweep used for path smoothing. */
  clearLine(x0: number, z0: number, x1: number, z1: number): boolean {
    const dx = x1 - x0, dz = z1 - z0;
    const len = Math.hypot(dx, dz);
    if (len < 1e-4) return true;
    const steps = Math.ceil(len / (this.cell * 0.4));
    const radius = 0.42;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const px = x0 + dx * t;
      const pz = z0 + dz * t;
      // sample a small disc so we never squeeze through a diagonal crack
      if (!this.isWalkableAt(px, pz)) return false;
      if (!this.isWalkableAt(px + radius, pz)) return false;
      if (!this.isWalkableAt(px - radius, pz)) return false;
      if (!this.isWalkableAt(px, pz + radius)) return false;
      if (!this.isWalkableAt(px, pz - radius)) return false;
    }
    return true;
  }

  /** Flood-fill connectivity check (used by the map verification script). */
  reachableFrom(x: number, z: number): Uint8Array {
    const start = this.nearestWalkable(x, z);
    const seen = new Uint8Array(this.cols * this.rows);
    if (!start) return seen;
    const queue: number[] = [];
    const si = this.idx(this.cellX(start.x), this.cellZ(start.z));
    seen[si] = 1;
    queue.push(si);
    let head = 0;
    while (head < queue.length) {
      const cur = queue[head++];
      const cx = cur % this.cols;
      const cz = (cur - cx) / this.cols;
      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dz === 0) continue;
          const nx = cx + dx, nz = cz + dz;
          if (!this.isWalkableCell(nx, nz)) continue;
          if (dx !== 0 && dz !== 0) {
            if (!this.isWalkableCell(cx + dx, cz) || !this.isWalkableCell(cx, cz + dz)) continue;
          }
          const ni = this.idx(nx, nz);
          if (seen[ni]) continue;
          seen[ni] = 1;
          queue.push(ni);
        }
      }
    }
    return seen;
  }
}

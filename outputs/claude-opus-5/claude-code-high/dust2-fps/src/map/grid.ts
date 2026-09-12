import { clamp } from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';

/**
 * A walkable floor patch. Everything the map is made of.
 * Coordinates are world metres, `x1<x2`, `z1<z2`, aligned to the 1 m cell grid.
 * If `ramp` is present the floor height is interpolated along that axis, which
 * is how the elevated A site / catwalk / B platform are reached.
 */
export interface FloorRect {
  name: string;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  /** Flat height (ignored when `ramp` is set). */
  h?: number;
  ramp?: { axis: 'x' | 'z'; from: number; to: number };
}

/** Subtractive brush: carves solid geometry back into a floor patch (door frames, pillars). */
export interface BlockRect {
  name: string;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
}

export interface GridRect {
  i0: number;
  j0: number;
  i1: number;
  j1: number;
  key: number;
}

export interface RayHit {
  hit: boolean;
  dist: number;
  point: Vec3;
  normal: Vec3;
}

export const CELL = 1;
export const WALL_HEIGHT = 5;
/** Vertical difference an actor can walk up without jumping. */
export const STEP_HEIGHT = 0.75;

/**
 * Uniform 1 m grid describing the whole level.
 *
 * Storing the map as a grid rather than as a soup of brushes buys three things
 * at once: watertight collision (no gaps between hand-placed walls), a free
 * navigation mesh for the bots, and an exact DDA raycast for bullets & vision.
 */
export class WorldGrid {
  readonly minX: number;
  readonly minZ: number;
  readonly nx: number;
  readonly nz: number;
  readonly solid: Uint8Array;
  readonly floor: Float32Array;

  constructor(minX: number, minZ: number, maxX: number, maxZ: number) {
    this.minX = minX;
    this.minZ = minZ;
    this.nx = Math.ceil((maxX - minX) / CELL);
    this.nz = Math.ceil((maxZ - minZ) / CELL);
    this.solid = new Uint8Array(this.nx * this.nz).fill(1);
    this.floor = new Float32Array(this.nx * this.nz);
  }

  get maxX(): number {
    return this.minX + this.nx * CELL;
  }

  get maxZ(): number {
    return this.minZ + this.nz * CELL;
  }

  idx(i: number, j: number): number {
    return j * this.nx + i;
  }

  cellX(x: number): number {
    return Math.floor((x - this.minX) / CELL);
  }

  cellZ(z: number): number {
    return Math.floor((z - this.minZ) / CELL);
  }

  cellCenterX(i: number): number {
    return this.minX + (i + 0.5) * CELL;
  }

  cellCenterZ(j: number): number {
    return this.minZ + (j + 0.5) * CELL;
  }

  inBounds(i: number, j: number): boolean {
    return i >= 0 && j >= 0 && i < this.nx && j < this.nz;
  }

  isSolidCell(i: number, j: number): boolean {
    if (!this.inBounds(i, j)) return true;
    return this.solid[this.idx(i, j)] === 1;
  }

  isOpenCell(i: number, j: number): boolean {
    return !this.isSolidCell(i, j);
  }

  floorCell(i: number, j: number): number {
    if (!this.inBounds(i, j)) return 0;
    return this.floor[this.idx(i, j)];
  }

  isSolidAt(x: number, z: number): boolean {
    return this.isSolidCell(this.cellX(x), this.cellZ(z));
  }

  /** Carve the walkable patches, then re-apply the subtractive brushes. */
  carve(rects: readonly FloorRect[], blocks: readonly BlockRect[] = []): void {
    for (const r of rects) {
      const i0 = clamp(this.cellX(r.x1), 0, this.nx - 1);
      const i1 = clamp(this.cellX(r.x2 - 1e-6), 0, this.nx - 1);
      const j0 = clamp(this.cellZ(r.z1), 0, this.nz - 1);
      const j1 = clamp(this.cellZ(r.z2 - 1e-6), 0, this.nz - 1);
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const k = this.idx(i, j);
          this.solid[k] = 0;
          this.floor[k] = this.heightAtRect(r, this.cellCenterX(i), this.cellCenterZ(j));
        }
      }
    }
    for (const b of blocks) {
      const i0 = clamp(this.cellX(b.x1), 0, this.nx - 1);
      const i1 = clamp(this.cellX(b.x2 - 1e-6), 0, this.nx - 1);
      const j0 = clamp(this.cellZ(b.z1), 0, this.nz - 1);
      const j1 = clamp(this.cellZ(b.z2 - 1e-6), 0, this.nz - 1);
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) this.solid[this.idx(i, j)] = 1;
      }
    }
  }

  private heightAtRect(r: FloorRect, x: number, z: number): number {
    if (!r.ramp) return r.h ?? 0;
    const { axis, from, to } = r.ramp;
    const t =
      axis === 'x'
        ? (x - r.x1) / Math.max(1e-6, r.x2 - r.x1)
        : (z - r.z1) / Math.max(1e-6, r.z2 - r.z1);
    return from + (to - from) * clamp(t, 0, 1);
  }

  /**
   * Continuous floor height, bilinearly filtered so ramps feel like slopes
   * instead of 1 m stairs. Solid neighbours fall back to the sample cell so an
   * actor hugging a wall never gets sucked into it.
   */
  floorAt(x: number, z: number): number {
    const fx = (x - this.minX) / CELL - 0.5;
    const fz = (z - this.minZ) / CELL - 0.5;
    const i = Math.floor(fx);
    const j = Math.floor(fz);
    const tx = fx - i;
    const tz = fz - j;
    const base = this.sampleFloor(i, j, i, j);
    const h00 = this.sampleFloorOr(i, j, base);
    const h10 = this.sampleFloorOr(i + 1, j, base);
    const h01 = this.sampleFloorOr(i, j + 1, base);
    const h11 = this.sampleFloorOr(i + 1, j + 1, base);
    const a = h00 + (h10 - h00) * tx;
    const b = h01 + (h11 - h01) * tx;
    return a + (b - a) * tz;
  }

  private sampleFloor(i: number, j: number, fi: number, fj: number): number {
    if (this.inBounds(i, j) && this.solid[this.idx(i, j)] === 0) return this.floor[this.idx(i, j)];
    // Nearest open cell in the 3x3 neighbourhood, else 0.
    for (let dj = -1; dj <= 1; dj++) {
      for (let di = -1; di <= 1; di++) {
        const ni = fi + di;
        const nj = fj + dj;
        if (this.inBounds(ni, nj) && this.solid[this.idx(ni, nj)] === 0) {
          return this.floor[this.idx(ni, nj)];
        }
      }
    }
    return 0;
  }

  private sampleFloorOr(i: number, j: number, fallback: number): number {
    if (this.inBounds(i, j) && this.solid[this.idx(i, j)] === 0) return this.floor[this.idx(i, j)];
    return fallback;
  }

  /** Can an actor whose feet are at `fromY` occupy the cell containing (x,z)? */
  canOccupy(x: number, z: number, fromY: number): boolean {
    const i = this.cellX(x);
    const j = this.cellZ(z);
    if (this.isSolidCell(i, j)) return false;
    const h = this.floorCell(i, j);
    return h - fromY <= STEP_HEIGHT + 0.01;
  }

  /**
   * DDA raycast against walls and floor steps in the XZ plane.
   * Returns the first blocking surface within `maxDist`.
   */
  raycast(origin: Vec3, dir: Vec3, maxDist: number): RayHit {
    const miss: RayHit = {
      hit: false,
      dist: maxDist,
      point: {
        x: origin.x + dir.x * maxDist,
        y: origin.y + dir.y * maxDist,
        z: origin.z + dir.z * maxDist,
      },
      normal: { x: 0, y: 1, z: 0 },
    };

    let i = this.cellX(origin.x);
    let j = this.cellZ(origin.z);
    if (!this.inBounds(i, j)) return miss;

    const dx = dir.x;
    const dz = dir.z;
    const stepI = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    const stepJ = dz > 0 ? 1 : dz < 0 ? -1 : 0;
    const invDx = dx !== 0 ? 1 / Math.abs(dx) : Infinity;
    const invDz = dz !== 0 ? 1 / Math.abs(dz) : Infinity;

    const cellMinX = this.minX + i * CELL;
    const cellMinZ = this.minZ + j * CELL;
    let tMaxX =
      stepI > 0 ? (cellMinX + CELL - origin.x) * invDx : stepI < 0 ? (origin.x - cellMinX) * invDx : Infinity;
    let tMaxZ =
      stepJ > 0 ? (cellMinZ + CELL - origin.z) * invDz : stepJ < 0 ? (origin.z - cellMinZ) * invDz : Infinity;
    const tDeltaX = CELL * invDx;
    const tDeltaZ = CELL * invDz;

    // The starting cell's own floor can already block a downward ray.
    let t = 0;
    let guard = 0;
    while (t <= maxDist && guard++ < 4096) {
      const yAt = origin.y + dir.y * t;
      const h = this.floorCell(i, j);
      if (yAt < h - 0.02 && !this.isSolidCell(i, j)) {
        // Ray dipped below this cell's floor: solve the exact crossing.
        const tHit = dir.y !== 0 ? (h - origin.y) / dir.y : t;
        const tc = clamp(tHit, 0, maxDist);
        return {
          hit: true,
          dist: tc,
          point: { x: origin.x + dir.x * tc, y: h, z: origin.z + dir.z * tc },
          normal: { x: 0, y: 1, z: 0 },
        };
      }

      let axis: 'x' | 'z';
      if (tMaxX < tMaxZ) {
        t = tMaxX;
        tMaxX += tDeltaX;
        i += stepI;
        axis = 'x';
      } else {
        t = tMaxZ;
        tMaxZ += tDeltaZ;
        j += stepJ;
        axis = 'z';
      }
      if (t > maxDist) break;

      const yEnter = origin.y + dir.y * t;
      const solidHere = this.isSolidCell(i, j);
      const floorHere = this.floorCell(i, j);
      const blocked = solidHere ? yEnter < WALL_HEIGHT : yEnter < floorHere - 0.02;
      if (blocked) {
        return {
          hit: true,
          dist: t,
          point: { x: origin.x + dir.x * t, y: yEnter, z: origin.z + dir.z * t },
          normal:
            axis === 'x'
              ? { x: -stepI, y: 0, z: 0 }
              : { x: 0, y: 0, z: -stepJ },
        };
      }
      if (!this.inBounds(i, j)) break;
    }
    return miss;
  }

  /** Flood fill from a cell; returns the reachable-cell mask (used by the map tests). */
  floodFill(startX: number, startZ: number): Uint8Array {
    const seen = new Uint8Array(this.nx * this.nz);
    const si = this.cellX(startX);
    const sj = this.cellZ(startZ);
    if (this.isSolidCell(si, sj)) return seen;
    const queue: number[] = [this.idx(si, sj)];
    seen[queue[0]] = 1;
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    while (queue.length) {
      const k = queue.pop()!;
      const i = k % this.nx;
      const j = (k - i) / this.nx;
      const h = this.floor[k];
      for (const [di, dj] of dirs) {
        const ni = i + di;
        const nj = j + dj;
        if (!this.inBounds(ni, nj)) continue;
        const nk = this.idx(ni, nj);
        if (seen[nk] || this.solid[nk]) continue;
        if (Math.abs(this.floor[nk] - h) > STEP_HEIGHT) continue;
        seen[nk] = 1;
        queue.push(nk);
      }
    }
    return seen;
  }

  /**
   * Greedy meshing: merge equal-keyed cells into the largest possible rectangles
   * so the whole level renders as a couple of instanced draw calls.
   */
  greedyRects(key: (i: number, j: number) => number | null): GridRect[] {
    const used = new Uint8Array(this.nx * this.nz);
    const out: GridRect[] = [];
    for (let j = 0; j < this.nz; j++) {
      for (let i = 0; i < this.nx; i++) {
        const k = this.idx(i, j);
        if (used[k]) continue;
        const kv = key(i, j);
        if (kv === null) continue;
        let i1 = i;
        while (i1 + 1 < this.nx && !used[this.idx(i1 + 1, j)] && key(i1 + 1, j) === kv) i1++;
        let j1 = j;
        outer: while (j1 + 1 < this.nz) {
          for (let ii = i; ii <= i1; ii++) {
            if (used[this.idx(ii, j1 + 1)] || key(ii, j1 + 1) !== kv) break outer;
          }
          j1++;
        }
        for (let jj = j; jj <= j1; jj++) {
          for (let ii = i; ii <= i1; ii++) used[this.idx(ii, jj)] = 1;
        }
        out.push({ i0: i, j0: j, i1, j1, key: kv });
      }
    }
    return out;
  }

  /** Floor slabs, quantised by height so equal-height areas merge. */
  floorRects(): GridRect[] {
    return this.greedyRects((i, j) => {
      const k = this.idx(i, j);
      if (this.solid[k]) return null;
      return Math.round(this.floor[k] * 20);
    });
  }

  /**
   * Wall blocks: only solid cells touching open space become geometry, so the
   * huge solid regions outside the playable area cost nothing.
   */
  wallRects(): GridRect[] {
    const touching = (i: number, j: number): boolean => {
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          if (di === 0 && dj === 0) continue;
          if (this.inBounds(i + di, j + dj) && this.solid[this.idx(i + di, j + dj)] === 0) return true;
        }
      }
      return false;
    };
    return this.greedyRects((i, j) => {
      const k = this.idx(i, j);
      if (!this.solid[k]) return null;
      if (!touching(i, j)) return null;
      // Key by the neighbouring floor height so wall bases sit on the right level.
      let base = 0;
      let found = false;
      for (let dj = -1; dj <= 1 && !found; dj++) {
        for (let di = -1; di <= 1 && !found; di++) {
          const ni = i + di;
          const nj = j + dj;
          if (this.inBounds(ni, nj) && this.solid[this.idx(ni, nj)] === 0) {
            base = this.floor[this.idx(ni, nj)];
            found = true;
          }
        }
      }
      return Math.round(base * 4);
    });
  }
}

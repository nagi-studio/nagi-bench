// Map description format + a grid "painter" used to author the level procedurally.
//
// The level is authored on a 1m grid. Every cell is either void (solid rock / building mass)
// or walkable floor with a height. Walls are generated automatically around walkable space,
// which guarantees that there are no gaps a player or bot can slip through.

import type { Team, SiteId } from '../types';
import { hash2, type V2 } from '../math';

export type MatKind = 'wall' | 'platform' | 'crate' | 'crateDark' | 'door' | 'metal' | 'ceiling' | 'lintel';

export interface Box {
  id: number;
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  mat: MatKind;
}

export interface Rect {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

export interface Ramp extends Rect {
  axis: 'x' | 'z';
  /** height at the min edge of `axis` */
  h0: number;
  /** height at the max edge of `axis` */
  h1: number;
  kind: number;
}

export interface FloorQuad extends Rect {
  h: number;
  kind: number;
}

export interface HoldSpot {
  name: string;
  pos: V2;
  look: V2;
  site: SiteId | 'MID';
}

export interface Route {
  site: SiteId;
  points: string[];
}

export interface Callout {
  name: string;
  rect: Rect;
}

export interface MapData {
  W: number;
  D: number;
  /** floor height per cell, NaN = void */
  height: Float32Array;
  kind: Uint8Array;
  rampId: Int16Array;
  ramps: Ramp[];
  boxes: Box[];
  floorQuads: FloorQuad[];
  sites: Record<SiteId, Rect>;
  spawns: Record<Team, V2[]>;
  waypoints: Record<string, V2>;
  routes: Record<string, Route>;
  plantSpots: Record<SiteId, V2[]>;
  holdSpots: HoldSpot[];
  callouts: Callout[];
  labels: { text: string; pos: V2 }[];
}

export const FLOOR = {
  SAND: 0,
  STONE: 1,
  CONCRETE: 2,
  TILE: 3,
} as const;

export function rectContains(r: Rect, x: number, z: number, pad = 0): boolean {
  return x >= r.x0 - pad && x <= r.x1 + pad && z >= r.z0 - pad && z <= r.z1 + pad;
}

export function rampHeightAt(r: Ramp, x: number, z: number): number {
  const t = r.axis === 'x' ? (x - r.x0) / (r.x1 - r.x0) : (z - r.z0) / (r.z1 - r.z0);
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return r.h0 + (r.h1 - r.h0) * c;
}

interface GreedyRect {
  i0: number;
  j0: number;
  i1: number; // exclusive
  j1: number; // exclusive
  key: number;
}

/** Greedy rectangle decomposition of a boolean mask with optional merge key. */
export function greedyRects(
  W: number,
  D: number,
  mask: (i: number, j: number) => boolean,
  key: (i: number, j: number) => number = () => 0,
): GreedyRect[] {
  const used = new Uint8Array(W * D);
  const out: GreedyRect[] = [];
  const ok = (i: number, j: number, k: number) => !used[j * W + i] && mask(i, j) && key(i, j) === k;
  for (let j = 0; j < D; j++) {
    for (let i = 0; i < W; i++) {
      if (used[j * W + i] || !mask(i, j)) continue;
      const k = key(i, j);
      let w = 1;
      while (i + w < W && ok(i + w, j, k)) w++;
      let h = 1;
      outer: while (j + h < D) {
        for (let x = i; x < i + w; x++) if (!ok(x, j + h, k)) break outer;
        h++;
      }
      for (let y = j; y < j + h; y++) for (let x = i; x < i + w; x++) used[y * W + x] = 1;
      out.push({ i0: i, j0: j, i1: i + w, j1: j + h, key: k });
    }
  }
  return out;
}

interface PendingCrate {
  rect: Rect;
  h: number;
  mat: MatKind;
  y0?: number;
}

export class MapBuilder {
  readonly W: number;
  readonly D: number;
  readonly height: Float32Array;
  readonly kind: Uint8Array;
  readonly rampId: Int16Array;
  readonly ramps: Ramp[] = [];
  private boxes: Box[] = [];
  private crates: PendingCrate[] = [];

  constructor(W: number, D: number) {
    this.W = W;
    this.D = D;
    this.height = new Float32Array(W * D).fill(NaN);
    this.kind = new Uint8Array(W * D);
    this.rampId = new Int16Array(W * D).fill(-1);
  }

  private forCells(x0: number, z0: number, x1: number, z1: number, fn: (idx: number, i: number, j: number) => void) {
    for (let j = Math.max(0, z0); j < Math.min(this.D, z1); j++)
      for (let i = Math.max(0, x0); i < Math.min(this.W, x1); i++) fn(j * this.W + i, i, j);
  }

  floor(x0: number, z0: number, x1: number, z1: number, h: number, kind: number = FLOOR.SAND): this {
    this.forCells(x0, z0, x1, z1, (idx) => {
      this.height[idx] = h;
      this.kind[idx] = kind;
      this.rampId[idx] = -1;
    });
    return this;
  }

  ramp(x0: number, z0: number, x1: number, z1: number, axis: 'x' | 'z', h0: number, h1: number, kind: number = FLOOR.SAND): this {
    const r: Ramp = { x0, z0, x1, z1, axis, h0, h1, kind };
    const id = this.ramps.length;
    this.ramps.push(r);
    this.forCells(x0, z0, x1, z1, (idx, i, j) => {
      this.height[idx] = rampHeightAt(r, i + 0.5, j + 0.5);
      this.kind[idx] = kind;
      this.rampId[idx] = id;
    });
    return this;
  }

  carve(x0: number, z0: number, x1: number, z1: number): this {
    this.forCells(x0, z0, x1, z1, (idx) => {
      this.height[idx] = NaN;
      this.rampId[idx] = -1;
    });
    return this;
  }

  /** A crate / obstacle that sits on the floor (base height sampled at its center). */
  crate(x0: number, z0: number, x1: number, z1: number, h: number, mat: MatKind = 'crate', y0?: number): this {
    this.crates.push({ rect: { x0, z0, x1, z1 }, h, mat, y0 });
    return this;
  }

  box(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number, mat: MatKind): this {
    this.boxes.push({ id: 0, minX, minY, minZ, maxX, maxY, maxZ, mat });
    return this;
  }

  cellHeight(x: number, z: number): number {
    const i = Math.floor(x);
    const j = Math.floor(z);
    if (i < 0 || j < 0 || i >= this.W || j >= this.D) return NaN;
    const idx = j * this.W + i;
    const rid = this.rampId[idx];
    if (rid >= 0) return rampHeightAt(this.ramps[rid], x, z);
    return this.height[idx];
  }

  finish(meta: Omit<MapData, 'W' | 'D' | 'height' | 'kind' | 'rampId' | 'ramps' | 'boxes' | 'floorQuads'>): MapData {
    const { W, D, height } = this;
    const walk = (i: number, j: number) => i >= 0 && j >= 0 && i < W && j < D && !Number.isNaN(height[j * W + i]);

    // Distance (chebyshev, capped) from walkable space for void cells -> thick walls.
    const WALL_THICK = 3;
    const near = new Uint8Array(W * D);
    for (let j = 0; j < D; j++)
      for (let i = 0; i < W; i++) {
        if (walk(i, j)) continue;
        let found = false;
        for (let dj = -WALL_THICK; dj <= WALL_THICK && !found; dj++)
          for (let di = -WALL_THICK; di <= WALL_THICK; di++)
            if (walk(i + di, j + dj)) {
              found = true;
              break;
            }
        if (found) near[j * W + i] = 1;
      }

    const boxes: Box[] = [];
    // 1. Walls
    for (const r of greedyRects(W, D, (i, j) => near[j * W + i] === 1)) {
      const hv = hash2(r.i0 * 3 + r.j1, r.j0 * 7 + r.i1);
      const top = 6.6 + Math.floor(hv * 3) * 0.9;
      boxes.push({ id: 0, minX: r.i0, minY: -0.5, minZ: r.j0, maxX: r.i1, maxY: top, maxZ: r.j1, mat: 'wall' });
    }
    // 2. Raised flat platforms (non-ramp floor above 0)
    const flatKey = (i: number, j: number) => Math.round(height[j * W + i] * 100);
    for (const r of greedyRects(
      W,
      D,
      (i, j) => walk(i, j) && this.rampId[j * W + i] < 0 && height[j * W + i] > 0.01,
      flatKey,
    )) {
      boxes.push({ id: 0, minX: r.i0, minY: -0.5, minZ: r.j0, maxX: r.i1, maxY: r.key / 100, maxZ: r.j1, mat: 'platform' });
    }
    // 3. Crates
    for (const c of this.crates) {
      const cx = (c.rect.x0 + c.rect.x1) / 2;
      const cz = (c.rect.z0 + c.rect.z1) / 2;
      const base = c.y0 ?? (Number.isNaN(this.cellHeight(cx, cz)) ? 0 : this.cellHeight(cx, cz));
      boxes.push({ id: 0, minX: c.rect.x0, minY: base, minZ: c.rect.z0, maxX: c.rect.x1, maxY: base + c.h, maxZ: c.rect.z1, mat: c.mat });
    }
    // 4. Explicit boxes
    boxes.push(...this.boxes);
    boxes.forEach((b, i) => (b.id = i));

    // Floor quads for rendering (flat cells merged by height + material)
    const floorQuads: FloorQuad[] = [];
    for (const r of greedyRects(
      W,
      D,
      (i, j) => walk(i, j) && this.rampId[j * W + i] < 0,
      (i, j) => Math.round(height[j * W + i] * 100) * 16 + this.kind[j * W + i],
    )) {
      floorQuads.push({ x0: r.i0, z0: r.j0, x1: r.i1, z1: r.j1, h: Math.floor(r.key / 16) / 100, kind: r.key % 16 });
    }

    return {
      W,
      D,
      height: this.height,
      kind: this.kind,
      rampId: this.rampId,
      ramps: this.ramps,
      boxes,
      floorQuads,
      ...meta,
    };
  }
}

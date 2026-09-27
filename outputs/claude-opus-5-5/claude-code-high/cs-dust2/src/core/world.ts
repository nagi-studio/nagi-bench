// Static world: builds the walkable grid, the merged wall solids and exposes
// floor-height, collision and ray queries. Pure TS (no rendering).

import { AREAS, MAP_BOUNDS, PROPS, WALL_TOP } from './mapData.ts';
import type { Area, PropKind, RegionId } from './mapData.ts';
import { makeRng } from './math.ts';

export type SolidKind = PropKind | 'wall';

export interface Solid {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  kind: SolidKind;
}

export interface RayHit {
  t: number;
  nx: number;
  ny: number;
  nz: number;
  kind: SolidKind | 'floor';
}

export const CELL = 1; // wall grid resolution (meters)
const BROAD = 4; // broadphase cell size

export class World {
  readonly areas: Area[] = AREAS;
  readonly solids: Solid[] = [];
  readonly gx0 = MAP_BOUNDS.x0;
  readonly gz0 = MAP_BOUNDS.z0;
  readonly gw: number;
  readonly gh: number;
  /** 1 = walkable cell (inside an area) on the 1m grid */
  readonly open: Uint8Array;

  private broad: Map<number, number[]> = new Map();
  private stamp: Uint32Array;
  private stampId = 1;

  constructor() {
    this.gw = Math.round((MAP_BOUNDS.x1 - MAP_BOUNDS.x0) / CELL);
    this.gh = Math.round((MAP_BOUNDS.z1 - MAP_BOUNDS.z0) / CELL);
    this.open = new Uint8Array(this.gw * this.gh);
    for (let j = 0; j < this.gh; j++) {
      for (let i = 0; i < this.gw; i++) {
        const cx = this.gx0 + (i + 0.5) * CELL;
        const cz = this.gz0 + (j + 0.5) * CELL;
        if (this.areaAt(cx, cz)) this.open[j * this.gw + i] = 1;
      }
    }
    this.buildWalls();
    this.buildProps();
    this.stamp = new Uint32Array(this.solids.length);
    this.buildBroadphase();
  }

  // ---------------------------------------------------------------- building
  private buildWalls() {
    const used = new Uint8Array(this.gw * this.gh);
    const rng = makeRng(1337);
    const solidAt = (i: number, j: number) => this.open[j * this.gw + i] === 0 && used[j * this.gw + i] === 0;
    for (let j = 0; j < this.gh; j++) {
      for (let i = 0; i < this.gw; i++) {
        if (!solidAt(i, j)) continue;
        // greedy extend in x
        let w = 1;
        while (i + w < this.gw && solidAt(i + w, j) && w < 24) w++;
        // extend in z while the whole span is solid
        let h = 1;
        outer: while (j + h < this.gh && h < 24) {
          for (let k = 0; k < w; k++) if (!solidAt(i + k, j + h)) break outer;
          h++;
        }
        for (let jj = 0; jj < h; jj++) for (let ii = 0; ii < w; ii++) used[(j + jj) * this.gw + i + ii] = 1;
        const top = WALL_TOP + Math.floor(rng() * 4) * 0.8;
        this.solids.push({
          minX: this.gx0 + i * CELL,
          maxX: this.gx0 + (i + w) * CELL,
          minZ: this.gz0 + j * CELL,
          maxZ: this.gz0 + (j + h) * CELL,
          minY: -3,
          maxY: top,
          kind: 'wall',
        });
      }
    }
  }

  private buildProps() {
    for (const p of PROPS) {
      const cx = (p.x0 + p.x1) / 2;
      const cz = (p.z0 + p.z1) / 2;
      const base = p.y0 !== undefined ? p.y0 : this.floorAt(cx, cz) ?? 0;
      this.solids.push({ minX: p.x0, maxX: p.x1, minZ: p.z0, maxZ: p.z1, minY: base, maxY: base + p.h, kind: p.kind });
    }
  }

  private bkey(i: number, j: number) {
    return (i + 1000) * 4096 + (j + 1000);
  }

  private buildBroadphase() {
    this.solids.forEach((s, idx) => {
      const i0 = Math.floor(s.minX / BROAD);
      const i1 = Math.floor(s.maxX / BROAD);
      const j0 = Math.floor(s.minZ / BROAD);
      const j1 = Math.floor(s.maxZ / BROAD);
      for (let i = i0; i <= i1; i++)
        for (let j = j0; j <= j1; j++) {
          const k = this.bkey(i, j);
          let list = this.broad.get(k);
          if (!list) this.broad.set(k, (list = []));
          list.push(idx);
        }
    });
  }

  /** Solids whose XZ footprint may overlap the given rectangle. */
  querySolids(minX: number, minZ: number, maxX: number, maxZ: number, out: Solid[] = []): Solid[] {
    out.length = 0;
    const id = ++this.stampId;
    const i0 = Math.floor(minX / BROAD);
    const i1 = Math.floor(maxX / BROAD);
    const j0 = Math.floor(minZ / BROAD);
    const j1 = Math.floor(maxZ / BROAD);
    for (let i = i0; i <= i1; i++)
      for (let j = j0; j <= j1; j++) {
        const list = this.broad.get(this.bkey(i, j));
        if (!list) continue;
        for (const idx of list) {
          if (this.stamp[idx] === id) continue;
          this.stamp[idx] = id;
          out.push(this.solids[idx]);
        }
      }
    return out;
  }

  // ---------------------------------------------------------------- queries
  areaAt(x: number, z: number): Area | null {
    let best: Area | null = null;
    let bestH = -Infinity;
    for (const a of this.areas) {
      if (x < a.x0 || x > a.x1 || z < a.z0 || z > a.z1) continue;
      const h = areaHeight(a, x, z);
      if (h > bestH) {
        bestH = h;
        best = a;
      }
    }
    return best;
  }

  floorAt(x: number, z: number): number | null {
    const a = this.areaAt(x, z);
    return a ? areaHeight(a, x, z) : null;
  }

  regionAt(x: number, z: number): RegionId | null {
    const a = this.areaAt(x, z);
    return a ? a.region : null;
  }

  isOpenCell(i: number, j: number) {
    if (i < 0 || j < 0 || i >= this.gw || j >= this.gh) return false;
    return this.open[j * this.gw + i] === 1;
  }

  /** Ray vs every solid and walkable floor. dir must be normalized. */
  raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxT: number): RayHit | null {
    let best: RayHit | null = null;
    let bestT = maxT;
    const inv = (v: number) => (Math.abs(v) < 1e-9 ? (v >= 0 ? 1e9 : -1e9) : 1 / v);
    const ix = inv(dx);
    const iy = inv(dy);
    const iz = inv(dz);
    for (const s of this.solids) {
      let t1 = (s.minX - ox) * ix;
      let t2 = (s.maxX - ox) * ix;
      let tmin = Math.min(t1, t2);
      let tmax = Math.max(t1, t2);
      let axis = 0;
      t1 = (s.minY - oy) * iy;
      t2 = (s.maxY - oy) * iy;
      let a = Math.min(t1, t2);
      if (a > tmin) {
        tmin = a;
        axis = 1;
      }
      tmax = Math.min(tmax, Math.max(t1, t2));
      t1 = (s.minZ - oz) * iz;
      t2 = (s.maxZ - oz) * iz;
      a = Math.min(t1, t2);
      if (a > tmin) {
        tmin = a;
        axis = 2;
      }
      tmax = Math.min(tmax, Math.max(t1, t2));
      if (tmax < 0 || tmin > tmax || tmin > bestT) continue;
      if (tmin < 0) continue; // origin inside solid: ignore (spawned inside prop edge)
      bestT = tmin;
      best = {
        t: tmin,
        nx: axis === 0 ? -Math.sign(dx) : 0,
        ny: axis === 1 ? -Math.sign(dy) : 0,
        nz: axis === 2 ? -Math.sign(dz) : 0,
        kind: s.kind,
      };
    }
    // floors
    if (dy < 0) {
      for (const ar of this.areas) {
        let t: number;
        let nx = 0;
        let ny = 1;
        let nz = 0;
        if (!ar.ramp) {
          t = (ar.h - oy) / dy;
        } else {
          const span = ar.ramp.axis === 'x' ? ar.x1 - ar.x0 : ar.z1 - ar.z0;
          const slope = (ar.ramp.hMax - ar.ramp.hMin) / span;
          const oc = ar.ramp.axis === 'x' ? ox - ar.x0 : oz - ar.z0;
          const dc = ar.ramp.axis === 'x' ? dx : dz;
          const denom = dy - slope * dc;
          if (Math.abs(denom) < 1e-9) continue;
          t = (ar.ramp.hMin + slope * oc - oy) / denom;
          const nl = Math.hypot(slope, 1);
          if (ar.ramp.axis === 'x') nx = -slope / nl;
          else nz = -slope / nl;
          ny = 1 / nl;
        }
        if (t < 0 || t > bestT) continue;
        const px = ox + dx * t;
        const pz = oz + dz * t;
        if (px < ar.x0 || px > ar.x1 || pz < ar.z0 || pz > ar.z1) continue;
        bestT = t;
        best = { t, nx, ny, nz, kind: 'floor' };
      }
    }
    return best;
  }

  lineOfSight(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean {
    const dx = bx - ax;
    const dy = by - ay;
    const dz = bz - az;
    const d = Math.hypot(dx, dy, dz);
    if (d < 1e-6) return true;
    return this.raycast(ax, ay, az, dx / d, dy / d, dz / d, d - 0.05) === null;
  }
}

export function areaHeight(a: Area, x: number, z: number): number {
  if (!a.ramp) return a.h;
  const t =
    a.ramp.axis === 'x' ? (x - a.x0) / (a.x1 - a.x0) : (z - a.z0) / (a.z1 - a.z0);
  const tc = t < 0 ? 0 : t > 1 ? 1 : t;
  return a.ramp.hMin + (a.ramp.hMax - a.ramp.hMin) * tc;
}

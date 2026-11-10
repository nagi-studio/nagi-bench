// Axis-aligned collision world: static boxes in a uniform XZ hash grid, a "collide and slide"
// character mover with stair stepping, and slab-method ray casts for bullets and line of sight.

import { Vec3 } from './math';
import { F_MOVE, F_RAY, MapBox } from './map';

export interface Body {
  pos: Vec3; // feet position
  vel: Vec3;
  onGround: boolean;
  hw: number; // half width
  height: number;
}

export interface RayHit {
  t: number;
  box: number;
  nx: number;
  ny: number;
  nz: number;
}

const GRID = 4;
const EPS = 1e-4;
export const STEP_HEIGHT = 0.46;
export const GRAVITY = 18;

export class CollisionWorld {
  readonly n: number;
  /** minX,minY,minZ,maxX,maxY,maxZ per box */
  readonly b: Float64Array;
  readonly flags: Uint8Array;
  private gx0: number;
  private gz0: number;
  private gcols: number;
  private grows: number;
  private cellsIdx: number[][];
  private stamp: Uint32Array;
  private stampId = 1;
  private scratch: number[] = [];

  constructor(boxes: MapBox[], minX: number, minZ: number, maxX: number, maxZ: number) {
    // The ground is one huge slab so every query treats it like any other box.
    const all: MapBox[] = [
      { min: { x: minX - 100, y: -6, z: minZ - 100 }, max: { x: maxX + 100, y: 0, z: maxZ + 100 }, mat: 'ground', flags: F_MOVE | F_RAY },
      ...boxes,
    ];
    this.n = all.length;
    this.b = new Float64Array(this.n * 6);
    this.flags = new Uint8Array(this.n);
    this.gx0 = minX - 4;
    this.gz0 = minZ - 4;
    this.gcols = Math.ceil((maxX - minX + 8) / GRID);
    this.grows = Math.ceil((maxZ - minZ + 8) / GRID);
    this.cellsIdx = [];
    for (let i = 0; i < this.gcols * this.grows; i++) this.cellsIdx.push([]);
    this.stamp = new Uint32Array(this.n);
    for (let i = 0; i < this.n; i++) {
      const bx = all[i];
      const o = i * 6;
      this.b[o] = bx.min.x;
      this.b[o + 1] = bx.min.y;
      this.b[o + 2] = bx.min.z;
      this.b[o + 3] = bx.max.x;
      this.b[o + 4] = bx.max.y;
      this.b[o + 5] = bx.max.z;
      this.flags[i] = bx.flags;
      const c0 = this.cx(bx.min.x);
      const c1 = this.cx(bx.max.x);
      const r0 = this.cz(bx.min.z);
      const r1 = this.cz(bx.max.z);
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) this.cellsIdx[r * this.gcols + c].push(i);
    }
  }

  private cx(x: number): number {
    const c = Math.floor((x - this.gx0) / GRID);
    return c < 0 ? 0 : c >= this.gcols ? this.gcols - 1 : c;
  }
  private cz(z: number): number {
    const c = Math.floor((z - this.gz0) / GRID);
    return c < 0 ? 0 : c >= this.grows ? this.grows - 1 : c;
  }

  /** Collects unique box indices whose grid cells touch the XZ rectangle. */
  private gather(x0: number, z0: number, x1: number, z1: number): number[] {
    const out = this.scratch;
    out.length = 0;
    const id = ++this.stampId;
    const c0 = this.cx(x0);
    const c1 = this.cx(x1);
    const r0 = this.cz(z0);
    const r1 = this.cz(z1);
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const list = this.cellsIdx[r * this.gcols + c];
        for (let k = 0; k < list.length; k++) {
          const i = list[k];
          if (this.stamp[i] !== id) {
            this.stamp[i] = id;
            out.push(i);
          }
        }
      }
    }
    return out;
  }

  overlaps(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, mask: number = F_MOVE): boolean {
    const b = this.b;
    const c0 = this.cx(x0);
    const c1 = this.cx(x1);
    const r0 = this.cz(z0);
    const r1 = this.cz(z1);
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const list = this.cellsIdx[r * this.gcols + c];
        for (let k = 0; k < list.length; k++) {
          const i = list[k];
          if (!(this.flags[i] & mask)) continue;
          const o = i * 6;
          if (
            x0 < b[o + 3] - EPS &&
            x1 > b[o] + EPS &&
            y0 < b[o + 4] - EPS &&
            y1 > b[o + 1] + EPS &&
            z0 < b[o + 5] - EPS &&
            z1 > b[o + 2] + EPS
          )
            return true;
        }
      }
    }
    return false;
  }

  bodyFits(x: number, y: number, z: number, hw: number, height: number): boolean {
    return !this.overlaps(x - hw, y, z - hw, x + hw, y + height, z + hw, F_MOVE);
  }

  /** Tops of all movement-blocking boxes that overlap the XZ footprint (used by the nav builder). */
  topsUnder(x0: number, z0: number, x1: number, z1: number, out: number[]): void {
    const b = this.b;
    const list = this.gather(x0, z0, x1, z1);
    for (let k = 0; k < list.length; k++) {
      const i = list[k];
      if (!(this.flags[i] & F_MOVE)) continue;
      const o = i * 6;
      if (x0 < b[o + 3] - EPS && x1 > b[o] + EPS && z0 < b[o + 5] - EPS && z1 > b[o + 2] + EPS) out.push(b[o + 4]);
    }
  }

  /**
   * Highest box top within [yLo, yHi] under the footprint, or -Infinity. Used for landing,
   * stair stepping and ground snapping.
   */
  private highestTop(x: number, z: number, hw: number, yLo: number, yHi: number): number {
    const b = this.b;
    const x0 = x - hw;
    const x1 = x + hw;
    const z0 = z - hw;
    const z1 = z + hw;
    let best = -Infinity;
    const c0 = this.cx(x0);
    const c1 = this.cx(x1);
    const r0 = this.cz(z0);
    const r1 = this.cz(z1);
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const list = this.cellsIdx[r * this.gcols + c];
        for (let k = 0; k < list.length; k++) {
          const i = list[k];
          if (!(this.flags[i] & F_MOVE)) continue;
          const o = i * 6;
          const top = b[o + 4];
          if (top < yLo || top > yHi || top <= best) continue;
          if (x0 < b[o + 3] - EPS && x1 > b[o] + EPS && z0 < b[o + 5] - EPS && z1 > b[o + 2] + EPS) best = top;
        }
      }
    }
    return best;
  }

  private lowestBottom(x: number, z: number, hw: number, yLo: number, yHi: number): number {
    const b = this.b;
    const x0 = x - hw;
    const x1 = x + hw;
    const z0 = z - hw;
    const z1 = z + hw;
    let best = Infinity;
    const list = this.gather(x0, z0, x1, z1);
    for (let k = 0; k < list.length; k++) {
      const i = list[k];
      if (!(this.flags[i] & F_MOVE)) continue;
      const o = i * 6;
      const bot = b[o + 1];
      if (bot < yLo || bot > yHi || bot >= best) continue;
      if (x0 < b[o + 3] - EPS && x1 > b[o] + EPS && z0 < b[o + 5] - EPS && z1 > b[o + 2] + EPS) best = bot;
    }
    return best;
  }

  /** Floor height directly below a point (highest top at or below y + small tolerance). */
  floorBelow(x: number, y: number, z: number, hw = 0.05): number {
    const t = this.highestTop(x, z, hw, -10, y + 0.05);
    return t === -Infinity ? 0 : t;
  }

  /** Moves along one horizontal axis, sliding against walls and stepping up small ledges. */
  private moveAxis(body: Body, axis: 0 | 2, d: number, allowStep: boolean): boolean {
    const p = body.pos;
    const hw = body.hw;
    const nx = axis === 0 ? p.x + d : p.x;
    const nz = axis === 2 ? p.z + d : p.z;
    if (this.bodyFits(nx, p.y, nz, hw, body.height)) {
      p.x = nx;
      p.z = nz;
      return true;
    }
    if (allowStep && body.onGround) {
      const top = this.highestTop(nx, nz, hw, p.y + EPS, p.y + STEP_HEIGHT);
      if (top !== -Infinity && this.bodyFits(nx, top, nz, hw, body.height) && this.bodyFits(p.x, top, p.z, hw, body.height)) {
        p.x = nx;
        p.z = nz;
        p.y = top;
        return true;
      }
    }
    // Blocked: advance up to the nearest blocking face.
    const b = this.b;
    const x0 = Math.min(p.x, nx) - hw;
    const x1 = Math.max(p.x, nx) + hw;
    const z0 = Math.min(p.z, nz) - hw;
    const z1 = Math.max(p.z, nz) + hw;
    const y0 = p.y;
    const y1 = p.y + body.height;
    const list = this.gather(x0, z0, x1, z1);
    let limit = axis === 0 ? nx : nz;
    for (let k = 0; k < list.length; k++) {
      const i = list[k];
      if (!(this.flags[i] & F_MOVE)) continue;
      const o = i * 6;
      if (!(x0 < b[o + 3] - EPS && x1 > b[o] + EPS && y0 < b[o + 4] - EPS && y1 > b[o + 1] + EPS && z0 < b[o + 5] - EPS && z1 > b[o + 2] + EPS))
        continue;
      if (d > 0) {
        const face = b[o + axis] - hw - EPS * 2;
        if (face < limit) limit = face;
      } else {
        const face = b[o + 3 + axis] + hw + EPS * 2;
        if (face > limit) limit = face;
      }
    }
    if (axis === 0) {
      if ((d > 0 && limit > p.x) || (d < 0 && limit < p.x)) {
        if (this.bodyFits(limit, p.y, p.z, hw, body.height)) p.x = limit;
      }
      body.vel.x = 0;
    } else {
      if ((d > 0 && limit > p.z) || (d < 0 && limit < p.z)) {
        if (this.bodyFits(p.x, p.y, limit, hw, body.height)) p.z = limit;
      }
      body.vel.z = 0;
    }
    return false;
  }

  /** Pushes a body horizontally (used for actor separation); never steps or tunnels. */
  nudge(body: Body, dx: number, dz: number): void {
    const vx = body.vel.x;
    const vz = body.vel.z;
    if (dx !== 0) this.moveAxis(body, 0, dx, false);
    if (dz !== 0) this.moveAxis(body, 2, dz, false);
    body.vel.x = vx;
    body.vel.z = vz;
  }

  /** Integrates one physics step. Returns the vertical speed at the moment of landing (or 0). */
  moveBody(body: Body, dt: number): number {
    const p = body.pos;
    const v = body.vel;
    const wasOnGround = body.onGround;
    // --- horizontal (sub-stepped so fast bodies never tunnel through thin props)
    const dx = v.x * dt;
    const dz = v.z * dt;
    const len = Math.hypot(dx, dz);
    if (len > 1e-7) {
      const steps = Math.max(1, Math.ceil(len / 0.2));
      for (let s = 0; s < steps; s++) {
        if (v.x !== 0) this.moveAxis(body, 0, (v.x * dt) / steps, true);
        if (v.z !== 0) this.moveAxis(body, 2, (v.z * dt) / steps, true);
      }
    }
    // --- vertical
    let landed = 0;
    v.y -= GRAVITY * dt;
    if (v.y < -40) v.y = -40;
    const dy = v.y * dt;
    if (dy <= 0) {
      const target = p.y + dy;
      const top = this.highestTop(p.x, p.z, body.hw, target, p.y + 1e-3);
      if (top !== -Infinity) {
        landed = wasOnGround ? 0 : -v.y;
        p.y = top;
        v.y = 0;
        body.onGround = true;
      } else {
        p.y = target;
        body.onGround = false;
        if (wasOnGround) {
          // Walking down stairs / small ledges: stay glued to the ground instead of hopping.
          const snap = this.highestTop(p.x, p.z, body.hw, p.y - STEP_HEIGHT, p.y);
          if (snap !== -Infinity) {
            p.y = snap;
            v.y = 0;
            body.onGround = true;
          }
        }
      }
    } else {
      const head = p.y + body.height;
      const bot = this.lowestBottom(p.x, p.z, body.hw, head - 1e-3, head + dy);
      if (bot !== Infinity) {
        p.y = bot - body.height - EPS;
        v.y = 0;
      } else {
        p.y += dy;
      }
      body.onGround = false;
    }
    return landed;
  }

  /** Nearest intersection of a ray with the static world. Direction must be normalised. */
  raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxDist: number, mask: number = F_RAY): RayHit | null {
    const b = this.b;
    // (a huge finite reciprocal instead of Infinity avoids 0 * Infinity = NaN on axis-aligned rays)
    const idx = Math.abs(dx) > 1e-12 ? 1 / dx : 1e30;
    const idy = Math.abs(dy) > 1e-12 ? 1 / dy : 1e30;
    const idz = Math.abs(dz) > 1e-12 ? 1 / dz : 1e30;
    let best = maxDist;
    let hit = -1;
    let hitAxis = 0;
    for (let i = 0; i < this.n; i++) {
      if (!(this.flags[i] & mask)) continue;
      const o = i * 6;
      let t1 = (b[o] - ox) * idx;
      let t2 = (b[o + 3] - ox) * idx;
      let tmin: number;
      let tmax: number;
      let axis = 0;
      if (t1 > t2) {
        const t = t1;
        t1 = t2;
        t2 = t;
      }
      tmin = t1;
      tmax = t2;
      if (tmax < 0 || tmin > best) continue;
      t1 = (b[o + 1] - oy) * idy;
      t2 = (b[o + 4] - oy) * idy;
      if (t1 > t2) {
        const t = t1;
        t1 = t2;
        t2 = t;
      }
      if (t1 > tmin) {
        tmin = t1;
        axis = 1;
      }
      if (t2 < tmax) tmax = t2;
      if (tmax < 0 || tmin > tmax || tmin > best) continue;
      t1 = (b[o + 2] - oz) * idz;
      t2 = (b[o + 5] - oz) * idz;
      if (t1 > t2) {
        const t = t1;
        t1 = t2;
        t2 = t;
      }
      if (t1 > tmin) {
        tmin = t1;
        axis = 2;
      }
      if (t2 < tmax) tmax = t2;
      if (tmax < 0 || tmin > tmax || tmin > best) continue;
      if (tmin < 0) continue; // origin inside the box: ignore it
      best = tmin;
      hit = i;
      hitAxis = axis;
    }
    if (hit < 0) return null;
    return {
      t: best,
      box: hit,
      nx: hitAxis === 0 ? (dx > 0 ? -1 : 1) : 0,
      ny: hitAxis === 1 ? (dy > 0 ? -1 : 1) : 0,
      nz: hitAxis === 2 ? (dz > 0 ? -1 : 1) : 0,
    };
  }

  /** True when nothing blocks the segment between two points. */
  clearLine(a: Vec3, bq: Vec3, mask: number = F_RAY): boolean {
    const dx = bq.x - a.x;
    const dy = bq.y - a.y;
    const dz = bq.z - a.z;
    const len = Math.hypot(dx, dy, dz);
    if (len < 1e-6) return true;
    return this.raycast(a.x, a.y, a.z, dx / len, dy / len, dz / len, len - 0.02, mask) === null;
  }
}

// Collision world: axis-aligned solids + analytic ramps + ground plane.
// Provides kinematic character movement (step-up, slide, gravity, ceilings),
// raycasts (bullets / line of sight) and floor queries. No THREE dependency.

import type { Box, MapData, Ramp } from './MapData';
import { rampHeightAt } from './MapData';
import { GRAVITY, STEP_HEIGHT } from '../config';
import type { V3Like } from '../math';

export interface BodyLike {
  pos: V3Like; // feet position
  vel: V3Like;
  radius: number;
  height: number;
  onGround: boolean;
}

export interface RayHit {
  t: number;
  x: number;
  y: number;
  z: number;
  nx: number;
  ny: number;
  nz: number;
  box: Box | null;
}

const EPS = 1e-4;

export class World {
  readonly map: MapData;
  readonly boxes: Box[];
  readonly ramps: Ramp[];
  private readonly bucketSize = 8;
  private readonly bw: number;
  private readonly bd: number;
  private readonly buckets: number[][];
  private readonly stamp: Uint32Array;
  private stampId = 1;
  private readonly scratch: Box[] = [];

  constructor(map: MapData) {
    this.map = map;
    this.boxes = map.boxes;
    this.ramps = map.ramps;
    this.bw = Math.ceil(map.W / this.bucketSize) + 1;
    this.bd = Math.ceil(map.D / this.bucketSize) + 1;
    this.buckets = Array.from({ length: this.bw * this.bd }, () => []);
    this.stamp = new Uint32Array(this.boxes.length);
    for (const b of this.boxes) {
      const i0 = this.bi(b.minX), i1 = this.bi(b.maxX);
      const j0 = this.bj(b.minZ), j1 = this.bj(b.maxZ);
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) this.buckets[j * this.bw + i].push(b.id);
    }
  }

  private bi(x: number) {
    return Math.max(0, Math.min(this.bw - 1, Math.floor(x / this.bucketSize)));
  }
  private bj(z: number) {
    return Math.max(0, Math.min(this.bd - 1, Math.floor(z / this.bucketSize)));
  }

  /** Boxes whose XZ footprint may overlap the given rectangle (shared scratch array!). */
  boxesNear(minX: number, minZ: number, maxX: number, maxZ: number): Box[] {
    const out = this.scratch;
    out.length = 0;
    const s = ++this.stampId;
    const i0 = this.bi(minX), i1 = this.bi(maxX);
    const j0 = this.bj(minZ), j1 = this.bj(maxZ);
    for (let j = j0; j <= j1; j++)
      for (let i = i0; i <= i1; i++) {
        const list = this.buckets[j * this.bw + i];
        for (let k = 0; k < list.length; k++) {
          const id = list[k];
          if (this.stamp[id] === s) continue;
          this.stamp[id] = s;
          const b = this.boxes[id];
          if (b.maxX < minX || b.minX > maxX || b.maxZ < minZ || b.minZ > maxZ) continue;
          out.push(b);
        }
      }
    return out;
  }

  rampHeight(x: number, z: number): number {
    for (const r of this.ramps) {
      if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) return rampHeightAt(r, x, z);
    }
    return -Infinity;
  }

  /** Authoring floor height (NaN = void). */
  floorAt(x: number, z: number): number {
    const i = Math.floor(x), j = Math.floor(z);
    if (i < 0 || j < 0 || i >= this.map.W || j >= this.map.D) return NaN;
    const idx = j * this.map.W + i;
    const rid = this.map.rampId[idx];
    if (rid >= 0) return rampHeightAt(this.ramps[rid], x, z);
    return this.map.height[idx];
  }

  /** Highest support surface under a square footprint whose top is <= maxY. */
  groundHeight(x: number, z: number, r: number, maxY: number): number {
    let g = 0;
    const rh = this.rampHeight(x, z);
    if (rh > g && rh <= maxY + 0.05) g = rh;
    const list = this.boxesNear(x - r, z - r, x + r, z + r);
    for (const b of list) {
      if (b.maxY > maxY || b.maxY <= g) continue;
      if (x + r <= b.minX || x - r >= b.maxX || z + r <= b.minZ || z - r >= b.maxZ) continue;
      g = b.maxY;
    }
    return g;
  }

  /** True if a body of this footprint fits between y0 and y1 at (x,z). */
  hasClearance(x: number, z: number, r: number, y0: number, y1: number): boolean {
    const list = this.boxesNear(x - r, z - r, x + r, z + r);
    for (const b of list) {
      if (x + r <= b.minX || x - r >= b.maxX || z + r <= b.minZ || z - r >= b.maxZ) continue;
      if (b.maxY > y0 + 0.02 && b.minY < y1) return false;
    }
    return true;
  }

  private slideAxis(body: BodyLike, axis: 'x' | 'z', d: number): boolean {
    if (d === 0) return false;
    const p = body.pos;
    const r = body.radius;
    const feet = p.y;
    const top = p.y + body.height;
    let n = axis === 'x' ? p.x + d : p.z + d;
    let blocked = false;
    const minX = axis === 'x' ? Math.min(p.x, n) - r : p.x - r;
    const maxX = axis === 'x' ? Math.max(p.x, n) + r : p.x + r;
    const minZ = axis === 'z' ? Math.min(p.z, n) - r : p.z - r;
    const maxZ = axis === 'z' ? Math.max(p.z, n) + r : p.z + r;
    const list = this.boxesNear(minX, minZ, maxX, maxZ);
    for (const b of list) {
      if (b.maxY <= feet + STEP_HEIGHT || b.minY >= top) continue;
      if (axis === 'x') {
        if (p.z + r <= b.minZ || p.z - r >= b.maxZ) continue;
        if (n + r > b.minX && n - r < b.maxX) {
          if (d > 0 && p.x + r <= b.minX + 0.01) {
            n = b.minX - r - EPS;
            blocked = true;
          } else if (d < 0 && p.x - r >= b.maxX - 0.01) {
            n = b.maxX + r + EPS;
            blocked = true;
          }
        }
      } else {
        if (p.x + r <= b.minX || p.x - r >= b.maxX) continue;
        if (n + r > b.minZ && n - r < b.maxZ) {
          if (d > 0 && p.z + r <= b.minZ + 0.01) {
            n = b.minZ - r - EPS;
            blocked = true;
          } else if (d < 0 && p.z - r >= b.maxZ - 0.01) {
            n = b.maxZ + r + EPS;
            blocked = true;
          }
        }
      }
    }
    const nx = axis === 'x' ? n : p.x;
    const nz = axis === 'z' ? n : p.z;
    if (this.rampHeight(nx, nz) > feet + STEP_HEIGHT) return true;
    if (axis === 'x') p.x = n;
    else p.z = n;
    return blocked;
  }

  /** Kinematic move. Returns true if horizontally blocked. */
  moveBody(body: BodyLike, dt: number): boolean {
    let blocked = false;
    const dx = body.vel.x * dt;
    const dz = body.vel.z * dt;
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dz)) / 0.25));
    for (let s = 0; s < steps; s++) {
      if (this.slideAxis(body, 'x', dx / steps)) {
        blocked = true;
        body.vel.x = 0;
      }
      if (this.slideAxis(body, 'z', dz / steps)) {
        blocked = true;
        body.vel.z = 0;
      }
    }

    const p = body.pos;
    const r = body.radius * 0.92;
    body.vel.y -= GRAVITY * dt;
    let ny = p.y + body.vel.y * dt;
    const g = this.groundHeight(p.x, p.z, r, p.y + STEP_HEIGHT);
    if (ny <= g) {
      ny = g;
      body.vel.y = 0;
      body.onGround = true;
    } else if (body.onGround && body.vel.y <= 0 && ny - g < 0.4) {
      ny = g;
      body.vel.y = 0;
      body.onGround = true;
    } else {
      body.onGround = false;
    }
    if (body.vel.y > 0) {
      const list = this.boxesNear(p.x - r, p.z - r, p.x + r, p.z + r);
      for (const b of list) {
        if (p.x + r <= b.minX || p.x - r >= b.maxX || p.z + r <= b.minZ || p.z - r >= b.maxZ) continue;
        if (b.minY < p.y + body.height - 0.05) continue;
        if (ny + body.height > b.minY) {
          ny = b.minY - body.height;
          body.vel.y = 0;
        }
      }
    }
    p.y = ny;
    return blocked;
  }

  /** Push a body out of any solid it overlaps (used after separation impulses / spawning). */
  depenetrate(body: BodyLike): void {
    const p = body.pos;
    const r = body.radius;
    const list = this.boxesNear(p.x - r, p.z - r, p.x + r, p.z + r).slice();
    for (const b of list) {
      if (b.maxY <= p.y + STEP_HEIGHT || b.minY >= p.y + body.height) continue;
      if (p.x + r <= b.minX || p.x - r >= b.maxX || p.z + r <= b.minZ || p.z - r >= b.maxZ) continue;
      const pushes = [b.minX - r - p.x, b.maxX + r - p.x, b.minZ - r - p.z, b.maxZ + r - p.z];
      let best = 0;
      for (let k = 1; k < 4; k++) if (Math.abs(pushes[k]) < Math.abs(pushes[best])) best = k;
      if (best < 2) p.x += pushes[best] + Math.sign(pushes[best]) * EPS;
      else p.z += pushes[best] + Math.sign(pushes[best]) * EPS;
    }
  }

  /** Ray against all solids, ramps and the ground plane. `d` must be normalized. */
  raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxDist: number): RayHit | null {
    let best = maxDist;
    let hit: RayHit | null = null;
    // ground plane
    if (dy < -1e-6 && oy >= 0) {
      const t = -oy / dy;
      if (t < best) {
        best = t;
        hit = { t, x: ox + dx * t, y: 0, z: oz + dz * t, nx: 0, ny: 1, nz: 0, box: null };
      }
    }
    // ramps
    for (const r of this.ramps) {
      const span = r.axis === 'x' ? r.x1 - r.x0 : r.z1 - r.z0;
      const s = (r.h1 - r.h0) / span;
      const o = r.axis === 'x' ? ox : oz;
      const dd = r.axis === 'x' ? dx : dz;
      const a0 = r.axis === 'x' ? r.x0 : r.z0;
      const c = r.h0 - s * a0;
      const denom = dy - s * dd;
      if (Math.abs(denom) < 1e-6) continue;
      const t = (c + s * o - oy) / denom;
      if (t <= 0 || t >= best) continue;
      const hx = ox + dx * t, hz = oz + dz * t;
      if (hx < r.x0 || hx > r.x1 || hz < r.z0 || hz > r.z1) continue;
      const len = Math.hypot(s, 1);
      best = t;
      hit = {
        t,
        x: hx,
        y: oy + dy * t,
        z: hz,
        nx: r.axis === 'x' ? -s / len : 0,
        ny: 1 / len,
        nz: r.axis === 'z' ? -s / len : 0,
        box: null,
      };
    }
    // boxes (slab test, scalar-inlined to avoid allocations in the hot path)
    const ix = 1 / dx, iy = 1 / dy, iz = 1 / dz;
    boxLoop: for (let k = 0; k < this.boxes.length; k++) {
      const b = this.boxes[k];
      let tmin = 0;
      let tmax = best;
      let axis = -1;
      let sign = 0;
      let t1: number, t2: number, sg: number, tmp: number;
      // X
      if (dx !== 0) {
        t1 = (b.minX - ox) * ix;
        t2 = (b.maxX - ox) * ix;
        sg = -1;
        if (t1 > t2) {
          tmp = t1; t1 = t2; t2 = tmp; sg = 1;
        }
        if (t1 > tmin) {
          tmin = t1; axis = 0; sign = sg;
        }
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) continue boxLoop;
      } else if (ox < b.minX || ox > b.maxX) continue boxLoop;
      // Y
      if (dy !== 0) {
        t1 = (b.minY - oy) * iy;
        t2 = (b.maxY - oy) * iy;
        sg = -1;
        if (t1 > t2) {
          tmp = t1; t1 = t2; t2 = tmp; sg = 1;
        }
        if (t1 > tmin) {
          tmin = t1; axis = 1; sign = sg;
        }
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) continue boxLoop;
      } else if (oy < b.minY || oy > b.maxY) continue boxLoop;
      // Z
      if (dz !== 0) {
        t1 = (b.minZ - oz) * iz;
        t2 = (b.maxZ - oz) * iz;
        sg = -1;
        if (t1 > t2) {
          tmp = t1; t1 = t2; t2 = tmp; sg = 1;
        }
        if (t1 > tmin) {
          tmin = t1; axis = 2; sign = sg;
        }
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) continue boxLoop;
      } else if (oz < b.minZ || oz > b.maxZ) continue boxLoop;
      if (axis < 0 || tmin >= best) continue;
      best = tmin;
      hit = {
        t: tmin,
        x: ox + dx * tmin,
        y: oy + dy * tmin,
        z: oz + dz * tmin,
        nx: axis === 0 ? sign : 0,
        ny: axis === 1 ? sign : 0,
        nz: axis === 2 ? sign : 0,
        box: b,
      };
    }
    return hit;
  }

  /** True if nothing solid lies on the segment a->b. */
  segmentClear(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean {
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const len = Math.hypot(dx, dy, dz);
    if (len < 1e-4) return true;
    return this.raycast(ax, ay, az, dx / len, dy / len, dz / len, len - 0.02) === null;
  }
}

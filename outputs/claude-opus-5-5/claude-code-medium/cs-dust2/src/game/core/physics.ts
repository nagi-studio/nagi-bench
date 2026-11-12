// Hand-rolled character physics: vertical cylinders vs axis aligned boxes, plus
// ray casting (slab method) for bullets and line-of-sight.

import type { AABB } from './map.ts';
import type { V3 } from './math.ts';

export const GRAVITY = 20;
export const JUMP_SPEED = 6.4;

export interface Body {
  pos: V3; // feet position
  vel: V3;
  onGround: boolean;
  radius: number;
  height: number;
}

export interface RayHit {
  t: number;
  point: V3;
  normal: V3;
  box: AABB;
}

export interface StepResult {
  landed: boolean;
  fallSpeed: number;
}

export class CollisionWorld {
  boxes: AABB[];
  /** Coarse uniform grid for broadphase (8m buckets). */
  private bucketSize = 8;
  private buckets = new Map<number, AABB[]>();

  constructor(boxes: AABB[]) {
    this.boxes = boxes;
    for (const b of boxes) {
      const x0 = Math.floor(b.minX / this.bucketSize);
      const x1 = Math.floor(b.maxX / this.bucketSize);
      const z0 = Math.floor(b.minZ / this.bucketSize);
      const z1 = Math.floor(b.maxZ / this.bucketSize);
      for (let x = x0; x <= x1; x++)
        for (let z = z0; z <= z1; z++) {
          const k = this.key(x, z);
          let list = this.buckets.get(k);
          if (!list) this.buckets.set(k, (list = []));
          list.push(b);
        }
    }
  }

  private key(x: number, z: number) {
    return (x + 1000) * 4096 + (z + 1000);
  }

  /** Boxes whose xz footprint may intersect the given circle. */
  private near(x: number, z: number, r: number, out: Set<AABB>) {
    out.clear();
    const s = this.bucketSize;
    const x0 = Math.floor((x - r) / s);
    const x1 = Math.floor((x + r) / s);
    const z0 = Math.floor((z - r) / s);
    const z1 = Math.floor((z + r) / s);
    for (let bx = x0; bx <= x1; bx++)
      for (let bz = z0; bz <= z1; bz++) {
        const list = this.buckets.get(this.key(bx, bz));
        if (list) for (const b of list) out.add(b);
      }
    return out;
  }
  private scratch = new Set<AABB>();

  /** Push a body's cylinder out of all boxes that overlap it vertically. */
  resolveHorizontal(b: Body) {
    const r = b.radius;
    for (let iter = 0; iter < 3; iter++) {
      let moved = false;
      for (const box of this.near(b.pos.x, b.pos.z, r + 0.5, this.scratch)) {
        if (box.maxY <= b.pos.y + 0.05 || box.minY >= b.pos.y + b.height) continue;
        const cx = Math.max(box.minX, Math.min(b.pos.x, box.maxX));
        const cz = Math.max(box.minZ, Math.min(b.pos.z, box.maxZ));
        let dx = b.pos.x - cx;
        let dz = b.pos.z - cz;
        const d2 = dx * dx + dz * dz;
        if (d2 >= r * r) continue;
        let nx: number, nz: number, push: number;
        if (d2 > 1e-10) {
          const d = Math.sqrt(d2);
          nx = dx / d;
          nz = dz / d;
          push = r - d;
        } else {
          // Center inside the box: push out along the axis of least penetration.
          const pl = b.pos.x - box.minX;
          const pr = box.maxX - b.pos.x;
          const pt = b.pos.z - box.minZ;
          const pb = box.maxZ - b.pos.z;
          const m = Math.min(pl, pr, pt, pb);
          if (m === pl) (nx = -1), (nz = 0), (push = pl + r);
          else if (m === pr) (nx = 1), (nz = 0), (push = pr + r);
          else if (m === pt) (nx = 0), (nz = -1), (push = pt + r);
          else (nx = 0), (nz = 1), (push = pb + r);
        }
        b.pos.x += nx * push;
        b.pos.z += nz * push;
        const vn = b.vel.x * nx + b.vel.z * nz;
        if (vn < 0) {
          b.vel.x -= nx * vn;
          b.vel.z -= nz * vn;
        }
        moved = true;
      }
      if (!moved) break;
    }
  }

  /** Highest walkable surface under the body that is not above `maxY`. */
  groundHeight(x: number, z: number, r: number, maxY: number): number {
    let g = 0;
    const rr = r * 0.8;
    for (const box of this.near(x, z, r, this.scratch)) {
      if (box.maxY > maxY + 0.001) continue;
      const cx = Math.max(box.minX, Math.min(x, box.maxX));
      const cz = Math.max(box.minZ, Math.min(z, box.maxZ));
      const dx = x - cx;
      const dz = z - cz;
      if (dx * dx + dz * dz < rr * rr && box.maxY > g) g = box.maxY;
    }
    return g;
  }

  /** Integrate one physics step for a body (horizontal velocity set by caller). */
  step(b: Body, dt: number): StepResult {
    const horiz = Math.hypot(b.vel.x, b.vel.z) * dt;
    const n = Math.max(1, Math.ceil(horiz / 0.2));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      b.pos.x += b.vel.x * h;
      b.pos.z += b.vel.z * h;
      this.resolveHorizontal(b);
    }
    const wasOnGround = b.onGround;
    const oldY = b.pos.y;
    b.vel.y -= GRAVITY * dt;
    b.pos.y += b.vel.y * dt;
    const ground = this.groundHeight(b.pos.x, b.pos.z, b.radius, oldY + 0.05);
    let landed = false;
    let fallSpeed = 0;
    if (b.pos.y <= ground) {
      if (!wasOnGround) {
        landed = true;
        fallSpeed = -b.vel.y;
      }
      b.pos.y = ground;
      b.vel.y = 0;
      b.onGround = true;
    } else if (wasOnGround && b.vel.y <= 0 && b.pos.y - ground < 0.08) {
      // stick to ground on tiny drops
      b.pos.y = ground;
      b.vel.y = 0;
      b.onGround = true;
    } else {
      b.onGround = false;
    }
    // ceilings
    if (b.vel.y > 0) {
      for (const box of this.near(b.pos.x, b.pos.z, b.radius, this.scratch)) {
        if (box.minY < oldY + b.height - 0.01) continue;
        if (b.pos.y + b.height <= box.minY) continue;
        const cx = Math.max(box.minX, Math.min(b.pos.x, box.maxX));
        const cz = Math.max(box.minZ, Math.min(b.pos.z, box.maxZ));
        if ((b.pos.x - cx) ** 2 + (b.pos.z - cz) ** 2 < b.radius * b.radius) {
          b.pos.y = box.minY - b.height;
          b.vel.y = 0;
        }
      }
    }
    return { landed, fallSpeed };
  }

  /** Nearest box hit along a ray. `dir` must be normalized. */
  raycast(o: V3, dir: V3, maxDist: number): RayHit | null {
    let best = maxDist;
    let hitBox: AABB | null = null;
    let nAxis = 0;
    let nSign = 0;
    const inv = { x: 1 / dir.x, y: 1 / dir.y, z: 1 / dir.z };
    for (const b of this.boxes) {
      let tmin = 0;
      let tmax = best;
      let axis = -1;
      let sign = 0;
      // X slab
      {
        let t1 = (b.minX - o.x) * inv.x;
        let t2 = (b.maxX - o.x) * inv.x;
        let s = -1;
        if (t1 > t2) {
          const tt = t1;
          t1 = t2;
          t2 = tt;
          s = 1;
        }
        if (Number.isNaN(t1)) continue;
        if (t1 > tmin) {
          tmin = t1;
          axis = 0;
          sign = s;
        }
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) continue;
      }
      {
        let t1 = (b.minY - o.y) * inv.y;
        let t2 = (b.maxY - o.y) * inv.y;
        let s = -1;
        if (t1 > t2) {
          const tt = t1;
          t1 = t2;
          t2 = tt;
          s = 1;
        }
        if (Number.isNaN(t1)) continue;
        if (t1 > tmin) {
          tmin = t1;
          axis = 1;
          sign = s;
        }
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) continue;
      }
      {
        let t1 = (b.minZ - o.z) * inv.z;
        let t2 = (b.maxZ - o.z) * inv.z;
        let s = -1;
        if (t1 > t2) {
          const tt = t1;
          t1 = t2;
          t2 = tt;
          s = 1;
        }
        if (Number.isNaN(t1)) continue;
        if (t1 > tmin) {
          tmin = t1;
          axis = 2;
          sign = s;
        }
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) continue;
      }
      if (axis < 0) continue; // origin inside the box: ignore
      if (tmin < best) {
        best = tmin;
        hitBox = b;
        nAxis = axis;
        nSign = sign;
      }
    }
    // Ground plane y = 0
    if (dir.y < -1e-6) {
      const tg = -o.y / dir.y;
      if (tg >= 0 && tg < best) {
        best = tg;
        hitBox = GROUND_BOX;
        nAxis = 1;
        nSign = 1;
      }
    }
    if (!hitBox) return null;
    const normal = { x: 0, y: 0, z: 0 };
    if (nAxis === 0) normal.x = nSign;
    else if (nAxis === 1) normal.y = nSign;
    else normal.z = nSign;
    return {
      t: best,
      point: { x: o.x + dir.x * best, y: o.y + dir.y * best, z: o.z + dir.z * best },
      normal,
      box: hitBox,
    };
  }

  /** True if the segment a→b is not blocked by geometry. */
  lineClear(a: V3, b: V3): boolean {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dz = b.z - a.z;
    const d = Math.hypot(dx, dy, dz);
    if (d < 1e-6) return true;
    const hit = this.raycast(a, { x: dx / d, y: dy / d, z: dz / d }, d);
    return !hit || hit.t >= d - 0.05;
  }
}

const GROUND_BOX: AABB = { minX: -1e5, maxX: 1e5, minY: -1, maxY: 0, minZ: -1e5, maxZ: 1e5, kind: 'wall' };

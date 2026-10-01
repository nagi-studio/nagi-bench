import type * as THREE from 'three';
import { PHYS } from '../core/config';
import type { SurfaceMaterial } from '../core/types';

/** Collider participation masks. */
export const MASK_MOVE = 1;
export const MASK_BULLET = 2;
export const MASK_SIGHT = 4;
export const MASK_ALL = MASK_MOVE | MASK_BULLET | MASK_SIGHT;

const SKIN = 0.002;

export interface RampSpec {
  axis: 'x' | 'z';
  /** +1: surface rises towards +axis, -1: surface rises towards -axis. */
  rise: 1 | -1;
  yLow: number;
  yHigh: number;
}

/**
 * Axis-aligned solid. Optionally a "ramp": the AABB clipped by a sloped top plane
 * (a wedge), which lets the 2.5D world contain slopes without general polyhedra.
 */
export class Collider {
  id = -1;
  /** query de-duplication stamp */
  stamp = 0;

  constructor(
    public minX: number,
    public minY: number,
    public minZ: number,
    public maxX: number,
    public maxY: number,
    public maxZ: number,
    public mask: number = MASK_ALL,
    public material: SurfaceMaterial = 'stone',
    public ramp: RampSpec | null = null,
  ) {}

  /** Height of the walkable top surface at (x, z). */
  topAt(x: number, z: number): number {
    const r = this.ramp;
    if (!r) return this.maxY;
    let t: number;
    if (r.axis === 'x') {
      const c = x < this.minX ? this.minX : x > this.maxX ? this.maxX : x;
      t = (c - this.minX) / (this.maxX - this.minX);
    } else {
      const c = z < this.minZ ? this.minZ : z > this.maxZ ? this.maxZ : z;
      t = (c - this.minZ) / (this.maxZ - this.minZ);
    }
    if (r.rise < 0) t = 1 - t;
    return r.yLow + (r.yHigh - r.yLow) * t;
  }

  /** Highest point of the top surface within a footprint (AABB hulls rest on the highest point). */
  topOver(x0: number, z0: number, x1: number, z1: number): number {
    const r = this.ramp;
    if (!r) return this.maxY;
    if (r.axis === 'x') return this.topAt(r.rise > 0 ? Math.min(x1, this.maxX) : Math.max(x0, this.minX), 0);
    return this.topAt(0, r.rise > 0 ? Math.min(z1, this.maxZ) : Math.max(z0, this.minZ));
  }

  /** Slope plane n·p <= d describing the solid side of a ramp. */
  rampPlane(out: { nx: number; ny: number; nz: number; d: number }): void {
    const r = this.ramp!;
    if (r.axis === 'x') {
      const k = (r.yHigh - r.yLow) / (this.maxX - this.minX);
      if (r.rise > 0) {
        out.nx = -k;
        out.d = r.yLow - k * this.minX;
      } else {
        out.nx = k;
        out.d = r.yHigh + k * this.minX;
      }
      out.ny = 1;
      out.nz = 0;
    } else {
      const k = (r.yHigh - r.yLow) / (this.maxZ - this.minZ);
      if (r.rise > 0) {
        out.nz = -k;
        out.d = r.yLow - k * this.minZ;
      } else {
        out.nz = k;
        out.d = r.yHigh + k * this.minZ;
      }
      out.ny = 1;
      out.nx = 0;
    }
  }
}

export interface RayHit {
  t: number;
  x: number;
  y: number;
  z: number;
  nx: number;
  ny: number;
  nz: number;
  collider: Collider | null;
}

export function makeRayHit(): RayHit {
  return { t: 0, x: 0, y: 0, z: 0, nx: 0, ny: 1, nz: 0, collider: null };
}

/** Kinematic hull used by every character: an AABB of `radius` half-width standing on `pos` (feet). */
export interface Hull {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  radius: number;
  height: number;
  onGround: boolean;
}

const plane = { nx: 0, ny: 0, nz: 0, d: 0 };

/** Ray (normalized dir) vs collider; writes entry distance/normal into `out`. */
function rayCollider(
  c: Collider,
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxT: number,
  out: RayHit,
): boolean {
  let tmin = 0;
  let tmax = maxT;
  let nAxis = -1;
  let nSign = 0;

  // X slab
  if (Math.abs(dx) < 1e-12) {
    if (ox < c.minX || ox > c.maxX) return false;
  } else {
    const inv = 1 / dx;
    let t1 = (c.minX - ox) * inv;
    let t2 = (c.maxX - ox) * inv;
    let s = -1;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
      s = 1;
    }
    if (t1 > tmin) {
      tmin = t1;
      nAxis = 0;
      nSign = s;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return false;
  }
  // Y slab
  if (Math.abs(dy) < 1e-12) {
    if (oy < c.minY || oy > c.maxY) return false;
  } else {
    const inv = 1 / dy;
    let t1 = (c.minY - oy) * inv;
    let t2 = (c.maxY - oy) * inv;
    let s = -1;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
      s = 1;
    }
    if (t1 > tmin) {
      tmin = t1;
      nAxis = 1;
      nSign = s;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return false;
  }
  // Z slab
  if (Math.abs(dz) < 1e-12) {
    if (oz < c.minZ || oz > c.maxZ) return false;
  } else {
    const inv = 1 / dz;
    let t1 = (c.minZ - oz) * inv;
    let t2 = (c.maxZ - oz) * inv;
    let s = -1;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
      s = 1;
    }
    if (t1 > tmin) {
      tmin = t1;
      nAxis = 2;
      nSign = s;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return false;
  }

  let nx = 0;
  let ny = 0;
  let nz = 0;
  if (nAxis === 0) nx = nSign;
  else if (nAxis === 1) ny = nSign;
  else if (nAxis === 2) nz = nSign;
  else {
    nx = -dx;
    ny = -dy;
    nz = -dz;
  }

  if (c.ramp) {
    c.rampPlane(plane);
    const denom = plane.nx * dx + plane.ny * dy + plane.nz * dz;
    const dist = plane.d - (plane.nx * ox + plane.ny * oy + plane.nz * oz);
    if (Math.abs(denom) < 1e-12) {
      if (dist < 0) return false;
    } else {
      const t = dist / denom;
      if (denom < 0) {
        if (t > tmin) {
          tmin = t;
          const len = Math.hypot(plane.nx, plane.ny, plane.nz);
          nx = plane.nx / len;
          ny = plane.ny / len;
          nz = plane.nz / len;
        }
      } else if (t < tmax) {
        tmax = t;
      }
      if (tmin > tmax) return false;
    }
  }

  if (tmin > maxT) return false;
  out.t = tmin;
  out.nx = nx;
  out.ny = ny;
  out.nz = nz;
  return true;
}

/**
 * Static collision world: colliders bucketed in a uniform XZ grid. Provides hull movement
 * (axis-separated slide + step-up + ground snap, Source-style) and grid-traversed raycasts.
 */
export class CollisionWorld {
  readonly colliders: Collider[] = [];
  private cellSize = 4;
  private originX = 0;
  private originZ = 0;
  private nx = 1;
  private nz = 1;
  private cells: Collider[][] = [];
  private stampCounter = 1;
  private readonly tmpList: Collider[] = [];
  private readonly tmpHit = makeRayHit();
  private readonly lineHit = makeRayHit();

  add(c: Collider): Collider {
    c.id = this.colliders.length;
    this.colliders.push(c);
    return c;
  }

  addBox(
    x0: number,
    y0: number,
    z0: number,
    x1: number,
    y1: number,
    z1: number,
    mask = MASK_ALL,
    material: SurfaceMaterial = 'stone',
  ): Collider {
    return this.add(
      new Collider(Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1), Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1), mask, material),
    );
  }

  /** Must be called after all colliders are added. */
  build(): void {
    let minX = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxZ = -Infinity;
    for (const c of this.colliders) {
      minX = Math.min(minX, c.minX);
      minZ = Math.min(minZ, c.minZ);
      maxX = Math.max(maxX, c.maxX);
      maxZ = Math.max(maxZ, c.maxZ);
    }
    this.originX = Math.floor(minX) - this.cellSize;
    this.originZ = Math.floor(minZ) - this.cellSize;
    this.nx = Math.ceil((maxX - this.originX) / this.cellSize) + 2;
    this.nz = Math.ceil((maxZ - this.originZ) / this.cellSize) + 2;
    this.cells = new Array(this.nx * this.nz);
    for (let i = 0; i < this.cells.length; i++) this.cells[i] = [];
    for (const c of this.colliders) {
      const cx0 = this.cellX(c.minX);
      const cx1 = this.cellX(c.maxX);
      const cz0 = this.cellZ(c.minZ);
      const cz1 = this.cellZ(c.maxZ);
      for (let z = cz0; z <= cz1; z++) for (let x = cx0; x <= cx1; x++) this.cells[z * this.nx + x].push(c);
    }
  }

  private cellX(x: number): number {
    const c = Math.floor((x - this.originX) / this.cellSize);
    return c < 0 ? 0 : c >= this.nx ? this.nx - 1 : c;
  }

  private cellZ(z: number): number {
    const c = Math.floor((z - this.originZ) / this.cellSize);
    return c < 0 ? 0 : c >= this.nz ? this.nz - 1 : c;
  }

  /** Colliders whose XZ footprint overlaps the rectangle (strictly) and match `mask`. */
  query(x0: number, z0: number, x1: number, z1: number, mask: number, out: Collider[]): Collider[] {
    out.length = 0;
    const stamp = ++this.stampCounter;
    const cx0 = this.cellX(x0);
    const cx1 = this.cellX(x1);
    const cz0 = this.cellZ(z0);
    const cz1 = this.cellZ(z1);
    for (let z = cz0; z <= cz1; z++) {
      for (let x = cx0; x <= cx1; x++) {
        const cell = this.cells[z * this.nx + x];
        for (let i = 0; i < cell.length; i++) {
          const c = cell[i];
          if (c.stamp === stamp) continue;
          c.stamp = stamp;
          if ((c.mask & mask) === 0) continue;
          if (c.maxX > x0 && c.minX < x1 && c.maxZ > z0 && c.minZ < z1) out.push(c);
        }
      }
    }
    return out;
  }

  /** True if the box intersects any solid with `mask`. */
  overlapsBox(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, mask = MASK_MOVE): boolean {
    const list = this.query(x0, z0, x1, z1, mask, this.tmpList);
    for (const c of list) {
      if (c.minY >= y1) continue;
      const top = c.topOver(x0, z0, x1, z1);
      if (top <= y0) continue;
      return true;
    }
    return false;
  }

  /** Highest walkable surface at (x,z) that is not above `maxY`. */
  groundHeight(x: number, z: number, maxY: number, radius = 0.05): number {
    const list = this.query(x - radius, z - radius, x + radius, z + radius, MASK_MOVE, this.tmpList);
    let best = -Infinity;
    for (const c of list) {
      if (c.minY > maxY) continue;
      const top = c.topOver(x - radius, z - radius, x + radius, z + radius);
      if (top <= maxY + 1e-3 && top > best) best = top;
    }
    return best;
  }

  // ---------------------------------------------------------------- hull movement

  /**
   * Integrates hull velocity for `dt` against static geometry. Returns the downward speed at
   * the moment of landing (0 if the hull did not land this step) for landing feedback.
   */
  moveHull(h: Hull, dt: number): number {
    if (h.vel.x !== 0) this.slideAxis(h, 0, h.pos.x + h.vel.x * dt);
    if (h.vel.z !== 0) this.slideAxis(h, 2, h.pos.z + h.vel.z * dt);
    return this.moveVertical(h, dt);
  }

  /** Displace a hull horizontally (used for soft actor-actor separation) with full collision. */
  nudgeHull(h: Hull, dx: number, dz: number): void {
    if (dx !== 0) this.slideAxis(h, 0, h.pos.x + dx, true);
    if (dz !== 0) this.slideAxis(h, 2, h.pos.z + dz, true);
  }

  private slideAxis(h: Hull, axis: 0 | 2, target: number, keepVelocity = false): void {
    const r = h.radius;
    const old = axis === 0 ? h.pos.x : h.pos.z;
    if (axis === 0) h.pos.x = target;
    else h.pos.z = target;
    const x0 = h.pos.x - r;
    const x1 = h.pos.x + r;
    const z0 = h.pos.z - r;
    const z1 = h.pos.z + r;
    const list = this.query(x0, z0, x1, z1, MASK_MOVE, this.tmpList);
    const feet = h.pos.y;
    const stepMax = h.onGround ? PHYS.stepHeight : PHYS.airStepHeight;
    let stepTo = feet;
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (c.minY >= feet + h.height - 0.02) continue; // above head
      const top = c.topOver(x0, z0, x1, z1);
      if (top <= feet + 0.001) continue; // below feet
      if (top <= feet + stepMax && c.minY <= feet + stepMax) {
        if (top <= stepTo) continue;
        if (this.hasHeadroom(list, c, top, h.height)) {
          stepTo = top;
          continue;
        }
      }
      const cMin = axis === 0 ? c.minX : c.minZ;
      const cMax = axis === 0 ? c.maxX : c.maxZ;
      let p = axis === 0 ? h.pos.x : h.pos.z;
      if (old + r <= cMin + 1e-3) p = Math.min(p, cMin - r - SKIN);
      else if (old - r >= cMax - 1e-3) p = Math.max(p, cMax + r + SKIN);
      else continue; // overlap pre-existed on this axis: the other axis owns it
      if (axis === 0) {
        h.pos.x = p;
        if (!keepVelocity) h.vel.x = 0;
      } else {
        h.pos.z = p;
        if (!keepVelocity) h.vel.z = 0;
      }
    }
    if (stepTo > feet) {
      h.pos.y = stepTo;
      if (h.vel.y < 0) h.vel.y = 0;
    }
  }

  private hasHeadroom(list: Collider[], self: Collider, top: number, height: number): boolean {
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (c === self) continue;
      if (c.minY > top - 0.001 && c.minY < top + height - 0.02) return false;
    }
    return true;
  }

  private moveVertical(h: Hull, dt: number): number {
    const r = h.radius;
    const x0 = h.pos.x - r;
    const x1 = h.pos.x + r;
    const z0 = h.pos.z - r;
    const z1 = h.pos.z + r;
    const list = this.query(x0, z0, x1, z1, MASK_MOVE, this.tmpList);
    const prevY = h.pos.y;
    let newY = prevY + h.vel.y * dt;
    let landed = 0;
    if (h.vel.y <= 0) {
      let ground = -Infinity;
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        if (c.minY > prevY + 0.05) continue;
        const top = c.topOver(x0, z0, x1, z1);
        if (top <= prevY + 0.05 && top > ground) ground = top;
      }
      if (h.onGround && ground > -Infinity && prevY - ground <= PHYS.snapDown) {
        newY = ground;
        h.vel.y = 0;
        h.onGround = true;
      } else if (newY <= ground) {
        landed = -h.vel.y;
        newY = ground;
        h.vel.y = 0;
        h.onGround = true;
      } else {
        h.onGround = false;
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        if (c.minY < prevY + h.height - 0.02) continue;
        if (newY + h.height > c.minY) {
          newY = c.minY - h.height;
          h.vel.y = 0;
        }
      }
      h.onGround = false;
    }
    h.pos.y = newY;
    return landed;
  }

  // ---------------------------------------------------------------- raycasts

  /** Grid-traversed raycast (dir must be normalized). */
  raycast(
    ox: number,
    oy: number,
    oz: number,
    dx: number,
    dy: number,
    dz: number,
    maxDist: number,
    mask: number,
    out: RayHit,
  ): boolean {
    const stamp = ++this.stampCounter;
    const cs = this.cellSize;
    let best = maxDist;
    let found = false;

    // Clip the ray to the grid rectangle in XZ.
    const gx0 = this.originX;
    const gz0 = this.originZ;
    const gx1 = gx0 + this.nx * cs;
    const gz1 = gz0 + this.nz * cs;
    let t0 = 0;
    let t1 = maxDist;
    if (Math.abs(dx) < 1e-12) {
      if (ox < gx0 || ox > gx1) return false;
    } else {
      const a = (gx0 - ox) / dx;
      const b = (gx1 - ox) / dx;
      t0 = Math.max(t0, Math.min(a, b));
      t1 = Math.min(t1, Math.max(a, b));
    }
    if (Math.abs(dz) < 1e-12) {
      if (oz < gz0 || oz > gz1) return false;
    } else {
      const a = (gz0 - oz) / dz;
      const b = (gz1 - oz) / dz;
      t0 = Math.max(t0, Math.min(a, b));
      t1 = Math.min(t1, Math.max(a, b));
    }
    if (t0 > t1) return false;

    const sx = ox + dx * t0;
    const sz = oz + dz * t0;
    let cx = this.cellX(sx);
    let cz = this.cellZ(sz);
    const stepX = dx > 0 ? 1 : -1;
    const stepZ = dz > 0 ? 1 : -1;
    const tDeltaX = Math.abs(dx) < 1e-12 ? Infinity : cs / Math.abs(dx);
    const tDeltaZ = Math.abs(dz) < 1e-12 ? Infinity : cs / Math.abs(dz);
    let tMaxX = Math.abs(dx) < 1e-12 ? Infinity : (gx0 + (cx + (dx > 0 ? 1 : 0)) * cs - ox) / dx;
    let tMaxZ = Math.abs(dz) < 1e-12 ? Infinity : (gz0 + (cz + (dz > 0 ? 1 : 0)) * cs - oz) / dz;
    const tmp = this.tmpHit;

    for (let guard = 0; guard < 4096; guard++) {
      const cell = this.cells[cz * this.nx + cx];
      for (let i = 0; i < cell.length; i++) {
        const c = cell[i];
        if (c.stamp === stamp) continue;
        c.stamp = stamp;
        if ((c.mask & mask) === 0) continue;
        if (rayCollider(c, ox, oy, oz, dx, dy, dz, best, tmp) && tmp.t <= best) {
          best = tmp.t;
          found = true;
          out.t = tmp.t;
          out.nx = tmp.nx;
          out.ny = tmp.ny;
          out.nz = tmp.nz;
          out.collider = c;
        }
      }
      const tNext = Math.min(tMaxX, tMaxZ);
      if (tNext > best || tNext > t1) break;
      if (tMaxX < tMaxZ) {
        cx += stepX;
        tMaxX += tDeltaX;
        if (cx < 0 || cx >= this.nx) break;
      } else {
        cz += stepZ;
        tMaxZ += tDeltaZ;
        if (cz < 0 || cz >= this.nz) break;
      }
    }
    if (found) {
      out.x = ox + dx * out.t;
      out.y = oy + dy * out.t;
      out.z = oz + dz * out.t;
    }
    return found;
  }

  /** Unobstructed straight line between two points for the given mask. */
  lineClear(ax: number, ay: number, az: number, bx: number, by: number, bz: number, mask = MASK_SIGHT): boolean {
    const dx = bx - ax;
    const dy = by - ay;
    const dz = bz - az;
    const len = Math.hypot(dx, dy, dz);
    if (len < 1e-6) return true;
    return !this.raycast(ax, ay, az, dx / len, dy / len, dz / len, len, mask, this.lineHit);
  }
}

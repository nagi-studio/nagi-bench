import type { AABB } from '../world/mapLayout';

const EPS = 1e-6;

export interface RayHit {
  t: number;
  collider: AABB;
}

/** Slab-method ray/AABB intersection. Returns nearest t >= 0, or Infinity. */
export function rayAABB(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  b: AABB,
): number {
  let tmin = -Infinity;
  let tmax = Infinity;

  // X
  if (Math.abs(dx) < EPS) {
    if (ox < b.minX || ox > b.maxX) return Infinity;
  } else {
    let t1 = (b.minX - ox) / dx;
    let t2 = (b.maxX - ox) / dx;
    if (t1 > t2) [t1, t2] = [t2, t1];
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return Infinity;
  }
  // Y
  if (Math.abs(dy) < EPS) {
    if (oy < b.minY || oy > b.maxY) return Infinity;
  } else {
    let t1 = (b.minY - oy) / dy;
    let t2 = (b.maxY - oy) / dy;
    if (t1 > t2) [t1, t2] = [t2, t1];
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return Infinity;
  }
  // Z
  if (Math.abs(dz) < EPS) {
    if (oz < b.minZ || oz > b.maxZ) return Infinity;
  } else {
    let t1 = (b.minZ - oz) / dz;
    let t2 = (b.maxZ - oz) / dz;
    if (t1 > t2) [t1, t2] = [t2, t1];
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return Infinity;
  }

  if (tmax < 0) return Infinity;
  return tmin >= 0 ? tmin : 0;
}

export function rayWorld(
  colliders: readonly AABB[],
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxDist: number,
): RayHit | null {
  let best: RayHit | null = null;
  for (let i = 0; i < colliders.length; i++) {
    const c = colliders[i];
    const t = rayAABB(ox, oy, oz, dx, dy, dz, c);
    if (t <= maxDist && (best === null || t < best.t)) best = { t, collider: c };
  }
  return best;
}

/** Is line from a to b unobstructed by world geometry? */
export function lineOfSight(
  colliders: readonly AABB[],
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
  const dist = Math.hypot(dx, dy, dz);
  if (dist < 1e-5) return true;
  const hit = rayWorld(colliders, ax, ay, az, dx / dist, dy / dist, dz / dist, dist - 0.08);
  return hit === null;
}

function verticalOverlap(feetY: number, topY: number, b: AABB): boolean {
  return feetY < b.maxY - 0.02 && topY > b.minY + 0.02;
}

function xzOverlap(px: number, pz: number, hx: number, hz: number, b: AABB): boolean {
  return px + hx > b.minX && px - hx < b.maxX && pz + hz > b.minZ && pz - hz < b.maxZ;
}

/**
 * Axis-separated movement resolution. Treats the mover as an AABB in XZ.
 * Returns the resolved position (mutates the passed values through the result).
 */
export function moveWithCollision(
  colliders: readonly AABB[],
  x: number,
  z: number,
  hx: number,
  hz: number,
  feetY: number,
  height: number,
  dx: number,
  dz: number,
): { x: number; z: number; hitX: boolean; hitZ: boolean } {
  const topY = feetY + height;
  let nx = x + dx;
  let hitX = false;
  if (dx !== 0) {
    for (let i = 0; i < colliders.length; i++) {
      const b = colliders[i];
      if (!verticalOverlap(feetY, topY, b)) continue;
      if (nx + hx > b.minX && nx - hx < b.maxX && z + hz > b.minZ && z - hz < b.maxZ) {
        if (dx > 0) nx = b.minX - hx - 0.001;
        else nx = b.maxX + hx + 0.001;
        hitX = true;
      }
    }
  }

  let nz = z + dz;
  let hitZ = false;
  if (dz !== 0) {
    for (let i = 0; i < colliders.length; i++) {
      const b = colliders[i];
      if (!verticalOverlap(feetY, topY, b)) continue;
      if (nx + hx > b.minX && nx - hx < b.maxX && nz + hz > b.minZ && nz - hz < b.maxZ) {
        if (dz > 0) nz = b.minZ - hz - 0.001;
        else nz = b.maxZ + hz + 0.001;
        hitZ = true;
      }
    }
  }
  return { x: nx, z: nz, hitX, hitZ };
}

/** Highest walkable surface at (x,z) not above feetY + step allowance. */
export function groundHeightAt(
  colliders: readonly AABB[],
  x: number,
  z: number,
  hx: number,
  hz: number,
  feetY: number,
  maxStep = 0.35,
): number {
  let g = 0;
  for (let i = 0; i < colliders.length; i++) {
    const b = colliders[i];
    if (b.maxY > feetY + maxStep) continue;
    if (x + hx > b.minX && x - hx < b.maxX && z + hz > b.minZ && z - hz < b.maxZ) {
      if (b.maxY > g) g = b.maxY;
    }
  }
  return g;
}

/** Point (as a small AABB) is inside any collider (used for spawn sanity). */
export function isInsideSolid(colliders: readonly AABB[], x: number, z: number, hx: number, hz: number, feetY: number, height: number): boolean {
  const topY = feetY + height;
  for (let i = 0; i < colliders.length; i++) {
    const b = colliders[i];
    if (verticalOverlap(feetY, topY, b) && xzOverlap(x, z, hx, hz, b)) return true;
  }
  return false;
}

import type { AABB, FloorRect, Rect } from './types';
import { GRAVITY, STEP_UP } from './config';

export function makeBox(cx: number, cz: number, w: number, d: number, y0: number, y1: number): AABB {
  return {
    minX: cx - w / 2,
    minY: y0,
    minZ: cz - d / 2,
    maxX: cx + w / 2,
    maxY: y1,
    maxZ: cz + d / 2,
  };
}

export function pointInRect(r: Rect, x: number, z: number): boolean {
  return x >= r.x1 && x <= r.x2 && z >= r.z1 && z <= r.z2;
}

/** slab ray vs AABB. returns t in [0, maxT] or -1 */
export function rayAABB(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  b: AABB, maxT: number,
): number {
  let tmin = 0;
  let tmax = maxT;

  if (Math.abs(dx) < 1e-9) {
    if (ox < b.minX || ox > b.maxX) return -1;
  } else {
    let t1 = (b.minX - ox) / dx;
    let t2 = (b.maxX - ox) / dx;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return -1;
  }

  if (Math.abs(dy) < 1e-9) {
    if (oy < b.minY || oy > b.maxY) return -1;
  } else {
    let t1 = (b.minY - oy) / dy;
    let t2 = (b.maxY - oy) / dy;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return -1;
  }

  if (Math.abs(dz) < 1e-9) {
    if (oz < b.minZ || oz > b.maxZ) return -1;
  } else {
    let t1 = (b.minZ - oz) / dz;
    let t2 = (b.maxZ - oz) / dz;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return -1;
  }

  return tmin;
}

export interface RayHit {
  t: number;
  nx: number;
  ny: number;
  nz: number;
}

/** nearest hit against a set of AABBs, or null */
export function raycastBoxes(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  maxDist: number,
  boxes: AABB[],
): RayHit | null {
  let best = maxDist;
  let bestBox: AABB | null = null;
  for (let i = 0; i < boxes.length; i++) {
    const t = rayAABB(ox, oy, oz, dx, dy, dz, boxes[i], best);
    if (t >= 0 && t < best) {
      best = t;
      bestBox = boxes[i];
    }
  }
  if (!bestBox) return null;
  // figure out which face was entered
  const px = ox + dx * best;
  const py = oy + dy * best;
  const pz = oz + dz * best;
  const eps = 1e-3;
  let nx = 0, ny = 0, nz = 0;
  const b = bestBox;
  if (Math.abs(px - b.minX) < eps) nx = -1;
  else if (Math.abs(px - b.maxX) < eps) nx = 1;
  else if (Math.abs(py - b.minY) < eps) ny = -1;
  else if (Math.abs(py - b.maxY) < eps) ny = 1;
  else if (Math.abs(pz - b.minZ) < eps) nz = -1;
  else nz = 1;
  return { t: best, nx, ny, nz };
}

/** highest floor at (x, z) whose top is not above refY (for step-up) */
export function groundAt(floors: FloorRect[], x: number, z: number, refY: number): number {
  let g = -100;
  for (let i = 0; i < floors.length; i++) {
    const f = floors[i];
    if (x >= f.x1 && x <= f.x2 && z >= f.z1 && z <= f.z2 && f.y <= refY && f.y > g) {
      g = f.y;
    }
  }
  return g;
}

/**
 * Move an AABB body (feet-origin position) with axis-separated wall
 * resolution and ground support from floor rects + solid tops.
 * Mutates pos/vel. Returns onGround.
 */
export function moveBody(
  pos: { x: number; y: number; z: number },
  vel: { x: number; y: number; z: number },
  radius: number,
  height: number,
  dt: number,
  solids: AABB[],
  floors: FloorRect[],
): boolean {
  const dx = vel.x * dt;
  if (dx !== 0) {
    pos.x += dx;
    resolveAxis(pos, radius, height, solids, 0, dx > 0);
  }
  const dz = vel.z * dt;
  if (dz !== 0) {
    pos.z += dz;
    resolveAxis(pos, radius, height, solids, 2, dz > 0);
  }

  vel.y -= GRAVITY * dt;
  pos.y += vel.y * dt;

  let support = groundAt(floors, pos.x, pos.z, pos.y + STEP_UP);
  const r7 = radius * 0.7;
  for (let i = 0; i < solids.length; i++) {
    const b = solids[i];
    if (pos.x + r7 <= b.minX || pos.x - r7 >= b.maxX) continue;
    if (pos.z + r7 <= b.minZ || pos.z - r7 >= b.maxZ) continue;
    if (b.maxY <= pos.y + STEP_UP && b.maxY > support) support = b.maxY;
  }

  if (pos.y <= support + 0.001 && vel.y <= 0) {
    pos.y = support;
    vel.y = 0;
    return true;
  }
  return false;
}

function resolveAxis(
  pos: { x: number; y: number; z: number },
  radius: number,
  height: number,
  solids: AABB[],
  axis: 0 | 2,
  positive: boolean,
): void {
  const minY = pos.y + 0.05;
  const maxY = pos.y + height - 0.02;
  for (let i = 0; i < solids.length; i++) {
    const b = solids[i];
    if (maxY <= b.minY || minY >= b.maxY) continue;
    if (pos.z + radius <= b.minZ || pos.z - radius >= b.maxZ) continue;
    if (pos.x + radius <= b.minX || pos.x - radius >= b.maxX) continue;
    if (axis === 0) {
      pos.x = positive ? b.minX - radius : b.maxX + radius;
    } else {
      pos.z = positive ? b.minZ - radius : b.maxZ + radius;
    }
  }
}

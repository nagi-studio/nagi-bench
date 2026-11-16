import type { Vec3 } from './math';
import { v3 } from './math';
import type { Collider, MapData } from './map';
import { floorHeightAt } from './map';

export const PLAYER_RADIUS = 0.35;
export const PLAYER_HEIGHT = 1.8;
export const EYE_HEIGHT = 1.62;
export const STEP_HEIGHT = 0.5;
export const GRAVITY = 22;
export const JUMP_VEL = 6.4;

export interface RayHit {
  t: number;
  point: Vec3;
  normal: Vec3;
  collider: Collider;
}

/** Slab-method ray vs AABB. Returns entry distance or null. */
export function rayBox(origin: Vec3, dir: Vec3, min: Vec3, max: Vec3, maxT: number): { t: number; normal: Vec3 } | null {
  let tmin = 0;
  let tmax = maxT;
  let nAxis = -1;
  let nSign = 0;
  for (let a = 0; a < 3; a++) {
    const o = a === 0 ? origin.x : a === 1 ? origin.y : origin.z;
    const d = a === 0 ? dir.x : a === 1 ? dir.y : dir.z;
    const lo = a === 0 ? min.x : a === 1 ? min.y : min.z;
    const hi = a === 0 ? max.x : a === 1 ? max.y : max.z;
    if (Math.abs(d) < 1e-9) {
      if (o < lo || o > hi) return null;
      continue;
    }
    let t1 = (lo - o) / d;
    let t2 = (hi - o) / d;
    let sign = -1;
    if (t1 > t2) {
      const tmp = t1; t1 = t2; t2 = tmp;
      sign = 1;
    }
    if (t1 > tmin) {
      tmin = t1;
      nAxis = a;
      nSign = sign;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }
  if (nAxis < 0) return null; // origin inside box
  const normal = v3();
  if (nAxis === 0) normal.x = nSign;
  else if (nAxis === 1) normal.y = nSign;
  else normal.z = nSign;
  return { t: tmin, normal };
}

/** Nearest static world hit along a ray. */
export function raycastWorld(map: MapData, origin: Vec3, dir: Vec3, maxDist: number): RayHit | null {
  let best: RayHit | null = null;
  for (const c of map.colliders) {
    const h = rayBox(origin, dir, c.min, c.max, maxDist);
    if (h && (!best || h.t < best.t)) {
      best = {
        t: h.t,
        point: { x: origin.x + dir.x * h.t, y: origin.y + dir.y * h.t, z: origin.z + dir.z * h.t },
        normal: h.normal,
        collider: c,
      };
    }
  }
  return best;
}

/** Line of sight between two points, blocked by any world collider. */
export function hasLOS(map: MapData, from: Vec3, to: Vec3): boolean {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (dist < 0.001) return true;
  const dir = { x: dx / dist, y: dy / dist, z: dz / dist };
  const hit = raycastWorld(map, from, dir, dist - 0.15);
  return !hit;
}

function overlapsXZ(pos: Vec3, r: number, c: Collider): boolean {
  return pos.x + r > c.min.x && pos.x - r < c.max.x && pos.z + r > c.min.z && pos.z - r < c.max.z;
}

export interface MoveResult {
  pos: Vec3;
  vel: Vec3;
  onGround: boolean;
}

/**
 * Axis-separated AABB movement with auto-step. `pos` is the feet position.
 * Handles walls, crates, doors, stairs, ceilings and per-cell floor heights.
 */
export function moveEntity(
  map: MapData,
  pos: Vec3,
  vel: Vec3,
  dt: number,
  radius = PLAYER_RADIUS,
  height = PLAYER_HEIGHT,
): MoveResult {
  const p = { x: pos.x, y: pos.y, z: pos.z };
  const v = { x: vel.x, y: vel.y, z: vel.z };
  let onGround = false;

  const tryStepUp = (top: number): boolean => {
    if (top > p.y - 0.02 && top - p.y <= STEP_HEIGHT) {
      p.y = top;
      return true;
    }
    return false;
  };

  // --- horizontal X ---
  p.x += v.x * dt;
  for (const c of map.colliders) {
    if (!overlapsXZ(p, radius, c)) continue;
    if (p.y >= c.max.y - 0.02 || p.y + height <= c.min.y + 0.02) continue;
    if (tryStepUp(c.max.y)) continue;
    if (v.x > 0) p.x = c.min.x - radius - 0.001;
    else if (v.x < 0) p.x = c.max.x + radius + 0.001;
    v.x = 0;
  }
  // --- horizontal Z ---
  p.z += v.z * dt;
  for (const c of map.colliders) {
    if (!overlapsXZ(p, radius, c)) continue;
    if (p.y >= c.max.y - 0.02 || p.y + height <= c.min.y + 0.02) continue;
    if (tryStepUp(c.max.y)) continue;
    if (v.z > 0) p.z = c.min.z - radius - 0.001;
    else if (v.z < 0) p.z = c.max.z + radius + 0.001;
    v.z = 0;
  }

  // climb onto higher floor cells (catwalk entries handled by stairs + this)
  const fh = floorHeightAt(map, p.x, p.z);
  if (fh > p.y && fh - p.y <= STEP_HEIGHT && v.y <= 0.01) {
    p.y = fh;
    onGround = true;
  }

  // --- vertical ---
  const prevFeet = p.y;
  const prevHead = p.y + height;
  v.y -= GRAVITY * dt;
  p.y += v.y * dt;

  // support: cell floor + tops of boxes under the footprint
  let support = floorHeightAt(map, p.x, p.z);
  for (const c of map.colliders) {
    if (c.kind === 'ceiling') continue;
    if (!overlapsXZ(p, radius, c)) continue;
    if (c.max.y <= prevFeet + 0.02 && c.max.y > support) support = c.max.y;
  }
  if (v.y <= 0 && p.y <= support + 0.02 && prevFeet >= support - 0.05) {
    p.y = support;
    v.y = 0;
    onGround = true;
  }
  // ceilings / undersides
  for (const c of map.colliders) {
    if (!overlapsXZ(p, radius, c)) continue;
    if (v.y > 0 && prevHead <= c.min.y + 0.02 && p.y + height > c.min.y) {
      p.y = c.min.y - height - 0.001;
      v.y = 0;
    }
  }
  // standing still on support
  if (!onGround && v.y <= 0 && Math.abs(p.y - support) < 0.03 && prevFeet >= support - 0.05) {
    p.y = support;
    v.y = 0;
    onGround = true;
  }

  return { pos: p, vel: v, onGround };
}

/** Ground height used for spawning / placement. */
export function groundAt(map: MapData, x: number, z: number): number {
  let g = floorHeightAt(map, x, z);
  for (const c of map.colliders) {
    if (c.kind === 'ceiling' || c.kind === 'door') continue;
    if (x > c.min.x && x < c.max.x && z > c.min.z && z < c.max.z && c.max.y > g && c.max.y < 3) {
      g = c.max.y;
    }
  }
  return g;
}

import type { Vec3 } from '../core/math.ts';
import type { HitboxGroup } from '../core/types.ts';

export interface HitboxDef {
  group: HitboxGroup;
  /** Centre in actor-local space: origin at the feet, +Y up, -Z forward. */
  cx: number;
  cy: number;
  cz: number;
  sx: number;
  sy: number;
  sz: number;
}

export const PLAYER_HEIGHT = 1.82;
export const PLAYER_EYE = 1.64;
export const PLAYER_CROUCH_SCALE = 0.72;
export const PLAYER_RADIUS = 0.38;
/** Broadphase sphere so we can skip actors quickly during bullet traces. */
export const PLAYER_BOUND_RADIUS = 1.15;

/**
 * The humanoid hitbox stack. The renderer builds its character model from the
 * same numbers (see render/character.ts) so what you see is what you hit.
 */
export const HITBOXES: HitboxDef[] = [
  { group: 'head', cx: 0, cy: 1.68, cz: 0, sx: 0.26, sy: 0.29, sz: 0.26 },
  { group: 'chest', cx: 0, cy: 1.33, cz: 0, sx: 0.48, sy: 0.44, sz: 0.3 },
  { group: 'stomach', cx: 0, cy: 1.0, cz: 0, sx: 0.42, sy: 0.32, sz: 0.28 },
  { group: 'arm', cx: -0.33, cy: 1.24, cz: -0.02, sx: 0.19, sy: 0.62, sz: 0.19 },
  { group: 'arm', cx: 0.33, cy: 1.24, cz: -0.02, sx: 0.19, sy: 0.62, sz: 0.19 },
  // The two leg boxes deliberately overlap the centre line: a shot straight
  // down the middle must hit a leg, not slip through the gap.
  { group: 'leg', cx: -0.115, cy: 0.43, cz: 0, sx: 0.25, sy: 0.88, sz: 0.26 },
  { group: 'leg', cx: 0.115, cy: 0.43, cz: 0, sx: 0.25, sy: 0.88, sz: 0.26 },
];

export interface HitboxHit {
  dist: number;
  group: HitboxGroup;
  point: Vec3;
}

/**
 * Ray vs a posed humanoid. The ray is transformed into the actor's local frame
 * (yaw only) and tested against the box stack; the closest box wins.
 */
export function raycastActor(
  origin: Vec3,
  dir: Vec3,
  maxDist: number,
  actorPos: Vec3,
  actorYaw: number,
  heightScale = 1,
): HitboxHit | null {
  // Broadphase: distance from actor centre line to the ray.
  const px = actorPos.x - origin.x;
  const pz = actorPos.z - origin.z;
  const py = actorPos.y + PLAYER_HEIGHT * 0.5 * heightScale - origin.y;
  const along = px * dir.x + py * dir.y + pz * dir.z;
  if (along < -PLAYER_BOUND_RADIUS || along > maxDist + PLAYER_BOUND_RADIUS) return null;
  const cx = px - dir.x * along;
  const cy = py - dir.y * along;
  const cz = pz - dir.z * along;
  if (cx * cx + cy * cy + cz * cz > PLAYER_BOUND_RADIUS * PLAYER_BOUND_RADIUS) return null;

  // World -> actor local (inverse yaw rotation).
  const s = Math.sin(-actorYaw);
  const c = Math.cos(-actorYaw);
  const ox = px * c - pz * s;
  const oz = px * s + pz * c;
  const dx = dir.x * c - dir.z * s;
  const dz = dir.x * s + dir.z * c;
  // Local ray origin relative to the actor's feet.
  const lo: Vec3 = { x: -ox, y: origin.y - actorPos.y, z: -oz };
  const ld: Vec3 = { x: dx, y: dir.y, z: dz };

  let best: HitboxHit | null = null;
  for (const hb of HITBOXES) {
    const t = rayAabb(
      lo,
      ld,
      hb.cx - hb.sx / 2,
      (hb.cy - hb.sy / 2) * heightScale,
      hb.cz - hb.sz / 2,
      hb.cx + hb.sx / 2,
      (hb.cy + hb.sy / 2) * heightScale,
      hb.cz + hb.sz / 2,
      maxDist,
    );
    if (t !== null && (!best || t < best.dist)) {
      best = {
        dist: t,
        group: hb.group,
        point: { x: origin.x + dir.x * t, y: origin.y + dir.y * t, z: origin.z + dir.z * t },
      };
    }
  }
  return best;
}

function rayAabb(
  o: Vec3,
  d: Vec3,
  minX: number,
  minY: number,
  minZ: number,
  maxX: number,
  maxY: number,
  maxZ: number,
  maxDist: number,
): number | null {
  let tmin = 0;
  let tmax = maxDist;
  const lo = [minX, minY, minZ];
  const hi = [maxX, maxY, maxZ];
  const oo = [o.x, o.y, o.z];
  const dd = [d.x, d.y, d.z];
  for (let a = 0; a < 3; a++) {
    if (Math.abs(dd[a]) < 1e-9) {
      if (oo[a] < lo[a] || oo[a] > hi[a]) return null;
      continue;
    }
    const inv = 1 / dd[a];
    let t1 = (lo[a] - oo[a]) * inv;
    let t2 = (hi[a] - oo[a]) * inv;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }
  return tmin > 0 ? tmin : null;
}

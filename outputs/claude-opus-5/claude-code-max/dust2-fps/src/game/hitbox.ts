/**
 * Hitbox model.
 *
 * Actors are hit-tested against per-limb boxes in their own local space (origin at the
 * feet, forward = -Z, right = +X — the same frame the character mesh is built in), so the
 * boxes line up with what the player sees.
 */

import { Vec3, unrotateY } from '../core/math.ts';
import { ACTOR_CROUCH_HEIGHT, ACTOR_HEIGHT } from './constants.ts';

export const HIT_PARTS = ['head', 'chest', 'stomach', 'arm', 'leg'] as const;
export type HitPart = (typeof HIT_PARTS)[number];

/**
 * Damage multipliers per zone. The brief specifies headshots do exactly twice body damage
 * (retail CS uses 4x), so `head` is 2x the `chest` value.
 */
export const HIT_MULTIPLIER: Record<HitPart, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.25,
  arm: 0.75,
  leg: 0.75,
};

export const HIT_LABEL: Record<HitPart, string> = {
  head: '头部',
  chest: '胸部',
  stomach: '腹部',
  arm: '手臂',
  leg: '腿部',
};

export interface LocalHitbox {
  part: HitPart;
  x0: number;
  y0: number;
  z0: number;
  x1: number;
  y1: number;
  z1: number;
}

/** Standing hitboxes, expressed as fractions of ACTOR_HEIGHT so crouching just scales Y. */
const BOXES: LocalHitbox[] = [
  { part: 'head', x0: -0.13, x1: 0.13, y0: 1.55, y1: 1.79, z0: -0.15, z1: 0.13 },
  { part: 'chest', x0: -0.24, x1: 0.24, y0: 1.12, y1: 1.55, z0: -0.17, z1: 0.17 },
  { part: 'stomach', x0: -0.21, x1: 0.21, y0: 0.86, y1: 1.12, z0: -0.16, z1: 0.16 },
  { part: 'arm', x0: -0.45, x1: -0.24, y0: 0.92, y1: 1.52, z0: -0.15, z1: 0.15 },
  { part: 'arm', x0: 0.24, x1: 0.45, y0: 0.92, y1: 1.52, z0: -0.24, z1: 0.15 },
  { part: 'leg', x0: -0.22, x1: -0.02, y0: 0.0, y1: 0.88, z0: -0.16, z1: 0.16 },
  { part: 'leg', x0: 0.02, x1: 0.22, y0: 0.0, y1: 0.88, z0: -0.16, z1: 0.16 },
];

export interface HitboxTestResult {
  distance: number;
  part: HitPart;
}

const localOrigin = { x: 0, z: 0 };
const localDir = { x: 0, z: 0 };

/**
 * Ray vs one actor. `pos` is the actor's feet position, `yaw` its facing.
 * Returns the closest limb hit within `maxDist`, or null.
 */
export function rayVsActor(
  origin: Vec3,
  dir: Vec3,
  maxDist: number,
  pos: Vec3,
  yaw: number,
  crouching: boolean,
): HitboxTestResult | null {
  const yScale = crouching ? ACTOR_CROUCH_HEIGHT / ACTOR_HEIGHT : 1;

  unrotateY(origin.x - pos.x, origin.z - pos.z, yaw, localOrigin);
  unrotateY(dir.x, dir.z, yaw, localDir);

  const ox = localOrigin.x;
  const oy = origin.y - pos.y;
  const oz = localOrigin.z;
  const dx = localDir.x;
  const dy = dir.y;
  const dz = localDir.z;

  // Cheap reject: bounding cylinder around the whole actor.
  const proj = -(ox * dx + oz * dz);
  const closest = Math.max(0, Math.min(maxDist, proj));
  const cxDist = Math.hypot(ox + dx * closest, oz + dz * closest);
  if (cxDist > 0.75) return null;

  const invX = dx !== 0 ? 1 / dx : Infinity;
  const invY = dy !== 0 ? 1 / dy : Infinity;
  const invZ = dz !== 0 ? 1 / dz : Infinity;

  let best: HitboxTestResult | null = null;

  for (const b of BOXES) {
    let tMin = 0;
    let tMax = best ? best.distance : maxDist;

    // X slab
    if (Number.isFinite(invX)) {
      let t1 = (b.x0 - ox) * invX;
      let t2 = (b.x1 - ox) * invX;
      if (t1 > t2) [t1, t2] = [t2, t1];
      tMin = Math.max(tMin, t1);
      tMax = Math.min(tMax, t2);
    } else if (ox < b.x0 || ox > b.x1) continue;

    // Y slab (scaled for crouch)
    const y0 = b.y0 * yScale;
    const y1 = b.y1 * yScale;
    if (Number.isFinite(invY)) {
      let t1 = (y0 - oy) * invY;
      let t2 = (y1 - oy) * invY;
      if (t1 > t2) [t1, t2] = [t2, t1];
      tMin = Math.max(tMin, t1);
      tMax = Math.min(tMax, t2);
    } else if (oy < y0 || oy > y1) continue;

    // Z slab
    if (Number.isFinite(invZ)) {
      let t1 = (b.z0 - oz) * invZ;
      let t2 = (b.z1 - oz) * invZ;
      if (t1 > t2) [t1, t2] = [t2, t1];
      tMin = Math.max(tMin, t1);
      tMax = Math.min(tMax, t2);
    } else if (oz < b.z0 || oz > b.z1) continue;

    if (tMin <= tMax && tMin >= 0) {
      best = { distance: tMin, part: b.part };
    }
  }

  return best;
}

/** Aim point for a limb, in world space — used by the AI to lead its shots. */
export function aimPointFor(pos: Vec3, part: HitPart, crouching: boolean, out = new Vec3()): Vec3 {
  const yScale = crouching ? ACTOR_CROUCH_HEIGHT / ACTOR_HEIGHT : 1;
  const y = part === 'head' ? 1.66 : part === 'stomach' ? 1.0 : 1.32;
  return out.set(pos.x, pos.y + y * yScale, pos.z);
}

export function hitboxList(): readonly LocalHitbox[] {
  return BOXES;
}

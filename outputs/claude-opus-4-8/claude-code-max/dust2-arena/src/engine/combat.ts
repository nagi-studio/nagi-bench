// Per-zone hitbox raycast. Hitboxes live in the character's local frame (feet at
// y=0, facing -Z). A world-space ray is transformed into local space (undo yaw +
// translation) and slab-tested against each zone box; nearest entry wins.

import { HitZone } from './types';

interface LocalBox {
  min: [number, number, number];
  max: [number, number, number];
  zone: HitZone;
}

// Ordered head->legs; overlaps resolved by nearest t at test time.
const HITBOXES: LocalBox[] = [
  { min: [-0.14, 1.5, -0.16], max: [0.14, 1.79, 0.16], zone: HitZone.Head },
  { min: [-0.27, 1.12, -0.18], max: [0.27, 1.5, 0.18], zone: HitZone.Chest },
  { min: [-0.23, 0.82, -0.17], max: [0.23, 1.12, 0.17], zone: HitZone.Stomach },
  { min: [0.26, 0.9, -0.14], max: [0.46, 1.5, 0.14], zone: HitZone.Arm },
  { min: [-0.46, 0.9, -0.14], max: [-0.26, 1.5, 0.14], zone: HitZone.Arm },
  { min: [-0.24, 0.0, -0.17], max: [0.24, 0.82, 0.17], zone: HitZone.Leg },
];

export const CHAR_HEIGHT = 1.79;
export const CHAR_BOUND_R = 0.55; // broadphase radius (XZ)

export interface CharHit {
  zone: HitZone;
  t: number;
}

// Slab intersection of a ray with an axis-aligned box; returns entry t or -1.
function rayBox(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  min: [number, number, number], max: [number, number, number],
): number {
  let tmin = -Infinity;
  let tmax = Infinity;
  const o = [ox, oy, oz];
  const d = [dx, dy, dz];
  for (let a = 0; a < 3; a++) {
    if (Math.abs(d[a]) < 1e-8) {
      if (o[a] < min[a] || o[a] > max[a]) return -1;
    } else {
      const inv = 1 / d[a];
      let t1 = (min[a] - o[a]) * inv;
      let t2 = (max[a] - o[a]) * inv;
      if (t1 > t2) {
        const tmp = t1;
        t1 = t2;
        t2 = tmp;
      }
      if (t1 > tmin) tmin = t1;
      if (t2 < tmax) tmax = t2;
      if (tmin > tmax) return -1;
    }
  }
  if (tmax < 0) return -1;
  return tmin >= 0 ? tmin : tmax;
}

// px,py,pz = character feet position; yaw = facing. Ray in world space with unit
// dir. Returns nearest zone hit within maxT, or null.
export function raycastCharacter(
  px: number, py: number, pz: number, yaw: number,
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  maxT: number,
): CharHit | null {
  // Broadphase: distance from ray to the character's vertical axis.
  const rx = ox - px;
  const rz = oz - pz;
  // closest approach param along ray in XZ
  const proj = -(rx * dx + rz * dz);
  const cxp = rx + dx * Math.max(0, proj);
  const czp = rz + dz * Math.max(0, proj);
  if (cxp * cxp + czp * czp > CHAR_BOUND_R * CHAR_BOUND_R && proj > 0) {
    // may still clip if origin very close; fall through only when clearly outside
    if (proj > CHAR_BOUND_R) return null;
  }

  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const ry = oy - py;
  const lox = c * rx - s * rz;
  const loz = s * rx + c * rz;
  const loy = ry;
  const ldx = c * dx - s * dz;
  const ldz = s * dx + c * dz;
  const ldy = dy;

  let best: CharHit | null = null;
  for (const box of HITBOXES) {
    const t = rayBox(lox, loy, loz, ldx, ldy, ldz, box.min, box.max);
    if (t >= 0 && t <= maxT && (!best || t < best.t)) {
      best = { zone: box.zone, t };
    }
  }
  return best;
}

// Hitbox zones in character-local space (feet at origin, facing -Z). These match
// the procedural character model built in render/character.ts.

import type { V3 } from './math.ts';

export type HitGroup = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

export const HIT_MULT: Record<HitGroup, number> = {
  head: 2.0, // headshot = 2x body (chest)
  chest: 1.0,
  stomach: 0.9,
  arm: 0.75,
  leg: 0.6,
};

export const HIT_LABEL: Record<HitGroup, string> = {
  head: '头部',
  chest: '胸部',
  stomach: '腹部',
  arm: '手臂',
  leg: '腿部',
};

interface HitBox {
  group: HitGroup;
  min: [number, number, number];
  max: [number, number, number];
}

export const HITBOXES: HitBox[] = [
  { group: 'head', min: [-0.13, 1.49, -0.15], max: [0.13, 1.78, 0.13] },
  { group: 'chest', min: [-0.23, 1.13, -0.15], max: [0.23, 1.49, 0.14] },
  { group: 'stomach', min: [-0.2, 0.86, -0.13], max: [0.2, 1.13, 0.13] },
  // arms are raised into a weapon-holding pose (forward of the torso)
  { group: 'arm', min: [0.15, 1.05, -0.5], max: [0.34, 1.47, 0.08] },
  { group: 'arm', min: [-0.32, 1.1, -0.62], max: [-0.06, 1.45, -0.05] },
  { group: 'leg', min: [-0.21, 0.0, -0.16], max: [0.0, 0.86, 0.13] },
  { group: 'leg', min: [0.0, 0.0, -0.16], max: [0.21, 0.86, 0.13] },
];

export interface HitResult {
  t: number;
  group: HitGroup;
}

/** Ray vs all hitboxes of a character at `pos` with facing `yaw`. */
export function rayVsCharacter(o: V3, d: V3, maxT: number, pos: V3, yaw: number): HitResult | null {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const ox = o.x - pos.x;
  const oy = o.y - pos.y;
  const oz = o.z - pos.z;
  // rotate by -yaw into local space
  const lox = c * ox - s * oz;
  const loz = s * ox + c * oz;
  const ldx = c * d.x - s * d.z;
  const ldz = s * d.x + c * d.z;
  const lo = [lox, oy, loz];
  const ld = [ldx, d.y, ldz];
  let best: HitResult | null = null;
  let bestT = maxT;
  for (const hb of HITBOXES) {
    let tmin = 0;
    let tmax = bestT;
    let ok = true;
    for (let a = 0; a < 3; a++) {
      const inv = 1 / ld[a];
      let t1 = (hb.min[a] - lo[a]) * inv;
      let t2 = (hb.max[a] - lo[a]) * inv;
      if (Number.isNaN(t1) || Number.isNaN(t2)) {
        ok = false;
        break;
      }
      if (t1 > t2) {
        const tt = t1;
        t1 = t2;
        t2 = tt;
      }
      if (t1 > tmin) tmin = t1;
      if (t2 < tmax) tmax = t2;
      if (tmin > tmax) {
        ok = false;
        break;
      }
    }
    if (ok && tmin < bestT) {
      bestT = tmin;
      best = { t: tmin, group: hb.group };
    }
  }
  return best;
}

// Per-zone hitboxes in the soldier's local frame (feet origin, forward = -Z).
// Bullets are transformed into local space and slab-tested against each box,
// so zones follow the soldier's yaw and crouch exactly.

import { CROUCH_DROP } from '../config';
import type { HitZone } from '../weapons/WeaponDefs';

interface HitboxDef {
  zone: HitZone;
  min: [number, number, number];
  max: [number, number, number];
  upper: boolean;
}

export const LEG_TOP = 0.86;

export const HITBOXES: HitboxDef[] = [
  { zone: 'head', min: [-0.13, 1.5, -0.15], max: [0.13, 1.8, 0.13], upper: true },
  { zone: 'chest', min: [-0.23, 1.12, -0.15], max: [0.23, 1.5, 0.15], upper: true },
  { zone: 'stomach', min: [-0.2, LEG_TOP, -0.14], max: [0.2, 1.12, 0.14], upper: true },
  { zone: 'arm', min: [0.15, 1.08, -0.44], max: [0.32, 1.46, 0.06], upper: true },
  { zone: 'arm', min: [-0.22, 1.18, -0.62], max: [0.04, 1.34, -0.2], upper: true },
  { zone: 'leg', min: [-0.21, 0.0, -0.13], max: [-0.01, LEG_TOP, 0.13], upper: false },
  { zone: 'leg', min: [0.01, 0.0, -0.13], max: [0.21, LEG_TOP, 0.13], upper: false },
];

export interface HitTarget {
  pos: { x: number; y: number; z: number };
  yaw: number;
  crouch: number;
}

export interface ZoneHit {
  t: number;
  zone: HitZone;
}

export function raycastHitboxes(
  s: HitTarget,
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxT: number,
): ZoneHit | null {
  // broad phase: distance from ray to body center
  const cx = s.pos.x - ox, cy = s.pos.y + 0.9 - oy, cz = s.pos.z - oz;
  const along = cx * dx + cy * dy + cz * dz;
  if (along < -1.2 || along > maxT + 1.2) return null;
  const px = cx - dx * along, py = cy - dy * along, pz = cz - dz * along;
  if (px * px + py * py + pz * pz > 1.4 * 1.4) return null;

  // world -> local (rotate by -yaw)
  const c = Math.cos(s.yaw), sn = Math.sin(s.yaw);
  const rx = ox - s.pos.x, ry = oy - s.pos.y, rz = oz - s.pos.z;
  const lox = c * rx - sn * rz;
  const loz = sn * rx + c * rz;
  const ldx = c * dx - sn * dz;
  const ldz = sn * dx + c * dz;
  const lo = [lox, ry, loz];
  const ld = [ldx, dy, ldz];

  const drop = CROUCH_DROP * s.crouch;
  const legScale = (LEG_TOP - drop) / LEG_TOP;
  let best: ZoneHit | null = null;
  let bestT = maxT;
  for (const hb of HITBOXES) {
    const mn = [hb.min[0], hb.upper ? hb.min[1] - drop : hb.min[1] * legScale, hb.min[2]];
    const mx = [hb.max[0], hb.upper ? hb.max[1] - drop : hb.max[1] * legScale, hb.max[2]];
    let tmin = 0;
    let tmax = bestT;
    let ok = true;
    for (let a = 0; a < 3; a++) {
      if (Math.abs(ld[a]) < 1e-9) {
        if (lo[a] < mn[a] || lo[a] > mx[a]) {
          ok = false;
          break;
        }
        continue;
      }
      let t1 = (mn[a] - lo[a]) / ld[a];
      let t2 = (mx[a] - lo[a]) / ld[a];
      if (t1 > t2) {
        const tmp = t1;
        t1 = t2;
        t2 = tmp;
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
      best = { t: tmin, zone: hb.zone };
    }
  }
  return best;
}

// Humanoid proportions, holding poses, two-bone IK and hitboxes.
// Shared by the headless simulation (hit detection) and the renderer (character model),
// so what you see is exactly what you can hit.

import type { Vec3 } from './math.ts';
import type { HitGroup } from './weapons.ts';

export type HoldPose = 'rifle' | 'pistol' | 'knife' | 'bomb';

export const BODY = {
  upperArm: 0.31,
  foreArm: 0.3,
  shoulderR: { x: 0.235, y: 1.43, z: 0.0 } as Vec3,
  shoulderL: { x: -0.235, y: 1.43, z: 0.0 } as Vec3,
  hipY: 0.92,
  thigh: 0.44,
  shin: 0.44,
  headCenterY: 1.645,
  eyeHeight: 1.64,
  height: 1.82,
  radius: 0.4,
};

export interface PoseDef {
  /** where the weapon grip (right hand) sits, character-local */
  grip: Vec3;
  /** left hand target (character-local) */
  left: Vec3;
  poleR: Vec3;
  poleL: Vec3;
}

export const POSES: Record<HoldPose, PoseDef> = {
  rifle: {
    grip: { x: 0.09, y: 1.22, z: -0.18 },
    left: { x: 0.09, y: 1.26, z: -0.44 },
    poleR: { x: 0.9, y: 0.6, z: 0.3 },
    poleL: { x: -0.5, y: 0.7, z: -0.4 },
  },
  pistol: {
    grip: { x: 0.03, y: 1.33, z: -0.42 },
    left: { x: -0.005, y: 1.31, z: -0.4 },
    poleR: { x: 0.8, y: 0.8, z: 0.1 },
    poleL: { x: -0.8, y: 0.8, z: 0.1 },
  },
  knife: {
    grip: { x: 0.2, y: 1.12, z: -0.3 },
    left: { x: -0.3, y: 0.98, z: -0.12 },
    poleR: { x: 0.8, y: 0.5, z: 0.4 },
    poleL: { x: -0.6, y: 0.8, z: 0.4 },
  },
  bomb: {
    grip: { x: 0.08, y: 1.1, z: -0.34 },
    left: { x: -0.08, y: 1.1, z: -0.34 },
    poleR: { x: 0.8, y: 0.6, z: 0.3 },
    poleL: { x: -0.8, y: 0.6, z: 0.3 },
  },
};

/** Classic analytic two-bone IK. Returns elbow and (possibly clamped) hand positions. */
export function solveTwoBone(s: Vec3, t: Vec3, l1: number, l2: number, pole: Vec3): { elbow: Vec3; hand: Vec3 } {
  let dx = t.x - s.x;
  let dy = t.y - s.y;
  let dz = t.z - s.z;
  let d = Math.hypot(dx, dy, dz) || 1e-6;
  dx /= d;
  dy /= d;
  dz /= d;
  d = Math.min(d, (l1 + l2) * 0.999);
  d = Math.max(d, Math.abs(l1 - l2) + 1e-3);
  const hand = { x: s.x + dx * d, y: s.y + dy * d, z: s.z + dz * d };
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  // pole direction orthogonalised against the shoulder->hand axis
  let px = pole.x - s.x;
  let py = pole.y - s.y;
  let pz = pole.z - s.z;
  const pd = px * dx + py * dy + pz * dz;
  px -= dx * pd;
  py -= dy * pd;
  pz -= dz * pd;
  const pl = Math.hypot(px, py, pz) || 1;
  px /= pl;
  py /= pl;
  pz /= pl;
  return {
    elbow: { x: s.x + dx * a + px * h, y: s.y + dy * a + py * h, z: s.z + dz * a + pz * h },
    hand,
  };
}

export interface Hitbox {
  group: HitGroup;
  min: [number, number, number];
  max: [number, number, number];
}

/** A limb segment approximated by several small boxes (a coarse capsule). */
const segBoxes = (group: HitGroup, a: Vec3, b: Vec3, r: number, n = 3): Hitbox[] => {
  const out: Hitbox[] = [];
  for (let i = 0; i < n; i++) {
    const t0 = i / n;
    const t1 = (i + 1) / n;
    const p = { x: a.x + (b.x - a.x) * t0, y: a.y + (b.y - a.y) * t0, z: a.z + (b.z - a.z) * t0 };
    const q = { x: a.x + (b.x - a.x) * t1, y: a.y + (b.y - a.y) * t1, z: a.z + (b.z - a.z) * t1 };
    out.push({
      group,
      min: [Math.min(p.x, q.x) - r, Math.min(p.y, q.y) - r, Math.min(p.z, q.z) - r],
      max: [Math.max(p.x, q.x) + r, Math.max(p.y, q.y) + r, Math.max(p.z, q.z) + r],
    });
  }
  return out;
};

function buildHitboxes(pose: HoldPose): Hitbox[] {
  const p = POSES[pose];
  const R = solveTwoBone(BODY.shoulderR, p.grip, BODY.upperArm, BODY.foreArm, p.poleR);
  const L = solveTwoBone(BODY.shoulderL, p.left, BODY.upperArm, BODY.foreArm, p.poleL);
  return [
    { group: 'head', min: [-0.13, 1.5, -0.145], max: [0.13, 1.8, 0.135] },
    { group: 'chest', min: [-0.22, 1.16, -0.14], max: [0.22, 1.5, 0.13] },
    { group: 'stomach', min: [-0.19, 0.88, -0.12], max: [0.19, 1.16, 0.11] },
    { group: 'leg', min: [-0.2, 0, -0.13], max: [-0.01, 0.9, 0.12] },
    { group: 'leg', min: [0.01, 0, -0.13], max: [0.2, 0.9, 0.12] },
    ...segBoxes('arm', BODY.shoulderR, R.elbow, 0.055),
    ...segBoxes('arm', R.elbow, R.hand, 0.045),
    ...segBoxes('arm', BODY.shoulderL, L.elbow, 0.055),
    ...segBoxes('arm', L.elbow, L.hand, 0.045),
  ];
}

export const HITBOXES: Record<HoldPose, Hitbox[]> = {
  rifle: buildHitboxes('rifle'),
  pistol: buildHitboxes('pistol'),
  knife: buildHitboxes('knife'),
  bomb: buildHitboxes('bomb'),
};

/**
 * Ray vs a character's hitboxes. The character is at feet position `pos` rotated by `yaw`.
 * Returns nearest hit distance and group.
 */
export function rayHitboxes(
  boxes: Hitbox[],
  pos: Vec3,
  yaw: number,
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxT: number,
): { t: number; group: HitGroup } | null {
  // world -> local (inverse yaw rotation)
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const px = ox - pos.x;
  const py = oy - pos.y;
  const pz = oz - pos.z;
  const lox = px * c - pz * s;
  const loz = px * s + pz * c;
  const ldx = dx * c - dz * s;
  const ldz = dx * s + dz * c;
  const o = [lox, py, loz];
  const d = [ldx, dy, ldz];
  let best: { t: number; group: HitGroup } | null = null;
  let bestT = maxT;
  for (const b of boxes) {
    let tmin = 0;
    let tmax = bestT;
    let hit = true;
    for (let k = 0; k < 3; k++) {
      if (Math.abs(d[k]) < 1e-9) {
        if (o[k] < b.min[k] || o[k] > b.max[k]) {
          hit = false;
          break;
        }
        continue;
      }
      const inv = 1 / d[k];
      let t1 = (b.min[k] - o[k]) * inv;
      let t2 = (b.max[k] - o[k]) * inv;
      if (t1 > t2) {
        const tt = t1;
        t1 = t2;
        t2 = tt;
      }
      if (t1 > tmin) tmin = t1;
      if (t2 < tmax) tmax = t2;
      if (tmin > tmax) {
        hit = false;
        break;
      }
    }
    if (hit && tmin < bestT) {
      bestT = tmin;
      best = { t: tmin, group: b.group };
    }
  }
  return best;
}

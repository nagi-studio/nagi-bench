import * as THREE from 'three';
import { HitboxZone } from './types';
import { HITBOXES } from './characters/humanoid';
import { Actor } from './entities/actor';
import { GameMap } from './map/dust2';

export interface HitResult {
  actor: Actor;
  zone: HitboxZone;
  point: THREE.Vector3;
  dist: number;
}

// zone damage multipliers relative to base body damage.
// Headshot enforced to be 2x body (chest=1.0 => head=2.0 baseline; we boost).
const ZONE_MULT: Record<HitboxZone, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.25,
  arm: 0.6,
  leg: 0.55,
};

/** Ray vs axis-aligned box (slab). Returns entry t or null. */
function rayAABB(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  min: THREE.Vector3,
  max: THREE.Vector3
): number | null {
  let tmin = -Infinity;
  let tmax = Infinity;
  const o = [ox, oy, oz];
  const d = [dx, dy, dz];
  const mn = [min.x, min.y, min.z];
  const mx = [max.x, max.y, max.z];
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-8) {
      if (o[i] < mn[i] || o[i] > mx[i]) return null;
    } else {
      let t1 = (mn[i] - o[i]) / d[i];
      let t2 = (mx[i] - o[i]) / d[i];
      if (t1 > t2) [t1, t2] = [t2, t1];
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return null;
    }
  }
  if (tmax < 0) return null;
  return tmin >= 0 ? tmin : tmax;
}

/**
 * Hitscan from shooter along dir (world). Returns nearest enemy hit,
 * respecting walls (map LOS) and weapon range.
 */
export function hitscan(
  origin: THREE.Vector3,
  dir: THREE.Vector3,
  shooter: Actor,
  actors: Actor[],
  map: GameMap,
  range: number
): HitResult | null {
  let best: HitResult | null = null;
  for (const a of actors) {
    if (a === shooter || !a.alive || a.team === shooter.team) continue;
    const d2 =
      (a.pos.x - origin.x) ** 2 + (a.pos.z - origin.z) ** 2;
    if (d2 > range * range) continue;
    // transform ray into actor local space (inverse yaw about Y, translate)
    const cos = Math.cos(-a.yaw);
    const sin = Math.sin(-a.yaw);
    const rx = origin.x - a.pos.x;
    const rz = origin.z - a.pos.z;
    const ox = rx * cos - rz * sin;
    const oz = rx * sin + rz * cos;
    const oy = origin.y - a.pos.y;
    const ddx = dir.x * cos - dir.z * sin;
    const ddz = dir.x * sin + dir.z * cos;
    const ddy = dir.y;
    for (const hb of HITBOXES) {
      const t = rayAABB(ox, oy, oz, ddx, ddy, ddz, hb.min, hb.max);
      if (t === null || t > range) continue;
      const hitX = origin.x + dir.x * t;
      const hitZ = origin.z + dir.z * t;
      // wall occlusion check to the impact point
      if (!map.lineOfSight(origin.x, origin.z, hitX, hitZ)) continue;
      if (!best || t < best.dist) {
        best = {
          actor: a,
          zone: hb.zone,
          point: new THREE.Vector3(
            origin.x + dir.x * t,
            origin.y + dir.y * t,
            origin.z + dir.z * t
          ),
          dist: t,
        };
      }
    }
  }
  return best;
}

/**
 * Apply damage with zone multiplier, distance falloff and armor.
 * Returns { damage, killed, headshot }.
 */
export function applyDamage(
  victim: Actor,
  baseDamage: number,
  zone: HitboxZone,
  dist: number,
  falloff: number,
  armorPen: number
): { damage: number; killed: boolean; headshot: boolean } {
  let dmg = baseDamage * ZONE_MULT[zone];
  // distance falloff beyond 20m
  if (dist > 20) dmg *= Math.max(0.4, 1 - (dist - 20) * (falloff * 0.01));

  const headshot = zone === 'head';
  // armor reduces damage; helmet needed for head protection
  const protects = zone === 'head' ? victim.helmet : victim.armor > 0;
  if (protects && victim.armor > 0) {
    const reduced = dmg * armorPen;
    const armorDamage = (dmg - reduced) * 0.5;
    victim.armor = Math.max(0, victim.armor - armorDamage);
    dmg = reduced;
  }
  dmg = Math.round(dmg);
  victim.health -= dmg;
  const killed = victim.health <= 0;
  return { damage: dmg, killed, headshot };
}

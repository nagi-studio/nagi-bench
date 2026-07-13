// Weapon data table + per-zone damage. Extensible: add an entry to WEAPONS and
// a matching viewmodel/worldmodel builder in entities/weaponModels.ts.

import { HitZone, WeaponId, WeaponSlot } from './types';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  damage: number; // base, to chest, no armor
  armorPen: number; // fraction of damage kept vs armor (0..1)
  fireInterval: number; // seconds between shots
  automatic: boolean;
  magSize: number;
  reserve: number;
  reloadTime: number;
  range: number; // effective hitscan range (m)
  // recoil / accuracy (radians)
  recoilPitch: number; // upward kick per shot
  recoilYaw: number; // max horizontal kick per shot (± random)
  spreadPerShot: number; // inaccuracy added per shot
  baseSpread: number; // standing inaccuracy
  maxSpread: number;
  recoverRate: number; // spread recovered per second
  moveSpeedMul: number; // movement multiplier while held
  scoped?: boolean; // AWP: right-click 3D zoom + scope mask
  scopedFov?: number;
  isKnife?: boolean;
}

// Head is 2x body per the spec; other zones scale off chest.
export const ZONE_MULT: Record<HitZone, number> = {
  [HitZone.Head]: 2.0,
  [HitZone.Chest]: 1.0,
  [HitZone.Stomach]: 1.25,
  [HitZone.Arm]: 0.75,
  [HitZone.Leg]: 0.75,
};

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary',
    damage: 36, armorPen: 0.775, fireInterval: 0.1, automatic: true,
    magSize: 30, reserve: 90, reloadTime: 2.4, range: 90,
    recoilPitch: 0.019, recoilYaw: 0.011, spreadPerShot: 0.013,
    baseSpread: 0.006, maxSpread: 0.14, recoverRate: 0.5, moveSpeedMul: 0.92,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary',
    damage: 33, armorPen: 0.7, fireInterval: 0.09, automatic: true,
    magSize: 30, reserve: 90, reloadTime: 3.1, range: 90,
    recoilPitch: 0.011, recoilYaw: 0.006, spreadPerShot: 0.008,
    baseSpread: 0.005, maxSpread: 0.1, recoverRate: 0.55, moveSpeedMul: 0.94,
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary',
    damage: 115, armorPen: 0.975, fireInterval: 1.5, automatic: false,
    magSize: 10, reserve: 30, reloadTime: 3.7, range: 130,
    recoilPitch: 0.05, recoilYaw: 0.02, spreadPerShot: 0.2,
    baseSpread: 0.06, maxSpread: 0.3, recoverRate: 0.8, moveSpeedMul: 0.84,
    scoped: true, scopedFov: 25,
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary',
    damage: 26, armorPen: 0.47, fireInterval: 0.15, automatic: false,
    magSize: 20, reserve: 120, reloadTime: 2.2, range: 60,
    recoilPitch: 0.012, recoilYaw: 0.008, spreadPerShot: 0.011,
    baseSpread: 0.008, maxSpread: 0.11, recoverRate: 0.7, moveSpeedMul: 1.0,
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary',
    damage: 33, armorPen: 0.505, fireInterval: 0.17, automatic: false,
    magSize: 12, reserve: 24, reloadTime: 2.2, range: 60,
    recoilPitch: 0.012, recoilYaw: 0.006, spreadPerShot: 0.01,
    baseSpread: 0.006, maxSpread: 0.1, recoverRate: 0.7, moveSpeedMul: 1.0,
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary',
    damage: 55, armorPen: 0.93, fireInterval: 0.225, automatic: false,
    magSize: 7, reserve: 35, reloadTime: 2.2, range: 75,
    recoilPitch: 0.032, recoilYaw: 0.012, spreadPerShot: 0.02,
    baseSpread: 0.009, maxSpread: 0.14, recoverRate: 0.6, moveSpeedMul: 0.96,
  },
  knife: {
    id: 'knife', name: 'Knife', slot: 'melee',
    damage: 55, armorPen: 0.85, fireInterval: 0.4, automatic: false,
    magSize: Infinity, reserve: Infinity, reloadTime: 0, range: 2.4,
    recoilPitch: 0, recoilYaw: 0, spreadPerShot: 0,
    baseSpread: 0, maxSpread: 0, recoverRate: 1, moveSpeedMul: 1.05,
    isKnife: true,
  },
};

export interface DamageResult {
  health: number;
  armor: number;
  applied: number;
}

// Apply zone + armor model. Head protected only with a helmet; legs never armored.
export function computeDamage(
  weapon: WeaponDef,
  zone: HitZone,
  health: number,
  armor: number,
  helmet: boolean,
): DamageResult {
  let dmg = weapon.damage * ZONE_MULT[zone];
  let armorLeft = armor;
  const protectable = zone !== HitZone.Leg && (zone !== HitZone.Head || helmet);
  if (armorLeft > 0 && protectable) {
    const preArmor = dmg;
    dmg *= weapon.armorPen;
    armorLeft = Math.max(0, armorLeft - Math.round((preArmor - dmg) * 0.5 + dmg * 0.5));
  }
  const applied = Math.min(health, dmg);
  return { health: Math.max(0, health - dmg), armor: armorLeft, applied };
}

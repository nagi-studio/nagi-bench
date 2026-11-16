import type { HitPart, Slot, WeaponId } from './types';

/**
 * Data-driven weapon table. Adding a weapon = adding an entry here plus a
 * viewmodel builder in viewmodel.ts and a synth recipe in audio.ts.
 */
export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: Slot;
  damage: number; // base chest damage
  rpm: number;
  magSize: number;
  reserve: number;
  reloadTime: number;
  auto: boolean;
  /** base cone half-angle in radians */
  spreadBase: number;
  /** added cone per shot while spraying */
  bloomPerShot: number;
  bloomMax: number;
  bloomRecovery: number; // per second
  /** vertical view kick per shot (radians) */
  recoilPitch: number;
  recoilRecovery: number;
  /** horizontal kick magnitude */
  recoilYaw: number;
  moveSpeed: number; // m/s while held
  range: number;
  /** damage multiplier at max range */
  falloffMin: number;
  scope: boolean;
  scopedFov: number;
  /** number of world colliders (wood doors) a bullet can pass through */
  penetration: number;
  melee: boolean;
  meleeRange: number;
  heavyDamage?: number; // knife right click
}

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary',
    damage: 38, rpm: 600, magSize: 30, reserve: 90, reloadTime: 2.4,
    auto: true, spreadBase: 0.0045, bloomPerShot: 0.0075, bloomMax: 0.055,
    bloomRecovery: 0.09, recoilPitch: 0.030, recoilRecovery: 7.5, recoilYaw: 0.010,
    moveSpeed: 5.0, range: 300, falloffMin: 0.75, scope: false, scopedFov: 75,
    penetration: 2, melee: false, meleeRange: 0,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary',
    damage: 32, rpm: 666, magSize: 30, reserve: 90, reloadTime: 2.2,
    auto: true, spreadBase: 0.0035, bloomPerShot: 0.0042, bloomMax: 0.038,
    bloomRecovery: 0.11, recoilPitch: 0.016, recoilRecovery: 9.0, recoilYaw: 0.005,
    moveSpeed: 5.2, range: 300, falloffMin: 0.8, scope: false, scopedFov: 75,
    penetration: 2, melee: false, meleeRange: 0,
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary',
    damage: 200, rpm: 41, magSize: 10, reserve: 30, reloadTime: 3.4,
    auto: false, spreadBase: 0.0006, bloomPerShot: 0.02, bloomMax: 0.06,
    bloomRecovery: 0.08, recoilPitch: 0.09, recoilRecovery: 4.0, recoilYaw: 0.012,
    moveSpeed: 4.4, range: 400, falloffMin: 0.95, scope: true, scopedFov: 20,
    penetration: 3, melee: false, meleeRange: 0,
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary',
    damage: 26, rpm: 400, magSize: 20, reserve: 120, reloadTime: 1.9,
    auto: false, spreadBase: 0.006, bloomPerShot: 0.006, bloomMax: 0.04,
    bloomRecovery: 0.12, recoilPitch: 0.012, recoilRecovery: 10, recoilYaw: 0.004,
    moveSpeed: 5.6, range: 120, falloffMin: 0.6, scope: false, scopedFov: 75,
    penetration: 1, melee: false, meleeRange: 0,
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary',
    damage: 30, rpm: 352, magSize: 12, reserve: 24, reloadTime: 2.0,
    auto: false, spreadBase: 0.0045, bloomPerShot: 0.005, bloomMax: 0.035,
    bloomRecovery: 0.12, recoilPitch: 0.013, recoilRecovery: 10, recoilYaw: 0.004,
    moveSpeed: 5.6, range: 140, falloffMin: 0.65, scope: false, scopedFov: 75,
    penetration: 1, melee: false, meleeRange: 0,
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary',
    damage: 34, rpm: 267, magSize: 7, reserve: 35, reloadTime: 2.2,
    auto: false, spreadBase: 0.005, bloomPerShot: 0.016, bloomMax: 0.06,
    bloomRecovery: 0.1, recoilPitch: 0.045, recoilRecovery: 6.5, recoilYaw: 0.012,
    moveSpeed: 5.4, range: 200, falloffMin: 0.7, scope: false, scopedFov: 75,
    penetration: 2, melee: false, meleeRange: 0,
  },
  knife: {
    id: 'knife', name: '刀', slot: 'knife',
    damage: 40, rpm: 120, magSize: 0, reserve: 0, reloadTime: 0,
    auto: false, spreadBase: 0, bloomPerShot: 0, bloomMax: 0,
    bloomRecovery: 0, recoilPitch: 0, recoilRecovery: 0, recoilYaw: 0,
    moveSpeed: 6.2, range: 2.2, falloffMin: 1, scope: false, scopedFov: 75,
    penetration: 0, melee: true, meleeRange: 2.2, heavyDamage: 65,
  },
};

/** Hitbox damage multipliers — head is exactly 2x chest per spec. */
export const PART_MULT: Record<HitPart, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 0.9,
  arm: 0.75,
  leg: 0.75,
};

export const ARMOR_HP_FACTOR = 0.65; // armored body damage taken
export const ARMOR_ABSORB = 0.4; // armor points lost per point of raw damage

export const weaponOf = (id: WeaponId): WeaponDef => WEAPONS[id];

export function currentWeaponId(c: {
  slot: Slot;
  primary: WeaponId | null;
  secondary: WeaponId;
}): WeaponId {
  if (c.slot === 'primary' && c.primary) return c.primary;
  if (c.slot === 'secondary') return c.secondary;
  return 'knife';
}

export function applyArmor(raw: number, armor: number, part: HitPart): { hp: number; armorLost: number } {
  // Headshots bypass armor (helmet abstraction); body hits are reduced.
  if (armor <= 0 || part === 'head') return { hp: raw, armorLost: 0 };
  return { hp: raw * ARMOR_HP_FACTOR, armorLost: Math.min(armor, raw * ARMOR_ABSORB) };
}

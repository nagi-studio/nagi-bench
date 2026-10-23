import type { HitZone, Team, WeaponId, WeaponSlot, WeaponSpec } from './types';

export const WEAPONS: Record<WeaponId, WeaponSpec> = {
  ak47: { id: 'ak47', name: 'AK-47', shortName: 'AK', slot: 'primary', damage: 40, interval: 0.105, magazine: 30, reserve: 90, reloadTime: 2.35, range: 90, spread: 0.006, recoil: 0.029, automatic: true, moveSpeed: 4.5, tracer: 0xffc36b },
  m4a4: { id: 'm4a4', name: 'M4A4', shortName: 'M4', slot: 'primary', damage: 32, interval: 0.082, magazine: 30, reserve: 90, reloadTime: 2.1, range: 85, spread: 0.004, recoil: 0.014, automatic: true, moveSpeed: 4.65, tracer: 0xaedcff },
  awp: { id: 'awp', name: 'AWP', shortName: 'AWP', slot: 'primary', damage: 160, interval: 1.45, magazine: 5, reserve: 15, reloadTime: 3.2, range: 130, spread: 0.001, recoil: 0.065, automatic: false, moveSpeed: 3.9, tracer: 0xd8f2ff },
  glock: { id: 'glock', name: 'Glock-18', shortName: 'GLOCK', slot: 'secondary', damage: 26, interval: 0.16, magazine: 20, reserve: 80, reloadTime: 1.8, range: 45, spread: 0.009, recoil: 0.012, automatic: false, moveSpeed: 5, tracer: 0xffd59a },
  usp: { id: 'usp', name: 'USP-S', shortName: 'USP', slot: 'secondary', damage: 25, interval: 0.18, magazine: 12, reserve: 48, reloadTime: 1.9, range: 48, spread: 0.006, recoil: 0.011, automatic: false, moveSpeed: 5, tracer: 0xc9e9ff },
  deagle: { id: 'deagle', name: 'Desert Eagle', shortName: 'DEAGLE', slot: 'secondary', damage: 44, interval: 0.28, magazine: 7, reserve: 35, reloadTime: 2.15, range: 55, spread: 0.008, recoil: 0.031, automatic: false, moveSpeed: 4.9, tracer: 0xffe0a3 },
  knife: { id: 'knife', name: '战术刀', shortName: 'KNIFE', slot: 'knife', damage: 60, interval: 0.55, magazine: 1, reserve: 0, reloadTime: 0, range: 2.25, spread: 0, recoil: 0, automatic: false, moveSpeed: 5.5, tracer: 0xffffff },
};

export const ZONE_MULTIPLIER: Record<HitZone, number> = {
  head: 2,
  chest: 1,
  stomach: 1.1,
  arm: 0.9,
  leg: 0.85,
};

export function defaultPistol(team: Team): WeaponId {
  return team === 'T' ? 'glock' : 'usp';
}

export function defaultRifle(team: Team): WeaponId {
  return team === 'T' ? 'ak47' : 'm4a4';
}

export function slotFor(id: WeaponId): WeaponSlot {
  return WEAPONS[id].slot;
}

export interface WeaponRuntime {
  id: WeaponId;
  ammo: number;
  reserve: number;
  reloadRemaining: number;
}

export function createWeapon(id: WeaponId): WeaponRuntime {
  const spec = WEAPONS[id];
  return { id, ammo: spec.magazine, reserve: spec.reserve, reloadRemaining: 0 };
}

export function applyDamage(baseDamage: number, zone: HitZone, armor: number, distance: number, range: number, armorMultiplier = 0.5) {
  const falloff = Math.max(0.72, 1 - Math.max(0, distance - range * 0.45) / range * 0.45);
  let damage = baseDamage * ZONE_MULTIPLIER[zone] * falloff;
  let remainingArmor = armor;
  if (armor > 0 && zone !== 'leg') {
    damage *= armorMultiplier;
    remainingArmor = Math.max(0, armor - baseDamage * ZONE_MULTIPLIER[zone] * 0.35);
  }
  return { damage: Math.max(1, Math.round(damage)), armor: Math.round(remainingArmor) };
}

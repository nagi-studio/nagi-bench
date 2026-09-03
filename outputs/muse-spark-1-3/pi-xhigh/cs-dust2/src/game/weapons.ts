import type { HitZone, WeaponDef } from './types';

export const HIT_MULT: Record<HitZone, number> = {
  head: 2.0,
  chest: 1.0,
  belly: 0.9,
  arm: 0.7,
  leg: 0.6,
};

function w(d: WeaponDef): WeaponDef { return d; }

export const AK47 = w({
  id: 'ak47', name: 'AK-47', slot: 'primary', damage: 34, headMult: 2.0,
  rpm: 600, mag: 30, reserve: 90, spread: 0.028, recoil: 0.035,
  range: 60, auto: true, armorPen: 0.75,
});

export const M4A4 = w({
  id: 'm4a4', name: 'M4A4', slot: 'primary', damage: 26, headMult: 2.0,
  rpm: 750, mag: 30, reserve: 90, spread: 0.016, recoil: 0.016,
  range: 60, auto: true, armorPen: 0.7,
});

export const AWP = w({
  id: 'awp', name: 'AWP', slot: 'primary', damage: 110, headMult: 2.0,
  rpm: 40, mag: 5, reserve: 15, spread: 0.05, recoil: 0.09,
  range: 120, auto: false, scoped: true, armorPen: 0.95,
});

export const GLOCK = w({
  id: 'glock', name: 'Glock', slot: 'secondary', damage: 20, headMult: 2.0,
  rpm: 400, mag: 20, reserve: 60, spread: 0.02, recoil: 0.014,
  range: 40, auto: false, armorPen: 0.5,
});

export const USP = w({
  id: 'usp', name: 'USP', slot: 'secondary', damage: 22, headMult: 2.0,
  rpm: 350, mag: 12, reserve: 48, spread: 0.017, recoil: 0.013,
  range: 40, auto: false, armorPen: 0.5,
});

export const DEAGLE = w({
  id: 'deagle', name: 'Desert Eagle', slot: 'secondary', damage: 38, headMult: 2.0,
  rpm: 220, mag: 7, reserve: 28, spread: 0.014, recoil: 0.04,
  range: 45, auto: false, armorPen: 0.8,
});

export const KNIFE = w({
  id: 'knife', name: 'Knife', slot: 'melee', damage: 45, headMult: 1.0,
  rpm: 80, mag: Infinity, reserve: Infinity, spread: 0.0, recoil: 0.0,
  range: 2.2, auto: false, armorPen: 1.0,
});

export function cloneWeapon(d: WeaponDef): WeaponDef {
  return { ...d };
}

/** Damage after hit zone + armor. Headshots deal 2x body damage. */
export function calcDamage(base: WeaponDef, zone: HitZone, armor: number): number {
  let dmg = base.damage * (zone === 'head' ? base.headMult : HIT_MULT[zone]);
  if (armor > 0) {
    const absorbed = dmg * 0.5 * base.armorPen;
    dmg -= absorbed;
  }
  return Math.max(1, Math.round(dmg));
}

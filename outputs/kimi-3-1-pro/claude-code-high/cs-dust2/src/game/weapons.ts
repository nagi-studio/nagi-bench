import type { Slot, Team, WeaponId, WeaponSpec, WeaponState } from './types';

export const WEAPONS: Record<WeaponId, WeaponSpec> = {
  ak47: {
    id: 'ak47', name: 'AK-47', shortName: 'AK', slot: 'primary', damage: 48, rpm: 600,
    magazine: 30, reserve: 90, reload: 2.45, range: 120, automatic: true,
    spread: 0.003, moveSpread: 0.026, bloom: 0.009, recoil: 0.026, price: 2700, team: 'T',
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', shortName: 'M4', slot: 'primary', damage: 34, rpm: 750,
    magazine: 30, reserve: 90, reload: 2.1, range: 110, automatic: true,
    spread: 0.002, moveSpread: 0.018, bloom: 0.004, recoil: 0.013, price: 3100, team: 'CT',
  },
  awp: {
    id: 'awp', name: 'AWP', shortName: 'AWP', slot: 'primary', damage: 150, rpm: 41,
    magazine: 5, reserve: 15, reload: 3.7, range: 180, automatic: false,
    spread: 0.055, moveSpread: 0.07, bloom: 0.018, recoil: 0.065, price: 4750, zoom: 22,
  },
  glock: {
    id: 'glock', name: 'Glock-18', shortName: 'GLOCK', slot: 'secondary', damage: 24, rpm: 400,
    magazine: 20, reserve: 120, reload: 2.0, range: 70, automatic: false,
    spread: 0.006, moveSpread: 0.018, bloom: 0.006, recoil: 0.012, price: 200, team: 'T',
  },
  usp: {
    id: 'usp', name: 'USP-S', shortName: 'USP', slot: 'secondary', damage: 27, rpm: 352,
    magazine: 12, reserve: 60, reload: 2.2, range: 75, automatic: false,
    spread: 0.004, moveSpread: 0.015, bloom: 0.005, recoil: 0.011, price: 200, team: 'CT',
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', shortName: 'DEAGLE', slot: 'secondary', damage: 43, rpm: 267,
    magazine: 7, reserve: 35, reload: 2.2, range: 85, automatic: false,
    spread: 0.005, moveSpread: 0.027, bloom: 0.012, recoil: 0.032, price: 700,
  },
  knife: {
    id: 'knife', name: 'Tactical Knife', shortName: 'KNIFE', slot: 'melee', damage: 55, rpm: 90,
    magazine: 1, reserve: 0, reload: 0, range: 2.1, automatic: false,
    spread: 0, moveSpread: 0, bloom: 0, recoil: 0, price: 0,
  },
};

export const DEFAULT_PISTOL: Record<Team, WeaponId> = { CT: 'usp', T: 'glock' };

export function makeWeapon(id: WeaponId): WeaponState {
  const spec = WEAPONS[id];
  return { id, ammo: spec.magazine, reserve: spec.reserve };
}

export function weaponForSlot(entityWeapons: Partial<Record<Slot, WeaponState>>, slot: Slot): WeaponState {
  const weapon = entityWeapons[slot];
  if (!weapon) throw new Error(`No weapon in slot ${slot}`);
  return weapon;
}

export const BUY_ITEMS: { id: WeaponId | 'armor'; label: string; detail: string; price: number }[] = [
  { id: 'ak47', label: 'AK-47', detail: '高伤害 / 强后坐力', price: 2700 },
  { id: 'm4a4', label: 'M4A4', detail: '高射速 / 稳定', price: 3100 },
  { id: 'awp', label: 'AWP', detail: '单发致命 / 光学瞄具', price: 4750 },
  { id: 'deagle', label: 'Desert Eagle', detail: '7 发 / 高威力手枪', price: 700 },
  { id: 'armor', label: 'Kevlar + Helmet', detail: '护甲与头部防护', price: 650 },
];

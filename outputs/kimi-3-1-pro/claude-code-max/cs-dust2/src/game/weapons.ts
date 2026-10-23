import type { BuyItem, HitZone, WeaponId, WeaponSlot, WeaponState } from './types';

export interface WeaponDefinition {
  id: WeaponId;
  name: string;
  shortName: string;
  slot: WeaponSlot;
  damage: number;
  armorPenetration: number;
  magazine: number;
  reserve: number;
  fireInterval: number;
  reloadTime: number;
  automatic: boolean;
  range: number;
  baseSpread: number;
  moveSpread: number;
  heatSpread: number;
  recoilPitch: number;
  recoilYaw: number;
  price: number;
  tracer: number;
  zoneMultipliers: Record<HitZone, number>;
}

const STANDARD_ZONES: Record<HitZone, number> = {
  head: 2,
  chest: 1,
  abdomen: 1.1,
  arms: 0.8,
  legs: 0.75,
};

export const WEAPONS: Record<WeaponId, WeaponDefinition> = {
  ak47: {
    id: 'ak47', name: 'AK-47', shortName: 'AK', slot: 'primary', damage: 38,
    armorPenetration: 0.78, magazine: 30, reserve: 90, fireInterval: 0.1,
    reloadTime: 2.35, automatic: true, range: 120, baseSpread: 0.004,
    moveSpread: 0.026, heatSpread: 0.0038, recoilPitch: 0.025, recoilYaw: 0.009,
    price: 2700, tracer: 0xffcf8a, zoneMultipliers: STANDARD_ZONES,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', shortName: 'M4', slot: 'primary', damage: 33,
    armorPenetration: 0.82, magazine: 30, reserve: 90, fireInterval: 0.086,
    reloadTime: 2.1, automatic: true, range: 120, baseSpread: 0.003,
    moveSpread: 0.019, heatSpread: 0.0025, recoilPitch: 0.014, recoilYaw: 0.005,
    price: 3100, tracer: 0xffe5b0, zoneMultipliers: STANDARD_ZONES,
  },
  awp: {
    id: 'awp', name: 'AWP', shortName: 'AWP', slot: 'primary', damage: 120,
    armorPenetration: 0.97, magazine: 5, reserve: 15, fireInterval: 1.45,
    reloadTime: 3.65, automatic: false, range: 180, baseSpread: 0.055,
    moveSpread: 0.09, heatSpread: 0.002, recoilPitch: 0.075, recoilYaw: 0.004,
    price: 4750, tracer: 0xfff1c9,
    zoneMultipliers: { head: 2, chest: 1, abdomen: 1.1, arms: 0.9, legs: 0.85 },
  },
  glock: {
    id: 'glock', name: 'Glock-18', shortName: 'GLOCK', slot: 'secondary', damage: 23,
    armorPenetration: 0.6, magazine: 20, reserve: 120, fireInterval: 0.15,
    reloadTime: 2.1, automatic: false, range: 70, baseSpread: 0.007,
    moveSpread: 0.019, heatSpread: 0.004, recoilPitch: 0.012, recoilYaw: 0.004,
    price: 200, tracer: 0xffd79a, zoneMultipliers: STANDARD_ZONES,
  },
  usp: {
    id: 'usp', name: 'USP-S', shortName: 'USP', slot: 'secondary', damage: 25,
    armorPenetration: 0.64, magazine: 12, reserve: 48, fireInterval: 0.17,
    reloadTime: 2.0, automatic: false, range: 75, baseSpread: 0.005,
    moveSpread: 0.015, heatSpread: 0.0035, recoilPitch: 0.013, recoilYaw: 0.003,
    price: 200, tracer: 0xffe5b0, zoneMultipliers: STANDARD_ZONES,
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', shortName: 'DEAGLE', slot: 'secondary', damage: 32,
    armorPenetration: 0.9, magazine: 7, reserve: 35, fireInterval: 0.27,
    reloadTime: 2.2, automatic: false, range: 90, baseSpread: 0.009,
    moveSpread: 0.035, heatSpread: 0.007, recoilPitch: 0.04, recoilYaw: 0.008,
    price: 700, tracer: 0xffd28a, zoneMultipliers: STANDARD_ZONES,
  },
  knife: {
    id: 'knife', name: '战术刀', shortName: 'KNIFE', slot: 'melee', damage: 55,
    armorPenetration: 0.85, magazine: 0, reserve: 0, fireInterval: 0.58,
    reloadTime: 0, automatic: false, range: 1.85, baseSpread: 0,
    moveSpread: 0, heatSpread: 0, recoilPitch: 0, recoilYaw: 0,
    price: 0, tracer: 0xffffff,
    zoneMultipliers: { head: 2, chest: 1, abdomen: 1.1, arms: 0.8, legs: 0.75 },
  },
};

export const BUY_ITEMS: BuyItem[] = [
  { id: 'ak47', name: 'AK-47', description: '高伤害 · 强后坐力', price: 2700, slot: '主武器' },
  { id: 'm4a4', name: 'M4A4', description: '高射速 · 稳定精准', price: 3100, slot: '主武器' },
  { id: 'awp', name: 'AWP', description: '单发致命 · 右键开镜', price: 4750, slot: '主武器' },
  { id: 'deagle', name: 'Desert Eagle', description: '高伤手枪 · 7 发弹匣', price: 700, slot: '副武器' },
  { id: 'armor', name: '防弹衣 + 头盔', description: '头 / 躯干 / 手臂减伤', price: 650, slot: '装备' },
];

export function createWeapon(id: WeaponId): WeaponState {
  const definition = WEAPONS[id];
  return { id, ammo: definition.magazine, reserve: definition.reserve };
}

export function weaponForSlot(inventory: {
  primary: WeaponState | null;
  secondary: WeaponState;
  melee: WeaponState;
  active: WeaponSlot;
}): WeaponState {
  if (inventory.active === 'primary' && inventory.primary) return inventory.primary;
  if (inventory.active === 'melee') return inventory.melee;
  return inventory.secondary;
}

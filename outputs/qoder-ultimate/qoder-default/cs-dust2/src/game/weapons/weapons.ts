import { WeaponDef, WeaponId, Team } from '../types';

/**
 * Weapon definitions. Tuned for distinct feel:
 * - AK: high damage, heavy recoil
 * - M4: medium damage, low recoil, high RPM
 * - AWP: one-shot lethal, very slow, scoped
 * - pistols: lower damage, deagle in between with small mag
 * - knife: melee
 */
export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    slot: 'primary',
    damage: 36,
    rpm: 600,
    magSize: 30,
    reserveAmmo: 90,
    reloadTime: 2.4,
    recoilVertical: 0.028,
    recoilHorizontal: 0.012,
    bloomPerShot: 0.02,
    maxSpread: 0.16,
    recovery: 0.34,
    range: 90,
    falloff: 0.35,
    automatic: true,
    armorPen: 0.775,
    color: 0x6b4b2a,
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    slot: 'primary',
    damage: 28,
    rpm: 666,
    magSize: 30,
    reserveAmmo: 90,
    reloadTime: 2.6,
    recoilVertical: 0.016,
    recoilHorizontal: 0.007,
    bloomPerShot: 0.013,
    maxSpread: 0.11,
    recovery: 0.4,
    range: 90,
    falloff: 0.3,
    automatic: true,
    armorPen: 0.7,
    color: 0x2f3a3f,
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    slot: 'primary',
    damage: 115,
    rpm: 41,
    magSize: 10,
    reserveAmmo: 30,
    reloadTime: 3.6,
    recoilVertical: 0.09,
    recoilHorizontal: 0.02,
    bloomPerShot: 0.2,
    maxSpread: 0.25,
    recovery: 0.6,
    range: 120,
    falloff: 0.05,
    automatic: false,
    canScope: true,
    armorPen: 0.975,
    color: 0x22331f,
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    slot: 'secondary',
    damage: 14,
    rpm: 400,
    magSize: 20,
    reserveAmmo: 120,
    reloadTime: 2.0,
    recoilVertical: 0.012,
    recoilHorizontal: 0.006,
    bloomPerShot: 0.02,
    maxSpread: 0.12,
    recovery: 0.35,
    range: 50,
    falloff: 0.5,
    automatic: false,
    armorPen: 0.47,
    color: 0x1a1a1e,
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    slot: 'secondary',
    damage: 20,
    rpm: 352,
    magSize: 12,
    reserveAmmo: 24,
    reloadTime: 2.1,
    recoilVertical: 0.012,
    recoilHorizontal: 0.005,
    bloomPerShot: 0.018,
    maxSpread: 0.1,
    recovery: 0.38,
    range: 55,
    falloff: 0.45,
    automatic: false,
    armorPen: 0.505,
    color: 0x14141a,
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    slot: 'secondary',
    damage: 54,
    rpm: 267,
    magSize: 7,
    reserveAmmo: 35,
    reloadTime: 2.3,
    recoilVertical: 0.05,
    recoilHorizontal: 0.015,
    bloomPerShot: 0.06,
    maxSpread: 0.2,
    recovery: 0.4,
    range: 70,
    falloff: 0.25,
    automatic: false,
    armorPen: 0.62,
    color: 0x8a8f96,
  },
  knife: {
    id: 'knife',
    name: 'Knife',
    slot: 'melee',
    damage: 55,
    rpm: 120,
    magSize: Infinity,
    reserveAmmo: 0,
    reloadTime: 0,
    recoilVertical: 0,
    recoilHorizontal: 0,
    bloomPerShot: 0,
    maxSpread: 0.02,
    recovery: 1,
    range: 2.2,
    falloff: 0,
    automatic: false,
    armorPen: 1,
    color: 0xcfd4da,
  },
};

export interface Loadout {
  primary: WeaponId | null;
  secondary: WeaponId;
  melee: WeaponId;
}

export function pistolRoundLoadout(team: Team): Loadout {
  return {
    primary: null,
    secondary: team === 'T' ? 'glock' : 'usp',
    melee: 'knife',
  };
}

export function rifleLoadout(team: Team): Loadout {
  // simple economy: mix of rifles + awp on each team
  const primaryPool: WeaponId[] =
    team === 'T' ? ['ak47', 'ak47', 'awp'] : ['m4a4', 'm4a4', 'awp'];
  const primary = primaryPool[Math.floor(Math.random() * primaryPool.length)];
  return {
    primary,
    secondary: team === 'T' ? 'glock' : 'usp',
    melee: 'knife',
  };
}

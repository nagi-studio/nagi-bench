import type { Gun, Inventory, WeaponData, WeaponId, Zone } from './types';

export const WEAPONS: Record<WeaponId, WeaponData> = {
  ak: { id: 'ak', name: 'AK-47', slot: 'primary', damage: 39, magazine: 30, reserve: 90, interval: .105, reload: 2.45, recoil: .022, spread: .0028, range: 130, automatic: true },
  m4: { id: 'm4', name: 'M4A4', slot: 'primary', damage: 32, magazine: 30, reserve: 90, interval: .085, reload: 2.3, recoil: .009, spread: .002, range: 130, automatic: true },
  awp: { id: 'awp', name: 'AWP', slot: 'primary', damage: 150, magazine: 5, reserve: 25, interval: 1.55, reload: 3.4, recoil: .035, spread: .0008, range: 200, automatic: false },
  glock: { id: 'glock', name: 'Glock-18', slot: 'secondary', damage: 21, magazine: 20, reserve: 100, interval: .18, reload: 1.8, recoil: .008, spread: .004, range: 85, automatic: false },
  usp: { id: 'usp', name: 'USP-S', slot: 'secondary', damage: 25, magazine: 12, reserve: 72, interval: .22, reload: 1.95, recoil: .009, spread: .003, range: 90, automatic: false },
  deagle: { id: 'deagle', name: 'Desert Eagle', slot: 'secondary', damage: 30, magazine: 7, reserve: 35, interval: .32, reload: 2.2, recoil: .024, spread: .003, range: 100, automatic: false },
  knife: { id: 'knife', name: 'Combat knife', slot: 'melee', damage: 55, magazine: 1, reserve: 0, interval: .55, reload: 0, recoil: 0, spread: 0, range: 2.3, automatic: false },
};
export const HIT_MULTIPLIER: Record<Zone, number> = { head: 2, chest: 1, abdomen: 1.1, arm: .65, leg: .7 };
export const makeGun = (id: WeaponId): Gun => ({ id, ammo: WEAPONS[id].magazine, reserve: WEAPONS[id].reserve });
export function makeInventory(team: 'T' | 'CT', pistol: boolean, primary?: WeaponId, secondary?: WeaponId): Inventory {
  return { primary: pistol ? null : makeGun(primary ?? (team === 'T' ? 'ak' : 'm4')), secondary: makeGun(pistol ? (team === 'T' ? 'glock' : 'usp') : secondary ?? (team === 'T' ? 'glock' : 'usp')), melee: makeGun('knife') };
}

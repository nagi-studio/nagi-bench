import type { WeaponDef, WeaponId } from './types';

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak: { id: 'ak', name: 'AK-47', slot: 'primary', damage: 36, rpm: 600, magazine: 30, reserve: 90, reload: 2.5, spread: .013, recoil: .055, range: 100, automatic: true, color: 0x9c6434 },
  m4: { id: 'm4', name: 'M4A4', slot: 'primary', damage: 31, rpm: 666, magazine: 30, reserve: 90, reload: 2.35, spread: .009, recoil: .028, range: 105, automatic: true, color: 0x454c52 },
  awp: { id: 'awp', name: 'AWP', slot: 'primary', damage: 160, rpm: 41, magazine: 10, reserve: 30, reload: 3.4, spread: .002, recoil: .14, range: 150, automatic: false, color: 0x54624b },
  glock: { id: 'glock', name: 'Glock-18', slot: 'secondary', damage: 21, rpm: 400, magazine: 20, reserve: 100, reload: 1.9, spread: .016, recoil: .021, range: 60, automatic: false, color: 0x383b38 },
  usp: { id: 'usp', name: 'USP-S', slot: 'secondary', damage: 24, rpm: 360, magazine: 12, reserve: 60, reload: 2.1, spread: .012, recoil: .022, range: 70, automatic: false, color: 0x3d4449 },
  deagle: { id: 'deagle', name: 'Desert Eagle', slot: 'secondary', damage: 28, rpm: 220, magazine: 7, reserve: 35, reload: 2.2, spread: .02, recoil: .072, range: 80, automatic: false, color: 0x9c9385 },
  knife: { id: 'knife', name: '战术匕首', slot: 'melee', damage: 48, rpm: 100, magazine: 1, reserve: 0, reload: 0, spread: 0, recoil: 0, range: 2.3, automatic: false, color: 0xbcc4be },
};

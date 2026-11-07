export type WeaponKind = 'rifle' | 'sniper' | 'pistol' | 'knife';

export type Weapon = {
  id: string;
  name: string;
  slot: 'primary' | 'secondary' | 'melee';
  kind: WeaponKind;
  damage: number;       // body damage before armour
  rpm: number;
  mag: number;
  reserve: number;
  spread: number;       // radians
  recoil: number;       // view kick per shot (radians)
  reload: number;       // seconds
  range: number;        // metres
  armorPen: number;     // 0..1 fraction of damage that ignores armour
  scope?: boolean;
  auto?: boolean;
};

export const WEAPONS: Record<string, Weapon> = {
  ak47: { id: 'ak47', name: 'AK-47', slot: 'primary', kind: 'rifle', damage: 36, rpm: 600, mag: 30, reserve: 90, spread: 0.012, recoil: 0.028, reload: 2.4, range: 90, armorPen: 0.775, auto: true },
  m4a4: { id: 'm4a4', name: 'M4A4', slot: 'primary', kind: 'rifle', damage: 33, rpm: 666, mag: 30, reserve: 90, spread: 0.009, recoil: 0.016, reload: 2.2, range: 90, armorPen: 0.7, auto: true },
  awp: { id: 'awp', name: 'AWP', slot: 'primary', kind: 'sniper', damage: 115, rpm: 41, mag: 10, reserve: 30, spread: 0.002, recoil: 0.05, reload: 3.6, range: 120, armorPen: 0.975, scope: true },
  glock: { id: 'glock', name: 'Glock-18', slot: 'secondary', kind: 'pistol', damage: 28, rpm: 400, mag: 20, reserve: 120, spread: 0.016, recoil: 0.014, reload: 1.9, range: 60, armorPen: 0.47 },
  usp: { id: 'usp', name: 'USP-S', slot: 'secondary', kind: 'pistol', damage: 35, rpm: 352, mag: 12, reserve: 96, spread: 0.011, recoil: 0.016, reload: 2.1, range: 60, armorPen: 0.505 },
  deagle: { id: 'deagle', name: 'Desert Eagle', slot: 'secondary', kind: 'pistol', damage: 63, rpm: 267, mag: 7, reserve: 35, spread: 0.009, recoil: 0.045, reload: 2.3, range: 70, armorPen: 0.93 },
  knife: { id: 'knife', name: 'Knife', slot: 'melee', kind: 'knife', damage: 55, rpm: 120, mag: -1, reserve: 0, spread: 0, recoil: 0, reload: 0, range: 2.1, armorPen: 0.85 }
};

export const PISTOL_ROUND = { t: 'glock', ct: 'usp', armor: 0 };
export const RIFLE_ROUND = { t: 'ak47', ct: 'm4a4', armor: 100 };

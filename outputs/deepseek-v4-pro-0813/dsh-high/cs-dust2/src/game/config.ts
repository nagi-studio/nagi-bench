import type { Team, WeaponDef, WeaponSlot } from './types';

export const PLAYER_HEIGHT = 1.8;
export const PLAYER_HALF = 0.35;
export const GRAVITY = 22;
export const JUMP_SPEED = 6.4;
export const EYE_HEIGHT = 1.62;

export const ROUND_FREEZE_TIME = 3.0;
export const ROUND_TIME = 105;
export const C4_TIMER = 35;
export const PLANT_TIME = 3.2;
export const DEFUSE_TIME = 5.0;
export const PICKUP_RANGE = 2.2;
export const INTERACT_RANGE = 3.2;

export const A_SITE_CENTER = { x: -24, z: -24 };
export const B_SITE_CENTER = { x: 25, z: -24 };
export const SITE_RADIUS = 9;

export const WEAPONS: Record<string, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary',
    damage: 36, fireInterval: 0.1, magSize: 30, reserve: 90, reloadTime: 2.5,
    spreadBase: 0.0035, spreadMax: 0.024, spreadPerShot: 0.0016, spreadMove: 0.014,
    recoilPitch: 0.014, recoilYaw: 0.007, recoilRecovery: 0.42,
    automatic: true, scoped: false, zoomFov: 60, moveSpeed: 215, range: 45,
    soundGroup: 'rifle',
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary',
    damage: 33, fireInterval: 0.09, magSize: 30, reserve: 90, reloadTime: 2.5,
    spreadBase: 0.003, spreadMax: 0.02, spreadPerShot: 0.0011, spreadMove: 0.012,
    recoilPitch: 0.0085, recoilYaw: 0.0045, recoilRecovery: 0.5,
    automatic: true, scoped: false, zoomFov: 60, moveSpeed: 220, range: 45,
    soundGroup: 'smg',
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary',
    damage: 115, fireInterval: 1.5, magSize: 10, reserve: 30, reloadTime: 3.7,
    spreadBase: 0.0006, spreadMax: 0.002, spreadPerShot: 0.001, spreadMove: 0.06,
    recoilPitch: 0.03, recoilYaw: 0.004, recoilRecovery: 0.25,
    automatic: false, scoped: true, zoomFov: 20, moveSpeed: 200, range: 120,
    armorPierce: 1,
    soundGroup: 'sniper',
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary',
    damage: 30, fireInterval: 0.15, magSize: 20, reserve: 120, reloadTime: 2.2,
    spreadBase: 0.0045, spreadMax: 0.02, spreadPerShot: 0.0012, spreadMove: 0.012,
    recoilPitch: 0.007, recoilYaw: 0.004, recoilRecovery: 0.55,
    automatic: false, scoped: false, zoomFov: 60, moveSpeed: 240, range: 30,
    soundGroup: 'pistol',
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary',
    damage: 35, fireInterval: 0.17, magSize: 12, reserve: 24, reloadTime: 2.2,
    spreadBase: 0.0035, spreadMax: 0.016, spreadPerShot: 0.001, spreadMove: 0.01,
    recoilPitch: 0.006, recoilYaw: 0.0035, recoilRecovery: 0.6,
    automatic: false, scoped: false, zoomFov: 60, moveSpeed: 240, range: 30,
    soundGroup: 'pistol',
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary',
    damage: 63, fireInterval: 0.225, magSize: 7, reserve: 35, reloadTime: 2.4,
    spreadBase: 0.004, spreadMax: 0.03, spreadPerShot: 0.006, spreadMove: 0.018,
    recoilPitch: 0.03, recoilYaw: 0.008, recoilRecovery: 0.35,
    automatic: false, scoped: false, zoomFov: 60, moveSpeed: 235, range: 45,
    soundGroup: 'pistol',
  },
  knife: {
    id: 'knife', name: '匕首', slot: 'knife',
    damage: 40, fireInterval: 0.4, magSize: 1, reserve: 0, reloadTime: 0,
    spreadBase: 0, spreadMax: 0, spreadPerShot: 0, spreadMove: 0,
    recoilPitch: 0.002, recoilYaw: 0, recoilRecovery: 0.5,
    automatic: false, scoped: false, zoomFov: 60, moveSpeed: 260, range: 2.4,
    soundGroup: 'knife',
  },
};

export const WEAPON_ORDER: WeaponSlot[] = ['primary', 'secondary', 'knife'];

export function defaultSecondary(team: Team): string {
  return team === 'T' ? 'glock' : 'usp';
}

export function defaultPrimary(team: Team): string {
  return team === 'T' ? 'ak47' : 'm4a4';
}

export interface BuyItem {
  id: string;
  price: number;
  slot: WeaponSlot;
  team: Team | 'both';
}

export const BUY_MENU: BuyItem[] = [
  { id: 'ak47', price: 2700, slot: 'primary', team: 'T' },
  { id: 'm4a4', price: 3100, slot: 'primary', team: 'CT' },
  { id: 'awp', price: 4750, slot: 'primary', team: 'both' },
  { id: 'deagle', price: 700, slot: 'secondary', team: 'both' },
  { id: 'usp', price: 200, slot: 'secondary', team: 'CT' },
  { id: 'glock', price: 200, slot: 'secondary', team: 'T' },
];

export const ARMOR_PRICE = 650;
export const START_MONEY = 800;
export const WIN_MONEY = 3250;
export const LOSS_MONEY = 1400;
export const KILL_MONEY = 300;

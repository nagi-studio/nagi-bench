import type { HitPart, WeaponDef, WeaponId } from './types';

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary',
    damage: 36, rpm: 600, magSize: 30, reserve: 90, reloadTime: 2.5,
    auto: true, spreadBase: 0.8, spreadMax: 5.0, bloomPerShot: 0.6,
    recoilPitch: 1.5, recoilYaw: 0.6, falloff: 0.0035, moveSpeed: 4.6,
    scope: false, tracer: 0xffc866,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary',
    damage: 31, rpm: 666, magSize: 30, reserve: 90, reloadTime: 2.2,
    auto: true, spreadBase: 0.6, spreadMax: 3.4, bloomPerShot: 0.42,
    recoilPitch: 0.95, recoilYaw: 0.4, falloff: 0.0035, moveSpeed: 4.7,
    scope: false, tracer: 0x9fd0ff,
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary',
    damage: 115, rpm: 41, magSize: 5, reserve: 15, reloadTime: 3.4,
    auto: false, spreadBase: 7.0, spreadMax: 9.0, bloomPerShot: 2.0,
    recoilPitch: 3.0, recoilYaw: 1.0, falloff: 0.001, moveSpeed: 4.3,
    scope: true, tracer: 0xd0ffe0,
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary',
    damage: 28, rpm: 400, magSize: 20, reserve: 60, reloadTime: 2.0,
    auto: false, spreadBase: 0.9, spreadMax: 3.0, bloomPerShot: 0.35,
    recoilPitch: 1.0, recoilYaw: 0.4, falloff: 0.005, moveSpeed: 4.9,
    scope: false, tracer: 0xffe0a0,
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary',
    damage: 34, rpm: 352, magSize: 12, reserve: 48, reloadTime: 2.1,
    auto: false, spreadBase: 0.8, spreadMax: 2.6, bloomPerShot: 0.32,
    recoilPitch: 1.1, recoilYaw: 0.45, falloff: 0.005, moveSpeed: 4.9,
    scope: false, tracer: 0xcfe0ff,
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary',
    damage: 53, rpm: 267, magSize: 7, reserve: 21, reloadTime: 2.3,
    auto: false, spreadBase: 1.1, spreadMax: 4.0, bloomPerShot: 0.8,
    recoilPitch: 2.4, recoilYaw: 0.9, falloff: 0.004, moveSpeed: 4.8,
    scope: false, tracer: 0xffb080,
  },
  knife: {
    id: 'knife', name: 'Knife', slot: 'melee',
    damage: 40, rpm: 92, magSize: 1, reserve: 0, reloadTime: 0,
    auto: false, spreadBase: 0, spreadMax: 0, bloomPerShot: 0,
    recoilPitch: 0, recoilYaw: 0, falloff: 0, moveSpeed: 5.3,
    scope: false, melee: true, meleeRange: 1.9, tracer: 0xffffff,
  },
};

export const PART_MULT: Record<HitPart, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.1,
  arm: 0.9,
  leg: 0.85,
};

/** damage multiplier when armor covers the hit part */
export const ARMOR_MULT = 0.55;

export const ROUND_TIME = 100;
export const FREEZE_TIME = 2.5;
export const ROUND_END_TIME = 4.0;
export const BOMB_TIMER = 40;
export const PLANT_TIME = 3.2;
export const DEFUSE_TIME = 5.0;

export const GRAVITY = 13.5;
export const JUMP_VEL = 4.8;
export const STEP_UP = 0.55;
export const EYE_HEIGHT = 1.62;
export const BODY_RADIUS = 0.35;
export const BODY_HEIGHT = 1.8;

export const BOT_NAMES_T = ['Vex', 'Rook', 'Dune', 'Kilo', 'Slate'];
export const BOT_NAMES_CT = ['Mira', 'Juno', 'Pike', 'Nova', 'Iris'];

import type { SlotId, Team } from '../core/types.ts';

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife' | 'c4';

export type FireMode = 'auto' | 'semi' | 'bolt' | 'melee' | 'none';

export interface ScopeConfig {
  /** Camera FOV while scoped (main FOV is 90). */
  fov: number;
  /** Mouse sensitivity multiplier while scoped. */
  sens: number;
  /** Accuracy multiplier while scoped. */
  spreadMul: number;
}

export interface WeaponSfx {
  /** Loudness of the shot, also drives how far bots "hear" it. */
  gain: number;
  /** Base frequency of the synthesised body of the shot. */
  pitch: number;
  /** Length of the noise burst in seconds. */
  length: number;
  /** Amount of low-end thump. */
  bass: number;
}

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: SlotId;
  mode: FireMode;
  /** Base damage on a chest hit at point blank. */
  damage: number;
  /** Fraction of damage that still goes through armour. */
  armorPen: number;
  rpm: number;
  magSize: number;
  reserve: number;
  reloadTime: number;
  /** Deploy delay after switching to this weapon. */
  drawTime: number;
  /** Base cone half-angle (radians) when standing still. */
  spread: number;
  /** Extra cone added at full running speed. */
  moveSpread: number;
  /** Extra cone while airborne. */
  airSpread: number;
  /** Cone added per shot fired (recoil bloom). */
  spreadPerShot: number;
  maxSpread: number;
  /** Bloom decay in radians/second. */
  spreadRecovery: number;
  /** Upward view kick per shot (radians). */
  recoilPitch: number;
  /** Horizontal view kick magnitude (radians). */
  recoilYaw: number;
  /** View-kick recentring speed. */
  recoilRecovery: number;
  /** Effective range and damage falloff per metre beyond `falloffStart`. */
  range: number;
  falloffStart: number;
  falloffPerMeter: number;
  /** Movement speed multiplier while this weapon is deployed. */
  speedMul: number;
  price: number;
  killReward: number;
  scope?: ScopeConfig;
  sfx: WeaponSfx;
  /** Restricts a pistol to one side for the pistol round default loadout. */
  teamDefault?: Team;
}

/**
 * Head damage is exactly twice a chest hit (project spec); the other zones use
 * CS-like relative values so limb hits are a real disadvantage.
 */
export const HITBOX_MULT = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.25,
  arm: 0.8,
  leg: 0.7,
} as const;

const def = (w: WeaponDef): WeaponDef => w;

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: def({
    id: 'ak47',
    name: 'AK-47',
    slot: 'primary',
    mode: 'auto',
    damage: 50,
    armorPen: 0.775,
    rpm: 600,
    magSize: 30,
    reserve: 90,
    reloadTime: 2.4,
    drawTime: 0.6,
    spread: 0.0022,
    moveSpread: 0.075,
    airSpread: 0.13,
    spreadPerShot: 0.0105,
    maxSpread: 0.085,
    spreadRecovery: 0.115,
    recoilPitch: 0.0255,
    recoilYaw: 0.0105,
    recoilRecovery: 7.2,
    range: 90,
    falloffStart: 30,
    falloffPerMeter: 0.35,
    speedMul: 0.93,
    price: 2700,
    killReward: 300,
    sfx: { gain: 1.0, pitch: 150, length: 0.22, bass: 1.0 },
  }),
  m4a4: def({
    id: 'm4a4',
    name: 'M4A4',
    slot: 'primary',
    mode: 'auto',
    damage: 33,
    armorPen: 0.7,
    rpm: 666,
    magSize: 30,
    reserve: 90,
    reloadTime: 3.1,
    drawTime: 0.6,
    spread: 0.0019,
    moveSpread: 0.062,
    airSpread: 0.11,
    spreadPerShot: 0.0062,
    maxSpread: 0.055,
    spreadRecovery: 0.14,
    recoilPitch: 0.0135,
    recoilYaw: 0.0058,
    recoilRecovery: 9.5,
    range: 90,
    falloffStart: 32,
    falloffPerMeter: 0.28,
    speedMul: 0.95,
    price: 3100,
    killReward: 300,
    sfx: { gain: 0.85, pitch: 215, length: 0.16, bass: 0.6 },
  }),
  awp: def({
    id: 'awp',
    name: 'AWP',
    slot: 'primary',
    mode: 'bolt',
    damage: 115,
    armorPen: 0.975,
    rpm: 41,
    magSize: 10,
    reserve: 30,
    reloadTime: 3.6,
    drawTime: 1.1,
    spread: 0.0009,
    moveSpread: 0.16,
    airSpread: 0.22,
    spreadPerShot: 0.055,
    maxSpread: 0.16,
    spreadRecovery: 0.2,
    recoilPitch: 0.052,
    recoilYaw: 0.008,
    recoilRecovery: 5.0,
    range: 140,
    falloffStart: 60,
    falloffPerMeter: 0.2,
    speedMul: 0.78,
    price: 4750,
    killReward: 100,
    scope: { fov: 26, sens: 0.42, spreadMul: 0.06 },
    sfx: { gain: 1.15, pitch: 105, length: 0.34, bass: 1.4 },
  }),
  glock: def({
    id: 'glock',
    name: 'Glock-18',
    slot: 'secondary',
    mode: 'semi',
    damage: 26,
    armorPen: 0.47,
    rpm: 400,
    magSize: 20,
    reserve: 120,
    reloadTime: 2.2,
    drawTime: 0.4,
    spread: 0.0035,
    moveSpread: 0.045,
    airSpread: 0.09,
    spreadPerShot: 0.0068,
    maxSpread: 0.05,
    spreadRecovery: 0.15,
    recoilPitch: 0.0125,
    recoilYaw: 0.0075,
    recoilRecovery: 9.0,
    range: 60,
    falloffStart: 18,
    falloffPerMeter: 0.5,
    speedMul: 1.0,
    price: 200,
    killReward: 300,
    teamDefault: 'T',
    sfx: { gain: 0.6, pitch: 280, length: 0.1, bass: 0.35 },
  }),
  usp: def({
    id: 'usp',
    name: 'USP-S',
    slot: 'secondary',
    mode: 'semi',
    damage: 32,
    armorPen: 0.505,
    rpm: 352,
    magSize: 12,
    reserve: 96,
    reloadTime: 2.2,
    drawTime: 0.4,
    spread: 0.0028,
    moveSpread: 0.04,
    airSpread: 0.085,
    spreadPerShot: 0.0072,
    maxSpread: 0.05,
    spreadRecovery: 0.16,
    recoilPitch: 0.0135,
    recoilYaw: 0.006,
    recoilRecovery: 9.5,
    range: 65,
    falloffStart: 20,
    falloffPerMeter: 0.45,
    speedMul: 1.0,
    price: 200,
    killReward: 300,
    teamDefault: 'CT',
    sfx: { gain: 0.5, pitch: 320, length: 0.085, bass: 0.25 },
  }),
  deagle: def({
    id: 'deagle',
    name: 'Desert Eagle',
    slot: 'secondary',
    mode: 'semi',
    damage: 60,
    armorPen: 0.905,
    rpm: 267,
    magSize: 7,
    reserve: 35,
    reloadTime: 2.2,
    drawTime: 0.6,
    spread: 0.0026,
    moveSpread: 0.09,
    airSpread: 0.16,
    spreadPerShot: 0.024,
    maxSpread: 0.1,
    spreadRecovery: 0.2,
    recoilPitch: 0.043,
    recoilYaw: 0.012,
    recoilRecovery: 6.0,
    range: 80,
    falloffStart: 30,
    falloffPerMeter: 0.4,
    speedMul: 0.98,
    price: 700,
    killReward: 300,
    sfx: { gain: 0.95, pitch: 190, length: 0.19, bass: 0.9 },
  }),
  knife: def({
    id: 'knife',
    name: 'Knife',
    slot: 'melee',
    mode: 'melee',
    damage: 55,
    armorPen: 0.85,
    rpm: 150,
    magSize: 0,
    reserve: 0,
    reloadTime: 0,
    drawTime: 0.35,
    spread: 0,
    moveSpread: 0,
    airSpread: 0,
    spreadPerShot: 0,
    maxSpread: 0,
    spreadRecovery: 1,
    recoilPitch: 0,
    recoilYaw: 0,
    recoilRecovery: 10,
    range: 2.2,
    falloffStart: 2.2,
    falloffPerMeter: 0,
    speedMul: 1.08,
    price: 0,
    killReward: 1500,
    sfx: { gain: 0.35, pitch: 900, length: 0.09, bass: 0.1 },
  }),
  c4: def({
    id: 'c4',
    name: 'C4 Explosive',
    slot: 'bomb',
    mode: 'none',
    damage: 0,
    armorPen: 0,
    rpm: 0,
    magSize: 0,
    reserve: 0,
    reloadTime: 0,
    drawTime: 0.5,
    spread: 0,
    moveSpread: 0,
    airSpread: 0,
    spreadPerShot: 0,
    maxSpread: 0,
    spreadRecovery: 1,
    recoilPitch: 0,
    recoilYaw: 0,
    recoilRecovery: 10,
    range: 0,
    falloffStart: 0,
    falloffPerMeter: 0,
    speedMul: 1.05,
    price: 0,
    killReward: 0,
    sfx: { gain: 0.3, pitch: 600, length: 0.05, bass: 0.1 },
  }),
};

export const weapon = (id: WeaponId): WeaponDef => WEAPONS[id];

/** Seconds between shots. */
export const fireInterval = (w: WeaponDef): number => (w.rpm > 0 ? 60 / w.rpm : 1);

export const BUYABLE: WeaponId[] = ['ak47', 'm4a4', 'awp', 'deagle', 'glock', 'usp'];

/** Rifles the bots prefer, per side. */
export const TEAM_RIFLE: Record<Team, WeaponId> = { T: 'ak47', CT: 'm4a4' };
export const TEAM_PISTOL: Record<Team, WeaponId> = { T: 'glock', CT: 'usp' };

export interface ArmorConfig {
  armor: number;
  helmet: boolean;
}

/** Pistol round: light armour only, no helmet, no rifles (standard CS opener). */
export const PISTOL_ROUND_ARMOR: ArmorConfig = { armor: 0, helmet: false };
export const FULL_BUY_ARMOR: ArmorConfig = { armor: 100, helmet: true };

export const KEVLAR_PRICE = 650;
export const KEVLAR_HELMET_PRICE = 1000;
export const DEFUSE_KIT_PRICE = 400;

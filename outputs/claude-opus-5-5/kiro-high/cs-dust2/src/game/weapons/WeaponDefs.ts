// Data-driven weapon definitions. Adding a weapon = adding an entry here (+ optional
// procedural model builder in GunModels.ts). Angles are in degrees, speeds in m/s.

import type { Team } from '../types';

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type Slot = 'primary' | 'secondary' | 'melee';
export type SoundProfile = 'ak' | 'm4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type HoldPose = 'rifle' | 'pistol' | 'knife';
export type HitZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

export interface SpreadDef {
  /** standing still inaccuracy (half-angle, deg) */
  base: number;
  /** extra inaccuracy at full run speed */
  move: number;
  /** extra inaccuracy while airborne */
  air: number;
  /** multiplier while crouched */
  crouchMul: number;
  /** inaccuracy added per shot (bloom) */
  perShot: number;
  /** cap on accumulated bloom */
  max: number;
  /** bloom recovery (deg/s) */
  recover: number;
  /** extra inaccuracy when a scoped weapon is fired unscoped */
  unscoped?: number;
}

export interface RecoilDef {
  /** vertical kick of the first shot */
  pitch: number;
  /** extra vertical kick added per consecutive shot */
  pitchGrow: number;
  /** cap of accumulated vertical punch */
  maxPitch: number;
  /** random horizontal jitter per shot */
  yaw: number;
  /** horizontal sway amplitude once the spray is established */
  yawSway: number;
  /** punch recovery speed (1/s, exponential) */
  recover: number;
  /** fraction of punch applied to the camera (rest only moves bullets) */
  viewFactor: number;
}

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: Slot;
  team: Team | null;
  pose: HoldPose;
  damage: number;
  /** fraction of damage that passes through kevlar */
  armorPen: number;
  /** damage multiplier per 10 m */
  rangeMod: number;
  range: number;
  rpm: number;
  auto: boolean;
  magSize: number;
  reserve: number;
  reloadTime: number;
  drawTime: number;
  moveSpeed: number;
  spread: SpreadDef;
  recoil: RecoilDef;
  scope?: { fovs: number[]; moveSpeed: number };
  melee?: { range: number; heavyDamage: number; heavyRate: number; backstabMul: number };
  sound: SoundProfile;
  /** viewmodel kick strength 0..1 */
  kick: number;
  killIcon: string;
}

export const HITZONE_MULT: Record<HitZone, number> = {
  head: 2.0, // headshot = 2x body (chest)
  chest: 1.0,
  stomach: 1.25,
  arm: 0.85,
  leg: 0.7,
};

export const HITZONE_LABEL: Record<HitZone, string> = {
  head: '头部',
  chest: '胸部',
  stomach: '腹部',
  arm: '手臂',
  leg: '腿部',
};

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    slot: 'primary',
    team: 'T',
    pose: 'rifle',
    damage: 40,
    armorPen: 0.775,
    rangeMod: 0.98,
    range: 200,
    rpm: 600,
    auto: true,
    magSize: 30,
    reserve: 90,
    reloadTime: 2.4,
    drawTime: 0.9,
    moveSpeed: 5.3,
    spread: { base: 0.16, move: 4.6, air: 9, crouchMul: 0.7, perShot: 0.62, max: 5.2, recover: 7, unscoped: 0 },
    recoil: { pitch: 1.05, pitchGrow: 0.16, maxPitch: 9.5, yaw: 0.35, yawSway: 1.9, recover: 9, viewFactor: 0.62 },
    sound: 'ak',
    kick: 1,
    killIcon: 'AK-47',
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    slot: 'primary',
    team: 'CT',
    pose: 'rifle',
    damage: 32,
    armorPen: 0.7,
    rangeMod: 0.97,
    range: 200,
    rpm: 666,
    auto: true,
    magSize: 30,
    reserve: 90,
    reloadTime: 2.9,
    drawTime: 0.9,
    moveSpeed: 5.5,
    spread: { base: 0.12, move: 3.6, air: 9, crouchMul: 0.7, perShot: 0.34, max: 3.4, recover: 8, unscoped: 0 },
    recoil: { pitch: 0.55, pitchGrow: 0.07, maxPitch: 5.2, yaw: 0.2, yawSway: 0.9, recover: 11, viewFactor: 0.62 },
    sound: 'm4',
    kick: 0.55,
    killIcon: 'M4A4',
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    slot: 'primary',
    team: null,
    pose: 'rifle',
    damage: 160, // lethal on any hit zone, even through armor
    armorPen: 0.975,
    rangeMod: 0.99,
    range: 300,
    rpm: 41,
    auto: false,
    magSize: 10,
    reserve: 30,
    reloadTime: 3.6,
    drawTime: 1.15,
    moveSpeed: 4.6,
    spread: { base: 0.03, move: 9, air: 14, crouchMul: 0.8, perShot: 0, max: 0, recover: 10, unscoped: 6 },
    recoil: { pitch: 4.2, pitchGrow: 0, maxPitch: 6, yaw: 0.6, yawSway: 0, recover: 6, viewFactor: 0.8 },
    scope: { fovs: [32, 11], moveSpeed: 2.9 },
    sound: 'awp',
    kick: 1.2,
    killIcon: 'AWP',
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    slot: 'secondary',
    team: 'T',
    pose: 'pistol',
    damage: 20,
    armorPen: 0.47,
    rangeMod: 0.85,
    range: 120,
    rpm: 400,
    auto: false,
    magSize: 20,
    reserve: 120,
    reloadTime: 2.2,
    drawTime: 0.55,
    moveSpeed: 5.9,
    spread: { base: 0.55, move: 1.6, air: 6, crouchMul: 0.8, perShot: 0.75, max: 4, recover: 9 },
    recoil: { pitch: 1.1, pitchGrow: 0.1, maxPitch: 6, yaw: 0.4, yawSway: 0.3, recover: 12, viewFactor: 0.6 },
    sound: 'glock',
    kick: 0.45,
    killIcon: 'Glock-18',
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    slot: 'secondary',
    team: 'CT',
    pose: 'pistol',
    damage: 24,
    armorPen: 0.505,
    rangeMod: 0.86,
    range: 120,
    rpm: 352,
    auto: false,
    magSize: 12,
    reserve: 24,
    reloadTime: 2.2,
    drawTime: 0.55,
    moveSpeed: 5.9,
    spread: { base: 0.35, move: 1.5, air: 6, crouchMul: 0.8, perShot: 0.7, max: 4, recover: 9 },
    recoil: { pitch: 1.2, pitchGrow: 0.1, maxPitch: 6, yaw: 0.35, yawSway: 0.3, recover: 12, viewFactor: 0.6 },
    sound: 'usp',
    kick: 0.4,
    killIcon: 'USP-S',
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    slot: 'secondary',
    team: null,
    pose: 'pistol',
    damage: 30, // between pistols (20-24) and rifles (32-40)
    armorPen: 0.932,
    rangeMod: 0.81,
    range: 160,
    rpm: 267,
    auto: false,
    magSize: 7,
    reserve: 35,
    reloadTime: 2.2,
    drawTime: 0.75,
    moveSpeed: 5.7,
    spread: { base: 0.4, move: 3.2, air: 8, crouchMul: 0.75, perShot: 2.4, max: 6, recover: 6 },
    recoil: { pitch: 3.4, pitchGrow: 0.2, maxPitch: 9, yaw: 0.8, yawSway: 0.4, recover: 7, viewFactor: 0.7 },
    sound: 'deagle',
    kick: 1,
    killIcon: 'Desert Eagle',
  },
  knife: {
    id: 'knife',
    name: '匕首',
    slot: 'melee',
    team: null,
    pose: 'knife',
    damage: 34,
    armorPen: 0.85,
    rangeMod: 1,
    range: 1.9,
    rpm: 150,
    auto: true,
    magSize: 0,
    reserve: 0,
    reloadTime: 0,
    drawTime: 0.45,
    moveSpeed: 6.2,
    spread: { base: 0, move: 0, air: 0, crouchMul: 1, perShot: 0, max: 0, recover: 1 },
    recoil: { pitch: 0, pitchGrow: 0, maxPitch: 0, yaw: 0, yawSway: 0, recover: 10, viewFactor: 0 },
    melee: { range: 1.6, heavyDamage: 65, heavyRate: 1.0, backstabMul: 2.6 },
    sound: 'knife',
    kick: 0,
    killIcon: '匕首',
  },
};

/** Round loadout configuration (pistol round vs full buy). */
export interface Loadout {
  primary: WeaponId | null;
  secondary: WeaponId;
  armor: number;
  helmet: boolean;
  kit: boolean;
}

export type RoundType = 'pistol' | 'full';

export const ROUND_LOADOUT: Record<RoundType, Record<Team, Loadout>> = {
  // Standard CS first round: default pistol only, no rifle, no armor.
  pistol: {
    T: { primary: null, secondary: 'glock', armor: 0, helmet: false, kit: false },
    CT: { primary: null, secondary: 'usp', armor: 0, helmet: false, kit: false },
  },
  full: {
    T: { primary: 'ak47', secondary: 'glock', armor: 100, helmet: true, kit: false },
    CT: { primary: 'm4a4', secondary: 'usp', armor: 100, helmet: true, kit: true },
  },
};

export const ROUND_TYPE_LABEL: Record<RoundType, string> = {
  pistol: '手枪局',
  full: '长枪局',
};

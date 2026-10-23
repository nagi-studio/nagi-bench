/**
 * weapons.ts — data-driven weapon registry (extensible: add a WeaponDef and
 * the view-model / sound / AI / HUD pick it up automatically).
 */

export type Slot = 'primary' | 'secondary' | 'melee';
export type FireMode = 'auto' | 'semi' | 'bolt' | 'melee';

export interface SoundProfile {
  /** body "thump" oscillator: start/end frequency */
  thumpF0: number; thumpF1: number; thumpDur: number; thumpGain: number;
  /** noise crack: filter frequency, decay, gain */
  noiseFreq: number; noiseDur: number; noiseGain: number;
  /** optional distant tail (AWP-like boom) */
  tail?: { f: number; dur: number; gain: number };
}

export interface WeaponDef {
  id: string;
  name: string;
  slot: Slot;
  team?: 'T' | 'CT';
  damage: number;
  fireMode: FireMode;
  rpm: number;
  magSize: number;
  reserveAmmo: number;
  reloadTime: number;
  /** hit-region multipliers (head = 2x body per spec) */
  mult: { head: number; chest: number; stomach: number; arm: number; leg: number };
  /** 0..1 — portion of damage that ignores armour */
  armorPen: number;
  /** accuracy (radians) */
  spreadBase: number;
  spreadMoving: number;
  spreadJump: number;
  spreadPerShot: number;
  spreadMax: number;
  spreadRecover: number;
  /** recoil (radians applied to view per shot) */
  recoilPitch: number;
  recoilYaw: number;
  recoilRecover: number;
  /** damage falloff: damage * rangeMod^(dist/10m) */
  rangeMod: number;
  /** movement speed multiplier while held */
  moveSpeed: number;
  scope?: { fov: number; sensMult: number };
  melee?: { range: number; rate: number };
  sound: SoundProfile;
  /** view-model + world-model builder key */
  model: string;
  killAward: number;
}

const MULT: WeaponDef['mult'] = { head: 2.0, chest: 1.0, stomach: 1.25, arm: 0.9, leg: 0.75 };

export const WEAPONS: Record<string, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary', team: 'T',
    damage: 36, fireMode: 'auto', rpm: 600, magSize: 30, reserveAmmo: 90, reloadTime: 2.4,
    mult: MULT, armorPen: 0.78,
    spreadBase: 0.0035, spreadMoving: 0.045, spreadJump: 0.09, spreadPerShot: 0.011, spreadMax: 0.075, spreadRecover: 0.09,
    recoilPitch: 0.033, recoilYaw: 0.011, recoilRecover: 5.5,
    rangeMod: 0.985, moveSpeed: 0.92,
    sound: { thumpF0: 150, thumpF1: 55, thumpDur: 0.16, thumpGain: 0.85, noiseFreq: 1900, noiseDur: 0.2, noiseGain: 0.75, tail: { f: 120, dur: 0.28, gain: 0.3 } },
    model: 'rifle_t', killAward: 300,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary', team: 'CT',
    damage: 33, fireMode: 'auto', rpm: 666, magSize: 30, reserveAmmo: 90, reloadTime: 3.0,
    mult: MULT, armorPen: 0.70,
    spreadBase: 0.003, spreadMoving: 0.040, spreadJump: 0.085, spreadPerShot: 0.0075, spreadMax: 0.06, spreadRecover: 0.11,
    recoilPitch: 0.019, recoilYaw: 0.007, recoilRecover: 7.0,
    rangeMod: 0.985, moveSpeed: 0.94,
    sound: { thumpF0: 190, thumpF1: 70, thumpDur: 0.12, thumpGain: 0.7, noiseFreq: 2600, noiseDur: 0.15, noiseGain: 0.62, tail: { f: 160, dur: 0.2, gain: 0.22 } },
    model: 'rifle_ct', killAward: 300,
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary',
    damage: 115, fireMode: 'bolt', rpm: 41, magSize: 10, reserveAmmo: 30, reloadTime: 3.6,
    mult: MULT, armorPen: 0.97,
    spreadBase: 0.0006, spreadMoving: 0.05, spreadJump: 0.12, spreadPerShot: 0.02, spreadMax: 0.1, spreadRecover: 0.12,
    recoilPitch: 0.055, recoilYaw: 0.006, recoilRecover: 4.0,
    rangeMod: 0.995, moveSpeed: 0.84,
    scope: { fov: 18, sensMult: 0.28 },
    sound: { thumpF0: 90, thumpF1: 34, thumpDur: 0.34, thumpGain: 1.0, noiseFreq: 1100, noiseDur: 0.36, noiseGain: 0.9, tail: { f: 60, dur: 0.7, gain: 0.5 } },
    model: 'awp', killAward: 100,
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary', team: 'T',
    damage: 28, fireMode: 'semi', rpm: 400, magSize: 20, reserveAmmo: 60, reloadTime: 2.2,
    mult: MULT, armorPen: 0.47,
    spreadBase: 0.005, spreadMoving: 0.03, spreadJump: 0.07, spreadPerShot: 0.009, spreadMax: 0.05, spreadRecover: 0.14,
    recoilPitch: 0.014, recoilYaw: 0.005, recoilRecover: 9.0,
    rangeMod: 0.9, moveSpeed: 1.0,
    sound: { thumpF0: 210, thumpF1: 80, thumpDur: 0.09, thumpGain: 0.55, noiseFreq: 3000, noiseDur: 0.1, noiseGain: 0.5 },
    model: 'pistol_t', killAward: 300,
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary', team: 'CT',
    damage: 35, fireMode: 'semi', rpm: 352, magSize: 12, reserveAmmo: 60, reloadTime: 2.2,
    mult: MULT, armorPen: 0.5,
    spreadBase: 0.0045, spreadMoving: 0.028, spreadJump: 0.07, spreadPerShot: 0.008, spreadMax: 0.045, spreadRecover: 0.15,
    recoilPitch: 0.013, recoilYaw: 0.004, recoilRecover: 9.5,
    rangeMod: 0.91, moveSpeed: 1.0,
    sound: { thumpF0: 190, thumpF1: 75, thumpDur: 0.1, thumpGain: 0.5, noiseFreq: 2400, noiseDur: 0.11, noiseGain: 0.42 },
    model: 'pistol_ct', killAward: 300,
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary',
    damage: 63, fireMode: 'semi', rpm: 267, magSize: 7, reserveAmmo: 35, reloadTime: 2.3,
    mult: MULT, armorPen: 0.93,
    spreadBase: 0.004, spreadMoving: 0.05, spreadJump: 0.1, spreadPerShot: 0.02, spreadMax: 0.07, spreadRecover: 0.1,
    recoilPitch: 0.042, recoilYaw: 0.01, recoilRecover: 6.0,
    rangeMod: 0.96, moveSpeed: 0.99,
    sound: { thumpF0: 120, thumpF1: 45, thumpDur: 0.22, thumpGain: 0.95, noiseFreq: 1500, noiseDur: 0.22, noiseGain: 0.8, tail: { f: 90, dur: 0.3, gain: 0.3 } },
    model: 'deagle', killAward: 300,
  },
  knife: {
    id: 'knife', name: 'Knife', slot: 'melee',
    damage: 55, fireMode: 'melee', rpm: 120, magSize: 0, reserveAmmo: 0, reloadTime: 0,
    mult: { head: 2.0, chest: 1.0, stomach: 1.25, arm: 0.9, leg: 0.75 }, armorPen: 0.85,
    spreadBase: 0, spreadMoving: 0, spreadJump: 0, spreadPerShot: 0, spreadMax: 0, spreadRecover: 1,
    recoilPitch: 0, recoilYaw: 0, recoilRecover: 1,
    rangeMod: 1, moveSpeed: 1.08,
    melee: { range: 1.9, rate: 1.1 },
    sound: { thumpF0: 300, thumpF1: 120, thumpDur: 0.08, thumpGain: 0.35, noiseFreq: 4200, noiseDur: 0.12, noiseGain: 0.25 },
    model: 'knife', killAward: 1500,
  },
};

export const WEAPON_IDS = Object.keys(WEAPONS);

export function makeWeaponState(id: string) {
  const def = WEAPONS[id];
  return { id, mag: def.magSize, reserve: def.reserveAmmo };
}
export type WeaponState = ReturnType<typeof makeWeaponState>;

/** standard load-outs. round 1 = pistol round (no primary, no armour) */
export function loadoutForRound(team: 'T' | 'CT', round: number): { primary: string | null; secondary: string; armor: number; helmet: boolean } {
  if (round <= 1) {
    return { primary: null, secondary: team === 'T' ? 'glock' : 'usp', armor: 0, helmet: false };
  }
  return {
    primary: team === 'T' ? 'ak47' : 'm4a4',
    secondary: team === 'T' ? 'glock' : 'usp',
    armor: 100,
    helmet: true,
  };
}

/** damage after armour, CS style: armour soaks a share of the damage */
export function applyArmor(damage: number, armorPen: number, armor: number): { hp: number; armorLeft: number; armorDamage: number } {
  if (armor <= 0) return { hp: damage, armorLeft: 0, armorDamage: 0 };
  const toHealth = damage * armorPen;
  const toArmor = (damage - toHealth) * 0.5;
  const armorLeft = Math.max(0, armor - toArmor);
  return { hp: toHealth, armorLeft, armorDamage: toArmor };
}

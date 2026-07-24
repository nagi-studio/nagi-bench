/**
 * Weapon catalogue.
 *
 * Everything about a weapon's feel lives in data: fire rate, recoil impulse, spread growth,
 * armour penetration, movement penalty and how the first person model is built. Adding a
 * weapon means adding an entry here — no other system needs to change.
 */

export type WeaponSlot = 'primary' | 'secondary' | 'melee';

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';

export interface SpreadModel {
  /** Radians of cone at rest, standing still. */
  base: number;
  /** Extra cone while running. */
  moving: number;
  /** Extra cone while airborne. */
  jumping: number;
  /** Extra cone while crouched (negative = tighter). */
  crouching: number;
  /** Cone added per shot fired. */
  perShot: number;
  /** Hard cap on accumulated cone. */
  max: number;
  /** Exponential recovery rate of the accumulated cone, per second. */
  recovery: number;
}

export interface RecoilModel {
  /** Upward view kick per shot, radians. */
  vertical: number;
  /** Sideways view kick per shot, radians (sign alternates in a pattern). */
  horizontal: number;
  /** How fast the view returns, per second. */
  recovery: number;
}

export interface ScopeModel {
  /** Field of view for each zoom step. */
  fovs: number[];
  /** Mouse sensitivity multiplier for each zoom step. */
  sensitivity: number[];
  /** Fires unscope the weapon (AWP bolt action behaviour). */
  unscopeOnFire: boolean;
}

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  /** Base damage on a chest hit at point blank range. */
  damage: number;
  /** Fraction of damage that ignores armour (CS style). */
  armorPenetration: number;
  /** Rounds per minute. */
  rpm: number;
  automatic: boolean;
  magazine: number;
  reserveAmmo: number;
  reloadTime: number;
  /** Distance in metres at which damage starts dropping. */
  falloffStart: number;
  /** Damage multiplier applied per metre past `falloffStart`. */
  falloffRate: number;
  maxRange: number;
  spread: SpreadModel;
  recoil: RecoilModel;
  scope?: ScopeModel;
  /** Movement speed multiplier while this weapon is out. */
  moveSpeed: number;
  /** Bots prefer higher values when picking a weapon to use at a given range. */
  botPreferredRange: number;
  /** Colour used by the HUD / kill feed. */
  tint: number;
}

const RIFLE_TINT = 0xffd27f;
const PISTOL_TINT = 0xa8d8ff;

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    slot: 'primary',
    damage: 36,
    armorPenetration: 0.775,
    rpm: 600,
    automatic: true,
    magazine: 30,
    reserveAmmo: 90,
    reloadTime: 2.4,
    falloffStart: 24,
    falloffRate: 0.0125,
    maxRange: 90,
    spread: {
      base: 0.0025,
      moving: 0.055,
      jumping: 0.16,
      crouching: -0.0008,
      perShot: 0.0135,
      max: 0.115,
      recovery: 5.5,
    },
    // The AK's signature: a hard vertical climb you have to pull down against.
    recoil: { vertical: 0.0295, horizontal: 0.0115, recovery: 6.5 },
    moveSpeed: 0.86,
    botPreferredRange: 30,
    tint: RIFLE_TINT,
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    slot: 'primary',
    damage: 30,
    armorPenetration: 0.7,
    rpm: 666,
    automatic: true,
    magazine: 30,
    reserveAmmo: 90,
    reloadTime: 3.1,
    falloffStart: 26,
    falloffRate: 0.0105,
    maxRange: 90,
    spread: {
      base: 0.0022,
      moving: 0.05,
      jumping: 0.15,
      crouching: -0.0007,
      perShot: 0.0082,
      max: 0.082,
      recovery: 7.0,
    },
    recoil: { vertical: 0.0168, horizontal: 0.0062, recovery: 9.0 },
    moveSpeed: 0.88,
    botPreferredRange: 28,
    tint: RIFLE_TINT,
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    slot: 'primary',
    damage: 115,
    armorPenetration: 0.975,
    rpm: 41,
    automatic: false,
    magazine: 10,
    reserveAmmo: 30,
    reloadTime: 3.7,
    falloffStart: 70,
    falloffRate: 0.003,
    maxRange: 140,
    spread: {
      base: 0.0006,
      moving: 0.11,
      jumping: 0.24,
      crouching: -0.0003,
      perShot: 0.05,
      max: 0.2,
      recovery: 3.0,
    },
    recoil: { vertical: 0.055, horizontal: 0.006, recovery: 4.0 },
    scope: { fovs: [30, 12], sensitivity: [0.5, 0.22], unscopeOnFire: false },
    moveSpeed: 0.76,
    botPreferredRange: 45,
    tint: 0x9effa0,
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    slot: 'secondary',
    damage: 28,
    armorPenetration: 0.47,
    rpm: 400,
    automatic: false,
    magazine: 20,
    reserveAmmo: 120,
    reloadTime: 2.2,
    falloffStart: 12,
    falloffRate: 0.024,
    maxRange: 60,
    spread: {
      base: 0.004,
      moving: 0.05,
      jumping: 0.14,
      crouching: -0.0012,
      perShot: 0.011,
      max: 0.09,
      recovery: 8.0,
    },
    recoil: { vertical: 0.0125, horizontal: 0.007, recovery: 10.0 },
    moveSpeed: 0.96,
    botPreferredRange: 14,
    tint: PISTOL_TINT,
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    slot: 'secondary',
    damage: 35,
    armorPenetration: 0.505,
    rpm: 352,
    automatic: false,
    magazine: 12,
    reserveAmmo: 24,
    reloadTime: 2.2,
    falloffStart: 15,
    falloffRate: 0.021,
    maxRange: 60,
    spread: {
      base: 0.0032,
      moving: 0.046,
      jumping: 0.13,
      crouching: -0.001,
      perShot: 0.0125,
      max: 0.085,
      recovery: 8.5,
    },
    recoil: { vertical: 0.0142, horizontal: 0.0058, recovery: 10.0 },
    moveSpeed: 0.96,
    botPreferredRange: 16,
    tint: PISTOL_TINT,
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    slot: 'secondary',
    damage: 63,
    armorPenetration: 0.62,
    rpm: 267,
    automatic: false,
    magazine: 7,
    reserveAmmo: 35,
    reloadTime: 2.2,
    falloffStart: 30,
    falloffRate: 0.011,
    maxRange: 80,
    spread: {
      base: 0.0026,
      moving: 0.075,
      jumping: 0.19,
      crouching: -0.0009,
      perShot: 0.03,
      max: 0.12,
      recovery: 5.0,
    },
    recoil: { vertical: 0.042, horizontal: 0.012, recovery: 6.0 },
    moveSpeed: 0.93,
    botPreferredRange: 22,
    tint: 0xffb36b,
  },
  knife: {
    id: 'knife',
    name: 'Knife',
    slot: 'melee',
    damage: 55,
    armorPenetration: 0.85,
    rpm: 180,
    automatic: false,
    magazine: 0,
    reserveAmmo: 0,
    reloadTime: 0,
    falloffStart: 1.6,
    falloffRate: 1,
    maxRange: 1.7,
    spread: { base: 0, moving: 0, jumping: 0, crouching: 0, perShot: 0, max: 0, recovery: 1 },
    recoil: { vertical: 0.004, horizontal: 0.004, recovery: 12 },
    moveSpeed: 1.0,
    botPreferredRange: 1.5,
    tint: 0xcfd8dc,
  },
};

export const WEAPON_IDS = Object.keys(WEAPONS) as WeaponId[];

export function weaponDef(id: WeaponId): WeaponDef {
  return WEAPONS[id];
}

/** Seconds between shots. */
export function fireInterval(def: WeaponDef): number {
  return 60 / def.rpm;
}

/** Damage multiplier from range falloff. */
export function rangeFalloff(def: WeaponDef, distance: number): number {
  if (distance <= def.falloffStart) return 1;
  return Math.max(0.32, 1 - (distance - def.falloffStart) * def.falloffRate);
}

/** Loadouts used at the start of a round. */
export interface Loadout {
  primary: WeaponId | null;
  secondary: WeaponId;
  armor: number;
  helmet: boolean;
}

export function pistolRoundLoadout(team: 'CT' | 'T'): Loadout {
  return {
    primary: null,
    secondary: team === 'T' ? 'glock' : 'usp',
    armor: team === 'CT' ? 100 : 0,
    helmet: false,
  };
}

/**
 * Full-buy loadout. `slot` spreads weapons across the team so a side fields one AWP,
 * a couple of rifles and a Deagle rather than five identical bots.
 */
export function buyLoadout(team: 'CT' | 'T', slot: number, rng: () => number): Loadout {
  const primary: WeaponId =
    slot === 0 ? 'awp' : team === 'T' ? (rng() < 0.85 ? 'ak47' : 'm4a4') : rng() < 0.85 ? 'm4a4' : 'ak47';
  const secondary: WeaponId = rng() < 0.25 ? 'deagle' : team === 'T' ? 'glock' : 'usp';
  return { primary, secondary, armor: 100, helmet: rng() < 0.8 };
}

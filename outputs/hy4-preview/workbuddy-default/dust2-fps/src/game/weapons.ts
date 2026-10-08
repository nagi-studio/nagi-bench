/**
 * Extensible weapon data system.
 *
 * Every behaviour that differs between guns lives in a `WeaponDef` — nothing
 * about firing, recoil or reloading is hard coded per weapon elsewhere.
 * Adding a new gun is a single entry in WEAPONS plus (optionally) a new
 * procedural view-model recipe in render/viewmodel.ts.
 */

export type WeaponCategory = 'primary' | 'secondary' | 'melee';
export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type Slot = 'primary' | 'secondary' | 'melee';

export interface SpreadDef {
  /** cone half-angle (radians) when standing perfectly still */
  base: number;
  /** extra cone per m/s of horizontal speed */
  move: number;
  /** extra cone while airborne */
  air: number;
  /** cone added per shot (bloom) */
  perShot: number;
  /** hard cap */
  max: number;
  /** how fast the cone shrinks back (per second) */
  recover: number;
}

export interface RecoilDef {
  /** upward view kick per shot (radians) */
  vertical: number;
  /** random horizontal kick per shot (radians) */
  horizontal: number;
  /** fraction of the kick that is returned to the player over time */
  returnToZero: number;
  /** how fast the camera returns (per second) */
  recover: number;
  /** smoothing factor for the visual punch */
  punch: number;
}

export interface AdsDef {
  /** field of view while scoped, in degrees */
  fov: number;
  /** seconds to fully zoom in */
  time: number;
  /** draw the 2D scope overlay */
  scope: boolean;
  /** mouse sensitivity multiplier while scoped */
  sensitivity: number;
}

export interface ViewModelDef {
  /** overall length of the gun in metres (view-model space) */
  length: number;
  bodyColor: number;
  accentColor: number;
  metalColor: number;
  /** barrel protrudes past the receiver */
  barrel: number;
  hasStock: boolean;
  hasScope: boolean;
  magSize: number;
  /** melee only */
  blade: boolean;
}

export interface AudioProfileDef {
  /** length of the noise burst in seconds */
  dur: number;
  /** centre frequency of the body resonance */
  freq: number;
  /** low-pass cutoff applied to the noise */
  cutoff: number;
  /** how bright / snappy the transient is */
  snap: number;
  /** gain */
  gain: number;
  /** tail: length of the reverb-ish decay */
  tail: number;
}

export interface WeaponDef {
  id: WeaponId;
  name: string;
  short: string;
  category: WeaponCategory;
  /** which side spawns with it by default */
  defaultFor: 'T' | 'CT' | null;
  price: number;

  // damage
  damage: number;
  /** 2.0 => a headshot does exactly double body damage */
  headshotMultiplier: number;
  /** fraction of damage that ignores armour (0..1) */
  armorPenetration: number;
  /** damage retained at maxRange */
  rangeModifier: number;
  range: number;
  /** how much material a bullet can punch through (metres) */
  penetration: number;

  // fire rate / ammo
  rpm: number;
  auto: boolean;
  /** shots per trigger pull for burst weapons (0 = n/a) */
  burst: number;
  magSize: number;
  reserveAmmo: number;
  reloadTime: number;
  /** seconds after firing before another shot is possible (semi-auto limiter) */
  triggerReset: number;

  // handling
  moveSpeed: number;
  spread: SpreadDef;
  recoil: RecoilDef;
  ads: AdsDef | null;
  drawTime: number;

  // presentation
  viewModel: ViewModelDef;
  audio: AudioProfileDef;
  /** crosshair style hint */
  crosshair: 'dot' | 'cross' | 'scope';
}

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    short: 'AK',
    category: 'primary',
    defaultFor: null,
    price: 2700,
    damage: 36,
    headshotMultiplier: 2.0,
    armorPenetration: 0.78,
    rangeModifier: 0.98,
    range: 60,
    penetration: 0.6,
    rpm: 600,
    auto: true,
    burst: 0,
    magSize: 30,
    reserveAmmo: 90,
    reloadTime: 2.4,
    triggerReset: 0,
    moveSpeed: 0.93,
    spread: { base: 0.0085, move: 0.0075, air: 0.026, perShot: 0.0055, max: 0.055, recover: 3.6 },
    recoil: { vertical: 0.0195, horizontal: 0.0072, returnToZero: 0.72, recover: 8.5, punch: 1.0 },
    ads: null,
    drawTime: 0.45,
    viewModel: { length: 0.92, bodyColor: 0x5a3a22, accentColor: 0x2b2b2f, metalColor: 0x4a4a50, barrel: 0.30, hasStock: true, hasScope: false, magSize: 0.20, blade: false },
    audio: { dur: 0.16, freq: 150, cutoff: 2600, snap: 0.9, gain: 0.85, tail: 0.30 },
    crosshair: 'cross',
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    short: 'M4',
    category: 'primary',
    defaultFor: null,
    price: 2900,
    damage: 33,
    headshotMultiplier: 2.0,
    armorPenetration: 0.70,
    rangeModifier: 0.97,
    range: 60,
    penetration: 0.6,
    rpm: 666,
    auto: true,
    burst: 0,
    magSize: 30,
    reserveAmmo: 90,
    reloadTime: 3.0,
    triggerReset: 0,
    moveSpeed: 0.95,
    spread: { base: 0.0070, move: 0.0065, air: 0.022, perShot: 0.0034, max: 0.040, recover: 4.6 },
    recoil: { vertical: 0.0112, horizontal: 0.0040, returnToZero: 0.80, recover: 11.0, punch: 0.72 },
    ads: null,
    drawTime: 0.45,
    viewModel: { length: 0.86, bodyColor: 0x2f3336, accentColor: 0x1d2023, metalColor: 0x5b5f63, barrel: 0.26, hasStock: true, hasScope: false, magSize: 0.18, blade: false },
    audio: { dur: 0.13, freq: 205, cutoff: 3400, snap: 1.0, gain: 0.72, tail: 0.24 },
    crosshair: 'cross',
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    short: 'AWP',
    category: 'primary',
    defaultFor: null,
    price: 4750,
    damage: 118,
    headshotMultiplier: 2.0,
    armorPenetration: 0.97,
    rangeModifier: 0.99,
    range: 90,
    penetration: 1.0,
    rpm: 41,
    auto: false,
    burst: 0,
    magSize: 10,
    reserveAmmo: 30,
    reloadTime: 3.6,
    triggerReset: 1.45,
    moveSpeed: 0.82,
    spread: { base: 0.0018, move: 0.030, air: 0.090, perShot: 0.024, max: 0.14, recover: 2.2 },
    recoil: { vertical: 0.045, horizontal: 0.010, returnToZero: 0.55, recover: 6.0, punch: 1.5 },
    ads: { fov: 22, time: 0.24, scope: true, sensitivity: 0.42 },
    drawTime: 0.7,
    viewModel: { length: 1.18, bodyColor: 0x3d4a2f, accentColor: 0x24281d, metalColor: 0x4e5257, barrel: 0.52, hasStock: true, hasScope: true, magSize: 0.16, blade: false },
    audio: { dur: 0.34, freq: 88, cutoff: 1500, snap: 0.6, gain: 1.0, tail: 0.85 },
    crosshair: 'scope',
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    short: 'Glock',
    category: 'secondary',
    defaultFor: 'T',
    price: 200,
    damage: 25,
    headshotMultiplier: 2.0,
    armorPenetration: 0.47,
    rangeModifier: 0.90,
    range: 35,
    penetration: 0.3,
    rpm: 400,
    auto: false,
    burst: 3,
    magSize: 20,
    reserveAmmo: 120,
    reloadTime: 2.2,
    triggerReset: 0.15,
    moveSpeed: 1.0,
    spread: { base: 0.0090, move: 0.0060, air: 0.020, perShot: 0.0045, max: 0.045, recover: 4.0 },
    recoil: { vertical: 0.0100, horizontal: 0.0038, returnToZero: 0.78, recover: 9.0, punch: 0.55 },
    ads: null,
    drawTime: 0.35,
    viewModel: { length: 0.42, bodyColor: 0x2a2d31, accentColor: 0x171a1d, metalColor: 0x54585d, barrel: 0.08, hasStock: false, hasScope: false, magSize: 0.10, blade: false },
    audio: { dur: 0.10, freq: 260, cutoff: 4200, snap: 1.0, gain: 0.55, tail: 0.16 },
    crosshair: 'cross',
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    short: 'USP',
    category: 'secondary',
    defaultFor: 'CT',
    price: 200,
    damage: 30,
    headshotMultiplier: 2.0,
    armorPenetration: 0.50,
    rangeModifier: 0.92,
    range: 38,
    penetration: 0.3,
    rpm: 352,
    auto: false,
    burst: 0,
    magSize: 12,
    reserveAmmo: 48,
    reloadTime: 2.2,
    triggerReset: 0.17,
    moveSpeed: 1.0,
    spread: { base: 0.0078, move: 0.0058, air: 0.019, perShot: 0.0040, max: 0.040, recover: 4.4 },
    recoil: { vertical: 0.0088, horizontal: 0.0032, returnToZero: 0.80, recover: 9.5, punch: 0.5 },
    ads: null,
    drawTime: 0.35,
    viewModel: { length: 0.44, bodyColor: 0x33383d, accentColor: 0x1b1e21, metalColor: 0x5a5f66, barrel: 0.10, hasStock: false, hasScope: false, magSize: 0.10, blade: false },
    audio: { dur: 0.11, freq: 240, cutoff: 4000, snap: 1.0, gain: 0.58, tail: 0.18 },
    crosshair: 'cross',
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    short: 'Deagle',
    category: 'secondary',
    defaultFor: null,
    price: 700,
    damage: 53,
    headshotMultiplier: 2.0,
    armorPenetration: 0.93,
    rangeModifier: 0.81,
    range: 45,
    penetration: 0.7,
    rpm: 267,
    auto: false,
    burst: 0,
    magSize: 7,
    reserveAmmo: 35,
    reloadTime: 2.2,
    triggerReset: 0.24,
    moveSpeed: 0.96,
    spread: { base: 0.0060, move: 0.0105, air: 0.030, perShot: 0.0165, max: 0.070, recover: 3.0 },
    recoil: { vertical: 0.0310, horizontal: 0.0085, returnToZero: 0.66, recover: 7.0, punch: 1.25 },
    ads: null,
    drawTime: 0.45,
    viewModel: { length: 0.54, bodyColor: 0x4a4a4e, accentColor: 0x2a2a2e, metalColor: 0x80848a, barrel: 0.16, hasStock: false, hasScope: false, magSize: 0.11, blade: false },
    audio: { dur: 0.22, freq: 130, cutoff: 2100, snap: 0.85, gain: 0.92, tail: 0.44 },
    crosshair: 'cross',
  },
  knife: {
    id: 'knife',
    name: 'Knife',
    short: 'Knife',
    category: 'melee',
    defaultFor: null,
    price: 0,
    damage: 40,
    headshotMultiplier: 2.0,
    armorPenetration: 0.85,
    rangeModifier: 1.0,
    range: 2.0,
    penetration: 0,
    rpm: 150,
    auto: false,
    burst: 0,
    magSize: 0,
    reserveAmmo: 0,
    reloadTime: 0,
    triggerReset: 0.45,
    moveSpeed: 1.05,
    spread: { base: 0, move: 0, air: 0, perShot: 0, max: 0, recover: 10 },
    recoil: { vertical: 0.006, horizontal: 0, returnToZero: 1, recover: 12, punch: 0.25 },
    ads: null,
    drawTime: 0.25,
    viewModel: { length: 0.36, bodyColor: 0x1f2124, accentColor: 0x8a8f96, metalColor: 0xc3c8ce, barrel: 0, hasStock: false, hasScope: false, magSize: 0, blade: true },
    audio: { dur: 0.09, freq: 620, cutoff: 6000, snap: 1.0, gain: 0.35, tail: 0.06 },
    crosshair: 'dot',
  },
};

export const ALL_WEAPON_IDS = Object.keys(WEAPONS) as WeaponId[];

// ---------------------------------------------------------------------------
// Hit boxes
// ---------------------------------------------------------------------------

export type HitBoxId = 'head' | 'chest' | 'stomach' | 'arms' | 'legs';

export interface HitBoxDef {
  id: HitBoxId;
  label: string;
  /** damage multiplier relative to a chest hit */
  multiplier: number;
  /** box in local character space: y measured from the feet */
  minY: number;
  maxY: number;
  /** half width (X) and half depth (Z) */
  halfW: number;
  halfD: number;
}

/**
 * Character is 1.80 m tall. Head sits above 1.52 m, legs below 0.90 m.
 */
export const HITBOXES: HitBoxDef[] = [
  { id: 'head', label: '头部', multiplier: 2.0, minY: 1.53, maxY: 1.82, halfW: 0.145, halfD: 0.145 },
  { id: 'chest', label: '胸部', multiplier: 1.0, minY: 1.16, maxY: 1.53, halfW: 0.245, halfD: 0.165 },
  { id: 'stomach', label: '腹部', multiplier: 0.95, minY: 0.94, maxY: 1.16, halfW: 0.225, halfD: 0.155 },
  { id: 'arms', label: '手臂', multiplier: 0.80, minY: 0.94, maxY: 1.53, halfW: 0.36, halfD: 0.20 },
  { id: 'legs', label: '腿部', multiplier: 0.70, minY: 0.0, maxY: 0.94, halfW: 0.24, halfD: 0.19 },
];

/** Character dimensions shared by physics, hit detection and rendering. */
export const CHARACTER = {
  height: 1.8,
  eyeHeight: 1.62,
  radius: 0.36,
  crouchEye: 1.1,
};

// ---------------------------------------------------------------------------
// Runtime weapon state
// ---------------------------------------------------------------------------

export interface WeaponState {
  id: WeaponId;
  ammo: number;
  reserve: number;
  /** timestamp (seconds, engine clock) the reload finishes */
  reloadEnd: number;
  reloading: boolean;
  /** engine time the weapon becomes ready to fire again */
  nextFireTime: number;
  /** engine time the draw animation finishes */
  readyTime: number;
}

export function makeWeaponState(id: WeaponId, now = 0): WeaponState {
  const def = WEAPONS[id];
  return {
    id,
    ammo: def.magSize,
    reserve: def.reserveAmmo,
    reloadEnd: 0,
    reloading: false,
    nextFireTime: now,
    readyTime: now,
  };
}

export function weaponDef(id: WeaponId): WeaponDef {
  return WEAPONS[id];
}

// ---------------------------------------------------------------------------
// Damage model
// ---------------------------------------------------------------------------

export interface DamageResult {
  /** damage applied to health */
  health: number;
  /** damage absorbed by armour */
  absorbed: number;
  hitbox: HitBoxId;
  headshot: boolean;
  lethal: boolean;
}

const ARMOR_ABSORPTION = 0.5;

/** Distance falloff: full damage up to 25 % of range, then linear to rangeModifier. */
export function falloffFactor(def: WeaponDef, distance: number): number {
  if (def.category === 'melee') return 1;
  const t = Math.min(1, Math.max(0, (distance - def.range * 0.25) / (def.range * 0.75)));
  return 1 + (def.rangeModifier - 1) * t;
}

export function computeDamage(
  def: WeaponDef,
  hitbox: HitBoxId,
  distance: number,
  armor: number,
): DamageResult {
  const box = HITBOXES.find((b) => b.id === hitbox)!;
  const headshot = hitbox === 'head';
  let raw = def.damage * box.multiplier * falloffFactor(def, distance);
  if (headshot) {
    // Guarantee the "headshot == 2x body" rule even with distance falloff.
    raw = Math.max(raw, def.damage * def.headshotMultiplier * (headshot ? 1 : 0));
  }

  let absorbed = 0;
  if (armor > 0 && def.category !== 'melee') {
    absorbed = raw * ARMOR_ABSORPTION * (1 - def.armorPenetration);
    absorbed = Math.min(absorbed, armor);
    raw -= absorbed;
  }
  const finalDamage = Math.max(1, Math.round(raw));
  return {
    health: finalDamage,
    absorbed: Math.round(absorbed),
    hitbox,
    headshot,
    lethal: false,
  };
}

/** Convert a hitbox + armour hit into the armour points actually consumed. */
export function armorLossFrom(absorbed: number): number {
  return absorbed * 0.5;
}

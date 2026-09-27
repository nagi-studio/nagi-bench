// Data-driven weapon definitions. Adding a weapon = adding an entry here
// (+ optionally a procedural model in client/render/WeaponModels.ts and a sound profile).

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife' | 'c4';
export type Slot = 'primary' | 'secondary' | 'melee' | 'bomb';
export type SoundProfile = 'ak' | 'm4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife' | 'none';

export interface SpreadDef {
  /** standing still, radians (half-angle of the cone) */
  base: number;
  /** added at full run speed */
  move: number;
  /** added while airborne */
  air: number;
  /** added per shot fired */
  perShot: number;
  /** cap for accumulated shot spread */
  max: number;
  /** exponential recovery rate of accumulated spread (1/s) */
  recovery: number;
}

export interface RecoilDef {
  /** vertical view kick per shot (degrees) */
  up: number;
  /** after how many shots vertical kick fades & sideways drift starts */
  riseShots: number;
  /** horizontal drift amplitude (degrees per shot) */
  side: number;
  /** random jitter (degrees) */
  jitter: number;
  /** cap for accumulated vertical punch (degrees) */
  maxUp: number;
  /** punch recovery speed (degrees / s) */
  recover: number;
}

export interface ScopeDef {
  /** field of view per zoom level (index 0 = first zoom) */
  fovs: number[];
  /** spread multiplier while scoped / unscoped */
  scopedBase: number;
  unscopedPenalty: number;
  scopedSpeedMul: number;
}

export interface MeleeDef {
  range: number;
  damage: number;
  altDamage: number;
  altInterval: number;
}

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: Slot;
  team?: 'T' | 'CT';
  damage: number;
  /** fraction of damage that goes through kevlar (CS "armor ratio") */
  armorPen: number;
  /** damage multiplier per 500 units (~12.7m) of distance */
  rangeMod: number;
  range: number;
  /** seconds between shots */
  fireInterval: number;
  automatic: boolean;
  magSize: number;
  reserve: number;
  reloadTime: number;
  deployTime: number;
  /** max run speed (m/s) */
  speed: number;
  spread: SpreadDef;
  recoil: RecoilDef;
  scope?: ScopeDef;
  melee?: MeleeDef;
  pellets?: number;
  sound: SoundProfile;
  silenced?: boolean;
  /** how often a tracer is drawn (every Nth bullet) */
  tracerEvery: number;
  killIcon: string;
}

const U = 0.0254; // Source units -> meters

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    slot: 'primary',
    team: 'T',
    damage: 38,
    armorPen: 0.775,
    rangeMod: 0.98,
    range: 200,
    fireInterval: 0.1,
    automatic: true,
    magSize: 30,
    reserve: 90,
    reloadTime: 2.45,
    deployTime: 0.9,
    speed: 215 * U,
    spread: { base: 0.0035, move: 0.1, air: 0.25, perShot: 0.011, max: 0.075, recovery: 5 },
    recoil: { up: 1.9, riseShots: 8, side: 0.9, jitter: 0.35, maxUp: 15, recover: 11 },
    sound: 'ak',
    tracerEvery: 3,
    killIcon: 'AK-47',
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    slot: 'primary',
    team: 'CT',
    damage: 33,
    armorPen: 0.7,
    rangeMod: 0.97,
    range: 200,
    fireInterval: 0.09,
    automatic: true,
    magSize: 30,
    reserve: 90,
    reloadTime: 3.1,
    deployTime: 0.9,
    speed: 225 * U,
    spread: { base: 0.0028, move: 0.08, air: 0.22, perShot: 0.0055, max: 0.04, recovery: 6.5 },
    recoil: { up: 0.95, riseShots: 9, side: 0.45, jitter: 0.18, maxUp: 8.5, recover: 13 },
    sound: 'm4',
    tracerEvery: 3,
    killIcon: 'M4A4',
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    slot: 'primary',
    damage: 140,
    armorPen: 0.975,
    rangeMod: 0.99,
    range: 300,
    fireInterval: 1.46,
    automatic: false,
    magSize: 5,
    reserve: 30,
    reloadTime: 3.6,
    deployTime: 1.1,
    speed: 200 * U,
    spread: { base: 0.0006, move: 0.14, air: 0.35, perShot: 0.0, max: 0.0, recovery: 8 },
    recoil: { up: 4.2, riseShots: 1, side: 0.4, jitter: 0.6, maxUp: 6, recover: 7 },
    scope: { fovs: [40, 12], scopedBase: 0.0006, unscopedPenalty: 0.075, scopedSpeedMul: 0.5 },
    sound: 'awp',
    tracerEvery: 1,
    killIcon: 'AWP',
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    slot: 'secondary',
    team: 'T',
    damage: 22,
    armorPen: 0.47,
    rangeMod: 0.85,
    range: 120,
    fireInterval: 0.15,
    automatic: false,
    magSize: 20,
    reserve: 120,
    reloadTime: 2.2,
    deployTime: 0.6,
    speed: 240 * U,
    spread: { base: 0.006, move: 0.035, air: 0.15, perShot: 0.014, max: 0.05, recovery: 6 },
    recoil: { up: 1.1, riseShots: 6, side: 0.3, jitter: 0.25, maxUp: 6, recover: 14 },
    sound: 'glock',
    tracerEvery: 4,
    killIcon: 'Glock-18',
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    slot: 'secondary',
    team: 'CT',
    damage: 26,
    armorPen: 0.505,
    rangeMod: 0.91,
    range: 120,
    fireInterval: 0.17,
    automatic: false,
    magSize: 12,
    reserve: 24,
    reloadTime: 2.2,
    deployTime: 0.6,
    speed: 240 * U,
    spread: { base: 0.004, move: 0.03, air: 0.15, perShot: 0.013, max: 0.045, recovery: 6.5 },
    recoil: { up: 1.3, riseShots: 6, side: 0.3, jitter: 0.2, maxUp: 6, recover: 14 },
    sound: 'usp',
    silenced: true,
    tracerEvery: 99,
    killIcon: 'USP-S',
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    slot: 'secondary',
    damage: 31,
    armorPen: 0.932,
    rangeMod: 0.85,
    range: 150,
    fireInterval: 0.225,
    automatic: false,
    magSize: 7,
    reserve: 35,
    reloadTime: 2.2,
    deployTime: 0.7,
    speed: 230 * U,
    spread: { base: 0.005, move: 0.07, air: 0.2, perShot: 0.05, max: 0.1, recovery: 4.2 },
    recoil: { up: 4.6, riseShots: 3, side: 0.8, jitter: 0.9, maxUp: 10, recover: 12 },
    sound: 'deagle',
    tracerEvery: 2,
    killIcon: 'Desert Eagle',
  },
  knife: {
    id: 'knife',
    name: '刀',
    slot: 'melee',
    damage: 40,
    armorPen: 0.85,
    rangeMod: 1,
    range: 2,
    fireInterval: 0.45,
    automatic: true,
    magSize: 0,
    reserve: 0,
    reloadTime: 0,
    deployTime: 0.5,
    speed: 250 * U,
    spread: { base: 0, move: 0, air: 0, perShot: 0, max: 0, recovery: 1 },
    recoil: { up: 0, riseShots: 1, side: 0, jitter: 0, maxUp: 0, recover: 10 },
    melee: { range: 2.0, damage: 40, altDamage: 65, altInterval: 1.0 },
    sound: 'knife',
    tracerEvery: 999,
    killIcon: 'Knife',
  },
  c4: {
    id: 'c4',
    name: 'C4 炸弹',
    slot: 'bomb',
    damage: 0,
    armorPen: 1,
    rangeMod: 1,
    range: 0,
    fireInterval: 0.5,
    automatic: false,
    magSize: 0,
    reserve: 0,
    reloadTime: 0,
    deployTime: 0.7,
    speed: 250 * U,
    spread: { base: 0, move: 0, air: 0, perShot: 0, max: 0, recovery: 1 },
    recoil: { up: 0, riseShots: 1, side: 0, jitter: 0, maxUp: 0, recover: 10 },
    sound: 'none',
    tracerEvery: 999,
    killIcon: 'C4',
  },
};

export interface WeaponInstance {
  def: WeaponDef;
  mag: number;
  reserve: number;
}

export const makeWeapon = (id: WeaponId): WeaponInstance => {
  const def = WEAPONS[id];
  return { def, mag: def.magSize, reserve: def.reserve };
};

// ------------------------------------------------------------ Hit groups
export type HitGroup = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

/** Damage multipliers: headshot = 2x body (chest). Every group differs. */
export const HITGROUP_MULT: Record<HitGroup, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.1,
  arm: 0.8,
  leg: 0.65,
};

export const HITGROUP_NAMES: Record<HitGroup, string> = {
  head: '头部',
  chest: '胸部',
  stomach: '腹部',
  arm: '手臂',
  leg: '腿部',
};

export interface ArmorState {
  armor: number;
  helmet: boolean;
}

/**
 * CS-style damage model. Returns the health damage and how much armor is consumed.
 * Kevlar protects head (only with helmet), chest, stomach and arms; legs are never protected.
 */
export function computeDamage(
  def: WeaponDef,
  base: number,
  group: HitGroup,
  distance: number,
  armor: ArmorState,
): { health: number; armor: number } {
  let dmg = base * HITGROUP_MULT[group];
  if (def.slot !== 'melee') dmg *= Math.pow(def.rangeMod, distance / (500 * 0.0254));
  const protectedGroup = group === 'head' ? armor.helmet : group !== 'leg';
  if (armor.armor > 0 && protectedGroup) {
    let health = dmg * def.armorPen;
    let armorTaken = (dmg - health) * 0.5;
    if (armorTaken > armor.armor) {
      // armor broke: remaining damage goes to health
      health = dmg - armor.armor * 2;
      armorTaken = armor.armor;
    }
    return { health: Math.max(1, Math.round(health)), armor: Math.round(armorTaken) };
  }
  return { health: Math.max(1, Math.round(dmg)), armor: 0 };
}

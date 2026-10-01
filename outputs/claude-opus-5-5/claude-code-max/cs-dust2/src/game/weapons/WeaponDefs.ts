import type { Team } from '../core/types';

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife' | 'c4';
export type WeaponKind = 'rifle' | 'sniper' | 'pistol' | 'knife' | 'c4';
export type SoundProfile = 'ak' | 'm4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife' | 'none';

/** 0 = primary, 1 = secondary, 2 = melee, 3 = bomb. Mirrors CS keys 1/2/3/5. */
export type WeaponSlot = 0 | 1 | 2 | 3;
export const SLOT_KEYS = ['1', '2', '3', '5'] as const;

/** All angles in degrees. */
export interface SpreadSpec {
  /** Base inaccuracy standing still. */
  stand: number;
  crouch: number;
  /** Extra inaccuracy at full running speed. */
  move: number;
  /** Extra inaccuracy while airborne. */
  air: number;
  /** Bloom added per shot. */
  perShot: number;
  /** Cap of accumulated bloom. */
  max: number;
  /** Exponential bloom recovery rate (1/s). */
  recover: number;
}

export interface RecoilSpec {
  /** Per-shot [pitch up, yaw] kick in degrees, indexed by shot number in the spray. */
  pattern: [number, number][];
  /** Fraction of the recoil applied to the camera ("view punch"). Bullets always get the full offset. */
  viewPunch: number;
  /** Exponential recoil recovery when not firing (1/s). */
  recover: number;
}

export interface ScopeSpec {
  /** Vertical FOV for each zoom level (degrees). */
  fovs: number[];
  /** Inaccuracy added when NOT scoped. */
  unscopedPenalty: number;
  scopedMoveSpeed: number;
}

export interface MeleeSpec {
  range: number;
  altDamage: number;
  altInterval: number;
  altRange: number;
}

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  kind: WeaponKind;
  team: Team | 'any';
  price: number;
  damage: number;
  /** Fraction of damage that reaches health when armor protects the hit zone. */
  armorPen: number;
  /** Damage multiplier per 10 m travelled (CS "range modifier"). */
  rangeMod: number;
  range: number;
  fireInterval: number;
  automatic: boolean;
  magSize: number;
  reserveMax: number;
  reloadTime: number;
  drawTime: number;
  /** Max run speed (m/s) while this weapon is held. */
  moveSpeed: number;
  spread: SpreadSpec;
  recoil: RecoilSpec;
  scope?: ScopeSpec;
  melee?: MeleeSpec;
  sound: SoundProfile;
  /** Short label shown in the kill feed. */
  feed: string;
}

/** Builds a 30-shot spray pattern from segments of (shots, pitch per shot, yaw per shot). */
function sprayPattern(segments: [number, number, number][], jitter: number, seed: number): [number, number][] {
  const out: [number, number][] = [[0, 0]];
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s / 2147483647) * 2 - 1;
  };
  for (const [count, up, yaw] of segments) {
    for (let i = 0; i < count; i++) out.push([up, yaw + rand() * jitter]);
  }
  return out;
}

const AK_PATTERN = sprayPattern(
  [
    [3, 1.95, 0.05],
    [4, 1.65, -0.1],
    [4, 0.75, -0.75],
    [6, 0.32, 0.95],
    [5, 0.22, -0.85],
    [8, 0.15, 0.7],
  ],
  0.18,
  7,
);

const M4_PATTERN = sprayPattern(
  [
    [3, 0.95, 0.02],
    [4, 0.82, 0.08],
    [4, 0.36, 0.42],
    [6, 0.18, -0.5],
    [5, 0.12, 0.42],
    [8, 0.1, -0.35],
  ],
  0.1,
  11,
);

const single = (up: number, yaw: number): [number, number][] => {
  const out: [number, number][] = [[0, 0]];
  for (let i = 0; i < 40; i++) out.push([up * (i < 3 ? 1 : 0.7), (i % 2 ? 1 : -1) * yaw]);
  return out;
};

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    slot: 0,
    kind: 'rifle',
    team: 'T',
    price: 2700,
    damage: 50,
    armorPen: 0.775,
    rangeMod: 0.985,
    range: 200,
    fireInterval: 0.1,
    automatic: true,
    magSize: 30,
    reserveMax: 90,
    reloadTime: 2.45,
    drawTime: 0.9,
    moveSpeed: 5.4,
    spread: { stand: 0.32, crouch: 0.22, move: 5.8, air: 9, perShot: 0.85, max: 6.5, recover: 5 },
    recoil: { pattern: AK_PATTERN, viewPunch: 0.55, recover: 8 },
    sound: 'ak',
    feed: 'AK-47',
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    slot: 0,
    kind: 'rifle',
    team: 'CT',
    price: 3100,
    damage: 38,
    armorPen: 0.7,
    rangeMod: 0.975,
    range: 200,
    fireInterval: 0.09,
    automatic: true,
    magSize: 30,
    reserveMax: 90,
    reloadTime: 3.05,
    drawTime: 0.9,
    moveSpeed: 5.55,
    spread: { stand: 0.24, crouch: 0.16, move: 4.6, air: 8, perShot: 0.42, max: 4.5, recover: 6 },
    recoil: { pattern: M4_PATTERN, viewPunch: 0.5, recover: 9 },
    sound: 'm4',
    feed: 'M4A4',
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    slot: 0,
    kind: 'sniper',
    team: 'any',
    price: 4750,
    damage: 125,
    armorPen: 0.975,
    rangeMod: 0.995,
    range: 300,
    fireInterval: 1.46,
    automatic: false,
    magSize: 10,
    reserveMax: 30,
    reloadTime: 3.6,
    drawTime: 1.15,
    moveSpeed: 4.9,
    spread: { stand: 0.03, crouch: 0.02, move: 9, air: 16, perShot: 0, max: 0, recover: 4 },
    recoil: { pattern: single(3.6, 0.3), viewPunch: 0.6, recover: 4.5 },
    scope: { fovs: [30, 9], unscopedPenalty: 7.5, scopedMoveSpeed: 2.6 },
    sound: 'awp',
    feed: 'AWP',
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    slot: 1,
    kind: 'pistol',
    team: 'T',
    price: 200,
    damage: 24,
    armorPen: 0.47,
    rangeMod: 0.8,
    range: 120,
    fireInterval: 0.15,
    automatic: false,
    magSize: 20,
    reserveMax: 120,
    reloadTime: 2.2,
    drawTime: 0.55,
    moveSpeed: 5.75,
    spread: { stand: 0.55, crouch: 0.45, move: 2.2, air: 5, perShot: 1.1, max: 4.5, recover: 6.5 },
    recoil: { pattern: single(1.25, 0.25), viewPunch: 0.6, recover: 10 },
    sound: 'glock',
    feed: 'Glock-18',
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    slot: 1,
    kind: 'pistol',
    team: 'CT',
    price: 200,
    damage: 32,
    armorPen: 0.505,
    rangeMod: 0.91,
    range: 120,
    fireInterval: 0.17,
    automatic: false,
    magSize: 12,
    reserveMax: 24,
    reloadTime: 2.2,
    drawTime: 0.6,
    moveSpeed: 5.75,
    spread: { stand: 0.3, crouch: 0.22, move: 2.0, air: 5, perShot: 1.25, max: 4.5, recover: 6.5 },
    recoil: { pattern: single(1.55, 0.25), viewPunch: 0.6, recover: 10 },
    sound: 'usp',
    feed: 'USP-S',
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    slot: 1,
    kind: 'pistol',
    team: 'any',
    price: 700,
    damage: 46,
    armorPen: 0.93,
    rangeMod: 0.82,
    range: 150,
    fireInterval: 0.225,
    automatic: false,
    magSize: 7,
    reserveMax: 35,
    reloadTime: 2.2,
    drawTime: 0.7,
    moveSpeed: 5.5,
    spread: { stand: 0.38, crouch: 0.3, move: 3.6, air: 7, perShot: 3.4, max: 8, recover: 4.2 },
    recoil: { pattern: single(4.2, 0.6), viewPunch: 0.65, recover: 6 },
    sound: 'deagle',
    feed: 'Deagle',
  },
  knife: {
    id: 'knife',
    name: '刀',
    slot: 2,
    kind: 'knife',
    team: 'any',
    price: 0,
    damage: 34,
    armorPen: 0.85,
    rangeMod: 1,
    range: 1.6,
    fireInterval: 0.42,
    automatic: true,
    magSize: 0,
    reserveMax: 0,
    reloadTime: 0,
    drawTime: 0.5,
    moveSpeed: 6.1,
    spread: { stand: 0, crouch: 0, move: 0, air: 0, perShot: 0, max: 0, recover: 1 },
    recoil: { pattern: [[0, 0]], viewPunch: 0, recover: 10 },
    melee: { range: 1.6, altDamage: 65, altInterval: 1.0, altRange: 1.35 },
    sound: 'knife',
    feed: 'Knife',
  },
  c4: {
    id: 'c4',
    name: 'C4 炸弹',
    slot: 3,
    kind: 'c4',
    team: 'T',
    price: 0,
    damage: 0,
    armorPen: 1,
    rangeMod: 1,
    range: 0,
    fireInterval: 0.2,
    automatic: true,
    magSize: 0,
    reserveMax: 0,
    reloadTime: 0,
    drawTime: 0.6,
    moveSpeed: 5.75,
    spread: { stand: 0, crouch: 0, move: 0, air: 0, perShot: 0, max: 0, recover: 1 },
    recoil: { pattern: [[0, 0]], viewPunch: 0, recover: 10 },
    sound: 'none',
    feed: 'C4',
  },
};

export const DEFAULT_PISTOL: Record<Team, WeaponId> = { T: 'glock', CT: 'usp' };
export const DEFAULT_RIFLE: Record<Team, WeaponId> = { T: 'ak47', CT: 'm4a4' };

export const BUYABLE_PRIMARY: WeaponId[] = ['ak47', 'm4a4', 'awp'];
export const BUYABLE_SECONDARY: WeaponId[] = ['glock', 'usp', 'deagle'];

/** Runtime state of one carried weapon. */
export class WeaponInstance {
  ammo: number;
  reserve: number;

  constructor(readonly def: WeaponDef) {
    this.ammo = def.magSize;
    this.reserve = def.reserveMax;
  }

  get id(): WeaponId {
    return this.def.id;
  }
}

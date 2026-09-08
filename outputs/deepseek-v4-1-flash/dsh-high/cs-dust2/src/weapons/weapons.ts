export type WeaponSlot = 'primary' | 'secondary' | 'knife';
export type WeaponKind = 'rifle' | 'sniper' | 'pistol' | 'knife';
export type HitRegion = 'head' | 'chest' | 'abdomen' | 'arm' | 'leg';

export const REGION_MULT: Record<HitRegion, number> = {
  head: 2.0, // headshot is exactly double body damage, per spec
  chest: 1.0,
  abdomen: 0.85,
  arm: 0.7,
  leg: 0.6,
};

export interface ViewPart {
  pos: [number, number, number];
  size: [number, number, number];
  color: number;
  rot?: [number, number, number];
}

export interface ViewModelSpec {
  parts: ViewPart[];
  /** Muzzle flash / tracer origin in view space. */
  muzzle: [number, number, number];
  /** Resting pose of the whole model. */
  offset: [number, number, number];
  scale?: number;
}

export interface WeaponDef {
  id: string;
  name: string;
  slot: WeaponSlot;
  kind: WeaponKind;
  damage: number;
  headshotMult: number;
  rpm: number;
  magSize: number;
  reserve: number;
  reloadTime: number;
  spreadBase: number;
  spreadPerShot: number;
  spreadMax: number;
  spreadRecover: number;
  recoilKick: number;
  recoilRecover: number;
  moveSpeed: number;
  range: number;
  auto: boolean;
  drawTime: number;
  scoped?: boolean;
  scopeFov?: number;
  scopedMoveSpeed?: number;
  scopedSpread?: number;
  pellets?: number;
  view: ViewModelSpec;
}

const metal: number = 0x2b2b2f;
const wood: number = 0x6b4a2a;
const dark: number = 0x1c1c20;
const steel: number = 0x4a4d55;

export const WEAPONS: Record<string, WeaponDef> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    slot: 'primary',
    kind: 'rifle',
    damage: 58,
    headshotMult: 2.0,
    rpm: 600,
    magSize: 30,
    reserve: 90,
    reloadTime: 2.5,
    spreadBase: 0.0055,
    spreadPerShot: 0.014,
    spreadMax: 0.11,
    spreadRecover: 0.11,
    recoilKick: 0.021,
    recoilRecover: 6.5,
    moveSpeed: 4.5,
    range: 62,
    auto: true,
    drawTime: 0.7,
    view: {
      offset: [0.16, -0.16, -0.42],
      muzzle: [0.16, -0.09, -1.02],
      parts: [
        { pos: [0, 0, -0.34], size: [0.07, 0.1, 0.6], color: dark },
        { pos: [0, 0.02, -0.72], size: [0.045, 0.06, 0.34], color: metal },
        { pos: [0, -0.09, -0.12], size: [0.06, 0.12, 0.22], color: wood, rot: [0.35, 0, 0] },
        { pos: [0, -0.02, 0.06], size: [0.07, 0.14, 0.18], color: wood, rot: [-0.15, 0, 0] },
        { pos: [0, -0.12, -0.46], size: [0.05, 0.22, 0.09], color: wood, rot: [-0.35, 0, 0] },
        { pos: [0, 0.09, -0.5], size: [0.03, 0.03, 0.16], color: steel },
      ],
    },
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    slot: 'primary',
    kind: 'rifle',
    damage: 33,
    headshotMult: 2.0,
    rpm: 666,
    magSize: 30,
    reserve: 90,
    reloadTime: 3.1,
    spreadBase: 0.004,
    spreadPerShot: 0.0075,
    spreadMax: 0.065,
    spreadRecover: 0.13,
    recoilKick: 0.012,
    recoilRecover: 8.0,
    moveSpeed: 4.8,
    range: 58,
    auto: true,
    drawTime: 0.7,
    view: {
      offset: [0.16, -0.16, -0.42],
      muzzle: [0.16, -0.1, -1.0],
      parts: [
        { pos: [0, 0, -0.34], size: [0.07, 0.1, 0.58], color: dark },
        { pos: [0, 0.02, -0.7], size: [0.04, 0.05, 0.32], color: metal },
        { pos: [0, -0.01, 0.02], size: [0.07, 0.12, 0.26], color: dark, rot: [-0.1, 0, 0] },
        { pos: [0, -0.11, -0.3], size: [0.05, 0.2, 0.08], color: dark, rot: [-0.25, 0, 0] },
        { pos: [0, 0.08, -0.42], size: [0.03, 0.035, 0.2], color: steel },
        { pos: [0, 0.05, -0.12], size: [0.035, 0.05, 0.1], color: steel },
      ],
    },
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    slot: 'primary',
    kind: 'sniper',
    damage: 200,
    headshotMult: 2.0,
    rpm: 41,
    magSize: 10,
    reserve: 30,
    reloadTime: 3.7,
    spreadBase: 0.06,
    scopedSpread: 0.0006,
    spreadPerShot: 0.05,
    spreadMax: 0.12,
    spreadRecover: 0.5,
    recoilKick: 0.075,
    recoilRecover: 4.0,
    moveSpeed: 4.2,
    scopedMoveSpeed: 1.4,
    range: 100,
    auto: false,
    drawTime: 0.95,
    scoped: true,
    scopeFov: 20,
    view: {
      offset: [0.15, -0.15, -0.5],
      muzzle: [0.15, -0.08, -1.35],
      parts: [
        { pos: [0, 0, -0.45], size: [0.06, 0.09, 0.9], color: 0x3a4a2f },
        { pos: [0, 0.0, -1.0], size: [0.035, 0.05, 0.45], color: metal },
        { pos: [0, 0.0, 0.15], size: [0.07, 0.11, 0.42], color: 0x3a4a2f },
        { pos: [0, -0.1, 0.02], size: [0.05, 0.2, 0.08], color: 0x3a4a2f, rot: [-0.2, 0, 0] },
        { pos: [0, 0.1, -0.35], size: [0.05, 0.05, 0.3], color: dark },
        { pos: [0, 0.1, -0.1], size: [0.055, 0.055, 0.16], color: 0x111114 },
      ],
    },
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    slot: 'secondary',
    kind: 'pistol',
    damage: 26,
    headshotMult: 2.0,
    rpm: 400,
    magSize: 20,
    reserve: 120,
    reloadTime: 2.2,
    spreadBase: 0.012,
    spreadPerShot: 0.011,
    spreadMax: 0.09,
    spreadRecover: 0.16,
    recoilKick: 0.013,
    recoilRecover: 9.0,
    moveSpeed: 5.4,
    range: 34,
    auto: false,
    drawTime: 0.45,
    view: {
      offset: [0.13, -0.16, -0.3],
      muzzle: [0.13, -0.11, -0.56],
      parts: [
        { pos: [0, 0, -0.18], size: [0.05, 0.07, 0.34], color: dark },
        { pos: [0, -0.11, -0.05], size: [0.055, 0.16, 0.11], color: dark, rot: [0.22, 0, 0] },
        { pos: [0, -0.03, 0.04], size: [0.05, 0.1, 0.1], color: 0x2a2a2e },
      ],
    },
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    slot: 'secondary',
    kind: 'pistol',
    damage: 34,
    headshotMult: 2.0,
    rpm: 352,
    magSize: 12,
    reserve: 100,
    reloadTime: 2.2,
    spreadBase: 0.009,
    spreadPerShot: 0.014,
    spreadMax: 0.09,
    spreadRecover: 0.16,
    recoilKick: 0.016,
    recoilRecover: 9.0,
    moveSpeed: 5.4,
    range: 38,
    auto: false,
    drawTime: 0.45,
    view: {
      offset: [0.13, -0.16, -0.3],
      muzzle: [0.13, -0.11, -0.66],
      parts: [
        { pos: [0, 0, -0.22], size: [0.05, 0.07, 0.42], color: 0x232327 },
        { pos: [0, -0.11, -0.05], size: [0.055, 0.16, 0.11], color: 0x232327, rot: [0.22, 0, 0] },
        { pos: [0, 0.055, -0.3], size: [0.03, 0.03, 0.12], color: steel },
      ],
    },
  },
  deagle: {
    id: 'deagle',
    name: '沙漠之鹰',
    slot: 'secondary',
    kind: 'pistol',
    damage: 48,
    headshotMult: 2.0,
    rpm: 267,
    magSize: 7,
    reserve: 35,
    reloadTime: 2.3,
    spreadBase: 0.014,
    spreadPerShot: 0.032,
    spreadMax: 0.13,
    spreadRecover: 0.22,
    recoilKick: 0.042,
    recoilRecover: 7.0,
    moveSpeed: 5.2,
    range: 46,
    auto: false,
    drawTime: 0.55,
    view: {
      offset: [0.14, -0.16, -0.32],
      muzzle: [0.14, -0.1, -0.7],
      parts: [
        { pos: [0, 0, -0.24], size: [0.06, 0.09, 0.48], color: 0x8f8f96 },
        { pos: [0, -0.12, -0.06], size: [0.06, 0.17, 0.12], color: 0x2a2a2e, rot: [0.2, 0, 0] },
        { pos: [0, 0.07, -0.2], size: [0.035, 0.035, 0.3], color: steel },
      ],
    },
  },
  knife: {
    id: 'knife',
    name: '刀',
    slot: 'knife',
    kind: 'knife',
    damage: 55,
    headshotMult: 2.0,
    rpm: 180,
    magSize: 0,
    reserve: 0,
    reloadTime: 0,
    spreadBase: 0,
    spreadPerShot: 0,
    spreadMax: 0,
    spreadRecover: 0,
    recoilKick: 0.02,
    recoilRecover: 12,
    moveSpeed: 6.3,
    range: 2.0,
    auto: false,
    drawTime: 0.3,
    view: {
      offset: [0.2, -0.2, -0.36],
      muzzle: [0.2, -0.14, -0.6],
      parts: [
        { pos: [0, 0, -0.16], size: [0.02, 0.14, 0.02], color: dark },
        { pos: [0, 0.02, -0.05], size: [0.05, 0.04, 0.16], color: 0x2a2a2e },
        { pos: [0, 0.16, -0.2], size: [0.015, 0.3, 0.07], color: 0xcfd4dc, rot: [0.3, 0, 0] },
      ],
    },
  },
};

export const WEAPON_ORDER: string[] = ['ak47', 'm4a4', 'awp', 'glock', 'usp', 'deagle', 'knife'];

export interface WeaponInstance {
  def: WeaponDef;
  ammo: number;
  reserve: number;
}

export function makeWeapon(id: string): WeaponInstance {
  const def = WEAPONS[id];
  if (!def) throw new Error(`Unknown weapon ${id}`);
  return { def, ammo: def.magSize, reserve: def.reserve };
}

/** Damage falloff with distance. */
export function damageAtRange(def: WeaponDef, dist: number): number {
  if (def.kind === 'knife') return def.damage;
  const f = Math.max(0.5, 1 - (dist / def.range) * 0.5);
  return def.damage * f;
}

/** Fire interval in seconds. */
export const fireInterval = (def: WeaponDef): number => 60 / def.rpm;

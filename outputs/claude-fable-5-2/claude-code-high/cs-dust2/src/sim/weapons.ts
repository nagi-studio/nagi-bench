// Data-driven weapon definitions. Adding a weapon = adding one entry to WEAPONS
// (plus, optionally, a procedural model in render/weaponModels.ts and a voice in audio).

export type WeaponId = 'ak47' | 'm4a1' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type Slot = 'primary' | 'secondary' | 'melee';
export type WeaponKind = 'rifle' | 'sniper' | 'pistol' | 'melee';
export type HitZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: Slot;
  kind: WeaponKind;
  /** Base damage against the chest at point blank. */
  damage: number;
  /** Fraction of damage that passes through armor (0..1). */
  armorPen: number;
  /** Damage multiplier applied per 25 m travelled. */
  rangeMod: number;
  rpm: number;
  auto: boolean;
  magSize: number;
  reserve: number;
  reloadTime: number;
  drawTime: number;
  /** Max hitscan distance in metres. */
  range: number;
  /** Movement speed multiplier while holding the weapon. */
  moveMul: number;

  // --- accuracy (radians of cone half-angle) ---
  spreadBase: number;
  spreadShot: number;
  spreadMax: number;
  /** Exponential recovery rate (1/s). */
  spreadRecover: number;
  spreadMove: number;
  spreadAir: number;

  // --- recoil (radians) ---
  recoilPitch: number;
  recoilYaw: number;
  recoilMaxPitch: number;
  /** Visual kick strength of the first-person model (0..1+). */
  viewKick: number;

  /** Scope settings (AWP). */
  zoom?: {
    fovs: number[];
    spreadScoped: number;
    moveMul: number;
    /** Seconds the scope stays lowered after each shot (bolt cycle). */
    rezoomDelay: number;
  };

  /** Melee only: secondary (heavy) attack. */
  melee?: { range: number; heavyDamage: number; heavyInterval: number };

  // --- AI hints ---
  botBurst: [number, number];
  botTapInterval: [number, number];
}

const DEG = Math.PI / 180;

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    slot: 'primary',
    kind: 'rifle',
    damage: 38,
    armorPen: 0.78,
    rangeMod: 0.98,
    rpm: 600,
    auto: true,
    magSize: 30,
    reserve: 90,
    reloadTime: 2.5,
    drawTime: 0.75,
    range: 200,
    moveMul: 0.88,
    spreadBase: 0.0032,
    spreadShot: 0.0048,
    spreadMax: 0.06,
    spreadRecover: 5.5,
    spreadMove: 0.055,
    spreadAir: 0.14,
    recoilPitch: 1.6 * DEG,
    recoilYaw: 0.62 * DEG,
    recoilMaxPitch: 13.5 * DEG,
    viewKick: 1.0,
    botBurst: [3, 6],
    botTapInterval: [0.1, 0.1],
  },
  m4a1: {
    id: 'm4a1',
    name: 'M4A1',
    slot: 'primary',
    kind: 'rifle',
    damage: 31,
    armorPen: 0.7,
    rangeMod: 0.97,
    rpm: 700,
    auto: true,
    magSize: 30,
    reserve: 90,
    reloadTime: 2.7,
    drawTime: 0.7,
    range: 200,
    moveMul: 0.9,
    spreadBase: 0.0026,
    spreadShot: 0.0023,
    spreadMax: 0.034,
    spreadRecover: 7,
    spreadMove: 0.045,
    spreadAir: 0.12,
    recoilPitch: 0.6 * DEG,
    recoilYaw: 0.24 * DEG,
    recoilMaxPitch: 6 * DEG,
    viewKick: 0.55,
    botBurst: [4, 8],
    botTapInterval: [0.09, 0.09],
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    slot: 'primary',
    kind: 'sniper',
    damage: 135,
    armorPen: 0.975,
    rangeMod: 0.99,
    rpm: 41,
    auto: false,
    magSize: 5,
    reserve: 30,
    reloadTime: 3.6,
    drawTime: 1.1,
    range: 400,
    moveMul: 0.8,
    spreadBase: 0.05,
    spreadShot: 0.02,
    spreadMax: 0.08,
    spreadRecover: 3,
    spreadMove: 0.09,
    spreadAir: 0.2,
    recoilPitch: 3.6 * DEG,
    recoilYaw: 0.5 * DEG,
    recoilMaxPitch: 6 * DEG,
    viewKick: 1.8,
    zoom: { fovs: [30, 11], spreadScoped: 0.0004, moveMul: 0.45, rezoomDelay: 0.95 },
    botBurst: [1, 1],
    botTapInterval: [1.5, 1.7],
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    slot: 'secondary',
    kind: 'pistol',
    damage: 19,
    armorPen: 0.47,
    rangeMod: 0.85,
    rpm: 400,
    auto: false,
    magSize: 20,
    reserve: 120,
    reloadTime: 2.2,
    drawTime: 0.5,
    range: 120,
    moveMul: 1.0,
    spreadBase: 0.0065,
    spreadShot: 0.0055,
    spreadMax: 0.045,
    spreadRecover: 7,
    spreadMove: 0.022,
    spreadAir: 0.1,
    recoilPitch: 0.95 * DEG,
    recoilYaw: 0.3 * DEG,
    recoilMaxPitch: 5 * DEG,
    viewKick: 0.6,
    botBurst: [1, 1],
    botTapInterval: [0.17, 0.3],
  },
  usp: {
    id: 'usp',
    name: 'USP',
    slot: 'secondary',
    kind: 'pistol',
    damage: 22,
    armorPen: 0.5,
    rangeMod: 0.88,
    rpm: 352,
    auto: false,
    magSize: 12,
    reserve: 48,
    reloadTime: 2.2,
    drawTime: 0.5,
    range: 120,
    moveMul: 1.0,
    spreadBase: 0.0045,
    spreadShot: 0.006,
    spreadMax: 0.045,
    spreadRecover: 7,
    spreadMove: 0.022,
    spreadAir: 0.1,
    recoilPitch: 1.15 * DEG,
    recoilYaw: 0.3 * DEG,
    recoilMaxPitch: 5.5 * DEG,
    viewKick: 0.7,
    botBurst: [1, 1],
    botTapInterval: [0.19, 0.32],
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    slot: 'secondary',
    kind: 'pistol',
    damage: 28,
    armorPen: 0.93,
    rangeMod: 0.9,
    rpm: 220,
    auto: false,
    magSize: 7,
    reserve: 35,
    reloadTime: 2.3,
    drawTime: 0.6,
    range: 150,
    moveMul: 0.95,
    spreadBase: 0.004,
    spreadShot: 0.024,
    spreadMax: 0.07,
    spreadRecover: 3.2,
    spreadMove: 0.04,
    spreadAir: 0.14,
    recoilPitch: 3.3 * DEG,
    recoilYaw: 0.8 * DEG,
    recoilMaxPitch: 9 * DEG,
    viewKick: 1.5,
    botBurst: [1, 1],
    botTapInterval: [0.38, 0.6],
  },
  knife: {
    id: 'knife',
    name: '战术刀',
    slot: 'melee',
    kind: 'melee',
    damage: 40,
    armorPen: 0.85,
    rangeMod: 1,
    rpm: 130,
    auto: true,
    magSize: 0,
    reserve: 0,
    reloadTime: 0,
    drawTime: 0.45,
    range: 1.9,
    moveMul: 1.06,
    spreadBase: 0,
    spreadShot: 0,
    spreadMax: 0,
    spreadRecover: 1,
    spreadMove: 0,
    spreadAir: 0,
    recoilPitch: 0,
    recoilYaw: 0,
    recoilMaxPitch: 0,
    viewKick: 0,
    melee: { range: 1.7, heavyDamage: 65, heavyInterval: 1.0 },
    botBurst: [1, 1],
    botTapInterval: [0.5, 0.5],
  },
};

/** Hitbox multipliers: a headshot deals exactly twice the chest (body) damage. */
export const ZONE_MULT: Record<HitZone, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 0.9,
  arm: 0.75,
  leg: 0.65,
};

export const ZONE_LABEL: Record<HitZone, string> = {
  head: '头部',
  chest: '胸部',
  stomach: '腹部',
  arm: '手臂',
  leg: '腿部',
};

export const SLOT_ORDER: Slot[] = ['primary', 'secondary', 'melee'];

/** Runtime ammo state of one carried weapon. */
export class WeaponState {
  def: WeaponDef;
  ammo: number;
  reserve: number;
  constructor(id: WeaponId) {
    this.def = WEAPONS[id];
    this.ammo = this.def.magSize;
    this.reserve = this.def.reserve;
  }
}

export interface ArmorResult {
  health: number;
  armor: number;
}

/**
 * Armor model: armored zones (head needs a helmet; chest/stomach/arms need kevlar; legs are never
 * covered) only let `armorPen` of the damage through, and the vest absorbs half of the rest.
 */
export function applyArmor(damage: number, zone: HitZone, armor: number, helmet: boolean, pen: number): ArmorResult {
  const covered = zone === 'head' ? helmet && armor > 0 : zone !== 'leg' && armor > 0;
  if (!covered) return { health: damage, armor: 0 };
  let toHealth = damage * pen;
  let toArmor = (damage - toHealth) * 0.5;
  if (toArmor > armor) {
    // Vest breaks: the unabsorbed part goes to health.
    toHealth += (toArmor - armor) * 2;
    toArmor = armor;
  }
  return { health: toHealth, armor: toArmor };
}

// Data-driven weapon definitions. Adding a weapon = adding an entry here (plus
// optionally a model builder in render/gunModels.ts and a sound profile).

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type Slot = 'primary' | 'secondary' | 'melee';
export type SoundProfile = 'ak' | 'm4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: Slot;
  /** Base damage to the chest (hitgroup multiplier 1.0). */
  damage: number;
  /** Fraction of damage that goes through armor. */
  armorPen: number;
  /** Damage multiplier per 10 metres travelled. */
  rangeMod: number;
  range: number;
  /** Seconds between shots. */
  fireInterval: number;
  auto: boolean;
  magSize: number;
  reserve: number;
  reloadTime: number;
  drawTime: number;
  /** Max running speed in m/s while holding the weapon. */
  speed: number;
  // Accuracy (radians, cone half angle)
  spreadBase: number;
  spreadMove: number;
  spreadAir: number;
  spreadPerShot: number;
  spreadMax: number;
  /** Recovery of accumulated spread (rad/s). */
  spreadRecover: number;
  // Recoil (view punch, radians)
  recoilPitch: number;
  recoilYaw: number;
  recoilMax: number;
  /** Exponential decay rate of the view punch once you stop firing. */
  recoilRecover: number;
  /** Zoom levels (vertical FOV in degrees); presence enables right-click scope. */
  scopeFov?: number[];
  scopedSpread?: number;
  scopedSpeed?: number;
  /** Melee secondary attack. */
  altDamage?: number;
  altInterval?: number;
  sound: SoundProfile;
  price: number;
  /** Short label used in the kill feed. */
  icon: string;
}

const deg = (d: number) => (d * Math.PI) / 180;

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    slot: 'primary',
    damage: 40,
    armorPen: 0.775,
    rangeMod: 0.985,
    range: 300,
    fireInterval: 0.1,
    auto: true,
    magSize: 30,
    reserve: 90,
    reloadTime: 2.45,
    drawTime: 1.0,
    speed: 5.3,
    spreadBase: deg(0.25),
    spreadMove: deg(5.5),
    spreadAir: deg(9),
    spreadPerShot: deg(0.75),
    spreadMax: deg(5),
    spreadRecover: deg(14),
    recoilPitch: deg(1.45),
    recoilYaw: deg(0.75),
    recoilMax: deg(13),
    recoilRecover: 5,
    sound: 'ak',
    price: 2700,
    icon: 'AK-47',
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    slot: 'primary',
    damage: 33,
    armorPen: 0.7,
    rangeMod: 0.97,
    range: 300,
    fireInterval: 0.088,
    auto: true,
    magSize: 30,
    reserve: 90,
    reloadTime: 3.0,
    drawTime: 1.0,
    speed: 5.5,
    spreadBase: deg(0.2),
    spreadMove: deg(4.5),
    spreadAir: deg(8),
    spreadPerShot: deg(0.38),
    spreadMax: deg(3),
    spreadRecover: deg(14),
    recoilPitch: deg(0.7),
    recoilYaw: deg(0.38),
    recoilMax: deg(7),
    recoilRecover: 6,
    sound: 'm4',
    price: 3100,
    icon: 'M4A4',
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    slot: 'primary',
    damage: 115,
    armorPen: 0.975,
    rangeMod: 0.995,
    range: 400,
    fireInterval: 1.46,
    auto: false,
    magSize: 5,
    reserve: 30,
    reloadTime: 3.6,
    drawTime: 1.2,
    speed: 4.8,
    scopedSpeed: 2.4,
    spreadBase: deg(4.5), // unscoped: very inaccurate
    spreadMove: deg(9),
    spreadAir: deg(14),
    spreadPerShot: 0,
    spreadMax: deg(1),
    spreadRecover: deg(10),
    recoilPitch: deg(3.5),
    recoilYaw: deg(0.6),
    recoilMax: deg(6),
    recoilRecover: 4,
    scopeFov: [40, 15],
    scopedSpread: deg(0.05),
    sound: 'awp',
    price: 4750,
    icon: 'AWP',
  },
  glock: {
    id: 'glock',
    name: 'Glock-18',
    slot: 'secondary',
    damage: 21,
    armorPen: 0.47,
    rangeMod: 0.85,
    range: 200,
    fireInterval: 0.15,
    auto: false,
    magSize: 20,
    reserve: 120,
    reloadTime: 2.2,
    drawTime: 0.6,
    speed: 5.9,
    spreadBase: deg(0.6),
    spreadMove: deg(2.5),
    spreadAir: deg(8),
    spreadPerShot: deg(0.9),
    spreadMax: deg(4),
    spreadRecover: deg(10),
    recoilPitch: deg(0.9),
    recoilYaw: deg(0.4),
    recoilMax: deg(6),
    recoilRecover: 7,
    sound: 'glock',
    price: 200,
    icon: 'Glock',
  },
  usp: {
    id: 'usp',
    name: 'USP-S',
    slot: 'secondary',
    damage: 25,
    armorPen: 0.505,
    rangeMod: 0.91,
    range: 200,
    fireInterval: 0.17,
    auto: false,
    magSize: 12,
    reserve: 24,
    reloadTime: 2.2,
    drawTime: 0.6,
    speed: 5.9,
    spreadBase: deg(0.35),
    spreadMove: deg(2.2),
    spreadAir: deg(8),
    spreadPerShot: deg(0.95),
    spreadMax: deg(4),
    spreadRecover: deg(10),
    recoilPitch: deg(1.0),
    recoilYaw: deg(0.35),
    recoilMax: deg(6),
    recoilRecover: 7,
    sound: 'usp',
    price: 200,
    icon: 'USP-S',
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    slot: 'secondary',
    damage: 31,
    armorPen: 0.932,
    rangeMod: 0.81,
    range: 200,
    fireInterval: 0.225,
    auto: false,
    magSize: 7,
    reserve: 35,
    reloadTime: 2.2,
    drawTime: 0.7,
    speed: 5.75,
    spreadBase: deg(0.35),
    spreadMove: deg(4),
    spreadAir: deg(10),
    spreadPerShot: deg(3.2),
    spreadMax: deg(6),
    spreadRecover: deg(9),
    recoilPitch: deg(3.6),
    recoilYaw: deg(1.0),
    recoilMax: deg(10),
    recoilRecover: 5,
    sound: 'deagle',
    price: 700,
    icon: 'Deagle',
  },
  knife: {
    id: 'knife',
    name: '匕首',
    slot: 'melee',
    damage: 40,
    altDamage: 65,
    armorPen: 0.85,
    rangeMod: 1,
    range: 1.9,
    fireInterval: 0.4,
    altInterval: 1.0,
    auto: true,
    magSize: 0,
    reserve: 0,
    reloadTime: 0,
    drawTime: 0.4,
    speed: 6.1,
    spreadBase: 0,
    spreadMove: 0,
    spreadAir: 0,
    spreadPerShot: 0,
    spreadMax: 0,
    spreadRecover: 1,
    recoilPitch: 0,
    recoilYaw: 0,
    recoilMax: 0,
    recoilRecover: 10,
    sound: 'knife',
    price: 0,
    icon: 'Knife',
  },
};

export const PRIMARY_IDS: WeaponId[] = ['ak47', 'm4a4', 'awp'];
export const SECONDARY_IDS: WeaponId[] = ['glock', 'usp', 'deagle'];

export interface WeaponInst {
  def: WeaponDef;
  mag: number;
  reserve: number;
}

export const makeWeapon = (id: WeaponId): WeaponInst => {
  const def = WEAPONS[id];
  return { def, mag: def.magSize, reserve: def.reserve };
};

// ----- Round loadout configuration -----

export type RoundType = 'pistol' | 'rifle';

export interface LoadoutConfig {
  label: string;
  primary: { T: WeaponId | null; CT: WeaponId | null };
  secondary: { T: WeaponId; CT: WeaponId };
  armor: number;
  helmet: boolean;
  /** Can the player choose a primary in the buy menu? */
  allowPrimary: boolean;
  /** Bots per team that pick an alternative weapon. */
  botAlt: { T: WeaponId[]; CT: WeaponId[] };
}

export const ROUND_CONFIG: Record<RoundType, LoadoutConfig> = {
  pistol: {
    label: '手枪局',
    primary: { T: null, CT: null },
    secondary: { T: 'glock', CT: 'usp' },
    armor: 0,
    helmet: false,
    allowPrimary: false,
    botAlt: { T: ['deagle'], CT: ['deagle'] },
  },
  rifle: {
    label: '长枪局',
    primary: { T: 'ak47', CT: 'm4a4' },
    secondary: { T: 'glock', CT: 'usp' },
    armor: 100,
    helmet: true,
    allowPrimary: true,
    botAlt: { T: ['awp'], CT: ['awp'] },
  },
};

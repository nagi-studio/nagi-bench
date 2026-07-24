/**
 * 武器数据系统。
 *
 * 所有手感差异（伤害 / 射速 / 精度 / 后坐力 / 移速 / 开镜）都是数据，
 * 逻辑层只吃这张表；连模型也是数据——parts 描述了一把枪由哪些盒子拼成，
 * 第一人称手持模型和第三人称挂载模型都由同一份 parts 生成。
 * 想加一把新枪，只要往 WEAPONS 里加一条。
 */

export type WeaponId =
  | 'ak47'
  | 'm4a4'
  | 'awp'
  | 'glock'
  | 'usp'
  | 'deagle'
  | 'knife'
  | 'c4';

export type WeaponSlot = 'primary' | 'secondary' | 'melee' | 'bomb';

/** 枪身零件（武器局部坐标：+X 右，+Y 上，-Z 枪口方向，原点在握把顶部）。 */
export interface WeaponPart {
  /** 中心位置 */
  p: [number, number, number];
  /** 尺寸 */
  s: [number, number, number];
  /** 颜色 */
  c: number;
  /** 可选旋转（弧度，绕 X/Y/Z） */
  r?: [number, number, number];
  /** 金属度/粗糙度提示 */
  metal?: boolean;
}

export interface ScopeConfig {
  /** 开镜视野角（度），越小拉得越近 */
  fov: number;
  /** 开镜灵敏度系数 */
  sens: number;
  /** 开镜后的基础精度（几乎无扩散） */
  spread: number;
  /** 开镜移速 */
  moveSpeed: number;
}

export interface WeaponDef {
  id: WeaponId;
  name: string;
  cn: string;
  slot: WeaponSlot;

  /** 胸部基准伤害。头部 = 2 倍（见 HITBOX_MULT）。 */
  damage: number;
  /** 护甲穿透 0..1，越高越无视护甲 */
  armorPen: number;
  /** 每分钟射速 */
  rpm: number;
  auto: boolean;
  magSize: number;
  reserve: number;
  reloadTime: number;
  /** 切枪抬起时间 */
  deployTime: number;

  /** 站定时的基础扩散（弧度） */
  baseSpread: number;
  /** 每发累加的扩散 */
  spreadPerShot: number;
  maxSpread: number;
  /** 扩散指数衰减速率（1/秒）：越大越快回到基础精度 */
  spreadRecovery: number;
  /** 移动带来的扩散系数（乘以 速度/最大速度） */
  moveSpread: number;
  /** 跳跃时的额外扩散 */
  airSpread: number;

  /** 每发视角上扬基准（弧度） */
  recoilV: number;
  /** 每发视角横向摆动基准（弧度） */
  recoilH: number;
  /** 视角回落速度 */
  recoilRecovery: number;
  /** 弹道模式的随机种子偏移，让每把枪的喷法不同 */
  patternSeed: number;

  /** 持该武器时的移动速度 m/s */
  moveSpeed: number;
  /** 伤害衰减：每 20m 乘一次该系数 */
  falloff: number;
  /** 最大有效距离（超出直接不计伤害） */
  range: number;

  scope?: ScopeConfig;
  /** 近战背刺倍率 */
  backstab?: number;

  price: number;
  killAward: number;

  /** 模型零件 */
  parts: WeaponPart[];
  /** 枪口位置（局部坐标），枪焰与弹道起点 */
  muzzle: [number, number, number];
  /** 第一人称握持位置微调 */
  viewOffset: [number, number, number];
  /** 第三人称握持缩放 */
  worldScale: number;
}

const STEEL = 0x24262b;
const DARK = 0x141416;
const WOOD = 0x6b4423;
const TAN = 0x9a8055;
const POLY = 0x2e3238;
const GREEN = 0x3f4a34;

/* -------------------------------------------------------------------------- */

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    cn: 'AK-47',
    slot: 'primary',
    damage: 40,
    armorPen: 0.775,
    rpm: 600,
    auto: true,
    magSize: 30,
    reserve: 90,
    reloadTime: 2.4,
    deployTime: 0.5,
    baseSpread: 0.0022,
    spreadPerShot: 0.0060,
    maxSpread: 0.075,
    spreadRecovery: 5.0,
    moveSpread: 0.030,
    airSpread: 0.085,
    // 后坐力剧烈：抬枪快、横向摆幅大、回落慢
    recoilV: 0.0125,
    recoilH: 0.0062,
    recoilRecovery: 5.5,
    patternSeed: 11,
    moveSpeed: 4.9,
    falloff: 0.965,
    range: 90,
    price: 2700,
    killAward: 300,
    muzzle: [0, 0.135, -0.72],
    viewOffset: [0.155, -0.145, -0.34],
    worldScale: 1,
    parts: [
      { p: [0, 0.1, -0.13], s: [0.055, 0.11, 0.52], c: STEEL, metal: true },
      { p: [0, 0.135, -0.5], s: [0.032, 0.032, 0.3], c: DARK, metal: true },
      { p: [0, 0.115, -0.36], s: [0.058, 0.075, 0.24], c: WOOD },
      { p: [0, 0.185, -0.34], s: [0.03, 0.03, 0.2], c: DARK, metal: true },
      { p: [0, -0.03, -0.11], s: [0.045, 0.2, 0.09], c: STEEL, r: [0.32, 0, 0], metal: true },
      { p: [0, 0.055, 0.2], s: [0.05, 0.1, 0.3], c: WOOD },
      { p: [0, 0.115, 0.09], s: [0.05, 0.08, 0.12], c: WOOD },
      { p: [0, -0.055, 0.045], s: [0.042, 0.15, 0.06], c: WOOD, r: [-0.22, 0, 0] },
      { p: [0, 0.175, -0.62], s: [0.018, 0.05, 0.02], c: DARK, metal: true },
      { p: [0, 0.175, -0.05], s: [0.018, 0.04, 0.02], c: DARK, metal: true },
    ],
  },

  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    cn: 'M4A4',
    slot: 'primary',
    damage: 33,
    armorPen: 0.7,
    rpm: 666,
    auto: true,
    magSize: 30,
    reserve: 90,
    reloadTime: 3.1,
    deployTime: 0.45,
    baseSpread: 0.0019,
    spreadPerShot: 0.0042,
    maxSpread: 0.055,
    spreadRecovery: 6.5,
    moveSpread: 0.026,
    airSpread: 0.075,
    // 后坐力低、射速高：更好压
    recoilV: 0.0078,
    recoilH: 0.0034,
    recoilRecovery: 7.5,
    patternSeed: 29,
    moveSpeed: 5.0,
    falloff: 0.955,
    range: 90,
    price: 3100,
    killAward: 300,
    muzzle: [0, 0.13, -0.72],
    viewOffset: [0.155, -0.145, -0.34],
    worldScale: 1,
    parts: [
      { p: [0, 0.095, -0.12], s: [0.05, 0.1, 0.5], c: POLY },
      { p: [0, 0.13, -0.52], s: [0.028, 0.028, 0.32], c: DARK, metal: true },
      { p: [0, 0.115, -0.36], s: [0.055, 0.07, 0.26], c: POLY },
      { p: [0, 0.185, -0.18], s: [0.026, 0.028, 0.42], c: DARK, metal: true },
      { p: [0, -0.035, -0.1], s: [0.042, 0.19, 0.085], c: POLY, r: [0.1, 0, 0] },
      { p: [0, 0.085, 0.22], s: [0.055, 0.11, 0.3], c: POLY },
      { p: [0, 0.105, 0.07], s: [0.05, 0.09, 0.14], c: POLY },
      { p: [0, -0.05, 0.05], s: [0.04, 0.15, 0.06], c: POLY, r: [-0.2, 0, 0] },
      { p: [0, 0.215, -0.55], s: [0.016, 0.05, 0.02], c: DARK, metal: true },
      { p: [0, 0.215, 0.02], s: [0.02, 0.045, 0.03], c: DARK, metal: true },
    ],
  },

  awp: {
    id: 'awp',
    name: 'AWP',
    cn: 'AWP 狙击枪',
    slot: 'primary',
    damage: 115,
    armorPen: 0.975,
    rpm: 41,
    auto: false,
    magSize: 5,
    reserve: 30,
    reloadTime: 3.7,
    deployTime: 1.25,
    baseSpread: 0.011,
    spreadPerShot: 0.05,
    maxSpread: 0.2,
    spreadRecovery: 2.5,
    moveSpread: 0.12,
    airSpread: 0.2,
    recoilV: 0.055,
    recoilH: 0.012,
    recoilRecovery: 3.2,
    patternSeed: 5,
    moveSpeed: 3.7,
    falloff: 0.995,
    range: 160,
    price: 4750,
    killAward: 100,
    scope: { fov: 22, sens: 0.42, spread: 0.00035, moveSpeed: 2.0 },
    muzzle: [0, 0.12, -0.86],
    viewOffset: [0.15, -0.14, -0.3],
    worldScale: 1,
    parts: [
      { p: [0, 0.09, -0.16], s: [0.055, 0.1, 0.56], c: GREEN },
      { p: [0, 0.12, -0.63], s: [0.036, 0.036, 0.46], c: DARK, metal: true },
      { p: [0, 0.115, -0.4], s: [0.06, 0.075, 0.3], c: GREEN },
      // 瞄准镜
      { p: [0, 0.215, -0.14], s: [0.056, 0.056, 0.34], c: DARK, metal: true },
      { p: [0, 0.215, -0.32], s: [0.07, 0.07, 0.05], c: DARK, metal: true },
      { p: [0, 0.215, 0.04], s: [0.075, 0.075, 0.05], c: DARK, metal: true },
      { p: [0, 0.16, -0.24], s: [0.022, 0.05, 0.03], c: STEEL, metal: true },
      { p: [0, 0.16, 0.0], s: [0.022, 0.05, 0.03], c: STEEL, metal: true },
      { p: [0, 0.075, 0.24], s: [0.055, 0.13, 0.34], c: GREEN },
      { p: [0, 0.16, 0.36], s: [0.05, 0.06, 0.12], c: GREEN },
      { p: [0, -0.045, 0.02], s: [0.042, 0.16, 0.065], c: GREEN, r: [-0.18, 0, 0] },
      { p: [0, -0.01, -0.1], s: [0.05, 0.11, 0.1], c: STEEL, metal: true },
      { p: [0.05, 0.11, 0.12], s: [0.07, 0.03, 0.03], c: STEEL, r: [0, 0, -0.3], metal: true },
    ],
  },

  glock: {
    id: 'glock',
    name: 'Glock-18',
    cn: '格洛克 18',
    slot: 'secondary',
    damage: 25,
    armorPen: 0.47,
    rpm: 400,
    auto: false,
    magSize: 20,
    reserve: 120,
    reloadTime: 2.2,
    deployTime: 0.35,
    baseSpread: 0.0035,
    spreadPerShot: 0.0075,
    maxSpread: 0.06,
    spreadRecovery: 7.0,
    moveSpread: 0.022,
    airSpread: 0.06,
    recoilV: 0.0088,
    recoilH: 0.0042,
    recoilRecovery: 8.5,
    patternSeed: 43,
    moveSpeed: 5.5,
    falloff: 0.9,
    range: 60,
    price: 200,
    killAward: 300,
    muzzle: [0, 0.055, -0.24],
    viewOffset: [0.13, -0.13, -0.3],
    worldScale: 1,
    parts: [
      { p: [0, 0.055, -0.06], s: [0.038, 0.075, 0.28], c: POLY },
      { p: [0, 0.02, -0.16], s: [0.03, 0.03, 0.08], c: DARK, metal: true },
      { p: [0, -0.075, 0.03], s: [0.036, 0.16, 0.06], c: POLY, r: [-0.24, 0, 0] },
      { p: [0, -0.01, -0.02], s: [0.03, 0.05, 0.04], c: DARK },
      { p: [0, 0.098, -0.17], s: [0.012, 0.02, 0.015], c: 0xdddddd },
      { p: [0, 0.098, 0.05], s: [0.016, 0.02, 0.015], c: 0xdddddd },
    ],
  },

  usp: {
    id: 'usp',
    name: 'USP-S',
    cn: 'USP 消音版',
    slot: 'secondary',
    damage: 28,
    armorPen: 0.5,
    rpm: 353,
    auto: false,
    magSize: 12,
    reserve: 84,
    reloadTime: 2.2,
    deployTime: 0.35,
    baseSpread: 0.0028,
    spreadPerShot: 0.0068,
    maxSpread: 0.055,
    spreadRecovery: 7.5,
    moveSpread: 0.02,
    airSpread: 0.055,
    recoilV: 0.0082,
    recoilH: 0.0034,
    recoilRecovery: 9,
    patternSeed: 61,
    moveSpeed: 5.5,
    falloff: 0.9,
    range: 65,
    price: 200,
    killAward: 300,
    muzzle: [0, 0.055, -0.36],
    viewOffset: [0.13, -0.13, -0.3],
    worldScale: 1,
    parts: [
      { p: [0, 0.055, -0.05], s: [0.036, 0.072, 0.26], c: DARK },
      { p: [0, 0.052, -0.26], s: [0.05, 0.05, 0.2], c: STEEL, metal: true },
      { p: [0, -0.07, 0.02], s: [0.034, 0.15, 0.058], c: DARK, r: [-0.2, 0, 0] },
      { p: [0, -0.008, -0.02], s: [0.028, 0.05, 0.04], c: DARK },
      { p: [0, 0.095, 0.05], s: [0.016, 0.018, 0.015], c: 0xdddddd },
    ],
  },

  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    cn: '沙漠之鹰',
    slot: 'secondary',
    // 伤害梯度按需求设定：手枪(25/28) < 沙鹰(32) < 步枪(33/40)。
    // 真实 CS 里沙鹰是 63（比 AK 还高），如果想要那种手感，把这里改成 63 即可，
    // 其余数值（7 发弹匣、慢射速、高单发后坐力）已经是沙鹰的特征。
    damage: 32,
    armorPen: 0.62,
    rpm: 267,
    auto: false,
    magSize: 7,
    reserve: 35,
    reloadTime: 2.2,
    deployTime: 0.4,
    baseSpread: 0.0032,
    spreadPerShot: 0.019,
    maxSpread: 0.09,
    spreadRecovery: 4.5,
    moveSpread: 0.045,
    airSpread: 0.09,
    recoilV: 0.031,
    recoilH: 0.009,
    recoilRecovery: 5,
    patternSeed: 71,
    moveSpeed: 5.3,
    falloff: 0.94,
    range: 75,
    price: 700,
    killAward: 300,
    muzzle: [0, 0.065, -0.3],
    viewOffset: [0.13, -0.13, -0.3],
    worldScale: 1,
    parts: [
      { p: [0, 0.065, -0.08], s: [0.042, 0.09, 0.34], c: TAN, metal: true },
      { p: [0, 0.105, -0.12], s: [0.03, 0.022, 0.3], c: TAN, metal: true },
      { p: [0, 0.03, -0.22], s: [0.032, 0.032, 0.1], c: DARK, metal: true },
      { p: [0, -0.08, 0.03], s: [0.038, 0.17, 0.065], c: DARK, r: [-0.22, 0, 0] },
      { p: [0, -0.012, -0.02], s: [0.03, 0.05, 0.045], c: DARK },
      { p: [0, 0.115, -0.24], s: [0.014, 0.022, 0.015], c: 0xdddddd },
      { p: [0, 0.115, 0.03], s: [0.018, 0.022, 0.015], c: 0xdddddd },
    ],
  },

  knife: {
    id: 'knife',
    name: 'Knife',
    cn: '战术刀',
    slot: 'melee',
    damage: 55,
    armorPen: 0.85,
    rpm: 150,
    auto: false,
    magSize: 0,
    reserve: 0,
    reloadTime: 0,
    deployTime: 0.3,
    baseSpread: 0,
    spreadPerShot: 0,
    maxSpread: 0,
    spreadRecovery: 1,
    moveSpread: 0,
    airSpread: 0,
    recoilV: 0,
    recoilH: 0,
    recoilRecovery: 10,
    patternSeed: 3,
    moveSpeed: 5.8,
    falloff: 1,
    range: 1.6,
    backstab: 3.3,
    price: 0,
    killAward: 1500,
    muzzle: [0, 0.02, -0.3],
    viewOffset: [0.16, -0.16, -0.28],
    worldScale: 1,
    parts: [
      { p: [0, 0.02, -0.16], s: [0.012, 0.05, 0.26], c: 0xc9d1d9, metal: true },
      { p: [0, 0.045, -0.27], s: [0.012, 0.03, 0.06], c: 0xc9d1d9, r: [0.3, 0, 0], metal: true },
      { p: [0, 0.0, 0.02], s: [0.03, 0.045, 0.14], c: DARK },
      { p: [0, 0.03, -0.03], s: [0.05, 0.016, 0.02], c: STEEL, metal: true },
    ],
  },

  c4: {
    id: 'c4',
    name: 'C4',
    cn: 'C4 炸弹',
    slot: 'bomb',
    damage: 0,
    armorPen: 0,
    rpm: 60,
    auto: false,
    magSize: 0,
    reserve: 0,
    reloadTime: 0,
    deployTime: 0.4,
    baseSpread: 0,
    spreadPerShot: 0,
    maxSpread: 0,
    spreadRecovery: 1,
    moveSpread: 0,
    airSpread: 0,
    recoilV: 0,
    recoilH: 0,
    recoilRecovery: 10,
    patternSeed: 0,
    moveSpeed: 5.6,
    falloff: 1,
    range: 0,
    price: 0,
    killAward: 0,
    muzzle: [0, 0, 0],
    viewOffset: [0.1, -0.18, -0.34],
    worldScale: 1,
    parts: [
      { p: [0, 0, 0], s: [0.2, 0.13, 0.07], c: 0x2b2b2b },
      { p: [0, 0.02, -0.04], s: [0.09, 0.06, 0.02], c: 0x8b1a1a },
      { p: [0.06, -0.05, -0.04], s: [0.05, 0.02, 0.02], c: 0xd6b400 },
      { p: [-0.05, 0.055, 0], s: [0.02, 0.02, 0.05], c: 0xcccccc, metal: true },
    ],
  },
};

export const WEAPON_IDS = Object.keys(WEAPONS) as WeaponId[];

/** 每秒射速换算成开火间隔。 */
export function fireInterval(w: WeaponDef): number {
  return 60 / w.rpm;
}

/**
 * 后坐力模式：给定这一梭子的第 index 发，返回视角上扬/横移量（弧度）。
 * 用确定性公式生成，AK 前几发猛抬、之后横向蛇形；M4 更平滑。
 */
export function recoilPattern(w: WeaponDef, index: number): { v: number; h: number } {
  const i = index;
  // 竖直：前 6 发快速爬升然后趋于平台
  const climb = 1 - Math.exp(-i / 2.4);
  const v = w.recoilV * (0.55 + 1.5 * climb) * (1 + 0.18 * Math.sin(i * 1.7 + w.patternSeed));
  // 水平：随发数增大的蛇形摆动
  const sway = Math.sin(i * 0.62 + w.patternSeed * 0.7) + 0.55 * Math.sin(i * 1.31 + w.patternSeed);
  const h = w.recoilH * sway * Math.min(1.6, 0.25 + i * 0.22);
  return { v, h };
}

/* -------------------------------------------------------------------------- */
/* 命中盒                                                                      */
/* -------------------------------------------------------------------------- */

export type HitboxName = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

/**
 * 各部位伤害倍率。按需求：爆头 = 身体（胸部）的两倍。
 * 其余部位各不相同，四肢明显更抗打。
 */
export const HITBOX_MULT: Record<HitboxName, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.15,
  arm: 0.65,
  leg: 0.55,
};

export const HITBOX_CN: Record<HitboxName, string> = {
  head: '头部',
  chest: '胸部',
  stomach: '腹部',
  arm: '手臂',
  leg: '腿部',
};

/* -------------------------------------------------------------------------- */
/* 购买 / 默认配装                                                             */
/* -------------------------------------------------------------------------- */

export const ARMOR_PRICE = 650;
export const ARMOR_HELMET_PRICE = 1000;

export interface Loadout {
  primary?: WeaponId;
  secondary: WeaponId;
  armor: number;
  helmet: boolean;
}

/** 手枪局：只有默认手枪，没有主武器，护甲按手枪局给（无头盔）。 */
export function pistolRoundLoadout(team: 'T' | 'CT'): Loadout {
  return {
    secondary: team === 'T' ? 'glock' : 'usp',
    armor: 0,
    helmet: false,
  };
}

/** 常规回合的 AI 配装（玩家可以在购买菜单里自己选）。 */
export function defaultLoadout(team: 'T' | 'CT', awper: boolean): Loadout {
  return {
    primary: awper ? 'awp' : team === 'T' ? 'ak47' : 'm4a4',
    secondary: team === 'T' ? 'glock' : 'usp',
    armor: 100,
    helmet: true,
  };
}

/** 购买菜单里可选的东西。 */
export const BUY_MENU: Array<{ id: WeaponId | 'armor' | 'helmet'; label: string; price: number }> = [
  { id: 'ak47', label: 'AK-47', price: WEAPONS.ak47.price },
  { id: 'm4a4', label: 'M4A4', price: WEAPONS.m4a4.price },
  { id: 'awp', label: 'AWP', price: WEAPONS.awp.price },
  { id: 'deagle', label: '沙漠之鹰', price: WEAPONS.deagle.price },
  { id: 'glock', label: 'Glock-18', price: WEAPONS.glock.price },
  { id: 'usp', label: 'USP-S', price: WEAPONS.usp.price },
  { id: 'armor', label: '防弹衣', price: ARMOR_PRICE },
  { id: 'helmet', label: '防弹衣 + 头盔', price: ARMOR_HELMET_PRICE },
];

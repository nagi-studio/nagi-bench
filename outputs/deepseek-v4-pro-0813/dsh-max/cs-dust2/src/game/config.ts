// 全局配置：武器数据系统、物理参数、回合配置

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type WeaponSlot = 'primary' | 'secondary' | 'melee' | 'bomb';
export type Team = 'CT' | 'T';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  /** 基础伤害（胸部=1.0 倍率） */
  damage: number;
  /** 护甲吸收比例（AWP 穿甲更强，吸收更少） */
  armorAbsorb: number;
  /** 射速：每秒发数 */
  rpm: number;
  /** 弹匣容量 / 备弹 */
  magSize: number;
  reserve: number;
  /** 是否全自动 */
  auto: boolean;
  /** 换弹时间（秒） */
  reloadTime: number;
  /** 切换至该武器的时间（秒） */
  drawTime: number;
  /** 基础扩散（弧度，站立） */
  spreadBase: number;
  /** 每发叠加扩散 */
  spreadPerShot: number;
  /** 最大扩散 */
  spreadMax: number;
  /** 移动扩散 */
  spreadMove: number;
  /** 空中扩散 */
  spreadAir: number;
  /** 每发视角上仰（度） */
  recoilKick: number;
  /** 后坐力累积上限（度） */
  recoilMax: number;
  /** 开镜缩放等级（AWP） */
  zoomLevels?: number[];
  /** 开镜 FOV */
  zoomFovs?: number[];
  /** 开镜扩散 */
  spreadScoped?: number;
  /** 换弹声音类型 */
  reloadSound: 'rifle' | 'pistol' | 'awp' | 'none';
  /** 声音 */
  fireSound: 'ak' | 'm4' | 'awp' | 'pistol' | 'deagle' | 'knife';
  /** 音强 */
  loudness: number;
  /** 弹速痕迹颜色 */
  tracerColor: number;
}

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary',
    damage: 36, armorAbsorb: 0.5,
    rpm: 600, magSize: 30, reserve: 90,
    auto: true, reloadTime: 2.5, drawTime: 1.0,
    spreadBase: 0.0038, spreadPerShot: 0.0032, spreadMax: 0.030,
    spreadMove: 0.012, spreadAir: 0.05,
    recoilKick: 2.5, recoilMax: 9.0,
    reloadSound: 'rifle', fireSound: 'ak', loudness: 1.0, tracerColor: 0xffd27a,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary',
    damage: 33, armorAbsorb: 0.5,
    rpm: 667, magSize: 30, reserve: 90,
    auto: true, reloadTime: 3.0, drawTime: 1.0,
    spreadBase: 0.0032, spreadPerShot: 0.0020, spreadMax: 0.019,
    spreadMove: 0.010, spreadAir: 0.045,
    recoilKick: 1.45, recoilMax: 5.5,
    reloadSound: 'rifle', fireSound: 'm4', loudness: 0.9, tracerColor: 0xffe9a8,
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary',
    damage: 115, armorAbsorb: 0.25,
    rpm: 41, magSize: 5, reserve: 30,
    auto: false, reloadTime: 3.7, drawTime: 1.25,
    spreadBase: 0.14, spreadPerShot: 0.10, spreadMax: 0.30,
    spreadMove: 0.16, spreadAir: 0.30,
    recoilKick: 11.0, recoilMax: 14.0,
    zoomLevels: [0, 1, 2], zoomFovs: [70, 40, 12], spreadScoped: 0.0006,
    reloadSound: 'awp', fireSound: 'awp', loudness: 1.3, tracerColor: 0xffe0a0,
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary',
    damage: 30, armorAbsorb: 0.5,
    rpm: 400, magSize: 20, reserve: 120,
    auto: false, reloadTime: 2.2, drawTime: 0.6,
    spreadBase: 0.0045, spreadPerShot: 0.0028, spreadMax: 0.024,
    spreadMove: 0.011, spreadAir: 0.04,
    recoilKick: 1.15, recoilMax: 4.5,
    reloadSound: 'pistol', fireSound: 'pistol', loudness: 0.7, tracerColor: 0xfff0c0,
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary',
    damage: 35, armorAbsorb: 0.5,
    rpm: 352, magSize: 12, reserve: 24,
    auto: false, reloadTime: 2.2, drawTime: 0.6,
    spreadBase: 0.0035, spreadPerShot: 0.0025, spreadMax: 0.021,
    spreadMove: 0.010, spreadAir: 0.038,
    recoilKick: 1.3, recoilMax: 4.0,
    reloadSound: 'pistol', fireSound: 'pistol', loudness: 0.65, tracerColor: 0xfff0c0,
  },
  deagle: {
    id: 'deagle', name: '沙漠之鹰', slot: 'secondary',
    damage: 53, armorAbsorb: 0.5,
    rpm: 267, magSize: 7, reserve: 35,
    auto: false, reloadTime: 2.2, drawTime: 0.8,
    spreadBase: 0.006, spreadPerShot: 0.007, spreadMax: 0.05,
    spreadMove: 0.016, spreadAir: 0.06,
    recoilKick: 4.0, recoilMax: 9.0,
    reloadSound: 'pistol', fireSound: 'deagle', loudness: 0.95, tracerColor: 0xffe090,
  },
  knife: {
    id: 'knife', name: '军刀', slot: 'melee',
    damage: 40, armorAbsorb: 0.25,
    rpm: 120, magSize: 0, reserve: 0,
    auto: false, reloadTime: 0, drawTime: 0.4,
    spreadBase: 0, spreadPerShot: 0, spreadMax: 0,
    spreadMove: 0, spreadAir: 0,
    recoilKick: 0, recoilMax: 0,
    reloadSound: 'none', fireSound: 'knife', loudness: 0.2, tracerColor: 0xffffff,
  },
};

/** Hitbox 分区伤害倍率（胸部 1.0） */
export const HITBOX_MULT: Record<string, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.15,
  arms: 0.85,
  legs: 0.75,
};

// 物理
export const PHYS = {
  gravity: 28,
  jumpVel: 7.0,
  playerRun: 5.0,
  playerWalk: 2.6,
  botRun: 4.4,
  botWalk: 2.4,
  hw: 0.3,          // 半宽
  height: 1.8,      // 身高
  eye: 1.62,        // 视线高度
  stepMax: 0.56,    // 自动登台阶高度
  maxFallSnap: 0.6,
};

// 回合
export const ROUND = {
  freezeTime: 8,
  liveTime: 100,
  bombTime: 35,
  plantTime: 3.5,
  defuseTime: 6.0,
  endTime: 3.5,
  winRounds: 8, // 先到 8 胜
  bombRadius: 24,
  bombLethal: 10,
  bombDamage: 500,
};

// AI
export const AI = {
  tick: 0.1,
  viewDist: 40,
  fov: Math.PI * 0.94, // 约 170°
  reactionMin: 0.28,
  reactionMax: 0.6,
  aimSpeed: 10,     // 弧度/秒
  repathInterval: 3.2,
  stuckTime: 1.4,
};

export interface Loadout {
  primary: WeaponId | null;
  secondary: WeaponId;
  armor: number;
}

/** 手枪局配置 */
export const PISTOL_LOADOUT: Record<Team, Loadout> = {
  T: { primary: null, secondary: 'glock', armor: 0 },
  CT: { primary: null, secondary: 'usp', armor: 0 },
};

/** 长枪局配置 */
export function rifleLoadout(team: Team, primary: WeaponId | 'awp' | 'rifle'): Loadout {
  let p: WeaponId;
  if (primary === 'awp') p = 'awp';
  else if (primary === 'rifle') p = team === 'T' ? 'ak47' : 'm4a4';
  else p = primary;
  return { primary: p, secondary: team === 'T' ? 'glock' : 'usp', armor: 100 };
}

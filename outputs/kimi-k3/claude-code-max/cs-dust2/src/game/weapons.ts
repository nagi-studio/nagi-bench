// ---------------------------------------------------------------------------
// 武器数据系统 —— 可扩展的武器定义表
// ---------------------------------------------------------------------------

import { Slot, Team } from './types';

export interface WeaponDef {
  id: string;
  name: string;
  slot: Slot;
  damage: number;
  /** 每分钟射速 */
  rpm: number;
  /** 是否全自动 */
  auto: boolean;
  magSize: number;
  reserve: number;
  reloadTime: number;      // 秒
  /** 站立基础散布（度） */
  spreadBase: number;
  /** 连续开火最大扩散（度） */
  spreadMax: number;
  /** 每发扩散增量（度） */
  bloomPerShot: number;
  /** 移动附加散布（度，按速度比例叠加） */
  spreadMove: number;
  /** 后坐力：视角上扬（度/发） */
  recoilPitch: number;
  /** 后坐力：水平抖动（度/发） */
  recoilYaw: number;
  /** 护甲穿透系数（有护甲时伤害 *= armorPen） */
  armorPen: number;
  /** 开镜倍率（FOV 除以该值），仅狙 */
  zoom?: number;
  scope?: boolean;
  /** 近战武器 */
  melee?: boolean;
  /** 近战距离 */
  range?: number;
  /** 音效 key */
  sound: string;
  tracerColor: number;
}

export const WEAPONS: Record<string, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: Slot.Primary,
    damage: 36, rpm: 600, auto: true,
    magSize: 30, reserve: 90, reloadTime: 2.5,
    spreadBase: 0.9, spreadMax: 7.5, bloomPerShot: 1.0, spreadMove: 2.2,
    recoilPitch: 1.55, recoilYaw: 0.55, armorPen: 0.775,
    sound: 'ak', tracerColor: 0xffc060,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: Slot.Primary,
    damage: 30, rpm: 666, auto: true,
    magSize: 30, reserve: 90, reloadTime: 2.2,
    spreadBase: 0.7, spreadMax: 4.5, bloomPerShot: 0.5, spreadMove: 1.6,
    recoilPitch: 0.85, recoilYaw: 0.35, armorPen: 0.7,
    sound: 'm4', tracerColor: 0x9fd0ff,
  },
  awp: {
    id: 'awp', name: 'AWP', slot: Slot.Primary,
    damage: 115, rpm: 41, auto: false,
    magSize: 5, reserve: 15, reloadTime: 3.2,
    spreadBase: 0.06, spreadMax: 0.2, bloomPerShot: 0.1, spreadMove: 4.0,
    recoilPitch: 3.2, recoilYaw: 0.6, armorPen: 0.975,
    zoom: 4.0, scope: true,
    sound: 'awp', tracerColor: 0xd0ffe0,
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: Slot.Secondary,
    damage: 25, rpm: 400, auto: false,
    magSize: 20, reserve: 120, reloadTime: 2.2,
    spreadBase: 1.0, spreadMax: 3.0, bloomPerShot: 0.45, spreadMove: 1.2,
    recoilPitch: 0.7, recoilYaw: 0.3, armorPen: 0.47,
    sound: 'glock', tracerColor: 0xffe0a0,
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: Slot.Secondary,
    damage: 30, rpm: 352, auto: false,
    magSize: 12, reserve: 24, reloadTime: 2.2,
    spreadBase: 0.8, spreadMax: 2.6, bloomPerShot: 0.4, spreadMove: 1.0,
    recoilPitch: 0.8, recoilYaw: 0.3, armorPen: 0.5,
    sound: 'usp', tracerColor: 0xc0e8ff,
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: Slot.Secondary,
    damage: 42, rpm: 267, auto: false,
    magSize: 7, reserve: 35, reloadTime: 2.2,
    spreadBase: 1.1, spreadMax: 5.0, bloomPerShot: 1.4, spreadMove: 2.0,
    recoilPitch: 2.6, recoilYaw: 0.9, armorPen: 0.93,
    sound: 'deagle', tracerColor: 0xffb080,
  },
  knife: {
    id: 'knife', name: '战术刀', slot: Slot.Melee,
    damage: 40, rpm: 90, auto: false,
    magSize: 0, reserve: 0, reloadTime: 0,
    spreadBase: 0, spreadMax: 0, bloomPerShot: 0, spreadMove: 0,
    recoilPitch: 0, recoilYaw: 0, armorPen: 0.85,
    melee: true, range: 2.2,
    sound: 'knife', tracerColor: 0xffffff,
  },
};

export interface WeaponInstance {
  def: WeaponDef;
  mag: number;
  reserve: number;
  /** 换弹结束时间戳（游戏秒），0 = 未在换弹 */
  reloadEnd: number;
}

export function makeWeapon(id: string): WeaponInstance {
  const def = WEAPONS[id];
  return { def, mag: def.magSize, reserve: def.reserve, reloadEnd: 0 };
}

export interface Loadout {
  primary: WeaponInstance | null;
  secondary: WeaponInstance;
  melee: WeaponInstance;
  armor: number;
  helmet: boolean;
}

/** 按回合数发放装备：第 1 回合为手枪局 */
export function makeLoadout(team: Team, round: number, isAwper: boolean): Loadout {
  const knife = makeWeapon('knife');
  if (round <= 1) {
    // 手枪局：默认手枪、无护甲、无主武器
    return {
      primary: null,
      secondary: makeWeapon(team === 'T' ? 'glock' : 'usp'),
      melee: knife,
      armor: 0,
      helmet: false,
    };
  }
  return {
    primary: makeWeapon(isAwper ? 'awp' : team === 'T' ? 'ak47' : 'm4a4'),
    secondary: makeWeapon(team === 'T' ? 'deagle' : 'usp'),
    melee: knife,
    armor: 100,
    helmet: true,
  };
}

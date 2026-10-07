// 武器数据表：所有手感参数集中在这里，新增武器只需加一条记录。
// 伤害为身体（胸口）基准值，实际伤害 = 基准 × 部位倍率 × 护甲减伤。
// 伤害梯度：手枪（26/30） < 沙漠之鹰（38） < 步枪（M4 40 / AK 48）；AWP 单发致命。

export type Slot = 'primary' | 'secondary' | 'melee'
export type WeaponId = 'glock' | 'usp' | 'deagle' | 'ak47' | 'm4a4' | 'awp' | 'knife'
export type SoundKind = 'pistol' | 'deagle' | 'ak' | 'm4' | 'awp' | 'knife'

export interface ScopeSpec {
  /** 开镜后的垂直 FOV（度） */
  fov: number
  /** 开镜时移动速度倍率 */
  moveMul: number
}

export interface WeaponDef {
  id: WeaponId
  name: string
  slot: Slot
  sound: SoundKind
  /** 主攻击伤害（刀：斩击） */
  damage: number
  /** 副攻击伤害（刀：突刺） */
  altDamage: number
  range: number
  altRange: number
  /** 两次射击的最小间隔（秒） */
  fireInterval: number
  altInterval: number
  auto: boolean
  magSize: number
  reserve: number
  reloadTime: number
  /** 静止时基础扩散（弧度） */
  spreadBase: number
  /** 移动时额外扩散 */
  spreadMove: number
  /** 每发累积的扩散 */
  spreadPerShot: number
  spreadMax: number
  /** 扩散每秒回落量 */
  spreadRecover: number
  /** 每发的俯仰后坐力（弧度，向上为正） */
  recoilPitch: number
  /** 每发的随机水平抖动（弧度） */
  recoilYaw: number
  /** 后坐力视角每秒回落速率（指数衰减系数） */
  recoilRecover: number
  moveMul: number
  scope: ScopeSpec | null
  bolt: boolean
}

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary', sound: 'pistol',
    damage: 26, altDamage: 0, range: 80, altRange: 0,
    fireInterval: 0.15, altInterval: 0, auto: false,
    magSize: 20, reserve: 120, reloadTime: 2.3,
    spreadBase: 0.012, spreadMove: 0.02, spreadPerShot: 0.006, spreadMax: 0.06, spreadRecover: 4,
    recoilPitch: 0.02, recoilYaw: 0.004, recoilRecover: 6,
    moveMul: 0.95, scope: null, bolt: false,
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary', sound: 'pistol',
    damage: 30, altDamage: 0, range: 80, altRange: 0,
    fireInterval: 0.17, altInterval: 0, auto: false,
    magSize: 12, reserve: 24, reloadTime: 2.2,
    spreadBase: 0.01, spreadMove: 0.02, spreadPerShot: 0.008, spreadMax: 0.05, spreadRecover: 4.5,
    recoilPitch: 0.03, recoilYaw: 0.005, recoilRecover: 6,
    moveMul: 0.95, scope: null, bolt: false,
  },
  deagle: {
    id: 'deagle', name: '沙漠之鹰', slot: 'secondary', sound: 'deagle',
    damage: 38, altDamage: 0, range: 90, altRange: 0,
    fireInterval: 0.22, altInterval: 0, auto: false,
    magSize: 7, reserve: 35, reloadTime: 2.2,
    spreadBase: 0.012, spreadMove: 0.03, spreadPerShot: 0.012, spreadMax: 0.08, spreadRecover: 3.5,
    recoilPitch: 0.07, recoilYaw: 0.02, recoilRecover: 5,
    moveMul: 0.9, scope: null, bolt: false,
  },
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary', sound: 'ak',
    damage: 48, altDamage: 0, range: 120, altRange: 0,
    fireInterval: 0.1, altInterval: 0, auto: true,
    magSize: 30, reserve: 90, reloadTime: 2.5,
    spreadBase: 0.006, spreadMove: 0.03, spreadPerShot: 0.011, spreadMax: 0.09, spreadRecover: 3.2,
    recoilPitch: 0.045, recoilYaw: 0.018, recoilRecover: 5,
    moveMul: 0.86, scope: null, bolt: false,
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary', sound: 'm4',
    damage: 40, altDamage: 0, range: 120, altRange: 0,
    fireInterval: 0.0889, altInterval: 0, auto: true,
    magSize: 30, reserve: 90, reloadTime: 3.0,
    spreadBase: 0.005, spreadMove: 0.025, spreadPerShot: 0.006, spreadMax: 0.05, spreadRecover: 4,
    recoilPitch: 0.02, recoilYaw: 0.006, recoilRecover: 7,
    moveMul: 0.9, scope: null, bolt: false,
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary', sound: 'awp',
    damage: 115, altDamage: 0, range: 300, altRange: 0,
    fireInterval: 1.45, altInterval: 0, auto: false,
    magSize: 10, reserve: 30, reloadTime: 3.7,
    spreadBase: 0.001, spreadMove: 0.05, spreadPerShot: 0, spreadMax: 0.002, spreadRecover: 10,
    recoilPitch: 0.06, recoilYaw: 0, recoilRecover: 4,
    moveMul: 0.8, scope: { fov: 18, moveMul: 0.35 }, bolt: true,
  },
  knife: {
    id: 'knife', name: '战术刀', slot: 'melee', sound: 'knife',
    damage: 40, altDamage: 65, range: 2, altRange: 1.6,
    fireInterval: 0.6, altInterval: 0.9, auto: false,
    magSize: 0, reserve: 0, reloadTime: 0,
    spreadBase: 0, spreadMove: 0, spreadPerShot: 0, spreadMax: 0, spreadRecover: 0,
    recoilPitch: 0, recoilYaw: 0, recoilRecover: 8,
    moveMul: 1, scope: null, bolt: false,
  },
}

/** 手枪局默认手枪（全员只带这个） */
export const DEFAULT_PISTOL: Record<'T' | 'CT', WeaponId> = { T: 'glock', CT: 'usp' }

/** 玩家可选的主武器 / 副武器（阵营限制见 UI） */
export const PRIMARY_CHOICES: Record<'T' | 'CT', WeaponId[]> = {
  T: ['ak47', 'awp'],
  CT: ['m4a4', 'awp'],
}
export const SECONDARY_CHOICES: Record<'T' | 'CT', WeaponId[]> = {
  T: ['glock', 'deagle'],
  CT: ['usp', 'deagle'],
}

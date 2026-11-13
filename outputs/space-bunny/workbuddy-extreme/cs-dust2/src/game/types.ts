// 全局类型定义

export type Team = 'CT' | 'T'

export type HitboxPart = 'head' | 'chest' | 'abdomen' | 'arm' | 'leg'

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface WeaponDef {
  id: string
  name: string
  slot: 'primary' | 'secondary' | 'melee'
  damage: number
  headMult: number
  rpm: number
  magSize: number
  reserve: number
  reloadTime: number
  /** 每次射击的水平散布增量（度） */
  spread: number
  /** 每次射击的后坐力（度） */
  recoil: number
  /** 视角恢复速度 */
  recover: number
  /** 自动连发 */
  auto: boolean
  /** 开镜倍率，1 表示不提供 */
  scope: number
  armorPen: number
  range: number
  spreadBullets: number
}

export interface Entity {
  id: number
  team: Team
  name: string
  isBot: boolean
  alive: boolean
  hp: number
  armor: number
  pos: Vec3
  vel: Vec3
  yaw: number
  pitch: number
  onGround: boolean
  /** 当前武器槽 */
  slot: 'primary' | 'secondary' | 'melee'
  weapons: {
    primary: WeaponDef | null
    secondary: WeaponDef
    melee: WeaponDef
  }
  ammoInMag: number
  reserveAmmo: number
  reloading: boolean
  reloadEndAt: number
  nextFireAt: number
  /** 携带 C4 */
  hasBomb: boolean
  /** 已安放炸弹（地图坐标） */
  plantedAt: Vec3 | null
  /** 拆包进度 0..1 */
  defuseProgress: number
  /** AI 状态 */
  aiState: string
  aiTarget: number | null
  /** 导航路径（二维航点，高度由地面决定） */
  aiPath: NavPoint[]
  aiPathIdx: number
  aiNextThink: number
  /** 视觉体 */
  group: import('three').Group
  /** 上次被击中的部位，用于命中反馈 */
  lastHitPart: HitboxPart | null
}

export interface RoundState {
  /** 回合序号，从 1 开始 */
  number: number
  /** 是否手枪局 */
  pistolRound: boolean
  /** 倒计时结束时间戳 */
  endsAt: number
  phase: 'live' | 'ended'
  winner: Team | null
  /** 炸弹已安放 */
  bombPlanted: boolean
  bombTimer: number
  bombPos: Vec3 | null
  /** 玩家当前操控的实体 id */
  spectatorId: number
  scoreCT: number
  scoreT: number
}

export interface KillfeedEntry {
  id: number
  killer: string
  killerTeam: Team
  victim: string
  victimTeam: Team
  weapon: string
  headshot: boolean
  at: number
}

export interface GameStatus {
  phase: 'menu' | 'playing' | 'ended'
  round: RoundState
  alive: { CT: number; T: number }
  killfeed: KillfeedEntry[]
  /** HUD 用的玩家快照 */
  hud: HudSnapshot
  score: { CT: number; T: number }
}

export interface HudSnapshot {
  hp: number
  armor: number
  ammo: number
  magSize: number
  weaponName: string
  slot: WeaponDef['slot']
  alive: boolean
  scoped: boolean
  hasBomb: boolean
  bombPlanted: boolean
  roundTime: number
  roundNumber: number
  scoreCT: number
  scoreT: number
  banner: string | null
  spectator: boolean
}

/** 碰撞体：轴对齐盒 */
export interface Box {
  minX: number
  maxX: number
  minY: number
  maxY: number
  minZ: number
  maxZ: number
  /** 掩体高度分类，供寻路使用 */
  tall: boolean
}

/** 二维导航航点 */
export interface NavPoint {
  x: number
  z: number
}

/** 导航节点 */
export interface NavNode {
  id: number
  x: number
  z: number
  links: number[]
  /** 该点所属区域，用于 AI 决策 */
  zone: Zone
}

export type Zone =
  | 'tSpawn'
  | 'ctSpawn'
  | 'mid'
  | 'midDoors'
  | 'catwalk'
  | 'longA'
  | 'aSite'
  | 'aRamp'
  | 'bTunnels'
  | 'bSite'
  | 'bDoors'

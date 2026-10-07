import type { Slot, WeaponId } from './weapons/weapons.ts'
import type { Vec3 } from './core/mathUtil.ts'

export type Team = 'T' | 'CT'
export type SiteId = 'A' | 'B'
export type HitPart = 'head' | 'chest' | 'stomach' | 'arms' | 'legs'
export type MatchPhase = 'freeze' | 'live' | 'roundEnd' | 'matchOver'
export type BombState = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded'

/** 一个物理 tick 内对角色的操作意图（玩家键鼠 / AI 共用同一套输入）。 */
export interface Intent {
  /** 前进 +1 / 后退 -1 */
  forward: number
  /** 右移 +1 / 左移 -1 */
  strafe: number
  jump: boolean
  /** 是否按住开火键 */
  fire: boolean
  /** 是否按住交互键（下包 / 拆包） */
  interactHeld: boolean
  /** 切换武器槽（边沿触发） */
  slot: Slot | null
  reloadPressed: boolean
  /** 右键按下（边沿）：AWP 开镜 / 刀子突刺 */
  altPressed: boolean
  /** E 键按下（边沿）：开关中门 */
  interactPressed: boolean
}

export function emptyIntent(): Intent {
  return {
    forward: 0,
    strafe: 0,
    jump: false,
    fire: false,
    interactHeld: false,
    slot: null,
    reloadPressed: false,
    altPressed: false,
    interactPressed: false,
  }
}

export interface BombView {
  state: BombState
  x: number
  y: number
  z: number
  site: SiteId | null
  timer: number
}

/** 世界事件：由逻辑层产生，交给音频 / 特效层消费。 */
export type WorldEvent =
  | { type: 'shot'; x: number; y: number; z: number; weapon: WeaponId; ownerId: number }
  | { type: 'tracer'; from: Vec3; to: Vec3; weapon: WeaponId }
  | { type: 'hitEnemy'; byId: number; headshot: boolean; part: HitPart; amount: number }
  | { type: 'hurt'; victimId: number; amount: number; fromX: number; fromZ: number }
  | { type: 'kill'; killerId: number; victimId: number; weapon: WeaponId; headshot: boolean }
  | { type: 'footstep'; x: number; y: number; z: number; team: Team }
  | { type: 'reload'; x: number; y: number; z: number; weapon: WeaponId }
  | { type: 'scope'; x: number; y: number; z: number; on: boolean }
  | {
      type: 'bomb'
      kind: 'pickup' | 'drop' | 'plantStart' | 'planted' | 'defuseStart' | 'defused' | 'exploded' | 'beep'
      x: number
      y: number
      z: number
    }
  | { type: 'door'; x: number; z: number; open: boolean }
  | { type: 'roundStart'; round: number; pistol: boolean }
  | { type: 'roundEnd'; winner: Team; reason: string }
  | { type: 'matchEnd'; winner: Team }
  | { type: 'explosion'; x: number; y: number; z: number; radius: number }

export interface KillEntry {
  id: number
  killer: string
  victim: string
  weapon: string
  headshot: boolean
  killerTeam: Team
  time: number
}

/** 交给 React HUD 的只读快照（约 20Hz 推送，不驱动 3D 循环）。 */
export interface HudState {
  phase: MatchPhase
  round: number
  pistol: boolean
  scores: Record<Team, number>
  roundTimeLeft: number
  freezeLeft: number
  winner: Team | null
  reason: string
  playerTeam: Team
  me: {
    id: number
    name: string
    alive: boolean
    hp: number
    armor: number
    isHuman: boolean
    hasBomb: boolean
    slot: Slot
    weaponId: WeaponId
    weaponName: string
    mag: number
    reserve: number
    magSize: number
    reloading: boolean
    reloadProgress: number
    scoped: boolean
    canScope: boolean
    spread: number
    action: { kind: 'plant' | 'defuse'; progress: number } | null
  } | null
  spectateName: string | null
  mates: { id: number; name: string; hp: number; alive: boolean; hasBomb: boolean; isHuman: boolean }[]
  killfeed: KillEntry[]
  bomb: { state: BombState; site: SiteId | null; timeLeft: number; x: number; z: number; visible: boolean }
  radar: {
    yaw: number
    you: { x: number; z: number } | null
    friends: { id: number; x: number; z: number }[]
    enemies: { id: number; x: number; z: number }[]
  }
  banner: { id: number; text: string } | null
  hitCount: number
  damageCount: number
  lastDamageAngle: number
}

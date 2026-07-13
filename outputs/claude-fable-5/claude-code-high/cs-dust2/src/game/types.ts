import * as THREE from 'three'

export type Team = 'CT' | 'T'
export type Slot = 'primary' | 'secondary' | 'knife'
export type BodyPart = 'head' | 'chest' | 'stomach' | 'arm' | 'leg'
export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife'
export type Phase = 'menu' | 'freeze' | 'live' | 'over' | 'matchover'
export type Loadout = 'rifle' | 'awp'

/** Per-tick intent, produced by player input or an AI brain, consumed by physics/combat. */
export interface Control {
  moveX: number // strafe, +right
  moveZ: number // +forward
  jump: boolean
  walk: boolean
  fire: boolean // held
  fireTap: boolean // edge-triggered (semi-auto)
  altTap: boolean // scope toggle
  reload: boolean
  use: boolean // E held: plant / defuse
  slot: Slot | null
}

export function emptyControl(): Control {
  return {
    moveX: 0, moveZ: 0, jump: false, walk: false,
    fire: false, fireTap: false, altTap: false,
    reload: false, use: false, slot: null,
  }
}

export interface KillEntry {
  id: number
  attacker: string
  attackerTeam: Team
  victim: string
  victimTeam: Team
  weapon: string
  headshot: boolean
  t: number
}

export interface HudState {
  phase: Phase
  locked: boolean
  auto: boolean
  round: number
  pistolRound: boolean
  ctScore: number
  tScore: number
  timeLeft: number
  bombTimeLeft: number | null
  bombPlanted: boolean
  freezeLeft: number
  winner: Team | null
  winReason: string
  matchWinner: Team | null
  playerTeam: Team
  loadout: Loadout
  me: {
    name: string
    team: Team
    hp: number
    armor: number
    alive: boolean
    weaponName: string
    weaponId: WeaponId
    mag: number
    reserve: number
    reloading: boolean
    scoped: boolean
    hasBomb: boolean
    spreadPx: number
  }
  spectating: { name: string; isSelf: boolean } | null
  channel: { label: string; progress: number } | null
  centerHint: string | null
  killfeed: KillEntry[]
  hitmarkerAt: number
  hitmarkerHead: boolean
  damageAt: number
}

/** Minimal body info physics needs for hitbox raycasts (avoids circular imports). */
export interface SoldierBody {
  id: number
  team: Team
  alive: boolean
  pos: THREE.Vector3
  yaw: number
}

export const RUN_SPEED = 4.7
export const GRAVITY = 20
export const JUMP_VEL = 7.0
export const EYE_HEIGHT = 1.62
export const BODY_RADIUS = 0.4
export const BODY_HEIGHT = 1.8

export const PLANT_TIME = 3.2
export const DEFUSE_TIME = 7.0
export const BOMB_FUSE = 40
export const ROUND_TIME = 115
export const FREEZE_TIME = 4
export const ROUND_END_TIME = 5
export const WIN_SCORE = 13

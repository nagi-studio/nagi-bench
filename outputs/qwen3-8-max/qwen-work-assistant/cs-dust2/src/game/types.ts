/* Shared types for the Dust2 5v5 engine. */
import type { WeaponId, BodyZone } from './weapons'

export type Team = 'CT' | 'T'

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface Entity {
  id: number
  team: Team
  name: string
  isPlayer: boolean
  // position (feet) and facing
  x: number
  y: number
  z: number
  yaw: number
  // motion
  vx: number
  vy: number
  vz: number
  onGround: boolean
  // vitals
  health: number
  armour: number
  hasHelmet: boolean
  alive: boolean
  // loadout
  primary: WeaponId | null
  secondary: WeaponId
  current: WeaponId // which of primary/secondary/melee is held
  ammoMag: Record<string, number>
  ammoReserve: Record<string, number>
  // fire state
  reloadUntil: number
  lastShot: number
  shotIndex: number
  scoped: boolean
  // economy / round
  kills: number
  deaths: number
  // bomb
  hasBomb: boolean
  // scratch (not part of the public snapshot)
  _step?: number
  _triggerHeld?: boolean
  // bot AI
  ai?: BotBrain
}

export interface BotBrain {
  path: number[]       // list of tile indices to follow
  pathIndex: number
  wp?: { x: number; z: number }[] | null // live world-space waypoints
  targetId: number     // enemy id currently engaged, -1 none
  repathAt: number
  fireAt: number
  state: 'patrol' | 'engage' | 'plant' | 'defuse' | 'retreat'
  destRegion: string
  strafeDir: number
  strafeUntil: number
  lastSeenX: number
  lastSeenZ: number
}

export interface Bomb {
  planted: boolean
  carried: boolean
  x: number
  y: number
  z: number
  site: 'A' | 'B' | null
  plantedAt: number
  fuseSeconds: number
  defuseProgress: number
  defuserId: number
  exploded: boolean
}

export interface KillEvent {
  killerId: number
  victimId: number
  weapon: string
  headshot: boolean
  at: number
}

export type RoundPhase = 'warmup' | 'live' | 'over'

export interface GameState {
  entities: Entity[]
  bomb: Bomb
  phase: RoundPhase
  roundNumber: number
  pistolRound: boolean
  roundStart: number
  phaseEndsAt: number
  winner: Team | null
  winReason: string
  kills: KillEvent[]
  scoreCT: number
  scoreT: number
  time: number
  playerId: number
  spectateId: number // when the player dies, whose eyes we borrow
  freezeUntil: number
}

export type { WeaponId, BodyZone }

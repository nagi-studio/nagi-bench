import * as THREE from 'three'

export type Team = 'T' | 'CT'
export type Zone = 'head' | 'chest' | 'abdomen' | 'arm' | 'leg'
export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife'
export type WeaponSlot = 'primary' | 'secondary' | 'melee'
export type RoundMode = 'pistol' | 'rifle'

export interface WeaponSpec {
  id: WeaponId
  name: string
  shortName: string
  slot: WeaponSlot
  damage: number
  fireInterval: number
  magazine: number
  reserve: number
  reloadTime: number
  spread: number
  recoil: number
  range: number
  automatic: boolean
  color: number
  sound: 'ak' | 'm4' | 'awp' | 'pistol' | 'deagle' | 'knife'
}

export interface InventoryItem {
  id: WeaponId
  ammo: number
  reserve: number
}

export interface Agent {
  id: number
  name: string
  team: Team
  isBot: boolean
  alive: boolean
  hp: number
  armor: number
  position: THREE.Vector3
  velocity: THREE.Vector3
  yaw: number
  pitch: number
  group: THREE.Group
  hitMeshes: THREE.Object3D[]
  inventory: Partial<Record<WeaponSlot, InventoryItem>>
  activeSlot: WeaponSlot
  lastShot: number
  reloadUntil: number
  ai: AIState
  hasBomb: boolean
  visibleToPlayer: boolean
}

export interface AIState {
  state: 'patrol' | 'engage' | 'plant' | 'defuse' | 'pickup'
  targetId: number | null
  navPath: number[]
  navCursor: number
  repathAt: number
  actionProgress: number
  aimError: number
  waypoint: number
}

export interface WallCollider {
  box: THREE.Box3
  mesh: THREE.Mesh
  minimap: boolean
}

export interface NavNode {
  id: number
  name: string
  position: THREE.Vector3
  links: number[]
}

export interface Site {
  id: 'A' | 'B'
  center: THREE.Vector3
  radius: number
}

export interface KillEvent {
  id: number
  killer: string
  victim: string
  weapon: string
  headshot: boolean
  team: Team
}

export interface PublicAgent {
  id: number
  name: string
  team: Team
  alive: boolean
  hp: number
  armor: number
  x: number
  z: number
  yaw: number
  visible: boolean
  controlled: boolean
  hasBomb: boolean
}

export interface GameSnapshot {
  phase: 'ready' | 'live' | 'roundEnd'
  mode: RoundMode
  team: Team
  round: number
  time: number
  scoreT: number
  scoreCT: number
  hp: number
  armor: number
  weapon: WeaponId
  weaponName: string
  ammo: number
  reserve: number
  reloading: boolean
  spread: number
  scoped: boolean
  agents: PublicAgent[]
  kills: KillEvent[]
  bomb: {
    state: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded'
    x: number
    z: number
    site: 'A' | 'B' | null
    timer: number
    carrierName: string | null
  }
  actionLabel: string
  actionProgress: number
  banner: string
  location: string
  spectator: boolean
}

export interface GameOptions {
  mode: RoundMode
  team: Team
}

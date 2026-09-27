import * as THREE from 'three'
import type { CharacterVisual } from './character'
import { WEAPONS, type Slot, type TeamId, type WeaponInst } from './weapons'

export interface BotBrain {
  route: { x: number; y: number; z: number }[]
  routeI: number
  path: { x: number; y: number; z: number }[]
  pathI: number
  replan: number
  enemyId: string | null
  react: number
  strafe: number
  strafeT: number
  burst: number
  burstGap: number
  stuck: number
  lx: number
  lz: number
  holdYaw: number
  site: 'a' | 'b'
  acquired: boolean
  mode: 'route' | 'fight' | 'objective'
}

export interface Actor {
  id: string
  name: string
  team: TeamId
  human: boolean
  pos: THREE.Vector3
  vel: THREE.Vector3
  yaw: number
  pitch: number
  hp: number
  armor: number
  helmet: boolean
  alive: boolean
  money: number
  onGround: boolean
  crouch: boolean
  primary: WeaponInst | null
  secondary: WeaponInst
  melee: WeaponInst
  slot: Slot
  hasBomb: boolean
  visual: CharacterVisual
  wantFire: boolean
  wantReload: boolean
  wantUse: boolean
  fireLatch: boolean
  brain: BotBrain | null
  skill: number
  hurt: number
  wishX: number
  wishZ: number
  wishSpeed: number
  jump: boolean
  scoped: boolean
  lastAttacker: { id: string; name: string; team: TeamId; weapon: string; hs: boolean } | null
}

export function currentWeapon(a: Actor): WeaponInst {
  if (a.slot === 'primary' && a.primary) return a.primary
  if (a.slot === 'melee') return a.melee
  if (a.slot === 'primary' && !a.primary) return a.secondary
  return a.secondary
}

export function weaponLabel(a: Actor): string {
  return WEAPONS[currentWeapon(a).id].name
}

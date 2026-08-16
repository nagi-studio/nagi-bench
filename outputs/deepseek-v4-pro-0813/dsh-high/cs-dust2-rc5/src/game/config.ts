import type { WeaponId, WeaponSlot, HitboxPart } from './types'

export interface WeaponDef {
  id: WeaponId
  name: string
  slot: WeaponSlot
  auto: boolean
  /** rounds per minute */
  fireRate: number
  magSize: number
  reserve: number
  reloadTime: number
  /** base body damage */
  damage: number
  /** base spread in radians (half-angle) */
  spread: number
  /** recoil impulse per shot: pitch in radians */
  recoilPitch: number
  recoilYaw: number
  /** extra spread added while moving / per shot */
  bloomPerShot: number
  bloomMax: number
  /** movement speed multiplier */
  moveSpeed: number
  /** AWP scope fov (vertical), null = no scope */
  zoomFov: number | null
  /** range beyond which damage starts falling off (unused, kept for clarity) */
  range: number
  penetration: number
  /** 0..1 how loud / distinct */
  sound: 'rifle_ak' | 'rifle_m4' | 'awp' | 'pistol' | 'deagle' | 'melee'
}

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary', auto: true,
    fireRate: 600, magSize: 30, reserve: 90, reloadTime: 2.4,
    damage: 36, spread: 0.004, recoilPitch: 0.022, recoilYaw: 0.008,
    bloomPerShot: 0.006, bloomMax: 0.05, moveSpeed: 0.9,
    zoomFov: null, range: 100, penetration: 2, sound: 'rifle_ak',
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary', auto: true,
    fireRate: 666, magSize: 30, reserve: 90, reloadTime: 2.6,
    damage: 30, spread: 0.003, recoilPitch: 0.013, recoilYaw: 0.005,
    bloomPerShot: 0.004, bloomMax: 0.035, moveSpeed: 0.92,
    zoomFov: null, range: 100, penetration: 2, sound: 'rifle_m4',
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary', auto: false,
    fireRate: 41, magSize: 5, reserve: 15, reloadTime: 3.2,
    damage: 115, spread: 0.001, recoilPitch: 0.09, recoilYaw: 0.03,
    bloomPerShot: 0.04, bloomMax: 0.14, moveSpeed: 0.72,
    zoomFov: 22, range: 200, penetration: 4, sound: 'awp',
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary', auto: false,
    fireRate: 400, magSize: 20, reserve: 60, reloadTime: 1.8,
    damage: 20, spread: 0.006, recoilPitch: 0.012, recoilYaw: 0.006,
    bloomPerShot: 0.004, bloomMax: 0.04, moveSpeed: 1.0,
    zoomFov: null, range: 40, penetration: 1, sound: 'pistol',
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary', auto: false,
    fireRate: 350, magSize: 12, reserve: 24, reloadTime: 1.9,
    damage: 24, spread: 0.004, recoilPitch: 0.011, recoilYaw: 0.005,
    bloomPerShot: 0.004, bloomMax: 0.035, moveSpeed: 1.0,
    zoomFov: null, range: 45, penetration: 1, sound: 'pistol',
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary', auto: false,
    fireRate: 250, magSize: 7, reserve: 21, reloadTime: 2.1,
    damage: 54, spread: 0.008, recoilPitch: 0.04, recoilYaw: 0.02,
    bloomPerShot: 0.02, bloomMax: 0.09, moveSpeed: 0.95,
    zoomFov: null, range: 60, penetration: 2, sound: 'deagle',
  },
  knife: {
    id: 'knife', name: '刀', slot: 'melee', auto: false,
    fireRate: 120, magSize: 1, reserve: 0, reloadTime: 0.4,
    damage: 55, spread: 0.0, recoilPitch: 0, recoilYaw: 0,
    bloomPerShot: 0, bloomMax: 0, moveSpeed: 1.15,
    zoomFov: null, range: 2.2, penetration: 0, sound: 'melee',
  },
}

/** Damage multiplier per hitbox. Head is exactly 2x chest (body baseline). */
export const HITBOX_MULT: Record<HitboxPart, number> = {
  head: 2.0,
  chest: 1.0,
  abdomen: 1.15,
  armL: 0.8,
  armR: 0.8,
  legL: 0.7,
  legR: 0.7,
}

export const MAX_HEALTH = 100
export const MAX_ARMOR = 100

/** Armor absorbs this fraction of incoming damage while armor points remain. */
export const ARMOR_ABSORB = 0.5

export const PLAYER_HEIGHT = 1.8
export const PLAYER_RADIUS = 0.35
export const EYE_HEIGHT = 1.62
export const GRAVITY = 22
export const JUMP_SPEED = 7.2
export const STEP_UP = 0.5
export const BASE_MOVE_SPEED = 5.4

export const C4_PLANT_TIME = 3.0
export const C4_DEFUSE_TIME = 5.0
export const C4_TIMER = 40.0
export const C4_RADIUS = 14
export const C4_DAMAGE = 400

export const ROUND_FREEZE_TIME = 3.0
export const ROUND_END_DELAY = 4.0

export const AI_VIEW_DISTANCE = 46
export const AI_FOV = 1.05 // radians half-angle
export const AI_REPATH_INTERVAL = 0.7

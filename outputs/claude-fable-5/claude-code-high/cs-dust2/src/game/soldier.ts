import * as THREE from 'three'
import { CharacterRig } from './character'
import { WEAPONS, WeaponState } from './weapons'
import {
  BODY_HEIGHT, BODY_RADIUS, EYE_HEIGHT,
  emptyControl, type Control, type Slot, type Team, type WeaponId,
} from './types'
import type { AIBrain } from './ai'

export class Soldier {
  id: number
  name: string
  originalName: string
  team: Team
  isPlayer = false

  pos = new THREE.Vector3()
  vel = new THREE.Vector3()
  yaw = 0
  pitch = 0
  onGround = true
  radius = BODY_RADIUS
  height = BODY_HEIGHT

  hp = 100
  armor = 0
  alive = true
  kills = 0
  deaths = 0

  weapons: Partial<Record<Slot, WeaponState>> = {}
  slot: Slot = 'secondary'
  scoped = false
  switchCooldown = 0

  hasBomb = false
  channel: { kind: 'plant' | 'defuse'; t: number; total: number } | null = null

  control: Control = emptyControl()
  brain: AIBrain | null = null
  rig: CharacterRig

  recoilPitch = 0
  recoilYaw = 0
  stepAcc = 0
  /** buffered semi-auto trigger: a click stays valid for a short window */
  tapBuffer = 0
  lastSeenBy: Record<Team, number> = { CT: -99, T: -99 }
  wasReloading = false

  constructor(id: number, name: string, team: Team) {
    this.id = id
    this.name = name
    this.originalName = name
    this.team = team
    this.rig = new CharacterRig(team)
  }

  get weapon(): WeaponState {
    return this.weapons[this.slot] ?? this.weapons.knife!
  }

  get eyePos(): THREE.Vector3 {
    return new THREE.Vector3(this.pos.x, this.pos.y + EYE_HEIGHT, this.pos.z)
  }

  /** View direction including recoil offset (recoil affects both camera and bullets). */
  viewDir(): THREE.Vector3 {
    const yaw = this.yaw + this.recoilYaw
    const pitch = THREE.MathUtils.clamp(this.pitch + this.recoilPitch, -1.55, 1.55)
    const cp = Math.cos(pitch)
    return new THREE.Vector3(-Math.sin(yaw) * cp, Math.sin(pitch), -Math.cos(yaw) * cp)
  }

  rightDir(): THREE.Vector3 {
    return new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw))
  }

  equip(primary: WeaponId | null, secondary: WeaponId, armor: number) {
    this.weapons = { knife: new WeaponState(WEAPONS.knife) }
    this.weapons.secondary = new WeaponState(WEAPONS[secondary])
    if (primary) this.weapons.primary = new WeaponState(WEAPONS[primary])
    this.slot = primary ? 'primary' : 'secondary'
    this.armor = armor
    this.scoped = false
    this.rig.setWeapon(this.weapon.def.id)
  }

  respawn(pos: THREE.Vector3, yaw: number) {
    this.pos.copy(pos)
    this.vel.set(0, 0, 0)
    this.yaw = yaw
    this.pitch = 0
    this.hp = 100
    this.alive = true
    this.onGround = true
    this.channel = null
    this.hasBomb = false
    this.recoilPitch = 0
    this.recoilYaw = 0
    this.scoped = false
    this.control = emptyControl()
    this.rig.spawnReset()
    this.rig.setBomb(false)
  }

  trySwitch(slot: Slot): boolean {
    if (!this.alive || slot === this.slot || !this.weapons[slot]) return false
    this.slot = slot
    this.scoped = false
    this.switchCooldown = 0.4
    this.weapon.cooldown = Math.max(this.weapon.cooldown, 0.4)
    this.rig.setWeapon(this.weapon.def.id)
    return true
  }
}

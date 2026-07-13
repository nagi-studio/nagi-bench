import type { BodyPart, Slot, WeaponId } from './types'

export interface WeaponDef {
  id: WeaponId
  name: string
  slot: Slot
  damage: number
  auto: boolean
  rpm: number
  magSize: number
  reserve: number
  reloadTime: number
  /** standing-still base inaccuracy, radians */
  spreadBase: number
  /** extra inaccuracy per shot fired (bloom) */
  spreadPerShot: number
  /** exponential bloom decay rate, 1/s */
  spreadDecay: number
  /** extra spread at full run speed */
  spreadMove: number
  /** camera kick per shot, radians */
  kickPitch: number
  kickYaw: number
  moveMult: number
  /** damage kept when target has armor (higher = better penetration) */
  armorPen: number
  sound: 'ak' | 'm4' | 'awp' | 'pistol' | 'glock' | 'deagle' | 'knife'
  scopeFov?: number
  spreadScoped?: number
  range?: number
}

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary',
    damage: 36, auto: true, rpm: 600, magSize: 30, reserve: 90, reloadTime: 2.4,
    spreadBase: 0.006, spreadPerShot: 0.011, spreadDecay: 5.5, spreadMove: 0.045,
    kickPitch: 0.019, kickYaw: 0.006, moveMult: 0.92, armorPen: 0.775, sound: 'ak',
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary',
    damage: 33, auto: true, rpm: 666, magSize: 30, reserve: 90, reloadTime: 2.1,
    spreadBase: 0.005, spreadPerShot: 0.007, spreadDecay: 6.5, spreadMove: 0.04,
    kickPitch: 0.009, kickYaw: 0.004, moveMult: 0.94, armorPen: 0.7, sound: 'm4',
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary',
    damage: 115, auto: false, rpm: 41, magSize: 5, reserve: 30, reloadTime: 3.6,
    spreadBase: 0.07, spreadPerShot: 0.01, spreadDecay: 3, spreadMove: 0.09,
    kickPitch: 0.032, kickYaw: 0.004, moveMult: 0.84, armorPen: 0.975, sound: 'awp',
    scopeFov: 20, spreadScoped: 0.0012,
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary',
    damage: 26, auto: false, rpm: 400, magSize: 20, reserve: 120, reloadTime: 2.2,
    spreadBase: 0.009, spreadPerShot: 0.012, spreadDecay: 7, spreadMove: 0.02,
    kickPitch: 0.008, kickYaw: 0.003, moveMult: 1.0, armorPen: 0.47, sound: 'glock',
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary',
    damage: 33, auto: false, rpm: 352, magSize: 12, reserve: 24, reloadTime: 2.2,
    spreadBase: 0.007, spreadPerShot: 0.011, spreadDecay: 7, spreadMove: 0.02,
    kickPitch: 0.009, kickYaw: 0.003, moveMult: 1.0, armorPen: 0.505, sound: 'pistol',
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary',
    damage: 53, auto: false, rpm: 267, magSize: 7, reserve: 35, reloadTime: 2.2,
    spreadBase: 0.012, spreadPerShot: 0.042, spreadDecay: 4.5, spreadMove: 0.05,
    kickPitch: 0.028, kickYaw: 0.008, moveMult: 0.96, armorPen: 0.8, sound: 'deagle',
  },
  knife: {
    id: 'knife', name: '军刀', slot: 'knife',
    damage: 45, auto: true, rpm: 120, magSize: 0, reserve: 0, reloadTime: 0,
    spreadBase: 0, spreadPerShot: 0, spreadDecay: 1, spreadMove: 0,
    kickPitch: 0.004, kickYaw: 0, moveMult: 1.05, armorPen: 0.85, sound: 'knife',
    range: 2.2,
  },
}

/** 头部伤害为身体(胸)的两倍，其余部位各不相同。 */
export const PART_MULT: Record<BodyPart, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.25,
  arm: 0.85,
  leg: 0.7,
}

export class WeaponState {
  def: WeaponDef
  mag: number
  reserve: number
  cooldown = 0
  bloom = 0
  reloadLeft = 0

  constructor(def: WeaponDef) {
    this.def = def
    this.mag = def.magSize
    this.reserve = def.reserve
  }

  get reloading() { return this.reloadLeft > 0 }
  get isKnife() { return this.def.id === 'knife' }

  /** Returns true the tick a reload completes. */
  update(dt: number): boolean {
    if (this.cooldown > 0) this.cooldown -= dt
    this.bloom *= Math.exp(-this.def.spreadDecay * dt)
    if (this.reloadLeft > 0) {
      this.reloadLeft -= dt
      if (this.reloadLeft <= 0) {
        this.reloadLeft = 0
        const take = Math.min(this.def.magSize - this.mag, this.reserve)
        this.mag += take
        this.reserve -= take
        this.bloom = 0
        return true
      }
    }
    return false
  }

  canFire(): boolean {
    if (this.reloading || this.cooldown > 0) return false
    return this.isKnife || this.mag > 0
  }

  onFire() {
    if (!this.isKnife) this.mag--
    this.cooldown = 60 / this.def.rpm
    this.bloom = Math.min(this.bloom + this.def.spreadPerShot, 0.08)
  }

  startReload(): boolean {
    if (this.isKnife || this.reloading) return false
    if (this.mag >= this.def.magSize || this.reserve <= 0) return false
    this.reloadLeft = this.def.reloadTime
    return true
  }
}

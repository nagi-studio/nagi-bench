import { WEAPONS, type WeaponDef, type WeaponId, type Slot } from '../weapons/weapons.ts'
import type { Team } from '../types.ts'

export interface WeaponSlot {
  id: WeaponId
  mag: number
  reserve: number
}

export interface ActionState {
  kind: 'plant' | 'defuse'
  t: number
  total: number
}

export interface Loadout {
  primary: WeaponId | null
  secondary: WeaponId
}

function slotOf(id: WeaponId): WeaponSlot {
  const def = WEAPONS[id]
  return { id, mag: def.magSize, reserve: def.reserve }
}

/**
 * 战场上的一个人（玩家或 AI）。只保存状态，不负责决策；决策在 AI Brain 或玩家输入里，
 * 执行在 GameWorld 的 applyCharacter 里。
 */
export class Character {
  readonly id: number
  readonly name: string
  readonly team: Team

  // 位置：x/z 为水平坐标，y 为脚底高度
  x = 0
  y = 0
  z = 0
  vy = 0
  onGround = true
  speed = 0
  stepDist = 0

  // 视角（pitch 上仰为正）；punch 为后坐力造成的视角上扬，会随时间回落
  yaw = 0
  pitch = 0
  punch = 0

  hp = 100
  armor = 0
  alive = true

  slots: Record<Slot, WeaponSlot | null> = { primary: null, secondary: null, melee: null }
  current: Slot = 'secondary'
  fireCooldown = 0
  fireHeld = false
  spread = 0
  reloadLeft = 0
  reloadTotal = 0
  scoped = false
  lastShotT = -10

  hasBomb = false
  hasKit = false
  action: ActionState | null = null

  kills = 0
  deaths = 0
  spottedUntil = 0

  constructor(id: number, name: string, team: Team) {
    this.id = id
    this.name = name
    this.team = team
  }

  get weapon(): WeaponDef {
    const s = this.slots[this.current]
    return WEAPONS[s ? s.id : 'knife']
  }

  get weaponState(): WeaponSlot | null {
    return this.slots[this.current]
  }

  get reloading(): boolean {
    return this.reloadLeft > 0
  }

  /** 回合开始时装备：有主武器则默认拿主武器，否则拿副武器。 */
  equip(loadout: Loadout, armor: number): void {
    this.slots.primary = loadout.primary ? slotOf(loadout.primary) : null
    this.slots.secondary = slotOf(loadout.secondary)
    this.slots.melee = slotOf('knife')
    this.current = this.slots.primary ? 'primary' : 'secondary'
    this.armor = armor
    this.fireCooldown = 0
    this.fireHeld = false
    this.spread = 0
    this.reloadLeft = 0
    this.reloadTotal = 0
    this.scoped = false
    this.action = null
  }

  /** 切换武器槽（会取消换弹与开镜）。返回是否真的切换了。 */
  switchTo(slot: Slot): boolean {
    if (!this.slots[slot] || slot === this.current) return false
    this.current = slot
    this.reloadLeft = 0
    this.scoped = false
    this.fireCooldown = 0.35 // 拔枪时间
    return true
  }

  startReload(): boolean {
    const s = this.weaponState
    const def = this.weapon
    if (!s || def.magSize === 0 || s.mag >= def.magSize || s.reserve <= 0 || this.reloadLeft > 0) return false
    this.reloadTotal = def.reloadTime
    this.reloadLeft = def.reloadTime
    return true
  }

  finishReload(): void {
    const s = this.weaponState
    if (!s) return
    const need = this.weapon.magSize - s.mag
    const take = Math.min(need, s.reserve)
    s.mag += take
    s.reserve -= take
    this.reloadLeft = 0
  }

  /**
   * 结算伤害：先由护甲吸收一部分（吸收量 = min(护甲, 伤害×ARMOR_ABSORB)），剩余扣血。
   * 返回实际扣血量。
   */
  takeDamage(amount: number, armorAbsorb: number): number {
    let dmg = amount
    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, dmg * armorAbsorb)
      this.armor -= absorbed
      dmg -= absorbed
    }
    const dealt = Math.min(this.hp, dmg)
    this.hp -= dealt
    if (this.hp <= 0) {
      this.hp = 0
      this.alive = false
    }
    return dealt
  }
}

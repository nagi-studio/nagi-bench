export type WeaponId = 'ak' | 'm4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife'
export type Slot = 'primary' | 'secondary' | 'melee'
export type TeamId = 'ct' | 't'

export interface WeaponDef {
  id: WeaponId
  name: string
  slot: Slot
  auto: boolean
  /** Seconds between shots. */
  delay: number
  /** Chest damage before hitbox multipliers. Head is 2× this. */
  damage: number
  mag: number
  reserve: number
  reload: number
  armorPen: number
  spreadStand: number
  spreadMove: number
  spreadAir: number
  spreadPerShot: number
  recoilUp: number
  recoilUpGrow: number
  recoilSide: number
  recoilSideGrow: number
  range: number
  scope: boolean
  melee: boolean
  price: number
  team?: TeamId
}

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  ak: {
    id: 'ak',
    name: 'AK-47',
    slot: 'primary',
    auto: true,
    delay: 0.1,
    damage: 50,
    mag: 30,
    reserve: 90,
    reload: 2.45,
    armorPen: 0.775,
    spreadStand: 0.0042,
    spreadMove: 0.046,
    spreadAir: 0.085,
    spreadPerShot: 0.0072,
    recoilUp: 0.021,
    recoilUpGrow: 0.0044,
    recoilSide: 0.007,
    recoilSideGrow: 0.0024,
    range: 120,
    scope: false,
    melee: false,
    price: 2700,
    team: 't',
  },
  m4: {
    id: 'm4',
    name: 'M4A4',
    slot: 'primary',
    auto: true,
    delay: 0.09,
    damage: 38,
    mag: 30,
    reserve: 90,
    reload: 3.1,
    armorPen: 0.7,
    spreadStand: 0.0032,
    spreadMove: 0.03,
    spreadAir: 0.07,
    spreadPerShot: 0.0032,
    recoilUp: 0.011,
    recoilUpGrow: 0.0015,
    recoilSide: 0.0035,
    recoilSideGrow: 0.0007,
    range: 120,
    scope: false,
    melee: false,
    price: 3100,
    team: 'ct',
  },
  awp: {
    id: 'awp',
    name: 'AWP',
    slot: 'primary',
    auto: false,
    delay: 1.45,
    damage: 125,
    mag: 5,
    reserve: 30,
    reload: 3.6,
    armorPen: 0.975,
    spreadStand: 0.018,
    spreadMove: 0.1,
    spreadAir: 0.14,
    spreadPerShot: 0,
    recoilUp: 0.085,
    recoilUpGrow: 0,
    recoilSide: 0.012,
    recoilSideGrow: 0,
    range: 200,
    scope: true,
    melee: false,
    price: 4750,
  },
  glock: {
    id: 'glock',
    name: 'Glock',
    slot: 'secondary',
    auto: false,
    delay: 0.15,
    damage: 28,
    mag: 20,
    reserve: 120,
    reload: 2.2,
    armorPen: 0.47,
    spreadStand: 0.009,
    spreadMove: 0.038,
    spreadAir: 0.07,
    spreadPerShot: 0.004,
    recoilUp: 0.014,
    recoilUpGrow: 0.002,
    recoilSide: 0.008,
    recoilSideGrow: 0.001,
    range: 80,
    scope: false,
    melee: false,
    price: 0,
    team: 't',
  },
  usp: {
    id: 'usp',
    name: 'USP',
    slot: 'secondary',
    auto: false,
    delay: 0.17,
    damage: 35,
    mag: 12,
    reserve: 36,
    reload: 2.2,
    armorPen: 0.505,
    spreadStand: 0.004,
    spreadMove: 0.026,
    spreadAir: 0.055,
    spreadPerShot: 0.0025,
    recoilUp: 0.02,
    recoilUpGrow: 0.003,
    recoilSide: 0.005,
    recoilSideGrow: 0.0006,
    range: 80,
    scope: false,
    melee: false,
    price: 0,
    team: 'ct',
  },
  deagle: {
    id: 'deagle',
    name: '沙漠之鹰',
    slot: 'secondary',
    auto: false,
    delay: 0.45,
    damage: 54,
    mag: 7,
    reserve: 35,
    reload: 2.2,
    armorPen: 0.932,
    spreadStand: 0.0055,
    spreadMove: 0.055,
    spreadAir: 0.1,
    spreadPerShot: 0.02,
    recoilUp: 0.058,
    recoilUpGrow: 0.012,
    recoilSide: 0.02,
    recoilSideGrow: 0.004,
    range: 90,
    scope: false,
    melee: false,
    price: 700,
  },
  knife: {
    id: 'knife',
    name: '刀',
    slot: 'melee',
    auto: false,
    delay: 0.4,
    damage: 55,
    mag: 1,
    reserve: 1,
    reload: 0,
    armorPen: 0.85,
    spreadStand: 0.22,
    spreadMove: 0.22,
    spreadAir: 0.22,
    spreadPerShot: 0,
    recoilUp: 0,
    recoilUpGrow: 0,
    recoilSide: 0,
    recoilSideGrow: 0,
    range: 2.15,
    scope: false,
    melee: true,
    price: 0,
  },
}

export interface WeaponInst {
  id: WeaponId
  mag: number
  reserve: number
  cooldown: number
  reloadLeft: number
  reloading: boolean
  spray: number
  sinceShot: number
}

export function makeWeapon(id: WeaponId, full = true): WeaponInst {
  const d = WEAPONS[id]
  return {
    id,
    mag: d.melee ? 1 : full ? d.mag : d.mag,
    reserve: d.melee ? 1 : d.reserve,
    cooldown: 0,
    reloadLeft: 0,
    reloading: false,
    spray: 0,
    sinceShot: 1,
  }
}

export function refill(w: WeaponInst): void {
  const d = WEAPONS[w.id]
  if (d.melee) return
  w.mag = d.mag
  w.reserve = d.reserve
  w.reloading = false
  w.reloadLeft = 0
  w.cooldown = 0
  w.spray = 0
}

export const ZONE_MULT = {
  head: 2,
  chest: 1,
  stomach: 1.25,
  arm: 0.75,
  leg: 0.6,
} as const

export type HitZone = keyof typeof ZONE_MULT

export function weaponSpread(
  def: WeaponDef,
  speed: number,
  runSpeed: number,
  onGround: boolean,
  crouch: boolean,
  spray: number,
  scoped: boolean,
): number {
  if (def.melee) return def.spreadStand
  if (def.scope) {
    if (scoped && onGround && speed < 0.45) return 0.00035
    return Math.max(def.spreadStand, 0.11)
  }
  const t = Math.min(1, speed / runSpeed)
  let s = def.spreadStand + (def.spreadMove - def.spreadStand) * t
  if (!onGround) s += def.spreadAir
  if (crouch && onGround) s *= 0.72
  s += def.spreadPerShot * Math.max(0, spray - 1)
  return s
}

export function weaponRecoil(def: WeaponDef, spray: number): { up: number; side: number } {
  const n = Math.max(0, spray - 1)
  const sideSign = Math.random() < 0.5 ? -1 : 1
  return {
    up: def.recoilUp + def.recoilUpGrow * n,
    side: sideSign * (def.recoilSide + def.recoilSideGrow * n),
  }
}

export type Team = 'CT' | 'T'
export type Slot = 'primary' | 'secondary' | 'melee'
export type WeaponId = 'ak' | 'm4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife'
export type Primary = 'ak' | 'm4' | 'awp'
export type Secondary = 'glock' | 'usp' | 'deagle'
export type HitZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg'

export interface Weapon {
  name: string
  slot: Slot
  damage: number
  magazine: number
  reserve: number
  interval: number
  reload: number
  recoil: number
  spread: number
  bloom: number
  armorAbsorption: number
  range: number
  automatic?: boolean
  zoom?: number
}

export const WEAPONS: Record<WeaponId, Weapon> = {
  ak: { name: 'AK-47', slot: 'primary', damage: 54, magazine: 30, reserve: 90, interval: 0.106, reload: 2.25, recoil: 0.047, spread: 0.005, bloom: 0.009, armorAbsorption: 0.24, range: 135, automatic: true },
  m4: { name: 'M4A4', slot: 'primary', damage: 42, magazine: 30, reserve: 90, interval: 0.076, reload: 2.05, recoil: 0.021, spread: 0.004, bloom: 0.004, armorAbsorption: 0.28, range: 130, automatic: true },
  awp: { name: 'AWP', slot: 'primary', damage: 168, magazine: 5, reserve: 20, interval: 1.56, reload: 2.9, recoil: 0.075, spread: 0.035, bloom: 0.018, armorAbsorption: 0.12, range: 170, zoom: 24 },
  glock: { name: 'Glock', slot: 'secondary', damage: 24, magazine: 20, reserve: 60, interval: 0.19, reload: 1.58, recoil: 0.017, spread: 0.008, bloom: 0.005, armorAbsorption: 0.42, range: 72 },
  usp: { name: 'USP', slot: 'secondary', damage: 28, magazine: 12, reserve: 48, interval: 0.205, reload: 1.66, recoil: 0.019, spread: 0.006, bloom: 0.004, armorAbsorption: 0.39, range: 80 },
  deagle: { name: '沙鹰', slot: 'secondary', damage: 37, magazine: 7, reserve: 28, interval: 0.34, reload: 1.82, recoil: 0.056, spread: 0.008, bloom: 0.013, armorAbsorption: 0.25, range: 90 },
  knife: { name: '战术刀', slot: 'melee', damage: 43, magazine: 0, reserve: 0, interval: 0.46, reload: 0, recoil: 0, spread: 0, bloom: 0, armorAbsorption: 0.12, range: 2.12 },
}

export const DEFAULT_PRIMARY: Record<Team, Primary> = { CT: 'm4', T: 'ak' }
export const DEFAULT_PISTOL: Record<Team, Secondary> = { CT: 'usp', T: 'glock' }
export const TEAM_NAMES: Record<Team, string> = { CT: '守方', T: '攻方' }
export const TEAM_COLORS: Record<Team, string> = { CT: '#84c9db', T: '#e8ad62' }
export const SLOT_ORDER: Slot[] = ['primary', 'secondary', 'melee']

export interface Ammo {
  id: WeaponId
  loaded: number
  reserve: number
}

export function ammunition(id: WeaponId): Ammo {
  const data = WEAPONS[id]
  return { id, loaded: data.magazine, reserve: data.reserve }
}

const MULTIPLIER: Record<HitZone, number> = {
  head: 2,
  chest: 1,
  stomach: 0.87,
  arm: 0.73,
  leg: 0.64,
}

export function damageFor(id: WeaponId, zone: HitZone, armor: number) {
  const weapon = WEAPONS[id]
  const base = weapon.damage * MULTIPLIER[zone]
  const protectedZone = zone === 'head' || zone === 'chest' || zone === 'stomach'
  const scale = protectedZone ? Math.min(1, armor / 25) : 0
  const absorbed = base * weapon.armorAbsorption * scale
  const health = zone === 'head' ? 2 * Math.round(weapon.damage * (1 - weapon.armorAbsorption * scale)) : Math.round(base - absorbed)
  return { health, armor: Math.min(armor, Math.ceil(absorbed * 0.75)) }
}

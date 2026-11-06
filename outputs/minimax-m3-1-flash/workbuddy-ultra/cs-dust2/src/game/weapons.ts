// Data-driven weapon table. Every behaviour difference the brief asks for
// (damage, recoil, fire rate, magazine, scope, sound) lives in this one table.

export type Slot = 'primary' | 'secondary' | 'melee'
export type WeaponId =
  | 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife'

export interface Weapon {
  id: WeaponId
  name: string
  nameEn: string
  slot: Slot
  damage: number
  headMult: number
  armorPen: number
  rpm: number
  auto: boolean
  mag: number
  reload: number
  /** vertical kick per shot, radians */
  recoilUp: number
  /** horizontal spread kick per shot, radians */
  recoilSide: number
  /** recovery rate, radians per second */
  recoilRecover: number
  /** base spread, radians */
  spread: number
  /** per-shot spread growth, radians */
  spreadGrow: number
  maxSpread: number
  range: number
  scoped: boolean
  zoom: number
  moveSpeed: number
  sound: string
  /** knife needs no ammo */
  ammoType?: string
}

export const WEAPONS: Record<WeaponId, Weapon> = {
  ak47: {
    id: 'ak47', name: 'AK-47', nameEn: 'AK-47', slot: 'primary',
    damage: 36, headMult: 2.4, armorPen: 0.78, rpm: 600, auto: true,
    mag: 30, reload: 2.4, recoilUp: 0.0175, recoilSide: 0.006, recoilRecover: 0.10,
    spread: 0.004, spreadGrow: 0.0075, maxSpread: 0.075, range: 90,
    scoped: false, zoom: 1, moveSpeed: 1, sound: 'ak',
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', nameEn: 'M4A4', slot: 'primary',
    damage: 27, headMult: 2.0, armorPen: 0.72, rpm: 800, auto: true,
    mag: 30, reload: 2.1, recoilUp: 0.0088, recoilSide: 0.0032, recoilRecover: 0.15,
    spread: 0.0032, spreadGrow: 0.0052, maxSpread: 0.048, range: 90,
    scoped: false, zoom: 1, moveSpeed: 1.03, sound: 'm4',
  },
  awp: {
    id: 'awp', name: 'AWP', nameEn: 'AWP', slot: 'primary',
    damage: 115, headMult: 2.6, armorPen: 0.97, rpm: 41, auto: false,
    mag: 10, reload: 3.4, recoilUp: 0.075, recoilSide: 0.004, recoilRecover: 0.22,
    spread: 0.0006, spreadGrow: 0.05, maxSpread: 0.09, range: 140,
    scoped: true, zoom: 4.2, moveSpeed: 0.62, sound: 'awp',
  },
  glock: {
    id: 'glock', name: 'Glock-18', nameEn: 'Glock-18', slot: 'secondary',
    damage: 18, headMult: 2.0, armorPen: 0.55, rpm: 400, auto: false,
    mag: 20, reload: 1.7, recoilUp: 0.0095, recoilSide: 0.004, recoilRecover: 0.14,
    spread: 0.005, spreadGrow: 0.009, maxSpread: 0.06, range: 60,
    scoped: false, zoom: 1, moveSpeed: 1.05, sound: 'pistol',
  },
  usp: {
    id: 'usp', name: 'USP-S', nameEn: 'USP-S', slot: 'secondary',
    damage: 19, headMult: 2.0, armorPen: 0.60, rpm: 352, auto: false,
    mag: 12, reload: 1.9, recoilUp: 0.0105, recoilSide: 0.0036, recoilRecover: 0.15,
    spread: 0.0044, spreadGrow: 0.0086, maxSpread: 0.055, range: 60,
    scoped: false, zoom: 1, moveSpeed: 1.05, sound: 'pistol',
  },
  deagle: {
    id: 'deagle', name: '沙鹰', nameEn: 'Desert Eagle', slot: 'secondary',
    damage: 44, headMult: 2.0, armorPen: 0.62, rpm: 267, auto: false,
    mag: 7, reload: 2.2, recoilUp: 0.038, recoilSide: 0.007, recoilRecover: 0.17,
    spread: 0.0055, spreadGrow: 0.016, maxSpread: 0.09, range: 70,
    scoped: false, zoom: 1, moveSpeed: 1.02, sound: 'deagle',
  },
  knife: {
    id: 'knife', name: '近战刀', nameEn: 'Knife', slot: 'melee',
    damage: 55, headMult: 1.6, armorPen: 0.85, rpm: 120, auto: false,
    mag: 0, reload: 0, recoilUp: 0.004, recoilSide: 0.004, recoilRecover: 0.2,
    spread: 0, spreadGrow: 0, maxSpread: 0, range: 2.1,
    scoped: false, zoom: 1, moveSpeed: 1.12, sound: 'knife',
  },
}

export type HitZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg'

/** multipliers applied on top of the weapon damage for each hitbox zone */
export const ZONE_MULT: Record<HitZone, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.25,
  arm: 0.75,
  leg: 0.75,
}

export const ZONE_LABEL: Record<HitZone, string> = {
  head: '头部', chest: '胸部', stomach: '腹部', arm: '手臂', leg: '腿',
}

/** vertical bands of a standing character, in world Y */
export const ZONE_BANDS: { zone: HitZone; lo: number; hi: number }[] = [
  { zone: 'head', lo: 1.62, hi: 1.92 },
  { zone: 'chest', lo: 1.15, hi: 1.62 },
  { zone: 'stomach', lo: 0.82, hi: 1.15 },
  { zone: 'arm', lo: 0.95, hi: 1.55 },
  { zone: 'leg', lo: 0.0, hi: 0.82 },
]

export function zoneForHit(hitY: number, lateralOffset: number): HitZone {
  if (hitY >= 1.62) return 'head'
  if (hitY >= 1.15) return lateralOffset > 0.42 ? 'arm' : 'chest'
  if (hitY >= 0.82) return lateralOffset > 0.42 ? 'arm' : 'stomach'
  return 'leg'
}

/** armour absorbs part of the damage */
export function applyArmor(damage: number, armor: number, armorPen: number): number {
  if (armor <= 0) return damage
  const absorbed = (armor / 100) * (1 - armorPen) * damage
  return damage - absorbed
}

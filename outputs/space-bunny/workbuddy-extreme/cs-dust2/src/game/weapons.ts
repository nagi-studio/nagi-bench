// 武器库：数据驱动，可扩展
import type { WeaponDef } from './types'

const AK: WeaponDef = {
  id: 'ak47',
  name: 'AK-47',
  slot: 'primary',
  damage: 36,
  headMult: 4.0,
  rpm: 600,
  magSize: 30,
  reserve: 90,
  reloadTime: 2.5,
  spread: 1.35,
  recoil: 1.15,
  recover: 6.0,
  auto: true,
  scope: 1,
  armorPen: 0.78,
  range: 90,
  spreadBullets: 1
}

const M4: WeaponDef = {
  id: 'm4a4',
  name: 'M4A4',
  slot: 'primary',
  damage: 27,
  headMult: 4.0,
  rpm: 900,
  magSize: 30,
  reserve: 90,
  reloadTime: 2.2,
  spread: 0.78,
  recoil: 0.52,
  recover: 8.5,
  auto: true,
  scope: 1,
  armorPen: 0.72,
  range: 90,
  spreadBullets: 1
}

const AWP: WeaponDef = {
  id: 'awp',
  name: 'AWP',
  slot: 'primary',
  damage: 115,
  headMult: 2.2,
  rpm: 41,
  magSize: 10,
  reserve: 30,
  reloadTime: 3.7,
  spread: 0.2,
  recoil: 3.6,
  recover: 3.2,
  auto: false,
  scope: 3.4,
  armorPen: 0.97,
  range: 160,
  spreadBullets: 1
}

const GLOCK: WeaponDef = {
  id: 'glock',
  name: 'Glock-18',
  slot: 'secondary',
  damage: 22,
  headMult: 4.0,
  rpm: 400,
  magSize: 20,
  reserve: 120,
  reloadTime: 2.1,
  spread: 1.05,
  recoil: 0.62,
  recover: 8.0,
  auto: false,
  scope: 1,
  armorPen: 0.47,
  range: 70,
  spreadBullets: 1
}

const USP: WeaponDef = {
  id: 'usp',
  name: 'USP-S',
  slot: 'secondary',
  damage: 24,
  headMult: 4.0,
  rpm: 352,
  magSize: 12,
  reserve: 96,
  reloadTime: 2.2,
  spread: 0.92,
  recoil: 0.5,
  recover: 8.2,
  auto: false,
  scope: 1,
  armorPen: 0.505,
  range: 75,
  spreadBullets: 1
}

const DEAGLE: WeaponDef = {
  id: 'deagle',
  name: 'Desert Eagle',
  slot: 'secondary',
  damage: 54,
  headMult: 4.0,
  rpm: 267,
  magSize: 7,
  reserve: 35,
  reloadTime: 2.2,
  spread: 1.6,
  recoil: 2.5,
  recover: 5.2,
  auto: false,
  scope: 1,
  armorPen: 0.93,
  range: 90,
  spreadBullets: 1
}

const KNIFE: WeaponDef = {
  id: 'knife',
  name: 'Knife',
  slot: 'melee',
  damage: 42,
  headMult: 1,
  rpm: 90,
  magSize: 0,
  reserve: 0,
  reloadTime: 0,
  spread: 0,
  recoil: 0,
  recover: 10,
  auto: false,
  scope: 1,
  armorPen: 0.85,
  range: 2.0,
  spreadBullets: 0
}

export const WEAPONS: Record<string, WeaponDef> = {
  ak47: AK,
  m4a4: M4,
  awp: AWP,
  glock: GLOCK,
  usp: USP,
  deagle: DEAGLE,
  knife: KNIFE
}

/** 部位伤害系数（爆头为身体两倍由 headMult 控制） */
export const HITBOX_MULT: Record<string, number> = {
  head: 1.0,
  chest: 1.0,
  abdomen: 0.85,
  arm: 0.7,
  leg: 0.65
}

export function cloneWeapon(id: string): WeaponDef {
  const w = WEAPONS[id]
  return { ...w }
}

/** 命中结算：返回最终伤害 */
export function computeDamage(
  weapon: WeaponDef,
  part: string,
  armor: number
): number {
  const mult = HITBOX_MULT[part] ?? 1
  let dmg = weapon.damage * mult
  // 爆头：独立倍率
  if (part === 'head') dmg *= weapon.headMult * 0.5 + 0.5
  // 护甲减伤
  if (armor > 0) {
    const pen = weapon.armorPen
    const toArmor = dmg * (1 - pen)
    const toHp = dmg - toArmor
    const absorbed = Math.min(armor, toArmor)
    return Math.max(1, toHp + Math.max(0, toArmor - absorbed))
  }
  return dmg
}

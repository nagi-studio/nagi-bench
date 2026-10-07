import { BODY_RADIUS, EYE_HEIGHT, HITGROUP_MULT, SIGHT_HALF_FOV, SIGHT_RANGE } from '../config.ts'
import { hasLineOfSight, raycastWorld, rayBox, type Aabb } from '../physics/physics.ts'
import type { Character } from '../entities/character.ts'
import type { WeaponDef } from '../weapons/weapons.ts'
import type { HitPart } from '../types.ts'
import type { Vec3 } from '../core/mathUtil.ts'

/**
 * 命中判定分区（角色局部坐标：y 相对脚底，x 为右侧，z 为前方；模型几何与此保持一致）。
 * 手臂左右各一个盒子。
 */
export interface HitBox {
  part: HitPart
  min: [number, number, number]
  max: [number, number, number]
}

export const HIT_BOXES: HitBox[] = [
  { part: 'head', min: [-0.13, 1.45, -0.13], max: [0.13, 1.8, 0.13] },
  { part: 'chest', min: [-0.25, 1.08, -0.15], max: [0.25, 1.45, 0.15] },
  { part: 'stomach', min: [-0.21, 0.88, -0.13], max: [0.21, 1.08, 0.13] },
  { part: 'arms', min: [-0.44, 0.9, -0.1], max: [-0.24, 1.42, 0.1] },
  { part: 'arms', min: [0.24, 0.9, -0.1], max: [0.44, 1.42, 0.1] },
  { part: 'legs', min: [-0.22, 0, -0.12], max: [0.22, 0.88, 0.12] },
]

/** 射线与角色分区求交，返回最近的命中分区与距离。 */
export function traceCharacter(c: Character, o: Vec3, d: Vec3, maxT: number): { t: number; part: HitPart } | null {
  const cs = Math.cos(c.yaw)
  const sn = Math.sin(c.yaw)
  const rx = o.x - c.x
  const rz = o.z - c.z
  // 世界 → 角色局部：right = (cos, -sin)，fwd = (-sin, -cos)
  const lox = rx * cs - rz * sn
  const loy = o.y - c.y
  const loz = -rx * sn - rz * cs
  const ldx = d.x * cs - d.z * sn
  const ldy = d.y
  const ldz = -d.x * sn - d.z * cs
  let best: { t: number; part: HitPart } | null = null
  for (const hb of HIT_BOXES) {
    const t = rayBox(
      lox, loy, loz, ldx, ldy, ldz,
      hb.min[0], hb.min[1], hb.min[2], hb.max[0], hb.max[1], hb.max[2],
      best ? best.t : maxT,
    )
    if (t < Infinity && (!best || t < best.t)) best = { t, part: hb.part }
  }
  return best
}

/**
 * 视线判定：距离 < SIGHT_RANGE，可选的视野锥（AI 用），并且胸口或头部至少一点不被墙挡住。
 */
export function canSee(a: Character, b: Character, colliders: Aabb[], useFov: boolean): boolean {
  const dx = b.x - a.x
  const dz = b.z - a.z
  const dist = Math.hypot(dx, dz)
  if (dist > SIGHT_RANGE) return false
  if (useFov && dist > 3) {
    const fx = -Math.sin(a.yaw)
    const fz = -Math.cos(a.yaw)
    if ((fx * dx + fz * dz) / dist < Math.cos(SIGHT_HALF_FOV)) return false
  }
  const eye = { x: a.x, y: a.y + EYE_HEIGHT, z: a.z }
  return (
    hasLineOfSight(eye, { x: b.x, y: b.y + 1.3, z: b.z }, colliders) ||
    hasLineOfSight(eye, { x: b.x, y: b.y + 1.6, z: b.z }, colliders)
  )
}

/** 由偏航 / 俯仰 / 扩散半径得到子弹方向（扩散在视线正交平面上均匀分布） */
export function aimDirection(yaw: number, pitch: number, spread: number): Vec3 {
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  const r = spread * Math.sqrt(Math.random())
  const a = Math.random() * Math.PI * 2
  const ox = Math.cos(a) * r
  const oy = Math.sin(a) * r
  // forward = (-sy·cp, sp, -cy·cp)；right = (cy, 0, -sy)；up = (sy·sp, cp, cy·sp)
  const dx = -sy * cp + cy * ox + sy * sp * oy
  const dy = sp + cp * oy
  const dz = -cy * cp - sy * ox + cy * sp * oy
  const len = Math.hypot(dx, dy, dz)
  return { x: dx / len, y: dy / len, z: dz / len }
}

export interface ShotResult {
  end: Vec3
  target: Character | null
  part: HitPart | null
}

export function fireBullet(
  shooter: Character,
  def: WeaponDef,
  spread: number,
  colliders: Aabb[],
  characters: Character[],
): ShotResult {
  const origin = { x: shooter.x, y: shooter.y + EYE_HEIGHT, z: shooter.z }
  const dir = aimDirection(shooter.yaw, shooter.pitch + shooter.punch, spread)
  const wall = raycastWorld(origin, dir, def.range, colliders)
  const maxT = wall ? wall.t : def.range
  let best: { target: Character; part: HitPart; t: number } | null = null
  for (const ch of characters) {
    if (!ch.alive || ch.team === shooter.team) continue
    if (Math.hypot(ch.x - shooter.x, ch.z - shooter.z) > maxT + BODY_RADIUS) continue
    const hit = traceCharacter(ch, origin, dir, maxT)
    if (hit && (!best || hit.t < best.t)) best = { target: ch, part: hit.part, t: hit.t }
  }
  const len = best ? best.t : maxT
  return {
    end: { x: origin.x + dir.x * len, y: origin.y + dir.y * len, z: origin.z + dir.z * len },
    target: best ? best.target : null,
    part: best ? best.part : null,
  }
}

/** 刀：前方扇形 + 距离内 + 视线未被挡住的最近敌人 */
export function meleeTarget(
  shooter: Character,
  range: number,
  colliders: Aabb[],
  characters: Character[],
): Character | null {
  const fx = -Math.sin(shooter.yaw)
  const fz = -Math.cos(shooter.yaw)
  const eye = { x: shooter.x, y: shooter.y + EYE_HEIGHT, z: shooter.z }
  let best: Character | null = null
  let bd = Infinity
  for (const ch of characters) {
    if (!ch.alive || ch.team === shooter.team) continue
    const dx = ch.x - shooter.x
    const dz = ch.z - shooter.z
    const d = Math.hypot(dx, dz)
    if (d > range + BODY_RADIUS || d >= bd || d < 1e-6) continue
    if ((fx * dx + fz * dz) / d < 0.6) continue
    if (!hasLineOfSight(eye, { x: ch.x, y: ch.y + 1.2, z: ch.z }, colliders)) continue
    best = ch
    bd = d
  }
  return best
}

/** 部位倍率 × 基准伤害（护甲在 Character.takeDamage 中结算） */
export function partDamage(base: number, part: HitPart): number {
  return base * HITGROUP_MULT[part]
}

import { BODY_RADIUS, GRAVITY, JUMP_SPEED, STAND_HEIGHT, STEP_HEIGHT } from '../config.ts'
import type { Vec3 } from '../core/mathUtil.ts'

/** 轴对齐包围盒。active=false 时不参与碰撞（如打开的门）。 */
export interface Aabb {
  minX: number
  maxX: number
  minY: number
  maxY: number
  minZ: number
  maxZ: number
  active: boolean
  tag: 'wall' | 'crate' | 'low' | 'door'
}

/** 任何需要受重力、碰撞约束的实体（角色）都满足该结构。 */
export interface Body {
  x: number
  y: number
  z: number
  vy: number
  onGround: boolean
}

const EPS = 1e-4

function bodyOverlaps(c: Aabb, x: number, y: number, z: number): boolean {
  return (
    c.active &&
    c.maxX > x - BODY_RADIUS &&
    c.minX < x + BODY_RADIUS &&
    c.maxZ > z - BODY_RADIUS &&
    c.minZ < z + BODY_RADIUS &&
    c.minY < y + STAND_HEIGHT &&
    c.maxY > y + STEP_HEIGHT
  )
}

/**
 * 水平移动，分轴解算：X 与 Z 分别检测，贴墙时沿墙面滑动，不会穿墙。
 * 只阻挡高于台阶高度的碰撞体；矮于 STEP_HEIGHT 的物体视为可踩过。
 */
export function moveBody(b: Body, dx: number, dz: number, colliders: Aabb[]): void {
  if (dx !== 0) {
    let nx = b.x + dx
    for (const c of colliders) {
      if (!bodyOverlaps(c, nx, b.y, b.z)) continue
      if (dx > 0) {
        if (b.x + BODY_RADIUS <= c.minX + EPS) nx = c.minX - BODY_RADIUS - EPS
      } else if (b.x - BODY_RADIUS >= c.maxX - EPS) {
        nx = c.maxX + BODY_RADIUS + EPS
      }
    }
    b.x = nx
  }
  if (dz !== 0) {
    let nz = b.z + dz
    for (const c of colliders) {
      if (!bodyOverlaps(c, b.x, b.y, nz)) continue
      if (dz > 0) {
        if (b.z + BODY_RADIUS <= c.minZ + EPS) nz = c.minZ - BODY_RADIUS - EPS
      } else if (b.z - BODY_RADIUS >= c.maxZ - EPS) {
        nz = c.maxZ + BODY_RADIUS + EPS
      }
    }
    b.z = nz
  }
}

/** 脚下可站立的最高表面（地面为 0），只考虑 STEP_HEIGHT 以内的台阶。 */
export function supportHeight(x: number, y: number, z: number, colliders: Aabb[]): number {
  let best = 0
  for (const c of colliders) {
    if (!c.active || c.maxY > y + STEP_HEIGHT + EPS || c.maxY <= best) continue
    if (c.maxX > x - BODY_RADIUS && c.minX < x + BODY_RADIUS && c.maxZ > z - BODY_RADIUS && c.minZ < z + BODY_RADIUS) {
      best = c.maxY
    }
  }
  return best
}

/** 竖直方向：重力、起跳、落地（落在箱子顶部或地面）。 */
export function updateVertical(b: Body, dt: number, jump: boolean, colliders: Aabb[]): void {
  if (b.onGround) {
    if (jump) {
      b.vy = JUMP_SPEED
      b.onGround = false
    } else {
      const sup = supportHeight(b.x, b.y, b.z, colliders)
      if (sup >= b.y - STEP_HEIGHT - EPS) {
        b.y = sup
        b.vy = 0
        return
      }
      b.onGround = false
    }
  }
  b.vy -= GRAVITY * dt
  b.y += b.vy * dt
  const sup = supportHeight(b.x, b.y, b.z, colliders)
  if (b.vy <= 0 && b.y <= sup) {
    b.y = sup
    b.vy = 0
    b.onGround = true
  }
}

/**
 * 射线与 AABB 求交（slab 法）。返回进入距离 t（≥0），未命中返回 Infinity。
 * 方向向量需为单位向量或至少非零。
 */
export function rayBox(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  minX: number, minY: number, minZ: number,
  maxX: number, maxY: number, maxZ: number,
  maxT: number,
): number {
  let t0 = 0
  let t1 = maxT
  if (Math.abs(dx) < 1e-12) {
    if (ox < minX || ox > maxX) return Infinity
  } else {
    let a = (minX - ox) / dx
    let b = (maxX - ox) / dx
    if (a > b) { const t = a; a = b; b = t }
    if (a > t0) t0 = a
    if (b < t1) t1 = b
    if (t0 > t1) return Infinity
  }
  if (Math.abs(dy) < 1e-12) {
    if (oy < minY || oy > maxY) return Infinity
  } else {
    let a = (minY - oy) / dy
    let b = (maxY - oy) / dy
    if (a > b) { const t = a; a = b; b = t }
    if (a > t0) t0 = a
    if (b < t1) t1 = b
    if (t0 > t1) return Infinity
  }
  if (Math.abs(dz) < 1e-12) {
    if (oz < minZ || oz > maxZ) return Infinity
  } else {
    let a = (minZ - oz) / dz
    let b = (maxZ - oz) / dz
    if (a > b) { const t = a; a = b; b = t }
    if (a > t0) t0 = a
    if (b < t1) t1 = b
    if (t0 > t1) return Infinity
  }
  return t0
}

export interface RayHit {
  t: number
  collider: Aabb
}

/** 射线与场景碰撞体求最近交点（只检测 active 的碰撞体）。 */
export function raycastWorld(origin: Vec3, dir: Vec3, maxT: number, colliders: Aabb[]): RayHit | null {
  let best: RayHit | null = null
  for (const c of colliders) {
    if (!c.active) continue
    const t = rayBox(
      origin.x, origin.y, origin.z,
      dir.x, dir.y, dir.z,
      c.minX, c.minY, c.minZ, c.maxX, c.maxY, c.maxZ,
      best ? best.t : maxT,
    )
    if (t < Infinity && (!best || t < best.t)) best = { t, collider: c }
  }
  return best
}

export function hasLineOfSight(a: Vec3, b: Vec3, colliders: Aabb[]): boolean {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dz = b.z - a.z
  const dist = Math.hypot(dx, dy, dz)
  if (dist < 1e-6) return true
  const dir = { x: dx / dist, y: dy / dist, z: dz / dist }
  return raycastWorld(a, dir, dist - 0.01, colliders) === null
}

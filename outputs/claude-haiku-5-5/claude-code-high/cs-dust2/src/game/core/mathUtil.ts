export interface Vec2 {
  x: number
  z: number
}

export interface Vec3 {
  x: number
  y: number
  z: number
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}

/** 把角度归一化到 [-π, π) */
export function wrapAngle(a: number): number {
  const t = (a + Math.PI) % (Math.PI * 2)
  return (t < 0 ? t + Math.PI * 2 : t) - Math.PI
}

export function angleDiff(target: number, current: number): number {
  return wrapAngle(target - current)
}

/** 按最大步长把角度从 current 逼近 target（走最短弧） */
export function approachAngle(current: number, target: number, maxStep: number): number {
  return current + clamp(angleDiff(target, current), -maxStep, maxStep)
}

export function approach(current: number, target: number, maxStep: number): number {
  return current + clamp(target - current, -maxStep, maxStep)
}

export function distXZ(ax: number, az: number, bx: number, bz: number): number {
  return Math.hypot(ax - bx, az - bz)
}

/**
 * 偏航角约定：yaw=0 时朝向 -Z（北）。前方向量 = (-sin yaw, 0, -cos yaw)，
 * 右方向量 = (cos yaw, 0, -sin yaw)。pitch 上仰为正。
 */
export function yawTowards(dx: number, dz: number): number {
  return Math.atan2(-dx, -dz)
}

export function lookDir(yaw: number, pitch: number): Vec3 {
  const cp = Math.cos(pitch)
  return { x: -Math.sin(yaw) * cp, y: Math.sin(pitch), z: -Math.cos(yaw) * cp }
}

export function randRange(lo: number, hi: number): number {
  return lo + Math.random() * (hi - lo)
}

export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
  }
  return arr
}

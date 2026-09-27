export function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function damp(a: number, b: number, lambda: number, dt: number): number {
  return lerp(a, b, 1 - Math.exp(-lambda * dt))
}

export function hypot2(x: number, z: number): number {
  return Math.hypot(x, z)
}

/** yaw=0 looks toward -Z; yaw increases as the view turns toward -X. */
export function forwardFromYaw(yaw: number): { x: number; z: number } {
  return { x: -Math.sin(yaw), z: -Math.cos(yaw) }
}

export function rightFromYaw(yaw: number): { x: number; z: number } {
  return { x: Math.cos(yaw), z: -Math.sin(yaw) }
}

export function yawToward(dx: number, dz: number): number {
  return Math.atan2(-dx, -dz)
}

export function aimDir(yaw: number, pitch: number): { x: number; y: number; z: number } {
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  const f = forwardFromYaw(yaw)
  return { x: f.x * cp, y: sp, z: f.z * cp }
}

/** Mesh yaw so a model that faces +Z looks along forwardFromYaw(yaw). */
export function facingYaw(yaw: number): number {
  const f = forwardFromYaw(yaw)
  return Math.atan2(f.x, f.z)
}

export function angNorm(a: number): number {
  let x = a
  while (x > Math.PI) x -= Math.PI * 2
  while (x < -Math.PI) x += Math.PI * 2
  return x
}

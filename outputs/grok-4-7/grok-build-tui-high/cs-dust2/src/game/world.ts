import { clamp } from './math'

export interface Solid {
  minX: number
  maxX: number
  minY: number
  maxY: number
  minZ: number
  maxZ: number
  standable: boolean
  dynamic: boolean
  tag: string
}

export interface Body {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  onGround: boolean
  crouch: boolean
}

export const BODY_R = 0.32
export const H_STAND = 1.72
export const H_CROUCH = 1.18
export const EYE_STAND = 1.58
export const EYE_CROUCH = 1.02
export const STEP_H = 0.52
export const GRAVITY = 19.5
export const RUN_SPEED = 5.55
export const WALK_SPEED = 2.25
export const CROUCH_SPEED = 1.85

const BIN = 8

export class World {
  solids: Solid[] = []
  private bins = new Map<string, number[]>()

  add(s: Solid): Solid {
    this.solids.push(s)
    return s
  }

  rebuildIndex(): void {
    this.bins.clear()
    for (let i = 0; i < this.solids.length; i++) this.indexAt(i)
  }

  private indexAt(i: number): void {
    const s = this.solids[i]
    const c0 = Math.floor(s.minX / BIN)
    const c1 = Math.floor((s.maxX - 1e-4) / BIN)
    const r0 = Math.floor(s.minZ / BIN)
    const r1 = Math.floor((s.maxZ - 1e-4) / BIN)
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const k = `${c},${r}`
        let arr = this.bins.get(k)
        if (!arr) {
          arr = []
          this.bins.set(k, arr)
        }
        arr.push(i)
      }
    }
  }

  query(minX: number, maxX: number, minZ: number, maxZ: number): Solid[] {
    const c0 = Math.floor(minX / BIN)
    const c1 = Math.floor(maxX / BIN)
    const r0 = Math.floor(minZ / BIN)
    const r1 = Math.floor(maxZ / BIN)
    const seen = new Set<number>()
    const out: Solid[] = []
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const arr = this.bins.get(`${c},${r}`)
        if (!arr) continue
        for (const i of arr) {
          if (seen.has(i)) continue
          seen.add(i)
          out.push(this.solids[i])
        }
      }
    }
    return out
  }

  raycast(
    ox: number,
    oy: number,
    oz: number,
    dx: number,
    dy: number,
    dz: number,
    maxDist: number,
    skip?: (s: Solid) => boolean,
  ): { t: number; x: number; y: number; z: number; nx: number; ny: number; nz: number; solid: Solid } | null {
    const minX = Math.min(ox, ox + dx * maxDist) - 0.2
    const maxX = Math.max(ox, ox + dx * maxDist) + 0.2
    const minZ = Math.min(oz, oz + dz * maxDist) - 0.2
    const maxZ = Math.max(oz, oz + dz * maxDist) + 0.2
    let bestT = maxDist
    let best: { t: number; nx: number; ny: number; nz: number; solid: Solid } | null = null
    for (const s of this.query(minX, maxX, minZ, maxZ)) {
      if (skip && skip(s)) continue
      const hit = rayAABB(ox, oy, oz, dx, dy, dz, bestT, s)
      if (!hit) continue
      if (hit.t < bestT && hit.t > 1e-4) {
        bestT = hit.t
        best = { t: hit.t, nx: hit.nx, ny: hit.ny, nz: hit.nz, solid: s }
      }
    }
    if (!best) return null
    return {
      ...best,
      x: ox + dx * best.t,
      y: oy + dy * best.t,
      z: oz + dz * best.t,
    }
  }
}

function rayAABB(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxT: number,
  s: Solid,
): { t: number; nx: number; ny: number; nz: number } | null {
  let tmin = 0
  let tmax = maxT
  let nx = 0
  let ny = 0
  let nz = 0
  const dims: [number, number, number, number, number][] = [
    [ox, dx, s.minX, s.maxX, 0],
    [oy, dy, s.minY, s.maxY, 1],
    [oz, dz, s.minZ, s.maxZ, 2],
  ]
  for (const [o, d, min, max, axis] of dims) {
    if (Math.abs(d) < 1e-9) {
      if (o < min || o > max) return null
      continue
    }
    let t1 = (min - o) / d
    let t2 = (max - o) / d
    let sign = -1
    if (t1 > t2) {
      const tmp = t1
      t1 = t2
      t2 = tmp
      sign = 1
    }
    if (t1 > tmin) {
      tmin = t1
      nx = axis === 0 ? sign : 0
      ny = axis === 1 ? sign : 0
      nz = axis === 2 ? sign : 0
    }
    if (t2 < tmax) tmax = t2
    if (tmin > tmax) return null
  }
  if (tmin < 0 || tmin > maxT) return null
  return { t: tmin, nx, ny, nz }
}

export function bodyHeight(b: Body): number {
  return b.crouch ? H_CROUCH : H_STAND
}

export function eyeHeight(b: Body): number {
  return b.crouch ? EYE_CROUCH : EYE_STAND
}

function circleHits(x: number, z: number, s: Solid): boolean {
  const cx = clamp(x, s.minX, s.maxX)
  const cz = clamp(z, s.minZ, s.maxZ)
  const dx = x - cx
  const dz = z - cz
  return dx * dx + dz * dz < BODY_R * BODY_R
}

function overlaps(x: number, y: number, z: number, h: number, s: Solid): boolean {
  const y0 = y + 0.05
  const y1 = y + h - 0.02
  if (s.maxY <= y0 || s.minY >= y1) return false
  return circleHits(x, z, s)
}

function nearby(world: World, x: number, z: number): Solid[] {
  return world.query(x - 1.4, x + 1.4, z - 1.4, z + 1.4)
}

function blocking(world: World, x: number, y: number, z: number, h: number): Solid[] {
  const out: Solid[] = []
  for (const s of nearby(world, x, z)) {
    if (overlaps(x, y, z, h, s)) out.push(s)
  }
  return out
}

function groundHeight(world: World, x: number, z: number, feetY: number): number | null {
  let best: number | null = null
  for (const s of nearby(world, x, z)) {
    if (!s.standable) continue
    if (s.maxY > feetY + 0.12) continue
    if (s.maxY < feetY - 1.6) continue
    if (!circleHits(x, z, s)) continue
    if (best === null || s.maxY > best) best = s.maxY
  }
  return best
}

function ceilingAt(world: World, x: number, z: number, y0: number, y1: number): number | null {
  let best: number | null = null
  for (const s of nearby(world, x, z)) {
    if (s.standable && s.maxY <= y0 + 0.2) continue
    if (!circleHits(x, z, s)) continue
    if (s.minY < y0 + 0.4) continue
    if (s.minY < y1 && (best === null || s.minY < best)) best = s.minY
  }
  return best
}

export function canStand(world: World, b: Body): boolean {
  return blocking(world, b.x, b.y, b.z, H_STAND).length === 0
}

/**
 * Integrate a capsule against the solid world.
 * wishX/wishZ is a desired world-space direction (not necessarily normalized).
 */
export function moveBody(
  world: World,
  b: Body,
  wishX: number,
  wishZ: number,
  wishSpeed: number,
  jump: boolean,
  dt: number,
): void {
  const hBefore = bodyHeight(b)
  if (!b.crouch && blocking(world, b.x, b.y, b.z, H_STAND).length > 0) b.crouch = true

  const len = Math.hypot(wishX, wishZ)
  const dirx = len > 1e-5 ? wishX / len : 0
  const dirz = len > 1e-5 ? wishZ / len : 0
  const grounded = b.onGround

  if (grounded) {
    const sp = Math.hypot(b.vx, b.vz)
    const control = Math.max(sp, 0.8)
    const drop = control * 8.5 * dt
    const ns = Math.max(0, sp - drop)
    if (sp > 1e-5) {
      b.vx = (b.vx / sp) * ns
      b.vz = (b.vz / sp) * ns
    }
    if (len > 1e-5) accelerate(b, dirx, dirz, wishSpeed, 48, dt)
    if (jump) {
      b.vy = 6.85
      b.onGround = false
    }
  } else if (len > 1e-5) {
    accelerate(b, dirx, dirz, Math.min(wishSpeed, RUN_SPEED), 12, dt)
  }

  const hs = Math.hypot(b.vx, b.vz)
  const cap = 7.4
  if (hs > cap) {
    b.vx = (b.vx / hs) * cap
    b.vz = (b.vz / hs) * cap
  }

  const dx = b.vx * dt
  const dz = b.vz * dt
  const dist = Math.hypot(dx, dz)
  const steps = Math.max(1, Math.ceil(dist / 0.12))
  for (let i = 0; i < steps; i++) slide(world, b, dx / steps, dz / steps)

  b.vy -= GRAVITY * dt
  if (b.vy < -28) b.vy = -28
  const h = bodyHeight(b)
  const ny = b.y + b.vy * dt
  if (b.vy <= 0) {
    const g = groundHeight(world, b.x, b.z, Math.max(b.y, ny) + 0.05)
    if (g !== null && ny <= g && b.y + 0.08 >= g) {
      b.y = g
      b.vy = 0
      b.onGround = true
    } else {
      b.y = ny
      b.onGround = false
    }
  } else {
    const ceil = ceilingAt(world, b.x, b.z, b.y + h * 0.45, ny + h)
    if (ceil !== null && ny + h > ceil) {
      b.y = ceil - h - 0.02
      b.vy = 0
    } else {
      b.y = ny
    }
    b.onGround = false
  }

  if (b.crouch && hBefore === H_CROUCH) {
    /* caller decides release */
  }
}

function accelerate(b: Body, dirx: number, dirz: number, wishSpeed: number, accel: number, dt: number): void {
  const cur = b.vx * dirx + b.vz * dirz
  const add = wishSpeed - cur
  if (add <= 0) return
  let a = accel * dt * wishSpeed
  if (a > add) a = add
  b.vx += dirx * a
  b.vz += dirz * a
}

function slide(world: World, b: Body, dx: number, dz: number): void {
  tryAxis(world, b, 'x', dx)
  tryAxis(world, b, 'z', dz)
}

function tryAxis(world: World, b: Body, axis: 'x' | 'z', delta: number): void {
  if (delta === 0) return
  const h = bodyHeight(b)
  const nx = b.x + (axis === 'x' ? delta : 0)
  const nz = b.z + (axis === 'z' ? delta : 0)
  const blocked = blocking(world, nx, b.y, nz, h)
  if (blocked.length === 0) {
    b.x = nx
    b.z = nz
    return
  }
  if (b.vy <= 0.01) {
    let stepY = b.y
    let ok = true
    for (const s of blocked) {
      const rise = s.maxY - b.y
      if (s.standable && rise > 0.001 && rise <= STEP_H) {
        if (s.maxY > stepY) stepY = s.maxY
      } else {
        ok = false
        break
      }
    }
    if (ok && stepY > b.y + 0.001) {
      const ceil = ceilingAt(world, nx, nz, stepY + 0.2, stepY + h)
      if ((ceil === null || ceil - stepY >= h - 0.02) && blocking(world, nx, stepY, nz, h).length === 0) {
        b.x = nx
        b.z = nz
        b.y = stepY
        b.onGround = true
        return
      }
    }
  }
  if (axis === 'x') b.vx = 0
  else b.vz = 0
}

export function makeBody(x: number, y: number, z: number): Body {
  return { x, y, z, vx: 0, vy: 0, vz: 0, onGround: true, crouch: false }
}

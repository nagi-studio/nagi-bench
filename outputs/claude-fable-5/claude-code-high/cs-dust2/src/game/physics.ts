import * as THREE from 'three'
import { CELL, GRID, WALL_H, GameMap, type AABB } from './map'
import type { BodyPart, SoldierBody } from './types'
import { GRAVITY } from './types'

const HALF = GRID / 2
const STEP = 0.35 // max ledge height walkable without jumping

export interface HitboxDef { part: BodyPart; min: [number, number, number]; max: [number, number, number] }

/** Local space, feet at origin, facing -Z. */
export const HITBOXES: HitboxDef[] = [
  { part: 'head', min: [-0.15, 1.48, -0.16], max: [0.15, 1.8, 0.16] },
  { part: 'chest', min: [-0.24, 1.12, -0.15], max: [0.24, 1.48, 0.15] },
  { part: 'stomach', min: [-0.22, 0.86, -0.14], max: [0.22, 1.12, 0.14] },
  { part: 'arm', min: [-0.44, 1.0, -0.15], max: [-0.24, 1.48, 0.15] },
  { part: 'arm', min: [0.24, 1.0, -0.15], max: [0.44, 1.48, 0.15] },
  { part: 'leg', min: [-0.22, 0, -0.14], max: [-0.02, 0.9, 0.14] },
  { part: 'leg', min: [0.02, 0, -0.14], max: [0.22, 0.9, 0.14] },
]

export interface RayHit {
  t: number
  point: THREE.Vector3
  kind: 'wall' | 'crate' | 'door' | 'floor' | 'soldier'
  soldier?: SoldierBody
  part?: BodyPart
}

export interface MovingBody {
  pos: THREE.Vector3 // feet
  vel: THREE.Vector3
  onGround: boolean
  radius: number
  height: number
}

function rayAABB(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, box: AABB): number | null {
  let tmin = 0, tmax = Infinity
  const o = [ox, oy, oz], d = [dx, dy, dz]
  const mn = [box.min.x, box.min.y, box.min.z], mx = [box.max.x, box.max.y, box.max.z]
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-9) {
      if (o[i] < mn[i] || o[i] > mx[i]) return null
    } else {
      let t1 = (mn[i] - o[i]) / d[i]
      let t2 = (mx[i] - o[i]) / d[i]
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp }
      if (t1 > tmin) tmin = t1
      if (t2 < tmax) tmax = t2
      if (tmin > tmax) return null
    }
  }
  return tmin
}

export class PhysicsWorld {
  map: GameMap

  constructor(map: GameMap) {
    this.map = map
  }

  /** Is a circle at (x,z) with feet at y clear of walls/crates/doors? */
  circleFree(x: number, z: number, r: number, feetY: number, ignoreDoors = false): boolean {
    const cMin = Math.floor((x - r) / CELL + HALF), cMax = Math.floor((x + r) / CELL + HALF)
    const rMin = Math.floor((z - r) / CELL + HALF), rMax = Math.floor((z + r) / CELL + HALF)
    for (let cr = rMin; cr <= rMax; cr++) {
      for (let cc = cMin; cc <= cMax; cc++) {
        if (!this.map.isWall(cc, cr)) continue
        if (this.circleHitsRect(x, z, r, (cc - HALF) * CELL, (cr - HALF) * CELL, (cc - HALF + 1) * CELL, (cr - HALF + 1) * CELL)) return false
      }
    }
    for (const box of this.map.crates) {
      if (box.max.y <= feetY + STEP) continue // can step onto / stand on it
      if (this.circleHitsRect(x, z, r, box.min.x, box.min.z, box.max.x, box.max.z)) return false
    }
    if (!ignoreDoors) {
      for (const d of this.map.doors) {
        for (const box of d.colliders()) {
          if (this.circleHitsRect(x, z, r, box.min.x, box.min.z, box.max.x, box.max.z)) return false
        }
      }
    }
    return true
  }

  private circleHitsRect(x: number, z: number, r: number, x1: number, z1: number, x2: number, z2: number): boolean {
    const nx = Math.max(x1, Math.min(x, x2))
    const nz = Math.max(z1, Math.min(z, z2))
    const dx = x - nx, dz = z - nz
    return dx * dx + dz * dz < r * r
  }

  /** Used by nav smoothing: walls + crates only (doors auto-open). */
  walkClear(a: THREE.Vector3, b: THREE.Vector3, radius: number): boolean {
    const dx = b.x - a.x, dz = b.z - a.z
    const dist = Math.hypot(dx, dz)
    const steps = Math.max(1, Math.ceil(dist / 0.35))
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      if (!this.circleFree(a.x + dx * t, a.z + dz * t, radius, 0, true)) return false
    }
    return true
  }

  moveBody(body: MovingBody, wishWorld: THREE.Vector3, speed: number, jump: boolean, dt: number) {
    const accel = body.onGround ? 22 : 4
    const k = Math.min(1, accel * dt)
    body.vel.x += (wishWorld.x * speed - body.vel.x) * k
    body.vel.z += (wishWorld.z * speed - body.vel.z) * k

    if (jump && body.onGround) {
      body.vel.y = 7.0
      body.onGround = false
    }

    // axis-separated horizontal collision
    const nx = body.pos.x + body.vel.x * dt
    if (this.circleFree(nx, body.pos.z, body.radius, body.pos.y)) body.pos.x = nx
    else body.vel.x = 0
    const nz = body.pos.z + body.vel.z * dt
    if (this.circleFree(body.pos.x, nz, body.radius, body.pos.y)) body.pos.z = nz
    else body.vel.z = 0

    // vertical
    const prevY = body.pos.y
    body.vel.y -= GRAVITY * dt
    body.pos.y += body.vel.y * dt
    const ground = this.groundHeight(body.pos.x, body.pos.z, body.radius, prevY)
    if (body.pos.y <= ground && body.vel.y <= 0) {
      body.pos.y = ground
      body.vel.y = 0
      body.onGround = true
    } else {
      body.onGround = false
    }
  }

  groundHeight(x: number, z: number, r: number, feetY: number): number {
    let g = 0
    for (const box of this.map.crates) {
      if (box.max.y > feetY + STEP) continue
      if (this.circleHitsRect(x, z, r, box.min.x, box.min.z, box.max.x, box.max.z)) {
        if (box.max.y > g) g = box.max.y
      }
    }
    return g
  }

  raycast(
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    maxDist: number,
    soldiers?: SoldierBody[],
    ignoreId?: number,
    ignoreTeam?: string,
  ): RayHit | null {
    let best: RayHit | null = null
    const consider = (t: number, kind: RayHit['kind'], soldier?: SoldierBody, part?: BodyPart) => {
      if (t < 0 || t > maxDist) return
      if (best && t >= best.t) return
      best = {
        t, kind, soldier, part,
        point: new THREE.Vector3(origin.x + dir.x * t, origin.y + dir.y * t, origin.z + dir.z * t),
      }
    }

    // floor
    if (dir.y < -1e-6) consider(-origin.y / dir.y, 'floor')

    // walls via DDA
    const wt = this.wallRay(origin, dir, maxDist)
    if (wt !== null) consider(wt, 'wall')

    // crates
    for (const box of this.map.crates) {
      const t = rayAABB(origin.x, origin.y, origin.z, dir.x, dir.y, dir.z, box)
      if (t !== null) consider(t, 'crate')
    }

    // door panels
    for (const d of this.map.doors) {
      for (const box of d.colliders()) {
        const t = rayAABB(origin.x, origin.y, origin.z, dir.x, dir.y, dir.z, box)
        if (t !== null) consider(t, 'door')
      }
    }

    // soldier hitboxes (ray transformed into each soldier's local yaw space)
    if (soldiers) {
      for (const s of soldiers) {
        if (!s.alive || s.id === ignoreId) continue
        if (ignoreTeam && s.team === ignoreTeam) continue
        const cos = Math.cos(-s.yaw), sin = Math.sin(-s.yaw)
        const rx = origin.x - s.pos.x, rz = origin.z - s.pos.z
        const lox = rx * cos - rz * sin
        const loz = rx * sin + rz * cos
        const loy = origin.y - s.pos.y
        const ldx = dir.x * cos - dir.z * sin
        const ldz = dir.x * sin + dir.z * cos
        for (const hb of HITBOXES) {
          const t = rayAABB(lox, loy, loz, ldx, dir.y, ldz, {
            min: new THREE.Vector3(hb.min[0], hb.min[1], hb.min[2]),
            max: new THREE.Vector3(hb.max[0], hb.max[1], hb.max[2]),
          })
          if (t !== null) consider(t, 'soldier', s, hb.part)
        }
      }
    }

    return best
  }

  private wallRay(origin: THREE.Vector3, dir: THREE.Vector3, maxDist: number): number | null {
    let cx = Math.floor(origin.x / CELL + HALF)
    let cz = Math.floor(origin.z / CELL + HALF)
    const stepX = dir.x > 0 ? 1 : -1
    const stepZ = dir.z > 0 ? 1 : -1
    const tDeltaX = Math.abs(dir.x) > 1e-9 ? CELL / Math.abs(dir.x) : Infinity
    const tDeltaZ = Math.abs(dir.z) > 1e-9 ? CELL / Math.abs(dir.z) : Infinity
    const nextGridX = (cx - HALF + (stepX > 0 ? 1 : 0)) * CELL
    const nextGridZ = (cz - HALF + (stepZ > 0 ? 1 : 0)) * CELL
    let tMaxX = Math.abs(dir.x) > 1e-9 ? (nextGridX - origin.x) / dir.x : Infinity
    let tMaxZ = Math.abs(dir.z) > 1e-9 ? (nextGridZ - origin.z) / dir.z : Infinity

    if (this.map.isWall(cx, cz)) return 0

    let t = 0
    for (let i = 0; i < GRID * 3; i++) {
      if (tMaxX < tMaxZ) {
        t = tMaxX
        tMaxX += tDeltaX
        cx += stepX
      } else {
        t = tMaxZ
        tMaxZ += tDeltaZ
        cz += stepZ
      }
      if (t > maxDist) return null
      if (this.map.isWall(cx, cz)) {
        const y = origin.y + dir.y * t
        if (y >= 0 && y <= WALL_H) return t
      }
    }
    return null
  }

  /** Line of sight between two points against static world only. */
  hasLOS(a: THREE.Vector3, b: THREE.Vector3): boolean {
    const dir = new THREE.Vector3().subVectors(b, a)
    const dist = dir.length()
    if (dist < 1e-4) return true
    dir.multiplyScalar(1 / dist)
    const hit = this.raycast(a, dir, dist * 0.99)
    return hit === null
  }
}

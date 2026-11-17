import type { HitZone } from './arsenal'
import { BLOCKS, MAP_BOUNDS, clamp, distance2, groundY, walkable, type Block, type Point, type Vec } from './level'

export const BODY_RADIUS = 0.32
export const BODY_HEIGHT = 1.79
export const EYE_HEIGHT = 1.64
const NAV_RADIUS = BODY_RADIUS + 0.115
const GRAVITY = 16
const JUMP_SPEED = 4.85

export interface Body {
  position: Vec
  vy: number
  grounded: boolean
}

interface Solid extends Block {
  cos: number
  sin: number
  top: number
  reachX: number
  reachZ: number
}

const SOLIDS: Solid[] = BLOCKS.map(block => {
  const cos = Math.cos(block.angle)
  const sin = Math.sin(block.angle)
  return {
    ...block, cos, sin, top: block.y + block.h,
    reachX: (Math.abs(cos) * block.w + Math.abs(sin) * block.d) / 2,
    reachZ: (Math.abs(sin) * block.w + Math.abs(cos) * block.d) / 2,
  }
})

function horizontalOverlap(x: number, z: number, radius: number, solid: Solid) {
  const dx = x - solid.x
  const dz = z - solid.z
  if (Math.abs(dx) >= solid.reachX + radius || Math.abs(dz) >= solid.reachZ + radius) return false
  const u = dx * solid.cos - dz * solid.sin
  const v = dx * solid.sin + dz * solid.cos
  const du = Math.max(0, Math.abs(u) - solid.w / 2)
  const dv = Math.max(0, Math.abs(v) - solid.d / 2)
  return du * du + dv * dv < radius * radius
}

export function blocked(x: number, z: number, bottom: number, radius = BODY_RADIUS, height = BODY_HEIGHT) {
  if (!walkable({ x, z })) return true
  return SOLIDS.some(solid =>
    solid.top > bottom + 0.025 && solid.y < bottom + height - 0.015 && horizontalOverlap(x, z, radius, solid),
  )
}

function supportAt(position: Vec) {
  let top = groundY(position.x, position.z)
  for (const solid of SOLIDS) {
    if (solid.top > position.y + 0.075 || solid.top <= top) continue
    if (horizontalOverlap(position.x, position.z, BODY_RADIUS, solid)) top = solid.top
  }
  return top
}

export function moveBody(body: Body, dx: number, dz: number, jump: boolean, dt: number) {
  const p = body.position
  if (jump && body.grounded) {
    body.vy = JUMP_SPEED
    body.grounded = false
  }
  const floorBefore = groundY(p.x, p.z)
  const useRamp = body.grounded && Math.abs(p.y - floorBefore) < 0.09
  const nextX = p.x + dx
  if (!blocked(nextX, p.z, useRamp ? groundY(nextX, p.z) : p.y)) p.x = nextX
  const nextZ = p.z + dz
  if (!blocked(p.x, nextZ, useRamp ? groundY(p.x, nextZ) : p.y)) p.z = nextZ
  if (useRamp) p.y = groundY(p.x, p.z)

  const support = supportAt(p)
  body.vy -= GRAVITY * dt
  let nextY = p.y + body.vy * dt
  if (body.vy > 0) {
    for (const solid of SOLIDS) {
      if (solid.y < p.y + BODY_HEIGHT - 0.025 || solid.y >= nextY + BODY_HEIGHT) continue
      if (horizontalOverlap(p.x, p.z, BODY_RADIUS, solid)) {
        nextY = solid.y - BODY_HEIGHT
        body.vy = 0
      }
    }
  }
  body.grounded = nextY <= support
  p.y = body.grounded ? support : nextY
  if (body.grounded) body.vy = 0
}

export function direction(yaw: number, pitch = 0): Vec {
  const horizontal = Math.cos(pitch)
  return { x: -Math.sin(yaw) * horizontal, y: Math.sin(pitch), z: -Math.cos(yaw) * horizontal }
}

export function yawTo(from: Point, to: Point) {
  return Math.atan2(from.x - to.x, from.z - to.z)
}

export function eyeAt(position: Vec): Vec {
  return { x: position.x, y: position.y + EYE_HEIGHT, z: position.z }
}

export function pointAt(origin: Vec, ray: Vec, amount: number): Vec {
  return { x: origin.x + ray.x * amount, y: origin.y + ray.y * amount, z: origin.z + ray.z * amount }
}

export function rayBetween(origin: Vec, target: Vec) {
  const x = target.x - origin.x
  const y = target.y - origin.y
  const z = target.z - origin.z
  const length = Math.hypot(x, y, z) || 1
  return { ray: { x: x / length, y: y / length, z: z / length }, length }
}

const AXES = ['x', 'y', 'z'] as const

function rayBox(origin: Vec, ray: Vec, min: Vec, max: Vec, limit: number) {
  let near = 0
  let far = limit
  for (const axis of AXES) {
    const position = origin[axis]
    const step = ray[axis]
    if (Math.abs(step) < 1e-8) {
      if (position < min[axis] || position > max[axis]) return Infinity
      continue
    }
    const a = (min[axis] - position) / step
    const b = (max[axis] - position) / step
    near = Math.max(near, Math.min(a, b))
    far = Math.min(far, Math.max(a, b))
    if (near > far) return Infinity
  }
  return near
}

export function castWorld(origin: Vec, ray: Vec, limit: number) {
  let closest = limit
  for (const solid of SOLIDS) {
    const dx = origin.x - solid.x
    const dz = origin.z - solid.z
    if (Math.abs(dx) > solid.reachX + closest || Math.abs(dz) > solid.reachZ + closest) continue
    const { cos, sin } = solid
    const local = { x: dx * cos - dz * sin, y: origin.y - solid.y, z: dx * sin + dz * cos }
    const localRay = { x: ray.x * cos - ray.z * sin, y: ray.y, z: ray.x * sin + ray.z * cos }
    const corner = { x: -solid.w / 2, y: 0, z: -solid.d / 2 }
    const opposite = { x: solid.w / 2, y: solid.h, z: solid.d / 2 }
    closest = Math.min(closest, rayBox(local, localRay, corner, opposite, closest))
  }
  if (ray.y < -1e-6) {
    const flat = -origin.y / ray.y
    if (flat >= 0) closest = Math.min(closest, flat)
  }

  // Only the catwalk has terrain above the base floor. Test its local span.
  const rampStart = rayBox(origin, ray, { x: 13, y: 0, z: -13 }, { x: 23, y: 1.16, z: 7 }, closest)
  if (Number.isFinite(rampStart)) {
    const end = Math.min(closest, rampStart + 23)
    for (let at = rampStart; at <= end; at += 0.26) {
      const point = pointAt(origin, ray, at)
      if (point.y <= groundY(point.x, point.z)) return at
    }
  }
  return closest
}

export function clearSight(origin: Vec, target: Vec) {
  const { ray, length } = rayBetween(origin, target)
  return castWorld(origin, ray, length) >= length - 0.045
}

const HITBOXES: readonly [HitZone, Vec, Vec][] = [
  ['head', { x: -0.139, y: 1.52, z: -0.148 }, { x: 0.139, y: 1.82, z: 0.144 }],
  ['chest', { x: -0.235, y: 1.19, z: -0.159 }, { x: 0.235, y: 1.52, z: 0.16 }],
  ['stomach', { x: -0.203, y: 0.88, z: -0.143 }, { x: 0.203, y: 1.19, z: 0.153 }],
  ['arm', { x: -0.367, y: 1.12, z: -0.41 }, { x: -0.205, y: 1.48, z: 0.11 }],
  ['arm', { x: 0.205, y: 1.12, z: -0.36 }, { x: 0.367, y: 1.48, z: 0.12 }],
  ['leg', { x: -0.223, y: 0.05, z: -0.145 }, { x: -0.031, y: 0.88, z: 0.155 }],
  ['leg', { x: 0.031, y: 0.05, z: -0.145 }, { x: 0.223, y: 0.88, z: 0.155 }],
]

export function castHumanoid(origin: Vec, ray: Vec, limit: number, position: Vec, yaw: number) {
  const dx = origin.x - position.x
  const dz = origin.z - position.z
  if (Math.abs(dx) > limit + 0.5 || Math.abs(dz) > limit + 0.5) return null
  const cos = Math.cos(yaw)
  const sin = Math.sin(yaw)
  const local = { x: dx * cos - dz * sin, y: origin.y - position.y, z: dx * sin + dz * cos }
  const localRay = { x: ray.x * cos - ray.z * sin, y: ray.y, z: ray.x * sin + ray.z * cos }
  let result: { zone: HitZone; distance: number } | null = null
  for (const [zone, min, max] of HITBOXES) {
    const distance = rayBox(local, localRay, min, max, result?.distance ?? limit)
    if (Number.isFinite(distance) && distance < (result?.distance ?? limit)) result = { zone, distance }
  }
  return result
}

export function walkSegment(a: Point, b: Point, radius = NAV_RADIUS) {
  const steps = Math.ceil(distance2(a, b) / 0.38)
  for (let i = 0; i <= steps; i++) {
    const t = i / Math.max(steps, 1)
    const x = a.x + (b.x - a.x) * t
    const z = a.z + (b.z - a.z) * t
    if (blocked(x, z, groundY(x, z), radius)) return false
  }
  return true
}

interface HeapEntry { id: number; priority: number }

class MinHeap {
  private entries: HeapEntry[] = []

  push(entry: HeapEntry) {
    const entries = this.entries
    let index = entries.length
    entries.push(entry)
    while (index > 0) {
      const parent = (index - 1) >> 1
      if (entries[parent].priority <= entry.priority) break
      entries[index] = entries[parent]
      index = parent
    }
    entries[index] = entry
  }

  pop() {
    const entries = this.entries
    const first = entries[0]
    const last = entries.pop()
    if (!last || !entries.length) return first
    let index = 0
    while (index * 2 + 1 < entries.length) {
      const left = index * 2 + 1
      const right = left + 1
      const child = right < entries.length && entries[right].priority < entries[left].priority ? right : left
      if (entries[child].priority >= last.priority) break
      entries[index] = entries[child]
      index = child
    }
    entries[index] = last
    return first
  }
}

const CELL = 1
const COLS = Math.ceil((MAP_BOUNDS.x1 - MAP_BOUNDS.x0) / CELL)
const ROWS = Math.ceil((MAP_BOUNDS.z1 - MAP_BOUNDS.z0) / CELL)
const NEIGHBORS = [
  [-1, 0, 1], [1, 0, 1], [0, -1, 1], [0, 1, 1],
  [-1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [1, 1, Math.SQRT2],
] as const

export class Navigation {
  private cells = new Uint8Array(COLS * ROWS)
  private points: Point[] = []

  constructor() {
    for (let i = 0; i < this.cells.length; i++) {
      const point = {
        x: MAP_BOUNDS.x0 + (i % COLS + 0.5) * CELL,
        z: MAP_BOUNDS.z0 + (Math.floor(i / COLS) + 0.5) * CELL,
      }
      this.points.push(point)
      this.cells[i] = Number(!blocked(point.x, point.z, groundY(point.x, point.z), NAV_RADIUS))
    }
  }

  private nearest(point: Point, directlyReachable = false) {
    const cx = clamp(Math.floor((point.x - MAP_BOUNDS.x0) / CELL), 0, COLS - 1)
    const cz = clamp(Math.floor((point.z - MAP_BOUNDS.z0) / CELL), 0, ROWS - 1)
    let id = -1
    let best = Infinity
    for (let z = Math.max(0, cz - 3); z <= Math.min(ROWS - 1, cz + 3); z++) {
      for (let x = Math.max(0, cx - 3); x <= Math.min(COLS - 1, cx + 3); x++) {
        const cell = z * COLS + x
        if (!this.cells[cell]) continue
        const distance = distance2(point, this.points[cell])
        if (distance < best && (!directlyReachable || walkSegment(point, this.points[cell], BODY_RADIUS))) {
          best = distance
          id = cell
        }
      }
    }
    return id
  }

  path(from: Point, to: Point): Point[] {
    if (walkSegment(from, to)) return [{ x: to.x, z: to.z }]
    const start = this.nearest(from, true)
    const goal = this.nearest(to)
    if (start < 0 || goal < 0) return []
    const queue = new MinHeap()
    const costs = new Float32Array(this.cells.length).fill(Infinity)
    const prior = new Int32Array(this.cells.length).fill(-1)
    const closed = new Uint8Array(this.cells.length)
    costs[start] = 0
    queue.push({ id: start, priority: distance2(this.points[start], this.points[goal]) })

    for (let next = queue.pop(); next; next = queue.pop()) {
      const id = next.id
      if (id === goal) return this.route(prior, goal, from, to)
      if (closed[id]) continue
      closed[id] = 1
      const cx = id % COLS
      const cz = Math.floor(id / COLS)
      for (const [dx, dz, step] of NEIGHBORS) {
        const x = cx + dx
        const z = cz + dz
        if (x < 0 || z < 0 || x >= COLS || z >= ROWS) continue
        const neighbor = z * COLS + x
        if (!this.cells[neighbor] || closed[neighbor]) continue
        if (dx && dz && (!this.cells[cz * COLS + x] || !this.cells[z * COLS + cx])) continue
        const cost = costs[id] + step
        if (cost >= costs[neighbor]) continue
        costs[neighbor] = cost
        prior[neighbor] = id
        queue.push({ id: neighbor, priority: cost + distance2(this.points[neighbor], this.points[goal]) })
      }
    }
    return []
  }

  private route(prior: Int32Array, goal: number, from: Point, to: Point) {
    const path: Point[] = []
    for (let node = goal; node >= 0; node = prior[node]) path.push(this.points[node])
    path.reverse()
    if (walkSegment(path[path.length - 1], to)) path.push({ x: to.x, z: to.z })
    const smooth: Point[] = []
    let anchor = from
    for (let index = 0; index < path.length;) {
      let furthest = index
      // Follow the grid until a farther waypoint can be reached in a straight line.
      for (let candidate = Math.min(path.length - 1, index + 28); candidate > index; candidate--) {
        if (walkSegment(anchor, path[candidate])) {
          furthest = candidate
          break
        }
      }
      anchor = path[furthest]
      smooth.push(anchor)
      index = furthest + 1
    }
    return smooth
  }
}

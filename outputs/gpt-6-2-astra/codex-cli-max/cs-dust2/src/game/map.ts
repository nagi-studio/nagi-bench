import type { Point, Vec2 } from './types'

export type Rect = [number, number, number, number]
export type Obstacle = {
  x: number
  z: number
  w: number
  d: number
  bottom: number
  top: number
  cos: number
  sin: number
  extentX: number
  extentZ: number
}
export type Edge = { x: number; z: number; length: number; nx: number; nz: number }
export const regions: { name: string; rect: Rect }[] = [
  { name: 'A 点', rect: [23, 46, -34, -14] },
  { name: 'B 点', rect: [-46, -27, -35, -15] },
  { name: 'CT 出生点', rect: [-13, 13, -34, -20] },
  { name: 'A 小道', rect: [10, 27, -26, -19] },
  { name: 'A 坡道', rect: [11, 27, -33, -27] },
  { name: 'A 大道', rect: [32, 46, -16, 18] },
  { name: 'A 大拐角', rect: [18, 45, 10, 20] },
  { name: 'A 大门', rect: [14, 28, 15, 29] },
  { name: '猫道', rect: [9, 15, -22, 12] },
  { name: '猫道入口', rect: [3, 15, 7, 14] },
  { name: '中门', rect: [-5, 6, -23, -9] },
  { name: '中路', rect: [-5, 6, -12, 14] },
  { name: '中路上层', rect: [-8, 6, 10, 31] },
  { name: 'B 门', rect: [-31, -10, -31, -22] },
  { name: 'B 洞出口', rect: [-41, -34, -18, -4] },
  { name: 'B 洞', rect: [-42, -25, -7, 6] },
  { name: 'B 洞下层', rect: [-28, 0, -4, 2] },
  { name: 'B 洞入口', rect: [-35, -27, 3, 29] },
  { name: 'T 侧通道', rect: [-32, -8, 22, 31] },
  { name: 'T 出生点', rect: [-11, 29, 27, 44] },
]
export const sites = { A: { x: 34, z: -23 }, B: { x: -37, z: -24 } }
export const inside = (x: number, z: number, r: Rect) =>
  x >= r[0] && x <= r[1] && z >= r[2] && z <= r[3]
export function areaAt(x: number, z: number) {
  return regions.find((r) => inside(x, z, r.rect))?.name ?? 'Dust II'
}
export function ground(x: number, z: number) {
  const clamp = (v: number) => Math.min(1, Math.max(0, v))
  const cat = clamp((10 - z) / 23) * clamp((x - 5.5) / 4)
  const ctRamp = clamp((x - 12) / 11),
    north = clamp((-z - 20) / 8)
  const west = cat * (1 - north) + ctRamp * north,
    east = clamp((x - 15) / 8)
  return 1.8 * (west * (1 - east) + clamp((1 - z) / 16) * east)
}
export function siteAt(x: number, z: number) {
  return inside(x, z, [25, 44, -32, -16]) ? 'A' : inside(x, z, [-44, -29, -33, -17]) ? 'B' : ''
}
export const walls: Edge[] = []
const open = (x: number, z: number) => regions.some((r) => inside(x, z, r.rect))
const borders = new Map<string, number[]>()
for (let z = -36; z < 45; z++)
  for (let x = -47; x < 47; x++) {
    if (!open(x + 0.5, z + 0.5)) continue
    for (const [dx, dz] of [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ]) {
      if (open(x + 0.5 + dx, z + 0.5 + dz)) continue
      const line = dx ? x + (dx > 0 ? 1 : 0) : z + (dz > 0 ? 1 : 0)
      const key = [dx, dz, line].join(',')
      const set = borders.get(key) ?? []
      set.push(dx ? z : x)
      borders.set(key, set)
    }
  }
for (const [key, indices] of borders) {
  const [dx, dz, line] = key.split(',').map(Number)
  indices.sort((a, b) => a - b)
  for (let i = 0; i < indices.length;) {
    const start = indices[i++]
    let end = start + 1
    while (indices[i] === end) {
      end++
      i++
    }
    walls.push({
      x: dx ? line : (start + end) / 2,
      z: dz ? line : (start + end) / 2,
      length: end - start,
      nx: -dx,
      nz: -dz,
    })
  }
}
export const obstacles: Obstacle[] = []
export function obstacle(
  x: number,
  z: number,
  w: number,
  d: number,
  bottom: number,
  top: number,
  yaw = 0
) {
  const cos = Math.cos(yaw),
    sin = Math.sin(yaw)
  obstacles.push({
    x,
    z,
    w,
    d,
    bottom,
    top,
    cos,
    sin,
    extentX: (Math.abs(cos) * w + Math.abs(sin) * d) / 2,
    extentZ: (Math.abs(cos) * d + Math.abs(sin) * w) / 2,
  })
}
for (const s of walls)
  obstacle(
    s.x - s.nx * 1.05,
    s.z - s.nz * 1.05,
    s.nx ? 2.1 : s.length,
    s.nz ? 2.1 : s.length,
    -0.1,
    8 + ground(s.x, s.z)
  )
export const crates: {
  x: number
  z: number
  w: number
  d: number
  h: number
  level: number
  metal?: boolean
}[] = []
function crate(x: number, z: number, w = 1.8, d = 1.8, h = 1.8, level = 0, metal = false) {
  crates.push({ x, z, w, d, h, level, metal })
  const y = ground(x, z) + level
  obstacle(x, z, w, d, y, y + h)
}
crate(11.65, 28.35, 2.75, 2.15, 1.8)
crate(11.7, 28.35, 2.22, 1.85, 1.5, 1.8)
crate(8.9, 28.2, 2.3, 2.05, 1.45)
crate(27.45, 34.2, 2.1, 3.15, 2.0, 0, true)
crate(24.7, 18, 1.7, 1.6, 1.5)
crate(41.6, 8, 2, 3.2, 1.75)
crate(33.4, -21.6, 3.1, 2.35, 2.0, 0, true)
crate(33.6, -21.6, 2.7, 2.0, 1.8, 2, true)
crate(35.8, -21.8, 1.4, 2, 1.45)
crate(42, -29, 2.3, 2.3, 2.0)
crate(40, -29, 1.6, 1.8, 1.5)
crate(-35, -26, 3, 2.6, 2.0, 0, true)
crate(-35, -26, 2.6, 2.3, 1.7, 2, true)
crate(-38.1, -25.8, 2.2, 2.3, 1.65)
crate(-42.8, -18, 2.5, 1.8, 1.8)
crate(-0.9, -26, 2.5, 2, 1.65)
crate(-3.6, 5.6, 1.7, 2.5, 1.85)
crate(13.8, -8, 1.1, 2, 1.05)
crate(-39, 1.6, 2.3, 1.8, 1.7)
crate(-28.4, 12.3, 1.7, 2.7, 1.66)
export const gates = [
  { x: 20.6, z: 22.1, span: 14.8, r: 2.65, h: 2.7, top: 6.4, wood: true, style: 'long' },
  { x: 0.5, z: -15.1, span: 11.1, r: 2.3, h: 2.4, top: 5.8, wood: true, style: 'mid' },
  { x: -37.5, z: -9.8, span: 7.2, r: 2.25, h: 2.15, top: 5.2, wood: false, style: 'tunnel' },
]
export function gateLeaves(g: (typeof gates)[number]) {
  return [-1, 1].map((side) => {
    const yaw = side * 0.63,
      length = g.r * 0.9
    return {
      side,
      yaw,
      length,
      x: g.x + side * (g.r - 0.09) - (Math.sin(yaw) * length) / 2,
      z: g.z + 0.41 - (Math.cos(yaw) * length) / 2,
    }
  })
}
for (const g of gates) {
  const side = g.span / 2 - g.r
  for (const sign of [-1, 1]) obstacle(g.x + sign * (g.r + side / 2), g.z, side, 1.5, -0.1, g.top)
  for (let i = 0; i < 28; i++) {
    const x = (i + 0.5) / 14 - 1,
      opening = g.h + g.r * 0.84 * Math.sqrt(1 - x * x)
    obstacle(g.x + g.r * x, g.z, g.r / 14 + 0.002, 1.5, opening, g.top)
  }
  if (g.wood)
    for (const leaf of gateLeaves(g))
      obstacle(leaf.x, leaf.z, 0.23, leaf.length, 0, g.h + 1.17, leaf.yaw)
}
export const towers = [
  [9.4, 18.35, 3.75, 13.9],
  [-47, -30, 3.7, 10],
  [48, -45, 4.1, 11.2],
]
export const rooftops = [
  [5.3, 17.8, 5.1, 7.5, 5.1],
  [28.9, 8.1, 4.8, 8.8, 5.4],
  [16.8, 4.2, 4.8, 6.95, 6.3],
  [-10.9, 3.8, 6.8, 9.2, 6.7],
  [51, -20, 5, 8, 11],
  [-49, -8, 6, 7, 9],
  [17, -43, 7, 8, 6],
  [3.1, -45, 9, 5, 9],
]
export const palms = [
  [26.8, 19, 10, -1.13],
  [30.8, 17.4, 9.7, -0.82],
  [6.3, 22.6, 9.9, 1.15],
  [31.5, 32.5, 9.1, -0.65],
  [46.9, -5.8, 9.3, 0.9],
  [-45.9, -12.6, 9.2, -0.8],
  [-18, 16.5, 8.6, 0.7],
  [16.7, -35.6, 10.4, 1.2],
]
for (const [x, z, w, h] of towers) obstacle(x, z, w, w, 0, h)
for (const [x, z, w, h, d] of rooftops) obstacle(x, z, w, d, 0, h)
for (const [x, z, h] of palms) obstacle(x, z, 0.48, 0.48, 0, h)
export const roofs: Rect[] = [
  [-42, -25, -7, 6],
  [-28, -4.85, -4, 2],
  [-41, -34, -15, -4],
  [-34.98, -27, 4, 13],
]
for (const r of roofs)
  obstacle((r[0] + r[1]) / 2, (r[2] + r[3]) / 2, r[1] - r[0], r[3] - r[2], 4.5, 4.85)

export const radius = 0.31
export function canStand(x: number, z: number, y: number, body = 1.77, rad = radius) {
  if (!open(x, z) || ground(x, z) > y + 0.36) return false
  for (const b of obstacles) {
    if (b.top <= y + 0.08 || b.bottom >= y + body) continue
    const rx = x - b.x,
      rz = z - b.z
    if (Math.abs(rx) > b.extentX + rad || Math.abs(rz) > b.extentZ + rad) continue
    const dx = Math.max(Math.abs(rx * b.cos - rz * b.sin) - b.w / 2, 0),
      dz = Math.max(Math.abs(rx * b.sin + rz * b.cos) - b.d / 2, 0)
    if (dx * dx + dz * dz < rad * rad) return false
  }
  return true
}
export function support(x: number, z: number, y: number) {
  let floor = ground(x, z),
    ceiling = Infinity
  for (const b of obstacles) {
    const rx = x - b.x,
      rz = z - b.z
    if (
      Math.abs(rx * b.cos - rz * b.sin) > b.w / 2 + radius * 0.75 ||
      Math.abs(rx * b.sin + rz * b.cos) > b.d / 2 + radius * 0.75
    )
      continue
    if (b.top <= y + 0.24) floor = Math.max(floor, b.top)
    if (b.bottom >= y + 1.7) ceiling = Math.min(ceiling, b.bottom)
  }
  return { floor, ceiling }
}
export function rayBox(
  p: Point,
  d: Point,
  minX: number,
  minY: number,
  minZ: number,
  maxX: number,
  maxY: number,
  maxZ: number
) {
  let near = -Infinity,
    far = Infinity
  for (const [o, v, lo, hi] of [
    [p.x, d.x, minX, maxX],
    [p.y, d.y, minY, maxY],
    [p.z, d.z, minZ, maxZ],
  ]) {
    if (Math.abs(v) < 1e-8) {
      if (o < lo || o > hi) return Infinity
      continue
    }
    const a = (lo - o) / v,
      b = (hi - o) / v
    near = Math.max(near, Math.min(a, b))
    far = Math.min(far, Math.max(a, b))
    if (near > far) return Infinity
  }
  return far < 0 ? Infinity : Math.max(0, near)
}
export function wallDistance(p: Point, d: Point, limit: number) {
  let nearest = limit
  for (const b of obstacles) {
    if (Math.abs(b.x - p.x) > nearest + b.extentX || Math.abs(b.z - p.z) > nearest + b.extentZ)
      continue
    if (!b.sin) {
      nearest = Math.min(
        nearest,
        rayBox(p, d, b.x - b.w / 2, b.bottom, b.z - b.d / 2, b.x + b.w / 2, b.top, b.z + b.d / 2)
      )
      continue
    }
    const rx = p.x - b.x,
      rz = p.z - b.z
    const o = { x: rx * b.cos - rz * b.sin, y: p.y, z: rx * b.sin + rz * b.cos },
      v = { x: d.x * b.cos - d.z * b.sin, y: d.y, z: d.x * b.sin + d.z * b.cos }
    nearest = Math.min(nearest, rayBox(o, v, -b.w / 2, b.bottom, -b.d / 2, b.w / 2, b.top, b.d / 2))
  }
  // Short-walk platforms also occlude rays fired across a ramp.
  for (let t = 1.2; t < nearest; t += 1.2)
    if (p.y + d.y * t < ground(p.x + d.x * t, p.z + d.z * t)) return t
  return nearest
}
export function visible(a: Point, b: Point) {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    dz = b.z - a.z,
    dist = Math.hypot(dx, dy, dz)
  return (
    dist < 0.05 ||
    wallDistance(a, { x: dx / dist, y: dy / dist, z: dz / dist }, dist) >= dist - 0.08
  )
}

const W = 96,
  H = 84,
  OX = -48,
  OZ = -38
export const navigation: Uint8Array = new Uint8Array(W * H)
const world = (i: number) => ({ x: OX + (i % W) + 0.5, z: OZ + Math.floor(i / W) + 0.5 })
for (let i = 0; i < navigation.length; i++) {
  const p = world(i)
  navigation[i] = canStand(p.x, p.z, ground(p.x, p.z), 1.77, 0.43) ? 1 : 0
}
function nearest(p: Vec2) {
  const x = Math.max(0, Math.min(W - 1, Math.floor(p.x - OX))),
    z = Math.max(0, Math.min(H - 1, Math.floor(p.z - OZ)))
  if (navigation[z * W + x]) return z * W + x
  let best = -1,
    dist = Infinity
  for (let dz = -4; dz <= 4; dz++)
    for (let dx = -4; dx <= 4; dx++) {
      const i = (z + dz) * W + x + dx
      if (navigation[i] && dx * dx + dz * dz < dist) {
        best = i
        dist = dx * dx + dz * dz
      }
    }
  return best
}
export function clearWalk(a: Vec2, b: Vec2) {
  const count = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 0.45)
  for (let k = 1; k <= count; k++) {
    const x = a.x + ((b.x - a.x) * k) / count,
      z = a.z + ((b.z - a.z) * k) / count
    if (!canStand(x, z, ground(x, z), 1.77, 0.42)) return false
  }
  return true
}
// Eight-connected A* with corner checks. Smooth only segments with capsule clearance.
export function pathfind(from: Vec2, to: Vec2): Vec2[] {
  const start = nearest(from),
    goal = nearest(to)
  if (start < 0 || goal < 0) return []
  const target = world(goal)
  if (clearWalk(from, target)) return [target]
  const g = new Float32Array(W * H).fill(Infinity),
    parent = new Int16Array(W * H).fill(-1),
    closed = new Uint8Array(W * H)
  const pq: { i: number; f: number }[] = []
  function push(i: number, f: number) {
    let k = pq.length
    pq.push({ i, f })
    while (k) {
      const p = (k - 1) >> 1
      if (pq[p].f <= f) break
      pq[k] = pq[p]
      k = p
    }
    pq[k] = { i, f }
  }
  function pop() {
    const first = pq[0],
      last = pq.pop()!
    if (pq.length) {
      let k = 0
      while (k * 2 + 1 < pq.length) {
        let c = k * 2 + 1
        if (c + 1 < pq.length && pq[c + 1].f < pq[c].f) c++
        if (pq[c].f >= last.f) break
        pq[k] = pq[c]
        k = c
      }
      pq[k] = last
    }
    return first.i
  }
  g[start] = 0
  push(start, 0)
  while (pq.length) {
    const i = pop()
    if (closed[i]) continue
    if (i === goal) {
      const raw: Vec2[] = []
      for (let k = goal; k !== start; k = parent[k]) raw.push(world(k))
      raw.reverse()
      const result: Vec2[] = []
      let previous = from
      for (let k = 0; k < raw.length;) {
        let j = k
        while (j + 1 < raw.length && j - k < 14 && clearWalk(previous, raw[j + 1])) j++
        result.push(raw[j])
        previous = raw[j]
        k = j + 1
      }
      return result
    }
    closed[i] = 1
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      const n = i + dz * W + dx
      if (
        !navigation[n] ||
        closed[n] ||
        (dx && dz && (!navigation[i + dx] || !navigation[i + dz * W]))
      )
        continue
      const ng = g[i] + (dx && dz ? 1.4143 : 1)
      if (ng >= g[n]) continue
      parent[n] = i
      g[n] = ng
      const ax = Math.abs((n % W) - (goal % W)),
        az = Math.abs(Math.floor(n / W) - Math.floor(goal / W))
      push(n, ng + Math.max(ax, az) + 0.4142 * Math.min(ax, az))
    }
  }
  return []
}
export const teamSpawns = {
  T: [
    { x: 21.7, z: 42.35 },
    { x: 16.35, z: 30.1 },
    { x: 22.75, z: 26.3 },
    { x: 4, z: 33.5 },
    { x: -5, z: 34.7 },
  ],
  CT: [
    { x: 1.6, z: -29 },
    { x: 6.2, z: -28 },
    { x: -6.8, z: -27.4 },
    { x: 8.9, z: -31.5 },
    { x: -9.3, z: -30.5 },
  ],
}

// Dust2 map: a walkable-cell grid. Every region is carved out of solid rock, so
// collision, line of sight and pathfinding all reduce to exact grid queries and
// nobody can ever clip through a wall.

export const GRID = 64
export const CELL = 2
export const WALL_H = 5
export const HALF = (GRID * CELL) / 2

export type AreaName =
  | 'T Spawn' | 'Long A' | 'A Site' | 'Catwalk' | 'Mid' | 'Mid Doors'
  | 'B Tunnels' | 'B Site' | 'CT Spawn' | 'CT Ramp' | 'CT to A' | 'A Short'

export interface Rect { name: AreaName; x1: number; z1: number; x2: number; z2: number }

// Carved regions, in cell coordinates (inclusive). Their union is the walkable map.
export const AREAS: Rect[] = [
  { name: 'T Spawn',   x1: 2,  z1: 50, x2: 15, z2: 60 },
  { name: 'Long A',    x1: 14, z1: 22, x2: 21, z2: 52 },
  { name: 'A Site',    x1: 20, z1: 16, x2: 32, z2: 26 },
  { name: 'Catwalk',   x1: 21, z1: 26, x2: 33, z2: 34 },
  { name: 'Mid',       x1: 22, z1: 34, x2: 36, z2: 42 },
  { name: 'Mid Doors', x1: 28, z1: 36, x2: 32, z2: 42 },
  { name: 'B Site',    x1: 14, z1: 28, x2: 22, z2: 44 },
  { name: 'B Tunnels', x1: 16, z1: 42, x2: 34, z2: 48 },
  { name: 'CT Ramp',   x1: 28, z1: 42, x2: 42, z2: 50 },
  { name: 'CT Spawn',  x1: 40, z1: 46, x2: 52, z2: 58 },
  { name: 'CT to A',   x1: 36, z1: 28, x2: 42, z2: 48 },
  { name: 'A Short',   x1: 30, z1: 24, x2: 38, z2: 32 },
]

export interface Crate { x: number; z: number; w: number; d: number; h: number; kind: 'wood' | 'stone' }

/** Cover boxes placed by hand inside the sites and corridors. */
export const CRATES: Crate[] = [
  { x: 24, z: 19, w: 2, d: 2, h: 1.6, kind: 'wood' },
  { x: 29, z: 21, w: 2, d: 2, h: 1.6, kind: 'wood' },
  { x: 26, z: 23, w: 3, d: 2, h: 1.2, kind: 'stone' },
  { x: 22, z: 22, w: 2, d: 2, h: 1.9, kind: 'wood' },
  { x: 30, z: 18, w: 2, d: 2, h: 1.9, kind: 'wood' },
  { x: 17, z: 33, w: 2, d: 2, h: 1.5, kind: 'stone' },
  { x: 17, z: 38, w: 2, d: 2, h: 1.5, kind: 'stone' },
  { x: 19, z: 46, w: 2, d: 2, h: 1.4, kind: 'wood' },
  { x: 24, z: 46, w: 3, d: 2, h: 1.4, kind: 'wood' },
  { x: 30, z: 46, w: 2, d: 2, h: 1.4, kind: 'wood' },
  { x: 39, z: 34, w: 2, d: 2, h: 1.5, kind: 'stone' },
  { x: 46, z: 52, w: 2, d: 2, h: 1.6, kind: 'wood' },
  { x: 17, z: 26, w: 2, d: 2, h: 1.7, kind: 'stone' },
  { x: 24, z: 38, w: 2, d: 2, h: 1.3, kind: 'wood' },
  { x: 34, z: 40, w: 2, d: 2, h: 1.3, kind: 'wood' },
]

export const T_SPAWN: [number, number][] = [
  [4, 56], [6, 58], [8, 55], [10, 58], [12, 56],
]
export const CT_SPAWN: [number, number][] = [
  [43, 55], [45, 57], [47, 54], [49, 56], [51, 53],
]
export const A_SITE_CENTER: [number, number] = [26, 21]
export const B_SITE_CENTER: [number, number] = [18, 33]
export const MID_DOOR_CELLS: [number, number][] = [
  [30, 36], [30, 37], [30, 38], [30, 39], [30, 40], [30, 41],
]

export const DOOR_OPEN = 0.9 // seconds for the mid doors to swing open

/** cell index helpers */
export const cellOf = (x: number, z: number): [number, number] => [
  Math.floor((x + HALF) / CELL),
  Math.floor((z + HALF) / CELL),
]
export const worldOf = (cx: number, cz: number): [number, number] => [
  cx * CELL - HALF + CELL / 2,
  cz * CELL - HALF + CELL / 2,
]

export class DustMap {
  /** 1 = walkable, 0 = solid rock */
  readonly cells: Uint8Array
  /** area index per cell (-1 = none) */
  readonly areaOf: Int8Array
  /** doors: 0 closed, 1 open */
  readonly doors: Float32Array

  constructor() {
    this.cells = new Uint8Array(GRID * GRID)
    this.areaOf = new Int8Array(GRID * GRID).fill(-1)
    this.doors = new Float32Array(MID_DOOR_CELLS.length)
    for (const r of AREAS) {
      for (let z = r.z1; z <= r.z2; z++) {
        for (let x = r.x1; x <= r.x2; x++) {
          if (x < 0 || z < 0 || x >= GRID || z >= GRID) continue
          this.cells[z * GRID + x] = 1
        }
      }
    }
    // area labels (last writer wins for overlapping rectangles)
    AREAS.forEach((r, i) => {
      for (let z = r.z1; z <= r.z2; z++) {
        for (let x = r.x1; x <= r.x2; x++) {
          if (x < 0 || z < 0 || x >= GRID || z >= GRID) continue
          this.areaOf[z * GRID + x] = i
        }
      }
    })
    // Mid Doors are a real doorway: a slab that blocks the gap until it opens.
    for (const [x, z] of MID_DOOR_CELLS) this.cells[z * GRID + x] = 1
  }

  cellWalkable(cx: number, cz: number): boolean {
    if (cx < 0 || cz < 0 || cx >= GRID || cz >= GRID) return false
    return this.cells[cz * GRID + cx] === 1
  }

  doorIndexAt(cx: number, cz: number): number {
    for (let i = 0; i < MID_DOOR_CELLS.length; i++) {
      if (MID_DOOR_CELLS[i][0] === cx && MID_DOOR_CELLS[i][1] === cz) return i
    }
    return -1
  }

  /** world-space solidity test used by movement and bullets */
  solidAt(x: number, z: number, y = 1): boolean {
    const [cx, cz] = cellOf(x, z)
    if (!this.cellWalkable(cx, cz)) return true
    const di = this.doorIndexAt(cx, cz)
    if (di >= 0 && this.doors[di] < 0.55 && y < 2.4) return true
    for (const c of CRATES) {
      if (y < c.h && Math.abs(x - c.x) < c.w / 2 && Math.abs(z - c.z) < c.d / 2) return true
    }
    return false
  }

  /** grid line of sight between two world points (walls block, low crates do not) */
  lineOfSight(ax: number, az: number, bx: number, bz: number, eyeY = 1.5): boolean {
    const steps = Math.ceil(Math.hypot(bx - ax, bz - az) / (CELL * 0.5))
    for (let i = 1; i < steps; i++) {
      const t = i / steps
      const x = ax + (bx - ax) * t
      const z = az + (bz - az) * t
      const [cx, cz] = cellOf(x, z)
      if (!this.cellWalkable(cx, cz)) return false
      const di = this.doorIndexAt(cx, cz)
      if (di >= 0 && this.doors[di] < 0.55 && eyeY < 2.4) return false
    }
    return true
  }

  /** BFS shortest path over walkable cells; returns world-space waypoints. */
  path(ax: number, az: number, bx: number, bz: number): [number, number][] {
    const [sx, sz] = cellOf(ax, az)
    const [gx, gz] = cellOf(bx, bz)
    if (!this.cellWalkable(gx, gz)) return []
    const start = sz * GRID + sx
    const goal = gz * GRID + gx
    const prev = new Int32Array(GRID * GRID).fill(-1)
    const seen = new Uint8Array(GRID * GRID)
    const queue: number[] = [start]
    seen[start] = 1
    let head = 0
    while (head < queue.length) {
      const cur = queue[head++]
      if (cur === goal) break
      const cx = cur % GRID
      const cz = (cur - cx) / GRID
      const nb = [[cx + 1, cz], [cx - 1, cz], [cx, cz + 1], [cx, cz - 1]]
      for (const [nx, nz] of nb) {
        if (nx < 0 || nz < 0 || nx >= GRID || nz >= GRID) continue
        const id = nz * GRID + nx
        if (seen[id]) continue
        if (!this.cellWalkable(nx, nz)) continue
        seen[id] = 1
        prev[id] = cur
        queue.push(id)
      }
    }
      if (!seen[goal]) return []
      const out: number[] = []
      let cur = goal
      let guard = 0
      while (cur !== -1 && cur !== start) {
        if (guard++ > GRID * GRID + 8 || cur < 0 || cur >= GRID * GRID) break
        out.push(cur)
        cur = prev[cur]
      }
    out.reverse()
    // string-pulling: drop waypoints that a straight walk can skip
    const pts = out.map((id) => {
      const cx = id % GRID
      const cz = (id - cx) / GRID
      return worldOf(cx, cz) as [number, number]
    })
    pts.push([bx, bz])
    const pulled: [number, number][] = []
    let i = 0
    while (i < pts.length - 1) {
      let j = pts.length - 1
      while (j > i + 1) {
        if (this.clearWalk(pts[i][0], pts[i][1], pts[j][0], pts[j][1])) break
        j--
      }
      pulled.push(pts[j])
      i = j
    }
    if (pts.length > 0) {
      const last = pts[pts.length - 1]
      const tail = pulled[pulled.length - 1]
      if (!tail || tail[0] !== last[0] || tail[1] !== last[1]) pulled.push(last)
    }
    return pulled
  }

  /** can an agent of the given radius walk straight from a to b? */
  clearWalk(ax: number, az: number, bx: number, bz: number, radius = 0.45): boolean {
    const dist = Math.hypot(bx - ax, bz - az)
    const steps = Math.ceil(dist / 0.35)
    if (steps === 0) return true
    const nx = -(bz - az) / dist * radius
    const nz = (bx - ax) / dist * radius
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = ax + (bx - ax) * t
      const z = az + (bz - az) * t
      if (this.solidAt(x + nx, z + nz, 1) || this.solidAt(x - nx, z - nz, 1)) return false
    }
    return true
  }

  randomPointIn(area: AreaName, rnd: () => number): [number, number] {
    const r = AREAS.find((a) => a.name === area)!
    for (let i = 0; i < 40; i++) {
      const cx = r.x1 + Math.floor(rnd() * (r.x2 - r.x1 + 1))
      const cz = r.z1 + Math.floor(rnd() * (r.z2 - r.z1 + 1))
      if (this.cellWalkable(cx, cz)) return worldOf(cx, cz)
    }
    return worldOf((r.x1 + r.x2) >> 1, (r.z1 + r.z2) >> 1)
  }
}

/* ============================================================================
   A* pathfinding over the tile grid.
   NOTE: every score lookup uses the nullish operator (??) and the path
   reconstruction is bounded by a visited set + iteration cap. A start-node
   gScore of 0 is falsy; using `|| Infinity` here would re-parent the start into
   a cycle and hang the reconstruction loop — a bug that froze a whole benchmark
   site tab once. We deliberately avoid it.
   ========================================================================== */
import { GRID, HALF, cellAt, isFloor, tileToWorld, worldToTile, buildMap, Cell } from './map'

const idx = (x: number, z: number) => z * GRID + x
const inB = (x: number, z: number) => x >= 0 && x < GRID && z >= 0 && z < GRID

// 8-way neighbour offsets; diagonals are only allowed when both orthogonals are
// open, so bots never squeeze through a corner.
const DIRS = [
  [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
  [1, 1, 1.4142], [1, -1, 1.4142], [-1, 1, 1.4142], [-1, -1, 1.4142],
] as const

function passable(x: number, z: number): boolean {
  return inB(x, z) && cellAt(x, z) === Cell.FLOOR
}

class MinHeap {
  private items: number[] = []
  private score: Map<number, number> = new Map()
  push(id: number, f: number) {
    this.items.push(id)
    this.score.set(id, f)
    let i = this.items.length - 1
    while (i > 0) {
      const p = (i - 1) >> 1
      if ((this.score.get(this.items[p]) ?? Infinity) <= (this.score.get(this.items[i]) ?? Infinity)) break
      ;[this.items[p], this.items[i]] = [this.items[i], this.items[p]]
      i = p
    }
  }
  pop(): number | undefined {
    const arr = this.items
    if (!arr.length) return undefined
    const top = arr[0]
    const last = arr.pop()!
    if (arr.length) {
      arr[0] = last
      let i = 0
      for (;;) {
        const l = i * 2 + 1,
          r = l + 1
        let m = i
        if (l < arr.length && (this.score.get(arr[l]) ?? Infinity) < (this.score.get(arr[m]) ?? Infinity)) m = l
        if (r < arr.length && (this.score.get(arr[r]) ?? Infinity) < (this.score.get(arr[m]) ?? Infinity)) m = r
        if (m === i) break
        ;[arr[m], arr[i]] = [arr[i], arr[m]]
        i = m
      }
    }
    this.score.delete(top)
    return top
  }
  get size() {
    return this.items.length
  }
}

// Returns a list of world-space waypoints from (sx,sz) to (tx,tz), or null if
// unreachable. Waypoints are tile centres; the caller follows them in order.
export function findPath(
  sx: number,
  sz: number,
  tx: number,
  tz: number,
  maxNodes = 4000
): { x: number; z: number }[] | null {
  buildMap()
  let x0 = worldToTile(sx),
    z0 = worldToTile(sz)
  let x1 = worldToTile(tx),
    z1 = worldToTile(tz)
  if (!passable(x1, z1)) {
    // nudge the goal to the nearest passable tile (e.g. a crate-adjacent target)
    const near = nearestFloor(x1, z1)
    if (!near) return null
    x1 = near.x
    z1 = near.z
  }
  if (!passable(x0, z0)) {
    const near = nearestFloor(x0, z0)
    if (!near) return null
    x0 = near.x
    z0 = near.z
  }
  const start = idx(x0, z0),
    goal = idx(x1, z1)
  if (start === goal) return [{ x: tileToWorld(x1), z: tileToWorld(z1) }]

  const gScore = new Map<number, number>()
  const cameFrom = new Map<number, number>()
  const closed = new Set<number>()
  const open = new MinHeap()
  gScore.set(start, 0)
  open.push(start, heuristic(x0, z0, x1, z1))

  let expanded = 0
  while (open.size && expanded < maxNodes) {
    const cur = open.pop()!
    if (closed.has(cur)) continue
    closed.add(cur)
    expanded++
    if (cur === goal) break
    const cx = cur % GRID,
      cz = (cur / GRID) | 0
    const cg = gScore.get(cur) ?? Infinity
    for (const [dx, dz, cost] of DIRS) {
      const nx = cx + dx,
        nz = cz + dz
      if (!passable(nx, nz)) continue
      // block diagonal corner cutting
      if (dx !== 0 && dz !== 0) {
        if (!passable(cx + dx, cz) || !passable(cx, cz + dz)) continue
      }
      const nid = idx(nx, nz)
      if (closed.has(nid)) continue
      const tentative = cg + cost
      if (tentative < (gScore.get(nid) ?? Infinity)) {
        gScore.set(nid, tentative)
        cameFrom.set(nid, cur)
        open.push(nid, tentative + heuristic(nx, nz, x1, z1))
      }
    }
  }

  if (!closed.has(goal)) return null

  // reconstruct with a hard bound (cameFrom is a tree, but stay defensive)
  const rev: number[] = []
  let node = goal
  let guard = 0
  while (node !== start && guard++ < GRID * GRID) {
    rev.push(node)
    const prev = cameFrom.get(node)
    if (prev === undefined) break
    node = prev
  }
  rev.push(start)
  rev.reverse()

  // simplify: drop collinear waypoints
  const pts: { x: number; z: number }[] = []
  for (let i = 0; i < rev.length; i++) {
    const id = rev[i]
    const wx = tileToWorld(id % GRID),
      wz = tileToWorld((id / GRID) | 0)
    if (i > 0 && i < rev.length - 1) {
      const pid = rev[i - 1],
        nid = rev[i + 1]
      const px = pid % GRID,
        pz = (pid / GRID) | 0
      const nx2 = nid % GRID,
        nz2 = (nid / GRID) | 0
      const cx2 = id % GRID,
        cz2 = (id / GRID) | 0
      // collinear if direction unchanged
      const d1x = Math.sign(cx2 - px),
        d1z = Math.sign(cz2 - pz)
      const d2x = Math.sign(nx2 - cx2),
        d2z = Math.sign(nz2 - cz2)
      if (d1x === d2x && d1z === d2z) continue
    }
    pts.push({ x: wx, z: wz })
  }
  return pts
}

function heuristic(ax: number, az: number, bx: number, bz: number): number {
  const dx = Math.abs(ax - bx),
    dz = Math.abs(az - bz)
  return (dx + dz) + (1.4142 - 2) * Math.min(dx, dz)
}

function nearestFloor(x: number, z: number): { x: number; z: number } | null {
  for (let r = 1; r < 8; r++) {
    for (let dz = -r; dz <= r; dz++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue
        if (passable(x + dx, z + dz)) return { x: x + dx, z: z + dz }
      }
  }
  return null
}

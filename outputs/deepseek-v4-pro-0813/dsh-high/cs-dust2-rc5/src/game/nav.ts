import {
  CELL,
  GRID_H,
  GRID_W,
  MOVEMENT_BLOCKERS,
  WORLD_MIN_X,
  WORLD_MIN_Z,
  restingHeight,
} from './mapData'
import { PLAYER_RADIUS, STEP_UP } from './config'

export interface NavPoint {
  x: number
  z: number
}

export interface NavNode {
  i: number
  j: number
}

function insideBlockerXZ(x: number, z: number): boolean {
  for (const b of MOVEMENT_BLOCKERS) {
    // expand by player radius so paths keep a margin from walls
    const halfX = b.sx / 2 + PLAYER_RADIUS
    const halfZ = b.sz / 2 + PLAYER_RADIUS
    if (x >= b.cx - halfX && x <= b.cx + halfX && z >= b.cz - halfZ && z <= b.cz + halfZ) {
      return true
    }
  }
  return false
}

export class NavGrid {
  readonly w = GRID_W
  readonly h = GRID_H
  private blocked: Uint8Array
  private height: Float32Array

  constructor() {
    this.blocked = new Uint8Array(this.w * this.h)
    this.height = new Float32Array(this.w * this.h)
    for (let j = 0; j < this.h; j++) {
      for (let i = 0; i < this.w; i++) {
        const { x, z } = this.cellCenter(i, j)
        const idx = j * this.w + i
        this.blocked[idx] = insideBlockerXZ(x, z) ? 1 : 0
        this.height[idx] = restingHeight(x, z)
      }
    }
  }

  cellCenter(i: number, j: number): NavPoint {
    return { x: WORLD_MIN_X + (i + 0.5) * CELL, z: WORLD_MIN_Z + (j + 0.5) * CELL }
  }

  worldToCell(x: number, z: number): NavNode {
    return {
      i: Math.floor((x - WORLD_MIN_X) / CELL),
      j: Math.floor((z - WORLD_MIN_Z) / CELL),
    }
  }

  inBounds(i: number, j: number): boolean {
    return i >= 0 && i < this.w && j >= 0 && j < this.h
  }

  isWalkable(i: number, j: number): boolean {
    if (!this.inBounds(i, j)) return false
    return this.blocked[j * this.w + i] === 0
  }

  heightAt(i: number, j: number): number {
    if (!this.inBounds(i, j)) return 0
    return this.height[j * this.w + i]
  }

  /** Nearest walkable cell center to a world point (spiral search). */
  nearestWalkable(x: number, z: number): NavPoint {
    const c = this.worldToCell(x, z)
    for (let r = 0; r < 60; r++) {
      for (let dj = -r; dj <= r; dj++) {
        for (let di = -r; di <= r; di++) {
          if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue
          const i = c.i + di
          const j = c.j + dj
          if (this.isWalkable(i, j)) return this.cellCenter(i, j)
        }
      }
    }
    return { x, z }
  }

  /**
   * A* path from (sx,sz) to (tx,tz), returned as world-space waypoints
   * (cell centres). Uses 8-connectivity with a corner-cut rule and a step
   * height limit so AI never walks off ledges or up walls.
   */
  findPath(sx: number, sz: number, tx: number, tz: number): NavPoint[] {
    const start = this.worldToCell(sx, sz)
    const goal = this.worldToCell(tx, tz)
    if (!this.isWalkable(start.i, start.j)) {
      const n = this.nearestWalkable(sx, sz)
      return this.findPath(n.x, n.z, tx, tz)
    }
    if (!this.isWalkable(goal.i, goal.j)) {
      const n = this.nearestWalkable(tx, tz)
      return this.findPath(sx, sz, n.x, n.z)
    }
    if (start.i === goal.i && start.j === goal.j) {
      return [this.cellCenter(start.i, start.j)]
    }

    const w = this.w
    const came = new Int32Array(this.w * this.h).fill(-1)
    const gScore = new Float32Array(this.w * this.h).fill(Infinity)
    const startIdx = start.j * w + start.i
    const goalIdx = goal.j * w + goal.i
    gScore[startIdx] = 0

    // simple binary heap of [f, idx]
    const open: number[][] = []
    const push = (f: number, idx: number) => {
      open.push([f, idx])
      let c = open.length - 1
      while (c > 0) {
        const p = (c - 1) >> 1
        if (open[p][0] <= open[c][0]) break
        ;[open[p], open[c]] = [open[c], open[p]]
        c = p
      }
    }
    const pop = (): number => {
      const top = open[0][1]
      const last = open.pop()!
      if (open.length > 0) {
        open[0] = last
        let c = 0
        for (;;) {
          const l = c * 2 + 1
          const r = l + 1
          let m = c
          if (l < open.length && open[l][0] < open[m][0]) m = l
          if (r < open.length && open[r][0] < open[m][0]) m = r
          if (m === c) break
          ;[open[m], open[c]] = [open[c], open[m]]
          c = m
        }
      }
      return top
    }

    const hx = (idx: number) => {
      const i = idx % w
      const j = (idx / w) | 0
      const gi = goal.i
      const gj = goal.j
      return Math.hypot(i - gi, j - gj)
    }

    push(hx(startIdx), startIdx)

    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1],
    ]

    while (open.length > 0) {
      const idx = pop()
      if (idx === goalIdx) break
      const i = idx % w
      const j = (idx / w) | 0
      const curG = gScore[idx]
      for (const [di, dj] of dirs) {
        const ni = i + di
        const nj = j + dj
        if (!this.isWalkable(ni, nj)) continue
        // corner-cut rule for diagonal moves
        if (di !== 0 && dj !== 0) {
          if (!this.isWalkable(i + di, j) || !this.isWalkable(i, j + dj)) continue
        }
        const nIdx = nj * w + ni
        const dh = Math.abs(this.height[nIdx] - this.height[idx])
        if (dh > STEP_UP) continue
        const stepCost = di !== 0 && dj !== 0 ? 1.4142 : 1
        const ng = curG + stepCost
        if (ng < gScore[nIdx]) {
          gScore[nIdx] = ng
          came[nIdx] = idx
          push(ng + hx(nIdx), nIdx)
        }
      }
    }

    if (came[goalIdx] === -1) return []

    // reconstruct
    const cells: NavNode[] = []
    let cur = goalIdx
    while (cur !== -1) {
      cells.push({ i: cur % w, j: (cur / w) | 0 })
      if (cur === startIdx) break
      cur = came[cur]
    }
    cells.reverse()
    return cells.map((c) => this.cellCenter(c.i, c.j))
  }
}

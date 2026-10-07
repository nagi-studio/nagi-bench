import { CELL, COLS, ROWS } from '../config.ts'
import { LAYOUT, cellCenter, worldToCell } from '../map/layout.ts'
import type { Vec2 } from '../core/mathUtil.ts'

/** 中门格子代价更高：鼓励绕行，但仍可通过（AI 会先开门） */
const DOOR_COST = 3
const BLOCKED = '#xl'
const SQRT2 = Math.SQRT2
const DIRS: [number, number][] = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
]

/** 二叉最小堆（A* 开放列表） */
class MinHeap {
  private keys: number[] = []
  private vals: number[] = []

  get size(): number {
    return this.keys.length
  }

  push(key: number, val: number): void {
    const { keys, vals } = this
    keys.push(key)
    vals.push(val)
    let i = keys.length - 1
    while (i > 0) {
      const p = (i - 1) >> 1
      if (keys[p] <= keys[i]) break
      this.swap(i, p)
      i = p
    }
  }

  pop(): number {
    const { keys, vals } = this
    const top = vals[0]
    const lastKey = keys.pop() as number
    const lastVal = vals.pop() as number
    if (keys.length > 0) {
      keys[0] = lastKey
      vals[0] = lastVal
      let i = 0
      for (;;) {
        const l = i * 2 + 1
        const r = l + 1
        let m = i
        if (l < keys.length && keys[l] < keys[m]) m = l
        if (r < keys.length && keys[r] < keys[m]) m = r
        if (m === i) break
        this.swap(i, m)
        i = m
      }
    }
    return top
  }

  private swap(a: number, b: number): void {
    const k = this.keys[a]
    this.keys[a] = this.keys[b]
    this.keys[b] = k
    const v = this.vals[a]
    this.vals[a] = this.vals[b]
    this.vals[b] = v
  }
}

/**
 * 导航网格：直接复用地图布局的格子（每格 2m）。
 * 箱子 / 矮墙 / 墙体不可通行；中门格子可通行但代价更高。
 */
export class NavGrid {
  readonly walk = new Uint8Array(COLS * ROWS)
  readonly door = new Uint8Array(COLS * ROWS)

  constructor(layout: string[] = LAYOUT) {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const ch = layout[r][c]
        const i = r * COLS + c
        if (!BLOCKED.includes(ch)) this.walk[i] = 1
        if (ch === 'D') this.door[i] = 1
      }
    }
  }

  isWalkable(c: number, r: number): boolean {
    return c >= 0 && r >= 0 && c < COLS && r < ROWS && this.walk[r * COLS + c] === 1
  }

  /** 找到离 (c,r) 最近的可行走格子索引，找不到返回 -1 */
  nearestWalkable(c: number, r: number): number {
    if (this.isWalkable(c, r)) return r * COLS + c
    for (let k = 1; k <= 6; k++) {
      for (let dr = -k; dr <= k; dr++) {
        for (let dc = -k; dc <= k; dc++) {
          if (Math.max(Math.abs(dr), Math.abs(dc)) !== k) continue
          if (this.isWalkable(c + dc, r + dr)) return (r + dr) * COLS + (c + dc)
        }
      }
    }
    return -1
  }

  /**
   * A* 寻路，返回经过 LOS 平滑后的世界坐标路点（不含起点）。
   * 找不到路径时返回空数组。
   */
  findPath(from: Vec2, to: Vec2): Vec2[] {
    const a = worldToCell(from.x, from.z)
    const b = worldToCell(to.x, to.z)
    const start = this.nearestWalkable(a.c, a.r)
    const goal = this.nearestWalkable(b.c, b.r)
    if (start < 0 || goal < 0) return []
    if (start === goal) return [cellCenter(goal % COLS, Math.floor(goal / COLS))]

    const N = COLS * ROWS
    const g = new Float32Array(N).fill(Infinity)
    const came = new Int32Array(N).fill(-1)
    const closed = new Uint8Array(N)
    const open = new MinHeap()
    const gc = goal % COLS
    const gr = Math.floor(goal / COLS)
    const h = (i: number): number => {
      const dx = Math.abs((i % COLS) - gc)
      const dy = Math.abs(Math.floor(i / COLS) - gr)
      return Math.max(dx, dy) + (SQRT2 - 1) * Math.min(dx, dy)
    }

    g[start] = 0
    open.push(h(start), start)
    while (open.size > 0) {
      const cur = open.pop()
      if (closed[cur]) continue
      if (cur === goal) break
      closed[cur] = 1
      const cc = cur % COLS
      const cr = Math.floor(cur / COLS)
      for (const [dc, dr] of DIRS) {
        const nc = cc + dc
        const nr = cr + dr
        if (!this.isWalkable(nc, nr)) continue
        // 斜向移动时两侧必须可通行，避免擦墙角
        if (dc !== 0 && dr !== 0 && (!this.isWalkable(cc + dc, cr) || !this.isWalkable(cc, cr + dr))) continue
        const n = nr * COLS + nc
        const step = (dc !== 0 && dr !== 0 ? SQRT2 : 1) * (this.door[n] ? DOOR_COST : 1)
        const ng = g[cur] + step
        if (ng < g[n]) {
          g[n] = ng
          came[n] = cur
          open.push(ng + h(n), n)
        }
      }
    }
    if (came[goal] < 0) return []

    const cells: number[] = []
    for (let p = goal; p !== -1 && p !== start; p = came[p]) cells.push(p)
    cells.reverse()
    const pts = cells.map((i) => cellCenter(i % COLS, Math.floor(i / COLS)))
    return this.smooth(from, pts)
  }

  /** 视线穿越法：从当前锚点尽量直线跳到最远的可见路点，减少折线。 */
  private smooth(from: Vec2, pts: Vec2[]): Vec2[] {
    const out: Vec2[] = []
    let anchor = from
    let i = 0
    while (i < pts.length) {
      let j = pts.length - 1
      while (j > i && !this.lineWalkable(anchor, pts[j])) j--
      out.push(pts[j])
      anchor = pts[j]
      i = j + 1
    }
    return out
  }

  private lineWalkable(a: Vec2, b: Vec2): boolean {
    const dx = b.x - a.x
    const dz = b.z - a.z
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / (CELL * 0.5)))
    for (let s = 1; s < steps; s++) {
      const t = s / steps
      const p = worldToCell(a.x + dx * t, a.z + dz * t)
      if (!this.isWalkable(p.c, p.r)) return false
    }
    return true
  }
}

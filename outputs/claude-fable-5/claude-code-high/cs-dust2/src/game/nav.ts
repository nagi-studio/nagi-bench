import * as THREE from 'three'
import { CELL, GRID, GameMap } from './map'
import type { PhysicsWorld } from './physics'

const HALF = GRID / 2

/** Grid A* with octile heuristic + string-pulling smoothing. */
export class Nav {
  private map: GameMap
  private physics: PhysicsWorld
  private walkable: Uint8Array

  constructor(map: GameMap, physics: PhysicsWorld) {
    this.map = map
    this.physics = physics
    this.walkable = new Uint8Array(GRID * GRID)
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        this.walkable[r * GRID + c] = map.isWalkableCell(c, r) ? 1 : 0
      }
    }
  }

  private ok(c: number, r: number): boolean {
    return c >= 0 && r >= 0 && c < GRID && r < GRID && this.walkable[r * GRID + c] === 1
  }

  private nearestWalkable(c: number, r: number): [number, number] | null {
    if (this.ok(c, r)) return [c, r]
    for (let rad = 1; rad <= 6; rad++) {
      for (let dr = -rad; dr <= rad; dr++) {
        for (let dc = -rad; dc <= rad; dc++) {
          if (Math.max(Math.abs(dc), Math.abs(dr)) !== rad) continue
          if (this.ok(c + dc, r + dr)) return [c + dc, r + dr]
        }
      }
    }
    return null
  }

  findPath(from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3[] | null {
    const s = this.nearestWalkable(...this.map.worldToCell(from.x, from.z))
    const e = this.nearestWalkable(...this.map.worldToCell(to.x, to.z))
    if (!s || !e) return null
    const cells = this.aStar(s[0], s[1], e[0], e[1])
    if (!cells) return null

    const pts: THREE.Vector3[] = cells.map(i => this.map.cellCenter(i % GRID, Math.floor(i / GRID)))
    pts.push(new THREE.Vector3(to.x, 0, to.z))

    // string pulling
    const smoothed: THREE.Vector3[] = []
    let i = 0
    const start = new THREE.Vector3(from.x, 0, from.z)
    let cur = start
    while (i < pts.length) {
      let j = pts.length - 1
      let found = i
      for (; j > i; j--) {
        if (this.physics.walkClear(cur, pts[j], 0.45)) { found = j; break }
      }
      cur = pts[found]
      smoothed.push(cur)
      i = found + 1
    }
    return smoothed
  }

  private aStar(sc: number, sr: number, ec: number, er: number): number[] | null {
    const n = GRID * GRID
    const g = new Float32Array(n).fill(Infinity)
    const came = new Int32Array(n).fill(-1)
    const closed = new Uint8Array(n)
    const start = sr * GRID + sc
    const end = er * GRID + ec
    g[start] = 0

    // binary heap of [f, idx]
    const heapF: number[] = []
    const heapI: number[] = []
    const push = (f: number, idx: number) => {
      heapF.push(f); heapI.push(idx)
      let i = heapF.length - 1
      while (i > 0) {
        const p = (i - 1) >> 1
        if (heapF[p] <= heapF[i]) break
        ;[heapF[p], heapF[i]] = [heapF[i], heapF[p]]
        ;[heapI[p], heapI[i]] = [heapI[i], heapI[p]]
        i = p
      }
    }
    const pop = (): number => {
      const top = heapI[0]
      const lf = heapF.pop()!, li = heapI.pop()!
      if (heapF.length > 0) {
        heapF[0] = lf; heapI[0] = li
        let i = 0
        for (;;) {
          const l = i * 2 + 1, r = l + 1
          let m = i
          if (l < heapF.length && heapF[l] < heapF[m]) m = l
          if (r < heapF.length && heapF[r] < heapF[m]) m = r
          if (m === i) break
          ;[heapF[m], heapF[i]] = [heapF[i], heapF[m]]
          ;[heapI[m], heapI[i]] = [heapI[i], heapI[m]]
          i = m
        }
      }
      return top
    }
    const h = (idx: number) => {
      const dc = Math.abs((idx % GRID) - ec)
      const dr = Math.abs(Math.floor(idx / GRID) - er)
      return Math.max(dc, dr) + 0.414 * Math.min(dc, dr)
    }

    push(h(start), start)
    let expansions = 0
    while (heapF.length > 0 && expansions < 8000) {
      const cur = pop()
      if (cur === end) {
        const path: number[] = []
        let c = end
        while (c !== -1) { path.push(c); c = came[c] }
        path.reverse()
        return path
      }
      if (closed[cur]) continue
      closed[cur] = 1
      expansions++
      const cc = cur % GRID, cr = Math.floor(cur / GRID)
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dc === 0 && dr === 0) continue
          const nc = cc + dc, nr = cr + dr
          if (!this.ok(nc, nr)) continue
          // no corner cutting
          if (dc !== 0 && dr !== 0 && (!this.ok(cc + dc, cr) || !this.ok(cc, cr + dr))) continue
          const ni = nr * GRID + nc
          if (closed[ni]) continue
          const cost = dc !== 0 && dr !== 0 ? 1.414 : 1
          const ng = g[cur] + cost
          if (ng < g[ni]) {
            g[ni] = ng
            came[ni] = cur
            push(ng + h(ni), ni)
          }
        }
      }
    }
    return null
  }
}

export { CELL }

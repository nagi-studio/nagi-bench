import { COLS, ROWS, CELL, idx, inGrid, type Cell } from './mapData'

export interface NavNode {
  x: number
  y: number
  z: number
  c: number
  r: number
  links: number[]
}

export function buildNav(cells: Cell[]): NavNode[] {
  const map = new Int32Array(COLS * ROWS).fill(-1)
  const nodes: NavNode[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = cells[idx(c, r)]
      if (!cell.walk || cell.blockNav) continue
      map[idx(c, r)] = nodes.length
      nodes.push({
        x: (c + 0.5) * CELL,
        y: cell.floorY,
        z: (r + 0.5) * CELL,
        c,
        r,
        links: [],
      })
    }
  }
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]
  for (const n of nodes) {
    for (const [dc, dr] of dirs) {
      const nc = n.c + dc
      const nr = n.r + dr
      if (!inGrid(nc, nr)) continue
      const j = map[idx(nc, nr)]
      if (j < 0) continue
      if (Math.abs(nodes[j].y - n.y) > 0.5) continue
      n.links.push(j)
    }
  }
  return nodes
}

export function nearestNode(nodes: NavNode[], x: number, z: number, y?: number): number {
  let best = 0
  let bestD = Infinity
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]
    let d = (n.x - x) * (n.x - x) + (n.z - z) * (n.z - z)
    if (y !== undefined) d += (n.y - y) * (n.y - y) * 4
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return best
}

export function findPath(nodes: NavNode[], sx: number, sz: number, gx: number, gz: number, sy?: number, gy?: number): { x: number; y: number; z: number }[] {
  if (nodes.length === 0) return []
  const start = nearestNode(nodes, sx, sz, sy)
  const goal = nearestNode(nodes, gx, gz, gy)
  if (start === goal) return [{ x: gx, y: nodes[goal].y, z: gz }]

  const open: number[] = [start]
  const g = new Float64Array(nodes.length).fill(Infinity)
  const f = new Float64Array(nodes.length).fill(Infinity)
  const came = new Int32Array(nodes.length).fill(-1)
  const inOpen = new Uint8Array(nodes.length)
  g[start] = 0
  f[start] = heuristic(nodes[start], nodes[goal])
  inOpen[start] = 1

  while (open.length) {
    let bi = 0
    for (let i = 1; i < open.length; i++) if (f[open[i]] < f[open[bi]]) bi = i
    const cur = open[bi]
    open.splice(bi, 1)
    inOpen[cur] = 0
    if (cur === goal) break
    for (const j of nodes[cur].links) {
      const step = Math.hypot(nodes[j].x - nodes[cur].x, nodes[j].z - nodes[cur].z) + Math.abs(nodes[j].y - nodes[cur].y) * 0.35
      const ng = g[cur] + step
      if (ng + 1e-6 < g[j]) {
        came[j] = cur
        g[j] = ng
        f[j] = ng + heuristic(nodes[j], nodes[goal])
        if (!inOpen[j]) {
          open.push(j)
          inOpen[j] = 1
        }
      }
    }
  }

  if (!isFinite(g[goal])) return []
  const path: { x: number; y: number; z: number }[] = []
  let c = goal
  while (c >= 0) {
    path.push({ x: nodes[c].x, y: nodes[c].y, z: nodes[c].z })
    c = came[c]
  }
  path.reverse()
  path.push({ x: gx, y: nodes[goal].y, z: gz })
  return path
}

function heuristic(a: NavNode, b: NavNode): number {
  return Math.hypot(a.x - b.x, a.z - b.z)
}

export function reachableCount(nodes: NavNode[], startIndex: number): number {
  const seen = new Uint8Array(nodes.length)
  const q = [startIndex]
  seen[startIndex] = 1
  let n = 0
  while (q.length) {
    const i = q.pop() as number
    n++
    for (const j of nodes[i].links) {
      if (!seen[j]) {
        seen[j] = 1
        q.push(j)
      }
    }
  }
  return n
}

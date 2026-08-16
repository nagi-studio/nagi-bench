import { NavGrid } from '../src/game/nav'
import { LANDMARKS, T_SPAWN_POINTS, CT_SPAWN_POINTS, WORLD_MIN_X, WORLD_MAX_X, WORLD_MIN_Z, WORLD_MAX_Z } from '../src/game/mapData'

const grid = new NavGrid()

function pointLabel(name: string, x: number, z: number) {
  const n = grid.nearestWalkable(x, z)
  return { name, x: n.x, z: n.z, walkable: grid.isWalkable(grid.worldToCell(x, z).i, grid.worldToCell(x, z).j) }
}

const keys = [
  ...LANDMARKS.map((l) => pointLabel(l.name, l.x, l.z)),
  ...T_SPAWN_POINTS.map((p, i) => pointLabel(`T_SPAWN_${i}`, p[0], p[1])),
  ...CT_SPAWN_POINTS.map((p, i) => pointLabel(`CT_SPAWN_${i}`, p[0], p[1])),
]

console.log('=== point walkability ===')
let allWalkable = true
for (const k of keys) {
  const raw = grid.worldToCell(
    LANDMARKS.find((l) => l.name === k.name)?.x ?? 0,
    LANDMARKS.find((l) => l.name === k.name)?.z ?? 0,
  )
  void raw
  const ok = k.walkable
  if (!ok) allWalkable = false
  console.log(`${k.name.padEnd(14)} raw(${k.x.toFixed(1)},${k.z.toFixed(1)}) walkable=${ok}`)
}
console.log('all raw points walkable:', allWalkable)

console.log('\n=== pairwise connectivity (A*) ===')
const origin = ['T_SPAWN', 'CT_SPAWN', 'MID', 'A_SITE', 'B_SITE', 'CT_MID', 'CATWALK']
const byName = new Map<string, { x: number; z: number }>()
for (const k of keys) byName.set(k.name, { x: k.x, z: k.z })

let failures = 0
for (const a of origin) {
  const A = byName.get(a)!
  for (const b of origin) {
    if (a === b) continue
    const B = byName.get(b)!
    const path = grid.findPath(A.x, A.z, B.x, B.z)
    const status = path.length > 0 ? 'OK' : 'NO PATH'
    if (path.length === 0) failures++
    console.log(`${a.padEnd(8)} -> ${b.padEnd(8)} ${status} ${path.length > 0 ? `(${path.length} cells)` : ''}`)
  }
}

console.log(`\nTotal connectivity failures: ${failures}`)

// Count walkable cells and report map coverage
let walkableCells = 0
for (let j = 0; j < grid.h; j++) {
  for (let i = 0; i < grid.w; i++) {
    if (grid.isWalkable(i, j)) walkableCells++
  }
}
console.log(`Grid ${grid.w}x${grid.h}, walkable cells: ${walkableCells}`)
console.log(`World bounds: X[${WORLD_MIN_X},${WORLD_MAX_X}] Z[${WORLD_MIN_Z},${WORLD_MAX_Z}]`)

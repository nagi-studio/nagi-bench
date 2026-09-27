import type { Solid } from './world'
import { World } from './world'

export const CELL = 2
export const COLS = 48
export const ROWS = 56
export const CAT_Y = 3.2

export type Zone =
  | 'tspawn'
  | 'ctspawn'
  | 'along'
  | 'asite'
  | 'short'
  | 'mid'
  | 'cat'
  | 'tunnel'
  | 'bsite'
  | 'stair'

export interface Cell {
  walk: boolean
  floorY: number
  /** Height at the low-coordinate side of a stair cell; equals floorY on flats. */
  y0: number
  y1: number
  ceilY: number | null
  zone: Zone
  blockNav: boolean
  stairAxis: 'x' | 'z' | null
}

export interface SpawnPoint {
  x: number
  y: number
  z: number
  yaw: number
}

export interface Rect {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export interface Label {
  text: string
  x: number
  y: number
  z: number
}

export interface DoorState {
  left: Solid
  right: Solid
  centerX: number
  centerZ: number
  panelW: number
  open: number
}

export interface MapData {
  cells: Cell[]
  world: World
  door: DoorState
  spawns: { ct: SpawnPoint[]; t: SpawnPoint[] }
  sites: { a: Rect[]; b: Rect[] }
  labels: Label[]
}

export function idx(c: number, r: number): number {
  return r * COLS + c
}

export function inGrid(c: number, r: number): boolean {
  return c >= 0 && r >= 0 && c < COLS && r < ROWS
}

function emptyCell(): Cell {
  return { walk: false, floorY: 0, y0: 0, y1: 0, ceilY: null, zone: 'mid', blockNav: false, stairAxis: null }
}

function fill(
  cells: Cell[],
  c0: number,
  r0: number,
  c1: number,
  r1: number,
  zone: Zone,
  floorY = 0,
  ceilY: number | null = null,
): void {
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      const cell = cells[idx(c, r)]
      cell.walk = true
      cell.floorY = floorY
      cell.y0 = floorY
      cell.y1 = floorY
      cell.zone = zone
      cell.ceilY = ceilY
      cell.blockNav = false
      cell.stairAxis = null
    }
  }
}

function fillStairs(
  cells: Cell[],
  c0: number,
  r0: number,
  c1: number,
  r1: number,
  axis: 'x' | 'z',
  yStart: number,
  yEnd: number,
): void {
  const n = axis === 'x' ? c1 - c0 + 1 : r1 - r0 + 1
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      const i = axis === 'x' ? c - c0 : r - r0
      const y0 = yStart + ((yEnd - yStart) * i) / n
      const y1 = yStart + ((yEnd - yStart) * (i + 1)) / n
      const cell = cells[idx(c, r)]
      cell.walk = true
      cell.floorY = y1
      cell.y0 = y0
      cell.y1 = y1
      cell.zone = 'stair'
      cell.ceilY = null
      cell.blockNav = false
      cell.stairAxis = axis
    }
  }
}

export function cellCenter(c: number, r: number, y = 0): { x: number; y: number; z: number } {
  return { x: (c + 0.5) * CELL, y, z: (r + 0.5) * CELL }
}

export function buildDust2(): MapData {
  const cells: Cell[] = Array.from({ length: COLS * ROWS }, emptyCell)

  // T spawn, south.
  fill(cells, 16, 2, 30, 10, 'tspawn')
  // Long doors connector into A long.
  fill(cells, 8, 4, 16, 9, 'along')
  // A long.
  fill(cells, 4, 8, 9, 40, 'along')
  // Outside T / lower mid, south of the doors.
  fill(cells, 18, 11, 32, 18, 'mid')
  // Mid door choke. Passable once the doors slide open.
  fill(cells, 23, 19, 24, 20, 'mid')
  // Upper mid.
  fill(cells, 16, 21, 34, 32, 'mid')
  // A short, ground route from mid into A.
  fill(cells, 10, 30, 18, 40, 'short')
  // A site bowl.
  fill(cells, 2, 38, 7, 52, 'asite')
  fill(cells, 8, 38, 14, 43, 'asite')
  fill(cells, 8, 47, 14, 52, 'asite')
  // Ground approach to the catwalk stairs.
  fill(cells, 18, 33, 28, 35, 'mid')
  // Raised catwalk.
  fill(cells, 16, 44, 36, 46, 'cat', CAT_Y)
  // East ground highway: mid → B doors → CT.
  fill(cells, 34, 24, 38, 30, 'mid')
  fill(cells, 37, 24, 44, 52, 'mid')
  // CT spawn.
  fill(cells, 18, 50, 44, 55, 'ctspawn')
  // CT ↔ A ground link.
  fill(cells, 8, 50, 20, 52, 'ctspawn')
  // B tunnels from T spawn.
  fill(cells, 31, 6, 42, 9, 'tunnel', 0, 2.55)
  fill(cells, 40, 9, 42, 23, 'tunnel', 0, 2.55)
  // B site and the lane back to CT.
  fill(cells, 36, 24, 46, 36, 'bsite')
  fill(cells, 40, 36, 44, 50, 'bsite')

  // Stairs are applied last so they overwrite flat fills.
  // Mid → catwalk, climbing north. 8 × 0.4m = 3.2m.
  fillStairs(cells, 22, 36, 24, 43, 'z', 0, CAT_Y)
  // Catwalk → A, descending west.
  fillStairs(cells, 8, 44, 15, 46, 'x', 0, CAT_Y)
  // Catwalk → CT, descending north.
  fillStairs(cells, 30, 47, 32, 54, 'z', CAT_Y, 0)

  const world = new World()
  addStructure(world, cells)

  const crates: { c: number; r: number; h: number; s: number }[] = [
    { c: 4, r: 49, h: 1.15, s: 1.25 },
    { c: 11, r: 49, h: 1.15, s: 1.35 },
    { c: 6, r: 41, h: 0.9, s: 1.1 },
    { c: 39, r: 28, h: 1.2, s: 1.35 },
    { c: 43, r: 32, h: 1.05, s: 1.2 },
    { c: 27, r: 26, h: 1.45, s: 1.7 },
    { c: 6, r: 20, h: 1.05, s: 1.15 },
    { c: 20, r: 6, h: 1.0, s: 1.2 },
  ]
  for (const cr of crates) {
    const cell = cells[idx(cr.c, cr.r)]
    if (!cell.walk || cell.floorY > 0.05 || cell.zone === 'stair' || cell.zone === 'tunnel') continue
    cell.blockNav = true
    const cx = (cr.c + 0.5) * CELL
    const cz = (cr.r + 0.5) * CELL
    world.add({
      minX: cx - cr.s / 2,
      maxX: cx + cr.s / 2,
      minY: cell.floorY,
      maxY: cell.floorY + cr.h,
      minZ: cz - cr.s / 2,
      maxZ: cz + cr.s / 2,
      standable: true,
      dynamic: false,
      tag: 'crate',
    })
  }

  const door = makeDoor()
  world.add(door.left)
  world.add(door.right)
  layoutDoor(door, 0)
  world.rebuildIndex()

  const yawT = Math.PI
  const yawCT = 0
  const spawns = {
    t: [
      spawn(18, 5, yawT),
      spawn(22, 5, yawT),
      spawn(26, 5, yawT),
      spawn(20, 8, yawT),
      spawn(25, 8, yawT),
    ],
    ct: [
      spawn(40, 50, yawCT),
      spawn(42, 46, yawCT),
      spawn(41, 42, yawCT),
      spawn(14, 51, Math.PI / 2),
      spawn(10, 51, Math.PI / 2),
    ],
  }

  const sites = {
    a: [rect(2, 39, 13, 43), rect(2, 47, 14, 51)],
    b: [rect(37, 25, 45, 35)],
  }

  const labels: Label[] = [
    { text: 'T 出生', ...labelAt(23, 6, 0) },
    { text: 'A 大', ...labelAt(6, 24, 0) },
    { text: '中门', ...labelAt(26, 16, 0) },
    { text: '中路', ...labelAt(26, 27, 0) },
    { text: '猫道', ...labelAt(26, 45, CAT_Y) },
    { text: 'A 点', ...labelAt(5, 49, 0) },
    { text: 'B 洞', ...labelAt(41, 16, 0) },
    { text: 'B 点', ...labelAt(42, 30, 0) },
    { text: 'CT 出生', ...labelAt(28, 53, 0) },
  ]

  return { cells, world, door, spawns, sites, labels }
}

function labelAt(c: number, r: number, y: number): { x: number; y: number; z: number } {
  return { x: (c + 0.5) * CELL, y: y + 3.6, z: (r + 0.5) * CELL }
}

function spawn(c: number, r: number, yaw: number): SpawnPoint {
  const p = cellCenter(c, r, 0)
  return { x: p.x, y: 0, z: p.z, yaw }
}

function rect(c0: number, r0: number, c1: number, r1: number): Rect {
  return { minX: c0 * CELL, maxX: (c1 + 1) * CELL, minZ: r0 * CELL, maxZ: (r1 + 1) * CELL }
}

function makeDoor(): DoorState {
  const centerX = (23 + 24 + 1) * CELL * 0.5 // mid of cells 23 and 24 → 48
  const centerZ = (19 + 20 + 1) * CELL * 0.5 // 40
  const panel = (s: Solid): Solid => s
  const left = panel({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 2.65,
    minZ: 0,
    maxZ: 0,
    standable: false,
    dynamic: true,
    tag: 'doorL',
  })
  const right: Solid = {
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 2.65,
    minZ: 0,
    maxZ: 0,
    standable: false,
    dynamic: true,
    tag: 'doorR',
  }
  return { left, right, centerX, centerZ, panelW: 2, open: 0 }
}

export function layoutDoor(door: DoorState, open: number): void {
  const o = Math.max(0, Math.min(1, open))
  door.open = o
  const slide = o * door.panelW
  const z0 = door.centerZ - 0.11
  const z1 = door.centerZ + 0.11
  const mid = door.centerX
  door.left.minX = mid - door.panelW - slide
  door.left.maxX = mid - slide
  door.left.minZ = z0
  door.left.maxZ = z1
  door.left.minY = 0
  door.left.maxY = 2.65
  door.right.minX = mid + slide
  door.right.maxX = mid + door.panelW + slide
  door.right.minZ = z0
  door.right.maxZ = z1
  door.right.minY = 0
  door.right.maxY = 2.65
}

function addStructure(world: World, cells: Cell[]): void {
  const TH = 0.4
  const walls: Solid[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = cells[idx(c, r)]
      if (!cell.walk) continue
      const minX = c * CELL
      const maxX = (c + 1) * CELL
      const minZ = r * CELL
      const maxZ = (r + 1) * CELL

      if (cell.stairAxis && Math.abs(cell.y1 - cell.y0) > 0.02) {
        addStairTreads(world, minX, maxX, minZ, maxZ, cell.y0, cell.y1, cell.stairAxis === 'x')
      } else {
        world.add({
          minX,
          maxX,
          minY: cell.floorY - 0.28,
          maxY: cell.floorY,
          minZ,
          maxZ,
          standable: true,
          dynamic: false,
          tag: 'floor',
        })
        if (cell.floorY > 0.2) {
          world.add({
            minX,
            maxX,
            minY: 0,
            maxY: cell.floorY - 0.02,
            minZ,
            maxZ,
            standable: false,
            dynamic: false,
            tag: 'fill',
          })
        }
      }

      if (cell.ceilY !== null) {
        world.add({
          minX,
          maxX,
          minY: cell.ceilY,
          maxY: cell.ceilY + 0.35,
          minZ,
          maxZ,
          standable: false,
          dynamic: false,
          tag: 'ceil',
        })
      }

      considerEdge(walls, cells, c, r, minX, maxX, minZ, maxZ, 0, -1, TH)
      considerEdge(walls, cells, c, r, minX, maxX, minZ, maxZ, 0, 1, TH)
      considerEdge(walls, cells, c, r, minX, maxX, minZ, maxZ, -1, 0, TH)
      considerEdge(walls, cells, c, r, minX, maxX, minZ, maxZ, 1, 0, TH)
    }
  }
  for (const wall of mergeSolids(walls)) world.add(wall)
}

function addStairTreads(
  world: World,
  minX: number,
  maxX: number,
  minZ: number,
  maxZ: number,
  y0: number,
  y1: number,
  alongX: boolean,
): void {
  for (let i = 0; i < 2; i++) {
    const yTop = y0 + (y1 - y0) * ((i + 1) / 2)
    let x0 = minX
    let x1 = maxX
    let z0 = minZ
    let z1 = maxZ
    if (alongX) {
      const mid = (minX + maxX) / 2
      if (i === 0) x1 = mid
      else x0 = mid
    } else {
      const mid = (minZ + maxZ) / 2
      if (i === 0) z1 = mid
      else z0 = mid
    }
    world.add({
      minX: x0,
      maxX: x1,
      minY: 0,
      maxY: Math.max(0.04, yTop),
      minZ: z0,
      maxZ: z1,
      standable: true,
      dynamic: false,
      tag: 'stair',
    })
  }
}

function considerEdge(
  walls: Solid[],
  cells: Cell[],
  c: number,
  r: number,
  minX: number,
  maxX: number,
  minZ: number,
  maxZ: number,
  dc: number,
  dr: number,
  TH: number,
): void {
  const cell = cells[idx(c, r)]
  const nc = c + dc
  const nr = r + dr
  const outside = !inGrid(nc, nr)
  const n = outside ? null : cells[idx(nc, nr)]
  const neighborWalk = !!n && n.walk
  if (neighborWalk && n && Math.abs(n.floorY - cell.floorY) <= 0.5) return

  let maxY = Math.max(3.9, cell.floorY + 1.25)
  let minY = 0
  if (neighborWalk && n && n.floorY < cell.floorY - 0.5) {
    maxY = cell.floorY + 1.15
    minY = Math.min(n.floorY, cell.floorY)
  } else if (neighborWalk && n && n.floorY > cell.floorY + 0.5) {
    // The higher cell emits the cliff wall.
    return
  }

  let x0 = minX
  let x1 = maxX
  let z0 = minZ
  let z1 = maxZ
  if (dc === -1) {
    x0 = minX - TH
    x1 = minX
  } else if (dc === 1) {
    x0 = maxX
    x1 = maxX + TH
  } else if (dr === -1) {
    z0 = minZ - TH
    z1 = minZ
  } else if (dr === 1) {
    z0 = maxZ
    z1 = maxZ + TH
  }
  walls.push({
    minX: x0,
    maxX: x1,
    minY,
    maxY,
    minZ: z0,
    maxZ: z1,
    standable: false,
    dynamic: false,
    tag: 'wall',
  })
}

function near(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.03
}

function tryMerge(a: Solid, b: Solid): Solid | null {
  if (a.tag !== b.tag || !near(a.minY, b.minY) || !near(a.maxY, b.maxY)) return null
  if (near(a.minZ, b.minZ) && near(a.maxZ, b.maxZ)) {
    if (near(a.maxX, b.minX)) return { ...a, maxX: Math.max(a.maxX, b.maxX) }
    if (near(b.maxX, a.minX)) return { ...a, minX: Math.min(a.minX, b.minX) }
  }
  if (near(a.minX, b.minX) && near(a.maxX, b.maxX)) {
    if (near(a.maxZ, b.minZ)) return { ...a, maxZ: Math.max(a.maxZ, b.maxZ) }
    if (near(b.maxZ, a.minZ)) return { ...a, minZ: Math.min(a.minZ, b.minZ) }
  }
  return null
}

function mergeSolids(list: Solid[]): Solid[] {
  let cur = list
  let changed = true
  while (changed) {
    changed = false
    const next: Solid[] = []
    const used = new Set<number>()
    for (let i = 0; i < cur.length; i++) {
      if (used.has(i)) continue
      let acc = cur[i]
      for (let j = i + 1; j < cur.length; j++) {
        if (used.has(j)) continue
        const merged = tryMerge(acc, cur[j])
        if (!merged) continue
        acc = merged
        used.add(j)
        changed = true
      }
      next.push(acc)
    }
    cur = next
  }
  return cur
}

const ZONE_CHAR: Record<Zone, string> = {
  tspawn: 't',
  ctspawn: 'C',
  along: 'l',
  asite: 'a',
  short: 's',
  mid: 'm',
  cat: 'c',
  tunnel: 'u',
  bsite: 'b',
  stair: 'S',
}

export function mapAscii(cells: Cell[]): string {
  let s = ''
  for (let r = ROWS - 1; r >= 0; r--) {
    let line = ''
    for (let c = 0; c < COLS; c++) {
      const cell = cells[idx(c, r)]
      if (!cell.walk) line += '#'
      else if (cell.blockNav) line += 'x'
      else line += ZONE_CHAR[cell.zone]
    }
    s += line + '\n'
  }
  return s
}

export function pointInRect(x: number, z: number, rect: Rect): boolean {
  return x >= rect.minX && x <= rect.maxX && z >= rect.minZ && z <= rect.maxZ
}

export function inSite(sites: Rect[], x: number, z: number): boolean {
  return sites.some((r) => pointInRect(x, z, r))
}

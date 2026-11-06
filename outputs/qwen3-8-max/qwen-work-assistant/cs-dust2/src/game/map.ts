/* ============================================================================
   Dust2 map — a tile-grid level.
   The walkable floor is "carved" out of solid rock as a set of rectangles, so
   the perimeter is always sealed and corridors never leak. Walls are generated
   from tile boundaries. Collision, line-of-sight and pathfinding all read the
   same grid, which keeps them consistent.

   World axes: +X east, +Z south, +Y up. Floor at y=0. Tile size 1 world unit.
   ========================================================================== */

export const TILE = 1
export const GRID = 100 // 100x100 tiles
export const WALL_H = 5.2
export const HALF = GRID / 2

export enum Cell { WALL = 0, FLOOR = 1 }

// grid[z * GRID + x]
const grid = new Uint8Array(GRID * GRID) // 0 = wall by default

export function tileToWorld(t: number): number {
  return t - HALF + 0.5
}
export function worldToTile(w: number): number {
  return Math.floor(w + HALF)
}
export function inBounds(tx: number, tz: number): boolean {
  return tx >= 0 && tx < GRID && tz >= 0 && tz < GRID
}
export function cellAt(tx: number, tz: number): Cell {
  if (!inBounds(tx, tz)) return Cell.WALL
  return grid[tz * GRID + tx] as Cell
}
export function isFloor(tx: number, tz: number): boolean {
  return cellAt(tx, tz) === Cell.FLOOR
}

function carve(x0: number, z0: number, x1: number, z1: number) {
  for (let z = Math.min(z0, z1); z <= Math.max(z0, z1); z++)
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
      if (inBounds(x, z)) grid[z * GRID + x] = Cell.FLOOR
}

/* ------------------------------ regions ------------------------------ */
export interface Region { name: string; x0: number; z0: number; x1: number; z1: number }
export const REGIONS: Region[] = [
  { name: 'TSpawn',   x0: 44, z0: 80, x1: 56, z1: 92 },
  { name: 'LowerMid', x0: 46, z0: 58, x1: 54, z1: 80 },
  { name: 'Mid',      x0: 44, z0: 42, x1: 56, z1: 58 },
  { name: 'UpperMid', x0: 46, z0: 24, x1: 54, z1: 42 },
  { name: 'CTSpawn',  x0: 44, z0: 8,  x1: 56, z1: 30 },
  // A / long side (east)
  { name: 'LongApp',  x0: 56, z0: 78, x1: 64, z1: 90 },
  { name: 'LongA',    x0: 64, z0: 40, x1: 72, z1: 90 },
  { name: 'ASite',    x0: 60, z0: 24, x1: 78, z1: 40 },
  { name: 'ShortA',   x0: 54, z0: 34, x1: 60, z1: 44 },
  { name: 'Catwalk',  x0: 56, z0: 30, x1: 68, z1: 36 },
  { name: 'ACT',      x0: 52, z0: 20, x1: 64, z1: 26 }, // A site <-> CT spawn
  // B side (west)
  { name: 'BApp',     x0: 36, z0: 78, x1: 44, z1: 90 },
  { name: 'BTunnel',  x0: 28, z0: 40, x1: 36, z1: 90 },
  { name: 'BSite',    x0: 22, z0: 24, x1: 40, z1: 40 },
  { name: 'BCT',      x0: 36, z0: 20, x1: 48, z1: 26 }, // B site <-> CT spawn
]

/* ------------------------------ sites & spawns ------------------------------ */
export interface SiteDef { id: 'A' | 'B'; x: number; z: number; r: number }
export const SITE_A: SiteDef = { id: 'A', x: tileToWorld(69), z: tileToWorld(32), r: 6.5 }
export const SITE_B: SiteDef = { id: 'B', x: tileToWorld(31), z: tileToWorld(32), r: 6.5 }

export function regionCenter(name: string): { x: number; z: number } {
  const r = REGIONS.find((g) => g.name === name)!
  return { x: tileToWorld((r.x0 + r.x1) / 2), z: tileToWorld((r.z0 + r.z1) / 2) }
}

/* ------------------------------ crates (cover) ------------------------------ */
export interface Crate { x: number; z: number; w: number; d: number; h: number }
export const CRATES: Crate[] = [
  // A site boxes (the classic stack)
  { x: tileToWorld(66), z: tileToWorld(30), w: 3, d: 3, h: 1.6 },
  { x: tileToWorld(72), z: tileToWorld(34), w: 3, d: 3, h: 1.6 },
  { x: tileToWorld(72), z: tileToWorld(28), w: 2.4, d: 2.4, h: 1.0 },
  // B site boxes
  { x: tileToWorld(30), z: tileToWorld(30), w: 3, d: 3, h: 1.6 },
  { x: tileToWorld(34), z: tileToWorld(34), w: 2.6, d: 2.6, h: 1.0 },
  // mid cover
  { x: tileToWorld(50), z: tileToWorld(50), w: 2.4, d: 2.4, h: 1.2 },
  // long A cover
  { x: tileToWorld(68), z: tileToWorld(66), w: 2.6, d: 2.6, h: 1.4 },
  // tunnels cover
  { x: tileToWorld(32), z: tileToWorld(66), w: 2.4, d: 2.4, h: 1.2 },
]

export function crateAt(x: number, z: number): Crate | null {
  for (const c of CRATES) {
    if (Math.abs(x - c.x) <= c.w / 2 && Math.abs(z - c.z) <= c.d / 2) return c
  }
  return null
}
// highest standable surface under (x,z): floor 0 or a crate top
export function groundHeight(x: number, z: number): number {
  const c = crateAt(x, z)
  return c ? c.h : 0
}

/* ------------------------------ mid doors ------------------------------ */
// A wall spans Mid at z=50 with a central 3-tile doorway; two door leaves flank
// the gap and are passable through the centre (the "passable mid doors").
export const DOOR_Z = 50
export const DOOR_GAP = 1.6 // half-width of the passable gap in world units
export const DOOR = {
  z: tileToWorld(DOOR_Z),
  xCenter: tileToWorld(50),
  leafHalf: 1.1,
  height: 3.4,
}

/* ------------------------------ build ------------------------------ */
let built = false
export function buildMap() {
  if (built) return
  grid.fill(Cell.WALL)
  REGIONS.forEach((r) => carve(r.x0, r.z0, r.x1, r.z1))

  // Mid doors: a solid band across Mid at z=DOOR_Z, leaving a 3-tile central
  // doorway you can walk through (the open double doors). Real wall tiles, so
  // collision / LOS / pathing all agree.
  const mid = REGIONS.find((r) => r.name === 'Mid')!
  for (let x = mid.x0; x <= mid.x1; x++) {
    if (x < 49 || x > 51) grid[DOOR_Z * GRID + x] = Cell.WALL
    else grid[DOOR_Z * GRID + x] = Cell.FLOOR
  }

  built = true
}

/* Wall tiles that need a rendered box: any WALL tile orthogonally adjacent to
   a FLOOR tile (its faces are visible). Everything else stays solid rock. */
export interface WallBox { x: number; z: number }
let wallCache: WallBox[] | null = null
export function surfaceWalls(): WallBox[] {
  if (wallCache) return wallCache
  buildMap()
  const out: WallBox[] = []
  for (let z = 0; z < GRID; z++)
    for (let x = 0; x < GRID; x++) {
      if (cellAt(x, z) !== Cell.WALL) continue
      if (isFloor(x + 1, z) || isFloor(x - 1, z) || isFloor(x, z + 1) || isFloor(x, z - 1))
        out.push({ x: tileToWorld(x), z: tileToWorld(z) })
    }
  wallCache = out
  return out
}

/* ------------------------------ collision ------------------------------ */
// Circle-vs-level collision on XZ. Returns a corrected position that does not
// penetrate walls or crates. The mid doors are real tiles with a 3-wide gap, so
// they need no special handling here.
export function resolveCircle(x: number, z: number, r: number): { x: number; z: number } {
  buildMap()
  let px = x,
    pz = z
  const tx0 = worldToTile(px - r),
    tx1 = worldToTile(px + r)
  const tz0 = worldToTile(pz - r),
    tz1 = worldToTile(pz + r)
  for (let tz = tz0; tz <= tz1; tz++)
    for (let tx = tx0; tx <= tx1; tx++) {
      if (cellAt(tx, tz) !== Cell.WALL) continue
      const wx0 = tx - HALF,
        wx1 = wx0 + 1
      const wz0 = tz - HALF,
        wz1 = wz0 + 1
      const cx = clamp(px, wx0, wx1),
        cz = clamp(pz, wz0, wz1)
      const dx = px - cx,
        dz = pz - cz
      const d2 = dx * dx + dz * dz
      if (d2 < r * r) {
        const d = Math.sqrt(d2) || 0.0001
        const push = (r - d) / d
        px += dx * push
        pz += dz * push
      }
    }
  // crates
  for (const c of CRATES) {
    const hx = c.w / 2 + r,
      hz = c.d / 2 + r
    const dx = px - c.x,
      dz = pz - c.z
    if (Math.abs(dx) < hx && Math.abs(dz) < hz) {
      const ox = hx - Math.abs(dx),
        oz = hz - Math.abs(dz)
      if (ox < oz) px += dx > 0 ? ox : -ox
      else pz += dz > 0 ? oz : -oz
    }
  }
  return { x: px, z: pz }
}
function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v
}

// Can a point (x,z) stand here (not inside a wall)?
export function standable(x: number, z: number): boolean {
  buildMap()
  return cellAt(worldToTile(x), worldToTile(z)) === Cell.FLOOR
}

/* ------------------------------ line of sight / bullet ray on XZ ------------------------------ */
// March a ray on the grid; return the distance to the first wall/crate hit, or
// maxDist if nothing blocks. Walls are full height so a 2D march is valid.
export function rayWallDistance(
  ox: number,
  oz: number,
  dx: number,
  dz: number,
  maxDist: number
): number {
  buildMap()
  let tx = worldToTile(ox),
    tz = worldToTile(oz)
  const stepX = dx > 0 ? 1 : -1,
    stepZ = dz > 0 ? 1 : -1
  const tdx = Math.abs(1 / (dx || 1e-9)),
    tdz = Math.abs(1 / (dz || 1e-9))
  let tmx = (dx > 0 ? tx + 1 - (ox + HALF) : ox + HALF - tx) * tdx
  let tmz = (dz > 0 ? tz + 1 - (oz + HALF) : oz + HALF - tz) * tdz
  let t = 0
  for (let i = 0; i < 512 && t < maxDist; i++) {
    if (i > 0) {
      if (cellAt(tx, tz) === Cell.WALL) return t
      const wx = ox + dx * t,
        wz = oz + dz * t
      if (crateAt(wx, wz)) return t
    }
    if (tmx < tmz) {
      tx += stepX
      t = tmx
      tmx += tdx
    } else {
      tz += stepZ
      t = tmz
      tmz += tdz
    }
  }
  return maxDist
}

export function lineOfSight(ax: number, az: number, bx: number, bz: number): boolean {
  const dx = bx - ax,
    dz = bz - az
  const dist = Math.hypot(dx, dz)
  if (dist < 1e-4) return true
  return rayWallDistance(ax, az, dx / dist, dz / dist, dist) >= dist - 0.02
}

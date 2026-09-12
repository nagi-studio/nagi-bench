// ---------------------------------------------------------------------------
// Dust2 core layout, defined procedurally as axis-aligned boxes.
// Coordinate system: +X = east, +Z = north, +Y = up. Units are metres.
// ---------------------------------------------------------------------------

export interface Box {
  cx: number
  cy: number
  cz: number
  sx: number
  sy: number
  sz: number
}

export interface Rect {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export const WORLD_MIN_X = -26
export const WORLD_MAX_X = 26
export const WORLD_MIN_Z = -24
export const WORLD_MAX_Z = 22

export const CELL = 0.5
export const GRID_W = Math.ceil((WORLD_MAX_X - WORLD_MIN_X) / CELL) // 104
export const GRID_H = Math.ceil((WORLD_MAX_Z - WORLD_MIN_Z) / CELL) // 92

export function wall(cx: number, cz: number, sx: number, sz: number, sy = 4): Box {
  return { cx, cy: sy / 2, cz, sx, sy, sz }
}

export function crate(cx: number, cz: number, sx: number, sz: number, sy = 1.5): Box {
  return { cx, cy: sy / 2, cz, sx, sy, sz }
}

export function boxMinMax(b: Box) {
  return {
    minX: b.cx - b.sx / 2,
    maxX: b.cx + b.sx / 2,
    minY: b.cy - b.sy / 2,
    maxY: b.cy + b.sy / 2,
    minZ: b.cz - b.sz / 2,
    maxZ: b.cz + b.sz / 2,
  }
}

export function insideXZ(x: number, z: number, b: Box): boolean {
  const m = boxMinMax(b)
  return x >= m.minX && x <= m.maxX && z >= m.minZ && z <= m.maxZ
}

export function insideRect(x: number, z: number, r: Rect): boolean {
  return x >= r.minX && x <= r.maxX && z >= r.minZ && z <= r.maxZ
}

// ---------------------------------------------------------------------------
// Movement blockers: walls, the central building block, back walls and crates.
// (The catwalk support is a platform with a walkable top, kept separate.)
// ---------------------------------------------------------------------------

export const MOVEMENT_BLOCKERS: Box[] = [
  // Outer walls
  wall(0, 22.5, 55, 1, 5),
  wall(0, -24.5, 55, 1, 5),
  wall(-26.5, -2, 1, 49, 5),
  wall(26.5, -2, 1, 49, 5),

  // T spawn north boundary (z=-4). Gaps: A-long entrance, mid entrance.
  wall(-24, -4, 4, 0.6),
  wall(-13, -4, 10, 0.6),
  wall(-2.75, -4, 2.5, 0.6),
  wall(2.75, -4, 2.5, 0.6),
  wall(12, -4, 16, 0.6),

  // Central solid block between A long and mid / CT mid
  wall(-6, 3, 4, 14, 4),

  // A long -> A site ("long doors"), z=10
  wall(-24, 10, 4, 0.6),
  wall(-13, 10, 10, 0.6),

  // A site -> CT mid ("A short"), x=-4, gap z[11,15]
  wall(-4, 10.5, 0.6, 1),
  wall(-4, 17.5, 0.6, 5),

  // mid -> CT spawn, x=4
  wall(4, 2, 0.6, 12),

  // mid -> CT mid double doors, z=8, gap x[-1,1]
  wall(-2.5, 8, 3, 0.6),
  wall(2.5, 8, 3, 0.6),

  // CT mid -> CT spawn, z=8, gap x[8,12]
  wall(6, 8, 4, 0.6),
  wall(13, 8, 2, 0.6),

  // CT mid -> B site, x=14
  wall(14, 14, 0.6, 12),

  // CT spawn -> B tunnels, x=20
  wall(20, 2, 0.6, 12),

  // T spawn -> B tunnels, x=20, gap z[-14,-10]
  wall(20, -17, 0.6, 6),
  wall(20, -7, 0.6, 6),

  // B tunnels -> B site, z=8, gap x[22,24]
  wall(21, 8, 2, 0.6),
  wall(25, 8, 2, 0.6),

  // CT spawn -> B site ("B doors"), z=8, gap x[16,18]
  wall(15, 8, 2, 0.6),
  wall(19, 8, 2, 0.6),

  // Back walls along the north edge (z 20..22)
  wall(-17, 21, 18, 2, 4), // above A site
  wall(20, 21, 12, 2, 4), // above B site

  // Crates
  crate(-20, 14, 2, 1.5),
  crate(-14, 17, 1.5, 1.5),
  crate(-8, 13, 2, 1.5),
  crate(-18, 11, 1.5, 1.5),
  crate(17, 12, 2, 1.5),
  crate(22, 16.5, 1.5, 1.5),
  crate(23, 10, 2, 1.5),
  crate(18, 17, 1.5, 1.5),
  crate(0, 0, 1.2, 1.2),
  crate(-20, 0, 1.5, 1.5),
  crate(23, -6, 1.5, 1.5),
]

// The catwalk support: solid up to y=2.2, but its top is a walkable surface.
export const CATWALK_SUPPORT: Box = wall(3, 21, 22, 2, 2.2)

/** Boxes that block movement at ground level but whose tops are walkable. */
export const PLATFORMS: Box[] = [CATWALK_SUPPORT]

// ---------------------------------------------------------------------------
// Ramps (sloped walkable surfaces) up to the catwalk.
// ---------------------------------------------------------------------------

export interface Ramp {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
  /** height at minZ (bottom) */
  h0: number
  /** height at maxZ (top) */
  h1: number
}

export const CATWALK_TOP = 2.2

export const RAMP_WEST: Ramp = { minX: -8, maxX: -4, minZ: 15, maxZ: 20, h0: 0, h1: CATWALK_TOP }
export const RAMP_EAST: Ramp = { minX: 6, maxX: 10, minZ: 15, maxZ: 20, h0: 0, h1: CATWALK_TOP }

function rampHeight(r: Ramp, z: number): number {
  const t = (z - r.minZ) / (r.maxZ - r.minZ)
  return r.h0 + (r.h1 - r.h0) * Math.min(1, Math.max(0, t))
}

export function inRamp(x: number, z: number, r: Ramp): boolean {
  return x >= r.minX && x <= r.maxX && z >= r.minZ && z <= r.maxZ
}

/** Resting (walkable) surface height at a world position. */
export function restingHeight(x: number, z: number): number {
  if (inRamp(x, z, RAMP_WEST)) return rampHeight(RAMP_WEST, z)
  if (inRamp(x, z, RAMP_EAST)) return rampHeight(RAMP_EAST, z)
  const c = CATWALK_SUPPORT
  if (insideXZ(x, z, c)) return c.cy + c.sy / 2
  return 0
}

// Occluders for vision rays: every movement blocker plus the catwalk support
// and the solid ramp volumes.
export const OCCLUDERS: Box[] = [
  ...MOVEMENT_BLOCKERS,
  CATWALK_SUPPORT,
  // ramp volumes approximated as solid prisms for line-of-sight tests
  wall(-6, 17.5, 4, 5, CATWALK_TOP),
  wall(8, 17.5, 4, 5, CATWALK_TOP),
]

/** All boxes that block movement (walls/crates/back walls + catwalk support). */
export const ALL_BLOCKERS: Box[] = [...MOVEMENT_BLOCKERS, CATWALK_SUPPORT]

// ---------------------------------------------------------------------------
// Named zones.
// ---------------------------------------------------------------------------

export const ZONES = {
  T_SPAWN: { minX: -26, maxX: 20, minZ: -24, maxZ: -4 } as Rect,
  CT_SPAWN: { minX: 4, maxX: 20, minZ: -4, maxZ: 8 } as Rect,
  A_SITE: { minX: -26, maxX: -4, minZ: 10, maxZ: 20 } as Rect,
  B_SITE: { minX: 14, maxX: 26, minZ: 8, maxZ: 20 } as Rect,
}

export const T_SPAWN_POINTS: [number, number][] = [
  [-22, -20], [-16, -22], [-6, -22], [4, -20], [14, -18],
]

export const CT_SPAWN_POINTS: [number, number][] = [
  [6, 0], [10, -2], [14, 2], [18, -2], [16, 6],
]

export interface Landmark {
  name: string
  x: number
  z: number
}

export const LANDMARKS: Landmark[] = [
  { name: 'A_SITE', x: -15, z: 15 },
  { name: 'B_SITE', x: 20, z: 14 },
  { name: 'MID', x: 0, z: 2 },
  { name: 'CT_MID', x: 5, z: 13 },
  { name: 'CATWALK', x: 0, z: 21 },
  { name: 'A_LONG', x: -20, z: 4 },
  { name: 'B_TUNNELS', x: 23, z: 0 },
  { name: 'T_SPAWN', x: -6, z: -14 },
  { name: 'CT_SPAWN', x: 12, z: 0 },
  { name: 'A_SHORT', x: -4, z: 13 },
  { name: 'MID_DOORS', x: 0, z: 8 },
]

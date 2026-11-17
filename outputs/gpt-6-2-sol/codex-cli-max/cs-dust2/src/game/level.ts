import type { Team } from './arsenal'

export interface Point { x: number; z: number }
export interface Vec extends Point { y: number }
export interface Rect { x0: number; x1: number; z0: number; z1: number }
export type BlockKind = 'wall' | 'stone' | 'crate' | 'door' | 'roof' | 'metal' | 'pillar'
export interface Block extends Vec {
  w: number
  h: number
  d: number
  angle: number
  kind: BlockKind
}

export const MAP_BOUNDS: Rect = { x0: -44, x1: 44, z0: -35, z1: 38 }

export const WALKWAYS: readonly Rect[] = [
  { x0: -18, x1: 20, z0: 20, z1: 36 }, // depot
  { x0: -30, x1: -12, z0: 16, z1: 25 },
  { x0: 17, x1: 29, z0: 18, z1: 27 },
  { x0: 24, x1: 42, z0: 12, z1: 23 },
  { x0: 31, x1: 42, z0: -11, z1: 18 }, // long
  { x0: 21, x1: 42, z0: -30, z1: -10 }, // A
  { x0: 7, x1: 24, z0: -29, z1: -22 },
  { x0: -10, x1: 11, z0: -33, z1: -18 }, // garrison
  { x0: -26, x1: -5, z0: -29, z1: -21 },
  { x0: -42, x1: -22, z0: -29, z1: -10 }, // B
  { x0: -37, x1: -26, z0: -14, z1: -6 },
  { x0: -37, x1: -27, z0: -10, z1: 16 }, // tunnels
  { x0: -37, x1: -20, z0: 10, z1: 19 },
  { x0: -24, x1: -7, z0: 4, z1: 11 },
  { x0: -9, x1: 10, z0: -8, z1: 24 }, // mid
  { x0: -7, x1: 8, z0: -16, z1: -4 }, // doors
  { x0: -7, x1: 8, z0: -24, z1: -12 },
  { x0: 7, x1: 21, z0: 3, z1: 10 },
  { x0: 13, x1: 23, z0: -13, z1: 8 }, // catwalk
  { x0: 17, x1: 26, z0: -17, z1: -9 },
  { x0: 5, x1: 15, z0: -17, z1: -13 },
]

export const SITES = {
  A: { x: 34, z: -17, radius: 4.1 },
  B: { x: -33.5, z: -20.2, radius: 4.1 },
} as const
export type Site = keyof typeof SITES

export const SPAWNS: Record<Team, readonly Point[]> = {
  CT: [{ x: -2, z: -25.5 }, { x: -6, z: -28 }, { x: 3, z: -25 }, { x: 7, z: -27 }, { x: 0.5, z: -30 }],
  T: [{ x: 3, z: 28 }, { x: -10, z: 29 }, { x: -4, z: 27 }, { x: 8, z: 27 }, { x: 12.5, z: 29 }],
}

export const ROUTES = {
  long: { x: 36, z: 12 },
  tunnel: { x: -31, z: 13 },
  mid: { x: 0.5, z: -8.9 },
  cat: { x: 18.5, z: -5 },
  midNorth: { x: 1.2, z: -13.6 },
  aBack: { x: 21.8, z: -24.6 },
  bBack: { x: -23.7, z: -24.6 },
}

const AREA_LABELS: readonly [Rect, string][] = [
  [WALKWAYS[6], 'A 后场'],
  [WALKWAYS[5], 'A 点'],
  [WALKWAYS[4], 'A 大'],
  [WALKWAYS[8], 'B 后场'],
  [WALKWAYS[9], 'B 点'],
  [WALKWAYS[11], 'B 洞'],
  [WALKWAYS[12], 'B 洞入口'],
  [WALKWAYS[14], '中路'],
  [WALKWAYS[15], '中门'],
  [WALKWAYS[16], '中门'],
  [WALKWAYS[17], '猫道坡口'],
  [WALKWAYS[18], '猫道'],
  [WALKWAYS[7], 'CT 出生点'],
  [WALKWAYS[0], 'T 出生点'],
]

export function distance2(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.z - b.z)
}

export function inRect({ x, z }: Point, rect: Rect) {
  return x >= rect.x0 && x <= rect.x1 && z >= rect.z0 && z <= rect.z1
}

export function walkable(point: Point) {
  return WALKWAYS.some(rect => inRect(point, rect))
}

export function areaName(point: Point) {
  return AREA_LABELS.find(([rect]) => inRect(point, rect))?.[1] ?? '连接道'
}

export function siteAt(point: Point): Site | null {
  if (distance2(point, SITES.A) <= SITES.A.radius) return 'A'
  if (distance2(point, SITES.B) <= SITES.B.radius) return 'B'
  return null
}

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

export function groundY(x: number, z: number) {
  const width = clamp(Math.min((x - 13) / 1.3, (23 - x) / 1.3), 0, 1)
  const length = clamp(Math.min((z + 13) / 4, (7 - z) / 9), 0, 1)
  return 1.16 * width * length
}

export function seedRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export interface Edge {
  alongX: boolean
  line: number
  from: number
  to: number
  outside: -1 | 1
}

function boundaryEdges(): Edge[] {
  const xs = [...new Set(WALKWAYS.flatMap(rect => [rect.x0, rect.x1]))].sort((a, b) => a - b)
  const zs = [...new Set(WALKWAYS.flatMap(rect => [rect.z0, rect.z1]))].sort((a, b) => a - b)
  const edges: Edge[] = []
  for (const alongX of [true, false]) {
    const axes = alongX ? zs : xs
    const spans = alongX ? xs : zs
    for (const line of axes) {
      let previous: Edge | undefined
      for (let i = 0; i < spans.length - 1; i++) {
        const from = spans[i]
        const to = spans[i + 1]
        const center = (from + to) / 2
        const lower = walkable(alongX ? { x: center, z: line - 0.05 } : { x: line - 0.05, z: center })
        const upper = walkable(alongX ? { x: center, z: line + 0.05 } : { x: line + 0.05, z: center })
        if (lower === upper) {
          previous = undefined
          continue
        }
        const outside = lower ? 1 : -1
        if (previous?.outside === outside) {
          previous.to = to
        } else {
          previous = { alongX, line, from, to, outside }
          edges.push(previous)
        }
      }
    }
  }
  return edges
}

export const EDGES = boundaryEdges()

function block(kind: BlockKind, x: number, z: number, w: number, d: number, h: number, y = 0, angle = 0): Block {
  return { x, y, z, w, h, d, kind, angle }
}

export const BOUNDARY = EDGES.map((edge, index) => {
  const center = (edge.from + edge.to) / 2
  const side = edge.line + edge.outside * 0.54
  const length = edge.to - edge.from + 0.4
  return block(
    'wall', edge.alongX ? center : side, edge.alongX ? side : center,
    edge.alongX ? length : 1.08, edge.alongX ? 1.08 : length,
    4.9 + (index * 13 % 9) * 0.22,
  )
})

export const PROPS: readonly Block[] = [
  block('crate', 33.1, 7.2, 2.25, 1.85, 1.46, 0, 0.08),
  block('crate', 32.55, 7.07, 1.25, 1.22, 0.91, 1.46, -0.09),
  block('crate', 40.4, -5.3, 1.7, 2, 1.19, 0, 0.1),
  block('metal', 40.7, 8.7, 1.24, 1.22, 1.08),
  block('pillar', 31.59, -1.25, 1.16, 1.58, 3.14),
  block('pillar', 41.41, -1.25, 1.16, 1.58, 3.14),
  block('stone', 36.5, -1.25, 10.9, 1.46, 1.02, 6.4),

  block('crate', 31.75, -22.4, 3.45, 2.48, 1.9, 0, 0.055),
  block('crate', 32.1, -22.3, 1.72, 1.49, 1.15, 1.9, -0.08),
  block('crate', 24.45, -26, 2.3, 1.9, 1.6),
  block('stone', 39.65, -25.4, 3.15, 1.36, 1.38),
  block('crate', 40.3, -16.05, 2, 1.46, 1.46, 0, 0.07),
  block('metal', 24.8, -15.1, 1.28, 1.18, 1.17),

  block('crate', -39.45, -23.8, 2.9, 1.94, 1.75, 0, -0.07),
  block('crate', -39.8, -23.92, 1.68, 1.32, 1.1, 1.75),
  block('crate', -31.9, -26.35, 1.9, 2.9, 1.62, 0, 0.1),
  block('metal', -25.8, -16.6, 1.53, 1.47, 1.28),
  block('stone', -38.6, -15.0, 1.7, 2.12, 1.22),
  block('crate', -29, -13.65, 1.55, 1.5, 1.22, 0, -0.06),

  block('stone', -5.04, -9, 4.18, 1.32, 4.45),
  block('stone', 5.68, -9, 4.64, 1.32, 4.45),
  block('stone', 0.2, -9, 6.3, 1.3, 1.2, 3.25),
  block('pillar', -2.98, -9, 0.64, 1.52, 3.37),
  block('pillar', 3.3, -9, 0.64, 1.52, 3.37),
  block('door', -2.235, -9.44, 1.52, 0.22, 2.82, 0, -0.59),
  block('door', 2.555, -9.44, 1.52, 0.22, 2.82, 0, 0.59),

  block('roof', -32, 0.95, 10.2, 21.7, 0.83, 3.3),
  block('pillar', -36.3, 11.1, 1.4, 1.14, 3.3),
  block('pillar', -27.7, 11.1, 1.4, 1.14, 3.3),
  block('pillar', -36.3, -9.4, 1.4, 1.14, 3.3),
  block('pillar', -27.7, -9.4, 1.4, 1.14, 3.3),
  block('crate', -35.65, 6.1, 1.49, 1.65, 1.25, 0, 0.07),
  block('crate', -27.85, 15.4, 1.56, 1.65, 1.32, 0, -0.1),

  block('crate', 2.45, 15.3, 3.35, 1.91, 1.48, 0, 0.065),
  block('crate', 2.68, 15.22, 1.45, 1.26, 0.89, 1.48, -0.03),
  block('crate', 7.8, 0.0, 2.2, 2.0, 1.58, 0, -0.08),
  block('crate', -6.9, -3.8, 2.1, 1.7, 1.55),
  block('stone', 13.8, -2.4, 0.94, 6.2, 1.21),
  block('stone', 22.25, -3.07, 0.88, 4.75, 1.6),
  block('crate', -13.85, 24.4, 2.1, 2.18, 1.6),
  block('crate', 15.1, 25.7, 2.0, 2.1, 1.46),
  block('stone', -7.8, -31.6, 3.5, 1.3, 1.22),
  block('crate', 9.84, -25.1, 1.79, 1.85, 1.22),
  block('stone', -12.6, 7.75, 1.64, 2.1, 1.45),
  block('crate', 26.5, 20.8, 1.72, 2.2, 1.56, 0, 0.1),
]

export const BLOCKS: readonly Block[] = [...BOUNDARY, ...PROPS]

// Dust2 地图数据：按真实走位布置全部核心区域
// 坐标系：X 向右，Z 向前，Y 向上。单位为米。
// 区域：T 出生点、CT 出生点、A大、A点、中门（中门门体可穿过）、猫道、B洞、B点
import type { Box, Zone, NavNode } from './types'

export const WORLD = {
  /** 地图边界 */
  minX: -30,
  maxX: 30,
  minZ: -42,
  maxZ: 34,
  floorY: 0,
  /** 天空盒颜色 */
  sky: 0x9db4c8,
  fog: 0xa8bccd
}

/** 地图的可行走面（多层高度） */
export interface Floor {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
  y: number
  zone: Zone
}

export const FLOORS: Floor[] = [
  // T 出生点
  { minX: 4, maxX: 24, minZ: 20, maxZ: 30, y: 0, zone: 'tSpawn' },
  // T 出点通道（连接 T 家与中路）
  { minX: 8, maxX: 16, minZ: 12, maxZ: 20, y: 0, zone: 'tSpawn' },
  // 中路（开放区域）
  { minX: 2, maxX: 16, minZ: -6, maxZ: 12, y: 0, zone: 'mid' },
  // 中门门体（可穿过的门框空间）
  { minX: 6, maxX: 12, minZ: -8, maxZ: -6, y: 0, zone: 'midDoors' },
  // CT 出生点
  { minX: -12, maxX: -2, minZ: 14, maxZ: 26, y: 0, zone: 'ctSpawn' },
  // CT 家到中路的连接（原设计只在中路边缘单点相接，导致导航图分裂，
  // 此处改为一条完整的下沉通道，CT 才可往返中路与 A 点）
  { minX: -8, maxX: 2, minZ: 8, maxZ: 16, y: 0, zone: 'ctSpawn' },
  { minX: -6, maxX: 4, minZ: 4, maxZ: 10, y: 0, zone: 'ctSpawn' },
  { minX: -4, maxX: 6, minZ: 0, maxZ: 6, y: 0, zone: 'ctSpawn' },
  // A 大（长道）
  { minX: 12, maxX: 24, minZ: -22, maxZ: 6, y: 0, zone: 'longA' },
  // A 点平台
  { minX: 6, maxX: 24, minZ: -30, maxZ: -20, y: 1.2, zone: 'aSite' },
  // A 大斜坡（连接地面与 A 点高台）
  { minX: 16, maxX: 22, minZ: -20, maxZ: -14, y: 0.6, zone: 'aRamp' },
  // A 点到中路的连接（A 短道）
  { minX: 2, maxX: 10, minZ: -20, maxZ: -8, y: 0, zone: 'mid' },
  // 猫道（连接中路与 A 点，抬升）
  { minX: 10, maxX: 16, minZ: -14, maxZ: -8, y: 2.4, zone: 'catwalk' },
  // 猫道下坡段：把抬高的猫道接回地面层的 A 短道与 A 点，
  // 否则猫道与 A 点之间出现高度断层，导航图会分裂成两个互不连通的区域。
  { minX: 9, maxX: 16, minZ: -18, maxZ: -14, y: 1.8, zone: 'catwalk' },
  { minX: 8, maxX: 16, minZ: -21, maxZ: -18, y: 1.2, zone: 'catwalk' },
  // B 洞（B 通道）
  { minX: -26, maxX: -14, minZ: 8, maxZ: 20, y: 0, zone: 'bTunnels' },
  // B 点平台
  { minX: -26, maxX: -12, minZ: -8, maxZ: 8, y: 1.2, zone: 'bSite' },
  // B 洞到 B 点的连接
  { minX: -22, maxX: -16, minZ: 8, maxZ: 12, y: 0.6, zone: 'bTunnels' },
  // B 点后场
  { minX: -20, maxX: -10, minZ: -12, maxZ: -6, y: 0, zone: 'bSite' },
  // B 门（连接 B 点与中路）
  { minX: -10, maxX: -4, minZ: -6, maxZ: -2, y: 0, zone: 'bDoors' },
  // B 点到中路（经 B 门，穿过 x[0,2] 隔墙缺口）
  { minX: -6, maxX: 6, minZ: -3, maxZ: 5, y: 0, zone: 'bDoors' }
]

/** 碰撞墙体 */
export const WALLS: Box[] = [
  // 外围边界（留出缺口作为通道）
  // 北边界（T 家方向）
  { minX: -30, maxX: 30, minY: 0, maxY: 6, minZ: 30, maxZ: 34, tall: true },
  { minX: -30, maxX: 4, minY: 0, maxY: 6, minZ: 20, maxZ: 30, tall: true },
  { minX: 24, maxX: 30, minY: 0, maxY: 6, minZ: 20, maxZ: 34, tall: true },
  // 南边界
  { minX: -30, maxX: 30, minY: 0, maxY: 6, minZ: -42, maxZ: -38, tall: true },
  // 西边界
  { minX: -30, maxX: -26, minY: 0, maxY: 6, minZ: -38, maxZ: 30, tall: true },
  // 东边界
  { minX: 26, maxX: 30, minY: 0, maxY: 6, minZ: -38, maxZ: 30, tall: true },

  // T 家隔断
  { minX: 4, maxX: 6, minY: 0, maxY: 3, minZ: 12, maxZ: 20, tall: false },
  { minX: 16, maxX: 18, minY: 0, maxY: 3, minZ: 12, maxZ: 20, tall: false },

  // 中路西侧隔墙。原设计自 z=-6 连续到 z=12，把 B 洞与中路彻底隔开，
  // 造成导航图分裂为两块；现改为分段，中路与 B 洞之间留出可穿行的 B 门通道。
  { minX: 0, maxX: 2, minY: 0, maxY: 4, minZ: 2, maxZ: 12, tall: true },
  { minX: 16, maxX: 18, minY: 0, maxY: 4, minZ: -8, maxZ: 6, tall: true },

  // 中门门体：左右门柱 + 上方门楣，正中留出可穿过空间
  { minX: 5, maxX: 7, minY: 0, maxY: 4, minZ: -8, maxZ: -6, tall: false },
  { minX: 11, maxX: 13, minY: 0, maxY: 4, minZ: -8, maxZ: -6, tall: false },
  { minX: 7, maxX: 11, minY: 3.2, maxY: 4, minZ: -8, maxZ: -6, tall: false },

  // A 大箱体（提供掩体与高低差）
  { minX: 15, maxX: 19, minY: 0, maxY: 2.2, minZ: -12, maxZ: -8, tall: false },
  { minX: 19, maxX: 23, minY: 0, maxY: 2.6, minZ: -16, maxZ: -12, tall: false },
  { minX: 14, maxX: 17, minY: 0, maxY: 1.6, minZ: -20, maxZ: -17, tall: false },

  // A 点平台掩体
  { minX: 9, maxX: 13, minY: 1.2, maxY: 3.4, minZ: -28, maxZ: -24, tall: false },
  { minX: 17, maxX: 21, minY: 1.2, maxY: 3.8, minZ: -29, maxZ: -25, tall: false },
  { minX: 13, maxX: 16, minY: 1.2, maxY: 2.8, minZ: -23, maxZ: -21, tall: false },

  // 猫道边墙
  { minX: 9, maxX: 10, minY: 2.4, maxY: 4.4, minZ: -14, maxZ: -8, tall: false },

  // A 短道隔墙
  { minX: 2, maxX: 4, minY: 0, maxY: 3, minZ: -16, maxZ: -10, tall: false },

  // B 洞箱体
  { minX: -22, maxX: -18, minY: 0, maxY: 2.2, minZ: 14, maxZ: 18, tall: false },
  { minX: -18, maxX: -15, minY: 0, maxY: 2.0, minZ: 10, maxZ: 13, tall: false },

  // B 点掩体
  { minX: -24, maxX: -20, minY: 1.2, maxY: 3.4, minZ: -6, maxZ: -2, tall: false },
  { minX: -18, maxX: -14, minY: 1.2, maxY: 3.6, minZ: -4, maxZ: 0, tall: false },
  { minX: -21, maxX: -18, minY: 1.2, maxY: 2.8, minZ: 2, maxZ: 5, tall: false },

  // B 门框：两段门柱夹出朝东的通道，穿过 x[0,2] 隔墙的缺口进入中路
  { minX: -10, maxX: -6, minY: 0, maxY: 4, minZ: -3, maxZ: -1, tall: false },
  { minX: -10, maxX: -6, minY: 0, maxY: 4, minZ: 3, maxZ: 5, tall: false },
  // B 门东侧短墙，封住北侧使其只能从门洞通过
  { minX: 0, maxX: 2, minY: 0, maxY: 4, minZ: 6, maxZ: 12, tall: true },

  // CT 家掩体
  { minX: -10, maxX: -7, minY: 0, maxY: 2.2, minZ: 18, maxZ: 21, tall: false },
  { minX: -5, maxX: -3, minY: 0, maxY: 2.4, minZ: 20, maxZ: 23, tall: false }
]

/** 出生点 */
export const SPAWNS = {
  CT: [
    { x: -10, y: 0, z: 24 },
    { x: -7, y: 0, z: 25 },
    { x: -4, y: 0, z: 24 },
    { x: -9, y: 0, z: 22 },
    { x: -6, y: 0, z: 21 }
  ],
  T: [
    { x: 10, y: 0, z: 27 },
    { x: 14, y: 0, z: 28 },
    { x: 18, y: 0, z: 27 },
    { x: 11, y: 0, z: 25 },
    { x: 16, y: 0, z: 25 }
  ]
}

/** 下包点（A 点 / B 点） */
export const BOMB_SITES = [
  { x: 15, y: 1.2, z: -25, radius: 8, name: 'A' },
  { x: -19, y: 1.2, z: -1, radius: 8, name: 'B' }
]

/** 判断某点属于哪个区域 */
export function zoneAt(x: number, z: number): Zone {
  let best: Zone = 'mid'
  let bestDist = Infinity
  for (const f of FLOORS) {
    if (x >= f.minX && x <= f.maxX && z >= f.minZ && z <= f.maxZ) {
      const d = Math.min(x - f.minX, f.maxX - x) + Math.min(z - f.minZ, f.maxZ - z)
      if (d < bestDist) {
        bestDist = d
        best = f.zone
      }
    }
  }
  return best
}

/** 求某点在某高度层上的支撑面 Y；无支撑返回 null */
export function floorHeightAt(x: number, z: number, nearY: number): number | null {
  let best: number | null = null
  let bestDiff = Infinity
  for (const f of FLOORS) {
    if (x >= f.minX && x <= f.maxX && z >= f.minZ && z <= f.maxZ) {
      const d = Math.abs(f.y - nearY)
      if (d < bestDiff) {
        bestDiff = d
        best = f.y
      }
    }
  }
  return best
}

/** 该点是否在任一可行走面上 */
export function isWalkable(x: number, z: number): boolean {
  for (const f of FLOORS) {
    if (x >= f.minX && x <= f.maxX && z >= f.minZ && z <= f.maxZ) return true
  }
  return false
}

/**
 * 构建导航网格：对手行走面采样，剔除落入墙体内部的点，
 * 再按同区域/邻近关系连边，供 AI 寻路。
 */
export function buildNavGraph(): NavNode[] {
  const STEP = 2
  const nodes: NavNode[] = []
  const index = new Map<string, number>()

  // 采样候选点
  for (let x = WORLD.minX + 2; x <= WORLD.maxX - 2; x += STEP) {
    for (let z = WORLD.minZ + 2; z <= WORLD.maxZ - 2; z += STEP) {
      if (!isWalkable(x, z)) continue
      // 排除被墙体占据的点
      if (pointInWall(x, z, 0.8)) continue
      const id = nodes.length
      nodes.push({ id, x, z, links: [], zone: zoneAt(x, z) })
      index.set(`${x},${z}`, id)
    }
  }

  // 连边：邻接且视线可达
  const DIRS = [
    [STEP, 0],
    [-STEP, 0],
    [0, STEP],
    [0, -STEP],
    [STEP, STEP],
    [-STEP, -STEP],
    [STEP, -STEP],
    [-STEP, STEP]
  ]
  for (const n of nodes) {
    for (const [dx, dz] of DIRS) {
      const nx = n.x + dx
      const nz = n.z + dz
      const jid = index.get(`${nx},${nz}`)
      if (jid === undefined) continue
      if (!hasLineOfSight(n.x, n.z, nx, nz)) continue
      if (!n.links.includes(jid)) n.links.push(jid)
    }
  }
  return nodes
}

/** 点是否落在任一墙体内部（含缓冲半径） */
export function pointInWall(x: number, z: number, pad = 0): boolean {
  for (const w of WALLS) {
    // 只考虑从地面向上可阻挡的墙体
    if (w.minY > 3.0) continue
    if (x > w.minX - pad && x < w.maxX + pad && z > w.minZ - pad && z < w.maxZ + pad) {
      return true
    }
  }
  return false
}

/** 2D 视线检测（采样若干点） */
export function hasLineOfSight(
  x0: number,
  z0: number,
  x1: number,
  z1: number,
  steps = 14
): boolean {
  const dx = x1 - x0
  const dz = z1 - z0
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    const px = x0 + dx * t
    const pz = z0 + dz * t
    if (pointInWall(px, pz, 0.2)) return false
  }
  return true
}

/** A* 寻路，返回节点路径 */
export function findPath(
  nav: NavNode[],
  startX: number,
  startZ: number,
  goalX: number,
  goalZ: number
): { x: number; z: number }[] {
  if (nav.length === 0) return [{ x: goalX, z: goalZ }]
  // 找最近起点与终点
  let si = 0
  let gi = 0
  let sd = Infinity
  let gd = Infinity
  for (const n of nav) {
    const d = (n.x - startX) ** 2 + (n.z - startZ) ** 2
    if (d < sd) {
      sd = d
      si = n.id
    }
    const d2 = (n.x - goalX) ** 2 + (n.z - goalZ) ** 2
    if (d2 < gd) {
      gd = d2
      gi = n.id
    }
  }
  if (si === gi) return [{ x: goalX, z: goalZ }]

  const n = nav.length
  const gScore = new Float64Array(n).fill(Infinity)
  const fScore = new Float64Array(n).fill(Infinity)
  const cameFrom = new Int32Array(n).fill(-1)
  const closed = new Uint8Array(n)
  const h = (id: number) => Math.hypot(nav[id].x - goalX, nav[id].z - goalZ)

  gScore[si] = 0
  fScore[si] = h(si)
  const open: number[] = [si]

  while (open.length) {
    // 取 f 最小
    let bi = 0
    for (let i = 1; i < open.length; i++) {
      if (fScore[open[i]] < fScore[open[bi]]) bi = i
    }
    const cur = open.splice(bi, 1)[0]
    if (cur === gi) break
    closed[cur] = 1
    for (const nb of nav[cur].links) {
      if (closed[nb]) continue
      const g = gScore[cur] + Math.hypot(nav[cur].x - nav[nb].x, nav[cur].z - nav[nb].z)
      if (g < gScore[nb]) {
        cameFrom[nb] = cur
        gScore[nb] = g
        fScore[nb] = g + h(nb)
        if (!open.includes(nb)) open.push(nb)
      }
    }
  }

  // 回溯
  const path: { x: number; z: number }[] = []
  let cur = gi
  if (cameFrom[gi] === -1 && gi !== si) return [{ x: goalX, z: goalZ }]
  while (cur !== -1 && cur !== si) {
    path.unshift({ x: nav[cur].x, z: nav[cur].z })
    cur = cameFrom[cur]
  }
  path.push({ x: goalX, z: goalZ })
  return path
}

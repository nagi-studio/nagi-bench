// AI 状态机：巡逻、索敌、交火、下包、拆包
import * as THREE from 'three'
import type { Entity, NavNode, Zone } from './types'
import { BOMB_SITES, buildNavGraph, findPath, zoneAt, hasLineOfSight, floorHeightAt } from './map'
import { canSee } from './scene'

export const NAV: NavNode[] = buildNavGraph()

/** 各区域的进攻/防守目标点 */
const T_ROUTES: Record<string, { x: number; z: number }[]> = {
  a: [
    { x: 18, z: -4 },
    { x: 20, z: -14 },
    { x: 18, z: -22 },
    { x: 15, z: -25 }
  ],
  mid: [
    { x: 10, z: 8 },
    { x: 9, z: -2 },
    { x: 9, z: -6 },
    { x: 5, z: -12 }
  ],
  b: [
    { x: 6, z: 22 },
    { x: -6, z: 22 },
    { x: -18, z: 16 },
    { x: -20, z: 2 },
    { x: -19, z: -1 }
  ],
  catwalk: [
    { x: 12, z: 6 },
    { x: 13, z: -6 },
    { x: 13, z: -11 },
    { x: 14, z: -18 }
  ]
}

const CT_HOLD: Record<string, { x: number; z: number }[]> = {
  a: [{ x: 15, z: -25 }, { x: 20, z: -23 }, { x: 12, z: -26 }],
  mid: [{ x: 9, z: -5 }, { x: 8, z: 4 }, { x: 13, z: -12 }],
  b: [{ x: -19, z: -1 }, { x: -22, z: 2 }, { x: -16, z: 4 }],
  catwalk: [{ x: 13, z: -12 }, { x: 14, z: -20 }]
}

let aiIdCounter = 0

export function makeAIDecision(
  self: Entity,
  all: Entity[],
  bombPlanted: boolean,
  bombPos: { x: number; y: number; z: number } | null,
  time: number
): void {
  const opp = all.filter((e) => e.alive && e.team !== self.team)

  // 决策节流：每 0.18~0.35 秒重算一次，避免抖动
  if (time < self.aiNextThink) return
  self.aiNextThink = time + 0.18 + Math.random() * 0.17

  // --- 可见敌人：优先交火 ---
  let visible: Entity | null = null
  let bestDist = Infinity
  for (const e of opp) {
    const d = Math.hypot(e.pos.x - self.pos.x, e.pos.z - self.pos.z)
    // 视野：距离 + 视线
    if (d > 52) continue
    if (!canSee(self.pos.x, self.pos.y + 1.5, self.pos.z, e.pos.x, e.pos.y + 1.2, e.pos.z)) {
      continue
    }
    if (d < bestDist) {
      bestDist = d
      visible = e
    }
  }

  if (visible) {
    self.aiState = 'engage'
    self.aiTarget = visible.id
    return
  }

  // --- 炸弹已安放：CT 去拆包，T 去守包 ---
  if (bombPlanted && bombPos) {
    if (self.team === 'CT') {
      const d = Math.hypot(bombPos.x - self.pos.x, bombPos.z - self.pos.z)
      if (d < 1.8) {
        self.aiState = 'defuse'
        return
      }
      self.aiState = 'toBomb'
      self.aiPath = findPath(NAV, self.pos.x, self.pos.z, bombPos.x, bombPos.z)
      self.aiPathIdx = 0
      return
    }
    // T 守包：在附近游走
    self.aiState = 'holdBomb'
    const spot = {
      x: bombPos.x + (Math.random() - 0.5) * 6,
      z: bombPos.z + (Math.random() - 0.5) * 6
    }
    self.aiPath = findPath(NAV, self.pos.x, self.pos.z, spot.x, spot.z)
    self.aiPathIdx = 0
    return
  }

  // --- 常规进攻 / 防守 ---
  if (self.team === 'T') {
    // 持包者或全部推进：选择一条路线
    const routeName = pickRoute(self, all)
    const route = T_ROUTES[routeName]
    const idx = Math.min(route.length - 1, Math.floor(route.length * 0.4))
    const tgt = route[idx]
    self.aiState = 'push'
    if (Math.hypot(tgt.x - self.pos.x, tgt.z - self.pos.z) > 2.2) {
      self.aiPath = findPath(NAV, self.pos.x, self.pos.z, tgt.x, tgt.z)
      self.aiPathIdx = 0
    } else {
      // 到达中段则推进到下包点
      const site = BOMB_SITES[routeName === 'b' ? 1 : 0]
      if (
        Math.hypot(site.x - self.pos.x, site.z - self.pos.z) < site.radius &&
        self.hasBomb
      ) {
        self.aiState = 'plant'
      } else {
        self.aiPath = findPath(NAV, self.pos.x, self.pos.z, site.x, site.z)
        self.aiPathIdx = 0
      }
    }
  } else {
    // CT 分区防守
    const zone = pickHoldZone(self)
    const holds = CT_HOLD[zone]
    const h = holds[Math.floor(Math.random() * holds.length)]
    self.aiState = 'hold'
    if (Math.hypot(h.x - self.pos.x, h.z - self.pos.z) > 2.4) {
      self.aiPath = findPath(NAV, self.pos.x, self.pos.z, h.x, h.z)
      self.aiPathIdx = 0
    }
  }
  void aiIdCounter
}

function pickRoute(self: Entity, all: Entity[]): string {
  const zone = zoneAt(self.pos.x, self.pos.z)
  if (zone === 'bTunnels' || zone === 'bDoors') return 'b'
  if (zone === 'catwalk' || zone === 'aRamp') return 'catwalk'
  if (zone === 'longA') return 'a'
  // 持包者倾向先清中路再转 A，其余分散
  const names = ['a', 'mid', 'b', 'catwalk']
  if (self.hasBomb) {
    // 包不落 B 时优先 A 路
    return Math.random() < 0.62 ? 'a' : 'mid'
  }
  void all
  return names[Math.floor(Math.random() * names.length)]
}

function pickHoldZone(self: Entity): string {
  const zone = zoneAt(self.pos.x, self.pos.z)
  switch (zone) {
    case 'aSite':
    case 'aRamp':
      return 'a'
    case 'bSite':
    case 'bTunnels':
      return 'b'
    case 'catwalk':
      return 'catwalk'
    default:
      return 'mid'
  }
}

/** 沿路径推进，返回期望的朝向角 */
export function followPath(
  self: Entity,
  dt: number,
  speed: number
): { moveYaw: number; shouldFire: boolean } | null {
  if (self.aiPathIdx >= self.aiPath.length) return null
  const node = self.aiPath[self.aiPathIdx]
  const dx = node.x - self.pos.x
  const dz = node.z - self.pos.z
  const d = Math.hypot(dx, dz)
  if (d < 0.8) {
    self.aiPathIdx++
    return null
  }
  const moveYaw = Math.atan2(-dx, -dz)
  void dt
  void speed
  return { moveYaw, shouldFire: false }
}

/** 朝某实体转身 */
export function faceTarget(self: Entity, target: Entity, dt: number, turnRate = 7): void {
  const dx = target.pos.x - self.pos.x
  const dz = target.pos.z - self.pos.z
  const dy = target.pos.y + 1.2 - (self.pos.y + 1.5)
  const want = Math.atan2(-dx, -dz)
  let diff = want - self.yaw
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  self.yaw += Math.max(-turnRate * dt, Math.min(turnRate * dt, diff))
  self.pitch += Math.max(-turnRate * dt, Math.min(turnRate * dt, Math.atan2(dy, Math.hypot(dx, dz)) - self.pitch))
}

/** 是否该向目标开火（角度足够 + 距离内） */
export function shouldShootAt(self: Entity, target: Entity): boolean {
  const dx = target.pos.x - self.pos.x
  const dz = target.pos.z - self.pos.z
  const dist = Math.hypot(dx, dz)
  if (dist > 46) return false
  if (!canSee(self.pos.x, self.pos.y + 1.5, self.pos.z, target.pos.x, target.pos.y + 1.2, target.pos.z)) {
    return false
  }
  const want = Math.atan2(-dx, -dz)
  let diff = want - self.yaw
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  return Math.abs(diff) < 0.16
}

/** AI 视线判断：是否能看到目标 */
export function aiCanSee(self: Entity, target: Entity): boolean {
  if (!target.alive) return false
  const d = Math.hypot(target.pos.x - self.pos.x, target.pos.z - self.pos.z)
  if (d > 52) return false
  return canSee(self.pos.x, self.pos.y + 1.6, self.pos.z, target.pos.x, target.pos.y + 1.4, target.pos.z)
}

/** 供 AI 判断能否到达的高度层 */
export function reachableHeight(x: number, z: number, fromY: number): number {
  return floorHeightAt(x, z, fromY) ?? fromY
}

/** 导出便于测试 */
export { hasLineOfSight }

import { CELL, COLS, ROWS } from '../config.ts'
import type { Vec2 } from '../core/mathUtil.ts'

const rep = (ch: string, n: number): string => ch.repeat(n)
const row = (...parts: string[]): string => parts.join('')

/**
 * Dust2 核心区域的俯视布局（每格 2m）。北 = 上方（-Z），南 = 下方（+Z），东 = 右方（+X）。
 *
 *   #  墙体（高 3.4m，不可穿越）
 *   .  可行走地面
 *   x  箱子（高 1m，可跳上）
 *   l  矮墙 / 掩体（高 1m）
 *   D  中门门洞（门体为可开关的旋转门，关闭时阻挡）
 *   A  A 点（炸弹点）     B  B 点（炸弹点）
 *   T  T 出生区           C  CT 出生区
 *
 * 通道关系（与 Dust2 一致的走位）：
 *   T 出生 → 长 A（东侧长廊）→ A 点；T 出生 → B 洞（西侧）→ B 点；
 *   T 出生 → 中门 → 中路 → 猫道 → B 点；中路 → 短 A（北侧横廊）→ A 点 / CT 出生；
 *   CT 出生 → 上 B 洞（上通道）→ B 点。
 */
export const LAYOUT: string[] = [
  rep('#', 52), //  0
  rep('#', 52), //  1
  row('##', rep('C', 13), rep('#', 23), rep('A', 12), '##'), //  2
  row('##', rep('C', 13), rep('#', 23), rep('A', 12), '##'), //  3
  row('##', rep('C', 13), rep('.', 23), rep('A', 12), '##'), //  4
  row('##', rep('C', 13), rep('.', 23), rep('A', 12), '##'), //  5
  row('##', rep('C', 13), rep('.', 9), 'll', rep('.', 12), rep('A', 12), '##'), //  6
  row('##', rep('C', 13), rep('.', 23), rep('A', 12), '##'), //  7
  row('##', rep('C', 13), rep('.', 23), rep('A', 12), '##'), //  8
  row('##', rep('C', 13), rep('#', 11), rep('.', 5), rep('#', 7), rep('A', 12), '##'), //  9
  row('##', rep('C', 13), rep('#', 11), rep('.', 5), rep('#', 7), rep('A', 12), '##'), // 10
  row('##', rep('.', 12), rep('#', 12), rep('.', 5), rep('#', 7), rep('A', 12), '##'), // 11
  row('##', rep('.', 12), rep('#', 12), rep('.', 5), rep('#', 14), rep('.', 5), '##'), // 12
  row('##', rep('B', 12), rep('#', 5), rep('.', 20), rep('#', 6), rep('.', 5), '##'), // 13
  row('##', rep('B', 12), rep('#', 5), rep('.', 20), rep('#', 6), rep('.', 5), '##'), // 14
  row('##', 'BB', 'xx', rep('B', 8), rep('#', 5), rep('.', 20), rep('#', 6), rep('.', 5), '##'), // 15
  row('##', 'BB', 'xx', rep('B', 8), rep('#', 5), rep('.', 20), rep('#', 6), rep('.', 5), '##'), // 16
  row('##', rep('B', 12), rep('#', 5), rep('.', 13), 'xx', rep('.', 5), rep('#', 6), rep('.', 5), '##'), // 17
  row('##', rep('B', 12), rep('#', 5), rep('.', 20), rep('#', 6), rep('.', 5), '##'), // 18
  row('##', rep('B', 12), rep('.', 25), rep('#', 6), rep('.', 5), '##'), // 19 猫道
  row('##', rep('B', 12), rep('.', 13), 'll', rep('.', 10), rep('#', 6), rep('.', 5), '##'), // 20
  row('##', rep('B', 12), rep('#', 5), rep('.', 31), '##'), // 21 中路 ↔ 长 A 连通口
  row('##', rep('B', 12), rep('#', 5), rep('.', 31), '##'), // 22
  row('##', rep('B', 7), 'xx', rep('B', 3), rep('#', 5), rep('.', 20), rep('#', 6), rep('.', 5), '##'), // 23
  row('##', rep('B', 7), 'xx', rep('B', 3), rep('#', 5), rep('.', 20), rep('#', 6), rep('.', 5), '##'), // 24
  row('##', rep('B', 12), rep('#', 5), rep('.', 20), rep('#', 6), rep('.', 5), '##'), // 25
  row('##', rep('.', 12), rep('#', 5), rep('.', 20), rep('#', 6), rep('.', 5), '##'), // 26 B 洞入口
  row('##', rep('.', 12), rep('#', 5), rep('.', 20), rep('#', 6), rep('.', 5), '##'), // 27
  row('##', rep('.', 16), rep('#', 6), 'DD', rep('#', 4), 'DD', rep('#', 13), rep('.', 5), '##'), // 28 中门
  row('##', rep('.', 16), '#', rep('.', 25), '#', rep('.', 5), '##'), // 29
  row('##', rep('.', 16), '#', rep('.', 25), '#', rep('.', 5), '##'), // 30
  row('##', rep('.', 16), '#', rep('.', 25), '#', rep('.', 5), '##'), // 31
  row('##', rep('.', 6), 'xx', rep('.', 8), '#', rep('.', 25), '#', rep('.', 5), '##'), // 32
  row('##', rep('.', 6), 'xx', rep('.', 8), '#', rep('.', 25), '#', rep('.', 5), '##'), // 33
  row('##', rep('.', 16), '#', rep('.', 8), 'll', rep('.', 15), '#', rep('.', 5), '##'), // 34
  row('##', rep('.', 16), '#', rep('.', 25), '#', rep('.', 5), '##'), // 35
  row('##', rep('.', 16), '#', rep('.', 25), '#', rep('.', 5), '##'), // 36
  row('##', rep('.', 16), '#', rep('.', 25), '#', rep('.', 5), '##'), // 37
  row('##', rep('#', 12), rep('.', 36), '##'), // 38
  row('##', rep('#', 12), rep('.', 36), '##'), // 39
  row('##', rep('#', 12), rep('.', 8), rep('T', 15), rep('.', 13), '##'), // 40 T 出生
  row('##', rep('#', 12), rep('.', 8), rep('T', 15), rep('.', 13), '##'), // 41
  row('##', rep('#', 12), rep('.', 8), rep('T', 15), rep('.', 13), '##'), // 42
  row('##', rep('#', 12), rep('.', 8), rep('T', 15), rep('.', 13), '##'), // 43
  row('##', rep('#', 12), rep('.', 8), rep('T', 15), rep('.', 13), '##'), // 44
  row('##', rep('#', 12), rep('.', 8), rep('T', 15), rep('.', 13), '##'), // 45
  row('##', rep('#', 12), rep('.', 8), rep('T', 15), rep('.', 13), '##'), // 46
  rep('#', 52), // 47
]

/** 语义化的关键点（格子坐标 [col, row]）。AI 巡逻 / 守点 / 寻路目标都从这里取。 */
export const NAMED_POINTS = {
  tSpawn: [30, 43],
  ctSpawn: [8, 6],
  aSite: [43, 6],
  bSite: [7, 19],
  aEntrance: [40, 6],
  bEntrance: [8, 27],
  longA: [47, 22],
  longABottom: [47, 38],
  mid: [28, 19],
  midHold: [28, 16],
  midDoorsNorth: [27, 26],
  midDoorsSouth: [27, 30],
  catwalk: [16, 19],
  catHold: [21, 19],
  bTunnel: [5, 31],
  lowerMid: [30, 34],
  shortA: [26, 6],
  upperTunnel: [8, 11],
  midTop: [28, 10],
  aHoldA: [42, 4],
  aHoldB: [40, 9],
  bHoldA: [7, 16],
  bHoldB: [10, 21],
} as const

export type NamedPoint = keyof typeof NAMED_POINTS

/** 格子左边缘的世界 X（地图中心在原点） */
export function cellLeft(c: number): number {
  return (c - COLS / 2) * CELL
}

/** 格子上边缘的世界 Z */
export function cellTop(r: number): number {
  return (r - ROWS / 2) * CELL
}

export function cellCenter(c: number, r: number): Vec2 {
  return { x: cellLeft(c) + CELL / 2, z: cellTop(r) + CELL / 2 }
}

export function namedPoint(name: NamedPoint): Vec2 {
  const [c, r] = NAMED_POINTS[name]
  return cellCenter(c, r)
}

export function worldToCell(x: number, z: number): { c: number; r: number } {
  return { c: Math.floor(x / CELL + COLS / 2), r: Math.floor(z / CELL + ROWS / 2) }
}

export function charAt(c: number, r: number): string {
  if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return '#'
  return LAYOUT[r][c]
}

/** 世界坐标所在的炸弹点（A/B），不在炸弹点上则为 null */
export function siteAtWorld(x: number, z: number): 'A' | 'B' | null {
  const { c, r } = worldToCell(x, z)
  const ch = charAt(c, r)
  return ch === 'A' || ch === 'B' ? ch : null
}

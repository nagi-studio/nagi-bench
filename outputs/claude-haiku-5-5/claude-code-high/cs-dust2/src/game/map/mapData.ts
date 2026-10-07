import { CELL, COLS, CRATE_HEIGHT, LOW_WALL_HEIGHT, ROWS, WALL_HEIGHT } from '../config.ts'
import { LAYOUT, cellLeft, cellTop } from './layout.ts'
import type { Aabb } from '../physics/physics.ts'

export type RectKind = 'wall' | 'crate' | 'low'

/** 同类相邻格子合并后的矩形（网格坐标，包含端点） */
export interface MapRect {
  kind: RectKind
  c0: number
  c1: number
  r0: number
  r1: number
}

/** 中门：一段连续的 'D' 格子，铰链在西端，开启时绕铰链旋转 90° */
export interface DoorDef {
  id: number
  r: number
  c0: number
  c1: number
  hingeX: number
  hingeZ: number
  length: number
  collider: Aabb
}

export interface MapData {
  rects: MapRect[]
  doors: DoorDef[]
  colliders: Aabb[]
}

const KIND_OF: Record<string, RectKind> = { '#': 'wall', x: 'crate', l: 'low' }
const DOOR_THICKNESS = 0.3

function assertLayout(): void {
  if (LAYOUT.length !== ROWS) throw new Error(`layout has ${LAYOUT.length} rows, expected ${ROWS}`)
  LAYOUT.forEach((line, r) => {
    if (line.length !== COLS) throw new Error(`layout row ${r} has ${line.length} cols, expected ${COLS}`)
  })
}

/** 把布局字符串转换成合并矩形、碰撞体与门。纯函数，可在 Node 中单测。 */
export function buildMapData(): MapData {
  assertLayout()
  const seen = new Uint8Array(COLS * ROWS)
  const kindAt = (c: number, r: number): RectKind | undefined => KIND_OF[LAYOUT[r][c]]
  const rects: MapRect[] = []

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const kind = kindAt(c, r)
      if (!kind || seen[r * COLS + c]) continue
      // 先向右扩展，再向下扩展，得到贪心矩形
      let c1 = c
      while (c1 + 1 < COLS && !seen[r * COLS + c1 + 1] && kindAt(c1 + 1, r) === kind) c1++
      let r1 = r
      grow: while (r1 + 1 < ROWS) {
        for (let cc = c; cc <= c1; cc++) {
          if (seen[(r1 + 1) * COLS + cc] || kindAt(cc, r1 + 1) !== kind) break grow
        }
        r1++
      }
      for (let rr = r; rr <= r1; rr++) for (let cc = c; cc <= c1; cc++) seen[rr * COLS + cc] = 1
      rects.push({ kind, c0: c, c1, r0: r, r1 })
    }
  }

  const colliders: Aabb[] = rects.map((rc) => {
    const height = rc.kind === 'wall' ? WALL_HEIGHT : rc.kind === 'crate' ? CRATE_HEIGHT : LOW_WALL_HEIGHT
    return {
      minX: cellLeft(rc.c0),
      maxX: cellLeft(rc.c1 + 1),
      minY: 0,
      maxY: height,
      minZ: cellTop(rc.r0),
      maxZ: cellTop(rc.r1 + 1),
      active: true,
      tag: rc.kind,
    }
  })

  const doors: DoorDef[] = []
  for (let r = 0; r < ROWS; r++) {
    let c = 0
    while (c < COLS) {
      if (LAYOUT[r][c] !== 'D') { c++; continue }
      const c0 = c
      while (c + 1 < COLS && LAYOUT[r][c + 1] === 'D') c++
      const c1 = c
      const hingeX = cellLeft(c0)
      const hingeZ = cellTop(r) + CELL / 2
      const length = (c1 - c0 + 1) * CELL
      const collider: Aabb = {
        minX: hingeX,
        maxX: hingeX + length,
        minY: 0,
        maxY: WALL_HEIGHT,
        minZ: hingeZ - DOOR_THICKNESS / 2,
        maxZ: hingeZ + DOOR_THICKNESS / 2,
        active: true,
        tag: 'door',
      }
      doors.push({ id: doors.length, r, c0, c1, hingeX, hingeZ, length, collider })
      colliders.push(collider)
      c++
    }
  }

  return { rects, doors, colliders }
}

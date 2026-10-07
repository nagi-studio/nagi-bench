import * as THREE from 'three'
import { CELL, COLS, CRATE_HEIGHT, LOW_WALL_HEIGHT, ROWS, WALL_HEIGHT } from '../config.ts'
import { LAYOUT, cellLeft, cellTop } from '../map/layout.ts'
import type { MapData } from '../map/mapData.ts'
import { mat } from './models.ts'

const FLOOR_COLORS: Record<string, [number, number, number]> = {
  '.': [0.8, 0.69, 0.48],
  D: [0.8, 0.69, 0.48],
  A: [0.86, 0.66, 0.4],
  B: [0.76, 0.66, 0.44],
  T: [0.7, 0.55, 0.34],
  C: [0.6, 0.66, 0.72],
}

const RECT_COLORS: Record<string, string> = {
  wall: '#b08a5e',
  crate: '#8a6236',
  low: '#8e8a7e',
}

export interface MapVisual {
  group: THREE.Group
  /** 与 map.doors 一一对应的门枢轴（旋转 Y 轴） */
  doorPivots: THREE.Group[]
}

/** 地面：每个非墙格子一个带顶点色的四边形，合并为一个 BufferGeometry */
function buildFloor(): THREE.Mesh {
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ch = LAYOUT[r][c]
      const col = FLOOR_COLORS[ch]
      if (!col) continue
      const x0 = cellLeft(c)
      const x1 = x0 + CELL
      const z0 = cellTop(r)
      const z1 = z0 + CELL
      const base = positions.length / 3
      positions.push(x0, 0, z0, x1, 0, z0, x1, 0, z1, x0, 0, z1)
      for (let k = 0; k < 4; k++) colors.push(col[0], col[1], col[2])
      indices.push(base, base + 2, base + 1, base, base + 3, base + 2)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }))
  mesh.receiveShadow = true
  return mesh
}

/** 静态碰撞体对应的可视网格（墙 / 箱子 / 矮墙） */
function buildBlocks(map: MapData, group: THREE.Group): void {
  for (const rc of map.rects) {
    const x0 = cellLeft(rc.c0)
    const x1 = cellLeft(rc.c1 + 1)
    const z0 = cellTop(rc.r0)
    const z1 = cellTop(rc.r1 + 1)
    const h = rc.kind === 'wall' ? WALL_HEIGHT : rc.kind === 'crate' ? CRATE_HEIGHT : LOW_WALL_HEIGHT
    const geo = new THREE.BoxGeometry(x1 - x0, h, z1 - z0)
    const m = new THREE.Mesh(geo, mat(RECT_COLORS[rc.kind], 0.9))
    m.position.set((x0 + x1) / 2, h / 2, (z0 + z1) / 2)
    m.castShadow = true
    m.receiveShadow = true
    group.add(m)
    if (rc.kind !== 'wall') {
      // 箱子 / 矮墙顶部压一条亮边，便于辨认可踩的高度
      const top = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 - 0.1, 0.04, z1 - z0 - 0.1), mat('#c9a06a', 0.7))
      top.position.set((x0 + x1) / 2, h + 0.02, (z0 + z1) / 2)
      group.add(top)
    }
  }
}

/** 炸弹点地面标记（A / B 的边框线，帮助辨认炸弹点） */
function buildSiteMarkers(group: THREE.Group): void {
  for (const [ch, color] of [
    ['A', '#d0503a'],
    ['B', '#3a86d0'],
  ] as const) {
    const pts: number[] = []
    const rows: number[][] = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) if (LAYOUT[r][c] === ch) rows.push([c, r])
    }
    if (rows.length === 0) continue
    const minC = Math.min(...rows.map((p) => p[0]))
    const maxC = Math.max(...rows.map((p) => p[0]))
    const minR = Math.min(...rows.map((p) => p[1]))
    const maxR = Math.max(...rows.map((p) => p[1]))
    const x0 = cellLeft(minC) + 0.3
    const x1 = cellLeft(maxC + 1) - 0.3
    const z0 = cellTop(minR) + 0.3
    const z1 = cellTop(maxR + 1) - 0.3
    pts.push(x0, 0.02, z0, x1, 0.02, z0, x1, 0.02, z0, x1, 0.02, z1, x1, 0.02, z1, x0, 0.02, z1, x0, 0.02, z1, x0, 0.02, z0)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    group.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color })))
  }
}

export function buildMapVisual(map: MapData): MapVisual {
  const group = new THREE.Group()
  group.add(buildFloor())
  buildBlocks(map, group)
  buildSiteMarkers(group)

  // 中门：门板（铰链在门洞西端，枢轴位于铰链处，面板沿 +X 延伸）
  const doorPivots: THREE.Group[] = []
  for (const d of map.doors) {
    const pivot = new THREE.Group()
    pivot.position.set(d.hingeX, 0, d.hingeZ)
    const panel = new THREE.Mesh(new THREE.BoxGeometry(d.length - 0.04, WALL_HEIGHT, 0.2), mat('#5b4026', 0.6, 0.3))
    panel.position.set(d.length / 2, WALL_HEIGHT / 2, 0)
    panel.castShadow = true
    panel.receiveShadow = true
    pivot.add(panel)
    // 门框两侧的金属把手，便于识别可开关的门
    const knob = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.22), mat('#c8b070', 0.3, 0.8))
    knob.position.set(d.length - 0.3, 1.1, 0)
    pivot.add(knob)
    group.add(pivot)
    doorPivots.push(pivot)
  }

  // 外墙外的深色底面，避免地图边缘露出天空
  const outer = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat('#2c2a24', 1))
  outer.rotation.x = -Math.PI / 2
  outer.position.y = -0.01
  group.add(outer)

  return { group, doorPivots }
}

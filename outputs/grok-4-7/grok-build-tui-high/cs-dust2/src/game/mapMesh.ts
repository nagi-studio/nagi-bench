import * as THREE from 'three'
import { CELL, COLS, ROWS, idx, type Cell, type MapData, type Zone } from './mapData'

const ZONE_COLOR: Record<Zone, number> = {
  tspawn: 0xc9a56a,
  ctspawn: 0xb7b09a,
  along: 0xd8bc78,
  asite: 0xc49258,
  short: 0xcdb27e,
  mid: 0xd2b48c,
  cat: 0xb5b0a4,
  tunnel: 0x6a6156,
  bsite: 0xb68b62,
  stair: 0xb7a184,
}

export interface MapVisual {
  group: THREE.Group
  doorL: THREE.Mesh
  doorR: THREE.Mesh
  minimap: HTMLCanvasElement
}

export function buildMapVisual(data: MapData): MapVisual {
  const group = new THREE.Group()
  const noise = makeNoise()
  const floor = new THREE.Mesh(buildCellGeo(data.cells, 'floor'), litMat(noise))
  const mass = new THREE.Mesh(buildCellGeo(data.cells, 'mass'), litMat(noise, 0.95))
  const walls = new THREE.Mesh(buildWallGeo(data), litMat(noise, 0.88))
  floor.castShadow = false
  floor.receiveShadow = true
  mass.castShadow = true
  mass.receiveShadow = true
  walls.castShadow = true
  walls.receiveShadow = true
  group.add(floor, mass, walls)

  for (const s of data.world.solids) {
    if (s.tag !== 'crate') continue
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(s.maxX - s.minX, s.maxY - s.minY, s.maxZ - s.minZ),
      new THREE.MeshStandardMaterial({ color: 0x8a552c, roughness: 0.82 }),
    )
    mesh.position.set((s.minX + s.maxX) / 2, (s.minY + s.maxY) / 2, (s.minZ + s.maxZ) / 2)
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
  }

  const doorMat = new THREE.MeshStandardMaterial({ color: 0x9aa3ab, roughness: 0.4, metalness: 0.45 })
  const doorL = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), doorMat)
  const doorR = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), doorMat)
  doorL.castShadow = doorR.castShadow = true
  group.add(doorL, doorR)
  addDoorFrame(group, data.door.centerX, data.door.centerZ)

  for (const label of data.labels) {
    group.add(makeLabel(label.text, label.x, label.y, label.z))
  }
  addSiteMark(group, 10, 0.04, 98, 'A', '#c4492c')
  addSiteMark(group, 82, 0.04, 60, 'B', '#c4492c')

  return { group, doorL, doorR, minimap: bakeMinimap(data.cells) }
}

function litMat(map: THREE.Texture, rough = 0.92): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    vertexColors: true,
    map,
    roughness: rough,
    metalness: 0.02,
  })
}

function makeNoise(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  g.fillStyle = '#d5ccbc'
  g.fillRect(0, 0, 128, 128)
  for (let i = 0; i < 280; i++) {
    const v = 90 + Math.random() * 50
    g.fillStyle = `rgba(${v},${v * 0.92},${v * 0.8},${0.04 + Math.random() * 0.06})`
    g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2)
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

type Bucket = { pos: number[]; nor: number[]; col: number[]; uv: number[] }

function bucket(): Bucket {
  return { pos: [], nor: [], col: [], uv: [] }
}

function pushBox(b: Bucket, minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number, color: number): void {
  const sx = Math.max(0.02, maxX - minX)
  const sy = Math.max(0.02, maxY - minY)
  const sz = Math.max(0.02, maxZ - minZ)
  const geo = new THREE.BoxGeometry(sx, sy, sz)
  geo.translate((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2)
  const pos = geo.getAttribute('position')
  const nor = geo.getAttribute('normal')
  const r = ((color >> 16) & 255) / 255
  const g = ((color >> 8) & 255) / 255
  const bl = (color & 255) / 255
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    b.pos.push(x, y, z)
    b.nor.push(nor.getX(i), nor.getY(i), nor.getZ(i))
    b.col.push(r, g, bl)
    b.uv.push(x / 3, z / 3)
  }
  geo.dispose()
}

function geoFrom(b: Bucket): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(b.pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(b.nor, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(b.col, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(b.uv, 2))
  return g
}

function buildCellGeo(cells: Cell[], kind: 'floor' | 'mass'): THREE.BufferGeometry {
  const b = bucket()
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = cells[idx(c, r)]
      if (!cell.walk) continue
      const x0 = c * CELL
      const x1 = x0 + CELL
      const z0 = r * CELL
      const z1 = z0 + CELL
      const col = ZONE_COLOR[cell.zone]
      if (kind === 'floor') {
        if (cell.stairAxis && Math.abs(cell.y1 - cell.y0) > 0.02) {
          for (let i = 0; i < 2; i++) {
            const yTop = cell.y0 + (cell.y1 - cell.y0) * ((i + 1) / 2)
            let a0 = x0
            let a1 = x1
            let b0 = z0
            let b1 = z1
            if (cell.stairAxis === 'x') {
              const mid = (x0 + x1) / 2
              if (i === 0) a1 = mid
              else a0 = mid
            } else {
              const mid = (z0 + z1) / 2
              if (i === 0) b1 = mid
              else b0 = mid
            }
            pushBox(b, a0, 0, b0, a1, Math.max(0.05, yTop), b1, col)
          }
        } else {
          pushBox(b, x0, cell.floorY - 0.22, z0, x1, cell.floorY, z1, col)
        }
      } else if (cell.floorY > 0.2 && !(cell.stairAxis && Math.abs(cell.y1 - cell.y0) > 0.02)) {
        const side = shade(col, 0.72)
        pushBox(b, x0, 0, z0, x1, cell.floorY - 0.22, z1, side)
      }
    }
  }
  return geoFrom(b)
}

function buildWallGeo(data: MapData): THREE.BufferGeometry {
  const b = bucket()
  let i = 0
  for (const s of data.world.solids) {
    if (s.tag !== 'wall' && s.tag !== 'ceil') continue
    const base = s.tag === 'ceil' ? 0x4e463e : i++ % 3 === 0 ? 0xd9c4a0 : 0xcdb489
    pushBox(b, s.minX, s.minY, s.minZ, s.maxX, s.maxY, s.maxZ, base)
  }
  return geoFrom(b)
}

function shade(color: number, k: number): number {
  const r = Math.min(255, ((color >> 16) & 255) * k)
  const g = Math.min(255, ((color >> 8) & 255) * k)
  const b = Math.min(255, (color & 255) * k)
  return (r << 16) | (g << 8) | b
}

function addDoorFrame(group: THREE.Group, x: number, z: number): void {
  const mat = new THREE.MeshStandardMaterial({ color: 0x6a7278, roughness: 0.5, metalness: 0.4 })
  const pillar = (px: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.7, 0.28), mat)
    m.position.set(px, 1.35, z)
    m.castShadow = true
    group.add(m)
  }
  pillar(x - 2.15)
  pillar(x + 2.15)
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.22, 0.32), mat)
  lintel.position.set(x, 2.75, z)
  group.add(lintel)
}

function makeLabel(text: string, x: number, y: number, z: number): THREE.Sprite {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 64
  const g = c.getContext('2d')!
  g.fillStyle = 'rgba(0,0,0,0.35)'
  g.fillRect(0, 0, 256, 64)
  g.font = 'bold 36px sans-serif'
  g.fillStyle = '#f4efe4'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(text, 128, 34)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }))
  s.position.set(x, y, z)
  s.scale.set(2.4, 0.6, 1)
  return s
}

function addSiteMark(group: THREE.Group, x: number, y: number, z: number, letter: string, color: string): void {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const g = c.getContext('2d')!
  g.fillStyle = 'rgba(0,0,0,0)'
  g.clearRect(0, 0, 256, 256)
  g.strokeStyle = color
  g.lineWidth = 10
  g.strokeRect(16, 16, 224, 224)
  g.font = 'bold 150px sans-serif'
  g.fillStyle = color
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(letter, 128, 136)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }),
  )
  m.rotation.x = -Math.PI / 2
  m.position.set(x, y, z)
  group.add(m)
}

export function bakeMinimap(cells: Cell[]): HTMLCanvasElement {
  const cnv = document.createElement('canvas')
  const scale = 8
  cnv.width = COLS * scale
  cnv.height = ROWS * scale
  const g = cnv.getContext('2d')!
  g.fillStyle = '#1b1712'
  g.fillRect(0, 0, cnv.width, cnv.height)
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = cells[idx(c, r)]
      if (!cell.walk) continue
      const col = ZONE_COLOR[cell.zone]
      g.fillStyle = `#${col.toString(16).padStart(6, '0')}`
      const y = (ROWS - 1 - r) * scale
      g.fillRect(c * scale, y, scale, scale)
      if (cell.zone === 'stair' || cell.zone === 'cat') {
        g.fillStyle = 'rgba(255,255,255,0.18)'
        g.fillRect(c * scale, y, scale, scale)
      }
    }
  }
  return cnv
}

export function syncDoorMesh(mesh: THREE.Mesh, solid: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number }): void {
  mesh.scale.set(Math.max(0.05, solid.maxX - solid.minX), Math.max(0.05, solid.maxY - solid.minY), Math.max(0.05, solid.maxZ - solid.minZ))
  mesh.position.set((solid.minX + solid.maxX) / 2, (solid.minY + solid.maxY) / 2, (solid.minZ + solid.maxZ) / 2)
}

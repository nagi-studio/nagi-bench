import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { Team } from './types'

export const CELL = 2.5
export const GRID = 52
export const WALL_H = 4
const HALF = GRID / 2 // world origin at grid center

export const enum Code { Wall = 0, Floor = 1, TSpawn = 2, CTSpawn = 3, ASite = 4, BSite = 5, Door = 6 }

// ---------------------------------------------------------------------------
// Layout: carved rectangles on a 52x52 grid (col, row; row 0 = north = -Z).
// Regions: T spawn, CT spawn, Long A, A site, mid + mid doors, catwalk (short),
// B tunnels, B site — wired up per the real Dust2 topology.
// ---------------------------------------------------------------------------
type Rect = [x1: number, y1: number, x2: number, y2: number, code: Code]

const RECTS: Rect[] = [
  [2, 2, 13, 12, Code.BSite],     // B 点
  [6, 13, 9, 30, Code.Floor],     // B洞 竖段
  [6, 28, 20, 31, Code.Floor],    // B洞 横段
  [17, 31, 20, 41, Code.Floor],   // B洞 → T 出生点
  [18, 42, 34, 49, Code.TSpawn],  // T 出生点
  [24, 38, 29, 42, Code.Floor],   // T → 中路
  [24, 10, 29, 38, Code.Floor],   // 中路
  [22, 3, 34, 10, Code.CTSpawn],  // CT 出生点
  [13, 10, 25, 13, Code.Floor],   // B门通道 (CT ↔ B)
  [29, 20, 38, 23, Code.Floor],   // 猫道横段
  [35, 10, 38, 23, Code.Floor],   // A小 竖段
  [36, 2, 47, 9, Code.ASite],     // A 点
  [44, 9, 47, 34, Code.Floor],    // A大 竖段
  [30, 34, 47, 38, Code.Floor],   // A大 外围横段
  [30, 38, 34, 42, Code.Floor],   // T → A大
  [34, 3, 36, 7, Code.Floor],     // CT → A 匝道
]

// tunnels get ceilings so B洞 reads as an actual tunnel
const TUNNEL_RECTS: Rect[] = [
  [6, 13, 9, 30, Code.Floor],
  [6, 28, 20, 31, Code.Floor],
]

const CRATES: [c: number, r: number, stack: number][] = [
  // A site
  [40, 4, 2], [41, 4, 1], [40, 5, 1], [44, 7, 1], [37, 3, 1],
  // B site
  [5, 4, 1], [6, 4, 2], [10, 9, 1], [11, 9, 1], [4, 10, 1],
  // mid boxes
  [25, 34, 1], [26, 34, 2],
  // catwalk xbox
  [31, 21, 1],
  // long corner
  [46, 35, 1], [46, 36, 2],
  // tunnels + spawns
  [8, 21, 1], [20, 43, 1], [32, 4, 1],
]

export interface AABB { min: THREE.Vector3; max: THREE.Vector3 }

export class DoorObj {
  center: THREE.Vector3
  totalW: number
  panelW: number
  open01 = 0
  target = 0
  panels: [THREE.Mesh, THREE.Mesh]
  group = new THREE.Group()

  constructor(center: THREE.Vector3, totalW: number) {
    this.center = center
    this.totalW = totalW
    this.panelW = totalW / 2
    const mat = new THREE.MeshStandardMaterial({ color: 0x5c6e60, roughness: 0.7, metalness: 0.3 })
    const geo = new THREE.BoxGeometry(this.panelW, 3.2, 0.25)
    const left = new THREE.Mesh(geo, mat)
    const right = new THREE.Mesh(geo, mat)
    left.castShadow = right.castShadow = true
    this.panels = [left, right]
    this.group.add(left, right)
    // door frame header
    const header = new THREE.Mesh(
      new THREE.BoxGeometry(totalW + 0.6, WALL_H - 3.2, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x8f7f5c, roughness: 0.95 }),
    )
    header.position.set(center.x, 3.2 + (WALL_H - 3.2) / 2, center.z)
    this.group.add(header)
    this.layout()
  }

  private layout() {
    const slide = this.open01 * (this.panelW + 0.3)
    this.panels[0].position.set(this.center.x - this.panelW / 2 - slide, 1.6, this.center.z)
    this.panels[1].position.set(this.center.x + this.panelW / 2 + slide, 1.6, this.center.z)
  }

  /** Returns 'open' | 'close' when the door starts moving (for audio). */
  update(dt: number, positions: THREE.Vector3[]): 'open' | 'close' | null {
    let near = false
    for (const p of positions) {
      const dx = p.x - this.center.x, dz = p.z - this.center.z
      if (dx * dx + dz * dz < 4.2 * 4.2) { near = true; break }
    }
    const prevTarget = this.target
    this.target = near ? 1 : 0
    const before = this.open01
    const k = 1 - Math.exp(-5 * dt)
    this.open01 += (this.target - this.open01) * k
    if (Math.abs(this.open01 - before) > 1e-5) this.layout()
    if (prevTarget !== this.target) return this.target === 1 ? 'open' : 'close'
    return null
  }

  colliders(): AABB[] {
    if (this.open01 > 0.92) return []
    const out: AABB[] = []
    for (const p of this.panels) {
      out.push({
        min: new THREE.Vector3(p.position.x - this.panelW / 2, 0, this.center.z - 0.2),
        max: new THREE.Vector3(p.position.x + this.panelW / 2, 3.2, this.center.z + 0.2),
      })
    }
    return out
  }
}

export interface HoldSpot { pos: THREE.Vector3; look: THREE.Vector3 }

function makeFloorTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  g.fillStyle = '#c9b183'
  g.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 2600; i++) {
    const v = Math.random()
    g.fillStyle = v < 0.5 ? 'rgba(120,98,64,0.14)' : 'rgba(240,226,190,0.12)'
    g.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2.4, 1 + Math.random() * 2.4)
  }
  g.strokeStyle = 'rgba(90,74,50,0.20)'
  g.lineWidth = 1
  g.strokeRect(0.5, 0.5, 255, 255)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(GRID, GRID)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeLetterTexture(text: string, color: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  g.clearRect(0, 0, 128, 128)
  g.font = 'bold 96px sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillStyle = color
  g.fillText(text, 64, 68)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export class GameMap {
  grid = new Uint8Array(GRID * GRID) // Code values
  crateCells = new Set<number>()
  crates: AABB[] = []
  doors: DoorObj[] = []
  group = new THREE.Group()
  spawns: Record<Team, { pos: THREE.Vector3; yaw: number }[]> = { CT: [], T: [] }
  anchors: Record<string, THREE.Vector3> = {}
  holdSpots: { A: HoldSpot[]; B: HoldSpot[]; mid: HoldSpot[] } = { A: [], B: [], mid: [] }
  routes: { A: THREE.Vector3[][]; B: THREE.Vector3[][] } = { A: [], B: [] }
  siteCells: { A: [number, number][]; B: [number, number][] } = { A: [], B: [] }

  constructor() {
    this.buildGrid()
    this.buildVisuals()
    this.buildMeta()
  }

  code(c: number, r: number): Code {
    if (c < 0 || r < 0 || c >= GRID || r >= GRID) return Code.Wall
    return this.grid[r * GRID + c] as Code
  }

  isWall(c: number, r: number): boolean { return this.code(c, r) === Code.Wall }

  isWalkableCell(c: number, r: number): boolean {
    return this.code(c, r) !== Code.Wall && !this.crateCells.has(r * GRID + c)
  }

  cellCenter(c: number, r: number): THREE.Vector3 {
    return new THREE.Vector3((c - HALF + 0.5) * CELL, 0, (r - HALF + 0.5) * CELL)
  }

  worldToCell(x: number, z: number): [number, number] {
    return [Math.floor(x / CELL + HALF), Math.floor(z / CELL + HALF)]
  }

  plantSiteAt(x: number, z: number): 'A' | 'B' | null {
    const [c, r] = this.worldToCell(x, z)
    const code = this.code(c, r)
    if (code === Code.ASite) return 'A'
    if (code === Code.BSite) return 'B'
    return null
  }

  private buildGrid() {
    for (const [x1, y1, x2, y2, code] of RECTS) {
      for (let r = y1; r <= y2; r++) {
        for (let c = x1; c <= x2; c++) this.grid[r * GRID + c] = code
      }
    }
    // 中门: frame + door cells at row 16
    this.grid[16 * GRID + 24] = Code.Wall
    this.grid[16 * GRID + 29] = Code.Wall
    for (let c = 25; c <= 28; c++) this.grid[16 * GRID + c] = Code.Door
    // A大双门 at row 32
    this.grid[32 * GRID + 44] = Code.Wall
    this.grid[32 * GRID + 47] = Code.Wall
    for (let c = 45; c <= 46; c++) this.grid[32 * GRID + c] = Code.Door

    for (const [c, r, stack] of CRATES) {
      this.crateCells.add(r * GRID + c)
      const ctr = this.cellCenter(c, r)
      const s = 1.05
      this.crates.push({
        min: new THREE.Vector3(ctr.x - s, 0, ctr.z - s),
        max: new THREE.Vector3(ctr.x + s, 1.05 * stack, ctr.z + s),
      })
    }
  }

  private buildVisuals() {
    // floor
    const floorMat = new THREE.MeshStandardMaterial({ map: makeFloorTexture(), roughness: 1 })
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(GRID * CELL, GRID * CELL), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    this.group.add(floor)

    // walls: merge exposed wall cells into per-row runs
    const exposed = (c: number, r: number): boolean => {
      if (!this.isWall(c, r)) return false
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dc === 0 && dr === 0) continue
          if (this.code(c + dc, r + dr) !== Code.Wall) return true
        }
      }
      return false
    }
    const geos: THREE.BufferGeometry[] = []
    const base = new THREE.Color('#c8ae7d')
    for (let r = 0; r < GRID; r++) {
      let c = 0
      while (c < GRID) {
        if (!exposed(c, r)) { c++; continue }
        let end = c
        while (end + 1 < GRID && exposed(end + 1, r)) end++
        const w = (end - c + 1) * CELL
        const g = new THREE.BoxGeometry(w, WALL_H, CELL)
        const cx = ((c + end + 1) / 2 - HALF) * CELL
        const cz = (r - HALF + 0.5) * CELL
        g.translate(cx, WALL_H / 2, cz)
        const col = base.clone().multiplyScalar(0.9 + Math.random() * 0.18)
        const n = g.attributes.position.count
        const colors = new Float32Array(n * 3)
        for (let i = 0; i < n; i++) { colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b }
        g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geos.push(g)
        c = end + 1
      }
    }
    const wallGeo = mergeGeometries(geos)!
    const walls = new THREE.Mesh(wallGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }))
    walls.castShadow = true
    walls.receiveShadow = true
    this.group.add(walls)

    // crates
    const crateMat = new THREE.MeshStandardMaterial({ color: 0x9a7743, roughness: 0.9 })
    const crateEdge = new THREE.MeshStandardMaterial({ color: 0x6e5430, roughness: 0.9 })
    for (const [c, r, stack] of CRATES) {
      const ctr = this.cellCenter(c, r)
      for (let s = 0; s < stack; s++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.02, 2.1), crateMat)
        m.position.set(ctr.x, 0.525 + s * 1.05, ctr.z)
        m.castShadow = m.receiveShadow = true
        this.group.add(m)
        const trim = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.12, 2.16), crateEdge)
        trim.position.set(ctr.x, 1.0 + s * 1.05, ctr.z)
        this.group.add(trim)
      }
    }

    // tunnel ceilings
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0xa08a5f, roughness: 1 })
    for (const [x1, y1, x2, y2] of TUNNEL_RECTS) {
      const w = (x2 - x1 + 1) * CELL, d = (y2 - y1 + 1) * CELL
      const m = new THREE.Mesh(new THREE.BoxGeometry(w + CELL, 0.4, d + CELL), ceilMat)
      m.position.set(((x1 + x2 + 1) / 2 - HALF) * CELL, 3.3, ((y1 + y2 + 1) / 2 - HALF) * CELL)
      m.castShadow = true
      this.group.add(m)
    }

    // site letters painted on the floor
    const markers: [string, number, number, string][] = [
      ['A', 41, 5, 'rgba(214,120,50,0.85)'],
      ['B', 7, 7, 'rgba(214,120,50,0.85)'],
      ['MID', 26, 24, 'rgba(90,74,50,0.6)'],
    ]
    for (const [text, c, r, color] of markers) {
      const tex = makeLetterTexture(text, color)
      const size = text.length > 1 ? 7 : 5
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(size, size),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }),
      )
      const p = this.cellCenter(c, r)
      m.rotation.x = -Math.PI / 2
      m.position.set(p.x, 0.02, p.z)
      this.group.add(m)
    }

    // doors
    const midDoor = new DoorObj(this.cellCenter(26, 16).setX(((25 + 29) / 2 - HALF) * CELL), 4 * CELL)
    const longDoor = new DoorObj(this.cellCenter(45, 32).setX(((45 + 47) / 2 - HALF) * CELL), 2 * CELL)
    this.doors = [midDoor, longDoor]
    for (const d of this.doors) this.group.add(d.group)
  }

  private buildMeta() {
    const cc = (c: number, r: number) => this.cellCenter(c, r)
    // spawns
    const tCells: [number, number][] = [[25, 46], [27, 46], [23, 45], [29, 45], [26, 47]]
    const ctCells: [number, number][] = [[27, 5], [29, 5], [25, 4], [31, 6], [28, 7]]
    this.spawns.T = tCells.map(([c, r]) => ({ pos: cc(c, r), yaw: 0 }))
    this.spawns.CT = ctCells.map(([c, r]) => ({ pos: cc(c, r), yaw: Math.PI }))

    const an = this.anchors
    an.aSite = cc(41, 5); an.bSite = cc(7, 7)
    an.tSpawn = cc(26, 45); an.ctSpawn = cc(28, 6)
    an.midLow = cc(26, 32); an.midDoorS = cc(26, 18); an.midTop = cc(26, 11)
    an.catwalk = cc(33, 21); an.aShort = cc(36, 12)
    an.outsideLong = cc(38, 36); an.longMid = cc(45, 26); an.longTop = cc(45, 11)
    an.tunnelS = cc(18, 36); an.tunnelElbow = cc(8, 29); an.tunnelMid = cc(7, 20)
    an.bDoors = cc(18, 11)

    this.routes.A = [
      [an.outsideLong, an.longMid, an.longTop],
      [an.midLow, an.catwalk, an.aShort],
    ]
    this.routes.B = [
      [an.tunnelS, an.tunnelElbow, an.tunnelMid],
      [an.midLow, an.midDoorS, an.midTop, an.bDoors],
    ]

    this.holdSpots.A = [
      { pos: cc(38, 3), look: cc(45, 11) },
      { pos: cc(43, 8), look: cc(36, 13) },
      { pos: cc(45, 11), look: cc(45, 28) },
    ]
    this.holdSpots.B = [
      { pos: cc(4, 4), look: cc(7, 15) },
      { pos: cc(10, 10), look: cc(15, 11) },
      { pos: cc(7, 14), look: cc(7, 22) },
    ]
    this.holdSpots.mid = [
      { pos: cc(26, 12), look: cc(26, 20) },
      { pos: cc(18, 11), look: cc(25, 11) },
    ]

    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const code = this.code(c, r)
        if (code === Code.ASite && this.isWalkableCell(c, r)) this.siteCells.A.push([c, r])
        if (code === Code.BSite && this.isWalkableCell(c, r)) this.siteCells.B.push([c, r])
      }
    }
  }

  randomSiteSpot(site: 'A' | 'B'): THREE.Vector3 {
    const cells = this.siteCells[site]
    const [c, r] = cells[Math.floor(Math.random() * cells.length)]
    return this.cellCenter(c, r)
  }

  /** Random walkable cell center within `radius` (world units) of a point. */
  randomSpotNear(p: THREE.Vector3, radius: number): THREE.Vector3 {
    const [pc, pr] = this.worldToCell(p.x, p.z)
    const cellRad = Math.ceil(radius / CELL)
    for (let i = 0; i < 24; i++) {
      const c = pc + Math.round((Math.random() * 2 - 1) * cellRad)
      const r = pr + Math.round((Math.random() * 2 - 1) * cellRad)
      if (this.isWalkableCell(c, r)) return this.cellCenter(c, r)
    }
    return p.clone()
  }

  drawMinimap(ctx: CanvasRenderingContext2D, px: number) {
    ctx.clearRect(0, 0, GRID * px, GRID * px)
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const code = this.code(c, r)
        if (code === Code.Wall) continue
        let fill = 'rgba(219,197,150,0.85)'
        if (code === Code.ASite || code === Code.BSite) fill = 'rgba(226,160,96,0.9)'
        if (code === Code.TSpawn) fill = 'rgba(216,190,132,0.9)'
        if (code === Code.CTSpawn) fill = 'rgba(180,198,216,0.9)'
        if (code === Code.Door) fill = 'rgba(140,170,140,0.9)'
        ctx.fillStyle = fill
        ctx.fillRect(c * px, r * px, px, px)
        if (this.crateCells.has(r * GRID + c)) {
          ctx.fillStyle = 'rgba(120,95,55,0.9)'
          ctx.fillRect(c * px + 1, r * px + 1, px - 2, px - 2)
        }
      }
    }
    ctx.font = `bold ${px * 5}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(80,50,20,0.8)'
    ctx.fillText('A', 41.5 * px, 6 * px)
    ctx.fillText('B', 7.5 * px, 7.5 * px)
  }
}

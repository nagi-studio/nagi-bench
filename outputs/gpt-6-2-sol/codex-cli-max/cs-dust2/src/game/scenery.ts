import * as THREE from 'three'
import { BLOCKS, BOUNDARY, EDGES, MAP_BOUNDS, PROPS, SITES, WALKWAYS, clamp, groundY, seedRandom, type Block, type Edge, type Point, type Site } from './level'
import { UNIT_BOX, paint } from './models'

const PI = Math.PI

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const surface = document.createElement('canvas')
  surface.width = surface.height = size
  draw(surface.getContext('2d')!, size)
  const texture = new THREE.CanvasTexture(surface)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function texturedStone(style: 'plaster' | 'sand' | 'wood') {
  const random = seedRandom(style === 'plaster' ? 23202 : style === 'sand' ? 92011 : 612)
  return canvasTexture(256, (ctx, size) => {
    ctx.fillStyle = style === 'wood' ? '#d7c9ad' : '#f0ebe2'
    ctx.fillRect(0, 0, size, size)
    for (let i = 0; i < 2400; i++) {
      const tone = Math.round(159 + random() * 96)
      const w = style === 'wood' ? 6 + random() * 35 : 1 + random() * 3
      ctx.fillStyle = 'rgba(' + tone + ',' + (tone - 7) + ',' + (tone - 13) + ',' + (0.04 + random() * 0.25) + ')'
      ctx.fillRect(random() * size, random() * size, w, 0.5 + random() * 2)
    }
    for (let i = 0; i < 80; i++) {
      const x = random() * size
      const y = random() * size
      const radius = 3 + random() * 28
      const shading = ctx.createRadialGradient(x, y, 0, x, y, radius)
      shading.addColorStop(0, 'rgba(106,81,50,' + (0.018 + random() * 0.055) + ')')
      shading.addColorStop(1, 'rgba(106,81,50,0)')
      ctx.fillStyle = shading
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }
    if (style === 'wood') {
      ctx.strokeStyle = 'rgba(76,55,39,0.21)'
      for (let y = 0; y <= size; y += 32) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(size, y + 1)
        ctx.stroke()
      }
    }
    if (style === 'plaster') {
      for (let i = 0; i < 115; i++) {
        const x = random() * size
        const y = random() * size
        const w = 1 + random() * 9
        ctx.fillStyle = random() > 0.5 ? '#fff8ed55' : '#89735726'
        ctx.fillRect(x, y, w, 1)
      }
    }
  })
}

class Stonework {
  private boxes = new Map<THREE.Material, THREE.Matrix4[]>()
  private dummy = new THREE.Object3D()

  add(material: THREE.Material, x: number, y: number, z: number, w: number, h: number, d: number, yaw = 0) {
    const groups = this.boxes
    const matrix = this.dummy
    matrix.position.set(x, y, z)
    matrix.rotation.y = yaw
    matrix.scale.set(w, h, d)
    matrix.updateMatrix()
    if (!groups.has(material)) groups.set(material, [])
    groups.get(material)!.push(matrix.matrix.clone())
  }

  finish(scene: THREE.Scene) {
    for (const [material, matrices] of this.boxes) {
      const mesh = new THREE.InstancedMesh(UNIT_BOX, material, matrices.length)
      matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix))
      mesh.instanceMatrix.needsUpdate = true
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)
    }
  }
}

const STUCCO = ['#d0a87f', '#dec098', '#c19c77', '#e0c4a2', '#cfb096', '#b69b83']
const LIGHT_STONE = ['#dbba8e', '#e6c79e', '#caa581', '#d0ad87']
const WOOD_COLORS = ['#8b7253', '#a28b67', '#907655', '#b29364']
const EXPOSED = ['#bf9670', '#c7a37e', '#e6c6a4', '#ac8562']
const DARK_FRAME = '#413c32'
const TILE = '#a48163'

function toFacade(edge: Edge, along: number, projection: number) {
  const side = edge.line - edge.outside * projection
  return edge.alongX ? { x: along, z: side } : { x: side, z: along }
}

function facadeBox(builder: Stonework, edge: Edge, mat: THREE.Material, along: number, y: number, projection: number, w: number, h: number, d: number) {
  const { x, z } = toFacade(edge, along, projection)
  builder.add(mat, x, y, z, edge.alongX ? w : d, h, edge.alongX ? d : w)
}

type WallMaterials = { plaster: THREE.Material[]; stone: THREE.Material[]; wood: THREE.Material[] }

function wallFace(builder: Stonework, edge: Edge, block: Block, index: number, materials: WallMaterials) {
  const random = seedRandom(897 + index * 431)
  const length = edge.to - edge.from
  const pieces = Math.max(1, Math.round(length / 5.8))
  const width = length / pieces
  const longStreet = !edge.alongX && (edge.line === 31 || edge.line === 42)
  const facade = (mat: THREE.Material, at: number, y: number, projection: number, w: number, h: number, d: number) =>
    facadeBox(builder, edge, mat, at, y, projection, w, h, d)
  for (let i = 0; i < pieces; i++) {
    const center = edge.from + width * (i + 0.5)
    const textured = materials.plaster[(index + i * 3) % STUCCO.length]
    const cut = materials.stone[(index + i) % LIGHT_STONE.length]
    const wallHeight = block.h + (longStreet ? 0.5 + random() * 1.23 : random() * 0.85)
    const defaultFoundation = paint(index % 3 === 0 ? '#a18670' : '#b29a81')
    const lower = longStreet && (i + index) % 3 === 1 ? paint('#8f9680') : defaultFoundation
    facade(textured, center, wallHeight / 2, -0.202, width - 0.025, wallHeight, 0.424)
    facade(lower, center, 0.49, 0.015, width - 0.025, 0.96, 0.051)
    facade(cut, center, 1.015, 0.028, width - 0.039, 0.11, 0.10)
    facade(cut, center, 2.83 + (i % 2) * 0.36, 0.029, width - 0.051, 0.109, 0.15)
    facade(cut, center, wallHeight - 0.44, 0.045, width + 0.01, 0.18, 0.23)
    facade(materials.stone[(i + 1) % 4], center, wallHeight + 0.027, -0.15, width + 0.095, 0.19, 0.61)
    if (length > 3.1) {
      const near = center - width / 2 + 0.19
      const far = center + width / 2 - 0.2
      for (const col of [near, far]) {
        facade(cut, col, 1.77, 0.046, 0.32, 3.37, 0.17)
        for (let y = 0.48; y < 3.62; y += 0.46) {
          facade(materials.stone[Math.floor(random() * 4)], col, y, 0.071, 0.40 + random() * 0.07, 0.275, 0.13)
        }
      }
    }
    if (width < 3.1) continue
    const count = longStreet && width > 5.2 ? 2 : 1
    for (let j = 0; j < count; j++) {
      const at = center + (j - (count - 1) / 2) * width * 0.4
      const y = Math.min(wallHeight - 1.31, 4.31 + random() * 0.38)
      const windowW = count === 1 ? 1.05 + random() * 0.35 : 0.89
      facade(cut, at, y, 0.049, windowW + 0.27, 1.29, 0.15)
      facade(paint('#51463a'), at, y, 0.125, windowW, 1.065, 0.075)
      if ((i + j + index) % 3 !== 0) {
        const shutter = (i + index) % 3 === 1 ? paint('#586e68') : materials.wood[index % 4]
        facade(shutter, at, y, 0.169, windowW - 0.095, 0.98, 0.07)
        for (let strip = 0; strip < 7; strip++) {
          facade(paint('#3f4c43'), at, y - 0.41 + strip * 0.128, 0.207, windowW - 0.158, 0.024, 0.018)
        }
        facade(paint(DARK_FRAME), at, y, 0.222, 0.047, 1.0, 0.036)
      } else {
        for (let bar = -1; bar < 2; bar++) {
          facade(paint(DARK_FRAME), at + bar * windowW * 0.225, y, 0.205, 0.043, 1.1, 0.066)
        }
      }
      facade(cut, at, y - 0.59, 0.149, windowW + 0.34, 0.16, 0.30)
    }

    if ((i + index) % 2 === 0 || longStreet) {
      const doorWidth = Math.min(1.57, width * 0.34)
      const at = center + (random() - 0.5) * width * 0.28
      const door = materials.wood[(index + 2) % 4]
      facade(cut, at, 1.21, 0.066, doorWidth + 0.39, 2.37, 0.169)
      facade(paint(DARK_FRAME), at, 1.13, 0.13, doorWidth + 0.04, 2.18, 0.08)
      for (let slat = 0; slat < 7; slat++) {
        facade(slat % 3 ? door : materials.wood[(index + 3) % 4],
          at + (slat - 3) * doorWidth / 7, 1.10, 0.177, doorWidth / 7 - 0.018, 2.11, 0.067)
      }
      facade(paint('#605445'), at, 1.78, 0.223, doorWidth, 0.067, 0.052)
      facade(paint('#605445'), at, 0.42, 0.223, doorWidth, 0.067, 0.052)
      facade(paint('#544739'), at + doorWidth * 0.26, 1.0, 0.251, 0.12, 0.16, 0.043)
    }

    for (let detail = 0; detail < 13 + (longStreet ? 14 : 0); detail++) {
      const randomWidth = 0.12 + random() * 0.48
      const at = center + (random() - 0.5) * (width - randomWidth - 0.2)
      const y = random() < 0.5 ? 0.15 + random() * 0.85 : 1.27 + random() * (wallHeight - 1.67)
      facade(paint(EXPOSED[Math.floor(random() * EXPOSED.length)]), at, y, 0.027, randomWidth, 0.028 + random() * 0.12, 0.034)
    }

    if ((index + i) % 3 === 0 || longStreet) {
      const roofWidth = width * (0.65 + random() * 0.30)
      const roofH = 0.44 + random() * 1.35
      facade(textured, center + (width - roofWidth) * -0.15, wallHeight + roofH / 2 - 0.1, -0.77, roofWidth, roofH, 1.37)
      facade(cut, center + (width - roofWidth) * -0.15, wallHeight + roofH - 0.1, -0.77, roofWidth + 0.16, 0.15, 1.52)
      if (longStreet || i % 2) {
        for (let tip = 0; tip < 3; tip++) {
          facade(cut, center + (tip - 1) * roofWidth * 0.25, wallHeight + roofH + 0.03, -0.4, 0.37, 0.26, 0.26)
        }
        facade(paint('#605642'), center + roofWidth * 0.21, wallHeight + roofH + 0.58, -0.8, 0.045, 1.12, 0.044)
        facade(paint('#5f5a4b'), center + roofWidth * 0.21, wallHeight + roofH + 0.86, -0.8, 1.02, 0.036, 0.039)
      }
    }
  }
}

function localCrate(builder: Stonework, block: Block, material: THREE.Material, u: number, y: number, v: number, w: number, h: number, d: number) {
  const x = block.x + Math.cos(block.angle) * u + Math.sin(block.angle) * v
  const z = block.z - Math.sin(block.angle) * u + Math.cos(block.angle) * v
  builder.add(material, x, block.y + y, z, w, h, d, block.angle)
}

function buildProp(builder: Stonework, block: Block, index: number, materials: WallMaterials) {
  const { w, d, h, kind, angle } = block
  const edit = (mat: THREE.Material, u: number, y: number, v: number, width: number, height: number, depth: number) =>
    localCrate(builder, block, mat, u, y, v, width, height, depth)
  if (kind === 'crate' || kind === 'door') {
    const frame = materials.wood[index % 4]
    const edges = materials.wood[(index + 2) % 4]
    edit(paint('#574737'), 0, h / 2, 0, w - 0.015, h - 0.02, d - 0.015)
    const count = Math.max(4, Math.round(w / 0.24))
    for (let i = 0; i < count; i++) {
      for (const face of [-1, 1]) {
        edit(materials.wood[(index + Math.floor(i / 3) + Number(i % 7 === 1)) % 4],
          ((i + 0.5) / count - 0.5) * w, h / 2, face * (d / 2 - 0.014), w / count - 0.012, h - 0.035, 0.041)
      }
    }
    for (const side of [-1, 1]) {
      edit(frame, side * (w / 2 - 0.055), h / 2, 0, 0.12, h, d + 0.026)
      for (const face of [-1, 1]) {
        edit(edges, 0, side > 0 ? h - 0.065 : 0.065, face * (d / 2 + 0.022), w + 0.025, 0.12, 0.07)
        if (kind === 'door') edit(edges, 0, h * 0.47, face * (d / 2 + 0.023), w, 0.124, 0.072)
      }
    }
    if (kind === 'crate') {
      edit(frame, 0, h - 0.037, 0, w, 0.105, d)
      for (const side of [-1, 1]) {
        const bars = Math.max(3, Math.round(d / 0.245))
        for (let i = 0; i < bars; i++) {
          edit(materials.wood[(i + index) % 4], side * (w / 2 - 0.007), h / 2, ((i + 0.5) / bars - 0.5) * d,
            0.035, h - 0.22, d / bars - 0.012)
        }
      }
      for (let i = 0; i < 4; i++) {
        edit(paint('#484538'), (i < 2 ? -1 : 1) * (w / 2 - 0.115), i % 2 ? h - 0.07 : 0.073, d / 2 + 0.061, 0.068, 0.065, 0.021)
      }
    } else {
      edit(paint('#716651', 0.4, 0.4), (angle < 0 ? 1 : -1) * w * 0.29, h * 0.46, d / 2 + 0.081, 0.094, 0.165, 0.050)
    }
    return
  }

  if (kind === 'metal') {
    const metal = paint('#778171', 0.61, 0.31)
    const strip = paint('#4f584f', 0.43, 0.42)
    edit(metal, 0, h / 2, 0, w, h, d)
    for (const side of [-1, 1]) {
      edit(strip, 0, side > 0 ? h - 0.04 : 0.1, 0, w + 0.05, 0.12, d + 0.05)
      for (let j = 0; j < 6; j++) {
        edit(strip, (j - 2.5) * w * 0.15, h / 2, side * d / 2, 0.038, h, 0.035)
      }
    }
    return
  }

  edit(materials.stone[index % 4], 0, h / 2, 0, w, h, d)
  if (kind === 'roof') return
  const courses = Math.max(2, Math.round(h / 0.36))
  for (let row = 0; row < courses; row++) {
    const y = (row + 0.5) * h / courses
    const sections = Math.max(1, Math.round(w / 0.65))
    for (let j = 0; j < sections; j++) {
      for (const side of [-1, 1]) {
        edit(materials.stone[(row + index + j * (row % 2 + 1)) % 4], (-0.5 + (j + 0.5) / sections) * w,
          y, side * (d / 2 + 0.005), w / sections - 0.018, h / courses - 0.017, 0.066)
      }
    }
  }
  const cap = materials.stone[(index + 1) % 4]
  edit(cap, 0, h + 0.016, 0, w + 0.085, 0.11, d + 0.08)
}

function arch(scene: THREE.Scene, x: number, z: number, spring: number, inside: number, outside: number, depth: number, material: THREE.Material[]) {
  const pieces = 13
  for (let i = 0; i < pieces; i++) {
    const a = (i / pieces) * PI + 0.006
    const b = ((i + 1) / pieces) * PI - 0.006
    const shape = new THREE.Shape()
    shape.moveTo(Math.cos(a) * inside, Math.sin(a) * inside)
    shape.absarc(0, 0, inside, a, b, false)
    shape.lineTo(Math.cos(b) * outside, Math.sin(b) * outside)
    shape.absarc(0, 0, outside, b, a, true)
    shape.closePath()
    const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.026, bevelSegments: 1, curveSegments: 3 })
    const mesh = new THREE.Mesh(geometry, material[(i + 1) % material.length])
    mesh.position.set(x, spring, z - depth / 2)
    mesh.castShadow = mesh.receiveShadow = true
    scene.add(mesh)
  }
}

function signTexture(letter: string, small: string, color: string, arrow = false) {
  const random = seedRandom(663)
  return canvasTexture(256, (ctx, size) => {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.globalAlpha = 0.82
    ctx.font = '900 146px Arial, sans-serif'
    ctx.fillText(letter, arrow ? 92 : 128, 113)
    if (arrow) {
      ctx.lineWidth = 11
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.moveTo(154, 111)
      ctx.lineTo(218, 111)
      ctx.moveTo(199, 92)
      ctx.lineTo(218, 111)
      ctx.lineTo(199, 130)
      ctx.stroke()
    }
    ctx.font = 'bold 21px monospace'
    ctx.fillText(small, 125, 196)
    ctx.globalCompositeOperation = 'destination-out'
    for (let i = 0; i < 150; i++) {
      ctx.fillStyle = 'rgba(0,0,0,' + (random() * 0.31) + ')'
      ctx.fillRect(random() * size, random() * size, random() * 13, 1 + random() * 5)
    }
  })
}

function sign(scene: THREE.Scene, letter: string, small: string, color: string, x: number, y: number, z: number, yaw: number, size: number, arrow = false) {
  const mat = new THREE.MeshBasicMaterial({ map: signTexture(letter, small, color, arrow), side: THREE.DoubleSide, transparent: true, depthWrite: false })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat)
  mesh.position.set(x, y, z)
  mesh.rotation.y = yaw
  scene.add(mesh)
}

function markSite(scene: THREE.Scene, id: Site) {
  const { x, z, radius } = SITES[id]
  const texture = canvasTexture(256, (ctx, size) => {
    ctx.translate(size / 2, size / 2)
    ctx.strokeStyle = '#a95c3c'
    ctx.globalAlpha = 0.7
    ctx.lineWidth = 4
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.arc(0, 0, 119, i * PI / 2 + 0.15, (i + 1) * PI / 2 - 0.15)
      ctx.stroke()
    }
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, 102, 0, PI * 2)
    ctx.stroke()
    ctx.font = '900 95px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#a55f3e'
    ctx.fillText(id, 0, 6)
  })
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3 })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), material)
  mesh.rotation.x = -PI / 2
  mesh.position.set(x, 0.019, z)
  scene.add(mesh)
}

function wire(scene: THREE.Scene, a: THREE.Vector3, b: THREE.Vector3, sag: number) {
  const mid = a.clone().lerp(b, 0.5)
  mid.y -= sag
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 18, 0.023, 4, false), paint('#3b3a32')))
}

function smooth(min: number, max: number, value: number) {
  const t = clamp((value - min) / (max - min), 0, 1)
  return t * t * (3 - 2 * t)
}

function cloudNoise(x: number, y: number) {
  const px = Math.floor(x)
  const py = Math.floor(y)
  const dx = smooth(0, 1, x - px)
  const dy = smooth(0, 1, y - py)
  const dot = (a: number, b: number) => {
    let n = Math.imul(a ^ 9137, 0x7feb352d) ^ Math.imul(b + 9634, 0x846ca68b)
    n = Math.imul(n ^ (n >>> 16), 0x7feb352d)
    return ((n ^ (n >>> 16)) >>> 24) / 255
  }
  const mix = THREE.MathUtils.lerp
  return mix(mix(dot(px, py), dot(px + 1, py), dx), mix(dot(px, py + 1), dot(px + 1, py + 1), dx), dy)
}

function valleySky(scene: THREE.Scene) {
  const width = 768
  const height = 384
  const surface = document.createElement('canvas')
  surface.width = width
  surface.height = height
  const ctx = surface.getContext('2d')!
  const sky = ctx.createImageData(width, height)
  const longitude = Array.from({ length: width }, (_, x) => x / (width - 1) * PI * 2)
  const skyColors = [[236, 221, 187], [189, 210, 211], [116, 159, 183]]
  const cloudColor = [247, 235, 217]
  const mix = THREE.MathUtils.lerp
  for (let py = 0; py < height; py++) {
    const angle = py / (height - 1) * PI
    const y = Math.cos(angle)
    const ring = Math.sin(angle)
    const horizon = smooth(0.0, 0.26, y)
    const dawn = smooth(0.12, 0.91, y)
    const cloudBand = smooth(0.025, 0.174, y) * (1 - smooth(0.26, 0.55, y))
    const base = [0, 1, 2].map(i => mix(mix(skyColors[0][i], skyColors[1][i], horizon), skyColors[2][i], dawn))
    for (let px = 0; px < width; px++) {
      const x = -Math.cos(longitude[px]) * ring
      const z = Math.sin(longitude[px]) * ring
      let cloud = 0
      if (cloudBand > 0) {
        const u = 4 * x / (0.21 + y)
        const v = 11.5 * z / (0.21 + y)
        const noise = cloudNoise(u, v) * 0.66 + cloudNoise(u * 2.45, v * 2.45) * 0.25 + cloudNoise(u * 6.3, v * 6.3) * 0.09
        cloud = smooth(0.53, 0.79, noise) * cloudBand * 0.64
      }
      const angleToSun = Math.max(0, -0.485 * x + 0.728 * y + 0.485 * z)
      const sunlight = angleToSun ** 18 * 21 + smooth(0.9987, 0.9997, angleToSun) * 67
      const at = (py * width + px) * 4
      for (let i = 0; i < 3; i++) sky.data[at + i] = mix(base[i], cloudColor[i], cloud) + sunlight * (1 - 0.23 * i)
      sky.data[at + 3] = 255
    }
  }
  ctx.putImageData(sky, 0, 0)
  const map = new THREE.CanvasTexture(surface)
  map.colorSpace = THREE.SRGBColorSpace
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(162, 32, 18),
    new THREE.MeshBasicMaterial({ map, side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false }))
  mesh.renderOrder = -10
  scene.add(mesh)
}

export function shadeGround() {
  const spanX = MAP_BOUNDS.x1 - MAP_BOUNDS.x0
  const spanZ = MAP_BOUNDS.z1 - MAP_BOUNDS.z0
  const map = canvasTexture(768, (ctx, size) => {
    const polygon = (vertices: Point[]) => {
      const ordered = vertices.reduce((sum, vertex, i) => {
        const next = vertices[(i + 1) % vertices.length]
        return sum + vertex.x * next.z - next.x * vertex.z
      }, 0) > 0 ? vertices : [...vertices].reverse()
      for (const [i, vertex] of ordered.entries()) {
        const x = (vertex.x - MAP_BOUNDS.x0) / spanX * size
        const y = (vertex.z - MAP_BOUNDS.z0) / spanZ * size
        if (i) ctx.lineTo(x, y)
        else ctx.moveTo(x, y)
      }
      ctx.closePath()
    }
    ctx.beginPath()
    for (const block of BLOCKS) {
      const cos = Math.cos(block.angle)
      const sin = Math.sin(block.angle)
      const footprint = [[-1,-1], [1,-1], [1,1], [-1,1]].map(([u, v]) => ({
        x: block.x + cos * u * block.w / 2 + sin * v * block.d / 2,
        z: block.z - sin * u * block.w / 2 + cos * v * block.d / 2,
      }))
      const from = footprint.map(p => ({ x: p.x + block.y * 0.5, z: p.z - block.y * 0.5 }))
      const to = from.map(p => ({ x: p.x + block.h * 0.5, z: p.z - block.h * 0.5 }))
      polygon(from)
      polygon(to)
      for (let i = 0; i < 4; i++) polygon([from[i], from[(i + 1) % 4], to[(i + 1) % 4], to[i]])
    }
    ctx.fillStyle = '#4d35267b'
    ctx.fill()
  })
  const geometry = new THREE.PlaneGeometry(spanX, spanZ)
  geometry.rotateX(-PI / 2)
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    map, transparent: true, depthWrite: false, fog: true, polygonOffset: true, polygonOffsetFactor: -2,
  }))
  mesh.position.set((MAP_BOUNDS.x0 + MAP_BOUNDS.x1) / 2, 0.027, (MAP_BOUNDS.z0 + MAP_BOUNDS.z1) / 2)
  mesh.renderOrder = 1
  return mesh
}

function groundDetails(builder: Stonework) {
  const random = seedRandom(8244)
  const grit = ['#bd9e76', '#cfad83', '#d8be99', '#b69b79', '#af9474'].map(color => paint(color))
  for (const [i, rect] of WALKWAYS.entries()) {
    const count = (rect.x1 - rect.x0) * (rect.z1 - rect.z0) * 0.19
    for (let n = 0; n < count; n++) {
      const left = random() < 0.5
      const edge = random() * Math.min(1.69, (rect.x1 - rect.x0) * 0.22)
      const x = left ? rect.x0 + edge : rect.x1 - edge
      const z = rect.z0 + random() * (rect.z1 - rect.z0)
      const y = groundY(x, z)
      const scale = 0.045 + random() ** 3 * 0.34
      builder.add(grit[(i + n) % grit.length], x, y + 0.008, z, scale * 1.42, scale * 0.13, scale, random() * PI)
    }
  }
  for (let i = 0; i < 78; i++) {
    const x = 31.2 + random() * 2.4
    const z = -10 + random() * 29
    const size = 0.07 + random() ** 2 * 0.44
    builder.add(grit[i % grit.length], x, 0.017, z, size, size * 0.21, size * 0.75, random() * PI)
  }

  for (let stripe = 0; stripe < 17; stripe++) {
    const x = 35.4 + (stripe - 8) * 0.224
    builder.add(paint(stripe % 2 ? '#a08657' : '#c4a370'), x, 0.012, -1.29, 0.13, 0.017, 0.224, PI * 0.18)
  }
}

function mesa(scene: THREE.Scene, x: number, z: number, width: number, h: number, color: string) {
  const shape = new THREE.CylinderGeometry(width * 0.67, width, h, 7, 1)
  const mesh = new THREE.Mesh(shape, paint(color))
  mesh.position.set(x, h / 2 - 4, z)
  mesh.rotation.y = x * 0.107
  scene.add(mesh)
}

function addLantern(builder: Stonework, point: Point, y: number) {
  builder.add(paint('#4a4437'), point.x, y + 0.14, point.z, 0.21, 0.066, 0.24)
  builder.add(paint('#d8b383'), point.x, y, point.z, 0.135, 0.22, 0.165)
  builder.add(paint('#534735'), point.x, y - 0.138, point.z, 0.17, 0.048, 0.195)
  builder.add(paint('#54483e'), point.x, y + 0.23, point.z, 0.043, 0.14, 0.042)
}

export function makeScenery(scene: THREE.Scene) {
  scene.fog = new THREE.Fog('#dbccb1', 45, 125)
  valleySky(scene)
  const plaster = texturedStone('plaster')
  const wood = texturedStone('wood')
  const sand = texturedStone('sand')
  sand.wrapS = sand.wrapT = THREE.RepeatWrapping
  sand.repeat.set(35, 31)

  const textureMaterial = (color: string, map: THREE.Texture) => new THREE.MeshStandardMaterial({ color, map, roughness: 0.93 })
  const materials = {
    plaster: STUCCO.map(color => textureMaterial(color, plaster)),
    stone: LIGHT_STONE.map(color => textureMaterial(color, plaster)),
    wood: WOOD_COLORS.map(color => textureMaterial(color, wood)),
  }

  const field = new THREE.Mesh(new THREE.PlaneGeometry(238, 222), textureMaterial('#c7ac87', sand))
  field.rotation.x = -PI / 2
  field.receiveShadow = true
  scene.add(field)

  const ramp = new THREE.PlaneGeometry(10, 20, 24, 36)
  ramp.rotateX(-PI / 2)
  ramp.translate(18, 0, -3)
  const attr = ramp.getAttribute('position')
  const uvs = ramp.getAttribute('uv')
  for (let i = 0; i < attr.count; i++) {
    const x = attr.getX(i)
    const z = attr.getZ(i)
    attr.setY(i, groundY(x, z) + 0.005)
    uvs.setXY(i, (x + 119) / 238, (111 - z) / 222)
  }
  ramp.computeVertexNormals()
  const raised = new THREE.Mesh(ramp, field.material)
  raised.receiveShadow = true
  scene.add(raised)

  const builder = new Stonework()
  BOUNDARY.forEach((block, index) => {
    builder.add(materials.plaster[index % STUCCO.length], block.x, block.h / 2, block.z, block.w, block.h, block.d)
    wallFace(builder, EDGES[index], block, index, materials)
  })
  PROPS.forEach((block, index) => buildProp(builder, block, index, materials))

  arch(scene, 36.5, -1.25, 2.39, 4.025, 4.67, 1.41, materials.stone)
  builder.add(materials.plaster[1], 36.5, 7.41, -1.27, 10.85, 0.72, 1.47)
  builder.add(materials.stone[1], 36.5, 7.65, -1.25, 11.15, 0.22, 1.71)
  builder.add(paint(TILE), 36.5, 7.82, -1.25, 10.9, 0.12, 1.60)
  for (let i = 0; i < 8; i++) {
    builder.add(materials.stone[i % 4], 31.68 + i * 1.37, 8.04, -1.27, 0.54, 0.42, 1.46)
  }
  builder.add(materials.plaster[2], 32.01, 7.37, -1.72, 1.49, 3.25, 2.65)
  builder.add(materials.stone[1], 32.01, 9, -1.72, 1.67, 0.19, 2.81)
  builder.add(paint('#675543'), 32.07, 7.93, -0.357, 0.62, 0.81, 0.071)
  for (let i = 0; i < 3; i++) builder.add(materials.stone[2], 31.84 + i * 0.22, 7.94, -0.302, 0.04, 0.79, 0.05)
  addLantern(builder, { x: 32.12, z: -0.338 }, 2.57)
  addLantern(builder, { x: 40.84, z: -0.338 }, 2.57)
  sign(scene, 'A', 'EAST COURT', '#9e4f35', 31.228, 2.43, 1.82, PI / 2, 2.95, true)
  sign(scene, 'A', 'SECTOR A', '#a1573b', 34.9, 2.57, -29.781, 0, 3.64)
  sign(scene, 'B', 'CISTERN', '#a1573b', -41.759, 2.73, -19.66, PI / 2, 3.18)
  sign(scene, 'T', 'SOUTH DEPOT', '#9a573c', 2.3, 2.69, 35.782, PI, 3.08)
  sign(scene, 'CT', 'OUTPOST', '#4d6864', -2, 2.53, -32.786, 0, 3.36)
  sign(scene, '⇧', 'MID GATE', '#805c39', 0.18, 3.88, -8.328, 0, 1.83)

  arch(scene, -32, 11.1, 1.24, 4.10, 4.52, 1.18, materials.stone)
  arch(scene, -32, -9.4, 1.18, 4.12, 4.54, 1.17, materials.stone)
  builder.add(materials.plaster[2], -32, 5.55, 9.91, 9.44, 2.76, 2.1)
  builder.add(materials.plaster[0], -32, 5.27, -8.76, 9.54, 2.32, 2.1)
  for (const z of [-6.1, -1.45, 3.7, 8.4]) {
    builder.add(paint('#635a47'), -32, 3.28, z, 10.1, 0.16, 0.22)
    addLantern(builder, { x: -36.74, z }, 2.68)
    if (z === -1.45 || z === 8.4) {
      const glow = new THREE.PointLight('#ffcc83', 3.7, 7.3, 2)
      glow.position.set(-36.4, 2.5, z)
      scene.add(glow)
    }
  }

  wire(scene, new THREE.Vector3(30.68, 7.96, 4.7), new THREE.Vector3(42.28, 7.41, -3.8), 1.52)
  wire(scene, new THREE.Vector3(30.68, 7.67, 4.7), new THREE.Vector3(42.28, 7.21, -3.8), 1.58)
  wire(scene, new THREE.Vector3(30.91, 5.91, 13.13), new THREE.Vector3(32.0, 8.4, -1.13), 1.52)
  wire(scene, new THREE.Vector3(-7.39, 6.64, -8.35), new THREE.Vector3(8.41, 6.48, -8.51), 1.28)
  wire(scene, new THREE.Vector3(-13.2, 6.58, 36.9), new THREE.Vector3(-15.23, 5.79, 25.21), 1.24)

  markSite(scene, 'A')
  markSite(scene, 'B')
  groundDetails(builder)
  builder.finish(scene)

  mesa(scene, 44, -60, 12, 15, '#bdab93')
  mesa(scene, 25, -69, 16, 12.3, '#c1aa92')
  mesa(scene, 1, -69, 13, 13.4, '#bca48a')
  mesa(scene, -27, -66, 17, 16, '#c2a78f')
  mesa(scene, -51, -51, 12, 15, '#bca38d')
  mesa(scene, 59, -34, 13, 17.2, '#c1a990')
  mesa(scene, -49, 51, 14, 14, '#c0a189')
  mesa(scene, 21, 68, 14, 12, '#c2ad93')
}

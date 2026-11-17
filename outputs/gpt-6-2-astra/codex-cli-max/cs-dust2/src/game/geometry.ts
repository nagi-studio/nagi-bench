import * as T from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

export function random(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
}
export const V = (x: number, y: number, z: number) => new T.Vector3(x, y, z)
const reflective = new Set<T.MeshPhongMaterial>()
let reflection: T.CubeTexture | null = null
export function modelReflections(map: T.CubeTexture | null) {
  reflection = map
  for (const material of reflective) {
    material.envMap = map
    material.needsUpdate = true
  }
}
export function paint(color: T.ColorRepresentation, roughness = 0.85, metalness = 0) {
  const material = new T.MeshPhongMaterial({
    color,
    shininess: 7 + Math.pow(1 - roughness, 2) * 125,
    specular: new T.Color().setScalar(0.012 + metalness * 0.13),
  })
  if (metalness > 0.1) {
    material.reflectivity = metalness * 0.052
    material.combine = T.MixOperation
    material.envMap = reflection
    reflective.add(material)
  }
  return material
}
export class Batch {
  private shapes = new Map<T.Material, T.BufferGeometry[]>()
  add(
    geometry: T.BufferGeometry,
    material: T.Material,
    x = 0,
    y = 0,
    z = 0,
    rx = 0,
    ry = 0,
    rz = 0
  ) {
    const m = new T.Matrix4().compose(
      V(x, y, z),
      new T.Quaternion().setFromEuler(new T.Euler(rx, ry, rz, 'YXZ')),
      V(1, 1, 1)
    )
    return this.matrix(geometry, material, m)
  }
  matrix(source: T.BufferGeometry, mat: T.Material, m: T.Matrix4) {
    const g = source.index ? source.toNonIndexed() : source
    if (g !== source) source.dispose()
    g.applyMatrix4(m)
    if (!g.attributes.normal) g.computeVertexNormals()
    if (!g.attributes.uv)
      g.setAttribute(
        'uv',
        new T.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)
      )
    for (const attr of Object.keys(g.attributes))
      if (!['normal', 'position', 'uv'].includes(attr)) g.deleteAttribute(attr)
    const list = this.shapes.get(mat) ?? []
    list.push(g)
    this.shapes.set(mat, list)
  }
  box(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    mat: T.Material,
    ry = 0,
    rx = 0,
    rz = 0,
    uvScale = 0
  ) {
    const g = new T.BoxGeometry(w, h, d)
    if (uvScale) {
      const uv = g.attributes.uv
      for (let i = 0; i < uv.count; i++) {
        const side = Math.floor(i / 4)
        uv.setXY(
          i,
          (uv.getX(i) * (side < 2 ? d : w)) / uvScale,
          (uv.getY(i) * (side === 2 || side === 3 ? d : h)) / uvScale
        )
      }
    }
    this.add(g, mat, x, y, z, rx, ry, rz)
  }
  rod(a: T.Vector3, b: T.Vector3, r1: number, r2: number, mat: T.Material, n = 8) {
    const dir = b.clone().sub(a),
      len = dir.length()
    const q = new T.Quaternion().setFromUnitVectors(V(0, 1, 0), dir.normalize())
    this.matrix(
      new T.CylinderGeometry(r2, r1, len, n),
      mat,
      new T.Matrix4().compose(a.clone().lerp(b, 0.5), q, V(1, 1, 1))
    )
  }
  ball(
    x: number,
    y: number,
    z: number,
    rx: number,
    ry: number,
    rz: number,
    mat: T.Material,
    segments = 8
  ) {
    const g = new T.SphereGeometry(1, segments, Math.max(4, segments - 2))
    g.scale(rx, ry, rz)
    this.add(g, mat, x, y, z)
  }
  group(shadows = true) {
    const group = new T.Group()
    for (const [mat, geos] of this.shapes) {
      const geo = mergeGeometries(geos, false)
      for (const g of geos) g.dispose()
      if (!geo) continue
      geo.computeBoundingSphere()
      const mesh = new T.Mesh(geo, mat)
      mesh.castShadow = shadows
      mesh.receiveShadow = shadows
      group.add(mesh)
    }
    this.shapes.clear()
    return group
  }
}
export function panelTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
  repeat = false
) {
  const c = document.createElement('canvas')
  c.width = width
  c.height = height
  const ctx = c.getContext('2d')!
  draw(ctx)
  const map = new T.CanvasTexture(c)
  map.colorSpace = T.SRGBColorSpace
  map.anisotropy = 4
  if (repeat) map.wrapS = map.wrapT = T.RepeatWrapping
  return map
}
export function texture(kind: 'plaster' | 'wood' | 'sand' | 'stone' | 'fabric', seed = 123) {
  return panelTexture(
    256,
    256,
    (ctx) => {
      const rng = random(seed),
        im = ctx.createImageData(256, 256)
      const noise = Array.from({ length: 32 * 32 }, () => rng())
      const smooth = (x: number, y: number, f: number) => {
        const xx = (x * f) / 256,
          yy = (y * f) / 256,
          ix = Math.floor(xx),
          iy = Math.floor(yy),
          fx = xx - ix,
          fy = yy - iy
        const s = (a: number, b: number) => noise[(a % f) + 32 * (b % f)]
        return (
          (s(ix, iy) * (1 - fx) + s(ix + 1, iy) * fx) * (1 - fy) +
          (s(ix, iy + 1) * (1 - fx) + s(ix + 1, iy + 1) * fx) * fy
        )
      }
      for (let y = 0; y < 256; y++)
        for (let x = 0; x < 256; x++) {
          const n = smooth(x, y, 4) * 0.45 + smooth(x, y, 12) * 0.33 + smooth(x, y, 24) * 0.22
          let v = 185 + 45 * n + rng() * 23
          if (kind === 'wood')
            v =
              168 +
              n * 44 +
              10 * Math.sin(x * 0.77 + 2.7 * Math.sin(y * 0.015 + x * 0.052)) +
              rng() * 16
          if (kind === 'sand') v = 181 + 57 * n + rng() * 19 + 3 * Math.sin(y * 0.48 + 3 * n)
          if (kind === 'fabric')
            v = 182 + 18 * ((x % 3 === 0 ? 1 : 0) + (y % 3 === 0 ? 1 : 0)) + rng() * 24
          const i = (y * 256 + x) * 4
          im.data[i] = v
          im.data[i + 1] = v
          im.data[i + 2] = v
          im.data[i + 3] = 255
        }
      ctx.putImageData(im, 0, 0)
      if (kind === 'plaster') {
        for (let i = 0; i < 900; i++) {
          ctx.fillStyle = rng() > 0.58 ? 'rgba(106,94,74,.13)' : 'rgba(255,249,227,.2)'
          const r = rng() * 2.1
          ctx.fillRect(rng() * 256, rng() * 256, r * 1.6, r * 0.7)
        }
        for (let i = 0; i < 4; i++) {
          let x = rng() * 255,
            y = rng() * 255
          ctx.strokeStyle = 'rgba(78,65,48,.17)'
          ctx.lineWidth = 0.65
          ctx.beginPath()
          ctx.moveTo(x, y)
          for (let j = 0; j < 5; j++) {
            x += (rng() - 0.52) * 8
            y += rng() * 5
            ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      }
      if (kind === 'stone') {
        for (let row = 0; row < 4; row++)
          for (let j = -1; j < 4; j++) {
            const x = j * 85 + (row % 2) * 42 + 1,
              y = row * 64 + 1
            ctx.strokeStyle = 'rgba(76,65,50,.47)'
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, 83, 61)
            ctx.fillStyle = 'rgba(105,90,70,' + rng() * 0.11 + ')'
            ctx.fillRect(x, y, 83, 61)
            ctx.fillStyle = 'rgba(255,250,232,.4)'
            ctx.fillRect(x + 1, y + 1, 81, 2)
          }
      }
      if (kind === 'sand')
        for (let i = 0; i < 1150; i++) {
          const x = rng() * 256,
            y = rng() * 256,
            size = rng() ** 4 * 2 + 0.35
          ctx.fillStyle = 'rgba(103,85,54,.42)'
          ctx.fillRect(x, y, size * 1.7, size)
          ctx.fillStyle = 'rgba(255,249,216,.6)'
          ctx.fillRect(x, y - 0.45, size, 0.55)
        }
    },
    true
  )
}

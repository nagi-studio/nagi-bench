/* ============================================================================
   Voxel kit — a self-contained block-geometry helper. Every character, prop and
   set piece is built from unit cubes, batched into InstancedMesh per material so
   a whole scene stays cheap to draw. This is the project's own implementation;
   it depends only on three.js and no external asset or voxel library.
   ========================================================================== */
import * as THREE from 'three'

const CUBE = new THREE.BoxGeometry(1, 1, 1)

// Collect voxel instances, then bake them into one InstancedMesh per material.
export class VoxelBatch {
  constructor() {
    this.items = [] // { x,y,z,sx,sy,sz,color,ry }
  }
  box(x, y, z, sx = 1, sy = 1, sz = 1, color = 0xffffff, ry = 0) {
    this.items.push({ x, y, z, sx, sy, sz, color, ry })
    return this
  }
  // a filled block region (inclusive) with per-voxel colour jitter
  region(x0, y0, z0, x1, y1, z1, color, jitter = 0) {
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++)
        for (let z = z0; z <= z1; z++) {
          let c = color
          if (jitter > 0) {
            const j = (Math.random() - 0.5) * jitter
            const col = new THREE.Color(color)
            col.offsetHSL(0, 0, j)
            c = col.getHex()
          }
          this.box(x, y, z, 1, 1, 1, c)
        }
    return this
  }
  build(materialOpts = {}) {
    const geo = CUBE
    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: materialOpts.roughness ?? 0.85,
      metalness: materialOpts.metalness ?? 0.05,
      ...materialOpts,
    })
    const inst = new THREE.InstancedMesh(geo, mat, this.items.length)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const pos = new THREE.Vector3()
    const scl = new THREE.Vector3()
    const col = new THREE.Color()
    this.items.forEach((it, i) => {
      pos.set(it.x, it.y, it.z)
      scl.set(it.sx, it.sy, it.sz)
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), it.ry || 0)
      m.compose(pos, q, scl)
      inst.setMatrixAt(i, m)
      col.setHex(it.color)
      inst.setColorAt(i, col)
    })
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
    inst.castShadow = true
    inst.receiveShadow = true
    return inst
  }
}

/* ------------------------------ blocky humanoid ------------------------------ */
// A Minecraft-style figure: distinct head, torso, two arms, two legs. Limbs are
// returned separately so callers can pose / animate them.
export function buildHumanoid(opts = {}) {
  const {
    suit = 0x4a5a72, trim = 0x2b3542, skin = 0xc79a6b, visor = 0x1a2430,
    height = 1, accent = 0x9fb0c4,
  } = opts
  const g = new THREE.Group()
  const batch = new VoxelBatch()

  const S = height / 1.8 // scale so total height ~ `height`
  const u = S // one voxel unit

  // legs
  const legGeo = (side) => {
    const b = new VoxelBatch()
    b.region(0, 0, 0, 0, 3, 0, suit, 0.05)      // 4 voxels tall
    b.box(0, 0, 0, 1, 1, 1.2, trim)              // boot
    const m = b.build()
    m.position.set(side * 1.1 * u, 0, 0)
    m.scale.setScalar(u)
    return m
  }
  const legL = legGeo(-1)
  const legR = legGeo(1)
  // torso
  const torsoB = new VoxelBatch()
  torsoB.region(-1, 0, 0, 1, 4, 0, suit, 0.06)
  torsoB.region(-1, 0, 0, 1, 4, 0, suit, 0.0)
  torsoB.box(0, 2.4, 0.6, 2.2, 2.2, 0.6, trim)  // chest rig
  const torso = torsoB.build()
  torso.position.set(0, 4 * u, 0)
  torso.scale.setScalar(u)
  // arms
  const armGeo = (side) => {
    const b = new VoxelBatch()
    b.region(0, 0, 0, 0, 3, 0, suit, 0.05)
    b.box(0, 0, 0, 1, 1, 1, skin)                // hand
    const m = b.build()
    m.position.set(side * 1.9 * u, 7.6 * u, 0)
    m.scale.setScalar(u)
    return m
  }
  const armL = armGeo(-1)
  const armR = armGeo(1)
  // head + helmet + visor
  const headB = new VoxelBatch()
  headB.region(-1, 0, -1, 1, 1, 1, skin, 0.03)   // head 3x2x3-ish
  headB.region(-1, 1, -1, 1, 1, 1, trim, 0.03)   // helmet top
  headB.box(0, 0.4, -1.05, 2, 1.1, 0.4, visor)   // visor facing -Z
  headB.box(0, 1.4, 0, 2.4, 0.4, 2.4, accent)    // helmet rim
  const head = headB.build()
  head.position.set(0, 8.6 * u, 0)
  head.scale.setScalar(u)

  g.add(legL, legR, torso, armL, armR, head)
  g.userData = { legL, legR, torso, armL, armR, head }
  return g
}

/* ------------------------------ simple props ------------------------------ */
export function buildMeteorite(size = 2, color = 0x6b6f78) {
  const b = new VoxelBatch()
  const r = size
  for (let x = -r; x <= r; x++)
    for (let y = -r; y <= r; y++)
      for (let z = -r; z <= r; z++) {
        const d = Math.sqrt(x * x + y * y * 1.3 + z * z)
        if (d <= r && Math.random() > d / (r + 1.2)) {
          const col = new THREE.Color(color)
          col.offsetHSL(0, 0, (Math.random() - 0.5) * 0.18)
          b.box(x, y, z, 1, 1, 1, col.getHex())
        }
      }
  return b.build({ roughness: 0.95, metalness: 0.25 })
}

export function buildBullet(scale = 1) {
  const b = new VoxelBatch()
  // casing
  b.region(0, 0, -2, 0, 0, 1, 0xb08d3f, 0.05)
  // tip
  b.box(0, 0, -3, 0.7, 0.7, 1, 0xd8b45a)
  b.box(0, 0, -3.6, 0.4, 0.4, 0.6, 0xe8c874)
  const m = b.build({ roughness: 0.4, metalness: 0.7 })
  m.scale.setScalar(scale)
  return m
}

export function buildRifle(scale = 1) {
  const b = new VoxelBatch()
  b.region(0, 0, -3, 0, 0, 2, 0x2a2a2c, 0.04)  // body
  b.region(0, 0, -5, 0, 0, -3, 0x1c1c1e, 0.0)  // barrel
  b.box(0, -1, 0, 1, 1.4, 1.2, 0x232325)        // grip
  b.box(0, 0, -2, 0.8, 1.2, 1, 0x3a3d44)        // magazine
  const m = b.build({ roughness: 0.5, metalness: 0.4 })
  m.scale.setScalar(scale)
  return m
}

// A starfield of point sprites for space scenes.
export function buildStars(count = 1400, radius = 260) {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    // random point on a sphere shell
    const u = Math.random() * 2 - 1
    const th = Math.random() * Math.PI * 2
    const s = Math.sqrt(1 - u * u)
    const r = radius * (0.7 + Math.random() * 0.3)
    pos[i * 3] = r * s * Math.cos(th)
    pos[i * 3 + 1] = r * u
    pos[i * 3 + 2] = r * s * Math.sin(th)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: true, transparent: true, opacity: 0.9 })
  return new THREE.Points(geo, mat)
}

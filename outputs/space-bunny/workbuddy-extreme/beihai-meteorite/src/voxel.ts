// 体素美术：全部由方块几何体程序化生成，不使用任何外部资产或贴图
import * as THREE from 'three'

/** 体素尺寸基准 */
const U = 0.42

/** 方块人物：头/躯干/双臂/双腿，方块造型 */
export function voxelHuman(opts: {
  coat: number
  skin: number
  hair?: number
  accent: number
  /** 1 = 标准比例 */
  scale?: number
}): THREE.Group {
  const g = new THREE.Group()
  const s = opts.scale ?? 1

  const coat = new THREE.MeshLambertMaterial({ color: opts.coat })
  const skin = new THREE.MeshLambertMaterial({ color: opts.skin })
  const hair = new THREE.MeshLambertMaterial({ color: opts.hair ?? 0x1c1a18 })
  const accent = new THREE.MeshLambertMaterial({ color: opts.accent })

  const box = (
    w: number,
    h: number,
    d: number,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number
  ): THREE.Mesh => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w * U * s, h * U * s, d * U * s), mat)
    m.position.set(x * U * s, y * U * s, z * U * s)
    g.add(m)
    return m
  }

  // 腿
  box(1, 3, 1, coat, -1, 1.5, 0)
  box(1, 3, 1, coat, 1, 1.5, 0)
  // 鞋
  box(1, 1, 2, accent, -1, 0.5, 0.4)
  box(1, 1, 2, accent, 1, 0.5, 0.4)
  // 躯干
  box(3, 3, 2, coat, 0, 4.5, 0)
  // 领章
  box(3, 1, 2, accent, 0, 5.6, 0)
  // 臂
  box(1, 3, 1, coat, -2, 4.6, 0)
  box(1, 3, 1, coat, 2, 4.6, 0)
  // 手
  box(1, 1, 1, skin, -2, 3.0, 0.3)
  box(1, 1, 1, skin, 2, 3.0, 0.3)
  // 颈
  box(1, 1, 1, skin, 0, 6.4, 0)
  // 头
  box(2, 2, 2, skin, 0, 7.4, 0)
  // 头发
  box(2, 1, 2, hair, 0, 8.3, 0)
  // 眼（发光小方块，用于表情强调）
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0c })
  box(1, 1, 1, eyeMat, -0.5, 7.4, 1.0)
  box(1, 1, 1, eyeMat, 0.5, 7.4, 1.0)

  g.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  return g
}

/** 星舰：方块化的船体 */
export function voxelShip(scale = 1): THREE.Group {
  const g = new THREE.Group()
  const hull = new THREE.MeshLambertMaterial({ color: 0x8e9299 })
  const dark = new THREE.MeshLambertMaterial({ color: 0x3d4249 })
  const glow = new THREE.MeshBasicMaterial({ color: 0x6fd0ff })
  const warn = new THREE.MeshBasicMaterial({ color: 0xff5a3c })

  const b = (
    w: number,
    h: number,
    d: number,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number
  ): void => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    m.position.set(x, y, z)
    g.add(m)
  }

  // 主船体：分段的方块结构
  b(3.2, 2.0, 12, hull, 0, 0, 0)
  b(2.4, 1.5, 8, hull, 0, 0, -9)
  b(1.6, 1.1, 5, dark, 0, 0.2, -15)
  // 舰桥
  b(2.0, 1.4, 2.6, dark, 0, 1.6, -2.4)
  b(2.1, 0.4, 2.7, glow, 0, 2.4, -2.4)
  // 引擎
  b(2.6, 1.4, 2.2, dark, 0, 0, 6.4)
  for (const sx of [-0.8, 0.8]) {
    b(0.7, 0.7, 1.0, glow, sx, 0, 7.6)
  }
  // 侧舷
  b(0.7, 0.9, 7, hull, -2.0, 0.2, -1)
  b(0.7, 0.9, 7, hull, 2.0, 0.2, -1)
  // 警示灯
  b(0.3, 0.3, 0.3, warn, -2.2, 0.8, -4.5)
  b(0.3, 0.3, 0.3, warn, 2.2, 0.8, -4.5)

  g.scale.setScalar(scale)
  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true
  })
  return g
}

/** 手持步枪（方块化） */
export function voxelRifle(): THREE.Group {
  const g = new THREE.Group()
  const m = new THREE.MeshLambertMaterial({ color: 0x33373d })
  const a = (w: number, h: number, d: number, x: number, y: number, z: number): void => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m)
    mesh.position.set(x, y, z)
    g.add(mesh)
  }
  a(0.12, 0.16, 1.5, 0, 0, 0)
  a(0.08, 0.08, 0.9, 0, 0.02, 1.0)
  a(0.1, 0.36, 0.18, 0, -0.24, 0.1)
  a(0.1, 0.24, 0.12, 0, -0.1, -0.6)
  return g
}

/** 方块化建筑/掩体 */
export function voxelBlockWall(w: number, h: number, d: number, color: number): THREE.Group {
  const g = new THREE.Group()
  const mat = new THREE.MeshLambertMaterial({ color })
  const rows = Math.max(1, Math.round(h / 0.5))
  const cols = Math.max(1, Math.round(w / 0.5))
  const geo = new THREE.BoxGeometry(w / cols, h / rows, d)
  const inst = new THREE.InstancedMesh(geo, mat, rows * cols)
  const m = new THREE.Matrix4()
  let i = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      m.makeTranslation(
        -w / 2 + (c + 0.5) * (w / cols),
        -h / 2 + (r + 0.5) * (h / rows),
        0
      )
      inst.setMatrixAt(i++, m)
    }
  }
  inst.instanceMatrix.needsUpdate = true
  inst.castShadow = true
  inst.receiveShadow = true
  g.add(inst)
  return g
}

/** 程序化星空背景 */
export function starfield(count: number, radius: number): THREE.Points {
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    // 球面均匀分布
    const u = Math.random() * 2 - 1
    const th = Math.random() * Math.PI * 2
    const r = Math.sqrt(1 - u * u)
    pos[i * 3] = Math.cos(th) * r * radius
    pos[i * 3 + 1] = u * radius
    pos[i * 3 + 2] = Math.sin(th) * r * radius
    const w = 0.65 + Math.random() * 0.35
    col[i * 3] = w
    col[i * 3 + 1] = w
    col[i * 3 + 2] = Math.min(1, w + 0.12)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({
    size: 1.1,
    vertexColors: true,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.9
  })
  return new THREE.Points(geo, mat)
}

/** 方块化行星（球体用方块近似） */
export function voxelPlanet(radius: number, color: number, seed: number): THREE.Group {
  const g = new THREE.Group()
  const mat = new THREE.MeshLambertMaterial({ color })
  const step = radius * 0.42
  const n = Math.ceil((radius * 2) / step)
  let s = seed
  const rnd = (): number => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const half = Math.floor(n / 2)
  const geo = new THREE.BoxGeometry(step * 0.96, step * 0.96, step * 0.96)
  const positions: THREE.Vector3[] = []
  for (let ix = -half; ix <= half; ix++) {
    for (let iy = -half; iy <= half; iy++) {
      for (let iz = -half; iz <= half; iz++) {
        const x = ix * step
        const y = iy * step
        const z = iz * step
        if (x * x + y * y + z * z <= radius * radius) {
          positions.push(new THREE.Vector3(x, y, z))
        }
      }
    }
  }
  const inst = new THREE.InstancedMesh(geo, mat, positions.length)
  const m = new THREE.Matrix4()
  positions.forEach((p, i) => {
    m.makeTranslation(p.x, p.y, p.z)
    inst.setMatrixAt(i, m)
  })
  inst.instanceMatrix.needsUpdate = true
  g.add(inst)
  void rnd
  return g
}

/** 程序化行星环 */
export function voxelRing(
  inner: number,
  outer: number,
  color: number,
  seg = 64
): THREE.Mesh {
  const geo = new THREE.RingGeometry(inner, outer, seg, 1)
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.42,
    side: THREE.DoubleSide
  })
  const m = new THREE.Mesh(geo, mat)
  m.rotation.x = Math.PI / 2 - 0.38
  return m
}

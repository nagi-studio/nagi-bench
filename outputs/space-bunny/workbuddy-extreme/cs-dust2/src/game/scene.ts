// 场景构建：全部几何体由代码生成，不使用任何外部模型或贴图
import * as THREE from 'three'
import { FLOORS, WALLS, WORLD, BOMB_SITES, SPAWNS } from './map'
import type { Team } from './types'

/* ------------------------------------------------------------------ */
/* 程序化纹理                                                           */
/* ------------------------------------------------------------------ */
function noiseTexture(
  base: string,
  spots: string,
  density: number,
  size = 64
): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  g.fillStyle = base
  g.fillRect(0, 0, size, size)
  g.fillStyle = spots
  for (let i = 0; i < density; i++) {
    g.globalAlpha = 0.25 + Math.random() * 0.4
    g.fillRect(Math.random() * size, Math.random() * size, 2, 2)
  }
  g.globalAlpha = 1
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(6, 6)
  return t
}

/** 沙土墙面 */
export const MAT_SAND = new THREE.MeshLambertMaterial({
  map: noiseTexture('#c2a179', '#9c7f5c', 220)
})
/** 石质地面 */
export const MAT_STONE = new THREE.MeshLambertMaterial({
  map: noiseTexture('#8d8477', '#6f675c', 160)
})
/** 木箱 */
export const MAT_CRATE = new THREE.MeshLambertMaterial({
  map: noiseTexture('#9a7345', '#6f522d', 120)
})
/** 深色金属 */
export const MAT_METAL = new THREE.MeshLambertMaterial({ color: 0x6b6f76 })
/** CT 阵营色 */
export const MAT_CT = new THREE.MeshLambertMaterial({ color: 0x4a7ec4 })
/** T 阵营色 */
export const MAT_T = new THREE.MeshLambertMaterial({ color: 0xc4913c })
/** 皮肤 */
export const MAT_SKIN = new THREE.MeshLambertMaterial({ color: 0xc9a183 })
/** C4 炸弹 */
export const MAT_BOMB = new THREE.MeshLambertMaterial({ color: 0x22262c })
export const MAT_BOMB_LED = new THREE.MeshBasicMaterial({ color: 0xff3b30 })
/** A/B 点标记 */
export const MAT_SITE = new THREE.MeshLambertMaterial({
  color: 0xd94f3d,
  transparent: true,
  opacity: 0.42
})

/* ------------------------------------------------------------------ */
/* 场景搭建                                                            */
/* ------------------------------------------------------------------ */
export function buildScene(scene: THREE.Scene): THREE.Group {
  const world = new THREE.Group()
  scene.add(world)

  scene.background = new THREE.Color(WORLD.sky)
  scene.fog = new THREE.Fog(WORLD.fog, 55, 165)

  // 地面
  const groundGeo = new THREE.PlaneGeometry(
    WORLD.maxX - WORLD.minX,
    WORLD.maxZ - WORLD.minZ
  )
  groundGeo.rotateX(-Math.PI / 2)
  const ground = new THREE.Mesh(groundGeo, MAT_STONE)
  ground.position.set(
    (WORLD.minX + WORLD.maxX) / 2,
    WORLD.floorY - 0.02,
    (WORLD.minZ + WORLD.maxZ) / 2
  )
  ground.receiveShadow = true
  world.add(ground)

  // 各高度层地板
  for (const f of FLOORS) {
    if (f.y <= 0.01) continue
    const g = new THREE.PlaneGeometry(f.maxX - f.minX, f.maxZ - f.minZ)
    g.rotateX(-Math.PI / 2)
    const m = new THREE.Mesh(g, MAT_STONE)
    m.position.set((f.minX + f.maxX) / 2, f.y, (f.minZ + f.maxZ) / 2)
    m.receiveShadow = true
    world.add(m)
    // 侧面裙边，避免高台悬空感
    const skirt = new THREE.Mesh(
      new THREE.BoxGeometry(f.maxX - f.minX, f.y, f.maxZ - f.minZ),
      MAT_SAND
    )
    skirt.position.set((f.minX + f.maxX) / 2, f.y / 2, (f.minZ + f.maxZ) / 2)
    world.add(skirt)
  }

  // 墙体
  for (const w of WALLS) {
    const sx = w.maxX - w.minX
    const sy = w.maxY - w.minY
    const sz = w.maxZ - w.minZ
    const geo = new THREE.BoxGeometry(sx, sy, sz)
    const m = new THREE.Mesh(geo, MAT_SAND)
    m.position.set((w.minX + w.maxX) / 2, (w.minY + w.maxY) / 2, (w.minZ + w.maxZ) / 2)
    m.castShadow = true
    m.receiveShadow = true
    world.add(m)
  }

  // 出生点地面标记
  for (const team of ['CT', 'T'] as Team[]) {
    const sp = SPAWNS[team]
    const cx = sp.reduce((a, p) => a + p.x, 0) / sp.length
    const cz = sp.reduce((a, p) => a + p.z, 0) / sp.length
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(2.4, 3.0, 32),
      team === 'CT' ? MAT_CT : MAT_T
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.set(cx, 0.03, cz)
    world.add(ring)
  }

  // 下包点标记
  for (const site of BOMB_SITES) {
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(site.radius, 40),
      MAT_SITE
    )
    disc.rotation.x = -Math.PI / 2
    disc.position.set(site.x, site.y + 0.04, site.z)
    world.add(disc)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(site.radius - 0.35, site.radius, 40),
      new THREE.MeshBasicMaterial({ color: 0xff6b57, transparent: true, opacity: 0.75 })
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.set(site.x, site.y + 0.05, site.z)
    world.add(ring)
  }

  // 灯光
  scene.add(new THREE.HemisphereLight(0xbdd6ee, 0x6b5a44, 0.95))
  const sun = new THREE.DirectionalLight(0xfff0d4, 1.0)
  sun.position.set(40, 70, 30)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = -55
  sun.shadow.camera.right = 55
  sun.shadow.camera.top = 55
  sun.shadow.camera.bottom = -55
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 220
  sun.shadow.bias = -0.0009
  scene.add(sun)

  return world
}

/* ------------------------------------------------------------------ */
/* 角色：独立头/躯干/双臂/双腿 + 持枪                                   */
/* ------------------------------------------------------------------ */
export function buildCharacter(team: Team, weaponKind: 'rifle' | 'pistol' | 'knife'): THREE.Group {
  const g = new THREE.Group()
  const body = team === 'CT' ? MAT_CT : MAT_T
  const dark = new THREE.MeshLambertMaterial({ color: team === 'CT' ? 0x2c4a70 : 0x6b4d1c })

  // 躯干
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.66, 0.30), body)
  torso.position.y = 1.16
  g.add(torso)
  // 腰部
  const waist = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.22, 0.28), dark)
  waist.position.y = 0.72
  g.add(waist)

  // 头（独立）
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.30, 0.28), MAT_SKIN)
  head.position.y = 1.66
  g.add(head)
  // 头盔（阵营标识）
  const helm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.32), dark)
  helm.position.y = 1.80
  g.add(helm)
  // 护目镜
  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.30, 0.08, 0.03),
    new THREE.MeshBasicMaterial({ color: team === 'CT' ? 0x6fd0ff : 0xffb060 })
  )
  visor.position.set(0, 1.68, 0.155)
  g.add(visor)

  // 双臂（独立，可做持枪姿态）
  const armL = new THREE.Group()
  const upperL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.34, 0.14), body)
  upperL.position.y = -0.17
  armL.add(upperL)
  const foreL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.32, 0.12), MAT_SKIN)
  foreL.position.y = -0.50
  armL.add(foreL)
  armL.position.set(-0.34, 1.40, 0.10)
  armL.rotation.x = -0.95
  g.add(armL)

  const armR = new THREE.Group()
  const upperR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.34, 0.14), body)
  upperR.position.y = -0.17
  armR.add(upperR)
  const foreR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.32, 0.12), MAT_SKIN)
  foreR.position.y = -0.50
  armR.add(foreR)
  armR.position.set(0.34, 1.40, 0.10)
  armR.rotation.x = -1.15
  g.add(armR)

  // 双腿（独立）
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.44, 0.18), dark)
  legL.position.set(-0.13, 0.36, 0)
  g.add(legL)
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.44, 0.18), dark)
  legR.position.set(0.13, 0.36, 0)
  g.add(legR)
  // 鞋
  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.12, 0.30), MAT_METAL)
  shoeL.position.set(-0.13, 0.06, 0.04)
  g.add(shoeL)
  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.12, 0.30), MAT_METAL)
  shoeR.position.set(0.13, 0.06, 0.04)
  g.add(shoeR)

  // 武器（随朝向）
  const weapon = buildWeaponModel(weaponKind)
  weapon.position.set(0.26, 1.18, 0.42)
  g.add(weapon)

  g.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  return g
}

/** 第三人称武器模型 */
export function buildWeaponModel(kind: 'rifle' | 'pistol' | 'knife'): THREE.Group {
  const g = new THREE.Group()
  const metal = MAT_METAL
  if (kind === 'knife') {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.46), metal)
    blade.position.z = 0.30
    g.add(blade)
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.06, 0.16),
      new THREE.MeshLambertMaterial({ color: 0x3a2a1c })
    )
    handle.position.z = 0.02
    g.add(handle)
    return g
  }
  if (kind === 'pistol') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.13, 0.30), metal)
    g.add(body)
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.20, 0.10), metal)
    grip.position.set(0, -0.14, -0.06)
    grip.rotation.x = 0.22
    g.add(grip)
    return g
  }
  // 步枪
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.12, 0.72), metal)
  g.add(body)
  const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 0.42), metal)
  barrel.position.z = 0.55
  g.add(barrel)
  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.12), metal)
  mag.position.set(0, -0.16, 0.02)
  mag.rotation.x = -0.18
  g.add(mag)
  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.26), metal)
  stock.position.z = -0.48
  g.add(stock)
  return g
}

/** 第一人称手持模型（挂在相机上） */
export function buildViewModel(weaponId: string): THREE.Group {
  const g = new THREE.Group()
  const metal = new THREE.MeshLambertMaterial({ color: 0x5c6068 })

  const add = (w: number, h: number, d: number, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), metal)
    m.position.set(x, y, z)
    g.add(m)
    return m
  }

  switch (weaponId) {
    case 'knife':
      add(0.03, 0.04, 0.30, 0, -0.02, -0.28)
      add(0.04, 0.05, 0.12, 0, -0.04, -0.02)
      break
    case 'glock':
    case 'usp':
    case 'deagle':
      add(0.05, 0.09, 0.22, 0, -0.05, -0.30)
      add(0.05, 0.15, 0.08, 0, -0.14, -0.20)
      add(0.03, 0.03, 0.06, 0, -0.005, -0.42)
      break
    case 'awp':
      add(0.05, 0.08, 0.90, 0, -0.04, -0.52)
      add(0.035, 0.035, 0.46, 0, -0.01, -1.16)
      add(0.04, 0.16, 0.10, 0, -0.12, -0.26)
      add(0.03, 0.10, 0.24, 0, -0.02, 0.06)   // 瞄准镜镜筒
      break
    default:
      add(0.05, 0.10, 0.70, 0, -0.05, -0.44)
      add(0.03, 0.03, 0.34, 0, -0.01, -0.94)
      add(0.04, 0.18, 0.10, 0, -0.14, -0.22)
      add(0.04, 0.12, 0.20, 0, -0.03, 0.06)
      break
  }
  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.renderOrder = 2
  })
  return g
}

/* ------------------------------------------------------------------ */
/* 物理：AABB 碰撞                                                      */
/* ------------------------------------------------------------------ */
export interface CollisionResult {
  x: number
  y: number
  z: number
  onGround: boolean
}

const RADIUS = 0.42
const HEIGHT = 1.8

function overlaps(x: number, y: number, z: number): boolean {
  const x0 = x - RADIUS
  const x1 = x + RADIUS
  const y0 = y
  const y1 = y + HEIGHT
  const z0 = z - RADIUS
  const z1 = z + RADIUS
  for (const w of WALLS) {
    if (x1 > w.minX && x0 < w.maxX && y1 > w.minY && y0 < w.maxY && z1 > w.minZ && z0 < w.maxZ) {
      return true
    }
  }
  return false
}

/** 从上方落下的支撑高度 */
function supportY(x: number, z: number, fromY: number): number {
  let best = -Infinity
  for (const f of FLOORS) {
    if (x < f.minX || x > f.maxX || z < f.minZ || z > f.maxZ) continue
    if (f.y <= fromY + 0.35 && f.y > best) best = f.y
  }
  // 边界外视为跌落
  if (
    x < WORLD.minX ||
    x > WORLD.maxX ||
    z < WORLD.minZ ||
    z > WORLD.maxZ
  ) {
    return -Infinity
  }
  return best
}

/** 分轴推进的角色移动，返回是否着地 */
export function moveEntity(
  x: number,
  y: number,
  z: number,
  dx: number,
  dy: number,
  dz: number
): CollisionResult {
  let nx = x
  let ny = y
  let nz = z

  // 水平
  if (!overlaps(nx + dx, ny, nz)) nx += dx
  if (!overlaps(nx, ny, nz + dz)) nz += dz

  // 垂直
  let onGround = false
  if (dy <= 0) {
    if (!overlaps(nx, ny + dy, nz)) {
      ny += dy
      // 触地检测
      if (ny <= supportY(nx, nz, ny) + 0.02) {
        ny = supportY(nx, nz, ny)
        onGround = true
      }
    } else {
      onGround = true
    }
  } else {
    if (!overlaps(nx, ny + dy, nz)) ny += dy
  }

  return { x: nx, y: ny, z: nz, onGround }
}

/** 两个实体之间是否被墙遮挡 */
export function canSee(
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number
): boolean {
  const dx = bx - ax
  const dy = by - ay
  const dz = bz - az
  const dist = Math.hypot(dx, dy, dz)
  const steps = Math.ceil(dist / 0.6)
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    const px = ax + dx * t
    const py = ay + dy * t
    const pz = az + dz * t
    for (const w of WALLS) {
      if (
        px > w.minX &&
        px < w.maxX &&
        py > w.minY &&
        py < w.maxY &&
        pz > w.minZ &&
        pz < w.maxZ
      ) {
        return false
      }
    }
  }
  return true
}

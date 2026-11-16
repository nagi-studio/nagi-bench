// 场景装配：十套体素场景，按分镜切换显示
import * as THREE from 'three'
import {
  voxelHuman,
  voxelShip,
  voxelRifle,
  voxelBlockWall,
  starfield,
  voxelPlanet,
  voxelRing
} from './voxel'
import type { SceneId } from './shots'

export interface BuiltScene {
  root: THREE.Group
  /** 需要逐帧更新的对象 */
  tick?: (t: number, dt: number) => void
}

const LIGHT_COOL = 0x9fc4e8
const LIGHT_WARM = 0xffd9a8
const LIGHT_RED = 0xff6a4a
const LIGHT_CYAN = 0x64e8ff

function addLights(
  root: THREE.Group,
  ambient: number,
  key: number,
  keyColor: number,
  pos: [number, number, number]
): void {
  root.add(new THREE.AmbientLight(0x334455, ambient))
  const l = new THREE.DirectionalLight(keyColor, key)
  l.position.set(pos[0], pos[1], pos[2])
  l.castShadow = true
  l.shadow.mapSize.set(1024, 1024)
  l.shadow.camera.left = -24
  l.shadow.camera.right = 24
  l.shadow.camera.top = 24
  l.shadow.camera.bottom = -24
  l.shadow.camera.near = 1
  l.shadow.camera.far = 90
  l.shadow.bias = -0.001
  root.add(l)
}

/** 星空：行星 + 星环 + 星场 */
function buildStarfield(): BuiltScene {
  const root = new THREE.Group()
  addLights(root, 0.5, 0.6, 0xffffff, [10, 20, 10])

  const stars = starfield(900, 220)
  root.add(stars)

  // 远景行星：气态巨行星 + 星环
  const gas = voxelPlanet(9, 0x8a6a4a, 42)
  gas.position.set(-34, 8, -90)
  root.add(gas)
  const ring = voxelRing(12, 18, 0xc8b090)
  ring.position.copy(gas.position)
  root.add(ring)

  // 近景小行星带（方块碎石）
  const rockMat = new THREE.MeshLambertMaterial({ color: 0x5a5f66 })
  const rockGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8)
  const rocks = new THREE.InstancedMesh(rockGeo, rockMat, 120)
  const m = new THREE.Matrix4()
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2 + i * 0.37
    const r = 26 + ((i * 7) % 22)
    m.makeTranslation(
      Math.cos(a) * r,
      ((i * 13) % 17) - 8,
      Math.sin(a) * r * 0.6 - 20
    )
    rocks.setMatrixAt(i, m)
  }
  rocks.instanceMatrix.needsUpdate = true
  root.add(rocks)

  return {
    root,
    tick: (t) => {
      stars.rotation.y = t * 0.006
      ring.rotation.z = t * 0.02
      gas.rotation.y = t * 0.012
    }
  }
}

/** 海面：方块化波浪 + 地平线 */
function buildOcean(): BuiltScene {
  const root = new THREE.Group()
  addLights(root, 0.55, 0.85, LIGHT_WARM, [20, 16, 12])

  const waterMat = new THREE.MeshLambertMaterial({ color: 0x1d4a6e, transparent: true, opacity: 0.92 })
  const N = 26
  const geo = new THREE.BoxGeometry(4, 0.6, 4)
  const waves = new THREE.InstancedMesh(geo, waterMat, N * N)
  const m = new THREE.Matrix4()
  const dummy = new THREE.Object3D()
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      dummy.position.set((i - N / 2) * 4, 0, (j - N / 2) * 4)
      dummy.updateMatrix()
      waves.setMatrixAt(i * N + j, dummy.matrix)
    }
  }
  waves.instanceMatrix.needsUpdate = true
  waves.receiveShadow = true
  root.add(waves)

  // 远处云层
  const cloudMat = new THREE.MeshLambertMaterial({ color: 0xd8e4ee, transparent: true, opacity: 0.5 })
  for (let i = 0; i < 16; i++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(9, 1.4, 5), cloudMat)
    c.position.set(((i * 17) % 90) - 45, 12 + ((i * 5) % 7), -50 - ((i * 11) % 40))
    root.add(c)
  }

  return {
    root,
    tick: (t) => {
      // 方块波浪：按正弦升降
      let k = 0
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const y = Math.sin(t * 0.9 + i * 0.42 + j * 0.31) * 0.34
            + Math.sin(t * 1.7 + i * 0.2 - j * 0.5) * 0.16
          dummy.position.set((i - N / 2) * 4, y, (j - N / 2) * 4)
          dummy.rotation.set(0, (y * 0.06), 0)
          dummy.updateMatrix()
          waves.setMatrixAt(k++, dummy.matrix)
        }
      }
      waves.instanceMatrix.needsUpdate = true
    }
  }
}

/** 舱外甲板：章北海独处 */
function buildDeck(): BuiltScene {
  const root = new THREE.Group()
  addLights(root, 0.5, 0.8, LIGHT_CYAN, [12, 18, 8])

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(26, 0.5, 26),
    new THREE.MeshLambertMaterial({ color: 0x4a5058 })
  )
  floor.position.y = -0.25
  floor.receiveShadow = true
  root.add(floor)
  // 甲板栅格
  for (let i = -6; i <= 6; i++) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.12, 26),
      new THREE.MeshLambertMaterial({ color: 0x5c636c })
    )
    bar.position.set(i * 2, 0.06, 0)
    root.add(bar)
  }
  // 舱壁
  const wall = voxelBlockWall(26, 5, 1, 0x565d66)
  wall.position.set(0, 2.5, -13)
  root.add(wall)

  // 舷窗（可看星空）
  const portMat = new THREE.MeshBasicMaterial({ color: 0x0a1420, transparent: true, opacity: 0.9 })
  for (let i = -1; i <= 1; i++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.4, 0.3), portMat)
    p.position.set(i * 8, 2.8, -12.4)
    root.add(p)
  }

  // 章北海
  const man = voxelHuman({ coat: 0x2b3a4a, skin: 0xc9a183, accent: 0x8a1f2b, scale: 1.0 })
  man.position.set(1.2, 0, 3)
  man.rotation.y = Math.PI
  root.add(man)

  // 补光（人物侧逆光）
  const rim = new THREE.PointLight(0x64e8ff, 0.7, 18)
  rim.position.set(-4, 4, -3)
  root.add(rim)

  return {
    root,
    tick: (t) => {
      man.position.y = 0
      man.rotation.y = Math.PI + Math.sin(t * 0.22) * 0.06
    }
  }
}

/** 舰桥 */
function buildBridge(): BuiltScene {
  const root = new THREE.Group()
  addLights(root, 0.42, 0.5, LIGHT_CYAN, [8, 14, 6])

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.4, 16),
    new THREE.MeshLambertMaterial({ color: 0x39404a })
  )
  floor.position.y = -0.2
  root.add(floor)
  const back = voxelBlockWall(18, 6, 1, 0x454c56)
  back.position.set(0, 3, -8)
  root.add(back)

  // 全息星图
  const holo = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0x2f7fa8, transparent: true, opacity: 0.42, wireframe: true })
  )
  holo.position.set(0, 2.4, -1)
  root.add(holo)

  // 控制台
  const cons = voxelBlockWall(7, 1.4, 2, 0x2b323b)
  cons.position.set(0, 0.9, 1.6)
  root.add(cons)
  for (let i = -3; i <= 3; i++) {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.1, 0.5),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffb060 : 0x64e8ff })
    )
    b.position.set(i * 0.9, 1.65, 1.4)
    root.add(b)
  }

  const man = voxelHuman({ coat: 0x24303c, skin: 0xc9a183, accent: 0x8a1f2b })
  man.position.set(0, 0, 2.8)
  man.rotation.y = Math.PI
  root.add(man)

  return {
    root,
    tick: (t) => {
      holo.rotation.y = t * 0.3
      holo.rotation.x = Math.sin(t * 0.2) * 0.2
      man.rotation.y = Math.PI + Math.sin(t * 0.18) * 0.05
    }
  }
}

/** 计划室会谈：章北海与希恩斯 */
function buildMeting(): BuiltScene {
  const root = new THREE.Group()
  addLights(root, 0.34, 0.44, LIGHT_WARM, [10, 12, 8])

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.4, 20),
    new THREE.MeshLambertMaterial({ color: 0x3a3630 })
  )
  floor.position.y = -0.2
  floor.receiveShadow = true
  root.add(floor)
  const wall = voxelBlockWall(20, 6, 1, 0x4a443c)
  wall.position.set(0, 3, -10)
  root.add(wall)

  // 中央长桌
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(7, 0.3, 2.6),
    new THREE.MeshLambertMaterial({ color: 0x5a5044 })
  )
  table.position.y = 1.0
  root.add(table)
  const leg = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.0, 1.2),
    new THREE.MeshLambertMaterial({ color: 0x3d372f })
  )
  leg.position.y = 0.5
  root.add(leg)

  // 全息沙盘
  const sand = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 0.1, 20),
    new THREE.MeshBasicMaterial({ color: 0x3a6a8a, transparent: true, opacity: 0.5 })
  )
  sand.position.set(0, 1.4, 0)
  root.add(sand)

  // 章北海（深色大衣）与希恩斯（浅色）
  const zhang = voxelHuman({ coat: 0x22303c, skin: 0xc9a183, accent: 0x8a1f2b })
  zhang.position.set(-2.2, 0, 1.4)
  zhang.rotation.y = Math.PI / 2
  root.add(zhang)

  const xience = voxelHuman({ coat: 0x5a5f66, skin: 0xd0ab8c, hair: 0x6a6258, accent: 0x7a8290 })
  xience.position.set(2.2, 0, 1.4)
  xience.rotation.y = -Math.PI / 2
  root.add(xience)

  // 壁灯（室内暖光，强对比）
  for (const sx of [-1, 1]) {
    const l = new THREE.PointLight(0xffb070, 0.55, 16)
    l.position.set(sx * 8, 3.4, -4)
    root.add(l)
  }

  return {
    root,
    tick: (t) => {
      sand.rotation.y = t * 0.24
      zhang.rotation.y = Math.PI / 2 + Math.sin(t * 0.3) * 0.05
      xience.rotation.y = -Math.PI / 2 + Math.sin(t * 0.26 + 1) * 0.06
    }
  }
}

/** 走廊 */
function buildCorridor(): BuiltScene {
  const root = new THREE.Group()
  addLights(root, 0.3, 0.3, 0xbcd0e0, [0, 10, 4])

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.3, 26),
    new THREE.MeshLambertMaterial({ color: 0x353b44 })
  )
  floor.position.y = -0.15
  root.add(floor)
  for (const sx of [-1, 1]) {
    const w = voxelBlockWall(26, 5, 0.6, 0x454c56)
    w.rotation.y = Math.PI / 2
    w.position.set(sx * 3, 2.5, 0)
    root.add(w)
  }
  const ceil = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.3, 26),
    new THREE.MeshLambertMaterial({ color: 0x2e343c })
  )
  ceil.position.y = 4.9
  root.add(ceil)

  // 顶部灯带
  const lamps: THREE.Mesh[] = []
  for (let i = -5; i <= 5; i++) {
    const l = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.12, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xd8ecff })
    )
    l.position.set(0, 4.7, i * 2.2)
    root.add(l)
    lamps.push(l)
  }

  return {
    root,
    tick: (t) => {
      // 灯带依次熄灭，制造逼近感
      lamps.forEach((l, i) => {
        const on = ((i + Math.floor(t * 1.6)) % 11) < 8
        ;(l.material as THREE.MeshBasicMaterial).color.setHex(on ? 0xd8ecff : 0x1a2028)
      })
    }
  }
}

/** 引擎舱 */
function buildEngineRoom(): BuiltScene {
  const root = new THREE.Group()
  addLights(root, 0.34, 0.4, LIGHT_RED, [0, 12, 10])

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(16, 0.4, 24),
    new THREE.MeshLambertMaterial({ color: 0x2e3238 })
  )
  floor.position.y = -0.2
  root.add(floor)

  // 主引擎方块结构
  const engineMat = new THREE.MeshLambertMaterial({ color: 0x555b63 })
  const core = voxelBlockWall(6, 6, 14, 0x4e545c)
  core.position.set(0, 3.2, -3)
  root.add(core)
  const glow = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 3.4, 1),
    new THREE.MeshBasicMaterial({ color: 0xff5a3c })
  )
  glow.position.set(0, 3.2, 4.2)
  root.add(glow)

  const man = voxelHuman({ coat: 0x22303c, skin: 0xc9a183, accent: 0x8a1f2b })
  man.position.set(3.4, 0, 4)
  man.rotation.y = -Math.PI / 2
  root.add(man)

  const warn = new THREE.PointLight(LIGHT_RED, 0.7, 20)
  warn.position.set(0, 5, 2)
  root.add(warn)

  return {
    root,
    tick: (t) => {
      const p = 0.55 + Math.sin(t * 4) * 0.35 + Math.sin(t * 11) * 0.1
      ;(glow.material as THREE.MeshBasicMaterial).color.setRGB(p, p * 0.28, p * 0.16)
      warn.intensity = 0.5 + p * 0.5
      man.rotation.y = -Math.PI / 2 + Math.sin(t * 0.3) * 0.05
    }
  }
}

/** 机库：面壁者号 */
function buildHangar(): BuiltScene {
  const root = new THREE.Group()
  addLights(root, 0.36, 0.42, LIGHT_CYAN, [14, 20, 12])

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.4, 44),
    new THREE.MeshLambertMaterial({ color: 0x2b3038 })
  )
  floor.position.y = -0.2
  root.add(floor)
  // 地面导向灯
  for (let i = -5; i <= 5; i++) {
    const g = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.06, 40),
      new THREE.MeshBasicMaterial({ color: 0x2a6a8a })
    )
    g.position.set(i * 3.4, 0.02, 0)
    root.add(g)
  }

  const ship = voxelShip(1.35)
  ship.position.set(0, 2.6, 0)
  ship.rotation.y = Math.PI * 0.02
  root.add(ship)

  const zhang = voxelHuman({ coat: 0x22303c, skin: 0xc9a183, accent: 0x8a1f2b })
  zhang.position.set(4.6, 0, 7)
  zhang.rotation.y = -Math.PI / 2.6
  zhang.add(voxelRifle())
  root.add(zhang)

  return {
    root,
    tick: (t) => {
      ship.position.y = 2.6 + Math.sin(t * 0.5) * 0.06
      zhang.rotation.y = -Math.PI / 2.6 + Math.sin(t * 0.24) * 0.04
    }
  }
}

/** 逃逸：章北海在逃生舱 */
function buildEscape(): BuiltScene {
  const root = new THREE.Group()
  addLights(root, 0.4, 0.5, LIGHT_RED, [-10, 14, 8])

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.3, 20),
    new THREE.MeshLambertMaterial({ color: 0x2a2622 })
  )
  floor.position.y = -0.15
  root.add(floor)
  const wall = voxelBlockWall(20, 6, 1, 0x3e3830)
  wall.rotation.y = Math.PI / 2
  wall.position.set(-7, 3, 0)
  root.add(wall)

  // 应急红光
  const reds: THREE.PointLight[] = []
  for (let i = 0; i < 4; i++) {
    const l = new THREE.PointLight(0xff4030, 0.5, 14)
    l.position.set(-6, 4, -6 + i * 4)
    root.add(l)
    reds.push(l)
  }

  const zhang = voxelHuman({ coat: 0x1e2a36, skin: 0xc9a183, accent: 0x8a1f2b })
  zhang.position.set(-2.5, 0, 2)
  zhang.rotation.y = Math.PI / 2
  const rifle = voxelRifle()
  rifle.position.set(0.5, 1.9, 0.5)
  rifle.rotation.y = Math.PI / 2
  zhang.add(rifle)
  root.add(zhang)

  // 手中的一块陨石（体积很小，是他给自己的最后礼物）
  const meteor = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.18, 0.2),
    new THREE.MeshLambertMaterial({ color: 0x3a2a20 })
  )
  meteor.position.set(0.6, 1.5, 0.9)
  zhang.add(meteor)

  return {
    root,
    tick: (t) => {
      // 应急灯闪烁
      reds.forEach((l, i) => {
        const on = (t * 1.4 + i * 0.25) % 1 < 0.5
        l.intensity = on ? 0.7 : 0.16
      })
      zhang.rotation.y = Math.PI / 2 + Math.sin(t * 0.2) * 0.04
    }
  }
}

/** 陨石：最终意象 */
function buildMeteor(): BuiltScene {
  const root = new THREE.Group()
  addLights(root, 0.3, 0.5, 0xffb080, [12, 16, 10])

  // 陨石本体：由多个方块簇成的粗糙岩体
  const meteor = new THREE.Group()
  const rockMat = new THREE.MeshLambertMaterial({ color: 0x2e2622 })
  const hotMat = new THREE.MeshBasicMaterial({ color: 0xff6a2a })
  const blocks: THREE.Mesh[] = []
  let seed = 7
  const rnd = (): number => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  for (let i = 0; i < 44; i++) {
    const s = 0.5 + rnd() * 1.1
    const b = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), rockMat)
    const r = rnd() * 2.4
    const th = rnd() * Math.PI * 2
    const ph = Math.acos(rnd() * 2 - 1)
    b.position.set(
      r * Math.sin(ph) * Math.cos(th),
      r * Math.cos(ph),
      r * Math.sin(ph) * Math.sin(th)
    )
    b.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3)
    meteor.add(b)
    blocks.push(b)
  }
  // 烧灼的裂隙
  for (let i = 0; i < 7; i++) {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.8, 0.16), hotMat)
    h.position.set((rnd() - 0.5) * 2.4, (rnd() - 0.5) * 2.4, (rnd() - 0.5) * 2.4)
    h.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3)
    meteor.add(h)
    blocks.push(h)
  }
  meteor.position.set(0, 1.2, 0)
  root.add(meteor)

  const stars = starfield(700, 200)
  root.add(stars)

  return {
    root,
    tick: (t) => {
      meteor.rotation.y = t * 0.14
      meteor.rotation.x = Math.sin(t * 0.1) * 0.2
      blocks.forEach((b, i) => {
        if (i % 6 === 0) {
          const p = 0.5 + Math.sin(t * 2.4 + i) * 0.5
          ;(b.material as THREE.MeshBasicMaterial).color.setRGB(1, 0.34 * p, 0.1 * p)
        }
      })
      stars.rotation.y = t * 0.008
    }
  }
}

/** 黑场 */
function buildBlack(): BuiltScene {
  const root = new THREE.Group()
  return { root }
}

/* ------------------------------------------------------------------ */

const BUILDERS: Record<SceneId, () => BuiltScene> = {
  starfield: buildStarfield,
  ocean: buildOcean,
  deck: buildDeck,
  bridge: buildBridge,
  meting: buildMeting,
  engineRoom: buildEngineRoom,
  corridor: buildCorridor,
  hangar: buildHangar,
  escape: buildEscape,
  meteor: buildMeteor,
  black: buildBlack
}

export class ScenePool {
  private cache = new Map<SceneId, BuiltScene>()
  private current: SceneId | null = null
  readonly root = new THREE.Group()

  constructor() {
    this.root.visible = false
  }

  get(id: SceneId): BuiltScene {
    let s = this.cache.get(id)
    if (!s) {
      s = BUILDERS[id]()
      this.cache.set(id, s)
      this.root.add(s.root)
    }
    return s
  }

  /** 切换场景：只显示目标场景 */
  show(id: SceneId): void {
    if (this.current === id) return
    if (this.current) this.get(this.current).root.visible = false
    this.current = id
    const s = this.get(id)
    s.root.visible = true
    this.root.visible = true
  }

  tick(id: SceneId, t: number, dt: number): void {
    const s = this.cache.get(id)
    if (s && s.tick) s.tick(t, dt)
  }
}

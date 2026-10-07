import * as THREE from 'three'
import type { GameWorld } from '../world/gameWorld.ts'
import type { WorldEvent } from '../types.ts'
import type { WeaponId } from '../weapons/weapons.ts'
import { buildMapVisual, type MapVisual } from './mapMesh.ts'
import { buildBomb, buildHumanoid, buildWeaponModel, type Humanoid } from './models.ts'
import { ViewModel, type ViewModelState } from './viewModel.ts'
import { approach, clamp } from '../core/mathUtil.ts'

/** 每帧由控制器给出的镜头参数（第一人称或观察模式） */
export interface CameraRig {
  x: number
  y: number
  z: number
  yaw: number
  /** 含后坐力的俯仰角 */
  pitch: number
  fov: number
  /** 第一人称时隐藏自身模型，防止挡住视线 */
  viewOwnerId: number | null
  showViewModel: boolean
  weapon: WeaponId
  viewState: ViewModelState
}

interface CharView {
  humanoid: Humanoid
  gunId: WeaponId | null
  gun: THREE.Group | null
  walk: number
  fall: number
}

interface Fx {
  obj: THREE.Mesh | THREE.Line
  life: number
  total: number
  baseOpacity: number
  /** 随时间放大到的目标尺寸（爆炸球）；缺省为不缩放 */
  grow: number
}

const NORMAL_FOV = 75
const VIEW_FOV = 70

/**
 * 3D 渲染器（three.js）：只读取 GameWorld 的状态，不修改逻辑。
 * 负责：地图 / 角色 / 门 / C4 的同步、特效（弹道、枪口火光、爆炸）、镜头与第一人称手持模型。
 */
export class GameRenderer {
  private readonly host: HTMLElement
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.PerspectiveCamera(NORMAL_FOV, 1, 0.05, 400)
  private readonly view = new ViewModel()
  private readonly sun: THREE.DirectionalLight
  private readonly bomb: { group: THREE.Group; led: THREE.Mesh }
  private readonly resizeObserver: ResizeObserver
  private map: MapVisual | null = null
  private chars = new Map<number, CharView>()
  private doorAngles: number[] = []
  private fx: Fx[] = []
  private fovNow = NORMAL_FOV
  private time = 0

  constructor(host: HTMLElement) {
    this.host = host
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.autoClear = false
    host.appendChild(this.renderer.domElement)

    this.scene.background = new THREE.Color('#9cc3e6')
    this.scene.fog = new THREE.Fog('#c8dcef', 90, 260)
    this.scene.add(new THREE.HemisphereLight('#cfe3ff', '#7a6446', 1.0))

    this.sun = new THREE.DirectionalLight('#fff1d0', 2.0)
    this.sun.position.set(40, 80, 30)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    this.sun.shadow.camera.left = -70
    this.sun.shadow.camera.right = 70
    this.sun.shadow.camera.top = 70
    this.sun.shadow.camera.bottom = -70
    this.sun.shadow.camera.near = 1
    this.sun.shadow.camera.far = 260
    this.sun.shadow.bias = -0.0008
    this.scene.add(this.sun)

    this.bomb = buildBomb()
    this.bomb.group.visible = false
    this.scene.add(this.bomb.group)

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(host)
    this.resize()
  }

  /** 为世界创建地图与角色模型（一个渲染器只绑定一个世界） */
  attachWorld(world: GameWorld): void {
    this.map = buildMapVisual(world.map)
    this.scene.add(this.map.group)
    this.doorAngles = world.doors.map(() => 0)
    for (const c of world.characters) {
      const humanoid = buildHumanoid(c.team)
      this.scene.add(humanoid.root)
      this.chars.set(c.id, { humanoid, gunId: null, gun: null, walk: 0, fall: 0 })
    }
  }

  /** 3D 画布（用于挂载指针锁定与鼠标事件） */
  get domElement(): HTMLCanvasElement {
    return this.renderer.domElement
  }

  resize(): void {
    const w = Math.max(1, this.host.clientWidth)
    const h = Math.max(1, this.host.clientHeight)
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.view.camera.aspect = w / h
    this.view.camera.updateProjectionMatrix()
  }

  /** 把逻辑事件转换为视觉特效 */
  handleEvents(events: WorldEvent[]): void {
    for (const e of events) {
      if (e.type === 'tracer') this.spawnTracer(e.from, e.to)
      else if (e.type === 'shot') this.spawnFlash(e.x, e.y, e.z)
      else if (e.type === 'explosion') this.spawnExplosion(e.x, e.y, e.z, e.radius)
    }
  }

  render(world: GameWorld, rig: CameraRig, dt: number): void {
    this.time += dt
    this.syncCharacters(world, dt, rig.viewOwnerId)
    this.syncDoors(world, dt)
    this.syncBomb(world)
    this.updateFx(dt)
    this.applyCamera(rig, dt)

    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
    if (rig.showViewModel) {
      this.renderer.clearDepth()
      this.renderer.render(this.view.scene, this.view.camera)
    }
  }

  dispose(): void {
    this.resizeObserver.disconnect()
    for (const f of this.fx) this.disposeObject(f.obj)
    this.fx = []
    this.renderer.dispose()
    if (this.renderer.domElement.parentElement === this.host) this.host.removeChild(this.renderer.domElement)
  }

  // ---------------------------------------------------------------- 同步

  private syncCharacters(world: GameWorld, dt: number, viewOwnerId: number | null): void {
    for (const c of world.characters) {
      const v = this.chars.get(c.id)
      if (!v) continue
      const root = v.humanoid.root
      root.position.set(c.x, c.y, c.z)
      v.fall = approach(v.fall, c.alive ? 0 : 1, dt * 3)
      root.rotation.set(v.fall * (Math.PI / 2), c.yaw, 0, 'YXZ')
      // 第一人称时隐藏自己的身体（只保留手臂与武器）
      root.visible = !(c.id === viewOwnerId && c.alive)

      // 武器模型跟随当前持有的武器
      const id = c.weapon.id
      if (v.gunId !== id) {
        if (v.gun) v.humanoid.gunMount.remove(v.gun)
        v.gun = buildWeaponModel(id)
        v.humanoid.gunMount.add(v.gun)
        v.gunId = id
      }

      // 走路摆腿：速度越快摆幅越大；静止时保持持枪姿势
      const amp = clamp(c.speed / 3, 0, 1)
      v.walk += dt * c.speed * 2.6
      v.humanoid.legL.rotation.x = Math.sin(v.walk) * 0.7 * amp
      v.humanoid.legR.rotation.x = -Math.sin(v.walk) * 0.7 * amp
      v.humanoid.armL.rotation.x = 1.3 + Math.sin(v.walk + Math.PI) * 0.08 * amp
    }
  }

  private syncDoors(world: GameWorld, dt: number): void {
    if (!this.map) return
    world.doors.forEach((d, i) => {
      const target = d.open ? Math.PI / 2 : 0
      this.doorAngles[i] = approach(this.doorAngles[i], target, dt * 4)
      const pivot = this.map?.doorPivots[i]
      if (pivot) pivot.rotation.y = this.doorAngles[i]
    })
  }

  private syncBomb(world: GameWorld): void {
    const b = world.bomb
    const g = this.bomb.group
    if (b.state === 'defused' || b.state === 'exploded') {
      g.visible = false
    } else if (b.state === 'carried') {
      const car = b.carrierId !== null ? world.byId(b.carrierId) : null
      g.visible = !!car && car.alive
      if (car) {
        // 炸弹背在携带者背后
        g.position.set(car.x + Math.sin(car.yaw) * 0.22, car.y + 1.05, car.z + Math.cos(car.yaw) * 0.22)
        g.rotation.y = car.yaw
      }
    } else {
      g.visible = true
      g.position.set(b.x, b.y, b.z)
      g.rotation.y = 0
    }
    const m = this.bomb.led.material as THREE.MeshStandardMaterial
    if (b.state === 'planted') {
      const hz = b.timer < 10 ? 8 : 2
      m.emissiveIntensity = Math.sin(this.time * hz * Math.PI * 2) > 0 ? 1.6 : 0.05
    } else {
      m.emissiveIntensity = 0.4
    }
  }

  private applyCamera(rig: CameraRig, dt: number): void {
    this.fovNow = approach(this.fovNow, rig.fov, dt * 150)
    this.camera.fov = this.fovNow
    this.camera.updateProjectionMatrix()
    this.camera.position.set(rig.x, rig.y, rig.z)
    this.camera.rotation.set(rig.pitch, rig.yaw, 0, 'YXZ')

    this.view.setWeapon(rig.weapon)
    this.view.update(dt, rig.viewState)
    this.view.camera.position.set(0, 0, 0)
    this.view.camera.rotation.set(0, 0, 0)
    this.view.camera.fov = VIEW_FOV
    this.view.camera.updateProjectionMatrix()
  }

  // ---------------------------------------------------------------- 特效

  private addFx(obj: THREE.Mesh | THREE.Line, life: number, baseOpacity: number, grow = 1): void {
    this.scene.add(obj)
    this.fx.push({ obj, life, total: life, baseOpacity, grow })
  }

  private spawnTracer(from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }): void {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(from.x, from.y, from.z),
      new THREE.Vector3(to.x, to.y, to.z),
    ])
    const mat = new THREE.LineBasicMaterial({ color: '#fff0b0', transparent: true, opacity: 0.85 })
    this.addFx(new THREE.Line(geo, mat), 0.07, 0.85)
    // 弹着点火花
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), new THREE.MeshBasicMaterial({ color: '#d8c8a0', transparent: true }))
    spark.position.set(to.x, to.y, to.z)
    this.addFx(spark, 0.25, 1)
  }

  private spawnFlash(x: number, y: number, z: number): void {
    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 8, 8),
      new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true }),
    )
    flash.position.set(x, y, z)
    this.addFx(flash, 0.05, 1)
  }

  private spawnExplosion(x: number, y: number, z: number, radius: number): void {
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 12),
      new THREE.MeshBasicMaterial({ color: '#ff8a2a', transparent: true, opacity: 0.85 }),
    )
    ball.position.set(x, y + 1, z)
    this.addFx(ball, 0.9, 0.85, radius)
  }

  private updateFx(dt: number): void {
    this.fx = this.fx.filter((f) => {
      f.life -= dt
      if (f.life <= 0) {
        this.scene.remove(f.obj)
        this.disposeObject(f.obj)
        return false
      }
      const p = 1 - f.life / f.total
      const mat = f.obj.material as THREE.Material & { opacity: number }
      mat.opacity = f.baseOpacity * (1 - p)
      if (f.grow > 1) {
        const s = Math.max(0.01, p * f.grow)
        f.obj.scale.set(s, s, s)
      }
      return true
    })
  }

  private disposeObject(o: THREE.Mesh | THREE.Line): void {
    o.geometry.dispose()
    const m = o.material
    if (Array.isArray(m)) m.forEach((x) => x.dispose())
    else m.dispose()
  }
}

import * as THREE from 'three'
import { BatchedScenery } from './batchedScenery'
import { currentAmmo, type Match, type MatchEvent } from './match'
import { clamp, distance2, groundY } from './level'
import { EYE_HEIGHT } from './physics'
import { MUZZLES, armSoldier, makeC4, makeFlash, makeSoldier, poseSoldier, viewRig } from './models'
import { makeScenery, shadeGround } from './scenery'
import type { Team, WeaponId } from './arsenal'

type SceneMode = 'menu' | 'playing' | 'paused'
interface Tracer { line: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>; until: number }
interface Particle { sprite: THREE.Sprite; until: number; duration: number; rise: number; size: number }

function hazeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(32, 32, 2, 32, 32, 31)
  gradient.addColorStop(0, '#fff')
  gradient.addColorStop(0.28, '#fffb')
  gradient.addColorStop(0.66, '#fff4')
  gradient.addColorStop(1, '#fff0')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

export class Viewport {
  readonly canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private gl: WebGL2RenderingContext
  private scene = new THREE.Scene()
  private hands = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(67, 1, 0.045, 250)
  private handCamera = new THREE.PerspectiveCamera(58, 1, 0.029, 9)
  private sunlight: THREE.DirectionalLight
  private shadows: THREE.Mesh[] = []
  private sizeChanged = true
  private lastScale = 1
  private preferredScale = 1
  private software = false
  private gpuFrame: WebGLSync | null = null
  private lightweight = false
  private missedFrames = 0
  private groundShadow: THREE.Mesh | null = null
  private batches: BatchedScenery
  private lightMaterials = new Map<THREE.MeshStandardMaterial, THREE.MeshLambertMaterial>()
  private standardMaterials = new Map<THREE.MeshLambertMaterial, THREE.MeshStandardMaterial>()
  private agents = Array.from({ length: 10 }, (_, i) => makeSoldier(i < 5 ? 'CT' : 'T', i % 5))
  private staged = makeSoldier('CT', 2)
  private bomb = makeC4()
  private firstPerson = new THREE.Group()
  private flash = makeFlash()
  private tracers: Tracer[] = []
  private particles: Particle[] = []
  private tracerIndex = 0
  private particleIndex = 0
  private renderModel: { weapon: WeaponId | 'c4'; team: Team } | null = null
  private rigs = new Map<string, THREE.Group>()
  private observer: ResizeObserver
  private lastView = -1
  private lastMode: SceneMode = 'menu'
  private lastRound = -1
  private explosion = { x: 0, z: 0, until: 0 }
  private ghost: THREE.Vector3 = new THREE.Vector3()

  constructor(host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
    this.preferredScale = this.lastScale = Math.min(window.devicePixelRatio || 1, 1.35)
    this.renderer.setPixelRatio(this.lastScale)
    const gl = this.renderer.getContext()
    if (!('fenceSync' in gl)) throw new Error('WebGL 2 is required')
    this.gl = gl
    const detail = gl.getExtension('WEBGL_debug_renderer_info')
    this.software = !!detail && /swiftshader|llvmpipe|software rasterizer/i.test(String(gl.getParameter(detail.UNMASKED_RENDERER_WEBGL)))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.12
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.shadowMap.autoUpdate = false
    this.renderer.shadowMap.needsUpdate = true
    this.renderer.autoClear = false
    this.canvas = this.renderer.domElement
    this.canvas.setAttribute('aria-label', '尘线行动 3D 战区')
    this.canvas.className = 'world-canvas'
    host.append(this.canvas)

    makeScenery(this.scene)
    this.batches = new BatchedScenery(this.scene)
    this.scene.add(new THREE.HemisphereLight('#e1edf4', '#ae8a68', 1.46))
    this.sunlight = new THREE.DirectionalLight('#ffe8c6', 2.65)
    this.sunlight.position.set(-21, 42, 21)
    this.sunlight.castShadow = true
    this.sunlight.shadow.mapSize.set(2048, 2048)
    const shadowCamera = this.sunlight.shadow.camera
    shadowCamera.left = shadowCamera.bottom = -48
    shadowCamera.right = shadowCamera.top = 48
    shadowCamera.near = 2
    shadowCamera.far = 114
    this.sunlight.shadow.normalBias = 0.045
    this.sunlight.shadow.bias = -0.00023
    this.scene.add(this.sunlight, this.sunlight.target)

    const contactMap = hazeTexture()
    const contact = new THREE.MeshBasicMaterial({ map: contactMap, color: '#30281e', transparent: true, opacity: 0.34, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 })
    const plane = new THREE.PlaneGeometry(0.94, 0.78)
    plane.rotateX(-Math.PI / 2)
    this.agents.forEach(agent => {
      const shadow = new THREE.Mesh(plane, contact)
      shadow.visible = false
      this.scene.add(agent.root, shadow)
      this.shadows.push(shadow)
    })
    this.scene.add(this.staged.root, this.bomb.model)
    this.bomb.model.visible = false
    armSoldier(this.staged, 'm4')
    this.staged.root.position.set(36.36, 0, 6.62)
    this.staged.root.rotation.y = -2.28

    const key = new THREE.DirectionalLight('#fff1d9', 2.4)
    key.position.set(-2, 5, 3)
    this.hands.add(new THREE.HemisphereLight('#edf4eb', '#938067', 1.94), key, this.firstPerson)
    this.flash.visible = false
    this.firstPerson.add(this.flash)

    for (let i = 0; i < 27; i++) {
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#ffdc91', opacity: 0.72, transparent: true, depthWrite: false, fog: false }))
      line.visible = false
      line.frustumCulled = false
      this.scene.add(line)
      this.tracers.push({ line, until: 0 })
    }

    const mist = hazeTexture()
    for (let i = 0; i < 48; i++) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: mist, color: '#edd0a6', depthWrite: false, transparent: true }))
      sprite.visible = false
      this.scene.add(sprite)
      this.particles.push({ sprite, until: 0, duration: 0.36, rise: 0.4, size: 0.28 })
    }

    const resize = () => {
      const width = Math.max(1, host.clientWidth)
      const height = Math.max(1, host.clientHeight)
      this.renderer.setSize(width, height, false)
      this.sizeChanged = true
      this.camera.aspect = this.handCamera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.handCamera.updateProjectionMatrix()
    }
    this.observer = new ResizeObserver(resize)
    this.observer.observe(host)
    resize()
  }

  get softwareRendering() { return this.software }

  setQuality(fps: number) {
    if (fps < 26) this.missedFrames += 1
    else this.missedFrames = 0
    if (this.missedFrames < (this.software ? 4 : 2)) return
    if (!this.lightweight && this.lastScale <= 0.76) this.changeShading(true)
    const minScale = this.software ? Math.min(0.48, 500 / Math.max(1, this.canvas.clientWidth)) : this.lightweight ? 0.48 : 0.68
    this.setScale(Math.max(minScale, this.lastScale * 0.81))
  }

  private setScale(scale: number) {
    if (Math.abs(scale - this.lastScale) < 0.04) return
    this.lastScale = scale
    this.renderer.setPixelRatio(scale)
    this.sizeChanged = true
  }

  private meshMaterials(root: THREE.Object3D, light: boolean) {
    root.traverse(node => {
      if (!(node instanceof THREE.Mesh)) return
      const material = node.material
      if (light && material instanceof THREE.MeshStandardMaterial) {
        let fast = this.lightMaterials.get(material)
        if (!fast) {
          fast = new THREE.MeshLambertMaterial({
            color: material.color, map: material.map, emissive: material.emissive,
            emissiveIntensity: material.emissiveIntensity, fog: material.fog, side: material.side,
            transparent: material.transparent, opacity: material.opacity, depthWrite: material.depthWrite,
          })
          this.lightMaterials.set(material, fast)
          this.standardMaterials.set(fast, material)
        }
        node.material = fast
      } else if (!light && material instanceof THREE.MeshLambertMaterial) {
        node.material = this.standardMaterials.get(material) ?? material
      }
    })
  }

  private changeShading(enable: boolean) {
    if (this.lightweight === enable) return
    this.lightweight = enable
    this.renderer.shadowMap.enabled = !enable
    this.renderer.shadowMap.needsUpdate = !enable
    for (const object of this.scene.children) {
      if (object instanceof THREE.PointLight) object.visible = !enable
    }
    if (enable && !this.groundShadow) {
      this.groundShadow = shadeGround()
      this.scene.add(this.groundShadow)
    }
    if (this.groundShadow) this.groundShadow.visible = enable
    this.batches.toggle(enable)
    for (const actor of this.agents) this.meshMaterials(actor.root, enable)
    this.meshMaterials(this.bomb.model, enable)
    this.meshMaterials(this.hands, enable)
  }

  resetEffects() {
    for (const tracer of this.tracers) tracer.until = 0
    for (const particle of this.particles) particle.until = 0
    this.explosion.until = 0
    this.lastView = this.lastRound = -1
  }

  private figureAgents(match: Match) {
    const focus = match.view
    for (const actor of match.actors) {
      const model = this.agents[actor.id]
      model.root.visible = actor.id !== focus.id || !actor.alive
      model.root.position.set(actor.position.x, actor.position.y, actor.position.z)
      model.root.rotation.y = actor.yaw
      const shadow = this.shadows[actor.id]
      shadow.visible = model.root.visible
      shadow.position.set(actor.position.x, groundY(actor.position.x, actor.position.z) + 0.022, actor.position.z)
      shadow.rotation.y = actor.yaw
      const weapon = currentAmmo(actor).id
      if (model.weapon !== weapon) {
        armSoldier(model, weapon)
        if (this.lightweight) this.meshMaterials(model.gun, true)
      }
      poseSoldier(model, match.time, actor.speed, actor.pitch + actor.recoil, actor.id, actor.alive ? -1 : match.time - actor.deathAt)
    }

    const bomb = match.bomb
    this.bomb.model.visible = bomb.state === 'planted' || bomb.state === 'dropped'
    if (bomb.state === 'planted' || bomb.state === 'dropped') {
      this.bomb.model.position.set(bomb.position.x, groundY(bomb.position.x, bomb.position.z), bomb.position.z)
      const blink = bomb.state === 'planted'
        ? 0.42 + Math.pow(Math.sin(match.time * (match.clock < 8 ? 13 : 5.2)), 8) * 3.8 : 0.26
      this.bomb.indicator.emissiveIntensity = blink
      const lightIndicator = this.lightMaterials.get(this.bomb.indicator)
      if (lightIndicator) lightIndicator.emissiveIntensity = blink
    }
  }

  private viewHands(match: Match) {
    const view = match.view
    const ammo = currentAmmo(view)
    const placing = match.interaction?.actor === view.id && match.interaction.kind === 'plant'
    const selected = placing ? 'c4' : ammo.id
    if (this.renderModel?.weapon !== selected || this.renderModel.team !== view.team) {
      this.firstPerson.clear()
      this.renderModel = { weapon: selected, team: view.team }
      const key = view.team + selected
      if (!this.rigs.has(key)) this.rigs.set(key, viewRig(selected, view.team))
      this.firstPerson.add(this.rigs.get(key)!, this.flash)
      this.meshMaterials(this.firstPerson, this.lightweight)
    }

    const phase = match.time * (view.speed > 3 ? 12 : 8)
    const move = clamp(view.speed / 5, 0, 1)
    const reload = view.reloadEnd ? clamp((match.time - view.reloadStart) / (view.reloadEnd - view.reloadStart), 0, 1) : 0
    const dip = Math.sin(reload * Math.PI)
    const raise = clamp((view.equipUntil - match.time) / 0.28, 0, 1)
    const shot = Math.max(0, match.time - view.lastShot)
    const kick = shot < 0.18 ? Math.exp(-shot * 28) : 0
    const knife = ammo.id === 'knife' && !placing
    const pistol = view.slot === 'secondary' && !placing
    this.firstPerson.visible = view.alive && !view.scoped
    this.firstPerson.position.set(
      (placing ? 0.16 : pistol ? 0.21 : 0.265) + Math.cos(phase) * 0.011 * move,
      (placing ? -0.365 : -0.247) + Math.sin(phase) * 0.015 * move - dip * 0.23 - raise * 0.19,
      (pistol ? -0.61 : -0.56) + kick * (knife ? -0.16 : 0.12) + dip * 0.04,
    )
    this.firstPerson.rotation.set(
      -0.035 + kick * (knife ? -0.48 : 0.11) - dip * 0.45 - raise * 0.32,
      (pistol ? 0.13 : 0.14) + view.sway + (knife ? kick * 0.58 : 0),
      -0.08 + Math.cos(phase * 0.5) * 0.015 * move + dip * 0.5,
    )
    this.flash.visible = selected !== 'knife' && selected !== 'c4' && shot < 0.055
    this.flash.position.set(0, 0.049, MUZZLES[ammo.id])
    this.flash.rotation.z = shot * 31
  }

  private effects(time: number, dt: number) {
    for (const tracer of this.tracers) {
      tracer.line.visible = tracer.until > time
      tracer.line.material.opacity = clamp((tracer.until - time) * 9, 0, 0.7)
    }
    for (const particle of this.particles) {
      const remains = (particle.until - time) / particle.duration
      const sprite = particle.sprite
      sprite.visible = remains > 0
      if (!sprite.visible) continue
      sprite.position.y += particle.rise * dt
      sprite.material.opacity = clamp(remains * 0.68, 0, 1)
      sprite.scale.setScalar(particle.size * (1.6 - clamp(remains, 0, 1) * 0.64))
    }
  }

  private puff(x: number, y: number, z: number, time: number, size: number, lifetime: number, rise: number, color: string) {
    const particle = this.particles[this.particleIndex++ % this.particles.length]
    particle.sprite.position.set(x, y, z)
    particle.sprite.material.color.set(color)
    particle.size = size
    particle.duration = lifetime
    particle.until = time + lifetime
    particle.rise = rise
  }

  notify(event: MatchEvent, time: number) {
    if (event.type === 'shot' && event.weapon !== 'knife') {
      const tracer = this.tracers[this.tracerIndex++ % this.tracers.length]
      const { start, end } = event
      const attribute = tracer.line.geometry.getAttribute('position')
      const length = Math.hypot(end.x - start.x, end.y - start.y, end.z - start.z)
      const t = Math.min(0.72 / Math.max(length, 0.02), 1)
      attribute.setXYZ(0, start.x + (end.x - start.x) * t, start.y - 0.11 + (end.y - start.y) * t, start.z + (end.z - start.z) * t)
      attribute.setXYZ(1, end.x, end.y, end.z)
      attribute.needsUpdate = true
      tracer.until = time + 0.077
      if (event.impact) {
        this.puff(end.x, end.y, end.z, time, event.hit ? 0.2 : 0.37, 0.30, 0.37, event.hit ? '#ca7757' : '#e2c8a0')
      }
    }
    if (event.type === 'explosion') {
      const { x, y, z } = event.position
      this.explosion = { x, z, until: time + 0.85 }
      for (let i = 0; i < 29; i++) {
        const angle = i * 2.39996
        const radius = Math.sqrt(i) * 0.53
        this.puff(x + Math.cos(angle) * radius, y + 0.35 + (i % 6) * 0.31, z + Math.sin(angle) * radius,
          time, 1.45 + (i % 5) * 0.65, 0.57 + (i % 4) * 0.40, 0.56 + (i % 3) * 0.94, i < 13 ? '#ffae56' : '#8c7353')
      }
    }
  }

  private drawPending() {
    if (!this.gpuFrame) return false
    const gl = this.gl
    if (gl.clientWaitSync(this.gpuFrame, 0, 0) === gl.TIMEOUT_EXPIRED) return true
    gl.deleteSync(this.gpuFrame)
    this.gpuFrame = null
    return false
  }

  frame(mode: SceneMode, match: Match | null, time: number, dt: number) {
    const menu = mode === 'menu' || !match
    const switched = mode !== this.lastMode
    const reset = switched || this.lastRound !== (match?.round ?? -1)
    if (mode !== 'playing' && !reset && !this.sizeChanged) return false
    if (this.drawPending()) return false
    this.sizeChanged = false
    this.staged.root.visible = menu
    if (switched && (menu || this.lastMode === 'menu')) {
      this.missedFrames = 0
      this.changeShading(!menu && this.software)
      const softwareScale = Math.min(0.61, 620 / Math.max(1, this.canvas.clientWidth))
      this.setScale(menu || !this.software ? this.preferredScale : softwareScale)
      this.renderer.shadowMap.needsUpdate = !this.lightweight
    }
    if (menu || !match) {
      for (const actor of this.agents) actor.root.visible = false
      for (const shadow of this.shadows) shadow.visible = false
      this.bomb.model.visible = false
      this.camera.position.set(35.95, 2.74, 14.46)
      this.camera.lookAt(37.38, 3.72, -6.5)
      if (this.camera.fov !== 62) {
        this.camera.fov = 62
        this.camera.updateProjectionMatrix()
      }
      poseSoldier(this.staged, time, 0, Math.sin(time * 0.68) * 0.025 - 0.06, 0, -1)
      this.effects(Infinity, 0)
    } else {
      const view = match.view
      this.figureAgents(match)
      this.viewHands(match)
      this.effects(match.time, mode === 'paused' ? 0 : dt)

      const live = view.alive
      const bob = live ? Math.sin(match.time * (view.speed > 3 ? 13 : 8)) * Math.min(0.026, view.speed * 0.006) : 0
      const y = live ? EYE_HEIGHT + bob : 0.35
      this.ghost.set(view.position.x, view.position.y + y, view.position.z)
      if (reset || this.lastView !== view.id) {
        this.camera.position.copy(this.ghost)
        this.lastView = view.id
      } else {
        this.camera.position.lerp(this.ghost, 1 - Math.exp(-dt * 29))
      }
      const remaining = Math.max(0, this.explosion.until - match.time)
      const shake = remaining * clamp(1 - distance2(view.position, this.explosion) / 36, 0, 1) * 0.062
      this.camera.rotation.set(clamp(view.pitch + (live ? view.recoil : 0.09) + Math.sin(match.time * 79) * shake, -1.54, 1.54),
        view.yaw + view.sway + Math.cos(match.time * 53) * shake, 0, 'YXZ')
      const targetFov = view.scoped && live ? 24 : 68
      const wanted = reset ? targetFov : THREE.MathUtils.lerp(this.camera.fov, targetFov, 1 - Math.exp(-dt * 27))
      if (Math.abs(wanted - this.camera.fov) > 0.025) {
        this.camera.fov = wanted
        this.camera.updateProjectionMatrix()
      }
    }

    this.lastMode = mode
    this.lastRound = match?.round ?? -1
    if (this.renderer.shadowMap.needsUpdate && !menu) {
      for (const actor of this.agents) actor.root.traverse(node => { node.castShadow = false })
    }
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
    if (!menu && this.firstPerson.visible) {
      this.renderer.clearDepth()
      this.renderer.render(this.hands, this.handCamera)
    }
    if (this.software) {
      const gl = this.gl
      this.gpuFrame = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)
      gl.flush()
    }
    return true
  }

  dispose() {
    this.observer.disconnect()
    if (this.gpuFrame) this.gl.deleteSync(this.gpuFrame)
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    const textures = new Set<THREE.Texture>()
    for (const root of [this.scene, this.hands, ...this.rigs.values()]) {
      root.traverse(node => {
        if (node instanceof THREE.Mesh || node instanceof THREE.Line) geometries.add(node.geometry)
        if (node instanceof THREE.Mesh || node instanceof THREE.Line || node instanceof THREE.Sprite) {
          const nodeMaterials: THREE.Material[] = Array.isArray(node.material) ? node.material : [node.material]
          for (const material of nodeMaterials) {
            materials.add(material)
            if ('map' in material && material.map instanceof THREE.Texture) textures.add(material.map)
          }
        }
      })
    }
    geometries.forEach(geometry => geometry.dispose())
    this.lightMaterials.forEach((fast, standard) => {
      materials.add(fast)
      materials.add(standard)
    })
    materials.forEach(material => material.dispose())
    textures.forEach(texture => texture.dispose())
    this.sunlight.shadow.dispose()
    this.renderer.dispose()
    this.canvas.remove()
  }
}

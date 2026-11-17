import * as T from 'three'
import { buildWorld } from './world'
import { characterModel, weaponModel, heldModel, bombModel } from './models'
import { Match } from './match'
import { Synth } from './audio'
import { panelTexture, modelReflections, V } from './geometry'
import { ground, visible } from './map'
import { WEAPONS } from './weapons'
import type { Options, Snapshot, WeaponId } from './types'

interface Callbacks {
  status: (s: Snapshot) => void
  board: (down: boolean) => void
  guide: () => void
}
export class Arena {
  readonly match: Match
  readonly synth = new Synth()
  private renderer: T.WebGLRenderer
  private scene = new T.Scene()
  private handsScene = new T.Scene()
  private camera = new T.PerspectiveCamera(58, 1, 0.075, 247)
  private handCamera = new T.PerspectiveCamera(55, 1, 0.035, 5)
  private held = new Map<WeaponId, T.Group>()
  private hand: T.Group | null = null
  private handId: WeaponId | null = null
  private bodies: {
    root: T.Group
    left: T.Object3D
    right: T.Object3D
    weapon: T.Group | null
    id: WeaponId | null
    label: HTMLDivElement
    visible: boolean
    shadow: T.Mesh
    pack: T.Group
  }[] = []
  private device: T.Group
  private traces: { mesh: T.Line; time: number }[] = []
  private muzzle: T.Sprite
  private flashMat: T.SpriteMaterial
  private kick = 0
  private flashLeft = 0
  private swayX = 0
  private swayY = 0
  private frameId = 0
  private now = 0
  private last = 0
  private accumulator = 0
  private uiTime = 0
  private tagTime = 0
  private observer: ResizeObserver
  private env: T.CubeTexture
  private signal = new AbortController()
  private dirty = true
  private averageFrame = 0.016
  private scaledAt = 0
  private hadLock = false
  private disposed = false
  private lockRequest = 0
  panelOpen = false
  constructor(
    private host: HTMLElement,
    private labels: HTMLElement,
    opts: Partial<Options>,
    private cb: Callbacks
  ) {
    this.match = new Match(opts)
    this.renderer = new T.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    this.renderer.outputColorSpace = T.SRGBColorSpace
    this.renderer.toneMapping = T.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.02
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = T.PCFSoftShadowMap
    this.renderer.shadowMap.autoUpdate = false
    this.renderer.shadowMap.needsUpdate = true
    this.renderer.autoClear = false
    this.renderer.domElement.setAttribute('aria-label', 'Dust II 三维第一人称战场')
    this.host.appendChild(this.renderer.domElement)
    this.scene.background = new T.Color('#c7c9b9')
    const hemi = new T.HemisphereLight('#fff2db', '#9b8066', 1.5)
    this.scene.add(hemi)
    const sun = new T.DirectionalLight('#fff1d5', 2.62)
    sun.position.set(-34, 52, 32)
    sun.target.position.set(0, 0, 0)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    Object.assign(sun.shadow.camera, {
      left: -63,
      right: 63,
      top: 63,
      bottom: -63,
      near: 1,
      far: 170,
    })
    sun.shadow.bias = -0.00016
    sun.shadow.normalBias = 0.023
    sun.shadow.radius = 2
    this.scene.add(sun, sun.target)
    this.handsScene.add(new T.HemisphereLight('#fff1dc', '#ad8d67', 1.36))
    const key = new T.DirectionalLight('#fff0cd', 2.35)
    key.position.set(-2, 4, -2)
    this.handsScene.add(key)
    const rim = new T.DirectionalLight('#cce3ed', 1.1)
    rim.position.set(3, 1, 1)
    this.handsScene.add(rim)
    const faces = Array.from({ length: 6 }, (_, i) => {
      const face = document.createElement('canvas')
      face.width = face.height = 32
      const c = face.getContext('2d')!
      const grad = c.createLinearGradient(0, 0, 0, 32)
      grad.addColorStop(0, i === 3 ? '#706856' : '#c1d4d8')
      grad.addColorStop(0.48, i === 2 ? '#e3ece7' : '#e1d8c0')
      grad.addColorStop(1, i === 2 ? '#bed6da' : '#806f59')
      c.fillStyle = grad
      c.fillRect(0, 0, 32, 32)
      if (i === 0 || i === 4) {
        c.fillStyle = '#fff3d4'
        c.fillRect(7, 4, 19, 4)
      }
      return face
    })
    this.env = new T.CubeTexture(faces)
    this.env.colorSpace = T.SRGBColorSpace
    this.env.needsUpdate = true
    modelReflections(this.env)
    buildWorld(this.scene)
    const contactMap = panelTexture(64, 64, (c) => {
      const g = c.createRadialGradient(32, 32, 2, 32, 32, 32)
      g.addColorStop(0, 'rgba(37,34,26,.65)')
      g.addColorStop(0.4, 'rgba(48,43,29,.37)')
      g.addColorStop(1, 'rgba(45,39,27,0)')
      c.fillStyle = g
      c.fillRect(0, 0, 64, 64)
    })
    const contactMaterial = new T.MeshBasicMaterial({
      map: contactMap,
      transparent: true,
      depthWrite: false,
    })
    for (const a of this.match.actors) {
      const root = characterModel(a.team)
      root.traverse((o) => {
        o.castShadow = false
      })
      this.scene.add(root)
      const label = document.createElement('div')
      label.className = 'world-name ' + (a.team === 'T' ? 't' : 'ct')
      const arrow = document.createElement('i'),
        name = document.createElement('span')
      name.textContent = a.name
      label.append(arrow, name)
      const shadow = new T.Mesh(new T.PlaneGeometry(1.0, 1.24), contactMaterial)
      shadow.rotation.x = -Math.PI / 2
      this.scene.add(shadow)
      const pack = bombModel()
      pack.scale.setScalar(0.83)
      pack.rotation.x = -1.38
      pack.position.set(0, 1.23, 0.184)
      root.add(pack)
      pack.traverse((o) => {
        o.castShadow = false
      })
      this.labels.appendChild(label)
      this.bodies.push({
        root,
        left: root.getObjectByName('leftLeg')!,
        right: root.getObjectByName('rightLeg')!,
        weapon: null,
        id: null,
        label,
        visible: false,
        shadow,
        pack,
      })
    }
    this.device = bombModel()
    this.scene.add(this.device)
    const muzzleMap = panelTexture(96, 96, (c) => {
      const grad = c.createRadialGradient(48, 48, 1, 48, 48, 46)
      grad.addColorStop(0, 'rgba(255,255,242,1)')
      grad.addColorStop(0.15, 'rgba(255,223,134,1)')
      grad.addColorStop(0.43, 'rgba(255,144,43,.85)')
      grad.addColorStop(1, 'rgba(253,97,11,0)')
      c.fillStyle = grad
      c.beginPath()
      for (let j = 0; j < 18; j++) {
        const a = (j / 18) * 2 * Math.PI,
          r = j % 2 ? 16 : 45
        c.lineTo(48 + r * Math.cos(a), 48 + r * Math.sin(a))
      }
      c.closePath()
      c.fill()
    })
    this.flashMat = new T.SpriteMaterial({
      map: muzzleMap,
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      color: 0xffffff,
    })
    this.muzzle = new T.Sprite(this.flashMat)
    this.muzzle.visible = false
    for (let i = 0; i < 22; i++) {
      const geo = new T.BufferGeometry().setFromPoints([V(0, 0, 0), V(0, 0, 0)])
      const line = new T.Line(
        geo,
        new T.LineBasicMaterial({
          color: '#ffe1a1',
          transparent: true,
          opacity: 0.75,
          depthWrite: false,
        })
      )
      line.frustumCulled = false
      line.visible = false
      this.scene.add(line)
      this.traces.push({ mesh: line, time: 0 })
    }
    this.match.sound = (id, pos) => {
      const a = this.match.view,
        dist = pos ? Math.hypot(pos.x - a.x, pos.z - a.z) : 0
      const pan = pos
        ? (Math.cos(a.yaw) * (pos.x - a.x) - Math.sin(a.yaw) * (pos.z - a.z)) / Math.max(4, dist)
        : 0
      this.synth.play(id, 1 / (1 + dist * 0.095), pan * 0.76)
    }
    this.match.shot = (from, to, id, weapon) => {
      const current = id === this.match.viewId
      if (current) {
        this.kick = 1
        this.flashLeft = weapon === 'knife' ? 0 : 0.065
        this.flashMat.rotation = Math.random() * 6.28
      }
      const trace = this.traces.find((t) => t.time <= 0)
      if (!trace || weapon === 'knife') return
      const a = this.match.actors[id],
        buff = trace.mesh.geometry.attributes.position
      const start = current
        ? V(0.19, -0.16, -0.85).applyQuaternion(this.camera.quaternion).add(this.camera.position)
        : V(from.x - 0.47 * Math.sin(a.yaw), from.y - 0.23, from.z - 0.47 * Math.cos(a.yaw))
      buff.setXYZ(0, start.x, start.y, start.z)
      buff.setXYZ(1, to.x, to.y, to.z)
      buff.needsUpdate = true
      trace.time = 0.049
      trace.mesh.visible = true
    }
    this.match.changed = () => {
      this.dirty = true
      this.tagTime = 0
      this.emit()
    }
    this.observer = new ResizeObserver(() => this.resize())
    this.observer.observe(host)
    this.resize()
    this.bindInput()
    this.synth.level(this.match.options.volume, this.match.options.muted)
    this.emit()
    this.frameId = requestAnimationFrame(this.frame)
  }
  private emit() {
    if (this.disposed) return
    if (this.match.phase === 'matchEnd' && document.pointerLockElement === this.renderer.domElement)
      document.exitPointerLock()
    this.cb.status(this.match.snapshot())
  }
  configure(opts: Partial<Options>) {
    this.match.configure(opts)
    this.synth.level(this.match.options.volume, this.match.options.muted)
  }
  start() {
    if (this.panelOpen) return
    this.synth.unlock()
    if (this.match.phase === 'matchEnd') this.match.lobby()
    this.match.start()
    this.requestLock()
  }
  private requestLock() {
    const canvas = this.renderer.domElement
    if (document.pointerLockElement === canvas || matchMedia('(pointer: coarse)').matches) return
    try {
      const request = canvas.requestPointerLock?.()
      if (request && typeof request.catch === 'function')
        request.catch(() => {
          this.match.clickFallback = true
          this.emit()
        })
      window.clearTimeout(this.lockRequest)
      this.lockRequest = window.setTimeout(() => {
        if (!document.pointerLockElement && this.match.phase === 'live') {
          this.match.clickFallback = true
          this.emit()
        }
      }, 400)
    } catch {
      this.match.clickFallback = true
      this.emit()
    }
  }
  pause() {
    this.match.pause()
    if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock()
  }
  lobby() {
    this.match.lobby()
    if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock()
    this.emit()
  }
  private bindInput() {
    const { signal } = this.signal,
      canvas = this.renderer.domElement
    document.addEventListener(
      'pointerlockchange',
      () => {
        const locked = document.pointerLockElement === canvas
        if (this.hadLock && !locked) this.match.pause()
        if (locked) this.match.clickFallback = false
        this.hadLock = locked
        this.emit()
      },
      { signal }
    )
    document.addEventListener(
      'pointerlockerror',
      () => {
        this.match.clickFallback = true
        this.emit()
      },
      { signal }
    )
    window.addEventListener(
      'blur',
      () => {
        this.pause()
        this.cb.board(false)
      },
      { signal }
    )
    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) this.pause()
      },
      { signal }
    )
    document.addEventListener(
      'keydown',
      (e) => {
        if (
          this.panelOpen ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLSelectElement
        )
          return
        if (['Space', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code))
          e.preventDefault()
        if (e.code === 'Tab') {
          this.cb.board(true)
          return
        }
        if (e.repeat) return
        if (e.code === 'Escape') {
          this.pause()
          return
        }
        if (e.code === 'KeyH' || e.code === 'F1') {
          e.preventDefault()
          this.cb.guide()
          return
        }
        if (e.code === 'Enter' && ['ready', 'paused', 'matchEnd'].includes(this.match.phase)) {
          e.preventDefault()
          this.start()
          return
        }
        if (this.match.phase === 'ready' && ['Digit1', 'Digit2', 'Digit3'].includes(e.code))
          this.match.slot((Number(e.code.slice(-1)) - 1) as 0 | 1 | 2)
        this.match.key(e.code, true)
      },
      { signal }
    )
    document.addEventListener(
      'keyup',
      (e) => {
        this.match.key(e.code, false)
        if (e.code === 'Tab') this.cb.board(false)
      },
      { signal }
    )
    document.addEventListener(
      'mousemove',
      (e) => {
        if (this.panelOpen || this.match.phase !== 'live') return
        if (
          document.pointerLockElement === canvas ||
          (this.match.clickFallback && e.target === canvas)
        ) {
          this.match.look(e.movementX, e.movementY)
          this.swayX = T.MathUtils.clamp(this.swayX + e.movementX * 0.00018, -0.027, 0.027)
          this.swayY = T.MathUtils.clamp(this.swayY + e.movementY * 0.00013, -0.018, 0.018)
        }
      },
      { signal }
    )
    canvas.addEventListener(
      'mousedown',
      (e) => {
        if (this.panelOpen) return
        if (this.match.phase === 'ready' || this.match.phase === 'paused') {
          if (e.button === 0) this.start()
          return
        }
        if (this.match.phase !== 'live') return
        if (e.button === 0) {
          this.match.tapped = true
          this.match.trigger = true
        }
        if (e.button === 2) this.match.scope()
      },
      { signal }
    )
    document.addEventListener(
      'mouseup',
      (e) => {
        if (e.button === 0) this.match.trigger = false
      },
      { signal }
    )
    canvas.addEventListener('contextmenu', (e) => e.preventDefault(), { signal })
    canvas.addEventListener(
      'wheel',
      (e) => {
        if (this.match.phase !== 'live') return
        e.preventDefault()
        let slot = (this.match.view.slot + (e.deltaY > 0 ? 1 : 2)) % 3
        if (!this.match.view.inventory[slot]) slot = (slot + (e.deltaY > 0 ? 1 : 2)) % 3
        this.match.slot(slot as 0 | 1 | 2)
      },
      { passive: false, signal }
    )
    let touch: { id: number; x: number; y: number } | null = null
    canvas.addEventListener(
      'touchstart',
      (e) => {
        if (this.match.phase === 'ready') {
          this.start()
          return
        }
        const t = e.changedTouches[0]
        touch = { id: t.identifier, x: t.clientX, y: t.clientY }
      },
      { passive: true, signal }
    )
    canvas.addEventListener(
      'touchmove',
      (e) => {
        if (!touch) return
        const t = Array.from(e.changedTouches).find((v) => v.identifier === touch!.id)
        if (t) {
          e.preventDefault()
          this.match.look((t.clientX - touch.x) * 2, (t.clientY - touch.y) * 2)
          touch.x = t.clientX
          touch.y = t.clientY
        }
      },
      { passive: false, signal }
    )
    canvas.addEventListener(
      'touchend',
      () => {
        touch = null
      },
      { signal }
    )
  }
  private resize() {
    const w = Math.max(this.host.clientWidth, 1),
      h = Math.max(this.host.clientHeight, 1)
    this.dirty = true
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.handCamera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.handCamera.updateProjectionMatrix()
  }
  private frame = (ts: number) => {
    if (this.disposed) return
    const dt = Math.min((ts - (this.last || ts)) / 1000, 0.24)
    this.last = ts
    if ((this.match.phase === 'ready' || this.match.phase === 'paused') && !this.dirty) {
      this.frameId = requestAnimationFrame(this.frame)
      return
    }
    this.dirty = false
    this.now += dt
    this.accumulator += dt
    if (this.match.phase === 'live') {
      this.averageFrame = this.averageFrame * 0.9 + dt * 0.1
      if (
        this.now - this.scaledAt > 2 &&
        this.averageFrame > 0.045 &&
        this.renderer.getPixelRatio() > 0.68
      ) {
        this.renderer.setPixelRatio(Math.max(0.68, this.renderer.getPixelRatio() * 0.83))
        this.scaledAt = this.now
      }
    }
    const m = this.match
    while (this.accumulator >= 1 / 60) {
      if (m.phase === 'live' && !m.spectating) {
        const lr = Number(m.keys.has('ArrowLeft')) - Number(m.keys.has('ArrowRight')),
          ud = Number(m.keys.has('ArrowUp')) - Number(m.keys.has('ArrowDown'))
        m.look(-lr * 10, -ud * 8)
      }
      m.tick(1 / 60)
      this.accumulator -= 1 / 60
    }
    const a = m.view,
      ready = m.phase === 'ready',
      stride = Math.sin(a.step * 3.9),
      bob = a.moving > 0.2 ? stride * 0.029 : 0
    const fov = m.scoped
      ? 20
      : T.MathUtils.clamp((2 * Math.atan(1.035 / this.camera.aspect) * 180) / Math.PI, 48, 77)
    if (Math.abs(this.camera.fov - fov) > 0.01) {
      this.camera.fov = fov
      this.camera.updateProjectionMatrix()
    }
    this.camera.position.set(a.x, a.y + 1.59 + Math.abs(bob) * 0.45, a.z)
    this.camera.rotation.order = 'YXZ'
    this.camera.rotation.set(a.pitch + a.recoil, a.yaw, 0)
    this.camera.updateMatrixWorld()
    const tags = this.tagTime <= 0
    if (tags) this.tagTime = 0.22
    else this.tagTime -= dt
    for (const bot of m.actors) {
      const body = this.bodies[bot.id]
      body.root.visible = bot.id !== m.viewId && bot.alive
      body.shadow.visible = body.root.visible
      body.shadow.position.set(bot.x, ground(bot.x, bot.z) + 0.025, bot.z)
      body.pack.visible = m.bomb.carrier === bot.id
      if (!body.root.visible) {
        body.label.style.display = 'none'
        continue
      }
      body.root.position.set(bot.x, bot.y, bot.z)
      body.root.rotation.y = bot.yaw
      const swing = bot.moving > 0.2 ? Math.sin(bot.step * 3.8) * 0.42 : 0
      body.left.rotation.x = swing
      body.right.rotation.x = -swing
      const weapon = bot.inventory[bot.slot]!.id
      if (body.id !== weapon) {
        if (body.weapon) body.root.remove(body.weapon)
        body.weapon = weaponModel(weapon)
        body.weapon.traverse((o) => {
          o.castShadow = false
        })
        body.weapon.position.set(0.061, 1.31, -0.286)
        body.weapon.scale.setScalar(0.87)
        body.root.add(body.weapon)
        body.id = weapon
      }
      if (tags)
        body.visible =
          bot.team === m.team &&
          distance2(a, bot) < 24 &&
          visible(this.camera.position, { x: bot.x, y: bot.y + 1.7, z: bot.z })
      const v = V(bot.x, bot.y + 2.01, bot.z).project(this.camera)
      if (body.visible && v.z > 0 && v.z < 1 && Math.abs(v.x) < 0.98 && Math.abs(v.y) < 0.95) {
        body.label.style.display = 'flex'
        body.label.style.left = (v.x * 0.5 + 0.5) * 100 + '%'
        body.label.style.top = (0.5 - v.y * 0.5) * 100 + '%'
      } else body.label.style.display = 'none'
    }
    this.device.visible = m.bomb.state === 'dropped' || m.bomb.state === 'planted'
    if (this.device.visible) this.device.position.set(m.bomb.x, m.bomb.y, m.bomb.z)
    const mag = a.inventory[a.slot]!,
      id = mag.id
    if (this.handId !== id) {
      if (this.hand) this.handsScene.remove(this.hand)
      this.hand = this.held.get(id) ?? heldModel(id)
      this.held.set(id, this.hand)
      this.handsScene.add(this.hand)
      this.handId = id
      this.hand.add(this.muzzle)
    }
    this.kick = Math.max(0, this.kick - dt * 8.9)
    this.flashLeft = Math.max(0, this.flashLeft - dt)
    this.swayX *= Math.exp(-dt * 8)
    this.swayY *= Math.exp(-dt * 8)
    const w = WEAPONS[id],
      reload = a.reloadLeft ? Math.sin(Math.PI * Math.max(0, 1 - a.reloadLeft / w.reload)) : 0
    const rifle = w.slot === 0,
      knife = id === 'knife',
      rest = ready ? Math.sin(this.now * 0.97) * 0.0018 : 0
    const hand = this.hand!,
      aspect = this.handCamera.aspect
    hand.position.set(
      aspect * (rifle ? 0.21 : 0.149) + 0.016 + this.swayX + (rifle ? 0 : -0.033),
      -(rifle ? 0.247 : 0.251) + rest + bob * 0.26 - reload * 0.17 + this.swayY,
      -(rifle ? 0.72 : 0.57) + this.kick * 0.07 + (rifle ? 0 : -0.04)
    )
    hand.rotation.set(
      0.061 + this.kick * (knife ? -0.55 : 0.072) - reload * 0.55,
      (rifle ? 0.35 : 0.218) + this.swayX * 0.8 + (knife ? 0.34 : 0),
      -0.055 - reload * 0.43 + (knife ? this.kick * 0.71 : 0),
      'YXZ'
    )
    const handScale = rifle ? 1.09 : 1.28
    hand.scale.setScalar(handScale)
    hand.visible = !m.scoped
    this.muzzle.position.set(
      0,
      id === 'glock' || id === 'usp' || id === 'deagle' ? 0.025 : 0.053,
      id === 'awp' ? -0.83 : rifle ? -0.7 : id === 'usp' ? -0.34 : -0.21
    )
    this.muzzle.scale.setScalar(id === 'awp' ? 0.33 : 0.185)
    this.muzzle.visible = this.flashLeft > 0
    for (const tr of this.traces) {
      if (tr.time > 0) {
        tr.time -= dt
        tr.mesh.visible = tr.time > 0
      }
    }
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
    this.renderer.clearDepth()
    this.renderer.render(this.handsScene, this.handCamera)
    this.uiTime += dt
    if (this.uiTime > 0.082) {
      this.uiTime = 0
      this.emit()
    }
    this.frameId = requestAnimationFrame(this.frame)
  }
  dispose() {
    this.disposed = true
    this.signal.abort()
    window.clearTimeout(this.lockRequest)
    cancelAnimationFrame(this.frameId)
    this.observer.disconnect()
    if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock()
    this.synth.dispose()
    this.labels.replaceChildren()
    const geos = new Set<T.BufferGeometry>(),
      mats = new Set<T.Material>(),
      textures = new Set<T.Texture>()
    for (const root of [this.scene, this.handsScene, ...this.held.values()])
      root.traverse((o) => {
        if (o instanceof T.Mesh || o instanceof T.Line || o instanceof T.Sprite) {
          if ('geometry' in o) geos.add(o.geometry as T.BufferGeometry)
          for (const m of Array.isArray(o.material) ? o.material : [o.material]) mats.add(m)
        }
      })
    for (const m of mats) {
      for (const v of Object.values(m)) if (v instanceof T.Texture) textures.add(v)
      m.dispose()
    }
    for (const t of textures) t.dispose()
    for (const g of geos) g.dispose()
    modelReflections(null)
    this.env.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
const distance2 = (a: { x: number; z: number }, b: { x: number; z: number }) =>
  Math.hypot(a.x - b.x, a.z - b.z)

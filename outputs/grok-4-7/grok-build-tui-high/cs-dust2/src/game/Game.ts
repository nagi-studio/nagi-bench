import * as THREE from 'three'
import { assignBrain, botPreferredSite, updateBot, visibleEnemyIds } from './ai'
import { type Actor, currentWeapon, weaponLabel } from './actor'
import { AudioEngine } from './audio'
import { createCharacter, poseCharacter, setCharacterGun } from './character'
import { buildDust2, inSite, layoutDoor, type MapData } from './mapData'
import { buildMapVisual, syncDoorMesh, type MapVisual } from './mapMesh'
import { buildNav, type NavNode } from './nav'
import { aimDir, angNorm, clamp, damp, facingYaw, forwardFromYaw, rightFromYaw } from './math'
import { HudBus, type HudSnap, type KillLine } from './snapshot'
import { ViewModel } from './viewmodel'
import {
  WEAPONS,
  ZONE_MULT,
  makeWeapon,
  refill,
  weaponRecoil,
  weaponSpread,
  type HitZone,
  type Slot,
  type TeamId,
  type WeaponDef,
  type WeaponInst,
} from './weapons'
import {
  RUN_SPEED,
  WALK_SPEED,
  CROUCH_SPEED,
  canStand,
  eyeHeight,
  makeBody,
  moveBody,
} from './world'

const CT_NAMES = ['Volt', 'Nyx', 'Brick', 'Halo', 'Saber']
const T_NAMES = ['Reaper', 'Jester', 'Toxic', 'Blitz', 'Cypher']
const WIN_SCORE = 8

interface Bomb {
  state: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded'
  x: number
  y: number
  z: number
  carrierId: string | null
  planterName: string
  planterId: string | null
  progress: number
  timer: number
  site: 'a' | 'b' | null
  beep: number
  ticks: number
}

interface Tracer {
  line: THREE.Line
  life: number
}
interface Hole {
  mesh: THREE.Mesh
  life: number
}

export class Game {
  private host: HTMLElement
  private bus: HudBus
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(74, 1, 0.08, 240)
  private clock = new THREE.Clock()
  private map: MapData
  private nav: NavNode[]
  private visual: MapVisual
  private view: ViewModel
  private audio = new AudioEngine()
  private actors: Actor[] = []
  private bomb: Bomb = {
    state: 'dropped',
    x: 0,
    y: 0,
    z: 0,
    carrierId: null,
    planterName: '',
    planterId: null,
    progress: 0,
    timer: 0,
    site: null,
    beep: 1,
    ticks: 0,
  }
  private bombMesh: THREE.Group
  private boom: THREE.Mesh
  private boomLight: THREE.PointLight
  private flash: THREE.PointLight
  private tracers: Tracer[] = []
  private holes: Hole[] = []
  private keys = new Set<string>()
  private edges = new Set<string>()
  private mouseX = 0
  private mouseY = 0
  private mouse0 = false
  private mouse1 = false
  private wheel = 0
  private raf = 0
  private disposed = false
  private paused = false
  private hadLock = false
  private lockAt = 0
  private phase: HudSnap['phase'] = 'menu'
  private playerTeam: TeamId | null = null
  private humanId = ''
  private controlId = ''
  private spectateId = ''
  private round = 0
  private score = { ct: 0, t: 0 }
  private phaseTime = 0
  private roundTime = 80
  private banner = ''
  private sub = ''
  private lossStreak = { ct: 0, t: 0 }
  private survived = new Set<string>()
  private ended = false
  private fov = 74
  private wasScoped = false
  private scopeOn = false
  private hitMarker = 0
  private hitHs = false
  private damageFlash = 0
  private damageAngle = 0
  private kills: KillLine[] = []
  private spots = new Map<string, number>()
  private time = 0
  private bob = 0
  private onResize: () => void
  private onKeyDown: (e: KeyboardEvent) => void
  private onKeyUp: (e: KeyboardEvent) => void
  private onMouseDown: (e: MouseEvent) => void
  private onMouseUp: (e: MouseEvent) => void
  private onMouseMove: (e: MouseEvent) => void
  private onWheel: (e: WheelEvent) => void
  private onLock: () => void
  private onContext: (e: Event) => void
  private el: HTMLCanvasElement

  constructor(host: HTMLElement, bus: HudBus) {
    this.host = host
    this.bus = bus
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    this.renderer.setSize(host.clientWidth || window.innerWidth, host.clientHeight || window.innerHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.shadowMap.enabled = false
    this.el = this.renderer.domElement
    this.el.tabIndex = 0
    host.appendChild(this.el)

    this.scene.background = new THREE.Color(0x8ebbd4)
    this.scene.fog = new THREE.Fog(0xd5c4a4, 45, 120)
    this.scene.add(new THREE.AmbientLight(0xfff3e2, 0.72))
    this.scene.add(new THREE.HemisphereLight(0xd7ecff, 0xd2b48c, 0.55))
    const sun = new THREE.DirectionalLight(0xfff4dd, 0.95)
    sun.position.set(40, 70, 18)
    sun.castShadow = false
    this.scene.add(sun)
    this.scene.add(sun.target)
    sun.target.position.set(48, 0, 56)

    this.map = buildDust2()
    this.nav = buildNav(this.map.cells)
    this.visual = buildMapVisual(this.map)
    this.scene.add(this.visual.group)
    syncDoorMesh(this.visual.doorL, this.map.door.left)
    syncDoorMesh(this.visual.doorR, this.map.door.right)
    this.bus.bake = this.visual.minimap

    this.view = new ViewModel()
    this.camera.add(this.view.group)
    this.scene.add(this.camera)

    this.bombMesh = this.makeBombMesh()
    this.scene.add(this.bombMesh)
    this.boom = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xff7a2a, transparent: true, opacity: 0.85 }),
    )
    this.boom.visible = false
    this.scene.add(this.boom)
    this.boomLight = new THREE.PointLight(0xff6a22, 0, 28)
    this.scene.add(this.boomLight)
    this.flash = new THREE.PointLight(0xffe2b0, 0, 6)
    this.scene.add(this.flash)

    const holeMat = new THREE.MeshBasicMaterial({ color: 0x1a140e, side: THREE.DoubleSide })
    for (let i = 0; i < 24; i++) {
      const mesh = new THREE.Mesh(new THREE.CircleGeometry(0.06, 8), holeMat)
      mesh.visible = false
      this.scene.add(mesh)
      this.holes.push({ mesh, life: 0 })
    }
    for (let i = 0; i < 18; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffe7b0, transparent: true, opacity: 0.8 }))
      line.visible = false
      line.frustumCulled = false
      this.scene.add(line)
      this.tracers.push({ line, life: 0 })
    }

    this.onResize = () => {
      const w = this.host.clientWidth || window.innerWidth
      const h = this.host.clientHeight || window.innerHeight
      this.camera.aspect = w / Math.max(1, h)
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(w, h)
    }
    this.onKeyDown = (e) => {
      this.audio.ensure()
      if (e.code === 'Tab') e.preventDefault()
      if (e.code === 'Space') e.preventDefault()
      if (!this.keys.has(e.code)) this.edges.add(e.code)
      this.keys.add(e.code)
      if (e.code === 'KeyF') this.tryPossess()
      if (this.phase === 'buy') this.handleBuy(e.code)
    }
    this.onKeyUp = (e) => this.keys.delete(e.code)
    this.onMouseDown = (e) => {
      this.audio.ensure()
      if (e.button === 0) this.mouse0 = true
      if (e.button === 2) this.mouse1 = true
    }
    this.onMouseUp = (e) => {
      if (e.button === 0) this.mouse0 = false
      if (e.button === 2) this.mouse1 = false
    }
    this.onMouseMove = (e) => {
      if (document.pointerLockElement !== this.el) return
      if (performance.now() - this.lockAt < 180) return
      this.mouseX += clamp(e.movementX, -140, 140)
      this.mouseY += clamp(e.movementY, -140, 140)
    }
    this.onWheel = (e) => {
      this.wheel += Math.sign(e.deltaY)
    }
    this.onLock = () => {
      const locked = document.pointerLockElement === this.el
      if (locked) {
        this.hadLock = true
        this.lockAt = performance.now()
      }
      this.paused = this.hadLock && !locked && this.phase !== 'menu' && this.phase !== 'match'
    }
    this.onContext = (e) => e.preventDefault()
    window.addEventListener('resize', this.onResize)
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('wheel', this.onWheel, { passive: true })
    document.addEventListener('pointerlockchange', this.onLock)
    this.el.addEventListener('contextmenu', this.onContext)
    this.onResize()
    this.publish()
  }

  start(): void {
    this.clock.start()
    const loop = () => {
      if (this.disposed) return
      this.raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, this.clock.getDelta())
      this.update(dt)
    }
    this.raf = requestAnimationFrame(loop)
  }

  dispose(): void {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('wheel', this.onWheel)
    document.removeEventListener('pointerlockchange', this.onLock)
    this.el.removeEventListener('contextmenu', this.onContext)
    this.renderer.dispose()
    if (this.el.parentElement) this.el.parentElement.removeChild(this.el)
  }

  startMatch(team: TeamId): void {
    this.playerTeam = team
    this.score = { ct: 0, t: 0 }
    this.lossStreak = { ct: 0, t: 0 }
    this.round = 1
    this.kills = []
    this.clearActors()
    this.spawnRoster(team)
    this.survived = new Set(this.actors.map((a) => a.id))
    this.setupRound(true)
    this.el.requestPointerLock()
  }

  private clearActors(): void {
    for (const a of this.actors) this.scene.remove(a.visual.root)
    this.actors = []
  }

  private spawnRoster(team: TeamId): void {
    const make = (id: string, side: TeamId, human: boolean, name: string) => {
      const vis = createCharacter(side)
      this.scene.add(vis.root)
      const pistol = side === 't' ? 'glock' : 'usp'
      const actor: Actor = {
        id,
        name,
        team: side,
        human,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        yaw: 0,
        pitch: 0,
        hp: 100,
        armor: 0,
        helmet: false,
        alive: true,
        money: 150,
        onGround: true,
        crouch: false,
        primary: null,
        secondary: makeWeapon(pistol),
        melee: makeWeapon('knife'),
        slot: 'secondary',
        hasBomb: false,
        visual: vis,
        wantFire: false,
        wantReload: false,
        wantUse: false,
        fireLatch: false,
        brain: null,
        skill: 0.85 + Math.random() * 0.3,
        hurt: 0,
        wishX: 0,
        wishZ: 0,
        wishSpeed: 0,
        jump: false,
        scoped: false,
        lastAttacker: null,
      }
      setCharacterGun(vis, pistol)
      this.actors.push(actor)
      return actor
    }
    for (let i = 0; i < 5; i++) {
      const human = team === 'ct' && i === 0
      make(`ct${i}`, 'ct', human, human ? '你' : CT_NAMES[i])
    }
    for (let i = 0; i < 5; i++) {
      const human = team === 't' && i === 0
      make(`t${i}`, 't', human, human ? '你' : T_NAMES[i])
    }
    this.humanId = team === 'ct' ? 'ct0' : 't0'
    this.controlId = this.humanId
  }

  private setupRound(first: boolean): void {
    this.ended = false
    this.phase = first ? 'freeze' : 'buy'
    this.phaseTime = first ? 3.4 : 10
    this.roundTime = 80
    this.banner = first ? '手枪局' : `第 ${this.round} 回合 · 购买`
    this.sub = first ? '仅默认手枪与防弹衣，没有主武器' : '1 沙鹰  2 步枪  3 AWP  4 甲  5 头甲'
    const tSpawns = [...this.map.spawns.t]
    const ctSpawns = [...this.map.spawns.ct]
    shuffle(tSpawns)
    shuffle(ctSpawns)
    let ti = 0
    let ci = 0
    let botIndex = { ct: 0, t: 0 }
    for (const a of this.actors) {
      const sp = a.team === 't' ? tSpawns[ti++] : ctSpawns[ci++]
      a.pos.set(sp.x, 0, sp.z)
      a.vel.set(0, 0, 0)
      a.yaw = sp.yaw
      a.pitch = 0
      a.hp = 100
      a.alive = true
      a.onGround = true
      a.crouch = false
      a.hasBomb = false
      a.hurt = 0
      a.fireLatch = false
      a.scoped = false
      a.lastAttacker = null
      const keep = !first && this.survived.has(a.id)
      if (!keep) {
        a.primary = null
        a.secondary = makeWeapon(a.team === 't' ? 'glock' : 'usp')
        a.melee = makeWeapon('knife')
        a.slot = 'secondary'
        a.armor = first ? 100 : 0
        a.helmet = false
        if (first) a.money = 150
      } else {
        if (a.primary) refill(a.primary)
        refill(a.secondary)
        a.slot = a.primary ? 'primary' : 'secondary'
      }
      setCharacterGun(a.visual, currentWeapon(a).id)
      if (!a.human) {
        assignBrain(a, botIndex[a.team]++)
      } else a.brain = null
    }
    const terrorists = this.actors.filter((a) => a.team === 't')
    const carrier = terrorists[Math.floor(Math.random() * terrorists.length)]
    carrier.hasBomb = true
    this.bomb = {
      state: 'carried',
      x: carrier.pos.x,
      y: 0,
      z: carrier.pos.z,
      carrierId: carrier.id,
      planterName: '',
      planterId: null,
      progress: 0,
      timer: 0,
      site: null,
      beep: 1,
      ticks: 0,
    }
    if (!first) this.buyForBots()
    this.controlId = this.humanId
    this.spectateId = ''
  }

  private buyForBots(): void {
    const bots = this.actors.filter((a) => !a.human)
    const awpHolder = new Set<TeamId>()
    for (const a of bots) {
      if (a.armor < 100 && a.money >= 650) this.purchase(a, 'kevlar')
      if (!a.helmet && a.armor >= 100 && a.money >= 350) this.purchase(a, 'kit')
      if (a.primary) continue
      const wantsAwp = !awpHolder.has(a.team) && a.money >= 4750 && botPreferredSite(a) === 'a' && Math.random() < 0.4
      if (wantsAwp && this.purchase(a, 'awp')) awpHolder.add(a.team)
      else if (!this.purchase(a, 'rifle') && a.money >= 700) this.purchase(a, 'deagle')
    }
  }

  private purchase(a: Actor, item: 'deagle' | 'rifle' | 'awp' | 'kevlar' | 'kit'): boolean {
    const pay = (cost: number) => {
      if (a.money < cost) return false
      a.money -= cost
      return true
    }
    if (item === 'deagle') {
      if (!pay(700)) return false
      a.secondary = makeWeapon('deagle')
      if (a.slot === 'secondary') setCharacterGun(a.visual, 'deagle')
      return true
    }
    if (item === 'rifle') {
      const id = a.team === 't' ? 'ak' : 'm4'
      if (!pay(WEAPONS[id].price)) return false
      a.primary = makeWeapon(id)
      a.slot = 'primary'
      setCharacterGun(a.visual, id)
      return true
    }
    if (item === 'awp') {
      if (!pay(4750)) return false
      a.primary = makeWeapon('awp')
      a.slot = 'primary'
      setCharacterGun(a.visual, 'awp')
      return true
    }
    if (item === 'kevlar') {
      if (a.armor >= 100) return false
      if (!pay(650)) return false
      a.armor = 100
      return true
    }
    if (a.helmet && a.armor >= 100) return false
    const cost = a.armor >= 100 ? 350 : 1000
    if (!pay(cost)) return false
    a.armor = 100
    a.helmet = true
    return true
  }

  private handleBuy(code: string): void {
    const a = this.actors.find((x) => x.id === this.controlId && x.alive)
    if (!a) return
    const map: Record<string, 'deagle' | 'rifle' | 'awp' | 'kevlar' | 'kit'> = {
      Digit1: 'deagle',
      Digit2: 'rifle',
      Digit3: 'awp',
      Digit4: 'kevlar',
      Digit5: 'kit',
    }
    const item = map[code]
    if (!item) return
    const ok = this.purchase(a, item)
    this.audio.ui(ok)
  }

  private update(dt: number): void {
    this.time += dt
    if (this.phase === 'menu') {
      this.menuCamera()
      this.renderer.render(this.scene, this.camera)
      this.publish()
      this.clearPointers()
      return
    }
    if (this.paused) {
      this.scopeOn = false
      this.renderer.render(this.scene, this.camera)
      this.publish()
      this.clearPointers()
      return
    }

    if (this.phase === 'freeze' || this.phase === 'buy' || this.phase === 'end') {
      this.phaseTime -= dt
      if (this.phaseTime <= 0) {
        if (this.phase === 'end') {
          if (this.score.ct >= WIN_SCORE || this.score.t >= WIN_SCORE) this.phase = 'match'
          else {
            this.round += 1
            this.setupRound(false)
          }
        } else {
          this.phase = 'live'
          this.roundTime = 80
          this.banner = ''
          this.sub = ''
        }
      }
    } else if (this.phase === 'live' && this.bomb.state !== 'planted') {
      this.roundTime -= dt
      if (this.roundTime <= 0) this.endRound('ct', '时间耗尽')
    }

    const live = this.phase === 'live'
    for (const a of this.actors) {
      a.wantFire = false
      a.wantReload = false
      a.wantUse = false
      a.jump = false
      a.wishX = 0
      a.wishZ = 0
      a.wishSpeed = 0
      a.scoped = false
      a.hurt = Math.max(0, a.hurt - dt * 2)
    }

    this.readPlayer(dt, live)
    if (live || this.phase === 'buy') {
      const fetcher = this.pickFetcher()
      for (const a of this.actors) {
        if (!a.brain) continue
        updateBot(
          a,
          {
            actors: this.actors,
            world: this.map.world,
            nav: this.nav,
            bomb: {
              state: this.bomb.state,
              x: this.bomb.x,
              y: this.bomb.y,
              z: this.bomb.z,
              carrierId: this.bomb.carrierId,
            },
            sitesA: this.map.sites.a,
            sitesB: this.map.sites.b,
            now: this.time,
            controlId: this.controlId,
            fetcherId: fetcher,
            onSpot: (id) => {
              if (a.team === this.playerTeam) this.spots.set(id, this.time + 1.5)
            },
          },
          dt,
        )
        if (!live) {
          a.wantFire = false
          a.wantUse = false
          a.wishSpeed = 0
          a.jump = false
        }
      }
    }

    if (live) {
      for (const a of this.actors) {
        if (!a.alive) continue
        this.tickWeapon(a, dt)
      }
    }

    for (const a of this.actors) {
      if (!a.alive) continue
      if (!live) {
        a.wishSpeed = 0
        a.jump = false
      }
      this.integrate(a, dt)
    }
    this.separate()
    if (live) this.updateBomb(dt)
    this.updateDoor(dt)
    this.updateFx(dt)
    this.poseAll(dt)
    this.updateCamera(dt)
    if (live) this.checkWin()
    this.renderer.render(this.scene, this.camera)
    this.publish()
    this.clearPointers()
  }

  private clearPointers(): void {
    this.mouseX = 0
    this.mouseY = 0
    this.edges.clear()
    this.wheel = 0
  }

  private readPlayer(dt: number, live: boolean): void {
    const a = this.actors.find((x) => x.id === this.controlId)
    if (!a) return
    const sens = 0.00215
    if (a.alive) {
      const scopeScale = a.scoped ? 0.32 : 1
      a.yaw = angNorm(a.yaw + this.mouseX * sens * scopeScale)
      a.pitch = clamp(a.pitch - this.mouseY * sens * scopeScale, -1.4, 1.4)
      if (this.edges.has('Digit1')) this.switchSlot(a, 'primary')
      if (this.edges.has('Digit2')) this.switchSlot(a, 'secondary')
      if (this.edges.has('Digit3')) this.switchSlot(a, 'melee')
      if (this.edges.has('KeyQ')) {
        const order: Slot[] = a.primary ? ['primary', 'secondary', 'melee'] : ['secondary', 'melee']
        const i = order.indexOf(a.slot)
        this.switchSlot(a, order[(i + 1) % order.length])
      }
      if (this.wheel !== 0) {
        const order: Slot[] = a.primary ? ['primary', 'secondary', 'melee'] : ['secondary', 'melee']
        const i = order.indexOf(a.slot)
        const n = (i + (this.wheel > 0 ? 1 : order.length - 1)) % order.length
        this.switchSlot(a, order[n])
      }
      const weapon = currentWeapon(a)
      const def = WEAPONS[weapon.id]
      a.scoped = !!(def.scope && this.mouse1 && live)
      if (a.scoped !== this.wasScoped && a.scoped) this.audio.scope()
      this.wasScoped = a.scoped
      if (!live) return
      const f = forwardFromYaw(a.yaw)
      const r = rightFromYaw(a.yaw)
      let wx = 0
      let wz = 0
      if (this.keys.has('KeyW')) {
        wx += f.x
        wz += f.z
      }
      if (this.keys.has('KeyS')) {
        wx -= f.x
        wz -= f.z
      }
      if (this.keys.has('KeyD')) {
        wx += r.x
        wz += r.z
      }
      if (this.keys.has('KeyA')) {
        wx -= r.x
        wz -= r.z
      }
      const crouch = this.keys.has('ControlLeft') || this.keys.has('ControlRight') || this.keys.has('KeyC')
      if (crouch) a.crouch = true
      else if (canStand(this.map.world, bodyOf(a))) a.crouch = false
      a.wishX = wx
      a.wishZ = wz
      a.wishSpeed = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') ? WALK_SPEED : a.crouch ? CROUCH_SPEED : RUN_SPEED
      a.jump = this.edges.has('Space')
      a.wantFire = this.mouse0
      a.wantReload = this.edges.has('KeyR')
      a.wantUse = this.keys.has('KeyE')
      if (!def.auto) a.wantFire = this.mouse0
    } else {
      if (this.edges.has('ArrowLeft') || this.edges.has('Comma')) this.cycleSpec(-1)
      if (this.edges.has('ArrowRight') || this.edges.has('Period')) this.cycleSpec(1)
      void dt
    }
  }

  private autoswap(a: Actor): void {
    const empty = (w: WeaponInst | null) => !!w && !WEAPONS[w.id].melee && w.mag <= 0 && w.reserve <= 0 && !w.reloading
    if (a.slot === 'primary' && empty(a.primary)) this.switchSlot(a, 'secondary')
    const side = currentWeapon(a)
    if (a.slot === 'secondary' && empty(side)) this.switchSlot(a, 'melee')
  }

  private switchSlot(a: Actor, slot: Slot): void {
    if (slot === 'primary' && !a.primary) return
    if (a.slot === slot) return
    a.slot = slot
    const w = currentWeapon(a)
    w.reloading = false
    w.reloadLeft = 0
    a.scoped = false
    setCharacterGun(a.visual, w.id)
  }

  private tickWeapon(a: Actor, dt: number): void {
    if (a.id !== this.controlId) this.autoswap(a)
    const w = currentWeapon(a)
    const def = WEAPONS[w.id]
    w.sinceShot += dt
    w.cooldown = Math.max(0, w.cooldown - dt)
    if (w.sinceShot > 0.24) w.spray = Math.max(0, w.spray - dt * 9)
    if (w.reloading) {
      w.reloadLeft -= dt
      if (w.reloadLeft <= 0) {
        const need = def.mag - w.mag
        const take = Math.min(need, w.reserve)
        w.mag += take
        w.reserve -= take
        w.reloading = false
      }
      return
    }
    const trigger = a.wantFire
    if (!trigger) a.fireLatch = false
    if (a.wantReload && !def.melee && w.mag < def.mag && w.reserve > 0) {
      w.reloading = true
      w.reloadLeft = def.reload
      this.audio.reload(a.pos.x, a.pos.y + 1, a.pos.z)
      return
    }
    const pull = def.auto ? trigger : trigger && !a.fireLatch
    if (!pull || w.cooldown > 0) return
    if (!def.auto) a.fireLatch = true
    if (!def.melee && w.mag <= 0) {
      if (a.id === this.controlId) this.audio.dry()
      if (w.reserve > 0) {
        w.reloading = true
        w.reloadLeft = def.reload
        this.audio.reload(a.pos.x, a.pos.y + 1, a.pos.z)
      }
      return
    }
    this.discharge(a, w, def)
  }

  private discharge(a: Actor, w: WeaponInst, def: WeaponDef): void {
    if (!def.melee) w.mag -= 1
    w.cooldown = def.delay
    w.spray += 1
    w.sinceShot = 0
    const eyeY = a.pos.y + eyeHeight(bodyOf(a))
    const eye = new THREE.Vector3(a.pos.x, eyeY, a.pos.z)
    const look = aimDir(a.yaw, a.pitch)
    const dir = new THREE.Vector3(look.x, look.y, look.z)
    const speed = Math.hypot(a.vel.x, a.vel.z)
    let spread = weaponSpread(def, speed, RUN_SPEED, a.onGround, a.crouch, w.spray, a.scoped)
    if (a.id !== this.controlId) spread += (1.25 - a.skill) * 0.015
    if (a.id === this.controlId && !def.melee) {
      const kick = weaponRecoil(def, w.spray)
      a.pitch = clamp(a.pitch + kick.up, -1.4, 1.4)
      a.yaw = angNorm(a.yaw + kick.side)
      this.view.punch(0.45 + kick.up * 6)
    }
    this.audio.shoot(def.id, eye.x, eye.y, eye.z)
    const muzzle = this.muzzlePos(a, eye, dir)
    this.flash.position.copy(muzzle)
    this.flash.intensity = def.id === 'awp' ? 8 : 4

    const pellets = def.melee ? 5 : 1
    let connected = false
    let hs = false
    let end = eye.clone().addScaledVector(dir, Math.min(def.range, 40))
    for (let i = 0; i < pellets; i++) {
      const shot = dir.clone()
      this.perturb(shot, def.melee ? 0.32 : spread)
      const range = def.range
      const wall = this.map.world.raycast(eye.x, eye.y, eye.z, shot.x, shot.y, shot.z, range)
      const hit = this.rayActors(eye, shot, range, a.id)
      const wallT = wall ? wall.t : Infinity
      if (hit && hit.t <= wallT) {
        if (hit.actor.team !== a.team && !connected) {
          this.applyHit(a, hit.actor, def, hit.zone)
          connected = true
          hs = hit.zone === 'head'
        }
        end = eye.clone().addScaledVector(shot, hit.t)
        if (!def.melee) break
      } else if (wall) {
        this.spawnHole(wall.x, wall.y, wall.z, wall.nx, wall.ny, wall.nz)
        end = new THREE.Vector3(wall.x, wall.y, wall.z)
        if (!def.melee) break
      }
    }
    if (!def.melee) this.spawnTracer(muzzle, end)
    if (connected && a.id === this.controlId) {
      this.hitMarker = 1
      this.hitHs = hs
      this.audio.hit(hs)
    }
  }

  private perturb(dir: THREE.Vector3, spread: number): void {
    if (spread <= 0.00001) return
    const up = Math.abs(dir.y) > 0.95 ? _x : _y
    _right.crossVectors(dir, up).normalize()
    _up.crossVectors(_right, dir).normalize()
    const th = Math.random() * Math.PI * 2
    const rad = spread * Math.sqrt(Math.random())
    dir.addScaledVector(_right, Math.cos(th) * rad).addScaledVector(_up, Math.sin(th) * rad).normalize()
  }

  private rayActors(origin: THREE.Vector3, dir: THREE.Vector3, range: number, ignore: string): { actor: Actor; zone: HitZone; t: number } | null {
    let best: { actor: Actor; zone: HitZone; t: number } | null = null
    for (const a of this.actors) {
      if (!a.alive || a.id === ignore) continue
      a.visual.root.updateMatrixWorld(true)
      for (const obj of a.visual.hitMeshes) {
        const mesh = obj as THREE.Mesh
        const half = mesh.userData.half as THREE.Vector3 | undefined
        const zone = mesh.userData.zone as HitZone | undefined
        if (!half || !zone) continue
        _inv.copy(mesh.matrixWorld).invert()
        _o.copy(origin).applyMatrix4(_inv)
        _d.copy(dir).transformDirection(_inv)
        const t = rayCenteredBox(_o.x, _o.y, _o.z, _d.x, _d.y, _d.z, range, half.x, half.y, half.z)
        if (t !== null && t < range && (!best || t < best.t)) best = { actor: a, zone, t }
      }
    }
    return best
  }

  private applyHit(attacker: Actor, victim: Actor, def: WeaponDef, zone: HitZone): void {
    let dmg = def.damage * ZONE_MULT[zone]
    const armored = victim.armor > 0 && (zone === 'chest' || zone === 'stomach' || zone === 'arm' || (zone === 'head' && victim.helmet))
    if (armored) {
      const scaled = dmg * def.armorPen
      let armorLoss = (dmg - scaled) * 0.5
      if (armorLoss > victim.armor) {
        const extra = (armorLoss - victim.armor) * 2
        victim.armor = 0
        dmg = scaled + extra
      } else {
        victim.armor -= armorLoss
        dmg = scaled
      }
    }
    victim.hp -= dmg
    victim.hurt = 1
    const hs = zone === 'head'
    victim.lastAttacker = { id: attacker.id, name: attacker.name, team: attacker.team, weapon: def.name, hs }
    if (victim.id === this.controlId) {
      this.damageFlash = 1
      this.audio.hurt()
      const f = forwardFromYaw(victim.yaw)
      const r = rightFromYaw(victim.yaw)
      const dx = attacker.pos.x - victim.pos.x
      const dz = attacker.pos.z - victim.pos.z
      this.damageAngle = Math.atan2(dx * r.x + dz * r.z, dx * f.x + dz * f.z)
    }
    if (victim.hp <= 0) this.kill(victim, attacker, def.name, hs)
  }

  private kill(victim: Actor, attacker: Actor | null, weapon: string, hs: boolean): void {
    if (!victim.alive) return
    victim.alive = false
    victim.hp = 0
    victim.scoped = false
    if (victim.hasBomb) this.dropBomb(victim)
    if (attacker && attacker.alive && attacker !== victim && attacker.team !== victim.team) {
      attacker.money = Math.min(16000, attacker.money + 300)
      if (attacker.id === this.controlId) this.audio.kill()
    }
    this.kills.unshift({
      killer: attacker?.name ?? (this.bomb.planterName || 'C4'),
      kTeam: attacker?.team ?? 't',
      victim: victim.name,
      vTeam: victim.team,
      weapon,
      hs,
      at: performance.now(),
    })
    if (this.kills.length > 8) this.kills.pop()
    if (victim.id === this.controlId) {
      this.spectateId = this.teammate(1) ?? ''
    }
  }

  private dropBomb(a: Actor): void {
    a.hasBomb = false
    this.bomb.state = 'dropped'
    this.bomb.carrierId = null
    this.bomb.x = a.pos.x
    this.bomb.y = a.pos.y
    this.bomb.z = a.pos.z
    this.bomb.progress = 0
  }

  private integrate(a: Actor, dt: number): void {
    const body = bodyOf(a)
    moveBody(this.map.world, body, a.wishX, a.wishZ, a.wishSpeed, a.jump, dt)
    a.pos.set(body.x, body.y, body.z)
    a.vel.set(body.vx, body.vy, body.vz)
    a.onGround = body.onGround
    const sp = Math.hypot(a.vel.x, a.vel.z)
    if (a.onGround && sp > 1.3 && a.alive) this.audio.step(a.id, a.pos.x, a.pos.y, a.pos.z, sp < 3)
    if (a.pos.y < -4) {
      const spawns = a.team === 't' ? this.map.spawns.t : this.map.spawns.ct
      a.pos.set(spawns[0].x, 0.2, spawns[0].z)
      a.vel.set(0, 0, 0)
    }
  }

  private separate(): void {
    for (let i = 0; i < this.actors.length; i++) {
      const a = this.actors[i]
      if (!a.alive) continue
      for (let j = i + 1; j < this.actors.length; j++) {
        const b = this.actors[j]
        if (!b.alive) continue
        const dx = a.pos.x - b.pos.x
        const dz = a.pos.z - b.pos.z
        const d = Math.hypot(dx, dz)
        if (d > 0.001 && d < 0.62) {
          const push = (0.62 - d) * 0.35
          a.pos.x += (dx / d) * push
          a.pos.z += (dz / d) * push
          b.pos.x -= (dx / d) * push
          b.pos.z -= (dz / d) * push
        }
      }
    }
  }

  private pickFetcher(): string | null {
    if (this.bomb.state !== 'dropped') return null
    let best: Actor | null = null
    let bestD = Infinity
    for (const a of this.actors) {
      if (!a.alive || a.team !== 't' || a.id === this.controlId) continue
      const d = Math.hypot(a.pos.x - this.bomb.x, a.pos.z - this.bomb.z)
      if (d < bestD) {
        bestD = d
        best = a
      }
    }
    return best?.id ?? null
  }

  private updateBomb(dt: number): void {
    const bomb = this.bomb
    if (bomb.state === 'dropped') {
      for (const a of this.actors) {
        if (!a.alive || a.team !== 't') continue
        if (Math.hypot(a.pos.x - bomb.x, a.pos.z - bomb.z) < 1.3) {
          for (const o of this.actors) o.hasBomb = false
          a.hasBomb = true
          bomb.state = 'carried'
          bomb.carrierId = a.id
          bomb.progress = 0
          this.audio.ui(true)
          break
        }
      }
    }
    if (bomb.state === 'carried' && bomb.carrierId) {
      const c = this.actors.find((a) => a.id === bomb.carrierId)
      if (c && c.alive && c.hasBomb) {
        bomb.x = c.pos.x
        bomb.y = c.pos.y
        bomb.z = c.pos.z
        const onA = inSite(this.map.sites.a, c.pos.x, c.pos.z)
        const onB = inSite(this.map.sites.b, c.pos.x, c.pos.z)
        const slow = Math.hypot(c.vel.x, c.vel.z) < 1.7
        if (c.wantUse && (onA || onB) && slow && c.onGround) {
          const before = Math.floor(bomb.progress * 5)
          bomb.progress += dt / 3
          bomb.site = onA ? 'a' : 'b'
          if (Math.floor(bomb.progress * 5) !== before) this.audio.beep(660, c.pos.x, c.pos.y + 1, c.pos.z, 0.08)
          if (bomb.progress >= 1) {
            bomb.state = 'planted'
            bomb.timer = 40
            bomb.progress = 0
            bomb.planterName = c.name
            bomb.planterId = c.id
            c.hasBomb = false
            bomb.carrierId = null
            bomb.beep = 0.2
            this.audio.beep(880, bomb.x, bomb.y + 0.5, bomb.z, 0.16)
          }
        } else bomb.progress = 0
      }
    } else if (bomb.state === 'planted') {
      bomb.timer -= dt
      const interval = bomb.timer > 10 ? 1 : bomb.timer > 5 ? 0.45 : 0.22
      bomb.beep -= dt
      if (bomb.beep <= 0) {
        this.audio.beep(bomb.timer < 10 ? 1100 : 780, bomb.x, bomb.y + 0.4, bomb.z, bomb.timer < 10 ? 0.2 : 0.1)
        bomb.beep = interval
      }
      let defuser: Actor | null = null
      for (const a of this.actors) {
        if (!a.alive || a.team !== 'ct' || !a.wantUse) continue
        if (Math.hypot(a.pos.x - bomb.x, a.pos.z - bomb.z) < 1.65 && Math.hypot(a.vel.x, a.vel.z) < 1.7) {
          defuser = a
          break
        }
      }
      if (defuser) {
        bomb.progress += dt / 5
        if (Math.floor(this.time * 8) !== bomb.ticks) {
          bomb.ticks = Math.floor(this.time * 8)
          this.audio.beep(420, bomb.x, bomb.y + 0.3, bomb.z, 0.05)
        }
        if (bomb.progress >= 1) {
          bomb.state = 'defused'
          bomb.progress = 1
          this.audio.beep(990, bomb.x, bomb.y + 0.4, bomb.z, 0.2)
          this.endRound('ct', '拆除成功')
          return
        }
      } else bomb.progress = 0
      if (bomb.timer <= 0) this.explode()
    }

    const carried = bomb.state === 'carried'
    this.bombMesh.visible = bomb.state === 'carried' || bomb.state === 'dropped' || bomb.state === 'planted'
    if (this.bombMesh.visible) {
      const y = carried ? bomb.y + 1.05 : bomb.y + 0.16
      let x = bomb.x
      let z = bomb.z
      if (carried && bomb.carrierId) {
        const c = this.actors.find((a) => a.id === bomb.carrierId)
        if (c) {
          const f = forwardFromYaw(c.yaw)
          x = c.pos.x - f.x * 0.28
          z = c.pos.z - f.z * 0.28
        }
      }
      this.bombMesh.position.set(x, y, z)
      const blink = bomb.state === 'planted' ? (Math.sin(this.time * (bomb.timer < 10 ? 18 : 8)) > 0) : Math.sin(this.time * 4) > 0
      const led = this.bombMesh.getObjectByName('led') as THREE.Mesh | undefined
      if (led) (led.material as THREE.MeshStandardMaterial).emissive.set(blink ? 0xff2200 : 0x330000)
    }
  }

  private explode(): void {
    const bomb = this.bomb
    bomb.state = 'exploded'
    this.audio.explode(bomb.x, bomb.y, bomb.z)
    this.boom.visible = true
    this.boom.position.set(bomb.x, bomb.y + 1, bomb.z)
    this.boom.scale.setScalar(0.4)
    ;(this.boom.material as THREE.MeshBasicMaterial).opacity = 0.9
    this.boomLight.position.copy(this.boom.position)
    this.boomLight.intensity = 30
    const planter = this.actors.find((a) => a.id === bomb.planterId) ?? null
    for (const a of this.actors) {
      if (!a.alive) continue
      const dx = a.pos.x - bomb.x
      const dy = a.pos.y + 1 - bomb.y
      const dz = a.pos.z - bomb.z
      const dist = Math.hypot(dx, dy, dz)
      const dirx = dx / (dist || 1)
      const diry = dy / (dist || 1)
      const dirz = dz / (dist || 1)
      const wall = this.map.world.raycast(bomb.x, bomb.y + 0.4, bomb.z, dirx, diry, dirz, dist)
      const blocked = !!wall && wall.t < dist - 0.6
      const radius = blocked ? 4.2 : 17
      if (dist > radius) continue
      const dmg = 230 * (1 - dist / radius)
      a.hp -= dmg
      a.hurt = 1
      if (a.id === this.controlId) this.damageFlash = 1
      if (a.hp <= 0) this.kill(a, planter, 'C4', false)
    }
    this.endRound('t', '炸弹爆炸')
  }

  private updateDoor(dt: number): void {
    let near = false
    for (const a of this.actors) {
      if (!a.alive) continue
      const dx = a.pos.x - this.map.door.centerX
      const dz = a.pos.z - this.map.door.centerZ
      if (dx * dx + dz * dz < 42) {
        near = true
        break
      }
    }
    const target = near ? 1 : 0
    const step = dt / 0.36
    const next = clamp(this.map.door.open + clamp(target - this.map.door.open, -step, step), 0, 1)
    if (Math.abs(next - this.map.door.open) > 0.0001) {
      layoutDoor(this.map.door, next)
      this.map.world.rebuildIndex()
      syncDoorMesh(this.visual.doorL, this.map.door.left)
      syncDoorMesh(this.visual.doorR, this.map.door.right)
    }
  }

  private updateFx(dt: number): void {
    this.flash.intensity = Math.max(0, this.flash.intensity - dt * 40)
    this.hitMarker = Math.max(0, this.hitMarker - dt * 3.2)
    this.damageFlash = Math.max(0, this.damageFlash - dt * 1.6)
    if (this.boom.visible) {
      const s = this.boom.scale.x + dt * 26
      this.boom.scale.setScalar(s)
      const mat = this.boom.material as THREE.MeshBasicMaterial
      mat.opacity = Math.max(0, mat.opacity - dt * 1.4)
      this.boomLight.intensity = Math.max(0, this.boomLight.intensity - dt * 40)
      if (mat.opacity <= 0) this.boom.visible = false
    }
    for (const t of this.tracers) {
      if (t.life <= 0) continue
      t.life -= dt
      ;(t.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, t.life * 8)
      if (t.life <= 0) t.line.visible = false
    }
    for (const h of this.holes) {
      if (h.life <= 0) continue
      h.life -= dt
      if (h.life <= 0) h.mesh.visible = false
    }
  }

  private poseAll(dt: number): void {
    const view = this.viewActor()
    for (const a of this.actors) {
      const speed = a.alive ? Math.hypot(a.vel.x, a.vel.z) : 0
      poseCharacter(a.visual, a.pos.x, a.pos.y, a.pos.z, facingYaw(a.yaw), speed, a.crouch, a.alive, dt, a.hasBomb)
      const gunId = currentWeapon(a).id
      setCharacterGun(a.visual, gunId)
      a.visual.root.visible = !view || a.id !== view.id || !a.alive
      if (!a.alive) a.visual.root.visible = true
    }
  }

  private viewActor(): Actor | null {
    const controlled = this.actors.find((a) => a.id === this.controlId)
    if (controlled?.alive) return controlled
    const spec = this.actors.find((a) => a.id === this.spectateId && a.alive)
    if (spec) return spec
    return controlled ?? null
  }

  private updateCamera(dt: number): void {
    const a = this.viewActor()
    if (!a) return
    const eyeY = a.pos.y + (a.crouch ? 1.02 : 1.58)
    const speed = Math.hypot(a.vel.x, a.vel.z)
    if (a.alive && a.onGround) this.bob += dt * speed * 1.7
    const bobY = a.alive ? Math.sin(this.bob) * 0.035 * Math.min(1, speed / 4) : 0
    const r = rightFromYaw(a.yaw)
    const bobX = a.alive ? Math.cos(this.bob * 0.5) * 0.02 * Math.min(1, speed / 4) : 0
    this.camera.position.set(a.pos.x + r.x * bobX, eyeY + bobY, a.pos.z + r.z * bobX)
    const look = aimDir(a.yaw, a.pitch)
    this.camera.lookAt(this.camera.position.x + look.x, this.camera.position.y + look.y, this.camera.position.z + look.z)
    const def = WEAPONS[currentWeapon(a).id]
    const scoping = a.alive && a.scoped && def.scope
    this.scopeOn = scoping
    this.fov = damp(this.fov, scoping ? 16 : 74, 14, dt)
    if (Math.abs(this.camera.fov - this.fov) > 0.05) {
      this.camera.fov = this.fov
      this.camera.updateProjectionMatrix()
    }
    const wid = currentWeapon(a).id
    if (this.view.current() !== wid || this.view.currentTeam() !== a.team) this.view.rebuild(wid, a.team)
    this.view.update(dt, a.alive ? speed : 0, scoping)
    this.view.group.visible = a.alive && !scoping
    this.audio.setListener(this.camera.position.x, this.camera.position.y, this.camera.position.z)
    if (a.alive && a.team === this.playerTeam) {
      for (const id of visibleEnemyIds(a, this.actors, this.map.world)) this.spots.set(id, this.time + 1.5)
    }
  }

  private menuCamera(): void {
    const t = this.time
    this.camera.position.set(48 + Math.sin(t * 0.08) * 18, 32 + Math.sin(t * 0.05) * 4, 50 + Math.cos(t * 0.07) * 16)
    this.camera.lookAt(46, 2, 52)
    this.view.group.visible = false
  }

  private checkWin(): void {
    if (this.ended || this.phase !== 'live') return
    const t = this.actors.filter((a) => a.team === 't' && a.alive).length
    const ct = this.actors.filter((a) => a.team === 'ct' && a.alive).length
    if (ct === 0) this.endRound('t', '全歼对手')
    else if (t === 0 && this.bomb.state !== 'planted') this.endRound('ct', '全歼对手')
  }

  private endRound(winner: TeamId, reason: string): void {
    if (this.ended || this.phase !== 'live') return
    this.ended = true
    this.score[winner] += 1
    const loser: TeamId = winner === 'ct' ? 't' : 'ct'
    this.lossStreak[winner] = 0
    const bonus = Math.min(3400, 1400 + 500 * this.lossStreak[loser])
    this.lossStreak[loser] += 1
    for (const a of this.actors) a.money = Math.min(16000, a.money + (a.team === winner ? 3250 : bonus))
    this.survived = new Set(this.actors.filter((a) => a.alive).map((a) => a.id))
    this.banner = `${winner === 'ct' ? 'CT' : 'T'} 阵营胜利`
    this.sub = reason
    this.phase = 'end'
    this.phaseTime = 5
    this.audio.win()
    if (this.score.ct >= WIN_SCORE || this.score.t >= WIN_SCORE) {
      this.banner = `${this.score.ct >= WIN_SCORE ? 'CT' : 'T'} 赢得比赛`
      this.sub = `${this.score.ct} : ${this.score.t}`
    }
  }

  private teammate(dir: number): string | null {
    if (!this.playerTeam) return null
    const mates = this.actors.filter((a) => a.alive && a.team === this.playerTeam && a.id !== this.humanId)
    if (mates.length === 0) return null
    const cur = mates.findIndex((a) => a.id === this.spectateId)
    const i = cur < 0 ? 0 : (cur + dir + mates.length) % mates.length
    return mates[i].id
  }

  private cycleSpec(dir: number): void {
    const id = this.teammate(dir)
    if (id) this.spectateId = id
  }

  resume(): void {
    this.el.requestPointerLock()
  }

  private tryPossess(): void {
    const controlled = this.actors.find((a) => a.id === this.controlId)
    if (controlled?.alive) return
    const spec = this.actors.find((a) => a.id === this.spectateId && a.alive && a.team === this.playerTeam)
    if (!spec) {
      const id = this.teammate(1)
      if (id) this.spectateId = id
      return
    }
    this.controlId = spec.id
    this.spectateId = ''
  }

  private muzzlePos(a: Actor, eye: THREE.Vector3, dir: THREE.Vector3): THREE.Vector3 {
    if (a.id === this.controlId) {
      this.view.group.updateWorldMatrix(true, true)
      return this.view.muzzleWorld(new THREE.Vector3())
    }
    const m = a.visual.gun.getObjectByName('muzzle')
    if (m) return m.getWorldPosition(new THREE.Vector3())
    return eye.clone().addScaledVector(dir, 0.8)
  }

  private spawnTracer(from: THREE.Vector3, to: THREE.Vector3): void {
    const slot = this.tracers.find((t) => t.life <= 0) ?? this.tracers[0]
    const pos = slot.line.geometry.getAttribute('position') as THREE.BufferAttribute
    pos.setXYZ(0, from.x, from.y, from.z)
    pos.setXYZ(1, to.x, to.y, to.z)
    pos.needsUpdate = true
    slot.line.visible = true
    slot.life = 0.08
    ;(slot.line.material as THREE.LineBasicMaterial).opacity = 0.85
  }

  private spawnHole(x: number, y: number, z: number, nx: number, ny: number, nz: number): void {
    const slot = this.holes.find((h) => h.life <= 0) ?? this.holes[0]
    slot.mesh.visible = true
    slot.mesh.position.set(x + nx * 0.02, y + ny * 0.02, z + nz * 0.02)
    slot.mesh.lookAt(x + nx, y + ny, z + nz)
    slot.life = 8
  }

  private makeBombMesh(): THREE.Group {
    const g = new THREE.Group()
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.18, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x23281c, roughness: 0.6, metalness: 0.25 }),
    )
    const led = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.06, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 0.8 }),
    )
    led.name = 'led'
    led.position.set(0, 0.08, 0.08)
    const ant = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.16, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x111, metalness: 0.6, roughness: 0.3 }),
    )
    ant.position.set(0.1, 0.16, 0)
    g.add(body, led, ant)
    return g
  }

  private publish(): void {
    const view = this.viewActor()
    const controlled = this.actors.find((a) => a.id === this.controlId)
    const weapon = view ? currentWeapon(view) : null
    const def = weapon ? WEAPONS[weapon.id] : null
    const speed = view ? Math.hypot(view.vel.x, view.vel.z) : 0
    const spread = def && view ? weaponSpread(def, speed, RUN_SPEED, view.onGround, view.crouch, weapon!.spray, view.scoped && view.id === this.controlId) : 0.01
    const now = performance.now()
    const kills = this.kills.filter((k) => now - k.at < 6500)
    let prompt = ''
    if (controlled && !controlled.alive) prompt = this.spectateId ? '← → 切换队友   F 接管操控' : '等待回合结束'
    else if (this.phase === 'buy') prompt = '购买：1 沙鹰  2 步枪  3 AWP  4 防弹衣  5 头甲'
    else if (controlled?.hasBomb) prompt = inSite(this.map.sites.a, controlled.pos.x, controlled.pos.z) || inSite(this.map.sites.b, controlled.pos.x, controlled.pos.z) ? '按住 E 安装 C4' : '携带 C4 · 前往 A 点或 B 点'
    else if (this.bomb.state === 'planted' && controlled?.team === 'ct' && controlled.alive) {
      if (Math.hypot(controlled.pos.x - this.bomb.x, controlled.pos.z - this.bomb.z) < 2) prompt = '按住 E 拆除 C4'
    } else if (this.bomb.state === 'dropped' && controlled?.team === 't') prompt = 'C4 已掉落'

    const mates = this.playerTeam
      ? this.actors
          .filter((a) => a.alive && a.team === this.playerTeam && a.id !== view?.id)
          .map((a) => ({ x: a.pos.x, z: a.pos.z }))
      : []
    const enemies = this.playerTeam
      ? this.actors
          .filter((a) => a.alive && a.team !== this.playerTeam && (this.spots.get(a.id) ?? 0) > this.time)
          .map((a) => ({ x: a.pos.x, z: a.pos.z }))
      : []
    const spec = this.actors.find((a) => a.id === this.spectateId)
    const action: HudSnap['action'] =
      this.bomb.state === 'planted' && this.bomb.progress > 0
        ? 'defuse'
        : this.bomb.state === 'carried' && this.bomb.progress > 0
          ? 'plant'
          : null
    const snap: HudSnap = {
      phase: this.phase,
      team: this.playerTeam,
      round: this.round,
      scoreCT: this.score.ct,
      scoreT: this.score.t,
      banner: this.banner,
      sub: this.sub,
      roundTime: this.bomb.state === 'planted' ? this.bomb.timer : Math.max(0, this.roundTime),
      hp: Math.max(0, Math.ceil(view?.hp ?? 0)),
      armor: Math.max(0, Math.ceil(view?.armor ?? 0)),
      helmet: !!view?.helmet,
      money: controlled?.money ?? 0,
      weapon: view ? weaponLabel(view) : '',
      mag: weapon?.mag ?? 0,
      reserve: weapon?.reserve ?? 0,
      melee: !!def?.melee,
      spread,
      fov: this.camera.fov,
      scoped: this.scopeOn,
      hit: this.hitMarker,
      hitHs: this.hitHs,
      damage: this.damageFlash,
      damageAngle: this.damageAngle,
      action,
      actionPct: this.bomb.progress,
      bomb: this.bomb.state === 'planted' ? 'planted' : this.bomb.state === 'dropped' ? 'dropped' : this.bomb.state === 'carried' ? 'carried' : 'none',
      bombYou: !!controlled?.hasBomb,
      bombTime: this.bomb.timer,
      bombCarrier: this.actors.find((a) => a.id === this.bomb.carrierId)?.name ?? '',
      kills,
      mates,
      enemies,
      self: view ? { x: view.pos.x, z: view.pos.z, yaw: view.yaw } : null,
      bombPos:
        this.bomb.state === 'carried' || this.bomb.state === 'dropped' || this.bomb.state === 'planted'
          ? { x: this.bomb.x, z: this.bomb.z }
          : null,
      alive: !!controlled?.alive,
      spectating: !!controlled && !controlled.alive && !!spec?.alive,
      specName: spec?.name ?? '',
      paused: this.paused,
      tab: this.keys.has('Tab'),
      prompt,
      board: this.actors.map((a) => ({
        name: a.name,
        team: a.team,
        hp: Math.max(0, Math.ceil(a.hp)),
        money: a.money,
        weapon: weaponLabel(a),
        armor: Math.ceil(a.armor),
        bomb: a.hasBomb,
        alive: a.alive,
        you: a.id === this.controlId,
      })),
    }
    this.bus.push(snap)
  }
}

const _y = new THREE.Vector3(0, 1, 0)
const _x = new THREE.Vector3(1, 0, 0)
const _right = new THREE.Vector3()
const _up = new THREE.Vector3()
const _inv = new THREE.Matrix4()
const _o = new THREE.Vector3()
const _d = new THREE.Vector3()

function bodyOf(a: Actor) {
  return makeBodyPatched(a)
}

function makeBodyPatched(a: Actor) {
  const b = makeBody(a.pos.x, a.pos.y, a.pos.z)
  b.vx = a.vel.x
  b.vy = a.vel.y
  b.vz = a.vel.z
  b.onGround = a.onGround
  b.crouch = a.crouch
  return b
}

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
}

function rayCenteredBox(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxT: number, hx: number, hy: number, hz: number): number | null {
  let tmin = 0
  let tmax = maxT
  const dims: [number, number, number, number][] = [
    [ox, dx, -hx, hx],
    [oy, dy, -hy, hy],
    [oz, dz, -hz, hz],
  ]
  for (const [o, d, min, max] of dims) {
    if (Math.abs(d) < 1e-8) {
      if (o < min || o > max) return null
      continue
    }
    let t1 = (min - o) / d
    let t2 = (max - o) / d
    if (t1 > t2) {
      const s = t1
      t1 = t2
      t2 = s
    }
    if (t1 > tmin) tmin = t1
    if (t2 < tmax) tmax = t2
    if (tmin > tmax) return null
  }
  if (tmin < 0) return null
  return tmin
}

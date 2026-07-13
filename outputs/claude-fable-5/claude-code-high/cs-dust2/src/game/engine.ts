import * as THREE from 'three'
import { AIBrain, type AIWorld } from './ai'
import { AudioMan } from './audio'
import { Effects } from './effects'
import { GameMap } from './map'
import { Nav } from './nav'
import { PhysicsWorld } from './physics'
import { Soldier } from './soldier'
import { HudStore } from './store'
import { ViewModel } from './viewmodel'
import { PART_MULT, WEAPONS } from './weapons'
import {
  BOMB_FUSE, DEFUSE_TIME, FREEZE_TIME, PLANT_TIME,
  ROUND_END_TIME, ROUND_TIME, RUN_SPEED, WIN_SCORE,
  type BodyPart, type Loadout, type Phase, type Slot, type Team, type WeaponId,
} from './types'

const CT_NAMES = ['Rock', 'Duke', 'Nova', 'Ice', 'Sarge']
const T_NAMES = ['Viper', 'Wolf', 'Ghost', 'Blade', 'Fox']
const FIXED_DT = 1 / 64

interface BombState {
  carrierId: number | null
  droppedPos: THREE.Vector3 | null
  plantedPos: THREE.Vector3 | null
  plantedAt: number
  exploded: boolean
}

export class Engine {
  // three
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(75, 1, 0.05, 400)
  private container: HTMLElement

  // world
  map: GameMap
  private physics: PhysicsWorld
  private nav: Nav
  private effects: Effects
  audio = new AudioMan()
  private viewmodel: ViewModel
  private bombMesh: THREE.Group

  // game state
  soldiers: Soldier[] = []
  playerTeam: Team = 'CT'
  private playerId = 0
  private controlledId = 0
  viewedId = 0
  private autoMode = false
  phase: Phase = 'menu'
  private round = 1
  private ctScore = 0
  private tScore = 0
  private phaseEndsAt = 0
  private roundEndsAt = 0
  private winner: Team | null = null
  private winReason = ''
  private matchWinner: Team | null = null
  bomb: BombState = { carrierId: null, droppedPos: null, plantedPos: null, plantedAt: 0, exploded: false }
  private nextBeepAt = 0
  private nextDefTickAt = 0
  playerLoadout: Loadout = 'rifle'

  // timing
  time = 0
  private accumulator = 0
  private lastFrame = 0
  private rafId = 0
  private hudSyncAt = 0
  private seenScanAt = 0
  private disposed = false

  // input
  private keys = new Set<string>()
  private mouseFire = false
  private fireTapQueued = false
  private altTapQueued = false
  private jumpQueued = false
  private slotQueued: Slot | null = null
  private deathAt = 0
  pointerLocked = false

  hud = new HudStore()
  private killfeedId = 0

  constructor(container: HTMLElement) {
    this.container = container
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.15
    this.renderer.setClearColor(0xb9d2e8)
    container.appendChild(this.renderer.domElement)

    this.scene.fog = new THREE.Fog(0xc4d6e6, 70, 240)
    const hemi = new THREE.HemisphereLight(0xcfe4f5, 0x8a7a55, 1.5)
    const sun = new THREE.DirectionalLight(0xfff2dd, 2.2)
    sun.position.set(60, 90, 30)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = -90
    sun.shadow.camera.right = 90
    sun.shadow.camera.top = 90
    sun.shadow.camera.bottom = -90
    sun.shadow.camera.far = 260
    sun.shadow.bias = -0.0006
    this.scene.add(hemi, sun, sun.target)

    this.map = new GameMap()
    this.scene.add(this.map.group)
    this.physics = new PhysicsWorld(this.map)
    this.nav = new Nav(this.map, this.physics)
    this.effects = new Effects(this.scene)

    this.camera.rotation.order = 'YXZ'
    this.scene.add(this.camera)
    this.viewmodel = new ViewModel(this.camera)

    this.bombMesh = this.buildBombMesh()
    this.bombMesh.visible = false
    this.scene.add(this.bombMesh)

    this.bindEvents()
    this.resize()
    this.lastFrame = performance.now()
    const loop = (t: number) => {
      if (this.disposed) return
      this.rafId = requestAnimationFrame(loop)
      const dt = Math.min(0.05, (t - this.lastFrame) / 1000)
      this.lastFrame = t
      this.update(dt)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  private buildBombMesh(): THREE.Group {
    const g = new THREE.Group()
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.16, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x8a7455, roughness: 0.8 }),
    )
    body.position.y = 0.08
    body.castShadow = true
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.04, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x1a1f18 }),
    )
    panel.position.set(0, 0.18, 0)
    const led = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.03, 0.05),
      new THREE.MeshBasicMaterial({ color: 0xff2222 }),
    )
    led.position.set(0.12, 0.19, 0)
    led.name = 'led'
    g.add(body, panel, led)
    return g
  }

  // ---------------------------------------------------------------- lifecycle

  start(team: Team, auto = false) {
    this.audio.resume()
    this.playerTeam = team
    this.autoMode = auto
    this.ctScore = 0
    this.tScore = 0
    this.matchWinner = null

    for (const s of this.soldiers) s.rig.dispose(this.scene)
    this.soldiers = []
    let id = 0
    for (const t of ['CT', 'T'] as Team[]) {
      const names = t === 'CT' ? CT_NAMES : T_NAMES
      for (let i = 0; i < 5; i++) {
        const isPlayer = !auto && t === team && i === 0
        const s = new Soldier(id, isPlayer ? '你' : names[i], t)
        s.isPlayer = isPlayer
        if (!isPlayer) s.brain = new AIBrain(s)
        if (isPlayer) this.playerId = id
        this.scene.add(s.rig.root)
        this.soldiers.push(s)
        id++
      }
    }
    if (auto) this.playerId = 0
    this.controlledId = this.playerId
    this.viewedId = this.playerId
    this.startRound(1)
  }

  toMenu() {
    this.phase = 'menu'
    for (const s of this.soldiers) s.rig.dispose(this.scene)
    this.soldiers = []
    this.bombMesh.visible = false
    document.exitPointerLock?.()
    this.syncHud()
  }

  restartMatch() {
    this.start(this.playerTeam, this.autoMode)
  }

  requestLock() {
    this.renderer.domElement.requestPointerLock()
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.rafId)
    this.unbindEvents()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }

  // ------------------------------------------------------------------ rounds

  private startRound(n: number) {
    this.round = n
    this.phase = 'freeze'
    this.phaseEndsAt = this.time + FREEZE_TIME
    this.winner = null
    this.winReason = ''
    this.bomb = { carrierId: null, droppedPos: null, plantedPos: null, plantedAt: 0, exploded: false }
    this.bombMesh.visible = false
    this.controlledId = this.playerId
    this.viewedId = this.playerId

    const pistol = n === 1
    // restore bots that were taken over in a previous round
    for (const s of this.soldiers) {
      if (s.id !== this.playerId) {
        s.isPlayer = false
        s.name = s.originalName
        if (!s.brain) s.brain = new AIBrain(s)
      } else {
        s.isPlayer = !this.autoMode
      }
    }
    const spawnIdx: Record<Team, number> = { CT: 0, T: 0 }
    // one AI per team may carry an AWP on gun rounds
    const awpBot: Record<Team, number> = { CT: -1, T: -1 }
    if (!pistol) {
      for (const t of ['CT', 'T'] as Team[]) {
        if (Math.random() < 0.45) {
          const bots = this.soldiers.filter(s => s.team === t && !s.isPlayer)
          awpBot[t] = bots[Math.floor(Math.random() * bots.length)].id
        }
      }
    }

    for (const s of this.soldiers) {
      const spawn = this.map.spawns[s.team][spawnIdx[s.team]++ % 5]
      s.respawn(spawn.pos.clone(), spawn.yaw)
      const secondary: WeaponId = pistol ? (s.team === 'T' ? 'glock' : 'usp') : 'deagle'
      let primary: WeaponId | null = null
      if (!pistol) {
        primary = s.team === 'T' ? 'ak47' : 'm4a4'
        if (s.id === awpBot[s.team]) primary = 'awp'
        if (s.id === this.playerId && !this.autoMode && this.playerLoadout === 'awp') primary = 'awp'
      }
      s.equip(primary, secondary, pistol ? 0 : 100)
      s.brain?.reset()
    }

    // hand C4 to a random T
    const ts = this.soldiers.filter(s => s.team === 'T')
    const carrier = ts[Math.floor(Math.random() * ts.length)]
    carrier.hasBomb = true
    carrier.rig.setBomb(true)
    this.bomb.carrierId = carrier.id

    this.viewmodel.setWeapon(this.controlled?.weapon.def.id ?? 'knife', false)
    this.audio.roundStart()
    if (this.autoMode) console.log(`[round ${n}] start — CT ${this.ctScore} : ${this.tScore} T`)
    this.syncHud()
  }

  private goLive() {
    this.phase = 'live'
    this.roundEndsAt = this.time + ROUND_TIME
    this.assignMissions()
  }

  private assignMissions() {
    const site: 'A' | 'B' = Math.random() < 0.55 ? 'A' : 'B'
    const routes = this.map.routes[site]
    const sitePos = this.map.anchors[site === 'A' ? 'aSite' : 'bSite']

    const ts = this.soldiers.filter(s => s.team === 'T' && s.brain)
    const carrierRoute = Math.floor(Math.random() * routes.length)
    ts.forEach((s, i) => {
      const route = routes[(carrierRoute + (i % 2 === 0 ? 0 : 1)) % routes.length]
      const isCarrier = s.hasBomb
      const final = isCarrier ? this.map.randomSiteSpot(site) : this.map.randomSpotNear(sitePos, 9)
      s.brain!.setMission(route, final, this.map.anchors.ctSpawn, isCarrier ? 'plant' : 'none')
    })

    const cts = this.soldiers.filter(s => s.team === 'CT' && s.brain)
    const spots = [
      ...this.map.holdSpots.A.slice(0, 2).map(h => ({ ...h })),
      ...this.map.holdSpots.B.slice(0, 2).map(h => ({ ...h })),
      ...this.map.holdSpots.mid.slice(0, 1).map(h => ({ ...h })),
    ]
    cts.forEach((s, i) => {
      const spot = spots[i % spots.length]
      s.brain!.setMission([], spot.pos, spot.look, 'none')
    })
  }

  private winRound(team: Team, reason: string) {
    if (this.phase !== 'live') return
    this.phase = 'over'
    this.phaseEndsAt = this.time + ROUND_END_TIME
    this.winner = team
    this.winReason = reason
    if (team === 'CT') this.ctScore++
    else this.tScore++
    this.audio.roundEnd(this.autoMode ? true : team === this.playerTeam)
    if (this.autoMode) console.log(`[round ${this.round}] winner=${team} reason=${reason} — CT ${this.ctScore} : ${this.tScore} T`)
    this.syncHud()
  }

  private checkElimination() {
    if (this.phase !== 'live') return
    const ctAlive = this.soldiers.some(s => s.team === 'CT' && s.alive)
    const tAlive = this.soldiers.some(s => s.team === 'T' && s.alive)
    if (!ctAlive) this.winRound('T', '歼灭敌方')
    else if (!tAlive && !this.bomb.plantedPos) this.winRound('CT', '歼灭敌方')
    // T 全灭但已下包 → 等待 C4 结算
  }

  // ------------------------------------------------------------------- input

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return
    this.keys.add(e.code)
    if (e.code === 'Space') { this.jumpQueued = true; e.preventDefault() }
    if (e.code === 'Digit1') this.slotQueued = 'primary'
    if (e.code === 'Digit2') this.slotQueued = 'secondary'
    if (e.code === 'Digit3') this.slotQueued = 'knife'
    if (e.code === 'KeyR') { /* handled per tick via keys */ }
    if (e.code === 'KeyB' && this.phase === 'freeze' && this.round > 1) {
      this.playerLoadout = this.playerLoadout === 'rifle' ? 'awp' : 'rifle'
      const p = this.soldiers[this.playerId]
      if (p && !this.autoMode) {
        const primary: WeaponId = this.playerLoadout === 'awp' ? 'awp' : (p.team === 'T' ? 'ak47' : 'm4a4')
        p.equip(primary, 'deagle', p.armor)
        this.viewmodel.setWeapon(p.weapon.def.id)
      }
      this.syncHud()
    }
    // spectate controls
    const me = this.soldiers[this.controlledId]
    if (me && !me.alive && this.phase === 'live') {
      if (e.code === 'ArrowLeft') this.cycleSpectate(-1)
      if (e.code === 'ArrowRight') this.cycleSpectate(1)
      if (e.code === 'KeyE' || e.code === 'Enter') this.takeOver()
    }
  }

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code)
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.pointerLocked) return
    const s = this.controlled
    if (!s || !s.alive || !s.isPlayer) return
    const sens = 0.0022 * (s.scoped ? 0.35 : 1)
    s.yaw -= e.movementX * sens
    s.pitch = THREE.MathUtils.clamp(s.pitch - e.movementY * sens, -1.55, 1.55)
  }

  private onMouseDown = (e: MouseEvent) => {
    if (this.phase === 'menu' || this.phase === 'matchover') return
    if (!this.pointerLocked) return
    const me = this.soldiers[this.controlledId]
    if (me && !me.alive && this.phase === 'live') {
      if (e.button === 0) this.cycleSpectate(1)
      return
    }
    if (e.button === 0) { this.mouseFire = true; this.fireTapQueued = true }
    if (e.button === 2) this.altTapQueued = true
  }

  private onMouseUp = (e: MouseEvent) => {
    if (e.button === 0) this.mouseFire = false
  }

  private onLockChange = () => {
    this.pointerLocked = document.pointerLockElement === this.renderer.domElement
    if (!this.pointerLocked) this.mouseFire = false
    this.syncHud()
  }

  private onContext = (e: Event) => e.preventDefault()
  private onResize = () => this.resize()

  private bindEvents() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('resize', this.onResize)
    document.addEventListener('pointerlockchange', this.onLockChange)
    this.renderer.domElement.addEventListener('contextmenu', this.onContext)
  }

  private unbindEvents() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('resize', this.onResize)
    document.removeEventListener('pointerlockchange', this.onLockChange)
    this.renderer.domElement.removeEventListener('contextmenu', this.onContext)
  }

  private resize() {
    const w = this.container.clientWidth || window.innerWidth
    const h = this.container.clientHeight || window.innerHeight
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  get controlled(): Soldier | null {
    return this.soldiers[this.controlledId] ?? null
  }

  get viewed(): Soldier | null {
    return this.soldiers[this.viewedId] ?? null
  }

  private cycleSpectate(dir: number) {
    const mates = this.soldiers.filter(s => s.team === this.playerTeam && s.alive)
    if (mates.length === 0) return
    const curIdx = mates.findIndex(s => s.id === this.viewedId)
    const next = mates[(curIdx + dir + mates.length) % mates.length]
    this.viewedId = next.id
    this.viewmodel.setWeapon(next.weapon.def.id, false)
    this.syncHud()
  }

  private takeOver() {
    let target = this.soldiers[this.viewedId]
    // still on the death cam (or viewing a corpse): jump to a live teammate first
    if (!target || !target.alive || target.id === this.controlledId) {
      this.cycleSpectate(1)
      target = this.soldiers[this.viewedId]
    }
    if (!target || !target.alive || target.team !== this.playerTeam || target.isPlayer) return
    target.brain = null
    target.isPlayer = true
    target.name = `你(${target.originalName})`
    this.controlledId = target.id
    this.viewmodel.setWeapon(target.weapon.def.id, false)
    this.syncHud()
  }

  // ----------------------------------------------------------------- updates

  private update(dt: number) {
    this.time += dt

    if (this.phase === 'menu') {
      const t = this.time * 0.06
      this.camera.position.set(Math.cos(t) * 75, 52, Math.sin(t) * 75)
      this.camera.lookAt(0, 0, 0)
      this.viewmodel.group.visible = false
      this.effects.update(dt)
      this.renderer.render(this.scene, this.camera)
      if (this.time > this.hudSyncAt) { this.hudSyncAt = this.time + 0.25; this.syncHud() }
      return
    }

    // phase transitions
    if (this.phase === 'freeze' && this.time >= this.phaseEndsAt) this.goLive()
    if (this.phase === 'over' && this.time >= this.phaseEndsAt) {
      if (this.ctScore >= WIN_SCORE || this.tScore >= WIN_SCORE) {
        this.phase = 'matchover'
        this.matchWinner = this.ctScore >= WIN_SCORE ? 'CT' : 'T'
        document.exitPointerLock?.()
      } else {
        this.startRound(this.round + 1)
      }
      this.syncHud()
    }
    if (this.phase === 'live' && !this.bomb.plantedPos && this.time >= this.roundEndsAt) {
      this.winRound('CT', '时间耗尽')
    }

    const canAct = this.phase === 'live'

    // player input → control
    const me = this.controlled
    if (me && me.isPlayer && me.alive) {
      const c = me.control
      c.moveX = (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0)
      c.moveZ = (this.keys.has('KeyW') ? 1 : 0) - (this.keys.has('KeyS') ? 1 : 0)
      c.walk = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight')
      // edge-triggered inputs stay latched until a fixed step consumes them —
      // on high-refresh displays a frame may run zero fixed steps, and a plain
      // per-frame assignment would silently eat clicks
      c.jump = c.jump || this.jumpQueued
      c.fire = this.mouseFire && this.pointerLocked
      c.fireTap = c.fireTap || this.fireTapQueued
      c.altTap = c.altTap || this.altTapQueued
      c.reload = this.keys.has('KeyR')
      c.use = this.keys.has('KeyE')
      c.slot = this.slotQueued ?? c.slot
      if (!canAct) {
        c.moveX = 0; c.moveZ = 0; c.jump = false
        c.fire = false; c.fireTap = false; c.use = false
      }
    }
    this.jumpQueued = false
    this.fireTapQueued = false
    this.altTapQueued = false
    this.slotQueued = null

    // AI
    if (canAct) {
      const aiWorld: AIWorld = {
        map: this.map, nav: this.nav, physics: this.physics,
        soldiers: this.soldiers, time: this.time,
        bombPlantedPos: this.bomb.plantedPos,
        bombDroppedPos: this.bomb.droppedPos,
      }
      for (const s of this.soldiers) s.brain?.update(dt, aiWorld)
    } else {
      for (const s of this.soldiers) {
        if (s.brain) { s.control.moveX = 0; s.control.moveZ = 0; s.control.fire = false; s.control.fireTap = false; s.control.use = false }
      }
    }

    // fixed-step simulation
    this.accumulator = Math.min(this.accumulator + dt, 0.1)
    while (this.accumulator >= FIXED_DT) {
      this.accumulator -= FIXED_DT
      this.fixedStep(FIXED_DT)
    }

    // doors
    const alivePos = this.soldiers.filter(s => s.alive).map(s => s.pos)
    for (const d of this.map.doors) {
      const ev = d.update(dt, alivePos)
      if (ev) this.audio.doorSlide(d.center)
    }

    // bomb & round timing
    this.updateBomb()
    if (canAct) this.updateSpectate()

    // team vision stamps (minimap)
    if (this.time >= this.seenScanAt) {
      this.seenScanAt = this.time + 0.15
      this.scanVision()
    }

    // visuals
    for (const s of this.soldiers) {
      const speed = Math.hypot(s.vel.x, s.vel.z)
      s.rig.update(dt, s.pos, s.yaw, s.pitch, speed, s.onGround)
      s.rig.root.visible = s.id !== this.viewedId && s.rig.root.visible
      if (s.id !== this.viewedId && s.alive) s.rig.root.visible = true
      if (!s.alive) { /* keep rig's own fade logic */ }
    }
    const v = this.viewed
    if (v) {
      // camera at viewed soldier's eye
      const shake = this.effects.shake
      this.camera.position.copy(v.eyePos)
      this.camera.rotation.y = v.yaw + v.recoilYaw + (Math.random() - 0.5) * shake * 0.05
      this.camera.rotation.x = THREE.MathUtils.clamp(v.pitch + v.recoilPitch, -1.55, 1.55) + (Math.random() - 0.5) * shake * 0.05
      this.camera.rotation.z = (Math.random() - 0.5) * shake * 0.03
      if (!v.alive) {
        this.camera.position.y = Math.max(0.4, this.camera.position.y - 1.1)
        this.camera.rotation.z += 0.35
      }
      const targetFov = v.scoped && v.weapon.def.scopeFov ? v.weapon.def.scopeFov : 75
      if (Math.abs(this.camera.fov - targetFov) > 0.5) {
        this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, 18 * dt)
        this.camera.updateProjectionMatrix()
      }
      const speed = Math.hypot(v.vel.x, v.vel.z)
      this.viewmodel.update(dt, speed, v.onGround, v.scoped || !v.alive)
      this.audio.setListener(v.eyePos, v.rightDir())
    }

    this.effects.update(dt)
    this.renderer.render(this.scene, this.camera)

    if (this.time >= this.hudSyncAt) {
      this.hudSyncAt = this.time + 0.05
      this.syncHud()
    }
  }

  private fixedStep(dt: number) {
    for (const s of this.soldiers) {
      if (!s.alive) continue
      const c = s.control

      // weapon switching
      if (c.slot) {
        if (s.trySwitch(c.slot)) {
          if (s.id === this.viewedId) { this.viewmodel.setWeapon(s.weapon.def.id); this.audio.drawWeapon() }
        }
        c.slot = null
      }

      // weapon state
      const wpn = s.weapon
      wpn.update(dt)
      if (c.reload && wpn.startReload()) {
        s.scoped = false
        this.audio.reload(s.id === this.viewedId ? null : s.pos, wpn.def.reloadTime)
        if (s.id === this.viewedId) this.viewmodel.onReload(wpn.def.reloadTime)
      }

      // scope toggle
      if (c.altTap && wpn.def.scopeFov && !wpn.reloading) {
        s.scoped = !s.scoped
        if (s.id === this.viewedId) this.audio.scope(s.scoped)
      }
      if (!wpn.def.scopeFov) s.scoped = false

      // channels (plant / defuse)
      this.updateChannel(s, dt)

      // movement (channeling locks you in place)
      const chanLock = s.channel !== null
      let speed = RUN_SPEED * wpn.def.moveMult
      if (c.walk) speed *= 0.52
      if (s.scoped) speed *= 0.55
      const fwd = new THREE.Vector3(-Math.sin(s.yaw), 0, -Math.cos(s.yaw))
      const right = s.rightDir()
      const wish = new THREE.Vector3()
      if (!chanLock) {
        wish.addScaledVector(fwd, c.moveZ).addScaledVector(right, c.moveX)
        if (wish.lengthSq() > 1) wish.normalize()
      }
      this.physics.moveBody(s, wish, speed, c.jump && !chanLock, dt)
      c.jump = false

      // recoil recovery
      s.recoilPitch *= Math.exp(-6 * dt)
      s.recoilYaw *= Math.exp(-6 * dt)

      // footsteps
      const hSpeed = Math.hypot(s.vel.x, s.vel.z)
      if (s.onGround && hSpeed > 1) {
        s.stepAcc += hSpeed * dt
        if (s.stepAcc > 2.55) {
          s.stepAcc = 0
          const vol = c.walk ? 0.25 : 1
          this.audio.footstep(s.id === this.viewedId ? null : s.pos, s.id === this.viewedId ? vol * 0.4 : vol)
        }
      }

      // firing (taps are buffered so clicks during weapon cooldown aren't dropped)
      if (c.fireTap) s.tapBuffer = 0.22
      if (!chanLock && this.phase === 'live') {
        const wantsFire = wpn.def.auto ? (c.fire || s.tapBuffer > 0) : s.tapBuffer > 0
        if (wantsFire && wpn.canFire() && s.switchCooldown <= 0) {
          this.performShot(s)
          s.tapBuffer = 0
        }
      }
      if (s.tapBuffer > 0) s.tapBuffer -= dt
      c.fireTap = false
      c.altTap = false
      if (s.switchCooldown > 0) s.switchCooldown -= dt

      // bomb pickup
      if (s.team === 'T' && this.bomb.droppedPos && s.alive) {
        if (s.pos.distanceTo(this.bomb.droppedPos) < 1.3) {
          this.bomb.droppedPos = null
          this.bomb.carrierId = s.id
          s.hasBomb = true
          s.rig.setBomb(true)
          this.bombMesh.visible = false
          this.reassignPlantDuty(s)
        }
      }
    }

    // soldier-vs-soldier separation
    const alive = this.soldiers.filter(s => s.alive)
    for (let i = 0; i < alive.length; i++) {
      for (let j = i + 1; j < alive.length; j++) {
        const a = alive[i], b = alive[j]
        const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z
        const d2 = dx * dx + dz * dz
        if (d2 > 0.0001 && d2 < 0.72 * 0.72) {
          const d = Math.sqrt(d2)
          const push = (0.72 - d) / 2
          const nx = dx / d, nz = dz / d
          if (this.physics.circleFree(a.pos.x - nx * push, a.pos.z - nz * push, a.radius, a.pos.y)) {
            a.pos.x -= nx * push; a.pos.z -= nz * push
          }
          if (this.physics.circleFree(b.pos.x + nx * push, b.pos.z + nz * push, b.radius, b.pos.y)) {
            b.pos.x += nx * push; b.pos.z += nz * push
          }
        }
      }
    }
  }

  private updateChannel(s: Soldier, dt: number) {
    const wantPlant = s.control.use && s.team === 'T' && s.hasBomb && !this.bomb.plantedPos
      && s.onGround && this.map.plantSiteAt(s.pos.x, s.pos.z) !== null && this.phase === 'live'
    const wantDefuse = s.control.use && s.team === 'CT' && this.bomb.plantedPos !== null && this.phase === 'live'
      && Math.hypot(this.bomb.plantedPos.x - s.pos.x, this.bomb.plantedPos.z - s.pos.z) < 1.5

    if (wantPlant) {
      if (!s.channel || s.channel.kind !== 'plant') s.channel = { kind: 'plant', t: 0, total: PLANT_TIME }
      s.channel.t += dt
      if (Math.floor(s.channel.t * 4) !== Math.floor((s.channel.t - dt) * 4)) this.audio.plantTick(s.id === this.viewedId ? null : s.pos)
      if (s.channel.t >= s.channel.total) {
        s.channel = null
        this.plantBomb(s)
      }
    } else if (wantDefuse) {
      if (!s.channel || s.channel.kind !== 'defuse') s.channel = { kind: 'defuse', t: 0, total: DEFUSE_TIME }
      s.channel.t += dt
      if (this.time >= this.nextDefTickAt) {
        this.nextDefTickAt = this.time + 0.5
        this.audio.defuseTick(s.id === this.viewedId ? null : s.pos)
      }
      if (s.channel.t >= s.channel.total) {
        s.channel = null
        this.audio.bombDefused()
        this.winRound('CT', '炸弹已拆除')
      }
    } else {
      s.channel = null
    }
  }

  // ------------------------------------------------------------------ combat

  private performShot(shooter: Soldier) {
    const wpn = shooter.weapon
    const def = wpn.def

    if (def.id === 'knife') {
      wpn.onFire()
      const isViewed = shooter.id === this.viewedId
      this.audio.shot('knife', isViewed ? null : shooter.pos)
      if (isViewed) this.viewmodel.onFire(0)
      const dir = shooter.viewDir()
      const hit = this.physics.raycast(shooter.eyePos, dir, def.range ?? 2.2, this.soldiers, shooter.id, shooter.team)
      if (hit?.kind === 'soldier' && hit.soldier) {
        this.audio.knifeHit(isViewed ? null : hit.point)
        this.applyDamage(hit.soldier as Soldier, def.damage, shooter, hit.part ?? 'chest', def)
        this.effects.bloodBurst(hit.point)
      } else if (hit) {
        // scraped a wall / crate
        this.audio.knifeHit(isViewed ? null : hit.point)
        this.effects.impact(hit.point)
      }
      return
    }

    wpn.onFire()

    // spread
    let spread = shooter.scoped && def.spreadScoped !== undefined ? def.spreadScoped : def.spreadBase
    spread += wpn.bloom - def.spreadPerShot // bloom before this shot's own bump
    const hSpeed = Math.hypot(shooter.vel.x, shooter.vel.z)
    spread += (hSpeed / RUN_SPEED) * def.spreadMove
    if (!shooter.onGround) spread += 0.05

    const dir = shooter.viewDir()
    const right = shooter.rightDir()
    const up = new THREE.Vector3().crossVectors(right, dir).normalize()
    const a = Math.random() * Math.PI * 2
    const r = Math.sqrt(Math.random()) * spread
    dir.addScaledVector(right, Math.cos(a) * r).addScaledVector(up, Math.sin(a) * r).normalize()

    // recoil
    shooter.recoilPitch += def.kickPitch * (0.85 + Math.random() * 0.3)
    shooter.recoilYaw += (Math.random() - 0.5) * def.kickYaw * 2

    const isViewed = shooter.id === this.viewedId
    this.audio.shot(def.sound, isViewed ? null : shooter.pos)
    this.notifyHeard(shooter)

    // muzzle position for tracer
    const eye = shooter.eyePos
    const muzzle = eye.clone().addScaledVector(dir, 0.7).addScaledVector(right, isViewed ? 0.13 : 0.2).addScaledVector(up, -0.1)
    this.effects.muzzle(muzzle)

    if (isViewed) {
      this.viewmodel.onFire(def.kickPitch)
    }

    const hit = this.physics.raycast(eye, dir, 300, this.soldiers, shooter.id, shooter.team)
    const end = hit ? hit.point : eye.clone().addScaledVector(dir, 300)
    if (def.id !== 'usp') this.effects.tracer(muzzle, end)

    if (hit) {
      if (hit.kind === 'soldier' && hit.soldier) {
        this.effects.bloodBurst(hit.point)
        this.applyDamage(hit.soldier as Soldier, def.damage, shooter, hit.part ?? 'chest', def)
      } else {
        this.effects.impact(hit.point)
      }
    }
  }

  private notifyHeard(shooter: Soldier) {
    for (const s of this.soldiers) {
      if (!s.alive || s.team === shooter.team || !s.brain) continue
      if (s.pos.distanceTo(shooter.pos) < 38) s.brain.heard(shooter.pos, this.time)
    }
  }

  private applyDamage(target: Soldier, baseDmg: number, attacker: Soldier, part: BodyPart, def: { armorPen: number; name: string }) {
    if (!target.alive) return
    let dmg = baseDmg * PART_MULT[part]
    if (target.armor > 0 && part !== 'leg') {
      const kept = dmg * def.armorPen
      const absorbed = (dmg - kept) * 0.5
      target.armor = Math.max(0, target.armor - absorbed)
      dmg = kept
    }
    dmg = Math.round(dmg)
    target.hp -= dmg

    const headshot = part === 'head'
    if (attacker.id === this.controlledId) {
      this.hud.state.hitmarkerAt = this.time
      this.hud.state.hitmarkerHead = headshot
      this.audio.hit(headshot)
    }
    if (target.id === this.controlledId) {
      this.hud.state.damageAt = this.time
      this.audio.damage()
    }

    if (target.hp <= 0) {
      this.kill(target, attacker, def.name, headshot)
    }
  }

  private kill(victim: Soldier, attacker: Soldier, weaponName: string, headshot: boolean) {
    victim.alive = false
    victim.hp = 0
    victim.deaths++
    attacker.kills++
    victim.channel = null
    victim.scoped = false
    victim.rig.die()
    this.audio.death(victim.pos)
    if (attacker.id === this.controlledId) this.audio.kill()

    // drop bomb
    if (victim.hasBomb) {
      victim.hasBomb = false
      victim.rig.setBomb(false)
      this.bomb.carrierId = null
      this.bomb.droppedPos = victim.pos.clone()
      this.bombMesh.visible = true
      this.bombMesh.position.copy(victim.pos)
      this.bombMesh.rotation.set(0, Math.random() * 6, 0)
      // send nearest T to pick it up
      const ts = this.soldiers.filter(s => s.team === 'T' && s.alive && s.brain)
      ts.sort((a, b) => a.pos.distanceTo(victim.pos) - b.pos.distanceTo(victim.pos))
      if (ts[0]) ts[0].brain!.setMission([], victim.pos.clone(), null, 'pickup')
    }

    this.hud.state.killfeed.push({
      id: this.killfeedId++,
      attacker: attacker.name, attackerTeam: attacker.team,
      victim: victim.name, victimTeam: victim.team,
      weapon: weaponName, headshot, t: this.time,
    })
    if (this.hud.state.killfeed.length > 6) this.hud.state.killfeed.shift()
    if (this.autoMode) console.log(`[kill] ${attacker.name} → ${victim.name} (${weaponName}${headshot ? ', HS' : ''})`)

    // a teammate of the victim may investigate
    const mates = this.soldiers.filter(s => s.team === victim.team && s.alive && s.brain && !s.brain.target)
    if (mates.length && Math.random() < 0.5) {
      const m = mates[Math.floor(Math.random() * mates.length)]
      m.brain!.heard(victim.pos, this.time)
    }

    if (victim.id === this.controlledId) this.deathAt = this.time
    this.checkElimination()
    this.syncHud()
  }

  // -------------------------------------------------------------------- bomb

  private plantBomb(planter: Soldier) {
    planter.hasBomb = false
    planter.rig.setBomb(false)
    this.bomb.carrierId = null
    this.bomb.plantedPos = planter.pos.clone()
    this.bomb.plantedAt = this.time
    this.bombMesh.visible = true
    this.bombMesh.position.copy(this.bomb.plantedPos)
    this.bombMesh.rotation.set(0, Math.random() * 6, 0)
    this.nextBeepAt = this.time
    this.audio.bombPlanted()
    if (this.autoMode) console.log(`[bomb] planted at ${this.map.plantSiteAt(this.bomb.plantedPos.x, this.bomb.plantedPos.z)}`)

    // T defend spots, CT retake + defuse duty
    for (const s of this.soldiers) {
      if (!s.alive || !s.brain) continue
      if (s.team === 'T') {
        s.brain.setMission([], this.map.randomSpotNear(this.bomb.plantedPos, 9), this.bomb.plantedPos, 'none')
      }
    }
    this.assignDefuser()
    this.syncHud()
  }

  private assignDefuser() {
    if (!this.bomb.plantedPos) return
    const cts = this.soldiers.filter(s => s.team === 'CT' && s.alive && s.brain)
    cts.sort((a, b) => a.pos.distanceTo(this.bomb.plantedPos!) - b.pos.distanceTo(this.bomb.plantedPos!))
    cts.forEach((s, i) => {
      if (i === 0) s.brain!.setMission([], this.bomb.plantedPos!.clone(), null, 'defuse')
      else s.brain!.setMission([], this.map.randomSpotNear(this.bomb.plantedPos!, 8), this.bomb.plantedPos, 'none')
    })
  }

  private reassignPlantDuty(carrier: Soldier) {
    if (!carrier.brain) return
    const site: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B'
    const near = this.map.plantSiteAt(carrier.pos.x, carrier.pos.z)
    const chosen = near ?? site
    carrier.brain.setMission([], this.map.randomSiteSpot(chosen), null, 'plant')
  }

  private updateBomb() {
    if (this.bomb.plantedPos && !this.bomb.exploded) {
      const led = this.bombMesh.getObjectByName('led') as THREE.Mesh | undefined
      const remaining = this.bomb.plantedAt + BOMB_FUSE - this.time
      if (led) {
        const blink = Math.sin(this.time * (remaining < 8 ? 30 : 8)) > 0
        ;(led.material as THREE.MeshBasicMaterial).color.setHex(blink ? 0xff2222 : 0x441111)
      }
      if (this.time >= this.nextBeepAt && this.phase === 'live') {
        const frac = Math.max(0, remaining / BOMB_FUSE)
        this.nextBeepAt = this.time + 0.12 + 0.9 * Math.pow(frac, 1.4)
        this.audio.bombBeep(this.bomb.plantedPos, remaining < 10)
      }
      if (remaining <= 0 && this.phase === 'live') {
        this.explodeBomb()
      }
      // keep a defuser assigned if the previous one died
      if (this.phase === 'live' && !this.soldiers.some(s => s.team === 'CT' && s.alive && s.brain?.mission?.duty === 'defuse')) {
        this.assignDefuser()
      }
    }
  }

  private explodeBomb() {
    if (!this.bomb.plantedPos) return
    this.bomb.exploded = true
    this.bombMesh.visible = false
    this.effects.explosion(this.bomb.plantedPos)
    this.audio.explosion(this.bomb.plantedPos)
    for (const s of this.soldiers) {
      if (!s.alive) continue
      const d = s.pos.distanceTo(this.bomb.plantedPos)
      if (d < 20) {
        let dmg = 550 * (1 - d / 20)
        if (!this.physics.hasLOS(this.bomb.plantedPos.clone().add(new THREE.Vector3(0, 1, 0)), s.eyePos)) dmg *= 0.4
        s.hp -= dmg
        if (s.hp <= 0) {
          s.alive = false
          s.deaths++
          s.rig.die()
          if (s.id === this.controlledId) this.deathAt = this.time
        }
      }
    }
    this.winRound('T', 'C4 爆炸')
  }

  // ---------------------------------------------------------------- spectate

  private updateSpectate() {
    const me = this.soldiers[this.controlledId]
    if (!me || me.alive) return
    if (this.viewedId === this.controlledId && this.time - this.deathAt > 0.8) {
      // auto-switch to an alive teammate
      const mate = this.soldiers.find(s => s.team === this.playerTeam && s.alive)
      if (mate) {
        this.viewedId = mate.id
        this.viewmodel.setWeapon(mate.weapon.def.id, false)
      }
    }
    const v = this.viewed
    if (v && !v.alive && v.id !== this.controlledId) {
      const mate = this.soldiers.find(s => s.team === this.playerTeam && s.alive)
      if (mate) {
        this.viewedId = mate.id
        this.viewmodel.setWeapon(mate.weapon.def.id, false)
      } else {
        this.viewedId = this.controlledId
      }
    }
  }

  private scanVision() {
    for (const team of ['CT', 'T'] as Team[]) {
      const observers = this.soldiers.filter(s => s.team === team && s.alive)
      for (const enemy of this.soldiers) {
        if (enemy.team === team || !enemy.alive) continue
        for (const o of observers) {
          const dx = enemy.pos.x - o.pos.x, dz = enemy.pos.z - o.pos.z
          const dist = Math.hypot(dx, dz)
          if (dist > 70) continue
          const dirYaw = Math.atan2(-dx, -dz)
          let dyaw = (dirYaw - o.yaw) % (Math.PI * 2)
          if (dyaw > Math.PI) dyaw -= Math.PI * 2
          if (dyaw < -Math.PI) dyaw += Math.PI * 2
          if (Math.abs(dyaw) > 1.1 && dist > 3) continue
          if (!this.physics.hasLOS(o.eyePos, new THREE.Vector3(enemy.pos.x, enemy.pos.y + 1.3, enemy.pos.z))) continue
          enemy.lastSeenBy[team] = this.time
          break
        }
      }
    }
  }

  // ------------------------------------------------------------------- hud

  private syncHud() {
    const st = this.hud.state
    st.phase = this.phase
    st.locked = this.pointerLocked
    st.auto = this.autoMode
    st.round = this.round
    st.pistolRound = this.round === 1
    st.ctScore = this.ctScore
    st.tScore = this.tScore
    st.playerTeam = this.playerTeam
    st.loadout = this.playerLoadout
    st.winner = this.winner
    st.winReason = this.winReason
    st.matchWinner = this.matchWinner
    st.freezeLeft = this.phase === 'freeze' ? Math.max(0, this.phaseEndsAt - this.time) : 0
    st.timeLeft = this.phase === 'live' ? Math.max(0, this.roundEndsAt - this.time) : ROUND_TIME
    st.bombPlanted = this.bomb.plantedPos !== null && !this.bomb.exploded
    st.bombTimeLeft = st.bombPlanted ? Math.max(0, this.bomb.plantedAt + BOMB_FUSE - this.time) : null

    const me = this.soldiers[this.controlledId]
    const v = this.viewed ?? me
    if (v) {
      const wpn = v.weapon
      st.me = {
        name: v.name, team: v.team, hp: Math.max(0, Math.ceil(v.hp)), armor: Math.ceil(v.armor),
        alive: v.alive, weaponName: wpn.def.name, weaponId: wpn.def.id,
        mag: wpn.mag, reserve: wpn.reserve, reloading: wpn.reloading,
        scoped: v.scoped, hasBomb: v.hasBomb,
        spreadPx: 5 + (wpn.bloom + wpn.def.spreadBase) * 900 + Math.hypot(v.vel.x, v.vel.z) * 1.4,
      }
      st.channel = v.channel ? {
        label: v.channel.kind === 'plant' ? '正在安放 C4…' : '正在拆除 C4…',
        progress: v.channel.t / v.channel.total,
      } : null

      // center hint
      st.centerHint = null
      if (v.alive && this.phase === 'live' && !v.channel) {
        if (v.team === 'T' && v.hasBomb && this.map.plantSiteAt(v.pos.x, v.pos.z)) st.centerHint = '按住 E 安放 C4'
        else if (v.team === 'CT' && this.bomb.plantedPos && Math.hypot(this.bomb.plantedPos.x - v.pos.x, this.bomb.plantedPos.z - v.pos.z) < 3) st.centerHint = '按住 E 拆除 C4'
      }
    }
    st.spectating = me && v && v.id !== me.id
      ? { name: v.name, isSelf: false }
      : (me && !me.alive ? { name: me.name, isSelf: true } : null)

    // prune old killfeed
    st.killfeed = st.killfeed.filter(k => this.time - k.t < 6.5)
    this.hud.bump()
  }

  // Minimap data access (imperative canvas drawing from React)
  minimapInfo() {
    return {
      map: this.map,
      soldiers: this.soldiers,
      viewedId: this.viewedId,
      playerTeam: this.playerTeam,
      time: this.time,
      bomb: this.bomb,
    }
  }
}

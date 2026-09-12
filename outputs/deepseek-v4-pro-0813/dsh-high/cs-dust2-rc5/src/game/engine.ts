import * as THREE from 'three'
import {
  WEAPONS,
  HITBOX_MULT,
  MAX_HEALTH,
  MAX_ARMOR,
  ARMOR_ABSORB,
  PLAYER_RADIUS,
  EYE_HEIGHT,
  GRAVITY,
  JUMP_SPEED,
  STEP_UP,
  BASE_MOVE_SPEED,
  C4_PLANT_TIME,
  C4_DEFUSE_TIME,
  C4_TIMER,
  C4_RADIUS,
  ROUND_FREEZE_TIME,
  ROUND_END_DELAY,
  AI_VIEW_DISTANCE,
  AI_FOV,
  AI_REPATH_INTERVAL,
} from './config'
import type { WeaponDef } from './config'
import {
  ALL_BLOCKERS,
  OCCLUDERS,
  MOVEMENT_BLOCKERS,
  CATWALK_SUPPORT,
  RAMP_WEST,
  RAMP_EAST,
  ZONES,
  T_SPAWN_POINTS,
  CT_SPAWN_POINTS,
  restingHeight,
  boxMinMax,
  insideRect,
  type Box,
} from './mapData'
import { NavGrid } from './nav'
import { AudioEngine } from './audio'
import { buildCharacter, disposeCharacter, type CharacterRig } from './character'
import { buildViewModel, type ViewModel } from './weapons'
import { hudState, notifyHud } from './store'
import type { HitboxPart, Player, Team, WeaponId, WeaponSlot, KillEvent } from './types'

// ---------------------------------------------------------------------------
// math helpers
// ---------------------------------------------------------------------------

interface RayBoxResult {
  t: number
}

function rayBox(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, b: Box): number {
  const m = boxMinMax(b)
  let tmin = -Infinity
  let tmax = Infinity
  const d = [dx, dy, dz]
  const o = [ox, oy, oz]
  const min = [m.minX, m.minY, m.minZ]
  const max = [m.maxX, m.maxY, m.maxZ]
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-9) {
      if (o[i] < min[i] || o[i] > max[i]) return Infinity
    } else {
      let t1 = (min[i] - o[i]) / d[i]
      let t2 = (max[i] - o[i]) / d[i]
      if (t1 > t2) [t1, t2] = [t2, t1]
      tmin = Math.max(tmin, t1)
      tmax = Math.min(tmax, t2)
      if (tmin > tmax) return Infinity
    }
  }
  if (tmax < 0) return Infinity
  return tmin >= 0 ? tmin : 0
}

function segmentBox(
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  box: Box,
): boolean {
  const dx = bx - ax
  const dy = by - ay
  const dz = bz - az
  const len = Math.hypot(dx, dy, dz)
  if (len < 1e-9) return false
  const t = rayBox(ax, ay, az, dx / len, dy / len, dz / len, box)
  return t <= len
}

function forwardFromYawPitch(yaw: number, pitch: number) {
  return {
    x: -Math.sin(yaw) * Math.cos(pitch),
    y: Math.sin(pitch),
    z: -Math.cos(yaw) * Math.cos(pitch),
  }
}

function yawFromDir(dx: number, dz: number): number {
  return Math.atan2(-dx, -dz)
}

// ---------------------------------------------------------------------------
// hitbox definitions (local space, yaw=0 facing +Z, origin at feet)
// ---------------------------------------------------------------------------

interface HitboxDef {
  part: HitboxPart
  cx: number
  cy: number
  cz: number
  hx: number
  hy: number
  hz: number
}

const HITBOXES: HitboxDef[] = [
  { part: 'head', cx: 0, cy: 1.62, cz: 0, hx: 0.14, hy: 0.14, hz: 0.14 },
  { part: 'chest', cx: 0, cy: 1.27, cz: 0, hx: 0.26, hy: 0.21, hz: 0.15 },
  { part: 'abdomen', cx: 0, cy: 0.95, cz: 0, hx: 0.26, hy: 0.2, hz: 0.15 },
  { part: 'armL', cx: -0.3, cy: 1.22, cz: 0.2, hx: 0.11, hy: 0.26, hz: 0.13 },
  { part: 'armR', cx: 0.3, cy: 1.22, cz: 0.2, hx: 0.11, hy: 0.26, hz: 0.13 },
  { part: 'legL', cx: -0.13, cy: 0.4, cz: 0, hx: 0.1, hy: 0.4, hz: 0.1 },
  { part: 'legR', cx: 0.13, cy: 0.4, cz: 0, hx: 0.1, hy: 0.4, hz: 0.1 },
]

interface WorldHitbox {
  part: HitboxPart
  minX: number
  maxX: number
  minY: number
  maxY: number
  minZ: number
  maxZ: number
}

// ---------------------------------------------------------------------------
// engine
// ---------------------------------------------------------------------------

interface Collider {
  cx: number
  cz: number
  halfX: number
  halfZ: number
  maxY: number
}

interface Visual {
  rig: CharacterRig
  alive: boolean
}

export interface GameCallbacks {
  onPointerLockChange?: (locked: boolean) => void
}

export class Game {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private clock = new THREE.Clock()
  private nav = new NavGrid()
  private audio = new AudioEngine()
  private colliders: Collider[] = []
  private occluders: Box[] = OCCLUDERS

  private players: Player[] = []
  private visuals = new Map<number, Visual>()
  private viewmodels = new Map<WeaponId, ViewModel>()
  private vmGroup = new THREE.Group()
  private currentVm: ViewModel | null = null
  private vmKick = 0
  private flashTimer = 0

  private bombGroup = new THREE.Group()
  private bombLight: THREE.PointLight
  private bombDroppedPos: { x: number; z: number } | null = null
  private bombPlantedPos: { x: number; z: number } | null = null
  private bombCarrierId: number | null = null
  private bombTimer = C4_TIMER
  private bombDefusing = false

  private round = 1
  private roundPhase: 'freeze' | 'live' | 'over' = 'freeze'
  private freezeTimer = ROUND_FREEZE_TIME
  private endTimer = 0
  private scoreT = 0
  private scoreCT = 0
  private tSite: 'A' | 'B' = 'A'
  private banner: string | null = null

  private killfeed: KillEvent[] = []
  private killId = 0

  private localPlayerId = 0
  private spectateIndex = -1
  private playerTeam: Team = 'CT'

  private input = {
    forward: 0,
    right: 0,
    jump: false,
    jumpQueued: false,
    fire: false,
    fireQueued: false,
    scope: false,
    reloadQueued: false,
    plantQueued: false,
    cycleQueued: false,
    takeControlQueued: false,
  }

  private raf = 0
  private disposed = false
  private started = false
  private lastSeen = new Map<number, number>()
  private container: HTMLElement
  private resizeHandler!: () => void
  private keydownHandler!: (e: KeyboardEvent) => void
  private keyupHandler!: (e: KeyboardEvent) => void
  private mouseMoveHandler!: (e: MouseEvent) => void
  private mouseDownHandler!: (e: MouseEvent) => void
  private mouseUpHandler!: (e: MouseEvent) => void
  private lockChangeHandler!: () => void

  constructor(container: HTMLElement) {
    this.container = container
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x9fc4e8)
    this.scene.fog = new THREE.Fog(0x9fc4e8, 60, 140)

    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.05, 300)
    this.camera.rotation.order = 'YXZ'
    this.camera.add(this.vmGroup)
    this.scene.add(this.camera)

    this.bombLight = new THREE.PointLight(0xff3333, 0, 8)
    this.scene.add(this.bombLight)

    this.buildLights()
    this.buildGround()
    this.buildMap()
    this.buildBomb()
    this.buildColliders()

    this.setupInput(container)

    this.resizeHandler = () => this.onResize()
    window.addEventListener('resize', this.resizeHandler)

    // expose for debugging / headless testing
    ;(window as unknown as { __game?: Game }).__game = this

    this.raf = requestAnimationFrame(() => this.loop())
  }

  // ------------------------------------------------------------- setup ----

  private buildLights() {
    const hemi = new THREE.HemisphereLight(0xbfd8ff, 0xcbb084, 0.9)
    this.scene.add(hemi)
    const sun = new THREE.DirectionalLight(0xfff2d8, 1.4)
    sun.position.set(40, 60, 25)
    this.scene.add(sun)
    const fill = new THREE.DirectionalLight(0xbfcfe0, 0.4)
    fill.position.set(-30, 20, -20)
    this.scene.add(fill)
  }

  private buildGround() {
    const geo = new THREE.PlaneGeometry(120, 120)
    const mat = new THREE.MeshStandardMaterial({ color: 0xc3a36a, roughness: 0.95 })
    const ground = new THREE.Mesh(geo, mat)
    ground.rotation.x = -Math.PI / 2
    ground.position.set(0, 0, 0)
    ground.receiveShadow = true
    this.scene.add(ground)
  }

  private wallMat = new THREE.MeshStandardMaterial({ color: 0xd6b98a, roughness: 0.9 })
  private crateMat = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.9 })
  private platformMat = new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: 0.8 })
  private doorMat = new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 0.8 })

  private addBox(b: Box, mat: THREE.Material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.sx, b.sy, b.sz), mat)
    mesh.position.set(b.cx, b.cy, b.cz)
    mesh.castShadow = true
    mesh.receiveShadow = true
    this.scene.add(mesh)
    return mesh
  }

  private buildMap() {
    // walls (skip crates: render separately with wood)
    for (const b of MOVEMENT_BLOCKERS) {
      const isCrate = b.sy <= 1.6 && b.sx <= 2.1
      this.addBox(b, isCrate ? this.crateMat : this.wallMat)
    }
    // catwalk support platform
    this.addBox(CATWALK_SUPPORT, this.platformMat)
    // ramps (visual)
    this.buildRamp(RAMP_WEST)
    this.buildRamp(RAMP_EAST)
    // mid double doors visual (two dark leaves, gap in middle)
    this.addBox({ cx: -2.5, cy: 2, cz: 8, sx: 3, sy: 4, sz: 0.12 }, this.doorMat)
    this.addBox({ cx: 2.5, cy: 2, cz: 8, sx: 3, sy: 4, sz: 0.12 }, this.doorMat)
    // site markers
    this.addSiteMarker(-15, 15, 0xffb020, 'A')
    this.addSiteMarker(20, 14, 0xffb020, 'B')
  }

  private buildRamp(r: { minX: number; maxX: number; minZ: number; maxZ: number; h0: number; h1: number }) {
    const w = r.maxX - r.minX
    const d = r.maxZ - r.minZ
    const geo = new THREE.BoxGeometry(w, 0.2, d)
    const mesh = new THREE.Mesh(geo, this.platformMat)
    const midX = (r.minX + r.maxX) / 2
    const midZ = (r.minZ + r.maxZ) / 2
    mesh.position.set(midX, (r.h0 + r.h1) / 2, midZ)
    mesh.rotation.x = Math.atan2(-(r.h1 - r.h0), d)
    mesh.castShadow = true
    mesh.receiveShadow = true
    this.scene.add(mesh)
  }

  private addSiteMarker(x: number, z: number, color: number, label: string) {
    const geo = new THREE.CircleGeometry(1.6, 32)
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.25, depthWrite: false })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(x, 0.02, z)
    this.scene.add(mesh)
    // simple letter via a flat box is omitted; the minimap labels sites
    void label
  }

  private buildBomb() {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.22, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.5 }),
    )
    const keypad = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.1, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x1a5c1a, roughness: 0.5 }),
    )
    keypad.position.set(0, 0.1, 0.1)
    const wire = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.04, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xc22, roughness: 0.6 }),
    )
    wire.position.set(0, 0.02, -0.15)
    this.bombGroup.add(body, keypad, wire)
    this.bombGroup.visible = false
    this.scene.add(this.bombGroup)
  }

  private buildColliders() {
    for (const b of ALL_BLOCKERS) {
      this.colliders.push({
        cx: b.cx,
        cz: b.cz,
        halfX: b.sx / 2 + PLAYER_RADIUS,
        halfZ: b.sz / 2 + PLAYER_RADIUS,
        maxY: b.cy + b.sy / 2,
      })
    }
  }

  // ------------------------------------------------------------- input ----

  private setupInput(container: HTMLElement) {
    const canvas = this.renderer.domElement

    this.keydownHandler = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.input.forward = 1; break
        case 'KeyS': case 'ArrowDown': this.input.forward = -1; break
        case 'KeyA': case 'ArrowLeft': this.input.right = -1; break
        case 'KeyD': case 'ArrowRight': this.input.right = 1; break
        case 'Space':
          if (!e.repeat) this.input.jumpQueued = true
          this.input.jump = true
          break
        case 'KeyR': this.input.reloadQueued = true; break
        case 'Digit1': this.switchSlot('primary'); break
        case 'Digit2': this.switchSlot('secondary'); break
        case 'Digit3': this.switchSlot('melee'); break
        case 'Digit4': this.cyclePrimary(); break
        case 'KeyE':
          if (this.isLocalDead()) this.input.cycleQueued = true
          else this.input.plantQueued = true
          break
        case 'KeyF':
          if (this.isLocalDead()) this.input.takeControlQueued = true
          break
        case 'KeyM': this.audio.toggleMute(); break
      }
    }
    this.keyupHandler = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': if (this.input.forward === 1) this.input.forward = 0; break
        case 'KeyS': case 'ArrowDown': if (this.input.forward === -1) this.input.forward = 0; break
        case 'KeyA': case 'ArrowLeft': if (this.input.right === -1) this.input.right = 0; break
        case 'KeyD': case 'ArrowRight': if (this.input.right === 1) this.input.right = 0; break
        case 'Space': this.input.jump = false; break
      }
    }
    this.mouseMoveHandler = (e: MouseEvent) => {
      if (!this.started || document.pointerLockElement !== canvas) return
      const p = this.getLocalPlayer()
      if (!p || !p.alive) return
      const sens = 0.0022
      p.yaw -= e.movementX * sens
      p.pitch -= e.movementY * sens
      p.pitch = Math.max(-1.55, Math.min(1.55, p.pitch))
    }
    this.mouseDownHandler = (e: MouseEvent) => {
      if (!this.started) return
      this.audio.ensure()
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock()
        return
      }
      if (e.button === 0) {
        this.input.fire = true
        this.input.fireQueued = true
      } else if (e.button === 2) {
        this.input.scope = true
      }
    }
    this.mouseUpHandler = (e: MouseEvent) => {
      if (e.button === 0) this.input.fire = false
      else if (e.button === 2) this.input.scope = false
    }
    this.lockChangeHandler = () => {
      if (document.pointerLockElement !== canvas) {
        this.input.fire = false
        this.input.scope = false
      }
    }
    canvas.addEventListener('contextmenu', (e) => e.preventDefault())
    canvas.addEventListener('click', () => {
      this.audio.ensure()
      if (this.started && document.pointerLockElement !== canvas) canvas.requestPointerLock()
    })
    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('keyup', this.keyupHandler)
    window.addEventListener('mousemove', this.mouseMoveHandler)
    window.addEventListener('mousedown', this.mouseDownHandler)
    window.addEventListener('mouseup', this.mouseUpHandler)
    document.addEventListener('pointerlockchange', this.lockChangeHandler)
  }

  // ------------------------------------------------------------- public ----

  start(team: Team) {
    if (this.started) return
    this.playerTeam = team
    this.started = true
    this.audio.ensure()
    this.resetRound(true)
    this.renderer.domElement.requestPointerLock()
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.resizeHandler)
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('keyup', this.keyupHandler)
    window.removeEventListener('mousemove', this.mouseMoveHandler)
    window.removeEventListener('mousedown', this.mouseDownHandler)
    window.removeEventListener('mouseup', this.mouseUpHandler)
    document.removeEventListener('pointerlockchange', this.lockChangeHandler)
    for (const [, v] of this.visuals) disposeCharacter(v.rig)
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.geometry) mesh.geometry.dispose()
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else if (mat) mat.dispose()
    })
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }

  // ------------------------------------------------------------- round ----

  private resetRound(first = false) {
    this.roundPhase = 'freeze'
    this.freezeTimer = ROUND_FREEZE_TIME
    this.endTimer = 0
    this.banner = null
    this.bombPlantedPos = null
    this.bombDroppedPos = null
    this.bombTimer = C4_TIMER
    this.bombDefusing = false
    this.bombGroup.visible = false
    this.killfeed = []
    this.input.forward = 0
    this.input.right = 0
    this.input.fire = false
    this.input.fireQueued = false
    this.input.scope = false
    this.input.jump = false
    this.input.jumpQueued = false
    this.input.plantQueued = false
    this.input.cycleQueued = false
    this.input.takeControlQueued = false

    const pistol = this.round === 1
    hudState.pistolRound = pistol
    hudState.round = this.round

    if (first) {
      this.createPlayers()
    }

    // assign teams: 0..4 = player team, 5..9 = enemy team
    const enemy: Team = this.playerTeam === 'CT' ? 'T' : 'CT'
    const spawns = this.playerTeam === 'CT' ? CT_SPAWN_POINTS : T_SPAWN_POINTS
    const enemySpawns = enemy === 'CT' ? CT_SPAWN_POINTS : T_SPAWN_POINTS

    for (const p of this.players) {
      const idx = p.id
      const team = idx < 5 ? this.playerTeam : enemy
      const spawnList = team === this.playerTeam ? spawns : enemySpawns
      const spawnIdx = idx < 5 ? idx : idx - 5
      const [sx, sz] = spawnList[spawnIdx % spawnList.length]
      p.team = team
      p.isLocal = p.id === 0
      p.alive = true
      p.health = MAX_HEALTH
      p.armor = pistol ? 0 : MAX_ARMOR
      p.hasHelmet = !pistol
      p.x = sx + (Math.random() - 0.5)
      p.z = sz + (Math.random() - 0.5)
      p.y = restingHeight(p.x, p.z)
      p.vy = 0
      p.grounded = true
      p.reloading = false
      p.reloadTimer = 0
      p.bloom = 0
      p.fireCooldown = 0
      p.carryingC4 = false
      p.defusing = false
      p.kills = 0
      p.deaths = 0
      p.footTimer = 0
      // face map centre
      p.yaw = yawFromDir(-p.x, -p.z)
      p.pitch = 0
      this.assignLoadout(p, pistol)
      this.resetAI(p)
      const v = this.visuals.get(p.id)
      if (v) {
        v.alive = true
        this.syncVisual(p, v)
      }
    }

    // hand C4 to a random T bot (or the player if player is T and it's their turn)
    const tPlayers = this.players.filter((p) => p.team === 'T')
    if (tPlayers.length > 0) {
      const carrier = tPlayers[Math.floor(Math.random() * tPlayers.length)]
      carrier.carryingC4 = true
      this.bombCarrierId = carrier.id
    }

    // choose T bombsite
    this.tSite = Math.random() < 0.5 ? 'A' : 'B'
    for (const p of this.players) {
      if (p.team === 'T') p.ai.bombsite = this.tSite
    }

    this.localPlayerId = 0
    this.spectateIndex = -1
    this.syncViewModel()
  }

  private createPlayers() {
    const enemy: Team = this.playerTeam === 'CT' ? 'T' : 'CT'
    for (let i = 0; i < 10; i++) {
      const team: Team = i < 5 ? this.playerTeam : enemy
      const isLocal = i === 0
      const name = isLocal ? '你' : `${team === 'CT' ? 'CT' : 'T'}-AI${i < 5 ? i : i - 4}`
      const p: Player = {
        id: i,
        name,
        team,
        isLocal,
        alive: true,
        health: MAX_HEALTH,
        armor: 0,
        hasHelmet: false,
        x: 0, y: 0, z: 0,
        yaw: 0, pitch: 0, vy: 0, grounded: true,
        weapons: {
          primary: { id: null, mag: 0, reserve: 0 },
          secondary: { id: 'usp', mag: 12, reserve: 24 },
          melee: { id: 'knife', mag: 1, reserve: 0 },
        },
        currentSlot: 'secondary',
        reloading: false,
        reloadTimer: 0,
        bloom: 0,
        fireCooldown: 0,
        carryingC4: false,
        defusing: false,
        kills: 0,
        deaths: 0,
        moving: false,
        walkCycle: 0,
        footTimer: 0,
        ai: {
          mode: 'idle', targetId: null, lastKnown: null, path: [], pathIndex: 0,
          repathTimer: 0, stuckTimer: 0, lastX: 0, lastZ: 0, objective: null, holdPos: null,
          reaction: 0.2, shootTimer: 0, strafeDir: 0, strafeTimer: 0, aimPitch: 0,
          bombsite: 'A', homeSite: 'MID', actionProgress: 0,
        },
      }
      this.players.push(p)

      const rig = buildCharacter(team)
      this.scene.add(rig.group)
      this.visuals.set(i, { rig, alive: true })
      if (isLocal) rig.group.visible = false
    }
  }

  private assignLoadout(p: Player, pistol: boolean) {
    if (pistol) {
      p.weapons.primary = { id: null, mag: 0, reserve: 0 }
      const secondary: WeaponId = p.team === 'T' ? 'glock' : 'usp'
      const def = WEAPONS[secondary]
      p.weapons.secondary = { id: secondary, mag: def.magSize, reserve: def.reserve }
      p.weapons.melee = { id: 'knife', mag: 1, reserve: 0 }
      p.currentSlot = 'secondary'
    } else {
      const primary: WeaponId = p.team === 'T' ? 'ak47' : 'm4a4'
      // one AI per team gets an AWP for variety
      const awpRole = (p.id === 3 && p.team === 'T') || (p.id === 6 && p.team === 'CT')
      const pid: WeaponId = awpRole ? 'awp' : primary
      const d = WEAPONS[pid]
      p.weapons.primary = { id: pid, mag: d.magSize, reserve: d.reserve }
      const secondary: WeaponId = p.team === 'T' ? 'glock' : 'usp'
      const sd = WEAPONS[secondary]
      p.weapons.secondary = { id: secondary, mag: sd.magSize, reserve: sd.reserve }
      p.weapons.melee = { id: 'knife', mag: 1, reserve: 0 }
      p.currentSlot = 'primary'
    }
  }

  private resetAI(p: Player) {
    p.ai.mode = 'idle'
    p.ai.targetId = null
    p.ai.lastKnown = null
    p.ai.path = []
    p.ai.pathIndex = 0
    p.ai.objective = null
    p.ai.repathTimer = 0
    p.ai.actionProgress = 0
    p.ai.reaction = 0.15 + Math.random() * 0.3
    p.ai.homeSite = p.team === 'CT' ? (p.id % 5 < 2 ? 'A' : p.id % 5 < 4 ? 'B' : 'MID') : 'MID'
  }

  // ------------------------------------------------------------- helpers ---

  private getLocalPlayer(): Player | undefined {
    return this.players.find((p) => p.id === this.localPlayerId)
  }

  private isLocalDead(): boolean {
    const p = this.getLocalPlayer()
    return !p || !p.alive
  }

  private getSpectateTarget(): Player | undefined {
    const mates = this.players.filter((p) => p.team === this.playerTeam && p.alive)
    if (mates.length === 0) return undefined
    if (this.spectateIndex < 0) this.spectateIndex = 0
    return mates[this.spectateIndex % mates.length]
  }

  private currentWeapon(p: Player): SlotWeaponLike {
    return p.weapons[p.currentSlot]
  }

  private switchSlot(slot: WeaponSlot) {
    const p = this.getLocalPlayer()
    if (!p || !p.alive) return
    if (p.currentSlot === slot) return
    if (slot !== 'melee' && !p.weapons[slot].id) return
    p.reloading = false
    p.reloadTimer = 0
    p.currentSlot = slot
    if (slot === 'melee') this.input.scope = false
    this.syncViewModel()
  }

  private cyclePrimary() {
    const p = this.getLocalPlayer()
    if (!p || !p.alive) return
    const cur = p.weapons.primary.id
    const rifle: WeaponId = p.team === 'T' ? 'ak47' : 'm4a4'
    const next: WeaponId | null = cur === 'awp' ? rifle : 'awp'
    p.weapons.primary.id = next
    if (next) {
      const d = WEAPONS[next]
      p.weapons.primary.mag = d.magSize
      p.weapons.primary.reserve = d.reserve
    }
    if (p.currentSlot === 'primary') this.syncViewModel()
  }

  private syncViewModel() {
    const p = this.getLocalPlayer()
    if (!p) return
    const slot = p.currentSlot
    const w = p.weapons[slot]
    if (!w.id) return
    if (this.currentVm) {
      this.vmGroup.remove(this.currentVm.group)
      this.currentVm = null
    }
    let vm = this.viewmodels.get(w.id)
    if (!vm) {
      vm = buildViewModel(w.id)
      this.viewmodels.set(w.id, vm)
    }
    this.currentVm = vm
    this.vmGroup.add(vm.group)
    this.vmGroup.position.set(0.28, -0.24, -0.5)
    this.vmGroup.rotation.set(0, 0, 0)
  }

  private syncVisual(p: Player, v: Visual) {
    const rig = v.rig
    const fx = -Math.sin(p.yaw)
    const fz = -Math.cos(p.yaw)
    rig.group.position.set(p.x, p.y, p.z)
    rig.group.rotation.y = Math.atan2(fx, fz)
    if (p.carryingC4) {
      rig.group.scale.set(1, 1, 1)
    }
  }

  // ------------------------------------------------------------- loop -----

  private loop() {
    if (this.disposed) return
    this.raf = requestAnimationFrame(() => this.loop())
    const dt = Math.min(this.clock.getDelta(), 0.05)
    if (this.started) this.update(dt)
    this.render()
  }

  private update(dt: number) {
    // round timer
    if (this.roundPhase === 'freeze') {
      this.freezeTimer -= dt
      if (this.freezeTimer <= 0) this.roundPhase = 'live'
    } else if (this.roundPhase === 'over') {
      this.endTimer -= dt
      if (this.endTimer <= 0) {
        this.round++
        this.resetRound()
      }
    }

    const canAct = this.roundPhase === 'live'

    // update each player
    for (const p of this.players) {
      if (!p.alive) continue
      this.updateBloom(p, dt)
      if (p.reloading) {
        p.reloadTimer -= dt
        if (p.reloadTimer <= 0) this.finishReload(p)
      }
      if (p.fireCooldown > 0) p.fireCooldown -= dt
      if (p.isLocal) {
        if (canAct) this.updateLocal(p, dt)
      } else {
        this.updateAI(p, dt)
      }
    }

    // bomb logic
    if (this.bombPlantedPos && this.roundPhase === 'live') {
      this.bombTimer -= dt
      if (this.bombTimer <= 0) {
        this.explodeBomb()
      }
    }

    // camera / spectate
    this.updateCamera(dt)

    // viewmodel animation
    this.vmKick = Math.max(0, this.vmKick - dt * 6)
    this.flashTimer = Math.max(0, this.flashTimer - dt)
    if (this.currentVm) {
      const kick = this.vmKick
      this.vmGroup.position.z = -0.5 - kick * 0.25
      this.vmGroup.position.y = -0.24 + kick * 0.12
      this.vmGroup.rotation.x = kick * 0.35
      this.currentVm.flash.visible = this.flashTimer > 0
      const scoped = this.getLocalPlayer()?.alive && this.input.scope && this.isScoped()
      this.vmGroup.visible = !scoped
    }

    this.updateBombVisual()
    this.checkRoundEnd()
    this.updateHud()
  }

  private updateBloom(p: Player, dt: number) {
    const w = this.currentWeaponDef(p)
    if (!w) return
    p.bloom = Math.max(0, p.bloom - dt * w.bloomMax * 2)
  }

  private currentWeaponDef(p: Player): WeaponDef | null {
    const w = p.weapons[p.currentSlot]
    if (!w.id) return null
    return WEAPONS[w.id]
  }

  private isScoped(): boolean {
    const p = this.getLocalPlayer()
    if (!p) return false
    const w = this.currentWeaponDef(p)
    return !!w?.zoomFov
  }

  private finishReload(p: Player) {
    const w = p.weapons[p.currentSlot]
    const def = WEAPONS[w.id as WeaponId]
    if (!def) return
    const need = def.magSize - w.mag
    const take = Math.min(need, w.reserve)
    w.mag += take
    w.reserve -= take
    p.reloading = false
    p.reloadTimer = 0
  }

  // ------------------------------------------------------------- local ----

  private updateLocal(p: Player, dt: number) {
    // plant / defuse
    const planting = this.input.plantQueued && p.carryingC4 && !this.bombPlantedPos && this.inSite(p)
    const defusing = this.input.plantQueued && p.team === 'CT' && !!this.bombPlantedPos && this.nearPlanted(p)
    this.input.plantQueued = false

    if (planting) {
      p.ai.actionProgress += dt
      this.audio.playC4Plant()
      if (p.ai.actionProgress >= C4_PLANT_TIME) {
        this.plantBomb(p)
      }
    } else if (defusing) {
      p.ai.actionProgress += dt
      p.defusing = true
      this.bombDefusing = true
      this.audio.playC4Defuse()
      if (p.ai.actionProgress >= C4_DEFUSE_TIME) {
        this.defuseBomb()
      }
    } else {
      p.ai.actionProgress = 0
      p.defusing = false
      if (!this.players.some((q) => q.team === 'CT' && q.alive && q.defusing)) this.bombDefusing = false
    }

    // reload
    if (this.input.reloadQueued) {
      this.input.reloadQueued = false
      this.startReload(p)
    }

    // movement
    const w = this.currentWeaponDef(p)
    const speed = BASE_MOVE_SPEED * (w ? w.moveSpeed : 1)
    let dx = 0
    let dz = 0
    const fx = -Math.sin(p.yaw)
    const fz = -Math.cos(p.yaw)
    const rx = Math.cos(p.yaw)
    const rz = -Math.sin(p.yaw)
    dx += fx * this.input.forward
    dz += fz * this.input.forward
    dx += rx * this.input.right
    dz += rz * this.input.right
    const len = Math.hypot(dx, dz)
    p.moving = len > 0.01
    if (len > 0.01) {
      dx = (dx / len) * speed * dt
      dz = (dz / len) * speed * dt
      this.movePlayer(p, dx, dz, dt)
    } else {
      this.movePlayer(p, 0, 0, dt)
    }
    if (this.input.jumpQueued && p.grounded) {
      p.vy = JUMP_SPEED
      p.grounded = false
    }
    this.input.jumpQueued = false

    this.stepSound(p, dt)

    // fire
    this.handleFire(p)

    // scope
    if (this.input.scope && this.isScoped()) {
      if (!hudState.scope) this.audio.playScope()
      hudState.scope = true
    } else {
      hudState.scope = false
    }
  }

  private startReload(p: Player) {
    const w = p.weapons[p.currentSlot]
    const def = w.id ? WEAPONS[w.id] : null
    if (!def || w.id === 'knife') return
    if (p.reloading || w.mag >= def.magSize || w.reserve <= 0) return
    p.reloading = true
    p.reloadTimer = def.reloadTime
    if (p.isLocal || this.nearListener(p)) this.audio.playReload()
  }

  private nearListener(p: Player): boolean {
    const local = this.getLocalPlayer()
    const viewer = local && local.alive ? local : this.getSpectateTarget()
    if (!viewer) return false
    return Math.hypot(p.x - viewer.x, p.z - viewer.z) < 30
  }

  private stepSound(p: Player, dt: number) {
    if (!p.moving || !p.grounded) {
      p.footTimer = 0
      return
    }
    p.footTimer -= dt
    if (p.footTimer <= 0) {
      this.audio.playFootstep()
      p.footTimer = 0.4
    }
  }

  private handleFire(p: Player) {
    const w = this.currentWeaponDef(p)
    if (!w) return
    if (w.auto) {
      if (this.input.fire) this.tryFire(p)
    } else {
      if (this.input.fireQueued) {
        this.input.fireQueued = false
        this.tryFire(p)
      }
    }
  }

  private tryFire(p: Player) {
    const w = this.currentWeaponDef(p)
    if (!w) return
    const slot = p.weapons[p.currentSlot]
    if (p.fireCooldown > 0 || p.reloading) return
    if (w.id === 'knife') {
      this.knifeAttack(p)
    } else {
      if (slot.mag <= 0) {
        this.startReload(p)
        return
      }
      slot.mag--
      p.fireCooldown = 60 / w.fireRate
      p.bloom = Math.min(w.bloomMax, p.bloom + w.bloomPerShot)
      // recoil
      p.pitch += w.recoilPitch * (0.7 + Math.random() * 0.6)
      p.yaw += (Math.random() - 0.5) * w.recoilYaw * 2
      this.vmKick = Math.min(1, this.vmKick + 0.5 + w.recoilPitch * 20)
      this.flashTimer = 0.05
      this.audio.playShoot(w.sound)

      const origin = { x: p.x, y: p.y + EYE_HEIGHT, z: p.z }
      // local player fires exactly along the camera (crosshair) direction
      const camDir = new THREE.Vector3()
      this.camera.getWorldDirection(camDir)
      const fwd = { x: camDir.x, y: camDir.y, z: camDir.z }
      const moving = p.moving
      const spread = w.spread + p.bloom + (moving ? 0.018 : 0) + (p.grounded ? 0 : 0.03)
      const dir = this.spreadDir(fwd, spread)
      this.shootRay(p, origin, dir, w)
    }
    if (slot.mag <= 0 && w.id !== 'knife') this.startReload(p)
  }

  private spreadDir(fwd: { x: number; y: number; z: number }, spread: number) {
    if (spread <= 0) return fwd
    // random point in a disc perpendicular to forward, approximate via two random angles
    const rx = (Math.random() - 0.5) * 2 * spread
    const ry = (Math.random() - 0.5) * 2 * spread
    // build orthonormal basis
    const up = { x: 0, y: 1, z: 0 }
    let right = {
      x: fwd.y * up.z - fwd.z * up.y,
      y: fwd.z * up.x - fwd.x * up.z,
      z: fwd.x * up.y - fwd.y * up.x,
    }
    const rl = Math.hypot(right.x, right.y, right.z)
    if (rl < 1e-6) right = { x: 1, y: 0, z: 0 }
    else right = { x: right.x / rl, y: right.y / rl, z: right.z / rl }
    const up2 = {
      x: right.y * fwd.z - right.z * fwd.y,
      y: right.z * fwd.x - right.x * fwd.z,
      z: right.x * fwd.y - right.y * fwd.x,
    }
    return {
      x: fwd.x + right.x * rx + up2.x * ry,
      y: fwd.y + right.y * rx + up2.y * ry,
      z: fwd.z + right.z * rx + up2.z * ry,
    }
  }

  private knifeAttack(p: Player) {
    const w = WEAPONS.knife
    p.fireCooldown = 60 / w.fireRate
    this.audio.playShoot('melee')
    const fwd = forwardFromYawPitch(p.yaw, p.pitch)
    for (const q of this.players) {
      if (q.id === p.id || !q.alive || q.team === p.team) continue
      const d = {
        x: q.x - p.x,
        y: (q.y + 1) - (p.y + EYE_HEIGHT),
        z: q.z - p.z,
      }
      const dist = Math.hypot(d.x, d.y, d.z)
      if (dist > w.range) continue
      const dot = (d.x * fwd.x + d.y * fwd.y + d.z * fwd.z) / (dist || 1)
      if (dot < 0.55) continue
      this.applyDamage(p, q, w.damage, 'chest', false)
    }
  }

  private shootRay(shooter: Player, origin: { x: number; y: number; z: number }, dir: { x: number; y: number; z: number }, w: WeaponDef) {
    const dlen = Math.hypot(dir.x, dir.y, dir.z) || 1
    const dx = dir.x / dlen
    const dy = dir.y / dlen
    const dz = dir.z / dlen

    let wallT = Infinity
    for (const b of this.occluders) {
      const t = rayBox(origin.x, origin.y, origin.z, dx, dy, dz, b)
      if (t < wallT) wallT = t
    }

    let bestT = Infinity
    let bestPlayer: Player | null = null
    let bestPart: HitboxPart = 'chest'

    for (const q of this.players) {
      if (q.id === shooter.id || !q.alive || q.team === shooter.team) continue
      const hitboxes = this.worldHitboxes(q)
      for (const hb of hitboxes) {
        const t = rayBox(origin.x, origin.y, origin.z, dx, dy, dz, {
          cx: (hb.minX + hb.maxX) / 2,
          cy: (hb.minY + hb.maxY) / 2,
          cz: (hb.minZ + hb.maxZ) / 2,
          sx: hb.maxX - hb.minX,
          sy: hb.maxY - hb.minY,
          sz: hb.maxZ - hb.minZ,
        })
        if (t < bestT) {
          bestT = t
          bestPlayer = q
          bestPart = hb.part
        }
      }
    }

    if (bestPlayer && bestT < wallT) {
      this.applyDamage(shooter, bestPlayer, w.damage, bestPart, true)
    } else if (wallT < Infinity) {
      // bullet impact spark
      const hx = origin.x + dx * wallT
      const hy = origin.y + dy * wallT
      const hz = origin.z + dz * wallT
      this.spawnImpact(hx, hy, hz)
    }
  }

  private worldHitboxes(p: Player): WorldHitbox[] {
    // match the mesh orientation: local +Z (forward) maps to (-sin yaw, -cos yaw)
    const ry = Math.atan2(-Math.sin(p.yaw), -Math.cos(p.yaw))
    const cos = Math.cos(ry)
    const sin = Math.sin(ry)
    const out: WorldHitbox[] = []
    for (const hb of HITBOXES) {
      const wx = hb.cx * cos + hb.cz * sin
      const wz = -hb.cx * sin + hb.cz * cos
      const cxx = p.x + wx
      const czz = p.z + wz
      const cyy = p.y + hb.cy
      out.push({
        part: hb.part,
        minX: cxx - hb.hx, maxX: cxx + hb.hx,
        minY: cyy - hb.hy, maxY: cyy + hb.hy,
        minZ: czz - hb.hz, maxZ: czz + hb.hz,
      })
    }
    return out
  }

  private applyDamage(shooter: Player, victim: Player, base: number, part: HitboxPart, fromRay: boolean) {
    let damage = base * HITBOX_MULT[part]
    const headshot = part === 'head'
    const armoredPart = headshot ? victim.hasHelmet : (part !== 'legL' && part !== 'legR')
    if (armoredPart && victim.armor > 0) {
      const absorbed = damage * ARMOR_ABSORB
      victim.armor = Math.max(0, victim.armor - absorbed)
      damage -= absorbed
    }
    victim.health -= damage
    victim.ai.lastKnown = { x: shooter.x, z: shooter.z }
    victim.ai.targetId = shooter.id

    if (shooter.isLocal) {
      this.audio.playHit(headshot)
    }

    this.spawnBlood(victim, headshot)

    if (victim.health <= 0) {
      this.killPlayer(shooter, victim, headshot)
    }
    void fromRay
  }

  private spawnImpact(x: number, y: number, z: number) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xfff2c0, transparent: true, opacity: 0.9, depthWrite: false }),
    )
    mesh.position.set(x, y, z)
    this.scene.add(mesh)
    setTimeout(() => this.scene.remove(mesh), 80)
  }

  private spawnBlood(victim: Player, headshot: boolean) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(headshot ? 0.08 : 0.05, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.8, depthWrite: false }),
    )
    mesh.position.set(victim.x, victim.y + (headshot ? 1.62 : 1.1), victim.z)
    this.scene.add(mesh)
    setTimeout(() => this.scene.remove(mesh), 120)
  }

  private killPlayer(shooter: Player, victim: Player, headshot: boolean) {
    victim.alive = false
    victim.health = 0
    victim.reloading = false
    victim.defusing = false
    shooter.kills++
    victim.deaths++
    const v = this.visuals.get(victim.id)
    if (v) {
      v.alive = false
      v.rig.group.visible = false
    }
    // drop C4
    if (victim.carryingC4) {
      victim.carryingC4 = false
      this.bombCarrierId = null
      this.bombDroppedPos = { x: victim.x, z: victim.z }
      this.bombPlantedPos = null
    }
    this.addKillfeed(shooter, victim, headshot)
    if (shooter.isLocal || victim.isLocal) {
      this.audio.playKill()
    }
    // if local player died, switch to spectate
    if (victim.isLocal) {
      this.spectateIndex = 0
    }
  }

  private addKillfeed(shooter: Player, victim: Player, headshot: boolean) {
    const w = this.currentWeaponDef(shooter)
    const ev: KillEvent = {
      id: this.killId++,
      attacker: shooter.name,
      attackerTeam: shooter.team,
      victim: victim.name,
      victimTeam: victim.team,
      weapon: w ? w.name : '?',
      headshot,
      time: performance.now(),
    }
    this.killfeed.unshift(ev)
    if (this.killfeed.length > 6) this.killfeed.pop()
  }

  // ------------------------------------------------------------- physics ----

  private collides(x: number, z: number, floor: number): boolean {
    for (const c of this.colliders) {
      if (c.maxY > floor + STEP_UP) {
        if (Math.abs(x - c.cx) < c.halfX && Math.abs(z - c.cz) < c.halfZ) return true
      }
    }
    return false
  }

  private movePlayer(p: Player, dx: number, dz: number, dt: number) {
    const floorNow = restingHeight(p.x, p.z)
    let nx = p.x + dx
    if (this.collides(nx, p.z, floorNow)) nx = p.x
    let nz = p.z + dz
    if (this.collides(p.x, nz, floorNow)) nz = p.z
    p.x = nx
    p.z = nz

    const g = restingHeight(p.x, p.z)
    if (p.y <= g + STEP_UP) {
      p.y = g
      p.vy = 0
      p.grounded = true
    } else {
      p.grounded = false
      p.vy -= GRAVITY * dt
      p.y += p.vy * dt
      const g2 = restingHeight(p.x, p.z)
      if (p.y <= g2) {
        p.y = g2
        p.vy = 0
        p.grounded = true
      }
    }
    if (p.moving && p.grounded) p.walkCycle += dt * 10
  }

  // ------------------------------------------------------------- AI --------

  private hasLOS(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): boolean {
    for (const b of this.occluders) {
      if (segmentBox(x1, y1, z1, x2, y2, z2, b)) return false
    }
    return true
  }

  private findVisibleEnemy(p: Player): Player | null {
    const ex = p.x
    const ey = p.y + EYE_HEIGHT
    const ez = p.z
    const fwd = forwardFromYawPitch(p.yaw, p.pitch)
    let best: Player | null = null
    let bestScore = Infinity
    for (const q of this.players) {
      if (q.id === p.id || !q.alive || q.team === p.team) continue
      const dx = q.x - ex
      const dy = (q.y + 1.2) - ey
      const dz = q.z - ez
      const dist = Math.hypot(dx, dy, dz)
      if (dist > AI_VIEW_DISTANCE) continue
      // FOV check (horizontal)
      const dot = (dx * fwd.x + dz * fwd.z) / (Math.hypot(dx, dz) || 1)
      if (Math.acos(Math.max(-1, Math.min(1, dot))) > AI_FOV && dist > 4) continue
      if (!this.hasLOS(ex, ey, ez, q.x, q.y + 1.2, q.z)) continue
      const score = dist
      if (score < bestScore) {
        bestScore = score
        best = q
      }
    }
    return best
  }

  private landmarkPoint(name: string): { x: number; z: number } {
    // cache common points as walkable
    switch (name) {
      case 'A_SITE': return { x: -15, z: 15 }
      case 'B_SITE': return { x: 20, z: 14 }
      case 'MID': return { x: 0, z: 2 }
      case 'CT_MID': return { x: 5, z: 13 }
      case 'CATWALK': return { x: 0, z: 21 }
      case 'A_LONG': return { x: -20, z: 4 }
      case 'B_TUNNELS': return { x: 23, z: 0 }
      case 'T_SPAWN': return { x: -6, z: -14 }
      case 'CT_SPAWN': return { x: 12, z: 0 }
      case 'MID_DOORS': return { x: 0, z: 8 }
      default: return { x: 0, z: 0 }
    }
  }

  private updateAI(p: Player, dt: number) {
    if (this.roundPhase !== 'live') {
      p.moving = false
      this.movePlayer(p, 0, 0, dt)
      return
    }
    // find enemy
    const enemy = this.findVisibleEnemy(p)
    if (enemy) {
      p.ai.targetId = enemy.id
      p.ai.lastKnown = { x: enemy.x, z: enemy.z }
      p.ai.repathTimer = 0
      p.ai.path = []
      this.combatAI(p, enemy, dt)
      return
    }

    if (p.ai.targetId != null) {
      // lost sight; check if last known reached recently
      const t = this.players.find((q) => q.id === p.ai.targetId)
      if (!t || !t.alive) p.ai.targetId = null
    }

    this.objectiveAI(p, dt)
  }

  private combatAI(p: Player, enemy: Player, dt: number) {
    p.ai.mode = 'combat'
    p.ai.reaction -= dt
    // aim at enemy (head with some probability)
    const aimHead = Math.random() < 0.45
    const tx = enemy.x + (Math.random() - 0.5) * 0.2
    const ty = enemy.y + (aimHead ? 1.55 : 1.15) + (Math.random() - 0.5) * 0.2
    const tz = enemy.z + (Math.random() - 0.5) * 0.2
    const ex = p.x
    const ey = p.y + EYE_HEIGHT
    const ez = p.z
    const dx = tx - ex
    const dy = ty - ey
    const dz = tz - ez
    const dist = Math.hypot(dx, dy, dz)
    const desiredYaw = yawFromDir(dx, dz)
    const desiredPitch = Math.atan2(dy, Math.hypot(dx, dz))
    // turn toward target (limited)
    p.yaw = this.turnTowards(p.yaw, desiredYaw, 7 * dt)
    p.pitch = this.turnTowards(p.pitch, desiredPitch, 6 * dt)

    // strafe a little
    p.ai.strafeTimer -= dt
    if (p.ai.strafeTimer <= 0) {
      p.ai.strafeTimer = 0.5 + Math.random() * 0.8
      p.ai.strafeDir = Math.random() < 0.5 ? -1 : 1
    }
    const w = this.currentWeaponDef(p)
    const speed = BASE_MOVE_SPEED * (w ? w.moveSpeed : 1) * 0.6
    const strafe = p.ai.strafeDir * speed * dt
    const rightX = Math.cos(p.yaw)
    const rightZ = -Math.sin(p.yaw)
    // move strafe, keep some distance
    if (dist > 8) {
      const fx = -Math.sin(p.yaw)
      const fz = -Math.cos(p.yaw)
      p.moving = true
      this.movePlayer(p, fx * speed * dt, fz * speed * dt, dt)
    } else if (dist < 3) {
      p.moving = true
      this.movePlayer(p, -rightX * speed * dt, -rightZ * speed * dt, dt)
    } else {
      p.moving = true
      this.movePlayer(p, rightX * strafe, rightZ * strafe, dt)
    }

    if (this.nearListener(p)) this.stepSound(p, dt)

    // shoot when aimed and in range
    const aimErr = Math.abs(this.angleDiff(p.yaw, desiredYaw)) + Math.abs(this.angleDiff(p.pitch, desiredPitch))
    if (p.ai.reaction <= 0 && aimErr < 0.06 && dist < 40) {
      this.aiFire(p, w, dist)
    }
  }

  private aiFire(p: Player, w: WeaponDef | null, dist: number) {
    if (!w) return
    const slot = p.weapons[p.currentSlot]
    if (p.fireCooldown > 0 || p.reloading) return
    if (w.id === 'knife') {
      this.knifeAttack(p)
      return
    }
    if (slot.mag <= 0) {
      this.startReload(p)
      return
    }
    slot.mag--
    p.fireCooldown = 60 / w.fireRate
    p.bloom = Math.min(w.bloomMax, p.bloom + w.bloomPerShot)
    p.pitch += w.recoilPitch * 0.5
    if (this.nearListener(p)) this.audio.playShoot(w.sound)
    const fwd = forwardFromYawPitch(p.yaw, p.pitch)
    const spread = w.spread + p.bloom + (dist > 20 ? 0.01 : 0)
    const dir = this.spreadDir(fwd, spread)
    this.shootRay(p, { x: p.x, y: p.y + EYE_HEIGHT, z: p.z }, dir, w)
  }

  private angleDiff(a: number, b: number): number {
    let d = a - b
    while (d > Math.PI) d -= Math.PI * 2
    while (d < -Math.PI) d += Math.PI * 2
    return d
  }

  private turnTowards(current: number, target: number, maxDelta: number): number {
    const d = this.angleDiff(target, current)
    if (Math.abs(d) <= maxDelta) return target
    return current + Math.sign(d) * maxDelta
  }

  private objectiveAI(p: Player, dt: number) {
    const inFreeze = this.roundPhase === 'freeze'
    if (inFreeze) {
      p.moving = false
      this.movePlayer(p, 0, 0, dt)
      return
    }

    // determine objective
    let objective: { x: number; z: number } | null = null

    if (p.team === 'T') {
      if (p.carryingC4) {
        objective = this.landmarkPoint(p.ai.bombsite === 'A' ? 'A_SITE' : 'B_SITE')
        p.ai.mode = 'plant'
      } else {
        // pick up dropped bomb if nearby
        if (this.bombDroppedPos && !this.bombCarrierId) {
          const d = Math.hypot(p.x - this.bombDroppedPos.x, p.z - this.bombDroppedPos.z)
          if (d < 1.6) {
            p.carryingC4 = true
            this.bombCarrierId = p.id
            this.bombDroppedPos = null
          }
        }
        // support the bombsite
        objective = this.landmarkPoint(p.ai.bombsite === 'A' ? 'A_SITE' : 'B_SITE')
        p.ai.mode = 'move'
      }
    } else {
      // CT
      if (this.bombPlantedPos) {
        objective = { x: this.bombPlantedPos.x, z: this.bombPlantedPos.z }
        p.ai.mode = 'defuse'
      } else if (this.bombDroppedPos) {
        objective = { x: this.bombDroppedPos.x, z: this.bombDroppedPos.z }
        p.ai.mode = 'move'
      } else {
        objective = this.ctHoldPoint(p)
        p.ai.mode = 'move'
      }
    }

    // planting / defusing when in place
    if (p.team === 'T' && p.carryingC4 && this.inSite(p) && !this.bombPlantedPos) {
      this.doPlantAI(p, dt)
      return
    }
    if (p.team === 'CT' && this.bombPlantedPos && this.nearPlanted(p)) {
      this.doDefuseAI(p, dt)
      return
    }

    // move along path to objective
    this.moveToObjective(p, objective, dt)
  }

  private ctHoldPoint(p: Player): { x: number; z: number } {
    switch (p.ai.homeSite) {
      case 'A': return p.id % 2 === 0 ? { x: -20, z: 12 } : { x: -8, z: 14 }
      case 'B': return p.id % 2 === 0 ? { x: 17, z: 16 } : { x: 22, z: 11 }
      default: return { x: 2, z: 4 }
    }
  }

  private moveToObjective(p: Player, objective: { x: number; z: number } | null, dt: number) {
    if (!objective) {
      p.moving = false
      this.movePlayer(p, 0, 0, dt)
      return
    }
    p.ai.objective = objective
    p.ai.repathTimer -= dt
    const near = Math.hypot(p.x - objective.x, p.z - objective.z) < 1.2
    if (near) {
      p.moving = false
      this.movePlayer(p, 0, 0, dt)
      // look around slowly
      p.yaw += dt * 0.5
      return
    }

    if (p.ai.repathTimer <= 0 || p.ai.path.length === 0) {
      p.ai.repathTimer = AI_REPATH_INTERVAL
      p.ai.path = this.nav.findPath(p.x, p.z, objective.x, objective.z)
      p.ai.pathIndex = 0
    }

    // follow path
    const path = p.ai.path
    if (path.length === 0) {
      p.moving = false
      return
    }
    let target = path[Math.min(p.ai.pathIndex, path.length - 1)]
    if (Math.hypot(p.x - target.x, p.z - target.z) < 0.7) {
      p.ai.pathIndex++
      if (p.ai.pathIndex >= path.length) {
        p.ai.path = []
        p.moving = false
        return
      }
      target = path[p.ai.pathIndex]
    }
    const dx = target.x - p.x
    const dz = target.z - p.z
    const len = Math.hypot(dx, dz) || 1
    p.yaw = yawFromDir(dx, dz)
    const w = this.currentWeaponDef(p)
    const speed = BASE_MOVE_SPEED * (w ? w.moveSpeed : 1) * 0.9
    p.moving = true
    this.movePlayer(p, (dx / len) * speed * dt, (dz / len) * speed * dt, dt)
    if (this.nearListener(p)) this.stepSound(p, dt)

    // stuck detection
    if (Math.hypot(p.x - p.ai.lastX, p.z - p.ai.lastZ) < 0.05 && p.moving) {
      p.ai.stuckTimer += dt
      if (p.ai.stuckTimer > 0.8) {
        p.ai.stuckTimer = 0
        p.ai.path = []
        p.ai.repathTimer = 0
      }
    } else {
      p.ai.stuckTimer = 0
    }
    p.ai.lastX = p.x
    p.ai.lastZ = p.z
  }

  private doPlantAI(p: Player, dt: number) {
    p.moving = false
    this.movePlayer(p, 0, 0, dt)
    p.ai.actionProgress += dt
    this.audio.playC4Plant()
    if (p.ai.actionProgress >= C4_PLANT_TIME) {
      this.plantBomb(p)
    }
  }

  private doDefuseAI(p: Player, dt: number) {
    p.moving = false
    this.movePlayer(p, 0, 0, dt)
    p.defusing = true
    this.bombDefusing = true
    p.ai.actionProgress += dt
    this.audio.playC4Defuse()
    if (p.ai.actionProgress >= C4_DEFUSE_TIME) {
      this.defuseBomb()
    }
  }

  // ------------------------------------------------------------- bomb ------

  private inSite(p: Player): boolean {
    return insideRect(p.x, p.z, ZONES.A_SITE) || insideRect(p.x, p.z, ZONES.B_SITE)
  }

  private nearPlanted(p: Player): boolean {
    if (!this.bombPlantedPos) return false
    return Math.hypot(p.x - this.bombPlantedPos.x, p.z - this.bombPlantedPos.z) < 2.2
  }

  private plantBomb(p: Player) {
    p.carryingC4 = false
    p.ai.actionProgress = 0
    this.bombCarrierId = null
    this.bombDroppedPos = null
    this.bombPlantedPos = { x: p.x, z: p.z }
    this.bombTimer = C4_TIMER
    this.audio.playC4Plant()
  }

  private defuseBomb() {
    this.bombPlantedPos = null
    this.bombDefusing = false
    this.bombGroup.visible = false
    this.audio.playDefuseWin()
    this.endRound('CT', '拆弹成功')
  }

  private explodeBomb() {
    this.audio.playExplode()
    for (const p of this.players) {
      if (!p.alive) continue
      const d = this.bombPlantedPos
        ? Math.hypot(p.x - this.bombPlantedPos.x, p.z - this.bombPlantedPos.z)
        : Infinity
      if (d < C4_RADIUS) {
        p.alive = false
        p.health = 0
        p.deaths++
        p.defusing = false
        const v = this.visuals.get(p.id)
        if (v) v.rig.group.visible = false
        this.addKillfeedRaw('C4', 'T', p.name, p.team, 'C4', false)
        if (p.isLocal) this.spectateIndex = 0
      }
    }
    this.bombPlantedPos = null
    this.bombGroup.visible = false
    this.endRound('T', 'C4 爆炸')
  }

  private addKillfeedRaw(attacker: string, attackerTeam: Team, victim: string, victimTeam: Team, weapon: string, headshot: boolean) {
    this.killfeed.unshift({
      id: this.killId++,
      attacker,
      attackerTeam,
      victim,
      victimTeam,
      weapon,
      headshot,
      time: performance.now(),
    })
    if (this.killfeed.length > 6) this.killfeed.pop()
  }

  private updateBombVisual() {
    const pos = this.bombPlantedPos ?? this.bombDroppedPos
    if (pos) {
      this.bombGroup.visible = true
      this.bombGroup.position.set(pos.x, 0.15, pos.z)
      this.bombLight.position.set(pos.x, 0.6, pos.z)
      const t = performance.now() / 400
      this.bombLight.intensity = this.bombPlantedPos ? (Math.sin(t) > 0 ? 1.6 : 0.2) : 0.4
      // beep when planted
      if (this.bombPlantedPos && this.roundPhase === 'live') {
        const whole = Math.floor(this.bombTimer * 2)
        if (whole !== Math.floor((this.bombTimer + 1 / 30) * 2)) this.audio.playC4Beep()
      }
    } else {
      this.bombGroup.visible = false
      this.bombLight.intensity = 0
    }
  }

  // ------------------------------------------------------------- rounds ----

  private checkRoundEnd() {
    if (this.roundPhase === 'over') return
    const tAlive = this.players.some((p) => p.team === 'T' && p.alive)
    const ctAlive = this.players.some((p) => p.team === 'CT' && p.alive)
    if (!ctAlive) {
      this.endRound('T', 'CT 全灭')
      return
    }
    if (!tAlive && !this.bombPlantedPos) {
      this.endRound('CT', 'T 全灭')
      return
    }
  }

  private endRound(winner: Team, reason: string) {
    if (this.roundPhase === 'over') return
    this.roundPhase = 'over'
    this.endTimer = ROUND_END_DELAY
    if (winner === 'T') this.scoreT++
    else this.scoreCT++
    this.banner = `${winner === 'T' ? 'T' : 'CT'} 获胜 — ${reason}`
    // reset bomb defusing
    this.bombDefusing = false
    for (const p of this.players) {
      p.defusing = false
      p.ai.actionProgress = 0
    }
  }

  // ------------------------------------------------------------- camera ----

  private updateCamera(dt: number) {
    const local = this.getLocalPlayer()
    let view: Player | undefined
    if (local && local.alive) {
      view = local
    } else {
      view = this.getSpectateTarget()
    }
    if (!view) return

    const targetYaw = view.yaw
    const targetPitch = view.pitch
    const targetPos = { x: view.x, y: view.y + EYE_HEIGHT, z: view.z }
    const k = Math.min(1, dt * 20)
    this.camera.position.x += (targetPos.x - this.camera.position.x) * k
    this.camera.position.y += (targetPos.y - this.camera.position.y) * k
    this.camera.position.z += (targetPos.z - this.camera.position.z) * k
    this.camera.rotation.y = targetYaw
    this.camera.rotation.x = targetPitch

    // FOV for scope
    const scoped = this.input.scope && local?.alive && this.isScoped()
    const targetFov = scoped ? (this.currentWeaponDef(local as Player)?.zoomFov ?? 75) : 75
    if (Math.abs(this.camera.fov - targetFov) > 0.05) {
      this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 12)
      this.camera.updateProjectionMatrix()
    }

    // handle spectate cycling / take control
    if (local && !local.alive) {
      if (this.input.cycleQueued) {
        this.input.cycleQueued = false
        this.spectateIndex++
        this.getSpectateTarget()
      }
      if (this.input.takeControlQueued) {
        this.input.takeControlQueued = false
        const target = this.getSpectateTarget()
        if (target) this.takeControl(target)
      }
    } else {
      this.input.cycleQueued = false
      this.input.takeControlQueued = false
    }
  }

  private takeControl(target: Player) {
    const old = this.getLocalPlayer()
    if (old) old.isLocal = false
    target.isLocal = true
    this.localPlayerId = target.id
    this.input.fire = false
    this.input.fireQueued = false
    this.input.scope = false
    const v = this.visuals.get(target.id)
    if (v) v.rig.group.visible = false
    this.syncViewModel()
  }

  // ------------------------------------------------------------- HUD -------

  private updateHud() {
    const local = this.getLocalPlayer()
    const view = local && local.alive ? local : this.getSpectateTarget()

    if (local && local.alive) {
      const slot = local.currentSlot
      const w = local.weapons[slot]
      const def = w.id ? WEAPONS[w.id] : null
      hudState.hp = Math.max(0, Math.round(local.health))
      hudState.armor = Math.max(0, Math.round(local.armor))
      hudState.hasHelmet = local.hasHelmet
      hudState.weaponName = def ? def.name : ''
      hudState.weaponSlot = slot
      hudState.mag = w.id ? w.mag : 0
      hudState.reserve = w.id ? w.reserve : 0
      hudState.reloading = local.reloading
      hudState.spectating = false
      hudState.spectatedName = ''
      const wd = this.currentWeaponDef(local)
      hudState.crosshairGap = 6 + (wd ? (wd.spread + local.bloom) * 900 : 0) + (local.moving ? 4 : 0)
    } else if (view) {
      hudState.hp = Math.max(0, Math.round(view.health))
      hudState.armor = Math.max(0, Math.round(view.armor))
      hudState.hasHelmet = view.hasHelmet
      hudState.weaponName = '观察中'
      hudState.mag = 0
      hudState.reserve = 0
      hudState.reloading = false
      hudState.spectating = true
      hudState.spectatedName = view.name
      hudState.crosshairGap = 6
    }

    hudState.team = this.playerTeam
    hudState.round = this.round
    hudState.roundPhase = this.roundPhase
    hudState.scoreT = this.scoreT
    hudState.scoreCT = this.scoreCT
    hudState.banner = this.banner

    // bomb
    if (this.bombPlantedPos) {
      hudState.bombState = this.bombDefusing ? 'defusing' : 'planted'
      hudState.bombTimer = Math.max(0, this.bombTimer)
      hudState.bombCarrier = null
    } else if (this.bombCarrierId != null) {
      hudState.bombState = 'carried'
      hudState.bombTimer = C4_TIMER
      const c = this.players.find((p) => p.id === this.bombCarrierId)
      hudState.bombCarrier = c ? c.name : null
    } else {
      hudState.bombState = 'none'
      hudState.bombTimer = C4_TIMER
      hudState.bombCarrier = null
    }

    // hint
    let hint = ''
    if (local && local.alive) {
      if (local.carryingC4 && this.inSite(local)) hint = '按住 E 安放 C4'
      else if (local.carryingC4) hint = '你是 C4 携带者，前往 A 点或 B 点'
      else if (local.team === 'CT' && this.bombPlantedPos && this.nearPlanted(local)) hint = '按住 E 拆除 C4'
      else if (this.bombPlantedPos && local.team === 'CT') hint = '前往拆除 C4'
    } else if (local && !local.alive) {
      hint = 'E 切换队友视角 · F 接管该队友'
    }
    hudState.hint = hint

    // minimap
    const minimapPlayers = this.players.map((p) => {
      let visible = true
      if (p.team !== this.playerTeam) {
        // enemies visible if seen by local (or any teammate recently)
        visible = this.enemyVisibleToLocal(p)
      }
      return {
        x: p.x, z: p.z, yaw: p.yaw, team: p.team, alive: p.alive,
        isLocal: p.id === this.localPlayerId, visible,
      }
    })
    let bombInfo: { x: number; z: number; planted: boolean; carriedBy: string | null } | null = null
    if (this.bombPlantedPos) {
      bombInfo = { x: this.bombPlantedPos.x, z: this.bombPlantedPos.z, planted: true, carriedBy: null }
    } else if (this.bombDroppedPos) {
      bombInfo = { x: this.bombDroppedPos.x, z: this.bombDroppedPos.z, planted: false, carriedBy: null }
    } else if (this.bombCarrierId != null) {
      const c = this.players.find((p) => p.id === this.bombCarrierId)
      if (c) bombInfo = { x: c.x, z: c.z, planted: false, carriedBy: c.name }
    }
    hudState.minimap = {
      players: minimapPlayers,
      bomb: bombInfo,
      siteA: { x: -15, z: 15 },
      siteB: { x: 20, z: 14 },
    }

    hudState.killfeed = this.killfeed.slice(0, 5)
    notifyHud()
  }

  private enemyVisibleToLocal(p: Player): boolean {
    const local = this.getLocalPlayer()
    const viewer = local && local.alive ? local : this.getSpectateTarget()
    if (!viewer) return false
    const now = performance.now()
    const last = this.lastSeen.get(p.id) ?? 0
    const inLos = this.hasLOS(viewer.x, viewer.y + EYE_HEIGHT, viewer.z, p.x, p.y + 1.2, p.z) &&
      Math.hypot(viewer.x - p.x, viewer.z - p.z) < 45
    if (inLos) this.lastSeen.set(p.id, now)
    return inLos || now - last < 2500
  }

  // ------------------------------------------------------------- render ----

  private render() {
    // sync visuals
    for (const p of this.players) {
      const v = this.visuals.get(p.id)
      if (!v) continue
      if (!p.alive) {
        v.rig.group.visible = false
        continue
      }
      v.rig.group.visible = !p.isLocal
      this.syncVisual(p, v)
      this.animateRig(p, v.rig)
    }
    this.renderer.render(this.scene, this.camera)
  }

  private animateRig(p: Player, rig: CharacterRig) {
    const swing = p.moving ? Math.sin(p.walkCycle) * 0.6 : 0
    rig.legL.rotation.x = swing
    rig.legR.rotation.x = -swing
    rig.armL.rotation.x = p.moving ? -swing * 0.4 : 0
    rig.armR.rotation.x = p.moving ? swing * 0.4 : 0
  }

  private onResize() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }
}

type SlotWeaponLike = Player['weapons'][WeaponSlot]

// 游戏主引擎：世界状态、回合流程、射击判定、AI 更新
import * as THREE from 'three'
import type {
  Entity,
  GameStatus,
  HitboxPart,
  RoundState,
  Team,
  WeaponDef
} from './types'
import { cloneWeapon, computeDamage } from './weapons'
import {
  BOMB_SITES,
  SPAWNS,
  WALLS,
  zoneAt,
  floorHeightAt,
  hasLineOfSight
} from './map'
import {
  buildCharacter,
  buildViewModel,
  buildScene,
  moveEntity,
  canSee
} from './scene'
import {
  NAV,
  makeAIDecision,
  followPath,
  faceTarget,
  shouldShootAt,
  aiCanSee
} from './ai'
import * as A from './audio'

const PLAYER_HEIGHT = 1.8
const EYE = 1.62
const GRAVITY = -22
const JUMP_V = 7.6
const RUN = 5.6
const ROUND_TIME = 115
const BOMB_TIME = 40
const DEFUSE_TIME = 10
const PLANT_TIME = 3.2

let uid = 0

export class GameEngine {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  entities: Entity[] = []
  player!: Entity
  round: RoundState
  bombMesh: THREE.Group | null = null
  plantedLed: THREE.Mesh | null = null

  /** 玩家输入状态 */
  private keys: Record<string, boolean> = {}
  private mouseYaw = 0
  private mousePitch = 0
  private mouseDown = false
  private rightDown = false
  private scoped = false
  private recoilPitch = 0
  private recoilYaw = 0
  private spreadHeat = 0
  private viewModel: THREE.Group
  private viewWeaponId = ''

  /** 回合内计时 */
  private simTime = 0
  private bombPlantedAt = 0
  private lastStepAt = 0
  private bannerTimer = 0
  private bannerText: string | null = null

  status: GameStatus = {
    phase: 'menu',
    round: {} as RoundState,
    alive: { CT: 5, T: 5 },
    killfeed: [],
    hud: {} as GameStatus['hud'],
    score: { CT: 0, T: 0 }
  }

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      76,
      container.clientWidth / container.clientHeight,
      0.08,
      320
    )

    buildScene(this.scene)

    this.round = {
      number: 1,
      pistolRound: true,
      endsAt: ROUND_TIME,
      phase: 'live',
      winner: null,
      bombPlanted: false,
      bombTimer: BOMB_TIME,
      bombPos: null,
      spectatorId: 0,
      scoreCT: 0,
      scoreT: 0
    }

    this.spawnTeams()

    // 第一人称手持模型挂在相机上
    this.viewModel = new THREE.Group()
    this.camera.add(this.viewModel)
    this.scene.add(this.camera)
    this.setViewModel(this.player.weapons[this.player.slot]!.id)

    this.bindInput(container)
    this.loop = this.loop.bind(this)
    this.clock = new THREE.Clock()
    this.last = performance.now()
  }

  private clock: THREE.Clock
  private last = 0
  loop!: () => void

  /* ---------------------------------------------------------------- */
  /* 生成                                                             */
  /* ---------------------------------------------------------------- */
  private spawnTeams(): void {
    const ctNames = ['Vex', 'Kite', 'Mako', 'Rune', 'Slate']
    const tNames = ['Drift', 'Onyx', 'Pyre', 'Quill', 'Nomad']

    const build = (
      team: Team,
      names: string[],
      isPlayerTeam: boolean,
      index: number
    ): Entity => {
      const spawn = SPAWNS[team][index % 5]
      const secondary = cloneWeapon(team === 'CT' ? 'usp' : 'glock')
      const melee = cloneWeapon('knife')
      const isPlayer = isPlayerTeam && index === 0
      const e: Entity = {
        id: ++uid,
        team,
        name: isPlayer ? 'YOU' : names[index],
        isBot: !isPlayer,
        alive: true,
        hp: 100,
        armor: this.round.pistolRound ? (team === 'CT' ? 0 : 100) : 100,
        pos: { x: spawn.x, y: spawn.y + 0.05, z: spawn.z },
        vel: { x: 0, y: 0, z: 0 },
        yaw: team === 'CT' ? Math.PI * 0.9 : -Math.PI * 0.9,
        pitch: 0,
        onGround: true,
        slot: 'secondary',
        weapons: { primary: null, secondary, melee },
        ammoInMag: secondary.magSize,
        reserveAmmo: secondary.reserve,
        reloading: false,
        reloadEndAt: 0,
        nextFireAt: 0,
        hasBomb: false,
        plantedAt: null,
        defuseProgress: 0,
        aiState: 'idle',
        aiTarget: null,
        aiPath: [],
        aiPathIdx: 0,
        aiNextThink: 0,
        group: buildCharacter(team, 'pistol'),
        lastHitPart: null
      }
      // 非手枪局给主武器
      if (!this.round.pistolRound) {
        const primaryId = team === 'CT'
          ? (Math.random() < 0.3 ? 'awp' : 'm4a4')
          : 'ak47'
        e.weapons.primary = cloneWeapon(primaryId)
      }
      e.group.position.set(e.pos.x, e.pos.y, e.pos.z)
      e.group.rotation.y = e.yaw
      this.scene.add(e.group)
      return e
    }

    // CT
    for (let i = 0; i < 5; i++) {
      const e = build('CT', ctNames, true, i)
      if (i === 0) this.player = e
      this.entities.push(e)
    }
    // T（第一人称持包）
    for (let i = 0; i < 5; i++) {
      const e = build('T', tNames, false, i)
      if (i === 0) {
        e.hasBomb = true
        e.name = 'Carrier'
      }
      this.entities.push(e)
    }
  }

  /* ---------------------------------------------------------------- */
  /* 输入                                                             */
  /* ---------------------------------------------------------------- */
  private bindInput(container: HTMLElement): void {
    const canvas = this.renderer.domElement
    canvas.addEventListener('click', () => {
      if (this.status.phase !== 'playing') return
      canvas.requestPointerLock()
      A.resumeAudio()
    })
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement !== canvas) {
        this.mouseDown = false
        this.rightDown = false
      }
    })
    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement !== canvas) return
      const sens = this.scoped ? 0.0009 : 0.0022
      this.mouseYaw -= e.movementX * sens
      this.mousePitch -= e.movementY * sens
    })
    canvas.addEventListener('mousedown', (e) => {
      if (document.pointerLockElement !== canvas) return
      if (e.button === 0) this.mouseDown = true
      if (e.button === 2) {
        this.rightDown = true
        const w = this.player.weapons[this.player.slot]!
        if (w.scope > 1) this.setScope(true)
      }
    })
    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouseDown = false
      if (e.button === 2) {
        this.rightDown = false
        if (this.scoped) this.setScope(false)
      }
    })
    canvas.addEventListener('contextmenu', (e) => e.preventDefault())
    canvas.addEventListener('wheel', (e) => {
      if (this.status.phase !== 'playing') return
      const order: Entity['slot'][] = ['primary', 'secondary', 'melee']
      const cur = order.indexOf(this.player.slot)
      const next = order[(cur + (e.deltaY > 0 ? 1 : -1) + 3) % 3]
      this.switchSlot(next)
    }, { passive: true })

    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true
      if (this.status.phase !== 'playing') return
      if (e.code === 'Digit1') this.switchSlot('primary')
      if (e.code === 'Digit2') this.switchSlot('secondary')
      if (e.code === 'Digit3') this.switchSlot('melee')
      if (e.code === 'KeyR') this.startReload(this.controlled())
      if (e.code === 'Space') e.preventDefault()
    })
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false
    })
    window.addEventListener('resize', () => {
      const w = container.clientWidth
      const h = container.clientHeight
      this.camera.aspect = w / h
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(w, h)
    })
  }

  private setScope(on: boolean): void {
    const w = this.player.weapons[this.player.slot]!
    if (w.scope <= 1) return
    if (on === this.scoped) return
    this.scoped = on
    A.playScope()
    this.camera.fov = on ? 76 / w.scope : 76
    this.camera.updateProjectionMatrix()
  }

  private switchSlot(slot: Entity['slot']): void {
    if (slot === 'primary' && !this.player.weapons.primary) return
    const p = this.controlled()
    if (p.slot === slot) return
    p.slot = slot
    p.reloading = false
    p.nextFireAt = this.simTime + 0.25
    const w = p.weapons[slot]!
    p.ammoInMag = w.magSize
    p.reserveAmmo = w.reserve
    this.setScope(false)
    if (p === this.player) this.setViewModel(w.id)
  }

  private setViewModel(id: string): void {
    if (id === this.viewWeaponId) return
    this.viewWeaponId = id
    this.viewModel.clear()
    this.viewModel.add(buildViewModel(id))
    // 收枪 / 持枪姿态
    this.viewModel.position.set(0.26, -0.24, -0.46)
    this.viewModel.rotation.set(0, 0, 0)
  }

  /** 当前操控的实体（阵亡后切视角） */
  controlled(): Entity {
    if (this.player.alive) return this.player
    const id = this.round.spectatorId
    const e = this.entities.find((x) => x.id === id && x.alive)
    return e ?? this.player
  }

  /* ---------------------------------------------------------------- */
  /* 射击                                                             */
  /* ---------------------------------------------------------------- */
  private fire(e: Entity): void {
    const w = e.weapons[e.slot]!
    const nowMs = performance.now()
    if (nowMs < e.nextFireAt) return
    if (e.reloading) return
    if (e.ammoInMag <= 0) {
      if (e === this.player) A.playReload()
      this.startReload(e)
      return
    }
    const interval = 60000 / w.rpm
    e.nextFireAt = nowMs + interval
    e.ammoInMag--

    const ox = e.pos.x
    const oy = e.pos.y + EYE
    const oz = e.pos.z

    // 距离衰减的音量
    const distToPlayer = Math.hypot(
      this.camera.position.x - ox,
      this.camera.position.y - oy,
      this.camera.position.z - oz
    )
    A.playShot(w.id, Math.max(0, distToPlayer - 2))

    if (w.id === 'knife') {
      // 近战：扇形范围
      for (const t of this.entities) {
        if (!t.alive || t.team === e.team) continue
        const d = Math.hypot(t.pos.x - ox, t.pos.z - oz)
        if (d > w.range) continue
        if (Math.abs(this.angleDiff(this.yawTo(t), e.yaw)) < 0.7) {
          this.applyDamage(e, t, 'chest', w)
        }
      }
      return
    }

    // 射线发射：spread 造成横向偏移
    const spreadRad = (w.spread * this.spreadHeat * (this.scoped ? 0.25 : 1) * Math.PI) / 180
    const jitterX = (Math.random() - 0.5) * spreadRad
    const jitterY = (Math.random() - 0.5) * spreadRad

    const dir = new THREE.Vector3()
    const cy = Math.cos(jitterY)
    dir.set(
      -Math.sin(e.yaw) * cy,
      Math.sin(e.pitch + jitterY) + jitterY * 0.4,
      -Math.cos(e.yaw) * cy
    )
    // 叠加 yaw 抖动
    const yj = jitterX
    const sx = -Math.sin(e.yaw + yj) * cy
    const sz = -Math.cos(e.yaw + yj) * cy
    dir.set(sx, dir.y, sz)
    dir.normalize()

    const end = this.raycastWorld(ox, oy, oz, dir, w.range, e)
    if (end.entity && end.part) {
      this.applyDamage(e, end.entity, end.part, w)
      A.playHit(end.part === 'head')
    }

    // 后坐力
    const rec = w.recoil * (this.scoped ? 0.6 : 1)
    this.spreadHeat = Math.min(4.2, this.spreadHeat + 0.9)
    if (e === this.player) {
      this.recoilPitch += rec * Math.PI / 180
      this.recoilYaw += (Math.random() - 0.5) * rec * 0.5 * Math.PI / 180
    } else {
      // AI 后坐力表现为瞄准偏差
      e.pitch += rec * 0.25 * Math.PI / 180
    }
  }

  private yawTo(t: Entity): number {
    const dx = t.pos.x - this.camera.position.x
    const dz = t.pos.z - this.camera.position.z
    return Math.atan2(-dx, -dz)
  }

  private angleDiff(a: number, b: number): number {
    let d = a - b
    while (d > Math.PI) d -= Math.PI * 2
    while (d < -Math.PI) d += Math.PI * 2
    return d
  }

  /** 射线检测：命中实体返回部位，命中墙返回世界点 */
  private raycastWorld(
    ox: number,
    oy: number,
    oz: number,
    dir: THREE.Vector3,
    maxDist: number,
    shooter: Entity
  ): { entity: Entity | null; part: HitboxPart | null; dist: number } {
    // 先找最近的墙体交点
    let wallDist = maxDist
    const step = 0.35
    for (let d = step; d < maxDist; d += step) {
      const x = ox + dir.x * d
      const y = oy + dir.y * d
      const z = oz + dir.z * d
      if (y < 0) {
        wallDist = d
        break
      }
      // 用 AI 用的墙检测
      const blocked = !this.pointClear(x, y, z)
      if (blocked) {
        wallDist = d
        break
      }
    }

    // 再找实体命中
    let best: Entity | null = null
    let bestDist = wallDist
    let bestPart: HitboxPart | null = null
    for (const t of this.entities) {
      if (!t.alive || t === shooter) continue
      const part = this.rayVsEntity(ox, oy, oz, dir, t, bestDist)
      if (part) {
        bestDist = part.dist
        best = t
        bestPart = part.part
      }
    }
    return { entity: best, part: bestPart, dist: bestDist }
  }

  /** 该世界点是否被墙体占据 */
  private pointClear(x: number, y: number, z: number): boolean {
    return !this.wallHit(x, y, z)
  }

  private wallHit(x: number, y: number, z: number): boolean {
    for (const w of WALLS) {
      if (
        x > w.minX && x < w.maxX &&
        y > w.minY && y < w.maxY &&
        z > w.minZ && z < w.maxZ
      ) {
        return true
      }
    }
    return false
  }

  /** 射线 vs 角色 hitbox（分区） */
  private rayVsEntity(
    ox: number,
    oy: number,
    oz: number,
    dir: THREE.Vector3,
    t: Entity,
    maxDist: number
  ): { part: HitboxPart; dist: number } | null {
    // 用竖直分层的近似胶囊：AABB 逐部位测试
    const parts: { part: HitboxPart; y0: number; y1: number; w: number }[] = [
      { part: 'head', y0: 1.52, y1: 1.82, w: 0.17 },
      { part: 'chest', y0: 1.02, y1: 1.52, w: 0.27 },
      { part: 'abdomen', y0: 0.78, y1: 1.02, w: 0.25 },
      { part: 'leg', y0: 0.0, y1: 0.78, w: 0.22 }
    ]
    let closest: { part: HitboxPart; dist: number } | null = null
    for (const p of parts) {
      const cy = (p.y0 + p.y1) / 2
      const hy = (p.y1 - p.y0) / 2
      const hit = rayBox(
        ox, oy, oz, dir,
        t.pos.x - p.w, t.pos.y + p.y0, t.pos.z - p.w,
        t.pos.x + p.w, t.pos.y + p.y1, t.pos.z + p.w
      )
      if (hit !== null && hit < (closest?.dist ?? maxDist)) {
        closest = { part: p.part, dist: hit }
      }
      void cy
      void hy
    }
    return closest
  }

  private applyDamage(
    attacker: Entity,
    victim: Entity,
    part: HitboxPart,
    weapon: WeaponDef
  ): void {
    if (!victim.alive) return
    const dmg = computeDamage(weapon, part, victim.armor)
    victim.hp -= dmg
    victim.lastHitPart = part
    victim.armor = Math.max(0, victim.armor - dmg * 0.35)
    if (victim.hp <= 0) {
      victim.alive = false
      victim.hp = 0
      victim.group.visible = false
      A.playKill()
      this.addKillfeed(attacker, victim, weapon.id, part === 'head')
      // C4 掉落
      if (victim.hasBomb) {
        victim.hasBomb = false
        this.dropBomb(victim.pos.x, victim.pos.y, victim.pos.z, victim.id)
      }
      this.checkRoundEnd()
    }
  }

  private dropBomb(x: number, y: number, z: number, ownerId: number): void {
    void ownerId
    const carrier = this.entities.find((e) => e.alive && e.team === 'T' && !e.hasBomb)
    if (carrier) {
      carrier.hasBomb = true
    } else {
      // 无人拾取则保持掉落状态
      this.round.bombPos = { x, y, z }
    }
  }

  private addKillfeed(
    k: Entity,
    v: Entity,
    weapon: string,
    hs: boolean
  ): void {
    this.status.killfeed.unshift({
      id: ++uid,
      killer: k.name,
      killerTeam: k.team,
      victim: v.name,
      victimTeam: v.team,
      weapon,
      headshot: hs,
      at: performance.now()
    })
    if (this.status.killfeed.length > 6) this.status.killfeed.length = 6
    if (k === this.player || v === this.player) A.playDeath()
  }

  private startReload(e: Entity): void {
    const w = e.weapons[e.slot]!
    if (w.magSize === 0) return
    if (e.reloading) return
    if (e.ammoInMag >= w.magSize) return
    if (e.reserveAmmo <= 0) return
    e.reloading = true
    e.reloadEndAt = performance.now() + w.reloadTime * 1000
    if (e === this.player) A.playReload()
  }

  /* ---------------------------------------------------------------- */
  /* 回合流程                                                         */
  /* ---------------------------------------------------------------- */
  private checkRoundEnd(): void {
    const ctAlive = this.entities.filter((e) => e.team === 'CT' && e.alive).length
    const tAlive = this.entities.filter((e) => e.team === 'T' && e.alive).length
    if (tAlive === 0) this.endRound('CT')
    else if (ctAlive === 0) this.endRound('T')
  }

  private endRound(winner: Team): void {
    if (this.round.phase === 'ended') return
    // 已安放且 T 获胜以外的情况：若 T 全灭且炸弹未爆，CT 胜
    this.round.phase = 'ended'
    this.round.winner = winner
    if (winner === 'CT') this.round.scoreCT++
    else this.round.scoreT++
    this.bannerText = winner === this.player.team ? '回合胜利' : '回合失败'
    this.bannerTimer = 4.5
    if (winner === this.player.team) A.playRoundWin()
    else A.playRoundLose()
    this.status.score = { CT: this.round.scoreCT, T: this.round.scoreT }
  }

  private nextRound(): void {
    this.round.number++
    this.round.pistolRound = false
    this.round.phase = 'live'
    this.round.winner = null
    this.round.bombPlanted = false
    this.round.bombTimer = BOMB_TIME
    this.round.bombPos = null
    this.bannerText = null
    this.simTime = 0
    this.bombPlantedAt = 0

    // 移除旧炸弹模型
    if (this.bombMesh) {
      this.scene.remove(this.bombMesh)
      this.bombMesh = null
      this.plantedLed = null
    }

    let ct = 0
    let t = 0
    for (const e of this.entities) {
      const spawn = SPAWNS[e.team][e.team === 'CT' ? ct : t % 5]
      if (e.team === 'CT') ct++
      else t++
      e.alive = true
      e.hp = 100
      e.armor = 100
      e.pos = { x: spawn.x, y: spawn.y + 0.05, z: spawn.z }
      e.vel = { x: 0, y: 0, z: 0 }
      e.slot = 'secondary'
      e.ammoInMag = e.weapons.secondary.magSize
      e.reserveAmmo = e.weapons.secondary.reserve
      e.reloading = false
      e.plantedAt = null
      e.defuseProgress = 0
      e.group.visible = true
      e.group.position.set(e.pos.x, e.pos.y, e.pos.z)
    }
    // T 队第一人称持包
    const carrier = this.entities.find((e) => e.team === 'T')
    if (carrier) carrier.hasBomb = true
    this.player = this.entities[0]
    this.player.alive = true
  }

  private plantBomb(e: Entity): void {
    if (this.round.bombPlanted || !e.hasBomb) return
    this.round.bombPlanted = true
    this.round.bombPos = { x: e.pos.x, y: e.pos.y, z: e.pos.z }
    this.bombPlantedAt = this.simTime
    e.hasBomb = false
    A.playBombPlant()
    this.spawnBombMesh(e.pos.x, e.pos.y, e.pos.z)
  }

  private spawnBombMesh(x: number, y: number, z: number): void {
    const g = new THREE.Group()
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.16, 0.22),
      new THREE.MeshLambertMaterial({ color: 0x22262c })
    )
    g.add(body)
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff3b30 })
    )
    led.position.set(0.09, 0.11, 0)
    g.add(led)
    g.position.set(x, y + 0.08, z)
    this.scene.add(g)
    this.bombMesh = g
    this.plantedLed = led
  }

  /* ---------------------------------------------------------------- */
  /* 更新                                                             */
  /* ---------------------------------------------------------------- */
  private updatePlayer(dt: number): void {
    const p = this.controlled()
    if (!p.alive) {
      this.updateSpectate()
      return
    }

    // 视角
    const rw = p.weapons[p.slot]!.recover * (this.scoped ? 1.3 : 1)
    this.recoilPitch *= Math.max(0, 1 - rw * dt)
    this.recoilYaw *= Math.max(0, 1 - rw * dt)
    this.spreadHeat = Math.max(0, this.spreadHeat - dt * 3.4)

    // 移动
    let fx = 0
    let fz = 0
    if (this.keys.KeyW) fz -= 1
    if (this.keys.KeyS) fz += 1
    if (this.keys.KeyA) fx -= 1
    if (this.keys.KeyD) fx += 1
    const len = Math.hypot(fx, fz)
    let speed = RUN * (this.scoped ? 0.35 : 1)
    if (len > 0) {
      fx /= len
      fz /= len
      const sy = Math.sin(p.yaw + this.recoilYaw)
      const cy = Math.cos(p.yaw + this.recoilYaw)
      const wx = fx * cy - fz * sy
      const wz = fx * sy + fz * cy
      p.vel.x = wx * speed
      p.vel.z = wz * speed
    } else {
      p.vel.x *= 0.82
      p.vel.z *= 0.82
    }
    if (this.keys.Space && p.onGround) {
      p.vel.y = JUMP_V
      p.onGround = false
    }
    p.vel.y += GRAVITY * dt

    const res = moveEntity(p.pos.x, p.pos.y, p.pos.z, p.vel.x * dt, p.vel.y * dt, p.vel.z * dt)
    p.pos.x = res.x
    p.pos.y = res.y
    p.pos.z = res.z
    p.onGround = res.onGround
    if (res.onGround) p.vel.y = 0
    // 掉出地图
    if (p.pos.y < -20) {
      p.hp = 0
      p.alive = false
      this.addKillfeed(p, p, 'fall', false)
      this.checkRoundEnd()
    }

    // 换弹
    if (p.reloading && performance.now() >= p.reloadEndAt) {
      const wn = p.weapons[p.slot]!
      const need = wn.magSize - p.ammoInMag
      const take = Math.min(need, p.reserveAmmo)
      p.ammoInMag += take
      p.reserveAmmo -= take
      p.reloading = false
    }

    // 开火
    const curW = p.weapons[p.slot]!
    if (this.mouseDown && (curW.auto || !this.fireLatch)) {
      this.fire(p)
      if (!curW.auto) this.fireLatch = true
    }
    if (!this.mouseDown) this.fireLatch = false

    // C4 交互
    this.updatePlantDefuse(p, dt)

    // 脚步声
    if (len > 0 && this.simTime - this.lastStepAt > 0.42) {
      this.lastStepAt = this.simTime
      A.playStep(p.onGround)
    }

    // 相机
    this.camera.position.set(p.pos.x, p.pos.y + EYE, p.pos.z)
    this.camera.rotation.set(0, 0, 0)
    this.camera.rotateY(p.yaw + this.recoilYaw)
    this.camera.rotateX(this.mousePitch + this.recoilPitch)
    p.pitch = this.mousePitch + this.recoilPitch

    // 手持模型后坐
    this.viewModel.position.z = -0.46 + this.recoilPitch * 0.22
    this.viewModel.rotation.x = -this.recoilPitch * 0.9
    this.viewModel.rotation.z = -this.recoilYaw * 0.6
  }

  private fireLatch = false

  private updateSpectate(): void {
    const alive = this.entities.filter((e) => e.alive)
    const target = alive.find((e) => e.id === this.round.spectatorId) ?? alive[0]
    if (!target) return
    this.round.spectatorId = target.id
    // 简单第三人称跟随
    this.camera.position.set(
      target.pos.x,
      target.pos.y + EYE + 0.6,
      target.pos.z + 4.2
    )
    this.camera.lookAt(target.pos.x, target.pos.y + 1.3, target.pos.z)
    this.viewModel.visible = false
  }

  private updatePlantDefuse(p: Entity, dt: number): void {
    if (this.round.bombPlanted && this.round.bombPos) {
      const bp = this.round.bombPos
      const d = Math.hypot(p.pos.x - bp.x, p.pos.z - bp.z)
      // 拆包：CT 需在 C4 上且未受击
      if (p.team === 'CT' && d < 1.9 && p.hp > 0) {
        p.defuseProgress += dt / DEFUSE_TIME
        if (p.defuseProgress >= 1) {
          this.endRound('CT')
          A.playBombDefuse()
        }
      } else if (p.defuseProgress > 0) {
        p.defuseProgress = Math.max(0, p.defuseProgress - dt / DEFUSE_TIME * 0.6)
      }
    } else {
      // 下包：T 持包且在包点内
      if (p.team === 'T' && p.hasBomb) {
        for (const site of BOMB_SITES) {
          const d = Math.hypot(p.pos.x - site.x, p.pos.z - site.z)
          if (d < site.radius) {
            p.aiState = 'plant'
            this.plantTimer = (this.plantTimer ?? 0) + dt
            if (this.plantTimer >= PLANT_TIME) {
              this.plantBomb(p)
              this.plantTimer = 0
            }
            return
          }
        }
      }
      this.plantTimer = 0
    }
  }

  private plantTimer = 0

  private updateBots(dt: number): void {
    for (const e of this.entities) {
      if (!e.alive || e.isBot === false) continue
      makeAIDecision(e, this.entities, this.round.bombPlanted, this.round.bombPos, this.simTime)

      // 交战
      if (e.aiState === 'engage' && e.aiTarget !== null) {
        const target = this.entities.find((t) => t.id === e.aiTarget && t.alive)
        if (target) {
          faceTarget(e, target, dt)
          if (shouldShootAt(e, target)) {
            // 换到合适武器
            const d = Math.hypot(target.pos.x - e.pos.x, target.pos.z - e.pos.z)
            if (e.weapons.primary && d < 26) this.ensureSlot(e, 'primary')
            else if (e.slot === 'melee') this.ensureSlot(e, 'secondary')
            this.fire(e)
          }
        }
      } else {
        // 巡逻 / 移动
        const mv = followPath(e, dt, RUN)
        if (mv) {
          const speed = RUN * 0.86
          e.vel.x = -Math.sin(mv.moveYaw) * speed
          e.vel.z = -Math.cos(mv.moveYaw) * speed
          let diff = mv.moveYaw - e.yaw
          while (diff > Math.PI) diff -= Math.PI * 2
          while (diff < -Math.PI) diff += Math.PI * 2
          e.yaw += diff * Math.min(1, dt * 6)
        } else {
          e.vel.x *= 0.8
          e.vel.z *= 0.8
          // 警戒扫描
          if (Math.random() < 0.004) e.yaw += (Math.random() - 0.5) * 1.4
        }
        e.vel.y += GRAVITY * dt
      }

      // 换弹
      if (e.ammoInMag <= 0 && !e.reloading) this.startReload(e)
      if (e.reloading && performance.now() >= e.reloadEndAt) {
        const wn = e.weapons[e.slot]!
        const need = wn.magSize - e.ammoInMag
        const take = Math.min(need, e.reserveAmmo)
        e.ammoInMag += take
        e.reserveAmmo -= take
        e.reloading = false
      }

      // AI 下包 / 拆包
      if (e.aiState === 'defuse' && this.round.bombPlanted && this.round.bombPos) {
        const bp = this.round.bombPos
        if (Math.hypot(e.pos.x - bp.x, e.pos.z - bp.z) < 1.9) {
          e.defuseProgress += dt / DEFUSE_TIME
          if (e.defuseProgress >= 1) {
            this.endRound('CT')
            A.playBombDefuse()
          }
        }
      }

      // 物理
      const res = moveEntity(e.pos.x, e.pos.y, e.pos.z, e.vel.x * dt, e.vel.y * dt, e.vel.z * dt)
      e.pos.x = res.x
      e.pos.y = res.y
      e.pos.z = res.z
      e.onGround = res.onGround
      if (res.onGround) e.vel.y = 0

      // 同步视觉体
      e.group.position.set(e.pos.x, e.pos.y, e.pos.z)
      e.group.rotation.y = e.yaw
      // 持枪姿态微调
      const armR = e.group.children[4] as THREE.Object3D | undefined
      if (armR) {
        armR.rotation.x = e.aiState === 'engage' ? -1.25 : -1.0
      }
    }
  }

  private ensureSlot(e: Entity, slot: Entity['slot']): void {
    if (e.slot === slot) return
    if (slot === 'primary' && !e.weapons.primary) return
    e.slot = slot
    const w = e.weapons[slot]!
    e.ammoInMag = w.magSize
    e.reserveAmmo = w.reserve
    e.reloading = false
  }

  /* ---------------------------------------------------------------- */
  /* HUD 同步                                                        */
  /* ---------------------------------------------------------------- */
  private syncHud(): void {
    const p = this.controlled()
    const w = p.weapons[p.slot]!
    const ctAlive = this.entities.filter((e) => e.team === 'CT' && e.alive).length
    const tAlive = this.entities.filter((e) => e.team === 'T' && e.alive).length
    this.status.alive = { CT: ctAlive, T: tAlive }
    this.status.score = { CT: this.round.scoreCT, T: this.round.scoreT }
    this.status.hud = {
      hp: Math.max(0, Math.round(p.hp)),
      armor: Math.max(0, Math.round(p.armor)),
      ammo: p.ammoInMag,
      magSize: w.magSize,
      weaponName: w.name,
      slot: p.slot,
      alive: p.alive,
      scoped: this.scoped,
      hasBomb: p.hasBomb,
      bombPlanted: this.round.bombPlanted,
      roundTime: this.round.bombPlanted
        ? Math.max(0, this.round.bombTimer - (this.simTime - this.bombPlantedAt))
        : Math.max(0, this.round.endsAt - this.simTime),
      roundNumber: this.round.number,
      scoreCT: this.round.scoreCT,
      scoreT: this.round.scoreT,
      banner: this.bannerTimer > 0 ? this.bannerText : null,
      spectator: !this.player.alive
    }
    this.status.round = this.round
  }

  /* ---------------------------------------------------------------- */
  /* 主循环                                                          */
  /* ---------------------------------------------------------------- */
  private updateBombVisual(): void {
    if (this.plantedLed) {
      const blink = (this.simTime * 4) % 1 > 0.5
      ;(this.plantedLed.material as THREE.MeshBasicMaterial).color.setHex(
        blink ? 0xff3b30 : 0x400a08
      )
    }
  }

  run(): void {
    this.status.phase = 'playing'
    const step = (): void => {
      const now = performance.now()
      const dt = Math.min(0.04, (now - this.last) / 1000)
      this.last = now

      if (this.status.phase === 'playing') {
        if (this.round.phase === 'live') {
          this.simTime += dt
          this.updatePlayer(dt)
          this.updateBots(dt)
          this.updateBombVisual()

          // 回合时间到
          if (!this.round.bombPlanted && this.simTime >= this.round.endsAt) {
            this.endRound('CT')
          }
          // 炸弹爆炸
          if (
            this.round.bombPlanted &&
            this.simTime - this.bombPlantedAt >= this.round.bombTimer
          ) {
            A.playExplosion()
            this.endRound('T')
          }
        } else {
          this.bannerTimer -= dt
          if (this.bannerTimer <= 0) {
            this.nextRound()
          }
        }
      }

      this.syncHud()
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  /** 提供给 minimap 的实体可见性 */
  visibleEnemies(): { x: number; z: number; id: number }[] {
    const me = this.controlled()
    const out: { x: number; z: number; id: number }[] = []
    for (const e of this.entities) {
      if (!e.alive) continue
      if (e.team === me.team) {
        out.push({ x: e.pos.x, z: e.pos.z, id: e.id })
      } else if (aiCanSee(me, e)) {
        out.push({ x: e.pos.x, z: e.pos.z, id: e.id })
      }
    }
    return out
  }
}

/* ------------------------------------------------------------------ */
/* 辅助                                                               */
/* ------------------------------------------------------------------ */
function rayBox(
  ox: number,
  oy: number,
  oz: number,
  d: THREE.Vector3,
  minX: number,
  minY: number,
  minZ: number,
  maxX: number,
  maxY: number,
  maxZ: number
): number | null {
  let tmin = 0
  let tmax = Infinity
  const axes: [number, number, number, number, number][] = [
    [ox, d.x, minX, maxX, 0],
    [oy, d.y, minY, maxY, 1],
    [oz, d.z, minZ, maxZ, 2]
  ]
  for (const [o, dd, mn, mx] of axes) {
    if (Math.abs(dd) < 1e-8) {
      if (o < mn || o > mx) return null
    } else {
      const inv = 1 / dd
      let t1 = (mn - o) * inv
      let t2 = (mx - o) * inv
      if (t1 > t2) {
        const t = t1
        t1 = t2
        t2 = t
      }
      tmin = Math.max(tmin, t1)
      tmax = Math.min(tmax, t2)
      if (tmin > tmax) return null
    }
  }
  return tmin
}

export { zoneAt, floorHeightAt, hasLineOfSight, canSee, PLAYER_HEIGHT }

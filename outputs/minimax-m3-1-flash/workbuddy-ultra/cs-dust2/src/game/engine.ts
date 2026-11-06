import * as THREE from 'three'
import {
  DustMap, CELL, GRID, HALF, T_SPAWN, CT_SPAWN, A_SITE_CENTER, B_SITE_CENTER,
  MID_DOOR_CELLS, DOOR_OPEN, worldOf, cellOf,
} from './map'
import {
  WEAPONS, WeaponId, Slot, ZONE_LABEL, zoneForHit, applyArmor,
} from './weapons'
import { buildCharacter, buildViewModel, buildWorldScene, WorldHandles, CharacterRig } from './world'
import { Bot, updateBot, fireBotShot, rnd, BOT_NAMES, BotWorldView } from './ai'
import { audio } from './audio'

export type Phase = 'menu' | 'freeze' | 'live' | 'planted' | 'roundEnd' | 'matchEnd'

export interface KillFeedEntry { text: string; team: string; headshot: boolean; id: number }
export interface ScoreRow {
  name: string; team: string; hp: number; alive: boolean; kills: number; deaths: number; money: number
}

export interface HudState {
  phase: Phase
  round: number
  scoreCT: number
  scoreT: number
  timeLeft: number
  hp: number
  armor: number
  ammo: number
  mag: number
  weaponName: string
  weaponEn: string
  slot: Slot
  scoped: boolean
  alive: boolean
  aliveCT: number
  aliveT: number
  killfeed: KillFeedEntry[]
  bombPlanted: boolean
  bombTimer: number
  defuseProgress: number
  plantProgress: number
  hasBomb: boolean
  spectating: string | null
  scoreboard: ScoreRow[]
  crosshair: number
  hitMarker: number
  damageDir: number
  log: string[]
  minimap: {
    self: [number, number] | null
    teammates: [number, number][]
    enemies: [number, number][]
    bomb: [number, number] | null
    bombPlanted: boolean
    team: string
  }
}

interface Player {
  name: string
  x: number; y: number; z: number
  yaw: number; pitch: number
  vx: number; vy: number; vz: number
  onGround: boolean
  hp: number; armor: number; helmet: boolean
  alive: boolean
  slot: Slot
  weapons: { primary: WeaponId | null; secondary: WeaponId; melee: WeaponId }
  ammo: Partial<Record<WeaponId, number>>
  reloading: number
  nextShot: number
  spread: number
  recoilPitch: number
  recoilYaw: number
  kills: number; deaths: number
  team: 'CT' | 'T'
  spectating: number
  footTimer: number
}

const PLAYER_H = 1.8
const PLAYER_R = 0.38
const ROUND_TIME = 115
const FREEZE_TIME = 6
const BOMB_TIME = 40
const PLANT_TIME = 3.2
const DEFUSE_TIME = 10

export class Game {
  map = new DustMap()
  world!: WorldHandles
  player!: Player
  bots: Bot[] = []
  bomb = { carrier: null as number | null, x: 0, y: 0, z: 0, planted: false, site: null as 'A' | 'B' | null, timer: 0, defuse: 0, plant: 0 }
  phase: Phase = 'menu'
  round = 1
  scoreCT = 0
  scoreT = 0
  phaseTime = 0
  time = 0
  killfeed: KillFeedEntry[] = []
  log: string[] = []
  hitMarker = 0
  damageDir = 0
  private hudTimer = 0
  private onHud: (s: HudState) => void
  private raf = 0
  private clock = new THREE.Clock()
  private keys: Record<string, boolean> = {}
  private viewModel!: THREE.Group
  private viewScene = new THREE.Scene()
  private viewCam = new THREE.PerspectiveCamera(58, 1, 0.01, 20)
  private tracers: { line: THREE.Line; life: number }[] = []
  private muzzleLight: THREE.PointLight
  private muzzleFlash = 0
  private botRigs: CharacterRig[] = []
  private spectateIdx = 0
  private endRoundTimer = 0
  private winner: 'CT' | 'T' | null = null
  private started = false

  constructor(canvas: HTMLCanvasElement, onHud: (s: HudState) => void) {
    this.onHud = onHud
    this.world = buildWorldScene(this.map, canvas)
    this.viewModel = buildViewModel('glock')
    this.viewScene.add(this.viewModel)
    this.viewScene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1.4))
    const vl = new THREE.DirectionalLight(0xffffff, 1.2)
    vl.position.set(0.4, 1, 0.6)
    this.viewScene.add(vl)
    this.muzzleLight = new THREE.PointLight(0xffd18a, 0, 12, 2)
    this.viewScene.add(this.muzzleLight)
    this.setupPlayers()
    this.bindInput(canvas)
    this.resize()
    addEventListener('resize', () => this.resize())
  }

  // ---------------- setup ----------------
  private setupPlayers() {
    const p: Player = {
      name: '你',
      x: 0, y: 0, z: 0, yaw: 0, pitch: 0, vx: 0, vy: 0, vz: 0, onGround: false,
      hp: 100, armor: 0, helmet: false, alive: true, slot: 'secondary',
      weapons: { primary: null, secondary: 'glock', melee: 'knife' },
      ammo: {}, reloading: 0, nextShot: 0, spread: 0, recoilPitch: 0, recoilYaw: 0,
      kills: 0, deaths: 0, team: 'CT', spectating: -1, footTimer: 0,
    }
    const sp = worldOf(T_SPAWN[0][0], T_SPAWN[0][1])
    p.x = sp[0]; p.z = sp[1]
    p.y = 0
    this.player = p

    // four CT teammates + five attackers
    for (let i = 0; i < 4; i++) {
      this.bots.push(this.makeBot(i, 'CT', CT_SPAWN[i + 1]))
    }
    for (let i = 0; i < 5; i++) {
      this.bots.push(this.makeBot(100 + i, 'T', T_SPAWN[i]))
    }
    // the attackers carry the bomb
    this.bomb.carrier = this.bots[4].id
    this.bots[4].hasBomb = true
  }

  private makeBot(id: number, team: 'CT' | 'T', cell: [number, number]): Bot {
    const isT = team === 'T'
    const weapon: WeaponId = isT ? 'ak47' : 'm4a4'
    const rig = buildCharacter(team, id % 6, weapon)
    this.world.scene.add(rig.root)
    this.botRigs.push(rig)
    const [x, z] = worldOf(cell[0], cell[1])
    const bot: Bot = {
      id, name: BOT_NAMES[team][id % 5], team, x, y: 0, z, yaw: 0, pitch: 0, vx: 0, vz: 0,
      hp: 100, armor: 0, helmet: false, alive: true, weapon, ammo: WEAPONS[weapon].mag,
      reloading: 0, nextShot: 0, state: 'hold', path: [], pathIdx: 0, targetId: -1,
      reaction: 0.25 + rnd() * 0.3, aimError: 0.02, strafe: 1, strafeUntil: 0,
      repathAt: 0, hasBomb: false, plantProgress: 0, defuseProgress: 0, rig,
      aimX: x, aimY: 1.2, aimZ: z, burst: 0,
    }
    return bot
  }

  // ---------------- input ----------------
  private bindInput(canvas: HTMLCanvasElement) {
    addEventListener('keydown', (e) => {
      this.keys[e.code] = true
      if (e.code === 'Space') e.preventDefault()
      if (e.code === 'Digit1') this.switchSlot('primary')
      if (e.code === 'Digit2') this.switchSlot('secondary')
      if (e.code === 'Digit3') this.switchSlot('melee')
      if (e.code === 'KeyR') this.startReload()
      if (e.code === 'KeyQ') this.cycleSlot()
    })
    addEventListener('keyup', (e) => { this.keys[e.code] = false })
    addEventListener('mousedown', (e) => {
      if (!this.started) return
      if (document.pointerLockElement !== canvas) {
        const req = canvas.requestPointerLock()
        if (req && (req as any).catch) (req as any).catch(() => {})
        return
      }
      if (e.button === 0) this.fire()
      if (e.button === 2) this.toggleScope()
    })
    canvas.addEventListener('contextmenu', (e) => e.preventDefault())
    addEventListener('wheel', (e) => {
      if (document.pointerLockElement !== canvas) return
      this.cycleSlot(e.deltaY > 0 ? 1 : -1)
    }, { passive: true })
    addEventListener('mousemove', (e) => {
      if (document.pointerLockElement !== canvas) return
      if (!this.player.alive) return
      const sens = 0.0022
      this.player.yaw -= e.movementX * sens
      this.player.pitch -= e.movementY * sens
      this.player.pitch = Math.max(-1.5, Math.min(1.5, this.player.pitch))
    })
  }

  resize() {
    const w = innerWidth, h = innerHeight
    this.world.camera.aspect = w / h
    this.world.camera.updateProjectionMatrix()
    this.world.renderer.setSize(w, h)
    this.viewCam.aspect = w / h
    this.viewCam.updateProjectionMatrix()
  }

  // ---------------- round flow ----------------
  startMatch() {
    this.started = true
    this.round = 1
    this.scoreCT = 0
    this.scoreT = 0
    this.beginRound()
    this.clock.start()
    const loop = () => {
      this.raf = requestAnimationFrame(loop)
      this.frame()
    }
    loop()
  }

  private beginRound() {
    const pistolRound = this.round === 1
    this.phase = 'freeze'
    this.phaseTime = FREEZE_TIME
    this.killfeed = []
    this.log = []
    this.bomb = { carrier: null, x: 0, y: 0, z: 0, planted: false, site: null, timer: 0, defuse: 0, plant: 0 }
    this.map.doors.fill(0)
    this.resetPlayers(pistolRound)
    // hand the bomb to a random attacker
    const ts = this.bots.filter((b) => b.team === 'T')
    const carrier = ts[Math.floor(rnd() * ts.length)]
    carrier.hasBomb = true
    this.bomb.carrier = carrier.id
    this.pushLog(`第 ${this.round} 回合${pistolRound ? '（手枪局）' : ''} 开始`)
  }

  private resetPlayers(pistolRound: boolean) {
    const p = this.player
    p.hp = 100
    p.alive = true
    p.armor = pistolRound ? 0 : 100
    p.helmet = !pistolRound
    p.slot = 'secondary'
    p.weapons.primary = pistolRound ? null : 'm4a4'
    p.weapons.secondary = 'glock'
    p.ammo = { glock: 20, knife: 0 }
    if (!pistolRound) p.ammo.m4a4 = 30
    p.reloading = 0
    p.spread = 0
    p.recoilPitch = 0
    p.recoilYaw = 0
    p.spectating = -1
    const cts = this.bots.filter((b) => b.team === 'CT')
    const ts = this.bots.filter((b) => b.team === 'T')
    cts.forEach((b, i) => {
      const cell = CT_SPAWN[i % CT_SPAWN.length]
      const [x, z] = worldOf(cell[0], cell[1])
      b.x = x; b.z = z; b.y = 0; b.hp = 100; b.alive = true
      b.armor = pistolRound ? 0 : 100
      b.helmet = !pistolRound
      b.weapon = pistolRound ? (i % 2 === 0 ? 'usp' : 'deagle') : (i === 0 ? 'awp' : 'm4a4')
      b.ammo = WEAPONS[b.weapon].mag
      b.reloading = 0; b.state = 'hold'; b.path = []; b.repathAt = 0
      b.hasBomb = false; b.plantProgress = 0; b.defuseProgress = 0
    })
    ts.forEach((b, i) => {
      const cell = T_SPAWN[i % T_SPAWN.length]
      const [x, z] = worldOf(cell[0], cell[1])
      b.x = x; b.z = z; b.y = 0; b.hp = 100; b.alive = true
      b.armor = pistolRound ? 0 : 100
      b.helmet = !pistolRound
      b.weapon = pistolRound ? (i % 3 === 0 ? 'deagle' : 'glock') : (i === 0 ? 'awp' : 'ak47')
      b.ammo = WEAPONS[b.weapon].mag
      b.reloading = 0; b.state = 'hold'; b.path = []; b.repathAt = 0
      b.hasBomb = false; b.plantProgress = 0; b.defuseProgress = 0
    })
    const ps = worldOf(T_SPAWN[0][0], T_SPAWN[0][1])
    this.player.x = ps[0]; this.player.z = ps[1]
    this.player.yaw = Math.atan2(ps[0], ps[1])
    this.player.pitch = -0.05
  }

  private pushLog(s: string) {
    this.log = [...this.log.slice(-4), s]
  }

  private endRound(winner: 'CT' | 'T', reason: string) {
    if (this.phase === 'roundEnd' || this.phase === 'matchEnd') return
    this.phase = 'roundEnd'
    this.winner = winner
    this.endRoundTimer = 5
    if (winner === 'CT') this.scoreCT++; else this.scoreT++
    this.pushLog(reason)
    audio.roundWin(winner === this.player.team)
    // surviving attackers keep the bomb for the next round
    const carrier = this.bots.find((b) => b.hasBomb)
    this.bomb.carrier = null
    if (carrier) carrier.hasBomb = false
  }

  // ---------------- weapons ----------------
  private currentWeapon(): WeaponId {
    const p = this.player
    if (p.slot === 'primary' && p.weapons.primary) return p.weapons.primary
    if (p.slot === 'secondary') return p.weapons.secondary
    return p.weapons.melee
  }

  private switchSlot(slot: Slot) {
    const p = this.player
    if (slot === 'primary' && !p.weapons.primary) return
    p.slot = slot
    p.reloading = 0
    this.refreshViewModel()
  }

  private cycleSlot(dir = 1) {
    const p = this.player
    const order: Slot[] = ['primary', 'secondary', 'melee']
    const start = order.indexOf(p.slot)
    for (let i = 1; i <= 3; i++) {
      const s = order[(start + dir * i + 3 * 2) % 3]
      if (s === 'primary' && !p.weapons.primary) continue
      this.switchSlot(s)
      return
    }
  }

  private refreshViewModel() {
    const id = this.currentWeapon()
    this.viewScene.remove(this.viewModel)
    this.viewModel = buildViewModel(id)
    this.viewScene.add(this.viewModel)
  }

  private toggleScope() {
    const p = this.player
    const w = WEAPONS[this.currentWeapon()]
    if (!w.scoped) return
    p.slot = p.slot
    this.scoped = !this.scoped
    audio.scope(this.scoped)
  }
  scoped = false

  private startReload() {
    const p = this.player
    const id = this.currentWeapon()
    const w = WEAPONS[id]
    if (w.slot === 'melee') return
    const cur = p.ammo[id] ?? 0
    if (cur >= w.mag || p.reloading > 0) return
    p.reloading = w.reload
    audio.reload()
  }

  private fire() {
    const p = this.player
    if (!p.alive || this.phase !== 'live' && this.phase !== 'planted') return
    const id = this.currentWeapon()
    const w = WEAPONS[id]
    if (p.reloading > 0) return
    if (w.slot !== 'melee') {
      if ((p.ammo[id] ?? 0) <= 0) { audio.emptyClick(); this.startReload(); return }
      p.ammo[id] = (p.ammo[id] ?? 0) - 1
    }
    if (this.time < p.nextShot) return
    p.nextShot = this.time + 60 / w.rpm

    // recoil + spread
    p.pitch += w.recoilUp
    p.yaw += (rnd() - 0.5) * w.recoilSide * 2
    p.spread = Math.min(w.maxSpread, p.spread + w.spreadGrow)
    this.muzzleFlash = 0.05
    this.muzzleLight.intensity = 6
    audio.shot(w.sound, 0)

    const origin = new THREE.Vector3(p.x, p.y + 1.62, p.z)
    const dir = new THREE.Vector3()
    this.world.camera.getWorldDirection(dir)
    // apply the current spread as a random cone offset
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize()
    const up = new THREE.Vector3().crossVectors(right, dir).normalize()
    const s = p.spread
    dir.addScaledVector(right, (rnd() - 0.5) * s * 2).addScaledVector(up, (rnd() - 0.5) * s * 2).normalize()

    const wallDist = this.rayWallDistance(origin, dir, w.range)
    let bestT = Math.min(wallDist, w.range)
    let victim: Bot | null = null
    let hitZone: string | null = null

    for (const b of this.bots) {
      if (!b.alive || b.team === p.team) continue
      const t = this.raycastCharacter(origin, dir, b, bestT)
      if (t !== null && t < bestT) {
        bestT = t
        victim = b
        const hitY = origin.y + dir.y * t
        const lateral = Math.abs(Math.hypot(origin.x + dir.x * t - b.x, origin.z + dir.z * t - b.z))
        hitZone = zoneForHit(hitY, lateral)
      }
    }

    if (victim && hitZone) {
      const mult = hitZone === 'head' ? w.headMult : hitZone === 'chest' ? 1 : hitZone === 'stomach' ? 1.25 : 0.75
      let dmg = w.damage * mult
      dmg = applyArmor(dmg, victim.armor, w.armorPen)
      this.damageBot(victim, dmg, hitZone, p.team, w.name, false)
      this.hitMarker = 0.18
      audio.hit(hitZone === 'head')
    } else {
      this.spawnTracer(origin, origin.clone().addScaledVector(dir, bestT))
    }
  }

  private damageBot(bot: Bot, dmg: number, zone: string, byTeam: 'CT' | 'T', weaponName: string, headshot: boolean) {
    bot.hp -= dmg
    if (bot.hp <= 0) {
      bot.alive = false
      if (byTeam === this.player.team) this.player.kills++
      else this.player.deaths++
      this.killfeed = [{ text: `${weaponName} 击杀 ${bot.name}`, team: byTeam, headshot: zone === 'head', id: Date.now() + Math.random() }, ...this.killfeed].slice(0, 6)
      audio.kill()
      // the bomb drops where the carrier died
      if (bot.hasBomb) {
        bot.hasBomb = false
        this.bomb.carrier = null
        this.bomb.x = bot.x
        this.bomb.z = bot.z
        this.bomb.y = 0.4
        this.pushLog('C4 已掉落')
      }
    }
  }

  private rayWallDistance(origin: THREE.Vector3, dir: THREE.Vector3, maxDist: number): number {
    const step = 0.22
    for (let d = 0.4; d < maxDist; d += step) {
      const x = origin.x + dir.x * d
      const y = origin.y + dir.y * d
      const z = origin.z + dir.z * d
      if (y < 0) return d
      if (this.map.solidAt(x, z, y)) return d
    }
    return maxDist
  }

  private raycastCharacter(o: THREE.Vector3, d: THREE.Vector3, bot: Bot, maxT: number): number | null {
    const dx = d.x, dz = d.z
    const dl = dx * dx + dz * dz
    if (dl < 1e-6) return null
    const ox = bot.x - o.x
    const oz = bot.z - o.z
    let t = (ox * dx + oz * dz) / dl
    if (t < 0.3 || t > maxT) return null
    const px = o.x + dx * t
    const pz = o.z + dz * t
    const dist = Math.hypot(bot.x - px, bot.z - pz)
    if (dist > 0.45) return null
    const y = o.y + d.y * t
    if (y < bot.y || y > bot.y + 1.95) return null
    return t
  }

  private spawnTracer(from: THREE.Vector3, to: THREE.Vector3) {
    const g = new THREE.BufferGeometry().setFromPoints([from, to])
    const m = new THREE.LineBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.85 })
    const line = new THREE.Line(g, m)
    this.world.scene.add(line)
    this.tracers.push({ line, life: 0.08 })
  }

  // ---------------- player update ----------------
  private updatePlayer(dt: number) {
    const p = this.player
    if (!p.alive) {
      // spectate a living teammate
      const mates = this.bots.filter((b) => b.team === p.team && b.alive)
      if (mates.length) {
        if (p.spectating < 0 || !this.bots.some((b) => b.id === p.spectating && b.alive)) {
          p.spectating = mates[0].id
        }
        const s = this.bots.find((b) => b.id === p.spectating)
        if (s) {
          const cam = this.world.camera
          cam.position.set(s.x, s.y + 1.62, s.z)
          cam.rotation.set(0, 0, 0, 'YXZ')
          cam.rotation.y = s.yaw
          cam.rotation.x = s.pitch
          this.world.camera.fov = 76
          this.world.camera.updateProjectionMatrix()
        }
      } else {
        this.world.camera.position.set(p.x, p.y + 1.6, p.z)
        this.world.camera.rotation.set(0, p.yaw, 0, 'YXZ')
      }
      return
    }

    const w = WEAPONS[this.currentWeapon()]
    const speed = 5.2 * w.moveSpeed * (this.scoped ? 0.45 : 1)
    const fx = -Math.sin(p.yaw), fz = -Math.cos(p.yaw)
    const rx = Math.cos(p.yaw), rz = -Math.sin(p.yaw)
    let mx = 0, mz = 0
    if (this.keys['KeyW']) { mx += fx; mz += fz }
    if (this.keys['KeyS']) { mx -= fx; mz -= fz }
    if (this.keys['KeyA']) { mx -= rx; mz -= rz }
    if (this.keys['KeyD']) { mx += rx; mz += rz }
    const len = Math.hypot(mx, mz)
    if (len > 0) { mx = mx / len * speed; mz = mz / len * speed }
    const accel = p.onGround ? 16 : 6
    p.vx += (mx - p.vx) * Math.min(1, accel * dt)
    p.vz += (mz - p.vz) * Math.min(1, accel * dt)
    p.vy -= 24 * dt
    if (this.keys['Space'] && p.onGround) { p.vy = 7.4; p.onGround = false }

    // axis separated movement against the wall grid
    const tryMove = (nx: number, nz: number) => {
      if (!this.map.solidAt(nx, nz, p.y + 0.9) && !this.map.solidAt(nx, nz, p.y + 0.2)) {
        p.x = nx; p.z = nz
        return true
      }
      return false
    }
    tryMove(p.x + p.vx * dt, p.z)
    tryMove(p.x, p.z + p.vz * dt)
    const ny = p.y + p.vy * dt
    if (!this.map.solidAt(p.x, p.z, ny + 0.1) && ny >= 0) {
      p.y = ny
      p.onGround = false
    } else {
      if (p.vy < 0) p.onGround = true
      p.vy = 0
    }
    if (p.y < 0) { p.y = 0; p.onGround = true }

    // footstep audio
    p.footTimer -= dt
    if (p.onGround && (Math.abs(p.vx) + Math.abs(p.vz)) > 1.2 && p.footTimer <= 0) {
      audio.step()
      p.footTimer = 0.42
    }

    // reload
    if (p.reloading > 0) {
      p.reloading -= dt
      if (p.reloading <= 0) {
        const id = this.currentWeapon()
        p.ammo[id] = WEAPONS[id].mag
      }
    }

    // recoil recovery + spread recovery
    p.recoilPitch += (0 - p.recoilPitch) * Math.min(1, dt * 6)
    p.spread = Math.max(w.spread, p.spread - w.spreadGrow * dt * 4)

    // camera
    const cam = this.world.camera
    cam.position.set(p.x, p.y + 1.62, p.z)
    cam.rotation.set(p.pitch, p.yaw, 0, 'YXZ')
    const targetFov = this.scoped ? 22 : 76
    cam.fov += (targetFov - cam.fov) * Math.min(1, dt * 12)
    cam.updateProjectionMatrix()
  }

  private updateViewModel(dt: number) {
    const p = this.player
    const w = WEAPONS[this.currentWeapon()]
    const bob = p.onGround && (Math.abs(p.vx) + Math.abs(p.vz)) > 0.5 ? Math.sin(this.time * 9) * 0.012 : 0
    const reloadDip = p.reloading > 0 ? Math.sin((1 - p.reloading / Math.max(0.01, w.reload)) * Math.PI) * 0.12 : 0
    this.viewModel.position.set(0.18, -0.16 + bob - reloadDip, -0.45 - p.spread * 0.6)
    this.viewModel.rotation.set(-p.recoilPitch * 1.6 + reloadDip * 1.2, 0.06, 0)
    if (this.muzzleFlash > 0) {
      this.muzzleFlash -= dt
      this.muzzleLight.intensity = Math.max(0, this.muzzleFlash / 0.05) * 6
    } else this.muzzleLight.intensity = 0
  }

  // ---------------- bots ----------------
  private updateBots(dt: number) {
    const wv: BotWorldView = {
      map: this.map, bots: this.bots,
      player: { x: this.player.x, y: this.player.y, z: this.player.z, team: this.player.team, alive: this.player.alive, hp: this.player.hp },
      bomb: this.bomb, time: this.time,
    }
    for (const b of this.bots) {
      const before = b.hp
      updateBot(wv, b, dt)
      // bots shoot the human player too
      if (b.alive && b.state === 'engage') {
        const d = Math.hypot(this.player.x - b.x, this.player.z - b.z)
        if (this.player.alive && d < 70 && this.map.lineOfSight(b.x, b.z, this.player.x, this.player.z, 1.6)) {
          const w = WEAPONS[b.weapon]
          if (b.ammo > 0 && this.time >= b.nextShot) {
            b.nextShot = this.time + 60 / w.rpm
            b.ammo--
            if (b.ammo === 0) b.reloading = w.reload
            const hit = rnd() < w.spread + w.spreadGrow * 0.6 * (1 + d / 30)
            if (hit) {
              let dmg = w.damage * 1.0
              dmg = applyArmor(dmg, this.player.armor, w.armorPen)
              this.player.hp -= dmg
              this.damageDir = Math.atan2(this.player.x - b.x, this.player.z - b.z) - this.player.yaw
              audio.hit(false)
              if (this.player.hp <= 0) {
                this.player.hp = 0
                this.player.alive = false
                this.player.deaths++
                this.player.spectating = -1
                this.killfeed = [{ text: `${w.name} 击杀 ${this.player.name}`, team: b.team, headshot: false, id: Date.now() + Math.random() }, ...this.killfeed].slice(0, 6)
                audio.kill()
              }
            }
          }
        }
      }
      void before
    }
  }

  // ---------------- round update ----------------
  private updateRound(dt: number) {
    const aliveCT = this.bots.filter((b) => b.team === 'CT' && b.alive).length + (this.player.alive && this.player.team === 'CT' ? 1 : 0)
    const aliveT = this.bots.filter((b) => b.team === 'T' && b.alive).length + (this.player.alive && this.player.team === 'T' ? 1 : 0)

    // mid doors swing open shortly after the round starts
    if (this.phase === 'live' || this.phase === 'planted') {
      for (let i = 0; i < this.map.doors.length; i++) {
        if (this.map.doors[i] < 1) this.map.doors[i] = Math.min(1, this.map.doors[i] + dt / DOOR_OPEN)
      }
    }

    if (this.phase === 'freeze') {
      this.phaseTime -= dt
      if (this.phaseTime <= 0) { this.phase = 'live'; this.phaseTime = ROUND_TIME }
    } else if (this.phase === 'live') {
      this.phaseTime -= dt
      if (this.phaseTime <= 0) { this.endRound('CT', '回合时间耗尽，CT 获胜'); return }
      if (aliveT === 0) { this.endRound('CT', 'CT 队清空 T 队'); return }
      if (aliveCT === 0) { this.endRound('T', 'T 队清空 CT 队'); return }
      this.tryPlant(dt, aliveT)
    } else if (this.phase === 'planted') {
      this.phaseTime -= dt
      this.bomb.timer -= dt
      if (this.bomb.timer <= 0) { this.endRound('T', 'C4 爆炸'); return }
      // defuse
      for (const b of this.bots) {
        if (!b.alive || b.team !== 'CT') continue
        if (Math.hypot(b.x - this.bomb.x, b.z - this.bomb.z) < 1.4) {
          b.defuseProgress += dt
          this.bomb.defuse = Math.max(this.bomb.defuse, b.defuseProgress / DEFUSE_TIME)
          if (b.defuseProgress >= DEFUSE_TIME) { this.endRound('CT', 'C4 已被拆除'); return }
        }
      }
      if (aliveT === 0) { this.endRound('CT', 'CT 队清空 T 队'); return }
    } else if (this.phase === 'roundEnd') {
      this.endRoundTimer -= dt
      if (this.endRoundTimer <= 0) {
        this.round++
        if (this.round > 10) { this.phase = 'matchEnd' } else { this.beginRound() }
      }
    }
  }

  private tryPlant(dt: number, aliveT: number) {
    const carrier = this.bots.find((b) => b.hasBomb)
    if (!carrier) return
    const [ax, az] = worldOf(...A_SITE_CENTER)
    const [bx, bz] = worldOf(...B_SITE_CENTER)
    const atA = Math.hypot(carrier.x - ax, carrier.z - az) < 6
    const atB = Math.hypot(carrier.x - bx, carrier.z - bz) < 6
    if (carrier.state === 'plant' && (atA || atB)) {
      carrier.plantProgress += dt
      this.bomb.plant = carrier.plantProgress / PLANT_TIME
      if (carrier.plantProgress >= PLANT_TIME) {
        this.bomb.planted = true
        this.bomb.site = atA ? 'A' : 'B'
        this.bomb.timer = BOMB_TIME
        this.bomb.x = carrier.x
        this.bomb.z = carrier.z
        this.bomb.carrier = null
        carrier.hasBomb = false
        this.phase = 'planted'
        this.phaseTime = BOMB_TIME
        this.pushLog(`C4 已在 ${this.bomb.site} 点安放`)
        audio.plant()
      }
    } else {
      carrier.plantProgress = 0
      this.bomb.plant = 0
    }
    void aliveT
  }

  // ---------------- main loop ----------------
  private frame() {
    const dt = Math.min(0.05, this.clock.getDelta())
    this.time += dt
    this.updateRound(dt)
    if (this.phase === 'live' || this.phase === 'planted' || this.phase === 'freeze') {
      this.updatePlayer(dt)
      this.updateBots(dt)
    }
    this.updateViewModel(dt)
    this.hitMarker = Math.max(0, this.hitMarker - dt)

    for (const t of this.tracers) {
      t.life -= dt
      ;(t.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, t.life / 0.08)
      if (t.life <= 0) {
        this.world.scene.remove(t.line)
        t.line.geometry.dispose()
      }
    }
    this.tracers = this.tracers.filter((t) => t.life > 0)

    this.world.renderer.autoClear = false
    this.world.renderer.clear()
    this.world.renderer.render(this.world.scene, this.world.camera)
    this.world.renderer.clearDepth()
    this.world.renderer.render(this.viewScene, this.viewCam)

    this.hudTimer -= dt
    if (this.hudTimer <= 0) {
      this.hudTimer = 1 / 20
      this.pushHud()
    }
  }

  private pushHud() {
    const p = this.player
    const id = this.currentWeapon()
    const w = WEAPONS[id]
    const aliveCT = this.bots.filter((b) => b.team === 'CT' && b.alive).length + (p.alive && p.team === 'CT' ? 1 : 0)
    const aliveT = this.bots.filter((b) => b.team === 'T' && b.alive).length + (p.alive && p.team === 'T' ? 1 : 0)
    const teammates: [number, number][] = this.bots
      .filter((b) => b.team === p.team && b.alive)
      .map((b) => [b.x, b.z] as [number, number])
    const enemies: [number, number][] = this.bots
      .filter((b) => b.team !== p.team && b.alive && this.map.lineOfSight(p.x, p.z, b.x, b.z, 1.6))
      .map((b) => [b.x, b.z] as [number, number])
    const scoreboard: ScoreRow[] = [
      { name: p.name, team: p.team, hp: p.hp, alive: p.alive, kills: p.kills, deaths: p.deaths, money: 0 },
      ...this.bots.map((b) => ({
        name: b.name, team: b.team, hp: Math.max(0, b.hp), alive: b.alive,
        kills: b.team === p.team ? 0 : 0, deaths: 0, money: 0,
      })),
    ]
    this.onHud({
      phase: this.phase,
      round: this.round,
      scoreCT: this.scoreCT,
      scoreT: this.scoreT,
      timeLeft: Math.max(0, this.phaseTime),
      hp: Math.max(0, Math.round(p.hp)),
      armor: Math.round(p.armor),
      ammo: p.ammo[id] ?? 0,
      mag: w.mag,
      weaponName: w.name,
      weaponEn: w.nameEn,
      slot: p.slot,
      scoped: this.scoped,
      alive: p.alive,
      aliveCT, aliveT,
      killfeed: this.killfeed,
      bombPlanted: this.bomb.planted,
      bombTimer: this.bomb.timer,
      defuseProgress: this.bomb.defuse,
      plantProgress: this.bomb.plant,
      hasBomb: this.bomb.carrier !== null,
      spectating: p.alive ? null : (this.bots.find((b) => b.id === p.spectating)?.name ?? '观战中'),
      scoreboard,
      crosshair: 6 + p.spread * 420 + (this.scoped ? 0 : 0),
      hitMarker: this.hitMarker,
      damageDir: this.damageDir,
      log: this.log,
      minimap: {
        self: p.alive ? [p.x, p.z] : null,
        teammates,
        enemies,
        bomb: this.bomb.planted ? [this.bomb.x, this.bomb.z] : this.bomb.carrier !== null ? [this.bomb.x, this.bomb.z] : null,
        bombPlanted: this.bomb.planted,
        team: p.team,
      },
    })
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.world.renderer.dispose()
  }

  name = 'Player'
}
export function createGame(canvas: HTMLCanvasElement, onHud: (s: HudState) => void) {
  return new Game(canvas, onHud)
}

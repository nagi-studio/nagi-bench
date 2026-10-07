import {
  ARMOR_ABSORB,
  ARMOR_NORMAL,
  ARMOR_PISTOL,
  BANNER_TIME,
  DEFUSE_TIME,
  EXPLOSION_RADIUS,
  FREEZE_TIME,
  PICKUP_RADIUS,
  PLANT_TIME,
  RUN_SPEED,
  ROUND_END_DELAY,
  ROUND_TIME,
  SPOT_TIME,
  TEAM_SIZE,
  WIN_SCORE,
} from '../config.ts'
import { Character, type Loadout } from '../entities/character.ts'
import { Brain, type BotWorldView, type NoiseEvent, type Plan } from '../ai/brain.ts'
import { buildMapData, type DoorDef, type MapData } from '../map/mapData.ts'
import { LAYOUT, cellCenter, namedPoint, siteAtWorld, type NamedPoint } from '../map/layout.ts'
import { NavGrid } from '../nav/navGrid.ts'
import { moveBody, updateVertical, type Aabb } from '../physics/physics.ts'
import { canSee, fireBullet, meleeTarget, partDamage } from '../combat/combat.ts'
import { Bomb } from '../round/bomb.ts'
import { evaluateRound, matchWinner } from '../round/match.ts'
import { DEFAULT_PISTOL, WEAPONS, type WeaponId, type Slot } from '../weapons/weapons.ts'
import { clamp, distXZ, shuffle, yawTowards, angleDiff, type Vec2 } from '../core/mathUtil.ts'
import {
  emptyIntent,
  type HitPart,
  type HudState,
  type Intent,
  type KillEntry,
  type MatchPhase,
  type Team,
  type WorldEvent,
} from '../types.ts'

export interface WorldConfig {
  playerTeam: Team
  primary: WeaponId | null
  secondary: WeaponId
  /** 第一回合是否为手枪局（全员只带默认手枪、护甲按手枪局配置） */
  startWithPistolRound: boolean
  winScore?: number
}

/** 玩家当前按住的键（每帧由控制器写入） */
export interface HumanHeld {
  forward: number
  strafe: number
  jump: boolean
  fire: boolean
  interactHeld: boolean
}

interface PendingPress {
  slot: Slot | null
  reloadPressed: boolean
  altPressed: boolean
  interactPressed: boolean
}

export interface DoorState {
  def: DoorDef
  open: boolean
}

const BOT_NAMES = ['Ava', 'Blaze', 'Crow', 'Dex', 'Echo', 'Frost', 'Gale', 'Hawk', 'Iron', 'Jet', 'Kilo', 'Lynx', 'Nova', 'Onyx']
const SPAWN_SPACING = 2.4
const SPOT_INTERVAL = 0.1
const NOISE_LIFE = 2
const KILLFEED_MAX = 6
const DOOR_RANGE = 2.6
const T_PLANS: Plan[] = ['A', 'B', 'A', 'B', 'A']
const CT_SPOTS: { plan: Plan; point: NamedPoint; threat: NamedPoint }[] = [
  { plan: 'A', point: 'aHoldA', threat: 'longA' },
  { plan: 'A', point: 'aHoldB', threat: 'shortA' },
  { plan: 'B', point: 'bHoldA', threat: 'catwalk' },
  { plan: 'B', point: 'bHoldB', threat: 'bTunnel' },
  { plan: 'mid', point: 'midHold', threat: 'midDoorsNorth' },
]

function spawnCells(ch: string): Vec2[] {
  const out: Vec2[] = []
  for (let r = 0; r < LAYOUT.length; r++) {
    for (let c = 0; c < LAYOUT[r].length; c++) if (LAYOUT[r][c] === ch) out.push(cellCenter(c, r))
  }
  return out
}

function pickSpawns(cands: Vec2[], n: number): Vec2[] {
  const pool = shuffle([...cands])
  const picked: Vec2[] = []
  for (const p of pool) {
    if (picked.every((q) => distXZ(p.x, p.z, q.x, q.z) >= SPAWN_SPACING)) picked.push(p)
    if (picked.length === n) break
  }
  while (picked.length < n) picked.push(pool[picked.length % pool.length])
  return picked
}

/**
 * 游戏逻辑世界（纯 TypeScript，不依赖 three / React）。
 * 每个固定 tick（FIXED_DT）执行 step()：回合阶段 → 角色意图（玩家 / AI）→ 物理与武器 → 炸弹 → 胜负判定。
 * 表现层通过 drainEvents() 取事件，通过 buildHud() 取只读快照。
 */
export class GameWorld implements BotWorldView {
  readonly map: MapData
  readonly colliders: Aabb[]
  readonly doors: DoorState[]
  readonly nav: NavGrid
  readonly characters: Character[] = []
  readonly bomb = new Bomb()
  readonly playerTeam: Team
  readonly playerId = 0
  readonly winScore: number

  time = 0
  round = 0
  pistolRound = false
  phase: MatchPhase = 'freeze'
  phaseT = FREEZE_TIME
  roundTimeLeft = ROUND_TIME
  scores: Record<Team, number> = { T: 0, CT: 0 }
  winner: Team | null = null
  reason = ''
  humanId = 0
  spectateId: number | null = null
  noises: NoiseEvent[] = []
  killfeed: KillEntry[] = []
  banner: { id: number; text: string; until: number } | null = null
  hitCount = 0
  damageCount = 0
  lastDamageAngle = 0

  private readonly cfg: WorldConfig
  private readonly brains = new Map<number, Brain>()
  private readonly spawnCands: Record<Team, Vec2[]>
  private spawns: Record<Team, Vec2[]> = { T: [], CT: [] }
  private events: WorldEvent[] = []
  private held: HumanHeld = { forward: 0, strafe: 0, jump: false, fire: false, interactHeld: false }
  private pending: PendingPress = { slot: null, reloadPressed: false, altPressed: false, interactPressed: false }
  private spotT = 0
  private beepSec = -1
  private nextFeedId = 1
  private bannerId = 0

  constructor(cfg: WorldConfig) {
    this.cfg = cfg
    this.playerTeam = cfg.playerTeam
    this.winScore = cfg.winScore ?? WIN_SCORE
    this.map = buildMapData()
    this.colliders = this.map.colliders
    this.doors = this.map.doors.map((def) => ({ def, open: false }))
    this.nav = new NavGrid()
    this.spawnCands = { T: spawnCells('T'), CT: spawnCells('C') }

    const enemyTeam: Team = cfg.playerTeam === 'T' ? 'CT' : 'T'
    const names = shuffle([...BOT_NAMES])
    let bi = 0
    for (const team of [cfg.playerTeam, enemyTeam]) {
      for (let k = 0; k < TEAM_SIZE; k++) {
        const isPlayer = team === cfg.playerTeam && k === 0
        const name = isPlayer ? '你' : names[bi++]
        this.characters.push(new Character(this.characters.length, name, team))
      }
    }
    for (const c of this.characters) {
      if (c.id === this.playerId) continue
      const d = this.defensePlan(c.team, c.id % TEAM_SIZE)
      this.brains.set(c.id, new Brain(c, d.plan, d.anchor, d.face))
    }
    this.beginRound()
  }

  // ---------------------------------------------------------------- 对外接口

  get freeze(): boolean {
    return this.phase !== 'live'
  }

  byId(id: number): Character {
    return this.characters[id]
  }

  setHumanHeld(h: HumanHeld): void {
    this.held = h
  }

  /** 边沿类输入（按下即生效一次）。在两个 tick 之间累积，直到下一个 tick 被消费。 */
  queueHumanPress(p: Partial<PendingPress>): void {
    if (p.slot) this.pending.slot = p.slot
    if (p.reloadPressed) this.pending.reloadPressed = true
    if (p.altPressed) this.pending.altPressed = true
    if (p.interactPressed) this.pending.interactPressed = true
  }

  drainEvents(): WorldEvent[] {
    const out = this.events
    this.events = []
    return out
  }

  /** 玩家阵亡后切换观察的队友（dir = ±1） */
  cycleSpectate(dir: number): void {
    const mates = this.characters.filter((c) => c.alive && c.team === this.playerTeam && c.id !== this.humanId)
    if (mates.length === 0) {
      this.spectateId = null
      return
    }
    const idx = mates.findIndex((c) => c.id === this.spectateId)
    const next = (idx + dir + mates.length * 2) % mates.length
    this.spectateId = mates[next].id
  }

  /** 玩家已阵亡且观察的队友存活时，接管该队友的操控（原角色保持阵亡直到下一回合） */
  takeControl(): boolean {
    if (this.byId(this.humanId).alive || this.spectateId === null) return false
    const target = this.byId(this.spectateId)
    if (!target.alive) return false
    this.humanId = target.id
    this.spectateId = null
    this.setBanner(`已接管 ${target.name}`, BANNER_TIME)
    return true
  }

  siteAt(x: number, z: number): 'A' | 'B' | null {
    return siteAtWorld(x, z)
  }

  closedDoorNear(x: number, z: number, radius: number): boolean {
    return this.doors.some((d) => !d.open && distXZ(x, z, this.doorCenterX(d.def), d.def.hingeZ) < radius)
  }

  // ---------------------------------------------------------------- 主循环

  step(dt: number): void {
    this.time += dt
    this.updatePhase(dt)

    for (const c of this.characters) {
      const intent = c.id === this.humanId ? this.takeHumanIntent() : this.intentForBot(c, dt)
      this.applyCharacter(c, intent, dt)
    }

    this.updateBomb(dt)
    if (this.phase === 'live') {
      this.roundTimeLeft -= dt
      this.checkRoundEnd()
    }
    this.updateSpotting(dt)
    this.noises = this.noises.filter((n) => this.time - n.t < NOISE_LIFE)
  }

  // ---------------------------------------------------------------- 回合流程

  private beginRound(): void {
    this.round += 1
    this.pistolRound = this.round === 1 && this.cfg.startWithPistolRound
    this.phase = 'freeze'
    this.phaseT = FREEZE_TIME
    this.roundTimeLeft = ROUND_TIME
    this.winner = null
    this.reason = ''
    this.humanId = this.playerId
    this.spectateId = null
    this.noises = []
    this.pending = { slot: null, reloadPressed: false, altPressed: false, interactPressed: false }
    this.spawns = { T: pickSpawns(this.spawnCands.T, TEAM_SIZE), CT: pickSpawns(this.spawnCands.CT, TEAM_SIZE) }

    for (const c of this.characters) {
      const k = c.id % TEAM_SIZE
      const sp = this.spawns[c.team][k]
      c.x = sp.x
      c.z = sp.z
      c.y = 0
      c.vy = 0
      c.onGround = true
      c.speed = 0
      c.stepDist = 0
      c.yaw = yawTowards(-sp.x, -sp.z) // 出生即面向地图中心
      c.pitch = 0
      c.punch = 0
      c.hp = 100
      c.alive = true
      c.hasBomb = false
      c.hasKit = c.team === 'CT'
      c.action = null
      const armor = this.pistolRound ? ARMOR_PISTOL : ARMOR_NORMAL
      const loadout: Loadout = this.pistolRound
        ? { primary: null, secondary: DEFAULT_PISTOL[c.team] }
        : c.id === this.playerId
          ? { primary: this.cfg.primary, secondary: this.cfg.secondary }
          : this.botLoadout(c.team)
      c.equip(loadout, armor)
      this.brains.get(c.id)?.reset()
    }

    // 回合开始：随机一名 T 持有 C4
    const terrorists = this.characters.filter((c) => c.team === 'T')
    const carrier = terrorists[Math.floor(Math.random() * terrorists.length)]
    carrier.hasBomb = true
    this.bomb.giveTo(carrier.id)
    this.bomb.x = carrier.x
    this.bomb.y = carrier.y
    this.bomb.z = carrier.z

    this.emit({ type: 'roundStart', round: this.round, pistol: this.pistolRound })
    this.setBanner(this.pistolRound ? '手枪局 · 第 1 回合' : `第 ${this.round} 回合`, BANNER_TIME)
  }

  private updatePhase(dt: number): void {
    if (this.phase === 'freeze') {
      this.phaseT -= dt
      if (this.phaseT <= 0) {
        this.phase = 'live'
        this.setBanner('开始！', 1.5)
      }
    } else if (this.phase === 'roundEnd') {
      this.phaseT -= dt
      if (this.phaseT <= 0) {
        const mw = matchWinner(this.scores, this.winScore)
        if (mw) {
          this.phase = 'matchOver'
          this.winner = mw
          this.emit({ type: 'matchEnd', winner: mw })
          this.setBanner(`${mw === this.playerTeam ? '你方' : '敌方'}（${mw}）赢得比赛`, 9999)
        } else {
          this.beginRound()
        }
      }
    }
  }

  private checkRoundEnd(): void {
    const aliveT = this.characters.filter((c) => c.alive && c.team === 'T').length
    const aliveCT = this.characters.filter((c) => c.alive && c.team === 'CT').length
    const r = evaluateRound({ aliveT, aliveCT, bombState: this.bomb.state, roundTimeLeft: this.roundTimeLeft })
    if (r) this.endRound(r.winner, r.reason)
  }

  private endRound(winner: Team, reason: string): void {
    if (this.phase !== 'live') return
    this.phase = 'roundEnd'
    this.phaseT = ROUND_END_DELAY
    this.winner = winner
    this.reason = reason
    this.scores[winner] += 1
    this.emit({ type: 'roundEnd', winner, reason })
    this.setBanner(`${winner} 胜利 · ${reason}`, BANNER_TIME + 1)
  }

  // ---------------------------------------------------------------- 角色逻辑

  private intentForBot(c: Character, dt: number): Intent {
    const brain = this.brains.get(c.id)
    return brain ? brain.intentFor(this, dt) : emptyIntent()
  }

  private takeHumanIntent(): Intent {
    const p = this.pending
    const out: Intent = {
      forward: this.held.forward,
      strafe: this.held.strafe,
      jump: this.held.jump,
      fire: this.held.fire,
      interactHeld: this.held.interactHeld,
      slot: p.slot,
      reloadPressed: p.reloadPressed,
      altPressed: p.altPressed,
      interactPressed: p.interactPressed,
    }
    this.pending = { slot: null, reloadPressed: false, altPressed: false, interactPressed: false }
    return out
  }

  /** 单个角色的一个 tick：武器 → 移动 → 交互 → 开火 → 恢复 */
  private applyCharacter(c: Character, intent: Intent, dt: number): void {
    c.fireCooldown = Math.max(0, c.fireCooldown - dt)
    if (!c.alive) {
      c.speed = 0
      c.fireHeld = false
      updateVertical(c, dt, false, this.colliders)
      return
    }
    const frozen = this.phase !== 'live'

    if (intent.slot) c.switchTo(intent.slot)
    if (intent.reloadPressed && c.startReload()) this.emit({ type: 'reload', x: c.x, y: c.y, z: c.z, weapon: c.weapon.id })
    const def = c.weapon
    if (intent.altPressed && def.scope) {
      c.scoped = !c.scoped
      this.emit({ type: 'scope', x: c.x, y: c.y, z: c.z, on: c.scoped })
    }

    // 水平移动：输入向量按偏航角旋转为世界方向
    let speed = RUN_SPEED * def.moveMul * (c.scoped && def.scope ? def.scope.moveMul : 1)
    if (frozen || c.action) speed = 0
    let f = clamp(intent.forward, -1, 1)
    let s = clamp(intent.strafe, -1, 1)
    const len = Math.hypot(f, s)
    if (len > 1) {
      f /= len
      s /= len
    }
    const sn = Math.sin(c.yaw)
    const cs = Math.cos(c.yaw)
    const wx = -f * sn + s * cs
    const wz = -f * cs - s * sn
    const px = c.x
    const pz = c.z
    moveBody(c, wx * speed * dt, wz * speed * dt, this.colliders)
    const moved = Math.hypot(c.x - px, c.z - pz)
    c.speed = moved / dt
    if (c.onGround && moved > 0) {
      c.stepDist += moved
      if (c.stepDist > 2.2) {
        c.stepDist = 0
        this.emit({ type: 'footstep', x: c.x, y: c.y, z: c.z, team: c.team })
      }
    }
    updateVertical(c, dt, intent.jump && !frozen && !c.action, this.colliders)

    if (!frozen) {
      this.updateInteraction(c, intent, dt)
      this.updateFire(c, intent)
    }

    if (c.reloadLeft > 0) {
      c.reloadLeft -= dt
      if (c.reloadLeft <= 0) c.finishReload()
    }
    c.punch *= Math.exp(-def.recoilRecover * dt)
    c.spread = Math.max(0, c.spread - def.spreadRecover * dt)
  }

  private updateFire(c: Character, intent: Intent): void {
    const wasHeld = c.fireHeld
    c.fireHeld = intent.fire
    const def = c.weapon

    if (def.slot === 'melee') {
      const stab = intent.altPressed
      const slash = intent.fire && !wasHeld
      if ((!stab && !slash) || c.fireCooldown > 0) return
      c.fireCooldown = stab ? def.altInterval : def.fireInterval
      this.emit({ type: 'shot', x: c.x, y: c.y + 1, z: c.z, weapon: 'knife', ownerId: c.id })
      const target = meleeTarget(c, stab ? def.altRange : def.range, this.colliders, this.characters)
      if (target) this.applyDamage(c, target, stab ? def.altDamage : def.damage, 'chest', def.id)
      return
    }

    const st = c.weaponState
    if (!st || c.reloading || c.fireCooldown > 0) return
    const want = def.auto ? intent.fire : intent.fire && !wasHeld
    if (!want) return
    if (st.mag <= 0) {
      if (c.startReload()) this.emit({ type: 'reload', x: c.x, y: c.y, z: c.z, weapon: def.id })
      return
    }

    st.mag -= 1
    c.fireCooldown = def.fireInterval
    c.lastShotT = this.time
    c.punch += def.recoilPitch
    c.yaw += (Math.random() * 2 - 1) * def.recoilYaw
    const moveSpread = c.speed > 0.5 ? def.spreadMove : 0
    const scopeMul = c.scoped && def.scope ? 0.25 : 1
    const spreadNow = (def.spreadBase + moveSpread) * scopeMul + c.spread
    c.spread = Math.min(def.spreadMax, c.spread + def.spreadPerShot)

    const res = fireBullet(c, def, spreadNow, this.colliders, this.characters)
    this.emit({ type: 'shot', x: c.x, y: c.y + 1.4, z: c.z, weapon: def.id, ownerId: c.id })
    this.emit({
      type: 'tracer',
      from: { x: c.x, y: c.y + 1.45, z: c.z },
      to: res.end,
      weapon: def.id,
    })
    this.noises.push({ x: c.x, z: c.z, t: this.time, team: c.team })
    if (res.target && res.part) this.applyDamage(c, res.target, def.damage, res.part, def.id)
  }

  private applyDamage(shooter: Character, target: Character, base: number, part: HitPart, weapon: WeaponId): void {
    const dealt = target.takeDamage(partDamage(base, part), ARMOR_ABSORB)
    if (target.action) target.action = null
    if (shooter.id === this.humanId) this.hitCount += 1
    this.emit({ type: 'hitEnemy', byId: shooter.id, headshot: part === 'head', part, amount: dealt })
    if (target.id === this.humanId) {
      this.damageCount += 1
      const bearing = yawTowards(shooter.x - target.x, shooter.z - target.z)
      this.lastDamageAngle = angleDiff(bearing, target.yaw)
    }
    this.emit({ type: 'hurt', victimId: target.id, amount: dealt, fromX: shooter.x, fromZ: shooter.z })
    if (!target.alive) this.killCharacter(target, shooter, weapon, part === 'head')
  }

  private killCharacter(victim: Character, killer: Character | null, weapon: WeaponId, headshot: boolean): void {
    victim.alive = false
    victim.action = null
    victim.fireHeld = false
    victim.deaths += 1
    if (killer && killer !== victim) killer.kills += 1
    if (victim.hasBomb) {
      victim.hasBomb = false
      this.bomb.drop(victim.x, victim.y, victim.z)
      this.emit({ type: 'bomb', kind: 'drop', x: victim.x, y: victim.y, z: victim.z })
    }
    const killerTeam: Team = killer ? killer.team : victim.team === 'T' ? 'CT' : 'T'
    this.killfeed.push({
      id: this.nextFeedId++,
      killer: killer ? killer.name : 'C4',
      victim: victim.name,
      weapon: killer ? WEAPONS[weapon].name : 'C4 爆炸',
      headshot,
      killerTeam,
      time: this.time,
    })
    if (this.killfeed.length > KILLFEED_MAX) this.killfeed.splice(0, this.killfeed.length - KILLFEED_MAX)
    this.emit({ type: 'kill', killerId: killer ? killer.id : -1, victimId: victim.id, weapon, headshot })

    // 被观察的队友阵亡，或玩家自己阵亡：切换到下一个存活队友
    if (victim.team === this.playerTeam && (victim.id === this.spectateId || victim.id === this.humanId)) {
      this.spectateId = this.nextMate(victim.id)
    }
  }

  private nextMate(excludeId: number): number | null {
    const m = this.characters.find((c) => c.alive && c.team === this.playerTeam && c.id !== excludeId && c.id !== this.humanId)
    return m ? m.id : null
  }

  private updateInteraction(c: Character, intent: Intent, dt: number): void {
    const held = intent.interactHeld
    if (c.action) {
      if (!held || !this.canAct(c, c.action.kind)) {
        c.action = null
        return
      }
      c.action.t += dt
      if (c.action.t >= c.action.total) this.completeAction(c)
      return
    }
    if (held) {
      if (this.canAct(c, 'plant')) {
        c.action = { kind: 'plant', t: 0, total: PLANT_TIME }
        this.emit({ type: 'bomb', kind: 'plantStart', x: c.x, y: c.y, z: c.z })
        return
      }
      if (this.canAct(c, 'defuse')) {
        c.action = { kind: 'defuse', t: 0, total: c.hasKit ? DEFUSE_TIME : DEFUSE_TIME * 2 }
        this.emit({ type: 'bomb', kind: 'defuseStart', x: c.x, y: c.y, z: c.z })
        return
      }
    }
    if (intent.interactPressed) this.toggleDoorNear(c.x, c.z)
  }

  private canAct(c: Character, kind: 'plant' | 'defuse'): boolean {
    if (!c.alive) return false
    const b = this.bomb
    if (kind === 'plant') {
      return c.team === 'T' && c.hasBomb && b.state === 'carried' && siteAtWorld(c.x, c.z) !== null
    }
    return c.team === 'CT' && b.state === 'planted' && distXZ(c.x, c.z, b.x, b.z) <= PICKUP_RADIUS
  }

  private completeAction(c: Character): void {
    const kind = c.action ? c.action.kind : null
    c.action = null
    if (kind === 'plant') {
      const site = siteAtWorld(c.x, c.z)
      if (!site) return
      this.bomb.plant(site, c.x, c.y, c.z)
      c.hasBomb = false
      this.beepSec = Math.ceil(this.bomb.timer)
      this.emit({ type: 'bomb', kind: 'planted', x: c.x, y: c.y, z: c.z })
      this.setBanner(`C4 已在 ${site} 点安放`, BANNER_TIME)
    } else if (kind === 'defuse') {
      this.bomb.defuse()
      this.emit({ type: 'bomb', kind: 'defused', x: this.bomb.x, y: this.bomb.y, z: this.bomb.z })
      this.endRound('CT', 'C4 已拆除')
    }
  }

  private updateBomb(dt: number): void {
    const b = this.bomb
    if (b.state === 'carried' && b.carrierId !== null) {
      const car = this.byId(b.carrierId)
      if (car.alive) {
        b.x = car.x
        b.y = car.y
        b.z = car.z
      }
    } else if (b.state === 'dropped') {
      for (const c of this.characters) {
        if (!c.alive || c.team !== 'T' || c.hasBomb) continue
        if (distXZ(c.x, c.z, b.x, b.z) < PICKUP_RADIUS && Math.abs(c.y - b.y) < 1.5) {
          b.pickUp(c.id)
          c.hasBomb = true
          this.emit({ type: 'bomb', kind: 'pickup', x: b.x, y: b.y, z: b.z })
          break
        }
      }
    } else if (b.state === 'planted' && this.phase === 'live') {
      b.timer -= dt
      const sec = Math.ceil(b.timer)
      if (sec !== this.beepSec && sec > 0) {
        this.beepSec = sec
        this.emit({ type: 'bomb', kind: 'beep', x: b.x, y: b.y, z: b.z })
      }
      if (b.timer <= 0) this.explodeBomb()
    }
  }

  private explodeBomb(): void {
    const b = this.bomb
    b.explode()
    this.emit({ type: 'bomb', kind: 'exploded', x: b.x, y: b.y, z: b.z })
    this.emit({ type: 'explosion', x: b.x, y: b.y, z: b.z, radius: EXPLOSION_RADIUS })
    for (const c of this.characters) {
      if (c.alive && distXZ(c.x, c.z, b.x, b.z) < EXPLOSION_RADIUS) {
        c.hp = 0
        c.alive = false
        this.killCharacter(c, null, 'knife', false)
      }
    }
    this.endRound('T', 'C4 爆炸')
  }

  // ---------------------------------------------------------------- 门 / 感知 / 装备

  private doorCenterX(d: DoorDef): number {
    return d.hingeX + d.length / 2
  }

  private toggleDoorNear(x: number, z: number): void {
    let best: DoorState | null = null
    let bestD = DOOR_RANGE
    for (const d of this.doors) {
      const dd = distXZ(x, z, this.doorCenterX(d.def), d.def.hingeZ)
      if (dd < bestD) {
        bestD = dd
        best = d
      }
    }
    if (!best) return
    const door: DoorState = best
    const cx = this.doorCenterX(door.def)
    const cz = door.def.hingeZ
    // 门口站人时不允许关门，防止把人夹在门里
    if (door.open && this.characters.some((c) => c.alive && distXZ(c.x, c.z, cx, cz) < 1.6)) return
    door.open = !door.open
    door.def.collider.active = !door.open
    this.emit({ type: 'door', x: cx, z: cz, open: door.open })
  }

  private updateSpotting(dt: number): void {
    this.spotT -= dt
    if (this.spotT > 0) return
    this.spotT = SPOT_INTERVAL
    const friends = this.characters.filter((c) => c.alive && c.team === this.playerTeam)
    for (const e of this.characters) {
      if (!e.alive || e.team === this.playerTeam) continue
      if (friends.some((f) => canSee(f, e, this.colliders, true))) e.spottedUntil = this.time + SPOT_TIME
    }
  }

  private defensePlan(team: Team, k: number): { plan: Plan; anchor: Vec2; face: number } {
    if (team === 'T') {
      const plan = T_PLANS[k]
      const anchor = namedPoint(plan === 'B' ? 'bEntrance' : 'aEntrance')
      const goal = namedPoint(plan === 'B' ? 'bSite' : 'aSite')
      return { plan, anchor, face: yawTowards(goal.x - anchor.x, goal.z - anchor.z) }
    }
    const s = CT_SPOTS[k]
    const anchor = namedPoint(s.point)
    const threat = namedPoint(s.threat)
    return { plan: s.plan, anchor, face: yawTowards(threat.x - anchor.x, threat.z - anchor.z) }
  }

  private botLoadout(team: Team): Loadout {
    const primary: WeaponId = Math.random() < 0.2 ? 'awp' : team === 'T' ? 'ak47' : 'm4a4'
    const secondary: WeaponId = Math.random() < 0.3 ? 'deagle' : DEFAULT_PISTOL[team]
    return { primary, secondary }
  }

  private setBanner(text: string, seconds: number): void {
    this.bannerId += 1
    this.banner = { id: this.bannerId, text, until: this.time + seconds }
  }

  private emit(e: WorldEvent): void {
    this.events.push(e)
  }

  // ---------------------------------------------------------------- HUD 快照

  buildHud(): HudState {
    const human = this.byId(this.humanId)
    const def = human.weapon
    const st = human.weaponState
    const spec = !human.alive && this.spectateId !== null ? this.byId(this.spectateId) : null
    const view = human.alive ? human : spec ?? human
    const bombVisible =
      this.bomb.state !== 'carried' || (this.bomb.carrierId !== null && this.byId(this.bomb.carrierId).team === this.playerTeam)

    return {
      phase: this.phase,
      round: this.round,
      pistol: this.pistolRound,
      scores: { ...this.scores },
      roundTimeLeft: Math.max(0, this.roundTimeLeft),
      freezeLeft: this.phase === 'freeze' ? Math.max(0, this.phaseT) : 0,
      winner: this.winner,
      reason: this.reason,
      playerTeam: this.playerTeam,
      me: {
        id: human.id,
        name: human.name,
        alive: human.alive,
        hp: Math.ceil(human.hp),
        armor: Math.ceil(human.armor),
        isHuman: true,
        hasBomb: human.hasBomb,
        slot: human.current,
        weaponId: def.id,
        weaponName: def.name,
        mag: st ? st.mag : 0,
        reserve: st ? st.reserve : 0,
        magSize: def.magSize,
        reloading: human.reloading,
        reloadProgress: human.reloadTotal > 0 ? 1 - human.reloadLeft / human.reloadTotal : 0,
        scoped: human.scoped,
        canScope: def.scope !== null,
        spread: human.spread + def.spreadBase + (human.speed > 0.5 ? def.spreadMove : 0),
        action: human.action ? { kind: human.action.kind, progress: human.action.t / human.action.total } : null,
      },
      spectateName: spec ? spec.name : null,
      mates: this.characters
        .filter((c) => c.team === this.playerTeam)
        .map((c) => ({ id: c.id, name: c.name, hp: Math.ceil(c.hp), alive: c.alive, hasBomb: c.hasBomb, isHuman: c.id === this.humanId })),
      killfeed: this.killfeed.slice(-KILLFEED_MAX),
      bomb: {
        state: this.bomb.state,
        site: this.bomb.site,
        timeLeft: Math.max(0, this.bomb.timer),
        x: this.bomb.x,
        z: this.bomb.z,
        visible: bombVisible,
      },
      radar: {
        yaw: view.yaw,
        you: human.alive ? { x: human.x, z: human.z } : null,
        friends: this.characters
          .filter((c) => c.alive && c.team === this.playerTeam)
          .map((c) => ({ id: c.id, x: c.x, z: c.z })),
        enemies: this.characters
          .filter((c) => c.alive && c.team !== this.playerTeam && c.spottedUntil > this.time)
          .map((c) => ({ id: c.id, x: c.x, z: c.z })),
      },
      banner: this.banner && this.time < this.banner.until ? { id: this.banner.id, text: this.banner.text } : null,
      hitCount: this.hitCount,
      damageCount: this.damageCount,
      lastDamageAngle: this.lastDamageAngle,
    }
  }
}

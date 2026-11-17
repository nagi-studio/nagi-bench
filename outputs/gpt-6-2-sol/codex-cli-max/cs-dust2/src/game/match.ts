import {
  DEFAULT_PISTOL, DEFAULT_PRIMARY, SLOT_ORDER, WEAPONS, ammunition, damageFor,
  type Ammo, type HitZone, type Primary, type Slot, type Team, type WeaponId,
} from './arsenal'
import { newBrain, setAssignments, stepBot, type Brain } from './bots'
import { SPAWNS, clamp, distance2, groundY, seedRandom, siteAt, type Site, type Vec } from './level'
import { Navigation, castHumanoid, castWorld, clearSight, direction, eyeAt, moveBody, pointAt, type Body } from './physics'

export const ROUND_SECONDS = 105
export const FUSE_SECONDS = 34
export const PLANT_SECONDS = 2.65
export const DEFUSE_SECONDS = 4.8
const READY_SECONDS = 2.4
const RESULT_SECONDS = 5.0

export type RoundMode = 'standard' | 'pistol'
export type Phase = 'ready' | 'live' | 'result'
export type SoundCue = 'step' | 'reload' | 'ready' | 'scope' | 'hit' | 'kill' | 'dry' | 'pickup' | 'plant' | 'defuse' | 'arming' | 'disarming' | 'beep' | 'round' | 'knife'

export interface Config {
  team: Team
  opening: RoundMode
  primary: Primary
  sidearm: 'default' | 'deagle'
}

export interface Actor extends Body {
  id: number
  name: string
  team: Team
  index: number
  health: number
  armor: number
  alive: boolean
  yaw: number
  pitch: number
  speed: number
  stepDistance: number
  slot: Slot
  previousSlot: Slot
  loadout: Record<Slot, Ammo | null>
  equipUntil: number
  nextShot: number
  lastShot: number
  reloadStart: number
  reloadEnd: number
  scoped: boolean
  recoil: number
  sway: number
  bloom: number
  kills: number
  deaths: number
  deathAt: number
  brain: Brain
}

export type Bomb =
  | { state: 'carried'; actor: number }
  | { state: 'dropped'; position: Vec; former: number; pickupAfter: number }
  | { state: 'planted'; position: Vec; site: Site; detonateAt: number }
  | { state: 'defused' | 'exploded'; position: Vec; site: Site }

export interface Interaction {
  actor: number
  kind: 'plant' | 'defuse'
  since: number
}

export interface Frag {
  id: number
  time: number
  killer: string
  killerTeam: Team
  victim: string
  victimTeam: Team
  weapon: WeaponId
  zone: HitZone
}

export type MatchEvent =
  | { type: 'sound'; cue: SoundCue; actor?: number; position?: Vec }
  | { type: 'shot'; actor: number; weapon: WeaponId; start: Vec; end: Vec; impact: boolean; hit: boolean }
  | { type: 'explosion'; position: Vec }

export interface Command {
  forward: number
  right: number
  walk: boolean
  jump: boolean
  dx: number
  dy: number
  fire: boolean
  firePressed: boolean
  scope: boolean
  reload: boolean
  switchTo: Slot | 'previous' | null
  interact: boolean
  takeOver: boolean
  spectator: number
  drop: boolean
}

export const EMPTY_COMMAND: Command = {
  forward: 0, right: 0, walk: false, jump: false, dx: 0, dy: 0,
  fire: false, firePressed: false, scope: false, reload: false, switchTo: null,
  interact: false, takeOver: false, spectator: 0, drop: false,
}

const NAMES: Record<Team, string[]> = {
  CT: ['Slate', 'Rook', 'Echo', 'Kite', 'Onyx'],
  T: ['Flint', 'Viper', 'Dune', 'Ember', 'Sable'],
}

export const currentAmmo = (actor: Actor) => actor.loadout[actor.slot]!

export class Match {
  time = 0
  round = 0
  phase: Phase = 'ready'
  deadline = 0
  mode: RoundMode = 'standard'
  score: Record<Team, number> = { CT: 0, T: 0 }
  result: { team: Team; reason: string } | null = null
  actors: Actor[] = []
  controlled = 0
  human = 0
  watched: number | null = null
  bomb!: Bomb
  interaction: Interaction | null = null
  feed: Frag[] = []
  visibleEnemies = new Set<number>()
  hitAt = -100
  headAt = -100
  killAt = -100
  hurtAt = -100
  nextBeep = 0
  attackSite: Site = 'A'
  squadSpotAt = 0
  random = seedRandom(Date.now())
  private serial = 0
  private blockInteract = false

  constructor(
    readonly config: Config,
    readonly nav: Navigation,
    private emit: (event: MatchEvent) => void,
  ) {
    this.human = config.team === 'CT' ? 0 : 5
    this.startRound()
  }

  get player() { return this.actors[this.controlled] }
  get view() { return this.player.alive ? this.player : this.actors[this.watched ?? this.controlled] }
  get spectating() { return !this.player.alive && this.watched !== null }
  get clock() { return Math.max(0, (this.bomb.state === 'planted' && this.phase === 'live' ? this.bomb.detonateAt : this.deadline) - this.time) }

  private startRound() {
    this.round += 1
    this.mode = this.round === 1 ? this.config.opening : 'standard'
    this.phase = 'ready'
    this.deadline = this.time + READY_SECONDS
    this.result = null
    this.controlled = this.human
    this.watched = null
    this.visibleEnemies.clear()
    this.squadSpotAt = 0
    this.hitAt = this.headAt = this.killAt = this.hurtAt = -100
    this.blockInteract = false
    this.interaction = null
    this.feed = []
    this.attackSite = this.round % 2 ? 'A' : 'B'
    const previous = this.actors
    this.actors = (['CT', 'T'] as const).flatMap(team => SPAWNS[team].map((point, index): Actor => {
      const id = index + (team === 'CT' ? 0 : 5)
      const isHuman = id === this.human
      const secondary = this.mode === 'standard' && isHuman && this.config.sidearm === 'deagle'
        ? 'deagle' : DEFAULT_PISTOL[team]
      const primary = isHuman ? this.config.primary : index === 4 ? 'awp' : DEFAULT_PRIMARY[team]
      const slot = this.mode === 'pistol' ? 'secondary' : 'primary'
      return {
        id, name: isHuman ? '你' : NAMES[team][index], team, index,
        position: { ...point, y: groundY(point.x, point.z) },
        yaw: team === 'CT' ? Math.PI : 0, pitch: 0, vy: 0, grounded: true, speed: 0,
        health: 100, armor: this.mode === 'pistol' ? 0 : 100, alive: true,
        stepDistance: 0.4 + index * 0.14, slot, previousSlot: slot,
        loadout: { primary: this.mode === 'pistol' ? null : ammunition(primary), secondary: ammunition(secondary), melee: ammunition('knife') },
        equipUntil: this.time, nextShot: this.time, lastShot: -100, reloadStart: 0, reloadEnd: 0,
        scoped: false, recoil: 0, sway: 0, bloom: 0,
        kills: previous[id]?.kills ?? 0, deaths: previous[id]?.deaths ?? 0, deathAt: -100,
        brain: newBrain(this.time + index * 0.023),
      }
    }))
    const carrier = this.config.team === 'T' && this.round % 2 ? this.human : 7
    this.bomb = { state: 'carried', actor: carrier }
    setAssignments(this)
  }

  tick(dt: number, input: Command) {
    this.time += dt
    if (this.phase === 'result') {
      if (this.time >= this.deadline) this.startRound()
      return
    }
    if (!input.interact) this.blockInteract = false
    if (input.spectator) this.cycleView(input.spectator)
    if (input.takeOver && this.phase === 'live') this.takeOver()

    for (const actor of this.actors) {
      if (!actor.alive) continue
      this.recover(actor, dt)
      if (actor.id === this.controlled) this.stepPlayer(actor, input, dt)
      else if (this.phase === 'live') stepBot(this, actor, dt)
    }
    if (this.phase === 'ready') {
      if (this.time >= this.deadline) {
        this.phase = 'live'
        this.deadline = this.time + ROUND_SECONDS
        this.emit({ type: 'sound', cue: 'round' })
      }
      return
    }

    this.advanceBomb(input.interact && !this.blockInteract)
    this.checkResult()
    if (this.time >= this.squadSpotAt) {
      this.squadSpotAt = this.time + 0.105
      this.refreshVision()
    }
  }

  private recover(actor: Actor, dt: number) {
    actor.recoil *= Math.exp(-dt * (currentAmmo(actor).id === 'ak' ? 6.2 : 8.1))
    actor.sway *= Math.exp(-dt * 9)
    actor.bloom *= Math.exp(-dt * 5.2)
    if (actor.reloadEnd && this.time >= actor.reloadEnd) {
      const ammo = currentAmmo(actor)
      const amount = Math.min(WEAPONS[ammo.id].magazine - ammo.loaded, ammo.reserve)
      ammo.loaded += amount
      ammo.reserve -= amount
      actor.reloadEnd = 0
      this.cue('ready', actor)
    }
  }

  private stepPlayer(actor: Actor, input: Command, dt: number) {
    const sensitivity = actor.scoped ? 0.00105 : 0.00205
    actor.yaw -= input.dx * sensitivity
    actor.pitch = clamp(actor.pitch - input.dy * sensitivity, -1.47, 1.47)
    if (input.switchTo) this.equip(actor, input.switchTo === 'previous' ? actor.previousSlot : input.switchTo)
    if (this.phase !== 'live') return
    if (input.reload) this.reload(actor)
    const weapon = WEAPONS[currentAmmo(actor).id]
    if (input.scope && weapon.zoom && !actor.reloadEnd && this.time >= actor.equipUntil) {
      actor.scoped = !actor.scoped
      this.cue('scope', actor)
    }
    if (input.drop) this.dropBomb(actor, 1.4)
    const length = Math.hypot(input.forward, input.right) || 1
    const speed = actor.scoped ? 2.45 : input.walk ? 2.75 : actor.slot === 'melee' ? 5.65 : 5.15
    const sin = Math.sin(actor.yaw)
    const cos = Math.cos(actor.yaw)
    const vx = (-sin * input.forward + cos * input.right) * speed / length
    const vz = (-cos * input.forward - sin * input.right) * speed / length
    this.move(actor, vx, vz, input.jump, dt)
    if (input.firePressed || (weapon.automatic && input.fire)) this.fire(actor, input.firePressed)
  }

  move(actor: Actor, vx: number, vz: number, jump: boolean, dt: number) {
    const before = { ...actor.position }
    const wasAirborne = !actor.grounded
    moveBody(actor, vx * dt, vz * dt, jump, dt)
    const moved = distance2(before, actor.position)
    actor.speed = moved / dt
    if (!actor.grounded) return
    actor.stepDistance += moved
    if (actor.stepDistance >= 1.63 || (wasAirborne && actor.vy === 0)) {
      actor.stepDistance = 0
      this.cue('step', actor)
    }
  }

  equip(actor: Actor, slot: Slot) {
    if (actor.slot === slot || !actor.loadout[slot]) return
    actor.previousSlot = actor.slot
    actor.slot = slot
    actor.equipUntil = this.time + (slot === 'primary' ? 0.29 : 0.22)
    actor.reloadEnd = 0
    actor.scoped = false
    actor.bloom = 0
    this.cue('ready', actor)
  }

  reload(actor: Actor) {
    const ammo = currentAmmo(actor)
    const weapon = WEAPONS[ammo.id]
    if (!weapon.reload || ammo.loaded >= weapon.magazine || !ammo.reserve || actor.reloadEnd || this.time < actor.equipUntil) return
    actor.reloadStart = this.time
    actor.reloadEnd = this.time + weapon.reload
    actor.scoped = false
    this.cue('reload', actor)
  }

  fire(actor: Actor, dryFeedback = false) {
    if (this.time + 1e-5 < Math.max(actor.nextShot, actor.equipUntil, actor.reloadEnd) || this.interaction?.actor === actor.id) return false
    const ammo = currentAmmo(actor)
    const weapon = WEAPONS[ammo.id]
    if (ammo.id !== 'knife' && ammo.loaded <= 0) {
      if (dryFeedback) this.cue('dry', actor)
      actor.nextShot = this.time + 0.14
      return false
    }

    if (ammo.id !== 'knife') ammo.loaded -= 1
    actor.nextShot = this.time + weapon.interval
    actor.lastShot = this.time
    const scoped = actor.scoped
    const spread = ammo.id === 'knife' ? 0 : (scoped ? 0.0011 : weapon.spread)
      + (scoped ? actor.speed * 0.0022 : actor.speed * 0.00185) + actor.bloom
      + (actor.grounded ? 0 : 0.034)
    const yaw = actor.yaw + actor.sway + (this.random() - 0.5) * spread * 2
    const pitch = actor.pitch + actor.recoil + (this.random() - 0.5) * spread * 2
    const ray = direction(yaw, pitch)
    const origin = eyeAt(actor.position)
    let closest = castWorld(origin, ray, weapon.range)
    let victim: Actor | null = null
    let zone: HitZone = 'chest'
    for (const other of this.actors) {
      if (other.id === actor.id || !other.alive) continue
      const collision = castHumanoid(origin, ray, closest, other.position, other.yaw)
      if (!collision) continue
      closest = collision.distance
      victim = other
      zone = collision.zone
    }
    if (ammo.id === 'knife') this.cue('knife', actor)
    const hit = Boolean(victim && victim.team !== actor.team)
    const end = pointAt(origin, ray, closest)
    this.emit({ type: 'shot', actor: actor.id, weapon: ammo.id, start: origin, end, hit, impact: closest < weapon.range - 0.001 })
    if (victim && hit) this.hit(actor, victim, ammo.id, zone)
    actor.recoil = Math.min(0.235, actor.recoil + weapon.recoil)
    actor.sway = clamp(actor.sway + (this.random() - 0.5) * weapon.recoil * 0.47, -0.055, 0.055)
    actor.bloom = Math.min(0.064, actor.bloom + weapon.bloom)
    if (scoped) actor.scoped = false
    return true
  }

  private hit(attacker: Actor, victim: Actor, weapon: WeaponId, zone: HitZone) {
    const damage = damageFor(weapon, zone, victim.armor)
    victim.health = Math.max(0, victim.health - damage.health)
    victim.armor = Math.max(0, victim.armor - damage.armor)
    victim.brain.alarmedUntil = this.time + 1.2
    if (victim.id === this.controlled) this.hurtAt = this.time
    if (attacker.id === this.controlled) {
      this.hitAt = this.time
      if (zone === 'head') this.headAt = this.time
      this.emit({ type: 'sound', cue: 'hit' })
    }
    if (victim.health > 0) return

    victim.alive = false
    victim.deaths += 1
    victim.deathAt = this.time
    victim.scoped = false
    victim.reloadEnd = 0
    attacker.kills += 1
    this.dropBomb(victim, 0)
    if (this.interaction?.actor === victim.id) this.interaction = null
    this.feed = [{
      id: ++this.serial, time: this.time, killer: attacker.name, killerTeam: attacker.team,
      victim: victim.name, victimTeam: victim.team, weapon, zone,
    }, ...this.feed].slice(0, 7)
    if (attacker.id === this.controlled) {
      this.killAt = this.time
      this.emit({ type: 'sound', cue: 'kill' })
    }
    if (victim.id === this.controlled || victim.id === this.watched) this.cycleView(1)
  }

  private dropBomb(actor: Actor, pickupDelay: number) {
    if (this.bomb.state !== 'carried' || this.bomb.actor !== actor.id) return
    const position = { ...actor.position, y: groundY(actor.position.x, actor.position.z) }
    this.bomb = { state: 'dropped', position, former: actor.id, pickupAfter: this.time + pickupDelay }
    if (this.interaction?.actor === actor.id) this.interaction = null
  }

  private advanceBomb(interact: boolean) {
    if (this.bomb.state === 'dropped') {
      const drop = this.bomb
      const picker = this.actors.find(actor => actor.alive && actor.team === 'T' &&
        (actor.id !== drop.former || this.time >= drop.pickupAfter) &&
        distance2(actor.position, drop.position) < 0.94 && Math.abs(actor.position.y - drop.position.y) < 1.16)
      if (picker) {
        this.bomb = { state: 'carried', actor: picker.id }
        this.cue('pickup', picker)
      }
    }

    if (this.bomb.state === 'planted') {
      if (this.time >= this.bomb.detonateAt) {
        const { position, site } = this.bomb
        this.bomb = { state: 'exploded', position, site }
        this.emit({ type: 'explosion', position })
        this.finish('T', 'C4 已引爆')
        return
      }
      if (this.time >= this.nextBeep) {
        this.emit({ type: 'sound', cue: 'beep', position: this.bomb.position })
        const until = this.bomb.detonateAt - this.time
        this.nextBeep = this.time + clamp(until / 23, 0.16, 1.05)
      }
    }

    const actor = this.actors.find(actor =>
      actor.alive && actor.speed < 0.52 && actor.grounded &&
      (actor.id === this.controlled ? interact : actor.brain.interact) && this.canInteract(actor) &&
      (this.interaction?.kind !== 'defuse' || this.interaction.actor === actor.id),
    )
    const kind = actor && this.canInteract(actor)
    if (!actor || !kind) {
      this.interaction = null
      return
    }
    if (this.interaction?.actor !== actor.id || this.interaction.kind !== kind) {
      this.interaction = { actor: actor.id, kind, since: this.time }
      actor.scoped = false
      this.cue(kind === 'plant' ? 'arming' : 'disarming', actor)
    }
    const duration = kind === 'plant' ? PLANT_SECONDS : DEFUSE_SECONDS
    if (this.time - this.interaction.since < duration) return
    this.interaction = null

    if (kind === 'plant') {
      const position = { ...actor.position }
      const site = siteAt(position)!
      this.bomb = { state: 'planted', position, site, detonateAt: this.time + FUSE_SECONDS }
      this.nextBeep = this.time + 0.45
      this.emit({ type: 'sound', cue: 'plant' })
    } else if (this.bomb.state === 'planted') {
      this.bomb = { state: 'defused', position: this.bomb.position, site: this.bomb.site }
      this.emit({ type: 'sound', cue: 'defuse' })
      this.finish('CT', 'C4 已拆除')
    }
  }

  canInteract(actor: Actor): 'plant' | 'defuse' | null {
    if (this.phase !== 'live' || !actor.alive) return null
    if (this.bomb.state === 'carried' && this.bomb.actor === actor.id && siteAt(actor.position)) return 'plant'
    if (actor.team === 'CT' && this.bomb.state === 'planted' &&
      distance2(actor.position, this.bomb.position) < 1.65 &&
      clearSight({ ...actor.position, y: actor.position.y + 0.36 }, { ...this.bomb.position, y: this.bomb.position.y + 0.2 })) {
      return 'defuse'
    }
    return null
  }

  private checkResult() {
    if (this.phase === 'result') return
    if (!this.actors.some(actor => actor.alive && actor.team === 'CT')) {
      this.finish('T', '守方已被全歼')
    } else if (this.bomb.state !== 'planted' && !this.actors.some(actor => actor.alive && actor.team === 'T')) {
      this.finish('CT', '攻方已被全歼')
    } else if (this.bomb.state !== 'planted' && this.time >= this.deadline) {
      this.finish('CT', '回合时间耗尽')
    }
  }

  private finish(team: Team, reason: string) {
    if (this.phase === 'result') return
    this.phase = 'result'
    this.result = { team, reason }
    this.deadline = this.time + RESULT_SECONDS
    this.score[team] += 1
    this.interaction = null
    this.emit({ type: 'sound', cue: 'round' })
  }

  private cycleView(delta: number) {
    if (this.player.alive) return
    const alive = this.actors.filter(actor => actor.alive && actor.team === this.config.team)
    if (!alive.length) {
      this.watched = null
      return
    }
    const from = alive.findIndex(actor => actor.id === this.watched)
    this.watched = alive[from < 0 ? 0 : (from + delta + alive.length) % alive.length].id
  }

  private takeOver() {
    if (!this.spectating || !this.view.alive) return
    this.controlled = this.view.id
    this.watched = null
    this.blockInteract = true
    this.hurtAt = this.hitAt = this.headAt = this.killAt = -100
    this.cue('ready', this.player)
  }

  cue(cue: SoundCue, actor: Actor) {
    this.emit({ type: 'sound', cue, actor: actor.id, position: { ...actor.position } })
  }

  private refreshVision() {
    this.visibleEnemies.clear()
    for (const actor of this.actors) {
      if (!actor.alive || actor.team === this.config.team) continue
      for (const ally of this.actors) {
        if (!ally.alive || ally.team !== this.config.team) continue
        const from = eyeAt(ally.position)
        const to = { ...actor.position, y: actor.position.y + 1.39 }
        const range = Math.hypot(to.x - from.x, to.y - from.y, to.z - from.z)
        const facing = direction(ally.yaw, ally.pitch)
        const angle = ((to.x - from.x) * facing.x + (to.z - from.z) * facing.z + (to.y - from.y) * facing.y) / Math.max(0.1, range)
        const field = ally.id === this.controlled ? (ally.scoped ? 0.953 : 0.59) : 0.35
        if (range <= 54 && angle > field && clearSight(from, to)) {
          this.visibleEnemies.add(actor.id)
          break
        }
      }
    }
  }

  bombPosition(): Vec | null {
    if (this.bomb.state === 'carried') return this.actors[this.bomb.actor].position
    if (this.bomb.state === 'exploded' || this.bomb.state === 'defused') return null
    return this.bomb.position
  }

  cycleSlot(delta: number) {
    if (!this.player.alive) return
    const owned = SLOT_ORDER.filter(slot => this.player.loadout[slot])
    const next = (owned.indexOf(this.player.slot) + delta + owned.length) % owned.length
    this.equip(this.player, owned[next])
  }
}

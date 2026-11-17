import type {
  Actor,
  HudActor,
  Bomb,
  BrainState,
  Feed,
  Inventory,
  Options,
  Phase,
  Point,
  Slot,
  Snapshot,
  Team,
  Vec2,
  WeaponId,
  Zone,
} from './types'
import {
  areaAt,
  canStand,
  ground,
  pathfind,
  rayBox,
  siteAt,
  sites,
  support,
  teamSpawns,
  visible,
  wallDistance,
} from './map'
import { magazine, WEAPONS, zoneMultiplier } from './weapons'
import type { Sound } from './audio'

export const DEFAULTS: Options = {
  team: 'T',
  primary: 'ak',
  pistol: 'glock',
  pistolRound: false,
  volume: 0.6,
  sensitivity: 1,
  muted: false,
}
export const roundLength = 115,
  plantTime = 3,
  defuseTime = 5,
  bombTime = 40
const names = [
  'Viper',
  'Rook',
  'Sable',
  'Kestrel',
  'Onyx',
  'Atlas',
  'Echo',
  'Frost',
  'Ghost',
  'Hawk',
]
const distance = (a: Vec2, b: Vec2) => Math.hypot(a.x - b.x, a.z - b.z)
const eye = (a: Actor) => ({ x: a.x, y: a.y + 1.59, z: a.z })
const heading = (a: Vec2, b: Vec2) => Math.atan2(a.x - b.x, a.z - b.z)
const angleDiff = (to: number, from: number) => Math.atan2(Math.sin(to - from), Math.cos(to - from))
const point = (x: number, z: number) => ({ x, z })
const boxes: [Zone, number, number, number, number, number, number][] = [
  ['head', -0.135, 1.475, -0.139, 0.135, 1.819, 0.127],
  ['chest', -0.203, 1.09, -0.164, 0.203, 1.475, 0.153],
  ['abdomen', -0.186, 0.843, -0.138, 0.186, 1.09, 0.147],
  ['arm', -0.298, 1.07, -0.21, -0.199, 1.458, 0.102],
  ['arm', 0.199, 1.07, -0.21, 0.298, 1.458, 0.102],
  ['arm', -0.092, 1.217, -0.485, 0.117, 1.369, -0.156],
  ['leg', -0.218, 0.015, -0.135, -0.021, 0.876, 0.114],
  ['leg', 0.021, 0.015, -0.135, 0.218, 0.876, 0.114],
]
export function hitActor(origin: Point, dir: Point, a: Actor) {
  const c = Math.cos(a.yaw),
    s = Math.sin(a.yaw),
    dx = origin.x - a.x,
    dz = origin.z - a.z
  const p = { x: c * dx - s * dz, y: origin.y - a.y, z: s * dx + c * dz },
    d = { x: c * dir.x - s * dir.z, y: dir.y, z: s * dir.x + c * dir.z }
  let distance = Infinity,
    zone: Zone = 'chest'
  for (const [name, x1, y1, z1, x2, y2, z2] of boxes) {
    const t = rayBox(p, d, x1, y1, z1, x2, y2, z2)
    if (t < distance) {
      distance = t
      zone = name
    }
  }
  return { distance, zone }
}
export class Match {
  options: Options
  actors: Actor[] = []
  phase: Phase = 'ready'
  round = 1
  remaining = roundLength
  scores: Record<Team, number> = { T: 0, CT: 0 }
  elapsed = 0
  playerId = 0
  viewId = 0
  spectating = false
  bomb!: Bomb
  feed: Feed[] = []
  feedId = 0
  winner: Team | null = null
  reason = ''
  endDelay = 0
  keys = new Set<string>()
  trigger = false
  tapped = false
  scoped = false
  hit = 0
  hurt = 0
  flash = 0
  prompt = ''
  progress = 0
  assignedSite: 'A' | 'B' = 'A'
  clickFallback = false
  private pausedFrom: 'live' | 'roundEnd' = 'live'
  private beep = 0
  private seenTick = 0
  sound: (id: Sound, pos?: Point) => void = () => {}
  shot: (origin: Point, end: Point, id: number, weapon: WeaponId) => void = () => {}
  changed: () => void = () => {}
  constructor(options: Partial<Options> = {}) {
    this.options = { ...DEFAULTS, ...options }
    this.resetRound()
  }
  get view() {
    return this.actors[this.viewId]
  }
  get player() {
    return this.actors[this.playerId]
  }
  get team() {
    return this.options.team
  }
  get pistolOnly() {
    return this.options.pistolRound && this.round === 1
  }
  private inventory(team: Team, id: number): Inventory {
    const human = id === (this.team === 'T' ? 0 : 5),
      primary = human ? this.options.primary : id % 5 === 4 ? 'awp' : team === 'T' ? 'ak' : 'm4'
    const pistol = this.pistolOnly
      ? team === 'T'
        ? 'glock'
        : 'usp'
      : human
        ? this.options.pistol
        : id % 5 === 3
          ? 'deagle'
          : team === 'T'
            ? 'glock'
            : 'usp'
    return [this.pistolOnly ? null : magazine(primary), magazine(pistol), magazine('knife')]
  }
  resetRound() {
    const old = this.actors
    this.playerId = this.team === 'T' ? 0 : 5
    this.viewId = this.playerId
    this.spectating = false
    this.assignedSite = this.round % 2 ? 'A' : 'B'
    this.actors = Array.from({ length: 10 }, (_, id) => {
      const team: Team = id < 5 ? 'T' : 'CT',
        pos = teamSpawns[team][id % 5]
      return {
        id,
        name: names[id],
        team,
        ...pos,
        y: ground(pos.x, pos.z),
        yaw: team === 'T' ? (id === 0 ? 0.195 : id === 1 ? -0.37 : 0.27) : Math.PI,
        pitch: team === 'T' ? 0.082 : 0.018,
        hp: 100,
        armor: this.pistolOnly ? 0 : 100,
        alive: true,
        vy: 0,
        grounded: true,
        moving: 0,
        step: id,
        inventory: this.inventory(team, id),
        slot: this.pistolOnly ? 1 : 0,
        cooldown: 0,
        reloadLeft: 0,
        recoil: 0,
        spread: 0,
        kills: old[id]?.kills ?? 0,
        deaths: old[id]?.deaths ?? 0,
        state: 'advance',
        target: null,
        nextThink: Math.random() * 0.18,
        plan: [],
        destination: null,
        reroute: 0,
        guardTime: 0,
        engageTime: 0,
        stuckTime: 0,
        route: [],
        action: 0,
        seen: -10,
        seenPosition: { ...pos },
      }
    })
    const carrier = (this.round % 4) + 0
    this.bomb = {
      state: 'carried',
      carrier,
      x: this.actors[carrier].x,
      y: 0,
      z: this.actors[carrier].z,
      remaining: bombTime,
      site: '',
      worker: null,
    }
    this.assignRoutes()
    this.remaining = roundLength
    this.winner = null
    this.reason = ''
    this.feed = []
    this.clearInput()
    this.scoped = false
    this.hit = 0
    this.hurt = 0
    this.flash = 0
    this.progress = 0
    this.prompt = ''
    this.beep = 0
    this.seenTick = 0
  }
  private assignRoutes() {
    const a = this.assignedSite === 'A',
      s = sites[this.assignedSite]
    for (const bot of this.actors) {
      const role = bot.id % 5
      if (bot.team === 'T') {
        if (!a && role !== 4)
          bot.route = [
            point(-27, 26),
            point(-31, 4),
            point(-37, -4),
            point(s.x + (role - 2) * 0.65, s.z + 1),
          ]
        else if ((a && role < 3) || (!a && role === 4))
          bot.route = a
            ? [
                point(20.3, 26),
                point(20.5, 17.5),
                point(38, 15),
                point(38, -13),
                point(37 + (role - 1) * 0.9, -23),
              ]
            : [point(1, 9), point(1, -17), point(-14, -26), point(-38, -22)]
        else
          bot.route = [
            point(1.4, 16),
            point(11, 10),
            point(11.7, -21),
            point(27, -22),
            point(30, -24 + role),
          ]
      } else
        bot.route =
          role === 0
            ? [point(1, -18), point(1, -10)]
            : role === 1
              ? [point(21, -30), point(36, -18), point(39, -5)]
              : role === 2
                ? [point(-25, -26), point(-38, -20)]
                : role === 3
                  ? [point(20, -30), point(28, -23), point(11.5, -16)]
                  : [point(-24, -27), point(-38, -19)]
    }
  }
  configure(patch: Partial<Options>) {
    const prev = this.options
    this.options = { ...prev, ...patch }
    if (patch.team && patch.team !== prev.team) {
      this.options.primary = patch.team === 'T' ? 'ak' : 'm4'
      this.options.pistol = patch.team === 'T' ? 'glock' : 'usp'
    }
    if (
      this.phase === 'ready' &&
      (patch.primary || patch.pistol || patch.team || patch.pistolRound !== undefined)
    ) {
      this.resetRound()
    }
    this.changed()
  }
  start() {
    if (this.phase === 'ready') {
      this.round = 1
      this.scores = { T: 0, CT: 0 }
      this.actors = []
      this.resetRound()
      this.phase = 'live'
    } else if (this.phase === 'paused') this.phase = this.pausedFrom
    this.changed()
  }
  lobby() {
    this.phase = 'ready'
    this.round = 1
    this.scores = { T: 0, CT: 0 }
    this.actors = []
    this.resetRound()
    this.changed()
  }
  pause() {
    if (this.phase === 'live' || this.phase === 'roundEnd') {
      this.pausedFrom = this.phase
      this.phase = 'paused'
      this.clearInput()
      this.actors.forEach((a) => {
        a.action = 0
      })
      this.bomb.worker = null
      this.progress = 0
      this.changed()
    }
  }
  clearInput() {
    this.keys.clear()
    this.trigger = false
    this.tapped = false
  }
  nextRound() {
    if (this.phase !== 'roundEnd') return
    this.round++
    this.resetRound()
    this.phase = 'live'
    this.changed()
  }
  slot(n: Slot) {
    const a = this.view
    if (this.spectating || !a.alive || !a.inventory[n] || !['ready', 'live'].includes(this.phase))
      return
    if (a.slot !== n) {
      a.slot = n
      a.reloadLeft = 0
      a.cooldown = 0.19
      this.scoped = false
      a.action = 0
      this.sound('equip')
      this.changed()
    }
  }
  scope() {
    if (
      this.phase === 'live' &&
      !this.spectating &&
      this.player.inventory[this.player.slot]?.id === 'awp' &&
      this.player.reloadLeft <= 0
    ) {
      this.scoped = !this.scoped
      this.sound('scope')
      this.changed()
    }
  }
  reload(a = this.player) {
    if (!a.alive || a.reloadLeft > 0 || this.phase !== 'live') return
    const m = a.inventory[a.slot]
    if (!m || !m.reserve || m.ammo >= WEAPONS[m.id].capacity) return
    a.reloadLeft = WEAPONS[m.id].reload
    a.action = 0
    if (a.id === this.playerId) this.scoped = false
    this.sound('reload', eye(a))
    this.changed()
  }
  look(x: number, y: number) {
    if (this.phase !== 'live' || this.spectating) return
    const delta = 0.00205 * this.options.sensitivity * (this.scoped ? 0.31 : 1)
    this.player.yaw -= x * delta
    this.player.pitch = Math.max(-1.46, Math.min(1.46, this.player.pitch - y * delta))
  }
  key(code: string, down: boolean) {
    if (!down) {
      this.keys.delete(code)
      return
    }
    if (this.keys.has(code)) return
    this.keys.add(code)
    if (this.phase === 'roundEnd' && code === 'Enter') {
      this.nextRound()
      return
    }
    if (this.phase !== 'live') return
    if (this.spectating) {
      if (code === 'KeyQ') this.cycle()
      if (code === 'Enter') this.takeover()
      return
    }
    if (code === 'KeyR') this.reload()
    if (code === 'Digit1' || code === 'Digit2' || code === 'Digit3')
      this.slot((Number(code.slice(-1)) - 1) as Slot)
    if (code === 'Space' && this.player.grounded) {
      this.player.vy = 6
      this.player.grounded = false
      this.player.action = 0
    }
    if (code === 'KeyG' && this.bomb.carrier === this.playerId) this.dropBomb(this.player, true)
    if (
      code === 'KeyE' &&
      this.bomb.state === 'carried' &&
      this.bomb.carrier !== null &&
      this.bomb.carrier !== this.playerId &&
      this.team === 'T' &&
      distance(this.player, this.actors[this.bomb.carrier]) < 2.4 &&
      visible(eye(this.player), eye(this.actors[this.bomb.carrier]))
    ) {
      this.bomb.carrier = this.playerId
      this.sound('equip')
      this.changed()
    }
  }
  cycle() {
    const mates = this.actors.filter((a) => a.team === this.team && a.alive)
    if (mates.length)
      this.viewId = mates[(mates.findIndex((a) => a.id === this.viewId) + 1) % mates.length].id
    this.changed()
  }
  takeover() {
    if (!this.spectating || !this.view.alive || this.phase !== 'live') return
    this.playerId = this.viewId
    this.spectating = false
    this.view.plan = []
    this.view.target = null
    this.view.action = 0
    this.view.pitch = 0
    this.clearInput()
    this.changed()
  }
  private move(a: Actor, dx: number, dz: number, dt: number) {
    const ox = a.x,
      oz = a.z
    if (canStand(a.x + dx, a.z, a.y)) a.x += dx
    if (canStand(a.x, a.z + dz, a.y)) a.z += dz
    const { floor, ceiling } = support(a.x, a.z, a.y)
    a.vy -= 16.7 * dt
    a.y += a.vy * dt
    if (a.y + 1.77 > ceiling) {
      a.y = ceiling - 1.77
      a.vy = Math.min(0, a.vy)
    }
    if (a.y <= floor) {
      a.y = floor
      a.vy = 0
      a.grounded = true
    } else a.grounded = false
    const step = Math.hypot(a.x - ox, a.z - oz)
    a.moving = step / dt
    if (a.grounded && step) {
      const old = Math.floor(a.step / 1.85)
      a.step += step
      if (old !== Math.floor(a.step / 1.85)) this.sound('step', eye(a))
    }
  }
  private human(dt: number) {
    const a = this.player,
      side = Number(this.keys.has('KeyD')) - Number(this.keys.has('KeyA')),
      f = Number(this.keys.has('KeyW')) - Number(this.keys.has('KeyS'))
    const m = a.inventory[a.slot]!,
      speed = m.id === 'knife' ? 6.0 : this.scoped ? 2.3 : this.keys.has('ShiftLeft') ? 2.45 : 4.85
    const scale = (speed * dt) / Math.max(1, Math.hypot(f, side)),
      c = Math.cos(a.yaw),
      s = Math.sin(a.yaw)
    this.move(a, (side * c - f * s) * scale, (-f * c - side * s) * scale, dt)
    if (this.tapped || (this.trigger && WEAPONS[m.id].automatic)) this.fire(a)
    this.tapped = false
  }
  fire(a: Actor, aimAt?: Actor) {
    if (!a.alive || a.cooldown > 0 || a.reloadLeft > 0 || a.action > 0 || this.phase !== 'live')
      return
    const mag = a.inventory[a.slot]!,
      w = WEAPONS[mag.id]
    if (mag.id !== 'knife' && mag.ammo <= 0) {
      this.reload(a)
      return
    }
    if (mag.id !== 'knife') mag.ammo--
    a.cooldown = w.interval * (aimAt ? 1.0 + Math.random() * 0.62 : 1)
    let yaw = a.yaw,
      pitch = a.pitch + a.recoil
    let spread =
      (mag.id === 'awp' && this.scoped && a.id === this.playerId ? 0.00038 : w.spread) +
      a.spread +
      (a.moving > 0.5 ? 0.0045 : 0)
    const origin = eye(a)
    if (aimAt) {
      const dist = distance(a, aimAt)
      yaw = heading(a, aimAt)
      pitch = Math.atan2(aimAt.y + (Math.random() < 0.1 ? 1.63 : 1.3) - origin.y, dist)
      spread =
        (mag.id === 'awp' ? 0.013 : 0.016) + Math.min(0.019, dist * 0.00024) + a.spread * 0.34
    }
    yaw += (Math.random() + Math.random() - 1) * spread * 2
    pitch += (Math.random() + Math.random() - 1) * spread * 2
    const dir = {
      x: -Math.sin(yaw) * Math.cos(pitch),
      y: Math.sin(pitch),
      z: -Math.cos(yaw) * Math.cos(pitch),
    }
    let nearest = wallDistance(origin, dir, w.range),
      victim: Actor | null = null,
      zone: Zone = 'chest'
    for (const target of this.actors) {
      if (!target.alive || target.id === a.id || distance(a, target) > nearest + 1) continue
      const hit = hitActor(origin, dir, target)
      if (hit.distance < nearest) {
        nearest = hit.distance
        victim = target
        zone = hit.zone
      }
    }
    a.recoil = Math.min(0.205, a.recoil + w.recoil)
    a.spread = Math.min(0.065, a.spread + w.recoil * 0.36)
    this.sound(mag.id, origin)
    this.shot(
      origin,
      {
        x: origin.x + dir.x * nearest,
        y: origin.y + dir.y * nearest,
        z: origin.z + dir.z * nearest,
      },
      a.id,
      mag.id
    )
    if (victim && victim.team !== a.team) {
      const raw = w.damage * zoneMultiplier[zone],
        absorbed = Math.min(victim.armor, raw * 0.26)
      victim.armor = Math.max(0, victim.armor - absorbed)
      victim.hp = Math.max(0, victim.hp - (raw - absorbed))
      if (a.id === this.playerId) {
        this.hit = 0.21
        this.sound('hit')
      }
      if (victim.id === this.playerId) this.hurt = 0.39
      if (victim.hp <= 0) this.die(victim, a, mag.id, zone)
      else if (victim.id !== this.playerId && victim.target === null) {
        victim.yaw = heading(victim, a)
        victim.nextThink = 0
      }
    }
    if (a.id === this.playerId && mag.id === 'awp') this.scoped = false
  }
  private die(a: Actor, killer: Actor, weapon: WeaponId, zone: Zone) {
    a.alive = false
    a.deaths++
    a.action = 0
    a.target = null
    a.moving = 0
    killer.kills++
    if (this.bomb.carrier === a.id) this.dropBomb(a, false)
    this.feed.unshift({
      id: ++this.feedId,
      killer: killer.name,
      victim: a.name,
      weapon,
      team: killer.team,
      head: zone === 'head',
      time: this.elapsed,
    })
    this.feed.length = Math.min(5, this.feed.length)
    if (killer.id === this.playerId) this.sound('kill')
    if (a.id === this.playerId || a.id === this.viewId) {
      const mate = this.actors.find((m) => m.alive && m.team === this.team)
      this.spectating = true
      this.scoped = false
      this.viewId = mate?.id ?? a.id
      this.clearInput()
    }
    this.checkWin()
    this.changed()
  }
  private dropBomb(a: Actor, toss: boolean) {
    let x = a.x,
      z = a.z
    if (toss) {
      const nx = x - Math.sin(a.yaw) * 1.35,
        nz = z - Math.cos(a.yaw) * 1.35
      if (canStand(nx, nz, ground(nx, nz))) {
        x = nx
        z = nz
      }
    }
    this.bomb = {
      ...this.bomb,
      state: 'dropped',
      carrier: null,
      x,
      y: support(x, z, a.y).floor + 0.04,
      z,
      worker: null,
    }
    this.sound('drop', eye(a))
    this.changed()
  }
  private checkWin() {
    const t = this.actors.some((a) => a.team === 'T' && a.alive),
      ct = this.actors.some((a) => a.team === 'CT' && a.alive)
    if (!ct) this.finish('T', '防守方已被全歼')
    else if (!t && this.bomb.state !== 'planted') this.finish('CT', '进攻方已被全歼')
  }
  private finish(team: Team, reason: string) {
    if (this.phase !== 'live') return
    this.winner = team
    this.reason = reason
    this.scores[team]++
    this.endDelay = 5.2
    this.phase = this.scores[team] >= 13 || this.round >= 24 ? 'matchEnd' : 'roundEnd'
    this.clearInput()
    this.scoped = false
    this.progress = 0
    this.prompt = ''
    this.sound('win')
    this.changed()
  }
  private setGoal(a: Actor, pos: Vec2, state: BrainState) {
    a.state = state
    if (a.reroute > 0 && a.destination && distance(a.destination, pos) < 1.1 && a.plan.length)
      return
    a.destination = { x: pos.x, z: pos.z }
    a.plan = pathfind(a, pos)
    a.reroute = 2.3 + Math.random() * 1.4
  }
  private think(a: Actor) {
    a.nextThink = 0.16 + Math.random() * 0.18
    const enemies = this.actors
      .filter((e) => e.alive && e.team !== a.team)
      .sort((u, v) => distance(a, u) - distance(a, v))
    const spotted = enemies.find((e) => {
      const dist = distance(a, e)
      return (
        dist < 67 &&
        (dist < 4 ||
          Math.abs(angleDiff(heading(a, e), a.yaw)) < (a.target === e.id ? 1.48 : 1.14)) &&
        visible(eye(a), { x: e.x, y: e.y + 1.29, z: e.z })
      )
    })
    if (spotted) {
      if (a.target !== spotted.id) a.engageTime = 0.38 + Math.random() * 0.6
      a.target = spotted.id
      if (a.team === this.team) {
        spotted.seen = this.elapsed
        spotted.seenPosition = { x: spotted.x, z: spotted.z }
      }
    } else a.target = null
    const b = this.bomb,
      nearBomb = distance(a, b) < 1.64
    // A defender already using the device can finish under fire.
    if (
      b.state === 'planted' &&
      a.team === 'CT' &&
      nearBomb &&
      (b.worker === null || b.worker === a.id)
    ) {
      a.state = 'defuse'
      a.plan = []
      return
    }
    if (b.carrier === a.id && siteAt(a.x, a.z) && (!spotted || a.action > 0)) {
      a.state = 'plant'
      a.plan = []
      return
    }
    if (spotted) {
      a.state = 'engage'
      return
    }
    if (b.state === 'dropped' && a.team === 'T') {
      const closest = this.actors
        .filter((m) => m.team === 'T' && m.alive && m.id !== this.playerId)
        .sort((u, v) => distance(u, b) - distance(v, b))[0]
      if (closest === a) {
        this.setGoal(a, b, 'recover')
        return
      }
    }
    if (b.state === 'planted') {
      if (a.team === 'CT') {
        this.setGoal(a, b, 'defuse')
        return
      }
      if (distance(a, b) > 8) {
        this.setGoal(a, point(b.x + ((a.id % 3) - 1) * 3, b.z + 2), 'guard')
        return
      }
      a.state = 'guard'
      a.plan = []
      a.yaw += 0.27
      return
    }
    if (b.carrier === a.id && a.route.length === 0) {
      this.setGoal(a, sites[this.assignedSite], 'advance')
      return
    }
    if (a.route.length && distance(a, a.route[0]) < 1.55) {
      a.route.shift()
      a.reroute = 0
    }
    if (a.route.length) {
      this.setGoal(a, a.route[0], 'advance')
      return
    }
    a.guardTime -= a.nextThink
    if (a.guardTime <= 0) {
      a.guardTime = 3 + Math.random() * 3.7
      if (a.team === 'CT') {
        const positions = [
          point(1, -9),
          point(37, -17),
          point(-38, -17),
          point(11, -13),
          point(-29, -25),
        ]
        const base = positions[a.id % 5]
        this.setGoal(
          a,
          point(base.x + Math.random() * 3 - 1.5, base.z + Math.random() * 4 - 2),
          'guard'
        )
        a.yaw = a.id % 5 === 4 ? -Math.PI / 2 : Math.PI + (Math.random() - 0.5) * 0.65
      } else if (b.carrier !== null) {
        const carrier = this.actors[b.carrier]
        this.setGoal(a, point(carrier.x + ((a.id % 3) - 1) * 1.6, carrier.z - 1), 'advance')
      } else a.yaw += 0.6
    }
  }
  private bot(a: Actor, dt: number) {
    a.nextThink -= dt
    a.reroute -= dt
    a.engageTime -= dt
    if (a.nextThink <= 0) this.think(a)
    let dx = 0,
      dz = 0
    if (a.state === 'engage' && a.target !== null) {
      const enemy = this.actors[a.target]
      if (enemy.alive) {
        const to = heading(a, enemy)
        a.yaw += angleDiff(to, a.yaw) * Math.min(1, dt * 11)
        a.pitch = Math.atan2(enemy.y + 1.31 - a.y - 1.59, Math.max(1, distance(a, enemy)))
        if (
          a.engageTime <= 0 &&
          Math.abs(angleDiff(to, a.yaw)) < 0.11 &&
          a.cooldown <= 0 &&
          visible(eye(a), { x: enemy.x, y: enemy.y + 1.3, z: enemy.z })
        )
          this.fire(a, enemy)
      }
    } else if (a.action <= 0 && a.plan.length) {
      const waypoint = a.plan[0],
        d = distance(a, waypoint)
      if (d < 0.29) a.plan.shift()
      else {
        const step = Math.min(d, (a.team === 'T' ? 3.52 : 3.39) * dt)
        dx = ((waypoint.x - a.x) * step) / d
        dz = ((waypoint.z - a.z) * step) / d
        const to = heading(a, waypoint)
        a.yaw += angleDiff(to, a.yaw) * Math.min(1, dt * 9)
        a.pitch *= 1 - dt * 5
      }
    }
    if (dx || dz) {
      for (const mate of this.actors) {
        if (mate === a || !mate.alive || Math.abs(a.y - mate.y) > 1) continue
        const d = distance(a, mate)
        if (d > 0.015 && d < 0.67) {
          const steer = ((0.67 - d) * 3.2 * dt) / d
          dx += (a.x - mate.x) * steer
          dz += (a.z - mate.z) * steer
        }
      }
    }
    this.move(a, dx, dz, dt)
    if (Math.abs(dx) + Math.abs(dz) > 0.004 && a.moving < 0.24) {
      a.stuckTime += dt
      if (a.stuckTime > 0.42) {
        a.plan = []
        a.destination = null
        a.reroute = 0
        a.nextThink = 0
        a.stuckTime = 0
      }
    } else a.stuckTime = 0
    const mag = a.inventory[a.slot]!
    if (mag.id !== 'knife' && mag.ammo === 0 && mag.reserve === 0) {
      a.slot = a.slot === 0 ? 1 : 2
      a.reloadLeft = 0
    } else if (
      mag.ammo === 0 ||
      (a.state !== 'engage' && mag.ammo < WEAPONS[mag.id].capacity * 0.28)
    )
      this.reload(a)
  }
  private objective(dt: number) {
    const b = this.bomb
    if (b.state === 'carried' && b.carrier !== null) {
      const a = this.actors[b.carrier]
      b.x = a.x
      b.y = a.y + 1
      b.z = a.z
    }
    if (b.state === 'dropped') {
      const picker = this.actors.find(
        (a) =>
          a.alive &&
          a.team === 'T' &&
          distance(a, b) < 0.94 &&
          Math.abs(a.y - b.y) < 1.25 &&
          visible(eye(a), { ...b, y: b.y + 0.13 })
      )
      if (picker) {
        b.carrier = picker.id
        b.state = 'carried'
        picker.reroute = 0
        this.sound('equip', eye(picker))
        this.changed()
      }
    }
    this.prompt = ''
    this.progress = 0
    let worker: Actor | undefined
    if (b.state === 'carried' && b.carrier !== null) {
      const a = this.actors[b.carrier]
      if (siteAt(a.x, a.z) && a.grounded) {
        if (a.id === this.playerId && !this.spectating) this.prompt = '长按 E 安放 C4'
        if (
          (a.id === this.playerId ? this.keys.has('KeyE') : a.state === 'plant') &&
          a.moving < 0.3
        )
          worker = a
      } else if (
        a.id !== this.playerId &&
        this.team === 'T' &&
        !this.spectating &&
        distance(a, this.player) < 2.4 &&
        visible(eye(a), eye(this.player))
      )
        this.prompt = '按 E 接过 C4'
    } else if (b.state === 'planted') {
      b.remaining = Math.max(0, b.remaining - dt)
      this.beep -= dt
      if (this.beep <= 0) {
        this.beep = 0.18 + Math.min(1.2, b.remaining * 0.035)
        this.sound('beep', b)
      }
      if (b.remaining <= 0) {
        b.state = 'exploded'
        b.worker = null
        this.flash = 1
        this.sound('explode', b)
        this.finish('T', 'C4 已引爆')
        return
      }
      const candidates = this.actors.filter(
        (a) =>
          a.team === 'CT' &&
          a.alive &&
          a.grounded &&
          a.moving < 0.3 &&
          distance(a, b) < 1.75 &&
          Math.abs(a.y - b.y) < 1.25 &&
          visible(eye(a), { ...b, y: b.y + 0.14 })
      )
      const player = candidates.find((a) => a.id === this.playerId && !this.spectating)
      if (player) this.prompt = '长按 E 拆除 C4'
      worker =
        candidates.find(
          (a) =>
            a.id === b.worker &&
            (a.id === this.playerId ? this.keys.has('KeyE') : a.state === 'defuse')
        ) ??
        candidates.find((a) =>
          a.id === this.playerId ? this.keys.has('KeyE') : a.state === 'defuse'
        )
    }
    for (const a of this.actors) if (a !== worker) a.action = 0
    b.worker = worker?.id ?? null
    if (worker) {
      worker.action += dt
      const planting = b.state === 'carried',
        duration = planting ? plantTime : defuseTime
      if (worker.id === this.viewId) {
        this.prompt = planting ? '正在安放 C4' : '正在拆除 C4'
        this.progress = worker.action / duration
      }
      if (worker.action >= duration) {
        worker.action = 0
        b.worker = null
        if (planting) {
          b.state = 'planted'
          b.carrier = null
          b.x = worker.x
          b.z = worker.z
          b.y = worker.y + 0.03
          b.site = siteAt(b.x, b.z)
          b.remaining = bombTime
          this.beep = 1.1
          this.sound('plant', b)
          for (const a of this.actors) {
            a.nextThink = 0
            a.reroute = 0
            a.destination = null
            a.plan = []
          }
        } else {
          b.state = 'defused'
          this.sound('defuse', b)
          this.finish('CT', 'C4 已拆除')
        }
        this.changed()
      }
    }
  }
  tick(dt: number) {
    if (this.phase === 'roundEnd') {
      this.endDelay -= dt
      this.flash = Math.max(0, this.flash - dt * 0.75)
      if (this.endDelay <= 0) this.nextRound()
      return
    }
    if (this.phase !== 'live') return
    this.elapsed += dt
    this.remaining = Math.max(0, this.remaining - dt)
    this.hit = Math.max(0, this.hit - dt)
    this.hurt = Math.max(0, this.hurt - dt)
    this.flash = Math.max(0, this.flash - dt)
    for (const a of this.actors) {
      if (!a.alive) continue
      a.cooldown = Math.max(0, a.cooldown - dt)
      a.recoil = Math.max(0, a.recoil - dt * 0.108)
      a.spread = Math.max(0, a.spread - dt * 0.052)
      if (a.reloadLeft > 0) {
        a.reloadLeft = Math.max(0, a.reloadLeft - dt)
        if (!a.reloadLeft) {
          const m = a.inventory[a.slot]!,
            take = Math.min(WEAPONS[m.id].capacity - m.ammo, m.reserve)
          m.ammo += take
          m.reserve -= take
          if (a.id === this.viewId) this.sound('equip')
        }
      }
      if (a.id === this.playerId && !this.spectating) this.human(dt)
      else this.bot(a, dt)
      if (this.phase !== 'live') return
    }
    this.objective(dt)
    if (this.remaining <= 0 && this.bomb.state !== 'planted') this.finish('CT', '回合时间耗尽')
    this.seenTick -= dt
    if (this.seenTick <= 0) {
      this.seenTick = 0.16
      const a = this.view
      for (const e of this.actors)
        if (
          e.alive &&
          e.team !== this.team &&
          Math.abs(angleDiff(heading(a, e), a.yaw)) < 0.95 &&
          visible(eye(a), eye(e))
        ) {
          e.seen = this.elapsed
          e.seenPosition = { x: e.x, z: e.z }
        }
    }
  }
  snapshot(): Snapshot {
    // UI snapshots own their mutable values. React never reads a half-advanced physics tick.
    const actors: HudActor[] = this.actors.map((a) => ({
      id: a.id,
      name: a.name,
      team: a.team,
      x: a.x,
      y: a.y,
      z: a.z,
      yaw: a.yaw,
      alive: a.alive,
      hp: a.hp,
      armor: a.armor,
      slot: a.slot,
      inventory: a.inventory.map((m) => (m ? { ...m } : null)) as Inventory,
      kills: a.kills,
      deaths: a.deaths,
      reloadLeft: a.reloadLeft,
      spread: a.spread,
      moving: a.moving,
      seen: a.seen,
      seenPosition: { ...a.seenPosition },
    }))
    return {
      phase: this.phase,
      round: this.round,
      time: this.bomb.state === 'planted' ? this.bomb.remaining : this.remaining,
      scores: { ...this.scores },
      alive: {
        T: this.actors.filter((a) => a.team === 'T' && a.alive).length,
        CT: this.actors.filter((a) => a.team === 'CT' && a.alive).length,
      },
      feed: this.feed.filter((f) => this.elapsed - f.time < 7.5),
      actor: actors[this.viewId],
      actors,
      elapsed: this.elapsed,
      endIn: this.endDelay,
      team: this.team,
      playerId: this.playerId,
      spectating: this.spectating,
      bomb: { ...this.bomb },
      area: areaAt(this.view.x, this.view.z),
      scope: this.scoped,
      hit: this.hit,
      damage: this.hurt,
      progress: this.progress,
      prompt: this.prompt,
      winner: this.winner,
      reason: this.reason,
      flash: this.flash,
      options: { ...this.options },
      pointerFallback: this.clickFallback,
    }
  }
}

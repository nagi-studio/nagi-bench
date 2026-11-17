import { WEAPONS } from './arsenal'
import { ROUTES, SITES, clamp, distance2, groundY, type Point, type Vec } from './level'
import { blocked, clearSight, direction, eyeAt, yawTo } from './physics'
import { currentAmmo, type Actor, type Match } from './match'

export interface Brain {
  state: 'route' | 'patrol' | 'engage' | 'investigate' | 'objective'
  route: Point[]
  stage: number
  patrolAt: number
  patrolStep: number
  goal: Point | null
  path: Point[]
  replanAt: number
  thinkAt: number
  target: number | null
  lastSeen: Point | null
  lastSeenAt: number
  respondAt: number
  shootAt: number
  burst: number
  alarmedUntil: number
  interact: boolean
}

export function newBrain(time: number): Brain {
  return {
    state: 'route', route: [], stage: 0, patrolAt: 0, patrolStep: 0,
    goal: null, path: [], replanAt: 0, thinkAt: time, target: null, lastSeen: null,
    lastSeenAt: -100, respondAt: 0, shootAt: 0, burst: 0, alarmedUntil: 0, interact: false,
  }
}

const LONG_EXIT = { x: 36.7, z: -7.8 }
const TUNNEL_EXIT = { x: -31.8, z: -7.9 }
const SHORT_ENTRY = { x: 10.4, z: 6.9 }
const SHORT_EXIT = { x: 20.1, z: -11.6 }

export function setAssignments(match: Match) {
  for (const actor of match.actors) {
    const { index, team } = actor
    if (team === 'CT') {
      const routes = [
        [ROUTES.midNorth, { x: 2, z: -11.8 }],
        [ROUTES.bBack, { x: -32.4, z: -22.2 }],
        [ROUTES.aBack, { x: 31, z: -18.3 }],
        [ROUTES.midNorth, { x: -2.1, z: -12.0 }],
        match.attackSite === 'A' ? [ROUTES.aBack, { x: 27.3, z: -15.4 }] : [ROUTES.bBack, { x: -27.3, z: -19.4 }],
      ]
      actor.brain.route = routes[index]
    } else {
      const long = [ROUTES.long, LONG_EXIT, { x: 36.8, z: -17.7 }]
      const tunnel = [ROUTES.tunnel, TUNNEL_EXIT, { x: -34.2, z: -19.4 }]
      const short = [SHORT_ENTRY, ROUTES.cat, SHORT_EXIT, { x: 30.8, z: -17 }]
      const routes = match.attackSite === 'A'
        ? [long, tunnel, long, short, short]
        : [tunnel, tunnel, tunnel, [ROUTES.mid, ROUTES.midNorth, ROUTES.bBack, SITES.B], short]
      actor.brain.route = routes[index].slice()
      if (match.bomb.state === 'carried' && match.bomb.actor === actor.id) {
        actor.brain.route[actor.brain.route.length - 1] = SITES[match.attackSite]
      }
    }
  }
}

const wrap = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle))

function turn(actor: Actor, yaw: number, pitch: number, dt: number, speed: number) {
  actor.yaw += clamp(wrap(yaw - actor.yaw), -speed * dt, speed * dt)
  actor.pitch += clamp(pitch - actor.pitch, -speed * 0.7 * dt, speed * 0.7 * dt)
}

function sight(actor: Actor, enemy: Actor) {
  const from = eyeAt(actor.position)
  return clearSight(from, { ...enemy.position, y: enemy.position.y + 1.43 }) ||
    clearSight(from, { ...enemy.position, y: enemy.position.y + 1.12 })
}

function acquire(match: Match, actor: Actor) {
  const brain = actor.brain
  if (match.time < brain.thinkAt) return
  brain.thinkAt = match.time + 0.105 + match.random() * 0.08
  const facing = direction(actor.yaw)
  let best: Actor | null = null
  let closest = 43
  for (const enemy of match.actors) {
    if (!enemy.alive || enemy.team === actor.team) continue
    const distance = distance2(actor.position, enemy.position)
    const weight = enemy.id === brain.target ? 0.73 : 1
    if (distance * weight >= closest || distance > 46) continue
    const front = (facing.x * (enemy.position.x - actor.position.x) + facing.z * (enemy.position.z - actor.position.z)) / Math.max(0.1, distance)
    const alerted = actor.brain.alarmedUntil > match.time || match.time - enemy.lastShot < 0.56
    if (distance > (alerted ? 15 : 3.1) && front < 0.25) continue
    if (!sight(actor, enemy)) continue
    best = enemy
    closest = distance * weight
  }
  if (best && best.id !== brain.target) {
    brain.respondAt = match.time + 0.23 + match.random() * 0.32
    brain.burst = 0
  }
  brain.target = best?.id ?? null
  if (best) {
    brain.lastSeen = { x: best.position.x, z: best.position.z }
    brain.lastSeenAt = match.time
  }
}

function closestBot(match: Match, team: Actor['team'], point: Point) {
  let distance = Infinity
  let result: Actor | null = null
  for (const actor of match.actors) {
    if (!actor.alive || actor.team !== team || actor.id === match.controlled) continue
    const candidate = distance2(actor.position, point)
    if (candidate >= distance) continue
    result = actor
    distance = candidate
  }
  return result
}

function objective(match: Match, actor: Actor): Point | null {
  const bomb = match.bomb
  if (bomb.state === 'dropped' && actor.team === 'T') {
    return closestBot(match, 'T', bomb.position)?.id === actor.id ? bomb.position : null
  }
  if (bomb.state === 'planted') {
    if (actor.team === 'CT') {
      const lead = closestBot(match, 'CT', bomb.position)
      if (lead?.id === actor.id || distance2(actor.position, bomb.position) > 11) return bomb.position
      const angle = actor.index * 2.39
      return { x: bomb.position.x + Math.cos(angle) * 5.7, z: bomb.position.z + Math.sin(angle) * 5.7 }
    }
    const angle = actor.index * 1.67
    return { x: bomb.position.x + Math.cos(angle) * 5.6, z: bomb.position.z + Math.sin(angle) * 5.6 }
  }
  if (bomb.state === 'carried' && bomb.actor === actor.id && actor.brain.stage >= actor.brain.route.length) {
    return SITES[match.attackSite]
  }
  return null
}

function pathStep(match: Match, actor: Actor, goal: Point, speed: number, dt: number) {
  const b = actor.brain
  const changed = !b.goal || distance2(b.goal, goal) > 0.75
  if (changed || (match.time >= b.replanAt && distance2(actor.position, goal) > 0.7)) {
    b.goal = { ...goal }
    b.path = match.nav.path(actor.position, goal)
    b.replanAt = match.time + 1.35 + match.random() * 0.5
  }
  while (b.path.length && distance2(actor.position, b.path[0]) < 0.40) b.path.shift()
  const next = b.path[0]
  if (!next) {
    match.move(actor, 0, 0, false, dt)
    return false
  }
  const heading = yawTo(actor.position, next)
  turn(actor, heading, 0, dt, 7.5)
  const length = distance2(next, actor.position) || 1
  let x = (next.x - actor.position.x) / length
  let z = (next.z - actor.position.z) / length
  for (const ally of match.actors) {
    if (!ally.alive || ally.id === actor.id || ally.team !== actor.team) continue
    const d = distance2(ally.position, actor.position)
    if (d > 0.92 || d < 0.04) continue
    x += (actor.position.x - ally.position.x) / d * (0.92 - d) * 0.87
    z += (actor.position.z - ally.position.z) / d * (0.92 - d) * 0.87
  }
  const step = Math.min(speed, length / dt)
  match.move(actor, x * step, z * step, false, dt)
  return true
}

function patrol(match: Match, actor: Actor, dt: number) {
  const brain = actor.brain
  const home = brain.route[brain.route.length - 1]
  if (match.time >= brain.patrolAt) {
    brain.patrolAt = match.time + 4.1 + match.random() * 2.5
    brain.patrolStep += 1
  }
  const swing = brain.patrolStep * 2.4 + actor.index * 1.8
  const point = {
    x: home.x + Math.cos(swing) * (actor.team === 'CT' ? 3.2 : 5.2),
    z: home.z + Math.sin(swing) * 3.7,
  }
  const goal = blocked(point.x, point.z, groundY(point.x, point.z), 0.54) ? home : point
  if (!pathStep(match, actor, goal, 2.85, dt)) {
    const heading = actor.team === 'CT' ? Math.PI : 0
    turn(actor, heading + Math.sin(match.time * 0.69 + actor.index) * 1.45, 0, dt, 3)
  }
}

function engage(match: Match, actor: Actor, enemy: Actor, dt: number) {
  const brain = actor.brain
  const weapon = currentAmmo(actor).id
  const data = WEAPONS[weapon]
  const range = distance2(actor.position, enemy.position)
  if (weapon === 'knife' && range > 1.5) {
    pathStep(match, actor, enemy.position, 4.45, dt)
    return
  }

  const aim: Vec = { ...enemy.position, y: enemy.position.y + (brain.burst === 1 && actor.index % 3 === 0 ? 1.62 : 1.36) }
  const eye = eyeAt(actor.position)
  if (!clearSight(eye, aim)) aim.y = enemy.position.y + 1.63
  const aimYaw = yawTo(eye, aim)
  const yaw = aimYaw + Math.sin(match.time * 9 + actor.id * 2.2) * (weapon === 'awp' ? 0.009 : 0.021)
  const pitch = Math.atan2(aim.y - eye.y, range) - actor.recoil * 0.68
    + Math.cos(match.time * 7.3 + actor.id) * (weapon === 'awp' ? 0.008 : 0.019)
  turn(actor, yaw, pitch, dt, 8.6)

  const strafe = Math.sin(match.time * 3.55 + actor.id * 1.7)
  const approach = range > (actor.slot === 'secondary' ? 16 : 28) ? 0.77 : range < 3.1 ? -0.65 : 0.06
  const stride = weapon === 'awp' ? 0.51 : actor.reloadEnd ? 1.5 : 1.1
  match.move(actor,
    (Math.cos(aimYaw) * strafe - Math.sin(aimYaw) * approach) * stride,
    (-Math.sin(aimYaw) * strafe - Math.cos(aimYaw) * approach) * stride, false, dt)

  if (match.time < Math.max(brain.respondAt, brain.shootAt) || Math.abs(wrap(aimYaw - actor.yaw)) > 0.11 ||
    !clearSight(eyeAt(actor.position), aim)) return
  if (weapon === 'awp') actor.scoped = true
  if (!match.fire(actor)) return
  brain.burst += 1
  if (brain.burst >= 2 + (actor.index % 3)) {
    brain.shootAt = match.time + 0.33 + match.random() * 0.37
    brain.burst = 0
  } else {
    brain.shootAt = match.time + data.interval + 0.055 + match.random() * 0.095
  }
}

export function stepBot(match: Match, actor: Actor, dt: number) {
  const b = actor.brain
  b.interact = false
  const ammo = currentAmmo(actor)
  if (ammo.id !== 'knife' && ammo.loaded === 0 && !actor.reloadEnd) {
    if (ammo.reserve) match.reload(actor)
    else match.equip(actor, actor.slot === 'primary' && Boolean(actor.loadout.secondary?.loaded || actor.loadout.secondary?.reserve) ? 'secondary' : 'melee')
  }

  acquire(match, actor)
  const enemy = b.target === null ? null : match.actors[b.target]
  const interaction = match.canInteract(actor)
  if (interaction && (!enemy?.alive || match.interaction?.actor === actor.id || (interaction === 'defuse' && match.clock < 8))) {
    b.state = 'objective'
    b.interact = true
    match.move(actor, 0, 0, false, dt)
    if (interaction === 'defuse' && match.bomb.state === 'planted') {
      turn(actor, yawTo(actor.position, match.bomb.position), -0.4, dt, 4.1)
    }
    return
  }

  if (enemy?.alive && sight(actor, enemy)) {
    b.state = 'engage'
    engage(match, actor, enemy, dt)
    return
  }

  const task = objective(match, actor)
  if (task) {
    b.state = 'objective'
    if (!pathStep(match, actor, task, 4.35, dt)) {
      turn(actor, actor.yaw + dt * 0.66, 0, dt, 3)
    }
    return
  }

  if (b.lastSeen && match.time - b.lastSeenAt < 2.3 && distance2(actor.position, b.lastSeen) > 1.6) {
    b.state = 'investigate'
    pathStep(match, actor, b.lastSeen, 3.72, dt)
    return
  }

  if (b.stage < b.route.length) {
    b.state = 'route'
    const goal = b.route[b.stage]
    if (distance2(actor.position, goal) < 0.9) b.stage += 1
    else {
      pathStep(match, actor, goal, 4.05, dt)
      return
    }
  }
  if (b.stage === b.route.length) {
    b.state = 'patrol'
    patrol(match, actor, dt)
  }
}

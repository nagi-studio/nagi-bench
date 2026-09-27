import { angNorm, forwardFromYaw, rightFromYaw, yawToward } from './math'
import { cellCenter, inSite, type Rect } from './mapData'
import { findPath, type NavNode } from './nav'
import type { Actor } from './actor'
import { currentWeapon } from './actor'
import { RUN_SPEED, type World } from './world'
import { WEAPONS } from './weapons'

export interface BombView {
  state: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded'
  x: number
  y: number
  z: number
  carrierId: string | null
}

export interface AIWorld {
  actors: Actor[]
  world: World
  nav: NavNode[]
  bomb: BombView
  sitesA: Rect[]
  sitesB: Rect[]
  now: number
  controlId: string
  fetcherId: string | null
  onSpot: (id: string) => void
}

const PT = (c: number, r: number, y = 0) => cellCenter(c, r, y)

function routeFor(team: Actor['team'], index: number, site: 'a' | 'b'): { pts: { x: number; y: number; z: number }[]; hold: number; site: 'a' | 'b' } {
  if (team === 't') {
    const choices = [
      { pts: [PT(6, 18), PT(6, 32), PT(5, 49)], hold: 0, site: 'a' as const },
      { pts: [PT(22, 16), PT(26, 28), PT(12, 36), PT(5, 48)], hold: 0, site: 'a' as const },
      { pts: [PT(26, 28), PT(23, 40, 2.4), PT(26, 45, 3.2), PT(5, 49)], hold: 0, site: 'a' as const },
      { pts: [PT(36, 8), PT(41, 16), PT(41, 29)], hold: 0, site: 'b' as const },
      { pts: [PT(41, 14), PT(43, 27), PT(40, 32)], hold: Math.PI, site: 'b' as const },
    ]
    return choices[index % choices.length]
  }
  const choices = [
    { pts: [PT(5, 48), PT(6, 42)], hold: 0, site: 'a' as const },
    { pts: [PT(6, 30), PT(6, 22)], hold: 0, site: 'a' as const },
    { pts: [PT(24, 28), PT(26, 45, 3.2)], hold: 0, site: 'a' as const },
    { pts: [PT(40, 30), PT(42, 26)], hold: 0, site: 'b' as const },
    { pts: [PT(38, 34), PT(41, 22)], hold: 0, site: 'b' as const },
  ]
  const picked = choices[index % choices.length]
  if (site === 'b' && index === 0) return choices[3]
  return picked
}

export function assignBrain(actor: Actor, index: number): void {
  const site: 'a' | 'b' = index % 2 === 0 ? 'a' : 'b'
  const route = routeFor(actor.team, index, site)
  actor.brain = {
    route: route.pts,
    routeI: 0,
    path: [],
    pathI: 0,
    replan: 0,
    enemyId: null,
    react: 0,
    strafe: 1,
    strafeT: 0.5,
    burst: 0,
    burstGap: 0.2,
    stuck: 0,
    lx: actor.pos.x,
    lz: actor.pos.z,
    holdYaw: route.hold,
    site: route.site,
    acquired: false,
    mode: 'route',
  }
}

function eye(a: Actor): { x: number; y: number; z: number } {
  return { x: a.pos.x, y: a.pos.y + (a.crouch ? 1.02 : 1.58), z: a.pos.z }
}

function sees(from: Actor, to: Actor, world: World): boolean {
  if (!to.alive) return false
  const e = eye(from)
  const tx = to.pos.x
  const ty = to.pos.y + 1.2
  const tz = to.pos.z
  const dx = tx - e.x
  const dy = ty - e.y
  const dz = tz - e.z
  const dist = Math.hypot(dx, dy, dz)
  if (dist > 72 || dist < 0.05) return false
  const f = forwardFromYaw(from.yaw)
  const flat = Math.hypot(dx, dz) || 1
  const dot = (f.x * dx + f.z * dz) / flat
  if (dist > 3.2 && dot < 0.08) return false
  const hit = world.raycast(e.x, e.y, e.z, dx / dist, dy / dist, dz / dist, dist - 0.35)
  return !hit
}

function steer(actor: Actor, world: AIWorld, dest: { x: number; y: number; z: number }, dt: number, speed: number): void {
  const b = actor.brain!
  b.replan -= dt
  const last = b.path[b.path.length - 1]
  const need =
    b.path.length === 0 ||
    !last ||
    Math.hypot(last.x - dest.x, last.z - dest.z) > 2.5 ||
    b.replan <= 0
  if (need) {
    b.path = findPath(world.nav, actor.pos.x, actor.pos.z, dest.x, dest.z, actor.pos.y, dest.y)
    b.pathI = 0
    b.replan = 0.45
  }
  while (b.pathI < b.path.length && Math.hypot(b.path[b.pathI].x - actor.pos.x, b.path[b.pathI].z - actor.pos.z) < 0.75) {
    b.pathI++
  }
  const wp = b.path[Math.min(b.pathI, Math.max(0, b.path.length - 1))] ?? dest
  let wx = wp.x - actor.pos.x
  let wz = wp.z - actor.pos.z
  const len = Math.hypot(wx, wz)
  if (len > 0.001) {
    wx /= len
    wz /= len
  }
  const moved = Math.hypot(actor.pos.x - b.lx, actor.pos.z - b.lz)
  if (moved < 0.02) b.stuck += dt
  else b.stuck = 0
  b.lx = actor.pos.x
  b.lz = actor.pos.z
  actor.jump = b.stuck > 0.55 && actor.onGround
  if (actor.jump) b.stuck = 0
  actor.wishX = wx
  actor.wishZ = wz
  actor.wishSpeed = speed
  if (len > 0.2) {
    const targetYaw = yawToward(wx, wz)
    const maxStep = 4.5 * dt
    const diff = angNorm(targetYaw - actor.yaw)
    actor.yaw += Math.max(-maxStep, Math.min(maxStep, diff))
    const pitchTarget = 0
    actor.pitch += (pitchTarget - actor.pitch) * Math.min(1, dt * 4)
  }
}

function fight(actor: Actor, enemy: Actor, dt: number): void {
  const b = actor.brain!
  const e = eye(actor)
  const aimY = enemy.pos.y + (actor.skill > 1 && Math.random() < 0.01 ? 1.62 : 1.15)
  const dx = enemy.pos.x - e.x
  const dy = aimY - e.y
  const dz = enemy.pos.z - e.z
  const dist = Math.hypot(dx, dy, dz)
  const desiredYaw = yawToward(dx, dz)
  const desiredPitch = Math.atan2(dy, Math.hypot(dx, dz) || 1)
  const turn = (2.2 + actor.skill * 2.2) * dt
  actor.yaw += Math.max(-turn, Math.min(turn, angNorm(desiredYaw - actor.yaw)))
  actor.pitch += Math.max(-turn, Math.min(turn, desiredPitch - actor.pitch))
  b.strafeT -= dt
  if (b.strafeT <= 0) {
    b.strafe = Math.random() < 0.5 ? -1 : 1
    b.strafeT = 0.35 + Math.random() * 0.7
  }
  const f = forwardFromYaw(actor.yaw)
  const r = rightFromYaw(actor.yaw)
  let fwd = 0
  if (dist > 22) fwd = 1
  else if (dist < 6) fwd = -0.55
  actor.wishX = f.x * fwd + r.x * b.strafe * 0.85
  actor.wishZ = f.z * fwd + r.z * b.strafe * 0.85
  actor.wishSpeed = dist > 26 ? RUN_SPEED : RUN_SPEED * 0.62
  actor.jump = false
  const yawErr = Math.abs(angNorm(desiredYaw - actor.yaw))
  const pitErr = Math.abs(desiredPitch - actor.pitch)
  if (!b.acquired) {
    b.react = 0.16 + (1.15 - actor.skill) * 0.28
    b.acquired = true
  }
  b.react -= dt
  const w = currentWeapon(actor)
  const def = WEAPONS[w.id]
  if (def.scope) actor.crouch = false
  if (w.mag <= 0 && !def.melee) actor.wantReload = true
  if (b.react <= 0 && yawErr < 0.14 + (1.1 - actor.skill) * 0.05 && pitErr < 0.12) {
    if (b.burst > 0) {
      actor.wantFire = true
      b.burst -= dt
    } else {
      b.burstGap -= dt
      if (b.burstGap <= 0) {
        const burstLen = def.scope ? 0.05 : def.auto ? 0.22 + Math.random() * 0.35 : 0.05
        b.burst = burstLen
        b.burstGap = def.scope ? 0.7 : 0.18 + Math.random() * 0.45
      }
    }
  }
  const slow = actor.onGround && Math.hypot(actor.vel.x, actor.vel.z) < 1.3
  if (def.scope) {
    actor.scoped = slow || dist > 8
    if (slow) actor.wishSpeed = 0
  }
}

export function updateBot(actor: Actor, world: AIWorld, dt: number): void {
  const b = actor.brain
  if (!b || !actor.alive || actor.id === world.controlId) return
  actor.wantFire = false
  actor.wantReload = false
  actor.wantUse = false
  actor.jump = false
  actor.wishX = 0
  actor.wishZ = 0
  actor.wishSpeed = 0

  let seen: Actor | null = null
  let seenD = Infinity
  for (const other of world.actors) {
    if (other.team === actor.team || !other.alive) continue
    if (!sees(actor, other, world.world)) continue
    world.onSpot(other.id)
    const d = Math.hypot(other.pos.x - actor.pos.x, other.pos.z - actor.pos.z)
    if (d < seenD) {
      seenD = d
      seen = other
    }
  }
  if (!seen) b.acquired = false

  const bomb = world.bomb
  const planted = bomb.state === 'planted'

  if (actor.team === 'ct' && planted) {
    const d = Math.hypot(bomb.x - actor.pos.x, bomb.z - actor.pos.z)
    if (seen && seenD < 16 && d > 3) {
      fight(actor, seen, dt)
      return
    }
    if (d > 1.6) {
      steer(actor, world, { x: bomb.x, y: 0, z: bomb.z }, dt, RUN_SPEED)
      return
    }
    actor.wishSpeed = 0
    actor.wantUse = !seen || seenD > 9
    actor.yaw += Math.sin(world.now * 1.5) * dt * 0.4
    return
  }

  if (actor.team === 't' && bomb.state === 'dropped' && world.fetcherId === actor.id) {
    const d = Math.hypot(bomb.x - actor.pos.x, bomb.z - actor.pos.z)
    if (d > 1.2) {
      if (seen && seenD < 10) fight(actor, seen, dt)
      else steer(actor, world, { x: bomb.x, y: bomb.y, z: bomb.z }, dt, RUN_SPEED)
      return
    }
  }

  if (actor.hasBomb && (bomb.state === 'carried' || bomb.carrierId === actor.id)) {
    const siteRects = b.site === 'a' ? world.sitesA : world.sitesB
    const inside = inSite(siteRects, actor.pos.x, actor.pos.z)
    const dest = b.site === 'a' ? PT(5, 49) : PT(41, 29)
    if (inside && (!seen || seenD > 12)) {
      actor.wishSpeed = 0
      actor.wantUse = true
      actor.yaw += Math.sin(world.now) * dt * 0.2
      return
    }
    if (seen && seenD < 14) {
      fight(actor, seen, dt)
      return
    }
    steer(actor, world, dest, dt, RUN_SPEED)
    return
  }

  if (actor.team === 't' && planted) {
    const defend = b.site === 'a' ? PT(6, 36) : PT(41, 20)
    if (seen) {
      fight(actor, seen, dt)
      return
    }
    const d = Math.hypot(defend.x - actor.pos.x, defend.z - actor.pos.z)
    if (d > 2) steer(actor, world, defend, dt, RUN_SPEED * 0.9)
    else {
      actor.yaw = yawToward(bomb.x - actor.pos.x, bomb.z - actor.pos.z)
    }
    const w = currentWeapon(actor)
    if (w.mag < WEAPONS[w.id].mag * 0.3 && !WEAPONS[w.id].melee) actor.wantReload = true
    return
  }

  if (seen) {
    fight(actor, seen, dt)
    return
  }

  const w = currentWeapon(actor)
  if (!WEAPONS[w.id].melee && w.mag === 0) actor.wantReload = true
  else if (!WEAPONS[w.id].melee && w.mag < WEAPONS[w.id].mag * 0.35) actor.wantReload = true

  if (actor.team === 'ct') {
    const anchor = b.route[b.route.length - 1]
    const ad = Math.hypot(anchor.x - actor.pos.x, anchor.z - actor.pos.z)
    if (ad < 1.6) {
      const diff = angNorm(b.holdYaw - actor.yaw)
      actor.yaw += Math.max(-2 * dt, Math.min(2 * dt, diff))
      actor.yaw += Math.sin(world.now * 0.6 + actor.skill) * dt * 0.25
      return
    }
    steer(actor, world, anchor, dt, RUN_SPEED)
    return
  }

  if (b.routeI < b.route.length - 1) {
    const goal = b.route[b.routeI]
    if (Math.hypot(goal.x - actor.pos.x, goal.z - actor.pos.z) < 1.5) b.routeI++
  }
  const goal = b.route[b.routeI]
  if (b.routeI === b.route.length - 1 && Math.hypot(goal.x - actor.pos.x, goal.z - actor.pos.z) < 2) {
    actor.yaw += Math.sin(world.now * 0.8 + actor.skill * 3) * dt * 0.5
    return
  }
  steer(actor, world, goal, dt, RUN_SPEED)
}

export function botPreferredSite(actor: Actor): 'a' | 'b' {
  return actor.brain?.site ?? 'a'
}

export function visibleEnemyIds(from: Actor, actors: Actor[], world: World): string[] {
  const ids: string[] = []
  for (const other of actors) {
    if (other.team === from.team || !other.alive) continue
    if (sees(from, other, world)) ids.push(other.id)
  }
  return ids
}

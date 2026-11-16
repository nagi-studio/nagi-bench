import { DustMap, A_SITE_CENTER, B_SITE_CENTER, worldOf } from './map'
import { WeaponId, WEAPONS, ZONE_BANDS, zoneForHit, applyArmor } from './weapons'
import { CharacterRig } from './world'

export type BotState = 'hold' | 'advance' | 'engage' | 'plant' | 'defuse' | 'dead'
export type Team = 'CT' | 'T'

export interface Bot {
  id: number
  name: string
  team: Team
  x: number; y: number; z: number
  yaw: number; pitch: number
  vx: number; vz: number
  hp: number; armor: number; helmet: boolean
  alive: boolean
  weapon: WeaponId
  ammo: number
  reloading: number
  nextShot: number
  state: BotState
  path: [number, number][]
  pathIdx: number
  targetId: number
  reaction: number
  aimError: number
  strafe: number
  strafeUntil: number
  repathAt: number
  hasBomb: boolean
  plantProgress: number
  defuseProgress: number
  rig: CharacterRig
  aimX: number; aimY: number; aimZ: number
  burst: number
}

export const BOT_NAMES: Record<Team, string[]> = {
  T: ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'],
  CT: ['Victor', 'Wolf', 'Yuri', 'Zulu', 'X-ray'],
}

let rngState = 987654321
export function rnd(): number {
  rngState ^= rngState << 13; rngState ^= rngState >>> 17; rngState ^= rngState << 5
  return ((rngState >>> 0) % 100000) / 100000
}

export interface BotWorldView {
  map: DustMap
  bots: Bot[]
  player: { x: number; y: number; z: number; team: Team; alive: boolean; hp: number }
  bomb: { carrier: number | null; x: number; z: number; y: number; planted: boolean; site: 'A' | 'B' | null; timer: number; defuse: number }
  time: number
}

const BOT_SPEED = 4.4
const BOT_EYE = 1.62

export function botCanSee(wv: BotWorldView, bot: Bot, tx: number, ty: number, tz: number): boolean {
  if (!wv.map.lineOfSight(bot.x, bot.z, tx, tz, BOT_EYE)) return false
  const dx = tx - bot.x
  const dz = tz - bot.z
  const want = Math.atan2(dx, dz)
  let diff = want - bot.yaw
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  return Math.abs(diff) < 1.25 || wv.bomb.planted
}

interface Target { x: number; y: number; z: number; bot: Bot | null }

function pickTarget(wv: BotWorldView, bot: Bot): Target | null {
  let best: Target | null = null
  let bestD = 1e9
  for (const other of wv.bots) {
    if (other.id === bot.id || !other.alive || other.team === bot.team) continue
    const d = Math.hypot(other.x - bot.x, other.z - bot.z)
    if (d > 70) continue
    if (!botCanSee(wv, bot, other.x, other.y + 1.3, other.z)) continue
    if (d < bestD) {
      bestD = d
      best = { x: other.x, y: other.y + 1.25, z: other.z, bot: other }
    }
  }
  if (wv.player.alive && wv.player.team !== bot.team) {
    const d = Math.hypot(wv.player.x - bot.x, wv.player.z - bot.z)
    if (d < 70 && d < bestD && botCanSee(wv, bot, wv.player.x, wv.player.y + 1.3, wv.player.z)) {
      best = { x: wv.player.x, y: wv.player.y + 1.25, z: wv.player.z, bot: null }
    }
  }
  return best
}

function nearestEnemyDist(wv: BotWorldView, bot: Bot): number {
  let d = 1e9
  for (const o of wv.bots) {
    if (!o.alive || o.team === bot.team) continue
    d = Math.min(d, Math.hypot(o.x - bot.x, o.z - bot.z))
  }
  if (wv.player.alive && wv.player.team !== bot.team) {
    d = Math.min(d, Math.hypot(wv.player.x - bot.x, wv.player.z - bot.z))
  }
  return d
}

function moveTowards(bot: Bot, map: DustMap, tx: number, tz: number, dt: number, speed: number) {
  const dx = tx - bot.x
  const dz = tz - bot.z
  const d = Math.hypot(dx, dz)
  if (d < 0.05) return
  const nx = dx / d
  const nz = dz / d
  const step = speed * dt
  const r = 0.42
  // axis separated movement keeps bots from wedging into corners
  if (!map.solidAt(bot.x + nx * (step + r), bot.z, 1)) bot.x += nx * step
  if (!map.solidAt(bot.x, bot.z + nz * (step + r), 1)) bot.z += nz * step
  const want = Math.atan2(nx, nz)
  let diff = want - bot.yaw
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  bot.yaw += diff * Math.min(1, dt * 7)
}

function repath(bot: Bot, map: DustMap, tx: number, tz: number) {
  bot.path = map.path(bot.x, bot.z, tx, tz)
  bot.pathIdx = 0
}

export function updateBot(wv: BotWorldView, bot: Bot, dt: number) {
  if (!bot.alive) {
    bot.state = 'dead'
    bot.rig.root.rotation.z = Math.PI / 2
    bot.rig.root.position.y = 0.4
    return
  }
  const map = wv.map
  const w = WEAPONS[bot.weapon]
  const target = pickTarget(wv, bot)
  if (target && target.bot) bot.targetId = target.bot.id
  else if (wv.time > bot.repathAt + 1.5) bot.targetId = -1

  // reloading
  if (bot.reloading > 0) {
    bot.reloading -= dt
    if (bot.reloading <= 0) bot.ammo = w.mag
  }

  const enemyNear = nearestEnemyDist(wv, bot)

  // --- combat ---
  if (target && bot.state !== 'plant' && bot.state !== 'defuse') {
    bot.state = 'engage'
    const dx = target.x - bot.x
    const dy = target.y + 1.25 - (bot.y + BOT_EYE)
    const dz = target.z - bot.z
    const want = Math.atan2(dx, dz)
    let diff = want - bot.yaw
    while (diff > Math.PI) diff -= Math.PI * 2
    while (diff < -Math.PI) diff += Math.PI * 2
    bot.yaw += diff * Math.min(1, dt * 8)
    const wantPitch = Math.atan2(dy, Math.hypot(dx, dz))
    bot.pitch += (wantPitch - bot.pitch) * Math.min(1, dt * 8)
    bot.aimX = target.x; bot.aimY = target.y + 1.25; bot.aimZ = target.z

    // strafe so bots are not static targets
    if (wv.time > bot.strafeUntil) {
      bot.strafe = rnd() < 0.5 ? -1 : 1
      bot.strafeUntil = wv.time + 0.6 + rnd() * 0.9
    }
    const sx = Math.cos(bot.yaw) * bot.strafe
    const sz = -Math.sin(bot.yaw) * bot.strafe
    if (!map.solidAt(bot.x + sx * 0.5, bot.z + sz * 0.5, 1)) {
      bot.x += sx * 2.2 * dt
      bot.z += sz * 2.2 * dt
    }
    // keep a sensible distance: push in if too far, back off if too close
    const d = Math.hypot(dx, dz)
    if (d > 18 && !map.solidAt(bot.x + (dx / d) * 0.6, bot.z + (dz / d) * 0.6, 1)) {
      bot.x += (dx / d) * 1.6 * dt
      bot.z += (dz / d) * 1.6 * dt
    }

    if (bot.reaction > 0) {
      bot.reaction -= dt
    } else if (target.bot && bot.ammo > 0 && wv.time >= bot.nextShot && enemyNear < w.range) {
      bot.nextShot = wv.time + 60 / w.rpm
      bot.ammo--
      bot.burst++
      // accuracy: bots miss more at long range and while their target moves
      const dist = Math.hypot(dx, dz)
      const spread = (w.spread + w.spreadGrow * 0.6) * (1 + dist / 26)
      const errX = (rnd() - 0.5) * spread * 2.4
      const errY = (rnd() - 0.5) * spread * 2.0
      fireBotShot(bot, target.bot, errX, errY)
      if (bot.ammo === 0) bot.reloading = w.reload
    }
  } else {
    // --- objective behaviour ---
    const site: 'A' | 'B' = bot.id % 2 === 0 ? 'A' : 'B'
    if (bot.team === 'T') {
      if (wv.bomb.planted) {
        // hold near the bomb site and defend it
        const [gx, gz] = worldOf(...(wv.bomb.site === 'A' ? A_SITE_CENTER : B_SITE_CENTER))
        bot.state = 'advance'
        if (wv.time > bot.repathAt) { repath(bot, map, gx, gz); bot.repathAt = wv.time + 2.5 }
        followPath(bot, map, gx, gz, dt)
      } else if (bot.hasBomb) {
        const [gx, gz] = worldOf(...(site === 'A' ? A_SITE_CENTER : B_SITE_CENTER))
        const atSite = Math.hypot(bot.x - gx, bot.z - gz) < 5.5
        if (atSite && enemyNear > 14) {
          bot.state = 'plant'
          bot.plantProgress += dt
        } else {
          bot.state = 'advance'
          if (wv.time > bot.repathAt) { repath(bot, map, gx, gz); bot.repathAt = wv.time + 2.5 }
          followPath(bot, map, gx, gz, dt)
        }
      } else {
        // escort the bomb carrier to the site
        const carrier = wv.bots.find((b) => b.hasBomb)
        if (carrier) {
          bot.state = 'advance'
          if (wv.time > bot.repathAt) { repath(bot, map, carrier.x, carrier.z); bot.repathAt = wv.time + 2 }
          followPath(bot, map, carrier.x, carrier.z, dt)
        } else {
          const [gx, gz] = worldOf(...(site === 'A' ? A_SITE_CENTER : B_SITE_CENTER))
          bot.state = 'advance'
          if (wv.time > bot.repathAt) { repath(bot, map, gx, gz); bot.repathAt = wv.time + 2.5 }
          followPath(bot, map, gx, gz, dt)
        }
      }
    } else {
      if (wv.bomb.planted) {
        const [gx, gz] = worldOf(...(wv.bomb.site === 'A' ? A_SITE_CENTER : B_SITE_CENTER))
        const atSite = Math.hypot(bot.x - gx, bot.z - gz) < 4.5
        if (atSite) {
          bot.state = 'defuse'
          bot.defuseProgress += dt
        } else {
          bot.state = 'advance'
          if (wv.time > bot.repathAt) { repath(bot, map, gx, gz); bot.repathAt = wv.time + 2 }
          followPath(bot, map, gx, gz, dt)
        }
      } else {
        // hold the sites, rotate towards the likely push
        const [gx, gz] = worldOf(...(site === 'A' ? A_SITE_CENTER : B_SITE_CENTER))
        bot.state = 'hold'
        if (wv.time > bot.repathAt) {
          repath(bot, map, gx + (rnd() - 0.5) * 8, gz + (rnd() - 0.5) * 8)
          bot.repathAt = wv.time + 3.5
        }
        followPath(bot, map, gx, gz, dt)
      }
    }
  }

  // rig transform
  const rig = bot.rig
  rig.root.position.set(bot.x, bot.y, bot.z)
  rig.root.rotation.y = bot.yaw
  // walk cycle
  const moving = Math.abs(bot.vx) + Math.abs(bot.vz) > 0.2
  const swing = moving ? Math.sin(wv.time * 9 + bot.id) * 0.6 : 0
  rig.legL.rotation.x = swing
  rig.legR.rotation.x = -swing
  rig.armL.rotation.x = -0.95 + (target ? 0 : swing * 0.4)
}

function followPath(bot: Bot, map: DustMap, tx: number, tz: number, dt: number) {
  if (!bot.path.length) { repath(bot, map, tx, tz); return }
  let node = bot.path[bot.pathIdx]
  if (!node) { repath(bot, map, tx, tz); return }
  if (Math.hypot(node[0] - bot.x, node[1] - bot.z) < 1.0) {
    bot.pathIdx++
    node = bot.path[bot.pathIdx]
    if (!node) { repath(bot, map, tx, tz); return }
  }
  moveTowards(bot, map, node[0], node[1], dt, BOT_SPEED)
  bot.vx = node[0] - bot.x
  bot.vz = node[1] - bot.z
}

/** resolve one bot shot against the world; returns the victim or null */
export function fireBotShot(
  bot: Bot,
  target: Bot,
  errX: number,
  errY: number,
): { victim: Bot | null; zone: string | null } {
  const dx = target.x - bot.x
  const dy = target.y + 1.25 - (bot.y + BOT_EYE)
  const dz = target.z - bot.z
  const dist = Math.hypot(dx, dz)
  const w = WEAPONS[bot.weapon]
  const hitY = target.y + 1.25 + errY * dist
  const zone = zoneForHit(hitY, Math.abs(errX) * dist)
  // roll against the bot's own aim error
  const chance = w.spread + w.spreadGrow * 0.5
  if (rnd() < chance * (1 + dist / 40)) {
    const mult = zone === 'head' ? w.headMult : zone === 'chest' ? 1 : zone === 'stomach' ? 1.25 : 0.75
    let dmg = w.damage * mult
    dmg = applyArmor(dmg, target.armor, w.armorPen)
    target.hp -= dmg
    if (target.hp <= 0) target.alive = false
    return { victim: target, zone }
  }
  return { victim: null, zone: null }
}

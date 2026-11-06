/* ============================================================================
   Game engine — fixed-timestep simulation of the 5v5 round. Owns all entities,
   the player controller, bot AI, weapon fire / damage, the C4 plant-defuse
   cycle and round resolution. The React layer reads a snapshot each frame and
   the renderer draws the meshes; the engine itself never touches three.js.
   ========================================================================== */
import * as THREE from 'three'
import {
  buildMap, resolveCircle, groundHeight, standable, lineOfSight, rayWallDistance,
  SITE_A, SITE_B, regionCenter, HALF, tileToWorld, worldToTile, Cell, cellAt,
} from './map'
import { WEAPONS, computeDamage, recoilFor, defaultLoadout, WeaponId } from './weapons'
import { findPath } from './pathfinding'
import type { Entity, GameState, Team, Bomb, BotBrain, KillEvent } from './types'
import * as A from './audio'

export const TICK = 1 / 60
const WALK = 5.4
const EYE = 1.6
const PLAYER_R = 0.34
const GRAV = 22
const JUMP = 7.4
const BOT_NAMES_T = ['Viper', 'Havoc', 'Raze', 'Onyx', 'Kilo']
const BOT_NAMES_CT = ['Sable', 'Nova', 'Flint', 'Echo', 'Wren']

let nextId = 1

function makeEntity(team: Team, name: string, isPlayer: boolean, x: number, z: number, pistol: boolean): Entity {
  const load = defaultLoadout(team, pistol)
  const mag: Record<string, number> = {}
  const res: Record<string, number> = {}
  const ids: WeaponId[] = ['knife', load.secondary]
  if (load.primary) ids.push(load.primary)
  ids.forEach((id) => {
    mag[id] = WEAPONS[id].magSize
    res[id] = WEAPONS[id].reserve
  })
  return {
    id: nextId++, team, name, isPlayer,
    x, y: 0, z, yaw: team === 'T' ? Math.PI : 0,
    vx: 0, vy: 0, vz: 0, onGround: true,
    health: 100, armour: pistol ? 0 : 100, hasHelmet: !pistol, alive: true,
    primary: load.primary, secondary: load.secondary,
    current: load.primary ?? load.secondary,
    ammoMag: mag, ammoReserve: res,
    reloadUntil: 0, lastShot: 0, shotIndex: 0, scoped: false,
    kills: 0, deaths: 0, hasBomb: false,
    ai: isPlayer ? undefined : newBrain(),
  }
}
function newBrain(): BotBrain {
  return {
    path: [], pathIndex: 0, targetId: -1, repathAt: 0, fireAt: 0,
    state: 'patrol', destRegion: '', strafeDir: 1, strafeUntil: 0,
    lastSeenX: 0, lastSeenZ: 0,
  }
}

export function createState(pistolRound = true): GameState {
  buildMap()
  nextId = 1
  const t = regionCenter('TSpawn'),
    ct = regionCenter('CTSpawn')
  const entities: Entity[] = []
  // player is a CT
  const player = makeEntity('CT', 'You', true, ct.x - 2, ct.z + 2, pistolRound)
  entities.push(player)
  for (let i = 1; i < 5; i++)
    entities.push(makeEntity('CT', BOT_NAMES_CT[i - 1], false, ct.x + (i - 2) * 1.6, ct.z + 3 + (i % 2), pistolRound))
  for (let i = 0; i < 5; i++)
    entities.push(makeEntity('T', BOT_NAMES_T[i], false, t.x + (i - 2) * 1.6, t.z - (i % 2), pistolRound))

  const bomb: Bomb = {
    planted: false, carried: false, x: 0, y: 0, z: 0, site: null,
    plantedAt: 0, fuseSeconds: 40, defuseProgress: 0, defuserId: -1, exploded: false,
  }
  // give the bomb to a random T (or the first T)
  const bombCarrier = entities.find((e) => e.team === 'T')!
  bombCarrier.hasBomb = true
  bomb.carried = true

  return {
    entities, bomb,
    phase: 'live', roundNumber: 1, pistolRound,
    roundStart: 0, phaseEndsAt: 115, winner: null, winReason: '',
    kills: [], scoreCT: 0, scoreT: 0, time: 0,
    playerId: player.id, spectateId: -1, freezeUntil: 2.0,
  }
}

/* ------------------------------ input ------------------------------ */
export interface InputState {
  fwd: number
  strafe: number
  jump: boolean
  crouch: boolean
  yaw: number
  pitch: number
  fire: boolean
  scope: boolean
  reload: boolean
  switchTo: WeaponId | null
  plant: boolean
  defuse: boolean
}

/* ------------------------------ helpers ------------------------------ */
function byId(s: GameState, id: number): Entity | undefined {
  return s.entities.find((e) => e.id === id)
}
function aliveEnemies(s: GameState, e: Entity): Entity[] {
  return s.entities.filter((o) => o.alive && o.team !== e.team)
}
function aliveTeam(s: GameState, team: Team): Entity[] {
  return s.entities.filter((o) => o.alive && o.team === team)
}
function dist2(ax: number, az: number, bx: number, bz: number) {
  const dx = ax - bx, dz = az - bz
  return dx * dx + dz * dz
}

/* ------------------------------ movement integration ------------------------------ */
function moveEntity(e: Entity, wishX: number, wishZ: number, dt: number, speed: number) {
  const desired = Math.hypot(wishX, wishZ)
  if (desired > 0.001) {
    wishX /= desired
    wishZ /= desired
  }
  // accelerate toward the wish direction
  const accel = e.onGround ? 12 : 3
  e.vx += (wishX * speed - e.vx) * Math.min(1, accel * dt)
  e.vz += (wishZ * speed - e.vz) * Math.min(1, accel * dt)
  // gravity + jump handled by caller through e.vy
  e.vy -= GRAV * dt
  // integrate XZ with collision
  let nx = e.x + e.vx * dt
  let nz = e.z + e.vz * dt
  const fixed = resolveCircle(nx, nz, PLAYER_R)
  // if the resolver moved us, kill the offending velocity component
  if (Math.abs(fixed.x - nx) > 1e-4) e.vx *= 0.2
  if (Math.abs(fixed.z - nz) > 1e-4) e.vz *= 0.2
  e.x = fixed.x
  e.z = fixed.z
  // integrate Y (step onto crates, land on floor)
  e.y += e.vy * dt
  const gh = groundHeight(e.x, e.z)
  if (e.y <= gh) {
    e.y = gh
    e.vy = 0
    e.onGround = true
  } else if (e.y > gh + 0.01) {
    e.onGround = false
  }
}

/* ------------------------------ weapon fire ------------------------------ */
function fireWeapon(s: GameState, e: Entity, dt: number, aimX: number, aimY: number, aimZ: number) {
  const def = WEAPONS[e.current]
  if (s.time < e.reloadUntil) return
  const interval = 60 / def.rpm
  if (s.time - e.lastShot < interval) return
  if (def.melee) {
    e.lastShot = s.time
    meleeAttack(s, e, def)
    return
  }
  if ((e.ammoMag[e.current] ?? 0) <= 0) {
    // click / auto reload
    startReload(s, e)
    return
  }
  e.lastShot = s.time
  e.ammoMag[e.current]--
  e.shotIndex++
  A.weaponSound(e.current)

  // recoil kicks the shooter's aim (only matters for the player's camera)
  const rec = recoilFor(def, e.shotIndex)
  if (e.isPlayer) {
    INPUT.pitch += rec.y
    INPUT.yaw += rec.x
    INPUT.pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, INPUT.pitch))
  } else {
    e.yaw += rec.x * 0.5
  }

  // spread: build a direction cone around the aim vector
  const spread = def.scoped && e.scoped ? def.spread * 0.15 : def.spread * (1 + Math.min(1.5, e.shotIndex * 0.06))
  const dir = new THREE.Vector3(aimX, aimY, aimZ).normalize()
  // random perpendicular jitter
  const up = Math.abs(dir.y) > 0.99 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)
  const right = new THREE.Vector3().crossVectors(dir, up).normalize()
  const realUp = new THREE.Vector3().crossVectors(right, dir).normalize()
  const ang = Math.random() * Math.PI * 2
  const rad = Math.random() * spread
  dir.addScaledVector(right, Math.cos(ang) * rad).addScaledVector(realUp, Math.sin(ang) * rad).normalize()

  hitscan(s, e, dir, def.damage, def.range, def.id)
}

function meleeAttack(s: GameState, e: Entity, def: typeof WEAPONS.knife) {
  A.weaponSound('knife')
  const dir = facing(e)
  const hx = e.x + dir.x * 1.4, hz = e.z + dir.z * 1.4
  for (const o of s.entities) {
    if (!o.alive || o.team === e.team) continue
    if (dist2(hx, hz, o.x, o.z) < 1.2) {
      applyDamage(s, e, o, def.damage, 'chest', 1.4)
      break
    }
  }
}

function facing(e: Entity): { x: number; z: number } {
  return { x: -Math.sin(e.yaw), z: -Math.cos(e.yaw) }
}

// Hitscan: march the bullet, find the nearest enemy hitbox or the wall.
function hitscan(s: GameState, shooter: Entity, dir: THREE.Vector3, baseDmg: number, range: number, wid: WeaponId) {
  const ox = shooter.x, oy = shooter.y + EYE, oz = shooter.z
  const maxDist = range
  // wall distance caps the shot
  const wallDist = rayWallDistance(ox, oz, dir.x, dir.z, maxDist)
  let bestT = wallDist
  let bestTarget: Entity | null = null
  let bestZone: 'head' | 'chest' | 'stomach' | 'arm' | 'leg' = 'chest'

  for (const o of s.entities) {
    if (!o.alive || o.team === shooter.team) continue
    // capsule approx: solve ray vs vertical segment at (o.x, o.z), y in [o.y, o.y+1.8]
    const t = rayVsCapsule(ox, oy, oz, dir, o.x, o.y, o.z, 0.36, 1.8)
    if (t !== null && t < bestT) {
      bestT = t
      bestTarget = o
      // determine zone by hit height
      const hy = oy + dir.y * t - o.y
      bestZone = hy > 1.5 ? 'head' : hy > 1.1 ? 'chest' : hy > 0.75 ? 'stomach' : hy > 0.4 ? 'arm' : 'leg'
    }
  }

  // spawn a tracer + impact (renderer reads these from the event queue)
  pushFx({ type: 'tracer', x0: ox, y0: oy, z0: oz, x1: ox + dir.x * bestT, y1: oy + dir.y * bestT, z1: oz + dir.z * bestT })
  if (bestTarget) {
    const armour = bestTarget.armour
    const dmg = computeDamage(WEAPONS[wid], bestZone, armour, bestT)
    applyDamage(s, shooter, bestTarget, dmg, bestZone, bestT)
    pushFx({ type: 'impact', x: bestTarget.x, y: bestTarget.y + 1.2, z: bestTarget.z, blood: true })
    if (shooter.isPlayer) {
      if (bestZone === 'head') A.playHeadshot()
      else A.playHitmarker()
    }
  } else if (bestT < maxDist) {
    pushFx({ type: 'impact', x: ox + dir.x * bestT, y: oy + dir.y * bestT, z: oz + dir.z * bestT, blood: false })
  }
}

function rayVsCapsule(
  ox: number, oy: number, oz: number, dir: THREE.Vector3,
  cx: number, cy: number, cz: number, radius: number, height: number
): number | null {
  // treat as a vertical cylinder: solve in XZ for the radius, then check Y span
  const dx = ox - cx, dz = oz - cz
  const a = dir.x * dir.x + dir.z * dir.z
  if (a < 1e-8) return null
  const b = 2 * (dx * dir.x + dz * dir.z)
  const c = dx * dx + dz * dz - radius * radius
  const disc = b * b - 4 * a * c
  if (disc < 0) return null
  const sq = Math.sqrt(disc)
  let t = (-b - sq) / (2 * a)
  if (t < 0) t = (-b + sq) / (2 * a)
  if (t < 0) return null
  const hy = oy + dir.y * t - cy
  if (hy < -0.1 || hy > height + 0.1) return null
  return t
}

function applyDamage(s: GameState, shooter: Entity, victim: Entity, dmg: number, zone: string, dist: number) {
  if (!victim.alive) return
  // armour absorbs
  if (victim.armour > 0 && zone !== 'leg') {
    const absorbed = Math.min(victim.armour, dmg * 0.5)
    victim.armour -= absorbed
  }
  victim.health -= dmg
  if (victim.isPlayer) A.playHurt()
  if (victim.health <= 0) {
    victim.health = 0
    killEntity(s, shooter, victim, zone === 'head')
  }
}

function killEntity(s: GameState, killer: Entity, victim: Entity, headshot: boolean) {
  victim.alive = false
  victim.deaths++
  killer.kills++
  s.kills.push({ killerId: killer.id, victimId: victim.id, weapon: killer.current, headshot, at: s.time })
  if (killer.current === 'knife') killer.kills++ // knife kill bonus flavour
  A.playKill()
  // drop the bomb if the carrier died
  if (victim.hasBomb && !s.bomb.planted) {
    victim.hasBomb = false
    s.bomb.carried = false
    s.bomb.x = victim.x
    s.bomb.y = victim.y
    s.bomb.z = victim.z
    // another T can pick it up
  }
  // if the player died, switch to a living teammate
  if (victim.isPlayer) {
    const mate = aliveTeam(s, 'CT').find((e) => e.id !== victim.id)
    s.spectateId = mate ? mate.id : -1
  }
  checkRoundEnd(s)
}

/* ------------------------------ reload / switch ------------------------------ */
function startReload(s: GameState, e: Entity) {
  const def = WEAPONS[e.current]
  if (def.melee) return
  if ((e.ammoMag[e.current] ?? 0) >= def.magSize) return
  if ((e.ammoReserve[e.current] ?? 0) <= 0) return
  e.reloadUntil = s.time + def.reloadTime
  e.shotIndex = 0
  if (e.isPlayer) A.playReload()
}
function finishReload(s: GameState, e: Entity) {
  const def = WEAPONS[e.current]
  const need = def.magSize - (e.ammoMag[e.current] ?? 0)
  const take = Math.min(need, e.ammoReserve[e.current] ?? 0)
  e.ammoMag[e.current] = (e.ammoMag[e.current] ?? 0) + take
  e.ammoReserve[e.current] = (e.ammoReserve[e.current] ?? 0) - take
}
function switchWeapon(e: Entity, id: WeaponId) {
  if (e.current === id) return
  const has = id === 'knife' || (id === e.primary) || (id === e.secondary)
  if (!has) return
  e.current = id
  e.shotIndex = 0
  e.scoped = false
}

/* ------------------------------ bomb logic ------------------------------ */
function atSite(x: number, z: number): 'A' | 'B' | null {
  if (Math.hypot(x - SITE_A.x, z - SITE_A.z) <= SITE_A.r) return 'A'
  if (Math.hypot(x - SITE_B.x, z - SITE_B.z) <= SITE_B.r) return 'B'
  return null
}
function plant(s: GameState, e: Entity) {
  const site = atSite(e.x, e.z)
  if (!site || !e.hasBomb) return
  e.hasBomb = false
  s.bomb.planted = true
  s.bomb.carried = false
  s.bomb.site = site
  s.bomb.x = e.x
  s.bomb.y = e.y
  s.bomb.z = e.z
  s.bomb.plantedAt = s.time
  s.bomb.defuseProgress = 0
  s.phaseEndsAt = s.time + s.bomb.fuseSeconds
  A.playPlant()
}
function tryDefuse(s: GameState, e: Entity, dt: number) {
  if (!s.bomb.planted) return
  const near = Math.hypot(e.x - s.bomb.x, e.z - s.bomb.z) < 1.6
  if (!near) { s.bomb.defuseProgress = 0; s.bomb.defuserId = -1; return }
  s.bomb.defuserId = e.id
  s.bomb.defuseProgress += dt / 5 // 5 second defuse
  if (e.isPlayer) A.playDefuse()
  if (s.bomb.defuseProgress >= 1) {
    s.bomb.defuseProgress = 1
    endRound(s, 'CT', 'Bomb defused')
  }
}
function explode(s: GameState) {
  s.bomb.exploded = true
  A.playExplosion()
  endRound(s, 'T', 'Bomb detonated')
}

/* ------------------------------ round resolution ------------------------------ */
function checkRoundEnd(s: GameState) {
  if (s.phase !== 'live') return
  const ct = aliveTeam(s, 'CT').length
  const t = aliveTeam(s, 'T').length
  if (s.bomb.planted) {
    // with the bomb down, CT lose only by being wiped (defuse impossible)
    if (ct === 0) endRound(s, 'T', 'All CTs eliminated')
    return
  }
  if (t === 0) endRound(s, 'CT', 'All Ts eliminated')
  else if (ct === 0) endRound(s, 'T', 'All CTs eliminated')
}
function endRound(s: GameState, winner: Team, reason: string) {
  if (s.phase === 'over') return
  s.phase = 'over'
  s.winner = winner
  s.winReason = reason
  s.phaseEndsAt = s.time + 5
  if (winner === 'CT') s.scoreCT++
  else s.scoreT++
  A.playRoundWin(winner === 'CT')
}

/* ------------------------------ bot AI ------------------------------ */
function updateBot(s: GameState, e: Entity, dt: number) {
  const brain = e.ai!
  const enemies = aliveEnemies(s, e)

  // --- perception: pick the closest visible enemy ---
  let best: Entity | null = null
  let bestD = Infinity
  for (const o of enemies) {
    const d2 = dist2(e.x, e.z, o.x, o.z)
    if (d2 < bestD && lineOfSight(e.x, e.z, o.x, o.z)) {
      best = o
      bestD = d2
    }
  }

  if (best) {
    brain.targetId = best.id
    brain.lastSeenX = best.x
    brain.lastSeenZ = best.z
    brain.state = 'engage'
    // face the target
    const dx = best.x - e.x, dz = best.z - e.z
    e.yaw = Math.atan2(-dx, -dz)
    // strafe a little to be a harder target
    if (s.time > brain.strafeUntil) {
      brain.strafeDir = Math.random() < 0.5 ? -1 : 1
      brain.strafeUntil = s.time + 0.4 + Math.random() * 0.5
    }
    // fire with a reaction delay and imperfect accuracy
    const dist = Math.sqrt(bestD)
    if (s.time > brain.fireAt && dist < WEAPONS[e.current].range) {
      const def = WEAPONS[e.current]
      if ((e.ammoMag[e.current] ?? 0) <= 0) startReload(s, e)
      else if (s.time - e.lastShot >= 60 / def.rpm) {
        e.lastShot = s.time
        e.ammoMag[e.current]--
        e.shotIndex++
        A.weaponSound(e.current)
        // aim at the target's chest with some error
        const oy = e.y + EYE
        const ty = best.y + 1.1
        const dir = new THREE.Vector3(best.x - e.x, ty - oy, best.z - e.z).normalize()
        // bot inaccuracy grows with distance and recent shots
        const err = 0.02 + dist * 0.0016 + Math.min(0.05, e.shotIndex * 0.004)
        dir.x += (Math.random() - 0.5) * err
        dir.y += (Math.random() - 0.5) * err
        dir.z += (Math.random() - 0.5) * err
        dir.normalize()
        hitscan(s, e, dir, def.damage, def.range, def.id)
      }
      brain.fireAt = s.time + 0.12 + Math.random() * 0.1
    }
    // keep a comfortable distance
    const ideal = e.current === 'awp' ? 22 : 8
    let mvx = 0, mvz = 0
    if (dist > ideal) { mvx = dx / dist; mvz = dz / dist }
    else if (dist < ideal * 0.6) { mvx = -dx / dist; mvz = -dz / dist }
    // strafe perpendicular
    mvx += (-dz / dist) * brain.strafeDir * 0.7
    mvz += (dx / dist) * brain.strafeDir * 0.7
    moveEntity(e, mvx, mvz, dt, WALK * 0.8)
    return
  }

  // --- no visible enemy: objective behaviour ---
  brain.targetId = -1
  // reload if low
  if ((e.ammoMag[e.current] ?? 0) <= WEAPONS[e.current].magSize * 0.3 && s.time > e.reloadUntil) startReload(s, e)

  if (e.team === 'T') {
    // carry the bomb to a site, or guard it once planted
    if (s.bomb.planted) {
      brain.state = 'plant' // defend the planted bomb
      const d = Math.hypot(e.x - s.bomb.x, e.z - s.bomb.z)
      if (d > 6) followTo(s, e, brain, s.bomb.x, s.bomb.z, dt)
      else wanderHold(s, e, brain, dt, s.bomb.x, s.bomb.z)
    } else if (e.hasBomb) {
      brain.state = 'plant'
      const site = pickSite(e)
      const c = site === 'A' ? SITE_A : SITE_B
      const d = Math.hypot(e.x - c.x, e.z - c.z)
      if (d < c.r - 1) { plant(s, e) }
      else followTo(s, e, brain, c.x, c.z, dt)
    } else {
      // pick up a dropped bomb, else push a site
      if (!s.bomb.carried && s.bomb.x !== 0) {
        const d = Math.hypot(e.x - s.bomb.x, e.z - s.bomb.z)
        if (d < 1.2) { e.hasBomb = true; s.bomb.carried = true }
        else { followTo(s, e, brain, s.bomb.x, s.bomb.z, dt); return }
      }
      brain.state = 'patrol'
      pushObjective(s, e, brain, dt)
    }
  } else {
    // CT: if the bomb is planted, go defuse; else hold/push
    if (s.bomb.planted) {
      brain.state = 'defuse'
      const d = Math.hypot(e.x - s.bomb.x, e.z - s.bomb.z)
      if (d < 1.5) tryDefuse(s, e, dt)
      else followTo(s, e, brain, s.bomb.x, s.bomb.z, dt)
    } else {
      brain.state = 'patrol'
      pushObjective(s, e, brain, dt)
    }
  }
}

function pickSite(e: Entity): 'A' | 'B' {
  // choose the nearer site, with a little randomness so bots split
  const da = Math.hypot(e.x - SITE_A.x, e.z - SITE_A.z)
  const db = Math.hypot(e.x - SITE_B.x, e.z - SITE_B.z)
  if (Math.random() < 0.15) return da < db ? 'B' : 'A'
  return da < db ? 'A' : 'B'
}

function pushObjective(s: GameState, e: Entity, brain: BotBrain, dt: number) {
  // pick a destination region if we don't have one or arrived
  if (!brain.destRegion || !brain.wp || brain.pathIndex >= brain.wp.length) {
    if (s.time > brain.repathAt || !brain.destRegion) {
      const regions = e.team === 'T' ? ['ASite', 'BSite', 'Mid', 'LongA'] : ['ASite', 'BSite', 'Mid', 'Catwalk']
      brain.destRegion = regions[(Math.random() * regions.length) | 0]
      const c = regionCenter(brain.destRegion)
      brain.wp = findPath(e.x, e.z, c.x, c.z)
      brain.pathIndex = 0
      brain.repathAt = s.time + 6 + Math.random() * 4
    }
  }
  followWaypoints(s, e, brain, dt)
}
function followTo(s: GameState, e: Entity, brain: BotBrain, tx: number, tz: number, dt: number) {
  if (brain.destRegion !== 'to:' + tx.toFixed(1) + tz.toFixed(1) || brain.pathIndex >= (brain.wp?.length ?? 0)) {
    const path = findPath(e.x, e.z, tx, tz)
    brain.wp = path
    brain.pathIndex = 0
    brain.destRegion = 'to:' + tx.toFixed(1) + tz.toFixed(1)
  }
  followWaypoints(s, e, brain, dt)
}
function wanderHold(s: GameState, e: Entity, brain: BotBrain, dt: number, ax: number, az: number) {
  // small orbit around a point (guarding the bomb)
  const ang = s.time * 0.5 + e.id
  const tx = ax + Math.cos(ang) * 4, tz = az + Math.sin(ang) * 4
  const dx = tx - e.x, dz = tz - e.z
  const d = Math.hypot(dx, dz) || 1
  moveEntity(e, dx / d, dz / d, dt, WALK * 0.5)
}
function followWaypoints(s: GameState, e: Entity, brain: BotBrain, dt: number) {
  const wp = brain.wp
  if (!wp || brain.pathIndex >= wp.length) {
    // arrived or no path: idle strafe
    moveEntity(e, 0, 0, dt, WALK)
    return
  }
  const target = wp[brain.pathIndex]
  const dx = target.x - e.x, dz = target.z - e.z
  const d = Math.hypot(dx, dz)
  if (d < 0.7) { brain.pathIndex++; return }
  // face movement direction when not engaged
  if (brain.state !== 'engage') e.yaw = Math.atan2(-dx, -dz)
  moveEntity(e, dx / d, dz / d, dt, WALK)
}

/* ------------------------------ fx queue (read by the renderer) ------------------------------ */
export type Fx =
  | { type: 'tracer'; x0: number; y0: number; z0: number; x1: number; y1: number; z1: number }
  | { type: 'impact'; x: number; y: number; z: number; blood: boolean }
const fxQueue: Fx[] = []
function pushFx(f: Fx) { fxQueue.push(f) }
export function drainFx(): Fx[] { const out = fxQueue.slice(); fxQueue.length = 0; return out }

/* ------------------------------ the shared input record ------------------------------ */
export const INPUT: InputState = {
  fwd: 0, strafe: 0, jump: false, crouch: false,
  yaw: 0, pitch: 0, fire: false, scope: false, reload: false,
  switchTo: null, plant: false, defuse: false,
}

/* ------------------------------ step ------------------------------ */
export function step(s: GameState, dt: number) {
  s.time += dt
  // freeze time at round start
  const frozen = s.time < s.freezeUntil

  if (s.phase === 'over') {
    if (s.time > s.phaseEndsAt) {
      // start the next round (keep score, reset positions/health)
      nextRound(s)
    }
    return
  }

  // bomb fuse
  if (s.bomb.planted && !s.bomb.exploded) {
    if (s.time - s.bomb.plantedAt >= s.bomb.fuseSeconds) explode(s)
    const remain = s.bomb.fuseSeconds - (s.time - s.bomb.plantedAt)
    if (Math.floor(remain * 2) !== Math.floor((remain + dt) * 2)) A.playBeep(remain < 10)
  }
  // round timer
  if (!s.bomb.planted && s.time > s.phaseEndsAt) {
    endRound(s, 'CT', 'Time expired')
  }

  for (const e of s.entities) {
    if (!e.alive) continue
    // finish reloads
    if (e.reloadUntil && s.time >= e.reloadUntil) { finishReload(s, e); e.reloadUntil = 0 }
    if (frozen && !e.isPlayer) { e.vx = 0; e.vz = 0; continue }
    if (e.isPlayer) updatePlayerEntity(s, e, dt, frozen)
    else updateBot(s, e, dt)
  }
}

function updatePlayerEntity(s: GameState, e: Entity, dt: number, frozen: boolean) {
  e.yaw = INPUT.yaw
  // weapon switching
  if (INPUT.switchTo) { switchWeapon(e, INPUT.switchTo); INPUT.switchTo = null }
  if (INPUT.reload) { startReload(s, e); INPUT.reload = false }
  // scope (AWP right click)
  const def = WEAPONS[e.current]
  if (def.scoped) {
    if (INPUT.scope && !e.scoped) { e.scoped = true; A.playScopeIn() }
    else if (!INPUT.scope && e.scoped) { e.scoped = false; A.playScopeOut() }
  } else e.scoped = false

  if (frozen) { e.vx = 0; e.vz = 0; return }

  // movement from input, relative to yaw
  const cy = Math.cos(e.yaw), sy = Math.sin(e.yaw)
  let wishX = 0, wishZ = 0
  if (INPUT.fwd) { wishX += -sy * INPUT.fwd; wishZ += -cy * INPUT.fwd }
  if (INPUT.strafe) { wishX += cy * INPUT.strafe; wishZ += -sy * INPUT.strafe }
  const speed = WALK * def.moveSpeed * (INPUT.crouch ? 0.5 : 1) * (e.scoped ? 0.4 : 1)
  if (INPUT.jump && e.onGround) { e.vy = JUMP; e.onGround = false }
  moveEntity(e, wishX, wishZ, dt, speed)

  // footsteps
  if (e.onGround && (Math.abs(e.vx) + Math.abs(e.vz)) > 1.2) {
    if (!e._step || s.time - e._step > 0.42) { A.playFootstep(); e._step = s.time }
  }

  // firing
  const dir = aimDir(e)
  if (INPUT.fire) {
    if (def.auto || !e._triggerHeld) fireWeapon(s, e, dt, dir.x, dir.y, dir.z)
    e._triggerHeld = true
  } else {
    e._triggerHeld = false
    e.shotIndex = 0
  }

  // bomb actions
  if (INPUT.plant) { if (e.hasBomb) plant(s, e); INPUT.plant = false }
  if (INPUT.defuse) { tryDefuse(s, e, dt) } else if (s.bomb.defuserId === e.id) { /* holding */ }
  // auto-defuse while standing on it and holding the key is handled above;
  // also pick up a dropped bomb by walking over it
  if (!s.bomb.carried && !s.bomb.planted && s.bomb.x !== 0) {
    if (Math.hypot(e.x - s.bomb.x, e.z - s.bomb.z) < 1.2 && e.team === 'T') {
      e.hasBomb = true; s.bomb.carried = true
    }
  }
}

function aimDir(e: Entity): { x: number; y: number; z: number } {
  const cp = Math.cos(INPUT.pitch), sp = Math.sin(INPUT.pitch)
  const cy = Math.cos(e.yaw), sy = Math.sin(e.yaw)
  return { x: -sy * cp, y: sp, z: -cy * cp }
}

function nextRound(s: GameState) {
  s.roundNumber++
  s.pistolRound = s.roundNumber === 1
  const t = regionCenter('TSpawn'), ct = regionCenter('CTSpawn')
  s.entities.forEach((e, i) => {
    e.alive = true
    e.health = 100
    e.armour = s.pistolRound ? 0 : 100
    e.hasHelmet = !s.pistolRound
    e.scoped = false
    e.shotIndex = 0
    e.reloadUntil = 0
    const base = e.team === 'T' ? t : ct
    e.x = base.x + ((i % 5) - 2) * 1.6
    e.z = base.z + (e.team === 'T' ? -(i % 2) : 2 + (i % 2))
    e.y = groundHeight(e.x, e.z)
    e.vx = e.vy = e.vz = 0
    e.yaw = e.team === 'T' ? Math.PI : 0
    // reset loadout
    const load = defaultLoadout(e.team, s.pistolRound)
    e.primary = load.primary
    e.secondary = load.secondary
    e.current = load.primary ?? load.secondary
    e.hasBomb = false
    const ids: WeaponId[] = ['knife', load.secondary]
    if (load.primary) ids.push(load.primary)
    ids.forEach((id) => { e.ammoMag[id] = WEAPONS[id].magSize; e.ammoReserve[id] = WEAPONS[id].reserve })
    if (e.ai) e.ai = newBrain()
  })
  // reassign bomb to a T
  const carrier = s.entities.find((e) => e.team === 'T')!
  carrier.hasBomb = true
  s.bomb = {
    planted: false, carried: true, x: 0, y: 0, z: 0, site: null,
    plantedAt: 0, fuseSeconds: 40, defuseProgress: 0, defuserId: -1, exploded: false,
  }
  s.phase = 'live'
  s.winner = null
  s.winReason = ''
  s.phaseEndsAt = s.time + 115
  s.freezeUntil = s.time + 2
  s.spectateId = -1
  const player = byId(s, s.playerId)!
  player.alive = true
}

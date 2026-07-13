import * as THREE from 'three'
import type { GameMap } from './map'
import type { Nav } from './nav'
import type { PhysicsWorld } from './physics'
import type { Soldier } from './soldier'
import { EYE_HEIGHT } from './types'

export type Duty = 'none' | 'plant' | 'defuse' | 'pickup'

export interface Mission {
  anchors: THREE.Vector3[]
  final: THREE.Vector3
  look: THREE.Vector3 | null
  duty: Duty
}

export interface AIWorld {
  map: GameMap
  nav: Nav
  physics: PhysicsWorld
  soldiers: Soldier[]
  time: number
  bombPlantedPos: THREE.Vector3 | null
  bombDroppedPos: THREE.Vector3 | null
}

const TWO_PI = Math.PI * 2

function angleLerp(a: number, target: number, maxStep: number): number {
  let d = (target - a) % TWO_PI
  if (d > Math.PI) d -= TWO_PI
  if (d < -Math.PI) d += TWO_PI
  return a + THREE.MathUtils.clamp(d, -maxStep, maxStep)
}

function angleDiff(a: number, b: number): number {
  let d = (b - a) % TWO_PI
  if (d > Math.PI) d -= TWO_PI
  if (d < -Math.PI) d += TWO_PI
  return d
}

/**
 * Per-soldier AI: waypoint navigation over the grid, FOV+LOS target acquisition
 * with reaction delay, burst-fire combat, plant/defuse/pickup duties.
 */
export class AIBrain {
  s: Soldier
  private skill: { err: number; react: number; aggro: number; headRate: number }

  mission: Mission | null = null
  private missionIdx = 0
  private arrived = false

  private path: THREE.Vector3[] | null = null
  private pathIdx = 0
  private pathGoal = new THREE.Vector3()
  private repathAt = 0

  target: Soldier | null = null
  private targetSince = 0
  private reactUntil = 0
  private lastSeenPos = new THREE.Vector3()
  private lastSeenAt = -99
  private alertUntil = 0
  private alertPos: THREE.Vector3 | null = null

  private nextThink = 0
  private burstUntil = 0
  private burstPauseUntil = 0
  private strafeDir = 0
  private strafeUntil = 0
  private scopeStart = 0
  private stuckPos = new THREE.Vector3()
  private stuckAt = 0
  private wanderAt = 0
  private lookYawTarget: number | null = null

  constructor(s: Soldier) {
    this.s = s
    this.skill = {
      err: 1.1 + Math.random() * 0.9,
      react: 0.35 + Math.random() * 0.4,
      aggro: Math.random(),
      headRate: 0.04 + Math.random() * 0.1,
    }
  }

  reset() {
    this.mission = null
    this.path = null
    this.target = null
    this.arrived = false
    this.lastSeenAt = -99
    this.alertPos = null
    this.lookYawTarget = null
  }

  setMission(anchors: THREE.Vector3[], final: THREE.Vector3, look: THREE.Vector3 | null, duty: Duty) {
    this.mission = { anchors: [...anchors], final, look, duty }
    this.missionIdx = 0
    this.arrived = false
    this.path = null
    this.lookYawTarget = null
  }

  heard(pos: THREE.Vector3, time: number) {
    if (this.target) return
    this.alertUntil = time + 3
    this.alertPos = pos.clone()
  }

  update(dt: number, w: AIWorld) {
    const s = this.s
    const c = s.control
    c.moveX = 0; c.moveZ = 0
    c.fire = false; c.fireTap = false; c.altTap = false
    c.jump = false; c.use = false; c.reload = false; c.slot = null

    if (!s.alive) return

    if (w.time >= this.nextThink) {
      this.nextThink = w.time + 0.12 + Math.random() * 0.06
      this.think(w)
    }

    if (this.target && w.time >= this.reactUntil) {
      this.combat(dt, w)
    } else if (this.target) {
      this.facePoint(this.target.pos, dt) // reacting: turn but hold fire
    } else if (this.lastSeenAt > w.time - 2.5 && this.skill.aggro > 0.35) {
      this.chase(dt, w)
    } else {
      this.missionMove(dt, w)
    }

    this.dutyBehavior(w)
  }

  // -------------------------------------------------------------------------

  private think(w: AIWorld) {
    const s = this.s

    // perception
    let best: Soldier | null = null
    let bestDist = Infinity
    const eye = s.eyePos
    for (const e of w.soldiers) {
      if (!e.alive || e.team === s.team) continue
      const dist = e.pos.distanceTo(s.pos)
      if (dist > 70 || dist >= bestDist) continue
      const dirYaw = Math.atan2(-(e.pos.x - s.pos.x), -(e.pos.z - s.pos.z))
      const inFov = Math.abs(angleDiff(s.yaw, dirYaw)) < (w.time < this.alertUntil ? Math.PI : 0.95)
      if (!inFov && dist > 3) continue
      const targetEye = new THREE.Vector3(e.pos.x, e.pos.y + EYE_HEIGHT * 0.8, e.pos.z)
      if (!w.physics.hasLOS(eye, targetEye)) continue
      best = e
      bestDist = dist
    }

    if (best) {
      if (this.target !== best) {
        if (!this.target) this.reactUntil = w.time + this.skill.react
        this.target = best
        this.targetSince = w.time
      }
      this.lastSeenPos.copy(best.pos)
      this.lastSeenAt = w.time
      best.lastSeenBy[this.s.team] = w.time
    } else if (this.target) {
      if (w.time - this.lastSeenAt > 0.5) this.target = null
    }

    // reload when safe or empty
    const wpn = s.weapon
    if (!wpn.isKnife) {
      if (wpn.mag === 0 && (wpn.reserve > 0)) s.control.reload = true
      else if (!this.target && wpn.mag < wpn.def.magSize * 0.35 && wpn.reserve > 0) s.control.reload = true
      // completely dry: go knife
      if (wpn.mag === 0 && wpn.reserve === 0) {
        if (s.slot === 'primary' && s.weapons.secondary && (s.weapons.secondary.mag > 0 || s.weapons.secondary.reserve > 0)) s.control.slot = 'secondary'
        else s.control.slot = 'knife'
      }
    }

    // stuck detection while pathing
    if (this.path && !this.arrived) {
      if (w.time - this.stuckAt > 1.3) {
        if (s.pos.distanceTo(this.stuckPos) < 0.35) {
          this.path = null // force repath
          this.repathAt = 0
        }
        this.stuckPos.copy(s.pos)
        this.stuckAt = w.time
      }
    } else {
      this.stuckPos.copy(s.pos)
      this.stuckAt = w.time
    }
  }

  private combat(dt: number, w: AIWorld) {
    const s = this.s
    const t = this.target!
    const c = s.control
    const dist = t.pos.distanceTo(s.pos)
    const wpn = s.weapon

    // knife rush when using knife
    if (wpn.isKnife) {
      this.moveToward(t.pos, dt, w, true)
      this.facePoint(t.pos, dt)
      if (dist < 2.0) c.fire = true
      return
    }

    // aim: chest, occasionally head
    const settle = w.time - this.targetSince
    const aimY = Math.random() < this.skill.headRate && settle > 0.8 ? 1.62 : 1.15
    const aimPoint = new THREE.Vector3(t.pos.x, t.pos.y + aimY, t.pos.z)
    const errScale = this.skill.err * (0.45 + 0.55 * Math.exp(-settle * 1.1)) * (0.7 + dist / 55)
    const wobble = Math.sin(w.time * 7 + s.id * 3.1) * 0.02 * errScale
    aimPoint.x += wobble * dist * 0.5
    aimPoint.y += Math.cos(w.time * 6 + s.id) * 0.016 * errScale * dist * 0.5

    const desiredYaw = Math.atan2(-(aimPoint.x - s.pos.x), -(aimPoint.z - s.pos.z))
    const flatDist = Math.hypot(aimPoint.x - s.pos.x, aimPoint.z - s.pos.z)
    const desiredPitch = Math.atan2(aimPoint.y - s.eyePos.y, flatDist)
    const turnRate = 6.5 * dt
    s.yaw = angleLerp(s.yaw, desiredYaw, turnRate)
    s.pitch = THREE.MathUtils.clamp(angleLerp(s.pitch, desiredPitch, turnRate), -1.5, 1.5)

    const aligned = Math.abs(angleDiff(s.yaw, desiredYaw)) < 0.055 && Math.abs(s.pitch - desiredPitch) < 0.05

    const isAwp = wpn.def.id === 'awp'
    if (isAwp) {
      if (!s.scoped && aligned) {
        c.altTap = true // scope in
        this.scopeStart = w.time
      }
      if (s.scoped && aligned && w.time - this.scopeStart > 0.75) c.fireTap = true
      return // AWP AI stands still
    }

    // burst fire
    if (aligned && wpn.mag > 0 && !wpn.reloading) {
      if (w.time > this.burstPauseUntil) {
        if (this.burstUntil < w.time) {
          this.burstUntil = w.time + (wpn.def.auto ? 0.12 + Math.random() * 0.25 : 0.05)
          this.burstPauseUntil = this.burstUntil + 0.25 + Math.random() * 0.5
        }
      }
      if (w.time < this.burstUntil) {
        c.fire = true
        c.fireTap = true
      }
    }

    // strafe jiggle for rifles at medium range
    if (dist > 6 && dist < 40 && w.time > this.strafeUntil) {
      this.strafeDir = Math.random() < 0.4 ? 0 : (Math.random() < 0.5 ? -1 : 1)
      this.strafeUntil = w.time + 0.5 + Math.random() * 0.6
    }
    c.moveX = this.strafeDir * 0.6
    if (dist > 45) c.moveZ = 0.7 // push closer at long range
  }

  private chase(dt: number, w: AIWorld) {
    this.moveToward(this.lastSeenPos, dt, w, false)
    this.facePoint(this.lastSeenPos, dt)
    if (this.s.pos.distanceTo(this.lastSeenPos) < 2.5) this.lastSeenAt = -99
  }

  private missionMove(dt: number, w: AIWorld) {
    const s = this.s

    // face heard noises while holding
    if (this.arrived) {
      if (this.alertPos && w.time < this.alertUntil) {
        this.facePoint(this.alertPos, dt)
      } else if (this.mission?.look) {
        this.facePoint(this.mission.look, dt)
      } else if (this.lookYawTarget !== null) {
        s.yaw = angleLerp(s.yaw, this.lookYawTarget, 3 * dt)
      }
      // occasional gaze wander + micro reposition
      if (w.time > this.wanderAt) {
        this.wanderAt = w.time + 3 + Math.random() * 4
        this.lookYawTarget = s.yaw + (Math.random() - 0.5) * 1.6
        if (this.mission?.look && Math.random() < 0.6) this.lookYawTarget = null
      }
      s.pitch = angleLerp(s.pitch, 0, 2 * dt)
      return
    }

    if (!this.mission) return
    const waypoint = this.missionIdx < this.mission.anchors.length
      ? this.mission.anchors[this.missionIdx]
      : this.mission.final

    if (this.moveToward(waypoint, dt, w, false)) {
      if (this.missionIdx < this.mission.anchors.length) {
        this.missionIdx++
        this.path = null
      } else {
        this.arrived = true
        this.path = null
      }
    }
  }

  /** Steers along an A* path toward `goal`. Returns true when within reach. */
  private moveToward(goal: THREE.Vector3, dt: number, w: AIWorld, sprint: boolean): boolean {
    const s = this.s
    const dGoal = Math.hypot(goal.x - s.pos.x, goal.z - s.pos.z)
    if (dGoal < 1.0) return true

    if (!this.path || this.pathGoal.distanceTo(goal) > 2 || w.time > this.repathAt) {
      this.path = w.nav.findPath(s.pos, goal)
      this.pathIdx = 0
      this.pathGoal.copy(goal)
      this.repathAt = w.time + 3 + Math.random()
      if (!this.path || this.path.length === 0) return true
    }

    let wp = this.path[this.pathIdx]
    while (wp && Math.hypot(wp.x - s.pos.x, wp.z - s.pos.z) < 0.7) {
      this.pathIdx++
      if (this.pathIdx >= this.path.length) return true
      wp = this.path[this.pathIdx]
    }
    if (!wp) return true

    const dir = new THREE.Vector3(wp.x - s.pos.x, 0, wp.z - s.pos.z).normalize()
    // convert world dir to local move axes
    const fwd = new THREE.Vector3(-Math.sin(s.yaw), 0, -Math.cos(s.yaw))
    const right = s.rightDir()
    s.control.moveZ = dir.dot(fwd)
    s.control.moveX = dir.dot(right)

    if (!this.target) {
      const wantYaw = Math.atan2(-dir.x, -dir.z)
      s.yaw = angleLerp(s.yaw, wantYaw, (sprint ? 10 : 6) * dt)
      s.pitch = angleLerp(s.pitch, 0, 3 * dt)
    }
    return false
  }

  private facePoint(p: THREE.Vector3, dt: number) {
    const s = this.s
    const wantYaw = Math.atan2(-(p.x - s.pos.x), -(p.z - s.pos.z))
    s.yaw = angleLerp(s.yaw, wantYaw, 8 * dt)
  }

  private dutyBehavior(w: AIWorld) {
    const s = this.s
    if (!this.mission) return
    const c = s.control

    switch (this.mission.duty) {
      case 'plant': {
        if (!s.hasBomb) break
        if (this.target) break // fight first
        if (w.map.plantSiteAt(s.pos.x, s.pos.z) && this.arrived && s.onGround) {
          c.use = true
          c.moveX = 0; c.moveZ = 0
        }
        break
      }
      case 'defuse': {
        if (!w.bombPlantedPos) break
        const d = Math.hypot(w.bombPlantedPos.x - s.pos.x, w.bombPlantedPos.z - s.pos.z)
        if (d < 1.3 && (!this.target || w.time - this.targetSince < 0.1)) {
          c.use = true
          c.moveX = 0; c.moveZ = 0
        }
        break
      }
      case 'pickup':
        break // walking over the bomb picks it up (engine)
      case 'none':
        break
    }
  }
}

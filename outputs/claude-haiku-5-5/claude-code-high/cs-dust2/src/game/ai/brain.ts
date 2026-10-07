import { BRAIN_HZ, PICKUP_RADIUS, TURN_RATE } from '../config.ts'
import type { Character } from '../entities/character.ts'
import { canSee } from '../combat/combat.ts'
import type { Aabb } from '../physics/physics.ts'
import type { NavGrid } from '../nav/navGrid.ts'
import { namedPoint } from '../map/layout.ts'
import { angleDiff, approach, approachAngle, distXZ, yawTowards, type Vec2 } from '../core/mathUtil.ts'
import { emptyIntent, type BombView, type Intent, type SiteId, type Team } from '../types.ts'

export interface NoiseEvent {
  x: number
  z: number
  t: number
  team: Team
}

/** AI 能读取的世界视图（由 GameWorld 实现，避免 AI 直接依赖世界内部结构） */
export interface BotWorldView {
  readonly time: number
  readonly freeze: boolean
  readonly humanId: number
  readonly colliders: Aabb[]
  readonly characters: Character[]
  readonly nav: NavGrid
  readonly bomb: BombView
  readonly noises: NoiseEvent[]
  siteAt(x: number, z: number): SiteId | null
  closedDoorNear(x: number, z: number, radius: number): boolean
}

export type Plan = 'A' | 'B' | 'mid'
export type BotMode = 'engage' | 'search' | 'objective' | 'action' | 'hold'

interface Sighting {
  x: number
  z: number
  t: number
}

const THINK_DT = 1 / BRAIN_HZ
const CHEST_OFFSET = 1.3
const EYE_OFFSET = 1.62

/**
 * AI 大脑（有限状态机）。
 *   engage    ：看到敌人 → 反应延迟后瞄准开火，远距离推进、近距离横移，AWP 自动开镜
 *   search    ：丢失视线 / 听到枪声 → 前往可疑位置并环顾
 *   objective ：T 持包去炸弹点、无包 T 去接应、掉包去捡、CT 赶去拆包
 *   action    ：正在下包 / 拆包，原地保持交互键
 *   hold      ：守点（CT 守位、T 在包安放后守包）
 *
 * 决策频率为 BRAIN_HZ（30Hz），而转向每个物理 tick 平滑执行，避免 AI 抖动。
 */
export class Brain {
  readonly c: Character
  plan: Plan
  anchor: Vec2
  faceYaw: number
  mode: BotMode = 'hold'

  private aimYaw: number
  private aimPitch = 0
  private aimRate = TURN_RATE
  private intent: Intent = emptyIntent()
  private thinkT = 0
  private enemy: Character | null = null
  private reactT = 0
  private jitterX = 0
  private jitterY = 0
  private jitterT = 0
  private path: Vec2[] = []
  private goal: Vec2 | null = null
  private repathT = 0
  private stuckT = 0
  private lastX: number
  private lastZ: number
  private lastSeen: Sighting | null = null
  private searchT = 0
  private doorCd = 0
  private fireHeld = false
  private lookSeed = Math.random() * Math.PI * 2

  constructor(c: Character, plan: Plan, anchor: Vec2, faceYaw: number) {
    this.c = c
    this.plan = plan
    this.anchor = anchor
    this.faceYaw = faceYaw
    this.aimYaw = c.yaw
    this.lastX = c.x
    this.lastZ = c.z
  }

  /** 新回合开始：清空上一回合的记忆与路径 */
  reset(): void {
    this.mode = 'hold'
    this.enemy = null
    this.reactT = 0
    this.path = []
    this.goal = null
    this.repathT = 0
    this.stuckT = 0
    this.lastSeen = null
    this.searchT = 0
    this.doorCd = 0
    this.fireHeld = false
    this.thinkT = 0
    this.lastX = this.c.x
    this.lastZ = this.c.z
  }

  /**
   * 每个物理 tick 调用一次：到期则重新决策，然后把视角朝目标平滑转动，
   * 返回本 tick 的意图（边沿类指令只返回一次）。
   */
  intentFor(w: BotWorldView, dt: number): Intent {
    const c = this.c
    this.thinkT -= dt
    if (this.thinkT <= 0) {
      this.thinkT += THINK_DT
      this.think(w)
    }
    if (c.alive && !w.freeze) {
      c.yaw = approachAngle(c.yaw, this.aimYaw, this.aimRate * dt)
      c.pitch = approach(c.pitch, this.aimPitch, this.aimRate * dt)
    }
    const out: Intent = { ...this.intent }
    this.intent.altPressed = false
    this.intent.reloadPressed = false
    this.intent.interactPressed = false
    this.intent.jump = false
    this.intent.slot = null
    return out
  }

  private think(w: BotWorldView): void {
    const c = this.c
    const out = emptyIntent()
    this.doorCd -= THINK_DT
    this.jitterT -= THINK_DT
    if (!c.alive || w.freeze) {
      this.intent = out
      return
    }

    const enemy = this.perceive(w)
    if (enemy) {
      if (enemy !== this.enemy) {
        this.enemy = enemy
        this.reactT = 0.25 + Math.random() * 0.3
      }
      this.lastSeen = { x: enemy.x, z: enemy.z, t: w.time }
      this.mode = 'engage'
      this.engage(w, out, enemy)
    } else {
      // 刚丢失视线：去原来看到敌人的位置搜索
      if (this.enemy !== null || this.mode === 'engage') this.searchT = this.lastSeen ? 4 : 0
      this.enemy = null
      this.reactT = 0
      this.act(w, out)
    }
    // 弹夹打空：无论是否在交战都换弹（否则 canFire 为 false，永远不会自动换弹）
    const st = c.weaponState
    if (st && c.weapon.magSize > 0 && st.mag === 0) out.reloadPressed = true
    this.fireHeld = out.fire
    this.intent = out
  }

  private perceive(w: BotWorldView): Character | null {
    let best: Character | null = null
    let bestD = Infinity
    for (const e of w.characters) {
      if (!e.alive || e.team === this.c.team) continue
      const d = distXZ(this.c.x, this.c.z, e.x, e.z)
      if (d < bestD && canSee(this.c, e, w.colliders, true)) {
        best = e
        bestD = d
      }
    }
    return best
  }

  private engage(w: BotWorldView, out: Intent, e: Character): void {
    const c = this.c
    const def = c.weapon
    const st = c.weaponState
    const dist = distXZ(c.x, c.z, e.x, e.z)

    // 瞄准抖动：距离越远误差越大，模拟人的瞄准不稳定
    if (this.jitterT <= 0) {
      this.jitterT = 0.35
      const amp = 0.03 + dist * 0.012
      this.jitterX = (Math.random() - 0.5) * 2 * amp
      this.jitterY = (Math.random() - 0.5) * 2 * amp
    }
    const dx = e.x + this.jitterX - c.x
    const dz = e.z - c.z
    const dy = e.y + CHEST_OFFSET + this.jitterY - (c.y + EYE_OFFSET)
    const hd = Math.hypot(dx, dz)
    const wantYaw = yawTowards(dx, dz)
    const wantPitch = Math.atan2(dy, hd) - c.punch
    this.aimYaw = wantYaw
    this.aimPitch = wantPitch
    this.aimRate = TURN_RATE * 1.5
    this.reactT -= THINK_DT

    // 走位：远了推进，近了横移并保持距离
    if (dist > 24) {
      this.navigate(w, e.x, e.z, out, false)
    } else {
      out.strafe = Math.sin(this.lookSeed + w.time * 2.4) * 0.9
      out.forward = dist > 10 ? 0.3 : dist < 5 ? -0.3 : 0
    }

    const aimed = Math.abs(angleDiff(wantYaw, c.yaw)) < 0.08 && Math.abs(wantPitch - c.pitch) < 0.06
    const canFire = this.reactT <= 0 && aimed && dist <= def.range && st !== null && st.mag > 0
    out.fire = canFire && (def.auto || !this.fireHeld)

    if (def.scope) {
      if (!c.scoped && dist > 20) out.altPressed = true
      else if (c.scoped && dist < 12) out.altPressed = true
    }
  }

  private act(w: BotWorldView, out: Intent): void {
    const c = this.c

    // 正在下包 / 拆包：原地不动，保持交互键
    if (c.action) {
      out.interactHeld = true
      this.mode = 'action'
      this.aimRate = TURN_RATE / 2
      return
    }
    if (this.canStartBombAction(w)) {
      out.interactHeld = true
      this.mode = 'action'
      this.aimRate = TURN_RATE / 2
      return
    }

    // 听到敌方枪声：搜索声源
    const noise = this.heardNoise(w)
    if (noise) {
      this.lastSeen = { x: noise.x, z: noise.z, t: w.time }
      this.searchT = 4
    }

    if (this.searchT > 0 && this.lastSeen) {
      this.searchT -= THINK_DT
      this.mode = 'search'
      this.aimRate = TURN_RATE / 2
      const arrived = this.navigate(w, this.lastSeen.x, this.lastSeen.z, out, true)
      if (arrived) this.lookAround(w, out)
      if (this.searchT <= 0) this.lastSeen = null
      return
    }

    const task = this.task(w)
    this.mode = task.mode
    this.aimRate = TURN_RATE / 2
    const arrived = this.navigate(w, task.goal.x, task.goal.z, out, task.mode === 'objective')
    if (arrived && task.mode === 'hold') this.lookAround(w, out)
  }

  /** 守点时左右环顾（围绕 faceYaw 摆动） */
  private lookAround(w: BotWorldView, out: Intent): void {
    out.forward = 0
    out.strafe = 0
    this.aimYaw = this.faceYaw + Math.sin(w.time * 0.6 + this.lookSeed) * 0.9
    this.aimPitch = 0
    this.aimRate = TURN_RATE / 3
  }

  /**
   * 沿 A* 路径移动。返回 true 表示已到达目标（或目标不可达）。
   * face=true 时视角朝向移动方向，并且先转身再前进。
   */
  private navigate(w: BotWorldView, gx: number, gz: number, out: Intent, face: boolean): boolean {
    const c = this.c
    this.repathT -= THINK_DT
    const newGoal = !this.goal || distXZ(this.goal.x, this.goal.z, gx, gz) > 1.5
    if (newGoal || this.repathT <= 0) {
      this.path = w.nav.findPath({ x: c.x, z: c.z }, { x: gx, z: gz })
      this.goal = { x: gx, z: gz }
      this.repathT = 1.5
    }
    while (this.path.length > 0 && distXZ(this.path[0].x, this.path[0].z, c.x, c.z) < 0.9) this.path.shift()
    if (this.path.length === 0) return true

    const target = this.path[0]
    const dx = target.x - c.x
    const dz = target.z - c.z
    const d = Math.hypot(dx, dz)
    const ux = dx / d
    const uz = dz / d

    // 沿路径前进：朝向路径方向，并把世界方向投影到角色前/右轴
    const fwd = -ux * Math.sin(c.yaw) - uz * Math.cos(c.yaw)
    const right = ux * Math.cos(c.yaw) - uz * Math.sin(c.yaw)
    if (face) {
      this.aimYaw = yawTowards(ux, uz)
      out.forward = Math.max(0, fwd)
      out.strafe = 0
    } else {
      out.forward = fwd
      out.strafe = right
    }

    // 门：靠近关闭的中门时按 E 开门
    if (this.doorCd <= 0 && w.closedDoorNear(c.x, c.z, 2.2)) {
      out.interactPressed = true
      this.doorCd = 1.5
    }

    // 卡住检测：有移动意图却几乎没位移时，先跳一下，再重新寻路
    const moved = Math.hypot(c.x - this.lastX, c.z - this.lastZ)
    this.lastX = c.x
    this.lastZ = c.z
    if ((Math.abs(out.forward) > 0.2 || Math.abs(out.strafe) > 0.2) && moved < 0.03) {
      this.stuckT += THINK_DT
      if (this.stuckT > 0.7) {
        out.jump = true
        this.path = []
        this.repathT = 0
        this.stuckT = 0
      }
    } else {
      this.stuckT = 0
    }
    return false
  }

  private task(w: BotWorldView): { mode: BotMode; goal: Vec2 } {
    const c = this.c
    const b = w.bomb
    if (c.team === 'T') {
      const site = this.plan === 'B' ? 'B' : 'A'
      if (c.hasBomb) return { mode: 'objective', goal: namedPoint(site === 'A' ? 'aSite' : 'bSite') }
      if (b.state === 'dropped' && distRank(w, 'T', b.x, b.z, true, c) === 0) {
        return { mode: 'objective', goal: { x: b.x, z: b.z } }
      }
      if (b.state === 'carried') {
        return { mode: 'objective', goal: namedPoint(site === 'A' ? 'aEntrance' : 'bEntrance') }
      }
      if (b.state === 'planted') return { mode: 'hold', goal: { x: b.x, z: b.z } }
    } else if (b.state === 'planted' && distRank(w, 'CT', b.x, b.z, false, c) < 2) {
      // 两名离包最近的 CT 负责拆包，其余守点
      return { mode: 'objective', goal: { x: b.x, z: b.z } }
    }
    return { mode: 'hold', goal: this.anchor }
  }

  private canStartBombAction(w: BotWorldView): boolean {
    const c = this.c
    const b = w.bomb
    if (c.team === 'T') return c.hasBomb && b.state === 'carried' && w.siteAt(c.x, c.z) !== null
    return b.state === 'planted' && distXZ(c.x, c.z, b.x, b.z) <= PICKUP_RADIUS
  }

  private heardNoise(w: BotWorldView): { x: number; z: number } | null {
    for (let i = w.noises.length - 1; i >= 0; i--) {
      const n = w.noises[i]
      if (n.team !== this.c.team && w.time - n.t < 0.8 && distXZ(this.c.x, this.c.z, n.x, n.z) < 30) return n
    }
    return null
  }
}

/** 同队存活者中，离 (x,z) 比自己近的人数（0 表示自己最近）。skipCarriers 时忽略持包者。 */
function distRank(w: BotWorldView, team: Team, x: number, z: number, skipCarriers: boolean, self: Character): number {
  const mine = distXZ(self.x, self.z, x, z)
  let rank = 0
  for (const o of w.characters) {
    if (o === self || !o.alive || o.team !== team) continue
    if (skipCarriers && o.hasBomb) continue
    if (distXZ(o.x, o.z, x, z) < mine) rank++
  }
  return rank
}

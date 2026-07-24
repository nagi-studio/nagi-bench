/**
 * Bot 行为：感知 -> 决策(状态机) -> 寻路 -> 瞄准/开火。
 *
 * 设计要点：
 *  - bot 和玩家共用 Intent 结构，AI 只是"把手柄按下去"，物理和武器逻辑完全一致，
 *    所以 bot 不可能穿墙、不可能无限子弹，玩家接管 bot 也不用切换任何逻辑。
 *  - 视野判定走真实射线（眼睛 -> 胸/头/腿），被墙挡住就是看不见。
 *  - 瞄准是"带误差地转向"，误差随技能和反应时间收敛，所以近战会互相打不中一会儿，
 *    而不是一照面就秒杀。
 */

import {
  angleDelta,
  anglesToDir,
  clamp,
  dirToPitch,
  dirToYaw,
  v3,
  vdist2D,
  vdist2DSq,
  turnToward,
  wrapAngle,
} from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';
import type { Rng } from '../core/rng.ts';
import type { CollisionWorld } from '../map/collision.ts';
import type { NavGrid } from '../map/nav.ts';
import { TACTICAL_POINTS } from '../map/dust2.ts';
import type { TacticalTag } from '../map/dust2.ts';
import type { Actor, BotState, Team } from './actor.ts';
import { activeWeapon, activeWeaponDef, bestSlot, switchSlot } from './actor.ts';
import { canSee, currentInaccuracy } from './combat.ts';
import type { BombState } from './bomb.ts';
import { BOMB_DEFUSE_RADIUS, siteAt, siteById } from './bomb.ts';

export interface AiCtx {
  world: CollisionWorld;
  nav: NavGrid;
  actors: Actor[];
  bomb: BombState;
  rng: Rng;
  time: number;
  /** 回合是否已经开打（冻结时间内不许动） */
  live: boolean;
}

const tmp = v3();
const tmpDir = v3();

export function createBotState(rng: Rng, skill: number): BotState {
  return {
    mode: 'idle',
    skill,
    path: [],
    pathIndex: 0,
    repathTimer: 0,
    goal: v3(),
    goalKind: 'none',
    targetId: -1,
    seenAt: -99,
    acquireOffset: 0,
    lostAt: -99,
    lastKnown: v3(),
    aimYawErr: 0,
    aimPitchErr: 0,
    aimErrTimer: 0,
    burstTimer: 0,
    burstShots: 0,
    stuckTimer: 0,
    lastPos: v3(),
    holdYaw: 0,
    thinkTimer: rng.range(0, 0.2),
    assignment: 'mid',
    strafeDir: rng.bool() ? 1 : -1,
    strafeTimer: 0,
  };
}

/** 让 bot 注意到某个方向（枪声、脚步、队友死亡）。 */
export function alertBot(a: Actor, x: number, y: number, z: number, time: number): void {
  const ai = a.ai;
  if (!ai || !a.alive) return;
  // 已经有可见目标就不打断
  if (ai.targetId >= 0 && time - ai.seenAt < 1.5) return;
  ai.lastKnown.x = x;
  ai.lastKnown.y = y;
  ai.lastKnown.z = z;
  if (ai.mode === 'hold' || ai.mode === 'idle') {
    ai.holdYaw = dirToYaw(x - a.pos.x, z - a.pos.z);
  }
  if (ai.mode !== 'engage') {
    ai.lostAt = time;
    if (ai.mode !== 'plant' && ai.mode !== 'defuse') ai.mode = 'search';
  }
}

/** 主入口：每个 bot 每帧调用。 */
export function updateBot(ctx: AiCtx, a: Actor, dt: number): void {
  const ai = a.ai;
  if (!ai || !a.alive) return;

  const intent = a.intent;
  intent.forward = 0;
  intent.strafe = 0;
  intent.jump = false;
  intent.fire = false;
  intent.firePressed = false;
  intent.reload = false;
  intent.use = false;
  intent.crouch = false;
  intent.walk = false;
  intent.switchTo = null;

  if (!ctx.live) {
    // 冻结时间：原地待命，朝着目标方向
    a.yaw = turnToward(a.yaw, ai.holdYaw, 3 * dt);
    return;
  }

  ai.thinkTimer -= dt;
  if (ai.thinkTimer <= 0) {
    ai.thinkTimer = 0.12 + ctx.rng.range(0, 0.08);
    perceive(ctx, a, ai);
    decide(ctx, a, ai);
  }

  ensureWeapon(ctx, a);
  steer(ctx, a, ai, dt);
  aimAndShoot(ctx, a, ai, dt);
  stuckCheck(ctx, a, ai, dt);
}

/* -------------------------------------------------------------------------- */
/* 感知                                                                        */
/* -------------------------------------------------------------------------- */

function perceive(ctx: AiCtx, a: Actor, ai: BotState): void {
  let bestId = -1;
  let bestScore = Infinity;
  const aimYaw = a.yaw;

  for (const other of ctx.actors) {
    if (!other.alive || other.team === a.team) continue;
    const d2 = vdist2DSq(a.pos, other.pos);
    if (d2 > 130 * 130) continue;
    const dist = Math.sqrt(d2);

    // 视野角：正前方约 ±62 度；很近的话全向感知（撞到脸上）
    if (dist > 4) {
      const yawTo = dirToYaw(other.pos.x - a.pos.x, other.pos.z - a.pos.z);
      if (Math.abs(angleDelta(aimYaw, yawTo)) > 1.08) continue;
    }
    if (!canSee(ctx.world, a, other)) continue;

    // 越近、越正对着，优先级越高
    const yawTo = dirToYaw(other.pos.x - a.pos.x, other.pos.z - a.pos.z);
    const score = dist * (1 + Math.abs(angleDelta(aimYaw, yawTo)) * 0.7);
    if (score < bestScore) {
      bestScore = score;
      bestId = other.id;
    }
  }

  if (bestId >= 0) {
    if (ai.targetId !== bestId) {
      const t0 = ctx.actors.find((x) => x.id === bestId)!;
      ai.targetId = bestId;
      ai.seenAt = ctx.time;
      // 记录"发现瞬间准星偏了多少"：预瞄好的人几乎不用转枪，反应会快很多。
      // 再叠一点随机量，表示注意力不可能永远钉在同一个角上，
      // 否则守方会强到进攻方永远打不进点。
      ai.acquireOffset =
        Math.abs(angleDelta(a.yaw, dirToYaw(t0.pos.x - a.pos.x, t0.pos.z - a.pos.z))) +
        ctx.rng.range(0, 0.28);
      // 换目标时重置瞄准误差，制造"重新找人"的迟滞
      const err = (1 - ai.skill) * 0.16;
      ai.aimYawErr = ctx.rng.gaussian() * err;
      ai.aimPitchErr = ctx.rng.gaussian() * err * 0.5;

      // 防守方一发现敌人就通知队友换防，而不是等到有人倒下才反应
      const defending: Team = ctx.bomb.phase === 'planted' ? 'T' : 'CT';
      if (a.team === defending) {
        rotateDefenders(ctx.actors, a.team, t0.pos.x, t0.pos.z, ctx.time);
      }
    }
    const t = ctx.actors.find((x) => x.id === bestId)!;
    ai.lastKnown.x = t.pos.x;
    ai.lastKnown.y = t.pos.y;
    ai.lastKnown.z = t.pos.z;
    ai.lostAt = ctx.time;
  } else if (ai.targetId >= 0) {
    const t = ctx.actors.find((x) => x.id === ai.targetId);
    if (!t || !t.alive || ctx.time - ai.lostAt > 0.25) {
      ai.targetId = -1;
    }
  }
}

/* -------------------------------------------------------------------------- */
/* 决策                                                                        */
/* -------------------------------------------------------------------------- */

function decide(ctx: AiCtx, a: Actor, ai: BotState): void {
  const bomb = ctx.bomb;
  const hasTarget = ai.targetId >= 0;

  // 交火优先
  if (hasTarget) {
    ai.mode = 'engage';
    return;
  }

  // 炸弹已安放
  if (bomb.phase === 'planted') {
    if (a.team === 'CT') {
      setGoal(ctx, a, ai, bomb.pos.x, bomb.pos.y, bomb.pos.z, 'bomb');
      ai.mode = vdist2D(a.pos, bomb.pos) < BOMB_DEFUSE_RADIUS ? 'defuse' : 'advance';
      return;
    }
    // T：守在包附近
    if (vdist2D(a.pos, bomb.pos) > 14) {
      setGoal(ctx, a, ai, bomb.pos.x, bomb.pos.y, bomb.pos.z, 'bomb');
      ai.mode = 'advance';
    } else {
      holdNear(ctx, a, ai, bomb.pos.x, bomb.pos.z);
    }
    return;
  }

  if (a.team === 'T') {
    // 包掉在地上：最近的 T 去捡
    if (bomb.phase === 'dropped') {
      const meDist = vdist2D(a.pos, bomb.pos);
      let closest = true;
      for (const m of ctx.actors) {
        if (m === a || !m.alive || m.team !== 'T') continue;
        if (vdist2D(m.pos, bomb.pos) < meDist - 0.5) {
          closest = false;
          break;
        }
      }
      if (closest) {
        setGoal(ctx, a, ai, bomb.pos.x, bomb.pos.y, bomb.pos.z, 'bomb');
        ai.mode = 'pickup';
        return;
      }
    }

    const site = siteById(ai.assignment === 'B' ? 'B' : 'A');
    const inSite = siteAt(a.pos.x, a.pos.z);

    // 已经进点了
    if (inSite && inSite.id === site.id) {
      if (a.hasBomb) {
        ai.mode = 'plant';
        return;
      }
      holdNear(ctx, a, ai, site.plantX, site.plantZ);
      return;
    }

    // 还在路上：先奔一个中途推进位（这样五个人不会挤成一条线），
    // 到了中途位再直奔炸弹点。
    if (ai.goalKind === 'stage') {
      if (vdist2D(a.pos, ai.goal) < 4.5) {
        setGoal(ctx, a, ai, site.plantX, 1, site.plantZ, 'site');
      }
    } else if (ai.goalKind !== 'site') {
      const tag: TacticalTag =
        ai.assignment === 'B' ? 'pushB' : ai.assignment === 'mid' ? 'pushMid' : 'pushA';
      const p = pickTactical(ctx, a, tag);
      if (p) setGoal(ctx, a, ai, p.x, a.pos.y, p.z, 'stage');
      else setGoal(ctx, a, ai, site.plantX, 1, site.plantZ, 'site');
    }
    ai.mode = 'advance';
    return;
  }

  // ---- CT ----
  // 防守方只在很近的距离上去查看，不然会被引出防守位、丢掉架点优势
  if (
    ai.mode === 'search' &&
    ctx.time - ai.lostAt < 6 &&
    vdist2D(a.pos, ai.lastKnown) < 16
  ) {
    setGoal(ctx, a, ai, ai.lastKnown.x, ai.lastKnown.y, ai.lastKnown.z, 'enemy');
    return;
  }
  const tag: TacticalTag = ai.assignment === 'B' ? 'holdB' : ai.assignment === 'mid' ? 'holdMid' : 'holdA';
  if (ai.goalKind !== 'hold' || ai.path.length === 0) {
    const p = pickTactical(ctx, a, tag);
    if (p) {
      setGoal(ctx, a, ai, p.x, a.pos.y, p.z, 'hold');
      ai.holdYaw = p.yaw;
    }
  }
  ai.mode = vdist2D(a.pos, ai.goal) < 2.2 ? 'hold' : 'advance';
}

function pickTactical(ctx: AiCtx, a: Actor, tag: TacticalTag) {
  const list = TACTICAL_POINTS.filter((p) => p.tag === tag);
  if (!list.length) return null;
  // 尽量避开队友已经占的点
  let best = list[0];
  let bestScore = -Infinity;
  for (const p of list) {
    let score = ctx.rng.range(0, 6);
    let occupied = 0;
    for (const m of ctx.actors) {
      if (m === a || !m.alive || m.team !== a.team) continue;
      if (vdist2DSq(m.pos, { x: p.x, y: 0, z: p.z }) < 36) occupied++;
    }
    score -= occupied * 5;
    score -= vdist2D(a.pos, { x: p.x, y: 0, z: p.z }) * 0.05;
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}

/** 在某个点附近游走（守点 / 占点）。 */
function holdNear(ctx: AiCtx, a: Actor, ai: BotState, x: number, z: number): void {
  if (ai.goalKind === 'roam' && ai.path.length > 0) {
    ai.mode = 'advance';
    return;
  }
  if (vdist2D(a.pos, { x, y: 0, z }) < 3 && ctx.rng.bool(0.5)) {
    ai.mode = 'hold';
    return;
  }
  if (ctx.nav.randomPointIn(ctx.rng, x - 7, z - 7, x + 7, z + 7, tmp)) {
    setGoal(ctx, a, ai, tmp.x, tmp.y, tmp.z, 'roam');
    ai.mode = 'advance';
  } else {
    ai.mode = 'hold';
  }
}

function setGoal(
  ctx: AiCtx,
  a: Actor,
  ai: BotState,
  x: number,
  y: number,
  z: number,
  kind: BotState['goalKind'],
): void {
  const changed = vdist2DSq(ai.goal, { x, y, z }) > 4 || ai.goalKind !== kind;
  ai.goal.x = x;
  ai.goal.y = y;
  ai.goal.z = z;
  ai.goalKind = kind;
  if (changed || ai.path.length === 0) repath(ctx, a, ai);
}

function repath(ctx: AiCtx, a: Actor, ai: BotState): void {
  ai.repathTimer = 0.6 + ctx.rng.range(0, 0.5);
  const ok = ctx.nav.findPath(
    a.pos.x,
    a.pos.y,
    a.pos.z,
    ai.goal.x,
    ai.goal.y,
    ai.goal.z,
    ai.path,
  );
  ai.pathIndex = 0;
  if (!ok) ai.path.length = 0;
}

/* -------------------------------------------------------------------------- */
/* 移动                                                                        */
/* -------------------------------------------------------------------------- */

function steer(ctx: AiCtx, a: Actor, ai: BotState, dt: number): void {
  ai.repathTimer -= dt;
  const intent = a.intent;

  // 交火中：中近距离站桩对枪，远距离边推进边打（否则两队会隔着长廊
  // 互相干瞪眼到回合结束）
  if (ai.mode === 'engage') {
    const target = ctx.actors.find((x) => x.id === ai.targetId);
    if (target) {
      const dist = vdist2D(a.pos, target.pos);
      ai.strafeTimer -= dt;
      if (ai.strafeTimer <= 0) {
        ai.strafeTimer = ctx.rng.range(0.35, 1.1);
        ai.strafeDir = ctx.rng.bool() ? 1 : -1;
        // 移动会大幅增加散布，所以大部分时间应该站定输出，
        // 技能越高越懂得停下来打
        if (ctx.rng.bool(0.45 + ai.skill * 0.45)) ai.strafeDir = 0;
      }
      if (dist > 34) {
        // 太远：继续沿路径推进，顺便开火
        followPath(ctx, a, ai, dt, false);
        return;
      }
      if (dist > 24 && ai.skill > 0.45) {
        intent.crouch = true;
        intent.strafe = 0;
      } else {
        intent.strafe = ai.strafeDir * 0.85;
        if (dist > 16) intent.forward = 0.5;
        else if (dist < 5) intent.forward = -0.6;
      }
      return;
    }
  }

  if (ai.mode === 'plant' || ai.mode === 'defuse') {
    intent.use = true;
    return;
  }

  if (ai.mode === 'hold') {
    return;
  }

  followPath(ctx, a, ai, dt, true);
}

/**
 * 沿 A* 路径行进。路径会定期重算——bot 在交火/被推开之后位置早就偏了，
 * 不重算就会出现"往回走"的傻样。
 */
function followPath(ctx: AiCtx, a: Actor, ai: BotState, dt: number, lookAhead: boolean): void {
  const intent = a.intent;
  if (ai.goalKind === 'none') return;

  if (ai.repathTimer <= 0 || ai.path.length === 0 || ai.pathIndex >= ai.path.length) {
    repath(ctx, a, ai);
  }
  if (ai.path.length === 0) return;

  // 跳过已经走过头的路点
  while (ai.pathIndex < ai.path.length - 1) {
    const wp = ai.path[ai.pathIndex];
    if (Math.hypot(wp.x - a.pos.x, wp.z - a.pos.z) < 0.85) ai.pathIndex++;
    else break;
  }
  const wp = ai.path[ai.pathIndex];
  const dx = wp.x - a.pos.x;
  const dz = wp.z - a.pos.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.85 && ai.pathIndex >= ai.path.length - 1) {
    ai.path.length = 0;
    return;
  }

  const moveYaw = dirToYaw(dx, dz);
  // 相对自身朝向拆成前后 / 左右，这样一边看着敌人一边侧着走
  const rel = angleDelta(a.yaw, moveYaw);
  intent.forward = Math.cos(rel);
  intent.strafe = -Math.sin(rel);
  const mag = Math.hypot(intent.forward, intent.strafe);
  if (mag > 1e-3) {
    intent.forward /= mag;
    intent.strafe /= mag;
  }

  // 不在交火时朝着移动方向看
  if (lookAhead && ai.mode !== 'engage' && ai.targetId < 0) {
    const turn = (3.6 + ai.skill * 2) * dt;
    a.yaw = turnToward(a.yaw, moveYaw, turn);
    a.pitch = turnToward(a.pitch, 0, turn);
  }
}

function stuckCheck(ctx: AiCtx, a: Actor, ai: BotState, dt: number): void {
  const moving = Math.abs(a.intent.forward) + Math.abs(a.intent.strafe) > 0.1;
  if (!moving) {
    ai.stuckTimer = 0;
    ai.lastPos.x = a.pos.x;
    ai.lastPos.z = a.pos.z;
    return;
  }
  ai.stuckTimer += dt;
  if (ai.stuckTimer > 0.9) {
    const moved = vdist2D(a.pos, ai.lastPos);
    if (moved < 0.45) {
      // 卡住了：换条路 + 随机绕一下
      repath(ctx, a, ai);
      ai.strafeDir = ctx.rng.bool() ? 1 : -1;
      ai.strafeTimer = 0.5;
      a.intent.strafe = ai.strafeDir;
      a.intent.jump = ctx.rng.bool(0.25);
    }
    ai.stuckTimer = 0;
    ai.lastPos.x = a.pos.x;
    ai.lastPos.z = a.pos.z;
  }
}

/* -------------------------------------------------------------------------- */
/* 武器 / 瞄准 / 开火                                                          */
/* -------------------------------------------------------------------------- */

function ensureWeapon(ctx: AiCtx, a: Actor): void {
  // 下包时切到 C4
  if (a.ai!.mode === 'plant' && a.inventory.bomb) {
    if (a.activeSlot !== 'bomb') switchSlot(a, 'bomb');
    return;
  }
  const want = bestSlot(a);
  if (a.activeSlot === 'bomb' || a.activeSlot !== want) {
    const cur = activeWeapon(a);
    // 当前枪还有子弹就不换
    if (a.activeSlot === 'bomb' || !cur || cur.ammo + cur.reserve <= 0) {
      switchSlot(a, want);
    }
  }
  // 安全时装弹
  const ws = activeWeapon(a);
  const def = activeWeaponDef(a);
  if (ws && ws.ammo === 0 && ws.reserve > 0) {
    a.intent.reload = true;
  } else if (
    ws &&
    a.ai!.targetId < 0 &&
    ws.ammo < def.magSize * 0.35 &&
    ws.reserve > 0 &&
    ctx.time - a.ai!.lostAt > 2.5
  ) {
    a.intent.reload = true;
  }
}

function aimAndShoot(ctx: AiCtx, a: Actor, ai: BotState, dt: number): void {
  const target = ai.targetId >= 0 ? ctx.actors.find((x) => x.id === ai.targetId) : null;

  if (!target || !target.alive) {
    if (ai.mode === 'search') {
      const yawTo = dirToYaw(ai.lastKnown.x - a.pos.x, ai.lastKnown.z - a.pos.z);
      a.yaw = turnToward(a.yaw, yawTo, (4 + ai.skill * 2) * dt);
      a.pitch = turnToward(a.pitch, 0, 3 * dt);
    } else if (ai.mode === 'hold') {
      a.yaw = turnToward(a.yaw, ai.holdYaw, 2.4 * dt);
      a.pitch = turnToward(a.pitch, 0, 2 * dt);
    }
    return;
  }

  const def = activeWeaponDef(a);
  const ws = activeWeapon(a);

  // 瞄胸口，近距离抬到头
  const dist = vdist2D(a.pos, target.pos);
  const aimH = dist < 14 ? 1.38 : 1.26;
  const scale = target.crouching ? 0.72 : 1;
  const dx = target.pos.x - a.pos.x;
  const dy = target.pos.y + aimH * scale - (a.pos.y + a.eyeHeight);
  const dz = target.pos.z - a.pos.z;

  // 提前量：朝目标速度方向补一点
  const lead = clamp(dist / 260, 0, 0.12) * (0.4 + ai.skill * 0.8);
  const desiredYaw = dirToYaw(dx + target.vel.x * lead, dz + target.vel.z * lead);
  const desiredPitch = dirToPitch(dx, dy, dz);

  // 瞄准误差随机游走，技能越高越小、越快收敛
  ai.aimErrTimer -= dt;
  if (ai.aimErrTimer <= 0) {
    ai.aimErrTimer = 0.18 + ctx.rng.range(0, 0.22);
    const settle = clamp((ctx.time - ai.seenAt) / (0.5 + (1 - ai.skill) * 1.2), 0, 1);
    const amp = (1 - ai.skill) * 0.075 * (1.5 - settle) * clamp(dist / 25, 0.5, 2.2);
    ai.aimYawErr = ctx.rng.gaussian() * amp;
    ai.aimPitchErr = ctx.rng.gaussian() * amp * 0.55;
  }

  // 压枪：把后坐力冲击按技能比例抵消掉
  const comp = 0.45 + ai.skill * 0.5;
  const targetYaw = wrapAngle(desiredYaw + ai.aimYawErr - a.punchYaw * comp);
  const targetPitch = clamp(desiredPitch + ai.aimPitchErr - a.punchPitch * comp, -1.4, 1.4);

  const turnRate = (5.5 + ai.skill * 7) * dt;
  a.yaw = turnToward(a.yaw, targetYaw, turnRate);
  a.pitch = turnToward(a.pitch, targetPitch, turnRate);

  // AWP 开镜
  if (def.scope) {
    a.intent.scope = dist > 15 && Math.abs(angleDelta(a.yaw, desiredYaw)) < 0.25;
  }

  if (!ws || (ws.ammo <= 0 && def.slot !== 'melee') || a.reloadTimer > 0 || a.deployTimer > 0) {
    return;
  }

  // 反应时间：目标正好撞进预瞄的准星里 -> 快；从侧面冒出来 -> 慢
  const offsetFactor = clamp(ai.acquireOffset / 0.6, 0, 1);
  const reaction = (0.16 + 0.3 * offsetFactor) * (1.3 - ai.skill * 0.55);
  if (ctx.time - ai.seenAt < reaction) return;

  // 准星够正才开枪
  anglesToDir(tmpDir, a.yaw + a.punchYaw, a.pitch + a.punchPitch);
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const dot = (tmpDir.x * dx + tmpDir.y * dy + tmpDir.z * dz) / Math.max(1e-4, len);
  const angleErr = Math.acos(clamp(dot, -1, 1));
  // 允许误差 = 目标视角大小 + 当前散布
  const allow = Math.atan2(0.45, Math.max(1, len)) + currentInaccuracy(a, def) * 0.6;
  if (angleErr > allow) return;

  if (def.slot === 'melee' && len > def.range) return;

  // 别打队友的后脑勺
  if (teammateInLine(ctx, a, tmpDir, len)) return;

  // 连发节奏
  ai.burstTimer -= dt;
  if (def.auto) {
    if (ai.burstTimer <= 0) {
      if (ai.burstShots <= 0) {
        ai.burstShots = Math.round(3 + ai.skill * 5 + ctx.rng.range(0, 3));
        if (dist > 30) ai.burstShots = Math.round(1 + ai.skill * 2);
      }
      a.intent.fire = true;
      a.intent.firePressed = true;
      ai.burstShots--;
      if (ai.burstShots <= 0) {
        ai.burstTimer = 0.18 + (1 - ai.skill) * 0.35 + ctx.rng.range(0, 0.15);
      }
    }
  } else {
    if (ai.burstTimer <= 0) {
      a.intent.fire = true;
      a.intent.firePressed = true;
      const base = def.id === 'awp' ? 1.5 : 0.22;
      ai.burstTimer = base + (1 - ai.skill) * 0.35 + ctx.rng.range(0, 0.2);
    }
  }
}

/** 射线方向上有没有队友挡着。 */
function teammateInLine(ctx: AiCtx, a: Actor, dir: Vec3, maxDist: number): boolean {
  for (const m of ctx.actors) {
    if (m === a || !m.alive || m.team !== a.team) continue;
    const dx = m.pos.x - a.pos.x;
    const dy = m.pos.y + 0.9 - (a.pos.y + a.eyeHeight);
    const dz = m.pos.z - a.pos.z;
    const proj = dx * dir.x + dy * dir.y + dz * dir.z;
    if (proj <= 0.5 || proj > maxDist) continue;
    const d2 = dx * dx + dy * dy + dz * dz - proj * proj;
    if (d2 < 0.85 * 0.85) return true;
  }
  return false;
}

/** 离某点最近的炸弹点（超过一定距离算"中路"，返回 null）。 */
function nearestSiteId(x: number, z: number): 'A' | 'B' | null {
  let best: 'A' | 'B' | null = null;
  let bestD = 34;
  for (const id of ['A', 'B'] as const) {
    const s = siteById(id);
    const cx = (s.x0 + s.x1) / 2;
    const cz = (s.z0 + s.z1) / 2;
    const d = Math.hypot(cx - x, cz - z);
    if (d < bestD) {
      bestD = d;
      best = id;
    }
  }
  return best;
}

/**
 * 队友在某处倒下 / 某个点被打响时的换防：
 * 防守方如果那个点人手不够，就从别处（优先中路机动位）调一个人过去。
 * 没有这个逻辑，CT 会各守各的点，被 4 打 2 各个击破。
 */
export function rotateDefenders(
  actors: Actor[],
  team: Team,
  x: number,
  z: number,
  time: number,
): void {
  const site = nearestSiteId(x, z);
  if (!site) return;
  let defenders = 0;
  const candidates: Actor[] = [];
  for (const a of actors) {
    if (a.team !== team || !a.alive || !a.ai) continue;
    if (a.ai.assignment === site) {
      defenders++;
      continue;
    }
    // 正在交火的人不要抽走
    if (a.ai.targetId >= 0 || time - a.ai.lostAt < 3) continue;
    candidates.push(a);
  }
  if (defenders >= 3 || candidates.length === 0) return;
  candidates.sort((p, q) => {
    const pm = p.ai!.assignment === 'mid' ? 0 : 1;
    const qm = q.ai!.assignment === 'mid' ? 0 : 1;
    if (pm !== qm) return pm - qm;
    return vdist2D(p.pos, { x, y: 0, z }) - vdist2D(q.pos, { x, y: 0, z });
  });
  const pick = candidates[0];
  pick.ai!.assignment = site;
  pick.ai!.goalKind = 'none';
  pick.ai!.path.length = 0;
  pick.ai!.mode = 'advance';
}

/** 回合开始时给整队分配站位。 */
export function assignTeamRoles(actors: Actor[], team: Team, rng: Rng): void {
  const alive = actors.filter((a) => a.team === team && a.ai);
  rng.shuffle(alive);
  if (team === 'T') {
    // 3 人主攻 + 2 人牵制另一边：全队压一个点的话防守方必输，
    // 分兵反而让整局更有来有回。
    const main: 'A' | 'B' = rng.bool() ? 'A' : 'B';
    const other: 'A' | 'B' = main === 'A' ? 'B' : 'A';
    const mainCount = Math.max(2, Math.ceil(alive.length * 0.6));
    alive.forEach((a, i) => {
      a.ai!.assignment = i < mainCount ? main : other;
      // 携包的人一定去主攻点
      if (a.hasBomb) a.ai!.assignment = main;
    });
  } else {
    const plan: Array<'A' | 'B' | 'mid'> = ['A', 'A', 'B', 'B', 'mid'];
    alive.forEach((a, i) => {
      a.ai!.assignment = plan[i % plan.length];
    });
  }
  for (const a of alive) {
    a.ai!.mode = 'idle';
    a.ai!.path.length = 0;
    a.ai!.goalKind = 'none';
    a.ai!.targetId = -1;
    a.ai!.holdYaw = a.yaw;
  }
}

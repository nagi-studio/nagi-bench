/**
 * 角色物理：Quake 风格的加速/摩擦 + AABB 分轴推进 + 自动上台阶。
 * 玩家和 AI 走同一套，所以 AI 不会出现"穿墙"或"飘着走"的特权。
 */

import { yawForward, yawRight, v3, clamp } from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';
import type { CollisionWorld } from '../map/collision.ts';
import type { Actor } from './actor.ts';
import { CROUCH_EYE, CROUCH_HEIGHT, PLAYER_RADIUS, STAND_EYE, STAND_HEIGHT } from './actor.ts';

export const GRAVITY = 18;
export const JUMP_SPEED = 5.7;
const GROUND_ACCEL = 60;
const AIR_ACCEL = 22;
/** 空中能主动加速到的上限（保留一点空中微调，又不至于飞起来） */
const AIR_WISH_CAP = 1.4;
const FRICTION = 9.5;
/** 能自动跨上去的高度，必须与 nav.ts 的 STEP_HEIGHT 一致 */
export const STEP_HEIGHT = 0.5;
const CROUCH_LERP = 9;

const tmpF = v3();
const tmpR = v3();

function collides(world: CollisionWorld, x: number, y: number, z: number, h: number): boolean {
  const r = PLAYER_RADIUS;
  return world.overlapBox(x - r, y + 0.04, z - r, x + r, y + h, z + r);
}

/** 单轴推进：先直接走，走不动就试着抬脚上台阶。 */
function axisMove(
  world: CollisionWorld,
  a: Actor,
  tx: number,
  tz: number,
  canStep: boolean,
): boolean {
  const h = a.height;
  if (!collides(world, tx, a.pos.y, tz, h)) {
    a.pos.x = tx;
    a.pos.z = tz;
    return true;
  }
  if (!canStep) return false;

  const probeY = a.pos.y + STEP_HEIGHT;
  // 抬到台阶高度还撞，说明是真墙
  if (collides(world, tx, probeY, tz, h - STEP_HEIGHT)) return false;
  const support = world.supportHeight(tx, tz, probeY + 0.02, PLAYER_RADIUS);
  if (!isFinite(support)) return false;
  const rise = support - a.pos.y;
  if (rise <= 0.02 || rise > STEP_HEIGHT + 0.02) return false;
  if (collides(world, tx, support, tz, h)) return false;
  a.pos.x = tx;
  a.pos.z = tz;
  a.pos.y = support;
  return true;
}

export interface MoveResult {
  landed: boolean;
  landSpeed: number;
  bumpedHead: boolean;
}

/**
 * 推进一个角色一帧。maxSpeed 由武器/姿态决定，外部算好传进来。
 */
export function moveActor(
  world: CollisionWorld,
  a: Actor,
  dt: number,
  maxSpeed: number,
  bounds: { x0: number; z0: number; x1: number; z1: number },
): MoveResult {
  const result: MoveResult = { landed: false, landSpeed: 0, bumpedHead: false };
  const intent = a.intent;

  // ---- 姿态 ----
  const wantCrouch = intent.crouch && a.grounded;
  if (wantCrouch) {
    a.crouching = true;
  } else if (a.crouching) {
    // 站起来要有头顶空间
    if (!collides(world, a.pos.x, a.pos.y, a.pos.z, STAND_HEIGHT)) a.crouching = false;
  }
  const targetH = a.crouching ? CROUCH_HEIGHT : STAND_HEIGHT;
  const targetEye = a.crouching ? CROUCH_EYE : STAND_EYE;
  a.height += (targetH - a.height) * Math.min(1, CROUCH_LERP * dt);
  a.eyeHeight += (targetEye - a.eyeHeight) * Math.min(1, CROUCH_LERP * dt);

  // ---- 期望方向 ----
  const f = yawForward(tmpF, a.yaw);
  const r = yawRight(tmpR, a.yaw);
  let wx = f.x * intent.forward + r.x * intent.strafe;
  let wz = f.z * intent.forward + r.z * intent.strafe;
  const wl = Math.hypot(wx, wz);
  if (wl > 1e-4) {
    wx /= wl;
    wz /= wl;
  } else {
    wx = 0;
    wz = 0;
  }
  const wishSpeed = wl > 1e-4 ? maxSpeed : 0;

  // ---- 摩擦 ----
  if (a.grounded) {
    const speed = Math.hypot(a.vel.x, a.vel.z);
    if (speed > 0.01) {
      const drop = Math.max(speed, 2.5) * FRICTION * dt;
      const ns = Math.max(0, speed - drop);
      const k = ns / speed;
      a.vel.x *= k;
      a.vel.z *= k;
    } else {
      a.vel.x = 0;
      a.vel.z = 0;
    }
  }

  // ---- 加速 ----
  if (wishSpeed > 0) {
    const cap = a.grounded ? wishSpeed : Math.min(wishSpeed, AIR_WISH_CAP);
    const accel = a.grounded ? GROUND_ACCEL : AIR_ACCEL;
    const current = a.vel.x * wx + a.vel.z * wz;
    const add = cap - current;
    if (add > 0) {
      let accelSpeed = accel * dt * wishSpeed;
      if (accelSpeed > add) accelSpeed = add;
      a.vel.x += wx * accelSpeed;
      a.vel.z += wz * accelSpeed;
    }
  }

  // ---- 跳跃 ----
  if (intent.jump && a.grounded && !a.busy) {
    a.vel.y = JUMP_SPEED;
    a.grounded = false;
  }

  // ---- 重力 ----
  a.vel.y -= GRAVITY * dt;
  if (a.vel.y < -60) a.vel.y = -60;

  // ---- 水平推进（分轴 + 上台阶）----
  const wasGrounded = a.grounded;
  const dx = a.vel.x * dt;
  const dz = a.vel.z * dt;
  if (dx !== 0 && !axisMove(world, a, a.pos.x + dx, a.pos.z, wasGrounded)) {
    a.vel.x = 0;
  }
  if (dz !== 0 && !axisMove(world, a, a.pos.x, a.pos.z + dz, wasGrounded)) {
    a.vel.z = 0;
  }

  // ---- 垂直推进 ----
  const oldY = a.pos.y;
  let newY = oldY + a.vel.y * dt;
  if (a.vel.y > 0) {
    if (collides(world, a.pos.x, newY, a.pos.z, a.height)) {
      newY = oldY;
      a.vel.y = 0;
      result.bumpedHead = true;
    }
    a.grounded = false;
  } else {
    const support = world.supportHeight(a.pos.x, a.pos.z, oldY + 0.06, PLAYER_RADIUS);
    if (isFinite(support) && newY <= support + 1e-4) {
      newY = support;
      if (!wasGrounded) {
        result.landed = true;
        result.landSpeed = -a.vel.y;
      }
      a.vel.y = 0;
      a.grounded = true;
    } else {
      a.grounded = false;
    }
  }
  a.pos.y = newY;

  // ---- 走下台阶时贴地，避免一路弹跳 ----
  if (wasGrounded && !a.grounded && a.vel.y <= 0.01) {
    const below = world.supportHeight(a.pos.x, a.pos.z, a.pos.y + 0.06, PLAYER_RADIUS);
    if (isFinite(below) && a.pos.y - below <= STEP_HEIGHT + 0.05 && a.pos.y - below > 0) {
      a.pos.y = below;
      a.vel.y = 0;
      a.grounded = true;
    }
  }

  // ---- 兜底：别掉出地图 ----
  a.pos.x = clamp(a.pos.x, bounds.x0 + 1, bounds.x1 - 1);
  a.pos.z = clamp(a.pos.z, bounds.z0 + 1, bounds.z1 - 1);
  if (a.pos.y < -20) {
    a.pos.y = 2;
    a.vel.y = 0;
  }

  a.speed = Math.hypot(a.vel.x, a.vel.z);
  return result;
}

/**
 * 角色之间不做硬碰撞（那样 bot 很容易互相卡死），
 * 改成软性推开：重叠时按距离反比互推，既不会叠在一起也不会卡住。
 */
export function separateActors(actors: Actor[], world: CollisionWorld, dt: number): void {
  const minDist = PLAYER_RADIUS * 2 * 0.92;
  for (let i = 0; i < actors.length; i++) {
    const a = actors[i];
    if (!a.alive) continue;
    for (let j = i + 1; j < actors.length; j++) {
      const b = actors[j];
      if (!b.alive) continue;
      if (Math.abs(a.pos.y - b.pos.y) > 1.6) continue;
      let dx = b.pos.x - a.pos.x;
      let dz = b.pos.z - a.pos.z;
      let d = Math.hypot(dx, dz);
      if (d >= minDist) continue;
      if (d < 1e-4) {
        dx = 0.01;
        dz = 0;
        d = 0.01;
      }
      const push = (minDist - d) * 0.5;
      const nx = (dx / d) * push;
      const nz = (dz / d) * push;
      tryNudge(world, a, -nx, -nz);
      tryNudge(world, b, nx, nz);
    }
  }
}

function tryNudge(world: CollisionWorld, a: Actor, dx: number, dz: number): void {
  const nx = a.pos.x + dx;
  const nz = a.pos.z + dz;
  if (!collides(world, nx, a.pos.y, nz, a.height)) {
    a.pos.x = nx;
    a.pos.z = nz;
  }
}

/** 把角色安全地放到某个位置（出生 / 传送）。 */
export function placeActor(
  world: CollisionWorld,
  a: Actor,
  x: number,
  z: number,
  yGuess: number,
): void {
  const support = world.supportHeight(x, z, yGuess + 2.5, PLAYER_RADIUS);
  a.pos.x = x;
  a.pos.z = z;
  a.pos.y = isFinite(support) ? support : yGuess;
  a.prevPos.x = a.pos.x;
  a.prevPos.y = a.pos.y;
  a.prevPos.z = a.pos.z;
  a.vel.x = 0;
  a.vel.y = 0;
  a.vel.z = 0;
  a.grounded = true;
  a.height = STAND_HEIGHT;
  a.eyeHeight = STAND_EYE;
  a.crouching = false;
}

/** 从视线方向发一条"看得见吗"的射线用的辅助：眼睛位置。 */
export function eyeOf(a: Actor, out: Vec3): Vec3 {
  out.x = a.pos.x;
  out.y = a.pos.y + a.eyeHeight;
  out.z = a.pos.z;
  return out;
}

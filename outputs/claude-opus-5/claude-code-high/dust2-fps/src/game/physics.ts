import { clamp } from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';
import type { World } from '../map/world.ts';
import type { Actor } from './actor.ts';
import { activeDef, targetHeightScale } from './actor.ts';
import { PLAYER_RADIUS } from './hitbox.ts';
import { STEP_HEIGHT } from '../map/grid.ts';

export const GRAVITY = 16.5;
/** ~1.09 m of clearance, a touch more when crouch-jumping. */
export const JUMP_SPEED = 6.0;
export const CROUCH_JUMP_CLEARANCE = 0.36;
export const BASE_SPEED = 5.2;
export const CROUCH_SPEED_MUL = 0.42;
export const GROUND_ACCEL = 62;
export const AIR_ACCEL = 14;
export const FRICTION = 9.5;
export const FOOTSTEP_DISTANCE = 2.1;

export interface MoveIntent {
  /** -1..1, +1 = forward. */
  forward: number;
  /** -1..1, +1 = right. */
  strafe: number;
  jump: boolean;
  crouch: boolean;
  walk: boolean;
}

export const NO_INPUT: MoveIntent = { forward: 0, strafe: 0, jump: false, crouch: false, walk: false };

export interface MoveResult {
  jumped: boolean;
  landed: boolean;
  landedHard: boolean;
  footstep: boolean;
  hitWall: boolean;
}

/**
 * Quake/CS-flavoured player movement: ground acceleration with friction,
 * reduced air control, step-up onto crates and ramps, and a footstep odometer.
 * Shared by the human player and every bot so they move identically.
 */
export function stepActor(a: Actor, intent: MoveIntent, world: World, dt: number, time: number): MoveResult {
  const res: MoveResult = { jumped: false, landed: false, landedHard: false, footstep: false, hitWall: false };
  if (!a.alive) return res;

  // ---- crouch transition -------------------------------------------------
  const wantScale = targetHeightScale(intent.crouch);
  const scaleRate = intent.crouch ? 6.5 : 5.0;
  if (a.heightScale !== wantScale) {
    const delta = wantScale - a.heightScale;
    const step = Math.sign(delta) * scaleRate * dt;
    a.heightScale = Math.abs(step) >= Math.abs(delta) ? wantScale : a.heightScale + step;
  }
  a.crouching = intent.crouch;

  // ---- wish direction ----------------------------------------------------
  const def = activeDef(a);
  let maxSpeed = BASE_SPEED * def.speedMul;
  if (a.crouching) maxSpeed *= CROUCH_SPEED_MUL;
  if (intent.walk) maxSpeed *= 0.52;
  if (a.scoped) maxSpeed *= 0.34;

  const sinY = Math.sin(a.yaw);
  const cosY = Math.cos(a.yaw);
  // forward = (-sin, -cos), right = (cos, -sin)
  let wishX = -sinY * intent.forward + cosY * intent.strafe;
  let wishZ = -cosY * intent.forward - sinY * intent.strafe;
  const wishLen = Math.hypot(wishX, wishZ);
  if (wishLen > 1e-4) {
    wishX /= wishLen;
    wishZ /= wishLen;
  }
  const wishSpeed = Math.min(wishLen, 1) * maxSpeed;

  // ---- acceleration / friction ------------------------------------------
  if (a.grounded) {
    const speed = Math.hypot(a.vel.x, a.vel.z);
    if (speed > 0) {
      const drop = Math.max(speed, 1.5) * FRICTION * dt;
      const newSpeed = Math.max(0, speed - drop);
      const f = newSpeed / speed;
      a.vel.x *= f;
      a.vel.z *= f;
    }
    accelerate(a.vel, wishX, wishZ, wishSpeed, GROUND_ACCEL, dt);
  } else {
    accelerate(a.vel, wishX, wishZ, Math.min(wishSpeed, BASE_SPEED * 0.95), AIR_ACCEL, dt);
  }

  // ---- jump --------------------------------------------------------------
  if (intent.jump && a.grounded) {
    a.vel.y = JUMP_SPEED;
    a.grounded = false;
    res.jumped = true;
  }

  // ---- horizontal move with collision -----------------------------------
  // On the ground we may walk up a step; in the air the feet have to actually
  // clear an obstacle — ducking mid-air buys a little extra, which is exactly
  // how a crouch-jump gets you onto a crate.
  const allowance = a.grounded ? STEP_HEIGHT : a.crouching ? CROUCH_JUMP_CLEARANCE : 0.05;

  // If we somehow ended up overlapping geometry (landed half inside a crate,
  // got shoved by a team-mate, spawned badly), climb out before moving.
  if (!world.circleFree(a.pos.x, a.pos.z, a.pos.y, PLAYER_RADIUS, allowance)) {
    const fixed = world.depenetrate(a.pos.x, a.pos.z, a.pos.y, PLAYER_RADIUS, allowance);
    a.pos.x = fixed.x;
    a.pos.z = fixed.z;
  }

  const dx = a.vel.x * dt;
  const dz = a.vel.z * dt;
  const before = { x: a.pos.x, z: a.pos.z };
  const moved = world.moveCircle(a.pos, dx, dz, PLAYER_RADIUS, allowance);
  a.pos.x = moved.x;
  a.pos.z = moved.z;
  res.hitWall = moved.hitWall;
  if (moved.hitWall) {
    // Kill the velocity component into the wall so we don't keep grinding.
    if (Math.abs(a.pos.x - before.x) < Math.abs(dx) * 0.5) a.vel.x *= 0.25;
    if (Math.abs(a.pos.z - before.z) < Math.abs(dz) * 0.5) a.vel.z *= 0.25;
  }

  // ---- vertical ----------------------------------------------------------
  const support = world.supportHeight(a.pos.x, a.pos.z, a.pos.y, PLAYER_RADIUS * 0.85, allowance);
  if (a.grounded && support > a.pos.y && support - a.pos.y <= STEP_HEIGHT + 0.01) {
    a.pos.y = support; // step up
  } else {
    a.vel.y -= GRAVITY * dt;
    a.pos.y += a.vel.y * dt;
    if (a.pos.y <= support + 1e-3) {
      if (!a.grounded) {
        res.landed = true;
        res.landedHard = a.vel.y < -8.5;
      }
      a.pos.y = support;
      a.vel.y = 0;
      a.grounded = true;
    } else if (a.pos.y > support + 0.05) {
      a.grounded = false;
    }
  }

  // ---- odometer ----------------------------------------------------------
  const dist = Math.hypot(a.pos.x - before.x, a.pos.z - before.z);
  a.speed2D = dt > 0 ? dist / dt : 0;
  if (a.grounded && a.speed2D > 1.2 && !intent.walk) {
    a.footAccum += dist * (a.crouching ? 0.5 : 1);
    if (a.footAccum >= FOOTSTEP_DISTANCE) {
      a.footAccum = 0;
      res.footstep = true;
    }
  } else if (!a.grounded) {
    a.footAccum = 0;
  }
  return res;
}

function accelerate(vel: Vec3, wishX: number, wishZ: number, wishSpeed: number, accel: number, dt: number): void {
  const current = vel.x * wishX + vel.z * wishZ;
  const add = wishSpeed - current;
  if (add <= 0) return;
  const accelSpeed = Math.min(accel * dt * wishSpeed, add);
  vel.x += wishX * accelSpeed;
  vel.z += wishZ * accelSpeed;
}

/** Keep actors from occupying the same space (soft separation, run after movement). */
export function separateActors(actors: Actor[], world: World): void {
  const minDist = PLAYER_RADIUS * 2 + 0.06;
  for (let i = 0; i < actors.length; i++) {
    const a = actors[i];
    if (!a.alive) continue;
    for (let j = i + 1; j < actors.length; j++) {
      const b = actors[j];
      if (!b.alive) continue;
      if (Math.abs(a.pos.y - b.pos.y) > 1.4) continue;
      const dx = b.pos.x - a.pos.x;
      const dz = b.pos.z - a.pos.z;
      const d2 = dx * dx + dz * dz;
      if (d2 >= minDist * minDist || d2 < 1e-6) continue;
      const d = Math.sqrt(d2);
      const push = (minDist - d) * 0.5;
      const nx = dx / d;
      const nz = dz / d;
      pushActor(a, -nx * push, -nz * push, world);
      pushActor(b, nx * push, nz * push, world);
    }
  }
}

function pushActor(a: Actor, dx: number, dz: number, world: World): void {
  // Use the same clearance rule the actor moves with, so separation can never
  // shove somebody into a wall or into a crate they are standing next to.
  const allowance = a.grounded ? STEP_HEIGHT : a.crouching ? CROUCH_JUMP_CLEARANCE : 0.05;
  const moved = world.moveCircle(a.pos, dx, dz, PLAYER_RADIUS, allowance);
  a.pos.x = moved.x;
  a.pos.z = moved.z;
}

/** Explosion / falling damage helper. */
export function radiusDamage(dist: number, maxDamage: number, radius: number): number {
  if (dist >= radius) return 0;
  const t = clamp(1 - dist / radius, 0, 1);
  return maxDamage * t * t;
}

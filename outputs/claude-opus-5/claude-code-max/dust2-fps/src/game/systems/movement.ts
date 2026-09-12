/**
 * Movement / physics.
 *
 * Quake style ground acceleration + friction with a separate (weak) air control term,
 * cylinder-vs-world collision and ledge stepping. Players and bots run through this exact
 * same function, which is why a bot can never walk through a wall the player can't.
 */

import { Vec3, clamp, forwardFromYaw, rightFromYaw } from '../../core/math.ts';
import type { Actor } from '../actor.ts';
import {
  ACTOR_HEIGHT,
  ACTOR_RADIUS,
  AIR_ACCEL,
  BASE_SPEED,
  CROUCH_MULTIPLIER,
  GRAVITY,
  GROUND_ACCEL,
  GROUND_FRICTION,
  JUMP_SPEED,
  MAX_FALL_DAMAGE_SPEED,
  STEP_HEIGHT,
  WALK_MULTIPLIER,
} from '../constants.ts';
import type { SimContext } from '../context.ts';
import { findSector } from '../map/dust2.ts';

const forward = new Vec3();
const right = new Vec3();
const wish = new Vec3();

/** Distance between footstep sounds, metres. */
const STEP_DISTANCE = 2.1;

export function moveActor(ctx: SimContext, a: Actor, dt: number): void {
  if (!a.alive) return;

  const cmd = a.command;
  const def = a.weapon();

  // ---- crouch (blocked from standing up under geometry) -------------------
  if (cmd.crouch) {
    a.crouching = true;
  } else if (a.crouching) {
    const headroom = !ctx.collision.overlaps(a.pos.x, a.pos.y, a.pos.z, ACTOR_RADIUS * 0.9, ACTOR_HEIGHT);
    if (headroom) a.crouching = false;
  }

  // ---- desired velocity ---------------------------------------------------
  let maxSpeed = BASE_SPEED * def.moveSpeed;
  if (a.crouching) maxSpeed *= CROUCH_MULTIPLIER;
  else if (cmd.walk) maxSpeed *= WALK_MULTIPLIER;
  if (a.scopeLevel > 0) maxSpeed *= 0.42;
  if (a.plantProgress > 0 || a.defuseProgress > 0) maxSpeed = 0;

  forwardFromYaw(a.yaw, forward);
  rightFromYaw(a.yaw, right);
  wish.set(
    forward.x * cmd.forward + right.x * cmd.right,
    0,
    forward.z * cmd.forward + right.z * cmd.right,
  );
  const wishLen = wish.length2D();
  if (wishLen > 1e-4) wish.scale(1 / wishLen);
  const wishSpeed = Math.min(wishLen, 1) * maxSpeed;

  // ---- friction -----------------------------------------------------------
  if (a.onGround) {
    const speed = Math.hypot(a.vel.x, a.vel.z);
    if (speed > 0.01) {
      const control = Math.max(speed, 2.0);
      const drop = control * GROUND_FRICTION * dt;
      const scale = Math.max(0, speed - drop) / speed;
      a.vel.x *= scale;
      a.vel.z *= scale;
    } else {
      a.vel.x = 0;
      a.vel.z = 0;
    }
  }

  // ---- acceleration -------------------------------------------------------
  if (wishSpeed > 0.01) {
    const accel = a.onGround ? GROUND_ACCEL : AIR_ACCEL;
    const current = a.vel.x * wish.x + a.vel.z * wish.z;
    const add = wishSpeed - current;
    if (add > 0) {
      const accelSpeed = Math.min(accel * dt * wishSpeed, add);
      a.vel.x += wish.x * accelSpeed;
      a.vel.z += wish.z * accelSpeed;
    }
  }

  // ---- jump ---------------------------------------------------------------
  if (cmd.jump && a.onGround && !a.crouching) {
    a.vel.y = JUMP_SPEED;
    a.onGround = false;
    ctx.events.push({ type: 'jump', actorId: a.id, pos: a.pos.clone() });
  }

  // ---- gravity ------------------------------------------------------------
  if (!a.onGround) a.vel.y -= GRAVITY * dt;

  // ---- horizontal integration + collision ---------------------------------
  const prevX = a.pos.x;
  const prevZ = a.pos.z;
  a.pos.x += a.vel.x * dt;
  a.pos.z += a.vel.z * dt;
  ctx.collision.slide(a.pos, ACTOR_RADIUS, a.height);

  // Kill velocity into surfaces we were pushed out of, otherwise actors "stick".
  const movedX = a.pos.x - prevX;
  const movedZ = a.pos.z - prevZ;
  if (Math.abs(movedX) < Math.abs(a.vel.x * dt) * 0.5) a.vel.x *= 0.2;
  if (Math.abs(movedZ) < Math.abs(a.vel.z * dt) * 0.5) a.vel.z *= 0.2;

  // ---- vertical integration ----------------------------------------------
  const wasAirborne = !a.onGround;
  a.pos.y += a.vel.y * dt;

  const ground = ctx.collision.groundAt(a.pos.x, a.pos.z, a.pos.y, STEP_HEIGHT);
  if (a.pos.y <= ground + 0.02 && a.vel.y <= 0.001) {
    if (wasAirborne) {
      const impact = -a.vel.y;
      ctx.events.push({ type: 'land', actorId: a.id, pos: a.pos.clone(), hard: impact > 7 });
      if (impact > MAX_FALL_DAMAGE_SPEED) {
        const dmg = Math.round((impact - MAX_FALL_DAMAGE_SPEED) * 9);
        a.health -= dmg;
        if (a.health <= 0) a.health = 1; // Falling never kills in this prototype.
      }
    }
    a.pos.y = ground;
    a.vel.y = 0;
    a.onGround = true;
  } else {
    a.onGround = false;
    if (a.vel.y > 0) {
      const ceiling = ctx.collision.ceilingAt(a.pos.x, a.pos.z, a.pos.y);
      if (a.pos.y + a.height > ceiling) {
        a.pos.y = Math.max(ground, ceiling - a.height - 0.01);
        a.vel.y = 0;
      }
    }
  }

  // Safety net: if an actor ever ends up outside the floor plan, put it back.
  if (!findSector(a.pos.x, a.pos.z) || a.pos.y < -12) {
    const idx = ctx.nav.nearestWalkable(a.pos.x, a.pos.z, 30);
    if (idx >= 0) {
      a.pos.set(ctx.nav.cellX(idx % ctx.nav.cols), ctx.nav.height[idx], ctx.nav.cellZ(Math.floor(idx / ctx.nav.cols)));
      a.vel.set(0, 0, 0);
    }
  }

  // ---- bookkeeping for animation / audio ----------------------------------
  a.speed = Math.hypot(a.vel.x, a.vel.z);
  if (a.onGround && a.speed > 0.6) {
    const dist = Math.hypot(a.pos.x - prevX, a.pos.z - prevZ);
    a.stepPhase += dist * 2.6;
    a.footstepAccum += dist;
    const stride = cmd.walk || a.crouching ? STEP_DISTANCE * 1.35 : STEP_DISTANCE;
    if (a.footstepAccum >= stride) {
      a.footstepAccum = 0;
      ctx.events.push({
        type: 'footstep',
        actorId: a.id,
        pos: a.pos.clone(),
        loud: !cmd.walk && !a.crouching,
      });
    }
  } else if (a.speed < 0.2) {
    a.footstepAccum = Math.max(a.footstepAccum, STEP_DISTANCE * 0.55);
  }

  const sector = findSector(a.pos.x, a.pos.z);
  if (sector) a.areaLabel = sector.label;
}

/** Fraction of full speed the actor is currently moving at (used for spread). */
export function speedFraction(a: Actor): number {
  const max = BASE_SPEED * a.weapon().moveSpeed;
  return clamp(a.speed / max, 0, 1);
}

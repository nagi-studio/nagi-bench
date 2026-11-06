// Shared character locomotion for human and bots: acceleration/friction, walk & crouch,
// jumping, and kinematic collision through World.moveBody.

import type { Soldier } from '../entities/Soldier';
import type { World } from '../world/World';
import type { Intent } from '../types';
import { AIR_ACCEL, CROUCH_HEIGHT, CROUCH_MULT, GROUND_ACCEL, JUMP_SPEED, STAND_HEIGHT, WALK_MULT } from '../config';
import { lerp } from '../math';

export interface MoveResult {
  landed: number; // impact speed if just landed, 0 otherwise
  blocked: boolean;
}

export function applyMovement(s: Soldier, intent: Intent, world: World, dt: number, frozen: boolean, time: number): MoveResult {
  // crouch (can't stand up under a ceiling)
  let wantCrouch = intent.crouch;
  if (!wantCrouch && s.crouch > 0.01 && !world.hasClearance(s.pos.x, s.pos.z, s.radius, s.pos.y + CROUCH_HEIGHT - 0.05, s.pos.y + STAND_HEIGHT)) {
    wantCrouch = true;
  }
  s.crouching = wantCrouch;
  const target = wantCrouch ? 1 : 0;
  const rate = 7 * dt;
  s.crouch = s.crouch < target ? Math.min(target, s.crouch + rate) : Math.max(target, s.crouch - rate);
  s.setCrouchHeight();

  // wish direction in world space
  let f = intent.forward, r = intent.right;
  const len = Math.hypot(f, r);
  if (len > 1) {
    f /= len;
    r /= len;
  }
  const sy = Math.sin(s.yaw), cy = Math.cos(s.yaw);
  const wx = -sy * f + cy * r;
  const wz = -cy * f - sy * r;
  let speed = s.maxSpeed;
  if (intent.walk) speed *= WALK_MULT;
  speed *= lerp(1, CROUCH_MULT, s.crouch);
  if (time < s.slowUntil) speed *= 0.55;
  if (frozen) speed = 0;

  const tx = wx * speed, tz = wz * speed;
  const k = 1 - Math.exp(-(s.onGround ? GROUND_ACCEL : AIR_ACCEL) * dt);
  if (s.onGround || len > 0.01) {
    s.vel.x += (tx - s.vel.x) * k;
    s.vel.z += (tz - s.vel.z) * k;
  }

  if (intent.jump && s.onGround && !frozen) {
    s.vel.y = JUMP_SPEED;
    s.onGround = false;
  }

  const wasAir = !s.onGround;
  const vy = s.vel.y;
  const blocked = world.moveBody(s, dt);
  const landed = wasAir && s.onGround ? -vy : 0;
  return { landed, blocked };
}

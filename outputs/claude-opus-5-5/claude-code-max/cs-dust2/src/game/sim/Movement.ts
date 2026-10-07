import { PHYS } from '../core/config';
import { lerp, moveTowards } from '../core/math';
import type { Actor } from './Actor';
import type { World } from './World';

/**
 * Source-style ground/air movement: friction, acceleration towards a wish velocity, air strafing,
 * crouch with head-room checks, jump on fresh press, footstep emission. Collision is resolved by
 * CollisionWorld.moveHull.
 */
export function updateMovement(world: World, a: Actor, dt: number, frozen: boolean): void {
  const inp = a.input;

  // ---- crouch
  const wantCrouch = inp.crouch && !frozen;
  let target = wantCrouch ? 1 : 0;
  if (target < a.crouchAmt) {
    const r = a.radius - 0.01;
    const blocked = world.collision.overlapsBox(
      a.pos.x - r,
      a.pos.y + a.height,
      a.pos.z - r,
      a.pos.x + r,
      a.pos.y + PHYS.height,
      a.pos.z + r,
    );
    if (blocked) target = a.crouchAmt;
  }
  a.crouchAmt = moveTowards(a.crouchAmt, target, dt * 6);
  a.height = lerp(PHYS.height, PHYS.crouchHeight, a.crouchAmt);

  // ---- wish direction
  let wx = 0;
  let wz = 0;
  if (!frozen && !a.rooted) {
    const sy = Math.sin(a.yaw);
    const cy = Math.cos(a.yaw);
    wx = -sy * inp.forward + cy * inp.right;
    wz = -cy * inp.forward - sy * inp.right;
  }
  let wishLen = Math.hypot(wx, wz);
  if (wishLen > 1e-4) {
    wx /= wishLen;
    wz /= wishLen;
  }
  wishLen = Math.min(1, wishLen);
  const wishSpeed = a.maxSpeed() * wishLen;

  // ---- jump (fresh press only, no auto bunny hop)
  if (inp.jump && !a.jumpHeld && a.onGround && !frozen && !a.rooted) {
    a.vel.y = PHYS.jumpSpeed;
    a.onGround = false;
    world.events.emit('jump', { actor: a });
  }
  a.jumpHeld = inp.jump;

  if (a.onGround) {
    const speed = Math.hypot(a.vel.x, a.vel.z);
    if (speed > 1e-4) {
      const control = Math.max(speed, PHYS.stopSpeed);
      const drop = control * PHYS.friction * dt * (a.rooted ? 3 : 1);
      const ns = Math.max(0, speed - drop) / speed;
      a.vel.x *= ns;
      a.vel.z *= ns;
    }
    accelerate(a, wx, wz, wishSpeed, PHYS.accelerate, dt);
  } else {
    const capped = Math.min(wishSpeed, PHYS.airWishCap);
    const current = a.vel.x * wx + a.vel.z * wz;
    const add = capped - current;
    if (add > 0) {
      const acc = Math.min(PHYS.airAccelerate * wishSpeed * dt, add);
      a.vel.x += acc * wx;
      a.vel.z += acc * wz;
    }
    a.vel.y -= PHYS.gravity * dt;
  }

  // ---- integrate against geometry
  const landSpeed = world.collision.moveHull(a, dt);
  if (landSpeed > 2.5) world.events.emit('land', { actor: a, speed: landSpeed });

  // ---- footsteps (running only; walking/crouching is silent like CS)
  if (a.onGround) {
    const hs = Math.hypot(a.vel.x, a.vel.z);
    if (hs > 3.4 && a.crouchAmt < 0.5) {
      a.stepAccum += hs * dt;
      if (a.stepAccum > 2.05) {
        a.stepAccum = 0;
        world.footstep(a);
      }
    } else if (a.stepAccum > 1.4) {
      a.stepAccum = 1.4;
    }
  }

  if (a.pos.y < -25) world.killActor(a, null, 'fall', false, a.vel);
}

function accelerate(a: Actor, wx: number, wz: number, wishSpeed: number, accel: number, dt: number): void {
  if (wishSpeed <= 0) return;
  const current = a.vel.x * wx + a.vel.z * wz;
  const add = wishSpeed - current;
  if (add <= 0) return;
  const acc = Math.min(accel * wishSpeed * dt, add);
  a.vel.x += acc * wx;
  a.vel.z += acc * wz;
}

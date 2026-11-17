import type { Actor, Point } from './types';
import type { World } from './world';
import { circleBox } from './math';

export const PLAYER_RADIUS = .32;
export const EYE_HEIGHT = 1.69;
export function moveCharacter(a: Actor, velocity: Point, dt: number, world: World) {
  const oldY = a.y;
  // Separate axes produce wall sliding; substeps prevent tunnelling at low frame rates.
  const steps = Math.max(1, Math.ceil(Math.hypot(velocity.x, velocity.z) * dt / .18));
  const dx = velocity.x * dt / steps, dz = velocity.z * dt / steps;
  for (let i = 0; i < steps; i++) {
    if (world.clear(a.x + dx, a.z, PLAYER_RADIUS, a.y + .08)) a.x += dx;
    if (world.clear(a.x, a.z + dz, PLAYER_RADIUS, a.y + .08)) a.z += dz;
  }
  const floor = world.heightAt(a.x, a.z);
  if (a.grounded && Math.abs(a.y - floor) < .4) { a.y = floor; a.vy = 0; }
  else {
    a.grounded = false;
    a.vy -= 18 * dt; a.y += a.vy * dt;
    for (const box of world.colliders) {
      if (!circleBox(a.x, a.z, PLAYER_RADIUS * .9, box)) continue;
      if (a.vy <= 0 && oldY >= box.maxY - .08 && a.y <= box.maxY) { a.y = box.maxY; a.vy = 0; a.grounded = true; }
      if (a.vy > 0 && oldY + 1.9 <= box.minY + .05 && a.y + 1.9 > box.minY) { a.y = box.minY - 1.9; a.vy = 0; }
    }
    if (a.y <= floor) { a.y = floor; a.vy = 0; a.grounded = true; }
  }
  a.moving = Math.hypot(velocity.x, velocity.z) > .3 && Math.hypot(a.x - a.prevX, a.z - a.prevZ) > .001;
  if (a.moving && a.grounded) { a.walk += Math.hypot(velocity.x, velocity.z) * dt * 2.2; a.step += Math.hypot(velocity.x, velocity.z) * dt; }
}

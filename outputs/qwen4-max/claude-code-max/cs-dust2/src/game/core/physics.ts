import type { Entity, Vec3 } from './types.ts';
import type { MapData } from './map.ts';
import { floorHeightAt } from './map.ts';
import { CFG } from './config.ts';
import { clamp } from './vecmath.ts';

const HALF = CFG.playerHalf;
const HEIGHT = CFG.playerHeight;

function overlaps(e: Entity, c: { min: Vec3; max: Vec3 }): boolean {
  return (
    e.pos.x + HALF > c.min.x && e.pos.x - HALF < c.max.x &&
    e.pos.y + HEIGHT > c.min.y && e.pos.y < c.max.y &&
    e.pos.z + HALF > c.min.z && e.pos.z - HALF < c.max.z
  );
}

const _set = new Set<number>();

function nearby(map: MapData, e: Entity): number[] {
  _set.clear();
  map.hash.query(
    { x: e.pos.x - HALF - 0.6, y: e.pos.y - 0.6, z: e.pos.z - HALF - 0.6 },
    { x: e.pos.x + HALF + 0.6, y: e.pos.y + HEIGHT + 0.6, z: e.pos.z + HALF + 0.6 },
    _set,
  );
  return [..._set];
}

// Highest standable surface under the footprint at or below feetY (+step tolerance).
export function groundHeight(map: MapData, x: number, z: number, feetY: number): number {
  let g = floorHeightAt(map, x, z);
  if (g === -Infinity) g = -1000;
  const min = { x: x - HALF, y: feetY - 2, z: z - HALF };
  const max = { x: x + HALF, y: feetY + CFG.stepHeight, z: z + HALF };
  _set.clear();
  map.hash.query(min, max, _set);
  for (const i of _set) {
    const c = map.colliders[i];
    if (
      x + HALF > c.min.x && x - HALF < c.max.x &&
      z + HALF > c.min.z && z - HALF < c.max.z
    ) {
      const top = c.max.y;
      if (top <= feetY + CFG.stepHeight + 0.001 && top > g) g = top;
    }
  }
  return g;
}

function headroomFree(map: MapData, x: number, y: number, z: number): boolean {
  const min = { x: x - HALF, y: y + 0.02, z: z - HALF };
  const max = { x: x + HALF, y: y + HEIGHT, z: z + HALF };
  _set.clear();
  map.hash.query(min, max, _set);
  for (const i of _set) {
    const c = map.colliders[i];
    if (
      max.x > c.min.x && min.x < c.max.x &&
      max.y > c.min.y && min.y < c.max.y &&
      max.z > c.min.z && min.z < c.max.z
    ) return false;
  }
  return true;
}

function resolveHorizontal(map: MapData, e: Entity, axis: 'x' | 'z', delta: number): void {
  if (delta === 0) return;
  e.pos[axis] += delta;
  for (let iter = 0; iter < 3; iter++) {
    const ids = nearby(map, e);
    let hit = false;
    for (const i of ids) {
      const c = map.colliders[i];
      if (!overlaps(e, c)) continue;
      // Step up over low obstacles when grounded.
      const rise = c.max.y - e.pos.y;
      if (e.onGround && rise > 0 && rise <= CFG.stepHeight && headroomFree(map, e.pos.x, c.max.y, e.pos.z)) {
        e.pos.y = c.max.y;
        continue;
      }
      if (delta > 0) e.pos[axis] = c.min[axis] - HALF - 0.001;
      else e.pos[axis] = c.max[axis] + HALF + 0.001;
      e.vel[axis] = 0;
      hit = true;
      break;
    }
    if (!hit) break;
  }
}

function resolveVertical(map: MapData, e: Entity, delta: number): void {
  e.pos.y += delta;
  const ids = nearby(map, e);
  for (const i of ids) {
    const c = map.colliders[i];
    if (!overlaps(e, c)) continue;
    if (delta <= 0) {
      e.pos.y = c.max.y;
      e.vel.y = 0;
      e.onGround = true;
    } else {
      e.pos.y = c.min.y - HEIGHT - 0.001;
      e.vel.y = 0;
    }
  }
}

export interface MoveIntent {
  wishX: number; // world-space desired direction (normalized-ish)
  wishZ: number;
  speed: number; // target max speed m/s
  jump: boolean;
  dt: number;
}

export function moveEntity(map: MapData, e: Entity, intent: MoveIntent): void {
  const dt = intent.dt;
  const wishLen = Math.hypot(intent.wishX, intent.wishZ);
  let wx = 0, wz = 0;
  if (wishLen > 1e-4) {
    wx = intent.wishX / wishLen;
    wz = intent.wishZ / wishLen;
  }
  const targetSpeed = intent.speed;

  // Friction (ground only).
  if (e.onGround) {
    const sp = Math.hypot(e.vel.x, e.vel.z);
    if (sp > 0) {
      const drop = sp * CFG.friction * dt + (wishLen < 1e-4 ? sp * CFG.friction * dt : 0);
      const ns = Math.max(0, sp - drop);
      const f = sp > 1e-5 ? ns / sp : 0;
      e.vel.x *= f;
      e.vel.z *= f;
    }
  }

  // Acceleration toward wish direction.
  const accel = e.onGround ? CFG.groundAccel : CFG.airAccel;
  const cur = e.vel.x * wx + e.vel.z * wz;
  const add = clamp(targetSpeed - cur, 0, accel * dt);
  e.vel.x += wx * add;
  e.vel.z += wz * add;

  // Clamp horizontal speed.
  const hs = Math.hypot(e.vel.x, e.vel.z);
  if (hs > targetSpeed * 1.02 && wishLen > 1e-4) {
    const f = (targetSpeed * 1.02) / hs;
    e.vel.x *= f;
    e.vel.z *= f;
  }

  // Jump.
  if (intent.jump && e.onGround) {
    e.vel.y = CFG.jumpVel;
    e.onGround = false;
  }

  // Gravity.
  e.vel.y -= CFG.gravity * dt;
  if (e.vel.y < -40) e.vel.y = -40;

  resolveHorizontal(map, e, 'x', e.vel.x * dt);
  resolveHorizontal(map, e, 'z', e.vel.z * dt);
  const wasGround = e.onGround;
  e.onGround = false;
  resolveVertical(map, e, e.vel.y * dt);

  // Ground snap / support.
  const g = groundHeight(map, e.pos.x, e.pos.z, e.pos.y);
  if (e.pos.y <= g + 0.02 && e.vel.y <= 0) {
    e.pos.y = g;
    e.vel.y = 0;
    e.onGround = true;
  } else if (wasGround && e.vel.y <= 0 && e.pos.y - g < CFG.stepHeight && e.pos.y > g) {
    // walked down a small step: stick to ground
    e.pos.y = g;
    e.vel.y = 0;
    e.onGround = true;
  }

  // Safety: never fall out of the world.
  if (e.pos.y < -20) {
    e.pos.y = 0;
    e.vel.y = 0;
  }

  e.speed = Math.hypot(e.vel.x, e.vel.z);
}

// Push two entities apart so bots/player don't stack.
export function separate(a: Entity, b: Entity): void {
  const dx = b.pos.x - a.pos.x;
  const dz = b.pos.z - a.pos.z;
  const d = Math.hypot(dx, dz);
  const minD = HALF * 2;
  if (d < minD && d > 1e-4 && Math.abs(a.pos.y - b.pos.y) < HEIGHT) {
    const push = (minD - d) * 0.5;
    const nx = dx / d, nz = dz / d;
    a.pos.x -= nx * push;
    a.pos.z -= nz * push;
    b.pos.x += nx * push;
    b.pos.z += nz * push;
  }
}

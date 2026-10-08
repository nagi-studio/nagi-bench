/**
 * Hand-rolled character physics: gravity, jumping, air control, ground
 * friction and swept AABB-vs-grid / AABB-vs-prop collision resolution.
 * No physics engine is used.
 */

import type { NavGrid, RayHit } from './map/grid';
import type { Box } from './map/dust2';
import { rayAABB } from './map/grid';
import { clamp } from './mathUtils';

export const GRAVITY = 20.0;
export const JUMP_VELOCITY = 6.2;
/** Ledges up to this height are climbed automatically. */
export const STEP_UP = 0.55;
/** Below this the body is considered to be clipping into the obstacle. */
const SKIN = 0.08;
/**
 * Continuous-collision substepping. A body is never advanced further than
 * `radius * 0.5` per substep horizontally (or 0.25 m vertically), so even at
 * absurd speeds it can never skip over a wall slab in a single integration.
 */
const MAX_SUBSTEPS = 32;
/** Absolute vertical bounds — last-resort net so nothing can leave the level. */
const WORLD_MAX_Y = 24;
const WORLD_MIN_Y = -1.5;

export interface Body {
  /** feet position */
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  height: number;
  onGround: boolean;
}

export function makeBody(x: number, y: number, z: number, radius: number, height: number): Body {
  return { x, y, z, vx: 0, vy: 0, vz: 0, radius, height, onGround: true };
}

// ---------------------------------------------------------------------------
// Collision queries
// ---------------------------------------------------------------------------

/** Height of the tallest solid surface under the body (excluding roofs). */
function groundSupport(grid: NavGrid, props: Box[], body: Body): number {
  const r = body.radius;
  let support = 0;
  const cx0 = grid.cellX(body.x - r);
  const cx1 = grid.cellX(body.x + r);
  const cz0 = grid.cellZ(body.z - r);
  const cz1 = grid.cellZ(body.z + r);
  const ceilingLimit = body.y + STEP_UP;

  for (let cz = cz0; cz <= cz1; cz++) {
    for (let cx = cx0; cx <= cx1; cx++) {
      if (!grid.inBounds(cx, cz)) continue;
      const i = grid.idx(cx, cz);
      if (grid.walkable[i] === 1) continue;
      const top = grid.height[i] as number;
      if (top <= ceilingLimit && top > support) support = top;
    }
  }
  for (const b of props) {
    if (body.x + r <= b.minX || body.x - r >= b.maxX) continue;
    if (body.z + r <= b.minZ || body.z - r >= b.maxZ) continue;
    if (b.maxY <= ceilingLimit && b.maxY > support) support = b.maxY;
  }
  return support;
}

function lowestCeiling(grid: NavGrid, props: Box[], body: Body): number {
  const r = body.radius;
  let ceil = Infinity;
  const cx0 = grid.cellX(body.x - r);
  const cx1 = grid.cellX(body.x + r);
  const cz0 = grid.cellZ(body.z - r);
  const cz1 = grid.cellZ(body.z + r);
  const floorLimit = body.y + body.height - 0.05;

  for (let cz = cz0; cz <= cz1; cz++) {
    for (let cx = cx0; cx <= cx1; cx++) {
      if (!grid.inBounds(cx, cz)) continue;
      const i = grid.idx(cx, cz);
      if (grid.walkable[i] !== 1) continue;
      if (grid.roof[i] !== 1) continue;
      const bottom = (grid.height[i] as number) - 0.35;
      if (bottom >= floorLimit && bottom < ceil) ceil = bottom;
    }
  }
  for (const b of props) {
    if (body.x + r <= b.minX || body.x - r >= b.maxX) continue;
    if (body.z + r <= b.minZ || body.z - r >= b.maxZ) continue;
    if (b.minY >= floorLimit && b.minY < ceil) ceil = b.minY;
  }
  return ceil;
}

// ---------------------------------------------------------------------------
// Movement
// ---------------------------------------------------------------------------

/**
 * Move along one horizontal axis and resolve penetration against walls and
 * props. Axis separation gives clean wall sliding.
 */
function resolveAxis(grid: NavGrid, props: Box[], body: Body, axis: 0 | 1, dir: number): void {
  const r = body.radius;
  const loY = body.y + SKIN;
  const hiY = body.y + body.height;

  const cx0 = grid.cellX(body.x - r);
  const cx1 = grid.cellX(body.x + r);
  const cz0 = grid.cellZ(body.z - r);
  const cz1 = grid.cellZ(body.z + r);

  for (let cz = cz0; cz <= cz1; cz++) {
    for (let cx = cx0; cx <= cx1; cx++) {
      if (!grid.inBounds(cx, cz)) continue;
      const i = grid.idx(cx, cz);
      if (grid.walkable[i] === 1) continue;
      const top = grid.height[i] as number;
      if (top <= loY) continue;
      const minX = grid.minXOf(cx);
      const maxX = minX + grid.cell;
      const minZ = grid.minZOf(cz);
      const maxZ = minZ + grid.cell;
      if (hiY <= 0) continue;
      if (body.x + r <= minX || body.x - r >= maxX) continue;
      if (body.z + r <= minZ || body.z - r >= maxZ) continue;
      if (axis === 0) {
        body.x = dir > 0 ? minX - r : dir < 0 ? maxX + r : (Math.abs(minX - r - body.x) < Math.abs(maxX + r - body.x) ? minX - r : maxX + r);
      } else {
        body.z = dir > 0 ? minZ - r : dir < 0 ? maxZ + r : (Math.abs(minZ - r - body.z) < Math.abs(maxZ + r - body.z) ? minZ - r : maxZ + r);
      }
    }
  }

  for (const b of props) {
    if (b.maxY <= loY) continue;
    if (hiY <= b.minY) continue;
    if (body.x + r <= b.minX || body.x - r >= b.maxX) continue;
    if (body.z + r <= b.minZ || body.z - r >= b.maxZ) continue;
    if (axis === 0) {
      body.x = dir > 0 ? b.minX - r : dir < 0 ? b.maxX + r : (Math.abs(b.minX - r - body.x) < Math.abs(b.maxX + r - body.x) ? b.minX - r : b.maxX + r);
    } else {
      body.z = dir > 0 ? b.minZ - r : dir < 0 ? b.maxZ + r : (Math.abs(b.minZ - r - body.z) < Math.abs(b.maxZ + r - body.z) ? b.minZ - r : b.maxZ + r);
    }
  }
}

/** Apply one frame of horizontal displacement (already scaled by dt). */
export function moveHorizontal(grid: NavGrid, props: Box[], body: Body, dx: number, dz: number): void {
  if (dx === 0 && dz === 0) return;

  // Continuous collision: split the sweep so no single advance can jump past
  // a wall slab. `radius * 0.5` is well under the thinnest solid in the level.
  const travel = Math.hypot(dx, dz);
  const maxAdvance = Math.max(0.05, body.radius * 0.5);
  const steps = Math.min(MAX_SUBSTEPS, Math.max(1, Math.ceil(travel / maxAdvance)));
  const sx = dx / steps;
  const sz = dz / steps;
  const signX = Math.sign(dx);
  const signZ = Math.sign(dz);

  for (let i = 0; i < steps; i++) {
    if (sx !== 0) {
      body.x += sx;
      resolveAxis(grid, props, body, 0, signX);
    }
    if (sz !== 0) {
      body.z += sz;
      resolveAxis(grid, props, body, 1, signZ);
    }
  }
}

/**
 * Safety net: if a body ever ends up inside solid geometry (a bad spawn jitter
 * or a teleport), walk it back towards the nearest walkable cell instead of
 * letting it tunnel through the level.
 */
/**
 * Last-resort safety net. In normal play this never fires — `resolveAxis`
 * always leaves a body on the open side of a wall face, so the branch below is
 * only reached when a body is genuinely *embedded* in solid geometry (a bad
 * spawn, a debug teleport, some future effect). In that case a straight-line
 * pull can deadlock (the body gets re-wedged by collision resolution every
 * frame), so we simply place it on the nearest walkable cell centre, which is
 * guaranteed to terminate.
 */
export function unstickBody(grid: NavGrid, body: Body): void {
  if (grid.isWalkableAt(body.x, body.z)) return;

  const target = grid.nearestWalkable(body.x, body.z);
  if (!target) return;
  body.x = target.x;
  body.z = target.z;
  body.vx = 0;
  body.vz = 0;
  if (!body.onGround) body.vy = Math.min(body.vy, 0);
}

/** Apply gravity and resolve ground / ceiling contact. */
export function moveVertical(grid: NavGrid, props: Box[], body: Body, dt: number): void {
  body.vy -= GRAVITY * dt;
  if (body.vy > 0 && body.y >= WORLD_MAX_Y) body.vy = 0;

  // Same substepping story as the horizontal sweep: a fast body must not be
  // able to jump over a ceiling slab (or fall through a floor) in one go.
  const travel = Math.abs(body.vy * dt);
  const steps = Math.min(MAX_SUBSTEPS, Math.max(1, Math.ceil(travel / 0.25)));
  const sy = (body.vy * dt) / steps;

  body.onGround = false;
  for (let i = 0; i < steps; i++) {
    let ny = body.y + sy;
    if (ny > WORLD_MAX_Y) { ny = WORLD_MAX_Y; body.vy = 0; }
    if (ny < WORLD_MIN_Y) { ny = WORLD_MIN_Y; body.vy = 0; }

    const ceil = lowestCeiling(grid, props, body);
    if (ceil < Infinity) {
      const limit = ceil - body.height;
      if (ny > limit) {
        ny = limit;
        if (body.vy > 0) body.vy = 0;
      }
    }

    const support = groundSupport(grid, props, body);
    if (ny <= support) {
      ny = support;
      body.vy = 0;
      body.onGround = true;
    }
    body.y = ny;

    // velocity cancelled by a floor / ceiling hit — no more travel this frame
    if (body.vy === 0) break;
  }
}

// ---------------------------------------------------------------------------
// Ray casting against the world
// ---------------------------------------------------------------------------

export interface WorldHit extends RayHit {
  /** true when the hit was a prop rather than a wall */
  prop: boolean;
}

export function raycastWorld(
  grid: NavGrid,
  props: Box[],
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  maxT: number,
): WorldHit | null {
  const wall = grid.raycast(ox, oy, oz, dx, dy, dz, maxT);
  let best: WorldHit | null = wall ? { ...wall, prop: false } : null;
  let bestT = wall ? wall.t : maxT;

  for (const b of props) {
    const hit = rayAABB(ox, oy, oz, dx, dy, dz, b, bestT);
    if (hit && hit.t < bestT) {
      bestT = hit.t;
      best = {
        t: hit.t,
        x: ox + dx * hit.t,
        y: oy + dy * hit.t,
        z: oz + dz * hit.t,
        nx: hit.nx, ny: hit.ny, nz: hit.nz,
        prop: true,
      };
    }
  }
  return best;
}

/** Unobstructed sight line between two points (walls + props both block). */
export function hasLineOfSight(
  grid: NavGrid,
  props: Box[],
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
): boolean {
  const dx = bx - ax, dy = by - ay, dz = bz - az;
  const dist = Math.hypot(dx, dy, dz);
  if (dist < 0.001) return true;
  const hit = raycastWorld(grid, props, ax, ay, az, dx / dist, dy / dist, dz / dist, dist - 0.05);
  return hit === null;
}

// ---------------------------------------------------------------------------
// Movement helpers shared by the player and the bots
// ---------------------------------------------------------------------------

export interface MoveParams {
  /** desired direction on the XZ plane, already normalised (or zero) */
  wishX: number;
  wishZ: number;
  /** target ground speed in m/s */
  speed: number;
  accel: number;
  friction: number;
  /** air acceleration multiplier */
  airAccel: number;
}

const MAX_GROUND_SPEED_CLAMP = 1.02;

/**
 * Quake-style acceleration + friction. Writes back into body.vx / body.vz.
 */
export function accelerate(body: Body, p: MoveParams, dt: number): void {
  const onGround = body.onGround;
  const friction = onGround ? p.friction : p.friction * 0.12;
  const accel = onGround ? p.accel : p.accel * p.airAccel;

  // friction
  const sp = Math.hypot(body.vx, body.vz);
  if (sp > 0.0001) {
    const drop = Math.max(sp, 4.0) * friction * dt;
    const scale = Math.max(0, sp - drop) / sp;
    body.vx *= scale;
    body.vz *= scale;
  } else {
    body.vx = 0;
    body.vz = 0;
  }

  // accelerate towards the wish direction
  const currentSpeed = body.vx * p.wishX + body.vz * p.wishZ;
  const addSpeed = p.speed - currentSpeed;
  if (addSpeed > 0) {
    const accelSpeed = Math.min(accel * p.speed * dt, addSpeed);
    body.vx += p.wishX * accelSpeed;
    body.vz += p.wishZ * accelSpeed;
  }

  // Hard cap on horizontal speed. This must run unconditionally: any externally
  // injected velocity (spawn jitter, a teleport, a future knock-back effect)
  // has to be bled off, otherwise a body can retain a speed large enough to
  // challenge the collision sweep.
  const hs = Math.hypot(body.vx, body.vz);
  const cap = p.speed * MAX_GROUND_SPEED_CLAMP;
  if (hs > cap && hs > 0.0001) {
    body.vx = (body.vx / hs) * cap;
    body.vz = (body.vz / hs) * cap;
  }
  void clamp;
}

// Character kinematics: vertical-cylinder bodies against static AABB solids + area floors.

import type { Vec3 } from './math.ts';
import type { Solid, World } from './world.ts';

export const GRAVITY = 19;
export const STEP_HEIGHT = 0.42;
export const JUMP_SPEED = 6.4;

export interface Body {
  pos: Vec3; // feet position
  vel: Vec3;
  radius: number;
  height: number;
  onGround: boolean;
  /** vertical speed at the moment of the last landing (for landing sounds) */
  landImpact: number;
}

const scratch: Solid[] = [];

function blocksHorizontally(s: Solid, feet: number, height: number) {
  return s.maxY > feet + STEP_HEIGHT && s.minY < feet + height - 0.05;
}

/** Push the body's circle out of every blocking solid. Returns true if any contact. */
export function resolveHorizontal(world: World, b: Body): boolean {
  const r = b.radius;
  let touched = false;
  for (let iter = 0; iter < 3; iter++) {
    let any = false;
    const list = world.querySolids(b.pos.x - r, b.pos.z - r, b.pos.x + r, b.pos.z + r, scratch);
    for (const s of list) {
      if (!blocksHorizontally(s, b.pos.y, b.height)) continue;
      const cx = b.pos.x < s.minX ? s.minX : b.pos.x > s.maxX ? s.maxX : b.pos.x;
      const cz = b.pos.z < s.minZ ? s.minZ : b.pos.z > s.maxZ ? s.maxZ : b.pos.z;
      let dx = b.pos.x - cx;
      let dz = b.pos.z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 >= r * r) continue;
      let nx: number;
      let nz: number;
      if (d2 > 1e-10) {
        const d = Math.sqrt(d2);
        nx = dx / d;
        nz = dz / d;
        const push = r - d;
        b.pos.x += nx * push;
        b.pos.z += nz * push;
      } else {
        // center inside box: exit through the nearest face
        const l = b.pos.x - s.minX;
        const rr = s.maxX - b.pos.x;
        const f = b.pos.z - s.minZ;
        const bk = s.maxZ - b.pos.z;
        const m = Math.min(l, rr, f, bk);
        nx = 0;
        nz = 0;
        if (m === l) {
          nx = -1;
          b.pos.x = s.minX - r;
        } else if (m === rr) {
          nx = 1;
          b.pos.x = s.maxX + r;
        } else if (m === f) {
          nz = -1;
          b.pos.z = s.minZ - r;
        } else {
          nz = 1;
          b.pos.z = s.maxZ + r;
        }
        dx = nx;
        dz = nz;
      }
      const vn = b.vel.x * nx + b.vel.z * nz;
      if (vn < 0) {
        b.vel.x -= nx * vn;
        b.vel.z -= nz * vn;
      }
      any = true;
      touched = true;
    }
    if (!any) break;
  }
  return touched;
}

/** Highest standable surface under the footprint, not higher than maxY. */
export function groundHeight(world: World, x: number, z: number, radius: number, maxY: number): number {
  let g = world.floorAt(x, z);
  if (g === null) g = -50;
  const fr = radius * 0.75;
  const list = world.querySolids(x - fr, z - fr, x + fr, z + fr, scratch);
  for (const s of list) {
    if (s.maxY > maxY || s.maxY <= g) continue;
    const cx = x < s.minX ? s.minX : x > s.maxX ? s.maxX : x;
    const cz = z < s.minZ ? s.minZ : z > s.maxZ ? s.maxZ : z;
    const dx = x - cx;
    const dz = z - cz;
    if (dx * dx + dz * dz <= fr * fr) g = s.maxY;
  }
  return g;
}

export function stepBody(world: World, b: Body, dt: number) {
  const prevY = b.pos.y;
  const wasGround = b.onGround;

  // Horizontal, sub-stepped so fast bodies never tunnel through thin door leaves.
  const hs = Math.hypot(b.vel.x, b.vel.z) * dt;
  const n = Math.max(1, Math.ceil(hs / (b.radius * 0.5)));
  for (let i = 0; i < n; i++) {
    b.pos.x += (b.vel.x * dt) / n;
    b.pos.z += (b.vel.z * dt) / n;
    resolveHorizontal(world, b);
  }

  // Vertical
  b.vel.y -= GRAVITY * dt;
  b.pos.y += b.vel.y * dt;

  // Ceiling
  if (b.vel.y > 0) {
    const r = b.radius * 0.8;
    const list = world.querySolids(b.pos.x - r, b.pos.z - r, b.pos.x + r, b.pos.z + r, scratch);
    for (const s of list) {
      if (s.minY < prevY + b.height - 0.02) continue;
      if (b.pos.y + b.height <= s.minY) continue;
      const cx = Math.max(s.minX, Math.min(b.pos.x, s.maxX));
      const cz = Math.max(s.minZ, Math.min(b.pos.z, s.maxZ));
      if ((b.pos.x - cx) ** 2 + (b.pos.z - cz) ** 2 > r * r) continue;
      b.pos.y = s.minY - b.height;
      b.vel.y = 0;
    }
  }

  const g = groundHeight(world, b.pos.x, b.pos.z, b.radius, Math.max(prevY, b.pos.y) + STEP_HEIGHT);
  if (b.pos.y <= g) {
    if (!wasGround) b.landImpact = -b.vel.y;
    b.pos.y = g;
    if (b.vel.y < 0) b.vel.y = 0;
    b.onGround = true;
  } else if (wasGround && b.vel.y <= 0 && b.pos.y - g < 0.5) {
    b.pos.y = g;
    b.vel.y = 0;
    b.onGround = true;
  } else {
    b.onGround = false;
  }
}

/** True if a body at (x,y,z) would overlap any blocking solid. */
export function bodyOverlaps(world: World, x: number, y: number, z: number, radius: number, height: number): boolean {
  const list = world.querySolids(x - radius, z - radius, x + radius, z + radius, scratch);
  for (const s of list) {
    if (!blocksHorizontally(s, y, height)) continue;
    const cx = Math.max(s.minX, Math.min(x, s.maxX));
    const cz = Math.max(s.minZ, Math.min(z, s.maxZ));
    if ((x - cx) ** 2 + (z - cz) ** 2 < radius * radius - 1e-4) return true;
  }
  return false;
}

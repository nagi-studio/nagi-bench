import { AABB, RampBox, Vec3 } from './types';

export const PLAYER_RADIUS = 0.42;
export const PLAYER_HEIGHT = 1.8;
export const PLAYER_CROUCH_HEIGHT = 1.25;
export const EYE_HEIGHT_STAND = 1.62;
export const EYE_HEIGHT_CROUCH = 1.12;
export const GRAVITY = 21.5;
export const JUMP_VELOCITY = 7.4;
export const STEP_HEIGHT = 0.52;

export interface PhysicsBody {
  pos: Vec3;
  vel: Vec3;
  onGround: boolean;
  crouching: boolean;
}

export interface RayHit {
  distance: number;
  point: Vec3;
  normal: Vec3;
  material?: AABB['material'];
}

export function getRampHeightAt(ramp: RampBox, x: number, z: number): number {
  let t = 0;
  if (ramp.axis === '+x') {
    t = (x - ramp.minX) / Math.max(0.001, ramp.maxX - ramp.minX);
  } else if (ramp.axis === '-x') {
    t = (ramp.maxX - x) / Math.max(0.001, ramp.maxX - ramp.minX);
  } else if (ramp.axis === '+z') {
    t = (z - ramp.minZ) / Math.max(0.001, ramp.maxZ - ramp.minZ);
  } else {
    t = (ramp.maxZ - z) / Math.max(0.001, ramp.maxZ - ramp.minZ);
  }
  t = Math.max(0, Math.min(1, t));
  return ramp.yStart + (ramp.yEnd - ramp.yStart) * t;
}

/**
 * Returns the highest walkable floor Y at (x, z) reachable from currentY (within step-up margin).
 */
export function getSupportFloorY(
  x: number,
  z: number,
  currentY: number,
  radius: number,
  colliders: AABB[],
  ramps: RampBox[]
): number {
  let bestY = -100;
  const maxStepY = currentY + STEP_HEIGHT;

  // Check solid AABB tops
  for (let i = 0; i < colliders.length; i++) {
    const b = colliders[i];
    if (
      x + radius > b.minX &&
      x - radius < b.maxX &&
      z + radius > b.minZ &&
      z - radius < b.maxZ
    ) {
      if (b.maxY <= maxStepY && b.maxY > bestY) {
        bestY = b.maxY;
      }
    }
  }

  // Check ramps (slightly padded horizontally by radius*0.6 for seamless entry/exit)
  const pad = radius * 0.65;
  for (let i = 0; i < ramps.length; i++) {
    const r = ramps[i];
    if (
      x >= r.minX - pad &&
      x <= r.maxX + pad &&
      z >= r.minZ - pad &&
      z <= r.maxZ + pad
    ) {
      const clampedX = Math.max(r.minX, Math.min(r.maxX, x));
      const clampedZ = Math.max(r.minZ, Math.min(r.maxZ, z));
      const ry = getRampHeightAt(r, clampedX, clampedZ);
      if (ry <= maxStepY + 0.3 && ry > bestY) {
        bestY = ry;
      }
    }
  }

  return bestY > -50 ? bestY : 0;
}

/**
 * Resolve horizontal circle vs AABB collisions iteratively so agents smoothly slide along walls and never penetrate.
 */
export function resolveHorizontalCollisions(
  pos: Vec3,
  radius: number,
  height: number,
  colliders: AABB[]
): void {
  const footTolerance = pos.y + STEP_HEIGHT;
  const headY = pos.y + height - 0.05;

  for (let iter = 0; iter < 3; iter++) {
    for (let i = 0; i < colliders.length; i++) {
      const b = colliders[i];
      // Ignore boxes strictly below step height or above head
      if (b.maxY <= footTolerance || b.minY >= headY) continue;

      const closestX = Math.max(b.minX, Math.min(pos.x, b.maxX));
      const closestZ = Math.max(b.minZ, Math.min(pos.z, b.maxZ));
      const dx = pos.x - closestX;
      const dz = pos.z - closestZ;
      const distSq = dx * dx + dz * dz;

      if (distSq < radius * radius) {
        if (distSq > 1e-8) {
          const dist = Math.sqrt(distSq);
          const push = radius - dist + 0.001;
          pos.x += (dx / dist) * push;
          pos.z += (dz / dist) * push;
        } else {
          // Center inside box: push out along shallowest axis
          const penLeft = Math.abs(pos.x - b.minX);
          const penRight = Math.abs(b.maxX - pos.x);
          const penTop = Math.abs(pos.z - b.minZ);
          const penBottom = Math.abs(b.maxZ - pos.z);
          const minPen = Math.min(penLeft, penRight, penTop, penBottom);
          if (minPen === penLeft) pos.x = b.minX - radius - 0.002;
          else if (minPen === penRight) pos.x = b.maxX + radius + 0.002;
          else if (minPen === penTop) pos.z = b.minZ - radius - 0.002;
          else pos.z = b.maxZ + radius + 0.002;
        }
      }
    }
  }
}

/**
 * Check if moving upwards hits a ceiling AABB.
 */
function getCeilingY(
  x: number,
  z: number,
  footY: number,
  height: number,
  radius: number,
  colliders: AABB[]
): number {
  let lowestCeiling = 999;
  const checkR = radius * 0.85;
  for (let i = 0; i < colliders.length; i++) {
    const b = colliders[i];
    if (
      x + checkR > b.minX &&
      x - checkR < b.maxX &&
      z + checkR > b.minZ &&
      z - checkR < b.maxZ
    ) {
      if (b.minY >= footY + height * 0.5 && b.minY < lowestCeiling) {
        lowestCeiling = b.minY;
      }
    }
  }
  return lowestCeiling;
}

/**
 * Step a physics body forward by dt with sub-stepped movement to prevent tunneling through thin doors/walls.
 */
export function stepPhysicsBody(
  body: PhysicsBody,
  dt: number,
  colliders: AABB[],
  ramps: RampBox[]
): { landedSpeed: number } {
  const height = body.crouching ? PLAYER_CROUCH_HEIGHT : PLAYER_HEIGHT;
  let landedSpeed = 0;

  // Horizontal integration (sub-stepped if moving quickly)
  const moveDist = Math.hypot(body.vel.x * dt, body.vel.z * dt);
  const substeps = Math.max(1, Math.ceil(moveDist / 0.25));
  const subDt = dt / substeps;

  for (let s = 0; s < substeps; s++) {
    body.pos.x += body.vel.x * subDt;
    body.pos.z += body.vel.z * subDt;

    // Update floor support before horizontal collision so ramp climbing lifts body seamlessly
    const rampFloor = getSupportFloorY(body.pos.x, body.pos.z, body.pos.y, PLAYER_RADIUS, colliders, ramps);
    if (body.onGround && rampFloor > body.pos.y && rampFloor <= body.pos.y + STEP_HEIGHT + 0.25) {
      body.pos.y = rampFloor;
    }

    resolveHorizontalCollisions(body.pos, PLAYER_RADIUS, height, colliders);
  }

  // Vertical gravity & floor snapping
  const wasOnGround = body.onGround;
  body.vel.y -= GRAVITY * dt;
  body.pos.y += body.vel.y * dt;

  // Ceiling check
  if (body.vel.y > 0) {
    const ceilY = getCeilingY(body.pos.x, body.pos.z, body.pos.y, height, PLAYER_RADIUS, colliders);
    if (body.pos.y + height > ceilY) {
      body.pos.y = ceilY - height;
      body.vel.y = 0;
    }
  }

  // Floor check
  const floorY = getSupportFloorY(body.pos.x, body.pos.z, body.pos.y, PLAYER_RADIUS, colliders, ramps);
  if (body.pos.y <= floorY) {
    if (!wasOnGround && body.vel.y < -3.5) {
      landedSpeed = -body.vel.y;
    }
    body.pos.y = floorY;
    body.vel.y = 0;
    body.onGround = true;
  } else if (wasOnGround && body.vel.y <= 0 && body.pos.y - floorY <= 0.32) {
    // Smooth downhill ramp adhesion
    body.pos.y = floorY;
    body.vel.y = 0;
    body.onGround = true;
  } else {
    body.onGround = false;
  }

  return { landedSpeed };
}

/**
 * Exact slab Ray-vs-AABB test against all map colliders.
 */
export function raycastMap(
  origin: Vec3,
  dir: Vec3,
  maxDist: number,
  colliders: AABB[],
  visionOnly = false
): RayHit | null {
  let closestT = maxDist;
  let hitNormal: Vec3 = { x: 0, y: 1, z: 0 };
  let hitMat: AABB['material'] = 'sandstone';
  let hit = false;

  const invX = Math.abs(dir.x) > 1e-8 ? 1 / dir.x : 1e12;
  const invY = Math.abs(dir.y) > 1e-8 ? 1 / dir.y : 1e12;
  const invZ = Math.abs(dir.z) > 1e-8 ? 1 / dir.z : 1e12;

  for (let i = 0; i < colliders.length; i++) {
    const b = colliders[i];
    if (visionOnly && b.blocksVision === false) continue;

    let tx1 = (b.minX - origin.x) * invX;
    let tx2 = (b.maxX - origin.x) * invX;
    let nx = -1;
    if (tx1 > tx2) {
      const tmp = tx1;
      tx1 = tx2;
      tx2 = tmp;
      nx = 1;
    }

    let ty1 = (b.minY - origin.y) * invY;
    let ty2 = (b.maxY - origin.y) * invY;
    let ny = -1;
    if (ty1 > ty2) {
      const tmp = ty1;
      ty1 = ty2;
      ty2 = tmp;
      ny = 1;
    }

    let tz1 = (b.minZ - origin.z) * invZ;
    let tz2 = (b.maxZ - origin.z) * invZ;
    let nz = -1;
    if (tz1 > tz2) {
      const tmp = tz1;
      tz1 = tz2;
      tz2 = tmp;
      nz = 1;
    }

    let tmin = tx1;
    let hnx = nx;
    let hny = 0;
    let hnz = 0;

    if (ty1 > tmin) {
      tmin = ty1;
      hnx = 0;
      hny = ny;
      hnz = 0;
    }
    if (tz1 > tmin) {
      tmin = tz1;
      hnx = 0;
      hny = 0;
      hnz = nz;
    }

    const tmax = Math.min(tx2, ty2, tz2);

    if (tmax >= Math.max(0, tmin) && tmin >= 0 && tmin < closestT) {
      closestT = tmin;
      hitNormal = { x: hnx, y: hny, z: hnz };
      hitMat = b.material;
      hit = true;
    }
  }

  if (!hit) return null;
  return {
    distance: closestT,
    point: {
      x: origin.x + dir.x * closestT,
      y: origin.y + dir.y * closestT,
      z: origin.z + dir.z * closestT,
    },
    normal: hitNormal,
    material: hitMat,
  };
}

/**
 * Fast Line-of-Sight check between two 3D points against map geometry.
 */
export function hasLineOfSight(from: Vec3, to: Vec3, colliders: AABB[]): boolean {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist < 0.05) return true;
  const dir = { x: dx / dist, y: dy / dist, z: dz / dist };
  const hit = raycastMap(from, dir, dist - 0.1, colliders, true);
  return hit === null;
}

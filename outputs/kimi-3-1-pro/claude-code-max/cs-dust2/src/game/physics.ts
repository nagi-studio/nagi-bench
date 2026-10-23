import * as THREE from 'three';
import type { AABB, MapData } from './map';
import { allColliders } from './map';
import type { Actor, HitZone } from './types';

export const PLAYER_EYE_HEIGHT = 1.57;
export const GRAVITY = 18;
const STEP_HEIGHT = 0.46;

export interface RayHit {
  distance: number;
  point: THREE.Vector3;
  collider: AABB | null;
}

export interface ActorRayHit {
  actor: Actor;
  zone: HitZone;
  distance: number;
  point: THREE.Vector3;
}

export function eyePosition(actor: Actor, target = new THREE.Vector3()) {
  return target.set(actor.position.x, actor.position.y + PLAYER_EYE_HEIGHT, actor.position.z);
}

export function directionFromAngles(yaw: number, pitch: number, target = new THREE.Vector3()) {
  const cosPitch = Math.cos(pitch);
  return target.set(-Math.sin(yaw) * cosPitch, Math.sin(pitch), -Math.cos(yaw) * cosPitch);
}

export function angleTo(from: THREE.Vector3, to: THREE.Vector3) {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const horizontal = Math.hypot(dx, dz);
  return { yaw: Math.atan2(-dx, -dz), pitch: Math.atan2(to.y - from.y, horizontal) };
}

export function normalizeAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

export function surfaceHeight(surface: MapData['floors'][number], x: number, z: number) {
  if (surface.kind === 'flat') return surface.height;
  if (surface.kind === 'rampX') {
    return surface.height * THREE.MathUtils.clamp((x - surface.minX) / (surface.maxX - surface.minX), 0, 1);
  }
  return surface.height * THREE.MathUtils.clamp((z - surface.minZ) / (surface.maxZ - surface.minZ), 0, 1);
}

export function floorHeightAt(map: MapData, x: number, z: number) {
  let height = 0;
  for (const surface of map.floors) {
    if (x >= surface.minX && x <= surface.maxX && z >= surface.minZ && z <= surface.maxZ) {
      height = Math.max(height, surfaceHeight(surface, x, z));
    }
  }
  for (const box of map.colliders) {
    if (!box.walkable || box.kind === 'floor') continue;
    if (x >= box.minX && x <= box.maxX && z >= box.minZ && z <= box.maxZ) {
      height = Math.max(height, box.maxY);
    }
  }
  return height;
}

function supportHeight(map: MapData, x: number, z: number, maximum: number) {
  let height = 0;
  for (const surface of map.floors) {
    if (x >= surface.minX && x <= surface.maxX && z >= surface.minZ && z <= surface.maxZ) {
      const candidate = surfaceHeight(surface, x, z);
      if (candidate <= maximum) height = Math.max(height, candidate);
    }
  }
  for (const box of map.colliders) {
    if (!box.walkable || box.kind === 'floor') continue;
    if (x >= box.minX - 0.04 && x <= box.maxX + 0.04 && z >= box.minZ - 0.04 && z <= box.maxZ + 0.04) {
      if (box.maxY <= maximum) height = Math.max(height, box.maxY);
    }
  }
  return height;
}

function verticalOverlap(actor: Actor, box: AABB) {
  return actor.position.y + actor.height > box.minY + 0.03 && actor.position.y < box.maxY - 0.06;
}

function circleOverlapsBox(x: number, z: number, radius: number, box: AABB) {
  const nearestX = THREE.MathUtils.clamp(x, box.minX, box.maxX);
  const nearestZ = THREE.MathUtils.clamp(z, box.minZ, box.maxZ);
  const dx = x - nearestX;
  const dz = z - nearestZ;
  return dx * dx + dz * dz < radius * radius;
}

function moveAxis(actor: Actor, colliders: AABB[], axis: 'x' | 'z', amount: number) {
  if (Math.abs(amount) < 0.000001) return;
  const oldValue = actor.position[axis];
  actor.position[axis] += amount;
  for (const box of colliders) {
    if (!verticalOverlap(actor, box)) continue;
    if (box.maxY <= actor.position.y + 0.06) continue;
    if (!circleOverlapsBox(actor.position.x, actor.position.z, actor.radius, box)) continue;
    if (box.walkable && box.maxY - actor.position.y <= STEP_HEIGHT && actor.grounded) {
      actor.position.y = box.maxY;
      continue;
    }
    // Revert only this substep axis. Snapping through successive boxes can chain
    // corrections and eject an actor across an adjacent wall; reverting is stable
    // and still lets the other axis slide along the surface.
    actor.position[axis] = oldValue;
    break;
  }
}

export function moveActor(actor: Actor, map: MapData, dx: number, dz: number, dt: number) {
  const colliders = allColliders(map);
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dz)) / 0.18));
  for (let i = 0; i < steps; i++) {
    moveAxis(actor, colliders, 'x', dx / steps);
    moveAxis(actor, colliders, 'z', dz / steps);
  }

  actor.velocity.y -= GRAVITY * dt;
  const oldY = actor.position.y;
  let nextY = oldY + actor.velocity.y * dt;
  actor.grounded = false;

  if (actor.velocity.y > 0) {
    const oldHead = oldY + actor.height;
    const newHead = nextY + actor.height;
    for (const box of colliders) {
      if (!circleOverlapsBox(actor.position.x, actor.position.z, actor.radius * 0.8, box)) continue;
      if (oldHead <= box.minY && newHead > box.minY) {
        nextY = box.minY - actor.height;
        actor.velocity.y = 0;
        break;
      }
    }
  }

  if (actor.velocity.y <= 0) {
    const support = supportHeight(map, actor.position.x, actor.position.z, oldY + STEP_HEIGHT);
    if (nextY <= support && oldY >= support - STEP_HEIGHT - 0.08) {
      nextY = support;
      actor.velocity.y = 0;
      actor.grounded = true;
    }
  }
  actor.position.y = Math.max(0, nextY);
}

export function jump(actor: Actor) {
  if (!actor.grounded || !actor.alive) return false;
  actor.velocity.y = 6.25;
  actor.grounded = false;
  return true;
}

export function rayAABB(origin: THREE.Vector3, direction: THREE.Vector3, box: AABB, maxDistance: number) {
  let near = 0;
  let far = maxDistance;
  const axes = ['x', 'y', 'z'] as const;
  for (const axis of axes) {
    const min = axis === 'x' ? box.minX : axis === 'y' ? box.minY : box.minZ;
    const max = axis === 'x' ? box.maxX : axis === 'y' ? box.maxY : box.maxZ;
    const o = origin[axis];
    const d = direction[axis];
    if (Math.abs(d) < 1e-8) {
      if (o < min || o > max) return null;
      continue;
    }
    let a = (min - o) / d;
    let b = (max - o) / d;
    if (a > b) [a, b] = [b, a];
    near = Math.max(near, a);
    far = Math.min(far, b);
    if (near > far) return null;
  }
  return near >= 0 && near <= maxDistance ? near : null;
}

export function raycastMap(map: MapData, origin: THREE.Vector3, direction: THREE.Vector3, maxDistance: number): RayHit | null {
  let nearest = maxDistance;
  let hit: AABB | null = null;
  for (const box of allColliders(map)) {
    const distance = rayAABB(origin, direction, box, nearest);
    if (distance !== null && distance < nearest) {
      nearest = distance;
      hit = box;
    }
  }
  if (direction.y < -1e-7) {
    const distance = -origin.y / direction.y;
    if (distance > 0 && distance < nearest) {
      const x = origin.x + direction.x * distance;
      const z = origin.z + direction.z * distance;
      if (x > -44 && x < 44 && z > -49 && z < 49) {
        nearest = distance;
        hit = null;
      }
    }
  }
  for (const surface of map.floors) {
    if (surface.kind === 'flat') continue;
    const span = surface.kind === 'rampX' ? surface.maxX - surface.minX : surface.maxZ - surface.minZ;
    const axisOrigin = surface.kind === 'rampX' ? origin.x : origin.z;
    const axisDirection = surface.kind === 'rampX' ? direction.x : direction.z;
    const axisMin = surface.kind === 'rampX' ? surface.minX : surface.minZ;
    const constant = surface.height * axisOrigin - span * origin.y - surface.height * axisMin;
    const denominator = surface.height * axisDirection - span * direction.y;
    if (Math.abs(denominator) < 1e-8) continue;
    const distance = -constant / denominator;
    if (distance <= 0 || distance >= nearest) continue;
    const x = origin.x + direction.x * distance;
    const z = origin.z + direction.z * distance;
    if (x >= surface.minX && x <= surface.maxX && z >= surface.minZ && z <= surface.maxZ) {
      nearest = distance;
      hit = null;
    }
  }
  if (nearest >= maxDistance) return null;
  return { distance: nearest, point: origin.clone().addScaledVector(direction, nearest), collider: hit };
}

const HITBOXES: Array<{ zone: HitZone; x: number; y: number; z: number; hx: number; hy: number; hz: number }> = [
  { zone: 'head', x: 0, y: 1.60, z: 0, hx: 0.19, hy: 0.20, hz: 0.18 },
  { zone: 'chest', x: 0, y: 1.23, z: 0, hx: 0.29, hy: 0.22, hz: 0.17 },
  { zone: 'abdomen', x: 0, y: 0.94, z: 0, hx: 0.255, hy: 0.18, hz: 0.16 },
  { zone: 'arms', x: -0.36, y: 1.16, z: -0.10, hx: 0.11, hy: 0.27, hz: 0.13 },
  { zone: 'arms', x: 0.36, y: 1.16, z: -0.10, hx: 0.11, hy: 0.27, hz: 0.13 },
  { zone: 'legs', x: -0.15, y: 0.40, z: 0, hx: 0.12, hy: 0.40, hz: 0.14 },
  { zone: 'legs', x: 0.15, y: 0.40, z: 0, hx: 0.12, hy: 0.40, hz: 0.14 },
];

function rayHitbox(
  origin: THREE.Vector3, direction: THREE.Vector3, actor: Actor,
  box: (typeof HITBOXES)[number], maxDistance: number,
) {
  const dx = origin.x - actor.position.x;
  const dz = origin.z - actor.position.z;
  const cos = Math.cos(actor.yaw);
  const sin = Math.sin(actor.yaw);
  const localOrigin = new THREE.Vector3(
    cos * dx - sin * dz,
    origin.y - actor.position.y,
    sin * dx + cos * dz,
  );
  const localDirection = new THREE.Vector3(
    cos * direction.x - sin * direction.z,
    direction.y,
    sin * direction.x + cos * direction.z,
  );
  return rayAABB(localOrigin, localDirection, {
    minX: box.x - box.hx, maxX: box.x + box.hx,
    minY: box.y - box.hy, maxY: box.y + box.hy,
    minZ: box.z - box.hz, maxZ: box.z + box.hz,
    kind: 'crate',
  }, maxDistance);
}

export function raycastActors(
  actors: Actor[], origin: THREE.Vector3, direction: THREE.Vector3,
  maxDistance: number, excludeId?: string,
): ActorRayHit | null {
  let nearest = maxDistance;
  let result: ActorRayHit | null = null;
  for (const actor of actors) {
    if (!actor.alive || actor.id === excludeId) continue;
    for (const box of HITBOXES) {
      const distance = rayHitbox(origin, direction, actor, box, nearest);
      if (distance !== null && distance < nearest) {
        nearest = distance;
        result = {
          actor, zone: box.zone, distance,
          point: origin.clone().addScaledVector(direction, distance),
        };
      }
    }
  }
  return result;
}

export function hasLineOfSight(map: MapData, from: THREE.Vector3, to: THREE.Vector3) {
  const direction = to.clone().sub(from);
  const distance = direction.length();
  if (distance < 0.001) return true;
  direction.divideScalar(distance);
  const hit = raycastMap(map, from, direction, distance);
  return !hit || hit.distance >= distance - 0.12;
}

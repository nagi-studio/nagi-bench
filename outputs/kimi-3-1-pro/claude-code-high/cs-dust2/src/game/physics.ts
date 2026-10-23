import * as THREE from 'three';
import type { Collider, HitZone, PlayerEntity } from './types';

export function circleOverlaps(c: Collider, x: number, z: number, radius: number) {
  const nx = Math.max(c.minX, Math.min(x, c.maxX));
  const nz = Math.max(c.minZ, Math.min(z, c.maxZ));
  const dx = x - nx;
  const dz = z - nz;
  return dx * dx + dz * dz < radius * radius;
}

function verticallyOverlaps(c: Collider, y: number, height: number) {
  return y < c.maxY - 0.025 && y + height > c.minY;
}

export function canOccupy(colliders: Collider[], pos: THREE.Vector3, radius = 0.42, height = 1.75) {
  for (const c of colliders) {
    if (verticallyOverlaps(c, pos.y, height) && circleOverlaps(c, pos.x, pos.z, radius)) return false;
  }
  return true;
}

export function moveWithCollisions(entity: PlayerEntity, delta: THREE.Vector3, colliders: Collider[]) {
  const distance = Math.hypot(delta.x, delta.z);
  const steps = Math.max(1, Math.ceil(distance / 0.22));
  const dx = delta.x / steps;
  const dz = delta.z / steps;
  for (let i = 0; i < steps; i++) {
    entity.pos.x += dx;
    for (const c of colliders) {
      if (!verticallyOverlaps(c, entity.pos.y, entity.height) || !circleOverlaps(c, entity.pos.x, entity.pos.z, entity.radius)) continue;
      if (dx > 0) entity.pos.x = c.minX - entity.radius;
      else if (dx < 0) entity.pos.x = c.maxX + entity.radius;
    }
    entity.pos.z += dz;
    for (const c of colliders) {
      if (!verticallyOverlaps(c, entity.pos.y, entity.height) || !circleOverlaps(c, entity.pos.x, entity.pos.z, entity.radius)) continue;
      if (dz > 0) entity.pos.z = c.minZ - entity.radius;
      else if (dz < 0) entity.pos.z = c.maxZ + entity.radius;
    }
  }
}

export function updateVertical(entity: PlayerEntity, dt: number, colliders: Collider[]) {
  const oldY = entity.pos.y;
  entity.velocity.y -= 18 * dt;
  entity.pos.y += entity.velocity.y * dt;
  let landing = 0;
  if (entity.velocity.y <= 0) {
    for (const c of colliders) {
      if (!circleOverlaps(c, entity.pos.x, entity.pos.z, entity.radius * 0.72)) continue;
      if (oldY >= c.maxY - 0.08 && entity.pos.y <= c.maxY) landing = Math.max(landing, c.maxY);
    }
  }
  if (entity.pos.y <= landing) {
    entity.pos.y = landing;
    entity.velocity.y = 0;
    entity.grounded = true;
  } else {
    entity.grounded = false;
  }
}

export interface RayHit {
  distance: number;
  point: THREE.Vector3;
  normal: THREE.Vector3;
}

export function rayAABB(origin: THREE.Vector3, direction: THREE.Vector3, min: THREE.Vector3, max: THREE.Vector3, maxDistance: number): RayHit | null {
  let near = 0;
  let far = maxDistance;
  let nearAxis = 0;
  let nearSign = 1;
  const o = [origin.x, origin.y, origin.z];
  const d = [direction.x, direction.y, direction.z];
  const mins = [min.x, min.y, min.z];
  const maxs = [max.x, max.y, max.z];
  for (let axis = 0; axis < 3; axis++) {
    if (Math.abs(d[axis]) < 1e-8) {
      if (o[axis] < mins[axis] || o[axis] > maxs[axis]) return null;
      continue;
    }
    let t1 = (mins[axis] - o[axis]) / d[axis];
    let t2 = (maxs[axis] - o[axis]) / d[axis];
    let sign = -Math.sign(d[axis]);
    if (t1 > t2) {
      [t1, t2] = [t2, t1];
      sign = -sign;
    }
    if (t1 > near) {
      near = t1;
      nearAxis = axis;
      nearSign = sign;
    }
    far = Math.min(far, t2);
    if (near > far) return null;
  }
  if (near < 0 || near > maxDistance) return null;
  const normal = new THREE.Vector3();
  if (nearAxis === 0) normal.x = nearSign;
  else if (nearAxis === 1) normal.y = nearSign;
  else normal.z = nearSign;
  return { distance: near, point: origin.clone().addScaledVector(direction, near), normal };
}

export function rayWorld(origin: THREE.Vector3, direction: THREE.Vector3, colliders: Collider[], maxDistance = 200): RayHit | null {
  let closest: RayHit | null = null;
  const min = new THREE.Vector3();
  const max = new THREE.Vector3();
  for (const c of colliders) {
    min.set(c.minX, c.minY, c.minZ);
    max.set(c.maxX, c.maxY, c.maxZ);
    const hit = rayAABB(origin, direction, min, max, closest?.distance ?? maxDistance);
    if (hit && (!closest || hit.distance < closest.distance)) closest = hit;
  }
  // The floor is also a bullet surface.
  if (direction.y < -0.0001) {
    const t = -origin.y / direction.y;
    if (t >= 0 && t < (closest?.distance ?? maxDistance)) {
      closest = { distance: t, point: origin.clone().addScaledVector(direction, t), normal: new THREE.Vector3(0, 1, 0) };
    }
  }
  return closest;
}

const HITBOXES: { zone: HitZone; center: [number, number, number]; size: [number, number, number] }[] = [
  { zone: 'head', center: [0, 1.61, 0], size: [0.36, 0.36, 0.34] },
  { zone: 'chest', center: [0, 1.25, 0], size: [0.54, 0.38, 0.32] },
  { zone: 'stomach', center: [0, 0.96, 0], size: [0.47, 0.24, 0.3] },
  { zone: 'arms', center: [-0.37, 1.18, -0.03], size: [0.19, 0.55, 0.25] },
  { zone: 'arms', center: [0.37, 1.18, -0.03], size: [0.19, 0.55, 0.25] },
  { zone: 'legs', center: [-0.145, 0.45, 0], size: [0.23, 0.86, 0.27] },
  { zone: 'legs', center: [0.145, 0.45, 0], size: [0.23, 0.86, 0.27] },
];

export interface EntityRayHit extends RayHit {
  entity: PlayerEntity;
  zone: HitZone;
}

export function rayEntity(origin: THREE.Vector3, direction: THREE.Vector3, entity: PlayerEntity, maxDistance: number): EntityRayHit | null {
  if (!entity.alive) return null;
  const cos = Math.cos(entity.yaw);
  const sin = Math.sin(entity.yaw);
  const dx = origin.x - entity.pos.x;
  const dz = origin.z - entity.pos.z;
  const localOrigin = new THREE.Vector3(cos * dx - sin * dz, origin.y - entity.pos.y, sin * dx + cos * dz);
  const localDirection = new THREE.Vector3(cos * direction.x - sin * direction.z, direction.y, sin * direction.x + cos * direction.z);
  let best: EntityRayHit | null = null;
  for (const hitbox of HITBOXES) {
    const [x, y, z] = hitbox.center;
    const [w, h, d] = hitbox.size;
    const hit = rayAABB(localOrigin, localDirection,
      new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
      new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2),
      best?.distance ?? maxDistance);
    if (hit && (!best || hit.distance < best.distance)) {
      best = { ...hit, point: origin.clone().addScaledVector(direction, hit.distance), entity, zone: hitbox.zone };
    }
  }
  return best;
}

export function hasLineOfSight(from: THREE.Vector3, to: THREE.Vector3, colliders: Collider[]) {
  const direction = to.clone().sub(from);
  const distance = direction.length();
  if (distance < 0.01) return true;
  direction.divideScalar(distance);
  const hit = rayWorld(from, direction, colliders, distance);
  return !hit || hit.distance >= distance - 0.15;
}

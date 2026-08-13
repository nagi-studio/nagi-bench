import * as THREE from 'three';

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function distance2d(ax: number, az: number, bx: number, bz: number): number {
  const dx = ax - bx;
  const dz = az - bz;
  return Math.sqrt(dx * dx + dz * dz);
}

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export interface RayBoxHit {
  distance: number;
}

// Ray vs axis-aligned box, in XZ plus Y from 0 to height.
export function rayIntersectsBox(
  origin: THREE.Vector3,
  dir: THREE.Vector3,
  min: THREE.Vector3,
  max: THREE.Vector3,
): RayBoxHit | null {
  const inv = new THREE.Vector3(1 / dir.x, 1 / dir.y, 1 / dir.z);
  let tmin = (min.x - origin.x) * inv.x;
  let tmax = (max.x - origin.x) * inv.x;
  if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

  let tymin = (min.y - origin.y) * inv.y;
  let tymax = (max.y - origin.y) * inv.y;
  if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

  if (tmin > tymax || tymin > tmax) return null;
  tmin = Math.max(tmin, tymin);
  tmax = Math.min(tmax, tymax);

  let tzmin = (min.z - origin.z) * inv.z;
  let tzmax = (max.z - origin.z) * inv.z;
  if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

  if (tmin > tzmax || tzmin > tmax) return null;
  tmin = Math.max(tmin, tzmin);
  tmax = Math.min(tmax, tzmax);
  if (tmax < 0) return null;

  return { distance: Math.max(tmin, 0) };
}

export function segmentIntersectsBox(
  from: THREE.Vector3,
  to: THREE.Vector3,
  min: THREE.Vector3,
  max: THREE.Vector3,
): boolean {
  const dir = to.clone().sub(from);
  const length = dir.length();
  if (length < 0.0001) return false;
  dir.normalize();
  const hit = rayIntersectsBox(from, dir, min, max);
  return hit !== null && hit.distance <= length;
}

export function segmentIntersectsSphere(
  from: THREE.Vector3,
  to: THREE.Vector3,
  center: THREE.Vector3,
  radius: number,
): number | null {
  const ab = to.clone().sub(from);
  const ac = center.clone().sub(from);
  const ab2 = ab.dot(ab);
  if (ab2 < 1e-8) return ac.length() <= radius ? 0 : null;
  let t = clamp(ac.dot(ab) / ab2, 0, 1);
  const closest = from.clone().addScaledVector(ab, t);
  const dist2 = closest.distanceToSquared(center);
  if (dist2 > radius * radius) return null;
  return t * ab.length();
}

export function aabbFromPoint(x: number, z: number, w: number, d: number, h: number) {
  return {
    min: new THREE.Vector3(x - w / 2, 0, z - d / 2),
    max: new THREE.Vector3(x + w / 2, h, z + d / 2),
  };
}

export function angleDelta(a: number, b: number): number {
  let delta = b - a;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export function shortAngleLerp(a: number, b: number, t: number): number {
  return a + angleDelta(a, b) * t;
}

export function isPointInBox(
  px: number,
  pz: number,
  bx: number,
  bz: number,
  bw: number,
  bd: number,
): boolean {
  return px >= bx - bw / 2 && px <= bx + bw / 2 && pz >= bz - bd / 2 && pz <= bz + bd / 2;
}

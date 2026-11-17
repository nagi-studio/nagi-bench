import type { Box, Point } from './types';
import { Vector3 } from 'three';

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.z - b.z);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export function angleDelta(a: number, b: number) { return Math.atan2(Math.sin(a - b), Math.cos(a - b)); }
export function seeded(n: number) { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }
export function rayAABB(origin: Vector3, direction: Vector3, min: Vector3, max: Vector3, limit: number): number {
  let near = 0, far = limit;
  for (const axis of ['x', 'y', 'z'] as const) {
    if (Math.abs(direction[axis]) < 1e-8) { if (origin[axis] < min[axis] || origin[axis] > max[axis]) return Infinity; }
    else {
      let a = (min[axis] - origin[axis]) / direction[axis], b = (max[axis] - origin[axis]) / direction[axis];
      if (a > b) [a, b] = [b, a];
      near = Math.max(near, a); far = Math.min(far, b);
      if (near > far) return Infinity;
    }
  }
  return near <= limit ? near : Infinity;
}
const low = new Vector3(), high = new Vector3();
export function rayBox(origin: Vector3, direction: Vector3, box: Box, limit: number): number {
  low.set(box.x - box.w / 2, box.minY, box.z - box.d / 2);
  high.set(box.x + box.w / 2, box.maxY, box.z + box.d / 2);
  return rayAABB(origin, direction, low, high, limit);
}
export function circleBox(x: number, z: number, radius: number, b: Box) {
  const cx = clamp(x, b.x - b.w / 2, b.x + b.w / 2), cz = clamp(z, b.z - b.d / 2, b.z + b.d / 2);
  return (x - cx) ** 2 + (z - cz) ** 2 < radius ** 2;
}

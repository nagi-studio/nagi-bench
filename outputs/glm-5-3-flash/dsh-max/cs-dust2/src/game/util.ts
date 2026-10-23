/** small math helpers shared by physics / AI / rendering */

import type { AABB } from './world';

export interface Vec3 { x: number; y: number; z: number }

export function clamp(v: number, a: number, b: number) { return v < a ? a : v > b ? b : v; }
export function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
export function damp(a: number, b: number, rate: number, dt: number) { return lerp(a, b, 1 - Math.exp(-rate * dt)); }
export function randRange(a: number, b: number) { return a + Math.random() * (b - a); }

/** Ray vs axis aligned box. Returns hit distance or null. */
export function rayAABB(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, b: AABB, maxT: number): number | null {
  let tmin = 0, tmax = maxT;
  // X
  if (Math.abs(dx) < 1e-8) { if (ox < b.x1 || ox > b.x2) return null; }
  else {
    let t1 = (b.x1 - ox) / dx, t2 = (b.x2 - ox) / dx;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  // Y
  if (Math.abs(dy) < 1e-8) { if (oy < b.y1 || oy > b.y2) return null; }
  else {
    let t1 = (b.y1 - oy) / dy, t2 = (b.y2 - oy) / dy;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  // Z
  if (Math.abs(dz) < 1e-8) { if (oz < b.z1 || oz > b.z2) return null; }
  else {
    let t1 = (b.z1 - oz) / dz, t2 = (b.z2 - oz) / dz;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  return tmin;
}

/** uniform point in a cone around a unit direction (angle = half-angle, radians) */
export function coneSpread(dx: number, dy: number, dz: number, angle: number): [number, number, number] {
  if (angle <= 0) return [dx, dy, dz];
  // orthonormal basis
  let ux = 0, uy = 0, uz = 0;
  if (Math.abs(dx) < 0.9) { ux = dz; uy = 0; uz = -dx; }
  else { ux = 0; uy = dz; uz = -dy; }
  const ul = Math.hypot(ux, uy, uz) || 1;
  ux /= ul; uy /= ul; uz /= ul;
  const vx = dy * uz - dz * uy, vy = dz * ux - dx * uz, vz = dx * uy - dy * ux;
  const r = Math.tan(angle) * Math.sqrt(Math.random());
  const a = Math.random() * Math.PI * 2;
  const cx = Math.cos(a), sy = Math.sin(a);
  return [
    dx + ux * r * cx + vx * r * sy,
    dy + uy * r * cx + vy * r * sy,
    dz + uz * r * cx + vz * r * sy,
  ];
}

export function angleDiff(a: number, b: number): number {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export function approachAngle(cur: number, target: number, maxStep: number): number {
  const d = angleDiff(target, cur);
  return cur + clamp(d, -maxStep, maxStep);
}

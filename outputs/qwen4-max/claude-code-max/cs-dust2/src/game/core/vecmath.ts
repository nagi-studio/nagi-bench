import type { Vec3 } from './types.ts';

export const v3 = (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z });
export const clone = (a: Vec3): Vec3 => ({ x: a.x, y: a.y, z: a.z });
export const add = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const sub = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const scale = (a: Vec3, s: number): Vec3 => ({ x: a.x * s, y: a.y * s, z: a.z * s });
export const dot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const len = (a: Vec3): number => Math.hypot(a.x, a.y, a.z);
export const len2 = (a: Vec3): number => Math.hypot(a.x, a.z);
export const dist = (a: Vec3, b: Vec3): number => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
export const dist2 = (a: Vec3, b: Vec3): number => Math.hypot(a.x - b.x, a.z - b.z);
export const norm = (a: Vec3): Vec3 => {
  const l = len(a);
  return l > 1e-9 ? scale(a, 1 / l) : v3();
};
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const clamp = (x: number, lo: number, hi: number): number => (x < lo ? lo : x > hi ? hi : x);

export function dirFromYawPitch(yaw: number, pitch: number): Vec3 {
  const cp = Math.cos(pitch);
  return { x: Math.sin(yaw) * cp, y: Math.sin(pitch), z: -Math.cos(yaw) * cp };
}

export function yawTo(from: Vec3, to: Vec3): number {
  return Math.atan2(to.x - from.x, -(to.z - from.z));
}

export function angleDiff(a: number, b: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export interface RayHit {
  t: number;
  normal: Vec3;
}

// Slab-method ray vs AABB. Returns nearest positive hit or null.
export function rayAABB(origin: Vec3, dir: Vec3, min: Vec3, max: Vec3, maxT: number): RayHit | null {
  let tmin = 0;
  let tmax = maxT;
  let nAxis = -1;
  let nSign = 0;
  const o = [origin.x, origin.y, origin.z];
  const d = [dir.x, dir.y, dir.z];
  const mn = [min.x, min.y, min.z];
  const mx = [max.x, max.y, max.z];
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-9) {
      if (o[i] < mn[i] || o[i] > mx[i]) return null;
      continue;
    }
    const inv = 1 / d[i];
    let t1 = (mn[i] - o[i]) * inv;
    let t2 = (mx[i] - o[i]) * inv;
    let sign = -1;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
      sign = 1;
    }
    if (t1 > tmin) {
      tmin = t1;
      nAxis = i;
      nSign = sign;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }
  if (nAxis < 0) return null;
  const normal = v3();
  if (nAxis === 0) normal.x = nSign;
  else if (nAxis === 1) normal.y = nSign;
  else normal.z = nSign;
  return { t: tmin, normal };
}

export function pointInRect(x: number, z: number, r: { x1: number; z1: number; x2: number; z2: number }): boolean {
  return x >= r.x1 && x <= r.x2 && z >= r.z1 && z <= r.z2;
}

// Deterministic-ish RNG helpers (Math.random is fine for a prototype).
export const rand = (lo: number, hi: number): number => lo + Math.random() * (hi - lo);
export const randInt = (lo: number, hi: number): number => Math.floor(rand(lo, hi + 1));
export const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
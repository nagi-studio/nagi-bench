// Pure math utilities — no external dependencies. Shared by simulation, AI and rendering.

export interface Vec3 { x: number; y: number; z: number; }
export interface Vec2 { x: number; z: number; }

export const v3 = (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z });
export const v2 = (x = 0, z = 0): Vec2 => ({ x, z });
export const clone3 = (a: Vec3): Vec3 => ({ x: a.x, y: a.y, z: a.z });
export const add3 = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const sub3 = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const scale3 = (a: Vec3, s: number): Vec3 => ({ x: a.x * s, y: a.y * s, z: a.z * s });
export const dot3 = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const len3 = (a: Vec3): number => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
export const dist3 = (a: Vec3, b: Vec3): number => len3(sub3(a, b));
export const dist2 = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);
export const norm3 = (a: Vec3): Vec3 => { const l = len3(a) || 1; return scale3(a, 1 / l); };
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

export function lerpAngle(a: number, b: number, t: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

export function angleDelta(a: number, b: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

// Convention: yaw = 0 faces -Z. forward = (-sin yaw, 0, -cos yaw). right = (cos yaw, 0, -sin yaw).
export function forwardVec(yaw: number, pitch = 0): Vec3 {
  const cp = Math.cos(pitch);
  return { x: -Math.sin(yaw) * cp, y: Math.sin(pitch), z: -Math.cos(yaw) * cp };
}
export function rightVec(yaw: number): Vec3 {
  return { x: Math.cos(yaw), y: 0, z: -Math.sin(yaw) };
}
export function yawToward(from: Vec2, to: Vec2): number {
  // yaw such that forward points from -> to
  return Math.atan2(-(to.x - from.x), -(to.z - from.z));
}

export interface AABB { minX: number; minY: number; minZ: number; maxX: number; maxY: number; maxZ: number; }

export function aabb(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): AABB {
  return { minX: Math.min(x1, x2), minY: Math.min(y1, y2), minZ: Math.min(z1, z2), maxX: Math.max(x1, x2), maxY: Math.max(y1, y2), maxZ: Math.max(z1, z2) };
}

export function aabbOverlap(a: AABB, b: AABB): boolean {
  return a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY && a.minZ < b.maxZ && a.maxZ > b.minZ;
}

export function pointInAABB(p: Vec3, b: AABB): boolean {
  return p.x >= b.minX && p.x <= b.maxX && p.y >= b.minY && p.y <= b.maxY && p.z >= b.minZ && p.z <= b.maxZ;
}

export interface RayHit { t: number; point: Vec3; normal: Vec3; }

// Slab-method ray vs AABB. Returns nearest positive hit or null.
export function rayAABB(origin: Vec3, dir: Vec3, box: AABB, maxT: number): RayHit | null {
  let tmin = 0, tmax = maxT;
  let nAxis = -1, nSign = 0;
  const o = [origin.x, origin.y, origin.z];
  const d = [dir.x, dir.y, dir.z];
  const bmin = [box.minX, box.minY, box.minZ];
  const bmax = [box.maxX, box.maxY, box.maxZ];
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-9) {
      if (o[i] < bmin[i] || o[i] > bmax[i]) return null;
    } else {
      const inv = 1 / d[i];
      let t1 = (bmin[i] - o[i]) * inv;
      let t2 = (bmax[i] - o[i]) * inv;
      let sign = -1;
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; sign = 1; }
      if (t1 > tmin) { tmin = t1; nAxis = i; nSign = sign; }
      if (t2 < tmax) tmax = t2;
      if (tmin > tmax) return null;
    }
  }
  if (nAxis < 0) return null; // origin inside box
  const normal = v3();
  if (nAxis === 0) normal.x = nSign; else if (nAxis === 1) normal.y = nSign; else normal.z = nSign;
  return { t: tmin, point: add3(origin, scale3(dir, tmin)), normal };
}

// Deterministic-ish RNG helpers (Math.random based; fine for a prototype).
export const rand = (lo: number, hi: number): number => lo + Math.random() * (hi - lo);
export const randInt = (lo: number, hi: number): number => Math.floor(rand(lo, hi + 1));
export const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const chance = (p: number): boolean => Math.random() < p;

// Random direction inside a cone of given half-angle (radians) around dir.
export function coneSpread(dir: Vec3, halfAngle: number): Vec3 {
  if (halfAngle <= 0) return dir;
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * halfAngle;
  // build orthonormal basis around dir
  const up = Math.abs(dir.y) > 0.95 ? v3(1, 0, 0) : v3(0, 1, 0);
  const t1 = norm3({ x: up.y * dir.z - up.z * dir.y, y: up.z * dir.x - up.x * dir.z, z: up.x * dir.y - up.y * dir.x });
  const t2 = { x: dir.y * t1.z - dir.z * t1.y, y: dir.z * t1.x - dir.x * t1.z, z: dir.x * t1.y - dir.y * t1.x };
  const sx = Math.cos(a) * r, sy = Math.sin(a) * r;
  return norm3(add3(dir, add3(scale3(t1, sx), scale3(t2, sy))));
}

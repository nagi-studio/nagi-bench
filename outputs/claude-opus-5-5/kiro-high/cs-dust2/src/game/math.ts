// Small, dependency-free math helpers shared by simulation, AI and rendering.

export const DEG = Math.PI / 180;
export const TAU = Math.PI * 2;

export interface V2 {
  x: number;
  z: number;
}

export interface V3Like {
  x: number;
  y: number;
  z: number;
}

export const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const smoothstep = (t: number): number => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

/** Frame-rate independent exponential smoothing. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function wrapAngle(a: number): number {
  while (a > Math.PI) a -= TAU;
  while (a < -Math.PI) a += TAU;
  return a;
}

/** Rotate `current` toward `target` by at most `maxStep` radians (shortest path). */
export function approachAngle(current: number, target: number, maxStep: number): number {
  const d = wrapAngle(target - current);
  if (Math.abs(d) <= maxStep) return target;
  return wrapAngle(current + Math.sign(d) * maxStep);
}

export const rand = (a: number, b: number): number => a + Math.random() * (b - a);
export const randInt = (a: number, b: number): number => Math.floor(rand(a, b + 1));
export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Gaussian-ish random in [-1, 1] (sum of uniforms). */
export function randSym(): number {
  return (Math.random() + Math.random() + Math.random()) / 1.5 - 1;
}

/**
 * Convention used everywhere: yaw = 0 looks toward -Z, positive yaw turns left (counter-clockwise from above),
 * pitch > 0 looks up. Matches a THREE camera with rotation order 'YXZ'.
 */
export function dirFromAngles(yaw: number, pitch: number, out: V3Like): V3Like {
  const cp = Math.cos(pitch);
  out.x = -Math.sin(yaw) * cp;
  out.y = Math.sin(pitch);
  out.z = -Math.cos(yaw) * cp;
  return out;
}

export function yawToward(dx: number, dz: number): number {
  return Math.atan2(-dx, -dz);
}

export function pitchToward(dx: number, dy: number, dz: number): number {
  return Math.atan2(dy, Math.hypot(dx, dz));
}

export function dist2(a: V2, b: V2): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

export function hash2(i: number, j: number): number {
  let h = (i * 374761393 + j * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967295;
}

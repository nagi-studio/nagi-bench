// Minimal, allocation-light vector math used by the simulation layer.
// The simulation never imports three.js so it can run headless (tests / Node).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const v3 = (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z });
export const clone = (a: Vec3): Vec3 => ({ x: a.x, y: a.y, z: a.z });
export const copy = (out: Vec3, a: Vec3): Vec3 => {
  out.x = a.x;
  out.y = a.y;
  out.z = a.z;
  return out;
};
export const add = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const sub = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const scale = (a: Vec3, s: number): Vec3 => ({ x: a.x * s, y: a.y * s, z: a.z * s });
export const dot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const len = (a: Vec3): number => Math.hypot(a.x, a.y, a.z);
export const dist = (a: Vec3, b: Vec3): number => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
export const dist2D = (ax: number, az: number, bx: number, bz: number): number => Math.hypot(ax - bx, az - bz);
export const normalize = (a: Vec3): Vec3 => {
  const l = len(a) || 1;
  return { x: a.x / l, y: a.y / l, z: a.z / l };
};
export const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

export const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const DEG = Math.PI / 180;

/** Wrap angle to (-PI, PI]. */
export const wrapAngle = (a: number): number => {
  a = (a + Math.PI) % (Math.PI * 2);
  if (a < 0) a += Math.PI * 2;
  return a - Math.PI;
};

/**
 * View direction for yaw/pitch. Convention (matches three.js camera with order 'YXZ'):
 * yaw = 0 looks toward -Z, positive yaw turns left (toward -X), positive pitch looks up.
 */
export const dirFromAngles = (yaw: number, pitch: number): Vec3 => {
  const cp = Math.cos(pitch);
  return { x: -Math.sin(yaw) * cp, y: Math.sin(pitch), z: -Math.cos(yaw) * cp };
};

/** Yaw that looks from (ax,az) toward (bx,bz). */
export const yawTo = (ax: number, az: number, bx: number, bz: number): number => Math.atan2(-(bx - ax), -(bz - az));

export const pitchTo = (from: Vec3, to: Vec3): number => {
  const dh = Math.hypot(to.x - from.x, to.z - from.z);
  return Math.atan2(to.y - from.y, dh);
};

/** Deterministic PRNG (mulberry32) so map decoration is stable between runs. */
export const makeRng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const randRange = (a: number, b: number): number => a + Math.random() * (b - a);
export const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const shuffle = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
};

/** Random unit-disk sample, used for weapon spread cones. */
export const randomInDisk = (): [number, number] => {
  const r = Math.sqrt(Math.random());
  const a = Math.random() * Math.PI * 2;
  return [Math.cos(a) * r, Math.sin(a) * r];
};

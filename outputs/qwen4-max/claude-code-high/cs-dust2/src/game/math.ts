// Pure vector math — no dependencies, usable in Node for headless tests.
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const v3 = (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z });
export const vclone = (a: Vec3): Vec3 => ({ x: a.x, y: a.y, z: a.z });
export const vadd = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const vsub = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const vscale = (a: Vec3, s: number): Vec3 => ({ x: a.x * s, y: a.y * s, z: a.z * s });
export const vdot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const vlen = (a: Vec3): number => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
export const vlen2 = (a: Vec3): number => Math.sqrt(a.x * a.x + a.z * a.z);
export const vdist = (a: Vec3, b: Vec3): number => vlen(vsub(a, b));
export const vdist2 = (a: Vec3, b: Vec3): number => vlen2(vsub(a, b));
export const vnorm = (a: Vec3): Vec3 => {
  const l = vlen(a);
  return l > 1e-8 ? vscale(a, 1 / l) : v3();
};
export const vlerp = (a: Vec3, b: Vec3, t: number): Vec3 => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  z: a.z + (b.z - a.z) * t,
});

/** Forward vector for a given yaw (matches three.js camera looking down -Z at yaw 0). */
export const yawDir = (yaw: number): Vec3 => ({ x: -Math.sin(yaw), y: 0, z: -Math.cos(yaw) });

/** Full look direction from yaw + pitch. */
export const lookDir = (yaw: number, pitch: number): Vec3 => {
  const cp = Math.cos(pitch);
  return { x: -Math.sin(yaw) * cp, y: Math.sin(pitch), z: -Math.cos(yaw) * cp };
};

/** Yaw that points from `from` toward `to` (horizontal). */
export const yawToward = (from: Vec3, to: Vec3): number =>
  Math.atan2(-(to.x - from.x), -(to.z - from.z));

export const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v;

export const wrapAngle = (a: number): number => {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
};

/** Rotate a point around the Y axis (three.js convention: positive yaw turns left). */
export const rotY = (p: Vec3, angle: number): Vec3 => {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
};

/** Deterministic PRNG (mulberry32). */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

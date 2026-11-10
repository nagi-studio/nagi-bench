import * as THREE from "three";

/** Small maths, noise and keyframe helpers shared by every set and shot. */

export type V3 = [number, number, number];

export const clamp = (x: number, a = 0, b = 1): number => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const sstep = (t: number): number => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
export const easeIO = (t: number): number => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const easeOut = (t: number): number => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = (t: number): number => Math.pow(clamp(t), 3);
/** Clamped 0..1 progress of `t` between a and b. */
export const seg = (t: number, a: number, b: number): number => (b <= a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a)));
/** 0 → 1 → 0 window with soft edges. */
export const win = (t: number, a: number, b: number, fi = 0.4, fo = 0.4): number => {
  if (t <= a || t >= b) return 0;
  return sstep(Math.min((t - a) / Math.max(1e-4, fi), (b - t) / Math.max(1e-4, fo)));
};

export function hash1(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

export function hash3(x: number, y: number, z: number): number {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 2147483647 - 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export function vnoise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), u);
  const x10 = lerp(c(0, 1, 0), c(1, 1, 0), u);
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), u);
  const x11 = lerp(c(0, 1, 1), c(1, 1, 1), u);
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
}

export function fbm3(x: number, y: number, z: number, octaves = 4): number {
  let sum = 0, amp = 0.5, norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += vnoise3(x, y, z) * amp;
    norm += amp;
    x *= 2.03; y *= 2.03; z *= 2.03;
    amp *= 0.5;
  }
  return sum / norm;
}

/** Smooth 1D noise in -1..1, deterministic in t; used for handheld drift and bobbing. */
export function wobble(t: number, seed = 0): number {
  return (
    Math.sin(t * 1.0 + seed * 12.9898) * 0.5 +
    Math.sin(t * 2.31 + seed * 78.233) * 0.3 +
    Math.sin(t * 4.07 + seed * 37.719) * 0.2
  );
}

export function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Piecewise keyframes: [[time, value], ...] with smoothstep easing between keys. */
export function keys(t: number, k: Array<[number, number]>, easing: (x: number) => number = sstep): number {
  if (t <= k[0]![0]) return k[0]![1];
  for (let i = 1; i < k.length; i++) {
    const a = k[i - 1]!, b = k[i]!;
    if (t <= b[0]) return lerp(a[1], b[1], easing((t - a[0]) / (b[0] - a[0])));
  }
  return k[k.length - 1]![1];
}

export function keysV(t: number, k: Array<[number, V3]>, easing: (x: number) => number = sstep): V3 {
  if (t <= k[0]![0]) return [...k[0]![1]] as V3;
  for (let i = 1; i < k.length; i++) {
    const a = k[i - 1]!, b = k[i]!;
    if (t <= b[0]) {
      const u = easing((t - a[0]) / (b[0] - a[0]));
      return [lerp(a[1][0], b[1][0], u), lerp(a[1][1], b[1][1], u), lerp(a[1][2], b[1][2], u)];
    }
  }
  return [...k[k.length - 1]![1]] as V3;
}

export const v3lerp = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const v3add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const v3scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];

/** Colour helpers on packed 0xRRGGBB ints (sRGB), for per-voxel variation. */
export function shade(hex: number, k: number): number {
  const r = clamp(((hex >> 16) & 255) * k, 0, 255) | 0;
  const g = clamp(((hex >> 8) & 255) * k, 0, 255) | 0;
  const b = clamp((hex & 255) * k, 0, 255) | 0;
  return (r << 16) | (g << 8) | b;
}

export function mixHex(a: number, b: number, t: number): number {
  const u = clamp(t);
  const r = lerp((a >> 16) & 255, (b >> 16) & 255, u) | 0;
  const g = lerp((a >> 8) & 255, (b >> 8) & 255, u) | 0;
  const bl = lerp(a & 255, b & 255, u) | 0;
  return (r << 16) | (g << 8) | bl;
}

/** Deterministic brightness jitter keyed on a voxel coordinate. */
export function jit(hex: number, x: number, y: number, z: number, amount = 0.08): number {
  return shade(hex, 1 + (hash3(x, y, z) - 0.5) * 2 * amount);
}

export function hexCss(hex: number): string {
  return `#${hex.toString(16).padStart(6, "0")}`;
}

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

/** Aim a camera with an optional roll (radians) and set its lens. */
export function shootCam(cam: THREE.PerspectiveCamera, pos: V3, target: V3, fov: number, roll = 0, up?: V3): void {
  cam.position.set(pos[0], pos[1], pos[2]);
  if (up) cam.up.set(up[0], up[1], up[2]).normalize();
  else cam.up.set(0, 1, 0);
  cam.lookAt(target[0], target[1], target[2]);
  if (roll) cam.rotateZ(roll);
  if (cam.fov !== fov) {
    cam.fov = fov;
  }
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld(true);
}

/** Quaternion that makes an object's +Z face `dir` (world), with `up` as the roll reference. */
export function faceQuat(dir: THREE.Vector3, up: THREE.Vector3 = _up, out = new THREE.Quaternion()): THREE.Quaternion {
  _v.copy(dir).normalize();
  // Matrix4.lookAt builds a basis whose +Z points from target to eye.
  _m.lookAt(_v, new THREE.Vector3(0, 0, 0), up);
  return out.setFromRotationMatrix(_m);
}

/** Set an object's world orientation regardless of its parent chain. */
export function setWorldQuat(obj: THREE.Object3D, world: THREE.Quaternion): void {
  if (!obj.parent) {
    obj.quaternion.copy(world);
    return;
  }
  obj.parent.updateWorldMatrix(true, false);
  obj.parent.getWorldQuaternion(_q);
  obj.quaternion.copy(_q.invert().multiply(world));
}

export const V = (a: V3): THREE.Vector3 => new THREE.Vector3(a[0], a[1], a[2]);

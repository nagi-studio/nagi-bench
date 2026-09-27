import * as THREE from "three";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const seg = (t: number, a: number, b: number) => (b <= a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a)));
export const smooth = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const easeIn = (x: number) => Math.pow(clamp(x), 3);
export const easeInOut = (x: number) => {
  const t = clamp(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
export const DEG = Math.PI / 180;

export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stateless hash to 0..1. */
export function hash(...n: number[]): number {
  let h = 2166136261;
  for (const v of n) {
    h ^= Math.floor(v * 1000003) | 0;
    h = Math.imul(h, 16777619);
    h ^= h >>> 13;
  }
  return ((h >>> 0) % 100000) / 100000;
}

function h3(x: number, y: number, z: number, s: number): number {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647) ^ Math.imul(s, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export function noise3(x: number, y: number, z: number, seed = 0): number {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  let out = 0;
  for (let dz = 0; dz < 2; dz++)
    for (let dy = 0; dy < 2; dy++)
      for (let dx = 0; dx < 2; dx++) {
        const k = h3(xi + dx, yi + dy, zi + dz, seed);
        out += k * (dx ? u : 1 - u) * (dy ? v : 1 - v) * (dz ? w : 1 - w);
      }
  return out;
}

export function fbm(x: number, y: number, z: number, oct = 4, seed = 0): number {
  let a = 0.5, f = 1, s = 0, n = 0;
  for (let i = 0; i < oct; i++) {
    s += a * noise3(x * f, y * f, z * f, seed + i * 17);
    n += a;
    a *= 0.5;
    f *= 2.03;
  }
  return s / n;
}

/** Piecewise-linear lookup over sorted [time, value] keys, smoothed per segment. */
export function keyed(keys: Array<[number, number]>, t: number, ease: (x: number) => number = smooth): number {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1] = keys[i];
      return lerp(v0, v1, ease((t - t0) / (t1 - t0)));
    }
  }
  return keys[keys.length - 1][1];
}

export type V3 = [number, number, number];
export const v3 = (a: V3) => new THREE.Vector3(a[0], a[1], a[2]);

export interface CamKey {
  t: number;
  pos: V3;
  look: V3;
  fov?: number;
  roll?: number;
}

const _p = new THREE.Vector3();
const _l = new THREE.Vector3();
const _q = new THREE.Vector3();

/** Evaluate a camera path at local time; eases between successive keys. */
export function camPath(
  cam: THREE.PerspectiveCamera,
  keys: CamKey[],
  t: number,
  ease: (x: number) => number = easeInOut,
): void {
  let a = keys[0], b = keys[0], k = 0;
  if (t <= keys[0].t) {
    a = b = keys[0];
  } else if (t >= keys[keys.length - 1].t) {
    a = b = keys[keys.length - 1];
  } else {
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i].t) {
        a = keys[i - 1];
        b = keys[i];
        k = ease((t - a.t) / (b.t - a.t));
        break;
      }
    }
  }
  _p.set(lerp(a.pos[0], b.pos[0], k), lerp(a.pos[1], b.pos[1], k), lerp(a.pos[2], b.pos[2], k));
  _l.set(lerp(a.look[0], b.look[0], k), lerp(a.look[1], b.look[1], k), lerp(a.look[2], b.look[2], k));
  const fov = lerp(a.fov ?? 40, b.fov ?? a.fov ?? 40, k);
  const roll = lerp(a.roll ?? 0, b.roll ?? 0, k);
  setCam(cam, _p, _l, fov, roll);
}

export function setCam(cam: THREE.PerspectiveCamera, pos: THREE.Vector3, look: THREE.Vector3, fov: number, roll = 0): void {
  cam.position.copy(pos);
  cam.up.set(0, 1, 0);
  cam.lookAt(look);
  if (roll) cam.rotateZ(roll);
  if (Math.abs(cam.fov - fov) > 1e-6) {
    cam.fov = fov;
    cam.updateProjectionMatrix();
  }
}

export function setClip(cam: THREE.PerspectiveCamera, near: number, far: number): void {
  if (cam.near !== near || cam.far !== far) {
    cam.near = near;
    cam.far = far;
    cam.updateProjectionMatrix();
  }
}

/** Small hand-held drift, a pure function of time. */
export function shake(t: number, amp: number, seed = 0): V3 {
  return [
    (Math.sin(t * 1.3 + seed) * 0.6 + Math.sin(t * 2.9 + seed * 2) * 0.4) * amp,
    (Math.sin(t * 1.7 + seed * 3) * 0.6 + Math.sin(t * 3.3 + seed) * 0.4) * amp,
    Math.sin(t * 1.1 + seed * 5) * amp * 0.5,
  ];
}

export function std(color: number | string, opts: THREE.MeshStandardMaterialParameters = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts });
}

export function box(
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
  pos: V3 = [0, 0, 0],
  parent?: THREE.Object3D,
  shadow = true,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(pos[0], pos[1], pos[2]);
  m.castShadow = shadow;
  m.receiveShadow = shadow;
  parent?.add(m);
  return m;
}

export function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, nearest = false): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  draw(ctx);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  if (nearest) {
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
  }
  return tex;
}

/** Soft radial glow texture for sprites (additive). */
export function glowTex(stops: Array<[number, string]>, size = 128): THREE.CanvasTexture {
  return canvasTex(size, size, (c) => {
    const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    for (const [o, col] of stops) g.addColorStop(o, col);
    c.fillStyle = g;
    c.fillRect(0, 0, size, size);
  });
}

export function hex(c: string): number {
  return parseInt(c.replace("#", ""), 16);
}

/** Jitter a hex colour's brightness deterministically. */
export function shadeHex(c: number, k: number): number {
  const r = clamp(((c >> 16) & 255) * k, 0, 255);
  const g = clamp(((c >> 8) & 255) * k, 0, 255);
  const b = clamp((c & 255) * k, 0, 255);
  return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
}

export function mixHex(a: number, b: number, t: number): number {
  const r = lerp((a >> 16) & 255, (b >> 16) & 255, t);
  const g = lerp((a >> 8) & 255, (b >> 8) & 255, t);
  const bl = lerp(a & 255, b & 255, t);
  return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(bl);
}

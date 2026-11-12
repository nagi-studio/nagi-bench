import * as THREE from "three";
import { clamp01, smoothstep, easeInOutCubic } from "@agentbench/cinematic-player";

export { clamp01, smoothstep, easeInOutCubic };

/** Deterministic hash noise. */
export function hash3(x: number, y: number, z: number, seed = 0): number {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647 + seed * 144269504) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = h ^ (h >>> 16);
  return ((h >>> 0) % 100000) / 100000;
}

function fade(t: number) {
  return t * t * (3 - 2 * t);
}

/** Smooth 3D value noise in 0..1. */
export function vnoise(x: number, y: number, z: number, seed = 0): number {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const c = (a: number, b: number, d: number) => hash3(xi + a, yi + b, zi + d, seed);
  const x00 = THREE.MathUtils.lerp(c(0, 0, 0), c(1, 0, 0), xf);
  const x10 = THREE.MathUtils.lerp(c(0, 1, 0), c(1, 1, 0), xf);
  const x01 = THREE.MathUtils.lerp(c(0, 0, 1), c(1, 0, 1), xf);
  const x11 = THREE.MathUtils.lerp(c(0, 1, 1), c(1, 1, 1), xf);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(x00, x10, yf), THREE.MathUtils.lerp(x01, x11, yf), zf);
}

export function fbm(x: number, y: number, z: number, octaves = 4, seed = 0): number {
  let sum = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += vnoise(x * f, y * f, z * f, seed + i * 17) * amp;
    norm += amp;
    amp *= 0.5;
    f *= 2.03;
  }
  return sum / norm;
}

export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const sseg = (t: number, a: number, b: number) => smoothstep(seg(t, a, b));
export const eseg = (t: number, a: number, b: number) => easeInOutCubic(seg(t, a, b));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function v3(x: number, y: number, z: number) {
  return new THREE.Vector3(x, y, z);
}

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

/** Interpolated camera move between two framings. */
export function camMove(
  cam: THREE.PerspectiveCamera,
  fromPos: THREE.Vector3,
  toPos: THREE.Vector3,
  fromLook: THREE.Vector3,
  toLook: THREE.Vector3,
  t: number,
  fov?: number | [number, number],
  roll = 0,
) {
  cam.position.lerpVectors(fromPos, toPos, t);
  tmpA.lerpVectors(fromLook, toLook, t);
  cam.up.set(Math.sin(roll), Math.cos(roll), 0);
  cam.lookAt(tmpA);
  if (fov !== undefined) {
    const f = Array.isArray(fov) ? mix(fov[0], fov[1], t) : fov;
    if (cam.fov !== f) {
      cam.fov = f;
      cam.updateProjectionMatrix();
    }
  }
}

export function setFov(cam: THREE.PerspectiveCamera, fov: number) {
  if (Math.abs(cam.fov - fov) > 1e-6) {
    cam.fov = fov;
    cam.updateProjectionMatrix();
  }
}

/** Hand-held breathing drift, deterministic from time. */
export function handheld(cam: THREE.PerspectiveCamera, t: number, amount = 1) {
  cam.rotation.x += (Math.sin(t * 1.3) * 0.004 + Math.sin(t * 2.7 + 1) * 0.002) * amount;
  cam.rotation.y += (Math.sin(t * 0.9 + 2) * 0.004 + Math.sin(t * 2.1) * 0.0015) * amount;
}

export function worldPos(obj: THREE.Object3D, out = new THREE.Vector3()): THREE.Vector3 {
  obj.updateWorldMatrix(true, false);
  return out.setFromMatrixPosition(obj.matrixWorld);
}

export function worldPosOffset(obj: THREE.Object3D, local: THREE.Vector3, out = new THREE.Vector3()) {
  obj.updateWorldMatrix(true, false);
  return out.copy(local).applyMatrix4(obj.matrixWorld);
}

export function lookFrom(cam: THREE.PerspectiveCamera, pos: THREE.Vector3, target: THREE.Vector3) {
  cam.position.copy(pos);
  cam.up.set(0, 1, 0);
  cam.lookAt(target);
}

export { tmpA, tmpB };

/** Canvas helper for procedural textures. */
export function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, nearest = false) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  draw(ctx);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  if (nearest) {
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
  }
  return tex;
}

/** Soft radial glow sprite texture. */
let glowTex: THREE.Texture | null = null;
export function glowTexture(): THREE.Texture {
  if (glowTex) return glowTex;
  glowTex = canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.2, "rgba(255,255,255,0.55)");
    g.addColorStop(0.5, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  });
  return glowTex;
}

/** Square soft particle: keeps the blocky language while still reading as gas. */
let puffTex: THREE.Texture | null = null;
export function puffTexture(): THREE.Texture {
  if (puffTex) return puffTex;
  puffTex = canvasTexture(32, 32, (ctx) => {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const dx = x - 3.5, dy = y - 3.5;
        const d = Math.sqrt(dx * dx + dy * dy) / 4.6;
        const a = Math.max(0, 1 - d) * (0.75 + hash3(x, y, 3) * 0.25);
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        ctx.fillRect(x * 4, y * 4, 4, 4);
      }
    }
  }, true);
  return puffTex;
}

export function makeGlowSprite(color: THREE.ColorRepresentation, scale: number, opacity = 1) {
  const m = new THREE.SpriteMaterial({
    map: glowTexture(),
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const s = new THREE.Sprite(m);
  s.scale.setScalar(scale);
  return s;
}

export function boxMesh(w: number, h: number, d: number, mat: THREE.Material) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
}

export function std(color: THREE.ColorRepresentation, rough = 0.9, metal = 0, extra: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
}

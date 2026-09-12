import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* deterministic helpers                                               */
/* ------------------------------------------------------------------ */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

export function smoothstep(v: number): number {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
}

export function easeInOutCubic(v: number): number {
  const t = clamp01(v);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutCubic(v: number): number {
  const t = clamp01(v);
  return 1 - Math.pow(1 - t, 3);
}

/** progress of `t` inside [a,b], clamped 0..1 */
export function seg(t: number, a: number, b: number): number {
  return clamp01((t - a) / (b - a));
}

/** smooth pulse: 1 at mid, 0 at edges */
export function pulse(t: number, a: number, mid: number, b: number): number {
  if (t <= a || t >= b) return 0;
  return t < mid ? smoothstep((t - a) / (mid - a)) : 1 - smoothstep((t - mid) / (b - mid));
}

export function fadeEnvelope(time: number, start: number, end: number, fadeIn: number, fadeOut: number): number {
  if (time <= start || time >= end) return 0;
  const lo = clamp01((time - start) / fadeIn);
  const hi = clamp01((end - time) / fadeOut);
  return Math.min(lo, hi);
}

/* ------------------------------------------------------------------ */
/* canvas textures                                                     */
/* ------------------------------------------------------------------ */

export function makeCanvasTexture(
  size: number,
  draw: (ctx: CanvasRenderingContext2D, s: number) => void,
  opts: { srgb?: boolean } = {},
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = opts.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  return texture;
}

/** soft round glow sprite texture */
export function glowTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)"): THREE.Texture {
  return makeCanvasTexture(128, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.35, inner.replace(/[\d.]+\)$/, "0.55)"));
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

/** small hard square sprite for stars / dust */
export function starTexture(core = "#ffffff"): THREE.Texture {
  return makeCanvasTexture(16, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, core);
    g.addColorStop(0.4, "rgba(255,255,255,0.4)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

/* ------------------------------------------------------------------ */
/* camera rig                                                          */
/* ------------------------------------------------------------------ */

export interface CamKey {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
  ease?: "smooth" | "inout" | "out" | "linear";
}

const _pa = new THREE.Vector3();
const _pb = new THREE.Vector3();
const _la = new THREE.Vector3();
const _lb = new THREE.Vector3();
const _tmp = new THREE.Vector3();

export class CamRig {
  constructor(public keys: CamKey[], public wobble = 0.0) {}

  /** apply to camera for a given local time (seconds) */
  apply(camera: THREE.PerspectiveCamera, t: number, seed = 0): void {
    const keys = this.keys;
    if (t <= keys[0]!.t) this.setFrom(camera, keys[0]!, t, seed);
    else if (t >= keys[keys.length - 1]!.t) this.setFrom(camera, keys[keys.length - 1]!, t, seed);
    else {
      for (let i = 0; i < keys.length - 1; i++) {
        const a = keys[i]!;
        const b = keys[i + 1]!;
        if (t >= a.t && t <= b.t) {
          const k = (t - a.t) / Math.max(1e-5, b.t - a.t);
          let e = k;
          const mode = b.ease ?? "smooth";
          if (mode === "smooth") e = smoothstep(k);
          else if (mode === "inout") e = easeInOutCubic(k);
          else if (mode === "out") e = easeOutCubic(k);
          _pa.set(...a.pos);
          _pb.set(...b.pos);
          _la.set(...a.look);
          _lb.set(...b.look);
          _tmp.lerpVectors(_pa, _pb, e);
          camera.position.copy(_tmp);
          _tmp.lerpVectors(_la, _lb, e);
          camera.lookAt(_tmp);
          camera.fov = a.fov + (b.fov - a.fov) * e;
          camera.updateProjectionMatrix();
          this.addWobble(camera, t, seed);
          return;
        }
      }
    }
  }

  private setFrom(camera: THREE.PerspectiveCamera, k: CamKey, t: number, seed: number): void {
    camera.position.set(...k.pos);
    camera.lookAt(new THREE.Vector3(...k.look));
    camera.fov = k.fov;
    camera.updateProjectionMatrix();
    this.addWobble(camera, t, seed);
  }

  private addWobble(camera: THREE.PerspectiveCamera, t: number, seed: number): void {
    if (this.wobble <= 0) return;
    const w = this.wobble;
    const x = (Math.sin(t * 1.9 + seed * 3.1) + Math.sin(t * 0.7 + seed)) * 0.5 * w;
    const y = (Math.sin(t * 2.3 + seed * 1.7) + Math.sin(t * 0.9 + seed * 5.0)) * 0.5 * w;
    const z = (Math.sin(t * 1.4 + seed * 2.2) + Math.sin(t * 0.6 + seed * 4.0)) * 0.5 * w;
    camera.position.x += x;
    camera.position.y += y;
    camera.position.z += z;
  }
}

/* ------------------------------------------------------------------ */
/* generic helpers                                                     */
/* ------------------------------------------------------------------ */

export function box(
  w: number,
  h: number,
  d: number,
  material: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  return m;
}

export function disposeGroup(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = (mesh as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else mat?.dispose();
  });
}

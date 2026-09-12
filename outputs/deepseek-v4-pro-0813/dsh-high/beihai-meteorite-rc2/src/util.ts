import * as THREE from "three";

export const V3 = (x = 0, y = 0, z = 0): THREE.Vector3 => new THREE.Vector3(x, y, z);

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothstep(v: number): number {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
}

export function easeInOutCubic(v: number): number {
  const x = clamp01(v);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOutCubic(v: number): number {
  const x = clamp01(v);
  return 1 - Math.pow(1 - x, 3);
}

/** Deterministic hash noise in [0,1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Solid-colour standard material for architectural boxes (block language). */
export function solidBox(
  w: number,
  h: number,
  d: number,
  color: number | string,
  opts: THREE.MeshStandardMaterialParameters = {},
): THREE.Mesh {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.92,
    metalness: 0.05,
    ...opts,
  });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  return mesh;
}

/** Cheap glass material. */
export function glassMaterial(opacity = 0.22, color = 0xbfd8e8): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.12,
    metalness: 0.25,
    transparent: true,
    opacity,
    depthWrite: false,
  });
}

export interface CamKey {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov?: number;
}

/**
 * Interpolate camera keyframes against a 0..1 progress value and write the
 * result into the camera. Purely time-derived, so seeking is exact.
 */
export function applyCamKeys(
  camera: THREE.PerspectiveCamera,
  keys: CamKey[],
  p: number,
  defaultFov = 42,
): void {
  if (keys.length === 0) return;
  const clamped = clamp01(p);
  let a = keys[0];
  let b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (clamped >= keys[i].t && clamped <= keys[i + 1].t) {
      a = keys[i];
      b = keys[i + 1];
      break;
    }
  }
  const span = Math.max(1e-6, b.t - a.t);
  const raw = (clamped - a.t) / span;
  const tt = easeInOutCubic(raw);
  const pos = V3(
    lerp(a.pos[0], b.pos[0], tt),
    lerp(a.pos[1], b.pos[1], tt),
    lerp(a.pos[2], b.pos[2], tt),
  );
  const look = V3(
    lerp(a.look[0], b.look[0], tt),
    lerp(a.look[1], b.look[1], tt),
    lerp(a.look[2], b.look[2], tt),
  );
  camera.position.copy(pos);
  camera.lookAt(look);
  const fov = lerp(a.fov ?? defaultFov, b.fov ?? defaultFov, tt);
  if (Math.abs(camera.fov - fov) > 0.001) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

export function setCam(
  camera: THREE.PerspectiveCamera,
  pos: [number, number, number],
  look: [number, number, number],
  fov = 42,
): void {
  camera.position.set(...pos);
  camera.lookAt(V3(...look));
  if (Math.abs(camera.fov - fov) > 0.001) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

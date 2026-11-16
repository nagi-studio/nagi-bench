import * as THREE from "three";
import { clamp01, lerp, smoothstep, easeInOutCubic, segmentProgress } from "@agentbench/cinematic-player";

export { clamp01, lerp, smoothstep, easeInOutCubic, segmentProgress };

export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

/** Smooth 0..1 ramp between two absolute times. */
export function ramp(time: number, a: number, b: number): number {
  return smoothstep(segmentProgress(time, a, b));
}

/** Trapezoid envelope: rises over [a,b], holds, falls over [c,d]. */
export function envelope(time: number, a: number, b: number, c: number, d: number): number {
  return smoothstep(segmentProgress(time, a, b)) * (1 - smoothstep(segmentProgress(time, c, d)));
}

/** Deterministic hash noise in 0..1. */
export function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
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

/**
 * A reusable camera operator. Every shot sets a keyframed rig; we interpolate
 * position / target / fov from absolute time so seeking is exact.
 */
export interface CamKey {
  t: number;
  pos: THREE.Vector3;
  look: THREE.Vector3;
  fov?: number;
  roll?: number;
}

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

export function driveCamera(
  camera: THREE.PerspectiveCamera,
  keys: CamKey[],
  time: number,
  handheld = 0,
): void {
  if (keys.length === 0) return;
  let i = 0;
  while (i < keys.length - 1 && time >= keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const span = Math.max(1e-5, b.t - a.t);
  const k = a === b ? 0 : easeInOutCubic(clamp01((time - a.t) / span));
  _pos.lerpVectors(a.pos, b.pos, k);
  _look.lerpVectors(a.look, b.look, k);
  const fov = lerp(a.fov ?? 45, b.fov ?? a.fov ?? 45, k);
  const roll = lerp(a.roll ?? 0, b.roll ?? a.roll ?? 0, k);

  if (handheld > 0) {
    const t = time;
    _pos.x += Math.sin(t * 1.7) * 0.02 * handheld + Math.sin(t * 0.63 + 2) * 0.015 * handheld;
    _pos.y += Math.sin(t * 2.1 + 1) * 0.018 * handheld + Math.cos(t * 0.51) * 0.012 * handheld;
    _look.x += Math.sin(t * 1.3 + 4) * 0.01 * handheld;
    _look.y += Math.cos(t * 1.9 + 2) * 0.008 * handheld;
  }

  camera.position.copy(_pos);
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(_look);
  if (Math.abs(camera.fov - fov) > 1e-4) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

/** Convenience: build a two-key dolly. */
export function dolly(
  t0: number, t1: number,
  p0: THREE.Vector3, p1: THREE.Vector3,
  l0: THREE.Vector3, l1: THREE.Vector3,
  fov0 = 45, fov1 = fov0,
): CamKey[] {
  return [
    { t: t0, pos: p0, look: l0, fov: fov0 },
    { t: t1, pos: p1, look: l1, fov: fov1 },
  ];
}

export function setFov(camera: THREE.PerspectiveCamera, fov: number): void {
  if (Math.abs(camera.fov - fov) > 1e-4) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

/** Project a world point to normalized device coords (-1..1) for framing checks. */
export function projectToScreen(camera: THREE.PerspectiveCamera, world: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  out.copy(world).project(camera);
  return out;
}
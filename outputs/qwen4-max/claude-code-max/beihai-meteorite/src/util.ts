import * as THREE from "three";
import { clamp01, lerp, smoothstep } from "@agentbench/cinematic-player";

/** Deterministic PRNG so every replay and seek reproduces the same film. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export { clamp01, lerp, smoothstep };

export function easeInOut(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

export function easeIn(t: number): number {
  return Math.pow(clamp01(t), 3);
}

/** Normalised progress of `time` within [start,end], clamped 0..1. */
export function seg(time: number, start: number, end: number): number {
  return clamp01((time - start) / (end - start));
}

/** Smooth 0→1→0 pulse centred in [start,end]. */
export function pulse(time: number, start: number, end: number): number {
  const x = seg(time, start, end);
  return Math.sin(Math.PI * x);
}

export type V3 = [number, number, number];

export interface CamKey {
  t: number;
  pos: V3;
  look: V3;
  fov?: number;
  roll?: number;
  near?: number;
  far?: number;
}

const _pa = new THREE.Vector3();
const _pb = new THREE.Vector3();
const _la = new THREE.Vector3();
const _lb = new THREE.Vector3();
const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

/**
 * Sample a camera track at localTime. Keys are interpolated with smoothstep so
 * moves ease in and out; the result is a pure function of time (seek-safe).
 */
export function sampleCam(keys: CamKey[], localTime: number): {
  pos: THREE.Vector3; look: THREE.Vector3; fov: number; roll: number; near: number; far: number;
} {
  let i = 0;
  while (i < keys.length - 1 && localTime > keys[i + 1]!.t) i++;
  const a = keys[i]!;
  const b = keys[Math.min(i + 1, keys.length - 1)]!;
  const span = Math.max(1e-6, b.t - a.t);
  const x = a === b ? 1 : smoothstep(clamp01((localTime - a.t) / span));
  _pa.fromArray(a.pos); _pb.fromArray(b.pos);
  _la.fromArray(a.look); _lb.fromArray(b.look);
  _pos.lerpVectors(_pa, _pb, x);
  _look.lerpVectors(_la, _lb, x);
  return {
    pos: _pos.clone(),
    look: _look.clone(),
    fov: lerp(a.fov ?? 45, b.fov ?? a.fov ?? 45, x),
    roll: lerp(a.roll ?? 0, b.roll ?? a.roll ?? 0, x),
    near: a.near ?? 0.05,
    far: a.far ?? 6000,
  };
}

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);

/** Place a camera from a sampled track, applying roll about the view axis. */
export function applyCam(
  camera: THREE.PerspectiveCamera,
  s: { pos: THREE.Vector3; look: THREE.Vector3; fov: number; roll: number; near: number; far: number },
): void {
  camera.position.copy(s.pos);
  camera.up.copy(_up);
  _m.lookAt(s.pos, s.look, _up);
  _q.setFromRotationMatrix(_m);
  camera.quaternion.copy(_q);
  if (s.roll) camera.rotateZ(s.roll);
  if (camera.fov !== s.fov) { camera.fov = s.fov; }
  camera.near = s.near;
  camera.far = s.far;
  camera.updateProjectionMatrix();
}

/** Tiny deterministic handheld drift, added on top of a track. */
export function handheld(camera: THREE.PerspectiveCamera, time: number, amount = 0.02): void {
  camera.position.x += Math.sin(time * 1.7) * amount + Math.sin(time * 3.1 + 1) * amount * 0.4;
  camera.position.y += Math.sin(time * 2.3 + 2) * amount + Math.cos(time * 1.1) * amount * 0.3;
  camera.rotateZ(Math.sin(time * 0.9) * amount * 0.06);
}

export function v3(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, y, z);
}

/** Hex colour lerp helper returning a THREE.Color. */
export function mixHex(a: number, b: number, t: number): THREE.Color {
  return new THREE.Color(a).lerp(new THREE.Color(b), clamp01(t));
}

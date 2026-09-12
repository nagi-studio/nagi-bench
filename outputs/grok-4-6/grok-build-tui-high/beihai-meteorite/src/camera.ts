import * as THREE from "three";
import { clamp01, easeInOutCubic, lerp } from "@agentbench/cinematic-player";

export type CamKey = {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov?: number;
  roll?: number;
};

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

export function applyCamera(
  camera: THREE.PerspectiveCamera,
  localTime: number,
  keys: CamKey[],
  handheld = 0,
  time = 0,
): void {
  if (keys.length === 0) return;
  if (localTime <= keys[0]!.t) {
    setCam(camera, keys[0]!, handheld, time);
    return;
  }
  const last = keys[keys.length - 1]!;
  if (localTime >= last.t) {
    setCam(camera, last, handheld, time);
    return;
  }
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1]!.t < localTime) i += 1;
  const a = keys[i]!;
  const b = keys[i + 1]!;
  const u = easeInOutCubic(clamp01((localTime - a.t) / Math.max(0.0001, b.t - a.t)));
  const key: CamKey = {
    t: localTime,
    pos: [lerp(a.pos[0], b.pos[0], u), lerp(a.pos[1], b.pos[1], u), lerp(a.pos[2], b.pos[2], u)],
    look: [lerp(a.look[0], b.look[0], u), lerp(a.look[1], b.look[1], u), lerp(a.look[2], b.look[2], u)],
    fov: lerp(a.fov ?? 42, b.fov ?? 42, u),
    roll: lerp(a.roll ?? 0, b.roll ?? 0, u),
  };
  setCam(camera, key, handheld, time);
}

function setCam(camera: THREE.PerspectiveCamera, key: CamKey, handheld: number, time: number): void {
  const hx = handheld ? Math.sin(time * 1.13) * handheld + Math.sin(time * 2.41) * handheld * 0.35 : 0;
  const hy = handheld ? Math.sin(time * 0.97 + 1.2) * handheld * 0.7 : 0;
  const hz = handheld ? Math.cos(time * 0.83) * handheld * 0.4 : 0;
  _pos.set(key.pos[0] + hx, key.pos[1] + hy, key.pos[2] + hz);
  _look.set(key.look[0], key.look[1], key.look[2]);
  camera.position.copy(_pos);
  camera.up.set(0, 1, 0);
  if (key.roll) {
    _up.set(Math.sin(key.roll), Math.cos(key.roll), 0);
    camera.up.copy(_up);
  }
  camera.lookAt(_look);
  camera.fov = key.fov ?? 42;
  camera.updateProjectionMatrix();
}

export function shakeOffset(time: number, t0: number, duration = 0.45, amp = 0.08): THREE.Vector3 {
  if (time < t0 || time > t0 + duration) return new THREE.Vector3();
  const u = 1 - (time - t0) / duration;
  const s = u * u * amp;
  return new THREE.Vector3(
    (hashish(time * 40) - 0.5) * s * 2,
    (hashish(time * 40 + 8) - 0.5) * s * 1.4,
    (hashish(time * 40 + 19) - 0.5) * s,
  );
}

function hashish(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

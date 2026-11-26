import * as THREE from "three";
import type { CharacterSkins } from "../characters/skins";
import type { CollectorCast, ZhangCast } from "../characters/cast";
import type { HutongSet } from "../sets/hutongSet";
import type { WorkshopSet } from "../sets/workshopSet";
import type { BasementSet } from "../sets/basementSet";
import type { OrbitSet } from "../sets/orbitSet";

/** Total film duration in seconds (04:48 — cleanly inside the 360s hard limit). */
export const FILM_DURATION = 288.0;

export interface OverlayControls {
  setFade(opacity: number, color?: string): void;
  setScope(opacity: number, statusText?: string): void;
  setOpeningTitle(opacity: number): void;
  setEndingTitle(opacity: number): void;
}

export interface FilmContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  skins: CharacterSkins;
  zhang: ZhangCast;
  collector: CollectorCast;
  hutong: HutongSet;
  workshop: WorkshopSet;
  basement: BasementSet;
  orbit: OrbitSet;
  overlays: OverlayControls;
  setActiveEnvironment(env: "orbit" | "hutong" | "workshop" | "basement"): void;
}

const _tmpPos = new THREE.Vector3();
const _tmpLook = new THREE.Vector3();

/** Helper for clean deterministic camera interpolation & lens control. */
export function setCameraLerp(
  camera: THREE.PerspectiveCamera,
  fromPos: [number, number, number],
  toPos: [number, number, number],
  fromLook: [number, number, number],
  toLook: [number, number, number],
  t: number,
  fov = 42,
): void {
  _tmpPos.set(
    fromPos[0] + (toPos[0] - fromPos[0]) * t,
    fromPos[1] + (toPos[1] - fromPos[1]) * t,
    fromPos[2] + (toPos[2] - fromPos[2]) * t,
  );
  _tmpLook.set(
    fromLook[0] + (toLook[0] - fromLook[0]) * t,
    fromLook[1] + (toLook[1] - fromLook[1]) * t,
    fromLook[2] + (toLook[2] - fromLook[2]) * t,
  );
  camera.position.copy(_tmpPos);
  camera.lookAt(_tmpLook);
  if (Math.abs(camera.fov - fov) > 0.05) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

/** Compute deterministic pulse (0..1) from an array of trigger timestamps. */
export function multiShotPulse(
  time: number,
  triggers: readonly number[],
  decaySeconds: number,
): { intensity: number; countFired: number } {
  let intensity = 0;
  let countFired = 0;
  for (const t0 of triggers) {
    const dt = time - t0;
    if (dt >= 0) {
      countFired++;
      if (dt < decaySeconds) {
        const p = 1 - dt / decaySeconds;
        intensity = Math.max(intensity, p * p);
      }
    }
  }
  return { intensity, countFired };
}

import * as THREE from "three";
import type { CameraRig } from "../lib/cameraRig";
import type { VoxelActor } from "../art/characters";
import type { SetHandle } from "../sets/shared";

/** Everything a shot is allowed to touch. */
export interface World {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  rig: CameraRig;
  sets: Record<string, SetHandle>;
  actors: Record<string, VoxelActor>;
  /** scene background + fog lerp targets for the current shot */
  env: EnvState;
  fx: FxBus;
  time: number;
  dt: number;
  /** internal: called by the director after the shot update */
  tick(time: number, dt: number): void;
}

export interface EnvState {
  bg: THREE.Color;
  fog: THREE.Color;
  fogDensity: number;
  exposure: number;
  bloom: number;
}

export interface FxBus {
  sparkBurst(pos: THREE.Vector3, count?: number, color?: number, speed?: number): void;
  smoke(pos: THREE.Vector3, count?: number, color?: number, speed?: number): void;
  flash(pos: THREE.Vector3, color?: number, intensity?: number, decay?: number): void;
  debris(pos: THREE.Vector3, count?: number, color?: number, speed?: number): void;
  update(time: number, dt: number): void;
}

export interface Shot {
  id: string;
  start: number;
  end: number;
  set: string;
  /** short human-readable description of the shot for diagnostics */
  note: string;
  update(w: World, p: number): void;
}

export interface Ctx {
  w: World;
  p: number;
}

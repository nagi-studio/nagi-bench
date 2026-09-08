import * as THREE from "three";
import { clamp, easeInOutCubic, lerp, smootherstep } from "./rng";

/**
 * Camera direction.
 *
 * Shots describe a move as a list of keyframes; the rig samples them, adds a
 * small amount of human drift and optional impact shake, and writes the final
 * pose onto the PerspectiveCamera.
 */

export type EaseFn = (t: number) => number;

export interface VecKey {
  t: number;
  v: THREE.Vector3;
  ease?: EaseFn;
}

export interface NumKey {
  t: number;
  v: number;
  ease?: EaseFn;
}

export function vk(t: number, x: number, y: number, z: number, ease?: EaseFn): VecKey {
  return { t, v: new THREE.Vector3(x, y, z), ease };
}

export function nk(t: number, v: number, ease?: EaseFn): NumKey {
  return { t, v, ease };
}

/** Piecewise-interpolated vector track. */
export function sampleVec(keys: VecKey[], t: number, out = new THREE.Vector3()): THREE.Vector3 {
  if (!keys.length) return out.set(0, 0, 0);
  if (t <= keys[0].t) return out.copy(keys[0].v);
  const last = keys[keys.length - 1];
  if (t >= last.t) return out.copy(last.v);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t >= a.t && t <= b.t) {
      const span = Math.max(1e-6, b.t - a.t);
      let u = (t - a.t) / span;
      const e = b.ease ?? easeInOutCubic;
      u = e(clamp(u, 0, 1));
      return out.lerpVectors(a.v, b.v, u);
    }
  }
  return out.copy(last.v);
}

/** Piecewise-interpolated scalar track. */
export function sampleNum(keys: NumKey[], t: number): number {
  if (!keys.length) return 0;
  if (t <= keys[0].t) return keys[0].v;
  const last = keys[keys.length - 1];
  if (t >= last.t) return last.v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t >= a.t && t <= b.t) {
      const span = Math.max(1e-6, b.t - a.t);
      let u = (t - a.t) / span;
      const e = b.ease ?? easeInOutCubic;
      u = e(clamp(u, 0, 1));
      return lerp(a.v, b.v, u);
    }
  }
  return last.v;
}

export class CameraRig {
  readonly pos = new THREE.Vector3();
  readonly target = new THREE.Vector3();
  fov = 34;
  roll = 0;

  /** global handheld drift scale (0 = locked off) */
  handheld = 0.0;
  /** one-shot impact shake, decays */
  shake = 0;
  shakeSeed = Math.random() * 1000;

  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();
  private up = new THREE.Vector3(0, 1, 0);

  set(pos: THREE.Vector3, target: THREE.Vector3, fov = this.fov, roll = this.roll): this {
    this.pos.copy(pos);
    this.target.copy(target);
    this.fov = fov;
    this.roll = roll;
    return this;
  }

  punch(amount: number): void {
    this.shake = Math.max(this.shake, amount);
  }

  update(camera: THREE.PerspectiveCamera, time: number, dt: number): void {
    const p = this.tmp.copy(this.pos);
    const tgt = this.tmp2.copy(this.target);

    if (this.handheld > 0) {
      const s = this.handheld;
      p.x += Math.sin(time * 0.63 + this.shakeSeed) * s * 0.5 + Math.sin(time * 1.71 + 2.1) * s * 0.22;
      p.y += Math.cos(time * 0.71 + this.shakeSeed * 0.7) * s * 0.42 + Math.sin(time * 1.33) * s * 0.18;
      p.z += Math.sin(time * 0.47 + 1.7) * s * 0.4;
      tgt.x += Math.sin(time * 0.41 + 3.3) * s * 0.5;
      tgt.y += Math.cos(time * 0.53 + 1.1) * s * 0.4;
    }

    if (this.shake > 0.0001) {
      const a = this.shake;
      const f = 43;
      p.x += Math.sin(time * f + 1.0) * a * 0.14;
      p.y += Math.sin(time * f * 1.31 + 2.0) * a * 0.12;
      p.z += Math.sin(time * f * 0.77 + 3.0) * a * 0.1;
      tgt.x += Math.sin(time * f * 0.9) * a * 0.2;
      tgt.y += Math.cos(time * f * 1.1) * a * 0.18;
      this.shake *= Math.exp(-dt * 5.5);
      if (this.shake < 0.001) this.shake = 0;
    }

    camera.position.copy(p);
    camera.up.copy(this.up);
    camera.lookAt(tgt);
    if (this.roll) camera.rotateZ(this.roll);
    if (Math.abs(camera.fov - this.fov) > 0.01) {
      camera.fov = this.fov;
      camera.updateProjectionMatrix();
    }
  }
}

/** A slow, organic drift that never repeats exactly. */
export function drift(time: number, seed: number): number {
  return (
    Math.sin(time * 0.31 + seed) * 0.55 +
    Math.sin(time * 0.73 + seed * 2.3) * 0.28 +
    Math.sin(time * 1.51 + seed * 4.1) * 0.17
  );
}

export function smoothTo(a: number, b: number, speed: number, dt: number): number {
  return a + (b - a) * (1 - Math.exp(-speed * dt));
}

export { smootherstep };

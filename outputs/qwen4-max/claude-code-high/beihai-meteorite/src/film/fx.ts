import * as THREE from "three";
import { mulberry } from "./helpers";

/**
 * A fixed-pool CPU particle system rendered as one THREE.Points draw call.
 * Deterministic: positions are a pure function of (emitTime, age) so seeking
 * reproduces the exact same frame.
 */
export interface BurstSpec {
  count: number;
  color: number;
  size: number;
  speed: number;
  spread: number;
  life: number;
  gravity?: number;
  additive?: boolean;
  seed?: number;
}

export class ParticleBurst {
  readonly points: THREE.Points;
  private readonly pos: Float32Array;
  private readonly vel: Float32Array;
  private readonly spec: BurstSpec;
  private readonly origin = new THREE.Vector3();
  private emitTime = -1;
  private readonly material: THREE.PointsMaterial;

  constructor(spec: BurstSpec) {
    this.spec = spec;
    this.pos = new Float32Array(spec.count * 3);
    this.vel = new Float32Array(spec.count * 3);
    const rng = mulberry(spec.seed ?? 1);
    for (let i = 0; i < spec.count; i++) {
      // random direction on a sphere, biased by spread
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const s = spec.speed * (0.4 + rng() * 0.6);
      this.vel[i * 3] = Math.sin(phi) * Math.cos(theta) * s * spec.spread;
      this.vel[i * 3 + 1] = Math.cos(phi) * s * spec.spread;
      this.vel[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * s;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    this.material = new THREE.PointsMaterial({
      color: spec.color, size: spec.size, transparent: true, opacity: 0,
      depthWrite: false, blending: spec.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      sizeAttenuation: true,
    });
    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    this.points.visible = false;
  }

  emit(origin: THREE.Vector3, time: number): void {
    this.origin.copy(origin);
    this.emitTime = time;
    this.points.visible = true;
  }

  /** Pure function of absolute time. */
  update(time: number): void {
    if (this.emitTime < 0) { this.points.visible = false; return; }
    const age = time - this.emitTime;
    if (age < 0 || age > this.spec.life) { this.points.visible = false; this.material.opacity = 0; return; }
    this.points.visible = true;
    const g = this.spec.gravity ?? 0;
    for (let i = 0; i < this.spec.count; i++) {
      this.pos[i * 3] = this.origin.x + this.vel[i * 3] * age;
      this.pos[i * 3 + 1] = this.origin.y + this.vel[i * 3 + 1] * age - 0.5 * g * age * age;
      this.pos[i * 3 + 2] = this.origin.z + this.vel[i * 3 + 2] * age;
    }
    (this.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    const k = age / this.spec.life;
    this.material.opacity = (1 - k) * 0.9;
    this.material.size = this.spec.size * (1 + k * 1.5);
  }

  reset(): void { this.emitTime = -1; this.points.visible = false; this.material.opacity = 0; }
}

/** A cone of thruster exhaust (white mist), oriented along -Z of its group. */
export function makeThrusterTrail(count = 60): ParticleBurst {
  return new ParticleBurst({ count, color: 0xeef2f6, size: 0.5, speed: 6, spread: 0.35, life: 1.2, seed: 5 });
}

/** White gas venting from a punctured suit. */
export function makeGasJet(count = 120): ParticleBurst {
  return new ParticleBurst({ count, color: 0xf4f7fa, size: 0.7, speed: 5, spread: 0.8, life: 2.4, seed: 11 });
}

/** Blood freezing into snowflake ice crystals. */
export function makeIceCrystals(count = 90): ParticleBurst {
  return new ParticleBurst({ count, color: 0xe8a0a0, size: 0.35, speed: 3.2, spread: 1.0, life: 3.2, additive: true, seed: 23 });
}

/** CNC cutting sparks. */
export function makeSparks(count = 70): ParticleBurst {
  return new ParticleBurst({ count, color: 0xffb060, size: 0.05, speed: 2.2, spread: 0.9, life: 0.5, gravity: 3, additive: true, seed: 31 });
}
import * as THREE from "three";
import { mulberry32, clamp01 } from "../util";
import { puffTexture } from "./textures";

const PUFF = puffTexture();

function pointsMaterial(size: number, blending: THREE.Blending = THREE.AdditiveBlending): THREE.PointsMaterial {
  return new THREE.PointsMaterial({
    size, map: PUFF, transparent: true, blending,
    depthWrite: false, vertexColors: true, sizeAttenuation: true,
  });
}

/**
 * One-shot radial burst (gas jet, impact vapour, blood-ice). Born at t0, every
 * particle's position and brightness is derived from (time - t0), so seeking
 * to any moment reproduces the exact same frame.
 */
export class Burst {
  readonly points: THREE.Points;
  private dirs: Float32Array;
  private speeds: Float32Array;
  private phases: Float32Array;
  private pos: THREE.BufferAttribute;
  private col: THREE.BufferAttribute;
  private base: THREE.Color;
  readonly count: number;

  constructor(count: number, color: number, size: number, seed = 1, private spread = 1) {
    this.count = count;
    this.base = new THREE.Color(color);
    const rng = mulberry32(seed);
    this.dirs = new Float32Array(count * 3);
    this.speeds = new Float32Array(count);
    this.phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // uniform-ish sphere direction
      const u = rng() * 2 - 1;
      const th = rng() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      this.dirs[i * 3] = s * Math.cos(th);
      this.dirs[i * 3 + 1] = u;
      this.dirs[i * 3 + 2] = s * Math.sin(th);
      this.speeds[i] = (0.4 + rng() * 0.9) * spread;
      this.phases[i] = rng() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    this.pos = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    this.col = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    geo.setAttribute("position", this.pos);
    geo.setAttribute("color", this.col);
    this.points = new THREE.Points(geo, pointsMaterial(size));
    this.points.frustumCulled = false;
    this.points.visible = false;
  }

  /** origin: burst centre; life: seconds to full fade; glitter: ice sparkle. */
  update(time: number, t0: number, origin: THREE.Vector3, life: number, glitter = 0): void {
    const age = time - t0;
    if (age < 0 || age > life) { this.points.visible = false; return; }
    this.points.visible = true;
    const x = age / life;
    const fade = Math.pow(1 - x, 1.4);
    // rapid expansion then drag
    const dist = (1 - Math.exp(-age * 2.2)) * 2.4;
    for (let i = 0; i < this.count; i++) {
      const d = dist * this.speeds[i];
      this.pos.setXYZ(i,
        origin.x + this.dirs[i * 3] * d,
        origin.y + this.dirs[i * 3 + 1] * d,
        origin.z + this.dirs[i * 3 + 2] * d);
      let f = fade;
      if (glitter) f *= 0.55 + 0.45 * Math.sin(time * 14 + this.phases[i]);
      this.col.setXYZ(i, this.base.r * f, this.base.g * f, this.base.b * f);
    }
    this.pos.needsUpdate = true;
    this.col.needsUpdate = true;
  }
}

export type PathFn = (t: number) => THREE.Vector3;

/**
 * Continuous exhaust trails along moving paths (thrusters). Particle i of trail
 * k is born at start + i*interval; its position is path(birth) + dir*speed*age.
 */
export class Trails {
  readonly points: THREE.Points;
  private pos: THREE.BufferAttribute;
  private col: THREE.BufferAttribute;
  private jitter: Float32Array;
  private per: number;
  private base: THREE.Color;

  constructor(
    private paths: PathFn[],
    private dir: THREE.Vector3,
    perTrail: number,
    color: number,
    size: number,
    private interval = 0.05,
    private speed = 6,
    seed = 5,
  ) {
    this.per = perTrail;
    this.base = new THREE.Color(color);
    const count = paths.length * perTrail;
    const rng = mulberry32(seed);
    this.jitter = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) this.jitter[i] = (rng() - 0.5) * 0.5;
    const geo = new THREE.BufferGeometry();
    this.pos = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    this.col = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    geo.setAttribute("position", this.pos);
    geo.setAttribute("color", this.col);
    this.points = new THREE.Points(geo, pointsMaterial(size));
    this.points.frustumCulled = false;
    this.points.visible = false;
  }

  update(time: number, start: number, end: number, life = 1.4): void {
    if (time < start || time > end + life) { this.points.visible = false; return; }
    this.points.visible = true;
    let idx = 0;
    for (let k = 0; k < this.paths.length; k++) {
      const path = this.paths[k]!;
      for (let i = 0; i < this.per; i++, idx++) {
        const birth = start + i * this.interval;
        const age = time - birth;
        if (birth > end || age < 0 || age > life) {
          this.col.setXYZ(idx, 0, 0, 0);
          this.pos.setXYZ(idx, 0, -9999, 0);
          continue;
        }
        const o = path(birth);
        const f = Math.pow(1 - age / life, 1.3);
        this.pos.setXYZ(idx,
          o.x + this.dir.x * this.speed * age + this.jitter[idx * 3] * age,
          o.y + this.dir.y * this.speed * age + this.jitter[idx * 3 + 1] * age,
          o.z + this.dir.z * this.speed * age + this.jitter[idx * 3 + 2] * age);
        this.col.setXYZ(idx, this.base.r * f, this.base.g * f, this.base.b * f);
      }
    }
    this.pos.needsUpdate = true;
    this.col.needsUpdate = true;
  }
}

/** Ambient drifting dust motes in a volume — always alive, gentle sine drift. */
export class Dust {
  readonly points: THREE.Points;
  private base: Float32Array;
  private phase: Float32Array;
  private pos: THREE.BufferAttribute;
  private col: THREE.BufferAttribute;

  constructor(count: number, center: THREE.Vector3, extent: THREE.Vector3, color: number, size: number, seed = 3) {
    const rng = mulberry32(seed);
    this.base = new Float32Array(count * 3);
    this.phase = new Float32Array(count);
    const baseCol = new THREE.Color(color);
    const geo = new THREE.BufferGeometry();
    this.pos = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    this.col = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    for (let i = 0; i < count; i++) {
      this.base[i * 3] = center.x + (rng() - 0.5) * extent.x;
      this.base[i * 3 + 1] = center.y + (rng() - 0.5) * extent.y;
      this.base[i * 3 + 2] = center.z + (rng() - 0.5) * extent.z;
      this.phase[i] = rng() * Math.PI * 2;
      const b = 0.3 + rng() * 0.7;
      this.col.setXYZ(i, baseCol.r * b, baseCol.g * b, baseCol.b * b);
    }
    geo.setAttribute("position", this.pos);
    geo.setAttribute("color", this.col);
    this.points = new THREE.Points(geo, pointsMaterial(size));
    this.points.frustumCulled = false;
  }

  update(time: number): void {
    for (let i = 0; i < this.phase.length; i++) {
      const p = this.phase[i]!;
      this.pos.setXYZ(i,
        this.base[i * 3] + Math.sin(time * 0.3 + p) * 0.15,
        this.base[i * 3 + 1] + Math.sin(time * 0.22 + p * 1.7) * 0.2 + ((time * 0.02 + p) % 1) * 0.1,
        this.base[i * 3 + 2] + Math.cos(time * 0.26 + p) * 0.15);
    }
    this.pos.needsUpdate = true;
  }
}

/** Short-lived bright sparks for machining, falling under a pseudo-gravity. */
export class Sparks {
  readonly points: THREE.Points;
  private dirs: Float32Array;
  private speeds: Float32Array;
  private pos: THREE.BufferAttribute;
  private col: THREE.BufferAttribute;
  private per: number;

  constructor(private origin: THREE.Vector3, perSecond: number, color: number, size: number, seed = 9) {
    this.per = perSecond;
    const count = perSecond; // one second of sparks resident
    const rng = mulberry32(seed);
    this.dirs = new Float32Array(count * 3);
    this.speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      this.dirs[i * 3] = (rng() - 0.5) * 2;
      this.dirs[i * 3 + 1] = rng() * 1.4;
      this.dirs[i * 3 + 2] = (rng() - 0.5) * 2;
      this.speeds[i] = 0.6 + rng() * 1.6;
    }
    const geo = new THREE.BufferGeometry();
    this.pos = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    this.col = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    geo.setAttribute("position", this.pos);
    geo.setAttribute("color", this.col);
    this.points = new THREE.Points(geo, pointsMaterial(size));
    this.points.frustumCulled = false;
    this.points.visible = false;
    this.base = new THREE.Color(color);
  }
  private base: THREE.Color;

  update(time: number, start: number, end: number, life = 0.5): void {
    if (time < start || time > end) { this.points.visible = false; return; }
    this.points.visible = true;
    for (let i = 0; i < this.per; i++) {
      const birth = start + (i / this.per) * (end - start);
      const age = time - birth;
      if (age < 0 || age > life) { this.col.setXYZ(i, 0, 0, 0); this.pos.setXYZ(i, 0, -9999, 0); continue; }
      const f = 1 - age / life;
      const s = this.speeds[i]!;
      this.pos.setXYZ(i,
        this.origin.x + this.dirs[i * 3]! * s * age,
        this.origin.y + this.dirs[i * 3 + 1]! * s * age - 2.2 * age * age,
        this.origin.z + this.dirs[i * 3 + 2]! * s * age);
      this.col.setXYZ(i, this.base.r * f, this.base.g * f * 0.8, this.base.b * f * 0.3);
    }
    this.pos.needsUpdate = true;
    this.col.needsUpdate = true;
  }
}

export { clamp01 };

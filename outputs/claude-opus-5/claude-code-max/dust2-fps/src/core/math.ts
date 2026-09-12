/**
 * Minimal math layer for the simulation.
 *
 * The simulation deliberately does NOT depend on three.js: the render layer owns
 * three, the sim owns its own vectors. That keeps the physics/AI/round logic
 * runnable headlessly (see `tools/`) and makes the sim <-> render boundary explicit.
 */

export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Frame-rate independent exponential approach. */
export function damp(a: number, b: number, lambda: number, dt: number): number {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

export function moveTowards(a: number, b: number, maxDelta: number): number {
  const d = b - a;
  if (Math.abs(d) <= maxDelta) return b;
  return a + Math.sign(d) * maxDelta;
}

/** Wrap an angle into (-PI, PI]. */
export function wrapAngle(a: number): number {
  a = (a + Math.PI) % TAU;
  if (a < 0) a += TAU;
  return a - Math.PI;
}

/** Shortest signed delta from angle `a` to angle `b`. */
export function angleDelta(a: number, b: number): number {
  return wrapAngle(b - a);
}

/** Deterministic PRNG (mulberry32) so matches/tests can be reproduced. */
export class Rng {
  private s: number;

  constructor(seed = 0x9e3779b9) {
    this.s = seed >>> 0;
  }

  next(): number {
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(lo: number, hi: number): number {
    return lo + this.next() * (hi - lo);
  }

  int(loInclusive: number, hiExclusive: number): number {
    return loInclusive + Math.floor(this.next() * (hiExclusive - loInclusive));
  }

  bool(chance = 0.5): boolean {
    return this.next() < chance;
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length)];
  }

  /** Approximately normal distribution, mean 0, sigma 1 (sum of uniforms). */
  gauss(): number {
    return (this.next() + this.next() + this.next() + this.next() - 2) * 1.732;
  }
}

export class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  copy(v: Vec3): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  add(v: Vec3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  addScaled(v: Vec3, s: number): this {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    return this;
  }

  sub(v: Vec3): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  subVectors(a: Vec3, b: Vec3): this {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }

  addVectors(a: Vec3, b: Vec3): this {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  }

  scale(s: number): this {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length(): number {
    return Math.sqrt(this.lengthSq());
  }

  /** Length ignoring Y — most gameplay checks are horizontal. */
  length2D(): number {
    return Math.hypot(this.x, this.z);
  }

  normalize(): this {
    const l = this.length();
    if (l > 1e-9) this.scale(1 / l);
    return this;
  }

  setLength(l: number): this {
    return this.normalize().scale(l);
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(a: Vec3, b: Vec3): this {
    const x = a.y * b.z - a.z * b.y;
    const y = a.z * b.x - a.x * b.z;
    const z = a.x * b.y - a.y * b.x;
    return this.set(x, y, z);
  }

  distanceTo(v: Vec3): number {
    return Math.sqrt(this.distanceToSq(v));
  }

  distanceToSq(v: Vec3): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  distanceTo2D(v: Vec3): number {
    return Math.hypot(this.x - v.x, this.z - v.z);
  }

  lerpTo(v: Vec3, t: number): this {
    this.x = lerp(this.x, v.x, t);
    this.y = lerp(this.y, v.y, t);
    this.z = lerp(this.z, v.z, t);
    return this;
  }

  isFinite(): boolean {
    return Number.isFinite(this.x) && Number.isFinite(this.y) && Number.isFinite(this.z);
  }
}

/**
 * View direction convention (shared by sim and three.js render layer):
 *   yaw = 0 looks down -Z, positive yaw rotates counter-clockwise seen from above,
 *   pitch = 0 is level, positive pitch looks up. Matches Object3D.rotation 'YXZ'.
 */
export function dirFromAngles(yaw: number, pitch: number, out = new Vec3()): Vec3 {
  const cp = Math.cos(pitch);
  return out.set(-Math.sin(yaw) * cp, Math.sin(pitch), -Math.cos(yaw) * cp);
}

/** Horizontal forward vector for a yaw. */
export function forwardFromYaw(yaw: number, out = new Vec3()): Vec3 {
  return out.set(-Math.sin(yaw), 0, -Math.cos(yaw));
}

/** Horizontal right-hand vector for a yaw (strafe axis). */
export function rightFromYaw(yaw: number, out = new Vec3()): Vec3 {
  return out.set(Math.cos(yaw), 0, -Math.sin(yaw));
}

/** Yaw that points from `from` towards `to`. */
export function yawTo(from: Vec3, to: Vec3): number {
  return Math.atan2(-(to.x - from.x), -(to.z - from.z));
}

/** Pitch that points from `from` towards `to`. */
export function pitchTo(from: Vec3, to: Vec3): number {
  const horizontal = Math.hypot(to.x - from.x, to.z - from.z);
  return Math.atan2(to.y - from.y, horizontal);
}

/** Rotate a point around the Y axis by -yaw (world -> actor local space). */
export function unrotateY(x: number, z: number, yaw: number, out: { x: number; z: number }): void {
  const c = Math.cos(-yaw);
  const s = Math.sin(-yaw);
  out.x = x * c + z * s;
  out.z = -x * s + z * c;
}

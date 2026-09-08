/**
 * Deterministic pseudo-random utilities.
 *
 * The whole film is generated from code, so every "random" detail (pixel
 * noise, dust motes, star fields, hair flecks) is seeded. A fixed seed means
 * the picture is identical on every machine and every run.
 */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Rng {
  private next: () => number;

  constructor(seed = 20240101) {
    this.next = mulberry32(seed);
  }

  /** [0,1) */
  unit(): number {
    return this.next();
  }

  /** [min,max) */
  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  /** integer in [min,max] */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  /** symmetric [-a,a) */
  sym(a: number): number {
    return this.range(-a, a);
  }

  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length) % arr.length];
  }

  /** gaussian-ish, mean 0, std ~1 (sum of uniforms) */
  gauss(): number {
    return (this.next() + this.next() + this.next() - 1.5) * 1.1547;
  }
}

export function clamp(v: number, a: number, b: number): number {
  return v < a ? a : v > b ? b : v;
}

export function clamp01(v: number): number {
  return clamp(v, 0, 1);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function smootherstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInCubic(t: number): number {
  return t * t * t;
}

export function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Smooth, non-linear "breathing" curve in [0,1]. */
export function pulse(t: number, center: number, width: number): number {
  const d = Math.abs(t - center) / width;
  return d >= 1 ? 0 : 1 - d * d;
}

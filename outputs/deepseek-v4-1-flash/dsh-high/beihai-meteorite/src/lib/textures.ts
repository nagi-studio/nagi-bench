import * as THREE from "three";
import { Rng, clamp, clamp01 } from "./rng";

/**
 * Procedural pixel textures.
 *
 * Everything is written straight into a Uint8Array and uploaded as a
 * DataTexture with nearest-neighbour magnification, which gives the crisp
 * "hand-placed voxel" surface the film wants. No image files, no canvas.
 */

export type RGB = [number, number, number];

export function hex(h: number): RGB {
  return [(h >> 16) & 255, (h >> 8) & 255, h & 255];
}

export function mixRGB(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function shade(c: RGB, k: number): RGB {
  return [clamp(c[0] * k, 0, 255), clamp(c[1] * k, 0, 255), clamp(c[2] * k, 0, 255)];
}

/** A tiny mutable RGBA pixel buffer with painting helpers. */
export class PixelBuffer {
  readonly size: number;
  readonly data: Uint8ClampedArray;

  constructor(size: number, fill: RGB = [128, 128, 128]) {
    this.size = size;
    this.data = new Uint8ClampedArray(size * size * 4);
    this.fill(fill);
  }

  fill(c: RGB): void {
    const d = this.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }

  set(x: number, y: number, c: RGB, a = 1): void {
    const s = this.size;
    const xi = ((x % s) + s) % s;
    const yi = ((y % s) + s) % s;
    const i = (yi * s + xi) * 4;
    const d = this.data;
    d[i] = d[i] + (c[0] - d[i]) * a;
    d[i + 1] = d[i + 1] + (c[1] - d[i + 1]) * a;
    d[i + 2] = d[i + 2] + (c[2] - d[i + 2]) * a;
    d[i + 3] = 255;
  }

  get(x: number, y: number): RGB {
    const s = this.size;
    const xi = ((x % s) + s) % s;
    const yi = ((y % s) + s) % s;
    const i = (yi * s + xi) * 4;
    return [this.data[i], this.data[i + 1], this.data[i + 2]];
  }

  /** Fill a rectangle (wrapping). */
  rect(x0: number, y0: number, w: number, h: number, c: RGB, a = 1): void {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) this.set(x0 + x, y0 + y, c, a);
  }

  /** Multiply a pixel by k. */
  mul(x: number, y: number, k: number): void {
    const s = this.size;
    const xi = ((x % s) + s) % s;
    const yi = ((y % s) + s) % s;
    const i = (yi * s + xi) * 4;
    this.data[i] = clamp(this.data[i] * k, 0, 255);
    this.data[i + 1] = clamp(this.data[i + 1] * k, 0, 255);
    this.data[i + 2] = clamp(this.data[i + 2] * k, 0, 255);
  }

  toTexture(repeat = 1, srgb = true): THREE.DataTexture {
    const tex = new THREE.DataTexture(this.data, this.size, this.size, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.anisotropy = 4;
    tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.repeat.set(repeat, repeat);
    tex.needsUpdate = true;
    return tex;
  }
}

/* ------------------------------------------------------------------ noise */

function hash2(x: number, y: number, seed: number): number {
  let h = x * 374761393 + y * 668265263 + seed * 144665;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Wrapping 2D value noise. */
export function valueNoise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = smooth(xf);
  const v = smooth(yf);
  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Fractal sum of wrapping value noise, in [0,1]. */
export function fbm(x: number, y: number, seed: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  let fx = x;
  let fy = y;
  for (let o = 0; o < octaves; o++) {
    sum += valueNoise(fx, fy, seed + o * 131) * amp;
    norm += amp;
    amp *= 0.5;
    fx *= 2.03;
    fy *= 2.01;
  }
  return sum / norm;
}

/* -------------------------------------------------------------- presets */

export interface TexOpts {
  size?: number;
  seed?: number;
  repeat?: number;
}

/** Rough poured concrete with pinholes and stains. */
export function concreteTexture(base = 0x6d7178, opts: TexOpts = {}): THREE.DataTexture {
  const size = opts.size ?? 64;
  const seed = opts.seed ?? 7;
  const rng = new Rng(seed * 7919 + 3);
  const b = hex(base);
  const pb = new PixelBuffer(size, b);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = fbm(x * 0.12, y * 0.12, seed, 4);
      const m = fbm(x * 0.5 + 11, y * 0.5 + 3, seed + 9, 2);
      let k = 0.82 + n * 0.34 + (m - 0.5) * 0.16;
      if (rng.chance(0.012)) k *= 0.62;
      if (rng.chance(0.008)) k *= 1.16;
      pb.mul(x, y, k);
    }
  }
  // faint horizontal form-work seams
  const seam = Math.floor(rng.range(0, size));
  for (let x = 0; x < size; x++) pb.mul(x, seam, 0.8);
  return pb.toTexture(opts.repeat ?? 1);
}

/** Brushed / painted metal with panel lines and rivet dots. */
export function metalTexture(base = 0x8b939c, opts: TexOpts = {}): THREE.DataTexture {
  const size = opts.size ?? 64;
  const seed = opts.seed ?? 21;
  const rng = new Rng(seed * 104729 + 17);
  const pb = new PixelBuffer(size, hex(base));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const streak = valueNoise(x * 0.02, y * 3.3, seed) - 0.5;
      const grime = fbm(x * 0.1, y * 0.1, seed + 5, 3);
      let k = 0.9 + streak * 0.16 + (grime - 0.5) * 0.14;
      if (rng.chance(0.01)) k *= 0.8;
      pb.mul(x, y, k);
    }
  }
  // panel line
  const py = Math.floor(size * 0.5);
  for (let x = 0; x < size; x++) pb.mul(x, py, 0.72);
  for (let i = 0; i < 8; i++) pb.mul(rng.int(0, size - 1), py, 0.5);
  return pb.toTexture(opts.repeat ?? 1);
}

/** Dark meteoric iron with burnt-umber ablation flow lines. */
export function meteoriteTexture(opts: TexOpts = {}, baseHex = 0x241d18): THREE.DataTexture {
  const size = opts.size ?? 96;
  const seed = opts.seed ?? 99;
  const pb = new PixelBuffer(size, hex(baseHex));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = fbm(x * 0.14, y * 0.14, seed, 5);
      let k = 0.7 + n * 0.55;
      // curved flow lines: distance to a wavy band
      const band = Math.sin((x * 0.16 + valueNoise(x * 0.08, y * 0.08, seed + 4) * 5)) * size * 0.14;
      const d = Math.abs(((y + band) % size) - size * 0.5);
      if (d < 2.4) k *= 1.55;
      else if (d < 5.0) k *= 1.12;
      pb.mul(x, y, k);
      // occasional bright nickel fleck
      if (valueNoise(x * 0.9, y * 0.9, seed + 30) > 0.93) pb.set(x, y, [190, 180, 165], 0.7);
    }
  }
  return pb.toTexture(opts.repeat ?? 1);
}

/** Warm workshop wood: plank lines + grain. */
export function woodTexture(base = 0x6b4a2b, opts: TexOpts = {}): THREE.DataTexture {
  const size = opts.size ?? 64;
  const seed = opts.seed ?? 42;
  const pb = new PixelBuffer(size, hex(base));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const grain = Math.sin(x * 0.55 + valueNoise(x * 0.05, y * 0.4, seed) * 5) * 0.5 + 0.5;
      const n = fbm(x * 0.2, y * 0.06, seed + 3, 3);
      pb.mul(x, y, 0.82 + grain * 0.22 + (n - 0.5) * 0.2);
    }
  }
  for (let i = 0; i < size; i += Math.floor(size / 4)) for (let x = 0; x < size; x++) pb.mul(x, i, 0.7);
  return pb.toTexture(opts.repeat ?? 1);
}

/** Woven fabric / old blanket. */
export function fabricTexture(base = 0x3b3f46, opts: TexOpts = {}): THREE.DataTexture {
  const size = opts.size ?? 48;
  const seed = opts.seed ?? 5;
  const pb = new PixelBuffer(size, hex(base));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const weave = (((x >> 1) + (y >> 1)) & 1) === 0 ? 1.06 : 0.94;
      const n = fbm(x * 0.25, y * 0.25, seed, 3);
      pb.mul(x, y, weave * (0.86 + n * 0.28));
    }
  }
  return pb.toTexture(opts.repeat ?? 1);
}

/** Concrete floor slab with expansion joints and tire grime. */
export function floorTexture(base = 0x585c62, opts: TexOpts = {}): THREE.DataTexture {
  const size = opts.size ?? 96;
  const seed = opts.seed ?? 13;
  const pb = new PixelBuffer(size, hex(base));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = fbm(x * 0.08, y * 0.08, seed, 4);
      const m = fbm(x * 0.45, y * 0.45, seed + 8, 2);
      pb.mul(x, y, 0.8 + n * 0.32 + (m - 0.5) * 0.14);
    }
  }
  const joint = Math.floor(size / 2);
  for (let x = 0; x < size; x++) {
    pb.mul(x, joint, 0.72);
    pb.mul(x, 0, 0.72);
    pb.mul(x, joint + 1, 0.85);
  }
  for (let y = 0; y < size; y++) {
    pb.mul(joint, y, 0.72);
    pb.mul(0, y, 0.72);
  }
  return pb.toTexture(opts.repeat ?? 1);
}

/** Hazard stripes (yellow/black) for the test stand. */
export function hazardTexture(opts: TexOpts = {}): THREE.DataTexture {
  const size = opts.size ?? 32;
  const pb = new PixelBuffer(size, hex(0x1a1a1c));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const s = (x + y) % 16;
      if (s < 8) pb.set(x, y, hex(0xc9a227));
    }
  }
  return pb.toTexture(opts.repeat ?? 1);
}

/** Emissive-looking display face: dark glass with glowing rows and glyphs. */
export function screenTexture(tint = 0x6fc4ff, opts: TexOpts = {}): THREE.DataTexture {
  const size = opts.size ?? 64;
  const seed = opts.seed ?? 77;
  const rng = new Rng(seed);
  const pb = new PixelBuffer(size, hex(0x05080c));
  const c = hex(tint);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (rng.chance(0.28) && x > 3 && x < size - 3) {
        const row = Math.floor(y / 4);
        if (rng.chance(0.55)) pb.set(x, y, shade(c, 0.55 + rng.range(0, 0.7)), 0.85);
      }
    }
  }
  // frame
  for (let i = 0; i < size; i++) {
    pb.set(i, 0, c, 0.9);
    pb.set(i, size - 1, c, 0.9);
    pb.set(0, i, c, 0.9);
    pb.set(size - 1, i, c, 0.9);
  }
  return pb.toTexture(opts.repeat ?? 1);
}

/** A star field for the void / night sky dome. */
export function starTexture(opts: TexOpts = {}): THREE.DataTexture {
  const size = opts.size ?? 256;
  const seed = opts.seed ?? 1234;
  const rng = new Rng(seed);
  const pb = new PixelBuffer(size, hex(0x03050a));
  for (let i = 0; i < size * size * 0.03; i++) {
    const x = rng.int(0, size - 1);
    const y = rng.int(0, size - 1);
    const b = rng.range(0.35, 1);
    const warm = rng.chance(0.15);
    const col: RGB = warm ? [255, 224, 190] : [214, 230, 255];
    pb.set(x, y, shade(col, b));
    if (b > 0.9) {
      pb.set(x + 1, y, shade(col, b * 0.5));
      pb.set(x, y + 1, shade(col, b * 0.5));
    }
  }
  return pb.toTexture(opts.repeat ?? 1);
}

/** Soft radial dot used for dust / embers / sparks (alpha). */
export function dotTexture(opts: TexOpts = {}): THREE.DataTexture {
  const size = opts.size ?? 32;
  const pb = new PixelBuffer(size, [0, 0, 0]);
  const c = size / 2 - 0.5;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - c, y - c) / (size / 2);
      const a = clamp01(1 - d);
      const v = a * a;
      const i = (y * size + x) * 4;
      pb.data[i] = 255;
      pb.data[i + 1] = 255;
      pb.data[i + 2] = 255;
      pb.data[i + 3] = Math.round(v * 255);
    }
  }
  const tex = pb.toTexture(1, false);
  return tex;
}

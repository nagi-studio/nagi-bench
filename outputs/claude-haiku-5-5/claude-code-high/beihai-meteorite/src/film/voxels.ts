import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, type VoxelSource } from "@agentbench/voxel-kit";

/** Shared vertex-coloured material for every block environment piece. */
export const VOXEL_MATERIAL = voxelMaterial();

/** Glass: same vertex-colour language, but see-through. */
export const GLASS_MATERIAL = voxelMaterial({ transparent: true, opacity: 0.22, depthWrite: false, roughness: 0.2 });

/** Self-lit blocks: lamps, screens, sun, muzzle glow. Unaffected by scene lights. */
export const EMISSIVE_MATERIAL = new THREE.MeshBasicMaterial({ vertexColors: true });

const OFFSET = 4096;
const SPAN = 8192;

function keyOf(x: number, y: number, z: number): number {
  return ((x + OFFSET) * SPAN + (y + OFFSET)) * SPAN + (z + OFFSET);
}

function coordOf(key: number): [number, number, number] {
  const z = (key % SPAN) - OFFSET;
  const rest = Math.floor(key / SPAN);
  const y = (rest % SPAN) - OFFSET;
  const x = Math.floor(rest / SPAN) - OFFSET;
  return [x, y, z];
}

export type Paint = number | ((x: number, y: number, z: number) => number | null);

/**
 * A sparse block canvas. One cell is one voxel; `geometry(voxel)` converts the
 * painted cells into a single face-culled, vertex-coloured mesh.
 */
export class VoxelCanvas {
  readonly cells = new Map<number, number>();

  set(x: number, y: number, z: number, colour: number): this {
    this.cells.set(keyOf(Math.floor(x), Math.floor(y), Math.floor(z)), colour);
    return this;
  }

  remove(x: number, y: number, z: number): this {
    this.cells.delete(keyOf(Math.floor(x), Math.floor(y), Math.floor(z)));
    return this;
  }

  /** Fill an axis-aligned block of cells; `paint` may return null to leave a cell empty. */
  box(x0: number, y0: number, z0: number, w: number, h: number, d: number, paint: Paint): this {
    for (let x = x0; x < x0 + w; x++) {
      for (let y = y0; y < y0 + h; y++) {
        for (let z = z0; z < z0 + d; z++) {
          const colour = typeof paint === "number" ? paint : paint(x, y, z);
          if (colour !== null) this.set(x, y, z, colour);
        }
      }
    }
    return this;
  }

  /** Keep only cells for which `keep` is true. */
  carve(keep: (x: number, y: number, z: number) => boolean): this {
    for (const key of [...this.cells.keys()]) {
      const [x, y, z] = coordOf(key);
      if (!keep(x, y, z)) this.cells.delete(key);
    }
    return this;
  }

  /**
   * Build the geometry. Voxel (i, j, k) occupies [i, i+1) * voxel in world units.
   * With `centred`, the painted bounds are centred on the origin.
   */
  geometry(voxel = 1, centred = false): THREE.BufferGeometry {
    if (this.cells.size === 0) return new THREE.BufferGeometry();
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (const key of this.cells.keys()) {
      const [x, y, z] = coordOf(key);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
    }
    const sx = maxX - minX + 1, sy = maxY - minY + 1, sz = maxZ - minZ + 1;
    const source: VoxelSource = {
      size: [sx, sy, sz],
      at: (x, y, z) => this.cells.get(keyOf(x + minX, y + minY, z + minZ)) ?? null,
    };
    const geometry = buildVoxelGeometry(source, { voxel, anchor: "min" });
    if (centred) {
      geometry.translate(-(minX + sx / 2) * voxel, -(minY + sy / 2) * voxel, -(minZ + sz / 2) * voxel);
    } else {
      geometry.translate(minX * voxel, minY * voxel, minZ * voxel);
    }
    return geometry;
  }

  mesh(voxel = 1, material: THREE.Material = VOXEL_MATERIAL, centred = false): THREE.Mesh {
    return new THREE.Mesh(this.geometry(voxel, centred), material);
  }
}

/** Deterministic integer hash mapped to [0, 1). */
export function hash(x: number, y: number, z: number, seed = 0): number {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1442695041) ^ Math.imul(seed | 0, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Small seeded PRNG (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 3D value noise in [0, 1]. */
export function vnoise(x: number, y: number, z: number, seed = 0): number {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz, seed);
  const x00 = c(0, 0, 0) + (c(1, 0, 0) - c(0, 0, 0)) * u;
  const x10 = c(0, 1, 0) + (c(1, 1, 0) - c(0, 1, 0)) * u;
  const x01 = c(0, 0, 1) + (c(1, 0, 1) - c(0, 0, 1)) * u;
  const x11 = c(0, 1, 1) + (c(1, 1, 1) - c(0, 1, 1)) * u;
  const y0 = x00 + (x10 - x00) * v;
  const y1 = x01 + (x11 - x01) * v;
  return y0 + (y1 - y0) * w;
}

/** Fractal noise built from value noise. */
export function fbm(x: number, y: number, z: number, seed = 0, octaves = 3): number {
  let sum = 0, amp = 0.5, freq = 1, norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * vnoise(x * freq, y * freq, z * freq, seed + i * 17);
    norm += amp;
    amp *= 0.5;
    freq *= 2.02;
  }
  return sum / norm;
}

/** Mix two hex colours by t (0..1). */
export function mixHex(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
}

/** Scale a hex colour's brightness by k. */
export function shade(hex: number, k: number): number {
  const r = Math.min(255, Math.round(((hex >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((hex >> 8) & 255) * k));
  const b = Math.min(255, Math.round((hex & 255) * k));
  return (r << 16) | (g << 8) | b;
}

/** An irregular rock: a noisy sphere with per-voxel colour variation from a palette. */
export function rockCanvas(radius: number, palette: number[], seed: number, roughness = 0.35): VoxelCanvas {
  const vc = new VoxelCanvas();
  const r = Math.ceil(radius) + 1;
  for (let x = -r; x <= r; x++) {
    for (let y = -r; y <= r; y++) {
      for (let z = -r; z <= r; z++) {
        const d = Math.hypot(x + 0.5, y + 0.5, z + 0.5);
        const wobble = (vnoise(x * 0.6, y * 0.6, z * 0.6, seed) - 0.5) * 2 * roughness * radius;
        if (d > radius + wobble) continue;
        const pick = hash(x, y, z, seed + 3);
        vc.set(x, y, z, palette[Math.floor(pick * palette.length) % palette.length]);
      }
    }
  }
  return vc;
}

import * as THREE from "three";
import {
  concreteTexture,
  fabricTexture,
  floorTexture,
  hazardTexture,
  metalTexture,
  meteoriteTexture,
  screenTexture,
  starTexture,
  woodTexture,
  type TexOpts
} from "./textures";

/**
 * Material library.
 *
 * Every surface in the film is one of a small set of named "materials". They
 * are created once and shared, which keeps draw calls low and makes the whole
 * palette controllable from one place. Textures are tiled through geometry
 * UVs (see voxel.ts), so a single material can cover a wall or a rivet.
 */

export interface SurfaceDef {
  color: number;
  rough: number;
  metal: number;
  tex?: (o?: TexOpts) => THREE.DataTexture;
  emissive?: number;
  emissiveIntensity?: number;
  opacity?: number;
  side?: THREE.Side;
  flat?: boolean;
}

export const SURFACES: Record<string, SurfaceDef> = {
  concrete: { color: 0xffffff, rough: 0.96, metal: 0.02, tex: (o) => concreteTexture(0x6d7178, o) },
  concreteDark: { color: 0x9aa0a8, rough: 0.98, metal: 0.02, tex: (o) => concreteTexture(0x4c5158, o) },
  concretePale: { color: 0xffffff, rough: 0.96, metal: 0.02, tex: (o) => concreteTexture(0x9aa0a8, o) },
  ceilDark: { color: 0x2a2e34, rough: 0.95, metal: 0.02 },
  floor: { color: 0xffffff, rough: 0.9, metal: 0.04, tex: (o) => floorTexture(0x585c62, o) },
  metal: { color: 0xffffff, rough: 0.42, metal: 0.85, tex: (o) => metalTexture(0x8b939c, o) },
  metalDark: { color: 0x7c838c, rough: 0.5, metal: 0.8, tex: (o) => metalTexture(0x5a626b, o) },
  steel: { color: 0xcfd6dd, rough: 0.3, metal: 0.95, tex: (o) => metalTexture(0xaeb7c0, o) },
  wood: { color: 0xffffff, rough: 0.82, metal: 0.0, tex: (o) => woodTexture(0x6b4a2b, o) },
  fabric: { color: 0xffffff, rough: 1.0, metal: 0.0, tex: (o) => fabricTexture(0x3b3f46, o) },
  meteorite: { color: 0xffffff, rough: 0.62, metal: 0.72, tex: (o) => meteoriteTexture(o) },
  hazard: { color: 0xffffff, rough: 0.7, metal: 0.2, tex: (o) => hazardTexture(o) },
  screen: {
    color: 0x0a1018,
    rough: 0.22,
    metal: 0.1,
    tex: (o) => screenTexture(0x6fc4ff, o),
    emissive: 0x59b6ff,
    emissiveIntensity: 1.35
  },
  screenWarm: {
    color: 0x100c06,
    rough: 0.22,
    metal: 0.1,
    tex: (o) => screenTexture(0xffb457, o),
    emissive: 0xffa64a,
    emissiveIntensity: 1.15
  },
  stars: { color: 0xffffff, rough: 1, metal: 0, tex: (o) => starTexture(o), emissive: 0xffffff, emissiveIntensity: 0.9 },
  glass: { color: 0x1b2733, rough: 0.05, metal: 0.1, opacity: 0.22 },
  water: { color: 0x0d1c26, rough: 0.08, metal: 0.2 }
};

const surfaceCache = new Map<string, THREE.MeshStandardMaterial>();

export function surface(kind: keyof typeof SURFACES | string): THREE.MeshStandardMaterial {
  const cached = surfaceCache.get(kind);
  if (cached) return cached;
  const def = SURFACES[kind] ?? SURFACES.concrete;
  const mat = new THREE.MeshStandardMaterial({
    color: def.color,
    roughness: def.rough,
    metalness: def.metal,
    emissive: def.emissive ?? 0x000000,
    emissiveIntensity: def.emissiveIntensity ?? 1,
    flatShading: def.flat ?? false,
    transparent: def.opacity !== undefined,
    opacity: def.opacity ?? 1,
    side: def.side ?? THREE.FrontSide,
    envMapIntensity: 0.5
  });
  if (def.tex) {
    mat.map = def.tex();
    // Modulate the emissive by the same texture, so screens and star fields
    // glow only where the pattern is bright instead of as a flat white panel.
    if (def.emissive) mat.emissiveMap = mat.map;
  }
  mat.name = `surface:${kind}`;
  surfaceCache.set(kind, mat);
  return mat;
}

const flatCache = new Map<string, THREE.MeshStandardMaterial>();

/** A plain coloured material, cached by colour + finish. */
export function flat(
  color: number,
  rough = 0.8,
  metal = 0.0,
  emissive = 0x000000,
  emissiveIntensity = 1
): THREE.MeshStandardMaterial {
  const key = `${color}|${rough}|${metal}|${emissive}|${emissiveIntensity}`;
  const cached = flatCache.get(key);
  if (cached) return cached;
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: rough,
    metalness: metal,
    emissive,
    emissiveIntensity
  });
  mat.name = `flat:${color.toString(16)}`;
  flatCache.set(key, mat);
  return mat;
}

/** Self-lit surface (screens, lamp diffusers, flame cores, holograms). */
export function glow(color: number, intensity = 2.2): THREE.MeshStandardMaterial {
  return flat(color, 0.4, 0, color, intensity);
}

export function glassMaterial(color = 0x2a3a4a, opacity = 0.24): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.06,
    metalness: 0.15,
    transparent: true,
    opacity,
    depthWrite: false
  });
}

/** A dedicated material for one-off effects that must not be shared. */
export function unique(options: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial(options);
}

export function disposeMaterialCache(): void {
  for (const m of surfaceCache.values()) {
    m.map?.dispose();
    m.dispose();
  }
  for (const m of flatCache.values()) m.dispose();
  surfaceCache.clear();
  flatCache.clear();
}

/* ------------------------------------------------------------------ palette
   Named colours used across the art direction. Kept as one block so the film's
   colour script can be read at a glance. */

export const PAL = {
  // cold institutional
  concrete: 0x6d7178,
  concreteDark: 0x4c5158,
  concretePale: 0x9aa0a8,
  steel: 0x9aa3ad,
  steelDark: 0x3a4048,
  navy: 0x1c2733,
  navyLight: 0x2b3a4c,
  slate: 0x39414b,
  fluorescent: 0xdff2e8,
  fluorescentDim: 0x8fb0a4,

  // warm workshop
  wood: 0x6b4a2b,
  woodDark: 0x3d2a18,
  bronze: 0x8a5a2b,
  copper: 0xb06a3a,
  brass: 0xc79a4a,
  amber: 0xffb057,
  ember: 0xff6a1e,
  oilcloth: 0x5a4a2e,

  // meteoric / violence
  meteor: 0x241d18,
  meteorFlow: 0x6b3a1e,
  nickel: 0xb9b0a2,
  blood: 0x4a100e,
  black: 0x0a0b0d,
  bone: 0xd8d2c4,

  // clinical
  white: 0xe8edf0,
  clinical: 0xcfd9de,
  cyan: 0x63c8e0,

  // cosmic / fusion
  voidBlue: 0x03050a,
  star: 0xdfeaff,
  fusionBlue: 0x4aa8ff,
  fusionCore: 0xcfe8ff,
  fusionDeep: 0x1d5cc4,
  plasma: 0x7fd0ff
} as const;

export const SKIN = {
  light: 0xe0b08a,
  mid: 0xc98f66,
  tan: 0xb07a52,
  pale: 0xe8c6a6
} as const;

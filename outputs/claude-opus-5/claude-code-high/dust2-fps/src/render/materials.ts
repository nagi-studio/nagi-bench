import * as THREE from 'three';

/** Shared palette — a sun-bleached Middle-Eastern town, no textures anywhere. */
export const PALETTE = {
  sandLight: 0xd9c59a,
  sandMid: 0xc9b184,
  sandDark: 0xb59a6d,
  wallLight: 0xcbb489,
  wallMid: 0xbda071,
  wallDark: 0xa1855a,
  trim: 0x8d7047,
  skyTop: 0x3f6fa8,
  skyBottom: 0xe8d3ac,
  ct: 0x2f5c9e,
  ctAccent: 0x9dc4ec,
  t: 0x8a6234,
  tAccent: 0xb5352c,
  bomb: 0x2c2c30,
  bombLight: 0xff2b1c,
} as const;

export interface MaterialSet {
  floor: THREE.MeshLambertMaterial;
  wall: THREE.MeshLambertMaterial;
  prop: THREE.MeshLambertMaterial;
  flat: THREE.MeshBasicMaterial;
}

export function createMaterials(): MaterialSet {
  return {
    // Instanced meshes drive their per-instance colour through instanceColor.
    floor: new THREE.MeshLambertMaterial({ color: 0xffffff }),
    wall: new THREE.MeshLambertMaterial({ color: 0xffffff }),
    prop: new THREE.MeshLambertMaterial({ color: 0xffffff }),
    flat: new THREE.MeshBasicMaterial({ color: 0xffffff }),
  };
}

/** Unit cube with the pivot at the centre of its bottom face. */
export function boxGeometry(): THREE.BoxGeometry {
  const g = new THREE.BoxGeometry(1, 1, 1);
  g.translate(0, 0.5, 0);
  return g;
}

/** Deterministic small colour jitter so untextured surfaces do not look flat. */
export function jitterColor(base: number, seed: number, amount = 0.06): THREE.Color {
  const c = new THREE.Color(base);
  const n = Math.sin(seed * 127.1) * 43758.5453;
  const f = 1 + ((n - Math.floor(n)) - 0.5) * 2 * amount;
  c.multiplyScalar(f);
  return c;
}

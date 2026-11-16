import * as THREE from "three";
import { buildVoxelGeometry, voxelModel, voxelMaterial, voxelSphere } from "@agentbench/voxel-kit";
import { mulberry32 } from "../util";

export const gunmetal = 0x2b2f36;
export const steel = 0x5a6169;
export const darkSteel = 0x3a4048;

/** A solid voxel cylinder (radius/height in voxels) — slugs, cups, tubes. */
export function voxCylinder(radius: number, height: number, color: number | ((x: number, y: number, z: number) => number), voxel = 1): THREE.BufferGeometry {
  const r = Math.ceil(radius);
  const span = r * 2;
  return buildVoxelGeometry({
    size: [span, height, span],
    at(x, y, z) {
      const dx = x + 0.5 - r;
      const dz = z + 0.5 - r;
      if (Math.sqrt(dx * dx + dz * dz) > radius) return null;
      return typeof color === "function" ? color(x, y, z) : color;
    },
  }, { voxel, anchor: "center" });
}

/** Irregular iron meteorite: metallic grey with thumbprint pits and a fusion crust. */
export function meteoriteGeo(radius: number, seed = 1, voxel = 1): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const pits: Array<[number, number, number]> = [];
  for (let i = 0; i < 6; i++) {
    pits.push([(rng() - 0.5) * radius * 1.4, (rng() - 0.5) * radius * 1.4, (rng() - 0.5) * radius * 1.4]);
  }
  return voxelSphere(radius, (x, y, z, d) => {
    const cx = x + 0.5 - radius, cy = y + 0.5 - radius, cz = z + 0.5 - radius;
    let pit = false;
    for (const [px, py, pz] of pits) {
      if (Math.hypot(cx - px, cy - py, cz - pz) < radius * 0.34) pit = true;
    }
    const n = rng();
    if (d > 0.93) return pit ? 0x2a2622 : 0x3a352e; // fusion crust
    if (pit) return 0x4a453d;
    // metallic iron-nickel with crystalline sheen
    return n > 0.82 ? 0x9aa0a6 : n > 0.5 ? 0x6e747a : 0x565c62;
  }, { voxel });
}

/** Widmanstätten-patterned slice for the opening macro — etched crystal bands. */
export function meteoriteSliceGeo(seed = 7): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const r = 7;
  return buildVoxelGeometry({
    size: [r * 2, 2, r * 2],
    at(x, y, z) {
      const dx = x + 0.5 - r, dz = z + 0.5 - r;
      const dist = Math.hypot(dx, dz);
      if (dist > r - 0.4) return null;
      // interlocking crystal bands at 60 degrees
      const band = Math.sin((dx * 0.9 + dz * 0.5) * 1.6) + Math.sin((dx * 0.4 - dz * 1.1) * 1.3);
      const edge = dist > r - 1.4;
      if (edge) return 0x3a352e;
      if (band > 0.7) return 0xb9c0c7;
      if (band > 0.1) return 0x8b9299;
      if (band > -0.6) return 0x6a7178;
      return rng() > 0.7 ? 0x9aa0a6 : 0x565c62;
    },
  }, { voxel: 1, anchor: "center" });
}

const P = { "#": gunmetal, s: steel, g: 0x3a2c22, d: darkSteel, b: 0x6fa8dc, ".": -1 };

/** 2010-pattern pistol: barrel along +Z, grip along -Y (hand-anchor frame). */
export function pistolGeo(): THREE.BufferGeometry {
  const side = [
    "..............",
    "..............",
    "...ssssssssss.",
    "...##########s",
    "...########...",
    "...##.#####...",
    "...##.#...#...",
    "...##.#####...",
    "...gg#........",
    "...gg#........",
  ];
  return voxelModel({ palette: P, layers: [side, side, side], axis: "x", voxel: 0.34, anchor: "min" });
}

/** Rifle scope modified with a magnetic mount; tube along +Z. */
export function scopeGeo(): THREE.BufferGeometry {
  const side = [
    "..........",
    "..ssssss..",
    ".d######b.",
    ".d######b.",
    "..ssssss..",
    "....dd....",
  ];
  return voxelModel({ palette: P, layers: [side, side, side], axis: "x", voxel: 0.3, anchor: "min" });
}

export function magazineGeo(): THREE.BufferGeometry {
  const side = ["..", "ss", "##", "##", "##", "##", "dd"];
  return voxelModel({ palette: P, layers: [side, side], axis: "x", voxel: 0.34, anchor: "min" });
}

/** Caseless round: propellant block + meteorite slug bonded on top. */
export function roundGeo(withSlug = true): THREE.BufferGeometry {
  const side = withSlug
    ? ["..mm..", "..mm..", "pppppp", "pppppp", "pppppp", "pppppp"]
    : ["......", "......", "pppppp", "pppppp", "pppppp", "pppppp"];
  const pal = { ...P, m: 0x6e747a, p: 0xb08a4a };
  return voxelModel({ palette: pal, layers: [side, side], axis: "x", voxel: 0.22, anchor: "min" });
}

/** A single machined meteorite slug (pencil-thick cylinder segment). */
export function slugGeo(): THREE.BufferGeometry {
  return voxCylinder(1.4, 3, (x, y, z) => (y === 0 || y === 2 ? 0x565c62 : 0x7d848b), 0.22);
}

export function teacupGeo(): THREE.BufferGeometry {
  const geo = voxCylinder(2.2, 3, (x, y, z) => {
    const dx = x + 0.5 - 2.5, dz = z + 0.5 - 2.5;
    const d = Math.hypot(dx, dz);
    if (y === 2 && d < 1.5) return 0x6b4a2a; // tea surface
    return d > 1.6 ? 0xe8e4da : 0xf2efe6;
  }, 0.3);
  return geo;
}

export function magnifierGeo(): THREE.BufferGeometry {
  const side = [
    "..bbb..",
    ".b...b.",
    "b.....b",
    ".b...b.",
    "..bbb..",
    "...g...",
    "...g...",
    "...g...",
  ];
  const pal = { ...P, b: 0x9fc4d8, g: 0x4a3a2c };
  return voxelModel({ palette: pal, layers: [side, side], axis: "x", voxel: 0.3, anchor: "min" });
}

export function pliersGeo(): THREE.BufferGeometry {
  const side = ["..s.", ".s..", "s...", "ss..", ".ss.", "..ss", "..g.", "..g."];
  return voxelModel({ palette: P, layers: [side, side], axis: "x", voxel: 0.28, anchor: "min" });
}

export function glueTubeGeo(): THREE.BufferGeometry {
  const side = ["..n.", "tttt", "tttt", "tttt", "tttt", "tttt"];
  const pal = { ...P, t: 0xc9cdd3, n: 0x8a8f96 };
  return voxelModel({ palette: pal, layers: [side, side], axis: "x", voxel: 0.26, anchor: "min" });
}

export function mesh(geo: THREE.BufferGeometry, opts: THREE.MeshStandardMaterialParameters = {}): THREE.Mesh {
  const m = new THREE.Mesh(geo, voxelMaterial(opts));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** Solid-colour material for plain BoxGeometry (no vertex colours). Using
 *  voxelMaterial here would force vertexColors on a geometry with no colour
 *  attribute and render black. */
export function solidMat(color: number, opts: THREE.MeshStandardMaterialParameters = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, ...opts });
}

/** A plain block (architecture / furniture) with a solid colour. */
export function solidBox(w: number, h: number, d: number, color: number, opts: THREE.MeshStandardMaterialParameters = {}): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), solidMat(color, opts));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** Additive glow sprite (sun, flash, lamps). */
export function glowSprite(tex: THREE.Texture, color: number, scale: number): THREE.Sprite {
  const mat = new THREE.SpriteMaterial({
    map: tex, color, transparent: true, blending: THREE.AdditiveBlending,
    depthWrite: false, depthTest: true,
  });
  const s = new THREE.Sprite(mat);
  s.scale.setScalar(scale);
  return s;
}

import * as THREE from "three";
import { voxelModel, buildVoxelGeometry, voxelMaterial } from "@agentbench/voxel-kit";
import { fbm, hash3 } from "./util";

export const VMAT = () => voxelMaterial();
export const sharedVoxelMat = voxelMaterial({ roughness: 0.85 });
export const shinyVoxelMat = voxelMaterial({ roughness: 0.35, metalness: 0.6 });

/* Pistol: side elevation, barrel along +Z (column 0 = back). Voxel 0.3 px. */
const PISTOL_SIDE = [
  "..............",
  "#############.",
  "##############",
  "#############=",
  "..ggg.###.....",
  "..ggg..#......",
  "..ggg.........",
  "..ggg.........",
  "..ggg.........",
  "..mmm.........",
];
export function pistolGeometry() {
  return voxelModel({
    palette: { "#": 0x2a2e35, g: 0x3b3f46, "=": 0x111316, m: 0x55595f },
    layers: [PISTOL_SIDE, PISTOL_SIDE, PISTOL_SIDE],
    axis: "x",
    voxel: 0.3,
  });
}

/* Rifle scope converted with magnets. */
const SCOPE_SIDE = [
  "oo.......oo",
  "ottttttttto",
  "ottttttttto",
  "oo.......oo",
  "...mm..mm..",
];
export function scopeGeometry() {
  return voxelModel({
    palette: { o: 0x1c1f24, t: 0x2c3138, m: 0x8a8f96 },
    layers: [SCOPE_SIDE, SCOPE_SIDE, SCOPE_SIDE],
    axis: "x",
    voxel: 0.3,
  });
}

const MAG_SIDE = ["mmm", "mbm", "mbm", "mbm", "mbm", "mmm"];
export function magazineGeometry() {
  return voxelModel({ palette: { m: 0x30343a, b: 0x5b4a3a }, layers: [MAG_SIDE, MAG_SIDE], axis: "x", voxel: 0.3 });
}

/** Lump of stone in metres. */
export function lumpGeometry(seed: number, radiusVox: number, voxel: number, colour: (x: number, y: number, z: number, n: number) => number, squash = [1, 0.8, 0.9]) {
  const span = Math.ceil(radiusVox * 2) + 2;
  const c = span / 2;
  return buildVoxelGeometry({
    size: [span, span, span],
    at(x, y, z) {
      const dx = (x + 0.5 - c) / squash[0]!, dy = (y + 0.5 - c) / squash[1]!, dz = (z + 0.5 - c) / squash[2]!;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const n = fbm(x * 0.35, y * 0.35, z * 0.35, 3, seed);
      if (d > radiusVox * (0.72 + n * 0.5)) return null;
      return colour(x, y, z, n);
    },
  }, { voxel });
}

export function ironMeteorite(seed: number, radiusVox = 6, voxel = 0.009) {
  return lumpGeometry(seed, radiusVox, voxel, (x, y, z, n) => {
    // Widmanstätten lattice: crossing bands of kamacite/taenite.
    const a = (x + y * 0.6) % 4 < 1, b = (z - y * 0.7 + 40) % 5 < 1;
    if (a && b) return 0x9aa0a6;
    if (a || b) return 0x5c5f63;
    return n > 0.55 ? 0x3b3330 : 0x2a2624;
  });
}

export function plainStone(seed: number, radiusVox: number, voxel: number, tint: number) {
  const c = new THREE.Color(tint);
  return lumpGeometry(seed, radiusVox, voxel, (x, y, z, n) => {
    const k = 0.75 + n * 0.5 + hash3(x, y, z, seed) * 0.1;
    return new THREE.Color(c.r * k, c.g * k, c.b * k).getHex();
  });
}

/** Little cylinder (meteorite slug) as voxels, length along +Z. */
export function slugGeometry(voxel = 0.0012, len = 8, rad = 3, colourA = 0x6c6a68, colourB = 0x3a3634) {
  return buildVoxelGeometry({
    size: [Math.ceil(rad * 2), Math.ceil(rad * 2), len],
    at(x, y, z) {
      const c = Math.ceil(rad * 2) / 2;
      const dx = x + 0.5 - c, dy = y + 0.5 - c;
      if (dx * dx + dy * dy > rad * rad) return null;
      return (x + y + z) % 3 === 0 ? colourA : colourB;
    },
  }, { voxel });
}

export function cylinderVox(rad: number, len: number, voxel: number, colour: (x: number, y: number, z: number) => number | null, axis: "y" | "z" = "y") {
  const span = Math.ceil(rad * 2);
  return buildVoxelGeometry({
    size: axis === "y" ? [span, len, span] : [span, span, len],
    at(x, y, z) {
      const a = x + 0.5 - rad, b = (axis === "y" ? z : y) + 0.5 - rad;
      if (a * a + b * b > rad * rad) return null;
      return colour(x, y, z);
    },
  }, { voxel });
}

export function teacupGeometry(voxel = 0.012) {
  return buildVoxelGeometry({
    size: [6, 6, 6],
    at(x, y, z) {
      const dx = x - 2.5, dz = z - 2.5;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d > 2.9) return null;
      if (y === 0) return d < 2 ? 0xe9e4d8 : null;
      if (y >= 5 && d < 2.1) return null; // open top
      if (d < 2.1 && y >= 1) return y === 4 ? 0x7a5a20 : null; // tea surface
      return y === 3 && x === 0 ? 0x3d6e9a : 0xeeeae0;
    },
  }, { voxel });
}

export function teapotGeometry(voxel = 0.02) {
  return buildVoxelGeometry({
    size: [10, 8, 7],
    at(x, y, z) {
      const dx = x - 4.5, dz = z - 3, dy = y - 3;
      if (x >= 8 && y >= 3 && y <= 5 && Math.abs(dz) < 1) return 0x5e3a28; // spout
      if (x <= 1 && y >= 3 && y <= 5 && Math.abs(dz) < 1) return (y === 4 && x === 0) ? null : 0x5e3a28; // handle
      const d = Math.sqrt(dx * dx * 1.0 + dy * dy * 1.4 + dz * dz * 1.2);
      if (d < 3.6 && y < 6) return 0x7a4a32;
      if (y === 6 && Math.abs(dx) < 1.5 && Math.abs(dz) < 1.5) return 0x6a3e2a;
      if (y === 7 && Math.abs(dx) < 0.6 && Math.abs(dz) < 0.6) return 0x6a3e2a;
      return null;
    },
  }, { voxel });
}

export function phoneGeometry() {
  // in px units for hand anchor: 0.3px voxels
  const S = ["ssssss", "sddds" + "s", "sddds" + "s", "sddds" + "s", "sddds" + "s", "sddds" + "s", "sddds" + "s", "ssssss"];
  return voxelModel({ palette: { s: 0x1e2024, d: 0x304a6a }, layers: [S], axis: "z", voxel: 0.35 });
}

export function phoneScreenTexture(paid: boolean) {
  const c = document.createElement("canvas");
  c.width = 16;
  c.height = 24;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = paid ? "#1d6b46" : "#1d3a5e";
  ctx.fillRect(0, 0, 16, 24);
  ctx.fillStyle = "#e8f2ff";
  if (paid) {
    ctx.fillRect(4, 10, 2, 2);
    ctx.fillRect(6, 12, 2, 2);
    ctx.fillRect(8, 10, 2, 2);
    ctx.fillRect(10, 8, 2, 2);
  } else {
    for (let i = 0; i < 4; i++) ctx.fillRect(3, 5 + i * 4, 10 - (i % 2) * 3, 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function magnifierGeometry() {
  const S = [
    ".rrr.",
    "rgggr",
    "rgggr",
    "rgggr",
    ".rrr.",
    "..h..",
    "..h..",
    "..h..",
    "..h..",
  ];
  return voxelModel({ palette: { r: 0x2a2a2a, g: 0x9cc8d8, h: 0x6a4428 }, layers: [S], axis: "z", voxel: 0.012 });
}

export function knifeGeometry() {
  const S = ["......bbbbbbbb", "hhhhhhbbbbbbb."];
  return voxelModel({ palette: { h: 0x2a2018, b: 0xb8bec4 }, layers: [S], axis: "x", voxel: 0.35 });
}

export function pliersGeometry() {
  const S = ["rr....mm.", ".rr.mmmmm", "rr....mm."];
  return voxelModel({ palette: { r: 0xa02a22, m: 0x8a9096 }, layers: [S, S], axis: "x", voxel: 0.35 });
}

/** Caseless 7.62 round: propellant block + bullet head; units metres, length along +Y. */
export function roundGeometry(withSlug: boolean) {
  return buildVoxelGeometry({
    size: [3, withSlug ? 10 : 6, 3],
    at(x, y, z) {
      if (y < 6) return (x + z + y) % 4 === 0 ? 0xb39a6a : 0xc8ae78; // propellant
      if (withSlug) {
        if (y === 9 && (x !== 1 || z !== 1)) return null;
        return 0x4a4644; // meteorite slug
      }
      return null;
    },
  }, { voxel: 0.0028 });
}

export function bulletHeadGeometry() {
  return buildVoxelGeometry({
    size: [3, 4, 3],
    at(x, y, z) {
      if (y === 3 && (x !== 1 || z !== 1)) return null;
      return 0xb87333;
    },
  }, { voxel: 0.0028 });
}

/** A generic voxel slab with optional per-voxel colouring (metres). */
export function slab(w: number, h: number, d: number, voxel: number, colour: (x: number, y: number, z: number) => number | null) {
  return buildVoxelGeometry({ size: [w, h, d], at: colour }, { voxel, anchor: "min" });
}

export function voxMesh(geo: THREE.BufferGeometry, mat: THREE.Material = sharedVoxelMat, cast = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
}

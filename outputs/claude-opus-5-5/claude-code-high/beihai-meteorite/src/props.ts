import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, voxelModel } from "@agentbench/voxel-kit";
import { fbm, rng, shadeHex } from "./util";

export const VM = voxelMaterial();
export const VM_GLOSS = voxelMaterial({ roughness: 0.5, metalness: 0.3 });

export function mesh(geo: THREE.BufferGeometry, mat: THREE.Material = VM, shadow = true): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = shadow;
  m.receiveShadow = shadow;
  return m;
}

// Anchor props are authored in figure px (1 px = 5.6 cm at 1.8 m).

/** Service pistol, barrel along +Z, grip down. Side elevation, column 0 = back. */
export function pistolGeo(): THREE.BufferGeometry {
  const side = [
    ".##############",
    "###############",
    "###############",
    ".##bb####......",
    ".#g..g#........",
    ".#gg.#.........",
    "#ggg#..........",
    "#ggg#..........",
    "#ggg#..........",
    "####...........",
  ];
  const mid = side.map((r) => r.replace(/\./g, (m, i) => m));
  return voxelModel({
    palette: { "#": 0x23262b, g: 0x3a3226, b: 0x5d636b },
    layers: [side, mid, side],
    axis: "x",
    voxel: 0.34,
    anchor: "center",
  }).translate(0, -0.9, 1.2);
}

/** Rifle scope refit with a magnetic mount; tube along +Z. */
export function scopeGeo(): THREE.BufferGeometry {
  const outer = [
    "..............",
    "##..........##",
    "##############",
    "##############",
    "##..........##",
  ];
  const core = [
    "....mmmm......",
    "l############e",
    "l############e",
    "l############e",
    "L#..........#E",
  ];
  return voxelModel({
    palette: { "#": 0x1c1e22, m: 0x8c9298, l: 0x3a6a8a, e: 0x7fb8d8, L: 0x1c1e22, E: 0x1c1e22 },
    layers: [outer, core, core, outer],
    axis: "x",
    voxel: 0.3,
    anchor: "center",
  });
}

export function magazineGeo(): THREE.BufferGeometry {
  const s = ["###", "#m#", "#m#", "#m#", "#m#", "###"];
  return voxelModel({ palette: { "#": 0x2a2d31, m: 0x3a3d42 }, layers: [s, s], axis: "x", voxel: 0.3 });
}

/** Life-support backpack with two small thruster clusters. */
export function packGeo(tone = 0xdedfdc): THREE.BufferGeometry {
  const top = shadeHex(tone, 0.8);
  return buildVoxelGeometry({
    size: [8, 11, 4],
    at(x, y, z) {
      if ((x === 0 || x === 7) && (y === 0 || y === 10)) return 0x5c6168;
      if (z === 0 && (y === 1 || y === 9) && (x === 1 || x === 6)) return 0x2b2f35;
      if (y === 10) return top;
      if (z === 0 && x >= 2 && x <= 5 && y >= 4 && y <= 6) return 0x8a9098;
      return tone;
    },
  }, { voxel: 1, anchor: "center" }).translate(0, -0.5, -2);
}

export function cameraGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry({
    size: [6, 4, 6],
    at(x, y, z) {
      if (z >= 4) return x >= 2 && x <= 3 && y >= 1 && y <= 2 ? 0x101418 : null;
      if (y === 3 && x < 2) return 0xd04030;
      return 0x2b2e33;
    },
  }, { voxel: 0.9, anchor: "center" });
}

// World props are authored in metres.

export function gloveGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry({
    size: [4, 5, 4],
    at(x, y, z) {
      if (y >= 3) return 0xb8bec6;
      return 0x7b8088;
    },
  }, { voxel: 0.058, anchor: "center" });
}

/** Rough stone lump, deterministic from seed. */
export function stoneGeo(seed: number, size: number, palette: number[], n = 7, vox?: number): THREE.BufferGeometry {
  const r = rng(seed);
  const ax = 0.7 + r() * 0.5, ay = 0.55 + r() * 0.4, az = 0.7 + r() * 0.5;
  const c = n / 2;
  return buildVoxelGeometry({
    size: [n, n, n],
    at(x, y, z) {
      const dx = (x + 0.5 - c) / (c * ax), dy = (y + 0.5 - c) / (c * ay), dz = (z + 0.5 - c) / (c * az);
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const wob = fbm(x * 0.5, y * 0.5, z * 0.5, 2, seed) * 0.6;
      if (d > 0.72 + wob) return null;
      return palette[Math.floor(fbm(x * 0.9, y * 0.9, z * 0.9, 2, seed + 5) * palette.length * 1.3) % palette.length];
    },
  }, { voxel: vox ?? size / n, anchor: "center" });
}

/** Iron meteorite: dark fusion crust with Widmanstätten cross-hatching on a cut face. */
export function ironMeteoriteGeo(seed: number, n = 12, size = 0.09): THREE.BufferGeometry {
  const r = rng(seed);
  const ax = 0.8 + r() * 0.3, ay = 0.65 + r() * 0.2, az = 0.8 + r() * 0.3;
  const c = n / 2;
  return buildVoxelGeometry({
    size: [n, n, n],
    at(x, y, z) {
      const dx = (x + 0.5 - c) / (c * ax), dy = (y + 0.5 - c) / (c * ay), dz = (z + 0.5 - c) / (c * az);
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const wob = (fbm(x * 0.4, y * 0.4, z * 0.4, 2, seed) - 0.5) * 0.35;
      if (d > 0.95 + wob) return null;
      // Polished face on top: bright metal with crossing kamacite lamellae.
      if (y >= n * 0.55 && d < 0.92) {
        const a = (x + z) % 3 === 0, b = (x - z + 30) % 4 === 0;
        return a ? 0x9aa0a6 : b ? 0x7c8288 : 0xd2d6d9;
      }
      const k = fbm(x * 0.7, y * 0.7, z * 0.7, 2, seed + 9);
      return k > 0.55 ? 0x3a2c22 : k > 0.42 ? 0x2a2420 : 0x1c1917;
    },
  }, { voxel: size / n, anchor: "center" });
}

export function teacupGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry({
    size: [5, 5, 5],
    at(x, y, z) {
      const inside = x >= 1 && x <= 3 && z >= 1 && z <= 3 && y >= 1;
      if (inside) return y === 3 ? 0x8a6a2a : null;
      if (y === 4 && (x === 0 || x === 4 || z === 0 || z === 4)) return 0x2e5f8a;
      return 0xece8de;
    },
  }, { voxel: 0.018, anchor: "min" });
}

export function teapotGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry({
    size: [9, 7, 6],
    at(x, y, z) {
      if (x >= 2 && x <= 6 && y <= 4 && z >= 1 && z <= 4) return y === 2 ? 0x6a3a26 : 0x7c4630;
      if (x >= 3 && x <= 5 && y === 5 && z >= 2 && z <= 3) return 0x6a3a26;
      if (x === 4 && y === 6 && z === 2) return 0x4a2818;
      if (x === 7 && y >= 2 && y <= 3 && z === 2) return 0x7c4630;
      if (x === 8 && y === 4 && z === 2) return 0x7c4630;
      if (x === 1 && y >= 1 && y <= 3 && z === 2) return 0x7c4630;
      if (x === 0 && y >= 1 && y <= 3 && z === 2) return 0x7c4630;
      return null;
    },
  }, { voxel: 0.022, anchor: "min" });
}

/** Pencil-thin machined meteorite slug. */
export function slugGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry({
    size: [3, 5, 3],
    at(x, y, z) {
      if ((x === 0 || x === 2) && (z === 0 || z === 2)) return null;
      return y === 4 ? 0xaab0b4 : (x + y + z) % 2 === 0 ? 0x565b60 : 0x4a4e52;
    },
  }, { voxel: 0.0026, anchor: "center" });
}

/** Caseless round: propellant block + bullet tip. */
export function roundGeo(tip: "copper" | "iron"): THREE.BufferGeometry {
  const t = tip === "copper" ? [0xc27a3c, 0xa8622c] : [0x565b60, 0x3e4246];
  return buildVoxelGeometry({
    size: [3, 9, 3],
    at(x, y, z) {
      const corner = (x === 0 || x === 2) && (z === 0 || z === 2);
      if (y <= 5) return corner ? null : y === 0 ? 0x5a4a30 : 0x8a7650;
      if (corner) return null;
      if (y === 8 && !(x === 1 && z === 1)) return null;
      return (x + y) % 2 ? t[0] : t[1];
    },
  }, { voxel: 0.0028, anchor: "min" });
}

export function pliersGeo(): THREE.BufferGeometry {
  const s = [
    "......##",
    "....###.",
    "..###...",
    "rr#.....",
    "rr......",
    "rr......",
    "r.......",
  ];
  return voxelModel({ palette: { "#": 0x5a5f66, r: 0xa82a24 }, layers: [s], axis: "x", voxel: 0.02 });
}

export function knifeGeo(): THREE.BufferGeometry {
  const s = ["......#########", "wwwww#########.", "wwwww##########", "......#######.."];
  return voxelModel({ palette: { "#": 0xb8bec4, w: 0x3a2618 }, layers: [s], axis: "x", voxel: 0.012 });
}

/** Raw beef chunk with fat marbling. */
export function beefGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry({
    size: [14, 7, 10],
    at(x, y, z) {
      const e = Math.abs(x - 6.5) / 7 + Math.abs(y - 3) / 5 + Math.abs(z - 4.5) / 6;
      if (e > 1.45) return null;
      const f = fbm(x * 0.4, y * 0.6, z * 0.4, 3, 77);
      if (f > 0.62) return 0xe8d6c8;
      return f > 0.45 ? 0x9a1e24 : 0x7a141a;
    },
  }, { voxel: 0.03, anchor: "min" });
}

/** Wrapped cloth bundle; layered spacesuit fabric. */
export function bundleGeo(holes: boolean): THREE.BufferGeometry {
  const holeSet = new Set(["9,5", "11,3", "12,6", "13,4"]);
  return buildVoxelGeometry({
    size: [22, 12, 16],
    at(x, y, z) {
      const e = ((x - 10.5) / 11) ** 2 + ((y - 4) / 8) ** 2 + ((z - 7.5) / 8) ** 2;
      if (e > 1 || y < 0) return null;
      if (holes && z === 15 && holeSet.has(`${x},${y}`)) return 0x1a1a1a;
      const fold = (x * 3 + y * 5 + z) % 9 === 0;
      return fold ? 0xc9c7bd : (x + y) % 5 === 0 ? 0xdcdad0 : 0xe6e4da;
    },
  }, { voxel: 0.03, anchor: "min" });
}

/** Opened bundle showing the laminate: shell, foam and tubing. */
export function laminateGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry({
    size: [26, 4, 20],
    at(x, y, z) {
      if (y === 0) return 0xe6e4da;
      if (y === 1) return (x + z) % 7 === 0 ? 0xd8b84a : 0xe8cc6a;
      if (y === 2) return z % 5 === 2 ? 0x3a78c8 : x % 9 === 4 ? 0x2c64a8 : null;
      if (y === 3) return x < 6 || z < 3 ? 0xdcdad0 : null;
      return null;
    },
  }, { voxel: 0.025, anchor: "min" });
}

export function magnifierGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry({
    size: [9, 1, 14],
    at(x, _y, z) {
      if (z >= 8) return x >= 3 && x <= 5 ? 0x2a1a10 : null;
      const d = Math.hypot(x - 4, z - 4);
      if (d > 4.3) return null;
      return d > 3.3 ? 0xb89a4a : 0x9fc4d8;
    },
  }, { voxel: 0.012, anchor: "center" });
}

export function microscopeGeo(): THREE.BufferGeometry {
  return buildVoxelGeometry({
    size: [6, 12, 7],
    at(x, y, z) {
      if (y <= 1) return x >= 0 && z >= 0 ? 0x1e2226 : null;
      if (z <= 1 && y <= 9 && x >= 2 && x <= 3) return 0x2a2f35;
      if (y === 4 && z >= 2 && z <= 5 && x >= 1 && x <= 4) return 0x3a3f45;
      if (x >= 2 && x <= 3 && z >= 2 && z <= 4 && y >= 6) return y === 11 ? 0x101010 : 0xd8d8d4;
      return null;
    },
  }, { voxel: 0.03, anchor: "min" });
}

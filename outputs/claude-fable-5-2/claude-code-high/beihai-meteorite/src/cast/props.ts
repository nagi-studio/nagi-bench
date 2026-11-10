import * as THREE from "three";
import { voxelModel, voxelMaterial } from "@agentbench/voxel-kit";
import { Vox, lumpVox } from "../lib/vox";
import { jit, mixHex, hash3 } from "../lib/util";

/**
 * Hand props, drawn as character grids or painted voxel lumps. Sizes are in
 * figure pixels (1 px ≈ 5.6 cm) for anything that mounts on a hand anchor, and
 * in metres for free-standing set dressing.
 */

const shared = voxelMaterial();
const metal = voxelMaterial({ roughness: 0.55, metalness: 0.35 });

function mesh(geometry: THREE.BufferGeometry, material: THREE.Material = shared): THREE.Mesh {
  const m = new THREE.Mesh(geometry, material);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** Service pistol: barrel along +Z, grip along -Y, origin in the fist. */
export function makePistol(): THREE.Group {
  const side = [
    "...........s",
    "SSSSSSSSSSSS",
    "SSSSSSSSSSSh",
    "FFFFFFFFF...",
    "GGGFtF......",
    "GGG.........",
    "GGG.........",
    "gGG.........",
  ];
  const core = [
    "............",
    "SSSSSSSSSSSS",
    "SSSSSSSSSSSh",
    "FFFFFFFFF...",
    "GGG.t.......",
    "GGG.........",
    "GGG.........",
    "MMM.........",
  ];
  const geometry = voxelModel({
    palette: { S: 0x2b2e35, s: 0x15161a, h: 0x0a0a0c, F: 0x1d1f24, G: 0x33302c, g: 0x26231f, t: 0x121316, M: 0x3d4048 },
    layers: [side, core, side],
    axis: "x",
    voxel: 0.34,
  });
  const g = new THREE.Group();
  const m = mesh(geometry, metal);
  // Bring the grip (back-bottom of the drawing) into the fist.
  m.position.set(0, 0.62, 1.5);
  g.add(m);
  return g;
}

/** Rifle scope converted to a magnet mount; sits on the pistol's slide. */
export function makeScope(): THREE.Mesh {
  const v = new Vox(3, 5, 12);
  v.box(0, 2, 0, 3, 5, 12, (x, y, z) => ((x === 0 || x === 2) && (y === 2 || y === 4) ? null : 0x1a1c20));
  v.box(0, 2, 0, 3, 5, 2, (x, y) => ((x === 0 || x === 2) && (y === 2 || y === 4) ? null : 0x2a2d33));
  v.box(0, 2, 10, 3, 5, 12, (x, y) => ((x === 0 || x === 2) && (y === 2 || y === 4) ? null : 0x2a2d33));
  v.set(1, 3, 11, 0x5d7fb0).set(1, 3, 0, 0x3a4f70);
  v.box(1, 4, 5, 2, 5, 7, 0x3a3d44);
  v.box(1, 0, 3, 2, 2, 5, 0x9a2a22); // magnet shoe
  v.box(1, 0, 8, 2, 2, 10, 0x9a2a22);
  return mesh(v.geometry(0.3, "center"), metal);
}

export function makeMagazine(): THREE.Mesh {
  const geometry = voxelModel({
    palette: { M: 0x3d4048, m: 0x2c2e34, b: 0x57493a },
    layers: [["bb", "MM", "MM", "MM", "MM", "mm"]],
    axis: "x",
    voxel: 0.34,
  });
  return mesh(geometry, metal);
}

/** Pressure glove, once twisted off the wrist ring. */
export function makeGlove(): THREE.Mesh {
  const v = new Vox(5, 5, 5);
  v.box(0, 0, 0, 5, 4, 5, 0x8b9099);
  v.box(0, 4, 0, 5, 5, 5, 0x757a84);
  v.carve(1, 4, 1, 4, 5, 4);
  return mesh(v.geometry(0.9, "center"));
}

/** Suit backpack with cold-gas thruster quads; mounts on the back anchor. */
export function makeBackpack(accent = 0x8d929b): THREE.Mesh {
  const v = new Vox(9, 12, 4);
  v.box(0, 0, 0, 9, 12, 4, (x, y, z) => jit(0xd4d6da, x, y, z, 0.04));
  v.box(0, 10, 0, 9, 12, 1, accent);
  v.box(1, 1, 0, 8, 3, 1, 0x9da2ab);
  v.box(3, 4, 0, 6, 9, 1, 0xb9bdc4);
  v.set(4, 6, 0, 0xc73a34);
  for (const [x, y] of [[0, 0], [8, 0], [0, 11], [8, 11]] as Array<[number, number]>) v.box(x, y, 0, x + 1, y + 1, 2, 0x4a4e57);
  const m = mesh(v.geometry(1, "center"));
  m.position.set(0, 0, -2.3);
  return m;
}

/** Work bag on the hip. */
export function makePouch(): THREE.Mesh {
  const v = new Vox(3, 5, 5);
  v.box(0, 0, 0, 3, 5, 5, (x, y, z) => jit(0xbfc3ca, x, y, z, 0.05));
  v.box(0, 4, 0, 3, 5, 5, 0x8d929b);
  v.set(2, 3, 2, 0x4a4e57);
  return mesh(v.geometry(1, "center"));
}

/** Photographer's EVA camera. */
export function makeCamera(): THREE.Mesh {
  const geometry = voxelModel({
    palette: { B: 0x2a2c31, L: 0x15161a, g: 0x6d88b5, o: 0xd9892c },
    layers: [
      ["BBBB..", "BBBBLL", "BBBBLL", "BBBB.."],
      ["BoBB..", "BBBBLg", "BBBBLg", "BBBB.."],
      ["BBBB..", "BBBBLL", "BBBBLL", "BBBB.."],
    ],
    axis: "x",
    voxel: 0.8,
  });
  return mesh(geometry, metal);
}

/** Celadon teacup with tea in it; origin at the base centre, in metres. */
export function makeCup(scale = 0.024): THREE.Mesh {
  const v = new Vox(6, 5, 6);
  const corner = (x: number, z: number) => (x === 0 || x === 5) && (z === 0 || z === 5);
  v.box(1, 0, 1, 5, 1, 5, 0x8fa699);
  v.box(0, 1, 0, 6, 5, 6, (x, y, z) => (corner(x, z) ? null : jit(y === 4 ? 0xc6d8cb : 0xb3c8ba, x, y, z, 0.04)));
  v.carve(1, 3, 1, 5, 5, 5);
  // Tea, with one pale glint on its surface: the lamp, or a star.
  v.box(1, 3, 1, 5, 4, 5, (x, _y, z) => (x === 3 && z === 2 ? 0xffe9b8 : jit(0x6a3c14, x, 0, z, 0.1)));
  const geometry = v.geometry(scale, "center");
  geometry.translate(0, scale * 2.5, 0);
  return mesh(geometry, voxelMaterial({ roughness: 0.4 }));
}

export function makeTeapot(): THREE.Mesh {
  const v = new Vox(9, 6, 6);
  v.box(1, 0, 0, 7, 5, 6, (x, y, z) => ((x === 1 || x === 6) && (z === 0 || z === 5) ? null : jit(0x6b3a2a, x, y, z, 0.08)));
  v.box(2, 5, 1, 6, 6, 5, 0x5a3024);
  v.set(4, 5, 3, 0x2a1810).set(3, 5, 2, 0x2a1810);
  v.box(7, 2, 2, 9, 3, 4, 0x6b3a2a).set(8, 3, 2, 0x6b3a2a).set(8, 3, 3, 0x6b3a2a);
  v.set(0, 2, 2, 0x5a3024).set(0, 3, 2, 0x5a3024).set(0, 2, 3, 0x5a3024).set(0, 3, 3, 0x5a3024);
  return mesh(v.geometry(0.025, "center"));
}

/** Phone with a lit screen; the screen is a separate unlit face. */
export function makePhone(): THREE.Group {
  const g = new THREE.Group();
  const body = new Vox(3, 6, 1);
  body.box(0, 0, 0, 3, 6, 1, 0x111216);
  g.add(mesh(body.geometry(0.42, "center")));
  const screen = new Vox(3, 6, 1);
  screen.box(0, 0, 0, 3, 6, 1, (x, y) => (y === 4 ? 0xbfe0ff : y === 1 && x === 1 ? 0x4bd07a : 0x9cc8f4));
  const s = new THREE.Mesh(screen.geometry(0.36, "center"), new THREE.MeshBasicMaterial({ vertexColors: true }));
  s.position.set(0, 0, 0.16);
  s.scale.set(1, 1, 0.3);
  g.add(s);
  return g;
}

export function makeMagnifier(): THREE.Mesh {
  const geometry = voxelModel({
    palette: { R: 0x9a7a3a, G: 0xa9c9d9, H: 0x2a1a12 },
    layers: [[".RRR.", "RGGGR", "RGGGR", "RGGGR", ".RRR.", "..H..", "..H..", "..H.."]],
    axis: "x",
    voxel: 0.5,
  });
  return mesh(geometry);
}

export function makePliers(): THREE.Mesh {
  const geometry = voxelModel({
    palette: { S: 0x70757e, R: 0x8a2a22 },
    layers: [["RR....", ".RRSSS", ".RRSSS", "RR...."]],
    axis: "x",
    voxel: 0.4,
  });
  return mesh(geometry, metal);
}

export function makeKnife(): THREE.Mesh {
  const geometry = voxelModel({
    palette: { S: 0xb9bdc4, H: 0x2a1a12 },
    layers: [["HHHSSSSS", "HHH.SSS."]],
    axis: "x",
    voxel: 0.4,
  });
  return mesh(geometry, metal);
}

/* ---------- meteorites ---------- */

export type StoneKind = "iron" | "stony" | "pallasite" | "tektite" | "mars";

export function stoneColour(kind: StoneKind, seed: number) {
  return (x: number, y: number, z: number, edge: number): number => {
    const h = hash3(x + seed * 7, y, z);
    const h2 = hash3(Math.floor(x / 2) + seed, Math.floor(y / 2), Math.floor(z / 2));
    switch (kind) {
      case "iron": {
        // Fusion crust with rusty thumbprints and a few bright nickel glints.
        let c = mixHex(0x2c2824, 0x4a3a30, h2);
        if (h > 0.95) c = 0x8d8f96;
        else if (h > 0.84) c = 0x4f3a2c;
        return jit(c, x, y, z, 0.1);
      }
      case "stony":
        return jit(h > 0.85 ? 0x9a8f80 : mixHex(0x5a5148, 0x76695a, h2), x, y, z, 0.1);
      case "pallasite":
        return h > 0.6 ? jit(0xc9a23a, x, y, z, 0.15) : jit(0x6f7178, x, y, z, 0.1);
      case "tektite":
        return jit(mixHex(0x16201a, 0x2a3a2c, h2), x, y, z, 0.08);
      default:
        return jit(edge > 0.6 && h > 0.7 ? 0x3a2a22 : mixHex(0x6a4a38, 0x8a5a40, h2), x, y, z, 0.1);
    }
  };
}

export function makeStone(kind: StoneKind, seed: number, radius = 3.5, voxel = 0.012, squash: [number, number, number] = [1, 0.8, 0.9]): THREE.Mesh {
  const v = lumpVox(radius * squash[0], radius * squash[1], radius * squash[2], seed, stoneColour(kind, seed), 0.4);
  const material = kind === "iron" || kind === "pallasite" ? voxelMaterial({ roughness: 0.6, metalness: 0.3 }) : shared;
  const m = mesh(v.geometry(voxel, "center"), material);
  m.userData.halfHeight = (Math.ceil(radius * squash[1] * 2) + 2) * voxel * 0.5 - voxel;
  return m;
}

/** A cut meteorite segment: the bullet. Axis along +Z, 2×2 voxels across. */
export function slugGeometry(voxel: number, long = 3): THREE.BufferGeometry {
  const v = new Vox(2, 2, long);
  v.box(0, 0, 0, 2, 2, long, (x, y, z) => {
    const h = hash3(x * 3 + 1, y * 5 + 2, z * 7 + 3);
    return h > 0.72 ? 0xc3c6cc : h > 0.4 ? 0x9a9ca2 : h > 0.15 ? 0x77736c : 0x4d463f;
  });
  return v.geometry(voxel, "center");
}

export const slugMaterial = (): THREE.MeshStandardMaterial => voxelMaterial({ roughness: 0.5, metalness: 0.4 });

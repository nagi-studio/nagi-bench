import * as THREE from "three";
import { voxelModel, voxelMaterial, buildVoxelGeometry } from "@agentbench/voxel-kit";
import { mulberry32 } from "./util";

/**
 * All props are drawn as character grids or voxel fills — same block language
 * as the cast and the world.
 */

const GUNMETAL = 0x2b3038;
const GRIP = 0x4a3a2c;

// Pistol side elevation, three slices thick. Column 0 = back, last column = muzzle.
const PISTOL_ROWS = [
  "..##########",
  "..##########",
  "..##########",
  ".##########.",
  ".###..##....",
  ".###........",
  ".###........",
  ".###........",
];

export function pistolGeometry(): THREE.BufferGeometry {
  return voxelModel({
    palette: { "#": GUNMETAL, g: GRIP, o: 0x8a6a3a },
    layers: [PISTOL_ROWS, PISTOL_ROWS, PISTOL_ROWS],
    axis: "x",
    voxel: 0.3,
  });
}

export function pistolMesh(): THREE.Mesh {
  const mesh = new THREE.Mesh(pistolGeometry(), voxelMaterial({ roughness: 0.7, metalness: 0.4 }));
  // Nudge the grip into the hand anchor (origin = fist).
  mesh.position.set(0, 0.55, 1.05);
  return mesh;
}

/** Small telescopic sight: blocky tube with a wider objective and a lens. */
export function scopeMesh(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.09, 0.26),
    new THREE.MeshStandardMaterial({ color: 0x2b3038, roughness: 0.5, metalness: 0.5 }),
  );
  const objective = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.15, 0.07),
    new THREE.MeshStandardMaterial({ color: 0x1c1f24, roughness: 0.4, metalness: 0.6 }),
  );
  objective.position.z = 0.145;
  const lens = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 0.11, 0.015),
    new THREE.MeshStandardMaterial({
      color: 0x7fb7d8,
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0x0a2030,
      emissiveIntensity: 0.5,
    }),
  );
  lens.position.z = 0.18;
  const eye = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 0.11, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x1c1f24, roughness: 0.5, metalness: 0.5 }),
  );
  eye.position.z = -0.14;
  g.add(body, objective, lens, eye);
  return g;
}

/** A lumpy meteorite rock with speckled colour, via a seeded voxel sphere. */
export function meteoriteMesh(radius = 0.13, seed = 1): THREE.Mesh {
  const rng = mulberry32(seed);
  const base = 0x3a3f46;
  const geo = buildVoxelGeometry(
    {
      size: [5, 5, 5],
      at(x, y, z) {
        const cx = x - 2;
        const cy = y - 2;
        const cz = z - 2;
        const d = Math.sqrt(cx * cx + cy * cy + cz * cz);
        const wobble = (rng() - 0.5) * 1.2;
        if (d > 2.2 + wobble) return null;
        const speck = rng();
        if (speck < 0.12) return 0x8a6a4a;
        if (speck < 0.2) return 0x2a2e34;
        return base;
      },
    },
    { voxel: radius / 2.2 },
  );
  return new THREE.Mesh(geo, voxelMaterial({ roughness: 0.85 }));
}

/** A short metal cylinder (a machined meteorite slug) standing on its axis. */
export function slugMesh(r = 0.045, h = 0.16, seed = 1): THREE.Mesh {
  const rng = mulberry32(seed);
  const geo = buildVoxelGeometry(
    {
      size: [4, 6, 4],
      at(x, y, z) {
        const cx = x - 1.5;
        const cz = z - 1.5;
        if (cx * cx + cz * cz > 1.8 * 1.8) return null;
        const speck = rng();
        if (speck < 0.18) return 0x5a554a;
        return 0x343940;
      },
    },
    { voxel: 0.032 },
  );
  return new THREE.Mesh(geo, voxelMaterial({ roughness: 0.6, metalness: 0.35 }));
}

/** A rifle-style cartridge (7.62mm). Small but readable up close. */
export function cartridgeMesh(): THREE.Mesh {
  const geo = voxelModel({
    palette: { "#": 0x9a6b2e, b: 0x2b3038 },
    layers: [
      ["b", "b", "b"],
      ["#", "#", "#"],
      ["#", "#", "#"],
      ["#", "#", "#"],
      ["#", "#", "#"],
      ["#", "#", "#"],
      ["#", "#", "#"],
      ["#", "#", "#"],
    ],
    axis: "y",
    voxel: 0.024,
  });
  return new THREE.Mesh(geo, voxelMaterial({ roughness: 0.5, metalness: 0.5 }));
}

import * as THREE from "three";
import { voxelMaterial, voxelModel } from "@agentbench/voxel-kit";
import { meshOf, voxelBox, woodColour } from "./geom";

export function makePistol(): THREE.Mesh {
  const geo = voxelModel({
    palette: { "#": 0x2a3038, g: 0x3a2a20, m: 0x5a626c, o: 0x1a1c20 },
    voxel: 0.32,
    axis: "x",
    layers: [
      [
        "............",
        ".......mmmm.",
        ".......m..m.",
        "..###########",
        "..##ggg#####",
        "..##ooo.....",
        ".g##........",
        ".gg.........",
      ].map((row) => row.padEnd(13, ".")),
      [
        "............",
        ".......mmmm.",
        ".......mmmm.",
        "..###########",
        "..##ggg#####",
        "..##ooo.....",
        ".g##........",
        ".gg.........",
      ].map((row) => row.padEnd(13, ".")),
      [
        "............",
        ".......mmmm.",
        ".......m..m.",
        "..###########",
        "..##ggg#####",
        "..##ooo.....",
        ".g##........",
        ".gg.........",
      ].map((row) => row.padEnd(13, ".")),
    ],
  });
  const mesh = meshOf(geo, voxelMaterial({ roughness: 0.35, metalness: 0.7 }));
  mesh.position.set(0, -0.6, 1.2);
  return mesh;
}

export function makeScope(): THREE.Mesh {
  const geo = voxelModel({
    palette: { "#": 0x2a2e34, g: 0x4a5560, l: 0x1a3040 },
    voxel: 0.26,
    axis: "x",
    layers: [
      ["......", "..##..", ".#ll#.", ".#ll#.", "..##..", "......"],
      ["......", ".g##g.", "g#ll#g", "g#ll#g", ".g##g.", "......"],
      ["......", "..##..", ".#ll#.", ".#ll#.", "..##..", "......"],
    ],
  });
  return meshOf(geo, voxelMaterial({ roughness: 0.3, metalness: 0.65 }));
}

export function makeCup(): THREE.Mesh {
  const geo = voxelModel({
    palette: { "#": 0xc8b090, w: 0x6a8aaa, s: 0xb89a78 },
    voxel: 0.28,
    axis: "y",
    layers: [
      ["....", ".ss.", ".ss.", "...."],
      ["ssss", "s..s", "s..s", "ssss"],
      ["ssss", "swws", "swws", "ssss"],
      [".ss.", ".ss.", ".ss.", ".ss."],
    ],
  });
  return meshOf(geo, voxelMaterial({ roughness: 0.55, metalness: 0.05 }));
}

export function makePhone(): THREE.Mesh {
  const geo = voxelBox(1, 8, 4, (x, y, z) => (y === 7 ? 0x8ab4c8 : 0x1a1e24), { voxel: 0.22 });
  return meshOf(geo, voxelMaterial({ roughness: 0.3, metalness: 0.4 }));
}

export function makeMagnifier(): THREE.Mesh {
  const geo = voxelModel({
    palette: { "#": 0xc4a45a, l: 0x8ec0d8, h: 0x5a3a24 },
    voxel: 0.3,
    axis: "x",
    layers: [
      ["..###..", ".#lll#.", "#lllll#", ".#lll#.", "..###..", "...h...", "...h...", "...h..."],
      ["..###..", ".#lll#.", "#lllll#", ".#lll#.", "..###..", "...h...", "...h...", "...h..."],
    ],
  });
  return meshOf(geo, voxelMaterial({ roughness: 0.35, metalness: 0.45 }));
}

export function makeCnc(): THREE.Group {
  const g = new THREE.Group();
  const bed = meshOf(
    voxelBox(18, 3, 10, (x, y, z) => (y === 2 ? 0x4a5560 : 0x2a3038), { voxel: 0.12, anchor: "min" }),
    voxelMaterial({ roughness: 0.4, metalness: 0.55 }),
  );
  const gantry = meshOf(
    voxelBox(2, 8, 10, 0x6a7380, { voxel: 0.12, anchor: "min" }),
    voxelMaterial({ roughness: 0.35, metalness: 0.6 }),
  );
  gantry.position.set(0.9, 0.36, 0);
  gantry.name = "gantry";
  const spindle = meshOf(
    voxelBox(1, 4, 1, 0x9aa4b0, { voxel: 0.12, anchor: "min" }),
    voxelMaterial({ roughness: 0.3, metalness: 0.7 }),
  );
  spindle.position.set(1.02, 0.72, 0.54);
  spindle.name = "spindle";
  const panel = meshOf(
    voxelBox(3, 5, 1, (x, y) => (y > 1 && x === 1 ? 0x3a80c8 : 0x1a2028), { voxel: 0.12, anchor: "min" }),
    voxelMaterial({ roughness: 0.4, metalness: 0.3, emissive: 0x123050, emissiveIntensity: 0.35 }),
  );
  panel.position.set(1.9, 0.36, -0.05);
  g.add(bed, gantry, spindle, panel);
  return g;
}

export function makeCabinet(): THREE.Group {
  const g = new THREE.Group();
  const frame = meshOf(
    voxelBox(6, 12, 3, (x, y, z) => {
      if (z === 2 && x > 0 && x < 5 && y > 0 && y < 11) return 0x89a8c0;
      return woodColour(x, y, z, 0x3a2a1c);
    }, { voxel: 0.12, anchor: "min" }),
    voxelMaterial({ roughness: 0.55, metalness: 0.08 }),
  );
  g.add(frame);
  return g;
}

export function makeWorkbench(): THREE.Mesh {
  return meshOf(
    voxelBox(14, 6, 6, (x, y, z) => {
      if (y >= 4) return woodColour(x, y, z, 0x6a4a30);
      if (x < 2 || x > 11 || z < 1 || z > 4) return woodColour(x, y, z, 0x4a3020);
      return null;
    }, { voxel: 0.12, anchor: "min" }),
    voxelMaterial({ roughness: 0.6, metalness: 0.05 }),
  );
}

export function makeTeaTable(): THREE.Mesh {
  return meshOf(
    voxelBox(8, 4, 8, (x, y, z) => {
      if (y === 3) return woodColour(x, y, z, 0x5a3a24);
      if ((x < 1 || x > 6) && (z < 1 || z > 6)) return woodColour(x, y, z, 0x4a2e1c);
      if (y < 3 && (x === 0 || x === 7 || z === 0 || z === 7) && (x + z) % 2 === 0) {
        return woodColour(x, y, z, 0x4a2e1c);
      }
      return y === 0 && (x === 0 || x === 7 || z === 0 || z === 7) ? woodColour(x, y, z, 0x4a2e1c) : null;
    }, { voxel: 0.1, anchor: "min" }),
    voxelMaterial({ roughness: 0.58, metalness: 0.04 }),
  );
}

export function makeSafe(): THREE.Mesh {
  return meshOf(
    voxelBox(5, 6, 4, (x, y, z) => {
      if (z === 3 && x > 0 && x < 4 && y > 0 && y < 5) return 0x2a3038;
      if (x === 3 && y === 3 && z === 3) return 0xc4a45a;
      return 0x3a424c;
    }, { voxel: 0.12, anchor: "min" }),
    voxelMaterial({ roughness: 0.32, metalness: 0.7 }),
  );
}

export function makeClothBag(): THREE.Mesh {
  return meshOf(
    voxelBox(6, 4, 5, (x, y, z) => {
      const n = (x + z) % 2;
      if (y === 3 && n === 0) return 0x8a9098;
      return 0x6a727c;
    }, { voxel: 0.08, anchor: "min" }),
    voxelMaterial({ roughness: 0.85, metalness: 0.05 }),
  );
}

export function makeBeef(): THREE.Mesh {
  return meshOf(
    voxelBox(5, 3, 4, (x, y, z) => (y === 2 ? 0xa05048 : 0x7a3028), { voxel: 0.07, anchor: "min" }),
    voxelMaterial({ roughness: 0.7, metalness: 0 }),
  );
}

export function makeBullet(): THREE.Mesh {
  const geo = voxelBox(1, 1, 4, (x, y, z) => (z > 2 ? 0x8a7a68 : 0x5a5048), { voxel: 0.012, anchor: "center" });
  return meshOf(geo, voxelMaterial({ roughness: 0.35, metalness: 0.65 }));
}

export function makeCylinder(): THREE.Mesh {
  const geo = voxelBox(1, 1, 3, 0x6a5a4c, { voxel: 0.03, anchor: "center" });
  return meshOf(geo, voxelMaterial({ roughness: 0.4, metalness: 0.7 }));
}

export function makeLantern(): THREE.Mesh {
  const geo = voxelBox(2, 3, 2, (x, y) => (y === 0 || y === 2 ? 0x3a2418 : 0xc45a3a), { voxel: 0.08, anchor: "center" });
  return new THREE.Mesh(
    geo,
    voxelMaterial({
      roughness: 0.5,
      metalness: 0,
      emissive: 0xc45a28,
      emissiveIntensity: 0.85,
    }),
  );
}

export function makeTree(): THREE.Group {
  const g = new THREE.Group();
  const trunk = meshOf(
    voxelBox(2, 6, 2, 0x4a3020, { voxel: 0.18, anchor: "min" }),
    voxelMaterial({ roughness: 0.8, metalness: 0 }),
  );
  const crown = meshOf(
    voxelBox(6, 5, 6, (x, y, z) => {
      const cx = x - 3;
      const cy = y - 2;
      const cz = z - 3;
      if (cx * cx + cy * cy * 0.7 + cz * cz > 8.5) return null;
      return 0x2f4a32;
    }, { voxel: 0.18, anchor: "min" }),
  );
  crown.position.set(-0.36, 0.9, -0.36);
  g.add(trunk, crown);
  return g;
}

export function makeChair(): THREE.Mesh {
  return meshOf(
    voxelBox(4, 6, 4, (x, y, z) => {
      if (y === 3) return woodColour(x, y, z, 0x5a3a24);
      if (z === 0 && y >= 3) return woodColour(x, y, z, 0x5a3a24);
      if (y < 3 && (x === 0 || x === 3) && (z === 0 || z === 3)) return woodColour(x, y, z, 0x4a2e1c);
      return null;
    }, { voxel: 0.08, anchor: "min" }),
  );
}

export function makeMicroscope(): THREE.Mesh {
  const geo = voxelModel({
    palette: { "#": 0x3a4048, b: 0x2a3038, e: 0xc4a45a },
    voxel: 0.04,
    axis: "x",
    layers: [
      ["..##..", "..##..", "...#..", "eeeeee", "..bb..", "..bb.."],
      ["..##..", "..##..", "..##..", "eeeeee", ".bbb..", ".bbb.."],
      ["..##..", "..##..", "...#..", "eeeeee", "..bb..", "..bb.."],
    ],
  });
  return meshOf(geo, voxelMaterial({ roughness: 0.35, metalness: 0.55 }));
}

export function makeGlove(): THREE.Mesh {
  const geo = voxelBox(3, 3, 4, 0xe8eef4, { voxel: 0.35, anchor: "center" });
  return meshOf(geo, voxelMaterial({ roughness: 0.7, metalness: 0.1 }));
}

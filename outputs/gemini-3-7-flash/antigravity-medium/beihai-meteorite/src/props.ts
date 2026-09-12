import * as THREE from "three";
import {
  buildVoxelGeometry,
  voxelMaterial,
  voxelModel,
  type VoxelSource,
} from "@agentbench/voxel-kit";

/**
 * 1. Type 2010 Military Service Pistol
 * Hand anchors are oriented so +Z points out the barrel and +Y is up.
 */
export function createPistolMesh(): THREE.Mesh {
  const PISTOL_PALETTE = {
    "#": 0x1f242b, // Dark gunmetal slide
    "=": 0x333b45, // Slide highlight
    "g": 0x2e2015, // Textured polymer / wood grip
    "t": 0x5a6370, // Trigger & hammer
  };

  // Side elevation (x-axis layers)
  // Row 0 is top, col 0 is back, +Z points along column axis (right)
  const SIDE_OUTER = [
    "....######",
    "....######",
    "....##....",
    "...gg.....",
    "...gg.....",
    "...gg.....",
  ];
  const SIDE_MID = [
    "....======",
    "...#######",
    "....t#....",
    "...gg.....",
    "...gg.....",
    "...gg.....",
  ];

  const geo = voxelModel({
    palette: PISTOL_PALETTE,
    layers: [SIDE_OUTER, SIDE_MID, SIDE_OUTER],
    axis: "x",
    voxel: 0.28,
    anchor: "center",
  });

  const mesh = new THREE.Mesh(geo, voxelMaterial({ roughness: 0.6, metalness: 0.4 }));
  mesh.name = "prop:pistol-2010";
  mesh.rotation.y = Math.PI / 2; // Orient along +Z
  mesh.position.set(0, -0.4, 0.4);
  return mesh;
}

/**
 * 2. Magnetic High-Powered Sniper Scope (Mounted on Pistol)
 */
export function createSniperScopeMesh(): THREE.Mesh {
  const SCOPE_PALETTE = {
    "#": 0x1e2229, // Scope tube body
    "g": 0x2d3440, // Mount clamps
    "L": 0x38bdf8, // Glass lens blue reflection
    "R": 0x0284c7, // Reticle dark blue rim
  };

  const SIDE_EDGE = [
    ".######.",
    ".######.",
    "..g..g..",
  ];
  const SIDE_CENTER = [
    "L######R",
    "L######R",
    "..g..g..",
  ];

  const geo = voxelModel({
    palette: SCOPE_PALETTE,
    layers: [SIDE_EDGE, SIDE_CENTER, SIDE_EDGE],
    axis: "x",
    voxel: 0.25,
    anchor: "center",
  });

  const mesh = new THREE.Mesh(geo, voxelMaterial({ roughness: 0.4, metalness: 0.5 }));
  mesh.name = "prop:sniper-scope";
  mesh.rotation.y = Math.PI / 2;
  mesh.position.set(0, 0.4, 0.2);
  return mesh;
}

/**
 * 3. Iron-Nickel Meteorite (Raw Rock with Widmanstätten glinting patterns)
 */
export function createMeteoriteMesh(scale = 1.0): THREE.Mesh {
  const size: [number, number, number] = [8, 8, 8];
  const source: VoxelSource = {
    size,
    at(x, y, z) {
      const dx = x - 3.5;
      const dy = y - 3.5;
      const dz = z - 3.5;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      // Rough irregular surface with regmaglypts (thumbprints)
      const noise = Math.sin(x * 2.1 + y * 1.7) * 0.5 + Math.cos(z * 2.4) * 0.4;
      if (dist + noise > 3.4) return null;

      // Iron-nickel mineral striations (Widmanstätten / Neumann bands)
      const striation = (x + y * 2 + z) % 3 === 0;
      if (striation) return 0x6e7888; // Bright nickel-iron band
      if ((x * 3 + z) % 4 === 0) return 0x2d3139; // Dark regmaglypt crust
      return 0x48505e; // Base meteoric iron
    },
  };

  const geo = buildVoxelGeometry(source, { voxel: 0.04 * scale, anchor: "center" });
  const mesh = new THREE.Mesh(geo, voxelMaterial({ roughness: 0.7, metalness: 0.6 }));
  mesh.name = "prop:meteorite";
  return mesh;
}

/**
 * 4. 36 Meteorite Cylinders & 7.62mm Caseless Propellant Ammo Block
 */
export function createAmmoTrayMesh(): THREE.Mesh {
  const size: [number, number, number] = [14, 3, 10];
  const source: VoxelSource = {
    size,
    at(x, y, z) {
      // Tray base
      if (y === 0) return 0x2b303a;
      // Grid of 6x6 = 36 bullet slots
      const gridX = x % 2 === 1;
      const gridZ = z % 2 === 1;
      if (gridX && gridZ && y >= 1) {
        if (y === 1) return 0x854d0e; // Caseless propellant block (solid propellant)
        if (y === 2) return 0x64748b; // Glued iron meteorite tip
      }
      return null;
    },
  };

  const geo = buildVoxelGeometry(source, { voxel: 0.035, anchor: "center" });
  const mesh = new THREE.Mesh(geo, voxelMaterial({ roughness: 0.6, metalness: 0.3 }));
  mesh.name = "prop:ammo-tray";
  return mesh;
}

/**
 * 5. Workshop CNC Lathe & Precision Milling Center
 */
export function createLatheMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = "prop:cnc-lathe";

  // Heavy steel machine base
  const baseSource: VoxelSource = {
    size: [28, 16, 16],
    at(x, y, z) {
      // Base casing
      if (y < 8) return 0x1e293b;
      // Lathe bed / sliding rail
      if (y < 10 && z >= 4 && z <= 11) return 0x475569;
      // Headstock & chuck on left
      if (x < 8 && y < 14 && z >= 3 && z <= 12) return 0x334155;
      // CNC Control screen stand on top left
      if (x >= 2 && x <= 6 && y >= 14 && z >= 4 && z <= 5) return 0x0f172a;
      // Screen face
      if (x >= 2 && x <= 6 && y >= 15 && z === 6) return 0x0284c7; // Cyan CNC screen
      return null;
    },
  };
  const baseGeo = buildVoxelGeometry(baseSource, { voxel: 0.08, anchor: "center" });
  const baseMesh = new THREE.Mesh(baseGeo, voxelMaterial({ roughness: 0.5, metalness: 0.5 }));
  group.add(baseMesh);

  // Rotating spindle chuck with clamped meteorite cylinder
  const spindleGeo = buildVoxelGeometry({
    size: [6, 6, 6],
    at(x, y, z) {
      const dx = x - 2.5;
      const dy = y - 2.5;
      if (dx * dx + dy * dy <= 5.5) return 0x94a3b8;
      return null;
    },
  }, { voxel: 0.06, anchor: "center" });
  const spindleMesh = new THREE.Mesh(spindleGeo, voxelMaterial({ roughness: 0.3, metalness: 0.8 }));
  spindleMesh.position.set(-0.5, 0.1, 0);
  spindleMesh.name = "lathe:spindle";
  group.add(spindleMesh);

  return group;
}

/**
 * 6. Ballistics Beef Target with Spacesuit Fabric Layers
 */
export function createBallisticTargetMesh(penetrated = false): THREE.Mesh {
  const size: [number, number, number] = [12, 16, 6];
  const source: VoxelSource = {
    size,
    at(x, y, z) {
      // Front spacesuit outer cover (white/grey weave)
      if (z === 0) {
        // Bullet penetration hole
        if (penetrated && ((x === 5 && y === 8) || (x === 7 && y === 9) || (x === 6 && y === 6))) {
          return 0x0f172a; // Dark penetration hole
        }
        return (x + y) % 2 === 0 ? 0xe2e8f0 : 0xcbd5e1;
      }
      // Middle thermal sponge / insulation lining
      if (z === 1) return 0xfbbf24;
      // Core raw beef block
      if (z >= 2 && z <= 4) {
        if (penetrated && ((x >= 5 && x <= 7) && (y >= 6 && y <= 9))) {
          return 0x450a0a; // Shattered meteorite dust in wound channel
        }
        return (x + y) % 3 === 0 ? 0x991b1b : 0x7f1d1d; // Deep beef crimson
      }
      // Backing board
      if (z === 5) return 0x3e2723;
      return null;
    },
  };

  const geo = buildVoxelGeometry(source, { voxel: 0.06, anchor: "center" });
  const mesh = new THREE.Mesh(geo, voxelMaterial({ roughness: 0.9, metalness: 0.05 }));
  mesh.name = "prop:ballistic-target";
  return mesh;
}

/**
 * 7. Teacup & Magnifying Glass on Wooden Table
 */
export function createTeacupMesh(): THREE.Mesh {
  const geo = buildVoxelGeometry({
    size: [4, 4, 4],
    at(x, y, z) {
      const dx = x - 1.5;
      const dz = z - 1.5;
      const r2 = dx * dx + dz * dz;
      if (r2 <= 2.2 && y <= 3) {
        if (y === 3 && r2 <= 1.2) return 0xb45309; // Amber tea liquor
        return 0xf1f5f9; // Fine white porcelain
      }
      return null;
    },
  }, { voxel: 0.04, anchor: "center" });
  return new THREE.Mesh(geo, voxelMaterial({ roughness: 0.2, metalness: 0.1 }));
}

export function createPliersMesh(): THREE.Mesh {
  const geo = voxelModel({
    palette: { "#": 0x475569, r: 0xdc2626 },
    layers: [
      ["##..", ".##.", ".rr.", ".rr."],
      ["..##", ".##.", ".rr.", ".rr."],
    ],
    axis: "x",
    voxel: 0.05,
    anchor: "center",
  });
  return new THREE.Mesh(geo, voxelMaterial({ roughness: 0.5, metalness: 0.4 }));
}

import * as THREE from "three";
import { voxelModel, voxelMaterial } from "@agentbench/voxel-kit";

// ==========================================
// 1. TYPE 2010 PISTOL WITH MAGNETIC SCOPE
// ==========================================

export function createPistolWithScope(): THREE.Group {
  const group = new THREE.Group();
  group.name = "prop:pistol-scoped";

  // Palette for pistol
  const palette = {
    B: 0x1e293b, // Gunmetal slide
    G: 0x0f172a, // Polymer grip
    S: 0x334155, // Scope body
    L: 0x38bdf8, // Scope lens cyan glow
    M: 0x94a3b8, // Magnetic mount
    T: 0x64748b, // Trigger
  };

  // 3 slices (Left, Center, Right)
  const outer = [
    "....SSSSSS....",
    "..............",
    "..BBBBBBBBBB..",
    "..BBBBBBBBBBB.",
    "...GG.........",
    "...GG.........",
    "...GG.........",
  ];
  const center = [
    "....SSSSSL....",
    ".....M..M.....",
    "..BBBBBBBBBB..",
    "..BBBBBBBBBBBF",
    "...GG.T.......",
    "...GG.........",
    "...GG.........",
  ];

  const paletteFull = { ...palette, F: 0x09090b };

  const geom = voxelModel({
    palette: paletteFull,
    layers: [outer, center, outer],
    axis: "x",
    voxel: 0.022,
    anchor: "center",
  });

  const mesh = new THREE.Mesh(geom, voxelMaterial({ roughness: 0.7, metalness: 0.3 }));
  mesh.castShadow = true;
  // Offset so grip sits neatly in fist
  mesh.position.set(0, 0.04, 0.08);
  group.add(mesh);

  return group;
}

// Standalone Magnetic Scope (before mounting onto pistol)
export function createScopeProp(): THREE.Group {
  const group = new THREE.Group();
  group.name = "prop:scope";

  const palette = {
    S: 0x334155,
    L: 0x38bdf8,
    M: 0x94a3b8,
  };
  const slice = [
    "SSSSSL",
    ".M..M.",
  ];
  const geom = voxelModel({
    palette,
    layers: [slice, slice, slice],
    axis: "x",
    voxel: 0.022,
    anchor: "center",
  });
  const mesh = new THREE.Mesh(geom, voxelMaterial({ roughness: 0.5, metalness: 0.5 }));
  group.add(mesh);
  return group;
}

// ==========================================
// 2. IRON METEORITES (铁陨石)
// ==========================================

export function createMeteoriteProp(scale = 1.0): THREE.Group {
  const group = new THREE.Group();
  group.name = "prop:meteorite";

  const palette = {
    I: 0x24272c, // Iron-nickel base
    N: 0x3b3f46, // Taenite / Kamacite band
    W: 0x606670, // Widmanstatten pattern stripe
    F: 0x858d99, // Metallic fleck
  };

  const s1 = [
    ".IIW.",
    "IINNI",
    "INWII",
    ".IIF.",
  ];
  const s2 = [
    "IIWII",
    "INWFI",
    "FWNNI",
    "IIWII",
  ];
  const s3 = [
    "INWFI",
    "WWNNI",
    "INWII",
    ".IIN.",
  ];
  const s4 = [
    ".IWI.",
    "IIWII",
    ".IIF.",
    ".....",
  ];

  const geom = voxelModel({
    palette,
    layers: [s1, s2, s3, s4],
    axis: "y",
    voxel: 0.028 * scale,
    anchor: "center",
  });

  const mesh = new THREE.Mesh(geom, voxelMaterial({ roughness: 0.6, metalness: 0.7 }));
  mesh.castShadow = true;
  group.add(mesh);
  return group;
}

// ==========================================
// 3. MACHINED METEORITE CYLINDERS (加工后的陨石圆柱体)
// ==========================================

export function createMeteoriteCylinderProp(): THREE.Group {
  const group = new THREE.Group();
  const palette = {
    M: 0x333842,
    W: 0x565d6c,
  };
  const s = [
    "MWM",
    "MMM",
    "MWM",
    "MMM",
  ];
  const geom = voxelModel({
    palette,
    layers: [s, s],
    axis: "x",
    voxel: 0.015,
    anchor: "center",
  });
  const mesh = new THREE.Mesh(geom, voxelMaterial({ roughness: 0.5, metalness: 0.8 }));
  group.add(mesh);
  return group;
}

// ==========================================
// 4. CASELESS BULLET WITH METEORITE CORE (无壳陨石子弹)
// ==========================================

export function createCaselessBulletProp(): THREE.Group {
  const group = new THREE.Group();
  const palette = {
    T: 0x333842, // Meteorite tip
    G: 0x78716c, // Space adhesive seal ring
    P: 0x854d0e, // Solid propellant block (caseless)
    B: 0x713f12,
  };
  const slice = [
    ".TT.",
    ".GG.",
    "PPPP",
    "PPPP",
    "PPPP",
    "BBBB",
  ];
  const geom = voxelModel({
    palette,
    layers: [slice, slice],
    axis: "x",
    voxel: 0.018,
    anchor: "center",
  });
  const mesh = new THREE.Mesh(geom, voxelMaterial({ roughness: 0.6, metalness: 0.4 }));
  group.add(mesh);
  return group;
}

// ==========================================
// 5. TEST BEEF TARGET BUNDLE (牛肉航天服靶包)
// ==========================================

export function createBeefTargetBundle(): THREE.Group {
  const group = new THREE.Group();
  group.name = "prop:beef-target";

  const palette = {
    W: 0xf1f5f9, // Spacesuit white fabric outer layer
    B: 0x94a3b8, // Inner insulation sponge
    M: 0x881337, // Raw beef interior
    F: 0x9f1239, // Beef muscle tissue
    T: 0x475569, // Tube binding
  };

  const layerOut = [
    "WWWWWW",
    "WBBBBW",
    "WBBBBW",
    "WWWWWW",
  ];
  const layerMid = [
    "WBBBBW",
    "BMMFFB",
    "BFFMMB",
    "WBBBBW",
  ];

  const geom = voxelModel({
    palette,
    layers: [layerOut, layerMid, layerMid, layerOut],
    axis: "y",
    voxel: 0.045,
    anchor: "center",
  });

  const mesh = new THREE.Mesh(geom, voxelMaterial({ roughness: 0.9, metalness: 0.0 }));
  mesh.castShadow = true;
  group.add(mesh);
  return group;
}

// ==========================================
// 6. TEACUP & WORKBENCH TOOLS (茶杯与工作台工具)
// ==========================================

export function createTeacupProp(): THREE.Group {
  const group = new THREE.Group();
  const palette = {
    C: 0x0d9488, // Celadon porcelain
    T: 0x78350f, // Dark amber tea liquor
  };
  const s1 = ["CCCC", "C..C", "CCCC"];
  const s2 = ["CCCC", "CTTC", "CCCC"];
  const geom = voxelModel({
    palette,
    layers: [s1, s2, s2, s1],
    axis: "y",
    voxel: 0.02,
    anchor: "center",
  });
  const mesh = new THREE.Mesh(geom, voxelMaterial({ roughness: 0.3, metalness: 0.1 }));
  group.add(mesh);
  return group;
}

// Space Camera Prop (轨道太空摄影机)
export function createSpaceCameraProp(): THREE.Group {
  const group = new THREE.Group();
  group.name = "prop:space-camera";

  const palette = {
    C: 0x1e293b,
    L: 0x38bdf8,
    B: 0xf59e0b,
    S: 0x64748b,
  };
  const s1 = [
    "..C..",
    "CCCCC",
    "CCCCC",
    "..S..",
  ];
  const s2 = [
    "..L..",
    "CCCCC",
    "CCCCC",
    "..S..",
  ];
  const geom = voxelModel({
    palette,
    layers: [s1, s2, s2, s1],
    axis: "x",
    voxel: 0.035,
    anchor: "center",
  });
  const mesh = new THREE.Mesh(geom, voxelMaterial({ roughness: 0.6, metalness: 0.4 }));
  group.add(mesh);
  return group;
}

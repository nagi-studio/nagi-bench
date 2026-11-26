import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, voxelModel } from "@agentbench/voxel-kit";

/**
 * All handheld and micro-storytelling props crafted strictly as voxel geometry
 * (`voxelModel` / `buildVoxelGeometry`). No smooth primitives anywhere.
 *
 * Remember: hand anchors in `@agentbench/voxel-kit` orient +Z along the fist
 * aiming direction and +Y upward, in figure-px units (1 px ≈ 0.05625 m).
 */

const standardMat = voxelMaterial({ roughness: 0.78, metalness: 0.12 });
const metalMat = voxelMaterial({ roughness: 0.42, metalness: 0.55 });
const glossyMat = voxelMaterial({ roughness: 0.3, metalness: 0.1 });

/** Type-2010 Service Pistol (in figure-px coordinates for handR anchor). */
export function createPistolGroup(): {
  group: THREE.Group;
  scope: THREE.Mesh;
  magazine: THREE.Mesh;
  muzzlePoint: THREE.Object3D;
} {
  const group = new THREE.Group();
  group.name = "prop:pistol-2010";

  // Side elevation (axis: "x"): col 0 = back, col max = muzzle (+Z); row 0 = top (+Y)
  const sideOuter = [
    "..#########...",
    ".###########..",
    ".###########..",
    "..####........",
    "..###.........",
    ".###..........",
    ".###..........",
    ".###..........",
  ];
  const sideInner = [
    ".###########..",
    "#############.",
    ".############.",
    "..####..#.....",
    "..###..##.....",
    ".###..........",
    ".###..........",
    ".###..........",
  ];
  const bodyGeo = voxelModel({
    palette: { "#": 0x252b34 },
    layers: [sideOuter, sideInner, sideOuter],
    axis: "x",
    voxel: 0.32,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, metalMat);
  bodyMesh.position.set(0, 0.35, 1.35);
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Detachable magnetic rifle scope mounted cleanly on top rail
  const scope = createScopeMesh(0.3);
  scope.position.set(0, 1.95, 1.45);
  scope.visible = false;
  group.add(scope);

  // Detachable magazine inside grip (can animate drop/insert)
  const magazine = createMagazineMesh(true, 0.3);
  magazine.position.set(0, -1.0, 0.12);
  group.add(magazine);

  // Reference point at barrel muzzle tip for flashes & tracers
  const muzzlePoint = new THREE.Object3D();
  muzzlePoint.position.set(0, 1.12, 3.6);
  group.add(muzzlePoint);

  return { group, scope, magazine, muzzlePoint };
}

/** Modified rifle scope with magnetic mount clamp & cyan coated objective lens. */
export function createScopeMesh(voxelSize = 0.32): THREE.Mesh {
  const outer = [
    ".##......###.",
    "#############",
    ".##......###.",
    "....##.##....",
  ];
  const center = [
    ".##......###.",
    "c###########l",
    ".##......###.",
    "....mmmmm....",
  ];
  const geo = voxelModel({
    palette: {
      "#": 0x1e242c,
      m: 0x627082, // magnetic adapter base
      c: 0x4bc5e8, // rear ocular lens tint
      l: 0x7ae3ff, // front objective lens tint
    },
    layers: [outer, center, outer],
    axis: "x",
    voxel: voxelSize,
  });
  const mesh = new THREE.Mesh(geo, metalMat);
  mesh.castShadow = true;
  return mesh;
}

/** Pistol magazine (optionally showing a gleaming dark meteorite tip on top). */
export function createMagazineMesh(loaded = true, voxelSize = 0.3): THREE.Mesh {
  const topChar = loaded ? "m" : ".";
  const slice = [
    `..${topChar}${topChar}.`,
    ".###.",
    ".###.",
    ".###.",
    ".###.",
    "#####",
  ];
  const geo = voxelModel({
    palette: {
      "#": 0x2c333e,
      m: 0x8996a8, // iron meteorite bullet tip
    },
    layers: [slice, slice],
    axis: "x",
    voxel: voxelSize,
  });
  return new THREE.Mesh(geo, metalMat);
}

/** Iron-nickel meteorite chunk (apple-sized or walnut-sized) with metallic glints. */
export function createMeteoriteMesh(voxelSize = 0.032, seed = 11): THREE.Mesh {
  const geo = buildVoxelGeometry(
    {
      size: [6, 5, 6],
      at(x, y, z) {
        const dx = (x - 2.5) / 2.6;
        const dy = (y - 2.0) / 2.1;
        const dz = (z - 2.5) / 2.6;
        const hash = Math.sin(x * 12.7 + y * 31.3 + z * 47.9 + seed * 19.1);
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz) + hash * 0.22;
        if (r > 1.0) return null;
        // Subtle Widmanstätten metallic veins
        if ((x + y + z + seed) % 5 === 0) return 0x747e8c;
        if (hash > 0.35) return 0x4d5460;
        return 0x2e333c;
      },
    },
    { voxel: voxelSize },
  );
  const mesh = new THREE.Mesh(geo, metalMat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Machined voxel-octagonal iron meteorite rod / bullet slug. */
export function createMeteoriteSlugMesh(voxelSize = 0.008, lengthVoxels = 6): THREE.Mesh {
  const geo = buildVoxelGeometry(
    {
      size: [3, lengthVoxels, 3],
      at(x, y, z) {
        if ((x === 0 || x === 2) && (z === 0 || z === 2)) return null; // octagonal cross-section
        if (y === lengthVoxels - 1 && (x !== 1 || z !== 1)) return null; // tapered nose
        return y % 2 === 0 ? 0x677282 : 0x4b5360;
      },
    },
    { voxel: voxelSize },
  );
  return new THREE.Mesh(geo, metalMat);
}

/** Caseless 7.62mm cartridge (propellant block + copper OR meteorite tip). */
export function createCartridgeMesh(hasMeteoriteTip: boolean, voxelSize = 0.009): THREE.Mesh {
  const geo = buildVoxelGeometry(
    {
      size: [3, 9, 3],
      at(x, y, z) {
        if ((x === 0 || x === 2) && (z === 0 || z === 2)) return null;
        if (y < 5) {
          // Caseless tan-ochre solid propellant block
          return y === 0 ? 0x6e593e : 0xa38556;
        }
        if (y === 5) {
          // Silver hull-grade adhesive collar once meteorite is attached
          return hasMeteoriteTip ? 0xc0cad6 : 0xb87333;
        }
        if (y === 8 && (x !== 1 || z !== 1)) return null;
        return hasMeteoriteTip ? 0x5c6675 : 0xc47d3b;
      },
    },
    { voxel: voxelSize, anchor: "min" },
  );
  return new THREE.Mesh(geo, metalMat);
}

/** Ceramic teacup with warm amber tea inside (in figure-px units for hand anchor or world). */
export function createTeacupMesh(voxelSize = 0.35): THREE.Mesh {
  const rim = [
    ".###.",
    "#...#",
    "#...#",
    "#...#",
    ".###.",
  ];
  const tea = [
    ".###.",
    "#ttt#",
    "#ttt#",
    "#ttt#",
    ".###.",
  ];
  const base = [
    ".###.",
    ".###.",
    ".###.",
    ".###.",
    ".###.",
  ];
  const geo = voxelModel({
    palette: {
      "#": 0xd8dfd4, // celadon porcelain
      t: 0xa66324, // amber tea liquid
    },
    layers: [base, tea, tea, rim],
    axis: "y",
    voxel: voxelSize,
  });
  const mesh = new THREE.Mesh(geo, glossyMat);
  mesh.castShadow = true;
  return mesh;
}

/** Classic Yixing clay teapot. */
export function createTeapotMesh(voxelSize = 0.036): THREE.Mesh {
  const outer = [
    "....###....",
    "...#####...",
    "..#######..",
    ".#########.",
    ".#########.",
    "..#######..",
  ];
  const mid = [
    "....#k#....",
    "...#####...",
    "##.#####.##",
    "#..#####..#",
    "...#####.##",
    "..#######..",
  ];
  const geo = voxelModel({
    palette: {
      "#": 0x693826,
      k: 0x4f281a,
    },
    layers: [outer, mid, mid, outer],
    axis: "x",
    voxel: voxelSize,
  });
  const mesh = new THREE.Mesh(geo, standardMat);
  mesh.castShadow = true;
  return mesh;
}

/** Brass magnifying glass for the Collector. */
export function createMagnifierMesh(voxelSize = 0.35): THREE.Mesh {
  const slice = [
    ".....###..",
    "....#ggg#.",
    "....#ggg#.",
    "....#ggg#.",
    ".....###..",
    "....#.....",
    "...#......",
    "..h.......",
    ".h........",
  ];
  const geo = voxelModel({
    palette: {
      "#": 0xc99c42,
      g: 0xb6e3f2,
      h: 0x4d311f,
    },
    layers: [slice],
    axis: "x",
    voxel: voxelSize,
  });
  return new THREE.Mesh(geo, metalMat);
}

/** Compact handheld phone (for Zhang Beihai paying 180,000 yuan immediately). */
export function createPhoneMesh(voxelSize = 0.34): THREE.Mesh {
  const back = [
    "###",
    "###",
    "###",
    "###",
    "###",
  ];
  const front = [
    "###",
    "#s#",
    "#s#",
    "#s#",
    "###",
  ];
  const geo = voxelModel({
    palette: {
      "#": 0x1a1e26,
      s: 0x58d4ff,
    },
    layers: [back, front],
    axis: "z",
    voxel: voxelSize,
  });
  return new THREE.Mesh(geo, metalMat);
}

/** Steel needle-nose pliers for removing caseless bullet tips. */
export function createPliersMesh(voxelSize = 0.32): THREE.Mesh {
  const slice = [
    "......####",
    ".....###..",
    "....##....",
    "..###.....",
    "rrr.......",
    "....##....",
    ".....###..",
    "......####",
  ];
  const geo = voxelModel({
    palette: {
      "#": 0x9aa4b2,
      r: 0x8f2924,
    },
    layers: [slice, slice],
    axis: "x",
    voxel: voxelSize,
  });
  return new THREE.Mesh(geo, metalMat);
}

/** Utility knife for cutting open the spacesuit-cloth beef bundle. */
export function createKnifeMesh(voxelSize = 0.3): THREE.Mesh {
  const bladeGeo = voxelModel({
    palette: {
      h: 0x2b3038,
      s: 0xc2ccd9,
    },
    layers: [
      [
        ".....ssssss",
        "hhhhssssss.",
        "hhhh.......",
      ],
    ],
    axis: "x",
    voxel: voxelSize,
  });
  return new THREE.Mesh(bladeGeo, metalMat);
}

/** Orbital EVA Life-Support & Cold-Gas Thruster Backpack (mounts on figure.anchors.back). */
export function createEvaBackpackMesh(accentHex = 0x2d5894): THREE.Mesh {
  // axis: "z" (depth slices from back of torso outward toward -Z)
  const inner = [
    ".######.",
    "########",
    "########",
    "########",
    "########",
    "########",
    "########",
    "########",
    ".##..##.",
  ];
  const mid = [
    ".#aaaa#.",
    "########",
    "##dddd##",
    "##dddd##",
    "########",
    "##g##r##",
    "########",
    "#n####n#",
    ".n....n.",
  ];
  const outer = [
    "..aaaa..",
    ".######.",
    ".#dddd#.",
    ".#dddd#.",
    ".######.",
    ".######.",
    ".#n##n#.",
    "..n..n..",
    "........",
  ];
  const geo = voxelModel({
    palette: {
      "#": 0xd7dfe8,
      a: accentHex,
      d: 0x627082,
      n: 0x353f4d, // cold-gas thruster nozzles
      g: 0x45e69a,
      r: 0xe3554c,
    },
    layers: [outer, mid, mid, inner],
    axis: "z",
    voxel: 0.92,
  });
  const mesh = new THREE.Mesh(geo, standardMat);
  mesh.position.set(0, 0.2, -1.9);
  mesh.castShadow = true;
  return mesh;
}

/** Orbital EVA Camera held by the group-photo photographer. */
export function createSpaceCameraMesh(voxelSize = 0.45): THREE.Mesh {
  const outer = [
    "..####..",
    "########",
    "########",
    "########",
    "########",
  ];
  const front = [
    "..####..",
    "##llll##",
    "##lggl##",
    "##llll##",
    "########",
  ];
  const geo = voxelModel({
    palette: {
      "#": 0xdfe5ec,
      l: 0x202733,
      g: 0x56b9e6,
    },
    layers: [outer, outer, outer, front],
    axis: "z",
    voxel: voxelSize,
  });
  const mesh = new THREE.Mesh(geo, metalMat);
  mesh.position.set(0, 0.2, 1.5);
  return mesh;
}

/** Military steel carrying case for the remaining 32 meteorite bullets. */
export function createAmmoCaseMesh(voxelSize = 0.032): THREE.Mesh {
  const geo = buildVoxelGeometry(
    {
      size: [10, 4, 7],
      at(x, y, z) {
        if (y === 3 && (x === 0 || x === 9 || z === 0 || z === 6)) return 0x38433c;
        if (y === 2 && (x === 2 || x === 7) && z === 6) return 0xb8c2cc; // silver latches
        return (x + z) % 2 === 0 ? 0x2d3832 : 0x26302b;
      },
    },
    { voxel: voxelSize, anchor: "min" },
  );
  const mesh = new THREE.Mesh(geo, metalMat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

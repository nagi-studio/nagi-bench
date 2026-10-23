import * as THREE from 'three';
import type { Team, WeaponId } from './types';

export interface CharacterModel {
  group: THREE.Group;
  setWeapon(id: WeaponId): void;
  update(dt: number, state: { moving: boolean; speed: number; pitch: number; dead: boolean; firing: boolean }): void;
}

type Vector3Tuple = [number, number, number];

interface TeamPalette {
  cloth: THREE.MeshStandardMaterial;
  clothDark: THREE.MeshStandardMaterial;
  armor: THREE.MeshStandardMaterial;
  vest: THREE.MeshStandardMaterial;
  helmet: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  skin: THREE.MeshStandardMaterial;
  glove: THREE.MeshStandardMaterial;
  boot: THREE.MeshStandardMaterial;
}

interface ArmRig {
  root: THREE.Group;
  elbow: THREE.Group;
  primary: boolean;
  baseX: number;
  baseElbow: number;
  baseZ: number;
}

interface LegRig {
  hip: THREE.Group;
  knee: THREE.Group;
  boot: THREE.Group;
  offset: number;
}

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const UNIT_CYLINDER = new THREE.CylinderGeometry(1, 1, 1, 8, 1, false);
const MATERIALS = new Map<string, THREE.MeshStandardMaterial>();

function getMaterial(color: number, roughness = 0.78, metalness = 0, emissive = 0): THREE.MeshStandardMaterial {
  const key = `${color}:${roughness}:${metalness}:${emissive}`;
  const cached = MATERIALS.get(key);
  if (cached) return cached;
  const material = new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive });
  MATERIALS.set(key, material);
  return material;
}

function addMesh(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function box(
  parent: THREE.Object3D,
  material: THREE.Material,
  size: Vector3Tuple,
  position: Vector3Tuple,
  rotation?: Vector3Tuple,
): THREE.Mesh {
  const mesh = addMesh(parent, UNIT_BOX, material);
  mesh.scale.set(...size);
  mesh.position.set(...position);
  if (rotation) mesh.rotation.set(...rotation);
  return mesh;
}

function cylinderZ(
  parent: THREE.Object3D,
  material: THREE.Material,
  radius: number,
  length: number,
  position: Vector3Tuple,
): THREE.Mesh {
  const mesh = addMesh(parent, UNIT_CYLINDER, material);
  mesh.scale.set(radius, length, radius);
  mesh.position.set(...position);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

function createBladeGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.026);
  shape.lineTo(-0.22, -0.018);
  shape.lineTo(-0.31, 0.018);
  shape.lineTo(-0.225, 0.04);
  shape.lineTo(0, 0.035);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.012, steps: 1, bevelEnabled: false });
  geometry.translate(0, 0, -0.006);
  geometry.rotateY(-Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}

const BLADE_GEOMETRY = createBladeGeometry();

function getPalette(team: Team): TeamPalette {
  const ct = team === 'CT';
  return {
    cloth: getMaterial(ct ? 0x405c70 : 0xa18a63, 0.92),
    clothDark: getMaterial(ct ? 0x2c4253 : 0x796647, 0.94),
    armor: getMaterial(ct ? 0x304c61 : 0x756146, 0.82),
    vest: getMaterial(ct ? 0x1d303f : 0x554633, 0.9),
    helmet: getMaterial(ct ? 0x294458 : 0x89734f, 0.86),
    accent: getMaterial(ct ? 0x78a4c0 : 0xc0a472, 0.78),
    skin: getMaterial(ct ? 0xbd9172 : 0xad8060, 0.9),
    glove: getMaterial(0x24282a, 0.94),
    boot: getMaterial(0x202426, 0.9),
  };
}

function buildHead(parent: THREE.Object3D, team: Team): THREE.Group {
  const palette = getPalette(team);
  const head = new THREE.Group();
  head.position.set(0, 0.45, 0);
  parent.add(head);

  box(head, palette.skin, [0.1, 0.09, 0.1], [0, -0.035, 0]);
  box(head, palette.skin, [0.21, 0.24, 0.2], [0, 0.11, 0]);
  box(head, palette.skin, [0.18, 0.06, 0.18], [0, 0.005, -0.005]);
  box(head, palette.skin, [0.025, 0.07, 0.055], [-0.116, 0.105, 0]);
  box(head, palette.skin, [0.025, 0.07, 0.055], [0.116, 0.105, 0]);

  const eyeWhite = getMaterial(0xd6d4c9, 0.72);
  const eyeDark = getMaterial(0x172127, 0.55);
  box(head, eyeWhite, [0.046, 0.022, 0.009], [-0.047, 0.15, -0.105]);
  box(head, eyeWhite, [0.046, 0.022, 0.009], [0.047, 0.15, -0.105]);
  box(head, eyeDark, [0.014, 0.018, 0.006], [-0.047, 0.15, -0.112]);
  box(head, eyeDark, [0.014, 0.018, 0.006], [0.047, 0.15, -0.112]);
  box(head, palette.clothDark, [0.052, 0.009, 0.009], [-0.047, 0.181, -0.107]);
  box(head, palette.clothDark, [0.052, 0.009, 0.009], [0.047, 0.181, -0.107]);
  box(head, palette.skin, [0.035, 0.045, 0.035], [0, 0.102, -0.116]);
  box(head, getMaterial(0x54342d, 0.9), [0.07, 0.012, 0.008], [0, 0.038, -0.104]);

  if (team === 'CT') {
    box(head, palette.helmet, [0.25, 0.1, 0.24], [0, 0.225, 0.01]);
    box(head, palette.helmet, [0.21, 0.045, 0.2], [0, 0.285, 0.015]);
    box(head, palette.armor, [0.27, 0.025, 0.26], [0, 0.185, 0.005]);
    box(head, palette.armor, [0.28, 0.022, 0.065], [0, 0.18, -0.12]);
    box(head, palette.helmet, [0.035, 0.12, 0.15], [-0.125, 0.115, 0.015]);
    box(head, palette.helmet, [0.035, 0.12, 0.15], [0.125, 0.115, 0.015]);
    const lens = getMaterial(0x142b39, 0.25, 0.35);
    box(head, lens, [0.078, 0.035, 0.012], [-0.049, 0.151, -0.121]);
    box(head, lens, [0.078, 0.035, 0.012], [0.049, 0.151, -0.121]);
    box(head, palette.armor, [0.025, 0.009, 0.014], [0, 0.151, -0.122]);
    box(head, palette.accent, [0.012, 0.055, 0.1], [0.144, 0.13, 0.01]);
  } else {
    box(head, palette.helmet, [0.23, 0.075, 0.215], [0, 0.22, 0.01]);
    box(head, palette.clothDark, [0.245, 0.035, 0.225], [0, 0.175, 0.008]);
    box(head, palette.cloth, [0.09, 0.16, 0.035], [-0.065, 0.105, 0.115], [0, 0, -0.12]);
    box(head, palette.clothDark, [0.135, 0.025, 0.012], [0, 0.02, -0.104]);
    box(head, palette.accent, [0.025, 0.09, 0.02], [0.105, 0.17, -0.095]);
  }

  return head;
}

function buildArm(parent: THREE.Object3D, team: Team, side: number, primary: boolean): ArmRig {
  const palette = getPalette(team);
  const root = new THREE.Group();
  root.position.set(side * 0.255, 0.34, 0);
  parent.add(root);

  box(root, palette.cloth, [0.14, 0.26, 0.15], [0, -0.13, 0]);
  box(root, palette.armor, [0.16, 0.1, 0.17], [0, -0.035, 0]);
  box(root, palette.accent, [0.145, 0.035, 0.155], [0, -0.19, 0]);

  const elbow = new THREE.Group();
  elbow.position.y = -0.26;
  root.add(elbow);
  box(elbow, palette.clothDark, [0.115, 0.22, 0.125], [0, -0.11, 0]);
  box(elbow, palette.armor, [0.12, 0.09, 0.04], [0, -0.015, -0.065]);

  const hand = new THREE.Group();
  hand.position.y = -0.24;
  elbow.add(hand);
  box(hand, palette.glove, [0.105, 0.1, 0.11], [0, 0, 0]);
  box(hand, palette.glove, [0.09, 0.055, 0.045], [0, -0.005, -0.065]);

  const baseX = primary ? 0.3 : 1;
  const baseElbow = primary ? 1.7 : 0.45;
  const baseZ = -side * (primary ? 0.5 : 0.72);
  root.rotation.set(baseX, 0, baseZ);
  elbow.rotation.x = baseElbow;
  return { root, elbow, primary, baseX, baseElbow, baseZ };
}

function buildLeg(parent: THREE.Object3D, team: Team, side: number): LegRig {
  const palette = getPalette(team);
  const hip = new THREE.Group();
  hip.position.set(side * 0.115, 0.94, 0);
  parent.add(hip);
  box(hip, palette.cloth, [0.16, 0.4, 0.18], [0, -0.2, 0]);
  box(hip, palette.clothDark, [0.165, 0.055, 0.185], [0, -0.345, 0]);

  const knee = new THREE.Group();
  knee.position.y = -0.4;
  hip.add(knee);
  box(knee, palette.clothDark, [0.135, 0.4, 0.15], [0, -0.2, 0]);
  box(knee, palette.armor, [0.145, 0.13, 0.04], [0, -0.025, -0.078]);

  const boot = new THREE.Group();
  boot.position.y = -0.4;
  knee.add(boot);
  box(boot, palette.boot, [0.17, 0.16, 0.28], [0, -0.06, -0.05]);
  box(boot, getMaterial(0x121617, 0.96), [0.175, 0.035, 0.29], [0, -0.1175, -0.05]);
  box(boot, palette.clothDark, [0.14, 0.09, 0.14], [0, 0.025, 0]);

  return { hip, knee, boot, offset: side > 0 ? 0 : Math.PI };
}

function buildAk(viewModel: boolean): THREE.Group {
  const group = new THREE.Group();
  const metal = getMaterial(0x272b2c, 0.48, 0.65);
  const metalDark = getMaterial(0x151a1b, 0.55, 0.55);
  const wood = getMaterial(0x824b28, 0.7, 0.05);
  const woodLight = getMaterial(0xa06435, 0.72, 0.03);
  const bakelite = getMaterial(0x693b25, 0.68, 0.08);

  box(group, metal, [0.075, 0.09, 0.28], [0, 0, -0.12]);
  box(group, metalDark, [0.07, 0.025, 0.27], [0, 0.055, -0.12]);
  box(group, wood, [0.075, 0.1, 0.25], [0, -0.005, 0.19]);
  box(group, woodLight, [0.085, 0.13, 0.035], [0, -0.005, 0.332]);
  box(group, wood, [0.085, 0.085, 0.2], [0, 0, -0.345]);
  box(group, woodLight, [0.088, 0.018, 0.17], [0, 0.045, -0.345]);
  cylinderZ(group, metal, 0.012, 0.34, [0, 0.012, -0.61]);
  cylinderZ(group, metalDark, 0.009, 0.28, [0, 0.065, -0.43]);
  cylinderZ(group, metal, 0.018, 0.07, [0, 0.012, -0.815]);
  box(group, metalDark, [0.018, 0.075, 0.022], [0, 0.065, -0.745]);
  box(group, metalDark, [0.055, 0.015, 0.025], [0, 0.102, -0.745]);
  box(group, metalDark, [0.055, 0.04, 0.025], [0, 0.08, 0.005]);
  box(group, wood, [0.055, 0.14, 0.065], [0, -0.095, 0.02], [-0.22, 0, 0]);
  box(group, bakelite, [0.057, 0.11, 0.075], [0, -0.09, -0.1], [0.18, 0, 0]);
  box(group, bakelite, [0.055, 0.1, 0.072], [0, -0.17, -0.125], [0.38, 0, 0]);
  box(group, bakelite, [0.052, 0.075, 0.068], [0, -0.235, -0.16], [0.58, 0, 0]);
  box(group, metalDark, [0.04, 0.012, 0.09], [0, -0.065, -0.025]);
  box(group, metalDark, [0.012, 0.05, 0.012], [0, -0.045, -0.065]);

  if (viewModel) {
    for (let i = 0; i < 3; i += 1) {
      box(group, getMaterial(0x697174, 0.35, 0.8), [0.007, 0.012, 0.012], [0.041, 0.02, -0.045 - i * 0.07]);
    }
    box(group, metal, [0.008, 0.012, 0.15], [0.043, 0.035, -0.11], [0.1, 0, 0]);
    box(group, woodLight, [0.06, 0.012, 0.012], [0, -0.277, -0.185]);
  }
  return group;
}

function buildM4(viewModel: boolean): THREE.Group {
  const group = new THREE.Group();
  const black = getMaterial(0x171d22, 0.48, 0.62);
  const blue = getMaterial(0x293e4e, 0.52, 0.55);
  const metal = getMaterial(0x394650, 0.4, 0.75);
  const polymer = getMaterial(0x20292f, 0.76, 0.15);

  box(group, black, [0.075, 0.09, 0.27], [0, 0, -0.105]);
  box(group, blue, [0.078, 0.025, 0.25], [0, 0.055, -0.115]);
  box(group, blue, [0.082, 0.08, 0.24], [0, 0, -0.34]);
  box(group, black, [0.09, 0.012, 0.25], [0, 0.05, -0.34]);
  box(group, black, [0.012, 0.09, 0.25], [-0.046, 0, -0.34]);
  box(group, black, [0.012, 0.09, 0.25], [0.046, 0, -0.34]);
  cylinderZ(group, metal, 0.011, 0.27, [0, 0.005, -0.59]);
  cylinderZ(group, black, 0.017, 0.065, [0, 0.005, -0.755]);
  cylinderZ(group, black, 0.022, 0.24, [0, 0.015, 0.155]);
  box(group, polymer, [0.08, 0.09, 0.18], [0, -0.005, 0.235]);
  box(group, polymer, [0.09, 0.125, 0.035], [0, -0.005, 0.345]);
  box(group, black, [0.045, 0.055, 0.035], [0, 0.09, -0.015]);
  box(group, metal, [0.018, 0.02, 0.04], [0, 0.092, -0.03]);
  box(group, black, [0.014, 0.065, 0.022], [0, 0.065, -0.47]);
  box(group, black, [0.05, 0.012, 0.022], [0, 0.098, -0.47]);
  box(group, polymer, [0.055, 0.135, 0.065], [0, -0.095, 0.025], [-0.2, 0, 0]);
  box(group, blue, [0.06, 0.18, 0.085], [0, -0.135, -0.105], [0.12, 0, 0]);
  box(group, black, [0.064, 0.018, 0.09], [0, -0.23, -0.116], [0.12, 0, 0]);
  box(group, black, [0.04, 0.012, 0.085], [0, -0.06, -0.02]);

  if (viewModel) {
    for (let i = 0; i < 7; i += 1) {
      box(group, metal, [0.088, 0.009, 0.012], [0, 0.06, -0.24 - i * 0.032]);
    }
    for (let i = 0; i < 4; i += 1) {
      box(group, metal, [0.006, 0.035, 0.009], [0.04, 0.005, -0.01 - i * 0.014]);
    }
    box(group, getMaterial(0x6e8797, 0.35, 0.7), [0.007, 0.014, 0.055], [0.041, 0.01, -0.13]);
  }
  return group;
}

function buildAwp(viewModel: boolean): THREE.Group {
  const group = new THREE.Group();
  const green = getMaterial(0x3c6248, 0.7, 0.18);
  const greenDark = getMaterial(0x253e30, 0.76, 0.15);
  const metal = getMaterial(0x252d2d, 0.4, 0.72);
  const scope = getMaterial(0x151d1d, 0.35, 0.65);
  const glass = getMaterial(0x37666b, 0.18, 0.45, 0x102c30);

  box(group, green, [0.09, 0.105, 0.4], [0, 0, -0.12]);
  box(group, greenDark, [0.085, 0.08, 0.3], [0, -0.005, -0.39]);
  box(group, green, [0.095, 0.125, 0.25], [0, -0.01, 0.22]);
  box(group, greenDark, [0.105, 0.16, 0.04], [0, -0.01, 0.365]);
  box(group, green, [0.06, 0.135, 0.07], [0, -0.095, 0.065], [-0.18, 0, 0]);
  box(group, greenDark, [0.065, 0.105, 0.09], [0, -0.1, -0.12], [0.08, 0, 0]);
  cylinderZ(group, metal, 0.013, 0.55, [0, 0.015, -0.735]);
  cylinderZ(group, metal, 0.02, 0.08, [0, 0.015, -1.05]);
  box(group, metal, [0.065, 0.04, 0.16], [0, 0.065, -0.12]);
  box(group, scope, [0.018, 0.055, 0.035], [0, 0.095, -0.035]);
  box(group, scope, [0.018, 0.055, 0.035], [0, 0.095, -0.235]);
  cylinderZ(group, scope, 0.035, 0.3, [0, 0.14, -0.135]);
  cylinderZ(group, scope, 0.043, 0.055, [0, 0.14, -0.305]);
  cylinderZ(group, scope, 0.04, 0.045, [0, 0.14, 0.037]);
  cylinderZ(group, glass, 0.034, 0.006, [0, 0.14, -0.335]);
  cylinderZ(group, glass, 0.03, 0.006, [0, 0.14, 0.062]);
  box(group, metal, [0.09, 0.015, 0.015], [0.065, 0.045, -0.015], [0, 0, -0.35]);
  box(group, metal, [0.025, 0.025, 0.025], [0.105, 0.028, -0.015]);

  if (viewModel) {
    box(group, scope, [0.035, 0.035, 0.045], [0, 0.185, -0.135]);
    box(group, scope, [0.04, 0.045, 0.035], [0.047, 0.14, -0.135]);
    for (let i = 0; i < 5; i += 1) {
      box(group, greenDark, [0.098, 0.009, 0.012], [0, -0.048, -0.28 - i * 0.045]);
    }
    box(group, getMaterial(0x8b9692, 0.3, 0.85), [0.008, 0.02, 0.08], [0.049, 0.01, -0.09]);
  }
  return group;
}

function buildGlock(viewModel: boolean): THREE.Group {
  const group = new THREE.Group();
  const slide = getMaterial(0x252b2e, 0.42, 0.68);
  const frame = getMaterial(0x1c2224, 0.82, 0.12);
  const metal = getMaterial(0x414a4d, 0.35, 0.8);

  box(group, slide, [0.066, 0.065, 0.22], [0, 0, -0.1]);
  box(group, frame, [0.062, 0.055, 0.18], [0, -0.055, -0.075]);
  box(group, frame, [0.06, 0.145, 0.075], [0, -0.13, 0.015], [-0.18, 0, 0]);
  box(group, frame, [0.05, 0.012, 0.09], [0, -0.09, -0.065]);
  box(group, frame, [0.012, 0.05, 0.012], [0, -0.068, -0.105]);
  box(group, slide, [0.016, 0.025, 0.018], [0, 0.043, -0.2]);
  box(group, slide, [0.05, 0.018, 0.018], [0, 0.041, 0.002]);
  cylinderZ(group, metal, 0.011, 0.006, [0, 0, -0.213]);
  box(group, frame, [0.075, 0.018, 0.025], [0, -0.205, 0.035]);

  if (viewModel) {
    for (let i = 0; i < 5; i += 1) {
      box(group, metal, [0.006, 0.04, 0.007], [0.035, 0, -0.005 - i * 0.012]);
    }
    box(group, getMaterial(0x939b9c, 0.35, 0.7), [0.008, 0.008, 0.045], [0.034, 0.018, -0.12]);
  }
  return group;
}

function buildUsp(viewModel: boolean): THREE.Group {
  const group = new THREE.Group();
  const slide = getMaterial(0x30383d, 0.4, 0.7);
  const frame = getMaterial(0x20272a, 0.8, 0.12);
  const suppressor = getMaterial(0x171d20, 0.5, 0.58);
  const metal = getMaterial(0x586267, 0.32, 0.82);

  box(group, slide, [0.068, 0.06, 0.21], [0, 0, -0.095]);
  box(group, frame, [0.066, 0.06, 0.18], [0, -0.055, -0.07]);
  box(group, frame, [0.066, 0.15, 0.08], [0, -0.135, 0.02], [-0.24, 0, 0]);
  box(group, frame, [0.07, 0.025, 0.04], [0, -0.035, 0.04]);
  box(group, frame, [0.012, 0.025, 0.055], [0.041, -0.03, -0.005]);
  box(group, frame, [0.052, 0.012, 0.09], [0, -0.095, -0.065]);
  box(group, frame, [0.012, 0.052, 0.012], [0, -0.07, -0.105]);
  cylinderZ(group, suppressor, 0.023, 0.2, [0, 0, -0.3]);
  cylinderZ(group, metal, 0.017, 0.008, [0, 0, -0.404]);
  box(group, slide, [0.014, 0.028, 0.018], [0, 0.043, -0.19]);
  box(group, slide, [0.052, 0.018, 0.02], [0, 0.04, 0.002]);

  if (viewModel) {
    for (let i = 0; i < 4; i += 1) {
      box(group, metal, [0.006, 0.036, 0.008], [0.036, 0, -0.005 - i * 0.014]);
    }
    cylinderZ(group, suppressor, 0.025, 0.012, [0, 0, -0.215]);
    box(group, metal, [0.007, 0.012, 0.04], [0.037, 0.012, -0.12]);
  }
  return group;
}

function buildDeagle(viewModel: boolean): THREE.Group {
  const group = new THREE.Group();
  const chrome = getMaterial(0x9ba3a4, 0.28, 0.82);
  const chromeDark = getMaterial(0x626c6f, 0.32, 0.8);
  const black = getMaterial(0x202628, 0.78, 0.18);

  box(group, chrome, [0.08, 0.08, 0.3], [0, 0, -0.11]);
  box(group, chromeDark, [0.066, 0.055, 0.1], [0, -0.005, -0.305]);
  box(group, chromeDark, [0.035, 0.014, 0.31], [0, 0.047, -0.12]);
  box(group, chrome, [0.075, 0.06, 0.22], [0, -0.065, -0.075]);
  box(group, black, [0.07, 0.17, 0.085], [0, -0.15, 0.035], [-0.18, 0, 0]);
  box(group, chromeDark, [0.058, 0.014, 0.105], [0, -0.105, -0.075]);
  box(group, chromeDark, [0.014, 0.06, 0.014], [0, -0.075, -0.125]);
  box(group, chromeDark, [0.02, 0.032, 0.025], [0, 0.052, -0.32]);
  box(group, chromeDark, [0.06, 0.022, 0.022], [0, 0.052, 0.025]);
  cylinderZ(group, black, 0.014, 0.006, [0, -0.005, -0.358]);
  box(group, black, [0.076, 0.02, 0.026], [0, -0.24, 0.055]);

  if (viewModel) {
    for (let i = 0; i < 5; i += 1) {
      box(group, chromeDark, [0.007, 0.05, 0.008], [0.042, 0, 0.015 - i * 0.014]);
    }
    box(group, chromeDark, [0.008, 0.018, 0.12], [0.043, -0.02, -0.19]);
    box(group, getMaterial(0xc1c7c6, 0.22, 0.9), [0.05, 0.008, 0.16], [0, 0.044, -0.15]);
  }
  return group;
}

function buildKnife(viewModel: boolean): THREE.Group {
  const group = new THREE.Group();
  const steel = getMaterial(0xa9b4b6, 0.26, 0.86);
  const edge = getMaterial(0xd5dddd, 0.2, 0.9);
  const handle = getMaterial(0x252c2b, 0.88, 0.08);
  const guard = getMaterial(0x414b4b, 0.42, 0.7);

  const blade = addMesh(group, BLADE_GEOMETRY, steel);
  blade.position.z = -0.035;
  box(group, edge, [0.014, 0.008, 0.22], [0, -0.022, -0.145], [0.04, 0, 0]);
  box(group, guard, [0.12, 0.025, 0.035], [0, 0, -0.022]);
  box(group, handle, [0.05, 0.055, 0.17], [0, 0, 0.075]);
  box(group, guard, [0.056, 0.06, 0.03], [0, 0, 0.175]);

  if (viewModel) {
    for (let i = 0; i < 4; i += 1) {
      box(group, guard, [0.054, 0.059, 0.009], [0, 0, 0.02 + i * 0.037]);
    }
    box(group, edge, [0.014, 0.01, 0.09], [0, 0.036, -0.075]);
  }
  return group;
}

const WEAPON_BUILDERS: Record<WeaponId, (viewModel: boolean) => THREE.Group> = {
  ak47: buildAk,
  m4a4: buildM4,
  awp: buildAwp,
  glock: buildGlock,
  usp: buildUsp,
  deagle: buildDeagle,
  knife: buildKnife,
};

export function createWeaponModel(id: WeaponId, viewModel = false): THREE.Group {
  const group = WEAPON_BUILDERS[id](viewModel);
  group.name = `${id}${viewModel ? '-view-model' : '-world-model'}`;
  group.userData.weaponId = id;
  if (viewModel) {
    group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = false;
        object.receiveShadow = false;
      }
    });
  }
  return group;
}

export function createCharacter(team: Team): CharacterModel {
  const palette = getPalette(team);
  const group = new THREE.Group();
  group.name = `${team}-character`;
  group.userData.team = team;
  group.userData.eyeHeight = 1.62;

  const deathRig = new THREE.Group();
  group.add(deathRig);

  box(deathRig, palette.clothDark, [0.37, 0.18, 0.24], [0, 0.99, 0]);
  box(deathRig, palette.vest, [0.42, 0.065, 0.27], [0, 1.035, 0]);
  box(deathRig, palette.armor, [0.09, 0.11, 0.055], [-0.12, 0.965, -0.14]);
  box(deathRig, palette.armor, [0.09, 0.11, 0.055], [0.12, 0.965, -0.14]);

  const leftLeg = buildLeg(deathRig, team, -1);
  const rightLeg = buildLeg(deathRig, team, 1);
  const legs = [leftLeg, rightLeg];

  const upper = new THREE.Group();
  upper.position.y = 1.02;
  deathRig.add(upper);
  box(upper, palette.cloth, [0.4, 0.42, 0.22], [0, 0.21, 0]);
  box(upper, palette.vest, [0.36, 0.33, 0.045], [0, 0.215, -0.13]);
  box(upper, palette.vest, [0.35, 0.34, 0.045], [0, 0.21, 0.13]);
  box(upper, palette.armor, [0.3, 0.3, 0.12], [0, 0.2, 0.18]);
  box(upper, palette.armor, [0.1, 0.105, 0.055], [-0.095, 0.14, -0.165]);
  box(upper, palette.armor, [0.1, 0.105, 0.055], [0.095, 0.14, -0.165]);
  box(upper, palette.armor, [0.09, 0.075, 0.05], [0, 0.3, -0.16]);
  box(upper, palette.accent, [0.065, 0.04, 0.012], [0.105, 0.345, -0.157]);
  box(upper, palette.vest, [0.055, 0.3, 0.04], [-0.15, 0.23, -0.145], [0, 0, -0.12]);
  box(upper, palette.vest, [0.055, 0.3, 0.04], [0.15, 0.23, -0.145], [0, 0, 0.12]);

  const head = buildHead(upper, team);
  const primaryArm = buildArm(upper, team, 1, true);
  const supportArm = buildArm(upper, team, -1, false);
  const arms = [primaryArm, supportArm];

  const weaponMount = new THREE.Group();
  weaponMount.position.set(0.04, 0.3, -0.27);
  upper.add(weaponMount);

  let activeWeapon: WeaponId | undefined;
  let walkPhase = 0;
  let moveBlend = 0;
  let deathProgress = 0;
  let recoil = 0;
  let mountY = 0.3;
  let mountZ = -0.27;

  function setWeapon(id: WeaponId): void {
    if (activeWeapon === id) return;
    activeWeapon = id;
    weaponMount.clear();
    weaponMount.add(createWeaponModel(id));
    recoil = 0;

    primaryArm.baseX = 0.3;
    primaryArm.baseElbow = 1.7;
    primaryArm.baseZ = -0.5;
    if (id === 'knife') {
      supportArm.baseX = 0.08;
      supportArm.baseElbow = 0.15;
      supportArm.baseZ = 0.08;
      mountY = 0.27;
      mountZ = -0.24;
    } else if (id === 'glock' || id === 'usp' || id === 'deagle') {
      supportArm.baseX = 0.35;
      supportArm.baseElbow = 1.5;
      supportArm.baseZ = 0.9;
      mountY = 0.3;
      mountZ = -0.27;
    } else {
      supportArm.baseX = 1;
      supportArm.baseElbow = 0.45;
      supportArm.baseZ = 0.72;
      mountY = 0.3;
      mountZ = -0.27;
    }
  }

  setWeapon(team === 'CT' ? 'm4a4' : 'ak47');

  function update(
    dt: number,
    state: { moving: boolean; speed: number; pitch: number; dead: boolean; firing: boolean },
  ): void {
    const step = Math.min(0.1, Math.max(0, dt));
    deathProgress = THREE.MathUtils.clamp(deathProgress + step * (state.dead ? 2.7 : -3.8), 0, 1);
    const fall = deathProgress * deathProgress * (3 - 2 * deathProgress);
    const speed = Math.max(0, state.speed);
    const moveTarget = state.moving && !state.dead ? THREE.MathUtils.clamp(speed / 4.5, 0.2, 1) : 0;
    moveBlend += (moveTarget - moveBlend) * (1 - Math.exp(-step * 10));
    if (moveBlend > 0.001) walkPhase += step * (4.8 + Math.min(speed, 7) * 1.2);
    const recoilTarget = state.firing && !state.dead ? 1 : 0;
    recoil += (recoilTarget - recoil) * (1 - Math.exp(-step * (recoilTarget > 0 ? 32 : 14)));

    const stride = Math.sin(walkPhase);
    const bob = Math.abs(Math.cos(walkPhase)) * 0.012 * moveBlend;
    const pitch = THREE.MathUtils.clamp(state.pitch, -1.2, 1.2) * (1 - fall);

    deathRig.rotation.x = fall * Math.PI * 0.5;
    deathRig.position.y = fall * 0.24;
    upper.position.y = 1.02 + bob * (1 - fall);
    upper.rotation.x = pitch * 0.26 + recoil * 0.012;
    upper.rotation.z = stride * 0.01 * moveBlend * (1 - fall);
    head.rotation.x = pitch * 0.44 - fall * 0.08;
    head.rotation.z = -stride * 0.008 * moveBlend * (1 - fall);

    for (const leg of legs) {
      const phase = walkPhase + leg.offset;
      const swing = Math.sin(phase) * moveBlend * (1 - fall);
      const bend = Math.max(0, Math.sin(phase + 0.45)) * moveBlend * (1 - fall);
      leg.hip.rotation.x = swing * 0.52;
      leg.knee.rotation.x = -bend * 0.62;
      leg.boot.rotation.x = -leg.hip.rotation.x * 0.5 - leg.knee.rotation.x * 0.4;
    }

    for (const arm of arms) {
      const swing = Math.sin(walkPhase + (arm.primary ? 0 : Math.PI)) * moveBlend * (1 - fall);
      arm.root.rotation.x = arm.baseX + swing * 0.04;
      arm.root.rotation.z = arm.baseZ + stride * (arm.primary ? 0.012 : -0.012) * moveBlend * (1 - fall);
      arm.elbow.rotation.x = arm.baseElbow - swing * 0.025;
    }

    weaponMount.position.set(
      0.04 + stride * 0.004 * moveBlend * (1 - fall),
      mountY + bob + recoil * 0.008,
      mountZ + recoil * 0.026,
    );
    weaponMount.rotation.set(
      recoil * 0.09,
      stride * 0.008 * moveBlend * (1 - fall),
      -stride * 0.012 * moveBlend * (1 - fall),
    );
  }

  return { group, setWeapon, update };
}

export function createBombModel(): { group: THREE.Group; update(elapsed: number): void } {
  const group = new THREE.Group();
  group.name = 'bomb';
  const explosive = getMaterial(0x77734d, 0.94);
  const strap = getMaterial(0x272d29, 0.88);
  const timer = getMaterial(0x202725, 0.72, 0.18);
  const wireRed = getMaterial(0x8e3028, 0.72);
  const wireYellow = getMaterial(0xb99a45, 0.72);
  const ledMaterial = new THREE.MeshStandardMaterial({ color: 0xff3024, emissive: 0xff1208, roughness: 0.35 });
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x315d4b,
    emissive: 0x1b9b65,
    emissiveIntensity: 0.6,
    roughness: 0.42,
  });

  for (let i = 0; i < 3; i += 1) {
    box(group, explosive, [0.078, 0.08, 0.19], [(i - 1) * 0.083, 0.04, 0]);
  }
  box(group, strap, [0.27, 0.015, 0.018], [0, 0.087, -0.06]);
  box(group, strap, [0.27, 0.015, 0.018], [0, 0.087, 0.06]);
  box(group, strap, [0.018, 0.085, 0.2], [-0.045, 0.043, 0]);
  box(group, timer, [0.18, 0.05, 0.115], [0.025, 0.125, -0.005]);
  box(group, screenMaterial, [0.112, 0.008, 0.056], [0.012, 0.154, -0.018]);
  box(group, getMaterial(0x9ad6a7, 0.45, 0, 0x39774d), [0.012, 0.006, 0.034], [-0.025, 0.16, -0.018]);
  box(group, getMaterial(0x9ad6a7, 0.45, 0, 0x39774d), [0.012, 0.006, 0.034], [0.005, 0.16, -0.018]);
  box(group, getMaterial(0x9ad6a7, 0.45, 0, 0x39774d), [0.012, 0.006, 0.034], [0.035, 0.16, -0.018]);
  const led = box(group, ledMaterial, [0.018, 0.012, 0.018], [0.09, 0.156, 0.025]);
  box(group, timer, [0.012, 0.11, 0.012], [-0.075, 0.17, 0.035]);
  box(group, getMaterial(0x59615b, 0.5, 0.6), [0.02, 0.015, 0.02], [-0.075, 0.228, 0.035]);

  const redCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.05, 0.13, -0.04),
    new THREE.Vector3(-0.12, 0.16, -0.07),
    new THREE.Vector3(-0.135, 0.1, -0.01),
    new THREE.Vector3(-0.09, 0.085, 0.075),
  ]);
  addMesh(group, new THREE.TubeGeometry(redCurve, 12, 0.004, 5, false), wireRed);
  const yellowCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.075, 0.13, -0.045),
    new THREE.Vector3(0.135, 0.15, -0.075),
    new THREE.Vector3(0.14, 0.09, 0.005),
    new THREE.Vector3(0.085, 0.085, 0.07),
  ]);
  addMesh(group, new THREE.TubeGeometry(yellowCurve, 12, 0.004, 5, false), wireYellow);

  function update(elapsed: number): void {
    const pulse = Math.sin(elapsed * Math.PI * 4);
    led.visible = pulse > 0;
    ledMaterial.emissiveIntensity = pulse > 0 ? 3 : 0.15;
    screenMaterial.emissiveIntensity = 0.55 + Math.sin(elapsed * 2) * 0.12;
  }

  return { group, update };
}

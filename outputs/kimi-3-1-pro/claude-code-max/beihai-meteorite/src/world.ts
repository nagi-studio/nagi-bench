import * as THREE from "three";
import { voxelSphere, voxelTerrain } from "@agentbench/voxel-kit";
import {
  basic,
  bodySkin,
  box,
  makeBackpack,
  makeCameraProp,
  makeEarth,
  makeFigure,
  makeFlash,
  makeMeteorite,
  makePixelParticles,
  makePistol,
  makeScope,
  makeSpaceFigure,
  makeStars,
  makeThruster,
  makeVoxelPanel,
  material,
  palette,
  seeded,
  sign,
  spaceSuitSkin,
  voxelMesh,
} from "./art";
import type { Figure, Skin } from "@agentbench/voxel-kit";
import { METEOR_SHOT_TIMES } from "./cues";

export type EnvironmentName = "space" | "macro" | "home" | "workshop" | "basement" | "base";

export interface HomeWorld {
  group: THREE.Group;
  zhang: Figure;
  collector: Figure;
  saleRocks: THREE.Group;
  marsRock: THREE.Mesh;
  safeDoor: THREE.Group;
  cabinetLights: THREE.PointLight[];
  microscope: THREE.Group;
  dust: THREE.Points;
  tea: THREE.Group;
}

export interface WorkshopWorld {
  group: THREE.Group;
  zhang: Figure;
  spindle: THREE.Group;
  door: THREE.Mesh;
  cuttingRock: THREE.Mesh;
  tray: THREE.Group;
  rounds: THREE.Group[];
  sparks: THREE.Points;
  sparkSeed: number[];
  shavings: THREE.Group;
  tool: THREE.Group;
  statusLight: THREE.Mesh;
}

export interface BasementWorld {
  group: THREE.Group;
  zhang: Figure;
  rounds: THREE.Group[];
  tableGun: THREE.Group;
  handGun: THREE.Group;
  flash: THREE.Group;
  cloth: THREE.Mesh;
  beef: THREE.Mesh;
  holes: THREE.Mesh[];
  fragments: THREE.Group;
  lamp: THREE.PointLight;
}

export interface BaseWorld {
  group: THREE.Group;
  zhang: Figure;
  lockerDoor: THREE.Group;
  locator: THREE.Mesh;
  monitorDot: THREE.Mesh;
  cabinLight: THREE.PointLight;
}

export interface CrowdMember {
  figure: Figure;
  index: number;
  row: number;
  col: number;
  final: THREE.Vector3;
  target: boolean;
  accent: string;
  darkSkin: Skin;
  clearSkin: Skin;
  crackedSkin: Skin;
  firstHit: number;
  lastHit: number;
  burst: THREE.Group;
  burstDirections: THREE.Vector3[];
}

export interface SpaceWorld {
  group: THREE.Group;
  stars: THREE.Points;
  earth: THREE.Group;
  sun: THREE.Mesh;
  station: THREE.Group;
  meetingStation: THREE.Group;
  baseModel: THREE.Group;
  debris: THREE.Group;
  zhang: Figure;
  zhangDark: Skin;
  zhangClear: Skin;
  gun: THREE.Group;
  flash: THREE.Group;
  thruster: THREE.Group;
  photographer: Figure;
  crowd: CrowdMember[];
  crowdGroup: THREE.Group;
  hatchDoor: THREE.Mesh;
  hatchRed: THREE.Mesh;
  hatchGreen: THREE.Mesh;
  bullets: Array<{ mesh: THREE.Mesh; trail: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; shot: number; target: number }>;
  bulletGroup: THREE.Group;
  hitIndices: number[];
}

export interface MacroWorld { group: THREE.Group; rock: THREE.Mesh; ring: THREE.Group }

export interface World {
  root: THREE.Group;
  environments: Record<EnvironmentName, THREE.Group>;
  home: HomeWorld;
  workshop: WorkshopWorld;
  basement: BasementWorld;
  base: BaseWorld;
  space: SpaceWorld;
  macro: MacroWorld;
  activate: (name: EnvironmentName) => void;
}

function point(parent: THREE.Object3D, color: number, intensity: number, distance: number, position: [number, number, number], castShadow = false): THREE.PointLight {
  const light = new THREE.PointLight(color, intensity, distance, 2);
  light.position.set(...position);
  light.castShadow = castShadow;
  if (castShadow) { light.shadow.mapSize.set(512, 512); light.shadow.bias = -0.0005; }
  parent.add(light);
  return light;
}

function hemi(parent: THREE.Object3D, sky: number, ground: number, intensity: number): void {
  parent.add(new THREE.HemisphereLight(sky, ground, intensity));
}

function floor(parent: THREE.Object3D, width: number, depth: number, colors: [number, number], y = -0.5): THREE.Mesh {
  const geometry = voxelTerrain(width * 2, depth * 2, () => 1, (x, _y, z, top) => top ? ((x + z) % 2 ? colors[0] : colors[1]) : colors[1], { voxel: 0.5, anchor: "min" });
  const mesh = voxelMesh(geometry, { roughness: 0.94 });
  mesh.position.set(-width / 2, y, -depth / 2);
  parent.add(mesh);
  return mesh;
}

function brickWall(parent: THREE.Object3D, width: number, height: number, depth: number, position: [number, number, number], colorA: number, colorB: number, axis: "back" | "side" = "back"): THREE.Group {
  const group = new THREE.Group();
  group.position.set(...position);
  const cols = Math.ceil(width / 0.62);
  const rows = Math.ceil(height / 0.42);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const offset = row % 2 ? 0.3 : 0;
      const w = 0.58;
      const h = 0.37;
      const x = -width / 2 + col * 0.62 + offset;
      const y = row * 0.42 + h / 2;
      const mat = material((row + col) % 3 ? colorA : colorB, { roughness: 0.98 });
      if (axis === "back") box(group, [w, h, depth], [x, y, 0], mat);
      else box(group, [depth, h, w], [0, y, x], mat);
    }
  }
  parent.add(group);
  return group;
}

function buildCabinet(parent: THREE.Object3D, x: number, z: number, seed: number): { group: THREE.Group; light: THREE.PointLight } {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const wood = material(palette.wood, { roughness: 0.85 });
  const trim = material(palette.woodLight, { roughness: 0.7 });
  box(group, [2.8, 0.16, 0.42], [0, 0.35, 0], trim);
  box(group, [2.8, 0.16, 0.42], [0, 3.55, 0], trim);
  box(group, [0.14, 3.2, 0.42], [-1.33, 1.95, 0], wood);
  box(group, [0.14, 3.2, 0.42], [1.33, 1.95, 0], wood);
  box(group, [2.65, 3.15, 0.08], [0, 1.95, -0.2], material(0x171b1d, { roughness: 0.65 }));
  for (const y of [1.25, 2.2, 3.05]) box(group, [2.55, 0.08, 0.36], [0, y, 0], trim);
  const glass = new THREE.MeshStandardMaterial({ color: 0x9db7b2, transparent: true, opacity: 0.12, roughness: 0.12, metalness: 0.1, depthWrite: false });
  box(group, [2.58, 3.12, 0.025], [0, 1.95, 0.23], glass);
  for (let i = 0; i < 9; i++) {
    const rock = makeMeteorite(0.12 + (i % 3) * 0.035, seed + i, i % 4 !== 0);
    rock.position.set(-0.92 + (i % 3) * 0.85, 0.61 + Math.floor(i / 3) * 0.91, 0.02);
    group.add(rock);
  }
  const light = point(group, 0xffc47e, 1.2, 4.5, [0, 2.65, 0.28]);
  parent.add(group);
  return { group, light };
}

function buildMicroscope(parent: THREE.Object3D): THREE.Group {
  const group = new THREE.Group();
  const dark = material(0x30383a, { metalness: 0.7, roughness: 0.36 });
  box(group, [0.65, 0.08, 0.45], [0, 0.05, 0], dark);
  box(group, [0.1, 0.65, 0.1], [-0.18, 0.37, 0], dark, [0, 0, -0.18]);
  box(group, [0.46, 0.08, 0.32], [0.02, 0.43, 0], dark);
  box(group, [0.13, 0.48, 0.13], [0.15, 0.68, 0], dark, [0, 0, -0.25]);
  box(group, [0.22, 0.12, 0.18], [0.23, 0.9, 0], dark, [0, 0, -0.25]);
  box(group, [0.17, 0.03, 0.17], [0.02, 0.49, 0], basic(0xb4d9d1));
  parent.add(group);
  return group;
}

function buildHome(): HomeWorld {
  const group = new THREE.Group(); group.name = "四合院 · 收藏室";
  hemi(group, 0x9d8c77, 0x1c1513, 0.55);
  floor(group, 12, 10, [0x4c4038, 0x5c4b3d]);
  brickWall(group, 12, 5.4, 0.28, [0, 0, -4.2], 0x493b34, 0x5a4739);
  brickWall(group, 10, 5.4, 0.28, [-6, 0, 0], 0x3c3330, 0x514039, "side");
  box(group, [12, 0.26, 0.32], [0, 5.15, -3.95], material(palette.woodLight));
  for (const x of [-4, 0, 4]) box(group, [0.24, 0.32, 10], [x, 5.05, 0], material(palette.wood));
  // A high hutong window: the only hard daylight in the warm room.
  const windowFrame = material(0x2b2725, { roughness: 0.75 });
  box(group, [0.12, 2.0, 2.8], [-5.82, 3.35, -0.8], windowFrame);
  box(group, [0.04, 1.7, 2.45], [-5.73, 3.35, -0.8], basic(0xd7b77d, { transparent: true, opacity: 0.65 }));
  box(group, [0.08, 1.75, 0.08], [-5.67, 3.35, -0.8], windowFrame);
  box(group, [0.08, 0.08, 2.5], [-5.67, 3.35, -0.8], windowFrame);
  point(group, 0xffc178, 3.5, 11, [-4.8, 4.1, 0.4], true);
  point(group, 0x86a4a4, 0.45, 9, [4.5, 3.6, 1.2]);
  const cabinets = [-3.85, -0.45, 2.95].map((x, i) => buildCabinet(group, x, -3.82, 30 + i * 17));
  const desk = new THREE.Group(); desk.position.set(2.15, 0, 0.3); group.add(desk);
  const deskMat = material(0x614632, { roughness: 0.82 });
  box(desk, [3.0, 0.18, 1.35], [0, 1.12, 0], deskMat);
  for (const x of [-1.2, 1.2]) for (const z of [-0.45, 0.45]) box(desk, [0.14, 1.1, 0.14], [x, 0.55, z], deskMat);
  box(desk, [1.2, 0.06, 0.7], [0, 1.25, 0], material(0x8c6a48));
  const microscope = buildMicroscope(desk); microscope.position.set(0.35, 1.29, -0.08);
  const marsRock = makeMeteorite(0.12, 77, false); marsRock.position.set(0.37, 1.52, -0.08); desk.add(marsRock);
  const tea = new THREE.Group(); tea.position.set(-0.7, 1.27, 0.2); desk.add(tea);
  box(tea, [0.23, 0.2, 0.23], [0, 0, 0], material(0xb5a07a, { roughness: 0.42 }));
  box(tea, [0.28, 0.035, 0.28], [0, 0.12, 0], material(0x6d4937));
  box(tea, [0.08, 0.12, 0.06], [0.15, 0.01, 0], material(0xb5a07a));
  const safe = new THREE.Group(); safe.position.set(-4.75, 0, -1.7); group.add(safe);
  box(safe, [1.65, 2.1, 1.25], [0, 1.15, 0], material(0x293438, { metalness: 0.7, roughness: 0.42 }));
  const safeDoor = new THREE.Group(); safeDoor.position.set(-0.78, 1.15, 0.66); safe.add(safeDoor);
  box(safeDoor, [1.55, 1.95, 0.12], [0.78, 0, 0], material(0x3d4b4d, { metalness: 0.72, roughness: 0.35 }));
  box(safeDoor, [0.12, 0.5, 0.08], [1.18, 0, 0.09], material(0xb99a62, { metalness: 0.8 }));
  const saleRocks = new THREE.Group(); saleRocks.position.set(0.8, 1.29, 0.22); desk.add(saleRocks);
  for (let i = 0; i < 3; i++) { const rock = makeMeteorite(0.2, 140 + i, true); rock.position.set((i - 1) * 0.55, 0, 0); saleRocks.add(rock); }
  const zhang = makeFigure("zhang"); zhang.root.position.set(-3.1, 0, 2.15); zhang.root.rotation.y = 1.9; group.add(zhang.root);
  const collector = makeFigure("collector", 1.72); collector.root.position.set(2.1, 0, -0.55); collector.root.rotation.y = 0.12; group.add(collector.root);
  const dust = makePixelParticles(90, 0xe2c28e, 0.025); const rng = seeded(411);
  const pos = dust.geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < 90; i++) { pos.setXYZ(i, -5 + rng() * 10, 0.7 + rng() * 3.8, -3.5 + rng() * 6); }
  (dust.material as THREE.PointsMaterial).opacity = 0.25; group.add(dust);
  sign(group, "陨石", "COLLECTION / 01", [-3.85, 3.92, -3.55], [1.1, 0.42], "#d4a76a");
  return { group, zhang, collector, saleRocks, marsRock, safeDoor, cabinetLights: cabinets.map((c) => c.light), microscope, dust, tea };
}

function buildWorkshop(): WorkshopWorld {
  const group = new THREE.Group(); group.name = "太空军研究所 · 模型车间";
  hemi(group, 0x6e8990, 0x11171d, 0.32);
  floor(group, 14, 11, [0x28353b, 0x303e42]);
  box(group, [14, 5.8, 0.25], [0, 2.9, -4.6], material(0x1d292f, { metalness: 0.4, roughness: 0.8 }));
  for (let x = -6; x <= 6; x += 2) box(group, [0.06, 5.4, 0.08], [x, 2.8, -4.4], material(0x40545a, { metalness: 0.6 }));
  for (const x of [-4, 0, 4]) { box(group, [2.2, 0.08, 0.35], [x, 5.1, -1], basic(0xa6dfd5)); point(group, 0x9edbd3, 2.2, 8, [x, 4.8, -1]); }
  const machine = new THREE.Group(); machine.position.set(0, 0, -1.4); group.add(machine);
  const casing = material(0x3c4b51, { metalness: 0.72, roughness: 0.36 });
  const dark = material(0x18242b, { metalness: 0.55, roughness: 0.4 });
  box(machine, [4.8, 0.6, 2.35], [0, 0.3, 0], dark);
  box(machine, [4.6, 0.3, 2.2], [0, 3.35, 0], casing);
  for (const x of [-2.15, 2.15]) box(machine, [0.28, 3, 2.1], [x, 1.85, 0], casing);
  box(machine, [4.25, 2.75, 0.14], [0, 1.8, -1.03], dark);
  const door = box(machine, [4.15, 2.55, 0.035], [0, 1.75, 1.05], new THREE.MeshStandardMaterial({ color: 0x80b7b5, transparent: true, opacity: 0.1, roughness: 0.08, metalness: 0.2, depthWrite: false }));
  box(machine, [3.6, 0.16, 1.45], [0, 1.03, 0], material(0x65777a, { metalness: 0.8, roughness: 0.3 }));
  const spindle = new THREE.Group(); spindle.position.set(0, 2.7, 0); machine.add(spindle);
  box(spindle, [0.65, 0.5, 0.65], [0, 0, 0], casing);
  box(spindle, [0.18, 0.85, 0.18], [0, -0.58, 0], material(0xb0bdba, { metalness: 0.9, roughness: 0.22 }));
  box(spindle, [0.28, 0.12, 0.28], [0, -1.02, 0], basic(0xe7bd76));
  const cuttingRock = makeMeteorite(0.28, 180, true); cuttingRock.position.set(0, 1.27, 0); machine.add(cuttingRock);
  const screen = sign(machine, "CNC / 04", "FE-NI  ·  CUTTING", [1.52, 2.45, 1.12], [1.05, 0.48], "#7ed1c7");
  screen.rotation.y = 0;
  const statusLight = box(machine, [0.09, 0.09, 0.04], [1.9, 2.9, 1.13], basic(0x76e0c7));
  const tray = new THREE.Group(); tray.position.set(3.0, 1.02, 1.1); group.add(tray);
  box(tray, [2.25, 0.12, 1.65], [0, 0, 0], material(0x222c31, { metalness: 0.7, roughness: 0.38 }));
  const rounds: THREE.Group[] = [];
  for (let i = 0; i < 36; i++) {
    const round = new THREE.Group();
    box(round, [0.075, 0.075, 0.29], [0, 0.08, 0], material(0x7e7160, { metalness: 0.72, roughness: 0.4 }));
    round.position.set(-0.78 + (i % 6) * 0.31, 0.08, -0.55 + Math.floor(i / 6) * 0.22);
    round.rotation.y = (i % 3 - 1) * 0.1;
    tray.add(round); rounds.push(round);
  }
  const workZhang = makeFigure("work"); workZhang.root.position.set(-2.8, 0, 1.3); workZhang.root.rotation.y = 2.4; group.add(workZhang.root);
  const sparks = makePixelParticles(100, 0xffc477, 0.055); group.add(sparks);
  const sparkSeed = Array.from({ length: 100 }, (_, i) => (i * 0.6180339887) % 1);
  const shavings = new THREE.Group(); group.add(shavings);
  const rng = seeded(901);
  for (let i = 0; i < 26; i++) { const bit = box(shavings, [0.035 + rng() * 0.06, 0.025, 0.05 + rng() * 0.1], [-1 + rng() * 2, 1.15, -0.8 + rng() * 0.7], material(0x9b7956, { metalness: 0.7, roughness: 0.5 })); bit.rotation.y = rng() * 3; }
  const tool = new THREE.Group(); tool.position.set(2.8, 1.25, -0.2); group.add(tool);
  box(tool, [0.1, 0.8, 0.1], [0, 0, 0], material(0xa9b6b3, { metalness: 0.85, roughness: 0.25 }));
  box(tool, [0.22, 0.12, 0.22], [0, -0.42, 0], material(0x3c4b51, { metalness: 0.7 }));
  sign(group, "36", "CYLINDERS / 7.62 MM", [3.0, 1.65, 1.05], [1.2, 0.48], "#d4a76a");
  point(group, 0xffa45f, 1.5, 4, [0, 1.5, -0.2]);
  return { group, zhang: workZhang, spindle, door, cuttingRock, tray, rounds, sparks, sparkSeed, shavings, tool, statusLight };
}

function buildBasement(): BasementWorld {
  const group = new THREE.Group(); group.name = "隐蔽地下室";
  hemi(group, 0x635b51, 0x0d1013, 0.2);
  floor(group, 10, 9, [0x292827, 0x34302c]);
  brickWall(group, 10, 4.8, 0.3, [0, 0, -4], 0x353332, 0x45403a);
  brickWall(group, 8, 4.8, 0.3, [-5, 0, 0], 0x2a2c2c, 0x3a3733, "side");
  box(group, [0.22, 0.22, 0.22], [0, 4.2, -0.4], basic(0xffc27b));
  const lamp = point(group, 0xffb16d, 4.4, 8, [0, 3.9, -0.4], true);
  const table = new THREE.Group(); table.position.set(0, 0, 0); group.add(table);
  const tableMat = material(0x4b3b30, { roughness: 0.88 });
  box(table, [3.5, 0.18, 1.5], [0, 1.05, 0], tableMat);
  for (const x of [-1.4, 1.4]) for (const z of [-0.52, 0.52]) box(table, [0.14, 1.05, 0.14], [x, 0.5, z], tableMat);
  const rounds: THREE.Group[] = [];
  for (let i = 0; i < 36; i++) {
    const round = new THREE.Group();
    box(round, [0.07, 0.07, 0.25], [0, 0.07, 0], material(0x353c3d, { metalness: 0.5, roughness: 0.55 }));
    const copper = box(round, [0.078, 0.078, 0.095], [0, 0.07, 0.17], material(0xb27a4e, { metalness: 0.65, roughness: 0.43 }));
    const meteor = box(round, [0.08, 0.08, 0.095], [0, 0.07, 0.17], material(0x6d6558, { metalness: 0.62, roughness: 0.55 }));
    meteor.visible = false; round.userData.copper = copper; round.userData.meteor = meteor;
    round.position.set(-1.12 + (i % 9) * 0.28, 1.16, -0.42 + Math.floor(i / 9) * 0.27);
    round.rotation.y = Math.PI / 2;
    table.add(round); rounds.push(round);
  }
  const tableGun = makePistol(); tableGun.position.set(1.0, 1.3, 0.2); tableGun.rotation.x = Math.PI / 2; table.add(tableGun);
  const cloth = box(group, [2.05, 1.8, 0.22], [0, 1.8, -3.35], material(0xb2a28a, { roughness: 0.98 }));
  const beef = box(group, [1.4, 1.25, 0.55], [0, 1.8, -3.58], material(0x713f3c, { roughness: 0.95 })); beef.visible = false;
  const holes: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) { const hole = box(group, [0.075, 0.075, 0.025], [-0.42 + (i % 2) * 0.72, 1.58 + Math.floor(i / 2) * 0.45, -3.21], basic(0x161719)); hole.visible = false; holes.push(hole); }
  const fragments = new THREE.Group(); group.add(fragments);
  for (let i = 0; i < 16; i++) { const piece = box(fragments, [0.025, 0.025, 0.04], [-0.35 + (i % 4) * 0.22, 1.3, -3.05 + Math.floor(i / 4) * 0.12], material(0x837767, { metalness: 0.55 })); piece.visible = false; }
  const zhang = makeFigure("work"); zhang.root.position.set(0, 0, 1.75); zhang.root.rotation.y = Math.PI; group.add(zhang.root);
  const handGun = makePistol(); zhang.anchors.handR.add(handGun); handGun.position.set(0, 0, 0.08);
  const flash = makeFlash(); handGun.add(flash); flash.position.z = 0.42;
  sign(group, "7.62", "CASELESS / TEST 04", [-2.4, 1.35, -0.65], [0.95, 0.4], "#bf8f60");
  return { group, zhang, rounds, tableGun, handGun, flash, cloth, beef, holes, fragments, lamp };
}

function buildBase(): BaseWorld {
  const group = new THREE.Group(); group.name = "一号基地 · 舱室";
  hemi(group, 0x648a9a, 0x0c1721, 0.35);
  floor(group, 9, 8, [0x1d303c, 0x243b47]);
  box(group, [9, 4.5, 0.18], [0, 2.25, -3.6], material(0x1b2d39, { metalness: 0.55, roughness: 0.52 }));
  for (const x of [-3.8, -1.9, 0, 1.9, 3.8]) box(group, [0.06, 4.2, 0.1], [x, 2.2, -3.46], material(0x42616b, { metalness: 0.7 }));
  const locker = new THREE.Group(); locker.position.set(-2.2, 0, -1.8); group.add(locker);
  box(locker, [1.3, 2.7, 0.72], [0, 1.35, 0], material(0x435760, { metalness: 0.65, roughness: 0.45 }));
  const lockerDoor = new THREE.Group(); lockerDoor.position.set(-0.62, 1.35, 0.4); locker.add(lockerDoor);
  box(lockerDoor, [1.2, 2.55, 0.06], [0.6, 0, 0], material(0x526b73, { metalness: 0.65, roughness: 0.42 }));
  box(lockerDoor, [0.08, 0.32, 0.08], [1.02, 0, 0.07], basic(0xd4a76a));
  const bed = new THREE.Group(); bed.position.set(2.1, 0, -1.6); group.add(bed);
  box(bed, [2.7, 0.28, 1.25], [0, 0.7, 0], material(0x394f5a, { metalness: 0.5 }));
  box(bed, [2.5, 0.18, 1.1], [0, 0.91, 0], material(0x9aa9a7, { roughness: 0.95 }));
  box(bed, [0.65, 0.2, 0.95], [-0.78, 1.1, 0], material(0xc0c9c2, { roughness: 0.95 }));
  const monitor = sign(group, "一号基地", "POSITION / ONLINE", [0.4, 2.65, -3.42], [2.0, 0.85], "#79cfc5");
  monitor.rotation.y = 0;
  const monitorDot = box(group, [0.1, 0.1, 0.04], [0.95, 2.48, -3.32], basic(0x72e1bf));
  const locator = box(group, [0.16, 0.16, 0.16], [-0.15, 1.35, 0.45], basic(0x72e1bf));
  const zhang = makeFigure("base"); zhang.root.position.set(0, 0, 1.25); zhang.root.rotation.y = -0.55; group.add(zhang.root);
  const cabinLight = point(group, 0x79c4ce, 2.8, 8, [0, 3.5, -0.5], true);
  sign(group, "A-01", "SLEEP / WORK", [3.25, 2.7, -3.38], [0.85, 0.4], "#7eafb6");
  return { group, zhang, lockerDoor, locator, monitorDot, cabinLight };
}

function buildWheelStation(): THREE.Group {
  const group = new THREE.Group(); group.name = "黄河空间站 · 轮毂";
  const metal = material(0x65777d, { metalness: 0.82, roughness: 0.34 });
  const dark = material(0x263b47, { metalness: 0.72, roughness: 0.4 });
  const light = basic(0xd9c17f);
  const radius = 5.1;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * TAU;
    const segment = box(group, [1.45, 0.62, 0.72], [Math.cos(a) * radius, Math.sin(a) * radius, 0], metal, [0, 0, a + Math.PI / 2]);
    if (i % 3 === 0) box(group, [0.22, 0.12, 0.78], [Math.cos(a) * radius, Math.sin(a) * radius, 0.03], light, [0, 0, a + Math.PI / 2]);
    void segment;
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU;
    box(group, [0.26, radius, 0.3], [Math.cos(a) * radius * 0.5, Math.sin(a) * radius * 0.5, 0], dark, [0, 0, a - Math.PI / 2]);
  }
  box(group, [2.1, 2.1, 1.1], [0, 0, 0], metal);
  box(group, [1.2, 1.2, 1.2], [0, 0, 0.62], dark);
  for (const side of [-1, 1]) {
    const panel = makeVoxelPanel(5.2, 2.7, 0x1b3c51, 8); panel.position.set(side * 7.1, 0, -0.1); panel.rotation.z = side * 0.06; group.add(panel);
    box(group, [2.0, 0.18, 0.25], [side * 4.6, 0, 0], metal, [0, 0, side * 0.04]);
  }
  sign(group, "黄河", "HUANGHE / 01", [0, -1.55, 0.64], [1.65, 0.5], "#d4a76a");
  return group;
}

function buildMeetingStation(): { group: THREE.Group; door: THREE.Mesh; red: THREE.Mesh; green: THREE.Mesh } {
  const group = new THREE.Group(); group.name = "黄河站 · 合影出口"; group.position.set(0, 2, -17);
  box(group, [18, 10, 1.2], [0, 0, 0], material(0x43545c, { metalness: 0.78, roughness: 0.4 }));
  for (let x = -8; x <= 8; x += 2) box(group, [0.045, 9.3, 0.05], [x, 0, 0.64], material(0x71848a, { metalness: 0.7, roughness: 0.4 }));
  for (let y = -4; y <= 4; y += 2) box(group, [17.7, 0.045, 0.05], [0, y, 0.64], material(0x2d414c, { metalness: 0.7 }));
  const hatchFrame = material(0x1d2c35, { metalness: 0.85, roughness: 0.28 });
  box(group, [3.5, 3.5, 0.28], [0, -0.1, 0.76], hatchFrame);
  const door = box(group, [2.8, 2.8, 0.18], [0, -0.1, 0.96], material(0x68787b, { metalness: 0.72, roughness: 0.38 }));
  box(group, [2.2, 0.08, 0.08], [0, -0.1, 1.08], material(0x98a8a6, { metalness: 0.75 }));
  const red = box(group, [0.18, 0.18, 0.08], [2.05, 1.35, 0.85], basic(0xe35c51));
  const green = box(group, [0.18, 0.18, 0.08], [2.05, 1.35, 0.86], basic(0x72e0bc)); green.visible = false;
  sign(group, "黄河空间站", "EXIT 03  /  PHOTO SESSION", [5.5, 2.9, 0.72], [3.3, 0.78], "#d4a76a");
  return { group, door, red, green };
}

function buildBaseModel(): THREE.Group {
  const group = new THREE.Group();
  box(group, [2.2, 1.6, 1.8], [0, 0, 0], material(0x465c67, { metalness: 0.75, roughness: 0.38 }));
  box(group, [1.2, 0.8, 0.2], [0, 0, 0.95], basic(0x1a3546));
  for (const side of [-1, 1]) { const panel = makeVoxelPanel(2.4, 1.2, 0x1d4056, 5); panel.position.set(side * 2.0, 0, 0); group.add(panel); }
  return group;
}

function buildSpace(): SpaceWorld {
  const group = new THREE.Group(); group.name = "同步轨道 · 五公里";
  const stars = makeStars(); group.add(stars);
  const earth = new THREE.Group(); const earthParts = makeEarth(); earth.add(earthParts.planet, earthParts.atmosphere); earth.position.set(-11, -7.5, -39); earth.rotation.z = -0.22; group.add(earth);
  const sun = voxelMesh(voxelSphere(5, (x, y, z) => (x + y + z) % 3 ? 0xffb35f : 0xffdf9b, { voxel: 0.38 }), { emissive: 0xff7c35, emissiveIntensity: 1.7, roughness: 0.6 });
  sun.position.set(11, 5, -43); group.add(sun);
  const sunLight = new THREE.DirectionalLight(0xffc17e, 3.0); sunLight.position.set(8, 6, 4); sunLight.castShadow = true; sunLight.shadow.mapSize.set(1024, 1024); group.add(sunLight);
  hemi(group, 0x263c5b, 0x03060c, 0.28);
  const station = buildWheelStation(); station.position.set(0, 1, -22); station.rotation.x = 0.16; group.add(station);
  const meeting = buildMeetingStation(); group.add(meeting.group);
  const baseModel = buildBaseModel(); baseModel.position.set(0, 0, -11); group.add(baseModel);
  const debris = new THREE.Group(); const rng = seeded(191); group.add(debris);
  for (let i = 0; i < 55; i++) {
    const bit = box(debris, [0.08 + rng() * 0.34, 0.08 + rng() * 0.24, 0.08 + rng() * 0.5], [-13 + rng() * 26, -6 + rng() * 13, -32 + rng() * 30], material(i % 4 ? 0x42545c : 0x9b7958, { metalness: 0.65, roughness: 0.58 }));
    bit.rotation.set(rng() * 3, rng() * 3, rng() * 3);
  }
  const zhang = makeSpaceFigure(0, "#bd6452", false); zhang.setBody(bodySkin("zhang").texture); zhang.root.position.set(0, -0.6, 1.2); zhang.root.rotation.y = Math.PI; group.add(zhang.root);
  const zhangDark = spaceSuitSkin("#bd6452", false); const zhangClear = spaceSuitSkin("#bd6452", true);
  const backpack = makeBackpack(); zhang.anchors.back.add(backpack);
  const gun = makePistol(); gun.position.set(0, 0, 0.1); zhang.anchors.handR.add(gun);
  const scope = makeScope(); scope.position.set(0, 0.16, 0.02); gun.add(scope);
  const flash = makeFlash(); flash.position.z = 0.44; gun.add(flash);
  const thruster = makeThruster(); thruster.position.z = -0.12; zhang.anchors.back.add(thruster);
  const crowdGroup = new THREE.Group(); group.add(crowdGroup);
  const crowd: CrowdMember[] = [];
  const hitIndices = [4, 5, 6, 14, 24];
  const accents = ["#bd6452", "#d0aa63", "#72aaa5"];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 10; col++) {
      const index = row * 10 + col;
      const target = index >= 4 && index <= 6;
      const accent = target ? accents[index - 4]! : (index % 4 === 0 ? "#829b9c" : "#b4c2bd");
      const figure = makeSpaceFigure(index % 4, accent, false);
      const darkSkin = spaceSuitSkin(accent, false); const clearSkin = spaceSuitSkin(accent, true); const crackedSkin = spaceSuitSkin(accent, false, true);
      figure.setClothes(darkSkin.texture);
      const final = new THREE.Vector3((col - 4.5) * 0.94 + (row % 2) * 0.18, 0.35 + row * 1.28, -12.35 - row * 0.22);
      figure.root.position.copy(final); figure.root.rotation.y = 0;
      figure.anchors.back.add(makeBackpack());
      const thr = makeThruster(); thr.position.z = -0.12; figure.anchors.back.add(thr); figure.root.userData.thruster = thr;
      crowdGroup.add(figure.root);
      const shots = METEOR_SHOT_TIMES.filter((_, i) => {
        const assigned = i % 10 === 7 ? 14 : i % 10 === 8 ? 24 : Math.floor(i / 10) + 4;
        return assigned === index;
      });
      const firstHit = shots.length ? shots[0]! + 10 : Infinity;
      const lastHit = shots.length ? shots[shots.length - 1]! + 10 : Infinity;
      const burst = new THREE.Group(); burst.position.copy(final).add(new THREE.Vector3(0, 1.05, 0)); burst.visible = false; group.add(burst);
      const burstDirections: THREE.Vector3[] = [];
      for (let p = 0; p < 22; p++) {
        const particle = box(burst, [0.045 + (p % 3) * 0.018, 0.045, 0.045], [0, 0, 0], basic(p % 5 === 0 ? 0xc1d7d2 : 0xf0f5e9, { transparent: true, opacity: 0.78, depthWrite: false }));
        const a = (p / 22) * TAU; const direction = new THREE.Vector3(Math.cos(a) * (0.4 + (p % 4) * 0.15), Math.sin(a) * (0.35 + (p % 3) * 0.12), 0.3 + (p % 4) * 0.12);
        burstDirections.push(direction); particle.userData.particleIndex = p;
      }
      crowd.push({ figure, index, row, col, final, target, accent, darkSkin, clearSkin, crackedSkin, firstHit, lastHit, burst, burstDirections });
    }
  }
  const photographer = makeSpaceFigure(2, "#d4a76a", true); photographer.root.position.set(5.7, 1.3, -10.3); photographer.root.rotation.y = -1.1; photographer.anchors.back.add(makeBackpack()); photographer.anchors.handR.add(makeCameraProp()); crowdGroup.add(photographer.root);
  const bulletGroup = new THREE.Group(); group.add(bulletGroup);
  const bullets: SpaceWorld["bullets"] = [];
  for (let i = 0; i < METEOR_SHOT_TIMES.length; i++) {
    const target = i % 10 === 7 ? 14 : i % 10 === 8 ? 24 : Math.floor(i / 10) + 4;
    const mesh = box(bulletGroup, [0.025, 0.025, 0.32], [0, 0, 0], basic(0xd4d7c4, { transparent: true, opacity: 0.92 }));
    const trail = box(bulletGroup, [0.012, 0.012, 0.85], [0, 0, 0.45], basic(0x9bbab7, { transparent: true, opacity: 0.25, depthWrite: false }));
    mesh.visible = false; trail.visible = false;
    const end = crowd[target]!.final.clone().add(new THREE.Vector3(0, 1.05, 0));
    bullets.push({ mesh, trail, start: new THREE.Vector3(0, 0.15, 0.65), end, shot: METEOR_SHOT_TIMES[i]!, target });
  }
  return { group, stars, earth, sun, station, meetingStation: meeting.group, baseModel, debris, zhang, zhangDark, zhangClear, gun, flash, thruster, photographer, crowd, crowdGroup, hatchDoor: meeting.door, hatchRed: meeting.red, hatchGreen: meeting.green, bullets, bulletGroup, hitIndices };
}

function buildMacro(): MacroWorld {
  const group = new THREE.Group(); group.name = "一块石头";
  hemi(group, 0x354a5b, 0x05070c, 0.25);
  const rock = makeMeteorite(1.05, 771, true); group.add(rock);
  const ring = new THREE.Group(); group.add(ring);
  const ringMat = basic(0x8a6c4c, { transparent: true, opacity: 0.42 });
  for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU; box(ring, [0.035, 0.035, 2.8], [Math.cos(a) * 1.55, Math.sin(a) * 1.55, 0], ringMat, [0, 0, a]); }
  point(group, 0xffc079, 8, 10, [2.5, 3, 4], true);
  point(group, 0x4c93a4, 3, 8, [-3, 0, -2]);
  sign(group, "Fe / Ni", "ORIGIN: BEYOND THE WORLD", [0, -1.85, 0], [2.5, 0.52], "#d4a76a");
  group.add(makeStars(160, 81, 30));
  return { group, rock, ring };
}

const TAU = Math.PI * 2;

export function buildWorld(): World {
  const root = new THREE.Group();
  const home = buildHome(); const workshop = buildWorkshop(); const basement = buildBasement(); const base = buildBase(); const space = buildSpace(); const macro = buildMacro();
  const environments: Record<EnvironmentName, THREE.Group> = { home: home.group, workshop: workshop.group, basement: basement.group, base: base.group, space: space.group, macro: macro.group };
  for (const group of Object.values(environments)) { group.visible = false; root.add(group); }
  const activate = (name: EnvironmentName): void => { for (const [key, group] of Object.entries(environments)) group.visible = key === name; };
  return { root, environments, home, workshop, basement, base, space, macro, activate };
}

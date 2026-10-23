import * as THREE from "three";
import {
  buildVoxelGeometry,
  voxelMaterial,
  voxelModel,
  voxelSphere,
} from "@agentbench/voxel-kit";
import {
  attachPack,
  createBriefcase,
  createCharacter,
  createCup,
  createPhone,
  createPistol,
  groundedPose,
  pose,
  weightlessPose,
} from "./figures.js";
import { impactTimes, volleyTimes } from "./data.js";

const clamp = (v) => Math.max(0, Math.min(1, v));
const progress = (t, a, b) => clamp((t - a) / (b - a));
const smooth = (v) => v * v * (3 - 2 * v);
const hash = (x, y = 0, z = 0) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
};

function standard(colour, roughness = 0.8, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color: colour, roughness, metalness });
}

function box(parent, size, position, material, name = "") {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = name;
  parent.add(mesh);
  return mesh;
}

function makeLabel(text, width = 3, height = 0.65, colour = "#d9ddd8", background = "rgba(4,12,16,.78)") {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(190,210,205,.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
  ctx.fillStyle = colour;
  ctx.font = "500 56px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide }),
  );
  return mesh;
}

function rock(radius = 3, voxel = 0.08, seed = 1) {
  const geometry = voxelSphere(radius, (x, y, z, d) => {
    if (d > 0.72 && hash(x + seed * 9, y, z) > 0.87) return null;
    const n = hash(x, y + seed * 5, z);
    return n > 0.78 ? 0x766b5d : n > 0.35 ? 0x4c4943 : 0x33383a;
  }, { voxel });
  return new THREE.Mesh(geometry, voxelMaterial({ roughness: 0.58, metalness: 0.62 }));
}

function meteorSegment() {
  return new THREE.Mesh(voxelModel({
    palette: { "#": 0x65645d, o: 0x3c4243 },
    layers: [
      [".oo.", "####", "####", ".oo."],
      [".oo.", "####", "####", ".oo."],
      [".oo.", "####", "####", ".oo."],
    ],
    axis: "z",
    voxel: 0.027,
  }), voxelMaterial({ roughness: 0.48, metalness: 0.76 }));
}

function bulletMesh() {
  return new THREE.Mesh(voxelModel({
    palette: { p: 0x715f3f, m: 0x4e5250, h: 0x77746a },
    layers: [
      [".pp.", "pppp", "pppp", ".pp."],
      [".pp.", "pppp", "pppp", ".pp."],
      [".mm.", "mmmm", "mmmm", ".mm."],
      [".hh.", "hhhh", "hhhh", ".hh."],
    ],
    axis: "z",
    voxel: 0.025,
  }), voxelMaterial({ roughness: 0.42, metalness: 0.7 }));
}

function addRoomShell(group, width, height, depth, colours) {
  const floor = standard(colours.floor, 0.96);
  const wall = standard(colours.wall, 0.94);
  box(group, [width, 0.18, depth], [0, -0.1, 0], floor);
  box(group, [width, height, 0.18], [0, height / 2, -depth / 2], wall);
  box(group, [0.18, height, depth], [-width / 2, height / 2, 0], wall);
  box(group, [0.18, height, depth], [width / 2, height / 2, 0], wall);
}

function cabinet() {
  const group = new THREE.Group();
  const wood = standard(0x352a22, 0.84);
  const glass = new THREE.MeshStandardMaterial({ color: 0x9fb3ae, transparent: true, opacity: 0.12, roughness: 0.12, metalness: 0.1, depthWrite: false });
  box(group, [2.15, 0.14, 0.72], [0, 0.07, 0], wood);
  box(group, [2.15, 0.14, 0.72], [0, 3.55, 0], wood);
  for (const x of [-1.02, 1.02]) box(group, [0.12, 3.5, 0.72], [x, 1.8, 0], wood);
  for (const y of [1.2, 2.35]) box(group, [2, 0.07, 0.64], [0, y, 0], wood);
  box(group, [1.9, 3.3, 0.035], [0, 1.8, 0.36], glass);
  for (let shelf = 0; shelf < 3; shelf++) {
    for (let col = 0; col < 3; col++) {
      const specimen = rock(2 + ((shelf + col) % 2), 0.055, shelf * 8 + col + 2);
      specimen.position.set(-0.65 + col * 0.65, 0.36 + shelf * 1.15, 0.05);
      specimen.rotation.set(hash(shelf, col) * 2, hash(col, shelf) * 3, 0);
      group.add(specimen);
      box(group, [0.32, 0.05, 0.28], [-0.65 + col * 0.65, 0.15 + shelf * 1.15, 0.05], standard(0x171a19));
    }
  }
  const light = new THREE.PointLight(0xffd89b, 2.2, 3.4, 2);
  light.position.set(0, 3.15, 0.5);
  group.add(light);
  return group;
}

function buildHome(scene) {
  const group = new THREE.Group();
  group.name = "scene-home";
  scene.add(group);
  addRoomShell(group, 13, 5.4, 10, { floor: 0x30251e, wall: 0x3a3027 });
  const beams = standard(0x261d18, 0.9);
  for (const x of [-5.6, 0, 5.6]) box(group, [0.22, 5.4, 0.25], [x, 2.7, -4.75], beams);
  box(group, [12.4, 0.22, 0.3], [0, 4.75, -4.72], beams);
  for (const [i, x] of [-4.25, -1.45, 1.45, 4.25].entries()) {
    const c = cabinet();
    c.position.set(x, 0, -4.35);
    c.scale.setScalar(i % 2 ? 0.93 : 1);
    group.add(c);
  }
  const table = new THREE.Group();
  const wood = standard(0x4b3425, 0.72);
  box(table, [4.5, 0.18, 1.75], [0, 1.03, 0], wood);
  for (const x of [-1.9, 1.9]) for (const z of [-0.62, 0.62]) box(table, [0.16, 1, 0.16], [x, 0.5, z], wood);
  table.position.set(0, 0, -0.6);
  group.add(table);

  const collector = createCharacter("collector", { age: 1, tone: "#c28e6b", hair: "#77766e", heightM: 1.72, name: "收藏者" });
  collector.figure.root.position.set(-0.7, 0.04, -2.05);
  group.add(collector.figure.root);
  const cup = createCup();
  collector.figure.anchors.handR.add(cup);

  const zhang = createCharacter("uniform", { tone: "#ae795b", hair: "#1d2425", heightM: 1.84, name: "章北海-老宅" });
  zhang.figure.root.position.set(1.45, 0.03, 1.15);
  zhang.figure.root.rotation.y = Math.PI + 0.55;
  group.add(zhang.figure.root);
  const briefcase = createBriefcase();
  zhang.figure.anchors.handL.add(briefcase);
  const phone = createPhone();
  zhang.figure.anchors.handR.add(phone);

  const specimens = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const r = rock(3, 0.065, 30 + i);
    r.position.set(-0.65 + i * 0.65, 1.28, -0.25);
    r.rotation.set(0.2 * i, 0.7 * i, 0.1);
    specimens.add(r);
  }
  group.add(specimens);

  const magnifier = new THREE.Mesh(voxelModel({
    palette: { "#": 0x9c8352, g: 0x7d9999 },
    layers: [[".###.", "#ggg#", "#ggg#", "#ggg#", ".###.", "..#..", "..#.."]],
    axis: "z",
    voxel: 0.055,
  }), voxelMaterial({ roughness: 0.35, metalness: 0.65 }));
  magnifier.position.set(-1.25, 1.18, -0.2);
  magnifier.rotation.x = -Math.PI / 2;
  group.add(magnifier);

  const windowGlow = new THREE.MeshBasicMaterial({ color: 0x66828a });
  box(group, [0.05, 2.2, 2.9], [6.35, 3, 0.8], windowGlow);
  for (const y of [1.85, 3, 4.15]) box(group, [0.12, 0.12, 3.1], [6.25, y, 0.8], beams);
  for (const z of [-0.7, 0.8, 2.3]) box(group, [0.12, 2.4, 0.12], [6.25, 3, z], beams);

  const ambient = new THREE.HemisphereLight(0x71818a, 0x281c14, 0.62);
  group.add(ambient);
  const key = new THREE.SpotLight(0xffc980, 52, 18, Math.PI / 4.5, 0.65, 1.5);
  key.position.set(-3.8, 4.7, 2.8);
  key.target.position.set(0, 1, -0.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  group.add(key, key.target);
  const rim = new THREE.DirectionalLight(0x779aaa, 1.35);
  rim.position.set(6, 3, 1);
  group.add(rim);

  const dustPositions = new Float32Array(90 * 3);
  for (let i = 0; i < 90; i++) {
    dustPositions[i * 3] = (hash(i, 1) - 0.5) * 11;
    dustPositions[i * 3 + 1] = hash(i, 2) * 4.5 + 0.3;
    dustPositions[i * 3 + 2] = (hash(i, 3) - 0.5) * 8;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xe0bd82, size: 0.018, transparent: true, opacity: 0.5, depthWrite: false }));
  group.add(dust);
  return { group, zhang, collector, specimens, phone, briefcase, cup, dust };
}

function buildWorkshop(scene) {
  const group = new THREE.Group();
  group.name = "scene-workshop";
  scene.add(group);
  addRoomShell(group, 14, 6, 11, { floor: 0x293236, wall: 0x394348 });
  const metal = standard(0x56646a, 0.44, 0.66);
  const dark = standard(0x202b31, 0.52, 0.55);
  const enamel = standard(0x879598, 0.48, 0.38);
  box(group, [6.4, 0.4, 2.6], [0, 0.35, -1], dark);
  box(group, [2, 2.5, 2.2], [-2.1, 1.55, -1], enamel);
  box(group, [1.2, 1.65, 1.8], [2.25, 1.15, -1], enamel);
  box(group, [4.6, 0.22, 0.35], [0, 1.02, -0.05], metal);
  box(group, [4.6, 0.22, 0.35], [0, 1.02, -1.95], metal);
  for (const x of [-2.9, 2.9]) box(group, [0.15, 3.5, 2.8], [x, 2, -1], dark);
  box(group, [6, 0.18, 2.8], [0, 3.72, -1], dark);
  const control = box(group, [1.25, 1.6, 0.35], [3.1, 2.4, 0.05], dark);
  const screen = makeLabel("CNC  /  22:47", 1.05, 0.36, "#8ad6c8", "#10272a");
  screen.position.set(0, 0.25, 0.181);
  control.add(screen);
  for (let i = 0; i < 4; i++) box(control, [0.12, 0.08, 0.04], [-0.4 + i * 0.25, -0.3, 0.2], standard(i === 0 ? 0xc26643 : 0x6a8381, 0.4));

  const workpiece = meteorSegment();
  workpiece.scale.set(2.2, 2.2, 5.5);
  workpiece.rotation.y = Math.PI / 2;
  workpiece.position.set(0, 1.75, -0.8);
  group.add(workpiece);
  const cutter = box(group, [0.28, 0.75, 0.3], [0.15, 2.2, -0.45], metal);
  cutter.rotation.z = -0.25;
  const cutGlow = new THREE.PointLight(0x9edcd8, 0, 3, 2);
  cutGlow.position.set(0.1, 1.8, -0.35);
  group.add(cutGlow);

  const sparkGeometry = new THREE.BoxGeometry(0.025, 0.025, 0.09);
  const sparkMaterial = new THREE.MeshBasicMaterial({ color: 0xb8eee4 });
  const sparks = [];
  for (let i = 0; i < 18; i++) {
    const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
    group.add(spark);
    sparks.push(spark);
  }

  const sideTable = new THREE.Group();
  box(sideTable, [3.2, 0.16, 2.4], [0, 1, 0], metal);
  for (const x of [-1.3, 1.3]) for (const z of [-0.9, 0.9]) box(sideTable, [0.12, 1, 0.12], [x, 0.5, z], dark);
  sideTable.position.set(3.6, 0, 2.3);
  group.add(sideTable);
  const rawRocks = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const r = rock(3, 0.09, 30 + i);
    r.position.set(2.8 + i * 0.7, 1.28, 1.7);
    group.add(r);
    rawRocks.add(r);
  }
  group.add(rawRocks);

  const tray = box(group, [2.25, 0.09, 2.25], [3.6, 1.12, 2.65], standard(0x1d282c, 0.55, 0.45));
  const segments = [];
  for (let i = 0; i < 36; i++) {
    const segment = meteorSegment();
    segment.position.set(2.72 + (i % 6) * 0.35, 1.22, 1.78 + Math.floor(i / 6) * 0.35);
    segment.rotation.x = Math.PI / 2;
    group.add(segment);
    segments.push(segment);
  }

  const zhang = createCharacter("uniform", { tone: "#ae795b", hair: "#1d2425", heightM: 1.84, name: "章北海-车间" });
  zhang.figure.root.position.set(0.9, 0, 1.5);
  zhang.figure.root.rotation.y = Math.PI + 0.18;
  group.add(zhang.figure.root);

  const ambient = new THREE.HemisphereLight(0x90b5bd, 0x172126, 0.75);
  group.add(ambient);
  const key = new THREE.SpotLight(0xc8f1ed, 70, 19, Math.PI / 4, 0.55, 1.4);
  key.position.set(0, 5.4, 2.8);
  key.target.position.set(0, 1, -0.8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  group.add(key, key.target);
  const side = new THREE.DirectionalLight(0x6d92a4, 1.25);
  side.position.set(-5, 2, 3);
  group.add(side);
  const sign = makeLabel("太空军研究所  ·  模型加工", 4.6, 0.62);
  sign.position.set(-2.8, 4.6, -5.38);
  group.add(sign);
  return { group, zhang, workpiece, cutter, cutGlow, sparks, segments, rawRocks, tray };
}

function buildBasement(scene) {
  const group = new THREE.Group();
  group.name = "scene-basement";
  scene.add(group);
  addRoomShell(group, 8.5, 4.2, 7.5, { floor: 0x292827, wall: 0x383735 });
  const concrete = standard(0x45423e, 0.98);
  for (const x of [-3.2, 3.2]) box(group, [0.35, 4.2, 0.35], [x, 2.1, -3.55], concrete);
  const table = new THREE.Group();
  const metal = standard(0x3d4444, 0.58, 0.45);
  box(table, [3.7, 0.14, 1.8], [0, 0.92, 0], metal);
  for (const x of [-1.55, 1.55]) for (const z of [-0.65, 0.65]) box(table, [0.12, 0.9, 0.12], [x, 0.45, z], metal);
  table.position.set(0.5, 0, 0.4);
  group.add(table);

  const bullets = [];
  for (let i = 0; i < 36; i++) {
    const bullet = bulletMesh();
    bullet.position.set(-0.8 + (i % 9) * 0.27, 1.08, -0.05 + Math.floor(i / 9) * 0.32);
    bullet.rotation.x = Math.PI / 2;
    group.add(bullet);
    bullets.push(bullet);
  }
  const zhang = createCharacter("uniform", { tone: "#ae795b", hair: "#1d2425", heightM: 1.84, name: "章北海-地下室" });
  zhang.figure.root.position.set(1.35, 0, 2.15);
  zhang.figure.root.rotation.y = Math.PI + 0.65;
  group.add(zhang.figure.root);
  const pistol = createPistol({ scope: false });
  zhang.figure.anchors.handR.add(pistol.group);

  const target = new THREE.Group();
  target.position.set(-2.35, 1.35, -2.65);
  group.add(target);
  box(target, [1.6, 2.1, 0.28], [0, 0, -0.28], standard(0x252727));
  const cloth = box(target, [1.25, 1.5, 0.45], [0, 0, 0], standard(0xa8aaa2, 0.98));
  const beef = box(target, [1.02, 1.28, 0.32], [0, 0, 0.02], standard(0x743d38, 0.92));
  beef.visible = false;
  const holes = [];
  for (let i = 0; i < 4; i++) {
    const hole = box(target, [0.075, 0.075, 0.025], [-0.3 + (i % 2) * 0.5, 0.25 - Math.floor(i / 2) * 0.48, 0.238], new THREE.MeshBasicMaterial({ color: 0x171918 }));
    hole.visible = false;
    holes.push(hole);
  }
  const fragments = [];
  for (let i = 0; i < 16; i++) {
    const f = rock(1.3, 0.018, 70 + i);
    f.position.set(0.15 + (hash(i, 2) - 0.5) * 0.55, 1.13, 0.4 + (hash(i, 3) - 0.5) * 0.45);
    f.visible = false;
    group.add(f);
    fragments.push(f);
  }

  const smoke = [];
  const smokeMaterial = new THREE.MeshBasicMaterial({ color: 0xadb2aa, transparent: true, opacity: 0.13, depthWrite: false });
  for (let i = 0; i < 14; i++) {
    const puff = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), smokeMaterial);
    group.add(puff);
    smoke.push(puff);
  }
  const ambient = new THREE.HemisphereLight(0x6c7775, 0x171411, 0.38);
  group.add(ambient);
  const bulb = new THREE.PointLight(0xffc486, 24, 10, 1.8);
  bulb.position.set(0, 3.4, 0.5);
  bulb.castShadow = true;
  bulb.shadow.mapSize.set(1024, 1024);
  group.add(bulb);
  box(group, [0.35, 0.18, 0.35], [0, 3.75, 0.5], new THREE.MeshBasicMaterial({ color: 0xffd59b }));
  const cold = new THREE.DirectionalLight(0x57727b, 0.55);
  cold.position.set(-3, 2, 3);
  group.add(cold);
  return { group, zhang, pistol, bullets, target, cloth, beef, holes, fragments, smoke, bulb };
}

function buildBase(scene) {
  const group = new THREE.Group();
  group.name = "scene-base";
  scene.add(group);
  addRoomShell(group, 7, 4.2, 6, { floor: 0x283237, wall: 0x647075 });
  const frame = standard(0x303e44, 0.46, 0.55);
  const bunk = new THREE.Group();
  box(bunk, [2.3, 0.25, 1.1], [0, 0.65, 0], frame);
  box(bunk, [2.1, 0.2, 0.95], [0, 0.85, 0], standard(0x8b9692, 0.95));
  box(bunk, [0.65, 0.18, 0.8], [-0.65, 1.02, 0], standard(0xb5b9ad, 0.98));
  bunk.position.set(-1.8, 0, -1.6);
  group.add(bunk);
  const zhang = createCharacter("uniform", { tone: "#ae795b", hair: "#1d2425", heightM: 1.84, name: "章北海-基地" });
  zhang.figure.root.position.set(0.5, 0, 0.6);
  zhang.figure.root.rotation.y = Math.PI - 0.4;
  group.add(zhang.figure.root);
  const suitClear = createCharacter("suit", { tone: "#ae795b", hair: "#1d2425", heightM: 1.84, name: "章北海-基地航天服" });
  suitClear.figure.root.position.copy(zhang.figure.root.position);
  suitClear.figure.root.rotation.copy(zhang.figure.root.rotation);
  attachPack(suitClear);
  group.add(suitClear.figure.root);
  const locator = box(group, [0.28, 0.1, 0.38], [0.2, 1.25, 0.4], standard(0x26373b, 0.35, 0.55));
  const locatorLight = new THREE.PointLight(0x63d7b0, 1.2, 1.8, 2);
  locatorLight.position.set(0, 0.1, 0);
  locator.add(locatorLight);
  box(locator, [0.12, 0.03, 0.16], [0, 0.065, 0], new THREE.MeshBasicMaterial({ color: 0x70d9b5 }));

  const hatch = new THREE.Group();
  hatch.position.set(0.8, 0, -2.88);
  group.add(hatch);
  box(hatch, [2.7, 0.22, 0.25], [0, 3.55, 0], frame);
  box(hatch, [2.7, 0.22, 0.25], [0, 0.12, 0], frame);
  for (const x of [-1.25, 1.25]) box(hatch, [0.22, 3.5, 0.25], [x, 1.82, 0], frame);
  const voidPlane = box(hatch, [2.25, 3.2, 0.05], [0, 1.82, -0.14], new THREE.MeshBasicMaterial({ color: 0x010306 }));
  const door = box(hatch, [2.25, 3.15, 0.16], [0, 1.82, 0.04], standard(0x778388, 0.45, 0.45));
  const hatchLabel = makeLabel("03  气闸", 1.3, 0.34, "#d9be79", "#27363a");
  hatchLabel.position.set(0, 3.12, 0.14);
  door.add(hatchLabel);
  const starPositions = new Float32Array(45 * 3);
  for (let i = 0; i < 45; i++) {
    starPositions[i * 3] = (hash(i, 6) - 0.5) * 2.1;
    starPositions[i * 3 + 1] = 0.35 + hash(i, 7) * 2.9;
    starPositions[i * 3 + 2] = -0.18;
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xe7eee9, size: 0.018 }));
  hatch.add(stars);
  const ambient = new THREE.HemisphereLight(0x9bb8bd, 0x162126, 0.65);
  group.add(ambient);
  const key = new THREE.PointLight(0xb5e2de, 24, 11, 1.7);
  key.position.set(0, 3.6, 1.4);
  key.castShadow = true;
  group.add(key);
  const label = makeLabel("一号基地  /  第一特遣队", 3.4, 0.5);
  label.position.set(-1.4, 3.25, -2.89);
  group.add(label);
  return { group, zhang, suitClear, locator, hatch, door, voidPlane, stars };
}

function starField(count = 1700) {
  const positions = new Float32Array(count * 3);
  const colours = new Float32Array(count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const theta = hash(i, 1) * Math.PI * 2;
    const u = hash(i, 2) * 2 - 1;
    const r = 260 + hash(i, 3) * 240;
    const s = Math.sqrt(1 - u * u);
    positions[i * 3] = Math.cos(theta) * s * r;
    positions[i * 3 + 1] = u * r;
    positions[i * 3 + 2] = Math.sin(theta) * s * r - 70;
    c.set(hash(i, 4) > 0.82 ? 0xb7d3e3 : hash(i, 5) > 0.7 ? 0xe5cda7 : 0xb9c1c5);
    colours[i * 3] = c.r;
    colours[i * 3 + 1] = c.g;
    colours[i * 3 + 2] = c.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.55, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.9, depthWrite: false }));
}

function glowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(64, 64, 3, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,241,198,1)");
  gradient.addColorStop(0.18, "rgba(255,188,95,.65)");
  gradient.addColorStop(0.5, "rgba(255,134,48,.13)");
  gradient.addColorStop(1, "rgba(255,110,30,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function stationModel() {
  const group = new THREE.Group();
  const ringGeometry = buildVoxelGeometry({
    size: [41, 41, 3],
    at(x, y, z) {
      const dx = x - 20;
      const dy = y - 20;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 16.8 || d > 20) return null;
      if (z === 1 && (x + y) % 7 === 0) return 0x89999e;
      return (x + y + z) % 5 === 0 ? 0x53656d : 0x6f8087;
    },
  }, { voxel: 1.05 });
  const ring = new THREE.Mesh(ringGeometry, voxelMaterial({ roughness: 0.55, metalness: 0.62 }));
  group.add(ring);
  const metal = standard(0x64767e, 0.52, 0.62);
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    const spoke = box(group, [17, 0.65, 0.65], [Math.cos(angle) * 8.3, Math.sin(angle) * 8.3, 0], metal);
    spoke.rotation.z = angle;
  }
  box(group, [7, 7, 5], [0, 0, 0], standard(0x829198, 0.48, 0.62));
  box(group, [3, 3, 18], [0, 0, 0], metal);
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    const module = box(group, [3.5, 2.2, 3.6], [Math.cos(a) * 19, Math.sin(a) * 19, 0], standard(i % 3 === 0 ? 0x9a8c6e : 0x89989b, 0.55, 0.45));
    module.rotation.z = a;
  }
  return group;
}

function shipyardModel() {
  const group = new THREE.Group();
  const material = standard(0x526872, 0.62, 0.65);
  for (let z = -15; z <= 15; z += 6) {
    for (const x of [-14, 14]) box(group, [0.65, 20, 0.65], [x, 0, z], material);
    for (const y of [-10, 10]) box(group, [28, 0.65, 0.65], [0, y, z], material);
    for (const x of [-14, 14]) for (const y of [-10, 10]) box(group, [0.5, 0.5, 6], [x, y, z + 3], material);
  }
  for (const x of [-14, 14]) for (const y of [-10, 10]) box(group, [0.5, 0.5, 36], [x, y, 0], material);
  return group;
}

function thrusterVapour(parent, count = 5) {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: 0xd8eeee, transparent: true, opacity: 0.32, depthWrite: false });
  const geometry = new THREE.BoxGeometry(0.13, 0.13, 0.3);
  for (let i = 0; i < count; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set((hash(i, 1) - 0.5) * 0.25, 0.9 + (hash(i, 2) - 0.5) * 0.4, -0.5 - i * 0.22);
    group.add(cube);
  }
  group.visible = false;
  parent.add(group);
  return group;
}

function buildSpace(scene) {
  const group = new THREE.Group();
  group.name = "scene-space";
  scene.add(group);
  const stars = starField();
  group.add(stars);
  const ambient = new THREE.HemisphereLight(0x28425d, 0x05080e, 0.72);
  group.add(ambient);
  const sunLight = new THREE.DirectionalLight(0xffd1a0, 3.2);
  sunLight.position.set(-65, 25, 35);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.left = -12;
  sunLight.shadow.camera.right = 12;
  sunLight.shadow.camera.top = 12;
  sunLight.shadow.camera.bottom = -12;
  group.add(sunLight);

  const earth = new THREE.Mesh(voxelSphere(25, (x, y, z) => {
    const nx = x - 25;
    const ny = y - 25;
    const nz = z - 25;
    const n = Math.sin(nx * 0.43) + Math.cos(ny * 0.37 + nz * 0.21) + Math.sin((nx + nz) * 0.24);
    const cloud = hash(Math.floor(x / 2), Math.floor(y / 2), Math.floor(z / 2));
    if (cloud > 0.89 && (y + z) % 3 !== 0) return 0xc4d3d1;
    if (n > 1.25 && Math.abs(ny) < 20) return ny > 7 ? 0x728574 : 0x7b8266;
    if (n > 0.75 && Math.abs(ny) < 18) return 0x3e716c;
    return Math.abs(ny) > 21 ? 0xb6cbcb : (y + z) % 4 === 0 ? 0x285b7a : 0x1e496d;
  }, { voxel: 1.4 }), voxelMaterial({ roughness: 0.93, metalness: 0.02 }));
  earth.position.set(-49, -26, -183);
  earth.rotation.z = -0.28;
  group.add(earth);
  const sun = new THREE.Mesh(voxelSphere(8, 0xffd19a, { voxel: 1 }), new THREE.MeshBasicMaterial({ color: 0xffd5a0 }));
  sun.position.set(-100, -6, -225);
  group.add(sun);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85 }));
  glow.position.copy(sun.position);
  glow.scale.set(70, 70, 1);
  group.add(glow);

  const station = stationModel();
  station.position.set(0, 5, -111);
  group.add(station);
  const tetherMaterial = standard(0x4a616c, 0.5, 0.72);
  box(group, [0.42, 190, 0.42], [0, -100, -111], tetherMaterial, "太空电梯缆索");
  box(group, [0.3, 58, 0.3], [0, 48, -111], tetherMaterial, "配重上方缆索");
  box(group, [5.2, 5.2, 24], [0, 3.5, -99], standard(0x526872, 0.55, 0.6), "三号气闸连接舱");
  const dock = shipyardModel();
  dock.position.set(65, 14, -144);
  dock.rotation.set(0.15, -0.25, 0.1);
  group.add(dock);
  const distantBase = stationModel();
  distantBase.scale.setScalar(0.18);
  distantBase.position.set(-65, 24, -130);
  group.add(distantBase);

  const airlock = new THREE.Group();
  airlock.position.set(0, 2.5, -87);
  group.add(airlock);
  box(airlock, [12, 8, 1.4], [0, 0, -0.8], standard(0x566b74, 0.54, 0.58));
  box(airlock, [4.8, 4.8, 0.5], [0, 0, 0], standard(0x1d2c33, 0.5, 0.5));
  const airlockDoor = box(airlock, [4.1, 4.1, 0.35], [0, 0, 0.35], standard(0x85979b, 0.5, 0.55));
  const airlockLabel = makeLabel("黄河站  ·  03", 4.6, 0.65, "#d6c68f", "#1e3037");
  airlockLabel.position.set(0, 3.25, 0.05);
  airlock.add(airlockLabel);
  const signal = new THREE.PointLight(0xe15c44, 5, 8, 2);
  signal.position.set(3.1, 1.8, 1);
  airlock.add(signal);
  box(airlock, [0.35, 0.35, 0.25], [3.1, 1.8, 0.65], new THREE.MeshBasicMaterial({ color: 0xe15c44 }));

  const zhang = createCharacter("suit", { tone: "#ae795b", hair: "#1d2425", heightM: 1.84, visor: "dark", name: "章北海-太空" });
  zhang.figure.root.position.set(0, 0, 0);
  zhang.figure.root.rotation.y = Math.PI;
  group.add(zhang.figure.root);
  attachPack(zhang, 0x718187);
  const pistol = createPistol({ scope: true });
  zhang.figure.anchors.handR.add(pistol.group);
  const zhangThrust = thrusterVapour(zhang.figure.root, 7);

  const photo = [];
  const accents = ["#a8553f", "#506f83", "#9a7a45"];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      const index = row * 7 + col;
      const target = row === 0 && col >= 2 && col <= 4;
      const person = createCharacter("suit", {
        tone: index % 3 === 0 ? "#8e5f45" : index % 3 === 1 ? "#c18b68" : "#a9795c",
        hair: index % 4 === 0 ? "#77746d" : "#292b29",
        age: target ? 1 : 0,
        heightM: 1.68 + hash(index, 9) * 0.18,
        accent: accents[row],
        visor: "dark",
        castShadow: false,
        name: target ? `目标-${col - 1}` : `合影者-${index}`,
      });
      attachPack(person, 0x7b898c);
      const base = new THREE.Vector3((col - 3) * 2.05 + (row === 1 ? 0.3 : 0), 1.2 + (2 - row) * 1.75, -70 - row * 1.8);
      person.figure.root.position.copy(base);
      group.add(person.figure.root);
      const thrust = thrusterVapour(person.figure.root, 4);
      photo.push({ person, row, col, index, target, targetIndex: target ? col - 2 : -1, base, thrust });
    }
  }

  const vapours = [];
  for (let j = 0; j < 3; j++) {
    const vapour = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: 0xe5f1ed, transparent: true, opacity: 0.52, depthWrite: false });
    const geometry = new THREE.BoxGeometry(0.11, 0.11, 0.11);
    for (let i = 0; i < 24; i++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.userData.seed = i;
      vapour.add(cube);
    }
    vapour.visible = false;
    group.add(vapour);
    vapours.push(vapour);
  }

  const flightBullets = [];
  for (let i = 0; i < 3; i++) {
    const bullet = meteorSegment();
    bullet.scale.setScalar(1.4);
    group.add(bullet);
    flightBullets.push(bullet);
  }
  const label = makeLabel("增援未来  /  01", 2.2, 0.45, "#c4d5d4", "#26363c");
  label.position.set(0, 1.4, -0.32);
  label.rotation.y = Math.PI;
  zhang.figure.root.add(label);
  return { group, stars, earth, sun, glow, sunLight, station, dock, distantBase, airlock, airlockDoor, signal, zhang, pistol, zhangThrust, photo, vapours, flightBullets };
}

function buildChamber(scene) {
  const group = new THREE.Group();
  group.name = "scene-chamber";
  scene.add(group);
  addRoomShell(group, 13, 6.5, 12, { floor: 0x17262d, wall: 0x263a42 });
  const frame = standard(0x526a72, 0.4, 0.65);
  const glass = new THREE.MeshStandardMaterial({ color: 0x8bc4ca, transparent: true, opacity: 0.14, roughness: 0.16, metalness: 0.2, depthWrite: false });
  const people = [];
  const podPositions = [];
  for (const x of [-4.3, 4.3]) {
    for (const z of [-3.8, -1.2, 1.4, 4]) podPositions.push([x, z]);
  }
  podPositions.forEach(([x, z], i) => {
    box(group, [2, 0.35, 1.7], [x, 0.18, z], frame);
    box(group, [2, 0.35, 1.7], [x, 3.65, z], frame);
    for (const dx of [-0.9, 0.9]) box(group, [0.18, 3.5, 1.7], [x + dx, 1.9, z], frame);
    box(group, [1.7, 3.25, 0.06], [x, 1.9, z + 0.82], glass);
    const person = createCharacter("uniform", { tone: i % 2 ? "#b77f5d" : "#916249", hair: "#252a29", heightM: 1.72, colour: "#35483f", castShadow: false });
    person.figure.root.position.set(x, 0.35, z);
    group.add(person.figure.root);
    pose(person, groundedPose(i, i));
    people.push(person);
    const light = new THREE.PointLight(0x7dc6ca, 2.5, 4, 2);
    light.position.set(x, 3.25, z + 0.5);
    group.add(light);
  });
  const central = new THREE.Group();
  central.position.set(0, 0, -0.5);
  group.add(central);
  box(central, [2.25, 0.4, 2], [0, 0.2, 0], frame);
  box(central, [2.25, 0.4, 2], [0, 4.15, 0], frame);
  for (const x of [-1, 1]) box(central, [0.2, 3.9, 2], [x, 2.1, 0], frame);
  const lid = box(central, [1.85, 3.65, 0.09], [0, 5.8, 0.95], glass);
  const zhang = createCharacter("uniform", { tone: "#ae795b", hair: "#1d2425", heightM: 1.84, name: "章北海-冬眠" });
  zhang.figure.root.position.set(0, 0.42, 0);
  central.add(zhang.figure.root);
  const sign = makeLabel("增援未来  ·  第一特遣队", 5.5, 0.72, "#c6d9d6", "#1d3138");
  sign.position.set(0, 5.25, -5.9);
  group.add(sign);
  const ambient = new THREE.HemisphereLight(0x7aaab5, 0x071218, 0.75);
  group.add(ambient);
  const key = new THREE.SpotLight(0xa5e1df, 55, 17, Math.PI / 4, 0.6, 1.5);
  key.position.set(0, 5.8, 4);
  key.target.position.set(0, 1.4, 0);
  key.castShadow = true;
  group.add(key, key.target);
  const warm = new THREE.PointLight(0xd8b078, 6, 8, 2);
  warm.position.set(-3, 2, 3);
  group.add(warm);
  return { group, zhang, lid, people };
}

export function buildWorld(scene) {
  return {
    home: buildHome(scene),
    workshop: buildWorkshop(scene),
    basement: buildBasement(scene),
    base: buildBase(scene),
    space: buildSpace(scene),
    chamber: buildChamber(scene),
  };
}

export const sceneGroups = (world) => ({
  home: world.home.group,
  workshop: world.workshop.group,
  basement: world.basement.group,
  base: world.base.group,
  space: world.space.group,
  chamber: world.chamber.group,
});

function updateHome(world, t) {
  const w = world.home;
  const active = t >= 14 && t < 74;
  w.zhang.figure.root.visible = active;
  w.collector.figure.root.visible = active;
  const enter = smooth(progress(t, 14, 21));
  w.zhang.figure.root.position.set(1.45 + (1 - enter) * 1.4, 0.03, 1.15 + (1 - enter) * 2.4);
  const talk = groundedPose(t, 0.4);
  talk.armR = t >= 61 && t < 65 ? [-1.12, 0.1, 0.12] : t >= 36 && t < 43 ? [-0.85, 0, 0.15] : [-0.12, 0, 0.08];
  talk.armL = [-0.18, 0, -0.09];
  talk.neck = t >= 32 && t < 34.8 ? [0.12 + Math.sin(t * 4) * 0.025, -0.12, 0] : [0, -0.12, 0];
  pose(w.zhang, talk);
  const host = groundedPose(t, 2.1);
  host.armR = t >= 32 && t < 37 ? [-1.22, -0.2, 0.2] : [-0.5 + Math.sin(t) * 0.05, 0, 0.15];
  host.armL = t >= 49 && t < 57 ? [-1.1, 0.25, -0.2] : [-0.15, 0, -0.12];
  host.neck = t >= 48 && t < 51 ? [-0.08, 0.2, Math.sin(t * 7) * 0.035] : [0.03, 0.15, 0];
  pose(w.collector, host);
  w.specimens.visible = t >= 49.5;
  w.phone.visible = t >= 61 && t < 65;
  w.briefcase.visible = !(t >= 50 && t < 61);
  w.cup.visible = t >= 31 && t < 45;
  w.dust.rotation.y = t * 0.006;
}

function updateWorkshop(world, t) {
  const w = world.workshop;
  const machining = t >= 90 && t < 109;
  w.workpiece.visible = t < 105;
  w.workpiece.rotation.x = machining ? t * 14 : 0;
  w.cutter.position.y = 2.2 - (machining ? Math.sin(t * 2.2) * 0.08 : 0.3);
  w.cutGlow.intensity = machining ? 2 + Math.sin(t * 30) : 0;
  w.sparks.forEach((spark, i) => {
    spark.visible = machining && t >= 94 && hash(i, Math.floor(t * 8)) > 0.25;
    const phase = (t * (1.3 + hash(i, 4)) + hash(i, 5)) % 1;
    spark.position.set(0.1 + (hash(i, 1) - 0.5) * phase * 2.2, 1.75 - phase * phase * 1.5, -0.4 + phase * (0.4 + hash(i, 2)));
    spark.scale.setScalar(1 - phase * 0.7);
  });
  w.segments.forEach((segment, i) => {
    segment.visible = t >= 105 + i * 0.19;
    if (segment.visible) {
      const appear = smooth(progress(t, 105 + i * 0.19, 105.5 + i * 0.19));
      segment.scale.setScalar(appear);
    }
  });
  w.rawRocks.visible = t < 100;
  const p = groundedPose(t, 1.3);
  p.armR = machining ? [-1.18, 0.15, 0.15] : [-0.65, 0, 0.1];
  p.armL = machining ? [-1.0, -0.2, -0.15] : [-0.45, 0, -0.1];
  p.neck = [0.18, -0.1, 0];
  pose(w.zhang, p);
}

function updateBasement(world, t) {
  const w = world.basement;
  w.bullets.forEach((bullet, i) => { bullet.visible = i >= Math.floor(progress(t, 122, 136) * 36); });
  const shooting = t >= 138 && t < 146;
  const p = groundedPose(t, 0.7);
  p.armR = shooting ? [-Math.PI / 2, 0, 0.06] : [-0.85, 0, 0.08];
  p.armL = shooting ? [-1.25, 0, -0.28] : [-0.65, 0, -0.12];
  p.neck = shooting ? [0.05, -0.12, 0] : [0.16, 0, 0];
  pose(w.zhang, p);
  const shotTimes = [140.1, 140.95, 141.8, 142.65];
  let flash = false;
  shotTimes.forEach((shot, i) => {
    if (t >= shot) w.holes[i].visible = true;
    else w.holes[i].visible = false;
    if (t >= shot && t < shot + 0.09) flash = true;
  });
  w.pistol.flash.visible = flash;
  w.pistol.light.intensity = flash ? 22 : 0;
  w.cloth.visible = t < 146.3;
  w.beef.visible = t >= 146.3;
  w.holes.forEach((hole) => { if (t >= 146.3) hole.visible = false; });
  w.fragments.forEach((fragment, i) => {
    fragment.visible = t >= 147.5 + i * 0.035;
    fragment.rotation.set(t * 0.1 + i, i * 0.7, 0);
  });
  w.smoke.forEach((puff, i) => {
    const age = t - 140.1 - i * 0.055;
    puff.visible = age > 0 && age < 7;
    if (puff.visible) {
      puff.position.set(0.3 + (hash(i, 3) - 0.5) * age * 0.25, 1.55 + age * (0.09 + hash(i, 2) * 0.08), 0.9 - age * 0.28 + (hash(i, 4) - 0.5) * 0.5);
      puff.scale.setScalar(0.4 + age * 0.35);
      puff.rotation.set(age * 0.2, i + age * 0.12, 0);
    }
  });
  w.bulb.intensity = flash ? 8 : 24;
}

function updateBase(world, t) {
  const w = world.base;
  const returning = t >= 277;
  const suited = t >= 164;
  w.zhang.figure.root.visible = !suited;
  w.suitClear.figure.root.visible = suited;
  const person = suited ? w.suitClear : w.zhang;
  const p = groundedPose(t, 0.2);
  p.armL = t < 164 || returning ? [-1.15, 0.1, -0.15] : [-0.2, 0, -0.1];
  p.armR = t < 164 ? [-0.8, 0, 0.15] : [-0.15, 0, 0.1];
  p.neck = [0.1, 0, 0];
  pose(person, p);
  if (returning) {
    person.figure.root.visible = true;
    person.figure.root.position.set(0.2, 0, 0.5);
    person.figure.root.rotation.y = Math.PI - 0.7;
  } else if (t >= 169) {
    const walkOut = smooth(progress(t, 174, 179));
    person.figure.root.position.z = 0.6 - walkOut * 3.1;
    person.figure.root.position.x = 0.5 + walkOut * 0.3;
    person.figure.root.visible = walkOut < 0.98;
  } else {
    person.figure.root.position.set(0.5, 0, 0.6);
  }
  if (!returning) person.figure.root.rotation.y = Math.PI + 0.45 - smooth(progress(t, 164, 174)) * 0.55;
  const remove = smooth(progress(t, 161.5, 164));
  w.locator.position.set(0.2 - remove * 1.7, 1.25 - remove * 0.18, 0.4 - remove * 1.75);
  w.locator.visible = t < 169 || returning;
  if (returning) {
    const reconnect = smooth(progress(t, 277.5, 279));
    w.locator.position.set(-1.5 + reconnect * 1.7, 1.07 + reconnect * 0.18, -1.35 + reconnect * 1.75);
  }
  w.door.position.y = 1.82 + smooth(progress(t, 169.5, 173.5)) * 3.4;
  w.stars.visible = t >= 172;
}

function updateSpace(world, t) {
  const w = world.space;
  const inSpaceEra = t < 14 || t >= 74;
  w.station.rotation.z = t * 0.004;
  w.distantBase.rotation.z = -t * 0.006;
  w.earth.rotation.y = t * 0.0015;
  const sunset = progress(t, 207, 229);
  w.sun.position.y = -6 - sunset * 18;
  w.glow.position.copy(w.sun.position);
  w.sunLight.intensity = 3.2 - sunset * 1.25;
  w.sunLight.color.setRGB(1, 0.82 - sunset * 0.18, 0.64 - sunset * 0.22);
  w.airlockDoor.position.x = smooth(progress(t, 194, 198)) * 4.6;
  w.signal.color.setHex(t >= 194 ? 0x62d897 : 0xe15c44);
  w.signal.intensity = 4 + Math.sin(t * 3);

  const coldOpen = t < 14;
  const finalEra = t >= 174;
  w.zhang.figure.root.visible = coldOpen || (finalEra && t < 277) || (t >= 300 && t < 301);
  w.zhang.setVisor(t >= 179 ? "clear" : "dark");
  w.zhang.figure.root.position.set(0, coldOpen ? 0 : Math.sin(t * 0.28) * 0.12, coldOpen ? 0 : -smooth(progress(t, 263, 277)) * 18);
  w.zhang.figure.root.rotation.set(coldOpen ? -0.12 : -0.08, coldOpen ? Math.PI - 0.35 : Math.PI + smooth(progress(t, 263, 270)) * 0.7, coldOpen ? -0.08 : Math.sin(t * 0.2) * 0.04);
  const aiming = coldOpen || (t >= 218 && t < 252);
  const spacePose = weightlessPose(t, aiming ? 1 : 0, 0.3);
  if (t >= 218 && t < 222) {
    spacePose.armL = [-1.1, 0, -0.25];
    spacePose.armR = [-0.9, 0, 0.2];
  }
  const reloading = (t >= 231.32 && t < 231.6) || (t >= 233.82 && t < 234.08);
  if (reloading) {
    spacePose.armR = [-1.12, 0, 0.12];
    spacePose.armL = [-0.55, 0, -0.5];
    spacePose.neck = [0.25, 0, 0];
  }
  pose(w.zhang, spacePose);
  w.pistol.group.visible = coldOpen || t >= 218;
  w.pistol.sight.visible = t >= 221 || coldOpen;
  const flashTimes = coldOpen ? [11.7] : volleyTimes.map((v) => v.time);
  let flash = false;
  for (const shot of flashTimes) if (t >= shot && t < shot + 0.055) { flash = true; break; }
  w.pistol.flash.visible = flash;
  w.pistol.light.intensity = flash ? 8 : 0;
  w.pistol.flash.rotation.z = t * 19;
  w.zhangThrust.visible = t >= 263 && t < 272;
  w.zhangThrust.children.forEach((cube, i) => { cube.scale.z = 0.7 + Math.sin(t * 13 + i) * 0.25; });

  const photoVisible = t >= 194 && t < 263;
  w.photo.forEach((entry) => {
    const { person, base, index, target, targetIndex, row } = entry;
    person.figure.root.visible = photoVisible;
    if (!photoVisible) return;
    const emerge = smooth(progress(t, 194 + index * 0.12, 204 + index * 0.08));
    const hatch = new THREE.Vector3((index % 3 - 1) * 0.35, 1.2 + (index % 4) * 0.3, -84.5);
    person.figure.root.position.lerpVectors(hatch, base, emerge);
    person.figure.root.rotation.set(-0.06 + Math.sin(t * 0.4 + index) * 0.04, Math.sin(index) * 0.08, Math.sin(t * 0.3 + index) * 0.05);
    if (t >= 216) person.setVisor("clear");
    else person.setVisor("dark");
    if (target && t >= impactTimes[targetIndex]) {
      person.setVisor("damaged");
      const hitAge = t - impactTimes[targetIndex];
      person.figure.root.position.x += Math.sin(hitAge * 0.8 + targetIndex) * Math.min(1, hitAge * 0.15);
      person.figure.root.position.y += Math.min(1.2, hitAge * 0.1);
      person.figure.root.rotation.z = hitAge * 0.18 * (targetIndex % 2 ? -1 : 1);
    }
    if (t >= 251.5) {
      const retreat = smooth(progress(t, 251.5 + row * 0.3, 261.5));
      const current = person.figure.root.position.clone();
      person.figure.root.position.lerpVectors(current, new THREE.Vector3((index % 5 - 2) * 0.5, 2, -87), retreat);
      person.figure.root.rotation.y = retreat * Math.PI;
      entry.thrust.visible = retreat < 0.98;
    } else {
      entry.thrust.visible = t >= 194 && t < 204 + index * 0.08;
    }
    const drift = weightlessPose(t, 0, index * 0.37);
    if (t >= 215 && t < 247) {
      drift.armR = [-0.3 + Math.sin(index) * 0.2, 0, 0.2];
      drift.armL = [-0.25, 0, -0.2];
      drift.legR = [-0.08, 0, 0.05];
      drift.legL = [0.05, 0, -0.05];
    }
    if (target && t >= impactTimes[targetIndex]) {
      drift.armR = [-1.1, 0, 0.5];
      drift.armL = [-0.8, 0, -0.5];
    }
    pose(person, drift);
    entry.thrust.children.forEach((cube, i) => { cube.scale.z = 0.8 + Math.sin(t * 12 + i + index) * 0.25; });
  });

  w.vapours.forEach((vapour, j) => {
    const age = t - impactTimes[j];
    vapour.visible = photoVisible && age >= 0 && age < 5;
    if (!vapour.visible) return;
    const target = w.photo.find((entry) => entry.targetIndex === j);
    vapour.position.copy(target.person.figure.root.position);
    vapour.position.y += 1.25;
    vapour.children.forEach((cube, i) => {
      const a = hash(i, j) * Math.PI * 2;
      const speed = 0.3 + hash(i, j + 3) * 0.75;
      cube.position.set(Math.cos(a) * age * speed * 0.3, (hash(i, 8) - 0.5) * age * 0.5, age * speed);
      cube.scale.setScalar(Math.max(0.05, 1 - age / 5) * (0.5 + hash(i, 9)));
      cube.rotation.set(age + i, age * 0.5, i);
    });
  });

  w.flightBullets.forEach((bullet, i) => {
    const start = 236.5 + i * 0.16;
    const end = impactTimes[i];
    bullet.visible = t >= start && t < end;
    if (bullet.visible) {
      const p = progress(t, start, end);
      const target = w.photo.find((entry) => entry.targetIndex === i);
      bullet.position.lerpVectors(new THREE.Vector3(0, 1.2, -1), target.base.clone().add(new THREE.Vector3(0, 1.25, 0)), p);
      bullet.rotation.set(Math.PI / 2, 0, t * 0.7);
    }
  });
  w.dock.visible = inSpaceEra;
}

function updateChamber(world, t) {
  const w = world.chamber;
  const p = groundedPose(t, 0.5);
  p.armR = [-0.08, 0, 0.04];
  p.armL = [-0.08, 0, -0.04];
  p.neck = [0, 0, 0];
  pose(w.zhang, p);
  w.lid.position.y = 5.8 - smooth(progress(t, 294.5, 297.5)) * 3.8;
  w.zhang.setEyesClosed(t >= 297.2);
  w.people.forEach((person, i) => {
    const ip = groundedPose(t * 0.3, i);
    ip.neck = [0, 0, 0];
    pose(person, ip);
  });
}

export function updateWorld(world, t) {
  updateHome(world, t);
  updateWorkshop(world, t);
  updateBasement(world, t);
  updateBase(world, t);
  updateSpace(world, t);
  updateChamber(world, t);
}

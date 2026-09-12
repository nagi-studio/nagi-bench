import * as THREE from "three";
import {
  applyPose,
  createFigure,
  voxelMaterial,
  voxelTerrain,
  type Figure,
} from "@agentbench/voxel-kit";
import type { Skin } from "@agentbench/voxel-kit";
import {
  ACCENTS,
  collectorBody,
  collectorClothes,
  officerBody,
  spacesuit,
  zhangBody,
  zhangUniform,
} from "./skins";
import {
  brickColour,
  makeBase,
  makeEarth,
  makeMeteorite,
  makeShipyard,
  makeStars,
  makeStation,
  makeSun,
  meshOf,
  voxelBox,
  woodColour,
} from "./geom";
import {
  makeBeef,
  makeBullet,
  makeCabinet,
  makeChair,
  makeClothBag,
  makeCnc,
  makeCup,
  makeCylinder,
  makeGlove,
  makeLantern,
  makeMagnifier,
  makeMicroscope,
  makePhone,
  makePistol,
  makeSafe,
  makeScope,
  makeTeaTable,
  makeTree,
  makeWorkbench,
} from "./props";
import { idle } from "./poses";

export type EnvName = "void" | "courtyard" | "interior" | "workshop" | "basement" | "space";

export interface Actor {
  figure: Figure;
  body: Skin;
  clothes: Skin;
  suitDark?: Skin;
  suitClear?: Skin;
  suitBlood?: Skin;
  visor: "dark" | "clear" | "blood" | "none";
}

export interface World {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  hemi: THREE.HemisphereLight;
  stars: THREE.Points;
  groups: Record<EnvName, THREE.Group>;
  zhang: Actor;
  collector: Actor;
  astronauts: Actor[];
  env: EnvName;
  heroMeteor: THREE.Mesh;
  earth: THREE.Mesh;
  sun: THREE.Mesh;
  station: THREE.Mesh;
  hatch: THREE.Mesh;
  hatchLight: THREE.PointLight;
  shipyard: THREE.Mesh;
  base: THREE.Mesh;
  cable: THREE.Mesh;
  debris: THREE.Group;
  sunLight: THREE.DirectionalLight;
  earthGlow: THREE.PointLight;
  gantry: THREE.Object3D;
  spindle: THREE.Object3D;
  cncStock: THREE.Mesh;
  cylinders: THREE.Group;
  bullets: THREE.Group;
  cloth: THREE.Mesh;
  beef: THREE.Mesh;
  fragments: THREE.Group;
  smoke: THREE.InstancedMesh;
  sparks: THREE.InstancedMesh;
  tracers: THREE.InstancedMesh;
  gas: THREE.InstancedMesh;
  ice: THREE.InstancedMesh;
  muzzle: THREE.PointLight;
  muzzleFlash: THREE.Mesh;
  bulb: THREE.PointLight;
  props: {
    pistol: THREE.Mesh;
    pistol2: THREE.Mesh;
    scope: THREE.Mesh;
    cup: THREE.Mesh;
    cup2: THREE.Mesh;
    phone: THREE.Mesh;
    magnifier: THREE.Mesh;
    glove: THREE.Mesh;
    tableMeteors: THREE.Mesh[];
    handMeteor: THREE.Mesh;
    iron: THREE.Mesh[];
  };
}

function addShadow(root: THREE.Object3D, cast = true, receive = true): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = cast;
      mesh.receiveShadow = receive;
    }
  });
}

function makeActor(
  body: Skin,
  clothes: Skin,
  height: number,
  arm: "classic" | "slim" = "classic",
): Actor {
  const figure = createFigure({
    body: body.texture,
    clothes: clothes.texture,
    heightM: height,
    arm,
    castShadow: true,
  });
  applyPose(figure, idle(0));
  return { figure, body, clothes, visor: "none" };
}

function buildCourtyard(): THREE.Group {
  const g = new THREE.Group();
  const ground = meshOf(
    voxelTerrain(
      38,
      38,
      (x, z) => ((x + z) % 7 === 0 ? 2 : 1),
      (x, y, z, top) => (top ? brickColour(x, y, z, 0x6a5e52) : 0x3a342e),
      { voxel: 0.42, anchor: "min" },
    ),
  );
  ground.position.set(-8, -0.42, -8);
  g.add(ground);

  const north = meshOf(
    voxelBox(22, 14, 10, (x, y, z) => {
      if (y > 9) {
        const roof = 13 - Math.abs(z - 5);
        if (y > roof) return null;
        return 0x3a2a24;
      }
      if (z > 1 && z < 8 && y > 1 && y < 9 && x > 1 && x < 20) {
        if (x === 10 && y < 8 && z > 7) return null;
        return null;
      }
      if (x === 10 && y < 8 && z >= 8) return null;
      return brickColour(x, y, z, 0x8a6a55);
    }, { voxel: 0.32, anchor: "min" }),
  );
  north.position.set(-3.4, 0, -7.4);
  g.add(north);

  const south = meshOf(
    voxelBox(36, 12, 2, (x, y, z) => {
      const cx = x - 18;
      const cy = y - 5;
      if (cx * cx * 0.65 + cy * cy < 14 && y > 0 && y < 10) return null;
      if (y > 9) return 0x3a2a24;
      return brickColour(x, y, z, 0x7a6456);
    }, { voxel: 0.42, anchor: "min" }),
  );
  south.position.set(-7.6, 0, 6.6);
  g.add(south);

  const east = meshOf(
    voxelBox(2, 11, 28, (x, y, z) => {
      if (y > 8) return 0x3a2a24;
      if (x === 1 && (z % 6 === 2) && y > 3 && y < 7) return 0x1a120c;
      return brickColour(x, y, z, 0x7a6456);
    }, { voxel: 0.42, anchor: "min" }),
  );
  east.position.set(6.8, 0, -6.2);
  g.add(east);

  const west = east.clone();
  west.position.set(-8.2, 0, -6.2);
  g.add(west);

  const vat = meshOf(
    voxelBox(5, 3, 5, (x, y, z) => {
      const cx = x - 2;
      const cz = z - 2;
      if (cx * cx + cz * cz > 5.6) return null;
      if (y === 2 && cx * cx + cz * cz < 2.2) return 0x3a5a68;
      return 0x5a5048;
    }, { voxel: 0.18, anchor: "min" }),
  );
  vat.position.set(-0.4, 0, 0.2);
  g.add(vat);

  const treeL = makeTree();
  treeL.position.set(-5.2, 0, -3.4);
  const treeR = makeTree();
  treeR.position.set(4.6, 0, -2.8);
  g.add(treeL, treeR);

  const lantern1 = makeLantern();
  lantern1.position.set(-2.4, 2.1, -4.6);
  const lantern2 = makeLantern();
  lantern2.position.set(2.2, 2.1, -4.6);
  const lantern3 = makeLantern();
  lantern3.position.set(0, 1.7, 5.4);
  g.add(lantern1, lantern2, lantern3);

  const keyLight = new THREE.SpotLight(0xffc48a, 18, 28, 0.7, 0.45, 1.2);
  keyLight.position.set(-2.5, 6.5, 4);
  keyLight.target.position.set(0, 0.8, -1);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  g.add(keyLight, keyLight.target);
  const fill = new THREE.PointLight(0xff8a4a, 6, 14, 1.6);
  fill.position.set(0, 2.2, -4.4);
  const moon = new THREE.DirectionalLight(0x6a88bb, 0.35);
  moon.position.set(4, 8, 6);
  g.add(fill, moon);
  addShadow(g);
  return g;
}

function buildInterior(): THREE.Group {
  const g = new THREE.Group();
  const room = meshOf(
    voxelBox(42, 16, 34, (x, y, z) => {
      const wall = x === 0 || x === 41 || z === 0 || z === 33 || y === 0 || y === 15;
      if (!wall) return null;
      if (z === 33 && x > 17 && x < 25 && y > 0 && y < 11) return null;
      if (y === 0) return woodColour(x, y, z, 0x4a3020);
      if (y === 15) return 0x3a2a20;
      if ((x === 0 || x === 41) && y > 4 && y < 10 && z % 8 === 4) return 0x1a120c;
      return brickColour(x, y, z, 0x6a5346);
    }, { voxel: 0.22, anchor: "min" }),
  );
  room.position.set(-4.6, 0, -3.8);
  g.add(room);

  for (let i = 0; i < 4; i++) {
    const cab = makeCabinet();
    cab.position.set(-3.9, 0, -2.4 + i * 1.35);
    cab.rotation.y = Math.PI / 2;
    g.add(cab);
    const cab2 = makeCabinet();
    cab2.position.set(3.3, 0, -2.4 + i * 1.35);
    cab2.rotation.y = -Math.PI / 2;
    g.add(cab2);
  }

  const bench = makeWorkbench();
  bench.position.set(1.4, 0, -3.2);
  g.add(bench);
  const scope = makeMicroscope();
  scope.position.set(2.4, 0.78, -2.7);
  g.add(scope);
  const table = makeTeaTable();
  table.position.set(-0.9, 0, 0.15);
  g.add(table);
  const chair1 = makeChair();
  chair1.position.set(-0.55, 0, 1.15);
  const chair2 = makeChair();
  chair2.position.set(0.15, 0, -0.55);
  chair2.rotation.y = Math.PI;
  g.add(chair1, chair2);
  const safe = makeSafe();
  safe.position.set(3.15, 0, -3.15);
  g.add(safe);

  const lamp = makeLantern();
  lamp.position.set(-0.4, 2.55, 0.5);
  g.add(lamp);
  const lamp2 = makeLantern();
  lamp2.position.set(2.2, 1.55, -2.6);
  g.add(lamp2);

  const key = new THREE.SpotLight(0xffd2a0, 12, 16, 0.55, 0.5, 1.1);
  key.position.set(-1.5, 3.1, 2.6);
  key.target.position.set(0.2, 0.9, 0.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  const cabinetLight = new THREE.PointLight(0xffe6b0, 4.5, 8, 1.8);
  cabinetLight.position.set(-3.2, 1.6, 0);
  const cabinetLight2 = new THREE.PointLight(0xffe6b0, 4.5, 8, 1.8);
  cabinetLight2.position.set(3.1, 1.6, 0);
  const warm = new THREE.PointLight(0xff9a4a, 3.2, 7, 1.6);
  warm.position.set(-0.3, 2.4, 0.5);
  g.add(key, key.target, cabinetLight, cabinetLight2, warm);
  addShadow(g);
  return g;
}

function buildWorkshop(): THREE.Group {
  const g = new THREE.Group();
  const hall = meshOf(
    voxelBox(48, 18, 32, (x, y, z) => {
      const wall = x === 0 || x === 47 || z === 0 || z === 31 || y === 0 || y === 17;
      if (!wall) return null;
      if (y === 0) return 0x3a4048;
      if (y === 17) return 0x2a3038;
      if ((z === 0 || z === 31) && y > 6 && y < 12 && x % 8 > 2 && x % 8 < 6) return 0x1a2430;
      return 0x4a5560;
    }, { voxel: 0.28, anchor: "min" }),
  );
  hall.position.set(-6.6, 0, -4.4);
  g.add(hall);

  const cnc = makeCnc();
  cnc.name = "cnc";
  cnc.position.set(-1.1, 0, -0.6);
  g.add(cnc);

  const rack = meshOf(
    voxelBox(2, 10, 12, (x, y, z) => {
      if (x === 0 || y % 3 === 0 || z % 3 === 0) return 0x5a6570;
      return null;
    }, { voxel: 0.12, anchor: "min" }),
  );
  rack.position.set(-5.2, 0, -1.6);
  g.add(rack);

  const fill = new THREE.PointLight(0xc8e0ff, 9, 16, 1.15);
  fill.position.set(1.5, 3.4, 2);
  fill.castShadow = true;
  const strip = new THREE.SpotLight(0xe8f2ff, 16, 18, 0.85, 0.6, 1.1);
  strip.position.set(0, 4.6, 0.2);
  strip.target.position.set(0, 0, 0);
  const cool = new THREE.DirectionalLight(0x7aa0c4, 0.4);
  cool.position.set(4, 6, 3);
  g.add(fill, strip, strip.target, cool);
  addShadow(g);
  return g;
}

function buildBasement(): THREE.Group {
  const g = new THREE.Group();
  const room = meshOf(
    voxelBox(28, 12, 22, (x, y, z) => {
      const wall = x === 0 || x === 27 || z === 0 || z === 21 || y === 0 || y === 11;
      if (!wall) return null;
      if (y === 0) return 0x3a3a38;
      if (x === 27 && y > 2 && y < 11 && z > 14 && z < 20) return y % 2 === 0 ? 0x2a2a28 : 0x4a4a46;
      return brickColour(x, y, z, 0x4a4c48);
    }, { voxel: 0.22, anchor: "min" }),
  );
  room.position.set(-3.1, 0, -2.4);
  g.add(room);

  const table = meshOf(
    voxelBox(10, 6, 5, (x, y, z) => {
      if (y >= 5) return 0x3a342e;
      if ((x < 1 || x > 8) && (z < 1 || z > 3)) return 0x2a2622;
      return y === 0 ? 0x2a2622 : null;
    }, { voxel: 0.1, anchor: "min" }),
  );
  table.position.set(-0.7, 0, -0.3);
  g.add(table);

  const stairs = meshOf(
    voxelBox(4, 10, 8, (x, y, z) => {
      if (y <= z) return 0x4a4c48;
      return null;
    }, { voxel: 0.2, anchor: "min" }),
  );
  stairs.position.set(2.2, 0, 1.4);
  g.add(stairs);

  const bulb = new THREE.PointLight(0xffe0a8, 10, 9, 1.4);
  bulb.position.set(0.15, 2.35, 0.2);
  bulb.castShadow = true;
  bulb.name = "bulb";
  const rim = new THREE.PointLight(0x4a6080, 1.8, 8, 2);
  rim.position.set(-2.2, 1.2, 1.6);
  g.add(bulb, rim);
  addShadow(g);
  return g;
}

function buildSpace(): THREE.Group {
  const g = new THREE.Group();
  const earth = makeEarth();
  earth.position.set(18, -28, -70);
  earth.rotation.z = 0.4;
  earth.name = "earth";
  const sun = makeSun();
  sun.position.set(34, -18, -96);
  sun.name = "sun";
  const station = makeStation();
  station.position.set(0, 7.2, -52);
  station.name = "station";
  const hatch = meshOf(
    voxelBox(5, 5, 1, 0x9aa4b0, { voxel: 0.22, anchor: "center" }),
    voxelMaterial({ roughness: 0.3, metalness: 0.6 }),
  );
  hatch.position.set(0, 7.2, -44.6);
  hatch.name = "hatch";
  const hatchLight = new THREE.PointLight(0xff4a3a, 0, 8, 1.4);
  hatchLight.position.set(0, 7.2, -44.2);
  hatchLight.name = "hatchLight";
  const shipyard = makeShipyard();
  shipyard.name = "shipyard";
  shipyard.position.set(-38, 6, -88);
  shipyard.rotation.y = 0.4;
  const base = makeBase();
  base.name = "base";
  base.position.set(22, 4, -74);
  const cable = meshOf(
    voxelBox(1, 1, 90, 0x8a93a0, { voxel: 0.18, anchor: "center" }),
    voxelMaterial({ roughness: 0.35, metalness: 0.55 }),
  );
  cable.name = "cable";
  cable.position.set(6, -10, -60);
  cable.lookAt(earth.position);

  const debris = new THREE.Group();
  debris.name = "debris";
  for (let i = 0; i < 18; i++) {
    const s = 0.18 + (i % 5) * 0.08;
    const box = meshOf(voxelBox(2 + (i % 3), 1 + (i % 2), 3, i % 2 ? 0x6a7380 : 0x4a5560, { voxel: s }));
    box.position.set(((i * 7) % 23) - 11, ((i * 5) % 13) - 4, -20 - (i * 3) % 30);
    box.rotation.set(i, i * 0.4, i * 0.2);
    debris.add(box);
  }

  const sunLight = new THREE.DirectionalLight(0xffd4a0, 2.4);
  sunLight.position.copy(sun.position);
  sunLight.name = "sunLight";
  const earthGlow = new THREE.PointLight(0x4a80c8, 18, 80, 1.1);
  earthGlow.position.set(18, -20, -60);
  earthGlow.name = "earthGlow";
  const stationLight = new THREE.PointLight(0xe8f0ff, 8, 22, 1.4);
  stationLight.position.set(0, 7.2, -50);
  const rim = new THREE.DirectionalLight(0x6a9ad0, 0.35);
  rim.position.set(-20, 12, 10);

  g.add(earth, sun, station, hatch, hatchLight, shipyard, base, cable, debris, sunLight, earthGlow, stationLight, rim);
  return g;
}

function instancedCubes(count: number, size: number, color: number): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false }),
    count,
  );
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.count = 0;
  return mesh;
}

export function createWorld(container: HTMLElement): World {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050308);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.08, 600);
  camera.position.set(0, 1.4, 4);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xffe6c4, 0x2a1810, 0.35);
  scene.add(hemi);
  const stars = makeStars();
  scene.add(stars);

  const groups: Record<EnvName, THREE.Group> = {
    void: new THREE.Group(),
    courtyard: buildCourtyard(),
    interior: buildInterior(),
    workshop: buildWorkshop(),
    basement: buildBasement(),
    space: buildSpace(),
  };
  for (const group of Object.values(groups)) {
    group.visible = false;
    scene.add(group);
  }

  const heroMeteor = makeMeteorite(7, 0.09, 2);
  heroMeteor.position.set(0, 0, 0);
  groups.void.add(heroMeteor);
  const voidLight = new THREE.DirectionalLight(0xffd4a8, 2.2);
  voidLight.position.set(4, 2, 6);
  const voidRim = new THREE.DirectionalLight(0x6a90c8, 0.7);
  voidRim.position.set(-5, -1, -3);
  groups.void.add(voidLight, voidRim);

  const zhang = makeActor(zhangBody(), zhangUniform(), 1.82);
  const collector = makeActor(collectorBody(), collectorClothes(), 1.7, "slim");
  zhang.suitDark = spacesuit("dark", "#2a4a7a");
  zhang.suitClear = spacesuit("clear", "#2a4a7a");
  const astronauts: Actor[] = [];
  for (let i = 0; i < 11; i++) {
    const accent = ACCENTS[i % ACCENTS.length]!;
    const actor = makeActor(officerBody(i + 3, i < 3 ? "calm" : "soft"), spacesuit("dark", accent), 1.68 + (i % 5) * 0.03);
    actor.suitDark = spacesuit("dark", accent);
    actor.suitClear = spacesuit("clear", accent);
    actor.suitBlood = spacesuit("blood", accent);
    actor.visor = "dark";
    astronauts.push(actor);
    groups.space.add(actor.figure.root);
    actor.figure.root.visible = false;
  }

  const pistol = makePistol();
  const muzzleFlash = meshOf(
    voxelBox(2, 2, 2, 0xffe08a, { voxel: 0.9 }),
    voxelMaterial({ roughness: 1, metalness: 0, emissive: 0xffcc77, emissiveIntensity: 3.5 }),
  );
  muzzleFlash.position.set(0, 0.2, 5.4);
  muzzleFlash.visible = false;
  pistol.add(muzzleFlash);
  const pistol2 = makePistol();
  const scope = makeScope();
  const cup = makeCup();
  const cup2 = makeCup();
  const phone = makePhone();
  const magnifier = makeMagnifier();
  const glove = makeGlove();
  zhang.figure.anchors.handR.add(pistol, pistol2, cup, phone, glove);
  zhang.figure.anchors.handL.add(scope);
  collector.figure.anchors.handR.add(magnifier);
  collector.figure.anchors.handL.add(cup2);
  pistol.visible = false;
  pistol2.visible = false;
  scope.visible = false;
  cup.visible = false;
  phone.visible = false;
  glove.visible = false;
  magnifier.visible = false;
  cup2.visible = false;

  const tableMeteors = [0, 1, 2, 3, 4, 5].map((i) => {
    const m = makeMeteorite(3 + (i % 3), 0.045, i + 4);
    m.scale.setScalar(0.35 + (i % 3) * 0.08);
    groups.interior.add(m);
    return m;
  });
  const handMeteor = makeMeteorite(4, 0.05, 9);
  handMeteor.scale.setScalar(0.25);
  collector.figure.anchors.handL.add(handMeteor);
  handMeteor.visible = false;
  const iron = [0, 1, 2].map((i) => {
    const m = makeMeteorite(4, 0.055, 20 + i);
    m.scale.setScalar(0.4);
    groups.interior.add(m);
    return m;
  });

  const cnc = groups.workshop.getObjectByName("cnc") as THREE.Group;
  const gantry = cnc.getObjectByName("gantry") ?? new THREE.Object3D();
  const spindle = cnc.getObjectByName("spindle") ?? new THREE.Object3D();
  const cncStock = makeMeteorite(5, 0.07, 12);
  cncStock.scale.setScalar(0.7);
  cncStock.position.set(0.2, 0.52, 0.15);
  groups.workshop.add(cncStock);
  const cylinders = new THREE.Group();
  for (let i = 0; i < 24; i++) {
    const c = makeCylinder();
    c.position.set(-0.8 + (i % 8) * 0.12, 0.48, 1.1 + Math.floor(i / 8) * 0.12);
    c.visible = false;
    cylinders.add(c);
  }
  groups.workshop.add(cylinders);

  const bullets = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    const b = makeBullet();
    b.rotation.x = Math.PI / 2;
    b.position.set(-0.35 + (i % 8) * 0.09, 0.64, -0.05 + Math.floor(i / 8) * 0.12);
    bullets.add(b);
  }
  groups.basement.add(bullets);
  const cloth = makeClothBag();
  cloth.position.set(-1.6, 0, 1.35);
  cloth.rotation.y = 0.4;
  groups.basement.add(cloth);
  const beef = makeBeef();
  beef.position.set(-1.45, 0.32, 1.48);
  beef.visible = false;
  groups.basement.add(beef);
  const fragments = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const f = makeMeteorite(2, 0.03, 30 + i);
    f.scale.setScalar(0.12);
    fragments.add(f);
  }
  fragments.visible = false;
  groups.basement.add(fragments);

  const smoke = instancedCubes(40, 0.12, 0x889090);
  const sparks = instancedCubes(28, 0.035, 0xffd27a);
  const tracers = instancedCubes(30, 0.05, 0xfff2c4);
  const gas = instancedCubes(48, 0.18, 0xe8f2f8);
  const ice = instancedCubes(36, 0.07, 0xd06070);
  groups.basement.add(smoke);
  groups.workshop.add(sparks);
  groups.space.add(tracers, gas, ice);

  const muzzle = new THREE.PointLight(0xffc070, 0, 6, 2);
  muzzle.name = "muzzle";
  scene.add(muzzle);

  const world: World = {
    scene,
    camera,
    renderer,
    hemi,
    stars,
    groups,
    zhang,
    collector,
    astronauts,
    env: "void",
    heroMeteor,
    earth: groups.space.getObjectByName("earth") as THREE.Mesh,
    sun: groups.space.getObjectByName("sun") as THREE.Mesh,
    station: groups.space.getObjectByName("station") as THREE.Mesh,
    hatch: groups.space.getObjectByName("hatch") as THREE.Mesh,
    hatchLight: groups.space.getObjectByName("hatchLight") as THREE.PointLight,
    shipyard: groups.space.getObjectByName("shipyard") as THREE.Mesh,
    base: groups.space.getObjectByName("base") as THREE.Mesh,
    cable: groups.space.getObjectByName("cable") as THREE.Mesh,
    debris: groups.space.getObjectByName("debris") as THREE.Group,
    sunLight: groups.space.getObjectByName("sunLight") as THREE.DirectionalLight,
    earthGlow: groups.space.getObjectByName("earthGlow") as THREE.PointLight,
    gantry,
    spindle,
    cncStock,
    cylinders,
    bullets,
    cloth,
    beef,
    fragments,
    smoke,
    sparks,
    tracers,
    gas,
    ice,
    muzzle,
    muzzleFlash,
    bulb: groups.basement.getObjectByName("bulb") as THREE.PointLight,
    props: { pistol, pistol2, scope, cup, cup2, phone, magnifier, glove, tableMeteors, handMeteor, iron },
  };
  groups.interior.add(zhang.figure.root, collector.figure.root);
  return world;
}

export function activate(world: World, env: EnvName): void {
  world.env = env;
  for (const [name, group] of Object.entries(world.groups)) {
    group.visible = name === env;
  }
  world.stars.visible = env === "void" || env === "space";
  world.scene.fog = null;
  world.renderer.shadowMap.enabled = env !== "space" && env !== "void";
  world.muzzle.intensity = 0;

  if (env === "void") {
    world.scene.background = new THREE.Color(0x030308);
    world.hemi.color.set(0x8899bb);
    world.hemi.groundColor.set(0x050508);
    world.hemi.intensity = 0.12;
    world.renderer.toneMappingExposure = 1.12;
  } else if (env === "courtyard") {
    world.scene.background = new THREE.Color(0x1a1210);
    world.scene.fog = new THREE.Fog(0x1a1210, 12, 28);
    world.hemi.color.set(0xffd2a8);
    world.hemi.groundColor.set(0x2a1810);
    world.hemi.intensity = 0.32;
    world.renderer.toneMappingExposure = 0.98;
    world.groups.courtyard.add(world.zhang.figure.root);
    world.zhang.figure.setClothes(world.zhang.clothes.texture);
    world.collector.figure.root.visible = false;
  } else if (env === "interior") {
    world.scene.background = new THREE.Color(0x120e0c);
    world.scene.fog = new THREE.Fog(0x120e0c, 8, 16);
    world.hemi.color.set(0xffe0b8);
    world.hemi.groundColor.set(0x2a1810);
    world.hemi.intensity = 0.22;
    world.renderer.toneMappingExposure = 0.92;
    world.groups.interior.add(world.zhang.figure.root, world.collector.figure.root);
    world.zhang.figure.setClothes(world.zhang.clothes.texture);
    world.zhang.figure.root.visible = true;
    world.collector.figure.root.visible = true;
  } else if (env === "workshop") {
    world.scene.background = new THREE.Color(0x0c1218);
    world.scene.fog = new THREE.Fog(0x0c1218, 10, 22);
    world.hemi.color.set(0xc0d4e8);
    world.hemi.groundColor.set(0x10141a);
    world.hemi.intensity = 0.28;
    world.renderer.toneMappingExposure = 1.02;
    world.groups.workshop.add(world.zhang.figure.root);
    world.zhang.figure.setClothes(world.zhang.clothes.texture);
    world.collector.figure.root.visible = false;
  } else if (env === "basement") {
    world.scene.background = new THREE.Color(0x080808);
    world.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.08);
    world.hemi.color.set(0xe8d0a8);
    world.hemi.groundColor.set(0x10100c);
    world.hemi.intensity = 0.08;
    world.renderer.toneMappingExposure = 0.86;
    world.groups.basement.add(world.zhang.figure.root);
    world.zhang.figure.setClothes(world.zhang.clothes.texture);
    world.collector.figure.root.visible = false;
  } else {
    world.scene.background = new THREE.Color(0x020208);
    world.hemi.color.set(0x8899bb);
    world.hemi.groundColor.set(0x04040a);
    world.hemi.intensity = 0.08;
    world.renderer.toneMappingExposure = 1.18;
    world.groups.space.add(world.zhang.figure.root);
    if (world.zhang.suitDark) world.zhang.figure.setClothes(world.zhang.suitDark.texture);
    world.zhang.figure.root.visible = true;
    world.collector.figure.root.visible = false;
    for (const astro of world.astronauts) astro.figure.root.visible = true;
  }
}

export function setVisor(actor: Actor, visor: Actor["visor"]): void {
  if (actor.visor === visor) return;
  actor.visor = visor;
  if (visor === "clear" && actor.suitClear) actor.figure.setClothes(actor.suitClear.texture);
  else if (visor === "blood" && actor.suitBlood) actor.figure.setClothes(actor.suitBlood.texture);
  else if (visor === "dark" && actor.suitDark) actor.figure.setClothes(actor.suitDark.texture);
}

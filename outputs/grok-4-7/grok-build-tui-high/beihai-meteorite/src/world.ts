import * as THREE from "three";
import type { Figure } from "@agentbench/voxel-kit";
import { buildVoxelGeometry } from "@agentbench/voxel-kit";
import {
  CREW_HEIGHTS,
  createCast,
  createCrewLook,
  makeCrewFigure,
  type Cast,
  type CrewLook,
} from "./cast";
import {
  atmoGeo,
  atmoMat,
  beefGeo,
  block,
  cameraGeo,
  cloudGeo,
  crumbGeo,
  cupGeo,
  cylinderGeo,
  earthGeo,
  gloveGeo,
  heroIronGeo,
  ironGeo,
  knifeGeo,
  labelTexture,
  magnifierGeo,
  matte,
  metal,
  packGeo,
  pane,
  phoneGeo,
  pistolGeo,
  plumeGeo,
  rockGeo,
  roundGeo,
  scopeGeo,
  stoneHandGeo,
  sunGeo,
  sunMat,
  wheelGeo,
} from "./geom";

export interface CrewMember {
  fig: Figure;
  index: number;
  home: THREE.Vector3;
  role: "target" | "extra" | "photo";
  look: CrewLook;
  phase: number;
  plume: THREE.Object3D;
  height: number;
}

export interface Puff {
  mesh: THREE.Mesh;
  index: number;
  dir: THREE.Vector3;
  speed: number;
  kind: "vapor" | "blood";
}

export interface World {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  key: THREE.DirectionalLight;
  fill: THREE.DirectionalLight;
  ambient: THREE.AmbientLight;
  hemi: THREE.HemisphereLight;
  fog: THREE.FogExp2;
  bg: THREE.Color;
  c1: THREE.Color;
  c2: THREE.Color;
  scope: THREE.Mesh;
  scopeMat: THREE.ShaderMaterial;
  cast: Cast;
  title: {
    root: THREE.Group;
    rock: THREE.Mesh;
    card: THREE.Mesh;
  };
  house: {
    root: THREE.Group;
    lanterns: THREE.PointLight[];
    irons: THREE.Mesh[];
    handStone: THREE.Mesh;
    handCup: THREE.Mesh;
    tableCup: THREE.Mesh;
    phone: THREE.Mesh;
    glass: THREE.Mesh;
  };
  shop: {
    root: THREE.Group;
    gantry: THREE.Mesh;
    spindle: THREE.Mesh;
    chuck: THREE.Mesh;
    cylinders: THREE.Mesh[];
    lights: THREE.PointLight[];
  };
  pit: {
    root: THREE.Group;
    bulb: THREE.PointLight;
    muzzle: THREE.PointLight;
    clothL: THREE.Mesh;
    clothR: THREE.Mesh;
    beef: THREE.Mesh;
    holes: THREE.Mesh[];
    knife: THREE.Mesh;
    crumbs: THREE.Mesh;
    pistol: THREE.Mesh;
    smoke: THREE.Mesh[];
  };
  space: {
    root: THREE.Group;
    earth: THREE.Mesh;
    clouds: THREE.Mesh;
    atmo: THREE.Mesh;
    sun: THREE.Mesh;
    station: THREE.Group;
    door: THREE.Mesh;
    lamp: THREE.MeshStandardMaterial;
    crewRoot: THREE.Group;
    crew: CrewMember[];
    commuters: Figure[];
    debris: THREE.Mesh[];
    pistol: THREE.Mesh;
    scope: THREE.Mesh;
    glove: THREE.Mesh;
    muzzle: THREE.PointLight;
    bullets: THREE.Mesh[];
    puffs: Puff[];
    baseLight: THREE.MeshStandardMaterial;
  };
}

const UNIT = new THREE.BoxGeometry(1, 1, 1);

function glow(
  parent: THREE.Object3D,
  pos: [number, number, number],
  color: number,
  size: number,
): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1.5,
    roughness: 0.35,
  });
  const mesh = new THREE.Mesh(UNIT, mat);
  mesh.scale.setScalar(size);
  mesh.position.set(pos[0], pos[1], pos[2]);
  parent.add(mesh);
  return mat;
}

function point(
  parent: THREE.Object3D,
  pos: [number, number, number],
  color: number,
  intensity: number,
  distance = 8,
): THREE.PointLight {
  const light = new THREE.PointLight(color, intensity, distance, 2);
  light.position.set(pos[0], pos[1], pos[2]);
  parent.add(light);
  return light;
}

function mountPx(mesh: THREE.Object3D, anchor: THREE.Object3D, x: number, y: number, z: number): void {
  anchor.add(mesh);
  mesh.position.set(x, y, z);
  mesh.scale.setScalar(1);
}

export function createScopeOverlay(): { mesh: THREE.Mesh; mat: THREE.ShaderMaterial } {
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    uniforms: { uAlpha: { value: 0 }, uAspect: { value: 1.6 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uAlpha;
      uniform float uAspect;
      void main() {
        vec2 p = vUv - 0.5;
        p.x *= uAspect;
        float d = length(p);
        float outside = smoothstep(0.332, 0.4, d);
        float ring = smoothstep(0.308, 0.326, d) * (1.0 - smoothstep(0.346, 0.364, d));
        float gap = 0.02;
        float hairX = smoothstep(0.0015, 0.0, abs(p.y)) * step(gap, abs(p.x)) * step(abs(p.x), 0.11);
        float hairY = smoothstep(0.0015, 0.0, abs(p.x)) * step(gap, abs(p.y)) * step(abs(p.y), 0.11);
        float hair = max(hairX, hairY);
        float a = max(outside, max(ring, hair));
        vec3 col = mix(vec3(0.0), vec3(0.75, 0.7, 0.6), clamp(ring + hair, 0.0, 1.0));
        gl_FragColor = vec4(col, a * uAlpha);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 30;
  mesh.visible = false;
  return { mesh, mat };
}

function buildTitle(): World["title"] {
  const root = new THREE.Group();
  root.name = "title";
  block(root, [2.4, 0.16, 2.4], [-1.2, -0.08, -1.2], 0x141210, 0.16, matte, 0.04);
  const rock = new THREE.Mesh(heroIronGeo(), metal);
  rock.position.set(0, 0.42, 0);
  rock.castShadow = true;
  root.add(rock);
  const card = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 0.85),
    new THREE.MeshBasicMaterial({
      map: labelTexture(["陨石"]),
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  card.position.set(0, 0.78, 0);
  root.add(card);
  return { root, rock, card };
}

function buildHouse(cast: Cast): World["house"] {
  const root = new THREE.Group();
  root.name = "house";
  block(root, [7.4, 0.18, 17.2], [-3.7, 0, -5.8], 0x6e655c, 0.24);
  block(root, [7.2, 0.06, 4.6], [-3.4, 0.18, -5.2], 0x6a4e3a, 0.2);
  block(root, [0.28, 3.05, 5.6], [-3.6, 0.18, -5.7], 0x7d6a58, 0.24);
  block(root, [0.28, 3.05, 5.6], [3.32, 0.18, -5.7], 0x7d6a58, 0.24);
  block(root, [7.2, 3.05, 0.26], [-3.6, 0.18, -5.7], 0x746454, 0.24);
  block(root, [3.05, 3.05, 0.26], [-3.6, 0.18, -0.12], 0x6e5e50, 0.24);
  block(root, [3.05, 3.05, 0.26], [0.55, 0.18, -0.12], 0x6e5e50, 0.24);
  block(root, [1.1, 0.9, 0.26], [-0.55, 2.2, -0.12], 0x6e5e50, 0.22);
  block(root, [7.4, 0.2, 5.9], [-3.7, 3.15, -5.8], 0x4a4038, 0.26);
  block(root, [0.32, 3.15, 10.4], [-3.7, 0.18, 0.2], 0x6a5d52, 0.26);
  block(root, [0.32, 3.15, 10.4], [3.38, 0.18, 0.2], 0x6a5d52, 0.26);
  block(root, [1.3, 0.18, 10.2], [-3.9, 3.05, 0.3], 0x5c4038, 0.24);
  block(root, [1.3, 0.18, 10.2], [2.6, 3.05, 0.3], 0x5c4038, 0.24);

  const cabinet = (x: number, z: number) => {
    block(root, [0.5, 1.35, 1.5], [x, 0.7, z], 0x3a342c, 0.12, matte, 0.04);
    pane(root, 1.35, 1.05, [x + 0.5, 1.45, z + 0.75], Math.PI / 2);
  };
  cabinet(-3.45, -4.9);
  cabinet(-3.45, -3.1);
  cabinet(2.85, -4.7);

  for (let i = 0; i < 14; i += 1) {
    const mesh = new THREE.Mesh(rockGeo(i + 2, 2.2 + (i % 3), 0.022), i % 4 === 0 ? metal : matte);
    const col = i % 7;
    const row = Math.floor(i / 7);
    mesh.position.set(-3.2, 0.95 + row * 0.48, -4.7 + col * 0.22);
    mesh.scale.setScalar(0.85 + (i % 3) * 0.2);
    mesh.castShadow = true;
    root.add(mesh);
  }

  block(root, [1.7, 0.1, 0.9], [-0.95, 0.74, -3.5], 0x5c4030, 0.1);
  block(root, [0.12, 0.74, 0.12], [-0.85, 0, -3.4], 0x3a2c22, 0.08);
  block(root, [0.12, 0.74, 0.12], [0.6, 0, -3.4], 0x3a2c22, 0.08);
  block(root, [0.12, 0.74, 0.12], [-0.85, 0, -2.75], 0x3a2c22, 0.08);
  block(root, [0.12, 0.74, 0.12], [0.6, 0, -2.75], 0x3a2c22, 0.08);
  block(root, [0.7, 0.02, 0.46], [-0.4, 0.85, -3.28], 0x1a1816, 0.04, matte, 0.02);

  const irons = [0, 1, 2].map((i) => {
    const mesh = new THREE.Mesh(ironGeo(i + 4), metal);
    mesh.position.set(-0.22 + i * 0.22, 0.92, -3.08);
    mesh.castShadow = true;
    mesh.visible = false;
    root.add(mesh);
    return mesh;
  });

  const handStone = new THREE.Mesh(stoneHandGeo(), matte);
  mountPx(handStone, cast.collector.anchors.handR, 0, -0.2, 1.1);
  handStone.visible = false;

  const handCup = new THREE.Mesh(cupGeo(), matte);
  mountPx(handCup, cast.zhang.anchors.handL, 0.1, -0.4, 1.05);
  handCup.visible = false;

  const tableCup = new THREE.Mesh(cupGeo(), matte);
  tableCup.scale.setScalar(0.1);
  tableCup.position.set(0.28, 0.9, -3.12);
  root.add(tableCup);

  const phone = new THREE.Mesh(phoneGeo(), matte);
  mountPx(phone, cast.zhang.anchors.handR, 0, -0.2, 0.9);
  phone.visible = false;

  const glass = new THREE.Mesh(magnifierGeo(), metal);
  mountPx(glass, cast.collector.anchors.handR, 0.2, 0.2, 1.3);
  glass.visible = false;

  glow(root, [-1.7, 2.62, 5.4], 0xff8a3a, 0.16);
  glow(root, [1.5, 2.5, 8.2], 0xff8a3a, 0.14);
  glow(root, [-3.15, 2.05, -4.1], 0xd5e4ff, 0.08);
  const lanterns = [
    point(root, [-1.7, 2.45, 5.4], 0xff9344, 26, 9),
    point(root, [1.5, 2.35, 8.2], 0xff9344, 18, 8),
    point(root, [-2.6, 1.8, -4.0], 0xd7e6ff, 6, 4),
    point(root, [0.05, 1.85, -3.1], 0xffc48a, 18, 5),
  ];

  root.add(cast.collector.root);
  root.add(cast.zhang.root);
  return { root, lanterns, irons, handStone, handCup, tableCup, phone, glass };
}

function buildShop(): World["shop"] {
  const root = new THREE.Group();
  root.name = "shop";
  block(root, [8.4, 0.16, 6.4], [-4.2, 0, -3.2], 0x8a8d90, 0.26);
  block(root, [0.2, 2.8, 6.4], [-4.2, 0.16, -3.2], 0x4a5158, 0.26);
  block(root, [0.2, 2.8, 6.4], [4.0, 0.16, -3.2], 0x4a5158, 0.26);
  block(root, [8.4, 2.8, 0.2], [-4.2, 0.16, -3.2], 0x3e454c, 0.26);
  block(root, [8.4, 0.16, 6.4], [-4.2, 2.9, -3.2], 0x2c3238, 0.3);
  block(root, [2.2, 0.9, 1.1], [-1.1, 0.7, -0.5], 0x5c656e, 0.16, matte, 0.05);
  const gantry = block(root, [0.28, 0.28, 1.4], [-0.9, 1.85, -0.65], 0x8b97a3, 0.1, matte, 0.03);
  const spindle = block(root, [0.16, 0.7, 0.16], [-0.14, 1.15, -0.08], 0xc5ced6, 0.08, matte, 0.02);
  const chuck = new THREE.Mesh(ironGeo(9, 2.6, 0.02), metal);
  chuck.position.set(0.15, 1.22, 0.05);
  root.add(chuck);
  glow(root, [-1.6, 2.72, 0.4], 0xd5ece4, 0.7);
  glow(root, [1.8, 2.72, 0.2], 0xd5ece4, 0.7);
  const lights = [
    point(root, [-1.6, 2.6, 0.4], 0xe7f4ee, 48, 10),
    point(root, [1.8, 2.6, 0.2], 0xe7f4ee, 40, 10),
  ];
  const cylinders: THREE.Mesh[] = [];
  const geo = cylinderGeo();
  for (let i = 0; i < 15; i += 1) {
    const mesh = new THREE.Mesh(geo, metal);
    mesh.position.set(1.35 + (i % 5) * 0.08, 0.86, 0.85 + Math.floor(i / 5) * 0.08);
    mesh.rotation.z = Math.PI / 2;
    mesh.visible = false;
    root.add(mesh);
    cylinders.push(mesh);
  }
  block(root, [0.7, 0.08, 0.4], [1.25, 0.78, 0.75], 0x3a4046, 0.08, metal, 0.02);
  return { root, gantry, spindle, chuck, cylinders, lights };
}

function buildPit(cast: Cast): World["pit"] {
  const root = new THREE.Group();
  root.name = "pit";
  block(root, [5.2, 0.16, 4.2], [-2.6, 0, -2.2], 0x5c463c, 0.18);
  block(root, [0.22, 2.45, 4.2], [-2.6, 0.16, -2.2], 0x6a5044, 0.18);
  block(root, [0.22, 2.45, 4.2], [2.38, 0.16, -2.2], 0x6a5044, 0.18);
  block(root, [5.2, 2.45, 0.22], [-2.6, 0.16, -2.2], 0x624838, 0.18);
  block(root, [5.2, 0.16, 4.2], [-2.6, 2.55, -2.2], 0x2a221c, 0.2);
  block(root, [0.16, 0.16, 3.2], [-1.8, 2.35, -1.6], 0x3a342e, 0.08, metal, 0.02);
  block(root, [0.16, 0.16, 3.2], [1.2, 2.35, -1.6], 0x3a342e, 0.08, metal, 0.02);
  block(root, [1.15, 0.08, 0.62], [0.9, 0.74, -0.4], 0x4a3c30, 0.08);
  const blankRound = roundGeo(false);
  const tippedRound = roundGeo(true);
  for (let i = 0; i < 8; i += 1) {
    const mesh = new THREE.Mesh(i < 4 ? blankRound : tippedRound, matte);
    mesh.position.set(1.05 + (i % 4) * 0.12, 0.9, -0.22 + Math.floor(i / 4) * 0.14);
    mesh.rotation.x = Math.PI / 2;
    root.add(mesh);
  }
  glow(root, [0.05, 2.38, 0.1], 0xffc48a, 0.1);
  const bulb = point(root, [0.05, 2.25, 0.1], 0xffb36a, 48, 8);
  const muzzle = point(root, [0.1, 1.35, 0.2], 0xffe2c4, 0, 5);
  const clothL = block(root, [0.55, 0.42, 0.48], [-0.15, 0.2, -1.7], 0xd9d4c8, 0.08);
  const clothR = block(root, [0.4, 0.36, 0.4], [0.15, 0.24, -1.55], 0xc8c2b4, 0.08);
  const beef = new THREE.Mesh(beefGeo(), matte);
  beef.position.set(0.05, 0.42, -1.55);
  beef.visible = false;
  root.add(beef);
  const holes: THREE.Mesh[] = [];
  const holeGeo = buildVoxelGeometry({ size: [1, 1, 1], at: () => 0x1a1210 }, { voxel: 0.035, anchor: "center" });
  for (let i = 0; i < 4; i += 1) {
    const mesh = new THREE.Mesh(holeGeo, matte);
    mesh.position.set(-0.05 + (i % 2) * 0.08, 0.48, -1.48 - Math.floor(i / 2) * 0.06);
    mesh.visible = false;
    root.add(mesh);
    holes.push(mesh);
  }
  const knife = new THREE.Mesh(knifeGeo(), metal);
  mountPx(knife, cast.zhang.anchors.handR, 0, -0.3, 1.2);
  knife.visible = false;
  const crumbs = new THREE.Mesh(crumbGeo(), matte);
  mountPx(crumbs, cast.zhang.anchors.handR, 0.15, -0.15, 0.85);
  crumbs.visible = false;
  const pistol = new THREE.Mesh(pistolGeo(), metal);
  pistol.visible = false;
  mountPx(pistol, cast.zhang.anchors.handR, 0, 0.1, 0.2);
  const smokeGeo = buildVoxelGeometry(
    { size: [2, 2, 2], at: () => 0x9a9590 },
    { voxel: 0.06, anchor: "center" },
  );
  const smokeMat = new THREE.MeshStandardMaterial({
    color: 0xb7b2ac,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    roughness: 1,
  });
  const smoke = Array.from({ length: 8 }, () => {
    const mesh = new THREE.Mesh(smokeGeo, smokeMat);
    mesh.visible = false;
    root.add(mesh);
    return mesh;
  });
  return { root, bulb, muzzle, clothL, clothR, beef, holes, knife, crumbs, pistol, smoke };
}

const HOMES: Array<[number, number, number, CrewMember["role"]]> = [
  [-1.35, 0.02, 0.2, "target"],
  [0, 0.1, 0.38, "target"],
  [1.35, 0, 0.16, "target"],
  [-2.05, -0.04, -0.85, "extra"],
  [-0.65, 0.16, -0.72, "extra"],
  [0.72, 0.06, -0.78, "extra"],
  [2.05, -0.02, -0.9, "extra"],
  [-1.2, -0.06, -1.7, "extra"],
  [0.2, 0.08, -1.78, "extra"],
  [1.5, 0, -1.62, "extra"],
  [2.75, 0.12, 0.35, "photo"],
];

function buildSpace(cast: Cast): World["space"] {
  const root = new THREE.Group();
  root.name = "space";
  const stars = (() => {
    const count = 1400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const theta = (i * 2.399) % (Math.PI * 2);
      const y = 1 - (i / count) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const radius = 170;
      positions[i * 3] = Math.cos(theta) * ring * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * ring * radius;
      const tint = 0.72 + ((i * 17) % 28) / 100;
      colors[i * 3] = tint;
      colors[i * 3 + 1] = tint * 0.95;
      colors[i * 3 + 2] = tint * 0.82;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ size: 0.62, vertexColors: true, depthWrite: false, sizeAttenuation: false }),
    );
    root.add(points);
    return points;
  })();
  void stars;

  const earth = new THREE.Mesh(earthGeo(), matte);
  earth.position.set(0.4, 5.4, -52);
  root.add(earth);
  const clouds = new THREE.Mesh(cloudGeo(), matte);
  clouds.position.copy(earth.position);
  root.add(clouds);
  const atmo = new THREE.Mesh(atmoGeo(), atmoMat);
  atmo.position.copy(earth.position);
  root.add(atmo);
  const sun = new THREE.Mesh(sunGeo(), sunMat);
  sun.position.set(20, 15, -38);
  root.add(sun);

  const station = new THREE.Group();
  station.position.set(7.8, 3.2, -26);
  const wheel = new THREE.Mesh(wheelGeo(), matte);
  wheel.scale.setScalar(1.15);
  station.add(wheel);
  block(station, [1.5, 1.7, 1.1], [-0.75, -0.85, 3.5], 0xc5ced6, 0.2, matte, 0.03);
  const door = block(station, [0.95, 1.15, 0.16], [-0.48, -0.55, 4.55], 0x2a3138, 0.1, metal, 0.02);
  const lamp = glow(station, [0.78, 0.35, 4.62], 0xff3348, 0.12);
  station.add(block(station, [2.2, 0.18, 0.18], [-8, 1.2, -1], 0x9aa6b2, 0.16));
  root.add(station);

  const yard = new THREE.Group();
  yard.position.set(-32, 4, -42);
  const beam = buildVoxelGeometry(
    { size: [1, 1, 12], at: () => 0x8a96a2 },
    { voxel: 0.28, anchor: "center" },
  );
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      const a = new THREE.Mesh(beam, metal);
      a.position.set(i * 2.4 - 3.6, j * 1.8, 0);
      yard.add(a);
      const b = new THREE.Mesh(beam, metal);
      b.rotation.y = Math.PI / 2;
      b.position.set(i * 1.2, j * 1.8, 0);
      b.scale.set(0.7, 1, 0.7);
      yard.add(b);
    }
  }
  root.add(yard);

  const base = new THREE.Group();
  base.position.set(-20, 7.5, -64);
  block(base, [1.4, 0.8, 1.1], [-0.7, 0, -0.5], 0xb7c2cc, 0.2);
  block(base, [0.6, 0.6, 0.6], [0.8, 0.2, 0.2], 0x8e9aa6, 0.16);
  const baseLight = glow(base, [0.2, 0.9, 0.4], 0xff5544, 0.16);
  root.add(base);

  const debris: THREE.Mesh[] = [];
  for (let i = 0; i < 7; i += 1) {
    const mesh = new THREE.Mesh(i % 2 === 0 ? rockGeo(20 + i, 2.4, 0.08) : ironGeo(12 + i, 2.2, 0.05), i % 2 ? metal : matte);
    mesh.position.set(-6 + i * 2.4, 4.2 + (i % 3), -28 - (i % 4) * 2);
    mesh.scale.setScalar(0.7 + (i % 3) * 0.35);
    root.add(mesh);
    debris.push(mesh);
  }

  const crewRoot = new THREE.Group();
  crewRoot.position.set(7.8, 3.05, -16.4);
  root.add(crewRoot);
  const pack = packGeo();
  const plume = plumeGeo();
  const crew: CrewMember[] = HOMES.map((home, index) => {
    const look = createCrewLook(index);
    const height = CREW_HEIGHTS[index] ?? 1.78;
    const fig = makeCrewFigure(index, look, height);
    fig.root.name = `crew-${index}`;
    const packMesh = new THREE.Mesh(pack, matte);
    fig.anchors.back.add(packMesh);
    packMesh.position.set(0, -1.2, -1.4);
    const plumeMesh = new THREE.Mesh(plume, sunMat);
    plumeMesh.position.set(0, -3.2, -1.6);
    plumeMesh.visible = false;
    fig.anchors.back.add(plumeMesh);
    if (home[3] === "photo") {
      const cam = new THREE.Mesh(cameraGeo(), matte);
      mountPx(cam, fig.anchors.handR, 0, 0, 0.8);
    }
    crewRoot.add(fig.root);
    return {
      fig,
      index,
      home: new THREE.Vector3(home[0], home[1], home[2]),
      role: home[3],
      look,
      phase: index * 1.7,
      plume: plumeMesh,
      height,
    };
  });

  const commuters: Figure[] = [];
  for (let i = 0; i < 3; i += 1) {
    const look = createCrewLook(3 + i);
    const fig = makeCrewFigure(3 + i, look, 1.75);
    const packMesh = new THREE.Mesh(pack, matte);
    fig.anchors.back.add(packMesh);
    packMesh.position.set(0, -1.2, -1.4);
    root.add(fig.root);
    commuters.push(fig);
  }

  const pistol = new THREE.Mesh(pistolGeo(), metal);
  mountPx(pistol, cast.zhangSpace.anchors.hipR, 0.2, -1.5, 0.4);
  pistol.rotation.set(1.1, 0.2, 0.4);
  const scope = new THREE.Mesh(scopeGeo(), metal);
  scope.visible = false;
  root.add(scope);
  const glove = new THREE.Mesh(gloveGeo(), matte);
  mountPx(glove, cast.zhangSpace.anchors.handR, 0, 0.2, 0.4);
  const muzzle = point(root, [0, 2, 0], 0xffe0b0, 0, 6);
  const bulletGeo = buildVoxelGeometry(
    { size: [1, 1, 3], at: () => 0x241f1c },
    { voxel: 0.028, anchor: "center" },
  );
  const bullets = Array.from({ length: 12 }, () => {
    const mesh = new THREE.Mesh(bulletGeo, metal);
    mesh.visible = false;
    root.add(mesh);
    return mesh;
  });

  const puffGeo = buildVoxelGeometry(
    { size: [2, 2, 2], at: (x, y, z) => ((x + y + z) & 1) === 0 ? 0xffffff : null },
    { voxel: 0.045, anchor: "center" },
  );
  const bloodGeo = buildVoxelGeometry(
    { size: [2, 2, 2], at: () => 0x9a2430 },
    { voxel: 0.03, anchor: "center" },
  );
  const vaporMat = new THREE.MeshStandardMaterial({
    color: 0xf7fbff,
    emissive: 0xd5e4f2,
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    roughness: 1,
  });
  const bloodMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.05,
  });
  const puffs: Puff[] = [];
  const addPuffs = (index: number, count: number, kind: "vapor" | "blood", speed: number) => {
    for (let k = 0; k < count; k += 1) {
      const mesh = new THREE.Mesh(kind === "vapor" ? puffGeo : bloodGeo, kind === "vapor" ? vaporMat : bloodMat);
      mesh.visible = false;
      root.add(mesh);
      const dir = new THREE.Vector3(
        Math.sin(index * 4.1 + k) * 0.7,
        0.25 + ((k * 17) % 10) / 20,
        0.35 + Math.cos(k + index) * 0.45,
      ).normalize();
      puffs.push({ mesh, index, dir, speed: speed * (0.65 + ((k * 13) % 8) / 10), kind });
    }
  };
  addPuffs(0, 8, "vapor", 0.22);
  addPuffs(0, 10, "blood", 0.14);
  addPuffs(1, 12, "vapor", 0.28);
  addPuffs(2, 8, "vapor", 0.22);
  addPuffs(2, 10, "blood", 0.15);
  addPuffs(4, 16, "vapor", 0.45);
  addPuffs(7, 8, "vapor", 0.2);

  const zPack = new THREE.Mesh(pack, matte);
  cast.zhangSpace.anchors.back.add(zPack);
  zPack.position.set(0, -1.2, -1.4);
  const zPlume = new THREE.Mesh(plume, sunMat);
  zPlume.name = "zhang-plume";
  zPlume.position.set(0, -3.4, -1.8);
  zPlume.visible = false;
  cast.zhangSpace.anchors.back.add(zPlume);

  root.add(cast.zhangSpace.root);
  return {
    root,
    earth,
    clouds,
    atmo,
    sun,
    station,
    door,
    lamp,
    crewRoot,
    crew,
    commuters,
    debris,
    pistol,
    scope,
    glove,
    muzzle,
    bullets,
    puffs,
    baseLight,
  };
}

export function buildWorld(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): World {
  const key = new THREE.DirectionalLight(0xfff2dd, 2.4);
  key.position.set(6, 10, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.00035;
  key.shadow.normalBias = 0.045;
  const fill = new THREE.DirectionalLight(0x8ea4c4, 0.45);
  fill.position.set(-4, 3, 6);
  const ambient = new THREE.AmbientLight(0xfff0e0, 0.18);
  const hemi = new THREE.HemisphereLight(0xc5d0dc, 0x3a2e24, 0.35);
  scene.add(key, key.target, fill, fill.target, ambient, hemi);
  const fog = new THREE.FogExp2(0x12100e, 0.02);
  scene.fog = fog;
  const bg = new THREE.Color(0x07080c);
  scene.background = bg;

  const cast = createCast();
  const title = buildTitle();
  const house = buildHouse(cast);
  const shop = buildShop();
  const pit = buildPit(cast);
  const space = buildSpace(cast);
  scene.add(title.root, house.root, shop.root, pit.root, space.root);
  house.root.visible = false;
  shop.root.visible = false;
  pit.root.visible = false;
  space.root.visible = false;

  const overlay = createScopeOverlay();
  scene.add(overlay.mesh);

  return {
    scene,
    camera,
    renderer,
    key,
    fill,
    ambient,
    hemi,
    fog,
    bg,
    c1: new THREE.Color(),
    c2: new THREE.Color(),
    scope: overlay.mesh,
    scopeMat: overlay.mat,
    cast,
    title,
    house,
    shop,
    pit,
    space,
  };
}

export type SetName = "title" | "house" | "shop" | "pit" | "space";

export function showSet(world: World, name: SetName): void {
  world.title.root.visible = name === "title";
  world.house.root.visible = name === "house";
  world.shop.root.visible = name === "shop";
  world.pit.root.visible = name === "pit";
  world.space.root.visible = name === "space";
}

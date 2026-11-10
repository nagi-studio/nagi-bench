import * as THREE from "three";
import { voxelMaterial } from "@agentbench/voxel-kit";
import { Vox } from "../lib/vox";
import { makeGlow } from "../lib/fx";
import { hash3, jit, mulberry, type V3 } from "../lib/util";
import { makeStone, makeTeapot, makeCup, makeMagnifier, type StoneKind } from "../cast/props";

/**
 * The collector's room: a dim old courtyard house turned private museum. Glass
 * cases glow along two walls; one green-shaded lamp makes a pool of light on the
 * workbench where the deal is closed.
 *
 * World units are metres. The interior spans x 0..8 (west→east), z 0..6
 * (north→south), y 0..3.2.
 */

const S = 0.1;
const g = (m: number): number => Math.round(m / S) + 1;

export const ROOM = {
  /** Three iron meteorites: their home on the shelf and their place on the felt. */
  shelfSlots: [[4.42, 1.31, 0.36], [4.9, 1.31, 0.36], [5.38, 1.31, 0.36]] as V3[],
  feltSlots: [[5.98, 0.9, 2.12], [6.3, 0.9, 2.02], [6.62, 0.9, 2.14]] as V3[],
  benchTop: 0.9,
  lampPos: [6.75, 1.26, 1.95] as V3,
  door: [6.7, 0, 5.75] as V3,
  teaTable: [2.5, 0.72, 4.3] as V3,
};

export interface RoomSet {
  group: THREE.Group;
  lamp: THREE.SpotLight;
  lampFill: THREE.PointLight;
  lampGlow: THREE.Sprite;
  windowLight: THREE.DirectionalLight;
  cabinetLights: THREE.PointLight[];
  hemi: THREE.HemisphereLight;
  phoneLight: THREE.PointLight;
  pendant: THREE.PointLight;
  doorLeaf: THREE.Group;
  outside: THREE.MeshBasicMaterial;
  pane: THREE.Mesh;
  shelfStones: THREE.Mesh[];
  feltStones: THREE.Mesh[];
  walnut: THREE.Mesh;
  radio: THREE.Group;
  radioGlow: THREE.Sprite;
  magnifier: THREE.Mesh;
  benchPebble: THREE.Mesh;
  mood(mode: "dusk" | "night", lampLevel?: number): void;
}

export function buildRoom(): RoomSet {
  const group = new THREE.Group();
  group.name = "set:room";
  const v = new Vox(82, 34, 62);
  const lume = new Vox(82, 34, 62);

  // Floor: old grey brick laid in courses.
  v.box(0, 0, 0, 82, 1, 62, (x, _y, z) => {
    const row = Math.floor(z / 3);
    const mortar = z % 3 === 0 || (x + (row % 2) * 3) % 6 === 0;
    return mortar ? 0x2a2927 : jit(0x45433f, Math.floor((x + (row % 2) * 3) / 6), row, 3, 0.16);
  });
  // Walls: brick dado below, aged plaster above.
  const wall = (x: number, y: number, z: number): number => {
    if (y < 9) {
      const along = x === 0 || x === 81 ? z : x;
      const mortar = y % 2 === 0 && (along + (Math.floor(y / 2) % 2) * 2) % 4 === 0;
      return mortar ? 0x3a3936 : jit(0x504e4a, along >> 2, y >> 1, x + z, 0.12);
    }
    const stain = hash3(Math.floor(x / 5), Math.floor(y / 6), Math.floor(z / 5));
    return jit(stain > 0.8 ? 0x77705f : 0x8a8371, x, y, z, 0.05);
  };
  v.box(0, 1, 0, 82, 34, 1, wall);
  v.box(0, 1, 61, 82, 34, 62, wall);
  v.box(0, 1, 0, 1, 34, 62, wall);
  v.box(81, 1, 0, 82, 34, 62, wall);
  // Ceiling boards and beams.
  v.box(0, 33, 0, 82, 34, 62, (x, _y, z) => jit(0x2a211b, x >> 2, 0, z, 0.1));
  const beam = (x: number, y: number, z: number) => jit(0x33160f, x >> 1, y, z >> 1, 0.12);
  for (const z of [14, 30, 46]) v.box(1, 30, z, 81, 33, z + 3, beam);
  for (const x of [1, 27, 53, 79]) {
    v.box(x, 1, 1, x + 2, 33, 3, beam);
    v.box(x, 1, 59, x + 2, 33, 61, beam);
  }

  // Lattice window on the south wall.
  v.carve(14, 11, 61, 46, 25, 62);
  v.box(14, 11, 61, 46, 25, 62, (x, y) => {
    const lx = x - 14, ly = y - 11;
    if (lx % 8 === 0 || ly % 7 === 0 || lx === 31 || ly === 13) return 0x2c130d;
    if ((lx % 8 === 4 && ly % 7 > 1 && ly % 7 < 6) || (ly % 7 === 3 && lx % 8 > 1 && lx % 8 < 7)) return 0x34170f;
    return null;
  });
  v.box(13, 10, 61, 47, 11, 62, 0x2c130d).box(13, 25, 61, 47, 26, 62, 0x2c130d);
  // Doorway.
  v.carve(63, 1, 61, 73, 23, 62);
  v.box(62, 1, 61, 63, 24, 62, 0x2c130d).box(73, 1, 61, 74, 24, 62, 0x2c130d).box(62, 23, 61, 74, 24, 62, 0x2c130d);

  // Display cases. `bays` are [from, to) voxel ranges along the wall.
  const wood = (x: number, y: number, z: number) => jit(0x2b1a12, x, y >> 1, z, 0.1);
  const felt = (x: number, y: number, z: number) => jit(0x17181d, x, y, z, 0.08);
  const shelfYs = [7, 12, 17];
  // North wall case: x 0.6..7.4, 0.5 m deep.
  v.box(7, 1, 1, 75, 7, 6, wood);
  for (let x = 7; x < 75; x += 17) v.box(x, 4, 5, x + 1, 5, 6, 0x8a6a2a); // brass pulls
  v.box(7, 7, 1, 75, 23, 2, felt);
  v.box(7, 22, 1, 75, 24, 6, wood);
  for (const y of shelfYs) v.box(7, y, 1, 75, y + 1, 6, (x, yy, z) => jit(0x3a281c, x, yy, z, 0.08));
  for (let x = 7; x <= 75; x += 17) v.box(Math.min(x, 74), 7, 1, Math.min(x, 74) + 1, 23, 6, wood);
  // West wall case: z 1.2..4.6.
  v.box(1, 1, 13, 6, 7, 47, wood);
  v.box(1, 7, 13, 2, 23, 47, felt);
  v.box(1, 22, 13, 6, 24, 47, wood);
  for (const y of shelfYs) v.box(1, y, 13, 6, y + 1, 47, (x, yy, z) => jit(0x3a281c, x, yy, z, 0.08));
  for (let z = 13; z <= 47; z += 17) v.box(1, 7, Math.min(z, 46), 6, 23, Math.min(z, 46) + 1, wood);
  // Strip lights tucked under each shelf front.
  for (const y of [11, 16, 21]) {
    lume.box(8, y, 4, 74, y + 1, 5, (x) => ((x - 7) % 17 === 0 ? null : 0xffe6b8));
    lume.box(4, y, 14, 5, y + 1, 46, (_x, _y, z) => ((z - 13) % 17 === 0 ? null : 0xffe6b8));
  }

  // Workbench with a felt mat.
  v.box(55, 8, 17, 76, 10, 27, (x, y, z) => jit(0x4a3020, x >> 1, y, z, 0.1));
  for (const [x, z] of [[55, 17], [74, 17], [55, 25], [74, 25]] as Array<[number, number]>) v.box(x, 1, z, x + 2, 8, z + 2, wood);
  v.box(57, 5, 18, 74, 6, 19, wood);
  v.box(58, 9, 18, 71, 10, 26, (x, y, z) => jit(0x1d3d2c, x, y, z, 0.07));
  // Desk lamp: brass stem, green shade.
  v.box(73, 10, 18, 75, 11, 20, 0x8a6a2a);
  v.box(74, 11, 19, 75, 17, 20, 0x8a6a2a);
  v.box(69, 16, 19, 75, 17, 20, 0x8a6a2a);
  v.box(65, 15, 17, 71, 17, 22, (x, y, z) => jit(0x1c4a38, x, y, z, 0.06));
  lume.box(66, 14, 18, 70, 15, 21, 0xfff0c8);
  // A microscope and small boxes at the bench's east end.
  v.box(72, 10, 23, 75, 11, 26, 0x202226).box(73, 11, 25, 74, 15, 26, 0x202226).box(73, 14, 23, 74, 15, 26, 0x2e3036).box(73, 12, 23, 74, 14, 24, 0x8d9099);
  v.box(56, 10, 18, 58, 11, 20, 0x6a4a2a).box(56, 10, 21, 58, 12, 23, 0x3a2a40);

  // Paper pendant lamp over the middle of the room.
  v.box(40, 27, 33, 41, 33, 34, 0x1a1a1a);
  lume.box(38, 24, 31, 43, 27, 36, (x, y, z) => ((x === 38 || x === 42) && (z === 31 || z === 35) ? null : y === 24 ? 0xffd9a0 : 0xf2c890));

  // Safe in the north-east corner.
  v.box(73, 1, 7, 80, 10, 14, (x, y, z) => jit(0x23352c, x, y, z, 0.05));
  v.box(74, 2, 14, 79, 9, 15, (x, y, z) => jit(0x2a4034, x, y, z, 0.05));
  v.set(76, 6, 15, 0x9a9da4).set(77, 5, 15, 0x8a6a2a);

  // Tea table and a chair by the window.
  v.box(22, 6, 40, 29, 7, 47, (x, y, z) => jit(0x3a2015, x, y, z, 0.1));
  for (const [x, z] of [[22, 40], [28, 40], [22, 46], [28, 46]] as Array<[number, number]>) v.box(x, 1, z, x + 1, 6, z + 1, wood);
  v.box(12, 1, 41, 18, 5, 47, wood);
  v.box(12, 5, 41, 13, 12, 47, wood);
  v.box(13, 5, 41, 18, 6, 47, (x, y, z) => jit(0x4a2a1c, x, y, z, 0.1));
  // Framed star chart on the east wall: the one picture a meteorite man would hang.
  v.box(80, 10, 32, 81, 27, 44, (x, y, z) => {
    if (y === 10 || y === 26 || z === 32 || z === 43) return 0x3a2416;
    const dz = z - 37.5, dy = y - 18;
    const r = Math.sqrt(dz * dz + dy * dy);
    if (Math.abs(r - 5.2) < 0.55) return 0x5f7bb0;
    if (hash3(z, y, 9) > 0.9) return 0xe6e2cc;
    return jit(0x141b30, x, y, z, 0.08);
  });
  // Potted plant in the south-west corner.
  v.box(3, 1, 54, 7, 4, 58, 0x6a4a3a);
  v.box(2, 4, 53, 8, 9, 59, (x, y, z) => (hash3(x, y, z) > 0.45 ? jit(0x2f4a2c, x, y, z, 0.2) : null));

  const solid = v.mesh(S);
  solid.position.set(-S, -S, -S);
  group.add(solid);
  const lit = new THREE.Mesh(lume.geometry(S), new THREE.MeshBasicMaterial({ vertexColors: true }));
  lit.position.copy(solid.position);
  group.add(lit);

  // Dusk beyond the lattice and the open door.
  const outside = new THREE.MeshBasicMaterial({ color: 0x4d6a9c });
  const back = new THREE.Mesh(new THREE.BoxGeometry(9, 4, 0.1), outside);
  back.position.set(4, 1.6, 6.45);
  group.add(back);

  // Door leaf, hinged on its west jamb, opening inward.
  const doorLeaf = new THREE.Group();
  doorLeaf.position.set(6.2, 0, 6.02);
  const leaf = new Vox(10, 22, 1);
  leaf.box(0, 0, 0, 10, 22, 1, (x, y) => (x === 0 || x === 9 || y === 0 || y === 21 || y === 11 ? 0x4a130d : jit(0x6a1c12, x, y, 0, 0.08)));
  leaf.set(8, 10, 0, 0x8a6a2a);
  const leafMesh = leaf.mesh(S);
  doorLeaf.add(leafMesh);
  group.add(doorLeaf);

  // Glass. One pane per bay; the third north pane slides.
  const glass = new THREE.MeshStandardMaterial({ color: 0x9fc4d6, transparent: true, opacity: 0.1, roughness: 0.08, metalness: 0, depthWrite: false });
  let pane!: THREE.Mesh;
  for (let b = 0; b < 4; b++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.64, 1.5, 0.02), glass);
    m.position.set(0.6 + 0.05 + b * 1.7 + 0.82, 1.45, 0.52);
    group.add(m);
    if (b === 2) pane = m;
  }
  for (let b = 0; b < 2; b++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.5, 1.64), glass);
    m.position.set(0.52, 1.45, 1.25 + b * 1.7 + 0.82);
    group.add(m);
  }

  // The collection: several dozen stones on their little lit stands.
  const rng = mulberry(77);
  const kinds: StoneKind[] = ["stony", "iron", "pallasite", "tektite", "stony", "mars", "iron", "stony"];
  const variants = kinds.map((k, i) => makeStone(k, i + 3, 2.2 + (i % 3) * 0.7, 0.022, [1, 0.75 + (i % 2) * 0.2, 0.85]));
  const stand = voxelMaterial();
  const placeStone = (x: number, y: number, z: number, i: number, yaw: number) => {
    const src = variants[i % variants.length]!;
    const m = new THREE.Mesh(src.geometry, src.material);
    m.castShadow = true;
    m.position.set(x, y + (src.userData.halfHeight as number) + 0.03, z);
    m.rotation.y = yaw;
    group.add(m);
    const base = new Vox(3, 1, 3);
    base.box(0, 0, 0, 3, 1, 3, 0xcfc9b8);
    const b = new THREE.Mesh(base.geometry(0.04, "center"), stand);
    b.position.set(x, y + 0.02, z);
    group.add(b);
    const glow = makeGlow(0xffd9a0, 0.5, 0.16);
    glow.position.set(x, y + 0.18, z + 0.06);
    group.add(glow);
  };
  let n = 0;
  for (let b = 0; b < 4; b++) {
    for (let s = 0; s < 3; s++) {
      if (b === 2 && s === 1) continue; // the iron shelf, dressed below
      const y = (shelfYs[s]! + 1 - 1) * S;
      const count = 2 + Math.floor(rng() * 2);
      for (let i = 0; i < count; i++) {
        const x = 0.6 + b * 1.7 + 0.3 + ((i + 0.5) / count) * 1.2 + (rng() - 0.5) * 0.1;
        placeStone(x, y, 0.3 + rng() * 0.08, n++, rng() * 6);
      }
    }
  }
  for (let b = 0; b < 2; b++) {
    for (let s = 0; s < 3; s++) {
      const y = shelfYs[s]! * S;
      for (let i = 0; i < 2; i++) {
        placeStone(0.3 + rng() * 0.06, y, 1.2 + b * 1.7 + 0.35 + i * 0.7 + (rng() - 0.5) * 0.1, n++, rng() * 6);
      }
    }
  }

  // The three iron meteorites, each on a pale stand with its own little light.
  const shelfStones: THREE.Mesh[] = [];
  const feltStones: THREE.Mesh[] = [];
  ROOM.shelfSlots.forEach((slot, i) => {
    const base = new Vox(4, 1, 4);
    base.box(0, 0, 0, 4, 1, 4, 0xd9d3c2);
    const b = new THREE.Mesh(base.geometry(0.04, "center"), stand);
    b.position.set(slot[0], 1.22, slot[2]);
    group.add(b);
    const glow = makeGlow(0xffe2b0, 0.7, 0.22);
    glow.position.set(slot[0], 1.42, slot[2] + 0.08);
    group.add(glow);
    const stone = makeStone("iron", 40 + i, 5.4 + i * 0.3, 0.014, [1, 0.82, 0.9]);
    stone.position.set(slot[0], 1.24 + (stone.userData.halfHeight as number), slot[2]);
    stone.rotation.y = i * 1.3;
    group.add(stone);
    shelfStones.push(stone);
    const twin = new THREE.Mesh(stone.geometry, stone.material);
    twin.castShadow = true;
    twin.userData.halfHeight = stone.userData.halfHeight;
    const f = ROOM.feltSlots[i]!;
    twin.position.set(f[0], f[1] + (stone.userData.halfHeight as number), f[2]);
    twin.rotation.y = i * 1.3 + 0.5;
    group.add(twin);
    feltStones.push(twin);
  });
  // The walnut-sized one he offers first.
  const walnut = makeStone("iron", 61, 2.4, 0.013);
  group.add(walnut);

  // Tea things.
  const pot = makeTeapot();
  pot.position.set(2.42, 0.7 + 0.075, 4.3);
  group.add(pot);
  const spare = makeCup(0.02);
  spare.position.set(2.7, 0.7, 4.45);
  group.add(spare);

  // Bench dressing: the pebble he is studying, a magnifier.
  const benchPebble = makeStone("stony", 9, 1.8, 0.012);
  benchPebble.position.set(6.2, 0.93, 2.3);
  group.add(benchPebble);
  const magnifier = makeMagnifier();
  magnifier.scale.setScalar(0.05625);
  group.add(magnifier);

  // A small valve radio for the coda.
  const radio = new THREE.Group();
  const rv = new Vox(9, 6, 4);
  rv.box(0, 0, 0, 9, 6, 4, (x, y, z) => jit(0x5a3320, x, y, z, 0.08));
  rv.box(1, 1, 3, 5, 5, 4, (x, y) => ((x + y) % 2 === 0 ? 0x2a1a12 : 0x8a7a5a));
  rv.box(6, 1, 3, 8, 3, 4, 0x1a1a1a);
  const rm = rv.mesh(0.035, { anchor: "center" });
  radio.add(rm);
  const dial = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.01), new THREE.MeshBasicMaterial({ color: 0xffc46a }));
  dial.position.set(0.09, 0.05, 0.075);
  radio.add(dial);
  const radioGlow = makeGlow(0xffb050, 0.5, 0.5);
  radioGlow.position.set(0.09, 0.05, 0.12);
  radio.add(radioGlow);
  radio.position.set(5.72, 0.9 + 0.105, 1.95);
  radio.rotation.y = 0.35;
  group.add(radio);

  // Lighting.
  const hemi = new THREE.HemisphereLight(0x5a6a8c, 0x2a1c12, 0.5);
  group.add(hemi);
  const lamp = new THREE.SpotLight(0xffdfb4, 14, 7, 1.05, 0.8, 1.6);
  lamp.position.set(...ROOM.lampPos);
  lamp.target.position.set(6.3, 0.9, 2.2);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(1024, 1024);
  lamp.shadow.bias = -0.002;
  lamp.shadow.normalBias = 0.03;
  lamp.shadow.camera.near = 0.1;
  lamp.shadow.camera.far = 7;
  group.add(lamp, lamp.target);
  const lampFill = new THREE.PointLight(0xffd2a0, 3.2, 7, 1.7);
  lampFill.position.set(6.55, 1.25, 2.0);
  group.add(lampFill);
  const lampGlow = makeGlow(0xffdca0, 1.3, 0.55);
  lampGlow.position.set(6.75, 1.3, 1.98);
  group.add(lampGlow);

  const windowLight = new THREE.DirectionalLight(0x6f8fc8, 0.9);
  windowLight.position.set(1.5, 3.4, 10.5);
  windowLight.target.position.set(3.4, 0, 2.6);
  // Unshadowed on purpose: it stands in for sky light filling the room through door and lattice.
  windowLight.castShadow = false;
  windowLight.shadow.mapSize.set(1024, 1024);
  windowLight.shadow.camera.left = -6;
  windowLight.shadow.camera.right = 6;
  windowLight.shadow.camera.top = 5;
  windowLight.shadow.camera.bottom = -5;
  windowLight.shadow.camera.near = 0.5;
  windowLight.shadow.camera.far = 16;
  windowLight.shadow.bias = -0.002;
  windowLight.shadow.normalBias = 0.04;
  group.add(windowLight, windowLight.target);

  const cabinetLights: THREE.PointLight[] = [];
  for (const p of [[2.2, 2.0, 1.5], [5.0, 2.0, 1.5], [1.5, 2.0, 3.0]] as V3[]) {
    const l = new THREE.PointLight(0xffdfb0, 1.0, 5.5, 1.6);
    l.position.set(...p);
    group.add(l);
    cabinetLights.push(l);
  }
  const pendant = new THREE.PointLight(0xffd4a0, 2.6, 7, 1.5);
  pendant.position.set(3.95, 2.3, 3.25);
  group.add(pendant);
  const pendantGlow = makeGlow(0xffd9a0, 1.6, 0.35);
  pendantGlow.position.set(3.95, 2.45, 3.25);
  group.add(pendantGlow);
  const phoneLight = new THREE.PointLight(0x9cc8ff, 0, 2.2, 1.6);
  group.add(phoneLight);

  const mood = (mode: "dusk" | "night", lampLevel = 1): void => {
    if (mode === "dusk") {
      outside.color.setHex(0x4d6a9c);
      windowLight.intensity = 0.9;
      windowLight.color.setHex(0x6f8fc8);
      hemi.intensity = 0.5;
    } else {
      outside.color.setHex(0x0b1226);
      windowLight.intensity = 0.25;
      windowLight.color.setHex(0x4a62a0);
      hemi.intensity = 0.28;
    }
    for (const l of cabinetLights) l.intensity = mode === "dusk" ? 1.0 : 0.7;
    pendant.intensity = mode === "dusk" ? 2.6 : 0;
    pendantGlow.visible = mode === "dusk";
    lamp.intensity = (mode === "dusk" ? 14 : 9) * lampLevel;
    lampFill.intensity = (mode === "dusk" ? 3.2 : 1.9) * lampLevel;
    (lampGlow.material as THREE.SpriteMaterial).opacity = 0.55 * lampLevel;
  };

  return {
    group, lamp, lampFill, lampGlow, windowLight, cabinetLights, hemi, phoneLight, pendant, doorLeaf, outside, pane,
    shelfStones, feltStones, walnut, radio, radioGlow, magnifier, benchPebble, mood,
  };
}

export { g as roomGrid };

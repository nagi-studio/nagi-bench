import * as THREE from "three";
import { createSkin } from "@agentbench/voxel-kit";
import {
  makeActor, makeSuitGear, coatSheet, cardiganSheet, suitSheet, crowdFace, ZHANG_FACE, COLLECTOR_FACE,
  type Actor, type SuitGear,
} from "./characters";
import {
  voxMesh, pistolGeometry, scopeGeometry, magazineGeometry, teacupGeometry, phoneGeometry, phoneScreenTexture,
  magnifierGeometry, knifeGeometry, pliersGeometry, ironMeteorite, slugGeometry, lumpGeometry,
} from "./props";
import { buildHutong, buildRoom, buildWorkshop, buildBasement, buildCabin } from "./interiors";
import { buildEarth, buildSun, buildStation, buildSurroundings, makeSpaceSet, HATCH } from "./space";
import { PuffSystem } from "./particles";
import type { Ctx } from "./context";
import { defaultFX } from "./post";
import { glowTexture } from "./util";

export type World = ReturnType<typeof buildWorld>;

export interface GroupMember {
  actor: Actor;
  gear: SuitGear;
  slot: THREE.Vector3;
  row: number;
  idx: number;
  target: boolean;
  hit: boolean;
  seed: number;
}

export function buildWorld(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
  const hutong = buildHutong();
  const room = buildRoom();
  const workshop = buildWorkshop();
  const basement = buildBasement();
  const cabin = buildCabin();
  const spaceSet = makeSpaceSet();
  const earth = buildEarth();
  const sun = buildSun();
  const station = buildStation();
  const sur = buildSurroundings();
  spaceSet.group.add(earth.group, earth.atmo, sun.group, station.group, station.patchGroup, sur.group);

  // space lighting
  const sunLight = new THREE.DirectionalLight(0xffb070, 2.6);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  const sc = sunLight.shadow.camera as THREE.OrthographicCamera;
  sc.left = -24; sc.right = 24; sc.top = 16; sc.bottom = -16; sc.near = 1; sc.far = 200;
  sunLight.shadow.bias = -0.0005;
  sunLight.shadow.normalBias = 0.05;
  spaceSet.group.add(sunLight, sunLight.target);
  const zhangSun = new THREE.DirectionalLight(0xffb070, 2.4);
  zhangSun.castShadow = true;
  zhangSun.shadow.mapSize.set(1024, 1024);
  const zc = zhangSun.shadow.camera as THREE.OrthographicCamera;
  zc.left = -3; zc.right = 3; zc.top = 3; zc.bottom = -3; zc.near = 0.5; zc.far = 30;
  spaceSet.group.add(zhangSun, zhangSun.target);
  const earthShine = new THREE.HemisphereLight(0x2a3a5a, 0x05070c, 0.5);
  spaceSet.group.add(earthShine);
  const fill = new THREE.DirectionalLight(0x9ab4e0, 1.15);
  fill.position.set(0, 2, -10);
  spaceSet.group.add(fill);

  /* ---------------- cast ---------------- */
  const zhangCoat = coatSheet();
  const zhangSuit = suitSheet({ base: "#cfd6dc", trim: "#2a4a7a", glove: "#7d848c", boot: "#8a9098", seed: 3 });
  const zhangSuitBare = suitSheet({ base: "#cfd6dc", trim: "#2a4a7a", glove: "#7d848c", boot: "#8a9098", seed: 3, rightGloveOff: true });
  const zhang = makeActor(ZHANG_FACE, ["neutral", "talk", "stern", "narrow", "closed", "smile"], zhangCoat, 1.8);
  zhang.fig.root.name = "zhang";
  const zhangGear = makeSuitGear(zhang.fig);
  const collector = makeActor(COLLECTOR_FACE, ["smile", "talk", "laugh", "awkward", "neutral", "closed"], cardiganSheet(), 1.72);

  // Zhang's props (px units on anchors)
  const pistol = voxMesh(pistolGeometry());
  pistol.scale.setScalar(1.25);
  pistol.position.set(0, 0.6, 2.4);
  const scope = voxMesh(scopeGeometry());
  const scopeOnPistol = new THREE.Vector3(0, 1.0, 0.3);
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, 0.6, 4.3);
  pistol.add(muzzle);
  const flashSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xffd090, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
  flashSprite.scale.setScalar(4);
  muzzle.add(flashSprite);
  const flashLight = new THREE.PointLight(0xffc080, 0, 3, 2);
  muzzle.add(flashLight);
  const magR = voxMesh(magazineGeometry());
  const magL = voxMesh(magazineGeometry());
  magL.position.set(0, 0.2, 1.0);
  const cup = voxMesh(teacupGeometry(0.012 / 0.05625));
  cup.position.set(0, 1.2, 1.4);
  const phone = voxMesh(phoneGeometry());
  phone.position.set(0, 1.0, 1.4);
  phone.rotation.x = -Math.PI / 2;
  const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.1), new THREE.MeshBasicMaterial({ map: phoneScreenTexture(false) }));
  const phoneScreenPaid = phoneScreenTexture(true);
  const phoneScreenIdle = (phoneScreen.material as THREE.MeshBasicMaterial).map!;
  phoneScreen.position.set(0, 0, 0.2);
  phone.add(phoneScreen);
  const pliers = voxMesh(pliersGeometry());
  pliers.position.set(0, 0, 1.6);
  const knife = voxMesh(knifeGeometry());
  knife.position.set(0, 0, 2.2);
  const shards = voxMesh(lumpGeometry(77, 3, 0.35, (x, y, z) => ((x + y + z) % 2 ? 0x4a4644 : 0x6a6664), [1.4, 0.5, 1.2]));
  shards.position.set(0, 1.4, 0.2);
  const heldSlug = voxMesh(slugGeometry(0.06, 4, 1.6, 0x5a5654, 0x3a3634));
  heldSlug.position.set(0, 0, 0.8);
  const locatorProp = voxMesh(lumpGeometry(3, 1.6, 0.6, () => 0x30353a, [1.4, 0.8, 1]));
  locatorProp.position.set(0, 0, 1.0);
  const locatorLed = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x30ff60, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
  locatorLed.scale.setScalar(1.6);
  locatorLed.position.set(0, 0.6, 0.5);
  locatorProp.add(locatorLed);
  const zProps = { pistol, scope, magR, magL, cup, phone, pliers, knife, shards, heldSlug, locatorProp };

  // collector props
  const magnifier = voxMesh(magnifierGeometry());
  magnifier.scale.setScalar(1 / 0.05625);
  magnifier.position.set(0, 0, 1.4);
  const ironInHand = voxMesh(ironMeteorite(300, 5.5, 0.0085 / 0.05625));
  ironInHand.position.set(0, 1.4, 1.6);
  const walnutInHand = voxMesh(ironMeteorite(299, 3, 0.008 / 0.05625));
  walnutInHand.position.set(0, 1.0, 1.2);
  const collectorCup = voxMesh(teacupGeometry(0.012 / 0.05625));
  collectorCup.position.set(0, 1.2, 1.4);
  const cProps = { magnifier, ironInHand, walnutInHand, collectorCup };
  collector.fig.anchors.handR.add(magnifier, ironInHand, walnutInHand, collectorCup);

  /* ---------------- photo group ---------------- */
  const crowd: GroupMember[] = [];
  const whiteSuit = (seed: number) => suitSheet({ base: "#eeeeea", trim: "#c8ccd0", glove: "#9aa0a8", boot: "#b8bcc2", seed });
  const suitTex = [whiteSuit(41), whiteSuit(42), whiteSuit(43)];
  const rows = [9, 10, 11];
  let k = 0;
  for (let r = 0; r < 3; r++) {
    for (let i = 0; i < rows[r]!; i++) {
      const senior = r === 0;
      const face = crowdFace(k, senior);
      const actor = makeActor(face, ["neutral", "smile", "panic", "pain", "talk"], suitTex[k % 3]!, 1.72 + ((k * 37) % 10) / 100);
      const gear = makeSuitGear(actor.fig);
      const x = (i - (rows[r]! - 1) / 2) * 1.25 + (r === 1 ? 0.1 : 0);
      const slot = new THREE.Vector3(x, -0.9 + r * 1.25, HATCH.z + 26 - r * 1.1);
      const target = r === 0 && (i === 3 || i === 4 || i === 5);
      const hit = target || (r === 1 && (i === 4 || i === 6));
      crowd.push({ actor, gear, slot, row: r, idx: i, target, hit, seed: k });
      spaceSet.group.add(actor.fig.root);
      k++;
    }
  }
  const photographer = makeActor(crowdFace(40, false), ["neutral", "talk", "panic"], whiteSuit(44), 1.75);
  const photographerGear = makeSuitGear(photographer.fig);
  photographerGear.setVisor(1);
  const camBody = voxMesh(lumpGeometry(5, 2, 1, () => 0x1d1f22, [1.2, 1, 1.2]));
  camBody.position.set(0, 1, 1.2);
  photographer.fig.anchors.handR.add(camBody);
  spaceSet.group.add(photographer.fig.root);

  // commuters for the establishing shot
  const commuters: Array<{ actor: Actor; gear: SuitGear }> = [];
  for (let i = 0; i < 4; i++) {
    const a = makeActor(crowdFace(60 + i, false), ["neutral"], whiteSuit(50 + i), 1.78);
    const g = makeSuitGear(a.fig);
    spaceSet.group.add(a.fig.root);
    commuters.push({ actor: a, gear: g });
  }

  /* ---------------- particles ---------------- */
  const gas = new PuffSystem(4000, true);
  spaceSet.group.add(gas.points);
  const ice = new PuffSystem(1500, true);
  spaceSet.group.add(ice.points);
  const blood = new PuffSystem(600, false);
  spaceSet.group.add(blood.points);
  const sparks = new PuffSystem(800, true);
  workshop.set.group.add(sparks.points);
  const smoke = new PuffSystem(900, false);
  basement.set.group.add(smoke.points);
  const dust = new PuffSystem(600, false);
  basement.set.group.add(dust.points);

  // meteorite bullets in flight
  const bulletGeo = slugGeometry(0.004, 6, 2, 0x8a8682, 0x4a4644);
  const bullets: THREE.Mesh[] = [];
  for (let i = 0; i < 30; i++) {
    const b = new THREE.Mesh(bulletGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.6 }));
    b.visible = false;
    spaceSet.group.add(b);
    bullets.push(b);
  }

  for (const s of [hutong.set, room.set, workshop.set, basement.set, cabin.set, spaceSet]) {
    scene.add(s.group);
    s.group.visible = false;
  }

  const ctx: Ctx = {
    scene,
    camera,
    renderer,
    fx: defaultFX(),
    sets: { hutong: hutong.set, room: room.set, workshop: workshop.set, basement: basement.set, cabin: cabin.set, space: spaceSet },
    active: "",
  };

  return {
    ctx, hutong, room, workshop, basement, cabin, spaceSet, earth, sun, station, sur, sunLight, zhangSun, earthShine, fill,
    zhang, zhangGear, zhangCoat, zhangSuit, zhangSuitBare, collector, zProps, cProps, scopeOnPistol, muzzle, flashSprite, flashLight,
    phoneScreen, phoneScreenPaid, phoneScreenIdle,
    crowd, photographer, photographerGear, commuters, gas, ice, blood, sparks, smoke, dust, bullets,
    puffs: [gas, ice, blood, sparks, smoke, dust],
  };
}

export { createSkin };

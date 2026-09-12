import * as THREE from "three";
import type { Team, WeaponId } from "../types";
import { WEAPONS } from "../weapons";

export interface CharacterRig {
  root: THREE.Group;
  body: THREE.Group;
  head: THREE.Mesh;
  torso: THREE.Mesh;
  lArm: THREE.Group;
  rArm: THREE.Group;
  lLeg: THREE.Group;
  rLeg: THREE.Group;
  weapon: THREE.Group;
  eye: THREE.Object3D;
}

const skin = new THREE.MeshStandardMaterial({ color: 0xc4a07a, roughness: 0.7 });
const boot = new THREE.MeshStandardMaterial({ color: 0x1a1510, roughness: 0.8 });

function teamMats(team: Team) {
  if (team === "T") {
    return {
      torso: new THREE.MeshStandardMaterial({ color: 0x8a5a22, roughness: 0.75 }),
      vest: new THREE.MeshStandardMaterial({ color: 0x5c3d18, roughness: 0.7 }),
      pants: new THREE.MeshStandardMaterial({ color: 0x3a2818, roughness: 0.8 }),
      hat: new THREE.MeshStandardMaterial({ color: 0x3a2a14, roughness: 0.7 }),
      sleeve: new THREE.MeshStandardMaterial({ color: 0x7a4e1c, roughness: 0.75 }),
    };
  }
  return {
    torso: new THREE.MeshStandardMaterial({ color: 0x2a4a72, roughness: 0.7 }),
    vest: new THREE.MeshStandardMaterial({ color: 0x1c334e, roughness: 0.65 }),
    pants: new THREE.MeshStandardMaterial({ color: 0x1a2430, roughness: 0.8 }),
    hat: new THREE.MeshStandardMaterial({ color: 0x4a6048, roughness: 0.55, metalness: 0.2 }),
    sleeve: new THREE.MeshStandardMaterial({ color: 0x2e5078, roughness: 0.7 }),
  };
}

function box(w: number, h: number, d: number, mat: THREE.Material, y = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.y = y;
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function makeGun(id: WeaponId): THREE.Group {
  const g = new THREE.Group();
  const def = WEAPONS[id];
  const bodyMat = new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.45, metalness: 0.35 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.4, metalness: 0.4 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x5a3a18, roughness: 0.7 });

  if (id === "knife") {
    const handle = box(0.04, 0.12, 0.04, wood);
    handle.rotation.x = Math.PI / 2;
    g.add(handle);
    const blade = box(0.02, 0.22, 0.05, new THREE.MeshStandardMaterial({ color: 0xc0c8d0, metalness: 0.7, roughness: 0.25 }));
    blade.position.set(0, 0.16, 0);
    g.add(blade);
    return g;
  }

  if (id === "awp") {
    g.add(box(0.08, 0.1, 1.15, bodyMat, 0));
    const barrel = box(0.035, 0.035, 0.45, dark);
    barrel.position.set(0, 0.02, -0.72);
    g.add(barrel);
    const stock = box(0.07, 0.12, 0.28, wood);
    stock.position.set(0, -0.02, 0.52);
    g.add(stock);
    const scope = box(0.05, 0.06, 0.28, dark);
    scope.position.set(0, 0.1, -0.05);
    g.add(scope);
    const mag = box(0.05, 0.14, 0.08, dark);
    mag.position.set(0, -0.1, 0.12);
    g.add(mag);
    return g;
  }

  const long = id === "ak47" || id === "m4a4";
  const len = long ? 0.72 : 0.32;
  const body = box(0.07, 0.09, len, bodyMat);
  g.add(body);
  const barrel = box(0.03, 0.03, long ? 0.28 : 0.14, dark);
  barrel.position.set(0, 0.015, -len / 2 - (long ? 0.12 : 0.06));
  g.add(barrel);
  const stock = box(0.06, 0.08, long ? 0.18 : 0.08, id === "ak47" ? wood : dark);
  stock.position.set(0, -0.01, len / 2 - 0.02);
  g.add(stock);
  const mag = box(0.04, id === "ak47" ? 0.16 : 0.12, 0.07, dark);
  mag.position.set(0, -0.1, 0.04);
  if (id === "ak47") mag.rotation.x = 0.25;
  g.add(mag);
  const grip = box(0.04, 0.1, 0.05, dark);
  grip.position.set(0, -0.08, 0.14);
  grip.rotation.x = 0.35;
  g.add(grip);
  return g;
}

export function createCharacter(team: Team): CharacterRig {
  const mats = teamMats(team);
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const torso = box(0.38, 0.52, 0.22, mats.torso, 1.28);
  body.add(torso);
  const vest = box(0.42, 0.28, 0.26, mats.vest, 1.34);
  body.add(vest);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), skin);
  head.position.y = 1.68;
  head.castShadow = true;
  body.add(head);
  if (team === "CT") {
    const helm = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), mats.hat);
    helm.position.y = 1.72;
    body.add(helm);
  } else {
    const hat = box(0.26, 0.08, 0.26, mats.hat, 1.8);
    body.add(hat);
  }

  const lArm = new THREE.Group();
  lArm.position.set(-0.26, 1.42, 0);
  const lUpper = box(0.1, 0.32, 0.1, mats.sleeve, -0.14);
  const lLower = box(0.09, 0.28, 0.09, skin, -0.42);
  lArm.add(lUpper, lLower);
  body.add(lArm);

  const rArm = new THREE.Group();
  rArm.position.set(0.26, 1.42, 0);
  const rUpper = box(0.1, 0.32, 0.1, mats.sleeve, -0.14);
  const rLower = box(0.09, 0.28, 0.09, skin, -0.42);
  rArm.add(rUpper, rLower);
  body.add(rArm);

  const lLeg = new THREE.Group();
  lLeg.position.set(-0.11, 0.98, 0);
  lLeg.add(box(0.13, 0.48, 0.14, mats.pants, -0.24));
  lLeg.add(box(0.14, 0.1, 0.22, boot, -0.52));
  body.add(lLeg);

  const rLeg = new THREE.Group();
  rLeg.position.set(0.11, 0.98, 0);
  rLeg.add(box(0.13, 0.48, 0.14, mats.pants, -0.24));
  rLeg.add(box(0.14, 0.1, 0.22, boot, -0.52));
  body.add(rLeg);

  const weapon = new THREE.Group();
  rArm.add(weapon);
  weapon.position.set(0, -0.55, -0.15);

  const eye = new THREE.Object3D();
  eye.position.set(0, 1.62, 0);
  body.add(eye);

  // Default rifle hold
  lArm.rotation.set(1.15, 0.15, 0.35);
  rArm.rotation.set(1.05, -0.2, -0.45);

  return { root, body, head, torso, lArm, rArm, lLeg, rLeg, weapon, eye };
}

export function poseHold(rig: CharacterRig, melee: boolean): void {
  if (melee) {
    rig.rArm.rotation.set(0.4, -0.1, -0.8);
    rig.lArm.rotation.set(0.3, 0.2, 0.5);
  } else {
    rig.lArm.rotation.set(1.15, 0.15, 0.35);
    rig.rArm.rotation.set(1.05, -0.2, -0.45);
  }
}

export function animateWalk(rig: CharacterRig, t: number, speed: number, alive: boolean): void {
  if (!alive) {
    rig.body.rotation.x = 1.35;
    rig.body.position.y = 0.2;
    return;
  }
  rig.body.rotation.x = 0;
  rig.body.position.y = 0;
  const swing = Math.min(speed, 6) * 0.08;
  rig.lLeg.rotation.x = Math.sin(t * 10) * swing;
  rig.rLeg.rotation.x = -Math.sin(t * 10) * swing;
}

export function setCharacterWeapon(rig: CharacterRig, id: WeaponId): void {
  while (rig.weapon.children.length) {
    const ch = rig.weapon.children[0];
    rig.weapon.remove(ch);
    disposeObject(ch);
  }
  const gun = makeGun(id);
  if (id === "knife") {
    gun.rotation.set(1.2, 0, 0.4);
    gun.position.set(0, 0.05, 0);
  } else {
    gun.rotation.set(-1.15, 0, 0);
    gun.position.set(0, 0.02, -0.05);
  }
  rig.weapon.add(gun);
  poseHold(rig, id === "knife");
}

function disposeObject(obj: THREE.Object3D): void {
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
  });
}

export interface Viewmodel {
  group: THREE.Group;
  gun: THREE.Group;
  punch: number;
}

export function createViewmodel(): Viewmodel {
  const group = new THREE.Group();
  const skinMat = skin;
  const sleeve = new THREE.MeshStandardMaterial({ color: 0x4a3a28, roughness: 0.7 });

  const rArm = new THREE.Group();
  rArm.position.set(0.18, -0.22, -0.28);
  rArm.add(box(0.08, 0.08, 0.28, sleeve));
  const rHand = box(0.07, 0.07, 0.08, skinMat);
  rHand.position.set(0, -0.02, -0.18);
  rArm.add(rHand);
  group.add(rArm);

  const lArm = new THREE.Group();
  lArm.position.set(-0.12, -0.24, -0.42);
  lArm.add(box(0.07, 0.07, 0.22, sleeve));
  const lHand = box(0.06, 0.06, 0.07, skinMat);
  lHand.position.set(0, 0, -0.14);
  lArm.add(lHand);
  group.add(lArm);

  const gun = new THREE.Group();
  gun.position.set(0.12, -0.18, -0.48);
  group.add(gun);

  return { group, gun, punch: 0 };
}

export function setViewmodelWeapon(vm: Viewmodel, id: WeaponId): void {
  while (vm.gun.children.length) {
    const ch = vm.gun.children[0];
    vm.gun.remove(ch);
    disposeObject(ch);
  }
  const gun = makeGun(id);
  gun.scale.setScalar(id === "knife" ? 1.1 : 1.15);
  if (id === "knife") {
    gun.rotation.set(0.4, 0.6, 0.2);
    gun.position.set(0.05, 0, 0.1);
  } else {
    gun.rotation.set(0.05, Math.PI, 0);
    gun.position.set(0, 0.02, 0);
  }
  vm.gun.add(gun);
}
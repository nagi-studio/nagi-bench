import * as THREE from 'three';
import type { Actor, Team, WeaponId } from './types';

const box = new THREE.BoxGeometry(1, 1, 1);
const materialCache = new Map<string, THREE.MeshStandardMaterial>();

function mat(color: number, metalness = 0, roughness = 0.78) {
  const key = `${color}/${metalness}/${roughness}`;
  let material = materialCache.get(key);
  if (!material) {
    material = new THREE.MeshStandardMaterial({ color, metalness, roughness });
    materialCache.set(key, material);
  }
  return material;
}

function part(
  parent: THREE.Object3D, color: number, position: [number, number, number],
  scale: [number, number, number], metalness = 0,
) {
  const mesh = new THREE.Mesh(box, mat(color, metalness));
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(
  parent: THREE.Object3D, color: number, radius: number, length: number,
  position: [number, number, number], metalness = 0.45,
) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 10), mat(color, metalness, 0.35));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(...position);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function segment(parent: THREE.Object3D, from: THREE.Vector3, to: THREE.Vector3, width: number, color: number) {
  const midpoint = from.clone().add(to).multiplyScalar(0.5);
  const delta = to.clone().sub(from);
  const mesh = part(parent, color, [midpoint.x, midpoint.y, midpoint.z], [width, delta.length(), width]);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  return mesh;
}

export function createWeaponModel(id: WeaponId) {
  const weapon = new THREE.Group();
  weapon.name = id;
  const gunmetal = 0x242829;
  const black = 0x15191a;
  const steel = 0x4b5050;
  const wood = 0x704629;
  let muzzle = -0.8;

  if (id === 'ak47') {
    part(weapon, wood, [0, 0, 0.25], [0.13, 0.17, 0.42]);
    part(weapon, gunmetal, [0, 0.02, -0.16], [0.14, 0.16, 0.48], 0.65);
    part(weapon, wood, [0, 0.015, -0.49], [0.15, 0.15, 0.32]);
    cylinder(weapon, steel, 0.026, 0.58, [0, 0.045, -0.82]);
    cylinder(weapon, black, 0.04, 0.13, [0, 0.045, -1.14]);
    const magazine = part(weapon, steel, [0, -0.16, -0.12], [0.105, 0.29, 0.16], 0.55);
    magazine.rotation.x = -0.28;
    part(weapon, wood, [0, -0.13, 0.06], [0.095, 0.25, 0.12]);
    part(weapon, black, [0, 0.13, -0.25], [0.04, 0.08, 0.05]);
    muzzle = -1.23;
  } else if (id === 'm4a4') {
    part(weapon, black, [0, 0, 0.27], [0.14, 0.16, 0.38]);
    part(weapon, gunmetal, [0, 0.02, -0.13], [0.15, 0.17, 0.48], 0.65);
    part(weapon, black, [0, 0.02, -0.48], [0.13, 0.14, 0.34]);
    for (const z of [-0.37, -0.47, -0.57]) part(weapon, steel, [0, 0.105, z], [0.15, 0.025, 0.035], 0.7);
    cylinder(weapon, steel, 0.024, 0.54, [0, 0.04, -0.82]);
    cylinder(weapon, black, 0.036, 0.16, [0, 0.04, -1.14]);
    const magazine = part(weapon, black, [0, -0.16, -0.12], [0.11, 0.29, 0.16]);
    magazine.rotation.x = 0.12;
    part(weapon, black, [0, -0.13, 0.08], [0.09, 0.24, 0.11]);
    part(weapon, black, [0, 0.16, -0.18], [0.055, 0.12, 0.12]);
    muzzle = -1.24;
  } else if (id === 'awp') {
    part(weapon, 0x46533f, [0, 0, 0.27], [0.16, 0.2, 0.52]);
    part(weapon, 0x53634b, [0, 0.025, -0.25], [0.15, 0.16, 0.64]);
    cylinder(weapon, gunmetal, 0.027, 0.83, [0, 0.055, -0.91], 0.75);
    cylinder(weapon, black, 0.047, 0.18, [0, 0.055, -1.40]);
    cylinder(weapon, black, 0.07, 0.42, [0, 0.19, -0.16]);
    cylinder(weapon, steel, 0.083, 0.055, [0, 0.19, -0.39]);
    part(weapon, black, [0, 0.11, -0.16], [0.06, 0.11, 0.08]);
    part(weapon, black, [0, -0.12, 0.03], [0.10, 0.25, 0.12]);
    part(weapon, gunmetal, [0, -0.11, -0.23], [0.10, 0.17, 0.13], 0.6);
    muzzle = -1.51;
  } else if (id === 'glock' || id === 'usp' || id === 'deagle') {
    const long = id === 'deagle';
    part(weapon, id === 'glock' ? 0x343b38 : steel, [0, 0.03, -0.18], [0.12, 0.13, long ? 0.52 : 0.40], 0.7);
    part(weapon, black, [0, -0.13, 0.005], [0.105, 0.28, 0.14]);
    part(weapon, gunmetal, [0, -0.005, -0.06], [0.09, 0.12, 0.19], 0.65);
    cylinder(weapon, black, 0.018, 0.12, [0, 0.04, long ? -0.49 : -0.40]);
    part(weapon, black, [0, 0.11, -0.29], [0.035, 0.045, 0.04]);
    if (id === 'usp') cylinder(weapon, black, 0.047, 0.27, [0, 0.035, -0.47]);
    muzzle = id === 'deagle' ? -0.57 : id === 'usp' ? -0.63 : -0.47;
  } else {
    part(weapon, 0x202522, [0, -0.03, 0.10], [0.09, 0.10, 0.29]);
    part(weapon, steel, [0, 0.015, -0.24], [0.045, 0.085, 0.48], 0.85);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.061, 0.20, 4), mat(0xaeb5b3, 0.85, 0.2));
    tip.rotation.x = -Math.PI / 2;
    tip.rotation.y = Math.PI / 4;
    tip.position.set(0, 0.015, -0.57);
    weapon.add(tip);
    part(weapon, black, [0, 0.015, -0.005], [0.20, 0.045, 0.06]);
    muzzle = -0.68;
  }
  weapon.userData.muzzle = new THREE.Vector3(0, 0.04, muzzle);
  return weapon;
}

export interface CharacterRig {
  group: THREE.Group;
  body: THREE.Group;
  head: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  weaponAnchor: THREE.Group;
  weaponModels: Map<WeaponId, THREE.Group>;
  nameplate: THREE.Sprite;
  weaponId: WeaponId | null;
  update(actor: Actor, time: number, dt: number): void;
  setNameVisible(visible: boolean): void;
}

function makeNameplate(actor: Actor) {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 80;
  const context = canvas.getContext('2d')!;
  context.fillStyle = 'rgba(8,14,17,.76)';
  context.fillRect(24, 8, 336, 56);
  context.strokeStyle = actor.team === 'CT' ? '#65b9e8' : '#e7a657';
  context.lineWidth = 3;
  context.strokeRect(24, 8, 336, 56);
  context.fillStyle = '#edf3f2';
  context.font = '600 30px Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(actor.name, 192, 37);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.55, 0.32, 1);
  sprite.position.y = 2.1;
  return sprite;
}

function buildArm(body: THREE.Group, side: number, uniform: number, skin: number) {
  const arm = new THREE.Group();
  body.add(arm);
  const shoulder = new THREE.Vector3(side * 0.33, 1.38, 0);
  const elbow = new THREE.Vector3(side * 0.42, 1.10, -0.22);
  const hand = new THREE.Vector3(side < 0 ? -0.11 : 0.17, 1.20, side < 0 ? -0.69 : -0.42);
  segment(arm, shoulder, elbow, 0.17, uniform);
  segment(arm, elbow, hand, 0.145, uniform);
  part(arm, skin, [hand.x, hand.y, hand.z], [0.14, 0.13, 0.16]);
  return arm;
}

function buildLeg(body: THREE.Group, side: number, uniform: number) {
  const leg = new THREE.Group();
  leg.position.set(side * 0.15, 0.82, 0);
  body.add(leg);
  part(leg, uniform, [0, -0.18, 0], [0.205, 0.36, 0.235]);
  part(leg, uniform, [0, -0.50, 0.015], [0.175, 0.34, 0.20]);
  part(leg, 0x242724, [0, -0.75, -0.055], [0.21, 0.15, 0.34]);
  return leg;
}

export function createCharacter(actor: Actor): CharacterRig {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);
  const ct = actor.team === 'CT';
  const uniform = ct ? 0x29475c : 0x71694a;
  const uniformDark = ct ? 0x1c3242 : 0x504a35;
  const vest = ct ? 0x172a35 : 0x443c2c;
  const accent = ct ? 0x4f9bc5 : 0xc17b3f;
  const skin = 0xb9825f + (Number(actor.id.slice(1)) % 3) * 0x080604;

  part(body, uniformDark, [0, 0.84, 0], [0.43, 0.25, 0.29]);
  part(body, uniform, [0, 1.20, 0], [0.53, 0.55, 0.31]);
  part(body, vest, [0, 1.22, -0.175], [0.46, 0.44, 0.10]);
  part(body, vest, [0, 1.22, 0.17], [0.44, 0.43, 0.09]);
  part(body, accent, [0, 1.03, -0.235], [0.34, 0.055, 0.025]);
  part(body, uniformDark, [0.20, 1.05, -0.24], [0.13, 0.16, 0.08]);
  part(body, uniformDark, [-0.20, 1.05, -0.24], [0.13, 0.16, 0.08]);
  part(body, vest, [0, 1.25, 0.28], [0.34, 0.38, 0.18]);

  const head = new THREE.Group();
  head.position.set(0, 1.59, 0);
  body.add(head);
  part(head, skin, [0, 0, 0], [0.33, 0.35, 0.32]);
  part(head, skin, [0, -0.015, -0.185], [0.07, 0.085, 0.07]);
  part(head, 0x272822, [-0.085, 0.055, -0.166], [0.055, 0.035, 0.018]);
  part(head, 0x272822, [0.085, 0.055, -0.166], [0.055, 0.035, 0.018]);
  if (ct) {
    part(head, 0x233c4d, [0, 0.18, 0.015], [0.42, 0.16, 0.41]);
    part(head, 0x1b303f, [0, 0.08, 0.17], [0.39, 0.20, 0.08]);
    part(head, 0x141f25, [0, 0.045, -0.185], [0.30, 0.075, 0.035]);
    part(head, accent, [0.215, 0.10, 0], [0.035, 0.11, 0.16]);
  } else {
    part(head, 0x5d553d, [0, 0.18, 0.015], [0.38, 0.10, 0.37]);
    part(head, accent, [0, -0.11, -0.17], [0.34, 0.14, 0.055]);
    part(head, accent, [0.17, -0.07, 0.05], [0.055, 0.23, 0.28]);
  }

  const leftArm = buildArm(body, -1, uniform, skin);
  const rightArm = buildArm(body, 1, uniform, skin);
  part(leftArm, accent, [-0.35, 1.30, -0.04], [0.18, 0.09, 0.18]);
  part(rightArm, accent, [0.35, 1.30, -0.04], [0.18, 0.09, 0.18]);
  const leftLeg = buildLeg(body, -1, uniform);
  const rightLeg = buildLeg(body, 1, uniform);

  const weaponAnchor = new THREE.Group();
  weaponAnchor.position.set(0.10, 1.23, -0.44);
  body.add(weaponAnchor);
  const nameplate = makeNameplate(actor);
  group.add(nameplate);

  const rig: CharacterRig = {
    group, body, head, leftLeg, rightLeg, leftArm, rightArm, weaponAnchor, weaponModels: new Map(), nameplate,
    weaponId: null,
    setNameVisible(visible) { nameplate.visible = visible; },
    update(target, time, dt) {
      group.position.copy(target.position);
      if (target.alive) {
        group.rotation.z = THREE.MathUtils.damp(group.rotation.z, 0, 12, dt);
        group.rotation.y = target.yaw;
        body.position.y = Math.abs(Math.sin(target.walkPhase * 2)) * 0.018;
        const swing = Math.sin(target.walkPhase) * Math.min(0.65, target.velocity.length() * 0.11);
        leftLeg.rotation.x = swing;
        rightLeg.rotation.x = -swing;
        head.rotation.x = target.pitch * 0.32;
        weaponAnchor.rotation.x = target.pitch * 0.72;
        const recoil = Math.max(0, 1 - (time - target.lastShotAt) * 12);
        weaponAnchor.position.z = -0.44 + recoil * 0.06;
        leftArm.rotation.x = -swing * 0.06;
        rightArm.rotation.x = swing * 0.06;
      } else {
        group.rotation.z = THREE.MathUtils.damp(group.rotation.z, actor.team === 'CT' ? 1.48 : -1.48, 5, dt);
        group.position.y += 0.18;
        nameplate.visible = false;
      }
    },
  };
  return rig;
}

export function createViewArms(team: Team) {
  const group = new THREE.Group();
  const uniform = team === 'CT' ? 0x29475c : 0x71694a;
  const glove = team === 'CT' ? 0x1a282e : 0x4b402e;
  const left = new THREE.Group();
  const right = new THREE.Group();
  group.add(left, right);
  segment(left, new THREE.Vector3(-0.48, -0.42, 0.12), new THREE.Vector3(-0.17, -0.13, -0.48), 0.15, uniform);
  part(left, glove, [-0.14, -0.11, -0.50], [0.16, 0.14, 0.20]);
  segment(right, new THREE.Vector3(0.48, -0.42, 0.18), new THREE.Vector3(0.15, -0.16, -0.02), 0.16, uniform);
  part(right, glove, [0.12, -0.12, -0.06], [0.16, 0.15, 0.19]);
  return { group, left, right };
}

export function disposeCharacterShared() {
  box.dispose();
  for (const material of materialCache.values()) material.dispose();
  materialCache.clear();
}

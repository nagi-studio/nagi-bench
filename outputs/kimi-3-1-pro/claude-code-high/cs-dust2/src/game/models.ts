import * as THREE from 'three';
import type { PlayerEntity, Team, WeaponId } from './types';

const mats = {
  ctUniform: new THREE.MeshStandardMaterial({ color: 0x344b5c, roughness: 0.9 }),
  ctArmor: new THREE.MeshStandardMaterial({ color: 0x1d2c38, roughness: 0.75 }),
  ctHelmet: new THREE.MeshStandardMaterial({ color: 0x263943, roughness: 0.65 }),
  tUniform: new THREE.MeshStandardMaterial({ color: 0x807355, roughness: 0.95 }),
  tArmor: new THREE.MeshStandardMaterial({ color: 0x514b38, roughness: 0.9 }),
  tHelmet: new THREE.MeshStandardMaterial({ color: 0x706142, roughness: 0.9 }),
  skin: new THREE.MeshStandardMaterial({ color: 0xb98461, roughness: 0.9 }),
  darkSkin: new THREE.MeshStandardMaterial({ color: 0x8a5d43, roughness: 0.9 }),
  boots: new THREE.MeshStandardMaterial({ color: 0x242421, roughness: 0.9 }),
  gun: new THREE.MeshStandardMaterial({ color: 0x252a2b, roughness: 0.48, metalness: 0.55 }),
  gunLight: new THREE.MeshStandardMaterial({ color: 0x4b5352, roughness: 0.45, metalness: 0.5 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x764329, roughness: 0.72 }),
  awp: new THREE.MeshStandardMaterial({ color: 0x40594b, roughness: 0.6, metalness: 0.25 }),
  blade: new THREE.MeshStandardMaterial({ color: 0xaab2b2, roughness: 0.25, metalness: 0.85 }),
};

function part(parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent: THREE.Object3D, radius: number, length: number, position: [number, number, number], material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 10), material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

export function createWeaponModel(id: WeaponId, firstPerson = false) {
  const gun = new THREE.Group();
  gun.name = `WEAPON_${id}`;
  if (id === 'knife') {
    part(gun, [0.075, 0.07, 0.26], [0, 0, 0.03], mats.boots);
    const blade = part(gun, [0.045, 0.012, 0.42], [0, 0.015, -0.28], mats.blade);
    blade.rotation.y = -0.04;
    part(gun, [0.16, 0.025, 0.045], [0, 0, -0.11], mats.gunLight);
  } else if (id === 'ak47' || id === 'm4a4' || id === 'awp') {
    const isAwp = id === 'awp';
    const length = isAwp ? 1.18 : 0.82;
    const bodyMat = id === 'ak47' ? mats.wood : isAwp ? mats.awp : mats.gun;
    part(gun, [0.14, 0.19, 0.48], [0, 0, -0.12], bodyMat);
    part(gun, [0.12, 0.16, 0.35], [0, 0.005, 0.29], bodyMat);
    part(gun, [0.105, 0.12, isAwp ? 0.48 : 0.32], [0, 0.015, -0.48], id === 'ak47' ? mats.wood : mats.gunLight);
    cylinder(gun, isAwp ? 0.027 : 0.022, length, [0, 0.055, -0.42 - length / 2], mats.gun);
    cylinder(gun, 0.04, 0.12, [0, 0.055, -0.42 - length], mats.gun);
    part(gun, [0.075, 0.23, 0.11], [0, -0.19, 0.08], mats.gun);
    const mag = part(gun, [0.095, 0.3, 0.14], [0, -0.21, -0.17], id === 'ak47' ? mats.gunLight : mats.gun);
    mag.rotation.x = id === 'ak47' ? -0.28 : 0.08;
    part(gun, [0.035, 0.08, 0.035], [0, 0.15, -0.37], mats.gun);
    if (id === 'm4a4') part(gun, [0.06, 0.07, 0.3], [0, 0.14, -0.08], mats.gun);
    if (isAwp) {
      cylinder(gun, 0.065, 0.38, [0, 0.18, -0.18], mats.gun);
      cylinder(gun, 0.078, 0.035, [0, 0.18, -0.39], mats.gunLight);
      part(gun, [0.04, 0.1, 0.04], [0, 0.1, -0.11], mats.gunLight);
    }
  } else {
    const deagle = id === 'deagle';
    part(gun, [deagle ? 0.12 : 0.105, 0.13, deagle ? 0.43 : 0.35], [0, 0.04, -0.1], deagle ? mats.gunLight : mats.gun);
    const grip = part(gun, [0.095, 0.26, 0.13], [0, -0.12, 0.045], mats.gun);
    grip.rotation.x = -0.18;
    if (id === 'usp') cylinder(gun, 0.035, 0.18, [0, 0.05, -0.36], mats.gunLight);
    if (deagle) part(gun, [0.04, 0.04, 0.24], [0, 0.125, -0.13], mats.gun);
  }
  if (firstPerson) {
    gun.traverse(obj => { if (obj instanceof THREE.Mesh) { obj.castShadow = false; obj.receiveShadow = false; } });
  }
  return gun;
}

export interface CharacterRig {
  root: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  weaponAnchor: THREE.Group;
  weaponId: WeaponId | null;
}

function makeNameplate(name: string, team: Team) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgba(5,10,13,.65)';
  ctx.fillRect(20, 8, 216, 44);
  ctx.font = '600 25px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = team === 'CT' ? '#79c9ee' : '#e8c36c';
  ctx.fillText(name, 128, 39);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(1.55, 0.39, 1);
  sprite.position.set(0, 2.12, 0);
  return sprite;
}

export function createCharacter(entity: PlayerEntity, showName: boolean): CharacterRig {
  const root = new THREE.Group();
  root.name = `PLAYER_${entity.id}`;
  const uniform = entity.team === 'CT' ? mats.ctUniform : mats.tUniform;
  const armor = entity.team === 'CT' ? mats.ctArmor : mats.tArmor;
  const skin = entity.team === 'CT' ? mats.skin : mats.darkSkin;

  // Separate pelvis, torso, vest, head and face pieces form a readable human silhouette.
  part(root, [0.42, 0.22, 0.28], [0, 0.88, 0], uniform);
  part(root, [0.52, 0.48, 0.3], [0, 1.22, 0], uniform);
  part(root, [0.55, 0.35, 0.35], [0, 1.25, -0.015], armor);
  part(root, [0.12, 0.09, 0.06], [0, 1.5, 0], skin);
  part(root, [0.34, 0.34, 0.32], [0, 1.67, 0], skin);
  part(root, [0.08, 0.08, 0.07], [0, 1.65, -0.185], skin);
  part(root, [0.25, 0.055, 0.025], [0, 1.73, -0.17], mats.boots);
  if (entity.team === 'CT') {
    part(root, [0.41, 0.16, 0.38], [0, 1.84, 0.015], mats.ctHelmet);
    part(root, [0.39, 0.08, 0.08], [0, 1.78, -0.18], mats.ctHelmet);
    part(root, [0.06, 0.17, 0.08], [-0.205, 1.69, 0], mats.gunLight);
  } else {
    part(root, [0.36, 0.13, 0.34], [0, 1.82, 0.01], mats.tHelmet);
    part(root, [0.36, 0.16, 0.04], [0, 1.57, 0.16], mats.tHelmet);
    part(root, [0.38, 0.07, 0.37], [0, 1.78, 0], mats.tHelmet);
  }

  function leg(x: number) {
    const pivot = new THREE.Group();
    pivot.position.set(x, 0.9, 0);
    part(pivot, [0.22, 0.43, 0.25], [0, -0.21, 0], uniform);
    part(pivot, [0.2, 0.4, 0.22], [0, -0.61, 0.015], uniform);
    part(pivot, [0.23, 0.16, 0.36], [0, -0.82, -0.055], mats.boots);
    root.add(pivot);
    return pivot;
  }
  const leftLeg = leg(-0.145);
  const rightLeg = leg(0.145);

  function arm(x: number) {
    const pivot = new THREE.Group();
    pivot.position.set(x, 1.43, 0);
    pivot.rotation.x = 0.95;
    part(pivot, [0.18, 0.36, 0.2], [0, -0.16, 0], uniform);
    part(pivot, [0.16, 0.32, 0.17], [0, -0.47, 0], uniform);
    part(pivot, [0.16, 0.15, 0.17], [0, -0.67, 0], skin);
    root.add(pivot);
    return pivot;
  }
  const leftArm = arm(-0.35);
  const rightArm = arm(0.35);
  leftArm.rotation.x = 1.2;
  leftArm.rotation.z = -0.28;
  rightArm.rotation.x = 0.8;
  rightArm.rotation.z = 0.15;

  const weaponAnchor = new THREE.Group();
  weaponAnchor.position.set(0.18, 1.23, -0.4);
  root.add(weaponAnchor);
  if (showName) root.add(makeNameplate(entity.name, entity.team));
  return { root, leftLeg, rightLeg, leftArm, rightArm, weaponAnchor, weaponId: null };
}

export function updateCharacterRig(rig: CharacterRig, entity: PlayerEntity, time: number) {
  rig.root.position.copy(entity.pos);
  rig.root.rotation.set(0, entity.yaw, 0);
  rig.root.visible = true;
  if (!entity.alive) {
    rig.root.rotation.z = Math.PI / 2;
    rig.root.position.y = 0.24;
    return;
  }
  const speed = Math.hypot(entity.velocity.x, entity.velocity.z);
  const swing = Math.sin(time * 10 + entity.id) * Math.min(0.65, speed * 0.11);
  rig.leftLeg.rotation.x = swing;
  rig.rightLeg.rotation.x = -swing;
  rig.root.position.y += Math.abs(Math.sin(time * 10 + entity.id)) * Math.min(0.025, speed * 0.004);
  const weapon = entity.weapons[entity.slot];
  if (weapon && rig.weaponId !== weapon.id) {
    rig.weaponAnchor.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
    rig.weaponAnchor.clear();
    rig.weaponAnchor.add(createWeaponModel(weapon.id));
    rig.weaponId = weapon.id;
  }
}

import * as THREE from 'three';
import type { Team } from './types';

export interface HumanoidModel {
  group: THREE.Group;
  leftLeg: THREE.Object3D;
  rightLeg: THREE.Object3D;
  leftArm: THREE.Object3D;
  rightArm: THREE.Object3D;
  head: THREE.Object3D;
}

function mat(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05 });
}

function box(w: number, h: number, d: number, color: number, parent: THREE.Object3D, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

const SKIN = 0xc89a6b;
const CT_TOP = 0x2e6da4;
const CT_HELMET = 0x1d3d63;
const T_TOP = 0xb08a4e;
const T_HEADWRAP = 0x5a4430;
const PANTS = 0x3a3632;
const GUN_METAL = 0x2a2a2e;
const GUN_WOOD = 0x6b4a2a;

/** Build an articulated humanoid (head / torso / two arms / two legs) holding a weapon. */
export function createHumanoid(team: Team, weaponId: string): HumanoidModel {
  const group = new THREE.Group();
  const topColor = team === 'CT' ? CT_TOP : T_TOP;

  // legs
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.17, 0.8, 0);
  box(0.22, 0.8, 0.22, PANTS, leftLeg, 0, -0.4, 0);
  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.17, 0.8, 0);
  box(0.22, 0.8, 0.22, PANTS, rightLeg, 0, -0.4, 0);
  group.add(leftLeg, rightLeg);

  // torso
  box(0.55, 0.62, 0.32, topColor, group, 0, 1.05, 0);
  // vest / plate
  box(0.56, 0.34, 0.34, team === 'CT' ? 0x20384f : 0x4a3b2a, group, 0, 1.12, 0);

  // head
  const head = new THREE.Group();
  head.position.set(0, 1.62, 0);
  box(0.26, 0.26, 0.26, SKIN, head, 0, 0.02, 0);
  if (team === 'CT') {
    box(0.3, 0.16, 0.3, CT_HELMET, head, 0, 0.18, 0);
    box(0.32, 0.06, 0.06, CT_HELMET, head, 0, 0.16, 0.13);
  } else {
    box(0.28, 0.12, 0.28, T_HEADWRAP, head, 0, 0.14, 0);
  }
  group.add(head);

  // arms (pivots at shoulders) angled forward to hold the weapon
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.36, 1.3, 0);
  box(0.16, 0.55, 0.16, topColor, leftArm, 0, -0.18, -0.12);
  box(0.15, 0.14, 0.15, SKIN, leftArm, 0, -0.46, -0.16);
  const rightArm = new THREE.Group();
  rightArm.position.set(0.36, 1.3, 0);
  box(0.16, 0.55, 0.16, topColor, rightArm, 0, -0.18, -0.12);
  box(0.15, 0.14, 0.15, SKIN, rightArm, 0, -0.46, -0.16);
  leftArm.rotation.x = 1.15;
  rightArm.rotation.x = 1.15;
  group.add(leftArm, rightArm);

  // held weapon (small third-person model)
  const weapon = buildWeaponModel(weaponId);
  weapon.position.set(0, 1.3, 0.5);
  weapon.rotation.x = -0.2;
  group.add(weapon);

  return { group, leftLeg, rightLeg, leftArm, rightArm, head };
}

/** Small world-space weapon model held by characters. */
export function buildWeaponModel(weaponId: string): THREE.Group {
  const g = new THREE.Group();
  switch (weaponId) {
    case 'ak47':
      box(0.7, 0.16, 0.12, GUN_METAL, g, 0, 0, 0.15);
      box(0.2, 0.14, 0.1, GUN_WOOD, g, -0.32, 0.02, 0.15);
      box(0.34, 0.12, 0.09, GUN_METAL, g, 0.1, -0.14, 0.15); // magazine
      box(0.42, 0.07, 0.07, GUN_METAL, g, 0.28, 0.06, 0.15); // barrel
      break;
    case 'm4a4':
      box(0.66, 0.15, 0.13, GUN_METAL, g, 0, 0, 0.15);
      box(0.2, 0.13, 0.09, 0x39424e, g, -0.3, 0.02, 0.15);
      box(0.3, 0.11, 0.08, GUN_METAL, g, 0.12, -0.13, 0.15);
      box(0.4, 0.06, 0.06, GUN_METAL, g, 0.26, 0.06, 0.15);
      box(0.1, 0.12, 0.08, GUN_METAL, g, 0.18, 0.1, 0.15); // carry handle
      break;
    case 'awp':
      box(0.95, 0.14, 0.12, 0x3b5c3b, g, 0, 0, 0.15);
      box(0.55, 0.06, 0.06, GUN_METAL, g, 0.5, 0.05, 0.15); // long barrel
      box(0.16, 0.12, 0.08, GUN_METAL, g, 0.02, -0.13, 0.15);
      box(0.18, 0.12, 0.1, GUN_METAL, g, -0.1, 0.09, 0.15); // scope
      break;
    case 'glock':
    case 'usp':
    case 'deagle': {
      const big = weaponId === 'deagle';
      const s = big ? 1.2 : 1;
      box(0.32 * s, 0.13 * s, 0.09 * s, GUN_METAL, g, 0, 0.04, 0.1);
      box(0.14 * s, 0.16 * s, 0.08 * s, GUN_METAL, g, 0, -0.09, 0.1); // grip
      break;
    }
    case 'knife':
      box(0.3, 0.04, 0.02, 0xbfc6cf, g, 0, 0.05, 0.1); // blade
      box(0.16, 0.05, 0.05, 0x3a3a3a, g, 0, -0.04, 0.1); // handle
      break;
    default:
      box(0.4, 0.14, 0.1, GUN_METAL, g, 0, 0, 0.1);
  }
  return g;
}

/** First-person viewmodel (larger, with hands) attached to the camera. */
export function buildViewModel(weaponId: string): THREE.Group {
  const g = new THREE.Group();
  const hands = (x: number, y: number, z: number): void => {
    box(0.14, 0.12, 0.18, SKIN, g, x, y, z);
  };
  switch (weaponId) {
    case 'ak47':
      box(0.85, 0.17, 0.14, GUN_METAL, g, 0, -0.1, -0.25);
      box(0.26, 0.15, 0.12, GUN_WOOD, g, -0.4, -0.08, -0.25);
      box(0.4, 0.13, 0.1, GUN_METAL, g, 0.12, -0.28, -0.25);
      box(0.55, 0.07, 0.07, GUN_METAL, g, 0.35, -0.02, -0.25);
      hands(-0.28, -0.28, -0.2);
      hands(0.06, -0.3, -0.2);
      break;
    case 'm4a4':
      box(0.8, 0.16, 0.15, GUN_METAL, g, 0, -0.1, -0.25);
      box(0.24, 0.14, 0.1, 0x39424e, g, -0.36, -0.08, -0.25);
      box(0.34, 0.12, 0.09, GUN_METAL, g, 0.14, -0.27, -0.25);
      box(0.5, 0.06, 0.06, GUN_METAL, g, 0.32, -0.02, -0.25);
      hands(-0.28, -0.28, -0.2);
      hands(0.05, -0.3, -0.2);
      break;
    case 'awp':
      box(1.05, 0.15, 0.13, 0x3b5c3b, g, 0, -0.1, -0.25);
      box(0.62, 0.06, 0.06, GUN_METAL, g, 0.55, -0.05, -0.25);
      box(0.2, 0.13, 0.11, GUN_METAL, g, -0.08, 0.0, -0.25); // scope
      hands(-0.3, -0.28, -0.2);
      hands(0.1, -0.3, -0.2);
      break;
    case 'glock':
    case 'usp':
    case 'deagle': {
      const big = weaponId === 'deagle';
      const s = big ? 1.35 : 1;
      box(0.36 * s, 0.15 * s, 0.11 * s, GUN_METAL, g, 0, -0.05, -0.25);
      box(0.15 * s, 0.2 * s, 0.09 * s, GUN_METAL, g, 0, -0.22, -0.25);
      hands(0.03, -0.2, -0.22);
      break;
    }
    case 'knife':
      box(0.34, 0.05, 0.025, 0xbfc6cf, g, 0, -0.02, -0.3);
      box(0.18, 0.06, 0.06, 0x3a3a3a, g, 0, -0.1, -0.3);
      hands(0.03, -0.12, -0.28);
      break;
    default:
      box(0.5, 0.16, 0.12, GUN_METAL, g, 0, -0.1, -0.25);
      hands(0.03, -0.2, -0.2);
  }
  return g;
}

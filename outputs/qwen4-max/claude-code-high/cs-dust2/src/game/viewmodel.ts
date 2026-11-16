import * as THREE from 'three';
import type { WeaponId } from './types';

const MAT = {
  metalDark: new THREE.MeshLambertMaterial({ color: 0x2e2e33 }),
  metalGray: new THREE.MeshLambertMaterial({ color: 0x50505a }),
  black: new THREE.MeshLambertMaterial({ color: 0x1c1c1f }),
  wood: new THREE.MeshLambertMaterial({ color: 0x8a5a2b }),
  awpGreen: new THREE.MeshLambertMaterial({ color: 0x4a5d3a }),
  silver: new THREE.MeshLambertMaterial({ color: 0x9a9aa2 }),
  blade: new THREE.MeshLambertMaterial({ color: 0xb8bcc4 }),
  skin: new THREE.MeshLambertMaterial({ color: 0xd9a580 }),
  lens: new THREE.MeshLambertMaterial({ color: 0x0a1420 }),
};

const box = (w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0, rx = 0): THREE.Mesh => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.x = rx;
  m.castShadow = true;
  return m;
};

const cylZ = (r: number, len: number, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
};

/**
 * Procedural gun model facing -Z, origin at the grip.
 * `withArms` adds first-person hands/forearms (viewmodel only).
 */
export function buildGun(id: WeaponId, withArms = false): THREE.Group {
  const g = new THREE.Group();
  let muzzleZ = -0.45;
  switch (id) {
    case 'ak47': {
      g.add(box(0.05, 0.09, 0.22, MAT.wood, 0, -0.01, 0.3));
      g.add(box(0.055, 0.1, 0.34, MAT.metalDark, 0, 0, 0.04));
      g.add(box(0.05, 0.06, 0.18, MAT.wood, 0, -0.005, -0.17));
      g.add(cylZ(0.013, 0.3, MAT.metalDark, 0, 0.01, -0.36));
      g.add(box(0.04, 0.17, 0.1, MAT.metalGray, 0, -0.13, 0.02, 0.35));
      g.add(box(0.04, 0.09, 0.05, MAT.wood, 0, -0.09, 0.13, -0.3));
      g.add(box(0.02, 0.05, 0.02, MAT.metalDark, 0, 0.05, -0.48));
      muzzleZ = -0.52;
      break;
    }
    case 'm4a4': {
      g.add(box(0.05, 0.09, 0.2, MAT.black, 0, -0.01, 0.28));
      g.add(box(0.055, 0.1, 0.32, MAT.metalDark, 0, 0, 0.04));
      g.add(box(0.03, 0.05, 0.14, MAT.black, 0, 0.08, 0.02));
      g.add(box(0.05, 0.06, 0.2, MAT.black, 0, -0.005, -0.17));
      g.add(cylZ(0.012, 0.28, MAT.metalDark, 0, 0.01, -0.37));
      g.add(box(0.04, 0.15, 0.08, MAT.metalGray, 0, -0.12, 0.0, 0.15));
      g.add(box(0.04, 0.09, 0.05, MAT.black, 0, -0.09, 0.13, -0.3));
      g.add(box(0.02, 0.045, 0.02, MAT.black, 0, 0.05, -0.48));
      muzzleZ = -0.52;
      break;
    }
    case 'awp': {
      g.add(box(0.055, 0.11, 0.6, MAT.awpGreen, 0, 0, 0.06));
      g.add(box(0.05, 0.1, 0.2, MAT.awpGreen, 0, -0.015, 0.36));
      g.add(cylZ(0.015, 0.42, MAT.metalDark, 0, 0.012, -0.45));
      g.add(cylZ(0.032, 0.24, MAT.black, 0, 0.1, -0.02));
      g.add(cylZ(0.027, 0.01, MAT.lens, 0, 0.1, -0.145));
      g.add(cylZ(0.027, 0.01, MAT.lens, 0, 0.1, 0.105));
      g.add(box(0.04, 0.1, 0.1, MAT.metalGray, 0, -0.1, 0.06));
      g.add(box(0.04, 0.09, 0.05, MAT.awpGreen, 0, -0.09, 0.18, -0.3));
      muzzleZ = -0.67;
      break;
    }
    case 'glock': {
      g.add(box(0.04, 0.055, 0.19, MAT.metalDark, 0, 0.01, -0.03));
      g.add(box(0.038, 0.04, 0.16, MAT.black, 0, -0.035, -0.01));
      g.add(box(0.038, 0.1, 0.05, MAT.black, 0, -0.085, 0.06, -0.25));
      muzzleZ = -0.13;
      break;
    }
    case 'usp': {
      g.add(box(0.042, 0.06, 0.2, MAT.metalDark, 0, 0.01, -0.03));
      g.add(cylZ(0.022, 0.14, MAT.black, 0, 0.01, -0.19));
      g.add(box(0.04, 0.1, 0.05, MAT.black, 0, -0.085, 0.06, -0.25));
      muzzleZ = -0.27;
      break;
    }
    case 'deagle': {
      g.add(box(0.045, 0.07, 0.24, MAT.silver, 0, 0.015, -0.04));
      g.add(box(0.042, 0.045, 0.18, MAT.metalGray, 0, -0.035, -0.02));
      g.add(box(0.04, 0.11, 0.055, MAT.black, 0, -0.09, 0.07, -0.25));
      muzzleZ = -0.17;
      break;
    }
    case 'knife': {
      g.add(box(0.008, 0.045, 0.26, MAT.blade, 0, 0.012, -0.16));
      g.add(box(0.004, 0.02, 0.24, MAT.silver, 0, 0.035, -0.15));
      g.add(box(0.03, 0.05, 0.015, MAT.metalDark, 0, 0, -0.025));
      g.add(box(0.022, 0.035, 0.11, MAT.black, 0, -0.005, 0.035));
      muzzleZ = -0.3;
      break;
    }
  }
  const muzzle = new THREE.Object3D();
  muzzle.name = 'muzzle';
  muzzle.position.set(0, 0.01, muzzleZ);
  g.add(muzzle);

  if (withArms) {
    // right hand + forearm coming from bottom-right
    const handR = box(0.07, 0.07, 0.09, MAT.skin, 0.005, -0.075, 0.12);
    const armR = box(0.065, 0.065, 0.34, MAT.skin, 0.06, -0.16, 0.32, 0.42);
    g.add(handR, armR);
    if (id !== 'knife' && id !== 'glock' && id !== 'usp' && id !== 'deagle') {
      const handL = box(0.07, 0.06, 0.09, MAT.skin, -0.01, -0.05, -0.16);
      const armL = box(0.065, 0.065, 0.36, MAT.skin, -0.1, -0.16, 0.06, 0.5);
      armL.rotation.y = 0.35;
      g.add(handL, armL);
    }
  }
  return g;
}

export function disposeGroup(g: THREE.Object3D): void {
  g.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
  });
}

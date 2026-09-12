import * as THREE from 'three';
import type { WeaponId } from '../game/weapons.ts';

const MATS = {
  steel: 0x3a3d42,
  darkSteel: 0x232529,
  wood: 0x7a5230,
  polymer: 0x1e2024,
  olive: 0x4b5340,
  silver: 0x9aa0a8,
  glass: 0x121418,
  blade: 0xc3c9d1,
  c4: 0x2f3a2a,
  led: 0xff2b1c,
} as const;

function box(
  parent: THREE.Group,
  sx: number,
  sy: number,
  sz: number,
  x: number,
  y: number,
  z: number,
  color: number,
  rx = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), new THREE.MeshLambertMaterial({ color }));
  m.position.set(x, y, z);
  m.rotation.x = rx;
  m.castShadow = false;
  m.receiveShadow = false;
  parent.add(m);
  return m;
}

function tube(
  parent: THREE.Group,
  r: number,
  len: number,
  x: number,
  y: number,
  z: number,
  color: number,
): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, len, 10),
    new THREE.MeshLambertMaterial({ color }),
  );
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

/**
 * Procedural weapon models. Local frame: muzzle points down -Z, grip at the
 * origin. `userData.muzzle` marks where the flash and tracer originate, so the
 * same builder serves both the first-person view model and the world model on
 * a character's hands.
 */
export function buildWeaponModel(id: WeaponId): THREE.Group {
  const g = new THREE.Group();
  let muzzle = new THREE.Vector3(0, 0.04, -0.5);

  switch (id) {
    case 'ak47': {
      box(g, 0.07, 0.1, 0.42, 0, 0.03, -0.12, MATS.steel); // receiver
      box(g, 0.06, 0.09, 0.26, 0, 0.02, 0.22, MATS.wood); // stock
      box(g, 0.055, 0.07, 0.24, 0, 0.02, -0.36, MATS.wood); // handguard
      box(g, 0.05, 0.16, 0.09, 0, -0.09, 0.06, MATS.polymer); // grip
      box(g, 0.045, 0.19, 0.1, 0, -0.11, -0.1, MATS.steel, 0.35); // curved magazine
      tube(g, 0.014, 0.34, 0, 0.045, -0.5, MATS.darkSteel); // barrel
      box(g, 0.012, 0.04, 0.03, 0, 0.08, -0.62, MATS.darkSteel); // front sight
      muzzle = new THREE.Vector3(0, 0.045, -0.68);
      break;
    }
    case 'm4a4': {
      box(g, 0.065, 0.1, 0.4, 0, 0.03, -0.1, MATS.polymer);
      box(g, 0.05, 0.07, 0.24, 0, 0.03, 0.22, MATS.polymer); // buffer tube / stock
      box(g, 0.06, 0.07, 0.3, 0, 0.02, -0.4, MATS.darkSteel); // handguard
      box(g, 0.05, 0.15, 0.09, 0, -0.09, 0.05, MATS.polymer);
      box(g, 0.04, 0.17, 0.09, 0, -0.1, -0.08, MATS.darkSteel); // straight mag
      box(g, 0.03, 0.05, 0.3, 0, 0.09, -0.12, MATS.darkSteel); // carry handle / rail
      tube(g, 0.012, 0.3, 0, 0.04, -0.62, MATS.darkSteel);
      muzzle = new THREE.Vector3(0, 0.04, -0.78);
      break;
    }
    case 'awp': {
      box(g, 0.07, 0.11, 0.62, 0, 0.02, -0.1, MATS.olive); // long body
      box(g, 0.06, 0.13, 0.3, 0, 0.0, 0.3, MATS.olive); // stock
      box(g, 0.05, 0.14, 0.09, 0, -0.09, 0.06, MATS.olive);
      tube(g, 0.03, 0.26, 0, 0.12, -0.14, MATS.darkSteel); // scope tube
      tube(g, 0.038, 0.05, 0, 0.12, -0.28, MATS.glass); // objective lens
      box(g, 0.02, 0.05, 0.05, 0, 0.09, -0.02, MATS.darkSteel); // scope mount
      box(g, 0.03, 0.03, 0.1, 0.05, 0.02, 0.02, MATS.steel); // bolt handle
      tube(g, 0.013, 0.5, 0, 0.03, -0.62, MATS.darkSteel);
      muzzle = new THREE.Vector3(0, 0.03, -0.88);
      break;
    }
    case 'deagle': {
      box(g, 0.05, 0.09, 0.3, 0, 0.02, -0.06, MATS.silver); // slide
      box(g, 0.045, 0.14, 0.08, 0, -0.09, 0.06, MATS.darkSteel); // grip
      box(g, 0.03, 0.04, 0.06, 0, -0.02, -0.2, MATS.silver);
      tube(g, 0.011, 0.1, 0, 0.02, -0.24, MATS.darkSteel);
      muzzle = new THREE.Vector3(0, 0.025, -0.3);
      break;
    }
    case 'usp': {
      box(g, 0.042, 0.075, 0.24, 0, 0.02, -0.04, MATS.polymer);
      box(g, 0.04, 0.13, 0.075, 0, -0.08, 0.05, MATS.polymer);
      tube(g, 0.024, 0.18, 0, 0.02, -0.26, MATS.darkSteel); // suppressor
      muzzle = new THREE.Vector3(0, 0.02, -0.36);
      break;
    }
    case 'glock': {
      box(g, 0.04, 0.075, 0.22, 0, 0.02, -0.03, MATS.polymer);
      box(g, 0.038, 0.13, 0.07, 0, -0.08, 0.05, MATS.polymer);
      box(g, 0.02, 0.02, 0.05, 0, 0.045, -0.13, MATS.darkSteel);
      muzzle = new THREE.Vector3(0, 0.02, -0.16);
      break;
    }
    case 'knife': {
      box(g, 0.02, 0.035, 0.13, 0, -0.01, 0.06, MATS.darkSteel); // handle
      box(g, 0.012, 0.05, 0.22, 0, 0.01, -0.1, MATS.blade); // blade
      box(g, 0.05, 0.015, 0.02, 0, 0.0, -0.01, MATS.darkSteel); // guard
      muzzle = new THREE.Vector3(0, 0.01, -0.22);
      break;
    }
    case 'c4': {
      box(g, 0.16, 0.1, 0.22, 0, 0, 0, MATS.c4);
      box(g, 0.1, 0.04, 0.06, 0, 0.06, -0.02, MATS.darkSteel);
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 8, 6),
        new THREE.MeshBasicMaterial({ color: MATS.led }),
      );
      led.position.set(0.04, 0.06, -0.06);
      led.name = 'led';
      g.add(led);
      muzzle = new THREE.Vector3(0, 0, 0);
      break;
    }
    default:
      box(g, 0.05, 0.08, 0.3, 0, 0, -0.1, MATS.steel);
      break;
  }

  g.userData.muzzle = muzzle;
  return g;
}

export function muzzleOf(model: THREE.Object3D): THREE.Vector3 {
  return (model.userData.muzzle as THREE.Vector3 | undefined) ?? new THREE.Vector3(0, 0, -0.4);
}

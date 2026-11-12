// Procedural weapon models. Each model has its origin at the pistol grip,
// barrel pointing towards -Z, and a child named "muzzle" at the barrel tip.
import * as THREE from 'three';
import type { WeaponId } from '../core/weapons.ts';

const mats = {
  black: new THREE.MeshLambertMaterial({ color: 0x1c1c1e }),
  dark: new THREE.MeshLambertMaterial({ color: 0x38393c }),
  wood: new THREE.MeshLambertMaterial({ color: 0x7b4a22 }),
  woodDark: new THREE.MeshLambertMaterial({ color: 0x5a3417 }),
  green: new THREE.MeshLambertMaterial({ color: 0x55703c }),
  silver: new THREE.MeshLambertMaterial({ color: 0xb9babd }),
  polymer: new THREE.MeshLambertMaterial({ color: 0x2b2b2b }),
  tan: new THREE.MeshLambertMaterial({ color: 0x8c7b5a }),
  lens: new THREE.MeshLambertMaterial({ color: 0x2a4f7a, emissive: 0x0a1a30 }),
  blade: new THREE.MeshLambertMaterial({ color: 0xd0d4d8, emissive: 0x111111 }),
};

function box(g: THREE.Group, mat: THREE.Material, w: number, h: number, d: number, x: number, y: number, z: number, rx = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.x = rx;
  m.castShadow = true;
  g.add(m);
  return m;
}

function cyl(g: THREE.Group, mat: THREE.Material, r: number, len: number, x: number, y: number, z: number) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = true;
  g.add(m);
  return m;
}

function muzzle(g: THREE.Group, z: number, y = 0.035) {
  const o = new THREE.Object3D();
  o.name = 'muzzle';
  o.position.set(0, y, z);
  g.add(o);
}

export function buildGun(id: WeaponId): THREE.Group {
  const g = new THREE.Group();
  g.name = `gun-${id}`;
  switch (id) {
    case 'ak47': {
      box(g, mats.dark, 0.06, 0.085, 0.42, 0, 0.04, -0.1); // receiver
      box(g, mats.dark, 0.05, 0.02, 0.3, 0, 0.09, -0.1); // dust cover
      box(g, mats.wood, 0.068, 0.07, 0.2, 0, 0.03, -0.38); // handguard
      box(g, mats.woodDark, 0.06, 0.03, 0.18, 0, 0.075, -0.37); // upper handguard
      cyl(g, mats.black, 0.012, 0.3, 0, 0.045, -0.6); // barrel
      cyl(g, mats.black, 0.008, 0.2, 0, 0.075, -0.55); // gas tube
      box(g, mats.black, 0.012, 0.05, 0.015, 0, 0.08, -0.68); // front sight
      box(g, mats.wood, 0.05, 0.1, 0.3, 0, -0.02, 0.24, -0.1); // stock
      box(g, mats.wood, 0.04, 0.11, 0.05, 0, -0.06, 0.03, -0.35); // grip
      box(g, mats.black, 0.035, 0.12, 0.07, 0, -0.07, -0.15, 0.15); // magazine (curved)
      box(g, mats.black, 0.035, 0.1, 0.07, 0, -0.16, -0.12, 0.45);
      muzzle(g, -0.76, 0.045);
      break;
    }
    case 'm4a4': {
      box(g, mats.black, 0.055, 0.09, 0.38, 0, 0.04, -0.08); // receiver
      box(g, mats.dark, 0.035, 0.025, 0.36, 0, 0.1, -0.12); // top rail
      box(g, mats.black, 0.02, 0.05, 0.03, 0, 0.13, 0.05); // rear sight
      box(g, mats.polymer, 0.07, 0.075, 0.26, 0, 0.04, -0.4); // handguard
      cyl(g, mats.black, 0.011, 0.24, 0, 0.045, -0.64); // barrel
      cyl(g, mats.dark, 0.016, 0.06, 0, 0.045, -0.77); // flash hider
      box(g, mats.black, 0.02, 0.06, 0.02, 0, 0.09, -0.52); // front sight
      cyl(g, mats.dark, 0.018, 0.2, 0, 0.03, 0.18); // buffer tube
      box(g, mats.polymer, 0.05, 0.1, 0.16, 0, 0.0, 0.3); // stock
      box(g, mats.polymer, 0.04, 0.11, 0.05, 0, -0.06, 0.03, -0.35); // grip
      box(g, mats.black, 0.033, 0.18, 0.065, 0, -0.1, -0.13, 0.12); // straight mag
      muzzle(g, -0.82, 0.045);
      break;
    }
    case 'awp': {
      box(g, mats.green, 0.07, 0.1, 0.6, 0, 0.03, -0.12); // body
      box(g, mats.green, 0.06, 0.15, 0.3, 0, -0.01, 0.3); // stock
      box(g, mats.green, 0.06, 0.04, 0.12, 0, -0.1, 0.36); // stock lower
      cyl(g, mats.black, 0.016, 0.62, 0, 0.05, -0.72); // barrel
      cyl(g, mats.dark, 0.024, 0.08, 0, 0.05, -1.04); // muzzle brake
      cyl(g, mats.black, 0.032, 0.34, 0, 0.14, -0.12); // scope tube
      cyl(g, mats.black, 0.042, 0.06, 0, 0.14, -0.3); // objective bell
      cyl(g, mats.black, 0.036, 0.05, 0, 0.14, 0.06); // eyepiece
      box(g, mats.black, 0.03, 0.04, 0.03, 0, 0.17, -0.12); // turret
      box(g, mats.black, 0.025, 0.04, 0.03, 0, 0.1, -0.05); // ring
      box(g, mats.black, 0.025, 0.04, 0.03, 0, 0.1, -0.2); // ring
      box(g, mats.black, 0.04, 0.09, 0.07, 0, -0.06, -0.12); // mag
      box(g, mats.dark, 0.08, 0.015, 0.015, 0.05, 0.07, 0.02); // bolt handle
      box(g, mats.green, 0.04, 0.1, 0.05, 0, -0.05, 0.08, -0.3); // grip
      muzzle(g, -1.08, 0.05);
      break;
    }
    case 'glock': {
      box(g, mats.polymer, 0.03, 0.035, 0.18, 0, 0.065, -0.06); // slide
      box(g, mats.polymer, 0.028, 0.025, 0.15, 0, 0.035, -0.05); // frame
      box(g, mats.polymer, 0.03, 0.11, 0.05, 0, -0.02, 0.0, -0.25); // grip
      box(g, mats.dark, 0.01, 0.025, 0.03, 0, 0.02, -0.04); // trigger guard
      muzzle(g, -0.16, 0.065);
      break;
    }
    case 'usp': {
      box(g, mats.dark, 0.03, 0.035, 0.19, 0, 0.065, -0.06);
      box(g, mats.polymer, 0.028, 0.025, 0.16, 0, 0.035, -0.05);
      box(g, mats.polymer, 0.03, 0.11, 0.05, 0, -0.02, 0.0, -0.25);
      cyl(g, mats.black, 0.017, 0.15, 0, 0.065, -0.23); // suppressor
      muzzle(g, -0.31, 0.065);
      break;
    }
    case 'deagle': {
      box(g, mats.silver, 0.036, 0.05, 0.25, 0, 0.07, -0.08); // slide
      box(g, mats.silver, 0.032, 0.03, 0.2, 0, 0.035, -0.07);
      box(g, mats.black, 0.034, 0.12, 0.055, 0, -0.03, 0.0, -0.22); // grip
      box(g, mats.dark, 0.01, 0.03, 0.035, 0, 0.015, -0.05);
      muzzle(g, -0.21, 0.07);
      break;
    }
    case 'knife': {
      box(g, mats.polymer, 0.028, 0.032, 0.12, 0, 0, 0.0); // handle
      box(g, mats.dark, 0.05, 0.012, 0.012, 0, 0.0, -0.065); // guard
      box(g, mats.blade, 0.006, 0.035, 0.19, 0, 0.004, -0.165); // blade
      const tip = box(g, mats.blade, 0.006, 0.025, 0.04, 0, 0.0, -0.27);
      tip.rotation.x = 0.4;
      muzzle(g, -0.28, 0);
      break;
    }
  }
  return g;
}

/** C4 explosive brick model. */
export function buildBomb(): THREE.Group {
  const g = new THREE.Group();
  const tan = new THREE.MeshLambertMaterial({ color: 0xa18a5c });
  const black = mats.black;
  box(g, tan, 0.32, 0.08, 0.2, 0, 0.04, 0);
  box(g, tan, 0.3, 0.06, 0.18, 0, 0.11, 0);
  box(g, black, 0.12, 0.025, 0.08, 0.05, 0.155, 0); // keypad
  const screen = box(g, new THREE.MeshBasicMaterial({ color: 0x55ff66 }), 0.07, 0.01, 0.035, -0.07, 0.15, -0.03);
  screen.name = 'screen';
  const wireMat = new THREE.MeshLambertMaterial({ color: 0xc02020 });
  box(g, wireMat, 0.3, 0.01, 0.01, 0, 0.1, 0.1);
  box(g, new THREE.MeshLambertMaterial({ color: 0x2050c0 }), 0.3, 0.01, 0.01, 0, 0.09, -0.1);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff2020 }));
  led.position.set(0.12, 0.16, 0.06);
  led.name = 'led';
  g.add(led);
  return g;
}

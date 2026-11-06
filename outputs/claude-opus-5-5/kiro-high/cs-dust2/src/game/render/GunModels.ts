// Procedural weapon models built from primitives. Origin = top of pistol grip
// (where the right hand holds it); barrel points along -Z. Used both for the
// first-person viewmodel and the third-person models in soldiers' hands.

import * as THREE from 'three';
import type { WeaponId } from '../weapons/WeaponDefs';

let M: Record<string, THREE.MeshStandardMaterial> | null = null;
function mats() {
  if (M) return M;
  M = {
    // metalness kept low: there is no environment map, so fully metallic surfaces would render black
    steel: new THREE.MeshStandardMaterial({ color: 0x5a5e64, roughness: 0.38, metalness: 0.35 }),
    darkSteel: new THREE.MeshStandardMaterial({ color: 0x34373b, roughness: 0.45, metalness: 0.3 }),
    polymer: new THREE.MeshStandardMaterial({ color: 0x3a3d42, roughness: 0.7, metalness: 0.05 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x8a4b22, roughness: 0.7, metalness: 0 }),
    woodDark: new THREE.MeshStandardMaterial({ color: 0x5c3015, roughness: 0.7 }),
    bakelite: new THREE.MeshStandardMaterial({ color: 0x6b2f12, roughness: 0.55 }),
    awpGreen: new THREE.MeshStandardMaterial({ color: 0x4d6236, roughness: 0.75 }),
    silver: new THREE.MeshStandardMaterial({ color: 0xc9ccd1, roughness: 0.3, metalness: 0.45 }),
    blade: new THREE.MeshStandardMaterial({ color: 0xdde2e8, roughness: 0.22, metalness: 0.5 }),
    lens: new THREE.MeshStandardMaterial({ color: 0x223355, roughness: 0.1, metalness: 0.5, emissive: 0x0a1630 }),
    c4: new THREE.MeshStandardMaterial({ color: 0xa08a5a, roughness: 0.8 }),
    c4Pack: new THREE.MeshStandardMaterial({ color: 0x5a4c34, roughness: 0.9 }),
    wire: new THREE.MeshStandardMaterial({ color: 0xaa2222, roughness: 0.6 }),
    screen: new THREE.MeshStandardMaterial({ color: 0x1f3a1f, emissive: 0x2a6a2a, roughness: 0.4 }),
  };
  return M;
}

function box(
  g: THREE.Object3D,
  mat: THREE.Material,
  sx: number,
  sy: number,
  sz: number,
  x: number,
  y: number,
  z: number,
  rx = 0,
  ry = 0,
  rz = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = false; // tiny parts: skip shadow pass (draw-call budget)
  g.add(m);
  return m;
}

function cyl(g: THREE.Object3D, mat: THREE.Material, r: number, len: number, x: number, y: number, z: number, seg = 10): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = false; // tiny parts: skip shadow pass (draw-call budget)
  g.add(m);
  return m;
}

function muzzle(g: THREE.Group, x: number, y: number, z: number) {
  const o = new THREE.Object3D();
  o.position.set(x, y, z);
  g.add(o);
  g.userData.muzzle = o;
}

function buildAK(): THREE.Group {
  const m = mats();
  const g = new THREE.Group();
  box(g, m.steel, 0.05, 0.07, 0.3, 0, 0.05, -0.08);
  box(g, m.darkSteel, 0.046, 0.022, 0.28, 0, 0.094, -0.08);
  box(g, m.wood, 0.056, 0.06, 0.2, 0, 0.04, -0.33);
  box(g, m.wood, 0.046, 0.03, 0.17, 0, 0.088, -0.32);
  cyl(g, m.darkSteel, 0.011, 0.28, 0, 0.055, -0.56);
  cyl(g, m.steel, 0.012, 0.2, 0, 0.09, -0.43);
  box(g, m.darkSteel, 0.012, 0.045, 0.016, 0, 0.085, -0.66);
  cyl(g, m.darkSteel, 0.016, 0.06, 0, 0.055, -0.72);
  box(g, m.darkSteel, 0.02, 0.03, 0.02, 0, 0.105, -0.2); // rear sight
  box(g, m.wood, 0.045, 0.07, 0.26, 0, 0.025, 0.2, -0.12);
  box(g, m.woodDark, 0.048, 0.13, 0.03, 0, -0.005, 0.33, -0.12);
  box(g, m.woodDark, 0.036, 0.1, 0.045, 0, -0.045, 0.02, 0.32);
  box(g, m.steel, 0.012, 0.03, 0.06, 0, -0.01, -0.04); // trigger guard
  const mag = new THREE.Group();
  mag.position.set(0, 0.01, -0.12);
  box(mag, m.bakelite, 0.032, 0.085, 0.062, 0, -0.045, 0, 0.12);
  box(mag, m.bakelite, 0.032, 0.08, 0.06, 0, -0.115, -0.022, 0.32);
  box(mag, m.bakelite, 0.032, 0.075, 0.058, 0, -0.178, -0.062, 0.52);
  g.add(mag);
  g.userData.mag = mag;
  muzzle(g, 0, 0.055, -0.76);
  return g;
}

function buildM4(): THREE.Group {
  const m = mats();
  const g = new THREE.Group();
  box(g, m.polymer, 0.05, 0.055, 0.22, 0, 0.025, -0.06);
  box(g, m.steel, 0.05, 0.05, 0.27, 0, 0.078, -0.08);
  box(g, m.darkSteel, 0.026, 0.022, 0.24, 0, 0.115, -0.08); // rail
  box(g, m.darkSteel, 0.03, 0.035, 0.03, 0, 0.14, 0.02); // rear sight
  box(g, m.polymer, 0.062, 0.062, 0.25, 0, 0.075, -0.34);
  for (let k = 0; k < 5; k++) box(g, m.darkSteel, 0.066, 0.008, 0.02, 0, 0.075 + 0.03, -0.25 - k * 0.045);
  cyl(g, m.darkSteel, 0.01, 0.22, 0, 0.075, -0.56);
  box(g, m.darkSteel, 0.012, 0.06, 0.016, 0, 0.115, -0.45);
  cyl(g, m.darkSteel, 0.016, 0.06, 0, 0.075, -0.68);
  box(g, m.darkSteel, 0.03, 0.03, 0.18, 0, 0.07, 0.15);
  box(g, m.polymer, 0.046, 0.085, 0.13, 0, 0.045, 0.23);
  box(g, m.polymer, 0.048, 0.11, 0.025, 0, 0.04, 0.3);
  box(g, m.polymer, 0.034, 0.1, 0.042, 0, -0.045, 0.03, 0.3);
  const mag = new THREE.Group();
  mag.position.set(0, 0.0, -0.13);
  box(mag, m.darkSteel, 0.03, 0.16, 0.066, 0, -0.075, -0.01, 0.12);
  g.add(mag);
  g.userData.mag = mag;
  muzzle(g, 0, 0.075, -0.72);
  return g;
}

function buildAWP(): THREE.Group {
  const m = mats();
  const g = new THREE.Group();
  box(g, m.awpGreen, 0.06, 0.12, 0.34, 0, 0.0, 0.22);
  box(g, m.awpGreen, 0.062, 0.17, 0.04, 0, -0.01, 0.41);
  box(g, m.polymer, 0.064, 0.04, 0.06, 0, 0.07, 0.3); // cheek rest
  box(g, m.steel, 0.05, 0.06, 0.32, 0, 0.055, -0.1);
  box(g, m.awpGreen, 0.066, 0.07, 0.34, 0, 0.025, -0.4);
  cyl(g, m.darkSteel, 0.014, 0.5, 0, 0.06, -0.78);
  cyl(g, m.darkSteel, 0.022, 0.08, 0, 0.06, -1.05);
  // scope
  cyl(g, m.darkSteel, 0.024, 0.3, 0, 0.14, -0.1, 14);
  cyl(g, m.darkSteel, 0.034, 0.07, 0, 0.14, -0.28, 14);
  cyl(g, m.darkSteel, 0.03, 0.06, 0, 0.14, 0.07, 14);
  const lensF = cyl(g, m.lens, 0.03, 0.005, 0, 0.14, -0.316, 14);
  lensF.castShadow = false;
  box(g, m.steel, 0.02, 0.05, 0.02, 0, 0.1, -0.2);
  box(g, m.steel, 0.02, 0.05, 0.02, 0, 0.1, 0.0);
  // bolt
  const bolt = new THREE.Group();
  bolt.position.set(0.035, 0.065, 0.02);
  box(bolt, m.steel, 0.06, 0.012, 0.012, 0.03, 0, 0);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), m.steel);
  knob.position.set(0.065, -0.005, 0);
  bolt.add(knob);
  g.add(bolt);
  g.userData.bolt = bolt;
  box(g, m.polymer, 0.036, 0.1, 0.045, 0, -0.045, 0.04, 0.35);
  const mag = new THREE.Group();
  mag.position.set(0, 0.0, -0.12);
  box(mag, m.darkSteel, 0.036, 0.07, 0.085, 0, -0.035, 0);
  g.add(mag);
  g.userData.mag = mag;
  muzzle(g, 0, 0.06, -1.1);
  return g;
}

function buildPistol(kind: 'glock' | 'usp' | 'deagle'): THREE.Group {
  const m = mats();
  const g = new THREE.Group();
  if (kind === 'deagle') {
    box(g, m.silver, 0.034, 0.045, 0.25, 0, 0.06, -0.095);
    box(g, m.silver, 0.03, 0.02, 0.2, 0, 0.03, -0.08);
    box(g, m.silver, 0.01, 0.012, 0.22, 0, 0.088, -0.095); // top rib
    box(g, m.polymer, 0.033, 0.115, 0.052, 0, -0.04, 0.005, 0.22);
    box(g, m.silver, 0.01, 0.025, 0.05, 0, 0.0, -0.04);
    const mag = new THREE.Group();
    mag.position.set(0, -0.09, 0.02);
    box(mag, m.darkSteel, 0.026, 0.02, 0.045, 0, 0, 0, 0.22);
    g.add(mag);
    g.userData.mag = mag;
    muzzle(g, 0, 0.06, -0.225);
  } else {
    const slideLen = kind === 'usp' ? 0.19 : 0.18;
    box(g, kind === 'usp' ? m.steel : m.polymer, 0.03, 0.035, slideLen, 0, 0.055, -0.07);
    box(g, m.polymer, 0.028, 0.025, 0.16, 0, 0.026, -0.06);
    box(g, m.polymer, 0.028, 0.1, 0.045, 0, -0.035, 0.0, 0.25);
    box(g, m.polymer, 0.008, 0.022, 0.045, 0, 0.002, -0.04);
    box(g, m.darkSteel, 0.008, 0.01, 0.01, 0, 0.077, -0.15);
    const mag = new THREE.Group();
    mag.position.set(0, -0.085, 0.015);
    box(mag, m.darkSteel, 0.024, 0.016, 0.04, 0, 0, 0, 0.25);
    g.add(mag);
    g.userData.mag = mag;
    if (kind === 'usp') {
      cyl(g, m.darkSteel, 0.016, 0.16, 0, 0.055, -0.24, 12);
      muzzle(g, 0, 0.055, -0.33);
    } else {
      muzzle(g, 0, 0.055, -0.165);
    }
  }
  return g;
}

function buildKnife(): THREE.Group {
  const m = mats();
  const g = new THREE.Group();
  box(g, m.polymer, 0.026, 0.032, 0.11, 0, 0, 0.0);
  box(g, m.steel, 0.05, 0.014, 0.012, 0, 0, -0.06);
  // tapered blade (custom prism)
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.016);
  shape.lineTo(0.17, -0.012);
  shape.lineTo(0.2, 0.012);
  shape.lineTo(0.15, 0.02);
  shape.lineTo(0, 0.018);
  shape.lineTo(0, -0.016);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.005, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 1 });
  geo.translate(0, 0, -0.0025);
  const blade = new THREE.Mesh(geo, m.blade);
  blade.rotation.y = Math.PI / 2;
  blade.position.set(0, 0.004, -0.065);
  blade.castShadow = true;
  g.add(blade);
  muzzle(g, 0, 0, -0.25);
  return g;
}

export function buildC4(): THREE.Group {
  const m = mats();
  const g = new THREE.Group();
  for (let k = 0; k < 3; k++) box(g, m.c4, 0.07, 0.06, 0.2, -0.075 + k * 0.075, 0.03, 0);
  box(g, m.c4Pack, 0.24, 0.02, 0.06, 0, 0.065, 0.05);
  box(g, m.screen, 0.11, 0.012, 0.06, 0, 0.07, -0.045);
  box(g, m.wire, 0.23, 0.008, 0.008, 0, 0.062, 0.09);
  box(g, m.wire, 0.008, 0.008, 0.2, 0.1, 0.062, 0);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff2020 }));
  led.position.set(0.08, 0.08, -0.06);
  g.add(led);
  g.userData.led = led;
  return g;
}

export function buildWeaponModel(id: WeaponId): THREE.Group {
  switch (id) {
    case 'ak47':
      return buildAK();
    case 'm4a4':
      return buildM4();
    case 'awp':
      return buildAWP();
    case 'glock':
    case 'usp':
    case 'deagle':
      return buildPistol(id);
    case 'knife':
      return buildKnife();
  }
}

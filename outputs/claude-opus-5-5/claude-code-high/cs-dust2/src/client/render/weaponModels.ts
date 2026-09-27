// Procedural weapon models. Convention: origin = right-hand grip, barrel along -Z, +Y up.
import * as THREE from 'three';
import type { WeaponId } from '../../core/weapons.ts';

export interface WeaponModel {
  group: THREE.Group;
  /** muzzle position in model space */
  muzzle: THREE.Vector3;
  /** support-hand position in model space (null = one-handed) */
  foregrip: THREE.Vector3 | null;
  /** magazine sub-object (animated during reloads in the viewmodel) */
  mag: THREE.Object3D | null;
}

let M: Record<string, THREE.Material> | null = null;
function mats() {
  if (M) return M;
  const phong = (color: number, shininess = 30, specular = 0x333333) => new THREE.MeshPhongMaterial({ color, shininess, specular });
  M = {
    black: phong(0x1c1c1f, 40, 0x444444),
    gunmetal: phong(0x34363b, 60, 0x555555),
    wood: phong(0x8a4a22, 20, 0x221100),
    woodDark: phong(0x5a3016, 20, 0x221100),
    polymer: phong(0x2a2a2c, 15, 0x222222),
    tan: phong(0x6f6552, 15, 0x222222),
    awp: phong(0x4b5e3b, 25, 0x222222),
    silver: phong(0xb8b9bd, 90, 0x999999),
    blade: phong(0xd0d4d8, 120, 0xcccccc),
    c4: phong(0xb09a6c, 10, 0x111111),
    c4dark: phong(0x2b2b2b, 20, 0x222222),
    red: phong(0xb3261e, 20, 0x220000),
    blue: phong(0x2a4fb3, 20, 0x000022),
    lens: new THREE.MeshPhongMaterial({ color: 0x1b3346, shininess: 120, specular: 0x88aacc, emissive: 0x061018 }),
    screen: new THREE.MeshBasicMaterial({ color: 0x57d66b }),
  };
  return M;
}

function part(
  g: THREE.Object3D,
  mat: THREE.Material,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  rx = 0,
  ry = 0,
  rz = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  g.add(m);
  return m;
}

function cyl(g: THREE.Object3D, mat: THREE.Material, r: number, len: number, x: number, y: number, z: number, seg = 10): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = true;
  g.add(m);
  return m;
}

function ak47(): WeaponModel {
  const m = mats();
  const g = new THREE.Group();
  part(g, m.gunmetal, 0.056, 0.075, 0.36, 0, 0.065, -0.07); // receiver
  part(g, m.black, 0.054, 0.022, 0.32, 0, 0.112, -0.06); // dust cover
  part(g, m.woodDark, 0.038, 0.105, 0.05, 0, -0.01, 0.025, 0.32); // grip
  part(g, m.wood, 0.042, 0.068, 0.24, 0, 0.045, 0.2, -0.12); // stock
  part(g, m.woodDark, 0.046, 0.1, 0.03, 0, 0.022, 0.325, -0.12); // butt plate
  part(g, m.wood, 0.064, 0.058, 0.2, 0, 0.058, -0.34); // lower handguard
  part(g, m.wood, 0.046, 0.034, 0.18, 0, 0.108, -0.33); // upper handguard
  cyl(g, m.black, 0.011, 0.26, 0, 0.07, -0.55); // barrel
  cyl(g, m.black, 0.007, 0.2, 0, 0.1, -0.5); // gas tube
  part(g, m.black, 0.014, 0.05, 0.014, 0, 0.1, -0.62); // front sight
  part(g, m.black, 0.03, 0.02, 0.03, 0, 0.125, -0.19); // rear sight
  cyl(g, m.black, 0.016, 0.05, 0, 0.07, -0.69); // muzzle brake
  part(g, m.black, 0.012, 0.02, 0.05, 0, -0.005, -0.075); // trigger guard
  const mag = new THREE.Group();
  part(mag, m.gunmetal, 0.032, 0.1, 0.068, 0, -0.03, 0, 0.18);
  part(mag, m.gunmetal, 0.032, 0.1, 0.066, 0, -0.12, -0.035, 0.5);
  mag.position.set(0, 0.03, -0.2);
  g.add(mag);
  return { group: g, muzzle: new THREE.Vector3(0, 0.07, -0.72), foregrip: new THREE.Vector3(0, 0.035, -0.3), mag };
}

function m4a4(): WeaponModel {
  const m = mats();
  const g = new THREE.Group();
  part(g, m.black, 0.052, 0.07, 0.3, 0, 0.065, -0.05); // upper receiver
  part(g, m.polymer, 0.05, 0.045, 0.18, 0, 0.018, -0.07); // lower receiver
  part(g, m.black, 0.03, 0.02, 0.28, 0, 0.11, -0.12); // top rail
  part(g, m.black, 0.012, 0.045, 0.03, 0, 0.14, -0.02); // rear sight
  part(g, m.polymer, 0.036, 0.1, 0.048, 0, -0.012, 0.03, 0.3); // grip
  part(g, m.gunmetal, 0.062, 0.062, 0.24, 0, 0.068, -0.33); // handguard
  part(g, m.black, 0.012, 0.012, 0.22, 0.034, 0.068, -0.33); // side rail
  part(g, m.black, 0.012, 0.012, 0.22, -0.034, 0.068, -0.33);
  cyl(g, m.black, 0.01, 0.2, 0, 0.068, -0.55); // barrel
  cyl(g, m.gunmetal, 0.014, 0.06, 0, 0.068, -0.66); // flash hider
  part(g, m.black, 0.012, 0.06, 0.012, 0, 0.11, -0.44); // front sight post
  cyl(g, m.black, 0.014, 0.18, 0, 0.078, 0.17); // buffer tube
  part(g, m.polymer, 0.045, 0.085, 0.14, 0, 0.055, 0.22); // stock
  part(g, m.black, 0.048, 0.11, 0.03, 0, 0.045, 0.3); // butt pad
  const mag = new THREE.Group();
  part(mag, m.gunmetal, 0.028, 0.15, 0.064, 0, -0.06, 0, 0.12);
  mag.position.set(0, 0.01, -0.16);
  g.add(mag);
  return { group: g, muzzle: new THREE.Vector3(0, 0.068, -0.7), foregrip: new THREE.Vector3(0, 0.03, -0.3), mag };
}

function awp(): WeaponModel {
  const m = mats();
  const g = new THREE.Group();
  part(g, m.awp, 0.064, 0.08, 0.42, 0, 0.055, -0.05); // chassis
  part(g, m.awp, 0.052, 0.13, 0.26, 0, 0.02, 0.24); // stock
  part(g, m.black, 0.056, 0.14, 0.035, 0, 0.015, 0.385); // butt pad
  part(g, m.awp, 0.05, 0.035, 0.16, 0, 0.1, 0.2); // cheek rest
  part(g, m.awp, 0.04, 0.1, 0.05, 0, -0.02, 0.04, 0.35); // grip
  cyl(g, m.gunmetal, 0.014, 0.66, 0, 0.07, -0.58); // barrel
  part(g, m.black, 0.036, 0.036, 0.08, 0, 0.07, -0.93); // muzzle brake
  // scope
  cyl(g, m.black, 0.027, 0.3, 0, 0.155, -0.07, 14);
  cyl(g, m.black, 0.036, 0.07, 0, 0.155, -0.25, 14);
  cyl(g, m.black, 0.032, 0.06, 0, 0.155, 0.1, 14);
  const lensF = cyl(g, m.lens, 0.031, 0.004, 0, 0.155, -0.287, 14);
  lensF.castShadow = false;
  part(g, m.black, 0.02, 0.05, 0.03, 0, 0.115, -0.16); // mounts
  part(g, m.black, 0.02, 0.05, 0.03, 0, 0.115, 0.03);
  cyl(g, m.black, 0.012, 0.03, 0, 0.19, -0.07).rotation.set(0, 0, 0); // turret
  // bolt handle
  const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.07, 8), m.gunmetal);
  bolt.rotation.z = Math.PI / 2;
  bolt.position.set(0.055, 0.08, 0.1);
  g.add(bolt);
  part(g, m.gunmetal, 0.02, 0.02, 0.02, 0.09, 0.08, 0.1);
  const mag = new THREE.Group();
  part(mag, m.black, 0.04, 0.07, 0.085, 0, -0.03, 0);
  mag.position.set(0, 0.02, -0.08);
  g.add(mag);
  return { group: g, muzzle: new THREE.Vector3(0, 0.07, -0.98), foregrip: new THREE.Vector3(0, 0.02, -0.32), mag };
}

function glock(): WeaponModel {
  const m = mats();
  const g = new THREE.Group();
  part(g, m.polymer, 0.029, 0.034, 0.185, 0, 0.078, -0.06); // slide
  part(g, m.black, 0.027, 0.026, 0.16, 0, 0.048, -0.05); // frame
  part(g, m.polymer, 0.03, 0.105, 0.05, 0, -0.005, 0.012, 0.28); // grip
  part(g, m.black, 0.01, 0.018, 0.04, 0, 0.022, -0.06); // trigger guard
  part(g, m.black, 0.008, 0.01, 0.01, 0, 0.098, -0.14); // front sight
  const mag = new THREE.Group();
  part(mag, m.black, 0.024, 0.02, 0.042, 0, -0.06, 0.03, 0.28);
  g.add(mag);
  return { group: g, muzzle: new THREE.Vector3(0, 0.078, -0.155), foregrip: null, mag };
}

function usp(): WeaponModel {
  const m = mats();
  const g = new THREE.Group();
  part(g, m.gunmetal, 0.031, 0.036, 0.2, 0, 0.078, -0.065);
  part(g, m.black, 0.028, 0.026, 0.17, 0, 0.047, -0.055);
  part(g, m.black, 0.031, 0.108, 0.052, 0, -0.006, 0.014, 0.26);
  part(g, m.black, 0.01, 0.018, 0.04, 0, 0.02, -0.06);
  cyl(g, m.black, 0.017, 0.16, 0, 0.075, -0.245, 12); // silencer
  const mag = new THREE.Group();
  part(mag, m.black, 0.025, 0.02, 0.044, 0, -0.062, 0.03, 0.26);
  g.add(mag);
  return { group: g, muzzle: new THREE.Vector3(0, 0.075, -0.33), foregrip: null, mag };
}

function deagle(): WeaponModel {
  const m = mats();
  const g = new THREE.Group();
  part(g, m.silver, 0.037, 0.046, 0.25, 0, 0.083, -0.085); // slide
  part(g, m.silver, 0.03, 0.02, 0.22, 0, 0.11, -0.09); // top rib
  part(g, m.gunmetal, 0.034, 0.03, 0.2, 0, 0.048, -0.07); // frame
  part(g, m.black, 0.036, 0.115, 0.056, 0, -0.008, 0.018, 0.2); // grip
  part(g, m.gunmetal, 0.012, 0.02, 0.05, 0, 0.02, -0.07);
  part(g, m.black, 0.02, 0.014, 0.01, 0, 0.12, 0.03); // rear sight
  const mag = new THREE.Group();
  part(mag, m.black, 0.03, 0.02, 0.05, 0, -0.07, 0.035, 0.2);
  g.add(mag);
  return { group: g, muzzle: new THREE.Vector3(0, 0.083, -0.215), foregrip: null, mag };
}

function knife(): WeaponModel {
  const m = mats();
  const g = new THREE.Group();
  part(g, m.black, 0.026, 0.03, 0.11, 0, 0, 0.0); // handle
  part(g, m.gunmetal, 0.018, 0.05, 0.012, 0, 0.004, -0.058); // guard
  part(g, m.blade, 0.005, 0.032, 0.16, 0, 0.006, -0.14); // blade
  part(g, m.blade, 0.005, 0.02, 0.05, 0, 0.012, -0.235, -0.45); // tip
  part(g, m.gunmetal, 0.028, 0.034, 0.015, 0, 0, 0.058); // pommel
  return { group: g, muzzle: new THREE.Vector3(0, 0, -0.25), foregrip: null, mag: null };
}

function c4(): WeaponModel {
  const m = mats();
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) part(g, m.c4, 0.058, 0.05, 0.13, -0.06 + i * 0.06, 0.02, -0.05);
  part(g, m.c4dark, 0.12, 0.012, 0.09, 0, 0.051, -0.05); // keypad plate
  const screen = part(g, m.screen, 0.05, 0.004, 0.022, 0, 0.059, -0.075);
  screen.castShadow = false;
  for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) part(g, m.gunmetal, 0.012, 0.006, 0.01, -0.02 + k * 0.02, 0.059, -0.045 + r * 0.016);
  part(g, m.red, 0.006, 0.006, 0.14, 0.05, 0.05, -0.05, 0, 0.1);
  part(g, m.blue, 0.006, 0.006, 0.14, -0.05, 0.05, -0.05, 0, -0.1);
  part(g, m.black, 0.19, 0.01, 0.014, 0, 0.02, 0.0); // tape
  part(g, m.black, 0.19, 0.01, 0.014, 0, 0.02, -0.1);
  return { group: g, muzzle: new THREE.Vector3(0, 0, -0.1), foregrip: new THREE.Vector3(-0.1, 0, -0.05), mag: null };
}

const BUILDERS: Record<WeaponId, () => WeaponModel> = { ak47, m4a4, awp, glock, usp, deagle, knife, c4 };

export function buildWeaponModel(id: WeaponId): WeaponModel {
  return BUILDERS[id]();
}

// Procedural weapon meshes. Each model is built from primitives with the barrel along -Z and
// the origin at the top of the pistol grip, in real-world metres. The same builder serves the
// first-person view model and the weapon carried by third-person characters.

import * as THREE from 'three';
import { WeaponId } from '../sim/weapons';

export interface WeaponModel {
  group: THREE.Group;
  /** Muzzle tip in model space. */
  muzzle: THREE.Vector3;
  /** Where the trigger hand and the support hand hold the weapon (model space). */
  gripR: THREE.Vector3;
  gripL: THREE.Vector3;
  /** Detachable magazine (animated during reloads), if any. */
  mag: THREE.Object3D | null;
  /** Bolt handle / slide (animated on fire), if any. */
  slide: THREE.Object3D | null;
}

const matCache = new Map<string, THREE.MeshStandardMaterial>();
function mat(color: number, roughness = 0.6, metalness = 0.15): THREE.MeshStandardMaterial {
  const key = `${color}:${roughness}:${metalness}`;
  let m = matCache.get(key);
  if (!m) {
    // no environment map is used, so keep metalness moderate or metals would render almost black
    m = new THREE.MeshStandardMaterial({ color, roughness, metalness: Math.min(metalness, 0.38) });
    matCache.set(key, m);
  }
  return m;
}

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 12);
cylGeo.rotateX(Math.PI / 2); // axis along Z

function box(parent: THREE.Object3D, w: number, h: number, d: number, x: number, y: number, z: number, m: THREE.Material, rx = 0): THREE.Mesh {
  const mesh = new THREE.Mesh(boxGeo, m);
  mesh.scale.set(w, h, d);
  mesh.position.set(x, y, z);
  mesh.rotation.x = rx;
  parent.add(mesh);
  return mesh;
}

/** Cylinder along Z, centred at (x, y, z). */
function cyl(parent: THREE.Object3D, r: number, len: number, x: number, y: number, z: number, m: THREE.Material): THREE.Mesh {
  const mesh = new THREE.Mesh(cylGeo, m);
  mesh.scale.set(r, r, len);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

const STEEL = 0x2a2c30;
const BLACK = 0x18191b;
const WOOD = 0x8a5527;
const WOOD_DARK = 0x6e4320;

function ak47(): WeaponModel {
  const g = new THREE.Group();
  const steel = mat(STEEL, 0.5, 0.35);
  const wood = mat(WOOD, 0.7, 0.0);
  const woodD = mat(WOOD_DARK, 0.7, 0.0);
  box(g, 0.044, 0.062, 0.25, 0, 0.034, -0.02, steel); // receiver
  box(g, 0.04, 0.018, 0.2, 0, 0.072, -0.03, mat(0x35373b, 0.45, 0.4)); // dust cover
  box(g, 0.022, 0.016, 0.03, 0, 0.088, -0.11, steel); // rear sight
  box(g, 0.038, 0.07, 0.27, 0, 0.012, 0.235, wood, 0.12); // stock
  box(g, 0.04, 0.085, 0.018, 0, -0.005, 0.372, mat(0x222326, 0.6, 0.3), 0.12); // butt plate
  box(g, 0.034, 0.095, 0.042, 0, -0.045, 0.035, woodD, -0.32); // pistol grip
  box(g, 0.012, 0.035, 0.07, 0, -0.012, -0.025, steel); // trigger guard block
  box(g, 0.046, 0.05, 0.19, 0, 0.03, -0.245, wood); // lower handguard
  box(g, 0.04, 0.03, 0.17, 0, 0.068, -0.24, woodD); // upper handguard
  cyl(g, 0.011, 0.14, 0, 0.068, -0.4, steel); // gas tube
  cyl(g, 0.0095, 0.32, 0, 0.042, -0.5, steel); // barrel
  box(g, 0.014, 0.05, 0.016, 0, 0.066, -0.6, steel); // front sight
  box(g, 0.03, 0.012, 0.012, 0, 0.09, -0.6, steel);
  cyl(g, 0.014, 0.045, 0, 0.042, -0.675, mat(0x1d1e20, 0.5, 0.4)); // muzzle brake
  box(g, 0.01, 0.02, 0.05, 0.027, 0.05, -0.02, steel); // charging handle
  const mag = new THREE.Group();
  const magM = mat(0x3a2a20, 0.55, 0.25);
  box(mag, 0.03, 0.09, 0.06, 0, -0.045, 0, magM, 0.14);
  box(mag, 0.03, 0.085, 0.058, 0, -0.118, -0.022, magM, 0.38);
  box(mag, 0.03, 0.08, 0.056, 0, -0.183, -0.058, magM, 0.62);
  mag.position.set(0, 0.0, -0.105);
  g.add(mag);
  return { group: g, muzzle: new THREE.Vector3(0, 0.042, -0.7), gripR: new THREE.Vector3(0, -0.04, 0.035), gripL: new THREE.Vector3(0, 0.0, -0.25), mag, slide: null };
}

function m4a1(): WeaponModel {
  const g = new THREE.Group();
  const black = mat(BLACK, 0.55, 0.3);
  const grey = mat(0x2c2e32, 0.6, 0.25);
  box(g, 0.044, 0.05, 0.2, 0, 0.05, -0.03, black); // upper receiver
  box(g, 0.04, 0.045, 0.16, 0, 0.006, -0.01, grey); // lower receiver
  box(g, 0.026, 0.012, 0.2, 0, 0.081, -0.03, grey); // flat-top rail
  box(g, 0.03, 0.03, 0.03, 0, 0.1, 0.05, black); // rear sight
  box(g, 0.01, 0.022, 0.012, 0, 0.115, 0.05, black);
  cyl(g, 0.029, 0.25, 0, 0.05, -0.255, grey); // handguard
  for (let i = 0; i < 6; i++) cyl(g, 0.031, 0.01, 0, 0.05, -0.15 - i * 0.04, black); // ribs
  cyl(g, 0.009, 0.2, 0, 0.05, -0.48, black); // barrel
  cyl(g, 0.013, 0.05, 0, 0.05, -0.6, mat(0x101112, 0.5, 0.4)); // flash hider
  box(g, 0.012, 0.075, 0.02, 0, 0.085, -0.4, black); // front sight post
  box(g, 0.03, 0.012, 0.03, 0, 0.055, -0.4, black);
  cyl(g, 0.015, 0.2, 0, 0.045, 0.17, grey); // buffer tube
  box(g, 0.04, 0.1, 0.12, 0, 0.022, 0.245, black); // stock
  box(g, 0.036, 0.03, 0.08, 0, 0.068, 0.2, black);
  box(g, 0.032, 0.09, 0.04, 0, -0.055, 0.04, black, -0.26); // grip
  box(g, 0.01, 0.03, 0.06, 0, -0.03, -0.02, black); // trigger guard
  const mag = new THREE.Group();
  box(mag, 0.026, 0.17, 0.056, 0, -0.085, 0, mat(0x3b3d41, 0.5, 0.35), 0.12);
  mag.position.set(0, -0.012, -0.075);
  g.add(mag);
  return { group: g, muzzle: new THREE.Vector3(0, 0.05, -0.63), gripR: new THREE.Vector3(0, -0.045, 0.04), gripL: new THREE.Vector3(0, 0.012, -0.26), mag, slide: null };
}

function awp(): WeaponModel {
  const g = new THREE.Group();
  const green = mat(0x4f5d3a, 0.7, 0.05);
  const greenD = mat(0x3d4a2c, 0.7, 0.05);
  const black = mat(BLACK, 0.5, 0.35);
  box(g, 0.05, 0.07, 0.44, 0, 0.02, -0.02, green); // chassis
  box(g, 0.046, 0.115, 0.26, 0, -0.002, 0.31, green); // butt stock
  box(g, 0.04, 0.03, 0.17, 0, 0.068, 0.27, greenD); // cheek rest
  box(g, 0.048, 0.12, 0.02, 0, -0.002, 0.445, black); // recoil pad
  box(g, 0.034, 0.095, 0.045, 0, -0.05, 0.075, greenD, -0.3); // grip
  box(g, 0.046, 0.05, 0.26, 0, 0.012, -0.33, greenD); // fore-end
  cyl(g, 0.0125, 0.5, 0, 0.046, -0.62, black); // barrel
  cyl(g, 0.019, 0.07, 0, 0.046, -0.9, black); // muzzle brake
  box(g, 0.05, 0.012, 0.03, 0, 0.046, -0.9, black);
  // scope
  cyl(g, 0.02, 0.3, 0, 0.118, -0.08, black);
  cyl(g, 0.031, 0.08, 0, 0.118, -0.26, black);
  cyl(g, 0.026, 0.06, 0, 0.118, 0.09, black);
  cyl(g, 0.027, 0.006, 0, 0.118, -0.3, mat(0x3a5f8a, 0.15, 0.6)); // front lens
  cyl(g, 0.012, 0.02, 0, 0.145, -0.08, black).rotation.x = Math.PI / 2; // elevation turret
  box(g, 0.022, 0.035, 0.022, 0, 0.085, -0.17, black);
  box(g, 0.022, 0.035, 0.022, 0, 0.085, 0.01, black);
  // bolt
  const bolt = new THREE.Group();
  const bh = cyl(bolt, 0.006, 0.055, 0.045, 0, 0, mat(0x9a9da1, 0.35, 0.7));
  bh.rotation.y = Math.PI / 2;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 8), mat(0x151617, 0.5, 0.3));
  knob.position.set(0.075, 0, 0);
  bolt.add(knob);
  bolt.position.set(0, 0.05, 0.1);
  g.add(bolt);
  const mag = new THREE.Group();
  box(mag, 0.03, 0.06, 0.085, 0, -0.03, 0, black);
  mag.position.set(0, -0.015, -0.08);
  g.add(mag);
  // folded bipod legs
  cyl(g, 0.005, 0.2, 0.018, -0.02, -0.35, black);
  cyl(g, 0.005, 0.2, -0.018, -0.02, -0.35, black);
  return { group: g, muzzle: new THREE.Vector3(0, 0.046, -0.94), gripR: new THREE.Vector3(0, -0.04, 0.075), gripL: new THREE.Vector3(0, -0.02, -0.3), mag, slide: bolt };
}

function pistol(kind: 'glock' | 'usp' | 'deagle'): WeaponModel {
  const g = new THREE.Group();
  const slide = new THREE.Group();
  let muzzleZ = -0.14;
  let barrelY = 0.036;
  if (kind === 'glock') {
    const black = mat(0x1a1b1d, 0.6, 0.25);
    const frame = mat(0x2a2b2d, 0.8, 0.05);
    box(slide, 0.026, 0.03, 0.175, 0, 0.036, -0.05, black);
    box(slide, 0.006, 0.008, 0.008, 0, 0.055, -0.13, black);
    box(slide, 0.016, 0.008, 0.008, 0, 0.055, 0.03, black);
    box(g, 0.025, 0.02, 0.15, 0, 0.012, -0.045, frame);
    box(g, 0.027, 0.1, 0.046, 0, -0.04, 0.02, frame, -0.22);
    box(g, 0.01, 0.006, 0.05, 0, -0.024, -0.04, frame);
    box(g, 0.01, 0.03, 0.006, 0, -0.012, -0.066, frame);
    box(g, 0.028, 0.012, 0.05, 0, -0.092, 0.032, black);
    muzzleZ = -0.14;
  } else if (kind === 'usp') {
    const steel = mat(0x3b3f45, 0.45, 0.45);
    const frame = mat(0x161718, 0.75, 0.05);
    box(slide, 0.03, 0.034, 0.19, 0, 0.038, -0.055, steel);
    for (let i = 0; i < 5; i++) box(slide, 0.032, 0.026, 0.004, 0, 0.038, 0.01 + i * 0.008, frame);
    box(slide, 0.006, 0.01, 0.008, 0, 0.06, -0.14, frame);
    box(slide, 0.018, 0.01, 0.01, 0, 0.06, 0.03, frame);
    cyl(g, 0.008, 0.03, 0, 0.04, -0.16, mat(0x101112, 0.4, 0.5)); // protruding barrel
    box(g, 0.029, 0.024, 0.17, 0, 0.01, -0.05, frame);
    box(g, 0.026, 0.012, 0.05, 0, -0.006, -0.105, frame); // accessory rail
    box(g, 0.03, 0.108, 0.05, 0, -0.044, 0.02, frame, -0.2);
    box(g, 0.01, 0.006, 0.056, 0, -0.03, -0.04, frame);
    box(g, 0.01, 0.036, 0.006, 0, -0.014, -0.07, frame);
    box(g, 0.012, 0.02, 0.012, 0, 0.04, 0.048, frame); // hammer
    muzzleZ = -0.178;
    barrelY = 0.04;
  } else {
    const chrome = mat(0xb9bdc4, 0.25, 0.75);
    const chromeD = mat(0x8e9299, 0.3, 0.7);
    const grip = mat(0x161616, 0.8, 0.05);
    box(slide, 0.034, 0.03, 0.12, 0, 0.04, 0.0, chrome); // rear slide
    box(g, 0.034, 0.034, 0.15, 0, 0.038, -0.135, chrome); // fixed barrel block
    box(g, 0.02, 0.014, 0.15, 0, 0.062, -0.135, chromeD); // top rib
    box(g, 0.006, 0.01, 0.01, 0, 0.074, -0.2, grip);
    box(slide, 0.02, 0.01, 0.012, 0, 0.06, 0.04, grip);
    box(g, 0.032, 0.026, 0.2, 0, 0.012, -0.06, chromeD);
    box(g, 0.035, 0.12, 0.058, 0, -0.05, 0.024, grip, -0.18);
    box(g, 0.01, 0.007, 0.06, 0, -0.03, -0.045, chromeD);
    box(g, 0.01, 0.036, 0.007, 0, -0.014, -0.078, chromeD);
    cyl(g, 0.009, 0.004, 0, 0.038, -0.211, mat(0x0c0c0c, 0.6, 0.2));
    muzzleZ = -0.215;
    barrelY = 0.038;
  }
  g.add(slide);
  return {
    group: g,
    muzzle: new THREE.Vector3(0, barrelY, muzzleZ),
    gripR: new THREE.Vector3(0, -0.045, 0.02),
    gripL: new THREE.Vector3(-0.02, -0.06, 0.015),
    mag: null,
    slide,
  };
}

function knife(): WeaponModel {
  const g = new THREE.Group();
  const steel = mat(0xc9ccd1, 0.2, 0.8);
  const handle = mat(0x1b1c1e, 0.85, 0.05);
  box(g, 0.026, 0.032, 0.115, 0, 0, 0.01, handle);
  for (let i = 0; i < 4; i++) box(g, 0.028, 0.034, 0.008, 0, 0, -0.03 + i * 0.026, mat(0x2a2c2f, 0.8, 0.05));
  box(g, 0.012, 0.06, 0.014, 0, 0, -0.055, mat(0x3a3c40, 0.4, 0.6)); // guard
  // blade: a flat extruded profile with a clipped point
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.016);
  shape.lineTo(0.13, -0.016);
  shape.lineTo(0.185, 0.008);
  shape.lineTo(0.14, 0.018);
  shape.lineTo(0, 0.018);
  shape.closePath();
  const bladeGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.004, bevelEnabled: false });
  bladeGeo.translate(0, 0, -0.002);
  const blade = new THREE.Mesh(bladeGeo, steel);
  // shape X -> model -Z (forward), shape Y -> model Y
  blade.rotation.y = Math.PI / 2;
  blade.position.set(0, 0, -0.06);
  g.add(blade);
  return { group: g, muzzle: new THREE.Vector3(0, 0, -0.24), gripR: new THREE.Vector3(0, 0, 0.01), gripL: new THREE.Vector3(-0.2, -0.2, 0.1), mag: null, slide: null };
}

export function buildWeaponModel(id: WeaponId): WeaponModel {
  let m: WeaponModel;
  switch (id) {
    case 'ak47':
      m = ak47();
      break;
    case 'm4a1':
      m = m4a1();
      break;
    case 'awp':
      m = awp();
      break;
    case 'glock':
    case 'usp':
    case 'deagle':
      m = pistol(id);
      break;
    default:
      m = knife();
      break;
  }
  m.group.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true;
  });
  return m;
}

/** The C4 charge: taped bricks, a keypad and a blinking light. */
export function buildBombModel(): { group: THREE.Group; led: THREE.Mesh } {
  const g = new THREE.Group();
  const brick = mat(0x8a7d55, 0.9, 0.0);
  const tape = mat(0x1d1d1f, 0.8, 0.0);
  for (let i = 0; i < 3; i++) box(g, 0.075, 0.07, 0.2, -0.085 + i * 0.085, 0.035, 0, brick);
  box(g, 0.27, 0.074, 0.03, 0, 0.036, -0.06, tape);
  box(g, 0.27, 0.074, 0.03, 0, 0.036, 0.06, tape);
  box(g, 0.13, 0.03, 0.09, 0, 0.085, 0, mat(0x24262a, 0.6, 0.2));
  box(g, 0.07, 0.006, 0.03, -0.02, 0.102, -0.02, mat(0x304a2c, 0.4, 0.1)); // display
  for (let i = 0; i < 6; i++) box(g, 0.012, 0.006, 0.012, -0.04 + (i % 3) * 0.02, 0.102, 0.012 + Math.floor(i / 3) * 0.018, mat(0x8c8f94, 0.6, 0.2));
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x400808 });
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), ledMat);
  led.position.set(0.045, 0.106, -0.02);
  g.add(led);
  cyl(g, 0.004, 0.16, 0.06, 0.08, 0, mat(0xb02a2a, 0.6, 0.0));
  cyl(g, 0.004, 0.16, -0.06, 0.08, 0, mat(0x2a5fb0, 0.6, 0.0));
  return { group: g, led };
}

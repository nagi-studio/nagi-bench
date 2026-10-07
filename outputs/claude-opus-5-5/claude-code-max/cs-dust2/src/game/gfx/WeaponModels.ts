import * as THREE from 'three';
import type { WeaponId } from '../weapons/WeaponDefs';
import { GeoBuilder, vcMaterial } from './GeoBuilder';

/**
 * Procedural weapon meshes (no external assets). Convention: barrel along -Z, +Y up,
 * origin near the trigger. The same model is used first-person (view model) and third-person.
 */
export interface WeaponModel {
  root: THREE.Group;
  muzzle: THREE.Object3D;
  mag: THREE.Object3D | null;
  magRest: THREE.Vector3;
  rightHand: THREE.Vector3;
  leftHand: THREE.Vector3;
}

const C = {
  steel: 0x2b2e33,
  steelLight: 0x50555d,
  black: 0x141517,
  polymer: 0x232427,
  wood: 0x8c5429,
  woodDark: 0x5a3216,
  bakelite: 0x5c2c12,
  green: 0x5a6b3e,
  greenDark: 0x3d4a2a,
  silver: 0xaeb3b9,
  chrome: 0xd4d8dd,
  blade: 0xc7ccd2,
  tan: 0xb88d52,
  tape: 0x3a3a34,
  c4Pad: 0x2c3a2b,
  red: 0xb32222,
  blue: 0x2346a8,
  yellow: 0xc9a124,
  lcd: 0x9cff7a,
};

interface ModelSpec {
  metal: THREE.BufferGeometry | null;
  matte: THREE.BufferGeometry | null;
  mag: THREE.BufferGeometry | null;
  magPivot: [number, number, number];
  muzzle: [number, number, number];
  rightHand: [number, number, number];
  leftHand: [number, number, number];
}

function spec(
  metal: GeoBuilder,
  matte: GeoBuilder,
  mag: GeoBuilder | null,
  magPivot: [number, number, number],
  muzzle: [number, number, number],
  rightHand: [number, number, number],
  leftHand: [number, number, number],
): ModelSpec {
  return {
    metal: metal.empty ? null : metal.build(),
    matte: matte.empty ? null : matte.build(),
    mag: mag && !mag.empty ? mag.build() : null,
    magPivot,
    muzzle,
    rightHand,
    leftHand,
  };
}

function buildAK(): ModelSpec {
  const metal = new GeoBuilder();
  const matte = new GeoBuilder();
  const mag = new GeoBuilder();
  metal.box(0.05, 0.065, 0.3, 0, 0.032, -0.07, C.steel); // receiver
  metal.box(0.046, 0.026, 0.27, 0, 0.076, -0.055, C.steelLight); // dust cover
  metal.box(0.008, 0.016, 0.05, 0.026, 0.052, -0.03, C.black); // ejection port
  metal.box(0.024, 0.009, 0.014, 0.036, 0.05, -0.13, C.steelLight); // charging handle
  metal.box(0.028, 0.022, 0.035, 0, 0.09, -0.215, C.steel); // rear sight block
  matte.box(0.058, 0.052, 0.2, 0, 0.028, -0.325, C.wood); // lower handguard
  matte.box(0.042, 0.03, 0.17, 0, 0.078, -0.32, C.wood); // upper handguard
  metal.cyl(0.011, 0.14, 0, 0.078, -0.47, C.steel); // gas tube
  metal.box(0.03, 0.034, 0.032, 0, 0.06, -0.52, C.steel); // gas block
  metal.cyl(0.0105, 0.33, 0, 0.042, -0.585, C.black); // barrel
  metal.box(0.01, 0.05, 0.016, 0, 0.084, -0.668, C.black); // front sight post
  metal.box(0.026, 0.024, 0.03, 0, 0.056, -0.668, C.steel); // front sight base
  metal.cyl(0.0145, 0.06, 0, 0.042, -0.78, C.black, 'z', 8); // muzzle brake
  matte.box(0.032, 0.105, 0.046, 0, -0.045, 0.058, C.woodDark, -0.34); // pistol grip
  metal.box(0.006, 0.006, 0.07, 0, -0.013, 0.004, C.steel); // trigger guard
  metal.box(0.005, 0.025, 0.006, 0, -0.012, -0.012, C.black); // trigger
  matte.box(0.042, 0.07, 0.25, 0, 0.004, 0.215, C.wood, 0.1); // stock
  matte.box(0.044, 0.108, 0.03, 0, -0.022, 0.338, C.woodDark, 0.1); // butt
  mag.box(0.032, 0.075, 0.058, 0, -0.032, 0, C.bakelite, 0.12);
  mag.box(0.031, 0.07, 0.055, 0, -0.098, -0.016, C.bakelite, 0.34);
  mag.box(0.03, 0.065, 0.052, 0, -0.156, -0.046, C.bakelite, 0.58);
  return spec(metal, matte, mag, [0, 0.0, -0.118], [0, 0.042, -0.815], [0, -0.055, 0.06], [0, 0.01, -0.33]);
}

function buildM4(): ModelSpec {
  const metal = new GeoBuilder();
  const matte = new GeoBuilder();
  const mag = new GeoBuilder();
  metal.box(0.05, 0.058, 0.27, 0, 0.05, -0.065, C.steel); // upper receiver
  metal.box(0.045, 0.05, 0.2, 0, 0.0, -0.03, C.polymer); // lower receiver
  metal.box(0.026, 0.012, 0.26, 0, 0.085, -0.075, C.black); // top rail
  for (let i = 0; i < 9; i++) metal.box(0.03, 0.006, 0.012, 0, 0.093, 0.04 - i * 0.026, C.steelLight); // rail teeth
  metal.box(0.03, 0.035, 0.02, 0, 0.112, 0.035, C.black); // rear sight
  metal.box(0.008, 0.016, 0.04, 0.026, 0.052, -0.02, C.black); // ejection port
  matte.box(0.062, 0.062, 0.26, 0, 0.046, -0.33, C.polymer); // handguard
  metal.box(0.024, 0.01, 0.26, 0, 0.082, -0.33, C.black); // handguard top rail
  metal.box(0.01, 0.024, 0.26, 0.033, 0.046, -0.33, C.black); // side rails
  metal.box(0.01, 0.024, 0.26, -0.033, 0.046, -0.33, C.black);
  metal.box(0.012, 0.065, 0.02, 0, 0.098, -0.485, C.black); // front sight A-frame
  metal.cyl(0.0098, 0.3, 0, 0.045, -0.6, C.black); // barrel
  metal.cyl(0.0135, 0.055, 0, 0.045, -0.775, C.steel, 'z', 6); // flash hider
  matte.box(0.032, 0.098, 0.044, 0, -0.05, 0.07, C.polymer, -0.36); // grip
  metal.box(0.006, 0.006, 0.065, 0, -0.025, 0.01, C.black); // trigger guard
  metal.cyl(0.016, 0.17, 0, 0.042, 0.17, C.black); // buffer tube
  matte.box(0.046, 0.088, 0.14, 0, 0.02, 0.27, C.polymer); // stock
  matte.box(0.046, 0.1, 0.02, 0, 0.015, 0.345, C.black);
  mag.box(0.03, 0.17, 0.064, 0, -0.085, -0.004, C.steelLight, 0.1);
  return spec(metal, matte, mag, [0, -0.01, -0.1], [0, 0.045, -0.81], [0, -0.06, 0.072], [0, 0.0, -0.34]);
}

function buildAWP(): ModelSpec {
  const metal = new GeoBuilder();
  const matte = new GeoBuilder();
  const mag = new GeoBuilder();
  matte.box(0.062, 0.085, 0.42, 0, 0.026, -0.06, C.green); // receiver/chassis
  matte.box(0.066, 0.07, 0.22, 0, 0.02, -0.36, C.green); // fore-end
  matte.box(0.056, 0.13, 0.3, 0, -0.005, 0.3, C.green, 0.04); // stock
  matte.box(0.058, 0.03, 0.12, 0, -0.035, 0.18, C.greenDark); // thumbhole shading
  matte.box(0.06, 0.15, 0.03, 0, -0.01, 0.46, C.black); // butt pad
  matte.box(0.04, 0.115, 0.05, 0, -0.065, 0.1, C.green, -0.22); // grip
  metal.cyl(0.0145, 0.62, 0, 0.045, -0.6, C.black); // barrel
  metal.cyl(0.021, 0.08, 0, 0.045, -0.93, C.steel, 'z', 8); // muzzle brake
  metal.cyl(0.022, 0.34, 0, 0.135, -0.07, C.black); // scope tube
  metal.cyl(0.033, 0.085, 0, 0.135, -0.27, C.black, 'z', 12, 0.024); // objective bell
  metal.cyl(0.028, 0.06, 0, 0.135, 0.13, C.black, 'z', 12); // eyepiece
  metal.cyl(0.012, 0.03, 0, 0.165, -0.07, C.steel, 'y'); // turret
  metal.cyl(0.012, 0.03, 0.03, 0.135, -0.07, C.steel, 'x'); // windage
  metal.box(0.02, 0.05, 0.022, 0, 0.09, -0.17, C.black); // mounts
  metal.box(0.02, 0.05, 0.022, 0, 0.09, 0.03, C.black);
  metal.cyl(0.006, 0.065, 0.045, 0.05, 0.08, C.steel, 'x'); // bolt handle
  metal.sphere(0.012, 0.08, 0.05, 0.08, C.steelLight);
  metal.box(0.006, 0.028, 0.006, 0, -0.025, 0.02, C.black); // trigger
  mag.box(0.042, 0.06, 0.085, 0, -0.03, 0, C.black);
  return spec(metal, matte, mag, [0, -0.02, -0.08], [0, 0.045, -0.97], [0, -0.07, 0.11], [0, -0.02, -0.36]);
}

function buildGlock(): ModelSpec {
  const metal = new GeoBuilder();
  const matte = new GeoBuilder();
  const mag = new GeoBuilder();
  metal.box(0.028, 0.032, 0.19, 0, 0.036, -0.065, C.steel); // slide
  for (let i = 0; i < 5; i++) metal.box(0.03, 0.022, 0.004, 0, 0.036, 0.0 + i * 0.008, C.black); // serrations
  metal.box(0.012, 0.008, 0.008, 0, 0.056, 0.022, C.black); // rear sight
  metal.box(0.005, 0.008, 0.006, 0, 0.056, -0.152, C.black); // front sight
  metal.cyl(0.0065, 0.01, 0, 0.036, -0.161, C.black, 'z', 8);
  matte.box(0.026, 0.022, 0.15, 0, 0.01, -0.07, C.polymer); // frame
  matte.box(0.03, 0.105, 0.05, 0, -0.045, 0.018, C.polymer, -0.3); // grip
  matte.box(0.006, 0.006, 0.05, 0, -0.012, -0.03, C.polymer); // trigger guard
  mag.box(0.026, 0.03, 0.046, 0, -0.012, 0, C.black, -0.3);
  return spec(metal, matte, mag, [0, -0.09, 0.035], [0, 0.036, -0.17], [0, -0.045, 0.025], [-0.012, -0.06, 0.03]);
}

function buildUSP(): ModelSpec {
  const metal = new GeoBuilder();
  const matte = new GeoBuilder();
  const mag = new GeoBuilder();
  metal.box(0.03, 0.034, 0.2, 0, 0.037, -0.068, C.polymer); // slide
  for (let i = 0; i < 5; i++) metal.box(0.032, 0.024, 0.004, 0, 0.037, 0.0 + i * 0.008, C.black);
  metal.box(0.014, 0.009, 0.008, 0, 0.058, 0.024, C.black);
  metal.cyl(0.0175, 0.17, 0, 0.037, -0.255, C.steel, 'z', 14); // suppressor
  metal.cyl(0.0185, 0.012, 0, 0.037, -0.17, C.black, 'z', 14);
  matte.box(0.028, 0.024, 0.16, 0, 0.01, -0.07, C.black); // frame
  matte.box(0.032, 0.108, 0.052, 0, -0.046, 0.02, C.black, -0.26); // grip
  matte.box(0.006, 0.006, 0.05, 0, -0.012, -0.03, C.black);
  mag.box(0.028, 0.03, 0.048, 0, -0.012, 0, C.steel, -0.26);
  return spec(metal, matte, mag, [0, -0.092, 0.036], [0, 0.037, -0.345], [0, -0.045, 0.027], [-0.012, -0.062, 0.03]);
}

function buildDeagle(): ModelSpec {
  const metal = new GeoBuilder();
  const matte = new GeoBuilder();
  const mag = new GeoBuilder();
  metal.box(0.034, 0.046, 0.25, 0, 0.046, -0.075, C.chrome); // slide
  metal.box(0.022, 0.014, 0.255, 0, 0.075, -0.078, C.silver); // top rib
  for (let i = 0; i < 6; i++) metal.box(0.036, 0.034, 0.004, 0, 0.046, 0.02 + i * 0.007, C.silver);
  metal.box(0.014, 0.012, 0.01, 0, 0.087, 0.035, C.black); // rear sight
  metal.box(0.006, 0.012, 0.01, 0, 0.087, -0.19, C.black); // front sight
  metal.cyl(0.009, 0.012, 0, 0.05, -0.2, C.black, 'z', 8);
  metal.box(0.03, 0.03, 0.2, 0, 0.008, -0.065, C.silver); // frame
  matte.box(0.036, 0.12, 0.056, 0, -0.058, 0.03, C.black, -0.24); // grip
  metal.box(0.008, 0.008, 0.06, 0, -0.016, -0.03, C.silver);
  mag.box(0.03, 0.03, 0.05, 0, -0.012, 0, C.steel, -0.24);
  return spec(metal, matte, mag, [0, -0.112, 0.05], [0, 0.05, -0.21], [0, -0.05, 0.032], [-0.012, -0.068, 0.035]);
}

function buildKnife(): ModelSpec {
  const metal = new GeoBuilder();
  const matte = new GeoBuilder();
  matte.box(0.026, 0.032, 0.115, 0, 0, 0.03, C.black); // handle
  for (let i = 0; i < 4; i++) matte.box(0.028, 0.034, 0.006, 0, 0, 0.0 + i * 0.022, C.polymer);
  metal.box(0.07, 0.014, 0.012, 0, 0.004, -0.032, C.steel); // guard
  metal.box(0.006, 0.036, 0.15, 0, 0.006, -0.11, C.blade); // blade
  metal.box(0.0055, 0.024, 0.05, 0, 0.0, -0.2, C.blade, -0.38); // tip
  metal.box(0.0065, 0.006, 0.12, 0, 0.022, -0.1, C.steelLight); // spine
  return spec(metal, matte, null, [0, 0, 0], [0, 0.01, -0.24], [0, 0, 0.03], [0, -0.02, 0.06]);
}

function buildC4(): ModelSpec {
  const metal = new GeoBuilder();
  const matte = new GeoBuilder();
  for (let i = 0; i < 3; i++) matte.box(0.06, 0.06, 0.2, -0.065 + i * 0.065, 0, -0.06, C.tan); // bricks
  matte.box(0.2, 0.064, 0.02, 0, 0, -0.12, C.tape); // tape bands
  matte.box(0.2, 0.064, 0.02, 0, 0, 0.0, C.tape);
  metal.box(0.09, 0.016, 0.07, 0, 0.038, -0.06, C.c4Pad); // keypad module
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) metal.box(0.014, 0.006, 0.012, -0.022 + c * 0.022, 0.048, -0.075 + r * 0.018, C.steelLight);
  metal.box(0.05, 0.006, 0.016, 0, 0.048, -0.032, C.lcd); // display
  metal.cyl(0.003, 0.12, 0.08, 0.035, -0.06, C.red, 'z', 5);
  metal.cyl(0.003, 0.12, 0.088, 0.03, -0.06, C.blue, 'z', 5);
  metal.cyl(0.003, 0.12, 0.096, 0.025, -0.06, C.yellow, 'z', 5);
  return spec(metal, matte, null, [0, 0, 0], [0, 0.05, -0.06], [0.05, -0.03, 0.0], [-0.05, -0.03, -0.1]);
}

const builders: Record<WeaponId, () => ModelSpec> = {
  ak47: buildAK,
  m4a4: buildM4,
  awp: buildAWP,
  glock: buildGlock,
  usp: buildUSP,
  deagle: buildDeagle,
  knife: buildKnife,
  c4: buildC4,
};

const specCache = new Map<WeaponId, ModelSpec>();

/** Instantiate a weapon model; geometry is shared between instances of the same weapon. */
export function createWeaponModel(id: WeaponId, castShadow = true): WeaponModel {
  let s = specCache.get(id);
  if (!s) {
    s = builders[id]();
    specCache.set(id, s);
  }
  const root = new THREE.Group();
  root.name = `weapon_${id}`;
  if (s.metal) root.add(new THREE.Mesh(s.metal, vcMaterial('metal')));
  if (s.matte) root.add(new THREE.Mesh(s.matte, vcMaterial('matte')));
  let mag: THREE.Object3D | null = null;
  if (s.mag) {
    mag = new THREE.Mesh(s.mag, vcMaterial('matte'));
    mag.position.fromArray(s.magPivot);
    root.add(mag);
  }
  const muzzle = new THREE.Object3D();
  muzzle.position.fromArray(s.muzzle);
  root.add(muzzle);
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = castShadow;
      o.receiveShadow = false;
      o.userData.sharedGeometry = true;
    }
  });
  return {
    root,
    muzzle,
    mag,
    magRest: mag ? mag.position.clone() : new THREE.Vector3(),
    rightHand: new THREE.Vector3().fromArray(s.rightHand),
    leftHand: new THREE.Vector3().fromArray(s.leftHand),
  };
}

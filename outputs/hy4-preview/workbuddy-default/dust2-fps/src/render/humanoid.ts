/**
 * Procedural humanoid: real articulated skeleton with separate head, torso,
 * pelvis, upper/lower arms and upper/lower legs (no capsules / cylinders used
 * as a stand-in for a whole body), plus a held weapon and team markings.
 */

import * as THREE from 'three';
import { CHARACTER, WEAPONS, type WeaponId } from '../game/weapons';
import type { Combatant } from '../game/types';
import { clamp } from '../game/mathUtils';

export interface TeamPalette {
  uniform: number;
  vest: number;
  head: number;
  helmet: number;
  gloves: number;
  accent: number;
  pants: number;
  boots: number;
}

export const PALETTE_CT: TeamPalette = {
  uniform: 0x2f4c72,
  vest: 0x1c2c42,
  head: 0xd6a97e,
  helmet: 0x3f6293,
  gloves: 0x23272e,
  accent: 0x6fa8dc,
  pants: 0x27364f,
  boots: 0x15181d,
};

export const PALETTE_T: TeamPalette = {
  uniform: 0x7a5f38,
  vest: 0x41331f,
  head: 0x2b2320,
  helmet: 0x2b2320,
  gloves: 0x2f2a24,
  accent: 0xd08a3a,
  pants: 0x5c4a2e,
  boots: 0x1d1813,
};

export interface CharacterRig {
  root: THREE.Group;
  /** everything above the waist — rotates with aim pitch */
  upper: THREE.Group;
  head: THREE.Group;
  hipR: THREE.Group;
  hipL: THREE.Group;
  kneeR: THREE.Group;
  kneeL: THREE.Group;
  shoulderR: THREE.Group;
  shoulderL: THREE.Group;
  elbowR: THREE.Group;
  elbowL: THREE.Group;
  weapon: THREE.Group;
  muzzle: THREE.Object3D;
  marker: THREE.Mesh;
  /** every mesh in the rig, for shadow flags / disposal */
  meshes: THREE.Mesh[];
}

// ---- shared geometry (reused by all 10 characters) ------------------------
const GEO = {
  pelvis: new THREE.BoxGeometry(0.34, 0.18, 0.23),
  torso: new THREE.BoxGeometry(0.44, 0.44, 0.25),
  vest: new THREE.BoxGeometry(0.47, 0.30, 0.28),
  neck: new THREE.BoxGeometry(0.12, 0.08, 0.12),
  head: new THREE.BoxGeometry(0.23, 0.26, 0.23),
  helmet: new THREE.BoxGeometry(0.27, 0.14, 0.27),
  brim: new THREE.BoxGeometry(0.28, 0.03, 0.10),
  band: new THREE.BoxGeometry(0.10, 0.09, 0.10),
  upperArm: new THREE.BoxGeometry(0.115, 0.30, 0.115),
  foreArm: new THREE.BoxGeometry(0.10, 0.28, 0.10),
  hand: new THREE.BoxGeometry(0.115, 0.115, 0.13),
  thigh: new THREE.BoxGeometry(0.155, 0.46, 0.16),
  shin: new THREE.BoxGeometry(0.13, 0.44, 0.14),
  foot: new THREE.BoxGeometry(0.15, 0.09, 0.27),
};

function mat(color: number, rough = 0.85): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.05 });
}

function add(parent: THREE.Object3D, geo: THREE.BufferGeometry, material: THREE.Material,
  x: number, y: number, z: number, rig: CharacterRig): THREE.Mesh {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = false;
  parent.add(m);
  rig.meshes.push(m);
  return m;
}

/** Small third-person gun built from boxes. */
export function buildWeaponModel(id: WeaponId, scale = 1): { group: THREE.Group; muzzle: THREE.Object3D } {
  const def = WEAPONS[id];
  const vm = def.viewModel;
  const group = new THREE.Group();
  const bodyMat = mat(vm.bodyColor, 0.6);
  const metalMat = new THREE.MeshStandardMaterial({ color: vm.metalColor, roughness: 0.35, metalness: 0.7 });
  const accentMat = mat(vm.accentColor, 0.7);

  if (vm.blade) {
    // knife: handle + blade
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.035, 0.13), accentMat);
    handle.position.set(0, 0, 0.06);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.008, 0.20), metalMat);
    blade.position.set(0, 0.01, -0.10);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.018), metalMat);
    guard.position.set(0, 0, -0.005);
    group.add(handle, blade, guard);
    [handle, blade, guard].forEach((m) => { m.castShadow = true; });
  } else {
    const receiverLen = vm.length * 0.42;
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.10, receiverLen), bodyMat);
    receiver.position.set(0, 0, 0);
    group.add(receiver);

    const barrel = new THREE.Mesh(
      new THREE.BoxGeometry(0.038, 0.038, vm.barrel), metalMat);
    barrel.position.set(0, 0.022, -(receiverLen / 2 + vm.barrel / 2));
    group.add(barrel);

    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.055, vm.magSize, 0.075), accentMat);
    mag.position.set(0, -0.055 - vm.magSize / 2, 0.02);
    mag.rotation.x = -0.16;
    group.add(mag);

    if (vm.hasStock) {
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.085, 0.24), accentMat);
      stock.position.set(0, -0.012, receiverLen / 2 + 0.11);
      group.add(stock);
    }
    if (vm.hasScope) {
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.20, 10), metalMat);
      scope.rotation.x = Math.PI / 2;
      scope.position.set(0, 0.075, -0.02);
      group.add(scope);
      const mount = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.045, 0.06), accentMat);
      mount.position.set(0, 0.045, -0.02);
      group.add(mount);
    }
    // grip
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.11, 0.06), accentMat);
    grip.position.set(0, -0.07, receiverLen * 0.22);
    grip.rotation.x = 0.28;
    group.add(grip);
    group.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; });
  }

  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, 0.022, -(vm.barrel > 0 ? vm.length * 0.21 + vm.barrel : 0.2));
  group.add(muzzle);

  group.scale.setScalar(scale);
  return { group, muzzle };
}

export function buildHumanoid(team: 'CT' | 'T'): CharacterRig {
  const pal = team === 'CT' ? PALETTE_CT : PALETTE_T;
  const rig = {
    root: new THREE.Group(),
    upper: new THREE.Group(),
    head: new THREE.Group(),
    hipR: new THREE.Group(),
    hipL: new THREE.Group(),
    kneeR: new THREE.Group(),
    kneeL: new THREE.Group(),
    shoulderR: new THREE.Group(),
    shoulderL: new THREE.Group(),
    elbowR: new THREE.Group(),
    elbowL: new THREE.Group(),
    weapon: new THREE.Group(),
    muzzle: new THREE.Object3D(),
    marker: new THREE.Mesh(),
    meshes: [] as THREE.Mesh[],
  } as CharacterRig;

  const mUniform = mat(pal.uniform);
  const mVest = mat(pal.vest, 0.9);
  const mHead = mat(pal.head, 0.75);
  const mHelmet = mat(pal.helmet, 0.6);
  const mGlove = mat(pal.gloves, 0.95);
  const mAccent = mat(pal.accent, 0.5);
  const mPants = mat(pal.pants);
  const mBoots = mat(pal.boots, 0.95);

  const root = rig.root;

  // ---- pelvis ----
  add(root, GEO.pelvis, mPants, 0, 0.90, 0, rig);

  // ---- upper body (waist pivot at 0.98) ----
  const upper = rig.upper;
  upper.position.set(0, 0.98, 0);
  root.add(upper);

  add(upper, GEO.torso, mUniform, 0, 0.22, 0, rig);
  add(upper, GEO.vest, mVest, 0, 0.20, 0.005, rig);
  add(upper, GEO.neck, mHead, 0, 0.47, 0, rig);

  // chest accent stripe so teams read instantly at a distance
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.05, 0.26), mAccent);
  stripe.position.set(0, 0.36, 0);
  stripe.castShadow = true;
  upper.add(stripe);
  rig.meshes.push(stripe);

  // ---- head ----
  const head = rig.head;
  head.position.set(0, 0.65, 0);
  upper.add(head);
  add(head, GEO.head, mHead, 0, 0, 0, rig);
  if (team === 'CT') {
    add(head, GEO.helmet, mHelmet, 0, 0.10, 0, rig);
    add(head, GEO.brim, mHelmet, 0, 0.02, -0.14, rig);
  } else {
    // balaclava / beanie
    add(head, GEO.helmet, mHelmet, 0, 0.13, 0, rig);
    const mask = new THREE.Mesh(new THREE.BoxGeometry(0.235, 0.10, 0.235), mHelmet);
    mask.position.set(0, -0.05, 0);
    mask.castShadow = true;
    head.add(mask);
    rig.meshes.push(mask);
  }

  // ---- arms ----
  rig.shoulderR.position.set(-0.27, 0.40, 0);
  rig.shoulderL.position.set(0.27, 0.40, 0);
  upper.add(rig.shoulderR, rig.shoulderL);

  add(rig.shoulderR, GEO.upperArm, mUniform, 0, -0.15, 0, rig);
  add(rig.shoulderL, GEO.upperArm, mUniform, 0, -0.15, 0, rig);
  // team arm band on the left arm
  add(rig.shoulderL, GEO.band, mAccent, 0, -0.06, 0, rig);

  rig.elbowR.position.set(0, -0.30, 0);
  rig.elbowL.position.set(0, -0.30, 0);
  rig.shoulderR.add(rig.elbowR);
  rig.shoulderL.add(rig.elbowL);

  add(rig.elbowR, GEO.foreArm, mUniform, 0, -0.14, 0, rig);
  add(rig.elbowL, GEO.foreArm, mUniform, 0, -0.14, 0, rig);
  add(rig.elbowR, GEO.hand, mGlove, 0, -0.31, -0.01, rig);
  add(rig.elbowL, GEO.hand, mGlove, 0, -0.31, -0.01, rig);

  // ---- weapon (held in front of the chest) ----
  rig.weapon.position.set(0.02, 0.30, -0.22);
  upper.add(rig.weapon);

  // ---- legs ----
  rig.hipR.position.set(-0.115, 0.92, 0);
  rig.hipL.position.set(0.115, 0.92, 0);
  root.add(rig.hipR, rig.hipL);
  add(rig.hipR, GEO.thigh, mPants, 0, -0.23, 0, rig);
  add(rig.hipL, GEO.thigh, mPants, 0, -0.23, 0, rig);

  rig.kneeR.position.set(0, -0.46, 0);
  rig.kneeL.position.set(0, -0.46, 0);
  rig.hipR.add(rig.kneeR);
  rig.hipL.add(rig.kneeL);
  add(rig.kneeR, GEO.shin, mPants, 0, -0.22, 0, rig);
  add(rig.kneeL, GEO.shin, mPants, 0, -0.22, 0, rig);
  add(rig.kneeR, GEO.foot, mBoots, 0, -0.42, -0.05, rig);
  add(rig.kneeL, GEO.foot, mBoots, 0, -0.42, -0.05, rig);

  // ---- team marker (only shown over team mates) ----
  const markerGeo = new THREE.ConeGeometry(0.13, 0.26, 4);
  const markerMat = new THREE.MeshBasicMaterial({
    color: team === 'CT' ? 0x6fa8dc : 0xe0a04a,
    transparent: true,
    opacity: 0.9,
    depthTest: false,
  });
  rig.marker = new THREE.Mesh(markerGeo, markerMat);
  rig.marker.rotation.x = Math.PI;
  rig.marker.position.set(0, 2.25, 0);
  rig.marker.renderOrder = 999;
  rig.marker.visible = false;
  root.add(rig.marker);

  return rig;
}

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

const IDLE_POSE = {
  shoulderR: -1.06, elbowR: -0.72, shoulderRz: -0.20,
  shoulderL: -1.02, elbowL: -0.92, shoulderLz: 0.26,
};

export function updateRig(rig: CharacterRig, c: Combatant, dt: number, now: number, isTeamMate: boolean, showMarker: boolean): void {
  const b = c.body;
  rig.root.position.set(b.x, b.y, b.z);

  rig.root.rotation.y = c.alive ? c.yaw : c.deathYaw;

  const speed = Math.hypot(b.vx, b.vz);
  const moveFactor = clamp(speed / 4.6, 0, 1.35);

  if (!c.alive) {
    // lay flat
    const k = clamp((now - c.deathTime) / 0.45, 0, 1);
    rig.upper.rotation.x = 0;
    rig.root.rotation.z = -Math.PI / 2 * 0.92 * k;
    rig.root.position.y = b.y + 0.15 * k;
    rig.hipR.rotation.x = 0.25;
    rig.hipL.rotation.x = -0.15;
    rig.kneeR.rotation.x = 0.35;
    rig.kneeL.rotation.x = 0.2;
    rig.shoulderR.rotation.set(-0.3, 0, -0.7);
    rig.shoulderL.rotation.set(-0.2, 0, 0.7);
    rig.elbowR.rotation.x = -0.2;
    rig.elbowL.rotation.x = -0.2;
    rig.marker.visible = false;
    rig.weapon.visible = false;
    return;
  }

  rig.root.rotation.z = 0;
  rig.weapon.visible = true;

  // ---- legs ----
  const phase = c.animPhase * 3.2;
  const swing = Math.sin(phase) * 0.72 * moveFactor;
  const swing2 = Math.sin(phase + Math.PI) * 0.72 * moveFactor;
  rig.hipR.rotation.x = swing;
  rig.hipL.rotation.x = swing2;
  rig.kneeR.rotation.x = Math.max(0, -swing) * 0.85 + 0.05;
  rig.kneeL.rotation.x = Math.max(0, -swing2) * 0.85 + 0.05;

  // ---- upper body bob + aim ----
  const bob = Math.abs(Math.sin(phase)) * 0.035 * moveFactor;
  rig.upper.position.y = 0.98 + bob - (b.onGround ? 0 : 0.02);
  rig.upper.rotation.x = c.pitch * 0.85;
  rig.head.rotation.x = -c.pitch * 0.18;

  // ---- arms hold the weapon, sway a little while running ----
  const sway = Math.sin(phase) * 0.06 * moveFactor;
  rig.shoulderR.rotation.set(IDLE_POSE.shoulderR + sway, 0, IDLE_POSE.shoulderRz);
  rig.shoulderL.rotation.set(IDLE_POSE.shoulderL - sway, 0, IDLE_POSE.shoulderLz);
  rig.elbowR.rotation.x = IDLE_POSE.elbowR;
  rig.elbowL.rotation.x = IDLE_POSE.elbowL;

  // airborne: tuck the legs a bit
  if (!b.onGround) {
    rig.hipR.rotation.x = 0.45;
    rig.hipL.rotation.x = -0.15;
    rig.kneeR.rotation.x = 0.75;
    rig.kneeL.rotation.x = 0.25;
  }

  rig.marker.visible = showMarker && isTeamMate;
  if (rig.marker.visible) {
    rig.marker.rotation.y += dt * 1.6;
  }
}

export const CHARACTER_HEIGHT = CHARACTER.height;

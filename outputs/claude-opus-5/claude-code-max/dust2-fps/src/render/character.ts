/**
 * Procedural humanoid characters.
 *
 * No skinned meshes and no model files: each soldier is a hierarchy of boxes — hips,
 * torso, head, two arms (upper arm + forearm + hand) and two legs (thigh + shin + boot) —
 * animated by rotating the joints. CTs wear navy blue with a helmet, Ts wear sand and a
 * red balaclava, so sides are readable at a glance.
 */

import * as THREE from 'three';
import type { Actor } from '../game/actor.ts';
import { ACTOR_CROUCH_HEIGHT, ACTOR_HEIGHT, type Team } from '../game/constants.ts';
import type { WeaponId } from '../game/weapons.ts';
import { buildWeaponModel, worldWeaponScale } from './weaponModels.ts';

interface Palette {
  uniform: number;
  uniformDark: number;
  vest: number;
  skin: number;
  head: number;
  accent: number;
  boots: number;
  gloves: number;
}

const CT_PALETTE: Palette = {
  uniform: 0x33456b,
  uniformDark: 0x27334f,
  vest: 0x4a5f8c,
  skin: 0xc79a72,
  head: 0x2c3a5c,
  accent: 0x7fb2ff,
  boots: 0x1b2029,
  gloves: 0x1f2733,
};

const T_PALETTE: Palette = {
  uniform: 0x8d7346,
  uniformDark: 0x6d5934,
  vest: 0x5d4a2c,
  skin: 0xba8a63,
  head: 0xb03a24,
  accent: 0xe8863a,
  boots: 0x2a231a,
  gloves: 0x3a2c1e,
};

const matCache = new Map<number, THREE.MeshLambertMaterial>();
function mat(color: number): THREE.MeshLambertMaterial {
  let m = matCache.get(color);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color });
    matCache.set(color, m);
  }
  return m;
}

function box(
  parent: THREE.Object3D,
  color: number,
  sx: number,
  sy: number,
  sz: number,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat(color));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  parent.add(mesh);
  return mesh;
}

export interface CharacterRig {
  root: THREE.Group;
  /** Rotates with aim pitch; everything above the waist hangs off it. */
  spine: THREE.Group;
  head: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  forearmL: THREE.Group;
  forearmR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  shinL: THREE.Group;
  shinR: THREE.Group;
  hips: THREE.Group;
  weaponMount: THREE.Group;
  weaponId: WeaponId | null;
  weaponMesh: THREE.Group | null;
  team: Team;
  /** 0 = alive, 1 = fully collapsed. */
  deathT: number;
  bombPack: THREE.Mesh;
}

const SHOULDER_Y = 1.4;
const HIP_Y = 0.9;

export function createCharacter(team: Team): CharacterRig {
  const p = team === 'CT' ? CT_PALETTE : T_PALETTE;
  const root = new THREE.Group();
  root.name = `character_${team}`;

  const hips = new THREE.Group();
  hips.position.y = HIP_Y;
  root.add(hips);

  // ---- torso ---------------------------------------------------------------
  const spine = new THREE.Group();
  hips.add(spine);
  box(spine, p.uniform, 0.42, 0.5, 0.24, 0, 0.27, 0); // chest
  box(spine, p.vest, 0.45, 0.32, 0.28, 0, 0.3, 0); // plate carrier
  box(spine, p.accent, 0.46, 0.05, 0.29, 0, 0.42, 0); // shoulder band (team colour)
  box(spine, p.uniformDark, 0.36, 0.16, 0.22, 0, 0.03, 0); // belt / waist
  box(spine, p.uniformDark, 0.16, 0.12, 0.1, 0, 0.12, 0.16); // rear pouch

  // ---- head ----------------------------------------------------------------
  const head = new THREE.Group();
  head.position.y = SHOULDER_Y - HIP_Y + 0.14;
  spine.add(head);
  box(head, p.uniformDark, 0.13, 0.09, 0.13, 0, -0.08, 0); // neck
  box(head, p.skin, 0.2, 0.22, 0.21, 0, 0.06, 0); // head
  if (team === 'CT') {
    box(head, p.head, 0.24, 0.11, 0.25, 0, 0.16, 0); // helmet
    box(head, 0x151a24, 0.21, 0.06, 0.06, 0, 0.06, -0.11); // visor
    box(head, p.accent, 0.05, 0.04, 0.05, 0.1, 0.16, 0.02); // side light
  } else {
    box(head, p.head, 0.21, 0.14, 0.22, 0, 0.09, 0); // balaclava
    box(head, p.accent, 0.22, 0.05, 0.23, 0, 0.15, 0); // headband
    box(head, 0x2b1c14, 0.13, 0.05, 0.04, 0, 0.05, -0.1); // eye slit
  }

  // ---- arms ----------------------------------------------------------------
  const makeArm = (side: 1 | -1) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(0.26 * side, SHOULDER_Y - HIP_Y, 0);
    spine.add(shoulder);
    box(shoulder, p.uniform, 0.13, 0.3, 0.14, 0, -0.13, 0); // upper arm

    const forearm = new THREE.Group();
    forearm.position.y = -0.28;
    shoulder.add(forearm);
    box(forearm, p.uniformDark, 0.115, 0.26, 0.125, 0, -0.12, 0);
    box(forearm, p.gloves, 0.11, 0.11, 0.13, 0, -0.27, 0); // hand
    return { shoulder, forearm };
  };
  const left = makeArm(-1);
  const right = makeArm(1);

  // ---- legs ----------------------------------------------------------------
  const makeLeg = (side: 1 | -1) => {
    const thigh = new THREE.Group();
    thigh.position.set(0.11 * side, 0, 0);
    hips.add(thigh);
    box(thigh, p.uniform, 0.17, 0.46, 0.19, 0, -0.23, 0);

    const shin = new THREE.Group();
    shin.position.y = -0.45;
    thigh.add(shin);
    box(shin, p.uniformDark, 0.15, 0.42, 0.17, 0, -0.21, 0);
    box(shin, p.boots, 0.17, 0.12, 0.26, 0, -0.4, -0.04); // boot
    return { thigh, shin };
  };
  const legL = makeLeg(-1);
  const legR = makeLeg(1);

  // ---- weapon in the right hand -------------------------------------------
  const weaponMount = new THREE.Group();
  weaponMount.position.set(0, -0.27, -0.02);
  right.forearm.add(weaponMount);

  // ---- C4 backpack, shown only for the carrier -----------------------------
  const bombPack = box(spine, 0x3f4a33, 0.24, 0.26, 0.12, 0, 0.24, 0.19);
  bombPack.visible = false;

  const rig: CharacterRig = {
    root,
    spine,
    head,
    hips,
    armL: left.shoulder,
    armR: right.shoulder,
    forearmL: left.forearm,
    forearmR: right.forearm,
    legL: legL.thigh,
    legR: legR.thigh,
    shinL: legL.shin,
    shinR: legR.shin,
    weaponMount,
    weaponId: null,
    weaponMesh: null,
    team,
    deathT: 0,
    bombPack,
  };

  setRigWeapon(rig, 'knife');
  return rig;
}

export function setRigWeapon(rig: CharacterRig, id: WeaponId): void {
  if (rig.weaponId === id) return;
  if (rig.weaponMesh) {
    rig.weaponMount.remove(rig.weaponMesh);
    rig.weaponMesh.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
  }
  const model = buildWeaponModel(id);
  const s = worldWeaponScale(id);
  model.scale.setScalar(s);
  model.position.set(0, -0.02, -0.12);
  rig.weaponMount.add(model);
  rig.weaponMesh = model;
  rig.weaponId = id;
}

/** Poses the arms so the character is always holding its weapon ready. */
function applyWeaponPose(rig: CharacterRig, aimBlend: number): void {
  const isKnife = rig.weaponId === 'knife';

  // Right arm: elbow tucked, hand on the grip.
  rig.armR.rotation.set(-1.42 - aimBlend * 0.12, -0.24, 0.16);
  rig.forearmR.rotation.set(0.32, 0.34, 0.0);

  // Left arm: supports the handguard (or drops for a knife).
  if (isKnife) {
    rig.armL.rotation.set(-0.55, 0.2, -0.25);
    rig.forearmL.rotation.set(-0.6, 0, 0);
  } else {
    rig.armL.rotation.set(-1.36 - aimBlend * 0.12, 0.62, -0.22);
    rig.forearmL.rotation.set(0.26, -0.75, 0);
  }
}

const DEATH_FALL = 1.35;

export function updateCharacter(rig: CharacterRig, actor: Actor, dt: number): void {
  const root = rig.root;

  // ---- death -------------------------------------------------------------
  if (!actor.alive) {
    rig.deathT = Math.min(1, rig.deathT + dt * 2.6);
  } else if (rig.deathT > 0) {
    rig.deathT = Math.max(0, rig.deathT - dt * 6);
  }
  const dead = rig.deathT;

  root.position.set(actor.pos.x, actor.pos.y, actor.pos.z);
  root.rotation.y = actor.yaw;
  // Collapse forward onto the ground, keeping the body inside the world.
  root.rotation.x = dead * DEATH_FALL;
  root.position.y += dead * 0.06;

  const crouchScale = actor.crouching ? ACTOR_CROUCH_HEIGHT / ACTOR_HEIGHT : 1;
  root.scale.set(1, crouchScale, 1);

  // Kept outside the early-out below: a body that drops the C4 must stop showing the pack.
  rig.bombPack.visible = actor.hasBomb;

  if (dead > 0.98) return;

  // ---- aim ---------------------------------------------------------------
  const pitch = Math.max(-1.1, Math.min(1.1, actor.pitch));
  rig.spine.rotation.x = pitch * 0.45 * (1 - dead);
  rig.head.rotation.x = pitch * 0.5 * (1 - dead);
  applyWeaponPose(rig, pitch);

  // ---- locomotion --------------------------------------------------------
  const speed = actor.speed;
  const moving = speed > 0.4 && actor.onGround;
  const phase = actor.stepPhase;
  const swing = Math.min(1, speed / 6) * 0.72;

  if (moving) {
    const s = Math.sin(phase * Math.PI);
    const c = Math.cos(phase * Math.PI);
    rig.legL.rotation.x = s * swing;
    rig.legR.rotation.x = -s * swing;
    rig.shinL.rotation.x = Math.max(0, -s) * swing * 1.1;
    rig.shinR.rotation.x = Math.max(0, s) * swing * 1.1;
    // Slight torso counter-rotation and a vertical bob.
    rig.hips.rotation.y = c * 0.07 * (swing / 0.72);
    rig.hips.position.y = HIP_Y - Math.abs(s) * 0.035;
    rig.armL.rotation.x += s * 0.1;
    rig.armR.rotation.x -= s * 0.06;
  } else {
    const idle = Math.sin(performance.now() * 0.0011 + actor.id) * 0.02;
    rig.legL.rotation.x *= 0.82;
    rig.legR.rotation.x *= 0.82;
    rig.shinL.rotation.x *= 0.82;
    rig.shinR.rotation.x *= 0.82;
    rig.hips.rotation.y *= 0.85;
    rig.hips.position.y = HIP_Y + idle;
  }

  if (!actor.onGround) {
    rig.legL.rotation.x = -0.35;
    rig.legR.rotation.x = 0.2;
    rig.shinL.rotation.x = 0.5;
    rig.shinR.rotation.x = 0.25;
  }

  if (actor.crouching) {
    rig.legL.rotation.x = 0.7;
    rig.legR.rotation.x = 0.7;
    rig.shinL.rotation.x = -1.2;
    rig.shinR.rotation.x = -1.2;
    rig.hips.position.y = HIP_Y - 0.06;
  }

  // ---- kit ---------------------------------------------------------------
  setRigWeapon(rig, actor.weaponId());
}

export function disposeCharacter(rig: CharacterRig): void {
  rig.root.traverse((o) => {
    if (o instanceof THREE.Mesh) o.geometry.dispose();
  });
}

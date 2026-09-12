import * as THREE from 'three';
import type { HitPart, Team, WeaponId } from './types';

export interface HitboxDef {
  part: HitPart;
  cx: number;
  cy: number;
  cz: number;
  hx: number;
  hy: number;
  hz: number;
}

export interface CharacterRig {
  group: THREE.Group;
  body: THREE.Group;
  armPivot: THREE.Group;
  legL: THREE.Mesh;
  legR: THREE.Mesh;
  gunHolder: THREE.Group;
  muzzle: THREE.Object3D;
  hitboxes: HitboxDef[];
  walkPhase: number;
}

export interface PoseOpts {
  dt: number;
  speed: number;
  pitch: number;
  alive: boolean;
  deathT: number;
  deathDir: number;
}

/* ------------------------------------------------------------------ */
/* Shared materials (never disposed)                                   */
/* ------------------------------------------------------------------ */

function lambert(color: number): THREE.MeshLambertMaterial {
  return new THREE.MeshLambertMaterial({ color });
}

const MAT = {
  skin: lambert(0xc9a188),
  face: lambert(0x9c7256),
  metal: lambert(0x2b2b2e),
  black: lambert(0x1c1c20),
  wood: lambert(0x6b4a2a),
  olive: lambert(0x3d5a3a),
  chrome: lambert(0x9a9aa2),
  ctTorso: lambert(0x3a5068),
  ctLegs: lambert(0x2e3d4d),
  ctHelmet: lambert(0x22303c),
  ctVest: lambert(0x26343f),
  tTorso: lambert(0x8a6d4a),
  tLegs: lambert(0x6b563c),
  tBandana: lambert(0x7a4f35),
};

/* ------------------------------------------------------------------ */
/* Mesh helpers (fresh geometry per call — safe to dispose)            */
/* ------------------------------------------------------------------ */

function box(
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

/** Cylinder aligned along the Z axis (barrels, scopes). */
function zCyl(
  r: number,
  len: number,
  mat: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

function disposeGeometries(root: THREE.Object3D): void {
  root.traverse((o) => {
    if (o instanceof THREE.Mesh) o.geometry.dispose();
  });
}

/* ------------------------------------------------------------------ */
/* Hitboxes — local space of group (feet origin, before yaw)           */
/* ------------------------------------------------------------------ */

const HITBOXES: HitboxDef[] = [
  { part: 'head', cx: 0, cy: 1.55, cz: 0, hx: 0.16, hy: 0.16, hz: 0.16 },
  { part: 'chest', cx: 0, cy: 1.22, cz: 0, hx: 0.24, hy: 0.2, hz: 0.15 },
  { part: 'stomach', cx: 0, cy: 0.95, cz: 0, hx: 0.22, hy: 0.14, hz: 0.14 },
  { part: 'arm', cx: 0, cy: 1.35, cz: -0.2, hx: 0.34, hy: 0.1, hz: 0.24 },
  { part: 'leg', cx: 0, cy: 0.42, cz: 0, hx: 0.2, hy: 0.42, hz: 0.15 },
];

/* ------------------------------------------------------------------ */
/* Third-person character rig                                          */
/* ------------------------------------------------------------------ */

export function createCharacter(team: Team): CharacterRig {
  const torsoMat = team === 'CT' ? MAT.ctTorso : MAT.tTorso;
  const legMat = team === 'CT' ? MAT.ctLegs : MAT.tLegs;

  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  // Legs — geometry translated so the mesh origin sits at the hip (top of
  // the leg), letting poseRig swing leg.rotation.x around the hip joint.
  const legGeoL = new THREE.BoxGeometry(0.17, 0.8, 0.17);
  legGeoL.translate(0, -0.4, 0);
  const legL = new THREE.Mesh(legGeoL, legMat);
  legL.position.set(-0.11, 0.8, 0);
  legL.castShadow = true;

  const legGeoR = new THREE.BoxGeometry(0.17, 0.8, 0.17);
  legGeoR.translate(0, -0.4, 0);
  const legR = new THREE.Mesh(legGeoR, legMat);
  legR.position.set(0.11, 0.8, 0);
  legR.castShadow = true;

  body.add(legL, legR);

  // Torso
  body.add(box(0.46, 0.62, 0.26, torsoMat, 0, 1.11, 0));

  // Head + darker face plate on the front (-Z)
  const head = box(0.26, 0.26, 0.26, MAT.skin, 0, 1.55, 0);
  head.add(box(0.2, 0.12, 0.02, MAT.face, 0, 0, -0.13));
  body.add(head);

  // Team-specific gear
  if (team === 'CT') {
    body.add(box(0.32, 0.16, 0.32, MAT.ctHelmet, 0, 1.72, 0)); // helmet
    body.add(box(0.38, 0.42, 0.08, MAT.ctVest, 0, 1.14, -0.14)); // vest
  } else {
    body.add(box(0.28, 0.1, 0.28, MAT.tBandana, 0, 1.66, 0)); // head wrap
  }

  // Arms on a shoulder pivot so aim pitch moves arms + gun together
  const armPivot = new THREE.Group();
  armPivot.position.set(0, 1.42, 0);
  body.add(armPivot);

  const armL = box(0.11, 0.11, 0.5, torsoMat, -0.28, 0, -0.24);
  const armR = box(0.11, 0.11, 0.5, torsoMat, 0.28, 0, -0.24);
  armPivot.add(armL, armR);
  armPivot.add(box(0.09, 0.09, 0.09, MAT.skin, -0.28, 0, -0.5)); // hand L
  armPivot.add(box(0.09, 0.09, 0.09, MAT.skin, 0.28, 0, -0.5)); // hand R

  // Gun sits between the hands, slightly right of center
  const gunHolder = new THREE.Group();
  gunHolder.position.set(0.1, -0.06, -0.45);
  armPivot.add(gunHolder);

  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, 0.02, -0.55);
  gunHolder.add(muzzle);

  return {
    group,
    body,
    armPivot,
    legL,
    legR,
    gunHolder,
    muzzle,
    hitboxes: HITBOXES,
    walkPhase: 0,
  };
}

/* ------------------------------------------------------------------ */
/* Posing                                                              */
/* ------------------------------------------------------------------ */

export function poseRig(rig: CharacterRig, o: PoseOpts): void {
  if (o.alive) {
    rig.walkPhase += o.dt * o.speed * 2.2;
    const speedFactor = Math.min(1, o.speed / 4);
    const swing = Math.sin(rig.walkPhase) * 0.55 * speedFactor;
    rig.legL.rotation.x = swing;
    rig.legR.rotation.x = -swing;
    rig.armPivot.rotation.x = o.pitch; // positive pitch = aiming up
    rig.body.rotation.z = 0;
  } else {
    const t = Math.min(1, Math.max(0, o.deathT));
    const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
    rig.body.rotation.z = o.deathDir * (Math.PI / 2) * ease;
  }
}

/* ------------------------------------------------------------------ */
/* Third-person gun models (built into gunHolder, barrels toward -Z)   */
/* ------------------------------------------------------------------ */

interface GunBuild {
  group: THREE.Group;
  length: number;
}

function buildThirdPersonGun(id: WeaponId): GunBuild {
  const g = new THREE.Group();
  let length: number;

  switch (id) {
    case 'ak47':
      g.add(box(0.06, 0.09, 0.3, MAT.metal, 0, 0, -0.12)); // receiver
      g.add(box(0.05, 0.1, 0.16, MAT.wood, 0, -0.01, 0.14)); // stock
      g.add(box(0.04, 0.12, 0.07, MAT.wood, 0, -0.08, -0.16)); // mag grip
      g.add(zCyl(0.016, 0.22, MAT.metal, 0, 0.01, -0.36)); // barrel
      length = 0.55;
      break;
    case 'm4a4':
      g.add(box(0.055, 0.085, 0.32, MAT.black, 0, 0, -0.1)); // receiver
      g.add(box(0.045, 0.08, 0.14, MAT.black, 0, -0.01, 0.15)); // stock
      g.add(box(0.04, 0.11, 0.06, MAT.black, 0, -0.08, -0.12)); // mag
      g.add(zCyl(0.014, 0.22, MAT.metal, 0, 0.01, -0.35)); // barrel
      length = 0.55;
      break;
    case 'awp':
      g.add(box(0.06, 0.09, 0.42, MAT.metal, 0, 0, -0.05)); // body
      g.add(box(0.05, 0.1, 0.16, MAT.black, 0, -0.01, 0.22)); // stock
      g.add(zCyl(0.015, 0.34, MAT.metal, 0, 0.01, -0.42)); // long barrel
      g.add(zCyl(0.028, 0.16, MAT.black, 0, 0.08, -0.05)); // scope
      length = 0.75;
      break;
    case 'glock':
    case 'usp':
      g.add(box(0.045, 0.06, 0.22, MAT.metal, 0, 0.02, -0.08)); // slide
      g.add(box(0.04, 0.11, 0.06, MAT.black, 0, -0.05, 0.02)); // grip
      length = 0.25;
      break;
    case 'deagle':
      g.add(box(0.055, 0.07, 0.26, MAT.chrome, 0, 0.02, -0.09)); // slide
      g.add(box(0.045, 0.12, 0.07, MAT.black, 0, -0.06, 0.03)); // grip
      length = 0.27;
      break;
    case 'knife':
      g.add(box(0.03, 0.04, 0.1, MAT.black, 0, 0, 0.04)); // handle
      g.add(box(0.015, 0.045, 0.22, MAT.chrome, 0, 0.01, -0.1)); // blade
      length = 0.3;
      break;
  }

  return { group: g, length };
}

export function setGun(rig: CharacterRig, id: WeaponId): void {
  const holder = rig.gunHolder;
  for (const child of [...holder.children]) {
    holder.remove(child);
    disposeGeometries(child); // shared materials are kept
  }
  const gun = buildThirdPersonGun(id);
  holder.add(gun.group);
  holder.add(rig.muzzle);
  rig.muzzle.position.set(0, 0.02, -gun.length);
}

/* ------------------------------------------------------------------ */
/* First-person view models (~life-size, centered near origin, -Z)     */
/* ------------------------------------------------------------------ */

export function createViewModel(id: WeaponId): {
  group: THREE.Group;
  muzzle: THREE.Object3D;
} {
  const group = new THREE.Group();
  const muzzle = new THREE.Object3D();

  switch (id) {
    case 'ak47': {
      group.add(box(0.05, 0.08, 0.18, MAT.wood, 0, -0.01, 0.18)); // stock
      group.add(box(0.055, 0.09, 0.28, MAT.metal, 0, 0, -0.04)); // receiver
      const mag = box(0.045, 0.15, 0.08, MAT.metal, 0, -0.1, -0.05);
      mag.rotation.x = 0.35; // curved magazine (~20 deg)
      group.add(mag);
      group.add(box(0.05, 0.06, 0.14, MAT.wood, 0, -0.01, -0.22)); // forend
      group.add(zCyl(0.012, 0.2, MAT.metal, 0, 0.01, -0.35)); // thin barrel
      muzzle.position.set(0, 0.01, -0.45);
      break;
    }
    case 'm4a4': {
      group.add(box(0.05, 0.07, 0.16, MAT.black, 0, -0.01, 0.17)); // stock
      group.add(box(0.05, 0.08, 0.3, MAT.black, 0, 0, -0.02)); // receiver
      group.add(box(0.03, 0.04, 0.16, MAT.black, 0, 0.06, -0.02)); // carry handle
      group.add(box(0.04, 0.13, 0.07, MAT.black, 0, -0.09, -0.04)); // straight mag
      group.add(box(0.045, 0.05, 0.14, MAT.black, 0, -0.01, -0.2)); // handguard
      group.add(zCyl(0.011, 0.22, MAT.black, 0, 0.01, -0.32)); // barrel
      muzzle.position.set(0, 0.01, -0.43);
      break;
    }
    case 'awp': {
      group.add(box(0.055, 0.09, 0.5, MAT.olive, 0, 0, 0.1)); // body + stock
      group.add(box(0.04, 0.08, 0.1, MAT.olive, 0, -0.07, 0.05)); // mag
      group.add(zCyl(0.013, 0.5, MAT.metal, 0, 0.01, -0.4)); // long barrel
      group.add(zCyl(0.03, 0.18, MAT.black, 0, 0.075, 0)); // scope
      group.add(box(0.02, 0.03, 0.06, MAT.black, 0, 0.045, 0)); // scope mount
      muzzle.position.set(0, 0.01, -0.65);
      break;
    }
    case 'glock': {
      group.add(box(0.045, 0.05, 0.24, MAT.black, 0, 0.02, -0.02)); // slide
      const grip = box(0.04, 0.12, 0.06, MAT.black, 0, -0.07, 0.06);
      grip.rotation.x = 0.15;
      group.add(grip);
      muzzle.position.set(0, 0.02, -0.14);
      break;
    }
    case 'usp': {
      group.add(box(0.045, 0.05, 0.26, MAT.black, 0, 0.02, -0.02)); // slide
      const grip = box(0.04, 0.12, 0.06, MAT.black, 0, -0.07, 0.06);
      grip.rotation.x = 0.15;
      group.add(grip);
      group.add(zCyl(0.02, 0.14, MAT.metal, 0, 0.02, -0.2)); // suppressor
      muzzle.position.set(0, 0.02, -0.27);
      break;
    }
    case 'deagle': {
      group.add(box(0.055, 0.06, 0.28, MAT.chrome, 0, 0.02, -0.02)); // bulky slide
      const grip = box(0.045, 0.13, 0.07, MAT.black, 0, -0.08, 0.06);
      grip.rotation.x = 0.15;
      group.add(grip);
      muzzle.position.set(0, 0.02, -0.16);
      break;
    }
    case 'knife': {
      group.add(box(0.03, 0.04, 0.12, MAT.black, 0, 0, 0.08)); // handle
      group.add(box(0.015, 0.05, 0.3, MAT.chrome, 0, 0.01, -0.12)); // flat blade
      muzzle.position.set(0, 0.01, -0.27);
      break;
    }
  }

  group.add(muzzle);
  return { group, muzzle };
}

import * as THREE from 'three';
import { HitboxZone, Team } from '../types';

export interface HitboxDef {
  zone: HitboxZone;
  min: THREE.Vector3;
  max: THREE.Vector3;
}

// Local-space hitboxes (x=right, y=up, z=forward). Origin at feet.
export const HITBOXES: HitboxDef[] = [
  { zone: 'head', min: new THREE.Vector3(-0.14, 1.55, -0.14), max: new THREE.Vector3(0.14, 1.82, 0.14) },
  { zone: 'chest', min: new THREE.Vector3(-0.28, 1.15, -0.17), max: new THREE.Vector3(0.28, 1.55, 0.17) },
  { zone: 'stomach', min: new THREE.Vector3(-0.24, 0.9, -0.16), max: new THREE.Vector3(0.24, 1.15, 0.16) },
  { zone: 'arm', min: new THREE.Vector3(0.28, 1.0, -0.16), max: new THREE.Vector3(0.44, 1.5, 0.24) },
  { zone: 'arm', min: new THREE.Vector3(-0.44, 1.0, -0.16), max: new THREE.Vector3(-0.28, 1.5, 0.24) },
  { zone: 'leg', min: new THREE.Vector3(-0.22, 0.0, -0.15), max: new THREE.Vector3(0.22, 0.9, 0.15) },
];

export interface HumanoidParts {
  group: THREE.Group;
  leftLeg: THREE.Object3D;
  rightLeg: THREE.Object3D;
  leftArm: THREE.Object3D;
  rightArm: THREE.Object3D;
  head: THREE.Object3D;
}

function box(
  w: number,
  h: number,
  d: number,
  color: number,
  rough = 0.7
): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.05 })
  );
  m.castShadow = true;
  return m;
}

/** Build a blocky humanoid with head/torso/arms/legs, distinct per team. */
export function buildHumanoid(team: Team): HumanoidParts {
  const group = new THREE.Group();

  const isCT = team === 'CT';
  const uniform = isCT ? 0x2f5d8c : 0x7a5a34; // CT blue, T tan
  const uniformDark = isCT ? 0x22475f : 0x5c421f;
  const skin = 0xd8a678;
  const gear = isCT ? 0x1c2b3a : 0x3a2a15;

  // pelvis / torso lower
  const pelvis = box(0.44, 0.28, 0.28, uniformDark);
  pelvis.position.y = 1.02;
  group.add(pelvis);

  // chest
  const chest = box(0.52, 0.42, 0.3, uniform);
  chest.position.y = 1.36;
  group.add(chest);

  // vest / chest rig to differentiate teams
  const vest = box(0.5, 0.34, 0.12, gear);
  vest.position.set(0, 1.34, 0.16);
  group.add(vest);

  // shoulders
  const shoulder = box(0.62, 0.14, 0.32, uniformDark);
  shoulder.position.y = 1.55;
  group.add(shoulder);

  // head
  const head = new THREE.Group();
  const skull = box(0.26, 0.26, 0.26, skin);
  head.add(skull);
  // helmet (CT) / cap (T)
  if (isCT) {
    const helmet = box(0.3, 0.16, 0.3, 0x16324a);
    helmet.position.y = 0.13;
    head.add(helmet);
  } else {
    const cap = box(0.3, 0.1, 0.3, 0x2a1d0e);
    cap.position.y = 0.13;
    head.add(cap);
    const brim = box(0.3, 0.05, 0.16, 0x2a1d0e);
    brim.position.set(0, 0.1, 0.2);
    head.add(brim);
  }
  head.position.y = 1.68;
  group.add(head);

  // arms (pivot at shoulder, extend down/forward)
  const makeArm = (side: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.34, 1.5, 0);
    const upper = box(0.14, 0.5, 0.16, uniform);
    upper.position.set(0, -0.2, 0.08);
    upper.rotation.x = -0.9; // forward, holding weapon
    pivot.add(upper);
    const hand = box(0.12, 0.12, 0.12, skin);
    hand.position.set(0, -0.34, 0.34);
    pivot.add(hand);
    return pivot;
  };
  const leftArm = makeArm(-1);
  const rightArm = makeArm(1);
  group.add(leftArm, rightArm);

  // weapon in hands (third-person prop)
  const gun = new THREE.Group();
  const body = box(0.08, 0.12, 0.6, 0x1a1a1a, 0.4);
  gun.add(body);
  const mag = box(0.07, 0.18, 0.1, 0x111111, 0.4);
  mag.position.set(0, -0.12, 0.05);
  gun.add(mag);
  gun.position.set(0.2, 1.15, 0.34);
  group.add(gun);

  // legs (pivot at hip)
  const makeLeg = (side: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.12, 0.9, 0);
    const thigh = box(0.17, 0.5, 0.2, uniformDark);
    thigh.position.y = -0.25;
    pivot.add(thigh);
    const shin = box(0.15, 0.42, 0.18, 0x2a2a2a);
    shin.position.y = -0.68;
    pivot.add(shin);
    const boot = box(0.16, 0.12, 0.26, 0x111111);
    boot.position.set(0, -0.86, 0.04);
    pivot.add(boot);
    return pivot;
  };
  const leftLeg = makeLeg(-1);
  const rightLeg = makeLeg(1);
  group.add(leftLeg, rightLeg);

  return { group, leftLeg, rightLeg, leftArm, rightArm, head };
}

/** Animate walk cycle by swinging legs/arms. */
export function animateHumanoid(
  parts: HumanoidParts,
  moving: boolean,
  t: number
) {
  const swing = moving ? Math.sin(t * 10) * 0.6 : 0;
  parts.leftLeg.rotation.x = swing;
  parts.rightLeg.rotation.x = -swing;
}

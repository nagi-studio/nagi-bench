// Blocky humanoid built entirely from boxes: separate head, torso, pelvis, two
// arms (posed forward gripping the weapon) and two legs with knees + feet. No
// capsules/cylinders. CT reads blue with a helmet; T reads tan with a balaclava.

import * as THREE from 'three';
import { COLORS } from '../constants';
import { Team } from '../types';

export interface CharacterRig {
  root: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  head: THREE.Group;
  weaponHolder: THREE.Group;
  materials: THREE.Material[];
  team: Team;
}

function box(
  w: number, h: number, d: number, color: number, mats: THREE.Material[],
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05, flatShading: true });
  mats.push(mat);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

export function buildCharacter(team: Team): CharacterRig {
  const mats: THREE.Material[] = [];
  const isCT = team === Team.CT;
  const primary = isCT ? COLORS.ctPrimary : COLORS.tPrimary;
  const secondary = isCT ? COLORS.ctSecondary : COLORS.tSecondary;
  const skin = isCT ? COLORS.ctSkin : COLORS.tSkin;

  const root = new THREE.Group();

  // pelvis
  const pelvis = box(0.34, 0.22, 0.22, secondary, mats);
  pelvis.position.set(0, 0.94, 0);
  root.add(pelvis);

  // chest (torso) + vest overlay
  const chest = box(0.44, 0.5, 0.26, primary, mats);
  chest.position.set(0, 1.3, 0);
  root.add(chest);
  const vest = box(0.46, 0.34, 0.1, secondary, mats);
  vest.position.set(0, 1.34, 0.12);
  root.add(vest);
  // shoulders
  const shoulders = box(0.5, 0.14, 0.24, primary, mats);
  shoulders.position.set(0, 1.5, 0);
  root.add(shoulders);

  // head group (neck pivot)
  const head = new THREE.Group();
  head.position.set(0, 1.57, 0);
  root.add(head);
  const neck = box(0.12, 0.08, 0.12, skin, mats);
  neck.position.set(0, 0.0, 0);
  head.add(neck);
  const skull = box(0.24, 0.24, 0.24, isCT ? skin : COLORS.tSecondary, mats);
  skull.position.set(0, 0.16, 0);
  head.add(skull);
  if (isCT) {
    // helmet
    const helmet = box(0.27, 0.13, 0.27, 0x24405f, mats);
    helmet.position.set(0, 0.24, 0);
    head.add(helmet);
    // face strip
    const face = box(0.2, 0.09, 0.02, 0x2a2a30, mats);
    face.position.set(0, 0.14, 0.12);
    head.add(face);
  } else {
    // balaclava eye strip (skin showing)
    const eyes = box(0.2, 0.06, 0.02, skin, mats);
    eyes.position.set(0, 0.18, 0.12);
    head.add(eyes);
  }

  // helper to build a limb hanging from a pivot group
  const makeLeg = (side: number): THREE.Group => {
    const g = new THREE.Group();
    g.position.set(0.12 * side, 0.9, 0);
    const upper = box(0.17, 0.46, 0.19, primary, mats);
    upper.position.set(0, -0.23, 0);
    g.add(upper);
    const lower = box(0.15, 0.44, 0.17, secondary, mats);
    lower.position.set(0, -0.66, 0.01);
    g.add(lower);
    const foot = box(0.16, 0.1, 0.28, 0x2a2a2a, mats);
    foot.position.set(0, -0.87, 0.06);
    g.add(foot);
    return g;
  };
  const legL = makeLeg(1);
  const legR = makeLeg(-1);
  root.add(legL, legR);

  // arms posed forward to grip the weapon (pivot at shoulder)
  const makeArm = (side: number): THREE.Group => {
    const g = new THREE.Group();
    g.position.set(0.26 * side, 1.46, 0);
    const upper = box(0.13, 0.34, 0.14, primary, mats);
    upper.position.set(0, -0.15, 0);
    g.add(upper);
    const lower = box(0.11, 0.3, 0.12, skin, mats);
    lower.position.set(0, -0.42, 0);
    g.add(lower);
    const hand = box(0.1, 0.1, 0.12, 0x3a2f28, mats);
    hand.position.set(0, -0.58, 0);
    g.add(hand);
    // rotate the whole arm forward + inward so hands meet at the gun
    g.rotation.x = -1.35;
    g.rotation.z = 0.28 * side;
    return g;
  };
  const armL = makeArm(1);
  const armR = makeArm(-1);
  root.add(armL, armR);

  // weapon attaches in front of the chest where the hands converge
  const weaponHolder = new THREE.Group();
  weaponHolder.position.set(0, 1.2, -0.36);
  root.add(weaponHolder);

  root.traverse((o) => {
    o.castShadow = true;
  });

  return { root, legL, legR, armL, armR, head, weaponHolder, materials: mats, team };
}

// Walk cycle + idle bob; freezes into a fallen pose when dead.
export function animateCharacter(
  rig: CharacterRig, speed: number, time: number, dead: boolean,
): void {
  if (dead) return;
  const stride = Math.min(1, speed / 6);
  const freq = 8;
  const swing = Math.sin(time * freq) * 0.6 * stride;
  rig.legL.rotation.x = swing;
  rig.legR.rotation.x = -swing;
  // subtle arm counter-bob while keeping the aim pose
  rig.armL.rotation.x = -1.35 + Math.sin(time * freq) * 0.05 * stride;
  rig.armR.rotation.x = -1.35 - Math.sin(time * freq) * 0.05 * stride;
  rig.root.position.y = Math.abs(Math.sin(time * freq)) * 0.04 * stride;
}

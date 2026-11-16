import * as THREE from 'three';
import type { Combatant, Team, WeaponId } from './types';
import { currentWeaponId } from './weapons';
import { buildGun, disposeGroup } from './viewmodel';
import { clamp } from './math';

/**
 * Procedural humanoid: independent head, torso, two arms (upper+forearm+hand),
 * two legs (thigh+shin+boot), posed holding a weapon that follows the facing.
 * CT = navy uniform + helmet; T = tan clothing + headwrap.
 */
export interface CharacterRig {
  group: THREE.Group;
  setWeapon(id: WeaponId): void;
  setBomb(on: boolean): void;
  update(c: Combatant): void;
  dispose(): void;
}

interface TeamPalette {
  shirt: number;
  pants: number;
  vest: number;
  skin: number;
  headgear: number;
  boots: number;
}

const PALETTES: Record<Team, TeamPalette> = {
  CT: { shirt: 0x33506e, pants: 0x22303f, vest: 0x2a3b52, skin: 0xd9a580, headgear: 0x1c2733, boots: 0x14181d },
  T: { shirt: 0xb08d57, pants: 0x6b5b3e, vest: 0x7a6a45, skin: 0xc98d5f, headgear: 0x8a4b32, boots: 0x3a2f22 },
};

const matCache = new Map<number, THREE.MeshLambertMaterial>();
const mat = (color: number): THREE.MeshLambertMaterial => {
  let m = matCache.get(color);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color });
    matCache.set(color, m);
  }
  return m;
};

const bx = (w: number, h: number, d: number, color: number, x = 0, y = 0, z = 0): THREE.Mesh => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
};

export function createRig(team: Team): CharacterRig {
  const p = PALETTES[team];
  const group = new THREE.Group();

  // ---- legs (pivot at hip) ----
  const mkLeg = (side: number): THREE.Group => {
    const leg = new THREE.Group();
    leg.position.set(0.11 * side, 0.92, 0);
    leg.add(bx(0.15, 0.46, 0.17, p.pants, 0, -0.23, 0));
    const knee = new THREE.Group();
    knee.position.set(0, -0.46, 0);
    knee.add(bx(0.13, 0.44, 0.15, p.pants, 0, -0.22, 0));
    knee.add(bx(0.15, 0.1, 0.27, p.boots, 0, -0.42, -0.05));
    leg.add(knee);
    leg.userData.knee = knee;
    return leg;
  };
  const legL = mkLeg(1);
  const legR = mkLeg(-1);
  group.add(legL, legR);

  // ---- torso ----
  group.add(bx(0.44, 0.56, 0.26, p.shirt, 0, 1.22, 0));
  group.add(bx(0.48, 0.38, 0.3, p.vest, 0, 1.28, 0));
  // pouches
  group.add(bx(0.1, 0.1, 0.05, p.boots, -0.12, 1.2, -0.17));
  group.add(bx(0.1, 0.1, 0.05, p.boots, 0.12, 1.2, -0.17));
  group.add(bx(0.16, 0.06, 0.28, p.boots, 0, 0.94, 0)); // belt
  group.add(bx(0.12, 0.08, 0.12, p.skin, 0, 1.53, 0)); // neck

  // ---- head ----
  const head = new THREE.Group();
  head.position.set(0, 1.66, 0);
  head.add(bx(0.24, 0.26, 0.24, p.skin, 0, 0, 0));
  head.add(bx(0.18, 0.045, 0.02, 0x181818, 0, 0.02, -0.125)); // eye strip
  if (team === 'CT') {
    head.add(bx(0.29, 0.13, 0.29, p.headgear, 0, 0.1, 0)); // helmet
    head.add(bx(0.29, 0.03, 0.06, p.headgear, 0, 0.05, -0.15)); // brim
    head.add(bx(0.06, 0.06, 0.06, 0x2a3b52, 0.15, 0.02, 0)); // headset
  } else {
    head.add(bx(0.27, 0.1, 0.27, p.headgear, 0, 0.09, 0)); // headwrap
    head.add(bx(0.08, 0.18, 0.04, p.headgear, 0.06, -0.04, 0.14)); // tail
    head.add(bx(0.2, 0.06, 0.02, 0x222222, 0, -0.06, -0.125)); // scarf over face
  }
  group.add(head);

  // ---- arms (posed forward holding the weapon) ----
  const mkArm = (side: number): THREE.Group => {
    const arm = new THREE.Group();
    arm.position.set(0.27 * side, 1.44, 0);
    arm.add(bx(0.12, 0.4, 0.13, p.shirt, 0, -0.2, 0));
    const elbow = new THREE.Group();
    elbow.position.set(0, -0.4, 0);
    elbow.add(bx(0.1, 0.34, 0.11, p.shirt, 0, -0.17, 0));
    elbow.add(bx(0.1, 0.1, 0.12, p.skin, 0, -0.37, 0));
    arm.add(elbow);
    arm.userData.elbow = elbow;
    return arm;
  };
  const armR = mkArm(1);
  armR.rotation.x = -1.15;
  armR.rotation.z = -0.12;
  (armR.userData.elbow as THREE.Group).rotation.x = -0.5;
  const armL = mkArm(-1);
  armL.rotation.x = -1.25;
  armL.rotation.y = 0.4;
  armL.rotation.z = 0.15;
  (armL.userData.elbow as THREE.Group).rotation.x = -0.55;
  group.add(armR, armL);

  // ---- weapon (follows facing) ----
  const gunMount = new THREE.Group();
  gunMount.position.set(0.1, 1.3, -0.32);
  group.add(gunMount);
  let gun: THREE.Group | null = null;
  let gunId: WeaponId | null = null;

  // ---- C4 backpack ----
  const bombPack = bx(0.3, 0.34, 0.14, 0x4a5d3a, 0, 1.24, 0.2);
  bombPack.add(bx(0.06, 0.06, 0.03, 0xaa2222, 0, 0.08, 0.08));
  bombPack.visible = false;
  group.add(bombPack);

  const setWeapon = (id: WeaponId): void => {
    if (id === gunId) return;
    gunId = id;
    if (gun) {
      gunMount.remove(gun);
      disposeGroup(gun);
    }
    gun = buildGun(id, false);
    gun.scale.setScalar(0.9);
    gunMount.add(gun);
  };
  setWeapon('knife');

  const update = (c: Combatant): void => {
    group.position.set(c.pos.x, c.pos.y, c.pos.z);
    if (!c.alive) {
      const t = clamp(c.deathT * 3, 0, 1);
      group.rotation.set(-t * Math.PI / 2, c.yaw, 0, 'YXZ');
      group.position.y = c.pos.y + 0.05 * t;
      return;
    }
    group.rotation.set(0, c.yaw, 0);
    const speed = Math.sqrt(c.vel.x * c.vel.x + c.vel.z * c.vel.z);
    const amp = clamp(speed / 5, 0, 1) * 0.55;
    const s = Math.sin(c.walkPhase);
    legL.rotation.x = s * amp;
    legR.rotation.x = -s * amp;
    (legL.userData.knee as THREE.Group).rotation.x = Math.max(0, -s) * amp * 0.8;
    (legR.userData.knee as THREE.Group).rotation.x = Math.max(0, s) * amp * 0.8;
    // subtle arm bob while moving, aim pitch follows look
    armR.rotation.x = -1.15 + s * amp * 0.06 + c.pitch * 0.5;
    armL.rotation.x = -1.25 - s * amp * 0.06 + c.pitch * 0.5;
    gunMount.rotation.x = c.pitch * 0.6;
    head.rotation.x = c.pitch * 0.4;
    bombPack.visible = c.hasBomb;
    setWeapon(currentWeaponId(c));
  };

  return {
    group,
    setWeapon,
    setBomb: (on) => {
      bombPack.visible = on;
    },
    update,
    dispose: () => {
      disposeGroup(group);
    },
  };
}

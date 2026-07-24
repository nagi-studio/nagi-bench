import * as THREE from 'three';
import { clamp, lerp } from '../core/math.ts';
import type { Team } from '../core/types.ts';
import type { Actor } from '../game/actor.ts';
import { activeWeapon } from '../game/actor.ts';
import type { WeaponId } from '../game/weapons.ts';
import { buildWeaponModel } from './weaponModel.ts';

interface Skin {
  uniform: number;
  uniformDark: number;
  vest: number;
  head: number;
  helmet: number | null;
  mask: number | null;
  accent: number;
  boots: number;
  gloves: number;
}

/**
 * Two instantly readable silhouettes:
 *  CT — navy fatigues, pale-blue composite helmet, blue chest rig.
 *  T  — sand fatigues, red balaclava, brown chest rig, no helmet.
 */
const SKINS: Record<Team, Skin> = {
  CT: {
    uniform: 0x2d4c7c,
    uniformDark: 0x223a5e,
    vest: 0x1b2b45,
    head: 0xc9a184,
    helmet: 0x93b8dd,
    mask: null,
    accent: 0x6fa8dc,
    boots: 0x14181f,
    gloves: 0x1d232c,
  },
  T: {
    uniform: 0x9c7742,
    uniformDark: 0x7d5c31,
    vest: 0x5d4526,
    head: 0xb98a63,
    helmet: null,
    mask: 0xb5352c,
    accent: 0xd8a13a,
    boots: 0x2a2118,
    gloves: 0x4a3826,
  },
};

function mesh(sx: number, sy: number, sz: number, color: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), new THREE.MeshLambertMaterial({ color }));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/**
 * A fully articulated humanoid built from boxes: head, torso, two arms with
 * elbows, two legs with knees — no capsules, no placeholder cylinders.
 *
 * Hierarchy (all local offsets, metres, model is 1.82 m tall):
 *   root .yaw
 *     body        vertical bob / crouch scale / death fall
 *       hips
 *         torso   leans with view pitch
 *           chest, vest, head, helmet
 *           aim    rotates with view pitch, carries both arms + the weapon
 *         legL/legR -> knee -> shin -> foot
 */
export class CharacterRig {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private hips = new THREE.Group();
  private torso = new THREE.Group();
  private aim = new THREE.Group();
  private headGroup = new THREE.Group();
  private legL = new THREE.Group();
  private legR = new THREE.Group();
  private kneeL = new THREE.Group();
  private kneeR = new THREE.Group();
  private armL = new THREE.Group();
  private armR = new THREE.Group();
  private elbowL = new THREE.Group();
  private elbowR = new THREE.Group();
  private weaponMount = new THREE.Group();
  private weaponModel: THREE.Group | null = null;
  private currentWeapon: WeaponId | null = null;
  private teamMarker: THREE.Mesh | null = null;
  private walkPhase = 0;
  private deathProgress = 0;
  private skin: Skin;

  constructor(readonly team: Team) {
    this.skin = SKINS[team];
    const s = this.skin;

    this.root.add(this.body);
    this.body.add(this.hips);
    this.hips.position.y = 0.92;
    this.hips.add(this.torso);

    // ---- torso ----------------------------------------------------------
    const pelvis = mesh(0.34, 0.2, 0.24, s.uniformDark);
    pelvis.position.y = 0.06;
    this.torso.add(pelvis);

    const chest = mesh(0.42, 0.42, 0.26, s.uniform);
    chest.position.y = 0.39;
    this.torso.add(chest);

    const vest = mesh(0.45, 0.28, 0.3, s.vest);
    vest.position.y = 0.42;
    this.torso.add(vest);

    // Shoulder pads make the silhouette read at distance.
    const padL = mesh(0.12, 0.14, 0.22, s.uniformDark);
    padL.position.set(-0.25, 0.53, 0);
    this.torso.add(padL);
    const padR = padL.clone();
    padR.position.x = 0.25;
    this.torso.add(padR);

    // A coloured band per team, visible from every angle.
    const band = mesh(0.46, 0.05, 0.31, s.accent);
    band.position.y = 0.28;
    this.torso.add(band);

    // ---- head -----------------------------------------------------------
    this.headGroup.position.y = 0.68;
    this.torso.add(this.headGroup);
    const neck = mesh(0.12, 0.08, 0.12, s.head);
    neck.position.y = -0.02;
    this.headGroup.add(neck);
    const head = mesh(0.23, 0.25, 0.23, s.mask ?? s.head);
    head.position.y = 0.12;
    this.headGroup.add(head);
    if (s.mask) {
      // Exposed eyes strip for the balaclava.
      const eyes = mesh(0.2, 0.05, 0.02, 0x2b2118);
      eyes.position.set(0, 0.14, -0.115);
      this.headGroup.add(eyes);
    } else {
      const face = mesh(0.19, 0.1, 0.02, s.head);
      face.position.set(0, 0.1, -0.115);
      this.headGroup.add(face);
    }
    if (s.helmet) {
      const helmet = mesh(0.26, 0.14, 0.27, s.helmet);
      helmet.position.y = 0.22;
      this.headGroup.add(helmet);
      const visor = mesh(0.2, 0.05, 0.03, 0x1b2733);
      visor.position.set(0, 0.19, -0.13);
      this.headGroup.add(visor);
    } else {
      const cap = mesh(0.24, 0.06, 0.24, s.accent);
      cap.position.y = 0.24;
      this.headGroup.add(cap);
    }

    // ---- arms (parented to the aim group so they track the view) ---------
    this.aim.position.y = 0.48;
    this.torso.add(this.aim);

    const buildArm = (side: number, shoulder: THREE.Group, elbow: THREE.Group) => {
      shoulder.position.set(side * 0.26, 0.04, 0);
      this.aim.add(shoulder);
      const upper = mesh(0.13, 0.28, 0.14, s.uniform);
      upper.position.y = -0.13;
      shoulder.add(upper);
      elbow.position.y = -0.26;
      shoulder.add(elbow);
      const fore = mesh(0.115, 0.26, 0.125, s.uniformDark);
      fore.position.y = -0.12;
      elbow.add(fore);
      const hand = mesh(0.1, 0.1, 0.11, s.gloves);
      hand.position.y = -0.27;
      elbow.add(hand);
    };
    buildArm(-1, this.armL, this.elbowL);
    buildArm(1, this.armR, this.elbowR);

    // Weapon sits in front of the chest, held by both hands.
    this.weaponMount.position.set(0.1, -0.06, -0.28);
    this.aim.add(this.weaponMount);

    // ---- legs -----------------------------------------------------------
    const buildLeg = (side: number, hip: THREE.Group, knee: THREE.Group) => {
      hip.position.set(side * 0.115, 0, 0);
      this.hips.add(hip);
      const thigh = mesh(0.16, 0.46, 0.18, s.uniform);
      thigh.position.y = -0.23;
      hip.add(thigh);
      knee.position.y = -0.46;
      hip.add(knee);
      const shin = mesh(0.14, 0.42, 0.16, s.uniformDark);
      shin.position.y = -0.21;
      knee.add(shin);
      const foot = mesh(0.15, 0.09, 0.25, s.boots);
      foot.position.set(0, -0.44, -0.04);
      knee.add(foot);
    };
    buildLeg(-1, this.legL, this.kneeL);
    buildLeg(1, this.legR, this.kneeR);

    this.setWeapon('knife');
    this.root.visible = false;
  }

  /** Small floating diamond so team-mates are identifiable through the chaos. */
  enableTeamMarker(color: number): void {
    if (this.teamMarker) return;
    const m = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.11),
      new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.9 }),
    );
    m.position.y = 2.15;
    m.renderOrder = 999;
    this.teamMarker = m;
    this.root.add(m);
  }

  setWeapon(id: WeaponId): void {
    if (this.currentWeapon === id) return;
    this.currentWeapon = id;
    if (this.weaponModel) {
      this.weaponMount.remove(this.weaponModel);
      disposeTree(this.weaponModel);
    }
    const model = buildWeaponModel(id);
    model.scale.setScalar(0.95);
    this.weaponModel = model;
    this.weaponMount.add(model);
  }

  /** Pose the rig from the simulation state. */
  update(actor: Actor, dt: number, time: number): void {
    this.root.visible = true;
    this.root.position.set(actor.pos.x, actor.pos.y, actor.pos.z);
    this.root.rotation.y = actor.alive ? actor.yaw : actor.deathYaw;

    const held = activeWeapon(actor);
    this.setWeapon(held ? held.id : 'knife');

    if (!actor.alive) {
      this.animateDeath(dt);
      return;
    }
    this.deathProgress = 0;
    this.root.rotation.x = 0;
    this.root.rotation.z = 0;

    // Crouch squashes the whole body; the collision capsule does the same.
    const h = actor.heightScale;
    this.body.scale.y = h;
    this.body.position.y = 0;

    const pitch = clamp(actor.pitch, -0.9, 0.9);
    this.torso.rotation.x = pitch * 0.25;
    this.headGroup.rotation.x = pitch * 0.45;
    this.aim.rotation.x = pitch * 0.8;

    // ---- locomotion -----------------------------------------------------
    const speed = actor.speed2D;
    const moving = speed > 0.4 && actor.grounded;
    const stride = clamp(speed / 5.2, 0, 1.4);
    if (moving) {
      this.walkPhase += dt * (5.5 + stride * 6.5);
    } else {
      // Ease the legs back to neutral when standing still.
      this.walkPhase += dt * 2;
    }
    const swing = moving ? Math.sin(this.walkPhase) * 0.62 * stride : 0;
    const swing2 = moving ? Math.sin(this.walkPhase + Math.PI) * 0.62 * stride : 0;
    const kneeBend = moving ? Math.max(0, -Math.cos(this.walkPhase)) * 0.75 * stride : 0;
    const kneeBend2 = moving ? Math.max(0, -Math.cos(this.walkPhase + Math.PI)) * 0.75 * stride : 0;

    this.legL.rotation.x = swing;
    this.legR.rotation.x = swing2;
    this.kneeL.rotation.x = -kneeBend;
    this.kneeR.rotation.x = -kneeBend2;

    if (!actor.grounded) {
      this.legL.rotation.x = -0.35;
      this.legR.rotation.x = 0.3;
      this.kneeL.rotation.x = -0.7;
      this.kneeR.rotation.x = -0.2;
    }

    // Vertical bob follows the stride, plus a squat while crouching.
    const bob = moving ? Math.abs(Math.sin(this.walkPhase)) * 0.035 * stride : 0;
    this.hips.position.y = 0.92 - bob - (1 - h) * 0.1;

    // ---- weapon hold ----------------------------------------------------
    // Both arms reach forward onto the weapon; the right arm holds the grip.
    const recoilKick = clamp((-actor.punchPitch) * 2.2, 0, 0.5);
    this.armR.rotation.set(-1.32 + recoilKick * 0.25, 0.16, -0.12);
    this.elbowR.rotation.set(-0.42, 0, 0);
    this.armL.rotation.set(-1.16, -0.42, 0.34);
    this.elbowL.rotation.set(-0.72, 0, 0);
    this.weaponMount.rotation.set(recoilKick * 0.6, 0, 0);
    this.weaponMount.position.set(0.1, -0.06 + recoilKick * 0.01, -0.28 + recoilKick * 0.05);

    // Reloading: drop the weapon hand away from the body.
    if (actor.reloadEndTime > 0 && time < actor.reloadEndTime) {
      const t = 1 - (actor.reloadEndTime - time);
      const wob = Math.sin(t * 9) * 0.18;
      this.armL.rotation.x = -0.75 + wob;
      this.weaponMount.rotation.z = 0.5;
      this.weaponMount.rotation.x = 0.35;
    } else {
      this.weaponMount.rotation.z = 0;
    }

    if (this.teamMarker) {
      this.teamMarker.position.y = 2.05 * h + 0.12 + Math.sin(time * 2.5) * 0.04;
      this.teamMarker.rotation.y = time * 1.5;
    }
  }

  private animateDeath(dt: number): void {
    this.deathProgress = Math.min(1, this.deathProgress + dt * 2.6);
    const t = easeOut(this.deathProgress);
    this.root.rotation.x = lerp(0, Math.PI / 2 - 0.08, t);
    this.body.position.y = lerp(0, 0.16, t);
    this.torso.rotation.x = lerp(this.torso.rotation.x, 0.25, t * 0.4);
    this.legL.rotation.x = lerp(this.legL.rotation.x, 0.25, t * 0.3);
    this.legR.rotation.x = lerp(this.legR.rotation.x, -0.2, t * 0.3);
    this.armL.rotation.set(-0.4, -0.5, 0.6);
    this.armR.rotation.set(-0.3, 0.4, -0.7);
    this.elbowL.rotation.x = -0.2;
    this.elbowR.rotation.x = -0.2;
    if (this.teamMarker) this.teamMarker.visible = false;
  }

  resetDeath(): void {
    this.deathProgress = 0;
    if (this.teamMarker) this.teamMarker.visible = true;
  }

  dispose(): void {
    disposeTree(this.root);
  }
}

function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export function disposeTree(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    const m = child as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else if (mat) mat.dispose();
  });
}

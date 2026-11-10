// Procedural humanoid: pelvis, articulated legs (hip + knee), torso, neck, head with team
// headgear, and two-segment arms that are IK-posed onto the grips of the carried weapon.
// The whole upper body pitches with the aim, legs run a walk cycle driven by ground speed.

import * as THREE from 'three';
import type { Actor, Team } from '../sim/actor';
import { angleDiff, clamp } from '../sim/math';
import { WeaponId, WEAPONS } from '../sim/weapons';
import { nameTag } from './textures';
import { WeaponModel, buildBombModel, buildWeaponModel } from './weaponModels';

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const UP = new THREE.Vector3(0, 1, 0);

interface Palette {
  uniform: number;
  uniform2: number;
  vest: number;
  pants: number;
  boots: number;
  gloves: number;
  skin: number;
  headgear: number;
  accent: number;
}

const PALETTES: Record<Team, Palette> = {
  // attackers: rust-orange jackets, khaki trousers, dark balaclava with an orange hood band
  atk: {
    uniform: 0xb4522a,
    uniform2: 0x8f3d1f,
    vest: 0x4a3a2a,
    pants: 0x7a7350,
    boots: 0x3a2a1c,
    gloves: 0x2a2420,
    skin: 0xd2a27c,
    headgear: 0x1e1e20,
    accent: 0xf08a2c,
  },
  // defenders: navy fatigues, slate plate carrier, pale helmet with a dark visor
  def: {
    uniform: 0x2c4a72,
    uniform2: 0x223a5c,
    vest: 0x2a3038,
    pants: 0x26364f,
    boots: 0x141518,
    gloves: 0x15171a,
    skin: 0xd8ab86,
    headgear: 0xd4dae0,
    accent: 0x58b4ff,
  },
};

function part(parent: THREE.Object3D, m: THREE.Material, w: number, h: number, d: number, x: number, y: number, z: number): THREE.Mesh {
  const mesh = new THREE.Mesh(unitBox, m);
  mesh.scale.set(w, h, d);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

interface Arm {
  upper: THREE.Mesh;
  fore: THREE.Mesh;
  hand: THREE.Mesh;
  shoulder: THREE.Vector3;
}

const UPPER_LEN = 0.3;
const FORE_LEN = 0.29;

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _e = new THREE.Vector3();

/** Analytic two-bone IK: positions the upper arm and forearm so the hand reaches `target`. */
function poseArm(arm: Arm, target: THREE.Vector3, pole: THREE.Vector3): void {
  const s = arm.shoulder;
  _a.copy(target).sub(s);
  let d = _a.length();
  const max = UPPER_LEN + FORE_LEN - 0.005;
  if (d > max) {
    _a.multiplyScalar(max / d);
    d = max;
  }
  if (d < 0.05) d = 0.05;
  const dir = _b.copy(_a).normalize();
  const a = (UPPER_LEN * UPPER_LEN - FORE_LEN * FORE_LEN + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, UPPER_LEN * UPPER_LEN - a * a));
  // pole component perpendicular to the shoulder->hand axis
  _c.copy(pole).addScaledVector(dir, -pole.dot(dir));
  if (_c.lengthSq() < 1e-6) _c.set(0, -1, 0);
  _c.normalize();
  const elbow = _e.copy(s).addScaledVector(dir, a).addScaledVector(_c, h);
  const hand = _a.add(s); // clamped hand position
  // upper arm: shoulder -> elbow
  arm.upper.position.copy(s).add(elbow).multiplyScalar(0.5);
  arm.upper.quaternion.setFromUnitVectors(UP, _b.copy(elbow).sub(s).normalize());
  arm.upper.scale.y = s.distanceTo(elbow);
  // forearm: elbow -> hand
  arm.fore.position.copy(elbow).add(hand).multiplyScalar(0.5);
  arm.fore.quaternion.setFromUnitVectors(UP, _b.copy(hand).sub(elbow).normalize());
  arm.fore.scale.y = elbow.distanceTo(hand);
  arm.hand.position.copy(hand);
  arm.hand.quaternion.copy(arm.fore.quaternion);
}

interface Pose {
  mount: THREE.Vector3;
  mountRot: THREE.Euler;
  poleR: THREE.Vector3;
  poleL: THREE.Vector3;
  /** Explicit left-hand target when the weapon is one-handed. */
  freeLeft?: THREE.Vector3;
}

const POSES: Record<string, Pose> = {
  rifle: {
    mount: new THREE.Vector3(0.1, 0.36, -0.22),
    mountRot: new THREE.Euler(0, 0.04, 0),
    poleR: new THREE.Vector3(0.7, -0.7, 0.2),
    poleL: new THREE.Vector3(-0.5, -0.85, 0.1),
  },
  sniper: {
    mount: new THREE.Vector3(0.1, 0.38, -0.2),
    mountRot: new THREE.Euler(0, 0.04, 0),
    poleR: new THREE.Vector3(0.7, -0.7, 0.2),
    poleL: new THREE.Vector3(-0.5, -0.85, 0.1),
  },
  pistol: {
    mount: new THREE.Vector3(0.05, 0.47, -0.47),
    mountRot: new THREE.Euler(0, 0, 0),
    poleR: new THREE.Vector3(0.6, -0.8, 0),
    poleL: new THREE.Vector3(-0.6, -0.8, 0),
  },
  melee: {
    mount: new THREE.Vector3(0.27, 0.2, -0.3),
    mountRot: new THREE.Euler(0.5, 0.2, 0),
    poleR: new THREE.Vector3(0.6, -0.6, 0.5),
    poleL: new THREE.Vector3(-0.6, -0.6, 0.5),
    freeLeft: new THREE.Vector3(-0.3, 0.08, -0.16),
  },
};

export class CharacterModel {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private torso = new THREE.Group();
  private head = new THREE.Group();
  private legL = new THREE.Group();
  private legR = new THREE.Group();
  private kneeL = new THREE.Group();
  private kneeR = new THREE.Group();
  private armR: Arm;
  private armL: Arm;
  private mount = new THREE.Group();
  private weapon: WeaponModel | null = null;
  private weaponId: WeaponId | null = null;
  private weaponCache = new Map<WeaponId, WeaponModel>();
  private bomb: THREE.Group;
  private tag: THREE.Sprite;
  private tagTex: THREE.Texture;
  private tagMat: THREE.SpriteMaterial;
  private mats: THREE.Material[] = [];
  private phase = 0;
  private fall = 0;
  private fallDir = 1;
  private wasAlive = true;
  private recoil = 0;

  constructor(
    readonly team: Team,
    name: string,
  ) {
    const p = PALETTES[team];
    const M = (c: number, rough = 0.85) => {
      const m = new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: 0.02 });
      this.mats.push(m);
      return m;
    };
    const uniform = M(p.uniform);
    const uniform2 = M(p.uniform2);
    const vest = M(p.vest, 0.75);
    const pants = M(p.pants);
    const boots = M(p.boots, 0.7);
    const gloves = M(p.gloves, 0.7);
    const skin = M(p.skin, 0.8);
    const headgear = M(p.headgear, 0.55);
    const accent = M(p.accent, 0.6);
    const dark = M(0x15171a, 0.5);

    this.root.rotation.order = 'YXZ';
    this.root.add(this.body);

    // --- pelvis and legs
    part(this.body, pants, 0.34, 0.17, 0.21, 0, 0.9, 0);
    part(this.body, dark, 0.36, 0.05, 0.23, 0, 0.97, 0); // belt
    const buildLeg = (leg: THREE.Group, knee: THREE.Group, side: number) => {
      leg.position.set(side * 0.1, 0.88, 0);
      part(leg, pants, 0.155, 0.44, 0.175, 0, -0.21, 0);
      knee.position.set(0, -0.42, 0);
      leg.add(knee);
      part(knee, pants, 0.13, 0.36, 0.145, 0, -0.18, 0.005);
      part(knee, team === 'def' ? dark : uniform2, 0.14, 0.1, 0.06, 0, -0.03, -0.075); // knee pad
      part(knee, boots, 0.135, 0.12, 0.27, 0, -0.4, -0.05);
      this.body.add(leg);
    };
    buildLeg(this.legL, this.kneeL, -1);
    buildLeg(this.legR, this.kneeR, 1);

    // --- torso
    this.torso.position.set(0, 0.96, 0);
    this.body.add(this.torso);
    part(this.torso, uniform2, 0.34, 0.22, 0.2, 0, 0.1, 0); // abdomen
    part(this.torso, uniform, 0.42, 0.34, 0.24, 0, 0.36, 0); // chest
    part(this.torso, uniform, 0.5, 0.1, 0.2, 0, 0.49, 0); // shoulders
    if (team === 'def') {
      part(this.torso, vest, 0.44, 0.36, 0.27, 0, 0.33, 0); // plate carrier
      part(this.torso, accent, 0.16, 0.05, 0.01, 0, 0.42, -0.14); // chest ID strip
      part(this.torso, accent, 0.2, 0.06, 0.01, 0, 0.4, 0.14);
      for (let i = -1; i <= 1; i++) part(this.torso, dark, 0.09, 0.13, 0.06, i * 0.11, 0.2, -0.15); // mag pouches
    } else {
      part(this.torso, vest, 0.43, 0.2, 0.26, 0, 0.3, 0); // chest rig
      part(this.torso, vest, 0.07, 0.36, 0.26, -0.13, 0.4, 0); // straps
      part(this.torso, vest, 0.07, 0.36, 0.26, 0.13, 0.4, 0);
      for (let i = -1; i <= 1; i++) part(this.torso, M(0x5a4630), 0.1, 0.15, 0.06, i * 0.115, 0.27, -0.15);
      part(this.torso, accent, 0.3, 0.05, 0.25, 0, 0.535, 0.01); // scarf
    }
    part(this.torso, skin, 0.11, 0.09, 0.11, 0, 0.56, 0); // neck

    // --- head
    this.head.position.set(0, 0.6, 0);
    this.torso.add(this.head);
    part(this.head, skin, 0.19, 0.22, 0.21, 0, 0.11, 0);
    if (team === 'def') {
      part(this.head, headgear, 0.225, 0.13, 0.25, 0, 0.19, 0.005); // helmet shell
      part(this.head, headgear, 0.215, 0.07, 0.12, 0, 0.11, 0.07); // nape guard
      part(this.head, dark, 0.2, 0.06, 0.03, 0, 0.115, -0.105); // visor / goggles
      part(this.head, accent, 0.06, 0.03, 0.01, 0, 0.2, -0.127); // helmet badge
      part(this.head, dark, 0.05, 0.08, 0.1, 0.12, 0.1, 0); // ear protection
      part(this.head, dark, 0.05, 0.08, 0.1, -0.12, 0.1, 0);
    } else {
      part(this.head, headgear, 0.205, 0.235, 0.225, 0, 0.115, 0.004); // balaclava
      part(this.head, skin, 0.15, 0.045, 0.02, 0, 0.13, -0.105); // eye slit
      part(this.head, accent, 0.215, 0.06, 0.235, 0, 0.2, 0.004); // head band
      part(this.head, accent, 0.05, 0.14, 0.03, 0.06, 0.12, 0.12); // band tails
    }

    // --- arms (posed by IK in setWeapon)
    const buildArm = (side: number): Arm => {
      const upper = part(this.torso, uniform, 0.115, 1, 0.12, 0, 0, 0);
      const fore = part(this.torso, team === 'def' ? uniform2 : uniform, 0.1, 1, 0.105, 0, 0, 0);
      const hand = part(this.torso, gloves, 0.085, 0.1, 0.09, 0, 0, 0);
      return { upper, fore, hand, shoulder: new THREE.Vector3(side * 0.25, 0.47, 0) };
    };
    this.armR = buildArm(1);
    this.armL = buildArm(-1);
    this.torso.add(this.mount);

    // --- carried C4 on the back
    this.bomb = buildBombModel().group;
    this.bomb.rotation.set(Math.PI / 2, 0, 0);
    this.bomb.position.set(0, 0.34, 0.16);
    this.bomb.visible = false;
    this.torso.add(this.bomb);

    // --- name tag (shown for teammates only)
    this.tagTex = nameTag(name, team === 'def' ? '#8fd0ff' : '#ffb36b');
    this.tagMat = new THREE.SpriteMaterial({ map: this.tagTex, transparent: true, depthWrite: false });
    this.tag = new THREE.Sprite(this.tagMat);
    this.tag.scale.set(0.95, 0.24, 1);
    this.tag.position.set(0, 2.08, 0);
    this.tag.visible = false;
    this.root.add(this.tag);

    this.setWeapon('knife');
  }

  setWeapon(id: WeaponId): void {
    if (this.weaponId === id) return;
    this.weaponId = id;
    if (this.weapon) this.mount.remove(this.weapon.group);
    let w = this.weaponCache.get(id);
    if (!w) {
      w = buildWeaponModel(id);
      this.weaponCache.set(id, w);
    }
    this.weapon = w;
    this.mount.add(w.group);
    const kind = WEAPONS[id].kind;
    const pose = POSES[kind] ?? POSES.rifle;
    this.mount.position.copy(pose.mount);
    this.mount.rotation.copy(pose.mountRot);
    this.mount.updateMatrix();
    const r = w.gripR.clone().applyMatrix4(this.mount.matrix);
    const l = pose.freeLeft ? pose.freeLeft.clone() : w.gripL.clone().applyMatrix4(this.mount.matrix);
    poseArm(this.armR, r, pose.poleR);
    poseArm(this.armL, l, pose.poleL);
  }

  /** World-space muzzle position (for third-person tracers and flashes). */
  getMuzzle(out: THREE.Vector3): THREE.Vector3 {
    if (!this.weapon) return this.root.getWorldPosition(out);
    this.root.updateWorldMatrix(true, true);
    return out.copy(this.weapon.muzzle).applyMatrix4(this.weapon.group.matrixWorld);
  }

  kick(strength: number): void {
    this.recoil = Math.min(1, this.recoil + strength);
  }

  setTagVisible(v: boolean): void {
    this.tag.visible = v;
  }

  /**
   * Syncs the model to an actor. `x/y/z/yaw/pitch` are the render-interpolated transform.
   */
  update(a: Actor, x: number, y: number, z: number, yaw: number, pitch: number, dt: number, now: number): void {
    const root = this.root;
    root.position.set(x, y, z);
    this.setWeapon(a.def.id);
    this.bomb.visible = a.hasBomb && a.alive;

    if (!a.alive) {
      if (this.wasAlive) {
        this.wasAlive = false;
        this.fall = 0;
        // fall away from the shot: backwards when hit from the front
        this.fallDir = Math.abs(angleDiff(a.deathYaw, yaw)) > Math.PI / 2 ? 1 : -1;
      }
      this.fall = Math.min(1, this.fall + dt / 0.55);
      const e = 1 - (1 - this.fall) * (1 - this.fall);
      root.rotation.set(this.fallDir * e * (Math.PI / 2 - 0.06), yaw, this.fallDir * e * 0.12);
      root.position.y = y + e * 0.13;
      this.body.position.y = 0;
      this.legL.rotation.x = 0.25 * e;
      this.legR.rotation.x = -0.15 * e;
      this.kneeL.rotation.x = -0.5 * e;
      this.kneeR.rotation.x = -0.2 * e;
      this.torso.rotation.x = 0;
      this.mount.visible = false;
      this.tag.visible = false;
      return;
    }
    if (!this.wasAlive) {
      this.wasAlive = true;
      this.mount.visible = true;
      this.fall = 0;
    }
    root.rotation.set(0, yaw, 0);

    // --- locomotion
    const speed = a.speed;
    const moving = clamp(speed / 4.5, 0, 1);
    this.phase += dt * (4 + speed * 2.1) * (moving > 0.05 ? 1 : 0);
    const amp = a.onGround ? moving : 0.25;
    const c = a.crouch;
    const sw = Math.sin(this.phase);
    const cw = Math.cos(this.phase);
    const stride = 0.62 * amp * (1 - c * 0.4);
    this.legL.rotation.x = sw * stride + c * 1.1;
    this.legR.rotation.x = -sw * stride + c * 1.1;
    this.kneeL.rotation.x = -Math.max(0, cw) * 0.95 * amp - c * 1.9;
    this.kneeR.rotation.x = -Math.max(0, -cw) * 0.95 * amp - c * 1.9;
    if (!a.onGround) {
      this.legL.rotation.x = 0.5;
      this.kneeL.rotation.x = -0.9;
      this.legR.rotation.x = -0.15;
      this.kneeR.rotation.x = -0.35;
    }
    const bob = Math.abs(cw) * 0.035 * amp;
    this.body.position.y = -c * 0.31 - bob + Math.sin(now * 1.7 + a.id) * 0.004;

    // --- aim: the upper body pitches with the view, the head a bit more
    this.recoil = Math.max(0, this.recoil - dt * 7);
    const lean = c * 0.22 + moving * 0.06;
    const p = clamp(pitch, -1.3, 1.3);
    const pose = POSES[a.def.kind] ?? POSES.rifle;
    // the torso takes most of the pitch, the weapon the rest, so the muzzle points where shots go
    this.torso.rotation.x = p * 0.65 - lean + this.recoil * 0.05;
    this.head.rotation.x = p * 0.3 + lean;
    this.mount.rotation.x = pose.mountRot.x + p * 0.35 + lean;
    this.mount.position.z = pose.mount.z + this.recoil * 0.03;
  }

  dispose(): void {
    for (const m of this.mats) m.dispose();
    this.tagTex.dispose();
    this.tagMat.dispose();
  }
}

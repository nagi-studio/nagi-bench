// Third-person humanoid built from boxes: head, neck, torso, pelvis, 2-segment arms (IK-driven
// onto the weapon), 2-segment legs with a walk cycle. CT and T have distinct uniforms.
import * as THREE from 'three';
import type { Character, Team } from '../../core/character.ts';
import { BODY, POSES, solveTwoBone } from '../../core/skeleton.ts';
import type { HoldPose } from '../../core/skeleton.ts';
import type { WeaponId } from '../../core/weapons.ts';
import { buildWeaponModel } from './weaponModels.ts';
import type { WeaponModel } from './weaponModels.ts';
import { muzzleFlashTexture } from './textures.ts';

interface Palette {
  skin: number;
  pants: number;
  boots: number;
  shirt: number;
  sleeve: number;
  gloves: number;
  vest: number;
  pouch: number;
  headgear: number;
  accent: number;
}

const PALETTES: Record<Team, Palette> = {
  CT: {
    skin: 0xd6a283,
    pants: 0x2b3a52,
    boots: 0x141414,
    shirt: 0x3b4f6e,
    sleeve: 0x34486a,
    gloves: 0x121212,
    vest: 0x1d2939,
    pouch: 0x273549,
    headgear: 0x2a3950,
    accent: 0x2f7be0,
  },
  T: {
    skin: 0xc8946c,
    pants: 0x6e5d3f,
    boots: 0x3a2918,
    shirt: 0x5b3e28,
    sleeve: 0x5b3e28,
    gloves: 0x2c2218,
    vest: 0x4d4431,
    pouch: 0x5d543c,
    headgear: 0x1b1b1b,
    accent: 0xc7361f,
  },
};

const matCache = new Map<number, THREE.MeshLambertMaterial>();
const lam = (c: number) => {
  let m = matCache.get(c);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color: c });
    matCache.set(c, m);
  }
  return m;
};

const UP_NEG = new THREE.Vector3(0, -1, 0);
let flashTex: THREE.Texture | null = null;

function box(parent: THREE.Object3D, w: number, h: number, d: number, color: number, x: number, y: number, z: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lam(color));
  m.position.set(x, y, z);
  m.castShadow = true;
  parent.add(m);
  return m;
}

/** A limb segment whose geometry hangs down from its pivot (so it can be aimed from joint to joint). */
function limb(parent: THREE.Object3D, w: number, len: number, d: number, color: number): THREE.Object3D {
  const pivot = new THREE.Object3D();
  const geo = new THREE.BoxGeometry(w, len, d);
  geo.translate(0, -len / 2, 0);
  const m = new THREE.Mesh(geo, lam(color));
  m.castShadow = true;
  pivot.add(m);
  parent.add(pivot);
  return pivot;
}

export class CharacterView {
  readonly root = new THREE.Group();
  private tilt = new THREE.Group();
  private upper = new THREE.Group();
  private head = new THREE.Group();
  private hipL = new THREE.Object3D();
  private hipR = new THREE.Object3D();
  private kneeL = new THREE.Object3D();
  private kneeR = new THREE.Object3D();
  private armUR: THREE.Object3D;
  private armFR: THREE.Object3D;
  private armUL: THREE.Object3D;
  private armFL: THREE.Object3D;
  private handR: THREE.Mesh;
  private handL: THREE.Mesh;
  private weaponHolder = new THREE.Group();
  private weapon: WeaponModel | null = null;
  private weaponId: WeaponId | null = null;
  private weaponCache = new Map<WeaponId, WeaponModel>();
  private backpack: THREE.Mesh;
  private flash: THREE.Mesh;
  private flashUntil = 0;
  private lastShot = 0;
  private nameTag: THREE.Sprite | null = null;
  private deathDir = 1;
  readonly team: Team;

  constructor(c: Character, showName: boolean) {
    this.team = c.team;
    const p = PALETTES[c.team];
    this.root.add(this.tilt);
    this.tilt.rotation.order = 'YXZ';

    // ---- legs
    for (const [hip, knee, sx] of [
      [this.hipL, this.kneeL, -1],
      [this.hipR, this.kneeR, 1],
    ] as [THREE.Object3D, THREE.Object3D, number][]) {
      hip.position.set(sx * 0.1, BODY.hipY, 0);
      this.tilt.add(hip);
      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.17, BODY.thigh, 0.18), lam(p.pants));
      thigh.geometry.translate(0, -BODY.thigh / 2, 0);
      thigh.castShadow = true;
      hip.add(thigh);
      // knee pad
      box(hip, 0.12, 0.1, 0.04, p.pouch, 0, -BODY.thigh + 0.02, -0.1);
      knee.position.set(0, -BODY.thigh, 0);
      hip.add(knee);
      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.14, BODY.shin - 0.06, 0.15), lam(p.pants));
      shin.geometry.translate(0, -(BODY.shin - 0.06) / 2, 0);
      shin.castShadow = true;
      knee.add(shin);
      box(knee, 0.15, 0.14, 0.27, p.boots, 0, -BODY.shin + 0.07, -0.04);
      if (c.team === 'T') box(hip, 0.06, 0.12, 0.1, p.pouch, sx * 0.1, -0.18, 0); // thigh pocket
      else box(hip, 0.08, 0.14, 0.12, p.pouch, sx * 0.1, -0.16, -0.01); // holster pouch
    }

    // ---- pelvis + torso (upper body pitches with aim)
    box(this.tilt, 0.36, 0.17, 0.21, p.pants, 0, 0.93, 0);
    box(this.tilt, 0.37, 0.05, 0.22, 0x1d1a16, 0, 1.0, 0); // belt
    this.upper.position.set(0, 1.0, 0);
    this.tilt.add(this.upper);
    const U = (y: number) => y - 1.0; // helper: world-standing y -> upper local
    box(this.upper, 0.34, 0.2, 0.2, p.shirt, 0, U(1.11), 0); // abdomen
    box(this.upper, 0.42, 0.3, 0.23, p.shirt, 0, U(1.34), 0); // chest
    box(this.upper, 0.46, 0.08, 0.22, p.shirt, 0, U(1.46), 0); // shoulders
    if (c.team === 'CT') {
      box(this.upper, 0.44, 0.34, 0.27, p.vest, 0, U(1.3), 0); // plate carrier
      for (const x of [-0.12, 0, 0.12]) box(this.upper, 0.1, 0.1, 0.05, p.pouch, x, U(1.2), -0.15); // mag pouches
      box(this.upper, 0.12, 0.06, 0.03, p.accent, -0.1, U(1.4), -0.14); // blue patch
      box(this.upper, 0.3, 0.3, 0.1, p.pouch, 0, U(1.3), 0.16); // back plate
    } else {
      box(this.upper, 0.38, 0.22, 0.25, p.vest, 0, U(1.27), 0); // chest rig
      for (const x of [-0.1, 0.1]) box(this.upper, 0.09, 0.12, 0.05, p.pouch, x, U(1.24), -0.14);
      box(this.upper, 0.44, 0.05, 0.24, 0x2a2016, 0, U(1.45), 0); // jacket collar
      box(this.upper, 0.08, 0.3, 0.02, 0x3a2a1a, 0, U(1.3), -0.125); // zipper strip
    }
    this.backpack = box(this.upper, 0.28, 0.3, 0.14, 0x4a4632, 0, U(1.28), 0.19);
    box(this.backpack, 0.22, 0.08, 0.02, 0xb09a6c, 0, 0.05, 0.08);
    this.backpack.visible = false;

    // ---- head
    this.head.position.set(0, U(1.5), 0);
    this.upper.add(this.head);
    box(this.head, 0.11, 0.08, 0.11, p.skin, 0, 0.03, 0); // neck
    const H = (y: number) => y - 1.5;
    box(this.head, 0.22, 0.25, 0.24, c.team === 'T' ? p.headgear : p.skin, 0, H(1.645), 0); // skull
    if (c.team === 'CT') {
      // face details + helmet + goggles
      box(this.head, 0.03, 0.035, 0.02, 0x2b1d14, 0, H(1.62), -0.125); // nose
      box(this.head, 0.12, 0.018, 0.01, 0x7a4b3a, 0, H(1.56), -0.121); // mouth
      box(this.head, 0.25, 0.1, 0.27, p.headgear, 0, H(1.76), 0.005); // helmet dome
      box(this.head, 0.26, 0.05, 0.28, p.headgear, 0, H(1.72), 0.01); // helmet brim
      box(this.head, 0.03, 0.12, 0.2, p.headgear, -0.125, H(1.66), 0.02);
      box(this.head, 0.03, 0.12, 0.2, p.headgear, 0.125, H(1.66), 0.02);
      box(this.head, 0.23, 0.05, 0.03, 0x111111, 0, H(1.67), -0.125); // goggles strap/frame
      box(this.head, 0.08, 0.035, 0.01, 0x4a86a8, -0.05, H(1.67), -0.142); // lenses
      box(this.head, 0.08, 0.035, 0.01, 0x4a86a8, 0.05, H(1.67), -0.142);
    } else {
      // balaclava with eye opening + red bandana
      box(this.head, 0.2, 0.05, 0.01, p.skin, 0, H(1.665), -0.122);
      box(this.head, 0.035, 0.02, 0.012, 0x151008, -0.045, H(1.667), -0.126); // eyes
      box(this.head, 0.035, 0.02, 0.012, 0x151008, 0.045, H(1.667), -0.126);
      box(this.head, 0.235, 0.05, 0.255, p.accent, 0, H(1.735), 0); // bandana band
      box(this.head, 0.06, 0.08, 0.03, p.accent, 0.02, H(1.7), 0.13); // knot
    }

    // ---- arms (pivots in upper-body space; oriented by IK each frame)
    this.armUR = limb(this.upper, 0.11, BODY.upperArm, 0.11, p.sleeve);
    this.armFR = limb(this.upper, 0.095, BODY.foreArm, 0.095, p.sleeve);
    this.armUL = limb(this.upper, 0.11, BODY.upperArm, 0.11, p.sleeve);
    this.armFL = limb(this.upper, 0.095, BODY.foreArm, 0.095, p.sleeve);
    if (c.team === 'T') box(this.armUL.children[0] as THREE.Object3D, 0.115, 0.06, 0.115, p.accent, 0, -0.1, 0); // red armband
    else box(this.armUL.children[0] as THREE.Object3D, 0.115, 0.07, 0.03, p.accent, 0, -0.07, 0.05); // flag patch
    this.handR = box(this.upper, 0.075, 0.09, 0.1, p.gloves, 0, 0, 0);
    this.handL = box(this.upper, 0.075, 0.09, 0.1, p.gloves, 0, 0, 0);

    this.upper.add(this.weaponHolder);

    // ---- muzzle flash
    if (!flashTex) flashTex = muzzleFlashTexture();
    this.flash = new THREE.Mesh(
      new THREE.PlaneGeometry(0.35, 0.35),
      new THREE.MeshBasicMaterial({ map: flashTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    );
    this.flash.visible = false;

    if (showName) this.nameTag = makeNameTag(c.name, c.team);
    if (this.nameTag) {
      this.nameTag.position.set(0, 2.15, 0);
      this.root.add(this.nameTag);
    }
  }

  private setWeapon(id: WeaponId | null) {
    if (id === this.weaponId) return;
    this.weaponId = id;
    if (this.weapon) {
      this.weaponHolder.remove(this.weapon.group);
      this.weapon.group.remove(this.flash);
    }
    if (id && !this.weaponCache.has(id)) this.weaponCache.set(id, buildWeaponModel(id));
    this.weapon = id ? this.weaponCache.get(id)! : null;
    if (this.weapon) {
      this.weaponHolder.add(this.weapon.group);
      this.weapon.group.add(this.flash);
      this.flash.position.copy(this.weapon.muzzle);
      this.flash.position.z -= 0.08;
      if (id === 'knife') this.weapon.group.rotation.set(-0.6, 0, 0);
      else this.weapon.group.rotation.set(0, 0, 0);
    }
  }

  private tmpA = new THREE.Vector3();
  private tmpB = new THREE.Vector3();

  private aimLimb(pivot: THREE.Object3D, from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }) {
    pivot.position.set(from.x, from.y - 1.0, from.z);
    this.tmpA.set(to.x - from.x, to.y - from.y, to.z - from.z).normalize();
    pivot.quaternion.setFromUnitVectors(UP_NEG, this.tmpA);
  }

  private poseArms(pose: HoldPose, recoil: number) {
    const P = POSES[pose];
    const grip = { x: P.grip.x, y: P.grip.y, z: P.grip.z + recoil * 0.05 };
    const left = { x: P.left.x, y: P.left.y, z: P.left.z + recoil * 0.05 };
    const R = solveTwoBone(BODY.shoulderR, grip, BODY.upperArm, BODY.foreArm, P.poleR);
    const L = solveTwoBone(BODY.shoulderL, left, BODY.upperArm, BODY.foreArm, P.poleL);
    this.aimLimb(this.armUR, BODY.shoulderR, R.elbow);
    this.aimLimb(this.armFR, R.elbow, R.hand);
    this.aimLimb(this.armUL, BODY.shoulderL, L.elbow);
    this.aimLimb(this.armFL, L.elbow, L.hand);
    this.handR.position.set(R.hand.x, R.hand.y - 1.0, R.hand.z);
    this.handR.quaternion.copy(this.armFR.quaternion);
    this.handL.position.set(L.hand.x, L.hand.y - 1.0, L.hand.z);
    this.handL.quaternion.copy(this.armFL.quaternion);
    this.weaponHolder.position.set(grip.x, grip.y - 1.0, grip.z);
    this.tmpB.set(0, 0, 0);
  }

  /**
   * @param pos interpolated feet position
   * @param now render time (seconds)
   */
  update(c: Character, pos: THREE.Vector3, yaw: number, now: number, simTime: number) {
    this.root.position.copy(pos);
    this.root.rotation.y = c.alive ? yaw : c.deathYaw;
    const def = c.def;
    this.setWeapon(c.alive ? (def?.id ?? null) : null);
    this.backpack.visible = c.alive && c.hasBomb() && c.active !== 'bomb';

    if (!c.alive) {
      // fall over
      const t = Math.min(1, (simTime - c.deathTime) / 0.55);
      const e = t * t * (3 - 2 * t);
      if (t < 0.02) this.deathDir = c.id % 3 === 0 ? -1 : 1;
      this.tilt.rotation.x = this.deathDir * e * (Math.PI / 2 - 0.08);
      this.tilt.position.y = e * 0.13;
      this.upper.rotation.x = 0;
      this.hipL.rotation.x = e * 0.3;
      this.hipR.rotation.x = -e * 0.2;
      this.kneeL.rotation.x = -e * 0.4;
      this.kneeR.rotation.x = -e * 0.2;
      this.poseArms('rifle', 0);
      if (this.nameTag) this.nameTag.visible = false;
      this.flash.visible = false;
      return;
    }
    this.tilt.rotation.x = 0;
    this.tilt.position.y = 0;
    if (this.nameTag) this.nameTag.visible = true;

    // walk cycle
    const speed = Math.min(1, c.animSpeed / 5.5);
    const ph = c.walkPhase;
    const swing = Math.sin(ph) * 0.62 * speed;
    this.hipL.rotation.x = swing;
    this.hipR.rotation.x = -swing;
    this.kneeL.rotation.x = -Math.max(0, Math.sin(ph + Math.PI / 2)) * 0.95 * speed - 0.05;
    this.kneeR.rotation.x = -Math.max(0, Math.sin(ph - Math.PI / 2)) * 0.95 * speed - 0.05;
    if (!c.body.onGround) {
      this.hipL.rotation.x = 0.5;
      this.hipR.rotation.x = 0.2;
      this.kneeL.rotation.x = -0.9;
      this.kneeR.rotation.x = -0.6;
    }
    const bob = Math.abs(Math.cos(ph)) * 0.03 * speed;
    this.upper.position.y = 1.0 - bob * 0.5;
    this.tilt.position.y = -bob;

    // aim pitch (torso follows partially, head the rest)
    const pitch = c.pitch;
    this.upper.rotation.x = pitch * 0.55;
    this.head.rotation.x = pitch * 0.35;
    if (c.plantProgress >= 0 || c.defuseProgress >= 0) {
      // kneel down to plant/defuse
      this.hipL.rotation.x = 1.2;
      this.kneeL.rotation.x = -1.5;
      this.hipR.rotation.x = -0.1;
      this.kneeR.rotation.x = -1.9;
      this.tilt.position.y = -0.4;
      this.upper.rotation.x = -0.4;
    }

    // weapon recoil kick
    if (c.shotCounter !== this.lastShot) {
      this.lastShot = c.shotCounter;
      if (def && def.slot !== 'melee' && def.slot !== 'bomb' && !def.silenced) this.flashUntil = now + 0.05;
    }
    const kick = Math.max(0, 1 - (simTime - c.lastShotTime) / 0.12);
    const pose = c.plantProgress >= 0 || c.defuseProgress >= 0 ? 'bomb' : c.holdPose;
    this.poseArms(pose, kick);
    if (def?.slot === 'melee' && simTime < c.meleeSwingEnd) {
      const k = 1 - (c.meleeSwingEnd - simTime) / (c.meleeAlt ? 0.6 : 0.35);
      this.weaponHolder.rotation.set(-Math.sin(k * Math.PI) * 1.2, Math.sin(k * Math.PI) * 0.6, 0);
    } else this.weaponHolder.rotation.set(0, 0, 0);

    this.flash.visible = now < this.flashUntil;
    if (this.flash.visible) this.flash.rotation.z = Math.random() * Math.PI;
  }

  dispose() {
    this.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.geometry.dispose();
    });
  }
}

function makeNameTag(name: string, team: Team): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'rgba(0,0,0,0.8)';
  ctx.strokeText(name, 128, 32);
  ctx.fillStyle = team === 'CT' ? '#8fc3ff' : '#ffc27a';
  ctx.fillText(name, 128, 32);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  s.scale.set(1.0, 0.25, 1);
  return s;
}

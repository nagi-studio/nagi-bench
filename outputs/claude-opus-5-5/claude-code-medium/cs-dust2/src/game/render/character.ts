// Procedural humanoid soldier: separate head, torso, two jointed arms and two
// jointed legs. Dimensions match the hitboxes in core/hitbox.ts.
import * as THREE from 'three';
import type { Entity, Team } from '../core/entity.ts';
import type { WeaponId } from '../core/weapons.ts';
import { WEAPONS } from '../core/weapons.ts';
import { buildBomb, buildGun } from './gunModels.ts';

interface Palette {
  shirt: number;
  pants: number;
  vest: number;
  boots: number;
  gloves: number;
  skin: number;
  head: number;
  accent: number;
}

const PALETTES: Record<Team, Palette> = {
  // CT: navy uniform, dark tactical vest, blue-grey helmet
  CT: { shirt: 0x2f5592, pants: 0x2a3b58, vest: 0x1f2a3d, boots: 0x161616, gloves: 0x1d1d1d, skin: 0xc99a78, head: 0x46566b, accent: 0x7fb4ff },
  // T: rust jacket, khaki pants, black balaclava with red bandana
  T: { shirt: 0x9c4a2a, pants: 0x7d6a48, vest: 0x4a3f2c, boots: 0x3b2a1b, gloves: 0x2a2620, skin: 0xb88866, head: 0x1f1d1b, accent: 0xc0302a },
};

function part(parent: THREE.Object3D, mat: THREE.Material, w: number, h: number, d: number, x: number, y: number, z: number) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

type Pose = 'rifle' | 'pistol' | 'knife';

export class CharacterView {
  root = new THREE.Group();
  private body = new THREE.Group();
  private aim = new THREE.Group();
  private headPivot = new THREE.Group();
  private thighL = new THREE.Group();
  private thighR = new THREE.Group();
  private kneeL = new THREE.Group();
  private kneeR = new THREE.Group();
  private shoulderL = new THREE.Group();
  private shoulderR = new THREE.Group();
  private elbowL = new THREE.Group();
  private elbowR = new THREE.Group();
  private gunHolder = new THREE.Group();
  private gun: THREE.Group | null = null;
  private gunId: WeaponId | null = null;
  private bomb: THREE.Group;
  private walkPhase = 0;
  private deathAnim = 0;
  private recoil = 0;
  private flash: THREE.Mesh;
  private flashT = 0;
  team: Team;

  constructor(team: Team, flashMat: THREE.Material) {
    this.team = team;
    const p = PALETTES[team];
    const M = (c: number) => new THREE.MeshLambertMaterial({ color: c });
    const shirt = M(p.shirt);
    const pants = M(p.pants);
    const vest = M(p.vest);
    const boots = M(p.boots);
    const gloves = M(p.gloves);
    const skin = M(p.skin);
    const head = M(p.head);
    const accent = M(p.accent);

    this.root.add(this.body);

    // ---- legs (hip pivots at y=0.9)
    for (const [thigh, knee, x] of [
      [this.thighL, this.kneeL, -0.1],
      [this.thighR, this.kneeR, 0.1],
    ] as [THREE.Group, THREE.Group, number][]) {
      thigh.position.set(x, 0.9, 0);
      this.body.add(thigh);
      part(thigh, pants, 0.17, 0.46, 0.19, 0, -0.23, 0);
      if (team === 'CT') part(thigh, vest, 0.18, 0.12, 0.08, 0, -0.18, -0.08); // knee/thigh pad
      knee.position.set(0, -0.46, 0);
      thigh.add(knee);
      part(knee, pants, 0.15, 0.4, 0.17, 0, -0.2, 0);
      part(knee, boots, 0.17, 0.12, 0.28, 0, -0.39, -0.04);
    }

    // ---- torso
    part(this.body, pants, 0.38, 0.18, 0.24, 0, 0.95, 0); // pelvis
    part(this.body, boots, 0.4, 0.05, 0.25, 0, 1.03, 0); // belt
    part(this.body, shirt, 0.36, 0.2, 0.22, 0, 1.13, 0); // abdomen
    part(this.body, shirt, 0.46, 0.34, 0.26, 0, 1.32, 0); // chest
    if (team === 'CT') {
      part(this.body, vest, 0.48, 0.32, 0.3, 0, 1.29, 0); // plate carrier
      part(this.body, vest, 0.1, 0.1, 0.05, -0.12, 1.2, -0.17); // pouches
      part(this.body, vest, 0.1, 0.1, 0.05, 0.0, 1.2, -0.17);
      part(this.body, accent, 0.08, 0.04, 0.01, 0.13, 1.4, -0.155); // flag patch
    } else {
      part(this.body, vest, 0.42, 0.16, 0.29, 0, 1.18, 0); // chest rig
      part(this.body, vest, 0.08, 0.12, 0.05, -0.1, 1.2, -0.16);
      part(this.body, vest, 0.08, 0.12, 0.05, 0.03, 1.2, -0.16);
      part(this.body, accent, 0.47, 0.06, 0.27, 0, 1.44, 0); // red scarf
    }
    part(this.body, skin, 0.11, 0.08, 0.11, 0, 1.52, 0); // neck

    // ---- head
    this.headPivot.position.set(0, 1.55, 0);
    this.body.add(this.headPivot);
    part(this.headPivot, team === 'CT' ? skin : head, 0.22, 0.24, 0.24, 0, 0.12, 0);
    if (team === 'CT') {
      part(this.headPivot, head, 0.26, 0.1, 0.28, 0, 0.255, 0.0); // helmet dome
      part(this.headPivot, head, 0.27, 0.06, 0.29, 0, 0.19, 0.01); // helmet rim
      part(this.headPivot, M(0x111111), 0.2, 0.05, 0.02, 0, 0.15, -0.125); // goggles
      part(this.headPivot, M(0x355a3a), 0.04, 0.05, 0.05, 0.13, 0.22, -0.05); // headset
    } else {
      part(this.headPivot, skin, 0.18, 0.045, 0.01, 0, 0.15, -0.122); // eye slit
      part(this.headPivot, accent, 0.235, 0.05, 0.25, 0, 0.21, 0); // bandana
      part(this.headPivot, accent, 0.05, 0.1, 0.02, -0.06, 0.16, 0.13); // bandana tail
    }

    // ---- arms + weapon (pivot group follows aim pitch)
    this.aim.position.set(0, 1.42, 0);
    this.body.add(this.aim);
    for (const [sh, el, x] of [
      [this.shoulderL, this.elbowL, -0.25],
      [this.shoulderR, this.elbowR, 0.25],
    ] as [THREE.Group, THREE.Group, number][]) {
      sh.position.set(x, 0, 0);
      this.aim.add(sh);
      part(sh, shirt, 0.12, 0.3, 0.12, 0, -0.15, 0);
      if (team === 'CT') part(sh, vest, 0.13, 0.1, 0.13, 0, -0.04, 0); // shoulder pad
      el.position.set(0, -0.3, 0);
      sh.add(el);
      part(el, shirt, 0.1, 0.27, 0.1, 0, -0.13, 0);
      part(el, gloves, 0.09, 0.09, 0.1, 0, -0.3, 0);
    }
    this.aim.add(this.gunHolder);

    // ---- bomb backpack
    this.bomb = buildBomb();
    this.bomb.rotation.x = Math.PI / 2;
    this.bomb.position.set(0, 1.25, 0.16);
    this.bomb.visible = false;
    this.body.add(this.bomb);

    // ---- muzzle flash billboard
    this.flash = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.35), flashMat);
    this.flash.visible = false;
    this.root.add(this.flash);
  }

  private setPose(pose: Pose) {
    const sL = this.shoulderL;
    const sR = this.shoulderR;
    const eL = this.elbowL;
    const eR = this.elbowR;
    if (pose === 'rifle') {
      sR.rotation.set(0.45, 0, -0.15);
      eR.rotation.set(1.25, 0, 0);
      sL.rotation.set(1.0, 0, 0.55);
      eL.rotation.set(0.55, 0, 0);
      this.gunHolder.position.set(0.11, -0.09, -0.3);
    } else if (pose === 'pistol') {
      sR.rotation.set(1.42, 0, -0.25);
      eR.rotation.set(0.1, 0, 0);
      sL.rotation.set(1.35, 0, 0.5);
      eL.rotation.set(0.12, 0, 0);
      this.gunHolder.position.set(0.04, -0.05, -0.58);
    } else {
      sR.rotation.set(0.9, 0, -0.1);
      eR.rotation.set(0.7, 0, 0);
      sL.rotation.set(0.25, 0, 0.15);
      eL.rotation.set(0.3, 0, 0);
      this.gunHolder.position.set(0.2, -0.38, -0.42);
    }
  }

  setWeapon(id: WeaponId) {
    if (id === this.gunId) return;
    if (this.gun) this.gunHolder.remove(this.gun);
    this.gun = buildGun(id);
    this.gunId = id;
    this.gunHolder.add(this.gun);
    const slot = WEAPONS[id].slot;
    this.setPose(slot === 'primary' ? 'rifle' : slot === 'secondary' ? 'pistol' : 'knife');
  }

  /** World position of the weapon muzzle (for tracers / flashes). */
  muzzleWorld(out: THREE.Vector3): THREE.Vector3 {
    const m = this.gun?.getObjectByName('muzzle');
    if (m) return m.getWorldPosition(out);
    return this.aim.getWorldPosition(out);
  }

  onShot() {
    this.recoil = 1;
    this.flashT = 0.05;
  }

  update(e: Entity, x: number, y: number, z: number, dt: number, camera: THREE.Camera, weaponId: WeaponId) {
    this.setWeapon(weaponId);
    this.root.position.set(x, y, z);
    this.root.rotation.y = e.yaw;
    this.bomb.visible = e.hasBomb && e.alive;

    if (!e.alive) {
      // fall backwards
      this.deathAnim = Math.min(1, this.deathAnim + dt * 2.6);
      const t = 1 - Math.pow(1 - this.deathAnim, 3);
      this.body.rotation.x = (Math.PI / 2) * t * 0.98;
      this.body.position.y = 0.12 * t;
      this.aim.rotation.x = -0.6 * t;
      this.thighL.rotation.x = 0.3 * t;
      this.thighR.rotation.x = -0.2 * t;
      this.kneeL.rotation.x = -0.4 * t;
      this.kneeR.rotation.x = 0;
      this.flash.visible = false;
      return;
    }
    this.deathAnim = 0;
    this.body.rotation.x = 0;
    this.body.position.y = 0;

    // aim pitch (upper body/arms + head)
    const pitch = e.pitch + e.recoilPitch;
    this.aim.rotation.x = pitch;
    this.headPivot.rotation.x = pitch * 0.6;

    // weapon recoil
    this.recoil = Math.max(0, this.recoil - dt * 12);
    if (this.gun) this.gun.position.z = this.recoil * 0.05;

    // legs
    const speed = Math.hypot(e.vel.x, e.vel.z);
    if (!e.onGround) {
      this.thighL.rotation.x = 0.5;
      this.thighR.rotation.x = 0.2;
      this.kneeL.rotation.x = -0.8;
      this.kneeR.rotation.x = -0.5;
    } else if (speed > 0.3) {
      // direction of motion relative to facing (backpedal flips the cycle)
      const fx = -Math.sin(e.yaw);
      const fz = -Math.cos(e.yaw);
      const fwd = (e.vel.x * fx + e.vel.z * fz) / speed;
      this.walkPhase += dt * speed * 2.1 * (fwd < -0.3 ? -1 : 1);
      const amp = Math.min(1, speed / 5) * 0.65;
      const s = Math.sin(this.walkPhase);
      this.thighL.rotation.x = s * amp;
      this.thighR.rotation.x = -s * amp;
      this.kneeL.rotation.x = -Math.max(0, -Math.cos(this.walkPhase)) * amp * 1.3;
      this.kneeR.rotation.x = -Math.max(0, Math.cos(this.walkPhase)) * amp * 1.3;
      this.body.position.y = Math.abs(Math.cos(this.walkPhase)) * 0.03 * amp;
    } else {
      const k = Math.min(1, dt * 10);
      this.thighL.rotation.x *= 1 - k;
      this.thighR.rotation.x *= 1 - k;
      this.kneeL.rotation.x *= 1 - k;
      this.kneeR.rotation.x *= 1 - k;
    }
    // planting / defusing: crouch down
    if (e.planting || e.defusing) {
      this.thighL.rotation.x = 1.2;
      this.thighR.rotation.x = 1.2;
      this.kneeL.rotation.x = -2.0;
      this.kneeR.rotation.x = -2.0;
      this.body.position.y = -0.38;
      this.aim.rotation.x = -0.9;
    }

    // muzzle flash billboard
    if (this.flashT > 0) {
      this.flashT -= dt;
      const v = new THREE.Vector3();
      this.muzzleWorld(v);
      this.root.worldToLocal(v);
      this.flash.position.copy(v);
      this.flash.quaternion.copy(camera.quaternion);
      // camera quaternion is world space; cancel root rotation
      const inv = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -e.yaw, 0));
      this.flash.quaternion.premultiply(inv);
      this.flash.visible = true;
    } else this.flash.visible = false;
  }

  dispose() {
    this.root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
    });
  }
}

// First-person viewmodel: gun + arms rendered in a separate overlay scene/camera.
import * as THREE from 'three';
import type { Character, Team } from '../../core/character.ts';
import type { WeaponId } from '../../core/weapons.ts';
import { solveTwoBone } from '../../core/skeleton.ts';
import { buildWeaponModel } from './weaponModels.ts';
import type { WeaponModel } from './weaponModels.ts';
import { muzzleFlashTexture } from './textures.ts';

const ARM_U = 0.42;
const ARM_F = 0.4;
const SHOULDER_R = { x: 0.21, y: -0.33, z: 0.22 };
const SHOULDER_L = { x: -0.21, y: -0.33, z: 0.22 };
const POLE_R = { x: 0.8, y: -0.9, z: 0.3 };
const POLE_L = { x: -0.8, y: -0.9, z: 0.1 };

interface Placement {
  pos: [number, number, number];
  rot: [number, number, number];
  kick: number;
  kickRot: number;
}

const PLACEMENT: Record<WeaponId, Placement> = {
  ak47: { pos: [0.12, -0.15, -0.3], rot: [0.02, 0.03, 0], kick: 0.045, kickRot: 0.07 },
  m4a4: { pos: [0.12, -0.148, -0.3], rot: [0.02, 0.03, 0], kick: 0.03, kickRot: 0.04 },
  awp: { pos: [0.12, -0.155, -0.26], rot: [0.02, 0.03, 0], kick: 0.1, kickRot: 0.2 },
  glock: { pos: [0.1, -0.13, -0.34], rot: [0.03, 0.04, 0], kick: 0.04, kickRot: 0.18 },
  usp: { pos: [0.1, -0.13, -0.34], rot: [0.03, 0.04, 0], kick: 0.04, kickRot: 0.16 },
  deagle: { pos: [0.1, -0.135, -0.35], rot: [0.03, 0.04, 0], kick: 0.08, kickRot: 0.4 },
  knife: { pos: [0.15, -0.15, -0.32], rot: [0.5, 0.35, -0.2], kick: 0, kickRot: 0 },
  c4: { pos: [0.03, -0.2, -0.36], rot: [0.5, 0, 0], kick: 0, kickRot: 0 },
};

const SLEEVE: Record<Team, number> = { CT: 0x34486a, T: 0x5b3e28 };
const GLOVE: Record<Team, number> = { CT: 0x141414, T: 0x2c2218 };
const UP_NEG = new THREE.Vector3(0, -1, 0);

function limb(parent: THREE.Object3D, w: number, len: number, mat: THREE.Material): THREE.Object3D {
  const pivot = new THREE.Object3D();
  const g = new THREE.BoxGeometry(w, len, w);
  g.translate(0, -len / 2, 0);
  pivot.add(new THREE.Mesh(g, mat));
  parent.add(pivot);
  return pivot;
}

export class Viewmodel {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(60, 1, 0.01, 10);
  private root = new THREE.Group();
  private gunPivot = new THREE.Group();
  private model: WeaponModel | null = null;
  private modelId: WeaponId | null = null;
  private cache = new Map<WeaponId, WeaponModel>();
  private team: Team | null = null;
  private sleeveMat = new THREE.MeshLambertMaterial({ color: 0x34486a });
  private sleeveDark = new THREE.MeshLambertMaterial({ color: 0x28364d });
  private gloveMat = new THREE.MeshLambertMaterial({ color: 0x141414 });
  private armUR: THREE.Object3D;
  private armFR: THREE.Object3D;
  private armUL: THREE.Object3D;
  private armFL: THREE.Object3D;
  private handR: THREE.Mesh;
  private handL: THREE.Mesh;
  private flash: THREE.Mesh;
  private hemi: THREE.HemisphereLight;
  private sun: THREE.DirectionalLight;
  private flashUntil = 0;
  private lastShot = -1;
  private kick = 0;
  private swayX = 0;
  private swayY = 0;
  private land = 0;
  private lightLevel = 1;
  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();
  private charId = -1;

  constructor() {
    this.scene.add(this.root);
    this.root.add(this.gunPivot);
    this.hemi = new THREE.HemisphereLight(0xfff1dc, 0x6b5a45, 1.6);
    this.sun = new THREE.DirectionalLight(0xffe4be, 2.0);
    this.sun.position.set(0.6, 1, 0.4);
    this.scene.add(this.hemi, this.sun);
    this.armUR = limb(this.root, 0.085, ARM_U, this.sleeveMat);
    this.armFR = limb(this.root, 0.07, ARM_F, this.sleeveDark);
    this.armUL = limb(this.root, 0.085, ARM_U, this.sleeveMat);
    this.armFL = limb(this.root, 0.07, ARM_F, this.sleeveDark);
    const hg = new THREE.BoxGeometry(0.06, 0.085, 0.1);
    this.handR = new THREE.Mesh(hg, this.gloveMat);
    this.handL = new THREE.Mesh(hg, this.gloveMat);
    this.root.add(this.handR, this.handL);
    this.flash = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.16),
      new THREE.MeshBasicMaterial({ map: muzzleFlashTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    this.flash.visible = false;
  }

  setAspect(a: number) {
    this.camera.aspect = a;
    this.camera.updateProjectionMatrix();
  }

  /** 0..1 ambient level (e.g. darker inside tunnels) */
  setLightLevel(l: number) {
    this.lightLevel += (l - this.lightLevel) * 0.1;
    this.hemi.intensity = 0.7 + 0.9 * this.lightLevel;
    this.sun.intensity = 0.4 + 1.6 * this.lightLevel;
  }

  onLand(impact: number) {
    this.land = Math.min(1, impact / 8);
  }

  private setModel(id: WeaponId | null) {
    if (id === this.modelId) return;
    this.modelId = id;
    if (this.model) {
      this.gunPivot.remove(this.model.group);
      this.model.group.remove(this.flash);
    }
    if (id && !this.cache.has(id)) {
      const m = buildWeaponModel(id);
      m.group.traverse((o) => {
        o.castShadow = false;
        // keep the viewmodel from being clipped by the frustum when animating
        o.frustumCulled = false;
      });
      this.cache.set(id, m);
    }
    this.model = id ? this.cache.get(id)! : null;
    if (this.model) {
      this.gunPivot.add(this.model.group);
      this.flash.position.copy(this.model.muzzle);
      this.flash.position.z -= 0.03;
      this.model.group.add(this.flash);
    }
  }

  private aim(pivot: THREE.Object3D, a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
    pivot.position.set(a.x, a.y, a.z);
    this.tmp.set(b.x - a.x, b.y - a.y, b.z - a.z).normalize();
    pivot.quaternion.setFromUnitVectors(UP_NEG, this.tmp);
  }

  update(c: Character, simTime: number, now: number, dt: number, mouseDX: number, mouseDY: number, visible: boolean) {
    this.root.visible = visible && c.alive;
    if (!this.root.visible) return;
    if (this.team !== c.team || this.charId !== c.id) {
      this.team = c.team;
      this.charId = c.id;
      this.sleeveMat.color.setHex(SLEEVE[c.team]);
      this.sleeveDark.color.setHex(SLEEVE[c.team]).multiplyScalar(0.8);
      this.gloveMat.color.setHex(GLOVE[c.team]);
      this.lastShot = c.shotCounter;
    }
    const def = c.def;
    const id = def?.id ?? null;
    this.setModel(id);
    if (!def || !this.model) return;
    const P = PLACEMENT[def.id];

    // --- shot kick
    if (c.shotCounter !== this.lastShot) {
      this.lastShot = c.shotCounter;
      this.kick = 1;
      if (def.slot !== 'melee' && def.slot !== 'bomb') this.flashUntil = now + (def.silenced ? 0.0 : 0.045);
    }
    this.kick *= Math.exp(-dt * (def.id === 'awp' ? 7 : 16));

    // --- sway & bob
    this.swayX += (-mouseDX * 0.00035 - this.swayX) * Math.min(1, dt * 10);
    this.swayY += (mouseDY * 0.00035 - this.swayY) * Math.min(1, dt * 10);
    this.swayX = THREE.MathUtils.clamp(this.swayX, -0.03, 0.03);
    this.swayY = THREE.MathUtils.clamp(this.swayY, -0.03, 0.03);
    const speed = Math.min(1, c.animSpeed / 5.5) * (c.body.onGround ? 1 : 0.2);
    const ph = c.walkPhase;
    const bobX = Math.sin(ph) * 0.011 * speed;
    const bobY = -Math.abs(Math.cos(ph)) * 0.009 * speed;
    this.land *= Math.exp(-dt * 8);

    let px = P.pos[0] + bobX + this.swayX;
    let py = P.pos[1] + bobY + this.swayY - this.land * 0.03;
    let pz = P.pos[2] + this.kick * P.kick;
    let rx = P.rot[0] + this.kick * P.kickRot;
    let ry = P.rot[1] + this.swayX * 2;
    let rz = P.rot[2];

    // --- deploy
    const dep = THREE.MathUtils.clamp(1 - (c.deployEnd - simTime) / def.deployTime, 0, 1);
    const de = 1 - (1 - dep) * (1 - dep);
    py -= (1 - de) * 0.22;
    rx -= (1 - de) * 0.9;

    // --- reload
    let magOffset = 0;
    let leftToMag = 0;
    if (c.reloading) {
      const p = THREE.MathUtils.clamp((simTime - c.reloadStart) / (c.reloadEnd - c.reloadStart), 0, 1);
      const dip = Math.sin(p * Math.PI);
      py -= dip * 0.05;
      rx += dip * 0.25;
      rz += dip * 0.45;
      px -= dip * 0.03;
      if (p > 0.12 && p < 0.35) magOffset = (p - 0.12) / 0.23;
      else if (p >= 0.35 && p < 0.55) magOffset = 1;
      else if (p >= 0.55 && p < 0.75) magOffset = 1 - (p - 0.55) / 0.2;
      leftToMag = p > 0.08 && p < 0.82 ? Math.min(1, Math.min((p - 0.08) / 0.1, (0.82 - p) / 0.1)) : 0;
    }
    if (this.model.mag) {
      this.model.mag.position.y = (def.slot === 'primary' ? 0.03 : 0) - magOffset * 0.35;
      if (def.id === 'm4a4') this.model.mag.position.y = 0.01 - magOffset * 0.35;
      if (def.id === 'awp') this.model.mag.position.y = 0.02 - magOffset * 0.35;
      this.model.mag.visible = magOffset < 0.95;
    }

    // --- knife swing
    if (def.slot === 'melee' && simTime < c.meleeSwingEnd) {
      const dur = c.meleeAlt ? 0.6 : 0.35;
      const k = 1 - (c.meleeSwingEnd - simTime) / dur;
      const s = Math.sin(k * Math.PI);
      if (c.meleeAlt) {
        rx -= s * 1.3;
        pz -= s * 0.12;
        py += s * 0.05;
      } else {
        ry += s * 1.4;
        rz -= s * 0.9;
        px -= s * 0.16;
        pz -= s * 0.08;
      }
    }

    // --- plant / defuse
    if (c.plantProgress >= 0) {
      py -= 0.05 + Math.sin(simTime * 22) * 0.004;
      rx += 0.2;
    }
    if (c.defuseProgress >= 0) {
      py -= 0.35;
    }

    this.gunPivot.position.set(px, py, pz);
    this.gunPivot.rotation.set(rx, ry, rz);
    this.gunPivot.updateMatrixWorld(true);

    // --- arms IK onto the weapon
    const grip = this.tmp2.set(0, -0.01, 0.02);
    this.gunPivot.localToWorld(grip);
    const gripP = { x: grip.x, y: grip.y, z: grip.z };
    let leftP: { x: number; y: number; z: number };
    if (def.slot === 'melee') leftP = { x: -0.3, y: -0.55, z: -0.1 };
    else {
      const fg = this.model.foregrip ? this.model.foregrip.clone() : new THREE.Vector3(-0.025, -0.02, 0.0);
      if (leftToMag > 0 && this.model.mag) {
        const magW = new THREE.Vector3(0, -0.05, 0);
        this.model.mag.localToWorld(magW);
        this.gunPivot.worldToLocal(magW);
        fg.lerp(magW, leftToMag);
      }
      this.gunPivot.localToWorld(fg);
      leftP = { x: fg.x, y: fg.y, z: fg.z };
    }
    const R = solveTwoBone(SHOULDER_R, gripP, ARM_U, ARM_F, POLE_R);
    const L = solveTwoBone(SHOULDER_L, leftP, ARM_U, ARM_F, POLE_L);
    this.aim(this.armUR, SHOULDER_R, R.elbow);
    this.aim(this.armFR, R.elbow, R.hand);
    this.aim(this.armUL, SHOULDER_L, L.elbow);
    this.aim(this.armFL, L.elbow, L.hand);
    this.handR.position.set(R.hand.x, R.hand.y, R.hand.z);
    this.handR.quaternion.copy(this.armFR.quaternion);
    this.handL.position.set(L.hand.x, L.hand.y, L.hand.z);
    this.handL.quaternion.copy(this.armFL.quaternion);

    this.flash.visible = now < this.flashUntil;
    if (this.flash.visible) {
      this.flash.rotation.z = Math.random() * Math.PI;
      const s = 0.8 + Math.random() * 0.6;
      this.flash.scale.set(s, s, s);
    }
  }
}

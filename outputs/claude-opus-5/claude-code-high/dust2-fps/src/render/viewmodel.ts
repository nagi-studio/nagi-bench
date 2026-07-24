import * as THREE from 'three';
import { clamp, damp } from '../core/math.ts';
import type { Team } from '../core/types.ts';
import type { Actor } from '../game/actor.ts';
import { activeDef, activeWeapon } from '../game/actor.ts';
import type { WeaponId } from '../game/weapons.ts';
import { disposeTree } from './character.ts';
import { buildWeaponModel, muzzleOf } from './weaponModel.ts';

const GLOVES: Record<Team, number> = { CT: 0x232a34, T: 0x4a3826 };
const SLEEVE: Record<Team, number> = { CT: 0x2d4c7c, T: 0x9c7742 };

/** Resting offset of each weapon in front of the camera. */
const HOLD: Partial<Record<WeaponId, [number, number, number]>> = {
  ak47: [0.17, -0.19, -0.32],
  m4a4: [0.17, -0.19, -0.3],
  awp: [0.15, -0.17, -0.26],
  deagle: [0.16, -0.18, -0.24],
  usp: [0.16, -0.18, -0.22],
  glock: [0.16, -0.18, -0.22],
  knife: [0.19, -0.2, -0.3],
  c4: [0.14, -0.24, -0.32],
};

/**
 * First-person weapon rendered in its own scene on top of the world, so the
 * gun never clips through walls. Handles idle sway, walk bob, recoil kick,
 * reload and draw animations, and hides itself while scoped.
 */
export class ViewModel {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  private root = new THREE.Group();
  private weaponGroup = new THREE.Group();
  private hands = new THREE.Group();
  private model: THREE.Group | null = null;
  private flash: THREE.Mesh;
  private flashLight: THREE.PointLight;
  private flashTimer = 0;
  private currentId: WeaponId | null = null;
  private team: Team = 'CT';

  private kick = 0;
  private kickRot = 0;
  private bobPhase = 0;
  private swayX = 0;
  private swayY = 0;
  private lastYaw = 0;
  private lastPitch = 0;
  private knifeSwing = 0;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(58, 1, 0.01, 12);
    this.scene.add(this.root);
    this.root.add(this.weaponGroup);
    this.weaponGroup.add(this.hands);

    this.scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const key = new THREE.DirectionalLight(0xfff0dd, 2.4);
    key.position.set(-0.6, 1.2, 0.8);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fc4ff, 1.0);
    rim.position.set(1, -0.4, -1);
    this.scene.add(rim);

    // Muzzle flash: a cheap additive card plus a short-lived point light.
    this.flash = new THREE.Mesh(
      new THREE.PlaneGeometry(0.26, 0.26),
      new THREE.MeshBasicMaterial({
        color: 0xffd88a,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.flash.visible = false;
    this.weaponGroup.add(this.flash);
    this.flashLight = new THREE.PointLight(0xffcf7a, 0, 3.5);
    this.weaponGroup.add(this.flashLight);
  }

  setTeam(team: Team): void {
    if (this.team === team && this.hands.children.length > 0) return;
    this.team = team;
    this.buildHands();
  }

  private buildHands(): void {
    for (const c of [...this.hands.children]) {
      this.hands.remove(c);
      disposeTree(c);
    }
    const glove = GLOVES[this.team];
    const sleeve = SLEEVE[this.team];
    const add = (sx: number, sy: number, sz: number, x: number, y: number, z: number, color: number, rx = 0, ry = 0, rz = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), new THREE.MeshLambertMaterial({ color }));
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, rz);
      this.hands.add(m);
    };
    // Right hand on the grip, left hand forward on the handguard.
    add(0.075, 0.075, 0.1, 0.005, -0.07, 0.045, glove);
    add(0.09, 0.1, 0.19, 0.02, -0.14, 0.14, sleeve, 0.32);
    add(0.075, 0.07, 0.1, -0.035, -0.05, -0.24, glove, 0.2);
    add(0.085, 0.095, 0.2, -0.09, -0.13, -0.16, sleeve, -0.15, 0.35, 0.2);
  }

  setWeapon(id: WeaponId): void {
    if (this.currentId === id) return;
    this.currentId = id;
    if (this.model) {
      this.weaponGroup.remove(this.model);
      disposeTree(this.model);
    }
    const m = buildWeaponModel(id);
    this.model = m;
    this.weaponGroup.add(m);
    const muzzle = muzzleOf(m);
    this.flash.position.copy(muzzle);
    this.flashLight.position.copy(muzzle);
    const hold = HOLD[id] ?? [0.16, -0.18, -0.28];
    this.root.position.set(hold[0], hold[1], hold[2]);
    // Hands hug the weapon body.
    this.hands.position.set(0, 0, 0);
  }

  onFire(recoil: number): void {
    this.kick = Math.min(1, this.kick + 0.55 + recoil * 6);
    this.kickRot = Math.min(1, this.kickRot + 0.5 + recoil * 5);
    this.flashTimer = 0.05;
    this.flash.rotation.z = Math.random() * Math.PI;
    const s = 0.7 + Math.random() * 0.7;
    this.flash.scale.setScalar(s);
  }

  onKnifeSwing(): void {
    this.knifeSwing = 1;
  }

  update(actor: Actor | null, dt: number, time: number): void {
    if (!actor) {
      this.root.visible = false;
      return;
    }
    const ws = activeWeapon(actor);
    const def = activeDef(actor);
    this.setTeam(actor.team);
    this.setWeapon(ws ? ws.id : 'knife');
    // Scoped rifles hide the model behind the 2D scope overlay.
    this.root.visible = !actor.scoped && actor.alive;
    if (!this.root.visible) {
      this.flash.visible = false;
      this.flashLight.intensity = 0;
      return;
    }

    // ---- recoil kick -----------------------------------------------------
    this.kick += (0 - this.kick) * damp(14, dt);
    this.kickRot += (0 - this.kickRot) * damp(11, dt);
    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      this.flash.visible = true;
      this.flashLight.intensity = 9;
    } else {
      this.flash.visible = false;
      this.flashLight.intensity = 0;
    }

    // ---- sway from mouse movement ---------------------------------------
    const dyaw = shortAngle(actor.yaw - this.lastYaw);
    const dpitch = actor.pitch - this.lastPitch;
    this.lastYaw = actor.yaw;
    this.lastPitch = actor.pitch;
    this.swayX += (clamp(dyaw * 2.2, -0.09, 0.09) - this.swayX) * damp(9, dt);
    this.swayY += (clamp(-dpitch * 2.0, -0.07, 0.07) - this.swayY) * damp(9, dt);

    // ---- walk bob --------------------------------------------------------
    const speed = clamp(actor.speed2D / 5.2, 0, 1.2);
    this.bobPhase += dt * (4 + speed * 9);
    const bobX = Math.sin(this.bobPhase) * 0.016 * speed;
    const bobY = Math.abs(Math.cos(this.bobPhase)) * 0.014 * speed;

    // ---- reload / draw ----------------------------------------------------
    let reloadRot = 0;
    let reloadDrop = 0;
    if (actor.reloadEndTime > 0 && time < actor.reloadEndTime) {
      const total = def.reloadTime || 1;
      const p = clamp(1 - (actor.reloadEndTime - time) / total, 0, 1);
      const arc = Math.sin(p * Math.PI);
      reloadRot = arc * 0.9;
      reloadDrop = arc * 0.14;
    }
    let drawDrop = 0;
    if (time < actor.deployEndTime) {
      const total = def.drawTime || 0.4;
      const p = clamp(1 - (actor.deployEndTime - time) / total, 0, 1);
      drawDrop = (1 - p) * 0.32;
    }
    if (this.knifeSwing > 0) this.knifeSwing = Math.max(0, this.knifeSwing - dt * 6);

    const hold = HOLD[(ws ? ws.id : 'knife') as WeaponId] ?? [0.16, -0.18, -0.28];
    this.weaponGroup.position.set(
      bobX + this.swayX,
      bobY + this.swayY - reloadDrop - drawDrop,
      this.kick * 0.055,
    );
    this.weaponGroup.rotation.set(
      this.kickRot * 0.14 + reloadRot * 0.55 - this.knifeSwing * 0.9,
      this.swayX * 1.4 + reloadRot * 0.2,
      -this.swayY * 0.8 + reloadRot * 0.35 + this.knifeSwing * 0.5,
    );
    this.root.position.set(hold[0], hold[1], hold[2]);
  }

  /** Aspect must follow the main camera so the model does not stretch. */
  resize(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    disposeTree(this.scene);
  }
}

function shortAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

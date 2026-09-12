/**
 * First person view model.
 *
 * Rendered in its own scene with its own camera and a cleared depth buffer, which is the
 * standard trick for stopping the weapon from poking through walls. Carries its own hands
 * plus procedural bob / sway / recoil / reload animation.
 */

import * as THREE from 'three';
import { damp } from '../core/math.ts';
import type { Actor } from '../game/actor.ts';
import type { WeaponId } from '../game/weapons.ts';
import { buildWeaponModel } from './weaponModels.ts';

interface HandRig {
  group: THREE.Group;
}

const SKIN = 0xc79a72;
const SLEEVE_CT = 0x33456b;
const SLEEVE_T = 0x8d7346;

function buildHands(team: 'CT' | 'T'): HandRig {
  const group = new THREE.Group();
  const sleeve = team === 'CT' ? SLEEVE_CT : SLEEVE_T;
  const skinMat = new THREE.MeshLambertMaterial({ color: SKIN });
  const sleeveMat = new THREE.MeshLambertMaterial({ color: sleeve });
  const gloveMat = new THREE.MeshLambertMaterial({ color: team === 'CT' ? 0x1f2733 : 0x3a2c1e });

  const hand = (x: number, y: number, z: number, rx: number, ry: number, rz: number) => {
    const h = new THREE.Group();
    h.position.set(x, y, z);
    h.rotation.set(rx, ry, rz);
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.075, 0.11), gloveMat);
    h.add(palm);
    const wrist = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.09), skinMat);
    wrist.position.z = 0.1;
    h.add(wrist);
    const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.085, 0.26), sleeveMat);
    forearm.position.z = 0.27;
    h.add(forearm);
    group.add(h);
    return h;
  };

  // Trigger hand (right) and support hand (left).
  hand(0.045, -0.055, 0.07, -0.15, 0.12, 0.06);
  hand(-0.06, -0.06, -0.24, -0.2, -0.22, -0.1);

  return { group };
}

export class ViewModel {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;

  private readonly rig = new THREE.Group();
  private readonly weaponHolder = new THREE.Group();
  private hands: HandRig | null = null;
  private weaponMesh: THREE.Group | null = null;
  private weaponId: WeaponId | null = null;
  private team: 'CT' | 'T' = 'CT';

  // Animation state.
  private bobPhase = 0;
  private swayX = 0;
  private swayY = 0;
  private kickZ = 0;
  private kickPitch = 0;
  private reloadT = 0;
  private deployT = 0;
  private hidden = false;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(62, 1, 0.01, 12);
    this.camera.position.set(0, 0, 0);

    const key = new THREE.DirectionalLight(0xfff0d8, 2.1);
    key.position.set(0.6, 1.2, 0.8);
    this.scene.add(key);
    const fill = new THREE.HemisphereLight(0xbfd6ff, 0x534838, 1.1);
    this.scene.add(fill);

    this.rig.position.set(0.16, -0.17, -0.34);
    this.rig.add(this.weaponHolder);
    this.scene.add(this.rig);
  }

  setTeam(team: 'CT' | 'T'): void {
    if (this.team === team && this.hands) return;
    this.team = team;
    if (this.hands) this.weaponHolder.remove(this.hands.group);
    this.hands = buildHands(team);
    this.weaponHolder.add(this.hands.group);
  }

  setWeapon(id: WeaponId): void {
    if (this.weaponId === id) return;
    this.weaponId = id;
    if (this.weaponMesh) {
      this.weaponHolder.remove(this.weaponMesh);
      this.weaponMesh.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
    }
    const model = buildWeaponModel(id);
    model.scale.setScalar(id === 'knife' ? 1.15 : 1.0);
    this.weaponHolder.add(model);
    this.weaponMesh = model;
    this.deployT = 1;
  }

  /** Called when the actor fires, to kick the model. */
  punch(strength: number): void {
    this.kickZ = Math.min(0.16, this.kickZ + 0.045 * strength);
    this.kickPitch = Math.min(0.42, this.kickPitch + 0.11 * strength);
  }

  startReload(duration: number): void {
    this.reloadT = duration;
  }

  update(dt: number, actor: Actor | null, mouseDx: number, mouseDy: number): void {
    if (!actor) {
      this.rig.visible = false;
      return;
    }

    this.setTeam(actor.team);
    this.setWeapon(actor.weaponId());

    // Scoped weapons hide the model entirely.
    this.hidden = actor.scopeLevel > 0 || !actor.alive;
    this.rig.visible = !this.hidden;
    if (this.hidden) return;

    // ---- bob ---------------------------------------------------------------
    const speed = Math.min(actor.speed, 7.5);
    this.bobPhase += dt * (2.0 + speed * 1.5);
    const bobAmount = (speed / 7.5) * (actor.onGround ? 1 : 0.25);
    const bobX = Math.sin(this.bobPhase) * 0.022 * bobAmount;
    const bobY = Math.abs(Math.cos(this.bobPhase)) * 0.018 * bobAmount;

    // ---- sway (weapon lags behind fast mouse movement) ----------------------
    this.swayX = damp(this.swayX, -mouseDx * 0.0016, 12, dt);
    this.swayY = damp(this.swayY, -mouseDy * 0.0014, 12, dt);
    this.swayX = Math.max(-0.09, Math.min(0.09, this.swayX));
    this.swayY = Math.max(-0.07, Math.min(0.07, this.swayY));

    // ---- recoil kick --------------------------------------------------------
    this.kickZ = damp(this.kickZ, 0, 11, dt);
    this.kickPitch = damp(this.kickPitch, 0, 10, dt);

    // ---- reload / deploy animations ----------------------------------------
    let reloadDip = 0;
    let reloadRoll = 0;
    if (this.reloadT > 0) {
      this.reloadT = Math.max(0, this.reloadT - dt);
      const def = actor.weapon();
      const total = Math.max(0.2, def.reloadTime);
      const t = 1 - this.reloadT / total;
      // Down, magazine swap wobble, then back up.
      const curve = Math.sin(Math.min(1, t) * Math.PI);
      reloadDip = curve * 0.14;
      reloadRoll = curve * 0.5 + Math.sin(t * Math.PI * 6) * 0.06 * curve;
    }

    if (this.deployT > 0) {
      this.deployT = Math.max(0, this.deployT - dt * 2.6);
    }
    const deployDip = this.deployT * 0.2;
    const deployRoll = this.deployT * 0.7;

    const crouchOffset = actor.crouching ? -0.02 : 0;

    this.rig.position.set(
      0.16 + bobX + this.swayX,
      -0.17 + bobY + this.swayY - reloadDip - deployDip + crouchOffset,
      -0.34 + this.kickZ,
    );
    this.rig.rotation.set(
      this.kickPitch + reloadRoll * 0.55 + deployRoll * 0.5,
      this.swayX * 1.6,
      -reloadRoll * 0.5 - deployRoll * 0.4 + this.swayX * 0.8,
    );
  }

  resize(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const m = o.material;
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
        else m.dispose();
      }
    });
  }
}

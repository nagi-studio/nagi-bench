/**
 * viewmodel.ts — first-person weapon models (procedural boxes) with
 * bob / sway / recoil / reload / draw / knife-swing animation.
 */

import * as THREE from 'three';
import { WEAPONS } from './weapons';
import { mat } from './humanoid';

function box(parent: THREE.Object3D, w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  parent.add(mesh);
  return mesh;
}

const DARK = 0x1f2126, METAL = 0x4c5058, WOOD = 0x7c4f28, GREEN = 0x404a3c, BLADE = 0xc3cad3, HAND = 0xc08b5e;

function buildViewWeapon(id: string): THREE.Group {
  const g = new THREE.Group();
  const dark = mat(DARK), metal = mat(METAL), wood = mat(WOOD), green = mat(GREEN), blade = mat(BLADE);
  const hand = mat(HAND), grip = mat(0x16171a);

  if (id === 'ak47') {
    box(g, 0.055, 0.085, 0.5, dark, 0, 0, -0.12);
    box(g, 0.035, 0.035, 0.42, metal, 0, 0.008, -0.5);
    box(g, 0.05, 0.06, 0.3, wood, 0, -0.005, -0.44);
    box(g, 0.05, 0.11, 0.24, wood, 0, -0.045, 0.16);
    box(g, 0.045, 0.17, 0.08, dark, 0, -0.115, -0.16, 0.32);
    box(g, 0.04, 0.13, 0.05, grip, 0, -0.1, 0.04, 0.28);
    box(g, 0.018, 0.05, 0.018, dark, 0, 0.06, -0.66);
    box(g, 0.05, 0.03, 0.1, dark, 0, 0.055, -0.05);
  } else if (id === 'm4a4') {
    box(g, 0.055, 0.085, 0.46, dark, 0, 0, -0.1);
    box(g, 0.035, 0.035, 0.4, metal, 0, 0.008, -0.48);
    box(g, 0.05, 0.055, 0.3, dark, 0, 0, -0.42);
    box(g, 0.05, 0.1, 0.2, dark, 0, -0.03, 0.18);
    box(g, 0.045, 0.16, 0.07, grip, 0, -0.11, -0.12, 0.12);
    box(g, 0.04, 0.12, 0.05, grip, 0, -0.1, 0.06, 0.25);
    box(g, 0.03, 0.04, 0.26, dark, 0, 0.065, -0.12);
    box(g, 0.02, 0.045, 0.02, dark, 0, 0.1, -0.2);
  } else if (id === 'awp') {
    box(g, 0.06, 0.1, 0.62, green, 0, 0, -0.14);
    box(g, 0.04, 0.04, 0.62, dark, 0, 0.01, -0.66);
    box(g, 0.06, 0.13, 0.26, green, 0, -0.04, 0.22);
    box(g, 0.05, 0.055, 0.34, dark, 0, 0.095, -0.2);
    box(g, 0.065, 0.065, 0.05, dark, 0, 0.095, -0.39);
    box(g, 0.045, 0.12, 0.055, grip, 0, -0.1, 0.02, 0.3);
    box(g, 0.04, 0.04, 0.2, green, 0, -0.065, -0.3);
  } else if (id === 'deagle') {
    box(g, 0.045, 0.075, 0.26, metal, 0, 0, -0.12);
    box(g, 0.04, 0.11, 0.055, grip, 0, -0.08, 0.0, 0.3);
    box(g, 0.02, 0.025, 0.04, dark, 0, 0.045, -0.24);
  } else if (id === 'glock' || id === 'usp') {
    const c = id === 'glock' ? 0x23262b : 0x2c3038;
    box(g, 0.04, 0.065, 0.24, mat(c), 0, 0, -0.1);
    box(g, 0.038, 0.1, 0.05, grip, 0, -0.07, 0.0, 0.32);
    if (id === 'usp') box(g, 0.045, 0.045, 0.12, dark, 0, 0.005, -0.26);
    box(g, 0.016, 0.02, 0.03, dark, 0, 0.04, -0.2);
  } else if (id === 'knife') {
    box(g, 0.028, 0.045, 0.26, blade, 0, 0.01, -0.2);
    box(g, 0.028, 0.05, 0.04, metal, 0, 0.012, -0.05);
    box(g, 0.032, 0.06, 0.12, grip, 0, 0, 0.03);
  }

  // hands / forearms so the model reads as "held"
  if (id !== 'knife') {
    box(g, 0.075, 0.075, 0.14, hand, 0.005, -0.075, 0.035, 0.25);          // trigger hand
    box(g, 0.07, 0.07, 0.26, mat(0x4a4438), 0.015, -0.1, 0.16, 0.5, -0.12); // right forearm
    box(g, 0.07, 0.07, 0.12, hand, -0.015, -0.055, -0.36, 0.1, 0.2);       // support hand
    box(g, 0.07, 0.07, 0.24, mat(0x4a4438), -0.06, -0.11, -0.2, 0.45, 0.4); // left forearm
  } else {
    box(g, 0.075, 0.075, 0.14, hand, 0.0, -0.03, 0.05);
    box(g, 0.07, 0.07, 0.24, mat(0x4a4438), 0.02, -0.07, 0.16, 0.5, -0.1);
  }

  // muzzle marker for flash positioning
  const muzzleLen = id === 'awp' ? -0.95 : id === 'ak47' ? -0.7 : id === 'm4a4' ? -0.68 : id === 'knife' ? -0.3 : -0.28;
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, 0.01, muzzleLen);
  g.add(muzzle);
  g.userData.muzzle = muzzle;
  return g;
}

export interface VMState {
  speed: number;         // horizontal speed m/s
  grounded: boolean;
  scoped: boolean;
  reloadProgress: number; // -1 = not reloading, else 0..1
  drawProgress: number;   // 0..1 (1 = done)
  kick: number;           // 0..1 recoil impulse (set by game, decays here)
  swing: number;          // knife swing timer (seconds since attack, -1 none)
  swayX: number; swayY: number;
  crouch: number;
}

export class ViewModel {
  root = new THREE.Group();
  model: THREE.Group | null = null;
  id = '';
  private kickAmt = 0;
  private bobT = 0;
  private swingT = -1;
  private muzzleFlash: THREE.Mesh;
  private flashLight: THREE.PointLight;

  constructor(camera: THREE.Camera) {
    this.root.position.set(0.2, -0.19, -0.34);
    this.root.rotation.set(0, 0.05, 0);
    this.root.scale.setScalar(0.82);
    camera.add(this.root);

    const flashGeo = new THREE.PlaneGeometry(0.3, 0.3);
    this.muzzleFlash = new THREE.Mesh(flashGeo, new THREE.MeshBasicMaterial({
      color: 0xffd27a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
    }));
    this.flashLight = new THREE.PointLight(0xffc06a, 0, 9, 2);
    this.root.add(this.muzzleFlash, this.flashLight);
  }

  setWeapon(id: string) {
    if (this.id === id) return;
    this.id = id;
    if (this.model) { this.root.remove(this.model); this.model = null; }
    if (!id || !WEAPONS[id]) return;
    this.model = buildViewWeapon(id);
    this.model.visible = true;
    this.root.add(this.model);
    this.kickAmt = 0.4; // draw animation
  }

  onShot() { this.kickAmt = 1; }
  onSwing() { this.swingT = 0; }

  flash() {
    if (!this.model) return;
    const m = this.model.userData.muzzle as THREE.Object3D | undefined;
    if (m) {
      this.muzzleFlash.position.copy(m.position);
      this.muzzleFlash.position.z -= 0.06;
      this.muzzleFlash.rotation.z = Math.random() * Math.PI;
      this.flashLight.position.copy(this.muzzleFlash.position);
    }
    const mat = this.muzzleFlash.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.95;
    const s = 0.7 + Math.random() * 0.5;
    this.muzzleFlash.scale.set(s, s, s);
    this.flashLight.intensity = 2.4;
  }

  update(dt: number, st: VMState) {
    this.kickAmt = Math.max(0, this.kickAmt - dt * 7);
    if (this.swingT >= 0) {
      this.swingT += dt;
      if (this.swingT > 0.35) this.swingT = -1;
    }
    const mat = this.muzzleFlash.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.max(0, mat.opacity - dt * 14);
    this.flashLight.intensity = Math.max(0, this.flashLight.intensity - dt * 40);

    this.bobT += dt * (2 + st.speed * 1.9);
    const bobA = Math.min(1, st.speed / 5.6) * (st.grounded ? 1 : 0.2);
    const bx = Math.cos(this.bobT) * 0.014 * bobA;
    const by = Math.abs(Math.sin(this.bobT)) * 0.012 * bobA;

    // sway with clamped mouse motion
    const sx = THREE.MathUtils.clamp(st.swayX, -0.06, 0.06);
    const sy = THREE.MathUtils.clamp(st.swayY, -0.05, 0.05);

    const kick = this.kickAmt * this.kickAmt;
    let px = 0.22 + bx - sx * 0.6;
    let py = -0.22 + by + sy * 0.5 - kick * 0.012;
    let pz = -0.38 + kick * 0.07;
    let rx = kick * 0.16 + sy * 0.8;
    let ry = 0.05 - sx * 0.8;
    let rz = 0;

    // draw animation (weapon comes up from below)
    if (st.drawProgress < 1) {
      const d = 1 - st.drawProgress;
      py -= d * 0.35;
      rx += d * 0.9;
      px += d * 0.1;
    }
    // reload animation
    if (st.reloadProgress >= 0) {
      const p = st.reloadProgress;
      const wave = Math.sin(Math.PI * Math.min(1, p * 1.05));
      py -= wave * 0.16;
      rx += wave * 0.75;
      rz += wave * 0.4;
      px -= wave * 0.04;
    }
    // knife swing
    if (this.swingT >= 0) {
      const p = this.swingT / 0.35;
      const arc = Math.sin(p * Math.PI);
      rx -= arc * 1.1;
      px -= arc * 0.16;
      py -= arc * 0.05;
      rz -= arc * 0.5;
    }
    // crouch raises the weapon slightly
    py += st.crouch * 0.02;

    this.root.position.set(px, py, pz);
    this.root.rotation.set(rx, ry, rz);
    if (this.model) this.model.visible = !st.scoped;
  }
}

import * as THREE from 'three';
import type { WeaponId } from '../core/types.ts';
import { clamp } from '../core/vecmath.ts';

function mesh(w: number, h: number, d: number, color: number, rough = 0.5, metal = 0.4): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }));
  return m;
}

export function buildViewmodel(id: WeaponId): THREE.Group {
  const g = new THREE.Group();
  const skin = 0xc98a5a;
  const black = 0x23262b;
  const dark = 0x33383f;
  const wood = 0x7a5230;

  const hands = (x: number, y: number, z: number) => {
    const h = mesh(0.09, 0.09, 0.14, skin, 0.7, 0.05);
    h.position.set(x, y, z);
    g.add(h);
  };

  if (id === 'knife') {
    const blade = mesh(0.02, 0.05, 0.34, 0xb8bcc2, 0.25, 0.8);
    blade.position.set(0, 0.01, -0.24);
    const edge = mesh(0.005, 0.03, 0.3, 0xe8ecf0, 0.15, 0.9);
    edge.position.set(0.012, 0.01, -0.24);
    const handle = mesh(0.035, 0.06, 0.14, black, 0.6, 0.2);
    handle.position.set(0, -0.01, 0.02);
    g.add(blade, edge, handle);
    hands(0, -0.04, 0.05);
    return g;
  }

  const isRifle = id === 'ak47' || id === 'm4a4' || id === 'awp';
  const isPistol = id === 'glock' || id === 'usp' || id === 'deagle';
  const bodyColor = id === 'ak47' ? dark : id === 'awp' ? 0x2f4034 : black;

  if (isRifle) {
    const receiver = mesh(0.07, 0.11, 0.5, bodyColor);
    receiver.position.set(0, 0, -0.1);
    const barrel = mesh(0.035, 0.035, 0.5, 0x1a1d21, 0.35, 0.7);
    barrel.position.set(0, 0.015, -0.55);
    const handguard = mesh(0.06, 0.07, 0.28, id === 'ak47' ? wood : bodyColor, 0.6, 0.2);
    handguard.position.set(0, -0.01, -0.36);
    const mag = mesh(0.05, 0.22, 0.1, id === 'ak47' ? 0x4a3a22 : dark, 0.6, 0.3);
    mag.position.set(0, -0.16, -0.05);
    mag.rotation.x = 0.25;
    const stock = mesh(0.06, 0.1, 0.26, id === 'ak47' ? wood : bodyColor, 0.6, 0.2);
    stock.position.set(0, -0.02, 0.24);
    const grip = mesh(0.045, 0.12, 0.06, black, 0.6, 0.2);
    grip.position.set(0, -0.1, 0.06);
    grip.rotation.x = 0.3;
    const sight = mesh(0.02, 0.05, 0.02, 0x111, 0.4, 0.6);
    sight.position.set(0, 0.085, -0.3);
    g.add(receiver, barrel, handguard, mag, stock, grip, sight);
    if (id === 'awp') {
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.3, 14), 0x15181c);
      scope.rotation.x = Math.PI / 2;
      scope.position.set(0, 0.1, -0.12);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.04, 14), new THREE.MeshStandardMaterial({ color: 0x2a4a6a, roughness: 0.1, metalness: 0.9 }));
      lens.position.set(0, 0.1, 0.031);
      const bipod = mesh(0.02, 0.12, 0.02, 0x111, 0.4, 0.6);
      bipod.position.set(0, -0.08, -0.5);
      g.add(scope, lens, bipod);
    }
    hands(0.0, -0.06, -0.34);
    hands(0.0, -0.08, 0.08);
  } else if (isPistol) {
    const slide = mesh(0.05, 0.07, 0.24, id === 'deagle' ? 0x4a4e54 : black, 0.4, 0.6);
    slide.position.set(0, 0.02, -0.1);
    const frame = mesh(0.045, 0.05, 0.18, dark, 0.5, 0.4);
    frame.position.set(0, -0.03, -0.06);
    const barrel = mesh(0.025, 0.025, 0.06, 0x111, 0.3, 0.8);
    barrel.position.set(0, 0.02, -0.24);
    const grip = mesh(0.05, 0.14, 0.07, id === 'deagle' ? 0x3a3e44 : black, 0.6, 0.2);
    grip.position.set(0, -0.1, 0.03);
    grip.rotation.x = 0.28;
    const mag = mesh(0.04, 0.1, 0.05, dark, 0.5, 0.4);
    mag.position.set(0, -0.13, 0.03);
    g.add(slide, frame, barrel, grip, mag);
    hands(0, -0.12, 0.05);
    hands(0, -0.1, 0.0);
  }
  return g;
}

export class Viewmodel {
  group: THREE.Group;
  private model: THREE.Group | null = null;
  private current: WeaponId | null = null;
  private recoil = 0;
  private deploy = 0;
  private slash = 0;
  swayX = 0;
  swayY = 0;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    scene.add(this.group);
  }

  setWeapon(id: WeaponId): void {
    if (this.current === id) return;
    this.current = id;
    if (this.model) {
      this.group.remove(this.model);
      this.model.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
    }
    this.model = buildViewmodel(id);
    this.group.add(this.model);
    this.deploy = 1;
  }

  kick(amount = 1): void {
    this.recoil = Math.min(1.5, this.recoil + amount);
  }
  doSlash(): void {
    this.slash = 1;
  }
  addSway(dx: number, dy: number): void {
    this.swayX = clamp(this.swayX + dx, -0.06, 0.06);
    this.swayY = clamp(this.swayY + dy, -0.06, 0.06);
  }

  update(opts: { dt: number; walkPhase: number; speed: number; reloading: boolean; reloadProgress: number; scoped: boolean; time: number }): void {
    const dt = opts.dt;
    this.recoil = Math.max(0, this.recoil - dt * 6);
    this.deploy = Math.max(0, this.deploy - dt * 3);
    this.slash = Math.max(0, this.slash - dt * 4);
    this.swayX *= Math.max(0, 1 - dt * 8);
    this.swayY *= Math.max(0, 1 - dt * 8);

    const move = clamp(opts.speed / 5, 0, 1);
    const bobX = Math.sin(opts.walkPhase) * 0.012 * move;
    const bobY = Math.abs(Math.cos(opts.walkPhase)) * 0.012 * move;
    const idle = Math.sin(opts.time * 1.5) * 0.004;

    let px = 0.24 + bobX + this.swayX;
    let py = -0.22 + bobY + idle - this.swayY;
    let pz = -0.45 + this.recoil * 0.08;
    let rx = this.recoil * 0.18;
    let ry = -this.swayX * 2;
    let rz = this.swayX * 0.5;

    // reload dip
    if (opts.reloading) {
      const dip = Math.sin(opts.reloadProgress * Math.PI);
      py -= dip * 0.22;
      rx += dip * 0.6;
      rz += dip * 0.3;
    }
    // deploy raise
    py -= this.deploy * 0.3;
    rx += this.deploy * 0.5;
    // knife slash
    if (this.slash > 0) {
      const s = Math.sin(this.slash * Math.PI);
      rx -= s * 0.9;
      pz -= s * 0.2;
      ry += s * 0.5;
    }
    if (opts.scoped) {
      this.group.visible = false;
    } else {
      this.group.visible = true;
      this.group.position.set(px, py, pz);
      this.group.rotation.set(rx, ry, rz);
    }
  }
}

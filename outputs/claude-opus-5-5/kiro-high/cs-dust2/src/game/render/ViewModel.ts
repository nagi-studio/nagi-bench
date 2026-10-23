// First-person weapon + arms, rendered in its own scene/camera on top of the world
// (separate FOV, never clips into walls). Procedural animation: draw, bob, sway,
// recoil kick, reload (mag out/in), knife slash, AWP bolt cycling.

import * as THREE from 'three';
import type { Team } from '../types';
import type { WeaponId, HoldPose } from '../weapons/WeaponDefs';
import { WEAPONS } from '../weapons/WeaponDefs';
import { buildWeaponModel } from './GunModels';
import { clamp, damp, smoothstep } from '../math';
import type { WeaponInstance } from '../entities/Soldier';

const OFFSETS: Record<HoldPose, THREE.Vector3> = {
  rifle: new THREE.Vector3(0.15, -0.16, -0.46),
  pistol: new THREE.Vector3(0.15, -0.155, -0.46),
  knife: new THREE.Vector3(0.17, -0.17, -0.38),
};

interface VmEntry {
  group: THREE.Group;
  model: THREE.Group;
  mag: THREE.Object3D | null;
  magRest: THREE.Vector3;
  bolt: THREE.Object3D | null;
  muzzle: THREE.Object3D | null;
}

export interface ViewModelState {
  weapon: WeaponInstance;
  time: number;
  speed: number;
  onGround: boolean;
  crouch: number;
  scoped: boolean;
  drawStart: number;
  drawEnd: number;
  lookDX: number;
  lookDY: number;
}

export class ViewModel {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(62, 1, 0.01, 10);
  private readonly root = new THREE.Group();
  private entries = new Map<WeaponId, VmEntry>();
  private team: Team = 'CT';
  private current: WeaponId | null = null;
  private bob = 0;
  private swayX = 0;
  private swayY = 0;
  private kick = 0;
  private slash = 0;
  private slashSide = 1;
  private landDip = 0;
  private flash: THREE.Mesh;
  private flashUntil = 0;
  private sleeveMat = new THREE.MeshStandardMaterial({ color: 0x2f5288, roughness: 0.85 });
  private gloveMat = new THREE.MeshStandardMaterial({ color: 0x1f2226, roughness: 0.7 });
  private lastShotSeen = -1;

  constructor(flashMat: THREE.Material) {
    this.scene.add(this.root);
    this.scene.add(new THREE.HemisphereLight(0xfff4e0, 0x8a7656, 2.4));
    const sun = new THREE.DirectionalLight(0xfff0d0, 3.2);
    sun.position.set(-0.5, 1, 0.6);
    const rim = new THREE.DirectionalLight(0xcfe0ff, 1.4);
    rim.position.set(1, 0.3, -0.5);
    this.scene.add(sun, rim);
    this.flash = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), flashMat);
    this.flash.visible = false;
  }

  setTeam(team: Team) {
    if (team === this.team && this.entries.size) return;
    this.team = team;
    this.sleeveMat.color.set(team === 'CT' ? 0x2f5288 : 0x8a6a3e);
    this.gloveMat.color.set(team === 'CT' ? 0x1f2226 : 0x141414);
  }

  private limb(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, t: number, mat: THREE.Material) {
    const d = new THREE.Vector3().subVectors(b, a);
    const len = d.length();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(t, len, t), mat);
    mesh.position.copy(a).addScaledVector(d, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    parent.add(mesh);
  }

  private glove(parent: THREE.Object3D, size: [number, number, number], at: THREE.Vector3) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), this.gloveMat);
    mesh.position.copy(at);
    parent.add(mesh);
  }

  private build(id: WeaponId): VmEntry {
    const def = WEAPONS[id];
    const group = new THREE.Group();
    const model = buildWeaponModel(id);
    model.traverse((o) => (o.castShadow = false));
    group.add(model);
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    // right arm: hand on grip, forearm toward lower-right off-screen
    this.limb(group, V(0.0, -0.03, 0.03), V(0.09, -0.15, 0.24), 0.065, this.sleeveMat);
    this.glove(group, [0.06, 0.07, 0.08], V(0, -0.02, 0.01));
    if (def.pose === 'rifle') {
      const hz = id === 'awp' ? -0.4 : -0.33;
      this.limb(group, V(-0.01, 0.0, hz), V(-0.15, -0.15, -0.06), 0.065, this.sleeveMat);
      this.glove(group, [0.07, 0.05, 0.09], V(-0.005, 0.0, hz));
    } else if (def.pose === 'pistol') {
      this.limb(group, V(-0.03, -0.04, 0.02), V(-0.12, -0.16, 0.2), 0.06, this.sleeveMat);
      this.glove(group, [0.06, 0.06, 0.07], V(-0.03, -0.035, 0.0));
    }
    group.visible = false;
    // long guns are scaled down a bit so the receiver/stock doesn't fill the screen
    if (def.pose === 'rifle') group.scale.setScalar(0.72);
    this.root.add(group);
    const mag = (model.userData.mag as THREE.Object3D | undefined) ?? null;
    return {
      group,
      model,
      mag,
      magRest: mag ? mag.position.clone() : new THREE.Vector3(),
      bolt: (model.userData.bolt as THREE.Object3D | undefined) ?? null,
      muzzle: (model.userData.muzzle as THREE.Object3D | undefined) ?? null,
    };
  }

  /** Drop all built entries (team change -> new sleeve colors handled by shared materials). */
  reset() {
    this.current = null;
  }

  onLand(strength: number) {
    this.landDip = Math.min(1, this.landDip + strength);
  }

  onFire(w: WeaponInstance, time: number) {
    if (w.def.slot === 'melee') {
      this.slash = 1;
      this.slashSide = -this.slashSide;
      return;
    }
    this.kick = Math.min(1.4, this.kick + w.def.kick);
    if (w.def.id !== 'usp') this.flashUntil = time + 0.045;
  }

  /** World-relative muzzle (camera space) for tracer origins. */
  muzzleCameraSpace(out: THREE.Vector3): THREE.Vector3 {
    const e = this.current ? this.entries.get(this.current) : null;
    if (!e?.muzzle) return out.set(0.12, -0.1, -0.6);
    this.root.updateMatrixWorld(true);
    return e.muzzle.getWorldPosition(out);
  }

  update(st: ViewModelState, dt: number) {
    const w = st.weapon;
    const id = w.def.id;
    if (this.current !== id) {
      if (this.current) this.entries.get(this.current)!.group.visible = false;
      let e = this.entries.get(id);
      if (!e) {
        e = this.build(id);
        this.entries.set(id, e);
      }
      this.current = id;
      if (e.muzzle) e.muzzle.add(this.flash);
    }
    const e = this.entries.get(id)!;
    e.group.visible = !st.scoped;
    this.root.visible = !st.scoped;
    if (st.scoped) return;

    if (w.lastShot !== this.lastShotSeen) {
      if (st.time - w.lastShot < 0.1) this.onFire(w, st.time);
      this.lastShotSeen = w.lastShot;
    }

    const off = OFFSETS[w.def.pose];
    const moveAmt = clamp(st.speed / 5.5, 0, 1) * (st.onGround ? 1 : 0.2);
    this.bob += dt * (6 + st.speed * 1.4) * (moveAmt > 0.05 ? 1 : 0.3);
    const bx = Math.sin(this.bob) * 0.012 * moveAmt;
    const by = -Math.abs(Math.cos(this.bob)) * 0.012 * moveAmt + Math.sin(st.time * 1.6) * 0.002;

    this.swayX = damp(this.swayX, clamp(-st.lookDX * 0.0009, -0.05, 0.05), 8, dt);
    this.swayY = damp(this.swayY, clamp(st.lookDY * 0.0009, -0.05, 0.05), 8, dt);
    this.kick = damp(this.kick, 0, 14, dt);
    this.landDip = damp(this.landDip, 0, 7, dt);
    this.slash = Math.max(0, this.slash - dt * 3.2);

    let px = off.x + bx + this.swayX * 0.5;
    let py = off.y + by - this.landDip * 0.04 - (st.onGround ? 0 : 0.015) - st.crouch * 0.01;
    let pz = off.z + this.kick * 0.045;
    let rx = this.kick * 0.09 * (w.def.pose === 'pistol' ? 1.6 : 1) + this.swayY;
    let ry = 0.03 + this.swayX;
    let rz = bx * 1.5;

    // draw animation
    if (st.time < st.drawEnd) {
      const p = smoothstep((st.time - st.drawStart) / Math.max(0.05, st.drawEnd - st.drawStart));
      py -= (1 - p) * 0.22;
      rx -= (1 - p) * 0.9;
    }

    // reload animation
    if (w.reloading && e.mag) {
      const p = clamp((st.time - w.reloadStart) / Math.max(0.01, w.reloadEnd - w.reloadStart), 0, 1);
      const tilt = Math.sin(p * Math.PI);
      rz += tilt * 0.45;
      rx += tilt * 0.18;
      py -= tilt * 0.035;
      // mag out (0.15-0.4), away (0.4-0.6), mag in (0.6-0.8)
      let drop = 0;
      if (p > 0.15 && p < 0.8) {
        if (p < 0.4) drop = (p - 0.15) / 0.25;
        else if (p < 0.6) drop = 1;
        else drop = 1 - (p - 0.6) / 0.2;
      }
      e.mag.position.set(e.magRest.x, e.magRest.y - drop * 0.25, e.magRest.z + drop * 0.05);
    } else if (e.mag) {
      e.mag.position.copy(e.magRest);
    }

    // AWP bolt cycle
    if (e.bolt) {
      const since = st.time - w.lastShot;
      const b = since > 0.25 && since < 1.1 ? Math.sin(((since - 0.25) / 0.85) * Math.PI) : 0;
      e.bolt.rotation.z = b * 1.2;
      e.bolt.position.z = 0.02 + b * 0.06;
      if (b > 0) {
        rz += b * 0.15;
        py -= b * 0.015;
      }
    }

    // knife slash
    if (w.def.slot === 'melee' && this.slash > 0) {
      const s = Math.sin((1 - this.slash) * Math.PI);
      ry += s * 0.9 * this.slashSide;
      rx -= s * 0.5;
      px -= s * 0.08 * this.slashSide;
      pz -= s * 0.1;
    }

    e.group.position.set(px, py, pz);
    e.group.rotation.set(rx, ry, rz);

    this.flash.visible = st.time < this.flashUntil;
    if (this.flash.visible) {
      this.flash.rotation.set(0, 0, Math.random() * Math.PI);
      this.flash.lookAt(this.camera.position);
    }
  }

  setAspect(a: number) {
    this.camera.aspect = a;
    this.camera.updateProjectionMatrix();
  }
}

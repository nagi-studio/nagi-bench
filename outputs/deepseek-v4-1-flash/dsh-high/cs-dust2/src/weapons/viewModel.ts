import * as THREE from 'three';
import type { WeaponDef, ViewModelSpec } from './weapons';
import { clamp, damp } from '../core/math';

function buildFromSpec(spec: ViewModelSpec): THREE.Group {
  const g = new THREE.Group();
  for (const p of spec.parts) {
    const geo = new THREE.BoxGeometry(p.size[0], p.size[1], p.size[2]);
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.55, metalness: 0.25 });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(p.pos[0], p.pos[1], p.pos[2]);
    if (p.rot) m.rotation.set(p.rot[0], p.rot[1], p.rot[2]);
    g.add(m);
  }
  return g;
}

/**
 * First-person weapon model attached to the camera. Handles recoil kick,
 * reload dip, draw animation and idle sway entirely procedurally.
 */
export class ViewModel {
  readonly group: THREE.Group;
  readonly muzzle: THREE.Object3D;
  private model: THREE.Group | null = null;
  private basePos = new THREE.Vector3();
  private recoil = 0;
  private recoilVel = 0;
  private reloadT = -1;
  private reloadDur = 0;
  private drawT = -1;
  private drawDur = 0;
  private bobT = 0;
  private swayX = 0;
  private swayY = 0;
  private targetSwayX = 0;
  private targetSwayY = 0;
  private scoped = false;
  private kickPitch = 0;

  constructor() {
    this.group = new THREE.Group();
    this.muzzle = new THREE.Object3D();
    this.group.add(this.muzzle);
  }

  setWeapon(def: WeaponDef | null) {
    if (this.model) {
      this.group.remove(this.model);
      this.model.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          (m.material as THREE.Material).dispose();
        }
      });
      this.model = null;
    }
    if (!def) return;
    this.model = buildFromSpec(def.view);
    this.group.add(this.model);
    this.basePos.set(def.view.offset[0], def.view.offset[1], def.view.offset[2]);
    this.muzzle.position.set(def.view.muzzle[0], def.view.muzzle[1], def.view.muzzle[2]);
    this.group.position.copy(this.basePos);
    this.drawT = 0;
    this.drawDur = def.drawTime;
    this.reloadT = -1;
  }

  onFire(strength: number) {
    this.recoilVel -= strength * 7.5;
    this.kickPitch += strength * 0.5;
  }

  onReload(duration: number) {
    this.reloadT = 0;
    this.reloadDur = Math.max(0.2, duration);
  }

  setScoped(v: boolean) {
    this.scoped = v;
  }

  addLookDelta(dx: number, dy: number) {
    this.targetSwayX = clamp(this.targetSwayX + dx * 0.0006, -0.035, 0.035);
    this.targetSwayY = clamp(this.targetSwayY + dy * 0.0006, -0.035, 0.035);
  }

  update(dt: number, moving: boolean, speed01: number) {
    // Recoil spring.
    const k = 90;
    const c = 13;
    this.recoilVel += (-k * this.recoil - c * this.recoilVel) * dt;
    this.recoil += this.recoilVel * dt;
    this.kickPitch = damp(this.kickPitch, 0, 11, dt);

    // Idle / walk bob.
    this.bobT += dt * (moving ? 8 + speed01 * 4 : 2.0);
    const bobAmp = this.scoped ? 0.006 : 0.014 * (0.3 + speed01);
    const bobX = Math.sin(this.bobT) * bobAmp;
    const bobY = Math.abs(Math.cos(this.bobT)) * bobAmp * 0.8;

    // Sway eases back to centre.
    this.targetSwayX = damp(this.targetSwayX, 0, 7, dt);
    this.targetSwayY = damp(this.targetSwayY, 0, 7, dt);
    this.swayX = damp(this.swayX, this.targetSwayX, 12, dt);
    this.swayY = damp(this.swayY, this.targetSwayY, 12, dt);

    let reloadDip = 0;
    let reloadRot = 0;
    if (this.reloadT >= 0) {
      this.reloadT += dt;
      const t = clamp(this.reloadT / this.reloadDur, 0, 1);
      const e = Math.sin(t * Math.PI);
      reloadDip = -e * 0.22;
      reloadRot = e * 1.1;
      if (t >= 1) this.reloadT = -1;
    }

    let drawDip = 0;
    if (this.drawT >= 0) {
      this.drawT += dt;
      const t = clamp(this.drawT / this.drawDur, 0, 1);
      drawDip = -(1 - t) * 0.5;
      if (t >= 1) this.drawT = -1;
    }

    const scopeX = this.scoped ? 0 : 1;
    const px = this.basePos.x * scopeX + bobX + this.swayX;
    const py = this.basePos.y + bobY + this.swayY + reloadDip + drawDip;
    const pz = this.basePos.z + this.recoil * 0.9;

    this.group.position.set(px, py, pz);
    this.group.rotation.set(this.recoil * 0.6 + this.kickPitch + reloadRot, this.swayX * 1.4, this.swayY * 1.4);
  }

  setVisible(v: boolean) {
    this.group.visible = v;
  }

  dispose() {
    this.model?.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      }
    });
    this.model = null;
  }
}

// First-person weapon rig. Rendered in its own scene/camera on top of the world so the gun never
// clips into walls and keeps a constant field of view while the world camera zooms.

import * as THREE from 'three';
import type { Actor, Team } from '../sim/actor';
import { clamp, lerp, smooth } from '../sim/math';
import { WeaponId, WEAPONS } from '../sim/weapons';
import { TextureSet } from './textures';
import { WeaponModel, buildWeaponModel } from './weaponModels';

interface Entry {
  model: WeaponModel;
  holder: THREE.Group;
  base: THREE.Vector3;
  baseRot: THREE.Euler;
  armR: THREE.Group;
  armL: THREE.Group | null;
  magHome: THREE.Vector3 | null;
  slideHome: THREE.Vector3 | null;
}

const SLEEVE: Record<Team, number> = { atk: 0xb4522a, def: 0x2c4a72 };
const GLOVE: Record<Team, number> = { atk: 0x2a2420, def: 0x15171a };

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const UP = new THREE.Vector3(0, 1, 0);
const _v = new THREE.Vector3();

export class ViewModel {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(54, 1, 0.01, 10);
  private rig = new THREE.Group();
  private entries = new Map<string, Entry>();
  private current: Entry | null = null;
  private currentKey = '';
  private flash: THREE.Mesh;
  private flashMat: THREE.MeshBasicMaterial;
  private flashTime = 0;
  private kickZ = 0;
  private kickRot = 0;
  private swayX = 0;
  private swayY = 0;
  private bobT = 0;
  private landDip = 0;
  private lastYaw = 0;
  private lastPitch = 0;
  private mats: THREE.Material[] = [];

  constructor(tex: TextureSet) {
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const key = new THREE.DirectionalLight(0xfff2dc, 2.6);
    key.position.set(-0.6, 1.2, 0.8);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fc4ff, 0.8);
    rim.position.set(1, 0.2, -0.5);
    this.scene.add(rim);
    this.scene.add(this.camera);
    this.camera.add(this.rig);
    this.flashMat = new THREE.MeshBasicMaterial({
      map: tex.muzzleFlash,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    this.flash = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.flashMat);
    this.flash.visible = false;
    this.flash.renderOrder = 10;
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  private makeArm(team: Team, from: THREE.Vector3, to: THREE.Vector3): THREE.Group {
    const g = new THREE.Group();
    const sleeveMat = new THREE.MeshStandardMaterial({ color: SLEEVE[team], roughness: 0.85 });
    const gloveMat = new THREE.MeshStandardMaterial({ color: GLOVE[team], roughness: 0.7 });
    this.mats.push(sleeveMat, gloveMat);
    const dir = _v.copy(to).sub(from);
    const len = dir.length();
    dir.normalize();
    const sleeve = new THREE.Mesh(unitBox, sleeveMat);
    sleeve.scale.set(0.085, len * 0.82, 0.085);
    sleeve.position.copy(from).addScaledVector(dir, len * 0.41);
    sleeve.quaternion.setFromUnitVectors(UP, dir);
    const hand = new THREE.Mesh(unitBox, gloveMat);
    hand.scale.set(0.075, len * 0.2, 0.09);
    hand.position.copy(from).addScaledVector(dir, len * 0.9);
    hand.quaternion.copy(sleeve.quaternion);
    g.add(sleeve, hand);
    return g;
  }

  private build(id: WeaponId, team: Team): Entry {
    const def = WEAPONS[id];
    const model = buildWeaponModel(id);
    model.group.traverse((o) => {
      o.castShadow = false;
      o.frustumCulled = false;
    });
    const holder = new THREE.Group();
    holder.add(model.group);
    let base: THREE.Vector3;
    let baseRot: THREE.Euler;
    let armL: THREE.Group | null = null;
    let armR: THREE.Group;
    if (def.kind === 'rifle' || def.kind === 'sniper') {
      base = new THREE.Vector3(0.155, -0.165, def.kind === 'sniper' ? -0.36 : -0.4);
      baseRot = new THREE.Euler(0.015, 0.045, 0);
      armR = this.makeArm(team, new THREE.Vector3(0.16, -0.26, 0.42), model.gripR.clone().add(new THREE.Vector3(0.0, -0.01, 0.02)));
      armL = this.makeArm(team, new THREE.Vector3(-0.3, -0.24, 0.2), model.gripL.clone().add(new THREE.Vector3(-0.012, -0.03, 0)));
    } else if (def.kind === 'pistol') {
      base = new THREE.Vector3(0.115, -0.125, -0.4);
      baseRot = new THREE.Euler(0.02, 0.05, 0);
      armR = this.makeArm(team, new THREE.Vector3(0.14, -0.2, 0.5), model.gripR.clone().add(new THREE.Vector3(0, -0.01, 0.02)));
      armL = this.makeArm(team, new THREE.Vector3(-0.32, -0.22, 0.4), model.gripL.clone().add(new THREE.Vector3(-0.01, 0, 0.02)));
    } else {
      base = new THREE.Vector3(0.17, -0.15, -0.36);
      baseRot = new THREE.Euler(0.35, 0.5, -0.25);
      armR = this.makeArm(team, new THREE.Vector3(0.12, -0.2, 0.5), model.gripR.clone().add(new THREE.Vector3(0, -0.01, 0.04)));
    }
    holder.add(armR);
    if (armL) holder.add(armL);
    holder.traverse((o) => {
      o.frustumCulled = false;
    });
    holder.visible = false;
    this.rig.add(holder);
    return {
      model,
      holder,
      base,
      baseRot,
      armR,
      armL,
      magHome: model.mag ? model.mag.position.clone() : null,
      slideHome: model.slide ? model.slide.position.clone() : null,
    };
  }

  private select(id: WeaponId, team: Team): Entry {
    const key = `${id}:${team}`;
    if (key === this.currentKey && this.current) return this.current;
    let e = this.entries.get(key);
    if (!e) {
      e = this.build(id, team);
      this.entries.set(key, e);
    }
    if (this.current) {
      this.current.holder.visible = false;
      this.current.model.group.remove(this.flash);
    }
    e.model.group.add(this.flash);
    this.flash.position.copy(e.model.muzzle);
    this.flash.position.z -= 0.06;
    this.current = e;
    this.currentKey = key;
    return e;
  }

  /** Called when the viewed actor fires. */
  onShot(id: WeaponId): void {
    const def = WEAPONS[id];
    this.kickZ += 0.028 * def.viewKick + 0.012;
    this.kickRot += 0.05 * def.viewKick + 0.012;
    this.flashTime = 0.05;
    const s = def.kind === 'pistol' ? 0.16 : def.kind === 'sniper' ? 0.34 : 0.24;
    this.flash.scale.set(s * (0.8 + Math.random() * 0.5), s * (0.8 + Math.random() * 0.5), 1);
    this.flash.rotation.z = Math.random() * Math.PI * 2;
  }

  onLand(speed: number): void {
    this.landDip = Math.min(0.06, speed * 0.005);
  }

  update(a: Actor | null, visible: boolean, yaw: number, pitch: number, dt: number, now: number): void {
    if (!a || !a.alive || !visible) {
      if (this.current) this.current.holder.visible = false;
      this.flash.visible = false;
      return;
    }
    const def = a.def;
    const e = this.select(def.id, a.team);
    const scoped = !!def.zoom && a.zoom > 0;
    e.holder.visible = !scoped;

    // --- procedural motion
    this.kickZ *= Math.exp(-dt * 13);
    this.kickRot *= Math.exp(-dt * 11);
    this.landDip *= Math.exp(-dt * 9);
    let dyaw = yaw - this.lastYaw;
    if (dyaw > Math.PI) dyaw -= Math.PI * 2;
    if (dyaw < -Math.PI) dyaw += Math.PI * 2;
    const dpitch = pitch - this.lastPitch;
    this.lastYaw = yaw;
    this.lastPitch = pitch;
    const k = 1 - Math.exp(-dt * 10);
    this.swayX = lerp(this.swayX, clamp(dyaw * 1.6, -0.05, 0.05), k);
    this.swayY = lerp(this.swayY, clamp(dpitch * 1.6, -0.05, 0.05), k);
    const moving = a.onGround ? clamp(a.speed / 5, 0, 1) : 0;
    this.bobT += dt * (5 + a.speed * 1.5) * (moving > 0.05 ? 1 : 0);
    const bobX = Math.sin(this.bobT) * 0.008 * moving;
    const bobY = -Math.abs(Math.cos(this.bobT)) * 0.007 * moving + Math.sin(now * 1.6) * 0.0015;

    let px = e.base.x + bobX + this.swayX * 0.5;
    let py = e.base.y + bobY - this.swayY * 0.4 - this.landDip - a.crouch * 0.012;
    let pz = e.base.z + this.kickZ;
    let rx = e.baseRot.x + this.kickRot - this.swayY * 0.6;
    let ry = e.baseRot.y + this.swayX * 0.9;
    let rz = e.baseRot.z + this.swayX * 0.8;

    // --- draw: the weapon swings up from below
    const sim = now;
    if (sim < a.drawEnd) {
      const t = clamp((sim - a.drawStart) / Math.max(0.05, a.drawEnd - a.drawStart), 0, 1);
      const d = 1 - smooth(t);
      py -= d * 0.24;
      rx -= d * 0.7;
      rz += d * 0.25;
    }

    // --- reload: tilt the weapon, drop the magazine, bring a new one up
    if (e.model.mag && e.magHome) e.model.mag.position.copy(e.magHome);
    if (a.reloadEnd > 0) {
      const t = clamp((sim - a.reloadStart) / Math.max(0.1, a.reloadEnd - a.reloadStart), 0, 1);
      const inOut = smooth(clamp(t / 0.18, 0, 1)) * (1 - smooth(clamp((t - 0.82) / 0.18, 0, 1)));
      py -= inOut * 0.075;
      rx += inOut * 0.22;
      rz += inOut * 0.45;
      ry += inOut * 0.18;
      if (e.model.mag && e.magHome) {
        // magazine out between 20% and 45%, back in between 50% and 75%
        const out = smooth(clamp((t - 0.2) / 0.2, 0, 1)) * (1 - smooth(clamp((t - 0.5) / 0.22, 0, 1)));
        e.model.mag.position.y = e.magHome.y - out * 0.22;
        e.model.mag.position.z = e.magHome.z - out * 0.03;
      } else {
        // pistols: a quick dip below the screen for the magazine swap
        py -= inOut * 0.08;
      }
    }

    // --- slide / bolt
    if (e.model.slide && e.slideHome) {
      const since = sim - a.lastShotTime;
      const s = e.model.slide;
      s.position.copy(e.slideHome);
      s.rotation.z = 0;
      if (def.kind === 'pistol') {
        if (since < 0.09) s.position.z = e.slideHome.z + Math.sin((since / 0.09) * Math.PI) * 0.03;
      } else if (def.kind === 'sniper' && since < 1.0 && since > 0.15) {
        // bolt up, back, forward, down
        const t = (since - 0.15) / 0.85;
        const lift = smooth(clamp(t / 0.2, 0, 1)) * (1 - smooth(clamp((t - 0.8) / 0.2, 0, 1)));
        const pull = smooth(clamp((t - 0.2) / 0.25, 0, 1)) * (1 - smooth(clamp((t - 0.55) / 0.25, 0, 1)));
        s.rotation.z = lift * 1.0;
        s.position.z = e.slideHome.z + pull * 0.07;
        rz += lift * 0.12;
        py -= lift * 0.012;
      }
    }

    // --- knife swings
    if (def.kind === 'melee') {
      const since = sim - a.lastAttackTime;
      const dur = a.lastAttackHeavy ? 0.45 : 0.28;
      if (since >= 0 && since < dur) {
        const t = since / dur;
        const arc = Math.sin(t * Math.PI);
        if (a.lastAttackHeavy) {
          pz -= arc * 0.22;
          rx -= arc * 0.5;
          py += arc * 0.03;
        } else {
          px -= arc * 0.2;
          ry += arc * 1.1;
          rz += arc * 0.6;
          pz -= arc * 0.08;
        }
      }
    }

    e.holder.position.set(px, py, pz);
    e.holder.rotation.set(rx, ry, rz);

    // --- muzzle flash
    this.flashTime -= dt;
    this.flash.visible = this.flashTime > 0 && !scoped && def.kind !== 'melee';
  }

  dispose(): void {
    for (const m of this.mats) m.dispose();
    this.flashMat.dispose();
    this.flash.geometry.dispose();
  }
}

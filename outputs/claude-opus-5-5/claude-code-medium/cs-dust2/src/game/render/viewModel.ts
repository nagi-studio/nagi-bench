// First-person weapon + arms, rendered in a separate scene/camera so the
// weapon never clips into walls and its FOV is independent of scope zoom.
import * as THREE from 'three';
import type { Team } from '../core/entity.ts';
import { WEAPONS } from '../core/weapons.ts';
import type { WeaponId } from '../core/weapons.ts';
import { buildGun } from './gunModels.ts';
import { muzzleFlashTexture } from './textures.ts';

const SLEEVE: Record<Team, number> = { CT: 0x2f5592, T: 0x9c4a2a };
const GLOVE: Record<Team, number> = { CT: 0x1d1d1d, T: 0x2a2620 };

export interface ViewModelState {
  weapon: WeaponId;
  team: Team;
  speed: number;
  onGround: boolean;
  reloadFrac: number | null; // 0..1 while reloading
  drawFrac: number; // 0..1 (1 = fully drawn)
  hidden: boolean;
  planting: boolean;
}

export class ViewModel {
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  private root = new THREE.Group(); // camera-space anchor
  private sway = new THREE.Group();
  private holder = new THREE.Group();
  private gun: THREE.Group | null = null;
  private gunId: WeaponId | null = null;
  private team: Team | null = null;
  private armR: THREE.Group = new THREE.Group();
  private armL: THREE.Group = new THREE.Group();
  private flash: THREE.Mesh;
  private flashT = 0;
  private kick = 0;
  private swing = 0;
  private swingStab = false;
  private bob = 0;
  private lookX = 0;
  private lookY = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(62, aspect, 0.01, 10);
    this.scene.add(new THREE.HemisphereLight(0xfff4e0, 0x6b5a45, 1.6));
    const d = new THREE.DirectionalLight(0xfff1d6, 1.6);
    d.position.set(-1, 2, 1);
    this.scene.add(d);
    this.scene.add(this.root);
    this.root.add(this.sway);
    this.sway.add(this.holder);
    this.flash = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.22),
      new THREE.MeshBasicMaterial({
        map: muzzleFlashTexture(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.flash.visible = false;
    this.scene.add(this.flash);
  }

  private buildArms(team: Team, slot: string) {
    this.holder.remove(this.armR);
    this.holder.remove(this.armL);
    const sleeve = new THREE.MeshLambertMaterial({ color: SLEEVE[team] });
    const glove = new THREE.MeshLambertMaterial({ color: GLOVE[team] });
    const mk = (mat: THREE.Material, w: number, h: number, d: number) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    this.armR = new THREE.Group();
    this.armL = new THREE.Group();
    // right hand on the grip, forearm running back toward the bottom-right
    const handR = mk(glove, 0.05, 0.07, 0.07);
    handR.position.set(0.0, -0.035, 0.01);
    const foreR = mk(sleeve, 0.075, 0.075, 0.34);
    foreR.position.set(0.035, -0.07, 0.2);
    foreR.rotation.set(0.25, -0.15, 0);
    this.armR.add(handR, foreR);
    // left hand under the handguard (or wrapped around the pistol grip)
    const handL = mk(glove, 0.055, 0.06, 0.08);
    const foreL = mk(sleeve, 0.075, 0.075, 0.36);
    if (slot === 'primary') {
      handL.position.set(0, -0.015, -0.3);
      foreL.position.set(-0.1, -0.08, -0.14);
      foreL.rotation.set(0.3, 0.75, 0);
    } else if (slot === 'secondary') {
      handL.position.set(-0.03, -0.04, 0.0);
      foreL.position.set(-0.12, -0.08, 0.17);
      foreL.rotation.set(0.25, 0.5, 0);
    } else {
      handL.visible = false;
      foreL.visible = false;
    }
    this.armL.add(handL, foreL);
    this.holder.add(this.armR, this.armL);
  }

  private setWeapon(id: WeaponId, team: Team) {
    if (id === this.gunId && team === this.team) return;
    if (this.gun) this.holder.remove(this.gun);
    this.gun = buildGun(id);
    this.gun.traverse((o) => (o.castShadow = false));
    this.holder.add(this.gun);
    this.gunId = id;
    this.team = team;
    const slot = WEAPONS[id].slot;
    this.buildArms(team, slot);
    if (slot === 'primary') this.sway.position.set(0.17, -0.17, -0.36);
    else if (slot === 'secondary') this.sway.position.set(0.13, -0.15, -0.36);
    else this.sway.position.set(0.18, -0.2, -0.3);
    if (id === 'awp') this.sway.position.set(0.16, -0.17, -0.32);
  }

  onShot() {
    this.kick = 1;
    this.flashT = 0.045;
  }
  onKnife(stab: boolean) {
    this.swing = 1;
    this.swingStab = stab;
  }
  /** Mouse delta for weapon sway. */
  addLook(dx: number, dy: number) {
    this.lookX = THREE.MathUtils.clamp(this.lookX + dx * 0.0004, -0.05, 0.05);
    this.lookY = THREE.MathUtils.clamp(this.lookY + dy * 0.0004, -0.05, 0.05);
  }

  update(dt: number, s: ViewModelState) {
    this.setWeapon(s.weapon, s.team);
    this.root.visible = !s.hidden;
    if (s.hidden) {
      this.flash.visible = false;
      return;
    }
    const def = WEAPONS[s.weapon];
    // bob
    const moving = s.onGround && s.speed > 0.5;
    if (moving) this.bob += dt * s.speed * 1.9;
    const bobAmt = moving ? Math.min(1, s.speed / 5) : 0;
    const bx = Math.sin(this.bob) * 0.012 * bobAmt;
    const by = -Math.abs(Math.cos(this.bob)) * 0.01 * bobAmt;
    this.lookX *= Math.exp(-dt * 8);
    this.lookY *= Math.exp(-dt * 8);

    this.kick = Math.max(0, this.kick - dt * (def.slot === 'primary' ? 9 : 7));
    const kickZ = this.kick * (def.id === 'awp' ? 0.09 : def.slot === 'secondary' ? 0.05 : 0.035);
    const kickRot = this.kick * (def.id === 'deagle' || def.id === 'awp' ? 0.35 : 0.12);

    // reload: dip and tilt
    let reloadRot = 0;
    let reloadY = 0;
    if (s.reloadFrac !== null) {
      const t = s.reloadFrac;
      const env = Math.sin(Math.min(1, t) * Math.PI);
      reloadRot = env * 0.5;
      reloadY = -env * 0.08;
    }
    // draw: raise from below
    const draw = 1 - s.drawFrac;
    const drawY = -draw * 0.25;
    const drawRot = -draw * 0.6;

    // knife swing
    this.swing = Math.max(0, this.swing - dt * (this.swingStab ? 2.5 : 4));
    const sw = Math.sin(this.swing * Math.PI);

    const plantY = s.planting ? -0.15 : 0;

    this.holder.position.set(bx - this.lookX - sw * 0.12, by + this.lookY + reloadY + drawY + plantY, kickZ - sw * (this.swingStab ? 0.15 : 0.05));
    this.holder.rotation.set(kickRot + drawRot - reloadRot * 0.3, this.swingStab ? 0 : sw * 0.9, reloadRot + (this.swingStab ? 0 : -sw * 0.6));

    // muzzle flash
    if (this.flashT > 0 && def.slot !== 'melee' && this.gun) {
      this.flashT -= dt;
      const m = this.gun.getObjectByName('muzzle');
      if (m) {
        this.root.updateMatrixWorld(true);
        m.getWorldPosition(this.flash.position);
        this.flash.rotation.z = Math.random() * Math.PI;
        const sc = def.id === 'usp' ? 0.4 : def.id === 'awp' ? 1.6 : def.slot === 'secondary' ? 0.8 : 1.1;
        this.flash.scale.setScalar(sc);
        this.flash.visible = true;
      }
    } else this.flash.visible = false;
  }

  /** Approximate muzzle position in world space for tracers (given the main camera). */
  muzzleWorld(mainCamera: THREE.Camera, out: THREE.Vector3): THREE.Vector3 {
    const id = this.gunId ? WEAPONS[this.gunId] : null;
    const off = id && id.slot === 'secondary' ? new THREE.Vector3(0.12, -0.1, -0.6) : new THREE.Vector3(0.16, -0.12, -0.9);
    return out.copy(off).applyMatrix4(mainCamera.matrixWorld);
  }

  setAspect(a: number) {
    this.camera.aspect = a;
    this.camera.updateProjectionMatrix();
  }
}

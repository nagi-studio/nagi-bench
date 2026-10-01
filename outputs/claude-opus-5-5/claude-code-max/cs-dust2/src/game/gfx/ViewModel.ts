import * as THREE from 'three';
import { clamp, damp, lerp, smoothstep } from '../core/math';
import type { Team } from '../core/types';
import { WEAPONS, type WeaponId } from '../weapons/WeaponDefs';
import { GeoBuilder } from './GeoBuilder';
import { muzzleFlashTexture } from './Textures';
import { createWeaponModel, type WeaponModel } from './WeaponModels';

export interface ViewModelState {
  weapon: WeaponId | null;
  team: Team;
  time: number;
  drawStart: number;
  drawEnd: number;
  reloading: boolean;
  reloadStart: number;
  reloadEnd: number;
  kick: number;
  scoped: boolean;
  busy: boolean;
  speed: number;
  maxSpeed: number;
  onGround: boolean;
  /** View angle change since last frame (radians) for weapon sway. */
  dYaw: number;
  dPitch: number;
}

interface Placement {
  pos: THREE.Vector3;
  rot: THREE.Euler;
}

const PLACEMENT: Record<string, Placement> = {
  rifle: { pos: new THREE.Vector3(0.185, -0.2, -0.5), rot: new THREE.Euler(0.0, 0.075, 0) },
  sniper: { pos: new THREE.Vector3(0.2, -0.235, -0.56), rot: new THREE.Euler(0.0, 0.07, 0) },
  pistol: { pos: new THREE.Vector3(0.165, -0.165, -0.5), rot: new THREE.Euler(0.02, 0.12, 0) },
  knife: { pos: new THREE.Vector3(0.2, -0.19, -0.42), rot: new THREE.Euler(0.35, 0.3, -0.4) },
  c4: { pos: new THREE.Vector3(0.0, -0.25, -0.48), rot: new THREE.Euler(0.6, 0, 0) },
};

const SLEEVE: Record<Team, number> = { CT: 0x2d4166, T: 0x93703f };
const GLOVE: Record<Team, number> = { CT: 0x1b1b1d, T: 0x2b2520 };
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();

/**
 * First-person weapon rendered in its own scene/camera pass (never clips into walls).
 * Procedural animations: draw, recoil kick, reload (mag out/in with support hand), knife swings,
 * bomb planting, movement bob, mouse sway; hidden while scoped.
 */
export class ViewModel {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  private readonly sway = new THREE.Group();
  private readonly holder = new THREE.Group();
  private readonly models = new Map<WeaponId, WeaponModel>();
  private current: WeaponModel | null = null;
  private currentId: WeaponId | null = null;
  private readonly armR: THREE.Mesh;
  private readonly armL: THREE.Mesh;
  private readonly handR: THREE.Mesh;
  private readonly handL: THREE.Mesh;
  private team: Team = 'CT';
  private readonly flash: THREE.Sprite;
  private flashLife = 0;
  readonly sun: THREE.DirectionalLight;
  readonly hemi: THREE.HemisphereLight;
  private swayX = 0;
  private swayY = 0;
  private bobPhase = 0;
  private bobAmt = 0;
  private knifeT = 10;
  private knifeAlt = false;
  private knifeSide = 1;
  private landDip = 0;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(64, 1, 0.01, 10);
    this.scene.add(this.camera);
    this.camera.add(this.sway);
    this.sway.add(this.holder);
    this.hemi = new THREE.HemisphereLight(0xcfe0f5, 0x9c7a52, 1.3);
    this.sun = new THREE.DirectionalLight(0xfff0d8, 2.2);
    this.sun.position.set(-0.5, 1, 0.4);
    this.scene.add(this.hemi, this.sun);

    const sleeve = () => {
      const g = new GeoBuilder().box(0.085, 0.085, 1, 0, 0, -0.5, 0xffffff);
      return new THREE.Mesh(g.build(), new THREE.MeshStandardMaterial({ color: SLEEVE.CT, roughness: 0.9 }));
    };
    const hand = () => {
      const g = new GeoBuilder().box(0.075, 0.085, 0.1, 0, 0, 0, 0xffffff).box(0.08, 0.03, 0.04, 0, -0.03, -0.06, 0xdddddd);
      return new THREE.Mesh(g.build(), new THREE.MeshStandardMaterial({ color: GLOVE.CT, roughness: 0.8, vertexColors: true }));
    };
    this.armR = sleeve();
    this.armL = sleeve();
    this.handR = hand();
    this.handL = hand();
    this.sway.add(this.armR, this.armL, this.handR, this.handL);

    this.flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: muzzleFlashTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    this.flash.visible = false;
    this.flash.renderOrder = 10;
    this.scene.add(this.flash);
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  setTeam(team: Team): void {
    if (team === this.team) return;
    this.team = team;
    for (const m of [this.armR, this.armL]) (m.material as THREE.MeshStandardMaterial).color.setHex(SLEEVE[team]);
    for (const m of [this.handR, this.handL]) (m.material as THREE.MeshStandardMaterial).color.setHex(GLOVE[team]);
  }

  private setWeapon(id: WeaponId | null): void {
    if (id === this.currentId) return;
    if (this.current) this.holder.remove(this.current.root);
    this.currentId = id;
    this.current = null;
    if (!id) return;
    let m = this.models.get(id);
    if (!m) {
      m = createWeaponModel(id, false);
      m.root.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          o.castShadow = false;
          o.frustumCulled = false;
        }
      });
      this.models.set(id, m);
    }
    this.current = m;
    this.holder.add(m.root);
  }

  onShot(): void {
    this.flashLife = 0.045;
  }

  onKnife(alt: boolean): void {
    this.knifeT = 0;
    this.knifeAlt = alt;
    this.knifeSide = -this.knifeSide;
  }

  onLand(speed: number): void {
    this.landDip = Math.min(0.06, speed * 0.006);
  }

  /** World-space muzzle point for tracers, given the main camera. */
  muzzleWorld(mainCamera: THREE.Camera, out: THREE.Vector3): THREE.Vector3 {
    if (!this.current) return out.setFromMatrixPosition(mainCamera.matrixWorld);
    this.scene.updateMatrixWorld(true);
    // view-model camera sits at the origin of its scene, looking down -Z like the main camera
    const local = this.current.muzzle.getWorldPosition(_a);
    // compensate the FOV difference roughly by pushing the point along its ray
    return out.copy(local).applyMatrix4(mainCamera.matrixWorld);
  }

  update(dt: number, s: ViewModelState): void {
    this.setTeam(s.team);
    this.setWeapon(s.weapon);
    const m = this.current;
    const visible = !!m && !s.scoped;
    this.holder.visible = visible;
    this.armR.visible = this.armL.visible = this.handR.visible = this.handL.visible = visible;
    this.flash.visible = false;
    if (!m || !s.weapon) return;

    const def = WEAPONS[s.weapon];
    const place = PLACEMENT[def.kind] ?? PLACEMENT.rifle;
    const t = s.time;

    // ---- sway (lags behind view rotation) and bob
    this.swayX = damp(this.swayX, clamp(-s.dYaw * 2.2, -0.08, 0.08), 9, dt);
    this.swayY = damp(this.swayY, clamp(s.dPitch * 2.2, -0.08, 0.08), 9, dt);
    const moving = s.onGround ? clamp(s.speed / Math.max(1, s.maxSpeed), 0, 1) : 0;
    this.bobAmt = damp(this.bobAmt, moving, 8, dt);
    this.bobPhase += dt * (6 + s.speed * 1.2);
    this.landDip = damp(this.landDip, 0, 7, dt);
    this.sway.position.set(
      this.swayX * 0.3 + Math.sin(this.bobPhase) * 0.009 * this.bobAmt,
      -this.swayY * 0.3 - Math.abs(Math.cos(this.bobPhase)) * 0.007 * this.bobAmt - this.landDip + Math.sin(t * 1.6) * 0.0015,
      0,
    );
    this.sway.rotation.set(this.swayY * 0.6, this.swayX * 0.8, this.swayX * 0.6);

    // ---- base placement
    const h = this.holder;
    h.position.copy(place.pos);
    h.rotation.copy(place.rot);

    // draw animation
    const drawDur = Math.max(0.01, s.drawEnd - s.drawStart);
    const dp = smoothstep(0, 1, (t - s.drawStart) / drawDur);
    if (dp < 1) {
      h.position.y -= (1 - dp) * 0.22;
      h.rotation.x -= (1 - dp) * 0.7;
      h.rotation.z += (1 - dp) * 0.3;
    }

    // recoil kick
    const kick = s.kick;
    if (def.kind !== 'knife' && def.kind !== 'c4') {
      const strength = def.kind === 'sniper' ? 2.2 : def.id === 'deagle' ? 1.8 : def.kind === 'pistol' ? 1.1 : def.id === 'ak47' ? 1.25 : 0.9;
      h.position.z += kick * 0.035 * strength;
      h.position.y += kick * 0.008 * strength;
      h.rotation.x += kick * 0.07 * strength;
      h.rotation.z += kick * 0.015 * strength * Math.sin(t * 50);
    }

    // reload
    let magDrop = 0;
    let support = 0;
    if (s.reloading) {
      const p = clamp((t - s.reloadStart) / Math.max(0.01, s.reloadEnd - s.reloadStart), 0, 1);
      const tilt = Math.sin(p * Math.PI);
      h.rotation.z += tilt * 0.45;
      h.rotation.x += tilt * 0.22;
      h.position.y -= tilt * 0.035;
      h.position.x -= tilt * 0.02;
      // mag out at 15-45%, new mag in 50-80%
      if (p < 0.45) magDrop = smoothstep(0.12, 0.42, p);
      else magDrop = 1 - smoothstep(0.5, 0.8, p);
      support = Math.sin(clamp((p - 0.1) / 0.75, 0, 1) * Math.PI);
      if (def.kind === 'sniper' && p > 0.82) h.rotation.z -= Math.sin(((p - 0.82) / 0.18) * Math.PI) * 0.2;
    }
    if (m.mag) {
      m.mag.position.copy(m.magRest);
      m.mag.position.y -= magDrop * 0.28;
      m.mag.position.z += magDrop * 0.05;
      m.mag.visible = magDrop < 0.95;
    }

    // knife swings
    if (def.kind === 'knife') {
      this.knifeT += dt;
      const dur = this.knifeAlt ? 0.55 : 0.32;
      const k = this.knifeT / dur;
      if (k < 1) {
        const arc = Math.sin(k * Math.PI);
        if (this.knifeAlt) {
          h.position.z -= arc * 0.18;
          h.position.y += arc * 0.04;
          h.rotation.x -= arc * 0.6;
        } else {
          h.position.x -= arc * 0.2 * this.knifeSide;
          h.rotation.y += arc * 1.1 * this.knifeSide;
          h.rotation.z -= arc * 0.6 * this.knifeSide;
        }
      }
    }

    // bomb planting / defusing: arms move down
    if (s.busy) {
      h.position.y -= 0.05 + Math.sin(t * 9) * 0.006;
      h.rotation.x += 0.15;
    }

    // ---- arms follow the grip points
    this.holder.updateMatrix();
    this.sway.updateMatrix();
    const rh = _a.copy(m.rightHand).applyMatrix4(h.matrix);
    const lh = _b.copy(m.leftHand).applyMatrix4(h.matrix);
    if (def.kind === 'knife') lh.set(-0.3, -0.42, -0.2);
    if (support > 0 && m.mag) {
      const mag = new THREE.Vector3().copy(m.mag.position).applyMatrix4(h.matrix);
      lh.lerp(mag, support);
    }
    if (def.kind === 'c4' && s.busy) {
      rh.y += Math.max(0, Math.sin(t * 14)) * 0.02;
    }
    this.placeArm(this.armR, this.handR, rh, new THREE.Vector3(0.34, -0.5, -0.12));
    this.placeArm(this.armL, this.handL, lh, new THREE.Vector3(-0.1, -0.55, -0.22));

    // muzzle flash in view space
    if (this.flashLife > 0 && def.kind !== 'knife' && def.kind !== 'c4' && def.id !== 'usp') {
      this.flashLife -= dt;
      this.camera.updateMatrixWorld(true);
      const mp = m.muzzle.getWorldPosition(_a);
      this.flash.position.copy(mp);
      this.flash.scale.setScalar(lerp(0.09, 0.16, Math.random()) * (def.kind === 'sniper' ? 1.6 : 1));
      this.flash.material.rotation = Math.random() * Math.PI;
      this.flash.visible = true;
    } else if (this.flashLife > 0) {
      this.flashLife -= dt;
    }
  }

  private placeArm(arm: THREE.Mesh, hand: THREE.Mesh, handPos: THREE.Vector3, elbow: THREE.Vector3): void {
    hand.position.copy(handPos);
    const dir = new THREE.Vector3().subVectors(handPos, elbow);
    const len = dir.length();
    dir.normalize();
    // sleeve: unit box along -Z scaled to length, from elbow to hand
    arm.position.copy(elbow);
    arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), dir);
    arm.scale.set(1, 1, len);
    hand.quaternion.copy(arm.quaternion);
  }

  /** Lighting cue: dim the view model when the player stands in shadow. */
  setLighting(inShadow: boolean, dt: number): void {
    const target = inShadow ? 0.35 : 2.2;
    this.sun.intensity = damp(this.sun.intensity, target, 6, dt);
  }
}

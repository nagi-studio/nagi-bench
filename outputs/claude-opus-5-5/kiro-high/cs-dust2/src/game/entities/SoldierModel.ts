// Procedural humanoid: separate head, torso, two jointed arms and two jointed legs,
// built from boxes. Team-specific gear (CT helmet + goggles + blue fatigues, T
// balaclava + headband + desert jacket). Holds the current weapon in an aim pose
// that pitches with the soldier's view.

import * as THREE from 'three';
import type { Team } from '../types';
import type { HoldPose, WeaponId } from '../weapons/WeaponDefs';
import { WEAPONS } from '../weapons/WeaponDefs';
import { buildWeaponModel, buildC4 } from '../render/GunModels';
import { CROUCH_DROP } from '../config';
import { clamp, damp, smoothstep } from '../math';
import type { Soldier } from './Soldier';

interface TeamMats {
  shirt: THREE.Material;
  pants: THREE.Material;
  vest: THREE.Material;
  head: THREE.Material;
  skin: THREE.Material;
  gear: THREE.Material;
  accent: THREE.Material;
  boots: THREE.Material;
  gloves: THREE.Material;
  lens: THREE.Material;
  marker: THREE.Material;
}

const matCache = new Map<Team, TeamMats>();
function teamMats(team: Team): TeamMats {
  const c = matCache.get(team);
  if (c) return c;
  const std = (color: number, rough = 0.85, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
  const m: TeamMats =
    team === 'CT'
      ? {
          shirt: std(0x2f5288),
          pants: std(0x243a5e),
          vest: std(0x3b4f66),
          head: std(0xd3a27c),
          skin: std(0xd3a27c),
          gear: std(0x27384a, 0.6, 0.2),
          accent: std(0x9fb8d8),
          boots: std(0x1b1b1d),
          gloves: std(0x1f2226),
          lens: new THREE.MeshStandardMaterial({ color: 0x88aacc, roughness: 0.1, metalness: 0.6, emissive: 0x112233 }),
          marker: new THREE.MeshBasicMaterial({ color: 0x5aa8ff }),
        }
      : {
          shirt: std(0x8a6a3e),
          pants: std(0x4c4433),
          vest: std(0x2e2a22),
          head: std(0x161616),
          skin: std(0xc0956a),
          gear: std(0x3a3226),
          accent: std(0xb3261e),
          boots: std(0x2b2116),
          gloves: std(0x141414),
          lens: std(0x161616),
          marker: new THREE.MeshBasicMaterial({ color: 0xffc23a }),
        };
  matCache.set(team, m);
  return m;
}

function boxMesh(mat: THREE.Material, sx: number, sy: number, sz: number, x = 0, y = 0, z = 0): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  return mesh;
}

const UP = new THREE.Vector3(0, 1, 0);
/** A box spanning from a to b (used for arm segments). */
function limb(mat: THREE.Material, a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Mesh {
  const d = new THREE.Vector3().subVectors(b, a);
  const len = d.length();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(t, len + t * 0.4, t), mat);
  mesh.position.copy(a).addScaledVector(d, 0.5);
  mesh.quaternion.setFromUnitVectors(UP, d.normalize());
  mesh.castShadow = true;
  return mesh;
}

interface PoseSpec {
  rs: [number, number, number];
  re: [number, number, number];
  rh: [number, number, number];
  ls: [number, number, number];
  le: [number, number, number];
  lh: [number, number, number];
}

const POSES: Record<HoldPose, PoseSpec> = {
  rifle: {
    rs: [0.21, 0, 0],
    re: [0.25, -0.22, -0.08],
    rh: [0.08, -0.15, -0.28],
    ls: [-0.21, 0, 0],
    le: [-0.17, -0.2, -0.3],
    lh: [0.06, -0.13, -0.58],
  },
  pistol: {
    rs: [0.21, 0, 0],
    re: [0.17, -0.1, -0.27],
    rh: [0.05, -0.06, -0.5],
    ls: [-0.21, 0, 0],
    le: [-0.13, -0.12, -0.28],
    lh: [0.02, -0.09, -0.47],
  },
  knife: {
    rs: [0.21, 0, 0],
    re: [0.27, -0.24, -0.12],
    rh: [0.2, -0.3, -0.34],
    ls: [-0.21, 0, 0],
    le: [-0.26, -0.27, -0.02],
    lh: [-0.25, -0.5, -0.08],
  },
};

export class SoldierModel {
  readonly root = new THREE.Group();
  private readonly body = new THREE.Group();
  private readonly hips = new THREE.Group();
  private readonly torso = new THREE.Group();
  private readonly headGroup = new THREE.Group();
  private readonly aim = new THREE.Group();
  private readonly legL = new THREE.Group();
  private readonly legR = new THREE.Group();
  private readonly kneeL = new THREE.Group();
  private readonly kneeR = new THREE.Group();
  private readonly poseGroups: Record<HoldPose, THREE.Group>;
  private readonly weaponHolders: Record<HoldPose, THREE.Group>;
  private readonly weaponCache = new Map<WeaponId, THREE.Group>();
  private currentWeapon: WeaponId | null = null;
  private readonly bomb: THREE.Group;
  private readonly marker: THREE.Mesh;
  private readonly flash: THREE.Mesh;
  private walkPhase = 0;
  private walkAmt = 0;
  private deathT = 0;
  private deathDir = 1;
  private recoilKick = 0;

  constructor(team: Team, flashMat: THREE.Material) {
    const m = teamMats(team);
    this.root.add(this.body);
    this.body.add(this.hips);
    this.hips.position.y = 0.92;

    // pelvis + belt
    this.hips.add(boxMesh(m.pants, 0.36, 0.17, 0.22, 0, 0, 0));
    this.hips.add(boxMesh(m.gear, 0.38, 0.05, 0.24, 0, 0.07, 0));

    // torso
    this.torso.position.y = 0.06;
    this.hips.add(this.torso);
    this.torso.add(boxMesh(m.shirt, 0.35, 0.24, 0.21, 0, 0.1, 0));
    this.torso.add(boxMesh(m.shirt, 0.44, 0.32, 0.25, 0, 0.36, 0));
    this.torso.add(boxMesh(m.vest, 0.46, 0.3, 0.29, 0, 0.33, 0));
    // vest pouches (front)
    for (let k = -1; k <= 1; k++) this.torso.add(boxMesh(m.gear, 0.1, 0.09, 0.05, k * 0.12, 0.24, -0.16));
    if (team === 'CT') this.torso.add(boxMesh(m.accent, 0.16, 0.05, 0.01, 0.1, 0.42, -0.148)); // shoulder patch / label
    // shoulders
    this.torso.add(boxMesh(m.shirt, 0.14, 0.12, 0.2, 0.25, 0.45, 0));
    this.torso.add(boxMesh(m.shirt, 0.14, 0.12, 0.2, -0.25, 0.45, 0));
    // neck
    this.torso.add(boxMesh(m.skin, 0.1, 0.08, 0.1, 0, 0.55, 0));

    // head
    this.headGroup.position.y = 0.58;
    this.torso.add(this.headGroup);
    this.headGroup.add(boxMesh(m.head, 0.22, 0.26, 0.24, 0, 0.13, 0));
    if (team === 'CT') {
      // face, helmet, goggles
      this.headGroup.add(boxMesh(m.skin, 0.2, 0.18, 0.02, 0, 0.1, -0.12));
      this.headGroup.add(boxMesh(m.gear, 0.27, 0.1, 0.29, 0, 0.26, 0.005));
      this.headGroup.add(boxMesh(m.gear, 0.25, 0.06, 0.04, 0, 0.21, -0.14)); // brim
      this.headGroup.add(boxMesh(m.lens, 0.2, 0.05, 0.03, 0, 0.165, -0.13));
      this.headGroup.add(boxMesh(m.gear, 0.03, 0.06, 0.2, 0.135, 0.18, 0)); // straps
      this.headGroup.add(boxMesh(m.gear, 0.03, 0.06, 0.2, -0.135, 0.18, 0));
    } else {
      // balaclava with eye slit + red headband
      this.headGroup.add(boxMesh(m.skin, 0.18, 0.05, 0.02, 0, 0.16, -0.121));
      this.headGroup.add(boxMesh(m.lens, 0.04, 0.025, 0.01, 0.05, 0.16, -0.133));
      this.headGroup.add(boxMesh(m.lens, 0.04, 0.025, 0.01, -0.05, 0.16, -0.133));
      this.headGroup.add(boxMesh(m.accent, 0.235, 0.045, 0.255, 0, 0.215, 0));
      this.headGroup.add(boxMesh(m.accent, 0.04, 0.12, 0.02, 0.05, 0.16, 0.13)); // knot tails
    }

    // aim group (shoulder pivot): arms + weapon pitch with view
    this.aim.position.y = 0.46;
    this.torso.add(this.aim);
    this.poseGroups = { rifle: new THREE.Group(), pistol: new THREE.Group(), knife: new THREE.Group() };
    this.weaponHolders = { rifle: new THREE.Group(), pistol: new THREE.Group(), knife: new THREE.Group() };
    for (const pose of Object.keys(POSES) as HoldPose[]) {
      const p = POSES[pose];
      const g = this.poseGroups[pose];
      const v = (a: [number, number, number]) => new THREE.Vector3(a[0], a[1], a[2]);
      g.add(limb(m.shirt, v(p.rs), v(p.re), 0.1));
      g.add(limb(m.shirt, v(p.re), v(p.rh), 0.085));
      g.add(limb(m.shirt, v(p.ls), v(p.le), 0.1));
      g.add(limb(m.shirt, v(p.le), v(p.lh), 0.085));
      g.add(boxMesh(m.gloves, 0.075, 0.085, 0.09, ...p.rh));
      g.add(boxMesh(m.gloves, 0.075, 0.085, 0.09, ...p.lh));
      const holder = this.weaponHolders[pose];
      holder.position.set(p.rh[0], p.rh[1] + 0.02, p.rh[2]);
      if (pose === 'knife') holder.rotation.x = -0.4;
      g.add(holder);
      g.visible = false;
      this.aim.add(g);
    }

    // legs
    const leg = (grp: THREE.Group, knee: THREE.Group, x: number) => {
      grp.position.set(x, -0.03, 0);
      grp.add(boxMesh(m.pants, 0.155, 0.46, 0.175, 0, -0.22, 0));
      if (team === 'CT') grp.add(boxMesh(m.gear, 0.165, 0.1, 0.06, 0, -0.42, -0.09)); // knee pad
      knee.position.y = -0.44;
      grp.add(knee);
      knee.add(boxMesh(m.pants, 0.135, 0.42, 0.155, 0, -0.21, 0));
      knee.add(boxMesh(m.boots, 0.145, 0.09, 0.26, 0, -0.43, -0.04));
      this.hips.add(grp);
    };
    leg(this.legL, this.kneeL, -0.1);
    leg(this.legR, this.kneeR, 0.1);

    // C4 backpack
    this.bomb = buildC4();
    this.bomb.position.set(0, 0.32, 0.19);
    this.bomb.rotation.x = Math.PI / 2;
    this.bomb.visible = false;
    this.torso.add(this.bomb);

    // teammate marker
    this.marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), m.marker);
    this.marker.position.y = 2.15;
    this.marker.scale.y = 1.6;
    this.marker.visible = false;
    this.root.add(this.marker);

    // third-person muzzle flash
    this.flash = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.35), flashMat);
    this.flash.visible = false;
    this.flash.renderOrder = 5;
  }

  private setWeapon(id: WeaponId) {
    if (this.currentWeapon === id) return;
    this.currentWeapon = id;
    const pose = WEAPONS[id].pose;
    for (const p of Object.keys(this.poseGroups) as HoldPose[]) this.poseGroups[p].visible = p === pose;
    for (const h of Object.values(this.weaponHolders)) h.clear();
    let model = this.weaponCache.get(id);
    if (!model) {
      model = buildWeaponModel(id);
      this.weaponCache.set(id, model);
    }
    this.weaponHolders[pose].add(model);
    const muzzle = model.userData.muzzle as THREE.Object3D | undefined;
    if (muzzle) muzzle.add(this.flash);
  }

  /** World-space muzzle position of the held weapon. */
  muzzleWorld(out: THREE.Vector3): THREE.Vector3 {
    const model = this.currentWeapon ? this.weaponCache.get(this.currentWeapon) : null;
    const m = model?.userData.muzzle as THREE.Object3D | undefined;
    if (!m) return out.copy(this.root.position).setY(this.root.position.y + 1.3);
    return m.getWorldPosition(out);
  }

  onShot() {
    this.recoilKick = 1;
  }

  update(s: Soldier, dt: number, time: number, showMarker: boolean, cameraPos: THREE.Vector3 | null) {
    this.root.position.copy(s.pos);
    this.setWeapon(s.weapon.def.id);
    this.bomb.visible = s.hasBomb && s.alive;
    this.marker.visible = showMarker && s.alive;
    if (this.marker.visible) this.marker.rotation.y = time * 2.5;

    if (!s.alive) {
      this.deathT = Math.min(1, this.deathT + dt * 2.2);
      const e = smoothstep(this.deathT);
      this.body.rotation.x = this.deathDir * e * (Math.PI / 2) * 0.96;
      this.body.position.y = -0.05 * e;
      this.flash.visible = false;
      return;
    }
    this.deathT = 0;
    this.body.rotation.x = 0;
    this.body.position.y = 0;
    this.root.rotation.y = s.yaw;

    // locomotion
    const speed = s.horizontalSpeed;
    const moving = clamp(speed / 5, 0, 1);
    this.walkAmt = damp(this.walkAmt, s.onGround ? moving : 0.2, 10, dt);
    this.walkPhase += dt * (4 + speed * 1.6) * (speed > 0.2 ? 1 : 0);
    // determine whether walking backwards (relative to facing)
    const fx = -Math.sin(s.yaw), fz = -Math.cos(s.yaw);
    const fwd = speed > 0.1 ? (s.vel.x * fx + s.vel.z * fz) / speed : 1;
    const dir = fwd < -0.2 ? -1 : 1;
    const swing = Math.sin(this.walkPhase) * 0.62 * this.walkAmt * dir;
    const c = s.crouch;
    this.hips.position.y = 0.92 - CROUCH_DROP * c + Math.abs(Math.cos(this.walkPhase)) * 0.025 * this.walkAmt;
    this.legL.rotation.x = 1.1 * c + swing;
    this.legR.rotation.x = 1.1 * c - swing;
    this.kneeL.rotation.x = -2.0 * c - Math.max(0, Math.sin(this.walkPhase + 1.4)) * 0.75 * this.walkAmt;
    this.kneeR.rotation.x = -2.0 * c - Math.max(0, Math.sin(this.walkPhase + Math.PI + 1.4)) * 0.75 * this.walkAmt;
    this.torso.rotation.x = 0.18 * c; // lean forward when crouched
    this.torso.rotation.y = Math.sin(this.walkPhase) * 0.05 * this.walkAmt;
    if (!s.onGround) {
      this.legL.rotation.x = 0.5;
      this.legR.rotation.x = 0.1;
      this.kneeL.rotation.x = -0.9;
      this.kneeR.rotation.x = -0.4;
    }

    // aim
    const w = s.weapon;
    let reloadDip = 0;
    if (w.reloading) {
      const p = clamp((time - w.reloadStart) / Math.max(0.01, w.reloadEnd - w.reloadStart), 0, 1);
      reloadDip = Math.sin(p * Math.PI) * 0.6;
    }
    this.recoilKick = Math.max(0, this.recoilKick - dt * 9);
    this.aim.rotation.x = clamp(s.pitch, -1.2, 1.2) - 0.18 * c - reloadDip + this.recoilKick * 0.12;
    this.headGroup.rotation.x = clamp(s.pitch, -0.8, 0.8) * 0.6;

    // muzzle flash
    const flashOn = time - w.lastShot < 0.05 && w.def.slot !== 'melee' && w.def.id !== 'usp';
    this.flash.visible = flashOn;
    if (flashOn && cameraPos) {
      this.flash.lookAt(cameraPos);
      this.flash.rotation.z = Math.random() * Math.PI;
    }
  }

  setDeathDirection(dir: number) {
    this.deathDir = dir >= 0 ? 1 : -1;
  }
}

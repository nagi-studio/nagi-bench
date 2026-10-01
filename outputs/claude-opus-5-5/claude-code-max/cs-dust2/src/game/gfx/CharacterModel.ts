import * as THREE from 'three';
import { clamp, lerp, smoothstep } from '../core/math';
import type { HitGroup, Team } from '../core/types';
import { WEAPONS, type WeaponId } from '../weapons/WeaponDefs';
import { GeoBuilder, vcMaterial } from './GeoBuilder';
import { createWeaponModel, type WeaponModel } from './WeaponModels';

interface Palette {
  top: number;
  topDark: number;
  pants: number;
  gear: number;
  gearLight: number;
  skin: number;
  gloves: number;
  boots: number;
  accent: number;
  head: number;
}

const PALETTES: Record<Team, Palette> = {
  CT: {
    top: 0x2d4166,
    topDark: 0x1f2d47,
    pants: 0x283753,
    gear: 0x25282e,
    gearLight: 0x3a4049,
    skin: 0xc9956b,
    gloves: 0x1b1b1d,
    boots: 0x161618,
    accent: 0x3f86e8,
    head: 0x3a4d63,
  },
  T: {
    top: 0x93703f,
    topDark: 0x6e5330,
    pants: 0x3d3a31,
    gear: 0x4f4c38,
    gearLight: 0x625e46,
    skin: 0xb98560,
    gloves: 0x2b2520,
    boots: 0x3d2c1d,
    accent: 0xc0352d,
    head: 0x1c1c1c,
  },
};

interface HitPart {
  mesh: THREE.Mesh;
  group: HitGroup;
  min: THREE.Vector3;
  max: THREE.Vector3;
  inv: THREE.Matrix4;
}

export interface CharacterPose {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  /** Horizontal velocity in world space. */
  vx: number;
  vz: number;
  onGround: boolean;
  crouch: number;
  alive: boolean;
  /** Seconds since death (only when !alive). */
  deadFor: number;
  /** Fall direction in body space: +1 backwards, -1 forwards. */
  fallDir: number;
  fallSide: number;
  /** 0..1 reload progress or -1. */
  reload: number;
  /** 0..1 recoil kick intensity (decays quickly after a shot). */
  kick: number;
  /** Planting / defusing crouch. */
  busy: boolean;
}

const UP_NEG = new THREE.Vector3(0, -1, 0);
const SHOULDER_R = new THREE.Vector3(0.2, 0.46, -0.02);
const SHOULDER_L = new THREE.Vector3(-0.2, 0.46, -0.04);
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _rayO = new THREE.Vector3();
const _rayD = new THREE.Vector3();
const _ikD = new THREE.Vector3();
const _ikP = new THREE.Vector3();
const _ikE = new THREE.Vector3();
const _ikH = new THREE.Vector3();
const _ikT = new THREE.Vector3();

const ARM_UPPER = 0.3;
const ARM_FORE = 0.28;

function partMesh(builder: GeoBuilder, group: HitGroup, min: [number, number, number], max: [number, number, number], parts: HitPart[]): THREE.Mesh {
  const mesh = new THREE.Mesh(builder.build(), vcMaterial('matte'));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parts.push({ mesh, group, min: new THREE.Vector3(...min), max: new THREE.Vector3(...max), inv: new THREE.Matrix4() });
  return mesh;
}

/**
 * Procedural humanoid with independent head, torso, two arms (upper/fore/hand) and two legs
 * (thigh/shin/foot). Arms are solved with 2-bone IK onto the held weapon's grip points, the upper
 * body follows aim pitch, legs run a gait cycle. Every limb mesh doubles as a hitbox (oriented box
 * in mesh space), so hit detection matches exactly what is rendered.
 */
export class CharacterModel {
  readonly root = new THREE.Group();
  private readonly body = new THREE.Group();
  private readonly hips = new THREE.Group();
  private readonly spine = new THREE.Group();
  private readonly neck = new THREE.Group();
  private readonly legL = new THREE.Group();
  private readonly legR = new THREE.Group();
  private readonly kneeL = new THREE.Group();
  private readonly kneeR = new THREE.Group();
  private readonly upperL: THREE.Mesh;
  private readonly upperR: THREE.Mesh;
  private readonly foreL: THREE.Mesh;
  private readonly foreR: THREE.Mesh;
  private readonly handL: THREE.Mesh;
  private readonly handR: THREE.Mesh;
  private readonly weaponMount = new THREE.Group();
  private readonly parts: HitPart[] = [];
  private weapon: WeaponModel | null = null;
  private weaponId: WeaponId | null = null;
  private gaitPhase = 0;
  private gaitAmount = 0;
  private layer = 0;
  readonly team: Team;

  constructor(team: Team) {
    this.team = team;
    const p = PALETTES[team];
    const parts = this.parts;

    this.root.add(this.body);
    this.body.add(this.hips);
    this.hips.position.set(0, 0.92, 0);

    // ---- pelvis (stomach zone)
    const pelvis = new GeoBuilder()
      .box(0.34, 0.18, 0.21, 0, 0.0, 0, p.pants)
      .box(0.35, 0.05, 0.22, 0, 0.07, 0, 0x1a1a1a)
      .box(0.06, 0.04, 0.02, 0, 0.07, -0.115, 0x8a8a7a);
    this.hips.add(partMesh(pelvis, 'stomach', [-0.17, -0.09, -0.105], [0.17, 0.095, 0.105], parts));

    // ---- spine: stomach + chest + neck
    this.spine.position.set(0, 0.08, 0);
    this.hips.add(this.spine);
    const stomach = new GeoBuilder().box(0.32, 0.2, 0.2, 0, 0.1, 0, p.top);
    if (team === 'CT') stomach.box(0.34, 0.12, 0.23, 0, 0.14, 0, p.gear);
    else stomach.box(0.335, 0.05, 0.21, 0, 0.03, 0, p.topDark);
    this.spine.add(partMesh(stomach, 'stomach', [-0.17, 0, -0.115], [0.17, 0.2, 0.115], parts));

    const chest = new GeoBuilder().box(0.4, 0.3, 0.24, 0, 0.35, 0, p.top);
    if (team === 'CT') {
      chest.box(0.42, 0.27, 0.27, 0, 0.33, 0, p.gear); // plate carrier
      for (let i = -1; i <= 1; i++) chest.box(0.085, 0.09, 0.045, i * 0.1, 0.27, -0.15, p.gearLight); // pouches
      chest.box(0.12, 0.05, 0.03, 0.1, 0.42, -0.145, p.gearLight); // radio
      chest.box(0.06, 0.06, 0.02, -0.21, 0.44, 0, p.accent); // shoulder patches
      chest.box(0.06, 0.06, 0.02, 0.21, 0.44, 0, p.accent);
    } else {
      chest.box(0.3, 0.2, 0.05, 0, 0.3, -0.13, p.gear); // chest rig
      for (let i = -1; i <= 1; i++) chest.box(0.075, 0.12, 0.05, i * 0.09, 0.28, -0.165, p.gearLight); // mag pouches
      chest.box(0.05, 0.32, 0.25, -0.12, 0.35, 0, p.gear); // rig straps
      chest.box(0.05, 0.32, 0.25, 0.12, 0.35, 0, p.gear);
      chest.box(0.24, 0.06, 0.06, 0, 0.47, -0.08, p.accent); // red scarf
    }
    chest.box(0.11, 0.08, 0.11, 0, 0.52, 0, team === 'CT' ? p.skin : p.head); // neck
    this.spine.add(partMesh(chest, 'chest', [-0.215, 0.2, -0.14], [0.215, 0.56, 0.14], parts));

    // ---- head
    this.neck.position.set(0, 0.55, 0);
    this.spine.add(this.neck);
    const head = new GeoBuilder();
    if (team === 'CT') {
      head.box(0.19, 0.21, 0.2, 0, 0.11, 0, p.skin); // face
      head.sphere(0.125, 0, 0.19, 0.005, p.head, 1.02, 0.78, 1.08); // helmet dome
      head.box(0.25, 0.05, 0.25, 0, 0.17, 0.01, p.head); // helmet rim
      head.box(0.17, 0.05, 0.03, 0, 0.13, -0.105, 0x111214); // goggles band
      head.box(0.06, 0.035, 0.012, -0.045, 0.13, -0.122, 0x5f86b0); // lenses
      head.box(0.06, 0.035, 0.012, 0.045, 0.13, -0.122, 0x5f86b0);
      head.box(0.12, 0.05, 0.04, 0, 0.03, -0.09, 0x2a2a2a); // face mask
    } else {
      head.box(0.2, 0.235, 0.21, 0, 0.115, 0, p.head); // balaclava
      head.box(0.15, 0.04, 0.012, 0, 0.14, -0.108, p.skin); // eye slit
      head.box(0.03, 0.022, 0.006, -0.04, 0.14, -0.116, 0x161616);
      head.box(0.03, 0.022, 0.006, 0.04, 0.14, -0.116, 0x161616);
      head.box(0.212, 0.045, 0.222, 0, 0.2, 0, p.accent); // bandana
      head.box(0.06, 0.05, 0.04, 0, 0.2, 0.12, p.accent); // knot
    }
    this.neck.add(partMesh(head, 'head', [-0.115, 0, -0.125], [0.115, 0.29, 0.13], parts));

    // ---- arms (placed by IK every pose)
    const upperArm = () => {
      const b = new GeoBuilder().box(0.105, ARM_UPPER, 0.105, 0, -ARM_UPPER / 2, 0, p.top);
      b.box(0.112, 0.06, 0.112, 0, -0.06, 0, p.accent); // CT shoulder patch / T armband
      return partMesh(b, 'arm', [-0.055, -ARM_UPPER, -0.055], [0.055, 0, 0.055], parts);
    };
    const foreArm = () => {
      const b = new GeoBuilder().box(0.088, ARM_FORE, 0.088, 0, -ARM_FORE / 2, 0, team === 'CT' ? p.top : p.topDark);
      b.box(0.095, 0.06, 0.095, 0, -ARM_FORE + 0.03, 0, p.gloves);
      return partMesh(b, 'arm', [-0.048, -ARM_FORE, -0.048], [0.048, 0, 0.048], parts);
    };
    const hand = () => {
      const b = new GeoBuilder().box(0.078, 0.095, 0.085, 0, -0.03, 0, p.gloves);
      return partMesh(b, 'arm', [-0.04, -0.08, -0.045], [0.04, 0.02, 0.045], parts);
    };
    this.upperL = upperArm();
    this.upperR = upperArm();
    this.foreL = foreArm();
    this.foreR = foreArm();
    this.handL = hand();
    this.handR = hand();
    this.spine.add(this.upperL, this.upperR, this.foreL, this.foreR, this.handL, this.handR);

    // ---- legs
    const buildLeg = (hip: THREE.Group, knee: THREE.Group, side: number) => {
      hip.position.set(0.095 * side, -0.02, 0);
      this.hips.add(hip);
      const thigh = new GeoBuilder().box(0.15, 0.44, 0.17, 0, -0.22, 0, p.pants);
      if (team === 'CT') thigh.box(0.13, 0.1, 0.03, 0, -0.39, -0.09, p.gearLight); // knee pad
      else thigh.box(0.155, 0.1, 0.1, 0.0, -0.2, 0, p.topDark); // cargo pocket
      hip.add(partMesh(thigh, 'leg', [-0.08, -0.44, -0.09], [0.08, 0, 0.09], parts));
      knee.position.set(0, -0.44, 0);
      hip.add(knee);
      const shin = new GeoBuilder().box(0.12, 0.43, 0.13, 0, -0.215, 0, p.pants).box(0.13, 0.16, 0.145, 0, -0.36, 0, p.boots);
      knee.add(partMesh(shin, 'leg', [-0.066, -0.43, -0.073], [0.066, 0, 0.073], parts));
      const foot = new GeoBuilder().box(0.115, 0.08, 0.26, 0, -0.04, -0.05, p.boots);
      const footMesh = partMesh(foot, 'leg', [-0.058, -0.08, -0.18], [0.058, 0, 0.08], parts);
      footMesh.position.set(0, -0.43, 0);
      knee.add(footMesh);
    };
    buildLeg(this.legL, this.kneeL, -1);
    buildLeg(this.legR, this.kneeR, 1);

    this.spine.add(this.weaponMount);
  }

  // ------------------------------------------------------------------ weapon

  setWeapon(id: WeaponId | null): void {
    if (id === this.weaponId) return;
    if (this.weapon) this.weaponMount.remove(this.weapon.root);
    this.weapon = null;
    this.weaponId = id;
    if (!id) return;
    this.weapon = createWeaponModel(id);
    const kind = WEAPONS[id].kind;
    this.weapon.root.scale.setScalar(kind === 'rifle' || kind === 'sniper' ? 0.92 : 1);
    this.weapon.root.traverse((o) => o.layers.set(this.layer));
    this.weaponMount.add(this.weapon.root);
  }

  /** World-space muzzle position of the held weapon (for tracers / flashes). */
  muzzleWorld(out: THREE.Vector3): THREE.Vector3 {
    if (this.weapon) return this.weapon.muzzle.getWorldPosition(out);
    return this.neck.getWorldPosition(out);
  }

  setVisible(v: boolean): void {
    this.root.visible = v;
  }

  /** Render layer for all meshes (used to hide the first-person body while keeping its shadow). */
  setLayer(layer: number): void {
    this.layer = layer;
    this.root.traverse((o) => o.layers.set(layer));
  }

  // ------------------------------------------------------------------ animation

  /** Advance gait state once per simulation tick. */
  advance(dt: number, speed: number, onGround: boolean): void {
    const target = onGround ? clamp(speed / 5.5, 0, 1) : 0.15;
    this.gaitAmount = lerp(this.gaitAmount, target, 1 - Math.exp(-10 * dt));
    this.gaitPhase += dt * (4.2 + speed * 1.15) * (speed > 0.3 ? 1 : 0.3);
  }

  pose(s: CharacterPose): void {
    this.root.position.set(s.x, s.y, s.z);
    this.root.rotation.set(0, s.yaw, 0);

    // ------------- death fall
    if (!s.alive) {
      const t = smoothstep(0, 0.55, s.deadFor);
      this.body.rotation.set((Math.PI / 2) * s.fallDir * t, 0, 0.35 * s.fallSide * t);
      this.body.position.set(0, 0.13 * t, 0);
      this.hips.position.y = 0.92;
      this.spine.rotation.set(-0.15 * t * s.fallDir, 0, 0);
      this.neck.rotation.set(-0.4 * t, 0.5 * s.fallSide * t, 0);
      this.legL.rotation.set(0.25 * t, 0, -0.18 * t);
      this.legR.rotation.set(-0.1 * t, 0, 0.25 * t);
      this.kneeL.rotation.set(-0.5 * t, 0, 0);
      this.kneeR.rotation.set(-0.15 * t, 0, 0);
      this.weaponMount.visible = false;
      this.limpArm(this.upperL, this.foreL, this.handL, -1, t);
      this.limpArm(this.upperR, this.foreR, this.handR, 1, t);
      return;
    }
    this.body.rotation.set(0, 0, 0);
    this.body.position.set(0, 0, 0);
    this.weaponMount.visible = true;

    // ------------- legs: gait cycle in movement direction
    const c = Math.cos(s.yaw);
    const sn = Math.sin(s.yaw);
    // world velocity -> body space (forward = -Z)
    const localX = s.vx * c - s.vz * sn;
    const localZ = s.vx * sn + s.vz * c;
    const sp = Math.hypot(localX, localZ);
    const fwd = sp > 0.05 ? -localZ / sp : 1;
    const side = sp > 0.05 ? localX / sp : 0;
    const amt = this.gaitAmount * (s.onGround ? 1 : 0.4);
    const swing = Math.sin(this.gaitPhase) * 0.62 * amt;
    const crouch = clamp(s.crouch + (s.busy ? 1 : 0), 0, 1);
    const crouchHip = crouch * 0.95;
    this.legL.rotation.set(swing * fwd + crouchHip, 0, -swing * side * 0.6);
    this.legR.rotation.set(-swing * fwd + crouchHip, 0, swing * side * 0.6);
    const bendL = Math.max(0, Math.sin(this.gaitPhase + 1.4)) * 0.9 * amt;
    const bendR = Math.max(0, Math.sin(this.gaitPhase + 1.4 + Math.PI)) * 0.9 * amt;
    this.kneeL.rotation.set(-bendL - crouch * 1.75, 0, 0);
    this.kneeR.rotation.set(-bendR - crouch * 1.75, 0, 0);
    const bob = Math.abs(Math.cos(this.gaitPhase)) * 0.035 * amt;
    this.hips.position.y = 0.92 - crouch * 0.33 + bob - 0.017 * amt;

    // ------------- upper body aim
    const kind = this.weaponId ? WEAPONS[this.weaponId].kind : 'knife';
    const twoHandedLong = kind === 'rifle' || kind === 'sniper';
    const twist = twoHandedLong ? -0.42 : -0.08;
    const pitch = clamp(s.pitch, -1.2, 1.2);
    this.spine.rotation.set(pitch * 0.45 + crouch * 0.12, twist, 0, 'YXZ');
    this.neck.rotation.set(pitch * 0.55 - crouch * 0.12, -twist, 0, 'YXZ');

    // weapon mount (spine space): positioned so the barrel points along the aim direction
    const kick = s.kick;
    const reload = s.reload;
    const wm = this.weaponMount;
    if (twoHandedLong) {
      wm.position.set(0.13 + 0.03, 0.39, -0.29 + kick * 0.04);
    } else if (kind === 'pistol') {
      wm.position.set(0.05, 0.38, -0.42 + kick * 0.05);
    } else if (kind === 'knife') {
      wm.position.set(0.24, 0.22, -0.3);
    } else {
      wm.position.set(0.02, 0.2, -0.32);
    }
    let reloadTilt = 0;
    if (reload >= 0) reloadTilt = Math.sin(clamp(reload, 0, 1) * Math.PI) * 0.6;
    wm.rotation.set(pitch * 0.55 - crouch * 0.12 + kick * 0.12 - reloadTilt * 0.35, -twist, reloadTilt * 0.5, 'YXZ');
    wm.updateMatrix();

    // ------------- IK arms onto the weapon
    const w = this.weapon;
    if (w) {
      const scale = w.root.scale.x;
      const rh = _v1.copy(w.rightHand).multiplyScalar(scale).applyMatrix4(wm.matrix);
      const lh = _v2.copy(w.leftHand).multiplyScalar(scale).applyMatrix4(wm.matrix);
      if (kind === 'knife') lh.set(-0.24, 0.12, -0.12);
      if (reload >= 0 && reload < 0.75 && w.mag) {
        // support hand travels to the magazine and back
        const m = Math.sin(clamp(reload / 0.75, 0, 1) * Math.PI);
        _v3.copy(w.magRest).multiplyScalar(scale).applyMatrix4(wm.matrix);
        _v3.y -= 0.12 * m;
        lh.lerp(_v3, m);
      }
      this.solveArm(this.upperR, this.foreR, this.handR, SHOULDER_R, rh, 1);
      this.solveArm(this.upperL, this.foreL, this.handL, SHOULDER_L, lh, -1);
      if (w.mag) {
        w.mag.position.copy(w.magRest);
        if (reload >= 0 && reload < 0.75) w.mag.position.y -= Math.sin(clamp(reload / 0.75, 0, 1) * Math.PI) * 0.18;
      }
    } else {
      this.limpArm(this.upperL, this.foreL, this.handL, -1, 1);
      this.limpArm(this.upperR, this.foreR, this.handR, 1, 1);
    }
  }

  /** Analytic two-bone IK: shoulder -> elbow -> hand, elbow bent down/outwards. */
  private solveArm(upper: THREE.Mesh, fore: THREE.Mesh, hand: THREE.Mesh, shoulder: THREE.Vector3, target: THREE.Vector3, side: number): void {
    const d = _ikD.subVectors(target, shoulder);
    let len = d.length();
    len = clamp(len, 0.08, ARM_UPPER + ARM_FORE - 0.005);
    d.normalize();
    const a = (ARM_UPPER * ARM_UPPER - ARM_FORE * ARM_FORE + len * len) / (2 * len);
    const h = Math.sqrt(Math.max(0, ARM_UPPER * ARM_UPPER - a * a));
    const pole = _ikP.set(0.55 * side, -1, 0.25);
    pole.addScaledVector(d, -pole.dot(d)).normalize();
    const elbow = _ikE.copy(shoulder).addScaledVector(d, a).addScaledVector(pole, h);
    const handPos = _ikH.copy(shoulder).addScaledVector(d, len);

    upper.position.copy(shoulder);
    upper.quaternion.setFromUnitVectors(UP_NEG, _ikT.subVectors(elbow, shoulder).normalize());
    fore.position.copy(elbow);
    fore.quaternion.setFromUnitVectors(UP_NEG, _ikT.subVectors(handPos, elbow).normalize());
    hand.position.copy(handPos);
    hand.quaternion.copy(fore.quaternion);
  }

  private limpArm(upper: THREE.Mesh, fore: THREE.Mesh, hand: THREE.Mesh, side: number, t: number): void {
    upper.position.set(0.2 * side, 0.46, 0);
    upper.rotation.set(0.1 * t, 0, 0.25 * side * t);
    upper.updateMatrix();
    fore.position.set(0, -ARM_UPPER, 0).applyMatrix4(upper.matrix);
    fore.rotation.set(0.3 * t, 0, 0.2 * side * t);
    fore.updateMatrix();
    hand.position.set(0, -ARM_FORE, 0).applyMatrix4(fore.matrix);
    hand.quaternion.copy(fore.quaternion);
  }

  // ------------------------------------------------------------------ hit detection

  /** Refresh world matrices and cached inverses after posing (once per tick). */
  updateHitboxes(): void {
    this.root.updateMatrixWorld(true);
    for (const p of this.parts) p.inv.copy(p.mesh.matrixWorld).invert();
  }

  /**
   * Ray vs. every limb box in its own mesh space. Returns nearest distance & hit group.
   * Hierarchy contains no scale, so local distances equal world distances.
   */
  raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxT: number): { t: number; group: HitGroup } | null {
    let best = maxT;
    let group: HitGroup | null = null;
    for (const p of this.parts) {
      _rayO.set(ox, oy, oz).applyMatrix4(p.inv);
      _rayD.set(dx, dy, dz).transformDirection(p.inv);
      const t = rayBox(_rayO, _rayD, p.min, p.max, best);
      if (t >= 0 && t < best) {
        best = t;
        group = p.group;
      }
    }
    return group ? { t: best, group } : null;
  }

  /** Approximate world position of the head centre (for bot aiming). */
  headWorld(out: THREE.Vector3): THREE.Vector3 {
    return out.set(0, 0.14, 0).applyMatrix4(this.parts[3].mesh.matrixWorld);
  }

  dispose(): void {
    this.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.geometry && !m.userData.sharedGeometry) m.geometry.dispose();
    });
  }
}

function rayBox(o: THREE.Vector3, d: THREE.Vector3, min: THREE.Vector3, max: THREE.Vector3, maxT: number): number {
  let tmin = 0;
  let tmax = maxT;
  for (let a = 0; a < 3; a++) {
    const oa = a === 0 ? o.x : a === 1 ? o.y : o.z;
    const da = a === 0 ? d.x : a === 1 ? d.y : d.z;
    const mn = a === 0 ? min.x : a === 1 ? min.y : min.z;
    const mx = a === 0 ? max.x : a === 1 ? max.y : max.z;
    if (Math.abs(da) < 1e-12) {
      if (oa < mn || oa > mx) return -1;
      continue;
    }
    let t1 = (mn - oa) / da;
    let t2 = (mx - oa) / da;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return -1;
  }
  return tmin;
}

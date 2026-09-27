import * as THREE from "three";
import { aim, applyPose, buildVoxelGeometry, idle, lerpPose, type Pose } from "@agentbench/voxel-kit";
import { Actor, makeZhang, performFace } from "../characters";
import { CubeField } from "../particles";
import { beefGeo, bundleGeo, knifeGeo, laminateGeo, magazineGeo, mesh, pistolGeo, pliersGeo, roundGeo, slugGeo, VM, VM_GLOSS } from "../props";
import { BASEMENT_SHOTS } from "../overlay";
import { box, clamp, easeInOut, hash, lerp, seg, smooth, std } from "../util";
import { slab } from "./common";

export const TABLE = new THREE.Vector3(0, 0.76, 0.35);
export const CRATE = new THREE.Vector3(-1.35, 0, -1.05);
export const SHOOTER = new THREE.Vector3(0.95, 0, 1.05);

export class BasementSet {
  readonly group = new THREE.Group();
  readonly zhang: Actor;
  private readonly bulbPivot = new THREE.Group();
  private readonly bulbLight: THREE.PointLight;
  private readonly flashLight: THREE.PointLight;
  private readonly tips: THREE.Mesh[] = [];
  private readonly irons: THREE.Mesh[] = [];
  private readonly dishTips: THREE.Mesh[] = [];
  private readonly pistolTable: THREE.Mesh;
  private readonly pistolHand: THREE.Mesh;
  private readonly magHand: THREE.Mesh;
  private readonly pliersHand: THREE.Mesh;
  private readonly knifeHand: THREE.Mesh;
  private readonly bundle: THREE.Mesh;
  private readonly laminate: THREE.Mesh;
  private readonly beef: THREE.Mesh;
  private readonly fragments = new THREE.Group();
  private readonly dust: CubeField;
  private readonly smoke: CubeField;
  readonly palmAnchor: THREE.Object3D;

  constructor() {
    this.group.name = "set:basement";
    const g = this.group;
    const conc = (a: number, b: number) => (hash(a, b) > 0.85 ? 0x4e4b46 : hash(a + 7, b) > 0.5 ? 0x57544f : 0x53504b);
    const floor = slab(16, 1, 13, 0.25, (x, _y, z) => conc(x, z));
    floor.position.set(-2, -0.25, -1.6);
    g.add(floor);
    const back = slab(16, 11, 1, 0.25, (x, y) => (y === 10 ? 0x3a3834 : conc(x, y)));
    back.position.set(-2, 0, -1.85);
    g.add(back);
    const left = slab(1, 11, 13, 0.25, (_x, y, z) => conc(z + 30, y));
    left.position.set(-2.25, 0, -1.6);
    g.add(left);
    const right = slab(1, 11, 13, 0.25, (_x, y, z) => (z >= 7 && z <= 10 && y < 8 ? 0x3a2a1c : conc(z + 60, y)));
    right.position.set(2.0, 0, -1.6);
    g.add(right);
    const front = slab(16, 11, 1, 0.25, (x, y) => conc(x + 90, y));
    front.position.set(-2, 0, 1.65);
    g.add(front);
    const ceil = slab(16, 1, 13, 0.25, (x, _y, z) => conc(x + 5, z + 5), false);
    ceil.position.set(-2, 2.75, -1.6);
    g.add(ceil);
    // Pipes along the ceiling.
    box(4, 0.1, 0.1, std(0x5a4a3a, { metalness: 0.4, roughness: 0.6 }), [0, 2.6, -1.6], g);
    box(0.1, 0.1, 3.2, std(0x4a5a5a, { metalness: 0.4, roughness: 0.6 }), [1.8, 2.55, 0], g);

    // Table and the work laid out on it.
    box(1.1, 0.05, 0.65, std(0x5a4632, { roughness: 0.8 }), [TABLE.x, TABLE.y - 0.025, TABLE.z], g);
    for (const [dx, dz] of [[-0.5, -0.28], [0.5, -0.28], [-0.5, 0.28], [0.5, 0.28]]) box(0.05, TABLE.y - 0.05, 0.05, std(0x3a2a1c), [TABLE.x + dx, (TABLE.y - 0.05) / 2, TABLE.z + dz], g);
    box(0.34, 0.004, 0.3, std(0x2a3a2a), [TABLE.x - 0.12, TABLE.y + 0.002, TABLE.z], g, false);
    const copper = roundGeo("copper");
    const iron = roundGeo("iron");
    const bodyOnly = buildVoxelGeometry({
      size: [3, 6, 3],
      at: (x, y, z) => ((x === 0 || x === 2) && (z === 0 || z === 2) ? null : y === 0 ? 0x5a4a30 : 0x8a7650),
    }, { voxel: 0.0028, anchor: "min" });
    for (let i = 0; i < 36; i++) {
      const px = TABLE.x - 0.24 + (i % 6) * 0.04, pz = TABLE.z - 0.1 + Math.floor(i / 6) * 0.04;
      const b = mesh(bodyOnly, VM, false);
      b.position.set(px, TABLE.y + 0.004, pz);
      g.add(b);
      const tip = mesh(copper, VM_GLOSS, false);
      tip.position.set(px, TABLE.y + 0.004, pz);
      g.add(tip);
      this.tips.push(tip);
      const ir = mesh(iron, VM_GLOSS, false);
      ir.position.set(px, TABLE.y + 0.004, pz);
      g.add(ir);
      this.irons.push(ir);
    }
    // A dish collecting the pulled copper tips.
    box(0.12, 0.012, 0.12, std(0xb8b8b0, { metalness: 0.3, roughness: 0.4 }), [TABLE.x + 0.2, TABLE.y + 0.006, TABLE.z - 0.12], g);
    const tipGeo = buildVoxelGeometry({ size: [2, 2, 2], at: () => 0xc27a3c }, { voxel: 0.004, anchor: "center" });
    for (let i = 0; i < 36; i++) {
      const m = mesh(tipGeo, VM_GLOSS, false);
      m.position.set(TABLE.x + 0.2 + (hash(i, 1) - 0.5) * 0.08, TABLE.y + 0.016 + hash(i, 2) * 0.006, TABLE.z - 0.12 + (hash(i, 3) - 0.5) * 0.08);
      m.rotation.set(hash(i, 4) * 3, hash(i, 5) * 3, 0);
      g.add(m);
      this.dishTips.push(m);
    }
    // Glue tube (space-grade hull sealant) and the pistol at rest.
    box(0.025, 0.025, 0.11, std(0xd0d0c8), [TABLE.x + 0.24, TABLE.y + 0.013, TABLE.z + 0.12], g, false);
    box(0.012, 0.012, 0.02, std(0xc03020), [TABLE.x + 0.24, TABLE.y + 0.013, TABLE.z + 0.185], g, false);
    this.pistolTable = mesh(pistolGeo(), VM_GLOSS);
    this.pistolTable.scale.setScalar(0.05625);
    this.pistolTable.position.set(TABLE.x + 0.35, TABLE.y + 0.03, TABLE.z + 0.05);
    this.pistolTable.rotation.set(0, 0.5, Math.PI / 2);
    g.add(this.pistolTable);

    // Crate in the corner, the wrapped target on it.
    const crate = slab(4, 3, 3, 0.15, (x, y) => (y === 2 || x === 0 || x === 3 ? 0x6a4a2a : 0x5a3c22));
    crate.position.set(CRATE.x - 0.3, 0, CRATE.z - 0.22);
    g.add(crate);
    this.bundle = mesh(bundleGeo(true), VM);
    this.bundle.position.set(CRATE.x - 0.32, 0.45, CRATE.z - 0.2);
    g.add(this.bundle);
    this.laminate = mesh(laminateGeo(), VM);
    this.laminate.position.set(CRATE.x - 0.32, 0.45, CRATE.z - 0.22);
    g.add(this.laminate);
    this.beef = mesh(beefGeo(), VM);
    this.beef.position.set(CRATE.x - 0.2, 0.55, CRATE.z - 0.14);
    g.add(this.beef);

    // Bare bulb on a cord.
    this.bulbPivot.position.set(0.1, 2.72, 0.3);
    g.add(this.bulbPivot);
    box(0.008, 0.62, 0.008, std(0x111111), [0, -0.31, 0], this.bulbPivot, false);
    box(0.06, 0.08, 0.06, new THREE.MeshBasicMaterial({ color: 0xfff0c0, toneMapped: false }), [0, -0.66, 0], this.bulbPivot, false);
    this.bulbLight = new THREE.PointLight(0xffcf8a, 3.2, 7, 0);
    this.bulbLight.position.set(0, -0.72, 0);
    this.bulbLight.castShadow = true;
    this.bulbLight.shadow.mapSize.set(512, 512);
    this.bulbLight.shadow.bias = -0.002;
    this.bulbPivot.add(this.bulbLight);
    this.flashLight = new THREE.PointLight(0xffd8a0, 0, 8, 0);
    g.add(this.flashLight);
    g.add(new THREE.HemisphereLight(0x3a342c, 0x0a0806, 0.25));

    this.dust = new CubeField(400, new THREE.MeshLambertMaterial({ color: 0xffffff }), 1);
    this.smoke = new CubeField(260, new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false }), 1);
    g.add(this.dust.mesh, this.smoke.mesh);

    this.zhang = makeZhang();
    this.zhang.dress("sweater");
    g.add(this.zhang.root);
    const inv = 1 / this.zhang.root.scale.x;
    this.pistolHand = mesh(pistolGeo(), VM_GLOSS);
    this.pistolHand.geometry.translate(0, 1.5, 0.6);
    this.zhang.fig.anchors.handR.add(this.pistolHand);
    this.magHand = mesh(magazineGeo(), VM);
    this.magHand.position.set(0, 0.5, 0.6);
    this.zhang.fig.anchors.handL.add(this.magHand);
    this.pliersHand = mesh(pliersGeo(), VM_GLOSS);
    this.pliersHand.scale.setScalar(inv);
    this.pliersHand.rotation.set(Math.PI / 2, 0, 0);
    this.pliersHand.position.set(0, 0, 0.6);
    this.zhang.fig.anchors.handR.add(this.pliersHand);
    this.knifeHand = mesh(knifeGeo(), VM_GLOSS);
    this.knifeHand.scale.setScalar(inv);
    this.knifeHand.position.set(0, 0.2, 0.4);
    this.zhang.fig.anchors.handR.add(this.knifeHand);
    // Crushed meteorite in the palm: tiny dark grains on the upturned hand.
    const grain = buildVoxelGeometry({ size: [1, 1, 1], at: () => 0x3a3e42 }, { voxel: 0.1, anchor: "center" });
    for (let i = 0; i < 26; i++) {
      const m = mesh(grain, VM_GLOSS, false);
      const s = 0.5 + hash(i, 9) * 0.9;
      m.scale.setScalar(s * 2.1);
      m.position.set((hash(i, 1) - 0.5) * 2.4, 0.2 + hash(i, 2) * 0.5 * (1 - Math.abs(hash(i, 1) - 0.5)), (hash(i, 3) - 0.5) * 2.4);
      m.rotation.set(hash(i, 4) * 3, hash(i, 5) * 3, 0);
      this.fragments.add(m);
    }
    // With the arm held straight out, the arm's front face turns upward: that is the palm.
    this.palmAnchor = new THREE.Object3D();
    this.zhang.fig.joints.armR.add(this.palmAnchor);
    this.palmAnchor.position.set(-1, -8.4, 2.05);
    this.palmAnchor.rotation.x = Math.PI / 2;
    this.palmAnchor.add(this.fragments);
  }

  /** Bulb swing: kicked by each gunshot's blast, decaying. */
  private swing(t: number): number {
    let a = Math.sin(t * 1.9) * 0.015;
    for (const s of BASEMENT_SHOTS) if (t > s) a += Math.exp(-(t - s) * 0.55) * Math.sin((t - s) * 2.4) * 0.16;
    return a;
  }

  update(t: number): void {
    const sw = this.swing(t);
    this.bulbPivot.rotation.set(sw, 0, sw * 0.6);
    let flash = 0;
    for (const s of BASEMENT_SHOTS) if (t >= s && t < s + 0.09) flash = Math.max(flash, 1 - (t - s) / 0.09);
    this.flashLight.intensity = flash * 25;
    // Tips out, meteorite slugs in.
    const pulled = Math.floor(seg(t, 190.6, 195.4) * 36);
    const fitted = Math.floor(seg(t, 195.8, 199.6) * 36);
    this.tips.forEach((m, i) => (m.visible = i >= pulled));
    this.dishTips.forEach((m, i) => (m.visible = i < pulled));
    const loaded = t < 200.9 ? 0 : t < 201.6 ? 1 : t < 202.3 ? 2 : t < 203.0 ? 3 : 4;
    this.irons.forEach((m, i) => (m.visible = i < fitted && i >= loaded));
    this.pistolTable.visible = t < 203.7;
    this.pistolHand.visible = t >= 203.7 && t < 213.2;
    this.magHand.visible = t >= 200.4 && t < 204.6;
    this.pliersHand.visible = t < 196;
    this.knifeHand.visible = t >= 221.5 && t < 225.8;
    this.bundle.visible = t < 219.2;
    this.laminate.visible = t >= 219.2;
    this.beef.visible = t >= 219.2;
    this.fragments.visible = t >= 225.8;

    // Zhang.
    const z = this.zhang;
    let pose: Pose;
    if (t < 206) {
      z.root.position.set(TABLE.x - 0.05, 0, TABLE.z + 0.6);
      z.root.rotation.set(0, Math.PI, 0);
      const work: Pose = { ...idle(t), hips: [0.35, 0, 0], neck: [0.55, 0, 0], armR: [-0.95 + Math.sin(t * 7) * 0.05, 0, 0.32], armL: [-0.9, 0, -0.3] };
      pose = work;
      if (t >= 199.4) {
        const load: Pose = { ...idle(t), hips: [0.02, 0, 0], neck: [0.4, 0, 0], armR: [-1.35 + Math.max(0, Math.sin((t - 200.9) * 9)) * 0.1 * (t < 203.4 ? 1 : 0), 0, 0.52], armL: [-1.42, 0, -0.52] };
        pose = lerpPose(work, load, smooth(seg(t, 199.4, 200.0)));
      }
    } else if (t < 213.3) {
      z.root.position.copy(SHOOTER);
      const toTarget = Math.atan2(CRATE.x - SHOOTER.x, CRATE.z - SHOOTER.z);
      z.root.rotation.set(0, lerp(Math.PI, toTarget, easeInOut(seg(t, 206, 206.8))), 0);
      const a = aim(0.18, 0);
      let kick = 0;
      for (const s of BASEMENT_SHOTS) if (t >= s) kick += Math.exp(-(t - s) * 10) * 0.35;
      a.armR![0] -= kick;
      a.armL![0] -= kick * 0.8;
      a.neck = [0.18 - kick * 0.2, 0, 0];
      pose = lerpPose(idle(t), a, easeInOut(seg(t, 206.1, 206.9)));
      if (t > 211.6) pose = lerpPose(a, idle(t), easeInOut(seg(t, 211.6, 212.6)));
    } else {
      // At the crate: examine the cloth, cut the beef, grains in the palm.
      z.root.position.set(CRATE.x + 0.62, 0, CRATE.z + 0.5);
      z.root.rotation.set(0, Math.PI + 0.95, 0);
      pose = { ...idle(t), hips: [0.3, 0, 0], neck: [0.55, 0, 0], armR: [-0.9, 0, 0.1], armL: [-0.8, 0, -0.1] };
      if (t > 221.5 && t < 225.8) pose.armR = [-1.05 + Math.sin(t * 5) * 0.06, 0.2, 0.1];
      if (t >= 225.8) {
        const up = easeInOut(seg(t, 225.8, 226.6));
        pose.armR = [lerp(-0.9, -1.45, up), 0, lerp(0.1, 0.38, up)];
        pose.neck = [lerp(0.55, 0.62, up), -0.15 * up, 0];
        pose.hips = [lerp(0.3, 0.1, up), 0, 0];
      }
    }
    applyPose(z.fig, pose);
    performFace(z, t, false);

    // Dust shaken from the ceiling and gun smoke.
    const dust = this.dust, smoke = this.smoke;
    dust.begin();
    smoke.begin();
    for (const s of BASEMENT_SHOTS) {
      const u = t - s;
      if (u < 0 || u > 5) continue;
      for (let k = 0; k < 70; k++) {
        const born = hash(k, s) * 0.8;
        const age = u - born;
        if (age < 0) continue;
        const x = -1.6 + hash(k, 1, s) * 3.4, zz = -1.4 + hash(k, 2, s) * 2.8;
        const y = 2.7 - (0.4 * age + 0.5 * age * age) * (0.6 + hash(k, 3) * 0.6);
        if (y < 0) continue;
        dust.add(x + Math.sin(age * 3 + k) * 0.02, y, zz, 0.006 + hash(k, 4) * 0.006, 0xbcb4a4);
      }
      for (let k = 0; k < 40; k++) {
        const age = u - k * 0.01;
        if (age < 0 || age > 4.5) continue;
        const muzzle = new THREE.Vector3(SHOOTER.x - 0.35, 1.45, SHOOTER.z - 0.45);
        const dir = new THREE.Vector3(CRATE.x - SHOOTER.x, -0.4, CRATE.z - SHOOTER.z).normalize();
        const p = muzzle.addScaledVector(dir, (1 - Math.exp(-age * 2)) * 0.6 * hash(k, 6));
        p.y += age * 0.08;
        p.x += (hash(k, 7) - 0.5) * age * 0.3;
        p.z += (hash(k, 8) - 0.5) * age * 0.3;
        smoke.add(p.x, p.y, p.z, (0.03 + age * 0.05) * (1 - age / 4.5), 0xd8d4cc, age, k, 0);
      }
    }
    dust.end();
    smoke.end();
    void clamp;
    void slugGeo;
  }
}

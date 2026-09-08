import * as THREE from "three";
import { PAL, SKIN, flat } from "../lib/materials";
import { box, group } from "../lib/voxel";
import { clamp, lerp } from "../lib/rng";

/**
 * Block-built people.
 *
 * Each actor is a jointed hierarchy of boxes. The silhouette stays strictly
 * cuboid, but pivots at the real joints let the director pose them: a formal
 * salute, a slow walk down a corridor, the stillness of a man who has already
 * decided, the collapse of a body hit by a meteorite round.
 */

export interface ActorConfig {
  name?: string;
  height?: number;
  build?: number;
  skin?: number;
  hair?: number;
  hairStyle?: "short" | "bald" | "grey" | "bun" | "none";
  coat?: number;
  coatAccent?: number;
  trousers?: number;
  shoes?: number;
  shirt?: number;
  tie?: number;
  glasses?: boolean;
  stoop?: number;
  epaulettes?: boolean;
  hat?: boolean;
  beard?: boolean;
}

export interface Pose {
  hipX: number;
  hipY: number;
  torsoX: number;
  torsoY: number;
  neckX: number;
  neckY: number;
  shoulderLX: number;
  shoulderLZ: number;
  elbowLX: number;
  shoulderRX: number;
  shoulderRZ: number;
  elbowRX: number;
  hipLX: number;
  kneeLX: number;
  hipRX: number;
  kneeRX: number;
  rootYaw: number;
  rootLift: number;
}

const ZERO: Pose = {
  hipX: 0,
  hipY: 0,
  torsoX: 0,
  torsoY: 0,
  neckX: 0,
  neckY: 0,
  shoulderLX: 0,
  shoulderLZ: 0,
  elbowLX: 0,
  shoulderRX: 0,
  shoulderRZ: 0,
  elbowRX: 0,
  hipLX: 0,
  kneeLX: 0,
  hipRX: 0,
  kneeRX: 0,
  rootYaw: 0,
  rootLift: 0
};

function pivot(len: number, w: number, d: number, mat: THREE.Material, name: string): THREE.Group {
  const g = group(0, 0, 0, name);
  const m = box(w, len, d, mat, 0, -len / 2, 0, { scale: 0.5 });
  g.add(m);
  return g;
}

export class VoxelActor {
  readonly root = group(0, 0, 0, "actor");
  readonly hips = group(0, 0, 0, "hips");
  readonly torso = group(0, 0, 0, "torso");
  readonly neck = group(0, 0, 0, "neck");
  readonly head = group(0, 0, 0, "head");
  readonly shoulderL = group(0, 0, 0, "shoulderL");
  readonly shoulderR = group(0, 0, 0, "shoulderR");
  readonly elbowL = group(0, 0, 0, "elbowL");
  readonly elbowR = group(0, 0, 0, "elbowR");
  readonly hipL = group(0, 0, 0, "hipL");
  readonly hipR = group(0, 0, 0, "hipR");
  readonly kneeL = group(0, 0, 0, "kneeL");
  readonly kneeR = group(0, 0, 0, "kneeR");
  readonly handR = group(0, 0, 0, "handR");
  readonly handL = group(0, 0, 0, "handL");
  readonly parts: Record<string, THREE.Object3D> = {};

  readonly height: number;
  readonly cfg: Required<Pick<ActorConfig, "height" | "build" | "skin" | "hair">> & ActorConfig;

  private target: Pose = { ...ZERO };
  private current: Pose = { ...ZERO };
  private breathPhase = Math.random() * Math.PI * 2;
  private baseStoop: number;
  private baseY = 0;
  /** procedural walk phase advanced by update() when mode==='walk' */
  walkPhase = 0;
  walkSpeed = 0;
  mode: "idle" | "walk" | "custom" = "idle";
  /** death / collapse state, driven by the director */
  fallAngle = 0;
  fallSpin = 0;
  fallDrop = 0;

  constructor(cfg: ActorConfig = {}) {
    this.cfg = {
      height: cfg.height ?? 1.78,
      build: cfg.build ?? 1,
      skin: cfg.skin ?? SKIN.mid,
      hair: cfg.hair ?? 0x14100d,
      ...cfg
    };
    this.height = this.cfg.height;
    const h = this.height;
    const b = this.cfg.build;
    this.baseStoop = cfg.stoop ?? 0;

    const skinMat = flat(this.cfg.skin, 0.85, 0);
    const hairMat = flat(this.cfg.hair, 0.95, 0);
    const coatMat = flat(cfg.coat ?? PAL.navy, 0.82, 0.02);
    const accentMat = flat(cfg.coatAccent ?? PAL.navyLight, 0.8, 0.05);
    const trouserMat = flat(cfg.trousers ?? 0x23282f, 0.9, 0);
    const shoeMat = flat(cfg.shoes ?? 0x101214, 0.7, 0.05);
    const shirtMat = flat(cfg.shirt ?? 0xd8dde2, 0.85, 0);
    const tieMat = flat(cfg.tie ?? 0x2a3340, 0.8, 0);

    // --- proportions -------------------------------------------------
    const legLen = h * 0.48;
    const shinLen = legLen * 0.52;
    const thighLen = legLen - shinLen;
    const torsoLen = h * 0.30;
    const headSize = h * 0.145;
    const hipY = legLen;
    const shoulderY = hipY + torsoLen;
    const neckLen = h * 0.035;
    const torsoW = h * 0.235 * b;
    const torsoD = h * 0.135 * b;
    const armLen = h * 0.155;
    const foreLen = h * 0.15;
    const limbW = h * 0.062 * b;
    const limbD = h * 0.07 * b;

    this.hips.position.y = hipY;
    this.hips.rotation.x = this.baseStoop * 0.3;
    this.root.add(this.hips);

    // torso pivot sits at the waist
    this.torso.position.y = 0;
    this.hips.add(this.torso);
    const chest = box(torsoW, torsoLen, torsoD, coatMat, 0, torsoLen / 2, 0, { scale: 0.5 });
    this.torso.add(chest);
    this.parts.chest = chest;

    // coat skirt / lower jacket
    const skirt = box(torsoW * 1.02, torsoLen * 0.34, torsoD * 1.04, coatMat, 0, torsoLen * 0.12, 0, { scale: 0.5 });
    this.torso.add(skirt);
    // collar + shirt V
    const collar = box(torsoW * 0.72, torsoLen * 0.16, torsoD * 0.9, shirtMat, 0, torsoLen * 0.86, torsoD * 0.08, { scale: 0.4 });
    this.torso.add(collar);
    if (cfg.tie) this.torso.add(box(torsoW * 0.14, torsoLen * 0.42, torsoD * 0.12, tieMat, 0, torsoLen * 0.68, torsoD * 0.52, { scale: 0.3 }));
    if (cfg.epaulettes) {
      this.torso.add(box(torsoW * 0.5, torsoLen * 0.07, torsoD * 0.96, accentMat, torsoW * 0.32, torsoLen * 0.95, 0, { scale: 0.4 }));
      this.torso.add(box(torsoW * 0.5, torsoLen * 0.07, torsoD * 0.96, accentMat, -torsoW * 0.32, torsoLen * 0.95, 0, { scale: 0.4 }));
    }
    // a few buttons / badge blocks for silhouette interest
    for (let i = 0; i < 3; i++) {
      this.torso.add(box(0.022, 0.022, 0.02, accentMat, torsoW * 0.16, torsoLen * (0.28 + i * 0.2), torsoD * 0.52, { scale: 0.2, cast: false }));
    }

    // --- neck / head -------------------------------------------------
    this.neck.position.set(0, torsoLen, 0);
    this.torso.add(this.neck);
    this.neck.add(box(headSize * 0.42, neckLen, headSize * 0.42, skinMat, 0, neckLen / 2, 0, { scale: 0.3 }));

    this.head.position.y = neckLen;
    this.neck.add(this.head);
    const face = box(headSize, headSize, headSize, skinMat, 0, headSize / 2, 0, { scale: 0.5 });
    this.head.add(face);
    this.parts.face = face;

    // hair
    const hs = cfg.hairStyle ?? "short";
    if (hs !== "none" && hs !== "bald") {
      const capH = headSize * (hs === "grey" ? 0.34 : 0.4);
      const cap = box(headSize * 1.04, capH, headSize * 1.04, hairMat, 0, headSize - capH / 2 + 0.002, -headSize * 0.03, { scale: 0.5 });
      this.head.add(cap);
      // back of head hair
      this.head.add(box(headSize * 1.02, headSize * 0.62, headSize * 0.16, hairMat, 0, headSize * 0.62, -headSize * 0.52, { scale: 0.5 }));
      if (hs === "bun") this.head.add(box(headSize * 0.36, headSize * 0.36, headSize * 0.36, hairMat, 0, headSize * 0.78, -headSize * 0.62, { scale: 0.4 }));
    }
    if (cfg.beard) this.head.add(box(headSize * 0.86, headSize * 0.3, headSize * 0.16, hairMat, 0, headSize * 0.22, headSize * 0.5, { scale: 0.4 }));

    // eyes (small dark voxels) + brow
    const eyeY = headSize * 0.56;
    const eyeZ = headSize * 0.51;
    const eyeMat = flat(0x1a1410, 0.6, 0);
    this.head.add(box(headSize * 0.13, headSize * 0.1, headSize * 0.03, eyeMat, -headSize * 0.2, eyeY, eyeZ, { scale: 0.2, cast: false }));
    this.head.add(box(headSize * 0.13, headSize * 0.1, headSize * 0.03, eyeMat, headSize * 0.2, eyeY, eyeZ, { scale: 0.2, cast: false }));
    this.parts.eyeL = this.head.children[this.head.children.length - 2];
    this.parts.eyeR = this.head.children[this.head.children.length - 1];
    // nose
    this.head.add(box(headSize * 0.11, headSize * 0.16, headSize * 0.1, flat(this.cfg.skin, 0.9, 0), 0, headSize * 0.42, headSize * 0.54, { scale: 0.2 }));
    if (cfg.glasses) {
      const gm = flat(0x9fb4c4, 0.3, 0.6);
      this.head.add(box(headSize * 0.34, headSize * 0.2, headSize * 0.02, gm, -headSize * 0.2, eyeY, eyeZ + 0.006, { scale: 0.2, cast: false }));
      this.head.add(box(headSize * 0.34, headSize * 0.2, headSize * 0.02, gm, headSize * 0.2, eyeY, eyeZ + 0.006, { scale: 0.2, cast: false }));
      this.head.add(box(headSize * 0.14, headSize * 0.04, headSize * 0.02, gm, 0, eyeY, eyeZ + 0.006, { scale: 0.2, cast: false }));
    }
    if (cfg.hat) {
      const hatMat = flat(0x1c2026, 0.9, 0);
      this.head.add(box(headSize * 1.2, headSize * 0.2, headSize * 1.2, hatMat, 0, headSize * 1.04, 0, { scale: 0.5 }));
      this.head.add(box(headSize * 1.1, headSize * 0.06, headSize * 1.6, hatMat, 0, headSize * 0.96, headSize * 0.2, { scale: 0.5 }));
    }

    // --- arms --------------------------------------------------------
    const shoulderX = torsoW * 0.58;
    for (const side of [-1, 1] as const) {
      const sh = side < 0 ? this.shoulderL : this.shoulderR;
      const el = side < 0 ? this.elbowL : this.elbowR;
      const hd = side < 0 ? this.handL : this.handR;
      sh.position.set(side * shoulderX, torsoLen * 0.93, 0);
      this.torso.add(sh);
      sh.add(pivot(armLen, limbW, limbD, coatMat, "upperArm"));
      el.position.y = -armLen;
      sh.add(el);
      el.add(pivot(foreLen, limbW * 0.88, limbD * 0.9, coatMat, "foreArm"));
      hd.position.y = -foreLen;
      el.add(hd);
      hd.add(box(limbW * 1.05, limbW * 1.15, limbD * 1.05, skinMat, 0, -limbW * 0.5, 0, { scale: 0.3 }));
    }

    // --- legs --------------------------------------------------------
    const hipX = torsoW * 0.27;
    for (const side of [-1, 1] as const) {
      const hp = side < 0 ? this.hipL : this.hipR;
      const kn = side < 0 ? this.kneeL : this.kneeR;
      hp.position.set(side * hipX, 0, 0);
      this.hips.add(hp);
      hp.add(pivot(thighLen, limbW * 1.15, limbD * 1.1, trouserMat, "thigh"));
      kn.position.y = -thighLen;
      hp.add(kn);
      kn.add(pivot(shinLen, limbW * 1.02, limbD * 1.0, trouserMat, "shin"));
      const foot = box(limbW * 1.15, h * 0.035, h * 0.075, shoeMat, 0, -shinLen - h * 0.017, h * 0.022, { scale: 0.4 });
      kn.add(foot);
    }

    this.parts.head = this.head;
    this.parts.torso = this.torso;
    this.parts.hips = this.hips;
  }

  /** Direct joint targets; update() eases toward them. */
  setPose(p: Partial<Pose>): void {
    Object.assign(this.target, p);
  }

  /** Reset to the neutral standing pose. */
  reset(): void {
    this.target = { ...ZERO };
    this.mode = "idle";
    this.walkSpeed = 0;
  }

  setPosition(x: number, y: number, z: number): void {
    this.root.position.set(x, y, z);
    this.baseY = y;
  }

  setYaw(yaw: number): void {
    this.root.rotation.y = yaw;
    this.target.rootYaw = yaw;
    this.current.rootYaw = yaw;
  }

  /** Point the head at a world-space target (clamped, plus small neck turn). */
  lookAtWorld(target: THREE.Vector3, weight = 1): void {
    const wp = new THREE.Vector3();
    this.head.getWorldPosition(wp);
    const dx = target.x - wp.x;
    const dz = target.z - wp.z;
    const local = Math.atan2(dx, dz) - this.root.rotation.y;
    const yaw = clamp(Math.atan2(Math.sin(local), Math.cos(local)), -0.9, 0.9);
    const dist = Math.hypot(dx, dz);
    const dy = target.y - wp.y;
    const pitch = clamp(-Math.atan2(dy, Math.max(0.2, dist)), -0.5, 0.5);
    this.target.neckY = yaw * weight;
    this.target.neckX = pitch * weight;
  }

  /** Extend the right arm into a firing line (level 0..1). */
  aim(level: number, aimPitch = 0): void {
    this.target.shoulderRX = lerp(this.target.shoulderRX, -Math.PI / 2 + aimPitch, level);
    this.target.shoulderRZ = lerp(this.target.shoulderRZ, -0.12, level);
    this.target.elbowRX = lerp(this.target.elbowRX, 0.08, level);
    this.target.shoulderLX = lerp(this.target.shoulderLX, -0.22, level);
    this.target.elbowLX = lerp(this.target.elbowLX, 0.35, level);
  }

  /** A formal salute: right hand up to the brow. */
  salute(level: number): void {
    this.target.shoulderRX = lerp(this.target.shoulderRX, -2.32, level);
    this.target.shoulderRZ = lerp(this.target.shoulderRZ, -0.42, level);
    this.target.elbowRX = lerp(this.target.elbowRX, 1.5, level);
  }

  startWalk(speed = 1): void {
    this.mode = "walk";
    this.walkSpeed = speed;
  }

  stopWalk(): void {
    this.mode = "idle";
    this.walkSpeed = 0;
  }

  /** Advance procedural motion. */
  update(time: number, dt: number): void {
    // breathing
    const br = Math.sin(time * 1.05 + this.breathPhase) * 0.012;
    const sway = Math.sin(time * 0.37 + this.breathPhase) * 0.008;

    if (this.mode === "walk") {
      this.walkPhase += dt * this.walkSpeed * 4.4;
      const p = this.walkPhase;
      const s = Math.sin(p);
      const c = Math.cos(p);
      this.target.hipLX = s * 0.55;
      this.target.hipRX = -s * 0.55;
      this.target.kneeLX = Math.max(0, -s) * 0.7;
      this.target.kneeRX = Math.max(0, s) * 0.7;
      this.target.shoulderLX = -s * 0.4;
      this.target.shoulderRX = s * 0.4;
      this.target.elbowLX = 0.18 + Math.max(0, s) * 0.2;
      this.target.elbowRX = 0.18 + Math.max(0, -s) * 0.2;
      this.target.hipY = s * 0.06;
      this.target.rootLift = Math.abs(c) * 0.012;
      this.target.torsoX = this.baseStoop * 0.3 + 0.04;
    } else {
      this.target.rootLift = 0;
    }

    const k = 1 - Math.exp(-dt * 7.5);
    const c = this.current;
    const t = this.target;
    c.hipX = lerp(c.hipX, t.hipX, k);
    c.hipY = lerp(c.hipY, t.hipY, k);
    c.torsoX = lerp(c.torsoX, t.torsoX, k);
    c.torsoY = lerp(c.torsoY, t.torsoY, k);
    c.neckX = lerp(c.neckX, t.neckX, k);
    c.neckY = lerp(c.neckY, t.neckY, k);
    c.shoulderLX = lerp(c.shoulderLX, t.shoulderLX, k);
    c.shoulderLZ = lerp(c.shoulderLZ, t.shoulderLZ, k);
    c.elbowLX = lerp(c.elbowLX, t.elbowLX, k);
    c.shoulderRX = lerp(c.shoulderRX, t.shoulderRX, k);
    c.shoulderRZ = lerp(c.shoulderRZ, t.shoulderRZ, k);
    c.elbowRX = lerp(c.elbowRX, t.elbowRX, k);
    c.hipLX = lerp(c.hipLX, t.hipLX, k);
    c.kneeLX = lerp(c.kneeLX, t.kneeLX, k);
    c.hipRX = lerp(c.hipRX, t.hipRX, k);
    c.kneeRX = lerp(c.kneeRX, t.kneeRX, k);
    c.rootYaw = lerp(c.rootYaw, t.rootYaw, k);

    this.hips.rotation.x = this.baseStoop * 0.25 + c.hipX * 0.18;
    this.hips.rotation.y = c.hipY;
    this.torso.rotation.x = this.baseStoop * 0.5 + c.torsoX + br;
    this.torso.rotation.y = c.torsoY;
    this.torso.position.y = c.rootLift;
    this.neck.rotation.x = c.neckX + this.baseStoop * 0.4;
    this.neck.rotation.y = c.neckY;
    this.shoulderL.rotation.set(c.shoulderLX, 0, c.shoulderLZ);
    this.shoulderR.rotation.set(c.shoulderRX, 0, c.shoulderRZ);
    this.elbowL.rotation.x = c.elbowLX;
    this.elbowR.rotation.x = c.elbowRX;
    this.hipL.rotation.x = c.hipLX;
    this.hipR.rotation.x = c.hipRX;
    this.kneeL.rotation.x = -c.kneeLX;
    this.kneeR.rotation.x = -c.kneeRX;
    this.root.rotation.y = c.rootYaw;
    this.root.rotation.x = this.fallAngle;
    this.root.rotation.z = this.fallSpin;
    this.root.position.y = this.baseY + c.rootLift * 0.5 + this.fallDrop;
  }
}

/** A blocky semi-automatic pistol, ~19cm, for the meteorite rounds. */
export function makePistol(): THREE.Group {
  const g = group(0, 0, 0, "pistol");
  const body = flat(0x22262b, 0.45, 0.85);
  const grip = flat(0x14161a, 0.85, 0.05);
  const steel = flat(0x9aa3ad, 0.28, 0.95);
  // slide
  g.add(box(0.05, 0.062, 0.2, body, 0, 0, 0.05, { scale: 0.2 }));
  g.add(box(0.052, 0.02, 0.2, steel, 0, 0.032, 0.05, { scale: 0.2 }));
  // barrel tip
  g.add(box(0.028, 0.028, 0.03, steel, 0, 0, 0.16, { scale: 0.1 }));
  // grip, raked back
  const gr = box(0.046, 0.13, 0.07, grip, 0, -0.085, -0.03, { scale: 0.2, rot: [0.32, 0, 0] });
  g.add(gr);
  // trigger guard
  g.add(box(0.05, 0.012, 0.06, body, 0, -0.045, 0.015, { scale: 0.1 }));
  g.add(box(0.012, 0.05, 0.012, body, 0, -0.022, 0.04, { scale: 0.1 }));
  return g;
}

export function makeBriefcase(): THREE.Group {
  const g = group(0, 0, 0, "briefcase");
  const leather = flat(0x2a1f16, 0.8, 0.02);
  const metal = flat(0xb9a06a, 0.3, 0.8);
  g.add(box(0.34, 0.26, 0.09, leather, 0, 0, 0, { scale: 0.3 }));
  g.add(box(0.1, 0.02, 0.02, metal, 0, 0.14, 0, { scale: 0.1 }));
  g.add(box(0.03, 0.03, 0.1, metal, 0, 0.15, 0, { scale: 0.1 }));
  return g;
}

export function makeFolder(): THREE.Group {
  const g = group(0, 0, 0, "folder");
  const paper = flat(0xd9d4c6, 0.9, 0);
  const cover = flat(0x8a4b2a, 0.85, 0);
  g.add(box(0.22, 0.3, 0.03, cover, 0, 0, 0, { scale: 0.2 }));
  g.add(box(0.2, 0.28, 0.012, paper, 0.01, 0.01, 0.02, { scale: 0.2 }));
  return g;
}

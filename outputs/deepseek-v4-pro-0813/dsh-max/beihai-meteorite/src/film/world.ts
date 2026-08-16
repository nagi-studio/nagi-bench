import * as THREE from "three";
import type { Figure, Pose } from "@agentbench/voxel-kit";
import { lerpPose, float as floatPose, aim as aimPose, idle as idlePose, walk as walkPose } from "@agentbench/voxel-kit";
import {
  makeZhang,
  makeZhangShirt,
  makeCollector,
  makeSuitedFigure,
  suitClothesSkin,
  keyedPose,
  poseFigure,
  ZHANG_SKIN,
  type SuitOpts,
  type FaceSpec,
} from "./characters";
import {
  makeCourtyard,
  makeHutongRoom,
  makeOffice,
  makeWorkshop,
  makeBasement,
  makeSpaceWorld,
  makeCabin,
  makeHibernationBay,
  SPACE,
  type HutongRoomSet,
  type WorkshopSet,
  type BasementSet,
  type SpaceWorld,
  type HibernationBaySet,
} from "./environments";
import {
  makePistol,
  makeScope,
  makeMagazine,
  makeMeteorRock,
  makeCamera,
  makeGlowSprite,
} from "./props";
import { PuffSystem, DustField } from "./fx";
import { Overlay } from "./overlay";
import { FIRES, FLIGHT_TIME, HITS } from "./sfx";
import { mulberry32 } from "./util";

/* ------------------------------------------------------------------ */
/* group figure layout                                                 */
/* ------------------------------------------------------------------ */

const SUN_FACE_DIR = new THREE.Vector3(0, -0.977, -0.21).normalize();
const SIDE = new THREE.Vector3(0.21, 0, 0.978); // horizontal, ⊥ to facing dir

export interface GroupMember {
  figure: Figure;
  /** target index or -1 for generic; 0=A 1=B 2=C */
  target: -1 | 0 | 1 | 2;
  base: THREE.Vector3;
  phase: number;
  hit: boolean;
}

const GROUP_LAYOUT: Array<{ s: number; back: number; target: -1 | 0 | 1 | 2 }> = [
  // front row: the three leaders in the middle
  { s: 0, back: 0, target: 0 },
  { s: -1.9, back: 0, target: 1 },
  { s: 1.9, back: 0, target: 2 },
  { s: -3.8, back: 0.2, target: -1 },
  { s: 3.8, back: 0.2, target: -1 },
  // second row
  { s: -6.4, back: 2.3, target: -1 },
  { s: -4.4, back: 2.2, target: -1 },
  { s: -2.2, back: 2.3, target: -1 },
  { s: 0, back: 2.4, target: -1 },
  { s: 2.2, back: 2.3, target: -1 },
  { s: 4.4, back: 2.2, target: -1 },
  { s: 6.4, back: 2.3, target: -1 },
  // third row
  { s: -5.2, back: 4.5, target: -1 },
  { s: -2.8, back: 4.6, target: -1 },
  { s: 0, back: 4.7, target: -1 },
  { s: 2.8, back: 4.6, target: -1 },
  { s: 5.2, back: 4.5, target: -1 },
];

const TARGET_FACES: Record<number, FaceSpec> = {
  0: {
    skin: "#d4ab7f", skinShade: "#b98d5e", hair: "#e2e6ec", hairTopRows: 2, hairSideRows: 3,
    brows: "#c9cdd4", eyes: [1, 5], mouth: "line", ageLines: true, nose: true,
  },
  1: {
    skin: "#d0a57b", skinShade: "#b68a61", hair: "#4a4a52", hairTopRows: 1, hairSideRows: 2,
    brows: "#2e2a2c", eyes: [1, 5], mouth: "line", nose: true,
  },
  2: {
    skin: "#e0bc97", skinShade: "#c99f76", hair: "#2e2a33", hairTopRows: 2, hairSideRows: 5,
    sideLong: true, brows: "#241f2a", eyes: [1, 5], mouth: "line", lashes: true, blush: true,
    lipColor: "#a0525c", nose: true,
  },
};

const GENERIC_FACES: FaceSpec[] = [
  { skin: "#d9b18b", skinShade: "#c39a72", hair: "#1c1f26", hairTopRows: 2, eyes: [1, 5], mouth: "calm" },
  { skin: "#c9946c", skinShade: "#b07c56", hair: "#3a2f28", hairTopRows: 2, brows: "#2a2018", eyes: [1, 5], mouth: "line" },
  { skin: "#e6c29c", skinShade: "#cfab82", hair: "#5a4a3a", hairTopRows: 1, eyes: [1, 5], mouth: "calm" },
  { skin: "#b98d6a", skinShade: "#a07653", hair: "#23272e", hairTopRows: 2, eyes: [1, 5], mouth: "line", stubble: true },
  { skin: "#e8c9a6", skinShade: "#d2b18c", hair: "#7a4a3a", hairTopRows: 2, brows: "#5a3428", eyes: [1, 5], mouth: "smile", blush: true },
  { skin: "#d0a57b", skinShade: "#b68a61", hair: "#101318", hairTopRows: 2, eyes: [1, 5], mouth: "calm" },
  { skin: "#d9b18b", skinShade: "#c39a72", hair: "#2e2a33", hairTopRows: 2, eyes: [1, 5], mouth: "line" },
  { skin: "#c9946c", skinShade: "#b07c56", hair: "#4a4a52", hairTopRows: 1, eyes: [1, 5], mouth: "calm" },
];

const SCREAM_FACE: FaceSpec = {
  skin: "#d4ab7f", skinShade: "#b98d5e", hair: "#e2e6ec", hairTopRows: 2, hairSideRows: 3,
  brows: "#c9cdd4", eyes: [1, 5], mouth: "open", browY: 2, ageLines: true, nose: true,
};

/* ------------------------------------------------------------------ */
/* bullet aiming                                                       */
/* ------------------------------------------------------------------ */

export interface BulletAim {
  /** group member index, or null for a miss */
  member: number | null;
  offset: THREE.Vector3;
}

export const BULLET_AIMS: BulletAim[] = (() => {
  const rng = mulberry32(99);
  const aims: BulletAim[] = [];
  const strays = new Set<number>([7, 17, 27, 29]); // clean misses
  for (let b = 0; b < 30; b++) {
    const k = b % 10;
    if (b === 1) aims.push({ member: 1, offset: new THREE.Vector3(-0.1, 0.15, 0) });
    else if (b === 2) aims.push({ member: 0, offset: new THREE.Vector3(0.1, 0.35, 0) });
    else if (b === 11) aims.push({ member: 7, offset: new THREE.Vector3(0.6, -0.25, 0.8) }); // thruster pack
    else if (b === 13) aims.push({ member: 2, offset: new THREE.Vector3(-0.15, 0.1, 0) });
    else if (b === 20) aims.push({ member: 12, offset: new THREE.Vector3(0.4, 0.2, 0) });
    else if (strays.has(b)) aims.push({ member: null, offset: new THREE.Vector3((rng() - 0.5) * 6, (rng() - 0.5) * 2, 2 + rng() * 3) });
    else aims.push({
      member: k % 3,
      offset: new THREE.Vector3((rng() - 0.5) * 0.9, (rng() - 0.5) * 0.5, (rng() - 0.5) * 0.6),
    });
  }
  return aims;
})();

/* ------------------------------------------------------------------ */
/* the assembled world                                                 */
/* ------------------------------------------------------------------ */

export interface FilmWorld {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  overlay: Overlay;

  sets: {
    courtyard: THREE.Group;
    room: HutongRoomSet;
    office: THREE.Group;
    workshop: WorkshopSet;
    basement: BasementSet;
    space: SpaceWorld;
    cabin: { group: THREE.Group; unit: THREE.Mesh };
    bay: HibernationBaySet;
  };

  figures: {
    zhang: Figure; // hutong + office (same coat)
    zhangWorkshop: Figure;
    zhangBasement: Figure;
    zhangSpace: Figure;
    zhangSpacePrologue: Figure;
    zhangBay: Figure;
    collector: Figure;
    group: GroupMember[];
    scream: Figure;
    photographer: Figure;
  };

  fx: {
    sparks: PuffSystem;
    smoke: PuffSystem;
    gas: PuffSystem;
    blood: PuffSystem;
    thrusterPuffs: PuffSystem;
    dustRoom: DustField;
    dustWorkshop: DustField;
    muzzleFlash: THREE.Sprite;
    muzzleLight: THREE.PointLight;
    firefly: THREE.Sprite;
    tracers: THREE.Mesh[];
  };

  props: {
    zhangPistol: THREE.Mesh;
    zhangScope: THREE.Mesh;
    spareMag: THREE.Mesh;
    phone: THREE.Mesh;
    rockHand: THREE.Mesh;
    saleRocks: THREE.Mesh[];
    clothWrap: THREE.Group;
  };
}

function glowSuit(f: Figure): void {
  // faint suit-mounted lamp glow so figures read against the void
  for (const part of Object.values(f.clothing)) {
    const mat = (part as THREE.Mesh).material as THREE.MeshStandardMaterial;
    mat.emissive = new THREE.Color(0x2a3c52);
    mat.emissiveIntensity = 0.7;
  }
}

export function buildWorld(scene: THREE.Scene, camera: THREE.PerspectiveCamera): FilmWorld {
  const overlay = new Overlay(348);

  /* ---------- sets ---------- */
  const courtyard = makeCourtyard();
  const room = makeHutongRoom();
  const office = makeOffice();
  const workshop = makeWorkshop();
  const basement = makeBasement();
  const space = makeSpaceWorld();
  const cabin = makeCabin();
  const bay = makeHibernationBay();
  for (const s of [courtyard, room.group, office, workshop.group, basement.group, space.group, cabin.group, bay.group]) {
    scene.add(s);
    s.visible = false;
  }

  /* ---------- figures ---------- */
  const zhang = makeZhang();
  zhang.root.position.set(-0.9, 0, 1.9);
  scene.add(zhang.root);

  const collector = makeCollector();
  collector.root.position.set(1.5, 0, 2.0);
  collector.root.rotation.y = -1.59;
  scene.add(collector.root);

  const zhangWorkshop = makeZhang();
  zhangWorkshop.root.position.set(3.6, 0, 3.4);
  scene.add(zhangWorkshop.root);

  const zhangBasement = makeZhangShirt();
  zhangBasement.root.position.set(0.75, 0, 1.78);
  zhangBasement.root.rotation.y = Math.PI;
  scene.add(zhangBasement.root);

  const zhangSuitOpts: SuitOpts = { band: "blue", bodyFace: {
    skin: ZHANG_SKIN, skinShade: "#c39a72", hair: "#23272e", hairTopRows: 2, hairSideRows: 3,
    brows: "#1a1e25", eyes: [1, 5], mouth: "calm",
  } };
  const zhangSpace = makeSuitedFigure("zhang-space", zhangSuitOpts);
  glowSuit(zhangSpace);
  zhangSpace.root.position.set(SPACE.zhangWait.x, SPACE.zhangWait.y, SPACE.zhangWait.z);
  zhangSpace.root.rotation.y = Math.PI; // faces -Z, toward the group
  scene.add(zhangSpace.root);

  const zhangSpacePrologue = makeSuitedFigure("zhang-prologue", zhangSuitOpts);
  glowSuit(zhangSpacePrologue);
  zhangSpacePrologue.root.position.copy(zhangSpace.root.position);
  zhangSpacePrologue.root.rotation.y = Math.PI;
  scene.add(zhangSpacePrologue.root);

  const zhangBay = makeSuitedFigure("zhang-bay", {
    ...zhangSuitOpts,
    noHelmet: true,
    band: "blue",
  });
  glowSuit(zhangBay);
  zhangBay.root.position.set(0, 0, -3.9);
  zhangBay.root.rotation.y = 0;
  scene.add(zhangBay.root);

  /* ---------- photo group ---------- */
  const group: GroupMember[] = [];
  GROUP_LAYOUT.forEach((layout, i) => {
    const target = layout.target;
    const opts: SuitOpts = {
      band: target === 0 || target === 1 || target === 2 ? "gold" : "gray",
      bodyFace: target >= 0 ? TARGET_FACES[target]! : GENERIC_FACES[i % GENERIC_FACES.length]!,
    };
    const figure = makeSuitedFigure(`group-${i}`, opts, target === 2 ? 1.72 : 1.78);
    glowSuit(figure);
    const base = new THREE.Vector3()
      .copy(SPACE.groupPos as unknown as THREE.Vector3)
      .addScaledVector(SIDE, layout.s)
      .addScaledVector(SUN_FACE_DIR, -layout.back);
    figure.root.position.copy(base);
    figure.root.rotation.y = Math.PI;
    figure.root.rotation.x = 0.08;
    scene.add(figure.root);
    group.push({ figure, target, base, phase: i * 0.53, hit: false });
  });

  const photographer = makeSuitedFigure("photographer", {
    band: "gray",
    bodyFace: GENERIC_FACES[3]!,
  });
  glowSuit(photographer);
  const camProp = makeCamera();
  camProp.position.set(0.12, 0.0, 0.1);
  camProp.rotation.x = 0.4;
  photographer.anchors.handR.add(camProp);
  photographer.root.position.copy(group[8]!.base).addScaledVector(SIDE, 2.6).addScaledVector(SUN_FACE_DIR, -1.2);
  photographer.root.rotation.y = Math.PI;
  photographer.root.rotation.x = 0.06;
  scene.add(photographer.root);

  /* ---------- scream figure (replaces A on the visor hit) ---------- */
  const scream = makeSuitedFigure("scream", { band: "gold", bodyFace: SCREAM_FACE });
  glowSuit(scream);
  scream.root.position.copy(group[0]!.base);
  scream.root.rotation.y = Math.PI;
  scream.root.rotation.x = 0.08;
  scream.root.visible = false;
  scene.add(scream.root);

  /* ---------- Zhang's props ---------- */
  const zhangPistol = makePistol();
  zhangPistol.position.set(0, -0.6, 0.5);
  zhangPistol.visible = false;
  zhangSpace.anchors.handR.add(zhangPistol);

  const zhangScope = makeScope();
  zhangScope.position.set(0, 0.4, 0.35);
  zhangScope.visible = false;
  zhangPistol.add(zhangScope);

  const spareMag = makeMagazine();
  spareMag.position.set(0.1, 0.0, 0.15);
  spareMag.visible = false;
  zhangSpace.anchors.handL.add(spareMag);

  const phone = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.22, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x14181e, roughness: 0.4, metalness: 0.4 }),
  );
  phone.position.set(0.02, 0.02, 0.05);
  phone.visible = false;
  zhang.anchors.handR.add(phone);

  const rockHand = makeMeteorRock(21, 0.09);
  rockHand.visible = false;
  collector.anchors.handL.add(rockHand);

  const saleRocks: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const r = makeMeteorRock(31 + i, 0.07);
    r.position.set(-1.0 + i * 0.24, 0.48, 1.9);
    r.rotation.y = i * 1.3;
    r.visible = false;
    scene.add(r);
    saleRocks.push(r);
  }
  const clothWrap = new THREE.Group();
  clothWrap.position.set(-1.0, 0.5, 1.9);
  const cloth = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.16, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x8a7a5c, roughness: 1 }),
  );
  clothWrap.add(cloth);
  clothWrap.visible = false;
  scene.add(clothWrap);

  /* ---------- fx ---------- */
  const sparks = new PuffSystem(900, true, 0.9);
  scene.add(sparks.points);
  const smoke = new PuffSystem(700, false, 0.55);
  scene.add(smoke.points);
  const gas = new PuffSystem(900, true, 0.8);
  scene.add(gas.points);
  const blood = new PuffSystem(700, false, 0.9);
  scene.add(blood.points);
  const thrusterPuffs = new PuffSystem(900, true, 0.7);
  scene.add(thrusterPuffs.points);

  const dustRoom = new DustField(140, [0, 1.8, 1.2], [5.5, 3.2, 6], 8);
  scene.add(dustRoom.points);
  const dustWorkshop = new DustField(160, [0.4, 2.2, 0.6], [9, 4, 10], 9);
  scene.add(dustWorkshop.points);

  // muzzle flash
  const muzzleFlash = makeGlowSprite("rgba(255,230,160,1)", "rgba(255,160,60,0)");
  muzzleFlash.scale.setScalar(1.6);
  muzzleFlash.visible = false;
  scene.add(muzzleFlash);
  const muzzleLight = new THREE.PointLight(0xffd9a0, 0, 30, 2);
  muzzleLight.position.copy(SPACE.zhangWait as unknown as THREE.Vector3);
  scene.add(muzzleLight);

  const firefly = makeGlowSprite("rgba(255,220,150,1)", "rgba(255,170,60,0)");
  firefly.scale.setScalar(60);
  firefly.visible = false;
  scene.add(firefly);

  // tracers
  const tracers: THREE.Mesh[] = [];
  const tracerMat = new THREE.MeshBasicMaterial({
    color: 0xfff2d0,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  for (let i = 0; i < 30; i++) {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 9), tracerMat);
    t.visible = false;
    t.frustumCulled = false;
    scene.add(t);
    tracers.push(t);
  }

  return {
    scene,
    camera,
    overlay,
    sets: { courtyard, room, office, workshop, basement, space, cabin, bay },
    figures: { zhang, zhangWorkshop, zhangBasement, zhangSpace, zhangSpacePrologue, zhangBay, collector, group, scream, photographer },
    fx: {
      sparks, smoke, gas, blood, thrusterPuffs, dustRoom, dustWorkshop,
      muzzleFlash, muzzleLight, firefly, tracers,
    },
    props: { zhangPistol, zhangScope, spareMag, phone, rockHand, saleRocks, clothWrap },
  };
}

/* ------------------------------------------------------------------ */
/* pose helpers used by shots                                          */
/* ------------------------------------------------------------------ */

export function spaceFloatPose(t: number, phase = 0): Pose {
  const base = floatPose(t * 0.8 + phase);
  base.lift = (base.lift ?? 0) * 0.5;
  return base;
}

/** floating but aiming: float body + aim arms */
export function spaceAimPose(t: number, yaw = 0, pitch = 0): Pose {
  const f = spaceFloatPose(t, 0);
  const a = aimPose(pitch, yaw);
  return {
    hips: f.hips,
    neck: a.neck,
    armR: a.armR,
    armL: a.armL,
    legR: f.legR,
    legL: f.legL,
    lift: f.lift,
  };
}

export function groupPose(t: number, member: GroupMember, panic = 0): Pose {
  const f = spaceFloatPose(t, member.phase);
  const p = clampPanic(panic);
  if (p <= 0) return f;
  const flail: Pose = {
    armR: [-0.5 + Math.sin(t * 9 + member.phase) * 0.7, 0, 0.5],
    armL: [0.5 + Math.sin(t * 8.3 + member.phase) * 0.7, 0, -0.5],
    legR: [-0.3 + Math.sin(t * 7.1 + member.phase) * 0.4, 0, 0.2],
    legL: [0.3 + Math.sin(t * 7.7 + member.phase) * 0.4, 0, -0.2],
  };
  return lerpPose(f, flail, p);
}

function clampPanic(v: number): number {
  return Math.min(1, Math.max(0, v));
}

export { keyedPose, poseFigure, lerpPose, idlePose, walkPose, floatPose, aimPose };

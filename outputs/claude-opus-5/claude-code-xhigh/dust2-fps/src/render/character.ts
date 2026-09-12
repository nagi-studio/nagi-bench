/**
 * 程序化人形角色：完全由代码搭骨架 + 盒子拼出来，没有任何外部模型。
 *
 * 骨架层级（模型默认朝 -Z）：
 *   root(yaw)
 *     hips
 *       spine ── chest/vest/neck
 *       │        ├ headPivot ── 头 / 面罩 / 头盔
 *       │        ├ shoulderL ── upperArm ── elbow ── forearm ── hand
 *       │        ├ shoulderR ── ...
 *       │        └ weaponMount ── 武器模型（所以枪永远跟着躯干和视角走）
 *       ├ legL ── thigh ── knee ── shin ── foot
 *       └ legR ── ...
 *
 * 动画全部是程序化的：走路摆腿、呼吸起伏、瞄准俯仰带动脊柱和头、
 * 蹲下压低重心、死亡向后倒地。
 */

import * as THREE from 'three';
import type { Team } from '../game/actor.ts';
import type { WeaponDef } from '../game/weapons.ts';
import { buildWeaponModel } from './weaponModel.ts';

const geoCache = new Map<string, THREE.BoxGeometry>();

function box(w: number, h: number, d: number): THREE.BoxGeometry {
  const key = `${w.toFixed(3)},${h.toFixed(3)},${d.toFixed(3)}`;
  let g = geoCache.get(key);
  if (!g) {
    g = new THREE.BoxGeometry(w, h, d);
    geoCache.set(key, g);
  }
  return g;
}

export interface TeamPalette {
  uniform: number;
  uniformDark: number;
  vest: number;
  gear: number;
  skin: number;
  glove: number;
  accent: number;
  boot: number;
}

export const PALETTES: Record<Team, TeamPalette> = {
  // 反恐精英：深蓝制服 + 深色头盔护目镜
  CT: {
    uniform: 0x36527a,
    uniformDark: 0x273b59,
    vest: 0x2c3f56,
    gear: 0x222c38,
    skin: 0xd7a67c,
    glove: 0x1d2731,
    accent: 0x4d9be6,
    boot: 0x1a1f26,
  },
  // 恐怖分子：土黄外套 + 橙红头巾
  T: {
    uniform: 0x8a6a3a,
    uniformDark: 0x6b5029,
    vest: 0x54402a,
    gear: 0x3d2f1e,
    skin: 0xc6935f,
    glove: 0x35281a,
    accent: 0xd2632a,
    boot: 0x2a2118,
  },
};

interface Mats {
  uniform: THREE.MeshLambertMaterial;
  uniformDark: THREE.MeshLambertMaterial;
  vest: THREE.MeshLambertMaterial;
  gear: THREE.MeshLambertMaterial;
  skin: THREE.MeshLambertMaterial;
  glove: THREE.MeshLambertMaterial;
  accent: THREE.MeshLambertMaterial;
  boot: THREE.MeshLambertMaterial;
  visor: THREE.MeshLambertMaterial;
}

const matCache = new Map<Team, Mats>();

function materials(team: Team): Mats {
  let m = matCache.get(team);
  if (!m) {
    const p = PALETTES[team];
    const lm = (c: number, extra?: THREE.MeshLambertMaterialParameters) =>
      new THREE.MeshLambertMaterial({ color: c, ...extra });
    m = {
      uniform: lm(p.uniform),
      uniformDark: lm(p.uniformDark),
      vest: lm(p.vest),
      gear: lm(p.gear),
      skin: lm(p.skin),
      glove: lm(p.glove),
      accent: lm(p.accent),
      boot: lm(p.boot),
      visor: new THREE.MeshLambertMaterial({ color: 0x11161c, emissive: 0x0a1520 }),
    };
    matCache.set(team, m);
  }
  return m;
}

function mesh(
  g: THREE.BoxGeometry,
  m: THREE.Material,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const mm = new THREE.Mesh(g, m);
  mm.position.set(x, y, z);
  mm.castShadow = true;
  mm.receiveShadow = false;
  return mm;
}

export interface Character {
  root: THREE.Group;
  hips: THREE.Group;
  spine: THREE.Group;
  headPivot: THREE.Group;
  shoulderL: THREE.Group;
  shoulderR: THREE.Group;
  elbowL: THREE.Group;
  elbowR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  kneeL: THREE.Group;
  kneeR: THREE.Group;
  weaponMount: THREE.Group;
  team: Team;
  /** 当前挂着的武器模型 */
  weaponId: string;
  weaponObj: THREE.Object3D | null;
}

const HIP_Y = 0.95;
const THIGH_LEN = 0.44;
const SHIN_LEN = 0.42;
const SHOULDER_Y = 0.38;
const UPPER_ARM = 0.3;
const FOREARM = 0.28;

export function createCharacter(team: Team): Character {
  const m = materials(team);

  const root = new THREE.Group();
  root.rotation.order = 'YXZ';

  const hips = new THREE.Group();
  hips.position.y = HIP_Y;
  root.add(hips);

  // ---- 躯干 ----
  const spine = new THREE.Group();
  hips.add(spine);

  spine.add(mesh(box(0.36, 0.2, 0.22), m.uniformDark, 0, 0.06, 0)); // 腰腹
  spine.add(mesh(box(0.42, 0.34, 0.24), m.uniform, 0, 0.28, 0)); // 胸腔
  spine.add(mesh(box(0.45, 0.26, 0.28), m.vest, 0, 0.27, 0)); // 防弹背心
  spine.add(mesh(box(0.2, 0.08, 0.3), m.gear, 0, 0.15, 0.0)); // 腰带装备
  // 肩甲，让轮廓更宽更像人
  spine.add(mesh(box(0.13, 0.12, 0.2), m.uniformDark, -0.235, SHOULDER_Y, 0));
  spine.add(mesh(box(0.13, 0.12, 0.2), m.uniformDark, 0.235, SHOULDER_Y, 0));
  // 队伍臂章
  spine.add(mesh(box(0.05, 0.09, 0.09), m.accent, -0.24, SHOULDER_Y - 0.12, 0.02));
  spine.add(mesh(box(0.05, 0.09, 0.09), m.accent, 0.24, SHOULDER_Y - 0.12, 0.02));
  // 脖子
  spine.add(mesh(box(0.11, 0.1, 0.11), m.skin, 0, 0.5, 0));

  // ---- 头 ----
  const headPivot = new THREE.Group();
  headPivot.position.y = 0.54;
  spine.add(headPivot);
  headPivot.add(mesh(box(0.22, 0.25, 0.23), m.skin, 0, 0.12, 0));
  if (team === 'CT') {
    // 头盔 + 护目镜
    headPivot.add(mesh(box(0.25, 0.13, 0.26), m.gear, 0, 0.22, 0));
    headPivot.add(mesh(box(0.245, 0.055, 0.06), m.visor, 0, 0.145, -0.1));
    headPivot.add(mesh(box(0.06, 0.06, 0.06), m.gear, 0.13, 0.19, -0.02));
  } else {
    // 头巾 + 面罩
    headPivot.add(mesh(box(0.235, 0.1, 0.245), m.accent, 0, 0.225, 0));
    headPivot.add(mesh(box(0.225, 0.11, 0.06), m.gear, 0, 0.07, -0.095));
    headPivot.add(mesh(box(0.06, 0.12, 0.1), m.accent, 0.11, 0.2, 0.1));
  }
  // 耳朵位置的小块，避免头是个完美方块
  headPivot.add(mesh(box(0.03, 0.07, 0.06), m.skin, -0.115, 0.11, 0.01));
  headPivot.add(mesh(box(0.03, 0.07, 0.06), m.skin, 0.115, 0.11, 0.01));

  // ---- 手臂 ----
  const makeArm = (side: number) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(0.235 * side, SHOULDER_Y, 0);
    spine.add(shoulder);
    shoulder.add(mesh(box(0.115, UPPER_ARM, 0.135), m.uniform, 0, -UPPER_ARM / 2, 0));
    const elbow = new THREE.Group();
    elbow.position.y = -UPPER_ARM;
    shoulder.add(elbow);
    elbow.add(mesh(box(0.1, FOREARM, 0.12), m.uniformDark, 0, -FOREARM / 2, 0));
    elbow.add(mesh(box(0.095, 0.1, 0.13), m.glove, 0, -FOREARM - 0.04, -0.015));
    return { shoulder, elbow };
  };
  const armL = makeArm(-1);
  const armR = makeArm(1);

  // ---- 腿 ----
  const makeLeg = (side: number) => {
    const leg = new THREE.Group();
    leg.position.set(0.105 * side, 0, 0);
    hips.add(leg);
    leg.add(mesh(box(0.165, THIGH_LEN, 0.185), m.uniform, 0, -THIGH_LEN / 2, 0));
    const knee = new THREE.Group();
    knee.position.y = -THIGH_LEN;
    leg.add(knee);
    knee.add(mesh(box(0.14, SHIN_LEN, 0.155), m.uniformDark, 0, -SHIN_LEN / 2, 0));
    knee.add(mesh(box(0.15, 0.09, 0.27), m.boot, 0, -SHIN_LEN - 0.04, -0.045));
    return { leg, knee };
  };
  const legL = makeLeg(-1);
  const legR = makeLeg(1);

  // ---- 武器挂点（挂在脊柱上，跟着瞄准俯仰一起动）----
  // 位置对齐到下面那套持枪姿势里右手大致所在的地方，
  // 这样看上去是"手握着枪"而不是"枪浮在身前"。
  const weaponMount = new THREE.Group();
  weaponMount.position.set(0.17, 0.24, -0.42);
  spine.add(weaponMount);

  // 摆出持枪姿势：右手握把、左手托护木（略高略前，因为枪管在握把上方）
  armR.shoulder.rotation.set(1.05, -0.12, -0.16);
  armR.elbow.rotation.set(0.5, 0, 0.1);
  armL.shoulder.rotation.set(1.28, 0.3, 0.34);
  armL.elbow.rotation.set(0.4, 0, -0.1);

  return {
    root,
    hips,
    spine,
    headPivot,
    shoulderL: armL.shoulder,
    shoulderR: armR.shoulder,
    elbowL: armL.elbow,
    elbowR: armR.elbow,
    legL: legL.leg,
    legR: legR.leg,
    kneeL: legL.knee,
    kneeR: legR.knee,
    weaponMount,
    team,
    weaponId: '',
    weaponObj: null,
  };
}

/** 换武器：把挂点上的模型换掉。 */
export function setCharacterWeapon(c: Character, def: WeaponDef | null): void {
  const id = def ? def.id : 'none';
  if (c.weaponId === id) return;
  c.weaponId = id;
  if (c.weaponObj) {
    c.weaponMount.remove(c.weaponObj);
    c.weaponObj = null;
  }
  if (!def) return;
  const model = buildWeaponModel(def, true);
  model.scale.setScalar(def.worldScale);
  c.weaponObj = model;
  c.weaponMount.add(model);
}

export interface CharacterPose {
  /** 水平速度 */
  speed: number;
  maxSpeed: number;
  animPhase: number;
  pitch: number;
  crouch: number;
  alive: boolean;
  /** 死亡后经过的秒数 */
  deathTime: number;
  time: number;
}

const IDLE_ARM_R = new THREE.Euler(1.05, -0.12, -0.16);
const IDLE_ARM_L = new THREE.Euler(1.28, 0.3, 0.34);

/** 每帧更新姿态。 */
export function poseCharacter(c: Character, p: CharacterPose): void {
  const moveAmt = Math.min(1, p.speed / Math.max(1.5, p.maxSpeed));

  if (!p.alive) {
    // 向后倒地：0.55 秒内躺平
    const t = Math.min(1, p.deathTime / 0.55);
    const ease = 1 - (1 - t) * (1 - t);
    c.root.rotation.x = -ease * Math.PI * 0.5;
    c.hips.position.y = HIP_Y - ease * 0.42;
    c.spine.rotation.x = ease * 0.25;
    c.legL.rotation.x = -0.25 * ease;
    c.legR.rotation.x = 0.2 * ease;
    c.kneeL.rotation.x = -0.5 * ease;
    c.kneeR.rotation.x = -0.3 * ease;
    c.shoulderL.rotation.set(0.4 - ease * 0.9, 0.3, 0.7 * ease + 0.34);
    c.shoulderR.rotation.set(0.4 - ease * 0.9, -0.12, -0.7 * ease - 0.16);
    c.headPivot.rotation.x = ease * 0.4;
    return;
  }

  c.root.rotation.x = 0;

  // 走路：双腿反相摆动，膝盖只向后弯
  const phase = p.animPhase;
  const swing = moveAmt * 0.72;
  const sinP = Math.sin(phase);
  const cosP = Math.cos(phase);
  c.legL.rotation.x = sinP * swing;
  c.legR.rotation.x = -sinP * swing;
  c.kneeL.rotation.x = -Math.max(0, -Math.sin(phase + 0.7)) * swing * 1.5 - 0.05;
  c.kneeR.rotation.x = -Math.max(0, Math.sin(phase - 0.7)) * swing * 1.5 - 0.05;

  // 蹲：压低重心 + 大腿抬起
  const crouch = p.crouch;
  const bobY = Math.abs(cosP) * 0.035 * moveAmt;
  c.hips.position.y = HIP_Y - crouch * 0.34 - bobY + Math.sin(p.time * 1.6) * 0.006;
  c.legL.rotation.x += crouch * 0.95;
  c.legR.rotation.x += crouch * 0.95;
  c.kneeL.rotation.x -= crouch * 1.55;
  c.kneeR.rotation.x -= crouch * 1.55;

  // 上半身：瞄准俯仰 + 走路时轻微扭动
  const lean = crouch * 0.22 + moveAmt * 0.08;
  c.spine.rotation.x = p.pitch * 0.55 + lean;
  c.spine.rotation.y = sinP * 0.06 * moveAmt;
  c.hips.rotation.y = -sinP * 0.07 * moveAmt;
  c.headPivot.rotation.x = p.pitch * 0.4;

  // 手臂：保持持枪姿势，叠加轻微摆动
  const armSway = sinP * 0.07 * moveAmt;
  c.shoulderR.rotation.set(IDLE_ARM_R.x - p.pitch * 0.35 + armSway, IDLE_ARM_R.y, IDLE_ARM_R.z);
  c.shoulderL.rotation.set(IDLE_ARM_L.x - p.pitch * 0.35 - armSway, IDLE_ARM_L.y, IDLE_ARM_L.z);
}

/** 让角色整体半透明（观战自己的尸体等场景用不到，这里给击杀高亮留口子）。 */
export function setCharacterVisible(c: Character, visible: boolean): void {
  c.root.visible = visible;
}

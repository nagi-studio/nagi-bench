// ============================================================================
// 类人角色 —— 纯几何体搭建：头/躯干/双臂/双腿 独立部件 + 骨骼动画
// ============================================================================
import * as THREE from 'three';
import type { Team, WeaponId } from '../types';

const SKIN = new THREE.MeshLambertMaterial({ color: 0xd9a066 });
const SKIN_DARK = new THREE.MeshLambertMaterial({ color: 0xc08a52 });
const T_TORSO = new THREE.MeshLambertMaterial({ color: 0xd9c08a });
const T_PANTS = new THREE.MeshLambertMaterial({ color: 0x5c5238 });
const T_VEST = new THREE.MeshLambertMaterial({ color: 0x8a7a45 });
const CT_TORSO = new THREE.MeshLambertMaterial({ color: 0x3f5d8f });
const CT_PANTS = new THREE.MeshLambertMaterial({ color: 0x2e3b52 });
const CT_VEST = new THREE.MeshLambertMaterial({ color: 0x24304a });
const BOOT = new THREE.MeshLambertMaterial({ color: 0x3a3024 });
const GUN_DARK = new THREE.MeshLambertMaterial({ color: 0x2b2b30 });
const GUN_WOOD = new THREE.MeshLambertMaterial({ color: 0x7a5c38 });
const GUN_METAL = new THREE.MeshLambertMaterial({ color: 0x4a4a52 });

export interface RigParts {
  root: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  weapon: THREE.Group;
  shadow: THREE.Mesh;
  namePlane: THREE.Mesh;
  mats: THREE.Material[];
  all: THREE.Object3D[];
}

function box(w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}

export function buildThirdPersonGun(id: WeaponId): THREE.Group {
  const g = new THREE.Group();
  const add = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number) => {
    g.add(box(w, h, d, mat, x, y, z));
  };
  switch (id) {
    case 'ak47':
      add(0.05, 0.07, 0.62, GUN_DARK, 0, 0, 0.1);           // 机匣
      add(0.045, 0.05, 0.24, GUN_WOOD, 0, 0.015, 0.42);     // 护木
      add(0.04, 0.03, 0.1, GUN_METAL, 0, 0.045, 0.56);      // 枪管
      add(0.06, 0.14, 0.05, GUN_WOOD, 0, -0.06, 0.02);      // 弯弹匣
      add(0.05, 0.08, 0.16, GUN_WOOD, 0, 0.0, -0.3);        // 枪托
      add(0.02, 0.05, 0.03, GUN_METAL, 0, 0.07, -0.05);     // 照门
      break;
    case 'm4a4':
      add(0.05, 0.07, 0.6, GUN_DARK, 0, 0, 0.08);
      add(0.045, 0.055, 0.22, GUN_DARK, 0, 0.01, 0.4);
      add(0.035, 0.03, 0.12, GUN_METAL, 0, 0.04, 0.54);
      add(0.06, 0.07, 0.05, GUN_DARK, 0, -0.05, 0.02);      // 弹匣
      add(0.05, 0.06, 0.14, GUN_DARK, 0, 0, -0.28);         // 枪托
      add(0.045, 0.035, 0.18, GUN_DARK, 0, 0.085, -0.06);   // 提把
      break;
    case 'awp':
      add(0.05, 0.06, 0.7, GUN_DARK, 0, 0, 0.05);
      add(0.04, 0.04, 0.34, GUN_METAL, 0, 0.02, 0.45);      // 长枪管
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 10), GUN_METAL);
      scope.rotation.x = Math.PI / 2;
      scope.position.set(0, 0.06, -0.1);
      g.add(scope);                                         // 瞄准镜
      add(0.05, 0.05, 0.06, GUN_DARK, 0, -0.04, -0.2);
      add(0.05, 0.07, 0.14, GUN_DARK, 0, 0, -0.33);         // 枪托
      break;
    case 'glock':
      add(0.04, 0.1, 0.2, GUN_DARK, 0, 0.02, 0.08);         // 套筒
      add(0.035, 0.09, 0.06, GUN_DARK, 0, -0.03, -0.02);    // 握把
      break;
    case 'usp':
      add(0.04, 0.1, 0.2, GUN_DARK, 0, 0.02, 0.08);
      const sil = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.12, 8), GUN_DARK);
      sil.rotation.x = Math.PI / 2;
      sil.position.set(0, 0.02, 0.2);
      g.add(sil);
      add(0.035, 0.09, 0.06, GUN_DARK, 0, -0.03, -0.02);
      break;
    case 'deagle':
      add(0.045, 0.09, 0.24, GUN_METAL, 0, 0.02, 0.06);     // 大套筒
      add(0.04, 0.1, 0.07, GUN_DARK, 0, -0.03, -0.03);
      break;
    case 'knife':
      add(0.025, 0.22, 0.06, GUN_METAL, 0, 0.08, 0.1);      // 刀刃
      add(0.03, 0.1, 0.05, GUN_DARK, 0, -0.05, 0.05);       // 刀柄
      break;
    case 'c4':
      add(0.22, 0.12, 0.3, GUN_DARK, 0, 0, 0.05);
      add(0.08, 0.05, 0.08, GUN_METAL, 0, 0.08, 0.05);
      break;
    default:
      add(0.05, 0.07, 0.5, GUN_DARK, 0, 0, 0.1);
  }
  return g;
}

export function buildCharacter(team: Team, name: string): RigParts {
  const root = new THREE.Group();
  const torsoMat = team === 'T' ? T_TORSO : CT_TORSO;
  const pantsMat = team === 'T' ? T_PANTS : CT_PANTS;
  const vestMat = team === 'T' ? T_VEST : CT_VEST;

  // 骨盆
  const pelvis = box(0.34, 0.22, 0.22, pantsMat, 0, 0.92, 0);
  // 躯干
  const torso = new THREE.Group();
  torso.position.set(0, 0.98, 0);
  torso.add(box(0.42, 0.5, 0.24, torsoMat, 0, 0.28, 0));
  torso.add(box(0.44, 0.24, 0.26, vestMat, 0, 0.26, 0));    // 战术背心
  root.add(pelvis);
  root.add(torso);
  // 头
  const head = new THREE.Group();
  head.position.set(0, 1.5, 0);
  head.add(box(0.24, 0.24, 0.24, SKIN, 0, 0.1, 0));
  if (team === 'CT') {
    head.add(box(0.26, 0.1, 0.26, CT_VEST, 0, 0.2, 0));     // 头盔
  } else {
    head.add(box(0.25, 0.07, 0.25, SKIN_DARK, 0, 0.2, 0));  // 头发
  }
  root.add(head);
  // 手臂
  const armL = new THREE.Group();
  armL.position.set(-0.27, 1.42, 0);
  armL.add(box(0.13, 0.32, 0.14, torsoMat, 0, -0.15, 0));
  const foreL = new THREE.Group();
  foreL.position.set(0, -0.3, 0);
  foreL.add(box(0.11, 0.3, 0.12, team === 'T' ? SKIN : torsoMat, 0, -0.13, 0));
  foreL.add(box(0.1, 0.09, 0.12, SKIN, 0, -0.3, 0));        // 手
  armL.add(foreL);
  const armR = armL.clone();
  armR.position.set(0.27, 1.42, 0);
  armL.rotation.x = -1.25;
  armR.rotation.x = -1.25;
  root.add(armL);
  root.add(armR);
  // 腿
  const legL = new THREE.Group();
  legL.position.set(-0.115, 0.9, 0);
  legL.add(box(0.17, 0.44, 0.18, pantsMat, 0, -0.2, 0));
  const shinL = new THREE.Group();
  shinL.position.set(0, -0.4, 0);
  shinL.add(box(0.14, 0.4, 0.16, pantsMat, 0, -0.16, 0));
  shinL.add(box(0.15, 0.1, 0.24, BOOT, 0, -0.36, 0.03));
  legL.add(shinL);
  const legR = legL.clone();
  legR.position.set(0.115, 0.9, 0);
  root.add(legL);
  root.add(legR);
  // 武器（持枪姿态，随朝向）
  const weapon = new THREE.Group();
  weapon.position.set(0.05, 1.32, 0.3);
  weapon.rotation.y = 0;
  root.add(weapon);

  // 阴影
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.42, 20),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  root.add(shadow);

  // 名字牌
  const namePlane = makeNameSprite(name, team);
  namePlane.position.set(0, 2.05, 0);
  root.add(namePlane);

  const mats = [torsoMat, pantsMat, vestMat, SKIN, SKIN_DARK, BOOT, GUN_DARK, GUN_WOOD, GUN_METAL];
  const all = [root, pelvis, torso, head, armL, armR, legL, legR, weapon];
  return { root, torso, head, armL, armR, legL, legR, weapon, shadow, namePlane, mats, all };
}

function makeNameSprite(name: string, team: Team): THREE.Mesh {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const w = ctx.measureText(name).width + 30;
  ctx.fillStyle = 'rgba(10,10,12,0.55)';
  ctx.fillRect((256 - w) / 2, 8, w, 46);
  ctx.fillStyle = team === 'T' ? '#f0c060' : '#7fa8e8';
  ctx.fillText(name, 128, 33);
  const tex = new THREE.CanvasTexture(c);
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(1.1, 0.28),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: true }),
  );
  m.renderOrder = 5;
  return m;
}

export function setWeaponOnRig(rig: RigParts, id: WeaponId) {
  // 清除旧武器
  while (rig.weapon.children.length > 0) {
    const c = rig.weapon.children[0];
    rig.weapon.remove(c);
    if (c instanceof THREE.Mesh) {
      c.geometry.dispose();
    }
  }
  const gun = buildThirdPersonGun(id);
  // 枪口朝 +z，微调使枪贴近手部
  gun.rotation.y = Math.PI; // 枪管朝向 -z（角色前方）
  rig.weapon.add(gun);
}

/** 姿态更新：aimYaw 世界朝向；walkPhase 步态相位；deathT >0 死亡倒地 */
export function updateRig(
  rig: RigParts,
  aimYaw: number,
  aimPitch: number,
  walkPhase: number,
  speedF: number,
  crouch: boolean,
  deathT: number,
  time: number,
) {
  const r = rig.root;
  if (deathT > 0) {
    const t = Math.min(1, deathT / 0.45);
    const ease = 1 - (1 - t) * (1 - t);
    r.rotation.x = -ease * 1.45;
    r.rotation.y = aimYaw;
    r.position.y = -ease * 0.18;
    return;
  }
  r.rotation.x = 0;
  r.rotation.y = aimYaw;
  const s = Math.sin(walkPhase);
  const c = Math.cos(walkPhase);
  const amp = Math.min(1, speedF) * 0.55;
  rig.legL.rotation.x = s * amp;
  rig.legR.rotation.x = -s * amp;
  const knee = Math.max(0, Math.sin(walkPhase + Math.PI / 2)) * amp * 0.7;
  rig.legL.children.forEach((ch) => { ch.rotation.x = -knee * 0.6; });
  rig.legR.children.forEach((ch) => { ch.rotation.x = knee * 0.6; });
  rig.armL.rotation.x = -1.25 + c * amp * 0.3;
  rig.armR.rotation.x = -1.25 - c * amp * 0.3;
  // 瞄准俯仰
  rig.torso.rotation.x = aimPitch * 0.55;
  rig.head.rotation.x = aimPitch * 0.8;
  // 呼吸浮动
  rig.torso.position.y = 0.98 + Math.sin(time * 2.1) * 0.008;
  if (crouch) {
    r.position.y = -0.35;
    rig.legL.rotation.x += 0.9;
    rig.legR.rotation.x += 0.9;
  } else {
    r.position.y = 0;
  }
}

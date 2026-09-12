// 程序化类人形角色与武器模型（three.js，无外部资产）
import * as THREE from 'three';
import { WeaponId } from './config';

export const SKIN = 0xd9b58f;
export const CT_BODY = 0x44556e;
export const CT_DARK = 0x2c3850;
export const T_BODY = 0xb08d57;
export const T_DARK = 0x8a6a40;

function box(w: number, h: number, d: number, color: number, mat?: THREE.MeshLambertMaterial): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat ?? new THREE.MeshLambertMaterial({ color }));
  m.castShadow = true;
  return m;
}

export interface Humanoid {
  group: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  foreL: THREE.Group;
  foreR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  shinL: THREE.Group;
  shinR: THREE.Group;
  weaponGroup: THREE.Group;
  weaponMeshes: Partial<Record<WeaponId, THREE.Group>>;
  bombMesh: THREE.Group;
  headlight: THREE.Mesh; // 头顶标记（可隐藏）
}

/** 构建一个阵营的人形（约 1.8m 高，持枪姿态） */
export function buildHumanoid(team: 'CT' | 'T'): Humanoid {
  const g = new THREE.Group();
  const body = team === 'CT' ? CT_BODY : T_BODY;
  const dark = team === 'CT' ? CT_DARK : T_DARK;
  const torsoMat = new THREE.MeshLambertMaterial({ color: body });
  const darkMat = new THREE.MeshLambertMaterial({ color: dark });
  const skinMat = new THREE.MeshLambertMaterial({ color: SKIN });
  const legMat = new THREE.MeshLambertMaterial({ color: dark });

  const torso = new THREE.Group();
  torso.position.set(0, 0.9, 0);
  g.add(torso);

  // 骨盆
  const pelvis = box(0.3, 0.2, 0.2, dark, darkMat);
  pelvis.position.y = 0.12;
  torso.add(pelvis);
  // 胸
  const chest = box(0.42, 0.42, 0.24, body, torsoMat);
  chest.position.y = 0.42;
  torso.add(chest);
  // 背心
  const vest = box(0.44, 0.2, 0.26, team === 'CT' ? 0x1f2a3d : 0x6b5230, darkMat);
  vest.position.y = 0.4;
  torso.add(vest);

  // 头
  const head = new THREE.Group();
  head.position.set(0, 0.72, 0);
  torso.add(head);
  const skull = box(0.24, 0.24, 0.24, SKIN, skinMat);
  skull.position.y = 0.13;
  head.add(skull);
  // 头盔 / 头巾
  if (team === 'CT') {
    const helmet = box(0.28, 0.14, 0.3, dark, darkMat);
    helmet.position.y = 0.29;
    head.add(helmet);
  } else {
    const band = box(0.26, 0.09, 0.26, 0x7a5c3a);
    band.position.y = 0.26;
    head.add(band);
    const knot = box(0.1, 0.1, 0.16, 0x7a5c3a);
    knot.position.set(0, 0.24, -0.18);
    head.add(knot);
  }

  // 手臂
  const armL = new THREE.Group();
  armL.position.set(-0.27, 0.62, 0);
  torso.add(armL);
  const upperL = box(0.1, 0.3, 0.12, body, torsoMat);
  upperL.position.y = -0.15;
  armL.add(upperL);
  const foreL = new THREE.Group();
  foreL.position.y = -0.3;
  armL.add(foreL);
  const foreLm = box(0.09, 0.28, 0.1, body, torsoMat);
  foreLm.position.y = -0.14;
  foreL.add(foreLm);
  const handL = box(0.08, 0.08, 0.08, SKIN, skinMat);
  handL.position.y = -0.3;
  foreL.add(handL);

  const armR = new THREE.Group();
  armR.position.set(0.27, 0.62, 0);
  torso.add(armR);
  const upperR = box(0.1, 0.3, 0.12, body, torsoMat);
  upperR.position.y = -0.15;
  armR.add(upperR);
  const foreR = new THREE.Group();
  foreR.position.y = -0.3;
  armR.add(foreR);
  const foreRm = box(0.09, 0.28, 0.1, body, torsoMat);
  foreRm.position.y = -0.14;
  foreR.add(foreRm);
  const handR = box(0.08, 0.08, 0.08, SKIN, skinMat);
  handR.position.y = -0.3;
  foreR.add(handR);

  // 腿
  const legL = new THREE.Group();
  legL.position.set(-0.11, 0.88, 0);
  g.add(legL);
  const thighL = box(0.13, 0.44, 0.14, dark, legMat);
  thighL.position.y = -0.22;
  legL.add(thighL);
  const shinL = new THREE.Group();
  shinL.position.y = -0.44;
  legL.add(shinL);
  const shinLm = box(0.11, 0.4, 0.12, dark, legMat);
  shinLm.position.y = -0.2;
  shinL.add(shinLm);
  const footL = box(0.11, 0.1, 0.24, dark, legMat);
  footL.position.set(0, -0.42, 0.06);
  shinL.add(footL);

  const legR = new THREE.Group();
  legR.position.set(0.11, 0.88, 0);
  g.add(legR);
  const thighR = box(0.13, 0.44, 0.14, dark, legMat);
  thighR.position.y = -0.22;
  legR.add(thighR);
  const shinR = new THREE.Group();
  shinR.position.y = -0.44;
  legR.add(shinR);
  const shinRm = box(0.11, 0.4, 0.12, dark, legMat);
  shinRm.position.y = -0.2;
  shinR.add(shinRm);
  const footR = box(0.11, 0.1, 0.24, dark, legMat);
  footR.position.set(0, -0.42, 0.06);
  shinR.add(footR);

  // 武器组（挂在胸口前方，随躯干朝向）
  const weaponGroup = new THREE.Group();
  weaponGroup.position.set(0.08, 0.42, 0.14);
  torso.add(weaponGroup);
  const weaponMeshes: Partial<Record<WeaponId, THREE.Group>> = {};
  for (const id of ['ak47', 'm4a4', 'awp', 'glock', 'usp', 'deagle'] as WeaponId[]) {
    const w = buildWorldWeapon(id);
    w.visible = false;
    weaponGroup.add(w);
    weaponMeshes[id] = w;
  }
  // 炸弹背包
  const bombMesh = buildBombModel();
  bombMesh.position.set(-0.12, 0.34, -0.16);
  bombMesh.visible = false;
  torso.add(bombMesh);

  const headlight = box(0.02, 0.02, 0.02, team === 'CT' ? 0x66aaff : 0xffaa44);
  headlight.position.set(0, 0.45, 0);
  headlight.visible = false;
  torso.add(headlight);

  // 默认持枪姿态：右手前伸托枪，左手托护木
  armR.rotation.x = -1.25;
  armL.rotation.x = -1.05;
  armL.rotation.z = 0.25;

  return {
    group: g, torso, head, armL, armR, foreL, foreR, legL, legR, shinL, shinR,
    weaponGroup, weaponMeshes, bombMesh, headlight,
  };
}

/** 世界中的武器模型（挂在人形手上） */
export function buildWorldWeapon(id: WeaponId): THREE.Group {
  const g = new THREE.Group();
  const metal = new THREE.MeshLambertMaterial({ color: 0x33383f });
  const dark = new THREE.MeshLambertMaterial({ color: 0x1c1f23 });
  const wood = new THREE.MeshLambertMaterial({ color: 0x8a5a34 });
  const green = new THREE.MeshLambertMaterial({ color: 0x3c4a3a });
  const mk = (w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    g.add(m);
    return m;
  };
  if (id === 'ak47') {
    mk(0.06, 0.09, 0.42, metal, 0, 0.02, -0.05);      // 机匣
    mk(0.05, 0.08, 0.16, wood, 0, -0.02, 0.2);        // 护木
    mk(0.06, 0.09, 0.16, wood, 0, -0.05, 0.28);       // 枪托
    mk(0.04, 0.1, 0.1, dark, 0, -0.08, 0.05);         // 弹匣（弯）
    mk(0.03, 0.03, 0.3, metal, 0, 0.07, -0.22);       // 枪管
    mk(0.035, 0.05, 0.04, dark, 0, 0.1, 0.02);        // 准星
  } else if (id === 'm4a4') {
    mk(0.06, 0.09, 0.4, metal, 0, 0.02, -0.04);
    mk(0.05, 0.08, 0.2, dark, 0, -0.02, 0.16);
    mk(0.05, 0.07, 0.2, dark, 0, -0.03, 0.26);
    mk(0.04, 0.12, 0.08, dark, 0, -0.09, 0.04);
    mk(0.03, 0.03, 0.3, metal, 0, 0.07, -0.2);
    mk(0.06, 0.05, 0.08, dark, 0, 0.12, -0.08);       // 提把
  } else if (id === 'awp') {
    mk(0.06, 0.09, 0.46, green, 0, 0.02, -0.02);
    mk(0.05, 0.08, 0.18, dark, 0, -0.02, 0.24);
    mk(0.03, 0.03, 0.4, metal, 0, 0.06, -0.28);
    mk(0.05, 0.05, 0.16, dark, 0, 0.11, -0.02);       // 瞄准镜
    mk(0.04, 0.08, 0.08, dark, 0, -0.07, 0.08);
  } else if (id === 'glock') {
    mk(0.05, 0.08, 0.2, dark, 0, 0.02, 0);
    mk(0.04, 0.04, 0.1, metal, 0, 0.06, -0.13);
    mk(0.05, 0.1, 0.06, dark, 0, -0.07, 0.03);
  } else if (id === 'usp') {
    mk(0.05, 0.08, 0.22, dark, 0, 0.02, 0);
    mk(0.04, 0.04, 0.12, metal, 0, 0.06, -0.14);
    mk(0.05, 0.1, 0.06, dark, 0, -0.07, 0.04);
  } else if (id === 'deagle') {
    mk(0.06, 0.09, 0.26, metal, 0, 0.02, 0);
    mk(0.05, 0.05, 0.14, metal, 0, 0.06, -0.16);
    mk(0.06, 0.12, 0.07, dark, 0, -0.08, 0.04);
  }
  g.rotation.x = -Math.PI / 2; // 朝前
  g.position.set(0.1, -0.06, 0.24);
  return g;
}

export function buildBombModel(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.22, 0.4),
    new THREE.MeshLambertMaterial({ color: 0x4a5a3a })
  );
  body.castShadow = true;
  g.add(body);
  const light = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.06, 0.06),
    new THREE.MeshLambertMaterial({ color: 0xff3333, emissive: 0xff2222, emissiveIntensity: 1 })
  );
  light.position.set(0.1, 0.08, 0.12);
  g.add(light);
  return g;
}

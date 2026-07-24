/**
 * 武器模型生成器：把 WEAPONS 表里的 parts 数据变成 three 的对象树。
 * 第一人称手持模型和第三人称挂载模型用的是同一份数据，
 * 所以新增武器只要写数据，不用碰渲染代码。
 */

import * as THREE from 'three';
import type { WeaponDef } from '../game/weapons.ts';

const geoCache = new Map<string, THREE.BoxGeometry>();
const matCache = new Map<string, THREE.MeshLambertMaterial>();

function boxGeo(w: number, h: number, d: number): THREE.BoxGeometry {
  const key = `${w},${h},${d}`;
  let g = geoCache.get(key);
  if (!g) {
    g = new THREE.BoxGeometry(w, h, d);
    geoCache.set(key, g);
  }
  return g;
}

function mat(color: number, metal: boolean): THREE.MeshLambertMaterial {
  const key = `${color}-${metal ? 1 : 0}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshLambertMaterial({
      color,
      emissive: metal ? 0x090a0c : 0x000000,
    });
    matCache.set(key, m);
  }
  return m;
}

/**
 * @param worldSpace 第三人称模型需要投射阴影，第一人称的不需要（还要关闭深度冲突）
 */
export function buildWeaponModel(def: WeaponDef, worldSpace: boolean): THREE.Group {
  const g = new THREE.Group();
  g.name = `weapon-${def.id}`;
  for (const part of def.parts) {
    const m = new THREE.Mesh(boxGeo(part.s[0], part.s[1], part.s[2]), mat(part.c, !!part.metal));
    m.position.set(part.p[0], part.p[1], part.p[2]);
    if (part.r) m.rotation.set(part.r[0], part.r[1], part.r[2]);
    m.castShadow = worldSpace;
    m.receiveShadow = false;
    g.add(m);
  }
  return g;
}

/** 第一人称视角的双手（前臂 + 手套），握在武器两侧。 */
export function buildViewHands(gloveColor: number, skinColor: number): THREE.Group {
  const g = new THREE.Group();
  const glove = new THREE.MeshLambertMaterial({ color: gloveColor });
  const sleeve = new THREE.MeshLambertMaterial({ color: skinColor });

  // 右手（握把）
  const rArm = new THREE.Mesh(boxGeo(0.085, 0.085, 0.34), sleeve);
  rArm.position.set(0.045, -0.09, 0.18);
  rArm.rotation.x = -0.25;
  g.add(rArm);
  const rHand = new THREE.Mesh(boxGeo(0.075, 0.1, 0.11), glove);
  rHand.position.set(0.02, -0.045, 0.03);
  g.add(rHand);

  // 左手（护木）
  const lArm = new THREE.Mesh(boxGeo(0.082, 0.082, 0.3), sleeve);
  lArm.position.set(-0.1, -0.13, 0.02);
  lArm.rotation.set(-0.75, 0.32, 0);
  g.add(lArm);
  const lHand = new THREE.Mesh(boxGeo(0.075, 0.09, 0.12), glove);
  lHand.position.set(-0.03, -0.03, -0.3);
  g.add(lHand);

  for (const c of g.children) {
    (c as THREE.Mesh).castShadow = false;
    (c as THREE.Mesh).receiveShadow = false;
  }
  return g;
}

/** 地上的 C4（已安放）模型，带闪烁红灯。 */
export function buildPlantedBomb(): { group: THREE.Group; light: THREE.Mesh } {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    boxGeo(0.3, 0.16, 0.2),
    new THREE.MeshLambertMaterial({ color: 0x2b2b2e }),
  );
  body.position.y = 0.08;
  body.castShadow = true;
  g.add(body);

  const panel = new THREE.Mesh(
    boxGeo(0.16, 0.08, 0.02),
    new THREE.MeshLambertMaterial({ color: 0x7a1414, emissive: 0x3a0808 }),
  );
  panel.position.set(0, 0.11, -0.1);
  g.add(panel);

  const light = new THREE.Mesh(
    boxGeo(0.05, 0.05, 0.05),
    new THREE.MeshBasicMaterial({ color: 0xff2b2b }),
  );
  light.position.set(0.09, 0.18, 0);
  g.add(light);

  const antenna = new THREE.Mesh(
    boxGeo(0.015, 0.22, 0.015),
    new THREE.MeshLambertMaterial({ color: 0xcccccc }),
  );
  antenna.position.set(-0.11, 0.22, 0);
  g.add(antenna);

  return { group: g, light };
}

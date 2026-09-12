import * as THREE from "three";
import { createFigure, voxelMaterial, type Figure } from "@agentbench/voxel-kit";

import {
  collectorBody,
  collectorClothes,
  crowdBody,
  spacesuitClothes,
  zhangBody,
  zhangCivilClothes,
  zhangSuitBareHand,
  zhangUniformClothes,
} from "./art/skins";
import { lifePackGeometry, magazineGeometry, phoneGeometry, pistolGeometry, scopeGeometry, teacupGeometry } from "./art/props";
import { voxMat } from "./lib/vox";

/**
 * 演员表。
 *
 * 每个人都是同一副骨架，只有身高和衣服不同 —— 这正是这套体素规格的意义：
 * 观众一眼就知道那三十个白色的人和瞄准镜后面的那个白色的人是同一种生物。
 */

export interface Cast {
  zhang: Figure;
  collector: Figure;
  /** 合影的与会者。前排正中三个是目标。 */
  crowd: Figure[];
  photographer: Figure;
  /** 章北海手上的道具，按需显隐。 */
  props: {
    teacup: THREE.Object3D;
    phone: THREE.Object3D;
    pistol: THREE.Object3D;
    scope: THREE.Object3D;
    /** 悬浮在面前的瞄准镜（还没装到枪上）。 */
    looseScope: THREE.Object3D;
    /** 击发瞬间照亮航天服的那一下。 */
    muzzleLight: THREE.PointLight;
    magazine: THREE.Object3D;
    muzzleFlash: THREE.Mesh;
  };
  costumes: {
    civil: THREE.Texture;
    uniform: THREE.Texture;
    suit: THREE.Texture;
    suitBareHand: THREE.Texture;
  };
  crowdVisor: {
    mirror: THREE.Texture[];
    clear: THREE.Texture[];
    hit: THREE.Texture[];
  };
  dispose(): void;
}

/** 前排正中的三个人 —— 全片唯一真正重要的三个陌生人。 */
export const TARGET_INDICES = [3, 4, 5];
export const CROWD_COUNT = 21;

export function buildCast(): Cast {
  const disposables: Array<{ dispose(): void }> = [];

  const zhangSkin = zhangBody();
  const civil = zhangCivilClothes();
  const uniform = zhangUniformClothes();
  const suit = spacesuitClothes({ visor: "mirror", accent: "#7fa8c8", seed: 9 });
  const suitBare = zhangSuitBareHand({ visor: "mirror", accent: "#7fa8c8", seed: 9 });

  const zhang = createFigure({ body: zhangSkin.texture, clothes: civil.texture, heightM: 1.82, arm: "classic" });
  zhang.root.visible = false;

  const collectorSkin = collectorBody();
  const collectorCoat = collectorClothes();
  const collector = createFigure({
    body: collectorSkin.texture,
    clothes: collectorCoat.texture,
    heightM: 1.71,
    arm: "classic",
  });
  collector.root.visible = false;

  // 合影群像：三种镀膜面罩、四张透明面罩后面的脸、两种被击中的面罩
  const accents = ["#c9a05a", "#8fb0c6", "#b98d8d"];
  const mirror = accents.map((accent, i) => spacesuitClothes({ visor: "mirror", accent, seed: 20 + i }).texture);
  const clear = [0, 1, 2, 3].map((face) =>
    spacesuitClothes({ visor: "clear", accent: accents[face % accents.length]!, face, seed: 30 + face }).texture,
  );
  const hit = [0, 1, 2].map((face) =>
    spacesuitClothes({ visor: "hit", accent: accents[face % accents.length]!, face, seed: 40 + face }).texture,
  );

  const packGeometry = lifePackGeometry(0.85);
  const packMaterial = voxelMaterial({ roughness: 0.9 });
  const crowd: Figure[] = [];
  for (let i = 0; i < CROWD_COUNT; i += 1) {
    const body = crowdBody(i);
    const figure = createFigure({
      body: body.texture,
      clothes: mirror[i % mirror.length]!,
      heightM: 1.68 + ((i * 7) % 11) * 0.018,
      arm: i % 4 === 0 ? "slim" : "classic",
      castShadow: false,
    });
    const pack = new THREE.Mesh(packGeometry, packMaterial);
    pack.position.set(0, 1.5, -2.2);
    figure.anchors.back.add(pack);
    crowd.push(figure);
  }

  const photographerSkin = crowdBody(31);
  const photographer = createFigure({
    body: photographerSkin.texture,
    clothes: spacesuitClothes({ visor: "mirror", accent: "#d9d4c4", seed: 55 }).texture,
    heightM: 1.75,
    castShadow: false,
  });
  const photographerPack = new THREE.Mesh(packGeometry, packMaterial);
  photographerPack.position.set(0, 1.5, -2.2);
  photographer.anchors.back.add(photographerPack);

  // 章北海背上的生命维持包
  const zhangPack = new THREE.Mesh(packGeometry, packMaterial);
  zhangPack.position.set(0, 1.5, -2.2);
  zhangPack.visible = false;
  zhang.anchors.back.add(zhangPack);

  // ── 手上的东西 ──────────────────────────────────────────────────────
  const propMat = voxMat("prop-steel", { roughness: 0.6, metalness: 0.35 });
  const porcelain = voxMat("porcelain", { roughness: 0.5 });

  const teacup = new THREE.Mesh(teacupGeometry(0.3), porcelain);
  teacup.position.set(0, -0.4, 1.4);
  teacup.rotation.x = -Math.PI / 2;
  teacup.visible = false;
  zhang.anchors.handR.add(teacup);

  const phone = new THREE.Mesh(phoneGeometry(0.28), propMat);
  phone.position.set(0, 0, 1.2);
  phone.rotation.z = 0.3;
  phone.visible = false;
  zhang.anchors.handR.add(phone);

  const pistol = new THREE.Mesh(pistolGeometry(0.36), propMat);
  pistol.position.set(0, 0, 0.6);
  pistol.visible = false;
  zhang.anchors.handR.add(pistol);

  const scope = new THREE.Mesh(scopeGeometry(0.32), propMat);
  scope.position.set(0, 1.9, 1.1);
  scope.visible = false;
  pistol.add(scope);

  const magazine = new THREE.Mesh(magazineGeometry(0.3), propMat);
  magazine.position.set(0, -0.2, 0.6);
  magazine.visible = false;
  zhang.anchors.handL.add(magazine);

  const looseScope = new THREE.Mesh(scopeGeometry(0.32), propMat);
  looseScope.visible = false;

  // 枪口闪光。道具挂在手上，所以尺寸也是 figure 的 px：4 px ≈ 0.22 m。
  const muzzleFlash = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshBasicMaterial({
      color: 0xffe6b0,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      fog: false,
    }),
  );
  muzzleFlash.position.set(0, 0, 4.2);
  muzzleFlash.visible = false;
  muzzleFlash.layers.enable(1);
  pistol.add(muzzleFlash);
  const muzzleLight = new THREE.PointLight(0xffdca8, 0, 3.2, 2);
  muzzleLight.position.set(0, 0, 4.0);
  pistol.add(muzzleLight);

  disposables.push(packGeometry, packMaterial, teacup.geometry, phone.geometry, pistol.geometry, scope.geometry, magazine.geometry, looseScope.geometry, muzzleFlash.geometry, muzzleFlash.material as THREE.Material);

  // 第 1 层 = "有人的地方"。太空里的反光补光只照这一层。
  for (const figure of [zhang, collector, photographer, ...crowd]) {
    figure.root.traverse((object) => object.layers.enable(1));
  }
  looseScope.layers.enable(1);

  return {
    zhang,
    collector,
    crowd,
    photographer,
    props: { teacup, phone, pistol, scope, looseScope, magazine, muzzleFlash, muzzleLight },
    costumes: {
      civil: civil.texture,
      uniform: uniform.texture,
      suit: suit.texture,
      suitBareHand: suitBare.texture,
    },
    crowdVisor: { mirror, clear, hit },
    dispose() {
      zhang.dispose();
      collector.dispose();
      photographer.dispose();
      for (const figure of crowd) figure.dispose();
      for (const item of disposables) item.dispose();
    },
  };
}

/** 让 zhang 背上的包在太空段落里出现。 */
export function showLifePack(cast: Cast, visible: boolean): void {
  cast.zhang.anchors.back.children.forEach((child) => {
    child.visible = visible;
  });
}

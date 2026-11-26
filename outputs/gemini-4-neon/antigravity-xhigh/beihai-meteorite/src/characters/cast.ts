import * as THREE from "three";
import { createFigure, type Figure } from "@agentbench/voxel-kit";
import type { CharacterSkins } from "./skins";
import {
  createEvaBackpackMesh,
  createKnifeMesh,
  createMagnifierMesh,
  createPhoneMesh,
  createPistolGroup,
  createPliersMesh,
  createScopeMesh,
  createSpaceCameraMesh,
  createTeacupMesh,
} from "../props/voxelProps";

export interface ZhangCast {
  figure: Figure;
  pistol: ReturnType<typeof createPistolGroup>;
  looseScope: THREE.Mesh;
  handTeacup: THREE.Mesh;
  handPhone: THREE.Mesh;
  handPliers: THREE.Mesh;
  handKnife: THREE.Mesh;
  evaBackpack: THREE.Mesh;
  setWardrobe(mode: "uniform" | "workshop" | "suit-gold" | "suit-open" | "suit-barehand"): void;
  hideAllHandProps(): void;
}

export interface CollectorCast {
  figure: Figure;
  magnifier: THREE.Mesh;
  handTeacup: THREE.Mesh;
}

export function createZhangCast(skins: CharacterSkins): ZhangCast {
  const figure = createFigure({
    body: skins.zhangBody.texture,
    clothes: skins.zhangUniform.texture,
    arm: "classic",
    heightM: 1.82,
    castShadow: true,
  });

  // Mount props strictly on figure.anchors!
  const pistol = createPistolGroup();
  pistol.group.visible = false;
  figure.anchors.handR.add(pistol.group);

  const looseScope = createScopeMesh(0.32);
  looseScope.position.set(0, 0.4, 1.3);
  looseScope.visible = false;
  figure.anchors.handR.add(looseScope);

  const handTeacup = createTeacupMesh(0.36);
  handTeacup.position.set(0, 0.25, 1.25);
  handTeacup.rotation.x = -Math.PI / 2;
  handTeacup.visible = false;
  figure.anchors.handR.add(handTeacup);

  const handPhone = createPhoneMesh(0.36);
  handPhone.position.set(0, 0.35, 1.2);
  handPhone.rotation.x = -0.35;
  handPhone.visible = false;
  figure.anchors.handR.add(handPhone);

  const handPliers = createPliersMesh(0.32);
  handPliers.position.set(0, 0.25, 1.35);
  handPliers.visible = false;
  figure.anchors.handR.add(handPliers);

  const handKnife = createKnifeMesh(0.32);
  handKnife.position.set(0, 0.2, 1.3);
  handKnife.visible = false;
  figure.anchors.handR.add(handKnife);

  const evaBackpack = createEvaBackpackMesh(0x29538c);
  evaBackpack.visible = false;
  figure.anchors.back.add(evaBackpack);

  const setWardrobe = (
    mode: "uniform" | "workshop" | "suit-gold" | "suit-open" | "suit-barehand",
  ) => {
    switch (mode) {
      case "uniform":
        figure.setClothes(skins.zhangUniform.texture);
        evaBackpack.visible = false;
        break;
      case "workshop":
        figure.setClothes(skins.zhangWorkshop.texture);
        evaBackpack.visible = false;
        break;
      case "suit-gold":
        figure.setClothes(skins.zhangSuitGold.texture);
        evaBackpack.visible = true;
        break;
      case "suit-open":
        figure.setClothes(skins.zhangSuitOpen.texture);
        evaBackpack.visible = true;
        break;
      case "suit-barehand":
        figure.setClothes(skins.zhangSuitBareHand.texture);
        evaBackpack.visible = true;
        break;
    }
  };

  const hideAllHandProps = () => {
    pistol.group.visible = false;
    looseScope.visible = false;
    handTeacup.visible = false;
    handPhone.visible = false;
    handPliers.visible = false;
    handKnife.visible = false;
  };

  return {
    figure,
    pistol,
    looseScope,
    handTeacup,
    handPhone,
    handPliers,
    handKnife,
    evaBackpack,
    setWardrobe,
    hideAllHandProps,
  };
}

export function createCollectorCast(skins: CharacterSkins): CollectorCast {
  const figure = createFigure({
    body: skins.collectorBody.texture,
    clothes: skins.collectorOutfit.texture,
    arm: "classic",
    heightM: 1.74,
    castShadow: true,
  });

  const magnifier = createMagnifierMesh(0.36);
  magnifier.position.set(0, 0.35, 1.25);
  figure.anchors.handR.add(magnifier);

  const handTeacup = createTeacupMesh(0.36);
  handTeacup.position.set(0, 0.25, 1.25);
  handTeacup.rotation.x = -Math.PI / 2;
  handTeacup.visible = false;
  figure.anchors.handL.add(handTeacup);

  return { figure, magnifier, handTeacup };
}

export interface OrbitalAstronaut {
  figure: Figure;
  role: "leaderA" | "leaderB" | "leaderC" | "bystanderHit" | "crew" | "photographer";
  row: number;
  col: number;
  seed: number;
  baseOffset: THREE.Vector3;
  cameraProp?: THREE.Mesh;
  setVisorAndFace(mode: "gold" | "open" | "hit" | "panic"): void;
}

/**
 * Assemble the 24-astronaut group photo formation outside Yellow River Space Station!
 * Every single figure is built strictly with `createFigure` from `@agentbench/voxel-kit`.
 */
export function createOrbitalPhotoCrew(skins: CharacterSkins): OrbitalAstronaut[] {
  const crew: OrbitalAstronaut[] = [];

  // 3 neat zero-G rows (8 astronauts per row = 24, plus 1 floating photographer = 25!)
  // Front row center indices 3, 4, 5 are the 3 high-level aerospace Targets (B, A, C)!
  const rowCounts = [8, 8, 7];
  let idx = 0;

  for (let row = 0; row < rowCounts.length; row++) {
    const count = rowCounts[row]!;
    for (let col = 0; col < count; col++) {
      const centeredCol = col - (count - 1) / 2;
      let role: OrbitalAstronaut["role"] = "crew";
      let normalBody = skins.colleagueBodies[idx % skins.colleagueBodies.length]!.texture;
      let shockedBody = skins.colleagueShockedBodies[idx % skins.colleagueShockedBodies.length]!.texture;
      let suitGold = skins.crewSuitsGold[idx % skins.crewSuitsGold.length]!.texture;
      let suitOpen = skins.crewSuitsOpen[idx % skins.crewSuitsOpen.length]!.texture;
      let suitHit = skins.crewSuitDamaged.texture;
      let accentHex = [0x336ba8, 0x2f827c, 0xb37e32][idx % 3]!;
      let heightM = 1.72 + ((idx * 37) % 13) * 0.01;

      if (row === 0 && col === 3) {
        role = "leaderB";
        normalBody = skins.leaderBBody.texture;
        shockedBody = skins.leaderBShockedBody.texture;
        suitGold = skins.leaderSuitGold.texture;
        suitOpen = skins.leaderSuitOpen.texture;
        suitHit = skins.leaderSuitShattered.texture;
        accentHex = 0xb83530;
        heightM = 1.78;
      } else if (row === 0 && col === 4) {
        role = "leaderA";
        normalBody = skins.leaderABody.texture;
        shockedBody = skins.leaderAShockedBody.texture;
        suitGold = skins.leaderSuitGold.texture;
        suitOpen = skins.leaderSuitOpen.texture;
        suitHit = skins.leaderSuitShattered.texture;
        accentHex = 0xb83530;
        heightM = 1.8;
      } else if (row === 0 && col === 5) {
        role = "leaderC";
        normalBody = skins.leaderCBody.texture;
        shockedBody = skins.leaderCShockedBody.texture;
        suitGold = skins.leaderSuitGold.texture;
        suitOpen = skins.leaderSuitOpen.texture;
        suitHit = skins.leaderSuitShattered.texture;
        accentHex = 0xb83530;
        heightM = 1.76;
      } else if ((row === 1 && col === 4) || (row === 0 && col === 2)) {
        // Two intentionally clipped bystanders (per source: 5 struck total to look like a meteor shower!)
        role = "bystanderHit";
      }

      const fig = createFigure({
        body: normalBody,
        clothes: suitGold,
        arm: idx % 4 === 1 ? "slim" : "classic",
        heightM,
        castShadow: false,
      });
      fig.anchors.back.add(createEvaBackpackMesh(accentHex));

      const baseOffset = new THREE.Vector3(
        centeredCol * 1.48,
        row * 1.25 - 0.8 + ((idx % 3) - 1) * 0.14,
        -row * 1.55,
      );

      const entry: OrbitalAstronaut = {
        figure: fig,
        role,
        row,
        col,
        seed: idx + 1,
        baseOffset,
        setVisorAndFace(mode) {
          if (mode === "gold") {
            fig.setBody(normalBody);
            fig.setClothes(suitGold);
          } else if (mode === "open") {
            fig.setBody(normalBody);
            fig.setClothes(suitOpen);
          } else if (mode === "hit") {
            fig.setBody(shockedBody);
            fig.setClothes(suitHit);
          } else {
            fig.setBody(shockedBody);
            fig.setClothes(suitOpen);
          }
        },
      };
      crew.push(entry);
      idx++;
    }
  }

  // Add the floating Photographer facing the group!
  const photoNormal = skins.colleagueBodies[0]!.texture;
  const photoShocked = skins.colleagueShockedBodies[0]!.texture;
  const photoGold = skins.crewSuitsGold[2]!.texture;
  const photoOpen = skins.crewSuitsOpen[2]!.texture;
  const photoFig = createFigure({
    body: photoNormal,
    clothes: photoGold,
    arm: "classic",
    heightM: 1.76,
    castShadow: false,
  });
  photoFig.anchors.back.add(createEvaBackpackMesh(0xb37e32));
  const camProp = createSpaceCameraMesh(0.45);
  photoFig.anchors.handR.add(camProp);

  crew.push({
    figure: photoFig,
    role: "photographer",
    row: -1,
    col: 0,
    seed: 99,
    baseOffset: new THREE.Vector3(0.4, 0.2, 6.2),
    cameraProp: camProp,
    setVisorAndFace(mode) {
      if (mode === "gold") {
        photoFig.setBody(photoNormal);
        photoFig.setClothes(photoGold);
      } else if (mode === "panic") {
        photoFig.setBody(photoShocked);
        photoFig.setClothes(photoOpen);
      } else {
        photoFig.setBody(photoNormal);
        photoFig.setClothes(photoOpen);
      }
    },
  });

  return crew;
}

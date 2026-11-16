import * as THREE from "three";
import { createFigure, type Figure } from "@agentbench/voxel-kit";
import {
  zhangBody, zhangCivilian, zhangSuit, suitGeneric, suitCracked,
  collectorBody, collectorClothes, changBody, changClothes,
  extraBody, targetBody,
} from "./skins";

export interface Cast {
  civilian: Figure;
  collector: Figure;
  chang: Figure;
  suitZhang: Figure;
  delegates: Figure[];      // 30; indices 0,1,2 are the three targets
  tex: {
    zhangDown: THREE.Texture; zhangUp: THREE.Texture; zhangGloveOff: THREE.Texture;
    suitDown: THREE.Texture; suitUp: THREE.Texture; suitCracked: THREE.Texture;
    rankDown: THREE.Texture; rankUp: THREE.Texture;
  };
}

export function buildCast(): Cast {
  const body = zhangBody();
  const civilian = createFigure({ body: body.texture, clothes: zhangCivilian().texture, heightM: 1.82 });
  const collector = createFigure({ body: collectorBody().texture, clothes: collectorClothes().texture, heightM: 1.72 });
  const chang = createFigure({ body: changBody().texture, clothes: changClothes().texture, heightM: 1.78 });

  const zhangDown = zhangSuit("down").texture;
  const zhangUp = zhangSuit("up").texture;
  const zhangGloveOff = zhangSuit("up", true).texture;
  const suitZhang = createFigure({ body: body.texture, clothes: zhangDown, heightM: 1.82 });

  const suitDown = suitGeneric("down").texture;
  const suitUp = suitGeneric("up").texture;
  const suitCrackedTex = suitCracked().texture;
  const rankDown = suitGeneric("down", true).texture;
  const rankUp = suitGeneric("up", true).texture;

  const delegates: Figure[] = [];
  for (let i = 0; i < 30; i++) {
    const isTarget = i < 3;
    const b = isTarget ? targetBody(i) : extraBody(i - 3);
    const h = isTarget ? 1.78 + i * 0.02 : 1.66 + ((i * 37) % 18) * 0.01;
    const fig = createFigure({
      body: b.texture,
      clothes: isTarget ? rankDown : suitDown,
      heightM: h,
      castShadow: false,
    });
    delegates.push(fig);
  }

  return {
    civilian, collector, chang, suitZhang, delegates,
    tex: { zhangDown, zhangUp, zhangGloveOff, suitDown, suitUp, suitCracked: suitCrackedTex, rankDown, rankUp },
  };
}

/** Convenience: reparent a figure root into a group and place it. */
export function place(fig: Figure, parent: THREE.Object3D, pos: [number, number, number], rotY = 0): void {
  fig.root.removeFromParent();
  parent.add(fig.root);
  fig.root.position.set(pos[0], pos[1], pos[2]);
  fig.root.rotation.set(0, rotY, 0);
}

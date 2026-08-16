import * as THREE from "three";
import { createFigure, type Figure } from "@agentbench/voxel-kit";
import {
  zhangBody,
  zhangUniform,
  zhangSpaceSuit,
  collectorBody,
  collectorClothes,
  genericBody,
  crewSuit,
  crewSuitHit,
} from "./skins";

export interface Cast {
  zhang: Figure;
  collector: Figure;
  /** Three assassination targets, front-row figures in the group photo. */
  targets: Figure[];
  /** Anonymous crew for the group photo and crowd. */
  crew: Figure[];
  /** Shared normal suit texture for the three targets. */
  targetSuit: THREE.Texture;
}

const CREW_ACCENTS = ["#c8873a", "#7fa8c9", "#8fbf8f", "#c9a24a", "#a77fb5"];

export function createCast(): Cast {
  const zhang = createFigure({
    body: zhangBody().texture,
    clothes: zhangUniform().texture,
    heightM: 1.82,
  });
  zhang.root.name = "zhang";

  const collector = createFigure({
    body: collectorBody().texture,
    clothes: collectorClothes().texture,
    heightM: 1.7,
  });
  collector.root.name = "collector";

  const targetSuit = crewSuit("#c8873a").texture;

  const targets: Figure[] = [];
  for (let i = 0; i < 3; i++) {
    const f = createFigure({
      body: genericBody().texture,
      clothes: targetSuit,
      heightM: 1.76 + i * 0.02,
    });
    f.root.name = `target-${i}`;
    targets.push(f);
  }

  const crew: Figure[] = [];
  for (let i = 0; i < 14; i++) {
    const f = createFigure({
      body: genericBody().texture,
      clothes: crewSuit(CREW_ACCENTS[(i + 1) % CREW_ACCENTS.length]).texture,
      heightM: 1.68 + (i % 5) * 0.03,
    });
    f.root.name = `crew-${i}`;
    crew.push(f);
  }

  return { zhang, collector, targets, crew, targetSuit };
}

/** The hit visor texture, applied to a target at the moment of impact. */
export function hitTexture(): ReturnType<typeof crewSuitHit>["texture"] {
  return crewSuitHit().texture;
}

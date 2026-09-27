import * as THREE from "three";
import {
  createFigure,
  createSkin,
  type Figure,
  type SkinPainter,
} from "@agentbench/voxel-kit";

export interface FaceSpec {
  skin: string;
  shadow: string;
  hair: string;
  brow: string;
  mouth: string;
  blush: string;
  browRow: number;
  longHair?: boolean;
  older?: boolean;
  smile?: boolean;
}

export const ZHANG_FACE: FaceSpec = {
  skin: "#c49672",
  shadow: "#a67c58",
  hair: "#14110e",
  brow: "#100e0c",
  mouth: "#6e4038",
  blush: "#b18468",
  browRow: 3,
};

export const COLLECTOR_FACE: FaceSpec = {
  skin: "#e2bc9c",
  shadow: "#c49878",
  hair: "#d4cfc4",
  brow: "#8d8880",
  mouth: "#a85c54",
  blush: "#c98478",
  browRow: 2,
  older: true,
  smile: true,
};

export const CREW_FACES: FaceSpec[] = [
  { skin: "#d2a888", shadow: "#b08868", hair: "#ded8d0", brow: "#6e6862", mouth: "#8a5148", blush: "#c09078", browRow: 3, older: true },
  { skin: "#c89878", shadow: "#a07858", hair: "#f2efe8", brow: "#9a948c", mouth: "#7d4840", blush: "#b88870", browRow: 3, older: true },
  { skin: "#d8b090", shadow: "#b89070", hair: "#8a8680", brow: "#3a342e", mouth: "#8a5148", blush: "#c49880", browRow: 3, older: true },
  { skin: "#d0a07c", shadow: "#b08060", hair: "#1c140f", brow: "#1a120e", mouth: "#8d5348", blush: "#c08868", browRow: 3 },
  { skin: "#e0b090", shadow: "#c08868", hair: "#2a1814", brow: "#2a1814", mouth: "#a05858", blush: "#d09078", browRow: 2, longHair: true },
  { skin: "#c89870", shadow: "#a07858", hair: "#16120e", brow: "#120e0c", mouth: "#7a453c", blush: "#b08060", browRow: 3 },
  { skin: "#e6c0a4", shadow: "#c89878", hair: "#3a241c", brow: "#2a1814", mouth: "#a06058", blush: "#d09880", browRow: 2, longHair: true },
  { skin: "#c09070", shadow: "#a07050", hair: "#10100e", brow: "#10100e", mouth: "#7a4038", blush: "#b07858", browRow: 3 },
  { skin: "#d8b090", shadow: "#b88868", hair: "#4a3028", brow: "#3a241c", mouth: "#8d5348", blush: "#c89078", browRow: 3 },
  { skin: "#e0b898", shadow: "#c09878", hair: "#1a1412", brow: "#1a1412", mouth: "#955048", blush: "#c88870", browRow: 3 },
  { skin: "#d0a484", shadow: "#b08464", hair: "#2a2018", brow: "#1c140f", mouth: "#8a4e44", blush: "#c08868", browRow: 3 },
];

export const CREW_ACCENTS = [
  "#c6a15a",
  "#d7c48a",
  "#c6a15a",
  "#6ea0c8",
  "#d07070",
  "#7d8a72",
  "#d07070",
  "#6ea0c8",
  "#c6a15a",
  "#7d8a72",
  "#d7c48a",
];

function paintFace(paint: SkinPainter, spec: FaceSpec, blink: boolean, shout: boolean): void {
  for (const part of ["head", "torso", "armR", "armL", "legR", "legL"] as const) {
    paint.fill(part, "all", spec.skin);
  }
  paint.rect("torso", "front", 2, 2, 4, 6, spec.shadow);
  paint.fill("head", "top", spec.hair);
  paint.fill("head", "back", spec.hair);
  const side = spec.longHair ? 7 : 4;
  paint.rect("head", "left", 0, 0, 8, side, spec.hair);
  paint.rect("head", "right", 0, 0, 8, side, spec.hair);
  paint.rect("head", "front", 0, 0, 8, 2, spec.hair);
  if (spec.longHair) {
    paint.rect("head", "front", 0, 2, 1, 4, spec.hair);
    paint.rect("head", "front", 7, 2, 1, 4, spec.hair);
  } else {
    paint.rect("head", "front", 0, 2, 1, 2, spec.hair);
    paint.rect("head", "front", 7, 2, 1, 2, spec.hair);
  }
  paint.rect("head", "front", 1, spec.browRow, 2, 1, spec.brow);
  paint.rect("head", "front", 5, spec.browRow, 2, 1, spec.brow);
  if (blink) {
    paint.rect("head", "front", 1, 4, 2, 1, spec.shadow);
    paint.rect("head", "front", 5, 4, 2, 1, spec.shadow);
  } else {
    paint.px("head", "front", 1, 4, "#f3f0e8");
    paint.px("head", "front", 2, 4, "#1a140f");
    paint.px("head", "front", 5, 4, "#1a140f");
    paint.px("head", "front", 6, 4, "#f3f0e8");
  }
  if (spec.older) {
    paint.px("head", "front", 1, 5, spec.shadow);
    paint.px("head", "front", 2, 5, spec.shadow);
    paint.px("head", "front", 5, 5, spec.shadow);
    paint.px("head", "front", 6, 5, spec.shadow);
  }
  paint.px("head", "front", 3, 5, spec.shadow);
  paint.px("head", "front", 4, 5, spec.shadow);
  if (shout) {
    paint.rect("head", "front", 2, 6, 4, 2, "#3a1218");
    paint.rect("head", "front", 3, 6, 2, 1, "#e7c2bc");
  } else if (spec.smile) {
    paint.px("head", "front", 2, 6, spec.mouth);
    paint.px("head", "front", 5, 6, spec.mouth);
    paint.px("head", "front", 3, 6, spec.blush);
    paint.px("head", "front", 4, 6, spec.blush);
  } else {
    paint.rect("head", "front", 3, 6, 2, 1, spec.mouth);
  }
  paint.px("head", "left", 1, 4, spec.shadow);
  paint.px("head", "right", 6, 4, spec.shadow);
  for (const face of ["front", "back", "left", "right"] as const) {
    paint.rect("armR", face, 0, 8, 4, 4, "#a9b6c2");
  }
  paint.rect("armR", "bottom", 0, 0, 4, 4, "#93a2ae");
}

function paintUniform(paint: SkinPainter): void {
  const cloth = "#1c2834";
  const deep = "#141c26";
  paint.fill("torso", "all", cloth);
  paint.rect("torso", "front", 0, 0, 8, 2, "#243444");
  paint.rect("torso", "front", 1, 2, 1, 7, "#2a3a4a");
  paint.rect("torso", "front", 6, 2, 1, 7, "#2a3a4a");
  paint.rect("torso", "front", 3, 4, 2, 1, "#8a7044");
  paint.rect("torso", "front", 2, 10, 4, 2, "#3a3428");
  paint.fill("armR", "all", cloth);
  paint.fill("armL", "all", cloth);
  for (const arm of ["armR", "armL"] as const) {
    for (const face of ["front", "back", "left", "right"] as const) {
      paint.rect(arm, face, 0, 10, 4, 2, deep);
    }
  }
  paint.fill("legR", "all", "#18222c");
  paint.fill("legL", "all", "#18222c");
  for (const leg of ["legR", "legL"] as const) {
    for (const face of ["front", "back", "left", "right"] as const) {
      paint.rect(leg, face, 0, 9, 4, 3, "#101318");
    }
  }
  paint.clear("head");
  paint.grain("torso", "all", 0.07, 4);
  paint.grain("armR", "all", 0.05, 6);
  paint.grain("armL", "all", 0.05, 8);
}

function paintCardigan(paint: SkinPainter): void {
  const wool = "#6e4c34";
  const shirt = "#eadcc8";
  paint.fill("torso", "all", wool);
  paint.rect("torso", "front", 3, 0, 2, 6, shirt);
  paint.rect("torso", "front", 2, 0, 4, 2, shirt);
  paint.px("torso", "front", 3, 4, "#6a3030");
  paint.px("torso", "front", 3, 6, "#6a3030");
  paint.fill("armR", "all", wool);
  paint.fill("armL", "all", wool);
  for (const arm of ["armR", "armL"] as const) {
    paint.rect(arm, "front", 0, 10, 4, 2, shirt);
    paint.rect(arm, "back", 0, 10, 4, 2, shirt);
  }
  paint.fill("legR", "all", "#3e342c");
  paint.fill("legL", "all", "#3e342c");
  for (const leg of ["legR", "legL"] as const) {
    for (const face of ["front", "back", "left", "right"] as const) {
      paint.rect(leg, face, 0, 10, 4, 2, "#1c1612");
    }
  }
  paint.clear("head");
  paint.grain("torso", "all", 0.12, 9);
  paint.grain("armR", "all", 0.1, 3);
}

export type Visor = "gold" | "clear" | "crack";

export function paintSuit(paint: SkinPainter, accent: string, visor: Visor, gloveOn: boolean): void {
  const white = "#e6e2d8";
  const navy = "#1b2740";
  paint.fill("torso", "all", white);
  paint.fill("torso", "left", navy);
  paint.fill("torso", "right", navy);
  paint.rect("torso", "front", 1, 2, 6, 6, "#d9d5cb");
  paint.rect("torso", "front", 2, 3, 1, 2, accent);
  paint.rect("torso", "front", 5, 4, 1, 1, "#8a3030");
  paint.rect("torso", "front", 3, 9, 2, 1, "#2a3038");
  paint.rect("torso", "back", 2, 3, 4, 5, "#c9c5bb");
  for (const arm of ["armR", "armL"] as const) {
    paint.fill(arm, "all", white);
    paint.rect(arm, "front", 0, 0, 4, 3, navy);
    paint.rect(arm, "back", 0, 0, 4, 3, navy);
    for (const face of ["front", "back", "left", "right"] as const) {
      paint.rect(arm, face, 0, 8, 4, 4, "#c8c4ba");
    }
    paint.rect(arm, "bottom", 0, 0, 4, 4, "#8e8b84");
  }
  if (!gloveOn) {
    for (const face of ["front", "back", "left", "right"] as const) {
      paint.erase("armR", face, 0, 7, 4, 5);
    }
    paint.erase("armR", "bottom", 0, 0, 4, 4);
  }
  for (const leg of ["legR", "legL"] as const) {
    paint.fill(leg, "all", white);
    for (const face of ["front", "back", "left", "right"] as const) {
      paint.rect(leg, face, 0, 9, 4, 3, "#2a3038");
    }
    paint.rect(leg, "bottom", 0, 0, 4, 4, "#1c2026");
  }
  paint.fill("head", "all", white);
  paint.rect("head", "top", 1, 1, 6, 6, "#d5dbe3");
  const gold = "#c6a15a";
  paint.rect("head", "front", 0, 2, 8, 5, gold);
  paint.rect("head", "left", 0, 3, 8, 3, gold);
  paint.rect("head", "right", 0, 3, 8, 3, gold);
  if (visor === "gold") {
    paint.rect("head", "front", 1, 3, 6, 3, "#8a7040");
    paint.rect("head", "front", 2, 3, 4, 2, "#2a261e");
    paint.px("head", "front", 2, 3, "#f2ead4");
  } else if (visor === "clear") {
    paint.erase("head", "front", 1, 3, 6, 4);
  } else {
    paint.rect("head", "front", 1, 3, 6, 4, "#14181e");
    paint.px("head", "front", 2, 3, "#e8eef2");
    paint.px("head", "front", 3, 4, "#f4f7fa");
    paint.px("head", "front", 4, 3, "#e8eef2");
    paint.px("head", "front", 4, 5, "#d5dde4");
    paint.px("head", "front", 5, 4, "#e8eef2");
    paint.px("head", "front", 3, 5, "#8e1e22");
    paint.px("head", "front", 4, 4, "#a32028");
    paint.px("head", "front", 2, 5, "#6e141c");
    paint.px("head", "front", 5, 6, "#8e1e22");
  }
  paint.rect("head", "bottom", 2, 2, 4, 4, "#2c3138");
  paint.grain("torso", "all", 0.05, 2);
  paint.grain("head", ["left", "right", "top"], 0.04, 5);
}

function skinOf(draw: (paint: SkinPainter) => void, transparent = false) {
  return createSkin(draw, { transparent });
}

export interface Cast {
  zhangBody: ReturnType<typeof createSkin>;
  collectorBody: ReturnType<typeof createSkin>;
  zhang: Figure;
  zhangSpace: Figure;
  collector: Figure;
  uniform: THREE.Texture;
  suitOn: THREE.Texture;
  suitOff: THREE.Texture;
  cardigan: THREE.Texture;
}

export function createCast(): Cast {
  const zhangBody = skinOf((paint) => paintFace(paint, ZHANG_FACE, false, false));
  const collectorBody = skinOf((paint) => paintFace(paint, COLLECTOR_FACE, false, false));
  const uniform = skinOf(paintUniform, true);
  const cardigan = skinOf(paintCardigan, true);
  const suitOn = skinOf((paint) => paintSuit(paint, "#c6a15a", "clear", true), true);
  const suitOff = skinOf((paint) => paintSuit(paint, "#c6a15a", "clear", false), true);
  const zhang = createFigure({
    body: zhangBody.texture,
    clothes: uniform.texture,
    heightM: 1.84,
  });
  const zhangSpace = createFigure({
    body: zhangBody.texture,
    clothes: suitOn.texture,
    heightM: 1.84,
  });
  const collector = createFigure({
    body: collectorBody.texture,
    clothes: cardigan.texture,
    heightM: 1.68,
  });
  zhang.root.name = "zhang";
  zhangSpace.root.name = "zhang-suit";
  collector.root.name = "collector";
  return {
    zhangBody,
    collectorBody,
    zhang,
    zhangSpace,
    collector,
    uniform: uniform.texture,
    suitOn: suitOn.texture,
    suitOff: suitOff.texture,
    cardigan: cardigan.texture,
  };
}

let zhangBlink = false;
let collectorBlink = false;

export function tickFaces(cast: Cast, time: number): void {
  const zClosed = time % 4.7 > 4.52;
  if (zClosed !== zhangBlink) {
    zhangBlink = zClosed;
    cast.zhangBody.repaint((paint) => paintFace(paint, ZHANG_FACE, zClosed, false));
  }
  const cClosed = (time + 1.8) % 5.4 > 5.22;
  if (cClosed !== collectorBlink) {
    collectorBlink = cClosed;
    cast.collectorBody.repaint((paint) => paintFace(paint, COLLECTOR_FACE, cClosed, false));
  }
}

export interface CrewLook {
  calm: THREE.Texture;
  shout: THREE.Texture;
  gold: THREE.Texture;
  clear: THREE.Texture;
  crack: THREE.Texture;
}

export function createCrewLook(index: number): CrewLook {
  const spec = CREW_FACES[index] ?? CREW_FACES[0]!;
  const accent = CREW_ACCENTS[index] ?? "#c6a15a";
  const calm = skinOf((paint) => paintFace(paint, spec, false, false));
  const shout = skinOf((paint) => paintFace(paint, spec, false, true));
  const gold = skinOf((paint) => paintSuit(paint, accent, "gold", true), true);
  const clear = skinOf((paint) => paintSuit(paint, accent, "clear", true), true);
  const crack = skinOf((paint) => paintSuit(paint, accent, "crack", true), true);
  return {
    calm: calm.texture,
    shout: shout.texture,
    gold: gold.texture,
    clear: clear.texture,
    crack: crack.texture,
  };
}

export function makeCrewFigure(index: number, look: CrewLook, height: number): Figure {
  return createFigure({
    body: look.calm,
    clothes: look.gold,
    heightM: height,
  });
}

export const CREW_HEIGHTS = [1.74, 1.7, 1.78, 1.82, 1.66, 1.86, 1.64, 1.8, 1.76, 1.83, 1.77];

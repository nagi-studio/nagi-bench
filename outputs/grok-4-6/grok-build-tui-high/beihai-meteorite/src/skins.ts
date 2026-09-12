import { createSkin, type Skin, type SkinPainter } from "@agentbench/voxel-kit";

export type FaceMood = "stern" | "calm" | "smile" | "soft";

export interface FaceSpec {
  skin: string;
  hair: string;
  brow: string;
  eye: string;
  iris: string;
  pupil: string;
  lip: string;
  cheek?: string;
  glasses?: string;
  beard?: string;
  mood: FaceMood;
}

function paintFace(paint: SkinPainter, spec: FaceSpec): void {
  const parts = ["head", "torso", "armR", "armL", "legR", "legL"] as const;
  for (const part of parts) paint.fill(part, "all", spec.skin);

  paint.fill("head", "top", spec.hair);
  paint.fill("head", "back", spec.hair);
  paint.rect("head", "left", 0, 0, 8, 4, spec.hair);
  paint.rect("head", "right", 0, 0, 8, 4, spec.hair);
  paint.rect("head", "front", 0, 0, 8, 2, spec.hair);
  paint.px("head", "front", 0, 2, spec.hair);
  paint.px("head", "front", 7, 2, spec.hair);
  paint.rect("head", "left", 0, 4, 2, 2, spec.skin);
  paint.rect("head", "right", 6, 4, 2, 2, spec.skin);

  const browY = spec.mood === "stern" ? 3 : 2;
  paint.rect("head", "front", 1, browY, 2, 1, spec.brow);
  paint.rect("head", "front", 5, browY, 2, 1, spec.brow);
  if (spec.mood === "stern") {
    paint.px("head", "front", 3, browY, spec.brow);
    paint.px("head", "front", 4, browY, spec.brow);
  }

  paint.rect("head", "front", 1, 4, 2, 2, spec.eye);
  paint.rect("head", "front", 5, 4, 2, 2, spec.eye);
  paint.px("head", "front", 2, 4, spec.iris);
  paint.px("head", "front", 5, 4, spec.iris);
  paint.px("head", "front", 2, 5, spec.pupil);
  paint.px("head", "front", 5, 5, spec.pupil);

  paint.px("head", "front", 3, 5, spec.cheek ?? spec.skin);
  paint.px("head", "front", 4, 5, spec.cheek ?? spec.skin);
  paint.px("head", "front", 3, 6, spec.skin);
  paint.px("head", "front", 4, 6, spec.skin);

  if (spec.mood === "smile") {
    paint.px("head", "front", 2, 6, spec.lip);
    paint.rect("head", "front", 3, 7, 2, 1, spec.lip);
    paint.px("head", "front", 5, 6, spec.lip);
  } else if (spec.mood === "soft") {
    paint.rect("head", "front", 3, 6, 2, 1, spec.lip);
  } else {
    paint.rect("head", "front", 3, 6, 2, 1, spec.lip);
  }

  if (spec.beard) {
    paint.rect("head", "front", 2, 7, 4, 1, spec.beard);
    paint.rect("head", "front", 1, 7, 1, 1, spec.beard);
    paint.rect("head", "front", 6, 7, 1, 1, spec.beard);
  }
  if (spec.glasses) {
    paint.rect("head", "front", 1, 4, 2, 1, spec.glasses);
    paint.rect("head", "front", 5, 4, 2, 1, spec.glasses);
    paint.px("head", "front", 3, 4, spec.glasses);
    paint.px("head", "front", 4, 4, spec.glasses);
  }

  paint.grain("head", "all", 0.06, 11);
}

function eraseHandsAndHead(paint: SkinPainter): void {
  paint.clear("head");
  for (const face of ["front", "back", "left", "right"] as const) {
    paint.erase("armR", face, 0, 10, 4, 2);
    paint.erase("armL", face, 0, 10, 4, 2);
  }
}

export function zhangBody(): Skin {
  return createSkin((paint) => {
    paintFace(paint, {
      skin: "#c99570",
      hair: "#1a1410",
      brow: "#2a2118",
      eye: "#f3efe6",
      iris: "#3b2a1c",
      pupil: "#120c08",
      lip: "#8a5348",
      cheek: "#c07d62",
      mood: "stern",
    });
  });
}

export function collectorBody(): Skin {
  return createSkin((paint) => {
    paintFace(paint, {
      skin: "#d4a07a",
      hair: "#6b5a4a",
      brow: "#4a3a2c",
      eye: "#f7f1e6",
      iris: "#5a4632",
      pupil: "#1a120c",
      lip: "#b06858",
      cheek: "#d4896a",
      glasses: "#2c3036",
      beard: "#8a7a68",
      mood: "smile",
    });
    paint.rect("head", "top", 2, 2, 4, 4, "#c4b09a");
    paint.rect("head", "front", 1, 1, 6, 1, "#b8a48c");
  });
}

export function officerBody(seed: number, mood: FaceMood = "calm"): Skin {
  const skins = ["#c99570", "#d0a07c", "#b98968", "#c8a07a", "#bb8c66"];
  const hairs = ["#1a1410", "#2c2418", "#3a2a1c", "#15100c", "#4a3c2c"];
  return createSkin((paint) => {
    paintFace(paint, {
      skin: skins[seed % skins.length]!,
      hair: hairs[seed % hairs.length]!,
      brow: "#2a2118",
      eye: "#f4eee4",
      iris: seed % 2 === 0 ? "#3a2a1c" : "#4a3828",
      pupil: "#100c08",
      lip: "#8a554c",
      mood,
    });
    paint.grain("torso", "all", 0.04, seed * 17);
  });
}

export function zhangUniform(): Skin {
  return createSkin(
    (paint) => {
      eraseHandsAndHead(paint);
      const navy = "#1c2a44";
      const deep = "#141c30";
      const gold = "#c4a45a";
      const belt = "#2a2018";
      paint.fill("torso", "all", navy);
      paint.fill("armR", "all", navy);
      paint.fill("armL", "all", navy);
      paint.fill("legR", "all", deep);
      paint.fill("legL", "all", deep);
      paint.rect("torso", "front", 0, 0, 8, 2, "#252e46");
      paint.rect("torso", "front", 3, 2, 2, 1, gold);
      paint.px("torso", "front", 3, 4, gold);
      paint.px("torso", "front", 3, 6, gold);
      paint.px("torso", "front", 3, 8, gold);
      paint.rect("torso", "front", 0, 9, 8, 2, belt);
      paint.px("torso", "front", 4, 9, gold);
      paint.rect("torso", "front", 0, 2, 1, 3, gold);
      paint.rect("torso", "front", 7, 2, 1, 3, gold);
      paint.rect("legR", "front", 0, 10, 4, 2, "#1a1a1c");
      paint.rect("legL", "front", 0, 10, 4, 2, "#1a1a1c");
      paint.grain("torso", "all", 0.08, 3);
      paint.grain("armR", "all", 0.07, 4);
      paint.grain("armL", "all", 0.07, 5);
    },
    { transparent: true },
  );
}

export function collectorClothes(): Skin {
  return createSkin(
    (paint) => {
      eraseHandsAndHead(paint);
      const shirt = "#d8c8a8";
      const vest = "#6a4530";
      const pants = "#3e3a36";
      paint.fill("torso", "all", shirt);
      paint.fill("armR", "all", shirt);
      paint.fill("armL", "all", shirt);
      paint.fill("legR", "all", pants);
      paint.fill("legL", "all", pants);
      paint.rect("torso", "front", 0, 2, 8, 9, vest);
      paint.rect("torso", "back", 0, 2, 8, 9, vest);
      paint.rect("torso", "left", 0, 2, 4, 9, vest);
      paint.rect("torso", "right", 0, 2, 4, 9, vest);
      paint.rect("torso", "front", 3, 0, 2, 3, "#efe6d4");
      paint.px("torso", "front", 2, 5, "#c4a45a");
      paint.px("torso", "front", 5, 5, "#c4a45a");
      paint.px("torso", "front", 2, 8, "#c4a45a");
      paint.px("torso", "front", 5, 8, "#c4a45a");
      paint.rect("legR", "front", 0, 10, 4, 2, "#2a2420");
      paint.rect("legL", "front", 0, 10, 4, 2, "#2a2420");
      paint.grain("torso", "all", 0.1, 8);
    },
    { transparent: true },
  );
}

function paintSuit(paint: SkinPainter, visor: "dark" | "clear" | "blood", accent: string): void {
  const white = "#e8eef4";
  const grey = "#6a7380";
  const dark = "#2a3038";
  paint.fill("head", "all", white);
  paint.fill("torso", "all", white);
  paint.fill("armR", "all", white);
  paint.fill("armL", "all", white);
  paint.fill("legR", "all", white);
  paint.fill("legL", "all", white);

  if (visor === "clear") {
    paint.erase("head", "front", 1, 2, 6, 5);
    paint.rect("head", "front", 1, 2, 6, 1, "#9aa7b4");
    paint.rect("head", "front", 1, 6, 6, 1, "#9aa7b4");
  } else if (visor === "blood") {
    paint.fill("head", "front", "#6a1020");
    paint.rect("head", "front", 1, 2, 6, 5, "#8a1a28");
    paint.px("head", "front", 2, 3, "#f2e8e4");
    paint.px("head", "front", 5, 4, "#f7d0c4");
    paint.px("head", "front", 3, 5, "#c45a4a");
    paint.rect("head", "front", 0, 1, 8, 1, white);
  } else {
    paint.rect("head", "front", 1, 2, 6, 5, "#1c2430");
    paint.rect("head", "front", 2, 3, 4, 3, "#2a3848");
    paint.px("head", "front", 5, 3, "#8ab0c8");
  }

  paint.rect("torso", "front", 2, 1, 4, 6, grey);
  paint.rect("torso", "front", 3, 2, 2, 4, dark);
  paint.rect("torso", "front", 0, 8, 8, 2, accent);
  paint.rect("torso", "back", 2, 2, 4, 6, grey);
  paint.rect("armR", "front", 0, 0, 4, 2, grey);
  paint.rect("armL", "front", 0, 0, 4, 2, grey);
  paint.rect("armR", "front", 0, 9, 4, 3, grey);
  paint.rect("armL", "front", 0, 9, 4, 3, grey);
  paint.rect("legR", "front", 0, 9, 4, 3, dark);
  paint.rect("legL", "front", 0, 9, 4, 3, dark);
  paint.grain("torso", "all", 0.05, 21);
  paint.grain("head", "all", 0.04, 22);
}

export function spacesuit(visor: "dark" | "clear" | "blood", accent = "#3a5a8a"): Skin {
  return createSkin((paint) => paintSuit(paint, visor, accent), { transparent: true });
}

export const ACCENTS = ["#3a5a8a", "#8a3a3a", "#3a6a58", "#6a5a3a", "#4a4a6a", "#2a5a6a"] as const;

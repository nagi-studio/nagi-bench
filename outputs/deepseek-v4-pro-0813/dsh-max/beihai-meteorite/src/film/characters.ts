import * as THREE from "three";
import {
  createFigure,
  createSkin,
  applyPose,
  lerpPose,
  type Figure,
  type Pose,
  type SkinPainter,
} from "@agentbench/voxel-kit";

/* ------------------------------------------------------------------ */
/* face painting (all identity lives in texels)                        */
/* ------------------------------------------------------------------ */

export interface FaceSpec {
  skin: string;
  skinShade: string;
  hair?: string; // null = bald
  hairTopRows?: number; // rows of hair on top (default 2)
  hairSideRows?: number; // rows of hair on sides
  sideLong?: boolean; // hair framing the face down the sides
  brows?: string;
  browY?: number; // default 3
  eyes?: [number, number] | null; // columns of the two eyes; null = closed
  eyeW?: number; // default 1
  mouth?: "line" | "smile" | "open" | "calm" | "none";
  mouthColor?: string;
  beard?: string; // draws beard on chin + jaw sides
  stubble?: boolean;
  glasses?: boolean;
  ageLines?: boolean;
  nose?: boolean;
  lashes?: boolean;
  blush?: boolean;
  lipColor?: string;
}

function paintHead(p: SkinPainter, f: FaceSpec): void {
  const hair = f.hair ?? "#2a2f38";
  const topRows = f.hairTopRows ?? 2;
  const sideRows = f.hairSideRows ?? (f.sideLong ? 6 : topRows + 1);
  // top of head
  p.fill("head", "top", hair);
  // sides
  for (const face of ["left", "right"] as const) {
    p.fill("head", face, f.skin);
    p.rect("head", face, 0, 0, 8, sideRows, hair);
    if (f.beard) p.rect("head", face, 0, 6, 8, 2, f.beard);
    if (f.stubble) p.rect("head", face, 0, 5, 8, 2, f.skinShade);
    if (f.glasses) p.rect("head", face, 1, 3, 1, 2, "#2c2a26");
  }
  // back of head
  p.fill("head", "back", hair);
  p.rect("head", "back", 0, 0, 8, Math.min(4, sideRows), hair);
  p.rect("head", "back", 0, sideRows, 8, 8 - sideRows, f.skin);
  // front face
  p.fill("head", "front", f.skin);
  p.rect("head", "front", 0, 0, 8, topRows, hair);
  const browY = f.browY ?? 3;
  const brows = f.brows ?? "#1c2026";
  const [ex1, ex2] = f.eyes ?? [1, 5];
  if (f.eyes === null) {
    p.rect("head", "front", ex1, 4, 1, 1, "#3c3630");
    p.rect("head", "front", ex2, 4, 1, 1, "#3c3630");
  } else if (f.eyes) {
    p.rect("head", "front", ex1, browY, 2, 1, brows);
    p.rect("head", "front", ex2, browY, 2, 1, brows);
    p.rect("head", "front", ex1 + 1, 4, 1, 1, "#f4f0e6");
    p.rect("head", "front", ex2 + 1, 4, 1, 1, "#f4f0e6");
    p.rect("head", "front", ex1, 4, 1, 1, "#191c22");
    p.rect("head", "front", ex2, 4, 1, 1, "#191c22");
    if (f.lashes) {
      p.rect("head", "front", ex1, 3, 2, 1, "#191c22");
      p.rect("head", "front", ex2, 3, 2, 1, "#191c22");
    }
  }
  if (f.glasses) {
    p.rect("head", "front", ex1 - 1, 3, 3, 2, "#332f2a");
    p.rect("head", "front", ex2 - 1, 3, 3, 2, "#332f2a");
    p.rect("head", "front", ex1 + 2, 3, 1, 1, "#332f2a");
  }
  if (f.ageLines) {
    p.rect("head", "front", ex1 - 1, 5, 1, 1, f.skinShade);
    p.rect("head", "front", ex2 + 2, 5, 1, 1, f.skinShade);
    p.rect("head", "front", 0, 2, 2, 1, f.skinShade);
    p.rect("head", "front", 6, 2, 2, 1, f.skinShade);
  }
  if (f.nose) p.rect("head", "front", 3, 4, 2, 1, f.skinShade);
  const mouthColor = f.mouthColor ?? "#7d4a40";
  switch (f.mouth) {
    case "line":
      p.rect("head", "front", 2, 6, 4, 1, mouthColor);
      break;
    case "calm":
      p.rect("head", "front", 3, 6, 2, 1, mouthColor);
      break;
    case "smile":
      p.rect("head", "front", 2, 6, 4, 1, mouthColor);
      p.rect("head", "front", 2, 5, 1, 1, mouthColor);
      p.rect("head", "front", 5, 5, 1, 1, mouthColor);
      break;
    case "open":
      p.rect("head", "front", 2, 5, 4, 2, "#4a1e16");
      p.rect("head", "front", 2, 6, 4, 1, "#7a3326");
      break;
    default:
      break;
  }
  if (f.beard) {
    p.rect("head", "front", 2, 7, 4, 1, f.beard);
    p.rect("head", "front", 1, 6, 1, 1, f.beard);
    p.rect("head", "front", 6, 6, 1, 1, f.beard);
  }
  if (f.blush) {
    p.rect("head", "front", 0, 5, 1, 1, "#c8836e");
    p.rect("head", "front", 7, 5, 1, 1, "#c8836e");
  }
}

export function facePainter(f: FaceSpec): (p: SkinPainter) => void {
  return (p) => {
    paintHead(p, f);
    // body base
    p.fill("torso", "all", "#d8d2c8");
    p.fill("armR", "all", f.skin);
    p.fill("armL", "all", f.skin);
    p.fill("legR", "all", "#c9c2b6");
    p.fill("legL", "all", "#c9c2b6");
  };
}

/* ------------------------------------------------------------------ */
/* named characters                                                    */
/* ------------------------------------------------------------------ */

export const ZHANG_SKIN = "#d9b18b";
export const ZHANG_SHADE = "#c39a72";

const zhangFace: FaceSpec = {
  skin: ZHANG_SKIN,
  skinShade: ZHANG_SHADE,
  hair: "#23272e",
  hairTopRows: 2,
  hairSideRows: 3,
  brows: "#1a1e25",
  eyes: [1, 5],
  mouth: "calm",
};

const collectorFace: FaceSpec = {
  skin: "#cfa06e",
  skinShade: "#b98d5e",
  hair: "#b9bcc2",
  hairTopRows: 1,
  hairSideRows: 3,
  brows: "#d8d9dd",
  browY: 3,
  eyes: [1, 5],
  mouth: "smile",
  beard: "#cfd2d6",
  glasses: true,
  ageLines: true,
  nose: true,
};

const targetAFace: FaceSpec = {
  skin: "#d4ab7f",
  skinShade: "#b98d5e",
  hair: "#e2e6ec",
  hairTopRows: 2,
  hairSideRows: 3,
  brows: "#c9cdd4",
  eyes: [1, 5],
  mouth: "line",
  ageLines: true,
  nose: true,
};

const targetAScreamFace: FaceSpec = {
  ...targetAFace,
  mouth: "open",
  browY: 2,
};

const targetBFace: FaceSpec = {
  skin: "#d0a57b",
  skinShade: "#b68a61",
  hair: "#4a4a52",
  hairTopRows: 1,
  hairSideRows: 2,
  brows: "#2e2a2c",
  eyes: [1, 5],
  mouth: "line",
  nose: true,
};

const targetCFace: FaceSpec = {
  skin: "#e0bc97",
  skinShade: "#c99f76",
  hair: "#2e2a33",
  hairTopRows: 2,
  hairSideRows: 5,
  sideLong: true,
  brows: "#241f2a",
  eyes: [1, 5],
  mouth: "line",
  lashes: true,
  blush: true,
  lipColor: "#a0525c",
  nose: true,
};

const genericFaces: FaceSpec[] = [
  { skin: "#d9b18b", skinShade: "#c39a72", hair: "#1c1f26", hairTopRows: 2, eyes: [1, 5], mouth: "calm" },
  { skin: "#c9946c", skinShade: "#b07c56", hair: "#3a2f28", hairTopRows: 2, brows: "#2a2018", eyes: [1, 5], mouth: "line" },
  { skin: "#e6c29c", skinShade: "#cfab82", hair: "#5a4a3a", hairTopRows: 1, eyes: [1, 5], mouth: "calm" },
  { skin: "#b98d6a", skinShade: "#a07653", hair: "#23272e", hairTopRows: 2, eyes: [1, 5], mouth: "line", stubble: true },
  { skin: "#e8c9a6", skinShade: "#d2b18c", hair: "#7a4a3a", hairTopRows: 2, brows: "#5a3428", eyes: [1, 5], mouth: "smile", blush: true },
  { skin: "#d0a57b", skinShade: "#b68a61", hair: "#101318", hairTopRows: 2, eyes: [1, 5], mouth: "calm" },
];

/* ------------------------------------------------------------------ */
/* clothing                                                            */
/* ------------------------------------------------------------------ */

const CLOTH_BASE: Record<string, string> = {};

function zhangCoatPainter(p: SkinPainter): void {
  // torso
  p.fill("torso", "all", "#222b3c");
  p.rect("torso", "front", 0, 0, 8, 2, "#1a2130"); // collar
  p.rect("torso", "front", 1, 0, 1, 2, "#e8e4da"); // collar flashes
  p.rect("torso", "front", 6, 0, 1, 2, "#e8e4da");
  p.rect("torso", "front", 3, 3, 1, 1, "#141821"); // buttons
  p.rect("torso", "front", 3, 6, 1, 1, "#141821");
  p.rect("torso", "front", 3, 8, 1, 1, "#141821");
  p.rect("torso", "front", 1, 4, 2, 1, "#8a93a5"); // rank bars
  p.rect("torso", "front", 5, 4, 2, 1, "#8a93a5");
  p.rect("torso", "front", 1, 7, 3, 2, "#1c2432"); // pockets
  p.rect("torso", "front", 4, 7, 3, 2, "#1c2432");
  p.rect("torso", "front", 0, 10, 8, 1, "#12161f"); // belt
  p.rect("torso", "front", 3, 10, 1, 1, "#7d7f6a");
  p.rect("torso", "front", 0, 11, 8, 1, "#1a2130"); // hem
  p.rect("torso", "back", 3, 0, 1, 12, "#1a2130"); // seam
  p.rect("torso", "back", 0, 10, 8, 1, "#12161f");
  // arms: sleeve + cuff, hands exposed
  for (const arm of ["armR", "armL"] as const) {
    p.fill(arm, "all", "#222b3c");
    p.rect(arm, "front", 0, 9, 4, 1, "#1a2130");
    p.rect(arm, "back", 0, 9, 4, 1, "#1a2130");
    p.rect(arm, "left", 0, 9, 4, 1, "#1a2130");
    p.rect(arm, "right", 0, 9, 4, 1, "#1a2130");
    p.erase(arm, "front", 0, 10, 4, 2);
    p.erase(arm, "back", 0, 10, 4, 2);
    p.erase(arm, "left", 0, 10, 4, 2);
    p.erase(arm, "right", 0, 10, 4, 2);
  }
  // legs: trousers + boots, coat skirt over the top
  for (const leg of ["legR", "legL"] as const) {
    p.fill(leg, "all", "#2a3550");
    p.rect(leg, "front", 0, 0, 4, 2, "#222b3c");
    p.rect(leg, "back", 0, 0, 4, 2, "#222b3c");
    p.rect(leg, "left", 0, 0, 4, 2, "#222b3c");
    p.rect(leg, "right", 0, 0, 4, 2, "#222b3c");
    p.rect(leg, "front", 0, 9, 4, 3, "#191d26");
    p.rect(leg, "back", 0, 9, 4, 3, "#191d26");
    p.rect(leg, "left", 0, 9, 4, 3, "#191d26");
    p.rect(leg, "right", 0, 9, 4, 3, "#191d26");
  }
}

function zhangShirtPainter(p: SkinPainter): void {
  p.fill("torso", "all", "#202836");
  p.rect("torso", "front", 3, 0, 1, 10, "#171d28");
  p.rect("torso", "front", 0, 10, 8, 1, "#12161f");
  for (const arm of ["armR", "armL"] as const) {
    p.fill(arm, "all", "#202836");
    p.erase(arm, "front", 0, 9, 4, 3);
    p.erase(arm, "back", 0, 9, 4, 3);
    p.erase(arm, "left", 0, 9, 4, 3);
    p.erase(arm, "right", 0, 9, 4, 3);
  }
  for (const leg of ["legR", "legL"] as const) {
    p.fill(leg, "all", "#2a3550");
    p.rect(leg, "front", 0, 9, 4, 3, "#191d26");
    p.rect(leg, "back", 0, 9, 4, 3, "#191d26");
    p.rect(leg, "left", 0, 9, 4, 3, "#191d26");
    p.rect(leg, "right", 0, 9, 4, 3, "#191d26");
  }
}

function collectorClothesPainter(p: SkinPainter): void {
  p.fill("torso", "all", "#6e5238");
  p.rect("torso", "front", 2, 0, 4, 3, "#c9bda5"); // shirt V
  p.rect("torso", "front", 3, 0, 1, 3, "#6e5238");
  p.rect("torso", "front", 1, 0, 1, 3, "#6e5238");
  p.rect("torso", "front", 6, 0, 1, 3, "#6e5238");
  p.rect("torso", "front", 3, 3, 1, 1, "#3f3428");
  p.rect("torso", "front", 3, 5, 1, 1, "#3f3428");
  p.rect("torso", "front", 3, 7, 1, 1, "#3f3428");
  p.rect("torso", "front", 1, 8, 3, 2, "#5d452f"); // pockets
  p.rect("torso", "front", 4, 8, 3, 2, "#5d452f");
  p.rect("torso", "front", 0, 11, 8, 1, "#5d452f");
  p.rect("torso", "back", 3, 0, 1, 12, "#5d452f");
  for (const arm of ["armR", "armL"] as const) {
    p.fill(arm, "all", "#6e5238");
    p.rect(arm, "front", 0, 9, 4, 1, "#5d452f");
    p.rect(arm, "back", 0, 9, 4, 1, "#5d452f");
    p.rect(arm, "left", 0, 9, 4, 1, "#5d452f");
    p.rect(arm, "right", 0, 9, 4, 1, "#5d452f");
    p.erase(arm, "front", 0, 10, 4, 2);
    p.erase(arm, "back", 0, 10, 4, 2);
    p.erase(arm, "left", 0, 10, 4, 2);
    p.erase(arm, "right", 0, 10, 4, 2);
  }
  for (const leg of ["legR", "legL"] as const) {
    p.fill(leg, "all", "#4c423a");
    p.rect(leg, "front", 0, 9, 4, 3, "#2b2520");
    p.rect(leg, "back", 0, 9, 4, 3, "#2b2520");
    p.rect(leg, "left", 0, 9, 4, 3, "#2b2520");
    p.rect(leg, "right", 0, 9, 4, 3, "#2b2520");
  }
}

/* ------------------------------------------------------------------ */
/* spacesuits                                                          */
/* ------------------------------------------------------------------ */

export interface SuitOpts {  band?: "blue" | "gold" | "gray" | "none"; // shoulder band
  visorAlpha?: number;
  visorTint?: string;
  cracked?: boolean;
  holeChest?: boolean;
  noHelmet?: boolean;
  bodyFace: FaceSpec;
}

const VISOR = "150,194,238";
const VISOR_FRAME = "#66717f";

export function suitClothesPainter(o: SuitOpts): (p: SkinPainter) => void {
  const band = o.band === "blue" ? "#2f4d7a" : o.band === "gold" ? "#c8a13a" : "#8f9aa8";
  const bandOn = o.band !== "none";
  return (p) => {
    // torso
    p.fill("torso", "all", "#e6ebf2");
    p.rect("torso", "front", 1, 4, 6, 4, "#c9d2de"); // chest panel
    p.rect("torso", "front", 3, 0, 2, 12, "#9aa7b8"); // zipper
    p.rect("torso", "front", 0, 0, 8, 1, "#b7c2cf"); // neck ring
    if (bandOn) {
      p.rect("torso", "front", 0, 1, 8, 1, band);
      p.rect("torso", "back", 0, 1, 8, 1, band);
    }
    p.rect("torso", "back", 1, 2, 6, 8, "#b7c2cf"); // backpack
    p.rect("torso", "back", 2, 2, 4, 8, "#a9b5c3");
    p.rect("torso", "back", 2, 9, 1, 1, "#66717f");
    p.rect("torso", "back", 5, 9, 1, 1, "#66717f");
    if (o.holeChest) {
      p.rect("torso", "front", 2, 6, 2, 2, "#241f1c");
      p.rect("torso", "front", 1, 5, 4, 1, "#c05048");
      p.rect("torso", "front", 1, 8, 4, 1, "#c05048");
    }
    // arms
    for (const arm of ["armR", "armL"] as const) {
      p.fill(arm, "all", "#e6ebf2");
      p.rect(arm, "front", 0, 4, 4, 2, "#b9c4d2");
      p.rect(arm, "back", 0, 4, 4, 2, "#b9c4d2");
      p.rect(arm, "left", 0, 4, 4, 2, "#b9c4d2");
      p.rect(arm, "right", 0, 4, 4, 2, "#b9c4d2");
      if (bandOn) {
        p.rect(arm, "front", 0, 0, 4, 1, band);
        p.rect(arm, "back", 0, 0, 4, 1, band);
      }
      p.rect(arm, "front", 0, 8, 4, 1, "#8f9aa8");
      p.rect(arm, "back", 0, 8, 4, 1, "#8f9aa8");
      p.rect(arm, "left", 0, 8, 4, 1, "#8f9aa8");
      p.rect(arm, "right", 0, 8, 4, 1, "#8f9aa8");
      p.rect(arm, "front", 0, 9, 4, 3, "#ccd4de"); // glove
      p.rect(arm, "back", 0, 9, 4, 3, "#ccd4de");
      p.rect(arm, "left", 0, 9, 4, 3, "#ccd4de");
      p.rect(arm, "right", 0, 9, 4, 3, "#ccd4de");
    }
    // legs
    for (const leg of ["legR", "legL"] as const) {
      p.fill(leg, "all", "#e6ebf2");
      p.rect(leg, "front", 0, 4, 4, 2, "#b9c4d2");
      p.rect(leg, "back", 0, 4, 4, 2, "#b9c4d2");
      p.rect(leg, "left", 0, 4, 4, 2, "#b9c4d2");
      p.rect(leg, "right", 0, 4, 4, 2, "#b9c4d2");
      p.rect(leg, "front", 0, 9, 4, 3, "#8f9aa8");
      p.rect(leg, "back", 0, 9, 4, 3, "#8f9aa8");
      p.rect(leg, "left", 0, 9, 4, 3, "#8f9aa8");
      p.rect(leg, "right", 0, 9, 4, 3, "#8f9aa8");
    }
    if (o.noHelmet) return;
    // helmet
    p.fill("head", "all", "#e9edf3");
    const alpha = o.visorAlpha ?? 0.58;
    const tint = o.visorTint ?? VISOR;
    p.rect("head", "front", 0, 0, 8, 1, "#d7dde6");
    p.rect("head", "front", 0, 7, 8, 1, "#9aa7b8"); // chin ring
    p.rect("head", "front", 1, 1, 6, 6, `rgba(${tint},${alpha})`);
    p.rect("head", "front", 1, 1, 6, 1, VISOR_FRAME);
    p.rect("head", "front", 1, 6, 6, 1, VISOR_FRAME);
    p.rect("head", "front", 1, 1, 1, 6, VISOR_FRAME);
    p.rect("head", "front", 6, 1, 1, 6, VISOR_FRAME);
    for (const face of ["left", "right"] as const) {
      p.rect("head", face, 1, 2, 6, 3, `rgba(${tint},${alpha})`);
      p.rect("head", face, 1, 1, 1, 5, VISOR_FRAME);
      p.rect("head", face, 6, 1, 1, 5, VISOR_FRAME);
      p.rect("head", face, 0, 7, 8, 1, "#9aa7b8");
    }
    p.rect("head", "back", 0, 7, 8, 1, "#9aa7b8");
    if (o.cracked) {
      p.rect("head", "front", 2, 2, 1, 1, "#e8f2fa");
      p.rect("head", "front", 4, 1, 1, 1, "#e8f2fa");
      p.rect("head", "front", 3, 3, 1, 1, "#e8f2fa");
      p.rect("head", "front", 5, 4, 1, 1, "#e8f2fa");
      p.rect("head", "front", 2, 5, 1, 1, "#e8f2fa");
      p.rect("head", "front", 3, 2, 1, 2, "rgba(255,255,255,0.85)");
      p.rect("head", "front", 4, 4, 1, 2, "rgba(255,255,255,0.85)");
      p.rect("head", "front", 2, 3, 2, 1, "rgba(190,60,48,0.9)");
      p.rect("head", "front", 5, 5, 1, 1, "rgba(190,60,48,0.9)");
    }
  };
}

function suitBodyPainter(f: FaceSpec): (p: SkinPainter) => void {
  return (p) => {
    paintHead(p, f);
    p.fill("torso", "all", "#3a4150");
    p.fill("armR", "all", "#3a4150");
    p.fill("armL", "all", "#3a4150");
    p.fill("legR", "all", "#33394a");
    p.fill("legL", "all", "#33394a");
  };
}

/* ------------------------------------------------------------------ */
/* skin singletons                                                     */
/* ------------------------------------------------------------------ */

const zhangBodySkin = createSkin(facePainter(zhangFace));
const zhangCoatSkin = createSkin(zhangCoatPainter, { transparent: true });
const zhangShirtSkin = createSkin(zhangShirtPainter, { transparent: true });
const collectorBodySkin = createSkin(facePainter(collectorFace));
const collectorClothesSkin = createSkin(collectorClothesPainter, { transparent: true });

const suitBodies = new Map<string, THREE.CanvasTexture>();
const suitClothes = new Map<string, ReturnType<typeof createSkin>>();

export function suitBodyTexture(key: string, f: FaceSpec): THREE.CanvasTexture {
  let t = suitBodies.get(key);
  if (!t) {
    t = createSkin(suitBodyPainter(f)).texture;
    suitBodies.set(key, t);
  }
  return t;
}

export function suitClothesSkin(key: string, o: SuitOpts): ReturnType<typeof createSkin> {
  let s = suitClothes.get(key);
  if (!s) {
    s = createSkin(suitClothesPainter(o), { transparent: true });
    suitClothes.set(key, s);
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* figure factories                                                    */
/* ------------------------------------------------------------------ */

export function makeZhang(height = 1.8): Figure {
  return createFigure({
    body: zhangBodySkin.texture,
    clothes: zhangCoatSkin.texture,
    heightM: height,
  });
}

export function makeZhangShirt(): Figure {
  return createFigure({
    body: zhangBodySkin.texture,
    clothes: zhangShirtSkin.texture,
    heightM: 1.8,
  });
}

export function makeCollector(): Figure {
  return createFigure({
    body: collectorBodySkin.texture,
    clothes: collectorClothesSkin.texture,
    heightM: 1.74,
  });
}

export function makeSuitedFigure(key: string, o: SuitOpts, height = 1.78): Figure {
  const body = suitBodyTexture(key, o.bodyFace);
  const clothes = suitClothesSkin(key, o);
  return createFigure({ body, clothes: clothes.texture, heightM: height });
}

/* ------------------------------------------------------------------ */
/* performance helpers                                                 */
/* ------------------------------------------------------------------ */

export interface PoseKey {
  t: number;
  pose: Pose;
}

/** sample a keyframed pose at local time t (seconds) */
export function keyedPose(keys: PoseKey[], t: number): Pose {
  if (keys.length === 0) return {};
  if (t <= keys[0]!.t) return keys[0]!.pose;
  const last = keys[keys.length - 1]!;
  if (t >= last.t) return last.pose;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]!;
    const b = keys[i + 1]!;
    if (t >= a.t && t <= b.t) {
      const k = (t - a.t) / Math.max(1e-5, b.t - a.t);
      const e = k * k * (3 - 2 * k);
      return lerpPose(a.pose, b.pose, e);
    }
  }
  return last.pose;
}

export function poseFigure(f: Figure, pose: Pose): void {
  applyPose(f, pose);
}

export const REST: Pose = {};

export { type Figure, type Pose };

import * as THREE from "three";
import { createSkin, type SkinPainter, type PartName, type FaceName } from "@agentbench/voxel-kit";

/**
 * Every character's identity is painted here: faces, hair, cloth, suit seams.
 * Body sheets and clothing sheets are separate so one body can be redressed.
 */

export type Eyes = "open" | "blink" | "narrow" | "wide" | "shut";
export type Mouth = "shut" | "open" | "smile" | "gape";

export interface Identity {
  skin: string;
  skinShade: string;
  hair: string;
  brow: string;
  lip: string;
  /** Rows of hair on the forehead (1 = receding, 2 = full). */
  fringe: number;
  glasses?: boolean;
  ruddy?: boolean;
  /** The hand under a suit glove: a thin grey liner instead of bare skin. */
  liner?: boolean;
  stern?: boolean;
}

const SIDES: FaceName[] = ["front", "back", "left", "right"];
const LIMBS: PartName[] = ["armR", "armL", "legR", "legL"];

function band(p: SkinPainter, part: PartName, y: number, h: number, colour: string, faces: FaceName[] = SIDES): void {
  for (const f of faces) {
    const w = part === "torso" ? (f === "front" || f === "back" ? 8 : 4) : part === "head" ? 8 : 4;
    p.rect(part, f, 0, y, w, h, colour);
  }
}

export function paintBody(p: SkinPainter, id: Identity, eyes: Eyes, mouth: Mouth): void {
  for (const part of ["head", "torso", ...LIMBS] as PartName[]) p.fill(part, "all", id.skin);
  // Hair: cap, back, temples.
  p.fill("head", "top", id.hair);
  p.fill("head", "back", id.hair);
  p.rect("head", "back", 1, 7, 6, 1, id.skin);
  for (const side of ["left", "right"] as FaceName[]) {
    p.rect("head", side, 0, 0, 8, 3, id.hair);
    p.rect("head", side, side === "left" ? 4 : 0, 3, 4, 2, id.hair);
    p.rect("head", side, 3, 4, 2, 2, id.skinShade); // ear
  }
  p.rect("head", "front", 0, 0, 8, 1, id.hair);
  if (id.fringe >= 2) p.rect("head", "front", 0, 1, 8, 1, id.hair);
  else {
    p.rect("head", "front", 0, 1, 2, 1, id.hair);
    p.rect("head", "front", 6, 1, 2, 1, id.hair);
  }
  p.px("head", "front", 0, 2, id.hair).px("head", "front", 7, 2, id.hair);
  p.fill("head", "bottom", id.skinShade);

  // Brows.
  const browY = id.stern ? 3 : 3;
  p.rect("head", "front", 1, browY, 2, 1, id.brow).rect("head", "front", 5, browY, 2, 1, id.brow);
  if (eyes === "wide") {
    p.rect("head", "front", 1, 3, 2, 1, id.skin).rect("head", "front", 5, 3, 2, 1, id.skin);
    p.rect("head", "front", 1, 2, 2, 1, id.brow).rect("head", "front", 5, 2, 2, 1, id.brow);
  }
  // Eyes on row 4: whites outside, pupils inside.
  const white = "#e9e6df", pupil = "#16161c", lid = id.skinShade;
  if (eyes === "open" || eyes === "wide") {
    p.px("head", "front", 1, 4, white).px("head", "front", 2, 4, pupil);
    p.px("head", "front", 5, 4, pupil).px("head", "front", 6, 4, white);
    if (eyes === "wide") {
      p.px("head", "front", 1, 3, white).px("head", "front", 2, 3, white);
      p.px("head", "front", 5, 3, white).px("head", "front", 6, 3, white);
    }
  } else if (eyes === "narrow") {
    p.px("head", "front", 1, 4, lid).px("head", "front", 2, 4, pupil);
    p.px("head", "front", 5, 4, pupil).px("head", "front", 6, 4, lid);
  } else {
    p.rect("head", "front", 1, 4, 2, 1, id.brow === id.hair ? lid : lid).rect("head", "front", 5, 4, 2, 1, lid);
    if (eyes === "shut") {
      p.rect("head", "front", 1, 4, 2, 1, "#6b4a3c").rect("head", "front", 5, 4, 2, 1, "#6b4a3c");
    }
  }
  if (id.glasses) {
    // Spectacles: a rim over each eye, a bridge, temples; lenses catch a little light.
    const frame = "#3a2c22", lens = "#dfe9f0";
    p.rect("head", "front", 1, 3, 2, 1, frame).rect("head", "front", 5, 3, 2, 1, frame);
    p.px("head", "front", 0, 4, frame).px("head", "front", 7, 4, frame);
    p.px("head", "front", 3, 4, frame).px("head", "front", 4, 4, frame);
    if (eyes === "open" || eyes === "wide") p.px("head", "front", 1, 4, lens).px("head", "front", 6, 4, lens);
    p.px("head", "left", 7, 4, frame).px("head", "left", 6, 4, frame).px("head", "left", 5, 4, frame);
    p.px("head", "right", 0, 4, frame).px("head", "right", 1, 4, frame).px("head", "right", 2, 4, frame);
    p.rect("head", "front", 3, 5, 2, 1, id.skinShade);
  } else {
    p.rect("head", "front", 3, 5, 2, 1, id.skinShade); // nose shadow
  }
  if (id.ruddy) p.px("head", "front", 0, 5, "#d98f7c").px("head", "front", 7, 5, "#d98f7c");

  // Mouth on row 6.
  if (mouth === "shut") p.rect("head", "front", 3, 6, 2, 1, id.lip);
  else if (mouth === "smile") {
    p.rect("head", "front", 2, 6, 4, 1, id.lip);
    p.px("head", "front", 2, 6, id.skinShade).px("head", "front", 5, 6, id.skinShade);
    p.rect("head", "front", 3, 6, 2, 1, "#f0ebe2");
    p.rect("head", "front", 2, 7, 4, 1, id.skin);
  } else if (mouth === "open") {
    p.rect("head", "front", 3, 6, 2, 1, "#3d1716");
  } else {
    p.rect("head", "front", 2, 6, 4, 2, "#2c0f10");
    p.rect("head", "front", 3, 6, 2, 1, "#3d1716");
  }
  p.grain("head", ["front"], 0.025, 7);
  p.grain("head", ["top", "back", "left", "right"], 0.07, 11);

  if (id.liner) {
    // Thin inner glove under the pressure glove.
    for (const arm of ["armR", "armL"] as PartName[]) {
      band(p, arm, 8, 4, "#8f958f");
      p.fill(arm, "bottom", "#858b86");
      band(p, arm, 8, 1, "#6f746f");
    }
  }
}

export function bodySkin(id: Identity, eyes: Eyes, mouth: Mouth): THREE.Texture {
  return createSkin((p) => paintBody(p, id, eyes, mouth)).texture;
}

/* ---------- civilian clothes ---------- */

export function zhangCoat(): THREE.Texture {
  return createSkin((p) => {
    const coat = "#27344a", dark = "#1a2334", shirt = "#c9ccd0";
    p.fill("torso", "all", coat);
    p.rect("torso", "front", 3, 0, 2, 2, shirt);
    p.px("torso", "front", 2, 0, dark).px("torso", "front", 5, 0, dark);
    p.rect("torso", "front", 2, 1, 1, 3, dark).rect("torso", "front", 5, 1, 1, 3, dark);
    p.rect("torso", "front", 4, 2, 1, 10, dark);
    p.px("torso", "front", 3, 4, "#3a4658").px("torso", "front", 3, 7, "#3a4658").px("torso", "front", 3, 10, "#3a4658");
    p.rect("torso", "front", 1, 8, 2, 1, dark).rect("torso", "front", 6, 8, 2, 1, dark);
    p.rect("torso", "back", 4, 6, 1, 6, dark);
    for (const arm of ["armR", "armL"] as PartName[]) {
      p.fill(arm, "top", coat);
      band(p, arm, 0, 10, coat);
      band(p, arm, 9, 1, dark);
    }
    for (const leg of ["legR", "legL"] as PartName[]) {
      band(p, leg, 0, 10, "#20222a");
      band(p, leg, 10, 2, "#0c0c0f");
      p.fill(leg, "bottom", "#08080a");
      p.fill(leg, "top", "#20222a");
    }
    p.grain("torso", "all", 0.06, 3);
    for (const part of LIMBS) p.grain(part, SIDES, 0.06, 5);
  }, { transparent: true }).texture;
}

export function collectorCardigan(): THREE.Texture {
  return createSkin((p) => {
    const knit = "#6b4c33", knitDark = "#503826", shirt = "#d8d2c0", shirtShade = "#b9b3a2";
    p.fill("torso", "all", knit);
    p.rect("torso", "front", 3, 0, 2, 12, shirt);
    p.rect("torso", "front", 3, 0, 2, 1, shirtShade);
    p.px("torso", "front", 2, 0, shirt).px("torso", "front", 5, 0, shirt);
    p.px("torso", "front", 4, 3, "#8a8474").px("torso", "front", 4, 6, "#8a8474").px("torso", "front", 4, 9, "#8a8474");
    p.rect("torso", "front", 2, 1, 1, 11, knitDark).rect("torso", "front", 5, 1, 1, 11, knitDark);
    p.rect("torso", "front", 0, 8, 2, 2, knitDark).rect("torso", "front", 6, 8, 2, 2, knitDark);
    band(p, "torso", 11, 1, knitDark);
    for (const arm of ["armR", "armL"] as PartName[]) {
      p.fill(arm, "top", knit);
      band(p, arm, 0, 9, knit);
      band(p, arm, 8, 1, knitDark);
      band(p, arm, 9, 1, shirt);
    }
    for (const leg of ["legR", "legL"] as PartName[]) {
      band(p, leg, 0, 10, "#3a3b40");
      band(p, leg, 10, 2, "#161616");
      band(p, leg, 11, 1, "#d6d2c6");
      p.fill(leg, "bottom", "#d6d2c6");
      p.fill(leg, "top", "#3a3b40");
    }
    p.grain("torso", "all", 0.1, 9);
    for (const part of LIMBS) p.grain(part, SIDES, 0.1, 13);
  }, { transparent: true }).texture;
}

/* ---------- pressure suit ---------- */

export interface SuitOptions {
  visor: "dark" | "clear" | "cracked" | "bloody";
  /** Accent stripe colour for chest and upper arms; null for plain white. */
  stripe?: string | null;
  /** Right pressure glove present. */
  gloveR?: boolean;
  /** Warm tint for suits lit by sunset is left to lighting; this is base cloth. */
  cloth?: string;
}

export function suitSkin(o: SuitOptions): THREE.Texture {
  return createSkin((p) => {
    const cloth = o.cloth ?? "#e4e5e8", seam = "#b4b8c0", ring = "#757a84", glove = "#8b9099", boot = "#5e636c";
    // Helmet.
    p.fill("head", "all", cloth);
    p.fill("head", "bottom", ring);
    p.rect("head", "front", 0, 7, 8, 1, ring);
    p.rect("head", "back", 0, 7, 8, 1, ring).rect("head", "left", 0, 7, 8, 1, ring).rect("head", "right", 0, 7, 8, 1, ring);
    p.rect("head", "left", 3, 3, 2, 2, seam).rect("head", "right", 3, 3, 2, 2, seam);
    p.rect("head", "top", 3, 2, 2, 4, seam);
    p.rect("head", "front", 1, 1, 6, 1, ring).rect("head", "front", 0, 2, 1, 5, seam).rect("head", "front", 7, 2, 1, 5, seam);
    if (o.visor === "clear") {
      p.erase("head", "front", 1, 2, 6, 5);
    } else if (o.visor === "dark") {
      p.rect("head", "front", 1, 2, 6, 5, "#161a26");
      p.rect("head", "front", 1, 2, 3, 1, "#3d4a66").px("head", "front", 1, 3, "#2b3650");
      p.px("head", "front", 5, 5, "#c98a3c").px("head", "front", 6, 4, "#8a5a2c");
    } else {
      // Crazed glass: opaque, webbed with cracks; "bloody" is spattered from inside.
      p.rect("head", "front", 1, 2, 6, 5, "#aeb6c2");
      const crack = "#f4f6f8", deep = "#6a7280";
      p.px("head", "front", 3, 3, deep).px("head", "front", 4, 4, deep);
      for (const [x, y] of [[1, 2], [2, 3], [4, 2], [5, 3], [6, 2], [2, 5], [1, 6], [5, 5], [6, 6], [3, 6], [4, 5]] as Array<[number, number]>) {
        p.px("head", "front", x, y, crack);
      }
      if (o.visor === "bloody") {
        for (const [x, y] of [[2, 4], [3, 4], [3, 5], [4, 3], [5, 4], [4, 6], [2, 6], [5, 6], [3, 2], [6, 5], [1, 4]] as Array<[number, number]>) {
          p.px("head", "front", x, y, "#7c0f14");
        }
        p.px("head", "front", 3, 4, "#a3141a").px("head", "front", 4, 5, "#5c0a0e");
      }
    }
    // Torso.
    p.fill("torso", "all", cloth);
    band(p, "torso", 0, 1, ring);
    band(p, "torso", 11, 1, seam);
    p.rect("torso", "front", 2, 3, 4, 4, "#aeb3bb");
    p.rect("torso", "front", 2, 3, 4, 1, "#8d929b");
    p.px("torso", "front", 2, 5, "#c73a34").px("torso", "front", 3, 5, "#3fae5c").px("torso", "front", 5, 5, "#d9b23c").px("torso", "front", 4, 6, "#565b64");
    p.rect("torso", "front", 0, 8, 2, 2, seam).rect("torso", "front", 6, 8, 2, 2, seam);
    p.rect("torso", "back", 1, 1, 6, 9, seam);
    if (o.stripe) {
      p.rect("torso", "front", 0, 1, 8, 1, o.stripe);
      p.rect("torso", "back", 0, 1, 8, 1, o.stripe);
    }
    // Limbs.
    for (const arm of ["armR", "armL"] as PartName[]) {
      p.fill(arm, "top", cloth);
      band(p, arm, 0, 12, cloth);
      band(p, arm, 4, 1, seam);
      if (o.stripe) band(p, arm, 1, 2, o.stripe);
      band(p, arm, 8, 1, ring);
      band(p, arm, 9, 3, glove);
      p.fill(arm, "bottom", glove);
    }
    if (o.gloveR === false) {
      // Glove off: clear below the wrist ring so the liner on the body shows.
      for (const f of SIDES) p.erase("armR", f, 0, 9, 4, 3);
      p.clear("armR", "bottom");
    }
    for (const leg of ["legR", "legL"] as PartName[]) {
      p.fill(leg, "top", cloth);
      band(p, leg, 0, 12, cloth);
      band(p, leg, 5, 1, seam);
      if (o.stripe) band(p, leg, 2, 1, o.stripe);
      band(p, leg, 9, 3, boot);
      p.fill(leg, "bottom", "#3c4048");
    }
    p.grain("torso", "all", 0.035, 21);
    for (const part of LIMBS) p.grain(part, SIDES, 0.035, 23);
    p.grain("head", ["top", "back", "left", "right"], 0.03, 29);
  }, { transparent: true }).texture;
}

export const ID_ZHANG: Identity = {
  skin: "#c49a79", skinShade: "#a67c5f", hair: "#131418", brow: "#17171b", lip: "#8a5d4c", fringe: 2, stern: true,
};
export const ID_ZHANG_SUIT: Identity = { ...ID_ZHANG, liner: true };
export const ID_COLLECTOR: Identity = {
  skin: "#d3a585", skinShade: "#b48466", hair: "#b5b5ae", brow: "#8d8d88", lip: "#955f50", fringe: 1, glasses: true, ruddy: true,
};

/** Five crew identities shared across the thirty-one figures of the group photo. */
export const CREW_IDS: Identity[] = [
  { skin: "#cfa283", skinShade: "#ad8163", hair: "#8e8e8a", brow: "#77736e", lip: "#8f5e4e", fringe: 1, liner: true, ruddy: true },
  { skin: "#c69674", skinShade: "#a47758", hair: "#2a2622", brow: "#2a2622", lip: "#84584a", fringe: 2, liner: true },
  { skin: "#dab395", skinShade: "#b98f72", hair: "#c9c8c2", brow: "#a3a09a", lip: "#9c6656", fringe: 1, liner: true, glasses: true },
  { skin: "#b98a68", skinShade: "#976c4e", hair: "#1b1a19", brow: "#1b1a19", lip: "#7a4f42", fringe: 2, liner: true },
  { skin: "#d6ab8c", skinShade: "#b4886a", hair: "#5a4a3c", brow: "#4a3c30", lip: "#96604f", fringe: 2, liner: true, ruddy: true },
];

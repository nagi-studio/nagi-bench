import { createSkin, type Skin, type SkinPainter } from "@agentbench/voxel-kit";
import { mulberry32 } from "../util";

/**
 * Every face is texels on the 8x8 head front — never protruding geometry.
 * Layout (face-local, origin top-left): hair y0-1, brows y3, eyes y4,
 * nose y5, mouth y6, chin y7.
 */
export interface FaceSpec {
  skin: string;
  hair: string;
  brow: string;
  eye: string;
  mouth: string;
  glasses?: string;
  smile?: boolean;
  stern?: boolean;
  aged?: boolean;
  beard?: string;
}

function paintFace(p: SkinPainter, f: FaceSpec): void {
  p.fill("head", "front", f.skin);
  p.fill("head", "top", f.hair);
  p.fill("head", "back", f.hair);
  p.rect("head", "front", 0, 0, 8, 2, f.hair); // fringe
  p.rect("head", "left", 0, 0, 8, 2, f.hair);
  p.rect("head", "right", 0, 0, 8, 2, f.hair);
  p.rect("head", "back", 0, 0, 8, 6, f.hair);
  // ears
  p.px("head", "left", 4, 4, f.skin);
  p.px("head", "right", 3, 4, f.skin);
  // brows
  p.rect("head", "front", 1, 3, 2, 1, f.brow);
  p.rect("head", "front", 5, 3, 2, 1, f.brow);
  if (f.stern) { p.px("head", "front", 2, 3, f.brow); p.px("head", "front", 5, 3, f.brow); }
  // eyes: sclera + pupil
  p.rect("head", "front", 1, 4, 2, 1, "#f4f1ea");
  p.rect("head", "front", 5, 4, 2, 1, "#f4f1ea");
  p.px("head", "front", 2, 4, f.eye);
  p.px("head", "front", 5, 4, f.eye);
  if (f.aged) { p.px("head", "front", 1, 5, shade(f.skin, -18)); p.px("head", "front", 6, 5, shade(f.skin, -18)); }
  // nose
  p.px("head", "front", 3, 5, shade(f.skin, -14));
  p.px("head", "front", 4, 5, shade(f.skin, -8));
  // mouth
  if (f.smile) {
    p.rect("head", "front", 3, 6, 2, 1, f.mouth);
    p.px("head", "front", 2, 6, shade(f.skin, -10));
    p.px("head", "front", 5, 6, shade(f.skin, -10));
  } else {
    p.rect("head", "front", 3, 6, 2, 1, f.mouth);
  }
  if (f.beard) { p.rect("head", "front", 1, 6, 6, 2, f.beard); p.rect("head", "front", 3, 6, 2, 1, f.mouth); }
  if (f.glasses) {
    p.rect("head", "front", 1, 4, 2, 1, f.glasses);
    p.rect("head", "front", 5, 4, 2, 1, f.glasses);
    p.px("head", "front", 3, 4, f.glasses);
    p.px("head", "front", 4, 4, f.glasses);
    p.px("head", "front", 0, 4, f.glasses);
    p.px("head", "front", 7, 4, f.glasses);
    // keep eyes readable behind lenses
    p.px("head", "front", 2, 4, f.eye);
    p.px("head", "front", 5, 4, f.eye);
  }
  p.grain("head", "front", 0.05, 7);
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function bareBody(skin: string, hand: string): (p: SkinPainter) => void {
  return (p) => {
    p.fill("head", "all", skin);
    p.fill("torso", "all", skin);
    p.fill("armR", "all", skin);
    p.fill("armL", "all", skin);
    p.fill("legR", "all", skin);
    p.fill("legL", "all", skin);
    // hands read slightly lighter
    p.rect("armR", "front", 0, 9, 4, 3, hand);
    p.rect("armL", "front", 0, 9, 4, 3, hand);
    p.rect("armR", "back", 0, 9, 4, 3, hand);
    p.rect("armL", "back", 0, 9, 4, 3, hand);
  };
}

// ---------------------------------------------------------------------------
// Zhang Beihai — calm, resolute political officer. Civilian + spacesuit.
// ---------------------------------------------------------------------------
const ZHANG_FACE: FaceSpec = {
  skin: "#c9976a", hair: "#201d1a", brow: "#201d1a", eye: "#241a12",
  mouth: "#8a5a44", stern: true,
};

export function zhangBody(): Skin {
  return createSkin((p) => {
    bareBody("#c9976a", "#d3a377")(p);
    paintFace(p, ZHANG_FACE);
  });
}

/** Dark civilian jacket + trousers; hands revealed at the cuffs. */
export function zhangCivilian(): Skin {
  return createSkin((p) => {
    const jacket = "#39424c";
    p.fill("torso", "all", jacket);
    p.fill("armR", "all", jacket);
    p.fill("armL", "all", jacket);
    p.fill("legR", "all", "#2b2f36");
    p.fill("legL", "all", "#2b2f36");
    // collar + zip
    p.rect("torso", "front", 3, 0, 2, 2, "#2c333b");
    p.rect("torso", "front", 3, 2, 1, 9, "#22282e");
    p.rect("torso", "front", 0, 0, 8, 1, "#4a5560");
    // cuffs reveal hands
    p.erase("armR", "front", 0, 9, 4, 3);
    p.erase("armL", "front", 0, 9, 4, 3);
    p.erase("armR", "back", 0, 9, 4, 3);
    p.erase("armL", "back", 0, 9, 4, 3);
    p.erase("armR", "left", 0, 9, 4, 3);
    p.erase("armR", "right", 0, 9, 4, 3);
    p.erase("armL", "left", 0, 9, 4, 3);
    p.erase("armL", "right", 0, 9, 4, 3);
    // shoes
    p.rect("legR", "front", 0, 10, 4, 2, "#1c1f24");
    p.rect("legL", "front", 0, 10, 4, 2, "#1c1f24");
    p.grain("torso", "all", 0.06, 3);
    p.grain("legR", "all", 0.05, 5);
    p.grain("legL", "all", 0.05, 6);
  }, { transparent: true });
}

const SUIT = "#e6e7ea";
const SUIT_SHADE = "#c3c6cc";
const SUIT_JOINT = "#9aa0aa";
const VISOR = "#c9a24a";

function paintSuit(p: SkinPainter, visor: "down" | "up", gloveOffR = false, rank = false): void {
  for (const part of ["torso", "armR", "armL", "legR", "legL"] as const) {
    p.fill(part, "all", SUIT);
    p.grain(part, "all", 0.04, 11);
  }
  // helmet shell
  p.fill("head", "all", SUIT);
  p.rect("head", "top", 0, 0, 8, 8, "#f0f1f3");
  // joint rings
  p.rect("armR", "front", 0, 5, 4, 1, SUIT_JOINT);
  p.rect("armL", "front", 0, 5, 4, 1, SUIT_JOINT);
  p.rect("legR", "front", 0, 5, 4, 1, SUIT_JOINT);
  p.rect("legL", "front", 0, 5, 4, 1, SUIT_JOINT);
  p.rect("torso", "front", 0, 6, 8, 1, SUIT_SHADE);
  // chest control panel
  p.rect("torso", "front", 2, 2, 4, 3, "#3a4048");
  p.px("torso", "front", 3, 3, "#7fd6a0");
  p.px("torso", "front", 4, 3, "#e0705a");
  p.px("torso", "front", 3, 4, "#6fa8dc");
  // boots + gloves
  p.rect("legR", "front", 0, 9, 4, 3, "#b9bcc2");
  p.rect("legL", "front", 0, 9, 4, 3, "#b9bcc2");
  p.rect("armR", "front", 0, 8, 4, 4, gloveOffR ? "#8d8f96" : "#cfd2d8");
  p.rect("armL", "front", 0, 8, 4, 4, "#cfd2d8");
  if (gloveOffR) {
    // thin cloth glove on the right hand, body skin faintly beneath
    p.rect("armR", "front", 0, 10, 4, 2, "#b08d6e");
  }
  // visor on the helmet front
  if (visor === "down") {
    p.rect("head", "front", 1, 2, 6, 5, VISOR);
    p.rect("head", "front", 1, 2, 6, 1, "#e0c070");
    p.px("head", "front", 2, 3, "#f0dca0");
    p.rect("head", "front", 1, 6, 6, 1, "#a8862f");
  } else {
    // clear visor: erase the opening so the painted face shows through
    p.erase("head", "front", 1, 2, 6, 5);
    p.rect("head", "front", 0, 1, 8, 1, SUIT_SHADE);
    p.rect("head", "front", 0, 7, 8, 1, SUIT_SHADE);
    p.rect("head", "front", 0, 2, 1, 5, SUIT_SHADE);
    p.rect("head", "front", 7, 2, 1, 5, SUIT_SHADE);
  }
  if (rank) {
    // gold shoulder bars + red command stripe for the three targets
    p.rect("armR", "front", 0, 0, 4, 1, "#d8b23a");
    p.rect("armL", "front", 0, 0, 4, 1, "#d8b23a");
    p.rect("torso", "front", 0, 0, 8, 1, "#b03a2e");
  }
  // suit backpack hint on torso back
  p.rect("torso", "back", 1, 1, 6, 8, SUIT_SHADE);
}

export function zhangSuit(visor: "down" | "up", gloveOffR = false): Skin {
  return createSkin((p) => paintSuit(p, visor, gloveOffR, false), { transparent: true });
}

export function suitGeneric(visor: "down" | "up", rank = false): Skin {
  return createSkin((p) => paintSuit(p, visor, false, rank), { transparent: true });
}

/** Cracked, blood-flecked visor for the struck target. */
export function suitCracked(): Skin {
  return createSkin((p) => {
    paintSuit(p, "down", false, true);
    // opaque frost + spiderweb cracks over the visor
    p.rect("head", "front", 1, 2, 6, 5, "#dfe6ea");
    const rng = mulberry32(42);
    for (let i = 0; i < 14; i++) {
      const x = 1 + ((rng() * 6) | 0);
      const y = 2 + ((rng() * 5) | 0);
      p.px("head", "front", x, y, "#9fb0bb");
    }
    p.rect("head", "front", 3, 3, 1, 3, "#8d9aa5");
    p.rect("head", "front", 2, 4, 4, 1, "#8d9aa5");
    // blood spatter behind the frost
    p.px("head", "front", 2, 3, "#a8322a");
    p.px("head", "front", 5, 4, "#96271f");
    p.px("head", "front", 4, 5, "#b03a2e");
    p.px("head", "front", 3, 4, "#7e211a");
  }, { transparent: true });
}

// ---------------------------------------------------------------------------
// The collector — ruddy, content, glasses; a man happy in his small world.
// ---------------------------------------------------------------------------
export function collectorBody(): Skin {
  return createSkin((p) => {
    bareBody("#d2a077", "#dcb088")(p);
    paintFace(p, {
      skin: "#d2a077", hair: "#8d867c", brow: "#6f675d", eye: "#2a2018",
      mouth: "#9c6048", glasses: "#3a3f46", smile: true, aged: true,
    });
  });
}

export function collectorClothes(): Skin {
  return createSkin((p) => {
    const cardigan = "#7a5a3e";
    p.fill("torso", "all", cardigan);
    p.fill("armR", "all", cardigan);
    p.fill("armL", "all", cardigan);
    p.fill("legR", "all", "#4a4038");
    p.fill("legL", "all", "#4a4038");
    p.rect("torso", "front", 3, 0, 2, 12, "#6a4c33"); // open front
    p.rect("torso", "front", 3, 1, 2, 2, "#c9b79a"); // shirt beneath
    p.rect("torso", "front", 0, 0, 8, 1, "#8a6a4a");
    p.erase("armR", "front", 0, 9, 4, 3);
    p.erase("armL", "front", 0, 9, 4, 3);
    p.erase("armR", "back", 0, 9, 4, 3);
    p.erase("armL", "back", 0, 9, 4, 3);
    p.erase("armR", "left", 0, 9, 4, 3);
    p.erase("armR", "right", 0, 9, 4, 3);
    p.erase("armL", "left", 0, 9, 4, 3);
    p.erase("armL", "right", 0, 9, 4, 3);
    p.rect("legR", "front", 0, 10, 4, 2, "#2e2822");
    p.rect("legL", "front", 0, 10, 4, 2, "#2e2822");
    p.grain("torso", "all", 0.08, 21);
  }, { transparent: true });
}

// ---------------------------------------------------------------------------
// Chang Weisi — senior officer, olive uniform, grey hair.
// ---------------------------------------------------------------------------
export function changBody(): Skin {
  return createSkin((p) => {
    bareBody("#c69a72", "#cfa87e")(p);
    paintFace(p, {
      skin: "#c69a72", hair: "#b6b2aa", brow: "#8f8b83", eye: "#241a12",
      mouth: "#8a5a44", stern: true, aged: true,
    });
  });
}

export function changClothes(): Skin {
  return createSkin((p) => {
    const olive = "#4a5340";
    p.fill("torso", "all", olive);
    p.fill("armR", "all", olive);
    p.fill("armL", "all", olive);
    p.fill("legR", "all", "#3c4436");
    p.fill("legL", "all", "#3c4436");
    // red collar tabs + gold buttons + shoulder boards
    p.rect("torso", "front", 0, 0, 2, 1, "#b03a2e");
    p.rect("torso", "front", 6, 0, 2, 1, "#b03a2e");
    p.rect("torso", "front", 3, 1, 2, 10, "#3f4736");
    for (let y = 2; y < 11; y += 2) p.px("torso", "front", 4, y, "#d8b23a");
    p.rect("armR", "front", 0, 0, 4, 1, "#d8b23a");
    p.rect("armL", "front", 0, 0, 4, 1, "#d8b23a");
    p.erase("armR", "front", 0, 9, 4, 3);
    p.erase("armL", "front", 0, 9, 4, 3);
    p.erase("armR", "back", 0, 9, 4, 3);
    p.erase("armL", "back", 0, 9, 4, 3);
    p.rect("legR", "front", 0, 10, 4, 2, "#22261e");
    p.rect("legL", "front", 0, 10, 4, 2, "#22261e");
    p.grain("torso", "all", 0.05, 31);
  }, { transparent: true });
}

// ---------------------------------------------------------------------------
// The thirty delegates — varied faces behind clear visors.
// ---------------------------------------------------------------------------
const EXTRA_FACES: FaceSpec[] = [
  { skin: "#c9976a", hair: "#2a2620", brow: "#2a2620", eye: "#241a12", mouth: "#8a5a44" },
  { skin: "#d8a87e", hair: "#4a3a28", brow: "#3a2c1e", eye: "#2a1e14", mouth: "#9c6048", smile: true },
  { skin: "#b98a63", hair: "#1c1a16", brow: "#1c1a16", eye: "#20160e", mouth: "#7e4e3a", stern: true },
  { skin: "#e0b48c", hair: "#6f675d", brow: "#5a534a", eye: "#2a2018", mouth: "#9c6048", aged: true },
  { skin: "#c49468", hair: "#3a2c1e", brow: "#2e2218", eye: "#241a12", mouth: "#8a5a44", glasses: "#33383f" },
  { skin: "#d2a077", hair: "#8d867c", brow: "#6f675d", eye: "#2a2018", mouth: "#9c6048", aged: true, smile: true },
];

export function extraBody(i: number): Skin {
  const f = EXTRA_FACES[i % EXTRA_FACES.length]!;
  return createSkin((p) => {
    bareBody(f.skin, shade(f.skin, 12))(p);
    paintFace(p, f);
  });
}

/** The three targets: distinguished, older, rank-marked suits. */
export function targetBody(i: number): Skin {
  const faces: FaceSpec[] = [
    { skin: "#cfa27a", hair: "#cfcac2", brow: "#a8a39a", eye: "#241a12", mouth: "#8a5a44", aged: true, stern: true },
    { skin: "#c49468", hair: "#9a948a", brow: "#7a746a", eye: "#20160e", mouth: "#7e4e3a", aged: true, glasses: "#33383f" },
    { skin: "#d8a87e", hair: "#ded9d0", brow: "#b0aba2", eye: "#2a2018", mouth: "#9c6048", aged: true, beard: "#c8c3ba" },
  ];
  const f = faces[i % 3]!;
  return createSkin((p) => {
    bareBody(f.skin, shade(f.skin, 12))(p);
    paintFace(p, f);
  });
}

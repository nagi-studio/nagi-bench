import { createSkin, type FaceName, type PartName, type Skin, type SkinPainter } from "@agentbench/voxel-kit";

function rectFaces(
  paint: SkinPainter,
  part: PartName,
  faces: FaceName[],
  x: number,
  y: number,
  w: number,
  h: number,
  colour: string,
): void {
  for (const f of faces) paint.rect(part, f, x, y, w, h, colour);
}

export type VisorMode = "gold" | "open" | "shattered";

interface FaceStyle {
  skin: string;
  skinShade: string;
  hair: string;
  hairHighlight: string;
  brow: string;
  eye: string;
  lip: string;
  glasses?: string;
  baldTop?: boolean;
  smile?: boolean;
  shocked?: boolean;
  wrinkles?: boolean;
  seed: number;
}

function paintFaceAndBody(paint: SkinPainter, style: FaceStyle): void {
  // Fill entire body with base skin tone + subtle grain
  paint.fill("head", "all", style.skin);
  paint.fill("torso", "all", style.skinShade);
  paint.fill("armR", "all", style.skin);
  paint.fill("armL", "all", style.skin);
  paint.fill("legR", "all", "#3a424d");
  paint.fill("legL", "all", "#3a424d");

  // Undershirt on bare torso (visible only if collar opens)
  paint.fill("torso", ["front", "back", "left", "right"], "#d9dde2");
  paint.rect("torso", "front", 2, 0, 4, 2, style.skin);

  // Hair cap on top, back, and sides of head
  if (style.baldTop) {
    paint.rect("head", "top", 0, 0, 8, 2, style.hair);
    paint.rect("head", "top", 0, 0, 1, 8, style.hair);
    paint.rect("head", "top", 7, 0, 1, 8, style.hair);
    paint.rect("head", "back", 0, 0, 8, 6, style.hair);
    paint.rect("head", "left", 0, 2, 8, 3, style.hair);
    paint.rect("head", "right", 0, 2, 8, 3, style.hair);
    paint.rect("head", "front", 0, 1, 1, 2, style.hair);
    paint.rect("head", "front", 7, 1, 1, 2, style.hair);
  } else {
    paint.fill("head", "top", style.hair);
    paint.rect("head", "top", 2, 2, 4, 3, style.hairHighlight);
    paint.rect("head", "back", 0, 0, 8, 7, style.hair);
    paint.rect("head", "left", 0, 0, 8, 3, style.hair);
    paint.rect("head", "left", 0, 3, 4, 3, style.hair);
    paint.rect("head", "right", 0, 0, 8, 3, style.hair);
    paint.rect("head", "right", 4, 3, 4, 3, style.hair);
    // Front hairline + sideburns
    paint.rect("head", "front", 0, 0, 8, 2, style.hair);
    paint.px("head", "front", 0, 2, style.hair);
    paint.px("head", "front", 7, 2, style.hair);
    paint.px("head", "front", 2, 1, style.hairHighlight);
    paint.px("head", "front", 5, 0, style.hairHighlight);
  }

  // Subtle jaw/cheek shading
  paint.rect("head", "front", 0, 7, 8, 1, style.skinShade);
  paint.px("head", "front", 3, 5, style.skinShade);
  paint.px("head", "front", 4, 5, style.skinShade);

  // Eyebrows (y = 3)
  paint.rect("head", "front", 1, 3, 2, 1, style.brow);
  paint.rect("head", "front", 5, 3, 2, 1, style.brow);

  // Eyes (y = 4)
  paint.px("head", "front", 1, 4, "#f4f6f8");
  paint.px("head", "front", 2, 4, style.eye);
  paint.px("head", "front", 5, 4, style.eye);
  paint.px("head", "front", 6, 4, "#f4f6f8");

  if (style.wrinkles) {
    paint.px("head", "front", 0, 4, style.skinShade);
    paint.px("head", "front", 7, 4, style.skinShade);
  }

  // Painted rectangular glasses (never protruding geometry!)
  if (style.glasses) {
    paint.rect("head", "front", 0, 4, 1, 1, style.glasses);
    paint.rect("head", "front", 3, 4, 2, 1, style.glasses);
    paint.rect("head", "front", 7, 4, 1, 1, style.glasses);
    paint.px("head", "front", 1, 5, style.glasses);
    paint.px("head", "front", 2, 5, style.glasses);
    paint.px("head", "front", 5, 5, style.glasses);
    paint.px("head", "front", 6, 5, style.glasses);
  }

  // Mouth (y = 6)
  if (style.shocked) {
    paint.rect("head", "front", 3, 5, 2, 2, "#3c1317");
    paint.px("head", "front", 3, 5, "#f0ebe4");
  } else if (style.smile) {
    paint.rect("head", "front", 2, 6, 4, 1, style.lip);
    paint.px("head", "front", 2, 6, style.skinShade);
    paint.px("head", "front", 5, 6, style.skinShade);
  } else {
    paint.rect("head", "front", 3, 6, 2, 1, style.lip);
  }

  paint.grain("head", "all", 0.04, style.seed);
  paint.grain("armR", "all", 0.03, style.seed + 11);
  paint.grain("armL", "all", 0.03, style.seed + 19);
}

/** Paint a complete orbital EVA spacesuit onto a transparent clothing shell. */
function buildEvaSuitSkin(
  accentHex: string,
  stripeHex: string,
  visorMode: VisorMode,
  options: { removeRightGlove?: boolean; seed?: number } = {},
): Skin {
  const seed = options.seed ?? 101;
  return createSkin(
    (paint) => {
      const suitWhite = "#dde3eb";
      const suitMid = "#b9c4d1";
      const jointDark = "#475364";
      const bootDark = "#333c4a";

      // Base suit coverage across torso, arms, legs
      paint.fill("torso", "all", suitWhite);
      paint.fill("armR", "all", suitWhite);
      paint.fill("armL", "all", suitWhite);
      paint.fill("legR", "all", suitWhite);
      paint.fill("legL", "all", suitWhite);

      // Torso chest telemetry control module & harness straps
      paint.rect("torso", "front", 1, 0, 1, 12, jointDark);
      paint.rect("torso", "front", 6, 0, 1, 12, jointDark);
      paint.rect("torso", "front", 2, 2, 4, 4, "#313b49");
      paint.px("torso", "front", 2, 2, "#4ef2a1"); // green O2 status LED
      paint.px("torso", "front", 3, 2, "#59c8ff"); // telemetry cyan LED
      paint.px("torso", "front", 5, 2, "#f0b44c"); // power amber
      paint.rect("torso", "front", 2, 4, 4, 1, "#627187");
      paint.rect("torso", "front", 0, 8, 8, 2, jointDark); // waist ring
      paint.rect("torso", "front", 3, 8, 2, 2, stripeHex); // buckle
      paint.rect("torso", "back", 1, 1, 6, 8, suitMid);
      paint.rect("torso", "back", 0, 8, 8, 2, jointDark);

      // Shoulder accent patches & ribbed elbow joints
      rectFaces(paint, "armR", ["front", "back", "right"], 0, 1, 4, 2, accentHex);
      rectFaces(paint, "armL", ["front", "back", "left"], 0, 1, 4, 2, accentHex);
      paint.rect("armR", "right", 1, 1, 2, 1, stripeHex);
      paint.rect("armL", "left", 1, 1, 2, 1, stripeHex);
      rectFaces(paint, "armR", ["front", "back", "left", "right"], 0, 5, 4, 2, jointDark);
      rectFaces(paint, "armL", ["front", "back", "left", "right"], 0, 5, 4, 2, jointDark);

      // Left pressurized EVA glove + silver wrist lock ring
      rectFaces(paint, "armL", ["front", "back", "left", "right"], 0, 8, 4, 1, "#8d99a8");
      rectFaces(paint, "armL", ["front", "back", "left", "right", "bottom"], 0, 9, 4, 3, "#505c6e");

      // Right hand: either gloved EVA hand OR removed glove exposing thin dark inner cloth in -100C vacuum!
      if (options.removeRightGlove) {
        rectFaces(paint, "armR", ["front", "back", "left", "right"], 0, 8, 4, 1, "#a7b4c4"); // open metal lock ring
        rectFaces(paint, "armR", ["front", "back", "left", "right", "bottom"], 0, 9, 4, 3, "#252b36"); // thin dark thermal glove
        paint.px("armR", "front", 1, 8, "#cceeff"); // tiny vacuum frost glint
        paint.px("armR", "right", 2, 9, "#cceeff");
      } else {
        rectFaces(paint, "armR", ["front", "back", "left", "right"], 0, 8, 4, 1, "#8d99a8");
        rectFaces(paint, "armR", ["front", "back", "left", "right", "bottom"], 0, 9, 4, 3, "#505c6e");
      }

      // Legs: knee accordion joints, command stripes, lunar/orbital boots
      for (const leg of ["legR", "legL"] as const) {
        rectFaces(paint, leg, ["front", "back", "left", "right"], 0, 4, 4, 2, jointDark);
        rectFaces(paint, leg, ["front", "left", "right"], 0, 2, 4, 1, accentHex);
        rectFaces(paint, leg, ["front", "back", "left", "right", "bottom"], 0, 9, 4, 3, bootDark);
        paint.rect(leg, "front", 1, 10, 2, 1, "#627083");
      }

      // Helmet shell (head inflated +0.5px automatically by voxel-kit!)
      paint.fill("head", "all", suitWhite);
      paint.rect("head", "top", 2, 1, 4, 2, accentHex);
      paint.rect("head", "back", 1, 2, 6, 4, suitMid);
      paint.rect("head", "left", 2, 2, 4, 3, jointDark);
      paint.rect("head", "right", 2, 2, 4, 3, jointDark);
      paint.px("head", "left", 3, 3, stripeHex);
      paint.px("head", "right", 4, 3, stripeHex);
      // Helmet neck seal collar
      rectFaces(paint, "head", ["front", "back", "left", "right"], 0, 7, 8, 1, jointDark);

      // Front visor window (x: 1..6, y: 2..5)
      paint.rect("head", "front", 0, 1, 8, 1, "#9aa6b5"); // brow rim
      if (visorMode === "gold") {
        paint.rect("head", "front", 1, 2, 6, 4, "#d9a236");
        paint.rect("head", "front", 1, 2, 6, 1, "#f2c96b");
        paint.px("head", "front", 2, 3, "#fff1bd"); // specular reflection
        paint.px("head", "front", 3, 2, "#fff5d1");
        paint.rect("head", "front", 1, 5, 6, 1, "#9c6d1b");
      } else if (visorMode === "open") {
        // Erase the visor interior completely so the painted voxel face shines through!
        paint.erase("head", "front", 1, 2, 6, 4);
        // Subtle 1px glass reflection gleam at top corners
        paint.px("head", "front", 1, 2, "#b8eeff");
        paint.px("head", "front", 6, 2, "#92d8f0");
      } else {
        // Shattered visor: cracked glass + crimson blood spray inside helmet!
        paint.erase("head", "front", 1, 2, 6, 4);
        // Jagged impact crack lines
        paint.px("head", "front", 3, 3, "#eef9ff");
        paint.px("head", "front", 4, 3, "#d4f2ff");
        paint.px("head", "front", 2, 2, "#cbeeff");
        paint.px("head", "front", 5, 2, "#cbeeff");
        paint.px("head", "front", 4, 4, "#e6f8ff");
        paint.px("head", "front", 6, 4, "#b8e4f5");
        paint.px("head", "front", 2, 5, "#cbeeff");
        // Internal blood splatter pixels on glass
        paint.px("head", "front", 3, 4, "#a8101c");
        paint.px("head", "front", 4, 5, "#8a0c16");
        paint.px("head", "front", 5, 4, "#c41826");
        paint.px("head", "front", 5, 5, "#9c0f1b");
        paint.px("head", "front", 2, 4, "#b81422");
      }

      paint.grain("torso", "all", 0.04, seed);
      paint.grain("armR", "all", 0.035, seed + 5);
      paint.grain("armL", "all", 0.035, seed + 7);
      paint.grain("legR", "all", 0.04, seed + 13);
      paint.grain("legL", "all", 0.04, seed + 17);
    },
    { transparent: true },
  );
}

export interface CharacterSkins {
  // Bodies
  zhangBody: Skin;
  collectorBody: Skin;
  leaderABody: Skin;
  leaderAShockedBody: Skin;
  leaderBBody: Skin;
  leaderBShockedBody: Skin;
  leaderCBody: Skin;
  leaderCShockedBody: Skin;
  colleagueBodies: Skin[];
  colleagueShockedBodies: Skin[];

  // Zhang Beihai Wardrobe
  zhangUniform: Skin;
  zhangWorkshop: Skin;
  zhangSuitGold: Skin;
  zhangSuitOpen: Skin;
  zhangSuitBareHand: Skin;

  // Collector Wardrobe
  collectorOutfit: Skin;

  // Orbital EVA Suits (Command & Crew)
  leaderSuitGold: Skin;
  leaderSuitOpen: Skin;
  leaderSuitShattered: Skin;
  crewSuitsGold: Skin[];
  crewSuitsOpen: Skin[];
  crewSuitDamaged: Skin;
}

export function createAllCharacterSkins(): CharacterSkins {
  // 1. Zhang Beihai — sharp, disciplined military officer
  const zhangBody = createSkin((paint) => {
    paintFaceAndBody(paint, {
      skin: "#d8a57e",
      skinShade: "#bd8964",
      hair: "#1b1e24",
      hairHighlight: "#2f343f",
      brow: "#15171c",
      eye: "#181d26",
      lip: "#9c6852",
      seed: 101,
    });
  });

  // 2. Meteorite Collector — warm 50-something retired Army surveyor
  const collectorBody = createSkin((paint) => {
    paintFaceAndBody(paint, {
      skin: "#d49f7a",
      skinShade: "#b58260",
      hair: "#565a62",
      hairHighlight: "#8f95a1",
      brow: "#4a4e57",
      eye: "#222730",
      lip: "#a66c58",
      smile: true,
      wrinkles: true,
      seed: 202,
    });
  });

  // 3. Target Leader A ("老赵", center front) — silver hair, glasses
  const leaderABase: FaceStyle = {
    skin: "#d6a480",
    skinShade: "#b88764",
    hair: "#8a909a",
    hairHighlight: "#c2c7cf",
    brow: "#5f646e",
    eye: "#1d222b",
    lip: "#9c6956",
    glasses: "#2d3645",
    wrinkles: true,
    smile: true,
    seed: 301,
  };
  const leaderABody = createSkin((p) => paintFaceAndBody(p, leaderABase));
  const leaderAShockedBody = createSkin((p) =>
    paintFaceAndBody(p, { ...leaderABase, smile: false, shocked: true }),
  );

  // 4. Target Leader B — dark graying hair, stern dignity
  const leaderBBase: FaceStyle = {
    skin: "#cf9974",
    skinShade: "#b07d5a",
    hair: "#2e323b",
    hairHighlight: "#7b818c",
    brow: "#252930",
    eye: "#1a1f28",
    lip: "#92614f",
    wrinkles: true,
    seed: 302,
  };
  const leaderBBody = createSkin((p) => paintFaceAndBody(p, leaderBBase));
  const leaderBShockedBody = createSkin((p) =>
    paintFaceAndBody(p, { ...leaderBBase, shocked: true }),
  );

  // 5. Target Leader C — receding hairline, silver temples
  const leaderCBase: FaceStyle = {
    skin: "#dbb08e",
    skinShade: "#bf916e",
    hair: "#6e737d",
    hairHighlight: "#a8aeb8",
    brow: "#494d57",
    eye: "#202630",
    lip: "#a36e5c",
    baldTop: true,
    wrinkles: true,
    smile: true,
    seed: 303,
  };
  const leaderCBody = createSkin((p) => paintFaceAndBody(p, leaderCBase));
  const leaderCShockedBody = createSkin((p) =>
    paintFaceAndBody(p, { ...leaderCBase, smile: false, shocked: true }),
  );

  // 6. Orbital colleagues (4 varied identities)
  const colleagueStyles: FaceStyle[] = [
    {
      skin: "#d8a682",
      skinShade: "#bc8a66",
      hair: "#22262e",
      hairHighlight: "#3a404d",
      brow: "#1d2026",
      eye: "#181d26",
      lip: "#9c6a57",
      smile: true,
      seed: 401,
    },
    {
      skin: "#e0b392",
      skinShade: "#c49473",
      hair: "#2c221e",
      hairHighlight: "#4a3a33",
      brow: "#2b211d",
      eye: "#1e222b",
      lip: "#b86b66",
      smile: true,
      seed: 402,
    },
    {
      skin: "#cca07c",
      skinShade: "#af8360",
      hair: "#3c4048",
      hairHighlight: "#696f7a",
      brow: "#31353d",
      eye: "#1b2029",
      lip: "#946252",
      glasses: "#364152",
      seed: 403,
    },
    {
      skin: "#d6a484",
      skinShade: "#b88666",
      hair: "#1d1f26",
      hairHighlight: "#353945",
      brow: "#181a21",
      eye: "#161b24",
      lip: "#a06d5b",
      seed: 404,
    },
  ];
  const colleagueBodies = colleagueStyles.map((s) => createSkin((p) => paintFaceAndBody(p, s)));
  const colleagueShockedBodies = colleagueStyles.map((s) =>
    createSkin((p) => paintFaceAndBody(p, { ...s, smile: false, shocked: true })),
  );

  // =========================================================================
  // WARDROBES (separate transparent clothing shells!)
  // =========================================================================

  // Zhang Beihai — Act I Space Force Officer Service Uniform
  const zhangUniform = createSkin(
    (paint) => {
      const coat = "#314237";
      const coatDark = "#233028";
      const shirt = "#cad4cb";
      const gold = "#e5be5c";

      paint.fill("torso", "all", coat);
      // Lapel & crisp pale shirt collar + dark tie
      paint.rect("torso", "front", 3, 0, 2, 3, shirt);
      paint.rect("torso", "front", 3, 1, 2, 2, "#1f2a23");
      paint.px("torso", "front", 2, 0, gold); // collar insignia
      paint.px("torso", "front", 5, 0, gold);
      // Medal ribbon bar on left chest
      paint.px("torso", "front", 5, 3, "#c43838");
      paint.px("torso", "front", 6, 3, "#e8bd4a");
      paint.px("torso", "front", 5, 4, "#3b6eb8");
      paint.px("torso", "front", 6, 4, "#d4d8de");
      // Center coat brass buttons & leather waist belt
      paint.px("torso", "front", 4, 5, gold);
      paint.px("torso", "front", 4, 7, gold);
      rectFaces(paint, "torso", ["front", "back", "left", "right"], 0, 9, 8, 2, "#241d18");
      paint.rect("torso", "front", 3, 9, 2, 2, gold);
      // Pocket flaps
      paint.rect("torso", "front", 1, 6, 2, 1, coatDark);
      paint.rect("torso", "front", 5, 6, 2, 1, coatDark);

      // Sleeves ending at wrist so bare skin hands remain visible!
      for (const arm of ["armR", "armL"] as const) {
        paint.fill(arm, ["front", "back", "left", "right", "top"], coat);
        paint.erase(arm, "front", 0, 10, 4, 2);
        paint.erase(arm, "back", 0, 10, 4, 2);
        paint.erase(arm, "left", 0, 10, 4, 2);
        paint.erase(arm, "right", 0, 10, 4, 2);
        paint.clear(arm, "bottom");
        rectFaces(paint, arm, ["front", "back", "left", "right"], 0, 9, 4, 1, coatDark);
        // Epaulettes on shoulder top
        paint.rect(arm, "top", 1, 1, 2, 2, gold);
      }

      // Uniform trousers + polished military boots
      for (const leg of ["legR", "legL"] as const) {
        paint.fill(leg, "all", "#29362d");
        rectFaces(paint, leg, ["front", "back", "left", "right", "bottom"], 0, 9, 4, 3, "#17191d");
      }

      paint.grain("torso", "all", 0.05, 501);
      paint.grain("armR", "all", 0.04, 502);
      paint.grain("armL", "all", 0.04, 503);
      paint.grain("legR", "all", 0.04, 504);
      paint.grain("legL", "all", 0.04, 505);
    },
    { transparent: true },
  );

  // Zhang Beihai — Act II Dark Utility Workshop & Basement Jacket
  const zhangWorkshop = createSkin(
    (paint) => {
      const jacket = "#242c38";
      const jacketDark = "#181e27";
      paint.fill("torso", "all", jacket);
      paint.rect("torso", "front", 3, 0, 2, 12, jacketDark); // zipper seam
      paint.px("torso", "front", 3, 1, "#8d9aaa"); // zip pull
      paint.rect("torso", "front", 1, 7, 2, 2, jacketDark);
      paint.rect("torso", "front", 5, 7, 2, 2, jacketDark);
      for (const arm of ["armR", "armL"] as const) {
        paint.fill(arm, ["front", "back", "left", "right", "top"], jacket);
        // Rolled cuffs slightly exposing wrists/hands for craft work
        paint.erase(arm, "front", 0, 9, 4, 3);
        paint.erase(arm, "back", 0, 9, 4, 3);
        paint.erase(arm, "left", 0, 9, 4, 3);
        paint.erase(arm, "right", 0, 9, 4, 3);
        paint.clear(arm, "bottom");
        rectFaces(paint, arm, ["front", "back", "left", "right"], 0, 8, 4, 1, "#354152");
      }
      for (const leg of ["legR", "legL"] as const) {
        paint.fill(leg, "all", "#1d222b");
        rectFaces(paint, leg, ["front", "back", "left", "right", "bottom"], 0, 9, 4, 3, "#14161a");
      }
      paint.grain("torso", "all", 0.05, 601);
      paint.grain("armR", "all", 0.04, 602);
      paint.grain("armL", "all", 0.04, 603);
    },
    { transparent: true },
  );

  // Meteorite Collector — Warm vintage cardigan vest over cream shirt
  const collectorOutfit = createSkin(
    (paint) => {
      const vest = "#6e4e35";
      const vestTrim = "#523824";
      const shirt = "#e3d6be";
      paint.fill("torso", "all", vest);
      // Cream V-neck shirt opening
      paint.rect("torso", "front", 2, 0, 4, 2, shirt);
      paint.rect("torso", "front", 3, 2, 2, 2, shirt);
      paint.rect("torso", "front", 3, 4, 1, 8, vestTrim); // button placket
      paint.px("torso", "front", 3, 5, "#c9a878");
      paint.px("torso", "front", 3, 7, "#c9a878");
      paint.px("torso", "front", 3, 9, "#c9a878");
      rectFaces(paint, "torso", ["front", "back", "left", "right"], 0, 11, 8, 1, vestTrim);

      // Cream shirt sleeves pushed slightly back at wrists
      for (const arm of ["armR", "armL"] as const) {
        paint.fill(arm, ["front", "back", "left", "right", "top"], shirt);
        paint.erase(arm, "front", 0, 9, 4, 3);
        paint.erase(arm, "back", 0, 9, 4, 3);
        paint.erase(arm, "left", 0, 9, 4, 3);
        paint.erase(arm, "right", 0, 9, 4, 3);
        paint.clear(arm, "bottom");
      }

      // Warm charcoal trousers + old leather house shoes
      for (const leg of ["legR", "legL"] as const) {
        paint.fill(leg, "all", "#45423f");
        rectFaces(paint, leg, ["front", "back", "left", "right", "bottom"], 0, 10, 4, 2, "#29221d");
      }
      paint.grain("torso", "all", 0.06, 701);
      paint.grain("armR", "all", 0.04, 702);
      paint.grain("armL", "all", 0.04, 703);
    },
    { transparent: true },
  );

  // Zhang Beihai Orbital EVA Suits (Space Force deep-blue & crimson accents)
  const zhangSuitGold = buildEvaSuitSkin("#29538c", "#c93b34", "gold", { seed: 801 });
  const zhangSuitOpen = buildEvaSuitSkin("#29538c", "#c93b34", "open", { seed: 802 });
  const zhangSuitBareHand = buildEvaSuitSkin("#29538c", "#c93b34", "open", {
    removeRightGlove: true,
    seed: 803,
  });

  // Aerospace Command Leaders EVA Suits (Crimson & Gold stripe)
  const leaderSuitGold = buildEvaSuitSkin("#b83530", "#e6bd53", "gold", { seed: 901 });
  const leaderSuitOpen = buildEvaSuitSkin("#b83530", "#e6bd53", "open", { seed: 902 });
  const leaderSuitShattered = buildEvaSuitSkin("#b83530", "#e6bd53", "shattered", { seed: 903 });

  // Orbital Conference Colleagues EVA Suits (3 clean aerospace divisions)
  const crewAccents: Array<[string, string]> = [
    ["#336ba8", "#9ec9f2"],
    ["#2f827c", "#9ae3dc"],
    ["#b37e32", "#f2d08a"],
  ];
  const crewSuitsGold = crewAccents.map(([a, s], idx) =>
    buildEvaSuitSkin(a, s, "gold", { seed: 920 + idx }),
  );
  const crewSuitsOpen = crewAccents.map(([a, s], idx) =>
    buildEvaSuitSkin(a, s, "open", { seed: 940 + idx }),
  );
  const crewSuitDamaged = buildEvaSuitSkin("#336ba8", "#9ec9f2", "shattered", { seed: 960 });

  return {
    zhangBody,
    collectorBody,
    leaderABody,
    leaderAShockedBody,
    leaderBBody,
    leaderBShockedBody,
    leaderCBody,
    leaderCShockedBody,
    colleagueBodies,
    colleagueShockedBodies,
    zhangUniform,
    zhangWorkshop,
    zhangSuitGold,
    zhangSuitOpen,
    zhangSuitBareHand,
    collectorOutfit,
    leaderSuitGold,
    leaderSuitOpen,
    leaderSuitShattered,
    crewSuitsGold,
    crewSuitsOpen,
    crewSuitDamaged,
  };
}

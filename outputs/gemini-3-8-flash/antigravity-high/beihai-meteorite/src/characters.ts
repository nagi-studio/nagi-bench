import * as THREE from "three";
import { createSkin, createFigure, type Figure } from "@agentbench/voxel-kit";

// Helper to wrap a band around the 8x12x4 torso
function rectRingTorso(paint: any, y: number, h: number, colour: string) {
  paint.rect("torso", "front", 0, y, 8, h, colour);
  paint.rect("torso", "back", 0, y, 8, h, colour);
  paint.rect("torso", "left", 0, y, 4, h, colour);
  paint.rect("torso", "right", 0, y, 4, h, colour);
}

// Helper to wrap a band around a 4x12x4 limb
function rectLimb(paint: any, part: "armR" | "armL" | "legR" | "legL", y: number, h: number, colour: string) {
  for (const face of ["front", "back", "left", "right"] as const) {
    paint.rect(part, face, 0, y, 4, h, colour);
  }
}

// ==========================================
// 1. ZHANG BEIHAI (章北海)
// ==========================================

export function createZhangBeihaiBody(): ReturnType<typeof createSkin> {
  return createSkin((paint) => {
    // Base skin tone - calm, healthy, resolute
    const skinTone = "#d4a373";
    const skinShadow = "#bc8a5f";
    const hairTone = "#1c1d21";
    const hairHighlight = "#2d2f36";
    const eyeWhite = "#f0f2f5";
    const pupil = "#111215";
    const brow = "#141518";
    const lip = "#b87d60";

    // Head base
    paint.fill("head", "all", skinTone);

    // Hair: top, back, left, right, top-front
    paint.fill("head", "top", hairTone);
    paint.fill("head", "back", hairTone);
    paint.fill("head", "left", hairTone);
    paint.fill("head", "right", hairTone);
    paint.rect("head", "front", 0, 0, 8, 2, hairTone);
    paint.px("head", "front", 1, 2, hairHighlight);
    paint.px("head", "front", 6, 2, hairHighlight);

    // Front face: Eyes (calm, focused, unflinching)
    // Left eye (viewer's left: x=1..2, y=3)
    paint.rect("head", "front", 1, 3, 2, 1, eyeWhite);
    paint.px("head", "front", 2, 3, pupil);
    // Right eye (viewer's right: x=5..6, y=3)
    paint.rect("head", "front", 5, 3, 2, 1, eyeWhite);
    paint.px("head", "front", 5, 3, pupil);

    // Eyebrows: strong military brow
    paint.rect("head", "front", 1, 2, 2, 1, brow);
    paint.rect("head", "front", 5, 2, 2, 1, brow);

    // Nose bridge subtle shadow & straight calm mouth
    paint.px("head", "front", 3, 4, skinShadow);
    paint.px("head", "front", 4, 4, skinShadow);
    paint.rect("head", "front", 3, 6, 2, 1, lip);

    // Ears on sides
    paint.rect("head", "left", 3, 4, 2, 2, skinShadow);
    paint.rect("head", "right", 3, 4, 2, 2, skinShadow);

    // Base body (underclothes)
    paint.fill("torso", "all", "#2b303a");
    paint.fill("armR", "all", skinTone);
    paint.fill("armL", "all", skinTone);
    paint.fill("legR", "all", "#1b1d22");
    paint.fill("legL", "all", "#1b1d22");
  });
}

// Zhang Beihai's Space Force Officer Uniform (地面军装)
export function createZhangBeihaiUniform(): ReturnType<typeof createSkin> {
  return createSkin((paint) => {
    const tunicDark = "#1f3127";
    const tunicLight = "#283f33";
    const goldRank = "#d4af37";
    const redTab = "#991b1b";
    const whiteShirt = "#f3f4f6";
    const tie = "#111827";
    const belt = "#0f172a";
    const buckle = "#cbd5e1";
    const pants = "#1a2a21";
    const boots = "#09090b";

    // Torso uniform
    paint.fill("torso", "all", tunicDark);
    paint.grain("torso", "all", 0.04, 101);

    // Shirt collar and tie
    paint.rect("torso", "front", 3, 0, 2, 2, whiteShirt);
    paint.rect("torso", "front", 3, 2, 2, 3, tie);

    // Collar rank tabs (PLA/Space Force golden rank insignias)
    paint.rect("torso", "front", 1, 0, 1, 2, redTab);
    paint.px("torso", "front", 1, 1, goldRank);
    paint.rect("torso", "front", 6, 0, 1, 2, redTab);
    paint.px("torso", "front", 6, 1, goldRank);

    // Chest pocket lines & ribbons
    paint.rect("torso", "front", 1, 4, 2, 1, goldRank);
    paint.rect("torso", "front", 5, 4, 2, 1, tunicLight);

    // Belt & silver buckle
    rectRingTorso(paint, 10, 2, belt);
    paint.rect("torso", "front", 3, 10, 2, 2, buckle);

    // Arms: Uniform sleeves and cuff seams
    for (const arm of ["armR", "armL"] as const) {
      paint.fill(arm, "all", tunicDark);
      rectLimb(paint, arm, 9, 1, goldRank); // cuff stripe
      rectLimb(paint, arm, 10, 2, "#d4a373"); // hands
    }

    // Legs: Uniform trousers and polished officer boots
    for (const leg of ["legR", "legL"] as const) {
      paint.fill(leg, "all", pants);
      rectLimb(paint, leg, 8, 4, boots); // high boots
    }
  }, { transparent: true });
}

// Zhang Beihai's Orbital EVA Spacesuit (舱外航天服)
export function createSpacesuitSkin(options: {
  visorType?: "gold" | "transparent";
  leaderStripe?: boolean;
} = {}): ReturnType<typeof createSkin> {
  const { visorType = "gold", leaderStripe = false } = options;

  return createSkin((paint) => {
    const suitWhite = "#f1f5f9";
    const suitShadow = "#cbd5e1";
    const stripeBlue = "#1d4ed8";
    const stripeRed = "#dc2626";
    const sealJoint = "#475569";
    const packDark = "#1e293b";
    const bootDark = "#334155";
    const ledGreen = "#22c55e";
    const ledAmber = "#f59e0b";

    // 1. Helmet Shell (on Head clothing layer)
    paint.fill("head", "all", suitWhite);
    paint.grain("head", "all", 0.03, 201);

    // Visor on head front
    if (visorType === "gold") {
      // Golden reflective thermal coating
      paint.rect("head", "front", 1, 2, 6, 4, "#d97706");
      paint.rect("head", "front", 2, 2, 4, 3, "#fbbf24");
      paint.px("head", "front", 2, 2, "#fef3c7"); // glint highlight
      paint.px("head", "front", 3, 3, "#fef3c7");
    } else {
      // Transparent visor: clear center so face shows, white reflection arcs at perimeter
      paint.erase("head", "front", 1, 2, 6, 4);
      paint.px("head", "front", 1, 2, "#ffffff"); // corner specular
      paint.px("head", "front", 6, 2, "#ffffff");
      paint.px("head", "front", 1, 5, "#ffffff");
      paint.px("head", "front", 6, 5, "#ffffff");
    }

    // Helmet neck seal ring
    paint.rect("head", "bottom", 1, 1, 6, 6, sealJoint);

    // 2. Torso (Life support suit)
    paint.fill("torso", "all", suitWhite);
    paint.grain("torso", "all", 0.03, 301);

    // Chest Life Support & Telemetry Module (PLSS interface)
    paint.rect("torso", "front", 1, 2, 6, 7, packDark);
    paint.px("torso", "front", 2, 3, ledGreen);
    paint.px("torso", "front", 3, 3, ledAmber);
    paint.rect("torso", "front", 2, 5, 4, 3, "#0f172a");

    // Mission stripes on shoulders
    paint.rect("torso", "front", 0, 0, 8, 1, leaderStripe ? stripeRed : stripeBlue);
    paint.rect("torso", "front", 0, 1, 8, 1, leaderStripe ? "#fbbf24" : suitShadow);

    // Utility belt & tether ring
    rectRingTorso(paint, 10, 2, sealJoint);
    paint.rect("torso", "front", 3, 10, 2, 2, "#94a3b8");

    // 3. Arms (Pressurized joint rings & gloves)
    for (const arm of ["armR", "armL"] as const) {
      paint.fill(arm, "all", suitWhite);
      rectLimb(paint, arm, 4, 1, sealJoint); // elbow joint ring
      rectLimb(paint, arm, 7, 1, leaderStripe ? stripeRed : stripeBlue);
      rectLimb(paint, arm, 8, 4, "#64748b"); // thermal EVA gloves
      rectLimb(paint, arm, 11, 1, "#334155"); // reinforced fingertips
    }

    // 4. Legs (Knee joints and magnetic boots)
    for (const leg of ["legR", "legL"] as const) {
      paint.fill(leg, "all", suitWhite);
      rectLimb(paint, leg, 4, 1, sealJoint); // knee seal
      rectLimb(paint, leg, 8, 4, bootDark); // EVA space boots
      paint.rect(leg, "bottom", 0, 0, 4, 4, "#0f172a"); // magnetic sole
    }
  }, { transparent: true });
}

// ==========================================
// 2. THE COLLECTOR (陨石收藏者)
// ==========================================

export function createCollectorBody(): ReturnType<typeof createSkin> {
  return createSkin((paint) => {
    const skinTone = "#d9a574";
    const skinShadow = "#c28956";
    const greyHair = "#64748b";
    const silverHair = "#94a3b8";
    const glassesFrame = "#38bdf8";
    const glassesLens = "#e0f2fe";
    const warmSmile = "#a85555";

    paint.fill("head", "all", skinTone);

    // Hair: Receding hairline with grey/silver sides and top
    paint.fill("head", "top", greyHair);
    paint.px("head", "top", 3, 3, silverHair);
    paint.px("head", "top", 4, 3, silverHair);
    paint.fill("head", "back", greyHair);
    paint.fill("head", "left", greyHair);
    paint.fill("head", "right", greyHair);
    paint.rect("head", "front", 0, 0, 8, 1, greyHair);
    paint.px("head", "front", 0, 1, greyHair);
    paint.px("head", "front", 7, 1, greyHair);

    // Face: Friendly eyes behind round wireframe reading glasses
    // Glasses frames and gentle crinkling eyes
    paint.rect("head", "front", 1, 3, 2, 2, glassesFrame);
    paint.rect("head", "front", 5, 3, 2, 2, glassesFrame);
    paint.px("head", "front", 3, 3, glassesFrame); // bridge
    paint.px("head", "front", 4, 3, glassesFrame);
    paint.px("head", "front", 2, 4, glassesLens);
    paint.px("head", "front", 6, 4, glassesLens);
    paint.px("head", "front", 2, 3, "#0f172a"); // pupil
    paint.px("head", "front", 6, 3, "#0f172a");

    // Cheerful warm smile
    paint.rect("head", "front", 2, 6, 4, 1, warmSmile);
    paint.px("head", "front", 3, 5, skinShadow); // friendly laugh lines
    paint.px("head", "front", 4, 5, skinShadow);

    paint.fill("torso", "all", "#334155");
    paint.fill("armR", "all", skinTone);
    paint.fill("armL", "all", skinTone);
    paint.fill("legR", "all", "#1e293b");
    paint.fill("legL", "all", "#1e293b");
  });
}

export function createCollectorClothes(): ReturnType<typeof createSkin> {
  return createSkin((paint) => {
    const vestBurgundy = "#581c1c";
    const vestLight = "#7f1d1d";
    const shirtBeige = "#fef3c7";
    const trousersBrown = "#451a03";
    const shoes = "#292524";

    // Wool knit vest over collared shirt
    paint.fill("torso", "all", vestBurgundy);
    paint.grain("torso", "all", 0.05, 401);

    // Collared shirt opening at neck
    paint.rect("torso", "front", 3, 0, 2, 3, shirtBeige);
    paint.px("torso", "front", 3, 2, "#991b1b"); // small tie or button

    // Vest hem
    paint.rect("torso", "front", 0, 10, 8, 2, vestLight);

    // Arms: Shirt sleeves with rolled-up cuffs
    for (const arm of ["armR", "armL"] as const) {
      paint.fill(arm, "all", shirtBeige);
      rectLimb(paint, arm, 7, 2, "#fde68a"); // rolled cuff
      rectLimb(paint, arm, 9, 3, "#d9a574"); // bare forearm & hand
    }

    // Legs: Brown trousers and soft house loafers
    for (const leg of ["legR", "legL"] as const) {
      paint.fill(leg, "all", trousersBrown);
      rectLimb(paint, leg, 9, 3, shoes);
    }
  }, { transparent: true });
}

// ==========================================
// 3. FACTORY HELPERS
// ==========================================

export interface CharacterSet {
  beihaiUniform: Figure;
  beihaiSpacesuit: Figure;
  collector: Figure;
  delegates: Figure[];
  photographer: Figure;
}

export function assembleCharacters(): CharacterSet {
  // 1. Zhang Beihai in military uniform
  const beihaiBodySkin = createZhangBeihaiBody();
  const beihaiUniformSkin = createZhangBeihaiUniform();
  const beihaiUniform = createFigure({
    body: beihaiBodySkin.texture,
    clothes: beihaiUniformSkin.texture,
    heightM: 1.82,
  });

  // 2. Zhang Beihai in EVA spacesuit
  const beihaiSuitSkin = createSpacesuitSkin({ visorType: "gold" });
  const beihaiSpacesuit = createFigure({
    body: beihaiBodySkin.texture,
    clothes: beihaiSuitSkin.texture,
    heightM: 1.84,
  });

  // 3. Collector
  const collectorBodySkin = createCollectorBody();
  const collectorClothesSkin = createCollectorClothes();
  const collector = createFigure({
    body: collectorBodySkin.texture,
    clothes: collectorClothesSkin.texture,
    heightM: 1.74,
  });

  // 4. Delegates (老航天与会者)
  const delegateSkins = [
    createSpacesuitSkin({ visorType: "gold", leaderStripe: true }),
    createSpacesuitSkin({ visorType: "gold", leaderStripe: true }),
    createSpacesuitSkin({ visorType: "gold", leaderStripe: true }),
    createSpacesuitSkin({ visorType: "gold", leaderStripe: false }),
    createSpacesuitSkin({ visorType: "gold", leaderStripe: false }),
    createSpacesuitSkin({ visorType: "gold", leaderStripe: false }),
    createSpacesuitSkin({ visorType: "gold", leaderStripe: false }),
    createSpacesuitSkin({ visorType: "gold", leaderStripe: false }),
  ];

  const delegates: Figure[] = delegateSkins.map((skin, i) =>
    createFigure({
      body: beihaiBodySkin.texture,
      clothes: skin.texture,
      heightM: 1.78 + (i % 3) * 0.03,
    })
  );

  // 5. Photographer
  const photoSkin = createSpacesuitSkin({ visorType: "gold", leaderStripe: false });
  const photographer = createFigure({
    body: beihaiBodySkin.texture,
    clothes: photoSkin.texture,
    heightM: 1.76,
  });

  return {
    beihaiUniform,
    beihaiSpacesuit,
    collector,
    delegates,
    photographer,
  };
}

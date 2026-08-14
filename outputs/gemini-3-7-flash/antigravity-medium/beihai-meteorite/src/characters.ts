import * as THREE from "three";
import {
  createFigure,
  createSkin,
  type FaceName,
  type Figure,
  type SkinPainter,
} from "@agentbench/voxel-kit";

const ALL_SIDES: FaceName[] = ["front", "back", "left", "right"];

/**
 * 1. Zhang Beihai - Body Skin (Head, Hands, Base)
 */
export function createZhangBeihaiBodySkin() {
  return createSkin((p: SkinPainter) => {
    // Skin base tone
    const skinTone = "#d9ad88";
    const hairColor = "#1a1b1e";
    const eyeWhite = "#eaecee";
    const pupil = "#141517";
    const eyebrow = "#222326";
    const lip = "#b37b60";

    // HEAD
    p.fill("head", "all", skinTone);

    // Hair: short military crew cut (top, back, left, right, upper front)
    p.fill("head", "top", hairColor);
    p.fill("head", "back", hairColor);
    p.fill("head", "left", hairColor);
    p.fill("head", "right", hairColor);
    // Hair on sides trimmed shorter (fade)
    p.rect("head", "left", 0, 4, 8, 4, "#2a2b2f");
    p.rect("head", "right", 0, 4, 8, 4, "#2a2b2f");
    p.rect("head", "back", 0, 5, 8, 3, "#2a2b2f");
    // Hairline on front
    p.rect("head", "front", 0, 0, 8, 2, hairColor);

    // Face features (front)
    // Resolute, sharp eyebrows
    p.rect("head", "front", 1, 2, 3, 1, eyebrow);
    p.rect("head", "front", 4, 2, 3, 1, eyebrow);

    // Calm, focused eyes
    p.rect("head", "front", 1, 3, 2, 1, eyeWhite);
    p.px("head", "front", 2, 3, pupil);
    p.rect("head", "front", 5, 3, 2, 1, eyeWhite);
    p.px("head", "front", 5, 3, pupil);

    // Firm, straight mouth
    p.rect("head", "front", 3, 6, 2, 1, lip);

    // Subtle cheekbone shadow
    p.px("head", "front", 0, 4, "#c79772");
    p.px("head", "front", 7, 4, "#c79772");

    // Limbs and torso base
    p.fill("torso", "all", "#3a4438");
    p.fill("armR", "all", skinTone);
    p.fill("armL", "all", skinTone);
    p.fill("legR", "all", "#2b3329");
    p.fill("legL", "all", "#2b3329");

    // Hands
    p.rect("armR", "front", 0, 9, 4, 3, skinTone);
    p.rect("armL", "front", 0, 9, 4, 3, skinTone);
  });
}

/**
 * 2. Zhang Beihai - Military Officer Uniform Clothing Shell
 */
export function createZhangBeihaiUniformClothes() {
  return createSkin(
    (p: SkinPainter) => {
      const uniformGreen = "#384734";
      const darkGreen = "#2b3828";
      const collarRed = "#a82424";
      const gold = "#cfa838";
      const beltBrown = "#332215";
      const beltBuckle = "#dfb945";
      const trouserDark = "#232d20";
      const bootBlack = "#181a18";

      // Torso: Officer tunic
      p.fill("torso", "all", uniformGreen);
      p.grain("torso", "all", 0.08, 12);

      // Standup military collar with red & gold insignia
      p.rect("torso", "front", 2, 0, 4, 2, darkGreen);
      p.px("torso", "front", 2, 0, collarRed);
      p.px("torso", "front", 2, 1, gold);
      p.px("torso", "front", 5, 0, collarRed);
      p.px("torso", "front", 5, 1, gold);

      // Officer service ribbon bar & golden buttons
      p.rect("torso", "front", 1, 3, 2, 1, "#28529e"); // Blue ribbon
      p.rect("torso", "front", 3, 3, 1, 1, "#c03838"); // Red ribbon
      p.px("torso", "front", 4, 4, gold);
      p.px("torso", "front", 4, 6, gold);
      p.px("torso", "front", 4, 8, gold);

      // Leather service belt & brass buckle
      for (const face of ALL_SIDES) {
        p.rect("torso", face, 0, 10, face === "front" || face === "back" ? 8 : 4, 2, beltBrown);
      }
      p.rect("torso", "front", 3, 10, 2, 2, beltBuckle);

      // Arms: Tunic sleeves
      p.fill("armR", "all", uniformGreen);
      p.fill("armL", "all", uniformGreen);
      p.grain("armR", "all", 0.06, 15);
      p.grain("armL", "all", 0.06, 16);
      // Cuffs
      for (const face of ALL_SIDES) {
        p.rect("armR", face, 0, 9, 4, 1, darkGreen);
        p.rect("armL", face, 0, 9, 4, 1, darkGreen);
      }
      // Gold shoulder boards / epaulets
      p.rect("armR", "top", 0, 0, 4, 4, gold);
      p.rect("armL", "top", 0, 0, 4, 4, gold);

      // Legs: Service trousers & polished black riding boots
      p.fill("legR", "all", trouserDark);
      p.fill("legL", "all", trouserDark);
      p.grain("legR", "all", 0.05, 17);
      p.grain("legL", "all", 0.05, 18);
      // Boots
      for (const face of ALL_SIDES) {
        p.rect("legR", face, 0, 7, 4, 5, bootBlack);
        p.rect("legL", face, 0, 7, 4, 5, bootBlack);
      }
    },
    { transparent: true },
  );
}

/**
 * 3. Zhang Beihai - High-Tech EVA Spacesuit Clothing Shell
 */
export function createSpacesuitClothes(nameTag = "ZHANG B.H.") {
  return createSkin(
    (p: SkinPainter) => {
      const suitWhite = "#e6edf2";
      const suitGrey = "#b8c4ce";
      const jointDark = "#424b54";
      const visorGold = "#d4a234";
      const patchBlue = "#1d4486";
      const patchRed = "#b82424";

      // Head: Astronaut Helmet with gold reflective visor
      p.fill("head", "all", suitWhite);
      p.rect("head", "front", 1, 2, 6, 4, visorGold);
      // Visor highlight
      p.rect("head", "front", 2, 2, 2, 1, "#f5e6a8");
      // Helmet neck seal
      for (const face of ALL_SIDES) {
        p.rect("head", face, 0, 7, 8, 1, jointDark);
      }

      // Torso: Pressurized suit & life-support chest pack
      p.fill("torso", "all", suitWhite);
      p.grain("torso", "all", 0.05, 33);
      // Chest control unit
      p.rect("torso", "front", 2, 3, 4, 4, suitGrey);
      p.px("torso", "front", 2, 4, "#22c55e"); // Green LED
      p.px("torso", "front", 3, 4, "#ef4444"); // Red LED
      p.px("torso", "front", 4, 4, "#3b82f6"); // Blue LED
      // Space Force Mission Badge
      p.rect("torso", "front", 1, 1, 2, 1, patchBlue);
      p.px("torso", "front", 2, 1, patchRed);
      // Waist harness
      for (const face of ALL_SIDES) {
        p.rect("torso", face, 0, 10, face === "front" || face === "back" ? 8 : 4, 2, jointDark);
      }

      // Arms: Thick articulated pressure sleeves
      p.fill("armR", "all", suitWhite);
      p.fill("armL", "all", suitWhite);
      for (const face of ALL_SIDES) {
        p.rect("armR", face, 0, 5, 4, 2, jointDark); // Elbow joints
        p.rect("armL", face, 0, 5, 4, 2, jointDark);
        p.rect("armR", face, 0, 9, 4, 3, suitGrey); // Gloves
        p.rect("armL", face, 0, 9, 4, 3, suitGrey);
      }

      // Legs: Heavy moon/space boots
      p.fill("legR", "all", suitWhite);
      p.fill("legL", "all", suitWhite);
      for (const face of ALL_SIDES) {
        p.rect("legR", face, 0, 4, 4, 2, jointDark); // Knee joints
        p.rect("legL", face, 0, 4, 4, 2, jointDark);
        p.rect("legR", face, 0, 8, 4, 4, suitGrey); // Boots
        p.rect("legL", face, 0, 8, 4, 4, suitGrey);
      }
    },
    { transparent: true },
  );
}

/**
 * 4. The Meteorite Collector - Friendly 50-year-old retired surveyor
 */
export function createCollectorBodySkin() {
  return createSkin((p: SkinPainter) => {
    const skinTone = "#dcb494";
    const hairGrey = "#666460";
    const pupil = "#262320";
    const glasses = "#b39149";
    const lip = "#b87c64";

    // HEAD
    p.fill("head", "all", skinTone);

    // Grey-streaked receding hair
    p.fill("head", "top", hairGrey);
    p.fill("head", "back", hairGrey);
    p.fill("head", "left", hairGrey);
    p.fill("head", "right", hairGrey);
    p.rect("head", "front", 0, 0, 8, 1, hairGrey);
    p.px("head", "front", 0, 1, hairGrey);
    p.px("head", "front", 7, 1, hairGrey);

    // Warm, smiling eyes with glasses frames
    p.rect("head", "front", 1, 3, 2, 2, glasses);
    p.rect("head", "front", 5, 3, 2, 2, glasses);
    p.px("head", "front", 3, 3, glasses);
    p.px("head", "front", 4, 3, glasses);

    p.px("head", "front", 2, 4, pupil);
    p.px("head", "front", 5, 4, pupil);

    // Warm smile with laugh wrinkles
    p.rect("head", "front", 3, 6, 2, 1, lip);
    p.px("head", "front", 2, 5, "#c49878");
    p.px("head", "front", 5, 5, "#c49878");

    // Limbs
    p.fill("torso", "all", "#484950");
    p.fill("armR", "all", skinTone);
    p.fill("armL", "all", skinTone);
    p.fill("legR", "all", "#4a3c30");
    p.fill("legL", "all", "#4a3c30");
  });
}

export function createCollectorClothes() {
  return createSkin(
    (p: SkinPainter) => {
      const cardigan = "#454854";
      const shirtBeige = "#dcd6c8";
      const trousers = "#544234";
      const shoes = "#2a221a";

      // Torso: Cardigan over collared shirt
      p.fill("torso", "all", cardigan);
      p.grain("torso", "all", 0.08, 41);
      // V-neck opening showing beige shirt
      p.rect("torso", "front", 3, 0, 2, 3, shirtBeige);
      p.px("torso", "front", 3, 3, cardigan);
      p.px("torso", "front", 4, 3, cardigan);
      p.px("torso", "front", 4, 5, "#c0a060"); // Button

      // Arms: Wool knit sleeves
      p.fill("armR", "all", cardigan);
      p.fill("armL", "all", cardigan);

      // Legs: Corduroy trousers & comfortable house shoes
      p.fill("legR", "all", trousers);
      p.fill("legL", "all", trousers);
      p.grain("legR", "all", 0.06, 42);
      p.grain("legL", "all", 0.06, 43);
      for (const face of ALL_SIDES) {
        p.rect("legR", face, 0, 10, 4, 2, shoes);
        p.rect("legL", face, 0, 10, 4, 2, shoes);
      }
    },
    { transparent: true },
  );
}

/**
 * Helper to construct character figures
 */
export function buildZhangBeihaiFigure(): Figure {
  const body = createZhangBeihaiBodySkin();
  const uniform = createZhangBeihaiUniformClothes();
  return createFigure({
    body: body.texture,
    clothes: uniform.texture,
    heightM: 1.82,
    arm: "classic",
  });
}

export function buildCollectorFigure(): Figure {
  const body = createCollectorBodySkin();
  const clothes = createCollectorClothes();
  return createFigure({
    body: body.texture,
    clothes: clothes.texture,
    heightM: 1.74,
    arm: "classic",
  });
}

export function buildAstronautFigure(id: number): Figure {
  const body = createZhangBeihaiBodySkin();
  const suit = createSpacesuitClothes(`ASTRONAUT ${id}`);
  return createFigure({
    body: body.texture,
    clothes: suit.texture,
    heightM: 1.78,
    arm: "classic",
  });
}

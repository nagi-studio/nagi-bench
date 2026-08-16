import { createSkin } from "@agentbench/voxel-kit";

/**
 * All identity lives in the 64x64 body/clothes sheets. Everything here is
 * painted texels — never protruding geometry.
 */

// ---------------------------------------------------------------------------
// Body painters
// ---------------------------------------------------------------------------

export function zhangBody() {
  return createSkin((p) => {
    p.fill("head", "all", "#d9a678");
    p.fill("torso", "all", "#d9a678");
    p.fill("armR", "all", "#d9a678");
    p.fill("armL", "all", "#d9a678");
    p.fill("legR", "all", "#d9a678");
    p.fill("legL", "all", "#d9a678");
    // short dark military hair
    p.fill("head", "top", "#181a1f");
    p.fill("head", "back", "#181a1f");
    p.rect("head", "front", 0, 0, 8, 2, "#181a1f");
    p.rect("head", "left", 0, 0, 8, 2, "#181a1f");
    p.rect("head", "right", 0, 0, 8, 2, "#181a1f");
    // brows — calm, level
    p.rect("head", "front", 1, 3, 1, 1, "#2c2e33");
    p.rect("head", "front", 5, 3, 1, 1, "#2c2e33");
    // eyes
    p.rect("head", "front", 1, 4, 1, 1, "#17181c");
    p.rect("head", "front", 5, 4, 1, 1, "#17181c");
    // firm mouth
    p.rect("head", "front", 3, 6, 2, 1, "#8a4b3d");
  });
}

export function collectorBody() {
  return createSkin((p) => {
    p.fill("head", "all", "#d2a17a");
    p.fill("torso", "all", "#d2a17a");
    p.fill("armR", "all", "#d2a17a");
    p.fill("armL", "all", "#d2a17a");
    p.fill("legR", "all", "#d2a17a");
    p.fill("legL", "all", "#d2a17a");
    // receding grey hair
    p.fill("head", "top", "#c9c9ce");
    p.fill("head", "back", "#c9c9ce");
    p.rect("head", "front", 0, 0, 8, 1, "#c9c9ce");
    p.rect("head", "left", 0, 0, 8, 2, "#c9c9ce");
    p.rect("head", "right", 0, 0, 8, 2, "#c9c9ce");
    // warm eyes
    p.rect("head", "front", 1, 4, 1, 1, "#17181c");
    p.rect("head", "front", 5, 4, 1, 1, "#17181c");
    // reading glasses — thin dark bridge
    p.rect("head", "front", 0, 3, 8, 1, "#3a3028");
    // grey moustache
    p.rect("head", "front", 2, 6, 4, 1, "#b7b7bd");
  });
}

export function genericBody() {
  return createSkin((p) => {
    p.fill("head", "all", "#d9a678");
    p.fill("torso", "all", "#d9a678");
    p.fill("armR", "all", "#d9a678");
    p.fill("armL", "all", "#d9a678");
    p.fill("legR", "all", "#d9a678");
    p.fill("legL", "all", "#d9a678");
    p.fill("head", "top", "#2c2e33");
    p.fill("head", "back", "#2c2e33");
    p.rect("head", "front", 0, 0, 8, 2, "#2c2e33");
    p.rect("head", "left", 0, 0, 8, 2, "#2c2e33");
    p.rect("head", "right", 0, 0, 8, 2, "#2c2e33");
    p.rect("head", "front", 1, 4, 1, 1, "#17181c");
    p.rect("head", "front", 5, 4, 1, 1, "#17181c");
    p.rect("head", "front", 3, 6, 2, 1, "#8a4b3d");
  });
}

// ---------------------------------------------------------------------------
// Clothing painters
// ---------------------------------------------------------------------------

/** Zhang's Space Force dress uniform (Earth scenes). */
export function zhangUniform() {
  return createSkin(
    (p) => {
      // navy uniform body
      p.fill("torso", "all", "#2b3544");
      p.fill("armR", "all", "#2b3544");
      p.fill("armL", "all", "#2b3544");
      p.fill("legR", "all", "#222a35");
      p.fill("legL", "all", "#222a35");
      // standing collar
      p.rect("torso", "front", 0, 0, 8, 1, "#1b222c");
      p.rect("torso", "back", 0, 0, 8, 1, "#1b222c");
      // shoulder boards
      p.rect("torso", "top", 0, 0, 2, 4, "#c9a15a");
      p.rect("torso", "top", 6, 0, 2, 4, "#c9a15a");
      // chest ribbon bar
      p.rect("torso", "front", 1, 2, 3, 1, "#c9a15a");
      p.rect("torso", "front", 1, 3, 3, 1, "#8f6b3a");
      // belt
      p.rect("torso", "front", 0, 9, 8, 1, "#151a20");
      p.rect("torso", "back", 0, 9, 8, 1, "#151a20");
      // trousers crease
      p.rect("legR", "front", 1, 0, 1, 12, "#1c232d");
      p.rect("legL", "front", 1, 0, 1, 12, "#1c232d");
    },
    { transparent: true },
  );
}

/** Zhang's EVA spacesuit (space scenes), open-face helmet showing the actor. */
export function zhangSpaceSuit() {
  return createSkin(
    (p) => {
      p.fill("torso", "all", "#e7e8ec");
      p.fill("armR", "all", "#e7e8ec");
      p.fill("armL", "all", "#e7e8ec");
      p.fill("legR", "all", "#dde0e5");
      p.fill("legL", "all", "#dde0e5");
      // gold/orange service stripes
      p.rect("torso", "front", 0, 4, 8, 2, "#c8873a");
      p.rect("torso", "back", 0, 4, 8, 2, "#c8873a");
      p.rect("armR", "front", 0, 8, 4, 1, "#c8873a");
      p.rect("armL", "front", 0, 8, 4, 1, "#c8873a");
      p.rect("legR", "front", 0, 3, 4, 1, "#c8873a");
      p.rect("legL", "front", 0, 3, 4, 1, "#c8873a");
      // life-support pack on back
      p.rect("torso", "back", 0, 1, 8, 9, "#c7cad2");
      p.rect("torso", "back", 2, 2, 4, 3, "#9aa0ab");
      // chest control panel
      p.rect("torso", "front", 3, 1, 2, 2, "#8a4a2a");
      p.rect("torso", "front", 3, 1, 1, 1, "#7fd0c0");
      // HELMET — white shell, open visor window
      p.fill("head", "all", "#eceef2");
      p.fill("head", "top", "#f3f4f7");
      p.erase("head", "front", 1, 1, 6, 6);
      // gold visor frame
      p.rect("head", "front", 0, 0, 8, 1, "#cda94a");
      p.rect("head", "front", 0, 7, 8, 1, "#cda94a");
      p.rect("head", "front", 0, 0, 1, 8, "#cda94a");
      p.rect("head", "front", 7, 0, 1, 8, "#cda94a");
      // side status lamp
      p.rect("head", "left", 2, 2, 1, 1, "#7fd0c0");
      p.rect("head", "right", 2, 2, 1, 1, "#7fd0c0");
    },
    { transparent: true },
  );
}

/** Anonymous crew spacesuit with an opaque gold visor. */
export function crewSuit(accent = "#c8873a") {
  return createSkin(
    (p) => {
      p.fill("torso", "all", "#dfe2e7");
      p.fill("armR", "all", "#dfe2e7");
      p.fill("armL", "all", "#dfe2e7");
      p.fill("legR", "all", "#d6d9df");
      p.fill("legL", "all", "#d6d9df");
      p.rect("torso", "front", 0, 4, 8, 2, accent);
      p.rect("armR", "front", 0, 8, 4, 1, accent);
      p.rect("armL", "front", 0, 8, 4, 1, accent);
      p.rect("legR", "front", 0, 3, 4, 1, accent);
      p.rect("legL", "front", 0, 3, 4, 1, accent);
      p.rect("torso", "back", 0, 1, 8, 9, "#bfc3cb");
      // helmet
      p.fill("head", "all", "#e9ebef");
      p.fill("head", "top", "#f0f1f5");
      // opaque gold visor
      p.rect("head", "front", 1, 1, 6, 6, "#c9a24a");
      p.rect("head", "front", 1, 1, 6, 1, "#e0bf66");
      // status lamp
      p.rect("head", "left", 2, 2, 1, 1, "#7fd0c0");
    },
    { transparent: true },
  );
}

/** Cracked, bloodied visor variant for impact shots. */
export function crewSuitHit(accent = "#c8873a") {
  return createSkin(
    (p) => {
      p.fill("torso", "all", "#dfe2e7");
      p.fill("armR", "all", "#dfe2e7");
      p.fill("armL", "all", "#dfe2e7");
      p.fill("legR", "all", "#d6d9df");
      p.fill("legL", "all", "#d6d9df");
      p.rect("torso", "front", 0, 4, 8, 2, accent);
      p.rect("torso", "back", 0, 1, 8, 9, "#bfc3cb");
      // helmet
      p.fill("head", "all", "#e9ebef");
      p.fill("head", "top", "#f0f1f5");
      // shattered visor — cracked gold with red spray
      p.rect("head", "front", 1, 1, 6, 6, "#8f8f96");
      p.rect("head", "front", 1, 1, 6, 1, "#d7c08a");
      p.rect("head", "front", 2, 2, 1, 4, "#3c3c42");
      p.rect("head", "front", 4, 2, 1, 3, "#3c3c42");
      p.rect("head", "front", 3, 3, 1, 2, "#3c3c42");
      p.rect("head", "front", 5, 1, 1, 3, "#a33a2e");
      p.rect("head", "front", 1, 4, 2, 1, "#a33a2e");
      p.rect("head", "front", 3, 5, 2, 1, "#a33a2e");
      p.rect("head", "front", 4, 4, 2, 2, "#5c1510");
    },
    { transparent: true },
  );
}

/** Collector's casual cardigan. */
export function collectorClothes() {
  return createSkin(
    (p) => {
      p.fill("torso", "all", "#7a5b42");
      p.fill("armR", "all", "#7a5b42");
      p.fill("armL", "all", "#7a5b42");
      p.fill("legR", "all", "#4a4138");
      p.fill("legL", "all", "#4a4138");
      // open cardigan front (shirt underneath)
      p.rect("torso", "front", 1, 0, 6, 12, "#cfc6b4");
      p.rect("torso", "front", 3, 0, 2, 12, "#7a5b42");
      // buttons
      p.rect("torso", "front", 3, 2, 1, 1, "#2b2320");
      p.rect("torso", "front", 3, 5, 1, 1, "#2b2320");
      p.rect("torso", "front", 3, 8, 1, 1, "#2b2320");
      // rolled sleeves reveal shirt
      p.rect("armR", "front", 0, 9, 4, 3, "#cfc6b4");
      p.rect("armL", "front", 0, 9, 4, 3, "#cfc6b4");
    },
    { transparent: true },
  );
}

export const allSkins = {
  zhangBody,
  zhangUniform,
  zhangSpaceSuit,
  collectorBody,
  collectorClothes,
  genericBody,
  crewSuit,
  crewSuitHit,
};

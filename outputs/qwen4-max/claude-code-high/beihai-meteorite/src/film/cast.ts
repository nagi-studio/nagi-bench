import * as THREE from "three";
import {
  createSkin, createFigure, voxelModel, voxelMaterial, buildVoxelGeometry,
  type Figure, type Skin, type SkinPainter,
} from "@agentbench/voxel-kit";

/* ------------------------------------------------------------------ */
/* Face painting helpers — identity is texels, never geometry.         */
/* ------------------------------------------------------------------ */

function paintHeadBase(p: SkinPainter, skin: string, hair: string, hairStyle: "short" | "receding" | "grey") {
  p.fill("head", "all", skin);
  // hair cap
  p.fill("head", "top", hair);
  p.fill("head", "back", hair);
  p.rect("head", "front", 0, 0, 8, hairStyle === "receding" ? 1 : 2, hair);
  p.rect("head", "left", 0, 0, 8, hairStyle === "receding" ? 1 : 2, hair);
  p.rect("head", "right", 0, 0, 8, hairStyle === "receding" ? 1 : 2, hair);
  if (hairStyle !== "receding") {
    p.rect("head", "front", 0, 2, 1, 2, hair);
    p.rect("head", "front", 7, 2, 1, 2, hair);
  }
  // ears hint
  p.px("head", "left", 3, 4, shade(skin, -18));
  p.px("head", "right", 3, 4, shade(skin, -18));
}

function shade(hex: string, amt: number): string {
  const c = new THREE.Color(hex);
  const f = 1 + amt / 100;
  c.r = Math.min(1, Math.max(0, c.r * f));
  c.g = Math.min(1, Math.max(0, c.g * f));
  c.b = Math.min(1, Math.max(0, c.b * f));
  return "#" + c.getHexString();
}

function paintEyes(p: SkinPainter, eye: string, brow: string, y = 3) {
  p.rect("head", "front", 1, y - 1, 2, 1, brow);
  p.rect("head", "front", 5, y - 1, 2, 1, brow);
  p.rect("head", "front", 1, y, 2, 1, "#efe7d8");
  p.rect("head", "front", 5, y, 2, 1, "#efe7d8");
  p.px("head", "front", 2, y, eye);
  p.px("head", "front", 5, y, eye);
}

/* ------------------------------------------------------------------ */
/* Zhang Beihai — calm, resolute, a soldier who carries the future.    */
/* ------------------------------------------------------------------ */

export function zhangBody(): Skin {
  return createSkin((p) => {
    paintHeadBase(p, "#c9905f", "#191a20", "short");
    paintEyes(p, "#20242c", "#241c14", 3);
    p.rect("head", "front", 3, 4, 2, 1, shade("#c9905f", -14)); // nose
    p.rect("head", "front", 2, 5, 4, 1, "#7c4a38"); // firm mouth
    p.px("head", "front", 1, 5, shade("#c9905f", -10));
    p.px("head", "front", 6, 5, shade("#c9905f", -10));
    p.rect("head", "front", 0, 6, 8, 2, shade("#c9905f", -8)); // jaw
    p.grain("head", "all", 0.05, 7);
    // bare body under clothes (hands / neck)
    p.fill("torso", "all", "#c9905f");
    p.fill("armR", "all", "#c9905f");
    p.fill("armL", "all", "#c9905f");
    p.fill("legR", "all", "#c9905f");
    p.fill("legL", "all", "#c9905f");
  });
}

export function zhangUniform(): Skin {
  return createSkin((p) => {
    const u = "#33413a";
    p.fill("torso", "all", u);
    p.fill("armR", "all", u);
    p.fill("armL", "all", u);
    p.fill("legR", "all", "#2a3630");
    p.fill("legL", "all", "#2a3630");
    // collar + placket
    p.rect("torso", "front", 0, 0, 8, 1, shade(u, -16));
    p.rect("torso", "front", 3, 1, 2, 8, shade(u, -8));
    // red collar tabs
    p.rect("torso", "front", 1, 1, 1, 1, "#b23230");
    p.rect("torso", "front", 6, 1, 1, 1, "#b23230");
    // chest pockets
    p.rect("torso", "front", 1, 4, 2, 2, shade(u, -10));
    p.rect("torso", "front", 5, 4, 2, 2, shade(u, -10));
    p.px("torso", "front", 1, 4, "#c9a24a");
    p.px("torso", "front", 6, 4, "#c9a24a");
    // belt
    p.rect("torso", "front", 0, 9, 8, 1, "#17181a");
    p.rect("torso", "front", 3, 9, 2, 1, "#c9a24a");
    // boots
    p.rect("legR", "front", 0, 10, 4, 2, "#141410");
    p.rect("legL", "front", 0, 10, 4, 2, "#141410");
    p.rect("legR", "back", 0, 10, 4, 2, "#141410");
    p.rect("legL", "back", 0, 10, 4, 2, "#141410");
    // shoulder seams
    p.rect("armR", "front", 0, 0, 4, 1, shade(u, -14));
    p.rect("armL", "front", 0, 0, 4, 1, shade(u, -14));
    p.grain("torso", "all", 0.06, 3);
    p.grain("armR", "all", 0.06, 4);
    p.grain("armL", "all", 0.06, 5);
  }, { transparent: true });
}

/** White EVA suit. visor: "gold" opaque, "clear" reveals the face, "cracked" destroyed. */
export function spacesuit(visor: "gold" | "clear" | "cracked" = "gold", accent = "#3a6ea8"): Skin {
  return createSkin((p) => {
    const w = "#e9eaee";
    p.fill("head", "all", w);
    p.fill("torso", "all", w);
    p.fill("armR", "all", w);
    p.fill("armL", "all", w);
    p.fill("legR", "all", w);
    p.fill("legL", "all", w);
    // helmet visor window on the face
    if (visor === "clear") {
      p.erase("head", "front", 1, 2, 6, 4);
    } else if (visor === "gold") {
      p.rect("head", "front", 1, 2, 6, 4, "#caa24a");
      p.rect("head", "front", 1, 2, 6, 1, "#e6c878");
      p.px("head", "front", 2, 3, "#f3e2a8");
    } else {
      p.rect("head", "front", 1, 2, 6, 4, "#9aa0a8");
      // crack web
      p.px("head", "front", 3, 3, "#2a2c30");
      p.px("head", "front", 4, 4, "#2a2c30");
      p.px("head", "front", 2, 4, "#2a2c30");
      p.px("head", "front", 5, 3, "#2a2c30");
      p.px("head", "front", 4, 2, "#2a2c30");
      p.px("head", "front", 3, 5, "#7a1f1f");
      p.px("head", "front", 5, 5, "#7a1f1f");
    }
    // visor rim
    p.rect("head", "front", 0, 1, 8, 1, "#b9bcc4");
    p.rect("head", "front", 0, 6, 8, 1, "#b9bcc4");
    p.rect("head", "front", 0, 2, 1, 4, "#b9bcc4");
    p.rect("head", "front", 7, 2, 1, 4, "#b9bcc4");
    // torso chest panel + seams
    p.rect("torso", "front", 2, 3, 4, 3, "#2b2f36");
    p.px("torso", "front", 2, 3, "#5ad06a");
    p.px("torso", "front", 3, 3, "#e0b23a");
    p.px("torso", "front", 4, 3, "#d05a4a");
    p.rect("torso", "front", 2, 4, 4, 1, "#3a4048");
    p.rect("torso", "front", 0, 7, 8, 1, "#b9bcc4");
    // accent stripes
    p.rect("torso", "front", 0, 0, 8, 1, accent);
    p.rect("armR", "front", 0, 2, 4, 1, accent);
    p.rect("armL", "front", 0, 2, 4, 1, accent);
    // flag patch (texels)
    p.rect("armL", "front", 1, 4, 2, 1, "#c0392b");
    p.px("armL", "front", 1, 4, "#f1c40f");
    // joints
    p.rect("armR", "front", 0, 6, 4, 1, "#b9bcc4");
    p.rect("armL", "front", 0, 6, 4, 1, "#b9bcc4");
    p.rect("legR", "front", 0, 6, 4, 1, "#b9bcc4");
    p.rect("legL", "front", 0, 6, 4, 1, "#b9bcc4");
    // boots
    p.rect("legR", "front", 0, 10, 4, 2, "#9aa0a8");
    p.rect("legL", "front", 0, 10, 4, 2, "#9aa0a8");
    p.grain("torso", "all", 0.04, 11);
  }, { transparent: true });
}

/* ------------------------------------------------------------------ */
/* The collector — warm, ruddy, spectacles, a man with a small world.  */
/* ------------------------------------------------------------------ */

export function collectorBody(): Skin {
  return createSkin((p) => {
    paintHeadBase(p, "#d39a6b", "#8d8d88", "receding");
    // grey brows
    p.rect("head", "front", 1, 2, 2, 1, "#7d7d78");
    p.rect("head", "front", 5, 2, 2, 1, "#7d7d78");
    // spectacles (painted rims)
    p.rect("head", "front", 0, 3, 3, 2, "#2c2c2e");
    p.rect("head", "front", 5, 3, 3, 2, "#2c2c2e");
    p.rect("head", "front", 3, 3, 2, 1, "#2c2c2e");
    p.rect("head", "front", 1, 3, 1, 1, "#efe7d8");
    p.rect("head", "front", 6, 3, 1, 1, "#efe7d8");
    p.px("head", "front", 1, 3, "#20242c");
    p.px("head", "front", 6, 3, "#20242c");
    p.rect("head", "front", 3, 4, 2, 1, shade("#d39a6b", -12));
    // warm smiling mouth
    p.rect("head", "front", 2, 5, 4, 1, "#8a5340");
    p.px("head", "front", 1, 5, "#8a5340");
    p.px("head", "front", 6, 5, "#8a5340");
    p.px("head", "front", 2, 6, shade("#d39a6b", -8));
    p.px("head", "front", 5, 6, shade("#d39a6b", -8));
    // ruddy cheeks
    p.px("head", "front", 1, 4, "#c97a5a");
    p.px("head", "front", 6, 4, "#c97a5a");
    p.grain("head", "all", 0.05, 21);
    p.fill("torso", "all", "#d39a6b");
    p.fill("armR", "all", "#d39a6b");
    p.fill("armL", "all", "#d39a6b");
    p.fill("legR", "all", "#d39a6b");
    p.fill("legL", "all", "#d39a6b");
  });
}

export function collectorClothes(): Skin {
  return createSkin((p) => {
    const c = "#6d4a3a"; // warm cardigan
    p.fill("torso", "all", c);
    p.fill("armR", "all", c);
    p.fill("armL", "all", c);
    p.fill("legR", "all", "#3c3a36");
    p.fill("legL", "all", "#3c3a36");
    // open cardigan over a shirt
    p.rect("torso", "front", 3, 0, 2, 10, "#cfc4ae");
    p.rect("torso", "front", 2, 0, 1, 10, shade(c, -12));
    p.rect("torso", "front", 5, 0, 1, 10, shade(c, -12));
    p.px("torso", "front", 3, 3, "#8a8272");
    p.px("torso", "front", 4, 5, "#8a8272");
    // elbow patches
    p.rect("armR", "front", 1, 5, 2, 2, "#4a3327");
    p.rect("armL", "front", 1, 5, 2, 2, "#4a3327");
    // shoes
    p.rect("legR", "front", 0, 11, 4, 1, "#241f1a");
    p.rect("legL", "front", 0, 11, 4, 1, "#241f1a");
    p.grain("torso", "all", 0.07, 31);
  }, { transparent: true });
}

/* ------------------------------------------------------------------ */
/* Generic conference attendees (white suits) + a photographer.        */
/* ------------------------------------------------------------------ */

const ATTENDEE_SKIN = ["#c9905f", "#d3a06b", "#b9825a", "#e0b088", "#a9744f"];

export function attendeeBody(seed: number): Skin {
  const skin = ATTENDEE_SKIN[seed % ATTENDEE_SKIN.length];
  return createSkin((p) => {
    paintHeadBase(p, skin, "#20222a", seed % 3 === 0 ? "receding" : "short");
    paintEyes(p, "#20242c", "#241c14", 3);
    p.rect("head", "front", 3, 4, 2, 1, shade(skin, -12));
    p.rect("head", "front", 2, 5, 4, 1, "#7c4a38");
    p.grain("head", "all", 0.05, 40 + seed);
    p.fill("torso", "all", skin);
    p.fill("armR", "all", skin);
    p.fill("armL", "all", skin);
    p.fill("legR", "all", skin);
    p.fill("legL", "all", skin);
  });
}

/* ------------------------------------------------------------------ */
/* Figure assembly                                                     */
/* ------------------------------------------------------------------ */

export interface CastMember {
  figure: Figure;
  suitGold: THREE.Texture;
  suitClear: THREE.Texture;
  suitCracked: THREE.Texture;
}

export function makeZhang(): { figure: Figure; uniform: THREE.Texture; suitGold: THREE.Texture; suitClear: THREE.Texture } {
  const figure = createFigure({ body: zhangBody().texture, clothes: zhangUniform().texture, heightM: 1.8, arm: "classic" });
  return {
    figure,
    uniform: zhangUniform().texture,
    suitGold: spacesuit("gold", "#3a6ea8").texture,
    suitClear: spacesuit("clear", "#3a6ea8").texture,
  };
}

export function makeCollector(): Figure {
  return createFigure({ body: collectorBody().texture, clothes: collectorClothes().texture, heightM: 1.72, arm: "classic" });
}

export function makeAttendee(seed: number, target = false): CastMember {
  const figure = createFigure({
    body: attendeeBody(seed).texture,
    clothes: spacesuit("gold", target ? "#b8862a" : "#3a6ea8").texture,
    heightM: 1.74 + (seed % 5) * 0.02,
    arm: seed % 2 === 0 ? "classic" : "slim",
  });
  return {
    figure,
    suitGold: spacesuit("gold", target ? "#b8862a" : "#3a6ea8").texture,
    suitClear: spacesuit("clear", target ? "#b8862a" : "#3a6ea8").texture,
    suitCracked: spacesuit("cracked", "#b8862a").texture,
  };
}

/* ------------------------------------------------------------------ */
/* Props — drawn as voxel character grids, mounted on anchors.         */
/* ------------------------------------------------------------------ */

const metal = { "#": 0x2b2f36, g: 0x4a4f57, b: 0x1a1c20, s: 0x6a7078, w: 0x8a4a2c };

/** Pistol: barrel along +Z, grip along -Y. ~0.24 m long. */
export function pistolProp(): THREE.BufferGeometry {
  const side = [
    "..........",
    "..........",
    "##########",
    "##########",
    "..##......",
    "..##......",
    "..gg......",
    "..gg......",
  ];
  return voxelModel({ palette: metal, layers: [side, side, side], axis: "x", voxel: 0.34, anchor: "min" });
}

/** Rifle scope modified with a magnetic mount — a short tube. */
export function scopeProp(): THREE.BufferGeometry {
  const side = [
    "..........",
    "..ssssss..",
    ".########.",
    ".########.",
    "..ssssss..",
    "....gg....",
  ];
  return voxelModel({ palette: { ...metal, s: 0x3a3f47 }, layers: [side, side, side], axis: "x", voxel: 0.3, anchor: "min" });
}

export function teacupProp(): THREE.BufferGeometry {
  const side = [
    "........",
    ".wwwwww.",
    ".w####w.",
    ".w####w.",
    ".wwwwww.",
    "..wwww..",
  ];
  return voxelModel({ palette: { w: 0xe8e2d4, "#": 0x6a8a5a }, layers: [side, side, side], axis: "x", voxel: 0.3, anchor: "min" });
}

export function magnifierProp(): THREE.BufferGeometry {
  const side = [
    "..sss..",
    ".s...s.",
    "s.....s",
    "s.....s",
    ".s...s.",
    "..sss..",
    "...g...",
    "...g...",
  ];
  return voxelModel({ palette: { s: 0x8a8f98, g: 0x4a3a2c }, layers: [side], axis: "x", voxel: 0.3, anchor: "min" });
}

/** A small dark iron meteorite lump, irregular and metallic-flecked. */
export function meteoriteProp(seed = 1, size = 1): THREE.BufferGeometry {
  const rng = mulberryLocal(seed);
  const radius = 3;
  const span = Math.ceil(radius) * 2;
  const centre = span / 2;
  const jitter: number[] = [];
  for (let i = 0; i < span * span * span; i++) jitter.push(rng());
  return buildVoxelGeometry({
    size: [span, span, span],
    at(x, y, z) {
      const dx = x + 0.5 - centre, dy = y + 0.5 - centre, dz = z + 0.5 - centre;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) / radius;
      const j = jitter[(y * span + z) * span + x];
      if (d > 0.78 + j * 0.22) return null;
      const c = new THREE.Color(0x3a3d42).multiplyScalar(0.78 + j * 0.5);
      if (j > 0.9) c.setHex(0x70767e);
      return c.getHex();
    },
  }, { voxel: 0.34 * size, anchor: "center" });
}

function mulberryLocal(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Suit thruster backpack. */
export function thrusterPack(): THREE.BufferGeometry {
  const side = [
    "........",
    ".######.",
    ".#gggg#.",
    ".#gggg#.",
    ".######.",
    ".s....s.",
    ".s....s.",
  ];
  return voxelModel({ palette: { "#": 0xd7d9de, g: 0x9aa0a8, s: 0x6a7078 }, layers: [side, side, side], axis: "x", voxel: 0.4, anchor: "min" });
}

/** The locator unit left behind in the cabin. */
export function locatorProp(): THREE.BufferGeometry {
  const side = [
    "....s...",
    "....s...",
    ".######.",
    ".#gggg#.",
    ".#grrg#.",
    ".######.",
  ];
  return voxelModel({ palette: { "#": 0x3a4048, g: 0x5a626c, r: 0xd05a4a, s: 0x8a8f98 }, layers: [side, side], axis: "x", voxel: 0.4, anchor: "min" });
}

export { voxelMaterial };
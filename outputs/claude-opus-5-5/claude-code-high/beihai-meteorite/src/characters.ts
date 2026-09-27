import * as THREE from "three";
import { createFigure, createSkin, type Figure, type SkinPainter } from "@agentbench/voxel-kit";
import { rng } from "./util";

export type Expr = "neutral" | "talk" | "blink" | "scream" | "smile";

export interface FaceSpec {
  skin: string;
  shade: string;
  hair: string;
  hairStyle: "crew" | "receding" | "side" | "bald" | "short";
  brow: string;
  iris: string;
  lip: string;
  glasses?: string;
  cheeks?: string;
  lines?: boolean;
  under?: string; // undershirt colour on the bare body
  legs?: string;
}

const PARTS = ["head", "torso", "armR", "armL", "legR", "legL"] as const;

function paintBody(p: SkinPainter, f: FaceSpec, expr: Expr): void {
  // Bare figure: skin on head and arms, a plain undershirt and underlayer legs.
  p.fill("head", "all", f.skin);
  p.fill("armR", "all", f.skin).fill("armL", "all", f.skin);
  p.fill("torso", "all", f.under ?? "#d9d6cc");
  p.fill("legR", "all", f.legs ?? "#2b2c30").fill("legL", "all", f.legs ?? "#2b2c30");
  p.grain("head", "all", 0.05, 11).grain("armR", "all", 0.05, 12).grain("armL", "all", 0.05, 13);

  // Hair.
  if (f.hairStyle !== "bald") {
    p.fill("head", "top", f.hair);
    const backRows = f.hairStyle === "crew" ? 5 : f.hairStyle === "receding" ? 5 : 6;
    p.rect("head", "back", 0, 0, 8, backRows, f.hair);
    // left face: column 0 is the front; right face: column 0 is the back.
    p.rect("head", "left", 0, 0, 8, 2, f.hair).rect("head", "left", 4, 2, 4, 3, f.hair);
    p.rect("head", "right", 0, 0, 8, 2, f.hair).rect("head", "right", 0, 2, 4, 3, f.hair);
    if (f.hairStyle === "receding") {
      p.rect("head", "top", 2, 0, 4, 4, f.skin).rect("head", "top", 3, 4, 2, 1, f.skin);
      p.px("head", "front", 0, 0, f.hair).px("head", "front", 7, 0, f.hair).px("head", "front", 1, 0, f.hair).px("head", "front", 6, 0, f.hair);
    } else if (f.hairStyle === "side") {
      p.rect("head", "front", 0, 0, 8, 1, f.hair).rect("head", "front", 0, 1, 3, 1, f.hair).px("head", "front", 7, 1, f.hair);
    } else {
      p.rect("head", "front", 0, 0, 8, 1, f.hair).px("head", "front", 0, 1, f.hair).px("head", "front", 7, 1, f.hair);
    }
  } else {
    p.rect("head", "back", 0, 3, 8, 2, f.hair);
    p.rect("head", "left", 4, 2, 4, 3, f.hair).rect("head", "right", 0, 2, 4, 3, f.hair);
  }
  p.grain("head", ["top", "back"], 0.12, 7);

  // Face: brows row 2 (row 1 with glasses), eyes row 3, nose row 5, mouth row 6.
  const browRow = f.glasses ? 1 : 2;
  const raised = expr === "scream" ? -1 : 0;
  p.rect("head", "front", 1, Math.max(0, browRow + raised), 2, 1, f.brow).rect("head", "front", 5, Math.max(0, browRow + raised), 2, 1, f.brow);
  if (expr === "blink") {
    p.rect("head", "front", 1, 3, 2, 1, f.shade).rect("head", "front", 5, 3, 2, 1, f.shade);
  } else {
    p.px("head", "front", 1, 3, "#f1eee6").px("head", "front", 2, 3, f.iris);
    p.px("head", "front", 5, 3, f.iris).px("head", "front", 6, 3, "#f1eee6");
    if (expr === "scream") p.px("head", "front", 1, 3, "#ffffff").px("head", "front", 6, 3, "#ffffff");
  }
  if (f.glasses) {
    const g = f.glasses;
    p.rect("head", "front", 0, 2, 4, 1, g).rect("head", "front", 4, 2, 4, 1, g);
    p.px("head", "front", 0, 3, g).px("head", "front", 3, 3, g).px("head", "front", 4, 3, g).px("head", "front", 7, 3, g);
  }
  p.px("head", "front", 3, 5, f.shade).px("head", "front", 4, 5, f.shade);
  if (f.cheeks) p.px("head", "front", 1, 5, f.cheeks).px("head", "front", 6, 5, f.cheeks);
  if (f.lines) p.px("head", "front", 1, 4, f.shade).px("head", "front", 6, 4, f.shade);
  switch (expr) {
    case "talk":
      p.rect("head", "front", 3, 6, 2, 1, "#3b1a16").px("head", "front", 2, 6, f.lip).px("head", "front", 5, 6, f.lip);
      break;
    case "scream":
      p.rect("head", "front", 2, 6, 4, 2, "#2a0f0c");
      break;
    case "smile":
      p.rect("head", "front", 3, 6, 2, 1, f.lip).px("head", "front", 2, 5, f.lip).px("head", "front", 5, 5, f.lip);
      break;
    default:
      p.rect("head", "front", 3, 6, 2, 1, f.lip).px("head", "front", 2, 6, f.shade).px("head", "front", 5, 6, f.shade);
  }
  p.rect("head", "front", 2, 7, 4, 1, f.shade);
  p.fill("head", "bottom", f.shade);
}

// ---------------------------------------------------------------- clothing

function sleeves(p: SkinPainter, colour: string, rows: number, cuff?: string): void {
  for (const arm of ["armR", "armL"] as const) {
    p.fill(arm, "all", colour);
    p.erase(arm, "front", 0, rows, 4, 12 - rows).erase(arm, "back", 0, rows, 4, 12 - rows);
    p.erase(arm, "left", 0, rows, 4, 12 - rows).erase(arm, "right", 0, rows, 4, 12 - rows);
    p.clear(arm, "bottom");
    if (cuff) for (const f of ["front", "back", "left", "right"] as const) p.rect(arm, f, 0, rows - 1, 4, 1, cuff);
  }
}

function trousers(p: SkinPainter, colour: string, shoe: string): void {
  for (const leg of ["legR", "legL"] as const) {
    p.fill(leg, "all", colour);
    for (const f of ["front", "back", "left", "right"] as const) p.rect(leg, f, 0, 10, 4, 2, shoe);
    p.fill(leg, "bottom", shoe);
    p.grain(leg, "all", 0.08, leg === "legR" ? 3 : 4);
  }
}

export function coatSheet(): THREE.Texture {
  return createSkin((p) => {
    const main = "#262c38", dark = "#191d26";
    p.fill("torso", "all", main).grain("torso", "all", 0.08, 5);
    p.rect("torso", "front", 3, 0, 2, 4, "#e8e6df").px("torso", "front", 3, 4, "#e8e6df");
    p.px("torso", "front", 2, 0, dark).px("torso", "front", 5, 0, dark).px("torso", "front", 2, 1, dark).px("torso", "front", 5, 1, dark);
    p.px("torso", "front", 4, 0, "#8a2a2a"); // a dark red tie knot
    p.rect("torso", "front", 4, 1, 1, 3, "#6e2222");
    p.px("torso", "front", 4, 6, "#0e1016").px("torso", "front", 4, 9, "#0e1016");
    p.rect("torso", "front", 0, 11, 8, 1, dark);
    sleeves(p, main, 10, dark);
    p.grain("armR", "all", 0.08, 8).grain("armL", "all", 0.08, 9);
    trousers(p, "#2d2f33", "#0d0d0f");
  }, { transparent: true }).texture;
}

export function sweaterSheet(): THREE.Texture {
  return createSkin((p) => {
    const main = "#4a5236";
    p.fill("torso", "all", main).grain("torso", "all", 0.14, 21);
    p.rect("torso", "front", 2, 0, 4, 1, "#3b4129").rect("torso", "front", 0, 10, 8, 2, "#3b4129");
    p.rect("torso", "back", 0, 10, 8, 2, "#3b4129");
    sleeves(p, main, 7, "#3b4129");
    p.grain("armR", "all", 0.14, 22).grain("armL", "all", 0.14, 23);
    trousers(p, "#2e3326", "#111111");
  }, { transparent: true }).texture;
}

export function vestSheet(): THREE.Texture {
  return createSkin((p) => {
    const shirt = "#9fb4c8", vest = "#6b4a32";
    p.fill("torso", "all", vest).grain("torso", "all", 0.16, 31);
    p.rect("torso", "front", 3, 0, 2, 3, shirt).px("torso", "front", 3, 3, shirt).px("torso", "front", 4, 3, shirt);
    p.px("torso", "front", 3, 0, "#dfe6ec").px("torso", "front", 4, 0, "#dfe6ec");
    p.px("torso", "front", 4, 5, "#3a271a").px("torso", "front", 4, 7, "#3a271a").px("torso", "front", 4, 9, "#3a271a");
    p.rect("torso", "front", 0, 11, 8, 1, "#5a3c28");
    p.fill("torso", "top", shirt);
    sleeves(p, shirt, 10, "#dfe6ec");
    p.grain("armR", "all", 0.05, 32).grain("armL", "all", 0.05, 33);
    trousers(p, "#3d3a36", "#161412");
  }, { transparent: true }).texture;
}

export interface SuitSpec {
  base: string;
  trim: string;
  accent?: string;
  visor: "tint" | "clear" | "crack";
  glove: "suit" | "cloth";
  flag?: boolean;
  seed?: number;
}

export function suitSheet(s: SuitSpec): THREE.Texture {
  return createSkin((p) => {
    const seed = s.seed ?? 1;
    for (const part of PARTS) p.fill(part, "all", s.base);
    // Helmet.
    p.fill("head", "top", "#f4f4f0").rect("head", "top", 3, 3, 2, 2, s.trim);
    p.rect("head", "back", 1, 5, 6, 2, s.trim);
    p.rect("head", "left", 2, 2, 2, 2, "#c9ccd0").rect("head", "right", 4, 2, 2, 2, "#c9ccd0");
    p.rect("head", "front", 0, 7, 8, 1, s.trim);
    if (s.visor === "tint") {
      p.rect("head", "front", 1, 1, 6, 6, "#7a5a22");
      p.rect("head", "front", 1, 1, 6, 2, "#b08a3c").rect("head", "front", 5, 1, 2, 1, "#f0dca0").px("head", "front", 6, 2, "#e6c67a");
      p.rect("head", "front", 1, 5, 6, 1, "#5e4418").rect("head", "front", 1, 6, 6, 1, "#4a3614");
    } else if (s.visor === "clear") {
      p.erase("head", "front", 1, 1, 6, 6);
      p.px("head", "front", 6, 1, "#e8eef4");
    } else {
      p.rect("head", "front", 1, 1, 6, 6, "#d6dbe0");
      const r = rng(seed * 7 + 3);
      for (let i = 0; i < 9; i++) p.px("head", "front", 1 + Math.floor(r() * 6), 1 + Math.floor(r() * 6), "#8d959c");
      p.rect("head", "front", 2, 3, 3, 1, "#8d959c").rect("head", "front", 4, 2, 1, 3, "#8d959c");
      p.px("head", "front", 3, 4, "#8a0f12").px("head", "front", 4, 4, "#6d0a0d").px("head", "front", 2, 5, "#8a0f12")
        .px("head", "front", 5, 3, "#9a1a1c").px("head", "front", 3, 2, "#7a0c0e").px("head", "front", 5, 5, "#6d0a0d");
    }
    // Torso: chest control unit, belt and centre seam.
    p.grain("torso", "all", 0.04, seed + 40);
    p.rect("torso", "front", 2, 2, 4, 3, "#9aa0a6").px("torso", "front", 2, 2, "#c23a2e").px("torso", "front", 3, 2, "#38b25a").px("torso", "front", 5, 3, "#3a78c8").rect("torso", "front", 3, 3, 2, 1, "#2a2e33");
    p.rect("torso", "front", 0, 8, 8, 1, s.trim).rect("torso", "back", 0, 8, 8, 1, s.trim);
    p.rect("torso", "left", 0, 8, 4, 1, s.trim).rect("torso", "right", 0, 8, 4, 1, s.trim);
    p.rect("torso", "front", 0, 0, 8, 1, "#c9ccd0");
    if (s.accent) p.rect("torso", "front", 0, 6, 8, 1, s.accent).rect("torso", "back", 0, 6, 8, 1, s.accent);
    // Arms: rings, wrist collar, gloves.
    for (const arm of ["armR", "armL"] as const) {
      for (const f of ["front", "back", "left", "right"] as const) {
        p.rect(arm, f, 0, 4, 4, 1, s.trim);
        p.rect(arm, f, 0, 8, 4, 1, "#b8bec6");
        if (s.accent) p.rect(arm, f, 0, 2, 4, 1, s.accent);
      }
      const glove = arm === "armR" && s.glove === "cloth" ? "#e2ded2" : "#7b8088";
      for (const f of ["front", "back", "left", "right"] as const) p.rect(arm, f, 0, 9, 4, 3, glove);
      p.fill(arm, "bottom", glove);
    }
    if (s.flag) p.rect("armL", "left", 0, 1, 3, 2, "#c8281e").px("armL", "left", 0, 1, "#f2cf3a");
    // Legs: knee ring and boots.
    for (const leg of ["legR", "legL"] as const) {
      for (const f of ["front", "back", "left", "right"] as const) {
        p.rect(leg, f, 0, 5, 4, 1, s.trim);
        p.rect(leg, f, 0, 9, 4, 3, "#8a9098");
      }
      p.fill(leg, "bottom", "#5a5f66");
    }
  }, { transparent: true }).texture;
}

// ------------------------------------------------------------------- actors

export class Actor {
  readonly fig: Figure;
  private readonly faces: Partial<Record<Expr, THREE.Texture>> = {};
  readonly clothes: Record<string, THREE.Texture> = {};
  private face: Expr = "neutral";
  private outfit = "";
  readonly seed: number;

  constructor(readonly name: string, readonly spec: FaceSpec, outfits: Record<string, THREE.Texture>, height = 1.8, exprs: Expr[] = ["neutral", "talk", "blink"], seed = 1) {
    for (const e of exprs) this.faces[e] = createSkin((p) => paintBody(p, spec, e)).texture;
    Object.assign(this.clothes, outfits);
    const first = Object.keys(outfits)[0];
    this.fig = createFigure({ body: this.faces.neutral!, clothes: outfits[first], heightM: height });
    this.outfit = first;
    this.seed = seed;
  }

  get root(): THREE.Group {
    return this.fig.root;
  }

  setFace(e: Expr): void {
    const tex = this.faces[e] ?? this.faces.neutral!;
    if (e === this.face) return;
    this.face = e;
    (this.fig.parts.head.material as THREE.MeshStandardMaterial).map = tex;
  }

  dress(key: string): void {
    if (key === this.outfit) return;
    this.outfit = key;
    (this.fig.clothing.head.material as THREE.MeshStandardMaterial).map = this.clothes[key];
  }
}

// --------------------------------------------------------------------- cast

const ZHANG_FACE: FaceSpec = {
  skin: "#d6a07a", shade: "#b78461", hair: "#16130f", hairStyle: "crew",
  brow: "#1a1512", iris: "#2a1c14", lip: "#9a5a4c", under: "#e4e2dc",
};

const COLLECTOR_FACE: FaceSpec = {
  skin: "#dca27c", shade: "#bb8462", hair: "#6f6a64", hairStyle: "receding",
  brow: "#57514b", iris: "#2e2018", lip: "#b0605a", glasses: "#4a3a2c", cheeks: "#d8866e", lines: true,
};

export function makeZhang(): Actor {
  const suitClear = suitSheet({ base: "#c9ced4", trim: "#56606b", visor: "clear", glove: "suit", flag: true, seed: 3 });
  const suitBare = suitSheet({ base: "#c9ced4", trim: "#56606b", visor: "clear", glove: "cloth", flag: true, seed: 3 });
  return new Actor("章北海", ZHANG_FACE, {
    coat: coatSheet(),
    sweater: sweaterSheet(),
    suit: suitClear,
    suitBare,
  }, 1.8, ["neutral", "talk", "blink"], 7);
}

export function makeCollector(): Actor {
  return new Actor("收藏者", COLLECTOR_FACE, { vest: vestSheet() }, 1.72, ["neutral", "talk", "blink", "smile"], 19);
}

const SKINS = ["#d8a47e", "#cf9a72", "#e0b08c", "#c48e68", "#d9a882", "#bf8762"];
const HAIRS = ["#15120f", "#2a2622", "#5c5750", "#8d8880", "#c9c5bf", "#3a3029"];

export function makeParticipant(i: number, opts: { hair?: string; style?: FaceSpec["hairStyle"]; glasses?: boolean; accent?: string; visorDefault?: "tint" | "clear" } = {}): Actor {
  const r = rng(1000 + i * 31);
  const skin = SKINS[Math.floor(r() * SKINS.length)];
  const shadeCol = new THREE.Color(skin).multiplyScalar(0.84).getHexString();
  const hair = opts.hair ?? HAIRS[Math.floor(r() * HAIRS.length)];
  const styles: FaceSpec["hairStyle"][] = ["crew", "short", "side", "receding"];
  const face: FaceSpec = {
    skin, shade: `#${shadeCol}`, hair, hairStyle: opts.style ?? styles[Math.floor(r() * styles.length)],
    brow: hair === "#c9c5bf" ? "#8d8880" : "#1d1915", iris: "#241a13", lip: "#9c5b50",
    glasses: opts.glasses ?? r() < 0.25 ? "#2c2c30" : undefined, lines: r() < 0.5,
  };
  const white = { base: "#eeeeea", trim: "#9aa2ac", accent: opts.accent, glove: "suit" as const, seed: i };
  const outfits: Record<string, THREE.Texture> = {
    tint: suitSheet({ ...white, visor: "tint" }),
    clear: suitSheet({ ...white, visor: "clear" }),
  };
  const a = new Actor(`p${i}`, face, outfits, 1.66 + r() * 0.16, ["neutral", "talk", "blink", "scream"], 50 + i);
  if (opts.visorDefault === "clear") a.dress("clear");
  return a;
}

export function makeTarget(i: number): Actor {
  const specs: FaceSpec[] = [
    { skin: "#d4a07c", shade: "#b3835f", hair: "#d8d4ce", hairStyle: "side", brow: "#a8a39c", iris: "#231a13", lip: "#9a5a50", glasses: "#3a3a40", lines: true },
    { skin: "#cc9570", shade: "#ad7b58", hair: "#8b867f", hairStyle: "bald", brow: "#5b5650", iris: "#231a13", lip: "#955548", lines: true },
    { skin: "#d9a882", shade: "#b98a66", hair: "#4a4540", hairStyle: "receding", brow: "#1d1915", iris: "#231a13", lip: "#9c5b50", lines: true, cheeks: "#c9876c" },
  ];
  const white = { base: "#eeeeea", trim: "#9aa2ac", glove: "suit" as const, seed: 90 + i };
  const outfits: Record<string, THREE.Texture> = {
    tint: suitSheet({ ...white, visor: "tint" }),
    clear: suitSheet({ ...white, visor: "clear" }),
  };
  if (i === 0) outfits.crack = suitSheet({ ...white, visor: "crack" });
  return new Actor(`t${i}`, specs[i], outfits, [1.72, 1.76, 1.7][i], ["neutral", "talk", "blink", "scream", "smile"], 80 + i);
}

/** Lip flap and blinks derived from absolute time. */
export function performFace(a: Actor, t: number, talking: boolean, base: Expr = "neutral"): void {
  if (talking) {
    const slot = Math.floor(t * 8.5);
    const open = ((slot * 2654435761 + a.seed * 97) >>> 0) % 100 > 38;
    a.setFace(open ? "talk" : base);
    return;
  }
  const period = 3.1 + (a.seed % 7) * 0.37;
  const phase = (t + a.seed * 0.73) % period;
  a.setFace(phase < 0.13 ? "blink" : base);
}

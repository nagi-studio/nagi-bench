import * as THREE from "three";
import {
  createFigure,
  createSkin,
  buildVoxelGeometry,
  voxelMaterial,
  type Figure,
  type SkinPainter,
  type PartName,
} from "@agentbench/voxel-kit";
import { canvasTexture, hash3 } from "./util";

/* ------------------------------------------------------------------ */
/* Faces are painted texels only.                                      */
/* ------------------------------------------------------------------ */

export type Expression = "neutral" | "talk" | "smile" | "laugh" | "awkward" | "stern" | "narrow" | "panic" | "pain" | "closed";

export interface FaceSpec {
  skin: string;
  skinShade: string;
  hair: string;
  hairStyle: "crop" | "receding" | "side" | "bald" | "cap";
  brow: string;
  eye?: string;
  glasses?: string;
  lip: string;
  seed: number;
}

function paintHead(p: SkinPainter, f: FaceSpec, expr: Expression) {
  p.fill("head", "all", f.skin);
  p.grain("head", "all", 0.05, f.seed);
  // hair
  const hair = f.hair;
  if (f.hairStyle !== "bald") {
    p.fill("head", "top", hair);
    p.fill("head", "back", hair);
    p.rect("head", "back", 0, 7, 8, 1, f.skinShade);
    for (const side of ["left", "right"] as const) {
      p.rect("head", side, 0, 0, 8, 3, hair);
      p.rect("head", side, side === "left" ? 5 : 0, 3, 3, 2, hair);
    }
  }
  if (f.hairStyle === "crop") {
    p.rect("head", "front", 0, 0, 8, 2, hair);
    p.px("head", "front", 0, 2, hair).px("head", "front", 7, 2, hair);
  } else if (f.hairStyle === "receding") {
    p.rect("head", "front", 0, 0, 8, 1, hair);
    p.rect("head", "front", 2, 0, 4, 1, f.skinShade);
    p.px("head", "front", 0, 1, hair).px("head", "front", 7, 1, hair);
    p.rect("head", "top", 2, 4, 4, 4, f.skinShade);
  } else if (f.hairStyle === "side") {
    p.rect("head", "front", 0, 0, 8, 2, hair);
    p.rect("head", "front", 0, 2, 3, 1, hair);
  } else if (f.hairStyle === "bald") {
    p.fill("head", "top", f.skinShade);
    for (const side of ["left", "right"] as const) p.rect("head", side, 0, 3, 8, 2, f.hair);
    p.rect("head", "back", 0, 3, 8, 2, f.hair);
  } else if (f.hairStyle === "cap") {
    p.fill("head", ["top", "back", "left", "right"], "#2c3036");
    p.rect("head", "front", 0, 0, 8, 1, "#2c3036");
    p.px("head", "front", 0, 1, "#2c3036").px("head", "front", 7, 1, "#2c3036");
    p.rect("head", "left", 3, 4, 2, 2, "#4a5058");
    p.rect("head", "right", 3, 4, 2, 2, "#4a5058");
  }
  p.grain("head", ["top", "back", "left", "right"], 0.08, f.seed + 3);

  const eye = f.eye ?? "#1b1410";
  const white = "#ece8e0";
  // brows
  if (expr === "stern" || expr === "narrow") {
    p.rect("head", "front", 1, 3, 2, 1, f.brow).rect("head", "front", 5, 3, 2, 1, f.brow);
    p.px("head", "front", 3, 3, f.skinShade).px("head", "front", 4, 3, f.skinShade);
  } else if (expr === "panic" || expr === "laugh") {
    p.rect("head", "front", 1, 2, 2, 1, f.brow).rect("head", "front", 5, 2, 2, 1, f.brow);
  } else if (expr === "pain") {
    p.px("head", "front", 1, 3, f.brow).px("head", "front", 2, 2, f.brow);
    p.px("head", "front", 6, 3, f.brow).px("head", "front", 5, 2, f.brow);
  } else {
    p.rect("head", "front", 1, 3, 2, 1, f.brow).rect("head", "front", 5, 3, 2, 1, f.brow);
  }
  // eyes
  if (expr === "closed" || expr === "laugh") {
    p.rect("head", "front", 1, 4, 2, 1, f.skinShade).rect("head", "front", 5, 4, 2, 1, f.skinShade);
    p.px("head", "front", 2, 4, eye).px("head", "front", 5, 4, eye);
  } else if (expr === "narrow") {
    p.rect("head", "front", 1, 4, 2, 1, f.skinShade).rect("head", "front", 5, 4, 2, 1, f.skinShade);
    p.px("head", "front", 2, 4, eye).px("head", "front", 5, 4, eye);
  } else if (expr === "panic") {
    p.rect("head", "front", 1, 4, 2, 1, white).rect("head", "front", 5, 4, 2, 1, white);
    p.px("head", "front", 2, 4, eye).px("head", "front", 5, 4, eye);
    p.px("head", "front", 1, 3, white).px("head", "front", 6, 3, white);
  } else {
    p.px("head", "front", 1, 4, white).px("head", "front", 2, 4, eye);
    p.px("head", "front", 5, 4, eye).px("head", "front", 6, 4, white);
  }
  if (f.glasses) {
    const g = f.glasses;
    p.px("head", "front", 0, 4, g).px("head", "front", 3, 4, g).px("head", "front", 4, 4, g).px("head", "front", 7, 4, g);
    p.rect("head", "front", 1, 5, 2, 1, g).rect("head", "front", 5, 5, 2, 1, g);
    p.rect("head", "left", 0, 4, 4, 1, g).rect("head", "right", 4, 4, 4, 1, g);
  }
  // nose
  if (!f.glasses) p.rect("head", "front", 3, 5, 2, 1, f.skinShade);
  else p.px("head", "front", 4, 5, f.skinShade);
  // mouth
  const lip = f.lip;
  const dark = "#2a120e";
  switch (expr) {
    case "talk":
      p.rect("head", "front", 2, 6, 4, 1, lip).rect("head", "front", 3, 6, 2, 1, dark);
      p.rect("head", "front", 3, 7, 2, 1, "#5a2a22");
      break;
    case "smile":
      p.rect("head", "front", 2, 6, 4, 1, lip);
      p.px("head", "front", 1, 5, lip).px("head", "front", 6, 5, lip);
      break;
    case "laugh":
      p.rect("head", "front", 2, 6, 4, 1, dark).rect("head", "front", 3, 7, 2, 1, dark);
      p.px("head", "front", 1, 5, lip).px("head", "front", 6, 5, lip);
      p.rect("head", "front", 2, 6, 4, 1, dark).px("head", "front", 2, 6, "#e8e0d8").px("head", "front", 5, 6, "#e8e0d8");
      break;
    case "awkward":
      p.rect("head", "front", 2, 6, 4, 1, lip).px("head", "front", 6, 5, lip);
      break;
    case "panic":
      p.rect("head", "front", 2, 6, 4, 2, dark).rect("head", "front", 3, 6, 2, 1, "#6a2a22");
      break;
    case "pain":
      p.rect("head", "front", 2, 6, 4, 1, dark).px("head", "front", 2, 7, dark).px("head", "front", 5, 7, dark);
      break;
    default:
      p.rect("head", "front", 2, 6, 4, 1, lip);
  }
  // jaw shadow
  p.rect("head", "front", 0, 7, 1, 1, f.skinShade).rect("head", "front", 7, 7, 1, 1, f.skinShade);
  p.fill("head", "bottom", f.skinShade);
}

function paintBodyBase(p: SkinPainter, skin: string, under: string) {
  for (const part of ["torso", "armR", "armL", "legR", "legL"] as PartName[]) p.fill(part, "all", under);
  for (const arm of ["armR", "armL"] as PartName[]) {
    for (const face of ["front", "back", "left", "right"] as const) p.rect(arm, face, 0, 9, 4, 3, skin);
    p.fill(arm, "bottom", skin);
  }
  p.grain("torso", "all", 0.04, 9);
}

export function makeBodySkins(face: FaceSpec, exprs: Expression[]): Record<string, THREE.Texture> {
  const out: Record<string, THREE.Texture> = {};
  for (const e of exprs) {
    out[e] = createSkin((p) => {
      paintBodyBase(p, face.skin, "#e8e4dc");
      paintHead(p, face, e);
    }).texture;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Clothing sheets                                                     */
/* ------------------------------------------------------------------ */

const ARMS: PartName[] = ["armR", "armL"];
const LEGS: PartName[] = ["legR", "legL"];
const SIDES = ["front", "back", "left", "right"] as const;

export function coatSheet() {
  return createSkin((p) => {
    const coat = "#2a2f38";
    const coatDark = "#1d2128";
    p.fill("torso", "all", coat);
    p.rect("torso", "front", 3, 0, 2, 2, "#d9d6cf");
    p.px("torso", "front", 3, 0, coatDark).px("torso", "front", 4, 0, coatDark);
    p.rect("torso", "front", 3, 2, 1, 10, coatDark);
    p.px("torso", "front", 4, 4, "#8d8f94").px("torso", "front", 4, 7, "#8d8f94").px("torso", "front", 4, 10, "#8d8f94");
    p.rect("torso", "front", 0, 9, 8, 1, coatDark);
    p.rect("torso", "front", 1, 6, 2, 1, coatDark).rect("torso", "front", 5, 6, 2, 1, coatDark);
    p.grain("torso", "all", 0.06, 21);
    for (const a of ARMS) {
      for (const s of SIDES) p.rect(a, s, 0, 0, 4, 10, coat);
      p.fill(a, "top", coat);
      for (const s of SIDES) p.rect(a, s, 0, 9, 4, 1, coatDark);
      p.grain(a, "all", 0.06, 22);
    }
    for (const l of LEGS) {
      p.fill(l, "all", "#1a1c21");
      for (const s of SIDES) p.rect(l, s, 0, 10, 4, 2, "#0d0e10");
      p.grain(l, "all", 0.05, 23);
    }
  }, { transparent: true }).texture;
}

export function cardiganSheet() {
  return createSkin((p) => {
    const knit = "#8a6744";
    p.fill("torso", "all", knit);
    p.rect("torso", "front", 2, 0, 4, 3, "#cfc6b6");
    p.rect("torso", "front", 3, 0, 2, 1, "#a8a090");
    p.rect("torso", "front", 3, 3, 2, 9, "#cfc6b6");
    p.rect("torso", "front", 2, 3, 1, 9, "#6b4e33");
    p.rect("torso", "front", 5, 3, 1, 9, "#6b4e33");
    for (const y of [4, 7, 10]) p.px("torso", "front", 2, y, "#3a2a1c");
    p.rect("torso", "front", 0, 11, 8, 1, "#6b4e33");
    p.grain("torso", "all", 0.1, 31);
    for (const a of ARMS) {
      for (const s of SIDES) p.rect(a, s, 0, 0, 4, 10, knit);
      p.fill(a, "top", knit);
      for (const s of SIDES) p.rect(a, s, 0, 9, 4, 1, "#6b4e33");
      p.grain(a, "all", 0.1, 32);
    }
    for (const l of LEGS) {
      p.fill(l, "all", "#55504a");
      for (const s of SIDES) p.rect(l, s, 0, 10, 4, 2, "#2b2622");
      p.grain(l, "all", 0.05, 33);
    }
  }, { transparent: true }).texture;
}

export interface SuitStyle {
  base: string;
  trim: string;
  glove: string;
  boot: string;
  rightGloveOff?: boolean;
  seed: number;
}

export function suitSheet(s: SuitStyle) {
  return createSkin((p) => {
    p.fill("torso", "all", s.base);
    p.rect("torso", "front", 2, 2, 4, 4, "#8e959e");
    p.px("torso", "front", 2, 2, "#d04030").px("torso", "front", 3, 2, "#40c070").px("torso", "front", 4, 2, "#f0c040");
    p.rect("torso", "front", 2, 4, 4, 1, "#5d636b");
    p.rect("torso", "front", 0, 0, 8, 1, s.trim);
    p.rect("torso", "front", 0, 8, 8, 1, "#9aa0a6");
    p.rect("torso", "front", 1, 9, 1, 3, "#b4b9be").rect("torso", "front", 6, 9, 1, 3, "#b4b9be");
    p.rect("torso", "back", 0, 0, 8, 12, "#9da3aa");
    p.grain("torso", "all", 0.04, s.seed);
    for (const a of ARMS) {
      p.fill(a, "all", s.base);
      for (const f of SIDES) {
        p.rect(a, f, 0, 2, 4, 1, s.trim);
        p.rect(a, f, 0, 5, 4, 1, "#a6abb1");
        p.rect(a, f, 0, 9, 4, 1, "#7d838a");
        p.rect(a, f, 0, 10, 4, 2, s.glove);
      }
      p.fill(a, "bottom", s.glove);
      p.grain(a, "all", 0.04, s.seed + 1);
    }
    if (s.rightGloveOff) {
      for (const f of SIDES) {
        p.rect("armR", f, 0, 9, 4, 1, "#b8bec6");
        p.rect("armR", f, 0, 10, 4, 2, "#d9d5cb");
      }
      p.fill("armR", "bottom", "#d9d5cb");
    }
    for (const l of LEGS) {
      p.fill(l, "all", s.base);
      for (const f of SIDES) {
        p.rect(l, f, 0, 5, 4, 1, "#a6abb1");
        p.rect(l, f, 0, 9, 4, 3, s.boot);
      }
      p.fill(l, "bottom", "#5a5f66");
      p.grain(l, "all", 0.04, s.seed + 2);
    }
  }, { transparent: true }).texture;
}

/* ------------------------------------------------------------------ */
/* Helmet + backpack: equipment props, not facial features.            */
/* ------------------------------------------------------------------ */

export interface SuitGear {
  helmet: THREE.Group;
  visor: THREE.Mesh;
  visorMat: THREE.MeshStandardMaterial;
  visorCanvas: HTMLCanvasElement;
  visorTex: THREE.CanvasTexture;
  pack: THREE.Mesh;
  setVisor(clear: number): void;
  paintVisor(crack: number, blood: number, frost: number, seed: number): void;
}

let helmetGeo: THREE.BufferGeometry | null = null;
let packGeo: THREE.BufferGeometry | null = null;
let gearMat: THREE.MeshStandardMaterial | null = null;

function helmetGeometry(): THREE.BufferGeometry {
  if (helmetGeo) return helmetGeo;
  // 12x12x12 px shell, hollow, open at the front window and at the neck.
  helmetGeo = buildVoxelGeometry({
    size: [12, 12, 12],
    at(x, y, z) {
      const edge = x === 0 || x === 11 || y === 11 || z === 0 || z === 11 || y === 0;
      if (!edge) return null;
      if (y === 0) {
        // collar ring
        if (x > 1 && x < 10 && z > 1 && z < 10) return null;
        return 0x8c939b;
      }
      if (z === 11 && x >= 2 && x <= 9 && y >= 3 && y <= 9) return null; // visor window
      if (z === 11 && (y === 10 || y === 2)) return 0xbfc4c9;
      if ((x === 0 || x === 11) && y >= 5 && y <= 7 && z >= 4 && z <= 7) return 0x6f767e; // ear valves
      if (y === 11 && x >= 5 && x <= 6) return 0x9aa1a8;
      return 0xe7e7e2;
    },
  }, { voxel: 1 });
  return helmetGeo;
}

function packGeometry(): THREE.BufferGeometry {
  if (packGeo) return packGeo;
  packGeo = buildVoxelGeometry({
    size: [9, 11, 4],
    at(x, y, z) {
      if (y === 0 && (x === 1 || x === 7) && z >= 1 && z <= 2) return 0x3a3f46; // nozzles
      if (y === 0) return null;
      if (z === 0 && y >= 6 && y <= 8 && x >= 2 && x <= 6) return 0x9aa1a8;
      if (z === 0 && y === 3 && x >= 3 && x <= 5) return 0x4a7ab0;
      return (x + y) % 5 === 0 && z === 0 ? 0xc8ccd0 : 0xdcdcd6;
    },
  }, { voxel: 1 });
  return packGeo;
}

export function makeSuitGear(figure: Figure): SuitGear {
  gearMat ??= voxelMaterial({ roughness: 0.6 });
  const helmet = new THREE.Group();
  const shell = new THREE.Mesh(helmetGeometry(), gearMat);
  shell.position.set(0, -4 + 0.5, 0);
  shell.castShadow = true;
  helmet.add(shell);

  const visorCanvas = document.createElement("canvas");
  visorCanvas.width = 64;
  visorCanvas.height = 56;
  const visorTex = new THREE.CanvasTexture(visorCanvas);
  visorTex.colorSpace = THREE.SRGBColorSpace;
  const visorMat = new THREE.MeshStandardMaterial({
    map: visorTex,
    transparent: true,
    roughness: 0.08,
    metalness: 0.2,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const visor = new THREE.Mesh(new THREE.PlaneGeometry(8, 7), visorMat);
  visor.position.set(0, -4 + 0.5 + 0.5, 5.6);
  visor.renderOrder = 5;
  helmet.add(visor);
  figure.anchors.head.add(helmet);

  const pack = new THREE.Mesh(packGeometry(), gearMat);
  pack.position.set(0, -0.5, -2.3 - 2);
  pack.castShadow = true;
  figure.anchors.back.add(pack);

  let clearState = -1;
  const gear: SuitGear = {
    helmet,
    visor,
    visorMat,
    visorCanvas,
    visorTex,
    pack,
    setVisor(clear) {
      const c = Math.round(clear * 50) / 50;
      if (c === clearState) return;
      clearState = c;
      // gold sun-shield to clear glass
      visorMat.color.setRGB(1, 1, 1);
      visorMat.emissive.setRGB(0, 0, 0);
      visorMat.metalness = 0.95 * (1 - c) + 0.05;
      visorMat.roughness = 0.25 * (1 - c) + 0.05;
      visorMat.opacity = 0.97 * (1 - c) + 0.16 * c;
      visorMat.needsUpdate = true;
      paintBase(c);
    },
    paintVisor(crack, blood, frost, seed) {
      paintBase(clearState < 0 ? 1 : clearState);
      const ctx = visorCanvas.getContext("2d")!;
      const r = (n: number) => hash3(n, seed, 7);
      if (blood > 0) {
        for (let i = 0; i < 60 * blood; i++) {
          const x = 16 + r(i) * 32, y = 12 + r(i + 99) * 34;
          const s = 2 + Math.floor(r(i + 7) * 5);
          ctx.fillStyle = `rgba(${120 + Math.floor(r(i + 3) * 60)},${10 + Math.floor(r(i + 4) * 14)},${12},0.95)`;
          ctx.fillRect(Math.floor(x), Math.floor(y), s, s);
        }
        visorMat.opacity = Math.max(visorMat.opacity, 0.5 + 0.45 * blood);
      }
      if (crack > 0) {
        ctx.strokeStyle = "rgba(235,240,245,0.95)";
        ctx.lineWidth = 1.2;
        const cx = 30 + r(1) * 8, cy = 24 + r(2) * 8;
        const n = Math.floor(4 + 9 * crack);
        for (let i = 0; i < n; i++) {
          const a = r(i + 20) * Math.PI * 2;
          let x = cx, y = cy;
          ctx.beginPath();
          ctx.moveTo(x, y);
          const len = 8 + 40 * crack * r(i + 40);
          for (let k = 0; k < 5; k++) {
            x += Math.cos(a + (r(i * 5 + k) - 0.5) * 0.9) * len / 5;
            y += Math.sin(a + (r(i * 5 + k + 1) - 0.5) * 0.9) * len / 5;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(220,226,232,${0.55 * crack})`;
        ctx.fillRect(0, 0, 64, 56);
        visorMat.opacity = Math.max(visorMat.opacity, 0.85 * crack);
      }
      if (frost > 0) {
        ctx.fillStyle = `rgba(230,240,255,${0.7 * frost})`;
        for (let i = 0; i < 140 * frost; i++) ctx.fillRect(Math.floor(r(i + 300) * 64), Math.floor(r(i + 500) * 56), 2, 2);
      }
      visorTex.needsUpdate = true;
    },
  };

  function paintBase(c: number) {
    const ctx = visorCanvas.getContext("2d")!;
    ctx.clearRect(0, 0, 64, 56);
    const gold = 1 - c;
    ctx.fillStyle = `rgb(${Math.round(150 * gold + 200 * c)},${Math.round(112 * gold + 220 * c)},${Math.round(44 * gold + 235 * c)})`;
    ctx.fillRect(0, 0, 64, 56);
    // glass highlight streaks
    ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.2 * gold})`;
    for (let i = 0; i < 12; i++) ctx.fillRect(6 + i * 2, 4 + i * 2, 6, 2);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(46, 34, 8, 2);
    visorTex.needsUpdate = true;
  }

  gear.setVisor(0);
  return gear;
}

/* ------------------------------------------------------------------ */
/* Cast                                                                */
/* ------------------------------------------------------------------ */

export const ZHANG_FACE: FaceSpec = {
  skin: "#c3926c",
  skinShade: "#a87a58",
  hair: "#16151a",
  hairStyle: "crop",
  brow: "#141012",
  lip: "#7d4b3c",
  seed: 11,
};

export const COLLECTOR_FACE: FaceSpec = {
  skin: "#d7a77f",
  skinShade: "#bb8c66",
  hair: "#9b9893",
  hairStyle: "receding",
  brow: "#7d7a76",
  glasses: "#3b2b1e",
  lip: "#9a5a48",
  seed: 23,
};

export interface Actor {
  fig: Figure;
  skins: Record<string, THREE.Texture>;
  expr: string;
  setExpr(e: string): void;
}

export function makeActor(face: FaceSpec, exprs: Expression[], clothes: THREE.Texture | null, heightM = 1.8, arm: "classic" | "slim" = "classic"): Actor {
  const skins = makeBodySkins(face, exprs);
  const fig = createFigure({ body: skins[exprs[0]!]!, clothes, heightM, arm });
  const actor: Actor = {
    fig,
    skins,
    expr: exprs[0]!,
    setExpr(e) {
      if (actor.expr === e || !skins[e]) return;
      actor.expr = e;
      fig.setBody(skins[e]!);
    },
  };
  return actor;
}

/** Random-but-deterministic faces for the photo group. */
export function crowdFace(i: number, senior: boolean): FaceSpec {
  const tones = [["#d2a27c", "#b58660"], ["#c79670", "#a97a56"], ["#dcb08a", "#c0926e"], ["#b98a64", "#9c6e4c"]];
  const t = tones[i % tones.length]!;
  const r = hash3(i, 5, 9);
  const hairs = senior ? ["#8e8b88", "#b0aca6", "#5e5a58"] : ["#1a1716", "#2a211b", "#3a3030"];
  return {
    skin: t[0]!,
    skinShade: t[1]!,
    hair: hairs[i % hairs.length]!,
    hairStyle: senior ? (r > 0.5 ? "receding" : "bald") : "cap",
    brow: senior ? "#6e6a66" : "#1d1714",
    glasses: senior && r > 0.35 ? "#2b2b2b" : undefined,
    lip: "#8c5444",
    seed: 100 + i,
  };
}

/** Flat colour quad for gloved hands or scraps; keeps pixel look. */
export function pixelLabel(text: string, w: number, h: number, bg: string, fg: string) {
  return canvasTexture(w, h, (ctx) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = fg;
    ctx.font = `${Math.floor(h * 0.7)}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2 + 1);
  }, true);
}

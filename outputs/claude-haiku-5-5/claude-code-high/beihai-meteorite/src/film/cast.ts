import * as THREE from "three";
import { createSkin, createFigure, type Figure, type SkinPainter } from "@agentbench/voxel-kit";
import { VOXEL_MATERIAL, VoxelCanvas, shade } from "./voxels";

/** Painted identity: skin, hair and a few face options, all texels on the head. */
interface Look {
  skin: number;
  hair: number;
  glasses?: boolean;
}

const hex = (value: number): string => `#${value.toString(16).padStart(6, "0")}`;

function paintFace(p: SkinPainter, look: Look): void {
  const skin = hex(look.skin);
  const hair = hex(look.hair);
  const ink = "#1d1816";
  p.fill("head", "all", skin);
  p.fill("head", ["top", "back"], hair);
  p.rect("head", "left", 0, 0, 8, 3, hair);
  p.rect("head", "right", 0, 0, 8, 3, hair);
  p.rect("head", "front", 0, 0, 8, 2, hair);
  p.rect("head", "front", 1, 2, 2, 1, hair);
  p.rect("head", "front", 5, 2, 2, 1, hair);
  if (look.glasses) {
    const frame = "#2a2420";
    p.rect("head", "front", 0, 3, 4, 1, frame);
    p.rect("head", "front", 4, 3, 4, 1, frame);
    p.rect("head", "front", 0, 5, 4, 1, frame);
    p.rect("head", "front", 4, 5, 4, 1, frame);
    p.rect("head", "front", 0, 3, 1, 3, frame);
    p.rect("head", "front", 3, 3, 1, 3, frame);
    p.rect("head", "front", 4, 3, 1, 3, frame);
    p.rect("head", "front", 7, 3, 1, 3, frame);
    p.rect("head", "front", 3, 4, 2, 1, frame);
    p.px("head", "front", 1, 4, ink);
    p.px("head", "front", 5, 4, ink);
  } else {
    p.rect("head", "front", 1, 3, 2, 2, ink);
    p.rect("head", "front", 5, 3, 2, 2, ink);
    p.px("head", "front", 2, 3, "#f4f1ea");
    p.px("head", "front", 6, 3, "#f4f1ea");
  }
  p.px("head", "front", 3, 5, hex(shade(look.skin, 0.82)));
  p.rect("head", "front", 2, 6, 4, 1, "#6e3b33");
}

/** Body sheet: painted head plus an undersuit or base layer on the rest of the rig. */
function bodySheet(look: Look, under: number): THREE.Texture {
  return createSkin((p) => {
    paintFace(p, look);
    for (const part of ["torso", "armR", "armL", "legR", "legL"] as const) p.fill(part, "all", hex(under));
  }).texture;
}

/** Uniform of the space force, worn over the body. The cap is painted on the head shell. */
function uniformSheet(): THREE.Texture {
  const cloth = 0x3e4a3f, placket = 0x2a332c, belt = 0x1b1d1a, cap = 0x2b3530, badge = "#c23b2e";
  return createSkin((p) => {
    p.fill("torso", "all", hex(cloth));
    p.rect("torso", "front", 3, 0, 2, 10, hex(placket));
    p.rect("torso", "front", 0, 10, 8, 2, hex(belt));
    p.fill("armR", "all", hex(cloth));
    p.fill("armL", "all", hex(cloth));
    p.fill("legR", "all", hex(0x2b3229));
    p.fill("legL", "all", hex(0x2b3229));
    p.fill("head", "top", hex(cap));
    p.rect("head", "left", 0, 0, 8, 3, hex(cap));
    p.rect("head", "right", 0, 0, 8, 3, hex(cap));
    p.rect("head", "back", 0, 0, 8, 3, hex(cap));
    p.rect("head", "front", 0, 0, 8, 2, hex(cap));
    p.rect("head", "front", 0, 2, 8, 1, hex(shade(cap, 0.6)));
    p.px("head", "front", 3, 0, badge);
  }, { transparent: true }).texture;
}

/** Cardigan and trousers for the collector. */
function cardiganSheet(): THREE.Texture {
  return createSkin((p) => {
    p.fill("torso", "all", hex(0x7b5536));
    p.rect("torso", "front", 2, 0, 4, 9, hex(0xe9e4da));
    p.rect("torso", "front", 3, 4, 2, 1, hex(0x4a3320));
    p.fill("armR", "all", hex(0x7b5536));
    p.fill("armL", "all", hex(0x7b5536));
    p.fill("legR", "all", hex(0x3a3a40));
    p.fill("legL", "all", hex(0x3a3a40));
  }, { transparent: true }).texture;
}

interface SuitOptions {
  band: number;
  cracked?: boolean;
  open?: boolean;
}

/** White spacesuit with a visor on the helmet shell. `open` removes the visor. */
export function suitSheet(options: SuitOptions): THREE.Texture {
  const white = 0xe9edf0, grey = 0x9aa3ad, dark = 0x3c4650, visor = "#1c2838", accent = hex(options.band);
  return createSkin((p) => {
    p.fill("torso", "all", hex(white));
    p.rect("torso", "front", 2, 2, 4, 4, hex(dark));
    p.px("torso", "front", 3, 3, "#ffb13b");
    p.px("torso", "front", 4, 3, "#7fe0a0");
    p.rect("torso", "front", 0, 10, 8, 1, hex(grey));
    for (const arm of ["armR", "armL"] as const) {
      p.fill(arm, "all", hex(white));
      p.rect(arm, "front", 0, 6, 4, 1, accent);
    }
    for (const leg of ["legR", "legL"] as const) {
      p.fill(leg, "all", hex(white));
      p.rect(leg, "front", 0, 2, 4, 2, hex(grey));
    }
    p.fill("head", "all", hex(white));
    p.rect("head", "front", 0, 0, 8, 1, accent);
    if (options.open) {
      p.erase("head", "front", 1, 1, 6, 6);
      p.rect("head", "front", 0, 7, 8, 1, accent);
      return;
    }
    p.rect("head", "front", 1, 1, 6, 5, visor);
    p.rect("head", "front", 2, 2, 2, 1, "#9fbcd6");
    p.px("head", "front", 5, 4, "#6f8aa3");
    if (options.cracked) {
      const crack: Array<[number, number]> = [[3, 2], [4, 3], [4, 4], [5, 5], [3, 4], [2, 5], [6, 2], [5, 3]];
      for (const [x, y] of crack) p.px("head", "front", x, y, "#e8f4ff");
    }
  }, { transparent: true }).texture;
}

export interface Cast {
  zhang: Figure;
  zhangLooks: { uniform: THREE.Texture; suit: THREE.Texture; suitOpen: THREE.Texture };
  collector: Figure;
  suits: Figure[];
  suitTextures: { plain: THREE.Texture; target: THREE.Texture; plainCracked: THREE.Texture; targetCracked: THREE.Texture };
  pistol: THREE.Mesh;
}

/** The 2010 pistol: barrel along +Z, grip along -Y, magnetic telescope sight on the rail. */
export function pistolMesh(): THREE.Mesh {
  const vc = new VoxelCanvas();
  vc.box(-1, 1, 0, 3, 2, 10, 0x3a414d);
  vc.box(-1, -1, 0, 3, 2, 8, 0x2c323b);
  vc.box(-1, -5, 2, 3, 5, 3, 0x2a2620);
  vc.box(-1, -2, 5, 3, 1, 2, 0x2c323b);
  vc.box(0, 0, 10, 1, 1, 2, 0x8d939c);
  vc.box(-1, 3, 3, 3, 1, 5, 0x1f242c);
  vc.box(0, 4, 3, 1, 2, 5, 0x14171d);
  vc.box(0, 4, 8, 1, 2, 1, 0x7fb4dc);
  return vc.mesh(0.3, VOXEL_MATERIAL, true);
}

/** Group centre of the photograph and the suit grid around it. */
export const GROUP_CENTRE = new THREE.Vector3(0, 1075, 300);
export const SUIT_ROWS = 3;
export const SUIT_COLS = 10;

/** Resting position of the suit in grid cell (row, col), before float drift. */
export function suitBase(row: number, col: number): THREE.Vector3 {
  return new THREE.Vector3((col - 4) * 4.2, GROUP_CENTRE.y + Math.sin(row * 1.7 + col * 0.9) * 0.6, 285 + row * 15);
}

export function createCast(scene: THREE.Scene): Cast {
  const zhangUnder = 0x2a332e;
  const zhangLook: Look = { skin: 0xc99270, hair: 0x1e1a18 };
  const zhangLooks = {
    uniform: uniformSheet(),
    suit: suitSheet({ band: 0xe0622b }),
    suitOpen: suitSheet({ band: 0xe0622b, open: true }),
  };
  const zhang = createFigure({ body: bodySheet(zhangLook, zhangUnder), clothes: zhangLooks.uniform, heightM: 1.8 });
  zhang.root.name = "zhang";
  const pistol = pistolMesh();
  zhang.anchors.handR.add(pistol);
  pistol.visible = false;
  scene.add(zhang.root);

  const collectorLook: Look = { skin: 0xc58a5e, hair: 0xb9b4ad, glasses: true };
  const collector = createFigure({ body: bodySheet(collectorLook, 0x3a3a40), clothes: cardiganSheet(), heightM: 1.72 });
  collector.root.name = "collector";
  scene.add(collector.root);

  const suitTextures = {
    plain: suitSheet({ band: 0x2e6fb0 }),
    target: suitSheet({ band: 0xd9362e }),
    plainCracked: suitSheet({ band: 0x2e6fb0, cracked: true }),
    targetCracked: suitSheet({ band: 0xd9362e, cracked: true }),
  };
  const suitBody = bodySheet({ skin: 0xd09b72, hair: 0x241d18 }, 0x262b31);
  const suits: Figure[] = [];
  for (let row = 0; row < SUIT_ROWS; row++) {
    for (let col = 0; col < SUIT_COLS; col++) {
      const figure = createFigure({ body: suitBody, clothes: suitTextures.plain, heightM: 1.78 });
      figure.root.name = `suit-${row}-${col}`;
      figure.root.position.copy(suitBase(row, col));
      figure.root.visible = false;
      scene.add(figure.root);
      suits.push(figure);
    }
  }

  return { zhang, zhangLooks, collector, suits, suitTextures, pistol };
}

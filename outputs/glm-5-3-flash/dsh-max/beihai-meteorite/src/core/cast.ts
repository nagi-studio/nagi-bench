import * as THREE from "three";
import { createFigure, createSkin, type Figure, type SkinPainter } from "@agentbench/voxel-kit";

/* ------------------------------------------------------------------ */
/* 脸与身体：一切五官、标识都画在 64x64 贴图上，绝不外贴几何。          */
/* ------------------------------------------------------------------ */

interface FaceOptions {
  skin: string;
  shade: string;
  hair: string;
  hairBack?: string;
  brow: string;
  mouth: string;
  glasses?: boolean;
  mustache?: string;
  stern?: boolean;
}

function paintBody(opts: FaceOptions) {
  return (p: SkinPainter): void => {
    p.fill("head", "all", opts.skin);
    p.fill("torso", "all", opts.shade);
    p.fill("armR", "all", opts.skin);
    p.fill("armL", "all", opts.skin);
    p.fill("legR", "all", opts.shade);
    p.fill("legL", "all", opts.shade);
    // 头发
    p.fill("head", "top", opts.hair);
    p.rect("head", "front", 0, 0, 8, 2, opts.hair);
    p.rect("head", "back", 0, 0, 8, 4, opts.hairBack ?? opts.hair);
    p.rect("head", "right", 0, 0, 8, 2, opts.hair);
    p.rect("head", "left", 0, 0, 8, 2, opts.hair);
    p.px("head", "right", 0, 2, opts.hair);
    p.px("head", "left", 7, 2, opts.hair);
    // 眉
    p.rect("head", "front", 1, 3, 2, 1, opts.brow);
    p.rect("head", "front", 5, 3, 2, 1, opts.brow);
    if (opts.stern) {
      p.px("head", "front", 0, 3, opts.brow);
      p.px("head", "front", 7, 3, opts.brow);
    }
    // 眼
    p.rect("head", "front", 1, 4, 2, 1, "#1c1a18");
    p.rect("head", "front", 5, 4, 2, 1, "#1c1a18");
    p.px("head", "front", 1, 4, "#f2efe9");
    p.px("head", "front", 6, 4, "#f2efe9");
    // 鼻与颊
    p.px("head", "front", 3, 5, opts.shade);
    p.px("head", "front", 4, 5, opts.shade);
    p.px("head", "front", 0, 5, opts.shade);
    p.px("head", "front", 7, 5, opts.shade);
    // 嘴 / 胡子
    if (opts.mustache) {
      p.rect("head", "front", 2, 6, 4, 1, opts.mustache);
      p.rect("head", "front", 3, 7, 2, 1, opts.mouth);
    } else {
      p.rect("head", "front", 3, 6, 2, 1, opts.mouth);
    }
    if (opts.glasses) {
      p.rect("head", "front", 1, 4, 2, 1, "#9fb9c4");
      p.rect("head", "front", 5, 4, 2, 1, "#9fb9c4");
      p.px("head", "front", 3, 4, "#4c4a45");
      p.px("head", "front", 4, 4, "#4c4a45");
      p.px("head", "front", 0, 4, "#4c4a45");
      p.px("head", "front", 7, 4, "#4c4a45");
      p.px("head", "front", 1, 3, "#4c4a45");
      p.px("head", "front", 6, 3, "#4c4a45");
    }
  };
}

/* ------------------------------ 服装 ------------------------------ */

function paintJacket(): (p: SkinPainter) => void {
  return (p) => {
    const cloth = "#4c5442";
    const dark = "#3a4132";
    p.fill("torso", "all", cloth);
    p.fill("armR", "all", cloth);
    p.fill("armL", "all", cloth);
    p.fill("legR", "all", "#3d434c");
    p.fill("legL", "all", "#3d434c");
    // 立领与前襟
    p.rect("torso", "front", 0, 0, 8, 1, dark);
    p.rect("torso", "front", 3, 1, 1, 10, dark);
    // 胸标与口袋
    p.rect("torso", "front", 1, 2, 1, 2, "#8c3128");
    p.rect("torso", "front", 5, 2, 1, 1, "#3f6b52");
    p.rect("torso", "front", 1, 6, 2, 3, dark);
    p.rect("torso", "front", 5, 6, 2, 3, dark);
    p.rect("torso", "back", 0, 0, 8, 1, dark);
    p.rect("torso", "back", 2, 2, 4, 6, "#47503d");
    // 袖口
    p.rect("armR", "front", 0, 10, 4, 2, dark);
    p.rect("armL", "front", 0, 10, 4, 2, dark);
    // 鞋
    p.rect("legR", "front", 0, 10, 4, 2, "#26282c");
    p.rect("legL", "front", 0, 10, 4, 2, "#26282c");
    p.grain("torso", "all", 0.06, 4);
    p.grain("legR", "all", 0.05, 7);
    p.grain("legL", "all", 0.05, 8);
  };
}

function paintVest(): (p: SkinPainter) => void {
  return (p) => {
    const shirt = "#cfc2a4";
    const vest = "#6b3a33";
    p.fill("torso", "all", shirt);
    // 毛背心两侧
    p.rect("torso", "front", 0, 1, 2, 11, vest);
    p.rect("torso", "front", 6, 1, 2, 11, vest);
    p.rect("torso", "back", 0, 1, 2, 11, vest);
    p.rect("torso", "back", 6, 1, 2, 11, vest);
    p.rect("torso", "left", 0, 1, 4, 11, vest);
    p.rect("torso", "right", 0, 1, 4, 11, vest);
    // 衬衫领
    p.rect("torso", "front", 0, 0, 8, 1, "#efe9dc");
    p.px("torso", "front", 3, 1, "#c4b89e");
    p.px("torso", "front", 4, 1, "#c4b89e");
    p.grain("torso", "front", 0.04, 2);
    // 衬衫袖，卷到手肘（下半截露出身体皮肤）
    p.fill("armR", "all", shirt);
    p.fill("armL", "all", shirt);
    for (const face of ["front", "back", "left", "right", "top", "bottom"] as const) {
      p.erase("armR", face, 0, 6, 4, 6);
      p.erase("armL", face, 0, 6, 4, 6);
    }
    p.rect("armR", "front", 0, 5, 4, 1, "#c4b89e");
    p.rect("armL", "front", 0, 5, 4, 1, "#c4b89e");
    // 长裤与布鞋
    p.fill("legR", "all", "#59503f");
    p.fill("legL", "all", "#59503f");
    p.rect("legR", "front", 0, 10, 4, 2, "#3a332a");
    p.rect("legL", "front", 0, 10, 4, 2, "#3a332a");
  };
}

interface SuitOptions {
  trim?: string;
  badge?: boolean;
  transparentVisor?: boolean;
  cracked?: boolean;
  rank?: boolean;
}

/** 舱外航天服：白色装甲、灰色关节、橙色识别条，面罩画在头部贴图上。 */
function paintSuit(opts: SuitOptions = {}): (p: SkinPainter) => void {
  return (p) => {
    const base = "#e8ecef";
    const joint = "#b7c0c7";
    const shadow = "#cdd5da";
    const trim = opts.trim ?? "#e07b39";
    for (const part of ["head", "torso", "armR", "armL", "legR", "legL"] as const) {
      p.fill(part, "all", base);
      p.grain(part, "all", 0.05, 5);
    }
    // 关节环
    for (const part of ["armR", "armL", "legR", "legL"] as const) {
      p.rect(part, "front", 0, 0, 4, 1, joint);
      p.rect(part, "front", 0, 11, 4, 1, joint);
      p.rect(part, "front", 0, 5, 4, 1, shadow);
      p.rect(part, "back", 0, 5, 4, 1, shadow);
    }
    // 躯干
    p.rect("torso", "front", 0, 0, 8, 1, joint);
    p.rect("torso", "front", 2, 3, 4, 4, "#c3ccd2");
    p.px("torso", "front", 3, 4, "#69d2e7");
    p.px("torso", "front", 4, 4, "#f25f5c");
    p.rect("torso", "front", 0, 8, 8, 1, trim);
    p.rect("torso", "back", 0, 2, 8, 7, "#c3ccd2");
    p.rect("torso", "back", 1, 3, 6, 5, "#aeb8bf");
    if (opts.rank) {
      p.rect("torso", "front", 1, 1, 2, 1, "#d9a441");
    }
    if (opts.badge) {
      p.rect("torso", "front", 1, 1, 1, 2, "#c8322b");
      p.px("torso", "front", 1, 1, "#f7d54d");
    }
    // 手臂识别条
    p.rect("armR", "front", 0, 3, 4, 1, trim);
    p.rect("armL", "front", 0, 3, 4, 1, trim);
    p.rect("armL", "left", 0, 5, 4, 2, "#c8322b");
    // 腿
    p.rect("legR", "front", 0, 9, 4, 1, shadow);
    p.rect("legL", "front", 0, 9, 4, 1, shadow);
    // 头盔
    p.fill("head", "all", base);
    p.rect("head", "front", 0, 0, 8, 2, base);
    p.rect("head", "front", 0, 7, 8, 1, joint);
    if (opts.transparentVisor) {
      // 透明面罩：能看到脸，顶部一道反光
      p.rect("head", "front", 0, 2, 8, 5, "#cda27e");
      p.rect("head", "front", 1, 4, 2, 1, "#20242a");
      p.rect("head", "front", 5, 4, 2, 1, "#20242a");
      p.px("head", "front", 3, 5, "#b08a67");
      p.px("head", "front", 4, 5, "#b08a67");
      p.rect("head", "front", 0, 2, 8, 1, "#8fa8b4");
      p.px("head", "front", 2, 2, "#c9dde6");
      p.px("head", "front", 6, 3, "#c9dde6");
    } else {
      p.rect("head", "front", 0, 2, 8, 5, "#13202a");
      p.rect("head", "front", 1, 2, 3, 1, "#54748536");
      p.rect("head", "front", 1, 2, 3, 1, "#547485");
      p.px("head", "front", 5, 3, "#7f98a4");
    }
    // 面罩框
    p.rect("head", "front", 0, 2, 1, 5, joint);
    p.rect("head", "front", 7, 2, 1, 5, joint);
    p.rect("head", "right", 0, 2, 8, 1, shadow);
    p.rect("head", "left", 0, 2, 8, 1, shadow);
    if (opts.cracked) {
      // 中弹后的面罩：蛛网裂纹与溅血
      p.px("head", "front", 3, 3, "#e8ecef");
      p.px("head", "front", 4, 4, "#e8ecef");
      p.px("head", "front", 2, 5, "#e8ecef");
      p.px("head", "front", 5, 2, "#e8ecef");
      p.px("head", "front", 6, 6, "#e8ecef");
      p.px("head", "front", 1, 6, "#e8ecef");
      p.rect("head", "front", 3, 4, 2, 3, "#7e1f1c");
      p.px("head", "front", 2, 3, "#a3302b");
      p.px("head", "front", 5, 3, "#a3302b");
      p.px("head", "front", 4, 2, "#a3302b");
      p.px("head", "front", 6, 4, "#5e1513");
      p.px("head", "front", 1, 5, "#5e1513");
    }
  };
}

/* ------------------------------ 演员表 ------------------------------ */

export interface Cast {
  /** 每个场景需要独立的人物实例（同一个 root 不能挂进多个场景）。 */
  makeZbGround: () => Figure;
  makeCollector: () => Figure;
  zbSpace: Figure;
  heroes: Figure[];
  crowd: Figure[];
  suitTexture: THREE.Texture;
  suitCrackedTexture: THREE.Texture;
  suitVisorTexture: THREE.Texture;
  zbSuitVisorTexture: THREE.Texture;
}

export function createCast(): Cast {
  const zbBody = createSkin(
    paintBody({
      skin: "#c99a6f",
      shade: "#b3855c",
      hair: "#211d19",
      brow: "#211d19",
      mouth: "#8a5c46",
      stern: true,
    }),
  );
  const collectorBody = createSkin(
    paintBody({
      skin: "#cfa678",
      shade: "#b8906a",
      hair: "#b6b0a4",
      brow: "#8f887b",
      mouth: "#7c5240",
      glasses: true,
      mustache: "#a89a86",
    }),
  );
  const genericBody = createSkin(
    paintBody({
      skin: "#c79a72",
      shade: "#b08358",
      hair: "#2a2521",
      brow: "#2a2521",
      mouth: "#8a5c46",
    }),
  );

  const zbClothes = createSkin(paintJacket(), { transparent: true });
  const collectorClothes = createSkin(paintVest(), { transparent: true });
  const suitPlain = createSkin(paintSuit({ badge: true }), { transparent: true });
  const suitRank = createSkin(paintSuit({ badge: true, rank: true }), { transparent: true });
  const suitCracked = createSkin(paintSuit({ badge: true, rank: true, cracked: true }), { transparent: true });
  const suitVisor = createSkin(paintSuit({ badge: true, transparentVisor: true }), { transparent: true });
  const zbSuitVisor = createSkin(paintSuit({ badge: true, trim: "#7c8577", transparentVisor: true }), {
    transparent: true,
  });
  const zbSuitClosed = createSkin(paintSuit({ badge: true, trim: "#7c8577" }), { transparent: true });

  return {
    makeZbGround: () => createFigure({ body: zbBody.texture, clothes: zbClothes.texture, heightM: 1.78 }),
    makeCollector: () => createFigure({ body: collectorBody.texture, clothes: collectorClothes.texture, heightM: 1.72 }),
    zbSpace: createFigure({ body: genericBody.texture, clothes: zbSuitClosed.texture, heightM: 1.8 }),
    heroes: [0, 1, 2].map((i) =>
      createFigure({ body: genericBody.texture, clothes: suitRank.texture, heightM: 1.74 + i * 0.03 }),
    ),
    crowd: Array.from({ length: 21 }, (_, i) =>
      createFigure({
        body: genericBody.texture,
        clothes: suitPlain.texture,
        heightM: 1.68 + ((i * 37) % 13) * 0.014,
        castShadow: false,
      }),
    ),
    suitTexture: suitPlain.texture,
    suitCrackedTexture: suitCracked.texture,
    suitVisorTexture: suitVisor.texture,
    zbSuitVisorTexture: zbSuitVisor.texture,
  };
}

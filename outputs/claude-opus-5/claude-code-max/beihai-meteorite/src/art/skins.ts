import { createSkin, type Skin, type SkinPainter } from "@agentbench/voxel-kit";

/**
 * 全片的皮肤表。
 *
 * 规矩只有一条：五官、皱纹、眼镜、肩章、面罩、裂纹、血 —— 全是贴图上的
 * 像素，没有一块凸出来的几何体。身体一张表，衣服一张表，所以同一个人
 * 可以从便装换成军装再换成航天服，而脸不用重画。
 */

const SKIN_A = "#c0885e";
const SKIN_A_DARK = "#a36f4b";
const SKIN_A_LIT = "#d29a70";
const HAIR_BLACK = "#14141b";
const HAIR_BLACK_LIT = "#25252f";

const SKIN_B = "#c9997a";
const SKIN_B_DARK = "#a97f63";
const HAIR_GREY = "#8e8e95";
const HAIR_GREY_DARK = "#5a5a63";

/** 一张永远不会被看见、但必须存在的裸体表。 */
function baseBody(paint: SkinPainter, tone: string, dark: string, under: string): void {
  for (const part of ["torso", "armR", "armL", "legR", "legL"] as const) {
    paint.fill(part, "all", part === "legR" || part === "legL" ? under : tone);
  }
  paint.fill("torso", ["left", "right", "back"], dark);
  for (const arm of ["armR", "armL"] as const) {
    paint.fill(arm, ["left", "right", "back"], dark);
    // 手：袖口以下两格，露出来的部分
    for (const face of ["front", "back", "left", "right"] as const) {
      paint.rect(arm, face, 0, 10, 4, 2, tone);
    }
    paint.fill(arm, "bottom", tone);
  }
}

/** 章北海：一张不表演的脸。眉毛是平的，嘴是一条直线。 */
export function zhangBody(): Skin {
  return createSkin((paint) => {
    baseBody(paint, SKIN_A, SKIN_A_DARK, "#2b2b2e");
    paint.fill("head", "all", SKIN_A);
    paint.fill("head", "top", HAIR_BLACK);
    paint.fill("head", "back", HAIR_BLACK);
    paint.rect("head", "back", 0, 5, 8, 3, SKIN_A_DARK);
    for (const side of ["left", "right"] as const) {
      paint.fill("head", side, SKIN_A_DARK);
      paint.rect("head", side, 0, 0, 8, 3, HAIR_BLACK);
      paint.rect("head", side, 6, 3, 2, 1, HAIR_BLACK);   // 鬓角
      paint.rect("head", side, 2, 3, 2, 2, "#b07d55");    // 耳
      paint.rect("head", side, 2, 4, 1, 1, "#8f6240");
    }
    paint.fill("head", "bottom", "#8f6240");
    // 正面
    paint.rect("head", "front", 0, 0, 8, 2, HAIR_BLACK);
    paint.rect("head", "front", 0, 2, 1, 1, HAIR_BLACK);
    paint.rect("head", "front", 7, 2, 1, 1, HAIR_BLACK);
    paint.rect("head", "front", 3, 1, 2, 1, HAIR_BLACK_LIT);
    paint.rect("head", "front", 1, 2, 6, 1, SKIN_A_LIT);  // 额
    paint.rect("head", "front", 1, 3, 2, 1, "#2c2620");   // 眉
    paint.rect("head", "front", 5, 3, 2, 1, "#2c2620");
    paint.rect("head", "front", 1, 4, 2, 1, "#efeae2");   // 眼白
    paint.rect("head", "front", 5, 4, 2, 1, "#efeae2");
    paint.px("head", "front", 2, 4, "#20242c");           // 瞳
    paint.px("head", "front", 5, 4, "#20242c");
    paint.rect("head", "front", 3, 5, 2, 1, SKIN_A_DARK); // 鼻影
    paint.px("head", "front", 0, 5, SKIN_A_DARK);
    paint.px("head", "front", 7, 5, SKIN_A_DARK);
    paint.rect("head", "front", 3, 6, 2, 1, "#6f4a41");   // 嘴：一条平线
    paint.rect("head", "front", 0, 7, 8, 1, "#a3714c");
    paint.grain("head", "all", 0.05, 4);
    paint.grain("torso", "all", 0.05, 9);
  });
}

/** 收藏者：眼镜、笑纹、灰白的鬓角。整张脸都在往上扬。 */
export function collectorBody(): Skin {
  return createSkin((paint) => {
    baseBody(paint, SKIN_B, SKIN_B_DARK, "#3a3630");
    paint.fill("head", "all", SKIN_B);
    paint.fill("head", "top", HAIR_GREY);
    paint.rect("head", "top", 2, 2, 4, 4, "#a5a5aa");
    paint.fill("head", "back", HAIR_GREY_DARK);
    paint.rect("head", "back", 0, 0, 8, 3, HAIR_GREY);
    paint.rect("head", "back", 0, 5, 8, 3, SKIN_B_DARK);
    for (const side of ["left", "right"] as const) {
      paint.fill("head", side, SKIN_B_DARK);
      paint.rect("head", side, 0, 0, 8, 2, HAIR_GREY);
      paint.rect("head", side, 5, 2, 3, 1, HAIR_GREY);
      paint.rect("head", side, 2, 3, 2, 2, "#b98a6c");
      paint.rect("head", side, 0, 3, 2, 1, "#2b2b31");   // 镜腿
    }
    paint.fill("head", "bottom", "#a17a5e");
    // 正面：发际线后退，中间是脑门
    paint.rect("head", "front", 0, 0, 2, 1, HAIR_GREY);
    paint.rect("head", "front", 6, 0, 2, 1, HAIR_GREY);
    paint.rect("head", "front", 2, 0, 4, 1, "#d4a883");
    paint.rect("head", "front", 0, 1, 8, 2, "#d4a883");
    paint.px("head", "front", 1, 2, "#b98a6c");
    paint.px("head", "front", 6, 2, "#b98a6c");
    paint.rect("head", "front", 1, 3, 2, 1, "#8b8b90");  // 花白的眉
    paint.rect("head", "front", 5, 3, 2, 1, "#8b8b90");
    // 眼镜：框、镜片、瞳
    paint.rect("head", "front", 0, 4, 8, 1, "#2b2b31");
    paint.rect("head", "front", 1, 4, 2, 1, "#bcd2da");
    paint.rect("head", "front", 5, 4, 2, 1, "#bcd2da");
    paint.px("head", "front", 2, 4, "#2a3038");
    paint.px("head", "front", 5, 4, "#2a3038");
    paint.rect("head", "front", 3, 5, 2, 1, "#b58465");  // 鼻
    paint.px("head", "front", 1, 5, "#b0805f");          // 笑纹
    paint.px("head", "front", 6, 5, "#b0805f");
    paint.rect("head", "front", 3, 6, 2, 1, "#7c4a3e");  // 微微上扬的嘴
    paint.px("head", "front", 2, 6, "#96685a");
    paint.px("head", "front", 5, 6, "#96685a");
    paint.rect("head", "front", 0, 7, 8, 1, "#ae7e5e");
    paint.grain("head", "all", 0.07, 12);
  });
}

/** 一张给合影群像用的通用身体，永远藏在航天服里。 */
export function crowdBody(seed: number): Skin {
  const tones = ["#c39068", "#b8825a", "#cf9d78", "#a97448"];
  const tone = tones[seed % tones.length]!;
  return createSkin((paint) => {
    baseBody(paint, tone, "#9a6b46", "#2f2f33");
    paint.fill("head", "all", tone);
    paint.fill("head", "top", seed % 3 === 0 ? "#4a4a50" : HAIR_BLACK);
    paint.fill("head", "back", seed % 3 === 0 ? "#4a4a50" : HAIR_BLACK);
    for (const side of ["left", "right"] as const) {
      paint.fill("head", side, "#a9764f");
      paint.rect("head", side, 0, 0, 8, 3, seed % 3 === 0 ? "#4a4a50" : HAIR_BLACK);
    }
    paint.rect("head", "front", 0, 0, 8, 2, seed % 3 === 0 ? "#4a4a50" : HAIR_BLACK);
    paint.rect("head", "front", 1, 3, 2, 1, "#33291f");
    paint.rect("head", "front", 5, 3, 2, 1, "#33291f");
    paint.rect("head", "front", 1, 4, 2, 1, "#efeae2");
    paint.rect("head", "front", 5, 4, 2, 1, "#efeae2");
    paint.px("head", "front", 2, 4, "#242830");
    paint.px("head", "front", 5, 4, "#242830");
    paint.rect("head", "front", 3, 6, 2, 1, "#7d4a3c");
    paint.grain("head", "all", 0.06, seed * 7 + 3);
  });
}

// ── 衣服 ──────────────────────────────────────────────────────────────────

/** 两条腿贴在一起时会糊成一块，所以内侧各留一道暗缝。 */
function legSeam(paint: SkinPainter, colour: string): void {
  paint.rect("legR", "front", 3, 0, 1, 12, colour);
  paint.rect("legL", "front", 0, 0, 1, 12, colour);
  paint.rect("legR", "back", 0, 0, 1, 12, colour);
  paint.rect("legL", "back", 3, 0, 1, 12, colour);
}

function sleeveCuff(paint: SkinPainter, colour: string): void {
  for (const arm of ["armR", "armL"] as const) {
    for (const face of ["front", "back", "left", "right"] as const) {
      paint.rect(arm, face, 0, 8, 4, 1, colour);
      paint.erase(arm, face, 0, 9, 4, 3);
    }
    paint.clear(arm, "bottom");
  }
}

/** 便装：一件洗旧的军绿夹克。他去买石头时穿的。 */
export function zhangCivilClothes(): Skin {
  return createSkin((paint) => {
    const cloth = "#3f4a38";
    const dark = "#2e3729";
    paint.fill("torso", "all", cloth);
    paint.fill("torso", ["left", "right", "back"], dark);
    paint.rect("torso", "front", 0, 0, 8, 2, dark);       // 领
    paint.rect("torso", "front", 3, 0, 2, 12, "#333d2d"); // 门襟
    paint.rect("torso", "front", 1, 3, 2, 3, dark);       // 胸袋
    paint.rect("torso", "front", 5, 3, 2, 3, dark);
    paint.rect("torso", "front", 1, 3, 2, 1, "#4a563f");
    paint.rect("torso", "front", 5, 3, 2, 1, "#4a563f");
    paint.rect("torso", "front", 0, 10, 8, 2, "#333d2d"); // 下摆
    paint.fill("armR", "all", cloth);
    paint.fill("armL", "all", cloth);
    paint.fill("armR", ["left", "right", "back"], dark);
    paint.fill("armL", ["left", "right", "back"], dark);
    sleeveCuff(paint, "#333d2d");
    paint.fill("legR", "all", "#33322e");
    paint.fill("legL", "all", "#33322e");
    paint.fill("legR", ["left", "right", "back"], "#2a2926");
    paint.fill("legL", ["left", "right", "back"], "#2a2926");
    legSeam(paint, "#1f1e1c");
    paint.grain("torso", "all", 0.09, 21);
    paint.grain("legR", "all", 0.07, 22);
    paint.grain("legL", "all", 0.07, 23);
  }, { transparent: true });
}

/** 收藏者：一件灰蓝的针织开衫，比这屋子里任何一块石头都旧。 */
export function collectorClothes(): Skin {
  return createSkin((paint) => {
    const knit = "#5d6b74";
    const dark = "#48545c";
    paint.fill("torso", "all", knit);
    paint.fill("torso", ["left", "right", "back"], dark);
    paint.rect("torso", "front", 3, 0, 2, 12, "#4b585f");
    paint.rect("torso", "front", 0, 0, 8, 2, "#3f4a51");
    paint.px("torso", "front", 3, 3, "#c9c3ae");
    paint.px("torso", "front", 3, 6, "#c9c3ae");
    paint.px("torso", "front", 3, 9, "#c9c3ae");
    paint.rect("torso", "front", 1, 7, 2, 3, dark);
    paint.rect("torso", "front", 5, 7, 2, 3, dark);
    paint.fill("armR", "all", knit);
    paint.fill("armL", "all", knit);
    paint.fill("armR", ["left", "right", "back"], dark);
    paint.fill("armL", ["left", "right", "back"], dark);
    sleeveCuff(paint, "#3f4a51");
    paint.fill("legR", "all", "#4c4335");
    paint.fill("legL", "all", "#4c4335");
    paint.fill("legR", ["left", "right", "back"], "#3e3729");
    paint.fill("legL", ["left", "right", "back"], "#3e3729");
    legSeam(paint, "#2c271d");
    paint.grain("torso", "all", 0.13, 31);
    paint.grain("armR", "all", 0.13, 32);
    paint.grain("armL", "all", 0.13, 33);
  }, { transparent: true });
}

/** 太空军常服：深藏青，立领，一枚很小的金色徽记。 */
export function zhangUniformClothes(): Skin {
  return createSkin((paint) => {
    const navy = "#1e2740";
    const dark = "#161d31";
    const slate = "#37456a";
    paint.fill("torso", "all", navy);
    paint.fill("torso", ["left", "right", "back"], dark);
    paint.rect("torso", "front", 0, 0, 8, 2, "#141a2c");   // 立领
    paint.rect("torso", "front", 3, 0, 2, 12, "#18203a");
    paint.rect("torso", "front", 1, 3, 3, 1, "#9aa6bd");   // 姓名条
    paint.rect("torso", "front", 5, 3, 2, 2, "#c2a55f");   // 徽记
    paint.px("torso", "front", 5, 3, "#e6d093");
    paint.px("torso", "front", 6, 4, "#8e7736");
    paint.rect("torso", "front", 0, 8, 8, 1, "#141a2c");
    paint.fill("armR", "all", navy);
    paint.fill("armL", "all", navy);
    paint.fill("armR", ["left", "right", "back"], dark);
    paint.fill("armL", ["left", "right", "back"], dark);
    for (const arm of ["armR", "armL"] as const) {
      for (const face of ["front", "back", "left", "right"] as const) {
        paint.rect(arm, face, 0, 0, 4, 2, slate);          // 肩章
        paint.px(arm, face, 1, 1, "#c2a55f");
      }
      paint.fill(arm, "top", slate);
    }
    sleeveCuff(paint, "#141a2c");
    paint.fill("legR", "all", navy);
    paint.fill("legL", "all", navy);
    paint.fill("legR", ["left", "right", "back"], dark);
    paint.fill("legL", ["left", "right", "back"], dark);
    legSeam(paint, "#0f1420");
    paint.grain("torso", "all", 0.06, 41);
  }, { transparent: true });
}

export type VisorMode = "mirror" | "clear" | "hit";

export interface SuitOptions {
  visor: VisorMode;
  /** 肩带与胸口标识的颜色，用来在合影里区分不同的人。 */
  accent?: string;
  /** 面罩透明时露出的脸型，0..3。 */
  face?: number;
  shell?: string;
  seed?: number;
}

const SUIT_SHELL = "#dcdcd4";
const SUIT_SHADE = "#b8b9b2";
const SUIT_DEEP = "#94958f";
const VISOR_DARK = "#0c131c";

function paintVisorFace(paint: SkinPainter, variant: number): void {
  // 面罩后面的脸：偏冷、偏暗，边上留一道玻璃反光。
  const tone = ["#a1785a", "#95704f", "#ab8161", "#8d6a4b"][variant % 4]!;
  paint.rect("head", "front", 1, 2, 6, 5, tone);
  paint.rect("head", "front", 1, 2, 6, 1, "#151d27");
  paint.rect("head", "front", 1, 3, 2, 1, "#2b2118");
  paint.rect("head", "front", 5, 3, 2, 1, "#2b2118");
  paint.rect("head", "front", 1, 4, 2, 1, "#e7e2d8");
  paint.rect("head", "front", 5, 4, 2, 1, "#e7e2d8");
  paint.px("head", "front", 2, 4, "#232830");
  paint.px("head", "front", 5, 4, "#232830");
  paint.rect("head", "front", 3, 5, 2, 1, "#8a6544");
  if (variant % 2 === 0) paint.rect("head", "front", 2, 6, 4, 1, "#6d4032");
  else paint.rect("head", "front", 3, 6, 2, 1, "#6d4032");
  // 玻璃反光
  paint.px("head", "front", 6, 2, "#7fa6c4");
  paint.px("head", "front", 1, 2, "#3d5f78");
}

/**
 * 航天服的画笔。同一张版型画三种面罩状态：镀膜、透明、被击中。
 * 裂纹和血都是像素，不是几何体。
 */
function paintSuit(paint: SkinPainter, options: SuitOptions): void {
  const { visor, accent = "#c9a05a", face = 0, shell = SUIT_SHELL, seed = 1 } = options;
  {
    // 头盔
    paint.fill("head", "all", shell);
    paint.fill("head", ["left", "right"], SUIT_SHADE);
    paint.fill("head", "back", SUIT_DEEP);
    paint.fill("head", "bottom", "#6e6f6a");
    paint.rect("head", "top", 1, 1, 6, 6, "#eeeee8");
    paint.rect("head", "back", 2, 1, 4, 3, "#5c5d58");
    for (const side of ["left", "right"] as const) {
      paint.rect("head", side, 0, 2, 2, 4, VISOR_DARK);
      paint.rect("head", side, 6, 6, 2, 2, "#6e6f6a");
      paint.rect("head", side, 2, 1, 4, 1, accent);
    }
    paint.rect("head", "front", 0, 0, 8, 2, shell);
    paint.rect("head", "front", 0, 7, 8, 1, "#6e6f6a");
    paint.rect("head", "front", 0, 2, 8, 5, VISOR_DARK);
    paint.px("head", "front", 0, 2, "#3d4048");
    paint.px("head", "front", 7, 2, "#3d4048");

    if (visor === "mirror") {
      // 镀金反射膜：一道斜的高光 + 落日的暖边
      paint.rect("head", "front", 1, 2, 2, 1, "#3f6a8c");
      paint.px("head", "front", 3, 3, "#31536e");
      paint.px("head", "front", 2, 3, "#4a7ea3");
      paint.rect("head", "front", 5, 4, 2, 1, "#8a4f2c");
      paint.px("head", "front", 6, 5, "#c06a34");
      paint.px("head", "front", 1, 6, "#1b2b3a");
    } else {
      paintVisorFace(paint, face);
      if (visor === "hit") {
        // 裂纹从弹着点放射出去，血在里面，然后被冻住
        paint.px("head", "front", 4, 3, "#f2f4f6");
        paint.px("head", "front", 3, 4, "#dfe6ec");
        paint.px("head", "front", 5, 4, "#dfe6ec");
        paint.px("head", "front", 2, 5, "#c8d4dd");
        paint.px("head", "front", 6, 2, "#c8d4dd");
        paint.px("head", "front", 1, 3, "#b9c6d1");
        paint.px("head", "front", 5, 5, "#8c1f1c");
        paint.px("head", "front", 4, 5, "#7a1a17");
        paint.px("head", "front", 3, 6, "#6a1512");
        paint.px("head", "front", 6, 4, "#9c2a24");
        paint.px("head", "front", 2, 2, "#e3eaf0");
      }
    }

    // 躯干：胸前控制盒、肋条、肩带
    paint.fill("torso", "all", shell);
    paint.fill("torso", ["left", "right"], SUIT_SHADE);
    paint.fill("torso", "back", SUIT_DEEP);
    paint.fill("torso", "top", "#eeeee8");
    paint.fill("torso", "bottom", "#7d7e78");
    paint.rect("torso", "front", 0, 0, 8, 1, "#8b8c86");
    paint.rect("torso", "front", 2, 3, 4, 3, "#2b3038");
    paint.rect("torso", "front", 2, 3, 4, 1, "#3d434c");
    paint.px("torso", "front", 3, 4, "#5ad07a");
    paint.px("torso", "front", 4, 4, "#e0a13c");
    paint.px("torso", "front", 5, 5, "#4aa8e0");
    paint.rect("torso", "front", 1, 1, 2, 1, accent);
    paint.rect("torso", "front", 5, 1, 2, 1, accent);
    paint.rect("torso", "front", 0, 7, 8, 1, SUIT_DEEP);
    paint.rect("torso", "front", 0, 10, 8, 1, SUIT_DEEP);
    paint.rect("torso", "back", 2, 2, 4, 6, "#6b6c67");
    paint.rect("torso", "back", 3, 3, 2, 2, "#4c4d49");

    for (const arm of ["armR", "armL"] as const) {
      paint.fill(arm, "all", shell);
      paint.fill(arm, ["left", "right"], SUIT_SHADE);
      paint.fill(arm, "back", SUIT_DEEP);
      paint.fill(arm, "top", accent);
      for (const f of ["front", "back", "left", "right"] as const) {
        paint.rect(arm, f, 0, 3, 4, 1, SUIT_DEEP);
        paint.rect(arm, f, 0, 6, 4, 1, SUIT_DEEP);
        paint.rect(arm, f, 0, 8, 4, 1, "#5b5c58");  // 手套金属护环
        paint.rect(arm, f, 0, 9, 4, 3, "#3c3f44");  // 手套
      }
      paint.fill(arm, "bottom", "#33363a");
    }
    for (const leg of ["legR", "legL"] as const) {
      paint.fill(leg, "all", shell);
      paint.fill(leg, ["left", "right"], SUIT_SHADE);
      paint.fill(leg, "back", SUIT_DEEP);
      for (const f of ["front", "back", "left", "right"] as const) {
        paint.rect(leg, f, 0, 3, 4, 1, SUIT_DEEP);
        paint.rect(leg, f, 0, 6, 4, 1, SUIT_DEEP);
        paint.rect(leg, f, 0, 9, 4, 3, "#4a4c50"); // 靴
      }
      paint.fill(leg, "bottom", "#33363a");
    }
    paint.grain("torso", "all", 0.045, seed * 5 + 1);
    paint.grain("head", ["left", "right", "top", "back"], 0.04, seed * 5 + 2);
  }
}

export function spacesuitClothes(options: SuitOptions): Skin {
  return createSkin((paint) => paintSuit(paint, options), { transparent: true });
}

/**
 * 章北海的航天服，右手套已经摘掉：护环以下被擦空，露出身体表上那只
 * 只戴薄布手套的手。零下一百度，这只手只能靠剩下的一点阳光。
 */
export function zhangSuitBareHand(options: SuitOptions): Skin {
  return createSkin((paint) => {
    paintSuit(paint, options);
    for (const f of ["front", "back", "left", "right"] as const) {
      paint.rect("armR", f, 0, 8, 4, 1, "#6a6b66");
      paint.erase("armR", f, 0, 9, 4, 3);
    }
    paint.clear("armR", "bottom");
  }, { transparent: true });
}

import * as THREE from "three";
import { createFigure, createSkin, type Figure, type SkinPainter } from "@agentbench/voxel-kit";

/**
 * 人物装配：骨架、部件比例来自 Voxel Kit 的固定规格；身份、表情、
 * 军衔与磨损全部画在 64×64 贴图上，不做凸出几何。
 */

interface FaceOpts {
  skin: string;
  hair: string;
  brow: string;
  eye: string;
  mouth: string;
  /** 胡茬 / 阴影，可选。 */
  shading?: string;
  /** 发际线高度（0=光头，2=留刘海）。 */
  fringe?: number;
  /** 是否画笑纹 / 表情线。 */
  smile?: boolean;
  greyTemples?: boolean;
}

function paintFace(p: SkinPainter, o: FaceOpts): void {
  // 头正面 8x8，脸部基本肤色。
  p.fill("head", "all", o.skin);

  // 头发：顶、后、两侧，以及前额的刘海。
  p.fill("head", "top", o.hair);
  p.fill("head", "back", o.hair);
  p.fill("head", "left", o.hair);
  p.fill("head", "right", o.hair);
  const fringe = o.fringe ?? 2;
  for (let y = 0; y < fringe; y += 1) p.rect("head", "front", 0, y, 8, 1, o.hair);
  if (o.greyTemples) {
    p.rect("head", "front", 0, fringe, 2, 1, o.brow);
    p.rect("head", "front", 6, fringe, 2, 1, o.brow);
  }

  // 眉、眼、口。
  p.rect("head", "front", 1, 2, 2, 1, o.brow);
  p.rect("head", "front", 5, 2, 2, 1, o.brow);
  p.rect("head", "front", 1, 3, 2, 1, o.eye);
  p.rect("head", "front", 5, 3, 2, 1, o.eye);
  if (o.smile) {
    p.rect("head", "front", 2, 5, 4, 1, o.mouth);
    p.rect("head", "front", 1, 4, 1, 1, o.mouth);
    p.rect("head", "front", 6, 4, 1, 1, o.mouth);
  } else {
    p.rect("head", "front", 2, 5, 4, 1, o.mouth);
  }
  if (o.shading) {
    p.rect("head", "front", 3, 5, 2, 1, o.shading);
    p.rect("head", "front", 3, 4, 2, 1, o.shading);
  }
}

function baseBody(skin: string, o: FaceOpts): THREE.CanvasTexture {
  return createSkin((p) => {
    paintFace(p, o);
    p.fill("torso", "all", skin);
    p.fill("armR", "all", skin);
    p.fill("armL", "all", skin);
    p.fill("legR", "all", skin);
    p.fill("legL", "all", skin);
  }).texture;
}

/** 章北海的太空军常服。 */
function zhangUniform(): THREE.CanvasTexture {
  return createSkin(
    (p) => {
      const navy = "#1d2c40";
      const navy2 = "#283a52";
      const trim = "#c9a94c";
      const boot = "#151b24";
      p.fill("torso", "all", navy);
      p.fill("armR", "all", navy2);
      p.fill("armL", "all", navy2);
      p.fill("legR", "all", navy);
      p.fill("legL", "all", navy);

      // 躯干正面：立领、门襟、绶带与军衔。
      p.rect("torso", "front", 3, 0, 2, 2, "#10161f");
      p.rect("torso", "front", 3, 2, 2, 8, "#10161f");
      p.rect("torso", "front", 2, 1, 4, 1, trim);
      p.rect("torso", "front", 6, 3, 1, 1, trim);
      p.rect("torso", "front", 5, 4, 1, 1, trim);
      p.rect("torso", "front", 6, 5, 1, 1, trim);
      p.rect("torso", "front", 1, 3, 1, 3, "#8e2f28");
      // 肩章。
      p.rect("armR", "front", 0, 0, 4, 1, trim);
      p.rect("armL", "front", 0, 0, 4, 1, trim);
      // 裤脚靴子。
      p.rect("legR", "front", 0, 10, 4, 2, boot);
      p.rect("legL", "front", 0, 10, 4, 2, boot);
      p.grain("torso", "all", 0.05, 7);
    },
    { transparent: true },
  ).texture;
}

/** 章北海的舱外航天服（闭面罩）。 */
function zhangSuit(visorOpen: boolean): THREE.CanvasTexture {
  return createSkin(
    (p) => {
      const white = "#e7e9ec";
      const white2 = "#c9cfd6";
      const panel = "#5b6673";
      const accent = "#3d6d8e";
      const boot = "#9aa2ac";
      p.fill("torso", "all", white);
      p.fill("armR", "all", white2);
      p.fill("armL", "all", white2);
      p.fill("legR", "all", white);
      p.fill("legL", "all", white);

      // 胸部控制面板与管路。
      p.rect("torso", "front", 2, 3, 4, 4, panel);
      p.rect("torso", "front", 3, 4, 1, 1, "#7fd0c8");
      p.rect("torso", "front", 4, 5, 1, 1, "#e0b348");
      p.rect("torso", "front", 3, 6, 2, 1, "#8fb4d6");
      p.rect("torso", "front", 1, 2, 6, 1, accent);
      p.rect("torso", "front", 0, 8, 8, 1, "#3d6d8e");
      p.rect("armR", "front", 0, 2, 4, 1, accent);
      p.rect("armL", "front", 0, 2, 4, 1, accent);
      p.rect("legR", "front", 0, 10, 4, 2, boot);
      p.rect("legL", "front", 0, 10, 4, 2, boot);
      // 头盔：白色外壳，正面暗色面罩（透出一点面部）。
      p.fill("head", "all", white);
      p.rect("head", "front", 1, 2, 6, 4, visorOpen ? "#1a2c3a" : "#0b141c");
      if (visorOpen) {
        p.rect("head", "front", 2, 3, 2, 1, "#d8a87a");
        p.rect("head", "front", 5, 3, 2, 1, "#d8a87a");
      }
      p.rect("head", "front", 0, 1, 8, 1, "#5b6673");
      p.rect("head", "front", 0, 6, 8, 1, "#5b6673");
      p.rect("head", "top", 1, 3, 1, 1, "#3d6d8e");
      p.grain("torso", "all", 0.04, 11);
    },
    { transparent: true },
  ).texture;
}

/** 陨石收藏者。 */
function collectorBody(): THREE.CanvasTexture {
  return baseBody("#d9ad84", {
    skin: "#d9ad84",
    hair: "#b6b6ba",
    brow: "#8a8a8e",
    eye: "#2c2a26",
    mouth: "#6b4632",
    fringe: 1,
    smile: true,
    greyTemples: true,
  });
}

function collectorClothes(): THREE.CanvasTexture {
  return createSkin(
    (p) => {
      const cardigan = "#6b4a32";
      const shirt = "#d7c8a4";
      const pants = "#3a3630";
      p.fill("torso", "all", cardigan);
      p.fill("armR", "all", cardigan);
      p.fill("armL", "all", cardigan);
      p.fill("legR", "all", pants);
      p.fill("legL", "all", pants);
      // 开衫门襟与内里衬衫。
      p.rect("torso", "front", 3, 0, 2, 12, shirt);
      p.rect("torso", "front", 0, 0, 8, 1, "#5a3c28");
      p.rect("torso", "front", 0, 11, 8, 1, "#5a3c28");
      // 露出的衬衫袖口。
      p.rect("armR", "front", 0, 10, 4, 2, shirt);
      p.rect("armL", "front", 0, 10, 4, 2, shirt);
      p.grain("torso", "all", 0.06, 21);
    },
    { transparent: true },
  ).texture;
}

/** 常伟思——年长、橄榄绿军服。 */
function changBody(): THREE.CanvasTexture {
  return baseBody("#d4ab82", {
    skin: "#d4ab82",
    hair: "#d8d8da",
    brow: "#77777b",
    eye: "#232120",
    mouth: "#7a5a42",
    fringe: 1,
    greyTemples: true,
  });
}

function changClothes(): THREE.CanvasTexture {
  return createSkin(
    (p) => {
      const olive = "#3e4a34";
      const olive2 = "#4d5a42";
      const trim = "#c9a94c";
      p.fill("torso", "all", olive);
      p.fill("armR", "all", olive2);
      p.fill("armL", "all", olive2);
      p.fill("legR", "all", olive);
      p.fill("legL", "all", olive);
      p.rect("torso", "front", 3, 0, 2, 2, "#1d2419");
      p.rect("torso", "front", 3, 2, 2, 8, "#1d2419");
      p.rect("torso", "front", 2, 1, 4, 1, trim);
      p.rect("torso", "front", 6, 3, 1, 1, trim);
      p.rect("torso", "front", 5, 4, 1, 1, trim);
      p.rect("torso", "front", 6, 5, 1, 1, trim);
      p.rect("armR", "front", 0, 0, 4, 1, trim);
      p.rect("armL", "front", 0, 0, 4, 1, trim);
      p.rect("legR", "front", 0, 10, 4, 2, "#1d2419");
      p.rect("legL", "front", 0, 10, 4, 2, "#1d2419");
    },
    { transparent: true },
  ).texture;
}

/** 父亲——苍白、白发、旧式深色便服。 */
function fatherBody(): THREE.CanvasTexture {
  return baseBody("#dcc6aa", {
    skin: "#dcc6aa",
    hair: "#ececee",
    brow: "#8a8a8c",
    eye: "#252220",
    mouth: "#8a6a50",
    fringe: 1,
    shading: "#c8b398",
  });
}

function fatherClothes(): THREE.CanvasTexture {
  return createSkin(
    (p) => {
      const coat = "#454545";
      const shirt = "#cfc4ae";
      p.fill("torso", "all", coat);
      p.fill("armR", "all", coat);
      p.fill("armL", "all", coat);
      p.fill("legR", "all", "#303030");
      p.fill("legL", "all", "#303030");
      p.rect("torso", "front", 3, 0, 2, 12, shirt);
      p.rect("armR", "front", 0, 10, 4, 2, shirt);
      p.rect("armL", "front", 0, 10, 4, 2, shirt);
      p.grain("torso", "all", 0.05, 31);
    },
    { transparent: true },
  ).texture;
}

/** 合影人群的通用航天服（白 + 蓝条，可开面罩）。 */
function crowdSuit(seed: number, visorOpen: boolean): THREE.CanvasTexture {
  return createSkin(
    (p) => {
      const white = "#e6e8ec";
      const white2 = "#ccd2d8";
      const blue = "#3d6d8e";
      const grey = "#99a1ab";
      p.fill("torso", "all", white);
      p.fill("armR", "all", white2);
      p.fill("armL", "all", white2);
      p.fill("legR", "all", white);
      p.fill("legL", "all", white);
      p.rect("torso", "front", 1, 3, 6, 1, blue);
      p.rect("torso", "front", 1, 7, 6, 1, blue);
      p.rect("torso", "front", 2, 4, 4, 2, grey);
      p.rect("armR", "front", 0, 2, 4, 1, blue);
      p.rect("armL", "front", 0, 2, 4, 1, blue);
      p.rect("legR", "front", 0, 10, 4, 2, grey);
      p.rect("legL", "front", 0, 10, 4, 2, grey);
      p.fill("head", "all", white);
      p.rect("head", "front", 0, 1, 8, 1, "#8a929c");
      p.rect("head", "front", 0, 6, 8, 1, "#8a929c");
      if (visorOpen) {
        // 面罩透明：挖空露脸，露出身体贴图上的五官。
        p.erase("head", "front", 1, 2, 6, 4);
      } else {
        p.rect("head", "front", 1, 2, 6, 4, "#0a1219");
      }
      p.grain("torso", "all", 0.03, seed);
    },
    { transparent: true },
  ).texture;
}

export interface Cast {
  zhang: Figure;
  collector: Figure;
  chang: Figure;
  father: Figure;
  crowd: Figure[];
  crowdOpenSuit: THREE.CanvasTexture[];
}

/** 章北海三套装束（预生成，避免每次 setClothes 重建纹理）。 */
export const ZHANG_OUTFITS = {
  uniform: zhangUniform(),
  suit: zhangSuit(false),
  suitOpen: zhangSuit(true),
} as const;

export function dressZhang(fig: Figure, outfit: keyof typeof ZHANG_OUTFITS): void {
  fig.setClothes(ZHANG_OUTFITS[outfit]);
}

export function buildCast(scene: THREE.Scene): Cast {
  const zhang = createFigure({
    body: baseBody("#d0a07a", {
      skin: "#d0a07a",
      hair: "#2a2a30",
      brow: "#1b1b20",
      eye: "#12100e",
      mouth: "#5c4030",
      fringe: 2,
      greyTemples: true,
    }),
    clothes: zhangUniform(),
    heightM: 1.82,
  });

  const collector = createFigure({
    body: collectorBody(),
    clothes: collectorClothes(),
    heightM: 1.72,
  });

  const chang = createFigure({
    body: changBody(),
    clothes: changClothes(),
    heightM: 1.8,
  });

  const father = createFigure({
    body: fatherBody(),
    clothes: fatherClothes(),
    heightM: 1.74,
  });

  const crowd: Figure[] = [];
  const crowdOpenSuit: THREE.CanvasTexture[] = [];
  for (let i = 0; i < 14; i += 1) {
    crowd.push(
      createFigure({
        body: baseBody("#d2a57e", {
          skin: "#d2a57e",
          hair: "#20242a",
          brow: "#14171c",
          eye: "#100f0d",
          mouth: "#5c4030",
          fringe: 1,
        }),
        clothes: crowdSuit(i, false),
        heightM: 1.72 + (i % 3) * 0.04,
      }),
    );
    crowdOpenSuit.push(crowdSuit(i, true));
  }

  scene.add(zhang.root, collector.root, chang.root, father.root);
  for (const f of crowd) scene.add(f.root);

  zhang.root.visible = false;
  collector.root.visible = false;
  chang.root.visible = false;
  father.root.visible = false;
  for (const f of crowd) f.root.visible = false;

  return { zhang, collector, chang, father, crowd, crowdOpenSuit };
}

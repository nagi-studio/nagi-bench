import * as THREE from "three";
import { voxelModel, buildVoxelGeometry } from "@agentbench/voxel-kit";

import { grainy, shade } from "../lib/vox";

/**
 * 道具。
 *
 * 每一件都画成"立面图"再挤出来，而不是拿盒子拼 —— 这样一把手枪的侧影
 * 是可以直接读的，也可以直接改。手上的道具一律以 figure 的 px 为单位，
 * 因为它们挂在 anchor 上，跟着人一起缩放。
 */

/** 把几何体的某个体素位置挪到原点，用来对齐握把、笔尖、杯底。 */
function anchorAt(
  geometry: THREE.BufferGeometry,
  size: [number, number, number],
  cell: [number, number, number],
  voxel: number,
): THREE.BufferGeometry {
  geometry.translate(
    -(cell[0] + 0.5 - size[0] / 2) * voxel,
    -(cell[1] + 0.5 - size[1] / 2) * voxel,
    -(cell[2] + 0.5 - size[2] / 2) * voxel,
  );
  return geometry;
}

const STEEL = 0x2c313a;
const STEEL_LIT = 0x474e59;
const GRIP = 0x1b1e23;
const BRASS = 0x8a7648;

/**
 * 2010 式手枪。侧立面，枪口朝 +Z、握把朝 -Y，
 * 挂到 handR 上就自然指向手臂所指的方向。
 */
export function pistolGeometry(voxel = 0.34): THREE.BufferGeometry {
  const SIDE = [
    "..............",
    ".ssssssssssss.",
    ".############.",
    ".#############",
    ".####ttt######",
    ".ggg..t.......",
    ".ggg..........",
    ".ggg..........",
    "..ggg.........",
    "..ggg.........",
  ];
  const OUTER = SIDE.map((row) => row.replace(/s/g, "#"));
  const geometry = voxelModel({
    palette: { "#": STEEL, s: STEEL_LIT, g: GRIP, t: 0x6d7480 },
    layers: [OUTER, SIDE, OUTER],
    axis: "x",
    voxel,
    anchor: "center",
  });
  return anchorAt(geometry, [3, 10, 14], [1, 3, 3], voxel);
}

/** 步枪用的瞄准镜，夹具换成了磁铁，所以能坐在手枪的滑套上。 */
export function scopeGeometry(voxel = 0.34): THREE.BufferGeometry {
  const SIDE = [
    "..mmmmmmmm..",
    ".oOOOOOOOOo.",
    ".oOOOOOOOOo.",
    "..mm....mm..",
  ];
  const geometry = voxelModel({
    palette: { O: 0x23272e, o: 0x3b414a, m: 0x14171b },
    layers: [SIDE, SIDE, SIDE],
    axis: "x",
    voxel,
    anchor: "center",
  });
  return anchorAt(geometry, [3, 4, 12], [1, 3, 5], voxel);
}

/** 弹夹。 */
export function magazineGeometry(voxel = 0.3): THREE.BufferGeometry {
  const SIDE = [
    "bb..",
    "##..",
    "##..",
    "##..",
    "##..",
    "###.",
  ];
  const geometry = voxelModel({
    palette: { "#": 0x232830, b: BRASS },
    layers: [SIDE, SIDE],
    axis: "x",
    voxel,
    anchor: "center",
  });
  return anchorAt(geometry, [2, 6, 4], [1, 0, 1], voxel);
}

/** 一发无壳弹：发射药柱 + 顶端粘上去的那一小段陨石。 */
export function meteoriteRoundGeometry(voxel = 0.05, withTip = true): THREE.BufferGeometry {
  const height = withTip ? 7 : 5;
  return buildVoxelGeometry(
    {
      size: [2, height, 2],
      at(x, y, z) {
        if (y >= 5) return withTip ? grainy(0x4a463f, x, y, z, 0.2, 5) : null;
        return grainy(y === 4 ? 0x6a5c3a : 0x3b3a36, x, y, z, 0.08, 3);
      },
    },
    { voxel, anchor: "center" },
  );
}

/** 车间里切出来的那种小圆柱。三十六个里的一个。 */
export function meteoriteSlugGeometry(voxel = 0.05): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [2, 4, 2],
      at(x, y, z) {
        return grainy(0x4d4841, x, y, z, 0.22, 11);
      },
    },
    { voxel, anchor: "center" },
  );
}

/** 老式盖碗茶杯。全片里唯一一件被当成宇宙学论据的东西。 */
export function teacupGeometry(voxel = 0.022): THREE.BufferGeometry {
  const r = 3.2;
  return buildVoxelGeometry(
    {
      size: [8, 7, 8],
      at(x, y, z) {
        const dx = x + 0.5 - 4;
        const dz = z + 0.5 - 4;
        const d = Math.sqrt(dx * dx + dz * dz);
        const radius = r * (0.72 + (y / 7) * 0.36);
        if (d > radius) return null;
        if (y === 0) return 0xd8d2c4;
        if (y >= 5 && d < radius - 1) return y === 6 ? 0x8d6a3a : 0xa8804a; // 茶
        if (d < radius - 1) return null;
        return grainy(0xe6e1d5, x, y, z, 0.05, 2);
      },
    },
    { voxel, anchor: "min" },
  );
}

/** 钳子。取弹头的那把。 */
export function pliersGeometry(voxel = 0.3): THREE.BufferGeometry {
  const SIDE = [
    "hh....jj",
    ".hh..jj.",
    "..hhjj..",
    "...XX...",
    "..jjhh..",
    ".jj..hh.",
    "jj....hh",
  ];
  const geometry = voxelModel({
    palette: { h: 0x8a3f2c, j: 0x5a616b, X: 0x2e333a },
    layers: [SIDE, SIDE],
    axis: "x",
    voxel,
    anchor: "center",
  });
  return anchorAt(geometry, [2, 7, 8], [1, 3, 1], voxel);
}

/** 放大镜。 */
export function magnifierGeometry(voxel = 0.28): THREE.BufferGeometry {
  const FRONT = [
    ".fff.",
    "fgggf",
    "fgggf",
    "fgggf",
    ".fff.",
    "..h..",
    "..h..",
    "..h..",
  ];
  const geometry = voxelModel({
    palette: { f: 0x3a3f47, g: 0xbcd6de, h: 0x6b4b2c },
    layers: [FRONT],
    axis: "z",
    voxel,
    anchor: "center",
  });
  return anchorAt(geometry, [5, 8, 1], [2, 1, 0], voxel);
}

/** 手机。付款用三秒钟。 */
export function phoneGeometry(voxel = 0.26): THREE.BufferGeometry {
  const SIDE = ["ssssss", "ssssss"];
  const FACE = ["gggggg", "gggggg"];
  const geometry = voxelModel({
    palette: { s: 0x1d2026, g: 0x8fb4c4 },
    layers: [SIDE, FACE],
    axis: "x",
    voxel,
    anchor: "center",
  });
  return anchorAt(geometry, [2, 2, 6], [1, 1, 3], voxel);
}

/** 航天服背后的生命维持包。挂在 back anchor 上，只为剪影。 */
export function lifePackGeometry(voxel = 0.9): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [7, 9, 3],
      at(x, y, z) {
        if (z === 2 && (x === 0 || x === 6)) return null;
        if (y === 8 && z > 0) return null;
        const shell = z === 0 ? 0xb9bab4 : 0xd2d3cc;
        if (y >= 2 && y <= 5 && x >= 2 && x <= 4 && z === 2) return 0x4d5158;
        return grainy(shell, x, y, z, 0.05, 17);
      },
    },
    { voxel, anchor: "center" },
  );
}

/** 一块生牛肉。裹在航天服布料里，做冲击试验用。 */
export function beefGeometry(voxel = 0.035): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [7, 4, 5],
      at(x, y, z) {
        const edge = x === 0 || x === 6 || z === 0 || z === 4;
        if (edge && (y === 0 || y === 3)) return null;
        const marble = (x * 3 + z * 5 + y) % 7 === 0;
        return grainy(marble ? 0xc9b0a4 : 0x8e2f2c, x, y, z, 0.16, 31);
      },
    },
    { voxel, anchor: "center" },
  );
}

/** 一小堆掌心里的碎石：射进牛肉之后剩下的东西。 */
export function gravelGeometry(voxel = 0.012): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [9, 3, 7],
      at(x, y, z) {
        const dx = (x - 4) / 4.2;
        const dz = (z - 3) / 3.2;
        const mound = 1 - (dx * dx + dz * dz);
        if (mound <= 0) return null;
        if (y > Math.floor(mound * 2.6)) return null;
        const n = (x * 7 + z * 13 + y * 29) % 11;
        if (n === 0) return null;
        return shade(n > 8 ? 0x807a70 : 0x3f3b35, 0.85 + (n % 4) * 0.09);
      },
    },
    { voxel, anchor: "min" },
  );
}

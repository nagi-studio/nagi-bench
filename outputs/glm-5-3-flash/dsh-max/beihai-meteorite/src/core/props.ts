import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, voxelModel } from "@agentbench/voxel-kit";
import { hash3 } from "./util";

/* ------------------------------------------------------------------ */
/* 体素道具：全部用字符网格 / 体素函数生成，同一套块状语言。            */
/* ------------------------------------------------------------------ */

/** 单色长方体（合并后的单几何体）。 */
export function vbox(
  w: number,
  h: number,
  d: number,
  color: number | ((x: number, y: number, z: number) => number | null),
  voxel = 1,
): THREE.BufferGeometry {
  return buildVoxelGeometry(
    {
      size: [w, h, d],
      at: (x, y, z) => (typeof color === "function" ? color(x, y, z) : color),
    },
    { voxel },
  );
}

export interface BoxSpec {
  from: [number, number, number];
  to: [number, number, number]; // exclusive
  color: number | ((x: number, y: number, z: number) => number | null);
}

/** 把一组长方体合并成一个体素几何体：房间、巷子、大厅都用它搭建。 */
export function voxelUnion(boxes: BoxSpec[], voxel = 1): THREE.BufferGeometry {
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  for (const b of boxes) {
    minX = Math.min(minX, b.from[0]);
    minY = Math.min(minY, b.from[1]);
    minZ = Math.min(minZ, b.from[2]);
    maxX = Math.max(maxX, b.to[0]);
    maxY = Math.max(maxY, b.to[1]);
    maxZ = Math.max(maxZ, b.to[2]);
  }
  const size: [number, number, number] = [
    Math.max(1, Math.ceil(maxX - minX)),
    Math.max(1, Math.ceil(maxY - minY)),
    Math.max(1, Math.ceil(maxZ - minZ)),
  ];
  const geometry = buildVoxelGeometry(
    {
      size,
      at(x, y, z) {
        const wx = x + minX;
        const wy = y + minY;
        const wz = z + minZ;
        for (let i = boxes.length - 1; i >= 0; i--) {
          const b = boxes[i]!;
          if (
            wx >= b.from[0] && wy >= b.from[1] && wz >= b.from[2] &&
            wx < b.to[0] && wy < b.to[1] && wz < b.to[2]
          ) {
            return typeof b.color === "function" ? b.color(wx, wy, wz) : b.color;
          }
        }
        return null;
      },
    },
    { voxel, anchor: "min" },
  );
  geometry.translate(minX * voxel, minY * voxel, minZ * voxel);
  return geometry;
}

export function mesh(geometry: THREE.BufferGeometry, material?: THREE.Material): THREE.Mesh {
  return new THREE.Mesh(geometry, material ?? voxelMaterial());
}

/** 不规则陨石碎块。 */
export function voxelRock(size: number, seed: number, palette: number[], voxel = 0.05): THREE.BufferGeometry {
  const cx = size / 2;
  return buildVoxelGeometry(
    {
      size: [size, size, size],
      at(x, y, z) {
        const dx = x + 0.5 - cx;
        const dy = (y + 0.5 - cx) * 1.25;
        const dz = z + 0.5 - cx;
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const n = hash3(x, y, z, seed) * 0.55;
        if (r > cx - 0.35 + n) return null;
        const k = 0.82 + hash3(x, z, y, seed + 9) * 0.36;
        const base = palette[Math.floor(hash3(x, y, z, seed + 31) * palette.length) % palette.length];
        const c = new THREE.Color(base);
        c.multiplyScalar(k);
        return c.getHex();
      },
    },
    { voxel },
  );
}

/** 圆柱体（陨石切段、子弹）。 */
export function voxelCylinder(
  radius: number,
  height: number,
  color: (x: number, y: number, z: number, top: boolean) => number,
  voxel = 0.01,
): THREE.BufferGeometry {
  const span = radius * 2 + 1;
  return buildVoxelGeometry(
    {
      size: [span, height, span],
      at(x, y, z) {
        const dx = x + 0.5 - span / 2;
        const dz = z + 0.5 - span / 2;
        if (dx * dx + dz * dz > radius * radius) return null;
        return color(x, y, z, y === height - 1);
      },
    },
    { voxel },
  );
}

/* ------------------------------ 手枪与瞄准镜 ------------------------------ */

const PISTOL_GRID = [
  ".#..........",
  ".##########.",
  ".###########",
  ".gg......###",
  ".gg...#t#...",
  ".gg...#.#...",
  ".gg.........",
  ".gg.........",
];

export function makePistol(): THREE.BufferGeometry {
  return voxelModel({
    palette: { "#": 0x262a30, g: 0x3c4148, t: 0x6b4a2f },
    layers: [PISTOL_GRID, PISTOL_GRID],
    axis: "x",
    voxel: 0.016,
  });
}

const SCOPE_GRID = [
  ".########.",
  "#########l",
  ".########.",
  "...##.....",
];

export function makeScope(): THREE.BufferGeometry {
  return voxelModel({
    palette: { "#": 0x2a2f36, l: 0x8fd4e8, ".": 0x000000 },
    layers: [SCOPE_GRID, SCOPE_GRID],
    axis: "x",
    voxel: 0.014,
  });
}

export function makeMagazine(): THREE.BufferGeometry {
  const grid = ["###", "###", "###", "###", "##."];
  return voxelModel({ palette: { "#": 0x2e3238 }, layers: [grid], axis: "x", voxel: 0.012 });
}

/** 陨石子弹：无壳发射药上粘一段陨石。 */
export function makeMeteorRound(scale = 1): THREE.BufferGeometry {
  const grid = [
    ".ss.",
    "ssss",
    "pppp",
    "pppp",
    "pppp",
  ];
  return voxelModel({
    palette: { s: 0x8a8f96, p: 0x77664a },
    layers: [grid, grid],
    axis: "x",
    voxel: 0.008 * scale,
  });
}

/* ------------------------------ 茶具与小件 ------------------------------ */

const TEAPOT = [
  ".....##......",
  ".....##......",
  "..#########..",
  "##.#########.",
  "##.#########.",
  "...#########.",
  "...#########.",
];

export function makeTeapot(): THREE.BufferGeometry {
  return voxelModel({
    palette: { "#": 0x7a4a35, ".": null as unknown as number },
    layers: [TEAPOT, TEAPOT, TEAPOT],
    axis: "x",
    voxel: 0.018,
  });
}

const CUP = ["#..#", "#..#", "#..#", "####"];

export function makeCup(): THREE.BufferGeometry {
  return voxelModel({
    palette: { "#": 0xe8e2d6 },
    layers: [CUP, CUP],
    axis: "x",
    voxel: 0.018,
  });
}

const PHONE = [
  ".....",
  ".###.",
  ".#s#.",
  ".#s#.",
  ".#s#.",
  ".###.",
  ".....",
];

export function makePhone(): THREE.BufferGeometry {
  return voxelModel({
    palette: { "#": 0x1f232a, s: 0x9fd8e8 },
    layers: [PHONE],
    axis: "x",
    voxel: 0.013,
  });
}

const TWEEZERS = [
  "#......#",
  "#......#",
  ".#....#.",
  "..#..#..",
  "...##...",
];

export function makeTweezers(): THREE.BufferGeometry {
  return voxelModel({ palette: { "#": 0xb9c0c7 }, layers: [TWEEZERS], axis: "x", voxel: 0.009 });
}

const PLIERS = [
  "rr..rr",
  "rr..rr",
  ".#..#.",
  ".#..#.",
  "..##..",
  ".####.",
];

export function makePliers(): THREE.BufferGeometry {
  return voxelModel({
    palette: { r: 0xa33327, "#": 0x9aa2a9 },
    layers: [PLIERS, PLIERS],
    axis: "x",
    voxel: 0.02,
  });
}

const MAGNIFIER = [
  ".#####.",
  "#lllll#",
  "#lllll#",
  "#lllll#",
  ".#####.",
  "...#...",
  "...#...",
];

export function makeMagnifier(): THREE.BufferGeometry {
  return voxelModel({
    palette: { "#": 0x4a3a2c, l: 0x9fc8d8 },
    layers: [MAGNIFIER],
    axis: "x",
    voxel: 0.011,
  });
}

const KNIFE = ["########..", "......####"];

export function makeKnife(): THREE.BufferGeometry {
  return voxelModel({
    palette: { "#": 0xc2c9cf, ".": null as unknown as number, "4": 0x4a3a2c },
    layers: [KNIFE],
    axis: "x",
    voxel: 0.012,
  });
}

const AMMOBOX = [
  "############",
  "#llllllllll#",
  "############",
  "#dddddddddd#",
  "#dddddddddd#",
  "#ddddd##ddd#",
  "#dddddddddd#",
];

export function makeAmmoBox(): THREE.BufferGeometry {
  return voxelModel({
    palette: { "#": 0x4a5238, l: 0x5a6446, d: 0x424a32 },
    layers: [AMMOBOX, AMMOBOX, AMMOBOX],
    axis: "x",
    voxel: 0.024,
  });
}

const BACKPACK = [
  "##..##",
  "##..##",
  "##..##",
  "##..##",
  "######",
  "######",
];

export function makeBackpack(): THREE.BufferGeometry {
  return voxelModel({
    palette: { "#": 0xcfd6da },
    layers: [BACKPACK, BACKPACK],
    axis: "x",
    voxel: 0.09,
  });
}

const GLOVE = ["..##..", ".####.", ".####.", "..##.."];

export function makeGlove(): THREE.BufferGeometry {
  return voxelModel({ palette: { "#": 0xe4e9ec }, layers: [GLOVE, GLOVE], axis: "x", voxel: 0.03 });
}

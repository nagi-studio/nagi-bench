import * as THREE from "three";
import {
  buildVoxelGeometry,
  createFigure,
  createSkin,
  voxelMaterial,
  voxelModel,
  voxelSphere,
  type Figure,
  type SkinPainter,
} from "@agentbench/voxel-kit";

/* ───────────── 小工具 ───────────── */

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash3(x: number, y: number, z: number) {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
export function vnoise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const s = (t: number) => t * t * (3 - 2 * t);
  const u = s(xf), v = s(yf), w = s(zf);
  const L = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  return L(
    L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v),
    L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  );
}
export function fbm(x: number, y: number, z: number) {
  return vnoise(x, y, z) * 0.55 + vnoise(x * 2.1, y * 2.1, z * 2.1) * 0.3 + vnoise(x * 4.3, y * 4.3, z * 4.3) * 0.15;
}

/** 像素纹理：每个 texel 由函数决定，最近邻采样，保持方块感。 */
export function pixelTex(w: number, h: number, fn: (x: number, y: number) => string, repeat: [number, number] = [1, 1]) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { g.fillStyle = fn(x, y); g.fillRect(x, y, 1, 1); }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function shade(hex: string, k: number) {
  const c = new THREE.Color(hex);
  c.multiplyScalar(k);
  return `#${c.getHexString()}`;
}

export function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0, parent?: THREE.Object3D) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent?.add(m);
  return m;
}

export const std = (color: number | string, o: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, ...o });

/** 不规则石块：陨石、碎屑。 */
export function rockGeom(seed: number, r: number, palette: number[], voxel: number) {
  const n = Math.ceil(r) * 2 + 2;
  const c = n / 2;
  const R = rng(seed);
  const ox = R() * 50, oy = R() * 50, oz = R() * 50;
  return buildVoxelGeometry({
    size: [n, n, n],
    at(x, y, z) {
      const dx = (x + 0.5 - c) / r, dy = (y + 0.5 - c) / (r * 0.8), dz = (z + 0.5 - c) / r;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const k = vnoise(x * 0.6 + ox, y * 0.6 + oy, z * 0.6 + oz);
      if (d > 0.75 + k * 0.4) return null;
      return palette[Math.floor(hash3(x + seed, y, z) * palette.length)];
    },
  }, { voxel });
}

/* ───────────── 人物 ───────────── */

type FaceSpec = {
  skin: string;
  hair: string;
  hairStyle: "short" | "receding" | "grey";
  eye: string;
  brow: string;
  mouth: string;
  glasses?: string;
  smile?: boolean;
  age?: boolean;
};

function paintBody(p: SkinPainter, f: FaceSpec, handColour?: string) {
  const parts = ["head", "torso", "armR", "armL", "legR", "legL"] as const;
  for (const part of parts) p.fill(part, "all", f.skin);
  p.grain("head", "all", 0.05, 3);
  // 头发
  p.fill("head", "top", f.hair);
  p.fill("head", "back", f.hair);
  p.rect("head", "back", 0, 7, 8, 1, f.skin);
  for (const side of ["left", "right"] as const) {
    p.rect("head", side, 0, 0, 8, 2, f.hair);
    p.rect("head", side, side === "left" ? 0 : 5, 2, 3, 2, f.hair);
  }
  if (f.hairStyle === "receding") {
    p.rect("head", "front", 0, 0, 8, 1, f.hair);
    p.rect("head", "front", 3, 0, 2, 1, shade(f.skin, 1.03));
  } else {
    p.rect("head", "front", 0, 0, 8, 2, f.hair);
    p.px("head", "front", 0, 2, f.hair);
    p.px("head", "front", 7, 2, f.hair);
  }
  p.grain("head", ["top", "back"], 0.12, 7);
  // 五官（全部画在贴图上）
  p.rect("head", "front", 1, 3, 2, 1, f.brow);
  p.rect("head", "front", 5, 3, 2, 1, f.brow);
  p.px("head", "front", 1, 4, "#eeeae4");
  p.px("head", "front", 2, 4, f.eye);
  p.px("head", "front", 5, 4, f.eye);
  p.px("head", "front", 6, 4, "#eeeae4");
  p.rect("head", "front", 3, 5, 2, 1, shade(f.skin, 0.86));
  if (f.smile) {
    p.rect("head", "front", 3, 6, 2, 1, f.mouth);
    p.px("head", "front", 2, 6, shade(f.mouth, 1.2));
    p.px("head", "front", 5, 6, shade(f.mouth, 1.2));
  } else {
    p.rect("head", "front", 2, 6, 4, 1, f.mouth);
  }
  if (f.age) {
    p.px("head", "front", 0, 5, shade(f.skin, 0.88));
    p.px("head", "front", 7, 5, shade(f.skin, 0.88));
  }
  if (f.glasses) {
    p.rect("head", "front", 0, 4, 1, 1, f.glasses);
    p.rect("head", "front", 3, 4, 2, 1, f.glasses);
    p.rect("head", "front", 7, 4, 1, 1, f.glasses);
    p.rect("head", "left", 0, 4, 4, 1, f.glasses);
    p.rect("head", "right", 4, 4, 4, 1, f.glasses);
  }
  p.px("head", "left", 3, 4, shade(f.skin, 0.8));
  p.px("head", "right", 4, 4, shade(f.skin, 0.8));
  // 内衣/基础层
  p.fill("torso", "all", "#d9d4ca");
  p.fill("legR", "all", "#3a3a3f");
  p.fill("legL", "all", "#3a3a3f");
  for (const arm of ["armR", "armL"] as const) {
    p.fill(arm, "all", "#d9d4ca");
    for (const face of ["front", "back", "left", "right"] as const) p.rect(arm, face, 0, 9, 4, 3, handColour ?? f.skin);
    p.fill(arm, "bottom", handColour ?? f.skin);
  }
}

export const ZHANG_FACE: FaceSpec = { skin: "#c99a74", hair: "#141414", hairStyle: "short", eye: "#1a1410", brow: "#141414", mouth: "#7a4a3e" };
export const COLLECTOR_FACE: FaceSpec = {
  skin: "#d3a47c", hair: "#9c9a96", hairStyle: "receding", eye: "#2a1d14", brow: "#6d6a66", mouth: "#8a4b3f", glasses: "#3b2a1c", smile: true, age: true,
};

function armClothes(p: SkinPainter, arm: "armR" | "armL", col: string, rows = 9) {
  for (const face of ["front", "back", "left", "right"] as const) p.rect(arm, face, 0, 0, 4, rows, col);
  p.fill(arm, "top", col);
}
function legClothes(p: SkinPainter, leg: "legR" | "legL", col: string, shoe: string) {
  p.fill(leg, "all", col);
  for (const face of ["front", "back", "left", "right"] as const) p.rect(leg, face, 0, 10, 4, 2, shoe);
  p.fill(leg, "bottom", shoe);
}

export function makeSkins() {
  const zhangBody = createSkin((p) => paintBody(p, ZHANG_FACE));
  const zhangSpaceBody = createSkin((p) => paintBody(p, ZHANG_FACE, "#a9a49a")); // 薄布手套
  const collectorBody = createSkin((p) => paintBody(p, COLLECTOR_FACE));

  const zhangCivil = createSkin((p) => {
    const coat = "#262b33";
    p.fill("torso", "all", coat);
    p.grain("torso", "all", 0.06, 2);
    p.rect("torso", "front", 3, 0, 2, 2, "#e4e0d8");
    p.rect("torso", "front", 4, 2, 1, 10, "#14171c");
    p.rect("torso", "front", 0, 7, 8, 1, "#1d2128");
    armClothes(p, "armR", coat);
    armClothes(p, "armL", coat);
    p.grain("armR", "all", 0.06, 4);
    p.grain("armL", "all", 0.06, 5);
    legClothes(p, "legR", "#33353a", "#101010");
    legClothes(p, "legL", "#33353a", "#101010");
  }, { transparent: true });

  const collectorClothes = createSkin((p) => {
    const knit = "#7a5638";
    p.fill("torso", "all", knit);
    p.grain("torso", "all", 0.14, 8);
    p.rect("torso", "front", 2, 0, 4, 2, "#d8cdb5");
    p.rect("torso", "front", 3, 2, 2, 10, "#d8cdb5");
    for (let y = 3; y < 12; y += 3) p.px("torso", "front", 2, y, "#3a2618");
    armClothes(p, "armR", knit);
    armClothes(p, "armL", knit);
    p.grain("armR", "all", 0.14, 9);
    p.grain("armL", "all", 0.14, 10);
    for (const arm of ["armR", "armL"] as const) for (const f of ["front", "back", "left", "right"] as const) p.rect(arm, f, 0, 8, 4, 1, "#5e4029");
    legClothes(p, "legR", "#45444a", "#2b2018");
    legClothes(p, "legL", "#45444a", "#2b2018");
  }, { transparent: true });

  /** 航天服：衣服层；头部即头盔。visor: 'dark' | 'clear' | 'crack' */
  const suit = (base: string, trim: string, visor: "dark" | "clear" | "crack", gloveOffR = false, seed = 1) =>
    createSkin((p) => {
      const parts = ["head", "torso", "armR", "armL", "legR", "legL"] as const;
      for (const part of parts) p.fill(part, "all", base);
      for (const part of parts) p.grain(part, "all", 0.05, seed + part.length);
      // 头盔
      p.rect("head", "front", 0, 0, 8, 1, shade(base, 0.85));
      if (visor === "dark") {
        p.rect("head", "front", 1, 2, 6, 5, "#2a2216");
        p.rect("head", "front", 1, 2, 6, 1, "#6b5124");
        p.px("head", "front", 5, 3, "#b89a5a");
        p.px("head", "front", 6, 3, "#e0c98a");
      } else if (visor === "clear") {
        p.erase("head", "front", 1, 2, 6, 5);
      } else {
        p.rect("head", "front", 1, 2, 6, 5, "#c9d0d6");
        const cracks: Array<[number, number, string]> = [
          [2, 3, "#f4f6f8"], [3, 4, "#8a1810"], [4, 4, "#f4f6f8"], [4, 5, "#a01e14"], [5, 3, "#7a120c"], [2, 5, "#b0241a"], [6, 6, "#f4f6f8"], [1, 6, "#9aa3ab"], [3, 2, "#9aa3ab"], [6, 2, "#a01e14"],
        ];
        for (const [x, y, c] of cracks) p.px("head", "front", x, y, c);
      }
      p.rect("head", "left", 2, 3, 4, 3, shade(base, 0.8));
      p.rect("head", "right", 2, 3, 4, 3, shade(base, 0.8));
      // 胸前控制面板与肩章
      p.rect("torso", "front", 2, 3, 4, 3, "#30343a");
      p.px("torso", "front", 2, 3, "#5fd06a");
      p.px("torso", "front", 4, 3, "#e0b040");
      p.px("torso", "front", 5, 4, "#d04030");
      p.rect("torso", "front", 0, 8, 8, 1, trim);
      p.rect("torso", "front", 1, 9, 6, 3, shade(base, 0.86));
      for (const arm of ["armR", "armL"] as const) {
        for (const f of ["front", "back", "left", "right"] as const) {
          p.rect(arm, f, 0, 1, 4, 1, trim);
          p.rect(arm, f, 0, 8, 4, 1, "#8f949b"); // 金属护环
          p.rect(arm, f, 0, 9, 4, 3, shade(base, 0.72)); // 手套
        }
        p.fill(arm, "bottom", shade(base, 0.72));
      }
      if (gloveOffR) {
        for (const f of ["front", "back", "left", "right"] as const) p.erase("armR", f, 0, 9, 4, 3);
        p.clear("armR", "bottom");
      }
      for (const leg of ["legR", "legL"] as const) {
        for (const f of ["front", "back", "left", "right"] as const) {
          p.rect(leg, f, 0, 4, 4, 1, shade(base, 0.85));
          p.rect(leg, f, 0, 9, 4, 3, shade(base, 0.62));
        }
        p.fill(leg, "bottom", shade(base, 0.5));
      }
    }, { transparent: true });

  const zhangSuit = suit("#7c8593", "#c96a2a", "dark", false, 11);
  const zhangSuitClear = suit("#7c8593", "#c96a2a", "clear", false, 11);
  const zhangSuitGloveOff = suit("#7c8593", "#c96a2a", "clear", true, 11);
  const whiteDark = suit("#e6e6e1", "#2f5da8", "dark", false, 21);
  const whiteClear = suit("#e6e6e1", "#2f5da8", "clear", false, 21);
  const whiteCrack = suit("#e6e6e1", "#2f5da8", "crack", false, 21);
  const crewBodies = [
    { skin: "#c99a74", hair: "#1c1a18", hairStyle: "short", eye: "#1a1410", brow: "#1c1a18", mouth: "#7a4a3e" },
    { skin: "#d6aa86", hair: "#2a201a", hairStyle: "short", eye: "#1a1410", brow: "#2a201a", mouth: "#8a5040", smile: true },
    { skin: "#b98a62", hair: "#111", hairStyle: "short", eye: "#111", brow: "#111", mouth: "#6a3a30" },
    { skin: "#e0b896", hair: "#3b2c22", hairStyle: "short", eye: "#2a1d14", brow: "#3b2c22", mouth: "#9a5a4a", smile: true },
  ].map((f) => createSkin((p) => paintBody(p, f as FaceSpec)));
  const elderBodies = [
    { skin: "#cfa07c", hair: "#c9c6c0", hairStyle: "receding", eye: "#1a1410", brow: "#9a9690", mouth: "#7a4a3e", age: true },
    { skin: "#c49370", hair: "#8d8a86", hairStyle: "grey", eye: "#1a1410", brow: "#5d5a56", mouth: "#7a4a3e", age: true, glasses: "#222" },
    { skin: "#d4a888", hair: "#e2e0dc", hairStyle: "receding", eye: "#1a1410", brow: "#b9b5b0", mouth: "#7a4a3e", age: true },
  ].map((f) => createSkin((p) => paintBody(p, f as FaceSpec)));

  const screamBody = createSkin((p) => {
    paintBody(p, { skin: "#d6aa86", hair: "#2a201a", hairStyle: "short", eye: "#1a1410", brow: "#2a201a", mouth: "#8a5040" });
    p.rect("head", "front", 1, 3, 2, 1, "#d6aa86");
    p.rect("head", "front", 5, 3, 2, 1, "#d6aa86");
    p.rect("head", "front", 1, 2, 2, 1, "#2a201a");
    p.rect("head", "front", 5, 2, 2, 1, "#2a201a");
    p.px("head", "front", 1, 4, "#f4f0ea");
    p.px("head", "front", 6, 4, "#f4f0ea");
    p.rect("head", "front", 2, 6, 4, 1, "#d6aa86");
    p.rect("head", "front", 3, 6, 2, 2, "#3a0e0a");
  });
  return {
    screamBody,
    zhangBody, zhangSpaceBody, collectorBody, zhangCivil, collectorClothes,
    zhangSuit, zhangSuitClear, zhangSuitGloveOff, whiteDark, whiteClear, whiteCrack, crewBodies, elderBodies,
  };
}

/* ───────────── 道具 ───────────── */

export const PISTOL_SIDE = [
  "..............",
  "#############.",
  "##############",
  "#############.",
  "g##...........",
  "gg#...........",
  "gg............",
  "gg............",
];
export function pistolGeom() {
  return voxelModel({
    palette: { "#": 0x23262b, g: 0x3a3430 },
    layers: [PISTOL_SIDE.map((r) => r.replace(/#/g, "#")), PISTOL_SIDE, PISTOL_SIDE],
    axis: "x",
    voxel: 0.3,
  });
}
export function scopeGeom() {
  const S = [
    "................",
    "LLLL########LLLL",
    "LLLL########LLLL",
    "LLLL########LLLL",
    ".....mm..mm.....",
  ];
  return voxelModel({ palette: { "#": 0x1b1d20, L: 0x2a2d31, m: 0x55585e }, layers: [S, S, S], voxel: 0.3 });
}
export function cupGeom() {
  return buildVoxelGeometry({
    size: [5, 5, 5],
    at(x, y, z) {
      const dx = x - 2, dz = z - 2;
      const r2 = dx * dx + dz * dz;
      if (r2 > 5) return null;
      if (y === 4 && r2 < 2) return 0x6b4a1c; // 茶汤
      if (y > 0 && r2 < 2) return null;
      return y === 3 ? 0x2f5f8a : 0xece6da;
    },
  }, { voxel: 0.017 });
}
export function magnifierGeom() {
  const S = [
    "..rrr.",
    ".r...r",
    ".r...r",
    "..rrr.",
    "...h..",
    "...h..",
    "...h..",
  ];
  return voxelModel({ palette: { r: 0x2a2a2a, h: 0x5a3a20 }, layers: [S], axis: "z", voxel: 0.5 });
}

/** 车床加工出的小圆柱段（铅笔粗细）。 */
export function slugGeom(color = 0x4a4844) {
  return buildVoxelGeometry({
    size: [3, 5, 3],
    at(x, y, z) {
      if ((x === 0 || x === 2) && (z === 0 || z === 2)) return null;
      return y === 4 ? 0x8a8780 : color;
    },
  }, { voxel: 0.006, anchor: "min" });
}

/* ───────────── 人物工厂 ───────────── */

export function figure(body: THREE.Texture, clothes: THREE.Texture | null, height = 1.78) {
  const f = createFigure({ body, clothes, heightM: height });
  return f;
}

export function lifePack(f: Figure, color = 0xd8d8d2) {
  const S = [
    "######",
    "######",
    "#mm###",
    "######",
    "######",
    "######",
    "#t##t#",
  ];
  const g = voxelModel({ palette: { "#": color, m: 0x40454c, t: 0x55585e }, layers: [S, S, S, S], axis: "z", voxel: 1.4 });
  const mesh = new THREE.Mesh(g, voxelMaterial());
  mesh.position.set(0, -1, -2.6);
  mesh.castShadow = true;
  f.anchors.back.add(mesh);
  return mesh;
}

/* ───────────── 太空素材 ───────────── */

export function earthMesh() {
  const R = 60;
  const geo = voxelSphere(R, (x, y, z, d) => {
    const nx = x / 8, ny = y / 8, nz = z / 8;
    const h = fbm(nx, ny, nz);
    const lat = Math.abs(y - R) / R;
    const cloud = fbm(nx * 1.8 + 30, ny * 2.4, nz * 1.8 + 7);
    if (d > 0.93 && cloud > 0.62) return 0xf4f2ee;
    if (lat > 0.86) return 0xe8eef2;
    if (h > 0.56) return h > 0.66 ? 0x8a7a52 : lat > 0.6 ? 0x5e7a4a : 0x4f7a3e;
    return h > 0.5 ? 0x2f6a9a : 0x1d4f86;
  }, { voxel: 12 });
  const mat = voxelMaterial({ roughness: 0.75, metalness: 0.0, emissive: new THREE.Color(0x0b1d3a), emissiveIntensity: 0.6 });
  return new THREE.Mesh(geo, mat);
}
export function atmosphereMesh() {
  const geo = voxelSphere(62, (x, y, z, d) => (d < 0.965 ? null : 0x4a8fe0), { voxel: 12 });
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }));
}
export function sunMesh() {
  const geo = voxelSphere(9, (x, y, z, d) => (d > 0.85 ? 0xffd9a0 : 0xfff4e0), { voxel: 24 });
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
}
export function glowSprite(color: string, size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, color);
  gr.addColorStop(0.25, color.replace("1)", "0.45)"));
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
  sp.scale.setScalar(size);
  return sp;
}
export function stars(count: number, radius: number, seed = 3) {
  const r = rng(seed);
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = r() * 2 - 1, th = r() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    pos.set([s * Math.cos(th) * radius, u * radius, s * Math.sin(th) * radius], i * 3);
    const b = 0.4 + r() * 0.6;
    const warm = r();
    col.set([b, b * (0.9 + warm * 0.1), b * (0.85 + (1 - warm) * 0.2)], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true, depthWrite: false }));
}

/** 黄河站：车轮形空间站，体素环 + 辐条 + 中心毂。局部坐标：环在 XY 平面，轴为 Z。 */
export function wheelStation(radius: number, voxel: number) {
  const R = Math.round(radius / voxel);
  const span = R * 2 + 6;
  const c = span / 2;
  const tube = 4.2;
  const geo = buildVoxelGeometry({
    size: [span, span, 12],
    at(x, y, z) {
      const dx = x + 0.5 - c, dy = y + 0.5 - c, dz = z + 0.5 - 6;
      const rr = Math.sqrt(dx * dx + dy * dy);
      const ring = Math.sqrt((rr - R) ** 2 + dz * dz);
      if (ring < tube) {
        const ang = Math.atan2(dy, dx);
        const seg = Math.floor(((ang + Math.PI) / (Math.PI * 2)) * 48);
        if (ring > tube - 1.2 && Math.abs(dz) < 1 && seg % 2 === 0) return 0xffd58a; // 舷窗
        return seg % 6 === 0 ? 0x8c9096 : 0xc7c9cc;
      }
      if (rr < 7 && Math.abs(dz) < 5) return rr < 4 ? 0x9a9ea4 : 0xb5b8bc;
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        const along = dx * Math.cos(a) + dy * Math.sin(a);
        const perp = -dx * Math.sin(a) + dy * Math.cos(a);
        if (along > 0 && along < R && Math.abs(perp) < 1.3 && Math.abs(dz) < 1.3) return 0x9da1a6;
      }
      return null;
    },
  }, { voxel });
  return new THREE.Mesh(geo, voxelMaterial({ roughness: 0.7, metalness: 0 }));
}

/** 太空船坞：只搭起了框架，像巨兽的骨骼。 */
export function shipyard(voxel: number) {
  const W = 72, H = 18, D = 18;
  const geo = buildVoxelGeometry({
    size: [W, H, D],
    at(x, y, z) {
      const built = x < 52 - (y * 0.8) || (x < 60 && y < 6);
      if (!built) return null;
      const ex = x % 6 === 0, ey = y % 6 === 0 || y === H - 1, ez = z % 6 === 0 || z === D - 1;
      const edges = (ex ? 1 : 0) + (ey ? 1 : 0) + (ez ? 1 : 0);
      if (edges >= 2) return (x + y) % 12 === 0 ? 0xc8a050 : 0x6d7178;
      return null;
    },
  }, { voxel });
  return new THREE.Mesh(geo, voxelMaterial({ roughness: 0.7, metalness: 0.4 }));
}

export { THREE, voxelMaterial, voxelModel, buildVoxelGeometry };

import * as THREE from "three";
import type { Shot } from "@agentbench/cinematic-player";
import { CamRig, type CamKey } from "./camera";
import { fadeAt, segmentProgress, type FadeSpan } from "./util";

export const DURATION = 328;

/** 场次区间（绝对时间）。 */
export const SCENES = {
  cold: [0, 13.2],
  alley: [13.2, 25.2],
  room: [25.2, 97.2],
  shop: [97.2, 123.2],
  base: [123.2, 161.2],
  orbit: [161.2, 175.2],
  float: [175.2, 206.2],
  sunset: [206.2, 237.2],
  fire: [237.2, 263.2],
  return: [263.2, 281.2],
  coda: [281.2, DURATION],
} as const;

export interface FilmContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  env: {
    alley: { group: THREE.Group; update: (t: number) => void };
    room: { group: THREE.Group; update: (t: number) => void };
    shop: { group: THREE.Group; update: (t: number) => void };
    base: { group: THREE.Group; update: (t: number) => void };
    space: { group: THREE.Group; update: (t: number) => void };
  };
}

/* ------------------------------------------------------------------ */
/* 摄影机轨道                                                          */
/* ------------------------------------------------------------------ */

function seg(
  t0: number,
  t1: number,
  from: [number, number, number],
  to: [number, number, number],
  look: [number, number, number] | [[number, number, number], [number, number, number]],
  fov: number | [number, number],
  shake = 0.012,
): CamKey[] {
  const lookFrom = Array.isArray(look[0]) ? (look as [[number, number, number], [number, number, number]])[0] : (look as [number, number, number]);
  const lookTo = Array.isArray(look[0]) ? (look as [[number, number, number], [number, number, number]])[1] : (look as [number, number, number]);
  const fovFrom = Array.isArray(fov) ? fov[0] : fov;
  const fovTo = Array.isArray(fov) ? fov[1] : fov;
  return [
    { t: t0, pos: from, look: lookFrom, fov: fovFrom, cut: true, shake },
    { t: t1, pos: to, look: lookTo, fov: fovTo, shake },
  ];
}


/* 瞄准解算：给定机位、主体点与期望的 NDC 落点，反算 look 点（构建期执行一次）。 */
function aim(
  pos: [number, number, number],
  subject: [number, number, number],
  ndc: [number, number],
  fov: number,
): [number, number, number] {
  const C = new THREE.Vector3(...pos);
  const S = new THREE.Vector3(...subject);
  const f0 = S.clone().sub(C).normalize();
  const up0 = Math.abs(f0.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(f0, up0).normalize();
  const up = new THREE.Vector3().crossVectors(right, f0).normalize();
  const vfov = (fov * Math.PI) / 180;
  const aspect = 16 / 9;
  const ty = Math.atan(ndc[1] * Math.tan(vfov / 2));
  const tx = Math.atan((ndc[0] * Math.tan(vfov / 2) * aspect));
  const f = f0.clone().applyAxisAngle(right, -ty).applyAxisAngle(up, -tx).normalize();
  const L = C.clone().addScaledVector(f, C.distanceTo(S));
  return [L.x, L.y, L.z];
}

/** 太空镜头：机位 + 主体 + 构图落点。 */
function segAim(
  t0: number,
  t1: number,
  from: [number, number, number],
  to: [number, number, number],
  subject: [number, number, number],
  ndc: [number, number],
  fov: number | [number, number],
): CamKey[] {
  const fovFrom = Array.isArray(fov) ? fov[0] : fov;
  const fovTo = Array.isArray(fov) ? fov[1] : fov;
  return [
    { t: t0, pos: from, look: aim(from, subject, ndc, fovFrom), fov: fovFrom, cut: true },
    { t: t1, pos: to, look: aim(to, subject, ndc, fovTo), fov: fovTo },
  ];
}

const ZBH: [number, number, number] = [-160, -420, 620];
const EARTH_TOP: [number, number, number] = [0, -2400, 0];
const FC: [number, number, number] = [-265, -505, 55];
const HATCH: [number, number, number] = [-265, -352, -400];
const blend = (a: [number, number, number], b: [number, number, number], k: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
  a[2] + (b[2] - a[2]) * k,
];

const keys: CamKey[] = [
  // 冷开场：高轨道俯瞰地球圆盘与星空
  ...segAim(0, 13.15, [9000, 6000, 12000], [8300, 5400, 11300], [0, -1500, 0], [0, -0.1], [44, 42]),
  // 一幕：胡同
  ...seg(13.2, 17.75, [0.6, 1.5, -11.5], [0.2, 1.55, -3.4], [[0, 1.3, -4], [-0.2, 1.25, 4]], 48, 0.018),
  ...seg(17.8, 21.35, [-0.9, 1.5, 10.4], [-0.75, 1.5, 16.6], [[-0.35, 1.3, 4.9], [-0.65, 1.3, 14.4]], 44, 0.02),
  ...seg(21.4, 25.15, [-0.2, 1.6, 19.6], [-0.9, 1.55, 19.0], [[-1.5, 1.3, 16.5], [-2.5, 1.5, 18.6]], 42, 0.02),
  // 二幕：收藏者家（正反打覆盖）
  ...seg(25.2, 31.45, [2.35, 1.66, 2.5], [2.1, 1.6, 2.2], [[-0.6, 1.35, 1.2], [0.6, 1.3, -1.5]], [52, 50]),
  ...seg(31.5, 35.15, [1.45, 1.5, 0.55], [1.42, 1.48, 0.4], [[1.5, 1.44, -2.3], [1.5, 1.44, -2.3]], 32),
  ...seg(35.2, 38.15, [-0.55, 1.5, 2.35], [-0.5, 1.48, 2.2], [[0.3, 1.4, 1.6], [0.3, 1.4, 1.6]], 30),
  ...seg(38.2, 44.75, [-0.75, 1.72, 2.4], [-0.7, 1.7, 2.2], [[1.5, 1.42, -2.25], [1.5, 1.42, -2.25]], 38),
  ...seg(44.8, 51.35, [-0.3, 1.5, -0.1], [-0.25, 1.45, -0.2], [[1.7, 1.05, -2.0], [1.7, 1.05, -2.0]], 30),
  ...seg(51.4, 58.95, [-1.35, 1.42, 1.05], [-1.32, 1.4, 1.0], [[0.42, 1.44, 1.55], [0.42, 1.44, 1.55]], 36),
  ...seg(59.0, 62.55, [1.0, 1.5, 0.3], [1.05, 1.48, 0.2], [[1.5, 1.44, -2.3], [1.5, 1.44, -2.3]], 30),
  ...seg(62.6, 69.15, [1.2, 1.85, -0.75], [1.3, 1.75, -0.85], [[1.6, 0.98, -1.95], [1.6, 0.98, -1.95]], 34),
  ...seg(69.2, 72.35, [0.5, 1.4, -0.6], [0.55, 1.38, -0.65], [[1.6, 1.0, -2.0], [1.6, 1.0, -2.0]], 30),
  ...seg(72.4, 78.15, [1.1, 1.48, 0.0], [1.2, 1.46, -0.35], [[1.5, 1.4, -2.2], [1.5, 1.4, -2.2]], [30, 31]),
  ...seg(78.2, 82.35, [-0.5, 1.5, 2.4], [-0.45, 1.48, 2.2], [[0.3, 1.35, 1.6], [0.3, 1.35, 1.6]], 30),
  ...seg(82.4, 86.35, [1.0, 1.5, 0.3], [1.05, 1.48, 0.2], [[1.5, 1.44, -2.3], [1.5, 1.44, -2.3]], 32),
  ...seg(86.4, 93.35, [0.05, 1.58, 2.75], [0.2, 1.56, 2.35], [[0.3, 1.55, 1.58], [0.3, 1.57, 1.58]], [30, 28]),
  ...seg(93.4, 97.15, [2.5, 1.7, 2.42], [2.4, 1.66, 2.3], [[-0.4, 1.3, 1.2], [-0.5, 1.3, 1.3]], 48),
  // 三幕：车间
  ...seg(97.2, 102.95, [-6.2, 3.2, 5.6], [-5.2, 2.8, 4.8], [[0.6, 1.4, -1.2], [0.6, 1.35, -1.25]], 46),
  ...seg(103.0, 111.95, [3.0, 1.6, 2.2], [1.9, 1.35, 1.3], [[0.5, 1.15, -1.2], [0.5, 1.15, -1.2]], 36),
  ...seg(112.0, 117.35, [3.8, 2.6, 3.3], [3.8, 2.1, 3.0], [[3.8, 0.95, 2.0], [3.8, 0.95, 2.0]], 32),
  ...seg(117.4, 123.15, [2.2, 1.35, 3.8], [2.5, 1.25, 3.5], [[4.2, 0.97, 1.8], [4.2, 0.97, 1.8]], 30),
  // 四幕：地下室
  ...seg(123.2, 128.35, [-1.9, 1.5, 1.6], [-1.5, 1.4, 1.2], [[0.3, 1.0, -0.5], [0.3, 1.0, -0.5]], 44, 0.014),
  ...seg(128.4, 134.55, [-0.95, 1.4, 0.65], [-0.9, 1.38, 0.6], [[0.1, 1.0, -0.3], [0.1, 1.0, -0.3]], 34),
  ...seg(134.6, 139.75, [0.55, 1.3, 0.2], [0.5, 1.28, 0.15], [[0.0, 0.95, -0.5], [0.0, 0.95, -0.5]], 26),
  ...seg(139.8, 144.35, [0.4, 1.25, -0.1], [0.35, 1.22, -0.12], [[-0.1, 0.95, -0.5], [-0.1, 0.95, -0.5]], 26),
  ...seg(144.4, 148.95, [-1.65, 1.5, 1.95], [-1.6, 1.48, 1.85], [[-0.15, 1.15, 0.6], [-0.15, 1.18, 0.6]], 40),
  ...seg(149.0, 154.35, [1.9, 1.55, 0.8], [1.85, 1.5, 0.7], [[1.95, 0.5, -1.5], [1.95, 0.48, -1.5]], 42),
  ...seg(154.4, 161.15, [0.75, 1.75, -0.9], [0.72, 1.72, -0.86], [[-0.32, 1.08, 0.32], [-0.32, 1.1, 0.32]], 36),
  // 五幕：入轨
  ...segAim(161.2, 175.15, [500, 900, 1400], [430, 780, 1300], [0, -1200, -300], [0, 0.05], 55),
  // 六幕：悬浮等待
  ...segAim(175.2, 180.95, [-155, 420, 700], [-157, 380, 690], [-160, -418, 620], [0, -0.15], 46),
  ...segAim(181.0, 187.95, [-178, -392, 655], [-184, -398, 648], [-160, -418, 620], [0, 0], 30),
  ...segAim(188.0, 193.95, [-158, -405, 600], [-158.5, -405.5, 599], HATCH, [0, 0], 8),
  ...segAim(194.0, 206.15, [-60, -480, 760], [-75, -475, 740], [-260, -380, 240], [0, 0.05], 40),
  // 七幕：日落合影
  ...segAim(206.2, 211.95, [-120, -180, 900], [-150, -220, 860], [400, -2150, -3950], [0.05, -0.1], 46),
  ...segAim(212.0, 217.95, [-200, -420, 240], [-215, -440, 215], FC, [0, 0], 42),
  ...segAim(218.0, 224.45, [-158, -405, 600], [-158.3, -405.3, 599.5], FC, [0, 0], 2.2),
  ...segAim(224.5, 230.95, [-162.8, -419.6, 615.5], [-162.5, -419.5, 615.8], [-159.85, -418.95, 619.35], [0.05, 0], 18),
  ...segAim(231.0, 237.15, [-157.9, -405.4, 599.8], [-157.95, -405.45, 599.75], FC, [0, 0], 2.2),
  // 八幕：击发
  ...segAim(237.2, 245.95, [-158.6, -417.0, 624.6], [-158.7, -417.1, 624.4], [-265, -503.8, 55], [0.2, 0.15], 46),
  ...segAim(246.0, 249.95, [-157.9, -405.4, 599.8], [-157.95, -405.45, 599.75], FC, [0, 0], 2.6),
  ...segAim(250.0, 256.95, [-252, -498, 120], [-258, -505, 110], FC, [0.05, -0.2], 26),
  ...segAim(257.0, 263.15, [-190, -430, 330], [-205, -445, 315], [-265, -428, -172], [0, 0], 46),
  // 九幕：归途（面罩上的落日反光 → 目送自己去远方）
  ...segAim(263.2, 268.15, [-380, -240, 620], [-365, -260, 590], HATCH, [-0.15, 0], 44),
  ...segAim(268.2, 281.15, [-185, -360, 560], [-184, -358, 558], [-135, -520, 850], [0, 0.1], 44),
  // 尾声（一粒尘埃 → 父亲的目光之星 → 拉远）
  { t: 281.2, pos: [-130, -460, 780], look: aim([-130, -460, 780], [-80, -560, 1500], [0, 0], 50), fov: 50, cut: true },
  { t: 291.95, pos: [-128, -458, 778], look: aim([-128, -458, 778], [-50, -770, 1400], [0, 0], 50), fov: 50 },
  ...segAim(292.0, 301.95, [-100, -260, 700], [-130, -300, 750], [-21700, -1240, -58256], [0.05, 0.4], 55),
  ...segAim(302.0, 327.95, [-60, -330, 620], [-58, -328, 618], [500, -1200, 3200], [0.15, 0.1], 50),
];

export const rig = new CamRig(keys);

/* ------------------------------------------------------------------ */
/* 环境气氛（背景、雾、曝光）                                           */
/* ------------------------------------------------------------------ */

interface Mood {
  bg: number;
  fog: number | null;
  fogColor: number;
  exposure: number;
}

const MOODS: Record<string, Mood> = {
  cold: { bg: 0x020306, fog: null, fogColor: 0x000000, exposure: 1.05 },
  alley: { bg: 0xc4b494, fog: 0.011, fogColor: 0xd8c9ae, exposure: 1.0 },
  room: { bg: 0x0a0908, fog: 0.03, fogColor: 0x14100c, exposure: 1.18 },
  shop: { bg: 0x06090d, fog: 0.042, fogColor: 0x10151c, exposure: 1.0 },
  base: { bg: 0x050403, fog: 0.075, fogColor: 0x0b0908, exposure: 1.3 },
  space: { bg: 0x020306, fog: null, fogColor: 0x000000, exposure: 1.05 },
};

function moodFor(t: number): string {
  if (t < SCENES.cold[1]) return "cold";
  if (t < SCENES.alley[1]) return "alley";
  if (t < SCENES.room[1]) return "room";
  if (t < SCENES.shop[1]) return "shop";
  if (t < SCENES.base[1]) return "base";
  return "space";
}

/* ------------------------------------------------------------------ */
/* 镜头表                                                              */
/* ------------------------------------------------------------------ */

export function buildShots(ctx: FilmContext): Array<Shot<FilmContext>> {
  const { scene, camera, renderer, env } = ctx;
  const bg = new THREE.Color();
  const fog = new THREE.FogExp2(0x000000, 0.01);

  const world: Shot<FilmContext> = {
    id: "world",
    start: 0,
    end: DURATION,
    update: ({ time }) => {
      const mood = MOODS[moodFor(time)]!;
      bg.setHex(mood.bg);
      scene.background = bg;
      if (mood.fog === null) {
        scene.fog = null;
      } else {
        fog.color.setHex(mood.fogColor);
        fog.density = mood.fog;
        scene.fog = fog;
      }
      renderer.toneMappingExposure = mood.exposure;

      const showAlley = time >= SCENES.alley[0] && time < SCENES.alley[1];
      const showRoom = time >= SCENES.room[0] && time < SCENES.room[1];
      const showShop = time >= SCENES.shop[0] && time < SCENES.shop[1];
      const showBase = time >= SCENES.base[0] && time < SCENES.base[1];
      const showSpace = time < SCENES.cold[1] || time >= SCENES.orbit[0];
      env.alley.group.visible = showAlley;
      env.room.group.visible = showRoom;
      env.shop.group.visible = showShop;
      env.base.group.visible = showBase;
      env.space.group.visible = showSpace;

      if (showAlley) env.alley.update(time);
      if (showRoom) env.room.update(time);
      if (showShop) env.shop.update(time);
      if (showBase) env.base.update(time);
      if (showSpace) env.space.update(time);
    },
  };

  const cameraShot: Shot<FilmContext> = {
    id: "camera",
    start: 0,
    end: DURATION,
    update: ({ time }) => {
      rig.apply(camera, time);
    },
  };

  return [world, cameraShot];
}

/* ------------------------------------------------------------------ */
/* 叠加层：黑场、片名、瞄准镜                                          */
/* ------------------------------------------------------------------ */

export const FADE_SPANS: FadeSpan[] = [
  { t0: 0, t1: 1.4, from: 0.82, to: 0 },
  { t0: 12.5, t1: 13.35, from: 0, to: 1 },
  { t0: 13.35, t1: 14.3, from: 1, to: 0 },
  { t0: 96.55, t1: 97.3, from: 0, to: 1 },
  { t0: 97.3, t1: 98.2, from: 1, to: 0 },
  { t0: 122.55, t1: 123.3, from: 0, to: 1 },
  { t0: 123.3, t1: 124.2, from: 1, to: 0 },
  { t0: 160.35, t1: 161.25, from: 0, to: 1 },
  { t0: 161.25, t1: 162.3, from: 1, to: 0 },
  { t0: 311.5, t1: 318.5, from: 0, to: 1 },
  { t0: 318.5, t1: DURATION, from: 1, to: 1 },
];

export function fadeOpacity(t: number): number {
  return fadeAt(FADE_SPANS, t);
}

export function scopeOpacity(t: number): number {
  const windows: Array<[number, number]> = [
    [188.0, 194.0],
    [218.0, 224.45],
    [231.0, 237.15],
    [246.0, 249.95],
  ];
  let best = 0;
  for (const [a, b] of windows) {
    if (t >= a - 0.3 && t <= b + 0.3) {
      const v = Math.min(segmentProgress(t, a - 0.3, a), 1 - segmentProgress(t, b, b + 0.3));
      best = Math.max(best, Math.min(1, v));
    }
  }
  return best;
}

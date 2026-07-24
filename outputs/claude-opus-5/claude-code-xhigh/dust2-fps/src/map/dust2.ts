/**
 * de_dust2 核心区域的数据化描述。
 *
 * 设计思路：地图不是一堆手摆的墙，而是由「区域(Area) + 通道(Portal)」声明式描述的。
 *   - Area  = 一块轴对齐的可行走地面矩形（带地面高度、墙高、是否有天花板）。
 *   - Portal= 两块相邻区域之间的开口（可裁剪宽度、可限制高度形成门洞）。
 * 墙体由 buildWorld() 自动沿区域周长生成，并在 Portal 处开洞。
 * 这样「能不能走通」和「墙长什么样」永远是同一份数据，不会出现看得见走不通的情况。
 *
 * 坐标系：X = 雷达图左右（+X 向右/东），Z = 雷达图上下（-Z 向上/北），Y = 高度。
 * 单位为米。T 出生点在南（+Z），A 点在东北，B 点在西北，中路贯穿地图中央。
 *
 *              -Z (北)
 *   B点 ── B门 ── CT通道        A点
 *    │                          │
 *   B洞上层      CT中路 ── CT出生点 ── 长廊转角
 *    │            │         │        │
 *   B洞下层      中路(中门)  猫道/小道  A大
 *    │            │                   │
 *   T洞口 ──── T出生点 ──────────── 长廊大门
 *              +Z (南)
 */

import type { Rect } from '../core/math.ts';

export type SurfaceKind =
  | 'sand' // 沙地地面
  | 'stone' // 石板地面 / 站台
  | 'wall' // 土黄色墙体
  | 'plaster' // 白灰墙
  | 'crate' // 木箱
  | 'metal' // 铁皮集装箱 / 门
  | 'concrete' // 混凝土块
  | 'barrel'; // 油桶

export interface AreaDef extends Rect {
  id: string;
  /** 地面高度（该区域地板顶面的 Y）。 */
  y: number;
  /** 墙高（相对地面）。 */
  wallH?: number;
  /** 是否封顶（B 洞、大门通道这些室内段）。 */
  ceiling?: boolean;
  /** HUD / 小地图显示名。 */
  label: string;
  /** 战术分区，AI 与小地图用。 */
  zone: Zone;
  /** 地面材质 */
  floor?: SurfaceKind;
}

export type Zone =
  | 'tspawn'
  | 'ctspawn'
  | 'long'
  | 'asite'
  | 'short'
  | 'mid'
  | 'tunnel'
  | 'bsite'
  | 'connector';

export interface PortalDef {
  a: string;
  b: string;
  /** 沿共享边裁剪出的开口区间（世界坐标）。省略则整条共享边都是开口。 */
  clip?: [number, number];
  /** 开口净高，省略表示通到墙顶。设置后会在上方生成门楣。 */
  top?: number;
  label?: string;
}

export interface PropDef extends Rect {
  /** 底面 Y（绝对高度）。 */
  y: number;
  /** 高度。 */
  h: number;
  kind: SurfaceKind;
  /** 标注用，比如 "xbox"。 */
  tag?: string;
}

export const WALL_THICKNESS = 0.6;
export const DEFAULT_WALL_H = 5.0;

/* ------------------------------------------------------------------ */
/* 区域                                                                */
/* ------------------------------------------------------------------ */

export const AREAS: AreaDef[] = [
  // ---- T 侧 ----
  { id: 'tspawn', x0: -20, z0: 46, x1: 16, z1: 68, y: 0, label: 'T 出生点', zone: 'tspawn' },
  { id: 't_ramp', x0: 16, z0: 50, x1: 56, z1: 64, y: 0, label: 'T 斜坡', zone: 'long' },
  {
    id: 'long_doors',
    x0: 44,
    z0: 32,
    x1: 56,
    z1: 50,
    y: 0,
    label: '长廊大门',
    zone: 'long',
    wallH: 3.6,
    ceiling: true,
  },
  { id: 'long_a', x0: 44, z0: -12, x1: 56, z1: 32, y: 0, label: 'A 大 (Long)', zone: 'long' },
  { id: 'pit', x0: 56, z0: -12, x1: 66, z1: 6, y: -1.2, label: '深坑 (Pit)', zone: 'long' },
  { id: 'long_corner', x0: 44, z0: -40, x1: 58, z1: -12, y: 0, label: '长廊转角', zone: 'long' },

  // ---- A 区 ----
  {
    id: 'a_site',
    x0: 14,
    z0: -60,
    x1: 58,
    z1: -40,
    y: 1.0,
    label: 'A 点',
    zone: 'asite',
    floor: 'stone',
    wallH: 5.5,
  },
  { id: 'a_short', x0: 2, z0: -44, x1: 14, z1: -30, y: 0.9, label: 'A 小道 (Short)', zone: 'short' },
  { id: 'catwalk', x0: 2, z0: -30, x1: 14, z1: -6, y: 0.4, label: '猫道 (Catwalk)', zone: 'short' },

  // ---- CT 侧 ----
  {
    id: 'ct_spawn',
    x0: 14,
    z0: -40,
    x1: 40,
    z1: -6,
    y: 0.6,
    label: 'CT 出生点',
    zone: 'ctspawn',
    floor: 'stone',
  },
  { id: 'ct_top', x0: -14, z0: -46, x1: 2, z1: -38, y: 0.8, label: '中路上口', zone: 'connector' },
  {
    id: 'ct_b_hall',
    x0: -14,
    z0: -60,
    x1: 2,
    z1: -46,
    y: 0.8,
    label: 'CT 通往 B',
    zone: 'connector',
  },
  {
    id: 'b_doors',
    x0: -26,
    z0: -60,
    x1: -14,
    z1: -46,
    y: 1.0,
    label: 'B 门',
    zone: 'connector',
    wallH: 3.6,
    ceiling: true,
  },

  // ---- 中路 ----
  { id: 'mid', x0: -14, z0: -14, x1: 2, z1: 16, y: 0, label: '中路 (Mid)', zone: 'mid' },
  { id: 'ct_mid', x0: -14, z0: -38, x1: 2, z1: -14, y: 0.5, label: 'CT 中路', zone: 'mid' },
  { id: 't_mid', x0: -14, z0: 16, x1: 2, z1: 46, y: 0, label: 'T 中路', zone: 'mid' },

  // ---- B 区 / 隧道 ----
  {
    id: 'b_site',
    x0: -58,
    z0: -56,
    x1: -26,
    z1: -24,
    y: 1.2,
    label: 'B 点',
    zone: 'bsite',
    floor: 'stone',
    wallH: 5.5,
  },
  {
    id: 'b_tun_exit',
    x0: -44,
    z0: -24,
    x1: -24,
    z1: -8,
    y: 1.2,
    label: 'B 洞出口',
    zone: 'tunnel',
  },
  {
    id: 'upper_tun',
    x0: -36,
    z0: -8,
    x1: -24,
    z1: 20,
    y: 1.2,
    label: '上层 B 洞',
    zone: 'tunnel',
    wallH: 3.6,
    ceiling: true,
  },
  {
    id: 'lower_tun',
    x0: -36,
    z0: 20,
    x1: -20,
    z1: 48,
    y: 0,
    label: '下层 B 洞',
    zone: 'tunnel',
    wallH: 3.6,
    ceiling: true,
  },
  {
    id: 't_tun_link',
    x0: -36,
    z0: 48,
    x1: -20,
    z1: 62,
    y: 0,
    label: 'T 洞口',
    zone: 'tunnel',
    wallH: 3.6,
    ceiling: true,
  },
  {
    id: 'tun_mid_link',
    x0: -20,
    z0: 26,
    x1: -14,
    z1: 38,
    y: 0,
    label: '洞口岔路',
    zone: 'tunnel',
    wallH: 3.6,
    ceiling: true,
  },
];

/* ------------------------------------------------------------------ */
/* 通道（同时决定墙上的开口与 AI 的连通性）                             */
/* ------------------------------------------------------------------ */

export const PORTALS: PortalDef[] = [
  // T 出生点向东 -> 长廊大门
  { a: 'tspawn', b: 't_ramp', clip: [52, 62], label: 'T 出生点 → 斜坡' },
  { a: 't_ramp', b: 'long_doors', clip: [45, 55], top: 3.4, label: '长廊大门' },
  { a: 'long_doors', b: 'long_a', clip: [45, 55], top: 3.4 },
  { a: 'long_a', b: 'long_corner', clip: [44.6, 55.4] },
  { a: 'long_a', b: 'pit', clip: [-10, 4], label: '深坑' },
  { a: 'long_corner', b: 'a_site', clip: [45, 57], label: 'A 大进 A 点' },

  // T 出生点向北 -> T 中路 -> 中门 -> 中路
  { a: 'tspawn', b: 't_mid', clip: [-12, 0] },
  { a: 't_mid', b: 'mid', clip: [-8, -4], top: 2.6, label: '中门' },
  { a: 'mid', b: 'ct_mid', clip: [-12.6, 0.6] },
  { a: 'ct_mid', b: 'ct_top', clip: [-12.6, 0.6] },
  { a: 'ct_top', b: 'ct_b_hall', clip: [-12.6, 0.6] },
  { a: 'ct_b_hall', b: 'b_doors', clip: [-58, -50], top: 3.2, label: 'B 门' },
  { a: 'b_doors', b: 'b_site', clip: [-56, -48], top: 3.2 },

  // 中路 -> 猫道 -> 小道 -> A 点
  { a: 'mid', b: 'catwalk', clip: [-13, -7], top: 3.0, label: '猫道入口' },
  { a: 'catwalk', b: 'a_short', clip: [3, 13] },
  { a: 'a_short', b: 'a_site', clip: [-44, -40], label: '小道进 A 点' },
  { a: 'a_short', b: 'ct_spawn', clip: [-38, -32], top: 3.0 },
  { a: 'a_short', b: 'ct_top', clip: [-43.4, -38.6] },

  // CT 出生点 -> A 点
  { a: 'ct_spawn', b: 'a_site', clip: [20, 34], label: 'CT 上 A' },

  // T 出生点向西 -> B 洞 -> B 点
  { a: 'tspawn', b: 't_tun_link', clip: [50, 60], top: 3.4, label: 'T 进 B 洞' },
  { a: 't_tun_link', b: 'lower_tun', clip: [-35, -21] },
  { a: 'lower_tun', b: 'upper_tun', clip: [-35, -25] },
  { a: 'lower_tun', b: 'tun_mid_link', clip: [28, 36], top: 3.2 },
  { a: 'tun_mid_link', b: 't_mid', clip: [28, 36], top: 3.2 },
  { a: 'upper_tun', b: 'b_tun_exit', clip: [-35, -25] },
  { a: 'b_tun_exit', b: 'b_site', clip: [-42, -28], label: 'B 洞出口' },
];

/* ------------------------------------------------------------------ */
/* 掩体 / 箱子                                                          */
/* ------------------------------------------------------------------ */

export const PROPS: PropDef[] = [
  // --- A 点 ---
  { x0: 28, z0: -52, x1: 32.4, z1: -47.6, y: 1.0, h: 1.5, kind: 'crate', tag: '默认下包点' },
  { x0: 29, z0: -51, x1: 31.6, z1: -48.6, y: 2.5, h: 1.2, kind: 'crate' },
  { x0: 46, z0: -58, x1: 52, z1: -53.6, y: 1.0, h: 2.1, kind: 'concrete', tag: 'Goose' },
  { x0: 50, z0: -47, x1: 55.5, z1: -42.5, y: 1.0, h: 1.45, kind: 'crate' },
  { x0: 15.5, z0: -58, x1: 22, z1: -50, y: 1.0, h: 0.9, kind: 'stone', tag: 'A 站台' },
  { x0: 15.5, z0: -50, x1: 22, z1: -49.1, y: 1.0, h: 0.45, kind: 'stone' },
  { x0: 36, z0: -58.5, x1: 38.2, z1: -56.3, y: 1.0, h: 1.05, kind: 'barrel' },
  { x0: 39, z0: -58.5, x1: 41.2, z1: -56.3, y: 1.0, h: 1.05, kind: 'barrel' },
  { x0: 24, z0: -43, x1: 27, z1: -41.2, y: 1.0, h: 1.3, kind: 'crate' },

  // --- B 点 ---
  { x0: -56, z0: -54, x1: -48, z1: -46, y: 1.2, h: 0.9, kind: 'stone', tag: 'B 站台' },
  { x0: -56, z0: -46, x1: -48, z1: -45.1, y: 1.2, h: 0.45, kind: 'stone' },
  { x0: -41, z0: -35, x1: -36.6, z1: -30.6, y: 1.2, h: 1.5, kind: 'crate', tag: '默认下包点' },
  { x0: -40, z0: -34, x1: -37.6, z1: -31.6, y: 2.7, h: 1.2, kind: 'crate' },
  { x0: -33, z0: -41, x1: -30.8, z1: -38.8, y: 1.2, h: 1.05, kind: 'barrel' },
  { x0: -56, z0: -33, x1: -51.5, z1: -28.5, y: 1.2, h: 1.6, kind: 'metal', tag: 'B 集装箱' },
  { x0: -48, z0: -28, x1: -44, z1: -25.5, y: 1.2, h: 1.35, kind: 'crate' },

  // --- 中路 ---
  { x0: -7, z0: 0, x1: -3.4, z1: 3.6, y: 0, h: 1.15, kind: 'crate', tag: 'Xbox' },
  // 中门门体（两扇对开铁门，中间 2.2m 可穿行）
  { x0: -8, z0: 15.55, x1: -7.1, z1: 16.45, y: 0, h: 2.35, kind: 'metal', tag: '中门-左' },
  { x0: -4.9, z0: 15.55, x1: -4, z1: 16.45, y: 0, h: 2.35, kind: 'metal', tag: '中门-右' },
  { x0: -12.5, z0: -6, x1: -9.5, z1: -3.5, y: 0, h: 1.3, kind: 'crate' },

  // --- 猫道 / 小道 ---
  { x0: 7.6, z0: -21, x1: 9.8, z1: -18.8, y: 0.4, h: 1.05, kind: 'barrel' },
  { x0: 10.4, z0: -21, x1: 12.6, z1: -18.8, y: 0.4, h: 1.05, kind: 'barrel' },
  { x0: 3, z0: -35.5, x1: 6, z1: -32.5, y: 0.9, h: 1.35, kind: 'crate' },

  // --- 长廊 ---
  { x0: 45.4, z0: 13, x1: 50, z1: 21, y: 0, h: 2.6, kind: 'metal', tag: '蓝色集装箱' },
  { x0: 51.5, z0: 27, x1: 55, z1: 30.5, y: 0, h: 1.45, kind: 'crate' },
  { x0: 45.2, z0: -22, x1: 47.4, z1: -19.8, y: 0, h: 1.05, kind: 'barrel' },
  { x0: 48, z0: -22, x1: 50.2, z1: -19.8, y: 0, h: 1.05, kind: 'barrel' },
  { x0: 53, z0: -38, x1: 57, z1: -34, y: 0, h: 1.5, kind: 'crate' },

  // --- CT 出生点 ---
  { x0: 24, z0: -17, x1: 28, z1: -13, y: 0.6, h: 1.4, kind: 'crate' },
  { x0: 34, z0: -31, x1: 38.5, z1: -26.5, y: 0.6, h: 1.5, kind: 'metal' },
  { x0: 16, z0: -22, x1: 19, z1: -19, y: 0.6, h: 1.3, kind: 'crate' },

  // --- 隧道 ---
  { x0: -34, z0: 37, x1: -31, z1: 40, y: 0, h: 1.4, kind: 'crate' },
  { x0: -30.5, z0: 5, x1: -27.5, z1: 8, y: 1.2, h: 1.3, kind: 'crate' },
  { x0: -42.5, z0: -15, x1: -39.5, z1: -12, y: 1.2, h: 1.4, kind: 'crate' },

  // --- T 出生点 ---
  { x0: -7, z0: 57, x1: -2.5, z1: 61.5, y: 0, h: 1.5, kind: 'crate' },
  { x0: 7, z0: 50, x1: 11.5, z1: 54.5, y: 0, h: 1.5, kind: 'crate' },
  { x0: -17, z0: 62, x1: -13, z1: 66, y: 0, h: 1.4, kind: 'metal' },

  // --- CT 通道 ---
  { x0: -12, z0: -57, x1: -9, z1: -54, y: 0.8, h: 1.3, kind: 'crate' },
  { x0: -11.5, z0: -25, x1: -8.5, z1: -22, y: 0.5, h: 1.3, kind: 'crate' },
];

/* ------------------------------------------------------------------ */
/* 出生点 / 炸弹点 / 战术点                                             */
/* ------------------------------------------------------------------ */

export interface SpawnPoint {
  x: number;
  z: number;
  yaw: number;
}

/** yaw=0 朝 -Z（北）。T 从南往北打，CT 从北往南打。 */
export const T_SPAWNS: SpawnPoint[] = [
  { x: -14, z: 59, yaw: 0 },
  { x: -8, z: 62, yaw: 0 },
  { x: -1, z: 64.5, yaw: 0 },
  { x: 4, z: 62, yaw: 0 },
  { x: 11, z: 64.5, yaw: -0.5 },
];

export const CT_SPAWNS: SpawnPoint[] = [
  { x: 18, z: -10, yaw: Math.PI },
  { x: 23, z: -13, yaw: Math.PI },
  { x: 28, z: -10, yaw: Math.PI },
  { x: 33, z: -13, yaw: Math.PI },
  { x: 38, z: -10, yaw: Math.PI * 0.8 },
];

export interface BombSite {
  id: 'A' | 'B';
  /** 可下包范围。 */
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  /** AI 默认下包位置。 */
  plantX: number;
  plantZ: number;
  label: string;
}

export const BOMB_SITES: BombSite[] = [
  { id: 'A', x0: 22, z0: -57, x1: 44, z1: -43, plantX: 33.5, plantZ: -49, label: 'A 点' },
  { id: 'B', x0: -53, z0: -50, x1: -30, z1: -28, plantX: -43, plantZ: -38, label: 'B 点' },
];

export type TacticalTag = 'holdA' | 'holdB' | 'holdMid' | 'pushA' | 'pushB' | 'pushMid';

export interface TacticalPoint {
  x: number;
  z: number;
  tag: TacticalTag;
  /** 面朝方向（守点时用）。 */
  yaw: number;
}

/** CT 的防守位与 T 的推进位；AI 会寻路到这些点再展开。 */
export const TACTICAL_POINTS: TacticalPoint[] = [
  // CT 守 A（分别预瞄 小道口 / 长廊口 / 南侧上点口）
  { x: 19, z: -47, tag: 'holdA', yaw: 2.36 },
  { x: 49, z: -51, tag: 'holdA', yaw: 2.6 },
  { x: 34, z: -45, tag: 'holdA', yaw: -1.82 },
  { x: 27, z: -55, tag: 'holdA', yaw: 3.1 },
  { x: 55, z: -50, tag: 'holdA', yaw: 2.9 },
  // CT 守 B（都预瞄 B 洞出口 / B 门方向）
  { x: -49, z: -29, tag: 'holdB', yaw: -1.94 },
  { x: -31, z: -45, tag: 'holdB', yaw: 2.91 },
  { x: -46, z: -50, tag: 'holdB', yaw: -2.78 },
  { x: -36, z: -47, tag: 'holdB', yaw: 3.14 },
  // CT 守中 / 小道
  { x: -6, z: -24, tag: 'holdMid', yaw: Math.PI },
  { x: 8, z: -14, tag: 'holdMid', yaw: Math.PI },
  { x: -6, z: -35, tag: 'holdMid', yaw: Math.PI },
  // T 推 A
  { x: 50, z: 8, tag: 'pushA', yaw: 0 },
  { x: 52, z: -22, tag: 'pushA', yaw: 0 },
  { x: 8, z: -34, tag: 'pushA', yaw: 0 },
  { x: 46, z: -36, tag: 'pushA', yaw: 0 },
  // T 推 B
  { x: -28, z: 32, tag: 'pushB', yaw: 0 },
  { x: -30, z: 2, tag: 'pushB', yaw: 0 },
  { x: -36, z: -18, tag: 'pushB', yaw: 0 },
  { x: -40, z: -28, tag: 'pushB', yaw: 0 },
  // T 推中
  { x: -6, z: 24, tag: 'pushMid', yaw: 0 },
  { x: -6, z: 4, tag: 'pushMid', yaw: 0 },
  { x: 8, z: -10, tag: 'pushMid', yaw: 0 },
];

/** 地图整体包围盒，供小地图与网格导航使用。 */
export function mapBounds(): { x0: number; z0: number; x1: number; z1: number } {
  let x0 = Infinity;
  let z0 = Infinity;
  let x1 = -Infinity;
  let z1 = -Infinity;
  for (const a of AREAS) {
    x0 = Math.min(x0, a.x0);
    z0 = Math.min(z0, a.z0);
    x1 = Math.max(x1, a.x1);
    z1 = Math.max(z1, a.z1);
  }
  return { x0, z0, x1, z1 };
}

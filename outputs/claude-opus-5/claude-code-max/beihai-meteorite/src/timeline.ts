/**
 * The cut list.
 *
 * Every shot boundary in the film lives here, so the voice manifest, the sound
 * design and the staging all quote the same numbers. Times are absolute seconds
 * from the first frame; nothing in the film is derived from frame deltas.
 */

export const DURATION = 358;

export const T = {
  /** 序：一块铁陨石在星光里翻滚，片名 */
  t0: [0, 9],
  /** 钩子：同步轨道上一个等待的白点 */
  t1: [9, 21],

  /** 胡同 · 院门 */
  c0: [21, 30],
  /** 收藏室 · 见面 */
  c1: [30, 41],
  /** 「您是军人吧」 */
  c2: [41, 51],
  /** 南极 · 保险柜里的镇宅之宝 */
  c3: [51, 62],
  /** 茶杯里盛的也是陨石 */
  c4: [62, 72],
  /** 需求 → 「要雕刻是吧」 */
  c5: [72, 84],
  /** 三块铁陨石 · 报价 */
  c6: [84, 94],
  /** 付款 · 「对要送的人的尊重」 */
  c7: [94, 105],

  /** 太空电梯 · 增援未来 */
  m0: [105, 120],

  /** 车间 · 夜 · 机床启动 */
  w0: [120, 133],
  /** 切割 · 三十六段 */
  w1: [133, 146],
  /** 扫屑 · 拆刀 · 熄灯 */
  w2: [146, 155],

  /** 地下室 · 拆弹头 */
  b0: [155, 168],
  /** 粘陨石 · 三十六颗 */
  b1: [168, 179],
  /** 试射 */
  b2: [179, 190],
  /** 牛肉 · 碎石 · 航天服布料 */
  b3: [190, 203],

  /** 一号基地 · 留下定位单元 */
  s0: [203, 214],
  /** 太空全景 */
  s1: [214, 229],
  /** 悬浮 · 父亲 */
  s2: [229, 243],
  /** 日落 · 标志灯由红变绿 */
  s3: [243, 255],
  /** 合影 · 面罩透明 · 锁定 */
  s4: [255, 276],
  /** 摘手套 · 取枪 · 装瞄准镜 */
  s5: [276, 291],
  /** 三十次击发 */
  s6: [291, 304],
  /** 十秒弹道 */
  s7: [304, 320],
  /** 命中 */
  s8: [320, 338],
  /** 撤离 */
  s9: [338, 352],

  /** 结尾字幕 */
  e0: [352, 358],
} as const satisfies Record<string, readonly [number, number]>;

export type ShotKey = keyof typeof T;

export const start = (key: ShotKey): number => T[key][0];
export const end = (key: ShotKey): number => T[key][1];
export const span = (key: ShotKey): number => T[key][1] - T[key][0];

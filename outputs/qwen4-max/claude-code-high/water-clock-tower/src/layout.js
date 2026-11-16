// 全台布局常量(单位:米)。物理与视觉共用,保证两者严格对齐。
export const L = {
  // 枢轮(主水轮)
  wheel: { x: 0, y: 2.6, z: 0, R: 1.6, buckets: 36, width: 0.5 },
  stepDeg: 10,                 // 36 壶 → 每步 10°
  fillDeg: 78,                 // 受水壶的注水位置(轮顶偏右,顺时针下行)
  spout: { x: 0.36, y: 4.92, z: 0 },
  tank: { x: 1.95, y: 5.18, z: 0, w: 1.15, h: 0.5, d: 0.72 },   // 平水壶
  skyTank: { x: 2.35, y: 7.05, z: -1.05, w: 1.5, h: 0.62, d: 1.05 }, // 天池
  overflowLip: { x: 2.56, y: 5.34, z: 0.18 },
  basinY: 0.86,                // 退水池水面
  // 天衡(擒纵杠杆)
  lever: { px: 0.92, py: 4.62, pz: -0.34 },
  // 传动
  lay: { x: 0, y: 1.9, z: -1.1 },        // 中间轴(齿轮副 2.5:1)
  vert: { x: 0, z: -1.8 },               // 立轴(天梯)
  globe: { x: 0, y: 6.05, z: -0.35, r: 1.0 },
  armillary: { x: 0, y: 8.95, z: 0, r: 0.92 },
  polar: { x: 0, y: Math.sin(34.7 * Math.PI / 180), z: -Math.cos(34.7 * Math.PI / 180) }, // 北极轴(开封纬度)
  // 木阁报时
  carousel: { x: 0, y: 5.95, z: 2.28, r: 0.58, figures: 12 },
  drum: { x: 0, y: 5.2, z: 3.02, r: 0.3, len: 0.3 },
  hammerPivot: { x: -0.18, y: 5.74, z: 3.34 },
  bell: { x: 1.18, y: 5.72, z: 3.0 },
  bellPivot: { x: 1.18, y: 6.06, z: 3.0 },
  malletPivot: { x: 1.18, y: 5.86, z: 3.36 },
  // 建筑
  storey1: { half: 3.2, y0: 0.7, y1: 4.6 },
  storey2: { half: 2.8, y0: 4.6, y1: 7.6 },
  topDeck: { half: 2.5, y: 7.6 },
};
export const DEG = Math.PI / 180;

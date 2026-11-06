// 水运仪象台 —— 几何布局（物理与渲染共用）
// 单位：米。y 轴向上，镜头正面朝 -z 方向看（+z 为观众一侧）。
// 角度约定：枢轮上的"时钟角" θ 从正上方开始顺时针计（从 +z 方向看）。

const D2R = Math.PI / 180;

export const DT = 1 / 120; // 物理步长

// ---------- 枢轮（水轮） ----------
// 每只受水壶铰接在辐条上，可在两个挡块之间俯仰（这是苏颂"天衡"擒纵的关键：
// 只有注水位那一只壶的重量被格叉称量，与其余壶无关）。
export const WHEEL = {
  center: [3.0, 2.4, 0],
  n: 16, // 受水壶（辐条）数
  rPivot: 1.25, // 壶铰点半径
  rCup: 1.5, // 壶中心半径
  rBalance: 1.0, // 壶尾平衡块半径
  rLug: 1.66, // 壶外侧凸耳（压格叉）半径
  lugR: 0.04,
  lugZ: 0.36,
  alpha: -15 * D2R, // 壶口相对"后向切线"的偏转
  inner: 0.36, // 壶口内宽
  depth: 0.3, // 壶深
  wall: 0.03,
  halfZ: 0.16,
  cupMass: 1.0,
  balanceMass: 2.2,
  tiltMin: -0.26, // 壶相对辐条可下俯的角度
  fillTheta: 70 * D2R, // 注水位
  // 辐条端的销（被天关挡住）
  rPin: 1.55,
  pinR: 0.025,
  pinZ: 0.5,
  mass: 40,
  inertia: 25,
  damp: 0.6,
};
WHEEL.pitch = (2 * Math.PI) / WHEEL.n;

// ---------- 枢衡（杠杆）：一端格叉托壶，另一端天关挡辐条 ----------
export const LEVER = {
  stopTheta: 160 * D2R, // 天关挡销的位置（枢轮右下方）
  stopArm: 1.5, // 支点沿切向离挡点的距离
  stopHalfT: 0.03, // 天关挡块半厚
  stopDepth: 0.02, // 挡块下端越过销心向内伸出的深度
  faceTilt: -0.012, // 挡面预偏角（弧度）
  stopZ: 0.5,
  padZ: 0.36,
  padHalfW: 0.06,
  padHalfT: 0.025,
  lugGap: 0.07, // 空壶凸耳与格叉之间的转角间隙
  beamZ: 0.62,
  beamMass: 0.2,
  shortMass: 0.1,
  cwMass: 1.04, // 枢权
  cwOffset: [0.35, 0.15], // 枢权相对支点的位置
  tripMax: 0.09, // 杠杆最大摆角
};

// ---------- 水路 ----------
export const WATER = {
  r: 0.028, // 水滴（粒子）物理半径
  rate: 20, // 每秒注入粒子数（平水壶保持恒定流量）
  maxParticles: 320,
  mass: 0.09,
  nozzleDrop: 0.5, // 喷口高于壶中心的高度
  sumpY: 0.12,
};

// ---------- 传动 ----------
const T_X = WHEEL.center[0];
const T_Z = -0.95;
export const SHAFT = {
  tianzhu: { x: T_X, z: T_Z, y0: 0.3, y1: 7.55 }, // 天柱（竖轴）
  bevelR: 0.25,
  wheelBevelR: 0.35, // 枢轮轴后端的伞齿（地毂）
  wheelBevelZ: T_Z + 0.35,
  tianzhuWheelGearY: WHEEL.center[1] - 0.35,
  L1: { y: 0.6, z: T_Z, x0: 0.16, x1: T_X - 0.25 },
};

export const JILUN = {
  // 昼夜机轮（竖轴）
  x: -0.5,
  z: T_Z,
  y0: 0.25,
  y1: 3.35,
  crownY: 0.38,
  crownR: 0.66,
  pinionR: 0.22,
  tierR: 0.76,
  tripR: 0.68,
  drumY: 1.25,
  bellY: 2.05,
  placardY: 2.85,
  discHalf: 0.03,
  pinH: 0.1,
  pinHalfW: 0.015,
  nPins: 12,
  mass: 8,
};

// 浑象、浑仪（极轴倾斜 = 开封纬度约 35°）
const LAT = 35 * D2R;
export const POLAR = [0, Math.sin(LAT), -Math.cos(LAT)]; // 指向北天极
const S = [0, -Math.sin(LAT), Math.cos(LAT)]; // 指向南
export const CELESTIAL = { crownR: 0.36, pinionR: 0.12, crownOff: 0.8 };
function celestialAt(cx, cy) {
  const k = CELESTIAL.crownOff + CELESTIAL.pinionR;
  const cz = T_Z - k * S[2];
  const lineY = cy + k * S[1];
  return { center: [cx, cy, cz], lineY, pinionX: cx + CELESTIAL.crownR };
}
export const GLOBE = { ...celestialAt(0.9, 5.7), radius: 0.74, mass: 6 };
export const ARMILLARY = { ...celestialAt(0.9, 8.15), radius: 0.95, mass: 4 };
export const SOUTH = S;

// ---------- 木人击钟 / 击鼓 ----------
export const STRIKER = {
  tailLen: 0.5,
  armLen: 0.42,
  frontZ: 0.3,
  mass: 0.8,
};

export { D2R };

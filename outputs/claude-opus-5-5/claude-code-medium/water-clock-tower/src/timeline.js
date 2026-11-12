// 镜头与字幕时间线（镜头与字幕可以手写；机械运动全部来自物理）
// 影片时间 = 物理时间（物理确定性：同样的初始条件每次得到同样的事件时刻）。
// 主要物理事件（tools/events.mjs 输出）：
//   第2格 放行 7.29 → 卡住 8.88；第3格 格叉下沉 10.69 → 放行 10.94 → 卡住 12.73
//   第4格 14.66 → 16.56；第5格 18.49 → 20.31；第6格 22.40 → 24.25 → 钟 24.44
//   第7格 26.29 → 28.12 → 钟 28.29；第8格 30.11 → 32.00 → 钟 32.15
export const PREWARM = 0;
export const DURATION = 32.6;

const v = (x, y, z) => [x, y, z];

export const SHOTS = [
  { // 外景：钟塔全貌
    t0: 0, t1: 6.0, keys: [
      { t: 0.0, pos: v(15, 8.5, 27), tgt: v(0.5, 4.2, 0), fov: 38 },
      { t: 3.4, pos: v(10, 5.0, 19.5), tgt: v(0.6, 2.6, 0), fov: 38 },
      { t: 6.0, pos: v(6.6, 1.6, 11.5), tgt: v(1.6, 0.1, 0), fov: 38 },
    ] },
  { // 水：天池 → 平水壶 → 受水壶
    t0: 6.0, t1: 9.9, keys: [
      { t: 6.0, pos: v(5.4, 1.5, 6.4), tgt: v(3.0, 0.0, 0.0), fov: 40 },
      { t: 9.9, pos: v(4.3, 0.4, 5.0), tgt: v(2.55, -0.55, 0.1), fov: 40 },
    ] },
  { // 擒纵：格叉 → 天条 → 天衡 → 天关
    t0: 9.9, t1: 15.4, keys: [
      { t: 9.9, pos: v(2.6, 0.4, 8.6), tgt: v(1.9, 0.45, 0.2), fov: 42 },
      { t: 15.4, pos: v(2.0, 0.7, 9.3), tgt: v(1.6, 0.55, 0.2), fov: 42 },
    ] },
  { // 节律：一格一格
    t0: 15.4, t1: 18.6, keys: [
      { t: 15.4, pos: v(0.9, 0.9, 11.2), tgt: v(0.7, 0.0, 0), fov: 40 },
      { t: 18.6, pos: v(0.2, 1.3, 10.6), tgt: v(0.3, 0.2, 0), fov: 40 },
    ] },
  { // 传动：地毂 → 天柱 → 浑象 → 浑仪（墙体半透明）
    t0: 18.6, t1: 23.8, xray: true, cut: true, keys: [
      { t: 18.6, pos: v(2.2, 1.0, -6.6), tgt: v(-1.1, -0.2, -1.4), fov: 46 },
      { t: 20.2, pos: v(1.4, 3.7, -9.6), tgt: v(-2.6, 3.0, -1.5), fov: 46 },
      { t: 21.9, pos: v(1.3, 6.9, -7.3), tgt: v(-1.9, 5.7, -0.7), fov: 44 },
      { t: 23.8, pos: v(1.4, 12.6, -7.2), tgt: v(-1.8, 11.9, -0.5), fov: 42 },
    ] },
  { // 报时：拨牙 → 木人击钟 → 时辰牌
    t0: 23.8, t1: 28.7, cut: true, keys: [
      { t: 23.8, pos: v(-1.8, -1.15, 6.4), tgt: v(-3.0, -1.3, 1.4), fov: 41 },
      { t: 28.7, pos: v(-2.3, -1.25, 5.6), tgt: v(-3.0, -1.35, 1.4), fov: 41 },
    ] },
  { // 收尾：拉远
    t0: 28.7, t1: 32.6, cut: true, keys: [
      { t: 28.7, pos: v(5.0, 1.6, 12.0), tgt: v(0.4, 1.8, 0), fov: 40 },
      { t: 32.6, pos: v(13, 7.5, 25), tgt: v(0.5, 4.4, 0), fov: 40 },
    ] },
];

export const CAPTIONS = [
  { t0: 0.6, t1: 5.8, kind: 'title' },
  { t0: 6.1, t1: 8.4, step: '①', text: '天池的水先流进平水壶。', sub: '平水壶水面始终一样高，出水口的水流就又稳又匀。' },
  { t0: 8.4, t1: 9.9, step: '②', text: '水注入枢轮上的受水壶，壶一点点变重。', sub: '壶边的托销压在“格叉”上，像秤一样称着它。' },
  { t0: 9.9, t1: 10.95, step: '③', text: '壶满了，重量终于压下格叉——', sub: '' },
  { t0: 10.95, t1: 12.15, step: '③', text: '格叉一沉，拉动天条，天衡翘起，抬开天关。', sub: '' },
  { t0: 12.15, t1: 13.7, step: '④', text: '枢轮被满壶拉着转过一格，', sub: '天关随即落下，卡住下一根轮辐。' },
  { t0: 13.7, t1: 15.4, step: '④', text: '下一只空壶到位，接着接水……', sub: '天锁则挡住轮辐，防止枢轮倒转。' },
  { t0: 15.4, t1: 18.6, step: '⑤', text: '水流不停，轮却一格一格地走——这就是“擒纵”。', sub: '每格用时相同，时间被均匀地“数”了出来。' },
  { t0: 18.6, t1: 23.8, step: '⑥', text: '枢轮经地毂、天柱、齿轮向上传动，', sub: '带动中层浑象、顶层浑仪，跟着天球同步旋转。' },
  { t0: 23.8, t1: 28.7, step: '⑦', text: '天柱也带动机轮：拨牙拨动木人击钟，', sub: '时辰牌随之转到窗口——按时报时。' },
  { t0: 28.7, t1: 32.6, kind: 'end' },
];

export const LABELS = [
  { name: '天池', at: { w: [3.95, 2.3, -0.2] }, t: [6.2, 8.4] },
  { name: '平水壶', at: { w: [3.2, 0.3, 0.3] }, t: [6.4, 9.8] },
  { name: '受水壶', at: { w: [2.2, -0.68, 0.3] }, t: [8.5, 9.8] },
  { name: '格叉', at: { body: 'fork', l: [-1.0, -0.06, 0.05] }, t: [8.9, 15.2], below: true },
  { name: '枢权', at: { body: 'fork', l: [0.85, -0.05, 0.1] }, t: [10.1, 15.2], below: true },
  { name: '天条', at: { w: [3.53, 0.9, 0.5] }, t: [10.9, 15.2] },
  { name: '天衡', at: { body: 'beam', l: [-1.3, 0.1, 0.0] }, t: [11.1, 15.2] },
  { name: '天关', at: { body: 'beam', l: [-2.83, 0.12, 0.0] }, t: [11.3, 15.2] },
  { name: '天锁', at: { body: 'lock', l: [0.0, 0.0, 0.05] }, t: [13.7, 15.2] },
  { name: '枢轮', at: { w: [-0.4, 0.45, 0.4] }, t: [12.2, 18.4] },
  { name: '退水壶', at: { w: [-1.0, -2.75, 0.9] }, t: [15.6, 18.4], below: true },
  { name: '地毂', at: { w: [-1.6, 0.25, -1.5] }, t: [18.8, 20.3] },
  { name: '天柱', at: { w: [-3.0, 2.0, -1.5] }, t: [19.4, 21.4] },
  { name: '浑象', at: { w: [-1.6, 7.2, 0.3] }, t: [21.0, 22.6] },
  { name: '浑仪', at: { w: [-1.5, 13.0, 0.2] }, t: [22.5, 23.7] },
  { name: '拨牙', at: { w: [-3.35, -2.25, 1.45] }, t: [24.1, 28.5], below: true },
  { name: '木人', at: { w: [-2.8, -1.45, 1.7] }, t: [24.3, 28.5] },
  { name: '钟', at: { w: [-3.3, -0.95, 1.47] }, t: [24.5, 28.5] },
  { name: '时辰牌', at: { w: [-2.7, 0.2, 1.6] }, t: [24.7, 28.5] },
  { name: '升水轮', at: { w: [6.4, 2.4, 0.4] }, t: [29.2, 31.2] },
];

export const CHAIN = ['水', '受水壶', '格叉', '天条', '天衡·天关', '枢轮', '天柱', '浑象·浑仪', '木人报时'];
export function chainIndex(t) {
  if (t < 6.0) return -1;
  if (t < 8.4) return 0;
  if (t < 9.9) return 1;
  if (t < 10.95) return 2;
  if (t < 11.45) return 3;
  if (t < 12.15) return 4;
  if (t < 18.6) return 5;
  if (t < 20.9) return 6;
  if (t < 23.8) return 7;
  if (t < 28.7) return 8;
  return 9;
}

export const HIGHLIGHTS = [
  { name: '平水壶', t: [6.2, 8.4] },
  { name: '天池', t: [6.2, 7.4] },
  { name: '枢轮', t: [12.2, 13.6] },
  { name: '天锁', t: [13.8, 15.2] },
  { name: '天柱', t: [18.7, 21.0] },
  { name: '浑象', t: [21.0, 22.5] },
  { name: '浑仪', t: [22.4, 23.8] },
  { name: '机轮', t: [24.0, 25.2] },
  { name: '升水轮', t: [29.2, 31.0] },
];

const ease = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const smooth = (x) => x * x * (3 - 2 * x);
const lerp = (a, b, t) => a + (b - a) * t;
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

function cr(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
function sampleKeys(keys, t) {
  if (t <= keys[0].t) return keys[0];
  if (t >= keys[keys.length - 1].t) return keys[keys.length - 1];
  let i = 0;
  while (i < keys.length - 1 && t > keys[i + 1].t) i++;
  const k1 = keys[i], k2 = keys[i + 1];
  const k0 = keys[i - 1] || k1, k3 = keys[i + 2] || k2;
  const u = (t - k1.t) / (k2.t - k1.t);
  const uu = keys.length === 2 ? smooth(u) : u;
  const f = (sel) => [0, 1, 2].map((j) => cr(sel(k0)[j], sel(k1)[j], sel(k2)[j], sel(k3)[j], uu));
  return { pos: f((k) => k.pos), tgt: f((k) => k.tgt), fov: lerp(k1.fov, k2.fov, uu) };
}

export function cameraAt(t) {
  let si = SHOTS.findIndex((s) => t >= s.t0 && t < s.t1);
  if (si < 0) si = t < 0 ? 0 : SHOTS.length - 1;
  const s = SHOTS[si];
  const cur = sampleKeys(s.keys, t);
  const blend = 0.9;
  if (si > 0 && !s.cut && t - s.t0 < blend) {
    const prev = SHOTS[si - 1];
    const pv = sampleKeys(prev.keys, prev.t1);
    const u = smooth((t - s.t0) / blend);
    return { pos: lerp3(pv.pos, cur.pos, u), tgt: lerp3(pv.tgt, cur.tgt, u), fov: lerp(pv.fov, cur.fov, u), shot: si };
  }
  return { ...cur, shot: si };
}

// 传动镜头时墙体透明度（0..1）
export function xrayAt(t) {
  const s = SHOTS.find((x) => x.xray);
  if (!s) return 0;
  return Math.max(0, Math.min(1, (t - s.t0) / 0.6, (s.t1 - t) / 0.4));
}

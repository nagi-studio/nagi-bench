// Shot list, captions and labels. Only the camera and text follow this script;
// every mechanical movement comes from the physics simulation.

export const FILM_END = 35;

export const SHOTS = [
  { t: 0.0, p: [6.8, 5.6, 14.0], l: [-0.8, 4.7, -0.6] },
  { t: 3.7, p: [5.0, 5.3, 10.2], l: [-0.4, 4.4, -0.5] },
  { t: 4.9, p: [2.8, 5.7, 4.7], l: [1.25, 5.15, 0] },
  { t: 9.0, p: [2.4, 5.45, 4.3], l: [1.0, 4.9, 0] },
  { t: 10.1, p: [0.75, 4.15, 3.5], l: [0.55, 3.85, 0.2] },
  { t: 13.0, p: [0.68, 4.1, 3.2], l: [0.55, 3.85, 0.2] },
  { t: 14.0, p: [0.85, 3.95, 4.2], l: [0.75, 3.7, 0.2] },
  { t: 17.4, p: [0.75, 3.9, 3.9], l: [0.75, 3.65, 0.2] },
  { t: 17.6, cut: true, p: [2.35, 2.95, -2.45], l: [-0.1, 2.75, -1.15] },
  { t: 19.8, p: [2.25, 3.1, -2.45], l: [-0.1, 2.85, -1.2] },
  { t: 21.4, p: [2.1, 3.3, -2.5], l: [-0.1, 3.5, -1.3] },
  { t: 21.5, cut: true, p: [-4.9, 2.55, 3.3], l: [-3.55, 1.6, 0.35] },
  { t: 26.5, p: [-4.6, 2.35, 2.9], l: [-3.55, 1.6, 0.35] },
  { t: 26.6, cut: true, p: [0.75, 7.95, 1.55], l: [-1.0, 7.85, -1.45] },
  { t: 28.9, p: [0.9, 8.1, 1.7], l: [-0.8, 8.0, -1.45] },
  { t: 30.5, p: [1.1, 10.7, 2.7], l: [0, 10.35, -1.45] },
  { t: 30.8, p: [1.0, 10.75, 2.75], l: [0, 10.35, -1.45] },
  { t: 30.9, cut: true, p: [8.2, 7.4, 14.0], l: [-0.8, 5.5, -0.6] },
  { t: 40.0, p: [9.6, 8.0, 16.4], l: [-0.8, 5.5, -0.6] },
];

export const CHAIN = ['① 恒定水流', '② 受水壶称重', '③ 擒纵放行', '④ 枢轮步进', '⑤ 天柱传动', '⑥ 报时·演天象'];

export function chainIndex(t) {
  if (t < 4) return -1;
  if (t < 9.5) return 0;
  if (t < 13) return 1;
  if (t < 15.4) return 2;
  if (t < 17.6) return 3;
  if (t < 21.5) return 4;
  if (t < 30.8) return 5;
  return 99;
}

const A = '<span class="arrow">→</span>';
export const CAPTIONS = [
  { t0: 4.0, t1: 9.5, glow: ['tank1', 'tank2', 'pipes'],
    html: '<b>① 恒定水流</b>：上方「天池」放水进「平水壶」，多出的水从溢流管流走<br>平水壶水位始终不变，所以喷口流出的水<b>又稳又匀</b>' },
  { t0: 9.5, t1: 13.0, glow: ['bucket', 'fork'],
    html: '<b>② 称重</b>：水注入枢轮上的「受水壶」。壶没满时，「格叉」把壶托住，<br>「天关」卡住轮上的销子——<b>枢轮被锁住，一动不动</b>' },
  { t0: 13.0, t1: 15.4, glow: ['fork', 'rod', 'beam', 'tooth'],
    html: `<b>③ 放行</b>：壶一满，重量压下格叉 ${A} 格叉另一头推起「天条」${A} 撬起「天衡」${A} <b>天关抬起</b>` },
  { t0: 15.4, t1: 17.6, glow: ['wheel', 'tooth', 'pegs'],
    html: '<b>④ 步进</b>：枢轮只转过<b>一格</b>，天关落下又把它卡住；下一只空壶接着装水……<br>一放一锁，把连续的水流切成<b>均匀的节拍</b>（这就是“擒纵”）' },
  { t0: 17.6, t1: 21.5, glow: ['drive', 'shaft'],
    html: '<b>⑤ 传动</b>：枢轮轴上的齿轮带动立轴「天柱」，<br>把这一格一格的转动传给上下各层' },
  { t0: 21.5, t1: 26.6, glow: ['cams', 'bell', 'drum', 'placard'],
    html: '<b>⑥ 报时</b>：机轮上的「拨牙」挑起木人手臂，滑脱后手臂落下——<b>击钟、打鼓</b>；<br>时辰牌也一块块轮流转到最上方' },
  { t0: 26.6, t1: 30.8, glow: ['globe', 'armillary', 'astro'],
    html: '<b>⑦ 演天象</b>：同一根天柱还带动中层的「浑象」（星球仪）和顶层的「浑仪」，<br>让它们跟着天空同步旋转' },
  { t0: 30.8, t1: 99, glow: [],
    html: `水 ${A} 壶满称重 ${A} 擒纵放行 ${A} 枢轮一格 ${A} 天柱 ${A} 钟鼓与星空<br><small>苏颂《新仪象法要》记载 · 它的擒纵装置被认为是后世机械钟“擒纵器”的先驱</small>` },
];

// a = anchor key (see main.js); h = leader length
export const LABELS = [
  { t0: 4.6, t1: 9.4, a: 'tank1', text: '天池', water: true, h: 22 },
  { t0: 5.0, t1: 9.4, a: 'tank2', text: '平水壶', water: true, h: 18 },
  { t0: 5.6, t1: 9.4, a: 'overflow', text: '溢流管', water: true, h: 40 },
  { t0: 6.2, t1: 9.4, a: 'stream', text: '恒定水流', water: true, h: 18 },
  { t0: 10.2, t1: 13.0, a: 'bucket', text: '受水壶', dyn: 'fill', h: 70 },
  { t0: 10.6, t1: 13.0, a: 'fork', text: '格叉', h: 0 },
  { t0: 11.2, t1: 13.0, a: 'tooth', text: '天关', h: 30 },
  { t0: 13.1, t1: 17.4, a: 'forkBody', text: '格叉', h: 0 },
  { t0: 13.4, t1: 17.4, a: 'rod', text: '天条', h: 0 },
  { t0: 13.7, t1: 17.4, a: 'beam', text: '天衡', h: 22 },
  { t0: 14.0, t1: 17.4, a: 'tooth', text: '天关', h: 50 },
  { t0: 15.4, t1: 17.4, a: 'wheel', text: '枢轮', h: 10 },
  { t0: 18.8, t1: 21.3, a: 'crown', text: '齿轮', h: 22 },
  { t0: 19.2, t1: 21.3, a: 'shaft', text: '天柱（立轴）', h: 20 },
  { t0: 22.6, t1: 26.4, a: 'cam', text: '拨牙', h: 40 },
  { t0: 22.9, t1: 26.4, a: 'bell', text: '钟', h: 20 },
  { t0: 23.2, t1: 26.4, a: 'drum', text: '鼓', h: 20 },
  { t0: 23.5, t1: 26.4, a: 'placard', text: '时辰牌', h: 24 },
  { t0: 27.4, t1: 29.6, a: 'globe', text: '浑象', h: 20 },
  { t0: 29.2, t1: 31.6, a: 'armillary', text: '浑仪', h: 20 },
  { t0: 32.0, t1: 99, a: 'armillary', text: '浑仪', h: 16 },
  { t0: 32.2, t1: 99, a: 'globe', text: '浑象', h: 16 },
  { t0: 32.4, t1: 99, a: 'pagoda', text: '报时木阁', h: 16 },
  { t0: 32.6, t1: 99, a: 'wheel', text: '枢轮', h: 16 },
  { t0: 32.8, t1: 99, a: 'tank1', text: '天池', water: true, h: 16 },
];

// 分镜、镜头运动、字幕与标注。镜头和文字按影片时间走；机械部分完全交给物理。
import * as THREE from 'three';

const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const ease = (t) => t * t * t * (t * (6 * t - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;

export const END = 33.2;

// 每个镜头：起止时间 + 若干关键帧（pos / 注视点 / 视角）。镜头之间硬切。
const SHOTS = [
  { t0: 0, t1: 4.0, keys: [
    { t: 0, p: [13.5, 6.4, -23.0], l: [0.4, 5.75, 0], f: 34 },
    { t: 4.0, p: [10.6, 7.0, -20.6], l: [0.3, 5.7, 0], f: 34 } ], fog: [30, 80] },
  // 一 · 水（从背面看枢轮与水箱）
  { t0: 4.0, t1: 9.5, keys: [
    { t: 4.0, p: [3.2, 4.3, 11.6], l: [0.7, 2.9, 0], f: 34 },
    { t: 6.6, p: [3.6, 4.5, 6.9], l: [2.0, 3.3, 0], f: 34 },
    { t: 9.5, p: [3.3, 4.2, 5.9], l: [2.05, 3.3, 0], f: 34 } ], fog: [1.0, 2.4] },
  // 二 · 擒纵
  { t0: 9.5, t1: 15.3, keys: [
    { t: 9.5, p: [1.7, 3.52, 5.75], l: [1.5, 3.38, 0.3], f: 34 },
    { t: 15.3, p: [1.5, 3.46, 5.3], l: [1.5, 3.38, 0.3], f: 34 } ], fog: [0.55, 1.25] },
  // 三 · 传动
  { t0: 15.3, t1: 19.5, keys: [
    { t: 15.3, p: [-3.9, 3.6, -5.9], l: [0.1, 3.2, -0.9], f: 34 },
    { t: 17.8, p: [-3.5, 3.95, -5.5], l: [0.1, 3.3, -0.95], f: 34 },
    { t: 19.5, p: [-3.5, 5.0, -5.6], l: [0.05, 4.3, -1.1], f: 34 } ], fog: [3.5, 9] },
  // 四 · 浑象 → 浑仪
  { t0: 19.5, t1: 23.5, keys: [
    { t: 19.5, p: [-3.5, 7.6, -4.9], l: [0.05, 6.55, -0.6], f: 34 },
    { t: 21.2, p: [-3.1, 7.8, -4.5], l: [0.05, 6.6, -0.6], f: 34 },
    { t: 21.9, p: [-4.0, 10.2, -5.1], l: [0.0, 9.05, -0.3], f: 34 },
    { t: 23.5, p: [-3.6, 10.3, -4.8], l: [0.0, 9.1, -0.25], f: 34 } ], fog: [1.7, 3.8] },
  // 五 · 报时（正面木阁）
  { t0: 23.5, t1: 29.5, keys: [
    { t: 23.5, p: [1.1, 4.85, -7.9], l: [-0.05, 4.47, -2.3], f: 30 },
    { t: 29.5, p: [0.55, 4.75, -6.9], l: [-0.05, 4.47, -2.3], f: 30 } ], fog: [6, 16] },
  // 六 · 全貌
  { t0: 29.5, t1: 999, keys: [
    { t: 29.5, p: [10.6, 7.0, -20.6], l: [0.3, 4.9, 0], f: 34 },
    { t: 34.5, p: [13.6, 8.0, -25.2], l: [0.3, 4.4, 0], f: 34 } ], fog: [30, 80] },
];

// 字幕
const CAPS = [
  { t0: 1.9, t1: 3.85, step: '', html: '九百多年前，它只靠<u>水</u>的重量，就能自己走时、报时。' },
  { t0: 4.35, t1: 9.3, step: '一 · 水', html: '高处<b>天池</b>的水先进<b>平水壶</b>：水位不变，流出的<u>水流</u>就一样快。' },
  { t0: 9.75, t1: 11.2, step: '二 · 擒纵', html: '水斗没装满时，<b>天关</b>卡住枢轮，整座钟静止不动。' },
  { t0: 11.3, t1: 15.15, step: '二 · 擒纵', html: '水够重 → 压下<b>格叉</b> → <b>天条</b>拉动<b>天衡</b> → 天关抬起：只转<b>一格</b>。' },
  { t0: 15.55, t1: 19.35, step: '三 · 传动', html: '轮轴上的木齿轮拨动<b>天柱</b>，把这"一格一格"送上楼。' },
  { t0: 19.75, t1: 23.35, step: '四 · 仪象', html: '<b>浑象</b>和<b>浑仪</b>跟着一步步转，追上星空的运行。' },
  { t0: 23.8, t1: 29.3, step: '五 · 报时', html: '机轮同步前进：换上新的<b>报时牌</b>，时初<b>摇铃</b>，时正<b>敲钟</b>。' },
];

// 标注：anchor 为 view.anchors 的键；ox/oy 为相对视口高度的偏移（负 = 向左/向上）
const LABELS = [
  { id: 'tianchi', a: 'tianchi', t0: 4.7, t1: 9.35, ox: 0.05, oy: -0.1, cls: 'water', html: '天池<small>高处蓄水</small>' },
  { id: 'pingshui', a: 'pingshui', t0: 5.3, t1: 9.35, ox: 0.11, oy: 0.02, cls: 'water', html: '平水壶<small>水位恒定 → 流速恒定</small>' },
  { id: 'scoop', a: 'scoop', t0: 6.3, t1: 9.35, ox: -0.02, oy: 0.2, html: '受水壶<small>36 只水斗，逐个接水</small>' },
  { id: 'wheel', a: 'wheelRim', t0: 6.9, t1: 9.35, ox: -0.06, oy: -0.16, html: '枢轮<small>水力驱动的主动轮</small>' },

  { id: 'e1', a: 'fork', t0: 10.0, t1: 15.2, ox: 0.1, oy: 0.13, html: '<em>①</em>格叉 · 枢衡<small>托住水斗的"秤"</small>' },
  { id: 'e2', a: 'tiao', t0: 10.2, t1: 15.2, ox: 0.1, oy: -0.03, html: '<em>②</em>天条<small>一拉</small>' },
  { id: 'e3', a: 'heng', t0: 10.4, t1: 15.2, ox: 0.03, oy: -0.075, html: '<em>③</em>天衡<small>杠杆翘起</small>' },
  { id: 'e4', a: 'tooth', t0: 10.6, t1: 15.2, ox: -0.14, oy: 0.03, html: '<em>④</em>天关<small>卡住 / 放行枢轮</small>' },
  { id: 'e0', a: 'scoop', t0: 9.9, t1: 15.2, ox: -0.14, oy: 0.12, cls: 'water', html: '受水壶<small>水越积越重</small>' },

  { id: 'gA', a: 'gearA', t0: 15.8, t1: 19.3, ox: -0.12, oy: 0.16, html: '枢轮轴上的大齿轮' },
  { id: 'gS', a: 'shaft', t0: 16.2, t1: 19.3, ox: 0.22, oy: 0.03, html: '天柱<small>竖直的传动轴</small>' },

  { id: 'globe', a: 'globe', t0: 19.9, t1: 21.5, ox: 0.3, oy: -0.2, html: '浑象<small>天球仪：演示星空的转动</small>' },
  { id: 'armil', a: 'armil', t0: 22.0, t1: 23.4, ox: 0.34, oy: -0.02, html: '浑仪<small>观测天体的仪器</small>' },

  { id: 'door', a: 'door', t0: 24.0, t1: 29.3, ox: 0.2, oy: 0.04, html: '报时牌<small>木人抱牌，逐一出现</small>' },
  { id: 'bellA', a: 'bellA', t0: 24.3, t1: 29.3, ox: -0.2, oy: -0.08, html: '钟<small>时正 · 敲钟</small>' },
  { id: 'bellB', a: 'bellB', t0: 24.6, t1: 29.3, ox: 0.2, oy: -0.1, html: '铃<small>时初 · 摇铃</small>' },
];

// 顶部因果链：[起始时间, 当前环节]
const CHAIN = [[4.2, 1], [6.3, 2], [9.5, 3], [15.3, 5], [19.5, 6], [23.5, 7], [29.6, 8]];

export function createFilm(view, dom) {
  const cam = view.camera;
  const P = new THREE.Vector3(), L = new THREE.Vector3(), v = new THREE.Vector3();
  const labelEls = new Map();
  const svgNS = 'http://www.w3.org/2000/svg';
  for (const l of LABELS) {
    const el = document.createElement('div'); el.className = 'lbl' + (l.cls ? ' ' + l.cls : ''); el.innerHTML = l.html; dom.labels.appendChild(el);
    const line = document.createElementNS(svgNS, 'line'), dot = document.createElementNS(svgNS, 'circle'); dot.setAttribute('r', '3.2'); dom.leaders.append(line, dot);
    labelEls.set(l.id, { el, line, dot, hot: 0 });
  }
  const chainSpans = [...dom.chain.querySelectorAll('span')];
  let capIdx = -2, queue = [], chainPulse = 0, lastT = 0;

  function setCamera(T) {
    let shot = SHOTS[0]; for (const s of SHOTS) if (T >= s.t0) shot = s;
    const k = shot.keys; let i = 0; while (i < k.length - 2 && T > k[i + 1].t) i++;
    const a = k[i], b = k[i + 1]; const u = ease(Math.min(1, Math.max(0, (T - a.t) / (b.t - a.t))));
    // 首尾两个镜头用线性推进，避免停顿感
    const w = k.length === 2 ? Math.min(1, Math.max(0, (T - a.t) / (b.t - a.t))) : u; const e = k.length === 2 ? w * (2 - w) * 0.5 + w * 0.5 : u;
    P.set(lerp(a.p[0], b.p[0], e), lerp(a.p[1], b.p[1], e), lerp(a.p[2], b.p[2], e)); L.set(lerp(a.l[0], b.l[0], e), lerp(a.l[1], b.l[1], e), lerp(a.l[2], b.l[2], e));
    // 极轻微的呼吸感
    P.x += Math.sin(T * 0.7) * 0.012; P.y += Math.sin(T * 0.53 + 1) * 0.01;
    cam.position.copy(P); cam.lookAt(L); const f = lerp(a.f, b.f, e);
    { const d = P.distanceTo(L); const fg = shot.fog || [30, 80]; if (fg[0] > 20) view.setFog(fg[0], fg[1]); else view.setFog(d + fg[0], d + fg[1]); }
    const portrait = cam.aspect < 1.5 ? 1 + (1.5 - cam.aspect) * 0.55 : 1; // 窄屏时放宽视角，保证主体不被裁掉
    if (Math.abs(cam.fov - f * portrait) > 1e-3) { cam.fov = f * portrait; cam.updateProjectionMatrix(); }
    cam.updateMatrixWorld();
  }

  function update(T, dt, W, H) {
    setCamera(T);
    // ---- 外壳 / 木阁 / 屋顶的显隐 ----
    view.setShell(T < 29.5 ? 1 - ss(3.0, 3.95, T) : 0.2 * ss(29.5, 30.3, T));
    view.setFrame(T < 29.5 ? 1 - ss(3.0, 3.95, T) : ss(29.5, 30.3, T));
    view.setFacade(T < 20 ? 1 - ss(3.0, 3.95, T) : ss(22.9, 23.45, T));
    view.setFront(T < 20 ? 1 - ss(3.0, 3.95, T) : T < 29.5 ? ss(22.9, 23.45, T) : 0.2);
    view.setRoof(T < 20 ? 1 : T < 29.5 ? 0.14 : 0.14 + 0.86 * ss(29.5, 30.3, T));

    // ---- 标题 / 字幕 / 尾卡 ----
    dom.title.style.opacity = 1 - ss(3.2, 3.8, T);
    let ci = -1; for (let i = 0; i < CAPS.length; i++) if (T >= CAPS[i].t0 && T < CAPS[i].t1) ci = i;
    if (ci !== capIdx) { capIdx = ci; if (ci >= 0) { dom.capStep.textContent = CAPS[ci].step; dom.capText.innerHTML = CAPS[ci].html; dom.caption.style.opacity = 1; } else dom.caption.style.opacity = 0; }
    dom.endcard.style.opacity = ss(30.2, 31.2, T); dom.endcard.style.pointerEvents = T > 31 ? 'auto' : 'none';
    dom.replay.style.opacity = ss(32.4, 33.2, T);
    dom.note.style.opacity = T > 4.4 && T < 29.4 ? 1 : 0; dom.chain.style.opacity = T > 4.2 ? 1 : 0;
    let stage = 0; for (const [t, s] of CHAIN) if (T >= t) stage = s;
    chainPulse = Math.max(0, chainPulse - dt * 1.5);
    chainSpans.forEach((sp, i) => { const s = i + 1; const on = s === stage || stage === 8 || (s === 4 && chainPulse > 0 && stage >= 3); sp.className = on ? 'on' : s < stage ? 'done' : ''; });

    // ---- 定时高亮队列（由物理事件触发） ----
    for (let i = queue.length - 1; i >= 0; i--) if (T >= queue[i].t) { queue[i].fn(); queue.splice(i, 1); }

    // ---- 标注 ----
    for (const l of LABELS) {
      const o = labelEls.get(l.id); const a = ss(l.t0, l.t0 + 0.35, T) * (1 - ss(l.t1 - 0.3, l.t1, T));
      if (a <= 0.001) { if (o.vis) { o.el.style.opacity = 0; o.line.style.opacity = 0; o.dot.style.opacity = 0; o.vis = false; } continue; }
      o.vis = true; v.copy(view.anchors[l.a]()).project(cam);
      const x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H; const lx = x + l.ox * H, ly = y + l.oy * H;
      const bw = o.el.offsetWidth, bh = o.el.offsetHeight; const left = l.ox < 0 ? lx - bw : lx, top = ly - bh / 2;
      const cx = Math.min(W - bw - 6, Math.max(6, left)), cy = Math.min(H - bh - 6, Math.max(6, top));
      o.el.style.transform = `translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px)`; o.el.style.opacity = v.z < 1 ? a : 0;
      o.hot = Math.max(0, o.hot - dt * 1.1); o.el.classList.toggle('hot', o.hot > 0.05);
      const ex = l.ox < 0 ? cx + bw : cx, ey = cy + bh / 2;
      o.line.setAttribute('x1', x); o.line.setAttribute('y1', y); o.line.setAttribute('x2', ex); o.line.setAttribute('y2', ey); o.line.style.opacity = a * 0.9; o.dot.setAttribute('cx', x); o.dot.setAttribute('cy', y); o.dot.style.opacity = a;
    }
    lastT = T;
  }

  const hot = (id, v = 1) => { const o = labelEls.get(id); if (o) o.hot = v; };
  // 物理事件 → 画面提示
  function onEvent(e, T) {
    if (e.type === 'release') {
      view.glow.fork = 1; hot('e1'); hot('e0', 0.6);
      queue.push({ t: T + 0.14, fn: () => { view.glow.tiao = 1; hot('e2'); } }, { t: T + 0.28, fn: () => { view.glow.heng = 1; hot('e3'); } }, { t: T + 0.42, fn: () => { view.glow.tooth = 1; hot('e4'); } });
    } else if (e.type === 'clack') { view.glow.peg = 1; view.glow.tooth = Math.max(view.glow.tooth, 0.8); hot('e4', 0.8); hot('wheel', 0.8); hot('gA', 0.9); hot('gS', 0.9); hot('globe', 0.9); hot('armil', 0.9); hot('door', 0.9); chainPulse = 1; }
    else if (e.type === 'bellA') { view.glow.bellA = 1; hot('bellA'); }
    else if (e.type === 'bellB') { view.glow.bellB = 1; hot('bellB'); }
  }
  function reset() { queue = []; capIdx = -2; chainPulse = 0; for (const o of labelEls.values()) o.hot = 0; }
  return { update, onEvent, reset, shotAt: (T) => { let i = 0; SHOTS.forEach((s, k) => { if (T >= s.t0) i = k; }); return i; }, cuts: SHOTS.map((s) => s.t0).slice(1) };
}

// 影片时间轴：镜头、字幕、部件标注、动力链指示（镜头与字幕不受物理约束）
import * as THREE from 'three';
import { L } from './sim/machine.js';

const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

// 镜头关键帧：每个镜头 {t0,t1, pos:[起,止], look:[起,止]}
const SHOTS = [
  { t0: 0, t1: 4, pos: [v3(12.5, 7.5, 14.5), v3(9.5, 6.2, 11)], look: [v3(0, 5.8, 0), v3(0, 5.2, 0)] },
  { t0: 4, t1: 8.5, pos: [v3(0.6, 6.4, 5.4), v3(-0.2, 6.0, 4.7)], look: [v3(-0.7, 5.9, 0.42), v3(-0.5, 5.6, 0.42)] },
  { t0: 8.5, t1: 15, pos: [v3(1.7, 5.3, 4.7), v3(1.1, 4.9, 4.0)], look: [v3(-0.3, 5.1, 0.42), v3(-0.6, 4.8, 0.42)] },
  { t0: 15, t1: 19.5, pos: [v3(-0.1, 3.4, 5.1), v3(-0.6, 2.8, 4.4)], look: [v3(-0.8, 2.8, -0.2), v3(-0.6, 2.5, -0.35)] },
  { t0: 19.5, t1: 24.5, pos: [v3(3.7, 6.9, 5.3), v3(3.9, 10.3, 5.7)], look: [v3(0, 6.8, 0), v3(0, 10.4, 0)] },
  { t0: 24.5, t1: 30.5, pos: [v3(2.7, 2.1, 4.7), v3(1.9, 1.7, 3.7)], look: [v3(1.0, 1.5, 0.8), v3(1.0, 1.5, 1.0)] },
];

// 字幕（画面为主、文字为辅）
const SUBS = [
  { t0: 0.6, t1: 3.8, text: '一千年前，中国人造了一座靠水报时的天文钟塔' },
  { t0: 4.3, t1: 8.2, text: '水被提上高台，平水壶稳住水位，渴乌流出恒定水流' },
  { t0: 8.6, t1: 12.0, text: '水注满计量斗，重量压倒天衡——杠杆倾翻，放行一格' },
  { t0: 12.2, t1: 14.8, text: '枢轮每转一格恰十度，再被锁住，如此一步步均匀前行' },
  { t0: 15.2, t1: 19.2, text: '轮轴带动齿轮逐级减速，把步进变成均匀的慢转' },
  { t0: 19.7, t1: 24.2, text: '同一根天柱，上带浑仪巡天、中带浑象转星，一日一周' },
  { t0: 24.7, t1: 28.2, text: '机轮拨动木人，举牌、击钟、敲鼓，按时报时' },
  { t0: 28.4, t1: 31.5, text: '不靠发条，不靠电——水，就是它的心脏' },
];

// 部件标注（3D 锚点 -> 屏幕）
const LABELS = [
  { t0: 4.3, t1: 8.2, text: '天池', p: v3(L.tianchi.x, L.tianchi.y + 0.3, L.tianchi.z) },
  { t0: 4.3, t1: 8.2, text: '平水壶', p: v3(L.pinghu.x, L.pinghu.y + 0.25, L.pinghu.z) },
  { t0: 5.5, t1: 8.2, text: '渴乌', p: v3(L.nozzle.x, L.nozzle.y + 0.1, L.nozzle.z) },
  { t0: 8.6, t1: 14.8, text: '天衡', p: v3(L.p1.x + 0.3, L.p1.y + 0.2, L.p1.z) },
  { t0: 8.6, t1: 14.8, text: '受水壶', p: v3(L.wheelC.x + 0.9, L.wheelC.y + 1.3, L.wheelC.z) },
  { t0: 10.5, t1: 14.8, text: '枢轮', p: v3(L.wheelC.x - 1.2, L.wheelC.y - 0.8, L.wheelC.z) },
  { t0: 15.2, t1: 19.2, text: '传动齿轮', p: v3(L.gear2C.x + 0.5, L.gear2C.y, L.gear2C.z) },
  { t0: 16.5, t1: 19.2, text: '天柱', p: v3(0.15, 4.5, 0) },
  { t0: 19.7, t1: 22.0, text: '浑象', p: v3(0.9, L.globeY, 0) },
  { t0: 22.0, t1: 24.2, text: '浑仪', p: v3(0.9, L.armilY, 0) },
  { t0: 24.7, t1: 28.2, text: '报时木人', p: v3(L.carouselC.x, 1.9, L.carouselC.z + 1.0) },
  { t0: 25.5, t1: 28.2, text: '钟', p: v3(L.bell.x + 0.2, L.bell.y + 0.2, L.bell.z) },
];

const CHAIN = ['水', '擒纵', '齿轮', '仪象', '报时'];
const CHAIN_SHOT = [0, 0, 1, 1, 2, 3, 4, 4]; // 各字幕段对应的动力链环节

export function createFilm(camera, dom) {
  const { subtitle, title, endcard, labels, chain, hint } = dom;
  // 动力链指示
  chain.innerHTML = '';
  const chainEls = CHAIN.map((c, i) => {
    const el = document.createElement('div');
    el.className = 'chain-step';
    el.innerHTML = `<span class="chain-dot"></span><span>${c}</span>`;
    chain.appendChild(el);
    if (i < CHAIN.length - 1) {
      const ar = document.createElement('div');
      ar.className = 'chain-arrow'; ar.textContent = '›';
      chain.appendChild(ar);
    }
    return el;
  });
  // 标注元素池
  const labelEls = LABELS.map((lb) => {
    const el = document.createElement('div');
    el.className = 'label';
    el.innerHTML = `<span class="label-dot"></span><span class="label-text">${lb.text}</span>`;
    labels.appendChild(el);
    return el;
  });

  const proj = new THREE.Vector3();
  let curSub = -1;

  function update(t, w, h) {
    // 镜头
    let shot = SHOTS[0];
    for (const s of SHOTS) if (t >= s.t0 && t < s.t1) { shot = s; break; }
    if (t >= SHOTS[SHOTS.length - 1].t1) shot = SHOTS[SHOTS.length - 1];
    const u = smooth(Math.min(1, Math.max(0, (t - shot.t0) / (shot.t1 - shot.t0))));
    camera.position.lerpVectors(shot.pos[0], shot.pos[1], u);
    const look = new THREE.Vector3().lerpVectors(shot.look[0], shot.look[1], u);
    camera.lookAt(look);

    // 标题 / 片尾
    title.style.opacity = (t < 3.6) ? String(Math.min(1, t / 0.8) * (t > 3.0 ? (3.6 - t) / 0.6 : 1)) : '0';
    endcard.style.opacity = t > 28.6 ? String(Math.min(1, (t - 28.6) / 0.8)) : '0';

    // 字幕
    let si = -1;
    for (let i = 0; i < SUBS.length; i++) if (t >= SUBS[i].t0 && t < SUBS[i].t1) { si = i; break; }
    if (si !== curSub) {
      curSub = si;
      if (si >= 0 && t < 28.5) { subtitle.textContent = SUBS[si].text; subtitle.classList.add('show'); }
      else subtitle.classList.remove('show');
      const ci = si >= 0 ? CHAIN_SHOT[si] : -1;
      chainEls.forEach((el, i) => el.classList.toggle('active', i === ci));
      chain.style.opacity = (t > 3.8 && t < 28.4) ? '1' : '0';
    }

    // 标注投影
    for (let i = 0; i < LABELS.length; i++) {
      const lb = LABELS[i], el = labelEls[i];
      if (t < lb.t0 || t > lb.t1) { el.style.opacity = '0'; continue; }
      proj.copy(lb.p).project(camera);
      if (proj.z > 1) { el.style.opacity = '0'; continue; }
      const x = (proj.x * 0.5 + 0.5) * w, y = (-proj.y * 0.5 + 0.5) * h;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      const fade = Math.min(1, (t - lb.t0) / 0.4, (lb.t1 - t) / 0.4);
      el.style.opacity = String(Math.max(0, fade));
    }

    hint.style.opacity = t < 4 ? '1' : '0';
  }

  return { update };
}

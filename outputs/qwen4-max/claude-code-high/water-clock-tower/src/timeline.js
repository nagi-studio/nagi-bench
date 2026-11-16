// ---------------------------------------------------------------------------
// 影片层:镜头、字幕、3D 标注、片头片尾(呈现层,不受物理约束)。
// ---------------------------------------------------------------------------
import * as THREE from 'three';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const smooth = (t) => t * t * (3 - 2 * t);

export const FILM_LEN = 32;

const shots = [
  { // 0 全景
    t0: 0, t1: 4.5, fov: 46,
    keys: [
      { u: 0, pos: V3(8.8, 5.5, 11.0), tgt: V3(0, 5.0, 0) },
      { u: 1, pos: V3(7.2, 5.2, 9.4), tgt: V3(0, 5.2, 0) },
    ],
  },
  { // 1 水路(机内视角)
    t0: 4.5, t1: 9, fov: 50,
    keys: [
      { u: 0, pos: V3(1.7, 6.6, 2.5), tgt: V3(2.2, 6.8, -1.0) },
      { u: 0.5, pos: V3(2.2, 5.6, 2.4), tgt: V3(1.5, 5.0, 0.2) },
      { u: 1, pos: V3(2.2, 5.2, 2.3), tgt: V3(0.8, 4.6, 0.1) },
    ],
  },
  { // 2 擒纵(机内视角)
    t0: 9, t1: 15.5, fov: 50,
    keys: [
      { u: 0, pos: V3(-1.1, 5.35, 1.35), tgt: V3(0.35, 4.3, 0.0) },
      { u: 1, pos: V3(-0.95, 5.2, 1.2), tgt: V3(0.35, 4.25, 0.0) },
    ],
  },
  { // 3 传动 → 台顶
    t0: 15.5, t1: 21, fov: 46,
    keys: [
      { u: 0, pos: V3(0.8, 2.5, 3.6), tgt: V3(0, 2.3, -1.2) },
      { u: 0.32, pos: V3(1.6, 3.4, 2.4), tgt: V3(0, 3.4, -1.8) },
      { u: 0.58, pos: V3(1.7, 6.5, 2.0), tgt: V3(0, 6.1, -0.5) },
      { u: 0.8, pos: V3(1.6, 9.6, 1.8), tgt: V3(0, 8.9, -0.3) },
      { u: 1, pos: V3(2.2, 10.2, 3.4), tgt: V3(0, 8.9, -0.1) },
    ],
  },
  { // 4 木阁报时
    t0: 21, t1: 27, fov: 40,
    keys: [
      { u: 0, pos: V3(0.6, 6.15, 7.4), tgt: V3(0.3, 5.7, 2.9) },
      { u: 1, pos: V3(0.2, 5.95, 5.5), tgt: V3(0.4, 5.5, 2.95) },
    ],
  },
  { // 5 尾声全景
    t0: 27, t1: 32, fov: 46,
    keys: [
      { u: 0, pos: V3(7.6, 4.9, 10.6), tgt: V3(0, 5.2, 0) },
      { u: 1, pos: V3(10.4, 6.6, 13.8), tgt: V3(0, 5.7, 0) },
    ],
  },
];

const captions = [
  { t0: 1.0, t1: 4.4, html: '它不用人力 —— 只靠一壶清水,就能<em>追星、报时</em>。' },
  { t0: 4.8, t1: 8.9, html: '<em>天池</em>供水,<em>平水壶</em>溢流稳位:水流永远均匀,注入枢轮顶部的<em>受水壶</em>。' },
  { t0: 9.3, t1: 12.5, html: '壶水渐满,<em>重量压下天衡</em> —— 锁扣「天关」开启。' },
  { t0: 12.7, t1: 15.4, html: '枢轮恰好转过一壶,随即被擒住。<em>擒纵机构</em>把水流切成等时的节拍。', note: '史实:约每刻钟转一壶 · 影片时间已压缩' },
  { t0: 15.8, t1: 18.3, html: '轮轴<em>齿轮</em>逐级传动,把节拍沿「天梯」立轴送上台顶。' },
  { t0: 18.5, t1: 20.9, html: '<em>浑象</em>同步演示星空,<em>浑仪</em>窥管追随天球 —— 与天同行。' },
  { t0: 21.3, t1: 24.2, html: '枢轮每进一步,木阁轮转,<em>木人</em>依次当值。' },
  { t0: 24.4, t1: 26.9, html: '<em>每刻击鼓,时正撞钟</em> —— 无需人力的自动报时。' },
  { t0: 27.3, t1: 30.2, html: '一座塔,把<em>水力、天文与时间</em>,连成一台机器。' },
];

const labelDefs = [
  { key: 'skyTank', text: '天池', t0: 5.0, t1: 8.9 },
  { key: 'tank', text: '平水壶', t0: 5.4, t1: 8.9 },
  { key: 'bucket', text: '受水壶', t0: 6.2, t1: 8.9 },
  { key: 'lever', text: '天衡', t0: 9.4, t1: 15.3 },
  { key: 'weight', text: '天权(配重)', t0: 9.8, t1: 12.5 },
  { key: 'wheel', text: '枢轮', t0: 12.8, t1: 15.3 },
  { key: 'gear', text: '传动齿轮', t0: 15.9, t1: 18.3 },
  { key: 'vert', text: '天梯 · 立轴', t0: 16.6, t1: 18.3 },
  { key: 'globe', text: '浑象', t0: 18.6, t1: 20.9 },
  { key: 'armillary', text: '浑仪', t0: 19.2, t1: 20.9 },
  { key: 'carousel', text: '木阁 · 木人轮', t0: 21.4, t1: 26.8 },
  { key: 'drum', text: '鼓 · 报刻', t0: 22.4, t1: 26.8 },
  { key: 'bell', text: '钟 · 报时', t0: 24.6, t1: 26.8 },
];

export function createTimeline(camera, anchors) {
  const $ = (id) => document.getElementById(id);
  const titleEl = $('title-card'), subEl = $('subtitle'), noteEl = $('subnote');
  const endEl = $('end-card'), progEl = $('progress-fill');
  const labelsWrap = $('labels');
  const labelEls = labelDefs.map((d) => {
    const el = document.createElement('div');
    el.className = 'label3d';
    el.innerHTML = `<span>${d.text}</span><span class="lead"></span><span class="dot"></span>`;
    labelsWrap.appendChild(el);
    return { d, el, anchor: anchors[d.key] };
  });

  const tmp = new THREE.Vector3();
  const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3();
  let curShot = -1, curCap = -1;

  const shotAt = (t) => {
    for (let i = shots.length - 1; i >= 0; i--) if (t >= shots[i].t0) return i;
    return 0;
  };

  const update = (t, w, h) => {
    const si = shotAt(Math.min(t, FILM_LEN - 0.001));
    const s = shots[si];
    const u = Math.min(1, Math.max(0, (t - s.t0) / (s.t1 - s.t0)));
    // 关键帧插值
    let a = s.keys[0], b = s.keys[s.keys.length - 1];
    for (let i = 0; i < s.keys.length - 1; i++) {
      if (u >= s.keys[i].u && u <= s.keys[i + 1].u) { a = s.keys[i]; b = s.keys[i + 1]; break; }
    }
    const lu = smooth((u - a.u) / Math.max(1e-5, b.u - a.u));
    camPos.lerpVectors(a.pos, b.pos, lu);
    camTgt.lerpVectors(a.tgt, b.tgt, lu);
    // 轻微呼吸感
    camPos.x += Math.sin(t * 0.5) * 0.04;
    camPos.y += Math.sin(t * 0.37 + 1.3) * 0.035;
    camera.position.copy(camPos);
    camera.lookAt(camTgt);
    if (camera.fov !== s.fov) { camera.fov = s.fov; camera.updateProjectionMatrix(); }

    // 片头 / 片尾
    titleEl.classList.toggle('show', t > 0.15 && t < 4.2);
    endEl.classList.toggle('show', t > 28.4);
    progEl.style.width = `${Math.min(100, (t / FILM_LEN) * 100)}%`;

    // 字幕
    let ci = -1;
    if (t < 28.4) for (let i = 0; i < captions.length; i++) if (t >= captions[i].t0 && t <= captions[i].t1) { ci = i; break; }
    if (ci !== curCap) {
      curCap = ci;
      if (ci >= 0) {
        subEl.innerHTML = captions[ci].html;
        subEl.classList.add('show');
        noteEl.textContent = captions[ci].note || '';
        noteEl.classList.toggle('show', !!captions[ci].note);
      } else {
        subEl.classList.remove('show');
        noteEl.classList.remove('show');
      }
    }

    // 3D 标注
    for (const { d, el, anchor } of labelEls) {
      const on = t >= d.t0 && t <= d.t1 && anchor;
      if (!on) { el.classList.remove('show'); continue; }
      tmp.copy(anchor).project(camera);
      if (tmp.z > 1 || Math.abs(tmp.x) > 1.05 || Math.abs(tmp.y) > 1.05) { el.classList.remove('show'); continue; }
      el.style.left = `${(tmp.x + 1) / 2 * w}px`;
      el.style.top = `${(1 - tmp.y) / 2 * h}px`;
      el.classList.add('show');
    }
    return si;
  };

  return { update, get shot() { return curShot; }, shotAt };
}

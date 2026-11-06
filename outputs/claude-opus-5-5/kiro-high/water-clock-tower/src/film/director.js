// 导演：按时间驱动镜头、字幕、标签与传动链指示
import * as THREE from 'three';
import { SHOTS, CHAIN, FILM_LENGTH } from './script.js';

const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const smooth = (x) => {
  const u = Math.min(1, Math.max(0, x));
  return u * u * (3 - 2 * u);
};

function lerpPath(keys, u, out, field) {
  // 多关键帧：分段 Catmull-Rom
  const n = keys.length - 1;
  const x = Math.min(0.99999, Math.max(0, u)) * n;
  const i = Math.floor(x);
  const f = x - i;
  const p0 = keys[Math.max(0, i - 1)][field];
  const p1 = keys[i][field];
  const p2 = keys[Math.min(n, i + 1)][field];
  const p3 = keys[Math.min(n, i + 2)][field];
  const t = f;
  for (let k = 0; k < 3; k++) {
    const a = p0[k];
    const b = p1[k];
    const c = p2[k];
    const d = p3[k];
    out.setComponent(k, 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t));
  }
  return out;
}

export class Director {
  constructor(camera, dom, anchors) {
    this.camera = camera;
    this.dom = dom;
    this.anchors = anchors;
    this.target = new THREE.Vector3();
    this.tmp = new THREE.Vector3();
    this.shotIndex = -1;
    this.enabled = true;
    this.labelEls = new Map();
    this.activity = {};
    // 传动链
    dom.chain.innerHTML = '';
    this.chainEls = CHAIN.map((name, i) => {
      const el = document.createElement('span');
      el.className = 'node';
      el.textContent = name;
      dom.chain.appendChild(el);
      if (i < CHAIN.length - 1) {
        const ar = document.createElement('span');
        ar.className = 'arrow';
        ar.textContent = '→';
        dom.chain.appendChild(ar);
      }
      return el;
    });
  }

  shotAt(t) {
    for (let i = 0; i < SHOTS.length; i++) if (t < SHOTS[i].t1) return i;
    return SHOTS.length - 1;
  }

  setActivity(a) {
    this.activity = a;
  }

  update(t, realDt) {
    const i = this.shotIndex === -1 ? this.shotAt(t) : this.shotAt(t);
    const shot = SHOTS[i];
    if (i !== this.shotIndex) {
      this.enterShot(i);
    }
    const u = Math.min(1, Math.max(0, (t - shot.t0) / (shot.t1 - shot.t0)));
    if (this.enabled) {
      const e = ease(u);
      lerpPath(shot.cam, e, this.camera.position, 'p');
      lerpPath(shot.cam, e, this.target, 't');
      // 轻微的手持感
      const w = 0.012;
      this.camera.position.x += Math.sin(t * 0.9) * w;
      this.camera.position.y += Math.sin(t * 1.3 + 1) * w * 0.7;
      this.camera.lookAt(this.target);
    }
    // 切换时的黑场过渡
    const edge = Math.min(t - shot.t0, shot.t1 - t);
    let fade = 0;
    if (i > 0 && t - shot.t0 < 0.3) fade = 1 - smooth((t - shot.t0) / 0.3);
    if (i < SHOTS.length - 1 && shot.t1 - t < 0.22) fade = Math.max(fade, smooth(1 - (shot.t1 - t) / 0.22));
    if (t < 0.6) fade = Math.max(fade, 1 - smooth(t / 0.6));
    void edge;
    this.dom.fade.style.opacity = (fade * 0.92).toFixed(3);

    // 标题
    if (shot.title) {
      const a = smooth(Math.min(1, (t - 0.5) / 0.8)) * (1 - smooth(Math.max(0, (t - (shot.t1 - 0.6)) / 0.5)));
      this.dom.title.style.opacity = a.toFixed(3);
      this.dom.title.style.transform = `translate(-50%, -50%) translateY(${(1 - a) * 12}px)`;
    } else this.dom.title.style.opacity = '0';

    // 字幕
    if (shot.caption) {
      const a = smooth(Math.min(1, (t - shot.t0 - 0.25) / 0.45)) * (1 - smooth(Math.max(0, (t - (shot.t1 - 0.35)) / 0.3)));
      this.dom.caption.style.opacity = a.toFixed(3);
    } else this.dom.caption.style.opacity = '0';

    // 结尾回顾
    if (shot.recap) {
      const a = smooth(Math.min(1, (t - shot.t0 - 0.3) / 0.8));
      this.dom.recap.style.opacity = a.toFixed(3);
    } else this.dom.recap.style.opacity = '0';

    // 传动链
    const chainVis = shot.chain && shot.chain.length ? 1 : 0;
    this.dom.chain.style.opacity = String(chainVis * (t > 4.9 ? 1 : 0));

    this.updateLabels(shot, t);
    return { shot, u, done: t >= FILM_LENGTH };
  }

  enterShot(i) {
    this.shotIndex = i;
    const shot = SHOTS[i];
    if (shot.caption) {
      this.dom.capStep.textContent = shot.step || '';
      this.dom.capHead.textContent = shot.caption.head;
      this.dom.capBody.textContent = shot.caption.body;
    }
    this.chainEls.forEach((el, k) => {
      el.classList.toggle('on', shot.chain.includes(k));
      el.classList.toggle('past', !shot.chain.includes(k) && shot.chain.length > 0 && k < Math.min(...shot.chain));
    });
    // 标签
    const wanted = new Set(shot.labels.map((l) => l[0]));
    for (const [k, el] of this.labelEls) {
      if (!wanted.has(k)) {
        el.classList.remove('show');
      }
    }
    shot.labels.forEach(([key, text], idx) => {
      let el = this.labelEls.get(key);
      if (!el) {
        el = document.createElement('div');
        el.className = 'label';
        el.innerHTML = '<span class="dot"></span><span class="txt"></span>';
        this.dom.labels.appendChild(el);
        this.labelEls.set(key, el);
      }
      el.querySelector('.txt').textContent = text;
      el.dataset.delay = String(idx * 0.18 + (shot.labelFrom || 0.5));
      el.dataset.shot = String(i);
    });
  }

  updateLabels(shot, t) {
    const cam = this.camera;
    const w = this.dom.labels.clientWidth;
    const h = this.dom.labels.clientHeight;
    for (const [key, el] of this.labelEls) {
      const inShot = shot.labels.some((l) => l[0] === key) && el.dataset.shot === String(this.shotIndex);
      const a = this.anchors[key];
      if (!a) continue;
      const delay = Number(el.dataset.delay || 0);
      const visible = this.enabled && inShot && t - shot.t0 > delay && shot.t1 - t > 0.3;
      this.tmp.set(a[0], a[1], a[2]).project(cam);
      const behind = this.tmp.z > 1;
      el.classList.toggle('show', visible && !behind);
      const x = (this.tmp.x * 0.5 + 0.5) * w;
      const y = (-this.tmp.y * 0.5 + 0.5) * h;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      const act = this.activity[key] || 0;
      el.classList.toggle('active', act > 0.5);
    }
  }

  hideAll() {
    this.dom.caption.style.opacity = '0';
    this.dom.title.style.opacity = '0';
    this.dom.recap.style.opacity = '0';
    this.dom.chain.style.opacity = '0';
    this.dom.fade.style.opacity = '0';
    for (const el of this.labelEls.values()) el.classList.remove('show');
  }
}

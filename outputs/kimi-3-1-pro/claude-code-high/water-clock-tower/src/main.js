import './style.css';
import { ClockPhysics } from './physics.js';
import { ClockScene } from './scene.js';
import { ProceduralAudio } from './audio.js';

const app = document.querySelector('#app');
app.innerHTML = `
  <main class="film" aria-label="苏颂水运仪象台三维科普短片">
    <div id="viewport" class="viewport"></div>
    <div class="vignette"></div>
    <header class="topbar">
      <div class="brand">
        <span class="seal">宋</span>
        <span><b>水运仪象台</b><small>SU SONG · 1088</small></span>
      </div>
      <div class="physics-badge"><i></i> 实时刚体物理</div>
      <button id="sound" class="icon-button" aria-label="开启声音">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5-1.5a6 6 0 010 9M19 5a10 10 0 010 14"/></svg>
        <span>开启声音</span>
      </button>
    </header>

    <section id="intro" class="intro overlay-panel">
      <div class="eyebrow"><span></span> 北宋 · 元祐三年（1088）</div>
      <h1>以水，<br>度量星辰<span class="title-dot">。</span></h1>
      <div class="intro-name">苏颂 · 水运仪象台</div>
      <p>不靠发条，也能计时、观象、报时。</p>
      <div class="duration">30 秒，看懂水如何变成时间 <span>↘</span></div>
    </section>

    <section id="chapter" class="chapter overlay-panel" aria-live="polite">
      <div id="chapter-number" class="chapter-number">01</div>
      <div class="eyebrow"><span></span><b id="chapter-kicker">动力</b></div>
      <h2 id="chapter-title"></h2>
      <p id="chapter-copy"></p>
      <div id="escape-status" class="escape-status"><i></i><span>锁住</span><small>水重正在蓄力</small></div>
      <div id="bell-toast" class="bell-toast">当 —— <small>一次真实的钟锤碰撞</small></div>
    </section>

    <section id="finale" class="finale overlay-panel">
      <div class="eyebrow"><span></span> 一座塔，一条因果链</div>
      <h2>水给动力，<br>擒纵给时间。</h2>
      <div class="causal-chain">
        <div><b>水轮</b><small>水的重量</small></div><i>→</i>
        <div><b>枢衡</b><small>一斗一放</small></div><i>→</i>
        <div><b>齿轮</b><small>传递节拍</small></div><i>→</i>
        <div><b>浑象 · 钟</b><small>观象与报时</small></div>
      </div>
      <p>从一滴水，到一声钟。<br>九百多年前，机械、天文与时间已在这座塔中相遇。</p>
      <button id="replay" class="replay-button">↻ 再看一遍</button>
    </section>

    <div id="labels" class="labels" aria-hidden="true"></div>
    <div class="side-note">结构示意 · 报时间隔经压缩</div>
    <footer class="timeline-wrap">
      <div class="chapter-dots">
        <span data-chapter="1">01 水力</span><span data-chapter="2">02 擒纵</span><span data-chapter="3">03 传动</span><span data-chapter="4">04 报时</span><span data-chapter="5">05 周天</span>
      </div>
      <div class="timeline"><div id="progress"></div></div>
      <div class="timecode"><span id="timecode">00:00</span><em>/</em>00:30</div>
    </footer>
    <div id="end-mark" class="end-mark">FIN · 以水度量星辰</div>
  </main>
`;

const chapters = [
  { start: 0, end: 4 },
  {
    start: 4, end: 9.5, number: '01', kicker: '动力 · POWER',
    title: '水，给出力量',
    copy: '平水壶保持恒定水位。稳定水流注入受水斗，水的重量让轮子获得转矩。',
  },
  {
    start: 9.5, end: 15.5, number: '02', kicker: '擒纵 · ESCAPEMENT',
    title: '把水流，切成节拍',
    copy: '水轮想转，枢衡先锁住。水重推动枢衡到释放点：放开一斗，下一齿立刻再锁住。',
  },
  {
    start: 15.5, end: 21, number: '03', kicker: '传动 · TRANSMISSION',
    title: '节拍，沿齿轮上传',
    copy: '每组 12 齿带动 24 齿，转速逐级减半。立轴上传同一节拍，再减速带动塔顶浑象。',
  },
  {
    start: 21, end: 27, number: '04', kicker: '报时 · TIME SIGNAL',
    title: '到点，木人击钟',
    copy: '传动轴上的凸轮顶起木人手臂；凸轮越过，弹簧让钟锤回摆，撞钟报时。',
  },
  { start: 27, end: 30 },
];

const audio = new ProceduralAudio();
let scene;
let filmLive = false;
const physics = new ClockPhysics({
  onTick: () => { if (filmLive) audio.tick(); },
  onBell: (strength) => {
    if (!filmLive) return;
    audio.bell(strength);
    scene?.notifyBell();
  },
});
// A time deep-link is also useful for classroom presentations and inspection.
const urlParams = new URLSearchParams(window.location.search);
const requestedTime = Number(urlParams.get('t'));
const freezeFrame = urlParams.get('freeze') === '1';
if (freezeFrame) document.body.classList.add('inspection');
const initialFilmTime = Number.isFinite(requestedTime) && requestedTime >= 0
  ? Math.min(30, requestedTime)
  : 0;
// Pre-roll is simulated, not animated: the first visible frame already has
// water in the scoops and the whole transmission is under load.
for (let i = 0; i < 180 + Math.round(initialFilmTime * 90); i++) physics.advance(1 / 90);
scene = new ClockScene(document.querySelector('#viewport'), physics);
filmLive = true;

const intro = document.querySelector('#intro');
const chapter = document.querySelector('#chapter');
const finale = document.querySelector('#finale');
const progress = document.querySelector('#progress');
const timecode = document.querySelector('#timecode');
const escapeStatus = document.querySelector('#escape-status');
const bellToast = document.querySelector('#bell-toast');
const soundButton = document.querySelector('#sound');
let currentChapter = -1;

function chapterAt(time) {
  for (let i = chapters.length - 1; i >= 0; i--) if (time >= chapters[i].start) return i;
  return 0;
}

function setChapter(index) {
  if (index === currentChapter) return;
  currentChapter = index;
  intro.classList.toggle('visible', index === 0);
  finale.classList.toggle('visible', index === 5);
  chapter.classList.toggle('visible', index >= 1 && index <= 4);
  chapter.dataset.escape = index === 2 ? 'true' : 'false';
  if (index >= 1 && index <= 4) {
    const data = chapters[index];
    document.querySelector('#chapter-number').textContent = data.number;
    document.querySelector('#chapter-kicker').textContent = data.kicker;
    document.querySelector('#chapter-title').textContent = data.title;
    document.querySelector('#chapter-copy').textContent = data.copy;
    chapter.classList.remove('enter');
    void chapter.offsetWidth;
    chapter.classList.add('enter');
  }
  document.querySelectorAll('.chapter-dots span').forEach((dot, i) => {
    dot.classList.toggle('active', i + 1 === index || (index === 5));
    dot.classList.toggle('passed', i + 1 < index || index === 5);
  });
}

const labelDefinitions = [
  { chapter: 1, text: '平水壶', sub: '恒定水位 · 稳定流量', point: [-3.35, 7.25, 0.25] },
  { chapter: 1, text: '受水斗', sub: '水重 → 轮轴转矩', point: [-3.45, 4.45, 0.55] },
  { chapter: 2, text: '枢衡', sub: '左右交替 · 停与放', body: () => physics.anchor, offset: [0.2, 0.30, 0] },
  { chapter: 2, text: '一齿，也是一斗', sub: '每次只前进 1 / 12 圈', point: [-3.55, 4.85, 0.85] },
  { chapter: 3, text: '12 : 24', sub: '每组转速减半', body: () => physics.gearC, offset: [0.3, -0.6, 0.5] },
  { chapter: 3, text: '立轴', sub: '把节拍送向塔顶', point: [1.0, 7.0, 0.15] },
  { chapter: 3, text: '浑象', sub: '同步演示周天', point: [1.15, 9.75, 0.2] },
  { chapter: 4, text: '报时凸轮', sub: '顶起 → 越过 → 释放', body: () => physics.gearD, offset: [0.0, -0.8, 0.55] },
  { chapter: 4, text: '木人钟锤', sub: '弹簧回位', body: () => physics.striker, offset: [0.2, 0.45, 0] },
];
const labelRoot = document.querySelector('#labels');
for (const definition of labelDefinitions) {
  const element = document.createElement('div');
  element.className = 'scene-label';
  element.innerHTML = `<i></i><span></span><div class="label-card"><b>${definition.text}</b><small>${definition.sub}</small></div>`;
  labelRoot.appendChild(element);
  definition.element = element;
}

function updateLabels() {
  for (const definition of labelDefinitions) {
    let point = definition.point;
    if (definition.body) {
      const body = definition.body();
      point = [body.position.x + definition.offset[0], body.position.y + definition.offset[1], body.position.z + definition.offset[2]];
    }
    const projected = scene.project(point);
    const visible = currentChapter === definition.chapter && projected.visible
      && projected.x > 20 && projected.x < window.innerWidth - 120
      && projected.y > 80 && projected.y < window.innerHeight - 110;
    definition.element.classList.toggle('visible', visible);
    if (visible) definition.element.style.transform = `translate3d(${projected.x}px, ${projected.y}px, 0)`;
  }
}

function updateSoundButton() {
  const text = !audio.enabled ? '开启声音' : audio.muted ? '声音已关' : '声音已开';
  soundButton.querySelector('span').textContent = text;
  soundButton.classList.toggle('on', audio.enabled && !audio.muted);
  soundButton.setAttribute('aria-label', text);
}

async function enableAudio() {
  try { await audio.enable(); } catch { /* Autoplay policies can require a direct gesture. */ }
  updateSoundButton();
}
soundButton.addEventListener('click', async (event) => {
  event.stopPropagation();
  if (!audio.enabled) await enableAudio();
  else { audio.toggleMute(); updateSoundButton(); }
});
document.addEventListener('pointerdown', enableAudio, { once: true });
document.querySelector('#replay').addEventListener('click', () => window.location.reload());

window.addEventListener('resize', () => scene.resize());
scene.updateCamera(initialFilmTime);
scene.sync();
scene.render();
setChapter(chapterAt(initialFilmTime));
enableAudio();

let start = performance.now() - initialFilmTime * 1000;
let previous = performance.now();
let filmTime = initialFilmTime;
let ended = false;
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) hiddenAt = performance.now();
  else if (hiddenAt) {
    const now = performance.now();
    start += now - hiddenAt;
    previous = now;
    hiddenAt = 0;
  }
});
function frame(now) {
  const delta = freezeFrame ? 0 : Math.min(1.0, Math.max(0, (now - previous) / 1000));
  previous = now;
  filmTime = freezeFrame ? initialFilmTime : Math.min(30, (now - start) / 1000);
  const time = filmTime;
  if (!document.hidden && !ended) physics.advance(delta);
  scene.sync();
  scene.updateEffects(delta);
  scene.updateCamera(time);
  setChapter(chapterAt(time));
  updateLabels();
  audio.update(time);
  progress.style.width = `${time / 30 * 100}%`;
  const seconds = Math.min(30, Math.floor(time));
  timecode.textContent = `00:${String(seconds).padStart(2, '0')}`;
  escapeStatus.classList.toggle('released', physics.released);
  escapeStatus.querySelector('span').textContent = physics.released ? '放行' : '锁住';
  escapeStatus.querySelector('small').textContent = physics.released ? '这一斗正在通过' : `已走过 ${physics.lastTooth} 斗`;
  bellToast.classList.toggle('visible', currentChapter === 4 && physics.time - physics.lastBellAt < 1.25);
  if (time >= 30 && !ended) {
    ended = true;
    document.querySelector('#end-mark').classList.add('visible');
  }
  scene.render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Read-only diagnostics make the physical, rather than keyframed, motion easy
// to verify in an offline browser.
window.__waterClock = {
  ready: true,
  physics,
  getDiagnostics: () => ({ filmTime, ...physics.getDiagnostics() }),
  renderInfo: () => ({ ...scene.renderer.info.render, softwareRenderer: scene.softwareRenderer }),
};

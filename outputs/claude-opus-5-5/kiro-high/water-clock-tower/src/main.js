// 水运仪象台 —— 30 秒 3D 科普短片
// 渲染：three.js；物理：cannon-es（所有机械运动均由物理引擎实时演算）；声音：Web Audio 实时合成。
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createSimulation } from './sim/physics.js';
import { DT, LEVER } from './sim/layout.js';
import { buildWorld } from './scene/world.js';
import { Director } from './film/director.js';
import { FILM_LENGTH } from './film/script.js';
import { AudioEngine } from './audio/audio.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);

// ---------------- 渲染器 ----------------
const canvas = $('view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: params.has('capture') });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070b18);
scene.fog = new THREE.FogExp2(0x0a1022, 0.022);
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.05, 300);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.32, 0.5, 0.9);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------------- 仿真与场景 ----------------
let sim = createSimulation();
const world = buildWorld(scene, sim);
const dom = {
  fade: $('fade'),
  labels: $('labels'),
  chain: $('chain'),
  title: $('title'),
  caption: $('caption'),
  capStep: document.querySelector('#caption .step'),
  capHead: document.querySelector('#caption .head'),
  capBody: document.querySelector('#caption .body'),
  recap: $('recap'),
};
const director = new Director(camera, dom, world.anchors);
const audio = new AudioEngine();

const controls = new OrbitControls(camera, canvas);
controls.enabled = false;
controls.enableDamping = true;
controls.target.set(2.0, 3.6, -0.9);
controls.minDistance = 1.2;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI * 0.48;

let mode = 'idle'; // idle | film | explore
let acc = 0;
let last = performance.now();
let endShown = false;
let peakMax = 0;
window.__resetPeak = () => {
  peakMax = 0;
};

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// 调试/截图：?t=秒 直接快进到该时刻（物理照常逐步计算）
function fastForward(t) {
  while (sim.time < t) {
    sim.step();
    sim.events.length = 0;
  }
}

// ---------------- 音效分发 ----------------
const sp = (a) => a;
function dispatchEvents() {
  const ev = sim.events;
  if (audio.started && mode !== 'idle') {
    for (const e of ev) {
      switch (e.type) {
        case 'bell':
          audio.bell(e.v, world.instruments.bell);
          break;
        case 'drum':
          audio.drum(e.v, world.instruments.drum);
          break;
        case 'release':
          audio.clack(0.7, sp(world.anchors.stop), 0.9);
          break;
        case 'catch':
          audio.thunk(e.v, world.anchors.stop);
          break;
        case 'lug':
          audio.clack(Math.min(1, e.v * 1.5) * 0.5, world.anchors.fork, 1.3);
          break;
        case 'drip':
          audio.drip(e.n, world.anchors.fillCup);
          break;
        default:
      }
    }
  }
  ev.length = 0;
}

// ---------------- 动作高亮 ----------------
function activity() {
  const lw = Math.abs(sim.lever.body.angularVelocity.z);
  const ww = Math.abs(sim.wheel.body.angularVelocity.z);
  const tw = Math.abs(sim.tianzhu.tracker.omega());
  const jw = Math.abs(sim.jilun.tracker.omega());
  const dw = Math.abs(sim.strikers.drum.body.angularVelocity.z);
  const bw = Math.abs(sim.strikers.bell.body.angularVelocity.z);
  const leverOpen = sim.lever.limit.rel / LEVER.tripMax;
  return { lw, ww, tw, jw, dw, bw, leverOpen };
}

function applyGlow(a, shotId) {
  const g = world.glow;
  const focus = (ids) => (ids.includes(shotId) ? 1 : 0.25);
  g.lever.emissiveIntensity = Math.min(1.2, a.lw * 6 + a.leverOpen * 0.6) * focus(['escape1', 'escape2']);
  g.stop.emissiveIntensity = Math.min(1.5, a.leverOpen * 1.5 + a.lw * 4) * focus(['escape1', 'escape2']);
  g.wheel.emissiveIntensity = Math.min(0.5, a.ww * 0.9) * focus(['escape2', 'drive']);
  g.pins.emissiveIntensity = Math.min(1.2, a.ww * 2) * focus(['escape2']);
  g.shaft.emissiveIntensity = Math.min(0.7, a.tw * 1.4) * focus(['drive', 'chime']);
  g.jilun.emissiveIntensity = Math.min(0.5, a.jw * 4) * focus(['chime']);
  g.trip.emissiveIntensity = Math.min(1.2, a.jw * 8) * focus(['chime']);
  g.striker.emissiveIntensity = Math.min(1.2, Math.max(a.dw, a.bw) * 0.8) * focus(['chime']);
  g.fillCup.emissiveIntensity = 0;
  director.setActivity({
    fork: a.lw > 0.05 ? 1 : 0,
    stop: a.lw > 0.05 || a.leverOpen > 0.2 ? 1 : 0,
    lever: a.lw > 0.05 ? 1 : 0,
    weight: a.lw > 0.05 ? 1 : 0,
    wheel: a.ww > 0.15 ? 1 : 0,
    tianzhu: a.tw > 0.15 ? 1 : 0,
    dihu: a.tw > 0.15 ? 1 : 0,
    jilun: a.jw > 0.04 ? 1 : 0,
    trip: a.jw > 0.04 ? 1 : 0,
    drumFigure: a.dw > 0.6 ? 1 : 0,
    bellFigure: a.bw > 0.6 ? 1 : 0,
  });
}

// ---------------- 主循环 ----------------
function frame(now) {
  requestAnimationFrame(frame);
  const realDt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (mode === 'film' || mode === 'explore') {
    acc += realDt;
    let n = 0;
    while (acc >= DT && n < 5) {
      world.snapshot();
      sim.step();
      acc -= DT;
      n += 1;
    }
    if (n === 5) acc = 0; // 设备太慢时让影片整体放慢，而不是跳帧
  }
  const t = sim.time;
  let shotId = 'title';
  if (endShown && mode === 'film') {
    shotId = 'outro';
  } else if (mode === 'film' || mode === 'idle' || mode === 'frozen') {
    const r = director.update(mode === 'idle' ? 0 : t, realDt);
    shotId = r.shot.id;
    if (mode === 'idle') dom.fade.style.opacity = '0';
    if (mode === 'film' && r.done && !endShown) showEnd();
  } else {
    controls.update();
    shotId = 'explore';
  }
  world.update(sim, mode === 'film' || mode === 'explore' ? Math.min(1, acc / DT) : 1);
  const a = activity();
  applyGlow(a, shotId);
  if (audio.started) {
    audio.setListener(camera.position);
    const nz = sim.nozzle;
    const d = camera.position.distanceTo(new THREE.Vector3(nz[0], nz[1] - 0.3, 0));
    audio.setContinuous({
      water: mode === 'idle' ? 0 : 0.3 * Math.min(1, 2.6 / Math.max(0.6, d)) + 0.04,
      rumble: mode === 'idle' ? 0 : Math.min(0.5, a.ww * 0.55) * Math.min(1, 4 / camera.position.distanceTo(new THREE.Vector3(3, 2.4, 0))),
    });
  }
  dispatchEvents();
  // 水面轻微起伏（非机械，仅为装饰）
  for (const s of world.surfaces) s.position.y += Math.sin(now * 0.004 + s.position.x) * 0.00004;
  composer.render();
  const pk = audio.started ? audio.peak() : 0;
  peakMax = Math.max(peakMax, pk);
  window.__film = { t, mode, shot: shotId, steps: sim.stats.steps, peak: peakMax, audio: audio.ctx ? audio.ctx.state : 'none' };
}

function showEnd() {
  endShown = true;
  audio.fadeOutMusic(4);
  $('end').classList.remove('hidden');
  director.hideAll();
}

function startFilm() {
  $('start').classList.add('hidden');
  $('end').classList.add('hidden');
  $('backBtn').classList.add('hidden');
  controls.enabled = false;
  director.enabled = true;
  director.shotIndex = -1;
  endShown = false;
  acc = 0;
  last = performance.now();
  mode = 'film';
}

$('play').addEventListener('click', async () => {
  try {
    await audio.start();
  } catch (e) {
    console.warn('audio unavailable', e);
  }
  startFilm();
});

$('replay').addEventListener('click', () => {
  const old = sim;
  sim = createSimulation();
  world.rebind(old, sim);
  audio.restartMusic();
  startFilm();
});

$('explore').addEventListener('click', () => {
  $('end').classList.add('hidden');
  mode = 'explore';
  director.enabled = false;
  director.hideAll();
  controls.enabled = true;
  controls.target.set(2.0, 3.6, -0.9);
  camera.position.set(8.5, 5.5, 10.5);
  $('backBtn').classList.remove('hidden');
});
$('backBtn').addEventListener('click', () => $('replay').click());

// 截图/调试入口
if (params.has('t')) {
  const t = Number(params.get('t'));
  fastForward(t);
  $('start').classList.add('hidden');
  mode = 'film';
  director.shotIndex = -1;
  if (params.has('freeze')) {
    mode = 'frozen';
    const r = director.update(sim.time, 0);
    void r;
  }
}
window.__seek = (t) => {
  fastForward(t);
};

requestAnimationFrame(frame);
void FILM_LENGTH;

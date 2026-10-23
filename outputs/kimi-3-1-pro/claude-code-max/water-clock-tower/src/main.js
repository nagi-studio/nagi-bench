import './style.css';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { createMaterials, buildTower } from './scene.js';
import { Clockwork } from './mechanics.js';
import { Soundscape } from './audio.js';

const DURATION = 32;
const shots = [
  {
    start: 0, number: '00', eyebrow: '北宋 · 元祐七年（1092）', title: '把流水，<br>变成时间',
    copy: '苏颂 · 水运仪象台<br>一座三层高的自动化天文钟。', note: '公元 1092 年 · 开封',
    position: [12.4, 8.0, 18.6], target: [-0.75, 5.25, 0], fov: 37, stage: 'intro',
    labels: [
      ['towerTop', '上层 · 浑仪', '观天', 95, -30],
      ['towerMiddle', '中层 · 时辰轮', '报时', 105, -5],
      ['towerBottom', '下层 · 水轮', '驱动', 100, 25],
    ],
  },
  {
    start: 3.2, number: '01', eyebrow: '水力 · 动力从高处来', title: '高处的水，<br>推动水轮',
    copy: '平水壶保持稳定水压。<br>水注入受水斗，重量与冲击带动轮轴。', note: '先有水头，才有持续的动力',
    position: [5.5, 4.9, 10.9], target: [-1.65, 2.95, 0.05], fov: 34, stage: 'water',
    labels: [
      ['tank', '平水壶', '稳定水压', 65, -65],
      ['cup', '受水斗', '承接水力', 100, 15],
      ['axle', '主轮轴', '输出转动', 80, 55],
    ],
  },
  {
    start: 8.0, number: '02', eyebrow: '擒纵 · 把水力切成节拍', title: '不是一直转，<br>而是一格一格走',
    copy: '斗中水渐重，推动天衡、抬起锁爪。<br>水轮转过一斗，下一斗又被锁住。', note: '天衡与锁爪 · 古代的擒纵机构',
    position: [4.4, 5.65, 9.2], target: [-1.35, 3.82, 0.45], fov: 32, stage: 'escape',
    labels: [
      ['escape', '天衡', '杠杆', -125, -65],
      ['weight', '配重', '让锁爪复位', 85, -50],
      ['pawl', '锁爪', '锁住 / 释放', 100, 25, true],
    ],
  },
  {
    start: 12.7, number: '03', eyebrow: '齿轮 · 把节拍送上去', title: '齿轮接力，<br>动力逐层上传',
    copy: '大小齿轮啮合，改变转速与方向。<br>同轴齿轮再把转动送往报时轮。', note: '齿数决定传动比 · 力矩同时反向传回',
    position: [6.0, 5.25, 10.8], target: [-0.55, 3.55, 0.45], fov: 33, stage: 'gear',
    labels: [
      ['axle', '主动齿轮', '来自水轮', 70, 55],
      ['gears', '同轴齿轮组', '换速 · 换向', 100, -20],
      ['timing', '报时轮', '输出节拍', 95, -45],
    ],
  },
  {
    start: 17.0, number: '04', eyebrow: '报时 · 机械动作变成声音', title: '轮到刻度，<br>木人击鼓',
    copy: '报时轮上的拨钉压下杠杆。<br>拨钉滑过，木槌回落——鼓声报出时辰。', note: '拨钉 → 杠杆 → 木槌 → 鼓面',
    position: [6.0, 5.9, 9.7], target: [-0.45, 4.8, 0.55], fov: 32, stage: 'output',
    labels: [
      ['timing', '十二时辰轮', '子丑寅卯…', -155, -80],
      ['timingContact', '拨钉', '压下杠杆', 75, -55],
      ['drum', '木槌击鼓', '碰撞才发声', 70, 40, true],
    ],
  },
  {
    start: 22.3, number: '05', eyebrow: '观天 · 同一股水力抵达顶层', title: '水力登楼，<br>浑仪随之观天',
    copy: '经齿轮、立轴与锥齿轮改变方向。<br>浑仪缓慢旋转，模拟周天、观测星辰。', note: '下层计时 · 上层模拟天象',
    position: [6.2, 9.0, 10.5], target: [-0.65, 7.95, 0.5], fov: 33, stage: 'output',
    labels: [
      ['bevel', '锥齿轮', '转动换向', 95, 30],
      ['shaft', '立轴', '向上传递', 100, -15],
      ['armillary', '浑仪', '环规与窥管', 105, -35],
    ],
  },
  {
    start: 27.2, number: '06', eyebrow: '苏颂 · 水运仪象台', title: '水给力，<br>擒纵给节拍',
    copy: '下层驱动 · 中层报时 · 上层观天<br>九百多年前，机械已能自动运转。', note: '以水计时 · 以仪观天',
    position: [11.8, 7.8, 18.3], target: [-0.65, 5.25, 0], fov: 37, stage: 'final', labels: [],
  },
];
const anchors = {};
const labelNodes = new Map();
const story = document.querySelector('#story');
const storyTitle = document.querySelector('#chapter-title');
const storyCopy = document.querySelector('#chapter-copy');
const storyNote = document.querySelector('#story-note');
const chapterNumber = document.querySelector('#chapter-number');
const chapterEyebrow = document.querySelector('#chapter-eyebrow');
const progress = document.querySelector('#progress');
const timeNode = document.querySelector('#time');
const labelsLayer = document.querySelector('#labels');
const leaders = document.querySelector('#leaders');
const strikeNode = document.querySelector('#strike');
const pauseButton = document.querySelector('#pause');
const soundButton = document.querySelector('#sound');
const replayButton = document.querySelector('#replay');
let currentShot = -1;
let filmTime = 0;
let paused = false;
let ended = false;
let ready = false;
let sound;
let clock;
let camera;
let renderer;
let scene;

function shotAt(t) {
  for (let i = shots.length - 1; i >= 0; i--) if (t >= shots[i].start) return i;
  return 0;
}

function setStory(index) {
  const s = shots[index];
  chapterNumber.textContent = s.number;
  chapterEyebrow.textContent = s.eyebrow;
  storyTitle.innerHTML = s.title;
  storyCopy.innerHTML = s.copy;
  storyNote.textContent = s.note;
  story.classList.remove('swap');
  void story.offsetWidth;
  story.classList.add('swap');

  const order = ['water', 'wheel', 'escape', 'gear', 'output'];
  const active = s.stage === 'water' ? ['water', 'wheel'] : [s.stage];
  const passed = s.stage === 'escape' ? ['water', 'wheel'] : s.stage === 'gear' ? ['water', 'wheel', 'escape'] : s.stage === 'output' ? ['water', 'wheel', 'escape', 'gear'] : s.stage === 'final' ? order : [];
  document.querySelectorAll('#causal-chain > div').forEach(el => {
    el.classList.toggle('active', active.includes(el.dataset.stage));
    el.classList.toggle('passed', passed.includes(el.dataset.stage));
  });

  const wanted = new Set(s.labels.map(l => l[0]));
  for (const [key, nodes] of labelNodes) {
    const visible = wanted.has(key);
    nodes.el.style.opacity = visible ? '1' : '0';
    nodes.path.style.opacity = visible ? '1' : '0';
    nodes.dot.style.opacity = visible ? '1' : '0';
  }
  for (const config of s.labels) {
    const [key, text, sub, , , emphasis] = config;
    if (!labelNodes.has(key)) createLabel(key);
    const nodes = labelNodes.get(key);
    nodes.el.querySelector('b').textContent = text;
    nodes.el.querySelector('small').textContent = sub;
    nodes.el.classList.toggle('emphasis', !!emphasis);
    nodes.el.style.opacity = '1'; nodes.path.style.opacity = '1'; nodes.dot.style.opacity = '1';
  }
  sound?.setChapter(index);
}

function createLabel(key) {
  const el = document.createElement('div');
  el.className = 'world-label';
  el.innerHTML = '<div class="label-card"><b></b><small></small></div>';
  labelsLayer.appendChild(el);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dot.setAttribute('r', '3');
  leaders.append(path, dot);
  labelNodes.set(key, { el, path, dot });
}

function updateLabels(index) {
  if (index < 0 || !anchors) return;
  const width = innerWidth, height = innerHeight;
  const configs = shots[index].labels;
  for (const config of configs) {
    const [key, , , dx, dy] = config;
    const object = anchors[key], nodes = labelNodes.get(key);
    if (!object || !nodes) continue;
    if (key === 'pawl' && clock) {
      nodes.el.querySelector('small').textContent = clock.previousEscapeAngle > -0.08 ? '释放 · 走过一斗' : '锁住 · 等待下一斗';
    }
    const p = new THREE.Vector3();
    object.getWorldPosition(p);
    p.project(camera);
    const ax = (p.x * 0.5 + 0.5) * width;
    const ay = (-p.y * 0.5 + 0.5) * height;
    let x = ax + dx * Math.min(1, width / 1100);
    let y = ay + dy;
    x = Math.max(18, Math.min(width - 180, x));
    y = Math.max(82, Math.min(height - 150, y));
    if (p.z > 1 || p.z < -1) {
      nodes.el.style.opacity = '0'; nodes.path.style.opacity = '0'; nodes.dot.style.opacity = '0';
      continue;
    }
    nodes.el.style.transform = `translate(${x}px, ${y}px)`;
    const endX = dx < 0 ? x + 150 : x;
    const endY = y + 15;
    nodes.path.setAttribute('d', `M ${ax.toFixed(1)} ${ay.toFixed(1)} L ${((ax + endX) / 2).toFixed(1)} ${endY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`);
    nodes.dot.setAttribute('cx', ax); nodes.dot.setAttribute('cy', ay);
  }
}

function updateCamera(t) {
  const index = shotAt(t), s = shots[index];
  const local = Math.max(0, t - s.start);
  const drift = Math.sin(local * 0.33) * 0.13;
  const mobileScale = innerWidth / innerHeight < 1.05 ? 1.3 : 1;
  camera.position.set(
    s.target[0] + (s.position[0] - s.target[0]) * mobileScale + drift,
    s.target[1] + (s.position[1] - s.target[1]) * mobileScale + Math.sin(local * 0.25) * 0.045,
    s.target[2] + (s.position[2] - s.target[2]) * mobileScale,
  );
  camera.fov = s.fov;
  camera.updateProjectionMatrix();
  camera.lookAt(...s.target);
}

function formatTime(t) {
  return `00:${String(Math.min(32, Math.floor(t))).padStart(2, '0')}`;
}

async function togglePause() {
  if (!ready || ended) return;
  paused = !paused;
  document.querySelector('#app').classList.toggle('is-paused', paused);
  document.querySelector('#paused').classList.toggle('show', paused);
  pauseButton.setAttribute('aria-label', paused ? '继续' : '暂停');
  sound.setPaused(paused);
}

async function toggleSound() {
  const on = await sound.toggle();
  soundButton.querySelector('span').textContent = on ? '声音已开启' : '开启声音';
  soundButton.classList.toggle('enabled', on);
}

pauseButton.addEventListener('click', togglePause);
soundButton.addEventListener('click', toggleSound);
replayButton.addEventListener('click', () => location.reload());
window.addEventListener('keydown', event => {
  if (event.code === 'Space') { event.preventDefault(); togglePause(); }
  if (event.code === 'KeyM') toggleSound();
  if (event.code === 'KeyR') location.reload();
});

async function init() {
  const requestedTime = new URLSearchParams(location.search).has('t')
    ? Math.max(0, Math.min(DURATION, Number(new URLSearchParams(location.search).get('t')) || 0))
    : null;
  await RAPIER.init();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x071b20);
  scene.fog = new THREE.Fog(0x071b20, 24, 48);
  camera = new THREE.PerspectiveCamera(37, innerWidth / innerHeight, 0.1, 100);
  renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#scene'), antialias: false, powerPreference: 'high-performance' });
  const gl = renderer.getContext();
  const debugGPU = gl.getExtension('WEBGL_debug_renderer_info');
  const gpuName = debugGPU ? gl.getParameter(debugGPU.UNMASKED_RENDERER_WEBGL) : '';
  const softwareGPU = /swiftshader|llvmpipe|software/i.test(gpuName);
  renderer.setPixelRatio(softwareGPU ? 0.8 : Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene.add(new THREE.HemisphereLight(0xa8d3c4, 0x18201d, 1.45));
  const key = new THREE.DirectionalLight(0xffdfae, 3.2);
  key.position.set(6, 14, 9); key.castShadow = true;
  key.shadow.mapSize.set(1536, 1536);
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 13, bottom: -3, near: 1, far: 35 });
  key.shadow.bias = -0.00035; key.shadow.normalBias = 0.035;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x65b7ad, 1.9); rim.position.set(-8, 7, -5); scene.add(rim);
  const front = new THREE.DirectionalLight(0xffd49a, 1.15); front.position.set(1, 5.5, 7); scene.add(front);
  scene.add(new THREE.AmbientLight(0x8fa99b, 0.22));

  const M = createMaterials();
  const tower = buildTower(scene, M);
  Object.assign(anchors, tower.anchors);
  clock = new Clockwork(RAPIER, scene, M);
  Object.assign(anchors, clock.anchors);
  sound = new Soundscape();

  clock.onStrike = strength => {
    sound.drum(strength, shotAt(filmTime) === 4);
    if (shotAt(filmTime) === 4) {
      strikeNode.classList.remove('show');
      void strikeNode.offsetWidth;
      strikeNode.classList.add('show');
    }
  };
  clock.onTick = () => { if (shotAt(filmTime) === 2) sound.tick(); };

  // A physical pre-roll opens on an already flowing machine. The optional
  // ?t=seconds inspection view uses the same integration, then holds the shot.
  if (requestedTime !== null) { filmTime = requestedTime; paused = true; }
  const strikeHandler = clock.onStrike, tickHandler = clock.onTick;
  clock.onStrike = null; clock.onTick = null;
  const preRollSteps = 45 + Math.floor(filmTime * 60);
  for (let i = 0; i < preRollSteps; i++) clock.step(1 / 60);
  clock.onStrike = strikeHandler; clock.onTick = tickHandler;
  clock.sync(filmTime);
  updateCamera(filmTime);
  currentShot = shotAt(filmTime);
  setStory(currentShot);
  scene.updateMatrixWorld(true);
  renderer.compile(scene, camera);
  renderer.render(scene, camera);
  document.querySelector('#loading').classList.add('hide');
  ready = true;
  if (requestedTime === null) sound.enable().then(on => {
    soundButton.querySelector('span').textContent = on ? '声音已开启' : '开启声音';
    soundButton.classList.toggle('enabled', on);
  }).catch(() => {});

  window.__film = {
    get ready() { return ready; },
    get time() { return filmTime; },
    get shot() { return shotAt(filmTime); },
    get paused() { return paused; },
    stats: () => clock.getStats(),
    renderer: () => renderer.info,
  };

  let last = performance.now(), accumulator = 0;
  const fixedStep = 1 / 60;
  function frame(now) {
    requestAnimationFrame(frame);
    const rawDelta = Math.max(0, (now - last) / 1000);
    last = now;
    if (!paused) {
      if (!ended) {
        filmTime = Math.min(DURATION, filmTime + rawDelta);
        if (filmTime >= DURATION) {
          ended = true;
          replayButton.classList.add('show');
          sound.music.gain.setTargetAtTime(0.2, sound.ctx.currentTime, 1.2);
        }
      }
      // Fixed-step catch-up keeps the film on wall time even in software WebGL.
      accumulator += Math.min(rawDelta, 2);
      let steps = 0;
      while (accumulator >= fixedStep && steps < 120) {
        clock.step(fixedStep);
        accumulator -= fixedStep;
        steps++;
      }
      if (steps === 120) accumulator = Math.min(accumulator, fixedStep);
      clock.sync(filmTime);
      sound.update(clock.wheel.angvel().z, shotAt(filmTime));
    }
    const index = shotAt(filmTime);
    if (index !== currentShot) { currentShot = index; setStory(index); }
    updateCamera(filmTime);
    progress.style.transform = `scaleX(${filmTime / DURATION})`;
    timeNode.textContent = formatTime(filmTime);
    scene.updateMatrixWorld(true);
    updateLabels(index);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}

window.addEventListener('resize', () => {
  if (!renderer || !camera) return;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

init().catch(error => {
  console.error(error);
  const loading = document.querySelector('#loading');
  loading.querySelector('b').textContent = '无法启动 3D 场景';
  loading.querySelector('small').textContent = '请使用支持 WebGL 2 的现代浏览器';
});

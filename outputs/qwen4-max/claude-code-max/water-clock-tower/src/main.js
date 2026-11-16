// 入口：物理实时求解 -> 渲染同步 -> 影片时间轴 -> 程序化音频
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { createMachine } from './sim/machine.js';
import { buildScene } from './render.js';
import { createFilm } from './film.js';
import { createAudio } from './audio.js';

const params = new URLSearchParams(location.search);
const SPEED = Number(params.get('speed') ?? 1);
const DT = 1 / 60;
const FILM_END = 32;
let T0 = performance.now(); // 影片时钟原点：脚本加载即开始，boot 后物理快进补齐

const canvas = document.getElementById('scene');
const dom = {
  subtitle: document.getElementById('subtitle'),
  title: document.getElementById('title'),
  endcard: document.getElementById('endcard'),
  labels: document.getElementById('labels'),
  chain: document.getElementById('chain'),
  hint: document.getElementById('hint'),
};

async function boot() {
  await RAPIER.init();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = false; // 软件渲染下关闭阴影保帧率
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const view = buildScene(renderer);
  const { scene, camera, sync, addRipple, updateRipples } = view;
  const film = createFilm(camera, dom);
  const audio = createAudio();

  let machine = createMachine(RAPIER, { seed: 1092 });
  let simTime = 0, acc = 0, last = performance.now();
  let lastSplash = -1;

  // 物理事件 -> 音效 / 特效
  function wire(m) {
    m.on('clack', () => audio.clack());
    m.on('bell', ({ force }) => { audio.bell(force); addRipple(machine.bodies.bell.translation()); });
    m.on('drum', ({ force }) => { audio.drum(force); addRipple(machine.bodies.drum.translation()); });
    m.on('splash', (p) => {
      if (simTime - lastSplash > 0.18) { lastSplash = simTime; audio.splash(); }
    });
  }
  wire(machine);

  const RES = 0.72; // 内部渲染分辨率缩放（软件渲染保帧率），CSS 拉伸到全屏
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(Math.floor(w * RES), Math.floor(h * RES), false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // 音频：预览环境自动播放；真实浏览器首次手势解锁
  audio.start();
  let muted = params.get('mute') === '1';
  audio.setMuted(muted);
  const muteBtn = document.getElementById('mute');
  muteBtn.classList.toggle('muted', muted);
  const unlock = () => { audio.resume(); dom.hint.style.opacity = '0'; };
  window.addEventListener('pointerdown', unlock);
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    muted = !muted; audio.setMuted(muted);
    muteBtn.classList.toggle('muted', muted);
    muteBtn.textContent = muted ? '✕' : '♪';
  });

  // 重播
  document.getElementById('replay').addEventListener('click', (e) => {
    e.stopPropagation();
    machine.free();
    machine = createMachine(RAPIER, { seed: 1092 });
    wire(machine);
    simTime = 0; acc = 0; T0 = performance.now();
    audio.start();
  });

  document.getElementById('loading').style.display = 'none';

  function frame(now) {
    requestAnimationFrame(frame);
    const dtReal = Math.min((now - last) / 1000, 1.0);
    last = now;
    // 影片时间 = 墙钟；物理以固定步长快进追赶（含 boot 耗时），保证节奏与帧率无关
    const wall = ((now - T0) / 1000) * SPEED;
    acc = wall - simTime;
    if (acc < 0) acc = 0;
    let steps = 0;
    while (acc >= DT && steps < 90) {
      machine.step();
      simTime += DT;
      acc -= DT;
      steps++;
    }

    sync(machine);
    updateRipples(dtReal);
    const w = window.innerWidth, h = window.innerHeight;
    film.update(Math.min(simTime, FILM_END), w, h);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}

boot().catch((e) => {
  document.getElementById('loading').textContent = '加载失败：' + e.message;
  console.error(e);
});

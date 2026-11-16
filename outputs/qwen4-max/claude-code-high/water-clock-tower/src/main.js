// ---------------------------------------------------------------------------
// 入口:物理定步长解算 → 视觉同步 → 镜头/字幕 → 声音。
// 影片时钟 = 物理仿真时钟,保证画面、机构与声音严格同步。
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { createMachine, DT } from './physics.js';
import { createVisuals } from './visuals.js';
import { createAudio } from './audio.js';
import { createTimeline, FILM_LEN } from './timeline.js';

const canvas = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const machine = createMachine();
const visuals = createVisuals(renderer, machine);
const audio = createAudio();
const timeline = createTimeline(visuals.camera, visuals.anchors);

const resize = () => {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h);
  visuals.camera.aspect = w / h;
  visuals.camera.updateProjectionMatrix();
};
window.addEventListener('resize', resize);
resize();

// 声音:尝试自动播放;若浏览器拦截,首次交互时开启
const hint = document.getElementById('sound-hint');
const tryAudio = () => {
  audio.resume();
  if (audio.running) hint.classList.remove('show');
  else hint.classList.add('show');
};
tryAudio();
window.addEventListener('pointerdown', tryAudio);
window.addEventListener('keydown', tryAudio);

const muteBtn = document.getElementById('mute');
muteBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  audio.ensure();
  audio.setMuted(!audio.muted);
  muteBtn.classList.toggle('muted', audio.muted);
});
document.getElementById('replay').addEventListener('click', () => location.reload());

// 调试: ?seek=N 可快进物理仿真 N 秒(无渲染),便于逐镜头检查
const seek = parseFloat(new URLSearchParams(location.search).get('seek') || '0');
if (seek > 0) {
  const n = Math.floor(seek / DT);
  for (let i = 0; i < n; i++) { machine.step(DT); machine.events.length = 0; }
}

window.__film = { machine, visuals, audio, timeline, renderer };
window.__THREE__ = THREE;

let acc = 0, last = performance.now();
let ended = false;
let filmStart = performance.now() - seek * 1000;

function frame(now) {
  requestAnimationFrame(frame);
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.75) dt = 0.75;
  acc += dt;
  let n = 0;
  while (acc >= DT && n < 48) {
    machine.step(DT);
    acc -= DT; n++;
  }
  if (n >= 48) acc = 0; // 极端卡顿时丢弃积压,保持影片节奏

  const t = machine.time;
  // 影片时钟:以墙上时间为准(镜头/字幕准时),但最多领先物理 1.2s,保证机构与叙述同步
  const filmT = Math.min((now - filmStart) / 1000, t + 1.2);
  // 物理 → 声音事件
  for (const e of machine.events) audio.event(e);
  machine.events.length = 0;

  visuals.update(t, dt);
  const si = timeline.update(Math.min(filmT, FILM_LEN), window.innerWidth, window.innerHeight);
  audio.update(filmT, machine.pouring, si);

  renderer.render(visuals.scene, visuals.camera);

  if (filmT >= FILM_LEN && !ended) {
    ended = true;
    document.getElementById('replay').style.pointerEvents = 'auto';
  }
}
requestAnimationFrame(frame);

import './style.css';
import { ClockMechanics, PHYSICS_STEP } from './mechanics.js';
import { ClockScene } from './scene.js';
import { FilmDirector, DURATION } from './director.js';
import { ClockAudio } from './audio.js';

const mechanics = new ClockMechanics();
const clockScene = new ClockScene(document.querySelector('#scene'), mechanics);
const director = new FilmDirector(clockScene.camera, clockScene);
const audio = new ClockAudio();
const playButton = document.querySelector('#play');
const soundButton = document.querySelector('#sound');
const timeline = document.querySelector('#timeline');
const progress = document.querySelector('#progress');
const playhead = document.querySelector('#playhead');
const timeLabel = document.querySelector('#time');
const loading = document.querySelector('#loading');
const soundHint = document.querySelector('#sound-hint');
let time = 0;
let playing = true;
let accumulator = 0;
let lastFrame = performance.now();
let firstFrame = true;
let resumeAfterScrub = false;

function updateTransport() {
  const percent = Math.min(100, time / DURATION * 100);
  progress.style.width = `${percent}%`;
  playhead.style.left = `calc(${percent}% - 3px)`;
  const seconds = Math.floor(time).toString().padStart(2, '0');
  timeLabel.innerHTML = `00:${seconds} <i>/</i> 00:30`;
  timeline.setAttribute('aria-valuenow', time.toFixed(1));
  playButton.classList.toggle('paused', !playing);
  playButton.setAttribute('aria-label', playing ? '暂停' : time >= DURATION ? '重播' : '播放');
}

function setPlaying(value) {
  if (value && time >= DURATION) restart();
  else playing = value;
  updateTransport();
}

function restart() {
  time = 0;
  accumulator = 0;
  mechanics.reset();
  audio.reset();
  playing = true;
  director.update(0);
  updateTransport();
}

function seek(target, pause = true) {
  const clamped = Math.max(0, Math.min(DURATION, target));
  mechanics.reset();
  accumulator = 0;
  let simulated = 0;
  while (simulated + PHYSICS_STEP <= clamped) {
    mechanics.step(PHYSICS_STEP);
    simulated += PHYSICS_STEP;
  }
  time = clamped;
  if (pause) playing = false;
  audio.reset();
  const app = document.querySelector('#app');
  app.classList.add('seeking');
  director.update(time);
  updateTransport();
  requestAnimationFrame(() => app.classList.remove('seeking'));
}

playButton.addEventListener('click', () => setPlaying(!playing));
document.querySelector('#replay').addEventListener('click', restart);
soundButton.addEventListener('click', async () => {
  if (audio.enabled) audio.disable();
  else await audio.enable();
  soundButton.classList.toggle('enabled', audio.enabled);
  soundButton.setAttribute('aria-label', audio.enabled ? '关闭声音' : '开启声音');
  soundButton.title = audio.enabled ? '关闭声音' : '开启声音';
  soundHint.classList.remove('visible');
});

window.addEventListener('pointerdown', async (event) => {
  if (audio.enabled || event.target.closest('#sound')) return;
  const enabled = await audio.enable();
  soundButton.classList.toggle('enabled', enabled);
  soundButton.setAttribute('aria-label', enabled ? '关闭声音' : '开启声音');
  if (enabled) soundHint.classList.remove('visible');
}, { once: true });

function scrub(event) {
  const rect = timeline.getBoundingClientRect();
  seek((event.clientX - rect.left) / rect.width * DURATION);
}
timeline.addEventListener('pointerdown', (event) => {
  resumeAfterScrub = playing;
  timeline.setPointerCapture(event.pointerId);
  scrub(event);
});
timeline.addEventListener('pointermove', (event) => {
  if (timeline.hasPointerCapture(event.pointerId)) scrub(event);
});
timeline.addEventListener('pointerup', (event) => {
  if (timeline.hasPointerCapture(event.pointerId)) timeline.releasePointerCapture(event.pointerId);
  playing = resumeAfterScrub && time < DURATION;
  updateTransport();
});
timeline.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    seek(time + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
window.addEventListener('keydown', (event) => {
  if (event.target === timeline) return;
  if (event.code === 'Space') { event.preventDefault(); setPlaying(!playing); }
  if (event.key.toLowerCase() === 'r') restart();
  if (event.key.toLowerCase() === 'm') soundButton.click();
});
document.addEventListener('visibilitychange', () => {
  lastFrame = performance.now();
  accumulator = 0;
});

function frame(now) {
  const elapsed = firstFrame ? 0 : Math.min(4, Math.max(0, (now - lastFrame) / 1000));
  firstFrame = false;
  lastFrame = now;
  if (playing) {
    time = Math.min(DURATION, time + elapsed);
    accumulator += Math.min(1.5, elapsed);
    let steps = 0;
    while (accumulator >= PHYSICS_STEP && steps < 180) {
      mechanics.step(PHYSICS_STEP);
      accumulator -= PHYSICS_STEP;
      steps++;
    }
    if (steps === 180) accumulator = 0;
    if (time >= DURATION) playing = false;
  }
  director.update(time);
  audio.update(mechanics.events, time, playing);
  updateTransport();
  clockScene.render();
  requestAnimationFrame(frame);
}

director.update(0);
clockScene.render();
lastFrame = performance.now();
requestAnimationFrame(frame);
requestAnimationFrame(() => {
  loading.classList.add('done');
  setTimeout(() => soundHint.classList.add('visible'), 1800);
  setTimeout(() => soundHint.classList.remove('visible'), 6500);
});

window.__waterClock = {
  seek: (target) => seek(target),
  play: () => setPlaying(true),
  pause: () => setPlaying(false),
  restart,
  getState: () => ({
    time,
    playing,
    audioEnabled: audio.enabled,
    telemetry: mechanics.getTelemetry(),
    drawCalls: clockScene.renderer.info.render.calls,
    triangles: clockScene.renderer.info.render.triangles,
  }),
};

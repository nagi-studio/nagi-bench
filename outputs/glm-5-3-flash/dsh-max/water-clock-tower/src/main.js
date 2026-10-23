import { Machine } from "./machine.js";
import { Scene3D, updateParticles } from "./scene.js";
import { Audio8 } from "./audio.js";
import { Director } from "./director.js";

const FILM_LEN = 32.5;

const ui = {
  gate: document.getElementById("gate"),
  cap: document.getElementById("cap"),
  chapter: document.getElementById("chapter"),
  ctrl: document.getElementById("ctrl"),
  scrub: document.getElementById("scrub"),
  fill: document.getElementById("scrubFill"),
  btnPlay: document.getElementById("btnPlay"),
  btnReplay: document.getElementById("btnReplay"),
  btnMute: document.getElementById("btnMute"),
};

let machine = null, S = null, audio = null, dir = null;
let playing = false, t = 0, last = 0, muted = false;
let drumCount = 0, bellDone = false;

function init() {
  S = new Scene3D(document.getElementById("app"));
  dir = new Director(S.camera, ui);
  dir.shot(0);
  S.render();
}

async function start() {
  ui.gate.classList.add("hide");
  if (!machine) {
    machine = await Machine.create();
    audio = new Audio8();
    audio.fade(0.72, 2.2);
    audio.started = true;
  } else {
    audio && audio.fade(0.72, 1.2);
  }
  t = 0; playing = true; last = performance.now();
  machine.placeBoxes && machine.prime && machine.prime();
  machine.events.length = 0;
  machine.nextPour = 0.5;
  machine.poured = 0;
  machine.time = 0;
  drumCount = 0; bellDone = false;
  ui.ctrl.classList.add("show"); ui.scrub.classList.add("show");
  ui.btnPlay.textContent = "❚❚";
}

function pause() {
  playing = false;
  ui.btnPlay.textContent = "▶";
  audio && audio.fade(0.12, .5);
}
function resume() {
  if (t >= FILM_LEN) { t = 0; }
  playing = true; last = performance.now();
  ui.btnPlay.textContent = "❚❚";
  audio && audio.fade(0.72, .8);
}

/* 事件 → 音效 */
function consumeEvents() {
  while (machine.events.length) {
    const e = machine.events.shift();
    switch (e.type) {
      case "escape":
        audio.escape();
        if (++drumCount % 2 === 0) setTimeout(() => audio.drum(), 90);
        break;
      case "load": audio.pour(); break;
      case "dump": audio.dump(); break;
      case "pour": break;
    }
  }
}

function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (playing && machine) {
    const sim = machine.step(dt);
    t += sim;
    consumeEvents();
    audio && audio.tickMusic();
    if (t >= FILM_LEN) {
      t = FILM_LEN; playing = false;
      ui.btnPlay.textContent = "↻";
      if (!bellDone) { bellDone = true; audio.bell(); }
      audio.fade(0.25, 2.5);
    }
  }
  if (machine) {
    S.sync(machine);
    updateParticles(S, dt);
  }
  dir.shot(t);
  dir.caps(t);
  ui.fill.style.width = Math.min(100, (t / FILM_LEN) * 100).toFixed(2) + "%";
  S.render();
}

/* ---------- 交互 ---------- */
document.getElementById("play").addEventListener("click", start);
ui.btnPlay.addEventListener("click", () => playing ? pause() : resume());
ui.btnReplay.addEventListener("click", () => { if (machine) { pause(); start(); } });
ui.btnMute.addEventListener("click", () => {
  muted = !muted;
  ui.btnMute.textContent = muted ? "🔇" : "♪";
  audio && audio.fade(muted ? 0.0 : 0.72, .4);
});
addEventListener("keydown", (e) => {
  if (e.code === "Space") { e.preventDefault(); playing ? pause() : resume(); }
});

init();

/* 调试/自检接口: 不影响正常播放 */
Object.defineProperty(window, "__filmT", { get: () => t });
window.__seek = (target) => {
  if (!machine) return 0;
  while (machine.time < target) { machine.substep(1 / 120); consumeEvents(); }
  t = machine.time; S.sync(machine);
  return t;
};
window.__shot = () => { dir.shot(t); dir.caps(t); S.render(); };

import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
} from "@agentbench/cinematic-player";
import { assembleFilm, type Film } from "./film";
import { buildShots } from "./shots";
import { voiceCues } from "./voice";
import { soundCues, defineSamples, defineProcedural } from "./sounds";
import { clamp01 } from "./util";

const DURATION = 356;

// --- bootstrap -------------------------------------------------------------
const stageEl = document.getElementById("stage")!;
const fadeEl = document.getElementById("fade")!;
const crosshairEl = document.getElementById("crosshair")!;
const flashEl = document.getElementById("flash")!;
const titlecardEl = document.getElementById("titlecard")!;
const titleCn = document.getElementById("title-cn")!;
const titleEn = document.getElementById("title-en")!;
const titleSub = document.getElementById("title-sub")!;
const bootHint = document.getElementById("boot-hint")!;

const film: Film = assembleFilm();
const shots = buildShots(film);

// --- player ---------------------------------------------------------------
const player = new CinematicPlayer({
  duration: DURATION,
  context: film,
  shots,
  cues: [...voiceCues, ...soundCues],
});

validateVoiceCues(voiceCues, DURATION);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const stage = new ThreeStage({
  player,
  renderer,
  scene: film.scene,
  camera: () => film.camera,
  container: stageEl,
  maxPixelRatio: 2,
});

const audio = new WebAudioCueBus(player);
defineSamples(audio);
defineProcedural(audio);
audio.setMasterGain(0.8);

const controls = mountCinematicControls({ player, audio, container: stageEl });

// ---------------------------------------------------------------------------
// Overlay director: DOM layers are pure functions of absolute time, so seeking
// stays exact. Shots only own 3D state.
// ---------------------------------------------------------------------------

const FADE_KEYS: Array<[number, number]> = [
  [0, 1],
  [1.3, 0],
  [95.4, 0],
  [96.0, 1],
  [96.6, 0],
  [115.4, 0],
  [116.0, 1],
  [116.6, 0],
  [159.4, 0],
  [160.0, 1],
  [160.6, 0],
  [333.4, 0],
  [334.0, 1],
  [334.6, 0],
  [343.6, 0],
  [344.2, 1],
  [345.0, 0],
  [355.2, 0],
  [356.0, 1],
];

function fadeOpacity(time: number): number {
  const first = FADE_KEYS[0];
  const last = FADE_KEYS[FADE_KEYS.length - 1];
  if (time <= first[0]) return first[1];
  if (time >= last[0]) return last[1];
  for (let i = 0; i < FADE_KEYS.length - 1; i++) {
    const a = FADE_KEYS[i];
    const b = FADE_KEYS[i + 1];
    if (time >= a[0] && time <= b[0]) {
      const p = (time - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * p;
    }
  }
  return 0;
}

interface TitleCard {
  start: number;
  end: number;
  fadeIn: number;
  fadeOut: number;
  cn: string;
  en: string;
  sub: string;
}

const TITLE_CARDS: TitleCard[] = [
  {
    start: 8.5,
    end: 19.2,
    fadeIn: 1.8,
    fadeOut: 1.4,
    cn: "陨 石",
    en: "THE METEORITE",
    sub: "章北海 · 增援未来",
  },
  {
    start: 345.2,
    end: 355.0,
    fadeIn: 1.2,
    fadeOut: 1.2,
    cn: "完",
    en: "FIN",
    sub: "—— 献给在黑暗中守望未来的人 ——",
  },
];

function crosshairOpacity(time: number): number {
  if (time >= 276 && time <= 292) return 1;
  if (time > 292 && time <= 292.4) return clamp01((292.4 - time) / 0.4);
  return 0;
}

function flashOpacity(time: number): number {
  if (time >= 2.96 && time <= 3.02) return 1;
  if (time > 3.02 && time <= 3.3) return clamp01(1 - (time - 3.02) / 0.28);
  return 0;
}

function titleOpacity(time: number): number {
  for (const card of TITLE_CARDS) {
    if (time >= card.start && time <= card.end) {
      const local = time - card.start;
      const total = card.end - card.start;
      const inAmt = clamp01(local / card.fadeIn);
      const outAmt = clamp01((card.end - time) / card.fadeOut);
      return Math.min(inAmt, outAmt);
    }
  }
  return 0;
}

function titleText(time: number): TitleCard | null {
  for (const card of TITLE_CARDS) {
    if (time >= card.start && time <= card.end) return card;
  }
  return null;
}

let lastTitleKey = "";

function overlayDirector(time: number): void {
  fadeEl.style.opacity = String(fadeOpacity(time));
  crosshairEl.style.opacity = String(crosshairOpacity(time));
  flashEl.style.opacity = String(flashOpacity(time));

  const card = titleText(time);
  const op = titleOpacity(time);
  titlecardEl.style.opacity = String(op);
  if (card) {
    const key = card.cn + card.en + card.sub;
    if (key !== lastTitleKey) {
      lastTitleKey = key;
      titleCn.textContent = card.cn;
      titleEn.textContent = card.en;
      titleSub.textContent = card.sub;
    }
  }
  titlecardEl.style.transform = `translateY(${(1 - op) * 12}px)`;
}

player.addTypedEventListener("frame", (event) => {
  overlayDirector(event.detail.time);
});

player.addTypedEventListener("statechange", (event) => {
  if (event.detail.state === "playing") {
    bootHint.style.opacity = "0";
  }
});

overlayDirector(0);

// expose for debugging / inspection
Object.assign(window, { player, stage, audio, controls, film, THREE });
(film as Film & { project: (x: number, y: number, z: number) => { x: number; y: number; z: number } }).project = (
  x: number,
  y: number,
  z: number,
) => {
  const v = new THREE.Vector3(x, y, z).project(film.camera);
  return { x: v.x, y: v.y, z: v.z };
};

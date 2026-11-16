import * as THREE from "three";
import {
  CinematicPlayer, ThreeStage, WebAudioCueBus, mountCinematicControls,
  type ThreeRendererLike,
} from "@agentbench/cinematic-player";
import { createFilm, type FilmContext } from "./film";
import { registerSounds } from "./film/audio";
import { overlayState, applyOverlays, type OverlayEls } from "./film/overlays";

const stageEl = document.querySelector<HTMLElement>("#stage")!;
const uiEl = document.querySelector<HTMLElement>("#ui")!;
const hintEl = document.querySelector<HTMLElement>("#hint")!;

const film = createFilm();
const { context } = film;

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const player = new CinematicPlayer({
  duration: film.duration,
  context,
  shots: film.shots,
  cues: [...film.voiceCues, ...film.soundCues],
});

const stage = new ThreeStage<FilmContext>({
  player,
  renderer: renderer as unknown as ThreeRendererLike,
  scene: context.scene,
  camera: () => context.camera,
  container: stageEl,
  maxPixelRatio: 2,
});

const audio = new WebAudioCueBus<FilmContext>(player);
registerSounds(audio);
audio.setMasterGain(0.8);

const controls = mountCinematicControls<FilmContext>({ player, audio, container: uiEl });

/* ---- editorial overlays, driven purely by absolute time ---- */
const els: OverlayEls = {
  fade: document.querySelector("#fade")!,
  flash: document.querySelector("#flash")!,
  scope: document.querySelector("#scope")!,
  card: document.querySelector("#card")!,
  cardZh: document.querySelector("#card .zh")!,
  cardEn: document.querySelector("#card .en")!,
  cardSub: document.querySelector("#card .sub")!,
  cardRule: document.querySelector("#card .rule")!,
};

player.addTypedEventListener("frame", ({ detail }) => {
  applyOverlays(overlayState(detail.time), els);
});

player.addTypedEventListener("statechange", ({ detail }) => {
  hintEl.classList.toggle("show", detail.state !== "playing" && player.currentTime < 0.5);
});
hintEl.classList.add("show");

/* ---- keyboard transport for inspection ---- */
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    void audio.unlock().then(() => (player.isPlaying ? player.pause() : player.play()));
  } else if (e.code === "ArrowRight") {
    player.seek(Math.min(film.duration, player.currentTime + 5));
  } else if (e.code === "ArrowLeft") {
    player.seek(Math.max(0, player.currentTime - 5));
  }
});

// expose for headless verification / debugging
(window as unknown as Record<string, unknown>).__film = { player, audio, stage, controls, film };

// first useful frame
player.refresh();
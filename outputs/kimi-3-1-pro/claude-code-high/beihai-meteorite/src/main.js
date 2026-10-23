import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
} from "@agentbench/cinematic-player";
import { createWorlds } from "./worlds.js";
import { createFilm } from "./film.js";
import { voiceCues, soundCues } from "./cues.js";
import { registerAudio } from "./audio.js";
import "./style.css";

const DURATION = 336;
const container = document.querySelector("#stage");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, .025, 420);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.03;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const worlds = createWorlds(scene);
const ui = {
  title: document.querySelector("#title-card"),
  location: document.querySelector("#location"),
  scope: document.querySelector("#scope"),
  hud: document.querySelector("#hud"),
  hudTime: document.querySelector("#hud-time"),
  flight: document.querySelector("#flight-clock"),
  credits: document.querySelector("#credits"),
  fade: document.querySelector("#fade"),
};
const context = { scene, camera, worlds, ui };
const film = createFilm(context);
validateVoiceCues(voiceCues, DURATION);

const player = new CinematicPlayer({
  duration: DURATION,
  context,
  shots: film.shots,
  cues: [...voiceCues, ...soundCues],
  loop: false,
});
player.addTypedEventListener("frame", ({ detail }) => film.updateUI(detail.time));
film.updateUI(0);

const stage = new ThreeStage({ player, renderer, scene, camera, container, maxPixelRatio: 1.6 });
const audio = new WebAudioCueBus(player);
registerAudio(audio);
const controls = mountCinematicControls({ player, audio, container: document.querySelector("#app"), showFullscreen: true });

async function togglePlayback() {
  await audio.unlock();
  if (player.isPlaying) player.pause(); else player.play();
}
window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement) return;
  if (event.code === "Space") { event.preventDefault(); void togglePlayback(); }
  if (event.code === "ArrowRight") player.seek(Math.min(DURATION, player.currentTime + 5));
  if (event.code === "ArrowLeft") player.seek(Math.max(0, player.currentTime - 5));
});

// A read-only inspection handle is useful when verifying transport in a real browser.
window.__cinematic = { player, audio, stage, controls, duration: DURATION, voiceCues };
document.documentElement.dataset.cinematicReady = "true";

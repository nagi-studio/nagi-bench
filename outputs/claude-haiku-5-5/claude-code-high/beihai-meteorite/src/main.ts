import * as THREE from "three";
import "./style.css";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
  type TimelineCue,
} from "@agentbench/cinematic-player";
import { createCast } from "./film/cast";
import { buildSets } from "./film/sets";
import { DURATION, soundCues, voiceCues } from "./film/cues";
import { buildShots, createFilm, type Film } from "./film/shots";
import { registerSounds } from "./film/sound";

const app = document.getElementById("app") as HTMLElement;
const stageElement = document.getElementById("stage") as HTMLElement;
const card = document.getElementById("card") as HTMLElement;
const startOverlay = document.getElementById("start") as HTMLElement;
const beginButton = document.getElementById("begin") as HTMLButtonElement;

// Validate the speech manifest up front so a bad cue fails before playback.
validateVoiceCues(voiceCues, DURATION);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 30000);

const sets = buildSets(scene, camera);
const cast = createCast(scene);
const film: Film = createFilm(scene, camera, sets, cast, card);
film.suitDress = new Array(cast.suits.length).fill("plain");

const cues: TimelineCue[] = [...voiceCues, ...soundCues];
const player = new CinematicPlayer<Film>({
  duration: DURATION,
  context: film,
  shots: buildShots(film),
  cues,
});

const stage = new ThreeStage<Film>({
  player,
  renderer,
  scene,
  camera,
  container: stageElement,
  maxPixelRatio: 2,
});

const audio = new WebAudioCueBus<Film>(player);
registerSounds(audio);
const controls = mountCinematicControls({ player, audio, container: app });

beginButton.addEventListener("click", async () => {
  // The first play is a user gesture, so it is also where Web Audio unlocks.
  await audio.unlock();
  startOverlay.classList.add("hidden");
  player.play();
});

// Keep references for hot reload and explicit disposal.
Object.assign(window, { player, stage, audio, controls });

import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
} from "@agentbench/cinematic-player";
import { voiceCues } from "./voiceCues";
import { soundCues, setupAudioBus } from "./soundCues";
import { createCourtyardScene } from "./scenes/courtyardScene";
import { createWorkshopScene } from "./scenes/workshopScene";
import { createBasementScene } from "./scenes/basementScene";
import { createSpaceScene } from "./scenes/spaceScene";
import { shots, type FilmContext } from "./shots";

const FILM_DURATION = 216.0; // 3 minutes 36 seconds (Hard limit <= 360s)

// 1. Validate voice cue manifest
validateVoiceCues(voiceCues, FILM_DURATION);

// 2. Setup Three.js Scene, Camera, and Renderer
const container = document.querySelector<HTMLElement>("#stage") || document.body;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070a);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 1.8, 3.5);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// 3. Build scenes
const courtyard = createCourtyardScene();
scene.add(courtyard.root);

const workshop = createWorkshopScene();
scene.add(workshop.root);
workshop.root.visible = false;

const basement = createBasementScene();
scene.add(basement.root);
basement.root.visible = false;

const space = createSpaceScene();
scene.add(space.root);
space.root.visible = false;

const context: FilmContext = {
  scene,
  camera,
  courtyard,
  workshop,
  basement,
  space,
};

// 4. Create Master Cinematic Player
const player = new CinematicPlayer<FilmContext>({
  duration: FILM_DURATION,
  context,
  shots,
  cues: [...voiceCues, ...soundCues],
  loop: false,
});

// 5. Mount Stage and Audio
const stage = new ThreeStage<FilmContext>({
  player,
  renderer: renderer as any,
  scene,
  camera: () => context.camera,
  container,
  maxPixelRatio: 2,
});

const audio = new WebAudioCueBus<FilmContext>(player);
setupAudioBus(audio as any);

// 6. Mount Cinematic Transport & Subtitles UI
mountCinematicControls({
  player: player as any,
  audio: audio as any,
  container: document.body,
  showFullscreen: true,
});

// Render initial first frame
player.refresh();

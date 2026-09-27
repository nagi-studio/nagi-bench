import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
} from "@agentbench/cinematic-player";
import { registerAudio, soundCues } from "./audio";
import { tickFaces } from "./cast";
import { createShots } from "./shots";
import { DURATION } from "./timeline";
import { voiceCues } from "./voice";
import { buildWorld } from "./world";
import "./style.css";

const stageEl = document.querySelector<HTMLElement>("#stage");
if (!stageEl) throw new Error("missing stage");

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.06, 280);
const world = buildWorld(scene, camera, renderer);
const shots = createShots();
const voices = validateVoiceCues(voiceCues, DURATION);

const player = new CinematicPlayer({
  duration: DURATION,
  context: world,
  shots,
  cues: [...voices, ...soundCues],
});

player.addTypedEventListener("frame", (event) => {
  tickFaces(world.cast, event.detail.time);
});

const view = new ThreeStage({
  player,
  renderer: {
    domElement: renderer.domElement,
    setSize: (width, height, updateStyle) => renderer.setSize(width, height, updateStyle),
    setPixelRatio: (ratio) => renderer.setPixelRatio(ratio),
    render: (nextScene, nextCamera) => renderer.render(nextScene as THREE.Scene, nextCamera as THREE.Camera),
    dispose: () => renderer.dispose(),
  },
  scene,
  camera: () => world.camera,
  container: stageEl,
  maxPixelRatio: 1.75,
});

const audio = new WebAudioCueBus(player);
registerAudio(audio);
mountCinematicControls({ player, audio, container: stageEl });

const vignette = document.createElement("div");
vignette.className = "vignette";
stageEl.appendChild(vignette);

window.addEventListener("error", (event) => {
  const box = document.createElement("pre");
  box.className = "err";
  box.textContent = event.error?.stack || event.message;
  document.body.appendChild(box);
});

void view;

import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
} from "@agentbench/cinematic-player";
import { buildShots, type FilmContext } from "./shots";
import { voiceCues } from "./voice";
import { soundCues, defineSamples, defineProcedural } from "./audio";
import { Overlay } from "./overlay";

export const DURATION = 345;

const container = document.querySelector<HTMLDivElement>("#stage")!;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070c);

const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 4000);
camera.position.set(0, 0, 6);

const context: FilmContext = { scene, camera };

const cues = validateVoiceCues(voiceCues, DURATION);

const player = new CinematicPlayer<FilmContext>({
  duration: DURATION,
  context,
  shots: buildShots(),
  cues: [...cues, ...soundCues],
});

const stage = new ThreeStage({
  player,
  renderer,
  scene,
  camera: () => context.camera,
  container,
  maxPixelRatio: 2,
});

const audio = new WebAudioCueBus(player);
defineSamples(audio);
defineProcedural(audio);

const controls = mountCinematicControls({ player, audio });

const overlay = new Overlay(document.body);
player.addTypedEventListener("frame", (event) => {
  overlay.update(event.detail.time);
});
overlay.update(0);

// expose for headless inspection
(window as unknown as { __film?: unknown }).__film = { player, stage, audio, controls };

import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
  type ThreeRendererLike,
} from "@agentbench/cinematic-player";
import { voiceCues, FILM_DURATION } from "./film/voice";
import { soundCues, defineSamples, defineProcedural } from "./film/sfx";
import { buildWorld } from "./film/world";
import { buildShots } from "./film/shots";

const app = document.getElementById("app")!;
const stageEl = document.getElementById("stage")!;

/* ---------- renderer ---------- */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
  preserveDrawingBuffer: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(40, 1, 0.3, 160000);

/* ---------- world + shots ---------- */
const world = buildWorld(scene, camera);
const shots = buildShots(world);
const cues = [...voiceCues, ...soundCues];
validateVoiceCues(voiceCues, FILM_DURATION);

const player = new CinematicPlayer({
  duration: FILM_DURATION,
  context: world,
  shots,
  cues,
});

/* ---------- audio ---------- */
const audio = new WebAudioCueBus<typeof world>(player);
defineSamples(audio);
defineProcedural(audio);
audio.setGroupGain("amb", 0.9);
audio.setGroupGain("music", 0.9);

/* ---------- stage + controls ---------- */
const stage = new ThreeStage({
  player,
  renderer: renderer as unknown as ThreeRendererLike,
  scene,
  camera: () => world.camera,
  container: stageEl,
  maxPixelRatio: 1.8,
});

/* The transport button awaits `audio.unlock()` before starting playback.
 * Some environments (e.g. headless shells without an audio device) never
 * resolve `AudioContext.resume()`, which would freeze the play button.
 * The facade resolves immediately, starts the real unlock in the background,
 * and forwards every other call. */
const controlsAudio = {
  unlock(): Promise<unknown> {
    void audio.unlock().catch(() => undefined);
    return Promise.resolve(undefined);
  },
  setMasterGain(v: number): void {
    audio.setMasterGain(v);
  },
  setGroupGain(g: string, v: number): void {
    audio.setGroupGain(g, v);
  },
} as WebAudioCueBus<typeof world>;

const controls = mountCinematicControls({ player, audio: controlsAudio, container: app });

/* ---------- pre-play hint ---------- */
player.addTypedEventListener("statechange", (event) => {
  if (event.detail.state === "playing") {
    world.overlay.hideHint();
  }
});

/* expose for inspection */
declare global {
  interface Window {
    __film?: {
      player: CinematicPlayer<typeof world>;
      audio: WebAudioCueBus<typeof world>;
      scene: THREE.Scene;
      world: typeof world;
      three: typeof THREE;
    };
  }
}
window.__film = { player, audio, scene, world, three: THREE };

/* keep references alive */
void stage;
void controls;

import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
} from "@agentbench/cinematic-player";
import { buildWorld, type FilmContext } from "./film/context";
import { buildShots } from "./film/shots";
import { voiceCues } from "./film/voice";
import { soundCues } from "./film/sound";
import { DURATION } from "./film/constants";
import { registerSounds } from "./audio/design";
import { paintGrain } from "./world/textures";

const container = document.getElementById("stage")!;
const curtain = document.getElementById("curtain")!;
const curtainLabel = document.getElementById("curtain-label")!;

// ---- Renderer: filmic tone mapping, soft shadows, sRGB output ----
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ctx: FilmContext = buildWorld(renderer, container);

// ---- Validate the speech manifest early ----
validateVoiceCues(voiceCues, DURATION);

const shots = buildShots(ctx);
const player = new CinematicPlayer<FilmContext>({
  duration: DURATION,
  context: ctx,
  shots,
  cues: [...voiceCues, ...soundCues],
});

// ---- Audio: every sound synthesised at runtime ----
const audio = new WebAudioCueBus(player);
registerSounds(audio);
audio.setMasterGain(0.85);
audio.setGroupGain("music", 0.8);
audio.setGroupGain("ambience", 0.9);
audio.setGroupGain("suit", 1.0);
audio.setGroupGain("radio", 0.9);

// ---- Stage + transport ----
const stage = new ThreeStage({
  player,
  renderer,
  scene: ctx.scene,
  camera: () => ctx.camera,
  container,
  maxPixelRatio: 2,
});
const controls = mountCinematicControls({ player, audio, container: document.getElementById("app")! });

// ---- Film grain overlay ----
const stopGrain = paintGrain(document.getElementById("grain") as HTMLCanvasElement);

// ---- Start / replay curtain ----
let started = false;
async function startPlayback(): Promise<void> {
  await audio.unlock();
  if (player.state === "ended") player.seek(0);
  player.play();
  started = true;
  curtain.classList.add("hidden");
}
curtain.addEventListener("click", () => void startPlayback());

player.addTypedEventListener("statechange", ({ detail }) => {
  if (detail.state === "playing") {
    curtain.classList.add("hidden");
  } else if (detail.state === "ended") {
    curtainLabel.textContent = "重新播放";
    curtain.classList.remove("hidden");
  }
});

// Spacebar toggles playback; arrows seek.
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (!started) void startPlayback();
    else if (player.isPlaying) player.pause();
    else void startPlayback();
  } else if (e.code === "ArrowRight") {
    player.seek(Math.min(DURATION, player.currentTime + 5));
  } else if (e.code === "ArrowLeft") {
    player.seek(Math.max(0, player.currentTime - 5));
  }
});

// ---- Inspection / verification hook ----
(window as unknown as Record<string, unknown>).__film = {
  player, audio, ctx, stage, controls,
  voiceCues, soundCues, shots,
  play: () => startPlayback(),
  seek: (t: number) => player.seek(t),
};

// Ensure a useful first frame even before playback.
player.refresh();

// Clean up on page hide (hot reload / navigation).
window.addEventListener("pagehide", () => {
  stopGrain();
  controls.destroy();
  stage.destroy(true);
  audio.destroy();
  player.destroy();
});

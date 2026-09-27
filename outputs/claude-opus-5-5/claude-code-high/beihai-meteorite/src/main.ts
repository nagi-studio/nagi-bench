import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
} from "@agentbench/cinematic-player";
import { voiceCues } from "./voice";
import { buildSoundCues, registerSounds, GROUP_GAINS } from "./sound";
import { buildShots, showSet, type Ctx } from "./shots";
import { SpaceSet } from "./sets/space";
import { HutongSet } from "./sets/hutong";
import { RoomSet } from "./sets/room";
import { ShopSet } from "./sets/shop";
import { BasementSet } from "./sets/basement";
import { Overlay } from "./overlay";
import { canvasTex } from "./util";

export const DURATION = 358;

const container = document.querySelector<HTMLElement>("#stage")!;

const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.02, 300000);

const duskSky = canvasTex(4, 256, (c) => {
  const g = c.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#0e1428");
  g.addColorStop(0.45, "#2a3456");
  g.addColorStop(0.72, "#6a5a70");
  g.addColorStop(0.88, "#c07a5a");
  g.addColorStop(1, "#d8a070");
  c.fillStyle = g;
  c.fillRect(0, 0, 4, 256);
});

const space = new SpaceSet();
const hutong = new HutongSet();
const room = new RoomSet();
const shop = new ShopSet();
const basement = new BasementSet();
for (const g of [space.group, hutong.group, room.group, shop.group, basement.group]) {
  g.visible = false;
  scene.add(g);
}
// Keep the sky dome (stars, Earth, Sun) centred on whichever camera is rendering.
scene.onBeforeRender = (_r, _s, cam) => {
  if (space.group.visible) space.follow(cam);
};

const ctx: Ctx = { scene, camera, renderer, space, hutong, room, shop, basement, current: "", duskSky };

validateVoiceCues(voiceCues, DURATION);
const soundCues = buildSoundCues(DURATION);

const player = new CinematicPlayer<Ctx>({
  duration: DURATION,
  context: ctx,
  shots: buildShots(),
  cues: [...voiceCues, ...soundCues],
});

const overlay = new Overlay(container);
// Registered before ThreeStage so overlays are resolved before each render.
player.addTypedEventListener("frame", ({ detail }) => {
  overlay.update(detail.time, player.isPlaying);
});

// Pre-compile every set's shader permutations so cuts never hitch.
for (const name of ["space", "hutong", "room", "shop", "basement"] as const) {
  showSet(ctx, name);
  renderer.compile(scene, camera);
}
ctx.current = "";

const stage = new ThreeStage({
  player,
  renderer,
  scene,
  camera: () => ctx.camera,
  container,
  maxPixelRatio: 1.75,
});

const audio = new WebAudioCueBus(player);
registerSounds(audio);
audio.setMasterGain(0.85);
player.addTypedEventListener("statechange", ({ detail }) => {
  if (detail.state !== "playing") return;
  for (const [g, v] of Object.entries(GROUP_GAINS)) audio.setGroupGain(g, v);
});

const controls = mountCinematicControls({ player, audio, container });
player.refresh();

// Keyboard: space toggles playback, arrows seek.
window.addEventListener("keydown", async (e) => {
  const target = e.target as HTMLElement | null;
  if (target && (target.tagName === "BUTTON" || target.tagName === "INPUT")) return;
  if (e.code === "Space") {
    e.preventDefault();
    await audio.unlock();
    if (player.isPlaying) player.pause();
    else player.play();
  } else if (e.code === "ArrowRight") player.seek(Math.min(DURATION, player.currentTime + 5));
  else if (e.code === "ArrowLeft") player.seek(Math.max(0, player.currentTime - 5));
});

// Exposed for inspection and automated checks.
(window as any).__film = { player, stage, audio, controls, ctx };

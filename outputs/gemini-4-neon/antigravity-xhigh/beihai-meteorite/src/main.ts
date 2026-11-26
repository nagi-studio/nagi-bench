import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
  type ThreeRendererLike,
} from "@agentbench/cinematic-player";
import "./style.css";
import { voiceCues } from "./cues/voiceCues";
import { soundCues } from "./cues/soundCues";
import { registerProceduralSounds } from "./audio/synth";
import { createAllCharacterSkins } from "./characters/skins";
import {
  createCollectorCast,
  createOrbitalPhotoCrew,
  createZhangCast,
} from "./characters/cast";
import { createHutongSet } from "./sets/hutongSet";
import { createWorkshopSet } from "./sets/workshopSet";
import { createBasementSet } from "./sets/basementSet";
import { createOrbitSet } from "./sets/orbitSet";
import { FILM_DURATION, type FilmContext, type OverlayControls } from "./film/timeline";
import { createFilmShots } from "./film/shots";

// Re-export the structured voice manifest cleanly for downstream tooling & voice-over pipelines
export { voiceCues };

// Validate every single voice cue early (exact 7 fields, unique ids, within duration)
const validatedVoiceCues = validateVoiceCues(voiceCues, FILM_DURATION);

// =========================================================================
// 1. THREE.JS RENDERER, SCENE & CAMERA
// =========================================================================
const stageContainer = document.querySelector<HTMLElement>("#stage")!;
const cinemaRoot = document.querySelector<HTMLElement>("#cinema-root")!;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02040a);

const camera = new THREE.PerspectiveCamera(44, 16 / 9, 0.08, 1200);

// =========================================================================
// 2. VOXEL KIT CHARACTERS & FOUR VOXEL SETS
// =========================================================================
const skins = createAllCharacterSkins();
const zhang = createZhangCast(skins);
const collector = createCollectorCast(skins);
const orbitalCrew = createOrbitalPhotoCrew(skins);

scene.add(zhang.figure.root);
scene.add(collector.figure.root);
collector.figure.root.visible = false;

const hutong = createHutongSet();
const workshop = createWorkshopSet();
const basement = createBasementSet();
const orbit = createOrbitSet(orbitalCrew);

scene.add(hutong.root, workshop.root, basement.root, orbit.root);

// =========================================================================
// 3. SYNCHRONIZED CINEMA OVERLAYS (Fades, Optical Scope, Titles)
// =========================================================================
const fadeEl = document.querySelector<HTMLElement>("#fade-curtain")!;
const scopeEl = document.querySelector<HTMLElement>("#scope-overlay")!;
const scopeStatusEl = document.querySelector<HTMLElement>("#scope-hud-status")!;
const openTitleEl = document.querySelector<HTMLElement>("#opening-title")!;
const endTitleEl = document.querySelector<HTMLElement>("#ending-title")!;

const overlays: OverlayControls = {
  setFade(opacity, color = "#010205") {
    fadeEl.style.opacity = String(Math.max(0, Math.min(1, opacity)));
    fadeEl.style.backgroundColor = color;
  },
  setScope(opacity, statusText) {
    scopeEl.style.opacity = String(Math.max(0, Math.min(1, opacity)));
    if (statusText !== undefined) scopeStatusEl.textContent = statusText;
  },
  setOpeningTitle(opacity) {
    openTitleEl.style.opacity = String(Math.max(0, Math.min(1, opacity)));
  },
  setEndingTitle(opacity) {
    endTitleEl.style.opacity = String(Math.max(0, Math.min(1, opacity)));
  },
};

const envBg: Record<"orbit" | "hutong" | "workshop" | "basement", number> = {
  orbit: 0x02040a,
  hutong: 0x160f0b,
  workshop: 0x09111a,
  basement: 0x0b0d10,
};

const envFog: Record<"orbit" | "hutong" | "workshop" | "basement", THREE.FogExp2 | null> = {
  orbit: null,
  hutong: new THREE.FogExp2(0x1f140d, 0.045),
  workshop: new THREE.FogExp2(0x0d1824, 0.042),
  basement: new THREE.FogExp2(0x14171c, 0.055),
};

const setActiveEnvironment: FilmContext["setActiveEnvironment"] = (env) => {
  orbit.root.visible = env === "orbit";
  hutong.root.visible = env === "hutong";
  workshop.root.visible = env === "workshop";
  basement.root.visible = env === "basement";
  collector.figure.root.visible = env === "hutong";
  scene.background = new THREE.Color(envBg[env]);
  scene.fog = envFog[env];
};

const context: FilmContext = {
  scene,
  camera,
  renderer,
  skins,
  zhang,
  collector,
  hutong,
  workshop,
  basement,
  orbit,
  overlays,
  setActiveEnvironment,
};

// =========================================================================
// 4. MASTER CINEMATIC PLAYER, PROCEDURAL AUDIO BUS, STAGE & TRANSPORT UI
// =========================================================================
const shots = createFilmShots();

const player = new CinematicPlayer<FilmContext>({
  duration: FILM_DURATION,
  context,
  shots,
  cues: [...validatedVoiceCues, ...soundCues],
  loop: false,
});

const audio = new WebAudioCueBus(player);
registerProceduralSounds(audio);
audio.setMasterGain(0.82);

const stage = new ThreeStage({
  player,
  renderer: renderer as unknown as ThreeRendererLike,
  scene,
  camera: () => context.camera,
  container: stageContainer,
  maxPixelRatio: 2,
});

const controls = mountCinematicControls({
  player,
  audio,
  container: cinemaRoot,
  showFullscreen: true,
});

// Expose clean handles on window for automated verification & inspection
declare global {
  interface Window {
    __METEOR_SHOWER__?: {
      player: CinematicPlayer<FilmContext>;
      audio: WebAudioCueBus<FilmContext>;
      stage: ThreeStage<FilmContext>;
      controls: ReturnType<typeof mountCinematicControls>;
      voiceCues: typeof validatedVoiceCues;
    };
  }
}

window.__METEOR_SHOWER__ = {
  player,
  audio,
  stage,
  controls,
  voiceCues: validatedVoiceCues,
};

// Guarantee crisp first frame at t = 0 before Play is clicked
player.seek(0);

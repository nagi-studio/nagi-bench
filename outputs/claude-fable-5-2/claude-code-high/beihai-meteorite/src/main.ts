import * as THREE from "three";
import { ThreeStage, WebAudioCueBus, mountCinematicControls } from "@agentbench/cinematic-player";
import { createFilm } from "./film";
import { registerSounds } from "./audio/synth";
import { voiceCues } from "./cues/voice";
import { soundCues } from "./cues/sound";

const app = document.querySelector<HTMLElement>("#app")!;
const stageEl = document.querySelector<HTMLElement>("#stage")!;
const el = (id: string): HTMLElement => document.getElementById(id)!;

const film = createFilm();
const { player, ctx } = film;

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 1);

/**
 * The stage talks to this thin wrapper so that exposure follows the shot and the
 * internal resolution can step down if the machine cannot hold real time (the
 * timeline must never run slow because a frame was expensive).
 */
let baseRatio = 1, scale = 1, lastW = 1, lastH = 1;
const view = {
  domElement: renderer.domElement,
  setPixelRatio(ratio: number): void {
    baseRatio = ratio;
    renderer.setPixelRatio(baseRatio * scale);
  },
  setSize(width: number, height: number, updateStyle?: boolean): void {
    lastW = width;
    lastH = height;
    renderer.setSize(width, height, updateStyle);
  },
  render(scene: unknown, camera: unknown): void {
    renderer.toneMappingExposure = ctx.exposure;
    renderer.render(scene as THREE.Scene, camera as THREE.Camera);
  },
  dispose(): void {
    renderer.dispose();
  },
};

const stage = new ThreeStage({ player, renderer: view, scene: ctx.scene, camera: () => ctx.camera, container: stageEl, maxPixelRatio: 1.5 });

// Compile every set's shaders and upload its textures before the first play.
for (const t of [60, 18, 130, 166.47, 230, 293.6, 340, 5]) {
  player.seek(t);
  renderer.compile(ctx.scene, ctx.camera);
}
player.seek(0);

const audio = new WebAudioCueBus(player);
registerSounds(audio);
const controls = mountCinematicControls({ player, audio, container: app });

/* ---------- screen-space overlays driven by the shots ---------- */
const fade = el("fade"), flash = el("flash"), scope = el("scope"), caption = el("caption"), title = el("title"), endcard = el("endcard");
const poster = el("poster");
let lastCaption = "";
const applyOverlay = (): void => {
  const o = ctx.overlay;
  fade.style.opacity = o.fade.toFixed(3);
  fade.style.background = o.fadeColour;
  flash.style.opacity = o.flash.toFixed(3);
  scope.style.opacity = o.scope.toFixed(3);
  if (o.caption !== lastCaption) {
    lastCaption = o.caption;
    caption.textContent = o.caption;
  }
  caption.style.opacity = o.captionAlpha.toFixed(3);
  title.style.opacity = o.title.toFixed(3);
  endcard.style.opacity = o.endCard.toFixed(3);
};

let frames = 0, slowSince = 0, lastStamp = 0, avg = 16;
player.addTypedEventListener("frame", (event) => {
  applyOverlay();
  if (event.detail.reason !== "play") return;
  const now = performance.now();
  if (lastStamp) {
    avg = avg * 0.9 + Math.min(250, now - lastStamp) * 0.1;
    frames++;
    if (avg > 48 && frames > 20) {
      slowSince++;
      if (slowSince > 30 && scale > 0.4) {
        scale = Math.max(0.4, scale * 0.75);
        renderer.setPixelRatio(baseRatio * scale);
        renderer.setSize(lastW, lastH, false);
        slowSince = 0;
        frames = 0;
      }
    } else slowSince = 0;
  }
  lastStamp = now;
});
player.addTypedEventListener("statechange", (event) => {
  lastStamp = 0;
  if (event.detail.state === "playing") poster.classList.add("hidden");
});
applyOverlay();

/* ---------- transport conveniences ---------- */
const toggle = async (): Promise<void> => {
  await audio.unlock();
  if (player.isPlaying) player.pause();
  else player.play();
};
el("poster-play").addEventListener("click", (e) => {
  e.stopPropagation();
  void toggle();
});
poster.addEventListener("click", () => void toggle());
window.addEventListener("keydown", (e) => {
  // Leave keys alone while a transport button or slider has focus, so nothing toggles twice.
  const tag = (e.target as HTMLElement | null)?.tagName;
  if (tag === "BUTTON" || tag === "INPUT") return;
  if (e.code === "Space") {
    e.preventDefault();
    void toggle();
  } else if (e.code === "ArrowRight") player.seek(Math.min(player.duration, player.currentTime + 5));
  else if (e.code === "ArrowLeft") player.seek(Math.max(0, player.currentTime - 5));
});

// Handles for inspection and for the dubbing pipeline.
Object.assign(window as unknown as Record<string, unknown>, {
  __film: { player, stage, audio, controls, voiceCues, soundCues, shots: film.shots },
});

import * as THREE from "three";
import "./style.css";
import { AudioEngine } from "./lib/audio";
import { Post } from "./lib/postfx";
import { buildWorld } from "./film/world";
import { Director, type DomRefs } from "./film/director";
import { SFX } from "./film/soundtrack";
import { cueAt, validateCues } from "./film/cues";
import { FILM_DURATION } from "./film/shots";

/* ------------------------------------------------------------------ dom */
const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const dom: DomRefs = {
  subtitle: $("subtitle"),
  subtitleText: $("subtitle-text"),
  card: $("card"),
  cardMain: $("card-main"),
  cardSub: $("card-sub"),
  curtain: $("curtain"),
  hudTime: $("hud-time"),
  hudShot: $("hud-shot"),
  progress: $("progress"),
  progressFill: $("progress-fill")
};
const stage = $("stage");
const boot = $("boot");
const bootFill = $("boot-fill");
const bootStatus = $("boot-status");
const soundHint = $("sound-hint");
const hud = $("hud");

/* -------------------------------------------------------------- samples */
// Vite rewrites these to hashed asset URLs; relative to the bundle for the
// file:// / static-host case.
const ALL_SAMPLES = import.meta.glob("./assets/audio/*.ogg", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

function sampleUrl(name: string): string | undefined {
  return ALL_SAMPLES[`./assets/audio/${name}.ogg`];
}

function collectSamples(): Record<string, string> {
  const used = new Set<string>();
  for (const c of SFX) if (c.sample) used.add(c.sample);
  // variants chosen at runtime
  const extras = [
    "footstep_concrete_000", "footstep_concrete_001", "footstep_concrete_002", "footstep_concrete_003",
    "footstep_wood_000", "footstep_wood_001", "footstep_wood_002", "footstep_wood_003",
    "click1", "click2", "click3", "click4",
    "impactMetal_light_001", "impactMetal_light_002", "impactMetal_light_003",
    "explosionCrunch_000", "explosionCrunch_001", "impactMetal_heavy_002",
    "impactPunch_heavy_000", "impactPunch_heavy_002", "lowFrequency_explosion_000", "lowFrequency_explosion_001",
    "computerNoise_000", "computerNoise_001", "computerNoise_002",
    "engineCircular_000", "engineCircular_002", "engineCircular_003",
    "spaceEngineLow_000", "spaceEngineLow_001", "thrusterFire_002", "thrusterFire_004",
    "doorOpen_000", "doorClose_001", "rollover2", "impactTin_medium_000", "impactTin_medium_001",
    "impactTin_medium_003", "impactSoft_medium_000", "impactWood_medium_000",
    "impactMetal_medium_000", "impactMetal_medium_003"
  ];
  for (const e of extras) used.add(e);
  const out: Record<string, string> = {};
  for (const name of used) {
    const u = sampleUrl(name);
    if (u) out[name] = u;
  }
  return out;
}

/* ------------------------------------------------------------- renderer */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
  alpha: false,
  stencil: false
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);

/* ---------------------------------------------------------------- world */
bootFill.style.width = "22%";
bootStatus.textContent = "正在搭建体素世界…";
const world = buildWorld();
bootFill.style.width = "58%";
bootStatus.textContent = "正在校准镜头与光…";

const post = new Post(renderer, world.scene, world.camera);

/* ----------------------------------------------------------------- audio */
let audio: AudioEngine | null = null;
let audioReady = false;
try {
  audio = new AudioEngine();
} catch {
  audio = null;
}

async function loadAudio(): Promise<void> {
  if (!audio) return;
  const urls = collectSamples();
  bootStatus.textContent = `正在生成声音…（${Object.keys(urls).length} 个采样）`;
  try {
    await audio.load(urls);
    audioReady = true;
  } catch {
    audioReady = false;
  }
}

/* --------------------------------------------------------------- director */
const director = new Director(world, audio, dom);
(world as unknown as { director?: Director }).director = director;
(window as unknown as { __film?: unknown }).__film = { world, director, renderer, post, get audio() { return audio; }, FILM_DURATION };

// debug / validation hook
const errors = validateCues();
if (errors.length) console.warn("[cues]", errors);

/* ------------------------------------------------------------------- boot */
bootFill.style.width = "80%";
let started = false;

function startFilm(): void {
  if (started) return;
  started = true;
  bootFill.style.width = "100%";
  bootStatus.textContent = "开始";
  boot.style.opacity = "0";
  window.setTimeout(() => {
    boot.style.display = "none";
    soundHint.classList.add("show");
    window.setTimeout(() => soundHint.classList.remove("show"), 7000);
  }, 900);
  // try to run with sound immediately; if the context is suspended a gesture
  // will resume it and the visuals keep going regardless.
  audio?.resume();
}

bootFill.style.width = "100%";
// Load audio but never hold the picture hostage to it.
const audioLoad = loadAudio();
Promise.race([audioLoad, new Promise((r) => window.setTimeout(r, 1400))])
  .then(startFilm)
  .catch(startFilm);

/* ------------------------------------------------------------------ input */
let last = performance.now();
let hudOn = false;

function onGesture(): void {
  audio?.resume();
  soundHint.classList.remove("show");
}
window.addEventListener("pointerdown", onGesture);
window.addEventListener("keydown", onGesture);

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    director.togglePlay();
  } else if (e.code === "ArrowRight") {
    director.seek(director.time + 5);
  } else if (e.code === "ArrowLeft") {
    director.seek(director.time - 5);
  } else if (e.key === "r" || e.key === "R") {
    director.restart();
  } else if (e.key === "m" || e.key === "M") {
    if (audio) audio.setMuted(!audio.muted);
  } else if (e.key === "h" || e.key === "H") {
    hudOn = !hudOn;
    hud.classList.toggle("show", hudOn);
    dom.progress.classList.toggle("show", hudOn);
  } else if (e.key === "f" || e.key === "F") {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen();
  }
});

window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  world.camera.aspect = w / h;
  world.camera.updateProjectionMatrix();
  post.setSize(w, h);
});

/* -------------------------------------------------------------- main loop */
function frame(now: number): void {
  requestAnimationFrame(frame);
  const raw = (now - last) / 1000;
  last = now;
  // clamp so a backgrounded tab does not fast-forward the whole film
  const dt = Math.min(Math.max(raw, 0), 1 / 24);

  if (started) director.update(dt);
  else {
    // show the first frame under the boot card
    world.time = 0;
    world.dt = dt;
    world.tick(0, dt);
  }

  renderer.toneMappingExposure = world.env.exposure;
  post.render(dt, world.time, world.env.bloom, 0);
}

requestAnimationFrame(frame);

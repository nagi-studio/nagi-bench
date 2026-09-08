/**
 * Headless film check (Bun).
 *
 * Builds the real world, runs the real director across the whole timeline at
 * 30 fps with no browser and no audio, and asserts the things a reviewer would
 * care about: the film fits in 360 s, every shot is contiguous, every voice cue
 * is well-formed and on the clock, every referenced sample exists, and nothing
 * throws while the whole thing plays.
 */

import * as THREE from "three";

/* ------------------------------------------------------------- DOM shims */
const g = globalThis as unknown as Record<string, unknown>;
if (!g.window) {
  g.window = {
    setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
    clearTimeout: (h: unknown) => clearTimeout(h as ReturnType<typeof setTimeout>),
    addEventListener: () => void 0,
    innerWidth: 1280,
    innerHeight: 720,
    devicePixelRatio: 1
  };
}
if (!g.document) {
  g.document = {
    getElementById: () => null,
    createElement: () => ({ getContext: () => null, style: {} }),
    createElementNS: () => ({ style: {}, setAttribute: () => void 0 }),
    addEventListener: () => void 0
  };
}
if (!g.requestAnimationFrame) {
  g.requestAnimationFrame = (cb: (t: number) => void) => setTimeout(() => cb(performance.now()), 16);
}

import { buildWorld } from "../src/film/world";
import { Director } from "../src/film/director";
import { SHOTS, FILM_DURATION, CARDS } from "../src/film/shots";
import { cueAt, subtitleText, validateCues, VOICE_CUES } from "../src/film/cues";
import { SFX, validateSfx } from "../src/film/soundtrack";
import { readdirSync, existsSync } from "node:fs";

const errors: string[] = [];
const warn: string[] = [];

/* ------------------------------------------------------------ manifest */
const cueErrs = validateCues();
errors.push(...cueErrs);
const sfxErrs = validateSfx();
errors.push(...sfxErrs);

const REQUIRED_FIELDS = ["id", "kind", "speaker", "text", "delivery", "start", "end"] as const;
for (const c of VOICE_CUES) {
  for (const f of REQUIRED_FIELDS) {
    if (!(f in c) || c[f] === undefined || c[f] === null || c[f] === "") errors.push(`cue ${c.id} missing field ${f}`);
  }
  if (Object.keys(c).length !== 7) errors.push(`cue ${c.id} has ${Object.keys(c).length} fields, expected 7`);
  if (!/^[\u4e00-\u9fffA-Za-z0-9（）()：:·；;、，。！？…—\-\s]+$/.test(c.text)) warn.push(`cue ${c.id} unusual text: ${c.text}`);
  if (!subtitleText(c).startsWith("【")) errors.push(`cue ${c.id} subtitle must start with 【`);
  if (cueAt((c.start + c.end) / 2)?.id !== c.id) errors.push(`cue ${c.id} not active at its midpoint`);
}

/* -------------------------------------------------------------- timeline */
if (FILM_DURATION > 360) errors.push(`film duration ${FILM_DURATION}s exceeds 360s`);
let cursor = 0;
for (const s of SHOTS) {
  if (Math.abs(s.start - cursor) > 0.001) errors.push(`shot ${s.id} starts at ${s.start}, expected ${cursor}`);
  if (s.end <= s.start) errors.push(`shot ${s.id} has non-positive length`);
  cursor = s.end;
}
if (Math.abs(cursor - FILM_DURATION) > 0.001) errors.push(`shot list ends at ${cursor}, FILM_DURATION=${FILM_DURATION}`);
for (const c of CARDS) {
  if (c.end > FILM_DURATION) errors.push(`title card past end: ${c.main || c.sub}`);
}
for (const c of VOICE_CUES) {
  if (c.end > FILM_DURATION) errors.push(`voice cue ${c.id} ends after film end`);
  const shot = SHOTS.find((s) => c.start >= s.start && c.start < s.end);
  if (!shot) errors.push(`voice cue ${c.id} at ${c.start} is outside every shot`);
}
for (const c of SFX) {
  if (c.time > FILM_DURATION) errors.push(`sfx ${c.id} at ${c.time} is after the end`);
}

/* -------------------------------------------------------------- samples */
const audioDir = new URL("../src/assets/audio/", import.meta.url).pathname;
const files = new Set(existsSync(audioDir) ? readdirSync(audioDir).map((f) => f.replace(/\.ogg$/, "")) : []);
const referenced = new Set<string>();
for (const c of SFX) if (c.sample) referenced.add(c.sample);
for (const n of [
  "footstep_concrete_000", "footstep_concrete_001", "footstep_concrete_002", "footstep_concrete_003",
  "footstep_wood_000", "footstep_wood_001", "footstep_wood_002", "footstep_wood_003", "click3"
]) referenced.add(n);
for (const n of referenced) if (!files.has(n)) errors.push(`missing sample file: ${n}.ogg`);

/* ------------------------------------------------------------- run film */
function stubEl(): unknown {
  return {
    textContent: "",
    style: { opacity: "0", width: "0%", display: "" },
    classList: { add: () => void 0, remove: () => void 0, toggle: () => void 0 }
  };
}
const dom = {
  subtitle: stubEl(),
  subtitleText: stubEl(),
  card: stubEl(),
  cardMain: stubEl(),
  cardSub: stubEl(),
  curtain: stubEl(),
  hudTime: stubEl(),
  hudShot: stubEl(),
  progress: stubEl(),
  progressFill: stubEl()
};

const world = buildWorld();
const director = new Director(world, null, dom as never);

const seenSets = new Set<string>();
const shotTriangles = new Map<string, number>();
const activeActors = new Map<string, number>();
let frames = 0;
let maxTri = 0;
let maxTriShot = "";

const STEP = 1 / 30;
function vis(o: THREE.Object3D): boolean {
  let p: THREE.Object3D | null = o;
  while (p) {
    if (!p.visible) return false;
    p = p.parent;
  }
  return true;
}
let t = 0;
let guard = 0;
while (t < FILM_DURATION && guard < 40000) {
  guard++;
  director.playing = true;
  director.update(STEP);
  t = director.time;
  frames++;
  const shot = SHOTS.find((s) => t >= s.start && t < s.end) ?? SHOTS[SHOTS.length - 1];
  seenSets.add(shot.set);
  if (t % 2 < STEP) {
    let tri = 0;
    let actors = 0;
    world.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if ((m as unknown as { isMesh?: boolean }).isMesh && vis(o) && m.geometry) {
        const pos = m.geometry.getAttribute("position");
        const idx = m.geometry.getIndex();
        if (pos) tri += (idx ? idx.count : pos.count) / 3;
      }
    });
    for (const k of Object.keys(world.cast)) if (vis(world.cast[k].root)) actors++;
    if (tri > maxTri) {
      maxTri = tri;
      maxTriShot = shot.id;
    }
    shotTriangles.set(shot.id, Math.max(shotTriangles.get(shot.id) ?? 0, tri));
    activeActors.set(shot.id, actors);
  }
}

/* --------------------------------------------------------------- report */
const fmt = (n: number) => n.toLocaleString("en-US");
console.log("=== 北海 · 陨石 — headless film check ===");
console.log(`duration            : ${FILM_DURATION.toFixed(1)} s  (limit 360)`);
console.log(`shots               : ${SHOTS.length}`);
console.log(`voice cues          : ${VOICE_CUES.length}`);
console.log(`sfx cues            : ${SFX.length}`);
console.log(`samples referenced  : ${referenced.size}`);
console.log(`frames simulated    : ${frames}`);
console.log(`sets used           : ${[...seenSets].sort().join(", ")}`);
console.log(`peak triangles/frame: ${fmt(Math.round(maxTri))} in shot ${maxTriShot}`);
console.log("");
console.log("per-shot peak triangles:");
for (const s of SHOTS) {
  console.log(`  ${s.id.padEnd(4)} ${fmt(Math.round(shotTriangles.get(s.id) ?? 0)).padStart(9)} tri  ${(activeActors.get(s.id) ?? 0).toString().padStart(2)} actors  ${s.note}`);
}

if (warn.length) {
  console.log("\nwarnings:");
  for (const w of warn) console.log("  ! " + w);
}
if (errors.length) {
  console.log("\nERRORS:");
  for (const e of errors) console.log("  x " + e);
  process.exit(1);
}
console.log("\nOK — no errors.");

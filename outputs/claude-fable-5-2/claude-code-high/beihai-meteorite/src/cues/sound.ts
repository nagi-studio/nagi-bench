import type { SoundCue } from "@agentbench/cinematic-player";
import {
  T, DURATION, STONE_THUNKS, DRILL_PLUNGES, TRAY_START, TRAY_END, LIGHTS_OUT, TEST_SHOTS, MAG_CLICKS, MAG_INSERT, SLIDE_RACK,
  BURST1, BURST3, MAG_SWAP1, IMPACT, THRUST,
} from "../timeline";
import { voiceCues } from "./voice";

/**
 * Every non-speech sound in the film, as timeline cues. All of them are
 * synthesised at run time by the factories in audio/synth.ts.
 *
 * Sound follows where the microphone could physically be:
 *  - on Earth, in air: rooms, tools, an indoor gunshot with its reflections;
 *  - in orbit: only what a suit lets you hear — breath, a fan, radio, and blows
 *    conducted through the glove and the arm. The pistol itself is silent, and
 *    the one wide shot of the firing has no sound at all.
 * Heartbeat and tonal beds are subjective / score, not sources in the scene.
 */

const cues: SoundCue[] = [];
let n = 0;
function add(sound: string, start: number, end: number, gain = 1, opts: { group?: string; sustain?: boolean; payload?: unknown } = {}): void {
  const s = Math.max(0, +start.toFixed(3));
  const e = Math.min(DURATION, +Math.max(end, start + 0.05).toFixed(3));
  if (e <= s) return;
  cues.push({ id: `s${String(++n).padStart(3, "0")}-${sound}`, kind: "sound", sound, group: opts.group ?? "sfx", gain, sustain: opts.sustain ?? false, start: s, end: e, payload: opts.payload });
}
const amb = (sound: string, start: number, end: number, gain: number, payload?: unknown): void => add(sound, start, end, gain, { group: "amb", sustain: true, payload });
const score = (sound: string, start: number, end: number, gain: number, payload?: unknown): void => add(sound, start, end, gain, { group: "score", sustain: true, payload });
const steps = (from: number, to: number, every: number, gain: number, kind: "stone" | "brick" | "concrete"): void => {
  let i = 0;
  for (let t = from; t < to; t += every) add("step", t, t + 0.25, gain * (i++ % 2 ? 0.85 : 1), { payload: { kind, alt: i % 2 } });
};

/* ── A: cold open ── */
amb("fan", 0, T.B1, 0.8);
amb("breath", 0.2, T.B1 - 0.3, 0.9, { period: 4.8 });
score("pad", 0, T.B1, 0.55, { notes: [73.42, 110, 146.83], attack: 3, release: 0.4 });
add("boom", 9.5, 13.5, 0.7, { group: "score" });

/* ── B: courtyard and the collector's room ── */
amb("hutong", T.B1, T.B2 + 0.4, 0.9);
steps(14.8, 21.4, 0.4, 0.5, "stone");
add("creak", 22.25, 23.6, 0.7);
amb("room", T.B2, T.C1, 0.9);
steps(23.1, 26.6, 0.435, 0.34, "brick");
add("clink", 32.0, 32.5, 0.5);
steps(46.3, 49.4, 0.385, 0.26, "brick");
add("clink", 63.4, 63.9, 0.22);
steps(76.3, 78.3, 0.45, 0.28, "brick");
steps(89.7, 91.6, 0.36, 0.26, "brick");
add("slide", 91.8, 93.1, 0.7);
STONE_THUNKS.forEach((t) => add("thunk", t, t + 0.5, 0.62));
add("blip", 107.5, 107.9, 0.5);
score("pad", 116.4, T.C1, 0.6, { notes: [55, 82.41, 110, 164.81], attack: 4.2, release: 0.15 });

/* ── C: workshop ── */
amb("shophum", T.C1, LIGHTS_OUT, 0.9);
steps(T.C1 + 0.4, T.C1 + 4.2, 0.42, 0.4, "concrete");
add("spindle", 124.4, LIGHTS_OUT - 2.2, 0.8, { sustain: true });
DRILL_PLUNGES.forEach(([a, b]) => add("grind", a, b, 0.85));
add("cutzip", TRAY_START, TRAY_END, 0.7, { sustain: true });
{
  const span = (TRAY_END - TRAY_START) / 36;
  for (let i = 0; i < 36; i++) add("tink", TRAY_START + i * span + span * 0.55 + 0.26, TRAY_START + i * span + span * 0.55 + 0.5, 0.8, { payload: { i } });
}
add("sweep", 144.3, 146.9, 0.6);
add("spindown", LIGHTS_OUT - 2.2, LIGHTS_OUT - 0.4, 0.8);
add("click", 147.5, 147.7, 0.6);
add("breaker", LIGHTS_OUT, LIGHTS_OUT + 0.6, 0.9);
score("pulse", T.C1 + 1, T.C5, 0.5);

/* ── C: basement ── */
amb("cellar", T.C5, T.D1 - 0.8, 0.9);
for (let i = 0; i < 18; i++) add("snick", 150.7 + i * 0.277, 150.9 + i * 0.277, 0.5, { payload: { i } });
score("pad", T.C5, 164.6, 0.45, { notes: [61.74, 92.5, 123.47], attack: 2.5, release: 0.3 });
MAG_CLICKS.forEach((t) => add("click", t, t + 0.2, 0.7));
add("clack", MAG_INSERT, MAG_INSERT + 0.3, 0.9);
add("rack", SLIDE_RACK, SLIDE_RACK + 0.4, 0.9);
TEST_SHOTS.forEach((t, i) => add("gunshot", t, t + 2.6, 1, { payload: { i } }));
add("tinnitus", TEST_SHOTS[0]! + 0.15, 177.5, 0.8, { sustain: true });
add("rip", 172.6, 173.9, 0.6);
add("gravel", 174.6, 175.6, 0.6);
add("whoosh", 177.7, T.D1, 0.7);

/* ── D: orbit ── */
// What Zhang hears inside his own helmet.
const mine: Array<[number, number]> = [[T.D1, T.D4], [T.D5, 271.6], [276, T.D9], [305.4, T.E1 - 0.6]];
mine.forEach(([a, b]) => amb("fan", a, b, 0.8));
amb("breath", T.D1 + 0.3, T.D4, 0.9, { period: 4.6 });
amb("breath", T.D5, T.D7 - 0.4, 0.9, { period: 4.2 });
amb("breath", T.D8 + 0.6, T.D9, 0.75, { period: 5.6 });
amb("breath", 305.6, THRUST, 0.85, { period: 4.4 });
amb("breath", THRUST + 0.5, T.E1 - 1.2, 0.7, { period: 5.2 });
// The group's own channel, heard only when the camera is among them.
amb("radiobed", T.D4, T.D5, 0.8);
amb("radiobed", T.D9, 305.4, 1);
for (const cue of voiceCues) {
  if (cue.kind !== "radio") continue;
  add("squelch", cue.start - 0.12, cue.start + 0.1, 0.6);
  add("squelch", cue.end, cue.end + 0.2, 0.45);
}
score("pad", T.D2, T.D3, 0.42, { notes: [146.83, 220, 293.66, 440], attack: 4, release: 2.5 });
add("ratchet", 240.6, 243.2, 0.7);
add("softthud", 243.2, 243.6, 0.5);
add("rustle", 246.6, 247.7, 0.5);
add("magthunk", 250.22, 250.6, 0.8);
score("pad", T.D6, T.D7 - 0.3, 0.5, { notes: [58.27, 87.31, 116.54], attack: 5, release: 0.2, shimmer: 1864.66 });
BURST1.forEach((t) => add("vacshot", t, t + 0.3, 0.9));
add("vacclick", MAG_SWAP1, MAG_SWAP1 + 0.2, 0.8);
add("vacclick", MAG_SWAP1 + 0.55, MAG_SWAP1 + 0.75, 0.6);
BURST3.forEach((t) => add("vacshot", t, t + 0.3, 0.9));
score("heartbeat", T.D8 + 0.3, IMPACT - 0.05, 0.7, { from: 62, to: 92 });
score("riser", 285.4, IMPACT - 0.02, 0.6);
add("radioburst", IMPACT, IMPACT + 0.7, 0.9);
add("leak", IMPACT + 0.1, 300.4, 0.7, { sustain: true });
add("alarm", IMPACT + 0.7, 305.4, 0.6, { sustain: true });
add("radioburst", IMPACT + 1.15, IMPACT + 1.6, 0.5);
score("pad", 305.4, T.D11, 0.4, { notes: [55, 82.41], attack: 3, release: 1.5 });
add("ratchet", 316.4, 317.8, 0.6);
add("thruster", THRUST, 331.5, 0.9, { sustain: true });
score("pad", T.D11 + 0.5, T.E1, 0.5, { notes: [73.42, 110, 146.83, 185, 220], attack: 5, release: 4 });

/* ── E: coda ── */
amb("room", T.E1, T.E2, 0.9);
add("rub", T.E1 + 0.3, 339.6, 0.5, { sustain: true });
add("ident", T.E1 + 0.25, T.E1 + 1.1, 0.5);
amb("oldradio", T.E1 + 0.2, 344.0, 0.9);
score("pad", 343.4, DURATION, 0.5, { notes: [73.42, 110, 146.83], attack: 3, release: 3.5 });

export const soundCues: SoundCue[] = cues;

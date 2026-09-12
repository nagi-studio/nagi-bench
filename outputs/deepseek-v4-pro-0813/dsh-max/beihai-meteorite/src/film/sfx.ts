import type { SoundCue, WebAudioCueBus } from "@agentbench/cinematic-player";
import type { SoundFactoryContext } from "@agentbench/cinematic-player";

/* ---------------- inlined CC0 samples ---------------- */
import bell from "../assets/audio/impactBell_heavy_000.ogg?inline";
import stepWood1 from "../assets/audio/footstep_wood_001.ogg?inline";
import stepWood2 from "../assets/audio/footstep_wood_002.ogg?inline";
import woodCreak from "../assets/audio/impactWood_medium_002.ogg?inline";
import glassLight1 from "../assets/audio/impactGlass_light_001.ogg?inline";
import glassLight2 from "../assets/audio/impactGlass_light_002.ogg?inline";
import glassLight3 from "../assets/audio/impactGlass_light_003.ogg?inline";
import softMed0 from "../assets/audio/impactSoft_medium_000.ogg?inline";
import softMed1 from "../assets/audio/impactSoft_medium_001.ogg?inline";
import softHeavy1 from "../assets/audio/impactSoft_heavy_001.ogg?inline";
import stepConcrete from "../assets/audio/footstep_concrete_001.ogg?inline";
import metalMed0 from "../assets/audio/impactMetal_medium_000.ogg?inline";
import metalMed1 from "../assets/audio/impactMetal_medium_001.ogg?inline";
import metalMed2 from "../assets/audio/impactMetal_medium_002.ogg?inline";
import metalLight1 from "../assets/audio/impactMetal_light_001.ogg?inline";
import metalLight2 from "../assets/audio/impactMetal_light_002.ogg?inline";
import metalHeavy0 from "../assets/audio/impactMetal_heavy_000.ogg?inline";
import tinMed1 from "../assets/audio/impactTin_medium_001.ogg?inline";
import explosionCrunch from "../assets/audio/explosionCrunch_001.ogg?inline";
import lowFreqBoom from "../assets/audio/lowFrequency_explosion_000.ogg?inline";
import engineLathe from "../assets/audio/engineCircular_001.ogg?inline";
import thrust0 from "../assets/audio/thrusterFire_000.ogg?inline";
import thrust1 from "../assets/audio/thrusterFire_001.ogg?inline";
import thrust2 from "../assets/audio/thrusterFire_002.ogg?inline";
import thrust3 from "../assets/audio/thrusterFire_003.ogg?inline";
import doorOpen0 from "../assets/audio/doorOpen_000.ogg?inline";
import doorOpen1 from "../assets/audio/doorOpen_001.ogg?inline";
import doorOpen2 from "../assets/audio/doorOpen_002.ogg?inline";
import doorClose0 from "../assets/audio/doorClose_000.ogg?inline";
import doorClose1 from "../assets/audio/doorClose_001.ogg?inline";
import comp0 from "../assets/audio/computerNoise_000.ogg?inline";
import comp1 from "../assets/audio/computerNoise_001.ogg?inline";
import comp2 from "../assets/audio/computerNoise_002.ogg?inline";
import slime0 from "../assets/audio/slime_000.ogg?inline";
import slime1 from "../assets/audio/slime_001.ogg?inline";
import click1 from "../assets/audio/click1.ogg?inline";
import click2 from "../assets/audio/click2.ogg?inline";
import click3 from "../assets/audio/click3.ogg?inline";
import click4 from "../assets/audio/click4.ogg?inline";
import click5 from "../assets/audio/click5.ogg?inline";
import switch1 from "../assets/audio/switch1.ogg?inline";
import switch2 from "../assets/audio/switch2.ogg?inline";
import switch3 from "../assets/audio/switch3.ogg?inline";
import switch4 from "../assets/audio/switch4.ogg?inline";
import switch5 from "../assets/audio/switch5.ogg?inline";

/* ---------------- firing timeline (shared with visuals) ---------------- */

const BURSTS: Array<[number, number]> = [
  [298.4, 0.32], // 10 rounds
  [303.4, 0.32],
  [308.4, 0.32],
];

export const FIRES: number[] = [];
for (const [t0, dt] of BURSTS) {
  for (let i = 0; i < 10; i++) FIRES.push(t0 + dt * i);
}

export const FLIGHT_TIME = 11.3;

export interface HitEvent {
  /** arrival time, derived from FIRES + FLIGHT_TIME */
  t: number;
  /** which bullet index produces this hit */
  bullet: number;
  /** which figure index in the group is hit (see world.ts) */
  target: number;
  blood: boolean;
  burst: boolean;
}

const HIT_DEFS: Array<Omit<HitEvent, "t">> = [
  { bullet: 1, target: 1, blood: true, burst: false }, // B, chest
  { bullet: 2, target: 0, blood: true, burst: false }, // A, visor
  { bullet: 11, target: 7, blood: false, burst: true }, // stray → thruster pack
  { bullet: 13, target: 2, blood: true, burst: false }, // C
  { bullet: 20, target: 12, blood: false, burst: false }, // stray → row 3
];

export const HITS: HitEvent[] = HIT_DEFS.map((h) => ({ ...h, t: FIRES[h.bullet]! + FLIGHT_TIME }));

/* ---------------- sound cue manifest ---------------- */

const amb = "amb";
const sfx = "sfx";
const mus = "music";

function snd(id: string, sound: string, start: number, end: number, gain: number, sustain = false, group = sfx): SoundCue {
  return { id, kind: "sound", sound, start, end, gain, sustain, group };
}

export const soundCues: SoundCue[] = [
  /* ---- prologue: vacuum ---- */
  snd("amb-vacuum-0", "vacuum-tone", 0, 30.5, 0.55, true, amb),
  snd("amb-breath-0", "suit-breath", 2, 29.5, 0.5, true, amb),

  /* ---- act I: hutong ---- */
  snd("mus-warm", "music-hutong", 31, 149.5, 0.32, true, mus),
  snd("amb-hutong", "roomtone-hutong", 31, 149.5, 0.5, true, amb),
  snd("sfx-bell", "bell", 32.3, 33.5, 0.4),
  snd("sfx-step-1", "step-wood-1", 33.6, 34.4, 0.4),
  snd("sfx-step-2", "step-wood-1", 35.1, 35.9, 0.4),
  snd("sfx-step-3", "step-wood-1", 36.7, 37.5, 0.4),
  snd("sfx-door-open", "door-open-0", 38.1, 38.9, 0.4),
  snd("sfx-door-creak", "wood-creak", 38.2, 39.0, 0.5),
  snd("sfx-step-in-1", "step-wood-2", 39.6, 40.3, 0.3),
  snd("sfx-step-in-2", "step-wood-2", 41.0, 41.7, 0.3),
  snd("sfx-step-in-3", "step-wood-2", 42.3, 43.0, 0.3),
  snd("sfx-pour", "pour", 56.3, 58.6, 0.14),
  snd("sfx-cup-1", "glass-light-2", 57.4, 58.0, 0.5),
  snd("sfx-cup-2", "glass-light-1", 59.0, 59.6, 0.45),
  snd("sfx-cabinet-glass", "glass-light-3", 86.4, 87.0, 0.3),
  snd("sfx-rocks-1", "soft-med-1", 109.6, 110.4, 0.5),
  snd("sfx-rocks-2", "soft-med-0", 113.9, 114.7, 0.5),
  snd("sfx-pay-1", "click-2", 123.9, 124.5, 0.5),
  snd("sfx-pay-2", "click-3", 124.9, 125.5, 0.45),
  snd("sfx-bag-rustle", "soft-med-1", 136.8, 137.6, 0.4),

  /* ---- act I: night office ---- */
  snd("amb-city", "citynight", 142.5, 152.0, 0.4, true, amb),
  snd("sfx-com-in", "comp-1", 144.9, 145.5, 0.35),
  snd("sfx-com-out", "comp-2", 160.7, 161.3, 0.35),

  /* ---- act II: workshop ---- */
  snd("amb-workshop", "workshop-hum", 153.5, 196.5, 0.42, true, amb),
  snd("mus-cold", "music-cold", 153.5, 196.5, 0.3, true, mus),
  snd("sfx-door-ws", "door-open-1", 161.0, 161.8, 0.5),
  snd("sfx-lights-on", "switch-3", 162.2, 162.8, 0.5),
  snd("sfx-lathe-power", "switch-2", 166.0, 166.6, 0.5),
  snd("sfx-lathe-loop", "lathe-loop", 166.2, 194.5, 0.5, true),
  snd("sfx-chuck-1", "metal-light-2", 167.6, 168.2, 0.4),
  snd("sfx-cut-1", "metal-med-1", 170.5, 171.3, 0.55),
  snd("sfx-cut-2", "metal-med-2", 176.5, 177.3, 0.55),
  snd("sfx-cut-3", "metal-med-0", 182.5, 183.3, 0.55),
  snd("sfx-tray-1", "tin-med-1", 189.5, 190.1, 0.4),
  snd("sfx-tray-2", "tin-med-1", 190.4, 191.0, 0.4),
  snd("sfx-tray-3", "tin-med-1", 191.2, 191.8, 0.4),
  snd("sfx-chuck-2", "metal-light-1", 193.5, 194.1, 0.4),
  snd("sfx-sweep-1", "soft-med-1", 194.2, 195.0, 0.25),

  /* ---- act II: basement ---- */
  snd("amb-basement", "basement-tone", 200.5, 232.5, 0.5, true, amb),
  snd("mus-dark", "music-dark", 200.5, 233.5, 0.3, true, mus),
  snd("sfx-step-d-1", "step-concrete", 198.6, 199.3, 0.4),
  snd("sfx-step-d-2", "step-concrete", 199.7, 200.4, 0.4),
  snd("sfx-step-d-3", "step-concrete", 200.8, 201.5, 0.4),
  snd("sfx-step-d-4", "step-concrete", 201.9, 202.6, 0.4),
  snd("sfx-bulb", "switch-4", 202.4, 203.0, 0.5),
  snd("sfx-pliers-1", "click-1", 211.4, 212.0, 0.5),
  snd("sfx-pliers-2", "click-2", 213.3, 213.9, 0.5),
  snd("sfx-glue", "slime-0", 215.1, 216.0, 0.4),
  snd("sfx-press", "click-3", 216.5, 217.1, 0.3),
  snd("sfx-load-mag", "click-4", 219.1, 219.7, 0.5),
  snd("sfx-slide", "switch-1", 220.7, 221.3, 0.5),
  snd("sfx-bag-set", "soft-med-0", 223.4, 224.0, 0.35),
  /* the gunshot: samples + procedural reverb tail */
  snd("sfx-shot-crunch", "explosion-crunch", 224.3, 225.2, 0.85),
  snd("sfx-shot-metal", "metal-heavy", 224.3, 225.2, 0.65),
  snd("sfx-shot-boom", "low-boom", 224.3, 225.4, 0.8),
  snd("sfx-shot-tail", "gunshot-tail", 224.3, 226.6, 0.8),
  snd("sfx-hit-beef", "soft-heavy-1", 224.55, 225.3, 0.6),
  snd("sfx-knife", "soft-med-0", 227.4, 228.0, 0.3),

  /* ---- act III: void ---- */
  snd("amb-vacuum-1", "vacuum-tone", 233.5, 337.5, 0.55, true, amb),
  snd("amb-breath-1", "suit-breath", 233.5, 337.5, 0.6, true, amb),
  snd("mus-void", "music-void", 233.5, 324.5, 0.34, true, mus),
  snd("sfx-thrust-arrive", "thrust-0", 234.3, 235.0, 0.35),
  snd("sfx-beep-1", "comp-2", 244.9, 245.5, 0.4),
  snd("sfx-beep-2", "comp-0", 247.0, 247.6, 0.4),
  snd("sfx-vac-door", "vac-door", 271.4, 272.6, 0.5),
  snd("sfx-cam-click", "click-3", 273.8, 274.4, 0.35),
  snd("sfx-glove-ring", "switch-5", 289.6, 290.2, 0.35),
  snd("sfx-scope-snap", "click-4", 290.9, 291.5, 0.4),
  snd("sfx-mag-out-0", "click-1", 291.3, 291.9, 0.4),
  snd("sfx-safety", "switch-1", 292.5, 293.1, 0.35),
  snd("mus-tension", "music-tension", 296.5, 322.5, 0.36, true, mus),
  ...FIRES.map((t, i) => snd(`sfx-shot-${String(i).padStart(2, "0")}`, "suit-thud", t, t + 0.14, 0.5)),
  snd("sfx-mag-out-1", "click-1", 301.9, 302.5, 0.4),
  snd("sfx-mag-in-1", "click-2", 303.2, 303.8, 0.4),
  snd("sfx-mag-out-2", "click-1", 306.9, 307.5, 0.4),
  snd("sfx-mag-in-2", "click-2", 308.2, 308.8, 0.4),
  ...HITS.map((h, i) => snd(`sfx-hit-${i}`, "impact-tick", h.t, h.t + 0.1, 0.16)),
  snd("mus-aftermath", "music-aftermath", 324.5, 337.5, 0.3, true, mus),
  snd("sfx-radio-static", "radio-static", 324.7, 325.4, 0.5),
  snd("sfx-flee-1", "thrust-1", 326.6, 327.4, 0.5),
  snd("sfx-flee-2", "thrust-2", 327.3, 328.1, 0.45),
  snd("sfx-thrust-zhang", "thrust-3", 337.2, 338.0, 0.55),

  /* ---- act IV: hibernation bay ---- */
  snd("amb-bay", "bay-tone", 340.5, 348, 0.5, true, amb),
  snd("amb-breath-2", "suit-breath", 340.5, 347.0, 0.4, true, amb),
  snd("mus-finale", "music-finale", 341, 348, 0.4, true, mus),
  snd("sfx-airlock", "door-close-1", 340.9, 341.7, 0.5),
  snd("sfx-pod-open", "door-open-0", 343.1, 343.9, 0.4),
  snd("sfx-pod-close", "door-close-0", 344.8, 345.6, 0.5),
  snd("sfx-pod-beep-1", "comp-0", 345.4, 346.0, 0.45),
  snd("sfx-pod-beep-2", "click-5", 346.3, 346.9, 0.4),
];

/* ---------------- sample registry ---------------- */

export function defineSamples<T>(audio: WebAudioCueBus<T>): void {
  audio
    .defineSample("bell", bell)
    .defineSample("step-wood-1", stepWood1)
    .defineSample("step-wood-2", stepWood2)
    .defineSample("wood-creak", woodCreak)
    .defineSample("glass-light-1", glassLight1)
    .defineSample("glass-light-2", glassLight2)
    .defineSample("glass-light-3", glassLight3)
    .defineSample("soft-med-0", softMed0)
    .defineSample("soft-med-1", softMed1)
    .defineSample("soft-heavy-1", softHeavy1)
    .defineSample("step-concrete", stepConcrete)
    .defineSample("metal-med-0", metalMed0)
    .defineSample("metal-med-1", metalMed1)
    .defineSample("metal-med-2", metalMed2)
    .defineSample("metal-light-1", metalLight1)
    .defineSample("metal-light-2", metalLight2)
    .defineSample("metal-heavy", metalHeavy0)
    .defineSample("tin-med-1", tinMed1)
    .defineSample("explosion-crunch", explosionCrunch)
    .defineSample("low-boom", lowFreqBoom)
    .defineSample("lathe-loop", engineLathe, { loop: true, playbackRate: 0.9 })
    .defineSample("thrust-0", thrust0, { playbackRate: 0.85 })
    .defineSample("thrust-1", thrust1, { playbackRate: 0.9 })
    .defineSample("thrust-2", thrust2, { playbackRate: 0.95 })
    .defineSample("thrust-3", thrust3, { playbackRate: 0.9 })
    .defineSample("door-open-0", doorOpen0)
    .defineSample("door-open-1", doorOpen1)
    .defineSample("door-open-2", doorOpen2)
    .defineSample("door-close-0", doorClose0)
    .defineSample("door-close-1", doorClose1)
    .defineSample("comp-0", comp0)
    .defineSample("comp-1", comp1)
    .defineSample("comp-2", comp2)
    .defineSample("slime-0", slime0)
    .defineSample("slime-1", slime1, { playbackRate: 0.8 })
    .defineSample("click-1", click1)
    .defineSample("click-2", click2)
    .defineSample("click-3", click3)
    .defineSample("click-4", click4)
    .defineSample("click-5", click5)
    .defineSample("switch-1", switch1)
    .defineSample("switch-2", switch2)
    .defineSample("switch-3", switch3)
    .defineSample("switch-4", switch4)
    .defineSample("switch-5", switch5);
}

/* ---------------- procedural factories ---------------- */

function noiseBuffer(ac: AudioContext, seconds: number): AudioBuffer {
  const buffer = ac.createBuffer(1, Math.max(1, Math.floor(ac.sampleRate * seconds)), ac.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = (white * 0.4 + last * 3) / 3.4;
  }
  return buffer;
}

interface StopSet {
  nodes: Array<{ stop: () => void; disconnect: () => void }>;
}

function collect(ctx: SoundFactoryContext, ...items: Array<AudioNode | OscillatorNode | AudioBufferSourceNode>): StopSet {
  const stops = items.map((n) => {
    const node = n as AudioScheduledSourceNode;
    return {
      stop: () => {
        try { node.stop?.(); } catch { /* noop */ }
      },
      disconnect: () => {
        try { node.disconnect(); } catch { /* noop */ }
      },
    };
  });
  return { nodes: stops };
}

function finalize(ctx: SoundFactoryContext, set: StopSet): { stop: () => void } {
  return {
    stop: () => {
      set.nodes.forEach((n) => {
        n.stop();
        n.disconnect();
      });
    },
  };
}

function pad(ctx: SoundFactoryContext, freqs: number[], gain: number, filterHz: number, type: OscillatorType, detuneSp = 4, attack = 5): { stop: () => void } {
  const ac = ctx.audioContext;
  const now = ac.currentTime;
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = filterHz;
  filter.Q.value = 0.4;
  filter.connect(ctx.output);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(gain, now + attack);
  g.connect(filter);
  const oscs: OscillatorNode[] = [];
  for (const f of freqs) {
    for (const d of [-detuneSp, detuneSp]) {
      const o = ac.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = d;
      o.connect(g);
      o.start(now);
      oscs.push(o);
    }
  }
  return finalize(ctx, collect(ctx, ...oscs));
}

function tone(ctx: SoundFactoryContext, freqs: number[], gain: number, type: OscillatorType = "sine", lfoHz = 0.1, lfoDepth = 0.5): { stop: () => void } {
  const ac = ctx.audioContext;
  const now = ac.currentTime;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, now);
  g.connect(ctx.output);
  const oscs: OscillatorNode[] = [];
  for (const f of freqs) {
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.value = f;
    o.connect(g);
    o.start(now);
    oscs.push(o);
  }
  const lfo = ac.createOscillator();
  lfo.frequency.value = lfoHz;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = gain * lfoDepth;
  lfo.connect(lfoGain);
  lfoGain.connect(g.gain);
  lfo.start(now);
  return finalize(ctx, collect(ctx, ...oscs, lfo));
}

function noiseBand(ctx: SoundFactoryContext, gain: number, filterType: BiquadFilterType, freq: number, q = 0.6, seconds = 2, lfoHz = 0, lfoDepth = 0): { stop: () => void } {
  const ac = ctx.audioContext;
  const now = ac.currentTime;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, seconds);
  src.loop = true;
  const filter = ac.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, now);
  src.connect(filter);
  filter.connect(g);
  g.connect(ctx.output);
  src.start(now);
  if (lfoHz > 0 && lfoDepth > 0) {
    const lfo = ac.createOscillator();
    lfo.frequency.value = lfoHz;
    const lg = ac.createGain();
    lg.gain.value = gain * lfoDepth;
    lfo.connect(lg);
    lg.connect(g.gain);
    lfo.start(now);
    return finalize(ctx, collect(ctx, src, lfo));
  }
  return finalize(ctx, collect(ctx, src));
}

/** deterministic periodic event scheduler for sustain cues */
function schedulePeriodic(ctx: SoundFactoryContext, period: number, dur: number, fn: (at: number) => void): void {
  const ac = ctx.audioContext;
  const offset = ctx.offset;
  const end = ctx.cue.end - ctx.cue.start;
  const first = Math.ceil((offset - dur) / period) * period + dur;
  let t = Math.max(first, offset);
  while (t < end - 0.05) {
    fn(ac.currentTime + (t - offset));
    t += period;
  }
}

function drip(ctx: SoundFactoryContext, at: number): void {
  const ac = ctx.audioContext;
  const o = ac.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(920, at);
  o.frequency.exponentialRampToValueAtTime(260, at + 0.09);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(0.05, at + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.12);
  o.connect(g);
  g.connect(ctx.output);
  o.start(at);
  o.stop(at + 0.15);
}

export function defineProcedural<T>(audio: WebAudioCueBus<T>): void {
  /* ----- ambiences ----- */
  audio.define("vacuum-tone", (ctx) => {
    const set = tone(ctx, [36.7, 37.2], 0.06, "sine", 0.07, 0.7);
    const air = noiseBand(ctx, 0.008, "highpass", 5200, 0.5, 3, 0.13, 0.8);
    return { stop: () => { set.stop(); air.stop(); } };
  });

  audio.define("suit-breath", (ctx) => {
    const ac = ctx.audioContext;
    const now = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 3);
    src.loop = true;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 620;
    bp.Q.value = 0.8;
    const g = ac.createGain();
    g.gain.value = 0.06;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.32;
    const lg = ac.createGain();
    lg.gain.value = 0.05;
    lfo.connect(lg);
    lg.connect(g.gain);
    src.connect(bp);
    bp.connect(g);
    g.connect(ctx.output);
    src.start(now);
    lfo.start(now);
    const servo = tone(ctx, [183, 185], 0.006, "sine", 0.9, 0.6);
    return {
      stop: () => {
        finalize(ctx, collect(ctx, src, lfo)).stop();
        servo.stop();
      },
    };
  });

  audio.define("roomtone-hutong", (ctx) => {
    const room = noiseBand(ctx, 0.05, "lowpass", 260, 0.4, 3);
    const street = noiseBand(ctx, 0.012, "bandpass", 800, 0.5, 3, 0.21, 0.8);
    const air = noiseBand(ctx, 0.006, "highpass", 3400, 0.4, 3);
    return { stop: () => { room.stop(); street.stop(); air.stop(); } };
  });

  audio.define("citynight", (ctx) => {
    const city = noiseBand(ctx, 0.05, "lowpass", 210, 0.4, 3, 0.11, 0.5);
    const air = noiseBand(ctx, 0.008, "highpass", 2600, 0.4, 3);
    const sub = tone(ctx, [58], 0.03);
    return { stop: () => { city.stop(); air.stop(); sub.stop(); } };
  });

  audio.define("workshop-hum", (ctx) => {
    const hum = tone(ctx, [50, 100], 0.05, "sine", 0.05, 0.4);
    const buzz = tone(ctx, [120], 0.008, "triangle");
    const air = noiseBand(ctx, 0.012, "highpass", 2200, 0.4, 3);
    return { stop: () => { hum.stop(); buzz.stop(); air.stop(); } };
  });

  audio.define("basement-tone", (ctx) => {
    const sub = tone(ctx, [43], 0.07, "sine", 0.06, 0.5);
    const rumble = noiseBand(ctx, 0.022, "lowpass", 120, 0.5, 3);
    schedulePeriodic(ctx, 26, 2.5, (at) => drip(ctx, at));
    schedulePeriodic(ctx, 26, 7.8, (at) => drip(ctx, at));
    schedulePeriodic(ctx, 26, 13.2, (at) => drip(ctx, at));
    return { stop: () => { sub.stop(); rumble.stop(); } };
  });

  audio.define("bay-tone", (ctx) => {
    const air = noiseBand(ctx, 0.01, "highpass", 1800, 0.4, 3, 0.17, 0.7);
    const hum = tone(ctx, [121, 243], 0.016);
    return { stop: () => { air.stop(); hum.stop(); } };
  });

  /* ----- music ----- */
  audio.define("music-hutong", (ctx) => pad(ctx, [110, 164.8, 220, 261.6], 0.05, 720, "triangle", 5, 7));
  audio.define("music-cold", (ctx) => pad(ctx, [110, 130.8, 164.8], 0.045, 520, "sine", 3, 8));
  audio.define("music-dark", (ctx) => {
    const low = pad(ctx, [55, 82.4], 0.06, 300, "sine", 2, 6);
    const pulse = tone(ctx, [55], 0.03, "sine", 0.9, 0.9);
    return { stop: () => { low.stop(); pulse.stop(); } };
  });
  audio.define("music-void", (ctx) => {
    const low = pad(ctx, [36.7, 55], 0.05, 260, "sine", 2, 8);
    schedulePeriodic(ctx, 11.3, 3.0, (at) => {
      const ac = ctx.audioContext;
      const o = ac.createOscillator();
      o.type = "sine";
      o.frequency.value = 1568;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.018, at + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 2.4);
      o.connect(g);
      g.connect(ctx.output);
      o.start(at);
      o.stop(at + 2.6);
    });
    return { stop: () => low.stop() };
  });
  audio.define("music-tension", (ctx) => {
    const ac = ctx.audioContext;
    const now = ac.currentTime;
    const cluster = pad(ctx, [110, 116.5], 0.03, 420, "sawtooth", 3, 6);
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 3);
    src.loop = true;
    const f = ac.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 380;
    f.Q.value = 2;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.02, now + 24);
    src.connect(f);
    f.connect(g);
    g.connect(ctx.output);
    src.start(now);
    const sub = tone(ctx, [36.7], 0.04, "sine", 0.5, 0.8);
    return {
      stop: () => {
        cluster.stop();
        finalize(ctx, collect(ctx, src)).stop();
        sub.stop();
      },
    };
  });
  audio.define("music-aftermath", (ctx) => {
    const pad1 = pad(ctx, [110, 164.8], 0.035, 500, "sine", 3, 10);
    const pad2 = pad(ctx, [103.8, 155.6], 0.03, 420, "sine", 3, 12);
    return { stop: () => { pad1.stop(); pad2.stop(); } };
  });
  audio.define("music-finale", (ctx) => pad(ctx, [130.8, 164.8, 196, 261.6], 0.055, 900, "triangle", 5, 9));

  /* ----- one-shots ----- */
  audio.define("pour", (ctx) => {
    const ac = ctx.audioContext;
    const now = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 1.8);
    const f = ac.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(1400, now);
    f.frequency.exponentialRampToValueAtTime(520, now + 1.7);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.14, now + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    src.connect(f);
    f.connect(g);
    g.connect(ctx.output);
    src.start(now);
    return finalize(ctx, collect(ctx, src));
  });

  audio.define("gunshot-tail", (ctx) => {
    const ac = ctx.audioContext;
    const now = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 0.5);
    const input = ac.createGain();
    input.gain.value = 0.6;
    src.connect(input);
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const out = ac.createGain();
    out.gain.value = 1;
    lp.connect(out);
    out.connect(ctx.output);
    const times = [0.09, 0.16, 0.27, 0.41];
    const feedbacks = [0.62, 0.55, 0.5, 0.44];
    times.forEach((dt, i) => {
      const d = ac.createDelay(1.2);
      d.delayTime.value = dt;
      const fb = ac.createGain();
      fb.gain.value = feedbacks[i]!;
      input.connect(d);
      d.connect(fb);
      fb.connect(d);
      d.connect(lp);
    });
    const sub = ac.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(76, now);
    sub.frequency.exponentialRampToValueAtTime(32, now + 0.45);
    const sg = ac.createGain();
    sg.gain.setValueAtTime(0.5, now);
    sg.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    sub.connect(sg);
    sg.connect(ctx.output);
    src.start(now);
    sub.start(now);
    return finalize(ctx, collect(ctx, src, sub));
  });

  audio.define("suit-thud", (ctx) => {
    const ac = ctx.audioContext;
    const now = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 0.1);
    const f = ac.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(320, now);
    f.frequency.exponentialRampToValueAtTime(90, now + 0.09);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.55, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    src.connect(f);
    f.connect(g);
    g.connect(ctx.output);
    src.start(now);
    const o = ac.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(95, now);
    o.frequency.exponentialRampToValueAtTime(50, now + 0.08);
    const og = ac.createGain();
    og.gain.setValueAtTime(0.4, now);
    og.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    o.connect(og);
    og.connect(ctx.output);
    o.start(now);
    const clk = ac.createBufferSource();
    clk.buffer = noiseBuffer(ac, 0.02);
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 3000;
    const cg = ac.createGain();
    cg.gain.setValueAtTime(0.14, now);
    cg.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
    clk.connect(hp);
    hp.connect(cg);
    cg.connect(ctx.output);
    clk.start(now);
    return finalize(ctx, collect(ctx, src, o, clk));
  });

  audio.define("vac-door", (ctx) => {
    const ac = ctx.audioContext;
    const now = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 0.9);
    const f = ac.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(280, now);
    f.frequency.exponentialRampToValueAtTime(70, now + 0.8);
    f.Q.value = 1.2;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.4, now + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    src.connect(f);
    f.connect(g);
    g.connect(ctx.output);
    src.start(now);
    const o = ac.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(62, now + 0.25);
    o.frequency.exponentialRampToValueAtTime(38, now + 0.4);
    const og = ac.createGain();
    og.gain.setValueAtTime(0.0001, now);
    og.gain.setValueAtTime(0.3, now + 0.27);
    og.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    o.connect(og);
    og.connect(ctx.output);
    o.start(now + 0.25);
    return finalize(ctx, collect(ctx, src, o));
  });

  audio.define("radio-static", (ctx) => {
    const ac = ctx.audioContext;
    const now = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 0.5);
    const f = ac.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1700;
    f.Q.value = 0.6;
    const g = ac.createGain();
    g.gain.value = 0.3;
    const sq = ac.createOscillator();
    sq.type = "square";
    sq.frequency.value = 31;
    const sg = ac.createGain();
    sg.gain.value = 0.25;
    sq.connect(sg);
    sg.connect(g.gain);
    src.connect(f);
    f.connect(g);
    g.connect(ctx.output);
    src.start(now);
    sq.start(now);
    return finalize(ctx, collect(ctx, src, sq));
  });

  audio.define("impact-tick", (ctx) => {
    const ac = ctx.audioContext;
    const now = ac.currentTime;
    const o = ac.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(1250, now);
    o.frequency.exponentialRampToValueAtTime(500, now + 0.03);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.1, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    o.connect(g);
    g.connect(ctx.output);
    o.start(now);
    return finalize(ctx, collect(ctx, o));
  });
}

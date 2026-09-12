import type { SoundCue, WebAudioCueBus } from "@agentbench/cinematic-player";

import thruster from "./assets/audio/thrusterFire_000.ogg?inline";
import doorOpen from "./assets/audio/doorOpen_000.ogg?inline";
import computerNoise from "./assets/audio/computerNoise_000.ogg?inline";
import engineLow from "./assets/audio/spaceEngineLow_000.ogg?inline";
import metalMedium from "./assets/audio/impactMetal_medium_000.ogg?inline";
import crunch from "./assets/audio/explosionCrunch_000.ogg?inline";
import plateHeavy from "./assets/audio/impactPlate_heavy_000.ogg?inline";
import mining from "./assets/audio/impactMining_000.ogg?inline";
import softHeavy from "./assets/audio/impactSoft_heavy_000.ogg?inline";
import footstepWood from "./assets/audio/footstep_wood_000.ogg?inline";
import switch1 from "./assets/audio/switch1.ogg?inline";
import click1 from "./assets/audio/click1.ogg?inline";
import click3 from "./assets/audio/click3.ogg?inline";

export function defineSamples(audio: WebAudioCueBus): void {
  audio
    .defineSample("thruster", thruster)
    .defineSample("door-open", doorOpen)
    .defineSample("computer-noise", computerNoise, { loop: true, playbackRate: 0.9 })
    .defineSample("engine-low", engineLow, { loop: true, playbackRate: 0.85 })
    .defineSample("metal-medium", metalMedium)
    .defineSample("crunch", crunch)
    .defineSample("plate-heavy", plateHeavy, { detune: -180 })
    .defineSample("mining", mining, { loop: true, playbackRate: 1.05 })
    .defineSample("soft-heavy", softHeavy)
    .defineSample("footstep-wood", footstepWood)
    .defineSample("switch", switch1)
    .defineSample("click", click1)
    .defineSample("click2", click3);
}

// --- procedural helpers ----------------------------------------------------

function noiseBuffer(ac: AudioContext, seconds: number, colour = 1): AudioBuffer {
  const buf = ac.createBuffer(1, Math.max(1, Math.floor(ac.sampleRate * seconds)), ac.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + colour * white) / (colour + 1);
    data[i] = last * 3.2;
  }
  return buf;
}

function impulseResponse(ac: AudioContext, seconds: number, decay: number): AudioBuffer {
  const len = Math.max(1, Math.floor(ac.sampleRate * seconds));
  const buf = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

function makeConvolver(ac: AudioContext, seconds: number, decay: number): ConvolverNode {
  const conv = ac.createConvolver();
  conv.buffer = impulseResponse(ac, seconds, decay);
  return conv;
}

export function defineProcedural(audio: WebAudioCueBus): void {
  // --- abstract low drone for the void / opening --------------------------
  audio.define("void-hum", ({ audioContext: ac, output }) => {
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 52;
    const osc2 = ac.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 55.6;
    const g = ac.createGain();
    g.gain.value = 0.05;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 220;
    osc.connect(g);
    osc2.connect(g);
    g.connect(lp).connect(output);
    osc.start();
    osc2.start();
    return { stop: () => { try { osc.stop(); osc2.stop(); } catch {} } };
  });

  // --- warm room tone -------------------------------------------------------
  audio.define("room-tone", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 4, 0.4);
    src.loop = true;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 320;
    const g = ac.createGain();
    g.gain.value = 0.06;
    src.connect(lp).connect(g).connect(output);
    src.start();
    return { stop: () => { try { src.stop(); } catch {} } };
  });

  // --- lathe whine ----------------------------------------------------------
  audio.define("machine-whine", ({ audioContext: ac, output }) => {
    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 760;
    const lfo = ac.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 3.1;
    const lfoGain = ac.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain).connect(osc.frequency);
    const g = ac.createGain();
    g.gain.value = 0.022;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900;
    bp.Q.value = 2;
    osc.connect(bp).connect(g).connect(output);
    osc.start();
    lfo.start();
    return { stop: () => { try { osc.stop(); lfo.stop(); } catch {} } };
  });

  // --- layered basement gunshot (crack + sub + reflected tail) -------------
  audio.define("gunshot", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const crack = ac.createBufferSource();
    crack.buffer = noiseBuffer(ac, 0.11, 0.2);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2400;
    bp.Q.value = 0.7;
    const cg = ac.createGain();
    cg.gain.setValueAtTime(0.9, now);
    cg.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    crack.connect(bp).connect(cg);

    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.28);
    const og = ac.createGain();
    og.gain.setValueAtTime(0.85, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc.connect(og);

    const conv = makeConvolver(ac, 1.6, 2.6);
    const wet = ac.createGain();
    wet.gain.value = 0.5;
    cg.connect(output);
    og.connect(output);
    cg.connect(conv);
    og.connect(conv);
    conv.connect(wet).connect(output);

    crack.start(now);
    osc.start(now);
    osc.stop(now + 0.45);
    return { stop: () => { try { crack.stop(); osc.stop(); } catch {} } };
  });

  // --- suit-conducted breathing -------------------------------------------
  audio.define("breath", ({ audioContext: ac, output, offset }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 3.2, 0.5);
    src.loop = true;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 640;
    const g = ac.createGain();
    g.gain.value = 0.085;
    const lfo = ac.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.16; // slow breath cycle
    const lfoGain = ac.createGain();
    lfoGain.gain.value = 0.055;
    lfo.connect(lfoGain).connect(g.gain);
    src.connect(lp).connect(g).connect(output);
    const period = 1 / lfo.frequency.value;
    src.start(0);
    lfo.start(0, offset % period);
    return { stop: () => { try { src.stop(); lfo.stop(); } catch {} } };
  });

  // --- radio coordination beeps --------------------------------------------
  audio.define("radio-beep", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const stops: Array<() => void> = [];
    for (let i = 0; i < 3; i++) {
      const t = now + i * 0.22;
      const osc = ac.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(980, t);
      osc.frequency.exponentialRampToValueAtTime(1120, t + 0.05);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc.connect(g).connect(output);
      osc.start(t);
      osc.stop(t + 0.16);
      stops.push(() => { try { osc.stop(); } catch {} });
    }
    return { stop: () => stops.forEach((s) => s()) };
  });

  // --- 30 muffled shots from a vacuum pistol --------------------------------
  audio.define("gun-burst", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const stops: Array<() => void> = [];
    const thump = (t: number) => {
      const osc = ac.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(70, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.09);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.14, t + 0.007);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
      osc.connect(g).connect(output);
      osc.start(t);
      osc.stop(t + 0.15);
      stops.push(() => { try { osc.stop(); } catch {} });
      // tiny suit-conducted trigger tick
      const tick = ac.createBufferSource();
      tick.buffer = noiseBuffer(ac, 0.03, 0.1);
      const hp = ac.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 2600;
      const tg = ac.createGain();
      tg.gain.setValueAtTime(0.05, t);
      tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
      tick.connect(hp).connect(tg).connect(output);
      tick.start(t);
      stops.push(() => { try { tick.stop(); } catch {} });
    };
    let t = 0;
    const gap = 0.31;
    const reload = 0.82;
    for (let volley = 0; volley < 3; volley++) {
      for (let i = 0; i < 10; i++) {
        thump(t);
        t += gap;
      }
      t += reload - gap;
    }
    return { stop: () => stops.forEach((s) => s()) };
  });

  // --- heartbeat (tension) ---------------------------------------------------
  audio.define("heartbeat", ({ audioContext: ac, output, offset }) => {
    const stops: Array<() => void> = [];
    const beat = (t: number, amp: number, freq: number) => {
      const osc = ac.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.09);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(amp, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc.connect(g).connect(output);
      osc.start(t);
      osc.stop(t + 0.16);
      stops.push(() => { try { osc.stop(); } catch {} });
    };
    let t = 0;
    const period = 0.92;
    while (t < 40) {
      beat(t, 0.3, 58);
      beat(t + 0.16, 0.2, 52);
      t += period;
    }
    return { stop: () => stops.forEach((s) => s()) };
  });

  // --- subjective low impact (vacuum — felt, not heard) --------------------
  audio.define("subjective-impact", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.5);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc.connect(g).connect(output);
    osc.start(now);
    osc.stop(now + 0.62);
    return { stop: () => { try { osc.stop(); } catch {} } };
  });

  // --- decompression hiss ----------------------------------------------------
  audio.define("hiss", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 1.2, 0.5);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 3600;
    bp.Q.value = 0.5;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.16, now + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
    src.connect(bp).connect(g).connect(output);
    src.start(now);
    return { stop: () => { try { src.stop(); } catch {} } };
  });
}

// ---------------------------------------------------------------------------
// Sound cue manifest
// ---------------------------------------------------------------------------

function s(
  id: string,
  sound: string,
  start: number,
  end: number,
  extra: Partial<SoundCue> = {},
): SoundCue {
  return { id, kind: "sound", sound, group: extra.group ?? "sfx", gain: 0.7, sustain: false, start, end, ...extra };
}

export const soundCues: SoundCue[] = [
  // opening
  s("sfx-void", "void-hum", 0, 20, { sustain: true, gain: 0.5 }),
  s("sfx-open-crunch", "crunch", 3.0, 3.6, { gain: 0.8 }),
  s("sfx-open-plate", "plate-heavy", 3.0, 3.5, { gain: 0.5 }),
  s("sfx-open-shot", "gunshot", 3.0, 4.2, { gain: 0.9 }),

  // house
  s("sfx-room", "room-tone", 20, 96, { sustain: true, gain: 0.55 }),
  s("sfx-step-1", "footstep-wood", 22.4, 23.0, { gain: 0.4 }),
  s("sfx-step-2", "footstep-wood", 23.6, 24.2, { gain: 0.4 }),
  s("sfx-step-3", "footstep-wood", 24.8, 25.4, { gain: 0.4 }),
  s("sfx-tea", "metal-medium", 31.5, 32.0, { gain: 0.28 }),
  s("sfx-cabinet", "switch", 49.0, 49.4, { gain: 0.4 }),
  s("sfx-rocks", "metal-medium", 84.0, 84.5, { gain: 0.42 }),
  s("sfx-phone", "click", 89.0, 89.4, { gain: 0.38 }),

  // shop
  s("sfx-mining", "mining", 96, 116, { sustain: true, gain: 0.5 }),
  s("sfx-whine", "machine-whine", 96, 116, { sustain: true, gain: 0.4 }),
  s("sfx-lathe-on", "switch", 96.4, 96.9, { gain: 0.5 }),
  s("sfx-cut-1", "metal-medium", 100.5, 101.1, { gain: 0.4 }),
  s("sfx-cut-2", "metal-medium", 104.5, 105.1, { gain: 0.4 }),
  s("sfx-cut-3", "metal-medium", 108.5, 109.1, { gain: 0.4 }),
  s("sfx-lathe-off", "switch", 113.5, 114.0, { gain: 0.5 }),

  // basement
  s("sfx-room2", "room-tone", 116, 160, { sustain: true, gain: 0.4 }),
  s("sfx-tool-1", "click", 120.0, 120.4, { gain: 0.35 }),
  s("sfx-tool-2", "click", 123.0, 123.4, { gain: 0.35 }),
  s("sfx-tool-3", "click", 126.0, 126.4, { gain: 0.35 }),
  s("sfx-gun1-crunch", "crunch", 140.4, 141.0, { gain: 0.85 }),
  s("sfx-gun1-plate", "plate-heavy", 140.4, 140.9, { gain: 0.5 }),
  s("sfx-gun1-shot", "gunshot", 140.4, 141.6, { gain: 0.95 }),
  s("sfx-gun1-meat", "soft-heavy", 140.55, 141.0, { gain: 0.4 }),
  s("sfx-gun2-crunch", "crunch", 143.4, 144.0, { gain: 0.85 }),
  s("sfx-gun2-plate", "plate-heavy", 143.4, 143.9, { gain: 0.5 }),
  s("sfx-gun2-shot", "gunshot", 143.4, 144.6, { gain: 0.95 }),
  s("sfx-gun2-meat", "soft-heavy", 143.55, 144.0, { gain: 0.4 }),
  s("sfx-gun3-crunch", "crunch", 146.4, 147.0, { gain: 0.85 }),
  s("sfx-gun3-plate", "plate-heavy", 146.4, 146.9, { gain: 0.5 }),
  s("sfx-gun3-shot", "gunshot", 146.4, 147.6, { gain: 0.95 }),
  s("sfx-gun3-meat", "soft-heavy", 146.55, 147.0, { gain: 0.4 }),
  s("sfx-inspect", "click", 152.0, 152.4, { gain: 0.35 }),

  // space
  s("sfx-engine", "engine-low", 160, 356, { sustain: true, gain: 0.26 }),
  s("sfx-breath", "breath", 160, 356, { sustain: true, gain: 0.55 }),
  s("sfx-station-hum", "computer-noise", 160, 356, { sustain: true, gain: 0.2 }),
  s("sfx-thruster-arrive", "thruster", 164.0, 165.2, { gain: 0.4 }),
  s("sfx-locator", "click", 184.0, 184.4, { gain: 0.35 }),
  s("sfx-locator2", "switch", 185.2, 185.6, { gain: 0.35 }),
  s("sfx-thruster-burst", "thruster", 196.5, 197.5, { gain: 0.3 }),
  s("sfx-airlock", "door-open", 246.0, 247.4, { gain: 0.45 }),
  s("sfx-radio-1", "radio-beep", 249.0, 250.0, { gain: 0.3 }),
  s("sfx-radio-2", "radio-beep", 253.0, 254.0, { gain: 0.3 }),
  s("sfx-radio-3", "radio-beep", 257.0, 258.0, { gain: 0.3 }),
  s("sfx-glove", "click", 262.0, 262.4, { gain: 0.35 }),
  s("sfx-mag", "switch", 265.0, 265.4, { gain: 0.35 }),
  s("sfx-scope", "metal-medium", 268.0, 268.5, { gain: 0.3 }),
  s("sfx-safety", "click", 280.0, 280.3, { gain: 0.3 }),
  s("sfx-burst", "gun-burst", 292.0, 303.5, { gain: 0.9 }),
  s("sfx-heart", "heartbeat", 300, 334, { sustain: true, gain: 0.45 }),
  s("sfx-impact", "subjective-impact", 323.0, 324.0, { gain: 0.6 }),
  s("sfx-hiss-1", "hiss", 323.2, 324.5, { gain: 0.5 }),
  s("sfx-hiss-2", "hiss", 325.0, 326.0, { gain: 0.5 }),
  s("sfx-flee-1", "thruster", 338.0, 339.4, { gain: 0.42 }),
  s("sfx-flee-2", "thruster", 343.0, 344.4, { gain: 0.42 }),
];

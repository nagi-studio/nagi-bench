import type { SoundCue } from "@agentbench/cinematic-player";
import type { WebAudioCueBus } from "@agentbench/cinematic-player";

import stepWoodA from "./assets/audio/footstep_wood_000.ogg?inline";
import stepWoodB from "./assets/audio/footstep_wood_002.ogg?inline";
import clickSfx from "./assets/audio/click2.ogg?inline";
import click2Sfx from "./assets/audio/click5.ogg?inline";
import switchSfx from "./assets/audio/switch3.ogg?inline";
import glassLight from "./assets/audio/impactGlass_light_002.ogg?inline";
import metalHeavy from "./assets/audio/impactMetal_heavy_001.ogg?inline";
import metalLight from "./assets/audio/impactMetal_light_001.ogg?inline";
import metalMedium from "./assets/audio/impactMetal_medium_001.ogg?inline";
import softThud from "./assets/audio/impactSoft_medium_001.ogg?inline";
import crunch from "./assets/audio/explosionCrunch_001.ogg?inline";
import boomLow from "./assets/audio/lowFrequency_explosion_000.ogg?inline";
import cncLoop from "./assets/audio/engineCircular_000.ogg?inline";
import computer from "./assets/audio/computerNoise_001.ogg?inline";
import engineLow from "./assets/audio/spaceEngineLow_001.ogg?inline";
import thruster from "./assets/audio/thrusterFire_001.ogg?inline";
import doorOpen from "./assets/audio/doorOpen_001.ogg?inline";
import doorClose from "./assets/audio/doorClose_001.ogg?inline";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function defineSamples(audio: WebAudioCueBus<any>): void {
  audio
    .defineSample("step-a", stepWoodA, { playbackRate: 0.92 })
    .defineSample("step-b", stepWoodB, { playbackRate: 0.88 })
    .defineSample("click", clickSfx)
    .defineSample("click2", click2Sfx)
    .defineSample("switch", switchSfx)
    .defineSample("glass", glassLight)
    .defineSample("metal-heavy", metalHeavy)
    .defineSample("rack", metalHeavy, { playbackRate: 1.6, detune: 300 })
    .defineSample("metal-light", metalLight)
    .defineSample("metal-medium", metalMedium)
    .defineSample("thud", softThud)
    .defineSample("crunch", crunch, { playbackRate: 0.7, detune: -300 })
    .defineSample("boom", boomLow)
    .defineSample("cnc", cncLoop, { loop: true, playbackRate: 0.85, detune: -120 })
    .defineSample("computer", computer)
    .defineSample("engine-low", engineLow, { loop: true, playbackRate: 0.7, detune: -400 })
    .defineSample("thruster", thruster, { playbackRate: 0.75, detune: -250 })
    .defineSample("door-open", doorOpen, { playbackRate: 0.75 })
    .defineSample("door-close", doorClose, { playbackRate: 0.85 });
}

/* ---------------------------------------------------------------- */
/* Procedural layers: reinforcement + deliberately subjective sound  */
/* ---------------------------------------------------------------- */

function noiseBuffer(ac: AudioContext, seconds = 1): AudioBuffer {
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02; // pinkish
    data[i] = (last * 3.5 + white * 0.25) * 0.7;
  }
  return buf;
}

export function defineProcedural(audio: WebAudioCueBus<any>): void {
  /* deep cinematic drone (title / epilogue) */
  audio.define("drone", ({ audioContext: ac, output, cue }) => {
    const len = Math.min(cue.end - cue.start + 0.5, 40);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.5, ac.currentTime + 2.5);
    g.gain.setValueAtTime(0.5, ac.currentTime + Math.max(2.5, len - 2));
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + len);
    const o1 = ac.createOscillator(); o1.type = "sine"; o1.frequency.value = 55;
    const o2 = ac.createOscillator(); o2.type = "sine"; o2.frequency.value = 82.4;
    const o3 = ac.createOscillator(); o3.type = "triangle"; o3.frequency.value = 110.3;
    const g3 = ac.createGain(); g3.gain.value = 0.12;
    const lfo = ac.createOscillator(); lfo.frequency.value = 0.07;
    const lfoG = ac.createGain(); lfoG.gain.value = 0.1;
    lfo.connect(lfoG).connect(g.gain);
    o1.connect(g); o2.connect(g); o3.connect(g3).connect(g);
    g.connect(output);
    const t0 = ac.currentTime;
    [o1, o2, o3, lfo].forEach(o => { o.start(t0); o.stop(t0 + len + 0.1); });
    return { stop: () => { try { [o1, o2, o3, lfo].forEach(o => o.stop()); } catch { /* */ } } };
  });

  /* quiet interior room tone */
  audio.define("roomtone", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 4); src.loop = true;
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 240;
    const g = ac.createGain(); g.gain.value = 0.16;
    const hum = ac.createOscillator(); hum.frequency.value = 58;
    const humG = ac.createGain(); humG.gain.value = 0.018;
    src.connect(lp).connect(g).connect(output);
    hum.connect(humG).connect(output);
    src.start(); hum.start();
    return { stop: () => { try { src.stop(); hum.stop(); } catch { /* */ } } };
  });

  /* tea pour */
  audio.define("pour", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 2.4);
    const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 2.5;
    bp.frequency.setValueAtTime(1700, ac.currentTime);
    bp.frequency.exponentialRampToValueAtTime(700, ac.currentTime + 2.1);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.28, ac.currentTime + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 2.3);
    src.connect(bp).connect(g).connect(output);
    src.start(); src.stop(ac.currentTime + 2.4);
    return { stop: () => { try { src.stop(); } catch { /* */ } } };
  });

  /* CNC cutting whine */
  audio.define("saw", ({ audioContext: ac, output, cue }) => {
    const len = cue.end - cue.start;
    const o = ac.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(620, ac.currentTime);
    o.frequency.linearRampToValueAtTime(880, ac.currentTime + len * 0.5);
    o.frequency.linearRampToValueAtTime(700, ac.currentTime + len);
    const vib = ac.createOscillator(); vib.frequency.value = 27;
    const vibG = ac.createGain(); vibG.gain.value = 90;
    vib.connect(vibG).connect(o.frequency);
    const src = ac.createBufferSource(); src.buffer = noiseBuffer(ac, len);
    const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2600;
    const ng = ac.createGain(); ng.gain.value = 0.05;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.11, ac.currentTime + 0.4);
    g.gain.setValueAtTime(0.11, ac.currentTime + Math.max(0.4, len - 0.5));
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + len);
    const og = ac.createGain(); og.gain.value = 0.5;
    o.connect(og).connect(g);
    src.connect(hp).connect(ng).connect(g);
    g.connect(output);
    const t0 = ac.currentTime;
    o.start(t0); o.stop(t0 + len); vib.start(t0); vib.stop(t0 + len);
    src.start(t0); src.stop(t0 + len);
    return { stop: () => { try { o.stop(); vib.stop(); src.stop(); } catch { /* */ } } };
  });

  audio.define("powerup", ({ audioContext: ac, output }) => {
    const o = ac.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(70, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(340, ac.currentTime + 1.3);
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ac.currentTime + 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 1.5);
    o.connect(lp).connect(g).connect(output);
    o.start(); o.stop(ac.currentTime + 1.5);
    return { stop: () => { try { o.stop(); } catch { /* */ } } };
  });

  audio.define("powerdown", ({ audioContext: ac, output }) => {
    const o = ac.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(320, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(55, ac.currentTime + 1.4);
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 800;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.18, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 1.5);
    o.connect(lp).connect(g).connect(output);
    o.start(); o.stop(ac.currentTime + 1.5);
    return { stop: () => { try { o.stop(); } catch { /* */ } } };
  });

  /* basement gunshot: violent crack + hard early reflections off concrete */
  audio.define("gunshot", ({ audioContext: ac, output }) => {
    const mk = (delay: number, gain: number, cutoff: number, decay: number) => {
      const src = ac.createBufferSource();
      src.buffer = noiseBuffer(ac, decay + 0.05);
      const lp = ac.createBiquadFilter(); lp.type = "lowpass";
      lp.frequency.setValueAtTime(cutoff, ac.currentTime + delay);
      lp.frequency.exponentialRampToValueAtTime(cutoff * 0.25, ac.currentTime + delay + decay);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, ac.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + delay + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + decay);
      src.connect(lp).connect(g).connect(output);
      src.start(ac.currentTime + delay);
      src.stop(ac.currentTime + delay + decay + 0.05);
      return src;
    };
    const srcs = [
      mk(0, 1.0, 5200, 0.16),
      mk(0.055, 0.45, 2600, 0.22),
      mk(0.12, 0.28, 1600, 0.3),
      mk(0.21, 0.15, 900, 0.45),
      mk(0.34, 0.08, 500, 0.6),
    ];
    return { stop: () => { srcs.forEach(s => { try { s.stop(); } catch { /* */ } }); } };
  });

  /* suit-conducted shot thump: the only way gunfire exists in vacuum */
  audio.define("suit-thump", ({ audioContext: ac, output }) => {
    const o = ac.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(95, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(38, ac.currentTime + 0.13);
    const src = ac.createBufferSource(); src.buffer = noiseBuffer(ac, 0.09);
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 320;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.75, ac.currentTime + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.16);
    const ng = ac.createGain(); ng.gain.value = 0.25;
    o.connect(g); src.connect(lp).connect(ng).connect(g);
    g.connect(output);
    o.start(); o.stop(ac.currentTime + 0.18);
    src.start(); src.stop(ac.currentTime + 0.1);
    return { stop: () => { try { o.stop(); src.stop(); } catch { /* */ } } };
  });

  /* breathing inside the helmet (sustain) */
  audio.define("breath", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 5); src.loop = true;
    const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 520; bp.Q.value = 1.1;
    const g = ac.createGain(); g.gain.value = 0.05;
    const lfo = ac.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.24;
    const lfoG = ac.createGain(); lfoG.gain.value = 0.035;
    lfo.connect(lfoG).connect(g.gain);
    src.connect(bp).connect(g).connect(output);
    src.start(); lfo.start();
    return { stop: () => { try { src.stop(); lfo.stop(); } catch { /* */ } } };
  });

  /* radio blip before a transmission */
  audio.define("radio-blip", ({ audioContext: ac, output }) => {
    const o = ac.createOscillator(); o.type = "square"; o.frequency.value = 940;
    const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1200; bp.Q.value = 3;
    const src = ac.createBufferSource(); src.buffer = noiseBuffer(ac, 0.12);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.14, ac.currentTime + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.16);
    const ng = ac.createGain(); ng.gain.value = 0.35;
    o.connect(g); src.connect(bp).connect(ng).connect(g);
    g.connect(output);
    o.start(); o.stop(ac.currentTime + 0.18);
    src.start(); src.stop(ac.currentTime + 0.14);
    return { stop: () => { try { o.stop(); src.stop(); } catch { /* */ } } };
  });

  /* gas jetting from a punctured suit — subjective, very quiet (vacuum) */
  audio.define("hiss", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource(); src.buffer = noiseBuffer(ac, 1.6);
    const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2800;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.09, ac.currentTime + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 1.5);
    src.connect(hp).connect(g).connect(output);
    src.start(); src.stop(ac.currentTime + 1.6);
    return { stop: () => { try { src.stop(); } catch { /* */ } } };
  });

  /* station alarm bleeding through the radio */
  audio.define("alarm", ({ audioContext: ac, output, cue }) => {
    const len = cue.end - cue.start;
    const o = ac.createOscillator(); o.type = "square";
    const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1500; bp.Q.value = 4;
    const g = ac.createGain(); g.gain.value = 0.05;
    const steps = Math.floor(len / 0.45);
    for (let i = 0; i < steps; i++) {
      o.frequency.setValueAtTime(i % 2 ? 660 : 520, ac.currentTime + i * 0.45);
    }
    o.connect(bp).connect(g).connect(output);
    o.start(); o.stop(ac.currentTime + len);
    return { stop: () => { try { o.stop(); } catch { /* */ } } };
  });
}

/* ---------------------------------------------------------------- */
/* Timeline                                                          */
/* ---------------------------------------------------------------- */

function s(id: string, sound: string, start: number, end: number, gain = 0.6, group = "sfx", sustain = false): SoundCue {
  return { id, kind: "sound", sound, start, end, gain, group, sustain };
}

export const soundCues: SoundCue[] = [
  /* title */
  s("sq-drone-title", "drone", 0.2, 9.2, 0.55, "music", true),

  /* collector */
  s("sq-room-coll", "roomtone", 9, 78, 0.5, "amb", true),
  s("sq-step-1", "step-a", 9.4, 9.8, 0.5), s("sq-step-2", "step-b", 10.0, 10.4, 0.5),
  s("sq-step-3", "step-a", 10.6, 11.0, 0.5), s("sq-step-4", "step-b", 11.2, 11.6, 0.5),
  s("sq-pour", "pour", 36.1, 38.3, 0.6),
  s("sq-cup-down", "glass", 38.9, 39.3, 0.22),
  s("sq-step-c1", "step-a", 56.6, 57.0, 0.4), s("sq-step-c2", "step-b", 57.2, 57.6, 0.4),
  s("sq-step-c3", "step-a", 57.8, 58.2, 0.4), s("sq-step-c4", "step-b", 58.4, 58.8, 0.4),
  s("sq-cabinet", "click2", 59.8, 60.2, 0.5),
  s("sq-tray-take", "metal-light", 62.3, 62.7, 0.3),
  s("sq-step-c5", "step-a", 62.7, 63.1, 0.35), s("sq-step-c6", "step-b", 63.3, 63.7, 0.35),
  s("sq-step-c7", "step-a", 63.9, 64.3, 0.35),
  s("sq-tray-down", "metal-medium", 65.4, 65.8, 0.3),
  s("sq-phone", "switch", 66.4, 66.8, 0.4),

  /* workshop */
  s("sq-room-work", "roomtone", 78, 118, 0.35, "amb", true),
  s("sq-cnc-door", "door-close", 83.5, 84.3, 0.45),
  s("sq-cnc-beep", "computer", 84.1, 84.8, 0.1),
  s("sq-powerup", "powerup", 84.2, 85.6, 0.5),
  s("sq-cnc-loop", "cnc", 84.6, 112.4, 0.34, "machines", true),
  s("sq-saw-1", "saw", 85, 88.2, 0.5), s("sq-saw-2", "saw", 92, 95.2, 0.5),
  s("sq-saw-3", "saw", 100, 103.2, 0.5), s("sq-saw-4", "saw", 106, 109.2, 0.5),
  s("sq-cut-clink-1", "metal-light", 88.5, 88.9, 0.35), s("sq-cut-clink-2", "metal-light", 95.5, 95.9, 0.35),
  s("sq-cut-clink-3", "metal-light", 103.5, 103.9, 0.35), s("sq-cut-clink-4", "metal-light", 109.5, 109.9, 0.35),
  s("sq-powerdown", "powerdown", 112.2, 113.6, 0.45),
  s("sq-debris-1", "glass", 115, 115.4, 0.18), s("sq-debris-2", "glass", 116, 116.4, 0.18),
  s("sq-tool-off", "metal-medium", 117.2, 117.6, 0.3),

  /* basement */
  s("sq-room-base", "roomtone", 118, 180, 0.42, "amb", true),
  s("sq-bclick-1", "click", 122, 122.3, 0.3), s("sq-bclick-2", "click", 126, 126.3, 0.3),
  s("sq-bclick-3", "click", 130, 130.3, 0.3), s("sq-bclick-4", "click", 134, 134.3, 0.3),
  s("sq-bclick-5", "click", 138, 138.3, 0.3),
  s("sq-glue", "switch", 136, 136.4, 0.22),
  s("sq-mag-in", "metal-medium", 144.8, 145.2, 0.5),
  s("sq-rack", "rack", 146.2, 146.6, 0.45),
  s("sq-stand", "thud", 147.2, 147.6, 0.22),
  // four test shots — layered crack + low boom + room reflections
  ...[149, 151.2, 153.4, 155.6].flatMap((t0, i) => [
    s(`sq-shot-${i}`, "gunshot", t0, t0 + 1.0, 1.0),
    s(`sq-shot-boom-${i}`, "boom", t0, t0 + 0.9, 0.65),
    s(`sq-shot-meat-${i}`, "thud", t0 + 0.12, t0 + 0.5, 0.45),
  ]),
  s("sq-kneel", "thud", 161, 161.4, 0.22),
  s("sq-cloth", "thud", 163.5, 163.9, 0.18),
  s("sq-dig-1", "click", 167, 167.3, 0.22), s("sq-dig-2", "click", 169, 169.3, 0.22),
  s("sq-frags", "glass", 172.3, 172.8, 0.28),

  /* space */
  s("sq-breath", "breath", 180, 344, 0.6, "amb", true),
  s("sq-airlock", "door-open", 224, 226.5, 0.3),
  s("sq-blip-1", "radio-blip", 243.6, 243.9, 0.4),
  ...[226.5, 229.5, 232.5].map((t0, i) => s(`sq-exit-thr-${i}`, "thruster", t0, t0 + 1.6, 0.12)),
  // thirty shots in vacuum: only suit-conducted thumps
  ...[271, 271.42, 271.84, 272.26, 272.68, 273.1, 273.52, 273.94, 274.36, 274.78,
     278, 278.42, 278.84, 279.26, 279.68, 280.1, 280.52, 280.94, 281.36, 281.78,
     285, 285.42, 285.84, 286.26, 286.68, 287.1, 287.52, 287.94, 288.36, 288.78]
    .map((t0, i) => s(`sq-space-shot-${i}`, "suit-thump", t0, t0 + 0.2, 0.75)),
  s("sq-mag-1", "click2", 276.2, 276.5, 0.25),
  s("sq-mag-2", "click2", 283.2, 283.5, 0.25),
  s("sq-blip-2", "radio-blip", 304.2, 304.5, 0.45),
  ...[300, 301.1, 302.2, 303.3, 304.4].map((t0, i) => s(`sq-hit-hiss-${i}`, "hiss", t0, t0 + 1.6, 0.5)),
  s("sq-big-burst", "crunch", 302.2, 303.4, 0.3),
  s("sq-alarm", "alarm", 305, 309.4, 0.4),
  ...[306.5, 308.5, 310.5].map((t0, i) => s(`sq-ret-thr-${i}`, "thruster", t0, t0 + 1.8, 0.16)),
  s("sq-epi-engine", "engine-low", 319, 336, 0.3, "amb", true),
  s("sq-drone-end", "drone", 322, 344.8, 0.5, "music", true),
];

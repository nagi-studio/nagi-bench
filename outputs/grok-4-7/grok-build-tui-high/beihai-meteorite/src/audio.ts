import type { SoundCue, WebAudioCueBus } from "@agentbench/cinematic-player";
import { FIRE_TIMES, TEST_FIRES } from "./timeline";

import stepConA from "./assets/audio/footstep_concrete_000.ogg?inline";
import stepConB from "./assets/audio/footstep_concrete_001.ogg?inline";
import stepWoodA from "./assets/audio/footstep_wood_000.ogg?inline";
import stepWoodB from "./assets/audio/footstep_wood_001.ogg?inline";
import stepWoodC from "./assets/audio/footstep_wood_002.ogg?inline";
import woodMed from "./assets/audio/impactWood_medium_000.ogg?inline";
import woodLight from "./assets/audio/impactWood_light_000.ogg?inline";
import glassLight from "./assets/audio/impactGlass_light_000.ogg?inline";
import glassMed from "./assets/audio/impactGlass_medium_000.ogg?inline";
import metalLight from "./assets/audio/impactMetal_light_000.ogg?inline";
import metalLightB from "./assets/audio/impactMetal_light_001.ogg?inline";
import metalMed from "./assets/audio/impactMetal_medium_000.ogg?inline";
import metalHeavy from "./assets/audio/impactMetal_heavy_000.ogg?inline";
import metalHeavyB from "./assets/audio/impactMetal_heavy_001.ogg?inline";
import plate from "./assets/audio/impactPlate_heavy_000.ogg?inline";
import plateB from "./assets/audio/impactPlate_heavy_001.ogg?inline";
import softHeavy from "./assets/audio/impactSoft_heavy_000.ogg?inline";
import softMed from "./assets/audio/impactSoft_medium_000.ogg?inline";
import mining from "./assets/audio/impactMining_000.ogg?inline";
import miningB from "./assets/audio/impactMining_001.ogg?inline";
import generic from "./assets/audio/impactGeneric_light_000.ogg?inline";
import doorOpen from "./assets/audio/doorOpen_001.ogg?inline";
import doorClose from "./assets/audio/doorClose_002.ogg?inline";
import thruster from "./assets/audio/thrusterFire_002.ogg?inline";
import engineSmall from "./assets/audio/spaceEngineSmall_000.ogg?inline";
import lowBoom from "./assets/audio/lowFrequency_explosion_000.ogg?inline";
import crunch from "./assets/audio/explosionCrunch_001.ogg?inline";
import radio from "./assets/audio/computerNoise_002.ogg?inline";
import field from "./assets/audio/forceField_001.ogg?inline";
import switchClick from "./assets/audio/switch3.ogg?inline";
import click from "./assets/audio/click1.ogg?inline";

function cue(
  id: string,
  sound: string,
  start: number,
  end: number,
  gain = 0.7,
  sustain = false,
): SoundCue {
  return { id, kind: "sound", sound, start, end, gain, sustain, group: sustain ? "bed" : "sfx" };
}

function noiseBuffer(ac: AudioContext, seconds: number): AudioBuffer {
  const buffer = ac.createBuffer(1, Math.max(1, Math.floor(ac.sampleRate * seconds)), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function stoppable(nodes: Array<{ stop?: () => void; disconnect?: () => void }>): { stop: () => void } {
  return {
    stop() {
      for (const node of nodes) {
        try {
          node.stop?.();
        } catch {
          /* already stopped */
        }
        try {
          node.disconnect?.();
        } catch {
          /* already disconnected */
        }
      }
    },
  };
}

export function registerAudio<T>(audio: WebAudioCueBus<T>): void {
  audio
    .defineSample("step-con-a", stepConA)
    .defineSample("step-con-b", stepConB)
    .defineSample("step-wood-a", stepWoodA)
    .defineSample("step-wood-b", stepWoodB)
    .defineSample("step-wood-c", stepWoodC)
    .defineSample("wood-med", woodMed)
    .defineSample("wood-light", woodLight)
    .defineSample("glass-light", glassLight)
    .defineSample("glass-med", glassMed)
    .defineSample("metal-light", metalLight)
    .defineSample("metal-light-b", metalLightB)
    .defineSample("metal-med", metalMed)
    .defineSample("metal-heavy", metalHeavy)
    .defineSample("metal-heavy-b", metalHeavyB)
    .defineSample("plate", plate)
    .defineSample("plate-b", plateB)
    .defineSample("soft-heavy", softHeavy)
    .defineSample("soft-med", softMed)
    .defineSample("mining", mining)
    .defineSample("mining-b", miningB)
    .defineSample("generic", generic)
    .defineSample("door-open", doorOpen)
    .defineSample("door-close", doorClose)
    .defineSample("thruster", thruster, { loop: true, playbackRate: 0.94 })
    .defineSample("engine-small", engineSmall, { playbackRate: 0.82 })
    .defineSample("low", lowBoom, { playbackRate: 0.7, detune: -180 })
    .defineSample("crunch", crunch)
    .defineSample("radio", radio, { loop: true, playbackRate: 0.9 })
    .defineSample("field", field)
    .defineSample("switch", switchClick)
    .defineSample("click", click);

  audio.define("wind", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 2);
    src.loop = true;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    const gain = ac.createGain();
    gain.gain.value = 0.18;
    src.connect(filter).connect(gain).connect(output);
    src.start();
    return stoppable([src, gain]);
  });

  audio.define("room", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 2);
    src.loop = true;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 280;
    const gain = ac.createGain();
    gain.gain.value = 0.08;
    src.connect(filter).connect(gain).connect(output);
    src.start();
    return stoppable([src, gain]);
  });

  audio.define("motor", ({ audioContext: ac, output }) => {
    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 74;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 240;
    const gain = ac.createGain();
    gain.gain.value = 0.05;
    osc.connect(filter).connect(gain).connect(output);
    osc.start();
    return stoppable([osc, gain]);
  });

  audio.define("pit-hum", ({ audioContext: ac, output }) => {
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 58;
    const gain = ac.createGain();
    gain.gain.value = 0.03;
    osc.connect(gain).connect(output);
    osc.start();
    return stoppable([osc, gain]);
  });

  audio.define("breath", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 1.6);
    src.loop = true;
    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 860;
    filter.Q.value = 0.7;
    const amp = ac.createGain();
    amp.gain.value = 0.055;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.2;
    const depth = ac.createGain();
    depth.gain.value = 0.035;
    lfo.connect(depth).connect(amp.gain);
    src.connect(filter).connect(amp).connect(output);
    src.start();
    lfo.start();
    return stoppable([src, lfo, amp]);
  });

  audio.define("void", ({ audioContext: ac, output }) => {
    const a = ac.createOscillator();
    const b = ac.createOscillator();
    a.type = "sine";
    b.type = "sine";
    a.frequency.value = 52;
    b.frequency.value = 78;
    const gain = ac.createGain();
    gain.gain.value = 0.03;
    a.connect(gain);
    b.connect(gain);
    gain.connect(output);
    a.start();
    b.start();
    return stoppable([a, b, gain]);
  });

  audio.define("gun-crack", ({ audioContext: ac, output }) => {
    const buffer = noiseBuffer(ac, 0.16);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] *= (1 - i / data.length) ** 1.5;
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 700;
    const gain = ac.createGain();
    gain.gain.value = 0.85;
    src.connect(filter).connect(gain).connect(output);
    src.start();
    return stoppable([src, gain]);
  });

  audio.define("gun-tail", ({ audioContext: ac, output }) => {
    const buffer = noiseBuffer(ac, 0.2);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] *= (1 - i / data.length) ** 1.1;
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const delay = ac.createDelay(1.2);
    delay.delayTime.value = 0.058;
    const feedback = ac.createGain();
    feedback.gain.value = 0.46;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1600;
    const gain = ac.createGain();
    const now = ac.currentTime;
    gain.gain.setValueAtTime(0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.45);
    src.connect(delay);
    delay.connect(filter);
    filter.connect(feedback);
    feedback.connect(delay);
    filter.connect(gain).connect(output);
    src.start();
    return stoppable([src, gain, feedback]);
  });

  audio.define("suit-thump", ({ audioContext: ac, output }) => {
    const osc = ac.createOscillator();
    osc.type = "sine";
    const now = ac.currentTime;
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(34, now + 0.16);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.45, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain).connect(output);
    osc.start();
    osc.stop(now + 0.24);
    return stoppable([osc, gain]);
  });

  audio.define("ear-ring", ({ audioContext: ac, output }) => {
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 2480;
    const gain = ac.createGain();
    const now = ac.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
    osc.connect(gain).connect(output);
    osc.start();
    osc.stop(now + 3.3);
    return stoppable([osc, gain]);
  });
}

export const soundCues: SoundCue[] = [
  cue("bed-wind", "wind", 11, 31.5, 0.7, true),
  cue("bed-room", "room", 30, 124, 0.9, true),
  cue("bed-room-end", "room", 340, 350, 1, true),
  cue("bed-motor", "motor", 124, 150, 0.8, true),
  cue("bed-pit", "pit-hum", 150, 202, 0.8, true),
  cue("bed-breath", "breath", 216, 339.6, 0.85, true),
  cue("bed-void", "void", 216, 339.6, 0.7, true),
  cue("bed-suit", "radio", 216, 300, 0.07, true),
  cue("s-wood-door", "wood-light", 12.4, 13.1, 0.35),
  ...Array.from({ length: 28 }, (_, index) =>
    cue(
      `s-alley-step-${index}`,
      index % 2 === 0 ? "step-con-a" : "step-con-b",
      13.1 + index * 0.52,
      13.48 + index * 0.52,
      0.45,
    ),
  ),
  cue("s-in-1", "step-wood-a", 30.4, 30.9, 0.4),
  cue("s-in-2", "step-wood-b", 31.05, 31.55, 0.4),
  cue("s-in-3", "step-wood-c", 31.7, 32.2, 0.38),
  cue("s-in-4", "step-wood-a", 32.35, 32.85, 0.36),
  cue("s-glass-case", "glass-med", 86.6, 87.6, 0.55),
  cue("s-iron-1", "metal-light", 88.2, 88.9, 0.4),
  cue("s-iron-2", "metal-light-b", 89.15, 89.8, 0.42),
  cue("s-iron-3", "metal-light", 90.05, 90.7, 0.4),
  cue("s-cup", "glass-light", 76.15, 76.8, 0.35),
  cue("s-pay", "switch", 102.5, 103.2, 0.45),
  cue("s-click", "click", 103.15, 103.6, 0.3),
  ...Array.from({ length: 12 }, (_, index) =>
    cue(
      `s-lathe-${index}`,
      index % 2 === 0 ? "mining" : "mining-b",
      129 + index * 1.25,
      129.7 + index * 1.25,
      0.42,
    ),
  ),
  cue("s-blade", "metal-med", 147.2, 148.1, 0.5),
  cue("s-sweep", "soft-med", 144.4, 145.2, 0.3),
  cue("s-plier-1", "metal-light", 155.1, 155.7, 0.38),
  cue("s-plier-2", "metal-light-b", 156.6, 157.2, 0.36),
  cue("s-plier-3", "metal-light", 158.4, 159, 0.34),
  cue("s-plier-4", "metal-light-b", 160.1, 160.7, 0.34),
  cue("s-glue-1", "soft-med", 166.2, 166.9, 0.28),
  cue("s-glue-2", "generic", 168.4, 169, 0.25),
  cue("s-glue-3", "soft-med", 170.5, 171.2, 0.26),
  ...TEST_FIRES.flatMap((start, index) => [
    cue(`s-gun-plate-${index}`, index % 2 === 0 ? "plate" : "plate-b", start, start + 1.25, 0.95),
    cue(`s-gun-metal-${index}`, index % 2 === 0 ? "metal-heavy" : "metal-heavy-b", start, start + 1.1, 0.7),
    cue(`s-gun-crunch-${index}`, "crunch", start, start + 1.15, 0.42),
    cue(`s-gun-low-${index}`, "low", start, start + 1.2, 0.5),
    cue(`s-gun-crack-${index}`, "gun-crack", start, start + 0.35, 0.85),
    cue(`s-gun-tail-${index}`, "gun-tail", start, start + 1.55, 0.75),
    cue(`s-meat-${index}`, "soft-heavy", start + 0.07, start + 0.7, 0.48),
  ]),
  cue("s-ring", "ear-ring", 181.25, 185.2, 0.8),
  cue("s-pit-step-1", "step-con-a", 183.3, 183.75, 0.4),
  cue("s-pit-step-2", "step-con-b", 184.05, 184.5, 0.4),
  cue("s-pit-step-3", "step-con-a", 184.8, 185.25, 0.38),
  cue("s-pit-step-4", "step-con-b", 185.55, 186, 0.36),
  cue("s-cloth", "soft-med", 187.1, 188, 0.4),
  cue("s-arrive", "engine-small", 216.3, 218.6, 0.28),
  cue("s-depress", "field", 255.2, 259.4, 0.42),
  cue("s-hatch", "door-open", 256.7, 259.2, 0.55),
  cue("s-photo-bed", "radio", 261.2, 268.8, 0.22),
  cue("s-glove", "metal-med", 278.7, 279.5, 0.32),
  cue("s-scope", "metal-light", 286.55, 287.2, 0.36),
  cue("s-mag-1", "metal-light-b", 292.32, 292.85, 0.3),
  cue("s-mag-2", "metal-med", 294.22, 294.75, 0.28),
  ...FIRE_TIMES.flatMap((start, index) => [
    cue(`s-vac-click-${index}`, index % 2 === 0 ? "metal-light" : "metal-light-b", start, start + 0.16, 0.22),
    cue(`s-vac-thump-${index}`, "suit-thump", start, start + 0.26, 0.7),
    cue(`s-vac-body-${index}`, "low", start, start + 0.34, 0.16),
  ]),
  cue("s-alarm-bed", "radio", 306.6, 312.4, 0.32),
  cue("s-flee", "thruster", 306.2, 322.5, 0.26, true),
  cue("s-hatch-shut", "door-close", 319.2, 321.4, 0.4),
  cue("s-burn", "thruster", 324.2, 339.4, 0.42, true),
];

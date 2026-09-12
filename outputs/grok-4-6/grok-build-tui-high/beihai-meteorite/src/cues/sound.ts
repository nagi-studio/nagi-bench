import type { SoundCue, WebAudioCueBus } from "@agentbench/cinematic-player";
import { T, DURATION } from "../constants";

import computerHum from "../assets/audio/computerNoise_001.ogg?inline";
import computerHum2 from "../assets/audio/computerNoise_002.ogg?inline";
import doorClose from "../assets/audio/doorClose_001.ogg?inline";
import doorOpen from "../assets/audio/doorOpen_001.ogg?inline";
import airlock from "../assets/audio/doorOpen_002.ogg?inline";
import engineCirc from "../assets/audio/engineCircular_002.ogg?inline";
import explosion0 from "../assets/audio/explosionCrunch_000.ogg?inline";
import explosion2 from "../assets/audio/explosionCrunch_002.ogg?inline";
import boom0 from "../assets/audio/lowFrequency_explosion_000.ogg?inline";
import boom1 from "../assets/audio/lowFrequency_explosion_001.ogg?inline";
import sciMetal from "../assets/audio/impactMetal_002.ogg?inline";
import suitLoop from "../assets/audio/spaceEngineLow_000.ogg?inline";
import suitLoop2 from "../assets/audio/spaceEngineLow_002.ogg?inline";
import smallEngine from "../assets/audio/spaceEngineSmall_001.ogg?inline";
import thruster0 from "../assets/audio/thrusterFire_000.ogg?inline";
import thruster2 from "../assets/audio/thrusterFire_002.ogg?inline";
import field from "../assets/audio/forceField_001.ogg?inline";
import wood0 from "../assets/audio/footstep_wood_000.ogg?inline";
import wood1 from "../assets/audio/footstep_wood_001.ogg?inline";
import wood2 from "../assets/audio/footstep_wood_002.ogg?inline";
import wood3 from "../assets/audio/footstep_wood_003.ogg?inline";
import conc0 from "../assets/audio/footstep_concrete_000.ogg?inline";
import conc1 from "../assets/audio/footstep_concrete_001.ogg?inline";
import conc2 from "../assets/audio/footstep_concrete_002.ogg?inline";
import conc3 from "../assets/audio/footstep_concrete_003.ogg?inline";
import metalH0 from "../assets/audio/impactMetal_heavy_000.ogg?inline";
import metalH2 from "../assets/audio/impactMetal_heavy_002.ogg?inline";
import metalM1 from "../assets/audio/impactMetal_medium_001.ogg?inline";
import metalL0 from "../assets/audio/impactMetal_light_000.ogg?inline";
import metalL2 from "../assets/audio/impactMetal_light_002.ogg?inline";
import glassM from "../assets/audio/impactGlass_medium_001.ogg?inline";
import glassH from "../assets/audio/impactGlass_heavy_000.ogg?inline";
import softH from "../assets/audio/impactSoft_heavy_001.ogg?inline";
import softM from "../assets/audio/impactSoft_medium_000.ogg?inline";
import plateH from "../assets/audio/impactPlate_heavy_000.ogg?inline";
import punchH from "../assets/audio/impactPunch_heavy_000.ogg?inline";
import mine1 from "../assets/audio/impactMining_001.ogg?inline";
import mine3 from "../assets/audio/impactMining_003.ogg?inline";
import woodHit from "../assets/audio/impactWood_medium_001.ogg?inline";
import tin from "../assets/audio/impactTin_medium_000.ogg?inline";
import generic from "../assets/audio/impactGeneric_light_001.ogg?inline";
import sw4 from "../assets/audio/switch4.ogg?inline";
import sw7 from "../assets/audio/switch7.ogg?inline";
import sw12 from "../assets/audio/switch12.ogg?inline";
import sw20 from "../assets/audio/switch20.ogg?inline";
import click from "../assets/audio/click3.ogg?inline";

function s(
  id: string,
  sound: string,
  start: number,
  end: number,
  gain = 0.6,
  extra: Partial<SoundCue> = {},
): SoundCue {
  return { id, kind: "sound", sound, start, end, gain, ...extra };
}

function shotTime(i: number): number {
  if (i < 10) return T.fire0 + i * 0.215;
  if (i < 20) return T.reload1 + (i - 10) * 0.215;
  return T.reload2 + (i - 20) * 0.215;
}

const woods = ["wood-step-0", "wood-step-1", "wood-step-2", "wood-step-3"];
const concs = ["conc-step-0", "conc-step-1", "conc-step-2", "conc-step-3"];

function steps(id: string, soundIds: string[], t0: number, t1: number, interval: number, gain: number): SoundCue[] {
  const out: SoundCue[] = [];
  let t = t0;
  let i = 0;
  while (t < t1) {
    out.push(s(`${id}-${i}`, soundIds[i % soundIds.length]!, t, t + 0.35, gain));
    t += interval;
    i += 1;
  }
  return out;
}

export const soundCues: SoundCue[] = [
  s("amb-void", "void-drone", 0, T.titleEnd, 0.22, { group: "amb", sustain: true }),
  s("amb-yard", "yard-night", T.titleEnd, T.courtyardEnd, 0.18, { group: "amb", sustain: true }),
  s("amb-house", "room-warm", T.courtyardEnd, T.bargainEnd, 0.16, { group: "amb", sustain: true }),
  s("amb-shop", "comp-hum", T.bargainEnd, T.workshopEnd, 0.28, { group: "amb", sustain: true }),
  s("amb-cnc", "cnc-loop", T.cncStart, T.cncEnd, 0.42, { group: "amb", sustain: true }),
  s("amb-cellar", "cellar-tone", T.workshopEnd, T.basementEnd, 0.22, { group: "amb", sustain: true }),
  s("amb-suit", "suit-loop", T.basementEnd, DURATION, 0.2, { group: "amb", sustain: true }),
  s("amb-suit2", "suit-loop-b", T.basementEnd, DURATION, 0.08, { group: "amb", sustain: true }),
  s("amb-breath", "suit-breath", T.basementEnd, DURATION, 0.17, { group: "amb", sustain: true }),
  s("amb-field", "space-field", T.basementEnd, T.escape, 0.07, { group: "amb", sustain: true }),

  ...steps("yard-foot", woods, T.walkStart, T.walkEnd, 0.58, 0.38),
  s("door-in", "door-open", T.courtyardEnd - 0.4, T.courtyardEnd + 1.1, 0.45),
  ...steps("house-foot", woods, T.collectorWalk, T.collectorArrive, 0.62, 0.32),
  s("glass-1", "glass-med", 34.2, 34.8, 0.22),
  s("wood-cup", "wood-hit", 47.8, 48.4, 0.28),
  s("metal-stone-1", "metal-light-0", 81.2, 81.8, 0.3),
  s("metal-stone-2", "metal-light-2", 97.4, 98.0, 0.28),
  s("safe-metal", "metal-med", T.safeOpen, T.safeOpen + 0.7, 0.4),
  s("iron-1", "metal-heavy-0", T.ironShow, T.ironShow + 0.6, 0.4),
  s("iron-2", "metal-heavy-2", T.ironShow + 1.1, T.ironShow + 1.7, 0.35),
  s("iron-3", "tin-hit", T.ironShow + 2.0, T.ironShow + 2.5, 0.3),
  s("phone-tap", "click", T.pay, T.pay + 0.25, 0.35),
  s("switch-pay", "sw-4", T.pay + 0.4, T.pay + 0.7, 0.3),

  s("door-shop", "door-close", T.bargainEnd, T.bargainEnd + 0.8, 0.4),
  ...steps("shop-foot", concs, T.bargainEnd + 1.2, T.bargainEnd + 6, 0.55, 0.28),
  s("cnc-hit-a", "mine-1", T.cncStart + 0.4, T.cncStart + 1.1, 0.45),
  s("cnc-hit-b", "mine-3", T.cncStart + 4.2, T.cncStart + 4.9, 0.4),
  s("cnc-hit-c", "plate-h", T.cncStart + 8.5, T.cncStart + 9.2, 0.35),
  s("cnc-hit-d", "mine-1", T.cncStart + 12.8, T.cncStart + 13.5, 0.4),
  s("cnc-hit-e", "sci-metal", T.cncEnd - 2.2, T.cncEnd - 1.4, 0.38),
  s("shave-1", "metal-light-0", T.collectShavings, T.collectShavings + 0.45, 0.32),
  s("shave-2", "metal-light-2", T.collectShavings + 1.1, T.collectShavings + 1.55, 0.3),
  s("tool-off", "metal-med", T.collectShavings + 3.2, T.collectShavings + 3.9, 0.4),

  ...steps("cell-foot", concs, T.workshopEnd + 0.6, T.workshopEnd + 4.5, 0.6, 0.3),
  s("bullet-1", "sw-7", T.bulletWork + 1.2, T.bulletWork + 1.45, 0.4),
  s("bullet-2", "sw-12", T.bulletWork + 3.6, T.bulletWork + 3.85, 0.38),
  s("bullet-3", "tin-hit", T.bulletWork + 6.1, T.bulletWork + 6.5, 0.28),
  s("glue-1", "generic", T.bulletWork + 8.2, T.bulletWork + 8.6, 0.25),
  s("mag-in", "sw-20", T.loadGun, T.loadGun + 0.4, 0.45),
  s("slide", "sw-4", T.loadGun + 0.55, T.loadGun + 0.85, 0.4),

  s("shot-a-boom", "boom-0", T.shot0, T.shot0 + 1.3, 0.95, { group: "gun" }),
  s("shot-a-crunch", "crunch-0", T.shot0, T.shot0 + 0.9, 0.85, { group: "gun" }),
  s("shot-a-punch", "punch-h", T.shot0, T.shot0 + 0.5, 0.7, { group: "gun" }),
  s("shot-a-tail", "gun-tail", T.shot0, T.shot0 + 1.8, 0.55, { group: "gun" }),

  s("shot-b-boom", "boom-1", T.shot1, T.shot1 + 1.3, 0.9, { group: "gun" }),
  s("shot-b-crunch", "crunch-2", T.shot1, T.shot1 + 0.9, 0.8, { group: "gun" }),
  s("shot-b-punch", "punch-h", T.shot1, T.shot1 + 0.5, 0.65, { group: "gun" }),
  s("shot-b-tail", "gun-tail", T.shot1, T.shot1 + 1.7, 0.5, { group: "gun" }),

  s("shot-c-boom", "boom-0", T.shot2, T.shot2 + 1.3, 0.92, { group: "gun" }),
  s("shot-c-crunch", "crunch-0", T.shot2, T.shot2 + 0.9, 0.82, { group: "gun" }),
  s("shot-c-punch", "punch-h", T.shot2, T.shot2 + 0.5, 0.68, { group: "gun" }),
  s("shot-c-tail", "gun-tail", T.shot2, T.shot2 + 1.7, 0.5, { group: "gun" }),

  s("shot-d-boom", "boom-1", T.shot3, T.shot3 + 1.3, 0.88, { group: "gun" }),
  s("shot-d-crunch", "crunch-2", T.shot3, T.shot3 + 0.9, 0.8, { group: "gun" }),
  s("shot-d-punch", "punch-h", T.shot3, T.shot3 + 0.5, 0.66, { group: "gun" }),
  s("shot-d-tail", "gun-tail", T.shot3, T.shot3 + 1.8, 0.52, { group: "gun" }),

  s("cloth-open", "soft-m", T.beefOpen, T.beefOpen + 0.5, 0.4),
  s("meat", "soft-h", T.beefOpen + 1.4, T.beefOpen + 2.0, 0.45),
  s("gravel", "generic", T.beefOpen + 2.2, T.beefOpen + 2.7, 0.3),

  s("radio-open", "sw-12", T.hatch - 0.2, T.hatch + 0.15, 0.35, { group: "radio" }),
  s("airlock", "airlock", T.hatch, T.hatch + 1.4, 0.4),
  s("group-thrust", "thruster-0", T.groupOut, T.groupStop, 0.22, { group: "space", sustain: true }),
  s("visor-sw", "sw-7", T.visors, T.visors + 0.25, 0.3),
  s("glove-twist", "metal-light-2", T.glove, T.glove + 0.45, 0.28, { group: "suit" }),
  s("gun-out", "sw-20", T.gunUp, T.gunUp + 0.3, 0.32, { group: "suit" }),
  s("scope-on", "click", T.gunUp + 0.5, T.gunUp + 0.7, 0.28, { group: "suit" }),

  ...Array.from({ length: 30 }, (_, i) => {
    const t0 = shotTime(i);
    return s(`vac-thump-${i}`, "suit-thump", t0, t0 + 0.22, 0.28 + (i % 3) * 0.04, { group: "suit" });
  }),
  s("reload-1", "sw-4", T.fire1end + 0.1, T.reload1 + 0.15, 0.3, { group: "suit" }),
  s("reload-2", "sw-7", T.fire2end + 0.1, T.reload2 + 0.15, 0.3, { group: "suit" }),
  s("heart", "heartbeat", T.fire3end, T.impact0 + 1.5, 0.22, { group: "suit", sustain: true }),

  s("hit-gas-1", "soft-m", T.impact0, T.impact0 + 0.5, 0.18, { group: "suit" }),
  s("hit-gas-2", "soft-h", T.impact0 + 0.7, T.impact0 + 1.2, 0.16, { group: "suit" }),
  s("glass-helm", "glass-h", T.impact0 + 1.1, T.impact0 + 1.7, 0.22, { group: "suit" }),
  s("radio-panic", "sw-12", T.shout - 0.15, T.shout + 0.2, 0.4, { group: "radio" }),
  s("retreat-thrust", "thruster-2", T.retreat, T.retreat + 4.2, 0.18, { group: "space", sustain: true }),
  s("zhang-thrust", "small-engine", T.escape, DURATION, 0.32, { group: "space", sustain: true }),
  s("zhang-fire", "thruster-0", T.escape, T.escape + 2.4, 0.28, { group: "space" }),
];

export function registerSounds(audio: WebAudioCueBus): void {
  audio
    .defineSample("comp-hum", computerHum, { loop: true, playbackRate: 0.86 })
    .defineSample("comp-hum-b", computerHum2, { loop: true })
    .defineSample("door-close", doorClose)
    .defineSample("door-open", doorOpen)
    .defineSample("airlock", airlock, { playbackRate: 0.72 })
    .defineSample("cnc-loop", engineCirc, { loop: true, playbackRate: 0.78, detune: -120 })
    .defineSample("crunch-0", explosion0)
    .defineSample("crunch-2", explosion2)
    .defineSample("boom-0", boom0)
    .defineSample("boom-1", boom1)
    .defineSample("sci-metal", sciMetal)
    .defineSample("suit-loop", suitLoop, { loop: true, playbackRate: 0.7 })
    .defineSample("suit-loop-b", suitLoop2, { loop: true, playbackRate: 0.55, detune: -200 })
    .defineSample("small-engine", smallEngine, { loop: true, playbackRate: 0.85 })
    .defineSample("thruster-0", thruster0, { loop: true })
    .defineSample("thruster-2", thruster2, { loop: true, playbackRate: 0.9 })
    .defineSample("space-field", field, { loop: true, playbackRate: 0.45 })
    .defineSample("wood-step-0", wood0)
    .defineSample("wood-step-1", wood1)
    .defineSample("wood-step-2", wood2)
    .defineSample("wood-step-3", wood3)
    .defineSample("conc-step-0", conc0)
    .defineSample("conc-step-1", conc1)
    .defineSample("conc-step-2", conc2)
    .defineSample("conc-step-3", conc3)
    .defineSample("metal-heavy-0", metalH0)
    .defineSample("metal-heavy-2", metalH2)
    .defineSample("metal-med", metalM1)
    .defineSample("metal-light-0", metalL0)
    .defineSample("metal-light-2", metalL2)
    .defineSample("glass-med", glassM)
    .defineSample("glass-h", glassH)
    .defineSample("soft-h", softH)
    .defineSample("soft-m", softM)
    .defineSample("plate-h", plateH)
    .defineSample("punch-h", punchH)
    .defineSample("mine-1", mine1)
    .defineSample("mine-3", mine3)
    .defineSample("wood-hit", woodHit)
    .defineSample("tin-hit", tin)
    .defineSample("generic", generic)
    .defineSample("sw-4", sw4)
    .defineSample("sw-7", sw7)
    .defineSample("sw-12", sw12)
    .defineSample("sw-20", sw20)
    .defineSample("click", click);

  audio.define("void-drone", ({ audioContext: ac, output, offset }) => {
    const osc = ac.createOscillator();
    const osc2 = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();
    osc.type = "sine";
    osc2.type = "triangle";
    osc.frequency.value = 46;
    osc2.frequency.value = 92;
    filter.type = "lowpass";
    filter.frequency.value = 180;
    gain.gain.value = 0.0001;
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(output);
    const now = ac.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.8);
    osc.start(now);
    osc2.start(now);
    void offset;
    return { stop: () => { try { osc.stop(); osc2.stop(); } catch { /* */ } } };
  });

  audio.define("yard-night", ({ audioContext: ac, output }) => {
    const noise = ac.createBufferSource();
    const buffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.6;
    const gain = ac.createGain();
    gain.gain.value = 0.12;
    noise.connect(filter).connect(gain).connect(output);
    noise.start();
    return { stop: () => { try { noise.stop(); } catch { /* */ } } };
  });

  audio.define("room-warm", ({ audioContext: ac, output }) => {
    const osc = ac.createOscillator();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = 58;
    filter.type = "lowpass";
    filter.frequency.value = 140;
    gain.gain.value = 0.22;
    osc.connect(filter).connect(gain).connect(output);
    osc.start();
    return { stop: () => { try { osc.stop(); } catch { /* */ } } };
  });

  audio.define("cellar-tone", ({ audioContext: ac, output }) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = 38;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 90;
    gain.gain.value = 0.12;
    osc.connect(filter).connect(gain).connect(output);
    osc.start();
    return { stop: () => { try { osc.stop(); } catch { /* */ } } };
  });

  audio.define("suit-breath", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const master = ac.createGain();
    master.gain.value = 0.9;
    master.connect(output);
    const id = window.setInterval(() => {
      const t = ac.currentTime;
      const src = ac.createBufferSource();
      const buffer = ac.createBuffer(1, ac.sampleRate * 0.8, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const env = Math.sin((i / data.length) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env;
      }
      src.buffer = buffer;
      const filter = ac.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 900;
      const g = ac.createGain();
      g.gain.value = 0.18;
      src.connect(filter).connect(g).connect(master);
      src.start(t);
    }, 3200);
    return {
      stop: () => {
        window.clearInterval(id);
      },
    };
  });

  audio.define("suit-thump", ({ audioContext: ac, output }) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();
    osc.type = "sine";
    osc.frequency.setValueAtTime(90, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(28, ac.currentTime + 0.16);
    filter.type = "lowpass";
    filter.frequency.value = 220;
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.8, ac.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.2);
    osc.connect(filter).connect(gain).connect(output);
    osc.start();
    osc.stop(ac.currentTime + 0.22);
    return { stop: () => { try { osc.stop(); } catch { /* */ } } };
  });

  audio.define("gun-tail", ({ audioContext: ac, output }) => {
    const delay = ac.createDelay(0.5);
    delay.delayTime.value = 0.09;
    const fb = ac.createGain();
    fb.gain.value = 0.45;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    const src = ac.createOscillator();
    const g = ac.createGain();
    src.type = "square";
    src.frequency.setValueAtTime(140, ac.currentTime);
    src.frequency.exponentialRampToValueAtTime(40, ac.currentTime + 0.2);
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.5, ac.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.7);
    src.connect(g);
    g.connect(delay);
    delay.connect(fb).connect(delay);
    delay.connect(filter).connect(output);
    g.connect(output);
    src.start();
    src.stop(ac.currentTime + 0.75);
    return { stop: () => { try { src.stop(); } catch { /* */ } } };
  });

  audio.define("heartbeat", ({ audioContext: ac, output }) => {
    const master = ac.createGain();
    master.connect(output);
    const beat = (t: number, amp: number) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = 48;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(amp, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 0.2);
    };
    const start = ac.currentTime;
    for (let i = 0; i < 24; i++) {
      const t = start + i * 0.92;
      beat(t, 0.45);
      beat(t + 0.18, 0.28);
    }
    return { stop: () => { master.disconnect(); } };
  });
}

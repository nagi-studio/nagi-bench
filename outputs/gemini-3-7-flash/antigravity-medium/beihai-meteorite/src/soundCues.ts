import type { SoundCue, WebAudioCueBus } from "@agentbench/cinematic-player";

// Selected offline CC0 sound samples from /opt/agentbench/sfx
import metalHeavy0 from "./assets/audio/impactMetal_heavy_000.ogg?inline";
import metalHeavy2 from "./assets/audio/impactMetal_heavy_002.ogg?inline";
import metalMedium from "./assets/audio/impactMetal_medium_000.ogg?inline";
import metalLight from "./assets/audio/impactMetal_light_000.ogg?inline";
import softHeavy from "./assets/audio/impactSoft_heavy_000.ogg?inline";
import softMedium from "./assets/audio/impactSoft_medium_000.ogg?inline";
import woodMedium from "./assets/audio/impactWood_medium_000.ogg?inline";
import glassLight from "./assets/audio/impactGlass_light_000.ogg?inline";
import glassHeavy from "./assets/audio/impactGlass_heavy_000.ogg?inline";
import footstepConcrete from "./assets/audio/footstep_concrete_000.ogg?inline";
import spaceEngine0 from "./assets/audio/spaceEngineLow_000.ogg?inline";
import spaceEngine1 from "./assets/audio/spaceEngineLow_001.ogg?inline";
import thruster0 from "./assets/audio/thrusterFire_000.ogg?inline";
import thruster1 from "./assets/audio/thrusterFire_001.ogg?inline";
import doorClose from "./assets/audio/doorClose_000.ogg?inline";
import doorOpen from "./assets/audio/doorOpen_000.ogg?inline";
import computerBeep from "./assets/audio/computerNoise_000.ogg?inline";
import lowExplosion from "./assets/audio/lowFrequency_explosion_000.ogg?inline";
import click1 from "./assets/audio/click1.ogg?inline";
import click3 from "./assets/audio/click3.ogg?inline";
import mouseclick from "./assets/audio/mouseclick1.ogg?inline";
import switch1 from "./assets/audio/switch1.ogg?inline";
import switch3 from "./assets/audio/switch3.ogg?inline";

/**
 * Register all sampled and procedural sound definitions to WebAudioCueBus.
 */
export function setupAudioBus(audio: WebAudioCueBus): void {
  // 1. Register sampled sounds
  audio
    .defineSample("metal-heavy", metalHeavy0)
    .defineSample("metal-stone-clink", metalHeavy2, { playbackRate: 1.25, detune: 100 })
    .defineSample("metal-medium", metalMedium)
    .defineSample("metal-light", metalLight)
    .defineSample("soft-hit", softHeavy)
    .defineSample("soft-medium", softMedium)
    .defineSample("wood-table", woodMedium)
    .defineSample("glass-cabinet", glassLight)
    .defineSample("glass-shatter", glassHeavy)
    .defineSample("footstep", footstepConcrete, { playbackRate: 0.9 })
    .defineSample("space-hum", spaceEngine0, { loop: true, playbackRate: 0.75 })
    .defineSample("engine-drone", spaceEngine1, { loop: true, playbackRate: 0.85 })
    .defineSample("thruster-burn", thruster0, { playbackRate: 1.1 })
    .defineSample("thruster-puff", thruster1, { playbackRate: 1.4, detune: 200 })
    .defineSample("airlock-open", doorOpen)
    .defineSample("airlock-close", doorClose)
    .defineSample("cnc-beep", computerBeep, { playbackRate: 1.2 })
    .defineSample("sub-rumble", lowExplosion)
    .defineSample("bullet-click", click1, { playbackRate: 1.3 })
    .defineSample("pliers-click", click3, { playbackRate: 1.1 })
    .defineSample("scope-snap", mouseclick, { playbackRate: 0.8 })
    .defineSample("power-switch", switch1)
    .defineSample("lamp-switch", switch3);

  // 2. Register procedural sounds (Web Audio synthesis for specialized acoustic effects)
  // Deafening gunshot in underground concrete room with dense early reflections and long reverberation tail
  audio.define("basement-gunshot", ({ audioContext: ac, output }) => {
    const t0 = ac.currentTime;
    
    // Muzzle blast noise burst
    const bufferSize = ac.sampleRate * 1.8;
    const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const outputData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      outputData[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ac.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2800, t0);
    filter.frequency.exponentialRampToValueAtTime(160, t0 + 1.6);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(1.0, t0 + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.4, t0 + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.7);

    // Punch sub-kick
    const subOsc = ac.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(180, t0);
    subOsc.frequency.exponentialRampToValueAtTime(32, t0 + 0.28);
    const subGain = ac.createGain();
    subGain.gain.setValueAtTime(0.9, t0);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);

    subOsc.connect(subGain).connect(output);
    whiteNoise.connect(filter).connect(gain).connect(output);

    subOsc.start(t0);
    whiteNoise.start(t0);
    subOsc.stop(t0 + 0.4);
    whiteNoise.stop(t0 + 1.8);

    return {
      stop: () => {
        try {
          subOsc.stop();
          whiteNoise.stop();
        } catch {}
      },
    };
  });

  // Vacuum internal suit conduction (muffled heartbeat & heavy breath cycle loop)
  audio.define("suit-breath-loop", ({ audioContext: ac, output }) => {
    const t0 = ac.currentTime;
    const osc = ac.createOscillator();
    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    const filter = ac.createBiquadFilter();
    const mainGain = ac.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(45, t0);

    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.28, t0); // ~16 breaths per min
    lfoGain.gain.setValueAtTime(18, t0);

    lfo.connect(lfoGain).connect(osc.frequency);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(180, t0);
    filter.Q.setValueAtTime(3.0, t0);

    mainGain.gain.setValueAtTime(0.35, t0);

    osc.connect(filter).connect(mainGain).connect(output);
    osc.start(t0);
    lfo.start(t0);

    return {
      stop: () => {
        try {
          osc.stop();
          lfo.stop();
        } catch {}
      },
    };
  });

  // Vacuum sniper mechanical muffled click (conducted through suit bones only)
  audio.define("vacuum-gun-click", ({ audioContext: ac, output }) => {
    const t0 = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(95, t0);
    osc.frequency.exponentialRampToValueAtTime(35, t0 + 0.05);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, t0);

    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(0.65, t0 + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.08);

    osc.connect(filter).connect(gain).connect(output);
    osc.start(t0);
    osc.stop(t0 + 0.1);

    return {
      stop: () => {
        try {
          osc.stop();
        } catch {}
      },
    };
  });

  // Lathe cutting sound (metallic friction + motor drone)
  audio.define("lathe-cutting", ({ audioContext: ac, output }) => {
    const t0 = ac.currentTime;
    const bufferSize = ac.sampleRate * 2.5;
    const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ac.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const bpf = ac.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.frequency.setValueAtTime(1450, t0);
    bpf.Q.setValueAtTime(5.0, t0);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(0.5, t0 + 0.2);
    gain.gain.setValueAtTime(0.5, t0 + 2.0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.5);

    noise.connect(bpf).connect(gain).connect(output);
    noise.start(t0);
    noise.stop(t0 + 2.5);

    return {
      stop: () => {
        try {
          noise.stop();
        } catch {}
      },
    };
  });
}

/**
 * Sound Cue Timeline Manifest
 */
export const soundCues: SoundCue[] = [
  // --- ACT I (0 - 55s) ---
  { id: "s-001", kind: "sound", sound: "footstep", group: "sfx", gain: 0.5, start: 1.5, end: 2.2 },
  { id: "s-002", kind: "sound", sound: "wood-table", group: "sfx", gain: 0.6, start: 8.8, end: 9.6 },
  { id: "s-003", kind: "sound", sound: "glass-cabinet", group: "sfx", gain: 0.7, start: 29.8, end: 31.0 },
  { id: "s-004", kind: "sound", sound: "metal-stone-clink", group: "sfx", gain: 0.8, start: 42.8, end: 44.0 },
  { id: "s-005", kind: "sound", sound: "metal-heavy", group: "sfx", gain: 0.85, start: 49.0, end: 50.2 },

  // --- ACT II: Lathe (55 - 94s) ---
  { id: "s-006", kind: "sound", sound: "power-switch", group: "sfx", gain: 0.7, start: 56.0, end: 56.8 },
  { id: "s-007", kind: "sound", sound: "cnc-beep", group: "sfx", gain: 0.55, start: 58.5, end: 60.0 },
  { id: "s-008", kind: "sound", sound: "lathe-cutting", group: "sfx", gain: 0.75, start: 64.0, end: 66.5 },
  { id: "s-009", kind: "sound", sound: "lathe-cutting", group: "sfx", gain: 0.75, start: 69.0, end: 71.5 },
  { id: "s-010", kind: "sound", sound: "metal-medium", group: "sfx", gain: 0.65, start: 77.0, end: 78.2 },

  // --- ACT III: Basement Test (94 - 144s) ---
  { id: "s-011", kind: "sound", sound: "lamp-switch", group: "sfx", gain: 0.7, start: 95.0, end: 95.8 },
  { id: "s-012", kind: "sound", sound: "pliers-click", group: "sfx", gain: 0.75, start: 97.5, end: 98.5 },
  { id: "s-013", kind: "sound", sound: "bullet-click", group: "sfx", gain: 0.8, start: 104.5, end: 105.5 },
  { id: "s-014", kind: "sound", sound: "scope-snap", group: "sfx", gain: 0.8, start: 113.8, end: 114.6 },
  // Deafening gunshot test in basement!
  { id: "s-015", kind: "sound", sound: "basement-gunshot", group: "sfx", gain: 1.0, start: 115.0, end: 117.5 },
  { id: "s-016", kind: "sound", sound: "soft-hit", group: "sfx", gain: 0.8, start: 115.05, end: 115.8 },
  { id: "s-017", kind: "sound", sound: "sub-rumble", group: "sfx", gain: 0.6, start: 115.1, end: 117.0 },
  { id: "s-018", kind: "sound", sound: "metal-light", group: "sfx", gain: 0.6, start: 124.0, end: 125.0 },

  // --- ACT IV: Orbit Assassination (144 - 216s) ---
  { id: "s-019", kind: "sound", sound: "space-hum", group: "ambience", gain: 0.45, sustain: true, start: 144.0, end: 216.0 },
  { id: "s-020", kind: "sound", sound: "suit-breath-loop", group: "ambience", gain: 0.6, sustain: true, start: 145.0, end: 216.0 },
  { id: "s-021", kind: "sound", sound: "airlock-open", group: "sfx", gain: 0.65, start: 164.0, end: 166.0 },
  { id: "s-022", kind: "sound", sound: "scope-snap", group: "sfx", gain: 0.8, start: 175.5, end: 176.5 },
  // 30 silent vacuum shots (represented through muffled bone conduction and subtle suit vibration)
  { id: "s-023", kind: "sound", sound: "vacuum-gun-click", group: "sfx", gain: 0.7, start: 189.8, end: 190.1 },
  { id: "s-024", kind: "sound", sound: "vacuum-gun-click", group: "sfx", gain: 0.7, start: 190.2, end: 190.5 },
  { id: "s-025", kind: "sound", sound: "vacuum-gun-click", group: "sfx", gain: 0.7, start: 190.6, end: 190.9 },
  { id: "s-026", kind: "sound", sound: "vacuum-gun-click", group: "sfx", gain: 0.7, start: 191.0, end: 191.3 },
  { id: "s-027", kind: "sound", sound: "vacuum-gun-click", group: "sfx", gain: 0.7, start: 191.4, end: 191.7 },
  { id: "s-028", kind: "sound", sound: "vacuum-gun-click", group: "sfx", gain: 0.7, start: 192.0, end: 192.3 },
  { id: "s-029", kind: "sound", sound: "vacuum-gun-click", group: "sfx", gain: 0.7, start: 192.4, end: 192.7 },
  { id: "s-030", kind: "sound", sound: "vacuum-gun-click", group: "sfx", gain: 0.7, start: 193.0, end: 193.3 },
  { id: "s-031", kind: "sound", sound: "vacuum-gun-click", group: "sfx", gain: 0.7, start: 193.4, end: 193.7 },
  // 10 seconds later: hit! Helmet visor cracking, suit depressurization
  { id: "s-032", kind: "sound", sound: "glass-shatter", group: "sfx", gain: 0.9, start: 199.5, end: 201.0 },
  { id: "s-033", kind: "sound", sound: "thruster-puff", group: "sfx", gain: 0.85, start: 200.2, end: 201.5 },
  { id: "s-034", kind: "sound", sound: "thruster-burn", group: "sfx", gain: 0.9, start: 201.5, end: 204.0 },
  { id: "s-035", kind: "sound", sound: "airlock-close", group: "sfx", gain: 0.7, start: 205.5, end: 207.5 },
  { id: "s-036", kind: "sound", sound: "thruster-puff", group: "sfx", gain: 0.75, start: 208.5, end: 210.0 },
];

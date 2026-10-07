import { WebAudioCueBus, type CinematicPlayer } from "@agentbench/cinematic-player";

// Inlined CC0 audio assets
import spaceEngineLowData from "./assets/audio/spaceEngineLow_001.ogg?inline";
import switchLightData from "./assets/audio/switch3.ogg?inline";
import switchHeavyData from "./assets/audio/switch15.ogg?inline";
import clickActionData from "./assets/audio/click1.ogg?inline";
import woodStepData from "./assets/audio/footstep_wood_001.ogg?inline";
import metalHeavyData from "./assets/audio/impactMetal_heavy_002.ogg?inline";
import metalMediumData from "./assets/audio/impactMetal_medium_001.ogg?inline";
import metalPlateLightData from "./assets/audio/impactPlate_light_002.ogg?inline";
import explosionCrunchData from "./assets/audio/explosionCrunch_000.ogg?inline";
import subExplosionData from "./assets/audio/lowFrequency_explosion_000.ogg?inline";
import glassHeavyData from "./assets/audio/impactGlass_heavy_001.ogg?inline";
import glassLightData from "./assets/audio/impactGlass_light_002.ogg?inline";
import thrusterJetData from "./assets/audio/thrusterFire_000.ogg?inline";
import airlockDoorOpenData from "./assets/audio/doorOpen_001.ogg?inline";
import airlockDoorCloseData from "./assets/audio/doorClose_001.ogg?inline";
import radioComputerData from "./assets/audio/computerNoise_001.ogg?inline";

export function setupAudioBus<Context>(player: CinematicPlayer<Context>): WebAudioCueBus<Context> {
  const audio = new WebAudioCueBus(player);

  // 1. Register CC0 samples
  audio
    .defineSample("spaceEngineLow", spaceEngineLowData, { loop: true, playbackRate: 0.9 })
    .defineSample("switchLight", switchLightData)
    .defineSample("switchHeavy", switchHeavyData)
    .defineSample("clickAction", clickActionData)
    .defineSample("woodStep", woodStepData, { playbackRate: 1.1 })
    .defineSample("metalHeavy", metalHeavyData)
    .defineSample("metalMedium", metalMediumData)
    .defineSample("metalPlateLight", metalPlateLightData)
    .defineSample("explosionCrunch", explosionCrunchData)
    .defineSample("subExplosion", subExplosionData)
    .defineSample("glassHeavy", glassHeavyData)
    .defineSample("glassLight", glassLightData)
    .defineSample("thrusterJet", thrusterJetData)
    .defineSample("airlockDoorOpen", airlockDoorOpenData)
    .defineSample("airlockDoorClose", airlockDoorCloseData)
    .defineSample("radioComputer", radioComputerData);

  // 2. Procedural Web Audio: Helmet life support breathing & ventilation
  audio.define("procedural-breath", ({ audioContext: ac, output, offset }) => {
    // White noise generator
    const bufferSize = ac.sampleRate * 2;
    const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const outputData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      outputData[i] = Math.random() * 2 - 1;
    }
    const noise = ac.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Filter into low gentle air hiss
    const bandpass = ac.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(480, ac.currentTime);
    bandpass.Q.setValueAtTime(1.8, ac.currentTime);

    // Breathing rhythm LFO
    const breathGain = ac.createGain();
    const cycle = 4.2; // breath cycle in seconds
    const phase = (offset % cycle) / cycle;
    breathGain.gain.setValueAtTime(0.04 + 0.03 * Math.sin(phase * Math.PI * 2), ac.currentTime);

    // Continuous breath automation
    const now = ac.currentTime;
    for (let t = 0; t < 60; t += 0.5) {
      const p = ((offset + t) % cycle) / cycle;
      const targetGain = 0.04 + 0.03 * Math.sin(p * Math.PI * 2);
      breathGain.gain.linearRampToValueAtTime(targetGain, now + t);
    }

    noise.connect(bandpass).connect(breathGain).connect(output);
    noise.start();

    return {
      stop: () => {
        try {
          noise.stop();
          noise.disconnect();
        } catch {}
      },
    };
  });

  // 3. Procedural Web Audio: Atmospheric cinematic suspense pad
  audio.define("procedural-suspense", ({ audioContext: ac, output }) => {
    const freqs = [73.42, 110.0, 164.81, 220.0]; // D2, A2, E3, A3
    const oscs: OscillatorNode[] = [];
    const mainGain = ac.createGain();
    mainGain.gain.setValueAtTime(0.001, ac.currentTime);
    mainGain.gain.exponentialRampToValueAtTime(0.08, ac.currentTime + 2.0);

    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, ac.currentTime);

    freqs.forEach((f, idx) => {
      const osc = ac.createOscillator();
      osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(f, ac.currentTime);
      osc.detune.setValueAtTime((idx - 1.5) * 6, ac.currentTime);

      const oscGain = ac.createGain();
      oscGain.gain.value = 0.25;

      osc.connect(oscGain).connect(filter);
      osc.start();
      oscs.push(osc);
    });

    filter.connect(mainGain).connect(output);

    return {
      stop: () => {
        try {
          oscs.forEach((osc) => {
            osc.stop();
            osc.disconnect();
          });
        } catch {}
      },
    };
  });

  // 4. Procedural Web Audio: Basement gunshot indoor acoustic reverberation
  audio.define("procedural-basement-echo", ({ audioContext: ac, output }) => {
    // Generate enclosed room reverberant burst
    const dur = 2.8;
    const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / ac.sampleRate;
      // Exponential decay with early reflections
      const decay = Math.exp(-t * 2.8);
      const noise = (Math.random() * 2 - 1) * decay;
      // periodic slapback reflection simulation (concrete walls ~4m apart)
      const slap = t > 0.04 && t < 0.12 ? Math.sin(t * 800) * 0.4 * Math.exp(-t * 8) : 0;
      data[i] = noise * 0.8 + slap;
    }

    const src = ac.createBufferSource();
    src.buffer = buf;

    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(750, ac.currentTime);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.65, ac.currentTime);

    src.connect(filter).connect(gain).connect(output);
    src.start();

    return {
      stop: () => {
        try {
          src.stop();
          src.disconnect();
        } catch {}
      },
    };
  });

  // 5. Procedural Web Audio: Suit internal bone-conducted recoil thud in vacuum
  audio.define("procedural-suit-thud", ({ audioContext: ac, output }) => {
    // In vacuum, external sound cannot travel. Gunshot is communicated strictly
    // via bone conduction and suit mechanical vibration.
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(65, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(28, ac.currentTime + 0.18);

    gain.gain.setValueAtTime(0.001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.45, ac.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.22);

    osc.connect(gain).connect(output);
    osc.start();
    osc.stop(ac.currentTime + 0.25);

    return {
      stop: () => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      },
    };
  });

  return audio;
}

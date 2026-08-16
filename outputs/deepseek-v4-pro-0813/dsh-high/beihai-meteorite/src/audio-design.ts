import type { WebAudioCueBus } from "@agentbench/cinematic-player";

// Selected CC0 samples (Kenney), imported inline so the build is self-contained.
import footstepWood from "./assets/audio/footstep_wood_000.ogg?inline";
import footstepConcrete from "./assets/audio/footstep_concrete_000.ogg?inline";
import thruster from "./assets/audio/thrusterFire_002.ogg?inline";
import engineSmall from "./assets/audio/spaceEngineSmall_002.ogg?inline";
import computerNoise from "./assets/audio/computerNoise_001.ogg?inline";
import doorOpen from "./assets/audio/doorOpen_001.ogg?inline";
import doorClose from "./assets/audio/doorClose_001.ogg?inline";
import engineCircular from "./assets/audio/engineCircular_002.ogg?inline";
import mining from "./assets/audio/impactMining_001.ogg?inline";
import metalHeavy from "./assets/audio/impactMetal_heavy_002.ogg?inline";
import metalLight from "./assets/audio/impactMetal_light_002.ogg?inline";
import metalMedium from "./assets/audio/impactMetal_medium_003.ogg?inline";
import softHeavy from "./assets/audio/impactSoft_heavy_001.ogg?inline";
import glassLight from "./assets/audio/impactGlass_light_001.ogg?inline";
import uiClick from "./assets/audio/click3.ogg?inline";
import uiSwitch from "./assets/audio/switch8.ogg?inline";

function noiseBuffer(ac: AudioContext, seconds: number, colour: "white" | "pink" | "brown"): AudioBuffer {
  const length = Math.max(1, Math.floor(ac.sampleRate * seconds));
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  if (colour === "white") {
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  } else if (colour === "pink") {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  } else {
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }
  return buffer;
}

function impulseResponse(ac: AudioContext, seconds: number, decay: number): AudioBuffer {
  const length = Math.max(1, Math.floor(ac.sampleRate * seconds));
  const buffer = ac.createBuffer(2, length, ac.sampleRate);
  for (let ch = 0; ch < 2; ch += 1) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buffer;
}

/**
 * 把录制的真实采样与程序化合成层注册进 cue bus。
 * 所有 defineSample 必须在 unlock() 之前调用。
 */
export function configureAudio<Context = unknown>(audio: WebAudioCueBus<Context>): WebAudioCueBus<Context> {
  audio
    .defineSample("footstep-wood", footstepWood)
    .defineSample("footstep-concrete", footstepConcrete)
    .defineSample("thruster", thruster)
    .defineSample("engine-small", engineSmall, { loop: true })
    .defineSample("computer-noise", computerNoise)
    .defineSample("door-open", doorOpen)
    .defineSample("door-close", doorClose)
    .defineSample("engine-circular", engineCircular, { loop: true, playbackRate: 0.85 })
    .defineSample("mining", mining)
    .defineSample("metal-heavy", metalHeavy)
    .defineSample("metal-light", metalLight)
    .defineSample("metal-medium", metalMedium)
    .defineSample("soft-heavy", softHeavy)
    .defineSample("glass-light", glassLight)
    .defineSample("ui-click", uiClick)
    .defineSample("ui-switch", uiSwitch);

  // 室内环境的暖底噪。
  audio.define("room-tone", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 4, "brown");
    src.loop = true;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 220;
    const gain = ac.createGain();
    gain.gain.value = 0.5;
    src.connect(lp).connect(gain).connect(output);
    src.start();
    return { stop: () => { try { src.stop(); } catch {} } };
  });

  // 太空深处的极低音床。
  audio.define("space-drone", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 6, "pink");
    src.loop = true;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 140;
    const gain = ac.createGain();
    gain.gain.value = 0.6;
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 46;
    const og = ac.createGain();
    og.gain.value = 0.4;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ac.createGain();
    lfoGain.gain.value = 90;
    lfo.connect(lfoGain).connect(osc.frequency);
    src.connect(lp).connect(gain).connect(output);
    osc.connect(og).connect(output);
    src.start();
    osc.start();
    lfo.start();
    return {
      stop: () => {
        try { src.stop(); } catch {}
        try { osc.stop(); } catch {}
        try { lfo.stop(); } catch {}
      },
    };
  });

  // 航天服内的呼吸：滤波噪声 + 慢速起伏。
  audio.define("suit-breath", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 4, "pink");
    src.loop = true;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900;
    bp.Q.value = 0.6;
    const gain = ac.createGain();
    gain.gain.value = 0.0;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.42;
    const lfoGain = ac.createGain();
    lfoGain.gain.value = 0.5;
    const bias = ac.createGain();
    bias.gain.value = 0.5;
    lfo.connect(lfoGain).connect(gain.gain);
    bias.connect(gain.gain);
    src.connect(bp).connect(gain).connect(output);
    src.start();
    lfo.start();
    return {
      stop: () => {
        try { src.stop(); } catch {}
        try { lfo.stop(); } catch {}
      },
    };
  });

  // 供氧系统持续的嘶声。
  audio.define("oxygen-hiss", ({ audioContext: ac, output }) => {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 4, "white");
    src.loop = true;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 3800;
    bp.Q.value = 1.4;
    const gain = ac.createGain();
    gain.gain.value = 0.22;
    src.connect(bp).connect(gain).connect(output);
    src.start();
    return { stop: () => { try { src.stop(); } catch {} } };
  });

  // 数控机床的尖细旋转啸声。
  audio.define("lathe-whine", ({ audioContext: ac, output }) => {
    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 210;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 680;
    lp.Q.value = 4;
    const gain = ac.createGain();
    gain.gain.value = 0.16;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 9;
    const lfoGain = ac.createGain();
    lfoGain.gain.value = 60;
    lfo.connect(lfoGain).connect(osc.frequency);
    osc.connect(lp).connect(gain).connect(output);
    osc.start();
    lfo.start();
    return {
      stop: () => {
        try { osc.stop(); } catch {}
        try { lfo.stop(); } catch {}
      },
    };
  });

  // 地下室室内枪声：噪声爆裂 + 低频闷响，经卷积混响强烈反射。
  audio.define("gunshot", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const conv = ac.createConvolver();
    conv.buffer = impulseResponse(ac, 1.6, 2.6);
    const wet = ac.createGain();
    wet.gain.value = 0.85;

    const crack = ac.createBufferSource();
    crack.buffer = noiseBuffer(ac, 0.5, "white");
    const crackBp = ac.createBiquadFilter();
    crackBp.type = "bandpass";
    crackBp.frequency.setValueAtTime(2600, now);
    crackBp.frequency.exponentialRampToValueAtTime(400, now + 0.12);
    crackBp.Q.value = 0.7;
    const crackGain = ac.createGain();
    crackGain.gain.setValueAtTime(0.0001, now);
    crackGain.gain.exponentialRampToValueAtTime(1.0, now + 0.003);
    crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    const boom = ac.createOscillator();
    boom.type = "sine";
    boom.frequency.setValueAtTime(150, now);
    boom.frequency.exponentialRampToValueAtTime(42, now + 0.22);
    const boomGain = ac.createGain();
    boomGain.gain.setValueAtTime(0.0001, now);
    boomGain.gain.exponentialRampToValueAtTime(0.9, now + 0.004);
    boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    const direct = ac.createGain();
    direct.gain.value = 0.5;
    crack.connect(crackBp).connect(crackGain);
    crackGain.connect(direct).connect(output);
    crackGain.connect(conv).connect(wet).connect(output);
    boom.connect(boomGain);
    boomGain.connect(direct);
    boomGain.connect(conv);

    crack.start(now);
    boom.start(now);
    crack.stop(now + 0.5);
    boom.stop(now + 0.55);
    return {
      stop: () => {
        try { crack.stop(); } catch {}
        try { boom.stop(); } catch {}
      },
    };
  });

  // 真空中航天服内传导的闷震：极低、极闷，几乎只是胸口一震。
  audio.define("vac-thump", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const boom = ac.createOscillator();
    boom.type = "sine";
    boom.frequency.setValueAtTime(70, now);
    boom.frequency.exponentialRampToValueAtTime(30, now + 0.12);
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 160;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.75, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    boom.connect(lp).connect(gain).connect(output);
    boom.start(now);
    boom.stop(now + 0.3);
    return { stop: () => { try { boom.stop(); } catch {} } };
  });

  // 基地警报：低频双音脉冲，混在无线电里似有若无。
  audio.define("alarm", ({ audioContext: ac, output }) => {
    const gain = ac.createGain();
    gain.gain.value = 0.3;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    gain.connect(lp).connect(output);
    const osc = ac.createOscillator();
    osc.type = "square";
    osc.frequency.value = 620;
    const oscGain = ac.createGain();
    oscGain.gain.value = 0.0;
    osc.connect(oscGain).connect(gain);
    const lfo = ac.createOscillator();
    lfo.frequency.value = 1.6;
    const lfoGain = ac.createGain();
    lfoGain.gain.value = 0.24;
    lfo.connect(lfoGain).connect(oscGain.gain);
    osc.start();
    lfo.start();
    return {
      stop: () => {
        try { osc.stop(); } catch {}
        try { lfo.stop(); } catch {}
      },
    };
  });

  return audio;
}

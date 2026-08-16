import type { SoundCue, WebAudioCueBus } from "@agentbench/cinematic-player";

import footWood from "./assets/audio/footstep_wood_001.ogg?inline";
import footWoodB from "./assets/audio/footstep_wood_003.ogg?inline";
import footConcrete from "./assets/audio/footstep_concrete_002.ogg?inline";
import glassLight from "./assets/audio/impactGlass_light_001.ogg?inline";
import woodLight from "./assets/audio/impactWood_light_002.ogg?inline";
import metalLight from "./assets/audio/impactMetal_light_003.ogg?inline";
import metalMedium from "./assets/audio/impactMetal_medium_000.ogg?inline";
import metalHeavy from "./assets/audio/impactMetal_heavy_000.ogg?inline";
import mining from "./assets/audio/impactMining_001.ogg?inline";
import plateHeavy from "./assets/audio/impactPlate_heavy_002.ogg?inline";
import softMedium from "./assets/audio/impactSoft_medium_001.ogg?inline";
import punchHeavy from "./assets/audio/impactPunch_heavy_002.ogg?inline";
import tinMedium from "./assets/audio/impactTin_medium_003.ogg?inline";
import switchClack from "./assets/audio/switch11.ogg?inline";
import switchSnap from "./assets/audio/switch27.ogg?inline";
import clickSmall from "./assets/audio/click3.ogg?inline";
import rollover from "./assets/audio/rollover2.ogg?inline";
import doorOpenWood from "./assets/audio/doorOpen_001.ogg?inline";
import doorCloseHeavy from "./assets/audio/doorClose_002.ogg?inline";
import doorOpenHatch from "./assets/audio/doorOpen_002.ogg?inline";
import lathe from "./assets/audio/engineCircular_003.ogg?inline";
import computerA from "./assets/audio/computerNoise_002.ogg?inline";
import computerB from "./assets/audio/computerNoise_000.ogg?inline";
import lowBoom from "./assets/audio/lowFrequency_explosion_001.ogg?inline";
import stationHum from "./assets/audio/spaceEngineLow_000.ogg?inline";
import hiss from "./assets/audio/forceField_002.ogg?inline";
import suitSystems from "./assets/audio/forceField_003.ogg?inline";
import thruster from "./assets/audio/thrusterFire_001.ogg?inline";
import thrusterMass from "./assets/audio/thrusterFire_004.ogg?inline";

import { T } from "./timeline";

/**
 * 声音设计。
 *
 * 三条规则贯穿全片：
 *  1. 地球段落是"有房间"的：脚步、玻璃、木头、机床都用真实采样，
 *     地下室的枪声额外挂一条程序化卷积混响 —— 小混凝土房间的强反射。
 *  2. 真空段落是"没有房间"的：舱外的一切都不发声。观众能听见的只有
 *     航天服内部：呼吸、系统低频、无线电，以及枪机通过握持传导进来的闷震。
 *  3. 采样负责"认得出的东西"，程序化合成只负责房间、身体和主观感受。
 */

const one = (id: string, sound: string, start: number, length = 1.0, gain = 1, group = "sfx"): SoundCue => ({
  id,
  kind: "sound",
  sound,
  group,
  gain,
  start,
  end: start + length,
});

const bed = (id: string, sound: string, start: number, end: number, gain = 1, group = "amb"): SoundCue => ({
  id,
  kind: "sound",
  sound,
  group,
  gain,
  sustain: true,
  start,
  end,
});

/** Rhythmic repeats — footsteps, machining bites, magazine work. */
function series(
  prefix: string,
  sound: string,
  times: number[],
  length: number,
  gain: number,
  group = "sfx",
): SoundCue[] {
  return times.map((t, i) => one(`${prefix}-${String(i).padStart(2, "0")}`, sound, t, length, gain, group));
}

// ── 采样注册 ──────────────────────────────────────────────────────────────
export function defineSamples(audio: WebAudioCueBus<unknown>): void {
  audio
    // 地球 · 室内
    .defineSample("step-wood", footWood, { playbackRate: 0.92 })
    .defineSample("step-wood-b", footWoodB, { playbackRate: 0.88 })
    .defineSample("step-stone", footConcrete, { playbackRate: 0.86 })
    .defineSample("glass-case", glassLight, { playbackRate: 0.9 })
    .defineSample("cup-down", woodLight, { playbackRate: 1.05 })
    .defineSample("stone-down", metalLight, { playbackRate: 0.72, detune: -180 })
    .defineSample("safe-door", metalMedium, { playbackRate: 0.68 })
    .defineSample("iron-ring", metalHeavy, { playbackRate: 0.5, detune: -300 })
    .defineSample("gate", doorOpenWood, { playbackRate: 0.62, detune: -260 })
    .defineSample("basement-door", doorCloseHeavy, { playbackRate: 0.7 })
    // 车间
    .defineSample("lathe-loop", lathe, { loop: true, playbackRate: 0.78, detune: -120 })
    .defineSample("cut-bite", mining, { playbackRate: 1.18 })
    .defineSample("chip-tin", tinMedium, { playbackRate: 1.3 })
    .defineSample("panel", computerA, { playbackRate: 1.0 })
    .defineSample("switch-clack", switchClack, { playbackRate: 0.9 })
    .defineSample("mech-snap", switchSnap, { playbackRate: 1.0 })
    .defineSample("small-click", clickSmall, { playbackRate: 1.0 })
    .defineSample("sweep", rollover, { playbackRate: 0.45, detune: -400 })
    // 地下室 · 枪
    .defineSample("shot-crack", plateHeavy, { playbackRate: 0.82 })
    .defineSample("shot-body", lowBoom, { playbackRate: 0.7 })
    .defineSample("meat-hit", softMedium, { playbackRate: 0.8 })
    .defineSample("cloth", punchHeavy, { playbackRate: 1.6, detune: 260 })
    // 太空 · 舱内
    .defineSample("station-hum", stationHum, { loop: true, playbackRate: 0.6, detune: -240 })
    .defineSample("suit-systems", suitSystems, { loop: true, playbackRate: 0.5, detune: -500 })
    .defineSample("depressurise", hiss, { playbackRate: 0.75 })
    .defineSample("hatch", doorOpenHatch, { playbackRate: 0.72 })
    .defineSample("radio-blip", computerB, { playbackRate: 1.25 })
    // 舱外：只在"看得见"的时候用，绝不在真空里直接播
    .defineSample("thruster-self", thruster, { playbackRate: 0.55, detune: -420 })
    .defineSample("thruster-mass", thrusterMass, { playbackRate: 0.6, detune: -360 });
}

// ── 程序化层：房间、身体、主观 ─────────────────────────────────────────────
const noiseCache = new WeakMap<AudioContext, AudioBuffer>();
const irCache = new WeakMap<AudioContext, AudioBuffer>();

function noiseBuffer(ac: AudioContext): AudioBuffer {
  const cached = noiseCache.get(ac);
  if (cached) return cached;
  const length = Math.floor(ac.sampleRate * 4);
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  let seed = 20260804;
  for (let i = 0; i < length; i += 1) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    data[i] = (seed / 0x3fffffff - 1) * 0.9;
  }
  noiseCache.set(ac, buffer);
  return buffer;
}

/**
 * 一间小混凝土地下室的脉冲响应：密集的早期反射 + 短而硬的尾巴。
 * 枪声在这里不是"响"，是"撞墙"。
 */
function basementIR(ac: AudioContext): AudioBuffer {
  const cached = irCache.get(ac);
  if (cached) return cached;
  const seconds = 1.15;
  const length = Math.floor(ac.sampleRate * seconds);
  const buffer = ac.createBuffer(2, length, ac.sampleRate);
  let seed = 7717;
  const random = (): number => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x3fffffff - 1;
  };
  const taps = [0.0042, 0.0071, 0.0098, 0.0135, 0.0182, 0.0231, 0.0294, 0.0367, 0.0451, 0.0562];
  for (let channel = 0; channel < 2; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      const t = i / ac.sampleRate;
      data[i] = random() * Math.pow(1 - t / seconds, 3.2) * 0.55;
    }
    taps.forEach((tap, index) => {
      const i = Math.floor((tap + channel * 0.0013) * ac.sampleRate);
      if (i < length) data[i] += (index % 2 === 0 ? 1 : -1) * (0.92 - index * 0.075);
    });
  }
  irCache.set(ac, buffer);
  return buffer;
}

export function defineProcedural(audio: WebAudioCueBus<unknown>): void {
  // 地下室的房间本身。与采样枪声同时触发，是"反射"而不是"枪"。
  audio.define("room-slap", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const convolver = ac.createConvolver();
    convolver.buffer = basementIR(ac);
    const source = ac.createBufferSource();
    source.buffer = noiseBuffer(ac);
    const shaper = ac.createBiquadFilter();
    shaper.type = "bandpass";
    shaper.frequency.value = 720;
    shaper.Q.value = 0.55;
    const envelope = ac.createGain();
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(1.0, now + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    const tail = ac.createGain();
    tail.gain.value = 0.85;
    source.connect(shaper).connect(envelope).connect(convolver).connect(tail).connect(output);
    source.start(now, Math.random() * 2);
    source.stop(now + 1.4);
    return { stop: () => { try { source.stop(); } catch { /* already stopped */ } } };
  });

  // 击发后的耳鸣。主观声，只在地下室出现一次。
  audio.define("ear-ring", ({ audioContext: ac, output, cue, offset }) => {
    const now = ac.currentTime;
    const length = cue.end - cue.start - offset;
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(4180, now);
    osc.frequency.linearRampToValueAtTime(3760, now + length);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.4, length));
    osc.connect(gain).connect(output);
    osc.start(now);
    osc.stop(now + Math.max(0.5, length) + 0.1);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  });

  // 老宅的室内声底：一点点低频空气，一点点木头。
  audio.define("room-tone", ({ audioContext: ac, output, cue, offset }) => {
    const now = ac.currentTime;
    const length = Math.max(1, cue.end - cue.start - offset);
    const source = ac.createBufferSource();
    source.buffer = noiseBuffer(ac);
    source.loop = true;
    const low = ac.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 260;
    const peak = ac.createBiquadFilter();
    peak.type = "peaking";
    peak.frequency.value = 120;
    peak.gain.value = 7;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 1.2);
    gain.gain.setValueAtTime(0.09, now + Math.max(1.4, length - 1));
    gain.gain.linearRampToValueAtTime(0.0001, now + length);
    source.connect(low).connect(peak).connect(gain).connect(output);
    source.start(now, offset % 3.5);
    source.stop(now + length + 0.2);
    return { stop: () => { try { source.stop(); } catch { /* already stopped */ } } };
  });

  // 航天服里的呼吸。不是人声，是空气通过面罩的声音：噪声 + 包络。
  audio.define("suit-breath", ({ audioContext: ac, output, cue, offset }) => {
    const now = ac.currentTime;
    const length = Math.max(1, cue.end - cue.start - offset);
    const source = ac.createBufferSource();
    source.buffer = noiseBuffer(ac);
    source.loop = true;
    const band = ac.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 430;
    band.Q.value = 1.1;
    const shelf = ac.createBiquadFilter();
    shelf.type = "lowshelf";
    shelf.frequency.value = 200;
    shelf.gain.value = 6;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    // 4.6 秒一个完整呼吸周期，吸气短、呼气长。相位由 offset 决定，seek 后依然对得上。
    const period = 4.6;
    let phase = -(offset % period);
    while (phase < length) {
      const inhale = now + phase + 0.15;
      const exhale = now + phase + 2.0;
      if (inhale > now) {
        gain.gain.setValueAtTime(0.0001, Math.max(now, inhale - 0.15));
        gain.gain.linearRampToValueAtTime(0.16, inhale + 0.55);
        gain.gain.linearRampToValueAtTime(0.02, inhale + 1.35);
      }
      if (exhale > now) {
        gain.gain.setValueAtTime(0.02, Math.max(now, exhale - 0.1));
        gain.gain.linearRampToValueAtTime(0.2, exhale + 0.5);
        gain.gain.linearRampToValueAtTime(0.0008, exhale + 2.1);
      }
      phase += period;
    }
    source.connect(band).connect(shelf).connect(gain).connect(output);
    source.start(now, offset % 3.5);
    source.stop(now + length + 0.3);
    return { stop: () => { try { source.stop(); } catch { /* already stopped */ } } };
  });

  // 真空中扣扳机：外面绝对无声，只有枪机通过手套、骨头传进来的一下闷震。
  audio.define("vacuum-thump", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(96, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.11);
    const oscGain = ac.createGain();
    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.exponentialRampToValueAtTime(0.5, now + 0.004);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    const click = ac.createBufferSource();
    click.buffer = noiseBuffer(ac);
    const clickFilter = ac.createBiquadFilter();
    clickFilter.type = "lowpass";
    clickFilter.frequency.value = 520;
    const clickGain = ac.createGain();
    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.exponentialRampToValueAtTime(0.22, now + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.connect(oscGain).connect(output);
    click.connect(clickFilter).connect(clickGain).connect(output);
    osc.start(now);
    osc.stop(now + 0.2);
    click.start(now, 0.3);
    click.stop(now + 0.08);
    return {
      stop: () => {
        try { osc.stop(); } catch { /* already stopped */ }
        try { click.stop(); } catch { /* already stopped */ }
      },
    };
  });

  // 等待弹道的十秒：他自己的心跳。纯主观。
  audio.define("heartbeat", ({ audioContext: ac, output, cue, offset }) => {
    const now = ac.currentTime;
    const length = Math.max(1, cue.end - cue.start - offset);
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 52;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    const period = 1.02;
    let phase = -(offset % period);
    while (phase < length) {
      for (const [delay, peak] of [[0, 0.42], [0.24, 0.24]] as const) {
        const at = now + phase + delay;
        if (at > now) {
          gain.gain.setValueAtTime(0.0001, at);
          gain.gain.exponentialRampToValueAtTime(peak, at + 0.035);
          gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.2);
        }
      }
      phase += period;
    }
    osc.connect(gain).connect(output);
    osc.start(now);
    osc.stop(now + length + 0.3);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  });

  // 公共频道的底噪。有人说话时它在，没人说话时它更明显。
  audio.define("radio-bed", ({ audioContext: ac, output, cue, offset }) => {
    const now = ac.currentTime;
    const length = Math.max(1, cue.end - cue.start - offset);
    const source = ac.createBufferSource();
    source.buffer = noiseBuffer(ac);
    source.loop = true;
    const band = ac.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1750;
    band.Q.value = 0.85;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.075, now + 0.5);
    gain.gain.setValueAtTime(0.075, now + Math.max(0.7, length - 0.6));
    gain.gain.linearRampToValueAtTime(0.0001, now + length);
    source.connect(band).connect(gain).connect(output);
    source.start(now, offset % 3.5);
    source.stop(now + length + 0.2);
    return { stop: () => { try { source.stop(); } catch { /* already stopped */ } } };
  });

  // 频道被叫爆：所有人同时按下发射键的那一下削波。
  audio.define("radio-burst", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const source = ac.createBufferSource();
    source.buffer = noiseBuffer(ac);
    const band = ac.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.setValueAtTime(2400, now);
    band.frequency.exponentialRampToValueAtTime(900, now + 0.4);
    band.Q.value = 1.6;
    const shape = ac.createWaveShaper();
    const curve = new Float32Array(257);
    for (let i = 0; i < 257; i += 1) {
      const x = (i / 128) - 1;
      curve[i] = Math.tanh(x * 6);
    }
    shape.curve = curve;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.32, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    source.connect(band).connect(shape).connect(gain).connect(output);
    source.start(now, 1.1);
    source.stop(now + 0.7);
    return { stop: () => { try { source.stop(); } catch { /* already stopped */ } } };
  });

  // 全片的低频地基：不是音乐，是"这个宇宙有多大"的一条线。
  audio.define("void-drone", ({ audioContext: ac, output, cue, offset }) => {
    const now = ac.currentTime;
    const length = Math.max(1, cue.end - cue.start - offset);
    const stack: OscillatorNode[] = [];
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 2.4);
    gain.gain.setValueAtTime(0.16, now + Math.max(2.6, length - 2.2));
    gain.gain.linearRampToValueAtTime(0.0001, now + length);
    for (const [frequency, level, type] of [
      [36.7, 1, "sine"],
      [55.0, 0.42, "sine"],
      [73.4, 0.2, "triangle"],
    ] as const) {
      const osc = ac.createOscillator();
      osc.type = type;
      osc.frequency.value = frequency;
      const level_ = ac.createGain();
      level_.gain.value = level;
      osc.connect(level_).connect(gain);
      osc.start(now);
      osc.stop(now + length + 0.4);
      stack.push(osc);
    }
    gain.connect(output);
    return {
      stop: () => {
        for (const osc of stack) { try { osc.stop(); } catch { /* already stopped */ } }
      },
    };
  });

  // 场与场之间的过场压力：一次向下的扫频。
  audio.define("transition-sweep", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const source = ac.createBufferSource();
    source.buffer = noiseBuffer(ac);
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2600, now);
    filter.frequency.exponentialRampToValueAtTime(90, now + 1.1);
    filter.Q.value = 4;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.26, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    source.connect(filter).connect(gain).connect(output);
    source.start(now, 0.7);
    source.stop(now + 1.35);
    return { stop: () => { try { source.stop(); } catch { /* already stopped */ } } };
  });
}

// ── 声音时间表 ────────────────────────────────────────────────────────────
const shotTimes = [296.05, 296.28, 296.5, 296.74, 296.97, 297.2, 297.43, 297.66, 297.9, 298.13];
const volleyOffsets = [0, 1.95, 3.9];
const vacuumShots: SoundCue[] = volleyOffsets.flatMap((offset, volley) =>
  shotTimes.map((t, index) =>
    one(`sfx-vac-shot-${volley}${String(index).padStart(2, "0")}`, "vacuum-thump", t + offset, 0.4, 0.62, "sub"),
  ),
);

export const soundCues: SoundCue[] = [
  // 序：一块石头在星光里翻滚
  bed("amb-open-drone", "void-drone", T.t0[0], T.t1[1], 0.85, "sub"),
  one("sfx-open-ring", "iron-ring", 0.35, 3.2, 0.5, "sfx"),
  one("sfx-title-swell", "transition-sweep", 5.1, 1.5, 0.7, "sub"),
  bed("amb-open-suit", "suit-systems", T.t1[0], T.t1[1], 0.5, "amb"),
  bed("amb-open-breath", "suit-breath", T.t1[0], T.t1[1], 0.75, "amb"),
  one("sfx-open-blip", "radio-blip", 12.3, 1.2, 0.16, "amb"),

  // 四合院：真实的房间，真实的材料
  one("sfx-cut-to-earth", "transition-sweep", 20.6, 1.4, 0.5, "sub"),
  bed("amb-courtyard", "room-tone", T.c0[0], T.c7[1], 0.9, "amb"),
  one("sfx-gate", "gate", 24.6, 2.4, 0.85, "sfx"),
  ...series("sfx-yard-step", "step-stone", [25.9, 26.6, 27.3, 28.1, 28.8], 0.6, 0.5),
  ...series("sfx-room-step", "step-wood", [30.7, 31.5, 32.3], 0.6, 0.4),
  one("sfx-case-glass-a", "glass-case", 34.2, 1.4, 0.3),
  one("sfx-magnifier", "small-click", 37.1, 0.5, 0.35),
  one("sfx-tea-a", "cup-down", 42.3, 1.0, 0.55),
  one("sfx-tea-b", "cup-down", 43.4, 1.0, 0.4),
  one("sfx-chair", "step-wood-b", 49.6, 0.7, 0.3),
  one("sfx-safe-latch", "switch-clack", 55.6, 0.7, 0.45),
  one("sfx-safe-door", "safe-door", 56.2, 1.8, 0.6),
  one("sfx-scope-set", "small-click", 58.4, 0.6, 0.4),
  one("sfx-cup-lift", "cup-down", 66.9, 1.0, 0.32),
  one("sfx-cup-set", "cup-down", 69.6, 1.0, 0.4),
  one("sfx-case-glass-b", "glass-case", 84.7, 1.4, 0.42),
  ...series("sfx-stone-down", "stone-down", [87.9, 88.6, 89.3], 1.2, 0.62),
  one("sfx-phone-a", "small-click", 95.1, 0.4, 0.4),
  one("sfx-phone-b", "small-click", 95.6, 0.4, 0.4),
  one("sfx-transfer", "radio-blip", 96.3, 0.9, 0.3),

  // 增援未来：地球被推远
  one("sfx-to-orbit", "transition-sweep", 104.4, 1.5, 0.75, "sub"),
  bed("amb-orbit-drone", "void-drone", T.m0[0], T.m0[1], 0.7, "sub"),
  bed("amb-orbit-hum", "station-hum", T.m0[0] + 1, T.m0[1], 0.35, "amb"),

  // 车间：机器
  one("sfx-shop-lights", "switch-clack", 120.6, 1.0, 0.7),
  ...series("sfx-shop-step", "step-stone", [121.6, 122.4, 123.2, 124.0], 0.7, 0.45),
  one("sfx-panel-a", "panel", 126.2, 2.4, 0.42),
  one("sfx-chuck", "safe-door", 128.2, 1.6, 0.5),
  bed("amb-lathe", "lathe-loop", 128.8, 146.0, 0.5, "amb"),
  ...series("sfx-cut", "cut-bite", [134.3, 136.5, 138.7, 140.9, 143.1], 1.4, 0.55),
  ...series("sfx-segment", "chip-tin", [143.9, 144.5, 145.1, 145.6], 0.9, 0.4),
  one("sfx-sweep", "sweep", 147.2, 1.8, 0.55),
  one("sfx-chips-in", "chip-tin", 148.8, 1.0, 0.5),
  one("sfx-tool-off", "mech-snap", 150.2, 0.8, 0.6),
  one("sfx-tool-drop", "safe-door", 150.9, 1.5, 0.45),
  one("sfx-shop-dark", "switch-clack", 153.2, 1.0, 0.7),
  ...series("sfx-shop-exit", "step-stone", [153.7, 154.4], 0.7, 0.4),

  // 地下室：最小的房间，最大的声音
  one("sfx-basement-door", "basement-door", 155.3, 2.0, 0.75),
  bed("amb-basement", "room-tone", 155.6, 190.0, 0.55, "amb"),
  ...series("sfx-round-set", "stone-down", [160.6, 161.2], 1.0, 0.35),
  ...series("sfx-pliers", "mech-snap", [164.4, 165.2, 166.0, 166.8, 167.5], 0.6, 0.5),
  ...series("sfx-glue", "small-click", [169.2, 170.4, 171.6, 172.8, 174.0, 175.2], 0.5, 0.32),
  one("sfx-row-done", "stone-down", 177.2, 1.2, 0.45),
  ...series("sfx-mag-load", "mech-snap", [180.1, 180.5, 180.9, 181.3], 0.5, 0.6),
  one("sfx-mag-in", "safe-door", 181.9, 1.2, 0.6),
  one("sfx-slide", "mech-snap", 182.6, 0.6, 0.7),
  // 四发。每一发都是：直达声（采样） + 房间的反射（程序化卷积）。
  ...[183.4, 184.2, 185.0, 185.8].flatMap((t, i) => [
    one(`sfx-shot-crack-${i}`, "shot-crack", t, 1.2, 0.95),
    one(`sfx-shot-body-${i}`, "shot-body", t + 0.005, 1.6, 0.85, "sub"),
    one(`sfx-shot-room-${i}`, "room-slap", t + 0.012, 1.6, 0.9, "room"),
    one(`sfx-shot-meat-${i}`, "meat-hit", t + 0.05, 1.0, 0.4),
  ]),
  one("sfx-ring", "ear-ring", 186.0, 4.6, 0.8, "sub"),
  one("sfx-cloth-open", "cloth", 191.4, 1.2, 0.5),
  one("sfx-meat-open", "meat-hit", 192.9, 1.2, 0.4),
  ...series("sfx-grit", "stone-down", [196.3, 196.8, 197.3], 1.0, 0.4),
  one("sfx-cloth-lift", "cloth", 199.2, 1.2, 0.45),
  one("sfx-to-space", "transition-sweep", 202.0, 1.5, 0.8, "sub"),

  // 一号基地：最后一次"有房间"的声音
  bed("amb-base-hum", "station-hum", T.s0[0], T.s0[1], 0.7, "amb"),
  bed("amb-base-breath", "suit-breath", T.s0[0] + 1, T.s0[1], 0.5, "amb"),
  one("sfx-locator-off", "switch-clack", 208.3, 0.8, 0.65),
  one("sfx-locator-blip", "radio-blip", 209.1, 1.0, 0.35),
  one("sfx-depress", "depressurise", 211.2, 2.2, 0.75),
  one("sfx-hatch", "hatch", 212.6, 1.8, 0.6),

  // 真空：从这里开始，舱外的一切都不发声
  bed("amb-void-1", "void-drone", 214.0, 243.0, 0.6, "sub"),
  bed("amb-suit-1", "suit-systems", 214.0, 243.0, 0.55, "amb"),
  bed("amb-breath-1", "suit-breath", 214.0, 243.0, 0.9, "amb"),
  one("sfx-thrust-arrive", "thruster-self", 214.2, 2.6, 0.4, "sub"),

  bed("amb-void-2", "void-drone", 243.0, 292.0, 0.5, "sub"),
  bed("amb-suit-2", "suit-systems", 243.0, 292.0, 0.55, "amb"),
  bed("amb-breath-2", "suit-breath", 243.0, 292.0, 0.85, "amb"),
  one("sfx-scope-look", "small-click", 244.6, 0.6, 0.3, "amb"),
  one("sfx-chan-open", "radio-blip", 248.9, 1.0, 0.3, "amb"),
  one("sfx-green-light", "small-click", 250.4, 0.6, 0.28, "amb"),
  bed("amb-radio", "radio-bed", 255.4, 276.0, 0.9, "amb"),
  ...series("sfx-ptt", "radio-blip", [256.5, 260.7, 264.7], 0.8, 0.26, "amb"),
  one("sfx-scope-focus", "mech-snap", 270.9, 0.6, 0.3, "sub"),
  // 装备：全部经由手套和骨头传导，闷、近、干
  one("sfx-glove-ring", "switch-clack", 277.5, 1.0, 0.45, "sub"),
  one("sfx-cold-alarm", "panel", 278.5, 1.6, 0.3, "amb"),
  one("sfx-pistol-out", "stone-down", 282.8, 1.2, 0.4, "sub"),
  one("sfx-mag-out", "mech-snap", 284.2, 0.6, 0.4, "sub"),
  one("sfx-scope-magnet", "mech-snap", 286.5, 0.6, 0.5, "sub"),
  one("sfx-scope-seat", "stone-down", 286.8, 1.0, 0.35, "sub"),

  // 击发：三十次，全部只有传导闷震
  bed("amb-void-3", "void-drone", 292.0, 320.0, 0.45, "sub"),
  bed("amb-suit-3", "suit-systems", 292.0, 320.0, 0.5, "amb"),
  bed("amb-breath-3", "suit-breath", 292.0, 304.0, 0.8, "amb"),
  ...vacuumShots,
  one("sfx-mag-swap-1", "mech-snap", 297.85, 0.6, 0.35, "sub"),
  one("sfx-mag-swap-2", "mech-snap", 299.8, 0.6, 0.35, "sub"),

  // 十秒：只剩心跳和呼吸
  bed("amb-heart", "heartbeat", 304.0, 320.5, 0.7, "sub"),
  bed("amb-breath-4", "suit-breath", 304.0, 320.5, 0.95, "amb"),

  // 命中：真空里没有声音。观众听到的只有频道被叫爆
  bed("amb-void-4", "void-drone", 320.5, 338.0, 0.5, "sub"),
  bed("amb-suit-4", "suit-systems", 320.5, 338.0, 0.45, "amb"),
  bed("amb-breath-5", "suit-breath", 320.5, 338.0, 0.8, "amb"),
  bed("amb-radio-panic", "radio-bed", 321.6, 336.0, 1.1, "amb"),
  ...series("sfx-panic", "radio-burst", [321.8, 326.0, 329.6, 333.5], 0.9, 0.8, "amb"),
  one("sfx-mass-thrust", "thruster-mass", 334.4, 2.4, 0.22, "sub"),

  // 撤离
  bed("amb-void-5", "void-drone", 338.0, 358.0, 0.55, "sub"),
  bed("amb-suit-5", "suit-systems", 338.0, 352.0, 0.45, "amb"),
  bed("amb-breath-6", "suit-breath", 338.0, 352.0, 0.7, "amb"),
  one("sfx-thrust-leave", "thruster-self", 338.4, 5.5, 0.5, "sub"),
];

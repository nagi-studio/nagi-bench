import type { WebAudioCueBus, SoundFactory, SoundFactoryContext } from "@agentbench/cinematic-player";
import { noiseBuffer, reverbIR, env, osc, gain, filter, noiseBed, noiseHit, toneHit } from "./synth";
import { mulberry32 } from "../util";

type Stop = () => void;

/** Track stoppable nodes so each factory can clean up on cue exit / seek. */
function tracker() {
  const stops: Stop[] = [];
  return {
    add(s: Stop) { stops.push(s); },
    src(ac: AudioContext, buf: AudioBuffer, loop = false): AudioBufferSourceNode {
      const s = ac.createBufferSource();
      s.buffer = buf; s.loop = loop;
      stops.push(() => { try { s.stop(); } catch {} });
      return s;
    },
    osc(ac: AudioContext, type: OscillatorType, freq: number): OscillatorNode {
      const o = osc(ac, type, freq);
      stops.push(() => { try { o.stop(); } catch {} });
      return o;
    },
    stopAll() { for (const s of stops) s(); },
  };
}

/** A computed loop buffer of periodic impulses (clock ticks, drips, heartbeats). */
function impulseLoop(ac: AudioContext, period: number, seconds: number, shape: (t: number, rng: () => number) => number, seed = 1): AudioBuffer {
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  const rng = mulberry32(seed);
  for (let i = 0; i < len; i++) {
    const t = i / ac.sampleRate;
    const local = t % period;
    d[i] = shape(local, rng);
  }
  return buf;
}

export function registerSounds(audio: WebAudioCueBus): void {
  const def = (name: string, fn: SoundFactory) => audio.define(name, fn);

  // ============================ AMBIENCE ============================
  def("room_warm", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    const bed = noiseBed(ac, output, { color: "brown", freq: 320, gain: 0.05, lfoRate: 0.1, lfoDepth: 0.015, seed: 2 });
    tr.add(bed.stop);
    // wall clock tick (deterministic)
    const tb = impulseLoop(ac, 1.0, 4, (t, rng) => (t < 0.005 ? (rng() * 2 - 1) * 0.4 * Math.exp(-t * 700) : 0), 3);
    const ts = tr.src(ac, tb, true);
    const tf = filter(ac, "bandpass", 2200, 2);
    const tg = gain(ac, 0.12);
    ts.connect(tf).connect(tg).connect(output); ts.start();
    // distant city murmur
    const city = noiseBed(ac, output, { color: "pink", filter: "lowpass", freq: 180, gain: 0.02, seed: 8 });
    tr.add(city.stop);
    return { stop: () => tr.stopAll() };
  });

  def("workshop_hum", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    for (const [f, g] of [[50, 0.03], [100, 0.02], [150, 0.012]] as const) {
      const o = tr.osc(ac, "sine", f);
      const gg = gain(ac, g);
      o.connect(gg).connect(output); o.start();
    }
    const bed = noiseBed(ac, output, { color: "white", filter: "highpass", freq: 3000, gain: 0.012, seed: 4 });
    tr.add(bed.stop);
    return { stop: () => tr.stopAll() };
  });

  def("basement_room", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    const bed = noiseBed(ac, output, { color: "brown", freq: 240, gain: 0.05, seed: 6 });
    tr.add(bed.stop);
    const hum = tr.osc(ac, "sine", 60);
    const hg = gain(ac, 0.02); hum.connect(hg).connect(output); hum.start();
    // periodic drip with reverb
    const conv = ac.createConvolver(); conv.buffer = reverbIR(ac, 0.9, 2.5, 9);
    const cg = gain(ac, 0.5); conv.connect(cg).connect(output);
    const dripBuf = impulseLoop(ac, 2.7, 5.4, (t, rng) => {
      if (t < 0.02) return Math.sin(t * 2 * Math.PI * (900 + rng() * 300)) * Math.exp(-t * 180) * 0.5;
      return 0;
    }, 11);
    const ds = tr.src(ac, dripBuf, true);
    const dg = gain(ac, 0.16);
    ds.connect(dg); dg.connect(output); dg.connect(conv); ds.start();
    return { stop: () => tr.stopAll() };
  });

  def("suit_interior", ({ audioContext: ac, output, offset }: SoundFactoryContext) => {
    const tr = tracker();
    // breathing: shaped noise, ~4.2s cycle
    const breathBuf = ac.createBuffer(1, Math.floor(ac.sampleRate * 4.2), ac.sampleRate);
    const bd = breathBuf.getChannelData(0);
    const rng = mulberry32(21);
    for (let i = 0; i < bd.length; i++) {
      const t = i / ac.sampleRate;
      const phase = t / 4.2;
      // inhale 0-0.4, exhale 0.45-0.9
      let amp = 0;
      if (phase < 0.4) amp = Math.sin((phase / 0.4) * Math.PI) * 0.5;
      else if (phase > 0.45 && phase < 0.9) amp = Math.sin(((phase - 0.45) / 0.45) * Math.PI) * 0.6;
      bd[i] = (rng() * 2 - 1) * amp;
    }
    const bs = tr.src(ac, breathBuf, true);
    const bf = filter(ac, "bandpass", 600, 0.8);
    const bg = gain(ac, 0.16);
    bs.connect(bf).connect(bg).connect(output); bs.start(ac.currentTime, offset % 4.2);
    // heartbeat lub-dub ~ 1.05s
    const hbBuf = impulseLoop(ac, 1.05, 4.2, (t) => {
      const lub = t < 0.09 ? Math.sin(t * 2 * Math.PI * 52) * Math.exp(-t * 30) : 0;
      const d = t - 0.22;
      const dub = d > 0 && d < 0.08 ? Math.sin(d * 2 * Math.PI * 46) * Math.exp(-d * 34) * 0.7 : 0;
      return (lub + dub) * 0.9;
    }, 22);
    const hs = tr.src(ac, hbBuf, true);
    const hf = filter(ac, "lowpass", 160, 1);
    const hg = gain(ac, 0.22);
    hs.connect(hf).connect(hg).connect(output); hs.start(ac.currentTime, offset % 1.05);
    // suit fan hum
    const fan = noiseBed(ac, output, { color: "white", filter: "bandpass", freq: 1400, q: 1.5, gain: 0.018, seed: 23 });
    tr.add(fan.stop);
    return { stop: () => tr.stopAll() };
  });

  def("space_void", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    for (const f of [55, 58.3, 82.5]) {
      const o = tr.osc(ac, "sine", f);
      const g = gain(ac, 0.035);
      const lp = filter(ac, "lowpass", 200);
      o.connect(lp).connect(g).connect(output); o.start();
    }
    const static_ = noiseBed(ac, output, { color: "white", filter: "bandpass", freq: 1800, q: 0.6, gain: 0.008, lfoRate: 0.3, lfoDepth: 0.004, seed: 24 });
    tr.add(static_.stop);
    return { stop: () => tr.stopAll() };
  });

  def("city_dusk", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    const wind = noiseBed(ac, output, { color: "pink", filter: "bandpass", freq: 500, q: 0.5, gain: 0.05, lfoRate: 0.15, lfoDepth: 0.03, seed: 25 });
    tr.add(wind.stop);
    const rumble = noiseBed(ac, output, { color: "brown", freq: 120, gain: 0.04, seed: 26 });
    tr.add(rumble.stop);
    return { stop: () => tr.stopAll() };
  });

  def("office_room", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    const bed = noiseBed(ac, output, { color: "brown", freq: 280, gain: 0.035, seed: 27 });
    tr.add(bed.stop);
    const hvac = noiseBed(ac, output, { color: "white", filter: "lowpass", freq: 600, gain: 0.012, seed: 28 });
    tr.add(hvac.stop);
    return { stop: () => tr.stopAll() };
  });

  // ============================ MUSIC ============================
  def("title_drone", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    const o = tr.osc(ac, "sawtooth", 55);
    const lp = filter(ac, "lowpass", 180, 1);
    const g = gain(ac);
    env(g, { t0: ac.currentTime, attack: 2.5, decay: 1, sustain: 0.6, hold: 3, release: 3, peak: 0.12 });
    o.connect(lp).connect(g).connect(output); o.start();
    const bell = tr.osc(ac, "sine", 880);
    const bg = gain(ac);
    env(bg, { t0: ac.currentTime + 0.6, attack: 0.01, decay: 3.5, release: 1, peak: 0.06 });
    bell.connect(bg).connect(output); bell.start();
    return { stop: () => tr.stopAll() };
  });

  def("score_warm", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    // gentle A-minor pad, slow tremolo — the collector's small happy world
    const freqs = [220, 261.63, 329.63, 440];
    for (const f of freqs) {
      const o = tr.osc(ac, "triangle", f);
      o.detune.value = (Math.random() - 0.5) * 6;
      const g = gain(ac, 0.03);
      const lp = filter(ac, "lowpass", 1200);
      const lfo = tr.osc(ac, "sine", 0.12 + f * 0.0001);
      const lg = gain(ac, 0.012);
      lfo.connect(lg).connect(g.gain); lfo.start();
      o.connect(lp).connect(g).connect(output); o.start();
    }
    // sparse music-box bell
    const bellBuf = impulseLoop(ac, 6, 12, (t, rng) => {
      if (t < 1.6) { const f = [659.25, 587.33, 523.25][Math.floor(rng() * 3)]!; return Math.sin(t * 2 * Math.PI * f) * Math.exp(-t * 2.2) * 0.25; }
      return 0;
    }, 31);
    const bs = tr.src(ac, bellBuf, true);
    const bg = gain(ac, 0.1); bs.connect(bg).connect(output); bs.start();
    return { stop: () => tr.stopAll() };
  });

  def("score_tension", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    const o = tr.osc(ac, "sawtooth", 41);
    const lp = filter(ac, "lowpass", 160, 2);
    const g = gain(ac, 0.06);
    const pulse = tr.osc(ac, "square", 1.9);
    const pg = gain(ac, 0.04);
    pulse.connect(pg).connect(g.gain); pulse.start();
    o.connect(lp).connect(g).connect(output); o.start();
    const hiss = noiseBed(ac, output, { color: "white", filter: "bandpass", freq: 2600, q: 2, gain: 0.01, lfoRate: 1.9, lfoDepth: 0.008, seed: 32 });
    tr.add(hiss.stop);
    return { stop: () => tr.stopAll() };
  });

  def("score_space", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    const freqs = [65.41, 98, 130.81, 196, 261.63];
    for (const f of freqs) {
      const o = tr.osc(ac, "sawtooth", f);
      o.detune.value = (f % 7) - 3;
      const lp = filter(ac, "lowpass", 600, 0.7);
      const g = gain(ac);
      env(g, { t0: ac.currentTime, attack: 4, decay: 1, sustain: 0.7, hold: 20, release: 6, peak: 0.028 });
      o.connect(lp).connect(g).connect(output); o.start();
    }
    return { stop: () => tr.stopAll() };
  });

  def("score_resolve", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    const freqs = [130.81, 196, 261.63, 329.63, 392];
    for (const f of freqs) {
      const o = tr.osc(ac, "triangle", f);
      const g = gain(ac);
      env(g, { t0: ac.currentTime, attack: 3, decay: 1, sustain: 0.7, hold: 12, release: 6, peak: 0.03 });
      const lp = filter(ac, "lowpass", 1400);
      o.connect(lp).connect(g).connect(output); o.start();
    }
    return { stop: () => tr.stopAll() };
  });

  // ============================ SFX ============================
  def("door_creak", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const o = osc(ac, "sawtooth", 180);
    o.frequency.linearRampToValueAtTime(320, t + 0.7);
    o.frequency.linearRampToValueAtTime(150, t + 1.1);
    const f = filter(ac, "bandpass", 700, 6);
    const g = gain(ac);
    env(g, { t0: t, attack: 0.1, decay: 0.4, sustain: 0.5, hold: 0.4, release: 0.3, peak: 0.1 });
    o.connect(f).connect(g).connect(output); o.start(t); o.stop(t + 1.3);
    noiseHit(ac, output, { t0: t + 1.05, dur: 0.12, freq: 200, type: "lowpass", peak: 0.18, seed: 41 });
    return { stop: () => { try { o.stop(); } catch {} } };
  });

  def("footstep", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    noiseHit(ac, output, { t0: t, dur: 0.09, freq: 160, type: "lowpass", peak: 0.16, color: "brown", seed: 42 });
    toneHit(ac, output, { t0: t, freq: 90, toFreq: 50, dur: 0.1, peak: 0.1 });
    return {};
  });

  def("tea_pour", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 1.6, 43, "white");
    const f = filter(ac, "bandpass", 1200, 1.2);
    f.frequency.linearRampToValueAtTime(2000, t + 1.4);
    const g = gain(ac);
    env(g, { t0: t, attack: 0.15, decay: 0.2, sustain: 0.7, hold: 0.9, release: 0.3, peak: 0.09 });
    src.connect(f).connect(g).connect(output); src.start(t); src.stop(t + 1.6);
    return { stop: () => { try { src.stop(); } catch {} } };
  });

  def("cup_set", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    toneHit(ac, output, { t0: t, freq: 1800, toFreq: 1200, dur: 0.12, type: "triangle", peak: 0.08 });
    noiseHit(ac, output, { t0: t, dur: 0.05, freq: 3000, type: "highpass", peak: 0.05, seed: 44 });
    return {};
  });

  def("stone_place", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    toneHit(ac, output, { t0: t, freq: 140, toFreq: 70, dur: 0.14, peak: 0.16 });
    noiseHit(ac, output, { t0: t, dur: 0.07, freq: 500, type: "lowpass", peak: 0.1, color: "brown", seed: 45 });
    return {};
  });

  def("phone_beep", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    toneHit(ac, output, { t0: t, freq: 1200, dur: 0.08, type: "square", peak: 0.05 });
    toneHit(ac, output, { t0: t + 0.12, freq: 1600, dur: 0.1, type: "square", peak: 0.05 });
    return {};
  });

  def("cnc_spindle", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const tr = tracker();
    const o = tr.osc(ac, "sawtooth", 80);
    o.frequency.exponentialRampToValueAtTime(420, t + 1.4);
    const f = filter(ac, "lowpass", 1600, 2);
    const g = gain(ac);
    env(g, { t0: t, attack: 0.3, decay: 0.3, sustain: 0.8, hold: 1.5, release: 0.8, peak: 0.09 });
    o.connect(f).connect(g).connect(output); o.start(t);
    const whine = noiseBed(ac, output, { color: "white", filter: "bandpass", freq: 2400, q: 3, gain: 0.02, seed: 46 });
    tr.add(whine.stop);
    return { stop: () => tr.stopAll() };
  });

  def("cnc_cut", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 2.2, 47, "white"); src.loop = false;
    const f = filter(ac, "bandpass", 3200, 8);
    const f2 = filter(ac, "highpass", 1800, 1);
    const g = gain(ac);
    env(g, { t0: t, attack: 0.05, decay: 0.2, sustain: 0.8, hold: 1.6, release: 0.4, peak: 0.07 });
    // chatter LFO
    const lfo = osc(ac, "square", 22);
    const lg = gain(ac, 0.03);
    lfo.connect(lg).connect(g.gain); lfo.start(t); lfo.stop(t + 2.2);
    src.connect(f).connect(f2).connect(g).connect(output); src.start(t); src.stop(t + 2.2);
    return { stop: () => { try { src.stop(); lfo.stop(); } catch {} } };
  });

  def("metal_ping", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    for (const f of [2400, 3100, 4300]) toneHit(ac, output, { t0: t, freq: f, dur: 0.4, type: "sine", peak: 0.04 });
    return {};
  });

  def("slug_drop", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const rng = mulberry32(48);
    for (let i = 0; i < 5; i++) {
      const dt = i * 0.07 + rng() * 0.03;
      toneHit(ac, output, { t0: t + dt, freq: 1600 + rng() * 900, dur: 0.08, type: "triangle", peak: 0.04 });
    }
    return {};
  });

  def("tool_remove", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    noiseHit(ac, output, { t0: t, dur: 0.1, freq: 900, type: "bandpass", q: 2, peak: 0.1, seed: 49 });
    toneHit(ac, output, { t0: t + 0.08, freq: 600, toFreq: 300, dur: 0.12, type: "square", peak: 0.05 });
    return {};
  });

  def("pliers_click", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    noiseHit(ac, output, { t0: t, dur: 0.04, freq: 2600, type: "highpass", peak: 0.12, seed: 50 });
    toneHit(ac, output, { t0: t, freq: 1400, toFreq: 800, dur: 0.05, type: "square", peak: 0.05 });
    return {};
  });

  def("glue_squeeze", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    noiseHit(ac, output, { t0: t, dur: 0.3, freq: 700, type: "lowpass", q: 1, peak: 0.06, color: "pink", seed: 51 });
    return {};
  });

  def("mag_load", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    noiseHit(ac, output, { t0: t, dur: 0.06, freq: 1400, type: "bandpass", q: 1.5, peak: 0.14, seed: 52 });
    toneHit(ac, output, { t0: t + 0.05, freq: 320, toFreq: 180, dur: 0.1, type: "square", peak: 0.08 });
    noiseHit(ac, output, { t0: t + 0.09, dur: 0.05, freq: 2200, type: "highpass", peak: 0.1, seed: 53 });
    return {};
  });

  def("slide_rack", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    noiseHit(ac, output, { t0: t, dur: 0.07, freq: 1800, type: "bandpass", q: 1, peak: 0.16, seed: 54 });
    noiseHit(ac, output, { t0: t + 0.13, dur: 0.09, freq: 1000, type: "bandpass", q: 1, peak: 0.18, seed: 55 });
    toneHit(ac, output, { t0: t + 0.13, freq: 240, toFreq: 120, dur: 0.12, type: "square", peak: 0.08 });
    return {};
  });

  def("gunshot", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const tr = tracker();
    // confined basement: crack + body + heavy reflections
    const conv = ac.createConvolver();
    conv.buffer = reverbIR(ac, 1.5, 2.2, 56, 0.9);
    const wet = gain(ac, 0.9); conv.connect(wet).connect(output);
    const dry = gain(ac, 1.0); dry.connect(output);
    // crack
    const crack = tr.src(ac, noiseBuffer(ac, 0.3, 57, "white"));
    const cf = filter(ac, "highpass", 900, 0.7);
    const cg = gain(ac);
    env(cg, { t0: t, attack: 0.001, decay: 0.06, release: 0.12, peak: 0.85 });
    crack.connect(cf).connect(cg); cg.connect(dry); cg.connect(conv); crack.start(t);
    // body thump
    toneHit(ac, dry, { t0: t, freq: 160, toFreq: 40, dur: 0.22, type: "sine", peak: 0.7 });
    toneHit(ac, conv, { t0: t, freq: 120, toFreq: 35, dur: 0.3, type: "triangle", peak: 0.4 });
    // low-passed slam through the room
    const slam = tr.src(ac, noiseBuffer(ac, 0.4, 58, "brown"));
    const sf = filter(ac, "lowpass", 500, 1);
    const sg = gain(ac);
    env(sg, { t0: t, attack: 0.002, decay: 0.15, release: 0.2, peak: 0.5 });
    slam.connect(sf).connect(sg); sg.connect(dry); sg.connect(conv); slam.start(t);
    // tinnitus ring afterwards
    const ring = tr.osc(ac, "sine", 4200);
    const rg = gain(ac);
    env(rg, { t0: t + 0.05, attack: 0.02, decay: 0.5, sustain: 0.4, hold: 1.5, release: 2.5, peak: 0.05 });
    ring.connect(rg).connect(output); ring.start(t);
    return { stop: () => tr.stopAll() };
  });

  def("cloth_rustle", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    noiseHit(ac, output, { t0: t, dur: 0.4, freq: 1600, type: "bandpass", q: 0.6, peak: 0.05, color: "pink", seed: 59 });
    return {};
  });

  def("gravel_pour", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const rng = mulberry32(60);
    for (let i = 0; i < 22; i++) {
      const dt = rng() * 0.6;
      noiseHit(ac, output, { t0: t + dt, dur: 0.03, freq: 1800 + rng() * 2400, type: "bandpass", q: 2, peak: 0.03, seed: 61 + i });
    }
    return {};
  });

  def("glove_twist", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const rng = mulberry32(62);
    for (let i = 0; i < 7; i++) {
      noiseHit(ac, output, { t0: t + i * 0.07, dur: 0.03, freq: 1500 + rng() * 600, type: "bandpass", q: 3, peak: 0.07, seed: 63 + i });
    }
    return {};
  });

  def("scope_mount", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    noiseHit(ac, output, { t0: t, dur: 0.05, freq: 2000, type: "highpass", peak: 0.1, seed: 64 });
    toneHit(ac, output, { t0: t + 0.02, freq: 400, toFreq: 160, dur: 0.12, type: "sine", peak: 0.12 });
    return {};
  });

  def("mag_swap", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    noiseHit(ac, output, { t0: t, dur: 0.05, freq: 1200, type: "bandpass", q: 1.5, peak: 0.1, seed: 65 });
    noiseHit(ac, output, { t0: t + 0.16, dur: 0.07, freq: 1600, type: "bandpass", q: 1.5, peak: 0.12, seed: 66 });
    toneHit(ac, output, { t0: t + 0.16, freq: 300, toFreq: 150, dur: 0.1, type: "square", peak: 0.06 });
    return {};
  });

  // Vacuum: NO air crack. Only suit-conducted mechanical thump + action click.
  def("shot_conducted", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const lp = filter(ac, "lowpass", 380, 1);
    lp.connect(output);
    toneHit(ac, lp, { t0: t, freq: 110, toFreq: 45, dur: 0.13, type: "sine", peak: 0.28 });
    noiseHit(ac, lp, { t0: t, dur: 0.05, freq: 600, type: "lowpass", peak: 0.12, color: "brown", seed: 67 });
    // faint action click conducted through the glove
    noiseHit(ac, output, { t0: t, dur: 0.02, freq: 1400, type: "bandpass", q: 2, peak: 0.04, seed: 68 });
    return {};
  });

  def("thruster_ignite", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 1.4, 69, "white");
    const f = filter(ac, "lowpass", 700, 1);
    f.frequency.linearRampToValueAtTime(300, t + 1.2);
    const g = gain(ac);
    env(g, { t0: t, attack: 0.08, decay: 0.3, sustain: 0.8, hold: 0.6, release: 0.5, peak: 0.14 });
    src.connect(f).connect(g).connect(output); src.start(t); src.stop(t + 1.4);
    toneHit(ac, output, { t0: t, freq: 70, toFreq: 50, dur: 1.0, type: "sine", peak: 0.1 });
    return { stop: () => { try { src.stop(); } catch {} } };
  });

  def("thruster_burn", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    const bed = noiseBed(ac, output, { color: "white", filter: "lowpass", freq: 420, gain: 0.1, lfoRate: 6, lfoDepth: 0.02, seed: 70 });
    tr.add(bed.stop);
    const rumble = tr.osc(ac, "sine", 58);
    const rg = gain(ac, 0.07); rumble.connect(rg).connect(output); rumble.start();
    return { stop: () => tr.stopAll() };
  });

  def("airlock_pump", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 2.4, 71, "white");
    const f = filter(ac, "highpass", 1400, 0.8);
    const g = gain(ac);
    env(g, { t0: t, attack: 0.2, decay: 0.5, sustain: 0.6, hold: 1.2, release: 0.7, peak: 0.08 });
    src.connect(f).connect(g).connect(output); src.start(t); src.stop(t + 2.4);
    return { stop: () => { try { src.stop(); } catch {} } };
  });

  def("airlock_open", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 1.2, 72, "brown");
    const f = filter(ac, "lowpass", 400, 1);
    const g = gain(ac);
    env(g, { t0: t, attack: 0.1, decay: 0.3, sustain: 0.7, hold: 0.5, release: 0.3, peak: 0.12 });
    src.connect(f).connect(g).connect(output); src.start(t); src.stop(t + 1.2);
    toneHit(ac, output, { t0: t + 0.9, freq: 200, toFreq: 90, dur: 0.18, type: "sine", peak: 0.12 });
    return { stop: () => { try { src.stop(); } catch {} } };
  });

  def("radio_static", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    noiseHit(ac, output, { t0: t, dur: 0.18, freq: 1800, type: "bandpass", q: 0.7, peak: 0.06, color: "white", seed: 73 });
    toneHit(ac, output, { t0: t + 0.02, freq: 1000, dur: 0.05, type: "square", peak: 0.03 });
    return {};
  });

  def("radio_beep", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    toneHit(ac, output, { t0: t, freq: 1400, dur: 0.07, type: "sine", peak: 0.05 });
    return {};
  });

  def("alarm", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const tr = tracker();
    const o = tr.osc(ac, "square", 700);
    const g = gain(ac, 0.0);
    const lfo = tr.osc(ac, "square", 2.2);
    const lg = gain(ac, 0.035);
    lfo.connect(lg).connect(g.gain); lfo.start();
    const f = filter(ac, "lowpass", 1400, 1);
    o.connect(f).connect(g).connect(output); o.start();
    o.frequency.setValueAtTime(700, ac.currentTime);
    return { stop: () => tr.stopAll() };
  });

  def("ice_shimmer", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const rng = mulberry32(74);
    for (let i = 0; i < 16; i++) {
      const dt = rng() * 1.2;
      toneHit(ac, output, { t0: t + dt, freq: 3000 + rng() * 5000, dur: 0.5, type: "sine", peak: 0.02 });
    }
    return {};
  });

  def("impact_thump", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    const lp = filter(ac, "lowpass", 120, 1);
    lp.connect(output);
    toneHit(ac, lp, { t0: t, freq: 60, toFreq: 30, dur: 0.4, type: "sine", peak: 0.2 });
    return {};
  });

  def("breath", ({ audioContext: ac, output }: SoundFactoryContext) => {
    const t = ac.currentTime;
    noiseHit(ac, output, { t0: t, dur: 1.0, freq: 600, type: "bandpass", q: 0.8, peak: 0.08, color: "pink", seed: 75 });
    return {};
  });
}

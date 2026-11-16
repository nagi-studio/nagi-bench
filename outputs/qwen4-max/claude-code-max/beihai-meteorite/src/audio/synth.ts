import { mulberry32 } from "../util";

/** Computed white/pink/brown noise buffer — no samples, pure math. */
export function noiseBuffer(ac: BaseAudioContext, seconds: number, seed = 1, color: "white" | "pink" | "brown" = "white"): AudioBuffer {
  const len = Math.max(1, Math.floor(ac.sampleRate * seconds));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  const rng = mulberry32(seed);
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < len; i++) {
    const w = rng() * 2 - 1;
    if (color === "white") d[i] = w;
    else if (color === "brown") { b0 = (b0 + 0.02 * w) / 1.02; d[i] = b0 * 3.5; }
    else { b0 = 0.99765 * b0 + w * 0.0990460; b1 = 0.96300 * b1 + w * 0.2965164; b2 = 0.57000 * b2 + w * 1.0526913; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2; }
  }
  return buf;
}

/** Procedural impulse response: exponentially decaying noise for convolution reverb. */
export function reverbIR(ac: BaseAudioContext, seconds: number, decay: number, seed = 3, diffuse = 0.7): AudioBuffer {
  const len = Math.max(1, Math.floor(ac.sampleRate * seconds));
  const buf = ac.createBuffer(2, len, ac.sampleRate);
  const rng = mulberry32(seed);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      const env = Math.pow(1 - t, decay);
      // early reflections + diffuse tail
      const early = i < ac.sampleRate * 0.05 && rng() > 0.85 ? 2.2 : 1;
      d[i] = (rng() * 2 - 1) * env * early * diffuse;
    }
  }
  return buf;
}

export interface EnvSpec {
  t0: number;
  attack: number;
  decay: number;
  sustain?: number;
  hold?: number;
  release: number;
  peak: number;
}

/** Apply an ADSR-ish envelope to a gain param. */
export function env(g: GainNode, s: EnvSpec): void {
  const p = g.gain;
  const sus = s.sustain ?? 0;
  const hold = s.hold ?? 0;
  p.setValueAtTime(0.0001, s.t0);
  p.linearRampToValueAtTime(s.peak, s.t0 + s.attack);
  p.exponentialRampToValueAtTime(Math.max(0.0001, sus * s.peak), s.t0 + s.attack + s.decay);
  p.setValueAtTime(Math.max(0.0001, sus * s.peak), s.t0 + s.attack + s.decay + hold);
  p.exponentialRampToValueAtTime(0.0001, s.t0 + s.attack + s.decay + hold + s.release);
}

export function osc(ac: BaseAudioContext, type: OscillatorType, freq: number): OscillatorNode {
  const o = ac.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  return o;
}

export function gain(ac: BaseAudioContext, value = 1): GainNode {
  const g = ac.createGain();
  g.gain.value = value;
  return g;
}

export function filter(ac: BaseAudioContext, type: BiquadFilterType, freq: number, q = 1): BiquadFilterNode {
  const f = ac.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  return f;
}

/** A looping noise bed through a filter, with optional slow LFO on gain. */
export function noiseBed(ac: AudioContext, dest: AudioNode, opts: {
  color?: "white" | "pink" | "brown"; filter?: BiquadFilterType; freq?: number; q?: number;
  gain?: number; lfoRate?: number; lfoDepth?: number; seed?: number; loopSeconds?: number;
}): { stop: () => void } {
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, opts.loopSeconds ?? 2, opts.seed ?? 1, opts.color ?? "brown");
  src.loop = true;
  const f = filter(ac, opts.filter ?? "lowpass", opts.freq ?? 400, opts.q ?? 0.7);
  const g = gain(ac, opts.gain ?? 0.1);
  src.connect(f).connect(g).connect(dest);
  let lfo: OscillatorNode | null = null;
  let lfoG: GainNode | null = null;
  if (opts.lfoRate) {
    lfo = osc(ac, "sine", opts.lfoRate);
    lfoG = gain(ac, opts.lfoDepth ?? 0.04);
    lfo.connect(lfoG).connect(g.gain);
    lfo.start();
  }
  src.start();
  return { stop: () => { try { src.stop(); } catch {} try { lfo?.stop(); } catch {} } };
}

/** Short filtered noise transient (clicks, cracks, thumps). */
export function noiseHit(ac: AudioContext, dest: AudioNode, opts: {
  t0: number; dur: number; freq: number; type?: BiquadFilterType; q?: number; peak: number;
  color?: "white" | "pink" | "brown"; seed?: number; decay?: number;
}): void {
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, opts.dur + 0.05, opts.seed ?? 5, opts.color ?? "white");
  const f = filter(ac, opts.type ?? "bandpass", opts.freq, opts.q ?? 1);
  const g = gain(ac);
  env(g, { t0: opts.t0, attack: 0.002, decay: opts.decay ?? opts.dur, release: 0.02, peak: opts.peak });
  src.connect(f).connect(g).connect(dest);
  src.start(opts.t0);
  src.stop(opts.t0 + opts.dur + 0.1);
}

/** A tonal ping/thump with pitch envelope. */
export function toneHit(ac: AudioContext, dest: AudioNode, opts: {
  t0: number; freq: number; toFreq?: number; dur: number; type?: OscillatorType; peak: number; attack?: number;
}): void {
  const o = osc(ac, opts.type ?? "sine", opts.freq);
  if (opts.toFreq) o.frequency.exponentialRampToValueAtTime(Math.max(20, opts.toFreq), opts.t0 + opts.dur);
  const g = gain(ac);
  env(g, { t0: opts.t0, attack: opts.attack ?? 0.004, decay: opts.dur, release: 0.03, peak: opts.peak });
  o.connect(g).connect(dest);
  o.start(opts.t0);
  o.stop(opts.t0 + opts.dur + 0.1);
}

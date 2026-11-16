import type { WebAudioCueBus, SoundFactoryContext, SoundHandle } from "@agentbench/cinematic-player";

/* ================================================================== */
/* Everything below is synthesized at runtime with Web Audio nodes.    */
/* No samples, no files, no data:audio.                                */
/* ================================================================== */

type AC = AudioContext;

const noiseCache = new WeakMap<AC, AudioBuffer>();
function noise(ac: AC, seconds = 2): AudioBuffer {
  let buf = noiseCache.get(ac);
  if (buf && buf.duration >= seconds) return buf;
  const len = Math.floor(ac.sampleRate * seconds);
  buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02; // slight pink-ish
    d[i] = white * 0.6 + last * 0.4;
  }
  noiseCache.set(ac, buf);
  return buf;
}

/** Procedural impulse response: a small, hard, reflective concrete room. */
function roomIR(ac: AC, seconds = 0.7, decay = 3.2): AudioBuffer {
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      const t = i / ac.sampleRate;
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t / seconds, decay);
    }
    // discrete early reflections (slap back off concrete)
    const taps = [0.011, 0.019, 0.027, 0.041, 0.058, 0.083];
    taps.forEach((tt, k) => {
      const idx = Math.floor(tt * ac.sampleRate) + ch * 7;
      if (idx < len) d[idx] += (k % 2 === 0 ? 0.7 : -0.6) * (1 - k * 0.12);
    });
  }
  return buf;
}

interface Nodes { stop: () => void; }
function tracker(): { add: (n: AudioScheduledSourceNode) => void; handle: SoundHandle; out: GainNode | null } {
  const sources: AudioScheduledSourceNode[] = [];
  return {
    add: (n) => sources.push(n),
    handle: { stop: () => { for (const s of sources) { try { s.stop(); } catch { /* already stopped */ } } } },
    out: null,
  };
}

function gain(ac: AC, value: number): GainNode {
  const g = ac.createGain();
  g.gain.value = value;
  return g;
}

function filter(ac: AC, type: BiquadFilterType, freq: number, q = 1): BiquadFilterNode {
  const f = ac.createBiquadFilter();
  f.type = type; f.frequency.value = freq; f.Q.value = q;
  return f;
}

/** A filtered noise burst with an AD envelope. */
function noiseBurst(ac: AC, out: AudioNode, t0: number, dur: number, peak: number, type: BiquadFilterType, freq: number, q = 1, tr?: ReturnType<typeof tracker>): void {
  const src = ac.createBufferSource();
  src.buffer = noise(ac);
  src.loop = true;
  const f = filter(ac, type, freq, q);
  const g = gain(ac, 0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(peak, t0 + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(out);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
  tr?.add(src);
}

function tone(ac: AC, out: AudioNode, t0: number, dur: number, peak: number, f0: number, f1: number, type: OscillatorType = "sine", tr?: ReturnType<typeof tracker>): void {
  const o = ac.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, t0);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
  const g = gain(ac, 0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(peak, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(out);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
  tr?.add(o);
}

/** A sustained pad of detuned oscillators through a slow lowpass. */
function pad(ac: AC, out: AudioNode, freqs: number[], level: number, cutoff: number, tr: ReturnType<typeof tracker>, detune = 6): GainNode {
  const g = gain(ac, 0);
  const lp = filter(ac, "lowpass", cutoff, 0.7);
  g.connect(lp).connect(out);
  for (const f of freqs) {
    for (const d of [-detune, detune]) {
      const o = ac.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.detune.value = d;
      const og = gain(ac, level / (freqs.length * 2));
      o.connect(og).connect(g);
      o.start();
      tr.add(o);
    }
  }
  return g;
}

/* ================================================================== */
/* Registration                                                        */
/* ================================================================== */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerSounds(bus: WebAudioCueBus<any>): void {
  const def = (name: string, fn: (c: SoundFactoryContext) => SoundHandle | void) => bus.define(name, fn);

  /* ---------------- SCORE ---------------- */

  def("scoreOpen", ({ audioContext: ac, output, offset }) => {
    const tr = tracker();
    const t = ac.currentTime;
    const g = pad(ac, output, [55, 82.4, 110], 0.5, 400, tr, 4);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.9, t + 2);
    // a lonely metallic "meteorite" motif
    [0.6, 2.4, 4.6].forEach((tt, i) => {
      tone(ac, output, t + tt, 2.2, 0.16, [880, 659.3, 587.3][i], [880, 659.3, 587.3][i] * 0.99, "sine", tr);
    });
    return tr.handle;
  });

  def("scoreWarm", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const t = ac.currentTime;
    const g = pad(ac, output, [130.8, 164.8, 196, 261.6], 0.4, 900, tr, 5);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.8, t + 3);
    g.gain.setValueAtTime(0.8, t + 58);
    g.gain.linearRampToValueAtTime(0, t + 64);
    return tr.handle;
  });

  def("scoreTension", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const t = ac.currentTime;
    const g = pad(ac, output, [55, 58.3], 0.5, 300, tr, 3);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.7, t + 2);
    // sparse pulse
    for (let i = 0; i < 10; i++) tone(ac, output, t + i * 4, 0.4, 0.12, 110, 55, "triangle", tr);
    return tr.handle;
  });

  def("scoreVoid", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const t = ac.currentTime;
    const g = pad(ac, output, [65.4, 98, 130.8, 196, 261.6], 0.45, 1400, tr, 8);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1.0, t + 8);
    g.gain.setValueAtTime(1.0, t + 16);
    g.gain.linearRampToValueAtTime(0, t + 24);
    // slow shimmer
    const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = 1046.5;
    const og = gain(ac, 0.04); const lfo = ac.createOscillator(); lfo.frequency.value = 0.2;
    const lg = gain(ac, 0.03); lfo.connect(lg).connect(og.gain);
    o.connect(og).connect(output); o.start(); lfo.start(); tr.add(o); tr.add(lfo);
    return tr.handle;
  });

  def("scoreFire", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const t = ac.currentTime;
    const g = pad(ac, output, [49, 51.9, 73.4], 0.5, 260, tr, 3);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.8, t + 1);
    g.gain.setValueAtTime(0.8, t + 20);
    g.gain.linearRampToValueAtTime(0, t + 24);
    for (let i = 0; i < 12; i++) tone(ac, output, t + i * 2, 0.3, 0.1, 98, 49, "triangle", tr);
    return tr.handle;
  });

  def("scoreEnd", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const t = ac.currentTime;
    const g = pad(ac, output, [65.4, 98, 130.8, 196], 0.45, 1000, tr, 6);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.85, t + 4);
    g.gain.setValueAtTime(0.85, t + 18);
    g.gain.linearRampToValueAtTime(0, t + 25);
    tone(ac, output, t + 5, 6, 0.12, 587.3, 587.3, "sine", tr);
    tone(ac, output, t + 12, 8, 0.1, 392, 392, "sine", tr);
    return tr.handle;
  });

  /* ---------------- AMBIENCE ---------------- */

  def("hutong", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const t = ac.currentTime;
    // distant city rumble
    const src = ac.createBufferSource(); src.buffer = noise(ac); src.loop = true;
    const lp = filter(ac, "lowpass", 220, 0.5); const g = gain(ac, 0.18);
    src.connect(lp).connect(g).connect(output); src.start(); tr.add(src);
    // birds + a bicycle bell
    [1.2, 3.4, 6.1].forEach((tt) => { tone(ac, output, t + tt, 0.18, 0.06, 2400, 3000, "sine", tr); tone(ac, output, t + tt + 0.2, 0.12, 0.05, 2800, 2300, "sine", tr); });
    tone(ac, output, t + 4.6, 0.5, 0.08, 1800, 1750, "triangle", tr);
    return tr.handle;
  });

  def("roomTone", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const t = ac.currentTime;
    const src = ac.createBufferSource(); src.buffer = noise(ac); src.loop = true;
    const lp = filter(ac, "lowpass", 160, 0.6); const g = gain(ac, 0.12);
    src.connect(lp).connect(g).connect(output); src.start(); tr.add(src);
    const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = 60; const og = gain(ac, 0.03);
    o.connect(og).connect(output); o.start(); tr.add(o);
    // faint clock tick
    for (let i = 0; i < 48; i++) tone(ac, output, t + i * 2, 0.02, 0.03, 1200, 900, "square", tr);
    return tr.handle;
  });

  def("workshopHum", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const src = ac.createBufferSource(); src.buffer = noise(ac); src.loop = true;
    const bp = filter(ac, "bandpass", 900, 0.4); const g = gain(ac, 0.06);
    src.connect(bp).connect(g).connect(output); src.start(); tr.add(src);
    // fluorescent buzz
    const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = 100;
    const og = gain(ac, 0.025); const hp = filter(ac, "highpass", 300, 0.5);
    o.connect(hp).connect(og).connect(output); o.start(); tr.add(o);
    return tr.handle;
  });

  def("basementTone", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const t = ac.currentTime;
    const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = 48; const og = gain(ac, 0.06);
    o.connect(og).connect(output); o.start(); tr.add(o);
    // faint drip
    [2, 7, 13, 20, 28, 37].forEach((tt) => tone(ac, output, t + tt, 0.1, 0.05, 900, 400, "sine", tr));
    return tr.handle;
  });

  def("spaceDrone", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const t = ac.currentTime;
    const g = pad(ac, output, [43.65, 65.4, 87.3], 0.5, 220, tr, 4);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.8, t + 4);
    // faint high shimmer of the void
    const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = 2093; const og = gain(ac, 0.012);
    o.connect(og).connect(output); o.start(); tr.add(o);
    return tr.handle;
  });

  def("suitBreath", ({ audioContext: ac, output, offset }) => {
    const tr = tracker();
    const t = ac.currentTime;
    const period = 4.2;
    const start = offset % period;
    // schedule several breath cycles
    for (let i = -1; i < 32; i++) {
      const bt = t + i * period - start;
      if (bt < t - 0.1) continue;
      // inhale (higher, shorter) then exhale (lower, longer)
      noiseBurst(ac, output, bt + 0.2, 1.3, 0.16, "bandpass", 700, 0.8, tr);
      noiseBurst(ac, output, bt + 1.9, 1.8, 0.13, "bandpass", 420, 0.7, tr);
    }
    return tr.handle;
  });

  def("heartbeat", ({ audioContext: ac, output, offset }) => {
    const tr = tracker();
    const t = ac.currentTime;
    const period = 1.0;
    const start = offset % period;
    for (let i = -1; i < 26; i++) {
      const bt = t + i * period - start;
      if (bt < t - 0.05) continue;
      tone(ac, output, bt, 0.16, 0.22, 60, 40, "sine", tr);
      tone(ac, output, bt + 0.22, 0.12, 0.14, 55, 38, "sine", tr);
    }
    return tr.handle;
  });

  def("radioStatic", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const src = ac.createBufferSource(); src.buffer = noise(ac); src.loop = true;
    const bp = filter(ac, "bandpass", 1800, 1.2); const g = gain(ac, 0.03);
    src.connect(bp).connect(g).connect(output); src.start(); tr.add(src);
    return tr.handle;
  });

  /* ---------------- EARTH FOLEY ---------------- */

  def("doorOpen", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    tone(ac, output, t, 0.5, 0.12, 180, 90, "sawtooth", tr); // creak
    noiseBurst(ac, output, t + 0.4, 0.12, 0.2, "lowpass", 600, 1, tr); // latch
    return tr.handle;
  });

  def("teaPour", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    noiseBurst(ac, output, t, 2.2, 0.18, "bandpass", 1400, 0.6, tr);
    noiseBurst(ac, output, t + 0.3, 1.8, 0.1, "highpass", 3000, 0.5, tr);
    return tr.handle;
  });

  def("glassCase", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    tone(ac, output, t, 0.15, 0.12, 2600, 2400, "sine", tr);
    tone(ac, output, t + 0.3, 0.2, 0.08, 1900, 1700, "sine", tr);
    return tr.handle;
  });

  def("stoneSet", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    [0, 0.5, 1.0].forEach((tt) => { tone(ac, output, t + tt, 0.12, 0.2, 140, 70, "sine", tr); noiseBurst(ac, output, t + tt, 0.06, 0.1, "lowpass", 800, 1, tr); });
    return tr.handle;
  });

  def("phonePay", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    tone(ac, output, t, 0.12, 0.12, 1318.5, 1318.5, "sine", tr);
    tone(ac, output, t + 0.18, 0.18, 0.12, 1760, 1760, "sine", tr);
    return tr.handle;
  });

  /* ---------------- WORKSHOP ---------------- */

  def("cncSpindle", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = 120;
    const og = gain(ac, 0.08); const bp = filter(ac, "bandpass", 400, 0.8);
    o.connect(bp).connect(og).connect(output); o.start(); tr.add(o);
    const hi = ac.createOscillator(); hi.type = "sine"; hi.frequency.value = 2400;
    const hg = gain(ac, 0.03); hi.connect(hg).connect(output); hi.start(); tr.add(hi);
    return tr.handle;
  });

  def("cutTicks", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    for (let i = 0; i < 40; i++) noiseBurst(ac, output, t + i * 0.25, 0.03, 0.12, "highpass", 4000, 1, tr);
    return tr.handle;
  });

  def("servo", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    tone(ac, output, t, 1.2, 0.1, 300, 900, "sawtooth", tr);
    return tr.handle;
  });

  def("bladeRemove", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    noiseBurst(ac, output, t, 0.08, 0.2, "highpass", 3000, 1, tr);
    tone(ac, output, t + 0.4, 0.3, 0.1, 500, 200, "triangle", tr);
    noiseBurst(ac, output, t + 1.2, 0.1, 0.18, "highpass", 2500, 1, tr);
    return tr.handle;
  });

  /* ---------------- BASEMENT ---------------- */

  def("pliers", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    for (let i = 0; i < 12; i++) {
      noiseBurst(ac, output, t + i * 1.0, 0.04, 0.16, "highpass", 3500, 1, tr);
      tone(ac, output, t + i * 1.0, 0.05, 0.08, 1600, 900, "square", tr);
    }
    return tr.handle;
  });

  def("glueSqueeze", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    noiseBurst(ac, output, t, 1.2, 0.1, "lowpass", 900, 0.7, tr);
    return tr.handle;
  });

  def("magLoad", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    noiseBurst(ac, output, t, 0.06, 0.22, "highpass", 2500, 1, tr);
    noiseBurst(ac, output, t + 0.5, 0.08, 0.25, "lowpass", 1200, 1, tr);
    tone(ac, output, t + 0.5, 0.08, 0.12, 300, 150, "square", tr);
    return tr.handle;
  });

  /** THE basement gunshot: loud, explosive, strongly reflected. */
  def("basementGunshot", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    const conv = ac.createConvolver(); conv.buffer = roomIR(ac, 0.8, 3.0);
    const wet = gain(ac, 0.9); const dry = gain(ac, 0.9);
    conv.connect(wet).connect(output);
    dry.connect(output);
    const bus = gain(ac, 1); bus.connect(conv); bus.connect(dry);
    // crack
    noiseBurst(ac, bus, t, 0.09, 0.95, "highpass", 1800, 0.7, tr);
    // body
    noiseBurst(ac, bus, t, 0.22, 0.9, "lowpass", 2600, 0.8, tr);
    tone(ac, bus, t, 0.2, 0.8, 200, 50, "sine", tr);
    tone(ac, bus, t, 0.12, 0.5, 320, 90, "triangle", tr);
    // mechanical action
    noiseBurst(ac, bus, t + 0.02, 0.05, 0.3, "highpass", 4000, 1, tr);
    return tr.handle;
  });

  def("tinnitus", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = 4200;
    const g = gain(ac, 0); g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 11);
    o.connect(g).connect(output); o.start(t); o.stop(t + 11.2); tr.add(o);
    return tr.handle;
  });

  def("clothOpen", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    noiseBurst(ac, output, t, 1.6, 0.14, "bandpass", 2200, 0.5, tr);
    return tr.handle;
  });

  def("gravelPour", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    for (let i = 0; i < 16; i++) noiseBurst(ac, output, t + i * 0.12 + Math.random() * 0.05, 0.03, 0.1, "highpass", 3000, 1, tr);
    return tr.handle;
  });

  /* ---------------- SPACE (conducted / radio / subjective) ---------------- */

  def("locatorBeep", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    [0, 1.2].forEach((tt) => tone(ac, output, t + tt, 0.15, 0.1, 1046.5, 1046.5, "sine", tr));
    return tr.handle;
  });

  def("radioBeep", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    tone(ac, output, t, 0.08, 0.08, 1568, 1568, "square", tr);
    return tr.handle;
  });

  def("gloveOff", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    tone(ac, output, t, 0.3, 0.12, 900, 500, "triangle", tr); // metal ring
    noiseBurst(ac, output, t + 0.5, 0.8, 0.1, "bandpass", 2000, 0.5, tr); // fabric
    return tr.handle;
  });

  def("gunDraw", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    noiseBurst(ac, output, t, 0.6, 0.12, "bandpass", 1600, 0.6, tr);
    noiseBurst(ac, output, t + 0.7, 0.08, 0.18, "highpass", 3000, 1, tr);
    return tr.handle;
  });

  def("scopeMount", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    noiseBurst(ac, output, t, 0.05, 0.2, "highpass", 3500, 1, tr);
    noiseBurst(ac, output, t + 0.4, 0.06, 0.22, "lowpass", 1500, 1, tr); // magnet seat
    tone(ac, output, t + 0.4, 0.06, 0.1, 400, 200, "square", tr);
    return tr.handle;
  });

  /** Recoil conducted through the suit — a muffled thump, NOT external gunfire. */
  def("suitThump", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    const lp = filter(ac, "lowpass", 300, 0.8);
    lp.connect(output);
    tone(ac, lp, t, 0.18, 0.5, 90, 40, "sine", tr);
    noiseBurst(ac, lp, t, 0.1, 0.3, "lowpass", 400, 0.8, tr);
    return tr.handle;
  });

  def("magReload", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    const lp = filter(ac, "lowpass", 2500, 0.7); lp.connect(output);
    noiseBurst(ac, lp, t, 0.05, 0.2, "highpass", 2000, 1, tr);
    noiseBurst(ac, lp, t + 0.6, 0.07, 0.24, "lowpass", 1200, 1, tr);
    noiseBurst(ac, lp, t + 1.0, 0.06, 0.2, "highpass", 2500, 1, tr);
    return tr.handle;
  });

  /** A deep subjective sub-tone — felt, not heard (the visor cracks). */
  def("subjectiveHit", ({ audioContext: ac, output }) => {
    const tr = tracker(); const t = ac.currentTime;
    tone(ac, output, t, 1.8, 0.4, 38, 30, "sine", tr);
    tone(ac, output, t, 1.4, 0.15, 76, 60, "sine", tr);
    return tr.handle;
  });

  def("thrusterConducted", ({ audioContext: ac, output }) => {
    const tr = tracker();
    const src = ac.createBufferSource(); src.buffer = noise(ac); src.loop = true;
    const lp = filter(ac, "lowpass", 500, 0.7); const g = gain(ac, 0.18);
    src.connect(lp).connect(g).connect(output); src.start(); tr.add(src);
    const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = 70;
    const og = gain(ac, 0.05); const lp2 = filter(ac, "lowpass", 200, 0.7);
    o.connect(lp2).connect(og).connect(output); o.start(); tr.add(o);
    return tr.handle;
  });
}
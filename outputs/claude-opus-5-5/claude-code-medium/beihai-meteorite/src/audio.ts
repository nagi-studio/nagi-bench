import type { WebAudioCueBus, SoundFactoryContext, SoundHandle } from "@agentbench/cinematic-player";

/**
 * Every sound in the film is synthesised here at runtime with Web Audio nodes
 * and computed sample buffers. No recordings, files or data URLs.
 */

type AC = AudioContext;
const noiseCache = new WeakMap<AC, Record<string, AudioBuffer>>();

function noise(ac: AC, kind: "white" | "pink" | "brown" = "white", seconds = 4): AudioBuffer {
  let c = noiseCache.get(ac);
  if (!c) { c = {}; noiseCache.set(ac, c); }
  const key = `${kind}${seconds}`;
  if (c[key]) return c[key]!;
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0, last = 0;
    let seed = 1234567 + ch * 999;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
    for (let i = 0; i < len; i++) {
      const w = rnd();
      if (kind === "white") d[i] = w;
      else if (kind === "pink") {
        b0 = 0.99765 * b0 + w * 0.099046;
        b1 = 0.963 * b1 + w * 0.2965164;
        b2 = 0.57 * b2 + w * 1.0526913;
        d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2;
      } else {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
    }
  }
  c[key] = buf;
  return buf;
}

function src(ac: AC, buf: AudioBuffer, loop = true, rate = 1) {
  const s = ac.createBufferSource();
  s.buffer = buf;
  s.loop = loop;
  s.playbackRate.value = rate;
  return s;
}

function filt(ac: AC, type: BiquadFilterType, freq: number, q = 0.7, gain = 0) {
  const f = ac.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  f.gain.value = gain;
  return f;
}

function g(ac: AC, v = 1) {
  const n = ac.createGain();
  n.gain.value = v;
  // anchor the automation timeline so later ramps start from "now", not from t = 0
  n.gain.setValueAtTime(v, ac.currentTime);
  return n;
}

/** Pre-compute a mono buffer from a sample function. */
function render(ac: AC, seconds: number, fn: (t: number, i: number) => number): AudioBuffer {
  const len = Math.max(1, Math.floor(ac.sampleRate * seconds));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  const sr = ac.sampleRate;
  for (let i = 0; i < len; i++) d[i] = fn(i / sr, i);
  return buf;
}

const bufCache = new WeakMap<AC, Record<string, AudioBuffer>>();
function cached(ac: AC, key: string, make: () => AudioBuffer) {
  let c = bufCache.get(ac);
  if (!c) { c = {}; bufCache.set(ac, c); }
  return (c[key] ??= make());
}

let rs = 99;
const rnd = () => { rs = (rs * 1103515245 + 12345) & 0x7fffffff; return rs / 0x7fffffff; };

/** Impulse responses generated from code. */
function impulse(ac: AC, seconds: number, decay: number, early: Array<[number, number]>, bright = 1) {
  return cached(ac, `ir${seconds}${decay}${bright}${early.length}`, () => {
    const len = Math.floor(ac.sampleRate * seconds);
    const b = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / ac.sampleRate;
        const w = rnd() * 2 - 1;
        lp += (w - lp) * Math.min(1, bright * (1 - t / seconds) + 0.05);
        d[i] = lp * Math.pow(1 - t / seconds, decay) * 0.6;
      }
      for (const [time, amp] of early) {
        const idx = Math.floor((time + ch * 0.0013) * ac.sampleRate);
        for (let k = 0; k < 40 && idx + k < len; k++) d[idx + k] += amp * (rnd() * 2 - 1) * Math.exp(-k / 8);
      }
    }
    return b;
  });
}

interface Handle extends SoundHandle {}
function handle(nodes: Array<AudioScheduledSourceNode>, out: GainNode, ac: AC, fade = 0.08): Handle {
  return {
    stop: () => {
      const now = ac.currentTime;
      try {
        out.gain.cancelScheduledValues(now);
        out.gain.setValueAtTime(out.gain.value, now);
        out.gain.linearRampToValueAtTime(0, now + fade);
      } catch { /* ignore */ }
      for (const n of nodes) { try { n.stop(now + fade + 0.02); } catch { /* already stopped */ } }
    },
  };
}

/** Envelope helper honouring the elapsed offset when a cue is resumed mid-way. */
function env(param: AudioParam, now: number, offset: number, points: Array<[number, number]>) {
  // points: [time, value] relative to cue start
  let started = false;
  for (let i = 0; i < points.length; i++) {
    const [t, v] = points[i]!;
    const at = now + t - offset;
    if (t < offset) {
      const next = points[i + 1];
      if (next && next[0] > offset) {
        const k = (offset - t) / (next[0] - t);
        param.setValueAtTime(v + (next[1] - v) * k, now);
        started = true;
      }
      continue;
    }
    if (!started) { param.setValueAtTime(i === 0 ? v : points[i - 1]![1], now); started = true; }
    param.linearRampToValueAtTime(v, Math.max(now, at));
  }
  if (!started) param.setValueAtTime(points[points.length - 1]![1], now);
}

function cueLen(c: SoundFactoryContext) {
  return c.cue.end - c.cue.start;
}

/* ============================================================== */

export function defineSounds(audio: WebAudioCueBus<unknown>) {
  /* ---- suit interior ---- */
  audio.define("suitBreath", (c) => {
    const { audioContext: ac, output, offset } = c;
    const p = (c.cue.payload ?? {}) as { rate?: number; depth?: number };
    const rate = p.rate ?? 0.23;
    const depth = p.depth ?? 1;
    const period = 1 / rate;
    const buf = cached(ac, `breath${period.toFixed(2)}${depth}`, () => {
      const nb = noise(ac, "pink", 4).getChannelData(0);
      return render(ac, period, (t, i) => {
        const ph = t / period;
        let e = 0;
        if (ph < 0.36) e = Math.sin((ph / 0.36) * Math.PI) * 0.75; // inhale
        else if (ph > 0.42 && ph < 0.9) e = Math.pow(Math.sin(((ph - 0.42) / 0.48) * Math.PI), 1.3); // exhale
        return nb[i % nb.length]! * e * depth;
      });
    });
    const s = src(ac, buf, true);
    const bp = filt(ac, "bandpass", 900, 0.6);
    const lp = filt(ac, "lowpass", 2400, 0.5);
    const helmet = filt(ac, "peaking", 1400, 3, 6); // small helmet resonance
    const out = g(ac, 0);
    out.gain.setTargetAtTime(0.55, ac.currentTime, 0.4);
    s.connect(bp).connect(helmet).connect(lp).connect(out).connect(output);
    s.start(ac.currentTime, offset % period);
    return handle([s], out, ac, 0.3);
  });

  audio.define("suitHum", ({ audioContext: ac, output }) => {
    const n = src(ac, noise(ac, "brown", 4));
    const lp = filt(ac, "lowpass", 260);
    const fan = ac.createOscillator();
    fan.frequency.value = 118;
    const fanG = g(ac, 0.025);
    const whine = ac.createOscillator();
    whine.frequency.value = 2310;
    const whineG = g(ac, 0.0035);
    const out = g(ac, 0);
    out.gain.setTargetAtTime(0.35, ac.currentTime, 0.5);
    n.connect(lp).connect(out);
    fan.connect(fanG).connect(out);
    whine.connect(whineG).connect(out);
    out.connect(output);
    n.start(); fan.start(); whine.start();
    return handle([n, fan, whine], out, ac, 0.4);
  });

  audio.define("heartbeat", (c) => {
    const { audioContext: ac, output } = c;
    const bpm = ((c.cue.payload ?? {}) as { bpm?: number }).bpm ?? 62;
    const period = 60 / bpm;
    const buf = cached(ac, `hb${bpm}`, () => render(ac, period, (t) => {
      const beat = (t0: number, a: number) => {
        const x = t - t0;
        if (x < 0 || x > 0.2) return 0;
        return Math.sin(2 * Math.PI * (52 - x * 80) * x) * Math.exp(-x * 26) * a;
      };
      return beat(0, 0.9) + beat(0.28, 0.6);
    }));
    const s = src(ac, buf, true);
    const lp = filt(ac, "lowpass", 160);
    const out = g(ac, 0);
    // heart rate creeps up across the cue
    const len = cueLen(c);
    s.playbackRate.setValueAtTime(1 + 0.25 * Math.min(1, c.offset / len), ac.currentTime);
    s.playbackRate.linearRampToValueAtTime(1.3, ac.currentTime + Math.max(0.1, len - c.offset));
    out.gain.setTargetAtTime(0.9, ac.currentTime, 0.8);
    s.connect(lp).connect(out).connect(output);
    s.start();
    return handle([s], out, ac, 0.5);
  });

  /* ---- radio ---- */
  audio.define("radioClick", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const s = src(ac, noise(ac, "white", 1), false);
    const bp = filt(ac, "bandpass", 2400, 1.2);
    const e = g(ac, 0);
    e.gain.setValueAtTime(0.0, now);
    e.gain.linearRampToValueAtTime(0.5, now + 0.005);
    e.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    const o = ac.createOscillator();
    o.type = "square";
    o.frequency.value = 1350;
    const og = g(ac, 0);
    og.gain.setValueAtTime(0.05, now);
    og.gain.exponentialRampToValueAtTime(0.0005, now + 0.06);
    s.connect(bp).connect(e).connect(output);
    o.connect(og).connect(output);
    s.start(now); o.start(now); s.stop(now + 0.2); o.stop(now + 0.1);
    return handle([s, o], e, ac, 0.02);
  });

  audio.define("radioBed", ({ audioContext: ac, output }) => {
    const s = src(ac, noise(ac, "white", 4));
    const bp = filt(ac, "bandpass", 2000, 0.8);
    const crackle = src(ac, cached(ac, "crackle", () => render(ac, 3, () => (rnd() > 0.9993 ? (rnd() * 2 - 1) * 0.9 : 0))));
    const out = g(ac, 0);
    out.gain.setTargetAtTime(0.08, ac.currentTime, 0.05);
    s.connect(bp).connect(out);
    crackle.connect(filt(ac, "highpass", 1500)).connect(out);
    out.connect(output);
    s.start(); crackle.start();
    return handle([s, crackle], out, ac, 0.1);
  });

  audio.define("radioAlarm", ({ audioContext: ac, output }) => {
    const o = ac.createOscillator();
    o.type = "square";
    const lfo = ac.createOscillator();
    lfo.type = "square";
    lfo.frequency.value = 1.6;
    const lfoG = g(ac, 180);
    o.frequency.value = 820;
    lfo.connect(lfoG).connect(o.frequency);
    const bp = filt(ac, "bandpass", 1500, 1.6);
    const dist = ac.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const x = i / 128 - 1; curve[i] = Math.tanh(x * 3); }
    dist.curve = curve;
    const out = g(ac, 0);
    out.gain.setTargetAtTime(0.05, ac.currentTime, 0.05);
    o.connect(dist).connect(bp).connect(out).connect(output);
    o.start(); lfo.start();
    return handle([o, lfo], out, ac, 0.15);
  });

  /* ---- music (procedural score) ---- */
  const pad = (ac: AC, output: GainNode, notes: number[], bright: number, level: number, fadeIn: number, detune = 7) => {
    const out = g(ac, 0);
    const lp = filt(ac, "lowpass", 300 + bright * 2400, 0.4);
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoG = g(ac, 120 + bright * 300);
    lfo.connect(lfoG).connect(lp.frequency);
    const oscs: OscillatorNode[] = [lfo];
    for (const m of notes) {
      for (const d of [-detune, detune]) {
        const o = ac.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = 440 * Math.pow(2, (m - 69) / 12);
        o.detune.value = d;
        const og = g(ac, 0.05 / notes.length);
        o.connect(og).connect(lp);
        oscs.push(o);
      }
    }
    lp.connect(out).connect(output);
    out.gain.setValueAtTime(0, ac.currentTime);
    out.gain.linearRampToValueAtTime(level, ac.currentTime + fadeIn);
    for (const o of oscs) o.start();
    return handle(oscs, out, ac, 1.2);
  };

  audio.define("padSpace", (c) => {
    const p = (c.cue.payload ?? {}) as { root?: number; bright?: number };
    const r = p.root ?? 38;
    return pad(c.audioContext, c.output, [r, r + 7, r + 15, r + 22], p.bright ?? 0.3, 1.0, c.offset > 0 ? 1 : 5);
  });
  audio.define("padWarm", (c) => {
    const r = ((c.cue.payload ?? {}) as { root?: number }).root ?? 50;
    return pad(c.audioContext, c.output, [r, r + 4, r + 7, r + 11], 0.15, 0.8, c.offset > 0 ? 1 : 6, 4);
  });
  audio.define("padTension", (c) => {
    const r = ((c.cue.payload ?? {}) as { root?: number }).root ?? 37;
    return pad(c.audioContext, c.output, [r, r + 1, r + 13], 0.05, 1.0, c.offset > 0 ? 1 : 8, 12);
  });

  audio.define("tensionDrone", (c) => {
    const { audioContext: ac, output, offset } = c;
    const len = cueLen(c);
    const out = g(ac, 0);
    env(out.gain, ac.currentTime, offset, [[0, 0], [3, 0.6], [len - 0.4, 1], [len, 0]]);
    const low = ac.createOscillator();
    low.type = "sawtooth";
    low.frequency.value = 36.7;
    const lowLp = filt(ac, "lowpass", 140);
    const lowG = g(ac, 0.12);
    // a glassy harmonic that slowly bends upward — the bullets in flight
    const hi = ac.createOscillator();
    hi.type = "sine";
    hi.frequency.setValueAtTime(1174 * (1 + 0.06 * (offset / len)), ac.currentTime);
    hi.frequency.linearRampToValueAtTime(1174 * 1.06, ac.currentTime + Math.max(0.1, len - offset));
    const trem = ac.createOscillator();
    trem.frequency.value = 5.2;
    const tremG = g(ac, 0.012);
    const hiG = g(ac, 0.018);
    trem.connect(tremG).connect(hiG.gain);
    low.connect(lowLp).connect(lowG).connect(out);
    hi.connect(hiG).connect(out);
    out.connect(output);
    low.start(); hi.start(); trem.start();
    return handle([low, hi, trem], out, ac, 0.05);
  });

  audio.define("finale", (c) => {
    const { audioContext: ac, output, offset } = c;
    const len = cueLen(c);
    const h = pad(ac, output, [38, 45, 53, 57, 64], 0.2, 1.0, 0.01, 5);
    // soft bell-like overtones, one per few seconds
    const bells: OscillatorNode[] = [];
    const out = g(ac, 1);
    out.connect(output);
    [0.5, 4.5, 8.5, 12.0].forEach((t, i) => {
      if (t < offset) return;
      const at = ac.currentTime + t - offset;
      for (const [mul, a] of [[1, 0.05], [2.76, 0.02], [5.4, 0.01]] as const) {
        const o = ac.createOscillator();
        o.frequency.value = [587, 523, 440, 392][i]! * mul;
        const og = g(ac, 0);
        og.gain.setValueAtTime(0, at);
        og.gain.linearRampToValueAtTime(a, at + 0.01);
        og.gain.exponentialRampToValueAtTime(0.0001, at + 3.5);
        o.connect(og).connect(out);
        o.start(at);
        o.stop(at + 3.6);
        bells.push(o);
      }
    });
    // fade the whole thing at the end
    const fadeAt = Math.max(0, len - 3 - offset);
    const master = output.gain;
    master.setValueAtTime(master.value, ac.currentTime + fadeAt);
    master.linearRampToValueAtTime(0, ac.currentTime + fadeAt + 3);
    return { stop: () => { h.stop(); for (const b of bells) { try { b.stop(); } catch { /* */ } } } };
  });

  audio.define("titleBoom", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const o = ac.createOscillator();
    o.frequency.setValueAtTime(70, now);
    o.frequency.exponentialRampToValueAtTime(28, now + 2.5);
    const og = g(ac, 0);
    og.gain.setValueAtTime(0, now);
    og.gain.linearRampToValueAtTime(0.75, now + 0.02);
    og.gain.exponentialRampToValueAtTime(0.001, now + 5.5);
    const n = src(ac, noise(ac, "brown", 4), false);
    const ng = g(ac, 0);
    ng.gain.setValueAtTime(0.4, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 3);
    const conv = ac.createConvolver();
    conv.buffer = impulse(ac, 4, 2.5, [], 0.2);
    o.connect(og).connect(output);
    n.connect(filt(ac, "lowpass", 300)).connect(ng);
    ng.connect(conv).connect(output);
    og.connect(conv);
    o.start(now); n.start(now);
    return handle([o, n], og, ac, 0.3);
  });

  audio.define("subHit", ({ audioContext: ac, output, offset }) => {
    const now = ac.currentTime;
    if (offset > 1) return;
    const o = ac.createOscillator();
    o.frequency.setValueAtTime(55, now);
    o.frequency.exponentialRampToValueAtTime(30, now + 2);
    const og = g(ac, 0);
    og.gain.linearRampToValueAtTime(0.7, now + 0.05);
    og.gain.exponentialRampToValueAtTime(0.001, now + 3.6);
    o.connect(og).connect(output);
    o.start(now);
    o.stop(now + 3.8);
    return handle([o], og, ac, 0.2);
  });

  /* ---- Beijing exterior ---- */
  audio.define("cityDusk", ({ audioContext: ac, output }) => {
    const rumble = src(ac, noise(ac, "brown", 4));
    const lp = filt(ac, "lowpass", 220);
    const out = g(ac, 0);
    out.gain.setTargetAtTime(0.4, ac.currentTime, 1);
    rumble.connect(lp).connect(out);
    // sparrows: short chirps rendered from code
    const chirps = src(ac, cached(ac, "chirps", () => render(ac, 7, (t) => {
      let v = 0;
      for (const [t0, f0] of [[0.4, 4200], [0.55, 4600], [2.1, 3900], [2.22, 4300], [2.36, 4100], [4.8, 4700], [5.0, 4500], [6.2, 3800]] as const) {
        const x = t - t0;
        if (x > 0 && x < 0.08) v += Math.sin(2 * Math.PI * (f0 + 9000 * x) * x) * Math.sin((x / 0.08) * Math.PI) * 0.25;
      }
      return v;
    })));
    const cg = g(ac, 0.35);
    chirps.connect(cg).connect(out);
    out.connect(output);
    rumble.start(); chirps.start();
    return handle([rumble, chirps], out, ac, 0.6);
  });

  audio.define("footsteps", (c) => {
    const { audioContext: ac, output, offset } = c;
    const rate = ((c.cue.payload ?? {}) as { rate?: number }).rate ?? 1.8;
    const len = cueLen(c);
    const out = g(ac, 1);
    out.connect(output);
    const nodes: AudioScheduledSourceNode[] = [];
    const nb = noise(ac, "white", 1);
    for (let t = 0; t < len; t += 1 / rate) {
      if (t < offset) continue;
      const at = ac.currentTime + t - offset;
      const s = src(ac, nb, false, 0.8 + rnd() * 0.3);
      const bp = filt(ac, "bandpass", 700 + rnd() * 300, 1.4);
      const e = g(ac, 0);
      e.gain.setValueAtTime(0, at);
      e.gain.linearRampToValueAtTime(0.5, at + 0.006);
      e.gain.exponentialRampToValueAtTime(0.001, at + 0.11);
      const thump = ac.createOscillator();
      thump.frequency.setValueAtTime(110, at);
      thump.frequency.exponentialRampToValueAtTime(60, at + 0.06);
      const tg = g(ac, 0);
      tg.gain.setValueAtTime(0.25, at);
      tg.gain.exponentialRampToValueAtTime(0.001, at + 0.08);
      s.connect(bp).connect(e).connect(out);
      thump.connect(tg).connect(out);
      s.start(at, rnd() * 0.5); s.stop(at + 0.15);
      thump.start(at); thump.stop(at + 0.1);
      nodes.push(s, thump);
    }
    return handle(nodes, out, ac, 0.05);
  });

  audio.define("oldRadio", ({ audioContext: ac, output }) => {
    // AM-band hiss + a faint, muffled news-jingle carrier behind a wall
    const hiss = src(ac, noise(ac, "white", 4));
    const bp = filt(ac, "bandpass", 1700, 1.0);
    const hg = g(ac, 0.03);
    const murmur = src(ac, noise(ac, "pink", 4), true, 0.5);
    const mb = filt(ac, "bandpass", 450, 2.5);
    const syll = ac.createOscillator();
    syll.frequency.value = 4.3;
    const sg = g(ac, 0.05);
    const mg = g(ac, 0.05);
    syll.connect(sg).connect(mg.gain);
    const wall = filt(ac, "lowpass", 1500);
    const out = g(ac, 0);
    out.gain.setTargetAtTime(0.8, ac.currentTime, 0.5);
    hiss.connect(bp).connect(hg).connect(wall);
    murmur.connect(mb).connect(mg).connect(wall);
    wall.connect(out).connect(output);
    hiss.start(); murmur.start(); syll.start();
    return handle([hiss, murmur, syll], out, ac, 0.4);
  });

  audio.define("bikeBell", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const nodes: OscillatorNode[] = [];
    const out = g(ac, 1);
    out.connect(filt(ac, "lowpass", 5000)).connect(output);
    for (const t0 of [0, 0.18]) {
      for (const [f, a] of [[2650, 0.12], [4120, 0.05], [6300, 0.025]] as const) {
        const o = ac.createOscillator();
        o.frequency.value = f;
        const og = g(ac, 0);
        og.gain.setValueAtTime(a, now + t0);
        og.gain.exponentialRampToValueAtTime(0.0001, now + t0 + 0.9);
        o.connect(og).connect(out);
        o.start(now + t0);
        o.stop(now + t0 + 1);
        nodes.push(o);
      }
    }
    return handle(nodes, out, ac, 0.05);
  });

  audio.define("doorCreak", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const o = ac.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(180, now);
    o.frequency.linearRampToValueAtTime(240, now + 0.6);
    o.frequency.linearRampToValueAtTime(150, now + 1.3);
    const jitter = ac.createOscillator();
    jitter.frequency.value = 31;
    const jg = g(ac, 25);
    jitter.connect(jg).connect(o.frequency);
    const bp = filt(ac, "bandpass", 900, 4);
    const e = g(ac, 0);
    e.gain.linearRampToValueAtTime(0.18, now + 0.2);
    e.gain.linearRampToValueAtTime(0.12, now + 1.0);
    e.gain.linearRampToValueAtTime(0, now + 1.5);
    o.connect(bp).connect(e).connect(output);
    o.start(now); jitter.start(now);
    o.stop(now + 1.6); jitter.stop(now + 1.6);
    return handle([o, jitter], e, ac, 0.05);
  });

  /* ---- collector's room ---- */
  audio.define("roomTone", ({ audioContext: ac, output }) => {
    const n = src(ac, noise(ac, "pink", 4));
    const lp = filt(ac, "lowpass", 500);
    const out = g(ac, 0);
    out.gain.setTargetAtTime(0.06, ac.currentTime, 0.6);
    n.connect(lp).connect(out).connect(output);
    n.start();
    return handle([n], out, ac, 0.5);
  });

  audio.define("clockTick", ({ audioContext: ac, output, offset }) => {
    const buf = cached(ac, "tick", () => render(ac, 2, (t) => {
      let v = 0;
      for (const [t0, f] of [[0, 3100], [1, 2600]] as const) {
        const x = t - t0;
        if (x >= 0 && x < 0.04) v += Math.sin(2 * Math.PI * f * x) * Math.exp(-x * 160) * 0.5 + (rnd() * 2 - 1) * Math.exp(-x * 400) * 0.3;
        const y = t - t0 - 0.012;
        if (y >= 0 && y < 0.05) v += Math.sin(2 * Math.PI * 900 * y) * Math.exp(-y * 90) * 0.2;
      }
      return v;
    }));
    const s = src(ac, buf, true);
    const conv = ac.createConvolver();
    conv.buffer = impulse(ac, 0.8, 3, [[0.011, 0.3], [0.019, 0.2]], 0.5);
    const wet = g(ac, 0.25);
    const out = g(ac, 1);
    s.connect(out);
    s.connect(conv).connect(wet).connect(out);
    out.connect(output);
    s.start(ac.currentTime, offset % 2);
    return handle([s], out, ac, 0.1);
  });

  const percussive = (name: string, make: (ac: AC, out: GainNode, now: number) => AudioScheduledSourceNode[], dur: number) => {
    audio.define(name, ({ audioContext: ac, output, offset }) => {
      if (offset > dur * 0.6) return;
      const out = g(ac, 1);
      out.connect(output);
      const nodes = make(ac, out, ac.currentTime);
      return handle(nodes, out, ac, 0.03);
    });
  };

  const burst = (ac: AC, out: AudioNode, at: number, freq: number, q: number, peak: number, decay: number, type: BiquadFilterType = "bandpass") => {
    const s = src(ac, noise(ac, "white", 1), false, 0.9 + rnd() * 0.2);
    const f = filt(ac, type, freq, q);
    const e = g(ac, 0);
    e.gain.setValueAtTime(0, at);
    e.gain.linearRampToValueAtTime(peak, at + 0.002);
    e.gain.exponentialRampToValueAtTime(0.0005, at + decay);
    s.connect(f).connect(e).connect(out);
    s.start(at, rnd() * 0.5);
    s.stop(at + decay + 0.05);
    return s;
  };
  const tone = (ac: AC, out: AudioNode, at: number, f0: number, f1: number, peak: number, decay: number, type: OscillatorType = "sine") => {
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, at);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), at + decay);
    const e = g(ac, 0);
    e.gain.setValueAtTime(0, at);
    e.gain.linearRampToValueAtTime(peak, at + 0.003);
    e.gain.exponentialRampToValueAtTime(0.0005, at + decay);
    o.connect(e).connect(out);
    o.start(at);
    o.stop(at + decay + 0.05);
    return o;
  };

  percussive("stoneSet", (ac, out, now) => [
    tone(ac, out, now, 210, 120, 0.4, 0.12),
    burst(ac, out, now, 2500, 1.5, 0.25, 0.05),
  ], 0.4);

  percussive("cupSet", (ac, out, now) => [
    tone(ac, out, now, 2350, 2340, 0.08, 0.5),
    tone(ac, out, now, 3720, 3700, 0.04, 0.35),
    tone(ac, out, now, 5150, 5100, 0.02, 0.2),
    burst(ac, out, now, 3000, 2, 0.12, 0.03),
  ], 0.5);

  audio.define("teaPour", ({ audioContext: ac, output, offset }) => {
    const len = 3.2;
    const s = src(ac, noise(ac, "white", 4));
    const bp = filt(ac, "bandpass", 1600, 3);
    const lfo = ac.createOscillator();
    lfo.frequency.value = 9;
    const lg = g(ac, 500);
    lfo.connect(lg).connect(bp.frequency);
    const out = g(ac, 0);
    env(out.gain, ac.currentTime, offset, [[0, 0], [0.3, 0.25], [2.4, 0.2], [len, 0]]);
    // pitch of the pour rises as the cup fills
    bp.frequency.setValueAtTime(1100 + offset * 250, ac.currentTime);
    bp.frequency.linearRampToValueAtTime(1900, ac.currentTime + Math.max(0.1, len - offset));
    s.connect(bp).connect(out).connect(output);
    s.start(); lfo.start();
    return handle([s, lfo], out, ac, 0.1);
  });

  percussive("safeOpen", (ac, out, now) => [
    burst(ac, out, now, 900, 2, 0.4, 0.08),
    tone(ac, out, now, 140, 90, 0.4, 0.2),
    burst(ac, out, now + 0.25, 3500, 3, 0.15, 0.06),
    tone(ac, out, now + 0.4, 420, 380, 0.05, 0.9, "triangle"),
  ], 1.2);

  audio.define("glassSlide", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const s = src(ac, noise(ac, "white", 2));
    const bp = filt(ac, "bandpass", 2800, 6);
    bp.frequency.linearRampToValueAtTime(3600, now + 0.7);
    const e = g(ac, 0);
    e.gain.linearRampToValueAtTime(0.15, now + 0.05);
    e.gain.linearRampToValueAtTime(0.12, now + 0.6);
    e.gain.linearRampToValueAtTime(0, now + 0.8);
    s.connect(bp).connect(e).connect(output);
    const rattle = tone(ac, output, now + 0.75, 3100, 3000, 0.05, 0.3);
    s.start(now);
    return handle([s, rattle], e, ac, 0.05);
  });

  percussive("phoneTap", (ac, out, now) => [0, 0.18, 0.33, 0.5, 0.66].map((t) => burst(ac, out, now + t, 4000, 3, 0.06, 0.02)), 1);
  percussive("phonePay", (ac, out, now) => [
    tone(ac, out, now, 1318, 1318, 0.12, 0.35),
    tone(ac, out, now + 0.14, 1976, 1976, 0.12, 0.6),
  ], 0.8);

  audio.define("doorClose", ({ audioContext: ac, output, offset }) => {
    if (offset > 0.5) return;
    const now = ac.currentTime;
    const out = g(ac, 1);
    const conv = ac.createConvolver();
    conv.buffer = impulse(ac, 1.2, 3, [[0.02, 0.3]], 0.3);
    const wet = g(ac, 0.3);
    out.connect(output);
    out.connect(conv).connect(wet).connect(output);
    const nodes = [
      tone(ac, out, now + 0.6, 85, 50, 0.7, 0.35),
      burst(ac, out, now + 0.6, 400, 1, 0.5, 0.15, "lowpass"),
      burst(ac, out, now + 0.75, 2400, 4, 0.12, 0.05),
    ];
    return handle(nodes, out, ac, 0.3);
  });

  /* ---- workshop ---- */
  audio.define("workshopTone", ({ audioContext: ac, output }) => {
    const hum = ac.createOscillator();
    hum.frequency.value = 100;
    const hg = g(ac, 0.01);
    const n = src(ac, noise(ac, "pink", 4));
    const lp = filt(ac, "lowpass", 350);
    const ng = g(ac, 0.05);
    const out = g(ac, 0);
    out.gain.setTargetAtTime(1, ac.currentTime, 0.5);
    hum.connect(hg).connect(out);
    n.connect(lp).connect(ng).connect(out);
    out.connect(output);
    hum.start(); n.start();
    return handle([hum, n], out, ac, 0.4);
  });

  percussive("lampSwitch", (ac, out, now) => [
    burst(ac, out, now, 3000, 2, 0.35, 0.03),
    tone(ac, out, now, 900, 400, 0.08, 0.04, "square"),
  ], 0.3);

  audio.define("latheSpin", (c) => {
    const { audioContext: ac, output, offset } = c;
    const len = cueLen(c);
    const motor = ac.createOscillator();
    motor.type = "sawtooth";
    const whine = ac.createOscillator();
    whine.type = "triangle";
    const now = ac.currentTime;
    const spin = (x: number) => Math.min(1, x / 1.5);
    motor.frequency.setValueAtTime(30 + 70 * spin(offset), now);
    motor.frequency.linearRampToValueAtTime(100, now + Math.max(0.05, 1.5 - offset));
    whine.frequency.setValueAtTime(300 + 1500 * spin(offset), now);
    whine.frequency.linearRampToValueAtTime(1800, now + Math.max(0.05, 1.5 - offset));
    const mlp = filt(ac, "lowpass", 600);
    const mg = g(ac, 0.08);
    const wg = g(ac, 0.012);
    const gearNoise = src(ac, noise(ac, "pink", 4));
    const gb = filt(ac, "bandpass", 1200, 1.5);
    const gg = g(ac, 0.05);
    const out = g(ac, 0);
    env(out.gain, now, offset, [[0, 0], [0.4, 1], [len - 1.2, 1], [len, 0]]);
    // spin-down
    const down = Math.max(0, len - 1.2 - offset);
    motor.frequency.setValueAtTime(100, now + down);
    motor.frequency.linearRampToValueAtTime(30, now + down + 1.2);
    whine.frequency.setValueAtTime(1800, now + down);
    whine.frequency.linearRampToValueAtTime(200, now + down + 1.2);
    motor.connect(mlp).connect(mg).connect(out);
    whine.connect(wg).connect(out);
    gearNoise.connect(gb).connect(gg).connect(out);
    out.connect(output);
    motor.start(); whine.start(); gearNoise.start();
    return handle([motor, whine, gearNoise], out, ac, 0.2);
  });

  audio.define("latheCut", (c) => {
    const { audioContext: ac, output, offset } = c;
    const len = cueLen(c);
    const s = src(ac, noise(ac, "white", 4));
    const bp = filt(ac, "bandpass", 4200, 4);
    const am = ac.createOscillator();
    am.frequency.value = 23;
    const amg = g(ac, 0.08);
    const cg = g(ac, 0.14);
    am.connect(amg).connect(cg.gain);
    const scream = ac.createOscillator();
    scream.type = "sawtooth";
    scream.frequency.value = 2900;
    const sg = g(ac, 0.008);
    const out = g(ac, 0);
    env(out.gain, ac.currentTime, offset, [[0, 0], [0.15, 1], [len - 0.3, 1], [len, 0]]);
    s.connect(bp).connect(cg).connect(out);
    scream.connect(filt(ac, "bandpass", 2900, 8)).connect(sg).connect(out);
    out.connect(output);
    s.start(); am.start(); scream.start();
    return handle([s, am, scream], out, ac, 0.1);
  });

  percussive("toolClink", (ac, out, now) => [
    tone(ac, out, now, 3400, 3380, 0.12, 0.4),
    tone(ac, out, now, 5200, 5100, 0.06, 0.25),
    burst(ac, out, now, 5000, 2, 0.15, 0.02),
    tone(ac, out, now + 0.22, 2900, 2880, 0.06, 0.3),
  ], 0.6);

  audio.define("chipsSweep", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const nodes: AudioScheduledSourceNode[] = [];
    const out = g(ac, 1);
    out.connect(output);
    for (let i = 0; i < 26; i++) nodes.push(burst(ac, out, now + rnd() * 1.6, 5000 + rnd() * 3000, 6, 0.05 + rnd() * 0.05, 0.03));
    const brush = src(ac, noise(ac, "white", 2));
    const bf = filt(ac, "highpass", 3000);
    const be = g(ac, 0);
    be.gain.linearRampToValueAtTime(0.05, now + 0.2);
    be.gain.linearRampToValueAtTime(0, now + 1.7);
    brush.connect(bf).connect(be).connect(out);
    brush.start(now);
    nodes.push(brush);
    return handle(nodes, out, ac, 0.1);
  });

  /* ---- basement ---- */
  audio.define("basementTone", ({ audioContext: ac, output }) => {
    const hum = ac.createOscillator();
    hum.frequency.value = 50;
    const h2 = ac.createOscillator();
    h2.frequency.value = 150;
    const hg = g(ac, 0.02);
    const h2g = g(ac, 0.006);
    const air = src(ac, noise(ac, "brown", 4));
    const ag = g(ac, 0.05);
    const drip = src(ac, cached(ac, "drip", () => render(ac, 5.3, (t) => {
      const x = t - 2.1;
      if (x < 0 || x > 0.12) return 0;
      return Math.sin(2 * Math.PI * (1400 + 2500 * x) * x) * Math.exp(-x * 40) * 0.2;
    })));
    const conv = ac.createConvolver();
    conv.buffer = impulse(ac, 1.1, 2.5, [[0.008, 0.4], [0.014, 0.3]], 0.6);
    const out = g(ac, 0);
    out.gain.setTargetAtTime(1, ac.currentTime, 0.5);
    hum.connect(hg).connect(out);
    h2.connect(h2g).connect(out);
    air.connect(filt(ac, "lowpass", 300)).connect(ag).connect(out);
    drip.connect(conv).connect(out);
    drip.connect(out);
    out.connect(output);
    hum.start(); h2.start(); air.start(); drip.start();
    return handle([hum, h2, air, drip], out, ac, 0.3);
  });

  percussive("pliersPull", (ac, out, now) => [
    burst(ac, out, now, 3800, 3, 0.15, 0.04),
    tone(ac, out, now + 0.12, 2600, 2400, 0.05, 0.12, "triangle"),
    burst(ac, out, now + 0.14, 1800, 2, 0.1, 0.05),
  ], 0.4);
  percussive("slugSet", (ac, out, now) => [
    burst(ac, out, now, 2600, 4, 0.12, 0.05),
    tone(ac, out, now, 1900, 1800, 0.03, 0.1),
  ], 0.3);
  percussive("magLoad", (ac, out, now) => [
    burst(ac, out, now, 3200, 2.5, 0.35, 0.04),
    tone(ac, out, now + 0.01, 2100, 1800, 0.08, 0.08, "triangle"),
  ], 0.25);
  percussive("magInsert", (ac, out, now) => [
    burst(ac, out, now, 1600, 1.4, 0.5, 0.07),
    tone(ac, out, now, 340, 180, 0.3, 0.1),
    burst(ac, out, now + 0.06, 4200, 3, 0.2, 0.03),
  ], 0.4);
  percussive("slideRack", (ac, out, now) => [
    burst(ac, out, now, 2400, 2, 0.4, 0.06),
    burst(ac, out, now + 0.16, 2000, 1.6, 0.6, 0.08),
    tone(ac, out, now + 0.16, 900, 500, 0.15, 0.06, "square"),
  ], 0.5);

  /**
   * Indoor gunshot in a tiny brick room: a hard broadband crack, a chest-hit
   * low thump, and a dense, bright early-reflection cluster that piles up into
   * a short ringing tail. The room is the instrument.
   */
  audio.define("gunshotRoom", ({ audioContext: ac, output, offset }) => {
    if (offset > 0.3) return;
    const now = ac.currentTime;
    const out = g(ac, 1);
    const dry = g(ac, 0.55);
    const conv = ac.createConvolver();
    conv.buffer = impulse(ac, 1.6, 2.2, [
      [0.0042, 0.9], [0.0061, 0.8], [0.0089, 0.7], [0.0113, 0.65], [0.0137, 0.6], [0.017, 0.5],
      [0.021, 0.45], [0.026, 0.4], [0.031, 0.35], [0.038, 0.3], [0.045, 0.25],
    ], 0.9);
    const wet = g(ac, 0.75);
    const sat = ac.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; curve[i] = Math.tanh(x * 2.2); }
    sat.curve = curve;
    dry.connect(sat);
    sat.connect(out);
    sat.connect(conv).connect(wet).connect(out);
    out.connect(output);
    const crack = src(ac, noise(ac, "white", 1), false);
    const ce = g(ac, 0);
    ce.gain.setValueAtTime(0, now);
    ce.gain.linearRampToValueAtTime(1.0, now + 0.0008);
    ce.gain.exponentialRampToValueAtTime(0.02, now + 0.03);
    ce.gain.exponentialRampToValueAtTime(0.0005, now + 0.18);
    crack.connect(filt(ac, "highpass", 400)).connect(ce).connect(dry);
    const boom = ac.createOscillator();
    boom.frequency.setValueAtTime(120, now);
    boom.frequency.exponentialRampToValueAtTime(38, now + 0.18);
    const be = g(ac, 0);
    be.gain.setValueAtTime(0, now);
    be.gain.linearRampToValueAtTime(0.9, now + 0.002);
    be.gain.exponentialRampToValueAtTime(0.0005, now + 0.35);
    boom.connect(be).connect(dry);
    const body = src(ac, noise(ac, "brown", 1), false);
    const bde = g(ac, 0);
    bde.gain.setValueAtTime(0.8, now);
    bde.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    body.connect(filt(ac, "lowpass", 700)).connect(bde).connect(dry);
    // slide cycling a beat after
    const mech = src(ac, noise(ac, "white", 1), false);
    const me = g(ac, 0);
    me.gain.setValueAtTime(0, now + 0.045);
    me.gain.linearRampToValueAtTime(0.12, now + 0.047);
    me.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    mech.connect(filt(ac, "bandpass", 3000, 2)).connect(me).connect(out);
    crack.start(now); boom.start(now); body.start(now); mech.start(now);
    boom.stop(now + 0.4);
    return handle([crack, boom, body, mech], out, ac, 0.6);
  });

  audio.define("tinnitus", (c) => {
    const { audioContext: ac, output, offset } = c;
    const len = cueLen(c);
    const o = ac.createOscillator();
    o.frequency.value = 6100;
    const o2 = ac.createOscillator();
    o2.frequency.value = 6130;
    const out = g(ac, 0);
    env(out.gain, ac.currentTime, offset, [[0, 0], [1.9, 0], [2.4, 0.05], [len - 3, 0.025], [len, 0]]);
    o.connect(out); o2.connect(out);
    out.connect(output);
    o.start(); o2.start();
    return handle([o, o2], out, ac, 0.3);
  });

  audio.define("clothCut", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const out = g(ac, 1);
    out.connect(output);
    const nodes: AudioScheduledSourceNode[] = [];
    for (let i = 0; i < 9; i++) nodes.push(burst(ac, out, now + i * 0.2 + rnd() * 0.05, 1800 + rnd() * 1500, 1.2, 0.18, 0.12));
    return handle(nodes, out, ac, 0.05);
  });
  percussive("shardPour", (ac, out, now) => Array.from({ length: 14 }, () => burst(ac, out, now + rnd() * 0.7, 5000 + rnd() * 3000, 8, 0.12, 0.02)), 0.8);
  percussive("caseClose", (ac, out, now) => [
    tone(ac, out, now, 160, 90, 0.35, 0.12),
    burst(ac, out, now + 0.18, 3000, 3, 0.25, 0.03),
    burst(ac, out, now + 0.3, 3200, 3, 0.25, 0.03),
  ], 0.5);

  /* ---- Base One ---- */
  audio.define("cabinHum", ({ audioContext: ac, output }) => {
    const n = src(ac, noise(ac, "pink", 4));
    const out = g(ac, 0);
    out.gain.setTargetAtTime(0.12, ac.currentTime, 0.3);
    const vent = ac.createOscillator();
    vent.frequency.value = 74;
    const vg = g(ac, 0.15);
    n.connect(filt(ac, "lowpass", 900)).connect(out);
    vent.connect(vg).connect(out);
    out.connect(output);
    n.start(); vent.start();
    return handle([n, vent], out, ac, 0.3);
  });
  audio.define("velcro", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const out = g(ac, 1);
    out.connect(output);
    const nodes = Array.from({ length: 30 }, (_, i) => burst(ac, out, now + i * 0.018, 3500, 1, 0.12, 0.012));
    return handle(nodes, out, ac, 0.05);
  });
  audio.define("locatorBeep", (c) => {
    const { audioContext: ac, output, offset } = c;
    const out = g(ac, 1);
    out.connect(output);
    const nodes: AudioScheduledSourceNode[] = [];
    for (let t = 0; t < cueLen(c); t += 1.0) {
      if (t < offset) continue;
      nodes.push(tone(ac, out, ac.currentTime + t - offset, 2640, 2640, 0.05, 0.08));
    }
    return handle(nodes, out, ac, 0.05);
  });
  audio.define("hatchCycle", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const out = g(ac, 1);
    out.connect(output);
    const hiss = src(ac, noise(ac, "white", 2));
    const he = g(ac, 0);
    he.gain.linearRampToValueAtTime(0.15, now + 0.3);
    he.gain.linearRampToValueAtTime(0, now + 1.6);
    hiss.connect(filt(ac, "highpass", 2000)).connect(he).connect(out);
    hiss.start(now);
    return handle([hiss, tone(ac, out, now + 1.7, 120, 70, 0.4, 0.3), burst(ac, out, now + 1.7, 800, 1, 0.3, 0.1)], out, ac, 0.1);
  });

  /* ---- space: everything is heard through the suit ---- */
  audio.define("thrusterSuit", (c) => {
    const { audioContext: ac, output, offset } = c;
    const len = cueLen(c);
    const n = src(ac, noise(ac, "brown", 4));
    const lp = filt(ac, "lowpass", 380, 1.2); // conducted through the backpack frame
    const out = g(ac, 0);
    env(out.gain, ac.currentTime, offset, [[0, 0], [0.15, 0.6], [len - 0.4, 0.5], [len, 0]]);
    n.connect(lp).connect(out).connect(output);
    n.start();
    return handle([n], out, ac, 0.2);
  });
  percussive("scopeRaise", (ac, out, now) => [
    burst(ac, out, now, 600, 1, 0.15, 0.15, "lowpass"),
    tone(ac, out, now + 0.3, 220, 160, 0.1, 0.1),
  ], 1);
  percussive("visorClick", (ac, out, now) => [tone(ac, out, now, 1200, 1100, 0.04, 0.05)], 0.3);
  percussive("gloveRing", (ac, out, now) => {
    const nodes: AudioScheduledSourceNode[] = Array.from({ length: 6 }, (_, i) => burst(ac, out, now + i * 0.17, 700, 3, 0.35, 0.05));
    nodes.push(tone(ac, out, now + 1.1, 260, 180, 0.3, 0.15));
    return nodes;
  }, 2);
  percussive("gearPull", (ac, out, now) => [
    burst(ac, out, now, 500, 1, 0.3, 0.3, "lowpass"),
    tone(ac, out, now + 0.5, 180, 140, 0.2, 0.12),
  ], 1);
  percussive("magnetClack", (ac, out, now) => [
    tone(ac, out, now, 240, 90, 0.7, 0.14),
    burst(ac, out, now, 900, 1, 0.4, 0.06, "lowpass"),
  ], 0.4);
  percussive("magChange", (ac, out, now) => [
    burst(ac, out, now, 700, 1.2, 0.35, 0.07, "lowpass"),
    tone(ac, out, now, 200, 110, 0.25, 0.1),
    burst(ac, out, now + 0.55, 700, 1.2, 0.45, 0.07, "lowpass"),
    tone(ac, out, now + 0.55, 230, 120, 0.4, 0.12),
  ], 1);

  /**
   * Thirty rounds fired in vacuum. No air: no crack, no report, no echo.
   * What reaches the ear is the recoil travelling glove → arm → suit, a dull
   * low thud inside the helmet, plus the faint click of the action.
   */
  audio.define("shotsConducted", (c) => {
    const { audioContext: ac, output, offset } = c;
    const times = ((c.cue.payload ?? {}) as { times?: number[] }).times ?? [];
    const out = g(ac, 1);
    const body = filt(ac, "lowpass", 260, 0.9);
    body.connect(out);
    out.connect(output);
    const nodes: AudioScheduledSourceNode[] = [];
    for (const abs of times) {
      const t = abs - c.cue.start;
      if (t < offset) continue;
      const at = ac.currentTime + t - offset;
      nodes.push(tone(ac, body, at, 95, 42, 0.75, 0.12));
      nodes.push(burst(ac, body, at, 300, 0.8, 0.35, 0.05, "lowpass"));
      nodes.push(burst(ac, out, at + 0.03, 1400, 4, 0.025, 0.02));
    }
    return handle(nodes, out, ac, 0.05);
  });
}

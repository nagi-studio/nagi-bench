import type { WebAudioCueBus, SoundFactoryContext, SoundHandle } from "@agentbench/cinematic-player";

/**
 * All sound in the film is built here from oscillators, generated noise buffers,
 * filters, delays and one generated impulse response. Nothing is loaded.
 */

/* ---------- generated buffers, one set per AudioContext ---------- */

interface Bank {
  white: AudioBuffer;
  pink: AudioBuffer;
  brown: AudioBuffer;
  room: AudioBuffer;
}
const banks = new WeakMap<BaseAudioContext, Bank>();

function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function bank(ac: BaseAudioContext): Bank {
  let b = banks.get(ac);
  if (b) return b;
  const sr = ac.sampleRate;
  const make = (seconds: number, fill: (data: Float32Array, rnd: () => number) => void, seed: number): AudioBuffer => {
    const buf = ac.createBuffer(1, Math.floor(sr * seconds), sr);
    fill(buf.getChannelData(0), prng(seed));
    return buf;
  };
  const white = make(2, (d, r) => { for (let i = 0; i < d.length; i++) d[i] = r() * 2 - 1; }, 11);
  const pink = make(4, (d, r) => {
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < d.length; i++) {
      const w = r() * 2 - 1;
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.963 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.22;
    }
  }, 23);
  const brown = make(4, (d, r) => {
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      last = (last + (r() * 2 - 1) * 0.02) / 1.02;
      d[i] = last * 3.2;
    }
  }, 37);
  // Impulse response of a small bare concrete room: hard early reflections off
  // six close walls, then a dense, bright tail that takes about two seconds to die.
  const room = ac.createBuffer(2, Math.floor(sr * 2.3), sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = room.getChannelData(ch);
    const r = prng(101 + ch * 7);
    let lp = 0;
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      const tail = Math.exp(-t * 3.1) * (t > 0.012 ? 1 : t / 0.012);
      // The tail darkens as it decays.
      const k = 0.18 + 0.8 * Math.exp(-t * 2.2);
      lp += ((r() * 2 - 1) - lp) * k;
      d[i] = lp * tail * 0.55;
    }
    for (const [ms, g] of [[6.5, 0.9], [9.8, -0.75], [14.6, 0.7], [19.9, -0.6], [27.3, 0.55], [33.1, 0.5], [41.7, -0.42], [52.6, 0.36], [68.4, 0.3]] as Array<[number, number]>) {
      const at = Math.floor(((ms + ch * 1.7) / 1000) * sr);
      for (let j = 0; j < 24 && at + j < d.length; j++) d[at + j]! += g * (1 - j / 24) * (j % 2 ? -1 : 1);
    }
  }
  b = { white, pink, brown, room };
  banks.set(ac, b);
  return b;
}

/* ---------- a small patching kit ---------- */

type Points = Array<[number, number]>;

class Kit {
  readonly ac: AudioContext;
  readonly out: AudioNode;
  readonly now: number;
  readonly dur: number;
  private readonly sources: AudioScheduledSourceNode[] = [];
  private readonly nodes: AudioNode[] = [];

  constructor(c: SoundFactoryContext) {
    this.ac = c.audioContext;
    this.out = c.output;
    this.now = c.audioContext.currentTime + 0.005;
    this.dur = Math.max(0.05, c.cue.end - c.cue.start - c.offset);
  }

  osc(type: OscillatorType, freq: number, start = 0, stop?: number): OscillatorNode {
    const o = this.ac.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, this.now);
    o.start(this.now + start);
    if (stop !== undefined) o.stop(this.now + stop);
    this.sources.push(o);
    return o;
  }

  noise(kind: "white" | "pink" | "brown", start = 0, stop?: number, rate = 1): AudioBufferSourceNode {
    const s = this.ac.createBufferSource();
    const buf = bank(this.ac)[kind];
    s.buffer = buf;
    s.loop = true;
    s.playbackRate.setValueAtTime(rate, this.now);
    s.start(this.now + start, (start * 0.37 + this.now * 0.13) % (buf.duration - 0.1));
    if (stop !== undefined) s.stop(this.now + stop);
    this.sources.push(s);
    return s;
  }

  gain(value = 0): GainNode {
    const g = this.ac.createGain();
    g.gain.setValueAtTime(value, this.now);
    this.nodes.push(g);
    return g;
  }

  filter(type: BiquadFilterType, freq: number, q = 0.7): BiquadFilterNode {
    const f = this.ac.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(Math.max(10, freq), this.now);
    f.Q.setValueAtTime(q, this.now);
    this.nodes.push(f);
    return f;
  }

  delay(seconds: number): DelayNode {
    const d = this.ac.createDelay(1);
    d.delayTime.setValueAtTime(seconds, this.now);
    this.nodes.push(d);
    return d;
  }

  /** Connect nodes in series; the last one is returned. */
  chain<Last extends AudioNode | AudioParam>(...nodes: [...AudioNode[], Last]): Last {
    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i] as AudioNode, to = nodes[i + 1]!;
      // The last link may drive a parameter (LFO → gain, vibrato → frequency).
      if (to instanceof AudioParam) from.connect(to);
      else from.connect(to as AudioNode);
    }
    return nodes[nodes.length - 1] as Last;
  }

  /** Piecewise-linear automation; times are seconds from the cue's start. */
  line(param: AudioParam, points: Points): void {
    let first = true;
    let lastT = -1;
    for (const [t, v] of points) {
      const time = this.now + Math.max(0, t, lastT + 0.0005);
      lastT = Math.max(0, t, lastT + 0.0005);
      if (first) {
        param.setValueAtTime(v, time);
        first = false;
      } else param.linearRampToValueAtTime(v, time);
    }
  }

  /** Exponential glide between two positive values. */
  glide(param: AudioParam, t0: number, v0: number, t1: number, v1: number): void {
    param.setValueAtTime(Math.max(1e-4, v0), this.now + Math.max(0, t0));
    param.exponentialRampToValueAtTime(Math.max(1e-4, v1), this.now + Math.max(t0 + 0.001, t1));
  }

  /** A pitched blip with its own envelope, straight to a destination. */
  ping(dest: AudioNode, type: OscillatorType, f0: number, f1: number, at: number, len: number, level: number, attack = 0.003): void {
    const o = this.osc(type, f0, at, at + len + 0.03);
    if (f1 !== f0) this.glide(o.frequency, at, f0, at + len, f1);
    const g = this.gain(0);
    this.line(g.gain, [[at, 0], [at + attack, level], [at + len, 0]]);
    this.chain(o, g, dest);
  }

  /** A filtered noise burst with its own envelope. */
  burst(dest: AudioNode, kind: "white" | "pink" | "brown", type: BiquadFilterType, freq: number, q: number, at: number, len: number, level: number, attack = 0.002): BiquadFilterNode {
    const s = this.noise(kind, at, at + len + 0.03);
    const f = this.filter(type, freq, q);
    const g = this.gain(0);
    this.line(g.gain, [[at, 0], [at + attack, level], [at + len, 0]]);
    this.chain(s, f, g, dest);
    return f;
  }

  handle(): SoundHandle {
    return {
      stop: () => {
        for (const s of this.sources) {
          try { s.stop(); } catch { /* already stopped */ }
          try { s.disconnect(); } catch { /* not connected */ }
        }
        for (const node of this.nodes) {
          try { node.disconnect(); } catch { /* not connected */ }
        }
      },
    };
  }
}

const hash = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

type Payload = Record<string, number | number[] | string | undefined>;
const payloadOf = (c: SoundFactoryContext): Payload => (c.cue.payload ?? {}) as Payload;

/** Sustained beds fade in and out so a cut never clicks. */
function bed(k: Kit, level: number, fadeIn = 0.25, fadeOut = 0.25): GainNode {
  const g = k.gain(0);
  k.line(g.gain, [[0, 0], [fadeIn, level], [Math.max(fadeIn + 0.01, k.dur - fadeOut), level], [k.dur, 0]]);
  g.connect(k.out);
  return g;
}

export function registerSounds(audio: WebAudioCueBus<any>): void {
  const def = (name: string, build: (k: Kit, c: SoundFactoryContext) => void): void => {
    audio.define(name, (c) => {
      const k = new Kit(c);
      build(k, c);
      return k.handle();
    });
  };

  /* ───── suit interior ───── */

  def("fan", (k) => {
    const out = bed(k, 1, 0.4, 0.15);
    const hum = k.gain(0.016);
    k.chain(k.osc("sine", 118), hum, out);
    const hum2 = k.gain(0.006);
    k.chain(k.osc("triangle", 236.6), hum2, out);
    const air = k.gain(0.012);
    k.chain(k.noise("pink"), k.filter("bandpass", 2300, 0.8), air, out);
  });

  def("breath", (k, c) => {
    // Close, inside the helmet: a bright inhale, a longer darker exhale, a rest.
    const period = Number(payloadOf(c).period ?? 4.6);
    const out = bed(k, 1, 0.3, 0.3);
    const src = k.noise("pink");
    const tone = k.filter("bandpass", 700, 0.9);
    const g = k.gain(0);
    k.chain(src, tone, g, out);
    const cycles = Math.ceil(k.dur / period) + 1;
    for (let i = 0; i < cycles; i++) {
      const t = i * period, j = 1 + (hash(i * 3.1) - 0.5) * 0.12;
      k.line(tone.frequency, [[t, 1150 * j], [t + period * 0.33, 1500 * j], [t + period * 0.42, 620], [t + period * 0.85, 420]]);
      k.line(g.gain, [
        [t, 0], [t + period * 0.12, 0.2], [t + period * 0.3, 0.13], [t + period * 0.37, 0],
        [t + period * 0.44, 0], [t + period * 0.52, 0.17], [t + period * 0.8, 0.05], [t + period * 0.92, 0],
      ]);
    }
  });

  def("vacshot", (k) => {
    // No air: only the blow, travelling up the arm and through the suit.
    const lp = k.filter("lowpass", 190, 0.8);
    lp.connect(k.out);
    k.ping(lp, "sine", 76, 36, 0, 0.11, 0.46, 0.004);
    k.burst(lp, "brown", "lowpass", 260, 0.7, 0, 0.05, 0.3);
  });

  def("vacclick", (k) => {
    const lp = k.filter("lowpass", 420, 0.7);
    lp.connect(k.out);
    k.burst(lp, "white", "bandpass", 900, 1.5, 0, 0.03, 0.5);
    k.ping(lp, "sine", 140, 90, 0, 0.05, 0.22);
  });

  def("magthunk", (k) => {
    const lp = k.filter("lowpass", 380, 0.7);
    lp.connect(k.out);
    k.ping(lp, "sine", 98, 52, 0, 0.1, 0.5);
    k.burst(lp, "white", "bandpass", 1200, 2, 0, 0.02, 0.4);
  });

  def("softthud", (k) => {
    const lp = k.filter("lowpass", 300, 0.7);
    lp.connect(k.out);
    k.ping(lp, "sine", 70, 44, 0, 0.14, 0.4, 0.01);
  });

  def("ratchet", (k) => {
    const lp = k.filter("lowpass", 620, 0.7);
    lp.connect(k.out);
    const count = Math.max(2, Math.floor(k.dur / 0.28));
    for (let i = 0; i < count; i++) {
      const t = i * 0.28 + hash(i) * 0.04;
      k.burst(lp, "white", "bandpass", 1500, 2, t, 0.025, 0.42);
      k.ping(lp, "sine", 160, 110, t, 0.04, 0.16);
    }
  });

  def("rustle", (k) => {
    const lp = k.filter("lowpass", 500, 0.7);
    lp.connect(k.out);
    for (let i = 0; i < 4; i++) k.burst(lp, "pink", "bandpass", 700 + i * 90, 0.8, i * 0.22, 0.2, 0.2, 0.05);
  });

  def("thruster", (k) => {
    // Cold-gas jets heard as structure-borne rumble in the backpack frame.
    const g = k.gain(0);
    k.line(g.gain, [[0, 0], [0.12, 1], [1.2, 0.7], [k.dur * 0.6, 0.4], [k.dur, 0]]);
    g.connect(k.out);
    const rumble = k.gain(0.3);
    k.chain(k.noise("brown"), k.filter("lowpass", 210, 0.7), rumble, g);
    const hiss = k.gain(0.03);
    k.chain(k.noise("white"), k.filter("bandpass", 1900, 0.6), k.filter("lowpass", 2600, 0.7), hiss, g);
    const tone = k.gain(0.05);
    k.chain(k.osc("sine", 47), tone, g);
  });

  /* ───── radio ───── */

  def("radiobed", (k) => {
    const out = bed(k, 1, 0.15, 0.1);
    const hiss = k.gain(0.045);
    k.chain(k.noise("white"), k.filter("bandpass", 1900, 0.9), hiss, out);
    const carrier = k.gain(0.004);
    k.chain(k.osc("sine", 1012), carrier, out);
    // Sparse crackle.
    const crackle = k.gain(0);
    k.chain(k.noise("white", 0, undefined, 0.6), k.filter("highpass", 2600, 0.7), crackle, out);
    const pts: Points = [[0, 0]];
    for (let t = 0.3; t < k.dur; t += 0.35 + hash(t * 7.7) * 1.4) pts.push([t, 0], [t + 0.004, 0.05 * hash(t)], [t + 0.03, 0]);
    k.line(crackle.gain, pts);
  });

  def("squelch", (k) => {
    k.burst(k.out, "white", "bandpass", 2100, 1.2, 0, 0.09, 0.16);
    k.ping(k.out, "sine", 1180, 1180, 0.01, 0.05, 0.035);
  });

  def("radioburst", (k) => {
    const bp = k.filter("bandpass", 1500, 0.8);
    bp.connect(k.out);
    k.burst(bp, "white", "highpass", 500, 0.7, 0, Math.min(0.6, k.dur), 0.36);
    k.ping(bp, "square", 420, 180, 0, 0.16, 0.14);
  });

  def("alarm", (k) => {
    // Suit pressure warning, as it sounds over a helmet speaker.
    const out = bed(k, 1, 0.05, 0.1);
    const bp = k.filter("bandpass", 1700, 1.4);
    const g = k.gain(0);
    k.chain(bp, g, out);
    const o = k.osc("square", 880);
    o.connect(bp);
    const gp: Points = [], fp: Points = [];
    for (let t = 0; t < k.dur; t += 0.5) {
      gp.push([t, 0.11], [t + 0.17, 0.11], [t + 0.18, 0], [t + 0.25, 0], [t + 0.251, 0.11], [t + 0.42, 0.11], [t + 0.43, 0], [t + 0.499, 0]);
      fp.push([t, 880], [t + 0.24, 880], [t + 0.25, 1174], [t + 0.49, 1174]);
    }
    k.line(g.gain, gp);
    k.line(o.frequency, fp);
  });

  def("leak", (k) => {
    // Air leaving a suit, picked up by the helmet microphone of the man next to him.
    const g = k.gain(0);
    k.line(g.gain, [[0, 0], [0.04, 0.16], [1.2, 0.1], [k.dur * 0.7, 0.035], [k.dur, 0]]);
    const hp = k.filter("highpass", 2400, 0.7);
    k.chain(k.noise("white"), hp, k.filter("bandpass", 2600, 0.6), g, k.out);
    k.line(hp.frequency, [[0, 1600], [k.dur, 4200]]);
  });

  def("oldradio", (k) => {
    const out = bed(k, 1, 0.5, 0.6);
    const hiss = k.gain(0.014);
    k.chain(k.noise("pink"), k.filter("bandpass", 2400, 1.1), hiss, out);
    const hum = k.gain(0.007);
    k.chain(k.osc("sine", 100), hum, out);
    const wob = k.gain(0.004);
    k.chain(k.osc("sine", 0.7), wob, hiss.gain);
  });

  def("ident", (k) => {
    const bp = k.filter("bandpass", 1300, 1.6);
    bp.connect(k.out);
    [783.99, 987.77, 1174.66].forEach((f, i) => k.ping(bp, "triangle", f, f, i * 0.2, 0.34, 0.09, 0.01));
  });

  /* ───── places ───── */

  def("hutong", (k) => {
    const out = bed(k, 1, 0.8, 0.8);
    const city = k.gain(0.085);
    k.chain(k.noise("brown"), k.filter("lowpass", 380, 0.7), city, out);
    const air = k.gain(0.006);
    k.chain(k.noise("pink"), k.filter("highpass", 3000, 0.7), air, out);
    // Sparrows settling for the night.
    for (let t = 0.6; t < k.dur - 0.5; t += 0.9 + hash(t * 3.3) * 1.6) {
      const notes = 2 + Math.floor(hash(t) * 3);
      for (let i = 0; i < notes; i++) {
        const at = t + i * 0.11, f = 3300 + hash(t + i) * 1500;
        const o = k.osc("sine", f, at, at + 0.1);
        k.line(o.frequency, [[at, f], [at + 0.03, f * 1.25], [at + 0.08, f * 0.85]]);
        const g = k.gain(0);
        k.line(g.gain, [[at, 0], [at + 0.01, 0.016 + hash(at) * 0.012], [at + 0.08, 0]]);
        k.chain(o, g, out);
      }
    }
    // A bicycle bell, two lanes away.
    for (const at of [2.6, 2.95]) {
      if (at > k.dur - 1) break;
      for (const f of [2093, 2794, 4186]) k.ping(out, "sine", f, f * 0.998, at, 0.7, 0.012, 0.002);
    }
  });

  def("room", (k) => {
    const out = bed(k, 1, 0.6, 0.6);
    const tone = k.gain(0.028);
    k.chain(k.noise("brown"), k.filter("lowpass", 210, 0.7), tone, out);
    // An old wall clock.
    for (let i = 0; i < k.dur; i++) {
      const f = i % 2 ? 2100 : 2650;
      k.burst(out, "white", "bandpass", f, 6, i + 0.2, 0.02, 0.22);
      k.ping(out, "sine", f * 0.5, f * 0.5, i + 0.2, 0.012, 0.006);
    }
  });

  def("shophum", (k) => {
    const out = bed(k, 1, 0.5, 0.05);
    const lp = k.filter("lowpass", 520, 0.7);
    const buzz = k.gain(0.034);
    k.chain(k.osc("sawtooth", 100), lp, buzz, out);
    const second = k.gain(0.006);
    k.chain(k.osc("sine", 300.4), second, out);
    const vent = k.gain(0.02);
    k.chain(k.noise("brown"), k.filter("lowpass", 420, 0.7), vent, out);
  });

  def("cellar", (k) => {
    const out = bed(k, 1, 0.6, 0.3);
    const tone = k.gain(0.034);
    k.chain(k.noise("brown"), k.filter("lowpass", 150, 0.7), tone, out);
    const filament = k.gain(0.0035);
    k.chain(k.osc("sawtooth", 100), k.filter("bandpass", 3100, 4), filament, out);
    // Water somewhere, with the room answering.
    const wet = k.ac.createConvolver();
    wet.buffer = bank(k.ac).room;
    const wetGain = k.gain(0.5);
    k.chain(wet, wetGain, out);
    for (let t = 1.7; t < k.dur - 0.6; t += 2.3 + hash(t * 1.9) * 2.6) {
      const f = 900 + hash(t) * 500;
      k.ping(wet, "sine", f, f * 1.7, t, 0.06, 0.05, 0.002);
      k.ping(out, "sine", f, f * 1.7, t, 0.06, 0.016, 0.002);
    }
  });

  /* ───── the collector's room ───── */

  def("step", (k, c) => {
    const p = payloadOf(c);
    const kind = String(p.kind ?? "stone"), alt = Number(p.alt ?? 0);
    const f = kind === "stone" ? 900 : kind === "concrete" ? 700 : 520;
    k.burst(k.out, "pink", "lowpass", f * (alt ? 0.9 : 1), 0.8, 0, 0.07, 0.5, 0.004);
    k.ping(k.out, "sine", 105 - alt * 12, 60, 0, 0.07, 0.22, 0.004);
    if (kind !== "brick") k.burst(k.out, "white", "bandpass", 2600, 1.2, 0.012, 0.03, 0.06);
  });

  def("creak", (k) => {
    const bp = k.filter("bandpass", 880, 7);
    const g = k.gain(0);
    k.line(g.gain, [[0, 0], [0.15, 0.1], [0.7, 0.07], [k.dur, 0]]);
    const o = k.osc("sawtooth", 300);
    k.line(o.frequency, [[0, 290], [0.3, 262], [0.6, 318], [0.9, 280], [k.dur, 340]]);
    const wob = k.gain(22);
    k.chain(k.osc("sine", 13), wob, o.frequency);
    k.chain(o, bp, g, k.out);
    k.ping(k.out, "sine", 120, 70, k.dur - 0.12, 0.1, 0.12);
  });

  def("clink", (k) => {
    for (const [f, l, len] of [[2350, 0.07, 0.28], [3720, 0.045, 0.2], [5930, 0.03, 0.12]] as Array<[number, number, number]>) k.ping(k.out, "sine", f, f * 0.997, 0, len, l, 0.001);
    k.burst(k.out, "white", "highpass", 5000, 0.7, 0, 0.012, 0.06);
  });

  def("slide", (k) => {
    const g = k.gain(0);
    k.line(g.gain, [[0, 0], [0.08, 0.05], [k.dur - 0.25, 0.04], [k.dur - 0.15, 0]]);
    const bp = k.filter("bandpass", 1500, 1.4);
    k.line(bp.frequency, [[0, 1700], [k.dur, 900]]);
    k.chain(k.noise("white"), bp, g, k.out);
    const rumble = k.gain(0.03);
    k.chain(k.noise("brown", 0, k.dur - 0.15), k.filter("lowpass", 220, 0.7), rumble, k.out);
    k.ping(k.out, "sine", 190, 120, k.dur - 0.14, 0.07, 0.16);
    k.burst(k.out, "white", "bandpass", 2400, 2, k.dur - 0.14, 0.02, 0.12);
  });

  def("thunk", (k) => {
    // Eight grams to the cubic centimetre, set down on felt over wood.
    k.ping(k.out, "sine", 118, 58, 0, 0.16, 0.5, 0.004);
    k.burst(k.out, "pink", "lowpass", 480, 0.8, 0, 0.05, 0.32);
    k.ping(k.out, "triangle", 310, 240, 0.004, 0.05, 0.07);
  });

  def("blip", (k) => {
    k.ping(k.out, "sine", 1318.5, 1318.5, 0, 0.07, 0.05, 0.004);
    k.ping(k.out, "sine", 1760, 1760, 0.09, 0.1, 0.05, 0.004);
  });

  def("rub", (k) => {
    const out = bed(k, 1, 0.2, 0.3);
    const g = k.gain(0);
    k.chain(k.noise("pink"), k.filter("bandpass", 1900, 0.9), g, out);
    const pts: Points = [];
    for (let t = 0; t < k.dur; t += 0.34) pts.push([t, 0], [t + 0.12, 0.03], [t + 0.26, 0.004]);
    k.line(g.gain, pts);
  });

  /* ───── the workshop ───── */

  def("spindle", (k, c) => {
    const up = Math.max(0, 2.6 - c.offset);
    const out = bed(k, 1, 0.3, 0.05);
    const lp = k.filter("lowpass", 1100, 0.9);
    const g = k.gain(0.05);
    k.chain(lp, g, out);
    const a = k.osc("sawtooth", 210), b = k.osc("sawtooth", 423);
    if (up > 0) {
      k.glide(a.frequency, 0, 28, up, 210);
      k.glide(b.frequency, 0, 56, up, 423);
    }
    const bg = k.gain(0.35);
    a.connect(lp);
    k.chain(b, bg, lp);
    const whine = k.gain(0.006);
    const w = k.osc("sine", 2950);
    if (up > 0) k.glide(w.frequency, 0, 400, up, 2950);
    k.chain(w, whine, out);
    const air = k.gain(0.012);
    k.chain(k.noise("pink"), k.filter("bandpass", 900, 0.7), air, out);
  });

  def("spindown", (k) => {
    const lp = k.filter("lowpass", 1100, 0.9);
    const g = k.gain(0);
    k.line(g.gain, [[0, 0.034], [k.dur * 0.7, 0.02], [k.dur, 0]]);
    const a = k.osc("sawtooth", 210), b = k.osc("sawtooth", 423);
    k.glide(a.frequency, 0, 210, k.dur, 22);
    k.glide(b.frequency, 0, 423, k.dur, 44);
    a.connect(lp);
    b.connect(lp);
    k.chain(lp, g, k.out);
  });

  def("grind", (k) => {
    // Carbide into iron-nickel: a held shriek with the spindle's rate beating in it.
    const g = k.gain(0);
    k.line(g.gain, [[0, 0], [0.05, 1], [k.dur - 0.08, 0.9], [k.dur, 0]]);
    g.connect(k.out);
    const am = k.gain(0.6);
    const lfo = k.gain(0.4);
    k.chain(k.osc("square", 38), lfo, am.gain);
    am.connect(g);
    const hiss = k.gain(0.3);
    const bp = k.filter("bandpass", 3300, 2.6);
    k.line(bp.frequency, [[0, 2600], [k.dur, 3900]]);
    k.chain(k.noise("white"), bp, hiss, am);
    const squeal = k.gain(0.05);
    const o = k.osc("sawtooth", 1480);
    k.line(o.frequency, [[0, 1380], [k.dur, 1720]]);
    k.chain(o, k.filter("bandpass", 1600, 3), squeal, am);
    const body = k.gain(0.03);
    k.chain(k.noise("brown"), k.filter("lowpass", 300, 0.7), body, g);
  });

  def("cutzip", (k, c) => {
    // The cut-off wheel dips thirty-six times; each dip is one short zip.
    const span = (c.cue.end - c.cue.start) / 36;
    const g = k.gain(0);
    const bp = k.filter("bandpass", 5200, 3.5);
    k.chain(k.noise("white"), bp, g, k.out);
    const tone = k.gain(0.18);
    k.chain(k.osc("sawtooth", 2480), k.filter("bandpass", 2500, 4), tone, g);
    const pts: Points = [[0, 0]];
    for (let i = 0; i < 36; i++) {
      const t = i * span - c.offset;
      if (t < 0) continue;
      pts.push([t + span * 0.05, 0], [t + span * 0.12, 0.3], [t + span * 0.52, 0.24], [t + span * 0.6, 0]);
    }
    k.line(g.gain, pts);
  });

  def("tink", (k, c) => {
    const i = Number(payloadOf(c).i ?? 0);
    const f = 4700 + hash(i * 2.3) * 1600;
    k.ping(k.out, "sine", f, f * 0.995, 0, 0.11, 0.05, 0.001);
    k.ping(k.out, "sine", f * 1.48, f * 1.47, 0, 0.07, 0.028, 0.001);
    k.ping(k.out, "sine", f, f, 0.07, 0.05, 0.016, 0.001);
  });

  def("sweep", (k) => {
    const strokes = Math.floor(k.dur / 0.5);
    for (let i = 0; i < strokes; i++) {
      const f = k.burst(k.out, "pink", "bandpass", 2600, 0.7, i * 0.5, 0.36, 0.05, 0.1);
      k.line(f.frequency, [[i * 0.5, 2000], [i * 0.5 + 0.36, 3600]]);
    }
  });

  def("click", (k) => {
    k.burst(k.out, "white", "highpass", 2200, 0.7, 0, 0.014, 0.3);
    k.ping(k.out, "sine", 1850, 1500, 0, 0.02, 0.07, 0.001);
    k.ping(k.out, "sine", 420, 300, 0, 0.03, 0.06, 0.001);
  });

  def("snick", (k, c) => {
    const i = Number(payloadOf(c).i ?? 0);
    k.burst(k.out, "white", "bandpass", 3200 + hash(i) * 900, 3, 0, 0.012, 0.16);
    k.ping(k.out, "sine", 2400, 1900, 0.004, 0.02, 0.03, 0.001);
    k.burst(k.out, "white", "bandpass", 5200, 3, 0.09, 0.008, 0.05);
  });

  def("breaker", (k) => {
    k.ping(k.out, "sine", 82, 44, 0, 0.22, 0.5, 0.003);
    k.burst(k.out, "white", "bandpass", 1700, 1.4, 0, 0.03, 0.3);
    k.burst(k.out, "brown", "lowpass", 300, 0.7, 0.02, 0.3, 0.2);
  });

  /* ───── the basement ───── */

  def("clack", (k) => {
    k.burst(k.out, "white", "bandpass", 2600, 1.6, 0, 0.02, 0.36);
    k.ping(k.out, "sine", 210, 130, 0.006, 0.07, 0.3, 0.002);
    k.ping(k.out, "triangle", 980, 900, 0, 0.04, 0.07, 0.001);
  });

  def("rack", (k) => {
    const f = k.burst(k.out, "white", "bandpass", 2400, 1.2, 0, 0.11, 0.2, 0.01);
    k.line(f.frequency, [[0, 3000], [0.1, 1500]]);
    k.burst(k.out, "white", "highpass", 2000, 0.7, 0, 0.012, 0.34);
    k.burst(k.out, "white", "highpass", 1800, 0.7, 0.13, 0.016, 0.42);
    k.ping(k.out, "sine", 240, 150, 0.13, 0.06, 0.26, 0.002);
  });

  def("gunshot", (k, c) => {
    // 7.62 mm in a concrete box: the report, then the room hitting back.
    const i = Number(payloadOf(c).i ?? 0);
    const dry = k.gain(0.3);
    const send = k.gain(1);
    const sum = k.gain(1);
    sum.connect(dry);
    sum.connect(send);
    dry.connect(k.out);
    // Report.
    k.burst(sum, "white", "highpass", 2800, 0.7, 0, 0.012, 0.9, 0.0005);
    const body = k.burst(sum, "white", "lowpass", 5200, 0.6, 0, 0.26, 0.62, 0.001);
    k.glide(body.frequency, 0, 6200 - i * 200, 0.22, 420);
    k.ping(sum, "sine", 168 - i * 4, 44, 0, 0.16, 0.7, 0.001);
    k.ping(sum, "triangle", 620, 210, 0, 0.05, 0.2, 0.001);
    // Reverberation: generated impulse response of the room.
    const verb = k.ac.createConvolver();
    verb.buffer = bank(k.ac).room;
    const wet = k.gain(0.36);
    k.chain(send, verb, wet, k.out);
    // Flutter between the two long parallel walls.
    const d = k.delay(0.0375 + i * 0.0012);
    const fb = k.gain(0.5);
    const tone = k.filter("lowpass", 2600, 0.7);
    const slap = k.gain(0.2);
    k.chain(send, d, tone, fb, d);
    k.chain(tone, slap, k.out);
    // The low pressure wave that arrives after the crack.
    k.ping(k.out, "sine", 52, 34, 0.02, 0.55, 0.2, 0.03);
  });

  def("tinnitus", (k) => {
    const g = k.gain(0);
    k.line(g.gain, [[0, 0], [0.25, 0.022], [k.dur * 0.45, 0.014], [k.dur, 0]]);
    g.connect(k.out);
    k.osc("sine", 4160).connect(g);
    const second = k.gain(0.5);
    k.chain(k.osc("sine", 4236), second, g);
  });

  def("rip", (k) => {
    const g = k.gain(0);
    k.line(g.gain, [[0, 0], [0.05, 0.07], [k.dur * 0.8, 0.05], [k.dur, 0]]);
    const bp = k.filter("bandpass", 2400, 1.1);
    k.line(bp.frequency, [[0, 1900], [k.dur, 4200]]);
    const am = k.gain(0.55);
    const lfo = k.gain(0.45);
    k.chain(k.osc("sawtooth", 31), lfo, am.gain);
    k.chain(k.noise("white"), bp, am, g, k.out);
  });

  def("gravel", (k) => {
    for (let i = 0; i < 9; i++) {
      const t = hash(i * 3.7) * Math.max(0.2, k.dur - 0.2);
      k.burst(k.out, "white", "bandpass", 2600 + hash(i) * 2600, 4, t, 0.014, 0.1);
      k.ping(k.out, "sine", 900 + hash(i + 5) * 700, 700, t, 0.02, 0.02, 0.001);
    }
  });

  def("whoosh", (k) => {
    // The air goes out of the cut: the last sound before vacuum.
    const g = k.gain(0);
    k.line(g.gain, [[0, 0], [k.dur * 0.75, 0.085], [k.dur - 0.03, 0.11], [k.dur, 0]]);
    const lp = k.filter("lowpass", 300, 0.9);
    k.glide(lp.frequency, 0, 220, k.dur, 5200);
    k.chain(k.noise("pink"), lp, g, k.out);
  });

  /* ───── score and subjective sound ───── */

  def("pad", (k, c) => {
    const p = payloadOf(c);
    const notes = (p.notes as number[] | undefined) ?? [110];
    const attack = Math.min(Number(p.attack ?? 3), k.dur * 0.6);
    const release = Math.min(Number(p.release ?? 1), k.dur * 0.4);
    const g = k.gain(0);
    k.line(g.gain, [[0, 0], [attack, 1], [Math.max(attack + 0.01, k.dur - release), 1], [k.dur, 0]]);
    const lp = k.filter("lowpass", 900, 0.5);
    k.chain(lp, g, k.out);
    const level = 0.085 / Math.sqrt(notes.length);
    notes.forEach((f, i) => {
      const a = k.osc("sine", f), b = k.osc("triangle", f * 1.004), cOsc = k.osc("sine", f * 0.5015);
      const ga = k.gain(level), gb = k.gain(level * 0.55), gc = k.gain(level * 0.35);
      k.chain(a, ga, lp);
      k.chain(b, gb, lp);
      k.chain(cOsc, gc, lp);
      // Slow, unsynchronised swell on each partial.
      const swell = k.gain(level * 0.4);
      k.chain(k.osc("sine", 0.07 + i * 0.023), swell, ga.gain);
    });
    if (p.shimmer) {
      const s = k.gain(0);
      k.line(s.gain, [[0, 0], [k.dur * 0.5, 0.004], [k.dur - 0.2, 0.012], [k.dur, 0]]);
      k.chain(k.osc("sine", Number(p.shimmer)), s, k.out);
    }
  });

  def("boom", (k) => {
    k.ping(k.out, "sine", 58, 29, 0, Math.min(3.2, k.dur), 0.36, 0.02);
    k.burst(k.out, "brown", "lowpass", 130, 0.7, 0, 1.6, 0.32, 0.01);
    const shimmer = k.gain(0);
    k.line(shimmer.gain, [[0, 0], [0.4, 0.012], [Math.min(3, k.dur), 0]]);
    k.chain(k.noise("pink"), k.filter("bandpass", 5200, 2), shimmer, k.out);
  });

  def("pulse", (k) => {
    // A clock for the montage: one soft low beat a second.
    const out = bed(k, 1, 1.5, 0.3);
    for (let t = 0; t < k.dur; t += 1) {
      k.ping(out, "sine", 82, 55, t, 0.16, 0.2, 0.005);
      k.burst(out, "white", "bandpass", 3800, 4, t + 0.5, 0.012, 0.014);
    }
  });

  def("heartbeat", (k, c) => {
    const p = payloadOf(c);
    const from = Number(p.from ?? 62), to = Number(p.to ?? 90);
    const lp = k.filter("lowpass", 150, 0.7);
    lp.connect(k.out);
    let t = 0;
    while (t < k.dur - 0.3) {
      const u = t / k.dur;
      const level = 0.34 + u * 0.3;
      k.ping(lp, "sine", 62, 40, t, 0.11, level, 0.008);
      k.ping(lp, "sine", 56, 36, t + 0.17, 0.1, level * 0.7, 0.008);
      t += 60 / (from + (to - from) * u);
    }
  });

  def("riser", (k) => {
    const g = k.gain(0);
    k.line(g.gain, [[0, 0], [k.dur * 0.6, 0.04], [k.dur - 0.02, 0.13], [k.dur, 0]]);
    g.connect(k.out);
    const o = k.osc("sawtooth", 110);
    k.glide(o.frequency, 0, 98, k.dur, 392);
    const lp = k.filter("lowpass", 500, 2);
    k.glide(lp.frequency, 0, 300, k.dur, 2600);
    k.chain(o, lp, g);
    const air = k.gain(0.5);
    const bp = k.filter("bandpass", 800, 1.5);
    k.glide(bp.frequency, 0, 500, k.dur, 5200);
    k.chain(k.noise("pink"), bp, air, g);
  });
}

/**
 * Sound direction engine.
 *
 * Two sources only, both allowed by the brief:
 *   1. the platform's offline CC0 sample set (loaded by name), and
 *   2. browser-native Web Audio synthesis.
 *
 * Everything is routed through a master compressor and a procedural
 * convolution reverb whose wet amount is switched per environment, so the
 * basement gunshots bloom and reflect while vacuum stays close and dead.
 */

export type Env = "dry" | "room" | "basement" | "vacuum" | "outdoor";

export interface PlayOpts {
  gain?: number;
  rate?: number;
  pan?: number;
  loop?: boolean;
  offset?: number;
  duration?: number;
  reverb?: number;
  attack?: number;
  release?: number;
}

export class AudioEngine {
  readonly ctx: AudioContext;
  private master: GainNode;
  private comp: DynamicsCompressorNode;
  private reverb: ConvolverNode;
  private wet: GainNode;
  private dry: GainNode;
  private noiseBuf: AudioBuffer;
  private samples = new Map<string, AudioBuffer>();
  private loops = new Map<string, { src: AudioBufferSourceNode; gain: GainNode }>();
  ready = false;
  muted = false;
  private env: Env = "room";

  constructor() {
    const AC: typeof AudioContext =
      (globalThis as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ??
      (globalThis as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.comp = this.ctx.createDynamicsCompressor();
    this.comp.threshold.value = -14;
    this.comp.knee.value = 24;
    this.comp.ratio.value = 6;
    this.comp.attack.value = 0.004;
    this.comp.release.value = 0.25;
    this.master.connect(this.comp).connect(this.ctx.destination);

    // reverb bus
    this.reverb = this.ctx.createConvolver();
    this.reverb.buffer = this.makeImpulse(2.6, 2.4);
    this.wet = this.ctx.createGain();
    this.wet.gain.value = 0.35;
    this.dry = this.ctx.createGain();
    this.dry.gain.value = 1;
    this.reverb.connect(this.wet).connect(this.master);
    this.dry.connect(this.master);

    // shared noise buffer
    const n = this.ctx.sampleRate * 2;
    this.noiseBuf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  }

  private makeImpulse(seconds: number, decay: number): AudioBuffer {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        // sparse early reflections then dense diffuse tail
        const early = i < rate * 0.05 ? (Math.random() < 0.02 ? 1 : 0) : 0;
        d[i] = ((Math.random() * 2 - 1) * Math.pow(1 - t, decay) + early * 0.6) * (ch ? 0.94 : 1);
      }
    }
    return buf;
  }

  async load(urls: Record<string, string>): Promise<void> {
    const entries = Object.entries(urls);
    await Promise.all(
      entries.map(async ([name, url]) => {
        try {
          const res = await fetch(url);
          const arr = await res.arrayBuffer();
          const buf = await this.ctx.decodeAudioData(arr);
          this.samples.set(name, buf);
        } catch {
          /* a missing sample is not fatal: synthesis still carries the cue */
        }
      })
    );
    this.ready = true;
  }

  has(name: string): boolean {
    return this.samples.has(name);
  }

  resume(): void {
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setMuted(m: boolean): void {
    this.muted = m;
    this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.05);
  }

  setEnvironment(env: Env): void {
    if (env === this.env) return;
    this.env = env;
    const wet = env === "basement" ? 0.62 : env === "room" ? 0.3 : env === "outdoor" ? 0.16 : env === "vacuum" ? 0.02 : 0.12;
    this.wet.gain.setTargetAtTime(wet, this.ctx.currentTime, 0.4);
  }

  /** Master output level (used for dramatic ducks). */
  setMaster(v: number, time = 0.2): void {
    this.master.gain.setTargetAtTime(v, this.ctx.currentTime, time);
  }

  private bus(reverb: number): { input: AudioNode; output: AudioNode } {
    // returns a small input gain that feeds both dry and reverb
    return { input: this.ctx.createGain(), output: this.master };
  }

  private route(node: AudioNode, reverb: number): void {
    const g = this.ctx.createGain();
    g.gain.value = 1;
    node.connect(g);
    g.connect(this.dry);
    if (reverb > 0.001) {
      const send = this.ctx.createGain();
      send.gain.value = reverb;
      g.connect(send).connect(this.reverb);
    }
  }

  playSample(name: string, o: PlayOpts = {}): void {
    const buf = this.samples.get(name);
    if (!buf || this.muted) return;
    const t = this.ctx.currentTime + (o.offset ? 0 : 0);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = o.rate ?? 1;
    src.loop = !!o.loop;
    const g = this.ctx.createGain();
    const peak = o.gain ?? 1;
    const attack = o.attack ?? 0.004;
    const release = o.release ?? Math.min(1.4, buf.duration / Math.max(0.5, o.rate ?? 1));
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack);
    if (!o.loop) {
      g.gain.setValueAtTime(Math.max(0.0002, peak), t + Math.max(attack, release - 0.08));
      g.gain.exponentialRampToValueAtTime(0.0001, t + release);
    }
    let out: AudioNode = g;
    if (o.pan) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = o.pan;
      g.connect(p);
      out = p;
    }
    src.connect(g);
    this.route(out, o.reverb ?? (this.env === "basement" ? 0.5 : 0.12));
    src.start(t, o.offset ?? 0, o.duration);
    if (!o.loop) src.stop(t + (o.duration ?? buf.duration) + 0.05);
  }

  /* ------------------------------------------------------- synthesis */

  private noiseSource(loop = false): AudioBufferSourceNode {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.loop = loop;
    return s;
  }

  /** A filtered noise burst — the body of a gunshot, an impact, a hiss. */
  burst(o: { dur?: number; freq?: number; q?: number; gain?: number; type?: BiquadFilterType; reverb?: number; pan?: number } = {}): void {
    if (this.muted) return;
    const t = this.ctx.currentTime;
    const dur = o.dur ?? 0.2;
    const src = this.noiseSource();
    const f = this.ctx.createBiquadFilter();
    f.type = o.type ?? "lowpass";
    f.frequency.value = o.freq ?? 800;
    f.Q.value = o.q ?? 1;
    const g = this.ctx.createGain();
    const peak = o.gain ?? 0.6;
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let out: AudioNode = g;
    src.connect(f).connect(g);
    if (o.pan) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = o.pan;
      g.connect(p);
      out = p;
    }
    this.route(out, o.reverb ?? (this.env === "basement" ? 0.6 : 0.14));
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  /** A pitched tone with an envelope. */
  tone(o: { freq: number; dur?: number; gain?: number; type?: OscillatorType; glide?: number; reverb?: number; attack?: number }): void {
    if (this.muted) return;
    const t = this.ctx.currentTime;
    const dur = o.dur ?? 0.3;
    const osc = this.ctx.createOscillator();
    osc.type = o.type ?? "sine";
    osc.frequency.setValueAtTime(o.freq, t);
    if (o.glide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.glide), t + dur);
    const g = this.ctx.createGain();
    const peak = o.gain ?? 0.2;
    const a = o.attack ?? 0.01;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    this.route(g, o.reverb ?? (this.env === "basement" ? 0.5 : 0.12));
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  /** Layered indoor gunshot: crack + body + sub + reflection. */
  gunshot(power = 1): void {
    if (this.muted) return;
    const t = this.ctx.currentTime;
    // sample body
    if (this.has("explosionCrunch_000")) this.playSample("explosionCrunch_000", { gain: 0.9 * power, rate: 1.25, reverb: 0.7, release: 0.6 });
    if (this.has("impactMetal_heavy_002")) this.playSample("impactMetal_heavy_002", { gain: 0.5 * power, rate: 1.4, reverb: 0.8, release: 0.4 });
    // synthesised crack
    this.burst({ dur: 0.09, freq: 5200, q: 0.8, gain: 1.0 * power, type: "highpass", reverb: 0.7 });
    this.burst({ dur: 0.32, freq: 480, q: 0.9, gain: 0.9 * power, type: "lowpass", reverb: 0.8 });
    // sub thump
    this.tone({ freq: 96, glide: 42, dur: 0.42, gain: 0.55 * power, type: "sine", reverb: 0.5 });
    // room slap (basement)
    if (this.env === "basement") {
      const echo = this.ctx.createGain();
      echo.gain.value = 0;
      this.route(echo, 0.9);
      for (let i = 1; i <= 3; i++) {
        const d = i * 0.085;
        setTimeout(() => this.burst({ dur: 0.05, freq: 1800, q: 1.2, gain: 0.18 / i, reverb: 0.9 }), d * 1000);
      }
    }
    void t;
  }

  /** A single footstep on concrete/wood. */
  footstep(wood = false, gain = 0.28): void {
    const a = wood ? "footstep_wood" : "footstep_concrete";
    const n = `${a}_00${Math.floor(Math.random() * 3)}`;
    if (this.has(n)) this.playSample(n, { gain, rate: 0.95 + Math.random() * 0.1, reverb: this.env === "basement" ? 0.55 : 0.18 });
    else this.burst({ dur: 0.08, freq: 320, q: 1.4, gain: gain * 0.5, reverb: 0.3 });
  }

  /** A mechanism click / casing. */
  click(gain = 0.3, bright = false): void {
    const n = bright ? "impactMetal_light_001" : "click3";
    if (this.has(n)) this.playSample(n, { gain, rate: bright ? 1.6 : 1, reverb: this.env === "basement" ? 0.7 : 0.2 });
    else this.burst({ dur: 0.04, freq: 2600, q: 2, gain: gain * 0.5 });
  }

  /** Distant metallic ring / tinnitus after the shots. */
  ring(freq = 4200, dur = 4.5, gain = 0.09): void {
    this.tone({ freq, dur, gain, type: "sine", attack: 0.05, reverb: 0.25 });
    this.tone({ freq: freq * 1.5, dur: dur * 0.7, gain: gain * 0.4, type: "sine", reverb: 0.2 });
  }

  /** A countdown / alarm beep. */
  beep(freq = 880, dur = 0.12, gain = 0.18): void {
    this.tone({ freq, dur, gain, type: "square", reverb: 0.25 });
  }

  /** Rising tension noise. */
  riser(dur = 3, gain = 0.25): void {
    if (this.muted) return;
    const t = this.ctx.currentTime;
    const src = this.noiseSource(true);
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(180, t);
    f.frequency.exponentialRampToValueAtTime(5200, t + dur);
    f.Q.value = 3;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.8);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g);
    this.route(g, 0.3);
    src.start(t);
    src.stop(t + dur + 0.1);
  }

  /** Sustained low rumble (rocket, distant machinery). */
  rumble(level = 0.5, dur = 8): void {
    if (this.muted) return;
    const t = this.ctx.currentTime;
    const src = this.noiseSource(true);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 110;
    f.Q.value = 0.7;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(level, t + 1.2);
    g.gain.setValueAtTime(level, t + dur - 1.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g);
    this.route(g, 0.4);
    src.start(t);
    src.stop(t + dur + 0.1);
  }

  /** Radio static burst. */
  static_(dur = 0.5, gain = 0.12): void {
    this.burst({ dur, freq: 2200, q: 0.5, gain, type: "bandpass", reverb: 0.15 });
  }

  /** Suit breathing loop (used in vacuum/subjective passages). */
  breath(seconds = 6, gain = 0.16): void {
    if (this.muted) return;
    const t = this.ctx.currentTime;
    const src = this.noiseSource(true);
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 700;
    f.Q.value = 1.2;
    const g = this.ctx.createGain();
    g.gain.value = 0;
    // two breaths per loop
    for (let i = 0; i < seconds * 0.5; i++) {
      const t0 = t + i * 2;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(gain, t0 + 0.5);
      g.gain.linearRampToValueAtTime(0.0001, t0 + 1.4);
    }
    src.connect(f).connect(g);
    this.route(g, 0.1);
    src.start(t);
    src.stop(t + seconds + 0.2);
  }

  /** Start / stop a looping sample as an ambience bed. */
  loopSample(name: string, key: string, gain = 0.3, rate = 1, fade = 0.8): void {
    if (this.loops.has(key)) return;
    const buf = this.samples.get(name);
    if (!buf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.playbackRate.value = rate;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), this.ctx.currentTime + fade);
    src.connect(g);
    this.route(g, this.env === "basement" ? 0.5 : 0.2);
    src.start();
    this.loops.set(key, { src, gain: g });
  }

  stopLoop(key: string, fade = 1): void {
    const l = this.loops.get(key);
    if (!l) return;
    const t = this.ctx.currentTime;
    l.gain.gain.cancelScheduledValues(t);
    l.gain.gain.setValueAtTime(Math.max(0.0002, l.gain.gain.value), t);
    l.gain.gain.exponentialRampToValueAtTime(0.0001, t + fade);
    try {
      l.src.stop(t + fade + 0.1);
    } catch {
      /* already stopped */
    }
    this.loops.delete(key);
  }

  stopAll(): void {
    for (const k of Array.from(this.loops.keys())) this.stopLoop(k, 0.3);
  }
}

import type { WeaponId } from './types';

interface ToneOpts {
  type: OscillatorType;
  f0: number;
  f1?: number;
  dur: number;
  gain: number;
  when?: number;
  dist?: number;
  pan?: number;
  falloff?: number;
}

interface NoiseOpts {
  dur: number;
  filter: BiquadFilterType;
  freq: number;
  /** optional filter frequency sweep target */
  f1?: number;
  q?: number;
  gain: number;
  when?: number;
  dist?: number;
  pan?: number;
  falloff?: number;
}

/** distance attenuation curve for normal sounds */
const FALLOFF = 0.12;
/** gentler curve for very loud events (explosion) so they carry far */
const FAR_FALLOFF = 0.04;

/**
 * Procedural sound synth built on raw Web Audio. Every effect is layered
 * from short oscillator tones and filtered bursts of a shared white-noise
 * buffer. The AudioContext is created lazily on the first user gesture via
 * unlock(); until then (and whenever the context is not running) every
 * play method is a silent no-op, so the module is safe to import anywhere.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;

  /** Create/resume the context. Must be called from a user gesture. */
  unlock(): void {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.4;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 6;
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => undefined);
    }
  }

  /** The live context, or null when sounds should no-op. */
  private live(): AudioContext | null {
    return this.ctx && this.master && this.ctx.state === 'running' ? this.ctx : null;
  }

  private noiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuf) {
      const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
    }
    return this.noiseBuf;
  }

  /** Distance gain + stereo pan tap into the master bus. */
  private route(ctx: AudioContext, dist: number, pan: number, falloff = FALLOFF) {
    const g = ctx.createGain();
    g.gain.value = 1 / (1 + Math.max(0, dist) * falloff);
    const p = ctx.createStereoPanner();
    p.pan.value = Math.min(1, Math.max(-1, pan));
    g.connect(p);
    p.connect(this.master as GainNode);
    return { input: g, panner: p };
  }

  /** One enveloped oscillator voice with optional pitch sweep. */
  private tone(o: ToneOpts): void {
    const ctx = this.live();
    if (!ctx) return;
    const t = ctx.currentTime + (o.when ?? 0);
    const osc = ctx.createOscillator();
    osc.type = o.type;
    osc.frequency.setValueAtTime(Math.max(1, o.f0), t);
    if (o.f1 !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f1), t + o.dur);
    }
    const env = ctx.createGain();
    env.gain.setValueAtTime(o.gain, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    const r = this.route(ctx, o.dist ?? 0, o.pan ?? 0, o.falloff);
    osc.connect(env);
    env.connect(r.input);
    osc.start(t);
    osc.stop(t + o.dur + 0.02);
    osc.onended = () => {
      osc.disconnect();
      env.disconnect();
      r.input.disconnect();
      r.panner.disconnect();
    };
  }

  /** One enveloped, filtered noise-burst voice. */
  private noise(o: NoiseOpts): void {
    const ctx = this.live();
    if (!ctx) return;
    const t = ctx.currentTime + (o.when ?? 0);
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(ctx);
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = o.filter;
    filt.frequency.setValueAtTime(Math.max(10, o.freq), t);
    if (o.f1 !== undefined) {
      filt.frequency.exponentialRampToValueAtTime(Math.max(10, o.f1), t + o.dur);
    }
    filt.Q.value = o.q ?? 1;
    const env = ctx.createGain();
    env.gain.setValueAtTime(o.gain, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    const r = this.route(ctx, o.dist ?? 0, o.pan ?? 0, o.falloff);
    src.connect(filt);
    filt.connect(env);
    env.connect(r.input);
    src.start(t);
    src.stop(t + o.dur + 0.02);
    src.onended = () => {
      src.disconnect();
      filt.disconnect();
      env.disconnect();
      r.input.disconnect();
      r.panner.disconnect();
    };
  }

  /** Distinct gunshot per weapon: noise crack layered with a body tone. */
  shot(id: WeaponId, dist = 0, pan = 0): void {
    switch (id) {
      case 'ak47':
        this.noise({ dur: 0.14, filter: 'bandpass', freq: 350, q: 0.8, gain: 0.9, dist, pan });
        this.tone({ type: 'sine', f0: 90, f1: 45, dur: 0.12, gain: 0.7, dist, pan });
        break;
      case 'm4a4':
        this.noise({ dur: 0.1, filter: 'bandpass', freq: 650, q: 0.8, gain: 0.85, dist, pan });
        this.tone({ type: 'sine', f0: 140, f1: 70, dur: 0.08, gain: 0.55, dist, pan });
        break;
      case 'awp':
        this.noise({ dur: 0.4, filter: 'bandpass', freq: 200, q: 0.6, gain: 1.0, dist, pan });
        this.tone({ type: 'sine', f0: 70, f1: 35, dur: 0.35, gain: 0.85, dist, pan });
        this.noise({ dur: 0.05, filter: 'highpass', freq: 2500, gain: 0.45, dist, pan });
        break;
      case 'glock':
        this.noise({ dur: 0.07, filter: 'bandpass', freq: 950, q: 0.9, gain: 0.8, dist, pan });
        this.tone({ type: 'sine', f0: 180, f1: 120, dur: 0.05, gain: 0.45, dist, pan });
        break;
      case 'usp':
        this.noise({ dur: 0.09, filter: 'bandpass', freq: 750, q: 1.0, gain: 0.5, dist, pan });
        this.tone({ type: 'sine', f0: 120, f1: 80, dur: 0.07, gain: 0.35, dist, pan });
        break;
      case 'deagle':
        this.noise({ dur: 0.2, filter: 'bandpass', freq: 480, q: 0.7, gain: 0.95, dist, pan });
        this.tone({ type: 'sine', f0: 100, f1: 45, dur: 0.16, gain: 0.8, dist, pan });
        break;
      case 'knife':
        this.noise({ dur: 0.15, filter: 'bandpass', freq: 400, f1: 1200, q: 1.2, gain: 0.3, dist, pan });
        break;
    }
  }

  /** Empty-mag click. */
  dry(dist = 0, pan = 0): void {
    this.tone({ type: 'square', f0: 1800, dur: 0.03, gain: 0.12, dist, pan });
  }

  /** Two-stage click-clack. */
  reload(dist = 0, pan = 0): void {
    this.tone({ type: 'square', f0: 1200, dur: 0.02, gain: 0.16, dist, pan });
    this.noise({ dur: 0.03, filter: 'highpass', freq: 2000, gain: 0.12, dist, pan });
    this.tone({ type: 'square', f0: 700, dur: 0.03, gain: 0.18, when: 0.35, dist, pan });
    this.noise({ dur: 0.05, filter: 'lowpass', freq: 1500, gain: 0.2, when: 0.35, dist, pan });
  }

  /** Quiet lowpassed tap. */
  footstep(dist = 0, pan = 0): void {
    this.noise({ dur: 0.05, filter: 'lowpass', freq: 300, gain: 0.18, dist, pan });
  }

  scopeIn(): void {
    this.noise({ dur: 0.12, filter: 'bandpass', freq: 600, f1: 1800, q: 2, gain: 0.15 });
  }

  scopeOut(): void {
    this.noise({ dur: 0.12, filter: 'bandpass', freq: 1800, f1: 600, q: 2, gain: 0.15 });
  }

  /** Hit confirmation tick; headshots are higher pitched. */
  hit(headshot: boolean): void {
    this.tone({ type: 'square', f0: headshot ? 1500 : 1000, dur: 0.05, gain: 0.18 });
  }

  /** Two-tone kill confirmation. */
  kill(): void {
    this.tone({ type: 'sine', f0: 880, dur: 0.06, gain: 0.25 });
    this.tone({ type: 'sine', f0: 1320, dur: 0.06, gain: 0.25, when: 0.06 });
  }

  /** Low thud when the local player takes damage. */
  hurt(): void {
    this.tone({ type: 'sine', f0: 120, f1: 80, dur: 0.15, gain: 0.5 });
  }

  knifeSwing(): void {
    this.noise({ dur: 0.15, filter: 'bandpass', freq: 400, f1: 1200, q: 1.2, gain: 0.3 });
  }

  knifeHit(): void {
    this.noise({ dur: 0.08, filter: 'lowpass', freq: 500, gain: 0.5 });
    this.tone({ type: 'sine', f0: 150, f1: 60, dur: 0.1, gain: 0.5 });
  }

  plantBeep(): void {
    this.tone({ type: 'sine', f0: 1000, dur: 0.05, gain: 0.2 });
  }

  /** Ascending chirp sequence when the plant finishes. */
  plantDone(): void {
    this.tone({ type: 'sine', f0: 700, dur: 0.07, gain: 0.22 });
    this.tone({ type: 'sine', f0: 1050, dur: 0.07, gain: 0.22, when: 0.08 });
    this.tone({ type: 'sine', f0: 1400, dur: 0.1, gain: 0.22, when: 0.16 });
  }

  /** Descending chirp for a completed defuse. */
  defuseDone(): void {
    this.tone({ type: 'sine', f0: 1400, dur: 0.07, gain: 0.22 });
    this.tone({ type: 'sine', f0: 1050, dur: 0.07, gain: 0.22, when: 0.08 });
    this.tone({ type: 'sine', f0: 700, dur: 0.12, gain: 0.22, when: 0.16 });
  }

  /** Planted-bomb beep; pitch and gain rise slightly with urgency 0..1. */
  bombBeep(urgency: number, dist = 0, pan = 0): void {
    const u = Math.min(1, Math.max(0, urgency));
    this.tone({ type: 'sine', f0: 1200 * (1 + u * 0.25), dur: 0.06, gain: 0.2 + u * 0.15, dist, pan });
  }

  /** Big layered boom: long low rumble + sub sine + initial crack. */
  explosion(dist = 0): void {
    this.noise({ dur: 0.08, filter: 'highpass', freq: 1800, gain: 0.8, dist, falloff: FAR_FALLOFF });
    this.noise({ dur: 0.8, filter: 'lowpass', freq: 200, gain: 1.0, dist, falloff: FAR_FALLOFF });
    this.tone({ type: 'sine', f0: 55, f1: 30, dur: 0.7, gain: 0.9, dist, falloff: FAR_FALLOFF });
  }

  /** Short attention beep at round start. */
  roundStart(): void {
    this.tone({ type: 'sine', f0: 740, dur: 0.1, gain: 0.22 });
  }

  /** Brief two-note win sting. */
  roundWin(): void {
    this.tone({ type: 'sine', f0: 523, dur: 0.12, gain: 0.25 });
    this.tone({ type: 'sine', f0: 784, dur: 0.2, gain: 0.25, when: 0.12 });
  }
}

export const audio = new AudioEngine();

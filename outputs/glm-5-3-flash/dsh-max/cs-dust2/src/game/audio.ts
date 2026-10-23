/**
 * audio.ts — every sound is synthesised at runtime with the Web Audio API
 * (no external audio files). Simple stereo panning + distance attenuation.
 */

import { SoundProfile } from './weapons';

interface Listener { x: number; y: number; z: number; fx: number; fz: number; rx: number; rz: number }

export class GameAudio {
  ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private listener: Listener = { x: 0, y: 0, z: 0, fx: 0, fz: -1, rx: 1, rz: 0 };
  volume = 0.7;
  muted = false;

  /** must be called from a user gesture */
  init() {
    if (this.ctx) { void this.ctx.resume(); return; }
    try {
      const Ctor: typeof AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.knee.value = 20; comp.ratio.value = 8;
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
      // white noise buffer
      const len = this.ctx.sampleRate * 2;
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
    } catch { /* audio unavailable */ }
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.master) this.master.gain.value = this.muted ? 0 : v;
  }
  setMuted(m: boolean) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : this.volume;
  }

  setListener(x: number, y: number, z: number, yaw: number) {
    const fx = Math.sin(yaw), fz = Math.cos(yaw);
    this.listener = { x, y, z, fx, fz, rx: fz, rz: -fx };
  }

  /** gain + stereo pan for a world position relative to the listener */
  private spatial(x?: number, z?: number): { gain: number; pan: number } {
    if (x === undefined || z === undefined) return { gain: 1, pan: 0 };
    const dx = x - this.listener.x, dz = z - this.listener.z;
    const d = Math.hypot(dx, dz);
    const gain = Math.min(1, 14 / (10 + d));
    const pan = d > 0.5 ? Math.max(-1, Math.min(1, (dx * this.listener.rx + dz * this.listener.rz) / d * 0.8)) : 0;
    return { gain, pan };
  }

  private out(pan: number, gain: number, t: number): GainNode | null {
    if (!this.ctx || !this.master) return null;
    const g = this.ctx.createGain();
    g.gain.value = gain;
    let node: AudioNode = g;
    if (this.ctx.createStereoPanner) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = pan;
      g.connect(p);
      node = p;
    }
    node.connect(this.master);
    void t;
    return g;
  }

  private noise(opts: {
    dur: number; freq: number; gain: number; q?: number; type?: BiquadFilterType;
    freqEnd?: number; pan?: number; gainEnd?: number; delay?: number; playbackRate?: number;
  }) {
    if (!this.ctx || !this.noiseBuf) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    src.playbackRate.value = opts.playbackRate ?? 1;
    const filt = this.ctx.createBiquadFilter();
    filt.type = opts.type ?? 'bandpass';
    filt.frequency.setValueAtTime(opts.freq, t0);
    if (opts.freqEnd) filt.frequency.exponentialRampToValueAtTime(Math.max(30, opts.freqEnd), t0 + opts.dur);
    filt.Q.value = opts.q ?? 0.8;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(opts.gain, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0005, opts.gainEnd ?? 0.0008), t0 + opts.dur);
    src.connect(filt); filt.connect(g);
    const dest = this.out(opts.pan ?? 0, 1, t0);
    if (dest) g.connect(dest);
    src.start(t0); src.stop(t0 + opts.dur + 0.05);
  }

  private tone(opts: {
    f0: number; f1?: number; dur: number; gain: number; type?: OscillatorType;
    pan?: number; delay?: number; gainEnd?: number;
  }) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const osc = this.ctx.createOscillator();
    osc.type = opts.type ?? 'sine';
    osc.frequency.setValueAtTime(Math.max(20, opts.f0), t0);
    if (opts.f1) osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.f1), t0 + opts.dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, opts.gain), t0 + Math.min(0.02, opts.dur * 0.3));
    g.gain.exponentialRampToValueAtTime(Math.max(0.0005, opts.gainEnd ?? 0.0008), t0 + opts.dur);
    osc.connect(g);
    const dest = this.out(opts.pan ?? 0, 1, t0);
    if (dest) g.connect(dest);
    osc.start(t0); osc.stop(t0 + opts.dur + 0.05);
  }

  /* ------------------------------------------------------------ */
  /* game sounds                                                    */
  /* ------------------------------------------------------------ */

  shot(p: SoundProfile, x?: number, z?: number, loud = 1) {
    if (!this.ctx) return;
    const { gain, pan } = this.spatial(x, z);
    const k = gain * loud;
    this.tone({ f0: p.thumpF0, f1: p.thumpF1, dur: p.thumpDur, gain: p.thumpGain * k, type: 'triangle', pan });
    this.noise({ dur: p.noiseDur, freq: p.noiseFreq, freqEnd: p.noiseFreq * 0.35, gain: p.noiseGain * k, q: 0.6, pan });
    if (p.tail) this.noise({ dur: p.tail.dur, freq: p.tail.f * 2, freqEnd: p.tail.f * 0.5, gain: p.tail.gain * k, q: 0.4, pan, delay: 0.02 });
  }

  dryFire() { this.tone({ f0: 900, f1: 500, dur: 0.05, gain: 0.25, type: 'square' }); }

  /** bolt / slide sounds of a reload, 3 stages */
  reload(stage: 0 | 1 | 2) {
    if (stage === 0) {
      this.tone({ f0: 420, f1: 260, dur: 0.07, gain: 0.22, type: 'square' });
      this.noise({ dur: 0.12, freq: 1400, gain: 0.2, q: 1.5, delay: 0.02 });
    } else if (stage === 1) {
      this.tone({ f0: 300, f1: 480, dur: 0.09, gain: 0.25, type: 'square' });
      this.noise({ dur: 0.14, freq: 900, gain: 0.22, q: 1.2 });
    } else {
      this.noise({ dur: 0.1, freq: 2200, gain: 0.3, q: 2 });
      this.tone({ f0: 500, f1: 700, dur: 0.07, gain: 0.3, type: 'square', delay: 0.05 });
    }
  }

  draw() { this.noise({ dur: 0.1, freq: 1800, gain: 0.16, q: 1.6 }); }

  footstep(x: number, z: number, run: boolean, phase: number) {
    const { gain, pan } = this.spatial(x, z);
    const f = run ? 340 : 240;
    this.noise({ dur: 0.075, freq: f + (phase % 2) * 45, freqEnd: f * 0.4, gain: (run ? 0.3 : 0.14) * gain, q: 0.9, pan });
    this.tone({ f0: 90, f1: 55, dur: 0.06, gain: 0.12 * gain, type: 'sine', pan });
  }

  jump() { this.noise({ dur: 0.09, freq: 500, gain: 0.12, q: 1 }); }
  land(x?: number, z?: number) {
    const { gain, pan } = this.spatial(x, z);
    this.tone({ f0: 110, f1: 60, dur: 0.09, gain: 0.3 * gain, type: 'sine', pan });
    this.noise({ dur: 0.1, freq: 380, gain: 0.2 * gain, q: 0.8, pan });
  }

  scopeIn() { this.tone({ f0: 700, f1: 1500, dur: 0.12, gain: 0.16, type: 'sine' }); }
  scopeOut() { this.tone({ f0: 1500, f1: 600, dur: 0.1, gain: 0.13, type: 'sine' }); }

  hitConfirm(headshot: boolean) {
    if (headshot) {
      this.tone({ f0: 1450, f1: 1900, dur: 0.09, gain: 0.3, type: 'square' });
      this.tone({ f0: 2200, dur: 0.05, gain: 0.18, type: 'sine', delay: 0.05 });
    } else {
      this.tone({ f0: 1050, f1: 1250, dur: 0.06, gain: 0.22, type: 'square' });
    }
  }

  /** pain / armour impact on the local player */
  hurt() {
    this.tone({ f0: 220, f1: 120, dur: 0.16, gain: 0.4, type: 'sawtooth' });
    this.noise({ dur: 0.18, freq: 700, gain: 0.3, q: 0.7 });
  }

  /** flesh impact near a position */
  blood(x: number, z: number) {
    const { gain, pan } = this.spatial(x, z);
    this.noise({ dur: 0.09, freq: 480, gain: 0.35 * gain, q: 0.7, pan, playbackRate: 0.7 });
  }

  bulletImpact(x: number, z: number) {
    const { gain, pan } = this.spatial(x, z);
    this.noise({ dur: 0.08, freq: 2600, gain: 0.28 * gain, q: 1.4, pan });
    this.tone({ f0: 1400, f1: 300, dur: 0.05, gain: 0.1 * gain, type: 'square', pan });
  }

  bulletWhizz() { this.noise({ dur: 0.14, freq: 3200, freqEnd: 900, gain: 0.14, q: 2.5, playbackRate: 1.6 }); }

  knifeSwing() { this.noise({ dur: 0.16, freq: 2600, freqEnd: 700, gain: 0.2, q: 2.4, playbackRate: 1.3 }); }
  knifeHit(x?: number, z?: number) {
    const { gain, pan } = this.spatial(x, z);
    this.tone({ f0: 320, f1: 130, dur: 0.12, gain: 0.5 * gain, type: 'triangle', pan });
    this.noise({ dur: 0.1, freq: 900, gain: 0.3 * gain, q: 0.8, pan });
  }

  kill() {
    this.tone({ f0: 620, dur: 0.07, gain: 0.22, type: 'square' });
    this.tone({ f0: 930, dur: 0.1, gain: 0.22, type: 'square', delay: 0.07 });
  }

  plantBeep() { this.tone({ f0: 2100, dur: 0.07, gain: 0.2, type: 'square' }); }
  defuseTick() { this.tone({ f0: 1300, dur: 0.05, gain: 0.16, type: 'square' }); }
  bombPlanted() {
    this.tone({ f0: 1600, dur: 0.1, gain: 0.25, type: 'square' });
    this.tone({ f0: 1600, dur: 0.16, gain: 0.25, type: 'square', delay: 0.16 });
  }
  bombBeep(x: number, z: number, fast: boolean) {
    const { gain, pan } = this.spatial(x, z);
    this.tone({ f0: 2350, dur: fast ? 0.06 : 0.08, gain: 0.3 * gain, type: 'square', pan });
  }
  bombDefused() {
    this.tone({ f0: 900, dur: 0.12, gain: 0.25, type: 'square' });
    this.tone({ f0: 1350, dur: 0.2, gain: 0.25, type: 'square', delay: 0.12 });
  }
  explosion(x: number, z: number) {
    const { gain, pan } = this.spatial(x, z);
    const k = Math.max(0.35, gain);
    this.noise({ dur: 1.4, freq: 900, freqEnd: 60, gain: 1.1 * k, q: 0.3, pan, playbackRate: 0.85 });
    this.tone({ f0: 120, f1: 26, dur: 1.2, gain: 1.0 * k, type: 'sine', pan });
    this.noise({ dur: 0.35, freq: 4000, freqEnd: 300, gain: 0.6 * k, q: 0.5, pan });
  }

  roundStart() {
    this.tone({ f0: 440, dur: 0.12, gain: 0.2, type: 'triangle' });
    this.tone({ f0: 660, dur: 0.16, gain: 0.2, type: 'triangle', delay: 0.13 });
  }
  win() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone({ f0: f, dur: 0.18, gain: 0.22, type: 'triangle', delay: i * 0.12 }));
  }
  lose() {
    [392, 330, 262].forEach((f, i) => this.tone({ f0: f, dur: 0.24, gain: 0.22, type: 'triangle', delay: i * 0.16 }));
  }

  /** UI click */
  ui() { this.tone({ f0: 800, dur: 0.04, gain: 0.12, type: 'square' }); }
}

export const audio = new GameAudio();

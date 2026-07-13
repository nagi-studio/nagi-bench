// Procedural sound via the Web Audio API (no audio files). World sounds are
// attenuated + panned relative to the player listener; the player's own weapon
// plays centered. Everything is short transients synthesized from noise + tones.

import { WeaponId } from './types';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private lx = 0;
  private lz = 0;
  private lyaw = 0;
  muted = false;

  init(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const Ctor: typeof AudioContext =
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ??
      window.AudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
    // one second of white noise, reused everywhere
    const len = this.ctx.sampleRate;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.noise = buf;
  }

  setListener(x: number, z: number, yaw: number): void {
    this.lx = x;
    this.lz = z;
    this.lyaw = yaw;
  }

  private now(): number {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  // Spatial gain + stereo pan for a world position, or null if inaudible.
  private spatial(x: number, z: number, maxDist: number): { gain: number; pan: number } | null {
    const dx = x - this.lx;
    const dz = z - this.lz;
    const dist = Math.hypot(dx, dz);
    if (dist > maxDist) return null;
    const gain = Math.pow(1 - dist / maxDist, 1.6);
    // rotate offset into listener frame; pan by the right-vector component
    const c = Math.cos(this.lyaw);
    const s = Math.sin(this.lyaw);
    // right vector (matches -Z forward, YXZ): (cos, -sin)
    const right = (dx * c - dz * -s) / (dist + 1e-3);
    const pan = Math.max(-1, Math.min(1, right));
    return { gain, pan };
  }

  private out(pan: number): AudioNode {
    const ctx = this.ctx!;
    if (typeof ctx.createStereoPanner === 'function') {
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      p.connect(this.master!);
      return p;
    }
    return this.master!;
  }

  private burst(
    dur: number, type: BiquadFilterType, freq: number, q: number,
    gain: number, pan: number, when = 0,
  ): void {
    if (!this.ctx || !this.noise) return;
    const ctx = this.ctx;
    const t = this.now() + when;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = type;
    filt.frequency.value = freq;
    filt.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt);
    filt.connect(g);
    g.connect(this.out(pan));
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  private tone(
    freq: number, dur: number, type: OscillatorType, gain: number, pan: number,
    when = 0, glideTo?: number,
  ): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t = this.now() + when;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (glideTo !== undefined) osc.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.out(pan));
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  // --- public sound events ---

  gunshot(weapon: WeaponId, x?: number, z?: number): void {
    if (this.muted || !this.ctx) return;
    let sp = { gain: 1, pan: 0 };
    if (x !== undefined && z !== undefined) {
      const s = this.spatial(x, z, 95);
      if (!s) return;
      sp = s;
    }
    const v = sp.gain;
    switch (weapon) {
      case 'ak47':
        this.burst(0.16, 'bandpass', 1400, 0.7, 0.55 * v, sp.pan);
        this.burst(0.09, 'lowpass', 500, 1, 0.5 * v, sp.pan);
        this.tone(120, 0.1, 'sawtooth', 0.25 * v, sp.pan, 0, 60);
        break;
      case 'm4a4':
        this.burst(0.11, 'bandpass', 2100, 0.9, 0.42 * v, sp.pan);
        this.burst(0.06, 'lowpass', 700, 1, 0.35 * v, sp.pan);
        this.tone(160, 0.07, 'square', 0.16 * v, sp.pan, 0, 90);
        break;
      case 'awp':
        this.burst(0.35, 'lowpass', 900, 0.8, 0.7 * v, sp.pan);
        this.burst(0.2, 'bandpass', 1600, 0.6, 0.5 * v, sp.pan);
        this.tone(80, 0.3, 'sawtooth', 0.4 * v, sp.pan, 0, 40);
        break;
      case 'deagle':
        this.burst(0.18, 'bandpass', 1100, 0.7, 0.55 * v, sp.pan);
        this.tone(110, 0.12, 'square', 0.28 * v, sp.pan, 0, 55);
        break;
      case 'glock':
        this.burst(0.08, 'bandpass', 1800, 1, 0.32 * v, sp.pan);
        this.tone(220, 0.05, 'square', 0.12 * v, sp.pan, 0, 130);
        break;
      case 'usp':
        this.burst(0.07, 'bandpass', 1500, 1.2, 0.26 * v, sp.pan);
        this.tone(260, 0.04, 'sine', 0.1 * v, sp.pan, 0, 150);
        break;
      case 'knife':
        this.burst(0.05, 'highpass', 3000, 0.6, 0.25 * v, sp.pan);
        break;
    }
  }

  reload(): void {
    if (this.muted) return;
    this.burst(0.05, 'bandpass', 900, 2, 0.25, 0, 0.0);
    this.burst(0.05, 'bandpass', 1400, 2, 0.22, 0, 0.35);
    this.tone(500, 0.03, 'square', 0.12, 0, 0.7);
  }

  footstep(x?: number, z?: number): void {
    if (this.muted || !this.ctx) return;
    let sp = { gain: 0.5, pan: 0 };
    if (x !== undefined && z !== undefined) {
      const s = this.spatial(x, z, 20);
      if (!s) return;
      sp = s;
    }
    this.burst(0.07, 'lowpass', 380, 1.2, 0.18 * sp.gain, sp.pan);
  }

  scope(on: boolean): void {
    if (this.muted) return;
    this.tone(on ? 700 : 500, 0.05, 'sine', 0.14, 0);
    this.tone(on ? 900 : 400, 0.05, 'sine', 0.1, 0, 0.04);
  }

  hitmarker(): void {
    if (this.muted) return;
    this.tone(1400, 0.05, 'square', 0.16, 0);
  }

  kill(): void {
    if (this.muted) return;
    this.tone(880, 0.08, 'square', 0.2, 0);
    this.tone(1320, 0.1, 'square', 0.2, 0, 0.08);
  }

  bombBeep(x?: number, z?: number): void {
    if (this.muted) return;
    let sp = { gain: 0.6, pan: 0 };
    if (x !== undefined && z !== undefined) {
      const s = this.spatial(x, z, 45);
      if (!s) return;
      sp = s;
    }
    this.tone(2000, 0.06, 'sine', 0.18 * sp.gain, sp.pan);
  }

  plantTick(): void {
    if (this.muted) return;
    this.tone(1200, 0.03, 'square', 0.12, 0);
  }

  defuseTick(): void {
    if (this.muted) return;
    this.burst(0.04, 'bandpass', 700, 3, 0.14, 0);
  }

  explode(x?: number, z?: number): void {
    if (this.muted || !this.ctx) return;
    let sp = { gain: 1, pan: 0 };
    if (x !== undefined && z !== undefined) {
      const s = this.spatial(x, z, 140);
      if (!s) return;
      sp = s;
    }
    const v = sp.gain;
    this.burst(0.9, 'lowpass', 400, 0.7, 0.9 * v, sp.pan);
    this.burst(0.5, 'bandpass', 900, 0.5, 0.6 * v, sp.pan);
    this.tone(60, 0.8, 'sawtooth', 0.6 * v, sp.pan, 0, 30);
  }
}

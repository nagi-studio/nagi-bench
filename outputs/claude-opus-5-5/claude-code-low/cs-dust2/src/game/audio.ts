/**
 * Procedural sound synthesis with the Web Audio API. No audio files are used.
 * Sounds positioned in the world are attenuated by distance and panned relative to the listener.
 */
import type { SoundProfile } from './weapons';

interface Listener {
  x: number;
  z: number;
  yaw: number;
}

export class AudioEngine {
  ctx: AudioContext | null = null;
  master!: GainNode;
  noise!: AudioBuffer;
  listener: Listener = { x: 0, z: 0, yaw: 0 };
  volume = 0.6;

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.ratio.value = 4;
    this.master.connect(comp).connect(this.ctx.destination);
    const len = this.ctx.sampleRate * 2;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }

  /** returns an output node for a sound at world position (or null = 2D/UI sound) */
  private out(pos?: { x: number; z: number }, gain = 1): AudioNode | null {
    const ctx = this.ctx;
    if (!ctx) return null;
    const g = ctx.createGain();
    let vol = gain;
    let pan = 0;
    if (pos) {
      const dx = pos.x - this.listener.x;
      const dz = pos.z - this.listener.z;
      const dist = Math.hypot(dx, dz);
      vol *= 1 / (1 + dist * 0.06);
      if (vol < 0.01) return null;
      // listener forward = (-sin yaw, -cos yaw); right = (cos yaw, -sin yaw)
      const rx = Math.cos(this.listener.yaw), rz = -Math.sin(this.listener.yaw);
      pan = dist > 0.5 ? Math.max(-1, Math.min(1, (dx * rx + dz * rz) / dist)) * 0.8 : 0;
    }
    g.gain.value = vol;
    if (ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      g.connect(p).connect(this.master);
    } else g.connect(this.master);
    return g;
  }

  private noiseBurst(dest: AudioNode, t: number, dur: number, type: BiquadFilterType, freq: number, q: number, peak: number, freqEnd?: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(dest);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.05);
  }

  private tone(dest: AudioNode, t: number, dur: number, type: OscillatorType, f0: number, f1: number, peak: number, attack = 0.005) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  shot(profile: SoundProfile, pos?: { x: number; z: number }) {
    const dest = this.out(pos, 1);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    switch (profile) {
      case 'ak': // heavy, low crack with long-ish body
        this.noiseBurst(dest, t, 0.22, 'lowpass', 2400, 0.8, 0.9, 400);
        this.tone(dest, t, 0.16, 'sawtooth', 160, 45, 0.5);
        this.noiseBurst(dest, t, 0.05, 'highpass', 3000, 0.7, 0.5);
        break;
      case 'm4': // tighter, higher, quicker
        this.noiseBurst(dest, t, 0.13, 'bandpass', 1800, 0.9, 0.75, 700);
        this.tone(dest, t, 0.09, 'square', 220, 80, 0.25);
        this.noiseBurst(dest, t, 0.04, 'highpass', 4500, 0.7, 0.4);
        break;
      case 'awp': // huge boom with tail
        this.noiseBurst(dest, t, 0.7, 'lowpass', 3000, 0.6, 1.0, 120);
        this.tone(dest, t, 0.5, 'sine', 110, 30, 0.9);
        this.tone(dest, t, 0.08, 'sawtooth', 600, 100, 0.4);
        this.noiseBurst(dest, t + 0.08, 0.9, 'lowpass', 700, 0.4, 0.25, 100);
        break;
      case 'deagle':
        this.noiseBurst(dest, t, 0.28, 'lowpass', 2600, 0.8, 0.9, 300);
        this.tone(dest, t, 0.18, 'triangle', 200, 50, 0.6);
        break;
      case 'pistol':
        this.noiseBurst(dest, t, 0.09, 'bandpass', 2500, 1.1, 0.6, 900);
        this.tone(dest, t, 0.06, 'square', 380, 150, 0.15);
        break;
      case 'knife':
        this.noiseBurst(dest, t, 0.18, 'bandpass', 3000, 2, 0.3, 6000);
        break;
    }
  }

  reload(pos?: { x: number; z: number }) {
    const dest = this.out(pos, 0.6);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    // mag out click, mag in clack, bolt
    this.noiseBurst(dest, t + 0.05, 0.05, 'bandpass', 2200, 4, 0.5);
    this.tone(dest, t + 0.05, 0.04, 'square', 900, 500, 0.12);
    this.noiseBurst(dest, t + 0.75, 0.07, 'bandpass', 1400, 3, 0.6);
    this.tone(dest, t + 0.75, 0.05, 'square', 600, 300, 0.15);
    this.noiseBurst(dest, t + 1.3, 0.09, 'highpass', 2500, 2, 0.5);
    this.tone(dest, t + 1.32, 0.06, 'triangle', 1200, 700, 0.2);
  }

  dryFire() {
    const dest = this.out(undefined, 0.4);
    if (!dest) return;
    this.tone(dest, this.ctx!.currentTime, 0.04, 'square', 1500, 900, 0.2);
  }

  footstep(pos?: { x: number; z: number }, loud = 1) {
    const dest = this.out(pos, 0.35 * loud);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.noiseBurst(dest, t, 0.09, 'lowpass', 500 + Math.random() * 300, 1, 0.8, 150);
    this.noiseBurst(dest, t + 0.01, 0.05, 'bandpass', 2500, 1.5, 0.12);
  }

  land() {
    const dest = this.out(undefined, 0.5);
    if (!dest) return;
    this.noiseBurst(dest, this.ctx!.currentTime, 0.15, 'lowpass', 400, 1, 0.9, 80);
  }

  scope() {
    const dest = this.out(undefined, 0.5);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.tone(dest, t, 0.05, 'square', 2400, 1800, 0.12);
    this.noiseBurst(dest, t, 0.06, 'highpass', 5000, 1, 0.2);
  }

  switchWeapon() {
    const dest = this.out(undefined, 0.4);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.noiseBurst(dest, t, 0.08, 'bandpass', 1800, 3, 0.4);
    this.tone(dest, t + 0.08, 0.04, 'square', 800, 500, 0.08);
  }

  hit(headshot: boolean) {
    const dest = this.out(undefined, 0.6);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    if (headshot) {
      this.tone(dest, t, 0.12, 'triangle', 2200, 1800, 0.5);
      this.noiseBurst(dest, t, 0.06, 'highpass', 6000, 1, 0.4);
    } else {
      this.tone(dest, t, 0.06, 'sine', 900, 500, 0.4);
      this.noiseBurst(dest, t, 0.05, 'lowpass', 1200, 1, 0.4);
    }
  }

  hurt() {
    const dest = this.out(undefined, 0.6);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.noiseBurst(dest, t, 0.12, 'lowpass', 900, 1, 0.8, 200);
    this.tone(dest, t, 0.12, 'sine', 180, 90, 0.4);
  }

  kill() {
    const dest = this.out(undefined, 0.6);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.tone(dest, t, 0.1, 'triangle', 880, 880, 0.35);
    this.tone(dest, t + 0.09, 0.18, 'triangle', 1320, 1320, 0.35);
  }

  bombBeep(pos?: { x: number; z: number }, urgency = 0) {
    const dest = this.out(pos, 0.5);
    if (!dest) return;
    this.tone(dest, this.ctx!.currentTime, 0.09, 'sine', 2600 + urgency * 600, 2600 + urgency * 600, 0.4);
  }

  plantTick() {
    const dest = this.out(undefined, 0.35);
    if (!dest) return;
    this.tone(dest, this.ctx!.currentTime, 0.05, 'square', 1200 + Math.random() * 400, 1000, 0.15);
  }

  planted() {
    const dest = this.out(undefined, 0.7);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.tone(dest, t, 0.15, 'sine', 1800, 1800, 0.4);
    this.tone(dest, t + 0.18, 0.15, 'sine', 1800, 1800, 0.4);
    this.tone(dest, t + 0.36, 0.3, 'sine', 2400, 2400, 0.4);
  }

  defuseTick() {
    const dest = this.out(undefined, 0.3);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.noiseBurst(dest, t, 0.04, 'bandpass', 3500, 6, 0.4);
  }

  defused() {
    const dest = this.out(undefined, 0.7);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.tone(dest, t, 0.4, 'sine', 1200, 300, 0.4);
    this.noiseBurst(dest, t, 0.1, 'bandpass', 2000, 4, 0.5);
  }

  explosion(pos?: { x: number; z: number }) {
    const dest = this.out(pos, 3);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.noiseBurst(dest, t, 2.5, 'lowpass', 1800, 0.5, 1.0, 40);
    this.tone(dest, t, 1.8, 'sine', 80, 20, 1.0, 0.01);
    this.noiseBurst(dest, t + 0.15, 3.0, 'lowpass', 400, 0.3, 0.6, 30);
  }

  roundStart() {
    const dest = this.out(undefined, 0.4);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    [523, 659, 784].forEach((f, i) => this.tone(dest, t + i * 0.1, 0.2, 'triangle', f, f, 0.3));
  }

  roundEnd(win: boolean) {
    const dest = this.out(undefined, 0.5);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    const seq = win ? [523, 659, 784, 1046] : [523, 466, 392, 311];
    seq.forEach((f, i) => this.tone(dest, t + i * 0.14, 0.3, 'triangle', f, f, 0.35));
  }
}

export const audio = new AudioEngine();

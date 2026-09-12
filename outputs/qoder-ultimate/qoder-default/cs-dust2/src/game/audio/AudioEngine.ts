import { WeaponId } from '../types';

/** Procedural Web Audio synthesis — no external audio files. */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private noiseBuffer!: AudioBuffer;

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
    // white noise buffer for gunshots / steps
    const len = this.ctx.sampleRate * 1.0;
    this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  resume() {
    this.ctx?.resume();
  }

  private now() {
    return this.ctx!.currentTime;
  }

  private noise(dur: number, gain: number, filterFreq: number, q = 1) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = filterFreq;
    filt.Q.value = q;
    const g = ctx.createGain();
    const t = this.now();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt);
    filt.connect(g);
    g.connect(this.master);
    src.start(t);
    src.stop(t + dur);
  }

  private tone(
    freq: number,
    dur: number,
    gain: number,
    type: OscillatorType = 'sine',
    slideTo?: number
  ) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = type;
    const g = ctx.createGain();
    const t = this.now();
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + dur);
  }

  /** distance attenuation factor */
  private atten(dist: number) {
    return Math.max(0.05, Math.min(1, 1 - dist / 90));
  }

  gunshot(weapon: WeaponId, dist = 0) {
    if (!this.ctx) return;
    const a = this.atten(dist);
    switch (weapon) {
      case 'ak47':
        this.noise(0.18, 0.9 * a, 1800, 1.2);
        this.tone(90, 0.16, 0.7 * a, 'square', 45);
        break;
      case 'm4a4':
        this.noise(0.12, 0.6 * a, 2600, 1);
        this.tone(140, 0.1, 0.4 * a, 'square', 70);
        break;
      case 'awp':
        this.noise(0.4, 1.0 * a, 1400, 2);
        this.tone(70, 0.35, 0.9 * a, 'sawtooth', 30);
        break;
      case 'deagle':
        this.noise(0.2, 0.85 * a, 1600, 1.5);
        this.tone(110, 0.15, 0.6 * a, 'square', 55);
        break;
      case 'glock':
      case 'usp':
        this.noise(0.08, 0.45 * a, 3000, 1);
        this.tone(200, 0.06, 0.3 * a, 'square', 120);
        break;
      case 'knife':
        this.noise(0.06, 0.3 * a, 5000, 3);
        break;
    }
  }

  reload() {
    if (!this.ctx) return;
    this.tone(320, 0.05, 0.25, 'square');
    setTimeout(() => this.tone(180, 0.06, 0.25, 'square'), 180);
    setTimeout(() => this.tone(420, 0.05, 0.22, 'square'), 420);
  }

  footstep(dist = 0) {
    if (!this.ctx) return;
    this.noise(0.06, 0.22 * this.atten(dist), 700, 0.7);
  }

  scope() {
    if (!this.ctx) return;
    this.tone(880, 0.04, 0.15, 'sine');
    setTimeout(() => this.tone(1200, 0.04, 0.12, 'sine'), 45);
  }

  hit(headshot = false) {
    if (!this.ctx) return;
    if (headshot) {
      this.tone(1400, 0.05, 0.3, 'square', 900);
    } else {
      this.tone(600, 0.05, 0.2, 'square', 400);
    }
  }

  hurt() {
    if (!this.ctx) return;
    this.noise(0.12, 0.3, 500, 1);
    this.tone(180, 0.12, 0.2, 'sawtooth', 90);
  }

  bombPlant() {
    if (!this.ctx) return;
    this.tone(500, 0.08, 0.3, 'square');
    setTimeout(() => this.tone(300, 0.1, 0.3, 'square'), 120);
  }

  bombBeep() {
    if (!this.ctx) return;
    this.tone(1800, 0.06, 0.25, 'sine');
  }

  bombDefuseTick() {
    if (!this.ctx) return;
    this.tone(700, 0.05, 0.15, 'triangle');
  }

  bombExplode(dist = 0) {
    if (!this.ctx) return;
    const a = this.atten(dist);
    this.noise(1.2, 1.0 * a, 400, 0.5);
    this.tone(60, 1.0, 0.9 * a, 'sawtooth', 20);
    this.tone(120, 0.6, 0.6 * a, 'square', 30);
  }

  kill() {
    if (!this.ctx) return;
    this.tone(880, 0.08, 0.25, 'square', 1320);
  }

  roundWin(win: boolean) {
    if (!this.ctx) return;
    const base = win ? 523 : 330;
    this.tone(base, 0.15, 0.3, 'square');
    setTimeout(() => this.tone(base * 1.25, 0.2, 0.3, 'square'), 160);
  }
}

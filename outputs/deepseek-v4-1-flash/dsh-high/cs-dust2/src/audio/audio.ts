import { clamp } from '../core/math';

type Ctx = AudioContext;

/**
 * All game audio is synthesised at runtime with the Web Audio API.
 * No external audio files are used.
 */
export class SoundEngine {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private volume = 0.55;
  private lastFootstep = 0;

  unlock() {
    if (!this.ctx) {
      const AC: typeof AudioContext =
        (window as unknown as { AudioContext: typeof AudioContext }).AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
      const len = Math.floor(this.ctx.sampleRate * 1.5);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  setVolume(v: number) {
    this.volume = clamp(v, 0, 1);
    if (this.master) this.master.gain.value = this.volume;
  }

  get ready(): boolean {
    return !!this.ctx && !!this.master;
  }

  private noise(dur: number, type: BiquadFilterType, freq: number, gain: number, q = 0.7, when = 0) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf!;
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = type;
    filt.frequency.value = freq;
    filt.Q.value = q;
    const g = ctx.createGain();
    const t = ctx.currentTime + when;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt).connect(g).connect(this.master!);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  private tone(
    freq: number,
    dur: number,
    gain: number,
    type: OscillatorType = 'sine',
    when = 0,
    slideTo?: number,
  ) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = type;
    const g = ctx.createGain();
    const t = ctx.currentTime + when;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  shot(kind: string) {
    if (!this.ready) return;
    switch (kind) {
      case 'rifle':
        this.noise(0.16, 'bandpass', 1100, 0.7, 0.6);
        this.noise(0.09, 'highpass', 3200, 0.45);
        this.tone(150, 0.12, 0.5, 'square', 0, 60);
        break;
      case 'sniper':
        this.noise(0.4, 'bandpass', 700, 0.9, 0.5);
        this.noise(0.2, 'highpass', 2500, 0.6);
        this.tone(90, 0.35, 0.7, 'square', 0, 40);
        break;
      case 'pistol':
        this.noise(0.1, 'bandpass', 1800, 0.5, 0.9);
        this.tone(220, 0.08, 0.35, 'square', 0, 90);
        break;
      case 'deagle':
        this.noise(0.2, 'bandpass', 900, 0.75, 0.6);
        this.tone(110, 0.18, 0.6, 'square', 0, 45);
        break;
      default:
        this.noise(0.12, 'bandpass', 1400, 0.6);
    }
  }

  knife() {
    if (!this.ready) return;
    this.noise(0.12, 'highpass', 4000, 0.3);
    this.tone(2600, 0.1, 0.18, 'triangle', 0, 1200);
  }

  emptyClick() {
    if (!this.ready) return;
    this.tone(1400, 0.04, 0.25, 'square');
    this.noise(0.03, 'highpass', 3000, 0.15);
  }

  reload() {
    if (!this.ready) return;
    this.tone(320, 0.05, 0.25, 'square', 0.02);
    this.noise(0.05, 'bandpass', 1800, 0.2, 1.5, 0.12);
    this.tone(240, 0.06, 0.28, 'square', 0.45);
    this.noise(0.06, 'bandpass', 1200, 0.25, 1.5, 0.7);
  }

  footstep() {
    if (!this.ready) return;
    const now = this.ctx!.currentTime;
    if (now - this.lastFootstep < 0.22) return;
    this.lastFootstep = now;
    this.noise(0.07, 'lowpass', 520, 0.22, 0.8);
  }

  jump() {
    if (!this.ready) return;
    this.noise(0.09, 'lowpass', 700, 0.18);
  }

  zoom() {
    if (!this.ready) return;
    this.tone(900, 0.06, 0.22, 'sine', 0, 1500);
    this.noise(0.04, 'highpass', 2500, 0.12);
  }

  hit(region: string, armored: boolean) {
    if (!this.ready) return;
    if (region === 'head') {
      this.tone(1500, 0.09, 0.4, 'sine', 0, 2300);
      this.tone(900, 0.12, 0.25, 'triangle');
    } else {
      this.tone(armored ? 620 : 900, 0.06, 0.3, 'sine');
      this.noise(0.05, 'bandpass', armored ? 2600 : 1800, 0.2);
    }
  }

  kill() {
    if (!this.ready) return;
    this.tone(880, 0.09, 0.3, 'triangle');
    this.tone(1320, 0.12, 0.3, 'triangle', 0.09);
  }

  plantTick() {
    if (!this.ready) return;
    this.tone(1800, 0.05, 0.3, 'square');
  }

  planted() {
    if (!this.ready) return;
    this.tone(1200, 0.1, 0.35, 'square');
    this.tone(1600, 0.12, 0.35, 'square', 0.12);
  }

  defuseTick() {
    if (!this.ready) return;
    this.noise(0.05, 'bandpass', 900, 0.18, 2);
    this.tone(400, 0.05, 0.15, 'sawtooth');
  }

  defused() {
    if (!this.ready) return;
    this.tone(700, 0.12, 0.3, 'sine');
    this.tone(1050, 0.2, 0.3, 'sine', 0.12);
  }

  explosion() {
    if (!this.ready) return;
    this.noise(1.1, 'lowpass', 400, 1.0, 0.4);
    this.noise(0.5, 'highpass', 1800, 0.5);
    this.tone(70, 0.9, 0.9, 'sawtooth', 0, 28);
    this.tone(45, 1.1, 0.8, 'sine', 0.05, 22);
  }

  win(ct: boolean) {
    if (!this.ready) return;
    const base = ct ? 520 : 380;
    this.tone(base, 0.16, 0.3, 'square');
    this.tone(base * 1.25, 0.16, 0.3, 'square', 0.16);
    this.tone(base * 1.5, 0.28, 0.3, 'square', 0.32);
  }
}

export const sound = new SoundEngine();

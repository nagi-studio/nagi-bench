// Web Audio 程序化音效合成（无外部音频文件）
import { WeaponId } from './config';

export interface SoundApi {
  init(): void;
  setListener(x: number, y: number, z: number, yaw: number, pitch: number): void;
  shot(weapon: WeaponId, x: number, y: number, z: number): void;
  reload(type: 'rifle' | 'pistol' | 'awp'): void;
  footstep(x: number, y: number, z: number, run: boolean): void;
  scope(on: boolean): void;
  hit(headshot: boolean): void;
  kill(): void;
  plantTick(): void;
  plantDone(): void;
  defuseTick(): void;
  defused(): void;
  explode(x: number, y: number, z: number): void;
  roundStart(): void;
  roundEnd(win: boolean): void;
  pickup(): void;
  switchW(): void;
  door(): void;
  hurt(): void;
  beep(): void;
}

export class SoundManager implements SoundApi {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private lx = 0; private ly = 0; private lz = 0; private lyaw = 0; private lpitch = 0;
  private panners: PannerNode[] = [];
  private pannerIdx = 0;

  init(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);
    // 噪声缓冲
    const len = this.ctx.sampleRate;
    this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  setListener(x: number, y: number, z: number, yaw: number, pitch: number): void {
    this.lx = x; this.ly = y; this.lz = z; this.lyaw = yaw; this.lpitch = pitch;
    if (!this.ctx) return;
    const l = this.ctx.listener as AudioListener & {
      setPosition?: (x: number, y: number, z: number) => void;
      setOrientation?: (fx: number, fy: number, fz: number, ux: number, uy: number, uz: number) => void;
    };
    if (typeof l.setPosition === 'function') {
      l.setPosition(x, y, z);
      l.setOrientation(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch), 0, 1, 0);
    } else {
      l.positionX.value = x; l.positionY.value = y; l.positionZ.value = z;
      const fx = -Math.sin(yaw) * Math.cos(pitch);
      const fy = Math.sin(pitch);
      const fz = -Math.cos(yaw) * Math.cos(pitch);
      l.forwardX.value = fx; l.forwardY.value = fy; l.forwardZ.value = fz;
      l.upX.value = 0; l.upY.value = 1; l.upZ.value = 0;
    }
  }

  private pan(x: number, y: number, z: number): GainNode {
    const out = this.ctx!.createGain();
    const dx = x - this.lx, dy = y - this.ly, dz = z - this.lz;
    const dist = Math.hypot(dx, dy, dz);
    const vol = Math.max(0.04, 1 / (1 + dist * 0.09));
    out.gain.value = vol;
    {
      const p = this.ctx!.createPanner();
      p.panningModel = 'HRTF' as PanningModelType;
      p.distanceModel = 'linear';
      p.refDistance = 4;
      p.maxDistance = 80;
      p.rolloffFactor = 1;
      p.positionX.value = x; p.positionY.value = y; p.positionZ.value = z;
      out.connect(p);
      p.connect(this.master!);
    }
    return out;
  }

  private noise(dur: number, freq: number, type: BiquadFilterType, gain: number, dest?: AudioNode, when = 0): void {
    if (!this.ctx || !this.noiseBuf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime + when;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f); f.connect(g); g.connect(dest ?? this.master!);
    src.start(t, Math.random());
    src.stop(t + dur + 0.05);
  }

  private tone(freq: number, dur: number, type: OscillatorType, gain: number, dest?: AudioNode, when = 0, slide = 0): void {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    o.type = type;
    const t = this.ctx.currentTime + when;
    o.frequency.setValueAtTime(freq, t);
    if (slide !== 0) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(dest ?? this.master!);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  shot(weapon: WeaponId, x: number, y: number, z: number): void {
    if (!this.ctx) return;
    const out = this.pan(x, y, z);
    const near = Math.hypot(x - this.lx, y - this.ly, z - this.lz) < 8;
    const boost = near ? 1.6 : 1;
    switch (weapon) {
      case 'ak47':
        this.noise(0.16, 900, 'lowpass', 1.1 * boost, out);
        this.tone(95, 0.13, 'square', 0.55 * boost, out, 0, -45);
        this.tone(160, 0.1, 'sawtooth', 0.3 * boost, out);
        break;
      case 'm4a4':
        this.noise(0.12, 1400, 'lowpass', 0.9 * boost, out);
        this.tone(130, 0.09, 'square', 0.4 * boost, out, 0, -30);
        break;
      case 'awp':
        this.noise(0.5, 700, 'lowpass', 1.4 * boost, out);
        this.tone(55, 0.45, 'sine', 1.1 * boost, out, 0, -25);
        this.tone(220, 0.25, 'sawtooth', 0.3 * boost, out);
        break;
      case 'deagle':
        this.noise(0.16, 1100, 'lowpass', 0.95 * boost, out);
        this.tone(110, 0.12, 'square', 0.5 * boost, out, 0, -40);
        break;
      case 'glock':
      case 'usp':
        this.noise(0.1, 1900, 'lowpass', 0.7 * boost, out);
        this.tone(280, 0.07, 'square', 0.3 * boost, out);
        break;
      case 'knife':
        this.noise(0.14, 2600, 'bandpass', 0.3, out);
        break;
    }
  }

  reload(type: 'rifle' | 'pistol' | 'awp'): void {
    if (!this.ctx) return;
    if (type === 'pistol') {
      this.noise(0.06, 2200, 'bandpass', 0.4, undefined, 0);
      this.noise(0.06, 2600, 'bandpass', 0.5, undefined, 0.5);
      this.noise(0.07, 2000, 'bandpass', 0.4, undefined, 0.9);
    } else if (type === 'rifle') {
      this.noise(0.07, 1800, 'bandpass', 0.5, undefined, 0);
      this.noise(0.07, 2000, 'bandpass', 0.55, undefined, 0.55);
      this.noise(0.09, 1600, 'bandpass', 0.5, undefined, 1.1);
      this.tone(400, 0.05, 'square', 0.15, undefined, 1.35);
    } else {
      this.noise(0.08, 1500, 'bandpass', 0.5, undefined, 0);
      this.noise(0.08, 1700, 'bandpass', 0.55, undefined, 0.7);
      this.noise(0.1, 1400, 'bandpass', 0.5, undefined, 1.4);
      this.tone(300, 0.06, 'square', 0.18, undefined, 1.75);
    }
  }

  footstep(x: number, y: number, z: number, run: boolean): void {
    if (!this.ctx) return;
    const d = Math.hypot(x - this.lx, y - this.ly, z - this.lz);
    if (d > 22) return;
    const out = this.pan(x, y, z);
    this.noise(0.07, run ? 700 : 480, 'lowpass', run ? 0.5 : 0.34, out);
    this.tone(run ? 95 : 80, 0.06, 'sine', 0.35, out);
  }

  scope(on: boolean): void {
    if (!this.ctx) return;
    if (on) {
      this.noise(0.05, 3000, 'highpass', 0.35);
      this.tone(900, 0.04, 'sine', 0.2);
    } else {
      this.noise(0.04, 2400, 'highpass', 0.3);
    }
  }

  hit(headshot: boolean): void {
    if (!this.ctx) return;
    this.tone(headshot ? 1500 : 1100, 0.06, 'square', 0.28);
    this.noise(0.04, 3200, 'highpass', 0.25);
  }

  kill(): void {
    if (!this.ctx) return;
    this.tone(880, 0.09, 'sine', 0.3);
    this.tone(1320, 0.14, 'sine', 0.28, undefined, 0.07);
  }

  plantTick(): void {
    this.tone(1200, 0.05, 'square', 0.22);
  }

  plantDone(): void {
    this.tone(600, 0.1, 'square', 0.3);
    this.tone(900, 0.16, 'square', 0.3, undefined, 0.1);
  }

  defuseTick(): void {
    this.tone(1500, 0.05, 'sine', 0.22);
  }

  defused(): void {
    this.tone(1000, 0.1, 'sine', 0.3);
    this.tone(1400, 0.2, 'sine', 0.3, undefined, 0.1);
  }

  explode(x: number, y: number, z: number): void {
    if (!this.ctx) return;
    const out = this.pan(x, y, z);
    this.noise(1.6, 400, 'lowpass', 1.5, out);
    this.tone(40, 1.3, 'sine', 1.2, out, 0, -20);
  }

  roundStart(): void {
    this.tone(520, 0.12, 'square', 0.25);
    this.tone(780, 0.2, 'square', 0.25, undefined, 0.13);
  }

  roundEnd(win: boolean): void {
    const base = win ? 660 : 330;
    this.tone(base, 0.18, 'square', 0.28);
    this.tone(base * 1.5, 0.3, 'square', 0.26, undefined, 0.18);
  }

  pickup(): void {
    this.tone(700, 0.07, 'square', 0.25);
    this.tone(1050, 0.1, 'square', 0.22, undefined, 0.06);
  }

  switchW(): void {
    this.noise(0.05, 1800, 'bandpass', 0.3);
  }

  door(): void {
    this.noise(0.3, 500, 'lowpass', 0.4);
  }

  /** C4 滴声 */
  beep(): void {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'square';
    o.frequency.value = 1180;
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.1);
  }

  hurt(): void {
    this.tone(180, 0.12, 'sawtooth', 0.3);
    this.noise(0.1, 800, 'lowpass', 0.25);
  }
}

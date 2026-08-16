// ============================================================================
// 程序化音效引擎 —— Web Audio API 合成全部声音，无任何外部音频文件
// ============================================================================
import type { WeaponId } from './types';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private ambient: AudioBufferSourceNode | null = null;
  private activeCount = 0;

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);
    // 预生成白噪声缓冲
    const len = this.ctx.sampleRate * 1.5;
    this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.startAmbient();
  }

  private startAmbient() {
    if (!this.ctx || !this.master || !this.noiseBuf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 320;
    const g = this.ctx.createGain();
    g.gain.value = 0.05;
    src.connect(filt).connect(g).connect(this.master);
    src.start();
    this.ambient = src;
  }

  /** 距离衰减 + 立体声方位 */
  private spatial(pan: number, dist: number, vol = 1): GainNode | null {
    if (!this.ctx || !this.master) return null;
    const gain = this.ctx.createGain();
    const d = Math.max(0, dist);
    const att = 1 / (1 + d * 0.16);
    gain.gain.value = Math.min(1.4, vol * att);
    let out: AudioNode = gain;
    const ac = this.ctx;
    if (ac.createStereoPanner) {
      const p = ac.createStereoPanner();
      p.pan.value = Math.max(-0.9, Math.min(0.9, pan));
      gain.connect(p);
      out = p;
    }
    out.connect(this.master);
    return gain;
  }

  private noise(duration: number, filterType: BiquadFilterType, freq: number, freqEnd: number, vol: number, when = 0): void {
    if (!this.ctx || !this.master || !this.noiseBuf) return;
    if (this.activeCount > 22) return;
    this.activeCount++;
    const t0 = this.ctx.currentTime + when;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    src.playbackRate.value = 0.9 + Math.random() * 0.2;
    const filt = this.ctx.createBiquadFilter();
    filt.type = filterType;
    filt.frequency.setValueAtTime(freq, t0);
    filt.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), t0 + duration);
    filt.Q.value = 0.8;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    src.connect(filt).connect(g).connect(this.master);
    src.start(t0);
    src.stop(t0 + duration + 0.05);
    const self = this;
    setTimeout(() => self.activeCount--, (duration + 0.1) * 1000);
  }

  private tone(type: OscillatorType, freq: number, freqEnd: number, duration: number, vol: number, when = 0, pan = 0, dist = 0): void {
    if (!this.ctx || !this.master) return;
    if (this.activeCount > 22) return;
    this.activeCount++;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t0 + duration);
    const g = this.spatial(pan, dist, vol);
    if (!g) return;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
    const self = this;
    setTimeout(() => self.activeCount--, (duration + 0.1) * 1000);
  }

  // ---------------- 武器开火 ----------------
  shot(id: WeaponId, pan = 0, dist = 0) {
    if (!this.ctx) return;
    switch (id) {
      case 'ak47':
        this.noise(0.16, 'lowpass', 3800, 500, 0.9);
        this.tone('square', 170, 60, 0.12, 0.28, 0, pan, dist);
        break;
      case 'm4a4':
        this.noise(0.1, 'lowpass', 5200, 800, 0.75);
        this.tone('square', 230, 90, 0.08, 0.2, 0, pan, dist);
        break;
      case 'awp':
        this.noise(0.4, 'lowpass', 1800, 120, 1.0);
        this.tone('sine', 120, 32, 0.4, 0.8, 0, pan, dist);
        this.noise(0.15, 'highpass', 6000, 3000, 0.3);
        break;
      case 'glock':
        this.noise(0.07, 'highpass', 1400, 500, 0.5);
        this.tone('square', 330, 180, 0.06, 0.16, 0, pan, dist);
        break;
      case 'usp':
        this.noise(0.06, 'highpass', 1800, 700, 0.42);
        this.tone('square', 380, 220, 0.05, 0.13, 0, pan, dist);
        break;
      case 'deagle':
        this.noise(0.13, 'lowpass', 2600, 300, 0.8);
        this.tone('sine', 200, 70, 0.1, 0.4, 0, pan, dist);
        break;
      case 'knife':
        this.noise(0.09, 'bandpass', 2400, 900, 0.25);
        break;
      default:
        break;
    }
  }

  reload() {
    if (!this.ctx) return;
    this.noise(0.03, 'highpass', 3000, 1500, 0.2);
    this.tone('square', 900, 500, 0.03, 0.12, 0.18);
    this.noise(0.04, 'highpass', 2500, 1200, 0.22, 0.45);
    this.tone('square', 600, 900, 0.05, 0.16, 0.75);
  }

  zoom(inZoom: boolean) {
    this.noise(0.035, 'highpass', 4200, 2000, 0.28);
    this.tone('sine', inZoom ? 1400 : 1000, inZoom ? 900 : 1500, 0.04, 0.1);
  }

  footstep(run: boolean, pan = 0, dist = 0) {
    const f = run ? 260 : 200;
    this.noise(0.055, 'lowpass', f, f * 0.5, run ? 0.3 : 0.16);
    if (dist < 0.01) this.tone('sine', 90, 50, 0.05, 0.1, 0, pan, dist);
  }

  hit(armored: boolean, headshot: boolean) {
    this.tone('sine', headshot ? 2100 : 1200, headshot ? 1600 : 900, 0.05, headshot ? 0.3 : 0.2);
    if (armored) this.tone('square', 500, 300, 0.04, 0.15);
  }

  killConfirm() {
    this.tone('sine', 880, 880, 0.09, 0.25);
    this.tone('sine', 1320, 1320, 0.12, 0.22, 0.09);
  }

  damaged() {
    this.tone('sine', 160, 90, 0.12, 0.4);
    this.noise(0.08, 'lowpass', 800, 200, 0.2);
  }

  plant() {
    this.tone('square', 700, 500, 0.06, 0.2);
    this.tone('square', 700, 500, 0.06, 0.2, 0.12);
    this.noise(0.05, 'highpass', 3000, 1500, 0.15, 0.24);
  }

  plantTick() { this.tone('square', 1800, 1800, 0.035, 0.12); }
  defuseTick() { this.tone('square', 2400, 2400, 0.035, 0.12); }
  defuseDone() { this.tone('sine', 700, 1400, 0.18, 0.25); this.tone('sine', 1400, 700, 0.18, 0.2, 0.1); }

  explosion(pan = 0, dist = 0) {
    this.noise(1.6, 'lowpass', 900, 60, 1.1);
    this.tone('sine', 70, 24, 1.4, 0.9, 0, pan, dist);
    this.noise(0.5, 'highpass', 5000, 1000, 0.4);
  }

  pickup() { this.tone('square', 500, 800, 0.05, 0.15); }
  ui() { this.tone('square', 800, 600, 0.04, 0.12); }
  roundStart() { this.tone('sine', 660, 660, 0.1, 0.2); this.tone('sine', 880, 880, 0.14, 0.2, 0.12); }
  roundWin(win: boolean) {
    if (win) { this.tone('sine', 523, 523, 0.12, 0.22); this.tone('sine', 659, 659, 0.12, 0.22, 0.13); this.tone('sine', 784, 784, 0.2, 0.24, 0.26); }
    else { this.tone('sine', 392, 392, 0.12, 0.2); this.tone('sine', 330, 330, 0.2, 0.2, 0.13); }
  }
  jump() { this.noise(0.05, 'lowpass', 700, 300, 0.1); }
  land() { this.noise(0.06, 'lowpass', 500, 200, 0.18); }
  deploy() { this.noise(0.04, 'highpass', 2500, 1000, 0.18); }
}

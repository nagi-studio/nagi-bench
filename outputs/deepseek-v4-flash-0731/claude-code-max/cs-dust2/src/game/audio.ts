// Web Audio 程序化合成音效（无外部音频文件）

export type SoundName =
  | 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife'
  | 'reload' | 'step' | 'zoom' | 'hit' | 'kill' | 'headshot'
  | 'plant' | 'defuse' | 'explode' | 'beep' | 'roundStart' | 'roundEnd'
  | 'jump' | 'dryfire' | 'armorHit' | 'buy' | 'death' | 'pickup';

export class SoundManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  muted = false;

  /** 必须在用户手势中调用一次 */
  ensure(): void {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
      // 预生成噪声缓冲
      const len = this.ctx.sampleRate * 1.0;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  resume(): void {
    this.ensure();
  }

  private noise(dur: number, filterFreq: number, filterType: BiquadFilterType, gain: number, decay = true): void {
    if (!this.ctx || !this.master || !this.noiseBuf || this.muted) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.playbackRate.value = 0.7 + Math.random() * 0.6;
    const filt = this.ctx.createBiquadFilter();
    filt.type = filterType;
    filt.frequency.value = filterFreq;
    filt.Q.value = 0.8;
    const g = this.ctx.createGain();
    const v = gain * (0.75 + Math.random() * 0.5);
    g.gain.setValueAtTime(v, t);
    if (decay) g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  private tone(
    freq: number, endFreq: number, dur: number, gain: number,
    type: OscillatorType = 'sine', delay = 0,
  ): void {
    if (!this.ctx || !this.master || this.muted) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  play(name: SoundName): void {
    this.ensure();
    if (!this.ctx || this.muted) return;
    switch (name) {
      case 'ak47': // 低沉爆响 + 机械音
        this.noise(0.12, 700, 'lowpass', 0.9);
        this.noise(0.06, 2400, 'highpass', 0.5);
        this.tone(160, 55, 0.11, 0.7, 'square');
        break;
      case 'm4a4': // 清脆短促
        this.noise(0.08, 1500, 'lowpass', 0.75);
        this.noise(0.05, 3500, 'highpass', 0.4);
        this.tone(220, 90, 0.07, 0.5, 'square');
        break;
      case 'awp': // 巨响 + 弹壳
        this.noise(0.35, 500, 'lowpass', 1.6);
        this.noise(0.15, 3000, 'highpass', 0.8);
        this.tone(120, 40, 0.3, 1.0, 'sawtooth');
        this.tone(800, 300, 0.05, 0.3, 'triangle', 0.1);
        break;
      case 'glock':
        this.noise(0.07, 1800, 'lowpass', 0.55);
        this.tone(300, 120, 0.05, 0.35, 'square');
        break;
      case 'usp':
        this.noise(0.08, 1600, 'lowpass', 0.6);
        this.tone(260, 100, 0.06, 0.4, 'square');
        break;
      case 'deagle': // 威力大
        this.noise(0.14, 900, 'lowpass', 1.0);
        this.tone(180, 60, 0.12, 0.8, 'square');
        break;
      case 'knife':
        this.noise(0.09, 2500, 'bandpass', 0.5);
        this.tone(900, 200, 0.08, 0.4, 'sawtooth');
        break;
      case 'dryfire':
        this.noise(0.02, 2000, 'highpass', 0.2);
        break;
      case 'reload': // 拉栓 / 上弹咔哒
        this.tone(700, 500, 0.03, 0.25, 'square');
        this.tone(500, 350, 0.03, 0.25, 'square', 0.15);
        this.tone(900, 600, 0.04, 0.3, 'square', 0.5);
        break;
      case 'step':
        this.noise(0.06, 400, 'lowpass', 0.22);
        break;
      case 'jump':
        this.noise(0.05, 300, 'lowpass', 0.15);
        break;
      case 'zoom':
        this.tone(1200, 900, 0.05, 0.2, 'sine');
        this.tone(1500, 1100, 0.04, 0.15, 'sine', 0.06);
        break;
      case 'hit':
        this.tone(500, 200, 0.06, 0.35, 'triangle');
        break;
      case 'armorHit':
        this.tone(900, 400, 0.05, 0.3, 'square');
        break;
      case 'headshot':
        this.tone(1200, 500, 0.08, 0.5, 'triangle');
        break;
      case 'kill': // 击杀提示
        this.tone(880, 880, 0.09, 0.3, 'sine');
        this.tone(1174, 1174, 0.12, 0.3, 'sine', 0.1);
        break;
      case 'death':
        this.tone(400, 120, 0.4, 0.4, 'sawtooth');
        break;
      case 'plant': // 嘀-嘀-嘀
        for (let i = 0; i < 4; i++) this.tone(900, 900, 0.08, 0.35, 'square', i * 0.3);
        this.tone(600, 300, 0.4, 0.4, 'square', 1.3);
        break;
      case 'defuse':
        this.tone(500, 800, 0.1, 0.3, 'square');
        this.tone(650, 1000, 0.12, 0.3, 'square', 0.2);
        break;
      case 'beep': // C4 倒计时
        this.tone(1000, 1000, 0.05, 0.3, 'square');
        break;
      case 'explode':
        this.noise(1.8, 200, 'lowpass', 2.2);
        this.tone(90, 25, 1.4, 1.2, 'sine');
        this.noise(0.6, 800, 'bandpass', 1.0);
        break;
      case 'roundStart':
        this.tone(520, 520, 0.1, 0.25, 'sine');
        this.tone(660, 660, 0.1, 0.25, 'sine', 0.12);
        this.tone(880, 880, 0.18, 0.3, 'sine', 0.24);
        break;
      case 'roundEnd':
        this.tone(440, 300, 0.35, 0.3, 'sawtooth');
        break;
      case 'pickup':
        this.tone(750, 950, 0.07, 0.3, 'triangle');
        break;
      default:
        break;
    }
  }

  setMuted(m: boolean): void {
    this.muted = m;
    if (this.master && this.ctx) {
      this.master.gain.linearRampToValueAtTime(m ? 0 : 0.5, this.ctx.currentTime + 0.1);
    }
  }
}

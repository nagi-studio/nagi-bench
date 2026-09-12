// ---------------------------------------------------------------------------
// Web Audio 程序化音效合成（无任何外部音频文件）
// ---------------------------------------------------------------------------

export interface SoundPos { x: number; z: number }

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private listener: SoundPos = { x: 0, z: 0 };

  /** 必须在用户手势后调用 */
  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(ctx.destination);
    // 预生成 1 秒白噪声
    const len = ctx.sampleRate;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;
  }

  get ready() { return !!this.ctx; }

  setListener(x: number, z: number) { this.listener.x = x; this.listener.z = z; }

  /** 距离衰减 + 简单声像 */
  private spatial(pos: SoundPos | undefined, base: number): { gain: GainNode; pan: StereoPannerNode | null } | null {
    if (!this.ctx || !this.master) return null;
    let vol = base;
    let panNode: StereoPannerNode | null = null;
    if (pos) {
      const dx = pos.x - this.listener.x;
      const dz = pos.z - this.listener.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 55) return null;
      vol = base * Math.max(0.02, 1 - dist / 55) ** 1.6;
      if (this.ctx.createStereoPanner) {
        panNode = this.ctx.createStereoPanner();
        panNode.pan.value = Math.max(-0.8, Math.min(0.8, dx / 25));
      }
    }
    const gain = this.ctx.createGain();
    gain.gain.value = vol;
    if (panNode) { gain.connect(panNode); panNode.connect(this.master); }
    else gain.connect(this.master);
    return { gain, pan: panNode };
  }

  private noise(dst: AudioNode, t0: number, dur: number, filterType: BiquadFilterType, freq: number, q = 1, peak = 1) {
    if (!this.ctx || !this.noiseBuf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = filterType; f.frequency.value = freq; f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(peak, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(dst);
    src.start(t0); src.stop(t0 + dur + 0.05);
  }

  private tone(dst: AudioNode, t0: number, type: OscillatorType, freq: number, dur: number, peak = 1, slideTo?: number) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo !== undefined) o.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t0 + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(peak, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(dst);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  /** 武器开火声：不同武器不同音色 */
  shot(kind: string, pos?: SoundPos) {
    if (!this.ctx) return;
    const sp = this.spatial(pos, pos ? 0.9 : 0.55);
    if (!sp) return;
    const t = this.ctx.currentTime;
    switch (kind) {
      case 'ak':
        this.noise(sp.gain, t, 0.16, 'lowpass', 850, 1, 1.0);
        this.tone(sp.gain, t, 'square', 130, 0.1, 0.5, 60);
        this.noise(sp.gain, t, 0.04, 'highpass', 3000, 1, 0.6);
        break;
      case 'm4':
        this.noise(sp.gain, t, 0.12, 'bandpass', 1500, 0.8, 1.0);
        this.tone(sp.gain, t, 'square', 170, 0.07, 0.35, 80);
        this.noise(sp.gain, t, 0.03, 'highpass', 4000, 1, 0.5);
        break;
      case 'awp':
        this.noise(sp.gain, t, 0.45, 'lowpass', 500, 1, 1.1);
        this.tone(sp.gain, t, 'sine', 90, 0.35, 0.8, 35);
        this.noise(sp.gain, t, 0.06, 'highpass', 2500, 1, 0.7);
        this.noise(sp.gain, t + 0.09, 0.3, 'lowpass', 300, 1, 0.3); // 尾音
        break;
      case 'glock':
        this.noise(sp.gain, t, 0.08, 'highpass', 1800, 1, 0.8);
        this.tone(sp.gain, t, 'square', 240, 0.05, 0.3, 110);
        break;
      case 'usp':
        this.noise(sp.gain, t, 0.09, 'bandpass', 1100, 1.2, 0.8);
        this.tone(sp.gain, t, 'square', 200, 0.05, 0.28, 90);
        break;
      case 'deagle':
        this.noise(sp.gain, t, 0.2, 'lowpass', 1000, 1, 1.0);
        this.tone(sp.gain, t, 'square', 110, 0.12, 0.5, 50);
        this.noise(sp.gain, t, 0.04, 'highpass', 3500, 1, 0.5);
        break;
      case 'knife':
        this.noise(sp.gain, t, 0.16, 'bandpass', 900, 2, 0.4);
        this.noise(sp.gain, t + 0.02, 0.12, 'bandpass', 1800, 2, 0.25);
        break;
    }
  }

  reload(pos?: SoundPos) {
    if (!this.ctx) return;
    const sp = this.spatial(pos, pos ? 0.5 : 0.35);
    if (!sp) return;
    const t = this.ctx.currentTime;
    this.tone(sp.gain, t, 'square', 900, 0.03, 0.25);
    this.tone(sp.gain, t + 0.16, 'square', 600, 0.03, 0.25);
    this.noise(sp.gain, t + 0.32, 0.05, 'bandpass', 2000, 2, 0.3);
    this.tone(sp.gain, t + 0.45, 'square', 1200, 0.025, 0.22);
  }

  step(pos?: SoundPos, alt = false) {
    if (!this.ctx) return;
    const sp = this.spatial(pos, pos ? 0.45 : 0.16);
    if (!sp) return;
    const t = this.ctx.currentTime;
    this.noise(sp.gain, t, 0.055, 'lowpass', alt ? 380 : 460, 1, 0.8);
  }

  scope() {
    if (!this.ctx) return;
    const sp = this.spatial(undefined, 0.3);
    if (!sp) return;
    const t = this.ctx.currentTime;
    this.noise(sp.gain, t, 0.14, 'bandpass', 500, 3, 0.5);
    this.tone(sp.gain, t + 0.02, 'sine', 700, 0.08, 0.15, 1400);
  }

  hit(head = false) {
    if (!this.ctx) return;
    const sp = this.spatial(undefined, 0.4);
    if (!sp) return;
    const t = this.ctx.currentTime;
    this.tone(sp.gain, t, 'sine', head ? 1500 : 1000, 0.06, 0.5);
    if (head) this.tone(sp.gain, t + 0.02, 'sine', 2000, 0.05, 0.3);
  }

  kill() {
    if (!this.ctx) return;
    const sp = this.spatial(undefined, 0.45);
    if (!sp) return;
    const t = this.ctx.currentTime;
    this.tone(sp.gain, t, 'sine', 880, 0.09, 0.5);
    this.tone(sp.gain, t + 0.09, 'sine', 1320, 0.14, 0.5);
  }

  dryFire() {
    if (!this.ctx) return;
    const sp = this.spatial(undefined, 0.3);
    if (!sp) return;
    this.tone(sp.gain, this.ctx.currentTime, 'square', 1400, 0.03, 0.2);
  }

  weaponSwitch() {
    if (!this.ctx) return;
    const sp = this.spatial(undefined, 0.25);
    if (!sp) return;
    const t = this.ctx.currentTime;
    this.noise(sp.gain, t, 0.06, 'bandpass', 1600, 2, 0.4);
  }

  plantBeep() {
    if (!this.ctx) return;
    const sp = this.spatial(undefined, 0.35);
    if (!sp) return;
    const t = this.ctx.currentTime;
    this.tone(sp.gain, t, 'square', 1040, 0.07, 0.35);
  }

  /** C4 倒计时滴答，rate 越高越急促 */
  bombTick(pos: SoundPos, urgent: number) {
    if (!this.ctx) return;
    const sp = this.spatial(pos, 0.65);
    if (!sp) return;
    const t = this.ctx.currentTime;
    this.tone(sp.gain, t, 'square', 1200 + urgent * 500, 0.06, 0.5);
  }

  defuseClick(pos?: SoundPos) {
    if (!this.ctx) return;
    const sp = this.spatial(pos, 0.4);
    if (!sp) return;
    const t = this.ctx.currentTime;
    this.tone(sp.gain, t, 'square', 700, 0.04, 0.3);
    this.noise(sp.gain, t + 0.05, 0.04, 'bandpass', 2400, 3, 0.25);
  }

  explosion(pos: SoundPos) {
    if (!this.ctx) return;
    const sp = this.spatial(undefined, 1.0); // 全图可闻
    void pos;
    if (!sp) return;
    const t = this.ctx.currentTime;
    this.noise(sp.gain, t, 1.4, 'lowpass', 220, 1, 1.4);
    this.tone(sp.gain, t, 'sine', 55, 1.2, 1.0, 25);
    this.noise(sp.gain, t, 0.25, 'highpass', 1200, 1, 0.8);
    this.noise(sp.gain, t + 0.15, 1.0, 'lowpass', 120, 1, 0.6);
  }

  roundStinger(win: boolean) {
    if (!this.ctx) return;
    const sp = this.spatial(undefined, 0.4);
    if (!sp) return;
    const t = this.ctx.currentTime;
    if (win) {
      this.tone(sp.gain, t, 'sine', 523, 0.15, 0.4);
      this.tone(sp.gain, t + 0.12, 'sine', 659, 0.15, 0.4);
      this.tone(sp.gain, t + 0.24, 'sine', 784, 0.3, 0.45);
    } else {
      this.tone(sp.gain, t, 'sine', 392, 0.2, 0.4);
      this.tone(sp.gain, t + 0.18, 'sine', 311, 0.35, 0.4);
    }
  }

  drop() {
    if (!this.ctx) return;
    const sp = this.spatial(undefined, 0.3);
    if (!sp) return;
    this.noise(sp.gain, this.ctx.currentTime, 0.08, 'lowpass', 500, 1, 0.5);
  }
}

export const audio = new AudioEngine();

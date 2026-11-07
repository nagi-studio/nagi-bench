/** All game audio is synthesised at runtime with the Web Audio API. */
export class Sfx {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;

  init() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);
  }

  private noise(dur: number, gain: number, freq: number, q = 0.8, type: BiquadFilterType = 'bandpass') {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 1.6;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(f).connect(g).connect(this.master);
    src.start();
  }

  private tone(freq: number, dur: number, gain: number, type: OscillatorType = 'sine', slideTo?: number) {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    const t = ctx.currentTime;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  shoot(kind: string) {
    this.init();
    if (kind === 'sniper') {
      this.noise(0.34, 0.95, 900, 0.6);
      this.tone(140, 0.28, 0.35, 'sawtooth', 60);
    } else if (kind === 'rifle') {
      this.noise(0.16, 0.7, 1800, 0.7);
      this.tone(180, 0.11, 0.22, 'square', 90);
    } else if (kind === 'pistol') {
      this.noise(0.12, 0.5, 2400, 0.9);
      this.tone(260, 0.08, 0.14, 'square', 120);
    } else {
      this.noise(0.1, 0.35, 900, 1.2);
    }
  }

  reload() { this.init(); this.noise(0.07, 0.35, 2600, 1.4); setTimeout(() => this.noise(0.09, 0.4, 1500, 1.2), 230); }
  hit() { this.init(); this.tone(1500, 0.05, 0.18, 'square', 900); }
  headshot() { this.init(); this.tone(2300, 0.07, 0.24, 'square', 1200); }
  kill() { this.init(); this.tone(880, 0.16, 0.22, 'triangle', 440); }
  step() { this.init(); this.noise(0.06, 0.16, 700, 1.6); }
  scope() { this.init(); this.noise(0.05, 0.25, 3200, 2); }
  plant() { this.init(); this.tone(1200, 0.08, 0.2, 'sine', 1200); }
  beep() { this.init(); this.tone(1800, 0.06, 0.16, 'sine'); }
  explode() {
    this.init();
    this.noise(1.2, 1.0, 260, 0.4, 'lowpass');
    this.tone(90, 1.0, 0.45, 'sawtooth', 32);
  }
  roundWin() { this.init(); [523, 659, 784].forEach((f, i) => setTimeout(() => this.tone(f, 0.3, 0.16, 'triangle'), i * 120)); }
  roundLose() { this.init(); [392, 330, 262].forEach((f, i) => setTimeout(() => this.tone(f, 0.34, 0.16, 'triangle'), i * 140)); }
}

export const sfx = new Sfx();

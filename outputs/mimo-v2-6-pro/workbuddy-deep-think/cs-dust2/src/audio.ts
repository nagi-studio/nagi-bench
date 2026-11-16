/** Procedural Web Audio: every sound is synthesized, no audio files. */
export class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;

  start(): void {
    if (this.ctx) return;
    const ctx = new AudioContext();
    this.ctx = ctx;
    const g = ctx.createGain();
    g.gain.value = 0.55;
    g.connect(ctx.destination);
    this.master = g;
  }

  private burst(freq: number, q: number, peak: number, dur: number, type: BiquadFilterType = 'bandpass', sweepTo?: number): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const len = Math.max(1, (ctx.sampleRate * dur) | 0);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.7);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, ctx.currentTime);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, ctx.currentTime + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(peak, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(f).connect(g).connect(this.master!);
    src.start();
  }

  private tone(freq: number, peak: number, dur: number, type: OscillatorType = 'sine', slide?: number): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(peak, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(this.master!);
    o.start();
    o.stop(ctx.currentTime + dur + 0.05);
  }

  fire(weapon: string): void {
    switch (weapon) {
      case 'ak47':
        this.burst(420, 0.7, 0.42, 0.16, 'bandpass', 220);
        this.tone(140, 0.3, 0.1, 'square', 70);
        break;
      case 'm4a4':
        this.burst(560, 0.8, 0.36, 0.12, 'bandpass', 320);
        this.tone(180, 0.22, 0.08, 'square', 95);
        break;
      case 'awp':
        this.burst(240, 0.5, 0.55, 0.32, 'lowpass', 110);
        this.tone(88, 0.42, 0.24, 'triangle', 46);
        break;
      case 'deagle':
        this.burst(380, 0.6, 0.46, 0.2, 'bandpass', 180);
        this.tone(110, 0.34, 0.14, 'square', 60);
        break;
      case 'knife':
        this.burst(1800, 1.2, 0.16, 0.12, 'bandpass', 900);
        break;
      default:
        this.burst(620, 0.8, 0.32, 0.11, 'bandpass', 360);
        this.tone(190, 0.2, 0.07, 'square', 110);
    }
  }

  reload(): void {
    this.burst(700, 2, 0.12, 0.06, 'bandpass');
    window.setTimeout(() => this.burst(520, 2, 0.1, 0.07, 'bandpass'), 260);
    window.setTimeout(() => this.burst(880, 2, 0.12, 0.05, 'bandpass'), 900);
  }

  footstep(): void {
    this.burst(300, 1.1, 0.07, 0.08, 'lowpass');
  }

  scope(): void {
    this.tone(1200, 0.08, 0.07, 'sine', 1600);
    this.tone(900, 0.06, 0.09, 'sine', 700);
  }

  hit(): void {
    this.burst(1500, 1.4, 0.14, 0.06, 'bandpass');
    this.tone(320, 0.12, 0.05, 'triangle', 220);
  }

  kill(): void {
    this.tone(660, 0.14, 0.08, 'triangle');
    window.setTimeout(() => this.tone(880, 0.12, 0.12, 'triangle'), 90);
  }

  plant(): void {
    for (let i = 0; i < 5; i++) window.setTimeout(() => this.tone(1250, 0.1, 0.06, 'square'), i * 220);
  }

  defuseTick(): void {
    this.tone(980, 0.07, 0.05, 'square');
  }

  explode(): void {
    this.tone(52, 0.55, 1.6, 'triangle', 24);
    this.burst(120, 0.4, 0.5, 1.4, 'lowpass', 60);
    this.burst(900, 0.7, 0.22, 0.7, 'lowpass', 200);
  }

  beep(): void {
    this.tone(1040, 0.09, 0.09, 'square');
  }

  roundStart(): void {
    this.tone(392, 0.12, 0.16, 'triangle');
    window.setTimeout(() => this.tone(523, 0.12, 0.22, 'triangle'), 170);
  }
}

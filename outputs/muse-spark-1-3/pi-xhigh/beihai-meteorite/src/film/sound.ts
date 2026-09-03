// Procedural Web Audio: sea, wind, rumble, alarm, radio static, breath, chimes. No external samples.
export class FilmSound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private windGain: GainNode | null = null;
  private seaGain: GainNode | null = null;
  private alarmTimer = 0;

  ensure(): void {
    try {
      if (!this.ctx) {
        // SAFETY: window index access is untyped; fallback key exists only on older browsers, guarded by try/catch.
        const w = window as unknown as Record<string, typeof AudioContext>;
        const AC = window.AudioContext || w['webkitAudioContext'];
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.6;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
    } catch { /* silent */ }
  }

  private tone(dur: number, freq: number, type: OscillatorType, gain: number, slide = 0, delay = 0): void {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide !== 0) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t + dur);
  }

  private noise(dur: number, gain: number, freq: number, delay = 0): void {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f).connect(g).connect(this.master);
    src.start(t);
  }

  private loopNoise(gain: number, freq: number): GainNode | null {
    if (!this.ctx || !this.master) return null;
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.value = 0;
    src.connect(f).connect(g).connect(this.master);
    src.start();
    g.gain.linearRampToValueAtTime(gain, this.ctx.currentTime + 2);
    return g;
  }

  startBeds(): void {
    this.ensure();
    if (!this.windGain) this.windGain = this.loopNoise(0.0, 500);
    if (!this.seaGain) this.seaGain = this.loopNoise(0.0, 900);
  }

  setBeds(wind: number, sea: number): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (this.windGain) this.windGain.gain.linearRampToValueAtTime(wind, t + 1.5);
    if (this.seaGain) this.seaGain.gain.linearRampToValueAtTime(sea, t + 1.5);
  }

  rumble(dur: number): void { this.noise(dur, 0.5, 220); this.tone(dur, 48, 'sawtooth', 0.3, -12); }
  boom(): void { this.noise(1.6, 0.8, 380); this.tone(1.0, 55, 'sawtooth', 0.5, -25); }
  splash(): void { this.noise(0.8, 0.35, 1400); }
  thunder(): void { this.noise(1.1, 0.55, 300); this.tone(0.7, 70, 'sawtooth', 0.3, -30); }
  radioStatic(dur: number): void { this.noise(dur, 0.12, 3200); this.tone(0.1, 1200, 'square', 0.05); }
  breath(): void { this.noise(0.5, 0.2, 600); setTimeout(() => this.noise(0.6, 0.16, 500), 450); }
  chime(): void {
    for (const [f, dl] of [[523, 0], [659, 0.35], [784, 0.7], [1047, 1.1]] as const) {
      this.tone(1.6, f, 'sine', 0.16, 0, dl);
    }
  }
  gull(): void { this.tone(0.28, 1400, 'sine', 0.08, -500); }
  beep(): void { this.tone(0.14, 880, 'square', 0.14); }
  alarm(): void {
    this.alarmTimer += 1;
    if (this.alarmTimer % 2 === 1) this.tone(0.5, 660, 'square', 0.16, 120);
    else this.tone(0.5, 520, 'square', 0.16, -120);
  }
  heartbeat(): void {
    this.tone(0.12, 65, 'sine', 0.5);
    setTimeout(() => this.tone(0.1, 58, 'sine', 0.4), 220);
  }
}

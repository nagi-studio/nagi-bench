// Procedural Web Audio sound bank. No external files.
export class SoundBank {
  private ctx: AudioContext | null = null;

  ensure(): AudioContext | null {
    try {
      if (!this.ctx) {
        // SAFETY: window index access is untyped; fallback key exists only on older browsers, guarded by try/catch.
        const w = window as unknown as Record<string, typeof AudioContext>;
        const AC = window.AudioContext || w['webkitAudioContext'];
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  private burst(dur: number, freq: number, type: OscillatorType, gain: number, slide = 0): void {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide !== 0) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + dur);
  }

  private noise(dur: number, gain: number, lowpass: number): void {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = lowpass;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f).connect(g).connect(ctx.destination);
    src.start(t);
  }

  shot(id: string): void {
    switch (id) {
      case 'ak47': this.noise(0.22, 0.5, 1800); this.burst(0.12, 140, 'square', 0.35, -80); break;
      case 'm4a4': this.noise(0.15, 0.4, 2600); this.burst(0.09, 190, 'square', 0.3, -90); break;
      case 'awp': this.noise(0.5, 0.65, 900); this.burst(0.3, 90, 'sawtooth', 0.4, -50); break;
      case 'deagle': this.noise(0.25, 0.55, 1400); this.burst(0.14, 120, 'square', 0.38, -60); break;
      default: this.noise(0.12, 0.35, 2200); this.burst(0.08, 220, 'square', 0.25, -100); break;
    }
  }
  reload(): void { this.burst(0.09, 500, 'triangle', 0.25); setTimeout(() => this.burst(0.09, 700, 'triangle', 0.25), 140); }
  step(): void { this.noise(0.06, 0.1, 700); }
  hit(): void { this.burst(0.08, 900, 'sine', 0.3, 300); }
  kill(): void { this.burst(0.12, 660, 'sine', 0.35); setTimeout(() => this.burst(0.16, 990, 'sine', 0.35), 110); }
  scope(): void { this.burst(0.15, 300, 'sine', 0.25, 500); }
  plant(): void { this.burst(0.1, 440, 'square', 0.3); setTimeout(() => this.burst(0.1, 440, 'square', 0.3), 180); setTimeout(() => this.burst(0.2, 880, 'square', 0.3), 360); }
  defuse(): void { this.burst(0.3, 520, 'sine', 0.25, 200); }
  beep(): void { this.burst(0.12, 1000, 'square', 0.3); }
  explode(): void { this.noise(1.4, 0.8, 400); this.burst(0.9, 60, 'sawtooth', 0.5, -30); }
}

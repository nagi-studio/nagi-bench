export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  lastStep = 0;

  resume(): void {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.28;
      this.master.connect(this.ctx.destination);
      this.noise = this.makeNoise(1);
    }
    void this.ctx.resume();
  }

  private makeNoise(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  private envGain(duration: number, peak: number, attack = 0.004): GainNode {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    g.connect(this.master!);
    return g;
  }

  private tone(freq: number, duration: number, peak: number, type: OscillatorType = "square"): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(this.envGain(duration, peak));
    osc.start();
    osc.stop(this.ctx.currentTime + duration + 0.02);
  }

  private noiseBurst(duration: number, peak: number, freq: number, q: number): void {
    if (!this.ctx || !this.noise) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq;
    filter.Q.value = q;
    src.connect(filter);
    filter.connect(this.envGain(duration, peak, 0.002));
    src.start();
    src.stop(this.ctx.currentTime + duration + 0.02);
  }

  gun(id: string): void {
    this.resume();
    switch (id) {
      case "ak47":
        this.noiseBurst(0.12, 0.9, 420, 0.7);
        this.noiseBurst(0.08, 0.5, 1800, 1.2);
        this.tone(90, 0.09, 0.35, "sawtooth");
        break;
      case "m4a4":
        this.noiseBurst(0.08, 0.7, 900, 1.1);
        this.noiseBurst(0.06, 0.4, 2400, 1.4);
        this.tone(140, 0.05, 0.22, "square");
        break;
      case "awp":
        this.noiseBurst(0.28, 1, 180, 0.5);
        this.noiseBurst(0.18, 0.7, 700, 0.8);
        this.tone(55, 0.22, 0.55, "sawtooth");
        this.tone(220, 0.08, 0.2, "triangle");
        break;
      case "deagle":
        this.noiseBurst(0.16, 0.85, 280, 0.6);
        this.tone(70, 0.12, 0.4, "sawtooth");
        this.noiseBurst(0.08, 0.4, 1600, 1);
        break;
      case "glock":
        this.noiseBurst(0.07, 0.55, 1100, 1.3);
        this.tone(180, 0.05, 0.18, "square");
        break;
      case "usp":
        this.noiseBurst(0.06, 0.42, 1300, 1.5);
        this.tone(210, 0.04, 0.14, "triangle");
        break;
      case "knife":
        this.noiseBurst(0.08, 0.3, 3200, 2);
        this.tone(600, 0.06, 0.12, "sawtooth");
        break;
      default:
        this.noiseBurst(0.08, 0.5, 800, 1);
    }
  }

  empty(): void {
    this.resume();
    this.tone(220, 0.04, 0.12, "square");
  }

  reload(): void {
    this.resume();
    this.tone(180, 0.05, 0.12, "square");
    window.setTimeout(() => this.tone(140, 0.08, 0.1, "square"), 180);
    window.setTimeout(() => {
      this.tone(260, 0.05, 0.14, "square");
      this.noiseBurst(0.06, 0.15, 2000, 2);
    }, 520);
  }

  footstep(speed: number): void {
    this.resume();
    const now = performance.now();
    const interval = speed > 4 ? 340 : 480;
    if (now - this.lastStep < interval) return;
    this.lastStep = now;
    this.noiseBurst(0.05, 0.18, 180, 0.8);
    this.tone(70 + Math.random() * 20, 0.04, 0.08, "sine");
  }

  hit(head: boolean): void {
    this.resume();
    if (head) {
      this.tone(880, 0.07, 0.22, "square");
      this.noiseBurst(0.05, 0.2, 2500, 2);
    } else {
      this.noiseBurst(0.05, 0.22, 400, 1);
      this.tone(160, 0.04, 0.12, "sine");
    }
  }

  kill(): void {
    this.resume();
    this.tone(660, 0.08, 0.2, "square");
    window.setTimeout(() => this.tone(990, 0.1, 0.22, "square"), 70);
  }

  hurt(): void {
    this.resume();
    this.noiseBurst(0.1, 0.25, 300, 0.7);
    this.tone(90, 0.1, 0.2, "sawtooth");
  }

  scope(): void {
    this.resume();
    this.tone(420, 0.05, 0.1, "sine");
    this.noiseBurst(0.06, 0.12, 1800, 2);
  }

  plant(): void {
    this.resume();
    this.noiseBurst(0.15, 0.25, 500, 1);
    this.tone(240, 0.12, 0.15, "square");
  }

  defuse(): void {
    this.resume();
    this.tone(300, 0.1, 0.12, "square");
    this.noiseBurst(0.12, 0.2, 900, 1.2);
  }

  beep(urgent: boolean): void {
    this.resume();
    this.tone(urgent ? 880 : 620, 0.05, urgent ? 0.22 : 0.14, "square");
  }

  explode(): void {
    this.resume();
    this.noiseBurst(0.6, 1, 80, 0.4);
    this.noiseBurst(0.4, 0.7, 220, 0.6);
    this.tone(40, 0.5, 0.6, "sawtooth");
  }

  pickup(): void {
    this.resume();
    this.tone(520, 0.06, 0.12, "triangle");
  }

  round(): void {
    this.resume();
    this.tone(330, 0.12, 0.16, "square");
    window.setTimeout(() => this.tone(440, 0.16, 0.18, "square"), 120);
  }
}
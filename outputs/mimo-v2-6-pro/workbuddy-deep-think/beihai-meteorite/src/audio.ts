/**
 * Procedural Web Audio design for the film. No audio files, no samples.
 * Vacuum physics respected: outside the hull there is no direct gunshot —
 * only suit-conducted muffled thumps and subjective low-frequency sound.
 */
export class FilmAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private breathGain: GainNode | null = null;
  private beatTimer = 0;
  private heartbeatOn = true;

  async start(): Promise<void> {
    if (this.ctx) return;
    const ctx = new AudioContext();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    this.master = master;

    // tension drone bed
    const drone = ctx.createGain();
    drone.gain.value = 0.05;
    drone.connect(master);
    this.droneGain = drone;
    for (const f of [48, 51.5, 96.5]) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.4;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + Math.random() * 0.04;
      const lg = ctx.createGain();
      lg.gain.value = 0.18;
      lfo.connect(lg).connect(g.gain);
      o.connect(g).connect(drone);
      o.start();
      lfo.start();
    }

    // suit breathing loop (filtered noise swell)
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 420;
    const bg = ctx.createGain();
    bg.gain.value = 0.0;
    noise.connect(lp).connect(bg).connect(master);
    noise.start();
    this.breathGain = bg;
  }

  private burst(freq: number, q: number, peak: number, dur: number, type: BiquadFilterType = 'bandpass'): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(peak, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(f).connect(g).connect(this.master!);
    src.start();
  }

  private tone(freq: number, peak: number, dur: number, type: OscillatorType = 'sine', slideTo?: number): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(peak, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(this.master!);
    o.start();
    o.stop(ctx.currentTime + dur + 0.05);
  }

  /** radio static accompanying radio / broadcast cues */
  radio(): void {
    this.burst(1700, 0.8, 0.05, 0.32, 'bandpass');
  }

  /** suit-conducted muffled gunshot (vacuum: no airborne crack) */
  muffledShot(): void {
    this.tone(72, 0.32, 0.5, 'triangle', 38);
    this.burst(160, 0.6, 0.16, 0.28, 'lowpass');
  }

  /** distant impact for the "meteorite strike" report */
  distantImpact(): void {
    this.tone(54, 0.22, 0.9, 'sine', 30);
    this.burst(240, 0.7, 0.08, 0.5, 'lowpass');
  }

  alarm(): void {
    this.tone(880, 0.06, 0.16, 'square');
    window.setTimeout(() => this.tone(660, 0.06, 0.2, 'square'), 190);
  }

  engineRumble(): void {
    this.tone(36, 0.2, 3.2, 'sine', 30);
    this.burst(90, 0.5, 0.08, 2.4, 'lowpass');
  }

  setPhase(t: number): void {
    if (!this.ctx) return;
    // breathing only in EVA act
    const eva = t > 140 && t < 262;
    this.breathGain?.gain.setTargetAtTime(eva ? 0.05 + Math.sin(t * 0.9) * 0.022 : 0, this.ctx.currentTime, 0.6);
    this.droneGain?.gain.setTargetAtTime(t < 60 ? 0.05 : t < 140 ? 0.038 : 0.03, this.ctx.currentTime, 1.2);
  }

  /** heartbeat, driven from the render loop */
  update(dt: number): void {
    if (!this.ctx || !this.heartbeatOn) return;
    this.beatTimer += dt;
    const interval = 1.05;
    if (this.beatTimer > interval) {
      this.beatTimer = 0;
      this.tone(58, 0.12, 0.12, 'sine', 42);
      window.setTimeout(() => this.tone(52, 0.09, 0.11, 'sine', 40), 170);
    }
  }

  muteHeartbeat(): void { this.heartbeatOn = false; }
}

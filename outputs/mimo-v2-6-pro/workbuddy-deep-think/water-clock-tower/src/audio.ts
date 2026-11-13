/** Procedural Web Audio sound design: no audio files, no samples. */
export class SoundScape {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private trickleGain: GainNode | null = null;
  private padGain: GainNode | null = null;

  async start(): Promise<void> {
    if (this.ctx) return;
    const ctx = new AudioContext();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.42;
    master.connect(ctx.destination);
    this.master = master;

    // continuous water trickle: filtered noise
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1400;
    bp.Q.value = 0.9;
    const tg = ctx.createGain();
    tg.gain.value = 0.055;
    noise.connect(bp).connect(tg).connect(master);
    noise.start();
    this.trickleGain = tg;

    // soft ambient pad
    const pad = ctx.createGain();
    pad.gain.value = 0.028;
    pad.connect(master);
    this.padGain = pad;
    for (const f of [110, 165, 220, 275]) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.25;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06 + Math.random() * 0.05;
      const lg = ctx.createGain();
      lg.gain.value = 0.12;
      lfo.connect(lg).connect(g.gain);
      o.connect(g).connect(pad);
      o.start();
      lfo.start();
    }
  }

  private env(node: AudioNode, peak: number, attack: number, decay: number): GainNode {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    node.connect(g).connect(this.master!);
    return g;
  }

  /** escapement tick */
  tick(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.value = 1900;
    this.env(o, 0.05, 0.001, 0.03);
    o.start();
    o.stop(ctx.currentTime + 0.05);
  }

  /** wheel creak */
  creak(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(95, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(62, ctx.currentTime + 0.22);
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 320;
    o.connect(f);
    this.env(f, 0.035, 0.01, 0.2);
    o.start();
    o.stop(ctx.currentTime + 0.26);
  }

  /** bucket spill splash */
  splash(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.35, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.6);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 900;
    src.connect(f);
    this.env(f, 0.11, 0.008, 0.3);
    src.start();
  }

  /** bell strike */
  bell(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    for (const [freq, amp] of [[392, 0.14], [523.25, 0.09], [784, 0.05], [1046, 0.025]] as const) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(amp, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
      o.connect(g).connect(this.master!);
      o.start(t);
      o.stop(t + 2.5);
    }
    const o2 = ctx.createOscillator();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(120, t);
    o2.frequency.exponentialRampToValueAtTime(60, t + 0.4);
    this.env(o2, 0.12, 0.005, 0.4);
    o2.start(t);
    o2.stop(t + 0.5);
  }

  setTrickle(v: number): void {
    if (this.trickleGain && this.ctx) {
      this.trickleGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.4);
    }
  }

  dip(): void {
    if (this.padGain && this.ctx) {
      this.padGain.gain.setTargetAtTime(0.012, this.ctx.currentTime, 1.2);
    }
  }
}

/**
 * Procedural Web Audio API synthesizer for Su Song's Water-Driven Clocktower.
 * Zero external audio assets. All sounds are synthesized in real time and routed
 * through a gentle compressor/limiter so output stays warm and never clips.
 */
export class ClocktowerAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private waterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private muted = false;
  private started = false;

  // Throttle timestamps to avoid overlapping sound spam
  private lastDropTime = 0;
  private lastGearTime = 0;
  private lastLatchTime = 0;
  private lastBellTime = 0;
  private lastDrumTime = 0;
  private lastSplashTime = 0;

  // Pentatonic Guqin score scheduler (D major pentatonic)
  private nextNoteIndex = 0;
  private readonly guqinScore: Array<{ t: number; freq: number; dur: number; amp: number }> = [
    { t: 0.4, freq: 146.83, dur: 3.2, amp: 0.14 }, // D3
    { t: 1.8, freq: 220.0, dur: 2.6, amp: 0.12 },  // A3
    { t: 3.1, freq: 293.66, dur: 2.8, amp: 0.11 }, // D4
    { t: 5.0, freq: 329.63, dur: 2.2, amp: 0.10 }, // E4
    { t: 6.6, freq: 246.94, dur: 2.6, amp: 0.11 }, // B3
    { t: 8.4, freq: 220.0, dur: 2.8, amp: 0.12 },  // A3
    { t: 10.6, freq: 185.0, dur: 2.5, amp: 0.12 }, // F#3
    { t: 12.2, freq: 293.66, dur: 2.6, amp: 0.12 },// D4
    { t: 14.0, freq: 369.99, dur: 2.4, amp: 0.10 },// F#4
    { t: 16.4, freq: 220.0, dur: 2.5, amp: 0.12 }, // A3
    { t: 18.0, freq: 293.66, dur: 2.4, amp: 0.11 },// D4
    { t: 19.6, freq: 440.0, dur: 2.8, amp: 0.10 }, // A4
    { t: 22.0, freq: 146.83, dur: 3.2, amp: 0.13 },// D3
    { t: 24.4, freq: 329.63, dur: 2.6, amp: 0.10 },// E4
    { t: 26.8, freq: 293.66, dur: 3.0, amp: 0.12 },// D4
    { t: 28.4, freq: 369.99, dur: 2.8, amp: 0.11 },// F#4
    { t: 30.2, freq: 440.0, dur: 3.4, amp: 0.12 }, // A4
    { t: 31.4, freq: 293.66, dur: 4.0, amp: 0.13 },// D4
  ];

  public init(): void {
    if (this.started) {
      if (this.ctx && this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      return;
    }
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    try {
      const ctx = new AudioCtx();
      this.ctx = ctx;

      // Soft limiter / compressor to guarantee zero clipping
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -14;
      compressor.knee.value = 18;
      compressor.ratio.value = 6;
      compressor.attack.value = 0.005;
      compressor.release.value = 0.18;

      const master = ctx.createGain();
      master.gain.value = this.muted ? 0 : 0.52;
      master.connect(compressor);
      compressor.connect(ctx.destination);
      this.masterGain = master;

      // Shared 2-second white noise buffer
      const bufSize = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buf;

      this.startWaterStreamBed(ctx, master);
      this.started = true;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
    } catch {
      // Gracefully ignore if browser blocks audio
    }
  }

  private startWaterStreamBed(ctx: AudioContext, dest: AudioNode): void {
    if (!this.noiseBuffer) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;

    const bp1 = ctx.createBiquadFilter();
    bp1.type = 'bandpass';
    bp1.frequency.value = 720;
    bp1.Q.value = 1.6;

    const bp2 = ctx.createBiquadFilter();
    bp2.type = 'bandpass';
    bp2.frequency.value = 1850;
    bp2.Q.value = 2.4;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.45;
    lfoGain.gain.value = 140;
    lfo.connect(lfoGain);
    lfoGain.connect(bp1.frequency);

    const wGain = ctx.createGain();
    wGain.gain.value = 0.055;
    this.waterGain = wGain;

    src.connect(bp1);
    src.connect(bp2);
    bp1.connect(wGain);
    bp2.connect(wGain);
    wGain.connect(dest);

    src.start();
    lfo.start();
  }

  public setMuted(mute: boolean): void {
    this.muted = mute;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(mute ? 0 : 0.52, this.ctx.currentTime, 0.05);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public resetScore(filmTime = 0): void {
    this.nextNoteIndex = 0;
    while (
      this.nextNoteIndex < this.guqinScore.length &&
      this.guqinScore[this.nextNoteIndex].t < filmTime
    ) {
      this.nextNoteIndex++;
    }
  }

  public updateMusic(filmTime: number): void {
    if (!this.ctx || !this.masterGain || this.muted || this.ctx.state !== 'running') return;
    const loopT = filmTime % 34.0;
    if (loopT < 0.2 && this.nextNoteIndex >= this.guqinScore.length) {
      this.nextNoteIndex = 0;
    }
    while (
      this.nextNoteIndex < this.guqinScore.length &&
      this.guqinScore[this.nextNoteIndex].t <= loopT
    ) {
      const n = this.guqinScore[this.nextNoteIndex++];
      this.playGuqinNote(n.freq, n.dur, n.amp);
    }
  }

  private playGuqinNote(freq: number, dur: number, amp: number): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Warm plucked silk-string harmonic blend (fundamental + 2nd + 3rd)
    const partials = [
      { mult: 1.0, weight: 1.0, decay: dur },
      { mult: 2.0, weight: 0.36, decay: dur * 0.65 },
      { mult: 3.0, weight: 0.14, decay: dur * 0.4 },
    ];
    for (const p of partials) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = p.mult === 1 ? 'triangle' : 'sine';
      // Subtle guqin finger slide at onset
      osc.frequency.setValueAtTime(freq * p.mult * 0.985, now);
      osc.frequency.exponentialRampToValueAtTime(freq * p.mult, now + 0.075);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(amp * p.weight, now + 0.014);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + p.decay + 0.05);
    }
  }

  public playWaterDrop(intensity = 0.5): void {
    if (!this.ctx || !this.masterGain || this.muted || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    if (now - this.lastDropTime < 0.14) return;
    this.lastDropTime = now;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const baseF = 560 + Math.random() * 260;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseF, now);
    osc.frequency.exponentialRampToValueAtTime(baseF * 1.48, now + 0.045);

    const vol = Math.min(0.045, 0.025 + intensity * 0.02);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playEscapementClack(isLock = true): void {
    if (!this.ctx || !this.masterGain || this.muted || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    if (now - this.lastLatchTime < 0.18) return;
    this.lastLatchTime = now;

    // Hardwood body thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const fStart = isLock ? 310 : 520;
    osc.frequency.setValueAtTime(fStart, now);
    osc.frequency.exponentialRampToValueAtTime(isLock ? 115 : 210, now + 0.06);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(isLock ? 0.24 : 0.16, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);

    // Metallic bronze latch click
    if (this.noiseBuffer) {
      const nSrc = this.ctx.createBufferSource();
      nSrc.buffer = this.noiseBuffer;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = isLock ? 1350 : 2100;
      bp.Q.value = 4.0;
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.14, now);
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      nSrc.connect(bp);
      bp.connect(nGain);
      nGain.connect(this.masterGain);
      nSrc.start(now);
      nSrc.stop(now + 0.05);
    }
  }

  public playGearMesh(): void {
    if (!this.ctx || !this.masterGain || this.muted || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    if (now - this.lastGearTime < 0.25) return;
    this.lastGearTime = now;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(195, now);
    osc.frequency.exponentialRampToValueAtTime(92, now + 0.05);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playWaterSplash(): void {
    if (!this.ctx || !this.masterGain || this.muted || this.ctx.state !== 'running' || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    if (now - this.lastSplashTime < 0.45) return;
    this.lastSplashTime = now;

    const nSrc = this.ctx.createBufferSource();
    nSrc.buffer = this.noiseBuffer;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1200, now);
    bp.frequency.exponentialRampToValueAtTime(500, now + 0.28);
    bp.Q.value = 1.2;

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.001, now);
    nGain.gain.linearRampToValueAtTime(0.09, now + 0.03);
    nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    nSrc.connect(bp);
    bp.connect(nGain);
    nGain.connect(this.masterGain);
    nSrc.start(now);
    nSrc.stop(now + 0.35);
  }

  /** Synthesize authentic Song bronze bell partials on real hammer-bell collision */
  public playBronzeBell(strength = 1.0): void {
    if (!this.ctx || !this.masterGain || this.muted || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    if (now - this.lastBellTime < 0.55) return;
    this.lastBellTime = now;

    const s = Math.max(0.45, Math.min(1.1, strength));
    const f0 = 293.66; // D4 — harmonizes with the D-pentatonic Guqin score!
    const partials = [
      { ratio: 1.0, amp: 0.22, decay: 2.9 },
      { ratio: 2.0, amp: 0.13, decay: 2.0 },
      { ratio: 2.756, amp: 0.09, decay: 1.4 },
      { ratio: 4.07, amp: 0.06, decay: 0.85 },
      { ratio: 5.4, amp: 0.035, decay: 0.45 },
    ];

    for (const p of partials) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f0 * p.ratio, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(p.amp * s, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + p.decay + 0.05);
    }
  }

  /** Synthesize deep Song vermilion drum strike on real mallet-drum collision */
  public playDrum(strength = 1.0): void {
    if (!this.ctx || !this.masterGain || this.muted || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    if (now - this.lastDrumTime < 0.55) return;
    this.lastDrumTime = now;

    const s = Math.max(0.45, Math.min(1.1, strength));

    // Membrane pitch drop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(126, now);
    osc.frequency.exponentialRampToValueAtTime(58, now + 0.19);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.32 * s, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.56);

    // Crisp hide slap transient
    if (this.noiseBuffer) {
      const nSrc = this.ctx.createBufferSource();
      nSrc.buffer = this.noiseBuffer;
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 620;
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.18 * s, now);
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
      nSrc.connect(lp);
      lp.connect(nGain);
      nGain.connect(this.masterGain);
      nSrc.start(now);
      nSrc.stop(now + 0.065);
    }
  }

  public setWaterFocus(boost: number): void {
    if (this.waterGain && this.ctx) {
      this.waterGain.gain.setTargetAtTime(0.045 + boost * 0.035, this.ctx.currentTime, 0.25);
    }
  }
}

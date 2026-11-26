import type { PhysicsEvent } from '../physics/clockPhysics';

/**
 * 100% Procedural Web Audio API Sound Engine (Zero Audio Files!).
 *
 * Synthesizes:
 *   - Northern Song D-Gong Pentatonic Guqin/Guzheng & Xiao ambient musical score
 *   - Soft continuous constant-head water stream ambience
 *   - Physics-driven mechanical foley triggered directly from Rapier3D rigid-body events:
 *       * Water droplet pings
 *       * Escapement latch lift & wooden-bronze catch click-clack
 *       * Wooden pin-gear engagement knock
 *       * Authentic inharmonic Song Bronze Temple Bell chime
 *       * Ceremonial Red Drum resonant boom
 *   - Master DynamicsCompressor + soft tanh limiter guaranteeing clean, non-clipping levels
 */
export class ProceduralSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private waterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  public muted = false;
  public started = false;

  // Northern Song D-Gong Pentatonic melody schedule (times in seconds, MIDI notes)
  // D3=50, E3=52, F#3=54, A3=57, B3=59, D4=62, E4=64, F#4=66, A4=69, B4=71, D5=74
  private readonly scoreEvents: Array<[number, number, number, 'guqin' | 'chime']> = [
    [0.4, 50, 0.55, 'guqin'],
    [0.9, 57, 0.45, 'guqin'],
    [1.6, 62, 0.55, 'guqin'],
    [2.4, 66, 0.50, 'guqin'],
    [3.3, 69, 0.58, 'chime'],

    [4.8, 62, 0.48, 'guqin'],
    [5.6, 64, 0.44, 'guqin'],
    [6.5, 66, 0.50, 'guqin'],
    [7.4, 69, 0.48, 'guqin'],
    [8.3, 64, 0.42, 'guqin'],

    [9.6, 57, 0.52, 'guqin'],
    [10.5, 62, 0.50, 'guqin'],
    [11.4, 66, 0.48, 'guqin'],
    [12.3, 71, 0.52, 'chime'],
    [13.4, 69, 0.48, 'guqin'],
    [14.4, 66, 0.45, 'guqin'],
    [15.4, 64, 0.45, 'guqin'],

    [16.8, 50, 0.54, 'guqin'],
    [17.7, 57, 0.48, 'guqin'],
    [18.6, 64, 0.50, 'guqin'],
    [19.5, 69, 0.52, 'guqin'],
    [20.5, 66, 0.46, 'guqin'],

    [22.2, 62, 0.52, 'guqin'],
    [23.2, 66, 0.50, 'guqin'],
    [24.3, 69, 0.54, 'chime'],
    [25.5, 74, 0.50, 'guqin'],
    [26.6, 71, 0.48, 'guqin'],

    [28.0, 69, 0.54, 'guqin'],
    [29.0, 66, 0.50, 'guqin'],
    [29.9, 64, 0.48, 'guqin'],
    [30.9, 62, 0.62, 'chime'],
    [31.4, 50, 0.58, 'guqin'],
  ];

  private lastScoreTime = -0.01;
  private droneOscs: OscillatorNode[] = [];

  public init(): void {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    try {
      const ctx = new AudioCtx();
      this.ctx = ctx;

      // Master safety chain: masterGain -> DynamicsCompressor -> Soft tanh WaveShaper -> destination
      const masterGain = ctx.createGain();
      masterGain.gain.value = this.muted ? 0 : 0.62;

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -14;
      compressor.knee.value = 20;
      compressor.ratio.value = 6;
      compressor.attack.value = 0.004;
      compressor.release.value = 0.16;

      const limiter = ctx.createWaveShaper();
      limiter.curve = this.createSoftClipCurve(2048);
      limiter.oversample = '2x';

      masterGain.connect(compressor);
      compressor.connect(limiter);
      limiter.connect(ctx.destination);

      this.masterGain = masterGain;

      // Sub-buses
      const musicBus = ctx.createGain();
      musicBus.gain.value = 0.28;
      musicBus.connect(masterGain);
      this.musicBus = musicBus;

      const sfxBus = ctx.createGain();
      sfxBus.gain.value = 0.56;
      sfxBus.connect(masterGain);
      this.sfxBus = sfxBus;

      // Procedural wooden-hall impulse response reverb
      const reverb = ctx.createConvolver();
      reverb.buffer = this.createHallImpulse(ctx, 1.65, 2.8);
      const reverbSend = ctx.createGain();
      reverbSend.gain.value = 0.34;
      reverb.connect(reverbSend);
      reverbSend.connect(masterGain);
      this.reverbNode = reverb;

      // Reusable 2-second filtered pink-ish noise buffer
      this.noiseBuffer = this.createPinkNoiseBuffer(ctx, 2.0);

      // Start continuous soft water stream & serene Xiao bamboo pad drone
      this.startWaterAmbience(ctx);
      this.startXiaoDrone(ctx);

      this.started = true;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {
      // Gracefully no-op if audio device unavailable
    }
  }

  public unlock(): void {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(mute: boolean): void {
    this.muted = mute;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(mute ? 0 : 0.62, this.ctx.currentTime, 0.04);
    }
  }

  public resetTimeline(time = 0): void {
    this.lastScoreTime = time - 0.01;
  }

  /**
   * Advances procedural Song pentatonic score & modulates water ambience according to camera act
   */
  public updateTimeline(filmTime: number, playing: boolean, waterFocusWeight: number): void {
    if (!this.ctx || !this.waterGain) return;

    const now = this.ctx.currentTime;
    const targetWater = playing && !this.muted ? 0.045 + waterFocusWeight * 0.045 : 0.0;
    this.waterGain.gain.setTargetAtTime(targetWater, now, 0.12);

    if (!playing || this.ctx.state !== 'running') return;

    // Loop ambient motif gently after 32s in free showcase mode
    const loopT = filmTime <= 32.2 ? filmTime : 4.5 + ((filmTime - 32.2) % 24.0);
    if (loopT < this.lastScoreTime - 1.0) {
      this.lastScoreTime = loopT - 0.01;
    }

    for (const [evTime, midi, vel, inst] of this.scoreEvents) {
      if (evTime > this.lastScoreTime && evTime <= loopT) {
        if (inst === 'guqin') this.playGuqinNote(midi, vel);
        else this.playBianzhongNote(midi, vel);
      }
    }
    this.lastScoreTime = loopT;
  }

  /**
   * Triggers physics-driven mechanical foley directly from Rapier3D collision/motion events!
   */
  public triggerPhysicsEvent(ev: PhysicsEvent): void {
    if (!this.ctx || this.ctx.state !== 'running' || this.muted) return;
    switch (ev.type) {
      case 'droplet':
        this.playWaterDroplet(ev.intensity);
        break;
      case 'latch_lift':
        this.playLatchLift(ev.intensity);
        break;
      case 'latch_catch':
        this.playLatchCatch(ev.intensity);
        break;
      case 'gear_engage':
        this.playGearKnock(ev.intensity);
        break;
      case 'bell_strike':
        this.playBronzeBell(ev.intensity);
        break;
      case 'drum_strike':
        this.playRedDrum(ev.intensity);
        break;
    }
  }

  private midiToHz(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  private createSoftClipCurve(samples: number): Float32Array<ArrayBuffer> {
    const curve = new Float32Array(new ArrayBuffer(samples * 4));
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = Math.tanh(x * 1.35) / Math.tanh(1.35);
    }
    return curve;
  }

  private createHallImpulse(ctx: AudioContext, duration: number, decay: number): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * duration);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const env = Math.pow(1 - i / len, decay);
        const white = Math.random() * 2 - 1;
        lp = lp * 0.72 + white * 0.28; // warm wooden-hall damping
        data[i] = lp * env * 0.45;
      }
    }
    return buf;
  }

  private createPinkNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * duration);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + w * 0.029;
      b1 = 0.985 * b1 + w * 0.032;
      b2 = 0.950 * b2 + w * 0.048;
      data[i] = (b0 + b1 + b2 + w * 0.14) * 0.55;
    }
    return buf;
  }

  private startWaterAmbience(ctx: AudioContext): void {
    if (!this.noiseBuffer || !this.sfxBus) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1150;
    bp.Q.value = 1.4;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.42;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 240;
    lfo.connect(lfoGain);
    lfoGain.connect(bp.frequency);

    const wg = ctx.createGain();
    wg.gain.value = 0.05;
    this.waterGain = wg;

    src.connect(bp);
    bp.connect(wg);
    wg.connect(this.sfxBus);

    src.start();
    lfo.start();
  }

  private startXiaoDrone(ctx: AudioContext): void {
    if (!this.musicBus || !this.reverbNode) return;
    const freqs = [146.83, 220.0]; // D3 + A3 serene fifth
    for (const f of freqs) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;

      const g = ctx.createGain();
      g.gain.value = f < 180 ? 0.055 : 0.032;

      osc.connect(g);
      g.connect(this.musicBus);
      g.connect(this.reverbNode);
      osc.start();
      this.droneOscs.push(osc);
    }
  }

  private playGuqinNote(midi: number, velocity: number): void {
    if (!this.ctx || !this.musicBus || !this.reverbNode) return;
    const now = this.ctx.currentTime;
    const freq = this.midiToHz(midi);

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc2.type = 'sawtooth';

    // Subtle traditional guqin sliding ornament into target pitch
    osc.frequency.setValueAtTime(freq * 0.985, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.055);
    osc2.frequency.setValueAtTime(freq * 2.0, now);

    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(freq * 4.5, now);
    filt.frequency.exponentialRampToValueAtTime(Math.max(240, freq * 1.15), now + 1.4);

    const g1 = this.ctx.createGain();
    g1.gain.value = 0.78;
    const g2 = this.ctx.createGain();
    g2.gain.value = 0.14;

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.24 * velocity, now + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0008, now + 2.3);

    osc.connect(g1);
    osc2.connect(g2);
    g1.connect(filt);
    g2.connect(filt);
    filt.connect(env);
    env.connect(this.musicBus);
    env.connect(this.reverbNode);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 2.4);
    osc2.stop(now + 2.4);
  }

  private playBianzhongNote(midi: number, velocity: number): void {
    if (!this.ctx || !this.musicBus || !this.reverbNode) return;
    const now = this.ctx.currentTime;
    const base = this.midiToHz(midi);
    const ratios = [1.0, 2.0, 2.98];

    for (let i = 0; i < ratios.length; i++) {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(base * ratios[i], now);

      const env = this.ctx.createGain();
      const peak = (0.14 * velocity) / (i + 1);
      env.gain.setValueAtTime(0.0001, now);
      env.gain.linearRampToValueAtTime(peak, now + 0.008);
      env.gain.exponentialRampToValueAtTime(0.0005, now + 2.2 / (i + 1));

      osc.connect(env);
      env.connect(this.musicBus);
      env.connect(this.reverbNode);
      osc.start(now);
      osc.stop(now + 2.3);
    }
  }

  private playWaterDroplet(intensity: number): void {
    if (!this.ctx || !this.sfxBus) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    const f0 = 780 + Math.random() * 420;
    osc.frequency.setValueAtTime(f0, now);
    osc.frequency.exponentialRampToValueAtTime(f0 * 1.48, now + 0.038);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.045 * intensity, now + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0005, now + 0.045);

    osc.connect(env);
    env.connect(this.sfxBus);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  private playLatchLift(intensity: number): void {
    if (!this.ctx || !this.sfxBus) return;
    const now = this.ctx.currentTime;
    // Crisp dry hardwood + bronze unlatch tick
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.055);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.18 * intensity, now + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0008, now + 0.07);

    osc.connect(env);
    env.connect(this.sfxBus);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  private playLatchCatch(intensity: number): void {
    if (!this.ctx || !this.sfxBus || !this.reverbNode) return;
    const now = this.ctx.currentTime;
    // Authoritative wooden spoke arresting against bronze 左天锁 ("咔嗒!")
    const bodyOsc = this.ctx.createOscillator();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(340, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(140, now + 0.075);

    const bodyEnv = this.ctx.createGain();
    bodyEnv.gain.setValueAtTime(0.0001, now);
    bodyEnv.gain.linearRampToValueAtTime(0.28 * intensity, now + 0.003);
    bodyEnv.gain.exponentialRampToValueAtTime(0.0008, now + 0.09);

    bodyOsc.connect(bodyEnv);
    bodyEnv.connect(this.sfxBus);
    bodyEnv.connect(this.reverbNode);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.1);

    // Metallic bronze tang transient
    const metalOsc = this.ctx.createOscillator();
    metalOsc.type = 'sine';
    metalOsc.frequency.setValueAtTime(1920, now);
    const metalEnv = this.ctx.createGain();
    metalEnv.gain.setValueAtTime(0.0001, now);
    metalEnv.gain.linearRampToValueAtTime(0.11 * intensity, now + 0.002);
    metalEnv.gain.exponentialRampToValueAtTime(0.0005, now + 0.065);
    metalOsc.connect(metalEnv);
    metalEnv.connect(this.sfxBus);
    metalOsc.start(now);
    metalOsc.stop(now + 0.07);
  }

  private playGearKnock(intensity: number): void {
    if (!this.ctx || !this.sfxBus) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.exponentialRampToValueAtTime(98, now + 0.06);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.14 * intensity, now + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0008, now + 0.07);

    osc.connect(env);
    env.connect(this.sfxBus);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  private playBronzeBell(intensity: number): void {
    if (!this.ctx || !this.sfxBus || !this.reverbNode) return;
    const now = this.ctx.currentTime;
    // Authentic Northern Song bronze temple bell: G4 (392 Hz) with inharmonic metallic partials + beat detune
    const base = 392.0;
    const partials: Array<[number, number, number]> = [
      [1.0, 0.34, 2.7],
      [1.004, 0.22, 2.5], // slow acoustic beat shimmer!
      [2.02, 0.20, 1.9],
      [2.76, 0.14, 1.4],
      [4.07, 0.08, 0.9],
      [5.43, 0.05, 0.55],
    ];

    for (const [ratio, gainMul, dur] of partials) {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(base * ratio, now);

      const env = this.ctx.createGain();
      env.gain.setValueAtTime(0.0001, now);
      env.gain.linearRampToValueAtTime(gainMul * Math.max(0.55, intensity), now + 0.004);
      env.gain.exponentialRampToValueAtTime(0.0004, now + dur);

      osc.connect(env);
      env.connect(this.sfxBus);
      env.connect(this.reverbNode);
      osc.start(now);
      osc.stop(now + dur + 0.05);
    }
  }

  private playRedDrum(intensity: number): void {
    if (!this.ctx || !this.sfxBus || !this.reverbNode) return;
    const now = this.ctx.currentTime;

    // Resonant low membrane boom (126 Hz -> 56 Hz pitch drop)
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(126, now);
    osc.frequency.exponentialRampToValueAtTime(56, now + 0.14);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.46 * Math.max(0.55, intensity), now + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0008, now + 0.52);

    osc.connect(env);
    env.connect(this.sfxBus);
    env.connect(this.reverbNode);
    osc.start(now);
    osc.stop(now + 0.55);

    // Warm rawhide mallet slap transient
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 520;
      const nEnv = this.ctx.createGain();
      nEnv.gain.setValueAtTime(0.0001, now);
      nEnv.gain.linearRampToValueAtTime(0.22 * Math.max(0.5, intensity), now + 0.003);
      nEnv.gain.exponentialRampToValueAtTime(0.0008, now + 0.09);

      noise.connect(lp);
      lp.connect(nEnv);
      nEnv.connect(this.sfxBus);
      noise.start(now);
      noise.stop(now + 0.1);
    }
  }
}

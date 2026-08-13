type SoundKind =
  | 'rifle'
  | 'sniper'
  | 'pistol'
  | 'deagle'
  | 'knife'
  | 'reload'
  | 'footstep'
  | 'zoom'
  | 'hit'
  | 'kill'
  | 'plant'
  | 'defuse'
  | 'explode'
  | 'ui';

export class AudioSynth {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private lastFootstep = 0;

  ensureContext() {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.72;
      this.master.connect(this.ctx.destination);
      const length = this.ctx.sampleRate * 1.2;
      this.noiseBuffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType,
    gain: number,
    detune = 0,
    slideTo?: number,
  ) {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration);
    osc.detune.value = detune;
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.exponentialRampToValueAtTime(gain, now + 0.006);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(amp);
    amp.connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  private playNoise(duration: number, gain: number, filterFreq: number, filterType: BiquadFilterType = 'lowpass') {
    const ctx = this.ensureContext();
    if (!ctx || !this.master || !this.noiseBuffer) return;
    const now = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = filterFreq;
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.exponentialRampToValueAtTime(gain, now + 0.005);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(filter);
    filter.connect(amp);
    amp.connect(this.master);
    source.start(now, Math.random() * 0.25);
    source.stop(now + duration + 0.03);
  }

  shoot(kind: SoundKind) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    switch (kind) {
      case 'rifle':
        this.playNoise(0.14, 0.36, 1200);
        this.playTone(190, 0.1, 'square', 0.08, -12, 70);
        this.playTone(75, 0.08, 'sawtooth', 0.1, 0, 40);
        break;
      case 'sniper':
        this.playNoise(0.42, 0.52, 750);
        this.playTone(155, 0.36, 'sawtooth', 0.13, -20, 42);
        this.playTone(58, 0.44, 'sine', 0.24, 0, 28);
        break;
      case 'deagle':
        this.playNoise(0.2, 0.48, 950);
        this.playTone(165, 0.14, 'square', 0.11, -10, 60);
        this.playTone(62, 0.18, 'sine', 0.18, 0, 34);
        break;
      case 'pistol':
        this.playNoise(0.1, 0.28, 1500);
        this.playTone(320, 0.06, 'square', 0.05, -8, 120);
        break;
      case 'knife':
        this.playNoise(0.07, 0.16, 2400, 'highpass');
        break;
      default:
        this.playNoise(0.1, 0.2, 1300);
    }
  }

  reload(stage: 'start' | 'end') {
    this.playNoise(0.08, 0.12, stage === 'start' ? 900 : 1600, 'highpass');
    this.playTone(stage === 'start' ? 230 : 390, 0.05, 'square', 0.045);
  }

  footstep(running: boolean) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    if (now - this.lastFootstep < 0.08) return;
    this.lastFootstep = now;
    this.playNoise(running ? 0.065 : 0.09, running ? 0.07 : 0.04, 420 + Math.random() * 120);
    this.playTone(68 + Math.random() * 10, 0.04, 'sine', 0.035, 0, 38);
  }

  zoom(inOrOut: boolean) {
    this.playNoise(0.055, 0.12, inOrOut ? 2600 : 1700, 'bandpass');
    this.playTone(inOrOut ? 720 : 470, 0.045, 'sine', 0.025, 0, inOrOut ? 900 : 320);
  }

  hit(headshot: boolean) {
    this.playTone(headshot ? 840 : 520, 0.035, 'square', 0.05, 0, headshot ? 1050 : 620);
    this.playNoise(0.025, 0.05, 2400, 'highpass');
  }

  kill() {
    this.playTone(660, 0.13, 'sine', 0.07, 0, 880);
    this.playTone(990, 0.22, 'sine', 0.045, 12, 1320);
  }

  plant(defusing: boolean) {
    this.playTone(defusing ? 350 : 460, 0.09, 'square', 0.045, 0, defusing ? 280 : 390);
    this.playNoise(0.07, 0.08, 1800, 'highpass');
  }

  explode() {
    this.playNoise(1.2, 0.72, 280);
    this.playTone(42, 1.1, 'sine', 0.34, 0, 18);
    this.playTone(120, 0.18, 'sawtooth', 0.12, 0, 24);
  }

  ui() {
    this.playTone(510, 0.035, 'sine', 0.03, 0, 590);
  }

  dispose() {
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
    this.master = null;
    this.noiseBuffer = null;
  }
}

const PENTATONIC = [146.83, 164.81, 185.00, 220.00, 246.94, 293.66, 329.63, 369.99, 440.00];

export class ProceduralAudio {
  constructor() {
    this.context = null;
    this.enabled = false;
    this.muted = false;
    this.filmTime = 0;
    this.noteIndex = 0;
    this.score = [
      [0.2, 0, 1.8], [1.9, 4, 1.5], [3.8, 3, 1.4],
      [5.0, 5, 1.1], [6.5, 4, 1.0], [8.0, 6, 1.2],
      [9.7, 2, 0.8], [11.0, 3, 0.8], [12.4, 4, 0.8], [14.0, 5, 1.1],
      [15.7, 7, 1.3], [17.2, 6, 1.0], [18.7, 5, 1.0], [20.1, 4, 1.0],
      [21.2, 3, 1.0], [22.7, 5, 1.2], [24.2, 7, 1.4], [25.2, 8, 1.8],
      [27.0, 5, 1.6], [27.8, 7, 1.8], [28.6, 8, 2.4],
    ];
  }

  async enable() {
    if (!this.context) this._create();
    if (this.context.state !== 'running') await this.context.resume();
    this.enabled = this.context.state === 'running';
    if (this.enabled) {
      this.master.gain.cancelScheduledValues(this.context.currentTime);
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.55, this.context.currentTime, 0.08);
      this._startAmbience();
      while (this.noteIndex < this.score.length && this.score[this.noteIndex][0] < this.filmTime - 0.1) this.noteIndex++;
    }
    return this.enabled;
  }

  _create() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    this.context = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 16;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.24;
    this.master.connect(compressor);
    compressor.connect(ctx.destination);

    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = 0.75;
    this.effectsBus = ctx.createGain();
    this.effectsBus.gain.value = 0.9;
    this.musicBus.connect(this.master);
    this.effectsBus.connect(this.master);

    this.reverb = ctx.createConvolver();
    const length = Math.floor(ctx.sampleRate * 1.8);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2.8);
        data[i] = (Math.random() * 2 - 1) * decay * 0.55;
      }
    }
    this.reverb.buffer = impulse;
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.16;
    this.reverb.connect(reverbGain);
    reverbGain.connect(this.master);
  }

  _startAmbience() {
    if (this.ambienceStarted) return;
    this.ambienceStarted = true;
    const ctx = this.context;
    const now = ctx.currentTime;
    this.droneGain = ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.0001, now);
    this.droneGain.gain.exponentialRampToValueAtTime(0.026, now + 2.0);
    this.droneGain.connect(this.musicBus);
    for (const [frequency, level] of [[73.42, 0.65], [110, 0.34], [146.83, 0.15]]) {
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      const gain = ctx.createGain();
      gain.gain.value = level;
      oscillator.connect(gain);
      gain.connect(this.droneGain);
      oscillator.start();
    }

    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = last * 0.72 + white * 0.28;
      data[i] = last;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 1050;
    band.Q.value = 0.42;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 2600;
    const gain = ctx.createGain();
    gain.gain.value = 0.045;
    noise.connect(band);
    band.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(this.effectsBus);
    noise.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.context && this.enabled) {
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.55, this.context.currentTime, 0.05);
    }
    return this.muted;
  }

  update(filmTime) {
    this.filmTime = filmTime;
    if (!this.enabled || !this.context) return;
    const now = this.context.currentTime;
    this.musicBus.gain.setTargetAtTime(filmTime >= 27 ? 0.48 : 0.75, now, 0.4);
    while (this.noteIndex < this.score.length && this.score[this.noteIndex][0] <= filmTime + 0.04) {
      const [time, note, duration] = this.score[this.noteIndex++];
      if (time >= filmTime - 0.15) this.pluck(PENTATONIC[note], duration, now + 0.025);
    }
  }

  pluck(frequency, duration = 1.2, at) {
    if (!this.enabled) return;
    const ctx = this.context;
    const time = at ?? ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, time);
    filter.frequency.exponentialRampToValueAtTime(650, time + duration);
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(0.10, time + 0.009);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    filter.connect(envelope);
    envelope.connect(this.musicBus);
    envelope.connect(this.reverb);
    for (const [ratio, level] of [[1, 1], [2.003, 0.18], [3.98, 0.055]]) {
      const oscillator = ctx.createOscillator();
      oscillator.type = ratio === 1 ? 'triangle' : 'sine';
      oscillator.frequency.value = frequency * ratio;
      const gain = ctx.createGain();
      gain.gain.value = level;
      oscillator.connect(gain);
      gain.connect(filter);
      oscillator.start(time);
      oscillator.stop(time + duration + 0.05);
    }
  }

  tick() {
    if (!this.enabled) return;
    const ctx = this.context;
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(840, now);
    oscillator.frequency.exponentialRampToValueAtTime(410, now + 0.045);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.034, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
    oscillator.connect(gain);
    gain.connect(this.effectsBus);
    oscillator.start(now);
    oscillator.stop(now + 0.07);
  }

  bell(strength = 0.7) {
    if (!this.enabled) return;
    const ctx = this.context;
    const now = ctx.currentTime;
    const base = 196;
    for (const [ratio, level, decay] of [[1, 0.12, 4.2], [2.01, 0.052, 3.0], [2.76, 0.036, 2.1], [4.07, 0.019, 1.3], [5.43, 0.009, 0.8]]) {
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = base * ratio;
      oscillator.detune.value = (Math.random() - 0.5) * 2;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(level * (0.55 + strength * 0.45), now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      oscillator.connect(gain);
      gain.connect(this.effectsBus);
      gain.connect(this.reverb);
      oscillator.start(now);
      oscillator.stop(now + decay + 0.05);
    }
  }
}

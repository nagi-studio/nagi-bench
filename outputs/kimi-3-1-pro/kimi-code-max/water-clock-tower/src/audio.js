export class ClockAudio {
  constructor() {
    this.enabled = false;
    this.context = null;
    this.lastTicks = 0;
    this.lastStrikes = 0;
    this.lastNote = -1;
  }

  create() {
    if (this.context) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = this.context = new AudioContext();
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 16;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.24;
    this.master.connect(compressor).connect(ctx.destination);
    this.music = ctx.createGain();
    this.music.gain.value = 0.48;
    this.music.connect(this.master);
    this.sfx = ctx.createGain();
    this.sfx.gain.value = 0.55;
    this.sfx.connect(this.master);
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.impulse(1.7, 2.8);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.16;
    this.reverb.connect(reverbGain).connect(this.master);
    this.startPad();
    this.startWater();
  }

  impulse(seconds, decay) {
    const length = Math.floor(this.context.sampleRate * seconds);
    const buffer = this.context.createBuffer(2, length, this.context.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay) * 0.45;
    }
    return buffer;
  }

  async enable() {
    this.create();
    if (!this.context) return false;
    await this.context.resume();
    this.enabled = this.context.state === 'running';
    this.master.gain.cancelScheduledValues(this.context.currentTime);
    this.master.gain.setTargetAtTime(this.enabled ? 0.62 : 0, this.context.currentTime, 0.08);
    return this.enabled;
  }

  disable() {
    this.enabled = false;
    if (this.context) this.master.gain.setTargetAtTime(0, this.context.currentTime, 0.06);
  }

  startPad() {
    const ctx = this.context;
    for (const [frequency, gain] of [[146.83, 0.025], [220, 0.016], [293.66, 0.009]]) {
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      const level = ctx.createGain();
      level.gain.value = gain;
      oscillator.connect(level).connect(this.music);
      oscillator.start();
    }
  }

  startWater() {
    const ctx = this.context;
    const length = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let brown = 0;
    for (let i = 0; i < length; i++) {
      brown = (brown + (Math.random() * 2 - 1) * 0.045) / 1.015;
      data[i] = brown * 0.45;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1050;
    filter.Q.value = 0.45;
    const gain = ctx.createGain();
    gain.gain.value = 0.14;
    source.connect(filter).connect(gain).connect(this.sfx);
    source.start();
  }

  pluck(frequency, velocity = 0.1) {
    if (!this.enabled) return;
    const ctx = this.context;
    const now = ctx.currentTime;
    for (let partial = 1; partial <= 3; partial++) {
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency * partial;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(velocity / (partial * 1.6), now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 / partial);
      oscillator.connect(gain).connect(this.music);
      gain.connect(this.reverb);
      oscillator.start(now);
      oscillator.stop(now + 2);
    }
  }

  tick() {
    if (!this.enabled) return;
    const ctx = this.context;
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(240, now);
    oscillator.frequency.exponentialRampToValueAtTime(95, now + 0.045);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.085, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
    oscillator.connect(gain).connect(this.sfx);
    oscillator.start(now);
    oscillator.stop(now + 0.09);
  }

  bell() {
    if (!this.enabled) return;
    const ctx = this.context;
    const now = ctx.currentTime;
    for (const [ratio, level, duration] of [[1, 0.14, 3.2], [2.01, 0.065, 2.4], [2.74, 0.045, 1.8], [4.1, 0.022, 1.1]]) {
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = 523.25 * ratio;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(level, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain).connect(this.sfx);
      gain.connect(this.reverb);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.1);
    }
  }

  update(events, time, playing) {
    if (!this.enabled || !playing) return;
    if (events.ticks > this.lastTicks) this.tick();
    if (events.strikes > this.lastStrikes) this.bell();
    this.lastTicks = events.ticks;
    this.lastStrikes = events.strikes;
    const noteIndex = Math.floor(time / 2.5);
    if (noteIndex !== this.lastNote) {
      this.lastNote = noteIndex;
      const notes = [293.66, 329.63, 440, 369.99, 329.63, 246.94, 293.66, 440, 369.99, 329.63, 293.66, 246.94];
      this.pluck(notes[noteIndex % notes.length], 0.095);
      if (noteIndex % 4 === 0) this.pluck(146.83, 0.06);
    }
  }

  reset() {
    this.lastTicks = 0;
    this.lastStrikes = 0;
    this.lastNote = -1;
  }
}

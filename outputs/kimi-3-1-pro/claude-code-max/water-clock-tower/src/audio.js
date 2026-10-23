// All music and effects are synthesized at runtime. No samples or audio assets.
export class Soundscape {
  constructor() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx({ latencyHint: 'interactive' });
    this.muted = false;
    this.started = false;
    this.noteIndex = 0;
    this.nextNote = 0;
    this.chapter = 0;
    const c = this.ctx;

    this.master = c.createGain();
    this.master.gain.value = 0.62;
    const compressor = c.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.knee.value = 16;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.22;
    this.master.connect(compressor).connect(c.destination);

    this.music = c.createGain(); this.music.gain.value = 0.48;
    this.sfx = c.createGain(); this.sfx.gain.value = 0.68;
    this.music.connect(this.master); this.sfx.connect(this.master);

    this.reverb = c.createConvolver();
    this.reverb.buffer = this.makeImpulse(1.7);
    const reverbGain = c.createGain(); reverbGain.gain.value = 0.16;
    this.reverb.connect(reverbGain).connect(this.master);

    const noise = c.createBufferSource();
    noise.buffer = this.makeNoise(2.4); noise.loop = true;
    const waterFilter = c.createBiquadFilter(); waterFilter.type = 'bandpass'; waterFilter.frequency.value = 1050; waterFilter.Q.value = 0.5;
    this.waterGain = c.createGain(); this.waterGain.gain.value = 0.035;
    noise.connect(waterFilter).connect(this.waterGain).connect(this.sfx);
    noise.start();

    this.padFilter = c.createBiquadFilter(); this.padFilter.type = 'lowpass'; this.padFilter.frequency.value = 420;
    this.padFilter.connect(this.music);
    for (const [frequency, level] of [[73.416, 0.018], [110, 0.012], [146.832, 0.007]]) {
      const o = c.createOscillator(), gain = c.createGain();
      o.type = 'sine'; o.frequency.value = frequency; gain.gain.value = level;
      o.connect(gain).connect(this.padFilter); o.start();
    }
    this.timer = window.setInterval(() => this.schedule(), 90);
  }

  makeNoise(seconds) {
    const length = Math.floor(this.ctx.sampleRate * seconds);
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let state = 1092;
    let previous = 0;
    for (let i = 0; i < length; i++) {
      state = (state * 1664525 + 1013904223) >>> 0;
      const white = state / 2147483648 - 1;
      previous = previous * 0.35 + white * 0.65;
      data[i] = previous * 0.7;
    }
    return buffer;
  }

  makeImpulse(seconds) {
    const length = Math.floor(this.ctx.sampleRate * seconds);
    const buffer = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
    let state = 77;
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        state = (state * 1103515245 + 12345) >>> 0;
        const n = state / 2147483648 - 1;
        data[i] = n * Math.pow(1 - i / length, 2.8) * 0.32;
      }
    }
    return buffer;
  }

  async enable() {
    if (this.ctx.state !== 'running') await this.ctx.resume();
    this.started = true;
    this.nextNote = Math.max(this.nextNote, this.ctx.currentTime + 0.08);
    return this.ctx.state === 'running';
  }

  async toggle() {
    if (this.ctx.state !== 'running') {
      await this.enable();
      this.muted = false;
    } else {
      this.muted = !this.muted;
    }
    this.master.gain.setTargetAtTime(this.muted ? 0 : 0.62, this.ctx.currentTime, 0.04);
    return !this.muted && this.ctx.state === 'running';
  }

  setPaused(paused) {
    if (paused) this.ctx.suspend();
    else if (!this.muted) this.enable();
  }

  setChapter(index) {
    if (index === this.chapter) return;
    this.chapter = index;
    this.padFilter.frequency.setTargetAtTime(390 + index * 45, this.ctx.currentTime, 0.8);
    if (index > 0) this.bell([293.66, 329.63, 369.99, 440, 493.88, 587.33][index - 1] ?? 440, 0.035);
  }

  schedule() {
    if (this.ctx.state !== 'running' || this.muted) return;
    if (!this.nextNote) this.nextNote = this.ctx.currentTime + 0.05;
    const melody = [
      293.66, 0, 440, 369.99, 329.63, 0, 293.66, 220,
      246.94, 293.66, 0, 440, 493.88, 440, 369.99, 0,
      329.63, 369.99, 440, 0, 587.33, 493.88, 440, 369.99,
      293.66, 0, 369.99, 329.63, 246.94, 0, 293.66, 0,
      220, 293.66, 369.99, 440, 493.88, 0, 440, 369.99,
      329.63, 0, 293.66, 246.94, 220, 0, 293.66, 0,
    ];
    while (this.nextNote < this.ctx.currentTime + 0.22) {
      const f = melody[this.noteIndex % melody.length];
      if (f) {
        this.pluck(f, this.nextNote, this.noteIndex % 8 === 0 ? 0.065 : 0.038);
        if (this.noteIndex % 16 === 0) this.pluck(f / 2, this.nextNote, 0.045, 1.8);
      }
      this.noteIndex++;
      this.nextNote += 0.666667;
    }
  }

  pluck(frequency, when, volume = 0.04, duration = 1.25) {
    const c = this.ctx;
    const gain = c.createGain();
    const filter = c.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(2600, when); filter.frequency.exponentialRampToValueAtTime(650, when + duration);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    gain.connect(filter).connect(this.music);
    filter.connect(this.reverb);
    for (const [type, ratio, level] of [['triangle', 1, 0.72], ['sine', 2.003, 0.18]]) {
      const o = c.createOscillator(), partial = c.createGain();
      o.type = type; o.frequency.setValueAtTime(frequency * ratio, when);
      partial.gain.value = level;
      o.connect(partial).connect(gain); o.start(when); o.stop(when + duration + 0.03);
    }
  }

  bell(frequency = 440, volume = 0.05) {
    const c = this.ctx, now = c.currentTime;
    if (c.state !== 'running') return;
    for (const [ratio, level, duration] of [[1, 1, 1.8], [2.76, 0.28, 1.1], [5.4, 0.08, 0.55]]) {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = frequency * ratio;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(volume * level, now + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      o.connect(g).connect(this.sfx); g.connect(this.reverb);
      o.start(now); o.stop(now + duration + 0.02);
    }
  }

  tick() {
    const c = this.ctx, now = c.currentTime;
    if (c.state !== 'running') return;
    const source = c.createBufferSource(); source.buffer = this.makeNoise(0.06);
    const filter = c.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 1500; filter.Q.value = 1.4;
    const gain = c.createGain(); gain.gain.setValueAtTime(0.025, now); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    source.connect(filter).connect(gain).connect(this.sfx); source.start(now); source.stop(now + 0.06);
    const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(420, now); o.frequency.exponentialRampToValueAtTime(220, now + 0.045);
    g.gain.setValueAtTime(0.025, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    o.connect(g).connect(this.sfx); o.start(now); o.stop(now + 0.08);
  }

  drum(strength = 0.7, prominent = true) {
    const c = this.ctx, now = c.currentTime;
    if (c.state !== 'running') return;
    const level = strength * (prominent ? 0.22 : 0.045);
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(108, now); o.frequency.exponentialRampToValueAtTime(47, now + 0.42);
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(level, now + 0.009); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
    o.connect(g).connect(this.sfx); g.connect(this.reverb); o.start(now); o.stop(now + 0.75);
    const source = c.createBufferSource(); source.buffer = this.makeNoise(0.16);
    const filter = c.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 430;
    const ng = c.createGain(); ng.gain.setValueAtTime(level * 0.22, now); ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    source.connect(filter).connect(ng).connect(this.sfx); source.start(now); source.stop(now + 0.16);
  }

  update(wheelSpeed, chapter) {
    if (this.ctx.state !== 'running') return;
    const target = chapter === 1 || chapter === 2 ? 0.048 : 0.022;
    this.waterGain.gain.setTargetAtTime(target * Math.min(1, 0.35 + Math.abs(wheelSpeed)), this.ctx.currentTime, 0.15);
  }
}

// All sound is synthesised at runtime with the Web Audio API.
export class Sound {
  constructor() { this.ctx = null; this.ok = false; }
  start() {
    if (this.ctx) { this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = this.ctx = new AC();
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.gain.setTargetAtTime(0.55, ctx.currentTime, 0.6);
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20; comp.knee.value = 12; comp.ratio.value = 4;
    comp.attack.value = 0.004; comp.release.value = 0.25;
    this.master.connect(comp); comp.connect(ctx.destination);
    // procedural reverb
    this.verb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.6, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    this.verb.buffer = ir;
    this.verbIn = ctx.createGain(); this.verbIn.gain.value = 0.35;
    this.verbIn.connect(this.verb); this.verb.connect(this.master);
    this.sfx = ctx.createGain(); this.sfx.gain.value = 1; this.sfx.connect(this.master); this.sfx.connect(this.verbIn);
    this.mus = ctx.createGain(); this.mus.gain.value = 0.8; this.mus.connect(this.master); this.mus.connect(this.verbIn);
    // noise buffer
    const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    this.noise = nb;
    // continuous water stream
    const src = ctx.createBufferSource(); src.buffer = nb; src.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1100; bp.Q.value = 0.7;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300;
    this.waterGain = ctx.createGain(); this.waterGain.gain.value = 0;
    src.connect(bp); bp.connect(hp); hp.connect(this.waterGain); this.waterGain.connect(this.sfx);
    this.waterBP = bp;
    src.start();
    // wooden rumble while the wheel turns
    const src2 = ctx.createBufferSource(); src2.buffer = nb; src2.loop = true; src2.playbackRate.value = 0.5;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; lp.Q.value = 4;
    this.rumble = ctx.createGain(); this.rumble.gain.value = 0;
    src2.connect(lp); lp.connect(this.rumble); this.rumble.connect(this.sfx);
    src2.start();
    this.ok = true;
    this.t0 = ctx.currentTime;
  }
  get now() { return this.ctx.currentTime; }

  update(flow, wheelSpeed, waterNear) {
    if (!this.ok) return;
    const t = this.now;
    this.waterGain.gain.setTargetAtTime(0.045 * flow * (0.5 + 0.5 * waterNear), t, 0.2);
    this.waterBP.frequency.setTargetAtTime(900 + 500 * Math.sin(t * 1.7) * Math.sin(t * 0.63), t, 0.1);
    this.rumble.gain.setTargetAtTime(Math.min(0.35, wheelSpeed * 0.6), t, 0.08);
  }
  env(g, t, a, peak, decay) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + decay);
  }
  drip(level = 1) {
    if (!this.ok) return;
    const ctx = this.ctx, t = this.now + Math.random() * 0.02;
    const o = ctx.createOscillator(), g = ctx.createGain();
    const f = 900 + Math.random() * 1400;
    o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.8, t + 0.05);
    this.env(g, t, 0.003, 0.018 * level, 0.06);
    o.connect(g); g.connect(this.sfx); o.start(t); o.stop(t + 0.1);
  }
  clack(strength) {
    if (!this.ok) return;
    const ctx = this.ctx, t = this.now;
    const s = Math.min(1, strength);
    const n = ctx.createBufferSource(); n.buffer = this.noise;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 3;
    const g = ctx.createGain(); this.env(g, t, 0.002, 0.25 * s, 0.07);
    n.connect(bp); bp.connect(g); g.connect(this.sfx); n.start(t, Math.random()); n.stop(t + 0.12);
    const o = ctx.createOscillator(), g2 = ctx.createGain();
    o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(110, t + 0.1);
    this.env(g2, t, 0.002, 0.3 * s, 0.12);
    o.connect(g2); g2.connect(this.sfx); o.start(t); o.stop(t + 0.2);
  }
  thunk(strength) {
    if (!this.ok) return;
    const ctx = this.ctx, t = this.now;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.12);
    this.env(g, t, 0.003, 0.12 * Math.min(1, strength), 0.15);
    o.connect(g); g.connect(this.sfx); o.start(t); o.stop(t + 0.25);
  }
  bell(strength) {
    if (!this.ok) return;
    const ctx = this.ctx, t = this.now;
    const s = Math.min(1, strength);
    const base = 392;
    [[1, 0.5, 3.2], [2.0, 0.25, 2.2], [2.76, 0.18, 1.6], [3.0, 0.1, 1.2], [4.07, 0.08, 0.9], [5.4, 0.05, 0.6]].forEach(([r, a, d]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = base * r * (1 + (Math.random() - 0.5) * 0.002);
      this.env(g, t, 0.003, 0.22 * a * s, d);
      o.connect(g); g.connect(this.sfx); o.start(t); o.stop(t + d + 0.1);
    });
  }
  drum(strength) {
    if (!this.ok) return;
    const ctx = this.ctx, t = this.now;
    const s = Math.min(1, strength);
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(52, t + 0.25);
    this.env(g, t, 0.004, 0.55 * s, 0.6);
    o.connect(g); g.connect(this.sfx); o.start(t); o.stop(t + 0.8);
    const n = ctx.createBufferSource(); n.buffer = this.noise;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
    const g2 = ctx.createGain(); this.env(g2, t, 0.002, 0.18 * s, 0.12);
    n.connect(lp); lp.connect(g2); g2.connect(this.sfx); n.start(t, Math.random()); n.stop(t + 0.2);
  }
  // A quiet pentatonic score (gong-shang-jue-zhi-yu) with a plucked-zither timbre.
  music(duration = 36) {
    if (!this.ok) return;
    const ctx = this.ctx, t0 = this.now + 0.2;
    const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
    // drone pad
    [50, 57, 62].forEach((m, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = midi(m) * (1 + i * 0.0015);
      f.type = 'lowpass'; f.frequency.value = 420; f.Q.value = 0.5;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.022, t0 + 4);
      g.gain.setValueAtTime(0.022, t0 + duration - 4);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      o.connect(f); f.connect(g); g.connect(this.mus); o.start(t0); o.stop(t0 + duration + 0.1);
    });
    // melody (D pentatonic): D E F# A B
    const P = [62, 64, 66, 69, 71, 74, 76, 78, 81];
    const phrase = [
      [0, 5, 1.0], [1.2, 4, 0.6], [1.8, 3, 0.6], [2.4, 2, 1.2], [3.6, 3, 0.6], [4.2, 1, 1.8],
      [6.0, 3, 0.6], [6.6, 4, 0.6], [7.2, 5, 1.2], [8.4, 6, 0.6], [9.0, 5, 0.6], [9.6, 4, 2.0],
      [12.0, 5, 0.6], [12.6, 6, 0.6], [13.2, 7, 1.2], [14.4, 6, 0.6], [15.0, 5, 0.6], [15.6, 3, 1.8],
      [18.0, 4, 0.6], [18.6, 3, 0.6], [19.2, 2, 0.6], [19.8, 1, 0.6], [20.4, 0, 2.0],
      [22.8, 2, 0.6], [23.4, 3, 0.6], [24.0, 5, 1.2], [25.2, 4, 0.6], [25.8, 3, 1.8],
      [27.6, 5, 0.6], [28.2, 6, 0.6], [28.8, 8, 1.2], [30.0, 7, 0.6], [30.6, 6, 0.6], [31.2, 5, 2.4],
      [33.6, 0, 3.0],
    ];
    for (const [tt, n, d] of phrase) {
      if (tt > duration - 1) break;
      this.pluck(t0 + 1.2 + tt, midi(P[n]), d, 0.09);
      if (Math.floor(tt / 6) % 2 === 1 && d >= 1.2) this.pluck(t0 + 1.2 + tt, midi(P[n] - 12), d, 0.05);
    }
  }
  pluck(t, f, d, amp) {
    const ctx = this.ctx;
    const g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(f * 6, t); lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.6);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(amp, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d + 1.2);
    [[1, 'triangle', 1], [2, 'sine', 0.35], [3, 'sine', 0.12]].forEach(([r, type, a]) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f * r * 1.006, t); o.frequency.exponentialRampToValueAtTime(f * r, t + 0.08);
      og.gain.value = a;
      o.connect(og); og.connect(lp); o.start(t); o.stop(t + d + 1.3);
    });
    lp.connect(g); g.connect(this.mus);
  }
}

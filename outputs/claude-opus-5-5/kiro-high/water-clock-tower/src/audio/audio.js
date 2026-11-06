// 全部声音在运行时用 Web Audio API 合成：配乐（五声音阶拨弦 + 持续音）、水声、机构声、钟、鼓。
// 最终经过压缩器与限幅器，避免爆音。

const PENTA = [0, 2, 4, 7, 9]; // 宫 商 角 徵 羽
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.started = false;
    this.lastDrip = 0;
    this.listener = [0, 0, 0];
  }

  async start() {
    if (this.started) {
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC({ latencyHint: 'interactive' });
    this.ctx = ctx;
    this.started = true;

    // 主链：各总线 → 压缩 → 限幅 → 主音量
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.knee.value = 12;
    comp.ratio.value = 4;
    comp.attack.value = 0.004;
    comp.release.value = 0.25;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -4;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.001;
    limiter.release.value = 0.1;
    this.mix = ctx.createGain();
    this.mix.gain.value = 0.9;
    this.mix.connect(comp).connect(limiter).connect(this.master).connect(ctx.destination);
    this.master.gain.setTargetAtTime(0.85, ctx.currentTime, 0.6);
    // 电平监测（仅用于自检，不影响输出）
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.master.connect(this.analyser);
    this.meterBuf = new Float32Array(this.analyser.fftSize);

    // 混响（程序生成的冲激响应）
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.makeImpulse(3.2, 2.6);
    this.reverbGain = ctx.createGain();
    this.reverbGain.gain.value = 0.32;
    this.reverb.connect(this.reverbGain).connect(this.mix);

    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = 0.3;
    this.musicBus.connect(this.mix);
    this.musicBus.connect(this.reverb);
    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = 0.75;
    this.sfxBus.connect(this.mix);
    this.sfxSend = ctx.createGain();
    this.sfxSend.gain.value = 0.35;
    this.sfxBus.connect(this.sfxSend).connect(this.reverb);

    this.noise = this.makeNoise(2.5);
    this.startWater();
    this.startRumble();
    this.startPad();
    this.musicStart = ctx.currentTime + 0.3;
    this.nextNoteTime = this.musicStart;
    this.noteIndex = 0;
    this.schedTimer = setInterval(() => this.scheduleMusic(), 60);
  }

  makeNoise(sec) {
    const ctx = this.ctx;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * sec), ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.97 * b0 + 0.03 * w; // 略带粉红
      d[i] = w * 0.6 + b0 * 2.2;
    }
    return buf;
  }

  makeImpulse(sec, decay) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay) * (i < 200 ? i / 200 : 1);
      }
    }
    return buf;
  }

  // ---------------- 持续层 ----------------
  startWater() {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1500;
    bp.Q.value = 0.7;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 400;
    this.waterGain = ctx.createGain();
    this.waterGain.gain.value = 0;
    src.connect(hp).connect(bp).connect(this.waterGain).connect(this.sfxBus);
    src.start();
    this.waterBp = bp;
    // 水流的起伏
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 3.7;
    const lg = ctx.createGain();
    lg.gain.value = 260;
    lfo.connect(lg).connect(bp.frequency);
    lfo.start();
  }

  startRumble() {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    src.playbackRate.value = 0.5;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 220;
    this.rumbleGain = ctx.createGain();
    this.rumbleGain.gain.value = 0;
    src.connect(lp).connect(this.rumbleGain).connect(this.sfxBus);
    src.start();
  }

  startPad() {
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.setTargetAtTime(0.16, ctx.currentTime + 0.5, 2.0);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 700;
    lp.Q.value = 0.4;
    lp.connect(out).connect(this.musicBus);
    for (const [m, det, type] of [
      [38, -4, 'sawtooth'],
      [45, 5, 'sawtooth'],
      [50, 0, 'triangle'],
      [57, 3, 'sine'],
    ]) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = midi(m);
      o.detune.value = det;
      const g = ctx.createGain();
      g.gain.value = type === 'sawtooth' ? 0.12 : 0.25;
      o.connect(g).connect(lp);
      o.start();
    }
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lg = ctx.createGain();
    lg.gain.value = 260;
    lfo.connect(lg).connect(lp.frequency);
    lfo.start();
    this.padOut = out;
  }

  // ---------------- 配乐：五声音阶的拨弦旋律 ----------------
  scheduleMusic() {
    const ctx = this.ctx;
    if (!ctx) return;
    const beat = 60 / 76;
    // 旋律（音阶级数, 时值拍数）—— D 宫调
    const phrase = [
      [5, 1], [6, 0.5], [7, 0.5], [9, 2],
      [7, 1], [6, 1], [5, 2],
      [3, 1], [5, 1], [6, 1.5], [5, 0.5],
      [3, 2], [2, 2],
      [5, 1], [7, 1], [9, 1.5], [10, 0.5],
      [9, 1], [7, 1], [6, 2],
      [5, 1], [6, 0.5], [5, 0.5], [3, 1], [2, 1],
      [0, 4],
    ];
    while (this.nextNoteTime < ctx.currentTime + 0.25) {
      const [deg, dur] = phrase[this.noteIndex % phrase.length];
      const oct = Math.floor(deg / 5);
      const m = 50 + oct * 12 + PENTA[((deg % 5) + 5) % 5];
      this.pluck(this.nextNoteTime, midi(m), 0.13);
      // 低音每小节一下
      if (this.noteIndex % 4 === 0) this.pluck(this.nextNoteTime, midi(38 + PENTA[(this.noteIndex / 4) % 2 ? 3 : 0]), 0.09, 2.6);
      this.nextNoteTime += dur * beat;
      this.noteIndex += 1;
    }
  }

  pluck(t, f, amp, len = 1.8) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp, t + 0.006);
    g.gain.exponentialRampToValueAtTime(amp * 0.35, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(f * 7, t);
    lp.frequency.exponentialRampToValueAtTime(f * 1.6, t + 0.6);
    lp.connect(g).connect(this.musicBus);
    const parts = [
      [1, 1, 'triangle'],
      [2, 0.35, 'sine'],
      [3, 0.12, 'sine'],
    ];
    for (const [h, a, type] of parts) {
      const o = ctx.createOscillator();
      o.type = type;
      // 古琴式的轻微滑音
      o.frequency.setValueAtTime(f * h * 0.985, t);
      o.frequency.exponentialRampToValueAtTime(f * h, t + 0.09);
      const og = ctx.createGain();
      og.gain.value = a;
      o.connect(og).connect(lp);
      o.start(t);
      o.stop(t + len + 0.05);
    }
  }

  // ---------------- 事件音效 ----------------
  spatial(pos) {
    if (!pos) return 1;
    const dx = pos[0] - this.listener[0];
    const dy = pos[1] - this.listener[1];
    const dz = pos[2] - this.listener[2];
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return Math.min(1, Math.max(0.18, 3.2 / Math.max(0.5, d)));
  }

  bell(v, pos) {
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.01;
    const a = Math.min(1, v) * 0.32 * this.spatial(pos);
    const f0 = 392;
    const partials = [
      [0.5, 0.5, 4.5],
      [1, 1, 3.6],
      [1.19, 0.5, 2.6],
      [2.0, 0.45, 2.2],
      [2.52, 0.3, 1.6],
      [3.0, 0.22, 1.2],
      [4.07, 0.12, 0.8],
    ];
    const out = ctx.createGain();
    out.gain.value = a;
    out.connect(this.sfxBus);
    for (const [r, amp, dec] of partials) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f0 * r * (1 + (Math.random() - 0.5) * 0.002);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(amp, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + dec + 0.1);
    }
    this.noiseHit(t, 2600, 4, 0.05, a * 0.4);
  }

  drum(v, pos) {
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.01;
    const a = Math.min(1, v) * 0.75 * this.spatial(pos);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(58, t + 0.28);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(a, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);
    o.connect(g).connect(this.sfxBus);
    o.start(t);
    o.stop(t + 0.8);
    const o2 = ctx.createOscillator();
    o2.type = 'sine';
    o2.frequency.setValueAtTime(205, t);
    o2.frequency.exponentialRampToValueAtTime(150, t + 0.2);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(a * 0.35, t);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o2.connect(g2).connect(this.sfxBus);
    o2.start(t);
    o2.stop(t + 0.35);
    this.noiseHit(t, 900, 1.2, 0.08, a * 0.5, 'lowpass');
  }

  noiseHit(t, freq, q, dur, amp, type = 'bandpass') {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(amp, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(this.sfxBus);
    const off = Math.random() * 2;
    src.start(t, off, dur + 0.05);
  }

  /** 木质"咔嗒"：天关抬起 / 落下、壶耳碰格叉 */
  clack(v, pos, pitch = 1) {
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.005;
    const a = Math.min(1, v) * 0.42 * this.spatial(pos);
    this.noiseHit(t, 1400 * pitch, 3, 0.05, a);
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(320 * pitch, t);
    o.frequency.exponentialRampToValueAtTime(180 * pitch, t + 0.06);
    const g = ctx.createGain();
    g.gain.setValueAtTime(a * 0.5, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g).connect(this.sfxBus);
    o.start(t);
    o.stop(t + 0.15);
  }

  /** 金木相击的"咚"：辐条销撞上天关 */
  thunk(v, pos) {
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.005;
    const a = Math.min(1, v / 0.6) * 0.5 * this.spatial(pos);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(170, t);
    o.frequency.exponentialRampToValueAtTime(95, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(a, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(g).connect(this.sfxBus);
    o.start(t);
    o.stop(t + 0.32);
    const o2 = ctx.createOscillator();
    o2.type = 'square';
    o2.frequency.value = 1240;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(a * 0.05, t);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    o2.connect(g2).connect(this.sfxBus);
    o2.start(t);
    o2.stop(t + 0.1);
    this.noiseHit(t, 600, 1.5, 0.06, a * 0.6);
  }

  drip(n, pos) {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    if (now - this.lastDrip < 0.07) return;
    this.lastDrip = now;
    const a = 0.06 * Math.min(1, 0.4 + n * 0.15) * this.spatial(pos);
    const t = now + Math.random() * 0.03;
    const f = 900 + Math.random() * 1300;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 1.9, t + 0.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(a, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g).connect(this.sfxBus);
    o.start(t);
    o.stop(t + 0.1);
  }

  /** 每帧调用：根据仿真状态更新持续音层 */
  setContinuous({ water = 0, rumble = 0 }) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.waterGain.gain.setTargetAtTime(Math.min(0.5, water), t, 0.2);
    this.rumbleGain.gain.setTargetAtTime(Math.min(0.6, rumble), t, 0.08);
  }

  /** 当前输出峰值（线性） */
  peak() {
    if (!this.analyser) return 0;
    this.analyser.getFloatTimeDomainData(this.meterBuf);
    let m = 0;
    for (let i = 0; i < this.meterBuf.length; i++) m = Math.max(m, Math.abs(this.meterBuf[i]));
    return m;
  }

  setListener(p) {
    this.listener = [p.x, p.y, p.z];
  }

  fadeOutMusic(sec = 3) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.musicBus.gain.setTargetAtTime(0.0, t, sec / 3);
  }

  restartMusic() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.musicBus.gain.cancelScheduledValues(t);
    this.musicBus.gain.setTargetAtTime(0.3, t, 0.3);
    this.nextNoteTime = t + 0.3;
    this.noteIndex = 0;
  }
}

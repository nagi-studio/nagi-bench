//
//  全部音效与配乐由 Web Audio API 运行时合成, 不使用任何音频文件
//
export class Audio8 {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    const c = this.ctx;
    this.master = c.createGain();
    this.master.gain.value = 0.0;
    // 限幅, 防爆音
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 24;
    comp.ratio.value = 8; comp.attack.value = .004; comp.release.value = .24;
    this.master.connect(comp).connect(c.destination);

    this.noise = this.makeNoise();
    this.startAmbience();
    this.started = false;
  }

  fade(v, t = 1.6) {
    const g = this.master.gain, n = this.ctx.currentTime;
    g.cancelScheduledValues(n); g.setValueAtTime(g.value, n);
    g.linearRampToValueAtTime(v, n + t);
  }

  makeNoise() {
    const c = this.ctx, len = c.sampleRate * 2;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {                     // 粉噪
      const wn = Math.random() * 2 - 1;
      last = (last + .04 * wn) / 1.04;
      d[i] = last * 3.2 + wn * .18;
    }
    return buf;
  }

  startAmbience() {
    const c = this.ctx;
    // 流水
    const s1 = c.createBufferSource(); s1.buffer = this.noise; s1.loop = true;
    const f1 = c.createBiquadFilter(); f1.type = "bandpass"; f1.frequency.value = 720; f1.Q.value = .6;
    const g1 = c.createGain(); g1.gain.value = .34;
    s1.connect(f1).connect(g1).connect(this.master); s1.start();
    const lfo = c.createOscillator(); lfo.frequency.value = .16;
    const lg = c.createGain(); lg.gain.value = .12;
    lfo.connect(lg).connect(g1.gain); lfo.start();
    this.waterGain = g1;
    // 山谷风
    const s2 = c.createBufferSource(); s2.buffer = this.noise; s2.loop = true;
    const f2 = c.createBiquadFilter(); f2.type = "lowpass"; f2.frequency.value = 240;
    const g2 = c.createGain(); g2.gain.value = .5;
    s2.connect(f2).connect(g2).connect(this.master); s2.start();
    const lfo2 = c.createOscillator(); lfo2.frequency.value = .07;
    const lg2 = c.createGain(); lg2.gain.value = .3;
    lfo2.connect(lg2).connect(g2.gain); lfo2.start();

    this.musicGain = c.createGain(); this.musicGain.gain.value = .5;
    this.musicGain.connect(this.master);
    this.nextNote = c.currentTime + .4;
    this.step = 0;
  }

  /* 五声音阶拨弦(慢速, 作配乐) */
  tickMusic() {
    const c = this.ctx, t = c.currentTime;
    if (t < this.nextNote) return;
    const beat = 1.36;
    this.nextNote += beat;
    const scale = [0, 2, 4, 7, 9, 12, 14, 16];
    const root = 146.83;                                 // D3
    const semi = scale[this.step % scale.length];
    this.step++;
    const f = root * Math.pow(2, semi / 12);
    const o = c.createOscillator(); o.type = "triangle"; o.frequency.value = f;
    const o2 = c.createOscillator(); o2.type = "sine"; o2.frequency.value = f * 2.002;
    const g = c.createGain();
    const vol = (this.step % 4 === 0) ? .16 : .085;
    g.gain.setValueAtTime(0, this.nextNote);
    g.gain.linearRampToValueAtTime(vol, this.nextNote + .015);
    g.gain.exponentialRampToValueAtTime(.0008, this.nextNote + 2.4);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2100;
    o.connect(g); o2.connect(g); g.connect(lp).connect(this.musicGain);
    o.start(this.nextNote); o2.start(this.nextNote);
    o.stop(this.nextNote + 2.5); o2.stop(this.nextNote + 2.5);
  }

  burst({ f = 900, q = 1.1, dur = .3, vol = .3, type = "bandpass" } = {}) {
    const c = this.ctx, t = c.currentTime;
    const s = c.createBufferSource(); s.buffer = this.noise;
    s.playbackRate.value = .8 + Math.random() * .5;
    const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(.0006, t + dur);
    s.connect(fl).connect(g).connect(this.master);
    s.start(t); s.stop(t + dur + .05);
  }

  tone({ f = 120, f2 = 60, dur = .3, vol = .3, type = "sine" } = {}) {
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(.0006, t + dur);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t + dur + .05);
  }

  /* ---- 具名音效 ---- */
  escape() {                                     // 擒纵: 木质咔嗒 + 闷响
    this.burst({ f: 1750, q: 1.4, dur: .12, vol: .34 });
    this.burst({ f: 520, q: .8, dur: .22, vol: .20 });
    this.tone({ f: 150, f2: 62, dur: .18, vol: .30 });
  }
  pour() {                                       // 水袋落斗
    this.burst({ f: 980, q: .7, dur: .42, vol: .26 });
    this.tone({ f: 300, f2: 120, dur: .16, vol: .12 });
  }
  dump() {                                       // 水袋落回下池
    this.burst({ f: 620, q: .5, dur: .55, vol: .30 });
    this.tone({ f: 190, f2: 70, dur: .28, vol: .16 });
  }
  drum() {                                       // 报时鼓
    this.tone({ f: 108, f2: 48, dur: .72, vol: .5, type: "sine" });
    this.burst({ f: 260, q: .6, dur: .3, vol: .3 });
    setTimeout(() => this.tone({ f: 96, f2: 44, dur: .5, vol: .3 }), 170);
  }
  bell() {                                       // 钟声
    const c = this.ctx, t = c.currentTime;
    [1, 2.02, 2.99, 4.21, 5.42].forEach((h, i) => {
      const o = c.createOscillator(); o.type = "sine";
      o.frequency.value = 196 * h;
      const g = c.createGain();
      const v = .22 / (1 + i * .9);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(v, t + .01);
      g.gain.exponentialRampToValueAtTime(.0005, t + 3.4 - i * .35);
      o.connect(g).connect(this.master);
      o.start(t); o.stop(t + 3.6);
    });
  }
  setWater(v) { this.waterGain && this.waterGain.gain.setTargetAtTime(v, this.ctx.currentTime, .5); }
}

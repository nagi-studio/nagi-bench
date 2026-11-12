import type { WebAudioCueBus, SoundFactoryContext } from "@agentbench/cinematic-player";

/* 全部声音在运行时由 Web Audio API 合成。没有任何采样或音频文件。 */

type Ctx = SoundFactoryContext;

const noiseCache = new WeakMap<BaseAudioContext, AudioBuffer>();
function noiseBuf(ac: BaseAudioContext): AudioBuffer {
  let b = noiseCache.get(ac);
  if (!b) {
    b = ac.createBuffer(2, ac.sampleRate * 4, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      let seed = 1234 + c * 999;
      for (let i = 0; i < d.length; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        d[i] = seed / 2147483648 - 1;
      }
    }
    noiseCache.set(ac, b);
  }
  return b;
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 地下室：砖墙小房间，强烈、密集的早期反射 + 短而亮的尾音。 */
const roomIRCache = new WeakMap<BaseAudioContext, AudioBuffer>();
function basementIR(ac: BaseAudioContext): AudioBuffer {
  let b = roomIRCache.get(ac);
  if (b) return b;
  const len = Math.floor(ac.sampleRate * 1.6);
  b = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    const r = rng(77 + c);
    for (let i = 0; i < len; i++) {
      const t = i / ac.sampleRate;
      d[i] = (r() * 2 - 1) * Math.exp(-t / 0.28) * 0.5;
    }
    // 墙、地面、天花板之间的早期反射
    const taps = [0.0031, 0.0047, 0.0068, 0.0089, 0.011, 0.0137, 0.0163, 0.0201, 0.0246, 0.031, 0.037, 0.045];
    taps.forEach((t, k) => {
      const i = Math.floor((t + c * 0.0007 * (k % 3)) * ac.sampleRate);
      if (i < len) d[i] += (k % 2 ? -1 : 1) * 0.9 * Math.exp(-k * 0.16);
    });
  }
  roomIRCache.set(ac, b);
  return b;
}

class Voice {
  readonly g: GainNode;
  private nodes: AudioScheduledSourceNode[] = [];
  constructor(public ctx: Ctx, level = 1) {
    this.g = ctx.audioContext.createGain();
    this.g.gain.value = level;
    this.g.connect(ctx.output);
  }
  get ac() { return this.ctx.audioContext; }
  get now() { return this.ctx.audioContext.currentTime; }
  noise(dest: AudioNode, t0: number, dur: number, offset = Math.random() * 3) {
    const src = this.ac.createBufferSource();
    src.buffer = noiseBuf(this.ac);
    src.loop = true;
    src.connect(dest);
    src.start(t0, offset % 3.5);
    src.stop(t0 + dur);
    this.nodes.push(src);
    return src;
  }
  osc(type: OscillatorType, freq: number, dest: AudioNode, t0: number, dur: number) {
    const o = this.ac.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    o.connect(dest);
    o.start(t0);
    o.stop(t0 + dur);
    this.nodes.push(o);
    return o;
  }
  gain(v = 0, dest: AudioNode = this.g) {
    const g = this.ac.createGain();
    g.gain.value = v;
    g.connect(dest);
    return g;
  }
  filter(type: BiquadFilterType, freq: number, q = 0.7, dest: AudioNode = this.g) {
    const f = this.ac.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    f.connect(dest);
    return f;
  }
  handle() {
    return {
      stop: () => {
        for (const n of this.nodes) { try { n.stop(); } catch { /* */ } }
        try { this.g.disconnect(); } catch { /* */ }
      },
    };
  }
}

/** 包络：t0 起 attack 到 peak，再在 decay 秒内指数衰减。 */
function env(p: AudioParam, t0: number, peak: number, attack: number, decay: number) {
  p.setValueAtTime(0.0001, t0);
  p.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t0 + attack);
  p.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
}

/** 对一个长氛围 cue，按周期从 offset 开始排程事件。 */
function loopEvents(v: Voice, period: number, fn: (t: number, k: number) => void, jitter = 0, seed = 1) {
  const dur = v.ctx.cue.end - v.ctx.cue.start - v.ctx.offset;
  const r = rng(seed);
  const first = Math.ceil(v.ctx.offset / period);
  for (let k = first; k * period < v.ctx.cue.end - v.ctx.cue.start; k++) {
    const local = k * period + (r() - 0.5) * jitter - v.ctx.offset;
    if (local < 0 || local > dur) continue;
    fn(v.now + local, k);
  }
}

function remain(c: Ctx) { return Math.max(0.05, c.cue.end - c.cue.start - c.offset); }

/** 舒缓的持续音：数个微失谐的锯齿波经低通滤波，带缓慢呼吸 */
function pad(c: Ctx, freqs: number[], cutoff: number, level: number, type: OscillatorType = "sawtooth") {
  const v = new Voice(c, 1);
  const d = remain(c);
  const t = v.now;
  const master = v.gain(0);
  const fadeIn = c.offset < 0.5 ? 3 : 0.6;
  master.gain.setValueAtTime(0.0001, t);
  master.gain.linearRampToValueAtTime(level, t + Math.min(fadeIn, d * 0.4));
  master.gain.setValueAtTime(level, t + Math.max(d - 3, d * 0.6));
  master.gain.linearRampToValueAtTime(0.0001, t + d);
  const lp = v.filter("lowpass", cutoff, 0.5, master);
  const lfo = v.osc("sine", 0.07, v.gain(cutoff * 0.35, lp.frequency), t, d + 0.1);
  void lfo;
  freqs.forEach((f, i) => {
    for (const det of [-6, 5]) {
      const o = v.osc(type, f, v.gain(0.05 / freqs.length, lp), t, d + 0.1);
      o.detune.value = det + i;
    }
  });
  return v.handle();
}

export function registerSounds(audio: WebAudioCueBus<any>) {
  // ── 太空服内部 ──
  audio.define("suit-fan", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const g = v.gain(0.05);
    const lp = v.filter("lowpass", 520, 0.6, g);
    v.noise(lp, v.now, d);
    const hum = v.gain(0.012);
    v.osc("triangle", 118, hum, v.now, d);
    return v.handle();
  });

  const breath = (period: number, inhale: number, exhale: number, depth: number, seed: number) => (c: Ctx) => {
    const v = new Voice(c);
    loopEvents(v, period, (t) => {
      const bpIn = v.filter("bandpass", 900, 0.9, v.g);
      const gi = v.gain(0, bpIn);
      gi.gain.setValueAtTime(0.0001, t);
      gi.gain.linearRampToValueAtTime(0.11 * depth, t + inhale * 0.6);
      gi.gain.linearRampToValueAtTime(0.0001, t + inhale);
      v.noise(gi, t, inhale + 0.05);
      const bpOut = v.filter("bandpass", 520, 0.8, v.g);
      const go = v.gain(0, bpOut);
      const te = t + inhale + 0.25;
      go.gain.setValueAtTime(0.0001, te);
      go.gain.linearRampToValueAtTime(0.13 * depth, te + 0.25);
      go.gain.linearRampToValueAtTime(0.0001, te + exhale);
      v.noise(go, te, exhale + 0.05);
    }, period * 0.08, seed);
    return v.handle();
  };
  audio.define("breath-calm", breath(4.6, 1.5, 2.0, 1, 3));
  audio.define("breath-tense", breath(2.5, 0.9, 1.1, 1.25, 5));
  // 屏住呼吸：几乎无气流，只剩偶尔一次很浅的漏气
  audio.define("breath-held", breath(6.5, 0.6, 0.9, 0.45, 9));

  audio.define("radio-bed", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const t = v.now;
    // 按键咔哒 + 静电底噪 + 收尾 squelch
    const click = (tt: number) => {
      const g = v.gain(0, v.filter("highpass", 1800, 0.7));
      env(g.gain, tt, 0.25, 0.002, 0.05);
      v.noise(g, tt, 0.08);
    };
    if (c.offset < 0.1) click(t);
    const hiss = v.gain(0.018, v.filter("bandpass", 2600, 0.6));
    v.noise(hiss, t, d);
    click(t + d - 0.08);
    return v.handle();
  });

  audio.define("radio-alarm", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const bp = v.filter("bandpass", 1500, 1.4);
    const shaper = v.ac.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const x = i / 128 - 1; curve[i] = Math.tanh(x * 4); }
    shaper.curve = curve;
    shaper.connect(bp);
    const g = v.gain(0, shaper);
    const o = v.osc("square", 880, g, v.now, d);
    for (let k = 0; k * 0.5 < d; k++) {
      const tt = v.now + k * 0.5;
      o.frequency.setValueAtTime(k % 2 ? 660 : 880, tt);
      g.gain.setValueAtTime(0.09, tt);
      g.gain.setValueAtTime(0.02, tt + 0.42);
    }
    return v.handle();
  });

  // 真空中的枪声：没有空气，外部声音不存在。只剩通过手臂与服装传导的低频闷震。
  audio.define("vac-thump", (c) => {
    const v = new Voice(c);
    if (c.offset > 0.1) return v.handle();
    const t = v.now;
    const g = v.gain(0);
    env(g.gain, t, 0.5, 0.004, 0.22);
    const o = v.osc("sine", 72, g, t, 0.4);
    o.frequency.exponentialRampToValueAtTime(34, t + 0.25);
    const n = v.gain(0, v.filter("lowpass", 260, 0.8));
    env(n.gain, t, 0.35, 0.002, 0.08);
    v.noise(n, t, 0.15);
    // 服装硬件里极轻的一声金属颤
    const r = v.gain(0, v.filter("bandpass", 1300, 8));
    env(r.gain, t + 0.005, 0.05, 0.002, 0.12);
    v.noise(r, t, 0.2);
    return v.handle();
  });

  audio.define("reload-vac", (c) => {
    const v = new Voice(c);
    const t = v.now - c.offset;
    [0.0, 0.32, 0.5].forEach((dt, i) => {
      if (dt < c.offset) return;
      const g = v.gain(0, v.filter("lowpass", i === 2 ? 500 : 900, 1.5));
      env(g.gain, t + dt, 0.4, 0.002, 0.07);
      v.noise(g, t + dt, 0.12);
      const k = v.gain(0);
      env(k.gain, t + dt, 0.15, 0.002, 0.08);
      v.osc("sine", 140 - i * 20, k, t + dt, 0.12);
    });
    return v.handle();
  });

  const muffledClick = (freq: number, level: number, decay: number) => (c: Ctx) => {
    const v = new Voice(c);
    if (c.offset > 0.1) return v.handle();
    const g = v.gain(0, v.filter("lowpass", freq, 2));
    env(g.gain, v.now, level, 0.002, decay);
    v.noise(g, v.now, decay + 0.1);
    const k = v.gain(0);
    env(k.gain, v.now, level * 0.4, 0.002, decay);
    v.osc("sine", freq / 6, k, v.now, decay + 0.1);
    return v.handle();
  };
  audio.define("ring", (c) => {
    const v = new Voice(c);
    if (c.offset > 0.2) return v.handle();
    // 金属护环转动：几级棘轮 + 最后的锁扣
    for (let i = 0; i < 5; i++) {
      const tt = v.now + i * 0.09;
      const g = v.gain(0, v.filter("bandpass", 700, 3));
      env(g.gain, tt, 0.25, 0.002, 0.04);
      v.noise(g, tt, 0.08);
    }
    const g = v.gain(0, v.filter("lowpass", 600, 2));
    env(g.gain, v.now + 0.55, 0.5, 0.002, 0.12);
    v.noise(g, v.now + 0.55, 0.2);
    return v.handle();
  });
  audio.define("seal-hiss", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const g = v.gain(0, v.filter("bandpass", 3200, 1.2));
    g.gain.setValueAtTime(0.18, v.now);
    g.gain.exponentialRampToValueAtTime(0.001, v.now + d);
    v.noise(g, v.now, d);
    return v.handle();
  });
  audio.define("holster", muffledClick(700, 0.4, 0.15));
  audio.define("magnet", muffledClick(500, 0.7, 0.1));
  audio.define("maginsert-vac", muffledClick(800, 0.6, 0.09));
  audio.define("hatch-light", (c) => {
    const v = new Voice(c);
    const g = v.gain(0);
    env(g.gain, v.now, 0.04, 0.01, 0.3);
    v.osc("sine", 1320, g, v.now, 0.4);
    return v.handle();
  });

  audio.define("heart", (c) => {
    const v = new Voice(c);
    const d = c.cue.end - c.cue.start;
    // 心跳先慢后快
    let tt = 0;
    const times: number[] = [];
    while (tt < d) { times.push(tt); tt += 0.95 - 0.35 * (tt / d); }
    for (const t0 of times) {
      if (t0 < c.offset) continue;
      for (const [dt, lv] of [[0, 0.5], [0.16, 0.32]] as const) {
        const at = v.now + t0 - c.offset + dt;
        const g = v.gain(0);
        env(g.gain, at, lv, 0.01, 0.16);
        const o = v.osc("sine", 52, g, at, 0.25);
        o.frequency.exponentialRampToValueAtTime(36, at + 0.15);
      }
    }
    return v.handle();
  });

  audio.define("hit-sting", (c) => {
    // 主观化：一个下沉的低频长音，像耳膜被压住
    const v = new Voice(c);
    const d = remain(c);
    const g = v.gain(0);
    g.gain.setValueAtTime(0.0001, v.now);
    g.gain.linearRampToValueAtTime(0.25, v.now + 0.3);
    g.gain.linearRampToValueAtTime(0.0001, v.now + d);
    const o = v.osc("sawtooth", 82, v.filter("lowpass", 300, 1, g), v.now, d);
    o.frequency.linearRampToValueAtTime(55, v.now + d);
    const o2 = v.osc("sine", 41, g, v.now, d);
    void o2;
    return v.handle();
  });

  audio.define("thruster", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const g = v.gain(0);
    g.gain.setValueAtTime(0.0001, v.now);
    g.gain.linearRampToValueAtTime(0.2, v.now + 0.6);
    g.gain.setValueAtTime(0.2, v.now + d - 2);
    g.gain.linearRampToValueAtTime(0.0001, v.now + d);
    // 从背包经骨架传进头盔：低沉的嘶声 + 阀门脉动
    v.noise(v.filter("lowpass", 380, 0.8, g), v.now, d);
    const pulse = v.gain(0.06, g);
    v.osc("sine", 63, pulse, v.now, d);
    return v.handle();
  });

  // ── 胡同与老宅 ──
  audio.define("hutong", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const wind = v.gain(0.03, v.filter("lowpass", 700, 0.5));
    v.noise(wind, v.now, d);
    // 远处鸽哨：两个略失谐的正弦，缓慢起伏
    const pg = v.gain(0);
    const tStart = v.now + Math.max(0, 2 - c.offset);
    pg.gain.setValueAtTime(0.0001, v.now);
    pg.gain.linearRampToValueAtTime(0.03, tStart + 2);
    pg.gain.linearRampToValueAtTime(0.0001, tStart + 8);
    for (const f of [1180, 1192, 1770]) {
      const o = v.osc("sine", f, pg, v.now, d);
      o.frequency.linearRampToValueAtTime(f * 0.97, v.now + d);
    }
    // 远处自行车铃
    loopEvents(v, 5.3, (t) => {
      for (let i = 0; i < 2; i++) {
        const g = v.gain(0);
        env(g.gain, t + i * 0.13, 0.03, 0.003, 0.6);
        v.osc("sine", 2900, g, t + i * 0.13, 0.7);
        v.osc("sine", 4170, g, t + i * 0.13, 0.7);
      }
    }, 1.2, 4);
    return v.handle();
  });
  audio.define("door-creak", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const g = v.gain(0, v.filter("bandpass", 600, 6));
    g.gain.setValueAtTime(0.0001, v.now);
    g.gain.linearRampToValueAtTime(0.15, v.now + 0.4);
    g.gain.linearRampToValueAtTime(0.0001, v.now + d);
    const o = v.osc("sawtooth", 90, g, v.now, d);
    o.frequency.linearRampToValueAtTime(140, v.now + d * 0.6);
    o.frequency.linearRampToValueAtTime(110, v.now + d);
    return v.handle();
  });
  audio.define("room", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const tone = v.gain(0.012, v.filter("lowpass", 300, 0.5));
    v.noise(tone, v.now, d);
    // 老座钟
    loopEvents(v, 1.0, (t, k) => {
      const g = v.gain(0, v.filter("bandpass", k % 2 ? 2400 : 2000, 6));
      env(g.gain, t, 0.08, 0.001, 0.05);
      v.noise(g, t, 0.08);
    });
    return v.handle();
  });
  audio.define("tea-pour", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const bp = v.filter("bandpass", 1400, 2.5);
    const g = v.gain(0, bp);
    g.gain.setValueAtTime(0.0001, v.now);
    g.gain.linearRampToValueAtTime(0.18, v.now + 0.2);
    g.gain.linearRampToValueAtTime(0.0001, v.now + d);
    bp.frequency.linearRampToValueAtTime(700, v.now + d);
    v.noise(g, v.now, d);
    return v.handle();
  });
  audio.define("cup", (c) => {
    const v = new Voice(c);
    if (c.offset > 0.1) return v.handle();
    for (const [f, l] of [[2200, 0.08], [3400, 0.05], [5200, 0.03]] as const) {
      const g = v.gain(0);
      env(g.gain, v.now, l, 0.002, 0.3);
      v.osc("sine", f, g, v.now, 0.4);
    }
    return v.handle();
  });
  audio.define("glass-door", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const g = v.gain(0, v.filter("bandpass", 3000, 3));
    g.gain.setValueAtTime(0.0001, v.now);
    g.gain.linearRampToValueAtTime(0.08, v.now + 0.1);
    g.gain.linearRampToValueAtTime(0.0001, v.now + d * 0.8);
    v.noise(g, v.now, d);
    const k = v.gain(0);
    env(k.gain, v.now + d * 0.8, 0.06, 0.002, 0.25);
    v.osc("sine", 3700, k, v.now + d * 0.8, 0.3);
    return v.handle();
  });
  audio.define("stone", (c) => {
    // 沉重的金属性陨石落在木桌上：低频敲击 + 一点金属泛音
    const v = new Voice(c);
    if (c.offset > 0.1) return v.handle();
    const g = v.gain(0, v.filter("lowpass", 900, 1.5));
    env(g.gain, v.now, 0.5, 0.002, 0.12);
    v.noise(g, v.now, 0.2);
    const k = v.gain(0);
    env(k.gain, v.now, 0.3, 0.002, 0.18);
    v.osc("sine", 180, k, v.now, 0.3);
    const m = v.gain(0);
    env(m.gain, v.now, 0.03, 0.002, 0.4);
    v.osc("sine", 2650, m, v.now, 0.5);
    return v.handle();
  });
  audio.define("pay", (c) => {
    const v = new Voice(c);
    if (c.offset > 0.1) return v.handle();
    [[1568, 0], [2093, 0.12]].forEach(([f, dt]) => {
      const g = v.gain(0);
      env(g.gain, v.now + dt, 0.06, 0.005, 0.25);
      v.osc("sine", f, g, v.now + dt, 0.35);
    });
    return v.handle();
  });
  audio.define("pad-house", (c) => pad(c, [146.8, 220, 277.2], 700, 0.5, "triangle"));
  audio.define("pad-dread", (c) => pad(c, [55, 58.3, 82.4], 380, 0.9));
  audio.define("pad-space", (c) => pad(c, [110, 164.8, 246.9, 329.6], 900, 0.4, "triangle"));
  audio.define("pad-end", (c) => pad(c, [73.4, 110, 146.8, 174.6], 520, 0.55));
  audio.define("title-boom", (c) => {
    const v = new Voice(c);
    if (c.offset > 0.2) return v.handle();
    const g = v.gain(0);
    env(g.gain, v.now, 0.6, 0.02, 4.5);
    const o = v.osc("sine", 48, g, v.now, 5);
    o.frequency.exponentialRampToValueAtTime(30, v.now + 4);
    const n = v.gain(0, v.filter("lowpass", 160, 0.7));
    env(n.gain, v.now, 0.3, 0.01, 2.5);
    v.noise(n, v.now, 3);
    return v.handle();
  });

  // ── 车间 ──
  audio.define("hall", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    v.noise(v.gain(0.02, v.filter("lowpass", 200, 0.5)), v.now, d);
    v.osc("sine", 100, v.gain(0.01), v.now, d); // 日光灯镇流器
    return v.handle();
  });
  audio.define("lathe", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const t = v.now;
    const fade = v.gain(0);
    fade.gain.setValueAtTime(0.0001, t);
    fade.gain.linearRampToValueAtTime(1, t + (c.offset < 0.3 ? 1.2 : 0.2));
    fade.gain.setValueAtTime(1, t + d - 0.8);
    fade.gain.linearRampToValueAtTime(0.0001, t + d);
    // 主轴电机
    const m = v.gain(0.05, fade);
    const mo = v.osc("sawtooth", 50, v.filter("lowpass", 400, 1, m), t, d);
    if (c.offset < 0.3) { mo.frequency.setValueAtTime(10, t); mo.frequency.exponentialRampToValueAtTime(50, t + 1.2); }
    v.osc("sine", 1440, v.gain(0.012, fade), t, d); // 高速主轴的啸叫
    // 切削：刀具咬进铁镍合金时的尖锐、颗粒感，按进刀节奏起伏
    const cutG = v.gain(0, v.filter("bandpass", 4200, 3, fade));
    loopEvents(v, 1.6, (tt) => {
      cutG.gain.setValueAtTime(0.0001, tt);
      cutG.gain.linearRampToValueAtTime(0.22, tt + 0.15);
      cutG.gain.setValueAtTime(0.22, tt + 1.0);
      cutG.gain.linearRampToValueAtTime(0.0001, tt + 1.3);
    });
    v.noise(cutG, t, d);
    const sq = v.gain(0, v.filter("bandpass", 2800, 12, fade));
    loopEvents(v, 1.6, (tt) => {
      sq.gain.setValueAtTime(0.0001, tt + 0.1);
      sq.gain.linearRampToValueAtTime(0.03, tt + 0.3);
      sq.gain.linearRampToValueAtTime(0.0001, tt + 1.2);
    });
    v.osc("sawtooth", 2800, sq, t, d);
    return v.handle();
  });
  audio.define("cnc-beep", (c) => {
    const v = new Voice(c);
    const g = v.gain(0);
    env(g.gain, v.now, 0.05, 0.005, 0.2);
    v.osc("square", 2000, v.filter("lowpass", 3000, 0.7, g), v.now, 0.25);
    return v.handle();
  });
  audio.define("clink", (c) => {
    const v = new Voice(c);
    if (c.offset > 0.1) return v.handle();
    for (const [f, l] of [[3100, 0.06], [4700, 0.04], [6900, 0.02]] as const) {
      const g = v.gain(0);
      env(g.gain, v.now, l, 0.001, 0.15);
      v.osc("sine", f, g, v.now, 0.2);
    }
    return v.handle();
  });
  audio.define("switch", muffledClick(2500, 0.5, 0.05));

  // ── 地下室 ──
  audio.define("bulb", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    v.osc("sawtooth", 50, v.gain(0.006, v.filter("lowpass", 240, 0.6)), v.now, d);
    v.noise(v.gain(0.008, v.filter("lowpass", 160, 0.5)), v.now, d);
    // 墙后的水管滴水
    loopEvents(v, 3.7, (t) => {
      const g = v.gain(0);
      env(g.gain, t, 0.03, 0.002, 0.12);
      const o = v.osc("sine", 900, g, t, 0.15);
      o.frequency.exponentialRampToValueAtTime(1600, t + 0.08);
    }, 1.5, 11);
    return v.handle();
  });
  audio.define("pliers", (c) => {
    const v = new Voice(c);
    if (c.offset > 0.1) return v.handle();
    const g = v.gain(0, v.filter("bandpass", 2600, 2));
    env(g.gain, v.now, 0.25, 0.002, 0.04);
    v.noise(g, v.now, 0.08);
    const g2 = v.gain(0, v.filter("bandpass", 1200, 1.5));
    g2.gain.setValueAtTime(0.0001, v.now + 0.1);
    g2.gain.linearRampToValueAtTime(0.08, v.now + 0.22);
    g2.gain.exponentialRampToValueAtTime(0.0001, v.now + 0.38);
    v.noise(g2, v.now + 0.1, 0.3);
    const k = v.gain(0);
    env(k.gain, v.now + 0.4, 0.04, 0.001, 0.15);
    v.osc("sine", 3900, k, v.now + 0.4, 0.2);
    return v.handle();
  });
  audio.define("glue", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const g = v.gain(0, v.filter("bandpass", 900, 1));
    g.gain.setValueAtTime(0.0001, v.now);
    g.gain.linearRampToValueAtTime(0.06, v.now + 0.3);
    g.gain.linearRampToValueAtTime(0.0001, v.now + d);
    v.noise(g, v.now, d);
    return v.handle();
  });
  audio.define("magload", muffledClick(4200, 0.35, 0.05));
  audio.define("maginsert", muffledClick(2200, 0.8, 0.08));
  audio.define("slide", (c) => {
    const v = new Voice(c);
    if (c.offset > 0.1) return v.handle();
    const a = v.gain(0, v.filter("bandpass", 2400, 1.5));
    env(a.gain, v.now, 0.4, 0.002, 0.06);
    v.noise(a, v.now, 0.1);
    const b = v.gain(0, v.filter("bandpass", 3200, 1.5));
    env(b.gain, v.now + 0.18, 0.6, 0.002, 0.07);
    v.noise(b, v.now + 0.18, 0.12);
    return v.handle();
  });
  audio.define("gun-room", (c) => {
    // 室内枪声：极短的爆音 + 低频冲击，送入砖墙小房间的密集反射
    const v = new Voice(c);
    if (c.offset > 0.1) return v.handle();
    const t = v.now;
    const conv = v.ac.createConvolver();
    conv.buffer = basementIR(v.ac);
    const wet = v.gain(0.55);
    conv.connect(wet);
    const dry = v.gain(0.6);
    const bus = v.ac.createGain();
    bus.connect(dry);
    bus.connect(conv);
    const crack = v.gain(0, v.filter("highpass", 900, 0.7, bus));
    env(crack.gain, t, 1.0, 0.0008, 0.06);
    v.noise(crack, t, 0.12);
    const body = v.gain(0, v.filter("lowpass", 1800, 0.7, bus));
    env(body.gain, t, 0.9, 0.001, 0.16);
    v.noise(body, t, 0.25);
    const boom = v.gain(0, bus);
    env(boom.gain, t, 0.8, 0.002, 0.22);
    const o = v.osc("sine", 120, boom, t, 0.35);
    o.frequency.exponentialRampToValueAtTime(38, t + 0.2);
    // 弹壳…无壳弹；只有套筒复进的金属声
    const m = v.gain(0, v.filter("bandpass", 3500, 4));
    env(m.gain, t + 0.05, 0.12, 0.002, 0.05);
    v.noise(m, t + 0.05, 0.1);
    return v.handle();
  });
  audio.define("tinnitus", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const g = v.gain(0);
    g.gain.setValueAtTime(c.offset < 0.2 ? 0.05 : 0.02, v.now);
    g.gain.exponentialRampToValueAtTime(0.0005, v.now + d);
    v.osc("sine", 4100, g, v.now, d);
    return v.handle();
  });
  audio.define("knife", (c) => {
    const v = new Voice(c);
    const d = remain(c);
    const g = v.gain(0, v.filter("lowpass", 700, 2));
    g.gain.setValueAtTime(0.0001, v.now);
    g.gain.linearRampToValueAtTime(0.18, v.now + 0.25);
    g.gain.linearRampToValueAtTime(0.0001, v.now + d);
    v.noise(g, v.now, d);
    return v.handle();
  });
  audio.define("fragments", (c) => {
    const v = new Voice(c);
    if (c.offset > 0.1) return v.handle();
    const r = rng(5);
    for (let i = 0; i < 7; i++) {
      const tt = v.now + i * 0.06 + r() * 0.05;
      const g = v.gain(0, v.filter("bandpass", 2500 + r() * 2500, 5));
      env(g.gain, tt, 0.15, 0.001, 0.05);
      v.noise(g, tt, 0.08);
    }
    return v.handle();
  });
  audio.define("case", muffledClick(900, 0.6, 0.12));
}

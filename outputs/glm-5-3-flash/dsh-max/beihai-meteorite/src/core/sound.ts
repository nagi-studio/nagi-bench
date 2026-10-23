import type { SoundCue, WebAudioCueBus } from "@agentbench/cinematic-player";

/* ------------------------------------------------------------------ */
/* 合成音色库：全部用 Web Audio 节点在运行时生成，无任何音频文件。      */
/* 物理设定：地下室枪声强反射；太空中外部无声，只有宇航服内传导的闷震、  */
/* 无线电与主观声音（心跳）。                                           */
/* ------------------------------------------------------------------ */

interface Toolkit {
  ac: AudioContext;
  out: GainNode;
  /** 所有需要 stop() 的源节点。 */
  stops: AudioScheduledSourceNode[];
  noise(): AudioBufferSourceNode;
  osc(type: OscillatorType, freq: number): OscillatorNode;
  filter(type: BiquadFilterType, freq: number, q?: number): BiquadFilterNode;
  gain(v: number): GainNode;
  ramp(g: AudioParam, points: Array<[number, number]>, t0?: number): void;
  keep(node: AudioScheduledSourceNode): void;
}

const noiseCache = new WeakMap<AudioContext, AudioBuffer>();
const irCache = new WeakMap<AudioContext, Map<string, AudioBuffer>>();

function noiseBuffer(ac: AudioContext): AudioBuffer {
  let buf = noiseCache.get(ac);
  if (!buf) {
    buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noiseCache.set(ac, buf);
  }
  return buf;
}

function impulse(ac: AudioContext, seconds: number, decay: number, seed = 3): AudioBuffer {
  let map = irCache.get(ac);
  if (!map) {
    map = new Map();
    irCache.set(ac, map);
  }
  const key = `${seconds}:${decay}:${seed}`;
  const cached = map.get(key);
  if (cached) return cached;
  const length = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(2, length, ac.sampleRate);
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x3fffffff - 1;
  };
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      const t = i / length;
      data[i] = rand() * Math.pow(1 - t, decay) * (i < ac.sampleRate * 0.004 ? 0.4 : 1);
    }
  }
  map.set(key, buf);
  return buf;
}

function rig(ac: AudioContext, output: GainNode): Toolkit {
  const stops: AudioScheduledSourceNode[] = [];
  const tool: Toolkit = {
    ac,
    out: output,
    stops,
    noise() {
      const src = ac.createBufferSource();
      src.buffer = noiseBuffer(ac);
      src.loop = true;
      stops.push(src);
      return src;
    },
    osc(type, freq) {
      const osc = ac.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      stops.push(osc);
      return osc;
    },
    filter(type, freq, q = 0.8) {
      const f = ac.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q;
      return f;
    },
    gain(v) {
      const g = ac.createGain();
      g.gain.value = v;
      return g;
    },
    ramp(g, points, t0 = ac.currentTime) {
      g.cancelScheduledValues(t0);
      g.setValueAtTime(points[0]![1], t0 + points[0]![0]);
      for (let i = 1; i < points.length; i++) {
        g.linearRampToValueAtTime(points[i]![1], t0 + points[i]![0]);
      }
    },
    keep(node) {
      stops.push(node);
    },
  };
  return tool;
}

function finish(tool: Toolkit, fade = 0.08): { stop: () => void } {
  const { ac, out, stops } = tool;
  return {
    stop: () => {
      const now = ac.currentTime;
      try {
        out.gain.cancelScheduledValues(now);
        out.gain.setTargetAtTime(0, now, fade / 3);
      } catch {
        /* ignore */
      }
      for (const node of stops) {
        try {
          node.stop(now + fade + 0.05);
        } catch {
          /* already stopped */
        }
      }
    },
  };
}

/* ------------------------------------------------------------------ */
/* 工厂                                                                */
/* ------------------------------------------------------------------ */

interface PadPayload {
  notes?: number[];
  cutoff?: number;
  attack?: number;
  release?: number;
  level?: number;
  wobble?: number;
}

/** 合成弦乐垫：少量三角波 + 低通 + 慢包络。 */
function playPad(tool: Toolkit, cue: SoundCue, offset: number): { stop: () => void } {
  const { ac, out } = tool;
  const p = (cue.payload ?? {}) as PadPayload;
  const notes = p.notes ?? [55];
  const dur = cue.end - cue.start;
  const attack = p.attack ?? 2.6;
  const release = p.release ?? 3.2;
  const level = p.level ?? 0.055;
  const t0 = ac.currentTime;
  const began = Math.min(offset, Math.max(0.01, dur - release));

  const lp = tool.filter("lowpass", p.cutoff ?? 900, 0.4);
  const master = tool.gain(0);
  lp.connect(master).connect(out);
  const lfo = tool.osc("sine", 0.055);
  const lfoAmt = tool.gain((p.cutoff ?? 900) * 0.3);
  lfo.connect(lfoAmt).connect(lp.frequency);
  lfo.start(t0);

  for (const note of notes) {
    for (const detune of [-5, 5]) {
      const osc = tool.osc("triangle", note);
      osc.detune.value = detune;
      const og = tool.gain(level / notes.length);
      osc.connect(og).connect(lp);
      osc.start(t0);
      osc.stop(t0 + dur + release + 0.2);
    }
    const shimmer = tool.osc("sine", note * 2.004);
    const sg = tool.gain((level / notes.length) * 0.22);
    shimmer.connect(sg).connect(lp);
    shimmer.start(t0);
    shimmer.stop(t0 + dur + release + 0.2);
  }
  tool.ramp(master.gain, [
    [0, began >= attack ? 1 : 0.12],
    [began >= attack ? 0.05 : attack - began, 1],
    [Math.max(0.1, dur - began - release * 0.55), 1],
    [Math.max(0.15, dur - began), 0],
  ]);
  return finish(tool, 0.5);
}

function playAmbience(tool: Toolkit, cue: SoundCue, offset: number): { stop: () => void } {
  const { ac, out } = tool;
  const t0 = ac.currentTime;
  const dur = Math.max(1, cue.end - cue.start - offset);
  const add = (n: AudioScheduledSourceNode): void => {
    tool.stops.push(n);
  };

  const layer = (
    build: (out: GainNode) => void,
    level: number,
  ): GainNode => {
    const g = tool.gain(level);
    g.connect(out);
    build(g);
    return g;
  };

  switch (cue.sound) {
    case "amb-alley": {
      layer((o) => {
        const n = tool.noise();
        const f = tool.filter("lowpass", 210, 0.5);
        n.connect(f).connect(o);
        n.start(t0);
        add(n);
      }, 0.05);
      layer((o) => {
        const n = tool.noise();
        const f = tool.filter("bandpass", 720, 0.7);
        const g = tool.gain(0.03);
        const lfo = tool.osc("sine", 0.12);
        const amt = tool.gain(0.02);
        lfo.connect(amt).connect(g.gain);
        n.connect(f).connect(g).connect(o);
        n.start(t0);
        lfo.start(t0);
        add(n); add(lfo);
      }, 1);
      layer((o) => {
        const osc = tool.osc("sine", 64);
        osc.connect(o);
        osc.start(t0);
        add(osc);
      }, 0.012);
      for (const at of [0.9, 4.4, 7.8]) {
        if (at > dur) break;
        for (const k of [0, 0.16]) {
          const osc = ac.createOscillator();
          osc.type = "sine";
          const g = tool.gain(0);
          osc.connect(g).connect(out);
          const s = t0 + at + k;
          osc.frequency.setValueAtTime(2900, s);
          osc.frequency.linearRampToValueAtTime(3500, s + 0.08);
          osc.frequency.linearRampToValueAtTime(2750, s + 0.16);
          g.gain.setValueAtTime(0, s);
          g.gain.linearRampToValueAtTime(0.016, s + 0.03);
          g.gain.linearRampToValueAtTime(0, s + 0.2);
          osc.start(s);
          osc.stop(s + 0.25);
          add(osc);
        }
      }
      break;
    }
    case "amb-room": {
      layer((o) => {
        const n = tool.noise();
        const f = tool.filter("lowpass", 140, 0.4);
        n.connect(f).connect(o);
        n.start(t0);
        add(n);
      }, 0.022);
      const ticks = Math.min(Math.ceil(dur), 160);
      for (let k = 0; k < ticks; k++) {
        const at = t0 + k + (offset % 1);
        const osc = ac.createOscillator();
        osc.type = "square";
        osc.frequency.value = k % 2 === 0 ? 1750 : 1330;
        const f = tool.filter("highpass", 900, 0.7);
        const g = tool.gain(0);
        osc.connect(f).connect(g).connect(out);
        g.gain.setValueAtTime(0, at);
        g.gain.linearRampToValueAtTime(0.028, at + 0.002);
        g.gain.linearRampToValueAtTime(0, at + 0.024);
        osc.start(at);
        osc.stop(at + 0.05);
        add(osc);
      }
      break;
    }
    case "amb-shop": {
      layer((o) => {
        const osc = tool.osc("sawtooth", 50);
        const f = tool.filter("lowpass", 130, 0.5);
        osc.connect(f).connect(o);
        osc.start(t0);
        add(osc);
      }, 0.014);
      layer((o) => {
        const n = tool.noise();
        const f = tool.filter("bandpass", 260, 1);
        n.connect(f).connect(o);
        n.start(t0);
        add(n);
      }, 0.012);
      break;
    }
    case "amb-basement": {
      layer((o) => {
        const osc = tool.osc("sine", 42);
        osc.connect(o);
        osc.start(t0);
        add(osc);
      }, 0.02);
      const drips = Math.min(Math.ceil(dur / 3.4), 40);
      for (let k = 0; k < drips; k++) {
        const at = t0 + 1.6 + k * 3.4;
        const osc = ac.createOscillator();
        osc.type = "sine";
        const f = tool.filter("bandpass", 900, 2);
        const g = tool.gain(0);
        osc.connect(f).connect(g).connect(out);
        osc.frequency.setValueAtTime(1180 + (k % 3) * 180, at);
        osc.frequency.exponentialRampToValueAtTime(480, at + 0.09);
        g.gain.setValueAtTime(0, at);
        g.gain.linearRampToValueAtTime(0.05, at + 0.006);
        g.gain.linearRampToValueAtTime(0, at + 0.12);
        osc.start(at);
        osc.stop(at + 0.15);
        add(osc);
      }
      break;
    }
    case "amb-space": {
      layer((o) => {
        const osc = tool.osc("sine", 36);
        osc.connect(o);
        osc.start(t0);
        add(osc);
      }, 0.05);
      layer((o) => {
        const osc = tool.osc("sine", 54.6);
        osc.connect(o);
        osc.start(t0);
        add(osc);
      }, 0.028);
      layer((o) => {
        const n = tool.noise();
        const f = tool.filter("lowpass", 95, 0.4);
        const g = tool.gain(0.02);
        const lfo = tool.osc("sine", 0.021);
        const amt = tool.gain(0.012);
        lfo.connect(amt).connect(g.gain);
        n.connect(f).connect(g).connect(o);
        n.start(t0);
        lfo.start(t0);
        add(n); add(lfo);
      }, 1);
      break;
    }
    case "suit": {
      layer((o) => {
        const osc = tool.osc("sawtooth", 118);
        const f = tool.filter("lowpass", 320, 0.6);
        osc.connect(f).connect(o);
        osc.start(t0);
        add(osc);
      }, 0.008);
      const cycles = Math.min(Math.ceil(dur / 4.8) + 1, 60);
      for (let k = 0; k < cycles; k++) {
        const base = t0 + (k * 4.8 - (offset % 4.8));
        for (const [dx, freq, len, lvl] of [
          [0.0, 470, 1.9, 0.045],
          [2.5, 360, 2.1, 0.05],
        ] as const) {
          const at = base + dx;
          if (at < t0) continue;
          const n = ac.createBufferSource();
          n.buffer = noiseBuffer(ac);
          n.loop = true;
          const f = ac.createBiquadFilter();
          f.type = "bandpass";
          f.frequency.value = freq;
          f.Q.value = 0.8;
          const g = ac.createGain();
          n.connect(f).connect(g).connect(out);
          g.gain.setValueAtTime(0.0001, at);
          g.gain.linearRampToValueAtTime(lvl, at + len * 0.45);
          g.gain.linearRampToValueAtTime(0.0001, at + len);
          n.start(Math.max(t0, at));
          n.stop(at + len + 0.05);
          add(n);
          const click = ac.createOscillator();
          click.type = "square";
          click.frequency.value = 2400;
          const cf = ac.createBiquadFilter();
          cf.type = "highpass";
          cf.frequency.value = 1500;
          const cg = ac.createGain();
          click.connect(cf).connect(cg).connect(out);
          const clickAt = at - 0.14;
          if (clickAt >= t0) {
            cg.gain.setValueAtTime(0.012, clickAt + 0.02);
            cg.gain.linearRampToValueAtTime(0, clickAt + 0.12);
            click.start(clickAt);
            click.stop(clickAt + 0.13);
            add(click);
          } else {
            try {
              click.disconnect();
            } catch {
              /* ignore */
            }
          }
        }
      }
      break;
    }
    case "cnc": {
      const lfo = tool.osc("sine", 0.5);
      layer((o) => {
        for (const f0 of [208, 213]) {
          const osc = tool.osc("sawtooth", f0);
          const f = tool.filter("lowpass", 1300, 0.7);
          osc.connect(f).connect(o);
          lfo.connect(tool.gain(5)).connect(osc.frequency);
          osc.start(t0);
          add(osc);
        }
      }, 0.045);
      layer((o) => {
        const n = tool.noise();
        const f = tool.filter("highpass", 2600, 0.7);
        n.connect(f).connect(o);
        n.start(t0);
        add(n);
      }, 0.011);
      lfo.start(t0);
      add(lfo);
      break;
    }
    default: {
      layer(() => {}, 0);
    }
  }
  return finish(tool, 0.25);
}

function playOneShot(tool: Toolkit, cue: SoundCue, offset: number): { stop: () => void } {
  const { ac, out } = tool;
  const t0 = ac.currentTime;
  const add = (n: AudioScheduledSourceNode): void => {
    tool.stops.push(n);
  };
  const payload = (cue.payload ?? {}) as Record<string, unknown>;
  const at = (payload.at as number[] | undefined) ?? [0];

  const burst = (
    when: number,
    opts: { f: number; q?: number; dur?: number; level?: number; type?: BiquadFilterType },
  ): void => {
    const n = ac.createBufferSource();
    n.buffer = noiseBuffer(ac);
    n.loop = true;
    const f = ac.createBiquadFilter();
    f.type = opts.type ?? "bandpass";
    f.frequency.value = opts.f;
    f.Q.value = opts.q ?? 0.9;
    const g = ac.createGain();
    const dur = opts.dur ?? 0.06;
    const lvl = opts.level ?? 0.1;
    n.connect(f).connect(g).connect(out);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(lvl, when + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    n.start(when);
    n.stop(when + dur + 0.05);
    add(n);
  };
  const thump = (
    when: number,
    opts: { f0: number; f1?: number; dur?: number; level?: number },
  ): void => {
    const osc = ac.createOscillator();
    osc.type = "sine";
    const g = ac.createGain();
    const dur = opts.dur ?? 0.1;
    osc.frequency.setValueAtTime(opts.f0, when);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.f1 ?? opts.f0 * 0.5), when + dur);
    osc.connect(g).connect(out);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(opts.level ?? 0.12, when + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.start(when);
    osc.stop(when + dur + 0.05);
    add(osc);
  };

  switch (cue.sound) {
    case "mech": {
      for (const o of at) {
        const when = t0 + o;
        if (when < t0 - 0.01) continue;
        burst(when, { f: (payload.f as number) ?? 1500, dur: 0.045, level: (payload.level as number) ?? 0.09 });
        thump(when, { f0: ((payload.f as number) ?? 1500) * 0.35, dur: 0.06, level: ((payload.level as number) ?? 0.09) * 0.7 });
      }
      break;
    }
    case "steps": {
      for (const o of at) {
        const when = t0 + o;
        burst(when, { f: 380, type: "lowpass", dur: 0.09, level: 0.07 });
        thump(when, { f0: 96, f1: 55, dur: 0.08, level: 0.07 });
      }
      break;
    }
    case "creak": {
      const osc = tool.osc("sawtooth", 168);
      const f = tool.filter("lowpass", 760, 1.4);
      const g = tool.gain(0);
      osc.connect(f).connect(g).connect(out);
      const curve = new Float32Array(24);
      for (let i = 0; i < 24; i++) curve[i] = 150 + Math.sin(i * 1.7) * 42 + (i % 4) * 11;
      osc.frequency.setValueCurveAtTime(curve, t0, 0.85);
      tool.ramp(g.gain, [
        [0, 0],
        [0.1, 0.05],
        [0.5, 0.028],
        [0.62, 0.05],
        [0.9, 0],
      ]);
      osc.start(t0);
      osc.stop(t0 + 1);
      add(osc);
      break;
    }
    case "pour": {
      const n = tool.noise();
      const f = tool.filter("bandpass", 950, 1.4);
      const g = tool.gain(0);
      const am = tool.osc("sine", 11);
      const amt = tool.gain(0.012);
      am.connect(amt).connect(g.gain);
      n.connect(f).connect(g).connect(out);
      tool.ramp(g.gain, [
        [0, 0],
        [0.15, 0.03],
        [1.3, 0.026],
        [1.5, 0],
      ]);
      n.start(t0);
      am.start(t0);
      add(n); add(am);
      thump(t0 + 1.62, { f0: 900, f1: 420, dur: 0.07, level: 0.03 });
      break;
    }
    case "buzz": {
      const osc = tool.osc("square", 168);
      const g = tool.gain(0);
      const am = tool.osc("sine", 29);
      const amt = tool.gain(0.5);
      am.connect(amt).connect(g.gain);
      const f = tool.filter("lowpass", 800, 0.7);
      osc.connect(f).connect(g).connect(out);
      tool.ramp(g.gain, [
        [0, 0],
        [0.02, 0.05],
        [0.4, 0.05],
        [0.46, 0],
      ]);
      osc.start(t0);
      am.start(t0);
      add(osc); add(am);
      break;
    }
    case "flicker": {
      for (const o of [0, 0.16, 0.38]) {
        burst(t0 + o, { f: 3400, type: "highpass", dur: 0.1, level: 0.02 });
        thump(t0 + o, { f0: 118, dur: 0.14, level: 0.02 });
      }
      break;
    }
    case "scrape": {
      const n = tool.noise();
      const f = tool.filter("bandpass", 1900, 0.5);
      const g = tool.gain(0);
      n.connect(f).connect(g).connect(out);
      tool.ramp(g.gain, [
        [0, 0],
        [0.08, 0.05],
        [0.6, 0.04],
        [0.8, 0],
      ]);
      n.start(t0);
      add(n);
      break;
    }
    case "glue": {
      for (const o of at) {
        burst(t0 + o, { f: 820, type: "lowpass", dur: 0.3, level: 0.028 });
      }
      break;
    }
    case "rack": {
      burst(t0, { f: 2100, dur: 0.03, level: 0.12 });
      burst(t0 + 0.16, { f: 1150, q: 0.6, dur: 0.16, level: 0.09 });
      thump(t0 + 0.16, { f0: 190, dur: 0.05, level: 0.1 });
      break;
    }
    case "gunshot": {
      // 地下室：直达声 + 强反射（卷积混响 + 两道板墙回声）+ 低频轰鸣。
      const dry = tool.gain(1);
      dry.connect(out);
      const conv = ac.createConvolver();
      conv.buffer = impulse(ac, 1.5, 4.2, 5);
      const wet = tool.gain(0.9);
      conv.connect(wet).connect(out);
      const slap1 = ac.createDelay(0.2);
      slap1.delayTime.value = 0.031;
      const slap1g = tool.gain(0.4);
      const slap2 = ac.createDelay(0.2);
      slap2.delayTime.value = 0.057;
      const slap2g = tool.gain(0.3);
      dry.connect(slap1);
      slap1.connect(slap1g).connect(out);
      dry.connect(slap2);
      slap2.connect(slap2g).connect(out);
      dry.connect(conv);

      burst(t0, { f: 5200, type: "lowpass", dur: 0.07, level: 0.75 });
      burst(t0, { f: 2400, type: "highpass", dur: 0.016, level: 0.4 });
      thump(t0, { f0: 62, f1: 26, dur: 0.3, level: 0.85 });
      // 进沙袋/砖屑的碎屑尾音
      const n = tool.noise();
      const f = tool.filter("bandpass", 950, 0.6);
      const g = tool.gain(0);
      n.connect(f).connect(g).connect(dry);
      tool.ramp(g.gain, [
        [0, 0],
        [0.03, 0.14],
        [1.1, 0],
      ]);
      n.start(t0);
      add(n);
      break;
    }
    case "ring": {
      const osc = tool.osc("sine", 3140);
      const osc2 = tool.osc("sine", 3980);
      const g = tool.gain(0);
      const g2 = tool.gain(0);
      osc.connect(g).connect(out);
      osc2.connect(g2).connect(out);
      const dur = cue.end - cue.start - offset;
      tool.ramp(g.gain, [
        [0, 0.02],
        [0.4, 0.026],
        [dur, 0],
      ]);
      tool.ramp(g2.gain, [
        [0, 0.008],
        [dur * 0.6, 0.005],
        [dur, 0],
      ]);
      osc.start(t0);
      osc2.start(t0);
      add(osc); add(osc2);
      break;
    }
    case "cloth": {
      const n = tool.noise();
      const f = tool.filter("lowpass", 640, 0.7);
      const g = tool.gain(0);
      const am = tool.osc("sine", 6.5);
      const amt = tool.gain(0.014);
      am.connect(amt).connect(g.gain);
      n.connect(f).connect(g).connect(out);
      tool.ramp(g.gain, [
        [0, 0],
        [0.1, 0.03],
        [0.55, 0],
      ]);
      n.start(t0);
      am.start(t0);
      add(n); add(am);
      break;
    }
    case "knife": {
      burst(t0, { f: 420, type: "lowpass", dur: 0.35, level: 0.045 });
      thump(t0 + 0.05, { f0: 240, f1: 85, dur: 0.3, level: 0.045 });
      break;
    }
    case "whoosh": {
      const n = tool.noise();
      const f = tool.filter("bandpass", 250, 1.2);
      const g = tool.gain(0);
      n.connect(f).connect(g).connect(out);
      f.frequency.setValueAtTime(240, t0);
      f.frequency.exponentialRampToValueAtTime(2600, t0 + 0.5);
      f.frequency.exponentialRampToValueAtTime(170, t0 + 1.15);
      tool.ramp(g.gain, [
        [0, 0],
        [0.45, 0.12],
        [1.15, 0],
      ]);
      n.start(t0);
      add(n);
      break;
    }
    case "radioblip": {
      burst(t0, { f: 1800, q: 2, dur: 0.06, level: 0.05 });
      const osc = tool.osc("square", 1160);
      const g = tool.gain(0);
      const f = tool.filter("lowpass", 2400, 0.7);
      osc.connect(f).connect(g).connect(out);
      tool.ramp(g.gain, [
        [0.08, 0],
        [0.09, 0.03],
        [0.15, 0.03],
        [0.16, 0],
      ]);
      osc.start(t0);
      add(osc);
      burst(t0 + 0.2, { f: 2100, dur: 0.03, level: 0.03 });
      break;
    }
    case "glove": {
      burst(t0, { f: 560, type: "lowpass", dur: 0.35, level: 0.03 });
      burst(t0 + 0.1, { f: 2400, dur: 0.1, level: 0.02 });
      burst(t0 + 0.24, { f: 2600, dur: 0.09, level: 0.016 });
      break;
    }
    case "clamp": {
      burst(t0, { f: 2600, dur: 0.04, level: 0.1 });
      thump(t0 + 0.03, { f0: 150, dur: 0.07, level: 0.1 });
      break;
    }
    case "burst": {
      const shots = (payload.shots as number) ?? 10;
      const interval = (payload.interval as number) ?? 0.14;
      const lp = tool.filter("lowpass", 900, 0.6);
      lp.connect(out);
      for (let k = 0; k < shots; k++) {
        const when = t0 + k * interval;
        const lvl = k === 0 ? 1 : 0.82;
        // 机械击锤 + 传导到身体的闷震（真空中的主观声音）
        burst(when, { f: 2600, type: "highpass", dur: 0.012, level: 0.09 * lvl });
        thump(when, { f0: 108, f1: 58, dur: 0.075, level: 0.3 * lvl });
        burst(when + 0.004, { f: 330, q: 1.4, dur: 0.05, level: 0.07 * lvl });
      }
      break;
    }
    case "heart": {
      const bpm0 = (payload.bpm0 as number) ?? 64;
      const bpm1 = (payload.bpm1 as number) ?? 96;
      const level = (payload.level as number) ?? 0.3;
      const dur = cue.end - cue.start - offset;
      let t = 0;
      let k = 0;
      while (t < dur && k < 90) {
        const frac = t / Math.max(0.1, dur);
        const bpm = bpm0 + (bpm1 - bpm0) * frac;
        const when = t0 + t;
        thump(when, { f0: 64, f1: 40, dur: 0.1, level });
        thump(when + 0.21, { f0: 56, f1: 36, dur: 0.08, level: level * 0.7 });
        t += 60 / bpm;
        k++;
      }
      break;
    }
    case "thruster": {
      const n = tool.noise();
      const f = tool.filter("bandpass", 920, 0.8);
      const g = tool.gain(0);
      const mast = tool.filter("lowpass", 1500, 0.5);
      n.connect(f).connect(g).connect(mast).connect(out);
      tool.ramp(g.gain, [
        [0, 0],
        [0.28, 0.085],
        [3.4, 0.07],
        [4.6, 0],
      ]);
      n.start(t0);
      add(n);
      thump(t0, { f0: 70, f1: 52, dur: 0.6, level: 0.05 });
      break;
    }
    case "pulse": {
      const i0 = (payload.interval0 as number) ?? 2.8;
      const i1 = (payload.interval1 as number) ?? 5.4;
      const level = (payload.level as number) ?? 0.12;
      const dur = cue.end - cue.start - offset;
      let t = 0;
      let k = 0;
      while (t < dur && k < 24) {
        const frac = t / Math.max(0.1, dur);
        const when = t0 + t;
        thump(when, { f0: 58, f1: 38, dur: 0.12, level: level * (1 - frac * 0.6) });
        t += i0 + (i1 - i0) * frac;
        k++;
      }
      break;
    }
    default:
      break;
  }
  return finish(tool, 0.12);
}

export function defineSounds(audio: WebAudioCueBus<unknown>): void {
  audio.define("pad", ({ audioContext: ac, output, cue, offset }) => {
    const tool = rig(ac, output);
    return playPad(tool, cue, offset);
  });
  for (const name of ["amb-alley", "amb-room", "amb-shop", "amb-basement", "amb-space", "suit", "cnc"]) {
    audio.define(name, ({ audioContext: ac, output, cue, offset }) => {
      const tool = rig(ac, output);
      return playAmbience(tool, cue, offset);
    });
  }
  for (const name of [
    "mech", "steps", "creak", "pour", "buzz", "flicker", "scrape", "glue", "rack",
    "gunshot", "ring", "cloth", "knife", "whoosh", "radioblip", "glove", "clamp",
    "burst", "heart", "thruster", "pulse",
  ]) {
    audio.define(name, ({ audioContext: ac, output, cue, offset }) => {
      const tool = rig(ac, output);
      return playOneShot(tool, cue, offset);
    });
  }
}

/* ------------------------------------------------------------------ */
/* 声音 cue 表                                                          */
/* ------------------------------------------------------------------ */

function sfx(id: string, sound: string, start: number, end: number, gain = 1, payload?: Record<string, unknown>): SoundCue {
  return { id, kind: "sound", sound, group: "sfx", gain, sustain: false, start, end, payload };
}
function amb(id: string, sound: string, start: number, end: number, gain = 1): SoundCue {
  return { id, kind: "sound", sound, group: "amb", gain, sustain: true, start, end };
}
function music(id: string, start: number, end: number, payload: PadPayload, gain = 1): SoundCue {
  return { id, kind: "sound", sound: "pad", group: "music", gain, sustain: true, start, end, payload };
}

export const soundCues: SoundCue[] = [
  // —— 音乐（合成弦垫）——
  music("mus-title", 0.4, 13.0, { notes: [55, 82.41, 110], cutoff: 620, attack: 2.6, level: 0.06 }, 0.9),
  music("mus-warm", 26.0, 96.4, { notes: [65.41, 98.0, 130.81, 196.0], cutoff: 1050, attack: 3.2, level: 0.05 }, 0.85),
  music("mus-tense", 98.0, 122.6, { notes: [49.0, 73.42, 98.0], cutoff: 480, attack: 2.2, level: 0.055 }, 0.9),
  music("mus-cold", 176.0, 263.4, { notes: [55.0, 65.41, 82.41], cutoff: 700, attack: 3.4, level: 0.05 }, 0.85),
  music("mus-resolve", 281.6, 321.0, { notes: [49.0, 73.42, 98.0, 146.83], cutoff: 880, attack: 4.0, level: 0.045 }, 0.9),
  music("mus-end", 316.0, 327.2, { notes: [49.0, 73.42], cutoff: 480, attack: 2.0, release: 4.5, level: 0.04 }, 0.8),

  // —— 环境 ——
  amb("amb-alley", "amb-alley", 13.4, 25.0, 0.9),
  amb("amb-room", "amb-room", 26.0, 96.4, 0.9),
  amb("amb-shop", "amb-shop", 97.6, 122.6, 0.9),
  amb("amb-basement", "amb-basement", 123.6, 160.6, 0.9),
  amb("amb-space", "amb-space", 161.6, 327.6, 1.0),
  amb("suit", "suit", 175.8, 316.0, 0.8),

  // —— 一幕：胡同 ——
  sfx("steps-1", "steps", 17.6, 23.2, 0.9, { at: [0, 0.72, 1.46, 2.2, 2.96, 3.72, 4.5] }),
  sfx("creak-1", "creak", 22.9, 24.2, 1.0),
  sfx("pour-1", "pour", 34.6, 36.6, 0.9),
  sfx("case-1", "mech", 44.7, 45.4, 0.8, { at: [0, 0.28], f: 1900, level: 0.05 }),
  sfx("stones-1", "mech", 69.9, 70.9, 0.9, { at: [0, 0.26, 0.58], f: 620, level: 0.1 }),
  sfx("buzz-1", "buzz", 78.9, 79.8, 1.0),
  sfx("whoosh-1", "whoosh", 96.6, 97.9, 0.8),

  // —— 二幕：车间 ——
  sfx("flicker-1", "flicker", 98.0, 98.8, 1.0),
  sfx("servo-1", "mech", 100.6, 101.2, 0.7, { at: [0], f: 900, level: 0.06 }),
  sfx("cnc-1", "cnc", 103.4, 112.4, 0.9),
  sfx("servo-2", "mech", 112.0, 112.6, 0.7, { at: [0], f: 800, level: 0.06 }),
  sfx("scrape-1", "scrape", 117.6, 118.6, 0.9),
  sfx("ratchet-1", "mech", 119.8, 120.9, 0.9, { at: [0, 0.18, 0.34, 0.5, 0.68, 0.86], f: 2200, level: 0.07 }),
  sfx("lightoff-1", "mech", 122.4, 122.9, 1.0, { at: [0], f: 900, level: 0.12 }),
  sfx("whoosh-2", "whoosh", 122.7, 124.0, 0.7),

  // —— 三幕：地下室 ——
  sfx("boxopen-1", "mech", 124.7, 125.4, 0.9, { at: [0, 0.24], f: 700, level: 0.11 }),
  sfx("pluck-1", "mech", 127.6, 133.9, 0.9, { at: [0, 0.9, 1.9, 2.9, 3.9, 4.9, 5.8], f: 1700, level: 0.09 }),
  sfx("glue-1", "glue", 135.2, 139.4, 1.0, { at: [0, 1.1, 2.3, 3.5] }),
  sfx("magin-1", "mech", 140.5, 141.4, 1.0, { at: [0, 0.3, 0.6, 0.92], f: 1600, level: 0.09 }),
  sfx("rack-1", "rack", 143.1, 143.7, 1.0),
  sfx("gunshot-1", "gunshot", 145.8, 147.6, 1.0),
  sfx("ring-1", "ring", 146.4, 151.6, 1.0),
  sfx("cloth-1", "cloth", 149.5, 150.4, 1.0),
  sfx("knife-1", "knife", 152.5, 153.3, 1.0),
  sfx("tin-1", "mech", 155.3, 156.6, 0.9, { at: [0, 0.5, 1.05], f: 2400, level: 0.05 }),
  sfx("cord-1", "mech", 159.7, 160.2, 1.0, { at: [0], f: 1200, level: 0.1 }),
  sfx("whoosh-3", "whoosh", 160.4, 161.7, 0.8),

  // —— 四幕：太空 ——
  sfx("blip-1", "radioblip", 199.0, 199.6, 0.8),
  sfx("blip-2", "radioblip", 213.0, 213.6, 0.8),
  sfx("blip-3", "radioblip", 219.4, 220.0, 0.8),
  sfx("glove-1", "glove", 225.7, 226.5, 1.0),
  sfx("clamp-1", "clamp", 228.7, 229.2, 1.0),
  sfx("heart-1", "heart", 236.6, 258.5, 0.9, { bpm0: 62, bpm1: 98, level: 0.3 }),
  sfx("burst-1", "burst", 239.2, 240.8, 1.0, { shots: 10, interval: 0.14 }),
  sfx("burst-2", "burst", 241.4, 243.0, 0.95, { shots: 10, interval: 0.14 }),
  sfx("burst-3", "burst", 243.6, 245.2, 0.9, { shots: 10, interval: 0.14 }),
  sfx("blip-4", "radioblip", 251.2, 251.8, 0.9),
  sfx("blip-5", "radioblip", 256.6, 257.2, 0.9),
  sfx("thruster-1", "thruster", 265.6, 270.6, 0.9),
  sfx("pulse-1", "pulse", 287.0, 311.0, 0.9, { interval0: 2.8, interval1: 5.2, level: 0.12 }),
];

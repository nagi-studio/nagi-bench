import type { SoundCue, WebAudioCueBus, SoundFactoryContext } from "@agentbench/cinematic-player";
import { voiceCues } from "./voice";
import { BASEMENT_SHOTS } from "./overlay";
import { SHOTS, MAG_CHANGES } from "./sets/space";

import stepC0 from "./assets/audio/footstep_concrete_000.ogg?inline";
import stepC1 from "./assets/audio/footstep_concrete_001.ogg?inline";
import stepC2 from "./assets/audio/footstep_concrete_002.ogg?inline";
import stepW0 from "./assets/audio/footstep_wood_000.ogg?inline";
import stepW1 from "./assets/audio/footstep_wood_001.ogg?inline";
import stepW2 from "./assets/audio/footstep_wood_002.ogg?inline";
import knock from "./assets/audio/impactPlank_medium_000.ogg?inline";
import cup from "./assets/audio/impactGlass_light_000.ogg?inline";
import cup2 from "./assets/audio/impactGlass_light_002.ogg?inline";
import velvet from "./assets/audio/impactSoft_medium_000.ogg?inline";
import stone from "./assets/audio/impactGeneric_light_000.ogg?inline";
import metalLight from "./assets/audio/impactMetal_light_000.ogg?inline";
import metalLight2 from "./assets/audio/impactMetal_light_002.ogg?inline";
import metalMed from "./assets/audio/impactMetal_medium_000.ogg?inline";
import tin from "./assets/audio/impactTin_medium_000.ogg?inline";
import punch from "./assets/audio/impactPunch_heavy_000.ogg?inline";
import softHeavy from "./assets/audio/impactSoft_heavy_000.ogg?inline";
import woodLight from "./assets/audio/impactWood_light_000.ogg?inline";
import mining from "./assets/audio/impactMining_000.ogg?inline";
import crunch from "./assets/audio/explosionCrunch_000.ogg?inline";
import lowboom from "./assets/audio/lowFrequency_explosion_000.ogg?inline";
import engine from "./assets/audio/engineCircular_000.ogg?inline";
import thruster from "./assets/audio/thrusterFire_000.ogg?inline";
import computer from "./assets/audio/computerNoise_000.ogg?inline";
import glue from "./assets/audio/slime_000.ogg?inline";
import click from "./assets/audio/click1.ogg?inline";
import switchA from "./assets/audio/switch2.ogg?inline";
import switchB from "./assets/audio/switch7.ogg?inline";

const RAW: Record<string, string> = {
  "step-c0": stepC0, "step-c1": stepC1, "step-c2": stepC2,
  "step-w0": stepW0, "step-w1": stepW1, "step-w2": stepW2,
  knock, cup, cup2, velvet, stone,
  "metal-light": metalLight, "metal-light2": metalLight2, "metal-med": metalMed,
  tin, punch, "soft-heavy": softHeavy, "wood-light": woodLight, mining,
  crunch, lowboom, computer, glue, click, "switch-a": switchA, "switch-b": switchB,
};

// ----------------------------------------------------- private buffer cache

const buffers = new Map<string, AudioBuffer>();
let decoding: Promise<void> | undefined;

function toArrayBuffer(dataUrl: string): ArrayBuffer {
  const bin = atob(dataUrl.slice(dataUrl.indexOf(",") + 1));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

function decodeAll(ac: AudioContext): Promise<void> {
  if (!decoding) {
    decoding = Promise.all(
      Object.entries({ ...RAW, engine, thruster }).map(async ([k, url]) => {
        try {
          buffers.set(k, await ac.decodeAudioData(toArrayBuffer(url)));
        } catch {
          /* a failed decode only silences that layer */
        }
      }),
    ).then(() => undefined);
  }
  return decoding;
}

/** Run `play` as soon as the needed buffers exist (they normally already do). */
function withBuffers(ctx: SoundFactoryContext, play: () => (() => void) | void): { stop: () => void } {
  let stopper: (() => void) | undefined;
  let cancelled = false;
  if (buffers.size > 0) stopper = play() || undefined;
  else void decodeAll(ctx.audioContext).then(() => { if (!cancelled) stopper = play() || undefined; });
  return { stop: () => { cancelled = true; try { stopper?.(); } catch { /* already stopped */ } } };
}

function noiseBuffer(ac: AudioContext, seconds = 2, brown = false): AudioBuffer {
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  let seed = 12345;
  for (let i = 0; i < len; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const w = (seed / 0x7fffffff) * 2 - 1;
    if (brown) {
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    } else d[i] = w;
  }
  return buf;
}

let whiteCache: AudioBuffer | undefined;
let brownCache: AudioBuffer | undefined;
const white = (ac: AudioContext) => (whiteCache ??= noiseBuffer(ac, 2));
const brown = (ac: AudioContext) => (brownCache ??= noiseBuffer(ac, 4, true));

function playBuf(ac: AudioContext, name: string, dest: AudioNode, when: number, gain = 1, rate = 1, offset = 0): AudioBufferSourceNode | undefined {
  const b = buffers.get(name);
  if (!b) return undefined;
  const s = ac.createBufferSource();
  s.buffer = b;
  s.playbackRate.value = rate;
  const g = ac.createGain();
  g.gain.value = gain;
  s.connect(g).connect(dest);
  s.start(when, offset);
  return s;
}

/** Small concrete room: dense early reflections and a ~1 s tail. */
let roomIR: AudioBuffer | undefined;
function basementIR(ac: AudioContext): AudioBuffer {
  if (roomIR) return roomIR;
  const len = Math.floor(ac.sampleRate * 1.3);
  const buf = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let seed = 777 + ch * 31;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    // Early reflections off walls 1.5–3 m away.
    for (let k = 0; k < 18; k++) {
      const at = Math.floor(ac.sampleRate * (0.004 + rnd() * 0.03));
      d[at] += (rnd() * 2 - 1) * (0.9 - k * 0.04);
    }
    for (let i = 0; i < len; i++) {
      const tt = i / ac.sampleRate;
      d[i] += (rnd() * 2 - 1) * Math.exp(-tt * 5.2) * 0.55;
    }
  }
  roomIR = buf;
  return buf;
}

function lp(ac: AudioContext, f: number, q = 0.7): BiquadFilterNode {
  const n = ac.createBiquadFilter();
  n.type = "lowpass";
  n.frequency.value = f;
  n.Q.value = q;
  return n;
}
function bp(ac: AudioContext, f: number, q = 1): BiquadFilterNode {
  const n = ac.createBiquadFilter();
  n.type = "bandpass";
  n.frequency.value = f;
  n.Q.value = q;
  return n;
}

function loopNoise(ac: AudioContext, buf: AudioBuffer, dest: AudioNode, when = ac.currentTime): AudioBufferSourceNode {
  const s = ac.createBufferSource();
  s.buffer = buf;
  s.loop = true;
  s.connect(dest);
  s.start(when, Math.random() * buf.duration);
  return s;
}

function cueLen(ctx: SoundFactoryContext): number {
  return Math.max(0.05, ctx.cue.end - ctx.cue.start - ctx.offset);
}

// --------------------------------------------------------------- registry

export function registerSounds(audio: WebAudioCueBus<any>): void {
  // Direct samples.
  for (const [k, url] of Object.entries(RAW)) audio.defineSample(k, url);
  audio.defineSample("lathe-motor", engine, { loop: true, playbackRate: 0.8 });

  audio.define("prewarm", ({ audioContext }) => {
    void decodeAll(audioContext);
    return { stop: () => {} };
  });

  // Suit breathing: inhale/exhale cycles on band-passed noise. payload.period sets the pace.
  audio.define("breath", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const period = (ctx.cue.payload as any)?.period ?? 4.6;
    const g = ac.createGain();
    g.gain.value = 0;
    const f = bp(ac, 650, 0.9);
    const src = loopNoise(ac, white(ac), f);
    f.connect(g).connect(output);
    const now = ac.currentTime;
    const len = cueLen(ctx);
    const phase0 = ctx.offset % period;
    for (let c = -1; c * period < len + period; c++) {
      const t0 = now + c * period - phase0;
      const pts: Array<[number, number, number]> = [
        [0, 0, 820], [0.5, 0.5, 900], [1.3, 0.28, 760], [1.6, 0, 700],
        [period * 0.45, 0, 520], [period * 0.45 + 0.5, 0.32, 480], [period * 0.45 + 1.6, 0.12, 420], [period * 0.45 + 2.1, 0, 400],
      ];
      for (const [dt, v, fr] of pts) {
        const at = t0 + dt;
        if (at < now) continue;
        g.gain.linearRampToValueAtTime(v * 0.22, at);
        f.frequency.linearRampToValueAtTime(fr, at);
      }
    }
    return { stop: () => src.stop() };
  });

  // Life-support fan and the faint electrical hum inside the helmet.
  audio.define("suit-hum", ({ audioContext: ac, output }) => {
    const g = ac.createGain();
    g.gain.value = 0.16;
    const f = lp(ac, 260);
    const src = loopNoise(ac, brown(ac), f);
    f.connect(g).connect(output);
    const o = ac.createOscillator();
    o.frequency.value = 118;
    const og = ac.createGain();
    og.gain.value = 0.012;
    o.connect(og).connect(output);
    o.start();
    return { stop: () => { src.stop(); o.stop(); } };
  });

  // Radio transmission: key-up chirp, a band-limited hiss bed, and the release squelch.
  audio.define("radio", (ctx) => withBuffers(ctx, () => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const len = cueLen(ctx);
    const chirp = ac.createOscillator();
    chirp.type = "square";
    chirp.frequency.setValueAtTime(1850, now);
    const cg = ac.createGain();
    cg.gain.setValueAtTime(0.025, now);
    cg.gain.setValueAtTime(0, now + 0.05);
    chirp.connect(bp(ac, 2000, 2)).connect(cg).connect(output);
    chirp.start(now);
    chirp.stop(now + 0.08);
    playBuf(ac, "switch-a", output, now, 0.35, 1.4);
    const hf = bp(ac, 2600, 0.6);
    const hg = ac.createGain();
    hg.gain.setValueAtTime(0, now);
    hg.gain.linearRampToValueAtTime(0.03, now + 0.05);
    hg.gain.setValueAtTime(0.03, now + len - 0.28);
    hg.gain.linearRampToValueAtTime(0.09, now + len - 0.2);
    hg.gain.linearRampToValueAtTime(0, now + len - 0.02);
    const src = loopNoise(ac, white(ac), hf);
    hf.connect(hg).connect(output);
    playBuf(ac, "click", output, now + len - 0.22, 0.25, 0.8);
    return () => src.stop();
  }));

  // Station PA relayed on the public channel: two-tone chime + bed.
  audio.define("pa", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const len = cueLen(ctx);
    const nodes: OscillatorNode[] = [];
    [[988, 0], [784, 0.32]].forEach(([fr, dt]) => {
      const o = ac.createOscillator();
      o.type = "sine";
      o.frequency.value = fr;
      const g = ac.createGain();
      g.gain.setValueAtTime(0, now + dt);
      g.gain.linearRampToValueAtTime(0.07, now + dt + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0005, now + dt + 0.9);
      o.connect(bp(ac, 1400, 0.5)).connect(g).connect(output);
      o.start(now + dt);
      o.stop(now + dt + 1);
      nodes.push(o);
    });
    const hf = bp(ac, 2200, 0.5);
    const hg = ac.createGain();
    hg.gain.setValueAtTime(0, now);
    hg.gain.linearRampToValueAtTime(0.018, now + 0.5);
    hg.gain.setValueAtTime(0.018, now + Math.max(0.6, len - 0.3));
    hg.gain.linearRampToValueAtTime(0, now + len);
    const src = loopNoise(ac, white(ac), hf);
    hf.connect(hg).connect(output);
    return { stop: () => { src.stop(); nodes.forEach((n) => { try { n.stop(); } catch { /* done */ } }); } };
  });

  // Vacuum: the only way a shot reaches Zhang is through his own arm and suit.
  audio.define("gun-suit", (ctx) => withBuffers(ctx, () => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const f = lp(ac, 210, 1.2);
    f.connect(output);
    const s = playBuf(ac, "crunch", f, now, 0.9, 0.75);
    const o = ac.createOscillator();
    o.frequency.setValueAtTime(70, now);
    o.frequency.exponentialRampToValueAtTime(34, now + 0.14);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.55, now + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    o.connect(g).connect(output);
    o.start(now);
    o.stop(now + 0.22);
    const m = lp(ac, 900);
    m.connect(output);
    playBuf(ac, "metal-light2", m, now + 0.01, 0.18, 1.6);
    return () => { s?.stop(); o.stop(); };
  }));

  // Mechanical handling heard through gloves and suit: muffled metal.
  audio.define("suit-metal", (ctx) => withBuffers(ctx, () => {
    const { audioContext: ac, output } = ctx;
    const f = lp(ac, (ctx.cue.payload as any)?.cutoff ?? 650, 1);
    f.connect(output);
    const s = playBuf(ac, (ctx.cue.payload as any)?.sample ?? "metal-med", f, ac.currentTime, 1, (ctx.cue.payload as any)?.rate ?? 0.9);
    return () => s?.stop();
  }));

  audio.define("thruster-suit", (ctx) => withBuffers(ctx, () => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const f = lp(ac, 420, 0.8);
    const g = ac.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.9, now + 0.6);
    f.connect(g).connect(output);
    const b = buffers.get("thruster");
    let s: AudioBufferSourceNode | undefined;
    if (b) {
      s = ac.createBufferSource();
      s.buffer = b;
      s.loop = true;
      s.playbackRate.value = 0.7;
      s.connect(f);
      s.start(now);
    }
    const rf = lp(ac, 120);
    const rg = ac.createGain();
    rg.gain.value = 0.4;
    const n = loopNoise(ac, brown(ac), rf);
    rf.connect(rg).connect(g);
    return () => { s?.stop(); n.stop(); };
  }));

  // Basement gunshot: recorded blast + body, through a small concrete-room convolver.
  audio.define("gun-room", (ctx) => withBuffers(ctx, () => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const conv = ac.createConvolver();
    conv.buffer = basementIR(ac);
    const wet = ac.createGain();
    wet.gain.value = 0.9;
    conv.connect(wet).connect(output);
    const dry = ac.createGain();
    dry.gain.value = 1;
    dry.connect(output);
    dry.connect(conv);
    const a = playBuf(ac, "crunch", dry, now, 1, 1.15);
    const b = playBuf(ac, "punch", dry, now, 0.9, 0.7);
    const c = playBuf(ac, "lowboom", dry, now, 0.8, 1.3);
    // A 15 ms crack on top.
    const cr = ac.createBufferSource();
    cr.buffer = white(ac);
    const cg = ac.createGain();
    cg.gain.setValueAtTime(0.9, now);
    cg.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1800;
    cr.connect(hp).connect(cg).connect(dry);
    cr.start(now);
    cr.stop(now + 0.05);
    return () => { a?.stop(); b?.stop(); c?.stop(); };
  }));

  audio.define("tinnitus", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const len = cueLen(ctx);
    const o = ac.createOscillator();
    o.frequency.value = 4150;
    const o2 = ac.createOscillator();
    o2.frequency.value = 4163;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.06, now + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, now + len);
    o.connect(g);
    o2.connect(g);
    g.connect(output);
    o.start(now);
    o2.start(now);
    return { stop: () => { o.stop(); o2.stop(); } };
  });

  // Hutong dusk: distant city wash and a pigeon flock's whistles circling.
  audio.define("hutong", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const f = lp(ac, 380);
    const g = ac.createGain();
    g.gain.value = 0.22;
    const src = loopNoise(ac, brown(ac), f);
    f.connect(g).connect(output);
    const oscs: OscillatorNode[] = [];
    const wg = ac.createGain();
    wg.gain.setValueAtTime(0, now);
    wg.gain.linearRampToValueAtTime(0.012, now + 2.5);
    wg.gain.linearRampToValueAtTime(0.02, now + 5);
    wg.gain.linearRampToValueAtTime(0.004, now + 9);
    wg.connect(output);
    for (const fr of [742, 1113, 1484, 1860]) {
      const o = ac.createOscillator();
      o.frequency.setValueAtTime(fr * 1.02, now);
      o.frequency.linearRampToValueAtTime(fr * 0.98, now + 9);
      const lfo = ac.createOscillator();
      lfo.frequency.value = 5.5 + fr / 1000;
      const lg = ac.createGain();
      lg.gain.value = fr * 0.004;
      lfo.connect(lg).connect(o.frequency);
      o.connect(wg);
      o.start(now);
      lfo.start(now);
      oscs.push(o, lfo);
    }
    return { stop: () => { src.stop(); oscs.forEach((o) => o.stop()); } };
  });

  // Old-house room tone with a wall clock (sampled wood ticks).
  audio.define("room-tone", (ctx) => withBuffers(ctx, () => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const f = lp(ac, 300);
    const g = ac.createGain();
    g.gain.value = 0.05;
    const src = loopNoise(ac, brown(ac), f);
    f.connect(g).connect(output);
    const len = cueLen(ctx);
    const tick = lp(ac, 2500);
    tick.connect(output);
    const srcs: AudioBufferSourceNode[] = [];
    const first = Math.ceil(ctx.cue.start + ctx.offset) - (ctx.cue.start + ctx.offset);
    for (let k = 0; first + k < len && k < 200; k++) {
      const s = playBuf(ac, "wood-light", tick, now + first + k, 0.05, k % 2 ? 2.4 : 2.1);
      if (s) srcs.push(s);
    }
    return () => { src.stop(); srcs.forEach((s) => { try { s.stop(); } catch { /* ok */ } }); };
  }));

  audio.define("fluoro", ({ audioContext: ac, output }) => {
    const oscs = [100, 200, 300].map((fr, i) => {
      const o = ac.createOscillator();
      o.type = i === 0 ? "sawtooth" : "sine";
      o.frequency.value = fr;
      const g = ac.createGain();
      g.gain.value = [0.006, 0.005, 0.003][i];
      o.connect(lp(ac, 900)).connect(g).connect(output);
      o.start();
      return o;
    });
    return { stop: () => oscs.forEach((o) => o.stop()) };
  });

  // Cutting: a resonant screech on noise, jittered, with sampled chatter hits.
  audio.define("lathe-cut", (ctx) => withBuffers(ctx, () => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const len = cueLen(ctx);
    const f = bp(ac, 3100, 7);
    const g = ac.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.22, now + 0.15);
    g.gain.setValueAtTime(0.22, now + Math.max(0.2, len - 0.15));
    g.gain.linearRampToValueAtTime(0, now + len);
    const src = loopNoise(ac, white(ac), f);
    f.connect(g).connect(output);
    const lfo = ac.createOscillator();
    lfo.frequency.value = 17;
    const lg = ac.createGain();
    lg.gain.value = 260;
    lfo.connect(lg).connect(f.frequency);
    lfo.start(now);
    const squeal = ac.createOscillator();
    squeal.frequency.value = 2380;
    const sg = ac.createGain();
    sg.gain.value = 0.012;
    squeal.connect(sg).connect(g);
    squeal.start(now);
    const hits: AudioBufferSourceNode[] = [];
    for (let k = 0; k * 0.23 < len; k++) {
      const s = playBuf(ac, k % 2 ? "metal-light" : "metal-light2", output, now + k * 0.23 + (k % 3) * 0.03, 0.07, 1.6 + (k % 4) * 0.1);
      if (s) hits.push(s);
    }
    return () => { src.stop(); lfo.stop(); squeal.stop(); hits.forEach((h) => { try { h.stop(); } catch { /* ok */ } }); };
  }));

  // A run of small sampled contacts (placing parts, pliers bites).
  audio.define("ticks", (ctx) => withBuffers(ctx, () => {
    const { audioContext: ac, output } = ctx;
    const p = (ctx.cue.payload as any) ?? {};
    const now = ac.currentTime;
    const len = cueLen(ctx);
    const every = p.every ?? 0.13;
    const srcs: AudioBufferSourceNode[] = [];
    for (let k = 0; k * every < len; k++) {
      const s = playBuf(ac, p.sample ?? "click", output, now + k * every + ((k * 37) % 5) * 0.012, p.gain ?? 0.2, (p.rate ?? 1.4) + ((k * 13) % 5) * 0.04);
      if (s) srcs.push(s);
    }
    return () => srcs.forEach((s) => { try { s.stop(); } catch { /* ok */ } });
  }));

  audio.define("bulb-buzz", ({ audioContext: ac, output }) => {
    const o = ac.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = 50;
    const g = ac.createGain();
    g.gain.value = 0.01;
    o.connect(lp(ac, 400)).connect(g).connect(output);
    o.start();
    return { stop: () => o.stop() };
  });

  // Score: a sparse low pad. payload.notes in Hz.
  audio.define("drone", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const p = (ctx.cue.payload as any) ?? {};
    const notes: number[] = p.notes ?? [55, 82.4];
    const now = ac.currentTime;
    const len = cueLen(ctx);
    const atk = ctx.offset > 0.5 ? 0.3 : p.attack ?? 3;
    const rel = Math.min(p.release ?? 3, len * 0.5);
    const g = ac.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(p.level ?? 0.06, now + atk);
    g.gain.setValueAtTime(p.level ?? 0.06, now + Math.max(atk, len - rel));
    g.gain.linearRampToValueAtTime(0, now + len);
    const f = lp(ac, p.cutoff ?? 500, 0.5);
    f.connect(g).connect(output);
    const oscs: OscillatorNode[] = [];
    notes.forEach((fr, i) => {
      for (const det of [-5, 5]) {
        const o = ac.createOscillator();
        o.type = i === 0 ? "triangle" : "sawtooth";
        o.frequency.value = fr;
        o.detune.value = det;
        const og = ac.createGain();
        og.gain.value = i === 0 ? 0.5 : 0.18;
        o.connect(og).connect(f);
        o.start(now);
        oscs.push(o);
      }
    });
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.07;
    const lg = ac.createGain();
    lg.gain.value = (p.cutoff ?? 500) * 0.35;
    lfo.connect(lg).connect(f.frequency);
    lfo.start(now);
    oscs.push(lfo);
    return { stop: () => oscs.forEach((o) => o.stop()) };
  });

  // Heartbeat heard inside the helmet: sampled soft thump, low-passed, accelerating.
  audio.define("heart", (ctx) => withBuffers(ctx, () => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const len = cueLen(ctx);
    const f = lp(ac, 140, 1);
    f.connect(output);
    const srcs: AudioBufferSourceNode[] = [];
    let tt = 0;
    let k = 0;
    while (tt < len) {
      const bpm = 72 + 36 * (tt / Math.max(1, len));
      const a = playBuf(ac, "soft-heavy", f, now + tt, 0.9, 0.55);
      const b = playBuf(ac, "soft-heavy", f, now + tt + 0.22, 0.55, 0.6);
      if (a) srcs.push(a);
      if (b) srcs.push(b);
      tt += 60 / bpm;
      k++;
    }
    return () => srcs.forEach((s) => { try { s.stop(); } catch { /* ok */ } });
  }));

  audio.define("alarm", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const len = cueLen(ctx);
    const o = ac.createOscillator();
    o.type = "square";
    for (let k = 0; k * 0.25 < len; k++) o.frequency.setValueAtTime(k % 2 ? 660 : 880, now + k * 0.25);
    const g = ac.createGain();
    g.gain.value = 0.018;
    o.connect(bp(ac, 1500, 1.2)).connect(g).connect(output);
    o.start(now);
    return { stop: () => o.stop() };
  });

  // Escaping air through open suit mics: violent, band-limited hiss on the channel.
  audio.define("leak-radio", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const len = cueLen(ctx);
    const f = bp(ac, 2400, 0.9);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.14, now + 0.05);
    g.gain.setValueAtTime(0.14, now + len * 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, now + len);
    const src = loopNoise(ac, white(ac), f);
    const am = ac.createOscillator();
    am.frequency.value = 23;
    const amg = ac.createGain();
    amg.gain.value = 0.05;
    am.connect(amg).connect(g.gain);
    am.start(now);
    f.connect(g).connect(output);
    return { stop: () => { src.stop(); am.stop(); } };
  });

  audio.define("valve-radio", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const f = bp(ac, 1800, 0.7);
    const g = ac.createGain();
    g.gain.value = 0.02;
    const src = loopNoise(ac, white(ac), f);
    f.connect(g).connect(output);
    const o = ac.createOscillator();
    o.frequency.value = 50;
    const og = ac.createGain();
    og.gain.value = 0.006;
    o.connect(og).connect(output);
    o.start();
    return { stop: () => { src.stop(); o.stop(); } };
  });

  audio.define("pour", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const len = cueLen(ctx);
    const f = bp(ac, 1700, 1.4);
    const g = ac.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.1, now + 0.15);
    g.gain.setValueAtTime(0.1, now + len - 0.2);
    g.gain.linearRampToValueAtTime(0, now + len);
    f.frequency.setValueAtTime(1300, now);
    f.frequency.linearRampToValueAtTime(2300, now + len);
    const src = loopNoise(ac, white(ac), f);
    f.connect(g).connect(output);
    return { stop: () => src.stop() };
  });
}

// ------------------------------------------------------------------- cues

let n = 0;
function cue(sound: string, start: number, dur: number, gain = 1, group = "sfx", extra: Partial<SoundCue> = {}): SoundCue {
  n++;
  return { id: `sfx-${String(n).padStart(3, "0")}-${sound}`, kind: "sound", sound, group, gain, sustain: false, start, end: start + dur, ...extra };
}
const sus = (sound: string, start: number, end: number, gain = 1, group = "amb", payload?: unknown): SoundCue =>
  cue(sound, start, end - start, gain, group, { sustain: true, payload });

function steps(kind: "c" | "w", from: number, to: number, every: number, gain: number): SoundCue[] {
  const out: SoundCue[] = [];
  let i = 0;
  for (let t = from; t < to; t += every) out.push(cue(`step-${kind}${i++ % 3}`, t, 0.6, gain));
  return out;
}

export function buildSoundCues(duration: number): SoundCue[] {
  n = 0;
  const c: SoundCue[] = [];
  c.push(sus("prewarm", 0, duration, 0, "sys"));

  // Space I.
  c.push(sus("breath", 0.2, 40, 1, "suit", { period: 5.2 }));
  c.push(sus("suit-hum", 0, 40, 1, "suit"));
  c.push(sus("drone", 1, 40, 1, "music", { notes: [41.2, 61.7, 123.5], cutoff: 420, attack: 6, release: 2, level: 0.05 }));
  c.push(cue("lowboom", 4.5, 4.5, 0.35, "music"));

  // Hutong.
  c.push(sus("hutong", 40, 50, 1));
  c.push(...steps("c", 40.25, 46.1, 0.4, 0.28));
  c.push(cue("knock", 46.53, 0.6, 0.8), cue("knock", 47.05, 0.6, 0.75), cue("knock", 47.57, 0.6, 0.85));
  c.push(cue("metal-light", 48.2, 0.6, 0.25), cue("wood-light", 48.5, 0.6, 0.3));

  // Collector's house.
  c.push(sus("room-tone", 50, 148, 1));
  c.push(...steps("w", 50.3, 54.3, 0.5, 0.3), ...steps("w", 56.3, 60.9, 0.62, 0.25));
  c.push(...steps("w", 57.2, 61.2, 0.45, 0.2));
  c.push(cue("wood-light", 61.5, 0.5, 0.35), cue("wood-light", 61.75, 0.5, 0.3));
  c.push(cue("cup2", 62.5, 0.5, 0.25), cue("pour", 62.9, 1.5, 1), cue("cup", 64.9, 0.5, 0.3));
  c.push(cue("cup", 89.9, 0.5, 0.2), cue("cup2", 97.5, 0.5, 0.3));
  c.push(cue("stone", 79.6, 0.5, 0.25));
  c.push(cue("velvet", 116.8, 0.6, 0.5), cue("stone", 116.95, 0.5, 0.2));
  c.push(cue("ticks", 132.3, 1.0, 1, "sfx", { payload: { sample: "click", every: 0.3, gain: 0.25, rate: 1.8 } }));
  c.push(cue("click", 141.3, 0.4, 0.3));
  c.push(cue("drone", 142.8, 5.2, 1, "music", { payload: { notes: [55, 82.4], cutoff: 380, attack: 3.5, release: 0.3, level: 0.05 } }));

  // Space II.
  c.push(sus("breath", 148, 162, 1, "suit", { period: 4.8 }));
  c.push(sus("suit-hum", 148, 162, 1, "suit"));
  c.push(sus("drone", 148.2, 161.8, 1, "music", { notes: [41.2, 61.7], cutoff: 360, attack: 4, release: 1.5, level: 0.045 }));

  // Machine shop.
  c.push(sus("fluoro", 162, 189.3, 1));
  c.push(cue("switch-a", 163.4, 0.4, 0.5), cue("switch-a", 164.2, 0.4, 0.5), cue("switch-a", 165.0, 0.4, 0.5), cue("switch-a", 165.8, 0.4, 0.5));
  c.push(cue("computer", 164.4, 1.2, 0.18));
  c.push(cue("switch-b", 166.4, 0.4, 0.7));
  c.push(sus("lathe-motor", 166.6, 181.2, 0.5, "sfx"));
  c.push(cue("mining", 166.7, 0.8, 0.25));
  c.push(...steps("c", 168.3, 169.5, 0.42, 0.3));
  c.push(cue("lathe-cut", 170.6, 4.0, 1));
  for (const d of [176.6, 177.7, 178.8, 179.9]) {
    c.push(cue("lathe-cut", d - 0.7, 0.7, 0.7));
    c.push(cue("tin", d + 0.25, 0.6, 0.35));
  }
  c.push(cue("switch-b", 181.2, 0.4, 0.6));
  c.push(...steps("c", 181.0, 181.6, 0.3, 0.25));
  c.push(cue("ticks", 181.35, 3.85, 1, "sfx", { payload: { sample: "metal-light2", every: 0.107, gain: 0.08, rate: 2.6 } }));
  c.push(cue("velvet", 186.0, 0.6, 0.35));
  c.push(cue("metal-light", 187.2, 0.5, 0.4), cue("metal-light2", 187.5, 0.5, 0.35));
  c.push(...steps("c", 188.3, 190, 0.42, 0.28));
  c.push(cue("switch-b", 189.3, 0.4, 0.8));

  // Basement.
  c.push(sus("bulb-buzz", 190, 232, 1));
  c.push(cue("ticks", 190.6, 4.8, 1, "sfx", { payload: { sample: "metal-light2", every: 0.133, gain: 0.12, rate: 2.2 } }));
  c.push(cue("ticks", 190.7, 4.8, 1, "sfx", { payload: { sample: "tin", every: 0.4, gain: 0.08, rate: 2.4 } }));
  c.push(cue("glue", 195.8, 1.0, 0.18));
  c.push(cue("ticks", 196.0, 3.6, 1, "sfx", { payload: { sample: "click", every: 0.105, gain: 0.12, rate: 1.1 } }));
  for (const tt of [201.0, 201.7, 202.4, 203.1]) c.push(cue("metal-light", tt, 0.5, 0.45), cue("click", tt + 0.03, 0.3, 0.3));
  c.push(cue("metal-light2", 203.7, 0.5, 0.35), cue("metal-med", 204.6, 0.7, 0.7), cue("metal-med", 205.25, 0.7, 0.5));
  for (const s of BASEMENT_SHOTS) c.push(cue("gun-room", s, 2.6, 1, "gun"));
  c.push(cue("tinnitus", 207.25, 8.5, 1, "subjective"));
  c.push(...steps("c", 212.6, 213.3, 0.35, 0.2));
  c.push(cue("velvet", 219.0, 0.6, 0.45), cue("velvet", 219.45, 0.6, 0.35));
  for (const tt of [221.9, 223.1, 224.3]) c.push(cue("soft-heavy", tt, 0.6, 0.22));
  c.push(cue("ticks", 225.9, 0.5, 1, "sfx", { payload: { sample: "stone", every: 0.09, gain: 0.08, rate: 2.2 } }));

  // Space III.
  c.push(sus("breath", 232, 298, 1, "suit", { period: 4.4 }));
  c.push(sus("suit-hum", 232, 336, 1, "suit"));
  c.push(sus("drone", 232.2, 284, 1, "music", { notes: [36.7, 55, 110], cutoff: 340, attack: 5, release: 4, level: 0.055 }));
  for (const tt of [266.9, 267.35, 267.8]) c.push(cue("suit-metal", tt, 0.5, 0.8, "suit", { payload: { sample: "metal-light", cutoff: 700, rate: 1.1 } }));
  c.push(cue("suit-metal", 268.5, 0.6, 0.9, "suit", { payload: { sample: "metal-med", cutoff: 500, rate: 1.2 } }));
  c.push(cue("suit-metal", 275.4, 0.6, 0.8, "suit", { payload: { sample: "metal-light2", cutoff: 600 } }));
  c.push(cue("suit-metal", 276.3, 0.6, 0.6, "suit", { payload: { sample: "metal-light", cutoff: 600 } }));
  c.push(cue("suit-metal", 281.55, 0.8, 1.2, "suit", { payload: { sample: "metal-med", cutoff: 800, rate: 0.8 } }));
  for (const s of SHOTS) c.push(cue("gun-suit", s, 0.45, 1, "suit"));
  for (const [a, b] of MAG_CHANGES) {
    c.push(cue("suit-metal", a + 0.1, 0.5, 0.9, "suit", { payload: { sample: "metal-light2", cutoff: 700 } }));
    c.push(cue("suit-metal", b - 0.35, 0.6, 1.1, "suit", { payload: { sample: "metal-med", cutoff: 700 } }));
  }
  c.push(sus("breath", 298, 310, 1.3, "suit", { period: 2.6 }));
  c.push(cue("heart", 297.6, 12.0, 1, "subjective"));
  c.push(cue("leak-radio", 307.7, 5.0, 1, "radio"));
  c.push(cue("alarm", 314.0, 6.0, 1, "radio"));
  c.push(sus("breath", 310, 336, 1, "suit", { period: 5.4 }));
  c.push(sus("drone", 309, 324, 1, "music", { notes: [49, 146.8, 220], cutoff: 900, attack: 4, release: 2, level: 0.035 }));
  c.push(cue("suit-metal", 322.0, 0.5, 0.7, "suit", { payload: { sample: "metal-light", cutoff: 600 } }));
  c.push(cue("suit-metal", 323.1, 0.6, 0.9, "suit", { payload: { sample: "metal-med", cutoff: 600, rate: 1.2 } }));
  c.push(cue("suit-metal", 323.4, 0.5, 0.5, "suit", { payload: { sample: "metal-light2", cutoff: 500 } }));
  c.push(cue("thruster-suit", 327.4, 8.6, 0.8, "suit"));
  c.push(sus("drone", 324.5, 336, 1, "music", { notes: [55, 82.4, 164.8], cutoff: 520, attack: 3, release: 1.2, level: 0.05 }));

  // Coda.
  c.push(sus("room-tone", 336, 350, 1));
  c.push(sus("valve-radio", 336.4, 348.3, 1));
  c.push(cue("drone", 350, 7.8, 1, "music", { payload: { notes: [41.2, 61.7, 92.5], cutoff: 400, attack: 2.5, release: 3, level: 0.05 } }));

  // Transmission chirps and PA chimes, derived from the voice manifest.
  for (const v of voiceCues) {
    if (v.kind === "radio") c.push(cue("radio", Math.max(0, v.start - 0.14), v.end - v.start + 0.42, 1, "radio"));
    if (v.kind === "broadcast" && v.speaker === "黄河站广播") c.push(cue("pa", Math.max(0, v.start - 1.1), v.end - v.start + 1.4, 1, "radio"));
  }
  return c.map((x) => ({ ...x, end: Math.min(duration, x.end) }));
}

export const GROUP_GAINS: Record<string, number> = {
  sys: 0, amb: 0.9, suit: 0.9, sfx: 1, gun: 1, radio: 0.9, music: 0.8, subjective: 0.8,
};

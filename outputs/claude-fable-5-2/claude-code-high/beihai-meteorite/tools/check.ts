/**
 * Development-only headless check (this machine has no browser).
 *
 *  1. Steps the real CinematicPlayer through the whole film at 30 fps and fails on
 *     any exception or non-finite camera transform.
 *  2. Runs every sound cue's factory against a strict mock of the Web Audio API
 *     that enforces the rules a real AudioContext throws on (unknown methods,
 *     negative or non-finite times, exponential ramps through zero, double start,
 *     stop before start, bad buffer arguments), including resumes from the middle
 *     of every sustained cue.
 *
 *   bun tools/check.ts
 */
import "./preview.ts";

const problems: string[] = [];
const note = (m: string): void => {
  if (problems.length < 60) problems.push(m);
};
let current = "";

class MockParam {
  events: Array<[string, number, number]> = [];
  constructor(public value: number, readonly label: string) {}
  private check(kind: string, v: number, t: number): void {
    if (!Number.isFinite(v)) note(`${current}: ${this.label}.${kind} value ${v}`);
    if (!Number.isFinite(t) || t < 0) note(`${current}: ${this.label}.${kind} time ${t}`);
    if (t < ctxTime - 1e-6) note(`${current}: ${this.label}.${kind} scheduled in the past (${(t - ctxTime).toFixed(4)})`);
    const last = this.events[this.events.length - 1];
    if (last && t < last[1] - 1e-9) note(`${current}: ${this.label}.${kind} time goes backwards ${last[1].toFixed(4)} -> ${t.toFixed(4)}`);
    this.events.push([kind, t, v]);
  }
  setValueAtTime(v: number, t: number): this { this.check("set", v, t); return this; }
  linearRampToValueAtTime(v: number, t: number): this { this.check("lin", v, t); return this; }
  exponentialRampToValueAtTime(v: number, t: number): this {
    const last = this.events[this.events.length - 1];
    const prev = last ? last[2] : this.value;
    if (v === 0 || prev === 0 || Math.sign(v) !== Math.sign(prev)) note(`${current}: ${this.label}.exp from ${prev} to ${v}`);
    this.check("exp", v, t);
    return this;
  }
  setTargetAtTime(v: number, t: number, c: number): this {
    if (!(c > 0)) note(`${current}: ${this.label}.setTarget constant ${c}`);
    this.check("tgt", v, t);
    return this;
  }
  cancelScheduledValues(_t: number): this { this.events = []; return this; }
}

let ctxTime = 100;
let nodeCount = 0;

class MockNode {
  outputs = 0;
  constructor() { nodeCount++; }
  connect(dest: unknown): unknown {
    if (!(dest instanceof MockNode) && !(dest instanceof MockParam)) note(`${current}: connect() to a non-node ${String(dest)}`);
    this.outputs++;
    return dest;
  }
  disconnect(): void {}
}
class Source extends MockNode {
  started = false;
  startAt = 0;
  onended: unknown = null;
  start(when = 0, offset = 0): void {
    if (this.started) note(`${current}: start() called twice`);
    if (!Number.isFinite(when) || when < 0) note(`${current}: start(${when})`);
    if (!Number.isFinite(offset) || offset < 0) note(`${current}: start offset ${offset}`);
    this.started = true;
    this.startAt = when;
  }
  stop(when = 0): void {
    if (!this.started) throw new Error("InvalidStateError: stop before start");
    if (!Number.isFinite(when) || when < 0) note(`${current}: stop(${when})`);
  }
}
const OSC_TYPES = new Set(["sine", "square", "sawtooth", "triangle"]);
class Osc extends Source {
  private kind = "sine";
  frequency = new MockParam(440, "osc.frequency");
  detune = new MockParam(0, "osc.detune");
  set type(v: string) { if (!OSC_TYPES.has(v)) note(`${current}: oscillator type ${v}`); this.kind = v; }
  get type(): string { return this.kind; }
}
class MockBuffer {
  private data: Float32Array[];
  readonly duration: number;
  constructor(readonly numberOfChannels: number, readonly length: number, readonly sampleRate: number) {
    if (!(numberOfChannels >= 1) || !(length > 0) || sampleRate < 8000 || sampleRate > 96000) throw new Error(`NotSupportedError: createBuffer(${numberOfChannels}, ${length}, ${sampleRate})`);
    this.data = Array.from({ length: numberOfChannels }, () => new Float32Array(length));
    this.duration = length / sampleRate;
  }
  getChannelData(ch: number): Float32Array {
    if (ch >= this.numberOfChannels) throw new Error("IndexSizeError");
    return this.data[ch]!;
  }
}
class BufSrc extends Source {
  buffer: MockBuffer | null = null;
  loop = false;
  playbackRate = new MockParam(1, "src.playbackRate");
  start(when = 0, offset = 0): void {
    if (!this.buffer) note(`${current}: buffer source started without a buffer`);
    else if (offset > this.buffer.duration) note(`${current}: start offset beyond buffer`);
    super.start(when, offset);
  }
}
class Gain extends MockNode { gain = new MockParam(1, "gain.gain"); }
const FILTERS = new Set(["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"]);
class Biquad extends MockNode {
  private kind = "lowpass";
  frequency = new MockParam(350, "biquad.frequency");
  Q = new MockParam(1, "biquad.Q");
  gain = new MockParam(0, "biquad.gain");
  detune = new MockParam(0, "biquad.detune");
  set type(v: string) { if (!FILTERS.has(v)) note(`${current}: filter type ${v}`); this.kind = v; }
  get type(): string { return this.kind; }
}
class Delay extends MockNode {
  delayTime = new MockParam(0, "delay.delayTime");
  constructor(readonly max: number) { super(); if (!(max > 0 && max < 180)) throw new Error("NotSupportedError: delay max"); }
}
class Convolver extends MockNode {
  normalize = true;
  private buf: MockBuffer | null = null;
  set buffer(b: MockBuffer | null) { if (b && !(b instanceof MockBuffer)) note(`${current}: convolver buffer`); this.buf = b; }
  get buffer(): MockBuffer | null { return this.buf; }
}
class Compressor extends MockNode {
  threshold = new MockParam(-24, "comp.threshold"); knee = new MockParam(30, "comp.knee"); ratio = new MockParam(12, "comp.ratio");
  attack = new MockParam(0.003, "comp.attack"); release = new MockParam(0.25, "comp.release");
}
class MockAudioContext {
  sampleRate = 48000;
  state = "running";
  destination = new MockNode();
  get currentTime(): number { return ctxTime; }
  createOscillator(): Osc { return new Osc(); }
  createBufferSource(): BufSrc { return new BufSrc(); }
  createGain(): Gain { return new Gain(); }
  createBiquadFilter(): Biquad { return new Biquad(); }
  createDelay(max = 1): Delay { return new Delay(max); }
  createConvolver(): Convolver { return new Convolver(); }
  createDynamicsCompressor(): Compressor { return new Compressor(); }
  createBuffer(c: number, l: number, r: number): MockBuffer { return new MockBuffer(c, l, r); }
  async resume(): Promise<void> {}
  async close(): Promise<void> {}
}

const g = globalThis as any;
g.AudioContext = MockAudioContext;
g.AudioParam = MockParam;
g.requestAnimationFrame = () => 1;
g.cancelAnimationFrame = () => {};

const { createFilm } = await import("../src/film.ts");
const { registerSounds } = await import("../src/audio/synth.ts");
const { WebAudioCueBus } = await import("@agentbench/cinematic-player");
const { soundCues } = await import("../src/cues/sound.ts");
const { voiceCues } = await import("../src/cues/voice.ts");

const film = createFilm();
const { player, ctx } = film;
const audio = new WebAudioCueBus(player);
registerSounds(audio);
await audio.unlock();

// Which factory is running, for error messages.
let started = 0;
const defined = new Set<string>();
const realDefine = audio.define.bind(audio);
(audio as any).define = (name: string, f: any) => realDefine(name, (c: any) => { current = `${c.cue.id}@${c.offset.toFixed(2)}`; started++; return f(c); });
registerSounds(audio);
for (const c of soundCues) defined.add(c.sound);

console.log(`shots: ${film.shots.length}, voice cues: ${voiceCues.length}, sound cues: ${soundCues.length}, sounds: ${defined.size}`);

// 1 + 2a: step the whole film; every cue fires once from its start.
const dt = 1 / 30;
let frames = 0;
const t0 = performance.now();
for (let t = 0; t <= player.duration + 1e-6; t += dt) {
  ctxTime = 100 + t;
  try {
    player.step(dt);
  } catch (e) {
    note(`exception at t=${t.toFixed(2)}: ${(e as Error).stack?.split("\n").slice(0, 3).join(" | ")}`);
    break;
  }
  const cam = ctx.camera;
  const m = cam.matrixWorld.elements;
  if (!m.every(Number.isFinite) || !Number.isFinite(cam.fov) || cam.fov <= 0 || cam.fov > 120) note(`bad camera at t=${t.toFixed(2)} fov=${cam.fov}`);
  frames++;
}
console.log(`stepped ${frames} frames in ${((performance.now() - t0) / 1000).toFixed(1)} s, factories run: ${started}, audio nodes: ${nodeCount}`);
if (started < soundCues.length) note(`only ${started} of ${soundCues.length} sound cues started`);

// 2b: resume inside every sustained cue (seek while playing).
player.seek(0);
player.play();
let resumes = 0;
for (const cue of soundCues) {
  if (!cue.sustain) continue;
  for (const f of [0.31, 0.83]) {
    const t = cue.start + (cue.end - cue.start) * f;
    ctxTime = 1000 + resumes;
    const before = started;
    try {
      player.seek(t);
    } catch (e) {
      note(`exception seeking to ${t.toFixed(2)}: ${(e as Error).message}`);
    }
    if (started === before) note(`sustained cue ${cue.id} did not restart at ${t.toFixed(2)}`);
    resumes++;
  }
}
player.pause();
console.log(`resumed into sustained cues ${resumes} times`);

// Timeline bookkeeping.
const overlap = [...voiceCues].sort((a, b) => a.start - b.start);
for (let i = 1; i < overlap.length; i++) if (overlap[i]!.start < overlap[i - 1]!.end) note(`voice cues overlap: ${overlap[i - 1]!.id} / ${overlap[i]!.id}`);
for (const cue of voiceCues) {
  const rate = cue.text.replace(/[，。？！、——…：“”\s·]/g, "").length / (cue.end - cue.start);
  if (rate > 7.2) note(`voice cue ${cue.id} reads at ${rate.toFixed(1)} chars/s`);
  for (const k of ["id", "kind", "speaker", "text", "delivery", "start", "end"]) if (!(k in cue)) note(`voice cue missing ${k}`);
  if (Object.keys(cue).length !== 7) note(`voice cue ${cue.id} has ${Object.keys(cue).length} fields`);
}
console.log(`duration ${player.duration} s`);

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(" - " + p);
  process.exit(1);
}
console.log("OK");

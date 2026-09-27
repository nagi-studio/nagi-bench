// Drives the real player + WebAudioCueBus through the whole film against a strict
// fake AudioContext that throws on the argument errors real browsers reject.
import { CinematicPlayer, WebAudioCueBus } from "@agentbench/cinematic-player";
import { voiceCues } from "../src/voice";
import { buildSoundCues, registerSounds, GROUP_GAINS } from "../src/sound";

let now = 0;
let started = 0, active = 0, maxActive = 0;
const errors: string[] = [];

class Param {
  value = 0;
  private check(t: number, what: string) {
    if (!Number.isFinite(t) || t < 0) throw new RangeError(`${what}: bad time ${t}`);
  }
  setValueAtTime(v: number, t: number) { this.check(t, "setValueAtTime"); if (!Number.isFinite(v)) throw new RangeError("setValue NaN"); return this; }
  linearRampToValueAtTime(v: number, t: number) { this.check(t, "linearRamp"); if (!Number.isFinite(v)) throw new RangeError("linear NaN"); return this; }
  exponentialRampToValueAtTime(v: number, t: number) { this.check(t, "expRamp"); if (!(v > 0) && !(v < 0)) throw new RangeError(`expRamp to ${v}`); return this; }
  setTargetAtTime(v: number, t: number, c: number) { this.check(t, "setTarget"); if (!(c > 0)) throw new RangeError("tc"); return this; }
}
class Node {
  connect(n: any) { return n; }
  disconnect() {}
}
class Gain extends Node { gain = new Param(); }
class Filter extends Node { type = "lowpass"; frequency = new Param(); Q = new Param(); }
class Conv extends Node { buffer: any = null; }
class Src extends Node {
  private st = false;
  private sp = false;
  start(when = 0, offset = 0) {
    if (this.st) throw new Error("InvalidStateError: start twice");
    if (when < 0 || offset < 0) throw new RangeError(`start(${when}, ${offset})`);
    this.st = true; started++; active++; maxActive = Math.max(maxActive, active);
  }
  stop(when = 0) {
    if (!this.st) throw new Error("InvalidStateError: stop before start");
    if (when < 0) throw new RangeError("stop time");
    if (!this.sp) { this.sp = true; active--; }
  }
}
class Osc extends Src { type = "sine"; frequency = new Param(); detune = new Param(); }
class Buf extends Src { buffer: any = null; loop = false; loopStart = 0; loopEnd = 0; playbackRate = new Param(); detune = new Param(); }
class FakeBuffer {
  constructor(public numberOfChannels: number, public length: number, public sampleRate: number) {}
  private data = new Map<number, Float32Array>();
  get duration() { return this.length / this.sampleRate; }
  getChannelData(i: number) { if (!this.data.has(i)) this.data.set(i, new Float32Array(this.length)); return this.data.get(i)!; }
}
class FakeAC {
  sampleRate = 48000;
  state = "running";
  destination = new Node();
  get currentTime() { return now; }
  resume() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
  createGain() { return new Gain(); }
  createBiquadFilter() { return new Filter(); }
  createConvolver() { return new Conv(); }
  createOscillator() { return new Osc(); }
  createBufferSource() { return new Buf(); }
  createBuffer(c: number, l: number, sr: number) { return new FakeBuffer(c, l, sr); }
  decodeAudioData(_ab: ArrayBuffer) { return Promise.resolve(new FakeBuffer(1, 48000, 48000)); }
}
(globalThis as any).window = globalThis;
(globalThis as any).AudioContext = FakeAC;

const DURATION = 358;
let cb: FrameRequestCallback | undefined;
const player = new CinematicPlayer({
  duration: DURATION, context: {}, cues: [...voiceCues, ...buildSoundCues(DURATION)],
  requestFrame: (f) => { cb = f; return 1; }, cancelFrame: () => { cb = undefined; },
});
const audio = new WebAudioCueBus(player);
registerSounds(audio);
await audio.unlock();
for (const [g, v] of Object.entries(GROUP_GAINS)) audio.setGroupGain(g, v);

const origError = console.error;
console.error = (...a: any[]) => { errors.push(a.join(" ")); origError(...a); };
const drive = (from: number, to: number) => {
  let ms = 1000;
  while (player.isPlaying && player.currentTime < to) {
    const f = cb;
    cb = undefined;
    ms += 1000 / 30;
    now += 1 / 30;
    try { f?.(ms); } catch (e) { errors.push(`${player.currentTime.toFixed(2)}: ${(e as Error).message}`); }
    if (!cb) break;
  }
  void from;
};
// Full linear playback (let pending decodes settle first, as a browser would).
player.play();
await new Promise((r) => setTimeout(r, 20));
drive(0, DURATION);
console.log(`linear run ended at ${player.currentTime.toFixed(2)} state=${player.state}; sources started ${started}, peak concurrent ${maxActive}`);
// Pause / seek / resume in the middle of several scenes.
for (const t of [45, 64, 172, 207.1, 239, 289, 309, 330, 340]) {
  player.pause();
  player.seek(t);
  player.play();
  await new Promise((r) => setTimeout(r, 5));
  drive(t, t + 3);
}
player.pause();
console.log(`seek/resume runs done; still-active sources after pause: ${active}`);
await new Promise((r) => setTimeout(r, 50));
console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "no audio errors");

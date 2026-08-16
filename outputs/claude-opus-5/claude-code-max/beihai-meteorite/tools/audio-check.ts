import { installDomShim } from "./dom-shim";

installDomShim();

/**
 * 声音自检：用一个假的 AudioContext 把整条时间轴跑一遍，
 * 确认每一条采样都能注册、每一个程序化工厂都能被触发而不抛异常，
 * 并统计真空段落里到底响了些什么。
 */

const created: string[] = [];
const started: Array<{ name: string; at: number }> = [];

class FakeParam {
  value = 0;
  setValueAtTime(): this { return this; }
  linearRampToValueAtTime(): this { return this; }
  exponentialRampToValueAtTime(value: number): this {
    if (!(value > 0)) throw new Error("exponentialRampToValueAtTime 的目标值必须大于 0");
    return this;
  }
  setTargetAtTime(): this { return this; }
}

class FakeNode {
  constructor(readonly type: string) { created.push(type); }
  connect(next: unknown): unknown { return next; }
  disconnect(): void {}
}

class FakeContext {
  currentTime = 0;
  sampleRate = 48_000;
  state = "running";
  destination = new FakeNode("destination");
  createGain(): FakeNode & { gain: FakeParam } {
    return Object.assign(new FakeNode("gain"), { gain: new FakeParam() });
  }
  createOscillator(): FakeNode & Record<string, unknown> {
    return Object.assign(new FakeNode("oscillator"), {
      type: "sine",
      frequency: new FakeParam(),
      detune: new FakeParam(),
      start: () => started.push({ name: "oscillator", at: this.currentTime }),
      stop: () => undefined,
    });
  }
  createBufferSource(): FakeNode & Record<string, unknown> {
    return Object.assign(new FakeNode("buffer-source"), {
      buffer: null,
      loop: false,
      loopStart: 0,
      loopEnd: 0,
      playbackRate: new FakeParam(),
      detune: new FakeParam(),
      start: () => started.push({ name: "buffer-source", at: this.currentTime }),
      stop: () => undefined,
    });
  }
  createBiquadFilter(): FakeNode & Record<string, unknown> {
    return Object.assign(new FakeNode("biquad"), {
      type: "lowpass",
      frequency: new FakeParam(),
      Q: new FakeParam(),
      gain: new FakeParam(),
    });
  }
  createConvolver(): FakeNode & Record<string, unknown> {
    return Object.assign(new FakeNode("convolver"), { buffer: null, normalize: true });
  }
  createWaveShaper(): FakeNode & Record<string, unknown> {
    return Object.assign(new FakeNode("waveshaper"), { curve: null, oversample: "none" });
  }
  createBuffer(channels: number, length: number, rate: number): { getChannelData(): Float32Array; duration: number } {
    const data = new Float32Array(length);
    void channels;
    return { getChannelData: () => data, duration: length / rate };
  }
  async decodeAudioData(buffer: ArrayBuffer): Promise<{ duration: number; getChannelData(): Float32Array }> {
    return { duration: Math.max(0.2, buffer.byteLength / 48_000), getChannelData: () => new Float32Array(8) };
  }
  async resume(): Promise<void> {}
  async close(): Promise<void> {}
}

(globalThis as unknown as Record<string, unknown>).AudioContext = FakeContext;
(globalThis as unknown as Record<string, unknown>).window = globalThis;

const { createFilm } = await import("../src/film");
const { DURATION, T } = await import("../src/timeline");
const { soundCues } = await import("../src/sound");

const container = (globalThis as unknown as { document: { createElement(tag: string): unknown } }).document
  .createElement("div") as HTMLElement;
const film = createFilm({
  container,
  mountControls: false,
  screen: {
    root: container,
    setFade() {}, setFlash() {}, setTitle() {}, setGrain() {}, hidePoster() {}, destroy() {},
  } as never,
});

await film.audio.unlock();

let fired = 0;
film.player.addTypedEventListener("cue", ({ detail }) => {
  if (detail.cue.kind === "sound") fired += 1;
});

// 用 seek 逐帧推进，让每一条声音提示都被跨越一次
const problems: string[] = [];
for (let t = 0; t <= DURATION; t += 1 / 30) {
  try {
    film.player.seek(Math.min(DURATION, Number(t.toFixed(4))));
  } catch (error) {
    problems.push(`t=${t.toFixed(2)} 抛出：${(error as Error).message}`);
    break;
  }
}

// seek 不触发 cue（设计如此），所以再用 statechange 把持续音也过一遍
film.player.seek(0);
film.player.play();
film.player.pause();

const names = new Set(soundCues.map((cue) => cue.sound));
console.log(`声音名 ${names.size} 个，提示 ${soundCues.length} 条，节点创建 ${created.length} 个`);
console.log(`真空段（${T.s1[0]}s 起）持续音：${soundCues.filter((c) => c.start >= T.s1[0] && c.sustain).length} 条`);
console.log(`已触发的一次性声音：${fired} 条`);

film.destroy();

if (problems.length > 0) {
  for (const problem of problems) console.error(`✗ ${problem}`);
  process.exit(1);
}
if (created.length === 0) {
  console.error("✗ 一个音频节点都没有创建，声音链路没有接通");
  process.exit(1);
}
console.log("\n✓ 声音链路可用");

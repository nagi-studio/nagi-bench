/* Exercise every sound factory against a recording mock AudioContext. */
import { installDom } from "./dom-stub";
installDom();
const { defineSounds } = await import("../src/audio");
const { soundCues } = await import("../src/cues");

let nodes = 0;
function param(v = 0) {
  return {
    value: v,
    setValueAtTime(x: number, t: number) { if (!Number.isFinite(x) || !Number.isFinite(t)) throw new Error(`bad setValueAtTime ${x} ${t}`); this.value = x; return this; },
    linearRampToValueAtTime(x: number, t: number) { if (!Number.isFinite(x) || !Number.isFinite(t)) throw new Error(`bad linearRamp ${x} ${t}`); return this; },
    exponentialRampToValueAtTime(x: number, t: number) { if (!(x > 0) || !Number.isFinite(t)) throw new Error(`bad expRamp ${x} ${t}`); return this; },
    setTargetAtTime(x: number, t: number, c: number) { if (!Number.isFinite(x + t + c)) throw new Error("bad setTarget"); return this; },
    cancelScheduledValues() { return this; },
  };
}
function node(extra: Record<string, unknown> = {}) {
  nodes++;
  const n: Record<string, unknown> = {
    connect(target: unknown) { if (!target) throw new Error("connect to nothing"); return target; },
    disconnect() {},
    start(t?: number, off?: number) { if (t !== undefined && !Number.isFinite(t)) throw new Error("bad start"); if (off !== undefined && !(off >= 0)) throw new Error(`bad offset ${off}`); },
    stop() {},
    ...extra,
  };
  return n;
}
class MockAC {
  currentTime = 10;
  sampleRate = 48000;
  destination = node();
  createGain() { return node({ gain: param(1) }); }
  createOscillator() { return node({ frequency: param(440), detune: param(0), type: "sine" }); }
  createBiquadFilter() { return node({ frequency: param(350), Q: param(1), gain: param(0), type: "lowpass" }); }
  createBufferSource() { return node({ buffer: null, loop: false, playbackRate: param(1) }); }
  createConvolver() { return node({ buffer: null }); }
  createWaveShaper() { return node({ curve: null }); }
  createDynamicsCompressor() { return node({ threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() }); }
  createBuffer(ch: number, len: number, sr: number) {
    if (!(len > 0) || !Number.isInteger(len)) throw new Error(`bad buffer length ${len}`);
    const data = Array.from({ length: ch }, () => new Float32Array(len));
    return { numberOfChannels: ch, length: len, sampleRate: sr, duration: len / sr, getChannelData: (i: number) => data[i]! };
  }
}

const factories = new Map<string, (c: unknown) => unknown>();
const fakeBus = { define(name: string, f: (c: unknown) => unknown) { factories.set(name, f); return fakeBus; } };
defineSounds(fakeBus as never);

const ac = new MockAC();
let errors = 0;
const missing = new Set<string>();
for (const cue of soundCues) {
  const f = factories.get(cue.sound);
  if (!f) { missing.add(cue.sound); continue; }
  for (const offset of [0, (cue.end - cue.start) * 0.5]) {
    try {
      const h = f({ audioContext: ac, output: ac.createGain(), cue, offset }) as { stop?: () => void } | undefined;
      h?.stop?.();
    } catch (e) {
      errors++;
      console.log(`sound ${cue.id} @${offset.toFixed(2)}:`, (e as Error).message);
    }
  }
}
console.log(`factories: ${factories.size}, cues: ${soundCues.length}, nodes created: ${nodes}, errors: ${errors}, missing: ${[...missing].join(",") || "none"}`);

/* Real-time playback through the actual player + WebAudioCueBus (mock AudioContext). */
import { installDom } from "./dom-stub";
installDom();

let started = 0, stopped = 0;
function param(v = 0) {
  return { value: v, setValueAtTime() { return this; }, linearRampToValueAtTime() { return this; }, exponentialRampToValueAtTime() { return this; }, setTargetAtTime() { return this; }, cancelScheduledValues() { return this; } };
}
function node(extra: Record<string, unknown> = {}) {
  return { connect: (t: unknown) => t, disconnect() {}, start() { started++; }, stop() { stopped++; }, ...extra };
}
class MockAC {
  state = "running";
  get currentTime() { return performance.now() / 1000; }
  sampleRate = 48000;
  destination = node();
  async resume() {}
  async close() {}
  createGain() { return node({ gain: param(1) }); }
  createOscillator() { return node({ frequency: param(440), detune: param(0) }); }
  createBiquadFilter() { return node({ frequency: param(350), Q: param(1), gain: param(0) }); }
  createBufferSource() { return node({ buffer: null, loop: false, playbackRate: param(1) }); }
  createConvolver() { return node({ buffer: null }); }
  createWaveShaper() { return node({ curve: null }); }
  createDynamicsCompressor() { return node({ threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() }); }
  createBuffer(ch: number, len: number, sr: number) { const d = Array.from({ length: ch }, () => new Float32Array(len)); return { length: len, sampleRate: sr, getChannelData: (i: number) => d[i]! }; }
}
(globalThis as Record<string, unknown>).AudioContext = MockAC;

const THREE = await import("three");
const { CinematicPlayer, WebAudioCueBus, mountCinematicControls } = await import("@agentbench/cinematic-player");
const { buildWorld } = await import("../src/world");
const { buildShots } = await import("../src/shots");
const { voiceCues, soundCues, DURATION } = await import("../src/cues");
const { defineSounds } = await import("../src/audio");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.005, 400000);
const fake = { domElement: { width: 480, height: 270 }, toneMappingExposure: 1 } as unknown as import("three").WebGLRenderer;
const world = buildWorld(scene, camera, fake);
const { shots } = buildShots(world);
const player = new CinematicPlayer({ duration: DURATION, context: world.ctx, shots, cues: [...voiceCues, ...soundCues] });
const audio = new WebAudioCueBus(player);
defineSounds(audio as never);
const controls = mountCinematicControls({ player, audio });
const subs: string[] = [];
player.addTypedEventListener("activecueschange", () => subs.push(controls.subtitle.textContent ?? ""));

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let frames = 0;
player.addTypedEventListener("frame", () => frames++);

await audio.unlock();
player.seek(203.5);
player.play();
const a = player.currentTime;
await sleep(2500);
const b = player.currentTime;
console.log(`played ${a.toFixed(2)} -> ${b.toFixed(2)} (${frames} frames), state=${player.state}, sources started=${started}`);
player.pause();
const c = player.currentTime;
await sleep(400);
console.log(`paused at ${c.toFixed(2)}, still ${player.currentTime.toFixed(2)} after 400ms, state=${player.state}, sources stopped=${stopped}`);
player.seek(325.0);
player.play();
await sleep(1500);
console.log(`after seek+play: ${player.currentTime.toFixed(2)}; subtitle now: ${controls.subtitle.textContent}`);
player.pause();
player.seek(DURATION - 0.5);
player.play();
await sleep(900);
console.log(`end: t=${player.currentTime.toFixed(2)} state=${player.state}`);
console.log(`subtitle samples: ${subs.filter(Boolean).slice(0, 3).join(" | ")}`);
process.exit(0);

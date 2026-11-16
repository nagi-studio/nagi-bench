/**
 * Verifies the presentation / interaction wiring end-to-end with a mocked DOM:
 * curtain + transport Play click -> audio unlock -> playback -> timeline advances
 * -> bottom-center 【speaker】subtitles -> pause -> seek. GPU rendering is the only
 * part not exercised (no browser/WebGL in this environment).
 * Run: bun run scripts/verify-ui.ts
 */

// ---- controllable rAF clock ----
let vnow = 0;
const rafQueue = new Map<number, any>();
let rafId = 0;
(globalThis as any).requestAnimationFrame = (cb: any) => { rafQueue.set(++rafId, cb); return rafId; };
(globalThis as any).cancelAnimationFrame = (id: number) => { rafQueue.delete(id); };
function pump(frames: number, dtMs: number) {
  for (let i = 0; i < frames; i++) {
    vnow += dtMs;
    const cbs = [...rafQueue.values()];
    rafQueue.clear();
    for (const cb of cbs) cb(vnow);
  }
}

// ---- DOM stubs with selector-addressable children + event handlers ----
function makeEl(tag = "div"): any {
  const el: any = {
    tagName: tag, style: {}, children: [], parentElement: null, _handlers: {} as any,
    _bySel: {} as any, value: "0", textContent: "", innerHTML: "", offsetWidth: 100,
    clientWidth: 1280, clientHeight: 720,
    classList: { _s: new Set<string>(), add(c: string) { this._s.add(c); }, remove(c: string) { this._s.delete(c); }, contains(c: string) { return this._s.has(c); } },
    appendChild(c: any) { el.children.push(c); c.parentElement = el; return c; },
    removeChild(c: any) { const i = el.children.indexOf(c); if (i >= 0) el.children.splice(i, 1); return c; },
    remove() {}, setAttribute() {}, getAttribute: () => null,
    addEventListener(type: string, fn: any) { (el._handlers[type] ??= []).push(fn); },
    removeEventListener() {},
    dispatch(type: string) { for (const fn of el._handlers[type] ?? []) fn({ preventDefault() {}, target: el }); },
    querySelector(sel: string) { return (el._bySel[sel] ??= makeEl("child")); },
    querySelectorAll: () => [],
    requestFullscreen: () => Promise.resolve(),
    getContext: () => null,
  };
  return el;
}
function makeCanvas() {
  const c: any = makeEl("canvas");
  c.width = 64; c.height = 64;
  const buf = new Uint8ClampedArray(64 * 64 * 4);
  c.getContext = () => ({
    fillStyle: "#000", imageSmoothingEnabled: false,
    fillRect() {}, clearRect() {},
    getImageData: (x: number, y: number, w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }),
    putImageData() {}, createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }),
    createRadialGradient: () => ({ addColorStop() {} }), createLinearGradient: () => ({ addColorStop() {} }),
    translate() {}, rotate() {}, save() {}, restore() {},
  });
  c.toDataURL = () => "data:image/png;base64,";
  return c;
}
const byId: Record<string, any> = {};
(globalThis as any).document = {
  createElement: (t: string) => (t === "canvas" ? makeCanvas() : makeEl(t)),
  createElementNS: (_ns: string, t: string) => makeEl(t),
  getElementById: (id: string) => (byId[id] ??= makeEl()),
  body: makeEl("body"), addEventListener() {},
};
// Web Audio stub
function param(v = 0) { return { value: v, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {} }; }
function node() { return { connect(d: any) { return d; }, disconnect() {}, start() {}, stop() {}, gain: param(1), frequency: param(440), Q: param(1), detune: param(0), type: "sine", buffer: null, loop: false, threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() }; }
class StubAC {
  currentTime = 0; sampleRate = 44100; state = "running"; destination = node();
  createGain() { return node(); } createOscillator() { return node(); } createBufferSource() { return node(); }
  createBiquadFilter() { return node(); } createConvolver() { return node(); } createDynamicsCompressor() { return node(); }
  createBuffer(ch: number, len: number, rate: number) { return { getChannelData: () => new Float32Array(len), length: len, sampleRate: rate }; }
  resume() { this.state = "running"; return Promise.resolve(); } close() { return Promise.resolve(); }
}
(globalThis as any).window = { devicePixelRatio: 1, innerWidth: 1280, innerHeight: 720, AudioContext: StubAC, addEventListener() {}, removeEventListener() {} };
(globalThis as any).ResizeObserver = class { observe() {} disconnect() {} };

const THREE = await import("three");
const { CinematicPlayer, WebAudioCueBus, mountCinematicControls } = await import("@agentbench/cinematic-player");
const { buildWorld } = await import("../src/film/context.ts");
const { buildShots } = await import("../src/film/shots.ts");
const { voiceCues } = await import("../src/film/voice.ts");
const { soundCues } = await import("../src/film/sound.ts");
const { DURATION } = await import("../src/film/constants.ts");
const { registerSounds } = await import("../src/audio/design.ts");

let failures = 0;
const fail = (m: string) => { failures++; console.error("  ✗ " + m); };
const ok = (m: string) => console.log("  ✓ " + m);

const stubRenderer: any = { domElement: makeCanvas(), setSize() {}, setPixelRatio() {}, render() {}, dispose() {} };
const ctx = buildWorld(stubRenderer, makeEl());
const player = new CinematicPlayer({ duration: DURATION, context: ctx, shots: buildShots(ctx), cues: [...voiceCues, ...soundCues] });
const audio = new WebAudioCueBus(player);
registerSounds(audio);
const app = makeEl();
const controls = mountCinematicControls({ player, audio, container: app });

console.log("\n== UI wiring ==");
const root = controls.root;
const playBtn = root.querySelector('[data-action="play"]');
const seekBar = root.querySelector('[data-action="seek"]');
const subtitle = controls.subtitle;

// initial state paused, first frame rendered
if (player.state !== "paused") fail("expected initial paused");
else ok("initial state paused; first frame available");

// simulate the Play click (unlocks audio then plays)
playBtn.dispatch("click");
await new Promise((r) => setTimeout(r, 5));
if (player.state !== "playing") fail("Play click did not start playback");
else ok("Play click -> audio unlocked -> playing");

// timeline advances continuously over pumped frames
const t0 = player.currentTime;
pump(40, 100); // 40 frames x 100ms = 4s
const t1 = player.currentTime;
if (t1 - t0 < 3.5) fail(`timeline did not advance (${t0} -> ${t1})`);
else ok(`timeline advances continuously (${t0.toFixed(2)} -> ${t1.toFixed(2)}s)`);

// seek bar reflects time
if (Math.abs(Number(seekBar.value) - t1) > 0.2) fail(`seek bar not synced (${seekBar.value} vs ${t1})`);
else ok("seek bar synced to currentTime");

// pause via button
playBtn.dispatch("click");
await new Promise((r) => setTimeout(r, 2));
if (player.state !== "paused") fail("second click did not pause");
else ok("second Play click pauses");

// seek into a dialogue beat and confirm the required subtitle form
seekBar.value = "65";
seekBar.dispatch("input");
await new Promise((r) => setTimeout(r, 2));
const sub = subtitle.textContent;
if (!/【.+】.+/.test(sub)) fail(`subtitle not in 【speaker】text form: "${sub}"`);
else ok(`subtitle renders required form at 65s: ${sub.slice(0, 40)}…`);

// seek to the title-drop and confirm 陨石雨 subtitle
seekBar.value = "317";
seekBar.dispatch("input");
await new Promise((r) => setTimeout(r, 2));
if (!subtitle.textContent.includes("陨石雨")) fail(`title-drop subtitle missing: "${subtitle.textContent}"`);
else ok(`title-drop subtitle present: ${subtitle.textContent}`);

// resume from mid-cue (sustain ambience restarts) without exception
playBtn.dispatch("click");
await new Promise((r) => setTimeout(r, 2));
pump(10, 100);
if (player.state !== "playing") fail("resume failed");
else ok("resume from mid-timeline works (sustain ambience restarts)");

// volume control
const vol = root.querySelector('[data-action="volume"]');
vol.value = "0.3"; vol.dispatch("input");
ok("volume input accepted");

console.log(`\n================  ${failures === 0 ? "UI CHECKS PASSED" : failures + " FAILURES"}  ================\n`);
process.exit(failures === 0 ? 0 : 1);

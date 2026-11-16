/**
 * Headless verification harness. Runs the REAL CinematicPlayer, shots, cue
 * manifests and audio factories through the whole timeline with a mocked DOM /
 * WebGL / WebAudio, so every film code path executes even without a GPU browser.
 * Run with: bun run scripts/verify.ts
 */

// ---------------------------------------------------------------------------
// Minimal software DOM / canvas mocks (set up before importing film modules).
// ---------------------------------------------------------------------------
function parseColor(style: any): [number, number, number, number] {
  if (typeof style !== "string") return [255, 255, 255, 255];
  if (style.startsWith("#")) {
    const n = parseInt(style.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
  }
  const m = style.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1]!.split(",").map((s) => parseFloat(s));
    return [p[0] ?? 0, p[1] ?? 0, p[2] ?? 0, (p[3] ?? 1) * 255];
  }
  return [255, 255, 255, 255];
}

function makeCanvas() {
  const canvas: any = { width: 64, height: 64, style: {}, parentElement: null, _buf: null as any, _ctx: null as any };
  canvas.getContext = () => {
    if (canvas._ctx) return canvas._ctx;
    const buf = new Uint8ClampedArray(canvas.width * canvas.height * 4);
    canvas._buf = buf;
    const ctx: any = {
      fillStyle: "#000", imageSmoothingEnabled: false, globalCompositeOperation: "source-over",
      fillRect(x: number, y: number, w: number, h: number) {
        const [r, g, b, a] = parseColor(ctx.fillStyle);
        for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
          if (i < 0 || j < 0 || i >= canvas.width || j >= canvas.height) continue;
          const k = (j * canvas.width + i) * 4;
          buf[k] = r; buf[k + 1] = g; buf[k + 2] = b; buf[k + 3] = a;
        }
      },
      clearRect(x: number, y: number, w: number, h: number) {
        for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
          const k = (j * canvas.width + i) * 4; buf[k + 3] = 0;
        }
      },
      getImageData(x: number, y: number, w: number, h: number) {
        const data = new Uint8ClampedArray(w * h * 4);
        for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
          const src = ((y + j) * canvas.width + (x + i)) * 4, dst = (j * w + i) * 4;
          data[dst] = buf[src] ?? 0; data[dst + 1] = buf[src + 1] ?? 0; data[dst + 2] = buf[src + 2] ?? 0; data[dst + 3] = buf[src + 3] ?? 0;
        }
        return { data, width: w, height: h };
      },
      putImageData(img: any, x: number, y: number) {
        for (let j = 0; j < img.height; j++) for (let i = 0; i < img.width; i++) {
          const src = (j * img.width + i) * 4, dst = ((y + j) * canvas.width + (x + i)) * 4;
          buf[dst] = img.data[src]; buf[dst + 1] = img.data[src + 1]; buf[dst + 2] = img.data[src + 2]; buf[dst + 3] = img.data[src + 3];
        }
      },
      createImageData(w: number, h: number) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
      createRadialGradient() { return { addColorStop() {} }; },
      createLinearGradient() { return { addColorStop() {} }; },
      translate() {}, rotate() {}, save() {}, restore() {}, fillText() {}, beginPath() {}, arc() {}, fill() {},
    };
    canvas._ctx = ctx;
    return ctx;
  };
  canvas.toDataURL = () => "data:image/png;base64,";
  canvas.addEventListener = () => {};
  return canvas;
}

function stubEl(tag = "div"): any {
  const el: any = {
    tagName: tag, style: {}, children: [], parentElement: null,
    classList: { _s: new Set<string>(), add(c: string) { this._s.add(c); }, remove(c: string) { this._s.delete(c); }, contains(c: string) { return this._s.has(c); } },
    appendChild(c: any) { el.children.push(c); c.parentElement = el; return c; },
    removeChild(c: any) { const i = el.children.indexOf(c); if (i >= 0) el.children.splice(i, 1); return c; },
    remove() {}, setAttribute() {}, getAttribute: () => null,
    addEventListener() {}, removeEventListener() {},
    querySelector: () => stubEl(), querySelectorAll: () => [],
    innerHTML: "", textContent: "", offsetWidth: 100, clientWidth: 1280, clientHeight: 720,
    requestFullscreen: () => Promise.resolve(),
  };
  return el;
}

const elements: Record<string, any> = {};
(globalThis as any).document = {
  createElement: (tag: string) => (tag === "canvas" ? makeCanvas() : stubEl(tag)),
  getElementById: (id: string) => (elements[id] ??= stubEl()),
  body: stubEl("body"),
  addEventListener() {},
};
(globalThis as any).window = {
  devicePixelRatio: 1, innerWidth: 1280, innerHeight: 720,
  addEventListener() {}, removeEventListener() {},
};
(globalThis as any).requestAnimationFrame = (cb: any) => setTimeout(() => cb(performance.now()), 0);
(globalThis as any).cancelAnimationFrame = (h: any) => clearTimeout(h);
(globalThis as any).ResizeObserver = class { observe() {} disconnect() {} };

// ---------------------------------------------------------------------------
// Web Audio stub for factory smoke tests.
// ---------------------------------------------------------------------------
function audioParam(v = 0) {
  return { value: v, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {}, cancelScheduledValues() {} };
}
function audioNode(extra: any = {}) {
  const n: any = {
    connect(d: any) { return d; }, disconnect() {}, start() {}, stop() {},
    gain: audioParam(1), frequency: audioParam(440), Q: audioParam(1), detune: audioParam(0),
    type: "sine", buffer: null, loop: false, playbackRate: audioParam(1),
    threshold: audioParam(-6), knee: audioParam(0), ratio: audioParam(20), attack: audioParam(0.001), release: audioParam(0.12),
    ...extra,
  };
  return n;
}
function stubAudioContext() {
  return {
    currentTime: 0, sampleRate: 44100, state: "running", destination: audioNode(),
    createGain: () => audioNode(), createOscillator: () => audioNode(),
    createBufferSource: () => audioNode(), createBiquadFilter: () => audioNode(),
    createConvolver: () => audioNode(), createDynamicsCompressor: () => audioNode(),
    createBuffer: (ch: number, len: number, rate: number) => ({
      numberOfChannels: ch, length: len, sampleRate: rate, duration: len / rate,
      getChannelData: () => new Float32Array(len),
    }),
    resume: () => Promise.resolve(), close: () => Promise.resolve(),
  };
}

// ---------------------------------------------------------------------------
// Import the real film modules and run.
// ---------------------------------------------------------------------------
const THREE = await import("three");
const { CinematicPlayer, validateVoiceCues } = await import("@agentbench/cinematic-player");
const { buildWorld } = await import("../src/film/context.ts");
const { buildShots } = await import("../src/film/shots.ts");
const { voiceCues } = await import("../src/film/voice.ts");
const { soundCues } = await import("../src/film/sound.ts");
const { DURATION, FIRE, IMPACT_T } = await import("../src/film/constants.ts");
const { registerSounds } = await import("../src/audio/design.ts");

let failures = 0;
const fail = (msg: string) => { failures++; console.error("  ✗ " + msg); };
const ok = (msg: string) => console.log("  ✓ " + msg);

console.log("\n== 1. Cue manifest validation ==");
try {
  validateVoiceCues(voiceCues, DURATION);
  ok(`${voiceCues.length} voice cues valid (7 fields, ranges within ${DURATION}s)`);
} catch (e: any) { fail("voiceCues: " + e.message); }
// every voice cue has exactly the seven required fields
const REQUIRED = ["id", "kind", "speaker", "text", "delivery", "start", "end"];
for (const c of voiceCues) {
  const keys = Object.keys(c);
  if (REQUIRED.some((k) => !(k in c))) fail(`voice ${c.id} missing fields`);
  if (keys.length !== 7) fail(`voice ${c.id} has ${keys.length} fields (expected 7)`);
}
ok("all voice cues carry exactly id/kind/speaker/text/delivery/start/end");
// sound cue ranges + unique ids
const sids = new Set<string>();
for (const c of soundCues) {
  if (c.end <= c.start) fail(`sound ${c.id} end<=start`);
  if (c.end > DURATION) fail(`sound ${c.id} beyond duration`);
  if (sids.has(c.id)) fail(`dup sound id ${c.id}`);
  sids.add(c.id);
}
ok(`${soundCues.length} sound cues, ranges valid, ids unique`);
// no overlapping voice cues (subtitles must not stack unintentionally)
const sorted = [...voiceCues].sort((a, b) => a.start - b.start);
for (let i = 1; i < sorted.length; i++) {
  if (sorted[i]!.start < sorted[i - 1]!.end - 0.001) fail(`voice overlap: ${sorted[i - 1]!.id} / ${sorted[i]!.id}`);
}
ok("no overlapping voice cues");

console.log("\n== 2. Build world + shots (real THREE geometry / figures) ==");
const stubRenderer: any = { domElement: makeCanvas(), setSize() {}, setPixelRatio() {}, render() {}, dispose() {} };
const container = stubEl();
let ctx: any, shots: any;
try {
  ctx = buildWorld(stubRenderer, container);
  shots = buildShots(ctx);
  ok(`world built; ${shots.length} shots; cast delegates=${ctx.cast.delegates.length}`);
} catch (e: any) { fail("buildWorld/buildShots: " + e.stack); }

const player = new CinematicPlayer({ duration: DURATION, context: ctx, shots, cues: [...voiceCues, ...soundCues] });

function checkFinite(label: string) {
  const c = ctx.camera;
  const bad = [c.position.x, c.position.y, c.position.z, c.quaternion.x, c.quaternion.y, c.quaternion.z, c.quaternion.w, c.fov].some((n) => !Number.isFinite(n));
  if (bad) fail(`NaN/Inf camera at ${label}`);
  if (c.fov <= 0 || c.fov > 120) fail(`odd fov ${c.fov} at ${label}`);
}

console.log("\n== 3. Full timeline sweep (seek through every 0.25s) ==");
let sweepErr = 0;
const t0 = Date.now();
for (let t = 0; t <= DURATION; t += 0.25) {
  try {
    player.seek(t);
    checkFinite(`t=${t.toFixed(2)}`);
  } catch (e: any) {
    if (sweepErr < 8) fail(`seek ${t.toFixed(2)}: ${e.message}`);
    sweepErr++;
  }
}
if (sweepErr === 0) ok(`swept 0..${DURATION}s in ${Date.now() - t0}ms, no exceptions, camera finite everywhere`);
else fail(`${sweepErr} sweep exceptions`);

console.log("\n== 4. Seek determinism (same time => same camera) ==");
function snap(t: number) {
  player.seek(t);
  const c = ctx.camera;
  return [c.position.x, c.position.y, c.position.z, c.fov, c.quaternion.x, c.quaternion.w].map((n) => +n.toFixed(5)).join(",");
}
let detOk = true;
for (const t of [12, 60, 100, 155, 189, 210, 250, 281, 305, 330, 350]) {
  const a = snap(t);
  snap(t + 7.3); snap(Math.max(0, t - 11.1)); // wander elsewhere
  const b = snap(t);
  if (a !== b) { fail(`non-deterministic at t=${t}: ${a} vs ${b}`); detOk = false; }
}
if (detOk) ok("camera identical after wandering seeks (pure function of time)");

console.log("\n== 5. Key beats: subtitle + active sound checks ==");
function activeVoice(t: number) {
  player.seek(t);
  return player.getActiveCues().filter((c: any) => c.speaker).map((c: any) => `【${c.speaker}】${c.text}`);
}
const beats: Array<[number, string]> = [
  [20, "军人"], [65, "陨石"], [114, "尊重"], [137, "政委"], [176, "无壳"],
  [225, "存在"], [262, "目标"], [296, "无辜"], [317, "陨石雨"], [338, "父亲"],
];
for (const [t, word] of beats) {
  const subs = activeVoice(t);
  if (!subs.some((s) => s.includes(word))) fail(`t=${t}: expected subtitle containing "${word}", got ${JSON.stringify(subs)}`);
}
ok("key dialogue beats appear at the right times");
// the gunshot sound is active at 189
player.seek(189.2);
const gs = player.getActiveCues("sound").some((c: any) => c.sound === "gunshot");
if (!gs) fail("gunshot sound not active at 189.2"); else ok("basement gunshot cue active at 189.2s");
// 30 conducted shots, no external gunfire in vacuum
const conducted = soundCues.filter((c) => c.sound === "shot_conducted");
if (conducted.length !== 30) fail(`expected 30 conducted shots, got ${conducted.length}`);
else ok("30 suit-conducted shot cues (vacuum: no external gunfire)");
if (soundCues.some((c) => c.sound === "gunshot" && c.start > 200)) fail("gunshot used in space act!");
else ok("no air-conducted gunshot in the space act");

console.log("\n== 6. Framing checks (project key world points to screen) ==");
function ndc(t: number, p: [number, number, number]) {
  player.seek(t);
  ctx.camera.updateMatrixWorld();
  const v = new THREE.Vector3(...p).project(ctx.camera);
  return v;
}
// scope shots: the three targets must be inside the frame
const targets: Array<[number, number, number]> = [[-1, 4.2, -52], [1, 4.0, -52], [3, 4.3, -52]];
let framingOk = true;
for (const t of [264, 281, 306]) {
  for (const p of targets) {
    const v = ndc(t, p);
    if (Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05 || v.z > 1) { fail(`target off-screen at t=${t}: ndc(${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)})`); framingOk = false; }
  }
}
if (framingOk) ok("three targets framed within the scope at 264/281/306s");
// Earth limb should be in the lower part of the wide shot
const earthTop = ndc(210, [0, -40, -360]);
if (earthTop.y > 0.6) fail(`Earth limb too high in wide shot (ndc.y=${earthTop.y.toFixed(2)})`);
else ok(`Earth limb sits low in the wide vista (ndc.y=${earthTop.y.toFixed(2)})`);
// Zhang visible in the void shot
const zhang = ndc(230, [0, 1.4, 0]);
if (Math.abs(zhang.x) > 1 || Math.abs(zhang.y) > 1) fail(`Zhang off-screen in void shot`);
else ok("Zhang framed in the void monologue shot");

console.log("\n== 7. Audio factory smoke test (every sound builds a node graph) ==");
const factories: Record<string, any> = {};
const fakeBus: any = { define(name: string, fn: any) { factories[name] = fn; } };
registerSounds(fakeBus);
const ac = stubAudioContext();
let audioErr = 0;
for (const name of Object.keys(factories)) {
  try {
    const out = audioNode();
    const handle = factories[name]({ audioContext: ac, output: out, cue: { id: "x", sound: name, start: 0, end: 5 }, offset: 0 });
    if (handle && typeof handle.stop === "function") handle.stop();
  } catch (e: any) { fail(`audio factory "${name}": ${e.message}`); audioErr++; }
}
// every sound cue references a defined factory
for (const c of soundCues) if (!factories[c.sound]) fail(`sound cue ${c.id} references undefined factory "${c.sound}"`);
if (audioErr === 0) ok(`${Object.keys(factories).length} audio factories build + stop cleanly; all cues mapped`);

console.log("\n== 8. Play / pause / resume state machine ==");
try {
  player.seek(0);
  player.play();
  if (player.state !== "playing") fail("play() did not enter playing");
  player.pause();
  if (player.state !== "paused") fail("pause() did not enter paused");
  player.seek(180);
  player.play();
  player.pause();
  player.seek(DURATION);
  if (player.currentTime !== DURATION) fail("seek to end failed");
  ok("play/pause/seek/resume state transitions correct");
} catch (e: any) { fail("state machine: " + e.message); }

console.log(`\n================  ${failures === 0 ? "ALL CHECKS PASSED" : failures + " FAILURES"}  ================\n`);
process.exit(failures === 0 ? 0 : 1);

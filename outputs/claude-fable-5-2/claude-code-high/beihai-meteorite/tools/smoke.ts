/**
 * Development-only smoke test of the BUILT bundle (dist/assets/*.js).
 *
 * No browser is available on this machine, so this loads the production bundle
 * under a mocked DOM, a permissive mocked WebGL2 context (every GL call is a
 * no-op that returns something plausible) and a mocked AudioContext, then:
 * clicks the transport's Play button, pumps animation frames, pauses, seeks,
 * and renders the whole timeline through three.js' real JavaScript render path.
 * It catches exceptions in page code and in three's CPU-side pipeline; it does
 * not compile GLSL or produce pixels.
 *
 *   bun run build && bun tools/smoke.ts
 */
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import "./preview.ts"; // 2D canvas shim for the skin painter

const g = globalThis as any;
const errors: string[] = [];

/* ---------- WebGL2 mock ---------- */
function makeGL(canvas: any): any {
  const ids = new Map<string, number>();
  const names = new Map<number, string>();
  let next = 1000;
  const constant = (name: string): number => {
    let id = ids.get(name);
    if (id === undefined) {
      id = name === "NONE" || name === "NO_ERROR" || name === "ZERO" ? 0 : next++;
      ids.set(name, id);
      names.set(id, name);
    }
    return id;
  };
  let calls = 0;
  const fns: Record<string, (...a: any[]) => any> = {
    getParameter: (p: number) => {
      const n = names.get(p) ?? "";
      if (n === "VERSION") return "WebGL 2.0 (mock)";
      if (n === "SHADING_LANGUAGE_VERSION") return "WebGL GLSL ES 3.00 (mock)";
      if (n === "VENDOR" || n === "RENDERER") return "mock";
      if (n === "SCISSOR_BOX" || n === "VIEWPORT") return new Int32Array([0, 0, canvas.width, canvas.height]);
      if (n === "MAX_TEXTURE_SIZE" || n === "MAX_CUBE_MAP_TEXTURE_SIZE" || n === "MAX_RENDERBUFFER_SIZE" || n === "MAX_3D_TEXTURE_SIZE") return 8192;
      if (n === "MAX_VERTEX_UNIFORM_VECTORS" || n === "MAX_FRAGMENT_UNIFORM_VECTORS") return 1024;
      if (n === "MAX_SAMPLES") return 4;
      return 16;
    },
    getExtension: () => null,
    getSupportedExtensions: () => [],
    getContextAttributes: () => ({ alpha: true, antialias: true, depth: true, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: "default" }),
    getShaderPrecisionFormat: () => ({ precision: 23, rangeMin: 127, rangeMax: 127 }),
    getProgramParameter: (_p: unknown, pname: number) => {
      const n = names.get(pname) ?? "";
      return n === "LINK_STATUS" || n === "VALIDATE_STATUS" ? true : 0;
    },
    getShaderParameter: () => true,
    getProgramInfoLog: () => "",
    getShaderInfoLog: () => "",
    getUniformLocation: () => null,
    getAttribLocation: () => -1,
    getActiveUniform: () => null,
    getActiveAttrib: () => null,
    checkFramebufferStatus: () => constant("FRAMEBUFFER_COMPLETE"),
    isContextLost: () => false,
    getError: () => 0,
  };
  return new Proxy({ canvas, drawingBufferWidth: 1280, drawingBufferHeight: 720, drawingBufferColorSpace: "srgb", unpackColorSpace: "srgb" } as any, {
    get(target, prop: string) {
      if (prop in target) return target[prop];
      if (typeof prop !== "string") return undefined;
      if (prop === "__calls") return calls;
      if (/^[A-Z][A-Z0-9_]*$/.test(prop)) return constant(prop);
      if (fns[prop]) return (...a: any[]) => { calls++; return fns[prop]!(...a); };
      if (prop.startsWith("create")) return () => { calls++; return {}; };
      return () => { calls++; return undefined; };
    },
    set(target, prop: string, value) { target[prop] = value; return true; },
  });
}

/* ---------- DOM mock ---------- */
const byId = new Map<string, MockEl>();
class MockEl {
  style: Record<string, string> = {};
  children: MockEl[] = [];
  listeners: Record<string, Array<(e: any) => unknown>> = {};
  attrs: Record<string, string> = {};
  textContent = "";
  relList = { supports: (): boolean => true };
  value = "0";
  width = 300;
  height = 150;
  clientWidth = 1280;
  clientHeight = 720;
  private html = "";
  private found = new Map<string, MockEl>();
  private gl: any;
  private c2d: any;
  classList = { set: new Set<string>(), add: (c: string) => this.classList.set.add(c), remove: (c: string) => this.classList.set.delete(c), contains: (c: string) => this.classList.set.has(c) };
  constructor(readonly tag: string) {}
  set className(v: string) { this.attrs.class = v; }
  get className(): string { return this.attrs.class ?? ""; }
  set innerHTML(v: string) { this.html = v; }
  get innerHTML(): string { return this.html; }
  appendChild(c: MockEl): MockEl { this.children.push(c); return c; }
  remove(): void {}
  contains(c: MockEl): boolean { return this.children.includes(c); }
  setAttribute(k: string, v: string): void { this.attrs[k] = v; }
  getAttribute(k: string): string | null { return this.attrs[k] ?? null; }
  addEventListener(type: string, fn: (e: any) => unknown): void { (this.listeners[type] ??= []).push(fn); }
  removeEventListener(): void {}
  async fire(type: string): Promise<void> { for (const fn of this.listeners[type] ?? []) await fn({ preventDefault() {}, stopPropagation() {}, code: "" }); }
  querySelector(sel: string): MockEl {
    let e = this.found.get(sel);
    if (!e) { e = new MockEl(sel); this.found.set(sel, e); }
    return e;
  }
  getBoundingClientRect() { return { left: 0, top: 0, width: 1280, height: 720 }; }
  requestFullscreen(): void {}
  getContext(kind: string): any {
    if (kind === "2d") return (this.c2d ??= new (g.__MockCanvas2D)(this));
    if (kind === "webgl2") return (this.gl ??= makeGL(this));
    return null;
  }
}

// Reuse the pixel-backed 2D canvas from the preview shim for skins.
const shimCreate = g.document.createElement as (tag: string) => any;
const create = (tag: string): any => {
  if (tag === "canvas") {
    const pixel = shimCreate("canvas");
    const el = new MockEl("canvas") as any;
    // Skin canvases draw in 2D; the renderer's canvas asks for webgl2.
    el.getContext = (kind: string) => (kind === "2d" ? pixel.getContext("2d") : kind === "webgl2" ? (el.__gl ??= makeGL(el)) : null);
    Object.defineProperty(el, "width", { get: () => pixel.width, set: (v: number) => { pixel.width = v; } });
    Object.defineProperty(el, "height", { get: () => pixel.height, set: (v: number) => { pixel.height = v; } });
    Object.defineProperty(el, "data", { get: () => pixel.data });
    return el;
  }
  return new MockEl(tag);
};
const getById = (id: string): MockEl => {
  let e = byId.get(id);
  if (!e) { e = new MockEl(`#${id}`); byId.set(id, e); }
  return e;
};
const winListeners: Record<string, Array<(e: any) => unknown>> = {};
g.document = {
  createElement: create,
  createElementNS: (_ns: string, tag: string) => create(tag),
  querySelector: (sel: string) => getById(sel.replace(/^#/, "")),
  getElementById: getById,
  body: new MockEl("body"),
  addEventListener() {},
};
g.window = g;
g.self = g;
g.innerWidth = 1280;
g.innerHeight = 720;
g.devicePixelRatio = 1;
g.addEventListener = (type: string, fn: (e: any) => unknown) => { (winListeners[type] ??= []).push(fn); };
g.removeEventListener = () => {};
g.ResizeObserver = class { observe(): void {} disconnect(): void {} };
let rafQueue: Array<(t: number) => void> = [];
g.requestAnimationFrame = (cb: (t: number) => void) => { rafQueue.push(cb); return rafQueue.length; };
g.cancelAnimationFrame = () => { rafQueue = []; };

/* ---------- Web Audio mock (permissive; tools/check.ts is the strict one) ---------- */
const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {}, cancelScheduledValues() {} });
const node = (extra: Record<string, unknown> = {}) => ({ connect: (d: unknown) => d, disconnect() {}, start() {}, stop() {}, ...extra });
let audioNodes = 0;
g.AudioParam = class {};
g.AudioContext = class {
  currentTime = 0; sampleRate = 48000; state = "running"; destination = node();
  createGain() { audioNodes++; return node({ gain: param() }); }
  createOscillator() { audioNodes++; return node({ frequency: param(), detune: param(), type: "sine" }); }
  createBufferSource() { audioNodes++; return node({ playbackRate: param(), buffer: null, loop: false }); }
  createBiquadFilter() { audioNodes++; return node({ frequency: param(), Q: param(), gain: param(), type: "lowpass" }); }
  createDelay() { audioNodes++; return node({ delayTime: param() }); }
  createConvolver() { audioNodes++; return node({ buffer: null }); }
  createDynamicsCompressor() { return node({ threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() }); }
  createBuffer(c: number, l: number, r: number) { const d = Array.from({ length: c }, () => new Float32Array(l)); return { duration: l / r, getChannelData: (i: number) => d[i] }; }
  async resume() {}
  async close() {}
};

const origError = console.error;
console.error = (...a: unknown[]) => { errors.push("console.error: " + a.map(String).join(" ").slice(0, 300)); origError(...a); };
const origWarn = console.warn;
const warnings: string[] = [];
console.warn = (...a: unknown[]) => { warnings.push(a.map(String).join(" ").slice(0, 200)); };

/* ---------- run the bundle ---------- */
const dir = resolve(import.meta.dir, "../dist/assets");
const bundle = readdirSync(dir).find((f) => f.endsWith(".js"));
if (!bundle) throw new Error("no bundle in dist/assets; run bun run build first");
await import(resolve(dir, bundle));
console.warn = origWarn;

const film = g.__film;
if (!film) throw new Error("bundle did not expose the film handle");
const { player, controls, audio } = film;
const pump = (frames: number, stepMs: number, start: number): number => {
  let t = start;
  for (let i = 0; i < frames; i++) {
    const q = rafQueue;
    rafQueue = [];
    t += stepMs;
    for (const cb of q) cb(t);
  }
  return t;
};

console.log(`loaded ${bundle}; state=${player.state} t=${player.currentTime}`);
const playBtn = controls.root.querySelector('[data-action="play"]') as MockEl;
await playBtn.fire("click");
let clock = pump(120, 1000 / 60, 1000);
const afterPlay = player.currentTime;
console.log(`after Play click + 120 frames: state=${player.state} t=${afterPlay.toFixed(2)} audioNodes=${audioNodes}`);
if (!(player.state === "playing" && afterPlay > 1.5)) errors.push("timeline did not advance after Play");

await playBtn.fire("click");
const pausedAt = player.currentTime;
clock = pump(30, 1000 / 60, clock);
if (player.state !== "paused" || player.currentTime !== pausedAt) errors.push("pause did not hold the timeline");
console.log(`paused at ${pausedAt.toFixed(2)}`);

const seekBar = controls.root.querySelector('[data-action="seek"]') as MockEl;
seekBar.value = "292";
await seekBar.fire("input");
console.log(`seek via transport: t=${player.currentTime}, subtitle="${controls.subtitle.textContent}"`);
if (Math.abs(player.currentTime - 292) > 1e-6) errors.push("seek did not land");
await playBtn.fire("click");
clock = pump(180, 1000 / 60, clock);
console.log(`resumed: state=${player.state} t=${player.currentTime.toFixed(2)} subtitle="${controls.subtitle.textContent}"`);
if (!(player.currentTime > 294.5)) errors.push("timeline did not advance after seek + play");
player.pause();

// Render the whole film through three's JS pipeline.
let renders = 0;
for (let t = 0; t <= player.duration; t += 0.25) {
  try {
    player.seek(t);
    renders++;
  } catch (e) {
    errors.push(`render exception at t=${t}: ${(e as Error).stack?.split("\n").slice(0, 4).join(" | ")}`);
    break;
  }
}
// Play to the very end.
player.seek(player.duration - 0.5);
player.play();
pump(90, 1000 / 60, clock);
console.log(`rendered ${renders} seeks; end state=${player.state} t=${player.currentTime}`);
if (player.state !== "ended") errors.push("film did not reach the ended state");
void audio;

const uniqueWarnings = [...new Set(warnings)];
if (uniqueWarnings.length) console.log(`warnings (${uniqueWarnings.length}):\n  ` + uniqueWarnings.slice(0, 12).join("\n  "));
if (errors.length) {
  console.log(`\n${errors.length} problem(s):`);
  for (const e of [...new Set(errors)].slice(0, 20)) console.log(" - " + e);
  process.exit(1);
}
console.log("OK");

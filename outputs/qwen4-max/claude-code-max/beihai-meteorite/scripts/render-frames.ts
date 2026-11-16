/**
 * Render key frames of the REAL scene through Three.js SVGRenderer (faithful
 * projection + lighting of the actual scene graph), then write SVG files that
 * rsvg-convert turns into PNGs for visual inspection. No GPU browser required.
 * Run: bun run scripts/render-frames.ts
 */
import fs from "node:fs";

// ---- serializing SVG element mock ----
function svgEl(tag: string): any {
  const el: any = {
    tagName: tag, attrs: {} as any, children: [] as any[], style: {} as any,
    namespaceURI: "http://www.w3.org/2000/svg",
    setAttribute(k: string, v: any) { el.attrs[k] = String(v); },
    getAttribute(k: string) { return el.attrs[k] ?? null; },
    appendChild(c: any) { el.children.push(c); return c; },
    removeChild(c: any) { const i = el.children.indexOf(c); if (i >= 0) el.children.splice(i, 1); return c; },
    get childNodes() { return el.children; },
    get outerHTML() {
      const styleStr = Object.entries(el.style).map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`).join(";");
      const attrs = { ...el.attrs };
      if (styleStr) attrs.style = (attrs.style ? attrs.style + ";" : "") + styleStr;
      const a = Object.entries(attrs).map(([k, v]) => `${k}="${String(v).replace(/"/g, "&quot;")}"`).join(" ");
      const inner = el.children.map((c: any) => c.outerHTML).join("");
      return `<${el.tagName} ${a}>${inner}</${el.tagName}>`;
    },
  };
  return el;
}
function parseColor(style: any): [number, number, number, number] {
  if (typeof style !== "string") return [255, 255, 255, 255];
  if (style.startsWith("#")) { const n = parseInt(style.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255]; }
  const m = style.match(/rgba?\(([^)]+)\)/);
  if (m) { const p = m[1]!.split(",").map((s) => parseFloat(s)); return [p[0] ?? 0, p[1] ?? 0, p[2] ?? 0, (p[3] ?? 1) * 255]; }
  return [255, 255, 255, 255];
}
function makeCanvas() {
  const canvas: any = { width: 64, height: 64, style: {}, parentElement: null, _ctx: null as any };
  canvas.getContext = () => {
    if (canvas._ctx) return canvas._ctx;
    const buf = new Uint8ClampedArray(canvas.width * canvas.height * 4);
    const ctx: any = {
      fillStyle: "#000", imageSmoothingEnabled: false,
      fillRect(x: number, y: number, w: number, h: number) { const [r, g, b, a] = parseColor(ctx.fillStyle); for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) { if (i < 0 || j < 0 || i >= canvas.width || j >= canvas.height) continue; const k = (j * canvas.width + i) * 4; buf[k] = r; buf[k + 1] = g; buf[k + 2] = b; buf[k + 3] = a; } },
      clearRect(x: number, y: number, w: number, h: number) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) { const k = (j * canvas.width + i) * 4; buf[k + 3] = 0; } },
      getImageData(x: number, y: number, w: number, h: number) { const data = new Uint8ClampedArray(w * h * 4); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const s = ((y + j) * canvas.width + (x + i)) * 4, d = (j * w + i) * 4; data[d] = buf[s] ?? 0; data[d + 1] = buf[s + 1] ?? 0; data[d + 2] = buf[s + 2] ?? 0; data[d + 3] = buf[s + 3] ?? 0; } return { data, width: w, height: h }; },
      putImageData(img: any, x: number, y: number) { for (let j = 0; j < img.height; j++) for (let i = 0; i < img.width; i++) { const s = (j * img.width + i) * 4, d = ((y + j) * canvas.width + (x + i)) * 4; buf[d] = img.data[s]; buf[d + 1] = img.data[s + 1]; buf[d + 2] = img.data[s + 2]; buf[d + 3] = img.data[s + 3]; } },
      createImageData(w: number, h: number) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
      createRadialGradient() { return { addColorStop() {} }; }, createLinearGradient() { return { addColorStop() {} }; },
      translate() {}, rotate() {}, save() {}, restore() {},
    };
    canvas._ctx = ctx; return ctx;
  };
  canvas.toDataURL = () => "data:image/png;base64,"; canvas.addEventListener = () => {};
  return canvas;
}
function stubEl(tag = "div"): any {
  const el: any = { tagName: tag, style: {}, children: [], parentElement: null, classList: { add() {}, remove() {}, contains: () => false }, appendChild(c: any) { el.children.push(c); c.parentElement = el; return c; }, removeChild() {}, remove() {}, setAttribute() {}, addEventListener() {}, removeEventListener() {}, querySelector: () => stubEl(), querySelectorAll: () => [], innerHTML: "", textContent: "", offsetWidth: 100, clientWidth: 1280, clientHeight: 720 };
  return el;
}
const elements: Record<string, any> = {};
(globalThis as any).document = {
  createElement: (t: string) => (t === "canvas" ? makeCanvas() : stubEl(t)),
  createElementNS: (_ns: string, t: string) => svgEl(t),
  getElementById: (id: string) => (elements[id] ??= stubEl()),
  body: stubEl(), addEventListener() {},
};
(globalThis as any).window = { devicePixelRatio: 1, innerWidth: 1280, innerHeight: 720, addEventListener() {}, removeEventListener() {} };
(globalThis as any).requestAnimationFrame = (cb: any) => setTimeout(() => cb(performance.now()), 0);
(globalThis as any).cancelAnimationFrame = (h: any) => clearTimeout(h);

const THREE = await import("three");
const { SVGRenderer } = await import("three/addons/renderers/SVGRenderer.js");
const { CinematicPlayer } = await import("@agentbench/cinematic-player");
const { buildWorld } = await import("../src/film/context.ts");
const { buildShots } = await import("../src/film/shots.ts");
const { voiceCues } = await import("../src/film/voice.ts");
const { soundCues } = await import("../src/film/sound.ts");
const { DURATION } = await import("../src/film/constants.ts");

const stubRenderer: any = { domElement: makeCanvas(), setSize() {}, setPixelRatio() {}, render() {}, dispose() {} };
const ctx = buildWorld(stubRenderer, stubEl());
const shots = buildShots(ctx);
const player = new CinematicPlayer({ duration: DURATION, context: ctx, shots, cues: [...voiceCues, ...soundCues] });

// Inspection rig: SVGRenderer's legacy point-light falloff blows out / blacks out
// interiors, and sprites render as opaque rects. Neutralise those and light the
// scene evenly so geometry, blocking and framing can be judged. The film's real
// lights are untouched for WebGL playback.
const KEEP_POINTS = process.env.KEEP_POINTS === "1";
ctx.scene.traverse((o: any) => {
  if (o.isPointLight || o.isSpotLight) { o.intensity = 0; o.visible = false; }
  if (o.isSprite) o.visible = false;
  if (o.isPoints && !KEEP_POINTS) o.visible = false;
});
ctx.scene.add(new THREE.AmbientLight(0xffffff, 0.9));
const key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(3, 6, 5); ctx.scene.add(key);
const fill = new THREE.DirectionalLight(0xbcd0ff, 0.55); fill.position.set(-4, 3, -3); ctx.scene.add(fill);

const svg = new SVGRenderer();
svg.setSize(960, 540);
svg.setQuality("high");
svg.setPrecision(2);

const outDir = "/workspace/frames";
fs.mkdirSync(outDir, { recursive: true });

const frames: Array<[string, number]> = [
  ["01-title", 3], ["02-collector-wide", 12], ["03-tea", 65], ["04-respect", 114],
  ["05-elevator", 128], ["06-office", 139], ["07-workshop", 156], ["08-gunshot", 189.08],
  ["09-gravel", 198], ["10-space-wide", 210], ["11-void", 232], ["12-sunset", 243],
  ["13-scope-targets", 264], ["14-fire", 285], ["15-flight", 300], ["16-impact", 307],
  ["17-coda", 335],
];

const only = process.argv[2];
for (const [name, t] of frames) {
  if (only && !name.includes(only)) continue;
  const start = Date.now();
  player.seek(t);
  if (process.env.DEBUG_T) {
    // wide overview to diagnose layout / blocking
    ctx.camera.position.set(7, 4.5, 7);
    ctx.camera.lookAt(0.5, 1.0, 0);
    ctx.camera.fov = 55;
    ctx.camera.updateProjectionMatrix();
  }
  ctx.scene.updateMatrixWorld(true);
  ctx.camera.updateMatrixWorld(true);
  svg.render(ctx.scene, ctx.camera);
  const text = '<?xml version="1.0" encoding="UTF-8"?>\n' + svg.domElement.outerHTML;
  fs.writeFileSync(`${outDir}/${name}.svg`, text);
  console.log(`${name} t=${t}  ${(Date.now() - start)}ms  ${(text.length / 1024).toFixed(0)}KB svg`);
}
console.log("done");

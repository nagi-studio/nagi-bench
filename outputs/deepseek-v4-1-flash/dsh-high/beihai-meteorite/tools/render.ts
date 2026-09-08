/**
 * Headless CPU preview renderer (Bun).
 *
 * There is no browser in this environment, so this tool walks the *real* Three
 * scene graph, evaluates the *real* director at chosen times, and rasterises
 * the result with a small flat-shaded software renderer (z-buffer, Lambert +
 * point/spot/directional/hemisphere lights, exponential fog, emissive, DataTexture
 * sampling, additive points). It is not the WebGL image — no bloom or shadows —
 * but it is faithful enough to judge framing, blocking, light and colour.
 *
 *   bun run tools/render.ts [--out dir] [--w 640] [--h 360] [--times 0,20,95]
 *   bun run tools/render.ts --sheet        # a built-in contact sheet
 */

import * as THREE from "three";

/* ------------------------------------------------------------- DOM shims */
const g = globalThis as unknown as Record<string, unknown>;
if (!g.window) {
  g.window = {
    setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
    clearTimeout: (h: unknown) => clearTimeout(h as ReturnType<typeof setTimeout>),
    addEventListener: () => void 0,
    innerWidth: 1280,
    innerHeight: 720,
    devicePixelRatio: 1
  };
}
if (!g.document) {
  g.document = {
    getElementById: () => null,
    createElement: () => ({ getContext: () => null, style: {} }),
    createElementNS: () => ({ style: {}, setAttribute: () => void 0 }),
    addEventListener: () => void 0
  };
}
if (!g.requestAnimationFrame) g.requestAnimationFrame = (cb: (t: number) => void) => setTimeout(() => cb(performance.now()), 16);

import { buildWorld } from "../src/film/world";
import { Director } from "../src/film/director";
import { FILM_DURATION, SHOTS } from "../src/film/shots";
import { cueAt, subtitleText } from "../src/film/cues";
import { cardAt } from "../src/film/shots";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

// sharp ships with the platform runtime (not a project dependency); resolve it
// from the launcher so this offline preview tool can encode PNGs.
const nodeRequire = createRequire(import.meta.url);
// @ts-ignore platform-provided encoder
const sharp: (input: Buffer, opts?: Record<string, unknown>) => {
  resize: (w: number, h: number, o?: Record<string, unknown>) => any;
  png: () => any;
  toFile: (f: string) => Promise<unknown>;
} = nodeRequire("/home/DuanZ/.dsh-launcher/node_modules/sharp");

/* ------------------------------------------------------------------ args */
const args = process.argv.slice(2);
function arg(name: string, def: string): string {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
}
const OUT = arg("--out", "preview");
const W = parseInt(arg("--w", "640"), 10);
const H = parseInt(arg("--h", "360"), 10);
const SS = parseInt(arg("--ss", "2"), 10); // supersample
const timesArg = arg("--times", "");
const SHEET = args.includes("--sheet");

const SHEET_TIMES = [
  3, 9, 16, 24, 31, 40, 49, 56, 62, 74, 88, 100, 116, 130, 140, 154, 168, 174, 177.4, 183, 192,
  205, 220, 232, 242, 252, 265, 273.5, 283, 296, 306.5, 312, 318, 333
];

const times = timesArg
  ? timesArg.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n))
  : SHEET
    ? SHEET_TIMES
    : [0, 20, 95, 177.4, 306.5];

/* ------------------------------------------------------------------ world */
function stubEl(): unknown {
  return { textContent: "", style: { opacity: "0", width: "0%" }, classList: { add: () => void 0, remove: () => void 0, toggle: () => void 0 } };
}
const dom = {
  subtitle: stubEl(), subtitleText: stubEl(), card: stubEl(), cardMain: stubEl(), cardSub: stubEl(),
  curtain: stubEl(), hudTime: stubEl(), hudShot: stubEl(), progress: stubEl(), progressFill: stubEl()
};
const world = buildWorld();
const director = new Director(world, null, dom as never);
director.playing = false;

/* ---------------------------------------------------------------- lights */
interface L {
  kind: "amb" | "hemi" | "dir" | "point" | "spot";
  color: THREE.Color;
  intensity: number;
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  sky: THREE.Color;
  ground: THREE.Color;
  distance: number;
  decay: number;
  angle: number;
  penumbra: number;
}

function collectLights(scene: THREE.Scene): L[] {
  const out: L[] = [];
  const wp = new THREE.Vector3();
  const wd = new THREE.Vector3();
  scene.updateMatrixWorld(true);
  scene.traverse((o) => {
    if (!visibleByAncestry(o)) return;
    const any = o as unknown as Record<string, unknown>;
    if (any.isAmbientLight) {
      const l = o as THREE.AmbientLight;
      out.push({ kind: "amb", color: l.color.clone(), intensity: l.intensity, pos: new THREE.Vector3(), dir: new THREE.Vector3(), sky: l.color.clone(), ground: l.color.clone(), distance: 0, decay: 0, angle: 0, penumbra: 0 });
    } else if (any.isHemisphereLight) {
      const l = o as THREE.HemisphereLight;
      out.push({ kind: "hemi", color: l.color.clone(), intensity: l.intensity, pos: new THREE.Vector3(), dir: new THREE.Vector3(0, 1, 0), sky: l.color.clone(), ground: l.groundColor.clone(), distance: 0, decay: 0, angle: 0, penumbra: 0 });
    } else if (any.isDirectionalLight) {
      const l = o as THREE.DirectionalLight;
      l.getWorldPosition(wp);
      l.getWorldDirection(wd);
      out.push({ kind: "dir", color: l.color.clone(), intensity: l.intensity, pos: wp.clone(), dir: wd.clone().negate(), sky: l.color.clone(), ground: l.color.clone(), distance: 0, decay: 0, angle: 0, penumbra: 0 });
    } else if (any.isPointLight) {
      const l = o as THREE.PointLight;
      l.getWorldPosition(wp);
      out.push({ kind: "point", color: l.color.clone(), intensity: l.intensity, pos: wp.clone(), dir: new THREE.Vector3(), sky: l.color.clone(), ground: l.color.clone(), distance: l.distance, decay: l.decay, angle: 0, penumbra: 0 });
    } else if (any.isSpotLight) {
      const l = o as THREE.SpotLight;
      l.getWorldPosition(wp);
      l.getWorldDirection(wd);
      out.push({ kind: "spot", color: l.color.clone(), intensity: l.intensity, pos: wp.clone(), dir: wd.clone().negate(), sky: l.color.clone(), ground: l.color.clone(), distance: l.distance, decay: l.decay, angle: Math.cos(l.angle), penumbra: l.penumbra });
    }
  });
  return out;
}

function visibleByAncestry(o: THREE.Object3D): boolean {
  let p: THREE.Object3D | null = o;
  while (p) {
    if (!p.visible) return false;
    p = p.parent;
  }
  return true;
}

/* ------------------------------------------------------------ rasterizer */
class Raster {
  w: number;
  h: number;
  color: Float32Array;
  depth: Float32Array; // 1/w, larger = closer
  cam: THREE.PerspectiveCamera;
  lights: L[];
  fogColor: THREE.Color;
  fogDensity: number;
  exposure: number;
  bg: THREE.Color;
  triangles = 0;

  constructor(w: number, h: number, cam: THREE.PerspectiveCamera, lights: L[], bg: THREE.Color, fog: THREE.Color, density: number, exposure: number) {
    this.w = w;
    this.h = h;
    this.color = new Float32Array(w * h * 3);
    this.depth = new Float32Array(w * h);
    this.cam = cam;
    this.lights = lights;
    this.bg = bg.clone();
    this.fogColor = fog.clone();
    this.fogDensity = density;
    this.exposure = exposure;
    for (let i = 0; i < w * h; i++) {
      this.color[i * 3] = bg.r;
      this.color[i * 3 + 1] = bg.g;
      this.color[i * 3 + 2] = bg.b;
    }
  }

  private shade(p: THREE.Vector3, n: THREE.Vector3, base: THREE.Color, emissive: THREE.Color, isBasic: boolean): THREE.Color {
    const out = new THREE.Color(0, 0, 0);
    if (isBasic) {
      out.copy(base).add(emissive);
    } else {
      const acc = new THREE.Color(0, 0, 0);
      for (const l of this.lights) {
        let atten = 1;
        const Lv = _v1;
        if (l.kind === "amb") {
          acc.r += l.color.r * l.intensity;
          acc.g += l.color.g * l.intensity;
          acc.b += l.color.b * l.intensity;
          continue;
        } else if (l.kind === "hemi") {
          const t = n.y * 0.5 + 0.5;
          const c = _c1.copy(l.ground).lerp(l.sky, t);
          acc.r += c.r * l.intensity;
          acc.g += c.g * l.intensity;
          acc.b += c.b * l.intensity;
          continue;
        } else if (l.kind === "dir") {
          Lv.copy(l.dir).normalize();
        } else {
          Lv.copy(l.pos).sub(p);
          const d = Lv.length();
          Lv.multiplyScalar(1 / Math.max(1e-4, d));
          // three.js physical falloff (decay=2): 1/d^2 with a smooth distance cut-off
          atten = 1 / Math.max(d * d, 0.0001);
          if (l.kind === "spot") {
            const cd = Lv.dot(_v2.copy(l.dir).normalize());
            if (cd < l.angle) continue;
            const edge = (cd - l.angle) / Math.max(1e-4, 1 - l.angle);
            atten *= Math.pow(Math.min(1, edge / Math.max(1e-4, l.penumbra + 0.001)), 1.2);
          }
          if (l.distance > 0) {
            const f = Math.max(0, 1 - Math.pow(d / l.distance, 4));
            atten *= f * f;
          }
        }
        const ndl = Math.max(0, n.dot(Lv));
        if (ndl <= 0) continue;
        const k = l.intensity * atten * ndl;
        acc.r += l.color.r * k;
        acc.g += l.color.g * k;
        acc.b += l.color.b * k;
      }
      out.copy(base).multiply(acc).add(emissive);
    }
    return out;
  }

  private sample(tex: THREE.Texture, u: number, v: number, out: THREE.Color): boolean {
    const img = (tex as unknown as { image?: { data?: Uint8Array | Uint8ClampedArray; width?: number; height?: number } }).image;
    if (!img || !img.data || !img.width || !img.height) return false;
    let uu = u % 1;
    let vv = v % 1;
    if (uu < 0) uu += 1;
    if (vv < 0) vv += 1;
    const x = Math.min(img.width - 1, Math.floor(uu * img.width));
    const y = Math.min(img.height - 1, Math.floor((1 - vv) * img.height));
    const i = (y * img.width + x) * 4;
    const d = img.data;
    out.setRGB(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255, THREE.SRGBColorSpace);
    return true;
  }

  private project(v: THREE.Vector3, out: THREE.Vector3): boolean {
    out.copy(v).applyMatrix4(this.cam.matrixWorldInverse).applyMatrix4(this.cam.projectionMatrix);
    return true;
  }

  addMesh(mesh: THREE.Mesh, mode: "opaque" | "additive" | "alpha" = "opaque"): void {
    const geo = mesh.geometry;
    const pos = geo.getAttribute("position");
    if (!pos) return;
    const nrm = geo.getAttribute("normal");
    const uvA = geo.getAttribute("uv");
    const colA = geo.getAttribute("color");
    const idx = geo.getIndex();
    const matRaw = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const mat = matRaw as THREE.MeshStandardMaterial & { isMeshBasicMaterial?: boolean; vertexColors?: boolean };
    const isBasic = !!(mat as unknown as { isMeshBasicMaterial?: boolean }).isMeshBasicMaterial;
    const baseCol = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
    const emissive = mat.emissive ? mat.emissive.clone().multiplyScalar(mat.emissiveIntensity ?? 1) : new THREE.Color(0, 0, 0);
    const map = mat.map ?? null;
    const alpha = mat.transparent ? (mat.opacity ?? 1) : 1;
    const emissiveMap = (mat as THREE.MeshStandardMaterial).emissiveMap ?? null;
    const doubleSide = mat.side === THREE.DoubleSide;
    const hasVColor = !!mat.vertexColors && !!colA;

    const mw = mesh.matrixWorld;
    const nm = new THREE.Matrix3().getNormalMatrix(mw);
    const n = idx ? idx.count : pos.count;
    this.triangles += n / 3;
    const v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    const vv = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    const nv = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    const uvv = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];
    const tmpC = new THREE.Color();

    for (let i = 0; i < n; i += 3) {
      let a = 0;
      let b = 0;
      let c = 0;
      if (idx) {
        a = idx.getX(i);
        b = idx.getX(i + 1);
        c = idx.getX(i + 2);
      } else {
        a = i;
        b = i + 1;
        c = i + 2;
      }
      v[0].fromBufferAttribute(pos, a).applyMatrix4(mw);
      v[1].fromBufferAttribute(pos, b).applyMatrix4(mw);
      v[2].fromBufferAttribute(pos, c).applyMatrix4(mw);

      // face normal
      _e1.subVectors(v[1], v[0]);
      _e2.subVectors(v[2], v[0]);
      const fn = _fn.crossVectors(_e1, _e2);
      if (fn.lengthSq() < 1e-12) continue;
      fn.normalize();

      // colour (flat, sampled at face centroid)
      tmpC.copy(baseCol);
      const uu = uvA ? (uvA.getX(a) + uvA.getX(b) + uvA.getX(c)) / 3 : 0;
      const vv2 = uvA ? (uvA.getY(a) + uvA.getY(b) + uvA.getY(c)) / 3 : 0;
      if (map && uvA) {
        const t = new THREE.Color();
        if (this.sample(map, uu, vv2, t)) tmpC.multiply(t);
      }
      let em = emissive;
      if (emissiveMap && uvA) {
        const t = new THREE.Color();
        if (this.sample(emissiveMap, uu, vv2, t)) em = emissive.clone().multiply(t);
        else em = new THREE.Color(0, 0, 0);
      }
      if (hasVColor && colA) {
        const cr = (colA.getX(a) + colA.getX(b) + colA.getX(c)) / 3;
        const cg = (colA.getY(a) + colA.getY(b) + colA.getY(c)) / 3;
        const cb = (colA.getZ(a) + colA.getZ(b) + colA.getZ(c)) / 3;
        tmpC.multiply(new THREE.Color(cr, cg, cb));
      }

      const centroid = _cen.copy(v[0]).add(v[1]).add(v[2]).multiplyScalar(1 / 3);
      const shaded = this.shade(centroid, fn, tmpC, em, isBasic);

      // to view space
      const view = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
      for (let k = 0; k < 3; k++) view[k].copy(v[k]).applyMatrix4(this.cam.matrixWorldInverse);

      // near-plane clip in view space (z <= -near)
      const near = 0.05;
      const clipped: THREE.Vector3[] = [];
      for (let k = 0; k < 3; k++) {
        const p0 = view[k];
        const p1 = view[(k + 1) % 3];
        const in0 = p0.z <= -near;
        const in1 = p1.z <= -near;
        if (in0) clipped.push(p0.clone());
        if (in0 !== in1) {
          const t = (-near - p0.z) / (p1.z - p0.z);
          clipped.push(p0.clone().lerp(p1, t));
        }
      }
      if (clipped.length < 3) continue;

      for (let k = 1; k < clipped.length - 1; k++) {
        this.rasterTri(clipped[0], clipped[k], clipped[k + 1], shaded, mode, alpha);
      }
    }
  }

  private rasterTri(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, col: THREE.Color, mode: "opaque" | "additive" | "alpha" = "opaque", alpha = 1): void {
    const proj = [a, b, c].map((p) => {
      const q = p.clone().applyMatrix4(this.cam.projectionMatrix);
      const iw = 1 / Math.max(1e-6, -p.z);
      return { x: (q.x * 0.5 + 0.5) * this.w, y: (1 - (q.y * 0.5 + 0.5)) * this.h, iw };
    });
    const [A, B, C] = proj;
    const area = (B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y);
    if (Math.abs(area) < 1e-9) return;
    const minX = Math.max(0, Math.floor(Math.min(A.x, B.x, C.x)));
    const maxX = Math.min(this.w - 1, Math.ceil(Math.max(A.x, B.x, C.x)));
    const minY = Math.max(0, Math.floor(Math.min(A.y, B.y, C.y)));
    const maxY = Math.min(this.h - 1, Math.ceil(Math.max(A.y, B.y, C.y)));
    const inv = 1 / area;
    const fog = this.fogDensity;
    const fogC = this.fogColor;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const px = x + 0.5;
        const py = y + 0.5;
        let w0 = ((B.x - A.x) * (py - A.y) - (px - A.x) * (B.y - A.y)) * inv;
        let w1 = ((px - A.x) * (C.y - A.y) - (C.x - A.x) * (py - A.y)) * inv;
        const w2 = 1 - w0 - w1;
        if (w0 < -0.0005 || w1 < -0.0005 || w2 < -0.0005) continue;
        const iw = w0 * A.iw + w1 * B.iw + w2 * C.iw;
        const o = y * this.w + x;
        if (mode !== "additive" && iw <= this.depth[o]) continue;
        // fog by view distance
        const dist = 1 / Math.max(1e-6, iw);
        const f = 1 - Math.exp(-(fog * dist) * (fog * dist));
        const r = col.r + (fogC.r - col.r) * f;
        const gg = col.g + (fogC.g - col.g) * f;
        const bb = col.b + (fogC.b - col.b) * f;
        if (mode === "additive") {
          // glow: add over whatever opaque surface is behind, no depth write
          this.color[o * 3] += r * alpha;
          this.color[o * 3 + 1] += gg * alpha;
          this.color[o * 3 + 2] += bb * alpha;
          continue;
        }
        if (mode === "alpha") {
          this.color[o * 3] = this.color[o * 3] * (1 - alpha) + r * alpha;
          this.color[o * 3 + 1] = this.color[o * 3 + 1] * (1 - alpha) + gg * alpha;
          this.color[o * 3 + 2] = this.color[o * 3 + 2] * (1 - alpha) + bb * alpha;
          continue;
        }
        this.depth[o] = iw;
        this.color[o * 3] = r;
        this.color[o * 3 + 1] = gg;
        this.color[o * 3 + 2] = bb;
      }
    }
  }

  addPoints(pts: THREE.Points): void {
    const geo = pts.geometry;
    const pos = geo.getAttribute("position");
    if (!pos) return;
    const mat = pts.material as THREE.PointsMaterial;
    const additive = mat.blending === THREE.AdditiveBlending;
    const base = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
    const sizeWorld = (mat.size ?? 0.03) * 60;
    const mw = pts.matrixWorld;
    const v = new THREE.Vector3();
    const q = new THREE.Vector3();
    const camPos = this.cam.getWorldPosition(_camPos);
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(mw);
      const dist = v.distanceTo(camPos);
      if (dist < 0.01) continue;
      q.copy(v).applyMatrix4(this.cam.matrixWorldInverse).applyMatrix4(this.cam.projectionMatrix);
      if (q.z < -1 || q.z > 1) continue;
      const sx = (q.x * 0.5 + 0.5) * this.w;
      const sy = (1 - (q.y * 0.5 + 0.5)) * this.h;
      const r = Math.max(0.6, (sizeWorld / dist) * (this.h / 2) * 0.02);
      const iw = 1 / dist;
      const col = base;
      const rr = Math.ceil(r);
      for (let dy = -rr; dy <= rr; dy++) {
        for (let dx = -rr; dx <= rr; dx++) {
          const x = Math.floor(sx + dx);
          const y = Math.floor(sy + dy);
          if (x < 0 || y < 0 || x >= this.w || y >= this.h) continue;
          const d2 = (dx * dx + dy * dy) / (r * r);
          if (d2 > 1) continue;
          const o = y * this.w + x;
          if (iw < this.depth[o]) continue;
          const k = (1 - d2) * (additive ? 0.9 : 0.6);
          if (additive) {
            this.color[o * 3] += col.r * k;
            this.color[o * 3 + 1] += col.g * k;
            this.color[o * 3 + 2] += col.b * k;
          } else {
            this.color[o * 3] = this.color[o * 3] * (1 - k) + col.r * k;
            this.color[o * 3 + 1] = this.color[o * 3 + 1] * (1 - k) + col.g * k;
            this.color[o * 3 + 2] = this.color[o * 3 + 2] * (1 - k) + col.b * k;
          }
        }
      }
    }
  }

  toRGB(): Uint8Array {
    const out = new Uint8Array(this.w * this.h * 3);
    const exp = this.exposure;
    for (let i = 0; i < this.w * this.h; i++) {
      for (let c = 0; c < 3; c++) {
        let x = this.color[i * 3 + c] * exp;
        // ACES approximation
        x = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
        x = Math.pow(Math.max(0, x), 1 / 2.2);
        out[i * 3 + c] = Math.min(255, Math.max(0, Math.round(x * 255)));
      }
    }
    return out;
  }
}

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _e1 = new THREE.Vector3();
const _e2 = new THREE.Vector3();
const _fn = new THREE.Vector3();
const _cen = new THREE.Vector3();
const _vn = new THREE.Vector3();
const _c1 = new THREE.Color();
const _camPos = new THREE.Vector3();

/* --------------------------------------------------------------- render */
function renderAt(t: number): { file: string; text: string; buf: Uint8Array } {
  director.seek(t, true);
  director.update(0);
  const scene = world.scene;
  const cam = world.camera;
  cam.aspect = W / H;
  cam.updateProjectionMatrix();
  scene.updateMatrixWorld(true);
  cam.updateMatrixWorld(true);

  const lights = collectLights(scene);
  const ambDebug = parseFloat(arg("--amb", "0"));
  if (ambDebug > 0) {
    lights.push({ kind: "amb", color: new THREE.Color(1, 1, 1), intensity: ambDebug, pos: new THREE.Vector3(), dir: new THREE.Vector3(), sky: new THREE.Color(1, 1, 1), ground: new THREE.Color(1, 1, 1), distance: 0, decay: 0, angle: 0, penumbra: 0 });
  }
  if (args.includes("--debug")) {
    console.log(`  t=${t} cam=(${cam.position.x.toFixed(1)},${cam.position.y.toFixed(1)},${cam.position.z.toFixed(1)}) lights=${lights.length} ` +
      lights.map((l) => `${l.kind}:${l.intensity.toFixed(1)}`).join(" "));
    let add = 0;
    let addVis = 0;
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      const mat = (m as unknown as { material?: THREE.Material }).material;
      if (mat && (mat as THREE.Material).blending === THREE.AdditiveBlending) {
        add++;
        if (visibleByAncestry(o)) addVis++;
      }
    });
    console.log(`  additive meshes=${add} visible=${addVis}`);
    scene.traverse((o) => {
      const p = o as unknown as { power?: number };
      if (typeof p.power === "number") {
        const wp = new THREE.Vector3();
        o.getWorldPosition(wp);
        console.log(`  plume power=${p.power.toFixed(2)} visible=${o.visible} at (${wp.x.toFixed(1)},${wp.y.toFixed(1)},${wp.z.toFixed(1)}) children=${o.children.length}`);
      }
    });
  }
  const bg = world.env.bg;
  const fog = world.env.fog;
  const R = new Raster(W * SS, H * SS, cam, lights, bg, fog, world.env.fogDensity, world.env.exposure);

  // opaque -> transparent -> additive glows -> points
  scene.traverse((o) => {
    if (!visibleByAncestry(o)) return;
    const any = o as unknown as Record<string, unknown>;
    if (any.isMesh) {
      const mat = (o as THREE.Mesh).material as THREE.Material | THREE.Material[];
      const m = Array.isArray(mat) ? mat[0] : mat;
      if (!m) return;
      if (m.blending === THREE.AdditiveBlending) return;
      if (m.transparent) return;
      R.addMesh(o as THREE.Mesh);
    }
  });
  scene.traverse((o) => {
    if (!visibleByAncestry(o)) return;
    const any = o as unknown as Record<string, unknown>;
    if (any.isMesh) {
      const mat = (o as THREE.Mesh).material as THREE.Material | THREE.Material[];
      const m = Array.isArray(mat) ? mat[0] : mat;
      if (!m) return;
      if (m.blending !== THREE.AdditiveBlending && m.transparent) R.addMesh(o as THREE.Mesh, "alpha");
    }
  });
  scene.traverse((o) => {
    if (!visibleByAncestry(o)) return;
    const any = o as unknown as Record<string, unknown>;
    if (any.isMesh) {
      const mat = (o as THREE.Mesh).material as THREE.Material | THREE.Material[];
      const m = Array.isArray(mat) ? mat[0] : mat;
      if (m && m.blending === THREE.AdditiveBlending) R.addMesh(o as THREE.Mesh, "additive");
    }
  });
  scene.traverse((o) => {
    if (!visibleByAncestry(o)) return;
    if ((o as unknown as { isPoints?: boolean }).isPoints) R.addPoints(o as THREE.Points);
  });
  if (args.includes("--debug")) {
    console.log(`  raster tris=${R.triangles.toFixed(0)}`);
    let mx = 0; let mxi = 0;
    for (let i = 0; i < R.color.length; i++) if (R.color[i] > mx) { mx = R.color[i]; mxi = i; }
    console.log(`  fbuf max=${mx.toFixed(3)} at px=${Math.floor(mxi/3)%R.w},${Math.floor(Math.floor(mxi/3)/R.w)}`);
  }

  const buf = R.toRGB();
  const shot = SHOTS.find((s) => t >= s.start && t < s.end) ?? SHOTS[SHOTS.length - 1];
  const cue = cueAt(t);
  const card = cardAt(t);
  const text = [
    `t=${t.toFixed(1)}s shot=${shot.id} set=${shot.set}`,
    cue ? subtitleText(cue) : "",
    card ? `${card.main} | ${card.sub.replace(/\n/g, " / ")}` : ""
  ]
    .filter(Boolean)
    .join("   ");
  return { file: `${OUT}/t${String(Math.round(t * 10)).padStart(5, "0")}.png`, text, buf };
}

mkdirSync(OUT, { recursive: true });
const rows: string[] = [];
for (const t of times) {
  const r = renderAt(t);
  // downscale supersampled buffer
  await sharp(Buffer.from(r.buf), { raw: { width: W * SS, height: H * SS, channels: 3 } })
    .resize(W, H, { kernel: "lanczos3" })
    .png()
    .toFile(r.file);
  rows.push(r.text);
  console.log(`${r.file}  ${r.text}`);
}

console.log(`\nrendered ${times.length} frame(s) -> ${OUT}/`);

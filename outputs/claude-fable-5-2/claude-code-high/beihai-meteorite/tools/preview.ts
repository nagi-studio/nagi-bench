/**
 * Development-only software renderer.
 *
 * This machine has no browser, so this tool seeks the real CinematicPlayer to a
 * list of times and rasterises the live Three.js scene graph on the CPU (flat
 * Lambert, the same light falloff maths as three, ACES + sRGB) into a PNG
 * contact sheet. It is not part of the shipped film.
 *
 *   bun tools/preview.ts --times 10,20,30 --out sheet.png [--size 480x270] [--cols 4]
 *   bun tools/preview.ts --range 22:45:1.5 --out sheet.png
 */
import * as THREE from "three";
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

/* ---------- DOM shims: a real pixel-backed canvas for the skin painter ---------- */

function parseColour(c: string): [number, number, number, number] {
  if (c.startsWith("#")) {
    let h = c.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    const n = parseInt(h.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
  }
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1]!.split(",").map((x) => parseFloat(x));
    return [p[0]!, p[1]!, p[2]!, Math.round((p[3] ?? 1) * 255)];
  }
  throw new Error(`preview: unsupported colour ${c}`);
}

class MockCtx {
  fillStyle = "#000000";
  imageSmoothingEnabled = false;
  constructor(readonly canvas: MockCanvas) {}
  fillRect(x: number, y: number, w: number, h: number): void {
    const [r, g, b, a] = parseColour(this.fillStyle);
    const d = this.canvas.pixels();
    for (let yy = Math.max(0, y); yy < Math.min(this.canvas.height, y + h); yy++) {
      for (let xx = Math.max(0, x); xx < Math.min(this.canvas.width, x + w); xx++) {
        const i = (yy * this.canvas.width + xx) * 4;
        d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = a;
      }
    }
  }
  clearRect(x: number, y: number, w: number, h: number): void {
    const d = this.canvas.pixels();
    for (let yy = Math.max(0, y); yy < Math.min(this.canvas.height, y + h); yy++) {
      for (let xx = Math.max(0, x); xx < Math.min(this.canvas.width, x + w); xx++) {
        const i = (yy * this.canvas.width + xx) * 4;
        d[i] = 0; d[i + 1] = 0; d[i + 2] = 0; d[i + 3] = 0;
      }
    }
  }
  getImageData(x: number, y: number, w: number, h: number) {
    const d = this.canvas.pixels();
    const out = new Uint8ClampedArray(w * h * 4);
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const s = ((y + yy) * this.canvas.width + (x + xx)) * 4, t = (yy * w + xx) * 4;
        out[t] = d[s]!; out[t + 1] = d[s + 1]!; out[t + 2] = d[s + 2]!; out[t + 3] = d[s + 3]!;
      }
    }
    return { data: out, width: w, height: h };
  }
  putImageData(img: { data: Uint8ClampedArray; width: number; height: number }, x: number, y: number): void {
    const d = this.canvas.pixels();
    for (let yy = 0; yy < img.height; yy++) {
      for (let xx = 0; xx < img.width; xx++) {
        const t = ((y + yy) * this.canvas.width + (x + xx)) * 4, s = (yy * img.width + xx) * 4;
        d[t] = img.data[s]!; d[t + 1] = img.data[s + 1]!; d[t + 2] = img.data[s + 2]!; d[t + 3] = img.data[s + 3]!;
      }
    }
  }
}

class MockCanvas {
  width = 1;
  height = 1;
  private buf?: Uint8ClampedArray;
  private ctx?: MockCtx;
  pixels(): Uint8ClampedArray {
    if (!this.buf || this.buf.length !== this.width * this.height * 4) this.buf = new Uint8ClampedArray(this.width * this.height * 4);
    return this.buf;
  }
  get data(): Uint8ClampedArray {
    return this.pixels();
  }
  getContext(): MockCtx {
    return (this.ctx ??= new MockCtx(this));
  }
}

(globalThis as any).document = {
  createElement: (tag: string) => (tag === "canvas" ? new MockCanvas() : { style: {} }),
};
(globalThis as any).window = globalThis;

/* ---------- PNG ---------- */

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]!) & 255]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}
function encodePNG(rgb: Uint8Array, w: number, h: number): Uint8Array {
  const raw = new Uint8Array((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) raw.set(rgb.subarray(y * w * 3, (y + 1) * w * 3), y * (w * 3 + 1) + 1);
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, w); dv.setUint32(4, h);
  ihdr[8] = 8; ihdr[9] = 2;
  const parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", new Uint8Array(0))];
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

/* ---------- rasteriser ---------- */

interface LightRec {
  kind: "amb" | "hemi" | "dir" | "point" | "spot";
  colour: [number, number, number];
  ground?: [number, number, number];
  pos?: THREE.Vector3;
  dir?: THREE.Vector3;
  distance?: number;
  decay?: number;
  coneCos?: number;
  penumbraCos?: number;
}

function visibleDeep(o: THREE.Object3D): boolean {
  let p: THREE.Object3D | null = o;
  while (p) {
    if (!p.visible) return false;
    p = p.parent;
  }
  return true;
}

const srgb2lin = (c: number): number => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const LUT = new Float32Array(256);
for (let i = 0; i < 256; i++) LUT[i] = srgb2lin(i / 255);

function aces(r: number, g: number, b: number, exposure: number): [number, number, number] {
  const k = exposure / 0.6;
  r *= k; g *= k; b *= k;
  const ir = 0.59719 * r + 0.35458 * g + 0.04823 * b;
  const ig = 0.076 * r + 0.90834 * g + 0.01566 * b;
  const ib = 0.0284 * r + 0.13383 * g + 0.83777 * b;
  const f = (v: number) => (v * (v + 0.0245786) - 0.000090537) / (v * (0.983729 * v + 0.432951) + 0.238081);
  const fr = f(ir), fg = f(ig), fb = f(ib);
  const or = 1.60475 * fr - 0.53108 * fg - 0.07367 * fb;
  const og = -0.10208 * fr + 1.10813 * fg - 0.00605 * fb;
  const ob = -0.00327 * fr - 0.07276 * fg + 1.07602 * fb;
  const enc = (v: number) => {
    v = Math.min(1, Math.max(0, v));
    return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };
  return [enc(or), enc(og), enc(ob)];
}

export function rasterise(scene: THREE.Scene, camera: THREE.PerspectiveCamera, W: number, H: number, exposure: number): Uint8Array {
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  scene.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const view = camera.matrixWorldInverse.clone();
  const vp = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, view);
  const colour = new Float32Array(W * H * 3);
  const depth = new Float32Array(W * H).fill(Infinity);
  const bg = scene.background instanceof THREE.Color ? scene.background : new THREE.Color(0, 0, 0);
  for (let i = 0; i < W * H; i++) {
    colour[i * 3] = bg.r; colour[i * 3 + 1] = bg.g; colour[i * 3 + 2] = bg.b;
  }
  const fog = scene.fog as (THREE.Fog & THREE.FogExp2) | null;

  const lights: LightRec[] = [];
  const meshes: THREE.Mesh[] = [];
  const sprites: THREE.Sprite[] = [];
  const points: THREE.Points[] = [];
  scene.traverse((o) => {
    if (!visibleDeep(o)) return;
    const any = o as any;
    if (any.isLight) {
      const l = any as THREE.Light;
      if (l.intensity <= 0) return;
      const c: [number, number, number] = [l.color.r * l.intensity, l.color.g * l.intensity, l.color.b * l.intensity];
      if (any.isAmbientLight) lights.push({ kind: "amb", colour: c });
      else if (any.isHemisphereLight) {
        const gc = (l as THREE.HemisphereLight).groundColor;
        lights.push({ kind: "hemi", colour: c, ground: [gc.r * l.intensity, gc.g * l.intensity, gc.b * l.intensity] });
      } else if (any.isDirectionalLight) {
        const d = l as THREE.DirectionalLight;
        const p = new THREE.Vector3().setFromMatrixPosition(d.matrixWorld);
        const t = new THREE.Vector3().setFromMatrixPosition(d.target.matrixWorld);
        lights.push({ kind: "dir", colour: c, dir: p.sub(t).normalize() });
      } else if (any.isPointLight) {
        const d = l as THREE.PointLight;
        lights.push({ kind: "point", colour: c, pos: new THREE.Vector3().setFromMatrixPosition(d.matrixWorld), distance: d.distance, decay: d.decay });
      } else if (any.isSpotLight) {
        const d = l as THREE.SpotLight;
        const p = new THREE.Vector3().setFromMatrixPosition(d.matrixWorld);
        const t = new THREE.Vector3().setFromMatrixPosition(d.target.matrixWorld);
        lights.push({
          kind: "spot", colour: c, pos: p.clone(), dir: p.clone().sub(t).normalize(), distance: d.distance, decay: d.decay,
          coneCos: Math.cos(d.angle), penumbraCos: Math.cos(d.angle * (1 - d.penumbra)),
        });
      }
    } else if (any.isMesh) meshes.push(any);
    else if (any.isSprite) sprites.push(any);
    else if (any.isPoints) points.push(any);
  });

  const irradiance = (px: number, py: number, pz: number, nx: number, ny: number, nz: number, out: Float32Array): void => {
    let r = 0, g = 0, b = 0;
    for (const l of lights) {
      if (l.kind === "amb") { r += l.colour[0]; g += l.colour[1]; b += l.colour[2]; continue; }
      if (l.kind === "hemi") {
        const w = 0.5 * ny + 0.5;
        r += l.ground![0] + (l.colour[0] - l.ground![0]) * w;
        g += l.ground![1] + (l.colour[1] - l.ground![1]) * w;
        b += l.ground![2] + (l.colour[2] - l.ground![2]) * w;
        continue;
      }
      if (l.kind === "dir") {
        const d = Math.max(0, nx * l.dir!.x + ny * l.dir!.y + nz * l.dir!.z);
        r += l.colour[0] * d; g += l.colour[1] * d; b += l.colour[2] * d;
        continue;
      }
      let lx = l.pos!.x - px, ly = l.pos!.y - py, lz = l.pos!.z - pz;
      const dist = Math.sqrt(lx * lx + ly * ly + lz * lz) || 1e-6;
      lx /= dist; ly /= dist; lz /= dist;
      const ndl = Math.max(0, nx * lx + ny * ly + nz * lz);
      if (ndl <= 0) continue;
      let att = 1 / Math.max(Math.pow(dist, l.decay ?? 2), 0.01);
      if (l.distance && l.distance > 0) {
        const q = Math.min(1, Math.max(0, 1 - Math.pow(dist / l.distance, 4)));
        att *= q * q;
      }
      if (l.kind === "spot") {
        const ang = lx * l.dir!.x + ly * l.dir!.y + lz * l.dir!.z;
        const s = Math.min(1, Math.max(0, (ang - l.coneCos!) / Math.max(1e-5, l.penumbraCos! - l.coneCos!)));
        att *= s * s * (3 - 2 * s);
      }
      r += l.colour[0] * ndl * att; g += l.colour[1] * ndl * att; b += l.colour[2] * ndl * att;
    }
    out[0] = r; out[1] = g; out[2] = b;
  };

  const irr = new Float32Array(3);
  const m4 = new THREE.Matrix4();
  const mw = new THREE.Matrix4();
  const tmpC = new THREE.Color();

  const drawMesh = (mesh: THREE.Mesh, world: THREE.Matrix4, instColour: THREE.Color | null): void => {
    const geo = mesh.geometry;
    const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as any;
    if (!mat || mat.visible === false) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    if (!pos) return;
    const uv = geo.attributes.uv as THREE.BufferAttribute | undefined;
    const col = mat.vertexColors ? (geo.attributes.color as THREE.BufferAttribute | undefined) : undefined;
    const idx = geo.index;
    const nv = pos.count;
    const e = world.elements;
    const wp = new Float32Array(nv * 3);
    const cp = new Float32Array(nv * 4);
    const ve = vp.elements;
    const pa = pos.array as Float32Array;
    for (let i = 0; i < nv; i++) {
      const x = pa[i * 3]!, y = pa[i * 3 + 1]!, z = pa[i * 3 + 2]!;
      const wx = e[0]! * x + e[4]! * y + e[8]! * z + e[12]!;
      const wy = e[1]! * x + e[5]! * y + e[9]! * z + e[13]!;
      const wz = e[2]! * x + e[6]! * y + e[10]! * z + e[14]!;
      wp[i * 3] = wx; wp[i * 3 + 1] = wy; wp[i * 3 + 2] = wz;
      cp[i * 4] = ve[0]! * wx + ve[4]! * wy + ve[8]! * wz + ve[12]!;
      cp[i * 4 + 1] = ve[1]! * wx + ve[5]! * wy + ve[9]! * wz + ve[13]!;
      cp[i * 4 + 2] = ve[2]! * wx + ve[6]! * wy + ve[10]! * wz + ve[14]!;
      cp[i * 4 + 3] = ve[3]! * wx + ve[7]! * wy + ve[11]! * wz + ve[15]!;
    }
    const lit = !!(mat.isMeshStandardMaterial || mat.isMeshLambertMaterial || mat.isMeshPhongMaterial);
    const base = mat.color ? (mat.color as THREE.Color) : tmpC.set(1, 1, 1);
    const emissive = lit && mat.emissive ? [mat.emissive.r * (mat.emissiveIntensity ?? 1), mat.emissive.g * (mat.emissiveIntensity ?? 1), mat.emissive.b * (mat.emissiveIntensity ?? 1)] : [0, 0, 0];
    const tex = mat.map ? (mat.map.image as { data: Uint8Array | Uint8ClampedArray; width: number; height: number }) : null;
    const texSRGB = mat.map ? mat.map.colorSpace === THREE.SRGBColorSpace : false;
    const alphaTest = mat.alphaTest ?? 0;
    const transparent = !!mat.transparent;
    const opacity = mat.opacity ?? 1;
    const additive = mat.blending === THREE.AdditiveBlending;
    const depthWrite = mat.depthWrite !== false && !(transparent && opacity < 1 && additive);
    const depthTest = mat.depthTest !== false;
    const side = mat.side ?? THREE.FrontSide;
    const useFog = !!fog && mat.fog !== false;
    const flip = world.determinant() < 0;
    const triCount = idx ? idx.count / 3 : nv / 3;
    const ia = idx ? (idx.array as Uint16Array | Uint32Array) : null;
    const ca = col ? (col.array as Float32Array) : null;
    const ua = uv ? (uv.array as Float32Array) : null;
    const diffuseScale = lit ? (1 - (mat.metalness ?? 0) * 0.6) / Math.PI : 1;

    // Clip-space polygon scratch: x, y, z, w, u, v
    const poly = new Float32Array(6 * 6), poly2 = new Float32Array(6 * 6);
    for (let t = 0; t < triCount; t++) {
      const i0 = ia ? ia[t * 3]! : t * 3, i1 = ia ? ia[t * 3 + 1]! : t * 3 + 1, i2 = ia ? ia[t * 3 + 2]! : t * 3 + 2;
      const w0 = cp[i0 * 4 + 3]!, w1 = cp[i1 * 4 + 3]!, w2 = cp[i2 * 4 + 3]!;
      const x0 = cp[i0 * 4]!, x1 = cp[i1 * 4]!, x2 = cp[i2 * 4]!;
      const y0 = cp[i0 * 4 + 1]!, y1 = cp[i1 * 4 + 1]!, y2 = cp[i2 * 4 + 1]!;
      const z0 = cp[i0 * 4 + 2]!, z1 = cp[i1 * 4 + 2]!, z2 = cp[i2 * 4 + 2]!;
      if ((x0 > w0 && x1 > w1 && x2 > w2) || (x0 < -w0 && x1 < -w1 && x2 < -w2)) continue;
      if ((y0 > w0 && y1 > w1 && y2 > w2) || (y0 < -w0 && y1 < -w1 && y2 < -w2)) continue;
      if ((z0 < -w0 && z1 < -w1 && z2 < -w2) || (z0 > w0 && z1 > w1 && z2 > w2)) continue;
      // Shade once per triangle at its centroid.
      const ax = wp[i0 * 3]!, ay = wp[i0 * 3 + 1]!, az = wp[i0 * 3 + 2]!;
      const bx = wp[i1 * 3]!, by = wp[i1 * 3 + 1]!, bz = wp[i1 * 3 + 2]!;
      const cx = wp[i2 * 3]!, cy = wp[i2 * 3 + 1]!, cz = wp[i2 * 3 + 2]!;
      let nx = (by - ay) * (cz - az) - (bz - az) * (cy - ay);
      let ny = (bz - az) * (cx - ax) - (bx - ax) * (cz - az);
      let nz = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
      const nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      nx /= nl; ny /= nl; nz /= nl;
      if (flip) { nx = -nx; ny = -ny; nz = -nz; }
      const mx = (ax + bx + cx) / 3, my = (ay + by + cy) / 3, mz = (az + bz + cz) / 3;
      const facing = nx * (camera.position.x - mx) + ny * (camera.position.y - my) + nz * (camera.position.z - mz);
      if (side === THREE.FrontSide && facing <= 0) continue;
      if (side === THREE.BackSide && facing >= 0) continue;
      if (facing < 0) { nx = -nx; ny = -ny; nz = -nz; }
      let r = base.r, g = base.g, b = base.b;
      if (ca) {
        r *= (ca[i0 * 3]! + ca[i1 * 3]! + ca[i2 * 3]!) / 3;
        g *= (ca[i0 * 3 + 1]! + ca[i1 * 3 + 1]! + ca[i2 * 3 + 1]!) / 3;
        b *= (ca[i0 * 3 + 2]! + ca[i1 * 3 + 2]! + ca[i2 * 3 + 2]!) / 3;
      }
      if (instColour) { r *= instColour.r; g *= instColour.g; b *= instColour.b; }
      let lr = 1, lg = 1, lb = 1;
      if (lit) {
        irradiance(mx, my, mz, nx, ny, nz, irr);
        lr = irr[0]! * diffuseScale; lg = irr[1]! * diffuseScale; lb = irr[2]! * diffuseScale;
      }
      // Near-plane clip.
      let n = 3;
      const src = [i0, i1, i2];
      for (let k = 0; k < 3; k++) {
        const i = src[k]!;
        poly[k * 6] = cp[i * 4]!; poly[k * 6 + 1] = cp[i * 4 + 1]!; poly[k * 6 + 2] = cp[i * 4 + 2]!; poly[k * 6 + 3] = cp[i * 4 + 3]!;
        poly[k * 6 + 4] = ua ? ua[i * 2]! : 0; poly[k * 6 + 5] = ua ? ua[i * 2 + 1]! : 0;
      }
      if (z0 < -w0 || z1 < -w1 || z2 < -w2) {
        let m = 0;
        for (let k = 0; k < n; k++) {
          const a = k * 6, bq = ((k + 1) % n) * 6;
          const da = poly[a + 2]! + poly[a + 3]!, db = poly[bq + 2]! + poly[bq + 3]!;
          if (da >= 0) { for (let q = 0; q < 6; q++) poly2[m * 6 + q] = poly[a + q]!; m++; }
          if ((da >= 0) !== (db >= 0)) {
            const s = da / (da - db);
            for (let q = 0; q < 6; q++) poly2[m * 6 + q] = poly[a + q]! + (poly[bq + q]! - poly[a + q]!) * s;
            m++;
          }
        }
        n = m;
        if (n < 3) continue;
        poly.set(poly2.subarray(0, n * 6));
      }
      // Fan-triangulate and rasterise.
      for (let k = 1; k < n - 1; k++) {
        const A = 0, B = k * 6, C = (k + 1) * 6;
        const wa = poly[A + 3]!, wb = poly[B + 3]!, wc = poly[C + 3]!;
        if (wa <= 1e-6 || wb <= 1e-6 || wc <= 1e-6) continue;
        const sx0 = (poly[A]! / wa * 0.5 + 0.5) * W, sy0 = (1 - (poly[A + 1]! / wa * 0.5 + 0.5)) * H;
        const sx1 = (poly[B]! / wb * 0.5 + 0.5) * W, sy1 = (1 - (poly[B + 1]! / wb * 0.5 + 0.5)) * H;
        const sx2 = (poly[C]! / wc * 0.5 + 0.5) * W, sy2 = (1 - (poly[C + 1]! / wc * 0.5 + 0.5)) * H;
        const area = (sx1 - sx0) * (sy2 - sy0) - (sx2 - sx0) * (sy1 - sy0);
        if (Math.abs(area) < 1e-9) continue;
        const minX = Math.max(0, Math.floor(Math.min(sx0, sx1, sx2))), maxX = Math.min(W - 1, Math.ceil(Math.max(sx0, sx1, sx2)));
        const minY = Math.max(0, Math.floor(Math.min(sy0, sy1, sy2))), maxY = Math.min(H - 1, Math.ceil(Math.max(sy0, sy1, sy2)));
        if (minX > maxX || minY > maxY) continue;
        const ia0 = 1 / wa, ib0 = 1 / wb, ic0 = 1 / wc;
        const ua0 = poly[A + 4]! * ia0, va0 = poly[A + 5]! * ia0;
        const ub0 = poly[B + 4]! * ib0, vb0 = poly[B + 5]! * ib0;
        const uc0 = poly[C + 4]! * ic0, vc0 = poly[C + 5]! * ic0;
        const inv = 1 / area;
        for (let py = minY; py <= maxY; py++) {
          for (let px = minX; px <= maxX; px++) {
            const fx = px + 0.5, fy = py + 0.5;
            const e0 = ((sx1 - fx) * (sy2 - fy) - (sx2 - fx) * (sy1 - fy)) * inv;
            const e1 = ((sx2 - fx) * (sy0 - fy) - (sx0 - fx) * (sy2 - fy)) * inv;
            const e2 = 1 - e0 - e1;
            if (e0 < 0 || e1 < 0 || e2 < 0) continue;
            const iw = e0 * ia0 + e1 * ib0 + e2 * ic0;
            const wdepth = 1 / iw;
            const pi = py * W + px;
            if (depthTest && wdepth >= depth[pi]!) continue;
            let pr = r, pg = g, pb = b, pa2 = opacity;
            if (tex) {
              const tu = (e0 * ua0 + e1 * ub0 + e2 * uc0) * wdepth, tv = (e0 * va0 + e1 * vb0 + e2 * vc0) * wdepth;
              const txi = Math.min(tex.width - 1, Math.max(0, Math.floor(tu * tex.width)));
              const tyi = Math.min(tex.height - 1, Math.max(0, Math.floor(tv * tex.height)));
              const ti = (tyi * tex.width + txi) * 4;
              const ta = tex.data[ti + 3]! / 255;
              if (ta < alphaTest || ta === 0) continue;
              if (texSRGB) { pr *= LUT[tex.data[ti]!]!; pg *= LUT[tex.data[ti + 1]!]!; pb *= LUT[tex.data[ti + 2]!]!; }
              else { pr *= tex.data[ti]! / 255; pg *= tex.data[ti + 1]! / 255; pb *= tex.data[ti + 2]! / 255; }
              if (transparent && alphaTest === 0) pa2 *= ta;
            }
            pr = pr * lr + emissive[0]!; pg = pg * lg + emissive[1]!; pb = pb * lb + emissive[2]!;
            if (useFog) {
              let f = 0;
              if ((fog as any).isFogExp2) f = 1 - Math.exp(-fog.density * fog.density * wdepth * wdepth);
              else f = Math.min(1, Math.max(0, (wdepth - fog.near) / (fog.far - fog.near)));
              pr += (fog.color.r - pr) * f; pg += (fog.color.g - pg) * f; pb += (fog.color.b - pb) * f;
            }
            const o = pi * 3;
            if (additive) {
              colour[o] += pr * pa2; colour[o + 1] += pg * pa2; colour[o + 2] += pb * pa2;
            } else if (transparent && pa2 < 1) {
              colour[o] += (pr - colour[o]!) * pa2; colour[o + 1] += (pg - colour[o + 1]!) * pa2; colour[o + 2] += (pb - colour[o + 2]!) * pa2;
            } else {
              colour[o] = pr; colour[o + 1] = pg; colour[o + 2] = pb;
            }
            if (depthWrite) depth[pi] = wdepth;
          }
        }
      }
    }
  };

  const ordered = [...meshes].sort((a, b) => {
    const ta = ((Array.isArray(a.material) ? a.material[0] : a.material) as any)?.transparent ? 1 : 0;
    const tb = ((Array.isArray(b.material) ? b.material[0] : b.material) as any)?.transparent ? 1 : 0;
    return ta - tb || a.renderOrder - b.renderOrder;
  });
  for (const mesh of ordered) {
    const inst = mesh as unknown as THREE.InstancedMesh;
    if ((inst as any).isInstancedMesh) {
      const c = new THREE.Color();
      for (let i = 0; i < inst.count; i++) {
        inst.getMatrixAt(i, m4);
        mw.multiplyMatrices(inst.matrixWorld, m4);
        let ic: THREE.Color | null = null;
        if (inst.instanceColor) { inst.getColorAt(i, c); ic = c; }
        drawMesh(mesh, mw, ic);
      }
    } else drawMesh(mesh, mesh.matrixWorld, null);
  }

  // Points (stars).
  const v4 = new THREE.Vector4();
  for (const p of points) {
    const mat = p.material as THREE.PointsMaterial;
    const pos = p.geometry.attributes.position as THREE.BufferAttribute;
    const col = mat.vertexColors ? (p.geometry.attributes.color as THREE.BufferAttribute) : null;
    const size = Math.max(1, Math.round((mat.size * H) / 720));
    for (let i = 0; i < pos.count; i++) {
      v4.set(pos.getX(i), pos.getY(i), pos.getZ(i), 1).applyMatrix4(p.matrixWorld).applyMatrix4(vp);
      if (v4.w <= 0) continue;
      const sx = Math.floor((v4.x / v4.w * 0.5 + 0.5) * W), sy = Math.floor((1 - (v4.y / v4.w * 0.5 + 0.5)) * H);
      for (let dy = 0; dy < size; dy++) {
        for (let dx = 0; dx < size; dx++) {
          const x = sx + dx, y = sy + dy;
          if (x < 0 || y < 0 || x >= W || y >= H) continue;
          const pi = y * W + x;
          if (v4.w >= depth[pi]!) continue;
          const o = pi * 3, a = mat.opacity;
          const r = mat.color.r * (col ? col.getX(i) : 1), g = mat.color.g * (col ? col.getY(i) : 1), b = mat.color.b * (col ? col.getZ(i) : 1);
          colour[o] += (r - colour[o]!) * a; colour[o + 1] += (g - colour[o + 1]!) * a; colour[o + 2] += (b - colour[o + 2]!) * a;
        }
      }
    }
  }

  // Sprites (glows).
  const focal = H / (2 * Math.tan((camera.fov * Math.PI) / 360));
  const sp = new THREE.Vector3(), ss = new THREE.Vector3();
  for (const s of sprites) {
    const mat = s.material as THREE.SpriteMaterial;
    if (mat.opacity <= 0) continue;
    sp.setFromMatrixPosition(s.matrixWorld);
    ss.setFromMatrixScale(s.matrixWorld);
    v4.set(sp.x, sp.y, sp.z, 1).applyMatrix4(vp);
    if (v4.w <= 0.01) continue;
    const cx = (v4.x / v4.w * 0.5 + 0.5) * W, cy = (1 - (v4.y / v4.w * 0.5 + 0.5)) * H;
    const rad = (ss.x * 0.5 * focal) / v4.w;
    if (rad < 0.3 || rad > 6000) continue;
    const tex = mat.map ? (mat.map.image as { data: Uint8Array; width: number; height: number }) : null;
    const x0 = Math.max(0, Math.floor(cx - rad)), x1 = Math.min(W - 1, Math.ceil(cx + rad));
    const y0 = Math.max(0, Math.floor(cy - rad)), y1 = Math.min(H - 1, Math.ceil(cy + rad));
    const additive = mat.blending === THREE.AdditiveBlending;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const pi = y * W + x;
        if (mat.depthTest && v4.w >= depth[pi]!) continue;
        const u = (x + 0.5 - cx) / rad * 0.5 + 0.5, vv = (y + 0.5 - cy) / rad * 0.5 + 0.5;
        if (u < 0 || vv < 0 || u >= 1 || vv >= 1) continue;
        let a = 1;
        if (tex) a = tex.data[(Math.floor(vv * tex.height) * tex.width + Math.floor(u * tex.width)) * 4 + 3]! / 255;
        a *= mat.opacity;
        const o = pi * 3;
        if (additive) {
          colour[o] += mat.color.r * a; colour[o + 1] += mat.color.g * a; colour[o + 2] += mat.color.b * a;
        } else {
          colour[o] += (mat.color.r - colour[o]!) * a; colour[o + 1] += (mat.color.g - colour[o + 1]!) * a; colour[o + 2] += (mat.color.b - colour[o + 2]!) * a;
        }
      }
    }
  }

  const out = new Uint8Array(W * H * 3);
  for (let i = 0; i < W * H; i++) {
    const [r, g, b] = aces(colour[i * 3]!, colour[i * 3 + 1]!, colour[i * 3 + 2]!, exposure);
    out[i * 3] = Math.round(r * 255); out[i * 3 + 1] = Math.round(g * 255); out[i * 3 + 2] = Math.round(b * 255);
  }
  return out;
}

/* ---------- contact sheet ---------- */

const DIGITS: Record<string, string[]> = {
  "0": ["111", "101", "101", "101", "111"], "1": ["010", "110", "010", "010", "111"], "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"], "4": ["101", "101", "111", "001", "001"], "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"], "7": ["111", "001", "010", "010", "010"], "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"], ".": ["000", "000", "000", "000", "010"],
};

function stamp(img: Uint8Array, W: number, x0: number, y0: number, text: string, scale = 2): void {
  let x = x0;
  for (const ch of text) {
    const g = DIGITS[ch];
    if (g) {
      for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
        const on = g[r]![c] === "1";
        for (let sy = 0; sy < scale; sy++) for (let sx = 0; sx < scale; sx++) {
          const o = ((y0 + r * scale + sy) * W + x + c * scale + sx) * 3;
          img[o] = on ? 255 : 0; img[o + 1] = on ? 230 : 0; img[o + 2] = on ? 60 : 0;
        }
      }
    }
    x += 4 * scale;
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const opt = (name: string, def?: string) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : def;
  };
  const [W, H] = (opt("size", "480x270") as string).split("x").map(Number) as [number, number];
  let times: number[] = [];
  const range = opt("range");
  if (range) {
    const [a, b, s] = range.split(":").map(Number) as [number, number, number];
    for (let t = a; t <= b + 1e-6; t += s) times.push(+t.toFixed(3));
  } else times = (opt("times", "0") as string).split(",").map(Number);
  const cols = Number(opt("cols", String(Math.min(4, times.length))));
  const out = opt("out", `${process.env.TMPDIR ?? "."}/sheet.png`) as string;

  const t0 = performance.now();
  const { createFilm } = await import("../src/film.ts");
  const film = createFilm({ partial: args.includes("--partial") });
  console.log(`film built in ${(performance.now() - t0).toFixed(0)} ms`);
  const rows = Math.ceil(times.length / cols);
  const sheet = new Uint8Array(W * cols * H * rows * 3);
  times.forEach((time, i) => {
    const t1 = performance.now();
    film.player.seek(time);
    const frame = rasterise(film.ctx.scene, film.ctx.camera, W, H, film.ctx.exposure);
    const fade = film.ctx.overlay.fade;
    if (fade > 0) for (let k = 0; k < frame.length; k++) frame[k] = Math.round(frame[k]! * (1 - fade));
    stamp(frame, W, 4, 4, time.toFixed(1));
    const cx = (i % cols) * W, cy = Math.floor(i / cols) * H;
    for (let y = 0; y < H; y++) sheet.set(frame.subarray(y * W * 3, (y + 1) * W * 3), ((cy + y) * W * cols + cx) * 3);
    let sum = 0;
    for (let k = 0; k < frame.length; k++) sum += frame[k]!;
    console.log(`t=${time.toFixed(2)} mean=${(sum / frame.length).toFixed(1)} ${(performance.now() - t1).toFixed(0)}ms`);
  });
  writeFileSync(out, encodePNG(sheet, W * cols, H * rows));
  console.log(`wrote ${out}`);
}

if (import.meta.main) await main();

/**
 * Software "clay render" of the real scene graph for visual inspection.
 * The offline sandbox has no GPU/browser, so this rasterizes the actual Three.js
 * geometry + camera matrices with a simple Lambert model to a PNG. It is NOT the
 * final look (no textures/shadows/tonemap) but reveals composition, scale, pose
 * and framing errors that numeric checks cannot.
 */
import * as THREE from "three";
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

/* minimal PNG encoder (RGB8) */
const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf: Buffer): number { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type: string, data: Buffer): Buffer { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
function encodePNG(w: number, h: number, rgb: Buffer): Buffer {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; rgb.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3); }
  const idat = deflateSync(raw, { level: 6 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

class Ctx2D {
  fillStyle = "#000"; imageSmoothingEnabled = false;
  constructor(private c: any) {}
  private parse(col: string): [number, number, number] { const k = new THREE.Color(col); return [k.r * 255, k.g * 255, k.b * 255]; }
  fillRect(x: number, y: number, w: number, h: number) { const [r, g, b] = this.parse(this.fillStyle); const px = this.c.pixels; for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) { if (i < 0 || j < 0 || i >= this.c.width || j >= this.c.height) continue; const o = (j * this.c.width + i) * 4; px[o] = r; px[o + 1] = g; px[o + 2] = b; px[o + 3] = 255; } }
  clearRect(x: number, y: number, w: number, h: number) { const px = this.c.pixels; for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) { if (i < 0 || j < 0 || i >= this.c.width || j >= this.c.height) continue; const o = (j * this.c.width + i) * 4; px[o + 3] = 0; } }
  getImageData(x: number, y: number, w: number, h: number) { const data = new Uint8ClampedArray(w * h * 4); const px = this.c.pixels; for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const sx = x + i, sy = y + j, so = (sy * this.c.width + sx) * 4, dO = (j * w + i) * 4; if (sx >= 0 && sy >= 0 && sx < this.c.width && sy < this.c.height) { data[dO] = px[so]; data[dO + 1] = px[so + 1]; data[dO + 2] = px[so + 2]; data[dO + 3] = px[so + 3]; } } return { data, width: w, height: h }; }
  putImageData(img: any, x: number, y: number) { const px = this.c.pixels; for (let j = 0; j < img.height; j++) for (let i = 0; i < img.width; i++) { const dx = x + i, dy = y + j; if (dx < 0 || dy < 0 || dx >= this.c.width || dy >= this.c.height) continue; const so = (j * img.width + i) * 4, dO = (dy * this.c.width + dx) * 4; px[dO] = img.data[so]; px[dO + 1] = img.data[so + 1]; px[dO + 2] = img.data[so + 2]; px[dO + 3] = img.data[so + 3]; } }
}
class FakeCanvas { width = 64; height = 64; pixels = new Uint8ClampedArray(64 * 64 * 4); private ctx = new Ctx2D(this); getContext() { return this.ctx; } }
(globalThis as any).document = { createElement: (t: string) => (t === "canvas" ? new FakeCanvas() : {}) };

const { createFilm } = await import("../src/film/index");
const { CinematicPlayer } = await import("@agentbench/cinematic-player");
const film = createFilm();
const ctx = film.context;
let pending: FrameRequestCallback | null = null;
const player = new CinematicPlayer({ duration: film.duration, context: ctx, shots: film.shots, cues: [...film.voiceCues, ...film.soundCues], requestFrame: (cb) => { pending = cb; return 1; }, cancelFrame: () => { pending = null; } });

const W = 512, H = 288;
const fb = new Float32Array(W * H * 3);
const zb = new Float32Array(W * H);
const lightDir = new THREE.Vector3(0.4, 0.7, 0.55).normalize();

function render(time: number, name: string) {
  player.seek(time);
  ctx.scene.updateMatrixWorld(true);
  ctx.camera.updateMatrixWorld();
  ctx.camera.matrixWorldInverse.copy(ctx.camera.matrixWorld).invert();
  fb.fill(0.02); zb.fill(Infinity);
  const view = ctx.camera.matrixWorldInverse;
  const proj = ctx.camera.projectionMatrix;
  const vp = new THREE.Matrix4().multiplyMatrices(proj, view);
  const v = new THREE.Vector3(); const n = new THREE.Vector3();
  const nm = new THREE.Matrix3();
  let tris = 0; let filled = 0; let dbg = 0;

  ctx.scene.traverse((obj) => {
    let vis = true, p: THREE.Object3D | null = obj;
    while (p) { if (!p.visible) { vis = false; break; } p = p.parent; }
    if (!vis) return;
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const geo = mesh.geometry as THREE.BufferGeometry;
    const pos = geo.attributes.position; if (!pos) return;
    const norm = geo.attributes.normal;
    const colAttr = geo.attributes.color;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const useVCol = !!(mat.vertexColors && colAttr);
    const baseColor = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
    const emissive = mat.emissive ? mat.emissive.clone().multiplyScalar(mat.emissiveIntensity ?? 1) : new THREE.Color(0);
    const unlit = (mat as any).isMeshBasicMaterial;
    nm.getNormalMatrix(mesh.matrixWorld);
    const idx = geo.index;
    const count = idx ? idx.count : pos.count;
    const mw = mesh.matrixWorld;
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    const ca = new THREE.Vector4(), cb = new THREE.Vector4(), cc = new THREE.Vector4();
    for (let t = 0; t < count; t += 3) {
      const i0 = idx ? idx.getX(t) : t, i1 = idx ? idx.getX(t + 1) : t + 1, i2 = idx ? idx.getX(t + 2) : t + 2;
      a.fromBufferAttribute(pos, i0).applyMatrix4(mw);
      b.fromBufferAttribute(pos, i1).applyMatrix4(mw);
      c.fromBufferAttribute(pos, i2).applyMatrix4(mw);
      // face normal in world
      if (norm) { n.fromBufferAttribute(norm, i0).applyMatrix3(nm).normalize(); }
      else { n.subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize(); }
      // lighting
      let shade = 1;
      if (!unlit) { const diff = Math.max(0, n.dot(lightDir)); shade = 0.32 + diff * 0.75; }
      // base color
      let r = baseColor.r, g = baseColor.g, bl = baseColor.b;
      if (useVCol) { r = colAttr.getX(i0); g = colAttr.getY(i0); bl = colAttr.getZ(i0); }
      r = r * shade + emissive.r; g = g * shade + emissive.g; bl = bl * shade + emissive.b;
      // clip
      ca.set(a.x, a.y, a.z, 1).applyMatrix4(vp); cb.set(b.x, b.y, b.z, 1).applyMatrix4(vp); cc.set(c.x, c.y, c.z, 1).applyMatrix4(vp);
      if (ca.w <= 0.01 || cb.w <= 0.01 || cc.w <= 0.01) continue;
      const ax = (ca.x / ca.w * 0.5 + 0.5) * W, ay = (1 - (ca.y / ca.w * 0.5 + 0.5)) * H, az = ca.z / ca.w;
      const bx = (cb.x / cb.w * 0.5 + 0.5) * W, by = (1 - (cb.y / cb.w * 0.5 + 0.5)) * H, bz = cb.z / cb.w;
      const cx = (cc.x / cc.w * 0.5 + 0.5) * W, cy = (1 - (cc.y / cc.w * 0.5 + 0.5)) * H, cz = cc.z / cc.w;
      // bbox
      const minX = Math.max(0, Math.floor(Math.min(ax, bx, cx))), maxX = Math.min(W - 1, Math.ceil(Math.max(ax, bx, cx)));
      const minY = Math.max(0, Math.floor(Math.min(ay, by, cy))), maxY = Math.min(H - 1, Math.ceil(Math.max(ay, by, cy)));
      if (maxX < minX || maxY < minY) continue;
      const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
      if (Math.abs(area) < 1e-6) continue;
      tris++;
      for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
        const px = x + 0.5, py = y + 0.5;
        const w0 = ((bx - ax) * (py - ay) - (by - ay) * (px - ax)) / area;
        const w1 = ((cx - bx) * (py - by) - (cy - by) * (px - bx)) / area;
        const w2 = 1 - w0 - w1;
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;
        // barycentric weights correspond to opposite verts: w0->c, w1->a, w2->b
        const z = w1 * az + w2 * bz + w0 * cz;
        const o = y * W + x;
        if (z < zb[o]) { zb[o] = z; fb[o * 3] = r; fb[o * 3 + 1] = g; fb[o * 3 + 2] = bl; filled++; }
      }
    }
  });

  // tone-ish clamp + gamma
  const ppm = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) {
    for (let k = 0; k < 3; k++) {
      let x = fb[i * 3 + k];
      x = x / (x + 0.6); // simple reinhard
      ppm[i * 3 + k] = Math.max(0, Math.min(255, Math.round(Math.pow(x, 1 / 2.2) * 255)));
    }
  }
  const file = `/workspace/test/frames/${name}.png`;
  writeFileSync(file, encodePNG(W, H, ppm));
  console.log(`rendered ${name} @ ${time}s  (${tris} tris, ${filled} px)`);
}

import { mkdirSync } from "node:fs";
mkdirSync("/workspace/test/frames", { recursive: true });
const frames: Array<[number, string]> = [
  [3, "01_coldopen"], [12, "02_hutong"], [25, "03_room"], [40, "04_tea"],
  [62, "05_mars"], [110, "06_respect"], [130, "07_workshop"], [166, "08_gunshot"],
  [195, "09_reveal"], [235, "10_void"], [266, "11_photo"], [272, "12_scope"],
  [290, "13_fire"], [310, "14_impact"], [328, "15_return"], [340, "16_coda"],
];
for (const [t, n] of frames) render(t, n);
console.log("done");
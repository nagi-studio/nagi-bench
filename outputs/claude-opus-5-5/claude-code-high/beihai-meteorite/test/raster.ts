// Software preview renderer for headless checks: z-buffered triangles, three.js-like
// diffuse lighting (π-normalised), fog, ACES filmic tone mapping and sRGB output.
import * as THREE from "three";
import { deflateSync } from "node:zlib";

type RGB = [number, number, number];

interface Light {
  kind: "amb" | "hemi" | "dir" | "point" | "spot";
  color: RGB;
  sky?: RGB;
  ground?: RGB;
  dir?: THREE.Vector3;
  pos?: THREE.Vector3;
  distance?: number;
  cosOuter?: number;
  cosInner?: number;
}

const srgbToLin = (c: number) => Math.pow(c / 255, 2.2);
const linToSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function aces(c: RGB, exposure: number): RGB {
  const e = exposure / 0.6;
  let r = c[0] * e, g = c[1] * e, b = c[2] * e;
  const ir = 0.59719 * r + 0.35458 * g + 0.04823 * b;
  const ig = 0.076 * r + 0.90834 * g + 0.01566 * b;
  const ib = 0.0284 * r + 0.13383 * g + 0.83777 * b;
  const fit = (v: number) => (v * (v + 0.0245786) - 0.000090537) / (v * (0.983729 * v + 0.432951) + 0.238081);
  r = fit(ir); g = fit(ig); b = fit(ib);
  const or = 1.60475 * r - 0.53108 * g - 0.07367 * b;
  const og = -0.10208 * r + 1.10813 * g - 0.00605 * b;
  const ob = -0.00327 * r - 0.07276 * g + 1.07602 * b;
  return [Math.min(1, Math.max(0, or)), Math.min(1, Math.max(0, og)), Math.min(1, Math.max(0, ob))];
}

function sample(tex: THREE.Texture, u: number, v: number): [number, number, number, number] {
  const img = tex.image as any;
  if (!img?.data) return [1, 1, 1, 1];
  const W = img.width, H = img.height;
  const x = Math.min(W - 1, Math.max(0, Math.floor(u * W)));
  const yy = tex.flipY ? (1 - v) * H : v * H;
  const y = Math.min(H - 1, Math.max(0, Math.floor(yy)));
  const o = (y * W + x) * 4;
  return [srgbToLin(img.data[o]), srgbToLin(img.data[o + 1]), srgbToLin(img.data[o + 2]), img.data[o + 3] / 255];
}

export class Raster {
  readonly col: Float32Array;
  readonly depth: Float32Array;
  private lights: Light[] = [];
  private fog: THREE.Fog | null = null;
  private exposure = 1;
  private camPos = new THREE.Vector3();

  constructor(readonly W: number, readonly H: number) {
    this.col = new Float32Array(W * H * 3);
    this.depth = new Float32Array(W * H);
  }

  render(scene: THREE.Scene, camera: THREE.PerspectiveCamera, exposure: number): void {
    const { W, H } = this;
    this.exposure = exposure;
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    camera.updateProjectionMatrix();
    this.camPos.setFromMatrixPosition(camera.matrixWorld);
    this.depth.fill(Infinity);
    // Background.
    const bg = scene.background as any;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let c: RGB = [0, 0, 0];
        if (bg?.isColor) c = [linToSrgb(bg.r), linToSrgb(bg.g), linToSrgb(bg.b)];
        else if (bg?.isTexture) {
          const s = sample(bg, x / W, 1 - y / H);
          c = [linToSrgb(s[0]), linToSrgb(s[1]), linToSrgb(s[2])];
        }
        const o = (y * W + x) * 3;
        this.col[o] = c[0]; this.col[o + 1] = c[1]; this.col[o + 2] = c[2];
      }
    }
    this.fog = scene.fog as THREE.Fog | null;
    // Lights.
    this.lights = [];
    scene.traverseVisible((o: any) => {
      if (!o.isLight) return;
      const c: RGB = [o.color.r * o.intensity, o.color.g * o.intensity, o.color.b * o.intensity];
      const p = new THREE.Vector3().setFromMatrixPosition(o.matrixWorld);
      if (o.isAmbientLight) this.lights.push({ kind: "amb", color: c });
      else if (o.isHemisphereLight) this.lights.push({ kind: "hemi", color: c, sky: [o.color.r * o.intensity, o.color.g * o.intensity, o.color.b * o.intensity], ground: [o.groundColor.r * o.intensity, o.groundColor.g * o.intensity, o.groundColor.b * o.intensity], dir: p.clone().normalize() });
      else if (o.isDirectionalLight) {
        o.target.updateMatrixWorld();
        const tp = new THREE.Vector3().setFromMatrixPosition(o.target.matrixWorld);
        this.lights.push({ kind: "dir", color: c, dir: p.sub(tp).normalize() });
      } else if (o.isSpotLight) {
        o.target.updateMatrixWorld();
        const tp = new THREE.Vector3().setFromMatrixPosition(o.target.matrixWorld);
        this.lights.push({ kind: "spot", color: c, pos: p, dir: tp.sub(p).normalize(), distance: o.distance, cosOuter: Math.cos(o.angle), cosInner: Math.cos(o.angle * (1 - o.penumbra)) });
      } else if (o.isPointLight) this.lights.push({ kind: "point", color: c, pos: p, distance: o.distance });
    });
    const opaque: THREE.Mesh[] = [];
    const trans: THREE.Object3D[] = [];
    scene.traverseVisible((o: any) => {
      if (o.isMesh) {
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (m.transparent && !(m.alphaTest > 0)) trans.push(o);
        else opaque.push(o);
      } else if (o.isSprite || o.isPoints || o.isLine) trans.push(o);
    });
    for (const m of opaque) this.drawMesh(m, camera);
    trans.sort((a, b) => (a.renderOrder - b.renderOrder) || (this.camDist(b) - this.camDist(a)));
    for (const o of trans as any[]) {
      if (o.isMesh) this.drawMesh(o, camera);
      else if (o.isSprite) this.drawSprite(o, camera);
      else if (o.isPoints) this.drawPoints(o, camera);
      else if (o.isLine) this.drawLine(o, camera);
    }
  }

  private camDist(o: THREE.Object3D): number {
    return new THREE.Vector3().setFromMatrixPosition(o.matrixWorld).distanceTo(this.camPos);
  }

  private shade(mat: any, wp: THREE.Vector3, n: THREE.Vector3, base: RGB, alphaIn: number): [RGB, number] | null {
    let alpha = alphaIn * (mat.opacity ?? 1);
    if (mat.alphaTest > 0 && alphaIn < mat.alphaTest) return null;
    let c: RGB;
    if (mat.isShaderMaterial && mat.uniforms?.uSun) {
      const L = mat.uniforms.uSun.value as THREE.Vector3;
      const N = wp.clone().sub(new THREE.Vector3()).normalize(); // replaced below
      void N;
      const sn = (mat as any).__center ? wp.clone().sub((mat as any).__center).normalize() : n;
      const d = sn.dot(L);
      const day = THREE.MathUtils.smoothstep(d, -0.06, 0.28);
      const lam = Math.min(1, Math.max(0, (sn.clone().multiplyScalar(0.7).add(n.clone().multiplyScalar(0.3)).normalize().dot(L)) * 0.85 + 0.2));
      const ocean = base[2] > base[0] * 1.6 && base[2] > base[1];
      const cloud = base[0] > 0.55 && base[1] > 0.55 && base[2] > 0.55;
      const band = Math.exp(-Math.pow((d + 0.02) / 0.2, 2)) * mat.uniforms.uGlow.value;
      const bc: RGB = cloud ? [1, 0.52, 0.62] : ocean ? [1, 0.36, 0.08] : [0.8, 0.38, 0.16];
      const bk = cloud ? 0.95 : 0.6;
      const tw = Math.exp(-Math.pow((d + 0.2) / 0.22, 2)) * 0.22 * mat.uniforms.uGlow.value;
      const twc = [0.5, 0.18, 0.1];
      c = [0, 1, 2].map((i) => base[i] * (0.012 + lam * day * 1.25) + bc[i] * band * bk + twc[i] * tw) as RGB;
      const V = this.camPos.clone().sub(wp).normalize();
      const fres = Math.pow(1 - Math.max(0, sn.dot(V)), 3);
      c = [c[0] + 0.22 * fres * (0.06 + day * 0.5), c[1] + 0.45 * fres * (0.06 + day * 0.5), c[2] + 1.0 * fres * (0.06 + day * 0.5)];
    } else if (mat.isMeshBasicMaterial || mat.isPointsMaterial || mat.isLineBasicMaterial || mat.isSpriteMaterial) {
      c = base;
    } else {
      const metal = mat.metalness ?? 0;
      const diff: RGB = [base[0] * (1 - metal), base[1] * (1 - metal), base[2] * (1 - metal)];
      let ir = 0, ig = 0, ib = 0;
      let sr = 0, sg = 0, sb = 0;
      const V = this.camPos.clone().sub(wp).normalize();
      const rough = Math.max(0.05, mat.roughness ?? 1);
      const shin = 2 / Math.pow(rough, 4) - 2;
      const f0 = [0.04 + (base[0] - 0.04) * metal, 0.04 + (base[1] - 0.04) * metal, 0.04 + (base[2] - 0.04) * metal];
      for (const l of this.lights) {
        let L: THREE.Vector3 | null = null;
        let k = 1;
        if (l.kind === "amb") { ir += l.color[0]; ig += l.color[1]; ib += l.color[2]; continue; }
        if (l.kind === "hemi") {
          const w = 0.5 * n.dot(l.dir!) + 0.5;
          ir += l.ground![0] + (l.sky![0] - l.ground![0]) * w;
          ig += l.ground![1] + (l.sky![1] - l.ground![1]) * w;
          ib += l.ground![2] + (l.sky![2] - l.ground![2]) * w;
          continue;
        }
        if (l.kind === "dir") L = l.dir!;
        else {
          const dv = l.pos!.clone().sub(wp);
          const dist = dv.length();
          L = dv.divideScalar(dist);
          if (l.distance! > 0) k *= Math.pow(Math.max(0, 1 - Math.pow(dist / l.distance!, 4)), 2);
          if (l.kind === "spot") {
            const cd = -L.dot(l.dir!);
            k *= THREE.MathUtils.smoothstep(cd, l.cosOuter!, l.cosInner!);
          }
        }
        const ndl = Math.max(0, n.dot(L));
        if (ndl <= 0 || k <= 0) continue;
        ir += ndl * l.color[0] * k; ig += ndl * l.color[1] * k; ib += ndl * l.color[2] * k;
        const h = L.clone().add(V).normalize();
        const spec = Math.pow(Math.max(0, n.dot(h)), shin) * (shin + 2) / 8 * ndl * k;
        sr += spec * l.color[0] * f0[0]; sg += spec * l.color[1] * f0[1]; sb += spec * l.color[2] * f0[2];
      }
      c = [diff[0] * ir / Math.PI + sr / Math.PI, diff[1] * ig / Math.PI + sg / Math.PI, diff[2] * ib / Math.PI + sb / Math.PI];
      if (mat.emissive) c = [c[0] + mat.emissive.r, c[1] + mat.emissive.g, c[2] + mat.emissive.b];
    }
    if (this.fog && mat.fog !== false) {
      const d = wp.distanceTo(this.camPos);
      const f = THREE.MathUtils.clamp((d - this.fog.near) / (this.fog.far - this.fog.near), 0, 1);
      const fc = this.fog.color;
      c = [c[0] + (fc.r - c[0]) * f, c[1] + (fc.g - c[1]) * f, c[2] + (fc.b - c[2]) * f];
    }
    const out: RGB = mat.toneMapped === false ? [Math.min(1, c[0]), Math.min(1, c[1]), Math.min(1, c[2])] : aces(c, this.exposure);
    return [[linToSrgb(out[0]), linToSrgb(out[1]), linToSrgb(out[2])], alpha];
  }

  private put(i: number, c: RGB, a: number, mat: any): void {
    const o = i * 3;
    if (mat.blending === THREE.AdditiveBlending) {
      this.col[o] = Math.min(1, this.col[o] + c[0] * a);
      this.col[o + 1] = Math.min(1, this.col[o + 1] + c[1] * a);
      this.col[o + 2] = Math.min(1, this.col[o + 2] + c[2] * a);
    } else if (mat.transparent && a < 1) {
      this.col[o] = c[0] * a + this.col[o] * (1 - a);
      this.col[o + 1] = c[1] * a + this.col[o + 1] * (1 - a);
      this.col[o + 2] = c[2] * a + this.col[o + 2] * (1 - a);
    } else {
      this.col[o] = c[0]; this.col[o + 1] = c[1]; this.col[o + 2] = c[2];
    }
  }

  private drawMesh(mesh: any, camera: THREE.PerspectiveCamera): void {
    const geo = mesh.geometry as THREE.BufferGeometry;
    const pos = geo.attributes.position;
    if (!pos) return;
    const nor = geo.attributes.normal;
    const colA = geo.attributes.color;
    const uvA = geo.attributes.uv;
    const idx = geo.index;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (mats[0].isShaderMaterial) (mats[0] as any).__center = new THREE.Vector3().setFromMatrixPosition(mesh.matrixWorld);
    const vp = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    const count = mesh.isInstancedMesh ? mesh.count : 1;
    const inst = new THREE.Matrix4();
    const world = new THREE.Matrix4();
    const nmat = new THREE.Matrix3();
    const ic = new THREE.Color();
    for (let k = 0; k < count; k++) {
      world.copy(mesh.matrixWorld);
      let tint: RGB = [1, 1, 1];
      if (mesh.isInstancedMesh) {
        mesh.getMatrixAt(k, inst);
        world.multiply(inst);
        if (mesh.instanceColor) { mesh.getColorAt(k, ic); tint = [ic.r, ic.g, ic.b]; }
      }
      nmat.getNormalMatrix(world);
      const mvp = new THREE.Matrix4().multiplyMatrices(vp, world);
      const nv = pos.count;
      const clip = new Float32Array(nv * 4);
      const wpos = new Float32Array(nv * 3);
      const e = mvp.elements, w = world.elements;
      for (let i = 0; i < nv; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        clip[i * 4] = e[0] * x + e[4] * y + e[8] * z + e[12];
        clip[i * 4 + 1] = e[1] * x + e[5] * y + e[9] * z + e[13];
        clip[i * 4 + 2] = e[2] * x + e[6] * y + e[10] * z + e[14];
        clip[i * 4 + 3] = e[3] * x + e[7] * y + e[11] * z + e[15];
        wpos[i * 3] = w[0] * x + w[4] * y + w[8] * z + w[12];
        wpos[i * 3 + 1] = w[1] * x + w[5] * y + w[9] * z + w[13];
        wpos[i * 3 + 2] = w[2] * x + w[6] * y + w[10] * z + w[14];
      }
      const groups = geo.groups.length ? geo.groups : [{ start: 0, count: idx ? idx.count : nv, materialIndex: 0 }];
      for (const g of groups) {
        const mat = mats[g.materialIndex ?? 0] ?? mats[0];
        if (!mat.visible) continue;
        const colorM: RGB = mat.color ? [mat.color.r, mat.color.g, mat.color.b] : [1, 1, 1];
        for (let t = g.start; t < g.start + g.count; t += 3) {
          const a = idx ? idx.getX(t) : t, b = idx ? idx.getX(t + 1) : t + 1, c = idx ? idx.getX(t + 2) : t + 2;
          this.tri(mat, [a, b, c], clip, wpos, nor, nmat, colA, uvA, colorM, tint, mesh);
        }
      }
    }
  }

  private tri(mat: any, ids: number[], clip: Float32Array, wpos: Float32Array, nor: any, nmat: THREE.Matrix3, colA: any, uvA: any, colorM: RGB, tint: RGB, mesh: any): void {
    // Build vertices: [cx,cy,cz,cw, wx,wy,wz, nx,ny,nz, r,g,b, u,v]
    type Vx = number[];
    let poly: Vx[] = ids.map((i) => {
      const n = nor ? new THREE.Vector3(nor.getX(i), nor.getY(i), nor.getZ(i)).applyMatrix3(nmat).normalize() : new THREE.Vector3(0, 1, 0);
      const vc = colA && mat.vertexColors ? [colA.getX(i), colA.getY(i), colA.getZ(i)] : [1, 1, 1];
      return [clip[i * 4], clip[i * 4 + 1], clip[i * 4 + 2], clip[i * 4 + 3], wpos[i * 3], wpos[i * 3 + 1], wpos[i * 3 + 2], n.x, n.y, n.z, vc[0], vc[1], vc[2], uvA ? uvA.getX(i) : 0, uvA ? uvA.getY(i) : 0];
    });
    // Near-plane clip (z + w >= 0).
    const inside = (v: Vx) => v[2] + v[3] >= 0;
    if (!poly.every(inside)) {
      if (!poly.some(inside)) return;
      const out: Vx[] = [];
      for (let i = 0; i < poly.length; i++) {
        const A = poly[i], B = poly[(i + 1) % poly.length];
        const da = A[2] + A[3], db = B[2] + B[3];
        if (da >= 0) out.push(A);
        if ((da >= 0) !== (db >= 0)) {
          const k = da / (da - db);
          out.push(A.map((v, j) => v + (B[j] - v) * k));
        }
      }
      poly = out;
    }
    const { W, H } = this;
    const sv = poly.map((v) => [((v[0] / v[3]) * 0.5 + 0.5) * W, (1 - ((v[1] / v[3]) * 0.5 + 0.5)) * H, 1 / v[3]]);
    for (let i = 1; i + 1 < poly.length; i++) {
      const i0 = 0, i1 = i, i2 = i + 1;
      const [x0, y0] = sv[i0], [x1, y1] = sv[i1], [x2, y2] = sv[i2];
      const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
      if (Math.abs(area) < 1e-9) continue;
      // Screen y is flipped, so front faces (CCW in NDC) have negative area here.
      if (mat.side === THREE.FrontSide && area > 0) continue;
      if (mat.side === THREE.BackSide && area < 0) continue;
      const minX = Math.max(0, Math.floor(Math.min(x0, x1, x2))), maxX = Math.min(W - 1, Math.ceil(Math.max(x0, x1, x2)));
      const minY = Math.max(0, Math.floor(Math.min(y0, y1, y2))), maxY = Math.min(H - 1, Math.ceil(Math.max(y0, y1, y2)));
      if (minX > maxX || minY > maxY) continue;
      const A = poly[i0], B = poly[i1], C = poly[i2];
      const wA = sv[i0][2], wB = sv[i1][2], wC = sv[i2][2];
      const wp = new THREE.Vector3();
      const n = new THREE.Vector3();
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const px = x + 0.5, py = y + 0.5;
          let l0 = ((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py)) / area;
          let l1 = ((x2 - px) * (y0 - py) - (x0 - px) * (y2 - py)) / area;
          let l2 = 1 - l0 - l1;
          if (l0 < -1e-6 || l1 < -1e-6 || l2 < -1e-6) continue;
          const iw = l0 * wA + l1 * wB + l2 * wC;
          const depth = 1 / iw;
          const di = y * W + x;
          if (mat.depthTest !== false && depth >= this.depth[di]) continue;
          l0 = (l0 * wA) / iw; l1 = (l1 * wB) / iw; l2 = (l2 * wC) / iw;
          const at = (j: number) => A[j] * l0 + B[j] * l1 + C[j] * l2;
          wp.set(at(4), at(5), at(6));
          n.set(at(7), at(8), at(9)).normalize();
          let base: RGB = [at(10) * colorM[0] * tint[0], at(11) * colorM[1] * tint[1], at(12) * colorM[2] * tint[2]];
          let alpha = 1;
          if (mat.map) {
            const s = sample(mat.map, at(13), at(14));
            base = [base[0] * s[0], base[1] * s[1], base[2] * s[2]];
            alpha = s[3];
          }
          const r = this.shade(mat, wp, n, base, alpha);
          if (!r) continue;
          this.put(di, r[0], r[1], mat);
          if (mat.depthWrite !== false && !(mat.transparent && !(mat.alphaTest > 0))) this.depth[di] = depth;
          else if (mat.depthWrite !== false && mat.transparent && r[1] > 0.9) this.depth[di] = depth;
        }
      }
    }
    void mesh;
  }

  private drawSprite(sp: any, camera: THREE.PerspectiveCamera): void {
    const mat = sp.material;
    if (!mat.visible || (mat.opacity ?? 1) <= 0) return;
    const mv = new THREE.Vector3().setFromMatrixPosition(sp.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
    if (mv.z >= -camera.near) return;
    const P = camera.projectionMatrix.elements;
    const scl = new THREE.Vector3().setFromMatrixScale(sp.matrixWorld);
    const clipC = new THREE.Vector4(mv.x, mv.y, mv.z, 1).applyMatrix4(camera.projectionMatrix);
    const cx = ((clipC.x / clipC.w) * 0.5 + 0.5) * this.W, cy = (1 - ((clipC.y / clipC.w) * 0.5 + 0.5)) * this.H;
    const att = mat.sizeAttenuation === false ? 1 : 1 / -mv.z;
    const hw = 0.5 * scl.x * P[0] * att * 0.5 * this.W;
    const hh = 0.5 * scl.y * P[5] * att * 0.5 * this.H;
    const depth = -mv.z;
    for (let y = Math.max(0, Math.floor(cy - hh)); y <= Math.min(this.H - 1, Math.ceil(cy + hh)); y++) {
      for (let x = Math.max(0, Math.floor(cx - hw)); x <= Math.min(this.W - 1, Math.ceil(cx + hw)); x++) {
        const di = y * this.W + x;
        if (mat.depthTest !== false && depth >= this.depth[di]) continue;
        const u = (x + 0.5 - (cx - hw)) / (2 * hw), v = 1 - (y + 0.5 - (cy - hh)) / (2 * hh);
        if (u < 0 || u > 1 || v < 0 || v > 1) continue;
        const s = mat.map ? sample(mat.map, u, v) : [1, 1, 1, 1];
        const base: RGB = [s[0] * mat.color.r, s[1] * mat.color.g, s[2] * mat.color.b];
        const r = this.shade(mat, new THREE.Vector3(), new THREE.Vector3(0, 0, 1), base, s[3]);
        if (r) this.put(di, r[0], r[1], mat);
      }
    }
  }

  private drawPoints(pts: any, camera: THREE.PerspectiveCamera): void {
    const mat = pts.material;
    const pos = pts.geometry.attributes.position, col = pts.geometry.attributes.color;
    const mvp = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).multiply(pts.matrixWorld);
    const v = new THREE.Vector4();
    const size = Math.max(1, Math.round(mat.size * (this.W / 1200)));
    for (let i = 0; i < pos.count; i++) {
      v.set(pos.getX(i), pos.getY(i), pos.getZ(i), 1).applyMatrix4(mvp);
      if (v.w <= 0) continue;
      const x = Math.floor(((v.x / v.w) * 0.5 + 0.5) * this.W), y = Math.floor((1 - ((v.y / v.w) * 0.5 + 0.5)) * this.H);
      if (x < 0 || y < 0 || x >= this.W || y >= this.H) continue;
      const di = y * this.W + x;
      if (v.w >= this.depth[di]) continue;
      const c: RGB = col ? [linToSrgb(col.getX(i)), linToSrgb(col.getY(i)), linToSrgb(col.getZ(i))] : [1, 1, 1];
      for (let yy = 0; yy < size; yy++) for (let xx = 0; xx < size; xx++) {
        const j = (y + yy) * this.W + x + xx;
        if (y + yy < this.H && x + xx < this.W) { this.col[j * 3] = Math.max(this.col[j * 3], c[0]); this.col[j * 3 + 1] = Math.max(this.col[j * 3 + 1], c[1]); this.col[j * 3 + 2] = Math.max(this.col[j * 3 + 2], c[2]); }
      }
    }
  }

  private drawLine(line: any, camera: THREE.PerspectiveCamera): void {
    const pos = line.geometry.attributes.position;
    const mvp = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).multiply(line.matrixWorld);
    const c = line.material.color;
    const op = line.material.opacity ?? 1;
    for (let i = 0; i + 1 < pos.count; i++) {
      const a = new THREE.Vector4(pos.getX(i), pos.getY(i), pos.getZ(i), 1).applyMatrix4(mvp);
      const b = new THREE.Vector4(pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1), 1).applyMatrix4(mvp);
      if (a.w <= 0 || b.w <= 0) continue;
      const ax = ((a.x / a.w) * 0.5 + 0.5) * this.W, ay = (1 - ((a.y / a.w) * 0.5 + 0.5)) * this.H;
      const bx = ((b.x / b.w) * 0.5 + 0.5) * this.W, by = (1 - ((b.y / b.w) * 0.5 + 0.5)) * this.H;
      const steps = Math.min(4000, Math.ceil(Math.max(Math.abs(bx - ax), Math.abs(by - ay))));
      for (let s = 0; s <= steps; s++) {
        const k = s / Math.max(1, steps);
        const x = Math.floor(ax + (bx - ax) * k), y = Math.floor(ay + (by - ay) * k);
        if (x < 0 || y < 0 || x >= this.W || y >= this.H) continue;
        const w = 1 / (1 / a.w + (1 / b.w - 1 / a.w) * k);
        const di = y * this.W + x;
        if (w >= this.depth[di]) continue;
        this.col[di * 3] = this.col[di * 3] * (1 - op) + linToSrgb(c.r) * op;
        this.col[di * 3 + 1] = this.col[di * 3 + 1] * (1 - op) + linToSrgb(c.g) * op;
        this.col[di * 3 + 2] = this.col[di * 3 + 2] * (1 - op) + linToSrgb(c.b) * op;
      }
    }
  }

  png(): Buffer {
    const { W, H } = this;
    const raw = Buffer.alloc((W * 3 + 1) * H);
    for (let y = 0; y < H; y++) {
      raw[y * (W * 3 + 1)] = 0;
      for (let x = 0; x < W * 3; x++) raw[y * (W * 3 + 1) + 1 + x] = Math.round(Math.min(1, Math.max(0, this.col[y * W * 3 + x])) * 255);
    }
    const crcTable = Array.from({ length: 256 }, (_, n) => {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      return c >>> 0;
    });
    const crc = (buf: Buffer) => {
      let c = 0xffffffff;
      for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
      return (c ^ 0xffffffff) >>> 0;
    };
    const chunk = (type: string, data: Buffer) => {
      const len = Buffer.alloc(4);
      len.writeUInt32BE(data.length);
      const td = Buffer.concat([Buffer.from(type), data]);
      const c = Buffer.alloc(4);
      c.writeUInt32BE(crc(td));
      return Buffer.concat([len, td, c]);
    };
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(W, 0);
    ihdr.writeUInt32BE(H, 4);
    ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
    return Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk("IHDR", ihdr),
      chunk("IDAT", deflateSync(raw)),
      chunk("IEND", Buffer.alloc(0)),
    ]);
  }
}

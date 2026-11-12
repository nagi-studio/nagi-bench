/* A small software rasteriser for headless composition previews (no WebGL here). */
import * as THREE from "three";
import { deflateSync } from "node:zlib";
import { StubCanvas } from "./dom-stub";

interface LightInfo {
  kind: "dir" | "point" | "spot" | "hemi" | "amb";
  color: THREE.Color;
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  ground?: THREE.Color;
  distance: number;
  decay: number;
  cos?: number;
}

const srgbToLin = (v: number) => Math.pow(v / 255, 2.2);

function aces(x: number) {
  const a = x * 0.6;
  return Math.max(0, Math.min(1, (a * (2.51 * a + 0.03)) / (a * (2.43 * a + 0.59) + 0.14)));
}

function texSample(tex: THREE.Texture | null | undefined, u: number, v: number): [number, number, number, number] | null {
  if (!tex) return null;
  const img = tex.image as StubCanvas | undefined;
  if (!img || !(img instanceof StubCanvas)) return null;
  const w = img.width, h = img.height;
  let x = u, y = v;
  if (tex.flipY !== false) y = 1 - y;
  x = Math.min(w - 1, Math.max(0, Math.floor(x * w)));
  y = Math.min(h - 1, Math.max(0, Math.floor(y * h)));
  const d = img.data;
  const i = (y * w + x) * 4;
  return [d[i]!, d[i + 1]!, d[i + 2]!, d[i + 3]!];
}

export function renderPreview(scene: THREE.Scene, camera: THREE.PerspectiveCamera, W: number, H: number, opts: { exposure?: number; fx?: { fade: number; scope: number; tint: THREE.Vector3; sat: number; reticle: number } } = {}) {
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  scene.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const viewProj = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  const camPos = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);
  const color = new Float32Array(W * H * 3);
  const depth = new Float32Array(W * H).fill(Infinity);
  const bg = scene.background;
  if (bg instanceof THREE.Color) {
    for (let i = 0; i < W * H; i++) { color[i * 3] = bg.r; color[i * 3 + 1] = bg.g; color[i * 3 + 2] = bg.b; }
  } else if (bg && (bg as THREE.Texture).image) {
    for (let y = 0; y < H; y++) {
      const s = texSample(bg as THREE.Texture, 0.5, y / H) ?? [0, 0, 0, 255];
      for (let x = 0; x < W; x++) { const i = y * W + x; color[i * 3] = srgbToLin(s[0]); color[i * 3 + 1] = srgbToLin(s[1]); color[i * 3 + 2] = srgbToLin(s[2]); }
    }
  }
  const fog = scene.fog as THREE.Fog | null;

  // lights
  const lights: LightInfo[] = [];
  const isVisible = (o: THREE.Object3D) => { let p: THREE.Object3D | null = o; while (p) { if (!p.visible) return false; p = p.parent; } return true; };
  scene.traverse((o) => {
    if (!(o as THREE.Light).isLight || !isVisible(o)) return;
    const L = o as THREE.Light;
    const c = L.color.clone().multiplyScalar(L.intensity);
    const pos = new THREE.Vector3().setFromMatrixPosition(L.matrixWorld);
    if ((L as THREE.DirectionalLight).isDirectionalLight) {
      const t = new THREE.Vector3().setFromMatrixPosition((L as THREE.DirectionalLight).target.matrixWorld);
      lights.push({ kind: "dir", color: c, pos, dir: pos.clone().sub(t).normalize(), distance: 0, decay: 0 });
    } else if ((L as THREE.SpotLight).isSpotLight) {
      const S = L as THREE.SpotLight;
      const t = new THREE.Vector3().setFromMatrixPosition(S.target.matrixWorld);
      lights.push({ kind: "spot", color: c, pos, dir: t.sub(pos).normalize(), distance: S.distance, decay: S.decay, cos: Math.cos(S.angle) });
    } else if ((L as THREE.PointLight).isPointLight) {
      const P = L as THREE.PointLight;
      lights.push({ kind: "point", color: c, pos, dir: new THREE.Vector3(), distance: P.distance, decay: P.decay });
    } else if ((L as THREE.HemisphereLight).isHemisphereLight) {
      const Hm = L as THREE.HemisphereLight;
      lights.push({ kind: "hemi", color: c, pos, dir: pos.clone().normalize(), ground: Hm.groundColor.clone().multiplyScalar(L.intensity), distance: 0, decay: 0 });
    } else if ((L as THREE.AmbientLight).isAmbientLight) {
      lights.push({ kind: "amb", color: c, pos, dir: new THREE.Vector3(), distance: 0, decay: 0 });
    }
  });

  const shade = (p: THREE.Vector3, n: THREE.Vector3, out: THREE.Color) => {
    out.setRGB(0, 0, 0);
    for (const l of lights) {
      if (l.kind === "amb") { out.r += l.color.r / Math.PI; out.g += l.color.g / Math.PI; out.b += l.color.b / Math.PI; continue; }
      if (l.kind === "hemi") {
        const k = 0.5 * n.dot(l.dir) + 0.5;
        out.r += (l.ground!.r + (l.color.r - l.ground!.r) * k) / Math.PI;
        out.g += (l.ground!.g + (l.color.g - l.ground!.g) * k) / Math.PI;
        out.b += (l.ground!.b + (l.color.b - l.ground!.b) * k) / Math.PI;
        continue;
      }
      let ld: THREE.Vector3, att = 1;
      if (l.kind === "dir") ld = l.dir;
      else {
        ld = l.pos.clone().sub(p);
        const d = ld.length();
        ld.divideScalar(d || 1);
        att = 1 / Math.max(Math.pow(d, l.decay), 0.01);
        if (l.distance > 0) att *= Math.pow(Math.max(0, 1 - Math.pow(d / l.distance, 4)), 2);
        if (l.kind === "spot") {
          const c = -ld.dot(l.dir);
          if (c < l.cos!) att = 0; else att *= Math.min(1, (c - l.cos!) / 0.08);
        }
      }
      const nd = Math.max(0, n.dot(ld)) * att / Math.PI;
      out.r += l.color.r * nd; out.g += l.color.g * nd; out.b += l.color.b * nd;
    }
    return out;
  };

  const tmpV = [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()];
  const wp = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const nrm = new THREE.Vector3();
  const cen = new THREE.Vector3();
  const lightC = new THREE.Color();
  const near = camera.near;

  type Vert = { x: number; y: number; z: number; w: number; u: number; v: number };
  const clipPoly = (vs: Vert[]): Vert[] => {
    const out: Vert[] = [];
    for (let i = 0; i < vs.length; i++) {
      const a = vs[i]!, b = vs[(i + 1) % vs.length]!;
      const ia = a.w > near, ib = b.w > near;
      if (ia) out.push(a);
      if (ia !== ib) {
        const t = (near - a.w) / (b.w - a.w);
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t, w: near, u: a.u + (b.u - a.u) * t, v: a.v + (b.v - a.v) * t });
      }
    }
    return out;
  };

  const drawTri = (vs: Vert[], col: [number, number, number], alpha: number, tex: THREE.Texture | null, mode: "opaque" | "blend" | "add", alphaTest: number, emissiveOnly: boolean) => {
    const poly = clipPoly(vs);
    if (poly.length < 3) return;
    const sp = poly.map((p) => ({ x: (p.x / p.w * 0.5 + 0.5) * W, y: (1 - (p.y / p.w * 0.5 + 0.5)) * H, z: p.w, u: p.u, v: p.v }));
    for (let k = 1; k < sp.length - 1; k++) {
      const a = sp[0]!, b = sp[k]!, c = sp[k + 1]!;
      const minX = Math.max(0, Math.floor(Math.min(a.x, b.x, c.x))), maxX = Math.min(W - 1, Math.ceil(Math.max(a.x, b.x, c.x)));
      const minY = Math.max(0, Math.floor(Math.min(a.y, b.y, c.y))), maxY = Math.min(H - 1, Math.ceil(Math.max(a.y, b.y, c.y)));
      const area = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      if (Math.abs(area) < 1e-9) continue;
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const px = x + 0.5, py = y + 0.5;
          let w0 = ((b.x - px) * (c.y - py) - (b.y - py) * (c.x - px)) / area;
          let w1 = ((c.x - px) * (a.y - py) - (c.y - py) * (a.x - px)) / area;
          let w2 = 1 - w0 - w1;
          if (w0 < -1e-6 || w1 < -1e-6 || w2 < -1e-6) continue;
          const z = w0 * a.z + w1 * b.z + w2 * c.z;
          const i = y * W + x;
          if (z >= depth[i]!) continue;
          let r = col[0], g = col[1], bl = col[2], al = alpha;
          if (tex) {
            const s = texSample(tex, w0 * a.u + w1 * b.u + w2 * c.u, w0 * a.v + w1 * b.v + w2 * c.v);
            if (s) {
              if (s[3] / 255 < alphaTest) continue;
              const lr = srgbToLin(s[0]), lg = srgbToLin(s[1]), lb = srgbToLin(s[2]);
              r *= lr; g *= lg; bl *= lb; al *= s[3] / 255;
              if (emissiveOnly) { /* basic */ }
            }
          }
          if (mode === "opaque") {
            depth[i] = z;
            color[i * 3] = r; color[i * 3 + 1] = g; color[i * 3 + 2] = bl;
          } else if (mode === "blend") {
            color[i * 3] = color[i * 3]! * (1 - al) + r * al;
            color[i * 3 + 1] = color[i * 3 + 1]! * (1 - al) + g * al;
            color[i * 3 + 2] = color[i * 3 + 2]! * (1 - al) + bl * al;
          } else {
            color[i * 3] += r * al; color[i * 3 + 1] += g * al; color[i * 3 + 2] += bl * al;
          }
        }
      }
    }
  };

  const transparents: Array<() => void> = [];
  const fogMix = (c: [number, number, number], dist: number): [number, number, number] => {
    if (!fog || !(fog as THREE.Fog).isFog) return c;
    const f = Math.max(0, Math.min(1, (dist - fog.near) / (fog.far - fog.near)));
    return [c[0] + (fog.color.r - c[0]) * f, c[1] + (fog.color.g - c[1]) * f, c[2] + (fog.color.b - c[2]) * f];
  };

  const drawMesh = (mesh: THREE.Mesh, matrix: THREE.Matrix4, instColor?: THREE.Color) => {
    const geo = mesh.geometry as THREE.BufferGeometry;
    const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material & Record<string, unknown>;
    if (!mat || mat.visible === false) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const uv = geo.attributes.uv as THREE.BufferAttribute | undefined;
    const vcol = geo.attributes.color as THREE.BufferAttribute | undefined;
    const idx = geo.index;
    const count = idx ? idx.count : pos.count;
    const mvp = new THREE.Matrix4().multiplyMatrices(viewProj, matrix);
    const isShader = (mat as THREE.ShaderMaterial).isShaderMaterial;
    const isBasic = (mat as THREE.MeshBasicMaterial).isMeshBasicMaterial;
    const baseColor = (mat.color as THREE.Color | undefined)?.clone() ?? new THREE.Color(1, 1, 1);
    if (instColor) baseColor.multiply(instColor);
    const emissive = (mat.emissive as THREE.Color | undefined) ?? new THREE.Color(0, 0, 0);
    const map = (mat.map as THREE.Texture | null) ?? null;
    const transparent = mat.transparent && (mat.opacity < 0.999 || mat.blending === THREE.AdditiveBlending) && !(mat.alphaTest > 0);
    const additive = mat.blending === THREE.AdditiveBlending;
    const opacity = mat.opacity ?? 1;
    const alphaTest = (mat.alphaTest as number) || (map ? 0.01 : 0);
    const uSun = isShader ? ((mat as THREE.ShaderMaterial).uniforms.uSun?.value as THREE.Vector3 | undefined) : undefined;
    const uCenter = isShader ? ((mat as THREE.ShaderMaterial).uniforms.uCenter?.value as THREE.Vector3 | undefined) : undefined;
    const uDim = isShader ? ((mat as THREE.ShaderMaterial).uniforms.uDim?.value as number | undefined) ?? 1 : 1;
    const uCloud = isShader ? ((mat as THREE.ShaderMaterial).uniforms.uCloud?.value as number | undefined) ?? 0 : 0;
    const uWarm = isShader ? ((mat as THREE.ShaderMaterial).uniforms.uWarm?.value as number | undefined) ?? 1 : 1;
    const nm = new THREE.Matrix3().getNormalMatrix(matrix);
    const side = mat.side;
    for (let f = 0; f < count; f += 3) {
      const ids = [0, 1, 2].map((k) => (idx ? idx.getX(f + k) : f + k));
      for (let k = 0; k < 3; k++) {
        const id = ids[k]!;
        wp[k]!.fromBufferAttribute(pos, id).applyMatrix4(matrix);
        tmpV[k]!.set(pos.getX(id), pos.getY(id), pos.getZ(id), 1).applyMatrix4(mvp);
      }
      if (tmpV[0]!.w < near && tmpV[1]!.w < near && tmpV[2]!.w < near) continue;
      // frustum reject (rough)
      let out = true;
      for (let k = 0; k < 3; k++) { const v = tmpV[k]!; if (v.w > 0 && Math.abs(v.x) < v.w * 1.2 && Math.abs(v.y) < v.w * 1.2) { out = false; break; } }
      if (out) {
        const allLeft = tmpV.every((v) => v.x < -v.w), allRight = tmpV.every((v) => v.x > v.w), allUp = tmpV.every((v) => v.y > v.w), allDown = tmpV.every((v) => v.y < -v.w);
        if (allLeft || allRight || allUp || allDown) continue;
      }
      nrm.subVectors(wp[1]!, wp[0]!).cross(new THREE.Vector3().subVectors(wp[2]!, wp[0]!)).normalize();
      cen.copy(wp[0]!).add(wp[1]!).add(wp[2]!).divideScalar(3);
      const toCam = camPos.clone().sub(cen);
      if (side !== THREE.DoubleSide && nrm.dot(toCam) < 0) continue;
      if (side === THREE.DoubleSide && nrm.dot(toCam) < 0) nrm.negate();
      let r = baseColor.r, g = baseColor.g, b = baseColor.b;
      if (vcol) {
        const id = ids[0]!;
        r *= vcol.getX(id); g *= vcol.getY(id); b *= vcol.getZ(id);
      }
      let col: [number, number, number];
      if (isShader && uSun && uCenter) {
        const sn = cen.clone().sub(uCenter).normalize();
        const d = sn.dot(uSun);
        const block = 0.78 + 0.22 * Math.max(nrm.dot(uSun), 0);
        const ss = (e0: number, e1: number, x: number) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
        const day = ss(-0.1, 0.35, d);
        const band = Math.exp(-Math.pow((d - 0.02) / 0.14, 2));
        let lr = r * (0.25 + 0.95 * day) * block, lg = g * (0.25 + 0.95 * day) * block, lb = b * (0.25 + 0.95 * day) * block;
        const wk = band * uWarm * (1 - uCloud);
        lr = lr + (lr * 2.0 - lr) * wk; lg = lg + (lg * 0.9 - lg) * wk; lb = lb + (lb * 0.36 - lb) * wk;
        const pk = band * uWarm * uCloud;
        lr = lr + (r * 1.15 - lr) * pk; lg = lg + (g * 0.71 - lg) * pk; lb = lb + (b * 0.71 - lb) * pk;
        const m = Math.min(1, day + band * 0.25);
        col = [(r * 0.02 + (lr - r * 0.02) * m) * uDim, (g * 0.03 + (lg - g * 0.03) * m) * uDim, (b * 0.06 + (lb - b * 0.06) * m) * uDim];
      } else if (isShader) {
        continue;
      } else if (isBasic) {
        col = [r, g, b];
      } else {
        shade(cen, nrm, lightC);
        col = [r * lightC.r + emissive.r, g * lightC.g + emissive.g, b * lightC.b + emissive.b];
      }
      col = fogMix(col, toCam.length());
      const vs: Vert[] = [0, 1, 2].map((k) => {
        const id = ids[k]!;
        return { x: tmpV[k]!.x, y: tmpV[k]!.y, z: tmpV[k]!.z, w: tmpV[k]!.w, u: uv ? uv.getX(id) : 0, v: uv ? uv.getY(id) : 0 };
      });
      if (transparent) {
        const c2 = col;
        transparents.push(() => drawTri(vs, c2, opacity, map, additive ? "add" : "blend", alphaTest, false));
      } else {
        drawTri(vs, col, 1, map, "opaque", alphaTest, isBasic);
      }
    }
  };

  const drawSprite = (s: THREE.Sprite) => {
    const mat = s.material as THREE.SpriteMaterial;
    const p = new THREE.Vector3().setFromMatrixPosition(s.matrixWorld);
    const v = new THREE.Vector4(p.x, p.y, p.z, 1).applyMatrix4(viewProj);
    if (v.w <= near) return;
    const scale = new THREE.Vector3().setFromMatrixScale(s.matrixWorld);
    const sizePx = (scale.x / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * v.w)) * H;
    const cx = (v.x / v.w * 0.5 + 0.5) * W, cy = (1 - (v.y / v.w * 0.5 + 0.5)) * H;
    const r = sizePx / 2;
    if (cx + r < 0 || cx - r > W || cy + r < 0 || cy - r > H) return;
    const col = mat.color;
    transparents.push(() => {
      for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(H, Math.ceil(cy + r)); y++) {
        for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(W, Math.ceil(cx + r)); x++) {
          const i = y * W + x;
          if (v.w > depth[i]!) continue;
          const u = (x + 0.5 - (cx - r)) / (2 * r), vv = (y + 0.5 - (cy - r)) / (2 * r);
          const t = texSample(mat.map, u, 1 - vv);
          if (!t) continue;
          const a = (t[3] / 255) * mat.opacity;
          color[i * 3] += srgbToLin(t[0]) * col.r * a;
          color[i * 3 + 1] += srgbToLin(t[1]) * col.g * a;
          color[i * 3 + 2] += srgbToLin(t[2]) * col.b * a;
        }
      }
    });
  };

  const drawPoints = (pts: THREE.Points) => {
    const geo = pts.geometry;
    const mat = pts.material as THREE.Material & Record<string, unknown>;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const n = Math.min(pos.count, geo.drawRange.count === Infinity ? pos.count : geo.drawRange.count);
    const mvp = new THREE.Matrix4().multiplyMatrices(viewProj, pts.matrixWorld);
    const aSize = geo.attributes.aSize as THREE.BufferAttribute | undefined;
    const aAlpha = geo.attributes.aAlpha as THREE.BufferAttribute | undefined;
    const aColor = geo.attributes.aColor as THREE.BufferAttribute | undefined;
    const vcol = geo.attributes.color as THREE.BufferAttribute | undefined;
    const additive = mat.blending === THREE.AdditiveBlending;
    const shaderUScale = (mat as unknown as THREE.ShaderMaterial).uniforms?.uScale?.value as number | undefined;
    const isCity = !!(mat as unknown as THREE.ShaderMaterial).uniforms?.uAmt;
    transparents.push(() => {
      const v = new THREE.Vector4();
      for (let i = 0; i < n; i++) {
        v.set(pos.getX(i), pos.getY(i), pos.getZ(i), 1).applyMatrix4(mvp);
        if (v.w <= near) continue;
        const cx = (v.x / v.w * 0.5 + 0.5) * W, cy = (1 - (v.y / v.w * 0.5 + 0.5)) * H;
        if (cx < -50 || cx > W + 50 || cy < -50 || cy > H + 50) continue;
        let size = 1, a = 1, r = 1, g = 1, b = 1;
        if (aSize) {
          size = (aSize.getX(i) * (shaderUScale ?? 600)) / v.w * (H / 720);
          a = aAlpha!.getX(i);
          r = aColor!.getX(i); g = aColor!.getY(i); b = aColor!.getZ(i);
        } else if (isCity) {
          continue;
        } else {
          const pm = mat as unknown as THREE.PointsMaterial;
          size = pm.sizeAttenuation ? (pm.size * H) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * v.w) : pm.size * (H / 720);
          r = pm.color.r; g = pm.color.g; b = pm.color.b;
          if (vcol) { r *= vcol.getX(i); g *= vcol.getY(i); b *= vcol.getZ(i); }
        }
        if (a <= 0.003) continue;
        const rad = Math.max(0.5, size / 2);
        for (let y = Math.floor(cy - rad); y < cy + rad; y++) for (let x = Math.floor(cx - rad); x < cx + rad; x++) {
          if (x < 0 || y < 0 || x >= W || y >= H) continue;
          const k = y * W + x;
          if (v.w > depth[k]!) continue;
          const fall = aSize ? Math.max(0, 1 - Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / rad) : 1;
          const aa = a * fall * Math.min(1, size * size);
          if (additive || !aSize) {
            color[k * 3] += r * aa; color[k * 3 + 1] += g * aa; color[k * 3 + 2] += b * aa;
          } else {
            color[k * 3] = color[k * 3]! * (1 - aa) + r * aa;
            color[k * 3 + 1] = color[k * 3 + 1]! * (1 - aa) + g * aa;
            color[k * 3 + 2] = color[k * 3 + 2]! * (1 - aa) + b * aa;
          }
        }
      }
    });
  };

  const stack: THREE.Object3D[] = [scene];
  const m4 = new THREE.Matrix4();
  const ic = new THREE.Color();
  while (stack.length) {
    const o = stack.pop()!;
    if (!o.visible) continue;
    for (const c of o.children) stack.push(c);
    if ((o as THREE.InstancedMesh).isInstancedMesh) {
      const im = o as THREE.InstancedMesh;
      for (let i = 0; i < im.count; i++) {
        im.getMatrixAt(i, m4);
        m4.premultiply(im.matrixWorld);
        if (im.instanceColor) im.getColorAt(i, ic); else ic.setRGB(1, 1, 1);
        drawMesh(im, m4.clone(), ic.clone());
      }
    } else if ((o as THREE.Mesh).isMesh) drawMesh(o as THREE.Mesh, o.matrixWorld);
    else if ((o as THREE.Sprite).isSprite) drawSprite(o as THREE.Sprite);
    else if ((o as THREE.Points).isPoints) drawPoints(o as THREE.Points);
  }
  for (const t of transparents) t();

  // post: tone map, grade, scope, letterbox
  const exposure = opts.exposure ?? 1;
  const fx = opts.fx;
  const out = new Uint8Array(W * H * 3);
  const visible = Math.min(1, (W / H) / 2.39);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    let r = aces(color[i * 3]! * exposure), g = aces(color[i * 3 + 1]! * exposure), b = aces(color[i * 3 + 2]! * exposure);
    r = Math.pow(r, 1 / 2.2); g = Math.pow(g, 1 / 2.2); b = Math.pow(b, 1 / 2.2);
    if (fx) {
      const l = 0.299 * r + 0.587 * g + 0.114 * b;
      r = l + (r - l) * fx.sat; g = l + (g - l) * fx.sat; b = l + (b - l) * fx.sat;
      r *= fx.tint.x; g *= fx.tint.y; b *= fx.tint.z;
      if (fx.scope > 0) {
        const px = (x / W - 0.5) * (W / H), py = y / H - 0.5;
        const rr = Math.hypot(px, py);
        if (rr > 0.44) { r = g = b = 0; }
        else if (fx.reticle > 0 && ((Math.abs(px) < 0.0015 && Math.abs(py) > 0.012) || (Math.abs(py) < 0.0015 && Math.abs(px) > 0.012))) { r = g = b = 0.02; }
      }
      r *= 1 - fx.fade; g *= 1 - fx.fade; b *= 1 - fx.fade;
    }
    if (Math.abs(y / H - 0.5) > visible * 0.5) { r = g = b = 0; }
    out[i * 3] = Math.max(0, Math.min(255, r * 255));
    out[i * 3 + 1] = Math.max(0, Math.min(255, g * 255));
    out[i * 3 + 2] = Math.max(0, Math.min(255, b * 255));
  }
  return out;
}

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function crc32(buf: Uint8Array) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]!) & 255]! ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type: string, data: Uint8Array) {
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}
export function encodePNG(rgb: Uint8Array, W: number, H: number) {
  const raw = new Uint8Array((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; raw.set(rgb.subarray(y * W * 3, (y + 1) * W * 3), y * (W * 3 + 1) + 1); }
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, W); dv.setUint32(4, H); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const parts = [sig, chunk("IHDR", ihdr), chunk("IDAT", new Uint8Array(deflateSync(raw))), chunk("IEND", new Uint8Array(0))];
  const total = parts.reduce((s, p) => s + p.length, 0);
  const png = new Uint8Array(total);
  let o = 0;
  for (const p of parts) { png.set(p, o); o += p.length; }
  return png;
}

/** Tile several frames into one contact sheet. */
export function contactSheet(frames: Uint8Array[], W: number, H: number, cols: number) {
  const rows = Math.ceil(frames.length / cols);
  const SW = W * cols, SH = H * rows;
  const out = new Uint8Array(SW * SH * 3);
  frames.forEach((f, idx) => {
    const ox = (idx % cols) * W, oy = Math.floor(idx / cols) * H;
    for (let y = 0; y < H; y++) out.set(f.subarray(y * W * 3, (y + 1) * W * 3), ((oy + y) * SW + ox) * 3);
    // separator line
    for (let x = 0; x < W; x++) { const k = ((oy) * SW + ox + x) * 3; out[k] = 60; out[k + 1] = 60; out[k + 2] = 60; }
  });
  return { png: encodePNG(out, SW, SH), SW, SH };
}

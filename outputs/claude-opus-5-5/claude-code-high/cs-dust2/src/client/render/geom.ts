// Tiny geometry builder: accumulates boxes/quads with world-space or per-face UVs and
// vertex colors into one BufferGeometry (so the whole static map is a handful of draw calls).
import * as THREE from 'three';

export type V3t = [number, number, number];
export type RGB = [number, number, number];

export interface BoxOpts {
  uv?: 'world' | 'face';
  /** meters per texture repeat for world UVs */
  texScale?: number;
  color?: RGB;
  /** color multiplier applied to the bottom vertices of side faces (fake AO) */
  bottomShade?: number;
  skipBottom?: boolean;
  skipTop?: boolean;
}

export class GeoBuilder {
  private pos: number[] = [];
  private nor: number[] = [];
  private uv: number[] = [];
  private col: number[] = [];
  private idx: number[] = [];

  get empty() {
    return this.idx.length === 0;
  }

  quad(p: [V3t, V3t, V3t, V3t], n: V3t, uvs: [number, number][], colors: RGB | RGB[]) {
    const base = this.pos.length / 3;
    for (let i = 0; i < 4; i++) {
      this.pos.push(p[i][0], p[i][1], p[i][2]);
      this.nor.push(n[0], n[1], n[2]);
      this.uv.push(uvs[i][0], uvs[i][1]);
      const c = Array.isArray(colors[0]) ? (colors as RGB[])[i] : (colors as RGB);
      this.col.push(c[0], c[1], c[2]);
    }
    this.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  /** Quad with normal computed from its vertices (CCW). */
  quadAuto(p: [V3t, V3t, V3t, V3t], uvs: [number, number][], colors: RGB | RGB[]) {
    const ax = p[1][0] - p[0][0];
    const ay = p[1][1] - p[0][1];
    const az = p[1][2] - p[0][2];
    const bx = p[2][0] - p[0][0];
    const by = p[2][1] - p[0][1];
    const bz = p[2][2] - p[0][2];
    let nx = ay * bz - az * by;
    let ny = az * bx - ax * bz;
    let nz = ax * by - ay * bx;
    const l = Math.hypot(nx, ny, nz) || 1;
    nx /= l;
    ny /= l;
    nz /= l;
    this.quad(p, [nx, ny, nz], uvs, colors);
  }

  box(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, o: BoxOpts = {}) {
    const s = o.texScale ?? 4;
    const world = (o.uv ?? 'world') === 'world';
    const c: RGB = o.color ?? [1, 1, 1];
    const bs = o.bottomShade ?? 1;
    const cb: RGB = [c[0] * bs, c[1] * bs, c[2] * bs];
    const side: RGB[] = [cb, cb, c, c];
    const F: [number, number][] = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    const W = (u0: number, v0: number, u1: number, v1: number): [number, number][] =>
      world
        ? [
            [u0 / s, v0 / s],
            [u1 / s, v0 / s],
            [u1 / s, v1 / s],
            [u0 / s, v1 / s],
          ]
        : F;
    // +X
    this.quad([[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], [1, 0, 0], W(-z1, y0, -z0, y1), side);
    // -X
    this.quad([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], [-1, 0, 0], W(z0, y0, z1, y1), side);
    // +Z
    this.quad([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1], W(x0, y0, x1, y1), side);
    // -Z
    this.quad([[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]], [0, 0, -1], W(-x1, y0, -x0, y1), side);
    if (!o.skipTop) this.quad([[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], [0, 1, 0], W(x0, -z1, x1, -z0), c);
    if (!o.skipBottom) this.quad([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0], W(x0, z0, x1, z1), c);
  }

  build(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx);
    g.computeBoundingSphere();
    g.computeBoundingBox();
    return g;
  }
}

/** Simple (non-merged) box mesh helper for dynamic models. Geometry origin at center. */
export function boxMesh(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

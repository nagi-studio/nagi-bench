import * as THREE from 'three';

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _s = new THREE.Vector3(1, 1, 1);
const _p = new THREE.Vector3();
const _n = new THREE.Matrix3();
const _v = new THREE.Vector3();
const _c = new THREE.Color();

const boxCache = new Map<string, THREE.BufferGeometry>();
const unitBox = new THREE.BoxGeometry(1, 1, 1);

/**
 * Accumulates primitive parts (with transforms and per-part colors) into one indexed
 * BufferGeometry with vertex colors: a whole gun or prop becomes a single draw call.
 */
export class GeoBuilder {
  private pos: number[] = [];
  private nor: number[] = [];
  private col: number[] = [];
  private idx: number[] = [];

  add(geo: THREE.BufferGeometry, matrix: THREE.Matrix4, color: THREE.ColorRepresentation, shade = 1): this {
    const p = geo.getAttribute('position');
    const n = geo.getAttribute('normal');
    const base = this.pos.length / 3;
    _n.getNormalMatrix(matrix);
    _c.set(color);
    for (let i = 0; i < p.count; i++) {
      _v.fromBufferAttribute(p, i).applyMatrix4(matrix);
      this.pos.push(_v.x, _v.y, _v.z);
      _v.fromBufferAttribute(n, i).applyMatrix3(_n).normalize();
      this.nor.push(_v.x, _v.y, _v.z);
      this.col.push(_c.r * shade, _c.g * shade, _c.b * shade);
    }
    const index = geo.getIndex();
    if (index) for (let i = 0; i < index.count; i++) this.idx.push(base + index.getX(i));
    else for (let i = 0; i < p.count; i++) this.idx.push(base + i);
    return this;
  }

  /** Box of size (w,h,d) centred at (x,y,z) with optional Euler rotation (radians, XYZ). */
  box(w: number, h: number, d: number, x: number, y: number, z: number, color: THREE.ColorRepresentation, rx = 0, ry = 0, rz = 0): this {
    _e.set(rx, ry, rz);
    _q.setFromEuler(_e);
    _s.set(w, h, d);
    _p.set(x, y, z);
    _m.compose(_p, _q, _s);
    return this.add(unitBox, _m, color);
  }

  /** Cylinder of radius r and length len centred at (x,y,z), oriented along `axis`. */
  cyl(r: number, len: number, x: number, y: number, z: number, color: THREE.ColorRepresentation, axis: 'x' | 'y' | 'z' = 'z', seg = 10, r2 = r): this {
    const key = `${r.toFixed(4)}_${r2.toFixed(4)}_${len.toFixed(4)}_${seg}`;
    let g = boxCache.get(key);
    if (!g) {
      g = new THREE.CylinderGeometry(r2, r, len, seg, 1, false);
      boxCache.set(key, g);
    }
    if (axis === 'x') _e.set(0, 0, Math.PI / 2);
    else if (axis === 'z') _e.set(Math.PI / 2, 0, 0);
    else _e.set(0, 0, 0);
    _q.setFromEuler(_e);
    _s.set(1, 1, 1);
    _p.set(x, y, z);
    _m.compose(_p, _q, _s);
    return this.add(g, _m, color);
  }

  sphere(r: number, x: number, y: number, z: number, color: THREE.ColorRepresentation, sx = 1, sy = 1, sz = 1): this {
    const key = `sphere_${r.toFixed(4)}`;
    let g = boxCache.get(key);
    if (!g) {
      g = new THREE.SphereGeometry(r, 12, 8);
      boxCache.set(key, g);
    }
    _q.identity();
    _s.set(sx, sy, sz);
    _p.set(x, y, z);
    _m.compose(_p, _q, _s);
    return this.add(g, _m, color);
  }

  get empty(): boolean {
    return this.pos.length === 0;
  }

  build(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx);
    g.computeBoundingSphere();
    g.computeBoundingBox();
    return g;
  }
}

/** Shared vertex-colored materials (one per surface response). */
const materialCache = new Map<string, THREE.MeshStandardMaterial>();
export function vcMaterial(kind: 'matte' | 'metal' | 'gloss' = 'matte'): THREE.MeshStandardMaterial {
  let m = materialCache.get(kind);
  if (!m) {
    const params =
      kind === 'metal'
        ? { roughness: 0.42, metalness: 0.55 }
        : kind === 'gloss'
          ? { roughness: 0.3, metalness: 0.2 }
          : { roughness: 0.78, metalness: 0.05 };
    m = new THREE.MeshStandardMaterial({ vertexColors: true, ...params });
    materialCache.set(kind, m);
  }
  return m;
}

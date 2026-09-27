// Minimal three.js stand-in for headless smoke tests of the client code (no WebGL in Node).
// Implements only the API surface used by src/client with plausible behaviour.

export const SRGBColorSpace = 'srgb';
export const RepeatWrapping = 1000;
export const PCFSoftShadowMap = 2;
export const ACESFilmicToneMapping = 4;
export const AdditiveBlending = 2;
export const NormalBlending = 1;
export const BackSide = 1;
export const DoubleSide = 2;

export const MathUtils = {
  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
};

const num = (v, name) => {
  if (typeof v !== 'number' || Number.isNaN(v)) throw new Error(`NaN/invalid number for ${name}: ${v}`);
  return v;
};

export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  set(x, y, z) {
    this.x = num(x, 'x');
    this.y = num(y, 'y');
    this.z = num(z, 'z');
    return this;
  }
  setScalar(s) {
    return this.set(s, s, s);
  }
  setY(y) {
    this.y = y;
    return this;
  }
  copy(v) {
    return this.set(v.x, v.y, v.z);
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
  add(v) {
    return this.set(this.x + v.x, this.y + v.y, this.z + v.z);
  }
  addScaledVector(v, s) {
    return this.set(this.x + v.x * s, this.y + v.y * s, this.z + v.z * s);
  }
  sub(v) {
    return this.set(this.x - v.x, this.y - v.y, this.z - v.z);
  }
  multiplyScalar(s) {
    return this.set(this.x * s, this.y * s, this.z * s);
  }
  divideScalar(s) {
    return this.multiplyScalar(1 / s);
  }
  length() {
    return Math.hypot(this.x, this.y, this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  distanceTo(v) {
    return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z);
  }
  lerp(v, t) {
    return this.set(this.x + (v.x - this.x) * t, this.y + (v.y - this.y) * t, this.z + (v.z - this.z) * t);
  }
  lerpVectors(a, b, t) {
    return this.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
  }
}

export class Euler {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.order = 'XYZ';
  }
  set(x, y, z) {
    this.x = num(x, 'rx');
    this.y = num(y, 'ry');
    this.z = num(z, 'rz');
    return this;
  }
}

export class Quaternion {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 1;
  }
  setFromUnitVectors(a, b) {
    num(a.x + b.x + a.y + b.y + a.z + b.z, 'quat');
    this.w = 1;
    return this;
  }
  copy(q) {
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;
    return this;
  }
}

export class Color {
  constructor(c = 0xffffff) {
    this.r = 1;
    this.g = 1;
    this.b = 1;
    if (typeof c === 'number') this.setHex(c);
    else if (typeof c === 'string') this.setHex(parseInt(c.replace('#', ''), 16));
  }
  setHex(h) {
    this.r = ((h >> 16) & 255) / 255;
    this.g = ((h >> 8) & 255) / 255;
    this.b = (h & 255) / 255;
    return this;
  }
  setRGB(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }
  copy(c) {
    return this.setRGB(c.r, c.g, c.b);
  }
  lerp(c, t) {
    return this.setRGB(this.r + (c.r - this.r) * t, this.g + (c.g - this.g) * t, this.b + (c.b - this.b) * t);
  }
  multiplyScalar(s) {
    return this.setRGB(this.r * s, this.g * s, this.b * s);
  }
  getHexString() {
    const h = (v) => Math.max(0, Math.min(255, Math.round(v * 255))).toString(16).padStart(2, '0');
    return h(this.r) + h(this.g) + h(this.b);
  }
}

export class Object3D {
  constructor() {
    this.position = new Vector3();
    this.rotation = new Euler();
    this.quaternion = new Quaternion();
    this.scale = new Vector3(1, 1, 1);
    this.children = [];
    this.parent = null;
    this.visible = true;
    this.castShadow = false;
    this.receiveShadow = false;
    this.frustumCulled = true;
    this.matrixAutoUpdate = true;
    this.renderOrder = 0;
  }
  add(...objs) {
    for (const o of objs) {
      if (!(o instanceof Object3D)) throw new Error('add(): not an Object3D');
      if (o.parent) o.parent.remove(o);
      o.parent = this;
      this.children.push(o);
    }
    return this;
  }
  remove(o) {
    const i = this.children.indexOf(o);
    if (i >= 0) this.children.splice(i, 1);
    o.parent = null;
    return this;
  }
  traverse(fn) {
    fn(this);
    for (const c of this.children) c.traverse(fn);
  }
  lookAt(x, y, z) {
    if (typeof x === 'object') num(x.x + x.y + x.z, 'lookAt');
    else num(x + y + z, 'lookAt');
  }
  rotateY(a) {
    this.rotation.y += a;
    return this;
  }
  rotateZ(a) {
    this.rotation.z += a;
    return this;
  }
  updateMatrix() {}
  updateMatrixWorld() {}
  localToWorld(v) {
    let o = this;
    while (o) {
      v.add(o.position);
      o = o.parent;
    }
    return v;
  }
  worldToLocal(v) {
    let o = this;
    while (o) {
      v.sub(o.position);
      o = o.parent;
    }
    return v;
  }
}

export class Group extends Object3D {}
export class Scene extends Object3D {
  constructor() {
    super();
    this.fog = null;
    this.background = null;
  }
}
export class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    if (!geometry) throw new Error('Mesh without geometry');
    this.geometry = geometry;
    this.material = material;
    this.isMesh = true;
  }
}
export class Points extends Mesh {}
export class Sprite extends Object3D {
  constructor(material) {
    super();
    this.material = material;
  }
}

class Light extends Object3D {
  constructor(color, intensity = 1) {
    super();
    this.color = new Color(color);
    this.intensity = intensity;
  }
}
export class HemisphereLight extends Light {}
export class DirectionalLight extends Light {
  constructor(c, i) {
    super(c, i);
    this.target = new Object3D();
    this.shadow = { mapSize: new Vector3(), camera: { updateProjectionMatrix() {} }, bias: 0, normalBias: 0 };
    this.shadow.mapSize.set = (x, y) => {
      this.shadow.mapSize.x = x;
      this.shadow.mapSize.y = y;
    };
  }
}
export class PointLight extends Light {
  constructor(c, i, distance = 0, decay = 2) {
    super(c, i);
    this.distance = distance;
    this.decay = decay;
  }
}

export class PerspectiveCamera extends Object3D {
  constructor(fov = 50, aspect = 1, near = 0.1, far = 1000) {
    super();
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
  }
  updateProjectionMatrix() {
    num(this.fov, 'fov');
    num(this.aspect, 'aspect');
  }
}

export class BufferAttribute {
  constructor(array, itemSize) {
    this.array = array;
    this.itemSize = itemSize;
    this.count = array.length / itemSize;
    this.needsUpdate = false;
  }
  getY(i) {
    return this.array[i * this.itemSize + 1];
  }
}
export class Float32BufferAttribute extends BufferAttribute {
  constructor(array, itemSize) {
    for (const v of array) if (Number.isNaN(v)) throw new Error('NaN in Float32BufferAttribute');
    super(new Float32Array(array), itemSize);
  }
}

export class BufferGeometry {
  constructor() {
    this.attributes = {};
    this.index = null;
  }
  setAttribute(n, a) {
    this.attributes[n] = a;
    return this;
  }
  getAttribute(n) {
    return this.attributes[n];
  }
  setIndex(i) {
    this.index = i;
    return this;
  }
  computeBoundingSphere() {}
  computeBoundingBox() {}
  translate() {
    return this;
  }
  dispose() {}
}
const geo = (verts) => {
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(verts * 3), 3));
  return g;
};
export class BoxGeometry extends BufferGeometry {
  constructor(w, h, d) {
    super();
    num(w + h + d, 'box dims');
    this.setAttribute('position', new BufferAttribute(new Float32Array(72), 3));
  }
}
export class PlaneGeometry extends BufferGeometry {}
export class CylinderGeometry extends BufferGeometry {}
export class IcosahedronGeometry extends BufferGeometry {}
export class SphereGeometry extends BufferGeometry {
  constructor(r = 1, ws = 8, hs = 6) {
    super();
    const g = geo((ws + 1) * (hs + 1));
    this.attributes = g.attributes;
  }
}

class Material {
  constructor(p = {}) {
    Object.assign(this, p);
    this.color = new Color(typeof p.color === 'number' ? p.color : 0xffffff);
  }
  dispose() {}
}
export class MeshLambertMaterial extends Material {}
export class MeshPhongMaterial extends Material {}
export class MeshBasicMaterial extends Material {}
export class PointsMaterial extends Material {}
export class SpriteMaterial extends Material {}

export class CanvasTexture {
  constructor(canvas) {
    this.image = canvas;
    this.wrapS = 0;
    this.wrapT = 0;
    this.needsUpdate = false;
  }
}

export class Fog {
  constructor(color, near, far) {
    this.color = new Color(color);
    this.near = near;
    this.far = far;
  }
}

export let renderCalls = 0;
export class WebGLRenderer {
  constructor() {
    this.domElement = globalThis.document.createElement('canvas');
    this.shadowMap = { enabled: false, type: 0 };
    this.autoClear = true;
  }
  setPixelRatio() {}
  setSize() {}
  render(scene, camera) {
    if (!(scene instanceof Object3D) || !(camera instanceof PerspectiveCamera)) throw new Error('bad render args');
    num(camera.position.x + camera.position.y + camera.position.z, 'camera position');
    num(camera.rotation.x + camera.rotation.y, 'camera rotation');
    renderCalls++;
  }
  clear() {}
  clearDepth() {}
  dispose() {}
}

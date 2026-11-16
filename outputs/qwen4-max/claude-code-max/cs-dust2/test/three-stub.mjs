// Minimal permissive three.js stub for headless render-logic smoke tests.
export const SRGBColorSpace = 'srgb';
export const RepeatWrapping = 1000;
export const BackSide = 1;
export const AdditiveBlending = 2;
export const PCFSoftShadowMap = 2;

export class Vector3 {
  constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  setScalar(s) { this.x = this.y = this.z = s; return this; }
  copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
  addScaledVector(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; }
  multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
  normalize() { const l = Math.hypot(this.x, this.y, this.z) || 1; return this.multiplyScalar(1 / l); }
  clone() { return new Vector3(this.x, this.y, this.z); }
}
export class Color {
  constructor(c) { this.value = c; }
  setRGB(r, g, b) { this.r = r; this.g = g; this.b = b; return this; }
}
class Euler { constructor() { this.x = 0; this.y = 0; this.z = 0; this.order = 'XYZ'; } set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; } }

export class Object3D {
  constructor() {
    this.position = new Vector3();
    this.rotation = new Euler();
    this.scale = new Vector3(1, 1, 1);
    this.children = [];
    this.visible = true;
    this.castShadow = false;
    this.receiveShadow = false;
    this.frustumCulled = true;
  }
  add(...objs) { for (const o of objs) if (o) this.children.push(o); return this; }
  remove(...objs) { for (const o of objs) { const i = this.children.indexOf(o); if (i >= 0) this.children.splice(i, 1); } return this; }
  traverse(fn) { fn(this); for (const c of this.children) c.traverse ? c.traverse(fn) : fn(c); }
  lookAt() { return this; }
}
export class Group extends Object3D {}
export class Scene extends Object3D { constructor() { super(); this.background = null; this.fog = null; } }

class Geometry {
  constructor() { this.attributes = {}; }
  dispose() {}
  setFromPoints(pts) { this.setAttribute('position', new BufferAttribute(new Float32Array(pts.length * 3), 3)); return this; }
  setAttribute(name, attr) { this.attributes[name] = attr; return this; }
  getAttribute(name) { return this.attributes[name]; }
}
export class BoxGeometry extends Geometry { constructor(...a) { super(); this.args = a; } }
export class SphereGeometry extends Geometry { constructor(...a) { super(); this.args = a; } }
export class CylinderGeometry extends Geometry { constructor(...a) { super(); this.args = a; } }
export class CircleGeometry extends Geometry { constructor(...a) { super(); this.args = a; } }
export class PlaneGeometry extends Geometry { constructor(...a) { super(); this.args = a; } }
export class BufferGeometry extends Geometry {}
export class BufferAttribute {
  constructor(array, itemSize) { this.array = array; this.itemSize = itemSize; this.count = array.length / itemSize; this.needsUpdate = false; }
}

class Material {
  constructor(props = {}) { Object.assign(this, props); this.opacity = props.opacity ?? 1; this.emissive = new Color(0); this.emissiveIntensity = 1; this.color = new Color(props.color); }
  dispose() {}
}
export class MeshStandardMaterial extends Material {}
export class MeshBasicMaterial extends Material {}
export class LineBasicMaterial extends Material {}
export class PointsMaterial extends Material {}
export class SpriteMaterial extends Material {}

export class Mesh extends Object3D { constructor(geometry, material) { super(); this.geometry = geometry; this.material = material; } }
export class Line extends Object3D { constructor(geometry, material) { super(); this.geometry = geometry; this.material = material; } }
export class Points extends Object3D { constructor(geometry, material) { super(); this.geometry = geometry; this.material = material; } }
export class Sprite extends Object3D { constructor(material) { super(); this.material = material; } }

class Light extends Object3D { constructor(color, intensity) { super(); this.color = color; this.intensity = intensity; } }
export class HemisphereLight extends Light {}
export class AmbientLight extends Light {}
export class DirectionalLight extends Light {
  constructor(c, i) { super(c, i); this.target = new Object3D(); this.shadow = { mapSize: { set() {} }, camera: {}, bias: 0 }; }
}
export class PointLight extends Light { constructor(c, i, d, decay) { super(c, i); this.distance = d; this.decay = decay; } }

export class PerspectiveCamera extends Object3D {
  constructor(fov, aspect, near, far) { super(); this.fov = fov; this.aspect = aspect; this.near = near; this.far = far; }
  updateProjectionMatrix() {}
}
export class Fog { constructor(color, near, far) { this.color = color; this.near = near; this.far = far; } }
export class CanvasTexture {
  constructor(canvas) { this.canvas = canvas; this.repeat = { set() {} }; this.wrapS = 0; this.wrapT = 0; this.anisotropy = 1; this.colorSpace = ''; }
  dispose() {}
}
export class WebGLRenderer {
  constructor() { this.shadowMap = { enabled: false, type: 0 }; this.outputColorSpace = ''; this.autoClear = true; }
  setPixelRatio() {} setSize() {} clear() {} clearDepth() {} render() {} dispose() {}
}

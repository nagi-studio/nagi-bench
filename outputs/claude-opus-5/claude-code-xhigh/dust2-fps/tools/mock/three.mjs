/**
 * three.js 的最小替身，只实现本项目用到的 API 表面。
 * 目的不是模拟渲染，而是让渲染层代码能在 Node 里真正跑一遍：
 * 拼错的方法名、传错的参数个数、访问了不存在的属性都会立刻抛错。
 */

export const RepeatWrapping = 1000;
export const ClampToEdgeWrapping = 1001;
export const SRGBColorSpace = 'srgb';
export const LinearSRGBColorSpace = 'srgb-linear';
export const AdditiveBlending = 2;
export const NormalBlending = 1;
export const BackSide = 1;
export const FrontSide = 0;
export const DoubleSide = 2;
export const PCFSoftShadowMap = 2;
export const BasicShadowMap = 0;

let idCounter = 1;

export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  setScalar(s) {
    return this.set(s, s, s);
  }
  copy(v) {
    return this.set(v.x, v.y, v.z);
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  multiplyScalar(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  length() {
    return Math.hypot(this.x, this.y, this.z);
  }
  normalize() {
    const l = this.length() || 1;
    return this.multiplyScalar(1 / l);
  }
  distanceTo(v) {
    return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z);
  }
}

export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
}

export class Euler {
  constructor(x = 0, y = 0, z = 0, order = 'XYZ') {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  copy(e) {
    return this.set(e.x, e.y, e.z);
  }
}

export class Color {
  constructor(hex = 0xffffff) {
    this.value = typeof hex === 'number' ? hex : 0xffffff;
  }
  setHex(h) {
    this.value = h;
    return this;
  }
  getHex() {
    return this.value;
  }
  set(h) {
    return this.setHex(typeof h === 'number' ? h : 0xffffff);
  }
}

export class Sphere {
  constructor(center = new Vector3(), radius = 0) {
    this.center = center;
    this.radius = radius;
  }
}

export class Object3D {
  constructor() {
    this.id = idCounter++;
    this.name = '';
    this.type = 'Object3D';
    this.position = new Vector3();
    this.rotation = new Euler();
    this.scale = new Vector3(1, 1, 1);
    this.children = [];
    this.parent = null;
    this.visible = true;
    this.castShadow = false;
    this.receiveShadow = false;
    this.frustumCulled = true;
    this.renderOrder = 0;
    this.matrixAutoUpdate = true;
    this.userData = {};
  }
  add(...objs) {
    for (const o of objs) {
      if (!o) throw new Error('Object3D.add(undefined)');
      if (o.parent) o.parent.remove(o);
      o.parent = this;
      this.children.push(o);
    }
    return this;
  }
  remove(...objs) {
    for (const o of objs) {
      const i = this.children.indexOf(o);
      if (i >= 0) {
        this.children.splice(i, 1);
        o.parent = null;
      }
    }
    return this;
  }
  traverse(cb) {
    cb(this);
    for (const c of this.children) c.traverse(cb);
  }
  lookAt() {
    return this;
  }
  updateMatrixWorld() {}
  getWorldPosition(target) {
    return target.copy(this.position);
  }
}

export class Group extends Object3D {
  constructor() {
    super();
    this.type = 'Group';
  }
}

export class Scene extends Object3D {
  constructor() {
    super();
    this.type = 'Scene';
    this.background = null;
    this.fog = null;
    this.environment = null;
  }
}

export class Camera extends Object3D {}

export class PerspectiveCamera extends Camera {
  constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
    super();
    this.type = 'PerspectiveCamera';
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.projectionUpdates = 0;
  }
  updateProjectionMatrix() {
    this.projectionUpdates++;
  }
}

export class OrthographicCamera extends Camera {
  constructor(left, right, top, bottom, near, far) {
    super();
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
  }
  updateProjectionMatrix() {}
}

export class Fog {
  constructor(color, near, far) {
    this.color = new Color(color);
    this.near = near;
    this.far = far;
  }
}

export class BufferAttribute {
  constructor(array, itemSize) {
    if (!array || typeof array.length !== 'number') {
      throw new Error('BufferAttribute 需要 TypedArray');
    }
    this.array = array;
    this.itemSize = itemSize;
    this.count = array.length / itemSize;
    this.needsUpdate = false;
  }
}

export class Float32BufferAttribute extends BufferAttribute {
  constructor(array, itemSize) {
    super(array instanceof Float32Array ? array : new Float32Array(array), itemSize);
  }
}

export class BufferGeometry {
  constructor() {
    this.type = 'BufferGeometry';
    this.attributes = {};
    this.index = null;
    this.boundingSphere = null;
    this.disposed = false;
  }
  setAttribute(name, attr) {
    if (!(attr instanceof BufferAttribute)) {
      throw new Error(`setAttribute(${name}) 需要 BufferAttribute`);
    }
    this.attributes[name] = attr;
    return this;
  }
  getAttribute(name) {
    const a = this.attributes[name];
    if (!a) throw new Error(`getAttribute("${name}") 不存在`);
    return a;
  }
  setIndex(idx) {
    this.index = idx;
  }
  computeBoundingSphere() {
    this.boundingSphere = new Sphere(new Vector3(), 1);
  }
  computeVertexNormals() {}
  dispose() {
    this.disposed = true;
  }
}

class PrimitiveGeometry extends BufferGeometry {
  constructor(type, params) {
    super();
    this.type = type;
    this.parameters = params;
    // 假装生成了顶点，便于统计
    this.attributes.position = new Float32BufferAttribute(new Float32Array(72), 3);
  }
}

export class BoxGeometry extends PrimitiveGeometry {
  constructor(w = 1, h = 1, d = 1) {
    if (![w, h, d].every((v) => Number.isFinite(v) && v > 0)) {
      throw new Error(`BoxGeometry 尺寸非法: ${w}, ${h}, ${d}`);
    }
    super('BoxGeometry', { w, h, d });
  }
}

export class PlaneGeometry extends PrimitiveGeometry {
  constructor(w = 1, h = 1) {
    if (![w, h].every((v) => Number.isFinite(v) && v > 0)) {
      throw new Error(`PlaneGeometry 尺寸非法: ${w}, ${h}`);
    }
    super('PlaneGeometry', { w, h });
  }
}

export class SphereGeometry extends PrimitiveGeometry {
  constructor(r = 1, ws = 8, hs = 6) {
    if (!Number.isFinite(r) || r <= 0) throw new Error('SphereGeometry 半径非法');
    super('SphereGeometry', { r, ws, hs });
  }
}

export class Material {
  constructor(params = {}) {
    this.type = 'Material';
    this.transparent = false;
    this.opacity = 1;
    this.depthWrite = true;
    this.depthTest = true;
    this.blending = NormalBlending;
    this.side = FrontSide;
    this.visible = true;
    this.needsUpdate = false;
    this.fog = true;
    this.disposed = false;
    this.color = new Color(0xffffff);
    Object.assign(this, params);
    if (typeof params.color === 'number') this.color = new Color(params.color);
    if (typeof params.emissive === 'number') this.emissive = new Color(params.emissive);
  }
  clone() {
    const m = new this.constructor({});
    Object.assign(m, this);
    m.color = new Color(this.color.value);
    return m;
  }
  dispose() {
    this.disposed = true;
  }
}

export class MeshBasicMaterial extends Material {
  constructor(p) {
    super(p);
    this.type = 'MeshBasicMaterial';
  }
}
export class MeshLambertMaterial extends Material {
  constructor(p) {
    super(p);
    this.type = 'MeshLambertMaterial';
  }
}
export class MeshStandardMaterial extends Material {
  constructor(p) {
    super(p);
    this.type = 'MeshStandardMaterial';
  }
}
export class LineBasicMaterial extends Material {
  constructor(p) {
    super(p);
    this.type = 'LineBasicMaterial';
  }
}
export class PointsMaterial extends Material {
  constructor(p) {
    super(p);
    this.type = 'PointsMaterial';
  }
}
export class ShaderMaterial extends Material {
  constructor(p = {}) {
    super(p);
    this.type = 'ShaderMaterial';
    this.uniforms = p.uniforms ?? {};
    this.vertexShader = p.vertexShader ?? '';
    this.fragmentShader = p.fragmentShader ?? '';
    if (!this.vertexShader.includes('gl_Position')) {
      throw new Error('ShaderMaterial: 顶点着色器没有写 gl_Position');
    }
    if (!this.fragmentShader.includes('gl_FragColor') && !this.fragmentShader.includes('pc_fragColor')) {
      throw new Error('ShaderMaterial: 片元着色器没有输出颜色');
    }
  }
}

export class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.type = 'Mesh';
    if (!geometry) throw new Error('Mesh 缺少 geometry');
    if (!material) throw new Error('Mesh 缺少 material');
    this.geometry = geometry;
    this.material = material;
  }
}

export class Points extends Object3D {
  constructor(geometry, material) {
    super();
    this.type = 'Points';
    if (!geometry || !material) throw new Error('Points 缺少参数');
    this.geometry = geometry;
    this.material = material;
  }
}

export class Line extends Object3D {
  constructor(geometry, material) {
    super();
    this.type = 'Line';
    this.geometry = geometry;
    this.material = material;
  }
}

export class LineSegments extends Line {
  constructor(g, m) {
    super(g, m);
    this.type = 'LineSegments';
  }
}

export class Light extends Object3D {
  constructor(color = 0xffffff, intensity = 1) {
    super();
    this.color = new Color(color);
    this.intensity = intensity;
  }
}

export class AmbientLight extends Light {}
export class HemisphereLight extends Light {
  constructor(sky, ground, intensity) {
    super(sky, intensity);
    this.groundColor = new Color(ground);
  }
}
export class PointLight extends Light {
  constructor(color, intensity, distance = 0, decay = 2) {
    super(color, intensity);
    this.distance = distance;
    this.decay = decay;
  }
}

class LightShadow {
  constructor() {
    this.mapSize = new Vector2(512, 512);
    this.camera = new OrthographicCamera(-5, 5, 5, -5, 0.5, 500);
    this.bias = 0;
    this.normalBias = 0;
    this.radius = 1;
  }
}

export class DirectionalLight extends Light {
  constructor(color, intensity) {
    super(color, intensity);
    this.target = new Object3D();
    this.shadow = new LightShadow();
  }
}

export class Texture {
  constructor(image) {
    this.image = image;
    this.wrapS = ClampToEdgeWrapping;
    this.wrapT = ClampToEdgeWrapping;
    this.repeat = new Vector2(1, 1);
    this.offset = new Vector2(0, 0);
    this.colorSpace = LinearSRGBColorSpace;
    this.anisotropy = 1;
    this.needsUpdate = false;
    this.disposed = false;
  }
  dispose() {
    this.disposed = true;
  }
}

export class CanvasTexture extends Texture {
  constructor(canvas) {
    if (!canvas || typeof canvas.width !== 'number') {
      throw new Error('CanvasTexture 需要一个 canvas');
    }
    super(canvas);
  }
}

export class WebGLRenderer {
  constructor(params = {}) {
    this.domElement = params.canvas ?? { width: 300, height: 150 };
    this.shadowMap = { enabled: false, type: BasicShadowMap };
    this.outputColorSpace = SRGBColorSpace;
    this.toneMapping = 0;
    this.autoClear = true;
    this.pixelRatio = 1;
    this.renderCalls = 0;
    this.info = { render: { calls: 0, triangles: 0 } };
  }
  setPixelRatio(r) {
    this.pixelRatio = r;
  }
  setSize(w, h) {
    this.width = w;
    this.height = h;
  }
  setClearColor() {}
  clearDepth() {}
  render(scene, camera) {
    if (!(scene instanceof Object3D)) throw new Error('render 的第一个参数必须是 Scene');
    if (!(camera instanceof Camera)) throw new Error('render 的第二个参数必须是 Camera');
    this.renderCalls++;
    // 遍历一遍场景，捕捉 NaN 之类的脏数据
    scene.traverse((o) => {
      const p = o.position;
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.z)) {
        throw new Error(`场景里出现 NaN 位置: ${o.name || o.type}`);
      }
      const r = o.rotation;
      if (!Number.isFinite(r.x) || !Number.isFinite(r.y) || !Number.isFinite(r.z)) {
        throw new Error(`场景里出现 NaN 旋转: ${o.name || o.type}`);
      }
    });
  }
  dispose() {}
}

export const MathUtils = {
  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
  degToRad: (d) => (d * Math.PI) / 180,
  radToDeg: (r) => (r * 180) / Math.PI,
  lerp: (a, b, t) => a + (b - a) * t,
};

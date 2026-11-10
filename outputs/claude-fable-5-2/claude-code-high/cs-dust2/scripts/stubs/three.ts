// Test double for three.js used by scripts/smoke.ts. Every export is a "black hole" object that
// accepts any property access, call or construction, remembers assigned values, and coerces to 0.
// It only lists the exports the game really uses, so a typo in an export name fails loudly.

type Any = any; // eslint-disable-line @typescript-eslint/no-explicit-any

function hole(name: string): Any {
  const store = new Map<PropertyKey, Any>();
  const target = function () {} as Any;
  return new Proxy(target, {
    get(_t, key) {
      if (key === Symbol.toPrimitive) return () => 0;
      if (key === 'then') return undefined; // never look like a promise
      if (key === Symbol.iterator) return undefined;
      if (store.has(key)) return store.get(key);
      const child = hole(`${name}.${String(key)}`);
      store.set(key, child);
      return child;
    },
    set(_t, key, value) {
      store.set(key, value);
      return true;
    },
    has() {
      return true;
    },
    apply() {
      return hole(`${name}()`);
    },
    construct() {
      return hole(`new ${name}`);
    },
  });
}

export const Scene = hole('Scene');
export const PerspectiveCamera = hole('PerspectiveCamera');
export const WebGLRenderer = hole('WebGLRenderer');
export const Group = hole('Group');
export const Mesh = hole('Mesh');
export const InstancedMesh = hole('InstancedMesh');
export const Points = hole('Points');
export const Sprite = hole('Sprite');
export const BoxGeometry = hole('BoxGeometry');
export const CylinderGeometry = hole('CylinderGeometry');
export const SphereGeometry = hole('SphereGeometry');
export const PlaneGeometry = hole('PlaneGeometry');
export const ExtrudeGeometry = hole('ExtrudeGeometry');
export const BufferGeometry = hole('BufferGeometry');
export const BufferAttribute = hole('BufferAttribute');
export const Shape = hole('Shape');
export const MeshStandardMaterial = hole('MeshStandardMaterial');
export const MeshLambertMaterial = hole('MeshLambertMaterial');
export const MeshBasicMaterial = hole('MeshBasicMaterial');
export const MeshPhongMaterial = hole('MeshPhongMaterial');
export const PointsMaterial = hole('PointsMaterial');
export const SpriteMaterial = hole('SpriteMaterial');
export const CanvasTexture = hole('CanvasTexture');
export const Vector3 = hole('Vector3');
export const Euler = hole('Euler');
export const Matrix4 = hole('Matrix4');
export const Color = hole('Color');
export const Fog = hole('Fog');
export const HemisphereLight = hole('HemisphereLight');
export const DirectionalLight = hole('DirectionalLight');
export const AmbientLight = hole('AmbientLight');
export const PointLight = hole('PointLight');
export const SRGBColorSpace = 'srgb';
export const RepeatWrapping = 1000;
export const EquirectangularReflectionMapping = 303;
export const AdditiveBlending = 2;
export const DoubleSide = 2;
export const PCFSoftShadowMap = 2;

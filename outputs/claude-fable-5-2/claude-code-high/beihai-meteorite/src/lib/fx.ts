import * as THREE from "three";

/** Procedural glow sprite and cube particle helpers. Everything is generated in code. */

let glowTex: THREE.DataTexture | null = null;
let ringTex: THREE.DataTexture | null = null;

function radialTexture(size: number, alphaAt: (r: number) => number): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x + 0.5) / size * 2 - 1, dy = (y + 0.5) / size * 2 - 1;
      const r = Math.sqrt(dx * dx + dy * dy);
      const a = Math.max(0, Math.min(1, alphaAt(r)));
      const i = (y * size + x) * 4;
      data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
      data[i + 3] = Math.round(a * 255);
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

export function glowTexture(): THREE.DataTexture {
  if (!glowTex) glowTex = radialTexture(64, (r) => Math.pow(Math.max(0, 1 - r), 2.4));
  return glowTex;
}

/** A thin halo that peaks near the rim: used for the atmosphere limb. */
export function ringTexture(): THREE.DataTexture {
  if (!ringTex) {
    ringTex = radialTexture(256, (r) => {
      const edge = 0.9;
      if (r < edge) return Math.pow(Math.max(0, (r - 0.72) / (edge - 0.72)), 3) * 0.55;
      return Math.pow(Math.max(0, 1 - (r - edge) / (1 - edge)), 2.2) * 0.9;
    });
  }
  return ringTex;
}

export function makeGlow(colour: number, size: number, opacity = 1, depthTest = true): THREE.Sprite {
  const material = new THREE.SpriteMaterial({
    map: glowTexture(),
    color: colour,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest,
    fog: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(size, size, 1);
  return sprite;
}

const _dummy = new THREE.Object3D();
const _colour = new THREE.Color();

/**
 * Cube particles drawn as one instanced mesh. Each frame is rebuilt from pure
 * functions of time (begin → put… → end), so seeking never desynchronises it.
 */
export class CubeFX {
  readonly mesh: THREE.InstancedMesh;
  private n = 0;

  constructor(
    readonly capacity: number,
    options: { additive?: boolean; opacity?: number; lit?: boolean; depthWrite?: boolean } = {},
  ) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = options.lit
      ? new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0, transparent: (options.opacity ?? 1) < 1, opacity: options.opacity ?? 1 })
      : new THREE.MeshBasicMaterial({
          transparent: options.additive || (options.opacity ?? 1) < 1,
          opacity: options.opacity ?? 1,
          blending: options.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
          depthWrite: options.depthWrite ?? !(options.additive || (options.opacity ?? 1) < 1),
          fog: false,
        });
    this.mesh = new THREE.InstancedMesh(geometry, material, capacity);
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // Allocate instance colours up front so the shader variant never changes.
    this.mesh.setColorAt(0, _colour.setHex(0xffffff));
  }

  begin(): this {
    this.n = 0;
    return this;
  }

  put(x: number, y: number, z: number, size: number, colour: number, spin = 0, intensity = 1): this {
    if (this.n >= this.capacity || size <= 0) return this;
    _dummy.position.set(x, y, z);
    _dummy.rotation.set(spin, spin * 1.3, spin * 0.7);
    _dummy.scale.setScalar(size);
    _dummy.updateMatrix();
    this.mesh.setMatrixAt(this.n, _dummy.matrix);
    _colour.setHex(colour);
    if (intensity !== 1) _colour.multiplyScalar(intensity);
    this.mesh.setColorAt(this.n, _colour);
    this.n++;
    return this;
  }

  end(): this {
    this.mesh.count = this.n;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    this.mesh.visible = this.n > 0;
    return this;
  }
}

import * as THREE from "three";
import { mulberry32, starTexture } from "./util";

/* Per-particle attributes: position / color / size / alpha, driven purely by
 * absolute time so seeking always lands on the same frame. */

const VERT = /* glsl */ `
attribute float size;
attribute float alpha;
attribute vec3 color;
varying float vAlpha;
varying vec3 vColor;
void main() {
  vAlpha = alpha;
  vColor = color;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (320.0 / max(0.1, -mv.z));
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
uniform sampler2D map;
uniform float additive;
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec4 t = texture2D(map, gl_PointCoord);
  vec3 c = vColor * t.rgb;
  float a = t.a * vAlpha;
  if (additive > 0.5) {
    gl_FragColor = vec4(c * a, a);
  } else {
    gl_FragColor = vec4(c, a);
  }
}
`;

export interface PuffEvent {
  t: number;
  pos: [number, number, number];
  dir: [number, number, number]; // mean direction, normalized inside
  count: number;
  speed: number;
  spread: number; // cone half-angle
  life: number;
  size: number; // world size
  color: [number, number, number];
  colorB?: [number, number, number]; // optional end colour
  additive?: boolean;
  gravity?: number;
  grow?: number; // size multiplier over life
  seed?: number;
  drag?: number; // 0..1 velocity retention per second
}

interface Particle {
  p: THREE.Vector3;
  v: THREE.Vector3;
  born: number;
  life: number;
  size: number;
  grow: number;
  cA: THREE.Color;
  cB: THREE.Color;
  grav: number;
  drag: number;
}

export class PuffSystem {
  readonly points: THREE.Points;
  private readonly geometry: THREE.BufferGeometry;
  private readonly material: THREE.ShaderMaterial;
  private readonly particles: Particle[] = [];
  private readonly positionAttr: THREE.BufferAttribute;
  private readonly sizeAttr: THREE.BufferAttribute;
  private readonly alphaAttr: THREE.BufferAttribute;
  private readonly colorAttr: THREE.BufferAttribute;
  readonly events: PuffEvent[] = [];
  private built = false;
  private dirty = true;

  constructor(public readonly maxParticles: number, additive = false, public baseOpacity = 1) {
    this.geometry = new THREE.BufferGeometry();
    this.positionAttr = new THREE.BufferAttribute(new Float32Array(maxParticles * 3), 3);
    this.sizeAttr = new THREE.BufferAttribute(new Float32Array(maxParticles), 1);
    this.alphaAttr = new THREE.BufferAttribute(new Float32Array(maxParticles), 1);
    this.colorAttr = new THREE.BufferAttribute(new Float32Array(maxParticles * 3), 3);
    this.positionAttr.setUsage(THREE.DynamicDrawUsage);
    this.sizeAttr.setUsage(THREE.DynamicDrawUsage);
    this.alphaAttr.setUsage(THREE.DynamicDrawUsage);
    this.colorAttr.setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute("position", this.positionAttr);
    this.geometry.setAttribute("size", this.sizeAttr);
    this.geometry.setAttribute("alpha", this.alphaAttr);
    this.geometry.setAttribute("color", this.colorAttr);
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { map: { value: starTexture() }, additive: { value: additive ? 1 : 0 } },
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
  }

  addEvent(e: PuffEvent): this {
    this.events.push(e);
    this.built = false;
    return this;
  }

  private build(): void {
    if (this.built) return;
    this.built = true;
    this.particles.length = 0;
    for (const e of this.events) {
      const rng = mulberry32(e.seed ?? Math.floor(e.t * 1000) + 17);
      for (let i = 0; i < e.count; i++) {
        if (this.particles.length >= this.maxParticles) break;
        const dir = new THREE.Vector3(...e.dir).normalize();
        const axis = new THREE.Vector3(
          Math.abs(dir.y) < 0.9 ? 0 : 1,
          Math.abs(dir.x) < 0.9 ? 1 : 0,
          0,
        ).normalize();
        const orth = new THREE.Vector3().crossVectors(dir, axis).normalize();
        const orth2 = new THREE.Vector3().crossVectors(dir, orth);
        const cone = Math.asin(Math.min(1, e.spread)) ;
        const u = rng() * 2 - 1;
        const phi = rng() * Math.PI * 2;
        const r = Math.sin(cone * Math.sqrt((1 + u) / 2));
        const v = dir.clone()
          .addScaledVector(orth, r * Math.cos(phi))
          .addScaledVector(orth2, r * Math.sin(phi))
          .normalize();
        const speed = e.speed * (0.5 + rng() * 0.7);
        this.particles.push({
          p: new THREE.Vector3(...e.pos),
          v: v.multiplyScalar(speed),
          born: e.t + rng() * 0.06,
          life: e.life * (0.7 + rng() * 0.6),
          size: e.size * (0.6 + rng() * 0.8),
          grow: e.grow ?? 1,
          cA: new THREE.Color(...e.color),
          cB: e.colorB ? new THREE.Color(...e.colorB) : new THREE.Color(...e.color),
          grav: e.gravity ?? 0,
          drag: e.drag ?? 0.9,
        });
      }
    }
  }

  update(t: number): void {
    this.build();
    const pos = this.positionAttr.array as Float32Array;
    const size = this.sizeAttr.array as Float32Array;
    const alpha = this.alphaAttr.array as Float32Array;
    const color = this.colorAttr.array as Float32Array;
    const c = new THREE.Color();
    let n = 0;
    for (const p of this.particles) {
      const age = t - p.born;
      if (age < 0) {
        // hide
        pos[n * 3] = 0; pos[n * 3 + 1] = -99999; pos[n * 3 + 2] = 0;
        size[n] = 0; alpha[n] = 0;
        n++;
        continue;
      }
      if (age > p.life) {
        pos[n * 3] = 0; pos[n * 3 + 1] = -99999; pos[n * 3 + 2] = 0;
        size[n] = 0; alpha[n] = 0;
        n++;
        continue;
      }
      // analytic: x(t) = p + v*(1-drag^t)/(1-drag) - 0.5*g*t^2 (drag in [0,1))
      const dragK = Math.pow(p.drag, Math.min(age, 1.5));
      const damp = p.drag >= 1 ? age : (1 - dragK) / Math.max(1e-6, 1 - p.drag);
      const gx = 0, gy = -p.grav * age * age * 0.5, gz = 0;
      pos[n * 3] = p.p.x + p.v.x * damp + gx;
      pos[n * 3 + 1] = p.p.y + p.v.y * damp + gy;
      pos[n * 3 + 2] = p.p.z + p.v.z * damp + gz;
      const k = age / p.life;
      size[n] = p.size * (1 + (p.grow - 1) * k);
      alpha[n] = this.baseOpacity * (1 - k);
      c.lerpColors(p.cA, p.cB, k);
      color[n * 3] = c.r; color[n * 3 + 1] = c.g; color[n * 3 + 2] = c.b;
      n++;
    }
    this.positionAttr.needsUpdate = true;
    this.sizeAttr.needsUpdate = true;
    this.alphaAttr.needsUpdate = true;
    this.colorAttr.needsUpdate = true;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

/* ------------------------------------------------------------------ */
/* dust motes for interior light shafts                                */
/* ------------------------------------------------------------------ */

export class DustField {
  readonly points: THREE.Points;
  private readonly base: Float32Array;

  constructor(
    count: number,
    center: [number, number, number],
    extents: [number, number, number],
    seed = 3,
  ) {
    const rng = mulberry32(seed);
    this.base = new Float32Array(count * 3);
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      this.base[i * 3] = center[0] + (rng() - 0.5) * extents[0];
      this.base[i * 3 + 1] = center[1] + (rng() - 0.5) * extents[1];
      this.base[i * 3 + 2] = center[2] + (rng() - 0.5) * extents[2];
      pos[i * 3] = this.base[i * 3];
      pos[i * 3 + 1] = this.base[i * 3 + 1];
      pos[i * 3 + 2] = this.base[i * 3 + 2];
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({
      size: 0.02,
      map: starTexture("rgba(255,244,214,1)"),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xffe8c0,
    });
    this.points = new THREE.Points(g, m);
    this.points.frustumCulled = false;
  }

  update(t: number): void {
    const attr = this.points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      const j = i / 3;
      arr[i] = this.base[i] + Math.sin(t * 0.22 + j * 1.7) * 0.12;
      arr[i + 1] = this.base[i + 1] + ((t * 0.02 + j * 0.13) % 1) * 0.9;
      arr[i + 2] = this.base[i + 2] + Math.cos(t * 0.18 + j * 2.3) * 0.12;
    }
    attr.needsUpdate = true;
  }
}

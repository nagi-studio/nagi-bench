import * as THREE from "three";
import { dotTexture } from "../lib/textures";
import type { FxBus } from "./types";

/**
 * Small, pooled effects rig: sparks from the lathe, smoke and debris from the
 * basement, muzzle flashes, embers from the fusion plume. Everything is
 * procedural and pooled so the film can fire effects at any time without
 * allocating in the frame loop.
 */

const VERT = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (260.0 / max(0.001, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec4 t = texture2D(uMap, gl_PointCoord);
    if (t.a * vAlpha < 0.01) discard;
    gl_FragColor = vec4(vColor, t.a * vAlpha);
  }
`;

interface P {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; max: number; size: number;
  r: number; g: number; b: number;
  drag: number; grav: number;
}

class ParticlePool {
  readonly points: THREE.Points;
  private list: P[] = [];
  private capacity: number;
  private geo: THREE.BufferGeometry;
  private pos: Float32Array;
  private size: Float32Array;
  private alpha: Float32Array;
  private col: Float32Array;
  private mat: THREE.ShaderMaterial;
  private blend: THREE.Blending;

  constructor(capacity: number, blend: THREE.Blending, map: THREE.Texture) {
    this.capacity = capacity;
    this.blend = blend;
    this.pos = new Float32Array(capacity * 3);
    this.size = new Float32Array(capacity);
    this.alpha = new Float32Array(capacity);
    this.col = new Float32Array(capacity * 3);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    this.geo.setAttribute("aSize", new THREE.BufferAttribute(this.size, 1));
    this.geo.setAttribute("aAlpha", new THREE.BufferAttribute(this.alpha, 1));
    this.geo.setAttribute("aColor", new THREE.BufferAttribute(this.col, 3));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: map } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: blend
    });
    this.points = new THREE.Points(this.geo, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 12;
    for (let i = 0; i < capacity; i++) {
      this.alpha[i] = 0;
      this.pos[i * 3 + 1] = -9999;
    }
  }

  spawn(p: P): void {
    if (this.list.length >= this.capacity) {
      // recycle the oldest
      this.list.shift();
    }
    this.list.push(p);
  }

  update(dt: number): void {
    const list = this.list;
    let n = 0;
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      p.life += dt;
      if (p.life >= p.max) continue;
      p.vy += p.grav * dt;
      const d = Math.exp(-p.drag * dt);
      p.vx *= d; p.vy *= d; p.vz *= d;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      const u = p.life / p.max;
      const a = 1 - u;
      const idx = n;
      this.pos[idx * 3] = p.x;
      this.pos[idx * 3 + 1] = p.y;
      this.pos[idx * 3 + 2] = p.z;
      this.size[idx] = p.size * (0.6 + 0.4 * (1 - u));
      this.alpha[idx] = a * a;
      this.col[idx * 3] = p.r;
      this.col[idx * 3 + 1] = p.g;
      this.col[idx * 3 + 2] = p.b;
      list[n] = p;
      n++;
    }
    list.length = n;
    for (let i = n; i < this.capacity; i++) {
      this.alpha[i] = 0;
      this.pos[i * 3 + 1] = -9999;
    }
    (this.geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.geo.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;
    (this.geo.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    (this.geo.attributes.aColor as THREE.BufferAttribute).needsUpdate = true;
  }
}

interface D {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  rx: number; ry: number; rz: number;
  wx: number; wy: number; wz: number;
  life: number; max: number; s: number;
}

class DebrisPool {
  readonly mesh: THREE.InstancedMesh;
  private list: D[] = [];
  private cap: number;
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private e = new THREE.Euler();
  private v = new THREE.Vector3();
  private sc = new THREE.Vector3();
  private color: THREE.Color;

  constructor(cap: number, color = 0x2a2420) {
    this.cap = cap;
    const g = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.6 });
    this.color = new THREE.Color(color);
    this.mesh = new THREE.InstancedMesh(g, mat, cap);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.castShadow = false;
    for (let i = 0; i < cap; i++) {
      this.m.makeScale(0, 0, 0);
      this.mesh.setMatrixAt(i, this.m);
    }
  }

  spawn(p: D): void {
    if (this.list.length >= this.cap) this.list.shift();
    this.list.push(p);
  }

  update(dt: number): void {
    const list = this.list;
    let n = 0;
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      p.life += dt;
      if (p.life >= p.max) continue;
      p.vy -= 9.8 * dt;
      p.vx *= 1 - 0.6 * dt;
      p.vz *= 1 - 0.6 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      if (p.y < 0.02) {
        p.y = 0.02;
        p.vy *= -0.32;
        p.vx *= 0.7;
        p.vz *= 0.7;
        p.wx *= 0.5; p.wy *= 0.5; p.wz *= 0.5;
      }
      p.rx += p.wx * dt; p.ry += p.wy * dt; p.rz += p.wz * dt;
      this.e.set(p.rx, p.ry, p.rz);
      this.q.setFromEuler(this.e);
      this.v.set(p.x, p.y, p.z);
      const s = p.s * (1 - Math.max(0, (p.life - p.max * 0.8) / (p.max * 0.2)) * 0.9);
      this.sc.set(s, s, s);
      this.m.compose(this.v, this.q, this.sc);
      this.mesh.setMatrixAt(n, this.m);
      list[n] = p;
      n++;
    }
    list.length = n;
    for (let i = n; i < this.cap; i++) {
      this.m.makeScale(0, 0, 0);
      this.mesh.setMatrixAt(i, this.m);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}

export class Effects implements FxBus {
  readonly root = new THREE.Group();
  private sparks: ParticlePool;
  private smokePool: ParticlePool;
  private debrisPool: DebrisPool;
  private lights: THREE.PointLight[] = [];
  private lightLife: number[] = [];
  private lightMax: number[] = [];
  private lightBase: number[] = [];
  private rng = Math.random;

  constructor() {
    this.root.name = "fx";
    const dot = dotTexture();
    this.sparks = new ParticlePool(900, THREE.AdditiveBlending, dot);
    this.smokePool = new ParticlePool(500, THREE.NormalBlending, dot);
    this.debrisPool = new DebrisPool(220, 0x2b2521);
    this.root.add(this.sparks.points, this.smokePool.points, this.debrisPool.mesh);
    for (let i = 0; i < 6; i++) {
      const l = new THREE.PointLight(0xffffff, 0, 14, 2);
      l.visible = false;
      this.lights.push(l);
      this.lightLife.push(0);
      this.lightMax.push(1);
      this.lightBase.push(0);
      this.root.add(l);
    }
  }

  private freeLight(): number {
    let best = 0;
    let bestV = Infinity;
    for (let i = 0; i < this.lights.length; i++) {
      const v = this.lights[i].intensity;
      if (v < bestV) {
        bestV = v;
        best = i;
      }
    }
    return best;
  }

  sparkBurst(pos: THREE.Vector3, count = 40, color = 0xffc27a, speed = 2.2): void {
    const c = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const a = this.rng() * Math.PI * 2;
      const el = this.rng() * 0.9;
      const sp = speed * (0.35 + this.rng() * 0.9);
      this.sparks.spawn({
        x: pos.x, y: pos.y, z: pos.z,
        vx: Math.cos(a) * Math.cos(el) * sp,
        vy: Math.sin(el) * sp + 0.6,
        vz: Math.sin(a) * Math.cos(el) * sp,
        life: 0, max: 0.5 + this.rng() * 0.8,
        size: 0.04 + this.rng() * 0.05,
        r: c.r, g: c.g, b: c.b,
        drag: 1.1, grav: -6
      });
    }
  }

  smoke(pos: THREE.Vector3, count = 14, color = 0x8b8f95, speed = 0.5): void {
    const c = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const a = this.rng() * Math.PI * 2;
      const sp = speed * this.rng();
      this.smokePool.spawn({
        x: pos.x + (this.rng() - 0.5) * 0.2,
        y: pos.y + (this.rng() - 0.5) * 0.2,
        z: pos.z + (this.rng() - 0.5) * 0.2,
        vx: Math.cos(a) * sp, vy: 0.18 + this.rng() * 0.25, vz: Math.sin(a) * sp,
        life: 0, max: 2.4 + this.rng() * 2.2,
        size: 0.5 + this.rng() * 0.9,
        r: c.r, g: c.g, b: c.b,
        drag: 0.55, grav: 0.04
      });
    }
  }

  flash(pos: THREE.Vector3, color = 0xffffff, intensity = 40, decay = 6): void {
    const i = this.freeLight();
    const l = this.lights[i];
    l.position.copy(pos);
    l.color.set(color);
    l.intensity = intensity;
    l.visible = true;
    this.lightLife[i] = 0;
    this.lightMax[i] = 1 / decay;
    this.lightBase[i] = intensity;
  }

  debris(pos: THREE.Vector3, count = 14, color = 0x2b2521, speed = 2): void {
    for (let i = 0; i < count; i++) {
      const a = this.rng() * Math.PI * 2;
      const el = this.rng() * 1.2;
      const sp = speed * (0.4 + this.rng());
      this.debrisPool.spawn({
        x: pos.x, y: pos.y, z: pos.z,
        vx: Math.cos(a) * Math.cos(el) * sp,
        vy: Math.sin(el) * sp + 1,
        vz: Math.sin(a) * Math.cos(el) * sp,
        rx: this.rng() * 3, ry: this.rng() * 3, rz: this.rng() * 3,
        wx: (this.rng() - 0.5) * 18, wy: (this.rng() - 0.5) * 18, wz: (this.rng() - 0.5) * 18,
        life: 0, max: 1.6 + this.rng() * 1.6,
        s: 0.5 + this.rng() * 1.3
      });
    }
  }

  update(time: number, dt: number): void {
    this.sparks.update(dt);
    this.smokePool.update(dt);
    this.debrisPool.update(dt);
    for (let i = 0; i < this.lights.length; i++) {
      const l = this.lights[i];
      if (!l.visible) continue;
      this.lightLife[i] += dt;
      const u = this.lightLife[i] / this.lightMax[i];
      if (u >= 1) {
        l.visible = false;
        l.intensity = 0;
        continue;
      }
      l.intensity = this.lightBase[i] * Math.pow(1 - u, 2.2);
    }
  }
}

/** Animated fusion plume: stacked, pulsing, additive cones. */
export class FlamePlume extends THREE.Group {
  private plumeLayers: THREE.Mesh[] = [];
  private inner: THREE.Mesh;
  private light: THREE.PointLight;
  private seed = Math.random() * 10;
  power = 0;

  constructor(height = 9, radius = 1.6) {
    super();
    const defs = [
      { r: radius * 1.05, h: height, c: 0x2f7fe0, o: 0.32 },
      { r: radius * 0.72, h: height * 0.86, c: 0x66b8ff, o: 0.4 },
      { r: radius * 0.42, h: height * 0.66, c: 0xbfe6ff, o: 0.55 }
    ];
    for (const d of defs) {
      const g = new THREE.ConeGeometry(d.r, d.h, 12, 1, true);
      const m = new THREE.MeshBasicMaterial({
        color: d.c,
        transparent: true,
        opacity: d.o,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.y = -d.h / 2;
      mesh.renderOrder = 10;
      this.add(mesh);
      this.plumeLayers.push(mesh);
    }
    const ig = new THREE.ConeGeometry(radius * 0.2, height * 0.42, 10, 1, true);
    this.inner = new THREE.Mesh(
      ig,
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    this.inner.position.y = -height * 0.21;
    this.inner.renderOrder = 11;
    this.add(this.inner);
    this.light = new THREE.PointLight(0x5aa8ff, 0, radius * 14, 2);
    this.add(this.light);
  }

  setPower(p: number): void {
    this.power = p;
    this.visible = p > 0.001;
    this.light.intensity = p * 1400;
  }

  tick(time: number): void {
    for (let i = 0; i < this.plumeLayers.length; i++) {
      const m = this.plumeLayers[i];
      const s = 1 + Math.sin(time * (7 + i * 2.3) + this.seed) * 0.06 + Math.sin(time * 19 + i) * 0.02;
      m.scale.set(s, 1 + Math.sin(time * (5 + i) + this.seed) * 0.05, s);
      (m.material as THREE.MeshBasicMaterial).opacity = (0.32 - i * 0.06) * (0.85 + Math.sin(time * 13 + i * 2) * 0.15);
    }
    const is = 1 + Math.sin(time * 31) * 0.08;
    this.inner.scale.set(is, 1 + Math.sin(time * 23) * 0.1, is);
  }
}

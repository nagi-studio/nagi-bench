/**
 * 特效池：曳光弹、弹着火花/尘土、血雾、弹孔、枪口闪光、爆炸。
 * 全部预分配 + 复用，运行时不产生 GC 压力。
 */

import * as THREE from 'three';
import type { SurfaceKind } from '../map/dust2.ts';
import { softDotTexture, sparkTexture } from './textures.ts';

/* -------------------------------------------------------------------------- */
/* 粒子                                                                        */
/* -------------------------------------------------------------------------- */

const PARTICLE_VS = `
attribute float aSize;
attribute float aAlpha;
attribute vec3 aColor;
varying float vAlpha;
varying vec3 vColor;
void main() {
  vAlpha = aAlpha;
  vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (420.0 / max(0.1, -mv.z));
  gl_Position = projectionMatrix * mv;
}
`;

const PARTICLE_FS = `
uniform sampler2D uMap;
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec4 tex = texture2D(uMap, gl_PointCoord);
  float a = tex.a * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor * tex.rgb, a);
}
`;

export class ParticleSystem {
  readonly points: THREE.Points;
  private capacity: number;
  private pos: Float32Array;
  private col: Float32Array;
  private size: Float32Array;
  private alpha: Float32Array;
  private vel: Float32Array;
  private life: Float32Array;
  private maxLife: Float32Array;
  private grav: Float32Array;
  private drag: Float32Array;
  private startSize: Float32Array;
  private cursor = 0;
  private geo: THREE.BufferGeometry;

  constructor(capacity: number, map: THREE.Texture, additive: boolean) {
    this.capacity = capacity;
    this.pos = new Float32Array(capacity * 3);
    this.col = new Float32Array(capacity * 3);
    this.size = new Float32Array(capacity);
    this.alpha = new Float32Array(capacity);
    this.vel = new Float32Array(capacity * 3);
    this.life = new Float32Array(capacity);
    this.maxLife = new Float32Array(capacity);
    this.grav = new Float32Array(capacity);
    this.drag = new Float32Array(capacity);
    this.startSize = new Float32Array(capacity);
    // 初始全部置于视野外
    for (let i = 0; i < capacity; i++) this.pos[i * 3 + 1] = -9999;

    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.geo.setAttribute('aColor', new THREE.BufferAttribute(this.col, 3));
    this.geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    this.geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alpha, 1));
    this.geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e5);

    const mat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: map } },
      vertexShader: PARTICLE_VS,
      fragmentShader: PARTICLE_FS,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(this.geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 3;
  }

  spawn(
    x: number, y: number, z: number,
    vx: number, vy: number, vz: number,
    life: number,
    size: number,
    r: number, g: number, b: number,
    gravity = 0,
    drag = 1.5,
  ): void {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.capacity;
    this.pos[i * 3] = x;
    this.pos[i * 3 + 1] = y;
    this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx;
    this.vel[i * 3 + 1] = vy;
    this.vel[i * 3 + 2] = vz;
    this.col[i * 3] = r;
    this.col[i * 3 + 1] = g;
    this.col[i * 3 + 2] = b;
    this.life[i] = life;
    this.maxLife[i] = life;
    this.size[i] = size;
    this.startSize[i] = size;
    this.alpha[i] = 1;
    this.grav[i] = gravity;
    this.drag[i] = drag;
  }

  update(dt: number): void {
    let any = false;
    for (let i = 0; i < this.capacity; i++) {
      if (this.life[i] <= 0) continue;
      any = true;
      this.life[i] -= dt;
      if (this.life[i] <= 0) {
        this.alpha[i] = 0;
        this.pos[i * 3 + 1] = -9999;
        continue;
      }
      const k = this.life[i] / this.maxLife[i];
      const d = Math.max(0, 1 - this.drag[i] * dt);
      this.vel[i * 3] *= d;
      this.vel[i * 3 + 1] = this.vel[i * 3 + 1] * d - this.grav[i] * dt;
      this.vel[i * 3 + 2] *= d;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      this.alpha[i] = k * k;
      this.size[i] = this.startSize[i] * (0.45 + 0.55 * k);
    }
    if (any) {
      (this.geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
      (this.geo.getAttribute('aColor') as THREE.BufferAttribute).needsUpdate = true;
      (this.geo.getAttribute('aSize') as THREE.BufferAttribute).needsUpdate = true;
      (this.geo.getAttribute('aAlpha') as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  dispose(): void {
    this.geo.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}

/* -------------------------------------------------------------------------- */
/* 曳光弹                                                                      */
/* -------------------------------------------------------------------------- */

interface Tracer {
  life: number;
  maxLife: number;
}

export class TracerPool {
  readonly object: THREE.LineSegments;
  private capacity: number;
  private pos: Float32Array;
  private col: Float32Array;
  private tracers: Tracer[] = [];
  private cursor = 0;
  private geo: THREE.BufferGeometry;

  constructor(capacity = 48) {
    this.capacity = capacity;
    this.pos = new Float32Array(capacity * 6);
    this.col = new Float32Array(capacity * 6);
    for (let i = 0; i < capacity; i++) this.tracers.push({ life: 0, maxLife: 1 });
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    this.geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e5);
    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.object = new THREE.LineSegments(this.geo, mat);
    this.object.frustumCulled = false;
    this.object.renderOrder = 2;
  }

  spawn(
    x0: number, y0: number, z0: number,
    x1: number, y1: number, z1: number,
    r = 1, g = 0.85, b = 0.5,
    life = 0.07,
  ): void {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.capacity;
    const p = i * 6;
    this.pos[p] = x0;
    this.pos[p + 1] = y0;
    this.pos[p + 2] = z0;
    this.pos[p + 3] = x1;
    this.pos[p + 4] = y1;
    this.pos[p + 5] = z1;
    // 起点暗、终点亮，看起来像飞过去的弹道
    this.col[p] = r * 0.15;
    this.col[p + 1] = g * 0.15;
    this.col[p + 2] = b * 0.15;
    this.col[p + 3] = r;
    this.col[p + 4] = g;
    this.col[p + 5] = b;
    this.tracers[i].life = life;
    this.tracers[i].maxLife = life;
  }

  update(dt: number): void {
    let dirty = false;
    for (let i = 0; i < this.capacity; i++) {
      const t = this.tracers[i];
      if (t.life <= 0) continue;
      dirty = true;
      t.life -= dt;
      const k = Math.max(0, t.life / t.maxLife);
      const p = i * 6;
      for (let j = 0; j < 6; j++) this.col[p + j] *= k > 0 ? 0.82 : 0;
      if (t.life <= 0) {
        for (let j = 0; j < 6; j++) this.col[p + j] = 0;
      }
    }
    if (dirty) {
      (this.geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
      (this.geo.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  dispose(): void {
    this.geo.dispose();
    (this.object.material as THREE.Material).dispose();
  }
}

/* -------------------------------------------------------------------------- */
/* 弹孔                                                                        */
/* -------------------------------------------------------------------------- */

export class DecalPool {
  readonly group = new THREE.Group();
  private meshes: THREE.Mesh[] = [];
  private life: number[] = [];
  private cursor = 0;
  private mat: THREE.MeshBasicMaterial;
  private geo: THREE.PlaneGeometry;

  constructor(capacity = 64) {
    this.geo = new THREE.PlaneGeometry(0.14, 0.14);
    this.mat = new THREE.MeshBasicMaterial({
      color: 0x1a1512,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
    });
    for (let i = 0; i < capacity; i++) {
      const m = new THREE.Mesh(this.geo, this.mat.clone());
      m.visible = false;
      m.renderOrder = 1;
      this.meshes.push(m);
      this.life.push(0);
      this.group.add(m);
    }
  }

  spawn(x: number, y: number, z: number, nx: number, ny: number, nz: number): void {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.meshes.length;
    const m = this.meshes[i];
    m.position.set(x + nx * 0.012, y + ny * 0.012, z + nz * 0.012);
    m.lookAt(x + nx, y + ny, z + nz);
    m.rotation.z = Math.random() * Math.PI;
    m.visible = true;
    const mat = m.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.85;
    this.life[i] = 12;
  }

  update(dt: number): void {
    for (let i = 0; i < this.meshes.length; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      if (this.life[i] <= 0) {
        this.meshes[i].visible = false;
      } else if (this.life[i] < 2) {
        (this.meshes[i].material as THREE.MeshBasicMaterial).opacity = 0.85 * (this.life[i] / 2);
      }
    }
  }

  dispose(): void {
    this.geo.dispose();
    this.mat.dispose();
    for (const m of this.meshes) (m.material as THREE.Material).dispose();
  }
}

/* -------------------------------------------------------------------------- */
/* 统一入口                                                                    */
/* -------------------------------------------------------------------------- */

/** 不同材质的弹着效果颜色 */
const IMPACT_COLOR: Record<SurfaceKind, [number, number, number]> = {
  sand: [0.78, 0.68, 0.5],
  stone: [0.72, 0.7, 0.64],
  wall: [0.7, 0.58, 0.42],
  plaster: [0.85, 0.82, 0.74],
  crate: [0.55, 0.36, 0.2],
  metal: [0.8, 0.85, 0.95],
  concrete: [0.66, 0.64, 0.6],
  barrel: [0.5, 0.34, 0.18],
};

export class EffectSystem {
  readonly group = new THREE.Group();
  readonly sparks: ParticleSystem;
  readonly debris: ParticleSystem;
  readonly tracers: TracerPool;
  readonly decals: DecalPool;
  private flashLight: THREE.PointLight;
  private flashTimer = 0;

  constructor() {
    const spark = sparkTexture();
    const dot = softDotTexture();
    this.sparks = new ParticleSystem(320, spark, true);
    this.debris = new ParticleSystem(320, dot, false);
    this.tracers = new TracerPool(48);
    this.decals = new DecalPool(64);
    this.group.add(this.sparks.points, this.debris.points, this.tracers.object, this.decals.group);

    this.flashLight = new THREE.PointLight(0xffcc88, 0, 12, 2);
    this.flashLight.visible = false;
    this.group.add(this.flashLight);
  }

  /** 子弹打在墙上 */
  impact(
    x: number, y: number, z: number,
    nx: number, ny: number, nz: number,
    surface: SurfaceKind,
  ): void {
    const c = IMPACT_COLOR[surface];
    const metal = surface === 'metal';
    for (let i = 0; i < (metal ? 9 : 6); i++) {
      const sx = nx + (Math.random() - 0.5) * 1.4;
      const sy = ny + (Math.random() - 0.5) * 1.4 + 0.3;
      const sz = nz + (Math.random() - 0.5) * 1.4;
      const sp = metal ? 6 + Math.random() * 6 : 2.5 + Math.random() * 3;
      this.sparks.spawn(
        x, y, z,
        sx * sp, sy * sp, sz * sp,
        metal ? 0.28 : 0.18,
        metal ? 0.05 : 0.07,
        metal ? 1 : c[0], metal ? 0.85 : c[1], metal ? 0.5 : c[2],
        9, 2.2,
      );
    }
    for (let i = 0; i < 5; i++) {
      this.debris.spawn(
        x, y, z,
        nx * 1.6 + (Math.random() - 0.5) * 2,
        ny * 1.6 + (Math.random() - 0.5) * 2 + 0.8,
        nz * 1.6 + (Math.random() - 0.5) * 2,
        0.45 + Math.random() * 0.3,
        0.13,
        c[0], c[1], c[2],
        3.5, 1.4,
      );
    }
    this.decals.spawn(x, y, z, nx, ny, nz);
  }

  /** 打中人 */
  blood(x: number, y: number, z: number, dx: number, dy: number, dz: number): void {
    for (let i = 0; i < 10; i++) {
      this.debris.spawn(
        x, y, z,
        dx * 2 + (Math.random() - 0.5) * 3,
        dy * 2 + (Math.random() - 0.5) * 3 + 1,
        dz * 2 + (Math.random() - 0.5) * 3,
        0.4 + Math.random() * 0.35,
        0.11,
        0.55 + Math.random() * 0.25, 0.03, 0.03,
        7, 1.8,
      );
    }
  }

  /** 枪口闪光（世界空间，给别的角色开枪用） */
  muzzle(x: number, y: number, z: number, dx: number, dy: number, dz: number): void {
    for (let i = 0; i < 4; i++) {
      this.sparks.spawn(
        x, y, z,
        dx * (5 + Math.random() * 8) + (Math.random() - 0.5) * 2,
        dy * (5 + Math.random() * 8) + (Math.random() - 0.5) * 2,
        dz * (5 + Math.random() * 8) + (Math.random() - 0.5) * 2,
        0.06,
        0.2,
        1, 0.82, 0.42,
        0, 4,
      );
    }
    this.flashLight.position.set(x, y, z);
    this.flashLight.intensity = 14;
    this.flashLight.visible = true;
    this.flashTimer = 0.045;
  }

  explosion(x: number, y: number, z: number): void {
    for (let i = 0; i < 140; i++) {
      const a = Math.random() * Math.PI * 2;
      const p = Math.random() * Math.PI - Math.PI / 2;
      const sp = 6 + Math.random() * 26;
      this.sparks.spawn(
        x, y + 0.5, z,
        Math.cos(a) * Math.cos(p) * sp,
        Math.sin(p) * sp + 6,
        Math.sin(a) * Math.cos(p) * sp,
        0.5 + Math.random() * 0.8,
        0.4,
        1, 0.6 + Math.random() * 0.3, 0.2,
        7, 0.8,
      );
    }
    for (let i = 0; i < 90; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 3 + Math.random() * 14;
      this.debris.spawn(
        x, y + 0.3, z,
        Math.cos(a) * sp,
        Math.random() * 10,
        Math.sin(a) * sp,
        1.2 + Math.random() * 1.5,
        0.7,
        0.32, 0.28, 0.24,
        4, 0.5,
      );
    }
    this.flashLight.position.set(x, y + 1, z);
    this.flashLight.intensity = 60;
    this.flashLight.distance = 60;
    this.flashLight.visible = true;
    this.flashTimer = 0.35;
  }

  update(dt: number): void {
    this.sparks.update(dt);
    this.debris.update(dt);
    this.tracers.update(dt);
    this.decals.update(dt);
    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      this.flashLight.intensity *= Math.max(0, 1 - dt * 22);
      if (this.flashTimer <= 0) {
        this.flashLight.visible = false;
        this.flashLight.distance = 12;
      }
    }
  }

  dispose(): void {
    this.sparks.dispose();
    this.debris.dispose();
    this.tracers.dispose();
    this.decals.dispose();
  }
}

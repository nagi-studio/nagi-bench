import * as THREE from 'three';
import type { SurfaceMaterial } from '../core/types';
import { bulletHoleTexture, muzzleFlashTexture, radialTexture } from './Textures';

const PARTICLE_VERT = /* glsl */ `
  attribute float size;
  attribute float alpha;
  attribute vec3 pcolor;
  varying float vAlpha;
  varying vec3 vColor;
  uniform float scale;
  void main() {
    vColor = pcolor;
    vAlpha = alpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * scale / max(0.1, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  uniform sampler2D map;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec4 t = texture2D(map, gl_PointCoord);
    gl_FragColor = vec4(vColor, vAlpha * t.a);
    if (gl_FragColor.a < 0.003) discard;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

interface ParticleSpawn {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  size0: number;
  size1: number;
  color: THREE.Color;
  alpha0: number;
  alpha1?: number;
  gravity?: number;
  drag?: number;
}

/** CPU particle pool rendered as one Points draw call. */
class ParticlePool {
  readonly points: THREE.Points;
  private readonly n: number;
  private readonly pos: Float32Array;
  private readonly vel: Float32Array;
  private readonly col: Float32Array;
  private readonly size: Float32Array;
  private readonly alpha: Float32Array;
  private readonly life: Float32Array;
  private readonly maxLife: Float32Array;
  private readonly s0: Float32Array;
  private readonly s1: Float32Array;
  private readonly a0: Float32Array;
  private readonly a1: Float32Array;
  private readonly grav: Float32Array;
  private readonly drag: Float32Array;
  private cursor = 0;
  private readonly material: THREE.ShaderMaterial;

  constructor(n: number, additive: boolean, map: THREE.Texture) {
    this.n = n;
    this.pos = new Float32Array(n * 3);
    this.vel = new Float32Array(n * 3);
    this.col = new Float32Array(n * 3);
    this.size = new Float32Array(n);
    this.alpha = new Float32Array(n);
    this.life = new Float32Array(n);
    this.maxLife = new Float32Array(n);
    this.s0 = new Float32Array(n);
    this.s1 = new Float32Array(n);
    this.a0 = new Float32Array(n);
    this.a1 = new Float32Array(n);
    this.grav = new Float32Array(n);
    this.drag = new Float32Array(n);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('pcolor', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(54, 0, 52), 1000);
    this.material = new THREE.ShaderMaterial({
      uniforms: { map: { value: map }, scale: { value: 600 } },
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(g, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = additive ? 3 : 2;
  }

  setViewportHeight(h: number, fovDeg: number): void {
    this.material.uniforms.scale.value = h / (2 * Math.tan((fovDeg * Math.PI) / 360));
  }

  spawn(p: ParticleSpawn): void {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.n;
    this.pos[i * 3] = p.x;
    this.pos[i * 3 + 1] = p.y;
    this.pos[i * 3 + 2] = p.z;
    this.vel[i * 3] = p.vx;
    this.vel[i * 3 + 1] = p.vy;
    this.vel[i * 3 + 2] = p.vz;
    this.col[i * 3] = p.color.r;
    this.col[i * 3 + 1] = p.color.g;
    this.col[i * 3 + 2] = p.color.b;
    this.life[i] = p.life;
    this.maxLife[i] = p.life;
    this.s0[i] = p.size0;
    this.s1[i] = p.size1;
    this.a0[i] = p.alpha0;
    this.a1[i] = p.alpha1 ?? 0;
    this.grav[i] = p.gravity ?? 0;
    this.drag[i] = p.drag ?? 0;
  }

  update(dt: number): void {
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] <= 0) {
        this.alpha[i] = 0;
        continue;
      }
      this.life[i] -= dt;
      const t = 1 - Math.max(0, this.life[i]) / this.maxLife[i];
      const k = Math.exp(-this.drag[i] * dt);
      this.vel[i * 3] *= k;
      this.vel[i * 3 + 1] = this.vel[i * 3 + 1] * k - this.grav[i] * dt;
      this.vel[i * 3 + 2] *= k;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      this.size[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * t;
      this.alpha[i] = this.life[i] > 0 ? this.a0[i] + (this.a1[i] - this.a0[i]) * t : 0;
    }
    const g = this.points.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.size.needsUpdate = true;
    g.attributes.alpha.needsUpdate = true;
    g.attributes.pcolor.needsUpdate = true;
  }

  clear(): void {
    this.life.fill(0);
    this.alpha.fill(0);
  }
}

interface Tracer {
  ax: number;
  ay: number;
  az: number;
  dx: number;
  dy: number;
  dz: number;
  len: number;
  t: number;
  active: boolean;
  speed: number;
}

const MAX_TRACERS = 48;
const MAX_DECALS = 180;

/**
 * Transient visual effects: tracers (camera-facing streaks), muzzle flashes with dynamic lights,
 * impact dust/sparks, bullet-hole decals, blood, C4 explosion.
 */
export class Effects {
  readonly group = new THREE.Group();
  private readonly additive: ParticlePool;
  private readonly soft: ParticlePool;
  private readonly tracers: Tracer[] = [];
  private readonly tracerGeo: THREE.BufferGeometry;
  private readonly tracerPos: Float32Array;
  private readonly tracerAlpha: Float32Array;
  private readonly decals: THREE.Mesh[] = [];
  private decalCursor = 0;
  private readonly flashes: { sprite: THREE.Sprite; life: number }[] = [];
  private readonly lights: { light: THREE.PointLight; life: number; max: number; peak: number }[] = [];
  private readonly fireballs: { mesh: THREE.Mesh; ring: THREE.Mesh; t: number }[] = [];
  private readonly tmpColor = new THREE.Color();
  private readonly v1 = new THREE.Vector3();
  private readonly v2 = new THREE.Vector3();
  private readonly v3 = new THREE.Vector3();

  constructor() {
    const soft = radialTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)');
    this.additive = new ParticlePool(900, true, soft);
    this.soft = new ParticlePool(1400, false, soft);
    this.group.add(this.additive.points, this.soft.points);

    // tracers: N camera-facing quads in one buffer
    this.tracerPos = new Float32Array(MAX_TRACERS * 4 * 3);
    this.tracerAlpha = new Float32Array(MAX_TRACERS * 4 * 3);
    const idx: number[] = [];
    for (let i = 0; i < MAX_TRACERS; i++) idx.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3);
    this.tracerGeo = new THREE.BufferGeometry();
    this.tracerGeo.setAttribute('position', new THREE.BufferAttribute(this.tracerPos, 3).setUsage(THREE.DynamicDrawUsage));
    this.tracerGeo.setAttribute('color', new THREE.BufferAttribute(this.tracerAlpha, 3).setUsage(THREE.DynamicDrawUsage));
    this.tracerGeo.setIndex(idx);
    const tracerMesh = new THREE.Mesh(
      this.tracerGeo,
      new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    );
    tracerMesh.frustumCulled = false;
    tracerMesh.renderOrder = 4;
    this.group.add(tracerMesh);
    for (let i = 0; i < MAX_TRACERS; i++) this.tracers.push({ ax: 0, ay: 0, az: 0, dx: 0, dy: 0, dz: 0, len: 0, t: 0, active: false, speed: 400 });

    // bullet hole decals
    const decalMat = new THREE.MeshBasicMaterial({
      map: bulletHoleTexture(),
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    });
    const decalGeo = new THREE.PlaneGeometry(0.09, 0.09);
    for (let i = 0; i < MAX_DECALS; i++) {
      const m = new THREE.Mesh(decalGeo, decalMat);
      m.visible = false;
      m.renderOrder = 1;
      this.decals.push(m);
      this.group.add(m);
    }

    // muzzle flash sprites (third-person)
    const flashMat = new THREE.SpriteMaterial({ map: muzzleFlashTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
    for (let i = 0; i < 10; i++) {
      const s = new THREE.Sprite(flashMat);
      s.visible = false;
      s.scale.setScalar(0.4);
      this.flashes.push({ sprite: s, life: 0 });
      this.group.add(s);
    }

    // a fixed pool of dynamic point lights (fixed count => no shader recompiles)
    for (let i = 0; i < 3; i++) {
      const l = new THREE.PointLight(0xffb060, 0, 9, 2);
      l.castShadow = false;
      this.lights.push({ light: l, life: 0, max: 1, peak: 0 });
      this.group.add(l);
    }
  }

  setViewport(height: number, fov: number): void {
    this.additive.setViewportHeight(height, fov);
    this.soft.setViewportHeight(height, fov);
  }

  clear(): void {
    this.additive.clear();
    this.soft.clear();
    for (const t of this.tracers) t.active = false;
    for (const d of this.decals) d.visible = false;
    for (const f of this.flashes) {
      f.life = 0;
      f.sprite.visible = false;
    }
    for (const l of this.lights) {
      l.life = 0;
      l.light.intensity = 0;
    }
    for (const fb of this.fireballs) {
      this.group.remove(fb.mesh, fb.ring);
      fb.mesh.geometry.dispose();
      fb.ring.geometry.dispose();
    }
    this.fireballs.length = 0;
  }

  // ------------------------------------------------------------------ spawners

  tracer(from: THREE.Vector3, to: THREE.Vector3): void {
    const t = this.tracers.find((x) => !x.active) ?? this.tracers[0];
    const d = this.v1.subVectors(to, from);
    const len = d.length();
    if (len < 1) return;
    d.divideScalar(len);
    t.ax = from.x;
    t.ay = from.y;
    t.az = from.z;
    t.dx = d.x;
    t.dy = d.y;
    t.dz = d.z;
    t.len = len;
    t.t = 0;
    t.speed = 380;
    t.active = true;
  }

  flashLight(pos: THREE.Vector3, intensity: number, distance: number, life: number, color = 0xffb060): void {
    const l = this.lights.reduce((a, b) => (a.life <= b.life ? a : b));
    l.light.position.copy(pos);
    l.light.color.setHex(color);
    l.light.distance = distance;
    l.peak = intensity;
    l.life = life;
    l.max = life;
    l.light.intensity = intensity;
  }

  muzzleFlash(pos: THREE.Vector3, scale = 0.45, light = true): void {
    const f = this.flashes.reduce((a, b) => (a.life <= b.life ? a : b));
    f.sprite.position.copy(pos);
    f.sprite.scale.setScalar(scale * (0.8 + Math.random() * 0.4));
    f.sprite.material.rotation = Math.random() * Math.PI;
    f.sprite.visible = true;
    f.life = 0.05;
    if (light) this.flashLight(pos, 18, 7, 0.06);
  }

  impact(point: THREE.Vector3, normal: THREE.Vector3, material: SurfaceMaterial, decal = true): void {
    const c = this.tmpColor;
    const dust = material === 'wood' ? 0x8a6238 : material === 'metal' ? 0x8a8a8a : 0xc9ab7e;
    for (let i = 0; i < 7; i++) {
      c.setHex(dust).multiplyScalar(0.8 + Math.random() * 0.3);
      this.soft.spawn({
        x: point.x + normal.x * 0.03,
        y: point.y + normal.y * 0.03,
        z: point.z + normal.z * 0.03,
        vx: normal.x * (0.6 + Math.random() * 1.5) + (Math.random() - 0.5) * 1.2,
        vy: normal.y * (0.6 + Math.random() * 1.5) + Math.random() * 0.9,
        vz: normal.z * (0.6 + Math.random() * 1.5) + (Math.random() - 0.5) * 1.2,
        life: 0.5 + Math.random() * 0.5,
        size0: 0.05,
        size1: 0.28 + Math.random() * 0.2,
        color: c,
        alpha0: 0.7,
        alpha1: 0,
        gravity: 1.5,
        drag: 3,
      });
    }
    const sparks = material === 'metal' ? 8 : material === 'stone' ? 3 : 0;
    for (let i = 0; i < sparks; i++) {
      c.setRGB(1.6, 1.1, 0.5);
      this.additive.spawn({
        x: point.x,
        y: point.y,
        z: point.z,
        vx: normal.x * 3 + (Math.random() - 0.5) * 6,
        vy: normal.y * 3 + Math.random() * 4,
        vz: normal.z * 3 + (Math.random() - 0.5) * 6,
        life: 0.15 + Math.random() * 0.2,
        size0: 0.03,
        size1: 0.01,
        color: c,
        alpha0: 1,
        alpha1: 0.2,
        gravity: 9,
      });
    }
    if (material === 'wood') {
      for (let i = 0; i < 4; i++) {
        c.setHex(0x6b4422);
        this.soft.spawn({
          x: point.x,
          y: point.y,
          z: point.z,
          vx: normal.x * 2 + (Math.random() - 0.5) * 3,
          vy: 1 + Math.random() * 2,
          vz: normal.z * 2 + (Math.random() - 0.5) * 3,
          life: 0.6,
          size0: 0.04,
          size1: 0.04,
          color: c,
          alpha0: 1,
          alpha1: 1,
          gravity: 12,
        });
      }
    }
    if (decal) this.decal(point, normal);
  }

  private decal(point: THREE.Vector3, normal: THREE.Vector3): void {
    const m = this.decals[this.decalCursor];
    this.decalCursor = (this.decalCursor + 1) % MAX_DECALS;
    m.position.copy(point).addScaledVector(normal, 0.006);
    m.lookAt(this.v2.copy(point).add(normal));
    m.rotateZ(Math.random() * Math.PI * 2);
    const s = 0.8 + Math.random() * 0.5;
    m.scale.set(s, s, s);
    m.visible = true;
  }

  blood(point: THREE.Vector3, dir: THREE.Vector3, headshot: boolean): void {
    const c = this.tmpColor;
    const n = headshot ? 22 : 12;
    for (let i = 0; i < n; i++) {
      c.setRGB(0.42 + Math.random() * 0.15, 0.02, 0.02);
      this.soft.spawn({
        x: point.x,
        y: point.y,
        z: point.z,
        vx: dir.x * (1 + Math.random() * 2.5) + (Math.random() - 0.5) * 1.6,
        vy: dir.y * 2 + Math.random() * 1.8,
        vz: dir.z * (1 + Math.random() * 2.5) + (Math.random() - 0.5) * 1.6,
        life: 0.35 + Math.random() * 0.45,
        size0: 0.06,
        size1: headshot ? 0.3 : 0.2,
        color: c,
        alpha0: 0.95,
        alpha1: 0,
        gravity: 6,
        drag: 2,
      });
    }
    // fine mist
    c.setRGB(0.55, 0.05, 0.05);
    this.soft.spawn({ x: point.x, y: point.y, z: point.z, vx: dir.x, vy: 0.2, vz: dir.z, life: 0.4, size0: 0.15, size1: headshot ? 0.9 : 0.5, color: c, alpha0: 0.6, alpha1: 0, drag: 4 });
  }

  explosion(pos: THREE.Vector3): void {
    const c = this.tmpColor;
    for (let i = 0; i < 160; i++) {
      const a = Math.random() * Math.PI * 2;
      const e = Math.random() * Math.PI * 0.5;
      const sp = 4 + Math.random() * 16;
      c.setRGB(2.2, 1.0 + Math.random() * 0.4, 0.3);
      this.additive.spawn({
        x: pos.x,
        y: pos.y + 0.5,
        z: pos.z,
        vx: Math.cos(a) * Math.cos(e) * sp,
        vy: Math.sin(e) * sp * 0.8 + 2,
        vz: Math.sin(a) * Math.cos(e) * sp,
        life: 0.5 + Math.random() * 0.8,
        size0: 0.8,
        size1: 2.6,
        color: c,
        alpha0: 1,
        alpha1: 0,
        drag: 2.5,
        gravity: -1,
      });
    }
    for (let i = 0; i < 110; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1 + Math.random() * 7;
      const g = 0.25 + Math.random() * 0.2;
      c.setRGB(g, g * 0.92, g * 0.85);
      this.soft.spawn({
        x: pos.x + (Math.random() - 0.5) * 2,
        y: pos.y + 0.5 + Math.random() * 2,
        z: pos.z + (Math.random() - 0.5) * 2,
        vx: Math.cos(a) * sp,
        vy: 2 + Math.random() * 5,
        vz: Math.sin(a) * sp,
        life: 2.5 + Math.random() * 2.5,
        size0: 1.5,
        size1: 7 + Math.random() * 4,
        color: c,
        alpha0: 0.75,
        alpha1: 0,
        drag: 1.4,
        gravity: -0.6,
      });
    }
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    ball.position.copy(pos);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1.2, 48),
      new THREE.MeshBasicMaterial({ color: 0xfff0d0, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    ring.position.copy(pos).add(this.v3.set(0, 0.2, 0));
    ring.rotation.x = -Math.PI / 2;
    this.group.add(ball, ring);
    this.fireballs.push({ mesh: ball, ring, t: 0 });
    this.flashLight(this.v3.copy(pos).add(this.v1.set(0, 3, 0)), 4000, 70, 1.2, 0xffa050);
  }

  // ------------------------------------------------------------------ per frame

  update(dt: number, camera: THREE.Camera): void {
    this.additive.update(dt);
    this.soft.update(dt);

    for (const f of this.flashes) {
      if (f.life > 0) {
        f.life -= dt;
        if (f.life <= 0) f.sprite.visible = false;
      }
    }
    for (const l of this.lights) {
      if (l.life > 0) {
        l.life -= dt;
        l.light.intensity = Math.max(0, l.peak * (l.life / l.max));
      } else l.light.intensity = 0;
    }
    for (let i = this.fireballs.length - 1; i >= 0; i--) {
      const fb = this.fireballs[i];
      fb.t += dt;
      const s = 2 + fb.t * 26;
      fb.mesh.scale.setScalar(Math.min(s, 13));
      (fb.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.95 - fb.t * 1.3);
      fb.ring.scale.setScalar(1 + fb.t * 45);
      (fb.ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - fb.t * 1.6);
      if (fb.t > 1.2) {
        this.group.remove(fb.mesh, fb.ring);
        fb.mesh.geometry.dispose();
        fb.ring.geometry.dispose();
        (fb.mesh.material as THREE.Material).dispose();
        (fb.ring.material as THREE.Material).dispose();
        this.fireballs.splice(i, 1);
      }
    }

    // tracers
    const camPos = this.v3.setFromMatrixPosition(camera.matrixWorld);
    const P = this.tracerPos;
    const C = this.tracerAlpha;
    for (let i = 0; i < MAX_TRACERS; i++) {
      const t = this.tracers[i];
      const o = i * 12;
      if (!t.active) {
        for (let k = 0; k < 12; k++) {
          P[o + k] = 0;
          C[o + k] = 0;
        }
        continue;
      }
      t.t += dt;
      const head = Math.min(t.len, t.t * t.speed);
      const tail = Math.max(0, head - 4.5);
      if (tail >= t.len - 0.01) {
        t.active = false;
        continue;
      }
      const ax = t.ax + t.dx * tail;
      const ay = t.ay + t.dy * tail;
      const az = t.az + t.dz * tail;
      const bx = t.ax + t.dx * head;
      const by = t.ay + t.dy * head;
      const bz = t.az + t.dz * head;
      // side vector perpendicular to the streak and the view direction
      const vx = camPos.x - ax;
      const vy = camPos.y - ay;
      const vz = camPos.z - az;
      let sx = t.dy * vz - t.dz * vy;
      let sy = t.dz * vx - t.dx * vz;
      let sz = t.dx * vy - t.dy * vx;
      const sl = Math.hypot(sx, sy, sz) || 1;
      const w = 0.012;
      sx = (sx / sl) * w;
      sy = (sy / sl) * w;
      sz = (sz / sl) * w;
      P[o] = ax - sx;
      P[o + 1] = ay - sy;
      P[o + 2] = az - sz;
      P[o + 3] = ax + sx;
      P[o + 4] = ay + sy;
      P[o + 5] = az + sz;
      P[o + 6] = bx + sx;
      P[o + 7] = by + sy;
      P[o + 8] = bz + sz;
      P[o + 9] = bx - sx;
      P[o + 10] = by - sy;
      P[o + 11] = bz - sz;
      const ta = 0.15;
      const ha = 1.0;
      C[o] = 1.0 * ta;
      C[o + 1] = 0.8 * ta;
      C[o + 2] = 0.45 * ta;
      C[o + 3] = 1.0 * ta;
      C[o + 4] = 0.8 * ta;
      C[o + 5] = 0.45 * ta;
      C[o + 6] = 1.0 * ha;
      C[o + 7] = 0.85 * ha;
      C[o + 8] = 0.55 * ha;
      C[o + 9] = 1.0 * ha;
      C[o + 10] = 0.85 * ha;
      C[o + 11] = 0.55 * ha;
    }
    this.tracerGeo.attributes.position.needsUpdate = true;
    this.tracerGeo.attributes.color.needsUpdate = true;
  }
}

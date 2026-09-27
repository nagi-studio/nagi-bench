// Visual effects: bullet tracers, impact decals, particle bursts (sparks, dust, blood),
// explosion fireball, muzzle light, C4 model.
import * as THREE from 'three';
import type { Vec3 } from '../../core/math.ts';
import { bulletHoleTexture, softDotTexture } from './textures.ts';
import { buildWeaponModel } from './weaponModels.ts';

interface Tracer {
  mesh: THREE.Mesh;
  from: THREE.Vector3;
  dir: THREE.Vector3;
  len: number;
  age: number;
  active: boolean;
}

class ParticleSystem {
  readonly points: THREE.Points;
  private pos: Float32Array;
  private col: Float32Array;
  private vel: Float32Array;
  private life: Float32Array;
  private maxLife: Float32Array;
  private base: Float32Array;
  private next = 0;
  private gravity: number;
  private drag: number;

  constructor(cap: number, size: number, additive: boolean, gravity: number, drag: number, map: THREE.Texture, opacity = 1) {
    this.pos = new Float32Array(cap * 3).fill(-9999);
    this.col = new Float32Array(cap * 3);
    this.base = new Float32Array(cap * 3);
    this.vel = new Float32Array(cap * 3);
    this.life = new Float32Array(cap);
    this.maxLife = new Float32Array(cap).fill(1);
    this.gravity = gravity;
    this.drag = drag;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    const m = new THREE.PointsMaterial({
      size,
      map,
      vertexColors: true,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      sizeAttenuation: true,
    });
    this.points = new THREE.Points(g, m);
    this.points.frustumCulled = false;
  }

  emit(p: Vec3, v: Vec3, color: THREE.Color, life: number) {
    const i = this.next;
    this.next = (this.next + 1) % this.life.length;
    this.pos[i * 3] = p.x;
    this.pos[i * 3 + 1] = p.y;
    this.pos[i * 3 + 2] = p.z;
    this.vel[i * 3] = v.x;
    this.vel[i * 3 + 1] = v.y;
    this.vel[i * 3 + 2] = v.z;
    this.base[i * 3] = color.r;
    this.base[i * 3 + 1] = color.g;
    this.base[i * 3 + 2] = color.b;
    this.life[i] = life;
    this.maxLife[i] = life;
  }

  update(dt: number) {
    const n = this.life.length;
    const dragK = Math.exp(-this.drag * dt);
    for (let i = 0; i < n; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      if (this.life[i] <= 0) {
        this.pos[i * 3 + 1] = -9999;
        continue;
      }
      this.vel[i * 3 + 1] -= this.gravity * dt;
      this.vel[i * 3] *= dragK;
      this.vel[i * 3 + 1] *= dragK;
      this.vel[i * 3 + 2] *= dragK;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      const f = this.life[i] / this.maxLife[i];
      this.col[i * 3] = this.base[i * 3] * f;
      this.col[i * 3 + 1] = this.base[i * 3 + 1] * f;
      this.col[i * 3 + 2] = this.base[i * 3 + 2] * f;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.color.needsUpdate = true;
  }
}

export class Effects {
  readonly group = new THREE.Group();
  private tracers: Tracer[] = [];
  private decals: THREE.Mesh[] = [];
  private decalIdx = 0;
  private sparks: ParticleSystem;
  private dust: ParticleSystem;
  private blood: ParticleSystem;
  private smoke: ParticleSystem;
  private fireball: THREE.Mesh;
  private smokeBall: THREE.Mesh;
  private explosionAge = -1;
  private explosionPos = new THREE.Vector3();
  readonly light = new THREE.PointLight(0xffc27a, 0, 12, 2);
  private lightLife = 0;
  private lightPeak = 0;
  readonly bomb: THREE.Group;
  private bombLed: THREE.Mesh;
  private ledUntil = 0;
  private tmpC = new THREE.Color();

  constructor() {
    const tracerMat = new THREE.MeshBasicMaterial({
      color: 0xffe2a0,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const tg = new THREE.BoxGeometry(1, 1, 1);
    tg.translate(0, 0, -0.5);
    for (let i = 0; i < 32; i++) {
      const m = new THREE.Mesh(tg, tracerMat);
      m.visible = false;
      this.group.add(m);
      this.tracers.push({ mesh: m, from: new THREE.Vector3(), dir: new THREE.Vector3(), len: 0, age: 0, active: false });
    }
    const decalMat = new THREE.MeshBasicMaterial({
      map: bulletHoleTexture(),
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    });
    const dg = new THREE.PlaneGeometry(0.09, 0.09);
    for (let i = 0; i < 96; i++) {
      const m = new THREE.Mesh(dg, decalMat);
      m.visible = false;
      this.group.add(m);
      this.decals.push(m);
    }
    const dot = softDotTexture();
    this.sparks = new ParticleSystem(300, 0.07, true, 9, 1.5, dot);
    this.dust = new ParticleSystem(300, 0.28, false, 1.5, 3, dot, 0.55);
    this.blood = new ParticleSystem(300, 0.12, false, 8, 2, dot, 0.9);
    this.smoke = new ParticleSystem(200, 2.6, false, -0.6, 0.7, dot, 0.45);
    this.group.add(this.sparks.points, this.dust.points, this.blood.points, this.smoke.points);

    this.fireball = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 2),
      new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    this.fireball.visible = false;
    this.smokeBall = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 2),
      new THREE.MeshLambertMaterial({ color: 0x3a342e, transparent: true, depthWrite: false }),
    );
    this.smokeBall.visible = false;
    this.group.add(this.fireball, this.smokeBall, this.light);

    this.bomb = new THREE.Group();
    const c4 = buildWeaponModel('c4').group;
    c4.scale.setScalar(1.4);
    c4.position.y = 0.02;
    this.bomb.add(c4);
    this.bombLed = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff2020 }));
    this.bombLed.position.set(0.07, 0.1, -0.1);
    this.bomb.add(this.bombLed);
    this.bomb.visible = false;
    this.group.add(this.bomb);
  }

  tracer(from: Vec3, to: Vec3) {
    const t = this.tracers.find((x) => !x.active);
    if (!t) return;
    t.from.set(from.x, from.y, from.z);
    t.dir.set(to.x - from.x, to.y - from.y, to.z - from.z);
    t.len = t.dir.length();
    if (t.len < 1.5) return;
    t.dir.divideScalar(t.len);
    t.age = 0;
    t.active = true;
    t.mesh.visible = true;
  }

  impact(p: Vec3, n: Vec3, surface: 'world' | 'flesh') {
    if (surface === 'flesh') {
      for (let i = 0; i < 10; i++) {
        this.blood.emit(
          p,
          { x: (Math.random() - 0.5) * 2.5 + n.x, y: Math.random() * 2, z: (Math.random() - 0.5) * 2.5 + n.z },
          this.tmpC.setRGB(0.55 + Math.random() * 0.2, 0.02, 0.02),
          0.35 + Math.random() * 0.3,
        );
      }
      return;
    }
    const d = this.decals[this.decalIdx];
    this.decalIdx = (this.decalIdx + 1) % this.decals.length;
    d.position.set(p.x + n.x * 0.005, p.y + n.y * 0.005, p.z + n.z * 0.005);
    d.lookAt(p.x + n.x, p.y + n.y, p.z + n.z);
    d.rotateZ(Math.random() * Math.PI);
    d.visible = true;
    for (let i = 0; i < 5; i++) {
      this.sparks.emit(
        p,
        { x: n.x * 3 + (Math.random() - 0.5) * 4, y: n.y * 3 + Math.random() * 3, z: n.z * 3 + (Math.random() - 0.5) * 4 },
        this.tmpC.setRGB(1, 0.75, 0.35),
        0.15 + Math.random() * 0.15,
      );
    }
    for (let i = 0; i < 3; i++) {
      this.dust.emit(
        p,
        { x: n.x * 1.2 + (Math.random() - 0.5), y: n.y * 1.2 + Math.random() * 0.8, z: n.z * 1.2 + (Math.random() - 0.5) },
        this.tmpC.setRGB(0.78, 0.68, 0.52),
        0.5 + Math.random() * 0.4,
      );
    }
  }

  muzzleLight(p: Vec3, strength = 1) {
    this.light.position.set(p.x, p.y, p.z);
    this.lightPeak = 30 * strength;
    this.lightLife = 0.05;
  }

  explosion(p: Vec3) {
    this.explosionAge = 0;
    this.explosionPos.set(p.x, p.y + 0.5, p.z);
    this.fireball.visible = true;
    this.smokeBall.visible = true;
    for (let i = 0; i < 120; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 6 + Math.random() * 16;
      this.sparks.emit(
        this.explosionPos,
        { x: Math.cos(a) * s, y: Math.random() * 14, z: Math.sin(a) * s },
        this.tmpC.setRGB(1, 0.6 + Math.random() * 0.3, 0.2),
        0.6 + Math.random() * 0.9,
      );
    }
    for (let i = 0; i < 40; i++) {
      this.smoke.emit(
        this.explosionPos,
        { x: (Math.random() - 0.5) * 8, y: 1 + Math.random() * 5, z: (Math.random() - 0.5) * 8 },
        this.tmpC.setRGB(0.3, 0.27, 0.24),
        2.5 + Math.random() * 2,
      );
    }
    this.light.position.copy(this.explosionPos);
    this.lightPeak = 4000;
    this.lightLife = 0.8;
    this.light.distance = 60;
  }

  bombBeep(now: number) {
    this.ledUntil = now + 0.12;
  }

  setBomb(visible: boolean, p: Vec3, now: number, planted: boolean) {
    this.bomb.visible = visible;
    if (!visible) return;
    this.bomb.position.set(p.x, p.y, p.z);
    (this.bombLed.material as THREE.MeshBasicMaterial).color.setHex(planted && now < this.ledUntil ? 0xff3030 : planted ? 0x400808 : 0x302020);
  }

  update(dt: number) {
    for (const t of this.tracers) {
      if (!t.active) continue;
      t.age += dt;
      const speed = 320;
      const head = Math.min(t.len, t.age * speed + 2.5);
      const tail = Math.max(0, head - 3.5);
      if (tail >= t.len - 0.01 || t.age > 0.5) {
        t.active = false;
        t.mesh.visible = false;
        continue;
      }
      const m = t.mesh;
      m.position.copy(t.from).addScaledVector(t.dir, tail);
      m.lookAt(m.position.x + t.dir.x, m.position.y + t.dir.y, m.position.z + t.dir.z);
      // lookAt makes +Z face the target for non-camera objects; geometry extends along -Z, so flip
      m.rotateY(Math.PI);
      m.scale.set(0.012, 0.012, Math.max(0.01, head - tail));
    }
    this.sparks.update(dt);
    this.dust.update(dt);
    this.blood.update(dt);
    this.smoke.update(dt);
    if (this.lightLife > 0) {
      this.lightLife -= dt;
      this.light.intensity = Math.max(0, this.lightLife > 0 ? this.lightPeak * Math.min(1, this.lightLife / 0.05) : 0);
      if (this.lightLife <= 0) {
        this.light.intensity = 0;
        this.light.distance = 12;
      }
    }
    if (this.explosionAge >= 0) {
      this.explosionAge += dt;
      const a = this.explosionAge;
      const f = Math.min(1, a / 0.5);
      this.fireball.position.copy(this.explosionPos);
      this.fireball.scale.setScalar(1 + f * 8);
      (this.fireball.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - a / 0.9);
      this.smokeBall.position.copy(this.explosionPos).setY(this.explosionPos.y + a * 1.5);
      this.smokeBall.scale.setScalar(2 + Math.min(1, a / 2) * 9);
      (this.smokeBall.material as THREE.MeshLambertMaterial).opacity = Math.max(0, 0.7 * (1 - a / 4));
      if (a > 4) {
        this.explosionAge = -1;
        this.fireball.visible = false;
        this.smokeBall.visible = false;
      }
    }
  }

  clearRound() {
    for (const d of this.decals) d.visible = false;
    this.explosionAge = -1;
    this.fireball.visible = false;
    this.smokeBall.visible = false;
  }
}

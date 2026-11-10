// Pooled visual effects: tracers, bullet holes, particle bursts (dust, sparks, blood),
// third-person muzzle flashes, the C4 world model and its explosion.

import * as THREE from 'three';
import { TextureSet } from './textures';
import { buildBombModel } from './weaponModels';

const MAX_TRACERS = 40;
const MAX_DECALS = 180;
const MAX_PARTICLES = 900;
const MAX_FLASHES = 10;

interface Tracer {
  mesh: THREE.Mesh;
  life: number;
  max: number;
}

interface Flash {
  sprite: THREE.Sprite;
  life: number;
}

const _dir = new THREE.Vector3();
const _n = new THREE.Vector3();
const Z_AXIS = new THREE.Vector3(0, 0, 1);

export class Effects {
  readonly group = new THREE.Group();
  private tracers: Tracer[] = [];
  private tracerCursor = 0;
  private tracerGeo = new THREE.BoxGeometry(1, 1, 1);
  private tracerMat: THREE.MeshBasicMaterial;

  private decals: THREE.Mesh[] = [];
  private decalCursor = 0;
  private decalGeo = new THREE.PlaneGeometry(1, 1);
  private decalMat: THREE.MeshBasicMaterial;

  private pGeo = new THREE.BufferGeometry();
  private pPos = new Float32Array(MAX_PARTICLES * 3);
  private pCol = new Float32Array(MAX_PARTICLES * 3);
  private pVel = new Float32Array(MAX_PARTICLES * 3);
  private pLife = new Float32Array(MAX_PARTICLES);
  private pGrav = new Float32Array(MAX_PARTICLES);
  private pCursor = 0;
  private pMat: THREE.PointsMaterial;
  private points: THREE.Points;

  private flashes: Flash[] = [];
  private flashCursor = 0;
  private flashMat: THREE.SpriteMaterial;
  private flashLight: THREE.PointLight;
  private flashLightLife = 0;

  readonly bomb: THREE.Group;
  private bombLed: THREE.Mesh;
  private bombLedTime = 0;
  private bombLight: THREE.PointLight;

  private blast: THREE.Mesh;
  private blastMat: THREE.MeshBasicMaterial;
  private blastLight: THREE.PointLight;
  private blastTime = -1;
  /** Camera shake amount requested by effects (decays over time). */
  shake = 0;

  constructor(tex: TextureSet) {
    // tracers
    this.tracerMat = new THREE.MeshBasicMaterial({ color: 0xffe6a0, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
    for (let i = 0; i < MAX_TRACERS; i++) {
      const mesh = new THREE.Mesh(this.tracerGeo, this.tracerMat);
      mesh.visible = false;
      mesh.frustumCulled = false;
      this.group.add(mesh);
      this.tracers.push({ mesh, life: 0, max: 1 });
    }
    // decals
    this.decalMat = new THREE.MeshBasicMaterial({
      map: tex.bulletHole,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
    });
    for (let i = 0; i < MAX_DECALS; i++) {
      const mesh = new THREE.Mesh(this.decalGeo, this.decalMat);
      mesh.visible = false;
      this.group.add(mesh);
      this.decals.push(mesh);
    }
    // particles
    this.pPos.fill(-9999);
    this.pGeo.setAttribute('position', new THREE.BufferAttribute(this.pPos, 3));
    this.pGeo.setAttribute('color', new THREE.BufferAttribute(this.pCol, 3));
    this.pMat = new THREE.PointsMaterial({ size: 0.11, map: tex.softDot, vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: true, alphaTest: 0.02 });
    this.points = new THREE.Points(this.pGeo, this.pMat);
    this.points.frustumCulled = false;
    this.group.add(this.points);
    // muzzle flashes
    this.flashMat = new THREE.SpriteMaterial({ map: tex.muzzleFlash, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
    for (let i = 0; i < MAX_FLASHES; i++) {
      const sprite = new THREE.Sprite(this.flashMat);
      sprite.visible = false;
      this.group.add(sprite);
      this.flashes.push({ sprite, life: 0 });
    }
    this.flashLight = new THREE.PointLight(0xffc878, 0, 9, 1.8);
    this.group.add(this.flashLight);
    // bomb
    const b = buildBombModel();
    this.bomb = b.group;
    this.bombLed = b.led;
    this.bomb.visible = false;
    this.group.add(this.bomb);
    this.bombLight = new THREE.PointLight(0xff2a1a, 0, 5, 1.5);
    this.bombLight.position.set(0, 0.25, 0);
    this.bomb.add(this.bombLight);
    // explosion
    this.blastMat = new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    this.blast = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), this.blastMat);
    this.blast.visible = false;
    this.group.add(this.blast);
    this.blastLight = new THREE.PointLight(0xff9a40, 0, 80, 1.2);
    this.group.add(this.blastLight);
  }

  tracer(ox: number, oy: number, oz: number, ex: number, ey: number, ez: number, thick = 0.014): void {
    _dir.set(ex - ox, ey - oy, ez - oz);
    const len = _dir.length();
    if (len < 1.5) return;
    const t = this.tracers[this.tracerCursor];
    this.tracerCursor = (this.tracerCursor + 1) % MAX_TRACERS;
    _dir.multiplyScalar(1 / len);
    // start a little ahead of the muzzle so the streak does not cover the gun
    const start = Math.min(1.2, len * 0.2);
    const l = len - start;
    t.mesh.position.set(ox + _dir.x * (start + l / 2), oy + _dir.y * (start + l / 2), oz + _dir.z * (start + l / 2));
    t.mesh.quaternion.setFromUnitVectors(Z_AXIS, _dir);
    t.mesh.scale.set(thick, thick, l);
    t.mesh.visible = true;
    t.life = t.max = 0.07;
  }

  impact(x: number, y: number, z: number, nx: number, ny: number, nz: number): void {
    const d = this.decals[this.decalCursor];
    this.decalCursor = (this.decalCursor + 1) % MAX_DECALS;
    _n.set(nx, ny, nz);
    d.position.set(x + nx * 0.004, y + ny * 0.004, z + nz * 0.004);
    d.quaternion.setFromUnitVectors(Z_AXIS, _n);
    const s = 0.07 + Math.random() * 0.04;
    d.scale.set(s, s, 1);
    d.visible = true;
    this.burst(x, y, z, nx, ny, nz, 7, 0.75, 0.72, 0.66, 2.6, 0.45, 5);
    this.burst(x, y, z, nx, ny, nz, 3, 1.0, 0.8, 0.4, 6, 0.16, 9);
  }

  blood(x: number, y: number, z: number, dx: number, dy: number, dz: number, big: boolean): void {
    this.burst(x, y, z, dx, dy, dz, big ? 18 : 9, 0.55, 0.02, 0.02, big ? 3.6 : 2.4, 0.5, 9);
  }

  /** Emits `count` particles in a cone around the given direction. */
  burst(x: number, y: number, z: number, dx: number, dy: number, dz: number, count: number, r: number, g: number, b: number, speed: number, life: number, gravity: number): void {
    for (let i = 0; i < count; i++) {
      const k = this.pCursor;
      this.pCursor = (this.pCursor + 1) % MAX_PARTICLES;
      const o = k * 3;
      this.pPos[o] = x;
      this.pPos[o + 1] = y;
      this.pPos[o + 2] = z;
      const sp = speed * (0.35 + Math.random() * 0.65);
      this.pVel[o] = (dx + (Math.random() - 0.5) * 1.3) * sp;
      this.pVel[o + 1] = (dy + (Math.random() - 0.5) * 1.3 + 0.25) * sp;
      this.pVel[o + 2] = (dz + (Math.random() - 0.5) * 1.3) * sp;
      const v = 0.8 + Math.random() * 0.3;
      this.pCol[o] = r * v;
      this.pCol[o + 1] = g * v;
      this.pCol[o + 2] = b * v;
      this.pLife[k] = life * (0.6 + Math.random() * 0.6);
      this.pGrav[k] = gravity;
    }
  }

  muzzleFlash(x: number, y: number, z: number, size: number): void {
    const f = this.flashes[this.flashCursor];
    this.flashCursor = (this.flashCursor + 1) % MAX_FLASHES;
    f.sprite.position.set(x, y, z);
    f.sprite.scale.set(size, size, 1);
    f.sprite.material.rotation = Math.random() * Math.PI;
    f.sprite.visible = true;
    f.life = 0.05;
    this.flashLight.position.set(x, y, z);
    this.flashLight.intensity = 14;
    this.flashLightLife = 0.06;
  }

  setBomb(visible: boolean, x: number, y: number, z: number, planted: boolean, now: number): void {
    this.bomb.visible = visible;
    if (!visible) return;
    this.bomb.position.set(x, y, z);
    this.bomb.rotation.y = planted ? 0.6 : now * 0.8;
  }

  bombBeep(): void {
    this.bombLedTime = 0.12;
  }

  explode(x: number, y: number, z: number): void {
    this.blast.position.set(x, y + 0.5, z);
    this.blast.visible = true;
    this.blastTime = 0;
    this.blastLight.position.set(x, y + 3, z);
    this.shake = 1.4;
    for (let i = 0; i < 6; i++) {
      this.burst(x, y + 0.5, z, 0, 1, 0, 40, 1.0, 0.55, 0.15, 22, 1.1, 12);
      this.burst(x, y + 0.5, z, 0, 1, 0, 30, 0.25, 0.23, 0.22, 12, 2.4, 3);
    }
  }

  clearRound(): void {
    for (const d of this.decals) d.visible = false;
    for (const t of this.tracers) t.mesh.visible = false;
    this.pLife.fill(0);
    this.pPos.fill(-9999);
    this.pGeo.attributes.position.needsUpdate = true;
    this.blast.visible = false;
    this.blastTime = -1;
    this.blastLight.intensity = 0;
    this.bomb.visible = false;
  }

  update(dt: number): void {
    for (const t of this.tracers) {
      if (!t.mesh.visible) continue;
      t.life -= dt;
      if (t.life <= 0) t.mesh.visible = false;
    }
    for (const f of this.flashes) {
      if (!f.sprite.visible) continue;
      f.life -= dt;
      if (f.life <= 0) f.sprite.visible = false;
    }
    if (this.flashLightLife > 0) {
      this.flashLightLife -= dt;
      if (this.flashLightLife <= 0) this.flashLight.intensity = 0;
    }
    // particles
    const pos = this.pPos;
    const vel = this.pVel;
    let any = false;
    for (let k = 0; k < MAX_PARTICLES; k++) {
      if (this.pLife[k] <= 0) continue;
      any = true;
      const o = k * 3;
      this.pLife[k] -= dt;
      if (this.pLife[k] <= 0) {
        pos[o + 1] = -9999;
        continue;
      }
      vel[o + 1] -= this.pGrav[k] * dt;
      const drag = Math.exp(-dt * 2.2);
      vel[o] *= drag;
      vel[o + 2] *= drag;
      pos[o] += vel[o] * dt;
      pos[o + 1] += vel[o + 1] * dt;
      pos[o + 2] += vel[o + 2] * dt;
      if (pos[o + 1] < 0.02 && vel[o + 1] < 0) {
        pos[o + 1] = 0.02;
        vel[o + 1] = 0;
        vel[o] *= 0.5;
        vel[o + 2] *= 0.5;
      }
    }
    if (any) {
      this.pGeo.attributes.position.needsUpdate = true;
      this.pGeo.attributes.color.needsUpdate = true;
    }
    // bomb light
    if (this.bombLedTime > 0) {
      this.bombLedTime -= dt;
      (this.bombLed.material as THREE.MeshBasicMaterial).color.setHex(0xff3020);
      this.bombLight.intensity = 5;
    } else {
      (this.bombLed.material as THREE.MeshBasicMaterial).color.setHex(0x400808);
      this.bombLight.intensity = 0;
    }
    // explosion
    if (this.blastTime >= 0) {
      this.blastTime += dt;
      const t = this.blastTime;
      const r = 1 + 17 * (1 - Math.exp(-t * 5));
      this.blast.scale.setScalar(r);
      this.blastMat.opacity = Math.max(0, 0.9 * (1 - t / 0.9));
      this.blastLight.intensity = Math.max(0, 900 * (1 - t / 1.2));
      if (t > 1.3) {
        this.blast.visible = false;
        this.blastLight.intensity = 0;
        this.blastTime = -1;
      }
    }
    this.shake *= Math.exp(-dt * 3.2);
    if (this.shake < 0.002) this.shake = 0;
  }

  dispose(): void {
    this.tracerGeo.dispose();
    this.tracerMat.dispose();
    this.decalGeo.dispose();
    this.decalMat.dispose();
    this.pGeo.dispose();
    this.pMat.dispose();
    this.flashMat.dispose();
    this.blast.geometry.dispose();
    this.blastMat.dispose();
  }
}

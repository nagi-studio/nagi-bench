/**
 * Transient visual effects: bullet tracers, impact decals and sparks, blood, muzzle
 * flashes and the C4 explosion. Everything is pooled — no allocation happens while
 * shooting, which keeps frame times flat during a firefight.
 */

import * as THREE from 'three';
import type { Vec3 } from '../core/math.ts';
import type { SolidKind } from '../game/map/collision.ts';

function radialTexture(inner: string, outer: string, size = 64): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.45, outer);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface Pooled {
  object: THREE.Object3D;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  vz: number;
  spin: number;
}

const IMPACT_COLORS: Partial<Record<SolidKind, number>> = {
  wall: 0xd8c49a,
  ceiling: 0xb9a37b,
  crate: 0x9a7042,
  crateBig: 0x855d31,
  concrete: 0xc9c4b6,
  metal: 0xe8eef5,
  barrel: 0x8a9068,
  door: 0x8a6a45,
  car: 0xc06a60,
};

export class EffectsSystem {
  private readonly scene: THREE.Scene;

  private readonly tracers: Pooled[] = [];
  private readonly sparks: Pooled[] = [];
  private readonly decals: Pooled[] = [];
  private readonly flashes: Pooled[] = [];
  private readonly smoke: Pooled[] = [];

  private readonly muzzleLight: THREE.PointLight;
  private muzzleLightLife = 0;
  private readonly explosionLight: THREE.PointLight;
  private explosionLightLife = 0;

  private readonly flashTexture: THREE.Texture;
  private readonly smokeTexture: THREE.Texture;
  private readonly tracerGeo: THREE.BoxGeometry;
  private readonly sparkGeo: THREE.BoxGeometry;
  private readonly decalGeo: THREE.PlaneGeometry;
  private readonly flashGeo: THREE.PlaneGeometry;
  private readonly explosionMesh: THREE.Mesh;
  private explosionLife = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.flashTexture = radialTexture('rgba(255,247,214,1)', 'rgba(255,168,54,0.75)');
    this.smokeTexture = radialTexture('rgba(120,110,100,0.75)', 'rgba(80,74,68,0.35)');
    this.tracerGeo = new THREE.BoxGeometry(1, 1, 1);
    this.sparkGeo = new THREE.BoxGeometry(0.045, 0.045, 0.045);
    this.decalGeo = new THREE.PlaneGeometry(0.24, 0.24);
    this.flashGeo = new THREE.PlaneGeometry(0.55, 0.55);

    this.muzzleLight = new THREE.PointLight(0xffcf8a, 0, 12, 2);
    this.muzzleLight.visible = false;
    scene.add(this.muzzleLight);

    this.explosionLight = new THREE.PointLight(0xff9a3c, 0, 60, 2);
    this.explosionLight.visible = false;
    scene.add(this.explosionLight);

    this.explosionMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 12),
      new THREE.MeshBasicMaterial({
        color: 0xffb257,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.explosionMesh.visible = false;
    scene.add(this.explosionMesh);

    // Pre-allocate the pools.
    for (let i = 0; i < 24; i++) this.tracers.push(this.makeTracer());
    for (let i = 0; i < 90; i++) this.sparks.push(this.makeSpark());
    for (let i = 0; i < 64; i++) this.decals.push(this.makeDecal());
    for (let i = 0; i < 10; i++) this.flashes.push(this.makeFlash());
    for (let i = 0; i < 24; i++) this.smoke.push(this.makeSmoke());
  }

  private makeTracer(): Pooled {
    const mesh = new THREE.Mesh(
      this.tracerGeo,
      new THREE.MeshBasicMaterial({
        color: 0xfff0b8,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    mesh.visible = false;
    mesh.frustumCulled = false;
    this.scene.add(mesh);
    return { object: mesh, life: 0, maxLife: 1, vx: 0, vy: 0, vz: 0, spin: 0 };
  }

  private makeSpark(): Pooled {
    const mesh = new THREE.Mesh(
      this.sparkGeo,
      new THREE.MeshBasicMaterial({ color: 0xffd08a, transparent: true, opacity: 0, depthWrite: false }),
    );
    mesh.visible = false;
    this.scene.add(mesh);
    return { object: mesh, life: 0, maxLife: 1, vx: 0, vy: 0, vz: 0, spin: 0 };
  }

  private makeDecal(): Pooled {
    const mesh = new THREE.Mesh(
      this.decalGeo,
      new THREE.MeshBasicMaterial({
        color: 0x2a2119,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
      }),
    );
    mesh.visible = false;
    this.scene.add(mesh);
    return { object: mesh, life: 0, maxLife: 1, vx: 0, vy: 0, vz: 0, spin: 0 };
  }

  private makeFlash(): Pooled {
    const mesh = new THREE.Mesh(
      this.flashGeo,
      new THREE.MeshBasicMaterial({
        map: this.flashTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    mesh.visible = false;
    this.scene.add(mesh);
    return { object: mesh, life: 0, maxLife: 1, vx: 0, vy: 0, vz: 0, spin: 0 };
  }

  private makeSmoke(): Pooled {
    const mesh = new THREE.Mesh(
      this.flashGeo,
      new THREE.MeshBasicMaterial({
        map: this.smokeTexture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    mesh.visible = false;
    this.scene.add(mesh);
    return { object: mesh, life: 0, maxLife: 1, vx: 0, vy: 0, vz: 0, spin: 0 };
  }

  private take(pool: Pooled[]): Pooled {
    let oldest = pool[0];
    for (const p of pool) {
      if (p.life <= 0) return p;
      if (p.life / p.maxLife < oldest.life / oldest.maxLife) oldest = p;
    }
    return oldest;
  }

  // ------------------------------------------------------------------ spawns

  spawnTracer(from: Vec3, to: Vec3, thickness = 0.035): void {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    const len = Math.hypot(dx, dy, dz);
    if (len < 0.2) return;

    const p = this.take(this.tracers);
    const mesh = p.object as THREE.Mesh;
    mesh.visible = true;
    mesh.position.set(from.x + dx / 2, from.y + dy / 2, from.z + dz / 2);
    mesh.lookAt(to.x, to.y, to.z);
    mesh.scale.set(thickness, thickness, len);
    (mesh.material as THREE.MeshBasicMaterial).opacity = 0.85;
    p.life = 0.055;
    p.maxLife = 0.055;
  }

  spawnMuzzleFlash(pos: Vec3, dirX: number, dirY: number, dirZ: number, scale = 1): void {
    const p = this.take(this.flashes);
    const mesh = p.object as THREE.Mesh;
    mesh.visible = true;
    mesh.position.set(pos.x + dirX * 0.35, pos.y + dirY * 0.35, pos.z + dirZ * 0.35);
    mesh.scale.setScalar(scale * (0.8 + Math.random() * 0.4));
    mesh.rotation.z = Math.random() * Math.PI;
    (mesh.material as THREE.MeshBasicMaterial).opacity = 1;
    p.life = 0.05;
    p.maxLife = 0.05;

    this.muzzleLight.position.copy(mesh.position);
    this.muzzleLight.intensity = 14 * scale;
    this.muzzleLight.visible = true;
    this.muzzleLightLife = 0.05;
  }

  spawnImpact(point: Vec3, normal: Vec3, surface: SolidKind): void {
    const color = IMPACT_COLORS[surface] ?? 0xd8c49a;

    const d = this.take(this.decals);
    const decal = d.object as THREE.Mesh;
    decal.visible = true;
    decal.position.set(
      point.x + normal.x * 0.012,
      point.y + normal.y * 0.012,
      point.z + normal.z * 0.012,
    );
    decal.lookAt(point.x + normal.x, point.y + normal.y, point.z + normal.z);
    decal.rotation.z = Math.random() * Math.PI;
    decal.scale.setScalar(0.55 + Math.random() * 0.5);
    (decal.material as THREE.MeshBasicMaterial).opacity = 0.8;
    d.life = 7;
    d.maxLife = 7;

    for (let i = 0; i < 4; i++) {
      const s = this.take(this.sparks);
      const mesh = s.object as THREE.Mesh;
      mesh.visible = true;
      mesh.position.set(point.x, point.y, point.z);
      mesh.scale.setScalar(0.6 + Math.random());
      (mesh.material as THREE.MeshBasicMaterial).color.setHex(color);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 1;
      s.vx = normal.x * 2 + (Math.random() - 0.5) * 3;
      s.vy = normal.y * 2 + Math.random() * 3;
      s.vz = normal.z * 2 + (Math.random() - 0.5) * 3;
      s.life = 0.3 + Math.random() * 0.25;
      s.maxLife = s.life;
    }

    const puff = this.take(this.smoke);
    const pm = puff.object as THREE.Mesh;
    pm.visible = true;
    pm.position.set(point.x + normal.x * 0.1, point.y + normal.y * 0.1, point.z + normal.z * 0.1);
    pm.scale.setScalar(0.5);
    (pm.material as THREE.MeshBasicMaterial).opacity = 0.35;
    puff.vx = normal.x * 0.4;
    puff.vy = 0.5;
    puff.vz = normal.z * 0.4;
    puff.life = 0.5;
    puff.maxLife = 0.5;
  }

  spawnBlood(point: Vec3): void {
    for (let i = 0; i < 7; i++) {
      const s = this.take(this.sparks);
      const mesh = s.object as THREE.Mesh;
      mesh.visible = true;
      mesh.position.set(point.x, point.y, point.z);
      mesh.scale.setScalar(0.8 + Math.random() * 0.8);
      (mesh.material as THREE.MeshBasicMaterial).color.setHex(0x9d1414);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 1;
      s.vx = (Math.random() - 0.5) * 3.2;
      s.vy = 0.6 + Math.random() * 2.4;
      s.vz = (Math.random() - 0.5) * 3.2;
      s.life = 0.35 + Math.random() * 0.3;
      s.maxLife = s.life;
    }
  }

  spawnExplosion(pos: Vec3): void {
    this.explosionMesh.visible = true;
    this.explosionMesh.position.set(pos.x, pos.y + 0.5, pos.z);
    this.explosionMesh.scale.setScalar(1);
    this.explosionLife = 0.9;

    this.explosionLight.position.set(pos.x, pos.y + 2, pos.z);
    this.explosionLight.intensity = 300;
    this.explosionLight.visible = true;
    this.explosionLightLife = 0.7;

    for (let i = 0; i < 20; i++) {
      const s = this.take(this.sparks);
      const mesh = s.object as THREE.Mesh;
      mesh.visible = true;
      mesh.position.set(pos.x, pos.y + 0.3, pos.z);
      mesh.scale.setScalar(1.5 + Math.random() * 2);
      (mesh.material as THREE.MeshBasicMaterial).color.setHex(0xffa040);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 1;
      const a = Math.random() * Math.PI * 2;
      const sp = 6 + Math.random() * 14;
      s.vx = Math.cos(a) * sp;
      s.vy = 2 + Math.random() * 10;
      s.vz = Math.sin(a) * sp;
      s.life = 0.7 + Math.random() * 0.6;
      s.maxLife = s.life;
    }

    for (let i = 0; i < 14; i++) {
      const p = this.take(this.smoke);
      const mesh = p.object as THREE.Mesh;
      mesh.visible = true;
      const a = Math.random() * Math.PI * 2;
      mesh.position.set(pos.x + Math.cos(a) * 2, pos.y + 0.4 + Math.random() * 2, pos.z + Math.sin(a) * 2);
      mesh.scale.setScalar(3 + Math.random() * 3);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.55;
      p.vx = Math.cos(a) * 2.2;
      p.vy = 1.6 + Math.random();
      p.vz = Math.sin(a) * 2.2;
      p.life = 1.6 + Math.random();
      p.maxLife = p.life;
    }
  }

  // ------------------------------------------------------------------ update

  update(dt: number, cameraPos: THREE.Vector3): void {
    for (const p of this.tracers) {
      if (p.life <= 0) continue;
      p.life -= dt;
      const m = p.object as THREE.Mesh;
      const t = Math.max(0, p.life / p.maxLife);
      (m.material as THREE.MeshBasicMaterial).opacity = t * 0.85;
      if (p.life <= 0) m.visible = false;
    }

    for (const p of this.flashes) {
      if (p.life <= 0) continue;
      p.life -= dt;
      const m = p.object as THREE.Mesh;
      m.lookAt(cameraPos);
      const t = Math.max(0, p.life / p.maxLife);
      (m.material as THREE.MeshBasicMaterial).opacity = t;
      if (p.life <= 0) m.visible = false;
    }

    for (const p of this.sparks) {
      if (p.life <= 0) continue;
      p.life -= dt;
      const m = p.object;
      p.vy -= 16 * dt;
      m.position.x += p.vx * dt;
      m.position.y += p.vy * dt;
      m.position.z += p.vz * dt;
      const t = Math.max(0, p.life / p.maxLife);
      ((m as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = t;
      if (p.life <= 0) m.visible = false;
    }

    for (const p of this.smoke) {
      if (p.life <= 0) continue;
      p.life -= dt;
      const m = p.object as THREE.Mesh;
      m.position.x += p.vx * dt;
      m.position.y += p.vy * dt;
      m.position.z += p.vz * dt;
      p.vx *= 1 - dt;
      p.vz *= 1 - dt;
      m.scale.multiplyScalar(1 + dt * 0.8);
      m.lookAt(cameraPos);
      const t = Math.max(0, p.life / p.maxLife);
      (m.material as THREE.MeshBasicMaterial).opacity = t * 0.5;
      if (p.life <= 0) m.visible = false;
    }

    for (const p of this.decals) {
      if (p.life <= 0) continue;
      p.life -= dt;
      const m = p.object as THREE.Mesh;
      const t = Math.max(0, p.life / p.maxLife);
      (m.material as THREE.MeshBasicMaterial).opacity = Math.min(0.8, t * 2);
      if (p.life <= 0) m.visible = false;
    }

    if (this.muzzleLightLife > 0) {
      this.muzzleLightLife -= dt;
      this.muzzleLight.intensity *= Math.max(0, 1 - dt * 25);
      if (this.muzzleLightLife <= 0) this.muzzleLight.visible = false;
    }

    if (this.explosionLightLife > 0) {
      this.explosionLightLife -= dt;
      this.explosionLight.intensity *= Math.max(0, 1 - dt * 4);
      if (this.explosionLightLife <= 0) this.explosionLight.visible = false;
    }

    if (this.explosionLife > 0) {
      this.explosionLife -= dt;
      const t = Math.max(0, this.explosionLife / 0.9);
      this.explosionMesh.scale.setScalar(1 + (1 - t) * 11);
      (this.explosionMesh.material as THREE.MeshBasicMaterial).opacity = t * 0.85;
      if (this.explosionLife <= 0) this.explosionMesh.visible = false;
    }
  }

  dispose(): void {
    const all = [...this.tracers, ...this.sparks, ...this.decals, ...this.flashes, ...this.smoke];
    for (const p of all) {
      this.scene.remove(p.object);
      const m = p.object as THREE.Mesh;
      if (m.material) (m.material as THREE.Material).dispose();
    }
    this.tracerGeo.dispose();
    this.sparkGeo.dispose();
    this.decalGeo.dispose();
    this.flashGeo.dispose();
    this.flashTexture.dispose();
    this.smokeTexture.dispose();
    this.explosionMesh.geometry.dispose();
    (this.explosionMesh.material as THREE.Material).dispose();
    this.scene.remove(this.explosionMesh);
    this.scene.remove(this.muzzleLight);
    this.scene.remove(this.explosionLight);
  }
}

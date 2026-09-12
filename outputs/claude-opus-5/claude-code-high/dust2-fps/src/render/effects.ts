import * as THREE from 'three';
import type { Vec3 } from '../core/math.ts';

/** Soft radial sprite, generated on a canvas — no image files anywhere. */
function radialTexture(inner: string, outer: string): THREE.Texture {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.45, outer);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface Tracer {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
}

interface Puff {
  sprite: THREE.Sprite;
  life: number;
  maxLife: number;
  vel: THREE.Vector3;
  growth: number;
  startScale: number;
}

interface Decal {
  mesh: THREE.Mesh;
  life: number;
}

/**
 * Pooled transient visuals: tracers, impact puffs, blood, bullet holes,
 * world muzzle flashes and the C4 detonation. Everything is recycled, so the
 * firefights never allocate during play.
 */
export class Effects {
  private scene: THREE.Scene;
  private tracers: Tracer[] = [];
  private puffs: Puff[] = [];
  private decals: Decal[] = [];
  private decalCursor = 0;
  private flashes: { light: THREE.PointLight; life: number }[] = [];
  private explosions: { mesh: THREE.Mesh; light: THREE.PointLight; life: number }[] = [];

  private smokeTex = radialTexture('rgba(255,255,255,0.95)', 'rgba(190,175,150,0.5)');
  private bloodTex = radialTexture('rgba(255,60,50,0.95)', 'rgba(140,10,10,0.5)');
  private sparkTex = radialTexture('rgba(255,240,180,1)', 'rgba(255,170,40,0.6)');

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    const tracerGeo = new THREE.BoxGeometry(0.035, 0.035, 1);
    tracerGeo.translate(0, 0, 0.5); // grows along +Z, which is where lookAt points
    for (let i = 0; i < 40; i++) {
      const mesh = new THREE.Mesh(
        tracerGeo,
        new THREE.MeshBasicMaterial({
          color: 0xffe9b0,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      mesh.visible = false;
      mesh.frustumCulled = false;
      this.scene.add(mesh);
      this.tracers.push({ mesh, life: 0, maxLife: 1 });
    }

    for (let i = 0; i < 90; i++) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: this.smokeTex, transparent: true, opacity: 0, depthWrite: false }),
      );
      sprite.visible = false;
      this.scene.add(sprite);
      this.puffs.push({ sprite, life: 0, maxLife: 1, vel: new THREE.Vector3(), growth: 1, startScale: 0.2 });
    }

    const decalGeo = new THREE.PlaneGeometry(0.12, 0.12);
    for (let i = 0; i < 48; i++) {
      const mesh = new THREE.Mesh(
        decalGeo,
        new THREE.MeshBasicMaterial({
          color: 0x20180f,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -4,
        }),
      );
      mesh.visible = false;
      this.scene.add(mesh);
      this.decals.push({ mesh, life: 0 });
    }

    for (let i = 0; i < 8; i++) {
      const light = new THREE.PointLight(0xffc978, 0, 8);
      light.visible = false;
      this.scene.add(light);
      this.flashes.push({ light, life: 0 });
    }

    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 12),
        new THREE.MeshBasicMaterial({
          color: 0xffb457,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      mesh.visible = false;
      this.scene.add(mesh);
      const light = new THREE.PointLight(0xffa040, 0, 45);
      light.visible = false;
      this.scene.add(light);
      this.explosions.push({ mesh, light, life: 0 });
    }
  }

  spawnTracer(from: Vec3, to: Vec3, width = 1): void {
    const t = this.tracers.find((x) => x.life <= 0);
    if (!t) return;
    const start = new THREE.Vector3(from.x, from.y, from.z);
    const end = new THREE.Vector3(to.x, to.y, to.z);
    const len = start.distanceTo(end);
    if (len < 0.2) return;
    t.mesh.position.copy(start);
    t.mesh.lookAt(end);
    t.mesh.scale.set(width, width, len);
    t.mesh.visible = true;
    t.maxLife = 0.06 + Math.min(0.06, len * 0.001);
    t.life = t.maxLife;
    (t.mesh.material as THREE.MeshBasicMaterial).opacity = 0.85;
  }

  private spawnPuff(
    pos: Vec3,
    tex: THREE.Texture,
    color: number,
    count: number,
    speed: number,
    scale: number,
    life: number,
    growth: number,
  ): void {
    for (let i = 0; i < count; i++) {
      const p = this.puffs.find((x) => x.life <= 0);
      if (!p) return;
      p.sprite.position.set(pos.x, pos.y, pos.z);
      p.vel.set(
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.2) * speed,
        (Math.random() - 0.5) * speed,
      );
      p.startScale = scale * (0.6 + Math.random() * 0.8);
      p.growth = growth;
      p.maxLife = life * (0.7 + Math.random() * 0.6);
      p.life = p.maxLife;
      p.sprite.scale.setScalar(p.startScale);
      p.sprite.visible = true;
      const mat = p.sprite.material as THREE.SpriteMaterial;
      mat.map = tex;
      mat.color.setHex(color);
      mat.opacity = 0.85;
      mat.needsUpdate = true;
    }
  }

  spawnImpact(point: Vec3, normal: Vec3, surface: 'world' | 'flesh'): void {
    if (surface === 'flesh') {
      this.spawnPuff(point, this.bloodTex, 0xffffff, 4, 1.6, 0.16, 0.42, 1.5);
      return;
    }
    const off = { x: point.x + normal.x * 0.02, y: point.y + normal.y * 0.02, z: point.z + normal.z * 0.02 };
    this.spawnPuff(off, this.smokeTex, 0xd8cbb0, 3, 0.9, 0.14, 0.5, 2.6);
    this.spawnPuff(off, this.sparkTex, 0xffffff, 1, 2.4, 0.07, 0.12, 0.6);
    this.spawnDecal(point, normal);
  }

  private spawnDecal(point: Vec3, normal: Vec3): void {
    const d = this.decals[this.decalCursor % this.decals.length];
    this.decalCursor++;
    d.mesh.position.set(point.x + normal.x * 0.012, point.y + normal.y * 0.012, point.z + normal.z * 0.012);
    const target = new THREE.Vector3(
      point.x + normal.x,
      point.y + normal.y,
      point.z + normal.z,
    );
    d.mesh.lookAt(target);
    d.mesh.rotation.z = Math.random() * Math.PI;
    d.mesh.visible = true;
    d.life = 14;
    (d.mesh.material as THREE.MeshBasicMaterial).opacity = 0.75;
  }

  spawnMuzzleFlash(pos: Vec3): void {
    const f = this.flashes.find((x) => x.life <= 0);
    this.spawnPuff(pos, this.sparkTex, 0xffffff, 1, 0.5, 0.28, 0.06, 0.4);
    if (!f) return;
    f.light.position.set(pos.x, pos.y, pos.z);
    f.light.visible = true;
    f.light.intensity = 14;
    f.life = 0.06;
  }

  spawnBlood(point: Vec3): void {
    this.spawnPuff(point, this.bloodTex, 0xffffff, 6, 2.2, 0.2, 0.5, 1.4);
  }

  spawnExplosion(point: Vec3): void {
    const e = this.explosions.find((x) => x.life <= 0) ?? this.explosions[0];
    e.mesh.position.set(point.x, point.y + 1, point.z);
    e.mesh.scale.setScalar(1);
    e.mesh.visible = true;
    e.light.position.set(point.x, point.y + 2, point.z);
    e.light.visible = true;
    e.light.intensity = 400;
    e.life = 1.1;
    (e.mesh.material as THREE.MeshBasicMaterial).opacity = 1;
    this.spawnPuff({ x: point.x, y: point.y + 1, z: point.z }, this.smokeTex, 0x6b6155, 26, 9, 2.2, 2.4, 2.2);
    this.spawnPuff({ x: point.x, y: point.y + 1, z: point.z }, this.sparkTex, 0xffffff, 14, 16, 0.5, 0.55, 1.0);
  }

  update(dt: number): void {
    for (const t of this.tracers) {
      if (t.life <= 0) continue;
      t.life -= dt;
      const mat = t.mesh.material as THREE.MeshBasicMaterial;
      if (t.life <= 0) {
        t.mesh.visible = false;
        mat.opacity = 0;
      } else {
        mat.opacity = 0.85 * (t.life / t.maxLife);
      }
    }

    for (const p of this.puffs) {
      if (p.life <= 0) continue;
      p.life -= dt;
      const mat = p.sprite.material as THREE.SpriteMaterial;
      if (p.life <= 0) {
        p.sprite.visible = false;
        mat.opacity = 0;
        continue;
      }
      const t = 1 - p.life / p.maxLife;
      p.sprite.position.x += p.vel.x * dt;
      p.sprite.position.y += p.vel.y * dt;
      p.sprite.position.z += p.vel.z * dt;
      p.vel.multiplyScalar(1 - 2.2 * dt);
      p.vel.y -= 1.2 * dt;
      p.sprite.scale.setScalar(p.startScale * (1 + t * p.growth));
      mat.opacity = 0.85 * (1 - t) * (1 - t);
    }

    for (const d of this.decals) {
      if (d.life <= 0) continue;
      d.life -= dt;
      const mat = d.mesh.material as THREE.MeshBasicMaterial;
      if (d.life <= 0) {
        d.mesh.visible = false;
        mat.opacity = 0;
      } else if (d.life < 2) {
        mat.opacity = 0.75 * (d.life / 2);
      }
    }

    for (const f of this.flashes) {
      if (f.life <= 0) continue;
      f.life -= dt;
      if (f.life <= 0) {
        f.light.visible = false;
        f.light.intensity = 0;
      } else {
        f.light.intensity = 14 * (f.life / 0.06);
      }
    }

    for (const e of this.explosions) {
      if (e.life <= 0) continue;
      e.life -= dt;
      const mat = e.mesh.material as THREE.MeshBasicMaterial;
      if (e.life <= 0) {
        e.mesh.visible = false;
        e.light.visible = false;
        mat.opacity = 0;
        continue;
      }
      const t = 1 - e.life / 1.1;
      e.mesh.scale.setScalar(1 + t * 9);
      mat.opacity = (1 - t) * 0.85;
      e.light.intensity = 400 * (1 - t);
    }
  }
}

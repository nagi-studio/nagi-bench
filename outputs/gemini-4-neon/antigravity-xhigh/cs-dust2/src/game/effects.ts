import * as THREE from 'three';
import { Vec3 } from './types';
import { createWeaponMesh } from './viewmodel';

interface TracerItem {
  line: THREE.Line;
  life: number;
  maxLife: number;
}

interface ParticleItem {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  gravity: number;
}

interface DecalItem {
  mesh: THREE.Mesh;
  life: number;
}

export class EffectsManager {
  public readonly group = new THREE.Group();
  private tracers: TracerItem[] = [];
  private particles: ParticleItem[] = [];
  private decals: DecalItem[] = [];

  // World C4 prop (dropped or planted)
  public readonly c4WorldProp = new THREE.Group();
  private c4BeaconLight: THREE.PointLight;
  private c4HaloRing: THREE.Mesh;
  private c4LedMesh: THREE.Object3D | null = null;

  // Explosion sphere
  private explosionMesh: THREE.Mesh;
  private explosionLight: THREE.PointLight;
  private explosionTimer = 0;

  private sharedBoxGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
  private sharedDecalGeo = new THREE.CircleGeometry(0.065, 8);
  private matSpark = new THREE.MeshBasicMaterial({ color: 0xffd26b });
  private matDust = new THREE.MeshBasicMaterial({ color: 0xcab087 });
  private matBlood = new THREE.MeshBasicMaterial({ color: 0xb81d1d });
  private matFire = new THREE.MeshBasicMaterial({ color: 0xff6b22 });
  private matHole = new THREE.MeshBasicMaterial({
    color: 0x1e1a16,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
  });

  constructor() {
    // Build C4 world prop
    const c4Model = createWeaponMesh('c4');
    c4Model.scale.setScalar(1.35);
    c4Model.position.set(0, 0.08, 0);
    this.c4WorldProp.add(c4Model);
    this.c4LedMesh = c4Model.getObjectByName('c4_led') ?? null;

    this.c4BeaconLight = new THREE.PointLight(0xff2b2b, 0, 9);
    this.c4BeaconLight.position.set(0, 0.35, 0);
    this.c4WorldProp.add(this.c4BeaconLight);

    this.c4HaloRing = new THREE.Mesh(
      new THREE.RingGeometry(0.32, 0.42, 20),
      new THREE.MeshBasicMaterial({
        color: 0xffb33b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.72,
      })
    );
    this.c4HaloRing.rotation.x = -Math.PI / 2;
    this.c4HaloRing.position.y = 0.04;
    this.c4WorldProp.add(this.c4HaloRing);
    this.c4WorldProp.visible = false;
    this.group.add(this.c4WorldProp);

    // Explosion fireball
    this.explosionMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 18, 14),
      new THREE.MeshBasicMaterial({ color: 0xff7e24, transparent: true, opacity: 0.9 })
    );
    this.explosionMesh.visible = false;
    this.group.add(this.explosionMesh);

    this.explosionLight = new THREE.PointLight(0xff8a30, 0, 55);
    this.group.add(this.explosionLight);
  }

  public spawnTracer(from: Vec3, to: Vec3, color = 0xffe49e): void {
    const pts = [new THREE.Vector3(from.x, from.y, from.z), new THREE.Vector3(to.x, to.y, to.z)];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 });
    const line = new THREE.Line(geo, mat);
    this.group.add(line);
    this.tracers.push({ line, life: 0.065, maxLife: 0.065 });
  }

  public spawnWallImpact(pos: Vec3, normal: Vec3, isMetal = false): void {
    // Bullet hole decal
    const decal = new THREE.Mesh(this.sharedDecalGeo, this.matHole);
    decal.position.set(
      pos.x + normal.x * 0.015,
      pos.y + normal.y * 0.015,
      pos.z + normal.z * 0.015
    );
    decal.lookAt(pos.x + normal.x, pos.y + normal.y, pos.z + normal.z);
    this.group.add(decal);
    this.decals.push({ mesh: decal, life: 14 });
    if (this.decals.length > 65) {
      const oldest = this.decals.shift()!;
      this.group.remove(oldest.mesh);
    }

    // Impact sparks / desert dust particles
    const count = isMetal ? 7 : 5;
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(this.sharedBoxGeo, isMetal ? this.matSpark : this.matDust);
      m.position.set(pos.x, pos.y, pos.z);
      const speed = 2.2 + Math.random() * 3.8;
      this.group.add(m);
      this.particles.push({
        mesh: m,
        vx: (normal.x + (Math.random() - 0.5) * 1.2) * speed,
        vy: (normal.y + Math.random() * 0.9) * speed,
        vz: (normal.z + (Math.random() - 0.5) * 1.2) * speed,
        life: 0.25 + Math.random() * 0.2,
        maxLife: 0.45,
        gravity: 12,
      });
    }
  }

  public spawnBloodImpact(pos: Vec3, headshot: boolean): void {
    const count = headshot ? 11 : 6;
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(this.sharedBoxGeo, this.matBlood);
      m.scale.setScalar(headshot ? 1.3 : 0.95);
      m.position.set(pos.x, pos.y, pos.z);
      this.group.add(m);
      this.particles.push({
        mesh: m,
        vx: (Math.random() - 0.5) * 5.2,
        vy: 1.0 + Math.random() * 3.4,
        vz: (Math.random() - 0.5) * 5.2,
        life: 0.28 + Math.random() * 0.22,
        maxLife: 0.5,
        gravity: 14,
      });
    }
  }

  public triggerExplosion(pos: Vec3): void {
    this.explosionTimer = 1.4;
    this.explosionMesh.visible = true;
    this.explosionMesh.position.set(pos.x, pos.y + 0.8, pos.z);
    this.explosionMesh.scale.setScalar(1);
    this.explosionLight.position.set(pos.x, pos.y + 2.5, pos.z);
    this.explosionLight.intensity = 140;

    for (let i = 0; i < 42; i++) {
      const m = new THREE.Mesh(
        this.sharedBoxGeo,
        i % 3 === 0 ? this.matFire : i % 3 === 1 ? this.matSpark : this.matDust
      );
      m.scale.setScalar(2.4 + Math.random() * 3.2);
      m.position.set(pos.x, pos.y + 0.5, pos.z);
      this.group.add(m);
      const ang = Math.random() * Math.PI * 2;
      const spd = 6 + Math.random() * 14;
      this.particles.push({
        mesh: m,
        vx: Math.cos(ang) * spd,
        vy: 5 + Math.random() * 12,
        vz: Math.sin(ang) * spd,
        life: 0.7 + Math.random() * 0.8,
        maxLife: 1.5,
        gravity: 15,
      });
    }
  }

  public updateC4Prop(
    visible: boolean,
    pos: Vec3 | null,
    isPlanted: boolean,
    blinkOn: boolean,
    elapsed: number
  ): void {
    this.c4WorldProp.visible = visible && pos !== null;
    if (!visible || !pos) return;
    this.c4WorldProp.position.set(pos.x, pos.y, pos.z);
    if (isPlanted) {
      this.c4BeaconLight.color.setHex(0xff2222);
      this.c4BeaconLight.intensity = blinkOn ? 12 : 0.8;
      if (this.c4LedMesh) this.c4LedMesh.visible = blinkOn;
      (this.c4HaloRing.material as THREE.MeshBasicMaterial).color.setHex(0xff3322);
      const pulse = 1 + Math.sin(elapsed * 8) * 0.18;
      this.c4HaloRing.scale.setScalar(pulse);
    } else {
      // Dropped bomb: warm amber pickup glow
      this.c4BeaconLight.color.setHex(0xffb833);
      this.c4BeaconLight.intensity = 4 + Math.sin(elapsed * 5) * 2;
      if (this.c4LedMesh) this.c4LedMesh.visible = true;
      (this.c4HaloRing.material as THREE.MeshBasicMaterial).color.setHex(0xffc947);
      this.c4HaloRing.scale.setScalar(1.1 + Math.sin(elapsed * 5) * 0.15);
    }
  }

  public clearRoundDecals(): void {
    for (const d of this.decals) {
      this.group.remove(d.mesh);
    }
    this.decals = [];
  }

  public update(dt: number): void {
    // Tracers
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= dt;
      if (t.life <= 0) {
        this.group.remove(t.line);
        t.line.geometry.dispose();
        (t.line.material as THREE.Material).dispose();
        this.tracers.splice(i, 1);
      } else {
        (t.line.material as THREE.LineBasicMaterial).opacity = t.life / t.maxLife;
      }
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.group.remove(p.mesh);
        this.particles.splice(i, 1);
      } else {
        p.vy -= p.gravity * dt;
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.mesh.rotation.x += dt * 6;
        p.mesh.rotation.y += dt * 5;
        const s = Math.max(0.05, p.life / p.maxLife);
        p.mesh.scale.multiplyScalar(Math.pow(0.85, dt * 8) * (s > 0 ? 1 : 0.01));
      }
    }

    // Decals lifetime
    for (let i = this.decals.length - 1; i >= 0; i--) {
      this.decals[i].life -= dt;
      if (this.decals[i].life <= 0) {
        this.group.remove(this.decals[i].mesh);
        this.decals.splice(i, 1);
      }
    }

    // Explosion expansion & fade
    if (this.explosionTimer > 0) {
      this.explosionTimer -= dt;
      const t = 1 - Math.max(0, this.explosionTimer / 1.4);
      const radius = 1.5 + t * 18;
      this.explosionMesh.scale.setScalar(radius);
      (this.explosionMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - t) * 0.85);
      this.explosionLight.intensity = Math.max(0, (1 - t) * 140);
      if (this.explosionTimer <= 0) {
        this.explosionMesh.visible = false;
        this.explosionLight.intensity = 0;
      }
    }
  }
}

// ============================================================================
// 特效 —— 弹道、命中火花、枪口闪光、爆炸、血液粒子（全部程序化）
// ============================================================================
import * as THREE from 'three';

interface Tracer {
  mesh: THREE.Mesh;
  life: number;
  max: number;
}
interface Particle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  max: number;
  gravity: number;
}

const TRACER_GEO = new THREE.CylinderGeometry(0.008, 0.008, 1, 4, 1, true);
const PARTICLE_GEO = new THREE.BoxGeometry(0.05, 0.05, 0.05);
const SPARK_MAT = new THREE.MeshBasicMaterial({ color: 0xffd98a });
const BLOOD_MAT = new THREE.MeshBasicMaterial({ color: 0x8a1a12 });

export class Effects {
  private tracers: Tracer[] = [];
  private particles: Particle[] = [];
  flashMesh: THREE.Mesh;
  flashLight: THREE.PointLight;
  explosionGroup = new THREE.Group();
  private explosionLife = 0;
  private scene: THREE.Scene;
  private maxTracers = 40;
  private maxParticles = 160;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    // 枪口闪光（放在相机空间？简化：世界坐标闪现）
    this.flashMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xffe2a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    this.flashMesh.visible = false;
    this.flashLight = new THREE.PointLight(0xffc870, 0, 12, 2);
    scene.add(this.flashMesh);
    scene.add(this.flashLight);
    // 爆炸组
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 20, 14),
      new THREE.MeshBasicMaterial({ color: 0xffd080, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 2.2, 40),
      new THREE.MeshBasicMaterial({ color: 0xffb050, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    this.explosionGroup.add(core);
    this.explosionGroup.add(ring);
    this.explosionGroup.visible = false;
    scene.add(this.explosionGroup);
  }

  tracer(from: THREE.Vector3, to: THREE.Vector3) {
    if (this.tracers.length >= this.maxTracers) {
      const old = this.tracers.shift()!;
      this.scene.remove(old.mesh);
    }
    const dir = to.clone().sub(from);
    const len = dir.length();
    const mesh = new THREE.Mesh(TRACER_GEO, new THREE.MeshBasicMaterial({ color: 0xffe8b0, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
    mesh.position.copy(from).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    mesh.scale.set(1, len, 1);
    this.scene.add(mesh);
    this.tracers.push({ mesh, life: 0.07, max: 0.07 });
  }

  sparks(at: THREE.Vector3, count = 5) {
    this.burst(at, SPARK_MAT, count, 3.2, 0.45, 2);
  }
  blood(at: THREE.Vector3, count = 4) {
    this.burst(at, BLOOD_MAT, count, 2.2, 0.4, 1.4);
  }
  private burst(at: THREE.Vector3, mat: THREE.Material, count: number, speed: number, life: number, grav: number) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        const old = this.particles.shift()!;
        this.scene.remove(old.mesh);
      }
      const mesh = new THREE.Mesh(PARTICLE_GEO, mat);
      mesh.position.copy(at);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 0.8,
        (Math.random() - 0.5) * 2,
      ).normalize().multiplyScalar(speed * (0.5 + Math.random() * 0.7));
      vel.y += speed * 0.5;
      this.scene.add(mesh);
      this.particles.push({ mesh, vel, life, max: life, gravity: grav });
    }
  }

  flash(at: THREE.Vector3, dir: THREE.Vector3) {
    this.flashMesh.visible = true;
    this.flashMesh.position.copy(at).addScaledVector(dir, 0.05);
    this.flashMesh.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir));
    this.flashMesh.rotation.z = Math.random() * Math.PI * 2;
    this.flashMesh.scale.setScalar(0.7 + Math.random() * 0.7);
    (this.flashMesh.material as THREE.MeshBasicMaterial).opacity = 0.9;
    this.flashLight.position.copy(at);
    this.flashLight.intensity = 30;
  }

  explode(at: THREE.Vector3) {
    this.explosionGroup.visible = true;
    this.explosionGroup.position.copy(at);
    this.explosionLife = 1.4;
    this.burst(at, SPARK_MAT, 40, 12, 0.9, 4);
    this.flashLight.position.copy(at);
    this.flashLight.intensity = 300;
    this.flashLight.distance = 60;
  }

  update(dt: number) {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= dt;
      (t.mesh.material as THREE.MeshBasicMaterial).opacity = 0.9 * Math.max(0, t.life / t.max);
      if (t.life <= 0) {
        this.scene.remove(t.mesh);
        this.tracers.splice(i, 1);
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.vel.y -= p.gravity * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      const s = Math.max(0.3, p.life / p.max);
      p.mesh.scale.setScalar(s);
      if (p.life <= 0 || p.mesh.position.y < 0.01) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }
    // 枪口闪光衰减
    if (this.flashMesh.visible) {
      const m = this.flashMesh.material as THREE.MeshBasicMaterial;
      m.opacity -= dt * 14;
      if (m.opacity <= 0) this.flashMesh.visible = false;
    }
    this.flashLight.intensity = Math.max(0, this.flashLight.intensity - dt * 260);
    // 爆炸
    if (this.explosionGroup.visible) {
      this.explosionLife -= dt;
      const s = 1 + (1.4 - this.explosionLife) * 9;
      this.explosionGroup.scale.setScalar(s);
      const core = this.explosionGroup.children[0] as THREE.Mesh;
      (core.material as THREE.MeshBasicMaterial).opacity = Math.max(0, this.explosionLife / 1.4) * 0.85;
      const ring = this.explosionGroup.children[1] as THREE.Mesh;
      (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, this.explosionLife / 1.4) * 0.7;
      if (this.explosionLife <= 0) this.explosionGroup.visible = false;
    }
  }

  clear() {
    for (const t of this.tracers) this.scene.remove(t.mesh);
    for (const p of this.particles) this.scene.remove(p.mesh);
    this.tracers = [];
    this.particles = [];
    this.flashMesh.visible = false;
    this.explosionGroup.visible = false;
    this.flashLight.intensity = 0;
  }
}

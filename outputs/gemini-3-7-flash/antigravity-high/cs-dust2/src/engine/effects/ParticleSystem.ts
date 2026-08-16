import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  size: number;
  life: number;
  maxLife: number;
  type: 'spark' | 'smoke' | 'blood' | 'debris';
}

interface Tracer {
  line: THREE.Line;
  start: THREE.Vector3;
  end: THREE.Vector3;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  public scene: THREE.Group;
  private particles: Particle[] = [];
  private tracers: Tracer[] = [];

  // Instanced / Batched point clouds for high performance
  private pointGeo: THREE.BufferGeometry;
  private pointMat: THREE.PointsMaterial;
  private pointsMesh: THREE.Points;

  // Max particles buffer
  private maxParticles = 600;
  private positions: Float32Array;
  private colors: Float32Array;

  // Explosion state
  public screenShake: number = 0;

  constructor() {
    this.scene = new THREE.Group();

    this.positions = new Float32Array(this.maxParticles * 3);
    this.colors = new Float32Array(this.maxParticles * 3);

    this.pointGeo = new THREE.BufferGeometry();
    this.pointGeo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.pointGeo.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    this.pointMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.NormalBlending
    });

    this.pointsMesh = new THREE.Points(this.pointGeo, this.pointMat);
    this.scene.add(this.pointsMesh);
  }

  public addBulletTracer(from: THREE.Vector3, to: THREE.Vector3) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    const mat = new THREE.LineBasicMaterial({
      color: 0xffea78,
      transparent: true,
      opacity: 0.85,
      linewidth: 2
    });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.tracers.push({
      line,
      start: from.clone(),
      end: to.clone(),
      life: 0.08,
      maxLife: 0.08
    });
  }

  public addImpactSparks(point: THREE.Vector3, normal: THREE.Vector3) {
    const count = 10;
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) this.particles.shift();
      const vel = normal.clone().multiplyScalar(2 + Math.random() * 4);
      vel.x += (Math.random() - 0.5) * 3;
      vel.y += (Math.random() - 0.5) * 3;
      vel.z += (Math.random() - 0.5) * 3;

      this.particles.push({
        position: point.clone().add(normal.clone().multiplyScalar(0.05)),
        velocity: vel,
        color: new THREE.Color(0xffbb33),
        size: 0.08,
        life: 0.2 + Math.random() * 0.15,
        maxLife: 0.35,
        type: 'spark'
      });
    }

    // Sand dust puff
    for (let i = 0; i < 6; i++) {
      if (this.particles.length >= this.maxParticles) this.particles.shift();
      const vel = new THREE.Vector3((Math.random() - 0.5) * 1.5, Math.random() * 1.5, (Math.random() - 0.5) * 1.5);
      this.particles.push({
        position: point.clone(),
        velocity: vel,
        color: new THREE.Color(0xd2b48c),
        size: 0.25,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.7,
        type: 'smoke'
      });
    }
  }

  public addBloodSpurt(point: THREE.Vector3, isHeadshot: boolean, dir?: THREE.Vector3) {
    const count = isHeadshot ? 35 : 18;
    const baseVel = dir ? dir.clone().multiplyScalar(2.5) : new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) this.particles.shift();
      const vel = baseVel.clone();
      vel.x += (Math.random() - 0.5) * 3.5;
      vel.y += (Math.random() * 3);
      vel.z += (Math.random() - 0.5) * 3.5;

      const bloodColor = new THREE.Color(isHeadshot ? 0x990000 : 0xaa1111);
      this.particles.push({
        position: point.clone(),
        velocity: vel,
        color: bloodColor,
        size: isHeadshot ? 0.18 : 0.12,
        life: 0.4 + Math.random() * 0.35,
        maxLife: 0.75,
        type: 'blood'
      });
    }
  }

  public addC4Explosion(center: THREE.Vector3) {
    this.screenShake = 1.2;

    // Shockwave fireball ring
    const ringGeo = new THREE.RingGeometry(0.5, 2.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff7722,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(center).add(new THREE.Vector3(0, 0.1, 0));
    this.scene.add(ring);

    // Expand & fade ring
    let scale = 1.0;
    const ringInterval = setInterval(() => {
      scale += 0.8;
      ring.scale.set(scale, scale, scale);
      ringMat.opacity -= 0.05;
      if (ringMat.opacity <= 0) {
        clearInterval(ringInterval);
        this.scene.remove(ring);
        ringGeo.dispose();
        ringMat.dispose();
      }
    }, 25);

    // Fireball & smoke burst
    for (let i = 0; i < 150; i++) {
      if (this.particles.length >= this.maxParticles) this.particles.shift();
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 18,
        Math.random() * 16 + 2,
        (Math.random() - 0.5) * 18
      );

      const isFire = Math.random() > 0.4;
      const color = isFire
        ? new THREE.Color(0xff4400).lerp(new THREE.Color(0xffcc00), Math.random())
        : new THREE.Color(0x333333);

      this.particles.push({
        position: center.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2, 0.5, (Math.random() - 0.5) * 2)),
        velocity: vel,
        color,
        size: isFire ? 0.4 : 0.6,
        life: 1.0 + Math.random() * 1.5,
        maxLife: 2.5,
        type: 'debris'
      });
    }
  }

  public update(delta: number) {
    // Decay screen shake
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - delta * 2.0);
    }

    // Update Tracers
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= delta;
      const alpha = t.life / t.maxLife;
      (t.line.material as THREE.LineBasicMaterial).opacity = alpha;
      if (t.life <= 0) {
        this.scene.remove(t.line);
        t.line.geometry.dispose();
        (t.line.material as THREE.Material).dispose();
        this.tracers.splice(i, 1);
      }
    }

    // Update Particles
    let activeCount = 0;
    const gravity = new THREE.Vector3(0, -9.8, 0);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Physics
      if (p.type === 'spark' || p.type === 'blood' || p.type === 'debris') {
        p.velocity.addScaledVector(gravity, delta);
      } else if (p.type === 'smoke') {
        p.velocity.y += delta * 0.8; // smoke rises
        p.velocity.x *= 0.95;
        p.velocity.z *= 0.95;
      }

      p.position.addScaledVector(p.velocity, delta);
      if (p.position.y < 0.05) {
        p.position.y = 0.05;
        p.velocity.y *= -0.3; // bounce
      }

      // Write to buffer
      if (activeCount < this.maxParticles) {
        const idx = activeCount * 3;
        this.positions[idx] = p.position.x;
        this.positions[idx + 1] = p.position.y;
        this.positions[idx + 2] = p.position.z;

        const lifeRatio = p.life / p.maxLife;
        this.colors[idx] = p.color.r * lifeRatio;
        this.colors[idx + 1] = p.color.g * lifeRatio;
        this.colors[idx + 2] = p.color.b * lifeRatio;

        activeCount++;
      }
    }

    // Clear unused positions
    for (let i = activeCount; i < this.maxParticles; i++) {
      const idx = i * 3;
      this.positions[idx] = 0;
      this.positions[idx + 1] = -999;
      this.positions[idx + 2] = 0;
    }

    this.pointGeo.attributes.position.needsUpdate = true;
    this.pointGeo.attributes.color.needsUpdate = true;
  }
}

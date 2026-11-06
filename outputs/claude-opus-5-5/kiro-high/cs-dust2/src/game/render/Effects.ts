// Pooled visual effects: moving bullet tracers, impact particles (instanced), bullet-hole
// decals, muzzle-flash point lights and the C4 explosion. Fixed light count so adding
// effects never triggers shader recompilation.

import * as THREE from 'three';
import { glowTexture } from './textures';

interface Tracer {
  mesh: THREE.Mesh;
  from: THREE.Vector3;
  dir: THREE.Vector3;
  len: number;
  t: number;
  speed: number;
  active: boolean;
}

interface Particle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  grav: number;
  color: THREE.Color;
}

const MAX_PARTICLES = 600;
const MAX_DECALS = 140;

export class Effects {
  readonly group = new THREE.Group();
  private tracers: Tracer[] = [];
  private particles: Particle[] = [];
  private inst: THREE.InstancedMesh;
  private decals: THREE.Mesh[] = [];
  private decalIdx = 0;
  private lights: { light: THREE.PointLight; until: number; base: number }[] = [];
  private lightIdx = 0;
  private explosion: { mesh: THREE.Mesh; light: THREE.PointLight; t: number; active: boolean };
  private dummy = new THREE.Object3D();
  private tmp = new THREE.Vector3();
  shake = 0;

  constructor() {
    const tracerMat = new THREE.MeshBasicMaterial({
      color: 0xffe2a0,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const tracerGeo = new THREE.BoxGeometry(0.018, 0.018, 1);
    tracerGeo.translate(0, 0, -0.5);
    for (let i = 0; i < 40; i++) {
      const mesh = new THREE.Mesh(tracerGeo, tracerMat);
      mesh.visible = false;
      mesh.frustumCulled = false;
      this.group.add(mesh);
      this.tracers.push({ mesh, from: new THREE.Vector3(), dir: new THREE.Vector3(), len: 0, t: 0, speed: 0, active: false });
    }

    this.inst = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthWrite: false }),
      MAX_PARTICLES,
    );
    this.inst.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_PARTICLES * 3), 3);
    this.inst.count = 0;
    this.inst.frustumCulled = false;
    this.group.add(this.inst);

    const holeCanvas = document.createElement('canvas');
    holeCanvas.width = holeCanvas.height = 32;
    const hc = holeCanvas.getContext('2d')!;
    const g = hc.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(10,8,6,1)');
    g.addColorStop(0.35, 'rgba(30,24,18,0.9)');
    g.addColorStop(0.6, 'rgba(70,55,35,0.35)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    hc.fillStyle = g;
    hc.fillRect(0, 0, 32, 32);
    const holeTex = new THREE.CanvasTexture(holeCanvas);
    const decalMat = new THREE.MeshBasicMaterial({
      map: holeTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    });
    const decalGeo = new THREE.PlaneGeometry(0.11, 0.11);
    for (let i = 0; i < MAX_DECALS; i++) {
      const d = new THREE.Mesh(decalGeo, decalMat);
      d.visible = false;
      this.group.add(d);
      this.decals.push(d);
    }

    for (let i = 0; i < 4; i++) {
      const light = new THREE.PointLight(0xffb060, 0, 9, 2);
      this.group.add(light);
      this.lights.push({ light, until: 0, base: 0 });
    }

    const exMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20, 14),
      new THREE.MeshBasicMaterial({
        map: glowTexture(),
        color: 0xffa040,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    exMesh.visible = false;
    const exLight = new THREE.PointLight(0xff9a40, 0, 60, 1.5);
    this.group.add(exMesh, exLight);
    this.explosion = { mesh: exMesh, light: exLight, t: 0, active: false };
  }

  tracer(from: THREE.Vector3, to: THREE.Vector3) {
    const tr = this.tracers.find((t) => !t.active) ?? this.tracers[0];
    tr.from.copy(from);
    tr.dir.subVectors(to, from);
    tr.len = tr.dir.length();
    if (tr.len < 0.5) return;
    tr.dir.divideScalar(tr.len);
    tr.t = 0;
    tr.speed = 320;
    tr.active = true;
    tr.mesh.visible = true;
    tr.mesh.position.copy(from);
    // lookAt aims +Z along the travel direction; the geometry trails behind along -Z.
    tr.mesh.lookAt(this.tmp.copy(from).add(tr.dir));
  }

  private spawn(pos: THREE.Vector3, vel: THREE.Vector3, life: number, size: number, color: THREE.Color, grav = 9) {
    if (this.particles.length >= MAX_PARTICLES) this.particles.shift();
    this.particles.push({ pos: pos.clone(), vel: vel.clone(), life, maxLife: life, size, grav, color });
  }

  impact(p: THREE.Vector3, n: THREE.Vector3, kind: 'dust' | 'blood' | 'metal' | 'wood') {
    const base =
      kind === 'blood'
        ? new THREE.Color(0x8a0d0d)
        : kind === 'metal'
          ? new THREE.Color(0xffd27a)
          : kind === 'wood'
            ? new THREE.Color(0x7a5a34)
            : new THREE.Color(0xc9ad80);
    const count = kind === 'blood' ? 9 : 7;
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      v.set(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).multiplyScalar(2.2).addScaledVector(n, 1.6 + Math.random() * 1.5);
      const c = base.clone().multiplyScalar(0.8 + Math.random() * 0.4);
      this.spawn(p, v, 0.25 + Math.random() * 0.35, kind === 'blood' ? 0.04 : 0.03 + Math.random() * 0.03, c, kind === 'metal' ? 12 : 6);
    }
    if (kind !== 'blood') {
      // puff
      for (let i = 0; i < 3; i++) {
        v.copy(n).multiplyScalar(0.6 + Math.random() * 0.5).add(new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.4, Math.random() - 0.5).multiplyScalar(0.5));
        this.spawn(p, v, 0.5 + Math.random() * 0.3, 0.09, new THREE.Color(0xd8c4a0), -0.4);
      }
    }
  }

  decal(p: THREE.Vector3, n: THREE.Vector3) {
    const d = this.decals[this.decalIdx];
    this.decalIdx = (this.decalIdx + 1) % MAX_DECALS;
    d.visible = true;
    d.position.copy(p).addScaledVector(n, 0.004);
    d.lookAt(this.tmp.copy(p).add(n));
    d.rotateZ(Math.random() * Math.PI);
    const s = 0.7 + Math.random() * 0.6;
    d.scale.set(s, s, s);
  }

  clearDecals() {
    for (const d of this.decals) d.visible = false;
  }

  muzzleLight(p: THREE.Vector3, time: number, strength = 1) {
    const l = this.lights[this.lightIdx];
    this.lightIdx = (this.lightIdx + 1) % this.lights.length;
    l.light.position.copy(p);
    l.base = 30 * strength;
    l.light.intensity = l.base;
    l.until = time + 0.06;
  }

  explode(p: THREE.Vector3) {
    const e = this.explosion;
    e.active = true;
    e.t = 0;
    e.mesh.visible = true;
    e.mesh.position.copy(p).setY(p.y + 1);
    e.light.position.copy(p).setY(p.y + 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < 140; i++) {
      v.set(Math.random() - 0.5, Math.random() * 0.9, Math.random() - 0.5).normalize().multiplyScalar(6 + Math.random() * 16);
      const fire = Math.random() < 0.55;
      this.spawn(
        p.clone().setY(p.y + 0.5),
        v,
        fire ? 0.6 + Math.random() * 0.6 : 1.6 + Math.random() * 1.6,
        fire ? 0.25 + Math.random() * 0.3 : 0.5 + Math.random() * 0.6,
        new THREE.Color(fire ? 0xff8a2a : 0x4a4038).multiplyScalar(0.8 + Math.random() * 0.4),
        fire ? 4 : -1.5,
      );
    }
    this.shake = 1.5;
  }

  update(dt: number, time: number) {
    for (const tr of this.tracers) {
      if (!tr.active) continue;
      tr.t += dt * tr.speed;
      const head = Math.min(tr.t, tr.len);
      const tail = Math.max(0, tr.t - 5);
      if (tail >= tr.len) {
        tr.active = false;
        tr.mesh.visible = false;
        continue;
      }
      tr.mesh.position.copy(tr.from).addScaledVector(tr.dir, head);
      tr.mesh.scale.set(1, 1, Math.max(0.01, head - tail));
    }

    // particles
    let n = 0;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.vel.y -= p.grav * dt;
      p.vel.multiplyScalar(1 - Math.min(1, dt * 1.5));
      p.pos.addScaledVector(p.vel, dt);
      if (p.pos.y < 0.01 && p.grav > 0) {
        p.pos.y = 0.01;
        p.vel.set(0, 0, 0);
      }
    }
    for (const p of this.particles) {
      if (n >= MAX_PARTICLES) break;
      const k = p.life / p.maxLife;
      const s = p.size * (p.grav < 0 ? 1 + (1 - k) * 2 : 0.4 + k * 0.6);
      this.dummy.position.copy(p.pos);
      this.dummy.scale.setScalar(s);
      this.dummy.rotation.set(p.life * 3, p.life * 2, 0);
      this.dummy.updateMatrix();
      this.inst.setMatrixAt(n, this.dummy.matrix);
      this.inst.setColorAt(n, p.color);
      n++;
    }
    this.inst.count = n;
    this.inst.instanceMatrix.needsUpdate = true;
    if (this.inst.instanceColor) this.inst.instanceColor.needsUpdate = true;

    for (const l of this.lights) {
      if (l.light.intensity <= 0) continue;
      l.light.intensity = time < l.until ? l.base : Math.max(0, l.light.intensity - dt * 120);
    }

    const e = this.explosion;
    if (e.active) {
      e.t += dt;
      const k = e.t / 1.4;
      const mat = e.mesh.material as THREE.MeshBasicMaterial;
      e.mesh.scale.setScalar(2 + k * 16);
      mat.opacity = Math.max(0, 1 - k);
      e.light.intensity = Math.max(0, 2500 * (1 - k * 1.2));
      if (k >= 1) {
        e.active = false;
        e.mesh.visible = false;
        e.light.intensity = 0;
      }
    }
    this.shake = Math.max(0, this.shake - dt * 1.2);
  }
}

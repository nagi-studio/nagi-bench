/**
 * effects.ts — pooled, procedural combat VFX: tracers, impacts, blood,
 * muzzle flashes and the C4 explosion.
 */

import * as THREE from 'three';

interface PoolItem { mesh: THREE.Mesh; life: number; ttl: number; vel?: THREE.Vector3; kind: string }

export class Effects {
  private scene: THREE.Scene;
  private items: PoolItem[] = [];
  private lights: { light: THREE.PointLight; life: number }[] = [];
  private tracerMat: THREE.MeshBasicMaterial;
  private sparkMat: THREE.MeshBasicMaterial;
  private bloodMat: THREE.MeshBasicMaterial;
  private fireMat: THREE.MeshBasicMaterial;
  private debrisMat: THREE.MeshBasicMaterial;
  private smokeMat: THREE.MeshBasicMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.tracerMat = new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    this.sparkMat = new THREE.MeshBasicMaterial({ color: 0xd8c8a8, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    this.bloodMat = new THREE.MeshBasicMaterial({ color: 0x8e1414, transparent: true, opacity: 0.85, depthWrite: false });
    this.fireMat = new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
    this.debrisMat = new THREE.MeshBasicMaterial({ color: 0x6b5b40 });
    this.smokeMat = new THREE.MeshBasicMaterial({ color: 0x2a2622, transparent: true, opacity: 0.6, depthWrite: false });
  }

  private spawn(kind: string, geo: THREE.BufferGeometry, mat: THREE.Material, pos: THREE.Vector3, ttl: number, vel?: THREE.Vector3): PoolItem {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    this.scene.add(mesh);
    const it: PoolItem = { mesh, life: 0, ttl, vel, kind };
    this.items.push(it);
    return it;
  }

  tracer(from: THREE.Vector3, to: THREE.Vector3) {
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    if (len < 0.2) return;
    const geo = new THREE.BoxGeometry(0.035, 0.035, len);
    const it = this.spawn('tracer', geo, this.tracerMat, from.clone().addScaledVector(dir, 0.5), 0.055);
    it.mesh.lookAt(to);
    it.mesh.visible = true;
  }

  impact(x: number, y: number, z: number) {
    const geo = new THREE.SphereGeometry(0.09, 6, 5);
    this.spawn('puff', geo, this.sparkMat, new THREE.Vector3(x, y, z), 0.16);
    for (let i = 0; i < 3; i++) {
      const g = new THREE.BoxGeometry(0.05, 0.05, 0.05);
      const vel = new THREE.Vector3((Math.random() - 0.5) * 4, Math.random() * 3 + 1, (Math.random() - 0.5) * 4);
      this.spawn('debris', g, this.debrisMat, new THREE.Vector3(x, y, z), 0.5, vel);
    }
  }

  blood(x: number, y: number, z: number, big = false) {
    const geo = new THREE.SphereGeometry(big ? 0.2 : 0.12, 6, 5);
    this.spawn('blood', geo, this.bloodMat, new THREE.Vector3(x, y, z), big ? 0.3 : 0.22);
  }

  muzzle(x: number, y: number, z: number, scale = 1) {
    const geo = new THREE.SphereGeometry(0.11 * scale, 6, 5);
    const it = this.spawn('muzzle', geo, this.fireMat, new THREE.Vector3(x, y, z), 0.05);
    it.mesh.scale.set(1.4, 1.1, 1.9);
    this.flash(x + 0.1, y, z, 2.2 * scale, 0.05);
  }

  explosion(x: number, y: number, z: number) {
    const fire = new THREE.SphereGeometry(2.4, 12, 10);
    const it = this.spawn('boom', fire, this.fireMat, new THREE.Vector3(x, y + 1, z), 0.75);
    it.mesh.scale.set(0.4, 0.4, 0.4);
    const smoke = new THREE.SphereGeometry(3.4, 10, 8);
    const s = this.spawn('smoke', smoke, this.smokeMat, new THREE.Vector3(x, y + 2.2, z), 2.4);
    s.mesh.scale.set(0.3, 0.3, 0.3);
    this.flash(x, y + 2, z, 14, 0.5);
    for (let i = 0; i < 16; i++) {
      const g = new THREE.BoxGeometry(0.16, 0.16, 0.16);
      const vel = new THREE.Vector3((Math.random() - 0.5) * 16, Math.random() * 11 + 2, (Math.random() - 0.5) * 16);
      this.spawn('debris', g, this.debrisMat, new THREE.Vector3(x, y + 0.6, z), 1.6, vel);
    }
  }

  flash(x: number, y: number, z: number, intensity: number, ttl: number) {
    if (this.lights.length > 5) return;
    const light = new THREE.PointLight(0xffc06a, intensity, 26, 2);
    light.position.set(x, y, z);
    this.scene.add(light);
    this.lights.push({ light, life: 0 });
    this.lights[this.lights.length - 1].life = -ttl;
  }

  update(dt: number) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.life += dt;
      const t = it.life / it.ttl;
      if (t >= 1) {
        this.scene.remove(it.mesh);
        it.mesh.geometry.dispose();
        this.items.splice(i, 1);
        continue;
      }
      if (it.kind === 'tracer') {
        (it.mesh.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - t);
      } else if (it.kind === 'puff' || it.kind === 'blood') {
        const s = 1 + t * 2.6;
        it.mesh.scale.set(s, s, s);
        (it.mesh.material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - t);
      } else if (it.kind === 'muzzle') {
        (it.mesh.material as THREE.MeshBasicMaterial).opacity = 1 - t;
      } else if (it.kind === 'debris') {
        it.vel!.y -= 14 * dt;
        it.mesh.position.addScaledVector(it.vel!, dt);
        it.mesh.rotation.x += dt * 7;
        it.mesh.rotation.z += dt * 5;
        if (it.mesh.position.y < 0.05) { it.mesh.position.y = 0.05; it.vel!.multiplyScalar(0.4); it.vel!.y = 0; }
      } else if (it.kind === 'boom') {
        const s = 0.4 + t * 2.2;
        it.mesh.scale.set(s, s * 0.8, s);
        (it.mesh.material as THREE.MeshBasicMaterial).opacity = 1 - t;
      } else if (it.kind === 'smoke') {
        const s = 0.3 + t * 1.6;
        it.mesh.scale.set(s, s * 0.7, s);
        it.mesh.position.y += dt * 1.2;
        (it.mesh.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - t);
      }
    }
    for (let i = this.lights.length - 1; i >= 0; i--) {
      const l = this.lights[i];
      l.life += dt;
      if (l.life >= 0) {
        l.light.intensity = Math.max(0, l.light.intensity * (1 - dt * 14));
        if (l.light.intensity < 0.15) {
          this.scene.remove(l.light);
          l.light.dispose();
          this.lights.splice(i, 1);
        }
      }
    }
  }

  clear() {
    for (const it of this.items) { this.scene.remove(it.mesh); it.mesh.geometry.dispose(); }
    this.items.length = 0;
    for (const l of this.lights) { this.scene.remove(l.light); l.light.dispose(); }
    this.lights.length = 0;
  }
}

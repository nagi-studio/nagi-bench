// Pooled transient visuals: bullet tracers, muzzle flashes, and impact sparks /
// blood puffs. All are cheap emissive/additive meshes recycled from fixed pools.

import * as THREE from 'three';

interface Slot {
  mesh: THREE.Mesh;
  life: number;
  max: number;
}

export class Effects {
  private tracers: Slot[] = [];
  private flashes: Slot[] = [];
  private impacts: Slot[] = [];
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    const tracerGeo = new THREE.BoxGeometry(0.035, 0.035, 1);
    for (let i = 0; i < 24; i++) {
      const mesh = new THREE.Mesh(
        tracerGeo,
        new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      mesh.visible = false;
      scene.add(mesh);
      this.tracers.push({ mesh, life: 0, max: 0.06 });
    }
    const flashGeo = new THREE.SphereGeometry(0.16, 6, 6);
    for (let i = 0; i < 16; i++) {
      const mesh = new THREE.Mesh(
        flashGeo,
        new THREE.MeshBasicMaterial({ color: 0xfff2b0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      mesh.visible = false;
      scene.add(mesh);
      this.flashes.push({ mesh, life: 0, max: 0.05 });
    }
    const impactGeo = new THREE.SphereGeometry(0.09, 6, 6);
    for (let i = 0; i < 32; i++) {
      const mesh = new THREE.Mesh(
        impactGeo,
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }),
      );
      mesh.visible = false;
      scene.add(mesh);
      this.impacts.push({ mesh, life: 0, max: 0.18 });
    }
  }

  private take(pool: Slot[]): Slot | null {
    for (const s of pool) if (s.life <= 0) return s;
    return pool[0] ?? null;
  }

  tracer(fx: number, fy: number, fz: number, tx: number, ty: number, tz: number): void {
    const s = this.take(this.tracers);
    if (!s) return;
    const dx = tx - fx, dy = ty - fy, dz = tz - fz;
    const len = Math.hypot(dx, dy, dz) || 0.01;
    s.mesh.position.set((fx + tx) / 2, (fy + ty) / 2, (fz + tz) / 2);
    s.mesh.scale.set(1, 1, len);
    s.mesh.lookAt(tx, ty, tz);
    s.mesh.visible = true;
    (s.mesh.material as THREE.MeshBasicMaterial).opacity = 0.9;
    s.life = s.max;
  }

  flash(x: number, y: number, z: number): void {
    const s = this.take(this.flashes);
    if (!s) return;
    s.mesh.position.set(x, y, z);
    const sc = 0.7 + Math.random() * 0.6;
    s.mesh.scale.setScalar(sc);
    s.mesh.visible = true;
    (s.mesh.material as THREE.MeshBasicMaterial).opacity = 1;
    s.life = s.max;
  }

  impact(x: number, y: number, z: number, blood: boolean): void {
    const s = this.take(this.impacts);
    if (!s) return;
    s.mesh.position.set(x, y, z);
    s.mesh.scale.setScalar(blood ? 1.4 : 1);
    (s.mesh.material as THREE.MeshBasicMaterial).color.setHex(blood ? 0x9c1c1c : 0xd9cdb0);
    s.mesh.visible = true;
    (s.mesh.material as THREE.MeshBasicMaterial).opacity = 1;
    s.life = s.max;
  }

  update(dt: number): void {
    for (const s of this.tracers) {
      if (s.life <= 0) continue;
      s.life -= dt;
      const mat = s.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, (s.life / s.max) * 0.9);
      if (s.life <= 0) s.mesh.visible = false;
    }
    for (const s of this.flashes) {
      if (s.life <= 0) continue;
      s.life -= dt;
      const mat = s.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, s.life / s.max);
      if (s.life <= 0) s.mesh.visible = false;
    }
    for (const s of this.impacts) {
      if (s.life <= 0) continue;
      s.life -= dt;
      const k = s.life / s.max;
      const mat = s.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, k);
      s.mesh.scale.multiplyScalar(1 + dt * 2);
      s.mesh.position.y += dt * 0.4;
      if (s.life <= 0) s.mesh.visible = false;
    }
  }
}

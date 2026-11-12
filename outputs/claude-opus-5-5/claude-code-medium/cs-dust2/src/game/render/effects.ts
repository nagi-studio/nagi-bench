// Transient visual effects: tracers, impact decals, dust/blood puffs, muzzle
// lights and the C4 explosion.
import * as THREE from 'three';
import type { V3 } from '../core/math.ts';
import { bulletHoleTexture, radialTexture } from './textures.ts';

interface Tracer {
  line: THREE.Line;
  life: number;
}
interface Puff {
  sprite: THREE.Sprite;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  grow: number;
  baseOpacity: number;
}

export class Effects {
  private scene: THREE.Scene;
  private tracers: Tracer[] = [];
  private tracerMat = new THREE.LineBasicMaterial({ color: 0xffe7a0, transparent: true, opacity: 0.85 });
  private decals: THREE.Mesh[] = [];
  private decalIdx = 0;
  private decalGeo = new THREE.PlaneGeometry(0.11, 0.11);
  private decalMat: THREE.MeshBasicMaterial;
  private puffs: Puff[] = [];
  private dustTex = radialTexture('rgba(220,200,160,0.9)', 'rgba(220,200,160,0)');
  private bloodTex = radialTexture('rgba(150,10,10,0.95)', 'rgba(120,0,0,0)');
  private fireTex = radialTexture('rgba(255,230,150,1)', 'rgba(255,90,10,0)');
  private smokeTex = radialTexture('rgba(70,65,60,0.9)', 'rgba(70,65,60,0)');
  private lights: { light: THREE.PointLight; life: number; max: number; peak: number }[] = [];
  private shake = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.decalMat = new THREE.MeshBasicMaterial({
      map: bulletHoleTexture(),
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    });
    for (let i = 0; i < 3; i++) {
      // Lights stay in the scene permanently (intensity 0 when idle): toggling
      // visibility would change the light count and force shader recompiles.
      const l = new THREE.PointLight(0xffc070, 0, 9, 2);
      scene.add(l);
      this.lights.push({ light: l, life: 0, max: 1, peak: 0 });
    }
  }

  tracer(from: THREE.Vector3, to: V3) {
    const g = new THREE.BufferGeometry().setFromPoints([from.clone(), new THREE.Vector3(to.x, to.y, to.z)]);
    const line = new THREE.Line(g, this.tracerMat.clone());
    this.scene.add(line);
    this.tracers.push({ line, life: 0.06 });
  }

  flashLight(pos: THREE.Vector3, intensity = 6, life = 0.06, distance = 9) {
    const slot = this.lights.reduce((a, b) => (a.life < b.life ? a : b));
    slot.light.position.copy(pos);
    slot.light.distance = distance;
    slot.life = life;
    slot.max = life;
    slot.peak = intensity;
    slot.light.intensity = intensity;
  }

  impact(point: V3, normal: V3) {
    let d = this.decals[this.decalIdx];
    if (!d) {
      d = new THREE.Mesh(this.decalGeo, this.decalMat);
      this.decals[this.decalIdx] = d;
      this.scene.add(d);
    }
    this.decalIdx = (this.decalIdx + 1) % 120;
    const n = new THREE.Vector3(normal.x, normal.y, normal.z);
    d.position.set(point.x + n.x * 0.01, point.y + n.y * 0.01, point.z + n.z * 0.01);
    d.lookAt(d.position.clone().add(n));
    d.rotation.z += Math.random() * Math.PI;
    for (let i = 0; i < 3; i++) {
      const v = n.clone().multiplyScalar(0.8 + Math.random()).add(new THREE.Vector3((Math.random() - 0.5) * 0.8, Math.random() * 0.6, (Math.random() - 0.5) * 0.8));
      this.puff(this.dustTex, point, v, 0.35, 0.12, 1.5, 0.7);
    }
  }

  blood(point: V3) {
    for (let i = 0; i < 4; i++) {
      const v = new THREE.Vector3((Math.random() - 0.5) * 1.5, Math.random() * 1.2, (Math.random() - 0.5) * 1.5);
      this.puff(this.bloodTex, point, v, 0.35, 0.15, 1.2, 0.9);
    }
  }

  private puff(tex: THREE.Texture, p: V3, vel: THREE.Vector3, life: number, size: number, grow: number, opacity: number, additive = false) {
    let puff = this.puffs.find((q) => q.life <= 0 && (q.sprite.material as THREE.SpriteMaterial).map === tex);
    if (!puff) {
      if (this.puffs.length > 220) return;
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending }),
      );
      this.scene.add(sprite);
      puff = { sprite, vel: new THREE.Vector3(), life: 0, maxLife: 1, grow: 1, baseOpacity: 1 };
      this.puffs.push(puff);
    }
    puff.sprite.position.set(p.x, p.y, p.z);
    puff.sprite.scale.setScalar(size);
    puff.sprite.visible = true;
    puff.vel.copy(vel);
    puff.life = life;
    puff.maxLife = life;
    puff.grow = grow;
    puff.baseOpacity = opacity;
  }

  explosion(p: V3) {
    const c = new THREE.Vector3(p.x, p.y + 0.5, p.z);
    this.flashLight(c, 60, 0.9, 45);
    for (let i = 0; i < 26; i++) {
      const v = new THREE.Vector3((Math.random() - 0.5) * 14, Math.random() * 12, (Math.random() - 0.5) * 14);
      this.puff(this.fireTex, c, v, 0.7 + Math.random() * 0.5, 1.5, 5, 1, true);
    }
    for (let i = 0; i < 22; i++) {
      const v = new THREE.Vector3((Math.random() - 0.5) * 6, 2 + Math.random() * 5, (Math.random() - 0.5) * 6);
      this.puff(this.smokeTex, c, v, 2.5 + Math.random() * 2, 2.5, 4, 0.75);
    }
    this.shake = 1.2;
  }

  addShake(a: number) {
    this.shake = Math.max(this.shake, a);
  }

  /** Returns current camera shake offset magnitude. */
  update(dt: number): number {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= dt;
      (t.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, t.life / 0.06) * 0.85;
      if (t.life <= 0) {
        this.scene.remove(t.line);
        t.line.geometry.dispose();
        (t.line.material as THREE.Material).dispose();
        this.tracers.splice(i, 1);
      }
    }
    for (const p of this.puffs) {
      if (p.life <= 0) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.sprite.visible = false;
        continue;
      }
      p.vel.multiplyScalar(Math.exp(-dt * 2.5));
      p.sprite.position.addScaledVector(p.vel, dt);
      p.sprite.scale.multiplyScalar(1 + p.grow * dt);
      (p.sprite.material as THREE.SpriteMaterial).opacity = p.baseOpacity * (p.life / p.maxLife);
    }
    for (const l of this.lights) {
      if (l.life <= 0) continue;
      l.life -= dt;
      l.light.intensity = Math.max(0, l.peak * (l.life / l.max));
    }
    this.shake = Math.max(0, this.shake - dt * 1.5);
    return this.shake;
  }
}

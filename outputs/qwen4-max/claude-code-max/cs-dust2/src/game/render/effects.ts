import * as THREE from 'three';
import type { Bomb, GameEvent, Vec3 } from '../core/types.ts';
import { flashSprite, smokeSprite } from './textures.ts';

interface Tracer { line: THREE.Line; life: number; max: number }
interface Spark { points: THREE.Points; vel: Float32Array; life: number; max: number; gravity: number }
interface Flash { sprite: THREE.Sprite; life: number; max: number }
interface Decal { mesh: THREE.Mesh; life: number }
interface Fireball { mesh: THREE.Mesh; light: THREE.PointLight; life: number; max: number }

const v = (a: Vec3) => new THREE.Vector3(a.x, a.y, a.z);

export class EffectsManager {
  private scene: THREE.Scene;
  private tracers: Tracer[] = [];
  private sparks: Spark[] = [];
  private flashes: Flash[] = [];
  private decals: Decal[] = [];
  private fireballs: Fireball[] = [];
  private flashTex: THREE.Texture;
  private smokeTex: THREE.Texture;
  bombGroup: THREE.Group;
  private bombLight: THREE.Mesh;
  private bombGlow: THREE.Sprite;
  shake = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.flashTex = flashSprite();
    this.smokeTex = smokeSprite();

    this.bombGroup = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.12, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x3a3f36, roughness: 0.6 }),
    );
    body.castShadow = true;
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.02, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x1c2a1c, roughness: 0.4 }),
    );
    panel.position.y = 0.07;
    this.bombLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xff0000, emissiveIntensity: 2 }),
    );
    this.bombLight.position.set(0.1, 0.08, 0);
    this.bombGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.flashTex, color: 0xff3322, transparent: true, opacity: 0.6, depthWrite: false }));
    this.bombGlow.scale.set(0.5, 0.5, 0.5);
    this.bombGlow.position.set(0.1, 0.1, 0);
    this.bombGroup.add(body, panel, this.bombLight, this.bombGlow);
    this.bombGroup.visible = false;
    scene.add(this.bombGroup);
  }

  handle(ev: GameEvent): void {
    switch (ev.type) {
      case 'tracer': this.spawnTracer(ev.from, ev.to, ev.weapon); break;
      case 'shot': this.spawnFlash(ev.origin, ev.weapon === 'awp' ? 0.7 : 0.4); break;
      case 'impact': this.spawnImpact(ev.pos, ev.normal, ev.material); break;
      case 'hit': this.spawnBlood(ev.pos, ev.headshot); break;
      case 'explosion': this.spawnExplosion(ev.pos); break;
      default: break;
    }
  }

  private spawnTracer(from: Vec3, to: Vec3, weapon: string): void {
    const geo = new THREE.BufferGeometry().setFromPoints([v(from), v(to)]);
    const color = weapon === 'awp' ? 0xfff0c0 : 0xffd080;
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 });
    const line = new THREE.Line(geo, mat);
    line.frustumCulled = false;
    this.scene.add(line);
    this.tracers.push({ line, life: 0.07, max: 0.07 });
    if (this.tracers.length > 60) this.removeTracer(this.tracers.shift()!);
  }
  private removeTracer(t: Tracer): void {
    this.scene.remove(t.line);
    t.line.geometry.dispose();
    (t.line.material as THREE.Material).dispose();
  }

  private spawnFlash(pos: Vec3, size: number): void {
    const mat = new THREE.SpriteMaterial({ map: this.flashTex, color: 0xffd070, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending });
    const s = new THREE.Sprite(mat);
    s.position.copy(v(pos));
    s.scale.set(size, size, size);
    this.scene.add(s);
    this.flashes.push({ sprite: s, life: 0.05, max: 0.05 });
  }

  private spawnImpact(pos: Vec3, normal: Vec3, material: string): void {
    const n = v(normal);
    const color = material === 'wood' || material === 'crate' ? 0x8a6a3f : material === 'metal' ? 0xcccccc : 0xc8b489;
    this.spawnSparks(pos, n, color, 8, 2.5, 0.3);
    // decal
    const geo = new THREE.PlaneGeometry(0.14, 0.14);
    const mat = new THREE.MeshBasicMaterial({ color: 0x2a241c, transparent: true, opacity: 0.7, depthWrite: false });
    const decal = new THREE.Mesh(geo, mat);
    decal.position.copy(v(pos)).addScaledVector(n, 0.02);
    decal.lookAt(v(pos).add(n));
    this.scene.add(decal);
    this.decals.push({ mesh: decal, life: 8 });
    if (this.decals.length > 70) {
      const d = this.decals.shift()!;
      this.scene.remove(d.mesh);
      d.mesh.geometry.dispose();
      (d.mesh.material as THREE.Material).dispose();
    }
  }

  private spawnBlood(pos: Vec3, headshot: boolean): void {
    this.spawnSparks(pos, new THREE.Vector3(0, 1, 0), headshot ? 0xcc2222 : 0x992222, headshot ? 14 : 8, 2.2, 0.35);
  }

  private spawnSparks(pos: Vec3, normal: THREE.Vector3, color: number, count: number, speed: number, life: number): void {
    const positions = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;
      const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      dir.addScaledVector(normal, 0.8).normalize().multiplyScalar(speed * (0.4 + Math.random() * 0.6));
      vel[i * 3] = dir.x; vel[i * 3 + 1] = dir.y; vel[i * 3 + 2] = dir.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color, size: 0.05, transparent: true, opacity: 1, depthWrite: false });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    this.scene.add(points);
    this.sparks.push({ points, vel, life, max: life, gravity: 6 });
  }

  private spawnExplosion(pos: Vec3): void {
    this.shake = 1.2;
    const geo = new THREE.SphereGeometry(1, 20, 20);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff8030, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(v(pos));
    const light = new THREE.PointLight(0xff7020, 8, 40, 2);
    light.position.copy(v(pos));
    this.scene.add(mesh, light);
    this.fireballs.push({ mesh, light, life: 0.9, max: 0.9 });
    // smoke
    for (let i = 0; i < 10; i++) {
      const smat = new THREE.SpriteMaterial({ map: this.smokeTex, color: 0x6a6058, transparent: true, opacity: 0.7, depthWrite: false });
      const s = new THREE.Sprite(smat);
      s.position.copy(v(pos)).add(new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 2, (Math.random() - 0.5) * 3));
      const sc = 2 + Math.random() * 3;
      s.scale.set(sc, sc, sc);
      this.scene.add(s);
      this.flashes.push({ sprite: s, life: 1.6, max: 1.6 });
    }
    this.spawnSparks(pos, new THREE.Vector3(0, 1, 0), 0xffb060, 40, 9, 0.9);
  }

  update(dt: number, time: number, bomb: Bomb): void {
    this.shake = Math.max(0, this.shake - dt * 2);
    // tracers
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= dt;
      (t.line.material as THREE.LineBasicMaterial).opacity = 0.7 * (t.life / t.max);
      if (t.life <= 0) { this.removeTracer(t); this.tracers.splice(i, 1); }
    }
    // flashes / smoke
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i];
      f.life -= dt;
      const k = f.life / f.max;
      (f.sprite.material as THREE.SpriteMaterial).opacity = k;
      if (f.max > 0.5) f.sprite.scale.multiplyScalar(1 + dt * 0.6); // smoke expands
      if (f.life <= 0) {
        this.scene.remove(f.sprite);
        (f.sprite.material as THREE.Material).dispose();
        this.flashes.splice(i, 1);
      }
    }
    // sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.life -= dt;
      const attr = s.points.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let j = 0; j < arr.length / 3; j++) {
        s.vel[j * 3 + 1] -= s.gravity * dt;
        arr[j * 3] += s.vel[j * 3] * dt;
        arr[j * 3 + 1] += s.vel[j * 3 + 1] * dt;
        arr[j * 3 + 2] += s.vel[j * 3 + 2] * dt;
      }
      attr.needsUpdate = true;
      (s.points.material as THREE.PointsMaterial).opacity = s.life / s.max;
      if (s.life <= 0) {
        this.scene.remove(s.points);
        s.points.geometry.dispose();
        (s.points.material as THREE.Material).dispose();
        this.sparks.splice(i, 1);
      }
    }
    // decals
    for (let i = this.decals.length - 1; i >= 0; i--) {
      const d = this.decals[i];
      d.life -= dt;
      if (d.life < 1) (d.mesh.material as THREE.MeshBasicMaterial).opacity = 0.7 * d.life;
      if (d.life <= 0) {
        this.scene.remove(d.mesh);
        d.mesh.geometry.dispose();
        (d.mesh.material as THREE.Material).dispose();
        this.decals.splice(i, 1);
      }
    }
    // fireballs
    for (let i = this.fireballs.length - 1; i >= 0; i--) {
      const f = this.fireballs[i];
      f.life -= dt;
      const k = 1 - f.life / f.max;
      f.mesh.scale.setScalar(1 + k * 9);
      (f.mesh.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - k);
      f.light.intensity = 8 * (1 - k);
      if (f.life <= 0) {
        this.scene.remove(f.mesh, f.light);
        f.mesh.geometry.dispose();
        (f.mesh.material as THREE.Material).dispose();
        this.fireballs.splice(i, 1);
      }
    }
    // bomb visual
    if (bomb.state === 'dropped' || bomb.state === 'planted') {
      this.bombGroup.visible = true;
      this.bombGroup.position.set(bomb.pos.x, bomb.pos.y + 0.06, bomb.pos.z);
      const urgency = bomb.state === 'planted' ? 1 - Math.min(1, bomb.timer / 40) : 0.2;
      const blink = Math.sin(time * (3 + urgency * 18)) > 0 ? 1 : 0.1;
      (this.bombLight.material as THREE.MeshStandardMaterial).emissiveIntensity = 2 * blink;
      (this.bombGlow.material as THREE.SpriteMaterial).opacity = 0.6 * blink;
      this.bombGroup.rotation.y = bomb.state === 'planted' ? time * 0.2 : 0;
    } else {
      this.bombGroup.visible = false;
    }
  }
}

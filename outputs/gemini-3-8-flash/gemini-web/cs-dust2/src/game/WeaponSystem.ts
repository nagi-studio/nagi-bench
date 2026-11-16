import * as THREE from 'three';
import { WeaponId, WeaponSpec } from '../types';

export const WEAPON_SPECS: Record<WeaponId, WeaponSpec> = {
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    sub: '高伤害 · 强垂直后坐力 · 爆头必杀',
    slot: 1,
    damage: 38,
    armorPen: 0.78,
    fireInterval: 0.10,
    recoilKick: 0.042,
    spread: 0.020,
    magSize: 30,
    reserve: 90,
    reloadTime: 2.1,
    color: 0x92400e
  },
  m4a4: {
    id: 'm4a4',
    name: 'M4A4',
    sub: '中等伤害 · 极稳弹道 · 高射速',
    slot: 1,
    damage: 32,
    armorPen: 0.70,
    fireInterval: 0.09,
    recoilKick: 0.022,
    spread: 0.012,
    magSize: 30,
    reserve: 90,
    reloadTime: 1.9,
    color: 0x334155
  },
  awp: {
    id: 'awp',
    name: 'AWP Sniper',
    sub: '重型狙击枪 · 一击必杀 · 右键开镜',
    slot: 1,
    damage: 118,
    armorPen: 0.96,
    fireInterval: 1.25,
    recoilKick: 0.085,
    spread: 0.001,
    magSize: 10,
    reserve: 30,
    reloadTime: 2.6,
    color: 0x3f6212,
    isSniper: true
  },
  deagle: {
    id: 'deagle',
    name: 'Desert Eagle',
    sub: '大口径马格南手枪 · 高单发威慑',
    slot: 2,
    damage: 54,
    armorPen: 0.85,
    fireInterval: 0.28,
    recoilKick: 0.050,
    spread: 0.015,
    magSize: 7,
    reserve: 35,
    reloadTime: 1.7,
    color: 0xcbd5e1,
    isPistol: true
  },
  usp: {
    id: 'usp',
    name: 'USP-S / Glock',
    sub: '手枪局制式武器 · 操控精准',
    slot: 2,
    damage: 25,
    armorPen: 0.55,
    fireInterval: 0.15,
    recoilKick: 0.014,
    spread: 0.009,
    magSize: 12,
    reserve: 48,
    reloadTime: 1.5,
    color: 0x475569,
    isPistol: true
  },
  knife: {
    id: 'knife',
    name: 'Tactical Knife',
    sub: '近战冷兵器 · 极致机动性',
    slot: 3,
    damage: 55,
    armorPen: 0.85,
    fireInterval: 0.42,
    recoilKick: 0.006,
    spread: 0.0,
    magSize: 1,
    reserve: 1,
    reloadTime: 0.0,
    color: 0x94a3b8,
    isMelee: true,
    range: 3.6
  },
  c4: {
    id: 'c4',
    name: 'C4 Explosive',
    sub: '炸弹背包 · 在 A/B 包点按 E 安放',
    slot: 4,
    damage: 0,
    armorPen: 0.0,
    fireInterval: 0.50,
    recoilKick: 0.0,
    spread: 0.0,
    magSize: 1,
    reserve: 1,
    reloadTime: 0.0,
    color: 0xdc2626,
    isC4: true
  }
};

interface BulletTracer {
  mesh: THREE.Line;
  lifetime: number;
  maxLife: number;
}

interface SparkParticle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  lifetime: number;
  maxLife: number;
}

export class SoundManager {
  private static ctx: AudioContext | null = null;

  public static ensureAudio(): void {
    if (!this.ctx && typeof window !== 'undefined') {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        this.ctx = new AC();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public static play(kind: string): void {
    try {
      this.ensureAudio();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      if (kind === 'ak47' || kind === 'm4a4' || kind === 'awp' || kind === 'deagle' || kind === 'usp') {
        const dur = kind === 'awp' ? 0.38 : (kind === 'deagle' ? 0.22 : 0.14);
        const bufferSize = Math.floor(ctx.sampleRate * dur);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.26));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = kind === 'awp' ? 620 : (kind === 'm4a4' ? 1400 : (kind === 'deagle' ? 820 : 960));
        filter.Q.value = 1.2;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(kind === 'awp' ? 0.28 : 0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);

        // Low frequency thud for punch
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(kind === 'awp' ? 110 : 150, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        oscGain.gain.setValueAtTime(0.20, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);

      } else if (kind === 'headshot') {
        // High crisp helmet ding
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2200, now);
        osc.frequency.exponentialRampToValueAtTime(3100, now + 0.08);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);

      } else if (kind === 'hit') {
        // Body impact blunt hit
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);

      } else if (kind === 'c4beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2750, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);

      } else if (kind === 'explode') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.85);
        gain.gain.setValueAtTime(0.40, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.90);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.92);

      } else if (kind === 'reload') {
        // Mechanical click-clack
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      }
    } catch {
      // Audio fallback silent
    }
  }
}

export class WeaponFXManager {
  private scene: THREE.Scene;
  private tracers: BulletTracer[] = [];
  private particles: SparkParticle[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public createTracer(start: THREE.Vector3, end: THREE.Vector3, isSniper = false): void {
    const geom = new THREE.BufferGeometry().setFromPoints([start, end]);
    const mat = new THREE.LineBasicMaterial({
      color: isSniper ? 0xffffff : 0xfde047,
      transparent: true,
      opacity: 0.85,
      linewidth: isSniper ? 2 : 1
    });
    const line = new THREE.Line(geom, mat);
    this.scene.add(line);
    this.tracers.push({
      mesh: line,
      lifetime: 0,
      maxLife: isSniper ? 0.22 : 0.10
    });
  }

  public createImpactSparks(pos: THREE.Vector3, isBlood = false): void {
    const count = isBlood ? 5 : 4;
    for (let i = 0; i < count; i++) {
      const geom = new THREE.BoxGeometry(0.04, 0.04, 0.04);
      const mat = new THREE.MeshBasicMaterial({
        color: isBlood ? 0xdc2626 : 0xfde047,
        transparent: true,
        opacity: 0.9
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos);
      this.scene.add(mesh);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        Math.random() * 2.5 + 0.5,
        (Math.random() - 0.5) * 3
      );

      this.particles.push({
        mesh,
        vel,
        lifetime: 0,
        maxLife: 0.28
      });
    }
  }

  public update(dt: number): void {
    // Update tracers
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tr = this.tracers[i];
      tr.lifetime += dt;
      const progress = tr.lifetime / tr.maxLife;
      (tr.mesh.material as THREE.LineBasicMaterial).opacity = Math.max(0, 1 - progress);
      if (tr.lifetime >= tr.maxLife) {
        this.scene.remove(tr.mesh);
        tr.mesh.geometry.dispose();
        (tr.mesh.material as THREE.Material).dispose();
        this.tracers.splice(i, 1);
      }
    }

    // Update spark particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.lifetime += dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.vel.y -= 9.8 * dt; // gravity
      const progress = p.lifetime / p.maxLife;
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - progress);
      if (p.lifetime >= p.maxLife) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  public dispose(): void {
    this.tracers.forEach(tr => {
      this.scene.remove(tr.mesh);
      tr.mesh.geometry.dispose();
      (tr.mesh.material as THREE.Material).dispose();
    });
    this.tracers = [];

    this.particles.forEach(p => {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    });
    this.particles = [];
  }
}

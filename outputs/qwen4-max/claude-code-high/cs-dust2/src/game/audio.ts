import type { Vec3 } from './math';
import type { WeaponId } from './types';
import { clamp } from './math';

/**
 * Fully procedural sound: every effect is synthesized with Web Audio
 * (noise bursts + oscillators + filters). No audio files.
 */
export class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private listenerPos: Vec3 = { x: 0, y: 0, z: 0 };
  private listenerYaw = 0;
  enabled = true;

  /** Must be called from a user gesture. */
  resume(): void {
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 8;
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.55;
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
      const len = this.ctx.sampleRate;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  setListener(pos: Vec3, yaw: number): void {
    this.listenerPos = pos;
    this.listenerYaw = yaw;
  }

  /** Spatialized output chain for a world position (undefined = player's own sound). */
  private out(pos?: Vec3, base = 1): GainNode | null {
    if (!this.ctx || !this.master || !this.enabled) return null;
    const g = this.ctx.createGain();
    let vol = base;
    let pan = 0;
    if (pos) {
      const dx = pos.x - this.listenerPos.x;
      const dz = pos.z - this.listenerPos.z;
      const dy = pos.y - this.listenerPos.y;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      vol = base * clamp(1 / (1 + d * 0.07), 0, 1);
      if (d > 0.5) {
        // pan by angle relative to listener facing
        const fx = -Math.sin(this.listenerYaw);
        const fz = -Math.cos(this.listenerYaw);
        const rx = -fz;
        const rz = fx;
        pan = clamp((dx * rx + dz * rz) / d, -1, 1) * 0.75;
      }
    }
    g.gain.value = vol;
    const p = this.ctx.createStereoPanner();
    p.pan.value = pan;
    g.connect(p);
    p.connect(this.master);
    return g;
  }

  private noise(dest: AudioNode, dur: number, type: BiquadFilterType, f0: number, f1: number, gain: number, delay = 0): void {
    if (!this.ctx || !this.noiseBuf) return;
    const t = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    src.playbackRate.value = 0.9 + Math.random() * 0.2;
    const filt = this.ctx.createBiquadFilter();
    filt.type = type;
    filt.frequency.setValueAtTime(f0, t);
    filt.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
    filt.Q.value = 0.8;
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(gain, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filt);
    filt.connect(env);
    env.connect(dest);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  private tone(dest: AudioNode, type: OscillatorType, f0: number, f1: number, dur: number, gain: number, delay = 0): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(gain, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(env);
    env.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  shot(weapon: WeaponId, pos?: Vec3): void {
    const o = this.out(pos, 1);
    if (!o) return;
    switch (weapon) {
      case 'ak47':
        this.noise(o, 0.2, 'lowpass', 2200, 300, 0.9);
        this.tone(o, 'triangle', 130, 55, 0.13, 0.7);
        break;
      case 'm4a4':
        this.noise(o, 0.13, 'lowpass', 3000, 500, 0.75);
        this.tone(o, 'triangle', 170, 80, 0.09, 0.55);
        break;
      case 'awp':
        this.noise(o, 0.55, 'lowpass', 1100, 90, 1.3);
        this.tone(o, 'sine', 80, 32, 0.45, 1.0);
        this.noise(o, 0.08, 'highpass', 2500, 3500, 0.5);
        break;
      case 'glock':
        this.noise(o, 0.1, 'bandpass', 1600, 700, 0.7);
        this.tone(o, 'square', 230, 110, 0.06, 0.3);
        break;
      case 'usp':
        this.noise(o, 0.09, 'lowpass', 1300, 350, 0.5);
        this.tone(o, 'triangle', 190, 90, 0.06, 0.3);
        break;
      case 'deagle':
        this.noise(o, 0.26, 'lowpass', 1500, 180, 1.1);
        this.tone(o, 'sine', 110, 45, 0.2, 0.8);
        break;
      case 'knife':
        this.noise(o, 0.09, 'bandpass', 2400, 1200, 0.4);
        break;
    }
  }

  reload(pos?: Vec3, dur = 2): void {
    const o = this.out(pos, 0.8);
    if (!o) return;
    this.noise(o, 0.05, 'highpass', 1800, 2400, 0.5, 0);
    this.noise(o, 0.06, 'highpass', 1200, 1600, 0.45, dur * 0.35);
    this.noise(o, 0.05, 'highpass', 2200, 2800, 0.55, dur * 0.8);
  }

  step(pos?: Vec3): void {
    const o = this.out(pos, 0.35);
    if (!o) return;
    this.noise(o, 0.07, 'lowpass', 500 + Math.random() * 200, 180, 0.5);
  }

  scope(on: boolean): void {
    const o = this.out(undefined, 0.5);
    if (!o) return;
    this.noise(o, 0.04, 'highpass', 2500, 3000, 0.4);
    this.tone(o, 'sine', on ? 900 : 500, on ? 450 : 800, 0.08, 0.25);
  }

  hit(headshot: boolean): void {
    const o = this.out(undefined, 0.6);
    if (!o) return;
    if (headshot) {
      this.tone(o, 'sine', 1700, 1300, 0.09, 0.6);
    } else {
      this.tone(o, 'square', 1100, 900, 0.035, 0.35);
    }
  }

  kill(): void {
    const o = this.out(undefined, 0.55);
    if (!o) return;
    this.tone(o, 'sine', 660, 660, 0.07, 0.5);
    this.tone(o, 'sine', 990, 990, 0.12, 0.5, 0.07);
  }

  damage(): void {
    const o = this.out(undefined, 0.6);
    if (!o) return;
    this.noise(o, 0.12, 'lowpass', 700, 200, 0.6);
    this.tone(o, 'sine', 140, 70, 0.12, 0.5);
  }

  plant(): void {
    const o = this.out(undefined, 0.7);
    if (!o) return;
    this.noise(o, 0.06, 'highpass', 1500, 2000, 0.5, 0);
    this.tone(o, 'square', 440, 440, 0.08, 0.3, 0.1);
    this.tone(o, 'square', 550, 550, 0.08, 0.3, 0.22);
    this.tone(o, 'square', 660, 660, 0.14, 0.35, 0.34);
  }

  plantedWorld(pos: Vec3): void {
    const o = this.out(pos, 0.9);
    if (!o) return;
    this.tone(o, 'square', 500, 500, 0.1, 0.4);
    this.tone(o, 'square', 640, 640, 0.18, 0.4, 0.12);
  }

  beep(pos: Vec3, urgency: number): void {
    const o = this.out(pos, 0.5 + urgency * 0.5);
    if (!o) return;
    this.tone(o, 'square', 1150, 1150, 0.055, 0.4);
  }

  defuseTick(pos: Vec3): void {
    const o = this.out(pos, 0.4);
    if (!o) return;
    this.noise(o, 0.03, 'highpass', 2000, 2600, 0.35);
  }

  defused(): void {
    const o = this.out(undefined, 0.8);
    if (!o) return;
    this.noise(o, 0.05, 'highpass', 1800, 2400, 0.5);
    this.tone(o, 'sine', 880, 880, 0.09, 0.5, 0.05);
    this.tone(o, 'sine', 660, 660, 0.09, 0.5, 0.16);
    this.tone(o, 'sine', 440, 440, 0.2, 0.55, 0.27);
  }

  pickup(): void {
    const o = this.out(undefined, 0.6);
    if (!o) return;
    this.noise(o, 0.05, 'highpass', 1400, 2000, 0.45);
    this.tone(o, 'sine', 520, 700, 0.08, 0.3, 0.04);
  }

  explosion(pos: Vec3): void {
    const o = this.out(pos, 1.4);
    if (!o) return;
    this.noise(o, 1.4, 'lowpass', 500, 45, 1.6);
    this.tone(o, 'sine', 60, 24, 1.1, 1.3);
    this.noise(o, 0.15, 'highpass', 1500, 3000, 0.7);
  }

  roundStart(): void {
    const o = this.out(undefined, 0.5);
    if (!o) return;
    this.tone(o, 'square', 520, 520, 0.07, 0.25);
    this.tone(o, 'square', 780, 780, 0.1, 0.25, 0.1);
  }

  switchWeapon(): void {
    const o = this.out(undefined, 0.5);
    if (!o) return;
    this.noise(o, 0.05, 'highpass', 1600, 2200, 0.4);
  }

  dispose(): void {
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
  }
}

import type { GameEvent, Team, Vec3, WeaponId } from './core/types.ts';
import { clamp } from './core/vecmath.ts';

interface Listener {
  pos: Vec3;
  yaw: number;
  playerTeam: Team;
  controlledId: number;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  enabled = true;

  resume(): void {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
      const len = this.ctx.sampleRate;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (this.master) this.master.gain.value = on ? 0.5 : 0;
  }

  private spatial(pos: Vec3, l: Listener): { gain: number; pan: number } {
    const dx = pos.x - l.pos.x, dz = pos.z - l.pos.z;
    const d = Math.hypot(dx, dz);
    const gain = clamp(1 / (1 + d * 0.07), 0, 1);
    // pan relative to listener facing
    const right = { x: Math.cos(l.yaw), z: Math.sin(l.yaw) };
    const pan = d > 0.01 ? clamp((dx * right.x + dz * right.z) / d, -1, 1) : 0;
    return { gain, pan };
  }

  private noise(opts: { dur: number; type: BiquadFilterType; freq: number; q?: number; gain: number; pan?: number; attack?: number; freqEnd?: number; delay?: number }): void {
    if (!this.ctx || !this.master || !this.noiseBuf || !this.enabled) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = opts.type;
    filter.frequency.setValueAtTime(opts.freq, t0);
    if (opts.freqEnd) filter.frequency.exponentialRampToValueAtTime(Math.max(40, opts.freqEnd), t0 + opts.dur);
    filter.Q.value = opts.q ?? 1;
    const g = this.ctx.createGain();
    const atk = opts.attack ?? 0.005;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, opts.gain), t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    const pan = this.ctx.createStereoPanner();
    pan.pan.value = opts.pan ?? 0;
    src.connect(filter).connect(g).connect(pan).connect(this.master);
    src.start(t0);
    src.stop(t0 + opts.dur + 0.02);
  }

  private tone(opts: { freq: number; type: OscillatorType; dur: number; gain: number; pan?: number; freqEnd?: number; delay?: number }): void {
    if (!this.ctx || !this.master || !this.enabled) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const osc = this.ctx.createOscillator();
    osc.type = opts.type;
    osc.frequency.setValueAtTime(opts.freq, t0);
    if (opts.freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.freqEnd), t0 + opts.dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, opts.gain), t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    const pan = this.ctx.createStereoPanner();
    pan.pan.value = opts.pan ?? 0;
    osc.connect(g).connect(pan).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + opts.dur + 0.02);
  }

  private shotSound(weapon: WeaponId, gain: number, pan: number): void {
    const g = gain;
    switch (weapon) {
      case 'ak47':
        this.noise({ dur: 0.16, type: 'bandpass', freq: 1700, q: 0.8, gain: 0.85 * g, pan });
        this.tone({ freq: 130, freqEnd: 55, type: 'triangle', dur: 0.14, gain: 0.6 * g, pan });
        this.noise({ dur: 0.05, type: 'highpass', freq: 3500, gain: 0.3 * g, pan });
        break;
      case 'm4a4':
        this.noise({ dur: 0.12, type: 'bandpass', freq: 2400, q: 1, gain: 0.7 * g, pan });
        this.tone({ freq: 160, freqEnd: 80, type: 'triangle', dur: 0.1, gain: 0.45 * g, pan });
        this.noise({ dur: 0.04, type: 'highpass', freq: 4500, gain: 0.28 * g, pan });
        break;
      case 'awp':
        this.noise({ dur: 0.5, type: 'lowpass', freq: 2600, freqEnd: 300, gain: 1.0 * g, pan });
        this.tone({ freq: 90, freqEnd: 35, type: 'sine', dur: 0.5, gain: 0.85 * g, pan });
        this.noise({ dur: 0.08, type: 'highpass', freq: 3000, gain: 0.5 * g, pan });
        break;
      case 'glock':
        this.noise({ dur: 0.1, type: 'bandpass', freq: 1300, q: 0.9, gain: 0.6 * g, pan });
        this.tone({ freq: 180, freqEnd: 90, type: 'square', dur: 0.07, gain: 0.3 * g, pan });
        break;
      case 'usp':
        this.noise({ dur: 0.09, type: 'lowpass', freq: 1000, gain: 0.45 * g, pan });
        this.tone({ freq: 150, freqEnd: 80, type: 'triangle', dur: 0.06, gain: 0.22 * g, pan });
        break;
      case 'deagle':
        this.noise({ dur: 0.22, type: 'bandpass', freq: 950, q: 0.7, gain: 0.9 * g, pan });
        this.tone({ freq: 110, freqEnd: 45, type: 'triangle', dur: 0.2, gain: 0.7 * g, pan });
        this.noise({ dur: 0.06, type: 'highpass', freq: 2800, gain: 0.4 * g, pan });
        break;
      case 'knife':
        this.noise({ dur: 0.12, type: 'highpass', freq: 2500, gain: 0.3 * g, pan });
        break;
    }
  }

  handle(events: GameEvent[], l: Listener): void {
    if (!this.ctx || !this.enabled) return;
    for (const ev of events) {
      switch (ev.type) {
        case 'shot': {
          const s = this.spatial(ev.origin, l);
          if (s.gain < 0.02) break;
          this.shotSound(ev.weapon, s.gain, s.pan);
          break;
        }
        case 'reload': {
          const e = ev.entityId;
          const s = this.spatial(l.pos, l);
          const near = e === l.controlledId ? 1 : 0.4;
          this.noise({ dur: 0.05, type: 'highpass', freq: 2000, gain: 0.3 * near, pan: 0 });
          this.noise({ dur: 0.06, type: 'bandpass', freq: 1200, gain: 0.3 * near, delay: 0.12 });
          this.noise({ dur: 0.07, type: 'highpass', freq: 1600, gain: 0.35 * near, delay: 0.3 });
          void s;
          break;
        }
        case 'deploy': {
          this.noise({ dur: 0.05, type: 'bandpass', freq: 1500, gain: 0.2 });
          break;
        }
        case 'footstep': {
          const s = this.spatial(ev.pos, l);
          if (s.gain < 0.03) break;
          const vol = (ev.loud ? 0.35 : 0.12) * s.gain;
          this.noise({ dur: 0.07, type: 'lowpass', freq: 500, gain: vol, pan: s.pan });
          break;
        }
        case 'hit': {
          if (ev.attackerId === l.controlledId) {
            if (ev.headshot) this.tone({ freq: 1900, type: 'sine', dur: 0.07, gain: 0.4 });
            else this.tone({ freq: 1200, type: 'square', dur: 0.04, gain: 0.28 });
          }
          if (ev.victimId === l.controlledId) {
            this.noise({ dur: 0.12, type: 'lowpass', freq: 400, gain: 0.5 });
          }
          break;
        }
        case 'death': {
          const s = this.spatial(ev.pos, l);
          if (s.gain > 0.05) this.tone({ freq: 120, freqEnd: 50, type: 'sine', dur: 0.25, gain: 0.3 * s.gain, pan: s.pan });
          break;
        }
        case 'scope': {
          if (ev.entityId === l.controlledId) {
            this.noise({ dur: 0.12, type: 'bandpass', freq: ev.on ? 800 : 1600, freqEnd: ev.on ? 1800 : 600, gain: 0.25 });
            this.tone({ freq: 600, type: 'sine', dur: 0.05, gain: 0.15 });
          }
          break;
        }
        case 'plant': {
          this.tone({ freq: 800, type: 'square', dur: 0.08, gain: 0.3 });
          this.tone({ freq: 1000, type: 'square', dur: 0.08, gain: 0.3, delay: 0.12 });
          this.noise({ dur: 0.1, type: 'highpass', freq: 2000, gain: 0.3, delay: 0.24 });
          break;
        }
        case 'defuse': {
          this.noise({ dur: 0.06, type: 'highpass', freq: 2500, gain: 0.35 });
          this.tone({ freq: 1400, type: 'sine', dur: 0.12, gain: 0.3, delay: 0.1 });
          break;
        }
        case 'explosion': {
          const s = this.spatial(ev.pos, l);
          this.noise({ dur: 1.2, type: 'lowpass', freq: 3000, freqEnd: 120, gain: 1.0 });
          this.tone({ freq: 100, freqEnd: 22, type: 'sine', dur: 1.1, gain: 0.9 });
          void s;
          break;
        }
        case 'beep': {
          const s = this.spatial(ev.pos, l);
          if (s.gain < 0.03) break;
          this.tone({ freq: 950 + ev.urgency * 350, type: 'square', dur: 0.07, gain: 0.28 * s.gain, pan: s.pan });
          break;
        }
        case 'roundStart': {
          this.tone({ freq: 500, freqEnd: 900, type: 'sine', dur: 0.3, gain: 0.3 });
          if (ev.pistol) this.tone({ freq: 700, freqEnd: 1100, type: 'triangle', dur: 0.25, gain: 0.2, delay: 0.15 });
          break;
        }
        case 'roundEnd': {
          const won = ev.winner === l.playerTeam;
          const base = won ? 520 : 320;
          this.tone({ freq: base, type: 'triangle', dur: 0.3, gain: 0.3 });
          this.tone({ freq: base * (won ? 1.5 : 0.8), type: 'triangle', dur: 0.4, gain: 0.3, delay: 0.18 });
          break;
        }
        case 'buy': {
          this.noise({ dur: 0.05, type: 'highpass', freq: 3000, gain: 0.25 });
          this.tone({ freq: 1500, type: 'square', dur: 0.05, gain: 0.15, delay: 0.05 });
          break;
        }
        case 'knife': {
          const s = this.spatial(l.pos, l);
          this.noise({ dur: 0.12, type: 'highpass', freq: 2600, gain: 0.3 });
          void s;
          break;
        }
        case 'bombPickup': {
          if (ev.entityId === l.controlledId) this.tone({ freq: 1200, type: 'sine', dur: 0.1, gain: 0.3 });
          break;
        }
        default:
          break;
      }
    }
    // kill chime handled via hit.killed for player
    for (const ev of events) {
      if (ev.type === 'hit' && ev.killed && ev.attackerId === l.controlledId) {
        this.tone({ freq: 880, type: 'sine', dur: 0.1, gain: 0.35 });
        this.tone({ freq: 1320, type: 'sine', dur: 0.16, gain: 0.35, delay: 0.09 });
      }
    }
  }
}

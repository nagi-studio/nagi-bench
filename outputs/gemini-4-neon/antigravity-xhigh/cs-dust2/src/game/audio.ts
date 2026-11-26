import { Vec3, WeaponId } from './types';

/**
 * 100% Procedural Web Audio Synthesizer (zero external audio files).
 * Supports 3D distance attenuation & stereo panning relative to the player camera,
 * plus distinct weapon acoustics, reloads, footsteps, AWP scope, hit/headshot dinks, kill chime, and C4 sounds.
 */
export class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private volume = 0.75;

  private listenerPos: Vec3 = { x: 0, y: 0, z: 0 };
  private listenerRightX = 1;
  private listenerRightZ = 0;

  public unlock(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
      this.noiseBuffer = this.createNoiseBuffer(this.ctx, 2.0);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  public setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  public updateListener(pos: Vec3, yaw: number): void {
    this.listenerPos = pos;
    // Right vector for stereo panning (camera faces -Z when yaw=0, right = +X)
    this.listenerRightX = Math.cos(yaw);
    this.listenerRightZ = -Math.sin(yaw);
  }

  private createNoiseBuffer(ctx: AudioContext, durationSec: number): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private makeSpatialDestination(worldPos?: Vec3, maxRange = 65): { node: AudioNode; gainScale: number } | null {
    if (!this.ctx || !this.masterGain) return null;
    if (!worldPos) {
      return { node: this.masterGain, gainScale: 1.0 };
    }
    const dx = worldPos.x - this.listenerPos.x;
    const dy = worldPos.y - this.listenerPos.y;
    const dz = worldPos.z - this.listenerPos.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist > maxRange) return null;

    const gainScale = Math.pow(Math.max(0, 1 - dist / maxRange), 1.65);
    if (gainScale < 0.015) return null;

    if (typeof this.ctx.createStereoPanner === 'function' && dist > 0.5) {
      const panner = this.ctx.createStereoPanner();
      const dot = (dx * this.listenerRightX + dz * this.listenerRightZ) / dist;
      panner.pan.value = Math.max(-0.92, Math.min(0.92, dot));
      panner.connect(this.masterGain);
      return { node: panner, gainScale };
    }

    return { node: this.masterGain, gainScale };
  }

  private playNoiseBurst(
    dest: AudioNode,
    startTime: number,
    duration: number,
    gainVal: number,
    filterType: BiquadFilterType,
    freqStart: number,
    freqEnd: number,
    q = 1.0
  ): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(freqStart, startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), startTime + duration);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(Math.max(0.0001, gainVal), startTime);
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    src.connect(filter);
    filter.connect(g);
    g.connect(dest);
    src.start(startTime, Math.random() * 0.8, duration + 0.02);
  }

  private playTone(
    dest: AudioNode,
    startTime: number,
    duration: number,
    type: OscillatorType,
    freqStart: number,
    freqEnd: number,
    gainVal: number
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, startTime);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), startTime + duration);
    }
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(Math.max(0.0001, gainVal), startTime);
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(g);
    g.connect(dest);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  public playWeaponFire(weaponId: WeaponId, worldPos?: Vec3): void {
    if (!this.ctx) return;
    const maxDist = weaponId === 'usp' ? 28 : weaponId === 'awp' ? 95 : 70;
    const spatial = this.makeSpatialDestination(worldPos, maxDist);
    if (!spatial) return;

    const now = this.ctx.currentTime;
    const s = spatial.gainScale;
    const dest = spatial.node;

    if (weaponId === 'ak47') {
      // Heavy booming AK-47 crack + metallic bolt slam
      this.playTone(dest, now, 0.11, 'triangle', 175, 48, 0.42 * s);
      this.playNoiseBurst(dest, now, 0.17, 0.52 * s, 'bandpass', 1800, 320, 0.85);
      this.playNoiseBurst(dest, now, 0.045, 0.34 * s, 'highpass', 2600, 1200, 0.7);
      // Tail crack
      this.playNoiseBurst(dest, now + 0.04, 0.16, 0.14 * s, 'lowpass', 950, 220, 0.7);
    } else if (weaponId === 'm4a4') {
      // Crisper, tighter, slightly higher-pitched tactical rifle report
      this.playTone(dest, now, 0.08, 'triangle', 235, 72, 0.3 * s);
      this.playNoiseBurst(dest, now, 0.115, 0.42 * s, 'bandpass', 2600, 620, 1.0);
      this.playNoiseBurst(dest, now, 0.035, 0.32 * s, 'highpass', 3400, 1600, 0.8);
    } else if (weaponId === 'awp') {
      // Massive iconic AWP thunderclap + desert echo + delayed bolt cycle
      this.playTone(dest, now, 0.28, 'sine', 130, 26, 0.75 * s);
      this.playTone(dest, now, 0.14, 'sawtooth', 260, 42, 0.35 * s);
      this.playNoiseBurst(dest, now, 0.42, 0.72 * s, 'lowpass', 3200, 160, 0.65);
      this.playNoiseBurst(dest, now + 0.08, 0.45, 0.25 * s, 'bandpass', 780, 180, 0.8);
      // Delayed bolt-action click-clack (only loud near shooter)
      if (s > 0.35) {
        this.playTone(dest, now + 0.48, 0.045, 'square', 1400, 900, 0.08 * s);
        this.playTone(dest, now + 0.62, 0.055, 'square', 1050, 1650, 0.09 * s);
      }
    } else if (weaponId === 'glock') {
      this.playTone(dest, now, 0.06, 'triangle', 320, 110, 0.22 * s);
      this.playNoiseBurst(dest, now, 0.085, 0.28 * s, 'bandpass', 2500, 820, 1.2);
    } else if (weaponId === 'usp') {
      // Silenced crisp "pfft-tick"
      this.playTone(dest, now, 0.035, 'triangle', 460, 190, 0.12 * s);
      this.playNoiseBurst(dest, now, 0.055, 0.18 * s, 'bandpass', 3200, 1400, 1.9);
    } else if (weaponId === 'deagle') {
      // Heavy handcannon bark + metallic ring
      this.playTone(dest, now, 0.15, 'triangle', 210, 46, 0.54 * s);
      this.playNoiseBurst(dest, now, 0.22, 0.56 * s, 'bandpass', 1500, 290, 0.8);
      this.playTone(dest, now, 0.09, 'sine', 1650, 820, 0.11 * s);
    } else if (weaponId === 'knife') {
      // Fast metallic blade whoosh
      this.playNoiseBurst(dest, now, 0.11, 0.22 * s, 'bandpass', 900, 2600, 2.2);
    }
  }

  public playReload(worldPos?: Vec3): void {
    if (!this.ctx) return;
    const spatial = this.makeSpatialDestination(worldPos, 18);
    if (!spatial) return;
    const now = this.ctx.currentTime;
    const s = spatial.gainScale;
    const dest = spatial.node;
    // Mag release click
    this.playTone(dest, now, 0.04, 'square', 920, 480, 0.09 * s);
    // Mag insert clunk
    this.playTone(dest, now + 0.65, 0.06, 'triangle', 320, 180, 0.14 * s);
    this.playNoiseBurst(dest, now + 0.65, 0.05, 0.12 * s, 'bandpass', 1400, 600, 1.5);
    // Slide / bolt rack
    this.playNoiseBurst(dest, now + 1.25, 0.07, 0.14 * s, 'highpass', 2200, 1200, 1.4);
    this.playTone(dest, now + 1.32, 0.05, 'square', 1350, 1850, 0.09 * s);
  }

  public playScopeZoom(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.playTone(this.masterGain, now, 0.045, 'sine', 1100, 1750, 0.12);
    this.playTone(this.masterGain, now + 0.03, 0.03, 'triangle', 1900, 1400, 0.07);
  }

  public playFootstep(worldPos?: Vec3, heavy = false): void {
    if (!this.ctx) return;
    const spatial = this.makeSpatialDestination(worldPos, 24);
    if (!spatial) return;
    const now = this.ctx.currentTime;
    const s = spatial.gainScale * (heavy ? 1.45 : 0.72);
    const pitchJitter = 0.85 + Math.random() * 0.3;
    this.playNoiseBurst(
      spatial.node,
      now,
      heavy ? 0.09 : 0.055,
      0.16 * s,
      'bandpass',
      780 * pitchJitter,
      260 * pitchJitter,
      1.1
    );
    if (heavy) {
      this.playTone(spatial.node, now, 0.07, 'sine', 110, 45, 0.16 * s);
    }
  }

  public playHitFeedback(headshot: boolean, kill: boolean): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    if (headshot) {
      // Iconic sharp metallic CS "dink!" headshot feedback
      this.playTone(this.masterGain, now, 0.12, 'triangle', 2650, 1950, 0.28);
      this.playTone(this.masterGain, now, 0.07, 'square', 3850, 2900, 0.14);
      this.playNoiseBurst(this.masterGain, now, 0.05, 0.18, 'highpass', 3000, 1800, 1.4);
    } else {
      // Crisp tactical body hitmarker tick
      this.playTone(this.masterGain, now, 0.055, 'triangle', 980, 420, 0.22);
      this.playNoiseBurst(this.masterGain, now, 0.035, 0.14, 'bandpass', 1800, 800, 1.2);
    }
    if (kill) {
      // Clean two-note confirmation chime
      this.playTone(this.masterGain, now + 0.05, 0.12, 'sine', 880, 1320, 0.18);
      this.playTone(this.masterGain, now + 0.11, 0.18, 'sine', 1320, 1760, 0.15);
    }
  }

  public playDamageTaken(headshot: boolean): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.playTone(this.masterGain, now, 0.11, 'sine', headshot ? 520 : 155, 55, 0.28);
    this.playNoiseBurst(this.masterGain, now, 0.08, 0.2, 'lowpass', 900, 200, 0.9);
  }

  public playC4PlantKey(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const f = 1400 + Math.floor(Math.random() * 4) * 180;
    this.playTone(this.masterGain, now, 0.05, 'square', f, f, 0.12);
  }

  public playC4Beep(worldPos: Vec3): void {
    if (!this.ctx) return;
    const spatial = this.makeSpatialDestination(worldPos, 78);
    if (!spatial) return;
    const now = this.ctx.currentTime;
    const s = Math.max(0.2, spatial.gainScale);
    this.playTone(spatial.node, now, 0.09, 'sine', 2480, 2480, 0.22 * s);
    this.playTone(spatial.node, now, 0.085, 'triangle', 4960, 4960, 0.06 * s);
  }

  public playC4DefuseStart(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.playTone(this.masterGain, now, 0.07, 'square', 680, 920, 0.12);
    this.playTone(this.masterGain, now + 0.08, 0.09, 'square', 920, 1240, 0.11);
  }

  public playC4Defused(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.playTone(this.masterGain, now, 0.12, 'sine', 660, 660, 0.18);
    this.playTone(this.masterGain, now + 0.13, 0.12, 'sine', 880, 880, 0.18);
    this.playTone(this.masterGain, now + 0.26, 0.25, 'sine', 1320, 1320, 0.22);
  }

  public playC4Explosion(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    // Deep sub-bass seismic shockwave + roaring broadband explosion + debris crackle
    this.playTone(this.masterGain, now, 1.6, 'sine', 95, 18, 0.85);
    this.playTone(this.masterGain, now, 0.9, 'sawtooth', 140, 24, 0.45);
    this.playNoiseBurst(this.masterGain, now, 1.85, 0.88, 'lowpass', 1800, 95, 0.7);
    this.playNoiseBurst(this.masterGain, now + 0.12, 1.4, 0.48, 'bandpass', 620, 120, 0.8);
    this.playNoiseBurst(this.masterGain, now + 0.35, 1.1, 0.22, 'highpass', 1600, 400, 0.9);
  }

  public playDryFire(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.playTone(this.masterGain, now, 0.025, 'square', 1700, 1100, 0.1);
  }
}

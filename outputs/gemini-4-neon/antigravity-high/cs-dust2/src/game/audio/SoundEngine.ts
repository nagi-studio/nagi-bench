import { WeaponId } from '../types';

export interface SpatialPos {
  x: number;
  y: number;
  z: number;
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private masterGain: GainNode | null = null;
  private listenerPos: SpatialPos = { x: 0, y: 0, z: 0 };
  private listenerYaw = 0;
  private muted = false;

  public unlock(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.65;
      this.masterGain.connect(this.ctx.destination);
      this.noiseBuffer = this.createNoiseBuffer(this.ctx, 2.0);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.65, this.ctx.currentTime, 0.02);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public updateListener(pos: SpatialPos, yaw: number): void {
    this.listenerPos = pos;
    this.listenerYaw = yaw;
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

  private createSpatialOut(sourcePos?: SpatialPos, maxDist = 65): { node: AudioNode; gain: number } | null {
    if (!this.ctx || !this.masterGain || this.muted) return null;

    if (!sourcePos) {
      return { node: this.masterGain, gain: 1.0 };
    }

    const dx = sourcePos.x - this.listenerPos.x;
    const dy = sourcePos.y - this.listenerPos.y;
    const dz = sourcePos.z - this.listenerPos.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist > maxDist) return null;

    // Smooth inverse-ish attenuation
    const atten = Math.max(0.02, Math.pow(1 - dist / maxDist, 1.8));

    // Stereo panning based on listener right vector
    // Camera forward is (-sin(yaw), 0, -cos(yaw)), right is (cos(yaw), 0, -sin(yaw))
    const rightX = Math.cos(this.listenerYaw);
    const rightZ = -Math.sin(this.listenerYaw);
    const horizDist = Math.sqrt(dx * dx + dz * dz) + 0.001;
    const pan = Math.max(-0.92, Math.min(0.92, (dx * rightX + dz * rightZ) / horizDist));

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = atten;

    if (typeof this.ctx.createStereoPanner === 'function') {
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = pan;
      gainNode.connect(panner);
      panner.connect(this.masterGain);
    } else {
      gainNode.connect(this.masterGain);
    }

    return { node: gainNode, gain: atten };
  }

  public playWeaponFire(weapon: WeaponId, pos?: SpatialPos): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const out = this.createSpatialOut(pos, weapon === 'awp' ? 95 : weapon === 'usp' ? 42 : 78);
    if (!out) return;

    const now = this.ctx.currentTime;

    if (weapon === 'ak47') {
      // Heavy low punch + gritty mid-high crack + bolt ping
      this.burstNoise(out.node, now, 0.24, 900, 0.7, 0.95, 'bandpass');
      this.burstNoise(out.node, now, 0.14, 2400, 1.1, 0.65, 'highpass');
      this.toneSweep(out.node, now, 165, 42, 0.16, 0.85, 'triangle');
      this.toneSweep(out.node, now + 0.015, 780, 320, 0.045, 0.22, 'sawtooth');
    } else if (weapon === 'm4a4') {
      // Tighter, crisper high-RPM crack
      this.burstNoise(out.node, now, 0.17, 1650, 0.9, 0.82, 'bandpass');
      this.burstNoise(out.node, now, 0.10, 3400, 0.8, 0.52, 'highpass');
      this.toneSweep(out.node, now, 210, 58, 0.11, 0.6, 'triangle');
      this.toneSweep(out.node, now, 1100, 520, 0.03, 0.2, 'square');
    } else if (weapon === 'awp') {
      // Massive sniper cannon boom + desert echo tail + bolt cycle
      this.burstNoise(out.node, now, 0.58, 650, 0.5, 1.15, 'lowpass');
      this.burstNoise(out.node, now, 0.32, 1800, 0.7, 0.9, 'bandpass');
      this.toneSweep(out.node, now, 130, 26, 0.42, 1.1, 'sine');
      this.toneSweep(out.node, now, 240, 48, 0.28, 0.7, 'sawtooth');
      // Subtle delayed desert echo
      this.burstNoise(out.node, now + 0.18, 0.35, 900, 0.8, 0.24, 'bandpass');
      // Bolt action cycle click (only clearly audible up close)
      if (!pos) {
        this.playMechanicalClick(out.node, now + 0.48, 1900, 0.18);
        this.playMechanicalClick(out.node, now + 0.68, 1450, 0.22);
      }
    } else if (weapon === 'glock') {
      // Crisp compact 9mm pop
      this.burstNoise(out.node, now, 0.11, 1900, 1.0, 0.62, 'bandpass');
      this.toneSweep(out.node, now, 280, 75, 0.08, 0.52, 'triangle');
    } else if (weapon === 'usp') {
      // Suppressed tactical thwip
      this.burstNoise(out.node, now, 0.08, 2800, 1.5, 0.38, 'bandpass');
      this.toneSweep(out.node, now, 420, 120, 0.055, 0.28, 'sine');
      this.playMechanicalClick(out.node, now + 0.01, 3200, 0.12);
    } else if (weapon === 'deagle') {
      // Heavy .50 cal hand-cannon bark
      this.burstNoise(out.node, now, 0.28, 1100, 0.7, 0.98, 'bandpass');
      this.toneSweep(out.node, now, 185, 38, 0.2, 0.92, 'triangle');
      this.toneSweep(out.node, now + 0.01, 950, 340, 0.06, 0.3, 'sawtooth');
    } else if (weapon === 'knife') {
      // Air whoosh
      this.burstNoise(out.node, now, 0.13, 1200, 2.2, 0.32, 'bandpass');
      this.toneSweep(out.node, now, 520, 180, 0.1, 0.12, 'sine');
    }
  }

  public playReload(stage: 'start' | 'end', pos?: SpatialPos): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const out = this.createSpatialOut(pos, 22);
    if (!out) return;
    const now = this.ctx.currentTime;

    if (stage === 'start') {
      // Mag release + pull out
      this.playMechanicalClick(out.node, now, 1600, 0.26);
      this.burstNoise(out.node, now + 0.06, 0.09, 900, 1.5, 0.18, 'bandpass');
      this.playMechanicalClick(out.node, now + 0.22, 1100, 0.2);
    } else {
      // Mag lock + slide/bolt rack
      this.playMechanicalClick(out.node, now, 1200, 0.28);
      this.playMechanicalClick(out.node, now + 0.09, 2100, 0.24);
      this.burstNoise(out.node, now + 0.11, 0.07, 2600, 1.2, 0.2, 'bandpass');
    }
  }

  public playScope(zoomLevel: number): void {
    if (!this.ctx) return;
    const out = this.createSpatialOut(undefined);
    if (!out) return;
    const now = this.ctx.currentTime;
    const freq = zoomLevel === 0 ? 1100 : zoomLevel === 1 ? 1750 : 2300;
    this.playMechanicalClick(out.node, now, freq, 0.26);
    this.toneSweep(out.node, now, freq * 0.6, freq * 1.1, 0.045, 0.12, 'sine');
  }

  public playFootstep(pos?: SpatialPos, running = true): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const out = this.createSpatialOut(pos, running ? 28 : 12);
    if (!out) return;
    const now = this.ctx.currentTime;
    const vol = running ? 0.22 : 0.08;
    // Gritty desert stone/sand crunch
    this.burstNoise(out.node, now, 0.065, 650 + Math.random() * 280, 1.1, vol, 'bandpass');
    this.toneSweep(out.node, now, 110 + Math.random() * 25, 48, 0.055, vol * 0.85, 'sine');
  }

  public playHitFeedback(headshot: boolean): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const out = this.createSpatialOut(undefined);
    if (!out) return;
    const now = this.ctx.currentTime;

    if (headshot) {
      // Iconic helmet/headshot crisp metallic "dink"
      this.toneSweep(out.node, now, 2850, 1650, 0.09, 0.48, 'triangle');
      this.toneSweep(out.node, now, 1480, 820, 0.07, 0.35, 'sawtooth');
      this.burstNoise(out.node, now, 0.05, 3800, 2.0, 0.32, 'bandpass');
    } else {
      // Crisp flesh/armor hit tick
      this.toneSweep(out.node, now, 620, 260, 0.05, 0.28, 'triangle');
      this.burstNoise(out.node, now, 0.04, 1500, 1.5, 0.2, 'bandpass');
    }
  }

  public playKillChime(headshot: boolean): void {
    if (!this.ctx) return;
    const out = this.createSpatialOut(undefined);
    if (!out) return;
    const now = this.ctx.currentTime;
    const base = headshot ? 987.77 : 783.99; // B5 or G5
    this.toneSweep(out.node, now, base, base, 0.11, 0.22, 'sine');
    this.toneSweep(out.node, now + 0.075, base * 1.25, base * 1.25, 0.16, 0.24, 'sine');
  }

  public playHurt(): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const out = this.createSpatialOut(undefined);
    if (!out) return;
    const now = this.ctx.currentTime;
    this.toneSweep(out.node, now, 170, 62, 0.14, 0.45, 'sawtooth');
    this.burstNoise(out.node, now, 0.08, 900, 1.0, 0.3, 'lowpass');
  }

  public playC4Keypad(pos?: SpatialPos): void {
    if (!this.ctx) return;
    const out = this.createSpatialOut(pos, 32);
    if (!out) return;
    const now = this.ctx.currentTime;
    const pitch = 1400 + Math.floor(Math.random() * 5) * 180;
    this.toneSweep(out.node, now, pitch, pitch, 0.06, 0.25, 'square');
  }

  public playC4Beep(pos: SpatialPos, urgency = 0): void {
    if (!this.ctx) return;
    const out = this.createSpatialOut(pos, 85);
    if (!out) return;
    const now = this.ctx.currentTime;
    const freq = 2650 + urgency * 450;
    this.toneSweep(out.node, now, freq, freq, 0.09, 0.38, 'sine');
    this.toneSweep(out.node, now, freq * 2, freq * 2, 0.06, 0.12, 'square');
  }

  public playC4Planted(): void {
    if (!this.ctx) return;
    const out = this.createSpatialOut(undefined);
    if (!out) return;
    const now = this.ctx.currentTime;
    this.toneSweep(out.node, now, 880, 880, 0.12, 0.28, 'sine');
    this.toneSweep(out.node, now + 0.14, 1175, 1175, 0.16, 0.3, 'sine');
  }

  public playC4DefuseStart(pos?: SpatialPos): void {
    if (!this.ctx) return;
    const out = this.createSpatialOut(pos, 36);
    if (!out) return;
    const now = this.ctx.currentTime;
    this.toneSweep(out.node, now, 1250, 900, 0.08, 0.28, 'square');
    this.toneSweep(out.node, now + 0.1, 950, 1400, 0.1, 0.24, 'sine');
  }

  public playC4Defused(): void {
    if (!this.ctx) return;
    const out = this.createSpatialOut(undefined);
    if (!out) return;
    const now = this.ctx.currentTime;
    this.toneSweep(out.node, now, 523.25, 523.25, 0.12, 0.28, 'triangle');
    this.toneSweep(out.node, now + 0.12, 659.25, 659.25, 0.12, 0.28, 'triangle');
    this.toneSweep(out.node, now + 0.24, 783.99, 783.99, 0.25, 0.32, 'triangle');
  }

  public playC4Explosion(pos: SpatialPos): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const out = this.createSpatialOut(pos, 180);
    if (!out) return;
    const now = this.ctx.currentTime;
    // Huge layered explosion
    this.burstNoise(out.node, now, 1.8, 320, 0.4, 1.4, 'lowpass');
    this.burstNoise(out.node, now, 1.1, 1100, 0.6, 1.0, 'bandpass');
    this.toneSweep(out.node, now, 95, 18, 1.25, 1.3, 'sine');
    this.toneSweep(out.node, now, 140, 24, 0.85, 0.9, 'sawtooth');
  }

  public playBulletImpact(pos: SpatialPos, metallic = false): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const out = this.createSpatialOut(pos, 35);
    if (!out) return;
    const now = this.ctx.currentTime;
    if (metallic) {
      this.toneSweep(out.node, now, 2200 + Math.random() * 600, 900, 0.08, 0.22, 'triangle');
    } else {
      this.burstNoise(out.node, now, 0.055, 1400, 1.2, 0.22, 'bandpass');
    }
  }

  public playBuySound(): void {
    if (!this.ctx) return;
    const out = this.createSpatialOut(undefined);
    if (!out) return;
    const now = this.ctx.currentTime;
    this.playMechanicalClick(out.node, now, 1800, 0.24);
    this.toneSweep(out.node, now + 0.04, 1046, 1318, 0.09, 0.18, 'triangle');
  }

  public playRoundEnd(victory: boolean): void {
    if (!this.ctx) return;
    const out = this.createSpatialOut(undefined);
    if (!out) return;
    const now = this.ctx.currentTime;
    const notes = victory ? [523.25, 659.25, 783.99, 1046.5] : [440, 392, 349.23, 311.13];
    notes.forEach((n, idx) => {
      this.toneSweep(out.node, now + idx * 0.11, n, n, 0.22, 0.2, 'triangle');
    });
  }

  private playMechanicalClick(dest: AudioNode, time: number, freq: number, volume: number): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.45, time + 0.03);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + 0.04);
  }

  private toneSweep(
    dest: AudioNode,
    time: number,
    fStart: number,
    fEnd: number,
    duration: number,
    volume: number,
    type: OscillatorType
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, fStart), time);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), time + duration);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + duration + 0.01);
  }

  private burstNoise(
    dest: AudioNode,
    time: number,
    duration: number,
    freq: number,
    q: number,
    volume: number,
    filterType: BiquadFilterType
  ): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(freq, time);
    filter.Q.setValueAtTime(q, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    src.start(time, Math.random() * 0.8, duration + 0.02);
  }
}

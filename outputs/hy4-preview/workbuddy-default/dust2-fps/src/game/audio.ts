/**
 * Fully procedural game audio (Web Audio API). No sample files anywhere —
 * gunshots are noise bursts shaped by weapon-specific filter envelopes,
 * UI / C4 cues are simple oscillator voices.
 */

import { clamp, dot3 } from './mathUtils';
import { WEAPONS, type WeaponId } from './weapons';

export interface ListenerState {
  x: number;
  z: number;
  /** unit forward vector on the XZ plane */
  fx: number;
  fz: number;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private listener: ListenerState = { x: 0, z: 0, fx: 0, fz: -1 };
  private voices = 0;
  private maxVoices = 28;
  private lastFootstep = 0;
  muted = false;
  masterVolume = 0.75;

  /** Must be called from a user gesture. */
  ensure(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const Ctor: typeof AudioContext | undefined =
      (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = this.masterVolume;
    master.connect(ctx.destination);
    this.master = master;

    // 2 s of white noise, reused by every noise voice.
    const len = Math.floor(ctx.sampleRate * 2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let seed = 22222;
    for (let i = 0; i < len; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      data[i] = (seed / 0x3fffffff) - 1;
    }
    this.noise = buf;
  }

  get ready(): boolean { return this.ctx !== null && this.master !== null; }

  setVolume(v: number): void {
    this.masterVolume = clamp(v, 0, 1);
    if (this.master) this.master.gain.value = this.muted ? 0 : this.masterVolume;
  }

  setMuted(m: boolean): void {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : this.masterVolume;
  }

  setListener(x: number, z: number, fx: number, fz: number): void {
    this.listener.x = x;
    this.listener.z = z;
    const l = Math.hypot(fx, fz) || 1;
    this.listener.fx = fx / l;
    this.listener.fz = fz / l;
  }

  // -- routing -------------------------------------------------------------

  /** Distance attenuation + stereo placement for a world-space sound. */
  private spatial(x: number, z: number, refDist: number, maxDist: number): { gain: number; pan: number } {
    const dx = x - this.listener.x;
    const dz = z - this.listener.z;
    const d = Math.hypot(dx, dz);
    if (d > maxDist) return { gain: 0, pan: 0 };
    const gain = refDist / (refDist + Math.max(0, d - 1.5) * 0.75);
    const l = d > 0.001 ? 1 / d : 0;
    // right vector on the XZ plane for a Y-up listener
    const pan = clamp(dot3(dx * l, 0, dz * l, -this.listener.fz, 0, this.listener.fx), -1, 1);
    return { gain: clamp(gain, 0, 1), pan };
  }

  private out(gain: number, pan: number): GainNode | null {
    if (!this.ctx || !this.master) return null;
    const g = this.ctx.createGain();
    g.gain.value = gain;
    if (this.ctx.createStereoPanner) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = clamp(pan, -1, 1);
      g.connect(p);
      p.connect(this.master);
    } else {
      g.connect(this.master);
    }
    return g;
  }

  private claim(duration: number): boolean {
    if (!this.ready || this.muted) return false;
    if (this.voices >= this.maxVoices) return false;
    this.voices++;
    setTimeout(() => { this.voices--; }, Math.max(60, duration * 1000 + 60));
    return true;
  }

  /** Filtered noise burst — the backbone of every gunshot. */
  private noiseBurst(opts: {
    gain: number; pan: number; dur: number; attack: number;
    cutoff: number; cutoffEnd?: number; q?: number; type?: BiquadFilterType;
    delay?: number;
  }): void {
    const ctx = this.ctx;
    if (!ctx || !this.noise) return;
    const dest = this.out(opts.gain, opts.pan);
    if (!dest) return;
    const t0 = ctx.currentTime + (opts.delay ?? 0);

    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.playbackRate.value = 0.85 + Math.random() * 0.3;
    const offset = Math.random() * 1.5;

    const filt = ctx.createBiquadFilter();
    filt.type = opts.type ?? 'lowpass';
    filt.frequency.setValueAtTime(Math.max(60, opts.cutoff), t0);
    if (opts.cutoffEnd !== undefined) {
      filt.frequency.exponentialRampToValueAtTime(Math.max(60, opts.cutoffEnd), t0 + opts.dur);
    }
    filt.Q.value = opts.q ?? 1;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(1, t0 + opts.attack);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);

    src.connect(filt);
    filt.connect(env);
    env.connect(dest);
    src.start(t0, offset, opts.dur + 0.05);
    src.stop(t0 + opts.dur + 0.06);
  }

  /** Pitched body / transient. */
  private tone(opts: {
    gain: number; pan: number; freq: number; freqEnd?: number; dur: number;
    type?: OscillatorType; delay?: number; attack?: number;
  }): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const dest = this.out(opts.gain, opts.pan);
    if (!dest) return;
    const t0 = ctx.currentTime + (opts.delay ?? 0);

    const osc = ctx.createOscillator();
    osc.type = opts.type ?? 'sine';
    osc.frequency.setValueAtTime(opts.freq, t0);
    if (opts.freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.freqEnd), t0 + opts.dur);
    }
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(1, t0 + (opts.attack ?? 0.002));
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    osc.connect(env);
    env.connect(dest);
    osc.start(t0);
    osc.stop(t0 + opts.dur + 0.02);
  }

  // -- public sound API ----------------------------------------------------

  /** Weapon fire. `self` plays a drier, louder variant for the local player. */
  shot(id: WeaponId, x: number, z: number, self: boolean): void {
    const def = WEAPONS[id];
    const p = def.audio;
    const sp = this.spatial(x, z, self ? 60 : 15, self ? 400 : 95);
    if (sp.gain <= 0.001) return;
    const g = self ? 1 : sp.gain;
    const pan = self ? 0 : sp.pan;
    if (!this.claim(p.dur + p.tail + 0.2)) return;

    // 1. muzzle transient (bright noise)
    this.noiseBurst({
      gain: 0.55 * p.gain * g, pan, dur: p.dur * 0.55, attack: 0.0012,
      cutoff: p.cutoff * 1.8, cutoffEnd: p.cutoff * 0.5, q: 0.9,
    });
    // 2. body resonance
    this.tone({
      gain: 0.5 * p.gain * g, pan, freq: p.freq, freqEnd: p.freq * 0.35,
      dur: p.dur * 1.3, type: 'triangle',
    });
    // 3. low thump
    this.tone({
      gain: 0.42 * p.gain * g, pan, freq: p.freq * 0.45, freqEnd: p.freq * 0.18,
      dur: p.dur * 1.8, type: 'sine',
    });
    // 4. tail (room reflection), delayed + low-passed
    if (p.tail > 0.05) {
      this.noiseBurst({
        gain: 0.22 * p.gain * g, pan, dur: p.tail, attack: 0.02,
        cutoff: p.cutoff * 0.55, cutoffEnd: 220, q: 0.7, delay: 0.035,
      });
    }
    // 5. weapon-specific mechanical click
    if (id === 'awp') this.tone({ gain: 0.25 * g, pan, freq: 1800, freqEnd: 700, dur: 0.05, type: 'square', delay: 0.02 });
    if (id === 'deagle') this.tone({ gain: 0.18 * g, pan, freq: 2400, freqEnd: 900, dur: 0.04, type: 'square', delay: 0.01 });
  }

  dryFire(): void {
    if (!this.claim(0.08)) return;
    this.tone({ gain: 0.22, pan: 0, freq: 1500, freqEnd: 500, dur: 0.045, type: 'square' });
  }

  reload(id: WeaponId, stage: 'out' | 'in' | 'done'): void {
    if (!this.claim(0.16)) return;
    switch (stage) {
      case 'out':
        this.tone({ gain: 0.20, pan: -0.15, freq: 900, freqEnd: 380, dur: 0.07, type: 'square' });
        this.noiseBurst({ gain: 0.16, pan: -0.15, dur: 0.09, attack: 0.004, cutoff: 3200, cutoffEnd: 900 });
        break;
      case 'in':
        this.tone({ gain: 0.24, pan: 0.1, freq: 520, freqEnd: 200, dur: 0.09, type: 'square' });
        this.noiseBurst({ gain: 0.20, pan: 0.1, dur: 0.11, attack: 0.006, cutoff: 2400, cutoffEnd: 700 });
        break;
      case 'done':
        this.tone({ gain: 0.26, pan: 0, freq: 1700, freqEnd: 800, dur: 0.05, type: 'square' });
        break;
    }
    void id;
  }

  draw(id: WeaponId): void {
    if (!this.claim(0.2)) return;
    this.noiseBurst({ gain: 0.14, pan: 0, dur: 0.14, attack: 0.01, cutoff: 1800, cutoffEnd: 600 });
    void id;
  }

  scopeIn(): void {
    if (!this.claim(0.2)) return;
    this.tone({ gain: 0.22, pan: 0, freq: 1250, freqEnd: 620, dur: 0.055, type: 'square' });
    this.tone({ gain: 0.16, pan: 0, freq: 700, freqEnd: 340, dur: 0.07, type: 'square', delay: 0.06 });
  }

  scopeOut(): void {
    if (!this.claim(0.2)) return;
    this.tone({ gain: 0.16, pan: 0, freq: 620, freqEnd: 1250, dur: 0.05, type: 'square' });
  }

  footstep(x: number, z: number, self: boolean, running: boolean): void {
    const now = performance.now();
    if (!self && now - this.lastFootstep < 40) return;
    this.lastFootstep = now;
    const sp = this.spatial(x, z, self ? 40 : 6, self ? 100 : 34);
    if (sp.gain <= 0.002) return;
    if (!this.claim(0.14)) return;
    const g = (self ? 0.5 : sp.gain * 0.85) * (running ? 1.25 : 1);
    this.noiseBurst({
      gain: 0.34 * g, pan: self ? (Math.random() * 0.5 - 0.25) : sp.pan,
      dur: 0.085, attack: 0.003, cutoff: 900 + Math.random() * 500, cutoffEnd: 240, q: 1.4,
    });
    this.tone({ gain: 0.10 * g, pan: self ? 0 : sp.pan, freq: 110 + Math.random() * 40, freqEnd: 60, dur: 0.07, type: 'sine' });
  }

  impact(x: number, z: number): void {
    const sp = this.spatial(x, z, 8, 55);
    if (sp.gain <= 0.003) return;
    if (!this.claim(0.1)) return;
    this.noiseBurst({ gain: 0.16 * sp.gain, pan: sp.pan, dur: 0.06, attack: 0.001, cutoff: 5200, cutoffEnd: 900, q: 2.0 });
  }

  /** Local feedback: you landed a hit. */
  hitmarker(headshot: boolean): void {
    if (!this.claim(0.12)) return;
    this.tone({ gain: 0.30, pan: 0, freq: headshot ? 1750 : 1150, freqEnd: headshot ? 1500 : 1000, dur: 0.055, type: 'square' });
    if (headshot) this.tone({ gain: 0.18, pan: 0, freq: 2600, dur: 0.04, type: 'sine', delay: 0.045 });
  }

  hurt(): void {
    if (!this.claim(0.25)) return;
    this.noiseBurst({ gain: 0.30, pan: 0, dur: 0.20, attack: 0.005, cutoff: 700, cutoffEnd: 200, q: 1.2 });
    this.tone({ gain: 0.20, pan: 0, freq: 190, freqEnd: 90, dur: 0.22, type: 'sine' });
  }

  kill(isHeadshot: boolean): void {
    if (!this.claim(0.5)) return;
    const base = isHeadshot ? 1320 : 880;
    this.tone({ gain: 0.34, pan: 0, freq: base, dur: 0.075, type: 'square' });
    this.tone({ gain: 0.32, pan: 0, freq: base * 1.5, dur: 0.09, type: 'square', delay: 0.07 });
    if (isHeadshot) this.tone({ gain: 0.24, pan: 0, freq: base * 2, dur: 0.1, type: 'square', delay: 0.15 });
  }

  death(): void {
    if (!this.claim(0.7)) return;
    this.noiseBurst({ gain: 0.34, pan: 0, dur: 0.55, attack: 0.01, cutoff: 900, cutoffEnd: 110, q: 0.8 });
    this.tone({ gain: 0.24, pan: 0, freq: 220, freqEnd: 60, dur: 0.6, type: 'sine' });
  }

  // -- C4 ------------------------------------------------------------------

  c4Beep(pitch: number): void {
    if (!this.claim(0.2)) return;
    this.tone({ gain: 0.26, pan: 0, freq: pitch, dur: 0.075, type: 'square' });
  }

  c4PlantStart(): void {
    if (!this.claim(0.6)) return;
    this.noiseBurst({ gain: 0.18, pan: 0, dur: 0.5, attack: 0.02, cutoff: 1400, cutoffEnd: 500 });
    for (let i = 0; i < 4; i++) {
      this.tone({ gain: 0.18, pan: 0, freq: 700 + i * 90, dur: 0.06, type: 'square', delay: i * 0.09 });
    }
  }

  c4PlantDone(): void {
    if (!this.claim(0.5)) return;
    this.tone({ gain: 0.30, pan: 0, freq: 990, dur: 0.09, type: 'square' });
    this.tone({ gain: 0.30, pan: 0, freq: 1480, dur: 0.12, type: 'square', delay: 0.1 });
  }

  c4DefuseTick(): void {
    if (!this.claim(0.12)) return;
    this.tone({ gain: 0.16, pan: 0, freq: 2100, freqEnd: 1500, dur: 0.035, type: 'square' });
  }

  c4DefuseDone(): void {
    if (!this.claim(0.6)) return;
    this.tone({ gain: 0.30, pan: 0, freq: 660, dur: 0.1, type: 'square' });
    this.tone({ gain: 0.30, pan: 0, freq: 990, dur: 0.14, type: 'square', delay: 0.12 });
  }

  explosion(x: number, z: number): void {
    const sp = this.spatial(x, z, 90, 400);
    if (!this.claim(2.0)) return;
    const g = clamp(sp.gain * 1.4 + 0.35, 0, 1);
    this.noiseBurst({ gain: 0.9 * g, pan: sp.pan, dur: 1.5, attack: 0.004, cutoff: 2200, cutoffEnd: 90, q: 0.6 });
    this.noiseBurst({ gain: 0.5 * g, pan: sp.pan, dur: 2.2, attack: 0.05, cutoff: 500, cutoffEnd: 60, q: 0.5, delay: 0.08 });
    this.tone({ gain: 0.7 * g, pan: sp.pan, freq: 110, freqEnd: 22, dur: 1.1, type: 'sine' });
    this.tone({ gain: 0.4 * g, pan: sp.pan, freq: 62, freqEnd: 18, dur: 1.8, type: 'sine', delay: 0.05 });
  }

  roundStart(isPistol: boolean): void {
    if (!this.claim(1.0)) return;
    this.tone({ gain: 0.24, pan: 0, freq: 440, dur: 0.16, type: 'square' });
    this.tone({ gain: 0.24, pan: 0, freq: 660, dur: 0.22, type: 'square', delay: 0.18 });
    if (!isPistol) this.tone({ gain: 0.22, pan: 0, freq: 880, dur: 0.3, type: 'square', delay: 0.4 });
  }

  roundWin(winner: 'CT' | 'T'): void {
    if (!this.claim(1.2)) return;
    const base = winner === 'CT' ? 520 : 392;
    [0, 0.14, 0.3].forEach((d, i) => {
      this.tone({ gain: 0.26, pan: 0, freq: base * (1 + i * 0.26), dur: 0.24, type: 'square', delay: d });
    });
  }
}

export const audio = new AudioEngine();

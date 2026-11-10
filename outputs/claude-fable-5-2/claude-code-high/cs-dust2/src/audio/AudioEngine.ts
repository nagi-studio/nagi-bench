// All sound is synthesised with the Web Audio API — oscillators, filtered noise and envelopes.
// World sounds are attenuated by distance and panned relative to the listener.

import { WeaponId } from '../sim/weapons';

interface Listener {
  x: number;
  y: number;
  z: number;
  yaw: number;
}

interface Spatial {
  gain: number;
  pan: number;
  /** 0 (near) .. 1 (far): used to muffle distant sounds. */
  far: number;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private listener: Listener = { x: 0, y: 0, z: 0, yaw: 0 };
  volume = 0.7;

  /** Must be called from a user gesture (browser autoplay policy). */
  resume(): void {
    if (!this.ctx) {
      const Ctor: typeof AudioContext | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      try {
        this.ctx = new Ctor();
      } catch {
        return;
      }
      const ctx = this.ctx;
      this.master = ctx.createGain();
      this.master.gain.value = this.volume;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 6;
      comp.attack.value = 0.002;
      comp.release.value = 0.18;
      this.master.connect(comp);
      comp.connect(ctx.destination);
      // two seconds of white noise shared by every noise-based voice
      const len = ctx.sampleRate * 2;
      this.noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  suspend(): void {
    if (this.ctx && this.ctx.state === 'running') void this.ctx.suspend();
  }

  setVolume(v: number): void {
    this.volume = v;
    if (this.master) this.master.gain.value = v;
  }

  setListener(x: number, y: number, z: number, yaw: number): void {
    this.listener.x = x;
    this.listener.y = y;
    this.listener.z = z;
    this.listener.yaw = yaw;
  }

  dispose(): void {
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
    this.master = null;
  }

  // ------------------------------------------------------------------ building blocks
  private spatial(x: number, y: number, z: number, ref: number, maxDist: number): Spatial | null {
    const l = this.listener;
    const dx = x - l.x;
    const dy = y - l.y;
    const dz = z - l.z;
    const d = Math.hypot(dx, dy, dz);
    if (d > maxDist) return null;
    const gain = Math.min(1, ref / Math.max(ref, d)) * (1 - Math.pow(d / maxDist, 2));
    // right vector of the listener = (cos yaw, -sin yaw)
    const h = Math.hypot(dx, dz);
    const pan = h < 0.3 ? 0 : (dx * Math.cos(l.yaw) - dz * Math.sin(l.yaw)) / h;
    return { gain, pan: Math.max(-1, Math.min(1, pan * 0.85)), far: Math.min(1, d / maxDist) };
  }

  /** Output chain for one voice: gain -> (pan) -> master. Returns the node to connect sources to. */
  private out(gain: number, pan: number): GainNode | null {
    const ctx = this.ctx;
    if (!ctx || !this.master || ctx.state !== 'running') return null;
    const g = ctx.createGain();
    g.gain.value = gain;
    if (pan !== 0 && typeof ctx.createStereoPanner === 'function') {
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      g.connect(p);
      p.connect(this.master);
    } else {
      g.connect(this.master);
    }
    return g;
  }

  /** Filtered noise burst with an exponential decay. */
  private noise(dest: AudioNode, t0: number, dur: number, peak: number, type: BiquadFilterType, freq: number, q = 0.8, freqEnd?: number, attack = 0.001): void {
    const ctx = this.ctx;
    if (!ctx || !this.noiseBuf) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t0);
    if (freqEnd !== undefined) f.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t0 + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(t0, Math.random() * 1.5);
    src.stop(t0 + dur + 0.02);
  }

  /** Oscillator with pitch slide and exponential decay. */
  private tone(dest: AudioNode, t0: number, dur: number, peak: number, type: OscillatorType, f0: number, f1?: number, attack = 0.002): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    if (f1 !== undefined) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  // ------------------------------------------------------------------ weapons
  /** Gunshot. Each weapon has its own body, crack and tail so they are easy to tell apart. */
  shot(weapon: WeaponId, x: number, y: number, z: number, own: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const sp = own ? { gain: 1, pan: 0, far: 0 } : this.spatial(x, y, z, 7, 150);
    if (!sp) return;
    const dest = this.out(sp.gain * (own ? 0.9 : 1), sp.pan);
    if (!dest) return;
    const t = ctx.currentTime;
    // distant shots lose their high end
    const hf = 1 - sp.far * 0.75;
    switch (weapon) {
      case 'ak47':
        // deep, barking report with a long gritty tail
        this.tone(dest, t, 0.16, 0.9, 'triangle', 170, 46);
        this.noise(dest, t, 0.09, 0.9, 'bandpass', 1400 * hf, 0.7);
        this.noise(dest, t, 0.32, 0.5, 'lowpass', 2600 * hf, 0.5, 300);
        this.tone(dest, t, 0.05, 0.25, 'square', 320, 110);
        break;
      case 'm4a1':
        // tighter, higher and snappier
        this.tone(dest, t, 0.09, 0.6, 'triangle', 260, 90);
        this.noise(dest, t, 0.06, 0.85, 'bandpass', 2600 * hf, 0.9);
        this.noise(dest, t, 0.2, 0.34, 'highpass', 1500 * hf, 0.5);
        this.noise(dest, t, 0.18, 0.25, 'lowpass', 1800 * hf, 0.5, 400);
        break;
      case 'awp':
        // cannon-like boom with a rolling echo
        this.tone(dest, t, 0.5, 1.0, 'sine', 120, 30);
        this.tone(dest, t, 0.2, 0.6, 'triangle', 210, 50);
        this.noise(dest, t, 0.16, 1.0, 'bandpass', 900 * hf, 0.6);
        this.noise(dest, t, 0.9, 0.55, 'lowpass', 3000 * hf, 0.4, 160);
        this.noise(dest, t + 0.14, 0.7, 0.2, 'lowpass', 900, 0.4, 150, 0.05);
        this.noise(dest, t + 0.3, 0.6, 0.1, 'lowpass', 600, 0.4, 120, 0.08);
        break;
      case 'deagle':
        // heavy hand-cannon crack
        this.tone(dest, t, 0.2, 0.85, 'triangle', 190, 42);
        this.noise(dest, t, 0.1, 0.9, 'bandpass', 1100 * hf, 0.7);
        this.noise(dest, t, 0.4, 0.4, 'lowpass', 2200 * hf, 0.5, 220);
        break;
      case 'usp':
        // short, dry pop
        this.tone(dest, t, 0.07, 0.5, 'triangle', 330, 110);
        this.noise(dest, t, 0.05, 0.7, 'bandpass', 2100 * hf, 1.1);
        this.noise(dest, t, 0.12, 0.2, 'lowpass', 1500 * hf, 0.5, 400);
        break;
      case 'glock':
      default:
        // light, clicky snap
        this.tone(dest, t, 0.05, 0.42, 'square', 520, 170);
        this.noise(dest, t, 0.045, 0.7, 'bandpass', 3200 * hf, 1.2);
        this.noise(dest, t, 0.1, 0.18, 'highpass', 2200 * hf, 0.5);
        break;
    }
  }

  knife(hit: boolean, x: number, y: number, z: number, own: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const sp = own ? { gain: 0.8, pan: 0, far: 0 } : this.spatial(x, y, z, 3, 25);
    if (!sp) return;
    const dest = this.out(sp.gain, sp.pan);
    if (!dest) return;
    const t = ctx.currentTime;
    this.noise(dest, t, 0.16, 0.5, 'bandpass', 900, 1.5, 4200, 0.03); // swish
    if (hit) {
      this.noise(dest, t + 0.05, 0.1, 0.8, 'lowpass', 700, 0.8, 200);
      this.tone(dest, t + 0.05, 0.08, 0.4, 'sine', 140, 60);
    }
  }

  dryFire(): void {
    const ctx = this.ctx;
    const dest = this.out(0.5, 0);
    if (!ctx || !dest) return;
    this.tone(dest, ctx.currentTime, 0.03, 0.4, 'square', 1900, 900);
    this.noise(dest, ctx.currentTime, 0.02, 0.3, 'highpass', 4000);
  }

  private click(dest: AudioNode, t: number, pitch: number, level: number): void {
    this.noise(dest, t, 0.035, level, 'bandpass', pitch, 2.5);
    this.tone(dest, t, 0.04, level * 0.5, 'square', pitch * 0.5, pitch * 0.25);
  }

  /** Magazine out, magazine in, bolt/slide — timed to the weapon's reload duration. */
  reload(weapon: WeaponId, duration: number, x: number, y: number, z: number, own: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const sp = own ? { gain: 0.75, pan: 0, far: 0 } : this.spatial(x, y, z, 2.5, 22);
    if (!sp) return;
    const dest = this.out(sp.gain, sp.pan);
    if (!dest) return;
    const t = ctx.currentTime;
    const heavy = weapon === 'awp' || weapon === 'ak47';
    this.click(dest, t + duration * 0.2, heavy ? 900 : 1400, 0.5); // mag release
    this.noise(dest, t + duration * 0.24, 0.12, 0.2, 'bandpass', 600, 1, 300, 0.02); // mag slides out
    this.click(dest, t + duration * 0.55, heavy ? 700 : 1100, 0.7); // mag seated
    this.tone(dest, t + duration * 0.55, 0.06, 0.25, 'sine', 180, 90);
    // charging handle / slide: two-part "cha-chak"
    this.click(dest, t + duration * 0.8, heavy ? 1300 : 1900, 0.55);
    this.click(dest, t + duration * 0.8 + 0.09, heavy ? 1000 : 1500, 0.75);
  }

  /** AWP bolt cycling after a shot. */
  bolt(): void {
    const ctx = this.ctx;
    const dest = this.out(0.6, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime;
    this.click(dest, t + 0.25, 1500, 0.4);
    this.noise(dest, t + 0.3, 0.1, 0.2, 'bandpass', 2400, 2, 1200, 0.02);
    this.click(dest, t + 0.55, 1100, 0.5);
    this.click(dest, t + 0.72, 1700, 0.55);
  }

  draw(weapon: WeaponId): void {
    const ctx = this.ctx;
    const dest = this.out(0.4, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime;
    if (weapon === 'knife') {
      this.noise(dest, t, 0.18, 0.4, 'bandpass', 3000, 3, 6500, 0.04);
      this.tone(dest, t + 0.03, 0.2, 0.12, 'sine', 3200, 4200);
    } else {
      this.noise(dest, t, 0.1, 0.35, 'bandpass', 500, 1, 1200, 0.03); // cloth
      this.click(dest, t + 0.12, 1600, 0.4);
    }
  }

  /** Scope in / out: a quick servo-like zip plus a click. */
  zoom(level: number): void {
    const ctx = this.ctx;
    const dest = this.out(0.45, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime;
    if (level > 0) {
      this.tone(dest, t, 0.09, 0.3, 'sine', 500 + level * 250, 1500 + level * 500, 0.01);
      this.noise(dest, t, 0.08, 0.2, 'bandpass', 2500, 3, 6000, 0.01);
      this.click(dest, t + 0.08, 2600, 0.3);
    } else {
      this.tone(dest, t, 0.08, 0.25, 'sine', 1500, 500, 0.01);
      this.click(dest, t + 0.06, 2000, 0.25);
    }
  }

  // ------------------------------------------------------------------ movement
  footstep(x: number, y: number, z: number, own: boolean, indoor: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const sp = own ? { gain: 0.32, pan: 0, far: 0 } : this.spatial(x, y, z, 3, 26);
    if (!sp) return;
    const dest = this.out(sp.gain * (own ? 1 : 1.5), sp.pan);
    if (!dest) return;
    const t = ctx.currentTime;
    const p = 0.9 + Math.random() * 0.25;
    this.noise(dest, t, 0.07, 0.7, 'lowpass', (indoor ? 520 : 760) * p, 1.2, 160);
    this.tone(dest, t, 0.06, 0.5, 'sine', 95 * p, 50);
    this.noise(dest, t + 0.012, 0.03, 0.18, 'bandpass', (indoor ? 1800 : 3000) * p, 1.5); // grit
  }

  jump(): void {
    const ctx = this.ctx;
    const dest = this.out(0.25, 0);
    if (!ctx || !dest) return;
    this.noise(dest, ctx.currentTime, 0.1, 0.4, 'bandpass', 400, 1, 900, 0.03);
  }

  land(x: number, y: number, z: number, own: boolean, speed: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const sp = own ? { gain: 0.5, pan: 0, far: 0 } : this.spatial(x, y, z, 3, 25);
    if (!sp) return;
    const dest = this.out(sp.gain * Math.min(1.4, speed / 7), sp.pan);
    if (!dest) return;
    const t = ctx.currentTime;
    this.noise(dest, t, 0.12, 0.9, 'lowpass', 500, 1, 120);
    this.tone(dest, t, 0.1, 0.7, 'sine', 80, 40);
  }

  // ------------------------------------------------------------------ feedback
  /** Hit confirmation for the shooter: a dull tick for body hits, a bright ding for headshots. */
  hitMarker(headshot: boolean): void {
    const ctx = this.ctx;
    const dest = this.out(0.5, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime;
    if (headshot) {
      this.tone(dest, t, 0.16, 0.5, 'sine', 2400, 2100);
      this.tone(dest, t, 0.1, 0.25, 'triangle', 3600, 3000);
      this.noise(dest, t, 0.03, 0.4, 'highpass', 5000);
    } else {
      this.noise(dest, t, 0.04, 0.55, 'bandpass', 1500, 2);
      this.tone(dest, t, 0.05, 0.35, 'triangle', 700, 400);
    }
  }

  /** The local player takes damage. */
  hurt(): void {
    const ctx = this.ctx;
    const dest = this.out(0.6, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime;
    this.noise(dest, t, 0.12, 0.8, 'lowpass', 900, 1, 200);
    this.tone(dest, t, 0.14, 0.5, 'sawtooth', 150, 70);
  }

  /** Kill confirmation: a bright two-note chime (three notes for a headshot). */
  kill(headshot: boolean): void {
    const ctx = this.ctx;
    const dest = this.out(0.5, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime + 0.05;
    this.tone(dest, t, 0.22, 0.5, 'sine', 880);
    this.tone(dest, t, 0.22, 0.14, 'triangle', 1760);
    this.tone(dest, t + 0.09, 0.3, 0.5, 'sine', 1318.5);
    this.tone(dest, t + 0.09, 0.3, 0.12, 'triangle', 2637);
    if (headshot) this.tone(dest, t + 0.18, 0.4, 0.45, 'sine', 1760);
  }

  /** A teammate or the player died. */
  death(): void {
    const ctx = this.ctx;
    const dest = this.out(0.5, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime;
    this.tone(dest, t, 0.5, 0.5, 'sawtooth', 220, 55);
    this.noise(dest, t, 0.4, 0.4, 'lowpass', 700, 0.7, 120);
  }

  // ------------------------------------------------------------------ bomb
  /** Keypad presses while arming. */
  plantStart(x: number, y: number, z: number, own: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const sp = own ? { gain: 0.6, pan: 0, far: 0 } : this.spatial(x, y, z, 4, 40);
    if (!sp) return;
    const dest = this.out(sp.gain, sp.pan);
    if (!dest) return;
    const t = ctx.currentTime;
    const notes = [1200, 1500, 1200, 1800, 1500, 1350, 1800];
    notes.forEach((f, i) => this.tone(dest, t + 0.25 + i * 0.36, 0.07, 0.3, 'square', f));
  }

  planted(): void {
    const ctx = this.ctx;
    const dest = this.out(0.6, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime;
    this.click(dest, t, 900, 0.7);
    this.tone(dest, t + 0.08, 0.5, 0.5, 'square', 660);
    this.tone(dest, t + 0.34, 0.6, 0.5, 'square', 990);
    this.tone(dest, t + 0.08, 0.9, 0.3, 'sine', 110, 80);
  }

  bombBeep(x: number, y: number, z: number, urgency: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const sp = this.spatial(x, y, z, 6, 75);
    if (!sp) return;
    const dest = this.out(sp.gain * 0.75, sp.pan);
    if (!dest) return;
    const t = ctx.currentTime;
    const f = 1900 + urgency * 700;
    this.tone(dest, t, 0.085, 0.6, 'square', f);
    this.tone(dest, t, 0.085, 0.3, 'sine', f * 2);
  }

  defuseStart(x: number, y: number, z: number, own: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const sp = own ? { gain: 0.6, pan: 0, far: 0 } : this.spatial(x, y, z, 4, 40);
    if (!sp) return;
    const dest = this.out(sp.gain, sp.pan);
    if (!dest) return;
    const t = ctx.currentTime;
    // case opening, then wire snips
    this.click(dest, t, 800, 0.6);
    this.noise(dest, t + 0.05, 0.25, 0.3, 'bandpass', 1800, 2, 700, 0.02);
    for (let i = 0; i < 4; i++) this.click(dest, t + 0.5 + i * 0.42, 2600 - i * 200, 0.35);
  }

  defused(): void {
    const ctx = this.ctx;
    const dest = this.out(0.6, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime;
    this.click(dest, t, 2400, 0.7);
    this.tone(dest, t + 0.05, 0.5, 0.5, 'square', 1400, 240);
    this.tone(dest, t + 0.5, 0.35, 0.4, 'sine', 523);
    this.tone(dest, t + 0.62, 0.35, 0.4, 'sine', 659);
    this.tone(dest, t + 0.74, 0.6, 0.4, 'sine', 784);
  }

  explosion(x: number, y: number, z: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const sp = this.spatial(x, y, z, 30, 400) ?? { gain: 0.5, pan: 0, far: 1 };
    const dest = this.out(Math.max(0.5, sp.gain) * 1.3, sp.pan * 0.5);
    if (!dest) return;
    const t = ctx.currentTime;
    this.tone(dest, t, 1.8, 1.0, 'sine', 90, 22);
    this.tone(dest, t, 0.6, 0.8, 'triangle', 160, 30);
    this.noise(dest, t, 0.35, 1.0, 'bandpass', 700, 0.5);
    this.noise(dest, t, 2.6, 0.9, 'lowpass', 2400, 0.4, 70);
    this.noise(dest, t + 0.25, 2.2, 0.4, 'lowpass', 500, 0.5, 60, 0.2);
    // debris
    for (let i = 0; i < 9; i++) this.noise(dest, t + 0.4 + Math.random() * 1.4, 0.08, 0.25, 'bandpass', 800 + Math.random() * 2500, 2);
  }

  pickup(): void {
    const ctx = this.ctx;
    const dest = this.out(0.45, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime;
    this.click(dest, t, 1200, 0.5);
    this.tone(dest, t + 0.04, 0.12, 0.3, 'sine', 700, 1100);
  }

  // ------------------------------------------------------------------ round stingers
  roundStart(): void {
    const ctx = this.ctx;
    const dest = this.out(0.4, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime;
    this.tone(dest, t, 0.18, 0.4, 'triangle', 440);
    this.tone(dest, t + 0.14, 0.3, 0.4, 'triangle', 660);
  }

  roundEnd(won: boolean): void {
    const ctx = this.ctx;
    const dest = this.out(0.5, 0);
    if (!ctx || !dest) return;
    const t = ctx.currentTime + 0.2;
    const seq = won ? [523, 659, 784, 1047] : [440, 370, 311, 233];
    seq.forEach((f, i) => {
      this.tone(dest, t + i * 0.16, 0.5, 0.4, 'triangle', f, undefined, 0.01);
      this.tone(dest, t + i * 0.16, 0.5, 0.2, 'sine', f / 2, undefined, 0.01);
    });
  }

  uiClick(): void {
    const ctx = this.ctx;
    const dest = this.out(0.3, 0);
    if (!ctx || !dest) return;
    this.tone(dest, ctx.currentTime, 0.05, 0.4, 'square', 900, 600);
  }
}

import type * as THREE from 'three';
import type { SoundProfile, WeaponKind } from '../weapons/WeaponDefs';

export interface SoundPos {
  x: number;
  y: number;
  z: number;
}

interface Emit {
  /** Connect sound sources here. */
  input: GainNode;
  t: number;
}

interface ShotRecipe {
  gain: number;
  thump: [number, number, number, number]; // f0, f1, sweep, decay
  thumpGain: number;
  bodyLP: number;
  bodyDecay: number;
  bodyGain: number;
  crackF: number;
  crackDecay: number;
  crackGain: number;
  tail: number;
  tailGain: number;
  reverb: number;
}

const SHOTS: Record<Exclude<SoundProfile, 'knife' | 'none' | 'usp'>, ShotRecipe> = {
  ak: { gain: 1, thump: [150, 46, 0.07, 0.16], thumpGain: 1.0, bodyLP: 1700, bodyDecay: 0.2, bodyGain: 0.9, crackF: 2400, crackDecay: 0.05, crackGain: 0.55, tail: 0.65, tailGain: 0.35, reverb: 0.5 },
  m4: { gain: 0.85, thump: [190, 70, 0.05, 0.11], thumpGain: 0.75, bodyLP: 2700, bodyDecay: 0.14, bodyGain: 0.8, crackF: 3600, crackDecay: 0.04, crackGain: 0.65, tail: 0.45, tailGain: 0.25, reverb: 0.4 },
  awp: { gain: 1.25, thump: [95, 28, 0.12, 0.35], thumpGain: 1.3, bodyLP: 1300, bodyDecay: 0.42, bodyGain: 1.0, crackF: 1900, crackDecay: 0.09, crackGain: 0.7, tail: 1.6, tailGain: 0.55, reverb: 0.9 },
  glock: { gain: 0.62, thump: [280, 120, 0.03, 0.06], thumpGain: 0.55, bodyLP: 3200, bodyDecay: 0.07, bodyGain: 0.7, crackF: 4200, crackDecay: 0.028, crackGain: 0.6, tail: 0.25, tailGain: 0.15, reverb: 0.3 },
  deagle: { gain: 1.1, thump: [125, 38, 0.08, 0.22], thumpGain: 1.15, bodyLP: 2000, bodyDecay: 0.28, bodyGain: 0.95, crackF: 2800, crackDecay: 0.06, crackGain: 0.6, tail: 0.85, tailGain: 0.4, reverb: 0.6 },
};

/**
 * All game audio synthesised with the Web Audio API — no sample files. Sounds are short node
 * graphs (noise bursts through filters, swept oscillators, envelopes) routed through optional
 * 3D panners, distance/occlusion low-pass filtering and a shared convolution reverb.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private sfx!: GainNode;
  private reverbIn!: GainNode;
  private noiseBuf!: AudioBuffer;
  private brownBuf!: AudioBuffer;
  private volume = 0.7;
  private listener = { x: 0, y: 0, z: 0 };
  private readonly loops = new Map<string, { stop: () => void }>();
  /** Occlusion test supplied by the engine (true = clear line of sight). */
  occlusion: ((from: SoundPos, to: SoundPos) => boolean) | null = null;

  get ready(): boolean {
    return this.ctx !== null && this.ctx.state === 'running';
  }

  /** Must be called from a user gesture. */
  init(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 12;
    comp.ratio.value = 5;
    comp.attack.value = 0.003;
    comp.release.value = 0.2;
    this.master = ctx.createGain();
    this.master.gain.value = this.volume;
    this.master.connect(comp);
    comp.connect(ctx.destination);
    this.sfx = ctx.createGain();
    this.sfx.connect(this.master);

    // synthetic impulse response: exponentially decaying stereo noise (outdoor slap-back + tail)
    const len = Math.floor(ctx.sampleRate * 1.8);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / ctx.sampleRate;
        const early = t > 0.045 && t < 0.07 ? 0.5 : 0;
        d[i] = (Math.random() * 2 - 1) * (Math.exp(-t * 3.2) * 0.6 + early * Math.exp(-(t - 0.045) * 40));
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = ir;
    const revOut = ctx.createGain();
    revOut.gain.value = 0.35;
    this.reverbIn = ctx.createGain();
    this.reverbIn.connect(conv);
    conv.connect(revOut);
    revOut.connect(this.master);

    const n = ctx.sampleRate * 2;
    this.noiseBuf = ctx.createBuffer(1, n, ctx.sampleRate);
    const nd = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < n; i++) nd[i] = Math.random() * 2 - 1;
    this.brownBuf = ctx.createBuffer(1, n, ctx.sampleRate);
    const bd = this.brownBuf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < n; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      bd[i] = last * 3.5;
    }
  }

  setVolume(v: number): void {
    this.volume = v;
    if (this.ctx) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
  }

  suspend(): void {
    void this.ctx?.suspend();
  }

  resume(): void {
    void this.ctx?.resume();
  }

  updateListener(pos: THREE.Vector3, forward: THREE.Vector3): void {
    this.listener.x = pos.x;
    this.listener.y = pos.y;
    this.listener.z = pos.z;
    const ctx = this.ctx;
    if (!ctx) return;
    const l = ctx.listener;
    if (l.positionX) {
      const t = ctx.currentTime;
      l.positionX.setValueAtTime(pos.x, t);
      l.positionY.setValueAtTime(pos.y, t);
      l.positionZ.setValueAtTime(pos.z, t);
      l.forwardX.setValueAtTime(forward.x, t);
      l.forwardY.setValueAtTime(forward.y, t);
      l.forwardZ.setValueAtTime(forward.z, t);
      l.upX.setValueAtTime(0, t);
      l.upY.setValueAtTime(1, t);
      l.upZ.setValueAtTime(0, t);
    } else {
      l.setPosition(pos.x, pos.y, pos.z);
      l.setOrientation(forward.x, forward.y, forward.z, 0, 1, 0);
    }
  }

  // ================================================================== routing helpers

  /**
   * Create an output chain. `pos === null` => non-spatial (the local player's own sounds).
   * Spatial sounds get a panner plus distance/occlusion low-pass.
   */
  private emit(pos: SoundPos | null, gain: number, reverb: number, maxDist = 140): Emit | null {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return null;
    const t = ctx.currentTime;
    const input = ctx.createGain();
    input.gain.value = gain;
    let tail: AudioNode = input;
    if (pos) {
      const dx = pos.x - this.listener.x;
      const dy = pos.y - this.listener.y;
      const dz = pos.z - this.listener.z;
      const dist = Math.hypot(dx, dy, dz);
      if (dist > maxDist) return null;
      const occluded = this.occlusion ? !this.occlusion(pos, this.listener) : false;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = Math.max(700, 18000 * Math.exp(-dist / 45)) * (occluded ? 0.25 : 1);
      lp.Q.value = 0.5;
      tail.connect(lp);
      const pan = ctx.createPanner();
      pan.panningModel = 'equalpower';
      pan.distanceModel = 'inverse';
      pan.refDistance = 4;
      pan.maxDistance = 400;
      pan.rolloffFactor = 1.1;
      if (pan.positionX) {
        pan.positionX.value = pos.x;
        pan.positionY.value = pos.y;
        pan.positionZ.value = pos.z;
      } else pan.setPosition(pos.x, pos.y, pos.z);
      lp.connect(pan);
      const occ = ctx.createGain();
      occ.gain.value = occluded ? 0.55 : 1;
      pan.connect(occ);
      tail = occ;
      reverb *= 1 + Math.min(1.5, dist / 30);
    }
    tail.connect(this.sfx);
    if (reverb > 0) {
      const send = ctx.createGain();
      send.gain.value = reverb;
      tail.connect(send);
      send.connect(this.reverbIn);
    }
    return { input, t };
  }

  private noise(out: AudioNode, t: number, dur: number, brown = false): AudioBufferSourceNode {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = brown ? this.brownBuf : this.noiseBuf;
    const off = Math.random() * 1.5;
    src.connect(out);
    src.start(t, off, dur + 0.05);
    return src;
  }

  private env(t: number, attack: number, peak: number, decay: number, curve: 'exp' | 'lin' = 'exp'): GainNode {
    const g = this.ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    if (curve === 'exp') g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    else g.gain.linearRampToValueAtTime(0, t + attack + decay);
    return g;
  }

  private filter(type: BiquadFilterType, freq: number, q = 0.7): BiquadFilterNode {
    const f = this.ctx!.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
  }

  private filteredNoise(e: Emit, t: number, type: BiquadFilterType, freq: number, q: number, attack: number, peak: number, decay: number, brown = false): void {
    const g = this.env(t, attack, peak, decay);
    const f = this.filter(type, freq, q);
    this.noise(f, t, attack + decay, brown);
    f.connect(g);
    g.connect(e.input);
  }

  private tone(e: Emit, t: number, type: OscillatorType, f0: number, f1: number, sweep: number, attack: number, peak: number, decay: number): void {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + sweep);
    const g = this.env(t, attack, peak, decay);
    o.connect(g);
    g.connect(e.input);
    o.start(t);
    o.stop(t + attack + decay + 0.05);
  }

  // ================================================================== weapons

  gunshot(profile: SoundProfile, pos: SoundPos | null): void {
    if (profile === 'none' || profile === 'knife') return;
    if (profile === 'usp') {
      // suppressed: soft "thwip" + slide clack, little reverb
      const e = this.emit(pos, pos ? 0.9 : 0.55, 0.12, 50);
      if (!e) return;
      const t = e.t;
      this.filteredNoise(e, t, 'bandpass', 1300, 1.6, 0.002, 0.9, 0.07);
      this.filteredNoise(e, t, 'highpass', 5000, 0.7, 0.001, 0.25, 0.03);
      this.tone(e, t, 'sine', 420, 160, 0.04, 0.002, 0.35, 0.05);
      this.filteredNoise(e, t + 0.035, 'bandpass', 2600, 4, 0.001, 0.35, 0.025);
      return;
    }
    const r = SHOTS[profile];
    const e = this.emit(pos, r.gain * (pos ? 1.6 : 0.85), r.reverb, 260);
    if (!e) return;
    const t = e.t;
    const jitter = 0.94 + Math.random() * 0.12;
    this.tone(e, t, 'sine', r.thump[0] * jitter, r.thump[1], r.thump[2], 0.002, r.thumpGain, r.thump[3]);
    this.tone(e, t, 'triangle', r.thump[0] * 2 * jitter, r.thump[1] * 1.5, r.thump[2], 0.001, r.thumpGain * 0.35, r.thump[3] * 0.6);
    this.filteredNoise(e, t, 'lowpass', r.bodyLP * jitter, 0.8, 0.0015, r.bodyGain, r.bodyDecay);
    this.filteredNoise(e, t, 'bandpass', r.crackF * jitter, 0.9, 0.0008, r.crackGain, r.crackDecay);
    this.filteredNoise(e, t + 0.01, 'lowpass', 700, 0.6, 0.02, r.tailGain, r.tail, true);
    // mechanical action
    if (!pos) this.filteredNoise(e, t + 0.03, 'bandpass', 3200, 5, 0.001, 0.12, 0.03);
  }

  knife(pos: SoundPos | null, hit: 'none' | 'wall' | 'flesh'): void {
    const e = this.emit(pos, 0.6, 0.05, 30);
    if (!e) return;
    const t = e.t;
    const g = this.env(t, 0.03, 0.6, 0.18);
    const f = this.filter('bandpass', 700, 1.4);
    f.frequency.setValueAtTime(700, t);
    f.frequency.exponentialRampToValueAtTime(3200, t + 0.16);
    this.noise(f, t, 0.25);
    f.connect(g);
    g.connect(e.input);
    if (hit === 'wall') {
      this.filteredNoise(e, t + 0.08, 'bandpass', 3800, 6, 0.001, 0.6, 0.12);
      this.tone(e, t + 0.08, 'triangle', 2600, 2400, 0.1, 0.001, 0.2, 0.15);
    } else if (hit === 'flesh') {
      this.filteredNoise(e, t + 0.07, 'lowpass', 500, 1, 0.002, 1.0, 0.1);
      this.tone(e, t + 0.07, 'sine', 140, 70, 0.06, 0.002, 0.6, 0.08);
    }
  }

  /** Reload foley timed to the weapon's reload duration. */
  reload(kind: WeaponKind, duration: number, pos: SoundPos | null): void {
    const e = this.emit(pos, pos ? 0.7 : 0.55, 0.05, 25);
    if (!e) return;
    const t = e.t;
    const at = (f: number) => t + duration * f;
    const click = (time: number, freq: number, gain: number, dur = 0.03) => {
      this.filteredNoise(e, time, 'bandpass', freq, 5, 0.001, gain, dur);
      this.tone(e, time, 'square', freq * 0.5, freq * 0.45, dur, 0.001, gain * 0.12, dur);
    };
    if (kind === 'sniper') {
      click(at(0.12), 1800, 0.8); // bolt up
      this.filteredNoise(e, at(0.15), 'bandpass', 2400, 2, 0.01, 0.4, 0.12); // bolt back
      click(at(0.35), 900, 0.9, 0.05); // mag out
      click(at(0.62), 1300, 1.0, 0.04); // mag in
      click(at(0.66), 1900, 0.6);
      this.filteredNoise(e, at(0.82), 'bandpass', 2600, 2, 0.01, 0.4, 0.1); // bolt forward
      click(at(0.86), 2100, 0.9);
    } else if (kind === 'pistol') {
      click(at(0.16), 1100, 0.8, 0.04); // mag release
      click(at(0.5), 1500, 1.0, 0.035); // mag in
      click(at(0.54), 2200, 0.5);
      this.filteredNoise(e, at(0.78), 'bandpass', 2800, 2.5, 0.005, 0.5, 0.06); // slide
      click(at(0.82), 2400, 0.8);
    } else {
      click(at(0.15), 900, 0.7, 0.05); // mag release
      this.filteredNoise(e, at(0.2), 'lowpass', 900, 1, 0.005, 0.5, 0.15); // mag slides out
      click(at(0.52), 1300, 1.0, 0.04); // new mag seats
      click(at(0.56), 1800, 0.7);
      this.filteredNoise(e, at(0.74), 'bandpass', 2500, 2, 0.01, 0.45, 0.09); // charging handle back
      click(at(0.8), 2200, 0.9, 0.035); // forward
    }
  }

  draw(kind: WeaponKind, pos: SoundPos | null): void {
    const e = this.emit(pos, 0.4, 0.02, 15);
    if (!e) return;
    const t = e.t;
    if (kind === 'knife') {
      this.filteredNoise(e, t, 'highpass', 5000, 1, 0.02, 0.35, 0.18);
      this.tone(e, t + 0.05, 'triangle', 3400, 3000, 0.2, 0.002, 0.08, 0.25);
    } else {
      this.filteredNoise(e, t + 0.05, 'bandpass', 2000, 3, 0.002, 0.6, 0.04);
      this.filteredNoise(e, t + 0.16, 'bandpass', 2800, 4, 0.001, 0.5, 0.03);
    }
  }

  dryFire(): void {
    const e = this.emit(null, 0.5, 0);
    if (!e) return;
    this.filteredNoise(e, e.t, 'bandpass', 3000, 6, 0.001, 0.9, 0.025);
  }

  scope(level: number): void {
    const e = this.emit(null, 0.45, 0.02);
    if (!e) return;
    const t = e.t;
    this.filteredNoise(e, t, 'bandpass', level === 2 ? 4200 : level === 1 ? 3200 : 2400, 5, 0.001, 0.8, 0.03);
    const g = this.env(t, 0.01, 0.25, 0.09);
    const f = this.filter('bandpass', 1500, 2);
    f.frequency.setValueAtTime(level ? 1200 : 3000, t);
    f.frequency.exponentialRampToValueAtTime(level ? 3200 : 1200, t + 0.09);
    this.noise(f, t, 0.12);
    f.connect(g);
    g.connect(e.input);
  }

  // ================================================================== movement

  footstep(pos: SoundPos | null, loud = 1): void {
    const e = this.emit(pos, (pos ? 1.1 : 0.32) * loud, 0.04, 35);
    if (!e) return;
    const t = e.t;
    const p = 0.85 + Math.random() * 0.3;
    this.filteredNoise(e, t, 'lowpass', 420 * p, 1.2, 0.004, 1, 0.09);
    this.tone(e, t, 'sine', 95 * p, 60, 0.05, 0.002, 0.5, 0.07);
    this.filteredNoise(e, t + 0.012, 'highpass', 3500 * p, 0.7, 0.002, 0.18, 0.05); // grit
  }

  land(pos: SoundPos | null, speed: number): void {
    const e = this.emit(pos, Math.min(1.4, speed / 6) * (pos ? 1 : 0.5), 0.05, 30);
    if (!e) return;
    this.filteredNoise(e, e.t, 'lowpass', 300, 1, 0.003, 1, 0.13);
    this.tone(e, e.t, 'sine', 80, 45, 0.08, 0.002, 0.7, 0.12);
  }

  // ================================================================== feedback

  hitMarker(headshot: boolean): void {
    const e = this.emit(null, headshot ? 0.55 : 0.4, headshot ? 0.15 : 0);
    if (!e) return;
    const t = e.t;
    if (headshot) {
      // helmet "dink"
      this.tone(e, t, 'sine', 2350, 2300, 0.2, 0.001, 0.7, 0.32);
      this.tone(e, t, 'sine', 3720, 3650, 0.2, 0.001, 0.45, 0.22);
      this.tone(e, t, 'sine', 5600, 5500, 0.1, 0.001, 0.2, 0.12);
      this.filteredNoise(e, t, 'highpass', 6000, 0.7, 0.001, 0.25, 0.04);
    } else {
      this.tone(e, t, 'sine', 240, 120, 0.05, 0.001, 0.8, 0.07);
      this.filteredNoise(e, t, 'bandpass', 1800, 3, 0.001, 0.4, 0.03);
    }
  }

  hurt(): void {
    const e = this.emit(null, 0.7, 0);
    if (!e) return;
    this.filteredNoise(e, e.t, 'lowpass', 260, 1, 0.004, 1, 0.16);
    this.tone(e, e.t, 'sine', 95, 50, 0.12, 0.003, 0.8, 0.15);
  }

  killConfirm(headshot: boolean): void {
    const e = this.emit(null, 0.35, 0.25);
    if (!e) return;
    const t = e.t;
    this.tone(e, t, 'triangle', 880, 880, 0.01, 0.004, 0.6, 0.12);
    this.tone(e, t + 0.07, 'triangle', headshot ? 1760 : 1320, headshot ? 1760 : 1320, 0.01, 0.004, 0.6, 0.22);
    this.tone(e, t + 0.07, 'sine', headshot ? 2640 : 1980, headshot ? 2640 : 1980, 0.01, 0.004, 0.18, 0.2);
  }

  // ================================================================== bomb

  c4Beep(pos: SoundPos, urgency: number): void {
    const e = this.emit(pos, 0.9, 0.2, 90);
    if (!e) return;
    const t = e.t;
    const g = this.env(t, 0.003, 0.5, 0.09, 'lin');
    const o = this.ctx!.createOscillator();
    o.type = 'square';
    o.frequency.value = 1950 + urgency * 300;
    const f = this.filter('bandpass', 2100, 3);
    o.connect(f);
    f.connect(g);
    g.connect(e.input);
    o.start(t);
    o.stop(t + 0.12);
  }

  /** Keypad presses while arming; returns a cancel handle. */
  plantSequence(pos: SoundPos | null, duration: number): void {
    this.stopLoop('plant');
    const e = this.emit(pos, pos ? 0.8 : 0.5, 0.05, 40);
    if (!e) return;
    const t = e.t;
    const keys = [697, 770, 852, 941];
    const cols = [1209, 1336, 1477];
    const n = 7;
    for (let i = 0; i < n; i++) {
      const tt = t + 0.25 + (i * (duration - 0.6)) / n;
      const f1 = keys[Math.floor(Math.random() * keys.length)];
      const f2 = cols[Math.floor(Math.random() * cols.length)];
      this.tone(e, tt, 'sine', f1, f1, 0.01, 0.003, 0.28, 0.1);
      this.tone(e, tt, 'sine', f2, f2, 0.01, 0.003, 0.28, 0.1);
      this.filteredNoise(e, tt - 0.02, 'bandpass', 2500, 5, 0.001, 0.3, 0.02);
    }
    this.loops.set('plant', { stop: () => e.input.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.01) });
  }

  bombPlanted(pos: SoundPos | null): void {
    this.stopLoop('plant');
    const e = this.emit(pos, 0.7, 0.2, 120);
    if (!e) return;
    const t = e.t;
    this.tone(e, t, 'square', 1200, 1200, 0.01, 0.005, 0.25, 0.12);
    this.tone(e, t + 0.15, 'square', 1600, 1600, 0.01, 0.005, 0.25, 0.12);
    this.tone(e, t + 0.3, 'square', 2000, 2000, 0.01, 0.005, 0.25, 0.25);
  }

  defuseLoop(pos: SoundPos | null, duration: number): void {
    this.stopLoop('defuse');
    const e = this.emit(pos, pos ? 0.8 : 0.5, 0.05, 40);
    if (!e) return;
    const t = e.t;
    const n = Math.floor(duration / 0.3);
    for (let i = 0; i < n; i++) {
      const tt = t + 0.1 + i * 0.3 + Math.random() * 0.05;
      this.filteredNoise(e, tt, 'bandpass', 1800 + Math.random() * 1500, 6, 0.001, 0.5, 0.03);
      if (i % 4 === 0) this.filteredNoise(e, tt + 0.1, 'highpass', 4000, 0.7, 0.01, 0.15, 0.08);
    }
    this.loops.set('defuse', { stop: () => e.input.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.01) });
  }

  stopLoop(id: string): void {
    const l = this.loops.get(id);
    if (l) {
      l.stop();
      this.loops.delete(id);
    }
  }

  bombDefused(): void {
    this.stopLoop('defuse');
    const e = this.emit(null, 0.45, 0.2);
    if (!e) return;
    const t = e.t;
    [880, 1109, 1319, 1760].forEach((f, i) => this.tone(e, t + i * 0.08, 'triangle', f, f, 0.01, 0.005, 0.5, 0.25));
  }

  explosion(pos: SoundPos): void {
    const e = this.emit(pos, 3.2, 1.2, 600);
    if (!e) return;
    const t = e.t;
    const g = this.env(t, 0.005, 1.4, 2.6);
    const f = this.filter('lowpass', 4000, 0.8);
    f.frequency.setValueAtTime(4500, t);
    f.frequency.exponentialRampToValueAtTime(160, t + 1.8);
    this.noise(f, t, 2.8);
    f.connect(g);
    g.connect(e.input);
    this.tone(e, t, 'sine', 70, 24, 0.9, 0.004, 1.6, 1.4);
    this.filteredNoise(e, t + 0.05, 'lowpass', 140, 0.8, 0.1, 1.2, 3.5, true);
    this.filteredNoise(e, t, 'bandpass', 2400, 0.8, 0.001, 0.8, 0.12);
  }

  // ================================================================== misc

  pickup(): void {
    const e = this.emit(null, 0.4, 0);
    if (!e) return;
    this.filteredNoise(e, e.t, 'bandpass', 1600, 4, 0.002, 0.7, 0.04);
    this.filteredNoise(e, e.t + 0.07, 'bandpass', 2400, 5, 0.002, 0.5, 0.03);
  }

  roundJingle(win: boolean): void {
    const e = this.emit(null, 0.22, 0.4);
    if (!e) return;
    const t = e.t;
    const notes = win ? [523, 659, 784, 1047] : [659, 523, 440, 330];
    notes.forEach((f, i) => {
      this.tone(e, t + i * 0.14, 'triangle', f, f, 0.01, 0.01, 0.6, 0.35);
      this.tone(e, t + i * 0.14, 'sine', f / 2, f / 2, 0.01, 0.01, 0.3, 0.4);
    });
  }

  uiClick(): void {
    const e = this.emit(null, 0.25, 0);
    if (!e) return;
    this.tone(e, e.t, 'sine', 1500, 1200, 0.03, 0.001, 0.4, 0.04);
  }

  dispose(): void {
    void this.ctx?.close();
    this.ctx = null;
  }
}

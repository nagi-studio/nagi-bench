// Procedural sound synthesis with the Web Audio API — no audio files.
// Spatialised through PannerNodes positioned in world space.
import type { V3 } from '../core/math.ts';
import type { SoundProfile } from '../core/weapons.ts';

interface GunVoice {
  noiseFreq: number; // lowpass cutoff of the body
  noiseDecay: number;
  noiseGain: number;
  thumpFreq: number;
  thumpDecay: number;
  thumpGain: number;
  crack: number; // high-frequency crack gain
  tail: number; // long low tail gain
  tailDecay: number;
  hp: number; // highpass to thin out small guns
}

const GUNS: Record<Exclude<SoundProfile, 'knife'>, GunVoice> = {
  ak: { noiseFreq: 2600, noiseDecay: 0.17, noiseGain: 1.0, thumpFreq: 95, thumpDecay: 0.14, thumpGain: 0.9, crack: 0.45, tail: 0.3, tailDecay: 0.45, hp: 60 },
  m4: { noiseFreq: 3800, noiseDecay: 0.11, noiseGain: 0.75, thumpFreq: 130, thumpDecay: 0.09, thumpGain: 0.55, crack: 0.5, tail: 0.15, tailDecay: 0.3, hp: 120 },
  awp: { noiseFreq: 1800, noiseDecay: 0.35, noiseGain: 1.2, thumpFreq: 55, thumpDecay: 0.3, thumpGain: 1.2, crack: 0.8, tail: 0.6, tailDecay: 1.4, hp: 30 },
  glock: { noiseFreq: 4500, noiseDecay: 0.07, noiseGain: 0.6, thumpFreq: 180, thumpDecay: 0.05, thumpGain: 0.35, crack: 0.35, tail: 0.05, tailDecay: 0.2, hp: 400 },
  usp: { noiseFreq: 1400, noiseDecay: 0.06, noiseGain: 0.35, thumpFreq: 160, thumpDecay: 0.05, thumpGain: 0.25, crack: 0.06, tail: 0.0, tailDecay: 0.1, hp: 300 },
  deagle: { noiseFreq: 2200, noiseDecay: 0.2, noiseGain: 1.1, thumpFreq: 80, thumpDecay: 0.16, thumpGain: 1.0, crack: 0.6, tail: 0.35, tailDecay: 0.6, hp: 50 },
};

export class AudioEngine {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private noiseBuf!: AudioBuffer;
  private volume: number;

  constructor(volume = 0.7) {
    this.volume = volume;
  }

  /** Must be called from a user gesture (autoplay policy). */
  unlock() {
    if (!this.ctx) {
      const Ctor: typeof AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -12;
      comp.ratio.value = 4;
      this.master.connect(comp).connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 2;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.ctx) this.master.gain.value = v;
  }

  dispose() {
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
  }

  setListener(pos: V3, fwd: V3) {
    const ctx = this.ctx;
    if (!ctx) return;
    const l = ctx.listener;
    if (l.positionX) {
      const t = ctx.currentTime;
      l.positionX.setValueAtTime(pos.x, t);
      l.positionY.setValueAtTime(pos.y, t);
      l.positionZ.setValueAtTime(pos.z, t);
      l.forwardX.setValueAtTime(fwd.x, t);
      l.forwardY.setValueAtTime(fwd.y, t);
      l.forwardZ.setValueAtTime(fwd.z, t);
      l.upX.setValueAtTime(0, t);
      l.upY.setValueAtTime(1, t);
      l.upZ.setValueAtTime(0, t);
    } else {
      // Firefox / older API
      (l as unknown as { setPosition: (x: number, y: number, z: number) => void }).setPosition(pos.x, pos.y, pos.z);
      (l as unknown as { setOrientation: (a: number, b: number, c: number, d: number, e: number, f: number) => void }).setOrientation(fwd.x, fwd.y, fwd.z, 0, 1, 0);
    }
  }

  /** Output node: spatial panner if a position is given, else straight to master. */
  private out(pos: V3 | null, gain = 1, refDistance = 4): AudioNode | null {
    const ctx = this.ctx;
    if (!ctx) return null;
    const g = ctx.createGain();
    g.gain.value = gain;
    if (pos) {
      const p = ctx.createPanner();
      p.panningModel = 'HRTF';
      p.distanceModel = 'inverse';
      p.refDistance = refDistance;
      p.rolloffFactor = 1.1;
      p.maxDistance = 200;
      if (p.positionX) {
        p.positionX.value = pos.x;
        p.positionY.value = pos.y;
        p.positionZ.value = pos.z;
      } else (p as unknown as { setPosition: (x: number, y: number, z: number) => void }).setPosition(pos.x, pos.y, pos.z);
      g.connect(p).connect(this.master);
    } else g.connect(this.master);
    return g;
  }

  private noise(dest: AudioNode, t: number, dur: number, type: BiquadFilterType, freq: number, q: number, gain: number, attack = 0.002, rate = 1) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    src.playbackRate.value = rate;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(dest);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.05);
    return f;
  }

  private tone(dest: AudioNode, t: number, dur: number, type: OscillatorType, f0: number, f1: number, gain: number, attack = 0.003) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // ------------------------------------------------------------------ sounds

  gunshot(profile: SoundProfile, pos: V3 | null, own: boolean) {
    if (!this.ctx) return;
    if (profile === 'knife') return this.knifeSwish(pos, false);
    const v = GUNS[profile];
    const out = this.out(own ? null : pos, own ? 0.55 : 1.4, profile === 'usp' ? 2 : 6);
    if (!out) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = v.hp;
    hp.connect(out);
    const jitter = 0.94 + Math.random() * 0.12;
    this.noise(hp, t, v.noiseDecay, 'lowpass', v.noiseFreq * jitter, 0.8, v.noiseGain, 0.001);
    this.tone(hp, t, v.thumpDecay, 'sine', v.thumpFreq * 1.8 * jitter, v.thumpFreq * 0.5, v.thumpGain, 0.001);
    if (v.crack > 0) this.noise(hp, t, 0.03, 'highpass', 5000, 0.7, v.crack, 0.0005);
    if (v.tail > 0) this.noise(hp, t + 0.02, v.tailDecay, 'lowpass', 600, 0.5, v.tail, 0.02);
    if (profile === 'awp') {
      // bolt cycle
      this.click(out, t + 0.75, 0.6);
      this.click(out, t + 0.95, 0.5);
    }
  }

  private click(dest: AudioNode, t: number, gain: number) {
    this.noise(dest, t, 0.035, 'bandpass', 3200 + Math.random() * 800, 2, gain, 0.001);
    this.tone(dest, t, 0.025, 'square', 1500 + Math.random() * 300, 900, gain * 0.15, 0.001);
  }

  reload(pos: V3 | null, own: boolean, duration: number) {
    const out = this.out(own ? null : pos, own ? 0.6 : 0.8, 2);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.click(out, t + 0.12, 0.6); // mag release
    this.noise(out, t + 0.2, 0.12, 'bandpass', 900, 1.5, 0.3, 0.01); // mag slide out
    this.click(out, t + duration * 0.55, 0.8); // mag in
    this.click(out, t + duration * 0.58, 0.4);
    this.click(out, t + duration * 0.85, 0.7); // bolt / slide
    this.tone(out, t + duration * 0.86, 0.06, 'triangle', 700, 400, 0.12);
  }

  dryFire(own: boolean) {
    const out = this.out(null, own ? 0.5 : 0.2);
    if (!out || !this.ctx) return;
    this.click(out, this.ctx.currentTime, 0.6);
  }

  switchWeapon() {
    const out = this.out(null, 0.35);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.noise(out, t, 0.12, 'bandpass', 1800, 1.2, 0.4, 0.02);
    this.click(out, t + 0.1, 0.4);
  }

  footstep(pos: V3 | null, own: boolean, loud: number) {
    const out = this.out(own ? null : pos, (own ? 0.35 : 1.0) * loud, 3);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.noise(out, t, 0.09, 'lowpass', 500 + Math.random() * 300, 1, 0.9, 0.004);
    this.noise(out, t + 0.015, 0.05, 'bandpass', 2400 + Math.random() * 800, 1.5, 0.18, 0.002); // grit
  }

  land(pos: V3 | null, own: boolean) {
    const out = this.out(own ? null : pos, own ? 0.5 : 1, 3);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.noise(out, t, 0.14, 'lowpass', 350, 1, 1, 0.003);
    this.tone(out, t, 0.1, 'sine', 120, 60, 0.4);
  }

  scope(level: number) {
    const out = this.out(null, 0.5);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.click(out, t, 0.5);
    if (level > 0) this.tone(out, t + 0.01, 0.09, 'sine', 500 + level * 300, 1200 + level * 300, 0.12);
    else this.tone(out, t + 0.01, 0.07, 'sine', 900, 400, 0.08);
  }

  knifeSwish(pos: V3 | null, hit: boolean) {
    const out = this.out(pos, 0.6, 2);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    const f = this.noise(out, t, 0.18, 'bandpass', 1200, 3, 0.6, 0.04);
    f.frequency.exponentialRampToValueAtTime(4500, t + 0.15);
    if (hit) {
      this.noise(out, t + 0.06, 0.1, 'lowpass', 700, 1, 0.9, 0.002);
      this.tone(out, t + 0.06, 0.08, 'sine', 180, 80, 0.5);
    }
  }

  hitMarker(headshot: boolean) {
    const out = this.out(null, 0.5);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    if (headshot) {
      // metallic "dink"
      this.tone(out, t, 0.25, 'sine', 2600, 2500, 0.35, 0.001);
      this.tone(out, t, 0.18, 'sine', 3900, 3800, 0.2, 0.001);
      this.noise(out, t, 0.04, 'highpass', 6000, 1, 0.4, 0.001);
    } else {
      this.tone(out, t, 0.05, 'triangle', 1500, 1200, 0.3, 0.001);
      this.noise(out, t, 0.04, 'lowpass', 900, 1, 0.3, 0.001);
    }
  }

  hurt() {
    const out = this.out(null, 0.6);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.noise(out, t, 0.12, 'lowpass', 500, 1, 0.8, 0.002);
    this.tone(out, t, 0.12, 'sine', 140, 70, 0.5);
  }

  killConfirm(headshot: boolean) {
    const out = this.out(null, 0.45);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.tone(out, t, 0.14, 'sine', 880, 880, 0.35);
    this.tone(out, t + 0.09, 0.22, 'sine', headshot ? 1760 : 1320, headshot ? 1760 : 1320, 0.35);
    this.tone(out, t + 0.09, 0.22, 'triangle', headshot ? 2200 : 1650, headshot ? 2200 : 1650, 0.1);
  }

  bombBeep(pos: V3, urgency: number) {
    const out = this.out(pos, 0.7 + urgency * 0.5, 6);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.tone(out, t, 0.09, 'sine', 1980, 1980, 0.5, 0.002);
    this.tone(out, t, 0.09, 'square', 3960, 3960, 0.04, 0.002);
  }

  plantTyping(pos: V3 | null) {
    const out = this.out(pos, 0.6, 3);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [1180, 1320, 990, 1480, 1110, 1250, 1400];
    notes.forEach((f, i) => this.tone(out, t + i * 0.32 + 0.1, 0.07, 'square', f, f, 0.08, 0.002));
  }

  planted() {
    const out = this.out(null, 0.6);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    [660, 660, 880].forEach((f, i) => this.tone(out, t + i * 0.18, 0.16, 'sawtooth', f, f, 0.12));
  }

  defuseStart(pos: V3 | null) {
    const out = this.out(pos, 0.7, 3);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 8; i++) this.click(out, t + i * 0.55 + Math.random() * 0.1, 0.5);
    this.noise(out, t + 0.1, 0.4, 'bandpass', 1500, 1, 0.25, 0.05); // tool rustle
  }

  defused() {
    const out = this.out(null, 0.6);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => this.tone(out, t + i * 0.1, 0.25, 'triangle', f, f, 0.25));
  }

  explosion(pos: V3, dist: number) {
    const out = this.out(null, Math.max(0.35, 1.6 - dist / 60));
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    const f = this.noise(out, t, 2.8, 'lowpass', 4000, 0.7, 1.4, 0.005);
    f.frequency.exponentialRampToValueAtTime(120, t + 2.2);
    this.tone(out, t, 1.4, 'sine', 70, 28, 1.3, 0.005);
    this.noise(out, t + 0.05, 3.5, 'lowpass', 300, 0.5, 0.6, 0.3); // rumble
    void pos;
  }

  roundStart() {
    const out = this.out(null, 0.35);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    [392, 523].forEach((f, i) => this.tone(out, t + i * 0.15, 0.2, 'triangle', f, f, 0.3));
  }

  roundEnd(win: boolean) {
    const out = this.out(null, 0.4);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    const seq = win ? [523, 659, 784, 1047] : [440, 392, 330, 262];
    seq.forEach((f, i) => this.tone(out, t + i * 0.16, 0.3, 'triangle', f, f, 0.28));
  }

  bombPickup() {
    const out = this.out(null, 0.4);
    if (!out || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.tone(out, t, 0.08, 'square', 880, 880, 0.12);
    this.tone(out, t + 0.09, 0.1, 'square', 1175, 1175, 0.12);
  }
}

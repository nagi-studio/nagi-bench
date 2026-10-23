// Fully procedural sound via Web Audio: filtered noise bursts + oscillators with
// envelopes, HRTF spatialization, distance/occlusion low-pass. No audio files.

import type { SoundProfile } from '../weapons/WeaponDefs';
import type { V3Like } from '../math';

interface FilterSpec {
  type: BiquadFilterType;
  freq: number;
  freqEnd?: number;
  q?: number;
}

interface ShotRecipe {
  crack: [number, number, number]; // highpass freq, duration, gain
  body: [number, number, number, number]; // bandpass freq, Q, decay, gain
  thump: [number, number, number, number]; // f0, f1, dur, gain
  tail: [number, number, number]; // lowpass freq, decay, gain
  range: number; // reference distance (bigger = carries further)
  echo?: number;
}

const SHOTS: Record<Exclude<SoundProfile, 'knife'>, ShotRecipe> = {
  ak: { crack: [2500, 0.03, 0.55], body: [700, 0.8, 0.22, 1.0], thump: [125, 45, 0.12, 0.9], tail: [900, 0.5, 0.25], range: 9 },
  m4: { crack: [3200, 0.022, 0.45], body: [1150, 1.0, 0.14, 0.75], thump: [155, 60, 0.085, 0.55], tail: [1400, 0.35, 0.16], range: 8 },
  awp: { crack: [1900, 0.05, 0.9], body: [480, 0.7, 0.38, 1.25], thump: [80, 28, 0.38, 1.25], tail: [600, 1.3, 0.45], range: 14, echo: 0.28 },
  glock: { crack: [3600, 0.018, 0.4], body: [1700, 1.2, 0.08, 0.6], thump: [210, 90, 0.05, 0.4], tail: [1900, 0.2, 0.1], range: 6 },
  usp: { crack: [4500, 0.01, 0.12], body: [900, 0.9, 0.06, 0.38], thump: [180, 80, 0.04, 0.28], tail: [800, 0.08, 0.05], range: 2.5 },
  deagle: { crack: [2200, 0.04, 0.7], body: [640, 0.8, 0.3, 1.1], thump: [92, 38, 0.18, 1.0], tail: [800, 0.6, 0.3], range: 10 },
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private noiseBuf!: AudioBuffer;
  private listenerPos = { x: 0, y: 0, z: 0 };
  enabled = true;
  volume = 0.7;

  get ready(): boolean {
    return !!this.ctx && this.ctx.state === 'running';
  }

  /** Must be called from a user gesture. */
  unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 10;
      comp.ratio.value = 5;
      comp.attack.value = 0.003;
      comp.release.value = 0.15;
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 2;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  dispose() {
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.ctx) this.master.gain.value = v;
  }

  setListener(pos: V3Like, fwd: V3Like) {
    this.listenerPos = { x: pos.x, y: pos.y, z: pos.z };
    const ctx = this.ctx;
    if (!ctx) return;
    const L = ctx.listener;
    if (L.positionX) {
      const t = ctx.currentTime;
      L.positionX.setValueAtTime(pos.x, t);
      L.positionY.setValueAtTime(pos.y, t);
      L.positionZ.setValueAtTime(pos.z, t);
      L.forwardX.setValueAtTime(fwd.x, t);
      L.forwardY.setValueAtTime(fwd.y, t);
      L.forwardZ.setValueAtTime(fwd.z, t);
      L.upX.setValueAtTime(0, t);
      L.upY.setValueAtTime(1, t);
      L.upZ.setValueAtTime(0, t);
    } else {
      L.setPosition(pos.x, pos.y, pos.z);
      L.setOrientation(fwd.x, fwd.y, fwd.z, 0, 1, 0);
    }
  }

  /** Destination node for a sound: direct (UI / own) or spatialized with distance muffling. */
  private out(pos: V3Like | null, refDist = 4, occluded = false): AudioNode | null {
    const ctx = this.ctx;
    if (!ctx || !this.enabled || ctx.state !== 'running') return null;
    if (!pos) return this.master;
    const dx = pos.x - this.listenerPos.x, dy = pos.y - this.listenerPos.y, dz = pos.z - this.listenerPos.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist > 160) return null;
    const p = ctx.createPanner();
    p.panningModel = 'HRTF';
    p.distanceModel = 'inverse';
    p.refDistance = refDist;
    p.rolloffFactor = 1.1;
    p.maxDistance = 400;
    if (p.positionX) {
      p.positionX.value = pos.x;
      p.positionY.value = pos.y;
      p.positionZ.value = pos.z;
    } else p.setPosition(pos.x, pos.y, pos.z);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    const muffle = Math.max(0, 1 - dist / 90) * (occluded ? 0.25 : 1);
    lp.frequency.value = 500 + 19000 * muffle * muffle;
    lp.connect(p);
    p.connect(this.master);
    return lp;
  }

  private noise(dest: AudioNode, t: number, dur: number, f: FilterSpec, gain: number, attack = 0.002) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    src.playbackRate.value = 0.9 + Math.random() * 0.2;
    const filt = ctx.createBiquadFilter();
    filt.type = f.type;
    filt.frequency.setValueAtTime(f.freq, t);
    if (f.freqEnd) filt.frequency.exponentialRampToValueAtTime(f.freqEnd, t + dur);
    filt.Q.value = f.q ?? 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + dur);
    src.connect(filt);
    filt.connect(g);
    g.connect(dest);
    src.start(t, Math.random() * 1.5);
    src.stop(t + attack + dur + 0.05);
  }

  private tone(dest: AudioNode, t: number, f0: number, f1: number, dur: number, type: OscillatorType, gain: number, attack = 0.002) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t);
    o.stop(t + attack + dur + 0.05);
  }

  shot(kind: SoundProfile, pos: V3Like | null, occluded = false) {
    if (kind === 'knife') return this.knife(pos, false);
    const r = SHOTS[kind];
    const dest = this.out(pos, r.range, occluded);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    const v = pos ? 1 : 0.75;
    this.noise(dest, t, r.crack[1], { type: 'highpass', freq: r.crack[0] }, r.crack[2] * v);
    this.noise(dest, t, r.body[2], { type: 'bandpass', freq: r.body[0] * (0.95 + Math.random() * 0.1), q: r.body[1] }, r.body[3] * v);
    this.tone(dest, t, r.thump[0], r.thump[1], r.thump[2], 'sine', r.thump[3] * v);
    this.noise(dest, t + 0.01, r.tail[1], { type: 'lowpass', freq: r.tail[0] }, r.tail[2] * v, 0.01);
    if (r.echo) this.noise(dest, t + r.echo, r.tail[1] * 0.8, { type: 'lowpass', freq: r.tail[0] * 0.7 }, r.tail[2] * 0.45 * v, 0.02);
  }

  knife(pos: V3Like | null, hit: boolean) {
    const dest = this.out(pos, 2);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.noise(dest, t, 0.16, { type: 'bandpass', freq: 700, freqEnd: 3800, q: 2.5 }, 0.35, 0.03);
    if (hit) this.noise(dest, t + 0.05, 0.08, { type: 'lowpass', freq: 600 }, 0.6);
  }

  reload(kind: SoundProfile, duration: number) {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    const click = (at: number, f: number, g: number) => {
      this.noise(dest, t + at, 0.035, { type: 'bandpass', freq: f, q: 5 }, g);
      this.tone(dest, t + at, f * 0.4, f * 0.3, 0.025, 'square', g * 0.15);
    };
    if (kind === 'awp') {
      click(duration * 0.2, 2200, 0.35);
      click(duration * 0.6, 1600, 0.45);
      click(duration * 0.64, 2400, 0.3);
      click(duration * 0.82, 3000, 0.35);
      click(duration * 0.88, 2000, 0.35);
      return;
    }
    click(duration * 0.18, 2400, 0.35); // mag release
    this.noise(dest, t + duration * 0.25, 0.12, { type: 'bandpass', freq: 900, q: 1.2 }, 0.12, 0.02); // mag slide out
    click(duration * 0.62, 1700, 0.5); // mag in
    click(duration * 0.66, 2600, 0.3);
    click(duration * 0.84, 3200, 0.4); // bolt / slide
    click(duration * 0.88, 2100, 0.4);
  }

  boltCycle(delay: number) {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime + delay;
    this.noise(dest, t, 0.04, { type: 'bandpass', freq: 2600, q: 4 }, 0.3);
    this.noise(dest, t + 0.18, 0.04, { type: 'bandpass', freq: 1900, q: 4 }, 0.35);
  }

  draw() {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.noise(dest, t, 0.05, { type: 'bandpass', freq: 3000, q: 3 }, 0.18);
  }

  footstep(pos: V3Like | null, loud: number, occluded = false) {
    const dest = this.out(pos, 2.2, occluded);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    const v = loud * (pos ? 1.1 : 0.35);
    this.noise(dest, t, 0.07, { type: 'lowpass', freq: 320 + Math.random() * 160 }, 0.9 * v);
    this.noise(dest, t + 0.01, 0.04, { type: 'highpass', freq: 3500 }, 0.12 * v);
  }

  land(pos: V3Like | null) {
    const dest = this.out(pos, 2.2);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.noise(dest, t, 0.1, { type: 'lowpass', freq: 260 }, pos ? 0.8 : 0.35);
  }

  scope() {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.noise(dest, t, 0.03, { type: 'highpass', freq: 4000 }, 0.25);
    this.tone(dest, t + 0.005, 1700, 2600, 0.06, 'triangle', 0.12);
  }

  empty() {
    const dest = this.out(null);
    if (!dest) return;
    this.noise(dest, this.ctx!.currentTime, 0.015, { type: 'highpass', freq: 5000 }, 0.3);
  }

  hit(head: boolean, armored: boolean) {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    if (head) {
      // helmet "dink"
      this.tone(dest, t, 3100, 3000, 0.28, 'sine', armored ? 0.3 : 0.18);
      this.tone(dest, t, 4700, 4500, 0.2, 'sine', armored ? 0.18 : 0.1);
      this.noise(dest, t, 0.03, { type: 'highpass', freq: 6000 }, 0.2);
    } else {
      this.tone(dest, t, 1500, 1300, 0.045, 'triangle', 0.22);
      this.noise(dest, t, 0.04, { type: 'lowpass', freq: 700 }, 0.25);
    }
  }

  kill(headshot: boolean) {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime + 0.04;
    this.tone(dest, t, 880, 880, 0.16, 'sine', 0.22);
    this.tone(dest, t + 0.08, headshot ? 1760 : 1320, headshot ? 1760 : 1320, 0.22, 'sine', 0.22);
  }

  hurt() {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.noise(dest, t, 0.09, { type: 'lowpass', freq: 220 }, 0.8);
    this.tone(dest, t, 260, 120, 0.12, 'sine', 0.35);
  }

  c4Beep(pos: V3Like | null) {
    const dest = this.out(pos, 6);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.tone(dest, t, 2650, 2650, 0.075, 'square', 0.12);
  }

  c4Key() {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.tone(dest, t, 1250 + Math.random() * 400, 1200, 0.05, 'square', 0.08);
  }

  c4Planted() {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    [660, 880, 990].forEach((f, i) => this.tone(dest, t + i * 0.12, f, f, 0.18, 'triangle', 0.25));
  }

  defuseTick(pos: V3Like | null) {
    const dest = this.out(pos, 3);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.noise(dest, t, 0.03, { type: 'bandpass', freq: 2800, q: 6 }, 0.35);
  }

  defused() {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    [523, 659, 784, 1046].forEach((f, i) => this.tone(dest, t + i * 0.09, f, f, 0.3, 'triangle', 0.22));
  }

  explosion(pos: V3Like | null) {
    const ctx = this.ctx;
    const dest = this.out(pos, 40);
    if (!ctx || !dest) return;
    const t = ctx.currentTime;
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const x = (i / 1023) * 2 - 1;
      curve[i] = Math.tanh(x * 3);
    }
    shaper.curve = curve;
    shaper.connect(dest);
    this.noise(shaper, t, 0.12, { type: 'highpass', freq: 1500 }, 1.0);
    this.noise(shaper, t, 2.6, { type: 'lowpass', freq: 500, freqEnd: 60 }, 2.2, 0.01);
    this.tone(shaper, t, 60, 22, 1.6, 'sine', 1.8);
    this.noise(dest, t + 0.3, 3, { type: 'lowpass', freq: 250 }, 0.5, 0.2);
  }

  roundEnd(win: boolean) {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime + 0.1;
    const notes = win ? [392, 494, 587, 784] : [330, 392, 466, 311];
    notes.forEach((f, i) => this.tone(dest, t + i * 0.14, f, f, 0.6, 'triangle', 0.16, 0.02));
  }

  roundStart() {
    const dest = this.out(null);
    if (!dest) return;
    const t = this.ctx!.currentTime;
    this.tone(dest, t, 440, 440, 0.12, 'square', 0.06);
    this.tone(dest, t + 0.15, 660, 660, 0.18, 'square', 0.06);
  }

  uiClick() {
    const dest = this.out(null);
    if (!dest) return;
    this.tone(dest, this.ctx!.currentTime, 1200, 900, 0.04, 'triangle', 0.1);
  }
}

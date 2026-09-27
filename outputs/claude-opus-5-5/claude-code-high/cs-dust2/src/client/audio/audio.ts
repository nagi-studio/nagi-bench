// Procedural sound: every sound is synthesised with Web Audio (noise buffers, oscillators,
// filters, envelopes) and spatialised against the listener (distance, stereo pan, occlusion).
import type { Vec3 } from '../../core/math.ts';
import type { SoundProfile, WeaponId } from '../../core/weapons.ts';

interface ShotRecipe {
  crackF: number;
  crackQ: number;
  crackDecay: number;
  crackGain: number;
  bodyF0: number;
  bodyF1: number;
  bodyDecay: number;
  bodyGain: number;
  bodyType: OscillatorType;
  tailF: number;
  tailDecay: number;
  tailGain: number;
  mech?: boolean;
  radius: number;
}

const SHOTS: Record<Exclude<SoundProfile, 'knife' | 'none'>, ShotRecipe> = {
  ak: { crackF: 1700, crackQ: 0.8, crackDecay: 0.1, crackGain: 1.1, bodyF0: 170, bodyF1: 50, bodyDecay: 0.17, bodyGain: 0.95, bodyType: 'triangle', tailF: 900, tailDecay: 0.5, tailGain: 0.4, radius: 140 },
  m4: { crackF: 2600, crackQ: 1.0, crackDecay: 0.065, crackGain: 0.85, bodyF0: 210, bodyF1: 75, bodyDecay: 0.1, bodyGain: 0.7, bodyType: 'triangle', tailF: 1400, tailDecay: 0.32, tailGain: 0.28, radius: 130 },
  awp: { crackF: 1300, crackQ: 0.6, crackDecay: 0.18, crackGain: 1.4, bodyF0: 120, bodyF1: 32, bodyDecay: 0.4, bodyGain: 1.3, bodyType: 'sawtooth', tailF: 650, tailDecay: 1.3, tailGain: 0.6, radius: 200 },
  glock: { crackF: 3300, crackQ: 1.3, crackDecay: 0.05, crackGain: 0.65, bodyF0: 320, bodyF1: 120, bodyDecay: 0.06, bodyGain: 0.5, bodyType: 'triangle', tailF: 1900, tailDecay: 0.22, tailGain: 0.16, radius: 90 },
  usp: { crackF: 1100, crackQ: 2.2, crackDecay: 0.035, crackGain: 0.35, bodyF0: 190, bodyF1: 95, bodyDecay: 0.05, bodyGain: 0.3, bodyType: 'sine', tailF: 700, tailDecay: 0.06, tailGain: 0.05, mech: true, radius: 30 },
  deagle: { crackF: 1500, crackQ: 0.7, crackDecay: 0.13, crackGain: 1.2, bodyF0: 130, bodyF1: 40, bodyDecay: 0.26, bodyGain: 1.15, bodyType: 'sawtooth', tailF: 800, tailDecay: 0.65, tailGain: 0.42, radius: 140 },
};

export interface ListenerState {
  x: number;
  y: number;
  z: number;
  yaw: number;
}

type Occlusion = (p: Vec3) => boolean;

export class AudioEngine {
  readonly ctx: AudioContext;
  private master: GainNode;
  private sfx: GainNode;
  private reverb: ConvolverNode;
  private reverbIn: GainNode;
  private noise: AudioBuffer;
  private listener: ListenerState = { x: 0, y: 0, z: 0, yaw: 0 };
  private scheduled: { id: string; nodes: AudioScheduledSourceNode[] }[] = [];
  occluded: Occlusion = () => false;

  constructor() {
    const AC: typeof AudioContext = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    const ctx = this.ctx;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 12;
    comp.ratio.value = 5;
    comp.attack.value = 0.002;
    comp.release.value = 0.2;
    this.master = ctx.createGain();
    this.master.gain.value = 0.7;
    this.sfx = ctx.createGain();
    this.sfx.connect(comp);
    comp.connect(this.master);
    this.master.connect(ctx.destination);
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.makeImpulse(2.2, 2.8);
    this.reverbIn = ctx.createGain();
    this.reverbIn.gain.value = 0.35;
    this.reverbIn.connect(this.reverb);
    this.reverb.connect(comp);
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  resume() {
    if (this.ctx.state !== 'running') void this.ctx.resume();
  }

  setVolume(v: number) {
    this.master.gain.value = v;
  }

  setListener(l: ListenerState) {
    this.listener = l;
  }

  private makeImpulse(seconds: number, decay: number): AudioBuffer {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        // sparse early reflections followed by a diffuse tail
        const early = i < rate * 0.08 && Math.random() < 0.004 ? (Math.random() * 2 - 1) * 0.9 : 0;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay) * 0.5 + early;
      }
    }
    return buf;
  }

  // ------------------------------------------------------------------ routing
  /**
   * Returns an input node for a sound at world position `pos` (undefined = 2D/UI sound).
   * Applies distance attenuation, stereo panning, air/occlusion low-pass and a reverb send.
   */
  private route(pos: Vec3 | undefined, gain: number, radius = 60, reverbAmt = 0.25): AudioNode | null {
    const ctx = this.ctx;
    const g = ctx.createGain();
    let dist = 0;
    if (pos) {
      const L = this.listener;
      const dx = pos.x - L.x;
      const dy = pos.y - L.y;
      const dz = pos.z - L.z;
      dist = Math.hypot(dx, dy, dz);
      if (dist > radius) return null;
      const att = Math.pow(1 - dist / radius, 1.6) / (1 + dist * 0.06);
      const occ = dist > 2 && this.occluded(pos);
      g.gain.value = gain * att * (occ ? 0.55 : 1);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = Math.max(700, 18000 * Math.exp(-dist / 35)) * (occ ? 0.25 : 1);
      const pan = ctx.createStereoPanner();
      const rx = Math.cos(L.yaw);
      const rz = -Math.sin(L.yaw);
      const hd = Math.hypot(dx, dz) || 1;
      pan.pan.value = Math.max(-1, Math.min(1, ((dx * rx + dz * rz) / hd) * 0.85));
      g.connect(lp);
      lp.connect(pan);
      pan.connect(this.sfx);
      const send = ctx.createGain();
      send.gain.value = reverbAmt * Math.min(1.5, 0.6 + dist / 30);
      pan.connect(send);
      send.connect(this.reverbIn);
    } else {
      g.gain.value = gain;
      g.connect(this.sfx);
      const send = ctx.createGain();
      send.gain.value = reverbAmt;
      g.connect(send);
      send.connect(this.reverbIn);
    }
    return g;
  }

  private env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  }

  private noiseBurst(
    out: AudioNode,
    t: number,
    type: BiquadFilterType,
    freq: number,
    q: number,
    peak: number,
    decay: number,
    freqEnd?: number,
    attack = 0.002,
  ): AudioScheduledSourceNode {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, t + decay);
    f.Q.value = q;
    const g = ctx.createGain();
    this.env(g, t, peak, attack, decay);
    src.connect(f);
    f.connect(g);
    g.connect(out);
    src.start(t, Math.random() * 1.5);
    src.stop(t + attack + decay + 0.05);
    return src;
  }

  private tone(
    out: AudioNode,
    t: number,
    type: OscillatorType,
    f0: number,
    f1: number,
    peak: number,
    decay: number,
    attack = 0.002,
  ): AudioScheduledSourceNode {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + attack + decay);
    const g = ctx.createGain();
    this.env(g, t, peak, attack, decay);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + attack + decay + 0.05);
    return o;
  }

  private click(out: AudioNode, t: number, gain = 0.3, freq = 3500) {
    this.noiseBurst(out, t, 'highpass', freq, 0.7, gain, 0.018);
    this.tone(out, t, 'square', freq * 0.7, freq * 0.5, gain * 0.25, 0.02);
  }

  private thunk(out: AudioNode, t: number, gain = 0.4) {
    this.tone(out, t, 'sine', 200, 80, gain, 0.07);
    this.noiseBurst(out, t, 'lowpass', 700, 0.5, gain * 0.7, 0.06);
  }

  // ------------------------------------------------------------------ weapons
  shot(profile: SoundProfile, pos: Vec3 | undefined, self: boolean) {
    if (profile === 'none') return;
    if (profile === 'knife') {
      this.knifeSwing(pos);
      return;
    }
    const r = SHOTS[profile];
    const out = this.route(pos, self ? 0.9 : 1.1, r.radius, 0.3);
    if (!out) return;
    const t = this.ctx.currentTime;
    const v = 0.92 + Math.random() * 0.16;
    this.noiseBurst(out, t, 'bandpass', r.crackF * v, r.crackQ, r.crackGain, r.crackDecay);
    this.noiseBurst(out, t, 'highpass', 5000, 0.5, r.crackGain * 0.35, r.crackDecay * 0.5);
    this.tone(out, t, r.bodyType, r.bodyF0 * v, r.bodyF1, r.bodyGain, r.bodyDecay);
    this.noiseBurst(out, t + 0.01, 'lowpass', r.tailF, 0.4, r.tailGain, r.tailDecay, r.tailF * 0.4, 0.01);
    if (r.mech) this.click(out, t + 0.005, 0.25, 4200);
    if (profile === 'awp') {
      // sub boom + bolt cycling afterwards
      this.tone(out, t, 'sine', 70, 28, 1.0, 0.5);
      if (self) {
        this.click(out, t + 0.55, 0.2, 2600);
        this.thunk(out, t + 0.7, 0.2);
        this.click(out, t + 0.9, 0.25, 3200);
      }
    }
    if (self && (profile === 'ak' || profile === 'm4')) this.click(out, t + 0.03, 0.06, 6000);
  }

  empty(pos?: Vec3) {
    const out = this.route(pos, 0.6, 15);
    if (!out) return;
    this.click(out, this.ctx.currentTime, 0.35, 2500);
  }

  reload(weapon: WeaponId, duration: number, pos: Vec3 | undefined) {
    const out = this.route(pos, pos ? 0.6 : 0.55, 22, 0.1);
    if (!out) return;
    const t = this.ctx.currentTime;
    const d = duration;
    const nodes: AudioScheduledSourceNode[] = [];
    const isPistol = weapon === 'glock' || weapon === 'usp' || weapon === 'deagle';
    nodes.push(this.noiseBurst(out, t + d * 0.1, 'bandpass', 1600, 1.2, 0.25, 0.06)); // release
    this.click(out, t + d * 0.12, 0.3, 3000);
    this.thunk(out, t + d * 0.25, 0.35); // mag out
    nodes.push(this.noiseBurst(out, t + d * 0.5, 'bandpass', 900, 1.5, 0.3, 0.1)); // mag slide in
    this.thunk(out, t + d * 0.6, 0.5); // seat
    this.click(out, t + d * 0.62, 0.35, 3400);
    if (isPistol) {
      this.click(out, t + d * 0.85, 0.4, 2800); // slide release
      this.tone(out, t + d * 0.85, 'triangle', 1900, 1500, 0.08, 0.1);
    } else {
      this.click(out, t + d * 0.8, 0.35, 2600); // bolt back
      this.click(out, t + d * 0.88, 0.45, 3200); // bolt forward
      this.tone(out, t + d * 0.88, 'triangle', 1500, 1200, 0.08, 0.15);
    }
    this.scheduled.push({ id: 'reload', nodes });
  }

  switchWeapon(pos?: Vec3) {
    const out = this.route(pos, 0.4, 12);
    if (!out) return;
    const t = this.ctx.currentTime;
    this.noiseBurst(out, t, 'bandpass', 1400, 0.8, 0.25, 0.12);
    this.click(out, t + 0.1, 0.25, 3000);
  }

  scope(level: number) {
    const out = this.route(undefined, 0.5, 0, 0.05)!;
    const t = this.ctx.currentTime;
    this.click(out, t, 0.25, 4500);
    if (level > 0) this.tone(out, t + 0.01, 'sine', 700 + level * 300, 1500 + level * 400, 0.06, 0.12);
    else this.tone(out, t + 0.01, 'sine', 1400, 700, 0.05, 0.1);
  }

  knifeSwing(pos?: Vec3) {
    const out = this.route(pos, 0.5, 15, 0.1);
    if (!out) return;
    this.noiseBurst(out, this.ctx.currentTime, 'bandpass', 500, 2, 0.5, 0.18, 2600, 0.03);
  }

  knifeHit(flesh: boolean, pos?: Vec3) {
    const out = this.route(pos, 0.7, 20);
    if (!out) return;
    const t = this.ctx.currentTime;
    if (flesh) {
      this.tone(out, t, 'sine', 160, 70, 0.6, 0.12);
      this.noiseBurst(out, t, 'highpass', 2500, 0.8, 0.35, 0.12);
    } else {
      this.tone(out, t, 'square', 2400, 1800, 0.15, 0.12);
      this.noiseBurst(out, t, 'bandpass', 3000, 3, 0.35, 0.08);
    }
  }

  // ------------------------------------------------------------------ movement
  footstep(pos: Vec3 | undefined, self: boolean, foot: number) {
    const out = this.route(pos, self ? 0.28 : 0.85, 32, 0.12);
    if (!out) return;
    const t = this.ctx.currentTime;
    const f = 480 + Math.random() * 300 + foot * 60;
    this.noiseBurst(out, t, 'lowpass', f, 0.9, 0.9, 0.075);
    this.tone(out, t, 'sine', 95, 55, 0.5, 0.05);
    this.noiseBurst(out, t + 0.015, 'highpass', 3500, 0.5, 0.12, 0.04); // grit
  }

  land(pos: Vec3 | undefined, impact: number) {
    const out = this.route(pos, Math.min(1, impact / 8), 25);
    if (!out) return;
    const t = this.ctx.currentTime;
    this.noiseBurst(out, t, 'lowpass', 500, 0.8, 0.9, 0.12);
    this.tone(out, t, 'sine', 90, 45, 0.7, 0.1);
  }

  jump(pos?: Vec3) {
    const out = this.route(pos, 0.25, 15);
    if (!out) return;
    this.noiseBurst(out, this.ctx.currentTime, 'bandpass', 900, 1, 0.3, 0.06);
  }

  // ------------------------------------------------------------------ feedback
  hitMarker(headshot: boolean, armor: boolean) {
    const out = this.route(undefined, 0.8, 0, 0.02)!;
    const t = this.ctx.currentTime;
    if (headshot) {
      // metallic "dink"
      this.tone(out, t, 'sine', 2900, 2850, 0.28, 0.35);
      this.tone(out, t, 'sine', 4150, 4100, 0.16, 0.25);
      this.tone(out, t, 'sine', 5400, 5300, 0.08, 0.18);
      this.noiseBurst(out, t, 'highpass', 6000, 0.7, 0.2, 0.02);
    } else {
      this.tone(out, t, 'square', armor ? 1500 : 1100, armor ? 1300 : 900, 0.1, 0.035);
      this.tone(out, t, 'sine', 180, 90, 0.35, 0.07);
    }
  }

  hurt(headshot: boolean) {
    const out = this.route(undefined, 0.8, 0, 0.05)!;
    const t = this.ctx.currentTime;
    this.tone(out, t, 'sine', 110, 50, 0.9, 0.18);
    this.noiseBurst(out, t, 'lowpass', 500, 0.6, 0.7, 0.16);
    if (headshot) this.tone(out, t, 'sine', 3000, 2400, 0.12, 0.6); // ringing
  }

  killConfirm(headshot: boolean) {
    const out = this.route(undefined, 0.55, 0, 0.1)!;
    const t = this.ctx.currentTime;
    this.tone(out, t, 'triangle', 660, 660, 0.25, 0.09);
    this.tone(out, t + 0.08, 'triangle', 990, 990, 0.3, 0.22);
    if (headshot) this.tone(out, t + 0.16, 'triangle', 1320, 1320, 0.25, 0.3);
  }

  death() {
    const out = this.route(undefined, 0.7, 0, 0.3)!;
    const t = this.ctx.currentTime;
    this.tone(out, t, 'sine', 300, 80, 0.5, 0.8);
    this.noiseBurst(out, t, 'lowpass', 400, 0.5, 0.4, 0.5);
  }

  // ------------------------------------------------------------------ bomb
  bombBeep(pos: Vec3) {
    const out = this.route(pos, 0.6, 90, 0.2);
    if (!out) return;
    this.tone(out, this.ctx.currentTime, 'sine', 1950, 1950, 0.5, 0.09, 0.004);
  }

  plantStart(pos: Vec3 | undefined) {
    const out = this.route(pos, 0.5, 25, 0.1);
    if (!out) return;
    const t = this.ctx.currentTime;
    const nodes: AudioScheduledSourceNode[] = [];
    for (let i = 0; i < 7; i++) {
      const tt = t + 0.25 + i * 0.4 + Math.random() * 0.1;
      nodes.push(this.tone(out, tt, 'square', 1200 + Math.floor(Math.random() * 5) * 110, 1200, 0.08, 0.06));
      nodes.push(this.noiseBurst(out, tt, 'highpass', 4000, 0.7, 0.1, 0.015));
    }
    this.scheduled.push({ id: 'plant', nodes });
  }

  cancel(id: string) {
    const t = this.ctx.currentTime;
    this.scheduled = this.scheduled.filter((s) => {
      if (s.id !== id) return true;
      for (const n of s.nodes) {
        try {
          n.stop(t);
        } catch {
          /* already stopped */
        }
      }
      return false;
    });
  }

  planted(pos: Vec3) {
    this.cancel('plant');
    const out = this.route(pos, 0.7, 120, 0.2);
    const ui = this.route(undefined, 0.35, 0, 0.1)!;
    const t = this.ctx.currentTime;
    if (out) {
      this.tone(out, t, 'sine', 1400, 1400, 0.4, 0.1);
      this.tone(out, t + 0.15, 'sine', 1900, 1900, 0.4, 0.14);
    }
    // radio: "bomb has been planted" style alert
    this.noiseBurst(ui, t + 0.3, 'bandpass', 1800, 2, 0.25, 0.12);
    this.tone(ui, t + 0.4, 'square', 740, 740, 0.12, 0.18);
    this.tone(ui, t + 0.62, 'square', 587, 587, 0.12, 0.25);
  }

  defuseTick(pos: Vec3) {
    const out = this.route(pos, 0.45, 25, 0.1);
    if (!out) return;
    const t = this.ctx.currentTime;
    this.click(out, t, 0.3, 2200 + Math.random() * 800);
    this.noiseBurst(out, t + 0.03, 'bandpass', 1200, 2, 0.12, 0.05);
  }

  defused(pos: Vec3) {
    const out = this.route(pos, 0.8, 120, 0.2);
    const ui = this.route(undefined, 0.4, 0, 0.1)!;
    const t = this.ctx.currentTime;
    if (out) {
      this.click(out, t, 0.5, 2000);
      this.tone(out, t + 0.05, 'sine', 1400, 1400, 0.3, 0.1);
      this.tone(out, t + 0.2, 'sine', 1000, 1000, 0.3, 0.1);
      this.tone(out, t + 0.35, 'sine', 700, 700, 0.3, 0.25);
    }
    this.tone(ui, t + 0.5, 'triangle', 523, 523, 0.2, 0.2);
    this.tone(ui, t + 0.65, 'triangle', 784, 784, 0.25, 0.4);
  }

  explosion(pos: Vec3) {
    const out = this.route(pos, 2.2, 400, 0.6);
    if (!out) return;
    const t = this.ctx.currentTime;
    this.noiseBurst(out, t, 'lowpass', 6000, 0.7, 1.6, 2.8, 120, 0.005);
    this.tone(out, t, 'sine', 60, 22, 1.6, 2.0, 0.005);
    this.tone(out, t, 'sawtooth', 110, 30, 0.6, 0.8, 0.005);
    for (let i = 0; i < 14; i++) this.noiseBurst(out, t + 0.05 + Math.random() * 1.5, 'bandpass', 800 + Math.random() * 2000, 1.5, 0.3 * Math.random(), 0.08);
  }

  pickup() {
    const out = this.route(undefined, 0.4, 0, 0.05)!;
    const t = this.ctx.currentTime;
    this.click(out, t, 0.3, 2400);
    this.noiseBurst(out, t + 0.04, 'bandpass', 1200, 1, 0.2, 0.1);
  }

  // ------------------------------------------------------------------ round
  roundStart() {
    const out = this.route(undefined, 0.35, 0, 0.1)!;
    const t = this.ctx.currentTime;
    this.noiseBurst(out, t, 'bandpass', 2000, 1.5, 0.3, 0.12);
    this.tone(out, t + 0.12, 'square', 880, 880, 0.1, 0.12);
    this.tone(out, t + 0.28, 'square', 1175, 1175, 0.1, 0.18);
  }

  goLive() {
    const out = this.route(undefined, 0.3, 0, 0.1)!;
    const t = this.ctx.currentTime;
    this.noiseBurst(out, t, 'bandpass', 2200, 2, 0.25, 0.1);
    this.tone(out, t + 0.08, 'square', 1320, 1320, 0.08, 0.1);
  }

  roundEnd(win: boolean) {
    const out = this.route(undefined, 0.35, 0, 0.3)!;
    const t = this.ctx.currentTime;
    const notes = win ? [523, 659, 784, 1047] : [587, 523, 440, 349];
    notes.forEach((f, i) => {
      this.tone(out, t + i * 0.14, 'triangle', f, f, 0.3, 0.3);
      this.tone(out, t + i * 0.14, 'sine', f / 2, f / 2, 0.15, 0.3);
    });
  }
}

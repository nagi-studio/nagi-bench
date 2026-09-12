/**
 * Procedural audio engine.
 *
 * There are no sound files: every effect is synthesised with oscillators and noise buffers
 * through the Web Audio graph. Gunshots are layered (transient crack + body thump +
 * mechanical action) and each weapon gets its own filter/decay signature, so an AK, an M4,
 * an AWP and a pistol are instantly distinguishable.
 *
 * Sounds are positioned relative to the listener: distance attenuates gain, angle drives a
 * stereo panner, and geometry between you and the source lowpasses it — you can hear that
 * a fight is happening through a wall.
 */

import { Vec3 } from '../core/math.ts';
import type { GameEvent } from '../game/events.ts';
import type { GameWorld } from '../game/world.ts';
import type { WeaponId } from '../game/weapons.ts';

interface WeaponVoice {
  /** Overall loudness. */
  gain: number;
  /** Lowpass cutoff of the initial crack. */
  crackCutoff: number;
  /** Decay of the crack in seconds. */
  crackDecay: number;
  /** Frequency of the low body thump. */
  bodyFreq: number;
  bodyDecay: number;
  /** Extra ring for rifles. */
  ringFreq: number;
  ringGain: number;
  suppressed: boolean;
}

const VOICES: Record<WeaponId, WeaponVoice> = {
  // Deep, punchy and loud.
  ak47: { gain: 0.95, crackCutoff: 2600, crackDecay: 0.24, bodyFreq: 118, bodyDecay: 0.2, ringFreq: 780, ringGain: 0.16, suppressed: false },
  // Tighter and higher pitched than the AK.
  m4a4: { gain: 0.78, crackCutoff: 4200, crackDecay: 0.15, bodyFreq: 165, bodyDecay: 0.12, ringFreq: 1150, ringGain: 0.2, suppressed: false },
  // Enormous, slow decay with a long tail.
  awp: { gain: 1.0, crackCutoff: 1900, crackDecay: 0.5, bodyFreq: 74, bodyDecay: 0.55, ringFreq: 420, ringGain: 0.1, suppressed: false },
  glock: { gain: 0.5, crackCutoff: 3400, crackDecay: 0.1, bodyFreq: 210, bodyDecay: 0.08, ringFreq: 1500, ringGain: 0.1, suppressed: false },
  // USP-S is silenced: quiet and muffled.
  usp: { gain: 0.32, crackCutoff: 950, crackDecay: 0.07, bodyFreq: 160, bodyDecay: 0.06, ringFreq: 900, ringGain: 0.06, suppressed: true },
  deagle: { gain: 0.92, crackCutoff: 2100, crackDecay: 0.33, bodyFreq: 92, bodyDecay: 0.3, ringFreq: 600, ringGain: 0.14, suppressed: false },
  knife: { gain: 0.3, crackCutoff: 6000, crackDecay: 0.06, bodyFreq: 400, bodyDecay: 0.04, ringFreq: 2200, ringGain: 0.2, suppressed: true },
};

const MAX_VOICES = 28;

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private noise: AudioBuffer | null = null;
  private activeVoices = 0;

  /** Listener state, refreshed every frame from the camera. */
  private lx = 0;
  private ly = 0;
  private lz = 0;
  private lyaw = 0;
  private readonly listenerPos = new Vec3();

  volume = 0.65;
  enabled = true;

  /** Must be called from a user gesture (browsers block audio otherwise). */
  async start(): Promise<void> {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      return;
    }
    const Ctor: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.knee.value = 22;
    compressor.ratio.value = 9;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.22;
    compressor.connect(ctx.destination);
    this.compressor = compressor;

    const master = ctx.createGain();
    master.gain.value = this.volume;
    master.connect(compressor);
    this.master = master;

    // One second of white noise, reused by every noise-based effect.
    const length = Math.floor(ctx.sampleRate);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    this.noise = buffer;

    if (ctx.state === 'suspended') await ctx.resume();
  }

  setVolume(v: number): void {
    this.volume = v;
    if (this.master) this.master.gain.value = v;
  }

  setListener(pos: { x: number; y: number; z: number }, yaw: number): void {
    this.lx = pos.x;
    this.ly = pos.y;
    this.lz = pos.z;
    this.lyaw = yaw;
    this.listenerPos.set(pos.x, pos.y, pos.z);
  }

  get ready(): boolean {
    return this.ctx !== null && this.enabled;
  }

  private now(): number {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  // ------------------------------------------------------------ audio graph

  /**
   * Builds the per-sound output chain: gain (distance) -> panner (angle) ->
   * lowpass (air absorption + wall occlusion) -> master.
   */
  private outputFor(pos: Vec3 | null, world: GameWorld | null, baseGain: number, occlude = true): GainNode | null {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return null;

    const out = ctx.createGain();

    if (!pos) {
      out.gain.value = baseGain;
      out.connect(master);
      return out;
    }

    const dx = pos.x - this.lx;
    const dy = pos.y - this.ly;
    const dz = pos.z - this.lz;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist > 90) return null;

    const attenuation = 1 / (1 + dist / 7);
    out.gain.value = baseGain * attenuation;

    // Stereo placement: rotate the offset into listener space.
    const cos = Math.cos(-this.lyaw);
    const sin = Math.sin(-this.lyaw);
    const localX = dx * cos + dz * sin;
    const horizontal = Math.max(0.001, Math.hypot(dx, dz));
    const pan = Math.max(-1, Math.min(1, (localX / horizontal) * Math.min(1, dist / 2)));

    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    let cutoff = 20000 - Math.min(15000, dist * 170);
    if (occlude && world && world.collision.losBlocked(this.listenerPos, pos)) {
      cutoff = Math.min(cutoff, 480);
      out.gain.value *= 0.55;
    }
    filter.frequency.value = Math.max(200, cutoff);

    out.connect(panner);
    panner.connect(filter);
    filter.connect(master);
    return out;
  }

  private trackVoice(node: AudioScheduledSourceNode, stopAt: number): void {
    this.activeVoices++;
    node.onended = () => {
      this.activeVoices--;
    };
    node.stop(stopAt);
  }

  private playNoise(
    destination: GainNode,
    duration: number,
    filterType: BiquadFilterType,
    cutoff: number,
    q: number,
    peak: number,
    startOffset = 0,
  ): void {
    const ctx = this.ctx;
    if (!ctx || !this.noise) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.playbackRate.value = 0.85 + Math.random() * 0.3;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = cutoff;
    filter.Q.value = q;

    const env = ctx.createGain();
    const t = this.now() + startOffset;
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    src.connect(filter);
    filter.connect(env);
    env.connect(destination);
    src.start(t, Math.random() * 0.5);
    this.trackVoice(src, t + duration + 0.02);
  }

  private playTone(
    destination: GainNode,
    type: OscillatorType,
    freqStart: number,
    freqEnd: number,
    duration: number,
    peak: number,
    startOffset = 0,
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.type = type;
    const t = this.now() + startOffset;
    osc.frequency.setValueAtTime(freqStart, t);
    if (freqEnd !== freqStart) osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t + duration);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(env);
    env.connect(destination);
    osc.start(t);
    this.trackVoice(osc, t + duration + 0.02);
  }

  // --------------------------------------------------------------- one-shots

  gunshot(weapon: WeaponId, pos: Vec3 | null, world: GameWorld | null, firstPerson: boolean): void {
    if (!this.ready || this.activeVoices > MAX_VOICES) return;
    const v = VOICES[weapon];
    const out = this.outputFor(firstPerson ? null : pos, world, (firstPerson ? 0.85 : 1) * v.gain);
    if (!out) return;

    // 1) transient crack
    this.playNoise(out, v.crackDecay, 'lowpass', v.crackCutoff, 0.8, v.suppressed ? 0.35 : 0.9);
    // 2) low body
    this.playTone(out, 'triangle', v.bodyFreq * 2.2, v.bodyFreq * 0.55, v.bodyDecay, v.suppressed ? 0.16 : 0.5);
    // 3) mechanical ring / action
    if (v.ringGain > 0) {
      this.playNoise(out, 0.05, 'bandpass', v.ringFreq, 6, v.ringGain, 0.012);
    }
    // 4) tail for the big guns
    if (weapon === 'awp' || weapon === 'ak47' || weapon === 'deagle') {
      this.playNoise(out, v.crackDecay * 2.4, 'lowpass', 620, 0.5, 0.22, 0.03);
    }
  }

  dryFire(pos: Vec3 | null, world: GameWorld | null, firstPerson: boolean): void {
    if (!this.ready) return;
    const out = this.outputFor(firstPerson ? null : pos, world, 0.5);
    if (!out) return;
    this.playNoise(out, 0.04, 'bandpass', 2400, 8, 0.4);
  }

  reload(pos: Vec3 | null, world: GameWorld | null, firstPerson: boolean, done: boolean): void {
    if (!this.ready) return;
    const out = this.outputFor(firstPerson ? null : pos, world, firstPerson ? 0.55 : 0.5);
    if (!out) return;
    if (done) {
      // Bolt release / slide snap.
      this.playNoise(out, 0.06, 'bandpass', 1700, 5, 0.6);
      this.playNoise(out, 0.05, 'highpass', 3000, 1, 0.3, 0.07);
    } else {
      // Magazine out, magazine in.
      this.playNoise(out, 0.05, 'bandpass', 900, 4, 0.5);
      this.playNoise(out, 0.06, 'bandpass', 1400, 4, 0.45, 0.22);
      this.playTone(out, 'square', 320, 180, 0.05, 0.12, 0.24);
    }
  }

  footstep(pos: Vec3, world: GameWorld, loud: boolean): void {
    if (!this.ready || this.activeVoices > MAX_VOICES) return;
    const out = this.outputFor(pos, world, loud ? 0.5 : 0.22);
    if (!out) return;
    this.playNoise(out, 0.085, 'lowpass', 620 + Math.random() * 220, 1.2, loud ? 0.55 : 0.3);
    this.playTone(out, 'sine', 130, 70, 0.06, loud ? 0.12 : 0.05);
  }

  jump(pos: Vec3, world: GameWorld): void {
    if (!this.ready) return;
    const out = this.outputFor(pos, world, 0.3);
    if (!out) return;
    this.playNoise(out, 0.07, 'lowpass', 900, 1, 0.3);
  }

  land(pos: Vec3, world: GameWorld, hard: boolean): void {
    if (!this.ready) return;
    const out = this.outputFor(pos, world, hard ? 0.6 : 0.3);
    if (!out) return;
    this.playNoise(out, hard ? 0.16 : 0.09, 'lowpass', 420, 1, hard ? 0.7 : 0.35);
    this.playTone(out, 'sine', 110, 55, 0.12, hard ? 0.25 : 0.1);
  }

  scope(level: number): void {
    if (!this.ready) return;
    const out = this.outputFor(null, null, 0.4);
    if (!out) return;
    // Two-stage optic click; pitch rises with the zoom level.
    this.playNoise(out, 0.035, 'bandpass', 2600 + level * 700, 9, 0.45);
    this.playTone(out, 'square', level > 0 ? 900 + level * 260 : 620, level > 0 ? 1300 : 420, 0.05, 0.09, 0.02);
  }

  weaponSwitch(pos: Vec3 | null, world: GameWorld | null, firstPerson: boolean): void {
    if (!this.ready) return;
    const out = this.outputFor(firstPerson ? null : pos, world, 0.4);
    if (!out) return;
    this.playNoise(out, 0.05, 'bandpass', 1200, 5, 0.4);
    this.playNoise(out, 0.04, 'bandpass', 2200, 6, 0.25, 0.06);
  }

  /** Feedback when *you* land a shot. */
  hitMarker(headshot: boolean): void {
    if (!this.ready) return;
    const out = this.outputFor(null, null, 0.32);
    if (!out) return;
    this.playTone(out, 'square', headshot ? 1750 : 1150, headshot ? 1400 : 980, 0.055, 0.32);
    if (headshot) this.playTone(out, 'sine', 2400, 1900, 0.07, 0.16, 0.03);
  }

  /** Taking damage. */
  pain(): void {
    if (!this.ready) return;
    const out = this.outputFor(null, null, 0.5);
    if (!out) return;
    this.playNoise(out, 0.14, 'bandpass', 380, 1.4, 0.5);
    this.playTone(out, 'sawtooth', 180, 90, 0.16, 0.14);
  }

  kill(youKilled: boolean): void {
    if (!this.ready) return;
    const out = this.outputFor(null, null, 0.45);
    if (!out) return;
    if (youKilled) {
      this.playTone(out, 'square', 880, 880, 0.06, 0.22);
      this.playTone(out, 'square', 1320, 1320, 0.09, 0.2, 0.07);
    } else {
      this.playTone(out, 'sine', 420, 260, 0.2, 0.16);
    }
  }

  bombBeep(pos: Vec3, world: GameWorld, urgency: number): void {
    if (!this.ready) return;
    const out = this.outputFor(pos, world, 0.5);
    if (!out) return;
    this.playTone(out, 'sine', 2100 + urgency * 900, 2100 + urgency * 900, 0.07, 0.5);
  }

  plant(pos: Vec3, world: GameWorld, done: boolean): void {
    if (!this.ready) return;
    const out = this.outputFor(pos, world, 0.6);
    if (!out) return;
    if (done) {
      this.playTone(out, 'square', 660, 660, 0.09, 0.35);
      this.playTone(out, 'square', 990, 990, 0.12, 0.3, 0.1);
      this.playNoise(out, 0.2, 'lowpass', 700, 1, 0.25, 0.02);
    } else {
      this.playNoise(out, 0.05, 'bandpass', 1500, 6, 0.4);
      this.playTone(out, 'square', 420, 380, 0.06, 0.14, 0.05);
    }
  }

  defuse(pos: Vec3, world: GameWorld, done: boolean): void {
    if (!this.ready) return;
    const out = this.outputFor(pos, world, 0.55);
    if (!out) return;
    if (done) {
      this.playTone(out, 'sine', 1200, 500, 0.35, 0.3);
      this.playNoise(out, 0.12, 'highpass', 2200, 1, 0.2);
    } else {
      // Wire cutters.
      this.playNoise(out, 0.04, 'bandpass', 3000, 8, 0.3);
      this.playNoise(out, 0.05, 'bandpass', 1800, 6, 0.22, 0.09);
    }
  }

  explode(pos: Vec3, world: GameWorld): void {
    if (!this.ready) return;
    const out = this.outputFor(pos, world, 1.0, false);
    if (!out) return;
    this.playNoise(out, 1.6, 'lowpass', 1400, 0.6, 1.0);
    this.playTone(out, 'sine', 90, 22, 1.4, 0.85);
    this.playTone(out, 'sawtooth', 160, 34, 0.9, 0.35, 0.02);
    this.playNoise(out, 2.4, 'lowpass', 380, 0.5, 0.35, 0.15);
  }

  roundStart(): void {
    if (!this.ready) return;
    const out = this.outputFor(null, null, 0.35);
    if (!out) return;
    this.playTone(out, 'sine', 520, 520, 0.12, 0.22);
    this.playTone(out, 'sine', 780, 780, 0.18, 0.2, 0.14);
  }

  roundEnd(won: boolean): void {
    if (!this.ready) return;
    const out = this.outputFor(null, null, 0.4);
    if (!out) return;
    if (won) {
      this.playTone(out, 'triangle', 523, 523, 0.16, 0.25);
      this.playTone(out, 'triangle', 659, 659, 0.16, 0.25, 0.15);
      this.playTone(out, 'triangle', 784, 784, 0.3, 0.25, 0.3);
    } else {
      this.playTone(out, 'triangle', 392, 392, 0.2, 0.22);
      this.playTone(out, 'triangle', 294, 294, 0.4, 0.22, 0.18);
    }
  }

  // ------------------------------------------------------------------ events

  /** Turns one frame of simulation events into sound. */
  consume(events: GameEvent[], world: GameWorld): void {
    if (!this.ready) return;

    for (const ev of events) {
      switch (ev.type) {
        case 'shot':
          this.gunshot(ev.weapon, ev.origin, world, ev.firstPerson);
          break;
        case 'dryfire':
          this.dryFire(null, world, ev.firstPerson);
          break;
        case 'reload':
          this.reload(ev.pos, world, ev.firstPerson, false);
          break;
        case 'reloadDone':
          this.reload(ev.pos, world, ev.firstPerson, true);
          break;
        case 'switch':
          this.weaponSwitch(ev.pos, world, ev.firstPerson);
          break;
        case 'scope':
          if (ev.firstPerson) this.scope(ev.level);
          break;
        case 'footstep':
          this.footstep(ev.pos, world, ev.loud);
          break;
        case 'jump':
          this.jump(ev.pos, world);
          break;
        case 'land':
          this.land(ev.pos, world, ev.hard);
          break;
        case 'hit':
          if (ev.byPlayer) this.hitMarker(ev.part === 'head');
          if (ev.onPlayer) this.pain();
          break;
        case 'kill':
          if (ev.byPlayer || ev.onPlayer) this.kill(ev.byPlayer);
          break;
        case 'plantStart':
          this.plant(ev.pos, world, false);
          break;
        case 'plantDone':
          this.plant(ev.pos, world, true);
          break;
        case 'defuseStart':
          this.defuse(ev.pos, world, false);
          break;
        case 'defuseDone':
          this.defuse(ev.pos, world, true);
          break;
        case 'bombBeep':
          this.bombBeep(ev.pos, world, ev.urgency);
          break;
        case 'explode':
          this.explode(ev.pos, world);
          break;
        case 'roundStart':
          this.roundStart();
          break;
        case 'roundEnd':
          this.roundEnd(ev.winner === world.playerTeam());
          break;
        default:
          break;
      }
    }
  }

  dispose(): void {
    this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.compressor = null;
  }
}

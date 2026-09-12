import { clamp, dist2D } from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';
import type { GameEngine } from '../game/engine.ts';
import { WEAPONS } from '../game/weapons.ts';
import type { WeaponSfx } from '../game/weapons.ts';

/**
 * Every sound in the game is synthesised at runtime with the Web Audio API —
 * there is not a single audio file in the project.
 *
 * Gunshots are a noise burst shaped by a resonant low-pass sweep plus a sine
 * "body" thump; the per-weapon parameters (gain / pitch / length / bass) live
 * in the weapon table, so an AK, an M4, an AWP and a pistol are audibly
 * different. Positional audio is a simple distance falloff plus stereo pan
 * relative to the listener's facing.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private listener: { pos: Vec3; yaw: number } = { pos: { x: 0, y: 0, z: 0 }, yaw: 0 };
  private unsubs: (() => void)[] = [];
  private muted = false;
  private lastFootstep = 0;

  get enabled(): boolean {
    return !!this.ctx && this.ctx.state === 'running' && !this.muted;
  }

  /** Must be called from a user gesture (pointer lock / click). */
  async resume(): Promise<void> {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') await this.ctx.resume();
  }

  private init(): void {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    this.master = master;

    // Two seconds of white noise, reused by every noise-based sound.
    const len = Math.floor(ctx.sampleRate * 2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.noise = buf;
  }

  setMuted(m: boolean): void {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.55;
  }

  setVolume(v: number): void {
    if (this.master) this.master.gain.value = clamp(v, 0, 1);
  }

  setListener(pos: Vec3, yaw: number): void {
    this.listener.pos = pos;
    this.listener.yaw = yaw;
  }

  // ------------------------------------------------------------- utilities

  private now(): number {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  /** Distance attenuation + stereo pan for a world-space sound. */
  private spatial(pos: Vec3 | null, refDist = 8): { gain: number; pan: number } {
    if (!pos) return { gain: 1, pan: 0 };
    const d = dist2D(this.listener.pos, pos);
    const gain = clamp(refDist / (refDist + d * d * 0.06 + d * 0.35), 0.02, 1);
    // Project the direction onto the listener's right vector.
    const dx = pos.x - this.listener.pos.x;
    const dz = pos.z - this.listener.pos.z;
    const len = Math.hypot(dx, dz) || 1;
    const rightX = Math.cos(this.listener.yaw);
    const rightZ = -Math.sin(this.listener.yaw);
    const pan = clamp(((dx / len) * rightX + (dz / len) * rightZ) * 0.9, -1, 1);
    return { gain, pan };
  }

  private chain(pos: Vec3 | null, refDist = 8): { input: GainNode; gain: number } | null {
    if (!this.ctx || !this.master || this.muted) return null;
    const { gain, pan } = this.spatial(pos, refDist);
    if (gain < 0.015) return null;
    const g = this.ctx.createGain();
    g.gain.value = 1;
    const panner = this.ctx.createStereoPanner();
    panner.pan.value = pan;
    g.connect(panner);
    panner.connect(this.master);
    return { input: g, gain };
  }

  private noiseBurst(
    dest: AudioNode,
    start: number,
    duration: number,
    volume: number,
    filterType: BiquadFilterType,
    freqStart: number,
    freqEnd: number,
    q = 1,
    playbackRate = 1,
  ): void {
    if (!this.ctx || !this.noise) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.playbackRate.value = playbackRate;
    src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(Math.max(40, freqStart), start);
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), start + duration);
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, start);
    env.gain.linearRampToValueAtTime(volume, start + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    src.connect(filter);
    filter.connect(env);
    env.connect(dest);
    src.start(start, Math.random() * 1.5);
    src.stop(start + duration + 0.02);
  }

  private tone(
    dest: AudioNode,
    start: number,
    duration: number,
    volume: number,
    freqStart: number,
    freqEnd: number,
    type: OscillatorType = 'sine',
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freqStart), start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), start + duration);
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, start);
    env.gain.linearRampToValueAtTime(volume, start + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(env);
    env.connect(dest);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  // ---------------------------------------------------------------- sounds

  gunshot(sfx: WeaponSfx, pos: Vec3 | null, firstPerson: boolean): void {
    const c = this.chain(firstPerson ? null : pos, 14);
    if (!c || !this.ctx) return;
    const t = this.now();
    const vol = sfx.gain * (firstPerson ? 0.5 : 0.65) * c.gain;

    // Crack: bright noise transient.
    this.noiseBurst(c.input, t, sfx.length * 0.6, vol * 0.9, 'bandpass', sfx.pitch * 12, sfx.pitch * 3, 0.8);
    // Body: resonant low-pass sweep.
    this.noiseBurst(c.input, t, sfx.length, vol, 'lowpass', sfx.pitch * 9, sfx.pitch * 1.2, 3.5);
    // Thump: the low end that separates a rifle from a pistol.
    this.tone(c.input, t, sfx.length * 1.5, vol * 0.75 * sfx.bass, sfx.pitch * 0.9, sfx.pitch * 0.35, 'sine');
    // Tail: a short slap-back so shots feel like they are in a map.
    this.noiseBurst(c.input, t + 0.045, sfx.length * 2.2, vol * 0.22, 'lowpass', 2600, 500, 1.2, 0.85);
    if (firstPerson) {
      this.noiseBurst(c.input, t, 0.02, vol * 0.5, 'highpass', 4000, 6000, 0.7);
    }
  }

  reload(pos: Vec3 | null, firstPerson: boolean): void {
    const c = this.chain(firstPerson ? null : pos, 9);
    if (!c) return;
    const t = this.now();
    const v = 0.45 * c.gain;
    // Magazine out, magazine in, bolt.
    this.noiseBurst(c.input, t + 0.02, 0.07, v, 'bandpass', 2600, 1200, 4);
    this.tone(c.input, t + 0.04, 0.06, v * 0.4, 300, 160, 'square');
    this.noiseBurst(c.input, t + 0.55, 0.09, v * 1.1, 'bandpass', 1800, 700, 3);
    this.tone(c.input, t + 0.58, 0.09, v * 0.5, 220, 120, 'square');
    this.noiseBurst(c.input, t + 0.95, 0.06, v * 0.9, 'highpass', 3200, 2000, 2);
  }

  footstep(pos: Vec3 | null, firstPerson: boolean): void {
    const t = this.now();
    if (firstPerson && t - this.lastFootstep < 0.12) return;
    this.lastFootstep = t;
    const c = this.chain(firstPerson ? null : pos, 7);
    if (!c) return;
    const v = (firstPerson ? 0.22 : 0.4) * c.gain;
    const p = 0.85 + Math.random() * 0.4;
    this.noiseBurst(c.input, t, 0.09, v, 'bandpass', 900 * p, 240 * p, 1.4);
    this.tone(c.input, t, 0.06, v * 0.3, 120, 70, 'sine');
  }

  scope(on: boolean, firstPerson: boolean): void {
    if (!firstPerson) return;
    const c = this.chain(null);
    if (!c) return;
    const t = this.now();
    // Two mechanical clicks, pitched up when zooming in.
    this.tone(c.input, t, 0.035, 0.22, on ? 900 : 700, on ? 1500 : 500, 'square');
    this.tone(c.input, t + 0.05, 0.045, 0.18, on ? 1400 : 600, on ? 1800 : 380, 'square');
    this.noiseBurst(c.input, t, 0.03, 0.12, 'highpass', 5000, 3000, 1);
  }

  emptyClick(firstPerson: boolean): void {
    if (!firstPerson) return;
    const c = this.chain(null);
    if (!c) return;
    const t = this.now();
    this.noiseBurst(c.input, t, 0.035, 0.3, 'bandpass', 3500, 1500, 6);
  }

  knife(pos: Vec3 | null, firstPerson: boolean): void {
    const c = this.chain(firstPerson ? null : pos, 8);
    if (!c) return;
    const t = this.now();
    this.noiseBurst(c.input, t, 0.12, 0.3 * c.gain, 'bandpass', 6000, 1200, 1.2);
  }

  hitMarker(): void {
    const c = this.chain(null);
    if (!c) return;
    const t = this.now();
    this.tone(c.input, t, 0.06, 0.3, 1900, 1500, 'triangle');
  }

  hurt(): void {
    const c = this.chain(null);
    if (!c) return;
    const t = this.now();
    this.tone(c.input, t, 0.28, 0.4, 180, 70, 'sine');
    this.noiseBurst(c.input, t, 0.16, 0.28, 'lowpass', 900, 200, 1);
  }

  kill(headshot: boolean): void {
    const c = this.chain(null);
    if (!c) return;
    const t = this.now();
    this.tone(c.input, t, 0.09, 0.34, 880, 900, 'triangle');
    this.tone(c.input, t + 0.09, 0.13, 0.34, headshot ? 1500 : 1240, headshot ? 1560 : 1280, 'triangle');
    if (headshot) this.tone(c.input, t + 0.2, 0.16, 0.22, 1800, 1900, 'sine');
  }

  bombBeep(pos: Vec3 | null): void {
    const c = this.chain(pos, 22);
    if (!c) return;
    const t = this.now();
    this.tone(c.input, t, 0.09, 0.35 * c.gain, 1500, 1500, 'square');
  }

  bombPlanted(pos: Vec3 | null): void {
    const c = this.chain(pos, 40);
    if (!c) return;
    const t = this.now();
    this.tone(c.input, t, 0.1, 0.35 * c.gain, 700, 900, 'square');
    this.tone(c.input, t + 0.12, 0.1, 0.35 * c.gain, 900, 1200, 'square');
    this.tone(c.input, t + 0.24, 0.22, 0.35 * c.gain, 1200, 1600, 'square');
  }

  defuseTick(pos: Vec3 | null): void {
    const c = this.chain(pos, 10);
    if (!c) return;
    const t = this.now();
    this.noiseBurst(c.input, t, 0.04, 0.3 * c.gain, 'bandpass', 2200, 900, 6);
  }

  bombDefused(pos: Vec3 | null): void {
    const c = this.chain(pos, 40);
    if (!c) return;
    const t = this.now();
    this.tone(c.input, t, 0.14, 0.3 * c.gain, 500, 900, 'triangle');
    this.tone(c.input, t + 0.14, 0.3, 0.3 * c.gain, 900, 1400, 'triangle');
  }

  explosion(pos: Vec3 | null): void {
    const c = this.chain(pos, 120);
    if (!c) return;
    const t = this.now();
    const v = clamp(c.gain * 1.6, 0.1, 1);
    this.noiseBurst(c.input, t, 1.6, v, 'lowpass', 3000, 90, 1.1);
    this.noiseBurst(c.input, t, 0.35, v * 0.8, 'bandpass', 1200, 300, 0.6);
    this.tone(c.input, t, 1.9, v * 0.9, 130, 26, 'sine');
    this.noiseBurst(c.input, t + 0.25, 2.4, v * 0.35, 'lowpass', 800, 60, 0.8, 0.7);
  }

  roundStart(): void {
    const c = this.chain(null);
    if (!c) return;
    const t = this.now();
    this.tone(c.input, t, 0.18, 0.22, 420, 640, 'triangle');
    this.tone(c.input, t + 0.2, 0.26, 0.2, 640, 860, 'triangle');
  }

  roundEnd(win: boolean): void {
    const c = this.chain(null);
    if (!c) return;
    const t = this.now();
    if (win) {
      this.tone(c.input, t, 0.2, 0.28, 520, 780, 'triangle');
      this.tone(c.input, t + 0.18, 0.36, 0.28, 780, 1040, 'triangle');
    } else {
      this.tone(c.input, t, 0.28, 0.26, 420, 300, 'sawtooth');
      this.tone(c.input, t + 0.24, 0.44, 0.22, 300, 180, 'sawtooth');
    }
  }

  /** Wire every gameplay event to a sound. */
  bind(engine: GameEngine): void {
    this.unbind();
    const bus = engine.bus;
    const push = (fn: () => void) => this.unsubs.push(fn);

    push(
      bus.on('shot', ({ weaponId, origin, firstPerson }) => {
        this.gunshot(WEAPONS[weaponId].sfx, origin, firstPerson);
      }),
    );
    push(bus.on('reload', ({ pos, firstPerson }) => this.reload(pos, firstPerson)));
    push(bus.on('footstep', ({ pos, firstPerson }) => this.footstep(pos, firstPerson)));
    push(bus.on('emptyClick', ({ firstPerson }) => this.emptyClick(firstPerson)));
    push(bus.on('knifeSwing', ({ pos, firstPerson }) => this.knife(pos, firstPerson)));
    push(bus.on('scope', ({ on, firstPerson }) => this.scope(on, firstPerson)));
    push(
      bus.on('hit', ({ attackerId, victimId }) => {
        if (attackerId === engine.viewActorId) this.hitMarker();
        if (victimId === engine.viewActorId) this.hurt();
      }),
    );
    push(
      bus.on('kill', ({ killerId, headshot }) => {
        if (killerId === engine.viewActorId) this.kill(headshot);
      }),
    );
    push(bus.on('bombPlanted', ({ pos }) => this.bombPlanted(pos)));
    push(bus.on('bombBeep', ({ pos }) => this.bombBeep(pos)));
    push(bus.on('bombDefuseStart', ({ pos }) => this.defuseTick(pos)));
    push(bus.on('bombDefused', ({ pos }) => this.bombDefused(pos)));
    push(bus.on('bombExploded', ({ pos }) => this.explosion(pos)));
    push(bus.on('roundStart', () => this.roundStart()));
    push(
      bus.on('roundEnd', ({ winner }) => {
        const me = engine.localActor;
        this.roundEnd(!!me && me.team === winner);
      }),
    );
    push(
      bus.on('land', ({ actorId, pos, hard }) => {
        if (hard) this.footstep(pos, actorId === engine.viewActorId);
      }),
    );
  }

  unbind(): void {
    for (const u of this.unsubs) u();
    this.unsubs = [];
  }

  dispose(): void {
    this.unbind();
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
  }
}

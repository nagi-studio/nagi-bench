/**
 * 程序化音频：不加载任何音频文件，全部用 Web Audio 现场合成。
 *
 * 枪声的配方：瞬态咔哒 + 低频"胸腔感"正弦 + 经过滤波的白噪声爆音，
 * 三者用不同的包络叠起来；每把枪的滤波频率、衰减、低频基音不同，
 * 所以 AK 闷而沉、M4 脆而快、AWP 是一声长尾巨响、手枪短促。
 * 另外挂一个程序化生成的脉冲响应做混响，让开枪有"在地图里回荡"的感觉。
 *
 * 其他角色发出的声音走 PannerNode 做 3D 定位，自己的声音直连以保证清晰。
 */

import type { SurfaceKind } from '../map/dust2.ts';
import type { WeaponId } from '../game/weapons.ts';

interface ShotProfile {
  /** 低频基音 */
  body: number;
  /** 噪声低通 */
  lp: number;
  /** 噪声高通 */
  hp: number;
  /** 衰减时间 */
  decay: number;
  /** 音量 */
  level: number;
  /** 混响送出量 */
  verb: number;
  /** 瞬态强度 */
  snap: number;
}

const SHOTS: Record<WeaponId, ShotProfile> = {
  ak47: { body: 108, lp: 2600, hp: 150, decay: 0.22, level: 1.0, verb: 0.5, snap: 0.9 },
  m4a4: { body: 158, lp: 3600, hp: 260, decay: 0.15, level: 0.86, verb: 0.42, snap: 1.0 },
  awp: { body: 68, lp: 1700, hp: 90, decay: 0.55, level: 1.15, verb: 0.85, snap: 0.75 },
  deagle: { body: 92, lp: 2200, hp: 130, decay: 0.3, level: 1.05, verb: 0.6, snap: 0.95 },
  glock: { body: 205, lp: 4200, hp: 330, decay: 0.1, level: 0.62, verb: 0.28, snap: 1.0 },
  usp: { body: 240, lp: 2000, hp: 420, decay: 0.07, level: 0.4, verb: 0.15, snap: 0.55 },
  knife: { body: 0, lp: 6000, hp: 1800, decay: 0.09, level: 0.4, verb: 0.1, snap: 0.3 },
  c4: { body: 0, lp: 3000, hp: 500, decay: 0.05, level: 0.3, verb: 0.1, snap: 0.4 },
};

const FOOTSTEP: Record<SurfaceKind, { lp: number; hp: number; level: number; decay: number }> = {
  sand: { lp: 900, hp: 180, level: 0.5, decay: 0.1 },
  stone: { lp: 2600, hp: 350, level: 0.55, decay: 0.075 },
  wall: { lp: 1800, hp: 300, level: 0.5, decay: 0.08 },
  plaster: { lp: 1800, hp: 300, level: 0.5, decay: 0.08 },
  crate: { lp: 1500, hp: 260, level: 0.55, decay: 0.09 },
  metal: { lp: 4200, hp: 700, level: 0.6, decay: 0.11 },
  concrete: { lp: 2400, hp: 320, level: 0.55, decay: 0.08 },
  barrel: { lp: 3200, hp: 500, level: 0.55, decay: 0.1 },
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private verbSend: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private started = false;
  volume = 0.75;
  enabled = true;

  /** 必须在用户手势里调用（浏览器自动播放策略）。 */
  ensureStarted(): void {
    if (this.started) {
      if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const Ctor: typeof AudioContext =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    this.ctx = new Ctor();
    this.started = true;

    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume;
    // 轻微压限，避免多人同时开枪时爆音
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 12;
    comp.ratio.value = 8;
    comp.attack.value = 0.003;
    comp.release.value = 0.18;
    this.master.connect(comp);
    comp.connect(this.ctx.destination);

    // 程序化混响
    const convolver = this.ctx.createConvolver();
    convolver.buffer = this.makeImpulse(1.1, 2.6);
    this.verbSend = this.ctx.createGain();
    this.verbSend.gain.value = 0.55;
    this.verbSend.connect(convolver);
    convolver.connect(this.master);

    this.noise = this.makeNoise(2);
  }

  setVolume(v: number): void {
    this.volume = v;
    if (this.master) this.master.gain.value = v;
  }

  /** 每帧同步听者位置与朝向。 */
  updateListener(
    x: number, y: number, z: number,
    fx: number, fy: number, fz: number,
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const l = ctx.listener;
    const t = ctx.currentTime;
    if (l.positionX) {
      l.positionX.setTargetAtTime(x, t, 0.02);
      l.positionY.setTargetAtTime(y, t, 0.02);
      l.positionZ.setTargetAtTime(z, t, 0.02);
      l.forwardX.setTargetAtTime(fx, t, 0.02);
      l.forwardY.setTargetAtTime(fy, t, 0.02);
      l.forwardZ.setTargetAtTime(fz, t, 0.02);
      l.upX.setTargetAtTime(0, t, 0.02);
      l.upY.setTargetAtTime(1, t, 0.02);
      l.upZ.setTargetAtTime(0, t, 0.02);
    } else {
      // 老接口兜底
      const legacy = l as unknown as {
        setPosition: (x: number, y: number, z: number) => void;
        setOrientation: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
      };
      legacy.setPosition?.(x, y, z);
      legacy.setOrientation?.(fx, fy, fz, 0, 1, 0);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 基础构件                                                            */
  /* ------------------------------------------------------------------ */

  private makeNoise(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  private makeImpulse(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        // 前面留一点预延迟，尾巴指数衰减，模拟室外+建筑的混合空间
        const env = Math.pow(1 - t, decay);
        d[i] = (Math.random() * 2 - 1) * env * (i < len * 0.02 ? t * 50 : 1);
      }
    }
    return buf;
  }

  /** 建立一条输出链：[dry] -> panner? -> master，同时按比例送混响。 */
  private out(
    pos: [number, number, number] | null,
    verbAmount: number,
  ): { input: GainNode } | null {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.enabled) return null;
    const input = ctx.createGain();
    if (pos) {
      const panner = ctx.createPanner();
      panner.panningModel = 'equalpower';
      panner.distanceModel = 'inverse';
      panner.refDistance = 5;
      panner.maxDistance = 140;
      panner.rolloffFactor = 1.1;
      if (panner.positionX) {
        panner.positionX.value = pos[0];
        panner.positionY.value = pos[1];
        panner.positionZ.value = pos[2];
      } else {
        (panner as unknown as { setPosition: (x: number, y: number, z: number) => void })
          .setPosition(pos[0], pos[1], pos[2]);
      }
      input.connect(panner);
      panner.connect(this.master);
      if (this.verbSend && verbAmount > 0) {
        const send = ctx.createGain();
        send.gain.value = verbAmount * 0.55;
        panner.connect(send);
        send.connect(this.verbSend);
      }
    } else {
      input.connect(this.master);
      if (this.verbSend && verbAmount > 0) {
        const send = ctx.createGain();
        send.gain.value = verbAmount;
        input.connect(send);
        send.connect(this.verbSend);
      }
    }
    return { input };
  }

  /** 一段带包络的滤波噪声。 */
  private noiseBurst(
    dest: GainNode,
    when: number,
    duration: number,
    level: number,
    lp: number,
    hp: number,
    lpEnd?: number,
  ): void {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise!;
    src.loop = true;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(lp, when);
    if (lpEnd !== undefined) lowpass.frequency.exponentialRampToValueAtTime(Math.max(60, lpEnd), when + duration);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = hp;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(level, when + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0008, when + duration);

    src.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(dest);
    src.start(when);
    src.stop(when + duration + 0.02);
  }

  /** 一个带包络的正弦/方波音。 */
  private tone(
    dest: GainNode,
    when: number,
    freq: number,
    endFreq: number,
    duration: number,
    level: number,
    type: OscillatorType = 'sine',
  ): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    if (endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), when + duration);
    }
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(level, when + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0008, when + duration);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(when);
    osc.stop(when + duration + 0.02);
  }

  /* ------------------------------------------------------------------ */
  /* 具体音效                                                            */
  /* ------------------------------------------------------------------ */

  shot(weapon: WeaponId, pos: [number, number, number] | null, local: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const p = SHOTS[weapon];
    const chain = this.out(local ? null : pos, p.verb);
    if (!chain) return;
    const t = ctx.currentTime;
    const lvl = p.level * (local ? 0.85 : 1.15);

    if (weapon === 'knife') {
      this.noiseBurst(chain.input, t, 0.14, lvl, 7000, 1200, 900);
      return;
    }

    // 瞬态：极短的高频爆点
    this.noiseBurst(chain.input, t, 0.02, lvl * p.snap * 0.9, 9000, 1500);
    // 主体噪声
    this.noiseBurst(chain.input, t, p.decay, lvl, p.lp, p.hp, p.lp * 0.25);
    // 低频胸腔感
    if (p.body > 0) {
      this.tone(chain.input, t, p.body * 1.7, p.body * 0.6, p.decay * 1.25, lvl * 0.55);
      this.tone(chain.input, t, p.body * 0.62, p.body * 0.4, p.decay * 1.7, lvl * 0.42);
    }
    // 机械声（枪机复进）
    this.noiseBurst(chain.input, t + 0.035, 0.05, lvl * 0.16, 5200, 2200);
  }

  emptyClick(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(null, 0.05);
    if (!chain) return;
    this.noiseBurst(chain.input, ctx.currentTime, 0.03, 0.3, 6000, 1800);
    this.tone(chain.input, ctx.currentTime, 1400, 900, 0.04, 0.12, 'square');
  }

  reload(weapon: WeaponId, pos: [number, number, number] | null, local: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(local ? null : pos, 0.12);
    if (!chain) return;
    const t = ctx.currentTime;
    const lvl = local ? 0.45 : 0.5;
    // 弹匣脱出 -> 插入 -> 拉机柄
    const times = weapon === 'awp' ? [0.05, 0.9, 1.8, 2.6] : [0.05, 0.55, 1.1, 1.55];
    times.forEach((dt, i) => {
      this.noiseBurst(chain.input, t + dt, 0.06, lvl * (i === times.length - 1 ? 1.2 : 0.9), 3800, 700);
      this.tone(chain.input, t + dt, 380 - i * 40, 180, 0.07, lvl * 0.35, 'square');
    });
  }

  footstep(surface: SurfaceKind, pos: [number, number, number] | null, local: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const f = FOOTSTEP[surface] ?? FOOTSTEP.sand;
    const chain = this.out(local ? null : pos, 0.15);
    if (!chain) return;
    const t = ctx.currentTime;
    const lvl = f.level * (local ? 0.32 : 0.85);
    this.noiseBurst(chain.input, t, f.decay, lvl, f.lp * (0.85 + Math.random() * 0.3), f.hp);
    this.tone(chain.input, t, 120, 70, 0.06, lvl * 0.25);
  }

  land(pos: [number, number, number] | null, local: boolean, hard: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(local ? null : pos, 0.2);
    if (!chain) return;
    const t = ctx.currentTime;
    const lvl = (hard ? 0.7 : 0.4) * (local ? 0.55 : 0.9);
    this.noiseBurst(chain.input, t, hard ? 0.16 : 0.09, lvl, 1400, 120);
    this.tone(chain.input, t, 90, 45, 0.12, lvl * 0.5);
  }

  /** 命中反馈：打中人是清脆的一声，爆头更亮。 */
  hitMarker(headshot: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(null, 0.05);
    if (!chain) return;
    const t = ctx.currentTime;
    if (headshot) {
      this.tone(chain.input, t, 1750, 1150, 0.11, 0.3, 'triangle');
      this.tone(chain.input, t + 0.02, 2600, 1900, 0.08, 0.16, 'sine');
    } else {
      this.tone(chain.input, t, 1080, 780, 0.075, 0.22, 'triangle');
    }
  }

  /** 被打中 */
  hurt(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(null, 0.1);
    if (!chain) return;
    const t = ctx.currentTime;
    this.noiseBurst(chain.input, t, 0.12, 0.35, 900, 120);
    this.tone(chain.input, t, 260, 120, 0.16, 0.2, 'sawtooth');
  }

  kill(headshot: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(null, 0.2);
    if (!chain) return;
    const t = ctx.currentTime;
    this.tone(chain.input, t, 880, 880, 0.09, 0.22, 'triangle');
    this.tone(chain.input, t + 0.07, headshot ? 1480 : 1180, headshot ? 1480 : 1180, 0.16, 0.24, 'triangle');
  }

  /** 命中墙面 */
  impact(surface: SurfaceKind, pos: [number, number, number]): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(pos, 0.15);
    if (!chain) return;
    const t = ctx.currentTime;
    if (surface === 'metal') {
      this.tone(chain.input, t, 2400 + Math.random() * 900, 800, 0.16, 0.16, 'triangle');
      this.noiseBurst(chain.input, t, 0.07, 0.22, 7000, 2000);
    } else {
      this.noiseBurst(chain.input, t, 0.08, 0.28, 2600, 400, 700);
    }
  }

  scope(on: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(null, 0.05);
    if (!chain) return;
    const t = ctx.currentTime;
    this.noiseBurst(chain.input, t, 0.03, 0.18, 5000, 1500);
    this.tone(chain.input, t + 0.01, on ? 900 : 1200, on ? 1200 : 900, 0.06, 0.13, 'square');
  }

  switchWeapon(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(null, 0.05);
    if (!chain) return;
    const t = ctx.currentTime;
    this.noiseBurst(chain.input, t, 0.05, 0.28, 4200, 900);
    this.noiseBurst(chain.input, t + 0.09, 0.04, 0.2, 3200, 800);
  }

  bombBeep(pos: [number, number, number], urgent: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(pos, 0.3);
    if (!chain) return;
    const t = ctx.currentTime;
    this.tone(chain.input, t, urgent ? 3000 : 2400, urgent ? 3000 : 2400, 0.06, 0.5, 'square');
  }

  bombPlant(pos: [number, number, number]): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(pos, 0.25);
    if (!chain) return;
    const t = ctx.currentTime;
    // 一串机械按键 + 确认音
    for (let i = 0; i < 5; i++) {
      this.noiseBurst(chain.input, t + i * 0.09, 0.03, 0.3, 5000, 1200);
      this.tone(chain.input, t + i * 0.09, 700 + i * 130, 600, 0.04, 0.14, 'square');
    }
    this.tone(chain.input, t + 0.55, 1600, 1600, 0.2, 0.3, 'square');
  }

  bombDefuse(pos: [number, number, number], done: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(pos, 0.25);
    if (!chain) return;
    const t = ctx.currentTime;
    if (done) {
      this.tone(chain.input, t, 700, 700, 0.12, 0.3, 'triangle');
      this.tone(chain.input, t + 0.11, 1050, 1050, 0.12, 0.3, 'triangle');
      this.tone(chain.input, t + 0.22, 1400, 1400, 0.28, 0.32, 'triangle');
    } else {
      for (let i = 0; i < 3; i++) {
        this.noiseBurst(chain.input, t + i * 0.14, 0.06, 0.22, 3400, 900);
      }
    }
  }

  explosion(pos: [number, number, number]): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(pos, 1);
    if (!chain) return;
    const t = ctx.currentTime;
    // 起爆瞬间的亮裂声
    this.noiseBurst(chain.input, t, 0.12, 1.2, 9000, 800);
    // 主爆轰
    this.noiseBurst(chain.input, t, 1.9, 1.4, 1200, 30, 90);
    // 次声下扫
    this.tone(chain.input, t, 110, 22, 1.7, 1.0);
    this.tone(chain.input, t + 0.04, 62, 18, 2.2, 0.8);
    // 碎片
    for (let i = 0; i < 8; i++) {
      this.noiseBurst(chain.input, t + 0.15 + Math.random() * 0.7, 0.1, 0.16, 6000, 1500);
    }
  }

  roundStart(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(null, 0.4);
    if (!chain) return;
    const t = ctx.currentTime;
    [440, 554, 660].forEach((f, i) => {
      this.tone(chain.input, t + i * 0.09, f, f, 0.5, 0.16, 'triangle');
    });
  }

  roundEnd(win: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chain = this.out(null, 0.5);
    if (!chain) return;
    const t = ctx.currentTime;
    const notes = win ? [523, 659, 784, 1046] : [523, 466, 392, 311];
    notes.forEach((f, i) => {
      this.tone(chain.input, t + i * 0.13, f, f, 0.55, 0.17, 'triangle');
    });
  }
}

export const audio = new AudioEngine();

import type { WorldEvent } from '../types.ts'
import type { SoundKind } from '../weapons/weapons.ts'
import { clamp } from '../core/mathUtil.ts'

/**
 * 程序化音效（Web Audio API）：不使用任何音频文件。
 * 枪声 = 噪声爆裂（决定音色）+ 低频振荡体（决定厚度），每种武器参数不同。
 * 所有有位置的声音按距离衰减，并根据相对听者方位做立体声声像。
 */
export class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null
  private listener = { x: 0, z: 0, yaw: 0 }
  enabled = true

  /** 必须在用户手势（点击）中调用，否则浏览器会阻止音频 */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return
    }
    const Ctor = window.AudioContext
    const ctx = new Ctor()
    this.ctx = ctx
    this.master = ctx.createGain()
    this.master.gain.value = 0.7
    this.master.connect(ctx.destination)
    const len = ctx.sampleRate
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    this.noise = buf
  }

  setListener(x: number, z: number, yaw: number): void {
    this.listener = { x, z, yaw }
  }

  handle(e: WorldEvent, humanId: number): void {
    if (!this.ctx || !this.enabled) return
    switch (e.type) {
      case 'shot':
        if (e.weapon === 'knife') this.knifeSwing({ x: e.x, z: e.z })
        else this.gunshot(gunSound(e.weapon), { x: e.x, z: e.z })
        break
      case 'reload':
        this.reload({ x: e.x, z: e.z })
        break
      case 'scope':
        this.scope(e.on, { x: e.x, z: e.z })
        break
      case 'footstep':
        this.footstep({ x: e.x, z: e.z }, e.team)
        break
      case 'hitEnemy':
        if (e.byId === humanId) this.hitMarker(e.headshot)
        break
      case 'hurt':
        if (e.victimId === humanId) this.hurt()
        break
      case 'kill':
        if (e.killerId === humanId) this.killDing()
        break
      case 'bomb':
        this.bombEvent(e.kind, { x: e.x, z: e.z })
        break
      case 'explosion':
        this.explosion({ x: e.x, z: e.z })
        break
      case 'door':
        this.door({ x: e.x, z: e.z })
        break
      case 'roundEnd':
        this.chord(e.winner === 'T' ? [392, 494, 587] : [523, 659, 784], 0.5)
        break
      case 'matchEnd':
        this.chord([523, 659, 784, 1046], 1.2)
        break
      default:
        break
    }
  }

  // ---------------------------------------------------------------- 基础构件

  /** 为一次声音创建音量 + 声像节点；有位置时做距离衰减和左右声像 */
  private bus(pos: { x: number; z: number } | null, volume: number): AudioNode {
    const ctx = this.ctx as AudioContext
    const master = this.master as GainNode
    const gain = ctx.createGain()
    if (!pos) {
      gain.gain.value = volume
      gain.connect(master)
      return gain
    }
    const dx = pos.x - this.listener.x
    const dz = pos.z - this.listener.z
    const dist = Math.hypot(dx, dz)
    const atten = 1 / (1 + dist / 12)
    gain.gain.value = clamp(volume * atten, 0, 2)
    const panner = ctx.createStereoPanner()
    // 右方向量 = (cos yaw, -sin yaw)
    const side = dx * Math.cos(this.listener.yaw) - dz * Math.sin(this.listener.yaw)
    panner.pan.value = clamp(side / Math.max(2, dist), -1, 1)
    gain.connect(panner)
    panner.connect(master)
    return gain
  }

  private noiseBurst(
    dest: AudioNode,
    type: BiquadFilterType,
    freq: number,
    q: number,
    dur: number,
    gain: number,
    when = 0,
  ): void {
    const ctx = this.ctx as AudioContext
    const t = ctx.currentTime + when
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const f = ctx.createBiquadFilter()
    f.type = type
    f.frequency.value = freq
    f.Q.value = q
    const g = ctx.createGain()
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f)
    f.connect(g)
    g.connect(dest)
    src.start(t, Math.random() * 0.5, dur + 0.02)
  }

  private tone(
    dest: AudioNode,
    type: OscillatorType,
    freq: number,
    freqEnd: number,
    dur: number,
    gain: number,
    when = 0,
  ): void {
    const ctx = this.ctx as AudioContext
    const t = ctx.currentTime + when
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    o.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g)
    g.connect(dest)
    o.start(t)
    o.stop(t + dur + 0.02)
  }

  // ---------------------------------------------------------------- 武器

  /** 不同武器的枪声参数：噪声带通决定音色，低频振荡决定厚度 */
  gunshot(kind: SoundKind, pos: { x: number; z: number }): void {
    const d = this.bus(pos, 1)
    switch (kind) {
      case 'ak':
        this.noiseBurst(d, 'bandpass', 1500, 0.9, 0.14, 0.8)
        this.tone(d, 'sawtooth', 180, 70, 0.12, 0.35)
        break
      case 'm4':
        this.noiseBurst(d, 'highpass', 2200, 0.7, 0.08, 0.6)
        this.tone(d, 'square', 260, 120, 0.07, 0.22)
        break
      case 'awp':
        this.noiseBurst(d, 'lowpass', 900, 0.5, 0.7, 1.0)
        this.tone(d, 'sine', 90, 35, 0.55, 0.7)
        this.noiseBurst(d, 'highpass', 3000, 0.7, 0.05, 0.6)
        break
      case 'deagle':
        this.noiseBurst(d, 'bandpass', 1200, 1.0, 0.16, 0.85)
        this.tone(d, 'sine', 160, 60, 0.13, 0.4)
        break
      case 'pistol':
      default:
        this.noiseBurst(d, 'bandpass', 1800, 1.2, 0.08, 0.6)
        this.tone(d, 'square', 220, 90, 0.06, 0.22)
        break
    }
  }

  private knifeSwing(pos: { x: number; z: number }): void {
    this.noiseBurst(this.bus(pos, 0.5), 'bandpass', 2500, 2, 0.12, 0.3)
  }

  private reload(pos: { x: number; z: number }): void {
    const d = this.bus(pos, 0.6)
    this.noiseBurst(d, 'highpass', 4000, 0.8, 0.03, 0.4, 0)
    this.noiseBurst(d, 'highpass', 3500, 0.8, 0.03, 0.4, 0.45)
    this.noiseBurst(d, 'highpass', 4500, 0.8, 0.03, 0.5, 1.35)
    this.tone(d, 'triangle', 900, 600, 0.04, 0.15, 0.45)
  }

  private scope(on: boolean, pos: { x: number; z: number }): void {
    const d = this.bus(pos, 0.5)
    this.noiseBurst(d, 'highpass', 5000, 0.8, 0.04, 0.2)
    this.tone(d, 'triangle', on ? 700 : 1200, on ? 1200 : 700, 0.14, 0.12)
  }

  private footstep(pos: { x: number; z: number }, team: 'T' | 'CT'): void {
    const freq = team === 'T' ? 380 : 520
    this.noiseBurst(this.bus(pos, 0.45), 'lowpass', freq + Math.random() * 120, 0.7, 0.07, 0.3)
  }

  private hitMarker(headshot: boolean): void {
    const d = this.bus(null, 0.6)
    this.tone(d, 'sine', 1400, 1100, 0.06, 0.25)
    if (headshot) this.tone(d, 'sine', 2000, 1700, 0.08, 0.25, 0.06)
  }

  private hurt(): void {
    const d = this.bus(null, 0.7)
    this.tone(d, 'sawtooth', 130, 80, 0.14, 0.2)
    this.noiseBurst(d, 'lowpass', 600, 0.7, 0.1, 0.3)
  }

  private killDing(): void {
    const d = this.bus(null, 0.5)
    this.tone(d, 'sine', 1046, 1046, 0.14, 0.3)
    this.tone(d, 'sine', 1568, 1568, 0.25, 0.3, 0.1)
  }

  private door(pos: { x: number; z: number }): void {
    const d = this.bus(pos, 0.5)
    this.tone(d, 'sawtooth', 200, 140, 0.45, 0.08)
    this.noiseBurst(d, 'bandpass', 800, 1.5, 0.4, 0.15)
  }

  private bombEvent(kind: 'pickup' | 'drop' | 'plantStart' | 'planted' | 'defuseStart' | 'defused' | 'exploded' | 'beep', pos: { x: number; z: number }): void {
    const d = this.bus(pos, 0.9)
    switch (kind) {
      case 'plantStart':
        for (let i = 0; i < 4; i++) this.tone(d, 'square', 880, 880, 0.08, 0.2, i * 0.8)
        break
      case 'planted':
        this.tone(d, 'square', 1300, 1300, 0.6, 0.3)
        break
      case 'beep':
        this.tone(d, 'square', 1400, 1400, 0.05, 0.12)
        break
      case 'defuseStart':
        this.tone(d, 'triangle', 600, 1000, 0.8, 0.25)
        break
      case 'defused':
        this.chord([880, 1320, 1760], 0.6)
        break
      case 'pickup':
        this.tone(d, 'triangle', 700, 900, 0.12, 0.2)
        break
      case 'drop':
        this.noiseBurst(d, 'lowpass', 200, 0.7, 0.12, 0.5)
        break
      default:
        // exploded 由单独的 explosion 事件播放，避免重复
        break
    }
  }

  private explosion(pos: { x: number; z: number }): void {
    const d = this.bus(pos, 1.2)
    this.noiseBurst(d, 'lowpass', 300, 0.6, 1.4, 1.0)
    this.tone(d, 'sine', 60, 25, 1.2, 0.9)
    this.noiseBurst(d, 'lowpass', 1500, 0.6, 0.35, 0.5, 0.05)
  }

  private chord(freqs: number[], dur: number): void {
    const d = this.bus(null, 0.6)
    freqs.forEach((f, i) => this.tone(d, 'triangle', f, f, dur, 0.22, i * 0.12))
  }
}

function gunSound(id: string): SoundKind {
  if (id === 'ak47') return 'ak'
  if (id === 'm4a4') return 'm4'
  if (id === 'deagle') return 'deagle'
  if (id === 'awp') return 'awp'
  return 'pistol'
}

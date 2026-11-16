/**
 * 程序化音效：Web Audio API 合成，不使用任何外部音频素材。
 *
 * 物理约束（按分镜设计）：
 * - 地下室枪声：加入多重延迟反馈模拟强烈反射与混响尾音。
 * - 真空/太空：外部枪声不传播，只用航天服内部传导的闷震与主观化低频表现。
 */
let ctx: AudioContext | null = null
let master: GainNode | null = null
/** 地下室混响总线 */
let indoorBus: GainNode | null = null

export function initAudio(): void {
  if (ctx) return
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.5
  master.connect(ctx.destination)

  // 地下室混响：多抽头延迟 + 反馈，形成反射声场
  indoorBus = ctx.createGain()
  indoorBus.gain.value = 1
  indoorBus.connect(master)
  const delays = [0.037, 0.061, 0.089, 0.127, 0.181]
  const fb = ctx.createGain()
  fb.gain.value = 0.62
  const damp = ctx.createBiquadFilter()
  damp.type = 'lowpass'
  damp.frequency.value = 2200
  for (const d of delays) {
    const dl = ctx.createDelay(1)
    dl.delayTime.value = d
    const g = ctx.createGain()
    g.gain.value = 0.5 / delays.length
    indoorBus.connect(dl)
    dl.connect(damp)
    damp.connect(g)
    g.connect(fb)
    g.connect(master)
  }
  fb.connect(indoorBus)
}

export function resumeAudio(): void {
  if (ctx && ctx.state === 'suspended') void ctx.resume()
}

function t0(): number {
  return ctx ? ctx.currentTime : 0
}

function noiseBuf(dur: number): AudioBuffer | null {
  if (!ctx) return null
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur))
  const b = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = b.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  return b
}

/** 环境类型：真空时不传声，只做主观闷响 */
type Space = 'indoor' | 'vacuum'

function noise(
  dur: number,
  gain: number,
  filter: BiquadFilterType,
  freq: number,
  q: number,
  space: Space,
  attack = 0.002
): void {
  if (!ctx || !master) return
  const buf = noiseBuf(dur)
  if (!buf) return
  const src = ctx.createBufferSource()
  src.buffer = buf
  const f = ctx.createBiquadFilter()
  f.type = filter
  f.frequency.value = freq
  f.Q.value = q
  const g = ctx.createGain()
  const t = t0()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur)
  src.connect(f)
  f.connect(g)
  if (space === 'indoor' && indoorBus) {
    g.connect(indoorBus)
  } else {
    // 真空：仅主观低频，不走混响
    g.connect(master)
  }
  src.start(t)
  src.stop(t + dur)
}

function tone(
  type: OscillatorType,
  f0: number,
  f1: number,
  dur: number,
  gain: number,
  space: Space
): void {
  if (!ctx || !master) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  const t = t0()
  o.type = type
  o.frequency.setValueAtTime(f0, t)
  o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur)
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur)
  o.connect(g)
  if (space === 'indoor' && indoorBus) g.connect(indoorBus)
  else g.connect(master)
  o.start(t)
  o.stop(t + dur)
}

/* ---------------- 具体音效 ---------------- */

/** 枪声：室内强烈反射；真空只有闷震 */
export function gunshot(space: Space): void {
  if (space === 'indoor') {
    noise(0.32, 0.9, 'lowpass', 2400, 1.0, 'indoor')
    tone('square', 200, 70, 0.16, 0.34, 'indoor')
    tone('sawtooth', 420, 110, 0.08, 0.2, 'indoor')
  } else {
    // 真空：外部声不传播，改为低频闷震与耳鸣式高频
    noise(0.18, 0.42, 'lowpass', 220, 0.8, 'vacuum')
    tone('sine', 78, 34, 0.24, 0.4, 'vacuum')
  }
}

/** 拉栓 / 上膛 */
export function gunAction(space: Space): void {
  noise(0.05, 0.28, 'bandpass', 2400, 4, space)
  window.setTimeout(() => noise(0.06, 0.32, 'bandpass', 1500, 3, space), 110)
  window.setTimeout(() => noise(0.04, 0.22, 'highpass', 3600, 2, space), 250)
}

/** 航天服呼吸（真空中的主观声） */
export function suitBreath(): void {
  noise(0.42, 0.13, 'bandpass', 620, 1.4, 'vacuum', 0.12)
  window.setTimeout(() => noise(0.38, 0.10, 'bandpass', 480, 1.3, 'vacuum', 0.1), 460)
}

/** 无线电通讯（带滤波失真） */
export function radioBeep(): void {
  tone('square', 1200, 1000, 0.06, 0.14, 'vacuum')
}

/** 引擎启动：低频轰鸣 + 机械加工声 */
export function engineStart(): void {
  if (!ctx || !master) return
  tone('sawtooth', 40, 120, 2.6, 0.28, 'vacuum')
  noise(2.4, 0.16, 'lowpass', 300, 0.9, 'vacuum', 0.5)
  // 机械加工：周期性敲击
  for (let i = 0; i < 8; i++) {
    window.setTimeout(() => noise(0.05, 0.10, 'bandpass', 1800, 5, 'vacuum'), 200 + i * 230)
  }
}

/** 推进器点火 */
export function thruster(): void {
  noise(1.4, 0.34, 'lowpass', 700, 0.8, 'vacuum', 0.06)
  tone('sine', 120, 45, 1.2, 0.22, 'vacuum')
}

/** 泄压（真空中通过结构传导听见） */
export function depressurize(): void {
  noise(1.1, 0.24, 'highpass', 2600, 0.8, 'vacuum', 0.08)
  tone('sawtooth', 900, 200, 0.9, 0.10, 'vacuum')
}

/** 警报 */
export function alarm(): void {
  for (let i = 0; i < 3; i++) {
    window.setTimeout(() => tone('square', 880, 880, 0.18, 0.16, 'vacuum'), i * 320)
  }
}

/** 撞击 */
export function impact(): void {
  noise(0.24, 0.5, 'lowpass', 1400, 1.1, 'indoor')
  tone('sine', 140, 50, 0.3, 0.3, 'indoor')
}

/** 舱门闭合（金属碰撞，强反射） */
export function hatchClose(): void {
  noise(0.4, 0.62, 'lowpass', 1800, 1.4, 'indoor')
  tone('square', 160, 60, 0.22, 0.26, 'indoor')
}

/** 全息通讯开启 */
export function commOpen(): void {
  tone('sine', 700, 1400, 0.12, 0.14, 'indoor')
  noise(0.08, 0.10, 'highpass', 4200, 1.5, 'indoor')
}

/** 低频轰鸣（用于宇宙尺度镜头） */
export function rumble(dur: number, gain = 0.14): void {
  noise(dur, gain, 'lowpass', 110, 0.7, 'vacuum', 0.4)
}

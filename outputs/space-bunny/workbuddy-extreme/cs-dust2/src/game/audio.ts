// Web Audio 程序化音效：不使用任何外部音频文件
let ctx: AudioContext | null = null
let master: GainNode | null = null

export function initAudio(): void {
  if (ctx) return
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.32
  master.connect(ctx.destination)
}

export function resumeAudio(): void {
  if (ctx && ctx.state === 'suspended') void ctx.resume()
}

function now(): number {
  return ctx ? ctx.currentTime : 0
}

/** 白噪声缓冲，用于爆响与摩擦音 */
function noiseBuffer(dur: number): AudioBuffer | null {
  if (!ctx) return null
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur))
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  return buf
}

/** 噪声爆音：枪声的主体 */
function burst(
  dur: number,
  gain: number,
  filterType: BiquadFilterType,
  freq: number,
  q = 1,
  decay = 3
): void {
  if (!ctx || !master) return
  const buf = noiseBuffer(dur)
  if (!buf) return
  const src = ctx.createBufferSource()
  src.buffer = buf
  const f = ctx.createBiquadFilter()
  f.type = filterType
  f.frequency.value = freq
  f.Q.value = q
  const g = ctx.createGain()
  const t = now()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur)
  src.connect(f)
  f.connect(g)
  g.connect(master)
  src.start(t)
  src.stop(t + dur)
  void decay
}

/** 音调层：给枪声加入金属共鸣 */
function tone(
  type: OscillatorType,
  f0: number,
  f1: number,
  dur: number,
  gain: number
): void {
  if (!ctx || !master) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  const t = now()
  o.type = type
  o.frequency.setValueAtTime(f0, t)
  o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur)
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur)
  o.connect(g)
  g.connect(master)
  o.start(t)
  o.stop(t + dur)
}

/* ------------------------------------------------------------------ */
/* 武器射击：按武器区分音色                                             */
/* ------------------------------------------------------------------ */
export function playShot(weaponId: string, distance: number): void {
  if (!ctx) return
  // 距离衰减
  const atten = Math.max(0.06, 1 - distance / 70)
  switch (weaponId) {
    case 'ak47':
      // 强劲、低频冲击明显
      burst(0.22, 0.85 * atten, 'lowpass', 1500, 1.1)
      tone('square', 180, 60, 0.13, 0.30 * atten)
      tone('sawtooth', 320, 90, 0.07, 0.16 * atten)
      break
    case 'm4a4':
      // 清亮、射速高，尾音短
      burst(0.14, 0.62 * atten, 'bandpass', 2600, 1.6)
      tone('square', 300, 150, 0.06, 0.20 * atten)
      break
    case 'awp':
      // 极响、低频重、尾音长
      burst(0.55, 1.0 * atten, 'lowpass', 900, 0.9)
      tone('sine', 120, 34, 0.42, 0.5 * atten)
      tone('sawtooth', 260, 60, 0.14, 0.24 * atten)
      break
    case 'glock':
      burst(0.12, 0.48 * atten, 'bandpass', 3200, 2.0)
      tone('square', 420, 210, 0.05, 0.14 * atten)
      break
    case 'usp':
      burst(0.13, 0.5 * atten, 'bandpass', 2800, 2.2)
      tone('square', 380, 180, 0.055, 0.15 * atten)
      break
    case 'deagle':
      burst(0.3, 0.9 * atten, 'lowpass', 1200, 1.0)
      tone('square', 200, 70, 0.18, 0.34 * atten)
      break
    case 'knife':
      burst(0.1, 0.3, 'highpass', 4200, 1.0)
      break
    default:
      burst(0.14, 0.5 * atten, 'bandpass', 2400, 1.4)
  }
}

export function playReload(): void {
  if (!ctx) return
  // 两次机械咔哒
  burst(0.06, 0.32, 'bandpass', 1800, 3)
  window.setTimeout(() => burst(0.07, 0.36, 'bandpass', 1300, 3), 150)
  window.setTimeout(() => burst(0.05, 0.28, 'highpass', 3000, 2), 340)
}

export function playStep(hard: boolean): void {
  if (!ctx) return
  if (hard) burst(0.08, 0.16, 'lowpass', 800, 1)
  else burst(0.06, 0.10, 'lowpass', 500, 1)
}

export function playScope(): void {
  if (!ctx) return
  tone('sine', 900, 1500, 0.06, 0.14)
  burst(0.04, 0.12, 'highpass', 5000, 1)
}

export function playHit(headshot: boolean): void {
  if (!ctx) return
  tone('triangle', headshot ? 1400 : 900, headshot ? 700 : 450, 0.07, 0.24)
  burst(0.05, 0.14, 'highpass', 3000, 1)
}

export function playKill(): void {
  if (!ctx) return
  tone('triangle', 880, 1320, 0.1, 0.2)
  window.setTimeout(() => tone('triangle', 1320, 1760, 0.12, 0.18), 90)
}

export function playDeath(): void {
  if (!ctx) return
  tone('sawtooth', 300, 60, 0.5, 0.3)
  burst(0.4, 0.24, 'lowpass', 700, 1)
}

/** C4 安放：滴声 */
export function playBombPlant(): void {
  if (!ctx) return
  for (let i = 0; i < 5; i++) {
    window.setTimeout(() => tone('square', 1400, 1400, 0.05, 0.2), i * 110)
  }
}

/** C4 拆除：上升音 */
export function playBombDefuse(): void {
  if (!ctx) return
  for (let i = 0; i < 4; i++) {
    window.setTimeout(() => tone('sine', 500 + i * 260, 600 + i * 260, 0.07, 0.2), i * 90)
  }
}

/** C4 爆炸：地下室强烈反射感 */
export function playExplosion(): void {
  if (!ctx) return
  burst(1.3, 1.0, 'lowpass', 500, 0.8)
  tone('sine', 90, 22, 1.0, 0.6)
  // 回声尾巴，模拟空间反射
  window.setTimeout(() => burst(0.8, 0.32, 'lowpass', 800, 1), 90)
  window.setTimeout(() => burst(0.5, 0.18, 'lowpass', 600, 1), 240)
}

export function playRoundWin(): void {
  if (!ctx) return
  const seq = [523, 659, 784, 1047]
  seq.forEach((f, i) => window.setTimeout(() => tone('triangle', f, f, 0.18, 0.22), i * 130))
}

export function playRoundLose(): void {
  if (!ctx) return
  const seq = [523, 440, 349, 262]
  seq.forEach((f, i) => window.setTimeout(() => tone('triangle', f, f, 0.24, 0.2), i * 170))
}

import type { WeaponId } from './types'
export type Sound =
  | WeaponId
  | 'reload'
  | 'step'
  | 'scope'
  | 'hit'
  | 'kill'
  | 'plant'
  | 'defuse'
  | 'explode'
  | 'beep'
  | 'equip'
  | 'drop'
  | 'win'
export class Synth {
  private ctx: AudioContext | null = null
  private bus: GainNode | null = null
  private noise: AudioBuffer | null = null
  private volume = 0.55
  private muted = false
  unlock() {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.bus = this.ctx.createGain()
      const compressor = this.ctx.createDynamicsCompressor()
      compressor.threshold.value = -13
      compressor.ratio.value = 5
      this.bus.connect(compressor)
      compressor.connect(this.ctx.destination)
      this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate * 1.4, this.ctx.sampleRate)
      const a = this.noise.getChannelData(0)
      for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1
      this.level(this.volume, this.muted)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume().catch(() => {})
  }
  level(v: number, muted: boolean) {
    this.volume = v
    this.muted = muted
    if (this.bus && this.ctx)
      this.bus.gain.setTargetAtTime(muted ? 0 : v * 0.69, this.ctx.currentTime, 0.03)
  }
  play(id: Sound, amount = 1, pan = 0) {
    const c = this.ctx
    if (!c || !this.bus || c.state !== 'running' || this.muted || amount < 0.012) return
    const t = c.currentTime
    const out = c.createStereoPanner()
    out.pan.value = Math.max(-1, Math.min(1, pan))
    out.connect(this.bus)
    let sources = 0
    const envelope = (
      source: AudioScheduledSourceNode,
      node: AudioNode,
      duration: number,
      gain: number,
      delay: number,
      attack = 0.002
    ) => {
      const g = c.createGain(),
        start = t + delay
      g.gain.setValueAtTime(0.0001, start)
      g.gain.exponentialRampToValueAtTime(Math.max(0.001, gain * amount), start + attack)
      g.gain.exponentialRampToValueAtTime(0.00015, start + duration)
      node.connect(g)
      g.connect(out)
      source.start(start)
      source.stop(start + duration + 0.01)
      sources++
      source.onended = () => {
        source.disconnect()
        node.disconnect()
        g.disconnect()
        if (!--sources) out.disconnect()
      }
    }
    const tone = (
      f: number,
      end: number,
      d: number,
      g: number,
      delay = 0,
      type: OscillatorType = 'sine'
    ) => {
      const o = c.createOscillator()
      o.type = type
      o.frequency.setValueAtTime(f, t + delay)
      o.frequency.exponentialRampToValueAtTime(Math.max(12, end), t + delay + d)
      envelope(o, o, d, g, delay)
    }
    const noise = (
      freq: number,
      d: number,
      g: number,
      delay = 0,
      type: BiquadFilterType = 'lowpass'
    ) => {
      const s = c.createBufferSource(),
        f = c.createBiquadFilter()
      s.buffer = this.noise
      f.type = type
      f.frequency.setValueAtTime(freq, t + delay)
      f.frequency.exponentialRampToValueAtTime(Math.max(90, freq * 0.22), t + delay + d)
      s.connect(f)
      envelope(s, f, d, g, delay)
    }
    switch (id) {
      case 'ak':
        noise(4300, 0.16, 0.7)
        tone(149, 44, 0.18, 0.54)
        noise(1700, 0.065, 0.15, 0.052)
        break
      case 'm4':
        noise(5100, 0.103, 0.52)
        tone(192, 65, 0.105, 0.37)
        noise(5800, 0.04, 0.12, 0.035)
        break
      case 'awp':
        noise(2600, 0.42, 0.86)
        tone(117, 27, 0.51, 0.81)
        noise(1300, 0.32, 0.23, 0.12)
        break
      case 'glock':
        noise(3950, 0.085, 0.39)
        tone(230, 83, 0.093, 0.32)
        break
      case 'usp':
        noise(1420, 0.079, 0.32)
        tone(330, 101, 0.071, 0.24)
        break
      case 'deagle':
        noise(3370, 0.18, 0.57)
        tone(162, 42, 0.24, 0.57)
        break
      case 'knife':
        noise(3300, 0.14, 0.36, 0, 'bandpass')
        break
      case 'reload':
        noise(6200, 0.075, 0.32)
        noise(2500, 0.11, 0.28, 0.3)
        tone(620, 170, 0.055, 0.12, 0.44, 'triangle')
        break
      case 'step':
        noise(860, 0.11, 0.25)
        tone(86, 34, 0.085, 0.15)
        break
      case 'scope':
        noise(4500, 0.051, 0.26)
        tone(730, 390, 0.048, 0.08)
        break
      case 'hit':
        tone(1240, 880, 0.046, 0.22, 0, 'triangle')
        break
      case 'kill':
        tone(860, 860, 0.09, 0.19)
        tone(1280, 1280, 0.15, 0.19, 0.065)
        break
      case 'plant':
        tone(790, 790, 0.11, 0.24)
        tone(1160, 1160, 0.16, 0.21, 0.15)
        noise(1200, 0.12, 0.17)
        break
      case 'defuse':
        tone(1000, 680, 0.19, 0.26)
        tone(660, 420, 0.25, 0.22, 0.16)
        break
      case 'explode':
        noise(2800, 1.25, 0.9)
        tone(93, 18, 1.05, 0.95)
        noise(1000, 0.82, 0.35, 0.12)
        break
      case 'beep':
        tone(1280, 1280, 0.09, 0.23)
        break
      case 'win':
        tone(400, 400, 0.18, 0.17)
        tone(600, 600, 0.26, 0.2, 0.16)
        break
      case 'drop':
        noise(800, 0.13, 0.24)
        break
      case 'equip':
        noise(2200, 0.07, 0.21)
        break
    }
  }
  dispose() {
    if (this.ctx) void this.ctx.close()
    this.ctx = null
  }
}

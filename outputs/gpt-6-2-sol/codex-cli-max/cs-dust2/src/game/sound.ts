import type { WeaponId } from './arsenal'
import { clamp, type Vec } from './level'
import type { SoundCue } from './match'

interface Listener { position: Vec; yaw: number }

export class Sound {
  private context: AudioContext | null = null
  private output: GainNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  muted = false

  unlock() {
    if (!this.context) {
      if (typeof AudioContext === 'undefined') return
      this.context = new AudioContext()
      this.output = this.context.createGain()
      this.output.gain.value = 0.52
      const limiter = this.context.createDynamicsCompressor()
      limiter.threshold.value = -14
      limiter.ratio.value = 7
      this.output.connect(limiter)
      limiter.connect(this.context.destination)
      const count = this.context.sampleRate * 2
      this.noiseBuffer = this.context.createBuffer(1, count, this.context.sampleRate)
      const samples = this.noiseBuffer.getChannelData(0)
      for (let i = 0; i < count; i++) samples[i] = Math.random() * 2 - 1
    }
    if (this.context.state !== 'running') void this.context.resume().catch(() => {})
  }

  private channel(listener: Listener, position?: Vec, reach = 34) {
    const context = this.context
    if (this.muted || !context || context.state !== 'running' || !this.output) return null
    const dx = position ? position.x - listener.position.x : 0
    const dz = position ? position.z - listener.position.z : 0
    const distance = Math.hypot(dx, dz)
    if (distance > reach) return null
    const gain = context.createGain()
    gain.gain.value = position ? 1 / (1 + (distance / (reach * 0.30)) ** 2) : 1
    const spatial = context.createStereoPanner()
    spatial.pan.value = clamp((dx * Math.cos(listener.yaw) - dz * Math.sin(listener.yaw)) / Math.max(4, distance) * 0.82, -1, 1)
    gain.connect(spatial)
    spatial.connect(this.output)
    window.setTimeout(() => {
      gain.disconnect()
      spatial.disconnect()
    }, 1450)
    return gain
  }

  private noise(to: AudioNode, duration: number, volume: number, cutoff: number, filterType: BiquadFilterType, delay = 0, resonance = 0.55) {
    const ctx = this.context!
    const start = ctx.currentTime + delay
    const noise = ctx.createBufferSource()
    noise.buffer = this.noiseBuffer
    const filter = ctx.createBiquadFilter()
    filter.type = filterType
    filter.frequency.value = cutoff
    filter.Q.value = resonance
    const amp = ctx.createGain()
    amp.gain.setValueAtTime(0.0001, start)
    amp.gain.exponentialRampToValueAtTime(volume, start + 0.004)
    amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    noise.connect(filter)
    filter.connect(amp)
    amp.connect(to)
    noise.start(start, Math.random() * 0.65, duration + 0.007)
  }

  private tone(to: AudioNode, startHz: number, endHz: number, duration: number, volume: number, type: OscillatorType = 'sine', delay = 0) {
    const ctx = this.context!
    const start = ctx.currentTime + delay
    const oscillator = ctx.createOscillator()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(startHz, start)
    oscillator.frequency.exponentialRampToValueAtTime(endHz, start + duration)
    const amp = ctx.createGain()
    amp.gain.setValueAtTime(0.0001, start)
    amp.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.016, duration / 4))
    amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(amp)
    amp.connect(to)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.009)
  }

  shot(weapon: WeaponId, listener: Listener, position?: Vec) {
    if (weapon === 'knife') return
    const out = this.channel(listener, position, weapon === 'awp' ? 75 : 55)
    if (!out) return
    const large = weapon === 'awp'
    const ak = weapon === 'ak'
    const m4 = weapon === 'm4'
    const heavy = weapon === 'deagle'
    const suppressed = weapon === 'usp'
    const base = large ? 92 : ak ? 132 : m4 ? 184 : heavy ? 155 : 236
    this.tone(out, base, base * 0.28, large ? 0.29 : ak ? 0.14 : 0.095, large ? 0.74 : ak ? 0.55 : suppressed ? 0.17 : 0.41, 'triangle')
    this.noise(out, large ? 0.45 : ak ? 0.26 : m4 ? 0.18 : 0.138, large ? 0.93 : suppressed ? 0.31 : 0.72, large ? 960 : m4 ? 2280 : suppressed ? 890 : 1550, 'lowpass')
    this.noise(out, large ? 0.115 : 0.069, suppressed ? 0.12 : 0.38, heavy ? 2480 : m4 ? 4350 : 3570, 'bandpass')
    if (large || ak) this.noise(out, large ? 0.56 : 0.24, large ? 0.39 : 0.12, 610, 'lowpass', 0.068)
    if (large) this.noise(out, 0.105, 0.21, 2930, 'bandpass', 0.44, 2)
  }

  cue(cue: SoundCue, listener: Listener, position?: Vec) {
    const reach = cue === 'step' ? 16 : cue === 'beep' ? 38 : 22
    const out = this.channel(listener, position, reach)
    if (!out) return
    switch (cue) {
      case 'step':
        this.noise(out, 0.122, 0.23, 490 + Math.random() * 185, 'lowpass')
        this.noise(out, 0.062, 0.105, 1450, 'bandpass', 0.008)
        break
      case 'reload':
        this.noise(out, 0.12, 0.32, 1720, 'bandpass', 0, 1.4)
        this.noise(out, 0.1, 0.29, 2310, 'bandpass', 0.28, 1.5)
        this.tone(out, 326, 125, 0.11, 0.15, 'triangle', 0.44)
        this.noise(out, 0.141, 0.36, 1130, 'bandpass', 0.54, 1.6)
        break
      case 'ready':
        this.noise(out, 0.086, 0.195, 1320, 'bandpass', 0, 1.7)
        this.noise(out, 0.06, 0.18, 2610, 'bandpass', 0.06)
        break
      case 'scope':
        this.tone(out, 960, 460, 0.095, 0.145, 'triangle')
        this.noise(out, 0.09, 0.20, 2450, 'bandpass', 0.017, 1.5)
        break
      case 'hit':
        this.noise(out, 0.087, 0.22, 940, 'bandpass')
        this.tone(out, 1140, 830, 0.085, 0.20, 'sine')
        break
      case 'kill':
        this.tone(out, 520, 526, 0.12, 0.22, 'triangle')
        this.tone(out, 782, 796, 0.17, 0.2, 'triangle', 0.058)
        break
      case 'dry':
        this.noise(out, 0.056, 0.24, 2550, 'bandpass', 0, 2.6)
        break
      case 'pickup':
        this.tone(out, 475, 670, 0.16, 0.125, 'triangle')
        this.noise(out, 0.09, 0.15, 1120, 'bandpass')
        break
      case 'plant':
        this.tone(out, 480, 480, 0.14, 0.23, 'triangle')
        this.tone(out, 720, 720, 0.17, 0.23, 'triangle', 0.11)
        this.tone(out, 960, 910, 0.25, 0.23, 'triangle', 0.25)
        break
      case 'defuse':
        this.tone(out, 810, 735, 0.13, 0.21, 'triangle')
        this.tone(out, 606, 550, 0.18, 0.23, 'triangle', 0.115)
        this.tone(out, 510, 510, 0.31, 0.2, 'sine', 0.23)
        break
      case 'arming':
      case 'disarming':
        this.noise(out, 0.12, 0.28, 1580, 'bandpass')
        this.tone(out, cue === 'arming' ? 681 : 455, 713, 0.12, 0.15, 'square', 0.059)
        break
      case 'beep':
        this.tone(out, 1310, 1275, 0.117, 0.22, 'sine')
        this.tone(out, 2180, 1860, 0.075, 0.11, 'triangle')
        break
      case 'round':
        this.tone(out, 344, 344, 0.18, 0.15, 'triangle')
        this.tone(out, 500, 500, 0.23, 0.18, 'sine', 0.095)
        break
      case 'knife':
        this.noise(out, 0.16, 0.29, 1810, 'bandpass')
        break
    }
  }

  explode(listener: Listener, position: Vec) {
    const out = this.channel(listener, position, 110)
    if (!out) return
    this.noise(out, 0.96, 1.15, 1110, 'lowpass')
    this.noise(out, 0.78, 0.62, 419, 'bandpass', 0.085)
    this.tone(out, 104, 28, 1.03, 0.76, 'triangle')
    this.noise(out, 0.63, 0.46, 380, 'lowpass', 0.22)
  }

  dispose() {
    if (this.context) void this.context.close().catch(() => {})
  }
}

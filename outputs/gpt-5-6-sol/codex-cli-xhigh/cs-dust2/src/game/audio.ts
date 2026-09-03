import type { WeaponSpec } from './types'

export class GameAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null

  unlock() {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.master = this.ctx.createGain()
      this.master.gain.value = .2
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
  }

  private tone(freq: number, duration: number, type: OscillatorType = 'square', volume = .2, slide = 0) {
    if (!this.ctx || !this.master) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(Math.max(25, freq + slide), t + duration)
    gain.gain.setValueAtTime(volume, t)
    gain.gain.exponentialRampToValueAtTime(.001, t + duration)
    osc.connect(gain).connect(this.master)
    osc.start(t)
    osc.stop(t + duration)
  }

  private noise(duration: number, volume: number, cutoff: number) {
    if (!this.ctx || !this.master) return
    const length = Math.max(1, this.ctx.sampleRate * duration)
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
    const src = this.ctx.createBufferSource()
    const filter = this.ctx.createBiquadFilter()
    const gain = this.ctx.createGain()
    filter.type = 'lowpass'; filter.frequency.value = cutoff
    gain.gain.value = volume
    src.buffer = buffer
    src.connect(filter).connect(gain).connect(this.master)
    src.start()
  }

  shot(w: WeaponSpec) {
    const cfg = {
      ak: [105, .18, .56, 2100], m4: [145, .13, .4, 2600], awp: [62, .42, .9, 1400],
      pistol: [220, .09, .26, 3400], deagle: [90, .23, .63, 1900], knife: [620, .08, .12, 5000],
    }[w.sound] as number[]
    this.noise(cfg[1], cfg[2], cfg[3]); this.tone(cfg[0], cfg[1], 'sawtooth', cfg[2] * .35, -cfg[0] * .55)
  }

  reload() { this.tone(880, .045, 'square', .13, -260); setTimeout(() => this.tone(520, .08, 'triangle', .16, 320), 520) }
  step() { this.noise(.055, .08, 620); this.tone(75, .04, 'sine', .07, -20) }
  scope() { this.tone(1260, .045, 'triangle', .14, -460) }
  hit() { this.tone(920, .055, 'sine', .12, 380) }
  kill() { this.tone(330, .08, 'square', .16, 280); setTimeout(() => this.tone(720, .11, 'sine', .14, 300), 80) }
  plant() { this.tone(980, .09, 'square', .13, -200) }
  beep(fast = false) { this.tone(fast ? 1480 : 1080, .055, 'square', .11, 20) }
  defuse() { this.tone(520, .2, 'sine', .17, 640) }
  explode() { this.noise(1.1, 1, 720); this.tone(48, 1.25, 'sawtooth', .8, -20) }
}

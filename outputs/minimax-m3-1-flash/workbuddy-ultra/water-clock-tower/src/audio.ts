// Procedural audio for the clock tower: a soft pentatonic bed, the hiss of the
// water jet, gear clicks, the pendulum tick and the bell. Nothing is loaded
// from disk; every voice is synthesised with the Web Audio API.

type Ctx = AudioContext

export class TowerAudio {
  ctx: Ctx | null = null
  master: GainNode | null = null
  private noiseBuf: AudioBuffer | null = null
  private flowGain: GainNode | null = null
  private musicTimer = 0
  private step = 0

  init() {
    if (this.ctx) return
    const AC = window.AudioContext || (window as any).webkitAudioContext
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.42
    this.master.connect(this.ctx.destination)
    const len = this.ctx.sampleRate * 2
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    this.noiseBuf = buf
    // continuous water hiss whose level is driven from the simulation
    const src = this.ctx.createBufferSource()
    src.buffer = buf
    src.loop = true
    const f = this.ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 1500
    f.Q.value = 0.7
    const g = this.ctx.createGain()
    g.gain.value = 0
    src.connect(f); f.connect(g); g.connect(this.master)
    src.start()
    this.flowGain = g
  }

  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume() }

  setFlow(level: number) {
    if (!this.flowGain || !this.ctx) return
    const t = this.ctx.currentTime
    this.flowGain.gain.setTargetAtTime(Math.max(0, Math.min(0.12, level * 0.12)), t, 0.15)
  }

  private tone(freq: number, dur: number, gain: number, type: OscillatorType = 'sine') {
    if (!this.ctx || !this.master) return
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    const t = this.ctx.currentTime
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(gain, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g); g.connect(this.master)
    o.start(t); o.stop(t + dur + 0.05)
  }

  private click(gain = 0.1, freq = 2400) {
    if (!this.ctx || !this.noiseBuf || !this.master) return
    const s = this.ctx.createBufferSource()
    s.buffer = this.noiseBuf
    const f = this.ctx.createBiquadFilter()
    f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 3
    const g = this.ctx.createGain()
    const t = this.ctx.currentTime
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    s.connect(f); f.connect(g); g.connect(this.master)
    s.start(t); s.stop(t + 0.08)
  }

  /** escapement release click */
  tick() { this.click(0.075, 2600) }

  /** pendulum passing centre */
  pendulum() { this.click(0.035, 1100) }

  /** the bell: a struck metal tone with a long tail */
  bell() {
    if (!this.ctx) return
    ;[1, 2.02, 2.98, 4.1, 5.4].forEach((m, i) => {
      setTimeout(() => this.tone(196 * m, 3.4 - i * 0.35, 0.11 / (i + 1), 'sine'), i * 8)
    })
  }

  /** gentle pentatonic music bed; called every frame with the elapsed time */
  music(dt: number) {
    this.musicTimer -= dt
    if (this.musicTimer > 0) return
    this.musicTimer = 0.62
    const scale = [0, 2, 4, 7, 9, 12, 9, 7]
    const root = 196
    const n = scale[this.step % scale.length]
    const oct = this.step % 8 < 4 ? 1 : 2
    this.tone(root * oct * Math.pow(2, n / 12), 1.5, 0.045, 'triangle')
    if (this.step % 4 === 0) this.tone(root * oct / 2, 2.6, 0.035, 'sine')
    this.step++
  }
}

export const towerAudio = new TowerAudio()

// Every sound in the game is synthesised at runtime with the Web Audio API —
// no audio files anywhere.

type Ctx = AudioContext

export class AudioEngine {
  ctx: Ctx | null = null
  master: GainNode | null = null
  private noiseBuf: AudioBuffer | null = null
  private lastStep = 0

  init() {
    if (this.ctx) return
    const AC = window.AudioContext || (window as any).webkitAudioContext
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.45
    this.master.connect(this.ctx.destination)
    // 2 seconds of white noise, reused by every noise-based voice
    const len = this.ctx.sampleRate * 2
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    this.noiseBuf = buf
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume()
  }

  private noise(dur: number, gain: number, filterType: BiquadFilterType, freq: number, q = 1) {
    if (!this.ctx || !this.noiseBuf) return null
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuf
    src.loop = true
    const f = this.ctx.createBiquadFilter()
    f.type = filterType
    f.frequency.value = freq
    f.Q.value = q
    const g = this.ctx.createGain()
    const t = this.ctx.currentTime
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f); f.connect(g); g.connect(this.master!)
    src.start(t)
    src.stop(t + dur + 0.02)
    return { src, f, g }
  }

  private tone(freq: number, dur: number, gain: number, type: OscillatorType = 'sine', slideTo?: number) {
    if (!this.ctx) return
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    const t = this.ctx.currentTime
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g); g.connect(this.master!)
    o.start(t)
    o.stop(t + dur + 0.02)
  }

  shot(kind: string, distance = 0) {
    if (!this.ctx) return
    const att = Math.max(0.08, 1 - distance / 70)
    switch (kind) {
      case 'ak':
        this.noise(0.16, 0.55 * att, 'bandpass', 1700, 0.8)
        this.tone(150, 0.10, 0.42 * att, 'square', 60)
        break
      case 'm4':
        this.noise(0.11, 0.45 * att, 'bandpass', 2600, 1.2)
        this.tone(220, 0.07, 0.30 * att, 'square', 90)
        break
      case 'awp':
        this.noise(0.34, 0.75 * att, 'lowpass', 1200, 0.7)
        this.tone(90, 0.26, 0.55 * att, 'sawtooth', 38)
        break
      case 'deagle':
        this.noise(0.2, 0.62 * att, 'bandpass', 1400, 0.9)
        this.tone(120, 0.16, 0.5 * att, 'square', 45)
        break
      case 'pistol':
        this.noise(0.09, 0.38 * att, 'bandpass', 2200, 1.1)
        this.tone(320, 0.05, 0.22 * att, 'square', 140)
        break
      case 'knife':
        this.noise(0.09, 0.22 * att, 'highpass', 3800, 0.8)
        break
    }
  }

  reload() {
    this.noise(0.05, 0.3, 'highpass', 2600, 1)
    setTimeout(() => this.noise(0.06, 0.26, 'highpass', 1600, 1), 160)
    setTimeout(() => this.noise(0.05, 0.34, 'highpass', 3000, 1), 330)
  }

  emptyClick() {
    this.noise(0.035, 0.22, 'highpass', 4200, 1)
  }

  step() {
    const now = performance.now()
    if (now - this.lastStep < 320) return
    this.lastStep = now
    this.noise(0.07, 0.14, 'lowpass', 900, 0.7)
  }

  scope(on: boolean) {
    if (on) this.noise(0.12, 0.18, 'bandpass', 900, 3)
    else this.noise(0.08, 0.12, 'bandpass', 1400, 3)
  }

  hit(headshot: boolean) {
    this.tone(headshot ? 1500 : 900, 0.07, 0.3, 'triangle', headshot ? 400 : 300)
    this.noise(0.05, 0.22, 'bandpass', headshot ? 3200 : 2000, 1.4)
  }

  kill() {
    this.tone(660, 0.09, 0.26, 'square')
    setTimeout(() => this.tone(990, 0.13, 0.24, 'square'), 90)
  }

  plant() {
    this.tone(520, 0.1, 0.22, 'square')
    setTimeout(() => this.tone(700, 0.16, 0.22, 'square'), 110)
  }

  defuse() {
    this.tone(400, 0.12, 0.2, 'sine')
    setTimeout(() => this.tone(300, 0.2, 0.2, 'sine'), 130)
  }

  explode() {
    this.noise(1.1, 0.85, 'lowpass', 420, 0.6)
    this.tone(70, 0.9, 0.6, 'sawtooth', 28)
  }

  beep(high: boolean) {
    this.tone(high ? 880 : 560, 0.07, 0.2, 'square')
  }

  roundWin(won: boolean) {
    const notes = won ? [523, 659, 784, 1047] : [392, 349, 294]
    notes.forEach((n, i) => setTimeout(() => this.tone(n, 0.26, 0.24, 'triangle'), i * 130))
  }
}

export const audio = new AudioEngine()

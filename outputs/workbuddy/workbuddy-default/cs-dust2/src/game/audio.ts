// Procedural sound effects via Web Audio API — no external audio files.
export class AudioKit {
  private ctx: AudioContext | null = null
  private noiseBuf: AudioBuffer | null = null
  private master: GainNode | null = null

  init() {
    if (this.ctx) { void this.ctx.resume(); return }
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new Ctor()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.35
    this.master.connect(this.ctx.destination)
    // pre-build a 1s white-noise buffer
    const len = this.ctx.sampleRate
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    this.noiseBuf = buf
  }

  private env(node: AudioNode, gain: GainNode, t0: number, peak: number, dur: number) {
    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(peak, t0 + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    node.connect(gain)
    gain.connect(this.master!)
  }

  private noise(dur: number, filterFreq: number, q: number, gain: number) {
    if (!this.ctx || !this.noiseBuf) return
    const t0 = this.ctx.currentTime
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuf
    const f = this.ctx.createBiquadFilter()
    f.type = 'bandpass'; f.frequency.value = filterFreq; f.Q.value = q
    const g = this.ctx.createGain()
    src.connect(f)
    this.env(f, g, t0, gain, dur)
    src.start(t0); src.stop(t0 + dur + 0.02)
  }

  private tone(freq: number, dur: number, type: OscillatorType, gain: number) {
    if (!this.ctx) return
    const t0 = this.ctx.currentTime
    const o = this.ctx.createOscillator()
    o.type = type; o.frequency.value = freq
    const g = this.ctx.createGain()
    this.env(o, g, t0, gain, dur)
    o.start(t0); o.stop(t0 + dur + 0.02)
  }

  shot(weapon: string) {
    switch (weapon) {
      case 'AWP': this.noise(0.5, 420, 0.8, 0.9); this.tone(90, 0.25, 'sine', 0.6); break
      case 'AK-47': this.noise(0.16, 1800, 1.1, 0.8); this.tone(120, 0.08, 'square', 0.4); break
      case 'M4A4': this.noise(0.1, 2400, 1.3, 0.7); this.tone(150, 0.06, 'square', 0.3); break
      case 'Glock': case 'USP': this.noise(0.08, 2600, 1.4, 0.55); break
      case 'Deagle': this.noise(0.18, 1500, 1.0, 0.8); this.tone(110, 0.1, 'square', 0.4); break
      case 'Knife': this.tone(2200, 0.04, 'triangle', 0.4); break
      default: this.noise(0.12, 2000, 1.2, 0.6)
    }
  }
  reload() { this.tone(900, 0.05, 'square', 0.3); setTimeout(() => this.tone(700, 0.05, 'square', 0.3), 180) }
  step() { this.tone(70, 0.06, 'sine', 0.18) }
  hit() { this.tone(1600, 0.05, 'triangle', 0.4) }
  scope() { this.tone(1200, 0.03, 'square', 0.25) }
  explosion() { this.noise(1.2, 200, 0.6, 1.0); this.tone(50, 0.8, 'sine', 0.8) }
}

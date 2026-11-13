// Every sound in the film is synthesised at runtime with the Web Audio API.
// Acoustic rule respected throughout: inside the hull sounds reverberate; in
// vacuum no sound propagates, so the shot is only a suit-conducted thump plus a
// subjective low-frequency rumble.

type Ctx = AudioContext

export class FilmAudio {
  ctx: Ctx | null = null
  master: GainNode | null = null
  private noiseBuf: AudioBuffer | null = null
  private convolver: ConvolverNode | null = null

  init() {
    if (this.ctx) return
    const AC = window.AudioContext || (window as any).webkitAudioContext
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.5
    this.master.connect(this.ctx.destination)
    const len = this.ctx.sampleRate * 2
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    this.noiseBuf = buf
    // small synthetic room impulse for the interior reverb
    const ir = this.ctx.createBuffer(2, this.ctx.sampleRate * 1.6, this.ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const ch = ir.getChannelData(c)
      for (let i = 0; i < ch.length; i++) {
        const t = i / ch.length
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.6) * 0.6
      }
    }
    this.convolver = this.ctx.createConvolver()
    this.convolver.buffer = ir
  }

  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume() }

  private noise(dur: number, gain: number, type: BiquadFilterType, freq: number, q = 1, wet = 0) {
    if (!this.ctx || !this.noiseBuf) return
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuf
    src.loop = true
    const f = this.ctx.createBiquadFilter()
    f.type = type
    f.frequency.value = freq
    f.Q.value = q
    const g = this.ctx.createGain()
    const t = this.ctx.currentTime
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f); f.connect(g)
    g.connect(this.master!)
    if (wet > 0 && this.convolver) {
      const w = this.ctx.createGain()
      w.gain.value = wet
      g.connect(w); w.connect(this.convolver); this.convolver.connect(this.master!)
    }
    src.start(t); src.stop(t + dur + 0.02)
  }

  private tone(freq: number, dur: number, gain: number, type: OscillatorType = 'sine', slideTo?: number, wet = 0) {
    if (!this.ctx) return
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    const t = this.ctx.currentTime
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur)
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g); g.connect(this.master!)
    if (wet > 0 && this.convolver) {
      const w = this.ctx.createGain()
      w.gain.value = wet
      g.connect(w); w.connect(this.convolver); this.convolver.connect(this.master!)
    }
    o.start(t); o.stop(t + dur + 0.02)
  }

  /** metal machining: a drill that spools up and bites */
  machining(dur = 1.8) {
    this.tone(140, dur, 0.14, 'sawtooth', 260)
    this.noise(dur, 0.16, 'bandpass', 2200, 2.2)
  }

  /** servo / airlock door motor */
  servo(dur = 2.4) {
    this.tone(90, dur, 0.16, 'square', 150)
    this.noise(dur, 0.07, 'bandpass', 900, 3)
  }

  /** pressurised gunshot: sharp crack plus a long indoor tail */
  gunshotIndoor() {
    this.noise(0.16, 0.6, 'bandpass', 1500, 0.9, 0.9)
    this.tone(120, 0.14, 0.42, 'square', 48, 0.8)
  }

  /** the shot in vacuum: nothing propagates, only the suit thump and a body-borne rumble */
  shotInVacuum() {
    this.tone(42, 0.7, 0.5, 'sine', 26)
    this.tone(78, 0.45, 0.28, 'triangle', 34)
    this.noise(0.5, 0.1, 'lowpass', 180, 0.8)
  }

  /** suit breathing */
  breath(dur = 2.2) {
    this.noise(dur, 0.09, 'bandpass', 620, 1.1)
  }

  /** radio squelch and tone */
  radio(dur = 0.9) {
    this.noise(dur, 0.07, 'bandpass', 1800, 1.6)
    this.tone(760, 0.16, 0.1, 'square')
    this.tone(560, 0.2, 0.08, 'square')
  }

  /** thruster plume */
  thruster(dur = 3.4) {
    this.noise(dur, 0.16, 'lowpass', 420, 0.7)
    this.tone(70, dur, 0.12, 'sawtooth', 110)
  }

  /** depressurisation hiss */
  depressurize(dur = 4.5) {
    this.noise(dur, 0.2, 'highpass', 2600, 0.8)
    this.tone(320, dur, 0.07, 'sine', 180)
  }

  /** station alarm */
  alarm(dur = 2.2) {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.tone(880, 0.34, 0.16, 'square'), i * 420)
      setTimeout(() => this.tone(660, 0.34, 0.16, 'square'), i * 420 + 200)
    }
    void dur
  }

  /** hull impact / metal clang */
  impact(gain = 0.4) {
    this.tone(180, 0.3, gain, 'triangle', 70)
    this.noise(0.22, gain * 0.6, 'bandpass', 1200, 1.4)
  }

  /** low drone used under the vacuum section */
  rumble(dur = 8) {
    this.tone(28, dur, 0.16, 'sine', 22)
    this.tone(41, dur, 0.08, 'triangle', 33)
  }

  /** soft piano-ish tone for the epilogue */
  chord(root = 196) {
    ;[1, 1.25, 1.5, 2].forEach((m, i) => setTimeout(() => this.tone(root * m, 3.2, 0.08, 'triangle'), i * 120))
  }
}

export const filmAudio = new FilmAudio()

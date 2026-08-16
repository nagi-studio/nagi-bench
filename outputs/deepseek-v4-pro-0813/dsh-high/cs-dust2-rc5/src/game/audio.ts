// Procedural sound synthesis with the Web Audio API — no external assets.

export type GunSound = 'rifle_ak' | 'rifle_m4' | 'awp' | 'pistol' | 'deagle' | 'melee'

export class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null
  private _muted = false

  /** Must be called from a user gesture (pointer click) to satisfy autoplay. */
  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.6
    this.master.connect(this.ctx.destination)

    const len = this.ctx.sampleRate * 1.5
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const data = this.noise.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  }

  get muted() {
    return this._muted
  }

  toggleMute() {
    this._muted = !this._muted
    if (this.master) this.master.gain.value = this._muted ? 0 : 0.6
    return this._muted
  }

  private now(): number {
    return this.ctx ? this.ctx.currentTime : 0
  }

  private noiseBurst(opts: {
    dur: number
    vol: number
    type: BiquadFilterType
    freq: number
    q?: number
    when?: number
  }) {
    if (!this.ctx || !this.noise || !this.master) return
    const t = opts.when ?? this.now()
    const src = this.ctx.createBufferSource()
    src.buffer = this.noise
    const filter = this.ctx.createBiquadFilter()
    filter.type = opts.type
    filter.frequency.value = opts.freq
    filter.Q.value = opts.q ?? 1
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(opts.vol, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur)
    src.connect(filter).connect(g).connect(this.master)
    src.start(t)
    src.stop(t + opts.dur + 0.02)
  }

  private tone(opts: {
    freq: number
    endFreq?: number
    dur: number
    vol: number
    type?: OscillatorType
    when?: number
  }) {
    if (!this.ctx || !this.master) return
    const t = opts.when ?? this.now()
    const osc = this.ctx.createOscillator()
    osc.type = opts.type ?? 'sine'
    osc.frequency.setValueAtTime(opts.freq, t)
    if (opts.endFreq) osc.frequency.exponentialRampToValueAtTime(opts.endFreq, t + opts.dur)
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(opts.vol, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur)
    osc.connect(g).connect(this.master)
    osc.start(t)
    osc.stop(t + opts.dur + 0.02)
  }

  playShoot(kind: GunSound) {
    if (!this.ctx) return
    switch (kind) {
      case 'rifle_ak':
        this.noiseBurst({ dur: 0.16, vol: 0.55, type: 'bandpass', freq: 1600, q: 0.8 })
        this.tone({ freq: 130, endFreq: 50, dur: 0.12, vol: 0.5, type: 'triangle' })
        break
      case 'rifle_m4':
        this.noiseBurst({ dur: 0.1, vol: 0.42, type: 'bandpass', freq: 2100, q: 0.9 })
        this.tone({ freq: 170, endFreq: 70, dur: 0.08, vol: 0.35, type: 'triangle' })
        break
      case 'awp':
        this.noiseBurst({ dur: 0.5, vol: 0.85, type: 'lowpass', freq: 700 })
        this.tone({ freq: 90, endFreq: 30, dur: 0.5, vol: 0.8, type: 'sawtooth' })
        break
      case 'pistol':
        this.noiseBurst({ dur: 0.07, vol: 0.32, type: 'bandpass', freq: 2600, q: 1 })
        this.tone({ freq: 220, endFreq: 100, dur: 0.05, vol: 0.25, type: 'triangle' })
        break
      case 'deagle':
        this.noiseBurst({ dur: 0.18, vol: 0.6, type: 'bandpass', freq: 1400, q: 0.8 })
        this.tone({ freq: 120, endFreq: 45, dur: 0.16, vol: 0.55, type: 'triangle' })
        break
      case 'melee':
        this.noiseBurst({ dur: 0.08, vol: 0.2, type: 'highpass', freq: 2500 })
        break
    }
  }

  playReload() {
    if (!this.ctx) return
    this.noiseBurst({ dur: 0.04, vol: 0.3, type: 'bandpass', freq: 1200, q: 2 })
    this.noiseBurst({ dur: 0.05, vol: 0.35, type: 'bandpass', freq: 900, q: 2, when: this.now() + 0.22 })
    this.noiseBurst({ dur: 0.04, vol: 0.3, type: 'bandpass', freq: 1500, q: 2, when: this.now() + 0.5 })
  }

  playFootstep() {
    this.noiseBurst({ dur: 0.06, vol: 0.12, type: 'lowpass', freq: 500 })
  }

  playScope() {
    this.noiseBurst({ dur: 0.05, vol: 0.25, type: 'bandpass', freq: 3000, q: 3 })
    this.tone({ freq: 800, dur: 0.04, vol: 0.12 })
  }

  playHit(headshot: boolean) {
    if (headshot) {
      this.tone({ freq: 1600, dur: 0.07, vol: 0.22, type: 'square' })
      this.tone({ freq: 2200, dur: 0.05, vol: 0.12, type: 'square', when: this.now() + 0.03 })
    } else {
      this.tone({ freq: 1000, dur: 0.05, vol: 0.18, type: 'square' })
    }
  }

  playKill() {
    if (!this.ctx) return
    const t = this.now()
    this.tone({ freq: 660, dur: 0.1, vol: 0.22, type: 'square', when: t })
    this.tone({ freq: 880, dur: 0.16, vol: 0.22, type: 'square', when: t + 0.1 })
  }

  playC4Beep() {
    this.tone({ freq: 1400, dur: 0.08, vol: 0.25, type: 'square' })
  }

  playC4Plant() {
    this.tone({ freq: 880, dur: 0.09, vol: 0.2, type: 'square' })
  }

  playC4Defuse() {
    this.tone({ freq: 1100, dur: 0.06, vol: 0.2, type: 'square' })
  }

  playExplode() {
    this.noiseBurst({ dur: 1.4, vol: 1.0, type: 'lowpass', freq: 400 })
    this.tone({ freq: 140, endFreq: 20, dur: 1.2, vol: 1.0, type: 'sawtooth' })
    this.tone({ freq: 60, endFreq: 18, dur: 1.5, vol: 0.9, type: 'sine' })
  }

  playDefuseWin() {
    const t = this.now()
    this.tone({ freq: 523, dur: 0.12, vol: 0.2, type: 'square', when: t })
    this.tone({ freq: 659, dur: 0.12, vol: 0.2, type: 'square', when: t + 0.12 })
    this.tone({ freq: 784, dur: 0.2, vol: 0.2, type: 'square', when: t + 0.24 })
  }
}

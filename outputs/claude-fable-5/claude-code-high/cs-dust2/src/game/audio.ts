import * as THREE from 'three'

type ShotSound = 'ak' | 'm4' | 'awp' | 'pistol' | 'glock' | 'deagle' | 'knife'

/**
 * All game audio is synthesized with the Web Audio API — no audio files.
 * World sounds are attenuated by distance and stereo-panned relative to the camera.
 */
export class AudioMan {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null
  private listenerPos = new THREE.Vector3()
  private listenerRight = new THREE.Vector3(1, 0, 0)

  resume() {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.5
      this.master.connect(this.ctx.destination)
      const len = this.ctx.sampleRate
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
      const data = this.noise.getChannelData(0)
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
  }

  setListener(pos: THREE.Vector3, right: THREE.Vector3) {
    this.listenerPos.copy(pos)
    this.listenerRight.copy(right)
  }

  private out(pos: THREE.Vector3 | null, gain: number): GainNode | null {
    if (!this.ctx || !this.master) return null
    const g = this.ctx.createGain()
    if (pos) {
      const d = pos.distanceTo(this.listenerPos)
      const att = 1 / (1 + d * 0.05)
      g.gain.value = gain * att
      const dir = new THREE.Vector3().subVectors(pos, this.listenerPos)
      const dl = dir.length()
      const pan = this.ctx.createStereoPanner()
      pan.pan.value = dl > 0.5 ? THREE.MathUtils.clamp(dir.dot(this.listenerRight) / dl, -0.85, 0.85) : 0
      g.connect(pan)
      pan.connect(this.master)
    } else {
      g.gain.value = gain
      g.connect(this.master)
    }
    return g
  }

  private playNoise(opts: {
    pos: THREE.Vector3 | null, gain: number, dur: number,
    filter?: BiquadFilterType, freq?: number, q?: number, freqEnd?: number,
    rate?: number, delay?: number,
  }) {
    if (!this.ctx || !this.noise) return
    const dst = this.out(opts.pos, 1)
    if (!dst) return
    const t0 = this.ctx.currentTime + (opts.delay ?? 0)
    const src = this.ctx.createBufferSource()
    src.buffer = this.noise
    src.loop = true
    src.playbackRate.value = opts.rate ?? 1
    const env = this.ctx.createGain()
    env.gain.setValueAtTime(opts.gain, t0)
    env.gain.exponentialRampToValueAtTime(0.001, t0 + opts.dur)
    let node: AudioNode = src
    if (opts.filter) {
      const f = this.ctx.createBiquadFilter()
      f.type = opts.filter
      f.frequency.setValueAtTime(opts.freq ?? 1000, t0)
      if (opts.freqEnd) f.frequency.exponentialRampToValueAtTime(opts.freqEnd, t0 + opts.dur)
      f.Q.value = opts.q ?? 1
      node.connect(f)
      node = f
    }
    node.connect(env)
    env.connect(dst)
    src.start(t0, Math.random() * 0.5)
    src.stop(t0 + opts.dur + 0.05)
  }

  private playTone(opts: {
    pos: THREE.Vector3 | null, gain: number, dur: number,
    freq: number, freqEnd?: number, type?: OscillatorType, delay?: number,
  }) {
    if (!this.ctx) return
    const dst = this.out(opts.pos, 1)
    if (!dst) return
    const t0 = this.ctx.currentTime + (opts.delay ?? 0)
    const osc = this.ctx.createOscillator()
    osc.type = opts.type ?? 'sine'
    osc.frequency.setValueAtTime(opts.freq, t0)
    if (opts.freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.freqEnd), t0 + opts.dur)
    const env = this.ctx.createGain()
    env.gain.setValueAtTime(opts.gain, t0)
    env.gain.exponentialRampToValueAtTime(0.001, t0 + opts.dur)
    osc.connect(env)
    env.connect(dst)
    osc.start(t0)
    osc.stop(t0 + opts.dur + 0.05)
  }

  shot(kind: ShotSound, pos: THREE.Vector3 | null) {
    const r = 0.94 + Math.random() * 0.12
    switch (kind) {
      case 'ak':
        this.playTone({ pos, gain: 0.55, dur: 0.1, freq: 165 * r, freqEnd: 85, type: 'square' })
        this.playNoise({ pos, gain: 0.5, dur: 0.11, filter: 'bandpass', freq: 1300, q: 0.7, rate: r })
        this.playNoise({ pos, gain: 0.3, dur: 0.025, filter: 'highpass', freq: 4800 })
        break
      case 'm4':
        this.playTone({ pos, gain: 0.4, dur: 0.06, freq: 210 * r, freqEnd: 120, type: 'square' })
        this.playNoise({ pos, gain: 0.42, dur: 0.07, filter: 'bandpass', freq: 2100, q: 0.8, rate: r })
        this.playNoise({ pos, gain: 0.24, dur: 0.02, filter: 'highpass', freq: 6000 })
        break
      case 'awp':
        this.playTone({ pos, gain: 0.9, dur: 0.35, freq: 92 * r, freqEnd: 42, type: 'sine' })
        this.playNoise({ pos, gain: 0.85, dur: 0.32, filter: 'lowpass', freq: 900, freqEnd: 160, rate: r })
        this.playNoise({ pos, gain: 0.45, dur: 0.05, filter: 'highpass', freq: 3000 })
        break
      case 'deagle':
        this.playTone({ pos, gain: 0.7, dur: 0.13, freq: 135 * r, freqEnd: 65, type: 'square' })
        this.playNoise({ pos, gain: 0.55, dur: 0.13, filter: 'bandpass', freq: 950, q: 0.7, rate: r })
        break
      case 'pistol':
        this.playTone({ pos, gain: 0.32, dur: 0.045, freq: 290 * r, freqEnd: 150, type: 'square' })
        this.playNoise({ pos, gain: 0.3, dur: 0.05, filter: 'bandpass', freq: 2400, q: 1, rate: r })
        break
      case 'glock':
        this.playTone({ pos, gain: 0.3, dur: 0.05, freq: 330 * r, freqEnd: 170, type: 'square' })
        this.playNoise({ pos, gain: 0.28, dur: 0.055, filter: 'bandpass', freq: 2800, q: 1, rate: r })
        break
      case 'knife':
        this.playNoise({ pos, gain: 0.18, dur: 0.12, filter: 'bandpass', freq: 1800, freqEnd: 600, q: 2 })
        break
    }
  }

  knifeHit(pos: THREE.Vector3 | null) {
    this.playNoise({ pos, gain: 0.35, dur: 0.08, filter: 'lowpass', freq: 700 })
    this.playTone({ pos, gain: 0.2, dur: 0.07, freq: 220, freqEnd: 90 })
  }

  reload(pos: THREE.Vector3 | null, duration: number) {
    const click = (delay: number, freq: number) => {
      this.playTone({ pos, gain: 0.18, dur: 0.03, freq, type: 'square', delay })
      this.playNoise({ pos, gain: 0.12, dur: 0.03, filter: 'highpass', freq: 2500, delay })
    }
    click(0.05, 700)
    click(duration * 0.45, 500)
    click(duration * 0.85, 900)
  }

  footstep(pos: THREE.Vector3 | null, vol: number) {
    this.playNoise({
      pos, gain: 0.16 * vol, dur: 0.055,
      filter: 'lowpass', freq: 420 + Math.random() * 160, rate: 0.8 + Math.random() * 0.3,
    })
  }

  scope(on: boolean) {
    this.playTone({ pos: null, gain: 0.12, dur: 0.05, freq: on ? 1400 : 900, freqEnd: on ? 1900 : 600, type: 'sine' })
  }

  drawWeapon() {
    this.playNoise({ pos: null, gain: 0.1, dur: 0.04, filter: 'highpass', freq: 2000 })
    this.playTone({ pos: null, gain: 0.08, dur: 0.03, freq: 600, type: 'square', delay: 0.03 })
  }

  hit(headshot: boolean) {
    if (headshot) {
      this.playTone({ pos: null, gain: 0.25, dur: 0.1, freq: 1700, freqEnd: 1400, type: 'triangle' })
      this.playTone({ pos: null, gain: 0.15, dur: 0.12, freq: 2550, freqEnd: 2100, type: 'sine', delay: 0.01 })
    } else {
      this.playTone({ pos: null, gain: 0.18, dur: 0.05, freq: 1150, freqEnd: 900, type: 'triangle' })
    }
  }

  kill() {
    this.playTone({ pos: null, gain: 0.2, dur: 0.07, freq: 880, type: 'sine' })
    this.playTone({ pos: null, gain: 0.2, dur: 0.1, freq: 1320, type: 'sine', delay: 0.07 })
  }

  death(pos: THREE.Vector3 | null) {
    this.playNoise({ pos, gain: 0.3, dur: 0.2, filter: 'lowpass', freq: 500, freqEnd: 120 })
  }

  damage() {
    this.playNoise({ pos: null, gain: 0.2, dur: 0.09, filter: 'lowpass', freq: 800 })
  }

  bombBeep(pos: THREE.Vector3 | null, urgent: boolean) {
    this.playTone({ pos, gain: urgent ? 0.3 : 0.22, dur: 0.07, freq: urgent ? 2900 : 2500, type: 'square' })
  }

  bombPlanted() {
    for (let i = 0; i < 3; i++) {
      this.playTone({ pos: null, gain: 0.16, dur: 0.06, freq: 2100, type: 'square', delay: i * 0.11 })
    }
  }

  plantTick(pos: THREE.Vector3 | null) {
    this.playTone({ pos, gain: 0.1, dur: 0.03, freq: 1600, type: 'square' })
  }

  defuseTick(pos: THREE.Vector3 | null) {
    this.playNoise({ pos, gain: 0.14, dur: 0.04, filter: 'highpass', freq: 3200 })
  }

  bombDefused() {
    this.playTone({ pos: null, gain: 0.22, dur: 0.12, freq: 900, type: 'sine' })
    this.playTone({ pos: null, gain: 0.22, dur: 0.2, freq: 1350, type: 'sine', delay: 0.12 })
  }

  explosion(pos: THREE.Vector3 | null) {
    this.playNoise({ pos, gain: 1.4, dur: 1.3, filter: 'lowpass', freq: 2800, freqEnd: 60 })
    this.playTone({ pos, gain: 1.0, dur: 1.1, freq: 55, freqEnd: 24, type: 'sine' })
    this.playNoise({ pos, gain: 0.5, dur: 0.4, filter: 'bandpass', freq: 500, q: 0.5, delay: 0.06 })
  }

  doorSlide(pos: THREE.Vector3 | null) {
    this.playNoise({ pos, gain: 0.16, dur: 0.35, filter: 'bandpass', freq: 300, freqEnd: 500, q: 2 })
  }

  roundStart() {
    this.playTone({ pos: null, gain: 0.18, dur: 0.1, freq: 660, type: 'sine' })
    this.playTone({ pos: null, gain: 0.18, dur: 0.16, freq: 990, type: 'sine', delay: 0.1 })
  }

  roundEnd(win: boolean) {
    if (win) {
      this.playTone({ pos: null, gain: 0.2, dur: 0.12, freq: 784, type: 'triangle' })
      this.playTone({ pos: null, gain: 0.2, dur: 0.12, freq: 988, type: 'triangle', delay: 0.12 })
      this.playTone({ pos: null, gain: 0.2, dur: 0.24, freq: 1319, type: 'triangle', delay: 0.24 })
    } else {
      this.playTone({ pos: null, gain: 0.2, dur: 0.16, freq: 494, type: 'triangle' })
      this.playTone({ pos: null, gain: 0.2, dur: 0.3, freq: 330, type: 'triangle', delay: 0.16 })
    }
  }
}

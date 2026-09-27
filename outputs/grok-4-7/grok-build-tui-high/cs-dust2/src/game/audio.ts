import type { WeaponId } from './weapons'

interface Spat {
  vol: number
  pan: number
}

export class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noiseBuf: AudioBuffer | null = null
  private listener = { x: 0, y: 0, z: 0 }
  private lastStep = new Map<string, number>()

  ensure(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return
    }
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const master = ctx.createGain()
    master.gain.value = 0.45
    master.connect(ctx.destination)
    const n = ctx.sampleRate * 2
    const buf = ctx.createBuffer(1, n, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1
    this.ctx = ctx
    this.master = master
    this.noiseBuf = buf
  }

  setListener(x: number, y: number, z: number): void {
    this.listener.x = x
    this.listener.y = y
    this.listener.z = z
  }

  private spat(x?: number, y?: number, z?: number): Spat {
    if (x === undefined || y === undefined || z === undefined) return { vol: 1, pan: 0 }
    const dx = x - this.listener.x
    const dy = y - this.listener.y
    const dz = z - this.listener.z
    const d = Math.hypot(dx, dy, dz)
    const vol = Math.min(1, 10 / (4 + d))
    const pan = Math.max(-1, Math.min(1, dx / 18))
    return { vol, pan }
  }

  private burst(o: {
    dur: number
    vol: number
    f0: number
    f1: number
    osc?: number
    osc2?: number
    pan?: number
    hp?: boolean
  }): void {
    if (!this.ctx || !this.master || !this.noiseBuf) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuf
    const filter = ctx.createBiquadFilter()
    filter.type = o.hp ? 'highpass' : 'lowpass'
    filter.frequency.setValueAtTime(Math.max(40, o.f0), t)
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, o.f1), t + o.dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(Math.max(0.0001, o.vol), t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur)
    const p = ctx.createStereoPanner()
    p.pan.value = o.pan ?? 0
    src.connect(filter)
    filter.connect(g)
    g.connect(p)
    p.connect(this.master)
    src.start(t)
    src.stop(t + o.dur + 0.02)
    if (o.osc) {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(o.osc, t)
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, o.osc2 ?? o.osc * 0.45), t + o.dur * 0.7)
      const og = ctx.createGain()
      og.gain.setValueAtTime(o.vol * 0.45, t)
      og.gain.exponentialRampToValueAtTime(0.0001, t + o.dur * 0.55)
      osc.connect(og)
      og.connect(p)
      osc.start(t)
      osc.stop(t + o.dur)
    }
  }

  private tone(freq: number, dur: number, vol: number, type: OscillatorType = 'sine', pan = 0): void {
    if (!this.ctx || !this.master) return
    const t = this.ctx.currentTime
    const o = this.ctx.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    const p = this.ctx.createStereoPanner()
    p.pan.value = pan
    o.connect(g)
    g.connect(p)
    p.connect(this.master)
    o.start(t)
    o.stop(t + dur + 0.02)
  }

  shoot(id: WeaponId, x?: number, y?: number, z?: number): void {
    this.ensure()
    const s = this.spat(x, y, z)
    const v = s.vol
    if (id === 'ak') this.burst({ dur: 0.14, vol: 0.62 * v, f0: 1500, f1: 160, osc: 115, osc2: 48, pan: s.pan })
    else if (id === 'm4') this.burst({ dur: 0.07, vol: 0.4 * v, f0: 2400, f1: 380, osc: 190, osc2: 80, pan: s.pan })
    else if (id === 'awp') {
      this.burst({ dur: 0.32, vol: 0.75 * v, f0: 700, f1: 45, osc: 68, osc2: 28, pan: s.pan })
      this.burst({ dur: 0.05, vol: 0.35 * v, f0: 3800, f1: 900, pan: s.pan, hp: true })
    } else if (id === 'glock') this.burst({ dur: 0.05, vol: 0.32 * v, f0: 3000, f1: 700, osc: 250, osc2: 120, pan: s.pan })
    else if (id === 'usp') this.burst({ dur: 0.045, vol: 0.28 * v, f0: 2500, f1: 520, osc: 210, osc2: 100, pan: s.pan })
    else if (id === 'deagle') this.burst({ dur: 0.18, vol: 0.55 * v, f0: 980, f1: 110, osc: 95, osc2: 36, pan: s.pan })
    else this.burst({ dur: 0.12, vol: 0.22 * v, f0: 1800, f1: 400, pan: s.pan, hp: true })
  }

  reload(x?: number, y?: number, z?: number): void {
    this.ensure()
    const s = this.spat(x, y, z)
    this.tone(180, 0.04, 0.12 * s.vol, 'square', s.pan)
    window.setTimeout(() => this.tone(140, 0.05, 0.1 * s.vol, 'square', s.pan), 280)
    window.setTimeout(() => this.tone(220, 0.04, 0.12 * s.vol, 'square', s.pan), 620)
  }

  dry(): void {
    this.ensure()
    this.tone(90, 0.04, 0.08, 'square')
  }

  step(id: string, x: number, y: number, z: number, quiet: boolean): void {
    this.ensure()
    const now = performance.now()
    const prev = this.lastStep.get(id) ?? 0
    if (now - prev < (quiet ? 560 : 380)) return
    this.lastStep.set(id, now)
    const s = this.spat(x, y, z)
    this.burst({ dur: 0.045, vol: (quiet ? 0.05 : 0.09) * s.vol, f0: 420, f1: 120, pan: s.pan })
  }

  scope(): void {
    this.ensure()
    this.tone(720, 0.05, 0.06, 'sine')
    this.tone(1280, 0.04, 0.04, 'sine')
  }

  hit(hs: boolean): void {
    this.ensure()
    if (hs) {
      this.tone(1900, 0.05, 0.1, 'square')
      this.tone(2600, 0.07, 0.08, 'square')
    } else {
      this.tone(1500, 0.04, 0.08, 'square')
    }
  }

  hurt(): void {
    this.ensure()
    this.tone(86, 0.14, 0.18, 'sine')
  }

  kill(): void {
    this.ensure()
    this.tone(523, 0.08, 0.09, 'square')
    this.tone(659, 0.1, 0.08, 'square')
    this.tone(784, 0.14, 0.07, 'square')
  }

  beep(freq: number, x: number, y: number, z: number, vol = 0.12): void {
    this.ensure()
    const s = this.spat(x, y, z)
    this.tone(freq, 0.07, vol * s.vol, 'square', s.pan)
  }

  explode(x: number, y: number, z: number): void {
    this.ensure()
    const s = this.spat(x, y, z)
    this.burst({ dur: 0.7, vol: 0.9 * s.vol, f0: 420, f1: 35, osc: 55, osc2: 22, pan: s.pan })
  }

  ui(ok: boolean): void {
    this.ensure()
    this.tone(ok ? 880 : 140, 0.06, 0.06, 'square')
  }

  win(): void {
    this.ensure()
    this.tone(392, 0.12, 0.08, 'triangle')
    window.setTimeout(() => this.tone(523, 0.16, 0.08, 'triangle'), 120)
    window.setTimeout(() => this.tone(659, 0.22, 0.08, 'triangle'), 240)
  }
}

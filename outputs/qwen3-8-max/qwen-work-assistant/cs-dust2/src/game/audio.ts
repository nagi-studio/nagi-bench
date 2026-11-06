/* ============================================================================
   Procedural audio — everything synthesised with the Web Audio API, no external
   samples. Distinct gun signatures per weapon, plus footsteps, reload, scope,
   hit feedback, C4 plant/defuse/explode and a kill sting.
   ========================================================================== */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuf: AudioBuffer | null = null

export function initAudio() {
  if (ctx) return ctx
  const AC = window.AudioContext || (window as any).webkitAudioContext
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.55
  master.connect(ctx.destination)
  // a shared white-noise buffer for percussion/explosions
  const len = Math.floor(ctx.sampleRate * 1.2)
  noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = noiseBuf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return ctx
}

export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') ctx.resume()
}

export function setMuted(m: boolean) {
  if (master) master.gain.value = m ? 0 : 0.55
}

function now() {
  return ctx ? ctx.currentTime : 0
}

// a short noise burst through a bandpass — the backbone of most gunshots
function noiseBurst(dur: number, gain: number, filterFreq: number, q = 1, type: BiquadFilterType = 'bandpass') {
  if (!ctx || !master || !noiseBuf) return
  const src = ctx.createBufferSource()
  src.buffer = noiseBuf
  const filt = ctx.createBiquadFilter()
  filt.type = type
  filt.frequency.value = filterFreq
  filt.Q.value = q
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, now())
  g.gain.exponentialRampToValueAtTime(0.0001, now() + dur)
  src.connect(filt)
  filt.connect(g)
  g.connect(master)
  src.start()
  src.stop(now() + dur + 0.02)
}

// a tonal blip (for reload clicks, UI, scope)
function tone(freq: number, dur: number, gain: number, type: OscillatorType = 'sine', freqEnd?: number) {
  if (!ctx || !master) return
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, now())
  if (freqEnd !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), now() + dur)
  g.gain.setValueAtTime(gain, now())
  g.gain.exponentialRampToValueAtTime(0.0001, now() + dur)
  osc.connect(g)
  g.connect(master)
  osc.start()
  osc.stop(now() + dur + 0.02)
}

/* ------------------------------ gunshots ------------------------------ */
// Each weapon gets a characteristic body: AK is a low punchy crack, M4 a
// tighter mid crack, AWP a huge boom, pistols sharper and smaller.
export function playShot(kind: 'ak' | 'm4' | 'awp' | 'pistol' | 'deagle') {
  if (!ctx) return
  switch (kind) {
    case 'ak':
      noiseBurst(0.16, 0.9, 900, 0.7)
      tone(150, 0.12, 0.5, 'sawtooth', 60)
      break
    case 'm4':
      noiseBurst(0.13, 0.8, 1300, 0.8)
      tone(190, 0.1, 0.42, 'square', 80)
      break
    case 'awp':
      noiseBurst(0.42, 1.0, 600, 0.5)
      tone(90, 0.34, 0.7, 'sawtooth', 40)
      noiseBurst(0.5, 0.35, 2600, 0.6, 'highpass')
      break
    case 'deagle':
      noiseBurst(0.2, 0.9, 1100, 0.6)
      tone(140, 0.14, 0.5, 'square', 70)
      break
    case 'pistol':
      noiseBurst(0.1, 0.6, 1700, 0.9)
      tone(240, 0.07, 0.32, 'square', 120)
      break
  }
}

export function weaponSound(id: string) {
  if (id === 'ak47') playShot('ak')
  else if (id === 'm4a4') playShot('m4')
  else if (id === 'awp') playShot('awp')
  else if (id === 'deagle') playShot('deagle')
  else if (id === 'glock' || id === 'usp') playShot('pistol')
  else if (id === 'knife') noiseBurst(0.08, 0.4, 3000, 1.2)
}

/* ------------------------------ other cues ------------------------------ */
export function playReload() {
  if (!ctx) return
  tone(320, 0.05, 0.25, 'square', 180) // mag out
  setTimeout(() => tone(220, 0.06, 0.22, 'square', 120), 160) // mag in
  setTimeout(() => noiseBurst(0.05, 0.3, 2500, 1.5), 520) // bolt
}

let stepToggle = false
export function playFootstep() {
  if (!ctx) return
  stepToggle = !stepToggle
  noiseBurst(0.06, 0.16, stepToggle ? 420 : 360, 1.4, 'lowpass')
}

export function playScopeIn() {
  tone(700, 0.09, 0.22, 'sine', 1200)
  noiseBurst(0.05, 0.12, 2000, 2)
}
export function playScopeOut() {
  tone(1000, 0.08, 0.18, 'sine', 600)
}

export function playHitmarker() {
  tone(1500, 0.05, 0.3, 'square', 900)
}
export function playHeadshot() {
  tone(2100, 0.07, 0.34, 'square', 1400)
  noiseBurst(0.06, 0.2, 3000, 1.5)
}
export function playHurt() {
  noiseBurst(0.18, 0.4, 300, 0.8, 'lowpass')
  tone(120, 0.16, 0.3, 'sawtooth', 70)
}

export function playKill() {
  if (!ctx) return
  tone(660, 0.09, 0.3, 'triangle')
  setTimeout(() => tone(880, 0.13, 0.3, 'triangle'), 90)
}

export function playPlant() {
  tone(400, 0.1, 0.28, 'square', 300)
  setTimeout(() => tone(500, 0.12, 0.26, 'square', 380), 140)
}
export function playDefuse() {
  noiseBurst(0.12, 0.22, 1800, 1.4)
  setTimeout(() => tone(300, 0.1, 0.2, 'square', 200), 120)
}

// C4 beep — quickens as the timer runs down
export function playBeep(urgent: boolean) {
  tone(urgent ? 1500 : 1100, 0.05, urgent ? 0.26 : 0.18, 'square')
}

export function playExplosion() {
  if (!ctx) return
  noiseBurst(0.9, 1.0, 200, 0.4, 'lowpass')
  tone(70, 0.7, 0.8, 'sawtooth', 30)
  noiseBurst(0.5, 0.5, 1200, 0.6, 'highpass')
}

export function playRoundWin(win: boolean) {
  if (!ctx) return
  const base = win ? 523 : 330
  ;[0, 1, 2].forEach((i) => setTimeout(() => tone(base * (1 + i * 0.25), 0.16, 0.26, 'triangle'), i * 120))
}

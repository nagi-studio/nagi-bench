/* ============================================================================
   Procedural audio — synthesised entirely with the Web Audio API, no external
   samples or libraries. Sound design honours the acoustic environment:

   - Basement / workshop gunfire and machining reflect violently (long reverb
     tail built from a generated impulse response).
   - Vacuum (the EVA assassination) carries NO external gunshot; only a
     suit-conducted muffled thump and a subjective, low heartbeat-like rumble.
   - Spacecraft ambience, alarms and hibernation hum sit in their own spaces.
   ========================================================================== */

let ctx = null
let master = null
let reverbIR = null // ConvolverNode impulse response for the basement

export function initAudio() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.0
  master.connect(ctx.destination)
  reverbIR = makeImpulse(2.6, 3.2) // long, dark basement reverb
  return ctx
}

export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') ctx.resume()
}

// fade the whole mix in/out for the opening and ending
export function setMasterGain(v, ramp = 0.6) {
  if (!ctx || !master) return
  const t = ctx.currentTime
  master.gain.cancelScheduledValues(t)
  master.gain.setValueAtTime(master.gain.value, t)
  master.gain.linearRampToValueAtTime(v, t + ramp)
}

export function audioTime() {
  return ctx ? ctx.currentTime : 0
}

// Generate a noise-based impulse response for a reverberant space.
function makeImpulse(duration, decay) {
  const rate = ctx.sampleRate
  const len = Math.max(1, Math.floor(rate * duration))
  const buf = ctx.createBuffer(2, len, rate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) {
      const t = i / len
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay)
    }
  }
  return buf
}

let noiseBuf = null
function noiseBuffer() {
  if (noiseBuf) return noiseBuf
  const len = Math.floor(ctx.sampleRate * 2)
  noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = noiseBuf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  return noiseBuf
}

// All scheduling uses an absolute AudioContext time computed from the film
// clock, so sounds stay locked to the picture.
function at(filmTime, baseTime) {
  return baseTime + filmTime
}

function tone(freq, start, dur, gain, type = 'sine', freqEnd = null, dest = null) {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, start)
  if (freqEnd) o.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), start + dur)
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), start + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  o.connect(g)
  g.connect(dest || master)
  o.start(start)
  o.stop(start + dur + 0.02)
  return g
}

function noise(start, dur, gain, filterFreq, q = 1, type = 'bandpass', dest = null) {
  if (!ctx) return
  const s = ctx.createBufferSource()
  s.buffer = noiseBuffer()
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.setValueAtTime(filterFreq, start)
  f.Q.value = q
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, start)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  s.connect(f)
  f.connect(g)
  g.connect(dest || master)
  s.start(start)
  s.stop(start + dur + 0.02)
  return g
}

// send a source through the basement reverb
function reverbBus() {
  const conv = ctx.createConvolver()
  conv.buffer = reverbIR
  const wet = ctx.createGain()
  wet.gain.value = 0.85
  conv.connect(wet)
  wet.connect(master)
  return conv
}

let reverb = null
function getReverb() {
  if (!reverb) reverb = reverbBus()
  return reverb
}

/* ------------------------- one-shot cues keyed by film time ------------------------- */

// A gunshot in the reflective basement: crack + long reverberant tail.
export function basementGunshot(t0) {
  const conv = getReverb()
  noise(t0, 0.18, 0.9, 1400, 0.7, 'bandpass')
  noise(t0, 0.5, 0.5, 900, 0.5, 'lowpass', conv) // reverb tail
  tone(120, t0, 0.22, 0.6, 'sawtooth', 45)
  tone(90, t0, 0.6, 0.35, 'sine', 40, conv)
  // metallic ring of the basement walls
  tone(1600, t0 + 0.02, 0.3, 0.12, 'triangle', 1200, conv)
}

// Machining: sustained cutting whine + rhythmic metal taps.
export function machiningLoop(startTime, endTime, baseTime) {
  if (!ctx) return
  const conv = getReverb()
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sawtooth'
  o.frequency.setValueAtTime(340, startTime)
  const lfo = ctx.createOscillator()
  const lfoG = ctx.createGain()
  lfo.frequency.value = 7
  lfoG.gain.value = 40
  lfo.connect(lfoG)
  lfoG.connect(o.frequency)
  g.gain.setValueAtTime(0.0001, startTime)
  g.gain.linearRampToValueAtTime(0.12, startTime + 0.4)
  g.gain.setValueAtTime(0.12, endTime - 0.4)
  g.gain.linearRampToValueAtTime(0.0001, endTime)
  o.connect(g)
  g.connect(master)
  g.connect(conv)
  o.start(startTime)
  o.stop(endTime + 0.1)
  lfo.start(startTime)
  lfo.stop(endTime + 0.1)
}

// Vacuum: NO external gunshot. Only a suit-conducted muffled thump + heartbeat.
export function vacuumThump(t0) {
  if (!ctx) return
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(220, t0)
  lp.Q.value = 1
  lp.connect(master)
  noise(t0, 0.3, 0.5, 140, 0.8, 'lowpass')
  tone(58, t0, 0.4, 0.5, 'sine', 34) // conducted through the suit, felt not heard
  // a subjective heartbeat double-thump afterwards
  tone(50, t0 + 0.5, 0.14, 0.28, 'sine', 38)
  tone(50, t0 + 0.72, 0.12, 0.22, 'sine', 36)
}

// Spacecraft ambience bed (low hum + faint life-support hiss).
export function shipAmbience(startTime, endTime) {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(70, startTime)
  g.gain.setValueAtTime(0.0001, startTime)
  g.gain.linearRampToValueAtTime(0.07, startTime + 1.5)
  g.gain.setValueAtTime(0.07, endTime - 1.5)
  g.gain.linearRampToValueAtTime(0.0001, endTime)
  o.connect(g)
  g.connect(master)
  o.start(startTime)
  o.stop(endTime + 0.1)
  // hiss
  const s = ctx.createBufferSource()
  s.buffer = noiseBuffer()
  s.loop = true
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.value = 5200
  f.Q.value = 0.6
  const hg = ctx.createGain()
  hg.gain.setValueAtTime(0.0001, startTime)
  hg.gain.linearRampToValueAtTime(0.03, startTime + 2)
  hg.gain.setValueAtTime(0.03, endTime - 2)
  hg.gain.linearRampToValueAtTime(0.0001, endTime)
  s.connect(f)
  f.connect(hg)
  hg.connect(master)
  s.start(startTime)
  s.stop(endTime + 0.1)
}

// Alarm: two alternating tones, urgent.
export function alarm(startTime, endTime) {
  if (!ctx) return
  let t = startTime
  let hi = true
  while (t < endTime) {
    tone(hi ? 880 : 660, t, 0.34, 0.16, 'square')
    t += 0.36
    hi = !hi
  }
}

// Broadcast / comms blip: a short radio-flavoured chirp under narration.
export function commsBlip(t0) {
  tone(1200, t0, 0.05, 0.1, 'square', 1800)
  noise(t0 + 0.05, 0.12, 0.06, 2600, 1.2, 'bandpass')
}

// Hibernation hum with a slow detuning "thaw" at the end.
export function hibernation(startTime, endTime) {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'triangle'
  o.frequency.setValueAtTime(48, startTime)
  o.frequency.linearRampToValueAtTime(96, endTime) // warming up / thawing
  g.gain.setValueAtTime(0.0001, startTime)
  g.gain.linearRampToValueAtTime(0.09, startTime + 2)
  g.gain.setValueAtTime(0.09, endTime - 2)
  g.gain.linearRampToValueAtTime(0.0001, endTime)
  o.connect(g)
  g.connect(master)
  o.start(startTime)
  o.stop(endTime + 0.1)
}

// A deep cinematic boom for act transitions / the final reveal.
export function boom(t0) {
  tone(70, t0, 1.6, 0.5, 'sine', 28)
  noise(t0, 1.2, 0.3, 200, 0.5, 'lowpass')
  const conv = getReverb()
  tone(50, t0, 2.0, 0.3, 'sine', 24, conv)
}

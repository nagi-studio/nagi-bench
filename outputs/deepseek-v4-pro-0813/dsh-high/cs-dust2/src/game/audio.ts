/**
 * Procedural sound synthesis via Web Audio API. No external audio assets.
 * All gunshots / reloads / footsteps / UI beeps are generated from noise
 * bursts, filtered oscillators and envelopes.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

export function initAudio(): void {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
}

function ac(): AudioContext {
  if (!ctx) initAudio();
  return ctx as AudioContext;
}

let noiseCache: AudioBuffer | null = null;
function noiseBuffer(duration: number): AudioBuffer {
  const c = ac();
  if (!noiseCache || noiseCache.duration < duration) {
    const len = Math.ceil(c.sampleRate * duration);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    noiseCache = buf;
  }
  return noiseCache;
}

function playNoise(opts: {
  duration: number;
  filterType?: BiquadFilterType;
  freq?: number;
  q?: number;
  freqEnd?: number;
  gain?: number;
  when?: number;
  attack?: number;
}): void {
  const c = ac();
  const t = opts.when ?? c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(opts.duration);
  const filter = c.createBiquadFilter();
  filter.type = opts.filterType ?? 'lowpass';
  filter.frequency.value = opts.freq ?? 1000;
  filter.Q.value = opts.q ?? 1;
  if (opts.freqEnd) {
    filter.frequency.setValueAtTime(opts.freq ?? 1000, t);
    filter.frequency.exponentialRampToValueAtTime(opts.freqEnd, t + opts.duration);
  }
  const g = c.createGain();
  const peak = opts.gain ?? 0.5;
  const atk = opts.attack ?? 0.002;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.duration);
  src.connect(filter).connect(g).connect(master as GainNode);
  src.start(t);
  src.stop(t + opts.duration + 0.02);
}

function tone(opts: {
  type?: OscillatorType;
  freq: number;
  freqEnd?: number;
  duration: number;
  gain?: number;
  when?: number;
  attack?: number;
}): void {
  const c = ac();
  const t = opts.when ?? c.currentTime;
  const o = c.createOscillator();
  o.type = opts.type ?? 'sine';
  o.frequency.setValueAtTime(opts.freq, t);
  if (opts.freqEnd) o.frequency.exponentialRampToValueAtTime(opts.freqEnd, t + opts.duration);
  const g = c.createGain();
  const peak = opts.gain ?? 0.3;
  const atk = opts.attack ?? 0.002;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.duration);
  o.connect(g).connect(master as GainNode);
  o.start(t);
  o.stop(t + opts.duration + 0.02);
}

export function playShot(soundGroup: string): void {
  switch (soundGroup) {
    case 'rifle': // AK-47: low, punchy crack
      playNoise({ duration: 0.22, filterType: 'lowpass', freq: 900, freqEnd: 260, gain: 0.9, q: 0.8 });
      tone({ type: 'square', freq: 120, freqEnd: 55, duration: 0.18, gain: 0.35 });
      break;
    case 'smg': // M4A4: tighter, brighter
      playNoise({ duration: 0.16, filterType: 'bandpass', freq: 1600, freqEnd: 500, gain: 0.85, q: 1.1 });
      tone({ type: 'square', freq: 150, freqEnd: 70, duration: 0.13, gain: 0.28 });
      break;
    case 'sniper': // AWP: huge boom with long tail
      playNoise({ duration: 0.7, filterType: 'lowpass', freq: 700, freqEnd: 120, gain: 1.1, q: 0.7, attack: 0.004 });
      tone({ type: 'sine', freq: 95, freqEnd: 35, duration: 0.7, gain: 0.7 });
      playNoise({ duration: 0.05, filterType: 'highpass', freq: 2500, gain: 0.5 });
      break;
    case 'pistol': // handguns: short crack
      playNoise({ duration: 0.1, filterType: 'bandpass', freq: 2200, freqEnd: 800, gain: 0.7, q: 1.2 });
      tone({ type: 'square', freq: 220, freqEnd: 90, duration: 0.08, gain: 0.2 });
      break;
    default:
      playNoise({ duration: 0.08, filterType: 'bandpass', freq: 1500, gain: 0.4 });
  }
}

export function playKnifeSwing(): void {
  playNoise({ duration: 0.08, filterType: 'bandpass', freq: 900, freqEnd: 300, gain: 0.3 });
}

export function playReload(): void {
  const c = ac();
  const t = c.currentTime;
  // a couple of mechanical clicks
  for (let i = 0; i < 3; i++) {
    playNoise({ duration: 0.05, filterType: 'highpass', freq: 1800, gain: 0.3, when: t + i * 0.35 });
  }
  playNoise({ duration: 0.08, filterType: 'lowpass', freq: 700, gain: 0.35, when: t + 0.9 });
}

export function playFootstep(): void {
  playNoise({ duration: 0.05, filterType: 'lowpass', freq: 400, gain: 0.12, attack: 0.001 });
}

export function playZoom(): void {
  playNoise({ duration: 0.06, filterType: 'highpass', freq: 3000, gain: 0.25 });
  tone({ type: 'sine', freq: 1200, freqEnd: 700, duration: 0.05, gain: 0.1 });
}

export function playHit(): void {
  tone({ type: 'square', freq: 1150, duration: 0.05, gain: 0.22 });
}

export function playKill(): void {
  tone({ type: 'sine', freq: 880, duration: 0.09, gain: 0.25 });
  tone({ type: 'sine', freq: 1320, duration: 0.14, gain: 0.25, when: ac().currentTime + 0.07 });
}

export function playC4Beep(plant: boolean): void {
  tone({ type: 'square', freq: plant ? 740 : 620, duration: 0.08, gain: 0.18 });
}

export function playC4Planted(): void {
  tone({ type: 'square', freq: 520, duration: 0.12, gain: 0.25 });
  tone({ type: 'square', freq: 780, duration: 0.12, gain: 0.25, when: ac().currentTime + 0.14 });
}

export function playC4Defused(): void {
  tone({ type: 'square', freq: 660, duration: 0.12, gain: 0.25 });
  tone({ type: 'square', freq: 990, duration: 0.12, gain: 0.25, when: ac().currentTime + 0.14 });
}

export function playExplosion(): void {
  playNoise({ duration: 1.4, filterType: 'lowpass', freq: 500, freqEnd: 60, gain: 1.2, q: 0.6, attack: 0.005 });
  tone({ type: 'sine', freq: 80, freqEnd: 25, duration: 1.3, gain: 0.9 });
  playNoise({ duration: 0.3, filterType: 'highpass', freq: 1200, gain: 0.5 });
}

export function playRoundStart(): void {
  tone({ type: 'square', freq: 440, duration: 0.08, gain: 0.2 });
  tone({ type: 'square', freq: 660, duration: 0.12, gain: 0.2, when: ac().currentTime + 0.1 });
}

export function playWin(): void {
  tone({ type: 'sine', freq: 523, duration: 0.16, gain: 0.25 });
  tone({ type: 'sine', freq: 659, duration: 0.16, gain: 0.25, when: ac().currentTime + 0.16 });
  tone({ type: 'sine', freq: 784, duration: 0.28, gain: 0.25, when: ac().currentTime + 0.32 });
}

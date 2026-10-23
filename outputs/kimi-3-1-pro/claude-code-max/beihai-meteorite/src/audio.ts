import type { SoundFactory, WebAudioCueBus } from "@agentbench/cinematic-player";

const TAU = Math.PI * 2;
const buffers = new WeakMap<AudioContext, Map<string, AudioBuffer>>();

function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function noise(ac: AudioContext, seconds: number, seed = 1): AudioBuffer {
  const key = `${seconds.toFixed(3)}:${seed}`;
  const cached = buffers.get(ac)?.get(key);
  if (cached) return cached;
  const length = Math.max(1, Math.floor(ac.sampleRate * seconds));
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  const rng = random(seed);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = rng() * 2 - 1;
    last = last * 0.985 + white * 0.15;
    data[i] = white * 0.62 + last * 0.38;
  }
  if (!buffers.has(ac)) buffers.set(ac, new Map());
  buffers.get(ac)!.set(key, buffer);
  return buffer;
}

function source(ac: AudioContext, seconds: number, seed = 1, loop = false): AudioBufferSourceNode {
  const node = ac.createBufferSource();
  node.buffer = noise(ac, seconds, seed);
  node.loop = loop;
  return node;
}

function stopNodes(nodes: Array<AudioScheduledSourceNode | OscillatorNode>): void {
  for (const node of nodes) {
    try { node.stop(); } catch { /* already stopped */ }
    try { node.disconnect(); } catch { /* disconnected */ }
  }
}

function envelope(gain: GainNode, ac: AudioContext, peak: number, duration: number, attack = 0.005): number {
  const now = ac.currentTime;
  const end = now + Math.max(0.035, duration);
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  return end;
}

function tone(
  ac: AudioContext,
  output: AudioNode,
  frequency: number,
  duration: number,
  peak: number,
  type: OscillatorType = "sine",
  slideTo?: number,
): SoundHandleLike {
  const now = ac.currentTime;
  const oscillator = ac.createOscillator();
  const gain = ac.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(Math.max(1, frequency), now);
  if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), now + duration);
  oscillator.connect(gain).connect(output);
  const end = envelope(gain, ac, peak, duration, Math.min(0.02, duration * 0.15));
  oscillator.start(now);
  oscillator.stop(end + 0.04);
  return { stop: () => stopNodes([oscillator]) };
}

interface SoundHandleLike { stop: () => void }

function drone(ac: AudioContext, output: AudioNode, frequencies: number[], peak: number, duration = 60, color = "sine"): SoundHandleLike {
  const now = ac.currentTime;
  const nodes: OscillatorNode[] = [];
  const master = ac.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(peak, now + 1.2);
  master.connect(output);
  for (const frequency of frequencies) {
    const osc = ac.createOscillator();
    osc.type = color as OscillatorType;
    osc.frequency.value = frequency;
    osc.connect(master);
    osc.start(now);
    nodes.push(osc);
  }
  const lfo = ac.createOscillator();
  const lfoGain = ac.createGain();
  lfo.frequency.value = 0.075;
  lfoGain.gain.value = peak * 0.28;
  lfo.connect(lfoGain).connect(master.gain);
  lfo.start(now);
  nodes.push(lfo);
  return { stop: () => { master.disconnect(); stopNodes(nodes); } };
}

function filteredLoop(ac: AudioContext, output: AudioNode, seconds: number, seed: number, frequency: number, q: number, peak: number, type: BiquadFilterType = "lowpass"): SoundHandleLike {
  const now = ac.currentTime;
  const input = source(ac, seconds, seed, true);
  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = q;
  const gain = ac.createGain();
  gain.gain.value = peak;
  input.connect(filter).connect(gain).connect(output);
  input.start(now);
  return { stop: () => stopNodes([input]) };
}

function roomReverb(ac: AudioContext): ConvolverNode {
  const key = "reverb:cellar";
  const cached = buffers.get(ac)?.get(key);
  if (!cached) {
    const length = Math.floor(ac.sampleRate * 1.9);
    const impulse = ac.createBuffer(2, length, ac.sampleRate);
    const rng = random(881);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const t = i / length;
        const early = i < ac.sampleRate * 0.08 ? 0.35 : 0;
        data[i] = (rng() * 2 - 1) * (Math.pow(1 - t, 3.5) * 0.62 + early);
      }
    }
    if (!buffers.has(ac)) buffers.set(ac, new Map());
    buffers.get(ac)!.set(key, impulse);
  }
  const convolver = ac.createConvolver();
  convolver.buffer = buffers.get(ac)!.get(key)!;
  return convolver;
}

export function registerAudio<Context>(audio: WebAudioCueBus<Context>): void {
  audio.define("voidDrone", ({ audioContext: ac, output }) => {
    const low = drone(ac, output, [36, 54, 81], 0.055, 60, "sine");
    const air = filteredLoop(ac, output, 3, 19, 170, 0.4, 0.018);
    return { stop: () => { low.stop(); air.stop(); } };
  });

  audio.define("homeTone", ({ audioContext: ac, output }) => {
    const room = filteredLoop(ac, output, 4, 7, 230, 0.5, 0.055);
    const hum = drone(ac, output, [58, 116], 0.014, 60, "sine");
    return { stop: () => { room.stop(); hum.stop(); } };
  });

  audio.define("cellarTone", ({ audioContext: ac, output }) => {
    const room = filteredLoop(ac, output, 3, 71, 120, 0.8, 0.09);
    const hum = drone(ac, output, [43, 86], 0.025, 60, "triangle");
    return { stop: () => { room.stop(); hum.stop(); } };
  });

  audio.define("baseTone", ({ audioContext: ac, output }) => {
    const room = filteredLoop(ac, output, 3, 121, 340, 0.55, 0.038, "bandpass");
    const hum = drone(ac, output, [62, 124], 0.018, 30, "sine");
    return { stop: () => { room.stop(); hum.stop(); } };
  });

  audio.define("workshopHum", ({ audioContext: ac, output }) => {
    const hum = drone(ac, output, [ fifty(), 100, 200], 0.028, 60, "sawtooth");
    const air = filteredLoop(ac, output, 2, 22, 620, 0.7, 0.025, "bandpass");
    return { stop: () => { hum.stop(); air.stop(); } };
  });

  // A small named function keeps the electrical fundamental explicit in the mix.
  function fifty(): number { return 50; }

  audio.define("homeScore", ({ audioContext: ac, output }) => {
    const chord = drone(ac, output, [146.83, 220, 293.66], 0.032, 90, "sine");
    return chord;
  });

  audio.define("workScore", ({ audioContext: ac, output }) => {
    const chord = drone(ac, output, [73.42, 110, 146.83], 0.026, 90, "triangle");
    return chord;
  });

  audio.define("voidScore", ({ audioContext: ac, output }) => {
    const chord = drone(ac, output, [55, 82.41, 123.47], 0.022, 120, "sine");
    return chord;
  });

  audio.define("suitBreath", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const input = source(ac, 4, 39, true);
    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 480;
    filter.Q.value = 0.55;
    const gain = ac.createGain();
    gain.gain.value = 0.04;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.21;
    const depth = ac.createGain();
    depth.gain.value = 0.034;
    lfo.connect(depth).connect(gain.gain);
    input.connect(filter).connect(gain).connect(output);
    input.start(now); lfo.start(now);
    const low = tone(ac, output, 47, 60, 0.004, "sine");
    return { stop: () => { stopNodes([input, lfo]); low.stop(); } };
  });

  audio.define("door", ({ audioContext: ac, output }) => {
    const creak = tone(ac, output,  ninety(), 1.1, 0.12, "sawtooth", 38);
    const thud = tone(ac, output, 68, 0.24, 0.2, "sine",  thirty());
    return { stop: () => { creak.stop(); thud.stop(); } };
  });
  function ninety(): number { return  ninetyValue; }
  const ninetyValue = 118;
  function thirty(): number { return 34; }

  audio.define("footsteps", ({ audioContext: ac, output, offset }) => {
    const nodes: AudioScheduledSourceNode[] = [];
    const now = ac.currentTime;
    const count = 6;
    for (let i = 0; i < count; i++) {
      const at = now + i * 0.55 - offset;
      const step = source(ac, 0.16, 90 + i);
      const filter = ac.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 260;
      const gain = ac.createGain(); gain.gain.setValueAtTime(0.0001, Math.max(now, at));
      gain.gain.exponentialRampToValueAtTime(0.16, Math.max(now, at) + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, Math.max(now, at) + 0.15);
      step.connect(filter).connect(gain).connect(output);
      step.start(Math.max(now, at)); step.stop(Math.max(now, at) + 0.18); nodes.push(step);
    }
    return { stop: () => stopNodes(nodes) };
  });

  audio.define("ceramic", ({ audioContext: ac, output }) => {
    const a = tone(ac, output, 740, 0.5, 0.08, "sine", 420);
    const b = tone(ac, output, 1110, 0.28, 0.035, "sine");
    return { stop: () => { a.stop(); b.stop(); } };
  });

  audio.define("safe", ({ audioContext: ac, output }) => {
    const motor = tone(ac, output,  seventy(), 1.25, 0.11, "sawtooth", 38);
    const click = tone(ac, output, 920, 0.08, 0.14, "square");
    return { stop: () => { motor.stop(); click.stop(); } };
  });
  function seventy(): number { return 72; }

  audio.define("stone", ({ audioContext: ac, output }) => {
    const a = tone(ac, output, 182, 0.42, 0.11, "triangle", 92);
    const b = tone(ac, output, 380, 0.16, 0.06, "sine");
    return { stop: () => { a.stop(); b.stop(); } };
  });

  audio.define("electronic", ({ audioContext: ac, output }) => {
    const a = tone(ac, output, 880, 0.12, 0.065, "square");
    const b = tone(ac, output, 1320, 0.18, 0.045, "sine");
    return { stop: () => { a.stop(); b.stop(); } };
  });

  audio.define("cnc", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const motor = ac.createOscillator(); motor.type = "sawtooth"; motor.frequency.value =  ninetyValue * 1.7;
    const motorGain = ac.createGain(); motorGain.gain.value = 0.035;
    const filter = ac.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 480;
    motor.connect(filter).connect(motorGain).connect(output); motor.start(now);
    const cutting = filteredLoop(ac, output, 1.5, 44, 1600, 2.2, 0.038, "bandpass");
    const lfo = ac.createOscillator(); lfo.frequency.value = 0.8;
    const lfoGain = ac.createGain(); lfoGain.gain.value = 0.018;
    lfo.connect(lfoGain).connect(motorGain.gain); lfo.start(now);
    return { stop: () => { stopNodes([motor, lfo]); cutting.stop(); } };
  });

  audio.define("metalTick", ({ audioContext: ac, output }) => {
    const a = tone(ac, output, 1700, 0.16, 0.075, "square", 530);
    const b = tone(ac, output,  ninetyValue * 2, 0.22, 0.05, "triangle", 80);
    return { stop: () => { a.stop(); b.stop(); } };
  });

  audio.define("tool", ({ audioContext: ac, output }) => tone(ac, output, 240, 0.8, 0.12, "sawtooth",  sixty()));
  function sixty(): number { return 62; }

  audio.define("brass", ({ audioContext: ac, output }) => {
    const nodes: SoundHandleLike[] = [];
    for (let i = 0; i < 4; i++) nodes.push(tone(ac, output, 280 + i * 63, 0.18 + i * 0.02, 0.06, "triangle"));
    return { stop: () => nodes.forEach((n) => n.stop()) };
  });

  audio.define("glue", ({ audioContext: ac, output }) => filteredLoop(ac, output, 0.6, 17, 900, 1.1, 0.07, "bandpass"));

  audio.define("magazine", ({ audioContext: ac, output }) => {
    const click = tone(ac, output, 160, 0.14, 0.13, "square", 65);
    const snap = tone(ac, output, 840, 0.1, 0.06, "triangle", 240);
    return { stop: () => { click.stop(); snap.stop(); } };
  });

  audio.define("gunIndoor", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const dry = ac.createGain(); dry.gain.value = 0.52;
    const wet = ac.createGain(); wet.gain.value = 0.64;
    const reverb = roomReverb(ac);
    dry.connect(output); wet.connect(reverb).connect(output);
    const blast = source(ac, 0.55, 301);
    const filter = ac.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.setValueAtTime(2400, now); filter.frequency.exponentialRampToValueAtTime(180, now + 0.42);
    const blastGain = ac.createGain(); envelope(blastGain, ac, 0.8, 0.52, 0.001);
    blast.connect(filter).connect(blastGain); blastGain.connect(dry); blastGain.connect(wet);
    blast.start(now); blast.stop(now + 0.6);
    const thump = tone(ac, dry, 92, 0.42, 0.42, "sine",  thirty());
    const slap = tone(ac, wet, 410, 0.18, 0.24, "square", 90);
    return { stop: () => { stopNodes([blast]); thump.stop(); slap.stop(); dry.disconnect(); wet.disconnect(); reverb.disconnect(); } };
  });

  audio.define("cloth", ({ audioContext: ac, output }) => filteredLoop(ac, output, 0.8, 81, 480, 0.6, 0.08, "bandpass"));

  audio.define("locker", ({ audioContext: ac, output }) => {
    const a = tone(ac, output, 110, 0.6, 0.12, "square", 42);
    const b = tone(ac, output, 690, 0.08, 0.1, "square");
    return { stop: () => { a.stop(); b.stop(); } };
  });

  audio.define("thruster", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const input = source(ac, 3, 111, true);
    const filter = ac.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 280;
    const gain = ac.createGain(); gain.gain.value = 0.065;
    input.connect(filter).connect(gain).connect(output); input.start(now);
    const rumble = drone(ac, output, [48, 72], 0.018, 30, "sine");
    return { stop: () => { stopNodes([input]); rumble.stop(); } };
  });

  audio.define("depress", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const input = source(ac, 2.5, 119);
    const filter = ac.createBiquadFilter(); filter.type = "bandpass"; filter.frequency.setValueAtTime(2200, now); filter.frequency.exponentialRampToValueAtTime(180, now + 2.2); filter.Q.value = 0.7;
    const gain = ac.createGain(); gain.gain.setValueAtTime(0.0001, now); gain.gain.linearRampToValueAtTime(0.11, now + 0.18); gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.35);
    input.connect(filter).connect(gain).connect(output); input.start(now); input.stop(now + 2.5);
    const beep = tone(ac, output, 660, 0.16, 0.07, "square");
    return { stop: () => { stopNodes([input]); beep.stop(); } };
  });

  audio.define("radioClick", ({ audioContext: ac, output }) => {
    const click = filteredLoop(ac, output, 0.38, 612, 2500, 0.9, 0.09, "bandpass");
    const beep = tone(ac, output, 980, 0.08, 0.035, "square");
    return { stop: () => { click.stop(); beep.stop(); } };
  });

  audio.define("camera", ({ audioContext: ac, output }) => tone(ac, output, 1046, 0.18, 0.06, "sine"));
  audio.define("scope", ({ audioContext: ac, output }) => tone(ac, output, 320, 0.7, 0.08, "triangle",  ninetyValue));

  // This is deliberately a muffled, suit-conducted impulse, never an exterior gunshot in vacuum.
  audio.define("suitShot", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const thump = tone(ac, output, 84, 0.22, 0.16, "sine",  thirty());
    const click = tone(ac, output, 270, 0.07, 0.035, "square", 90);
    const vibration = source(ac, 0.16, 719);
    const filter = ac.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 190;
    const gain = ac.createGain(); envelope(gain, ac, 0.09, 0.15, 0.001);
    vibration.connect(filter).connect(gain).connect(output); vibration.start(now); vibration.stop(now + 0.2);
    return { stop: () => { thump.stop(); click.stop(); stopNodes([vibration]); } };
  });

  audio.define("alarm", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const oscillator = ac.createOscillator(); oscillator.type = "square"; oscillator.frequency.value = 520;
    const gain = ac.createGain(); gain.gain.value = 0.025;
    const lfo = ac.createOscillator(); lfo.type = "square"; lfo.frequency.value = 1.7;
    const depth = ac.createGain(); depth.gain.value = 0.025;
    lfo.connect(depth).connect(gain.gain); oscillator.connect(gain).connect(output);
    oscillator.start(now); lfo.start(now);
    return { stop: () => stopNodes([oscillator, lfo]) };
  });

  audio.define("impactSuit", ({ audioContext: ac, output }) => {
    const thud = tone(ac, output, 58, 0.38, 0.15, "sine", 28);
    const hiss = filteredLoop(ac, output, 0.8, 918, 900, 0.5, 0.045, "bandpass");
    return { stop: () => { thud.stop(); hiss.stop(); } };
  });

  audio.define("ice", ({ audioContext: ac, output }) => {
    const a = tone(ac, output, 1740, 1.1, 0.028, "sine", 920);
    const b = tone(ac, output, 2380, 0.7, 0.018, "sine", 1420);
    return { stop: () => { a.stop(); b.stop(); } };
  });
}

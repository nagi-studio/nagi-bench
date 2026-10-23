const TAU = Math.PI * 2;
const noiseCache = new WeakMap();
const impulseCache = new WeakMap();

function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function noiseBuffer(ac, seconds = 2) {
  let byLength = noiseCache.get(ac);
  if (!byLength) {
    byLength = new Map();
    noiseCache.set(ac, byLength);
  }
  if (byLength.has(seconds)) return byLength.get(seconds);
  const length = Math.ceil(ac.sampleRate * seconds);
  const buffer = ac.createBuffer(2, length, ac.sampleRate);
  const random = rng(917 + seconds * 31);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let brown = 0;
    for (let i = 0; i < length; i++) {
      const white = random() * 2 - 1;
      brown = (brown + 0.025 * white) / 1.025;
      data[i] = white * 0.72 + brown * 1.8;
    }
  }
  byLength.set(seconds, buffer);
  return buffer;
}

function impulse(ac) {
  if (impulseCache.has(ac)) return impulseCache.get(ac);
  const duration = 1.25;
  const length = Math.ceil(ac.sampleRate * duration);
  const buffer = ac.createBuffer(2, length, ac.sampleRate);
  const random = rng(7719);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const t = i / ac.sampleRate;
      const early = t < 0.12 ? 0.65 : 0.25;
      data[i] = (random() * 2 - 1) * Math.exp(-t * 5.2) * early;
    }
    for (const [time, gain] of [[0.021, 0.85], [0.037, 0.72], [0.061, 0.65], [0.093, 0.5]]) {
      const index = Math.floor((time + channel * 0.003) * ac.sampleRate);
      if (index < length) data[index] += gain;
    }
  }
  impulseCache.set(ac, buffer);
  return buffer;
}

function gainNode(ac, output, value = 1) {
  const gain = ac.createGain();
  gain.gain.value = value;
  gain.connect(output);
  return gain;
}

function filter(ac, output, type, frequency, q = 0.7) {
  const node = ac.createBiquadFilter();
  node.type = type;
  node.frequency.value = frequency;
  node.Q.value = q;
  node.connect(output);
  return node;
}

function tone(ac, output, { at = 0, duration = 0.2, frequency = 440, endFrequency, type = "sine", gain = 0.1, attack = 0.004 }) {
  const now = ac.currentTime + Math.max(0, at);
  const oscillator = ac.createOscillator();
  const envelope = ac.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(Math.max(1, frequency), now);
  if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.linearRampToValueAtTime(gain, now + Math.min(attack, duration * 0.25));
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(envelope).connect(output);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
  return oscillator;
}

function noise(ac, output, { at = 0, duration = 0.2, gain = 0.1, type = "bandpass", frequency = 1000, q = 0.7, attack = 0.003, loop = false, offset = 0 }) {
  const now = ac.currentTime + Math.max(0, at);
  const source = ac.createBufferSource();
  source.buffer = noiseBuffer(ac, 3);
  source.loop = loop;
  const filt = filter(ac, output, type, frequency, q);
  const envelope = ac.createGain();
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.linearRampToValueAtTime(gain, now + Math.min(attack, Math.max(0.002, duration * 0.2)));
  if (!loop) envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(filt).connect(envelope);
  source.start(now, offset % source.buffer.duration);
  if (!loop) source.stop(now + duration + 0.03);
  return { source, envelope, filt };
}

function stopped(nodes) {
  return () => {
    for (const node of nodes) {
      try { node.stop?.(); } catch {}
      try { node.disconnect?.(); } catch {}
    }
  };
}

function loopingTone(ac, output, frequency, gain, type = "sine") {
  const oscillator = ac.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  const amp = gainNode(ac, output, gain);
  oscillator.connect(amp);
  oscillator.start();
  return { oscillator, amp };
}

function scheduleScore(ac, output, offset, duration, notes, step, gain = 0.06, type = "triangle") {
  const nodes = [];
  const first = Math.max(0, Math.floor(offset / step) - 1);
  const count = Math.ceil(duration / step) + 1;
  for (let i = first; i < count; i++) {
    const absolute = i * step;
    if (absolute < offset - 0.05 || absolute > duration) continue;
    const at = absolute - offset;
    const frequency = notes[i % notes.length];
    nodes.push(tone(ac, output, { at, duration: Math.min(4.8, step * 1.7), frequency, gain, type, attack: 0.025 }));
    if (i % 4 === 0) nodes.push(tone(ac, output, { at, duration: Math.min(6, step * 2), frequency: frequency / 2, gain: gain * 0.65, type: "sine", attack: 0.4 }));
  }
  return nodes;
}

export function registerAudio(audio) {
  audio.define("homeRoom", ({ audioContext: ac, output, offset }) => {
    const room = noise(ac, output, { loop: true, gain: 0.075, type: "lowpass", frequency: 430, offset, attack: 0.5 });
    room.envelope.gain.setTargetAtTime(0.075, ac.currentTime, 0.4);
    const hum = loopingTone(ac, output, 58, 0.012);
    return { stop: stopped([room.source, room.envelope, hum.oscillator, hum.amp]) };
  });

  audio.define("clock", ({ audioContext: ac, output }) => {
    const nodes = [
      tone(ac, output, { frequency: 1450, endFrequency: 900, duration: 0.035, gain: 0.16, type: "square" }),
      tone(ac, output, { at: 0.19, frequency: 1120, endFrequency: 720, duration: 0.045, gain: 0.12, type: "square" }),
    ];
    return { stop: stopped(nodes) };
  });

  audio.define("ceramic", ({ audioContext: ac, output }) => {
    const nodes = [1450, 2180, 2960].map((f, i) => tone(ac, output, { at: i * 0.012, duration: 0.35 - i * 0.06, frequency: f, endFrequency: f * 0.93, gain: 0.09 / (i + 1) }));
    return { stop: stopped(nodes) };
  });

  audio.define("cabinet", ({ audioContext: ac, output }) => {
    const creak = tone(ac, output, { duration: 0.8, frequency: 94, endFrequency: 53, gain: 0.1, type: "sawtooth", attack: 0.08 });
    const knock = noise(ac, output, { at: 0.72, duration: 0.12, gain: 0.18, type: "lowpass", frequency: 480 });
    return { stop: stopped([creak, knock.source]) };
  });

  audio.define("phone", ({ audioContext: ac, output }) => {
    const nodes = [0, 0.16, 0.4].flatMap((at, i) => [
      tone(ac, output, { at, duration: 0.11, frequency: i === 2 ? 1320 : 880, gain: 0.1 }),
      tone(ac, output, { at, duration: 0.1, frequency: i === 2 ? 1760 : 1174, gain: 0.045 }),
    ]);
    return { stop: stopped(nodes) };
  });

  audio.define("warmScore", ({ audioContext: ac, output, offset, cue }) => {
    const duration = cue.end - cue.start;
    const nodes = scheduleScore(ac, output, offset, duration, [146.83, 220, 293.66, 246.94, 196, 164.81, 220, 185], 4.25, 0.055, "triangle");
    return { stop: stopped(nodes) };
  });

  audio.define("voidScore", ({ audioContext: ac, output, offset, cue }) => {
    const low = loopingTone(ac, output, 55, 0.045, "sine");
    const fifth = loopingTone(ac, output, 82.41, 0.017, "triangle");
    const notes = scheduleScore(ac, output, offset, cue.end - cue.start, [220, 246.94, 329.63, 293.66, 196], 7.8, 0.025, "sine");
    return { stop: stopped([low.oscillator, fifth.oscillator, ...notes]) };
  });

  audio.define("shopRoom", ({ audioContext: ac, output, offset }) => {
    const air = noise(ac, output, { loop: true, gain: 0.08, type: "bandpass", frequency: 270, q: 0.45, offset, attack: 0.4 });
    air.envelope.gain.setTargetAtTime(0.08, ac.currentTime, 0.4);
    const hum = loopingTone(ac, output, 60, 0.028, "sine");
    return { stop: stopped([air.source, hum.oscillator]) };
  });

  audio.define("lathe", ({ audioContext: ac, output, offset }) => {
    const motor = loopingTone(ac, output, 92, 0.11, "sawtooth");
    const harmonic = loopingTone(ac, output, 184, 0.045, "square");
    const cuttingNoise = noise(ac, output, { loop: true, gain: 0.06, type: "bandpass", frequency: 1350, q: 0.8, offset, attack: 0.15 });
    cuttingNoise.envelope.gain.setTargetAtTime(0.06, ac.currentTime, 0.2);
    return { stop: stopped([motor.oscillator, harmonic.oscillator, cuttingNoise.source]) };
  });

  audio.define("machineStart", ({ audioContext: ac, output }) => {
    const spin = tone(ac, output, { duration: 1.1, frequency: 38, endFrequency: 96, gain: 0.16, type: "sawtooth", attack: 0.1 });
    const relay = noise(ac, output, { duration: 0.08, gain: 0.28, type: "lowpass", frequency: 700 });
    return { stop: stopped([spin, relay.source]) };
  });

  audio.define("cutting", ({ audioContext: ac, output }) => {
    const cut = noise(ac, output, { duration: 0.75, gain: 0.19, type: "highpass", frequency: 2200, attack: 0.04 });
    const ring = tone(ac, output, { duration: 0.65, frequency: 2650, endFrequency: 1850, gain: 0.035, type: "sine", attack: 0.025 });
    return { stop: stopped([cut.source, ring]) };
  });

  audio.define("metalTick", ({ audioContext: ac, output }) => {
    const nodes = [1800, 2630, 740].map((frequency, i) => tone(ac, output, { at: i * 0.006, duration: 0.2, frequency, endFrequency: frequency * 0.78, gain: 0.08 / (i + 1), type: i === 2 ? "triangle" : "sine" }));
    return { stop: stopped(nodes) };
  });

  audio.define("toolOff", ({ audioContext: ac, output }) => {
    const nodes = [];
    for (let i = 0; i < 6; i++) nodes.push(noise(ac, output, { at: i * 0.18, duration: 0.055, gain: 0.18, type: "bandpass", frequency: 920 + i * 90 }).source);
    nodes.push(tone(ac, output, { at: 1.12, duration: 0.35, frequency: 130, endFrequency: 62, gain: 0.14, type: "triangle" }));
    return { stop: stopped(nodes) };
  });

  audio.define("vacuum", ({ audioContext: ac, output, offset }) => {
    const motor = loopingTone(ac, output, 74, 0.07, "sawtooth");
    const air = noise(ac, output, { loop: true, gain: 0.12, type: "bandpass", frequency: 620, q: 0.5, offset, attack: 0.25 });
    air.envelope.gain.setTargetAtTime(0.12, ac.currentTime, 0.3);
    return { stop: stopped([motor.oscillator, air.source]) };
  });

  audio.define("basementRoom", ({ audioContext: ac, output, offset }) => {
    const air = noise(ac, output, { loop: true, gain: 0.055, type: "lowpass", frequency: 260, offset, attack: 0.35 });
    air.envelope.gain.setTargetAtTime(0.055, ac.currentTime, 0.4);
    const hum = loopingTone(ac, output, 49, 0.035, "sine");
    return { stop: stopped([air.source, hum.oscillator]) };
  });

  audio.define("pulseScore", ({ audioContext: ac, output, offset, cue }) => {
    const nodes = scheduleScore(ac, output, offset, cue.end - cue.start, [55, 55, 65.41, 55, 49, 55, 73.42, 49], 1.55, 0.085, "triangle");
    return { stop: stopped(nodes) };
  });

  audio.define("bulletClick", ({ audioContext: ac, output }) => {
    const click = noise(ac, output, { duration: 0.045, gain: 0.2, type: "bandpass", frequency: 1750, q: 1.4 });
    const tick = tone(ac, output, { duration: 0.08, frequency: 630, endFrequency: 390, gain: 0.08, type: "triangle" });
    return { stop: stopped([click.source, tick]) };
  });

  audio.define("magazine", ({ audioContext: ac, output }) => {
    const nodes = [0, 0.14, 0.31].map((at, i) => noise(ac, output, { at, duration: 0.06, gain: 0.2 + i * 0.05, type: "bandpass", frequency: 900 + i * 350 }).source);
    nodes.push(tone(ac, output, { at: 0.32, duration: 0.15, frequency: 180, endFrequency: 100, gain: 0.15, type: "triangle" }));
    return { stop: stopped(nodes) };
  });

  audio.define("slide", ({ audioContext: ac, output }) => {
    const metal = noise(ac, output, { duration: 0.19, gain: 0.22, type: "highpass", frequency: 1200 });
    const clack = tone(ac, output, { at: 0.16, duration: 0.1, frequency: 310, endFrequency: 120, gain: 0.16, type: "square" });
    return { stop: stopped([metal.source, clack]) };
  });

  audio.define("indoorGun", ({ audioContext: ac, output }) => {
    const dry = gainNode(ac, output, 0.78);
    const verb = ac.createConvolver();
    verb.buffer = impulse(ac);
    const wet = gainNode(ac, output, 0.52);
    verb.connect(wet);
    const crack = noise(ac, dry, { duration: 0.19, gain: 0.85, type: "lowpass", frequency: 5200, attack: 0.001 });
    const reflected = noise(ac, verb, { duration: 0.22, gain: 0.68, type: "lowpass", frequency: 3900, attack: 0.001 });
    const punch = tone(ac, dry, { duration: 0.3, frequency: 105, endFrequency: 43, gain: 0.55, type: "triangle", attack: 0.001 });
    const slap = tone(ac, verb, { at: 0.035, duration: 0.17, frequency: 210, endFrequency: 85, gain: 0.16, type: "square" });
    return { stop: stopped([crack.source, reflected.source, punch, slap, dry, verb, wet]) };
  });

  audio.define("meatHit", ({ audioContext: ac, output }) => {
    const thud = noise(ac, output, { duration: 0.19, gain: 0.32, type: "lowpass", frequency: 340, attack: 0.001 });
    const low = tone(ac, output, { duration: 0.18, frequency: 85, endFrequency: 45, gain: 0.2, type: "sine" });
    return { stop: stopped([thud.source, low]) };
  });

  audio.define("cloth", ({ audioContext: ac, output }) => {
    const cloth = noise(ac, output, { duration: 1.3, gain: 0.13, type: "bandpass", frequency: 780, q: 0.45, attack: 0.12 });
    return { stop: stopped([cloth.source]) };
  });

  audio.define("fragments", ({ audioContext: ac, output }) => {
    const nodes = [];
    for (let i = 0; i < 9; i++) nodes.push(tone(ac, output, { at: i * 0.065, duration: 0.12, frequency: 900 + (i % 4) * 270, endFrequency: 530, gain: 0.035, type: "triangle" }));
    return { stop: stopped(nodes) };
  });

  audio.define("baseRoom", ({ audioContext: ac, output, offset }) => {
    const air = noise(ac, output, { loop: true, gain: 0.07, type: "bandpass", frequency: 390, q: 0.5, offset, attack: 0.4 });
    air.envelope.gain.setTargetAtTime(0.07, ac.currentTime, 0.4);
    const fan = loopingTone(ac, output, 118, 0.022, "triangle");
    return { stop: stopped([air.source, fan.oscillator]) };
  });

  audio.define("locator", ({ audioContext: ac, output }) => {
    const nodes = [0, 0.18].map((at) => tone(ac, output, { at, duration: 0.12, frequency: 990, endFrequency: 740, gain: 0.075, type: "sine" }));
    return { stop: stopped(nodes) };
  });

  audio.define("airlock", ({ audioContext: ac, output }) => {
    const servo = tone(ac, output, { duration: 3.8, frequency: 52, endFrequency: 88, gain: 0.12, type: "sawtooth", attack: 0.3 });
    const nodes = [servo];
    for (const at of [0, 1.1, 3.5]) nodes.push(noise(ac, output, { at, duration: 0.12, gain: 0.24, type: "lowpass", frequency: 560 }).source);
    return { stop: stopped(nodes) };
  });

  audio.define("depressurize", ({ audioContext: ac, output }) => {
    const hiss = noise(ac, output, { duration: 4.2, gain: 0.24, type: "highpass", frequency: 1050, attack: 0.18 });
    hiss.filt.frequency.exponentialRampToValueAtTime(240, ac.currentTime + 4.1);
    return { stop: stopped([hiss.source]) };
  });

  audio.define("suitBreath", ({ audioContext: ac, output, offset, cue }) => {
    const duration = cue.end - cue.start;
    const breath = ac.createBufferSource();
    breath.buffer = noiseBuffer(ac, 3);
    breath.loop = true;
    const filt = filter(ac, output, "bandpass", 680, 0.65);
    const amp = ac.createGain();
    amp.gain.value = 0.0001;
    breath.connect(filt).connect(amp);
    const now = ac.currentTime;
    const cycle = 4.6;
    for (let t = Math.floor(offset / cycle) * cycle; t < duration; t += cycle) {
      const local = t - offset;
      const inhale = now + Math.max(0, local);
      if (local < 1.25 && local + 1.25 > 0) {
        amp.gain.setValueAtTime(0.0001, inhale);
        amp.gain.linearRampToValueAtTime(0.12, inhale + 0.55);
        amp.gain.linearRampToValueAtTime(0.0001, inhale + 1.3);
      }
      const exhale = now + Math.max(0, local + 1.8);
      if (local + 3.25 > 0) {
        amp.gain.setValueAtTime(0.0001, exhale);
        amp.gain.linearRampToValueAtTime(0.085, exhale + 0.45);
        amp.gain.linearRampToValueAtTime(0.0001, exhale + 1.35);
      }
    }
    breath.start(now, offset % breath.buffer.duration);
    const fan = loopingTone(ac, output, 132, 0.015, "sine");
    return { stop: stopped([breath, fan.oscillator, amp]) };
  });

  audio.define("radioSquelch", ({ audioContext: ac, output }) => {
    const staticNoise = noise(ac, output, { duration: 0.24, gain: 0.15, type: "bandpass", frequency: 1650, q: 1.2, attack: 0.002 });
    const click = tone(ac, output, { at: 0.03, duration: 0.06, frequency: 1220, endFrequency: 820, gain: 0.04, type: "square" });
    return { stop: stopped([staticNoise.source, click]) };
  });

  audio.define("glove", ({ audioContext: ac, output }) => {
    const fabric = noise(ac, output, { duration: 1.3, gain: 0.13, type: "bandpass", frequency: 420, q: 0.55, attack: 0.1 });
    const ring = tone(ac, output, { at: 0.85, duration: 0.28, frequency: 240, endFrequency: 110, gain: 0.12, type: "triangle" });
    return { stop: stopped([fabric.source, ring]) };
  });

  audio.define("magnet", ({ audioContext: ac, output }) => {
    const click = noise(ac, output, { duration: 0.08, gain: 0.24, type: "bandpass", frequency: 1150 });
    const ring = tone(ac, output, { duration: 0.3, frequency: 620, endFrequency: 270, gain: 0.1, type: "triangle" });
    return { stop: stopped([click.source, ring]) };
  });

  audio.define("tensionScore", ({ audioContext: ac, output, offset, cue }) => {
    const drone = loopingTone(ac, output, 46.25, 0.052, "sawtooth");
    const dissonance = loopingTone(ac, output, 49, 0.025, "sine");
    const beats = scheduleScore(ac, output, offset, cue.end - cue.start, [55, 55, 55, 58.27], 1.05, 0.065, "sine");
    return { stop: stopped([drone.oscillator, dissonance.oscillator, ...beats]) };
  });

  audio.define("suitShot", ({ audioContext: ac, output }) => {
    const conducted = tone(ac, output, { duration: 0.16, frequency: 78, endFrequency: 38, gain: 0.32, type: "sine", attack: 0.001 });
    const mechanism = noise(ac, output, { duration: 0.075, gain: 0.18, type: "lowpass", frequency: 520, attack: 0.001 });
    const click = tone(ac, output, { at: 0.045, duration: 0.055, frequency: 240, endFrequency: 120, gain: 0.055, type: "square" });
    return { stop: stopped([conducted, mechanism.source, click]) };
  });

  audio.define("spaceReload", ({ audioContext: ac, output }) => {
    const nodes = [0, 0.08, 0.17].map((at, i) => tone(ac, output, { at, duration: 0.09, frequency: 160 + i * 55, endFrequency: 85, gain: 0.13, type: "triangle" }));
    return { stop: stopped(nodes) };
  });

  audio.define("bulletSubject", ({ audioContext: ac, output }) => {
    const low = loopingTone(ac, output, 41.2, 0.04, "sine");
    const beating = loopingTone(ac, output, 41.8, 0.025, "sine");
    return { stop: stopped([low.oscillator, beating.oscillator]) };
  });

  audio.define("radioAlarm", ({ audioContext: ac, output, offset, cue }) => {
    const nodes = [];
    const duration = cue.end - cue.start;
    for (let t = 0; t < duration; t += 1.4) {
      if (t < offset) continue;
      const at = t - offset;
      nodes.push(tone(ac, output, { at, duration: 0.22, frequency: 740, gain: 0.065, type: "square" }));
      nodes.push(tone(ac, output, { at: at + 0.34, duration: 0.22, frequency: 740, gain: 0.065, type: "square" }));
    }
    return { stop: stopped(nodes) };
  });

  audio.define("suitThruster", ({ audioContext: ac, output, offset }) => {
    const rumble = noise(ac, output, { loop: true, gain: 0.14, type: "lowpass", frequency: 190, offset, attack: 0.3 });
    rumble.envelope.gain.setTargetAtTime(0.14, ac.currentTime, 0.25);
    const vibration = loopingTone(ac, output, 47, 0.065, "triangle");
    return { stop: stopped([rumble.source, vibration.oscillator]) };
  });

  audio.define("returnScore", ({ audioContext: ac, output, offset, cue }) => {
    const nodes = scheduleScore(ac, output, offset, cue.end - cue.start, [110, 130.81, 164.81, 146.83, 98, 123.47, 146.83, 110], 5.4, 0.05, "triangle");
    const low = loopingTone(ac, output, 55, 0.022, "sine");
    return { stop: stopped([...nodes, low.oscillator]) };
  });

  audio.define("chamberRoom", ({ audioContext: ac, output, offset }) => {
    const air = noise(ac, output, { loop: true, gain: 0.065, type: "bandpass", frequency: 330, q: 0.45, offset, attack: 0.4 });
    air.envelope.gain.setTargetAtTime(0.065, ac.currentTime, 0.4);
    const hum = loopingTone(ac, output, 66, 0.028, "sine");
    return { stop: stopped([air.source, hum.oscillator]) };
  });

  audio.define("podSeal", ({ audioContext: ac, output }) => {
    const servo = tone(ac, output, { duration: 2.6, frequency: 72, endFrequency: 43, gain: 0.11, type: "sawtooth", attack: 0.25 });
    const seal = noise(ac, output, { at: 2.3, duration: 0.8, gain: 0.14, type: "highpass", frequency: 1200, attack: 0.04 });
    const lock = tone(ac, output, { at: 3.05, duration: 0.25, frequency: 130, endFrequency: 62, gain: 0.15, type: "triangle" });
    return { stop: stopped([servo, seal.source, lock]) };
  });

  audio.define("coldFade", ({ audioContext: ac, output, offset }) => {
    const cold = noise(ac, output, { loop: true, gain: 0.065, type: "highpass", frequency: 1700, offset, attack: 1.2 });
    cold.envelope.gain.setTargetAtTime(0.065, ac.currentTime, 0.8);
    cold.filt.frequency.setTargetAtTime(380, ac.currentTime, 3.2);
    const toneLow = loopingTone(ac, output, 36.7, 0.035, "sine");
    return { stop: stopped([cold.source, toneLow.oscillator]) };
  });
}

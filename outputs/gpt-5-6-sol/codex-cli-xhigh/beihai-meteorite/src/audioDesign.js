/** @type {import('@agentbench/cinematic-player').SoundCue[]} */
export const soundCues = [
  { id: "snd-score-void-a", kind: "sound", sound: "score-void", group: "score", gain: 0.2, sustain: true, start: 0.02, end: 9.0 },
  { id: "snd-alley", kind: "sound", sound: "alley-wind", group: "ambience", gain: 0.32, sustain: true, start: 9.0, end: 18.0 },
  { id: "snd-room", kind: "sound", sound: "room-warm", group: "ambience", gain: 0.26, sustain: true, start: 18.0, end: 62.0 },
  { id: "snd-cup", kind: "sound", sound: "ceramic-cup", group: "sfx", gain: 0.7, sustain: false, start: 21.15, end: 21.65 },
  { id: "snd-safe", kind: "sound", sound: "cabinet-latch", group: "sfx", gain: 0.62, sustain: false, start: 47.15, end: 47.75 },
  { id: "snd-pay", kind: "sound", sound: "soft-confirm", group: "sfx", gain: 0.35, sustain: false, start: 59.25, end: 59.7 },
  { id: "snd-workshop", kind: "sound", sound: "workshop-hum", group: "ambience", gain: 0.35, sustain: true, start: 62.0, end: 83.0 },
  { id: "snd-lathe", kind: "sound", sound: "lathe", group: "sfx", gain: 0.54, sustain: true, start: 64.0, end: 79.5 },
  { id: "snd-cut-a", kind: "sound", sound: "metal-cut", group: "sfx", gain: 0.66, sustain: false, start: 68.0, end: 68.7 },
  { id: "snd-cut-b", kind: "sound", sound: "metal-cut", group: "sfx", gain: 0.62, sustain: false, start: 72.8, end: 73.5 },
  { id: "snd-cut-c", kind: "sound", sound: "metal-cut", group: "sfx", gain: 0.7, sustain: false, start: 77.65, end: 78.4 },
  { id: "snd-basement", kind: "sound", sound: "basement-tone", group: "ambience", gain: 0.3, sustain: true, start: 83.0, end: 108.0 },
  ...[85.3, 86.0, 87.1, 88.2, 89.6, 91.1, 92.8].map((start, index) => ({
    id: `snd-ammo-${index + 1}`,
    kind: "sound",
    sound: "ammo-click",
    group: "sfx",
    gain: 0.38 + (index % 3) * 0.04,
    sustain: false,
    start,
    end: start + 0.24,
  })),
  { id: "snd-magazine", kind: "sound", sound: "gun-mechanism", group: "sfx", gain: 0.6, sustain: false, start: 94.1, end: 94.7 },
  ...[96.0, 96.72, 97.45, 98.18].map((start, index) => ({
    id: `snd-basement-shot-${index + 1}`,
    kind: "sound",
    sound: "basement-shot",
    group: "sfx",
    gain: 0.83,
    sustain: false,
    start,
    end: start + 1.65,
  })),
  { id: "snd-transition", kind: "sound", sound: "transition-riser", group: "score", gain: 0.3, sustain: true, start: 106.0, end: 123.0 },
  { id: "snd-space-score", kind: "sound", sound: "space-subjective", group: "score", gain: 0.22, sustain: true, start: 123.0, end: 220.0 },
  { id: "snd-suit-breath", kind: "sound", sound: "suit-breath", group: "suit", gain: 0.6, sustain: true, start: 123.0, end: 220.0 },
  { id: "snd-thruster-approach", kind: "sound", sound: "suit-thruster", group: "suit", gain: 0.52, sustain: true, start: 124.2, end: 128.0 },
  { id: "snd-radio-bed", kind: "sound", sound: "radio-bed", group: "radio", gain: 0.16, sustain: true, start: 144.0, end: 156.0 },
  { id: "snd-airlock", kind: "sound", sound: "airlock-conducted", group: "radio", gain: 0.46, sustain: false, start: 144.1, end: 145.3 },
  { id: "snd-glove", kind: "sound", sound: "suit-latch", group: "suit", gain: 0.58, sustain: false, start: 159.0, end: 159.6 },
  { id: "snd-draw", kind: "sound", sound: "gun-mechanism", group: "suit", gain: 0.46, sustain: false, start: 161.0, end: 161.7 },
  { id: "snd-sight", kind: "sound", sound: "suit-latch", group: "suit", gain: 0.4, sustain: false, start: 162.3, end: 162.9 },
  { id: "snd-heart", kind: "sound", sound: "heartbeat", group: "score", gain: 0.34, sustain: true, start: 166.0, end: 195.0 },
  ...[170.8,171.0,171.2,171.4,171.6,171.8,172.0,172.2,172.4,172.6,173.5,173.7,173.9,174.1,174.3,174.5,174.7,174.9,175.1,175.3,176.2,176.4,176.6,176.8,177.0,177.2,177.4,177.6,177.8,178.0].map((start, index) => ({
    id: `snd-suit-shot-${String(index + 1).padStart(2, "0")}`,
    kind: "sound",
    sound: "suit-shot",
    group: "suit",
    gain: 0.62,
    sustain: false,
    start,
    end: start + 0.18,
  })),
  { id: "snd-panic-radio", kind: "sound", sound: "radio-panic-bed", group: "radio", gain: 0.33, sustain: true, start: 194.0, end: 205.0 },
  { id: "snd-alarm", kind: "sound", sound: "radio-alarm", group: "radio", gain: 0.3, sustain: true, start: 198.2, end: 205.0 },
  { id: "snd-return", kind: "sound", sound: "suit-thruster", group: "suit", gain: 0.57, sustain: true, start: 205.0, end: 213.0 },
  { id: "snd-end-tone", kind: "sound", sound: "end-tone", group: "score", gain: 0.28, sustain: true, start: 214.0, end: 228.0 },
];

function noiseBuffer(ac, seconds = 2) {
  const length = Math.max(1, Math.floor(ac.sampleRate * seconds));
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function stopNodes(nodes) {
  return () => {
    nodes.forEach((node) => {
      try { node.stop?.(); } catch {}
      try { node.disconnect?.(); } catch {}
    });
  };
}

function loopNoise(ac, output, { low = 80, high = 1200, gain = 0.1, type = "bandpass" } = {}) {
  const source = ac.createBufferSource();
  source.buffer = noiseBuffer(ac, 2.5);
  source.loop = true;
  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = Math.sqrt(low * high);
  filter.Q.value = type === "bandpass" ? 0.6 : 0.4;
  const amp = ac.createGain();
  amp.gain.value = gain;
  source.connect(filter).connect(amp).connect(output);
  source.start();
  return [source, filter, amp];
}

function sustainedTone(ac, output, frequencies, volume = 0.08, wave = "sine") {
  const nodes = [];
  frequencies.forEach((frequency, index) => {
    const oscillator = ac.createOscillator();
    oscillator.type = wave;
    oscillator.frequency.value = frequency;
    const amp = ac.createGain();
    amp.gain.value = volume / (index + 1);
    oscillator.connect(amp).connect(output);
    oscillator.start();
    nodes.push(oscillator, amp);
  });
  return nodes;
}

function transientNoise(ac, output, duration, filterFrequency, amount = 0.5) {
  const source = ac.createBufferSource();
  source.buffer = noiseBuffer(ac, duration + 0.05);
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(filterFrequency, ac.currentTime);
  const amp = ac.createGain();
  amp.gain.setValueAtTime(Math.max(0.0001, amount), ac.currentTime);
  amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  source.connect(filter).connect(amp).connect(output);
  source.start();
  source.stop(ac.currentTime + duration + 0.03);
  return [source, filter, amp];
}

export function registerAudioDesign(audio) {
  audio
    .define("score-void", ({ audioContext: ac, output }) => {
      const nodes = sustainedTone(ac, output, [41.2, 61.8, 92.7], 0.065, "sine");
      return { stop: stopNodes(nodes) };
    })
    .define("alley-wind", ({ audioContext: ac, output }) => {
      const nodes = loopNoise(ac, output, { low: 130, high: 900, gain: 0.13, type: "bandpass" });
      const hum = sustainedTone(ac, output, [49], 0.025);
      return { stop: stopNodes([...nodes, ...hum]) };
    })
    .define("room-warm", ({ audioContext: ac, output }) => {
      const nodes = loopNoise(ac, output, { low: 80, high: 440, gain: 0.035, type: "lowpass" });
      const hum = sustainedTone(ac, output, [50, 100], 0.018);
      return { stop: stopNodes([...nodes, ...hum]) };
    })
    .define("ceramic-cup", ({ audioContext: ac, output }) => {
      const now = ac.currentTime;
      const nodes = [];
      [1460, 2110, 2880].forEach((frequency, index) => {
        const osc = ac.createOscillator();
        osc.type = "sine";
        osc.frequency.value = frequency;
        const amp = ac.createGain();
        amp.gain.setValueAtTime(0.16 / (index + 1), now);
        amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
        osc.connect(amp).connect(output);
        osc.start();
        osc.stop(now + 0.36);
        nodes.push(osc, amp);
      });
      return { stop: stopNodes(nodes) };
    })
    .define("cabinet-latch", ({ audioContext: ac, output }) => {
      const nodes = transientNoise(ac, output, 0.18, 1200, 0.33);
      const osc = ac.createOscillator();
      const amp = ac.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(115, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(62, ac.currentTime + 0.13);
      amp.gain.setValueAtTime(0.12, ac.currentTime);
      amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.16);
      osc.connect(amp).connect(output);
      osc.start(); osc.stop(ac.currentTime + 0.17);
      return { stop: stopNodes([...nodes, osc, amp]) };
    })
    .define("soft-confirm", ({ audioContext: ac, output }) => {
      const nodes = [];
      [660, 990].forEach((frequency, index) => {
        const osc = ac.createOscillator();
        const amp = ac.createGain();
        osc.type = "sine";
        osc.frequency.value = frequency;
        amp.gain.setValueAtTime(0.0001, ac.currentTime);
        amp.gain.exponentialRampToValueAtTime(0.08, ac.currentTime + 0.015 + index * 0.07);
        amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.18 + index * 0.07);
        osc.connect(amp).connect(output); osc.start(); osc.stop(ac.currentTime + 0.3);
        nodes.push(osc, amp);
      });
      return { stop: stopNodes(nodes) };
    })
    .define("workshop-hum", ({ audioContext: ac, output }) => {
      const noise = loopNoise(ac, output, { low: 90, high: 650, gain: 0.07, type: "lowpass" });
      const hum = sustainedTone(ac, output, [50, 150], 0.055, "sine");
      return { stop: stopNodes([...noise, ...hum]) };
    })
    .define("lathe", ({ audioContext: ac, output }) => {
      const osc = ac.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = 92;
      const wobble = ac.createOscillator();
      wobble.frequency.value = 5.7;
      const wobbleGain = ac.createGain();
      wobbleGain.gain.value = 4.5;
      wobble.connect(wobbleGain).connect(osc.frequency);
      const filter = ac.createBiquadFilter();
      filter.type = "lowpass"; filter.frequency.value = 1200; filter.Q.value = 1.4;
      const amp = ac.createGain(); amp.gain.value = 0.095;
      const grind = loopNoise(ac, output, { low: 700, high: 3400, gain: 0.028, type: "bandpass" });
      osc.connect(filter).connect(amp).connect(output); osc.start(); wobble.start();
      return { stop: stopNodes([osc, wobble, wobbleGain, filter, amp, ...grind]) };
    })
    .define("metal-cut", ({ audioContext: ac, output }) => {
      const noise = transientNoise(ac, output, 0.55, 5200, 0.22);
      const osc = ac.createOscillator(); const amp = ac.createGain();
      osc.type = "square"; osc.frequency.setValueAtTime(1280, ac.currentTime); osc.frequency.exponentialRampToValueAtTime(420, ac.currentTime + 0.4);
      amp.gain.setValueAtTime(0.07, ac.currentTime); amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.48);
      osc.connect(amp).connect(output); osc.start(); osc.stop(ac.currentTime + 0.5);
      return { stop: stopNodes([...noise, osc, amp]) };
    })
    .define("basement-tone", ({ audioContext: ac, output }) => {
      const noise = loopNoise(ac, output, { low: 45, high: 300, gain: 0.045, type: "lowpass" });
      const hum = sustainedTone(ac, output, [50, 51.1], 0.05, "sine");
      return { stop: stopNodes([...noise, ...hum]) };
    })
    .define("ammo-click", ({ audioContext: ac, output }) => {
      const now = ac.currentTime;
      const noise = transientNoise(ac, output, 0.11, 2800, 0.24);
      const osc = ac.createOscillator(); const amp = ac.createGain();
      osc.type = "triangle"; osc.frequency.setValueAtTime(420, now); osc.frequency.exponentialRampToValueAtTime(135, now + 0.09);
      amp.gain.setValueAtTime(0.12, now); amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(amp).connect(output); osc.start(); osc.stop(now + 0.13);
      return { stop: stopNodes([...noise, osc, amp]) };
    })
    .define("gun-mechanism", ({ audioContext: ac, output }) => {
      const now = ac.currentTime;
      const noise = transientNoise(ac, output, 0.32, 1800, 0.28);
      const osc = ac.createOscillator(); const amp = ac.createGain();
      osc.type = "square"; osc.frequency.setValueAtTime(190, now); osc.frequency.exponentialRampToValueAtTime(78, now + 0.25);
      amp.gain.setValueAtTime(0.12, now); amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.connect(amp).connect(output); osc.start(); osc.stop(now + 0.32);
      return { stop: stopNodes([...noise, osc, amp]) };
    })
    .define("basement-shot", ({ audioContext: ac, output }) => {
      const now = ac.currentTime;
      const convolver = ac.createConvolver();
      const ir = ac.createBuffer(2, Math.floor(ac.sampleRate * 1.45), ac.sampleRate);
      for (let channel = 0; channel < 2; channel += 1) {
        const data = ir.getChannelData(channel);
        for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3.2);
      }
      convolver.buffer = ir;
      const wet = ac.createGain(); wet.gain.value = 0.48;
      const noise = ac.createBufferSource(); noise.buffer = noiseBuffer(ac, 0.18);
      const crack = ac.createBiquadFilter(); crack.type = "bandpass"; crack.frequency.value = 1700; crack.Q.value = 0.55;
      const dry = ac.createGain(); dry.gain.setValueAtTime(0.95, now); dry.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);
      noise.connect(crack).connect(dry).connect(output);
      noise.connect(convolver).connect(wet).connect(output);
      const thump = ac.createOscillator(); const thumpGain = ac.createGain();
      thump.type = "triangle"; thump.frequency.setValueAtTime(96, now); thump.frequency.exponentialRampToValueAtTime(31, now + 0.24);
      thumpGain.gain.setValueAtTime(0.8, now); thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      thump.connect(thumpGain).connect(output);
      noise.start(); noise.stop(now + 0.19); thump.start(); thump.stop(now + 0.31);
      return { stop: stopNodes([noise, crack, dry, convolver, wet, thump, thumpGain]) };
    })
    .define("transition-riser", ({ audioContext: ac, output, cue, offset }) => {
      const duration = Math.max(0.5, cue.end - cue.start);
      const phase = Math.min(1, offset / duration);
      const osc = ac.createOscillator(); const amp = ac.createGain(); const filter = ac.createBiquadFilter();
      osc.type = "sawtooth"; osc.frequency.setValueAtTime(42 + phase * 46, ac.currentTime); osc.frequency.exponentialRampToValueAtTime(91, ac.currentTime + Math.max(0.2, duration - offset));
      filter.type = "lowpass"; filter.frequency.value = 280;
      amp.gain.value = 0.05;
      osc.connect(filter).connect(amp).connect(output); osc.start();
      return { stop: stopNodes([osc, amp, filter]) };
    })
    .define("space-subjective", ({ audioContext: ac, output }) => {
      const tones = sustainedTone(ac, output, [30.8, 46.2, 69.3], 0.055, "sine");
      return { stop: stopNodes(tones) };
    })
    .define("suit-breath", ({ audioContext: ac, output }) => {
      const source = ac.createBufferSource(); source.buffer = noiseBuffer(ac, 4); source.loop = true;
      const filter = ac.createBiquadFilter(); filter.type = "bandpass"; filter.frequency.value = 580; filter.Q.value = 0.65;
      const amp = ac.createGain(); amp.gain.value = 0.0001;
      const lfo = ac.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.22;
      const lfoGain = ac.createGain(); lfoGain.gain.value = 0.065;
      lfo.connect(lfoGain).connect(amp.gain);
      source.connect(filter).connect(amp).connect(output); source.start(); lfo.start();
      return { stop: stopNodes([source, filter, amp, lfo, lfoGain]) };
    })
    .define("suit-thruster", ({ audioContext: ac, output }) => {
      const noise = loopNoise(ac, output, { low: 90, high: 900, gain: 0.14, type: "bandpass" });
      const tones = sustainedTone(ac, output, [73], 0.045, "triangle");
      return { stop: stopNodes([...noise, ...tones]) };
    })
    .define("radio-bed", ({ audioContext: ac, output }) => {
      const noise = loopNoise(ac, output, { low: 800, high: 4100, gain: 0.055, type: "bandpass" });
      return { stop: stopNodes(noise) };
    })
    .define("airlock-conducted", ({ audioContext: ac, output }) => {
      const now = ac.currentTime;
      const osc = ac.createOscillator(); const amp = ac.createGain();
      osc.type = "square"; osc.frequency.setValueAtTime(78, now); osc.frequency.exponentialRampToValueAtTime(34, now + 0.8);
      amp.gain.setValueAtTime(0.22, now); amp.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
      osc.connect(amp).connect(output); osc.start(); osc.stop(now + 1.02);
      return { stop: stopNodes([osc, amp]) };
    })
    .define("suit-latch", ({ audioContext: ac, output }) => {
      const noise = transientNoise(ac, output, 0.2, 850, 0.17);
      return { stop: stopNodes(noise) };
    })
    .define("heartbeat", ({ audioContext: ac, output }) => {
      const osc = ac.createOscillator(); osc.type = "sine"; osc.frequency.value = 48;
      const amp = ac.createGain(); amp.gain.value = 0.0001;
      const lfo = ac.createOscillator(); lfo.type = "square"; lfo.frequency.value = 1.12;
      const lfoGain = ac.createGain(); lfoGain.gain.value = 0.05;
      lfo.connect(lfoGain).connect(amp.gain); osc.connect(amp).connect(output); osc.start(); lfo.start();
      return { stop: stopNodes([osc, amp, lfo, lfoGain]) };
    })
    .define("suit-shot", ({ audioContext: ac, output }) => {
      const now = ac.currentTime;
      const osc = ac.createOscillator(); const amp = ac.createGain();
      osc.type = "triangle"; osc.frequency.setValueAtTime(145, now); osc.frequency.exponentialRampToValueAtTime(42, now + 0.13);
      amp.gain.setValueAtTime(0.28, now); amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      const noise = transientNoise(ac, output, 0.09, 420, 0.13);
      osc.connect(amp).connect(output); osc.start(); osc.stop(now + 0.16);
      return { stop: stopNodes([osc, amp, ...noise]) };
    })
    .define("radio-panic-bed", ({ audioContext: ac, output }) => {
      const noise = loopNoise(ac, output, { low: 650, high: 5200, gain: 0.08, type: "bandpass" });
      return { stop: stopNodes(noise) };
    })
    .define("radio-alarm", ({ audioContext: ac, output }) => {
      const osc = ac.createOscillator(); osc.type = "square"; osc.frequency.value = 840;
      const amp = ac.createGain(); amp.gain.value = 0.0001;
      const lfo = ac.createOscillator(); lfo.type = "square"; lfo.frequency.value = 2.1;
      const lfoGain = ac.createGain(); lfoGain.gain.value = 0.055;
      lfo.connect(lfoGain).connect(amp.gain); osc.connect(amp).connect(output); osc.start(); lfo.start();
      return { stop: stopNodes([osc, amp, lfo, lfoGain]) };
    })
    .define("end-tone", ({ audioContext: ac, output }) => {
      const tones = sustainedTone(ac, output, [36.7, 55.0, 73.4, 110], 0.052, "sine");
      return { stop: stopNodes(tones) };
    });

  audio.setGroupGain("score", 0.82);
  audio.setGroupGain("ambience", 0.8);
  audio.setGroupGain("sfx", 0.9);
  audio.setGroupGain("suit", 0.9);
  audio.setGroupGain("radio", 0.72);
  return audio;
}

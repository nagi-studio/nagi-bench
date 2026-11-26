import type { WebAudioCueBus, SoundFactoryContext, SoundHandle } from "@agentbench/cinematic-player";

/**
 * Pure Web Audio API procedural sound synthesis engine.
 * Zero audio files, zero recordings, zero data:audio URIs.
 * Every sound respects acoustic physics (concrete cellar slapback reverb vs.
 * strict vacuum silence with bone/suit-conducted vibration and radio comms).
 */

const noiseCache = new WeakMap<AudioContext, AudioBuffer>();
const pinkNoiseCache = new WeakMap<AudioContext, AudioBuffer>();
const basementIrCache = new WeakMap<AudioContext, AudioBuffer>();

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getWhiteNoise(ac: AudioContext): AudioBuffer {
  const existing = noiseCache.get(ac);
  if (existing) return existing;
  const length = ac.sampleRate * 4;
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  const rng = mulberry32(1337);
  for (let i = 0; i < length; i++) data[i] = rng() * 2 - 1;
  noiseCache.set(ac, buffer);
  return buffer;
}

function getPinkNoise(ac: AudioContext): AudioBuffer {
  const existing = pinkNoiseCache.get(ac);
  if (existing) return existing;
  const length = ac.sampleRate * 4;
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  const rng = mulberry32(4242);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = rng() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  pinkNoiseCache.set(ac, buffer);
  return buffer;
}

/**
 * Procedural impulse response modeling a small, hard-walled concrete basement:
 * intense early slapback echoes (6–38ms) + bright metallic/concrete diffuse tail.
 */
function getBasementIR(ac: AudioContext): AudioBuffer {
  const existing = basementIrCache.get(ac);
  if (existing) return existing;
  const duration = 1.65;
  const length = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(2, length, ac.sampleRate);
  const rng = mulberry32(9001);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    // Early hard concrete wall reflections
    const earlyMs = [4.5, 9.2, 14.8, 21.3, 29.1, 38.7, 51.0, 67.4];
    for (let k = 0; k < earlyMs.length; k++) {
      const idx = Math.floor((earlyMs[k]! + ch * 1.4) * 0.001 * ac.sampleRate);
      if (idx < length) {
        data[idx] += (k % 2 === 0 ? 1 : -1) * Math.pow(0.82, k) * 0.95;
      }
    }
    // Dense concrete ringing tail
    for (let i = 0; i < length; i++) {
      const t = i / ac.sampleRate;
      const env = Math.exp(-t * 3.1) * (0.45 + 0.55 * Math.exp(-t * 9.5));
      const modal = 1 + 0.25 * Math.sin(2 * Math.PI * 192 * t) + 0.18 * Math.sin(2 * Math.PI * 428 * t);
      data[i] += (rng() * 2 - 1) * env * modal * 0.34;
    }
  }
  basementIrCache.set(ac, buffer);
  return buffer;
}

function makeStopper(stops: Array<() => void>, timers: number[] = []): SoundHandle {
  let stopped = false;
  return {
    stop() {
      if (stopped) return;
      stopped = true;
      for (const id of timers) window.clearInterval(id);
      for (const fn of stops) {
        try {
          fn();
        } catch {
          // ignore already-stopped nodes
        }
      }
    },
  };
}

function remainingSeconds(ctx: SoundFactoryContext, fallback = 1): number {
  return Math.max(0.05, ctx.cue.end - ctx.cue.start - ctx.offset || fallback);
}

export function registerProceduralSounds<Context>(bus: WebAudioCueBus<Context>): void {
  // 1. Orbital deep void ambience (ultra-low cosmic sub resonance, no wind!)
  bus.define("orbit-void", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 20);
    const osc1 = ac.createOscillator();
    const osc2 = ac.createOscillator();
    osc1.type = "sine";
    osc2.type = "triangle";
    osc1.frequency.setValueAtTime(42, now);
    osc2.frequency.setValueAtTime(63.2, now);

    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(95, now);

    const env = ac.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.28, now + Math.min(1.5, rem * 0.3));
    env.gain.setValueAtTime(0.28, now + Math.max(0.1, rem - 1.2));
    env.gain.linearRampToValueAtTime(0.0001, now + rem);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(env).connect(output);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + rem + 0.1);
    osc2.stop(now + rem + 0.1);
    return makeStopper([() => osc1.stop(), () => osc2.stop()]);
  });

  // 2. Internal spacesuit life-support breathing & quiet oxygen circulation
  bus.define("suit-breath", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 16);

    const src = ac.createBufferSource();
    src.buffer = getPinkNoise(ac);
    src.loop = true;

    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(520, now);
    bp.Q.setValueAtTime(1.6, now);

    const breathGain = ac.createGain();
    breathGain.gain.setValueAtTime(0.05, now);

    // Subtle slow breathing LFO (~14 breaths/min = 0.23 Hz)
    const lfo = ac.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.23, now);
    const lfoDepth = ac.createGain();
    lfoDepth.gain.setValueAtTime(0.11, now);
    lfo.connect(lfoDepth).connect(breathGain.gain);

    // Faint continuous helmet fan air bed
    const fanOsc = ac.createOscillator();
    fanOsc.type = "sine";
    fanOsc.frequency.setValueAtTime(148, now);
    const fanGain = ac.createGain();
    fanGain.gain.setValueAtTime(0.028, now);

    const masterEnv = ac.createGain();
    masterEnv.gain.setValueAtTime(0.001, now);
    masterEnv.gain.linearRampToValueAtTime(0.8, now + 0.6);
    masterEnv.gain.setValueAtTime(0.8, now + Math.max(0.1, rem - 0.6));
    masterEnv.gain.linearRampToValueAtTime(0.001, now + rem);

    src.connect(bp).connect(breathGain).connect(masterEnv);
    fanOsc.connect(fanGain).connect(masterEnv);
    masterEnv.connect(output);

    src.start(now);
    lfo.start(now);
    fanOsc.start(now);
    src.stop(now + rem + 0.1);
    lfo.stop(now + rem + 0.1);
    fanOsc.stop(now + rem + 0.1);
    return makeStopper([() => src.stop(), () => lfo.stop(), () => fanOsc.stop()]);
  });

  // 3. Calm internal helmet heartbeat (~60 BPM lub-dub)
  bus.define("suit-heartbeat", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const rem = remainingSeconds(ctx, 20);
    const stopFns: Array<() => void> = [];

    const triggerBeat = (when: number) => {
      // Lub
      const o1 = ac.createOscillator();
      const g1 = ac.createGain();
      o1.type = "sine";
      o1.frequency.setValueAtTime(64, when);
      o1.frequency.exponentialRampToValueAtTime(34, when + 0.14);
      g1.gain.setValueAtTime(0.0001, when);
      g1.gain.linearRampToValueAtTime(0.32, when + 0.02);
      g1.gain.exponentialRampToValueAtTime(0.0001, when + 0.18);
      o1.connect(g1).connect(output);
      o1.start(when);
      o1.stop(when + 0.2);

      // Dub
      const o2 = ac.createOscillator();
      const g2 = ac.createGain();
      o2.type = "sine";
      o2.frequency.setValueAtTime(52, when + 0.21);
      o2.frequency.exponentialRampToValueAtTime(30, when + 0.34);
      g2.gain.setValueAtTime(0.0001, when + 0.21);
      g2.gain.linearRampToValueAtTime(0.22, when + 0.23);
      g2.gain.exponentialRampToValueAtTime(0.0001, when + 0.38);
      o2.connect(g2).connect(output);
      o2.start(when + 0.21);
      o2.stop(when + 0.4);
      stopFns.push(() => o1.stop(), () => o2.stop());
    };

    const startNow = ac.currentTime;
    const period = 1.02;
    const count = Math.ceil(rem / period);
    for (let i = 0; i < count; i++) {
      const t = startNow + i * period;
      if (t < startNow + rem - 0.15) triggerBeat(t);
    }
    return makeStopper(stopFns);
  });

  // 4. Solar flare transition swell
  bus.define("solar-flare-swell", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 2.5);
    const src = ac.createBufferSource();
    src.buffer = getPinkNoise(ac);
    src.loop = true;

    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + rem * 0.85);
    filter.Q.setValueAtTime(2.5, now);

    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(330, now + rem);

    const g = ac.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(0.32, now + rem * 0.88);
    g.gain.linearRampToValueAtTime(0.0001, now + rem);

    src.connect(filter).connect(g).connect(output);
    osc.connect(g);
    src.start(now);
    osc.start(now);
    src.stop(now + rem + 0.05);
    osc.stop(now + rem + 0.05);
    return makeStopper([() => src.stop(), () => osc.stop()]);
  });

  // 5. Hutong warm study ambience (room tone + gentle antique pendulum clock)
  bus.define("hutong-room", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 40);
    const stops: Array<() => void> = [];

    const room = ac.createBufferSource();
    room.buffer = getPinkNoise(ac);
    room.loop = true;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(260, now);
    const roomGain = ac.createGain();
    roomGain.gain.setValueAtTime(0.14, now);
    room.connect(lp).connect(roomGain).connect(output);
    room.start(now);
    room.stop(now + rem + 0.05);
    stops.push(() => room.stop());

    // Antique mechanical wall clock tick-tock every 1.0s
    const count = Math.ceil(rem);
    for (let i = 0; i < count; i++) {
      const t = now + i * 1.0 + 0.2;
      if (t >= now + rem - 0.1) break;
      const tickOsc = ac.createOscillator();
      const tickGain = ac.createGain();
      tickOsc.type = "triangle";
      tickOsc.frequency.setValueAtTime(i % 2 === 0 ? 1580 : 1240, t);
      tickOsc.frequency.exponentialRampToValueAtTime(420, t + 0.028);
      tickGain.gain.setValueAtTime(0.0001, t);
      tickGain.gain.linearRampToValueAtTime(0.085, t + 0.003);
      tickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.036);
      tickOsc.connect(tickGain).connect(output);
      tickOsc.start(t);
      tickOsc.stop(t + 0.045);
      stops.push(() => tickOsc.stop());
    }

    return makeStopper(stops);
  });

  // 6. Wooden door creak
  bus.define("door-creak", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const dur = Math.min(1.5, remainingSeconds(ctx, 1.4));
    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(195, now);
    osc.frequency.linearRampToValueAtTime(290, now + dur * 0.45);
    osc.frequency.linearRampToValueAtTime(160, now + dur);

    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(640, now);
    bp.Q.setValueAtTime(7, now);

    const g = ac.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.14, now + 0.15);
    g.gain.linearRampToValueAtTime(0.09, now + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(bp).connect(g).connect(output);
    osc.start(now);
    osc.stop(now + dur + 0.05);
    return makeStopper([() => osc.stop()]);
  });

  // 7. Military footsteps on old wooden floor
  bus.define("wood-footsteps", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const stops: Array<() => void> = [];
    const stepOffsets = [0.0, 0.56, 1.12, 1.68, 2.24];
    for (let i = 0; i < stepOffsets.length; i++) {
      const t = now + stepOffsets[i]!;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(115 + (i % 2) * 14, t);
      osc.frequency.exponentialRampToValueAtTime(42, t + 0.09);
      g.gain.setValueAtTime(0.28, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.connect(g).connect(output);
      osc.start(t);
      osc.stop(t + 0.14);
      stops.push(() => osc.stop());
    }
    return makeStopper(stops);
  });

  // 8. Pouring hot tea into ceramic cup
  bus.define("tea-pour", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const dur = Math.min(2.5, remainingSeconds(ctx, 2.3));
    const src = ac.createBufferSource();
    src.buffer = getWhiteNoise(ac);
    src.loop = true;

    // Rising resonant pitch as cup fills!
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(750, now);
    bp.frequency.exponentialRampToValueAtTime(2200, now + dur);
    bp.Q.setValueAtTime(5.2, now);

    const g = ac.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.26, now + 0.2);
    g.gain.setValueAtTime(0.24, now + dur - 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(bp).connect(g).connect(output);
    src.start(now);
    src.stop(now + dur + 0.05);
    return makeStopper([() => src.stop()]);
  });

  // 9. Ceramic teacup clink
  bus.define("cup-clink", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const freqs = [2420, 3890, 5610];
    const stops: Array<() => void> = [];
    for (let i = 0; i < freqs.length; i++) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freqs[i]!, now);
      g.gain.setValueAtTime(0.14 / (i + 1), now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.24 / (i + 1));
      o.connect(g).connect(output);
      o.start(now);
      o.stop(now + 0.3);
      stops.push(() => o.stop());
    }
    return makeStopper(stops);
  });

  // 10. Glass display cabinet latch
  bus.define("cabinet-latch", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(980, now);
    o.frequency.exponentialRampToValueAtTime(340, now + 0.06);
    g.gain.setValueAtTime(0.16, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    o.connect(g).connect(output);
    o.start(now);
    o.stop(now + 0.1);
    return makeStopper([() => o.stop()]);
  });

  // 11. Heavy iron meteorite placed onto wooden workbench
  bus.define("meteorite-thud", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    // Deep wood thump
    const body = ac.createOscillator();
    const bodyG = ac.createGain();
    body.type = "sine";
    body.frequency.setValueAtTime(140, now);
    body.frequency.exponentialRampToValueAtTime(48, now + 0.16);
    bodyG.gain.setValueAtTime(0.45, now);
    bodyG.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    body.connect(bodyG).connect(output);

    // Dense metallic-iron click transient
    const click = ac.createOscillator();
    const clickG = ac.createGain();
    click.type = "triangle";
    click.frequency.setValueAtTime(1180, now);
    click.frequency.exponentialRampToValueAtTime(410, now + 0.04);
    clickG.gain.setValueAtTime(0.22, now);
    clickG.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    click.connect(clickG).connect(output);

    body.start(now);
    click.start(now);
    body.stop(now + 0.25);
    click.stop(now + 0.08);
    return makeStopper([() => body.stop(), () => click.stop()]);
  });

  // 12. Phone bank transfer confirmation chime
  bus.define("phone-pay", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const stops: Array<() => void> = [];
    const notes = [880, 1318.5];
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.11;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g).connect(output);
      o.start(t);
      o.stop(t + 0.4);
      stops.push(() => o.stop());
    });
    return makeStopper(stops);
  });

  // 13. J-cut accelerating clock tick into industrial tension
  bus.define("clock-tension-jcut", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const dur = Math.min(3.5, remainingSeconds(ctx, 3.4));
    const stops: Array<() => void> = [];

    // Subtle rising metallic drone bridging to CNC workshop
    const drone = ac.createOscillator();
    const droneG = ac.createGain();
    drone.type = "sawtooth";
    drone.frequency.setValueAtTime(98, now);
    drone.frequency.exponentialRampToValueAtTime(196, now + dur);
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(340, now);
    droneG.gain.setValueAtTime(0.001, now);
    droneG.gain.linearRampToValueAtTime(0.16, now + dur * 0.9);
    droneG.gain.linearRampToValueAtTime(0.001, now + dur);
    drone.connect(lp).connect(droneG).connect(output);
    drone.start(now);
    drone.stop(now + dur + 0.05);
    stops.push(() => drone.stop());

    return makeStopper(stops);
  });

  // 14. Cold fluorescent CNC workshop hum
  bus.define("workshop-hum", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 18);

    const o50 = ac.createOscillator();
    const o100 = ac.createOscillator();
    o50.type = "sine";
    o100.type = "sawtooth";
    o50.frequency.setValueAtTime(50, now);
    o100.frequency.setValueAtTime(100, now);

    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(320, now);

    const g = ac.createGain();
    g.gain.setValueAtTime(0.16, now);

    o50.connect(g);
    o100.connect(lp).connect(g);
    g.connect(output);
    o50.start(now);
    o100.start(now);
    o50.stop(now + rem + 0.05);
    o100.stop(now + rem + 0.05);
    return makeStopper([() => o50.stop(), () => o100.stop()]);
  });

  // 15. CNC lathe high-speed spindle whine
  bus.define("cnc-spindle", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 14);

    const carrier = ac.createOscillator();
    carrier.type = "sawtooth";
    carrier.frequency.setValueAtTime(310, now);

    const sub = ac.createOscillator();
    sub.type = "triangle";
    sub.frequency.setValueAtTime(155, now);

    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(720, now);
    bp.Q.setValueAtTime(2.6, now);

    const g = ac.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.24, now + 0.6);
    g.gain.setValueAtTime(0.24, now + Math.max(0.1, rem - 0.3));
    g.gain.linearRampToValueAtTime(0.001, now + rem);

    carrier.connect(bp).connect(g).connect(output);
    sub.connect(g);
    carrier.start(now);
    sub.start(now);
    carrier.stop(now + rem + 0.05);
    sub.stop(now + rem + 0.05);
    return makeStopper([() => carrier.stop(), () => sub.stop()]);
  });

  // 16. Carbide cutting bit grinding iron meteorite + crackling sparks
  bus.define("cnc-cut-sparks", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const dur = Math.min(3.8, remainingSeconds(ctx, 3.4));

    const src = ac.createBufferSource();
    src.buffer = getWhiteNoise(ac);
    src.loop = true;

    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(2600, now);
    bp.frequency.linearRampToValueAtTime(3400, now + dur * 0.5);
    bp.frequency.linearRampToValueAtTime(2200, now + dur);
    bp.Q.setValueAtTime(4.2, now);

    const scrape = ac.createOscillator();
    scrape.type = "sawtooth";
    scrape.frequency.setValueAtTime(1180, now);
    scrape.frequency.linearRampToValueAtTime(1420, now + dur);

    const scrapeG = ac.createGain();
    scrapeG.gain.setValueAtTime(0.06, now);

    const env = ac.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.32, now + 0.14);
    env.gain.setValueAtTime(0.3, now + Math.max(0.15, dur - 0.2));
    env.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(bp).connect(env);
    scrape.connect(scrapeG).connect(env);
    env.connect(output);

    src.start(now);
    scrape.start(now);
    src.stop(now + dur + 0.05);
    scrape.stop(now + dur + 0.05);
    return makeStopper([() => src.stop(), () => scrape.stop()]);
  });

  // 17. CNC spindle power-down pitch drop
  bus.define("cnc-powerdown", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const dur = Math.min(2.2, remainingSeconds(ctx, 2.0));
    const o = ac.createOscillator();
    o.type = "triangle";
    o.frequency.setValueAtTime(310, now);
    o.frequency.exponentialRampToValueAtTime(38, now + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.24, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g).connect(output);
    o.start(now);
    o.stop(now + dur + 0.05);
    return makeStopper([() => o.stop()]);
  });

  // 18. Brushing meteorite shavings cleanly into tray
  bus.define("brush-sweep", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const stops: Array<() => void> = [];
    for (let i = 0; i < 2; i++) {
      const t = now + i * 0.72;
      const src = ac.createBufferSource();
      src.buffer = getWhiteNoise(ac);
      const hp = ac.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.setValueAtTime(1900, t);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.12);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      src.connect(hp).connect(g).connect(output);
      src.start(t);
      src.stop(t + 0.5);
      stops.push(() => src.stop());
    }
    return makeStopper(stops);
  });

  // 19. Concrete basement claustrophobic low hum & bare tungsten bulb buzz
  bus.define("basement-hum", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 46);

    const low = ac.createOscillator();
    low.type = "sine";
    low.frequency.setValueAtTime(58, now);
    const lowG = ac.createGain();
    lowG.gain.setValueAtTime(0.15, now);

    const buzz = ac.createOscillator();
    buzz.type = "sawtooth";
    buzz.frequency.setValueAtTime(120, now);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(480, now);
    bp.Q.setValueAtTime(4, now);
    const buzzG = ac.createGain();
    buzzG.gain.setValueAtTime(0.032, now);

    low.connect(lowG).connect(output);
    buzz.connect(bp).connect(buzzG).connect(output);
    low.start(now);
    buzz.start(now);
    low.stop(now + rem + 0.05);
    buzz.stop(now + rem + 0.05);
    return makeStopper([() => low.stop(), () => buzz.stop()]);
  });

  // 20. Pliers plucking bullet tip off caseless cartridge
  bus.define("pliers-snip", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(2200, now);
    o.frequency.exponentialRampToValueAtTime(620, now + 0.045);
    g.gain.setValueAtTime(0.24, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    o.connect(g).connect(output);
    o.start(now);
    o.stop(now + 0.08);
    return makeStopper([() => o.stop()]);
  });

  // 21. Seating meteorite slug onto adhesive propellant block
  bus.define("slug-seat", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(1480, now);
    o.frequency.exponentialRampToValueAtTime(520, now + 0.055);
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    o.connect(g).connect(output);
    o.start(now);
    o.stop(now + 0.1);
    return makeStopper([() => o.stop()]);
  });

  // 22. Pushing meteorite bullet into pistol magazine
  bus.define("mag-load", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const stops: Array<() => void> = [];
    // Spring compression scrape + steel lip click
    const o1 = ac.createOscillator();
    const g1 = ac.createGain();
    o1.type = "sawtooth";
    o1.frequency.setValueAtTime(1650, now);
    o1.frequency.exponentialRampToValueAtTime(920, now + 0.035);
    g1.gain.setValueAtTime(0.22, now);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    o1.connect(g1).connect(output);
    o1.start(now);
    o1.stop(now + 0.07);
    stops.push(() => o1.stop());

    const o2 = ac.createOscillator();
    const g2 = ac.createGain();
    o2.type = "triangle";
    o2.frequency.setValueAtTime(2840, now + 0.055);
    g2.gain.setValueAtTime(0.18, now + 0.055);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    o2.connect(g2).connect(output);
    o2.start(now + 0.055);
    o2.stop(now + 0.12);
    stops.push(() => o2.stop());
    return makeStopper(stops);
  });

  // 23. Magazine slap-insert into grip
  bus.define("mag-insert", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(340, now);
    o.frequency.exponentialRampToValueAtTime(95, now + 0.09);
    g.gain.setValueAtTime(0.42, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o.connect(g).connect(output);

    const latch = ac.createOscillator();
    const latchG = ac.createGain();
    latch.type = "square";
    latch.frequency.setValueAtTime(2150, now + 0.05);
    latchG.gain.setValueAtTime(0.2, now + 0.05);
    latchG.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);
    latch.connect(latchG).connect(output);

    o.start(now);
    latch.start(now + 0.05);
    o.stop(now + 0.14);
    latch.stop(now + 0.12);
    return makeStopper([() => o.stop(), () => latch.stop()]);
  });

  // 24. Type-2010 Pistol slide rack (chk-CLACK!)
  bus.define("slide-rack", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const stops: Array<() => void> = [];
    const hit = (t: number, f0: number, f1: number, gain: number) => {
      const src = ac.createBufferSource();
      src.buffer = getWhiteNoise(ac);
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(f0, t);
      bp.Q.setValueAtTime(3.2, t);
      const g = ac.createGain();
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      src.connect(bp).connect(g).connect(output);
      src.start(t);
      src.stop(t + 0.11);

      const tone = ac.createOscillator();
      const tg = ac.createGain();
      tone.type = "triangle";
      tone.frequency.setValueAtTime(f1, t);
      tone.frequency.exponentialRampToValueAtTime(f1 * 0.45, t + 0.07);
      tg.gain.setValueAtTime(gain * 0.7, t);
      tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);
      tone.connect(tg).connect(output);
      tone.start(t);
      tone.stop(t + 0.1);
      stops.push(() => src.stop(), () => tone.stop());
    };
    hit(now, 2400, 1400, 0.34);
    hit(now + 0.19, 1750, 920, 0.48);
    return makeStopper(stops);
  });

  // 25. DEAFENING CONCRETE BASEMENT GUNSHOT (massive shock + ConvolverNode cellar reverb!)
  bus.define("basement-gunshot", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;

    const dryBus = ac.createGain();
    dryBus.gain.setValueAtTime(0.62, now);
    dryBus.connect(output);

    const wetBus = ac.createConvolver();
    wetBus.buffer = getBasementIR(ac);
    const wetGain = ac.createGain();
    wetGain.gain.setValueAtTime(0.88, now);
    wetBus.connect(wetGain).connect(output);

    // 1) Supersonic explosive white-noise blast
    const blast = ac.createBufferSource();
    blast.buffer = getWhiteNoise(ac);
    const blastFilter = ac.createBiquadFilter();
    blastFilter.type = "lowpass";
    blastFilter.frequency.setValueAtTime(6800, now);
    blastFilter.frequency.exponentialRampToValueAtTime(420, now + 0.28);
    const blastG = ac.createGain();
    blastG.gain.setValueAtTime(0.75, now);
    blastG.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    blast.connect(blastFilter).connect(blastG);
    blastG.connect(dryBus);
    blastG.connect(wetBus);

    // 2) Chest-thumping sub-bass muzzle shockwave
    const punch = ac.createOscillator();
    punch.type = "sine";
    punch.frequency.setValueAtTime(210, now);
    punch.frequency.exponentialRampToValueAtTime(36, now + 0.16);
    const punchG = ac.createGain();
    punchG.gain.setValueAtTime(0.72, now);
    punchG.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    punch.connect(punchG);
    punchG.connect(dryBus);
    punchG.connect(wetBus);

    // 3) Concrete-wall sharp high crack transient
    const crack = ac.createBufferSource();
    crack.buffer = getWhiteNoise(ac);
    const hp = ac.createBiquadFilter();
    hp.type = "bandpass";
    hp.frequency.setValueAtTime(2900, now);
    hp.Q.setValueAtTime(1.4, now);
    const crackG = ac.createGain();
    crackG.gain.setValueAtTime(0.55, now);
    crackG.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    crack.connect(hp).connect(crackG);
    crackG.connect(dryBus);
    crackG.connect(wetBus);

    blast.start(now);
    punch.start(now);
    crack.start(now);
    blast.stop(now + 0.4);
    punch.stop(now + 0.3);
    crack.stop(now + 0.1);
    return makeStopper([() => blast.stop(), () => punch.stop(), () => crack.stop()]);
  });

  // 26. Post-gunfire indoor ear-ringing tail
  bus.define("ear-ring-tail", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const dur = Math.min(6.8, remainingSeconds(ctx, 5.5));
    const o = ac.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(3420, now);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.055, now + 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g).connect(output);
    o.start(now);
    o.stop(now + dur + 0.05);
    return makeStopper([() => o.stop()]);
  });

  // 27. Knife slicing spacesuit cloth & raw beef
  bus.define("knife-slice", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const dur = 1.25;
    const src = ac.createBufferSource();
    src.buffer = getWhiteNoise(ac);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1600, now);
    bp.frequency.exponentialRampToValueAtTime(650, now + dur);
    bp.Q.setValueAtTime(3.0, now);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.24, now + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    src.connect(bp).connect(g).connect(output);
    src.start(now);
    src.stop(now + dur + 0.05);
    return makeStopper([() => src.stop()]);
  });

  // 28. Shattered meteorite gravel clinking in palm
  bus.define("pebble-clink", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const stops: Array<() => void> = [];
    const hits = [0.0, 0.12, 0.26, 0.44, 0.68, 0.92, 1.25];
    hits.forEach((dt, i) => {
      const t = now + dt;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(2200 + ((i * 733) % 1900), t);
      o.frequency.exponentialRampToValueAtTime(980, t + 0.035);
      g.gain.setValueAtTime(0.14, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.048);
      o.connect(g).connect(output);
      o.start(t);
      o.stop(t + 0.06);
      stops.push(() => o.stop());
    });
    return makeStopper(stops);
  });

  // 29. Metal ammo case latch shut
  bus.define("case-latch", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(640, now);
    o.frequency.exponentialRampToValueAtTime(140, now + 0.09);
    g.gain.setValueAtTime(0.32, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o.connect(g).connect(output);
    o.start(now);
    o.stop(now + 0.15);
    return makeStopper([() => o.stop()]);
  });

  // 30. Deep sub transition drop into synchronous orbit
  bus.define("transition-sub", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const dur = Math.min(2.1, remainingSeconds(ctx, 2.0));
    const o = ac.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(110, now);
    o.frequency.exponentialRampToValueAtTime(34, now + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.36, now + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g).connect(output);
    o.start(now);
    o.stop(now + dur + 0.05);
    return makeStopper([() => o.stop()]);
  });

  // 31. Orbital traffic radio squelch & carrier bed
  bus.define("radio-chatter-burst", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const dur = Math.min(5.8, remainingSeconds(ctx, 5.2));
    const stops: Array<() => void> = [];

    // Radio squelch beep open & close
    const beep = (t: number, freq: number) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.16, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(g).connect(output);
      o.start(t);
      o.stop(t + 0.11);
      stops.push(() => o.stop());
    };
    beep(now, 1480);
    beep(now + Math.max(0.2, dur - 0.14), 1120);

    // Bandpass radio hiss
    const src = ac.createBufferSource();
    src.buffer = getWhiteNoise(ac);
    src.loop = true;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1350, now);
    bp.Q.setValueAtTime(2.4, now);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.075, now);
    src.connect(bp).connect(g).connect(output);
    src.start(now);
    src.stop(now + dur);
    stops.push(() => src.stop());
    return makeStopper(stops);
  });

  // 32. Optical scope subtle focus click (internal)
  bus.define("scope-click", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(840, now);
    o.frequency.exponentialRampToValueAtTime(320, now + 0.04);
    g.gain.setValueAtTime(0.16, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    o.connect(g).connect(output);
    o.start(now);
    o.stop(now + 0.07);
    return makeStopper([() => o.stop()]);
  });

  // 33. Suit-conducted wrist-ring twist & cuff lock (heavily low-passed, ZERO air!)
  bus.define("suit-glove-unlock", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(290, now);
    lp.connect(output);

    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(240, now);
    o.frequency.exponentialRampToValueAtTime(88, now + 0.14);
    g.gain.setValueAtTime(0.38, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    o.connect(g).connect(lp);

    const o2 = ac.createOscillator();
    const g2 = ac.createGain();
    o2.type = "sine";
    o2.frequency.setValueAtTime(160, now + 0.24);
    o2.frequency.exponentialRampToValueAtTime(62, now + 0.42);
    g2.gain.setValueAtTime(0.34, now + 0.24);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.46);
    o2.connect(g2).connect(lp);

    o.start(now);
    o2.start(now + 0.24);
    o.stop(now + 0.22);
    o2.stop(now + 0.5);
    return makeStopper([() => o.stop(), () => o2.stop()]);
  });

  // 34. Suit-conducted muffled fabric/pouch contact
  bus.define("suit-pouch-draw", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = getPinkNoise(ac);
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(260, now);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.24, now + 0.16);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    src.connect(lp).connect(g).connect(output);
    src.start(now);
    src.stop(now + 0.7);
    return makeStopper([() => src.stop()]);
  });

  // 35. Suit-conducted magnetic scope snap onto pistol rail (dull bone-conducted THUNK)
  bus.define("suit-scope-magnet", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(320, now);
    lp.connect(output);

    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(260, now);
    o.frequency.exponentialRampToValueAtTime(72, now + 0.11);
    g.gain.setValueAtTime(0.5, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    o.connect(g).connect(lp);
    o.start(now);
    o.stop(now + 0.2);
    return makeStopper([() => o.stop()]);
  });

  // 36. VACUUM 10-ROUND BURST: STRICT ZERO EXTERNAL GUNFIRE!
  // Only faint, bone/suit-conducted low-passed mechanical recoil thuds (65-170Hz).
  bus.define("vacuum-burst-10", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const stops: Array<() => void> = [];

    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(195, now);
    lp.connect(output);

    const spacing = 0.35; // 10 shots across 3.5 seconds
    for (let i = 0; i < 10; i++) {
      const t = now + i * spacing;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(132 + (i % 3) * 6, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.085);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.36, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
      o.connect(g).connect(lp);
      o.start(t);
      o.stop(t + 0.13);
      stops.push(() => o.stop());
    }
    return makeStopper(stops);
  });

  // 37. Vacuum suit-conducted magazine swap (low-passed mechanical thump)
  bus.define("vacuum-mag-swap", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(240, now);
    lp.connect(output);

    const stops: Array<() => void> = [];
    [0.12, 0.62, 0.92].forEach((dt, idx) => {
      const t = now + dt;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(idx === 1 ? 190 : 145, t);
      o.frequency.exponentialRampToValueAtTime(58, t + 0.075);
      g.gain.setValueAtTime(0.28, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.095);
      o.connect(g).connect(lp);
      o.start(t);
      o.stop(t + 0.12);
      stops.push(() => o.stop());
    });
    return makeStopper(stops);
  });

  // 38. 10-second ballistic time-of-flight metronomic countdown pulse
  bus.define("tof-countdown-pulse", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 15);
    const stops: Array<() => void> = [];
    const count = Math.ceil(rem);
    for (let i = 0; i < count; i++) {
      const t = now + i * 1.0;
      if (t >= now + rem - 0.15) break;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(520, t);
      o.frequency.exponentialRampToValueAtTime(260, t + 0.09);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.14, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g).connect(output);
      o.start(t);
      o.stop(t + 0.2);
      stops.push(() => o.stop());
    }
    return makeStopper(stops);
  });

  // 39. Subjective internal sub-bass shudder at silent impact (zero air sound!)
  bus.define("impact-sub-shudder", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const o = ac.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(62, now);
    o.frequency.exponentialRampToValueAtTime(28, now + 1.8);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.45, now + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
    o.connect(g).connect(output);
    o.start(now);
    o.stop(now + 2.1);
    return makeStopper([() => o.stop()]);
  });

  // 40. Emergency radio static & crackling open channel
  bus.define("radio-emergency-static", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 20);
    const src = ac.createBufferSource();
    src.buffer = getWhiteNoise(ac);
    src.loop = true;

    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1650, now);
    bp.Q.setValueAtTime(2.2, now);

    const g = ac.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.12, now + 0.12);
    g.gain.setValueAtTime(0.1, now + Math.max(0.15, rem - 0.5));
    g.gain.linearRampToValueAtTime(0.001, now + rem);

    src.connect(bp).connect(g).connect(output);
    src.start(now);
    src.stop(now + rem + 0.05);
    return makeStopper([() => src.stop()]);
  });

  // 41. Spacesuit decompression warning triple-beeps heard through open radio channel
  bus.define("suit-alarm-radio", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 12);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1850, now);
    bp.Q.setValueAtTime(2.5, now);
    bp.connect(output);

    const stops: Array<() => void> = [];
    const cycles = Math.ceil(rem / 1.25);
    for (let c = 0; c < cycles; c++) {
      for (let b = 0; b < 3; b++) {
        const t = now + c * 1.25 + b * 0.16;
        if (t >= now + rem - 0.1) break;
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(b === 2 ? 2280 : 1960, t);
        g.gain.setValueAtTime(0.14, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
        o.connect(g).connect(bp);
        o.start(t);
        o.stop(t + 0.12);
        stops.push(() => o.stop());
      }
    }
    return makeStopper(stops);
  });

  // 42. Yellow River Station emergency PA klaxon over radio
  bus.define("station-klaxon-radio", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 7);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1100, now);
    bp.Q.setValueAtTime(1.8, now);
    bp.connect(output);

    const stops: Array<() => void> = [];
    const pulses = Math.ceil(rem / 1.4);
    for (let i = 0; i < pulses; i++) {
      const t = now + i * 1.4;
      if (t >= now + rem - 0.2) break;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(880, t);
      o.frequency.linearRampToValueAtTime(660, t + 0.48);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.56);
      o.connect(g).connect(bp);
      o.start(t);
      o.stop(t + 0.6);
      stops.push(() => o.stop());
    }
    return makeStopper(stops);
  });

  // 43. Suit-conducted cold-gas thruster acceleration rumble
  bus.define("suit-thruster-burn", (ctx) => {
    const { audioContext: ac, output } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 10);

    const src = ac.createBufferSource();
    src.buffer = getPinkNoise(ac);
    src.loop = true;

    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(165, now);

    const sub = ac.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(52, now);

    const g = ac.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.36, now + 0.7);
    g.gain.setValueAtTime(0.32, now + Math.max(0.8, rem - 1.5));
    g.gain.exponentialRampToValueAtTime(0.0001, now + rem);

    src.connect(lp).connect(g);
    sub.connect(g);
    g.connect(output);
    src.start(now);
    sub.start(now);
    src.stop(now + rem + 0.05);
    sub.stop(now + rem + 0.05);
    return makeStopper([() => src.stop(), () => sub.stop()]);
  });

  // =========================================================================
  // ORIGINAL PROCEDURAL FILM SCORE PADS (restrained, atmospheric, cinema-grade)
  // =========================================================================

  // Helper for warm layered cinematic chord progression
  const buildPadCue = (
    ctx: SoundFactoryContext,
    chords: number[][],
    chordDur: number,
    cutoff: number,
    level: number,
  ): SoundHandle => {
    const { audioContext: ac, output, offset } = ctx;
    const now = ac.currentTime;
    const rem = remainingSeconds(ctx, 20);
    const stops: Array<() => void> = [];

    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(cutoff, now);

    const masterG = ac.createGain();
    masterG.gain.setValueAtTime(0.001, now);
    masterG.gain.linearRampToValueAtTime(level, now + Math.min(1.8, rem * 0.25));
    masterG.gain.setValueAtTime(level, now + Math.max(0.2, rem - 2.2));
    masterG.gain.linearRampToValueAtTime(0.0001, now + rem);
    lp.connect(masterG).connect(output);

    const totalLen = ctx.cue.end - ctx.cue.start;
    const numChords = Math.ceil(totalLen / chordDur);

    for (let i = 0; i < numChords; i++) {
      const chordStart = i * chordDur - offset;
      const chordEnd = (i + 1) * chordDur - offset;
      if (chordEnd <= 0 || chordStart >= rem) continue;

      const t0 = now + Math.max(0, chordStart);
      const t1 = now + Math.min(rem, chordEnd + 0.6);
      const notes = chords[i % chords.length]!;
      const segDur = Math.max(0.2, t1 - t0);

      for (const freq of notes) {
        const o1 = ac.createOscillator();
        const o2 = ac.createOscillator();
        o1.type = "triangle";
        o2.type = "sine";
        o1.frequency.setValueAtTime(freq, t0);
        o2.frequency.setValueAtTime(freq * 1.003, t0);

        const ng = ac.createGain();
        ng.gain.setValueAtTime(0.0001, t0);
        ng.gain.linearRampToValueAtTime(0.18 / notes.length, t0 + Math.min(1.2, segDur * 0.35));
        ng.gain.setValueAtTime(0.18 / notes.length, t0 + Math.max(0.1, segDur - 1.1));
        ng.gain.linearRampToValueAtTime(0.0001, t1);

        o1.connect(ng);
        o2.connect(ng);
        ng.connect(lp);
        o1.start(t0);
        o2.start(t0);
        o1.stop(t1 + 0.05);
        o2.stop(t1 + 0.05);
        stops.push(() => o1.stop(), () => o2.stop());
      }
    }
    return makeStopper(stops);
  };

  // Opening Abyss Score (sparse D-minor open fifths)
  bus.define("score-abyss", (ctx) =>
    buildPadCue(
      ctx,
      [
        [73.42, 146.83, 220.0, 329.63], // Dm9 open
        [65.41, 130.81, 196.0, 293.66], // Csus2
        [58.27, 116.54, 174.61, 261.63], // Bbmaj7
      ],
      7.5,
      620,
      0.72,
    ),
  );

  // Hutong Study Score (warm nostalgic pentatonic amber tones)
  bus.define("score-hutong", (ctx) =>
    buildPadCue(
      ctx,
      [
        [146.83, 220.0, 293.66, 329.63], // D5 add2 warm
        [130.81, 196.0, 261.63, 329.63], // Cmaj
        [110.0, 164.81, 220.0, 293.66], // Asus4
        [116.54, 174.61, 220.0, 293.66], // Bbmaj7
      ],
      11.0,
      540,
      0.56,
    ),
  );

  // Orbit Waiting Score (glassy vast suspense)
  bus.define("score-orbit", (ctx) =>
    buildPadCue(
      ctx,
      [
        [73.42, 146.83, 220.0, 440.0],
        [69.3, 138.59, 220.0, 349.23],
        [65.41, 130.81, 196.0, 329.63],
        [73.42, 110.0, 174.61, 293.66],
      ],
      10.5,
      680,
      0.66,
    ),
  );

  // Tragic Ballistic Flight & Impact Drone (dark cello-like sustained minor tension)
  bus.define("score-tragic-drone", (ctx) =>
    buildPadCue(
      ctx,
      [
        [55.0, 110.0, 164.81, 261.63], // Am low
        [58.27, 116.54, 174.61, 246.94], // Bb dim tension
        [51.91, 103.83, 155.56, 233.08], // Abm dark
        [49.0, 98.0, 146.83, 220.0], // Gsus resolve
      ],
      9.5,
      520,
      0.78,
    ),
  );

  // Epilogue Score (transcendent, calm, bittersweet cosmic resolution in D minor -> D major open fifth)
  bus.define("score-epilogue", (ctx) =>
    buildPadCue(
      ctx,
      [
        [73.42, 146.83, 220.0, 349.23], // Dm
        [58.27, 116.54, 174.61, 293.66], // Bb
        [65.41, 130.81, 196.0, 329.63], // C
        [73.42, 146.83, 220.0, 369.99], // D major luminous lift
      ],
      7.2,
      760,
      0.74,
    ),
  );
}

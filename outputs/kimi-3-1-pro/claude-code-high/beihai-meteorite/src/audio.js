// All audio is computed at runtime. No recordings, encoded audio, or external libraries.
export function registerAudio(audio) {
  const noiseCache = new WeakMap();
  const rand = (() => { let s = 0x2f6e2b1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; })();
  const stopAll = (sources) => () => { for (const source of sources) { try { source.stop(); } catch {} } };
  const noise = (ac, seconds = 2) => {
    let perContext = noiseCache.get(ac);
    if (!perContext) { perContext = new Map(); noiseCache.set(ac, perContext); }
    const key = seconds.toFixed(2);
    if (perContext.has(key)) return perContext.get(key);
    const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate);
    const data = buffer.getChannelData(0);
    let brown = 0;
    for (let i = 0; i < data.length; i++) {
      const white = rand() * 2 - 1;
      brown = (brown + 0.018 * white) / 1.018;
      data[i] = white * 0.55 + brown * 2.2;
    }
    perContext.set(key, buffer);
    return buffer;
  };
  const gain = (ac, value = 1) => { const node = ac.createGain(); node.gain.value = value; return node; };
  const filter = (ac, type, hz, q = 0.7) => { const node = ac.createBiquadFilter(); node.type = type; node.frequency.value = hz; node.Q.value = q; return node; };
  const osc = (ac, frequency, type = "sine") => { const node = ac.createOscillator(); node.type = type; node.frequency.value = frequency; return node; };
  const loopNoise = (ac, output, hz, type, level, offset = 0) => {
    const source = ac.createBufferSource(); source.buffer = noise(ac); source.loop = true;
    const f = filter(ac, type, hz); const g = gain(ac, level);
    source.connect(f).connect(g).connect(output); source.start(0, offset % 1.5);
    return { source, nodes: [f, g] };
  };
  const droneFactory = (frequencies, level, colour = "sine") => ({ audioContext: ac, output }) => {
    const sources = [];
    const bus = gain(ac, 1); const low = filter(ac, "lowpass", 780); bus.connect(low).connect(output);
    frequencies.forEach((frequency, i) => {
      const o = osc(ac, frequency, i === 0 ? colour : "sine");
      o.detune.value = (i - 1) * 3;
      const g = gain(ac, level / frequencies.length);
      o.connect(g).connect(bus); o.start(); sources.push(o);
    });
    const lfo = osc(ac, 0.07); const lg = gain(ac, 110); lfo.connect(lg).connect(low.frequency); lfo.start(); sources.push(lfo);
    return { stop: stopAll(sources) };
  };
  const noiseHit = (duration, hz, type, level) => ({ audioContext: ac, output }) => {
    const now = ac.currentTime; const source = ac.createBufferSource(); source.buffer = noise(ac);
    const f = filter(ac, type, hz); const g = gain(ac, 0.0001);
    source.connect(f).connect(g).connect(output);
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(level, now + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.start(now); source.stop(now + duration + 0.03);
    return { stop: stopAll([source]) };
  };
  const beepFactory = (frequencies, spacing, length, level) => ({ audioContext: ac, output }) => {
    const now = ac.currentTime; const sources = [];
    frequencies.forEach((frequency, i) => {
      const o = osc(ac, frequency, "sine"); const g = gain(ac, 0.0001); o.connect(g).connect(output);
      const at = now + i * spacing;
      g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(level, at + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, at + length);
      o.start(at); o.stop(at + length + 0.02); sources.push(o);
    });
    return { stop: stopAll(sources) };
  };
  const mechanicalFactory = (kind) => ({ audioContext: ac, output }) => {
    const now = ac.currentTime; const sources = [];
    const patterns = kind === "magazine" ? [[740, 0, .045], [310, .09, .08]] : kind === "slide" ? [[1200, 0, .035], [480, .075, .055]] : [[980, 0, .04], [690, .07, .045]];
    for (const [frequency, delay, duration] of patterns) {
      const o = osc(ac, frequency, "square"); const g = gain(ac, 0.0001); const f = filter(ac, "lowpass", 1800);
      o.connect(f).connect(g).connect(output); const at = now + delay;
      g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(.12, at + .002); g.gain.exponentialRampToValueAtTime(.0001, at + duration);
      o.start(at); o.stop(at + duration + .01); sources.push(o);
    }
    return { stop: stopAll(sources) };
  };

  audio
    .define("warmScore", droneFactory([98, 146.83, 196, 246.94], 0.12))
    .define("coldScore", droneFactory([55, 82.41, 116.54], 0.12, "triangle"))
    .define("spaceDrone", droneFactory([41.2, 61.74, 82.41, 123.47], 0.12))
    .define("endScore", droneFactory([49, 73.42, 98, 138.59], 0.13))
    .define("homeRoom", ({ audioContext: ac, output, offset }) => {
      const a = loopNoise(ac, output, 380, "lowpass", .055, offset);
      const hum = osc(ac, 49.8); const g = gain(ac, .012); hum.connect(g).connect(output); hum.start();
      return { stop: stopAll([a.source, hum]) };
    })
    .define("industrialRoom", ({ audioContext: ac, output, offset }) => {
      const a = loopNoise(ac, output, 260, "lowpass", .08, offset);
      const hum = osc(ac, 60, "sawtooth"); const g = gain(ac, .012); const f = filter(ac, "lowpass", 180);
      hum.connect(f).connect(g).connect(output); hum.start(); return { stop: stopAll([a.source, hum]) };
    })
    .define("basementRoom", ({ audioContext: ac, output, offset }) => {
      const a = loopNoise(ac, output, 190, "lowpass", .09, offset);
      const hum = osc(ac, 50); const g = gain(ac, .018); hum.connect(g).connect(output); hum.start();
      return { stop: stopAll([a.source, hum]) };
    })
    .define("cnc", ({ audioContext: ac, output, offset }) => {
      const a = loopNoise(ac, output, 1800, "bandpass", .085, offset);
      const motor = osc(ac, 94, "sawtooth"); const whine = osc(ac, 730, "triangle");
      const mg = gain(ac, .055); const wg = gain(ac, .022); motor.connect(mg).connect(output); whine.connect(wg).connect(output);
      motor.start(); whine.start(); return { stop: stopAll([a.source, motor, whine]) };
    })
    .define("coolant", ({ audioContext: ac, output, offset }) => { const a = loopNoise(ac, output, 3200, "highpass", .025, offset); return { stop: stopAll([a.source]) }; })
    .define("suitBreath", ({ audioContext: ac, output, offset }) => {
      const length = 4.8; const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * length), ac.sampleRate); const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ac.sampleRate; const n = rand() * 2 - 1;
        const inhale = t < 1.45 ? Math.sin(Math.PI * t / 1.45) ** 2 : 0;
        const ex = t > 2.35 && t < 4.05 ? Math.sin(Math.PI * (t - 2.35) / 1.7) ** 2 : 0;
        data[i] = n * (inhale * .17 + ex * .12) + Math.sin(t * Math.PI * 2 * 48) * .018;
      }
      const source = ac.createBufferSource(); source.buffer = buffer; source.loop = true;
      const f = filter(ac, "bandpass", 620, .45); const g = gain(ac, .42); source.connect(f).connect(g).connect(output); source.start(0, offset % length);
      return { stop: stopAll([source]) };
    })
    .define("heartbeat", ({ audioContext: ac, output, offset }) => {
      const buffer = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ac.sampleRate; const beat = (at, amp) => t >= at && t < at + .15 ? Math.sin((t - at) * 220) * Math.exp(-(t - at) * 38) * amp : 0;
        data[i] = beat(0, .38) + beat(.19, .2);
      }
      const source = ac.createBufferSource(); source.buffer = buffer; source.loop = true; const f = filter(ac, "lowpass", 150);
      source.connect(f).connect(output); source.start(0, offset); return { stop: stopAll([source]) };
    })
    .define("suitThruster", ({ audioContext: ac, output, offset }) => {
      const a = loopNoise(ac, output, 170, "lowpass", .17, offset); const o = osc(ac, 43); const g = gain(ac, .04); o.connect(g).connect(output); o.start();
      return { stop: stopAll([a.source, o]) };
    })
    .define("radioRumble", ({ audioContext: ac, output, offset }) => { const a = loopNoise(ac, output, 340, "bandpass", .045, offset); return { stop: stopAll([a.source]) }; });

  audio
    .define("radioStatic", noiseHit(.32, 1600, "bandpass", .16))
    .define("clothRustle", noiseHit(2.2, 950, "bandpass", .07))
    .define("clothMuffled", noiseHit(.65, 360, "lowpass", .1))
    .define("softImpact", noiseHit(.2, 240, "lowpass", .22))
    .define("knife", noiseHit(.8, 2400, "bandpass", .07))
    .define("cupClink", beepFactory([1760, 2349], .018, .34, .065))
    .define("confirmTone", beepFactory([880, 1320], .11, .15, .045))
    .define("radioAlarm", beepFactory([740, 740, 740, 740, 740, 740], 1.55, .32, .035))
    .define("metalTick", beepFactory([1280, 830], .035, .08, .055))
    .define("pliers", mechanicalFactory("pliers"))
    .define("magazine", mechanicalFactory("magazine"))
    .define("magazineMuffled", mechanicalFactory("magazine"))
    .define("slide", mechanicalFactory("slide"))
    .define("scopeMagnet", mechanicalFactory("scope"))
    .define("servo", ({ audioContext: ac, output }) => {
      const now = ac.currentTime; const o = osc(ac, 180, "sawtooth"); const f = filter(ac, "lowpass", 750); const g = gain(ac, .0001);
      o.connect(f).connect(g).connect(output); o.frequency.linearRampToValueAtTime(420, now + .75); g.gain.exponentialRampToValueAtTime(.055, now + .04); g.gain.exponentialRampToValueAtTime(.0001, now + 1.05); o.start(); o.stop(now + 1.1); return { stop: stopAll([o]) };
    })
    .define("switchHum", beepFactory([90, 1800], .04, .18, .05))
    .define("toolRemove", mechanicalFactory("slide"))
    .define("woodDoor", ({ audioContext: ac, output }) => {
      const now = ac.currentTime; const o = osc(ac, 83, "sawtooth"); const f = filter(ac, "lowpass", 250); const g = gain(ac, .0001);
      o.connect(f).connect(g).connect(output); o.frequency.linearRampToValueAtTime(56, now + 1.5); g.gain.exponentialRampToValueAtTime(.07, now + .1); g.gain.exponentialRampToValueAtTime(.0001, now + 1.8); o.start(); o.stop(now + 1.9); return { stop: stopAll([o]) };
    })
    .define("stoneKnock", ({ audioContext: ac, output }) => {
      const now = ac.currentTime; const sources = [];
      [0, .12, .24].forEach((delay, i) => { const o = osc(ac, 240 - i * 20, "triangle"); const g = gain(ac, .0001); o.connect(g).connect(output); const at = now + delay; g.gain.exponentialRampToValueAtTime(.09, at + .003); g.gain.exponentialRampToValueAtTime(.0001, at + .16); o.start(at); o.stop(at + .18); sources.push(o); });
      return { stop: stopAll(sources) };
    })
    .define("radioServo", ({ audioContext: ac, output, offset }) => { const a = loopNoise(ac, output, 900, "bandpass", .035, offset); return { stop: stopAll([a.source]) }; })
    .define("radioChaos", ({ audioContext: ac, output, offset }) => {
      const a = loopNoise(ac, output, 1450, "bandpass", .12, offset); const o = osc(ac, 610, "square"); const g = gain(ac, .008); o.connect(g).connect(output); o.start(); return { stop: stopAll([a.source, o]) };
    });

  audio.define("suitGun", ({ audioContext: ac, output }) => {
    const now = ac.currentTime; const o = osc(ac, 82); const g = gain(ac, .0001); o.connect(g).connect(output);
    o.frequency.exponentialRampToValueAtTime(36, now + .11); g.gain.exponentialRampToValueAtTime(.2, now + .002); g.gain.exponentialRampToValueAtTime(.0001, now + .17); o.start(); o.stop(now + .18);
    const n = ac.createBufferSource(); n.buffer = noise(ac); const f = filter(ac, "lowpass", 260); const ng = gain(ac, .0001); n.connect(f).connect(ng).connect(output); ng.gain.exponentialRampToValueAtTime(.1, now + .001); ng.gain.exponentialRampToValueAtTime(.0001, now + .055); n.start(); n.stop(now + .07);
    return { stop: stopAll([o, n]) };
  });

  audio.define("basementGun", ({ audioContext: ac, output }) => {
    const now = ac.currentTime; const sources = [];
    const dry = gain(ac, .34); const reflections = gain(ac, .34); dry.connect(output); reflections.connect(output);
    const impulse = ac.createBuffer(2, Math.ceil(ac.sampleRate * .85), ac.sampleRate);
    for (let channel = 0; channel < 2; channel++) { const data = impulse.getChannelData(channel); for (let i = 0; i < data.length; i++) data[i] = (rand() * 2 - 1) * Math.exp(-i / data.length * 8); }
    const reverb = ac.createConvolver(); reverb.buffer = impulse; reverb.connect(reflections);
    const n = ac.createBufferSource(); n.buffer = noise(ac); const ng = gain(ac, .0001); n.connect(ng); ng.connect(dry); ng.connect(reverb);
    ng.gain.setValueAtTime(.0001, now); ng.gain.exponentialRampToValueAtTime(.85, now + .001); ng.gain.exponentialRampToValueAtTime(.0001, now + .16); n.start(); n.stop(now + .18); sources.push(n);
    [0.027, .043, .071, .113].forEach((delay, i) => { const d = ac.createDelay(.2); d.delayTime.value = delay; const g = gain(ac, .22 / (i + 1)); ng.connect(d).connect(g).connect(output); });
    const o = osc(ac, 105); const og = gain(ac, .0001); o.connect(og).connect(output); o.frequency.exponentialRampToValueAtTime(38, now + .2); og.gain.exponentialRampToValueAtTime(.48, now + .001); og.gain.exponentialRampToValueAtTime(.0001, now + .35); o.start(); o.stop(now + .38); sources.push(o);
    return { stop: stopAll(sources) };
  });
}

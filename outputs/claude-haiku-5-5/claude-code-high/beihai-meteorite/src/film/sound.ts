import type { WebAudioCueBus } from "@agentbench/cinematic-player";
import footstepA from "../assets/audio/footstep_concrete_000.ogg?inline";
import footstepB from "../assets/audio/footstep_concrete_001.ogg?inline";
import footstepC from "../assets/audio/footstep_concrete_002.ogg?inline";
import doorOpen from "../assets/audio/doorOpen_000.ogg?inline";
import doorClose from "../assets/audio/doorClose_000.ogg?inline";
import metalCutA from "../assets/audio/impactMetal_light_000.ogg?inline";
import metalCutB from "../assets/audio/impactMetal_light_002.ogg?inline";
import metalThud from "../assets/audio/impactMetal_medium_001.ogg?inline";
import stoneTap from "../assets/audio/impactMining_000.ogg?inline";
import pellet from "../assets/audio/impactMining_001.ogg?inline";
import glassTap from "../assets/audio/impactGlass_light_001.ogg?inline";
import bundleHit from "../assets/audio/impactSoft_heavy_001.ogg?inline";
import bellTitle from "../assets/audio/impactBell_heavy_000.ogg?inline";
import bellEnd from "../assets/audio/impactBell_heavy_002.ogg?inline";
import switchA from "../assets/audio/switch10.ogg?inline";
import switchB from "../assets/audio/switch13.ogg?inline";
import radioBeep from "../assets/audio/switch20.ogg?inline";
import radioHiss from "../assets/audio/computerNoise_001.ogg?inline";
import thruster from "../assets/audio/thrusterFire_001.ogg?inline";
import shotBody from "../assets/audio/lowFrequency_explosion_000.ogg?inline";

/** A mono buffer of white noise, reused by the procedural factories. */
function noiseBuffer(ac: AudioContext, seconds: number): AudioBuffer {
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * seconds), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Looping noise source routed through a filter chain, returned unconnected. */
function noiseSource(ac: AudioContext, seconds = 4): AudioBufferSourceNode {
  const source = ac.createBufferSource();
  source.buffer = noiseBuffer(ac, seconds);
  source.loop = true;
  return source;
}

/**
 * Register every sample and procedural sound used by the film. Samples are inlined
 * CC0 recordings from the supplied library; procedural layers add room tone, suit
 * conduction and the subjective heartbeat, where no recording can stand in.
 */
export function registerSounds(audio: WebAudioCueBus): void {
  audio
    .defineSample("step-a", footstepA)
    .defineSample("step-b", footstepB)
    .defineSample("step-c", footstepC)
    .defineSample("door-open", doorOpen)
    .defineSample("door-close", doorClose)
    .defineSample("metal-cut-a", metalCutA, { playbackRate: 0.85 })
    .defineSample("metal-cut-b", metalCutB, { playbackRate: 1.1 })
    .defineSample("metal-thud", metalThud, { playbackRate: 0.9 })
    .defineSample("stone-tap", stoneTap, { playbackRate: 1.1 })
    .defineSample("pellet", pellet, { playbackRate: 1.35 })
    .defineSample("glass-tap", glassTap, { playbackRate: 0.9 })
    .defineSample("bundle-hit", bundleHit, { playbackRate: 0.8 })
    .defineSample("bell-title", bellTitle, { playbackRate: 0.8 })
    .defineSample("bell-end", bellEnd, { playbackRate: 0.7 })
    .defineSample("switch-a", switchA, { playbackRate: 1.2 })
    .defineSample("switch-b", switchB, { playbackRate: 0.9 })
    .defineSample("radio-beep", radioBeep, { playbackRate: 1.6 })
    .defineSample("radio-hiss", radioHiss, { loop: true, playbackRate: 1.0 })
    .defineSample("thruster", thruster, { playbackRate: 0.9 })
    .defineSample("shot-body", shotBody, { playbackRate: 1.15 });

  // Hutong night: a low breath of wind over the lane.
  audio.define("amb-night", ({ audioContext: ac, output, offset }) => {
    const source = noiseSource(ac);
    const lowpass = ac.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 520;
    const gain = ac.createGain();
    gain.gain.value = 0.3;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.07;
    const depth = ac.createGain();
    depth.gain.value = 0.12;
    lfo.connect(depth).connect(gain.gain);
    source.connect(lowpass).connect(gain).connect(output);
    source.start(0, offset % 4);
    lfo.start();
    return { stop: () => { try { source.stop(); lfo.stop(); } catch { /* already stopped */ } } };
  });

  // Collector's room: a warm, close, carpeted quiet.
  audio.define("room-warm", ({ audioContext: ac, output, offset }) => {
    const source = noiseSource(ac);
    const lowpass = ac.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 180;
    const gain = ac.createGain();
    gain.gain.value = 0.22;
    source.connect(lowpass).connect(gain).connect(output);
    source.start(0, offset % 4);
    return { stop: () => { try { source.stop(); } catch { /* already stopped */ } } };
  });

  // Spindle whine of the lathe, with a slow wobble in its pitch.
  audio.define("lathe-spindle", ({ audioContext: ac, output }) => {
    const saw = ac.createOscillator();
    saw.type = "sawtooth";
    saw.frequency.value = 96;
    const lowpass = ac.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 900;
    const gain = ac.createGain();
    gain.gain.value = 0.12;
    const wobble = ac.createOscillator();
    wobble.frequency.value = 0.5;
    const wobbleDepth = ac.createGain();
    wobbleDepth.gain.value = 4;
    wobble.connect(wobbleDepth).connect(saw.frequency);
    saw.connect(lowpass).connect(gain).connect(output);
    saw.start();
    wobble.start();
    return { stop: () => { try { saw.stop(); wobble.stop(); } catch { /* already stopped */ } } };
  });

  // Mains hum of the underground room's bulb.
  audio.define("lamp-hum", ({ audioContext: ac, output }) => {
    const oscillators = [100, 200].map((frequency, index) => {
      const osc = ac.createOscillator();
      osc.frequency.value = frequency;
      const gain = ac.createGain();
      gain.gain.value = index === 0 ? 0.035 : 0.012;
      osc.connect(gain).connect(output);
      osc.start();
      return osc;
    });
    return { stop: () => oscillators.forEach((osc) => { try { osc.stop(); } catch { /* already stopped */ } }) };
  });

  // Gunfire indoors: a sharp crack, then the room answering back through a generated reverb tail.
  audio.define("gun-crack", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const length = Math.floor(ac.sampleRate * 2.2);
    const impulse = ac.createBuffer(2, length, ac.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3.2);
    }
    const convolver = ac.createConvolver();
    convolver.buffer = impulse;
    const wet = ac.createGain();
    wet.gain.value = 0.7;
    convolver.connect(wet).connect(output);

    const burst = ac.createBufferSource();
    burst.buffer = noiseBuffer(ac, 0.1);
    const highpass = ac.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 900;
    const envelope = ac.createGain();
    envelope.gain.setValueAtTime(1, now);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    burst.connect(highpass).connect(envelope);
    envelope.connect(output);
    envelope.connect(convolver);
    burst.start(now);
    burst.stop(now + 0.08);
    return { stop: () => { try { burst.stop(); } catch { /* already stopped */ } } };
  });

  // Suit-conducted thump of a shot fired in vacuum: felt through the glove, never heard as a shot.
  audio.define("suit-thump", ({ audioContext: ac, output }) => {
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    osc.frequency.setValueAtTime(52, now);
    osc.frequency.exponentialRampToValueAtTime(34, now + 0.3);
    const envelope = ac.createGain();
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.7, now + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(envelope).connect(output);
    osc.start(now);
    osc.stop(now + 0.36);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  });

  // Breathing inside the suit: a slow swell of filtered air.
  audio.define("suit-breath", ({ audioContext: ac, output, offset }) => {
    const source = noiseSource(ac);
    const bandpass = ac.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 480;
    bandpass.Q.value = 0.8;
    const gain = ac.createGain();
    gain.gain.value = 0.04;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.2;
    const depth = ac.createGain();
    depth.gain.value = 0.035;
    lfo.connect(depth).connect(gain.gain);
    source.connect(bandpass).connect(gain).connect(output);
    source.start(0, offset % 4);
    lfo.start();
    return { stop: () => { try { source.stop(); lfo.stop(); } catch { /* already stopped */ } } };
  });

  // The subjective heartbeat: two low thumps per beat, scheduled from the cue's offset.
  audio.define("heartbeat", ({ audioContext: ac, output, offset }) => {
    const period = 0.86;
    const phase = offset % period;
    const nodes: OscillatorNode[] = [];
    for (let i = 0; i < 70; i++) {
      const start = ac.currentTime + i * period - phase;
      if (start < ac.currentTime - 0.001) continue;
      for (const [delay, frequency, peak] of [[0, 62, 0.9], [0.22, 50, 0.6]] as const) {
        const osc = ac.createOscillator();
        osc.frequency.value = frequency;
        const envelope = ac.createGain();
        envelope.gain.setValueAtTime(0.0001, start + delay);
        envelope.gain.exponentialRampToValueAtTime(peak, start + delay + 0.02);
        envelope.gain.exponentialRampToValueAtTime(0.0001, start + delay + 0.18);
        osc.connect(envelope).connect(output);
        osc.start(start + delay);
        osc.stop(start + delay + 0.2);
        nodes.push(osc);
      }
    }
    return { stop: () => nodes.forEach((osc) => { try { osc.stop(); } catch { /* already stopped */ } }) };
  });

  // Quiet pad under the space sequences, fading in so the cut into space is felt.
  audio.define("space-pad", ({ audioContext: ac, output }) => {
    const lowpass = ac.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 380;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.5, ac.currentTime + 3);
    const oscillators = [55, 82.4, 110.2].map((frequency) => {
      const osc = ac.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = frequency;
      const level = ac.createGain();
      level.gain.value = 0.03;
      osc.connect(level).connect(lowpass);
      osc.start();
      return osc;
    });
    lowpass.connect(gain).connect(output);
    return { stop: () => oscillators.forEach((osc) => { try { osc.stop(); } catch { /* already stopped */ } }) };
  });

}

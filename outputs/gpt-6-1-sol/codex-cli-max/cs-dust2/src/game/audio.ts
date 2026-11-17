import type { WeaponId } from './types';
import { clamp } from './math';

/** All audio is synthesized in memory. No audio files, samples, or fetches. */
export class SynthAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  volume = .6;
  async unlock() {
    if (!this.context) {
      this.context = new AudioContext(); this.master = this.context.createGain(); this.master.gain.value = this.volume * .52; this.master.connect(this.context.destination);
      this.noise = this.context.createBuffer(1, this.context.sampleRate * 2, this.context.sampleRate);
      const data = this.noise.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.context.state === 'suspended') await this.context.resume();
  }
  setVolume(volume: number) { this.volume = volume; if (this.master && this.context) this.master.gain.setTargetAtTime(volume * .52, this.context.currentTime, .1); }
  private tone(frequency: number, end: number, duration: number, volume: number, type: OscillatorType = 'sine', delay = 0, pan = 0) {
    if (!this.context || !this.master) return;
    const c = this.context, now = c.currentTime + delay, osc = c.createOscillator(), gain = c.createGain(), panner = c.createStereoPanner();
    osc.type = type; osc.frequency.setValueAtTime(frequency, now); osc.frequency.exponentialRampToValueAtTime(Math.max(15, end), now + duration);
    gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), now + .003); gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    panner.pan.value = clamp(pan, -1, 1); osc.connect(gain); gain.connect(panner); panner.connect(this.master); osc.start(now); osc.stop(now + duration + .02); osc.onended = () => { osc.disconnect(); gain.disconnect(); panner.disconnect(); };
  }
  private hiss(duration: number, volume: number, frequency: number, delay = 0, pan = 0, highpass = false) {
    if (!this.context || !this.master || !this.noise) return;
    const c = this.context, now = c.currentTime + delay, source = c.createBufferSource(), filter = c.createBiquadFilter(), gain = c.createGain(), panner = c.createStereoPanner();
    source.buffer = this.noise; filter.type = highpass ? 'highpass' : 'lowpass'; filter.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), now + .002); gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    panner.pan.value = clamp(pan, -1, 1); source.connect(filter); filter.connect(gain); gain.connect(panner); panner.connect(this.master); source.start(now, Math.random()); source.stop(now + duration); source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); panner.disconnect(); };
  }
  shot(id: WeaponId, volume = 1, pan = 0) {
    if (volume < .015) return;
    if (id === 'knife') { this.hiss(.16, .2 * volume, 2300, 0, pan, true); return; }
    const p = {
      ak47: [135, 40, .24, 2200, .9], m4a4: [190, 65, .16, 3200, .65], awp: [80, 22, .65, 1400, 1.3],
      glock: [290, 90, .12, 3400, .5], usp: [540, 150, .075, 900, .22], deagle: [120, 35, .3, 2500, .85],
    }[id];
    this.hiss(p[2], p[4] * volume, p[3], 0, pan);
    this.tone(p[0], p[1], p[2], .4 * volume, 'triangle', 0, pan);
    this.tone(p[0] * 3, 50, .028, .16 * volume, 'square', 0, pan);
    if (id === 'awp') this.hiss(.48, .28 * volume, 600, .08, pan);
  }
  reload(volume = 1) {
    for (const [delay, f, v] of [[0, 2600, .11], [.22, 1800, .16], [.9, 3200, .18], [1.25, 2400, .12]]) { this.hiss(.065, v * volume, f, delay); this.tone(230, 110, .045, .1 * volume, 'square', delay); }
  }
  step(volume = 1, pan = 0) { this.hiss(.085, .16 * volume, 750, 0, pan); this.tone(105, 45, .075, .1 * volume, 'sine', 0, pan); }
  scope() { this.hiss(.075, .13, 3800); this.tone(1000, 450, .08, .08, 'triangle'); }
  hit(head = false) { this.tone(head ? 1500 : 1050, head ? 2100 : 750, .08, .14, 'triangle'); this.hiss(.04, .09, 6000); }
  kill() { this.tone(660, 660, .12, .15, 'sine'); this.tone(990, 990, .2, .12, 'sine', .09); }
  dry() { this.hiss(.025, .15, 2200); }
  plant() { this.tone(1150, 1150, .08, .12, 'square'); this.tone(1400, 1400, .14, .13, 'square', .13); }
  beep(volume = .5) { this.tone(1450, 1450, .085, .12 * volume, 'sine'); }
  defuse() { for (let i = 0; i < 5; i++) this.tone(1400 - i * 180, 1200 - i * 180, .16, .12, 'sine', i * .12); }
  explosion() { this.hiss(2.6, 1.8, 1000); this.tone(65, 18, 2, .85, 'sine'); this.hiss(1.5, .4, 400, .3); }
  win() { for (const [i, f] of [440, 554, 660].entries()) this.tone(f, f, .35, .1, 'triangle', i * .13); }
  dispose() { void this.context?.close(); }
}

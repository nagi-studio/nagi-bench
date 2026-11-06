import type { WeaponId } from './types';

export class SynthAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  volume = .55;
  async unlock() {
    if (!this.context) {
      this.context = new AudioContext(); this.master = this.context.createGain();
      this.master.gain.value = this.volume; this.master.connect(this.context.destination);
      this.noise = this.context.createBuffer(1, this.context.sampleRate * 2, this.context.sampleRate);
      const data = this.noise.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.context.state === 'suspended') await this.context.resume();
  }
  setVolume(v: number) { this.volume = v; if (this.master) this.master.gain.value = v; }
  private output(volume: number, duration: number, pan: number, delay: number) {
    if (!this.context || !this.master) return null;
    const t = this.context.currentTime + delay, gain = this.context.createGain(), stereo = this.context.createStereoPanner();
    gain.gain.setValueAtTime(Math.max(.0001, volume), t); gain.gain.exponentialRampToValueAtTime(.0001, t + duration);
    stereo.pan.value = Math.max(-1, Math.min(1, pan)); gain.connect(stereo); stereo.connect(this.master);
    return { gain, stereo, t, end: t + duration };
  }
  private tone(frequency: number, endFrequency: number, duration: number, volume: number, type: OscillatorType = 'sine', delay = 0, pan = 0) {
    const out = this.output(volume, duration, pan, delay); if (!out || !this.context) return;
    const oscillator = this.context.createOscillator(); oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, out.t); oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), out.end);
    oscillator.connect(out.gain); oscillator.start(out.t); oscillator.stop(out.end + .02);
    oscillator.onended = () => { oscillator.disconnect(); out.gain.disconnect(); out.stereo.disconnect(); };
  }
  private burst(duration: number, volume: number, frequency: number, pan = 0, delay = 0) {
    const out = this.output(volume, duration, pan, delay); if (!out || !this.context || !this.noise) return;
    const source = this.context.createBufferSource(), filter = this.context.createBiquadFilter();
    source.buffer = this.noise; filter.type = 'lowpass'; filter.frequency.value = frequency;
    source.connect(filter); filter.connect(out.gain); source.start(out.t, Math.random()); source.stop(out.end + .02);
    source.onended = () => { source.disconnect(); filter.disconnect(); out.gain.disconnect(); out.stereo.disconnect(); };
  }
  shot(id: WeaponId, volume = 1, pan = 0) {
    if (id === 'knife') { this.burst(.12, .15 * volume, 1800, pan); return; }
    const config: Record<string, number[]> = {
      ak: [95, .22, .6, 6500], m4: [145, .14, .42, 4700], awp: [52, .5, .95, 8500],
      glock: [220, .12, .32, 7200], usp: [290, .09, .23, 2100], deagle: [82, .28, .65, 6400],
    };
    const [f, duration, amplitude, cutoff] = config[id];
    this.burst(duration, amplitude * volume, cutoff, pan);
    this.tone(f, 30, duration * .8, amplitude * .65 * volume, 'triangle', 0, pan);
    this.burst(duration * .6, amplitude * .12 * volume, 1400, pan, .075);
  }
  reload() { this.burst(.09, .16, 2800); this.burst(.12, .2, 2000, 0, .65); this.tone(360, 110, .1, .07, 'square', 1.2); }
  foot(volume = 1, pan = 0) { this.burst(.11, .1 * volume, 850, pan); this.tone(75, 35, .08, .08 * volume, 'sine', 0, pan); }
  scope() { this.tone(740, 240, .075, .07, 'triangle'); this.burst(.04, .05, 3000); }
  hit(head = false) { this.tone(head ? 1450 : 900, head ? 2200 : 600, .08, .14, 'triangle'); }
  kill() { this.tone(650, 650, .12, .11, 'sine'); this.tone(980, 980, .2, .12, 'sine', .085); }
  plant() { this.tone(1100, 1100, .12, .12, 'square'); this.tone(1500, 1500, .14, .1, 'square', .16); }
  defuse() { for (let i = 0; i < 4; i++) this.tone(600 + i * 180, 600 + i * 180, .2, .1, 'sine', i * .11); }
  beep() { this.tone(1900, 1900, .1, .11, 'sine'); }
  explosion() { this.burst(1.8, 1, 2000); this.tone(65, 12, 1.7, .85, 'triangle'); this.burst(.7, .5, 600, 0, .15); }
  round(win: boolean) { [0, 1, 2].forEach(i => this.tone((win ? 420 : 350) + (win ? 170 : -65) * i, (win ? 420 : 350) + (win ? 170 : -65) * i, .4, .11, 'sine', i * .16)); }
  dispose() { void this.context?.close(); this.context = null; }
}

import type { WeaponId } from './types';

export class SoundSystem {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  resume() {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.52;
      this.master.connect(this.context.destination);
      this.noiseBuffer = this.context.createBuffer(1, this.context.sampleRate * 2, this.context.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.context.state === 'suspended') void this.context.resume();
  }

  private output(volume: number, distance: number) {
    if (!this.context || !this.master) return null;
    const gain = this.context.createGain();
    gain.gain.value = volume / (1 + Math.max(0, distance) * 0.075);
    gain.connect(this.master);
    return gain;
  }

  private noise(duration: number, volume: number, frequency: number, distance = 0, delay = 0, q = 0.7) {
    if (!this.context || !this.noiseBuffer) return;
    const out = this.output(volume, distance);
    if (!out) return;
    const now = this.context.currentTime + delay;
    const source = this.context.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;
    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(90, frequency * 0.24), now + duration);
    filter.Q.value = q;
    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0.001, now);
    envelope.gain.exponentialRampToValueAtTime(1, now + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);
    source.connect(filter).connect(envelope).connect(out);
    source.start(now, Math.random());
    source.stop(now + duration + 0.02);
  }

  private tone(frequency: number, duration: number, volume: number, type: OscillatorType = 'sine', distance = 0, delay = 0, endFrequency?: number) {
    if (!this.context) return;
    const out = this.output(volume, distance);
    if (!out) return;
    const now = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0.001, now);
    envelope.gain.exponentialRampToValueAtTime(1, now + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(envelope).connect(out);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  weapon(id: WeaponId, distance = 0) {
    this.resume();
    switch (id) {
      case 'ak47':
        this.noise(0.19, 0.75, 3200, distance);
        this.tone(105, 0.16, 0.58, 'sawtooth', distance, 0, 48);
        break;
      case 'm4a4':
        this.noise(0.12, 0.57, 4600, distance);
        this.tone(145, 0.1, 0.36, 'square', distance, 0, 70);
        break;
      case 'awp':
        this.noise(0.48, 1.0, 2500, distance);
        this.tone(66, 0.4, 0.8, 'sawtooth', distance, 0, 30);
        this.noise(0.28, 0.19, 950, distance, 0.12);
        break;
      case 'deagle':
        this.noise(0.22, 0.68, 3000, distance);
        this.tone(90, 0.18, 0.5, 'square', distance, 0, 42);
        break;
      case 'glock':
        this.noise(0.085, 0.4, 5100, distance);
        this.tone(185, 0.07, 0.24, 'square', distance, 0, 100);
        break;
      case 'usp':
        this.noise(0.1, 0.3, 2800, distance);
        this.tone(155, 0.07, 0.2, 'triangle', distance, 0, 85);
        break;
      case 'knife':
        this.noise(0.09, 0.15, 7500, distance);
        this.tone(600, 0.08, 0.08, 'sine', distance, 0, 190);
        break;
    }
  }

  reload(distance = 0) {
    this.noise(0.045, 0.16, 4200, distance);
    this.tone(520, 0.035, 0.1, 'square', distance, 0.18);
    this.noise(0.06, 0.18, 2500, distance, 0.48);
    this.tone(350, 0.04, 0.12, 'square', distance, 0.7);
  }

  footstep(distance = 0, alternate = false) {
    this.noise(0.065, 0.095, alternate ? 700 : 850, distance);
    this.tone(alternate ? 85 : 75, 0.05, 0.05, 'sine', distance);
  }

  scope() {
    this.resume();
    this.noise(0.06, 0.11, 4500);
    this.tone(720, 0.045, 0.07, 'square');
  }

  hit(kill = false) {
    this.resume();
    this.tone(kill ? 880 : 1150, kill ? 0.13 : 0.055, kill ? 0.19 : 0.11, 'sine', 0, 0, kill ? 1320 : 900);
    if (kill) this.tone(1320, 0.15, 0.12, 'sine', 0, 0.08, 1760);
  }

  bombBeep(urgent = false) {
    this.resume();
    this.tone(urgent ? 1550 : 1250, 0.075, 0.13, 'square');
  }

  plant() {
    this.resume();
    this.tone(620, 0.08, 0.12, 'square');
    this.tone(820, 0.08, 0.12, 'square', 0, 0.13);
    this.tone(1120, 0.14, 0.14, 'square', 0, 0.27);
  }

  defuse() {
    this.resume();
    this.noise(0.08, 0.12, 5000);
    this.tone(920, 0.09, 0.12, 'sine');
    this.tone(1380, 0.2, 0.14, 'sine', 0, 0.13);
  }

  explosion() {
    this.resume();
    this.noise(1.8, 1.25, 1800);
    this.noise(0.75, 0.9, 5000);
    this.tone(52, 1.4, 1.1, 'sawtooth', 0, 0, 24);
  }

  dispose() {
    if (this.context) void this.context.close();
    this.context = null;
  }
}

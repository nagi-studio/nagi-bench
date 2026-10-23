import * as THREE from 'three';
import type { WeaponId } from './types';

export class AudioSystem {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private listener = new THREE.Vector3();
  private listenerYaw = 0;
  private muted = false;

  unlock() {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.58;
      this.master.connect(this.context.destination);
      const length = this.context.sampleRate * 2;
      this.noiseBuffer = this.context.createBuffer(1, length, this.context.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        last = last * 0.35 + white * 0.65;
        data[i] = last;
      }
    }
    if (this.context.state === 'suspended') void this.context.resume();
  }

  setListener(position: THREE.Vector3, yaw: number) {
    this.listener.copy(position);
    this.listenerYaw = yaw;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.58, this.context.currentTime, 0.03);
    }
  }

  private spatial(volume: number, position?: THREE.Vector3) {
    if (!position) return { volume, pan: 0 };
    const delta = position.clone().sub(this.listener);
    const distance = delta.length();
    const attenuation = 1 / (1 + (distance / 10) ** 1.65);
    if (distance < 0.01) return { volume, pan: 0 };
    delta.normalize();
    const rightX = Math.cos(this.listenerYaw);
    const rightZ = -Math.sin(this.listenerYaw);
    const pan = THREE.MathUtils.clamp(delta.x * rightX + delta.z * rightZ, -0.9, 0.9);
    return { volume: volume * attenuation, pan };
  }

  private chain(volume: number, position: THREE.Vector3 | undefined, start: number, duration: number, attack = 0.003) {
    const context = this.context!;
    const spatial = this.spatial(this.muted ? 0 : volume, position);
    const envelope = context.createGain();
    const panner = context.createStereoPanner();
    panner.pan.value = spatial.pan;
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, spatial.volume), start + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    envelope.connect(panner);
    panner.connect(this.master!);
    return envelope;
  }

  private tone(
    frequency: number, duration: number, volume: number, type: OscillatorType = 'sine',
    position?: THREE.Vector3, delay = 0, endFrequency?: number,
  ) {
    if (!this.context) return;
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    oscillator.connect(this.chain(volume, position, start, duration));
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private noise(
    duration: number, volume: number, frequency: number, position?: THREE.Vector3,
    delay = 0, filterType: BiquadFilterType = 'lowpass', attack = 0.002,
  ) {
    if (!this.context || !this.noiseBuffer) return;
    const start = this.context.currentTime + delay;
    const source = this.context.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.playbackRate.value = 0.85 + Math.random() * 0.3;
    const filter = this.context.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = filterType === 'bandpass' ? 0.8 : 0.3;
    source.connect(filter);
    filter.connect(this.chain(volume, position, start, duration, attack));
    source.start(start, Math.random());
    source.stop(start + duration + 0.02);
  }

  weapon(id: WeaponId, position?: THREE.Vector3) {
    if (!this.context) return;
    if (id === 'ak47') {
      this.noise(0.14, 0.8, 2700, position);
      this.noise(0.055, 0.34, 5200, position, 0, 'highpass');
      this.tone(112, 0.16, 0.55, 'sawtooth', position, 0, 48);
    } else if (id === 'm4a4') {
      this.noise(0.10, 0.62, 3500, position);
      this.noise(0.045, 0.28, 6000, position, 0, 'highpass');
      this.tone(148, 0.105, 0.34, 'square', position, 0, 70);
    } else if (id === 'awp') {
      this.noise(0.52, 1.1, 1900, position, 0, 'lowpass', 0.004);
      this.noise(0.12, 0.55, 4800, position, 0, 'highpass');
      this.noise(0.34, 0.25, 1200, position, 0.11);
      this.tone(68, 0.55, 0.8, 'sawtooth', position, 0, 28);
    } else if (id === 'deagle') {
      this.noise(0.20, 0.8, 2900, position);
      this.tone(92, 0.23, 0.55, 'sawtooth', position, 0, 42);
    } else if (id === 'glock') {
      this.noise(0.075, 0.52, 4300, position);
      this.noise(0.035, 0.24, 6800, position, 0, 'highpass');
      this.tone(185, 0.07, 0.2, 'square', position, 0, 110);
    } else if (id === 'usp') {
      this.noise(0.09, 0.34, 1250, position);
      this.tone(155, 0.09, 0.22, 'triangle', position, 0, 85);
    } else {
      this.noise(0.15, 0.24, 1600, position, 0, 'bandpass', 0.025);
      this.tone(240, 0.10, 0.08, 'sine', position, 0, 90);
    }
  }

  dryFire() {
    this.tone(950, 0.025, 0.08, 'square');
    this.tone(520, 0.035, 0.06, 'square', undefined, 0.035);
  }

  reload(position?: THREE.Vector3, long = false) {
    this.noise(0.035, 0.18, 3200, position, 0, 'bandpass');
    this.tone(430, 0.035, 0.08, 'square', position, 0.03);
    this.noise(0.045, 0.20, 2300, position, long ? 0.65 : 0.42, 'bandpass');
    this.tone(610, 0.04, 0.10, 'square', position, long ? 1.5 : 1.15);
    this.noise(0.035, 0.15, 4000, position, long ? 1.65 : 1.3, 'bandpass');
  }

  footstep(position?: THREE.Vector3, running = false) {
    this.noise(0.075, running ? 0.22 : 0.13, 420 + Math.random() * 180, position);
    this.tone(75 + Math.random() * 18, 0.06, running ? 0.10 : 0.055, 'sine', position, 0, 45);
  }

  scope(open: boolean) {
    this.tone(open ? 840 : 620, 0.035, 0.10, 'square');
    this.noise(0.045, 0.09, 3400, undefined, 0.025, 'bandpass');
  }

  hit(headshot = false) {
    this.tone(headshot ? 1650 : 1180, 0.045, 0.14, 'square');
    this.tone(headshot ? 2200 : 1480, 0.035, 0.08, 'sine', undefined, 0.025);
  }

  kill() {
    this.tone(520, 0.09, 0.13, 'triangle');
    this.tone(780, 0.13, 0.14, 'triangle', undefined, 0.075);
    this.tone(1040, 0.16, 0.10, 'sine', undefined, 0.15);
  }

  plant(position?: THREE.Vector3) {
    for (let i = 0; i < 5; i++) {
      this.tone(880 + i * 55, 0.065, 0.13, 'square', position, i * 0.16);
    }
    this.noise(0.10, 0.14, 2500, position, 0.75, 'bandpass');
  }

  defuse(position?: THREE.Vector3) {
    this.noise(0.07, 0.14, 3800, position, 0, 'bandpass');
    this.tone(420, 0.08, 0.10, 'square', position, 0.1);
    this.tone(620, 0.12, 0.13, 'sine', position, 0.24);
  }

  bombBeep(position: THREE.Vector3, urgent: boolean) {
    this.tone(urgent ? 1320 : 1040, urgent ? 0.065 : 0.085, 0.22, 'square', position);
  }

  explosion(position: THREE.Vector3) {
    this.noise(1.8, 1.5, 850, position, 0, 'lowpass', 0.008);
    this.noise(0.35, 0.8, 4600, position, 0, 'highpass');
    this.noise(1.2, 0.42, 1200, position, 0.18);
    this.tone(48, 1.7, 1.1, 'sawtooth', position, 0, 20);
  }

  round(won: boolean) {
    const notes = won ? [392, 523, 659] : [330, 277, 220];
    notes.forEach((note, index) => this.tone(note, 0.28, 0.11, 'triangle', undefined, index * 0.16));
  }

  dispose() {
    if (this.context) void this.context.close();
    this.context = null;
    this.master = null;
    this.noiseBuffer = null;
  }
}

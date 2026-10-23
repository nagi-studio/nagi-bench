import type { WeaponId } from './types';

const MASTER_GAIN = 0.2;
const NOISE_SECONDS = 2;
const START_OFFSET = 0.005;

type AudioContextConstructor = new () => AudioContext;

interface FilterSpec {
  type: BiquadFilterType;
  frequency: number;
  endFrequency?: number;
  q?: number;
}

interface ToneSpec {
  start: number;
  duration: number;
  frequency: number;
  endFrequency?: number;
  type: OscillatorType;
  volume: number;
  attack?: number;
  filter?: FilterSpec;
}

interface NoiseSpec {
  start: number;
  duration: number;
  volume: number;
  attack?: number;
  filter: FilterSpec;
}

function findAudioContextConstructor(): AudioContextConstructor | null {
  const scope = globalThis as unknown as {
    AudioContext?: AudioContextConstructor;
    webkitAudioContext?: AudioContextConstructor;
  };
  return scope.AudioContext ?? scope.webkitAudioContext ?? null;
}

export class AudioSystem {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private muted = false;
  private disposed = false;
  private timers = new Set<ReturnType<typeof setTimeout>>();

  constructor() {}

  resume(): void {
    if (this.disposed) return;

    let context = this.context;
    if (context?.state === 'closed') {
      this.context = null;
      this.master = null;
      this.noiseBuffer = null;
      context = null;
    }

    if (!context) {
      const Constructor = findAudioContextConstructor();
      if (!Constructor) return;

      try {
        context = new Constructor();
        const master = context.createGain();
        master.gain.value = this.muted ? 0 : MASTER_GAIN;
        master.connect(context.destination);
        this.context = context;
        this.master = master;
      } catch {
        if (context) {
          try {
            void context.close().catch(() => undefined);
          } catch {}
        }
        this.context = null;
        this.master = null;
        this.noiseBuffer = null;
        return;
      }
    }

    if (!context || context.state === 'running') return;
    try {
      void context.resume().catch(() => undefined);
    } catch {}
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (!this.master) return;
    try {
      this.master.gain.value = muted ? 0 : MASTER_GAIN;
    } catch {}
  }

  isMuted(): boolean {
    return this.muted;
  }

  shot(id: WeaponId, distance = 0): void {
    const context = this.audibleContext();
    if (!context) return;

    try {
      const destination = this.createBus(context, distance);
      if (!destination) return;
      const start = context.currentTime + START_OFFSET;

      switch (id) {
        case 'ak47':
          this.tone(context, destination, {
            start,
            duration: 0.18,
            frequency: 132,
            endFrequency: 46,
            type: 'sawtooth',
            volume: 0.42,
            attack: 0.002,
            filter: { type: 'lowpass', frequency: 1000, endFrequency: 260, q: 0.7 },
          });
          this.noise(context, destination, {
            start,
            duration: 0.14,
            volume: 0.3,
            attack: 0.001,
            filter: { type: 'lowpass', frequency: 1600, endFrequency: 360, q: 0.6 },
          });
          this.noise(context, destination, {
            start,
            duration: 0.025,
            volume: 0.1,
            filter: { type: 'highpass', frequency: 1900, q: 0.5 },
          });
          break;

        case 'm4a4':
          this.tone(context, destination, {
            start,
            duration: 0.105,
            frequency: 280,
            endFrequency: 92,
            type: 'triangle',
            volume: 0.28,
            attack: 0.001,
            filter: { type: 'lowpass', frequency: 2400, endFrequency: 850, q: 0.7 },
          });
          this.noise(context, destination, {
            start,
            duration: 0.075,
            volume: 0.24,
            attack: 0.001,
            filter: { type: 'bandpass', frequency: 2500, endFrequency: 1100, q: 0.8 },
          });
          this.noise(context, destination, {
            start,
            duration: 0.022,
            volume: 0.07,
            filter: { type: 'highpass', frequency: 4000, q: 0.5 },
          });
          break;

        case 'awp':
          this.tone(context, destination, {
            start,
            duration: 0.3,
            frequency: 104,
            endFrequency: 30,
            type: 'sawtooth',
            volume: 0.5,
            attack: 0.002,
            filter: { type: 'lowpass', frequency: 820, endFrequency: 180, q: 0.8 },
          });
          this.noise(context, destination, {
            start,
            duration: 0.24,
            volume: 0.38,
            attack: 0.001,
            filter: { type: 'lowpass', frequency: 1500, endFrequency: 220, q: 0.7 },
          });
          this.noise(context, destination, {
            start,
            duration: 0.04,
            volume: 0.12,
            filter: { type: 'highpass', frequency: 2300, q: 0.5 },
          });
          this.tone(context, destination, {
            start: start + 0.02,
            duration: 1.7,
            frequency: 92,
            endFrequency: 28,
            type: 'sine',
            volume: 0.18,
            attack: 0.008,
            filter: { type: 'lowpass', frequency: 600, endFrequency: 100, q: 0.6 },
          });
          this.noise(context, destination, {
            start: start + 0.04,
            duration: 1.9,
            volume: 0.16,
            attack: 0.008,
            filter: { type: 'lowpass', frequency: 900, endFrequency: 100, q: 0.6 },
          });
          for (let index = 0; index < 5; index += 1) {
            const echoStart = start + 0.16 + index * 0.19;
            const echoVolume = 0.12 / (index + 1);
            this.tone(context, destination, {
              start: echoStart,
              duration: 0.42,
              frequency: 170 - index * 18,
              endFrequency: 52,
              type: 'sine',
              volume: echoVolume,
              attack: 0.004,
              filter: {
                type: 'lowpass',
                frequency: 1100 - index * 120,
                endFrequency: 180,
                q: 0.6,
              },
            });
            this.noise(context, destination, {
              start: echoStart,
              duration: 0.32,
              volume: echoVolume * 0.65,
              attack: 0.004,
              filter: {
                type: 'bandpass',
                frequency: 900 - index * 100,
                endFrequency: 240,
                q: 0.7,
              },
            });
          }
          break;

        case 'glock':
          this.tone(context, destination, {
            start,
            duration: 0.12,
            frequency: 360,
            endFrequency: 120,
            type: 'triangle',
            volume: 0.24,
            attack: 0.001,
            filter: { type: 'lowpass', frequency: 2800, endFrequency: 900, q: 0.7 },
          });
          this.noise(context, destination, {
            start,
            duration: 0.065,
            volume: 0.2,
            attack: 0.001,
            filter: { type: 'highpass', frequency: 2200, endFrequency: 1100, q: 0.6 },
          });
          break;

        case 'usp':
          this.tone(context, destination, {
            start,
            duration: 0.15,
            frequency: 220,
            endFrequency: 72,
            type: 'sine',
            volume: 0.28,
            attack: 0.002,
            filter: { type: 'lowpass', frequency: 1200, endFrequency: 360, q: 0.7 },
          });
          this.noise(context, destination, {
            start,
            duration: 0.09,
            volume: 0.13,
            attack: 0.001,
            filter: { type: 'lowpass', frequency: 1100, endFrequency: 280, q: 0.7 },
          });
          this.tone(context, destination, {
            start,
            duration: 0.05,
            frequency: 900,
            endFrequency: 300,
            type: 'triangle',
            volume: 0.06,
            filter: { type: 'lowpass', frequency: 1800, q: 0.6 },
          });
          break;

        case 'deagle':
          this.tone(context, destination, {
            start,
            duration: 0.24,
            frequency: 190,
            endFrequency: 42,
            type: 'sawtooth',
            volume: 0.44,
            attack: 0.002,
            filter: { type: 'lowpass', frequency: 1300, endFrequency: 250, q: 0.8 },
          });
          this.noise(context, destination, {
            start,
            duration: 0.16,
            volume: 0.32,
            attack: 0.001,
            filter: { type: 'bandpass', frequency: 1500, endFrequency: 420, q: 0.7 },
          });
          this.noise(context, destination, {
            start,
            duration: 0.03,
            volume: 0.1,
            filter: { type: 'highpass', frequency: 2600, q: 0.5 },
          });
          break;

        case 'knife':
          this.noise(context, destination, {
            start,
            duration: 0.24,
            volume: 0.22,
            attack: 0.01,
            filter: { type: 'bandpass', frequency: 480, endFrequency: 2200, q: 0.7 },
          });
          this.noise(context, destination, {
            start: start + 0.07,
            duration: 0.18,
            volume: 0.14,
            attack: 0.006,
            filter: { type: 'bandpass', frequency: 2200, endFrequency: 500, q: 0.7 },
          });
          this.tone(context, destination, {
            start,
            duration: 0.18,
            frequency: 160,
            endFrequency: 70,
            type: 'sine',
            volume: 0.035,
            attack: 0.005,
            filter: { type: 'lowpass', frequency: 500, endFrequency: 160, q: 0.6 },
          });
          break;

        default:
          break;
      }
    } catch {}
  }

  reload(distance = 0): void {
    if (!this.audibleContext()) return;
    this.playReloadMetal(distance, false);
    this.schedule(() => this.playReloadMetal(distance, true), 190);
  }

  footstep(distance = 0): void {
    const context = this.audibleContext();
    if (!context) return;

    try {
      const destination = this.createBus(context, distance);
      if (!destination) return;
      const start = context.currentTime + START_OFFSET;
      const variation = 0.9 + Math.random() * 0.2;
      this.noise(context, destination, {
        start,
        duration: 0.085,
        volume: 0.17,
        attack: 0.002,
        filter: {
          type: 'bandpass',
          frequency: 950 * variation,
          endFrequency: 300 * variation,
          q: 0.8,
        },
      });
      this.noise(context, destination, {
        start: start + 0.008,
        duration: 0.045,
        volume: 0.065,
        attack: 0.001,
        filter: {
          type: 'highpass',
          frequency: 1600 * variation,
          endFrequency: 800 * variation,
          q: 0.6,
        },
      });
      this.tone(context, destination, {
        start,
        duration: 0.075,
        frequency: 82 * variation,
        endFrequency: 44 * variation,
        type: 'sine',
        volume: 0.055,
        attack: 0.002,
        filter: { type: 'lowpass', frequency: 180, q: 0.7 },
      });
    } catch {}
  }

  scope(): void {
    const context = this.audibleContext();
    if (!context) return;

    try {
      const destination = this.createBus(context, 0);
      if (!destination) return;
      const start = context.currentTime + START_OFFSET;
      this.tone(context, destination, {
        start,
        duration: 0.038,
        frequency: 1350,
        endFrequency: 520,
        type: 'square',
        volume: 0.09,
        attack: 0.001,
        filter: { type: 'bandpass', frequency: 1900, q: 4 },
      });
      this.noise(context, destination, {
        start,
        duration: 0.025,
        volume: 0.05,
        filter: { type: 'highpass', frequency: 2500, q: 0.7 },
      });
      this.tone(context, destination, {
        start: start + 0.055,
        duration: 0.045,
        frequency: 820,
        endFrequency: 320,
        type: 'square',
        volume: 0.07,
        attack: 0.001,
        filter: { type: 'bandpass', frequency: 1300, q: 4 },
      });
    } catch {}
  }

  hit(): void {
    const context = this.audibleContext();
    if (!context) return;

    try {
      const destination = this.createBus(context, 0);
      if (!destination) return;
      const start = context.currentTime + START_OFFSET;
      this.tone(context, destination, {
        start,
        duration: 0.08,
        frequency: 980,
        endFrequency: 1440,
        type: 'sine',
        volume: 0.16,
        attack: 0.001,
        filter: { type: 'lowpass', frequency: 2600, q: 0.6 },
      });
      this.tone(context, destination, {
        start: start + 0.018,
        duration: 0.055,
        frequency: 1760,
        endFrequency: 1100,
        type: 'triangle',
        volume: 0.055,
        attack: 0.001,
        filter: { type: 'bandpass', frequency: 2200, q: 1.2 },
      });
      this.noise(context, destination, {
        start,
        duration: 0.025,
        volume: 0.04,
        filter: { type: 'bandpass', frequency: 2800, q: 2 },
      });
    } catch {}
  }

  kill(): void {
    const context = this.audibleContext();
    if (!context) return;

    try {
      const destination = this.createBus(context, 0);
      if (!destination) return;
      const start = context.currentTime + START_OFFSET;
      this.tone(context, destination, {
        start,
        duration: 0.13,
        frequency: 392,
        endFrequency: 440,
        type: 'triangle',
        volume: 0.12,
        attack: 0.004,
        filter: { type: 'lowpass', frequency: 1800, q: 0.6 },
      });
      this.tone(context, destination, {
        start: start + 0.09,
        duration: 0.15,
        frequency: 587,
        endFrequency: 660,
        type: 'triangle',
        volume: 0.14,
        attack: 0.004,
        filter: { type: 'lowpass', frequency: 2100, q: 0.6 },
      });
      this.tone(context, destination, {
        start: start + 0.19,
        duration: 0.24,
        frequency: 784,
        endFrequency: 1046,
        type: 'sine',
        volume: 0.16,
        attack: 0.005,
        filter: { type: 'lowpass', frequency: 2600, q: 0.6 },
      });
    } catch {}
  }

  plant(): void {
    if (!this.audibleContext()) return;
    this.playPlantBeep(520, false);
    this.schedule(() => this.playPlantBeep(620, false), 160);
    this.schedule(() => this.playPlantBeep(740, false), 320);
    this.schedule(() => this.playPlantBeep(920, true), 480);
  }

  defuse(): void {
    const context = this.audibleContext();
    if (!context) return;

    try {
      const destination = this.createBus(context, 0);
      if (!destination) return;
      const start = context.currentTime + START_OFFSET;
      this.tone(context, destination, {
        start,
        duration: 0.18,
        frequency: 523.25,
        endFrequency: 528,
        type: 'sine',
        volume: 0.11,
        attack: 0.006,
        filter: { type: 'lowpass', frequency: 2400, q: 0.5 },
      });
      this.tone(context, destination, {
        start: start + 0.11,
        duration: 0.18,
        frequency: 659.25,
        endFrequency: 665,
        type: 'sine',
        volume: 0.11,
        attack: 0.006,
        filter: { type: 'lowpass', frequency: 2400, q: 0.5 },
      });
      this.tone(context, destination, {
        start: start + 0.22,
        duration: 0.22,
        frequency: 783.99,
        endFrequency: 792,
        type: 'sine',
        volume: 0.12,
        attack: 0.006,
        filter: { type: 'lowpass', frequency: 2500, q: 0.5 },
      });
      this.tone(context, destination, {
        start: start + 0.34,
        duration: 0.45,
        frequency: 1046.5,
        endFrequency: 1058,
        type: 'sine',
        volume: 0.16,
        attack: 0.008,
        filter: { type: 'lowpass', frequency: 2800, q: 0.5 },
      });
      this.tone(context, destination, {
        start: start + 0.34,
        duration: 0.4,
        frequency: 1567.98,
        endFrequency: 1584,
        type: 'triangle',
        volume: 0.035,
        attack: 0.008,
        filter: { type: 'lowpass', frequency: 3000, q: 0.5 },
      });
    } catch {}
  }

  explosion(): void {
    const context = this.audibleContext();
    if (!context) return;

    try {
      const destination = this.createBus(context, 0);
      if (!destination) return;
      const start = context.currentTime + START_OFFSET;
      this.tone(context, destination, {
        start,
        duration: 1.25,
        frequency: 68,
        endFrequency: 24,
        type: 'sine',
        volume: 0.65,
        attack: 0.003,
        filter: { type: 'lowpass', frequency: 180, endFrequency: 60, q: 0.8 },
      });
      this.tone(context, destination, {
        start: start + 0.02,
        duration: 1.7,
        frequency: 43,
        endFrequency: 20,
        type: 'triangle',
        volume: 0.25,
        attack: 0.004,
        filter: { type: 'lowpass', frequency: 120, endFrequency: 45, q: 0.7 },
      });
      this.noise(context, destination, {
        start,
        duration: 1.1,
        volume: 0.6,
        attack: 0.003,
        filter: { type: 'lowpass', frequency: 900, endFrequency: 100, q: 0.8 },
      });
      this.noise(context, destination, {
        start,
        duration: 0.3,
        volume: 0.18,
        attack: 0.001,
        filter: { type: 'highpass', frequency: 1400, endFrequency: 420, q: 0.6 },
      });
    } catch {}
  }

  ui(): void {
    const context = this.audibleContext();
    if (!context) return;

    try {
      const destination = this.createBus(context, 0);
      if (!destination) return;
      const start = context.currentTime + START_OFFSET;
      this.tone(context, destination, {
        start,
        duration: 0.06,
        frequency: 660,
        endFrequency: 880,
        type: 'sine',
        volume: 0.09,
        attack: 0.003,
        filter: { type: 'lowpass', frequency: 2200, q: 0.5 },
      });
      this.noise(context, destination, {
        start,
        duration: 0.018,
        volume: 0.025,
        filter: { type: 'highpass', frequency: 1800, q: 0.5 },
      });
    } catch {}
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();

    const context = this.context;
    const master = this.master;
    this.context = null;
    this.master = null;
    this.noiseBuffer = null;

    if (master) {
      try {
        master.disconnect();
      } catch {}
    }
    if (context && context.state !== 'closed') {
      try {
        void context.close().catch(() => undefined);
      } catch {}
    }
  }

  private audibleContext(): AudioContext | null {
    if (
      this.disposed ||
      !this.context ||
      !this.master ||
      this.context.state !== 'running'
    ) {
      return null;
    }
    return this.context;
  }

  private createBus(context: AudioContext, distance: number): GainNode | null {
    if (!this.master) return null;
    const bus = context.createGain();
    bus.gain.value = this.distanceGain(distance);
    bus.connect(this.master);
    return bus;
  }

  private distanceGain(distance: number): number {
    if (Number.isNaN(distance)) return 1;
    return 1 / (1 + Math.max(0, distance) * 0.055);
  }

  private getNoiseBuffer(context: AudioContext): AudioBuffer | null {
    if (this.noiseBuffer) return this.noiseBuffer;

    try {
      const sampleRate = context.sampleRate;
      const length = Math.max(1, Math.floor(sampleRate * NOISE_SECONDS));
      const buffer = context.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1) {
        data[index] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
      return buffer;
    } catch {
      return null;
    }
  }

  private createFilter(
    context: AudioContext,
    spec: FilterSpec,
    start: number,
    duration: number,
  ): BiquadFilterNode {
    const filter = context.createBiquadFilter();
    filter.type = spec.type;
    filter.frequency.setValueAtTime(Math.max(10, spec.frequency), start);
    if (spec.endFrequency !== undefined) {
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(10, spec.endFrequency),
        start + Math.max(0.01, duration),
      );
    }
    filter.Q.setValueAtTime(Math.max(0.001, spec.q ?? 0.7), start);
    return filter;
  }

  private envelope(
    param: AudioParam,
    start: number,
    duration: number,
    volume: number,
    attack: number,
  ): void {
    const end = start + Math.max(0.01, duration);
    const attackEnd = Math.min(end - 0.001, start + Math.max(0.001, attack));
    param.value = 0;
    param.setValueAtTime(0.0001, start);
    param.linearRampToValueAtTime(Math.max(0.0001, volume), attackEnd);
    param.exponentialRampToValueAtTime(0.0001, end);
    param.setValueAtTime(0, end + 0.02);
  }

  private tone(context: AudioContext, destination: AudioNode, spec: ToneSpec): void {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const start = spec.start;
    const duration = Math.max(0.01, spec.duration);
    const frequency = Math.max(1, spec.frequency);
    const endFrequency = Math.max(1, spec.endFrequency ?? spec.frequency);

    oscillator.type = spec.type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (frequency !== endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    }

    if (spec.filter) {
      const filter = this.createFilter(context, spec.filter, start, duration);
      oscillator.connect(filter);
      filter.connect(envelope);
    } else {
      oscillator.connect(envelope);
    }
    envelope.connect(destination);
    this.envelope(envelope.gain, start, duration, spec.volume, spec.attack ?? 0.005);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.025);
  }

  private noise(context: AudioContext, destination: AudioNode, spec: NoiseSpec): void {
    const buffer = this.getNoiseBuffer(context);
    if (!buffer) return;

    const source = context.createBufferSource();
    const duration = Math.max(0.01, spec.duration);
    const filter = this.createFilter(context, spec.filter, spec.start, duration);
    const envelope = context.createGain();

    source.buffer = buffer;
    source.loop = true;
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(destination);
    this.envelope(
      envelope.gain,
      spec.start,
      duration,
      spec.volume,
      spec.attack ?? 0.003,
    );
    source.start(spec.start, Math.random() * buffer.duration);
    source.stop(spec.start + duration + 0.025);
  }

  private playReloadMetal(distance: number, second: boolean): void {
    const context = this.audibleContext();
    if (!context) return;

    try {
      const destination = this.createBus(context, distance);
      if (!destination) return;
      const start = context.currentTime + START_OFFSET;
      const base = second ? 480 : 760;
      this.tone(context, destination, {
        start,
        duration: second ? 0.09 : 0.07,
        frequency: base,
        endFrequency: base * 0.55,
        type: 'square',
        volume: second ? 0.1 : 0.12,
        attack: 0.001,
        filter: {
          type: 'bandpass',
          frequency: second ? 1200 : 1900,
          q: 5,
        },
      });
      this.tone(context, destination, {
        start: start + 0.012,
        duration: 0.055,
        frequency: base * 1.8,
        endFrequency: base * 1.2,
        type: 'sine',
        volume: 0.055,
        attack: 0.001,
        filter: { type: 'bandpass', frequency: second ? 1800 : 2600, q: 4 },
      });
      this.noise(context, destination, {
        start,
        duration: second ? 0.055 : 0.045,
        volume: 0.07,
        filter: { type: 'highpass', frequency: 2400, q: 0.8 },
      });
    } catch {}
  }

  private playPlantBeep(frequency: number, finalBeep: boolean): void {
    const context = this.audibleContext();
    if (!context) return;

    try {
      const destination = this.createBus(context, 0);
      if (!destination) return;
      const start = context.currentTime + START_OFFSET;
      this.tone(context, destination, {
        start,
        duration: finalBeep ? 0.18 : 0.09,
        frequency,
        endFrequency: frequency,
        type: 'square',
        volume: finalBeep ? 0.15 : 0.12,
        attack: 0.003,
        filter: { type: 'lowpass', frequency: 1800, q: 0.6 },
      });
      this.tone(context, destination, {
        start,
        duration: finalBeep ? 0.16 : 0.075,
        frequency: frequency * 2,
        endFrequency: frequency * 2,
        type: 'sine',
        volume: 0.025,
        attack: 0.003,
        filter: { type: 'lowpass', frequency: 2400, q: 0.5 },
      });
    } catch {}
  }

  private schedule(callback: () => void, delay: number): void {
    if (this.disposed) return;
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      if (this.disposed) return;
      try {
        callback();
      } catch {}
    }, delay);
    this.timers.add(timer);
  }
}

import type { WeaponId } from './types';

export class GameAudio {
  private ctx: AudioContext | null = null;
  private noise: AudioBuffer | null = null;

  resume() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1;
      this.noise = buffer;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  private tone(freq: number, endFreq: number, duration: number, volume: number, type: OscillatorType = 'sine', delay = 0) {
    const ctx = this.ctx; if (!ctx) return;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    const t = ctx.currentTime + delay;
    osc.type = type; osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + duration);
    gain.gain.setValueAtTime(Math.max(.0001, volume), t); gain.gain.exponentialRampToValueAtTime(.0001, t + duration);
    osc.connect(gain).connect(ctx.destination); osc.start(t); osc.stop(t + duration + .01);
  }

  private hiss(duration: number, volume: number, cutoff: number, delay = 0) {
    const ctx = this.ctx; if (!ctx || !this.noise) return;
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    const t = ctx.currentTime + delay;
    source.buffer = this.noise; filter.type = 'lowpass'; filter.frequency.value = cutoff;
    gain.gain.setValueAtTime(Math.max(.0001, volume), t); gain.gain.exponentialRampToValueAtTime(.0001, t + duration);
    source.connect(filter).connect(gain).connect(ctx.destination); source.start(t); source.stop(t + duration + .01);
  }

  shot(id: WeaponId, volume = 1) {
    if (id === 'knife') { this.hiss(.17, .14 * volume, 1700); this.tone(240, 90, .14, .08 * volume); return; }
    const awp = id === 'awp', rifle = id === 'ak' || id === 'm4';
    const v = (awp ? .58 : rifle ? .39 : .24) * volume;
    this.hiss(awp ? .62 : rifle ? .32 : .18, v, awp ? 1150 : id === 'ak' ? 1450 : id === 'm4' ? 2200 : 3300);
    this.tone(awp ? 95 : id === 'ak' ? 135 : id === 'm4' ? 180 : id === 'deagle' ? 210 : 310,
      awp ? 35 : 72, awp ? .52 : rifle ? .26 : .15, v * .8, 'sawtooth');
    if (awp) this.hiss(.28, .14 * volume, 500, .08);
  }
  reload() { this.hiss(.055, .09, 3500); this.tone(790, 370, .07, .065, 'square', .02); this.tone(470, 210, .1, .065, 'square', .31); }
  footstep() { this.hiss(.085, .045, 500); this.tone(90, 48, .07, .022); }
  scope() { this.tone(850, 460, .09, .07, 'square'); this.tone(300, 190, .08, .035, 'sine', .06); }
  hit() { this.tone(800, 460, .09, .075, 'sine'); }
  plant() { this.tone(420, 530, .1, .075, 'square'); this.tone(610, 780, .13, .08, 'square', .12); }
  defuse() { this.tone(780, 580, .11, .08, 'sine'); this.tone(980, 1350, .22, .08, 'sine', .13); }
  beep() { this.tone(920, 730, .1, .09, 'square'); }
  explosion() { this.hiss(1.2, .55, 450); this.tone(82, 28, 1.1, .48, 'sawtooth'); }
  kill() { this.tone(570, 790, .1, .09, 'sine'); this.tone(900, 1170, .17, .09, 'sine', .1); }
}

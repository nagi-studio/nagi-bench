// Procedural audio synthesis using Web Audio API
export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.ctx.destination);
    this.initialized = true;
  }

  private ensureCtx(): AudioContext {
    if (!this.ctx) this.init();
    return this.ctx!;
  }

  private noise(duration: number, gain: number, filterFreq?: number, filterType?: BiquadFilterType): void {
    const ctx = this.ensureCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    if (filterFreq) {
      const filter = ctx.createBiquadFilter();
      filter.type = filterType || 'lowpass';
      filter.frequency.value = filterFreq;
      source.connect(filter);
      filter.connect(gainNode);
    } else {
      source.connect(gainNode);
    }
    gainNode.connect(this.masterGain!);
    source.start();
    source.stop(ctx.currentTime + duration);
  }

  private tone(freq: number, duration: number, gain: number, type: OscillatorType = 'sine', freqEnd?: number) {
    const ctx = this.ensureCtx();
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (freqEnd) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
    }
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gainNode);
    gainNode.connect(this.masterGain!);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  // Weapon fire sounds
  playAK47() {
    this.noise(0.12, 0.8, 2000, 'lowpass');
    this.tone(150, 0.08, 0.5, 'sawtooth', 50);
    this.noise(0.05, 0.4, 4000, 'highpass');
  }

  playM4A4() {
    this.noise(0.09, 0.6, 2500, 'lowpass');
    this.tone(180, 0.06, 0.4, 'sawtooth', 60);
    this.noise(0.04, 0.3, 5000, 'highpass');
  }

  playAWP() {
    this.noise(0.25, 1.0, 1500, 'lowpass');
    this.tone(80, 0.2, 0.7, 'sawtooth', 30);
    this.noise(0.15, 0.5, 3000, 'bandpass');
    // Bolt action
    setTimeout(() => this.noise(0.08, 0.3, 6000, 'highpass'), 300);
  }

  playGlock() {
    this.noise(0.06, 0.4, 3000, 'lowpass');
    this.tone(250, 0.04, 0.3, 'square', 100);
  }

  playUSP() {
    this.noise(0.05, 0.35, 3500, 'lowpass');
    this.tone(280, 0.03, 0.25, 'square', 120);
  }

  playDeagle() {
    this.noise(0.1, 0.6, 2000, 'lowpass');
    this.tone(120, 0.08, 0.5, 'sawtooth', 40);
    this.noise(0.06, 0.3, 4000, 'highpass');
  }

  playKnife() {
    this.noise(0.08, 0.3, 8000, 'highpass');
    this.tone(800, 0.05, 0.2, 'sine', 200);
  }

  playFireSound(weaponId: string) {
    switch (weaponId) {
      case 'ak47': this.playAK47(); break;
      case 'm4a4': this.playM4A4(); break;
      case 'awp': this.playAWP(); break;
      case 'glock': this.playGlock(); break;
      case 'usp': this.playUSP(); break;
      case 'deagle': this.playDeagle(); break;
      case 'knife': this.playKnife(); break;
    }
  }

  playReload() {
    // Magazine out
    this.noise(0.05, 0.3, 5000, 'highpass');
    setTimeout(() => this.noise(0.04, 0.25, 6000, 'highpass'), 400);
    // Magazine in
    setTimeout(() => {
      this.noise(0.06, 0.4, 4000, 'highpass');
      this.tone(500, 0.03, 0.2, 'square');
    }, 900);
    // Bolt
    setTimeout(() => this.noise(0.05, 0.3, 7000, 'highpass'), 1400);
  }

  playFootstep() {
    this.noise(0.06, 0.15, 800, 'lowpass');
  }

  playScope() {
    this.tone(1200, 0.08, 0.2, 'sine', 800);
    this.noise(0.04, 0.15, 6000, 'highpass');
  }

  playHitmarker() {
    this.tone(1000, 0.05, 0.3, 'square');
    this.tone(1500, 0.03, 0.2, 'sine');
  }

  playHeadshot() {
    this.tone(800, 0.06, 0.4, 'square');
    this.tone(1200, 0.04, 0.3, 'sine');
    this.noise(0.03, 0.2, 8000, 'highpass');
  }

  playKill() {
    this.tone(600, 0.1, 0.3, 'sine');
    setTimeout(() => this.tone(900, 0.15, 0.3, 'sine'), 100);
  }

  playC4Plant() {
    this.tone(400, 0.1, 0.3, 'square');
    setTimeout(() => this.tone(600, 0.1, 0.3, 'square'), 150);
    setTimeout(() => this.tone(800, 0.15, 0.4, 'square'), 300);
  }

  playC4Beep() {
    this.tone(1000, 0.05, 0.4, 'square');
  }

  playC4Defuse() {
    this.noise(0.1, 0.2, 3000, 'bandpass');
    this.tone(300, 0.1, 0.2, 'sine');
  }

  playC4Explosion() {
    this.noise(0.8, 1.0, 500, 'lowpass');
    this.tone(40, 0.6, 0.8, 'sawtooth', 20);
    this.noise(0.5, 0.6, 2000, 'bandpass');
  }

  playRoundStart() {
    this.tone(440, 0.2, 0.3, 'sine');
    setTimeout(() => this.tone(660, 0.3, 0.3, 'sine'), 200);
  }

  playRoundEnd(win: boolean) {
    if (win) {
      this.tone(523, 0.15, 0.3, 'sine');
      setTimeout(() => this.tone(659, 0.15, 0.3, 'sine'), 150);
      setTimeout(() => this.tone(784, 0.3, 0.3, 'sine'), 300);
    } else {
      this.tone(400, 0.2, 0.3, 'sine');
      setTimeout(() => this.tone(300, 0.3, 0.3, 'sine'), 200);
    }
  }

  playDeath() {
    this.tone(200, 0.3, 0.3, 'sawtooth', 80);
    this.noise(0.2, 0.2, 1000, 'lowpass');
  }
}

export const audioManager = new AudioManager();

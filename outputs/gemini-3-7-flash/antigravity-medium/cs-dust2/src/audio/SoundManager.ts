// Web Audio API Procedural Sound Synthesizer for CS Dust2 FPS

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.7;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.8;
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public unlockAudio() {
    this.initContext();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.ctx.currentTime);
    }
  }

  // Create pink/white noise buffer
  private createNoiseBuffer(duration: number): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // pink-ish filter
      lastOut = data[i];
      data[i] *= 3.5;
    }
    return buffer;
  }

  // AK-47: Deep bass punch, metallic crack, aggressive noise
  public playAK47(volume = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Sub-bass thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.15);
    oscGain.gain.setValueAtTime(0.9 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.18);

    // Mechanical crack & muzzle noise
    const noise = this.ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer(0.25);
    if (noiseBuffer) {
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.Q.setValueAtTime(1.2, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(1.2 * volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);
      noise.stop(now + 0.25);
    }
  }

  // M4A4: Tighter, crisper, higher pitch rapid crack
  public playM4A4(volume = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Body thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
    oscGain.gain.setValueAtTime(0.7 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.14);

    // Sharp crack
    const noise = this.ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer(0.18);
    if (noiseBuffer) {
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(1.8, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(1.0 * volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);
      noise.stop(now + 0.18);
    }
  }

  // AWP: Massive thunderous boom, high piercing crack, deep echo tail
  public playAWP(volume = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Deep sub cannon
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.4);
    oscGain.gain.setValueAtTime(1.4 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.45);

    // Explosion blast noise
    const noise = this.ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer(0.6);
    if (noiseBuffer) {
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.5);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(1.5 * volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);
      noise.stop(now + 0.6);
    }
  }

  // Desert Eagle: Heavy punchy hand cannon
  public playDeagle(volume = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.16);
    oscGain.gain.setValueAtTime(1.0 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.2);

    const noise = this.ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer(0.22);
    if (noiseBuffer) {
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(1.1 * volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);
      noise.stop(now + 0.22);
    }
  }

  // Glock: Light polymer crack
  public playGlock(volume = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.09);
    oscGain.gain.setValueAtTime(0.6 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.1);

    const noise = this.ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer(0.12);
    if (noiseBuffer) {
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, now);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.7 * volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);
      noise.stop(now + 0.12);
    }
  }

  // USP-S: Silenced crisp pop
  public playUSP(volume = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer(0.09);
    if (noiseBuffer) {
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3000, now);
      filter.Q.setValueAtTime(3.0, now);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.85 * volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);
      noise.stop(now + 0.09);
    }
  }

  // Knife slash
  public playKnifeSlash(volume = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer(0.15);
    if (noiseBuffer) {
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.12);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(now);
      noise.stop(now + 0.15);
    }
  }

  // Knife Hit
  public playKnifeHit(volume = 1.0) {
    if (this.isMuted) return;
    this.playHitFlesh(volume);
  }

  // Generic weapon fire dispatch
  public playWeaponShot(weaponId: string, volume = 1.0) {
    switch (weaponId) {
      case 'ak47':
        this.playAK47(volume);
        break;
      case 'm4a4':
        this.playM4A4(volume);
        break;
      case 'awp':
        this.playAWP(volume);
        break;
      case 'deagle':
        this.playDeagle(volume);
        break;
      case 'glock':
        this.playGlock(volume);
        break;
      case 'usp':
        this.playUSP(volume);
        break;
      case 'knife':
        this.playKnifeSlash(volume);
        break;
    }
  }

  // Reload sound (Mag drop & slide pull sequence)
  public playReload(volume = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Mag out click
    const click1 = this.ctx.createOscillator();
    const clickGain1 = this.ctx.createGain();
    click1.type = 'square';
    click1.frequency.setValueAtTime(600, now + 0.1);
    clickGain1.gain.setValueAtTime(0.3 * volume, now + 0.1);
    clickGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    click1.connect(clickGain1);
    clickGain1.connect(this.sfxGain);
    click1.start(now + 0.1);
    click1.stop(now + 0.15);

    // Mag in snap
    const click2 = this.ctx.createOscillator();
    const clickGain2 = this.ctx.createGain();
    click2.type = 'triangle';
    click2.frequency.setValueAtTime(900, now + 0.9);
    clickGain2.gain.setValueAtTime(0.5 * volume, now + 0.9);
    clickGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.98);
    click2.connect(clickGain2);
    clickGain2.connect(this.sfxGain);
    click2.start(now + 0.9);
    click2.stop(now + 0.98);

    // Bolt rack
    const click3 = this.ctx.createOscillator();
    const clickGain3 = this.ctx.createGain();
    click3.type = 'sawtooth';
    click3.frequency.setValueAtTime(450, now + 1.4);
    click3.frequency.exponentialRampToValueAtTime(750, now + 1.55);
    clickGain3.gain.setValueAtTime(0.4 * volume, now + 1.4);
    clickGain3.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
    click3.connect(clickGain3);
    clickGain3.connect(this.sfxGain);
    click3.start(now + 1.4);
    click3.stop(now + 1.6);
  }

  // AWP Scope zoom
  public playScope(volume = 0.8) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
    oscGain.gain.setValueAtTime(0.4 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Footstep (subdued thud with sand friction)
  public playFootstep(volume = 0.4) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.06);
    oscGain.gain.setValueAtTime(0.35 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Flesh hit impact
  public playHitFlesh(volume = 0.8) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
    oscGain.gain.setValueAtTime(0.7 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Headshot "Dink" - crisp metallic ring
  public playHeadshotDink(volume = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.25);
    oscGain.gain.setValueAtTime(0.85 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Wall ricochet / concrete ping
  public playRicochet(volume = 0.5) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    const startFreq = 1800 + Math.random() * 1200;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 0.4, now + 0.12);
    oscGain.gain.setValueAtTime(0.4 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Kill chime / feedback
  public playKillFeedback() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.08);
    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // C4 Beep (High pitch 1kHz pulse)
  public playC4Beep(volume = 0.9) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, now);
    oscGain.gain.setValueAtTime(0.7 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // C4 Planting sound (button presses)
  public playC4Planting(volume = 0.7) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700 + i * 150, now + i * 0.15);
      oscGain.gain.setValueAtTime(0.3 * volume, now + i * 0.15);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.06);
      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.07);
    }
  }

  // C4 Plant Completed ("The bomb has been planted")
  public playBombPlanted() {
    this.playC4Beep(1.0);
  }

  // C4 Defusal sound (wire clipping / electrical buzz)
  public playC4Defusing(volume = 0.6) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer(0.1);
    if (noiseBuffer) {
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3500, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      noise.start(now);
      noise.stop(now + 0.1);
    }
  }

  // C4 Massive Explosion
  public playC4Explosion() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Sub rumble
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(15, now + 2.5);
    oscGain.gain.setValueAtTime(2.0, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 3.0);

    // Blast noise
    const noise = this.ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer(3.0);
    if (noiseBuffer) {
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 2.8);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(2.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);
      noise.stop(now + 3.0);
    }
  }

  // Round Win fanfare
  public playRoundWin(isCTWin: boolean) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const chords = isCTWin ? [440, 554, 659] : [330, 392, 493];
    chords.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.3, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + i * 0.08);
      osc.stop(now + 1.2);
    });
  }
}

export const soundManager = new SoundManager();

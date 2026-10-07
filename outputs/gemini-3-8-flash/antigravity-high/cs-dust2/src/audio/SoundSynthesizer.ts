import { WeaponId } from '../types/game';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6;
  private c4BeepInterval: number | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // Create noise buffer helper
  private createNoiseBuffer(duration: number = 0.5): AudioBuffer {
    if (!this.ctx) return {} as AudioBuffer;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. Weapon Gunshots
  public playGunshot(weapon: WeaponId, distance: number = 0) {
    if (!this.ctx || !this.compressor) {
      this.init();
      if (!this.ctx || !this.compressor) return;
    }

    // Distance attenuation
    const distGain = Math.max(0.05, 1 / (1 + distance * 0.08));
    const now = this.ctx.currentTime;

    const shotGain = this.ctx.createGain();
    shotGain.gain.setValueAtTime(distGain, now);
    shotGain.connect(this.compressor);

    switch (weapon) {
      case 'ak47': {
        // Deep powerful bass punch + sharp mechanical crack + tail
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(170, now);
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.16);
        oscGain.gain.setValueAtTime(0.9, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(oscGain);
        oscGain.connect(shotGain);
        osc.start(now);
        osc.stop(now + 0.18);

        // Noise crack
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(0.28);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(1.8, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(1.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(shotGain);
        noise.start(now);
        noise.stop(now + 0.28);
        break;
      }

      case 'm4a4': {
        // Crisp snappy assault rifle punch + high metallic transient
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(230, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
        oscGain.gain.setValueAtTime(0.8, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(oscGain);
        oscGain.connect(shotGain);
        osc.start(now);
        osc.stop(now + 0.14);

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(0.22);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(800, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(1.0, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(shotGain);
        noise.start(now);
        noise.stop(now + 0.22);
        break;
      }

      case 'awp': {
        // Massive thunderous sniper cannon + sub drop + long echo
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(280, now);
        sub.frequency.exponentialRampToValueAtTime(25, now + 0.35);
        subGain.gain.setValueAtTime(1.4, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        sub.connect(subGain);
        subGain.connect(shotGain);
        sub.start(now);
        sub.stop(now + 0.5);

        // Explosive mid-high crack
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(0.9);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.8);
        filter.Q.setValueAtTime(1.2, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(1.5, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(shotGain);
        noise.start(now);
        noise.stop(now + 0.9);
        break;
      }

      case 'glock': {
        // Quick plastic-frame 9mm pop
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);
        oscGain.gain.setValueAtTime(0.65, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(oscGain);
        oscGain.connect(shotGain);
        osc.start(now);
        osc.stop(now + 0.09);

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(0.12);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2200, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.7, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(shotGain);
        noise.start(now);
        noise.stop(now + 0.12);
        break;
      }

      case 'usp': {
        // Suppressed tactical puff + metallic click
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(0.14);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.75, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(shotGain);
        noise.start(now);
        noise.stop(now + 0.14);
        break;
      }

      case 'deagle': {
        // Powerful .50 AE hand cannon blast
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);
        oscGain.gain.setValueAtTime(1.1, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(oscGain);
        oscGain.connect(shotGain);
        osc.start(now);
        osc.stop(now + 0.22);

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(0.35);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.Q.setValueAtTime(1.5, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(1.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(shotGain);
        noise.start(now);
        noise.stop(now + 0.35);
        break;
      }

      case 'knife': {
        this.playKnifeSlash();
        break;
      }
    }
  }

  // 2. Knife Slash & Hit
  public playKnifeSlash() {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.2);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
    filter.Q.setValueAtTime(3.0, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);
    noise.start(now);
    noise.stop(now + 0.2);
  }

  public playKnifeHit() {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;
    // Meat thud + blade slicing sound
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(oscGain);
    oscGain.connect(this.compressor);
    osc.start(now);
    osc.stop(now + 0.1);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.15);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.9, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.compressor);
    noise.start(now);
    noise.stop(now + 0.15);
  }

  // 3. Reload Sound Sequence
  public playReload(weapon: WeaponId) {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;

    // Mag out click at t=0.1
    this.scheduleMechanicalClick(now + 0.1, 480, 0.05);
    // Mag insert snap at t=0.8
    this.scheduleMechanicalClick(now + 0.8, 620, 0.07);
    this.scheduleMechanicalClick(now + 0.88, 750, 0.04);
    // Slide rack at t=1.4
    if (weapon !== 'knife') {
      this.scheduleMechanicalClick(now + 1.4, 900, 0.08);
      this.scheduleMechanicalClick(now + 1.52, 600, 0.06);
    }
  }

  private scheduleMechanicalClick(time: number, freq: number, dur: number) {
    if (!this.ctx || !this.compressor) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, time + dur);
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(time);
    osc.stop(time + dur);
  }

  // 4. Footsteps
  public playFootstep() {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.1);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450 + Math.random() * 80, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);
    noise.start(now);
    noise.stop(now + 0.1);
  }

  // 5. AWP Scope Zoom
  public playScopeZoom() {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 6. Hit Feedback
  public playHitMarker(isHeadshot: boolean) {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;

    if (isHeadshot) {
      // Crisp metallic headshot "DINK" helmet sound
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(2600, now);
      osc2.frequency.setValueAtTime(3900, now);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.compressor);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.28);
      osc2.stop(now + 0.28);
    } else {
      // Body hit dull impact thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.08);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.compressor);
      osc.start(now);
      osc.stop(now + 0.09);
    }
  }

  // 7. C4 Sounds
  public playC4ButtonPress() {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const freqs = [1209, 1336, 1477, 1633];
    osc.frequency.setValueAtTime(freqs[Math.floor(Math.random() * freqs.length)], now);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playC4Beep() {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800, now);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playDefuseCut() {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playC4Explosion() {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;

    // 1. Sub shockwave
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(90, now);
    sub.frequency.exponentialRampToValueAtTime(18, now + 2.0);
    subGain.gain.setValueAtTime(1.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    sub.connect(subGain);
    subGain.connect(this.compressor);
    sub.start(now);
    sub.stop(now + 2.5);

    // 2. Multi-stage explosive white-noise detonation
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(3.0);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 2.8);
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(2.0, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.compressor);
    noise.start(now);
    noise.stop(now + 3.0);
  }

  // 8. Kill & Announcer chimes
  public playKillSound() {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.06);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playRoundStart() {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(this.compressor);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  public playRoundWin(team: 'CT' | 'T') {
    if (!this.ctx || !this.compressor) return;
    const now = this.ctx.currentTime;
    // Harmonious victory chord
    const baseFreq = team === 'CT' ? 523.25 : 392.0; // C5 or G4
    [1, 1.25, 1.5].forEach((mult, idx) => {
      if (!this.ctx || !this.compressor) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq * mult, now + idx * 0.08);
      gain.gain.setValueAtTime(0.25, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);
      osc.connect(gain);
      gain.connect(this.compressor);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.8);
    });
  }
}

export const soundSynth = new SoundSynthesizer();

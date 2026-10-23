import type { WeaponId } from "./types";
export class SynthAudio {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  muted = false;
  noise: AudioBuffer | null = null;
  unlock() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.3;
      this.master.connect(this.ctx.destination);
      this.noise = this.ctx.createBuffer(
        1,
        this.ctx.sampleRate,
        this.ctx.sampleRate,
      );
      const a = this.noise.getChannelData(0);
      for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1;
    }
    void this.ctx.resume();
  }
  tone(
    freq: number,
    duration: number,
    volume = 0.2,
    type: OscillatorType = "sine",
    delay = 0,
    end?: number,
  ) {
    if (!this.ctx || !this.master || this.muted) return;
    const t = this.ctx.currentTime + delay,
      o = this.ctx.createOscillator(),
      g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (end) o.frequency.exponentialRampToValueAtTime(end, t + duration);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + duration);
  }
  burst(duration: number, volume: number, freq: number, delay = 0) {
    if (!this.ctx || !this.master || !this.noise || this.muted) return;
    const t = this.ctx.currentTime + delay,
      n = this.ctx.createBufferSource(),
      f = this.ctx.createBiquadFilter(),
      g = this.ctx.createGain();
    n.buffer = this.noise;
    n.playbackRate.value = 0.8 + Math.random() * 0.4;
    f.type = "lowpass";
    f.frequency.value = freq;
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    n.connect(f);
    f.connect(g);
    g.connect(this.master);
    n.start(t, Math.random() * 0.5);
    n.stop(t + duration);
  }
  fire(id: WeaponId, distance = 0) {
    const v = Math.max(0.025, 1 / (1 + distance * 0.13));
    if (id === "knife") {
      this.burst(0.14, 0.35 * v, 2200);
      return;
    }
    const cfg: Record<string, number[]> = {
      ak47: [0.2, 1, 2300, 105],
      m4a4: [0.13, 0.7, 3400, 155],
      awp: [0.6, 1.6, 1800, 64],
      glock: [0.11, 0.6, 4200, 235],
      usp: [0.09, 0.32, 1600, 210],
      deagle: [0.25, 0.9, 2600, 95],
    };
    const [d, g, f, p] = cfg[id];
    this.burst(d, g * v, f);
    this.tone(p, d, 0.5 * v, "triangle", 0, 35);
    this.tone(800, 0.025, 0.08 * v, "square", 0.03, 160);
  }
  reload() {
    this.burst(0.08, 0.22, 3600);
    this.tone(420, 0.04, 0.1, "square", 0.35);
    this.burst(0.13, 0.22, 2200, 0.8);
  }
  step(volume = 0.2) {
    this.burst(0.075, volume, 550);
    this.tone(65, 0.06, volume * 0.3, "sine");
  }
  scope() {
    this.tone(1100, 0.065, 0.13, "sine", 0, 550);
    this.burst(0.035, 0.08, 5200);
  }
  hit(head = false) {
    this.tone(head ? 1300 : 800, 0.08, 0.16, "triangle", 0, head ? 1800 : 600);
  }
  kill() {
    this.tone(650, 0.1, 0.15, "sine");
    this.tone(980, 0.17, 0.14, "sine", 0.09);
  }
  plant() {
    this.tone(880, 0.12, 0.22, "square");
    this.tone(1320, 0.17, 0.17, "square", 0.2);
  }
  defuse() {
    for (let i = 0; i < 4; i++)
      this.tone(500 + i * 180, 0.14, 0.16, "sine", i * 0.13);
  }
  beep() {
    this.tone(1350, 0.075, 0.15, "sine");
  }
  explosion() {
    this.burst(2, 2, 1600);
    this.tone(65, 1.6, 1, "sawtooth", 0, 15);
  }
  round() {
    this.tone(440, 0.2, 0.16, "sine");
    this.tone(660, 0.3, 0.14, "sine", 0.15);
  }
  dispose() {
    void this.ctx?.close();
  }
}

import type { WeaponId } from "./types";

/** All sounds are synthesized in memory. No fetches, samples, or audio assets. */
export class SynthAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  muted = false;
  async resume() {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.muted ? 0 : 0.38;
      this.master.connect(this.context.destination);
      this.noise = this.context.createBuffer(
        1,
        this.context.sampleRate * 2,
        this.context.sampleRate,
      );
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.context.state === "suspended") await this.context.resume();
  }
  toggle() {
    this.muted = !this.muted;
    if (this.master)
      this.master.gain.setTargetAtTime(
        this.muted ? 0 : 0.38,
        this.context!.currentTime,
        0.03,
      );
    return this.muted;
  }
  pause() {
    if (this.context?.state === "running") void this.context.suspend();
  }
  private tone(
    freq: number,
    endFreq: number,
    duration: number,
    volume: number,
    type: OscillatorType = "sine",
    delay = 0,
    pan = 0,
  ) {
    const c = this.context;
    if (this.muted || !c || !this.master || c.state !== "running") return;
    const now = c.currentTime + delay,
      osc = c.createOscillator(),
      gain = c.createGain(),
      panner = c.createStereoPanner();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(15, endFreq),
      now + duration,
    );
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    panner.pan.value = pan;
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.015);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
      panner.disconnect();
    };
  }
  private burst(
    duration: number,
    volume: number,
    frequency: number,
    delay = 0,
    pan = 0,
  ) {
    const c = this.context;
    if (
      this.muted ||
      !c ||
      !this.master ||
      !this.noise ||
      c.state !== "running"
    )
      return;
    const now = c.currentTime + delay,
      source = c.createBufferSource(),
      filter = c.createBiquadFilter(),
      gain = c.createGain(),
      panner = c.createStereoPanner();
    source.buffer = this.noise;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(frequency, now);
    filter.frequency.exponentialRampToValueAtTime(90, now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    panner.pan.value = pan;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(this.master);
    source.start(now, Math.random());
    source.stop(now + duration + 0.02);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
      panner.disconnect();
    };
  }
  fire(id: WeaponId, distance = 0, pan = 0) {
    const volume = 1 / (1 + distance * 0.09);
    switch (id) {
      case "ak47":
        this.burst(0.19, 0.85 * volume, 4300, 0, pan);
        this.tone(155, 42, 0.16, 0.44 * volume, "triangle", 0, pan);
        break;
      case "m4a4":
        this.burst(0.125, 0.57 * volume, 3100, 0, pan);
        this.tone(190, 65, 0.1, 0.26 * volume, "triangle", 0, pan);
        break;
      case "awp":
        this.burst(0.65, 1.3 * volume, 5400, 0, pan);
        this.tone(105, 24, 0.48, 0.8 * volume, "sine", 0, pan);
        this.burst(0.13, 0.12 * volume, 2800, 0.42, pan);
        break;
      case "usp":
        this.burst(0.07, 0.22 * volume, 1900, 0, pan);
        this.tone(350, 120, 0.08, 0.19 * volume, "sine", 0, pan);
        break;
      case "glock":
        this.burst(0.09, 0.43 * volume, 3700, 0, pan);
        this.tone(240, 65, 0.095, 0.24 * volume, "triangle", 0, pan);
        break;
      case "deagle":
        this.burst(0.24, 0.82 * volume, 4200, 0, pan);
        this.tone(140, 35, 0.22, 0.45 * volume, "triangle", 0, pan);
        break;
      case "knife":
        this.burst(0.15, 0.26 * volume, 3800, 0, pan);
        break;
    }
  }
  reload(duration: number) {
    this.burst(0.09, 0.19, 3300);
    this.tone(450, 180, 0.07, 0.1, "square", duration * 0.35);
    this.burst(0.12, 0.23, 2600, duration * 0.82);
  }
  step(distance = 0) {
    const v = 0.13 / (1 + distance * 0.2);
    this.burst(0.075, v, 650);
    this.tone(85, 35, 0.05, v * 0.3);
  }
  scope() {
    this.tone(700, 190, 0.09, 0.1, "sine");
    this.burst(0.05, 0.13, 2300);
  }
  hit(headshot = false) {
    this.tone(headshot ? 1500 : 1000, headshot ? 900 : 650, 0.065, 0.2);
    this.burst(0.04, 0.1, 4000);
  }
  kill() {
    this.tone(720, 850, 0.13, 0.16, "sine");
    this.tone(1080, 1000, 0.2, 0.12, "sine", 0.08);
  }
  equip() {
    this.burst(0.07, 0.09, 2100);
  }
  empty() {
    this.tone(180, 70, 0.035, 0.08, "square");
  }
  plant() {
    for (let i = 0; i < 3; i++)
      this.tone(1000 + i * 150, 950 + i * 150, 0.12, 0.12, "sine", i * 0.15);
  }
  defuse() {
    for (let i = 0; i < 4; i++)
      this.tone(500 + i * 220, 650 + i * 200, 0.25, 0.13, "sine", i * 0.15);
  }
  beep(distance: number) {
    this.tone(1900, 1900, 0.065, 0.25 / (1 + distance * 0.07), "sine");
  }
  explode(distance: number) {
    const v = 1 / (1 + distance * 0.025);
    this.burst(1.8, 2 * v, 5600);
    this.tone(72, 18, 1.7, 1.1 * v);
    this.burst(0.65, 0.4 * v, 1800, 0.13);
  }
  round(win: boolean) {
    this.tone(win ? 440 : 300, win ? 650 : 160, 0.45, 0.15, "triangle");
    this.tone(win ? 660 : 220, win ? 880 : 110, 0.7, 0.13, "sine", 0.25);
  }
  dispose() {
    if (this.context) void this.context.close();
    this.context = null;
  }
}

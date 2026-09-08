import { AudioEngine } from "../lib/audio";
import { clamp, clamp01 } from "../lib/rng";
import { cueAt, subtitleText } from "./cues";
import { CARDS, cardAt, FILM_DURATION, resetShotLatches, SHOTS } from "./shots";
import { SFX, type SfxCue } from "./soundtrack";
import type { FilmWorld } from "./world";
import type { Shot } from "./types";

/** Fade-through-black accents at the act breaks. */
const CUT_TIMES = [20, 70, 136, 198, 246, 326];

export interface DomRefs {
  subtitle: HTMLElement;
  subtitleText: HTMLElement;
  card: HTMLElement;
  cardMain: HTMLElement;
  cardSub: HTMLElement;
  curtain: HTMLElement;
  hudTime: HTMLElement;
  hudShot: HTMLElement;
  progress: HTMLElement;
  progressFill: HTMLElement;
}

function fmt(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export class Director {
  time = 0;
  playing = true;
  readonly duration = FILM_DURATION;
  private shot: Shot | null = null;
  private sfxCursor = 0;
  private prevTime = 0;
  private envApplied = false;

  constructor(
    private world: FilmWorld,
    private audio: AudioEngine | null,
    private dom: DomRefs
  ) {
    this.seek(0, true);
  }

  private findShot(t: number): Shot {
    for (let i = 0; i < SHOTS.length; i++) {
      const s = SHOTS[i];
      if (t >= s.start && t < s.end) return s;
    }
    return SHOTS[SHOTS.length - 1];
  }

  seek(t: number, hard = false): void {
    const nt = clamp(t, 0, this.duration);
    const jumped = hard || Math.abs(nt - this.time) > 0.75;
    this.time = nt;
    this.prevTime = nt;
    if (jumped) {
      resetShotLatches();
      this.audio?.stopAll();
      this.world.effects.root.traverse(() => void 0);
      // re-arm the sound cursor and restore the ambient bed for this moment
      let idx = 0;
      let env: SfxCue | null = null;
      for (let i = 0; i < SFX.length; i++) {
        if (SFX[i].time <= nt) {
          idx = i + 1;
          if (SFX[i].action === "env") env = SFX[i];
        } else break;
      }
      this.sfxCursor = idx;
      if (env?.env) this.audio?.setEnvironment(env.env);
      this.envApplied = true;
    }
    const s = this.findShot(nt);
    if (s !== this.shot) {
      this.shot = s;
      this.world.showSet(s.set);
    }
  }

  restart(): void {
    this.seek(0, true);
    this.playing = true;
  }

  togglePlay(): void {
    this.playing = !this.playing;
  }

  /** Advance the film. Returns false once the end has been reached. */
  update(dt: number): void {
    if (this.playing) {
      const nt = this.time + dt;
      this.advance(nt);
      this.time = Math.min(nt, this.duration);
      if (this.time >= this.duration) this.playing = false;
    }
    this.render();
  }

  private advance(nt: number): void {
    const t = Math.min(nt, this.duration);
    // fire sound cues crossed during this step
    while (this.sfxCursor < SFX.length && SFX[this.sfxCursor].time <= t) {
      const cue = SFX[this.sfxCursor];
      if (cue.time >= this.prevTime - 0.001) this.fire(cue);
      this.sfxCursor++;
    }
    this.prevTime = t;

    const s = this.findShot(t);
    if (s !== this.shot) {
      this.shot = s;
      this.world.showSet(s.set);
    }
  }

  private fire(c: SfxCue): void {
    const a = this.audio;
    if (!a) return;
    switch (c.action) {
      case "env":
        if (c.env) a.setEnvironment(c.env);
        break;
      case "sample":
        if (c.sample) a.playSample(c.sample, { gain: c.gain, rate: c.rate, pan: c.pan, reverb: c.reverb, release: c.dur });
        break;
      case "loop":
        if (c.sample && c.key) a.loopSample(c.sample, c.key, c.gain ?? 0.2, c.rate ?? 1);
        break;
      case "stopLoop":
        if (c.key) a.stopLoop(c.key);
        break;
      case "gunshot":
        a.gunshot(c.gain ?? 1);
        break;
      case "footsteps": {
        const n = c.repeat ?? 1;
        const iv = c.interval ?? 0.55;
        for (let i = 0; i < n; i++) {
          const jitter = c.rateJitter ?? 0.08;
          window.setTimeout(() => a.footstep(c.wood, (c.gain ?? 0.25) * (1 - Math.random() * jitter)), i * iv * 1000);
        }
        break;
      }
      case "click":
        a.click(c.gain ?? 0.3, c.bright);
        break;
      case "ring":
        a.ring(c.freq ?? 4200, c.dur ?? 4, c.gain ?? 0.08);
        break;
      case "beep":
        a.beep(c.freq ?? 880, c.dur ?? 0.12, c.gain ?? 0.16);
        break;
      case "riser":
        a.riser(c.dur ?? 3, c.gain ?? 0.2);
        break;
      case "rumble":
        a.rumble(c.gain ?? 0.4, c.dur ?? 8);
        break;
      case "breath":
        a.breath(c.dur ?? 6, c.gain ?? 0.14);
        break;
      case "burst":
        a.burst({ dur: c.dur, freq: c.freq, gain: c.gain, reverb: c.reverb });
        break;
      case "tone":
        a.tone({ freq: c.freq ?? 220, dur: c.dur ?? 0.4, gain: c.gain ?? 0.15, glide: c.glide });
        break;
      case "static":
        a.static_(c.dur ?? 0.5, c.gain ?? 0.1);
        break;
    }
  }

  /** Camera, world and overlays for the current time. */
  private render(): void {
    const t = this.time;
    const s = this.shot ?? this.findShot(t);
    if (s !== this.shot) {
      this.shot = s;
      this.world.showSet(s.set);
    }
    const span = Math.max(0.0001, s.end - s.start);
    const p = clamp01((t - s.start) / span);

    this.world.time = t;
    this.world.dt = Math.max(0, t - this.prevTime) || 1 / 60;
    s.update(this.world, p);
    this.world.tick(t, this.world.dt);

    this.updateSubtitle(t);
    this.updateCard(t);
    this.dom.curtain.style.opacity = curtainAt(t, this.duration).toFixed(3);
    this.dom.hudTime.textContent = `${fmt(t)} / ${fmt(this.duration)}`;
    this.dom.hudShot.textContent = s.id;
    this.dom.progressFill.style.width = `${((t / this.duration) * 100).toFixed(2)}%`;
  }

  private updateSubtitle(t: number): void {
    const cue = cueAt(t);
    if (cue) {
      const txt = subtitleText(cue);
      if (this.dom.subtitleText.textContent !== txt) this.dom.subtitleText.textContent = txt;
      const fade = 0.18;
      const o = Math.min(clamp01((t - cue.start) / fade), clamp01((cue.end - t) / fade));
      this.dom.subtitle.style.opacity = o.toFixed(2);
    } else {
      this.dom.subtitle.style.opacity = "0";
    }
  }

  private updateCard(t: number): void {
    const c = cardAt(t);
    if (!c) {
      this.dom.card.style.opacity = "0";
      return;
    }
    if (this.dom.cardMain.textContent !== c.main) this.dom.cardMain.textContent = c.main;
    if (this.dom.cardSub.textContent !== c.sub) this.dom.cardSub.textContent = c.sub;
    const fade = 1.1;
    const o = Math.min(clamp01((t - c.start) / fade), clamp01((c.end - t) / fade));
    this.dom.card.style.opacity = o.toFixed(2);
  }
}

function curtainAt(t: number, duration: number): number {
  let o = 0;
  if (t < 1.7) o = Math.max(o, 1 - t / 1.7);
  for (const T of CUT_TIMES) {
    const d = Math.abs(t - T);
    if (d < 0.55) o = Math.max(o, 1 - d / 0.55);
  }
  const tail = duration - 1.1;
  if (t > tail) o = Math.max(o, (t - tail) / 1.1);
  return clamp01(o);
}

export { CARDS };

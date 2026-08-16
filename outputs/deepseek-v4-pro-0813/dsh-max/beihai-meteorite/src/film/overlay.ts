import { clamp01 } from "./util";

/* All DOM cinematic chrome driven purely by absolute timeline time. */

const CHAPTERS = [
  { t0: 30.5, t1: 38.5, main: "壹 · 陨石", sub: "THE STONE" },
  { t0: 152.5, t1: 160.5, main: "贰 · 子弹", sub: "THE BULLET" },
  { t0: 233.5, t1: 241.5, main: "叁 · 虚空", sub: "THE VOID" },
  { t0: 337.5, t1: 345.5, main: "肆 · 未来", sub: "THE FUTURE" },
];

const FADES: Array<[number, number]> = [
  [28.8, 31.2],
  [149.5, 153.5],
  [196.5, 200.5],
  [229.5, 233.5],
  [336.5, 340.5],
  [344.8, 348.2],
];

export class Overlay {
  private readonly fade: HTMLElement;
  private readonly chapter: HTMLElement;
  private readonly chapterMain: HTMLElement;
  private readonly chapterSub: HTMLElement;
  private readonly titleCard: HTMLElement;
  private readonly titleMain: HTMLElement;
  private readonly titleSub: HTMLElement;
  private readonly titleEpi: HTMLElement;
  private readonly playHint: HTMLElement;
  private hiddenHint = false;
  private lastChapter = -1;

  constructor(private readonly duration: number) {
    this.fade = document.getElementById("fade")!;
    this.chapter = document.getElementById("chapter-card")!;
    this.chapterMain = document.getElementById("chapter-main")!;
    this.chapterSub = document.getElementById("chapter-sub")!;
    this.titleCard = document.getElementById("title-card")!;
    this.titleMain = document.getElementById("title-main")!;
    this.titleSub = document.getElementById("title-sub")!;
    this.titleEpi = document.getElementById("title-epi")!;
    this.playHint = document.getElementById("play-hint")!;
    this.titleEpi.textContent = "";
  }

  hideHint(): void {
    this.hiddenHint = true;
    this.playHint.style.opacity = "0";
  }

  update(t: number): void {
    // global fade
    let fadeOpacity = 0;
    for (const [a, b] of FADES) {
      if (t >= a && t <= b) {
        const peak = t < (a + b) / 2 ? (t - a) / ((b - a) / 2) : (b - t) / ((b - a) / 2);
        fadeOpacity = Math.max(fadeOpacity, clamp01(peak));
      }
    }
    // end fade stays black
    if (t >= 347.4) fadeOpacity = clamp01((t - 347.4) / 0.5);
    this.fade.style.opacity = String(fadeOpacity);

    // chapter cards
    let ci = -1;
    let cAlpha = 0;
    CHAPTERS.forEach((c, i) => {
      const fadeIn = 0.9;
      const fadeOut = 1.4;
      const a = t >= c.t0 && t <= c.t1
        ? Math.min(clamp01((t - c.t0) / fadeIn), clamp01((c.t1 - t) / fadeOut))
        : 0;
      if (a > cAlpha) {
        cAlpha = a;
        ci = i;
      }
    });
    if (ci !== this.lastChapter) {
      if (ci >= 0) {
        this.chapterMain.textContent = CHAPTERS[ci]!.main;
        this.chapterSub.textContent = CHAPTERS[ci]!.sub;
      }
      this.lastChapter = ci;
    }
    this.chapter.style.opacity = String(cAlpha);

    // opening title (10-24.5)
    const titleA = t >= 10 && t <= 24.5
      ? Math.min(clamp01((t - 10) / 1.4), clamp01((24.5 - t) / 1.4))
      : 0;
    // end title (345.2+)
    const endA = t >= 345.2
      ? clamp01((t - 345.2) / 1.1)
      : 0;
    const isEnd = endA > 0;
    if (isEnd) {
      this.titleEpi.textContent = "增援未来计划 · 第一批特遣队 · 危机纪年 第三年";
    }
    this.titleCard.style.opacity = String(Math.max(titleA, endA));

    // play hint
    if (!this.hiddenHint) {
      this.playHint.style.opacity = String(0.4 + 0.6 * Math.abs(Math.sin(t * 1.4)));
    }
  }
}

/**
 * 画面之上的一层：黑场、闪光、片名与结尾字幕、颗粒和暗角。
 *
 * 全部由绝对时间驱动，不保留任何状态，所以拖动进度条不会留下上一格的
 * 残影。字幕不在这里 —— 字幕永远由语音清单驱动，由播放器统一渲染。
 */

export interface TitleCard {
  start: number;
  end: number;
  /** 主标题，字距拉开。 */
  title?: string;
  /** 副行。 */
  line?: string;
  /** 引号里的那句话，用在片尾。 */
  quote?: string;
}

export interface Screen {
  root: HTMLElement;
  setFade(value: number): void;
  setFlash(value: number, colour?: string): void;
  setTitle(card: TitleCard | null, amount: number): void;
  setGrain(amount: number, time: number): void;
  hidePoster(): void;
  destroy(): void;
}

function noiseDataUrl(size = 96): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(size, size);
  let seed = 1337;
  for (let i = 0; i < image.data.length; i += 4) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const v = 110 + (seed % 90);
    image.data[i] = v;
    image.data[i + 1] = v;
    image.data[i + 2] = v;
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

function div(className: string, parent?: HTMLElement, text?: string): HTMLElement {
  const element = document.createElement("div");
  element.className = className;
  if (text !== undefined) element.textContent = text;
  parent?.appendChild(element);
  return element;
}

export function mountScreen(parent: HTMLElement): Screen {
  // 全部用 createElement 搭，不用 innerHTML —— 这样这一层也能在无浏览器的
  // 自检里被真正跑一遍。
  const root = div("film-screen");
  parent.appendChild(root);

  const grain = div("film-grain", root);
  grain.style.backgroundImage = `url(${noiseDataUrl()})`;
  div("film-vignette", root);
  div("film-bar film-bar-top", root);
  div("film-bar film-bar-bottom", root);

  const titleBox = div("film-title", root);
  const titleMain = div("film-title-main", titleBox);
  const titleLine = div("film-title-line", titleBox);
  const titleQuote = div("film-title-quote", titleBox);

  const flash = div("film-flash", root);
  const fade = div("film-fade", root);

  const poster = div("film-poster", root);
  div("film-poster-title", poster, "陨　石");
  div("film-poster-line", poster, "根据刘慈欣《三体 · 黑暗森林》改编 · 程序化体素电影");
  div("film-poster-hint", poster, "按下 ▶ 开始 · 全长 5 分 58 秒");

  let currentCard: TitleCard | null = null;

  return {
    root,
    setFade(value) {
      fade.style.opacity = String(Math.min(1, Math.max(0, value)));
    },
    setFlash(value, colour = "#fff6e4") {
      flash.style.background = colour;
      flash.style.opacity = String(Math.min(1, Math.max(0, value)));
    },
    setTitle(card, amount) {
      if (card !== currentCard) {
        currentCard = card;
        titleMain.textContent = card?.title ?? "";
        titleLine.textContent = card?.line ?? "";
        titleQuote.textContent = card?.quote ?? "";
        titleMain.style.display = card?.title ? "block" : "none";
        titleLine.style.display = card?.line ? "block" : "none";
        titleQuote.style.display = card?.quote ? "block" : "none";
      }
      titleBox.style.opacity = String(Math.min(1, Math.max(0, amount)));
      titleBox.style.transform = `translate(-50%,-50%) scale(${1 + (1 - Math.min(1, amount)) * 0.012})`;
    },
    setGrain(amount, time) {
      grain.style.opacity = String(Math.min(1, Math.max(0, amount)));
      const step = Math.floor(time * 12);
      grain.style.backgroundPosition = `${(step * 37) % 96}px ${(step * 53) % 96}px`;
    },
    hidePoster() {
      poster.classList.add("is-hidden");
    },
    destroy() {
      root.remove();
    },
  };
}

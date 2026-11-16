export interface CardOpts {
  zh?: string;
  en?: string;
  sub?: string;
  place?: boolean;
  credit?: boolean;
}

/** DOM title / place / credit cards, keyed by id, toggled by shots. */
export class Cards {
  private host: HTMLElement;
  private els = new Map<string, HTMLElement>();

  constructor(host: HTMLElement) {
    this.host = host;
  }

  show(id: string, opts: CardOpts): void {
    let el = this.els.get(id);
    if (!el) {
      el = document.createElement("div");
      el.className = "card";
      this.host.appendChild(el);
      this.els.set(id, el);
    }
    el.className = `card${opts.place ? " place" : ""}${opts.credit ? " credit" : ""}`;
    el.innerHTML = [
      opts.zh ? `<div class="zh">${opts.zh}</div>` : "",
      opts.en ? `<div class="en">${opts.en}</div>` : "",
      opts.sub ? `<div class="sub">${opts.sub}</div>` : "",
    ].join("");
    // force reflow so the opacity transition runs when re-shown
    void el.offsetWidth;
    el.classList.add("on");
  }

  hide(id: string): void {
    this.els.get(id)?.classList.remove("on");
  }

  hideAll(): void {
    for (const el of this.els.values()) el.classList.remove("on");
  }
}

/** The scope / viewfinder overlay. */
export class Scope {
  private el: HTMLElement;
  private hud: HTMLElement;
  constructor(el: HTMLElement, hud: HTMLElement) {
    this.el = el;
    this.hud = hud;
  }
  on(text?: string): void {
    this.el.classList.add("on");
    if (text) this.hud.textContent = text;
  }
  off(): void {
    this.el.classList.remove("on");
  }
  setHud(text: string): void {
    this.hud.textContent = text;
  }
}

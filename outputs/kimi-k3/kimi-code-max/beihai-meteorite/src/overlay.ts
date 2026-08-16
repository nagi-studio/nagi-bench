import { scopeActive } from "./shots";

/** HTML overlays: title/caption cards, sniper-scope reticle, fades. */
export class Overlay {
  private cards: HTMLElement;
  private scopeEl: HTMLElement;
  private fadeEl: HTMLElement;

  constructor(parent: HTMLElement) {
    this.cards = parent.querySelector("#film-cards") as HTMLElement;

    this.scopeEl = document.createElement("div");
    this.scopeEl.style.cssText = `
      position:absolute;inset:0;z-index:16;pointer-events:none;display:none;
      background:radial-gradient(circle at 50% 50%, transparent 26vh, rgba(0,0,0,0.97) 27.5vh);`;
    const cross = document.createElement("div");
    cross.style.cssText = `position:absolute;left:50%;top:50%;width:52vh;height:52vh;transform:translate(-50%,-50%);`;
    cross.innerHTML = `
      <div style="position:absolute;left:50%;top:0;width:1px;height:100%;background:rgba(220,230,240,0.55)"></div>
      <div style="position:absolute;top:50%;left:0;height:1px;width:100%;background:rgba(220,230,240,0.55)"></div>
      <div style="position:absolute;left:50%;top:50%;width:9vh;height:9vh;transform:translate(-50%,-50%);border:1px solid rgba(220,230,240,0.5);border-radius:50%"></div>`;
    this.scopeEl.appendChild(cross);
    parent.appendChild(this.scopeEl);

    this.fadeEl = document.createElement("div");
    this.fadeEl.style.cssText = `
      position:absolute;inset:0;z-index:17;pointer-events:none;background:#000;opacity:1;`;
    parent.appendChild(this.fadeEl);
  }

  update(t: number): void {
    /* ---- cards ---- */
    let html = "";
    let cls = "film-card";
    let opacity = 0;
    const card = (a: number, b: number, fade = 0.8) => {
      opacity = Math.min(
        1,
        Math.max(0, (t - a) / fade),
        Math.max(0, (b - t) / fade),
      );
    };
    if (t >= 0.8 && t <= 8.4) {
      card(0.8, 8.4, 1.2);
      html = `<div class="zh">陨石子弹</div><div class="en">METEOR&nbsp;BULLETS</div>`;
    } else if (t >= 9.6 && t <= 13.2) {
      card(9.6, 13.2); cls = "film-card caption";
      html = `<div class="sub">北京 · 胡同深处</div>`;
    } else if (t >= 78.6 && t <= 82.2) {
      card(78.6, 82.2); cls = "film-card caption";
      html = `<div class="sub">太空军研究所 · 模型车间，下班后</div>`;
    } else if (t >= 118.6 && t <= 122.4) {
      card(118.6, 122.4); cls = "film-card caption";
      html = `<div class="sub">一处隐蔽的地下室</div>`;
    } else if (t >= 180.8 && t <= 185.4) {
      card(180.8, 185.4); cls = "film-card caption";
      html = `<div class="sub">三个月后 · 距黄河空间站五公里</div>`;
    } else if (t >= 338 && t <= 344.9) {
      card(338, 344.9, 1.6);
      html = `<div class="zh" style="font-size:clamp(26px,3.6vw,50px)">陨石子弹</div><div class="sub">完</div>`;
    }
    if (opacity > 0.01) {
      this.cards.innerHTML = `<div class="${cls}" style="opacity:${opacity.toFixed(3)}">${html}</div>`;
    } else if (this.cards.innerHTML !== "") {
      this.cards.innerHTML = "";
    }

    /* ---- scope reticle ---- */
    const on = scopeActive(t);
    this.scopeEl.style.display = on ? "block" : "none";

    /* ---- fades ---- */
    let fade = 0;
    if (t < 1.4) fade = 1 - t / 1.4;
    else if (t > 336.5) fade = Math.min(1, (t - 336.5) / 6);
    this.fadeEl.style.opacity = fade.toFixed(3);
  }
}

import { clamp, keyed, seg, smooth } from "./util";

/** Everything drawn over the canvas is a pure function of absolute time. */

interface Card {
  start: number;
  end: number;
  text: string;
}

const CARDS: Card[] = [
  { start: 27.0, end: 32.5, text: "地球同步轨道 · 距黄河空间站五公里" },
  { start: 41.2, end: 46.5, text: "四个月前 · 北京 · 胡同深处" },
  { start: 162.6, end: 167.5, text: "当夜 · 太空军某研究所 · 模型车间" },
];

/** Fade-to-black windows as [time, opacity] keys. */
const FADE: Array<[number, number]> = [
  [0, 1], [3.2, 0],
  [38.6, 0], [40.0, 1], [40.4, 1], [41.8, 0],
  [161.7, 0], [162.0, 1], [162.3, 0],
  [335.4, 0], [336.0, 1], [336.3, 1], [337.4, 0],
  [348.9, 0], [350.0, 1],
];

/** Muzzle-flash flashes in the basement: [start, peak]. */
export const BASEMENT_SHOTS = [207.2, 208.5, 209.25, 210.7];

/** Scope POV windows. */
const SCOPE: Array<[number, number]> = [
  [238, 254],
  [254, 266],
  [284, 288.2],
  [302, 305],
  [308, 313],
  [318, 324],
];

export class Overlay {
  private readonly top: HTMLDivElement;
  private readonly bottom: HTMLDivElement;
  private readonly fade: HTMLDivElement;
  private readonly flash: HTMLDivElement;
  private readonly title: HTMLDivElement;
  private readonly titleRule: HTMLDivElement;
  private readonly titleSub: HTMLDivElement;
  private readonly card: HTMLDivElement;
  private readonly cardText: HTMLSpanElement;
  private readonly scope: HTMLDivElement;
  private readonly scopeCanvas: HTMLCanvasElement;
  private readonly start: HTMLDivElement;
  private readonly root: HTMLElement;
  private scopeRange = "";
  private barPx = 0;
  started = false;

  constructor(root: HTMLElement) {
    this.root = root;
    const mk = (cls: string) => {
      const d = document.createElement("div");
      d.className = cls;
      root.appendChild(d);
      return d;
    };
    mk("ov ov-vignette");
    this.scope = mk("ov ov-scope");
    this.scopeCanvas = document.createElement("canvas");
    this.scope.appendChild(this.scopeCanvas);
    this.top = mk("ov-bar");
    this.top.style.top = "0";
    this.bottom = mk("ov-bar");
    this.bottom.style.bottom = "0";
    this.flash = mk("ov ov-flash");
    this.fade = mk("ov ov-fade");
    this.title = mk("ov ov-title");
    this.title.innerHTML = `<div class="t-main">陨石</div><div class="t-rule"></div><div class="t-sub">改编自刘慈欣《三体Ⅱ·黑暗森林》</div>`;
    this.titleRule = this.title.querySelector(".t-rule") as HTMLDivElement;
    this.titleSub = this.title.querySelector(".t-sub") as HTMLDivElement;
    this.card = mk("ov ov-card");
    this.cardText = document.createElement("span");
    this.card.appendChild(this.cardText);
    this.start = mk("ov ov-start");
    this.start.innerHTML = `<b>陨石</b><div>一部体素短片 · 约六分钟 · 请开启声音</div><div style="margin-top:1.2em;opacity:.7">点击下方 ▶ 开始放映</div>`;
    const ro = new ResizeObserver(() => this.layout());
    ro.observe(root);
    this.layout();
  }

  private layout(): void {
    const w = this.root.clientWidth || window.innerWidth;
    const h = this.root.clientHeight || window.innerHeight;
    // 2.39:1 letterbox when the window is wider than that; otherwise no bars.
    const target = w / 2.39;
    this.barPx = Math.max(0, Math.round((h - target) / 2));
    this.top.style.height = `${this.barPx}px`;
    this.bottom.style.height = `${this.barPx}px`;
    this.root.style.setProperty("--bar", `${this.barPx}px`);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.scopeCanvas.width = Math.round(w * dpr);
    this.scopeCanvas.height = Math.round(h * dpr);
    this.drawScope();
  }

  private drawScope(): void {
    const c = this.scopeCanvas.getContext("2d")!;
    const W = this.scopeCanvas.width, H = this.scopeCanvas.height;
    const r = Math.min(W, H) * 0.4;
    const cx = W / 2, cy = H / 2;
    c.clearRect(0, 0, W, H);
    c.fillStyle = "#000";
    c.beginPath();
    c.rect(0, 0, W, H);
    c.arc(cx, cy, r, 0, Math.PI * 2, true);
    c.fill("evenodd");
    const g = c.createRadialGradient(cx, cy, r * 0.82, cx, cy, r);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.85)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "rgba(10,10,10,0.95)";
    c.lineWidth = Math.max(1, r * 0.004);
    c.beginPath();
    c.moveTo(cx - r, cy); c.lineTo(cx - r * 0.06, cy);
    c.moveTo(cx + r * 0.06, cy); c.lineTo(cx + r, cy);
    c.moveTo(cx, cy - r); c.lineTo(cx, cy - r * 0.06);
    c.moveTo(cx, cy + r * 0.06); c.lineTo(cx, cy + r);
    c.stroke();
    c.lineWidth = Math.max(2, r * 0.018);
    c.beginPath();
    c.moveTo(cx - r, cy); c.lineTo(cx - r * 0.55, cy);
    c.moveTo(cx + r * 0.55, cy); c.lineTo(cx + r, cy);
    c.moveTo(cx, cy + r * 0.55); c.lineTo(cx, cy + r);
    c.stroke();
    c.fillStyle = "rgba(10,10,10,0.95)";
    for (let i = 1; i <= 4; i++) {
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        c.beginPath();
        c.arc(cx + dx * i * r * 0.11, cy + dy * i * r * 0.11, r * 0.007, 0, Math.PI * 2);
        c.fill();
      }
    }
    c.strokeStyle = "rgba(200,40,30,0.9)";
    c.lineWidth = Math.max(1, r * 0.004);
    c.beginPath();
    c.arc(cx, cy, r * 0.012, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = "rgba(210,200,180,0.75)";
    c.font = `${Math.round(r * 0.045)}px ui-monospace, monospace`;
    c.textAlign = "left";
    c.fillText(this.scopeRange, cx + r * 0.62, cy + r * 0.12);
  }

  update(t: number, playing: boolean): void {
    if (playing || t > 0.01) this.started = true;
    this.start.style.opacity = this.started ? "0" : "1";

    // Fade.
    this.fade.style.opacity = String(this.started ? keyed(FADE, t, (x) => x) : 1);

    // Title card over the opening void and the end card.
    const titleIn = seg(t, 4.5, 6.5) * (1 - seg(t, 10.0, 11.6));
    const endIn = seg(t, 350.6, 352.4) * (1 - seg(t, 356.4, 357.8));
    const tv = Math.max(titleIn, endIn);
    this.title.style.opacity = String(smooth(tv));
    const ruleK = t < 300 ? seg(t, 5, 9) : seg(t, 351, 355);
    this.titleRule.style.width = `${Math.round(ruleK * 220)}px`;
    this.titleSub.style.opacity = String(t < 300 ? seg(t, 6.5, 8) : seg(t, 352, 353.5));

    // Location cards.
    let cardOp = 0;
    for (const c of CARDS) {
      const k = seg(t, c.start, c.start + 0.8) * (1 - seg(t, c.end - 0.8, c.end));
      if (k > 0) {
        cardOp = k;
        if (this.cardText.textContent !== c.text) this.cardText.textContent = c.text;
      }
    }
    this.card.style.opacity = String(cardOp);

    // Muzzle flash in the basement.
    let fl = 0;
    for (const s of BASEMENT_SHOTS) {
      if (t >= s && t < s + 0.16) fl = Math.max(fl, 0.75 * (1 - (t - s) / 0.16));
    }
    this.flash.style.opacity = String(fl);

    // Scope.
    let inScope = false;
    for (const [a, b] of SCOPE) if (t >= a && t < b) inScope = true;
    this.scope.style.display = inScope ? "block" : "none";
    if (inScope) {
      const range = `${(5.064 - clamp((t - 238) / 1000, 0, 0.004)).toFixed(3)} km`;
      if (range !== this.scopeRange) {
        this.scopeRange = range;
        this.drawScope();
      }
    }
  }
}

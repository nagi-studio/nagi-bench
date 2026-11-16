import { clamp01, lerp, smoothstep, segmentProgress } from "./helpers";

interface Key { t: number; v: number; }
function sample(keys: Key[], time: number): number {
  if (time <= keys[0].t) return keys[0].v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (time >= a.t && time <= b.t) {
      const k = smoothstep(segmentProgress(time, a.t, b.t));
      return lerp(a.v, b.v, k);
    }
  }
  return keys[keys.length - 1].v;
}

const FADE: Key[] = [
  { t: 0, v: 0 }, { t: 1.3, v: 0 },
  { t: 111, v: 0 }, { t: 112.6, v: 0.75 }, { t: 114.2, v: 0 },
  { t: 186.4, v: 0 }, { t: 188, v: 1 }, { t: 190.6, v: 0 },
  { t: 332, v: 0 }, { t: 333.6, v: 0.55 }, { t: 335, v: 0 },
  { t: 342, v: 0 }, { t: 345, v: 1 },
];

const FLASH: Key[] = [
  { t: 164.98, v: 0 }, { t: 165.04, v: 0.9 }, { t: 165.5, v: 0 },
  { t: 306, v: 0 }, { t: 306.08, v: 0.18 }, { t: 306.5, v: 0 },
];

function scopeOpacity(time: number): number {
  const win = (a: number, b: number) => smoothstep(segmentProgress(time, a, a + 0.4)) * (1 - smoothstep(segmentProgress(time, b - 0.4, b)));
  return Math.max(win(251.5, 258), win(270, 275.5), win(306, 312));
}

export interface CardState { opacity: number; zh: string; en: string; sub: string; rule: number; }

function cardState(time: number): CardState {
  // opening title
  const open = smoothstep(segmentProgress(time, 1.6, 2.8)) * (1 - smoothstep(segmentProgress(time, 6.4, 7.6)));
  if (open > 0.001) {
    return { opacity: open, zh: "陨 石 雨", en: "Meteorite Shower", sub: "改编自《三体 II · 黑暗森林》", rule: open };
  }
  // end title
  const end = smoothstep(segmentProgress(time, 336, 337.6)) * (1 - smoothstep(segmentProgress(time, 343, 345)));
  if (end > 0.001) {
    return { opacity: end, zh: "陨 石 雨", en: "Meteorite Shower", sub: "章北海 · 增援未来", rule: end };
  }
  return { opacity: 0, zh: "", en: "", sub: "", rule: 0 };
}

export interface OverlayState { fade: number; flash: number; scope: number; card: CardState; }

export function overlayState(time: number): OverlayState {
  return {
    fade: clamp01(sample(FADE, time)),
    flash: clamp01(sample(FLASH, time)),
    scope: scopeOpacity(time),
    card: cardState(time),
  };
}

export interface OverlayEls {
  fade: HTMLElement; flash: HTMLElement; scope: HTMLElement;
  card: HTMLElement; cardZh: HTMLElement; cardEn: HTMLElement; cardSub: HTMLElement; cardRule: HTMLElement;
}

export function applyOverlays(state: OverlayState, els: OverlayEls): void {
  els.fade.style.opacity = state.fade.toFixed(3);
  els.flash.style.opacity = state.flash.toFixed(3);
  els.scope.style.opacity = state.scope.toFixed(3);
  els.card.style.opacity = state.card.opacity.toFixed(3);
  if (els.cardZh.textContent !== state.card.zh) els.cardZh.textContent = state.card.zh;
  if (els.cardEn.textContent !== state.card.en) els.cardEn.textContent = state.card.en;
  if (els.cardSub.textContent !== state.card.sub) els.cardSub.textContent = state.card.sub;
  els.cardRule.style.width = (state.card.rule * 180).toFixed(1) + "px";
}
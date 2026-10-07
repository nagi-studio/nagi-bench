import { useEffect, useRef } from 'react';
import type { GameEngine } from '../game/engine/GameEngine';

/**
 * Per-frame widgets driven directly from the engine's FastHud (no React re-render):
 * dynamic crosshair, hit marker, damage direction arcs and red damage vignette.
 */
export function Crosshair({ engine }: { engine: GameEngine }) {
  const root = useRef<HTMLDivElement>(null);
  const lines = useRef<(HTMLDivElement | null)[]>([]);
  const hit = useRef<HTMLDivElement>(null);
  const dmgCanvas = useRef<HTMLCanvasElement>(null);
  const vignette = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const f = engine.fast;
      const r = root.current;
      if (r) r.style.opacity = f.showCrosshair ? '1' : '0';
      const gap = f.crosshairGap;
      const len = 7;
      const [top, bottom, left, right] = lines.current;
      if (top) top.style.transform = `translate(-50%, ${-gap - len}px)`;
      if (bottom) bottom.style.transform = `translate(-50%, ${gap}px)`;
      if (left) left.style.transform = `translate(${-gap - len}px, -50%)`;
      if (right) right.style.transform = `translate(${gap}px, -50%)`;
      const h = hit.current;
      if (h) {
        h.style.opacity = String(Math.min(1, f.hitMarker * 1.4));
        h.className = `hitmarker ${f.hitKill ? 'kill' : f.hitHead ? 'head' : ''}`;
        h.style.transform = `translate(-50%, -50%) scale(${1 + (1 - f.hitMarker) * 0.25})`;
      }
      const v = vignette.current;
      if (v) v.style.opacity = String(Math.min(0.85, f.damageFlash));
      const c = dmgCanvas.current;
      if (c) {
        const w = c.clientWidth;
        const hh = c.clientHeight;
        if (c.width !== w || c.height !== hh) {
          c.width = w;
          c.height = hh;
        }
        const ctx = c.getContext('2d')!;
        ctx.clearRect(0, 0, w, hh);
        const cx = w / 2;
        const cy = hh / 2;
        const rad = Math.min(w, hh) * 0.16;
        for (const d of f.damageDirs) {
          // angle 0 = straight ahead (up on screen), positive = to the left
          const a = -Math.PI / 2 - d.angle;
          ctx.strokeStyle = `rgba(255,40,30,${Math.max(0, d.alpha) * 0.85})`;
          ctx.lineWidth = 7;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(cx, cy, rad, a - 0.32, a + 0.32);
          ctx.stroke();
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [engine]);

  return (
    <>
      <div className="damage-vignette" ref={vignette} />
      <canvas className="damage-canvas" ref={dmgCanvas} />
      <div className="crosshair" ref={root}>
        <div className="ch-line v" ref={(el) => (lines.current[0] = el)} />
        <div className="ch-line v" ref={(el) => (lines.current[1] = el)} />
        <div className="ch-line h" ref={(el) => (lines.current[2] = el)} />
        <div className="ch-line h" ref={(el) => (lines.current[3] = el)} />
        <div className="ch-dot" />
      </div>
      <div className="hitmarker" ref={hit}>
        <span />
        <span />
        <span />
        <span />
      </div>
    </>
  );
}

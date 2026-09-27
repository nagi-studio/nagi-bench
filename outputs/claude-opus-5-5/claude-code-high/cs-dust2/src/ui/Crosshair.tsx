import { useEffect, useRef } from 'react';
import type { GameClient } from '../client/gameClient.ts';

/** Dynamic crosshair: the gap equals the real weapon spread cone projected to the screen. */
export function Crosshair({ client }: { client: GameClient }) {
  const root = useRef<HTMLDivElement>(null);
  const lines = useRef<(HTMLDivElement | null)[]>([]);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let gapSmooth = 4;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const s = client.getCrosshair();
      gapSmooth += (s.gap - gapSmooth) * 0.45;
      const g = Math.round(gapSmooth);
      if (root.current) root.current.style.display = s.visible ? 'block' : 'none';
      if (dot.current) dot.current.style.display = s.dot ? 'block' : 'none';
      const [t, b, l, r] = lines.current;
      if (t) t.style.transform = `translate(-50%, ${-g - 9}px)`;
      if (b) b.style.transform = `translate(-50%, ${g}px)`;
      if (l) l.style.transform = `translate(${-g - 9}px, -50%)`;
      if (r) r.style.transform = `translate(${g}px, -50%)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [client]);

  return (
    <>
      <div ref={root} className="crosshair">
        <div ref={(e) => (lines.current[0] = e)} className="ch v" />
        <div ref={(e) => (lines.current[1] = e)} className="ch v" />
        <div ref={(e) => (lines.current[2] = e)} className="ch h" />
        <div ref={(e) => (lines.current[3] = e)} className="ch h" />
      </div>
      <div ref={dot} className="ch-dot" />
    </>
  );
}

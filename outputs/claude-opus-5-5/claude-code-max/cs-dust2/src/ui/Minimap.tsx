import { useEffect, useMemo, useRef } from 'react';
import type { GameEngine } from '../game/engine/GameEngine';
import { renderRadarBase } from './radar';

const SIZE = 236;

/**
 * Always-on radar: full Dust2 top-down outline, live markers for self (arrow), teammates,
 * spotted enemies and the C4. Drawn on its own canvas every animation frame.
 */
export function Minimap({ engine }: { engine: GameEngine }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const base = useMemo(() => renderRadarBase(engine.world.level), [engine]);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const c = canvas.current;
      if (!c) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (c.width !== SIZE * dpr) {
        c.width = SIZE * dpr;
        c.height = SIZE * dpr;
      }
      const ctx = c.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, SIZE, SIZE);
      const b = engine.world.level.def.bounds;
      const mw = b.x1 - b.x0;
      const mh = b.z1 - b.z0;
      const scale = (SIZE - 8) / Math.max(mw, mh);
      const ox = (SIZE - mw * scale) / 2;
      const oy = (SIZE - mh * scale) / 2;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(base, 0, 0, base.width, base.height, ox, oy, mw * scale, mh * scale);
      const P = (x: number, z: number): [number, number] => [ox + (x - b.x0) * scale, oy + (z - b.z0) * scale];
      const r = engine.radar();
      const t = performance.now() / 1000;

      // bomb
      if (r.bomb) {
        const [x, y] = P(r.bomb.x, r.bomb.z);
        const planted = r.bomb.state === 'planted';
        const pulse = planted ? 0.5 + 0.5 * Math.sin(t * 8) : 1;
        ctx.fillStyle = planted ? `rgba(255,${60 + 80 * pulse},40,1)` : r.bomb.state === 'defused' ? '#3fdc6a' : '#ff8c2a';
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.rect(x - 5, y - 4, 10, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('C4', x, y + 0.5);
        if (planted) {
          ctx.strokeStyle = `rgba(255,80,40,${0.6 * (1 - ((t * 1.5) % 1))})`;
          ctx.beginPath();
          ctx.arc(x, y, 6 + ((t * 1.5) % 1) * 12, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      for (const a of r.actors) {
        const [x, y] = P(a.x, a.z);
        const mate = a.team === r.team;
        if (!a.alive) {
          if (!mate) continue;
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x - 3, y - 3);
          ctx.lineTo(x + 3, y + 3);
          ctx.moveTo(x + 3, y - 3);
          ctx.lineTo(x - 3, y + 3);
          ctx.stroke();
          continue;
        }
        const color = !mate ? '#ff3b30' : a.team === 'CT' ? '#5aa2ff' : '#f2b233';
        // facing wedge
        const fx = -Math.sin(a.yaw);
        const fz = -Math.cos(a.yaw);
        if (a.self) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.atan2(fz, fx) + Math.PI / 2);
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -7);
          ctx.lineTo(5, 5);
          ctx.lineTo(0, 2.5);
          ctx.lineTo(-5, 5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          // view cone
          ctx.fillStyle = 'rgba(255,255,255,0.10)';
          ctx.beginPath();
          ctx.moveTo(x, y);
          const ang = Math.atan2(fz, fx);
          ctx.arc(x, y, 26, ang - 0.6, ang + 0.6);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + fx * 8, y + fz * 8);
          ctx.stroke();
          ctx.fillStyle = color;
          ctx.strokeStyle = a.viewed ? '#ffffff' : '#000';
          ctx.lineWidth = a.viewed ? 2 : 1.2;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          if (a.hasBomb) {
            ctx.fillStyle = '#ff8c2a';
            ctx.fillRect(x + 3, y - 7, 5, 4);
          }
        }
      }
      // frame
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, SIZE - 1, SIZE - 1);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [engine, base]);

  return <canvas className="minimap" ref={canvas} style={{ width: SIZE, height: SIZE }} />;
}

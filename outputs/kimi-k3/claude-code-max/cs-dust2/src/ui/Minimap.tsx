// ---------------------------------------------------------------------------
// 小地图：Dust2 俯视轮廓 + 实时点位（自己/队友/可见敌人/C4）
// ---------------------------------------------------------------------------

import { useEffect, useRef } from 'react';
import { GD, GW, OX, OZ } from '../game/mapData';
import type { Game } from '../game/engine';

const SCALE = 2; // 1 格 = 2px → 168 x 200

export function Minimap({ game }: { game: Game }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticRef = useRef<HTMLCanvasElement | null>(null);

  // 预渲染静态底图
  if (!staticRef.current) {
    const c = document.createElement('canvas');
    c.width = GW * SCALE;
    c.height = GD * SCALE;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#0c1016';
    ctx.fillRect(0, 0, c.width, c.height);
    for (let cz = 0; cz < GD; cz++) {
      for (let cx = 0; cx < GW; cx++) {
        const open = game.map.grid[cz * GW + cx] === 0;
        ctx.fillStyle = open ? '#232d3a' : '#48545f';
        ctx.fillRect(cx * SCALE, cz * SCALE, SCALE, SCALE);
      }
    }
    // 点位标识
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const zn of game.map.zones) {
      const x = ((zn.rect.x0 + zn.rect.x1) / 2 + OX) * SCALE;
      const y = ((zn.rect.z0 + zn.rect.z1) / 2 + OZ) * SCALE;
      ctx.fillStyle = zn.name === 'siteA' || zn.name === 'siteB' ? '#ff9a3c' : '#7d94ab';
      ctx.fillText(zn.label, x, y);
    }
    staticRef.current = c;
  }

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const canvas = canvasRef.current;
      if (!canvas || !staticRef.current) return;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(staticRef.current, 0, 0);

      const toPx = (x: number, z: number) => ({ px: (x + OX) * SCALE, py: (z + OZ) * SCALE });
      const me = game.controlled;

      // C4
      const b = game.bomb;
      if (b.state === 'dropped' || b.state === 'planted') {
        const { px, py } = toPx(b.pos.x, b.pos.z);
        ctx.fillStyle = Math.floor(game.now * 3) % 2 ? '#ff5a2a' : '#ffd257';
        ctx.beginPath();
        ctx.arc(px, py, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
      }

      // 实体
      for (const e of game.entities) {
        if (!e.alive || e === me) continue;
        const isMate = e.team === me.team;
        if (!isMate && !game.visibleEnemies.has(e.id)) continue;
        const { px, py } = toPx(e.pos.x, e.pos.z);
        ctx.fillStyle = isMate ? (e.team === 'CT' ? '#58a6ff' : '#ffb84d') : '#ff4d4d';
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx.fill();
        if (e.hasBomb) {
          ctx.strokeStyle = '#ffd257';
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      }

      // 自己（带朝向）
      if (me) {
        const { px, py } = toPx(me.pos.x, me.pos.z);
        const fx = -Math.sin(me.yaw), fz = -Math.cos(me.yaw);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(px + fx * 6, py + fz * 6);
        const lx = -fz, lz = fx;
        ctx.lineTo(px - fx * 3.5 + lx * 3.5, py - fz * 3.5 + lz * 3.5);
        ctx.lineTo(px - fx * 3.5 - lx * 3.5, py - fz * 3.5 - lz * 3.5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1a1a1a';
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [game]);

  return <canvas ref={canvasRef} width={GW * SCALE} height={GD * SCALE} className="minimap" />;
}

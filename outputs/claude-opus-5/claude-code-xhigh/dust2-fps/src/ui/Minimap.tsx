/**
 * 小地图：常驻显示 Dust2 俯视轮廓 + 实时点位。
 * 静态底图只画一次到离屏 canvas，每帧只 blit + 画动态点，几乎不吃性能。
 * 敌人只有"本队当前看得见"的才会显示（engine.enemyVisible 由引擎按 8Hz 更新）。
 */

import { useEffect, useRef } from 'react';
import type { GameEngine } from '../game/engine.ts';
import { AREAS, BOMB_SITES, PROPS, mapBounds } from '../map/dust2.ts';
import type { Zone } from '../map/dust2.ts';

const W = 210;
const H = 216;
const PAD = 6;

const ZONE_FILL: Record<Zone, string> = {
  tspawn: '#4a3a2a',
  ctspawn: '#2c3a4d',
  long: '#453824',
  asite: '#5a4326',
  short: '#3d3524',
  mid: '#3a3628',
  tunnel: '#332b22',
  bsite: '#54402a',
  connector: '#33302a',
};

export function Minimap({ engine }: { engine: GameEngine }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const b = mapBounds();
    const scale = Math.min((W - PAD * 2) / (b.x1 - b.x0), (H - PAD * 2) / (b.z1 - b.z0));
    const ox = PAD + ((W - PAD * 2) - (b.x1 - b.x0) * scale) / 2;
    const oz = PAD + ((H - PAD * 2) - (b.z1 - b.z0) * scale) / 2;
    const tx = (x: number) => ox + (x - b.x0) * scale;
    const tz = (z: number) => oz + (z - b.z0) * scale;

    // ---- 静态底图 ----
    const bg = document.createElement('canvas');
    bg.width = W * dpr;
    bg.height = H * dpr;
    const bctx = bg.getContext('2d')!;
    bctx.scale(dpr, dpr);
    bctx.clearRect(0, 0, W, H);

    for (const a of AREAS) {
      bctx.fillStyle = ZONE_FILL[a.zone];
      bctx.fillRect(tx(a.x0), tz(a.z0), (a.x1 - a.x0) * scale, (a.z1 - a.z0) * scale);
    }
    // 区域描边，让走廊结构看得清
    bctx.strokeStyle = 'rgba(226, 205, 160, 0.35)';
    bctx.lineWidth = 1;
    for (const a of AREAS) {
      bctx.strokeRect(tx(a.x0), tz(a.z0), (a.x1 - a.x0) * scale, (a.z1 - a.z0) * scale);
    }
    // 掩体
    bctx.fillStyle = 'rgba(20, 16, 12, 0.55)';
    for (const p of PROPS) {
      bctx.fillRect(tx(p.x0), tz(p.z0), (p.x1 - p.x0) * scale, (p.z1 - p.z0) * scale);
    }
    // 炸弹点
    for (const s of BOMB_SITES) {
      bctx.strokeStyle = 'rgba(255, 120, 90, 0.85)';
      bctx.lineWidth = 1.5;
      bctx.setLineDash([3, 3]);
      bctx.strokeRect(tx(s.x0), tz(s.z0), (s.x1 - s.x0) * scale, (s.z1 - s.z0) * scale);
      bctx.setLineDash([]);
      bctx.fillStyle = 'rgba(255, 150, 120, 0.95)';
      bctx.font = 'bold 13px system-ui';
      bctx.textAlign = 'center';
      bctx.fillText(s.id, tx((s.x0 + s.x1) / 2), tz((s.z0 + s.z1) / 2) + 5);
    }
    bgRef.current = bg;

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(bg, 0, 0, W, H);

      const view = engine.viewActor;
      const myTeam = view?.team ?? engine.playerTeam;

      // C4
      const bomb = engine.bomb;
      if (bomb.phase === 'planted' || bomb.phase === 'dropped') {
        const x = tx(bomb.pos.x);
        const z = tz(bomb.pos.z);
        const blink = bomb.phase === 'planted' ? 0.55 + 0.45 * Math.sin(performance.now() / 120) : 1;
        ctx.fillStyle = bomb.phase === 'planted' ? `rgba(255,60,40,${blink})` : 'rgba(255,190,60,0.95)';
        ctx.fillRect(x - 4, z - 4, 8, 8);
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 4, z - 4, 8, 8);
      }

      // 角色
      for (let i = 0; i < engine.actors.length; i++) {
        const a = engine.actors[i];
        if (!a.alive) continue;
        const friendly = a.team === myTeam;
        if (!friendly && !engine.enemyVisible[i]) continue;

        const x = tx(a.pos.x);
        const z = tz(a.pos.z);
        const isView = view != null && a.id === view.id;

        // 朝向扇形
        if (friendly) {
          ctx.beginPath();
          ctx.moveTo(x, z);
          const dirX = -Math.sin(a.yaw);
          const dirZ = -Math.cos(a.yaw);
          const px = -dirZ;
          const pz = dirX;
          const len = isView ? 16 : 10;
          const spread = isView ? 0.42 : 0.3;
          ctx.lineTo(x + (dirX + px * spread) * len, z + (dirZ + pz * spread) * len);
          ctx.lineTo(x + (dirX - px * spread) * len, z + (dirZ - pz * spread) * len);
          ctx.closePath();
          ctx.fillStyle = isView ? 'rgba(120, 230, 160, 0.28)' : 'rgba(120, 200, 255, 0.18)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, z, isView ? 4.2 : 3.4, 0, Math.PI * 2);
        ctx.fillStyle = isView
          ? '#7dff9e'
          : friendly
            ? a.team === 'CT'
              ? '#5aa9ff'
              : '#ffcc55'
            : '#ff4d4d';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0,0,0,0.75)';
        ctx.stroke();

        if (a.hasBomb) {
          ctx.fillStyle = '#ffd23f';
          ctx.fillRect(x - 1.5, z - 8, 3, 3);
        }
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [engine]);

  return (
    <div className="minimap">
      <canvas ref={canvasRef} style={{ width: W, height: H }} />
    </div>
  );
}

// ============================================================================
// 小地图 —— Canvas 2D 常驻绘制：Dust2 俯视轮廓 + 队友/可见敌人/C4 实时点位
// ============================================================================
import { useEffect, useRef } from 'react';
import type { Game } from '../game/engine';

export function Minimap({ game }: { game: Game }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const g = game;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    const W = 232, H = 188;
    canvas.width = W;
    canvas.height = H;
    const { bounds, flats, wallLines, sites } = g.getMinimapStatic();
    const sx = (x: number) => ((x - bounds.x) / bounds.w) * W;
    const sz = (z: number) => ((z - bounds.z) / bounds.d) * H;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const st = g.store.getSnapshot();
      if (st.phase === 'menu' || st.phase === 'matchover') {
        ctx.clearRect(0, 0, W, H);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      // 背景
      ctx.fillStyle = 'rgba(12,14,18,0.78)';
      ctx.fillRect(0, 0, W, H);
      // 地面
      ctx.fillStyle = '#b8a47e';
      for (const f of flats) {
        ctx.fillRect(sx(f.x), sz(f.z), (f.w / bounds.w) * W, (f.d / bounds.d) * H);
      }
      // 墙体描边
      ctx.strokeStyle = 'rgba(60,48,30,0.9)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (const [x0, z0, x1, z1] of wallLines) {
        ctx.moveTo(sx(x0), sz(z0));
        ctx.lineTo(sx(x1), sz(z1));
      }
      ctx.stroke();
      // 下包区
      for (const key of ['A', 'B'] as const) {
        const s2 = sites[key];
        ctx.strokeStyle = 'rgba(255,90,40,0.55)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(sx(s2.x), sz(s2.z), (s2.w / bounds.w) * W, (s2.d / bounds.d) * H);
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(255,120,70,0.75)';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(key, sx(s2.x + s2.w / 2), sz(s2.z + s2.d / 2) + 4);
      }
      // 炸弹
      if (st.bombWorld) {
        const bx = sx(st.bombWorld.x), bz = sz(st.bombWorld.z);
        const blink = st.bombState === 'planted' && Math.floor(performance.now() / 300) % 2 === 0;
        ctx.fillStyle = st.bombState === 'planted' ? (blink ? '#ff3030' : '#ffb0b0') : '#ffa040';
        ctx.beginPath();
        ctx.arc(bx, bz, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 7px sans-serif';
        ctx.fillText('C4', bx, bz - 7);
      }
      // 玩家
      for (const p of st.players) {
        if (!p.alive && !p.isSpectate) continue;
        const px = sx(p.x), pz = sz(p.z);
        const me = p.isSelf;
        const enemy = p.team !== st.self.team;
        if (enemy && !p.visible) continue;
        const color = p.team === 'T' ? '#e8a33c' : '#5f8fe8';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, pz, me ? 5 : 3.6, 0, Math.PI * 2);
        ctx.fill();
        if (me) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        if (p.isSpectate) {
          ctx.strokeStyle = '#4fe0ff';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(px, pz, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
        // 朝向
        ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(px, pz);
        ctx.lineTo(px - Math.sin(p.yaw) * 7, pz - Math.cos(p.yaw) * 7);
        ctx.stroke();
        if (p.alive && p.isCarrier) {
          ctx.fillStyle = '#ff5040';
          ctx.beginPath();
          ctx.arc(px, pz - 8, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 标题
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('DUST2', 6, 12);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [game]);

  return <canvas ref={canvasRef} className="minimap" />;
}

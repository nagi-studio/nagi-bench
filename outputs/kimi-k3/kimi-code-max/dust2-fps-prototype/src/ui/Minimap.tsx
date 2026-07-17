import { useEffect, useRef, useSyncExternalStore } from 'react';
import type { Engine } from '../game/engine';
import type { UIStore } from './store';

const W = 200;
const H = 216;

export function Minimap({ store, engine }: { store: UIStore; engine: Engine }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticRef = useRef<HTMLCanvasElement | null>(null);
  const myTeam = useSyncExternalStore(store.subscribe, () => store.get().myTeam);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const map = engine.map;
    const b = map.bounds;
    const sx = W / (b.x2 - b.x1);
    const sz = H / (b.z2 - b.z1);
    const px = (x: number) => (x - b.x1) * sx;
    const pz = (z: number) => (z - b.z1) * sz;

    // ---- static layer ----
    if (!staticRef.current) {
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const o = off.getContext('2d')!;
      o.fillStyle = 'rgba(8, 10, 14, 0.78)';
      o.fillRect(0, 0, W, H);
      // floors
      o.fillStyle = '#3b4048';
      for (const r of map.rooms) {
        o.fillRect(px(r.x1), pz(r.z1), (r.x2 - r.x1) * sx, (r.z2 - r.z1) * sz);
      }
      // tunnels shade
      o.fillStyle = '#2c3138';
      o.fillRect(px(2), pz(44), (50 - 2) * sx, (52 - 44) * sz);
      o.fillRect(px(46), pz(-12), (52 - 46) * sx, (52 - -12) * sz);
      // walls / crates (only things standing on the ground)
      o.fillStyle = '#7a828e';
      for (const s of map.solids) {
        if (s.minY > 0.5) continue;
        o.fillRect(px(s.minX), pz(s.minZ), Math.max(1, (s.maxX - s.minX) * sx), Math.max(1, (s.maxZ - s.minZ) * sz));
      }
      // site labels
      o.fillStyle = '#c8ccd2';
      o.font = 'bold 11px monospace';
      o.fillText('A', px(-42), pz(-36));
      o.fillText('B', px(48), pz(-26));
      o.fillText('MID', px(-9), pz(28));
      staticRef.current = off;
    }

    let alive = true;
    const draw = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(staticRef.current!, 0, 0);
      const st = engine.getMinimapState();
      // bomb
      if (st.bomb) {
        const blink = st.bomb.state !== 'planted' || Math.floor(Date.now() / 300) % 2 === 0;
        if (blink) {
          ctx.fillStyle = '#f0a020';
          ctx.beginPath();
          ctx.arc(px(st.bomb.x), pz(st.bomb.z), 3.2, 0, 7);
          ctx.fill();
        }
      }
      // teammates
      ctx.fillStyle = '#58d068';
      for (const m of st.mates) {
        ctx.beginPath();
        ctx.arc(px(m.x), pz(m.z), 2.4, 0, 7);
        ctx.fill();
      }
      // visible enemies
      ctx.fillStyle = '#e04c3c';
      for (const e of st.enemies) {
        ctx.beginPath();
        ctx.arc(px(e.x), pz(e.z), 2.6, 0, 7);
        ctx.fill();
      }
      // self with view cone
      const p = st.player;
      const dx = -Math.sin(p.yaw);
      const dz = -Math.cos(p.yaw);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.moveTo(px(p.x), pz(p.z));
      ctx.lineTo(px(p.x + dx * 8), pz(p.z + dz * 8));
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px(p.x), pz(p.z), 3, 0, 7);
      ctx.fill();
    };
    draw();
    const iv = setInterval(draw, 150);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [engine, myTeam]);

  return <canvas ref={canvasRef} width={W} height={H} className="minimap" />;
}

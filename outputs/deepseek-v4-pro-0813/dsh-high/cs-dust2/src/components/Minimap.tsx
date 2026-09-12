import { useEffect, useRef } from 'react';
import type { MinimapPlayer } from '../game/store';
import { A_SITE_CENTER, B_SITE_CENTER, SITE_RADIUS } from '../game/config';

interface Props {
  walls: { x0: number; z0: number; x1: number; z1: number }[];
  players: MinimapPlayer[];
  c4Pos: { x: number; z: number } | null;
  c4State: 'carried' | 'dropped' | 'planted' | 'none';
}

export default function Minimap({ walls, players, c4Pos, c4State }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (const w of walls) {
      minX = Math.min(minX, w.x0, w.x1);
      maxX = Math.max(maxX, w.x0, w.x1);
      minZ = Math.min(minZ, w.z0, w.z1);
      maxZ = Math.max(maxZ, w.z0, w.z1);
    }
    if (!isFinite(minX)) {
      minX = -42;
      maxX = 42;
      minZ = -34;
      maxZ = 24;
    }
    const pad = 6;
    const scale = Math.min((W - pad * 2) / (maxX - minX), (H - pad * 2) / (maxZ - minZ));
    const ox = (W - (maxX - minX) * scale) / 2;
    const oz = (H - (maxZ - minZ) * scale) / 2;
    const tx = (x: number) => ox + (x - minX) * scale;
    const tz = (z: number) => oz + (z - minZ) * scale;

    // background
    ctx.fillStyle = 'rgba(46, 54, 44, 0.85)';
    ctx.fillRect(0, 0, W, H);

    // walls
    ctx.fillStyle = '#93825f';
    for (const w of walls) {
      const x = tx(Math.min(w.x0, w.x1));
      const y = tz(Math.min(w.z0, w.z1));
      const ww = Math.abs(w.x1 - w.x0) * scale;
      const wh = Math.abs(w.z1 - w.z0) * scale;
      ctx.fillRect(x, y, Math.max(ww, 1), Math.max(wh, 1));
    }

    // site circles
    const drawSite = (cx: number, cz: number, label: string, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(tx(cx), tz(cz), SITE_RADIUS * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, tx(cx), tz(cz) - 2);
    };
    drawSite(A_SITE_CENTER.x, A_SITE_CENTER.z, 'A', 'rgba(255,170,80,0.8)');
    drawSite(B_SITE_CENTER.x, B_SITE_CENTER.z, 'B', 'rgba(255,170,80,0.8)');

    // C4
    if (c4Pos) {
      const blink = c4State === 'planted' && Math.floor(performance.now() / 400) % 2 === 0;
      ctx.fillStyle = blink || c4State === 'dropped' ? '#ff3b30' : '#ff8a80';
      ctx.beginPath();
      ctx.arc(tx(c4Pos.x), tz(c4Pos.z), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // players
    for (const p of players) {
      const x = tx(p.x);
      const z = tz(p.z);
      const color = p.team === 'T' ? '#ffd97d' : '#7db8ff';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, z, p.isSelf ? 4.5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      if (p.isSelf) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }, [walls, players, c4Pos, c4State]);

  return <canvas ref={ref} width={230} height={158} />;
}

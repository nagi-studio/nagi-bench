import { useEffect, useMemo, useRef } from 'react';
import type { MapData } from '../game/core/map.ts';
import type { Snapshot } from '../game/core/types.ts';
import { h } from './h.ts';

const SIZE_W = 210;
const SIZE_H = 230;

export function Minimap({ map, snap }: { map: MapData; snap: Snapshot }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const b = map.bounds;
  const scale = Math.min(SIZE_W / (b.x2 - b.x1), SIZE_H / (b.z2 - b.z1));
  const ox = (SIZE_W - (b.x2 - b.x1) * scale) / 2;
  const oz = (SIZE_H - (b.z2 - b.z1) * scale) / 2;
  const px = (x: number) => ox + (x - b.x1) * scale;
  const pz = (z: number) => oz + (z - b.z1) * scale;

  const background = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = SIZE_W;
    c.height = SIZE_H;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, SIZE_W, SIZE_H);
    ctx.fillStyle = '#3a3325';
    for (const r of map.floors) {
      ctx.fillRect(px(r.x1), pz(r.z1), (r.x2 - r.x1) * scale, (r.z2 - r.z1) * scale);
    }
    for (const col of map.colliders) {
      const isDoor = col.tag === 'midDoor' || col.tag === 'longDoor' || col.tag === 'bDoor';
      ctx.fillStyle = isDoor ? '#7a5a34' : col.material === 'crate' || col.material === 'wood' ? '#5a4a30' : '#8a7d5e';
      ctx.fillRect(px(col.min.x), pz(col.min.z), (col.max.x - col.min.x) * scale, (col.max.z - col.min.z) * scale);
    }
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(224,176,64,0.8)';
    ctx.fillText('A', px((map.sites.A.x1 + map.sites.A.x2) / 2), pz((map.sites.A.z1 + map.sites.A.z2) / 2));
    ctx.fillStyle = 'rgba(224,112,64,0.85)';
    ctx.fillText('B', px((map.sites.B.x1 + map.sites.B.x2) / 2), pz((map.sites.B.z1 + map.sites.B.z2) / 2));
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, SIZE_W, SIZE_H);
    ctx.drawImage(background, 0, 0);

    const teamColor = (team: string) => (team === 'CT' ? '#4a90d9' : '#d9a441');

    if (snap.bomb.state === 'dropped' || snap.bomb.state === 'planted') {
      const bx = px(snap.bomb.x), bz = pz(snap.bomb.z);
      ctx.fillStyle = snap.bomb.state === 'planted' ? '#ff3b30' : '#ffd60a';
      ctx.fillRect(bx - 3, bz - 3, 6, 6);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx - 3, bz - 3, 6, 6);
      if (snap.bomb.state === 'planted') {
        ctx.strokeStyle = 'rgba(255,59,48,0.6)';
        ctx.beginPath();
        ctx.arc(bx, bz, 6 + Math.sin(Date.now() / 150) * 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    for (const d of snap.dots) {
      if (!d.alive) continue;
      const x = px(d.x), z = pz(d.z);
      const isEnemy = d.team !== snap.playerTeam;
      if (isEnemy) {
        ctx.fillStyle = '#e04040';
        ctx.beginPath();
        ctx.arc(x, z, 3, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      if (d.isSelf || d.isControlled) {
        const fx = Math.sin(d.yaw), fz = -Math.cos(d.yaw);
        ctx.save();
        ctx.translate(x, z);
        ctx.fillStyle = d.isControlled ? '#ffffff' : '#c8e6ff';
        ctx.beginPath();
        ctx.moveTo(fx * 6, fz * 6);
        ctx.lineTo(-fx * 4 - fz * 3.5, -fz * 4 + fx * 3.5);
        ctx.lineTo(-fx * 4 + fz * 3.5, -fz * 4 - fx * 3.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        if (d.bombCarrier) {
          ctx.strokeStyle = '#ffd60a';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, z, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = teamColor(d.team);
        ctx.beginPath();
        ctx.arc(x, z, 3, 0, Math.PI * 2);
        ctx.fill();
        if (d.bombCarrier) {
          ctx.strokeStyle = '#ffd60a';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, z, 5.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  }, [snap, background, scale, ox, oz]);

  return h('canvas', { ref, width: SIZE_W, height: SIZE_H, className: 'minimap' });
}

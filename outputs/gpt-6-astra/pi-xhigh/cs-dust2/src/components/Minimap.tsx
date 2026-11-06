import { useEffect, useRef } from 'react';
import { CELL, COLS, FLOOR, cellPoint } from '../game/map';
import type { Snapshot, Team } from '../game/types';

export function Minimap({ snapshot, team = 'T', large = false }: { snapshot?: Snapshot | null; team?: Team; large?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const size = 480; canvas.width = size; canvas.height = size;
    const scale = 3.58, ox = 240, oz = 226;
    const x = (v: number) => ox + v * scale, z = (v: number) => oz + v * scale;
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(186,205,180,.07)'; ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke(); }
    for (let i = 0; i < FLOOR.length; i++) {
      if (!FLOOR[i]) continue;
      const p = cellPoint(i);
      ctx.fillStyle = '#687365'; ctx.fillRect(x(p.x - 1), z(p.z - 1), CELL * scale + .2, CELL * scale + .2);
      const c = i % COLS;
      ctx.strokeStyle = '#9ba58d'; ctx.lineWidth = 1.2;
      const left = x(p.x - 1), top = z(p.z - 1), s = CELL * scale;
      ctx.beginPath();
      if (c === 0 || !FLOOR[i - 1]) { ctx.moveTo(left, top); ctx.lineTo(left, top + s); }
      if (!FLOOR[i + 1]) { ctx.moveTo(left + s, top); ctx.lineTo(left + s, top + s); }
      if (!FLOOR[i - COLS]) { ctx.moveTo(left, top); ctx.lineTo(left + s, top); }
      if (!FLOOR[i + COLS]) { ctx.moveTo(left, top + s); ctx.lineTo(left + s, top + s); }
      ctx.stroke();
    }
    for (const [px, pz, w, d] of [[33, -33, 4, 3], [39, -24, 3, 3], [-44, -29, 4, 3], [-33, -36, 3, 3], [-5, 1, 2.5, 3.5], [46, -10, 3, 3], [-3.1, -12, 2.6, .5], [3.1, -12, 2.6, .5]]) {
      ctx.fillStyle = '#303b33'; ctx.fillRect(x(px - w / 2), z(pz - d / 2), w * scale, d * scale);
    }
    for (const [label, px, pz] of [['A', 34, -29], ['B', -40, -27]] as const) {
      ctx.beginPath(); ctx.arc(x(px), z(pz), 22, 0, Math.PI * 2); ctx.fillStyle = 'rgba(226,158,73,.22)'; ctx.fill(); ctx.strokeStyle = '#cfa65f'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.font = 'bold 22px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = '#f7cf80'; ctx.fillText(label, x(px), z(pz) + 8);
    }
    ctx.font = '11px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = '#dde0cb';
    for (const [label, px, pz] of [['CT', 0, -36], ['T', 0, 42], ['MID', 0, -2], ['LONG', 45, 4], ['TUNNELS', -40, 19], ['SHORT', 17, -5]] as const) ctx.fillText(label, x(px), z(pz));
    if (snapshot) {
      for (const a of snapshot.actors) {
        if (!a.alive || (a.team !== team && !a.seen)) continue;
        const own = a.id === snapshot.playerId;
        ctx.save(); ctx.translate(x(a.x), z(a.z)); ctx.rotate(-a.yaw);
        if (own) {
          ctx.fillStyle = 'rgba(231,241,214,.16)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 29, -Math.PI * .72, -Math.PI * .28); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#fff7d9'; ctx.strokeStyle = '#1b2c24'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(-6, 6); ctx.lineTo(0, 3); ctx.lineTo(6, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
        } else {
          ctx.fillStyle = a.team === team ? '#95c5ba' : '#ed7858'; ctx.strokeStyle = '#1b2c24'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
        ctx.restore();
      }
      const bomb = snapshot.bomb;
      if (!['defused', 'exploded'].includes(bomb.state)) {
        ctx.save(); ctx.translate(x(bomb.x), z(bomb.z)); ctx.rotate(Math.PI / 4); ctx.fillStyle = bomb.state === 'planted' ? '#ff704a' : '#ffcd72'; ctx.strokeStyle = '#2b3026'; ctx.lineWidth = 2; ctx.fillRect(-4, -4, 8, 8); ctx.strokeRect(-4, -4, 8, 8); ctx.restore();
      }
    }
    ctx.fillStyle = '#a7b4a1'; ctx.font = '12px Arial'; ctx.fillText('N', 240, 24); ctx.beginPath(); ctx.moveTo(240, 33); ctx.lineTo(236, 40); ctx.lineTo(244, 40); ctx.closePath(); ctx.fill();
  }, [snapshot, team]);
  return <canvas className={`minimap ${large ? 'large' : ''}`} ref={ref} aria-label="Dust II 俯视小地图：自己、队友、可见敌人和 C4" />;
}

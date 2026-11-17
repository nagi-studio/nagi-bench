import { useEffect, useRef } from 'react';
import type { Snapshot } from '../game/types';
import type { Engine } from '../game/engine';
import { MAP_BOUNDS, SITES, ZONES } from '../game/world';

export default function Minimap({ game, snapshot, briefing = false }: { game: Engine; snapshot: Snapshot; briefing?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const size = 440, pad = 22, scale = (size - pad * 2) / 90, offsetY = 37;
    const px = (x: number) => (x - MAP_BOUNDS.x1) * scale + pad;
    const pz = (z: number) => (z - MAP_BOUNDS.z1) * scale + offsetY;
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(183,201,185,.05)'; ctx.lineWidth = 1;
    for (let n = 0; n < size; n += 22) { ctx.beginPath(); ctx.moveTo(n, 0); ctx.lineTo(n, size); ctx.moveTo(0, n); ctx.lineTo(size, n); ctx.stroke(); }
    ctx.fillStyle = '#46504a';
    for (const r of ZONES) ctx.fillRect(px(r.x1), pz(r.z1), (r.x2 - r.x1) * scale, (r.z2 - r.z1) * scale);
    ctx.strokeStyle = '#95a28d'; ctx.lineWidth = 1.5;
    for (const b of game.world.boundary) { ctx.strokeRect(px(b.x - b.w / 2), pz(b.z - b.d / 2), b.w * scale, b.d * scale); }
    for (const b of game.world.colliders) if (b.kind === 'crate' || b.kind === 'door') {
      ctx.fillStyle = b.kind === 'door' ? '#a8926f' : '#292f2b'; ctx.fillRect(px(b.x - b.w / 2), pz(b.z - b.d / 2), b.w * scale, b.d * scale);
    }
    for (const [key, site] of Object.entries(SITES)) {
      ctx.fillStyle = 'rgba(226,163,78,.12)'; ctx.fillRect(px(site.x - 5), pz(site.z - 5), 10 * scale, 10 * scale);
      ctx.strokeStyle = 'rgba(226,163,78,.38)'; ctx.lineWidth = 1; ctx.strokeRect(px(site.x - 5), pz(site.z - 5), 10 * scale, 10 * scale);
      ctx.font = 'bold 24px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#e6ac62'; ctx.fillText(key, px(site.x), pz(site.z));
    }
    ctx.font = '10px monospace'; ctx.fillStyle = '#a9b5a1'; ctx.fillText('T', px(0), pz(-39)); ctx.fillText('CT', px(2), pz(29));
    if (!briefing) {
      for (const a of snapshot.actors) {
        if (a.id === snapshot.player.id || !a.visible) continue;
        if (!a.alive) {
          if (a.team !== snapshot.team) continue;
          ctx.strokeStyle = '#8c9384'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px(a.x) - 3, pz(a.z) - 3); ctx.lineTo(px(a.x) + 3, pz(a.z) + 3); ctx.moveTo(px(a.x) + 3, pz(a.z) - 3); ctx.lineTo(px(a.x) - 3, pz(a.z) + 3); ctx.stroke(); continue;
        }
        ctx.beginPath(); ctx.arc(px(a.x), pz(a.z), a.team === snapshot.team ? 5 : 6, 0, Math.PI * 2); ctx.fillStyle = a.team === snapshot.team ? '#88c6d8' : '#ee755d'; ctx.fill();
      }
      const b = snapshot.bomb;
      if ((b.state === 'carried' && snapshot.team === 'T') || b.state === 'planted' || (b.state === 'dropped' && snapshot.team === 'T')) {
        ctx.save(); ctx.translate(px(b.x), pz(b.z)); ctx.rotate(Math.PI / 4); ctx.strokeStyle = '#ffcc6f'; ctx.lineWidth = 2.5; ctx.strokeRect(-5, -5, 10, 10); ctx.restore();
      }
      const p = snapshot.player; ctx.save(); ctx.translate(px(p.x), pz(p.z)); ctx.rotate(-p.yaw);
      ctx.fillStyle = 'rgba(244,239,200,.08)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 30, -2.12, -1.02); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#f7f0ce'; ctx.strokeStyle = '#1c2420'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(6, 6); ctx.lineTo(0, 3); ctx.lineTo(-6, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    ctx.fillStyle = '#9baba0'; ctx.font = '11px monospace'; ctx.textAlign = 'right'; ctx.fillText('N ↑', 420, 24);
  }, [game, snapshot, briefing]);
  return <canvas ref={ref} width="440" height="440" className={`minimap ${briefing ? 'briefing-map' : ''}`} aria-label="Dust2 俯视小地图：T 出生点、CT 出生点、A 大、A 点、中门、猫道、B 洞、B 点" />;
}

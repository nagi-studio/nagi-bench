import { useEffect, useRef } from 'react';
import type { GameEngine } from '../game/engine';
import type { HudSnapshot } from '../game/types';

export function Minimap({ engine, snapshot }: { engine: GameEngine; snapshot: HudSnapshot }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    const bounds = engine.map.bounds;
    const scale = Math.min((width - 16) / (bounds.maxX - bounds.minX), (height - 16) / (bounds.maxZ - bounds.minZ));
    const mapWidth = (bounds.maxX - bounds.minX) * scale;
    const mapHeight = (bounds.maxZ - bounds.minZ) * scale;
    const ox = (width - mapWidth) / 2 - bounds.minX * scale;
    const oz = (height - mapHeight) / 2 - bounds.minZ * scale;
    const project = (x: number, z: number) => ({ x: ox + x * scale, y: oz + z * scale });
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(10,16,18,.86)';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(191,211,203,.06)';
    ctx.lineWidth = 1;
    for (let i = 20; i < width; i += 20) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }
    for (const site of Object.values(engine.map.sites)) {
      const p = project(site.x, site.z);
      ctx.beginPath();
      ctx.arc(p.x, p.y, site.radius * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(207,169,83,.09)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(218,183,104,.28)';
      ctx.stroke();
    }
    for (const c of engine.map.colliders) {
      if (c.minY > 0.6) continue;
      const p = project(c.minX, c.minZ);
      ctx.fillStyle = c.kind === 'crate' ? '#756c55' : c.kind === 'door' ? '#a47b4c' : '#59635d';
      ctx.fillRect(p.x, p.y, Math.max(1, (c.maxX - c.minX) * scale), Math.max(1, (c.maxZ - c.minZ) * scale));
    }
    ctx.font = '600 8px Arial';
    ctx.textAlign = 'center';
    for (const region of engine.map.regions) {
      const p = project(region.x, region.z);
      ctx.fillStyle = region.name.includes('SITE') ? '#d5b76c' : 'rgba(199,212,204,.48)';
      ctx.fillText(region.name, p.x, p.y - 5);
    }
    for (const player of snapshot.players) {
      if (!player.alive) continue;
      const friendly = player.team === snapshot.team;
      if (!friendly && !snapshot.spotted.includes(player.id)) continue;
      const p = project(player.x, player.z);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(-player.yaw);
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(4.2, 4.5);
      ctx.lineTo(0, 2.5);
      ctx.lineTo(-4.2, 4.5);
      ctx.closePath();
      ctx.fillStyle = player.id === snapshot.controlledId ? '#ffffff' : friendly ? (player.team === 'CT' ? '#67c5e8' : '#e1bd62') : '#ef6658';
      ctx.fill();
      ctx.restore();
    }
    if (snapshot.bomb.status !== 'defused' && snapshot.bomb.status !== 'exploded') {
      const p = project(snapshot.bomb.x, snapshot.bomb.z);
      ctx.fillStyle = snapshot.bomb.status === 'planted' ? '#ff5848' : '#f3b34e';
      ctx.fillRect(p.x - 3.5, p.y - 3.5, 7, 7);
      ctx.strokeStyle = '#171b18';
      ctx.strokeRect(p.x - 3.5, p.y - 3.5, 7, 7);
    }
    ctx.strokeStyle = 'rgba(188,207,197,.2)';
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
  }, [engine, snapshot]);
  return <canvas ref={ref} width={230} height={230} className="minimap-canvas" />;
}

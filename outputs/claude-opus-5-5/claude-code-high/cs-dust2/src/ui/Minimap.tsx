import { useEffect, useRef } from 'react';
import type { GameClient } from '../client/gameClient.ts';
import { BOMBSITES, LABELS, MAP_BOUNDS } from '../core/mapData.ts';
import type { RegionId } from '../core/mapData.ts';

const SCALE = 2.0; // px per meter (CSS pixels)
// frame the walkable part of the map (areas span roughly x -54..48, z -58..54)
const OX = Math.max(MAP_BOUNDS.x0, -56);
const OZ = Math.max(MAP_BOUNDS.z0, -60);
const W = Math.round(Math.min(MAP_BOUNDS.x1, 50) - OX) * SCALE;
const H = Math.round(Math.min(MAP_BOUNDS.z1, 56) - OZ) * SCALE;

const REGION_FILL: Partial<Record<RegionId, string>> = {
  asite: 'rgba(214,186,140,0.95)',
  bsite: 'rgba(214,186,140,0.95)',
  tunnels: 'rgba(150,130,105,0.95)',
  lowertunnel: 'rgba(150,130,105,0.95)',
};

const toX = (x: number) => (x - OX) * SCALE;
const toY = (z: number) => (z - OZ) * SCALE;

function drawBackground(client: GameClient, dpr: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = W * dpr;
  c.height = H * dpr;
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  const world = client.sim.world;
  ctx.fillStyle = 'rgba(20,20,22,0.0)';
  ctx.fillRect(0, 0, W, H);
  // walkable cells; elevated floors are drawn lighter
  for (let j = 0; j < world.gh; j++)
    for (let i = 0; i < world.gw; i++) {
      if (!world.isOpenCell(i, j)) continue;
      const x = world.gx0 + i;
      const z = world.gz0 + j;
      const a = world.areaAt(x + 0.5, z + 0.5)!;
      const h = world.floorAt(x + 0.5, z + 0.5) ?? 0;
      ctx.fillStyle = REGION_FILL[a.region] ?? (h > 0.6 ? 'rgba(205,180,138,0.95)' : 'rgba(184,160,122,0.95)');
      ctx.fillRect(toX(x), toY(z), SCALE + 0.6, SCALE + 0.6);
    }
  // outlines
  ctx.strokeStyle = 'rgba(40,30,20,0.9)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let j = 0; j < world.gh; j++)
    for (let i = 0; i < world.gw; i++) {
      if (!world.isOpenCell(i, j)) continue;
      const x = toX(world.gx0 + i);
      const y = toY(world.gz0 + j);
      if (!world.isOpenCell(i - 1, j)) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + SCALE);
      }
      if (!world.isOpenCell(i + 1, j)) {
        ctx.moveTo(x + SCALE, y);
        ctx.lineTo(x + SCALE, y + SCALE);
      }
      if (!world.isOpenCell(i, j - 1)) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + SCALE, y);
      }
      if (!world.isOpenCell(i, j + 1)) {
        ctx.moveTo(x, y + SCALE);
        ctx.lineTo(x + SCALE, y + SCALE);
      }
    }
  ctx.stroke();
  // props
  ctx.fillStyle = 'rgba(90,70,50,0.85)';
  for (const s of world.solids) {
    if (s.kind === 'wall' || s.kind === 'lintel' || s.kind === 'roof') continue;
    ctx.fillRect(toX(s.minX), toY(s.minZ), (s.maxX - s.minX) * SCALE, (s.maxZ - s.minZ) * SCALE);
  }
  // bombsites
  for (const site of Object.values(BOMBSITES)) {
    ctx.fillStyle = 'rgba(210,60,40,0.16)';
    ctx.fillRect(toX(site.x0), toY(site.z0), (site.x1 - site.x0) * SCALE, (site.z1 - site.z0) * SCALE);
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const l of LABELS) {
    ctx.font = l.big ? 'bold 20px "Segoe UI", sans-serif' : '10px "Segoe UI", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = l.big ? (l.text === 'A' || l.text === 'B' ? 'rgba(190,40,30,0.85)' : 'rgba(40,30,20,0.6)') : 'rgba(40,30,20,0.75)';
    ctx.fillText(l.text, toX(l.x), toY(l.z));
  }
  return c;
}

export function Minimap({ client }: { client: GameClient }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const bg = drawBackground(client, dpr);
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const m = client.getMinimap();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bg, 0, 0);
      ctx.scale(dpr, dpr);
      // bomb
      if (m.bomb) {
        const x = toX(m.bomb.x);
        const y = toY(m.bomb.z);
        ctx.fillStyle = m.bomb.state === 'planted' ? (m.bomb.blink ? '#ff3b30' : '#8a1a14') : m.bomb.state === 'defused' ? '#4fa3ff' : '#ff9f1a';
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1;
        ctx.fillRect(x - 4, y - 3, 8, 6);
        ctx.strokeRect(x - 4, y - 3, 8, 6);
      }
      for (const d of m.dots) {
        const x = toX(d.x);
        const y = toY(d.z);
        if (d.kind === 'dead') {
          ctx.strokeStyle = d.team === 'CT' ? 'rgba(79,163,255,0.8)' : 'rgba(255,170,70,0.8)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(x - 3, y - 3);
          ctx.lineTo(x + 3, y + 3);
          ctx.moveTo(x + 3, y - 3);
          ctx.lineTo(x - 3, y + 3);
          ctx.stroke();
          continue;
        }
        const fx = -Math.sin(d.yaw);
        const fz = -Math.cos(d.yaw);
        if (d.kind === 'me') {
          // white arrow + view cone
          ctx.fillStyle = 'rgba(255,255,255,0.12)';
          ctx.beginPath();
          ctx.moveTo(x, y);
          const a0 = Math.atan2(fz, fx);
          ctx.arc(x, y, 34, a0 - 0.75, a0 + 0.75);
          ctx.closePath();
          ctx.fill();
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.atan2(fz, fx) + Math.PI / 2);
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(0, -7);
          ctx.lineTo(5, 5);
          ctx.lineTo(0, 2.5);
          ctx.lineTo(-5, 5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        } else {
          const col = d.kind === 'enemy' ? '#ff4040' : d.team === 'CT' ? '#4fa3ff' : '#ffae42';
          ctx.fillStyle = col;
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = col;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(x + fx * 4, y + fz * 4);
          ctx.lineTo(x + fx * 9, y + fz * 9);
          ctx.stroke();
          if (d.bomb) {
            ctx.fillStyle = '#ff9f1a';
            ctx.fillRect(x + 4, y - 7, 5, 4);
          }
        }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [client]);

  return <canvas ref={ref} className="minimap" style={{ width: W, height: H }} />;
}

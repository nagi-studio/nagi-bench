import { useEffect, useMemo, useRef } from 'react';
import type { MapData } from '../world/mapLayout';
import type { MinimapEntity } from '../game/types';

interface Props {
  map: MapData;
  entities: MinimapEntity[];
  yaw: number;
}

const SIZE = 208;

export function Minimap({ map, entities, yaw }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  // Pre-render the walkable layout once into an offscreen canvas.
  const base = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = map.width;
    c.height = map.height;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#0d1219';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = 'rgba(150, 170, 190, 0.9)';
    for (let gz = 0; gz < map.height; gz++) {
      for (let gx = 0; gx < map.width; gx++) {
        if (map.walkable[gz * map.width + gx]) ctx.fillRect(gx, gz, 1, 1);
      }
    }
    return c;
  }, [map]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(base, 0, 0, map.width, map.height, 0, 0, SIZE, SIZE);

    const span = map.width * map.cell;
    const scale = SIZE / span;
    const toX = (x: number) => (x + span / 2) * scale;
    const toY = (z: number) => (z + span / 2) * scale;

    // Bomb site tint.
    ctx.fillStyle = 'rgba(220, 70, 70, 0.13)';
    const a = map.sites.A;
    ctx.fillRect(toX(a.minX), toY(a.minZ), (a.maxX - a.minX) * scale, (a.maxZ - a.minZ) * scale);
    ctx.fillStyle = 'rgba(70, 130, 220, 0.13)';
    const b = map.sites.B;
    ctx.fillRect(toX(b.minX), toY(b.minZ), (b.maxX - b.minX) * scale, (b.maxZ - b.minZ) * scale);

    // View cone for the player.
    const self = entities.find((e) => e.self);
    if (self) {
      const px = toX(self.x);
      const py = toY(self.z);
      const fx = -Math.sin(yaw);
      const fy = -Math.cos(yaw);
      const ang = Math.atan2(fy, fx);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.arc(px, py, 26, ang - 0.5, ang + 0.5);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.fill();
    }

    for (const e of entities) {
      if (!e.visible && !e.self) continue;
      const x = toX(e.x);
      const y = toY(e.z);
      if (e.bomb) {
        ctx.fillStyle = '#ffb020';
        ctx.fillRect(x - 3, y - 3, 6, 6);
        ctx.strokeStyle = '#3a2400';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 3, y - 3, 6, 6);
        continue;
      }
      if (e.self) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#0a0a0a';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (e.team === 'CT') {
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#5b8cff';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = e.visible ? '#ff5252' : 'rgba(255,82,82,0.35)';
        ctx.fill();
      }
    }
  }, [base, entities, map, yaw]);

  return (
    <div className="minimap">
      <canvas ref={ref} width={SIZE} height={SIZE} />
    </div>
  );
}

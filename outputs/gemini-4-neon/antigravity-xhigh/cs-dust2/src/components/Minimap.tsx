import React, { useEffect, useRef } from 'react';
import { Dust2MapData } from '../game/dust2Map';
import { HudSnapshot } from '../game/types';

interface MinimapProps {
  mapData: Dust2MapData | null;
  hud: HudSnapshot;
}

const SIZE = 216;
const PAD = 10;

export const Minimap: React.FC<MinimapProps> = ({ mapData, hud }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mapData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { minX, maxX, minZ, maxZ } = mapData.bounds;
    const spanX = maxX - minX;
    const spanZ = maxZ - minZ;
    const scale = Math.min((SIZE - PAD * 2) / spanX, (SIZE - PAD * 2) / spanZ);
    const offsetX = (SIZE - spanX * scale) * 0.5;
    const offsetZ = (SIZE - spanZ * scale) * 0.5;

    const toPxX = (x: number) => offsetX + (x - minX) * scale;
    const toPxY = (z: number) => offsetZ + (z - minZ) * scale;

    // Dark tactical radar backdrop
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = 'rgba(13, 18, 24, 0.88)';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Playable sandy Dust2 compound floor
    ctx.fillStyle = '#3b352c';
    ctx.fillRect(toPxX(-43), toPxY(-39), (46 - -43) * scale, (53 - -39) * scale);

    // Render layered Dust2 geometry silhouette (elevated, tunnels, ramps, sites, doors, crates, walls)
    const drawKind = (kind: string, fill: string, stroke?: string) => {
      ctx.fillStyle = fill;
      if (stroke) ctx.strokeStyle = stroke;
      for (const r of mapData.minimapRects) {
        if (r.kind !== kind) continue;
        const x = toPxX(r.x1);
        const y = toPxY(r.z1);
        const w = Math.max(1.5, (r.x2 - r.x1) * scale);
        const h = Math.max(1.5, (r.z2 - r.z1) * scale);
        ctx.fillRect(x, y, w, h);
        if (stroke) {
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, w, h);
        }
      }
    };

    drawKind('tunnel', 'rgba(26, 24, 22, 0.82)');
    drawKind('elevated', '#554b3c');
    drawKind('ramp', '#675b48');
    drawKind('site', 'rgba(210, 56, 42, 0.34)', 'rgba(235, 86, 65, 0.85)');
    drawKind('crate', '#7a6345');
    drawKind('wall', '#191f26');
    drawKind('door', '#a97442');

    // Dust2 iconic region labels
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff6b57';
    ctx.fillText('A', toPxX(31), toPxY(-28.5));
    ctx.fillText('B', toPxX(-28), toPxY(-25.5));

    ctx.font = '600 8px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(220, 212, 195, 0.62)';
    ctx.fillText('MID', toPxX(0), toPxY(-4));
    ctx.fillText('CAT', toPxX(16.8), toPxY(-5));
    ctx.fillText('LONG', toPxX(38.5), toPxY(10));
    ctx.fillText('TUN', toPxX(-31), toPxY(10));
    ctx.fillText('CT', toPxX(7), toPxY(-33));
    ctx.fillText('T', toPxX(0), toPxY(45));

    // C4 Bomb indicator
    if (hud.bombVisibleToPlayer && hud.bombPos) {
      const bx = toPxX(hud.bombPos.x);
      const by = toPxY(hud.bombPos.z);
      const pulse = 5.5 + Math.sin(performance.now() * 0.012) * 2.2;
      if (hud.bombState === 'planted') {
        ctx.strokeStyle = 'rgba(255, 58, 48, 0.9)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(bx, by, pulse + 2, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = hud.bombState === 'planted' ? '#ff3329' : '#ffc83d';
      ctx.fillRect(bx - 3.5, by - 3.5, 7, 7);
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx - 3.5, by - 3.5, 7, 7);
    }

    // Draw all visible agents
    for (const a of hud.minimapActors) {
      if (!a.visible) continue;
      const px = toPxX(a.x);
      const py = toPxY(a.z);

      if (!a.alive) {
        // Subtle X for dead teammates
        if (a.team === hud.playerTeam) {
          ctx.strokeStyle = 'rgba(180, 190, 200, 0.45)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(px - 3, py - 3);
          ctx.lineTo(px + 3, py + 3);
          ctx.moveTo(px + 3, py - 3);
          ctx.lineTo(px - 3, py + 3);
          ctx.stroke();
        }
        continue;
      }

      if (a.isControlled) {
        // Player FOV cone (forward in world is (-sin(yaw), -cos(yaw)))
        const dirAngle = Math.atan2(-Math.cos(a.yaw), -Math.sin(a.yaw));
        ctx.fillStyle = 'rgba(110, 220, 255, 0.22)';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.arc(px, py, 24, dirAngle - 0.55, dirAngle + 0.55);
        ctx.closePath();
        ctx.fill();

        // Player arrow
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(dirAngle + Math.PI / 2);
        ctx.fillStyle = '#48f5a1';
        ctx.beginPath();
        ctx.moveTo(0, -6.5);
        ctx.lineTo(4.6, 5);
        ctx.lineTo(0, 2.5);
        ctx.lineTo(-4.6, 5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#081014';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      } else {
        const isAlly = a.team === hud.playerTeam;
        ctx.fillStyle = isAlly ? (a.team === 'CT' ? '#54b7ff' : '#f5be49') : '#ff3f3f';
        ctx.beginPath();
        ctx.arc(px, py, isAlly ? 4.2 : 4.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0b0f14';
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }
    }

    // Crisp outer radar border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0.75, 0.75, SIZE - 1.5, SIZE - 1.5);
  }, [mapData, hud]);

  return (
    <div className="minimap-shell">
      <canvas ref={canvasRef} width={SIZE} height={SIZE} className="minimap-canvas" />
      <div className="minimap-callout">
        <span className="callout-dot" />
        <span>{hud.callout}</span>
      </div>
    </div>
  );
};

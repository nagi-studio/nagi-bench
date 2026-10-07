import React, { useRef, useEffect } from 'react';
import { MinimapEntity, Team } from '../types/game';

interface MinimapProps {
  entities: MinimapEntity[];
  playerTeam: Team;
}

export const Minimap: React.FC<MinimapProps> = ({ entities, playerTeam }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Map bounds: X roughly [-85, 75], Z roughly [-95, 95]
    // Transform world coordinates (X, Z) to radar canvas coordinates (px, py)
    const worldToRadar = (x: number, z: number): [number, number] => {
      const rx = ((x + 85) / 160) * size;
      const ry = ((z + 95) / 190) * size;
      return [rx, ry];
    };

    // 1. Radar Background
    ctx.fillStyle = 'rgba(18, 24, 33, 0.85)';
    ctx.fillRect(0, 0, size, size);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    // 2. Dust2 Floor Outlines (vector pathways)
    ctx.fillStyle = 'rgba(60, 75, 90, 0.45)';
    ctx.strokeStyle = 'rgba(120, 150, 180, 0.7)';
    ctx.lineWidth = 2;

    const drawArea = (x: number, z: number, w: number, h: number) => {
      const [rx, ry] = worldToRadar(x - w / 2, z - h / 2);
      const [rw, rh] = [ (w / 160) * size, (h / 190) * size ];
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeRect(rx, ry, rw, rh);
    };

    // T Spawn
    drawArea(0, 75, 30, 25);
    // Long path & doors
    drawArea(38, 55, 20, 24);
    drawArea(50, 5, 16, 70);
    // A Site
    drawArea(40, -58, 26, 22);
    // Catwalk / Short
    drawArea(18, -25, 10, 38);
    // Mid & Mid Doors
    drawArea(0, 20, 16, 50);
    drawArea(0, -28, 12, 10);
    drawArea(0, -50, 20, 30);
    // B Tunnels
    drawArea(-38, 40, 24, 45);
    // B Site
    drawArea(-62, -35, 28, 30);
    // CT Spawn
    drawArea(22, -80, 26, 20);

    // Site Labels "A" and "B"
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const [siteAx, siteAy] = worldToRadar(40, -58);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('A', siteAx, siteAy);

    const [siteBx, siteBy] = worldToRadar(-62, -35);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('B', siteBx, siteBy);

    // 3. Render Entities (Player, Teammates, Spotted Enemies, C4)
    entities.forEach((entity) => {
      if (!entity.isAlive) return;

      const [ex, ey] = worldToRadar(entity.position.x, entity.position.z);
      const isTeammate = entity.team === playerTeam;

      if (!isTeammate && !entity.isSpotted) {
        return; // Unspotted enemies stay hidden on radar
      }

      ctx.save();
      ctx.translate(ex, ey);

      if (entity.isPlayer) {
        // Player: Bright cyan dot with facing vision cone
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // Vision FOV cone
        ctx.rotate(entity.rotationY);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 18, -Math.PI / 4 + Math.PI / 2, Math.PI / 4 + Math.PI / 2);
        ctx.closePath();
        ctx.fill();
      } else if (isTeammate) {
        // Teammates: Blue (CT) or Gold (T) dot with heading tick
        ctx.fillStyle = playerTeam === 'CT' ? '#3b82f6' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Heading arrow
        ctx.rotate(entity.rotationY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 7);
        ctx.stroke();
      } else {
        // Enemy: Red dot with alert pulse ring
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // C4 Carrier Indicator on dot
      if (entity.hasC4) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-2, -2, 4, 4);
      }

      ctx.restore();
    });

    // Radar border & label
    ctx.strokeStyle = 'rgba(100, 130, 160, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
  }, [entities, playerTeam]);

  return (
    <div style={{
      position: 'absolute',
      top: 16,
      left: 16,
      width: 170,
      height: 170,
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
      pointerEvents: 'none',
    }}>
      <canvas ref={canvasRef} width={170} height={170} />
      <div style={{
        position: 'absolute',
        bottom: 4,
        right: 6,
        fontSize: '10px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        color: 'rgba(255, 255, 255, 0.5)',
      }}>
        DUST II
      </div>
    </div>
  );
};

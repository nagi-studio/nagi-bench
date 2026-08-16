import React, { useRef, useEffect } from 'react';
import { BotEntity } from '../../engine/ai/BotAI';

interface MinimapProps {
  players: BotEntity[];
  playerEntity: BotEntity | null;
  c4: {
    isPlanted: boolean;
    isDropped: boolean;
    position: { x: number; y: number; z: number } | null;
    plantedSite: 'A' | 'B' | null;
  };
}

export const Minimap: React.FC<MinimapProps> = ({ players, playerEntity, c4 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // World coordinates bounds: X: -55 to 60 (span 115), Z: -55 to 60 (span 115)
    const worldToMap = (wx: number, wz: number) => {
      const padding = 15;
      const mapW = width - padding * 2;
      const mapH = height - padding * 2;

      // In world coords: +Z is south, -Z is north; +X is east, -X is west
      const normX = (wx - (-55)) / 115;
      const normY = (wz - (-55)) / 115;

      return {
        x: padding + normX * mapW,
        y: padding + normY * mapH
      };
    };

    // 1. CLEAR & RADAR BACKGROUND
    ctx.clearRect(0, 0, width, height);

    // Dark tactical radar background
    ctx.fillStyle = 'rgba(12, 18, 24, 0.85)';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Radar border
    ctx.strokeStyle = 'rgba(70, 100, 120, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Concentric range rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach(r => {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, (width / 2 - 2) * r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 2. DRAW DUST2 PROCEDURAL 2D SCHEMATIC
    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(180, 160, 130, 0.5)';
    ctx.fillStyle = 'rgba(150, 130, 100, 0.18)';

    // Helper to draw a polygonal sector
    const drawSector = (pts: [number, number][], fill: boolean = true) => {
      ctx.beginPath();
      const first = worldToMap(pts[0][0], pts[0][1]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < pts.length; i++) {
        const p = worldToMap(pts[i][0], pts[i][1]);
        ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      if (fill) ctx.fill();
      ctx.stroke();
    };

    // T Spawn Area
    drawSector([[-30, 38], [10, 38], [10, 56], [-30, 56]]);

    // Long A Route & Long Doors
    drawSector([[32, 40], [42, 40], [42, 20], [32, 20]]); // Long Doors
    drawSector([[36, 20], [54, 20], [54, -10], [36, -10]]); // Long Alley & Pit
    drawSector([[34, -10], [44, -10], [34, -22], [24, -22]]); // Long Ramp to A

    // Bombsite A
    drawSector([[16, -18], [36, -18], [36, -36], [16, -36]]);

    // Catwalk & Short A
    drawSector([[8, 16], [14, 16], [14, -14], [8, -14]]);
    drawSector([[14, -10], [24, -10], [24, -18], [14, -18]]);

    // Mid & Mid Doors
    drawSector([[-8, 30], [8, 30], [8, -15], [-8, -15]]);

    // B Tunnels (Upper & Lower)
    drawSector([[-18, 18], [-8, 18], [-26, 4], [-36, 4]]); // Lower B
    drawSector([[-45, 18], [-32, 18], [-32, -16], [-45, -16]]); // Upper B

    // Bombsite B
    drawSector([[-48, -16], [-18, -16], [-18, -44], [-48, -44]]);

    // CT Spawn
    drawSector([[-5, -36], [22, -36], [22, -48], [-5, -48]]);

    ctx.restore();

    // 3. BOMBSITE LABELS (A and B)
    const posA = worldToMap(25, -27);
    const posB = worldToMap(-30, -30);

    ctx.save();
    ctx.font = 'bold 14px "Rajdhani", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Site A
    ctx.fillStyle = '#ff4433';
    ctx.beginPath();
    ctx.arc(posA.x, posA.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('A', posA.x, posA.y + 1);

    // Site B
    ctx.fillStyle = '#ff4433';
    ctx.beginPath();
    ctx.arc(posB.x, posB.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('B', posB.x, posB.y + 1);
    ctx.restore();

    // 4. DRAW PLAYERS & TEAMMATES
    const pTeam = playerEntity ? playerEntity.team : 'CT';

    players.forEach(p => {
      if (p.health <= 0) return; // Don't draw alive dot for dead

      const mPos = worldToMap(p.position.x, p.position.z);
      const isSelf = playerEntity && p.id === playerEntity.id;
      const isTeammate = p.team === pTeam;

      if (isSelf) {
        // Player Vision FOV Cone
        ctx.save();
        ctx.fillStyle = 'rgba(255, 220, 50, 0.25)';
        ctx.beginPath();
        ctx.moveTo(mPos.x, mPos.y);
        const lookAngle = p.rotationY - Math.PI / 2;
        ctx.arc(mPos.x, mPos.y, 28, lookAngle - 0.5, lookAngle + 0.5);
        ctx.closePath();
        ctx.fill();

        // Player Icon (Bright yellow arrow)
        ctx.fillStyle = '#ffe033';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mPos.x, mPos.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      } else if (isTeammate) {
        // Teammates (Always visible: Blue for CT, Yellow-Orange for T)
        ctx.fillStyle = p.team === 'CT' ? '#44aaff' : '#ffaa33';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mPos.x, mPos.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // Enemies (Only visible if spotted / in combat)
        ctx.fillStyle = '#ff2222';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mPos.x, mPos.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });

    // 5. DRAW C4 BOMB
    if (c4.position) {
      const cPos = worldToMap(c4.position.x, c4.position.z);
      ctx.save();
      const pulse = (Math.sin(Date.now() * 0.008) + 1) / 2;
      ctx.fillStyle = c4.isPlanted ? `rgba(255, 0, 0, ${0.6 + pulse * 0.4})` : '#ff9900';
      ctx.beginPath();
      ctx.arc(cPos.x, cPos.y, 6 + pulse * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('C4', cPos.x, cPos.y);
      ctx.restore();
    }
  }, [players, playerEntity, c4]);

  return (
    <div className="relative rounded-full overflow-hidden border-2 border-slate-700/80 shadow-2xl shadow-black/80 bg-slate-950/80 backdrop-blur-sm pointer-events-none">
      <canvas ref={canvasRef} width={200} height={200} className="w-[180px] h-[180px] md:w-[200px] md:h-[200px]" />
      <div className="absolute top-2 left-2 text-[10px] tracking-widest font-mono text-slate-400 uppercase">
        DUST II
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';

interface Props {
  engine: GameEngine;
}

export const Minimap: React.FC<Props> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Minimap world coordinates mapping (World size -70 to 70 mapped to 0 to 180px)
    const mapSize = 180;
    const worldSize = 140; // -70 to 70

    const worldToMinimap = (wx: number, wz: number) => {
      const mx = ((wx + 70) / worldSize) * mapSize;
      const my = ((wz + 70) / worldSize) * mapSize;
      return { x: mx, y: my };
    };

    ctx.clearRect(0, 0, mapSize, mapSize);

    // 1. Map Outline / Background
    ctx.fillStyle = 'rgba(15, 20, 28, 0.85)';
    ctx.fillRect(0, 0, mapSize, mapSize);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, mapSize, mapSize);

    // Dust2 Key Corridors Outline
    ctx.fillStyle = 'rgba(200, 180, 140, 0.25)';

    // Long A
    const p1 = worldToMinimap(30, 50);
    const p2 = worldToMinimap(55, -25);
    ctx.fillRect(p1.x, p2.y, p2.x - p1.x, p1.y - p2.y);

    // Mid
    const m1 = worldToMinimap(-10, 45);
    const m2 = worldToMinimap(10, -30);
    ctx.fillRect(m1.x, m2.y, m2.x - m1.x, m1.y - m2.y);

    // B Site & Tunnels
    const b1 = worldToMinimap(-55, 45);
    const b2 = worldToMinimap(-25, -35);
    ctx.fillRect(b1.x, b2.y, b2.x - b1.x, b1.y - b2.y);

    // A & B Plant Zone indicators
    ctx.fillStyle = 'rgba(255, 200, 50, 0.4)';
    const siteA = worldToMinimap(40, -15);
    ctx.beginPath();
    ctx.arc(siteA.x, siteA.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('A', siteA.x - 3, siteA.y + 3);

    ctx.fillStyle = 'rgba(255, 200, 50, 0.4)';
    const siteB = worldToMinimap(-40, -25);
    ctx.beginPath();
    ctx.arc(siteB.x, siteB.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('B', siteB.x - 3, siteB.y + 3);

    // 2. Draw Characters
    const spectatedChar = engine.allCharacters.find(c => c.id === engine.spectatedCharacterId) || engine.player;

    for (const char of engine.allCharacters) {
      if (char.isDead) continue;

      const pos = worldToMinimap(char.position.x, char.position.z);
      const isSelf = char.id === spectatedChar.id;
      const isTeammate = char.team === spectatedChar.team;

      if (isSelf) {
        // Self Icon with view cone
        ctx.fillStyle = '#50e3c2';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // View Frustum cone
        ctx.fillStyle = 'rgba(80, 227, 194, 0.2)';
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        const yaw = char.yaw;
        ctx.arc(pos.x, pos.y, 24, yaw - Math.PI / 2 - 0.4, yaw - Math.PI / 2 + 0.4);
        ctx.closePath();
        ctx.fill();
      } else if (isTeammate) {
        // Teammates green dot
        ctx.fillStyle = '#4ae340';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Enemies red dot (if visible or spectating)
        ctx.fillStyle = '#ff4a4a';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Draw C4 position if dropped or planted
    if (engine.c4State.isDropped || engine.c4State.isPlanted) {
      const c4Pos = worldToMinimap(engine.c4State.position.x, engine.c4State.position.z);
      ctx.fillStyle = '#ff9500';
      ctx.beginPath();
      ctx.arc(c4Pos.x, c4Pos.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [engine, engine.allCharacters, engine.c4State]);

  return (
    <div style={{ position: 'absolute', top: 20, left: 20, border: '2px solid rgba(255,255,255,0.2)', borderRadius: '6px', overflow: 'hidden', pointerEvents: 'none' }}>
      <canvas ref={canvasRef} width={180} height={180} />
    </div>
  );
};

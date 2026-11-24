import React, { useEffect, useRef } from 'react';
import { MAP_BOUNDS } from '../game/config';
import { Dust2MapData } from '../game/map/dust2Data';
import { MinimapAgent, MinimapBomb, Team } from '../game/types';

interface MinimapProps {
  mapData: Dust2MapData;
  agents: MinimapAgent[];
  bomb: MinimapBomb;
  playerTeam: Team;
  callout: string;
}

const SIZE = 204;

function worldToCanvas(x: number, z: number): [number, number] {
  const nx = (x - MAP_BOUNDS.MIN_X) / (MAP_BOUNDS.MAX_X - MAP_BOUNDS.MIN_X);
  const nz = (z - MAP_BOUNDS.MIN_Z) / (MAP_BOUNDS.MAX_Z - MAP_BOUNDS.MIN_Z);
  return [nx * SIZE, nz * SIZE];
}

export const Minimap: React.FC<MinimapProps> = ({
  mapData,
  agents,
  bomb,
  playerTeam,
  callout,
}) => {
  const staticCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dynamicCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pre-render static Dust2 floorplan silhouette once
  useEffect(() => {
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // Dark tactical radar backdrop
    ctx.fillStyle = 'rgba(13, 18, 26, 0.92)';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Subtle radar grid
    ctx.strokeStyle = 'rgba(120, 160, 200, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= SIZE; i += 34) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(SIZE, i);
      ctx.stroke();
    }

    // 1. Walkable floors & ramps
    for (const b of mapData.boxes) {
      if (b.radarType !== 'floor') continue;
      const [x1, z1] = worldToCanvas(b.x1, b.z1);
      const [x2, z2] = worldToCanvas(b.x2, b.z2);
      const elevShade = Math.round(b.y2 * 10);
      ctx.fillStyle = `rgb(${56 + elevShade}, ${66 + elevShade}, ${76 + elevShade})`;
      ctx.fillRect(x1, z1, x2 - x1, z2 - z1);
    }
    for (const r of mapData.ramps) {
      const [x1, z1] = worldToCanvas(r.x1, r.z1);
      const [x2, z2] = worldToCanvas(r.x2, r.z2);
      ctx.fillStyle = '#4c5966';
      ctx.fillRect(x1, z1, x2 - x1, z2 - z1);
    }

    // 2. Crates & doors
    for (const b of mapData.boxes) {
      if (b.radarType === 'crate') {
        const [x1, z1] = worldToCanvas(b.x1, b.z1);
        const [x2, z2] = worldToCanvas(b.x2, b.z2);
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(x1, z1, Math.max(2, x2 - x1), Math.max(2, z2 - z1));
      } else if (b.radarType === 'door') {
        const [x1, z1] = worldToCanvas(b.x1, b.z1);
        const [x2, z2] = worldToCanvas(b.x2, b.z2);
        ctx.fillStyle = '#d49a52';
        ctx.fillRect(x1, z1, Math.max(2, x2 - x1), Math.max(2, z2 - z1));
      }
    }

    // 3. Solid wall outlines
    for (const b of mapData.boxes) {
      if (b.radarType !== 'wall') continue;
      const [x1, z1] = worldToCanvas(b.x1, b.z1);
      const [x2, z2] = worldToCanvas(b.x2, b.z2);
      ctx.fillStyle = 'rgba(20, 26, 36, 0.92)';
      ctx.fillRect(x1, z1, x2 - x1, z2 - z1);
      ctx.strokeStyle = 'rgba(165, 185, 210, 0.24)';
      ctx.lineWidth = 0.7;
      ctx.strokeRect(x1, z1, x2 - x1, z2 - z1);
    }

    // 4. Plant zones A & B highlights
    for (const pz of mapData.plantZones) {
      const [x1, z1] = worldToCanvas(pz.x1, pz.z1);
      const [x2, z2] = worldToCanvas(pz.x2, pz.z2);
      ctx.fillStyle = 'rgba(230, 72, 54, 0.22)';
      ctx.fillRect(x1, z1, x2 - x1, z2 - z1);
      ctx.strokeStyle = 'rgba(235, 90, 70, 0.7)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x1, z1, x2 - x1, z2 - z1);

      ctx.fillStyle = '#ff6b57';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pz.site ?? '', (x1 + x2) / 2, (z1 + z2) / 2);
    }

    // Subtle landmark labels
    ctx.fillStyle = 'rgba(220, 232, 245, 0.45)';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    const [mx, mz] = worldToCanvas(-2, -18);
    ctx.fillText('MID', mx, mz);
    const [cx, cz] = worldToCanvas(11, -38);
    ctx.fillText('CT', cx, cz);
    const [tx, tz] = worldToCanvas(0, 41);
    ctx.fillText('T', tx, tz);
    const [catx, catz] = worldToCanvas(13, -27);
    ctx.fillText('CAT', catx, catz);
    const [lx, lz] = worldToCanvas(39, -3);
    ctx.fillText('LONG', lx, lz);
    const [btX, btZ] = worldToCanvas(-36, 12);
    ctx.fillText('B-TUN', btX, btZ);
  }, [mapData]);

  // Render dynamic entities (player, teammates, spotted enemies, C4)
  useEffect(() => {
    const canvas = dynamicCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // Draw C4 bomb icon if visible
    if (bomb.visible && bomb.state !== 'defused' && bomb.state !== 'exploded') {
      const [bx, bz] = worldToCanvas(bomb.x, bomb.z);
      const pulse = bomb.state === 'planted' ? 0.5 + 0.5 * Math.sin(performance.now() * 0.014) : 1;
      if (bomb.state === 'planted') {
        ctx.beginPath();
        ctx.arc(bx, bz, 6 + pulse * 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 58, 48, ${0.85 - pulse * 0.45})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = bomb.state === 'planted' ? '#ff3326' : '#f5b942';
      ctx.fillRect(bx - 4, bz - 4, 8, 8);
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx - 4, bz - 4, 8, 8);
    }

    // Draw agents
    for (const a of agents) {
      if (!a.alive) continue;
      const isFriendly = a.team === playerTeam;
      if (!isFriendly && (!a.spotted || a.lastSpottedAlpha <= 0.02)) continue;

      const [ax, az] = worldToCanvas(a.x, a.z);
      // Forward vector in world XZ is (-sin(yaw), -cos(yaw)) -> canvas angle
      const dirX = -Math.sin(a.yaw);
      const dirZ = -Math.cos(a.yaw);
      const angle = Math.atan2(dirZ, dirX);

      // Draw FOV sight cone for player / spectated unit
      if (a.isPlayer || a.isSpectated) {
        ctx.save();
        ctx.translate(ax, az);
        ctx.rotate(angle);
        const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 28);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.34)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 28, -0.58, 0.58);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Draw agent marker
      ctx.save();
      ctx.globalAlpha = isFriendly ? 1 : a.lastSpottedAlpha;
      ctx.translate(ax, az);

      if (a.isPlayer || a.isSpectated) {
        // Player arrow marker
        ctx.rotate(angle);
        ctx.fillStyle = '#47ff8d';
        ctx.beginPath();
        ctx.moveTo(6.5, 0);
        ctx.lineTo(-4.5, -4.5);
        ctx.lineTo(-2.5, 0);
        ctx.lineTo(-4.5, 4.5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#0a1410';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      } else if (isFriendly) {
        // Teammate dot + heading tick
        ctx.fillStyle = playerTeam === 'CT' ? '#5cb8ff' : '#f2b84b';
        ctx.beginPath();
        ctx.arc(0, 0, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0d1520';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.rotate(angle);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(2, 0);
        ctx.lineTo(6, 0);
        ctx.stroke();
      } else {
        // Spotted enemy red diamond
        ctx.fillStyle = '#ff3b30';
        ctx.beginPath();
        ctx.moveTo(0, -4.5);
        ctx.lineTo(4.5, 0);
        ctx.lineTo(0, 4.5);
        ctx.lineTo(-4.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1f0808';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    }
  }, [agents, bomb, playerTeam]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 14,
        left: 14,
        width: SIZE + 8,
        background: 'rgba(10, 14, 22, 0.84)',
        border: '1px solid rgba(255,255,255,0.16)',
        borderRadius: 6,
        padding: 4,
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <div style={{ position: 'relative', width: SIZE, height: SIZE, overflow: 'hidden', borderRadius: 3 }}>
        <canvas
          ref={staticCanvasRef}
          width={SIZE}
          height={SIZE}
          style={{ position: 'absolute', inset: 0 }}
        />
        <canvas
          ref={dynamicCanvasRef}
          width={SIZE}
          height={SIZE}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>
      <div
        style={{
          marginTop: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          fontWeight: 600,
          color: '#d9e4f0',
          padding: '0 4px',
          letterSpacing: '0.02em',
        }}
      >
        <span style={{ color: '#f5b942' }}>DUST2</span>
        <span style={{ opacity: 0.9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 145 }}>
          {callout}
        </span>
      </div>
    </div>
  );
};
